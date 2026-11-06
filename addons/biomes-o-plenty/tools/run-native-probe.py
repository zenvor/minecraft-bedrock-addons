import json
import os
from pathlib import Path
import re
import select
import signal
import subprocess
import sys
import time

root = Path(__file__).resolve().parent
if not root.name.startswith("bop-native-") or root == Path("/opt/minecraft-bedrock"):
    raise SystemExit("refusing non-isolated directory")
production_pid = int(sys.argv[1])
requested_stop = None


def host_available():
    for line in Path("/proc/meminfo").read_text().splitlines():
        if line.startswith("MemAvailable:"):
            return int(line.split()[1]) * 1024
    raise RuntimeError("MemAvailable unavailable")


def process_status(pid):
    result = {}
    try:
        for line in Path(f"/proc/{pid}/status").read_text().splitlines():
            if line.startswith(("VmRSS:", "VmHWM:", "Threads:")):
                name, value = line.split(":", 1)
                result[name] = value.strip()
        fields = Path(f"/proc/{pid}/stat").read_text().split()
        result["cpu_ticks"] = int(fields[13]) + int(fields[14])
    except FileNotFoundError:
        result["exited"] = True
    return result


def on_signal(number, frame):
    global requested_stop
    requested_stop = f"signal-{number}"


signal.signal(signal.SIGTERM, on_signal)
signal.signal(signal.SIGINT, on_signal)
if host_available() < 768 * 1024 * 1024:
    raise SystemExit("insufficient host reserve before launch")
relative_cgroup = next(line.split("::", 1)[1] for line in Path("/proc/self/cgroup").read_text().splitlines() if line.startswith("0::"))
cgroup = Path("/sys/fs/cgroup") / relative_cgroup.lstrip("/")
host_netns = (root / "host-netns.txt").read_text().strip()
test_netns = os.readlink("/proc/self/ns/net")
if host_netns == test_netns:
    raise SystemExit("network namespace is not isolated")
environment = dict(os.environ, LD_LIBRARY_PATH=str(root))
command = [str(root / "bedrock_server")]
if os.environ.get("BOP_PROBE_TRACE") == "1":
    command = ["/usr/bin/strace", "-f", "-e", "trace=file", "-o", str(root / "file-access.trace")] + command
process = subprocess.Popen(command, cwd=root, env=environment, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=0)
assert process.pid != production_pid
started = time.monotonic()
reason = None
stop_at = None
buffer = b""
complete = False
server_started = False
last_sample = 0.0
minimum_available = host_available()
raw = (root / "bds.log").open("wb")
events = (root / "probe-events.jsonl").open("w")
resources = (root / "resources.jsonl").open("w")
metadata = {"test_pid": process.pid, "production_pid": production_pid, "started_unix": time.time(), "host_netns": host_netns, "test_netns": test_netns, "cgroup": str(cgroup), "runtime_sha256_record": "runtime.sha256", "memory_max": (cgroup / "memory.max").read_text().strip(), "cpu_max": (cgroup / "cpu.max").read_text().strip()}
(root / "run-metadata.json").write_text(json.dumps(metadata, indent=2))
if metadata["test_netns"] == metadata["host_netns"]:
    requested_stop = "network-namespace-not-isolated"


def consume(chunk):
    global buffer, reason, complete, server_started
    raw.write(chunk)
    raw.flush()
    buffer += chunk
    while b"\n" in buffer:
        line, buffer = buffer.split(b"\n", 1)
        text = line.decode("utf-8", errors="replace")
        if "Server started." in text:
            server_started = True
        if "[Scripting]" in text and " ERROR]" in text:
            reason = "script-load-error"
        if "Version:" in text and not re.search(r"Version:\s*1\.26\.61\.0?1\b", text):
            reason = "unexpected-bds-version"
        if "[BOPBENCH] " in text:
            payload = text.split("[BOPBENCH] ", 1)[1].strip()
            try:
                event = json.loads(payload)
            except json.JSONDecodeError:
                continue
            events.write(json.dumps(event) + "\n")
            events.flush()
            if event.get("event") == "complete":
                complete = True
                reason = "complete"
            elif event.get("event") == "fatal":
                reason = "probe-fatal"


try:
    while process.poll() is None:
        now = time.monotonic()
        ready, _, _ = select.select([process.stdout], [], [], 0.25)
        if ready:
            chunk = os.read(process.stdout.fileno(), 65536)
            if chunk:
                consume(chunk)
        if now - last_sample >= 1:
            available = host_available()
            minimum_available = min(minimum_available, available)
            sample = {"unix": time.time(), "elapsed_s": now - started, "host_available_bytes": available, "test": process_status(process.pid), "production": process_status(production_pid)}
            for name in ["memory.current", "memory.peak", "memory.events", "cpu.stat", "memory.pressure"]:
                path = cgroup / name
                if path.exists():
                    sample[name] = path.read_text().strip()
            resources.write(json.dumps(sample) + "\n")
            resources.flush()
            last_sample = now
            if available < 384 * 1024 * 1024:
                reason = "host-memory-reserve-below-384MiB"
            if sample["production"].get("exited"):
                reason = "production-pid-no-longer-present"
        if requested_stop:
            reason = requested_stop
        if now - started > 420:
            reason = "runtime-limit"
        if not server_started and now - started > 150:
            reason = "startup-limit"
        if reason and stop_at is None:
            process.stdin.write(b"stop\n")
            process.stdin.flush()
            stop_at = now
        if stop_at is not None and now - stop_at > 40:
            process.terminate()
        if stop_at is not None and now - stop_at > 45:
            process.kill()
    while True:
        chunk = os.read(process.stdout.fileno(), 65536)
        if not chunk:
            break
        consume(chunk)
finally:
    if process.poll() is None:
        process.kill()
    return_code = process.wait(timeout=5)
    final = {**metadata, "reason": reason or "process-exited", "complete": complete, "server_started": server_started, "return_code": return_code, "elapsed_s": time.monotonic() - started, "host_min_available_bytes": minimum_available, "production_after": process_status(production_pid)}
    for name in ["memory.peak", "memory.events", "cpu.stat"]:
        path = cgroup / name
        if path.exists():
            final[name] = path.read_text().strip()
    (root / "run-result.json").write_text(json.dumps(final, indent=2))
    raw.close()
    events.close()
    resources.close()
print(json.dumps(final))
raise SystemExit(0 if complete and return_code == 0 else 1)

import array
import fcntl
import json
import os
from pathlib import Path
import select
import subprocess
import termios
import time


ROOT = Path(__file__).resolve().parent
CONFIG = json.loads((ROOT / 'run-config.json').read_text())
RUN_ROOT = Path(CONFIG['run_root']).resolve()
assert str(RUN_ROOT).startswith('/var/tmp/bds-addon-probe-')
assert ROOT.is_relative_to(RUN_ROOT) and ROOT != RUN_ROOT
assert not ROOT.is_relative_to(Path(CONFIG['production_root']).resolve())
assert (RUN_ROOT / 'owner.json').is_file()
CGROUP = Path('/sys/fs/cgroup') / next(line.split('::', 1)[1] for line in Path('/proc/self/cgroup').read_text().splitlines() if line.startswith('0::')).lstrip('/')


def available():
    return int(next(line.split()[1] for line in Path('/proc/meminfo').read_text().splitlines() if line.startswith('MemAvailable:'))) * 1024


def status(pid):
    try:
        fields = {}
        for line in Path(f'/proc/{pid}/status').read_text().splitlines():
            if line.startswith(('State:', 'VmRSS:', 'VmHWM:', 'Threads:')):
                name, value = line.split(':', 1)
                fields[name] = value.strip()
        stat = Path(f'/proc/{pid}/stat').read_text().split()
        fields['cpu_ticks'] = int(stat[13]) + int(stat[14])
        return fields
    except FileNotFoundError:
        return {'exited': True}


def pending(fd):
    count = array.array('i', [0])
    fcntl.ioctl(fd, termios.FIONREAD, count, True)
    return count[0]


hard_limit = int((CGROUP / 'memory.max').read_text())
assert available() >= hard_limit + CONFIG['reserve_bytes'] + 16 * 1024**2
assert (CGROUP / 'memory.high').read_text().strip() == str(hard_limit)
assert os.readlink('/proc/self/ns/net') != CONFIG['host_netns']
assert all(Path(f'/proc/{pid}').exists() for pid in CONFIG['protected_pids'])
assert __import__('shutil').disk_usage(ROOT).free >= 2 * 1024**3
process = subprocess.Popen([str(ROOT / 'bedrock_server')], cwd=ROOT, env=dict(os.environ, LD_LIBRARY_PATH=str(ROOT)), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=0)
assert process.pid not in CONFIG['protected_pids']
started = time.monotonic()
metadata = {'pid': process.pid, 'started_unix': time.time(), 'protected_pids': CONFIG['protected_pids'], 'test_netns': os.readlink('/proc/self/ns/net'), 'host_netns': CONFIG['host_netns'], 'cgroup': str(CGROUP), 'memory_max': hard_limit, 'memory_high': (CGROUP / 'memory.high').read_text().strip(), 'cpu_max': (CGROUP / 'cpu.max').read_text().strip()}
(ROOT / 'metadata.json').write_text(json.dumps(metadata, indent=2))
buffer = b''
last_sample = 0
stop_at = None
terminated = False
reason = None
complete = None
server_started = False
target_errors = 0
script_errors = []
raw = (ROOT / 'bds.log').open('wb')
events = (ROOT / 'events.jsonl').open('w')
resources = (ROOT / 'resources.jsonl').open('w')


def event(value):
    events.write(json.dumps({'elapsed_s': time.monotonic() - started, **value}) + '\n')
    events.flush()


def consume(data):
    global buffer, complete, reason, server_started, target_errors
    raw.write(data)
    raw.flush()
    buffer += data
    while b'\n' in buffer:
        line, buffer = buffer.split(b'\n', 1)
        text = line.decode(errors='replace')
        if 'Server started.' in text:
            server_started = True
        if CONFIG.get('target_error') and CONFIG['target_error'] in text:
            target_errors += 1
        if '[Watchdog]' in text or (' ERROR]' in text and '[Scripting]' in text):
            script_errors.append(text)
            reason = 'scripting-error'
        if '[BDS_PROBE] ' in text:
            value = json.loads(text.split('[BDS_PROBE] ', 1)[1].strip())
            event(value)
            if value.get('event') == 'complete':
                complete = value
                reason = reason or 'complete'
            elif value.get('event') == 'fatal':
                reason = 'probe-fatal'


try:
    while process.poll() is None:
        now = time.monotonic()
        if select.select([process.stdout], [], [], 0.1)[0]:
            data = os.read(process.stdout.fileno(), 65536)
            if data:
                consume(data)
        if now - last_sample >= 0.5:
            sample = {'elapsed_s': now - started, 'unix': time.time(), 'available': available(), 'test': status(process.pid), 'protected': {str(pid): status(pid) for pid in CONFIG['protected_pids']}, 'stdin_pending': pending(process.stdin.fileno()), 'stdout_pending': pending(process.stdout.fileno())}
            sample.update({name: (CGROUP / name).read_text().strip() for name in ['memory.current', 'memory.events', 'memory.pressure', 'cpu.stat']})
            resources.write(json.dumps(sample) + '\n')
            resources.flush()
            last_sample = now
            if sample['available'] < CONFIG['reserve_bytes']:
                reason = 'host-reserve-low'
            if any(value.get('exited') for value in sample['protected'].values()):
                reason = 'protected-process-missing'
        if now - started > 150:
            reason = 'runtime-limit'
        if reason and stop_at is None:
            if CONFIG.get('shutdown_mode') == 'terminate' and reason == 'complete':
                stop_at = time.monotonic()
                event({'event': 'planned-disposable-test-termination', 'reason': reason})
                process.terminate()
                terminated = True
                continue
            before = pending(process.stdin.fileno())
            count = process.stdin.write(b'stop\n')
            process.stdin.flush()
            stop_at = time.monotonic()
            event({'event': 'stop-sent', 'reason': reason, 'bytes_written': count, 'flush_completed': True, 'stdin_pending_before': before, 'stdin_pending_after': pending(process.stdin.fileno())})
        grace = 2 if reason in ['host-reserve-low', 'protected-process-missing'] else 20
        if stop_at is not None and now - stop_at > grace and not terminated:
            process.terminate()
            terminated = True
            event({'event': 'terminate-test-only'})
        if stop_at is not None and now - stop_at > grace + 5:
            process.kill()
    while True:
        data = os.read(process.stdout.fileno(), 65536)
        if not data:
            break
        consume(data)
finally:
    if process.poll() is None:
        process.kill()
    code = process.wait(timeout=5)
    planned = CONFIG.get('shutdown_mode') == 'terminate' and reason == 'complete' and terminated
    result = {**metadata, 'reason': reason, 'return_code': code, 'planned_disposable_termination': planned, 'server_started': server_started, 'complete': complete, 'target_errors': target_errors, 'script_errors': script_errors, 'terminated': terminated, 'elapsed_s': time.monotonic() - started, 'stop_elapsed_s': None if stop_at is None else time.monotonic() - stop_at, 'protected_after': {str(pid): status(pid) for pid in CONFIG['protected_pids']}}
    result.update({name: (CGROUP / name).read_text().strip() for name in ['memory.events', 'cpu.stat']})
    (ROOT / 'result.json').write_text(json.dumps(result, indent=2))
    raw.close()
    events.close()
    resources.close()
print(json.dumps(result))
raise SystemExit(0 if complete and reason == 'complete' and (code == 0 or (planned and code == -15)) and not script_errors else 1)

import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import sys
import zipfile


RUN_ROOT = Path(__file__).resolve().parents[1]
assert str(RUN_ROOT).startswith("/var/tmp/bds-addon-probe-")
owner = json.loads((RUN_ROOT / "owner.json").read_text())
scenario = sys.argv[1]
assert scenario in owner["scenarios"]
root = RUN_ROOT / "cases" / scenario
root.mkdir(parents=True, exist_ok=False)
production = Path("/opt/minecraft-bedrock")

for name in ["bedrock_server", "definitions", "data", "treatments", "minecraftpe"]:
    source = production / name
    assert source.exists()
    (root / name).symlink_to(source, target_is_directory=source.is_dir())
for source in production.glob("*.so*"):
    (root / source.name).symlink_to(source)
for category in ["behavior_packs", "resource_packs"]:
    (root / category).mkdir()
    for source in (production / category).iterdir():
        if source.name.startswith("vanilla") or source.name in [
            "server_library",
            "server_ui_library",
            "server_editor_library",
        ]:
            (root / category / source.name).symlink_to(
                source, target_is_directory=True
            )

package = RUN_ROOT / "inputs" / f"mowzie-{scenario}-instrumented.mcaddon"
expected = owner["scenarios"][scenario]
assert hashlib.sha256(package.read_bytes()).hexdigest() == expected["packageSha256"]
world_refs = {"behavior_packs": [], "resource_packs": []}
with zipfile.ZipFile(package) as outer:
    assert outer.testzip() is None and len(outer.namelist()) == 2
    for outer_name in outer.namelist():
        with zipfile.ZipFile(io.BytesIO(outer.read(outer_name))) as inner:
            assert inner.testzip() is None
            files = [item for item in inner.infolist() if not item.is_dir()]
            manifest = json.loads(inner.read("manifest.json"))
            category = (
                "behavior_packs"
                if any(module["type"] == "data" for module in manifest["modules"])
                else "resource_packs"
            )
            destination = root / category / "mowzie"
            destination.mkdir()
            for item in files:
                path = PurePosixPath(item.filename)
                assert not path.is_absolute() and ".." not in path.parts
                target = destination / str(path)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(inner.read(item))
            world_refs[category].append(
                {
                    "pack_id": manifest["header"]["uuid"],
                    "version": manifest["header"]["version"],
                }
            )
            if category == "behavior_packs":
                main_hash = hashlib.sha256(
                    (destination / "scripts/main.js").read_bytes()
                ).hexdigest()
                assert main_hash == expected["instrumentedScriptSha256"]

world = root / "worlds" / "mowzie-probe"
world.mkdir(parents=True)
for category, values in world_refs.items():
    (world / ("world_" + category + ".json")).write_text(json.dumps(values))
for name in ["runner.py", "guard.py"]:
    shutil.copy2(RUN_ROOT / "tools" / name, root / name)
(root / "config/default").mkdir(parents=True)
(root / "config/default/permissions.json").write_text(
    json.dumps(
        {"allowed_modules": ["@minecraft/server", "@minecraft/server-ui"]}
    )
)
(root / "permissions.json").write_text("[]")
(root / "allowlist.json").write_text("[]")
properties = {
    "server-name": "Disposable Mowzie addon probe",
    "gamemode": "creative",
    "difficulty": "normal",
    "allow-cheats": "true",
    "online-mode": "false",
    "allow-list": "false",
    "max-players": "1",
    "server-port": "19186",
    "server-portv6": "19187",
    "enable-lan-visibility": "false",
    "transport": "nethernet",
    "view-distance": "5",
    "tick-distance": "4",
    "max-threads": "2",
    "level-name": "mowzie-probe",
    "level-seed": "127013",
    "level-type": "FLAT",
    "content-log-console-output-enabled": "true",
    "content-log-file-enabled": "false",
    "emit-server-telemetry": "false",
    "client-side-chunk-generation-enabled": "false",
}
(root / "server.properties").write_text(
    "".join(name + "=" + value + "\n" for name, value in properties.items())
)
current = [
    int(
        subprocess.check_output(
            ["systemctl", "show", name, "-p", "MainPID", "--value"],
            text=True,
        )
    )
    for name in ["minecraft-bedrock.service", "bedrock-activity-backup.service"]
]
assert current == owner["protected_pids"]
binary_hash = hashlib.sha256((root / "bedrock_server").read_bytes()).hexdigest()
assert binary_hash == owner["binary_sha256"]
config = {
    "run_root": str(RUN_ROOT),
    "production_root": str(production),
    "protected_pids": current,
    "host_netns": os.readlink("/proc/self/ns/net"),
    "reserve_bytes": 384 * 1024**2,
    "shutdown_mode": "terminate",
    "target_error": "_0x4b2e12",
}
(root / "run-config.json").write_text(json.dumps(config, indent=2))
(root / "runtime.sha256").write_text(binary_hash + "  bedrock_server\n")
unit = "bds-mowzie-" + owner["run_id"] + "-" + scenario
unit_properties = {
    "User": os.environ["USER"],
    "Group": os.environ["USER"],
    "WorkingDirectory": str(root),
    "Nice": "15",
    "CPUQuota": "50%",
    "MemoryHigh": "640M",
    "MemoryMax": "640M",
    "MemorySwapMax": "0",
    "OOMPolicy": "stop",
    "OOMScoreAdjust": "800",
    "TasksMax": "128",
    "RuntimeMaxSec": "240",
    "TimeoutStopSec": "15",
    "KillMode": "control-group",
    "PrivateNetwork": "yes",
    "NoNewPrivileges": "yes",
    "ProtectSystem": "strict",
    "ProtectHome": "yes",
    "ReadWritePaths": str(root),
    "ReadOnlyPaths": str(production),
}
command = [
    "sudo",
    "-n",
    "systemd-run",
    "--unit=" + unit,
    "--service-type=exec",
    "--remain-after-exit",
]
for key, value in unit_properties.items():
    command += ["-p", key + "=" + value]
command += ["/usr/bin/python3", str(root / "runner.py")]
(root / "launch.json").write_text(
    json.dumps(
        {"command": command, "unit": unit, "properties": unit_properties}, indent=2
    )
)
print(root)

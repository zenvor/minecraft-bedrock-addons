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
assert str(RUN_ROOT).startswith('/var/tmp/bds-addon-probe-')
owner = json.loads((RUN_ROOT / 'owner.json').read_text())
scenario = sys.argv[1]
assert scenario in owner['scenarios']
root = RUN_ROOT / 'cases' / scenario
root.mkdir(parents=True, exist_ok=False)
production = Path('/opt/minecraft-bedrock')
for name in ['bedrock_server', 'definitions', 'data', 'treatments', 'minecraftpe']:
    source = production / name
    if name == 'bedrock_server':
        (root / name).symlink_to(source)
    elif source.is_dir():
        shutil.copytree(source, root / name)
    else:
        shutil.copy2(source, root / name)
for source in production.glob('*.so*'):
    shutil.copy2(source, root / source.name)
for category in ['behavior_packs', 'resource_packs']:
    (root / category).mkdir()
    for source in (production / category).iterdir():
        if source.name.startswith('vanilla'):
            (root / category / source.name).symlink_to(source, target_is_directory=True)
        elif source.name in ['server_library', 'server_ui_library', 'server_editor_library']:
            shutil.copytree(source, root / category / source.name)
world = root / 'worlds/reference-probe'
world.mkdir(parents=True)
world_refs = {'behavior_packs': [], 'resource_packs': []}
with zipfile.ZipFile(RUN_ROOT / 'inputs/bop.mcaddon') as outer:
    assert outer.testzip() is None
    for name in outer.namelist():
        with zipfile.ZipFile(io.BytesIO(outer.read(name))) as z:
            assert z.testzip() is None
            manifest = json.loads(z.read('manifest.json'))
            category = 'behavior_packs' if any(m['type'] == 'data' for m in manifest['modules']) else 'resource_packs'
            destination = production / category / 'biomes-o-plenty'
            expected = set()
            for item in z.infolist():
                path = PurePosixPath(item.filename)
                assert not path.is_absolute() and '..' not in path.parts and not item.is_dir()
                target = destination / str(path)
                assert target.read_bytes() == z.read(item), str(target)
                expected.add(str(path))
            assert {str(p.relative_to(destination)) for p in destination.rglob('*') if p.is_file()} == expected
            (root / category / 'bop').symlink_to(destination, target_is_directory=True)
            world_refs[category].append({'pack_id': manifest['header']['uuid'], 'version': manifest['header']['version']})
probe = RUN_ROOT / 'inputs/case-inputs' / scenario / 'reference_probe'
shutil.copytree(probe, root / 'behavior_packs/reference_probe')
manifest = json.loads((probe / 'manifest.json').read_text())
world_refs['behavior_packs'].insert(0, {'pack_id': manifest['header']['uuid'], 'version': manifest['header']['version']})
for category, values in world_refs.items():
    (world / ('world_' + category + '.json')).write_text(json.dumps(values))
for name in ['runner.py', 'guard.py']:
    shutil.copy2(RUN_ROOT / 'tools' / name, root / name)
(root / 'config/default').mkdir(parents=True)
(root / 'config/default/permissions.json').write_text(json.dumps({'allowed_modules': ['@minecraft/server', '@minecraft/server-ui']}))
(root / 'permissions.json').write_text('[]')
(root / 'allowlist.json').write_text('[]')
properties = {
    'server-name': 'Disposable addon reference probe', 'gamemode': 'creative', 'difficulty': 'peaceful',
    'allow-cheats': 'true', 'online-mode': 'false', 'allow-list': 'false', 'max-players': '1',
    'server-port': '19184', 'server-portv6': '19185', 'enable-lan-visibility': 'false', 'transport': 'nethernet',
    'view-distance': '5', 'tick-distance': '4', 'max-threads': '1', 'level-name': 'reference-probe',
    'level-seed': '127013', 'level-type': 'FLAT', 'content-log-console-output-enabled': 'true',
    'content-log-file-enabled': 'false', 'emit-server-telemetry': 'false', 'client-side-chunk-generation-enabled': 'false',
}
(root / 'server.properties').write_text(''.join(name + '=' + value + '\n' for name, value in properties.items()))
current = [int(subprocess.check_output(['systemctl', 'show', name, '-p', 'MainPID', '--value'], text=True)) for name in ['minecraft-bedrock.service', 'bedrock-activity-backup.service']]
assert current == owner['protected_pids']
with (root / 'bedrock_server').open('rb') as stream:
    digest = hashlib.sha256()
    for chunk in iter(lambda: stream.read(1024 * 1024), b''):
        digest.update(chunk)
    binary_hash = digest.hexdigest()
assert binary_hash == owner['binary_sha256']
config = {'run_root': str(RUN_ROOT), 'production_root': str(production), 'protected_pids': current, 'host_netns': os.readlink('/proc/self/ns/net'), 'reserve_bytes': 384 * 1024**2, 'shutdown_mode': 'terminate', 'target_error': 'Unknown block during Deferred BlockDescriptor resolution: 4ks_bop:origin_leaves'}
(root / 'run-config.json').write_text(json.dumps(config, indent=2))
(root / 'runtime.sha256').write_text(binary_hash + '  bedrock_server\n')
unit = 'bds-reference-' + owner['run_id'] + '-' + scenario
properties = {'User': os.environ['USER'], 'Group': os.environ['USER'], 'WorkingDirectory': str(root), 'Nice': '15', 'CPUQuota': '40%', 'MemoryHigh': '368M', 'MemoryMax': '368M', 'MemorySwapMax': '0', 'OOMPolicy': 'stop', 'OOMScoreAdjust': '800', 'TasksMax': '96', 'RuntimeMaxSec': '180', 'TimeoutStopSec': '15', 'KillMode': 'control-group', 'PrivateNetwork': 'yes', 'NoNewPrivileges': 'yes', 'ProtectSystem': 'strict', 'ProtectHome': 'yes', 'ReadWritePaths': str(root), 'ReadOnlyPaths': str(production)}
command = ['sudo', '-n', 'systemd-run', '--unit=' + unit, '--service-type=exec', '--remain-after-exit']
for key, value in properties.items():
    command += ['-p', key + '=' + value]
command += ['/usr/bin/python3', str(root / 'runner.py')]
(root / 'launch.json').write_text(json.dumps({'command': command, 'unit': unit, 'properties': properties}, indent=2))
print(root)

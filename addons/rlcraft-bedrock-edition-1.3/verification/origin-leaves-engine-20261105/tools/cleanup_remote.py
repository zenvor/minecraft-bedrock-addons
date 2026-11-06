from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time

r = Path('/var/tmp/bds-addon-probe-20261105.nJgoci')
assert not r.is_symlink() and r.resolve() == r
owner = json.loads((r / 'owner.json').read_text())
assert owner['run_id'] == 'ref139-ce2d0783'
manifest = json.load(sys.stdin)
for name, expected in manifest['files'].items():
    p = r / name
    assert p.resolve().is_relative_to(r)
    assert hashlib.sha256(p.read_bytes()).hexdigest() == expected, name
protected = json.loads((r / 'protected-before.json').read_text())
def protection():
    return {'files': {p: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in protected['files']}, 'services': subprocess.check_output(['systemctl', 'show', 'minecraft-bedrock.service', 'bedrock-activity-backup.service', '-p', 'MainPID', '-p', 'Id', '-p', 'ActiveState', '-p', 'SubState', '-p', 'ActiveEnterTimestamp'], text=True)}
assert protection() == protected
units = []
for name in owner['scenarios']:
    c = r / 'cases' / name
    m = json.loads((c / 'metadata.json').read_text())
    assert m['pid'] not in owner['protected_pids']
    assert not Path('/proc/' + str(m['pid'])).exists()
    cg = Path(m['cgroup']) / 'cgroup.procs'
    assert not cg.exists() or not cg.read_text().strip()
    unit = json.loads((c / 'launch.json').read_text())['unit']
    assert unit == 'bds-reference-' + owner['run_id'] + '-' + name
    assert subprocess.check_output(['systemctl', 'show', unit, '-p', 'MainPID', '--value'], text=True).strip() == '0'
    units.append(unit)
users = []
for p in Path('/proc').iterdir():
    if not p.name.isdigit() or int(p.name) == os.getpid():
        continue
    for f in [p / 'cwd', *(p / 'fd').glob('*')]:
        try:
            target = os.readlink(f)
            if target == str(r) or target.startswith(str(r) + '/'):
                users.append({'pid': p.name, 'path': str(f), 'target': target})
        except (FileNotFoundError, ProcessLookupError, PermissionError, OSError):
            pass
assert not users, users
for unit in units:
    subprocess.run(['systemctl', 'stop', unit], check=True)
    subprocess.run(['systemctl', 'reset-failed', unit], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    assert subprocess.check_output(['systemctl', 'show', unit, '-p', 'LoadState', '--value'], text=True).strip() == 'not-found'
shutil.rmtree(r)
assert not r.exists()
assert protection() == protected
print(json.dumps({'run_root': str(r), 'removed': True, 'units_unloaded': units, 'no_process_using_directory_before_delete': True, 'evidence_files_sha256_matched': len(manifest['files']), 'protected_assets_and_services_unchanged_after_cleanup': True, 'completed_unix': time.time()}, indent=2))

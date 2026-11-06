import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import time
import zipfile

STAGE = Path(sys.argv[1]).resolve()
assert str(STAGE).startswith('/var/tmp/rlcraft-release-1.0.26-')
CONFIG = json.loads((STAGE / 'deployment-input.json').read_text())
ROOT = Path('/opt/minecraft-bedrock')
WORLD = ROOT / 'worlds/RLCraft 新纪元'
SERVICE = 'minecraft-bedrock.service'
WATCHER = 'bedrock-activity-backup.service'
IDS = {'behavior': 'b64ec000-e92d-474f-9577-42979ed93b1b', 'resource': 'fce7cc9e-b6b8-442f-9a46-0526aef6b544'}

def run(*args):
    return subprocess.check_output(args, text=True).strip()

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(data)
    return h.hexdigest()

def tree(path):
    return {str(p.relative_to(path)): digest(p) for p in path.rglob('*') if p.is_file()}

def logs(since):
    return run('journalctl', '-u', SERVICE, '--since', '@' + str(since), '-o', 'cat', '--no-pager')

def console(command):
    subprocess.run(['timeout', '5', 'sh', '-c', 'printf "%s\\n" "$1" > /run/minecraft-bedrock/console', 'sh', command], check=True)

def zero_players(require_zero=True):
    since = int(time.time())
    console('list')
    for _ in range(20):
        time.sleep(0.25)
        matches = re.findall(r'There are (\d+)/(\d+) players online:', logs(since))
        if matches:
            if require_zero:
                assert int(matches[-1][0]) == 0, 'Player online; deployment stopped'
            return {'checked_unix': since, 'players': int(matches[-1][0]), 'capacity': int(matches[-1][1])}
    raise RuntimeError('No player list response')

def audit(z):
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names)) == len({n.casefold() for n in names})
    for item in z.infolist():
        n = item.filename
        assert not item.is_dir() and not n.startswith('/') and '\\' not in n
        assert not any(p in ['', '.', '..', '.DS_Store', '__MACOSX'] or p.startswith('._') for p in n.split('/'))
        assert not stat.S_ISLNK(item.external_attr >> 16)

def protected():
    return {p: digest(Path(p)) for p in CONFIG['protected_files']}

def atomic(path, raw, metadata):
    temp = path.with_name(path.name + '.rlcraft-1026-tmp')
    assert not temp.exists()
    temp.write_bytes(raw)
    os.chown(temp, metadata['uid'], metadata['gid'])
    os.chmod(temp, metadata['mode'])
    os.replace(temp, path)

def metadata(path):
    s = path.stat()
    return {'uid': s.st_uid, 'gid': s.st_gid, 'mode': stat.S_IMODE(s.st_mode)}

def startup(since, version):
    for _ in range(90):
        time.sleep(1)
        text = logs(since)
        if 'Server started.' in text:
            assert run('systemctl', 'is-active', SERVICE) == 'active'
            assert any('Pack Stack -' in line and IDS['behavior'] in line and 'version: ' + version in line for line in text.splitlines())
            return text
    raise RuntimeError('BDS startup not confirmed')

if sys.argv[2] == 'prepare':
    artifact = STAGE / CONFIG['artifact_name']
    assert digest(artifact) == CONFIG['sha256']
    assert run('systemctl', 'is-active', SERVICE) == 'active'
    assert run('systemctl', 'is-active', WATCHER) == 'active'
    props = dict(line.split('=', 1) for line in (ROOT / 'server.properties').read_text().splitlines() if '=' in line and not line.startswith('#'))
    assert props['level-name'] == WORLD.name
    assert protected() == CONFIG['protected_files']
    players = zero_players()
    plans = []
    with zipfile.ZipFile(artifact) as outer:
        audit(outer)
        assert len(outer.namelist()) == 2
        for name in outer.namelist():
            assert name.endswith('.mcpack')
            with zipfile.ZipFile(io.BytesIO(outer.read(name))) as z:
                audit(z)
                m = json.loads(z.read('manifest.json'))
                kind = next(k for k, uid in IDS.items() if uid == m['header']['uuid'])
                assert m['header']['version'] == [1, 0, 26]
                other = IDS['resource' if kind == 'behavior' else 'behavior']
                assert {'uuid': other, 'version': [1, 0, 26]} in m['dependencies']
                assert all(x['version'] == [1, 0, 26] for x in m['modules'] if x['type'] in ['data', 'resources'])
                new = STAGE / (kind + '-new')
                assert not new.exists()
                z.extractall(new)
                stack = WORLD / ('world_' + kind + '_packs.json')
                raw = stack.read_bytes()
                entries = json.loads(raw)
                uuids = [e['pack_id'] for e in entries]
                assert len(set(uuids)) == len(uuids) and uuids.count(IDS[kind]) == 1
                index = uuids.index(IDS[kind])
                assert entries[index]['version'] == [1, 0, 25]
                matches = []
                for base in [WORLD / (kind + '_packs'), ROOT / (kind + '_packs'), ROOT / ('development_' + kind + '_packs')]:
                    for path, dirs, files in os.walk(base):
                        if 'manifest.json' not in files:
                            continue
                        try:
                            old = json.loads((Path(path) / 'manifest.json').read_text())
                        except (ValueError, OSError):
                            continue
                        if old.get('header', {}).get('uuid') == IDS[kind]:
                            matches.append(Path(path))
                        dirs[:] = []
                assert len(matches) == 1
                old = matches[0]
                assert tree(old) == CONFIG['baseline_files'][kind], 'Installed baseline differs: ' + str(old)
                old_metadata = metadata(old)
                assert all(p.stat().st_uid == old_metadata['uid'] and p.stat().st_gid == old_metadata['gid'] for p in old.rglob('*'))
                entries[index]['version'] = [1, 0, 26]
                plans.append({'kind': kind, 'old': str(old), 'new': str(new), 'stack': str(stack), 'original_stack': raw.decode(), 'new_entries': entries, 'stack_metadata': metadata(stack), 'pack_metadata': old_metadata, 'new_files': tree(new), 'index': index})
    assert {p['kind'] for p in plans} == {'behavior', 'resource'}
    assert shutil.disk_usage(ROOT).free > 1024**3 + 2 * sum(p.stat().st_size for plan in plans for p in Path(plan['old']).rglob('*') if p.is_file())
    rollback = Path('/opt/minecraft-addon-rollbacks') / ('rlcraft-1.0.26-' + time.strftime('%Y%m%dT%H%M%S%z'))
    rollback.mkdir(parents=True, exist_ok=False)
    os.chmod(rollback, 0o700)
    for plan in plans:
        old = Path(plan['old'])
        saved = rollback / (plan['kind'] + '-old-copy')
        shutil.copytree(old, saved)
        for p in [saved, *saved.rglob('*')]:
            os.chown(p, plan['pack_metadata']['uid'], plan['pack_metadata']['gid'])
        assert tree(saved) == CONFIG['baseline_files'][plan['kind']]
        shutil.copy2(plan['stack'], rollback / Path(plan['stack']).name)
    record = {'owner_id': CONFIG['owner_id'], 'sha256': CONFIG['sha256'], 'rollback': str(rollback), 'plans': plans, 'players_prepare': players, 'protected_before': protected()}
    (STAGE / 'plan.json').write_text(json.dumps(record, indent=2))
    (rollback / 'plan.json').write_text(json.dumps(record, indent=2))
    print(json.dumps({'prepared': True, 'rollback': str(rollback), 'players': players, 'pack_stack_indices': {p['kind']: p['index'] for p in plans}}), flush=True)
    raise SystemExit(0)

assert sys.argv[2] == 'deploy'
plan = json.loads((STAGE / 'plan.json').read_text())
assert plan['owner_id'] == CONFIG['owner_id'] and protected() == plan['protected_before']
rollback = Path(plan['rollback'])
for p in plan['plans']:
    assert Path(p['stack']).read_text() == p['original_stack']
    assert tree(Path(p['old'])) == CONFIG['baseline_files'][p['kind']]
    assert tree(Path(p['new'])) == p['new_files']
players = zero_players()
state = {p['kind']: {'retired': False, 'installed': False} for p in plan['plans']}
stopped = False
try:
    stopped = True
    console('stop')
    for _ in range(120):
        if run('systemctl', 'show', SERVICE, '-p', 'MainPID', '--value') == '0':
            break
        time.sleep(0.5)
    assert run('systemctl', 'show', SERVICE, '-p', 'MainPID', '--value') == '0', 'Native stop did not complete'
    subprocess.run(['systemctl', 'stop', SERVICE], check=True)
    assert run('systemctl', 'show', SERVICE, '-p', 'MainPID', '--value') == '0'
    assert run('systemctl', 'show', SERVICE, '-p', 'Result', '--value') == 'success'
    assert run('systemctl', 'show', SERVICE, '-p', 'ExecMainStatus', '--value') == '0', 'BDS stop was not normal'
    print('CLEAN_STOP_CONFIRMED', flush=True)
    for p in plan['plans']:
        old = Path(p['old'])
        old.rename(rollback / (p['kind'] + '-retired'))
        state[p['kind']]['retired'] = True
        shutil.move(p['new'], str(old))
        state[p['kind']]['installed'] = True
        subprocess.run(['chown', '-R', str(p['pack_metadata']['uid']) + ':' + str(p['pack_metadata']['gid']), str(old)], check=True)
        os.chmod(old, p['pack_metadata']['mode'])
        atomic(Path(p['stack']), (json.dumps(p['new_entries'], ensure_ascii=False, indent=2) + '\n').encode(), p['stack_metadata'])
    started = int(time.time())
    subprocess.run(['systemctl', 'start', SERVICE], check=True)
    text = startup(started, '1.0.26')
    subprocess.run(['systemctl', 'start', WATCHER], check=True)
    assert run('systemctl', 'is-active', WATCHER) == 'active'
    for p in plan['plans']:
        assert tree(Path(p['old'])) == p['new_files']
        assert json.loads(Path(p['stack']).read_text()) == p['new_entries']
        assert all(x.stat().st_uid == p['pack_metadata']['uid'] and x.stat().st_gid == p['pack_metadata']['gid'] for x in Path(p['old']).rglob('*'))
    assert protected() == plan['protected_before']
    time.sleep(3)
    players_after = zero_players(require_zero=False)
    text = logs(started)
    errors = [line for line in text.splitlines() if ' ERROR]' in line or '[Watchdog]' in line]
    assert not errors, 'Startup errors: ' + '\n'.join(errors[:8])
    (STAGE / 'startup.log').write_text(text)
    result = {'deployed': True, 'version': '1.0.26', 'archive_sha256': CONFIG['sha256'], 'rollback': str(rollback), 'started_unix': started, 'bds_pid': int(run('systemctl', 'show', SERVICE, '-p', 'MainPID', '--value')), 'backup_service_pid': int(run('systemctl', 'show', WATCHER, '-p', 'MainPID', '--value')), 'bds_active': True, 'activity_backup_active': True, 'runtime_pack_stack_confirmed': True, 'files_match_archive': True, 'other_world_pack_entries_and_order_unchanged': True, 'protected_bop_structures_and_config_unchanged': True, 'startup_errors': errors, 'origin_leaves_errors': text.count('Unknown block during Deferred BlockDescriptor resolution: 4ks_bop:origin_leaves'), 'players_before_stop': players, 'players_after_start': players_after, 'gameplay_verified': False, 'existing_backups_modified': False}
    (STAGE / 'deployment-result.json').write_text(json.dumps(result, indent=2))
    (rollback / 'deployment-result.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result), flush=True)
except BaseException:
    if stopped:
        subprocess.run(['systemctl', 'stop', SERVICE], check=False)
        for p in plan['plans']:
            old = Path(p['old'])
            if state[p['kind']]['installed']:
                old.rename(rollback / (p['kind'] + '-failed-new'))
            if state[p['kind']]['retired']:
                (rollback / (p['kind'] + '-retired')).rename(old)
            atomic(Path(p['stack']), p['original_stack'].encode(), p['stack_metadata'])
        started = int(time.time())
        subprocess.run(['systemctl', 'start', SERVICE], check=True)
        startup(started, '1.0.25')
        subprocess.run(['systemctl', 'start', WATCHER], check=True)
        assert run('systemctl', 'is-active', WATCHER) == 'active'
        print('ROLLED_BACK_TO_1.0.25', flush=True)
    raise

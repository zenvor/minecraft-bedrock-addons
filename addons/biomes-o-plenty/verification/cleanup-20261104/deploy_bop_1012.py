import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import time
import zipfile

root = Path('/opt/minecraft-bedrock')
stage = Path(sys.argv[1])
world = root / 'worlds/RLCraft 新纪元'
service = 'minecraft-bedrock.service'
watcher = 'bedrock-activity-backup.service'
artifact = stage / 'Biomes-O-Plenty-zh_CN-v1.0.12-candidate.mcaddon'
expected = '1c639b2d0452a3e18bb6cddc04f2ab362af5698089684b49c9f348eae601c62a'
ids = {'behavior': 'b2d66d7d-3cf9-4c9d-aabf-fa46bc739cb9', 'resource': '91478ab3-1b9c-4541-8797-bdaa0a61092f'}

def run(*args): return subprocess.check_output(args, text=True).strip()
def logs(t): return run('journalctl','-u',service,'--since','@'+str(t),'-o','cat','--no-pager')
def console(c): subprocess.run(['timeout','5','sh','-c','printf "%s\\n" "$1" > /run/minecraft-bedrock/console','sh',c],check=True)
def digest(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
def tree(p):return {str(f.relative_to(p)):digest(f) for f in p.rglob('*') if f.is_file()}
def atomic(p,data,s):
    t=p.with_name(p.name+'.bop-tmp');t.write_bytes(data);os.chown(t,s.st_uid,s.st_gid);os.chmod(t,stat.S_IMODE(s.st_mode));os.replace(t,p)
def audit(z):
    assert z.testzip() is None
    ns=z.namelist();assert len(ns)==len(set(ns))==len({n.casefold() for n in ns})
    for i in z.infolist():
        n=i.filename;assert not n.startswith('/') and '\\' not in n and '..' not in n.split('/')
        assert not stat.S_ISLNK(i.external_attr>>16) and not {'.DS_Store','__MACOSX'}.intersection(n.split('/'))

assert digest(artifact)==expected
assert run('systemctl','is-active',service)=='active' and run('systemctl','is-active',watcher)=='active'
props=dict(l.split('=',1) for l in (root/'server.properties').read_text().splitlines() if '=' in l and not l.startswith('#'))
assert props['level-name']==world.name
plans=[]
with zipfile.ZipFile(artifact) as outer:
    audit(outer);assert len(outer.namelist())==2
    for name in outer.namelist():
        assert name.endswith('.mcpack')
        with zipfile.ZipFile(io.BytesIO(outer.read(name))) as z:
            audit(z);m=json.loads(z.read('manifest.json'));kind=next(k for k,v in ids.items() if v==m['header']['uuid'])
            assert m['header']['version']==[1,0,12]
            other=ids['resource' if kind=='behavior' else 'behavior']
            assert any(d.get('uuid')==other and d['version']==[1,0,12] for d in m['dependencies'])
            extracted=stage/kind;assert not extracted.exists();extracted.mkdir();z.extractall(extracted)
            stackpath=world/f'world_{kind}_packs.json';raw=stackpath.read_bytes();entries=json.loads(raw)
            uuids=[e['pack_id'] for e in entries];assert len(uuids)==len(set(uuids)) and uuids.count(ids[kind])==1
            idx=uuids.index(ids[kind]);assert entries[idx]['version']==[1,0,11]
            matches=[]
            for base in [world/f'{kind}_packs',root/f'{kind}_packs',root/f'development_{kind}_packs']:
                for dp,ds,fs in os.walk(base):
                    if 'manifest.json' not in fs:continue
                    try:old=json.loads((Path(dp)/'manifest.json').read_text())
                    except (ValueError,OSError):continue
                    if old.get('header',{}).get('uuid')==ids[kind]:matches.append(Path(dp))
                    ds[:]=[]
            assert len(matches)==1 and json.loads((matches[0]/'manifest.json').read_text())['header']['version']==[1,0,11]
            entries[idx]['version']=[1,0,12]
            plans.append(dict(kind=kind,old=matches[0],new=extracted,stack=stackpath,raw=raw,st=stackpath.stat(),entries=entries,retired=False,installed=False))
assert len(plans)==2
size=sum(p.stat().st_size for p in world.rglob('*') if p.is_file())
assert shutil.disk_usage(root).free>size+1024**3
backup=root/'backups'/('manual-bop-1.0.12-'+time.strftime('%Y%m%dT%H%M%S%z'));backup.mkdir()
for p in plans:
    shutil.copytree(p['old'],backup/(p['kind']+'-old-copy'))
    shutil.copy2(p['stack'],backup/p['stack'].name)
print('VALIDATED; BACKUP',backup,flush=True)
subprocess.run(['systemctl','stop',watcher],check=True)
stopped=False
try:
    t=int(time.time());console('list');time.sleep(1)
    assert 'There are 0/4 players online:' in logs(t),'Player online or response missing'
    for p in plans:assert p['stack'].read_bytes()==p['raw']
    stopped=True
    subprocess.run(['systemctl','stop',service],check=True)
    assert run('systemctl','show',service,'-p','MainPID','--value')=='0'
    assert run('systemctl','show',service,'-p','Result','--value')=='success','BDS stop not clean; abort deployment'
    print('CLEAN_STOP; COPYING_WORLD',flush=True)
    shutil.copytree(world,backup/'world',copy_function=shutil.copy2)
    before=tree(world);assert before==tree(backup/'world'),'Cold backup checksum mismatch'
    (backup/'world-sha256.json').write_text(json.dumps(before,ensure_ascii=False,indent=2))
    for n in ['server.properties','allowlist.json','permissions.json']:shutil.copy2(root/n,backup/n)
    (backup/'backup-status.json').write_text(json.dumps({'complete':True,'method':'clean-stop full-world copy with SHA256','files':len(before),'artifact_sha256':expected}))
    print('WORLD_BACKUP_VERIFIED',len(before),flush=True)
    for p in plans:
        shutil.move(str(p['old']),str(backup/(p['kind']+'-retired')));p['retired']=True
        shutil.move(str(p['new']),str(p['old']));p['installed']=True
        subprocess.run(['chown','-R','minecraft:minecraft',str(p['old'])],check=True)
        atomic(p['stack'],(json.dumps(p['entries'],ensure_ascii=False,indent=2)+'\n').encode(),p['st'])
    t=int(time.time());subprocess.run(['systemctl','start',service],check=True)
    for _ in range(60):
        time.sleep(1);out=logs(t)
        if 'Server started.' in out:break
    assert 'Server started.' in out and run('systemctl','is-active',service)=='active'
    assert any('Pack Stack -' in l and ids['behavior'] in l and 'version: 1.0.12' in l for l in out.splitlines())
    for p in plans:assert json.loads(p['stack'].read_bytes())==p['entries']
    subprocess.run(['systemctl','start',watcher],check=True)
    assert run('systemctl','is-active',watcher)=='active'
    (backup/'deployment-result.json').write_text(json.dumps({'deployed':True,'version':'1.0.12','rollback_world':str(backup/'world'),'rollback_packs':[str(backup/(p['kind']+'-retired')) for p in plans]},indent=2))
    print('DEPLOYED_1.0.12',flush=True)
    for l in out.splitlines():
        if any(s in l for s in ['Version:','Pack Stack -','Server started.','ERROR']):print(l,flush=True)
except BaseException:
    if stopped:
        subprocess.run(['systemctl','stop',service],check=False)
        for p in plans:
            if p['installed']:shutil.move(str(p['old']),str(backup/(p['kind']+'-failed-new')))
            if p['retired']:shutil.move(str(backup/(p['kind']+'-retired')),str(p['old']))
            atomic(p['stack'],p['raw'],p['st'])
        t=int(time.time());subprocess.run(['systemctl','start',service],check=True)
        for _ in range(60):
            time.sleep(1)
            if 'Server started.' in logs(t):break
        assert run('systemctl','is-active',service)=='active' and 'Server started.' in logs(t),'Rollback startup failed'
        print('ROLLED_BACK_TO_1.0.11',flush=True)
    raise
finally:subprocess.run(['systemctl','start',watcher],check=True)

from pathlib import Path
import hashlib,io,json,shutil,sys,zipfile
parent=Path('/var/tmp/bop-exitdiag-20261104.Z5SGVr')
label,variant,transport=sys.argv[1:]
root=parent/('bop-exit-'+label);root.mkdir(exist_ok=False)
base=Path('/var/tmp/bop-native-20261104.OdsXwj')
for name in ['bedrock_server','definitions','data','treatments','minecraftpe']:
 src=base/name
 if src.is_dir():shutil.copytree(src,root/name)
 else:shutil.copy2(src,root/name)
for category in ['behavior_packs','resource_packs']:
 (root/category).mkdir()
 for src in (base/category).iterdir():
  if src.name.startswith('vanilla') or src.name in ['server_library','server_ui_library','server_editor_library']:shutil.copytree(src,root/category/src.name)
for src in base.glob('*.so*'):shutil.copy2(src,root/src.name)
config=parent/'settings'
shutil.copytree(config,root,dirs_exist_ok=True)
p=root/'server.properties';s=p.read_text().replace('full-flow-world','exit-world').replace('transport=raknet','transport='+transport);p.write_text(s)
world=root/'worlds/exit-world';world.mkdir(parents=True)
if variant!='vanilla':
 with zipfile.ZipFile(parent/(variant+'.mcaddon')) as outer:
  for name in outer.namelist():
   with zipfile.ZipFile(io.BytesIO(outer.read(name))) as inner:
    m=json.loads(inner.read('manifest.json'));behavior=any(x['type']=='data' for x in m['modules']);category='behavior_packs' if behavior else 'resource_packs'
    for entry in inner.infolist():
     path=Path(entry.filename);assert not path.is_absolute() and '..' not in path.parts and not entry.is_dir()
     dest=root/category/'bop'/path;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(inner.read(entry))
    (world/('world_'+category+'.json')).write_text(json.dumps([{'pack_id':m['header']['uuid'],'version':m['header']['version']}]))
shutil.copy2(parent/'driver.py',root/'driver.py')
meta={'variant':variant,'transport':transport,'world':'new FLAT seed 127013; no client; no harness BP','runtime_sha256':hashlib.sha256((root/'bedrock_server').read_bytes()).hexdigest()}
if variant!='vanilla':meta['bop_script_sha256']=hashlib.sha256((root/'behavior_packs/bop/scripts/bop/ks/main.js').read_bytes()).hexdigest()
(root/'setup.json').write_text(json.dumps(meta,indent=2));print(root)

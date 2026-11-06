import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import stat
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[5]
PROOF = Path(__file__).resolve().parents[1]
SOURCE = 'addons/rlcraft-bedrock-edition-1.3/source/'
spec = importlib.util.spec_from_file_location('rlcraft_pack', ROOT / 'addons/rlcraft-bedrock-edition-1.3/tools/pack.py')
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)
packs = {'behavior-pack': {}, 'resource-pack': {}}
data = subprocess.check_output(['git', 'archive', 'HEAD', '--', SOURCE], cwd=ROOT)
with tarfile.open(fileobj=io.BytesIO(data)) as t:
    for m in t:
        if m.isdir():
            continue
        assert m.isfile() and m.name.startswith(SOURCE)
        kind, name = m.name[len(SOURCE):].split('/', 1)
        packs[kind][name] = t.extractfile(m).read()
changes = subprocess.check_output(['git', 'diff', '--name-only', '--', SOURCE], cwd=ROOT, text=True).splitlines()
assert len(changes) == 141
for path in changes:
    kind, name = path[len(SOURCE):].split('/', 1)
    before = packs[kind][name]
    after = (ROOT / path).read_bytes()
    if name == 'manifest.json':
        assert after == before.replace(b'[1,0,25]', b'[1,0,26]') and before.count(b'[1,0,25]') == 3
    else:
        assert kind == 'behavior-pack' and name.startswith('features/structure/')
        assert before.count(b'"4ks_bop:origin_leaves"') == 1
        assert after == before.replace(b'"4ks_bop:origin_leaves"', b'"4ks_bop:origin_oak_leaves"')
    packs[kind][name] = after
manifests = {k: json.loads(v['manifest.json']) for k, v in packs.items()}
for k, m in manifests.items():
    other = manifests['resource-pack' if k == 'behavior-pack' else 'behavior-pack']
    assert m['header']['version'] == [1, 0, 26]
    assert {'uuid': other['header']['uuid'], 'version': [1, 0, 26]} in m['dependencies']
    assert all(x['version'] == [1, 0, 26] for x in m['modules'] if x['type'] in ['data', 'resources'])
    assert all((ROOT / SOURCE / k / n).read_bytes() == value for n, value in packs[k].items())
def build():
    return tool.archive_bytes({f'RLCraft-1.3-{kind}-1.0.26.mcpack': tool.archive_bytes(files) for kind, files in packs.items()})
a = build()
assert a == build()
out = ROOT / 'dist/RLCraft Bedrock Edition 1.3-zh_CN-1.0.26.mcaddon'
assert not out.exists()
out.write_bytes(a)
sha = hashlib.sha256(a).hexdigest()
out.with_suffix('.mcaddon.sha256').write_text(sha + '  ' + out.name + '\n')
stage = ROOT / '.build/rlcraft-release-1.0.26'
stage.mkdir(exist_ok=False)
with zipfile.ZipFile(io.BytesIO(a)) as outer:
    assert outer.testzip() is None and len(outer.namelist()) == 2
    for name in outer.namelist():
        raw = outer.read(name)
        (stage / name).write_bytes(raw)
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            assert z.testzip() is None
            names = z.namelist()
            assert len(names) == len(set(names)) == len({n.casefold() for n in names})
            for item in z.infolist():
                n = item.filename
                assert not n.startswith('/') and '\\' not in n and not any(p in ['', '.', '..', '.DS_Store', '__MACOSX'] or p.startswith('._') for p in n.split('/'))
                assert not stat.S_ISLNK(item.external_attr >> 16)
release = ROOT / 'addons/rlcraft-bedrock-edition-1.3/releases' / out.name
assert not release.exists()
shutil.copy2(out, release)
shutil.copy2(out.with_suffix('.mcaddon.sha256'), release.with_suffix('.mcaddon.sha256'))
report = {'version': '1.0.26', 'sha256': sha, 'bytes': len(a), 'source_base_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(), 'changes': changes, 'file_counts': {k: len(v) for k, v in packs.items()}, 'reproducible': True, 'all_package_files_match_working_source': True, 'uuid_api_script_modules_unchanged': True, 'output': str(release), 'inner_stage': str(stage)}
(PROOF / 'formal-package.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k: v for k, v in report.items() if k != 'changes'}, indent=2))

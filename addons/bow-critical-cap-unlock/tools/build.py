"""Build a 26.40-format compatibility candidate without touching 0.1.0."""
from pathlib import Path, PurePosixPath
import copy
import hashlib
import io
import json
import uuid
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = [0, 1, 1]
def sha(data):
    return hashlib.sha256(data).hexdigest()
def read(path):
    return json.loads(path.read_text())
def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

baseline_path = ROOT / 'evidence/vanilla_1.26.40-arrow.json'
assert sha(baseline_path.read_bytes()) == 'bf9571a115d502c888b73d8bc6a9aaef05cabc567e50d5c08a563908b7e2a200'
baseline = read(baseline_path)
old_arrow = read(ROOT / 'evidence/arrow-0.1.0.json')
bp = ROOT / 'source/behavior-pack'
rp = ROOT / 'source/resource-pack'
source_hashes = {str(p.relative_to(ROOT)): sha(p.read_bytes()) for p in (ROOT / 'source').rglob('*') if p.is_file()}
arrow = read(bp / 'entities/arrow.json')
assert arrow['format_version'] == '1.26.40'
expected = copy.deepcopy(baseline)
expected['minecraft:entity']['components']['minecraft:type_family'] = {'family': ['projectile', 'arrow']}
expected['minecraft:entity']['component_groups']['minecraft:player_arrow']['minecraft:projectile']['on_hit']['impact_damage']['max_critical_damage'] = 2147483647
assert arrow == expected
normalized = copy.deepcopy(arrow)
normalized['format_version'] = '1.26.50'
for branch in [normalized['minecraft:entity']['components'], *normalized['minecraft:entity']['component_groups'].values()]:
    if 'minecraft:projectile' in branch:
        assert branch['minecraft:projectile']['anchor'] == 1
        assert branch['minecraft:projectile']['on_hit']['impact_damage']['damage'] == 0
        branch['minecraft:projectile']['anchor'] = 'eye_height'
        branch['minecraft:projectile']['on_hit']['impact_damage']['damage'] = {'min': 0, 'max': 0}
assert normalized == old_arrow
manifest = read(bp / 'manifest.json')
resource_manifest = read(rp / 'manifest.json')
assert manifest['header']['uuid'] == '0604435e-13cc-4caa-9a76-de9ab0660df0'
assert manifest['modules'][0]['uuid'] == 'c9b89acd-f654-4915-afeb-54dae44813a0'
assert resource_manifest['header']['uuid'] == '0a745183-081b-4873-bb84-686582c960c4'
assert resource_manifest['modules'][0]['uuid'] == '2a27a99a-d6ed-4eab-9b2d-3a9e434fe564'
rp_original = ROOT / 'evidence/ordering-companion-0.1.0-manifest.json'
assert sha(rp_original.read_bytes()) == '3b8d2370977f0949b49fbff4ccd6433a5265368a2e1fa6c04efd0cbe21857fb0'
all_uuids = []
for source, module_type in [(bp, 'data'), (rp, 'resources')]:
    m = read(source / 'manifest.json')
    assert m['format_version'] == 2 and m['header']['version'] == VERSION
    assert m['header']['min_engine_version'] == [1, 26, 40]
    assert m['header']['pack_scope'] == 'world'
    assert len(m['modules']) == 1 and m['modules'][0]['type'] == module_type
    assert m['modules'][0]['version'] == VERSION
    for value in [m['header']['uuid'], m['modules'][0]['uuid']]:
        uuid.UUID(value)
        all_uuids.append(value)
assert len(set(all_uuids)) == 4
assert 'dependencies' not in manifest
assert resource_manifest['dependencies'] == [{'uuid': manifest['header']['uuid'], 'version': VERSION}]

def pack(files):
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, 'w') as archive:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, (2026, 10, 9, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data)
    result = stream.getvalue()
    with zipfile.ZipFile(io.BytesIO(result)) as archive:
        assert archive.testzip() is None
        names = archive.namelist()
        assert len(names) == len(set(n.casefold() for n in names))
        assert set(names) == set(files)
        for name in names:
            assert not PurePosixPath(name).is_absolute() and '..' not in PurePosixPath(name).parts and '\\' not in name
            assert archive.read(name) == files[name]
    return result

artifacts = {}
for source, name in [(bp, 'bow-critical-cap-unlock-26.40plus-0.1.1.mcpack'), (rp, 'bow-patch-ordering-companion-26.40plus-0.1.1.mcpack')]:
    assert not any(p.is_symlink() for p in source.rglob('*'))
    files = {p.relative_to(source).as_posix(): p.read_bytes() for p in source.rglob('*') if p.is_file()}
    assert set(files) == ({'manifest.json', 'entities/arrow.json', 'README.txt'} if source == bp else {'manifest.json', 'README.txt'})
    artifacts[name] = pack(files)
combined_name = 'bow-critical-cap-unlock-with-ordering-26.40plus-0.1.1.mcaddon'
combined = pack(artifacts)
artifacts[combined_name] = combined
release = ROOT / 'releases'
for name, data in artifacts.items():
    (release / name).write_bytes(data)
assert source_hashes == {str(p.relative_to(ROOT)): sha(p.read_bytes()) for p in (ROOT / 'source').rglob('*') if p.is_file()}
report = {
    'version': VERSION, 'min_engine_version_bp_rp': [1, 26, 40], 'arrow_format_version': '1.26.40',
    'artifacts': {'releases/' + name: sha(data) for name, data in artifacts.items()},
    'static_checks': 'passed: schema representation comparison, UUID/version/dependency, ZIP CRC/path/case duplicates/source bytes, no scripts or textures, canonical source unchanged',
    'engine_schema_validation': 'not_run; comparisons and official documentation only',
    'runtime_011': 'not_run on any version',
    'runtime_010': 'user reported damage fix; operator reported ordering and isolated conflict test',
    'native_regression_first_version': 'unconfirmed; only 26.30.5 and 26.52.3 binaries inspected',
    'baseline_2640_provenance': 'retained vanilla_1.26.40 asset in supplied 26.52.3 APK, not a 26.40 binary',
    'rp_input_sha256': sha(rp_original.read_bytes()),
    'rabbit_failure_cause': 'unconfirmed; 26.52 manifest gate removed, client content logs still required',
    'future_versions': 'minimum version is not a guarantee of all future engine or network compatibility',
    'server_mutations': False,
}
write(ROOT / 'bow-cap-unlock-2640-validation.json', report)
(release / 'SHA256SUMS-26.40plus-0.1.1').write_text(''.join(f'{sha(data)}  {name}\n' for name, data in artifacts.items()))
print(json.dumps(report, ensure_ascii=False, indent=2))

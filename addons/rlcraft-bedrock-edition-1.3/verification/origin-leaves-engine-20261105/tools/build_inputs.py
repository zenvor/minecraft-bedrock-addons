import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import shutil
import struct
import subprocess
import tarfile
import uuid
import zipfile

ROOT = Path(__file__).resolve().parents[5]
SOURCE = 'addons/rlcraft-bedrock-edition-1.3/source/'
PROOF = Path(__file__).resolve().parent.parent
STAGE = ROOT / '.build/rlcraft-origin-leaves-engine-20261105'
OLD = b'"4ks_bop:origin_leaves"'
NEW = b'"4ks_bop:origin_oak_leaves"'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def archive_bytes(files):
    target = io.BytesIO()
    with zipfile.ZipFile(target, 'w') as z:
        for name, content in sorted(files.items()):
            path = PurePosixPath(name)
            assert not path.is_absolute() and '..' not in path.parts and '\\' not in name
            assert not any(p in ['.DS_Store', '__MACOSX'] or p.startswith('._') for p in path.parts)
            info = zipfile.ZipInfo(name, (2000, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            z.writestr(info, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    data = target.getvalue()
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        assert z.testzip() is None and z.namelist() == sorted(files)
        assert len({x.casefold() for x in z.namelist()}) == len(files)
        assert all(z.read(name) == value for name, value in files.items())
    return data


def read_bundle(path):
    packs = {}
    with zipfile.ZipFile(path) as outer:
        assert outer.testzip() is None and len(outer.namelist()) == 2
        for name in outer.namelist():
            with zipfile.ZipFile(io.BytesIO(outer.read(name))) as inner:
                assert inner.testzip() is None
                files = {name: inner.read(name) for name in inner.namelist()}
                manifest = json.loads(files['manifest.json'])
                kind = 'behavior-pack' if any(m['type'] == 'data' for m in manifest['modules']) else 'resource-pack'
                assert kind not in packs
                packs[kind] = files
    return packs


def string(value):
    data = value.encode()
    return struct.pack('<H', len(data)) + data


def tag(kind, name, payload):
    return bytes([kind]) + string(name) + payload


def compound(name, children):
    return tag(10, name, b''.join(children) + b'\0')


def int_list(name, values):
    return tag(9, name, b'\3' + struct.pack('<i', len(values)) + b''.join(struct.pack('<i', v) for v in values))


def one_block_structure():
    entry = b''.join([tag(8, 'name', string('minecraft:stone')), compound('states', []), tag(3, 'version', struct.pack('<i', 17959425))]) + b'\0'
    palette = tag(9, 'block_palette', b'\x0a' + struct.pack('<i', 1) + entry)
    indices = tag(9, 'block_indices', b'\x09' + struct.pack('<i', 2) + b'\3' + struct.pack('<ii', 1, 0) + b'\3' + struct.pack('<ii', 1, -1))
    return compound('', [tag(3, 'format_version', struct.pack('<i', 1)), int_list('size', [1, 1, 1]), compound('structure', [indices, tag(9, 'entities', b'\x0a' + struct.pack('<i', 0)), compound('palette', [compound('default', [palette, compound('block_position_data', [])])])]), int_list('structure_world_origin', [0, 0, 0])])


def main():
    STAGE.mkdir(parents=True, exist_ok=False)
    source_tar = subprocess.check_output(['git', 'archive', 'HEAD', '--', SOURCE], cwd=ROOT)
    baseline = {'behavior-pack': {}, 'resource-pack': {}}
    with tarfile.open(fileobj=io.BytesIO(source_tar)) as z:
        for member in z:
            if member.isdir():
                continue
            assert member.isfile() and member.name.startswith(SOURCE)
            path = PurePosixPath(member.name[len(SOURCE):])
            baseline[path.parts[0]]['/'.join(path.parts[1:])] = z.extractfile(member).read()
    formal = ROOT / 'addons/rlcraft-bedrock-edition-1.3/releases/RLCraft Bedrock Edition 1.3-zh_CN-1.0.25.mcaddon'
    assert read_bundle(formal) == baseline
    changed = subprocess.check_output(['git', 'diff', '--name-only', '--', SOURCE], cwd=ROOT, text=True).splitlines()
    assert len(changed) == 139
    fixed = {kind: dict(files) for kind, files in baseline.items()}
    target_names = []
    for name in changed:
        path = PurePosixPath(name[len(SOURCE):])
        assert path.parts[0] == 'behavior-pack' and path.parts[1:3] == ('features', 'structure')
        relative = '/'.join(path.parts[1:])
        before = baseline['behavior-pack'][relative]
        after = (ROOT / name).read_bytes()
        assert before.count(OLD) == 1 and after == before.replace(OLD, NEW)
        fixed['behavior-pack'][relative] = after
        target_names.append(relative)
    def build():
        return archive_bytes({f'RLCraft-{kind}-1.0.25-origin-leaves-test.mcpack': archive_bytes(files) for kind, files in fixed.items()})
    package = build()
    assert package == build()
    output = ROOT / 'dist/RLCraft-1.0.25-origin-leaves-test.mcaddon'
    assert not output.exists()
    output.write_bytes(package)
    output.with_suffix('.mcaddon.sha256').write_text(digest(package) + '  ' + output.name + '\n')
    assert read_bundle(output) == fixed
    shutil.copy2(formal, STAGE / 'baseline.mcaddon')
    shutil.copy2(output, STAGE / 'fixed.mcaddon')
    bop = ROOT / 'addons/biomes-o-plenty/releases/Biomes-O-Plenty-zh_CN-v1.0.12.mcaddon'
    shutil.copy2(bop, STAGE / 'bop.mcaddon')
    assert digest(bop.read_bytes()) == '1c639b2d0452a3e18bb6cddc04f2ab362af5698089684b49c9f348eae601c62a'
    probe_id = str(uuid.uuid4())
    module_ids = [str(uuid.uuid4()), str(uuid.uuid4())]
    harness = Path(__file__).with_name('probe.js').read_text()
    scenarios = {}
    for scenario in ['control', 'baseline', 'fixed']:
        probe = STAGE / 'case-inputs' / scenario / 'reference_probe'
        (probe / 'scripts').mkdir(parents=True)
        (probe / 'features').mkdir()
        features = []
        contents = baseline if scenario == 'baseline' else fixed
        for name in ([] if scenario == 'control' else sorted(target_names)):
            data = contents['behavior-pack'][name]
            feature = json.loads(data)['minecraft:structure_template_feature']
            feature_path = probe / name
            feature_path.parent.mkdir(parents=True, exist_ok=True)
            feature_path.write_bytes(data)
            features.append({'id': feature['description']['identifier'], 'structure': feature['structure_name'], 'source_sha256': digest(data)})
        control = {'format_version': '1.13.0', 'minecraft:structure_template_feature': {'description': {'identifier': 'reference_probe:control'}, 'structure_name': 'reference_probe:one_block', 'adjustment_radius': 0, 'facing_direction': 'south', 'constraints': {'grounded': {}, 'block_intersection': {'block_allowlist': ['minecraft:air', '4ks_bop:origin_oak_leaves']}}}}
        (probe / 'features/control.json').write_text(json.dumps(control))
        (probe / 'feature_rules').mkdir(exist_ok=True)
        for i, identifier in enumerate(['reference_probe:control', *(f['id'] for f in features)]):
            rule = {'format_version': '1.13.0', 'minecraft:feature_rules': {'description': {'identifier': f'reference_probe:bind_{i}', 'places_feature': identifier}, 'conditions': {'placement_pass': 'surface_pass', 'minecraft:biome_filter': {'test': 'has_biome_tag', 'operator': '==', 'value': 'reference_probe_no_auto_generation'}}, 'distribution': {'iterations': 1, 'x': 0, 'y': 64, 'z': 0}}}
            (probe / 'feature_rules' / f'bind_{i}.json').write_text(json.dumps(rule))
        for identifier in {'reference_probe:one_block', *(f['structure'] for f in features)}:
            namespace, path = identifier.split(':', 1)
            dest = probe / 'structures' / namespace / (path + '.mcstructure')
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(one_block_structure())
        config = {'scenario': scenario, 'features': features, 'full_bop_unchanged': True, 'structure_fixture': 'one vanilla stone block, original structure identifiers', 'rlcraft_scripts_loaded': False}
        (probe / 'scripts/main.js').write_text('const PROBE_CONFIG = ' + json.dumps(config) + ';\n' + harness)
        manifest = {'format_version': 2, 'header': {'name': 'Isolated reference probe', 'description': 'Exact feature JSON; tiny structure fixtures; disposable world', 'uuid': probe_id, 'version': [1, 0, 0], 'min_engine_version': [1, 26, 0]}, 'modules': [{'type': 'data', 'uuid': module_ids[0], 'version': [1, 0, 0]}, {'type': 'script', 'language': 'javascript', 'entry': 'scripts/main.js', 'uuid': module_ids[1], 'version': [1, 0, 0]}], 'dependencies': [{'module_name': '@minecraft/server', 'version': '2.1.0'}]}
        (probe / 'manifest.json').write_text(json.dumps(manifest))
        scenarios[scenario] = config
    report = {'stage': str(STAGE), 'package': str(output), 'package_sha256': digest(package), 'baseline_sha256': digest(formal.read_bytes()), 'source_head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(), 'overlay_files': len(changed), 'file_counts': {k: len(v) for k, v in fixed.items()}, 'uuid_versions_unchanged': True, 'reproducible': True, 'scenarios': scenarios}
    (PROOF / 'build.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'scenarios'}, indent=2))


if __name__ == '__main__':
    main()

import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import zipfile


ROOT = Path(__file__).resolve().parents[3]
ADDON = ROOT / "addons/biomes-o-plenty"


def check(condition, message):
    if not condition:
        raise ValueError(message)


def archive_bytes(files):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        for name, content in sorted(files.items()):
            path = PurePosixPath(name)
            check(not path.is_absolute() and ".." not in path.parts and "\\" not in name,
                  f"Unsafe path: {name}")
            check(not any(part in (".DS_Store", "__MACOSX") or part.startswith("._")
                          for part in path.parts), f"System file: {name}")
            entry = zipfile.ZipInfo(name, (2000, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    data = output.getvalue()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        names = archive.namelist()
        check(len(set(name.casefold() for name in names)) == len(names), "Duplicate ZIP path")
        check(archive.testzip() is None, "ZIP CRC failure")
        check(names == sorted(files), "ZIP member mismatch")
        for name, content in files.items():
            check(archive.read(name) == content, f"Source/archive mismatch: {name}")
    return data


def main():
    packs = {}
    for kind in ("behavior-pack", "resource-pack"):
        folder = ADDON / "source" / kind
        files = {}
        for path in sorted(folder.rglob("*")):
            check(not path.is_symlink(), f"Source symlink: {path}")
            if path.is_file():
                files[path.relative_to(folder).as_posix()] = path.read_bytes()
        packs[kind] = files
    manifests = {kind: json.loads(files["manifest.json"]) for kind, files in packs.items()}
    version = manifests["behavior-pack"]["header"]["version"]
    check(version == [1, 0, 12], "Expected release version 1.0.12")
    for kind, manifest in manifests.items():
        check(manifest["header"]["version"] == version, "Header version mismatch")
        other = manifests["resource-pack" if kind == "behavior-pack" else "behavior-pack"]
        check({"uuid": other["header"]["uuid"], "version": version} in manifest["dependencies"],
              "Cross-pack dependency mismatch")
        for module in manifest["modules"]:
            if module["type"] in ("data", "resources"):
                check(module["version"] == version, "Module version mismatch")
            if module["type"] == "script":
                check(module["entry"] in packs[kind], "Script entry missing")
    inner = {f"BOP-{kind}-1.0.12-candidate.mcpack": archive_bytes(files)
             for kind, files in packs.items()}
    output = archive_bytes(inner)
    rebuilt = archive_bytes({f"BOP-{kind}-1.0.12-candidate.mcpack": archive_bytes(files)
                             for kind, files in packs.items()})
    check(output == rebuilt, "Reproducibility failure")
    destination = ROOT / "dist/Biomes-O-Plenty-zh_CN-v1.0.12.mcaddon"
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        check(destination.read_bytes() == output, "Refusing to overwrite a different release")
    destination.write_bytes(output)
    staging = ROOT / ".build/bop-release-1.0.12"
    staging.mkdir(parents=True, exist_ok=True)
    for name, content in inner.items():
        (staging / name).write_bytes(content)
    digest = hashlib.sha256(output).hexdigest()
    destination.with_suffix(".mcaddon.sha256").write_text(f"{digest}  {destination.name}\n")
    report = {
        "version": version, "sha256": digest, "bytes": len(output),
        "file_counts": {kind: len(files) for kind, files in packs.items()},
        "script_sha256": hashlib.sha256(packs["behavior-pack"]["scripts/bop/ks/main.js"]).hexdigest(),
        "reproducible": True, "source_archive_identical": True,
        "output": str(destination.relative_to(ROOT)),
        "original_release_sha256": "1615250c8a518e8f3ad87e945123afa058ca18581b30d4270ba8ff35bfc6a30f",
    }
    (staging / "audit.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

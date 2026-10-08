#!/usr/bin/env python3
"""Package committed RLCraft sources without altering or including dirty files."""

import argparse
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import subprocess
import tarfile
import zipfile


ROOT = Path(__file__).resolve().parents[3]
SOURCE = "addons/rlcraft-bedrock-edition-1.3/source/"


def check(condition, message):
    if not condition:
        raise ValueError(message)


def archive_bytes(files):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        for name, content in sorted(files.items()):
            entry = zipfile.ZipInfo(name, (2000, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    data = output.getvalue()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        check(archive.testzip() is None, "ZIP CRC check failed")
        check(archive.namelist() == sorted(files), "ZIP member list differs from source")
        for name, content in files.items():
            check(archive.read(name) == content, f"ZIP/source mismatch: {name}")
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ref", default="HEAD", help="Committed Git revision to package")
    args = parser.parse_args()
    revision = subprocess.check_output(
        ["git", "rev-parse", "--verify", f"{args.ref}^{{commit}}"], cwd=ROOT, text=True
    ).strip()
    data = subprocess.check_output(["git", "archive", revision, "--", SOURCE], cwd=ROOT)
    packs = {"behavior-pack": {}, "resource-pack": {}}
    with tarfile.open(fileobj=io.BytesIO(data)) as archive:
        for member in archive.getmembers():
            if member.isdir():
                continue
            check(member.isfile() and member.name.startswith(SOURCE), f"Invalid entry: {member.name}")
            relative = PurePosixPath(member.name[len(SOURCE):])
            check(not relative.is_absolute() and ".." not in relative.parts, "Unsafe source path")
            check(relative.parts[0] in packs and len(relative.parts) > 1, "Unexpected source root")
            check(not any(p in (".DS_Store", "__MACOSX") for p in relative.parts), "System file in source")
            target = packs[relative.parts[0]]
            name = "/".join(relative.parts[1:])
            check(name not in target, f"Duplicate entry: {name}")
            target[name] = archive.extractfile(member).read()

    manifests = {kind: json.loads(files["manifest.json"]) for kind, files in packs.items()}
    versions = [manifest["header"]["version"] for manifest in manifests.values()]
    check(versions[0] == versions[1], "BP/RP version mismatch")
    version = ".".join(map(str, versions[0]))
    for kind, manifest in manifests.items():
        other = manifests["resource-pack" if kind == "behavior-pack" else "behavior-pack"]
        check({"uuid": other["header"]["uuid"], "version": versions[0]} in manifest["dependencies"],
              "Cross-pack dependency mismatch")
        for module in manifest["modules"]:
            if module["type"] in ("data", "resources"):
                check(module["version"] == versions[0], "Module version mismatch")
            if module["type"] == "script":
                check(module["entry"] in packs[kind], "Script entry missing")
        names = list(packs[kind])
        check(len({name.casefold() for name in names}) == len(names), "Case-insensitive path collision")
    check("scripts/rat-loot.js" in packs["behavior-pack"], "Rat fix missing from committed revision")
    check(b"import { handleRatLoot } from './rat-loot.js';" in packs["behavior-pack"]["scripts/main.js"],
          "Rat fix import missing")

    inner = {f"RLCraft-1.3-{kind}-{version}.mcpack": archive_bytes(files) for kind, files in packs.items()}
    output = archive_bytes(inner)
    rebuilt = archive_bytes({f"RLCraft-1.3-{kind}-{version}.mcpack": archive_bytes(files)
                             for kind, files in packs.items()})
    check(output == rebuilt, "Consecutive builds are not byte-identical")
    destination = ROOT / "dist" / f"RLCraft Bedrock Edition 1.3-zh_CN-rat-fix-{version}.mcaddon"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(output)
    staging = ROOT / ".build" / "rlcraft-rat-release"
    staging.mkdir(parents=True, exist_ok=True)
    for name, content in inner.items():
        (staging / name).write_bytes(content)
    digest = hashlib.sha256(output).hexdigest()
    destination.with_suffix(".mcaddon.sha256").write_text(f"{digest}  {destination.name}\n", encoding="utf-8")
    report = {"source_commit": revision, "version": version, "sha256": digest,
              "bytes": len(output), "file_counts": {k: len(v) for k, v in packs.items()},
              "output": str(destination.relative_to(ROOT)), "reproducible": True,
              "gameplay_verified": False}
    (staging / "audit.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

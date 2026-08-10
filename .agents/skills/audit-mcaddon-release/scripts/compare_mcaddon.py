#!/usr/bin/env python3
"""Compare direct-layout or nested-mcpack Minecraft archives by logical pack path."""

from __future__ import annotations

import argparse
import fnmatch
import io
import json
import sys
import zipfile
from pathlib import Path


class AuditError(RuntimeError):
    pass


def safe_members(archive: zipfile.ZipFile, label: str) -> list[zipfile.ZipInfo]:
    members = [item for item in archive.infolist() if not item.is_dir()]
    names = [item.filename for item in members]
    if len(names) != len(set(names)):
        raise AuditError(f"{label}: archive contains duplicate paths")
    folded = [name.casefold() for name in names]
    if len(folded) != len(set(folded)):
        raise AuditError(f"{label}: archive contains case-insensitive path conflicts")
    for item in members:
        name = item.filename
        if name.startswith("/") or "\\" in name or any(part in {"", ".", ".."} for part in name.split("/")):
            raise AuditError(f"{label}: unsafe archive path: {name}")
        if ((item.external_attr >> 16) & 0o170000) == 0o120000:
            raise AuditError(f"{label}: symbolic links are forbidden: {name}")
        if ".DS_Store" in name.split("/") or "__MACOSX" in name.split("/"):
            raise AuditError(f"{label}: forbidden system file: {name}")
    return members


def pack_kind(manifest: dict, label: str) -> str:
    types = {module.get("type") for module in manifest.get("modules", [])}
    if "data" in types and "resources" not in types:
        return "behavior"
    if "resources" in types and "data" not in types:
        return "resources"
    raise AuditError(f"{label}: cannot identify pack from module types {sorted(str(item) for item in types)}")


def read_root_pack(data: bytes, label: str) -> tuple[str, dict[str, bytes]]:
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        members = safe_members(archive, label)
        names = {item.filename for item in members}
        if "manifest.json" not in names:
            raise AuditError(f"{label}: inner pack has no root manifest.json")
        manifest = json.loads(archive.read("manifest.json"))
        return pack_kind(manifest, label), {item.filename: archive.read(item) for item in members}


def read_direct_archive(archive: zipfile.ZipFile, members: list[zipfile.ZipInfo], label: str) -> dict[tuple[str, str], bytes]:
    manifest_names = [item.filename for item in members if item.filename == "manifest.json" or item.filename.endswith("/manifest.json")]
    if not manifest_names:
        raise AuditError(f"{label}: no manifest.json found")
    prefixes: list[tuple[str, str]] = []
    for manifest_name in manifest_names:
        prefix = manifest_name[: -len("manifest.json")]
        kind = pack_kind(json.loads(archive.read(manifest_name)), f"{label}:{manifest_name}")
        prefixes.append((prefix, kind))
    kinds = [kind for _, kind in prefixes]
    if len(kinds) != len(set(kinds)):
        raise AuditError(f"{label}: contains multiple packs of the same kind")
    result: dict[tuple[str, str], bytes] = {}
    for member in members:
        matches = [(prefix, kind) for prefix, kind in prefixes if member.filename.startswith(prefix)]
        if len(matches) != 1:
            raise AuditError(f"{label}: entry does not belong to exactly one pack: {member.filename}")
        prefix, kind = matches[0]
        relative = member.filename[len(prefix) :]
        key = (kind, relative)
        if key in result:
            raise AuditError(f"{label}: duplicate logical path: {kind}:{relative}")
        result[key] = archive.read(member)
    return result


def read_archive(path: Path) -> dict[tuple[str, str], bytes]:
    with zipfile.ZipFile(path) as archive:
        members = safe_members(archive, str(path))
        nested = [item for item in members if item.filename.endswith(".mcpack")]
        if nested:
            if len(nested) != len(members):
                raise AuditError(f"{path}: mixes .mcpack files with other outer entries")
            result: dict[tuple[str, str], bytes] = {}
            for member in nested:
                kind, files = read_root_pack(archive.read(member), f"{path}:{member.filename}")
                for relative, content in files.items():
                    key = (kind, relative)
                    if key in result:
                        raise AuditError(f"{path}: duplicate logical path: {kind}:{relative}")
                    result[key] = content
        else:
            result = read_direct_archive(archive, members, str(path))
    if path.suffix.lower() == ".mcaddon" and {kind for kind, _ in result} != {"behavior", "resources"}:
        raise AuditError(f"{path}: .mcaddon must contain one behavior pack and one resource pack")
    return result


def format_key(key: tuple[str, str]) -> str:
    return f"{key[0]}:{key[1]}"


def report(title: str, keys: list[tuple[str, str]], limit: int) -> None:
    if not keys:
        return
    print(f"{title}:")
    for key in keys[:limit]:
        print(f"  {format_key(key)}")
    if len(keys) > limit:
        print(f"  ... and {len(keys) - limit} more")


def main() -> int:
    parser = argparse.ArgumentParser(description="Compare two Minecraft archives by behavior/resource pack paths")
    parser.add_argument("original", type=Path)
    parser.add_argument("built", type=Path)
    parser.add_argument(
        "--allow-change",
        action="append",
        default=[],
        metavar="KIND:GLOB",
        help="Allow an exact or globbed changed logical path; repeat as needed",
    )
    parser.add_argument("--max-report", type=int, default=200)
    args = parser.parse_args()

    if args.max_report < 1:
        parser.error("--max-report must be positive")
    for pattern in args.allow_change:
        if not (pattern.startswith("behavior:") or pattern.startswith("resources:")):
            parser.error(f"invalid --allow-change pattern: {pattern}")

    original = read_archive(args.original)
    built = read_archive(args.built)
    missing = sorted(original.keys() - built.keys())
    added = sorted(built.keys() - original.keys())
    changed = sorted(key for key in original.keys() & built.keys() if original[key] != built[key])
    unexpected = [
        key
        for key in changed
        if not any(fnmatch.fnmatchcase(format_key(key), pattern) for pattern in args.allow_change)
    ]

    print(
        f"original={len(original)} built={len(built)} missing={len(missing)} "
        f"added={len(added)} changed={len(changed)} unexpected={len(unexpected)}"
    )
    report("missing", missing, args.max_report)
    report("added", added, args.max_report)
    report("changed", changed, args.max_report)
    report("unexpected changes", unexpected, args.max_report)
    return 1 if missing or added or unexpected else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AuditError, json.JSONDecodeError, OSError, zipfile.BadZipFile) as error:
        print(f"error: {error}", file=sys.stderr)
        raise SystemExit(2)

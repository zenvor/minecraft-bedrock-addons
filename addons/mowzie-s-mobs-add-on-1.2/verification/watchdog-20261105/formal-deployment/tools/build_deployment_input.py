import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import stat
import uuid
import zipfile


ROOT = Path(__file__).resolve().parents[6]
ADDON = ROOT / "addons/mowzie-s-mobs-add-on-1.2"
OUTPUT = Path(__file__).resolve().parent.parent
BASELINE = ADDON / "releases/Mowzie's Mobs Add-On 1.2-zh_CN.mcaddon"
CANDIDATE = ROOT / "dist/Mowzie's Mobs Add-On 1.2-zh_CN.mcaddon"
ARTIFACT_NAME = "Mowzie's Mobs Add-On 1.2-zh_CN-1.0.11.mcaddon"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def audit(archive, label):
    assert archive.testzip() is None
    infos = archive.infolist()
    names = [item.filename for item in infos]
    assert len(names) == len(set(names))
    files = [name for name in names if not name.endswith("/")]
    assert len(files) == len({name.casefold() for name in files})
    for item in infos:
        path = PurePosixPath(item.filename)
        assert not path.is_absolute() and ".." not in path.parts
        assert "\\" not in item.filename
        assert not any(
            part in [".DS_Store", "__MACOSX"] or part.startswith("._")
            for part in path.parts
        )
        assert not stat.S_ISLNK(item.external_attr >> 16), (label, item.filename)


def read_bundle(path):
    packs = {}
    with zipfile.ZipFile(path) as outer:
        audit(outer, str(path))
        entries = [item for item in outer.infolist() if not item.is_dir()]
        assert len(entries) == 2
        for entry in entries:
            raw = outer.read(entry)
            with zipfile.ZipFile(io.BytesIO(raw)) as inner:
                audit(inner, entry.filename)
                files = {
                    item.filename: inner.read(item)
                    for item in inner.infolist()
                    if not item.is_dir()
                }
                manifest = json.loads(files["manifest.json"])
                kind = (
                    "behavior"
                    if any(module["type"] == "data" for module in manifest["modules"])
                    else "resource"
                )
                assert kind not in packs
                packs[kind] = {
                    "outer_name": entry.filename,
                    "inner_sha256": digest(raw),
                    "files": files,
                    "manifest": manifest,
                }
    assert packs.keys() == {"behavior", "resource"}
    return packs


def main():
    baseline = read_bundle(BASELINE)
    candidate = read_bundle(CANDIDATE)
    differences = []
    baseline_files = {}
    for kind in ["behavior", "resource"]:
        before = baseline[kind]
        after = candidate[kind]
        assert before["files"].keys() == after["files"].keys()
        assert before["manifest"]["header"]["uuid"] == after["manifest"]["header"]["uuid"]
        assert before["manifest"]["header"]["version"] == [1, 0, 10]
        assert after["manifest"]["header"]["version"] == [1, 0, 11]
        baseline_files[kind] = {
            name: digest(value) for name, value in sorted(before["files"].items())
        }
        for name in sorted(before["files"]):
            if before["files"][name] != after["files"][name]:
                differences.append(
                    {
                        "pack": kind,
                        "path": name,
                        "beforeSha256": digest(before["files"][name]),
                        "afterSha256": digest(after["files"][name]),
                    }
                )
    assert [(item["pack"], item["path"]) for item in differences] == [
        ("behavior", "manifest.json"),
        ("behavior", "scripts/main.js"),
        ("resource", "manifest.json"),
    ]
    config = {
        "owner_id": str(uuid.uuid4()),
        "artifact_name": ARTIFACT_NAME,
        "sha256": digest(CANDIDATE.read_bytes()),
        "baseline_files": baseline_files,
        "protected_paths": [
            "/opt/minecraft-bedrock/bedrock_server",
            "/opt/minecraft-bedrock/server.properties",
        ],
    }
    audit_result = {
        "candidateSha256": config["sha256"],
        "candidateBytes": CANDIDATE.stat().st_size,
        "baselineVersion": [1, 0, 10],
        "candidateVersion": [1, 0, 11],
        "differences": differences,
        "behaviorFiles": len(candidate["behavior"]["files"]),
        "resourceFiles": len(candidate["resource"]["files"]),
        "behaviorInnerSha256": candidate["behavior"]["inner_sha256"],
        "resourceInnerSha256": candidate["resource"]["inner_sha256"],
        "archiveSafety": "passed",
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "deployment-input.json").write_text(
        json.dumps(config, ensure_ascii=False, indent=2) + "\n"
    )
    (OUTPUT / "release-audit.json").write_text(
        json.dumps(audit_result, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps(audit_result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

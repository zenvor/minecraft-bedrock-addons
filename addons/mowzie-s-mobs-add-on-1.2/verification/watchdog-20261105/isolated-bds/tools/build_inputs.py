import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import shutil
import zipfile


ROOT = Path(__file__).resolve().parents[6]
PROOF = Path(__file__).resolve().parent.parent
BASELINE = ROOT / "addons/mowzie-s-mobs-add-on-1.2/releases/Mowzie's Mobs Add-On 1.2-zh_CN.mcaddon"
CANDIDATE = ROOT / "dist/Mowzie's Mobs Add-On 1.2-zh_CN.mcaddon"
SOURCE_MAIN = ROOT / "addons/mowzie-s-mobs-add-on-1.2/source/behavior-pack/scripts/main.js"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def archive_bytes(files, compress=True):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        for name, content in sorted(files.items()):
            path = PurePosixPath(name)
            assert not path.is_absolute() and ".." not in path.parts and "\\" not in name
            assert not any(part in [".DS_Store", "__MACOSX"] or part.startswith("._") for part in path.parts)
            info = zipfile.ZipInfo(name, (2000, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(
                info,
                content,
                compress_type=zipfile.ZIP_DEFLATED if compress else zipfile.ZIP_STORED,
                compresslevel=9 if compress else None,
            )
    data = output.getvalue()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        assert archive.testzip() is None
        assert archive.namelist() == sorted(files)
        assert all(archive.read(name) == value for name, value in files.items())
    return data


def read_bundle(path):
    packs = {}
    with zipfile.ZipFile(path) as outer:
        assert outer.testzip() is None and len(outer.namelist()) == 2
        for outer_name in outer.namelist():
            with zipfile.ZipFile(io.BytesIO(outer.read(outer_name))) as inner:
                assert inner.testzip() is None
                files = {
                    name: inner.read(name)
                    for name in inner.namelist()
                    if not name.endswith("/")
                }
                manifest = json.loads(files["manifest.json"])
                kind = (
                    "behavior-pack"
                    if any(module["type"] == "data" for module in manifest["modules"])
                    else "resource-pack"
                )
                assert kind not in packs
                packs[kind] = {
                    "outer_name": outer_name,
                    "files": files,
                    "manifest": manifest,
                }
    return packs


def instrument(packs, scenario, expected_fixed, harness):
    result = {
        kind: {
            "outer_name": value["outer_name"],
            "files": dict(value["files"]),
            "manifest": value["manifest"],
        }
        for kind, value in packs.items()
    }
    main = result["behavior-pack"]["files"]["scripts/main.js"]
    config = {
        "scenario": scenario,
        "expectedFixed": expected_fixed,
        "baseScriptSha256": digest(main),
        "packVersion": result["behavior-pack"]["manifest"]["header"]["version"],
    }
    prefix = b"\nconst MOWZIE_PROBE_CONFIG = " + json.dumps(
        config, separators=(",", ":")
    ).encode() + b";\n"
    instrumented = main + prefix + harness
    result["behavior-pack"]["files"]["scripts/main.js"] = instrumented
    return result, {
        **config,
        "instrumentedScriptSha256": digest(instrumented),
    }


def bundle_bytes(packs):
    files = {}
    for value in packs.values():
        files[value["outer_name"]] = archive_bytes(value["files"])
    return archive_bytes(files, compress=False)


def main():
    output = PROOF / "inputs"
    packages = PROOF / "packages"
    assert not output.exists() and not packages.exists()
    output.mkdir(parents=True)
    packages.mkdir(parents=True)
    baseline = read_bundle(BASELINE)
    candidate = read_bundle(CANDIDATE)
    assert baseline.keys() == candidate.keys() == {"behavior-pack", "resource-pack"}
    differences = []
    for kind in sorted(baseline):
        before = baseline[kind]["files"]
        after = candidate[kind]["files"]
        assert before.keys() == after.keys()
        for name in sorted(before):
            if before[name] != after[name]:
                differences.append(
                    {
                        "pack": kind,
                        "path": name,
                        "beforeSha256": digest(before[name]),
                        "afterSha256": digest(after[name]),
                        "beforeBytes": len(before[name]),
                        "afterBytes": len(after[name]),
                    }
                )
    assert [item["pack"] + "/" + item["path"] for item in differences] == [
        "behavior-pack/scripts/main.js"
    ]
    assert candidate["behavior-pack"]["files"]["scripts/main.js"] == SOURCE_MAIN.read_bytes()
    for kind in baseline:
        assert baseline[kind]["manifest"]["header"]["uuid"] == candidate[kind]["manifest"]["header"]["uuid"]
        assert baseline[kind]["manifest"]["header"]["version"] == [1, 0, 10]
        assert candidate[kind]["manifest"]["header"]["version"] == [1, 0, 10]
    harness = (Path(__file__).with_name("probe.js")).read_bytes()
    scenarios = {}
    for scenario, packs, expected_fixed in [
        ("baseline", baseline, False),
        ("candidate", candidate, True),
    ]:
        instrumented, config = instrument(packs, scenario, expected_fixed, harness)
        package = bundle_bytes(instrumented)
        assert package == bundle_bytes(instrumented)
        target = output / f"mowzie-{scenario}-instrumented.mcaddon"
        target.write_bytes(package)
        reread = read_bundle(target)
        actual_main = reread["behavior-pack"]["files"]["scripts/main.js"]
        assert digest(actual_main) == config["instrumentedScriptSha256"]
        scenarios[scenario] = {
            **config,
            "package": str(target.relative_to(PROOF)),
            "packageSha256": digest(package),
            "behaviorFiles": len(instrumented["behavior-pack"]["files"]),
            "resourceFiles": len(instrumented["resource-pack"]["files"]),
        }
    baseline_copy = packages / "Mowzie-1.0.10-baseline.mcaddon"
    candidate_copy = packages / "Mowzie-1.0.10-watchdog-candidate.mcaddon"
    shutil.copy2(BASELINE, baseline_copy)
    shutil.copy2(CANDIDATE, candidate_copy)
    report = {
        "baseline": {
            "path": str(baseline_copy.relative_to(PROOF)),
            "sha256": digest(baseline_copy.read_bytes()),
        },
        "candidate": {
            "path": str(candidate_copy.relative_to(PROOF)),
            "sha256": digest(candidate_copy.read_bytes()),
            "matchesWorkspaceMain": True,
        },
        "packVersion": [1, 0, 10],
        "uuidVersionsUnchanged": True,
        "differences": differences,
        "scenarios": scenarios,
        "instrumentation": "identical probe appended to the real scripts/main.js module",
    }
    (PROOF / "build.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

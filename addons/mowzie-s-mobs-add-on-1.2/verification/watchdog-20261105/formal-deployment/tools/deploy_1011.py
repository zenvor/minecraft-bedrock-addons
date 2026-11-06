import hashlib
import io
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import time
import traceback
import zipfile


STAGE = Path(sys.argv[1]).resolve()
assert str(STAGE).startswith("/var/tmp/mowzie-release-1.0.11-")
CONFIG = json.loads((STAGE / "deployment-input.json").read_text())
ROOT = Path("/opt/minecraft-bedrock")
WORLD = ROOT / "worlds/RLCraft 新纪元"
SERVICE = "minecraft-bedrock.service"
WATCHER = "bedrock-activity-backup.service"
IDS = {
    "behavior": "273b68fd-40a3-428d-b605-1e24cc7d8b93",
    "resource": "1a01d08a-7325-4c18-bd42-f42921067107",
}


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def digest(path):
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(data)
    return value.hexdigest()


def tree(path):
    return {
        str(item.relative_to(path)): digest(item)
        for item in path.rglob("*")
        if item.is_file()
    }


def logs(since):
    return run(
        "journalctl",
        "-u",
        SERVICE,
        "--since",
        "@" + str(since),
        "-o",
        "cat",
        "--no-pager",
    )


def console(command):
    subprocess.run(
        [
            "timeout",
            "5",
            "sh",
            "-c",
            'printf "%s\\n" "$1" > /run/minecraft-bedrock/console',
            "sh",
            command,
        ],
        check=True,
    )


def player_count(require_zero=True):
    since = int(time.time())
    console("list")
    for _ in range(20):
        time.sleep(0.25)
        matches = re.findall(r"There are (\d+)/(\d+) players online:", logs(since))
        if matches:
            players, capacity = [int(value) for value in matches[-1]]
            if require_zero:
                assert players == 0, "Player online; deployment stopped"
            return {"checked_unix": since, "players": players, "capacity": capacity}
    raise RuntimeError("No player list response")


def audit(archive):
    assert archive.testzip() is None
    names = archive.namelist()
    assert len(names) == len(set(names)) == len({name.casefold() for name in names})
    for item in archive.infolist():
        name = item.filename
        assert not item.is_dir() and not name.startswith("/") and "\\" not in name
        assert not any(
            part in ["", ".", "..", ".DS_Store", "__MACOSX"] or part.startswith("._")
            for part in name.split("/")
        )
        assert not stat.S_ISLNK(item.external_attr >> 16)


def protected():
    return {path: digest(Path(path)) for path in CONFIG["protected_paths"]}


def metadata(path):
    value = path.stat()
    return {
        "uid": value.st_uid,
        "gid": value.st_gid,
        "mode": stat.S_IMODE(value.st_mode),
    }


def atomic(path, raw, file_metadata):
    temporary = path.with_name(path.name + ".mowzie-1011-tmp")
    assert not temporary.exists()
    temporary.write_bytes(raw)
    os.chown(temporary, file_metadata["uid"], file_metadata["gid"])
    os.chmod(temporary, file_metadata["mode"])
    os.replace(temporary, path)


def startup(since, version):
    for _ in range(90):
        time.sleep(1)
        text = logs(since)
        if "Server started." in text:
            assert run("systemctl", "is-active", SERVICE) == "active"
            assert any(
                "Pack Stack -" in line
                and IDS["behavior"] in line
                and "version: " + version in line
                for line in text.splitlines()
            )
            return text
    raise RuntimeError("BDS startup not confirmed")


def save_failure(error, since):
    failure = {
        "error": str(error),
        "traceback": traceback.format_exc(),
        "rollback_status": "pending",
    }
    try:
        (STAGE / "failed-deployment.log").write_text(logs(since))
    except Exception as log_error:
        failure["log_error"] = str(log_error)
    (STAGE / "failure.json").write_text(json.dumps(failure, indent=2))
    return failure


def confirm_stopped():
    pid = int(run("systemctl", "show", SERVICE, "-p", "MainPID", "--value"))
    subprocess.run(["systemctl", "stop", SERVICE], check=True, timeout=90)
    assert run("systemctl", "show", SERVICE, "-p", "MainPID", "--value") == "0"
    assert pid == 0 or not Path(f"/proc/{pid}").exists()


def rollback_restore(plan, state, rollback):
    for item in plan["plans"]:
        old = Path(item["old"])
        if state[item["kind"]]["installed"]:
            old.rename(rollback / (item["kind"] + "-failed-new"))
        if state[item["kind"]]["retired"]:
            (rollback / (item["kind"] + "-retired")).rename(old)
        atomic(
            Path(item["stack"]),
            item["original_stack"].encode(),
            item["stack_metadata"],
        )
        assert tree(old) == CONFIG["baseline_files"][item["kind"]]
        assert Path(item["stack"]).read_text() == item["original_stack"]
    restarted = int(time.time())
    subprocess.run(["systemctl", "start", SERVICE], check=True)
    try:
        startup(restarted, "1.0.10")
    finally:
        (STAGE / "rollback-startup.log").write_text(logs(restarted))
    subprocess.run(["systemctl", "start", WATCHER], check=True)
    assert run("systemctl", "is-active", WATCHER) == "active"
    assert protected() == plan["protected_before"]
    print("ROLLED_BACK_TO_1.0.10", flush=True)


if sys.argv[2] == "prepare":
    artifact = STAGE / CONFIG["artifact_name"]
    assert digest(artifact) == CONFIG["sha256"]
    assert run("systemctl", "is-active", SERVICE) == "active"
    assert run("systemctl", "is-active", WATCHER) == "active"
    properties = dict(
        line.split("=", 1)
        for line in (ROOT / "server.properties").read_text().splitlines()
        if "=" in line and not line.startswith("#")
    )
    assert properties["level-name"] == WORLD.name
    protected_before = protected()
    players = player_count()
    plans = []
    with zipfile.ZipFile(artifact) as outer:
        audit(outer)
        assert len(outer.namelist()) == 2
        for name in outer.namelist():
            assert name.endswith(".mcpack")
            with zipfile.ZipFile(io.BytesIO(outer.read(name))) as inner:
                audit(inner)
                manifest = json.loads(inner.read("manifest.json"))
                kind = next(
                    key for key, identifier in IDS.items() if identifier == manifest["header"]["uuid"]
                )
                assert manifest["header"]["version"] == [1, 0, 11]
                other = IDS["resource" if kind == "behavior" else "behavior"]
                assert {"uuid": other, "version": [1, 0, 11]} in manifest["dependencies"]
                assert all(
                    module["version"] == [1, 0, 11]
                    for module in manifest["modules"]
                    if module["type"] in ["data", "resources"]
                )
                new = STAGE / (kind + "-new")
                assert not new.exists()
                inner.extractall(new)
                stack = WORLD / ("world_" + kind + "_packs.json")
                original_stack = stack.read_bytes()
                entries = json.loads(original_stack)
                identifiers = [entry["pack_id"] for entry in entries]
                assert len(set(identifiers)) == len(identifiers)
                assert identifiers.count(IDS[kind]) == 1
                index = identifiers.index(IDS[kind])
                assert entries[index]["version"] == [1, 0, 10]
                matches = []
                for base in [
                    WORLD / (kind + "_packs"),
                    ROOT / (kind + "_packs"),
                    ROOT / ("development_" + kind + "_packs"),
                ]:
                    for path, directories, files in os.walk(base):
                        if "manifest.json" not in files:
                            continue
                        try:
                            installed_manifest = json.loads(
                                (Path(path) / "manifest.json").read_text()
                            )
                        except (ValueError, OSError):
                            continue
                        if installed_manifest.get("header", {}).get("uuid") == IDS[kind]:
                            matches.append(Path(path))
                        directories[:] = []
                assert len(matches) == 1
                old = matches[0]
                assert tree(old) == CONFIG["baseline_files"][kind]
                old_metadata = metadata(old)
                assert all(
                    item.stat().st_uid == old_metadata["uid"]
                    and item.stat().st_gid == old_metadata["gid"]
                    for item in old.rglob("*")
                )
                entries[index]["version"] = [1, 0, 11]
                plans.append(
                    {
                        "kind": kind,
                        "old": str(old),
                        "new": str(new),
                        "stack": str(stack),
                        "original_stack": original_stack.decode(),
                        "new_entries": entries,
                        "stack_metadata": metadata(stack),
                        "pack_metadata": old_metadata,
                        "new_files": tree(new),
                        "index": index,
                    }
                )
    assert {plan["kind"] for plan in plans} == {"behavior", "resource"}
    assert shutil.disk_usage(ROOT).free > 1024**3 + 2 * sum(
        item.stat().st_size
        for plan in plans
        for item in Path(plan["old"]).rglob("*")
        if item.is_file()
    )
    rollback = Path("/opt/minecraft-addon-rollbacks") / (
        "mowzie-1.0.11-" + time.strftime("%Y%m%dT%H%M%S%z")
    )
    rollback.mkdir(parents=True, exist_ok=False)
    os.chmod(rollback, 0o700)
    for plan in plans:
        old = Path(plan["old"])
        saved = rollback / (plan["kind"] + "-old-copy")
        shutil.copytree(old, saved)
        for item in [saved, *saved.rglob("*")]:
            os.chown(item, plan["pack_metadata"]["uid"], plan["pack_metadata"]["gid"])
        assert tree(saved) == CONFIG["baseline_files"][plan["kind"]]
        shutil.copy2(plan["stack"], rollback / Path(plan["stack"]).name)
    record = {
        "owner_id": CONFIG["owner_id"],
        "sha256": CONFIG["sha256"],
        "rollback": str(rollback),
        "plans": plans,
        "players_prepare": players,
        "protected_before": protected_before,
    }
    (STAGE / "plan.json").write_text(json.dumps(record, ensure_ascii=False, indent=2))
    (rollback / "plan.json").write_text(json.dumps(record, ensure_ascii=False, indent=2))
    print(
        json.dumps(
            {
                "prepared": True,
                "rollback": str(rollback),
                "players": players,
                "pack_stack_indices": {
                    plan["kind"]: plan["index"] for plan in plans
                },
            }
        ),
        flush=True,
    )
    raise SystemExit(0)


assert sys.argv[2] == "deploy"
plan = json.loads((STAGE / "plan.json").read_text())
assert plan["owner_id"] == CONFIG["owner_id"]
assert protected() == plan["protected_before"]
rollback = Path(plan["rollback"])
for item in plan["plans"]:
    assert Path(item["stack"]).read_text() == item["original_stack"]
    assert tree(Path(item["old"])) == CONFIG["baseline_files"][item["kind"]]
    assert tree(Path(item["new"])) == item["new_files"]
players = player_count()
state = {
    item["kind"]: {"retired": False, "installed": False}
    for item in plan["plans"]
}
stopped = False
attempt_started = int(time.time())
try:
    stopped = True
    console("stop")
    for _ in range(120):
        if run("systemctl", "show", SERVICE, "-p", "MainPID", "--value") == "0":
            break
        time.sleep(0.5)
    assert run("systemctl", "show", SERVICE, "-p", "MainPID", "--value") == "0"
    subprocess.run(["systemctl", "stop", SERVICE], check=True)
    assert run("systemctl", "show", SERVICE, "-p", "MainPID", "--value") == "0"
    assert run("systemctl", "show", SERVICE, "-p", "Result", "--value") == "success"
    assert run("systemctl", "show", SERVICE, "-p", "ExecMainStatus", "--value") == "0"
    print("CLEAN_STOP_CONFIRMED", flush=True)
    for item in plan["plans"]:
        old = Path(item["old"])
        old.rename(rollback / (item["kind"] + "-retired"))
        state[item["kind"]]["retired"] = True
        shutil.move(item["new"], str(old))
        state[item["kind"]]["installed"] = True
        subprocess.run(
            [
                "chown",
                "-R",
                str(item["pack_metadata"]["uid"])
                + ":"
                + str(item["pack_metadata"]["gid"]),
                str(old),
            ],
            check=True,
        )
        os.chmod(old, item["pack_metadata"]["mode"])
        atomic(
            Path(item["stack"]),
            (json.dumps(item["new_entries"], ensure_ascii=False, indent=2) + "\n").encode(),
            item["stack_metadata"],
        )
    started = int(time.time())
    subprocess.run(["systemctl", "start", SERVICE], check=True)
    startup_text = startup(started, "1.0.11")
    subprocess.run(["systemctl", "start", WATCHER], check=True)
    assert run("systemctl", "is-active", WATCHER) == "active"
    for item in plan["plans"]:
        assert tree(Path(item["old"])) == item["new_files"]
        assert json.loads(Path(item["stack"]).read_text()) == item["new_entries"]
        assert all(
            path.stat().st_uid == item["pack_metadata"]["uid"]
            and path.stat().st_gid == item["pack_metadata"]["gid"]
            for path in Path(item["old"]).rglob("*")
        )
    assert protected() == plan["protected_before"]
    time.sleep(8)
    players_after = player_count(require_zero=False)
    startup_text = logs(started)
    (STAGE / "startup.log").write_text(startup_text)
    errors = [
        line
        for line in startup_text.splitlines()
        if " ERROR]" in line or "[Watchdog]" in line
    ]
    assert not errors, "Startup errors: " + "\n".join(errors[:8])
    result = {
        "deployed": True,
        "version": "1.0.11",
        "archive_sha256": CONFIG["sha256"],
        "rollback": str(rollback),
        "started_unix": started,
        "bds_pid": int(run("systemctl", "show", SERVICE, "-p", "MainPID", "--value")),
        "backup_service_pid": int(
            run("systemctl", "show", WATCHER, "-p", "MainPID", "--value")
        ),
        "bds_active": True,
        "activity_backup_active": True,
        "runtime_pack_stack_confirmed": True,
        "files_match_archive": True,
        "other_world_pack_entries_and_order_unchanged": True,
        "protected_files_unchanged": True,
        "startup_errors": errors,
        "players_before_stop": players,
        "players_after_start": players_after,
        "gameplay_verified": False,
        "existing_backups_modified": False,
    }
    (STAGE / "deployment-result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2)
    )
    (rollback / "deployment-result.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2)
    )
    print(json.dumps(result, ensure_ascii=False), flush=True)
except BaseException as deployment_error:
    failure = save_failure(deployment_error, attempt_started)
    if stopped:
        try:
            confirm_stopped()
        except BaseException as stop_error:
            failure["rollback_status"] = "blocked"
            failure["rollback_error"] = str(stop_error)
            (STAGE / "failure.json").write_text(json.dumps(failure, indent=2))
            raise RuntimeError("Rollback blocked: BDS stop not confirmed; files retained") from deployment_error
        try:
            rollback_restore(plan, state, rollback)
        except BaseException as rollback_error:
            failure["rollback_status"] = "failed"
            failure["rollback_error"] = str(rollback_error)
            failure["rollback_traceback"] = traceback.format_exc()
            (STAGE / "failure.json").write_text(json.dumps(failure, indent=2))
            raise RuntimeError("Deployment failed and rollback did not complete") from deployment_error
        failure["rollback_status"] = "rolled_back"
        (STAGE / "failure.json").write_text(json.dumps(failure, indent=2))
    raise

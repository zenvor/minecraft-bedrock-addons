import hashlib
import json
from pathlib import Path
import sys


ROOT = Path(sys.argv[1])
build = json.loads((ROOT / "build.json").read_text())
results = {}
for scenario in ["baseline", "candidate"]:
    case = ROOT / "cases" / scenario
    result = json.loads((case / "result.json").read_text())
    complete = result["complete"]
    assert result["reason"] == "complete"
    assert result["server_started"] is True
    assert result["planned_disposable_termination"] is True
    assert complete["fixtureLoaded"] is True
    assert complete["scenario"] == scenario
    assert complete["initialRegistered"] == 6
    assert complete["duplicateCounts"] == [1] * 6
    assert complete["deathCleanup"] is True
    assert complete["periodicTasks"] is True
    assert complete["damage"]["directAttackerMatches"] is True
    assert complete["damage"]["projectileAttackerMatches"] is True
    assert result["test_netns"] != result["host_netns"]
    loaded_script = case / "behavior_packs/mowzie/scripts/main.js"
    loaded_script_hash = hashlib.sha256(loaded_script.read_bytes()).hexdigest()
    assert loaded_script_hash == build["scenarios"][scenario]["instrumentedScriptSha256"]
    for category in ["behavior", "resource"]:
        manifest = json.loads((case / f"{category}_packs/mowzie/manifest.json").read_text())
        references = json.loads(
            (case / f"worlds/mowzie-probe/world_{category}_packs.json").read_text()
        )
        assert {
            "pack_id": manifest["header"]["uuid"],
            "version": manifest["header"]["version"],
        } in references
    memory_events = {
        line.split()[0]: int(line.split()[1])
        for line in result["memory.events"].splitlines()
    }
    assert memory_events.get("oom", 0) == 0
    assert memory_events.get("oom_kill", 0) == 0
    assert not any(value.get("exited") for value in result["protected_after"].values())
    samples = [json.loads(line) for line in (case / "resources.jsonl").read_text().splitlines()]
    guard = [json.loads(line) for line in (case / "guard.jsonl").read_text().splitlines() if line]
    results[scenario] = {
        "complete": complete,
        "targetErrors": result["target_errors"],
        "scriptErrors": result["script_errors"],
        "allErrors": result["all_errors"],
        "memoryEvents": memory_events,
        "loadedScriptSha256": loaded_script_hash,
        "peakMemoryBytes": max(int(sample["memory.current"]) for sample in samples),
        "minHostAvailableBytes": min(sample["available"] for sample in samples),
        "maxThreads": max(int(sample["test"].get("Threads", "0").split()[0]) for sample in samples),
        "guardTerminations": [sample for sample in guard if "terminated_test_only" in sample],
        "returnCode": result["return_code"],
        "elapsedSeconds": result["elapsed_s"],
    }

baseline = results["baseline"]
candidate = results["candidate"]
assert baseline["complete"]["removedRetained"] == 4
assert baseline["complete"]["removedInvalid"] == 4
assert baseline["complete"]["damage"]["environmentalHurt"] is not True
assert baseline["targetErrors"] >= 1
assert baseline["scriptErrors"] == baseline["allErrors"]
assert all(
    "_0x4b2e12" in line and "getComponent" in line
    for line in baseline["scriptErrors"]
)
assert candidate["complete"]["removedRetained"] == 0
assert candidate["complete"]["removedInvalid"] == 0
assert candidate["complete"]["damage"]["environmentalHurt"] is True
assert candidate["targetErrors"] == 0
assert candidate["scriptErrors"] == []
assert candidate["allErrors"] == []
assert baseline["guardTerminations"] == []
assert candidate["guardTerminations"] == []

summary = {
    "comparisonPassed": True,
    "baseline": baseline,
    "candidate": candidate,
    "chunkUnloadReloadVerified": {
        scenario: results[scenario]["complete"]["chunkReload"]["unloadObserved"]
        and results[scenario]["complete"]["chunkReload"]["reloadObserved"]
        and results[scenario]["complete"]["chunkReload"]["registeredAfterReload"]
        for scenario in results
    },
    "scope": {
        "verified": [
            "full Mowzie behavior and resource packs installed in the isolated world, with the behavior pack activated",
            "registration and duplicate registration",
            "invalid reference cleanup differential",
            "death cleanup",
            "periodic registry tasks",
            "sculptor environmental damage and entity/projectile attacker attribution",
        ],
        "notProven": [
            "the exact cause of the 2026-11-05 00:41 watchdog hang",
            "long-duration production stability",
            "client rendering or multiplayer behavior",
            "normal save-and-stop shutdown",
        ],
    },
}
(ROOT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(summary, ensure_ascii=False, indent=2))

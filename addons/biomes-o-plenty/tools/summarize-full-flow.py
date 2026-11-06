import json
from pathlib import Path
import sys


root = Path(sys.argv[1])
summary = {"runs": {}, "comparison": {}}
cases = {}
for variant in ("baseline", "candidate"):
    folder = root / (variant + "-full")
    events = [json.loads(line) for line in (folder / "probe-events.jsonl").read_text().splitlines()]
    result = json.loads((folder / "run-result.json").read_text())
    samples = [json.loads(line) for line in (folder / "resources.jsonl").read_text().splitlines()]
    records = [event for event in events if event["event"] == "case"]
    assert result["complete"] and result["reason"] == "complete"
    assert len(records) == 19 and all(record["passed"] for record in records)
    assert not any(event["event"] == "fatal" for event in events)
    cases[variant] = {record["name"]: record for record in records}
    cpu = dict(line.split() for line in result["cpu.stat"].splitlines())
    memory = dict(line.split() for line in result["memory.events"].splitlines())
    assert int(memory["oom"]) == int(memory["oom_kill"]) == int(memory["max"]) == 0
    assert result["test_netns"] != result["host_netns"]
    summary["runs"][variant] = {
        "metadata": next(event for event in events if event["event"] == "metadata"),
        "cases": len(records), "structure_checks": sum(len(r.get("verifications", [])) for r in records),
        "template_blocks_checked": sum(v["checked"] for r in records for v in r.get("verifications", [])),
        "mismatches": sum(v["mismatches"] for r in records for v in r.get("verifications", [])),
        "first_tick_delay_ms": next(event["gapMs"] for event in events if event["event"] == "tick"),
        "max_case_tick_gap_ms": max(event["gapMs"] for event in events
                                    if event["event"] == "tick" and event["stage"] != "startup"),
        "cpu_seconds": int(cpu["usage_usec"]) / 1_000_000,
        "elapsed_seconds": result["elapsed_s"],
        "cpu_percent_one_core": int(cpu["usage_usec"]) / 10_000 / result["elapsed_s"],
        "memory_max_sample_mib": max(int(sample["memory.current"]) for sample in samples) / 1024**2,
        "host_min_available_mib": result["host_min_available_bytes"] / 1024**2,
        "memory_events": memory, "exit_code": result["return_code"],
        "stop_was_bounded_termination": result["return_code"] == -15,
    }

assert cases["baseline"].keys() == cases["candidate"].keys()
for name, original in cases["baseline"].items():
    candidate = cases["candidate"][name]
    fields = ("type", "square", "roots", "selected", "featureResults", "errors", "verifications",
              "obstacle", "itemBefore", "itemAfter", "interactionInjected", "denyVerified")
    for field in fields:
        assert original.get(field) == candidate.get(field), (name, field)
    spaces = lambda record: [{key: value for key, value in item.items() if key != "elapsedMs"}
                             for item in record["space"]]
    assert spaces(original) == spaces(candidate), (name, "space")
    summary["comparison"][name] = {
        "same_observed_outcome": True,
        "baseline_grow_ms": original["growMs"], "candidate_grow_ms": candidate["growMs"],
        "baseline_space_ms": [item["elapsedMs"] for item in original["space"]],
        "candidate_space_ms": [item["elapsedMs"] for item in candidate["space"]],
    }
summary["limitations"] = [
    "Bone-meal event uses captured actual subscriber and native-container-backed Player facade; no real client click.",
    "Natural cadence and probability threshold unchanged; scoped random values control rejection/selection.",
    "Forced structure selections test actual configured assets; this is not an exhaustive real-engine test of every tree.",
    "Full-pack instances required bounded termination after stop; functional completion is separate from graceful shutdown.",
    "Date.now resolution is 1 ms; per-case timings are observations, not performance distributions.",
    "No formal world, backup, configuration or service changes; historical watchdog root cause remains unproven.",
]
(root / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(summary, ensure_ascii=False, indent=2))

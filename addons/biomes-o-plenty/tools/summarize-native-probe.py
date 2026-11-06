import collections
import json
import math
from pathlib import Path
import statistics
import sys


def distribution(values):
    values = sorted(values)
    return {
        "samples": len(values),
        "p50": statistics.median(values),
        "p95": values[math.ceil(len(values) * 0.95) - 1],
        "max": max(values),
    }


root = Path(sys.argv[1])
result = {}
for name in ["round1-bulk", "round2-hybrid"]:
    folder = root / name
    events = [json.loads(line) for line in (folder / "probe-events.jsonl").read_text().splitlines()]
    complete_index = next(i for i, event in enumerate(events) if event["event"] == "complete")
    groups = collections.defaultdict(list)
    for event in events:
        if event["event"] == "sample":
            groups[(event["scenario"], event["count"], event["variant"])].append(event["elapsedMs"])
    samples = [
        {"scenario": scenario, "count": count, "variant": variant, "elapsed_ms": distribution(values)}
        for (scenario, count, variant), values in groups.items()
    ]
    tick_groups = collections.defaultdict(list)
    for event in events[:complete_index]:
        if event["event"] != "tick":
            continue
        stage = event["stage"]
        if stage == "idle-baseline":
            tick_groups["idle"].append(event["gapMs"])
        elif "/warmup/" not in stage and stage.endswith(("/before", "/after")):
            tick_groups[stage.rsplit("/", 1)[1]].append(event["gapMs"])
    resources = [json.loads(line) for line in (folder / "resources.jsonl").read_text().splitlines()]
    final = json.loads((folder / "run-result.json").read_text())
    cpu = {line.split()[0]: int(line.split()[1]) for line in final["cpu.stat"].splitlines()}
    summary = {
        "fixture": json.loads((folder / "fixture-metadata.json").read_text()),
        "sample_count": sum(len(values) for values in groups.values()),
        "latencies": samples,
        "tick_gap_ms_by_stage": {stage: distribution(values) for stage, values in tick_groups.items()},
        "resources": {
            "sampled_cgroup_memory_max_mib": max(int(row["memory.current"]) / 1024**2 for row in resources),
            "observed_process_vmhwm_mib": max(int(row["test"]["VmHWM"].split()[0]) / 1024 for row in resources if "VmHWM" in row["test"]),
            "host_min_available_mib": final["host_min_available_bytes"] / 1024**2,
            "cpu_seconds": cpu["usage_usec"] / 1000000,
            "wall_seconds": final["elapsed_s"],
            "mean_cpu_single_core_percent": cpu["usage_usec"] / 1000000 / final["elapsed_s"] * 100,
            "cpu_throttled_seconds": cpu["throttled_usec"] / 1000000,
            "memory_events": final["memory.events"],
        },
        "unloaded": [event for event in events if event["event"] in ["unloaded", "partially-unloaded", "chunk-states"]],
        "skipped": [event for event in events if event["event"] == "skipped"],
        "completion": final,
    }
    assert final["complete"] and final["return_code"] == 0
    assert final["host_netns"] != final["test_netns"]
    assert "oom_kill 0" in final["memory.events"]
    result[name] = summary
(root / "summary.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({name: {"sample_count": data["sample_count"], "resources": data["resources"]} for name, data in result.items()}, indent=2))

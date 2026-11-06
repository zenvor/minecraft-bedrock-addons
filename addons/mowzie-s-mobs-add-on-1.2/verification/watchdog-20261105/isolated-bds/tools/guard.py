import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time


ROOT = Path(sys.argv[1]).resolve()
assert str(ROOT).startswith('/var/tmp/bds-addon-probe-')
config = json.loads((ROOT / 'run-config.json').read_text())
with (ROOT / 'guard.jsonl').open('w') as output:
    for _ in range(420):
        if (ROOT / 'result.json').exists():
            break
        if not (ROOT / 'metadata.json').exists():
            unit = json.loads((ROOT / 'launch.json').read_text())['unit']
            state = subprocess.check_output(['systemctl', 'show', unit, '-p', 'ActiveState', '--value'], text=True).strip()
            if state in ['failed', 'inactive']:
                break
        if (ROOT / 'metadata.json').exists():
            metadata = json.loads((ROOT / 'metadata.json').read_text())
            pid = metadata['pid']
            assert pid not in config['protected_pids']
            try:
                assert os.readlink(f'/proc/{pid}/exe') == str((ROOT / 'bedrock_server').resolve())
                assert os.readlink(f'/proc/{pid}/cwd') == str(ROOT)
                assert os.readlink(f'/proc/{pid}/ns/net') == metadata['test_netns']
                relative = next(line.split('::', 1)[1] for line in Path(f'/proc/{pid}/cgroup').read_text().splitlines() if line.startswith('0::')).lstrip('/')
                assert Path('/sys/fs/cgroup') / relative == Path(metadata['cgroup'])
                available = int(next(line.split()[1] for line in Path('/proc/meminfo').read_text().splitlines() if line.startswith('MemAvailable:'))) * 1024
                cg = Path(metadata['cgroup'])
                current = int((cg / 'memory.current').read_text())
                sample = {'unix': time.time(), 'available': available, 'memory_current': current}
                reason = None
                if available < config['reserve_bytes']:
                    reason = 'host-reserve-low'
                if current > metadata['memory_max'] - 8 * 1024**2:
                    reason = 'test-near-memory-limit'
                if any(not Path(f'/proc/{p}').exists() for p in config['protected_pids']):
                    reason = 'protected-process-missing'
                if reason:
                    sample['terminated_test_only'] = reason
                    output.write(json.dumps(sample) + '\n')
                    output.flush()
                    os.kill(pid, signal.SIGTERM)
                    break
                output.write(json.dumps(sample) + '\n')
                output.flush()
            except FileNotFoundError:
                break
        time.sleep(0.5)

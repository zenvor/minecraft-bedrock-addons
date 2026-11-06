import json,sys,time,os,signal
from pathlib import Path
root=Path(sys.argv[1]).resolve()
assert str(root).startswith('/var/tmp/bop-exitdiag-20261104.Z5SGVr/bop-exit-')
with (root/'wait-evidence.jsonl').open('w') as out:
 for n in range(90):
  if (root/'metadata.json').exists():
   meta=json.loads((root/'metadata.json').read_text());pid=meta['pid'];assert pid!=3142343
   try:
    assert os.readlink(f'/proc/{pid}/exe')==str(root/'bedrock_server')
    avail=int(next(x.split()[1] for x in Path('/proc/meminfo').read_text().splitlines() if x.startswith('MemAvailable:')))*1024
    if avail < 384*1024**2:
     out.write(json.dumps({'unix':time.time(),'emergency':'host-reserve-below-384MiB','available':avail})+'\n');out.flush();os.kill(pid,signal.SIGTERM);break
    records=[]
    for task in Path(f'/proc/{pid}/task').iterdir():
     row={'tid':int(task.name)}
     for name in ['comm','wchan','syscall','stack']:
      try:row[name]=(task/name).read_text()
      except (OSError,PermissionError) as e:row[name]=str(e)
     records.append(row)
    out.write(json.dumps({'unix':time.time(),'threads':records})+'\n');out.flush()
   except FileNotFoundError:break
  if (root/'result.json').exists():break
  time.sleep(0.5)

import array
import fcntl
import json
import os
from pathlib import Path
import select
import signal
import subprocess
import sys
import termios
import time

root = Path(__file__).resolve().parent
assert root.name.startswith('bop-exit-') and str(root).startswith('/var/tmp/bop-exitdiag-')
production_pid = 3142343
cgroup = Path('/sys/fs/cgroup') / next(x.split('::', 1)[1] for x in Path('/proc/self/cgroup').read_text().splitlines() if x.startswith('0::')).lstrip('/')
def available():
    return int(next(x.split()[1] for x in Path('/proc/meminfo').read_text().splitlines() if x.startswith('MemAvailable:'))) * 1024
limit = int((cgroup/'memory.max').read_text())
assert available() >= limit + 384*1024**2, 'insufficient reserve for configured hard limit'
assert os.readlink('/proc/self/ns/net') != (root/'host-netns.txt').read_text().strip()
assert __import__('shutil').disk_usage(root).free >= 2*1024**3
p = subprocess.Popen([str(root/'bedrock_server')], cwd=root, env=dict(os.environ, LD_LIBRARY_PATH=str(root)), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, bufsize=0)
meta={'pid':p.pid,'formal_pid':production_pid,'started_unix':time.time(),'memory_max':limit,'memory_high':(cgroup/'memory.high').read_text().strip(),'cpu_max':(cgroup/'cpu.max').read_text().strip(),'cgroup':str(cgroup),'test_netns':os.readlink('/proc/self/ns/net'),'host_netns':(root/'host-netns.txt').read_text().strip()}
(root/'metadata.json').write_text(json.dumps(meta,indent=2))
started=time.monotonic(); server_at=None; list_at=None; stop_at=None; terminate_at=None; reason=None; buffer=b''; received=0; last_output=None; last_sample=0; list_ack=False; stop_ack=False; min_available=available()
raw=(root/'bds.log').open('wb'); events=(root/'driver.jsonl').open('w')
def emit(data):
    data={'elapsed_s':time.monotonic()-started,'unix':time.time(),**data}
    events.write(json.dumps(data)+'\n');events.flush()
def pending(fd):
    try:
        n=array.array('i',[0]);fcntl.ioctl(fd,termios.FIONREAD,n,True);return n[0]
    except OSError as e:return {'error':str(e)}
def send(command):
    before=pending(p.stdin.fileno()); t=time.monotonic(); payload=(command+'\n').encode();n=p.stdin.write(payload);p.stdin.flush()
    emit({'event':'input','command':command,'bytes_requested':len(payload),'bytes_written':n,'flush_completed':True,'write_flush_ms':(time.monotonic()-t)*1000,'pending_before':before,'pending_after':pending(p.stdin.fileno()),'stdin_pipe':os.readlink(f'/proc/{p.pid}/fd/0')})
def consume(chunk):
    global buffer,received,last_output,server_at,list_ack,stop_ack
    raw.write(chunk);raw.flush();received+=len(chunk);last_output=time.monotonic();buffer+=chunk
    while b'\n' in buffer:
        line,buffer=buffer.split(b'\n',1);text=line.decode(errors='replace')
        if 'Server started.' in text:
            server_at=time.monotonic();emit({'event':'server-started'})
        if 'players online:' in text:list_ack=True;emit({'event':'list-ack','line':text})
        if 'Server stop requested.' in text or 'Stopping server...' in text:
            stop_ack=True;emit({'event':'stop-ack','line':text})
def status(pid):
    try:
        d={}
        for line in Path(f'/proc/{pid}/status').read_text().splitlines():
            if line.startswith(('State:','VmRSS:','VmHWM:','Threads:')):
                k,v=line.split(':',1);d[k]=v.strip()
        fields=Path(f'/proc/{pid}/stat').read_text().split();d['cpu_ticks']=int(fields[13])+int(fields[14]);return d
    except FileNotFoundError:return {'exited':True}
try:
    while p.poll() is None:
        now=time.monotonic()
        if select.select([p.stdout],[],[],0.1)[0]:
            chunk=os.read(p.stdout.fileno(),65536)
            if chunk:consume(chunk)
        if now-last_sample>=0.5:
            avail=available();min_available=min(min_available,avail)
            emit({'event':'sample','available':avail,'test':status(p.pid),'formal':status(production_pid),'stdin_pending':pending(p.stdin.fileno()),'stdout_pending':pending(p.stdout.fileno()),'stdout_bytes':received,'stdout_idle_s':None if last_output is None else now-last_output,**{name:(cgroup/name).read_text().strip() for name in ['memory.current','memory.events','memory.pressure','cpu.stat']}})
            last_sample=now
            if avail<384*1024**2:reason='host-reserve-below-384MiB'
            if status(production_pid).get('exited'):reason='formal-process-missing'
        if server_at is not None and list_at is None and now-server_at>=5:
            send('list');list_at=time.monotonic()
        if stop_at is None and ((server_at is not None and now-server_at>=10) or now-started>120 or reason):
            reason=reason or ('scheduled-stop' if server_at else 'startup-timeout');send('stop');stop_at=time.monotonic();emit({'event':'stop-sent','reason':reason})
        grace=3 if reason in ['host-reserve-below-384MiB','formal-process-missing'] else 20
        if stop_at is not None and now-stop_at>grace and terminate_at is None:
            emit({'event':'terminate-test-only'});p.terminate();terminate_at=now
        if terminate_at is not None and now-terminate_at>5:p.kill()
    while True:
        chunk=os.read(p.stdout.fileno(),65536)
        if not chunk:break
        consume(chunk)
finally:
    if p.poll() is None:p.kill()
    code=p.wait(timeout=5)
    result={**meta,'return_code':code,'server_started':server_at is not None,'list_ack':list_ack,'stop_ack':stop_ack,'stop_elapsed_s':None if stop_at is None else time.monotonic()-stop_at,'total_elapsed_s':time.monotonic()-started,'reason':reason,'terminated':terminate_at is not None,'stdout_bytes':received,'host_min_available':min_available,'formal_after':status(production_pid),**{name:(cgroup/name).read_text().strip() for name in ['memory.events','cpu.stat']}}
    (root/'result.json').write_text(json.dumps(result,indent=2));emit({'event':'result',**result});raw.close();events.close()
print(json.dumps(result))

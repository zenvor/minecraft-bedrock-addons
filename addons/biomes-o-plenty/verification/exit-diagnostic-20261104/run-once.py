from pathlib import Path
import json,subprocess,sys,time
label,variant,transport,high=sys.argv[1:]
assert label.replace('-','').isalnum() and variant in ['vanilla','baseline','candidate'] and transport in ['raknet','nethernet'] and high in ['320M','352M']
parent=Path('/var/tmp/bop-exitdiag-20261104.Z5SGVr');root=parent/('bop-exit-'+label)
subprocess.run(['python3',str(parent/'setup.py'),label,variant,transport],check=True)
(root/'host-netns.txt').write_text(subprocess.check_output(['sudo','-n','readlink','/proc/1/ns/net'],text=True))
unit='bop-exitdiag-'+label+'-20261104'
properties={'User':'ubuntu','Group':'ubuntu','WorkingDirectory':str(root),'Nice':'15','CPUQuota':'40%','MemoryHigh':high,'MemoryMax':'352M','MemorySwapMax':'0','OOMPolicy':'stop','OOMScoreAdjust':'800','TasksMax':'96','RuntimeMaxSec':'180','TimeoutStopSec':'15','KillMode':'control-group','PrivateNetwork':'yes','NoNewPrivileges':'yes','ProtectSystem':'strict','ProtectHome':'yes','ReadWritePaths':str(root)}
command=['sudo','-n','systemd-run','--unit='+unit,'--service-type=exec','--remain-after-exit']
for k,v in properties.items():command+=['-p',k+'='+v]
command+=['/usr/bin/python3',str(root/'driver.py')]
(root/'launch.json').write_text(json.dumps({'command':command,'properties':properties},indent=2))
subprocess.run(command,check=True)
subprocess.run(['sudo','-n','python3',str(parent/'monitor.py'),str(root)],check=True)
for _ in range(150):
 if (root/'result.json').exists():
  print((root/'result.json').read_text());break
 state=subprocess.check_output(['systemctl','show',unit,'-p','ActiveState','--value'],text=True).strip()
 if state in ['failed','inactive']:
  print(subprocess.check_output(['sudo','-n','journalctl','-u',unit,'-n','10','--no-pager'],text=True));break
 time.sleep(1)
else:raise RuntimeError('bounded wait ended')

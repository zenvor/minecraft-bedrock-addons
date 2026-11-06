from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,time
r=Path('/var/tmp/rlcraft-release-1.0.26-64f42e4f-20261105')
assert r.resolve()==r and not r.is_symlink()
a=json.load(sys.stdin)
c=json.loads((r/'deployment-input.json').read_text());assert c['owner_id']==a['owner_id']
result=json.loads((r/'deployment-result.json').read_text());assert result['deployed'] and result['archive_sha256']==a['sha256']
for n,h in a['files'].items():
 p=r/n;assert p.resolve().is_relative_to(r) and hashlib.sha256(p.read_bytes()).hexdigest()==h,n
unit='rlcraft-release-1026-20261105.service'
assert subprocess.check_output(['systemctl','show',unit,'-p','MainPID','--value'],text=True).strip()=='0'
users=[]
for p in Path('/proc').iterdir():
 if not p.name.isdigit() or int(p.name)==os.getpid():continue
 for f in [p/'cwd',*(p/'fd').glob('*')]:
  try:
   target=os.readlink(f)
   if target==str(r) or target.startswith(str(r)+'/'):users.append((p.name,str(f),target))
  except (FileNotFoundError,ProcessLookupError,PermissionError,OSError):pass
assert not users,users
for n,h in c['protected_files'].items():assert hashlib.sha256(Path(n).read_bytes()).hexdigest()==h,n
for name,pid in [('minecraft-bedrock.service',result['bds_pid']),('bedrock-activity-backup.service',result['backup_service_pid'])]:
 assert subprocess.check_output(['systemctl','is-active',name],text=True).strip()=='active'
 assert subprocess.check_output(['systemctl','show',name,'-p','MainPID','--value'],text=True).strip()==str(pid)
subprocess.run(['systemctl','stop',unit],check=True)
assert subprocess.check_output(['systemctl','show',unit,'-p','LoadState','--value'],text=True).strip()=='not-found'
shutil.rmtree(r);assert not r.exists()
assert not Path('/var/tmp/bds-addon-probe-20261105.nJgoci').exists()
assert not subprocess.check_output(['systemctl','list-units','--all','--no-legend','bds-reference-ref139-ce2d0783-*'],text=True).strip()
assert Path(result['rollback']).is_dir()
print(json.dumps({'deployment_stage_removed':str(r),'deployment_unit_unloaded':unit,'evidence_hashes_matched':len(a['files']),'no_process_using_stage_before_delete':True,'prior_isolation_root_and_units_absent':True,'rollback_retained':result['rollback'],'production_and_backup_services_active':True,'protected_files_unchanged':True,'completed_unix':int(time.time())},indent=2))

#!/usr/bin/env bash
set -euo pipefail

world='/opt/minecraft-bedrock/worlds/RLCraft World'
permanent_root='/opt/minecraft-bedrock/backups/permanent'
package='/tmp/RLCraft-v1.2.1-performance-safe-hotfix.mcaddon'
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup="$permanent_root/pre-rlcraft-v1.2.1-performance-hotfix-$stamp"
stage="/opt/minecraft-bedrock/.staging/rlcraft-v1.2.1-performance-hotfix-$stamp"
rollback_needed=0

rollback() {
  local status=$?
  if [[ "$rollback_needed" -eq 1 ]]; then
    echo 'DEPLOYMENT_FAILED: restoring add-on files and activation manifests from permanent backup.' >&2
    systemctl stop minecraft-bedrock.service || true
    runuser -u minecraft -- rsync -rltD --delete "$backup/world/behavior_packs/bp0/" "$world/behavior_packs/bp0/" || true
    runuser -u minecraft -- rsync -rltD --delete "$backup/world/resource_packs/rp0/" "$world/resource_packs/rp0/" || true
    install -o minecraft -g minecraft -m 0644 "$backup/world/world_behavior_packs.json" "$world/world_behavior_packs.json" || true
    install -o minecraft -g minecraft -m 0644 "$backup/world/world_resource_packs.json" "$world/world_resource_packs.json" || true
    systemctl start minecraft-bedrock.service || true
    systemctl start bedrock-activity-backup.service || true
  fi
  exit "$status"
}
trap rollback ERR

test -f "$package"
unzip -tqq "$package"
test "$(sha256sum "$package" | awk '{print $1}')" = 'f3aaf6b654f43f864442ab172549367f30c54d995173bd00d263088126ce9576'
test -d "$world/behavior_packs/bp0"
test -d "$world/resource_packs/rp0"
test ! -e "$backup"
test ! -e "$stage"

systemctl stop bedrock-activity-backup.service
systemctl stop minecraft-bedrock.service
! systemctl is-active --quiet minecraft-bedrock.service
! pgrep -x bedrock_server >/dev/null

install -d -m 0750 "$backup"
rsync -aHAX --numeric-ids "$world/" "$backup/world/"
touch "$backup/DO_NOT_AUTO_DELETE"
printf '%s\n' \
  'purpose=permanent pre-deployment world backup' \
  'deployment=RLCraft v1.2.1 performance-safe-hotfix' \
  'package_sha256=f3aaf6b654f43f864442ab172549367f30c54d995173bd00d263088126ce9576' \
  "created_utc=$stamp" > "$backup/METADATA.txt"
find "$backup/world" -type f -print0 | sort -z | xargs -0 sha256sum > "$backup/SHA256SUMS"
sha256sum "$backup/SHA256SUMS" > "$backup/SHA256SUMS.sha256"

install -d -m 0755 "$stage"
unzip -qq "$package" -d "$stage"
test -f "$stage/bp0/manifest.json"
test -f "$stage/rp0/manifest.json"
test "$(sha256sum "$stage/bp0/manifest.json" | awk '{print $1}')" = 'b8821f7c05346a5d9efd596a4c496c05ea31193ddbe885825c4a6c2eee4d89d2'
test "$(sha256sum "$stage/rp0/manifest.json" | awk '{print $1}')" = 'dd089e3c7e6b515a6c0b3074145c097685d3ea649c2e6d7a376ae72017341676'

rollback_needed=1
runuser -u minecraft -- rsync -rltD --delete "$stage/bp0/" "$world/behavior_packs/bp0/"
runuser -u minecraft -- rsync -rltD --delete "$stage/rp0/" "$world/resource_packs/rp0/"
python3 -c 'import json, os, sys; p=sys.argv[1]; d=json.load(open(p)); m=[x for x in d if x.get("pack_id")==sys.argv[2]]; assert len(m)==1; m[0]["version"]=[1,0,20]; t=p+".rlcraft-v1020.tmp"; open(t,"w").write(json.dumps(d,indent=2)+"\n"); os.replace(t,p)' "$world/world_behavior_packs.json" 'e2b3c6d7-1a2b-4c3d-8e9f-0a1b2c3d4e5f'
python3 -c 'import json, os, sys; p=sys.argv[1]; d=json.load(open(p)); m=[x for x in d if x.get("pack_id")==sys.argv[2]]; assert len(m)==1; m[0]["version"]=[1,0,20]; t=p+".rlcraft-v1020.tmp"; open(t,"w").write(json.dumps(d,indent=2)+"\n"); os.replace(t,p)' "$world/world_resource_packs.json" 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
chown minecraft:minecraft "$world/world_behavior_packs.json" "$world/world_resource_packs.json"

test "$(sha256sum "$world/behavior_packs/bp0/scripts/main.js" | awk '{print $1}')" = '1a99969bbf3d381e75771024bccf46ebfb585e1dce2d8d443fce4f20c8b43262'
python3 -c 'import json,sys; a=json.load(open(sys.argv[1])); b=json.load(open(sys.argv[2])); assert next(x["version"] for x in a if x["pack_id"]==sys.argv[3])==[1,0,20]; assert next(x["version"] for x in b if x["pack_id"]==sys.argv[4])==[1,0,20]' "$world/world_behavior_packs.json" "$world/world_resource_packs.json" 'e2b3c6d7-1a2b-4c3d-8e9f-0a1b2c3d4e5f' 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'

systemctl start minecraft-bedrock.service
systemctl is-active --quiet minecraft-bedrock.service
systemctl start bedrock-activity-backup.service
systemctl is-active --quiet bedrock-activity-backup.service
rollback_needed=0

printf 'BACKUP=%s\n' "$backup"
printf 'BACKUP_MANIFEST_SHA256=%s\n' "$(cut -d' ' -f1 "$backup/SHA256SUMS.sha256")"
printf 'STAGE=%s\n' "$stage"

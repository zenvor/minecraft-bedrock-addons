#!/usr/bin/env bash
set -euo pipefail

world='/opt/minecraft-bedrock/worlds/RLCraft World'
permanent_root='/opt/minecraft-bedrock/backups/permanent'
package='/tmp/RLCraft-v1.2.5-backpack-upgrade-preserve.mcaddon'
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup="$permanent_root/pre-rlcraft-v1.2.5-backpack-upgrade-preserve-$stamp"
stage="/opt/minecraft-bedrock/.staging/rlcraft-v1.2.5-backpack-upgrade-preserve-$stamp"
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
test "$(sha256sum "$package" | awk '{print $1}')" = 'fc5ac6283c1a1fb8cfdb02e156d3c9349d6e3e784212ff3f7557d2f8a1b90812'
test -d "$world/behavior_packs/bp0"
test -d "$world/resource_packs/rp0"
test ! -e "$backup"
test ! -e "$stage"

install -d -m 0755 "$stage"
unzip -qq "$package" -d "$stage"
test -f "$stage/bp0/manifest.json"
test -f "$stage/rp0/manifest.json"
test "$(sha256sum "$stage/bp0/manifest.json" | awk '{print $1}')" = '316f7f6bf7a425217596150a4a532312af71f435b54b3d8866b64f8d5b2c311c'
test "$(sha256sum "$stage/rp0/manifest.json" | awk '{print $1}')" = '6ec1fe8070b4bc372ad5dea66478c525391c5ef4d73ab5a0b8ff6b1f70e58cbd'
python3 -c 'import json,re,sys; p=lambda f:json.load(open(f)); bp,rp=p(sys.argv[1]),p(sys.argv[2]); u=re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",re.I); assert u.fullmatch(bp["header"]["uuid"]); assert all(u.fullmatch(m["uuid"]) for m in bp["modules"]); assert u.fullmatch(rp["header"]["uuid"]); assert all(u.fullmatch(m["uuid"]) for m in rp["modules"]); assert bp["header"]["version"]==[1,0,24] and rp["header"]["version"]==[1,0,24]; assert next(m["uuid"] for m in bp["modules"] if m["type"]=="data")=="a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d"' "$stage/bp0/manifest.json" "$stage/rp0/manifest.json"

systemctl stop bedrock-activity-backup.service
systemctl stop minecraft-bedrock.service
! systemctl is-active --quiet minecraft-bedrock.service
! pgrep -x bedrock_server >/dev/null

install -d -m 0750 "$backup"
rsync -aHAX --numeric-ids "$world/" "$backup/world/"
touch "$backup/DO_NOT_AUTO_DELETE"
printf '%s\n' \
  'purpose=permanent pre-deployment world backup' \
  'deployment=RLCraft v1.2.5 backpack-upgrade-preserve' \
  'package_sha256=fc5ac6283c1a1fb8cfdb02e156d3c9349d6e3e784212ff3f7557d2f8a1b90812' \
  "created_utc=$stamp" > "$backup/METADATA.txt"
find "$backup/world" -type f -print0 | sort -z | xargs -0 sha256sum > "$backup/SHA256SUMS"
sha256sum "$backup/SHA256SUMS" > "$backup/SHA256SUMS.sha256"

rollback_needed=1
runuser -u minecraft -- rsync -rltD --delete "$stage/bp0/" "$world/behavior_packs/bp0/"
runuser -u minecraft -- rsync -rltD --delete "$stage/rp0/" "$world/resource_packs/rp0/"
python3 -c 'import json, os, sys; p=sys.argv[1]; d=json.load(open(p)); m=[x for x in d if x.get("pack_id")==sys.argv[2]]; assert len(m)==1; m[0]["version"]=[1,0,24]; t=p+".rlcraft-v1024.tmp"; open(t,"w").write(json.dumps(d,indent=2)+"\n"); os.replace(t,p)' "$world/world_behavior_packs.json" 'e2b3c6d7-1a2b-4c3d-8e9f-0a1b2c3d4e5f'
python3 -c 'import json, os, sys; p=sys.argv[1]; d=json.load(open(p)); m=[x for x in d if x.get("pack_id")==sys.argv[2]]; assert len(m)==1; m[0]["version"]=[1,0,24]; t=p+".rlcraft-v1024.tmp"; open(t,"w").write(json.dumps(d,indent=2)+"\n"); os.replace(t,p)' "$world/world_resource_packs.json" 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'
chown minecraft:minecraft "$world/world_behavior_packs.json" "$world/world_resource_packs.json"

test "$(sha256sum "$world/behavior_packs/bp0/scripts/main.js" | awk '{print $1}')" = '3b59a130d0b22666dbd361a5d0be54398a343ccdedd33067c97ab878398887c3'
python3 -c 'import json,sys; a=json.load(open(sys.argv[1])); b=json.load(open(sys.argv[2])); assert next(x["version"] for x in a if x["pack_id"]==sys.argv[3])==[1,0,24]; assert next(x["version"] for x in b if x["pack_id"]==sys.argv[4])==[1,0,24]' "$world/world_behavior_packs.json" "$world/world_resource_packs.json" 'e2b3c6d7-1a2b-4c3d-8e9f-0a1b2c3d4e5f' 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f'

systemctl start minecraft-bedrock.service
systemctl is-active --quiet minecraft-bedrock.service
systemctl start bedrock-activity-backup.service
systemctl is-active --quiet bedrock-activity-backup.service
rollback_needed=0

printf 'BACKUP=%s\n' "$backup"
printf 'BACKUP_MANIFEST_SHA256=%s\n' "$(cut -d' ' -f1 "$backup/SHA256SUMS.sha256")"
printf 'STAGE=%s\n' "$stage"

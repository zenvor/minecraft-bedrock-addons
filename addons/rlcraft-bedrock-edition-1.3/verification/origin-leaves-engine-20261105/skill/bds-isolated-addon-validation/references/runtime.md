# Linux/systemd 运行与证据协议

## 环境准备

唯一 run_root 下写 owner.json，案例位于 cases/<scenario>/。当前组件限定 run_root 前缀 `/var/tmp/bds-addon-probe-`，案例须为其真实子目录。需要 Linux cgroup v2、Python 3.9+；guard 读取其他 UID 的 /proc 时可能需要 sudo。

运行文件白名单：bedrock_server、必要 .so、definitions、data、treatments、minecraftpe、vanilla BP/RP，以及 server_library、server_ui_library、server_editor_library。遗漏原生脚本库会使 @minecraft/server 无法识别。以当前引擎实际要求为准，不整树复制服务器。只读共享依赖时逐文件对比保留包并核对无额外文件。

独立生成 server.properties、worlds/<test>/world_behavior_packs.json、world_resource_packs.json 和脚本权限。显式包顺序，关闭 LAN 宣告，端口与正式服不同，传输取值须为引擎支持值；本案例 transport=nethernet。不要复制正式世界数据。

## 组件配置

把 runner.py 拷到案例根，旁边写 run-config.json：

```json
{
  "run_root": "/var/tmp/bds-addon-probe-<unique>",
  "production_root": "/opt/minecraft-bedrock",
  "protected_pids": [12345, 12346],
  "host_netns": "net:[<current-host-inode>]",
  "reserve_bytes": 402653184,
  "target_error": "exact error substring",
  "shutdown_mode": "terminate"
}
```

PID、netns 必须替换为本次发现值，owner.json 必须存在。省略 shutdown_mode 时发送 stop 并等待退出。terminate 只用于预先选择的一次性功能验证：complete 后计划 SIGTERM，-15 不能证明正常关服。

启动设置来自本案例，并非通用额度：CPUQuota=40%、Nice=15、MemoryHigh=MemoryMax=368M、MemorySwapMax=0、OOMPolicy=stop、OOMScoreAdjust=800、TasksMax=96、RuntimeMaxSec=180、TimeoutStopSec=15、KillMode=control-group。组件要求启动前 MemAvailable 至少为硬限额 + reserve_bytes + 16MiB，磁盘至少空闲 2GiB；按实际输入估算限额，不为通过而降低保护门槛。

systemd-run unit 使用测试 User/Group、准确 WorkingDirectory、PrivateNetwork=yes、NoNewPrivileges=yes、ProtectSystem=strict、ProtectHome=yes、ReadWritePaths=<case>、ReadOnlyPaths=<production_root>。准备完成即退出准备器，再启动 runner。把完整启动 argv 和准确 unit 写入 launch.json，格式：

```json
{"unit":"bds-probe-<owner>-<scenario>","command":["sudo","-n","systemd-run","..."]}
```

runner 校验实际 cgroup 限额和私有 netns，启动 BDS 后写 metadata.json。宿主侧另行运行：

```sh
sudo -n python3 /path/to/guard.py /var/tmp/bds-addon-probe-<unique>/cases/<scenario>
```

guard 需要 launch.json、run-config.json、metadata.json。它联合检查 exe/cwd/netns/cgroup，不能按进程名识别目标。

## 探针协议与验收

探针输出单行 `[BDS_PROBE] ` 加 JSON，event 为 metadata、attempt、complete 或 fatal。只有所有案例断言完成才发 complete，驱动不能代发。驱动持续消费 stdout/stderr，记录资源和管道待读字节，避免管道背压。

runner 退出码仅说明收到 complete、无已识别脚本异常、按配置退出；还须核对 complete 业务字段、目标集合、target_errors、其他 ERROR、guard 动作、memory.events 和 unit 日志。target_errors 不在组件中自动判失败，因为基线可能需要复现错误。

guard 每 0.5 秒采样。宿主低于 reserve、测试距硬限额不足 8MiB 或保护 PID 消失时，仅终止身份匹配的测试 PID，此轮失败。采样峰值不是内核精确峰值。

stop 无进展时结合写入/flush、stdin/stdout 待读字节、线程状态和 memory.events/pressure，区分回收节流、OOM 与 Watchdog。保留失败记录，换新世界重试；不能把旧 fatal 运行改判成功。

## 清理边界

下载归档后检查 gzip/tar、必需日志和哈希，再确认每个 metadata PID 已退出及 cgroup.procs 为空。只对 owner 清单准确 unit 执行 stop/reset-failed，确认 MainPID=0，删除准确 root 并检查不存在。私有 netns 随引用退出释放；历史 inode 可能复用，不能据此删除其他服务 namespace。

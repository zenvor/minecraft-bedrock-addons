# RLCraft origin_leaves 隔离 BDS 验证

日期：2026-11-05。结论：本次 139 处白名单引用修复通过原生 BDS 对照验证；未更新正式服、未提交或推送。

## 输入与范围

- 引擎：1.26.61.1 build 53069370，与正式服相同二进制哈希。
- BOP：完整、未改动的 1.0.12 BP/RP，逐文件确认与保留正式包相同，以测试 mount namespace 只读方式共享。
- 测试包：`dist/RLCraft-1.0.25-origin-leaves-test.mcaddon`，保留 1.0.25 清单版本和 UUID，仅覆盖 139 个工作区 JSON，每个只有一次精确 ID 替换，其余包文件字节不变。
- 测试包 SHA256：`ef90ab347f5315660d92982e0bdc715f3d079a096551bc8bcb99e9929dc84d91`。
- 基线包 SHA256：`f16ef25d13bb8951a8225b0536594495b8f3c556eb18f0f26de85d2529570b3a`。

运行使用三个全新 FLAT 测试世界、私有网络命名空间、独立端口和 systemd unit；CPU 限额 40%、MemoryHigh=MemoryMax=368MiB、无 swap，宿主预留保持 384MiB。正式世界和备份均未复制或修改。

## 结果

| 组别 | origin_leaves 未知方块错误 | 空气放置成功 | 真实 BOP 树叶上放置成功 |
| --- | ---: | ---: | ---: |
| 正向对照 | 0 | 1/1 | 1/1 |
| 修复前 139 个原始配置 | 139 | 139/139 | 0/139 |
| 修复后测试包内配置 | 0 | 139/139 | 139/139 |

每个目标都以 dimension.placeFeature 实际调用两次，同时检查布尔返回和目标方块确实变成 stone。139 个目标覆盖完整，JSON 与原包/测试包中的字节及哈希一致。基线明确复现精确错误文本，修复后不再出现该错误，说明不是缺少触发而得到的安静日志。

三组均无脚本 ERROR、Watchdog、OOM 或资源保护终止。修复后完整日志无 ERROR；三组都有相同的 MaterialInstances render_method 材质警告，未在本次改动范围修复。采样 cgroup 峰值分别约 333.5/345.4/337.1MiB，宿主最低可用内存约 478.6/463.3/456.5MiB，均未触发预留门槛；memory.events 的 high/max/oom/oom_kill 均为零。

基线在空气中仍可生成，只在真实树叶相交判断时失败，因此不能把原问题描述成所有结构完全无法生成。

## 验证边界与失败尝试

这是原生 feature 白名单专项集成验证：139 个 feature JSON 保留原始路径、标识和字节；结构输入在探针包中使用同名 1×1×1 stone 夹具，先校验其大小及内容。没有加载 RLCraft/Mowzie 脚本或原大结构，未验证完整整合包、真实玩家与长期运行。

14 个 BOP legacy mcstructure 保持原样且未主动调用，不能据此断言它们潜在旧调色板问题已经解决。

成功三组在运行前统一采用 complete 后计划 SIGTERM，保存 marker 及 -15 退出码；没有把被资源保护终止的运行算通过，也不声称验证正常保存关服。

早期尝试的内存预检失败日志和缺少 feature_rules 绑定导致 feature 未注册的夹具失败日志，均保留在 server-evidence.tgz。首次错误夹具发送 stop 后接近限额，由保护器终止，该次不计入通过结果。随后补齐规则绑定，使用经核对的只读共享依赖减少重复缓存，才运行上述三组成功对照，未降低宿主预留门槛。

## 保护资产与清理

正式服 PID 3493214、备份服务 PID 3493215 在前后均保持 active/running，启动时间未变。正式 server.properties、世界 BP/RP 顺序、BOP 主脚本及 14 个旧结构，共 18 个保护文件前后哈希一致；本机 14 个结构也再次核对一致。

已下载并校验完整证据归档，30 个关键证据文件与服务器 SHA256 逐项一致。确认没有进程使用测试目录、每个测试 PID 已退出且 cgroup 无进程后，卸载本次三个 unit 并删除 `/var/tmp/bds-addon-probe-20261105.nJgoci`。正式服、备份服务与保护哈希在清理后再核对一致。本机本次 .build 暂存经 lsof 确认无使用进程后清理，测试包、源码和验证日志保留。

## 证据与复用

- `build.json`：包来源、139 个覆盖输入和逐文件哈希。
- `server-evidence.tgz`、`server/cases/{control,baseline,fixed}/`：完整日志、原生逐项结果、资源采样、unit 与 namespace 信息。
- `evidence-sha256.json`、`error-inventory.json`：归档校验和错误/警告审查。
- `cleanup.json`：清理结果；`summary.json`：机器可读总结。
- Skill：`/Users/home/.agents/skills/bds-isolated-addon-validation/SKILL.md`，已安装并通过 quick_validate；包含实测 runner/guard 和案例边界。

隔离 BDS 退出诊断（2026-11-04）

已确认的阻塞点是测试 cgroup 的 memory.high 回收限速。原版和候选版都在发送 stop 之前、首次 list 之后出现 MC_SERVER 内核等待；因此本轮和此前的“stop 超时”不能直接解释成 BOP 停服逻辑死锁。尚未取得充足内存下完整 BOP 正常退出的对照，不能宣称已经排除独立的 BOP/BDS 退出问题。

保留 1.0.12 候选包、源码和此前成果。本轮只新增隔离诊断目录，没有改 BOP 源码、重新打包、部署、提交或推送。历史 11 月 3 日 Watchdog Hang、朋友 Terracotta 连接失败与本轮退出表象分别处理，本轮未调查或归因历史 Watchdog Hang 及 Terracotta 连接失败。

所有组使用同一 BDS 1.26.61.1 二进制（SHA-256 d75212f20511eac3e3a1a45c5b57646d697a33038d5e41fa92113e1fbc14efab）、同样设置的新 FLAT 空白世界、seed 127013、无客户端、online-mode=false、allow-list=false、max-threads=1、相同管道和输入时序。未复用已运行世界。原版来自保留的 1.0.11 发布归档，候选来自原 1.0.12 候选归档，均未插桩、没有生长夹具或测试 BP。两版主脚本原始哈希分别为 f524671e4b54d569a8fde83e6f00eaa900b97961ba109e26f9006b3a2ca40647、60ecf4633021c792e615544ebd85412be859190d442883073ea3f7f33edfdf76。

最初主机 MemAvailable 约 747MiB，不能满足此前 384MiB 硬预算另留 384MiB 的启动条件。因此本轮先用 320MiB 硬预算做纯净预检，随后统一用 352MiB 硬预算对照；并未降低主机 384MiB 保留门槛。所有实例启动时检查“硬预算＋384MiB”余量，低优先级 Nice=15、CPUQuota=40%、MemorySwapMax=0、OOMPolicy=stop、RuntimeMaxSec=180、PrivateNetwork、非特权 ubuntu、ProtectSystem=strict、仅测试根目录可写。一次一个实例，新增外部监视器独立核验测试 PID 和主机余量；没有开放宿主机端口、改防火墙或复制正式 NetherNet 映射。

| 组 | transport | memory.high / max MiB | 结果 | stop 到驱动收尾 | BDS 返回码 |
| --- | --- | --- | --- | --- | --- |
| 纯净预检 | raknet | 320 / 320 | list、stop 均确认，正常退出 | 0.445 秒 | 0 |
| 纯净正式对照 | raknet | 320 / 352 | list、stop 均确认，正常退出 | 0.440 秒 | 0 |
| 原版 BOP 1.0.11 | raknet | 320 / 352 | 命令未执行确认；20 秒宽限后仅终止测试 BDS | 20.337 秒 | -15 |
| 候选 BOP 1.0.12 | raknet | 320 / 352 | 命令未执行确认；20 秒宽限后仅终止测试 BDS | 20.196 秒 | -15 |
| 原版 BOP，只提高 high | raknet | 352 / 352 | stop 发送前发生该测试 cgroup OOM；未取得正常退出结果 | 不适用 | wait 码未取得；内核确认 SIGKILL |
| 纯净网络对照 | nethernet | 320 / 352 | list、stop 均确认，正常退出 | 0.365 秒 | 0 |

每组均为单次观察，不是耗时分布。正常/超时组返回码来自子进程 wait；OOM 组父驱动也被 OOMPolicy=stop 收尾，未写出 result.json，不能拿单元 ExecMainStatus=15 当作 BDS 退出码。该组原始 unit-final.txt、unit-journal.log、kernel-test-oom.log 和未完成 driver.jsonl 均保留。

驱动在观察到 Server started 后等待 5 秒写入 list，再于启动确认后约 10 秒写入 stop。两条输入均明确包含换行，实际 write 返回 5 字节、flush 完成；原版分别约 0.015ms/0.013ms，候选写入耗时见 driver.jsonl。发送后输入管道的未读字节从 5 归零，说明被 BDS 输入端读走，不等于主线程已执行命令。两个受阻 BOP 组的后续 stdin_pending=0、stdout_pending=0，驱动持续 select/read 和记录样本，未见输出积压。日志里没有 list 回应，也没有 Server stop requested / Stopping server。

等待栈提供了超时以外的直接证据。原版首次 mem_cgroup_handle_over_high 等待在启动后 20.09 秒，list 在 19.65 秒、stop 在 26.88 秒发送；候选分别为 19.09 秒、18.52 秒和 23.98 秒。卡住先于 stop。两个 MC_SERVER 线程的内核栈均包含：

```
mem_cgroup_handle_over_high
exit_to_user_mode_loop
irqentry_exit_to_user_mode
exc_page_fault
asm_exc_page_fault
```

这说明观察到的主线程正在内存分配/缺页返回路径上受到 cgroup high 限速，并非只是根据时间长猜测死锁。没有取得用户态调用栈，不能把具体分配归到某个 BOP 模块或 BDS 函数，也不能仅凭输入被读走断言 stop 回调已执行。

原版低门槛组 cgroup memory.current 最大采样 340.47MiB，memory.events high=6701；候选为 339.52MiB、high=6389。两组 max/oom/oom_kill 均为 0，回收压力明显上升。先前 384MiB 硬预算的完整流程记录也在 stop 后出现同型压力：原版 memory PSI full avg10 达 84.83%，候选 81.52%；此前较小原生函数测试可正常退出。旧日志只提供一致性佐证，本轮等待栈才是直接定位证据。

将原版的 high 提至既有 352MiB 硬上限后，不再出现提前 high 限速，但在 stop 发送前发生该测试 cgroup OOM；首次 list 之前的样本已记录 max=45，说明硬限额压力更早出现，不能将其归因到 list 命令，内核记录 constraint=CONSTRAINT_MEMCG，oom_memcg=/system.slice/bop-exitdiag-baseline-high-20261104.service，Killed process 3328452 (bedrock_server)。这是测试自身的 cgroup OOM，不是正式服务或全局 OOM。该组只能证明这个硬预算不足，不能算作 stop 退出验证。最后一条驱动样本的 max=45、oom=0 早于真正 OOM，最终以外部内核日志为准，不能因驱动来不及写结果而漏报 OOM。

Linux 官方文档明确说明 memory.high 超限会使进程受到回收压力和限速，而 memory.max 才是会触发 cgroup OOM 的硬限制： [Linux cgroup v2 官方文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)。这与本轮内核等待和 high/max 两组结果吻合。

纯净 BDS 在相同独立网络、无客户端条件下，用 raknet 与 nethernet 都能正常执行 list、stop 并退出。raknet 确实产生“本版本仅支持 NetherNet”的连接错误，但这不是该环境下一定退出挂起的充分条件；无客户端、PrivateNetwork、普通管道也不是普遍阻止退出的条件。未运行“完整 BOP＋NetherNet＋充足预算”的组合，因此未排除 BOP 与网络条件的交互因素。未采用 PTY/关闭 stdin 的额外变体：现有证据已证明字节送达和主线程内存等待，优先解决资源证据不足，而不扩大不必要的矩阵。

未加生长夹具的原版与候选都复现，因此原有全流程夹具不是出现该受限现象的必要条件；尚未对所有夹具的内存影响逐项归因。CPU 限额保持一致，纯净组正常，受阻组 CPU 很少推进且等待栈在内存限速；未做取消 CPU 限额对照，所以不作“CPU 毫无影响”的绝对结论。

没有提高测试硬上限继续尝试。收尾主机 MemAvailable 约 754MiB，不足以恢复 384MiB 测试硬预算另留 384MiB，更不能支持任意增额。最小下一步是在有足够余量的独立测试资源上，先保持旧的 384MiB 硬上限，仅提高 memory.high，重新对照原版和候选；若仍触及硬限额，按实测预算再规划，不在现正式主机上试探性加码。得到正常退出前，不能宣称 BOP 已无退出问题或候选能根治停服。

六个测试单元已全部停止，测试世界、目录和既有备份均保留。最终只有正式 bedrock_server PID 3142343，服务 active/running，原 BOP 脚本哈希 f524671e... 未变，list 正常返回 0/4；详见 production-after.txt。候选包 SHA-256 仍为 1c639b2d0452a3e18bb6cddc04f2ab362af5698089684b49c9f348eae601c62a。正式服务、世界、配置、包栈、代码、端口和防火墙未被本轮修改，也未停止或重启正式 BDS。

每组原始证据位于同名 bop-exit-* 子目录：bds.log、driver.jsonl、metadata.json、setup.json、result.json（OOM 组无此文件）、wait-evidence.jsonl。driver.py、monitor.py、setup.py、run-once.py 是实际执行副本；summary.json 汇总原始结果和等待证据。远端完整环境保留在 /var/tmp/bop-exitdiag-20261104.Z5SGVr。

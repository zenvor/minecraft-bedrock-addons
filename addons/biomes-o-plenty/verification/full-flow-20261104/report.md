BOP 1.0.12 本地候选包验证记录（2026-11-04）

原版和候选版完整 BOP BP/RP 在同版本 BDS 的两个独立空白世界中顺序完成 19/19 用例；两版的结构选择、空间判断、保留/消耗树苗、骨粉数量和已核对方块类型一致。此结果支持树苗空间检查优化没有破坏本轮覆盖的生长流程，不能证明 11 月 3 日历史 Watchdog Hang 的根因已经消除。

隔离实例使用 transport=raknet，并且没有复制正式服 NetherNet 映射；此引擎明确输出“仅支持 NetherNet，玩家无法连接”的 transport ERROR。引擎、世界 tick、原生 API 和完整包均实际运行，但该配置不具备客户端联网验收条件，不作为可连接服务器交付。

测试采用 BDS 1.26.61.1 Build 53069370（r/26_u6），二进制 SHA-256 为 d75212f20511eac3e3a1a45c5b57646d697a33038d5e41fa92113e1fbc14efab。原版完整包与既有 1.0.11 发布归档相同；候选主脚本 SHA-256 为 60ecf4633021c792e615544ebd85412be859190d442883073ea3f7f33edfdf76。测试副本只增加观测、夹具和受控随机数，不作为发布脚本。

自然生长实际经过注册的 BOP onTick 回调，1200 tick 周期和 50% 阈值保持原样；在 tick 1200 用受控随机数 0.99 验证拒绝，在 tick 2400 用 0 验证成功。其他结构用例调用原有完整生长入口，临时限定到配置中已有的结构后恢复配置。骨粉用例调用捕获的真实交互订阅回调及其 system.run 后续逻辑，Player 适配器以原生箱子 Container 承载主手物品；这属于注入交互，没有真实玩家点击、客户端连接或画面验收。

覆盖单棵冷杉、2×2 最大冷杉、检查区第一/最后/内部阻挡、ignoreY 下层忽略、棕榈配置偏移、部分未加载区块拒绝、缺失结构保留树苗、普通/最后一个/创造模式骨粉、受阻消耗、错误物品、重复交互、同回调两株树苗，以及原生 feature 失败后恢复树苗。完全未加载区域的原生空间函数检查另见 ../native-20261104/；完全未加载树苗不会接收到原生 onTick，未伪称发生了完整自然生长。

每版完成 11 次实际结构核对，共 4316 个模板定义方块，树干/树叶数量和方块类型与原生 Structure 模板一致，差异为 0，并确认树苗消耗。没有核对全部方块状态、实体、贴图或所有 354 个结构的原生落地；354 个配置的坐标语义及 2832 个边角阻挡组合由本地模型回归覆盖，11 组回归通过。

以下为本次单次生长入口耗时（毫秒），不是统计分布；计时分辨率 1ms，0 表示低于分辨率。独立函数性能分布见 ../native-20261104/report.txt。

| 用例 | 原版 grow ms | 候选 grow ms | 可观察结果 |
| --- | --- | --- | --- |
| native-tick-probability-deny-then-grow | [21] | [7] | 一致 |
| single-actual-structure | [21] | [2] | 一致 |
| maximum-2x2-actual-structure | [170] | [5] | 一致 |
| maximum-first | [0] | [1] | 一致 |
| maximum-last | [189] | [1] | 一致 |
| maximum-middle | [8] | [1] | 一致 |
| maximum-ignored | [208] | [5] | 一致 |
| configured-palm-offset | [5] | [1] | 一致 |
| partial-unloaded-rejects-entire-growth | [2] | [1] | 一致 |
| missing-structure-preserves-saplings | [2] | [1] | 一致 |
| bone-survival-success | [21] | [2] | 一致 |
| bone-last-item-success | [20] | [2] | 一致 |
| bone-creative-retains-item | [19] | [2] | 一致 |
| bone-blocked-preserves-sapling | [1] | [1] | 一致 |
| non-bone-item-does-not-grow | [] | [] | 一致 |
| repeated-interaction-consumes-once | [20, 0] | [2, 0] | 一致 |
| repeated-blocked-interaction | [0, 1] | [1, 0] | 一致 |
| two-actual-saplings-same-callback | [20, 20] | [2, 1] | 一致 |
| native-feature-failure-restores-sapling | [1] | [0] | 一致 |

最大 2×2 成功用例空间检查为原版 164ms、候选低于 1ms；完整入口为 170ms、5ms。用例期间最大 tick 间隔分别为 211ms 和 111ms；候选 111ms 出现在填充阻挡的 feature 失败夹具。模块初始化到第一个 tick 分别延迟 11581ms 和 8002ms，单列为启动等待，不混作空间函数耗时或稳定运行证据。

| 资源 | 原版完整轮 | 候选完整轮 |
| --- | --- | --- |
| CPU 秒 | 11.90 | 10.15 |
| 总经过秒（含收尾） | 195.28 | 191.34 |
| 平均单核 CPU 百分比 | 6.09 | 5.30 |
| cgroup memory.current 最大采样 MiB | 343.14 | 343.17 |
| 主机 MemAvailable 最低 MiB | 454.63 | 460.80 |

每次只运行一个隔离 BDS。限制为 CPUQuota=40%、MemoryHigh=320MiB、MemoryMax=384MiB、禁用交换、PrivateNetwork、非特权 ubuntu 用户和只读正式文件系统；只允许测试目录写入。两轮均未触发 memory.max、OOM 或 OOM kill，但发生 memory.high 回收。主机可用内存低于 384MiB、正式 PID 消失、脚本错误或超时都会停止测试。资源数字包含夹具、日志和退出等待，不等同线上性能。

原版与候选版两轮完整用例结束后，stop 均未使隔离 BDS 在 40 秒内退出，随后仅对各自测试子进程发送 SIGTERM，退出码 -15。功能用例完成与正常关闭是两个结论；本次未修复或归因这个共有的退出异常。测试目录、空白世界、原始日志和既有备份均保留。

发布归档为 dist/Biomes-O-Plenty-zh_CN-v1.0.12-candidate.mcaddon，SHA-256 为 1c639b2d0452a3e18bb6cddc04f2ab362af5698089684b49c9f348eae601c62a，大小 2893294 字节。外层恰有 BP/RP 两个 mcpack，内包 manifest 位于根目录；BP 3946 个文件、RP 825 个文件。两次确定性构建字节相同，归档与源码逐文件一致；旧/新外包及四个内包的 CRC 检查通过，路径和大小写重复检查通过。相对 1.0.11 仅修改 behavior:manifest.json、behavior:scripts/bop/ks/main.js、resources:manifest.json，没有增加或删除资源。

BP/RP header、data/resources 模块和交叉依赖同步为 1.0.12，UUID 保留；script module 仍为 1.1.1，@minecraft/server 仍为 2.1.0，server-ui 仍为 2.0.0，min_engine_version 和 world scope 未变。旧版 1.0.11 归档 SHA-256 仍为 1615250c8a518e8f3ad87e945123afa058ca18581b30d4270ba8ff35bfc6a30f，上游归档未写入。

项目 npm run check 通过，但它只覆盖原有三个家具/生物项目，不覆盖 BOP。本次采用 BOP 专用 pack-candidate.py 代替会生成其他项目产物的全局 pack/verify:reproducible，另完成 BOP 3558 个 JSON/JSON5 解析、脚本语法、专用回归、逐文件审计及可复现归档检查。npm audit --offline 报告 0 个漏洞，这仅是离线结果。

语言检查：BP 中英各 3 键、RP 各 680 键，错误 0；旧/新 BP 严格检查通过。旧/新 RP 均因两条相同的 ~LINEBREAK~ 标记警告在 --warnings-as-errors 下返回 1，未把严格检查描述为全绿。Biomes O' Plenty 仅按品牌短语放行，标记警告单独保留；语言、键、占位符及文本均未修改。

原始证据为 baseline-full/、candidate-full/、baseline-smoke/、candidate-release-smoke/，summary.json 为逐用例比较及资源汇总，archive-comparison.txt、zip-crc.txt、archive-localization.txt 为归档检查。正式服收尾状态及最终版本冒烟结果见 production-after.txt、release-smoke-summary.json。没有提交、推送或部署候选包。

最终 1.0.12 冒烟已完成：Pack Stack 确认加载 1.0.12，API、入口和 BP/RP 交叉依赖匹配；单棵与最大 2×2 实际生长 2/2 通过，模板方块类型差异 0。该轮亦在 stop 等待后仅终止测试子进程。正式服最终 list 返回及 PID/哈希见 production-after.txt。

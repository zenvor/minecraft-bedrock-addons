# origin_leaves 未知方块：只读排查结果

已查明资源层面的根因：有资源引用 `4ks_bop:origin_leaves`，但当前已加载的行为包没有定义这个方块；BOP 实际注册的是 `4ks_bop:origin_oak_leaves`。存在两类旧引用，不能笼统归为 BOP 1.0.12 脚本错误。

## 活动配置中的错误引用

RLCraft 1.0.25 的 139 个 `minecraft:structure_template_feature` 配置使用同一份 `constraints.block_intersection.block_allowlist`，每份有一处 `4ks_bop:origin_leaves`，均未同时包含正确的 `4ks_bop:origin_oak_leaves`。这 139 个文件在线上世界的 `behavior_packs/bp0/features/structure/` 生效，与本地维护源码 SHA-256 全部一致。

例子：`addons/rlcraft-bedrock-edition-1.3/source/behavior-pack/features/structure/tower_feature.json`。调用链由 feature rule 进入 tower_scatter_feature，再到 tower_feature，最后使用白名单约束结构的放置。其中 132 个目标 feature 可从 RLCraft 的 JSON feature rules 引用图到达，另外 7 个在这条引用图中没有入口，是否由脚本或手动方式调用未进一步定位。配置有入口不代表每个世界环境都会满足生成条件。

Microsoft 官方说明该字段用于限制结构可以与哪些方块相交，是结构放置条件，而不是贴图名称或语言翻译键：[structure_template_feature 文档](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/featuresreference/examples/features/minecraftstructure_template_feature?view=minecraft-bedrock-stable)。

BOP 方块定义为 `source/behavior-pack/blocks/4ks/bop/leaves/origin_oak_leaves.json`，`minecraft:block.description.identifier` 是 `4ks_bop:origin_oak_leaves`。即便物品或掉落表的文件名仍含 `origin_leaves.json`，也不能把文件名当作运行时方块 ID；物品声明与 block_placer 同样指向正确 ID。已核对的 BOP 323 个方块定义中没有旧 ID。相关 RLCraft 白名单中，除这个旧 ID 外，其他 `4ks_bop:` 项都能在当前 BOP 方块定义中找到。

## 另一类遗留结构资源

BOP 有 14 个旧 `.mcstructure` 的方块 palette 仍使用 `4ks_bop:origin_leaves`，包含 1,024 个实际引用该 palette 的方块单元；不是仅文件名相似或无用 palette 项。14 个文件与 BOP 原始上游包字节完全相同，线上这 14 个结构也与本地一致。

这些结构主要是 `bop_ks:origin/tree_1` 至 `tree_12` 以及 `bop_ks:origin_tree_1/2`。当前原初橡树树苗走的是原生 tree feature：`bop_ks:origin/tree/oak`、`bop_ks:origin/tree/big_oak`，两个 JSON tree feature 都使用正确树叶 ID。当前树苗配置没有选用这 14 个旧结构，已检查的 BOP JSON 世界生成配置也没有引用它们。

因此它们是另一组需要单独审计的历史资源问题，不能直接当作正常树苗使用的结构，也不能未经验证宣称每条日志都由它们产生。手动或外部调用旧结构的行为影响尚未实测。

## 历史与部署核对

- RLCraft 原始 `RLCraft Bedrock Edition 1.3 (World Template).mctemplate`（内部 BP 1.0.22）已包含这 139 个错误引用；首次 v1.3 源码导入提交 `d157b18e` 也已包含。
- BOP 上游原包、1.0.11 基线与正式版 1.0.12 均定义正确的 `origin_oak_leaves`，JSON 中没有定义或引用旧 ID；旧 ID 另存在上述二进制结构中。
- 本次扫描的历史日志从 2026-10-20 起，最早已见同类错误于 2026-10-20 00:56:46 +08:00，早于 1.0.12 的 11 月 4 日部署。这个日期是本次扫描窗口内最早记录，不等同于问题首次产生日期。
- 部署后 25 条错误分布于两个进程：3345578 有 17 条、3493214 有 8 条，错误既可在启动后出现，也可在运行期间出现。日志没有 feature/structure 的文件路径，不能把错误次数直接当作受影响文件数量。

这属于旧资源与当前方块注册名不匹配，不是 1.0.12 的净空检查函数引入。没有证据将它关联到 BOP Watchdog Hang 或 Mowzie’s Mobs 的卡住。

## 影响边界与下一步方向

已确认的是无效 ID 和两类引用的位置；现有日志无法判断每次错误来自哪个具体资产，也无法断言引擎是丢弃白名单的一项，还是拒绝整个 feature，因此不能声称 139 种结构全部生成失败。未搭建测试环境、未进行生成效果或替换后的运行验收。

最小修复方向是先修正 RLCraft 这 139 处活动白名单中的旧 ID，使其指向 `4ks_bop:origin_oak_leaves`；不要因此改掉 BOP 已存在且一致的正确方块 ID。14 个旧结构需单独确认使用场景后处理，不进行二进制字符串盲替换或随意新增兼容方块。

本轮仅做线上只读扫描、日志与原始归档核对、NBT palette 解析及本地诊断记录。没有改 BOP 或 RLCraft 产品源码，没有打包、提交、推送、部署、重启，也没有修改世界、备份或其他对话的 Mowzie 工作。证据见 local-analysis.json、server-analysis.json、legacy-structures.json、growth-config-check.json、rlcraft-upstream.json、reference-graph.json 和 summary.json。

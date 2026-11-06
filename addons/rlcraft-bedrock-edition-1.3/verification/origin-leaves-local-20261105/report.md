# RLCraft origin_leaves 引用修正：本地验证

仅修改 `source/behavior-pack/features/structure/` 下 139 个结构生成配置，每个文件一处：

```diff
- "4ks_bop:origin_leaves"
+ "4ks_bop:origin_oak_leaves"
```

字段为 `minecraft:structure_template_feature.constraints.block_intersection.block_allowlist`。新 ID 对应 BOP 已注册的真实方块，未新增兼容别名，未修改方块定义、结构文件、白名单顺序或其他生成条件。

## 本地静态验证结果

| 检查 | 结果 |
| --- | --- |
| 实际修改范围 | 恰好 139 个目标 JSON，每个仅一处标识符替换 |
| 反向替换后与修改前 SHA-256 比较 | 139/139 一致，证明其他字节及格式未变 |
| 目标 JSON 解析与数组语义比较 | 139/139 通过，数组长度和其他条目不变 |
| 目标白名单内旧 ID | 0 处 |
| 目标白名单内正确 ID | 139 处，每份恰好一处，没有引入重复条目 |
| 对照 BOP 323 个真实方块定义 | 所有受影响白名单内的 `4ks_bop:` ID 均有定义，未解析引用为 0 |
| RLCraft 全量 JSON/JSON5 语法解析 | 3,632 个文件通过 |
| 其他 BOP/RLCraft 源码文件 | 10,958 个文件 SHA-256 未变，包括 manifest、版本和非目标资源 |
| BOP 的 14 个历史结构 | SHA-256 全部未变，仍按要求暂不处理 |
| Git 差异范围和空白检查 | RLCraft 源码差异恰好对应目标 139 个文件，`git diff --check` 通过 |

逐文件修改前后哈希见 [changed-files.json](changed-files.json)，汇总见 [summary.json](summary.json)。验证是直接读取文件、解析 JSON、对照真实方块注册 ID 及修改前快照完成，没有新增模拟实现的单元测试。

## 验证边界

本轮是本地静态验证，没有运行 BDS 或进入游戏，没有重新搭建隔离测试服务器，因此未确认引擎重新加载后的日志、结构生成效果或线上错误数量。14 个旧结构仍含旧 ID，不能把本次结果表述为全部同名错误已经消失。

当前仅是待确认的源码修改，RLCraft 版本仍保持原值；没有生成安装包、提交、推送或访问正式服务器。正式服、世界、备份、BOP 已发布包和其他对话的 Mowzie 修改均未被本轮操作。用户确认结果前停止进一步工作。

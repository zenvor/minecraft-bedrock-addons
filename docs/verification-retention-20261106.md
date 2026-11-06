# 验证工具与证据保留记录

2026-11-06 整理 BOP、RLCraft 和 Mowzie 历次任务遗留的未跟踪文件。初始 1,255 个文件、66,563,722 字节；移除 1,019 个文件、14,143,231 字节。仅处理本地文件，服务器服务、世界、备份及回退目录均未操作。

推送前确认 GitHub 仓库为公开仓库。74 个原始归档、日志、诊断快照及大型保全索引（50,702,178 字节）移至仓库外 `/Users/home/Code/minecraft/local-verification-evidence-20261106/`，按原仓库相对路径保存，逐文件校验 SHA-256。它们未纳入最终提交历史；本地位置及哈希见 [local-evidence-index-20261106.json](local-evidence-index-20261106.json)。仓库保留维护工具、报告、结构化结果及恢复索引。

逐文件清单见 [verification-retention-20261106.json](verification-retention-20261106.json)。`identical-archive-member` 项可从本地证据根目录下 `retained.archive` 中的 `retained.member` 恢复，并以记录的 SHA-256 校验；`transfer-or-python-cache` 为不参与验证的辅助文件。归档内原始证据保持原样，未把失败运行改判为成功。

## 保留内容

| 范围 | 保留用途 |
| --- | --- |
| BOP `tools/` 的 native/full-flow 构建器、探针、runner、摘要器 | 空间检查及生长全流程的原生对照复用 |
| BOP `verification/` 的摘要、退出诊断和线上观察；本地证据目录中的日志与资源采样 | 支撑 1.0.12 发布结论及其验收边界；失败和停服诊断也保留 |
| RLCraft `origin-leaves-local-20261105/` 与 `origin-leaves-engine-20261105/` | 139 个 feature 的静态和原生对照、正式部署及清理证据 |
| RLCraft `staging-cleanup-20261104/` 及本地证据目录同路径 | 已删除暂存内容的源码保全归档及原路径/源码匹配索引，不能当普通缓存删除 |
| Mowzie `watchdog-20261105/` | 1.0.11 隔离对照、部署、回退位置和失败处理工具 |

## 归档与恢复

以下五份归档在本地证据根目录中按下列相对路径保留完整原始字节，不上传公开仓库；SHA-256 见机器清单的 `archives`。清单还记录一份已去重的 `server/inputs.tgz`，其内容本身作为成员包含于保留的 RLCraft 服务器证据中，可按删除清单恢复。

- `addons/rlcraft-bedrock-edition-1.3/verification/staging-cleanup-20261104/preserved-source-and-validation.tgz`：包含 Realistic Biomes 唯一源码及历史验证文件；与 `preservation-index.json` 配套保留。
- `addons/rlcraft-bedrock-edition-1.3/verification/origin-leaves-engine-20261105/server-evidence.tgz`：隔离引擎输入、逐项结果、失败尝试、日志与资源采样。
- `addons/rlcraft-bedrock-edition-1.3/verification/origin-leaves-engine-20261105/formal-deployment-evidence.tgz`：部署计划、原始工具、启动及首次失败尝试日志。
- `addons/mowzie-s-mobs-add-on-1.2/verification/watchdog-20261105/isolated-bds/server-evidence/server-evidence.tar.gz`：基线、候选与首次夹具失败记录；最终结论以 `summary-reviewed.json` 和报告为准。
- `addons/mowzie-s-mobs-add-on-1.2/verification/watchdog-20261105/formal-deployment/server-evidence.tar.gz`：部署当时使用的原始工具、计划与启动日志；后续修正工具没有改写该归档。

解包前先列出成员并检查路径，在新的临时目录恢复所需文件，避免覆盖当前源码或原始记录。部分报告仍使用整理前的解包路径；若路径不存在，查本次删除清单定位归档成员。

## 工具复用条件

这里保留的是可审计的任务工具，不是统一部署 CLI。BOP 构建器绑定 `f6963709` 基线；RLCraft/Mowzie 输入构建器含历史包名、版本、探针和断言，旧包须从相应 Git 提交恢复。Mowzie 1.0.10 基线可从 `bc6e70f9^` 的旧发布路径取得。当前 `dist/` 已是正式版，不能直接当旧 1.0.10 候选输入运行原构建器。

本地证据目录 `preserved-temporary-evidence/` 中的匿名函数片段、解码脚本和 API 声明是历史诊断原件，不都能作为独立程序运行。保留工具的 Python/JavaScript 语法、JSON 解析检查通过；BOP native/full-flow 汇总器在整理前历史证据的临时副本上重跑通过，原始摘要没有被覆盖。复核时先按本地证据索引补回所需日志和 JSONL。

复用时在独立目录或历史 worktree 中按报告还原输入，核对哈希、依赖和引擎后再生成测试包。部署与远端清理脚本中的主机、世界、UUID、版本、路径和玩家检查须重新发现并审核；本次仅进行本地语法及历史数据复核，没有再次运行这些远端脚本。

Mowzie 可编辑的 `formal-deployment/tools/deploy_1011.py` 已补齐停止失败时禁止恢复文件、失败日志保存和回退结果记录；归档中的旧脚本仍是历史原件。RLCraft/BOP 的历史部署脚本不自动获得这些修正，未来部署应遵循当前 `bds-addon-deployment` 技能，不能直接照搬历史脚本。

## 回退资料

保留发布包、历史 SHA-256、部署结果、原包文件哈希、包栈计划和服务器回退路径。Mowzie 回退目录为 `/opt/minecraft-addon-rollbacks/mowzie-1.0.11-20261106T103445+0800`，RLCraft 1.0.26 为 `/opt/minecraft-addon-rollbacks/rlcraft-1.0.26-20261105T210642+0800`；本轮未连接服务器核验其当前状态，也未删除它们。旧正式包可从 Git 历史恢复并核对发布说明中的哈希。

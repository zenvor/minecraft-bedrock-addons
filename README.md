# Minecraft Bedrock 附加包简体中文汉化

此仓库保存附加包的可维护源码、构建工具与发布产物。

## 下载与版本

下表版本来自发布包内的 manifest。下载指向当前 `master` 中的组合 `.mcaddon`，内含 BP 和 RP。包版本与上游产品版本分别记录，例如 Mowzie's Mobs Add-On 1.2 的本项目包版本为 1.0.11。

| 附加包 / 源码目录 | 包版本 | 下载 | 发布与验证说明 |
| --- | --- | --- | --- |
| Furniture by Honeyfrost / `furniture-honeyfrost` | 1.1.8 | [下载](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/furniture-honeyfrost/releases/Furniture%20by%20Honeyfrost-zh_CN.mcaddon) | 汉化发布包；使用 minify 构建 |
| FURNITURE Add-On by XP GAMES / `furniture-xp-games` | 1.0.49 | [下载](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/furniture-xp-games/releases/FURNITURE%20Add-On%20by%20XP%20GAMES-zh_CN.mcaddon) | 汉化发布包；使用 minify 构建 |
| Mowzie's Mobs / `mowzie-s-mobs-add-on-1.2` | 1.0.11 | [下载](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/mowzie-s-mobs-add-on-1.2/releases/Mowzie%27s%20Mobs%20Add-On%201.2-zh_CN-1.0.11.mcaddon) | [正式版说明](addons/mowzie-s-mobs-add-on-1.2/releases/1.0.11.md)；隔离 BDS 对照及部署验证 |
| RLCraft Bedrock Edition / `rlcraft-bedrock-edition-1.3` | 1.0.26 | [下载](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/rlcraft-bedrock-edition-1.3/releases/RLCraft%20Bedrock%20Edition%201.3-zh_CN-1.0.26.mcaddon) | [正式版说明](addons/rlcraft-bedrock-edition-1.3/releases/1.0.26.md)；feature 专项对照及部署验证 |
| Biomes O’ Plenty / `biomes-o-plenty` | 1.0.12 | [下载](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/biomes-o-plenty/releases/Biomes-O-Plenty-zh_CN-v1.0.12.mcaddon) | [正式版说明](addons/biomes-o-plenty/releases/1.0.12.md)；生长专项对照及部署记录 |
| 独立弓箭补丁 / `bow-critical-cap-unlock` | 0.1.1 候选 | [下载候选](https://raw.githubusercontent.com/zenvor/minecraft-bedrock-addons/master/addons/bow-critical-cap-unlock/releases/bow-critical-cap-unlock-with-ordering-26.40plus-0.1.1.mcaddon) | [兼容范围与限制](addons/bow-critical-cap-unlock/README.txt)；静态验证，0.1.1 未游戏实测 |

RLCraft、BOP、Mowzie 的 SHA-256 见各自 `releases/*.sha256` 和发布说明；弓箭候选见 [SHA256SUMS](addons/bow-critical-cap-unlock/releases/SHA256SUMS-26.40plus-0.1.1)。两款家具当前没有独立校验文件。最低引擎版本不代表所有后续版本或客户端网络协议均已兼容。

## 构建与检查

在仓库根目录执行命令。Node.js 工具需要 Node.js 20 或更高版本及 `npm ci`；专用打包工具需要 Python 3，发布审计可使用 `unzip` 检查 ZIP CRC。

```sh
npm ci
```

### 家具与 Mowzie

根目录的 `check`、`build`、`pack`、`verify:reproducible`、`version:patch` 只覆盖 `furniture-honeyfrost`、`furniture-xp-games`、`mowzie-s-mobs-add-on-1.2`。省略目标或使用 `all` 都只表示这三个包，不包含 RLCraft、BOP 或弓箭补丁。

```sh
# 格式化两款家具的 minify 脚本及根 scripts/ 工具
npm run format

# 检查上述三个包的格式、JSON、JavaScript、语言与 manifest 依赖
npm run check

# 按各包策略构建 BP/RP：家具 minify，Mowzie preserve
npm run build

# 构建、校验并输出到 dist/
npm run pack

# 连续构建两次，检查产物逐字节一致
npm run verify:reproducible

# 只处理指定包；format/format:check 本身不按目标筛选
npm run check -- mowzie-s-mobs-add-on-1.2
npm run pack -- mowzie-s-mobs-add-on-1.2

# 需要发布新版本时才递增目标包的 patch 版本
npm run version:patch -- mowzie-s-mobs-add-on-1.2
```

`version:patch` 同步目标包 header、data/resources module 与 BP/RP 交叉依赖，不改 script module 或 `@minecraft/*` 依赖的独立版本。`version:patch -- all` 会修改上述三个包，请仅在确实同时发布它们时使用。

### RLCraft

```sh
python3 addons/rlcraft-bedrock-edition-1.3/tools/pack.py --ref HEAD
```

该工具只读取指定 Git 提交中的源码，不包含工作区未提交修改；可将 `HEAD` 替换为所需源码提交。工具内检查版本、依赖、归档与连续两次构建一致性。当前输出使用历史命名 `dist/RLCraft Bedrock Edition 1.3-zh_CN-rat-fix-1.0.26.mcaddon`，正式发布名见下载表；仅重命名外层文件不会改变 SHA-256。根目录 `npm run check` 不覆盖 RLCraft，打包检查也不替代其专项测试。

### Biomes O’ Plenty

```sh
node --test addons/biomes-o-plenty/tools/sapling-space.test.mjs
python3 addons/biomes-o-plenty/tools/pack.py
```

专用打包工具读取当前 `source/`，固定针对 1.0.12 检查版本和依赖、逐文件验证归档并双次构建比较，输出 `dist/Biomes-O-Plenty-zh_CN-v1.0.12.mcaddon`。修改发布版本时还需同步工具中的固定版本约束。

### 独立弓箭补丁

```sh
npm run pack:bow
```

该命令调用 `addons/bow-critical-cap-unlock/tools/build.py`，读取 `source/` 及固定证据输入，验证 0.1.1 候选并直接写入该包的 `releases/`、校验文件和静态验证记录。它不经 `dist/`，也不启动游戏引擎。另提供 [BP](addons/bow-critical-cap-unlock/releases/bow-critical-cap-unlock-26.40plus-0.1.1.mcpack) 和[排序 RP](addons/bow-critical-cap-unlock/releases/bow-patch-ordering-companion-26.40plus-0.1.1.mcpack) 独立分发。

## 已完成验证与边界

以下为对应发布说明记录的历史验证结果，不代表持续在线监测。

- **Mowzie 1.0.11**：清理失效实体引用与同 ID 重复项，修复雕刻师无攻击者环境伤害异常；完成原版/候选隔离 BDS 对照，2026-11-06 部署。专项测试支持修复有效，尚不能确认 2026-11-05 Watchdog 的精确直接根因或长期稳定性。
- **RLCraft 1.0.26**：修正 139 个 feature 中的 BOP 树叶引用，完成隔离 BDS 白名单专项对照，2026-11-05 部署。BOP 的 14 个旧结构未改，完整大结构、客户端及长期运行不属于该专项验收。
- **BOP 1.0.12**：树苗净空检查使用原生体积查询，保留生长规则；正式包与 2026-11-04 已部署候选逐字节一致。专项生长验证、退出诊断和历史内容错误分别记录在发布说明中。
- **弓箭 0.1.1 候选**：完整覆盖 `minecraft:arrow`，解除旧定义的 10 点暴击上限，保留原生伤害计算，无脚本补伤。目标最低引擎为 1.26.40，可能覆盖其他包的同名箭特性；最低版本和格式的静态检查不等于游戏验收或未来版本兼容保证。

弓箭候选内含 BP 和无贴图排序 RP，RP 单向依赖 BP。部署须同步两包及世界引用，核对实际行为包栈中补丁位于 RLCraft 前；详见 [审查记录](addons/bow-critical-cap-unlock/REVIEW-0.1.1.txt) 和[静态验证结果](addons/bow-critical-cap-unlock/bow-cap-unlock-2640-validation.json)。

## 目录与产物约定

- `addons/<addon>/source/behavior-pack/` 与 `resource-pack/` 保存游戏包源码，包内资源路径保持不变；维护工具在 `tools/` 或根目录 `scripts/`。
- 根构建配置中，两款家具使用 `minify`，Mowzie 使用 `preserve`；后者保留上游压缩脚本字节，不经 Prettier 格式化或 Terser 二次压缩。构建不自动 bundle 或改写导入与资源路径。
- `.build/` 和 `dist/` 为本地构建暂存，不提交 Git。可复现构建固定归档顺序、时间戳等参数，相同源码和工具环境应得到相同 SHA-256。
- `addons/<addon>/releases/` 保存当前发布产物及校验文件；候选需明确标注状态。组合 `.mcaddon` 内含 BP/RP `.mcpack`，每个内包根目录直接包含 manifest。
- 更新正式版时只保留最新正式构建包，保留历史说明、源码提交、SHA-256 和 `upstream/` 原件。旧包从相应 Git 历史恢复并校验，不重写历史。

## 验证资料与项目技能

仓库保留验证报告、结构化摘要、工具、哈希与恢复索引。完整原始日志、证据归档和额外源码保全资料保存在维护者本地，克隆仓库不会获得这些原始文件。详见[验证资料整理记录](docs/verification-retention-20261106.md)；历史部署工具绑定当时的版本和路径，复用前须重新审核。

[发布审计技能](.agents/skills/audit-mcaddon-release/SKILL.md) 包含原包与构建包安全比较、脚本入口、可选链、资源引用及 Creator Tools 误报经验。可用 `$audit-mcaddon-release` 执行项目审计。

## 发布流程

1. 修改目标包源码，并按该包使用的工具执行检查；根目录命令的覆盖范围见上文。
2. 内容变更需要同 UUID 覆盖旧包时，同步包版本和交叉依赖。家具/Mowzie 使用 `version:patch`；其他包按各自发布流程维护，独立 script module 与 API 依赖版本保持各自语义。
3. 使用对应打包入口：家具/Mowzie 用 `npm run pack -- <addon-id>`；RLCraft 用 `tools/pack.py --ref <已提交源码>`；BOP 用其 `tools/pack.py`；弓箭用 `npm run pack:bow`。专用工具路径和输出见构建章节。
4. 校验归档、版本依赖、文件差异、SHA-256 和适用的运行验证。将 `dist/` 产物按版本命名保存至目标 `releases/` 并附校验与说明；弓箭工具直接写入 `releases/`，发布前同样审核其候选状态和差异。
5. 清理上一正式版构建产物，保留历史说明及回退依据；提交源码、正式包和必要验证摘要。需要 GitHub Release 时上传同一份已验收产物，并记录版本与 SHA-256。

请仅在拥有原附加包的使用和再发布授权时分享构建产物。

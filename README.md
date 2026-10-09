# Minecraft Bedrock 附加包简体中文汉化

此私有仓库保存附加包的可维护源码与正式发布产物：

- `furniture-honeyfrost`：Furniture by Honeyfrost
- `furniture-xp-games`：FURNITURE Add-On by XP GAMES
- `rlcraft`：RLCraft Bedrock Edition 性能维护版
- `bow-critical-cap-unlock`：独立弓箭暴击上限修复兼容候选，0.1.1，目标 1.26.40 及以上

## 独立弓箭补丁

源码、固定构建输入和发布包位于 `addons/bow-critical-cap-unlock/`。执行 `npm run pack:bow` 可独立校验并重新打包，不修改其他附加包。该工具读取 `source/behavior-pack/` 与 `source/resource-pack/`，不覆盖源码，也不处理 JavaScript。

安装入口是 `addons/bow-critical-cap-unlock/releases/bow-critical-cap-unlock-with-ordering-26.40plus-0.1.1.mcaddon`，内含 BP 与无贴图排序 RP；也提供独立 `.mcpack`。两个包均为 0.1.1，最低引擎为 1.26.40，RP 单向依赖 BP。BDS 更新须同步两个包及世界引用版本，并核对实际行为包栈为补丁在 RLCraft 前；仅看界面排序不足以确认。

此包完整覆盖 `minecraft:arrow`，解除旧定义的 10 点暴击上限，保留游戏原生伤害计算，无补伤或二次力量倍率。它可能覆盖其他包的同名箭特性。0.1.1 已通过两轮独立静态审查和归档校验，尚未游戏实测；26.40 首次变化边界、所有未来版本兼容性及客户端 Rabbit 连接错误均未确认。完整说明见该目录 `README.txt`、`REVIEW-0.1.1.txt` 和 `bow-cap-unlock-2640-validation.json`。

## 目录约定

- `addons/*/source/` 是唯一可编辑的源码。每个附加包统一使用英文顶层目录 `behavior-pack/` 和 `resource-pack/`，包内资源路径保持不变。
- 每个附加包在构建配置中显式声明脚本策略：`minify` 的维护源码会在构建副本中压缩；`preserve` 的上游压缩脚本逐字节保留，既不会被 Prettier 格式化，也不会被 Terser 二次压缩。
- `.build/` 与 `dist/` 是本地构建暂存目录，不提交 Git；`dist/` 中的包只用于本机校验和可复现性检查。
- 每个附加包验收后的正式 `.mcaddon` 统一保存到 `addons/<addon>/releases/`，按版本命名并随源码提交；该目录是部署、回滚和对外发布的唯一产物来源。
- 正式构建按各附加包声明的脚本策略处理 JavaScript：`minify` 在构建副本中压缩，`preserve` 逐字节保留；不会 bundle 或自动改写入口路径、相对导入和资源目录。
- `dist/*.mcaddon` 是构建暂存包，保持原来的 `.mcaddon` 文件类型；内部采用 Bedrock 官方结构，只包含一个行为包 `.mcpack` 和一个资源包 `.mcpack`，每个 `.mcpack` 的归档根目录直接包含自己的 `manifest.json`。
- ZIP 文件顺序、权限和时间戳固定；相同源码与工具版本应生成相同 SHA-256 的可复现产物。

## 前置条件

- Node.js 20 或更高版本
- Python 3（用于现有本地化校验脚本）
- `unzip`（用于最终 ZIP CRC 检查）

安装依赖：

```bash
npm ci
```

## 常用命令

```bash
# 格式化仅标记为 minify 的可维护 JavaScript 源码
npm run format

# 检查格式、JSON、JavaScript、语言文件、manifest 依赖
npm run check

# 生成压缩 JavaScript 的 BP/RP 构建目录
npm run build

# 构建、校验并生成 dist/*.mcaddon 暂存包
npm run pack

# 连续构建两次并确认产物逐字节一致
npm run verify:reproducible

# 在改动后递增指定附加包或全部附加包的补丁版本
npm run version:patch -- furniture-honeyfrost
npm run version:patch -- all
```

`version:patch` 只更新每个包的 header、data/resources module 与 BP/RP 交叉依赖；不会改写 script module 或 `@minecraft/*` 依赖的独立版本。构建脚本还会拒绝不存在的脚本入口、缺少 `.js` 的相对导入、缺失的本地模块、未在 manifest 声明的 `@minecraft/*` 依赖、重复 UUID 和不同步的包版本。

这里不依赖预览版官方构建工具。项目使用 Node.js 执行与官方包格式等价的确定性 ZIP 打包，并可额外使用 Minecraft Creator Tools 做发布前兼容性审计；游戏是否正确加载仍应在目标 Bedrock 版本中验证。

## 项目技能

`.agents/skills/audit-mcaddon-release/` 保存本项目的发布审计技能，包含原包与构建包的安全逐文件比较脚本，以及脚本入口、可选链、资源引用和 Creator Tools 误报等已确认经验。需要重新构建或发布前复核时可使用 `$audit-mcaddon-release`。

## 发布流程

1. 修改 `addons/*/source/` 下的本地化文本或明确需要调整的脚本。
2. 执行 `npm run format`、`npm run check`。
3. 若要以同 UUID 覆盖已有导入包，执行对应的 `npm run version:patch -- <addon>`。
4. 执行 `npm run pack`，完成校验后将对应 `.mcaddon` 从 `dist/` 复制到 `addons/<addon>/releases/`，并使用版本号命名。
5. 在 GitHub Release 中上传 `addons/<addon>/releases/` 的正式 `.mcaddon` 文件，并记录版本、SHA-256 与改动。

请仅在拥有原附加包的使用和再发布授权时分享构建产物。

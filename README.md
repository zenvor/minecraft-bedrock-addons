# Minecraft Bedrock 附加包简体中文汉化

此私有仓库保存两个附加包的可维护简体中文本地化源码：

- `furniture-honeyfrost`：Furniture by Honeyfrost
- `furniture-xp-games`：FURNITURE Add-On by XP GAMES

## 目录约定

- `addons/*/source/` 是唯一可编辑的源码。每个附加包统一使用英文顶层目录 `behavior-pack/` 和 `resource-pack/`，包内资源路径保持不变。
- 源码中的 JavaScript 已格式化为可读形式；这是从已发布的压缩脚本恢复出的维护版本，并非原作者的未发布源码。
- `.build/` 与 `dist/` 是生成目录，不提交 Git。
- 正式构建会逐文件压缩 JavaScript，但不会 bundle 或自动改写入口路径、相对导入和资源目录。
- `dist/*.mcaddon` 保持原来的 `.mcaddon` 文件类型；内部采用 Bedrock 官方结构，只包含一个行为包 `.mcpack` 和一个资源包 `.mcpack`，每个 `.mcpack` 的归档根目录直接包含自己的 `manifest.json`。
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
# 格式化可维护 JavaScript 源码
npm run format

# 检查格式、JSON、JavaScript、语言文件、manifest 依赖
npm run check

# 生成压缩 JavaScript 的 BP/RP 构建目录
npm run build

# 构建、校验并生成 dist/*.mcaddon
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
4. 执行 `npm run pack`。
5. 在 GitHub Release 中上传 `dist/` 的 `.mcaddon` 文件，并记录版本与改动。

请仅在拥有原附加包的使用和再发布授权时分享构建产物。

# RLCraft Bedrock Edition

该目录保存 RLCraft 基岩版 `v1.2.0` 的可追溯修复工作集。

- `source/`：待部署 `v1.2.2` 性能加固版的行为包与资源包源码；行为包内部版本为 `1.0.21`，脚本模块为 `1.2.2`。
- `upstream/`：原始 `.mcaddon` 与地图模板，保持不改动，供逐文件比对。
- `docs/`：Watchdog 与性能审计记录。
- `releases/`：已部署的 `v1.2.1` 修复包与待部署的 `v1.2.2` 性能加固包。
- `tools/`：部署脚本；`tools/archive/` 是已废弃的试验性补丁工具，不可直接运行。

`source/behavior-pack/scripts/main.js` 保持上游混淆形态，已在 Prettier 检查中精确排除；其余仓库附加包不受影响。

当前修复范围只限性能与异常状态自愈，不改掉落、生成、对话、Boss 常规战斗节奏或飞龙死亡后的永久对话。

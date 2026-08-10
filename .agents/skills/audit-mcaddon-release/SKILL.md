---
name: audit-mcaddon-release
description: 为本仓库重新构建、审计和对比 Minecraft Bedrock `.mcaddon` 发布包。用于运行项目校验与可复现构建、核对官方内嵌 `.mcpack` 结构、将构建产物与原始未解包归档逐文件比较、审查 manifest 版本与脚本入口，以及分析 Creator Tools 报告而不误改上游资源。
---

# MCAddon 发布审计

## 原则

- 保持原始 `.mcaddon` 不变；只写入项目的 `.build/` 和 `dist/`。
- 通过 manifest 模块类型识别行为包与资源包，不依赖目录名。
- 将“归档完整”“文件差异”“本地化语义”“游戏运行”作为四项独立结论。
- 不为消除工具误报而批量重写上游资源；先查证 schema 和直接包验证结果。
- 不安装到服务器、不修改世界；除非用户另行明确授权。

## 工作流

1. 阅读 `docs/provenance.md`，核对原始包路径和 SHA-256。检查 `git status`，保留用户已有改动。
2. 阅读 [references/release-pitfalls.md](references/release-pitfalls.md)，尤其是在改动脚本、manifest、压缩器或 Creator Tools 版本时。
3. 在仓库根目录依次运行：

   ```bash
   npm run check
   npm run pack
   npm run verify:reproducible
   npm audit --offline
   ```

4. 确认每个外层 `.mcaddon` 恰好包含一个行为包 `.mcpack` 和一个资源包 `.mcpack`；对外层和两个内包分别执行 `unzip -t`。
5. 使用 `scripts/compare_mcaddon.py` 比较原始包与构建包。默认任何增删或内容变化都会失败；只为本次明确、逐项审查过的文件传入 `--allow-change`：

   ```bash
   python3 .agents/skills/audit-mcaddon-release/scripts/compare_mcaddon.py \
     /path/to/original.mcaddon dist/output.mcaddon \
     --allow-change behavior:manifest.json \
     --allow-change resources:manifest.json \
     --allow-change 'behavior:scripts/main.js'
   ```

   不要用宽泛的 `**` 放行整个包。重新压缩会使脚本字节变化；仍须从维护源码与 Git diff 确认语义变化符合预期。
6. 对四个内层 `.mcpack` 运行 `localize-mcaddon-zh-cn` 的校验脚本并启用 `--warnings-as-errors`。拉丁词白名单只允许已确认的品牌名。
7. 独立复核用户可见硬编码文本，重点搜索设置表单、动作栏、消息、指南和布尔值显示；日志、标识符和事件名不要翻译。
8. 如运行 Minecraft Creator Tools，将行为包与资源包分别验证，并把工具版本、网络限制和确认过的误报写入结果。Creator Tools 不能替代项目构建门禁。
9. 报告版本、SHA-256、文件数量、允许变化、校验结果和未执行的游戏内验证。不得把“自动检查通过”表述为“游戏内已验证”。

## 版本规则

- 仅在同 UUID 更新包确需覆盖旧版本时运行一次 `npm run version:patch -- <addon>`。
- 同步 header、data/resources module 和 BP/RP 交叉依赖版本。
- 不改 script module 独立版本或 `@minecraft/*` 字符串依赖版本。
- 普通重建和复核不得重复递增版本。

## 资源

- `scripts/compare_mcaddon.py`：安全读取直接目录结构或内嵌 `.mcpack` 的 `.mcaddon`，按行为包/资源包归一化并逐字节比较。
- `references/release-pitfalls.md`：本项目已确认的脚本、压缩、资源引用和官方工具陷阱。

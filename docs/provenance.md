# 来源与恢复说明

## 独立弓箭暴击上限补丁 0.1.1

2026-10-09 从本地 `bow-power-investigation` 项目纳入独立 BP、排序 RP、固定比较输入和发布包。四个 UUID 保留，RP 依赖 BP 0.1.1。排序 RP 原始清单 SHA256 为 `3b8d2370977f0949b49fbff4ccd6433a5265368a2e1fa6c04efd0cbe21857fb0`。

`addons/bow-critical-cap-unlock/evidence/vanilla_1.26.40-arrow.json` 来自用户提供的 1.26.52.3 安装包中保留的 `vanilla_1.26.40` 资源目录，SHA256 为 `bf9571a115d502c888b73d8bc6a9aaef05cabc567e50d5c08a563908b7e2a200`。它不是从 26.40 二进制提取的独立证据。`arrow-0.1.0.json` 保存先前补丁箭定义供格式归一化比较。

原生逆向只对比 1.26.30.5 与 1.26.52.3，不能确认首次变化版本。26.40 兼容目标依据官方投射物字段文档及保留的旧格式定义；0.1.1 未运行引擎或游戏验证。未修改 RLCraft，也未改写或重签名 APK。

本附加包使用独立 Python 构建工具，读取唯一可编辑源码 `source/`，不重新生成或覆盖源码。构建固定归档时间与排序，并进行 SHA、JSON、版本依赖、语义比较、CRC、路径和逐字节校验；发布 SHA 见目录内验证记录。

## 历史汉化包

本仓库从下列已完成简体中文本地化的发布包解包恢复：

| 附加包 | 原始文件 | SHA-256 |
| --- | --- | --- |
| Furniture by Honeyfrost | `Furniture by Honeyfrost-zh_CN.mcaddon` | `0b525319ebb807b38a68cfa64d518399bcb9fba42647f89f3f654c501a44977e` |
| FURNITURE Add-On by XP GAMES | `FURNITURE Add-On by XP GAMES-zh_CN.mcaddon` | `cba7a2185d7116b5483aad34e17b533c1a6472ec3162f0114ee7bfd03f55d71a` |

两份发布包均未附带 `package.json`、TypeScript 源码、source map 或原始构建配置。仓库中的 JavaScript 因此是对发布版脚本进行格式化后的维护源码；构建时会逐文件重新压缩，但不保证生成字节与原始压缩器完全一致。

原始 `.mcaddon` 文件不提交到此仓库；发布包应通过 GitHub Release 保存。

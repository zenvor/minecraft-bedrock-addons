# 来源与恢复说明

本仓库从下列已完成简体中文本地化的发布包解包恢复：

| 附加包 | 原始文件 | SHA-256 |
| --- | --- | --- |
| Furniture by Honeyfrost | `Furniture by Honeyfrost-zh_CN.mcaddon` | `0b525319ebb807b38a68cfa64d518399bcb9fba42647f89f3f654c501a44977e` |
| FURNITURE Add-On by XP GAMES | `FURNITURE Add-On by XP GAMES-zh_CN.mcaddon` | `cba7a2185d7116b5483aad34e17b533c1a6472ec3162f0114ee7bfd03f55d71a` |

两份发布包均未附带 `package.json`、TypeScript 源码、source map 或原始构建配置。仓库中的 JavaScript 因此是对发布版脚本进行格式化后的维护源码；构建时会逐文件重新压缩，但不保证生成字节与原始压缩器完全一致。

原始 `.mcaddon` 文件不提交到此仓库；发布包应通过 GitHub Release 保存。

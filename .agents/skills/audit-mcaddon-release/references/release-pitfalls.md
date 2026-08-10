# 发布审计陷阱

## 包结构

- 外层文件继续使用 `.mcaddon`；官方结构是在其中放置行为包和资源包两个 `.mcpack`。
- 每个 `.mcpack` 的归档根目录必须直接包含 `manifest.json`。外层 `.mcaddon` 不应再直接保存自定义 BP/RP 文件夹。
- 固定 ZIP 条目顺序、时间戳和权限，才能使相同源码产生相同哈希。

## manifest 与脚本

- script module 的 `entry` 相对于包根目录。脚本位于 `scripts/index.js` 时，不能写成 `index.js`。
- Bedrock ESM 相对导入写出 `.js` 扩展名，并验证目标存在且没有逃出包根目录。
- Prettier 3.7.4 会把 `(entity?.getComponent(...)).getRiders()` 改写为 `entity?.getComponent(...).getRiders()`，从而改变可选链短路范围。在必须保留分组的位置，把精确的 `// prettier-ignore` 紧邻表达式放置，并在格式化后复核。
- Terser 只压缩发布副本，不覆盖可维护源码。重新压缩后的脚本不要求与原作者压缩器逐字节一致，但应能由当前源码确定性生成并通过语法检查。

## 用户可见文本

- 除设置表单和消息外，还要检查动作栏中的硬编码值，例如 `true`/`false`。标识符、动态属性值和日志文本通常不可见，不应翻译。
- 保留 `§` 格式码、占位符、翻译键、UUID、namespace 和 `contentKey`。

## 资源引用

- 同时验证纹理清单的双向完整性：清单中的文件必须存在，实际纹理也必须被清单覆盖。
- 验证 `sound_definitions.json` 中字符串项和对象项引用的音频均存在。缺失音频可表现为局部静音，不会被普通 JSON 或 ZIP 检查发现。
- XP Games 的 `xp_furniture:mob_plushie.snow_golem_pumpkin` 事件复用现有 `sounds/xp/fpack/plushie/snow_golem.ogg`；原始引用指向不存在的文件。

## Creator Tools 0.17.7

- 工具自带 schema 的 `sound_definitions.json` 样例允许 `sounds` 数组使用字符串简写，但该版本校验器仍可能尝试给字符串设置 `volume` 并报错。先与 schema 样例交叉验证，不要因此批量改写所有声音项。
- 直接验证内层资源 `.mcpack` 时可以识别 `textures/textures_list.json`；验证外层内嵌 `.mcaddon` 时可能错误报告所有纹理未列出。将两个内包分别验证以区分真实错误与容器关联问题。
- 单独验证资源包会因配对行为包不在输入中而报告依赖缺失；用项目自身的 UUID/版本交叉检查补足这一点。
- 离线环境无法读取 Mojang 版本信息或 npm 模块注册表。记录网络限制，不要把网络失败当作包内容错误。

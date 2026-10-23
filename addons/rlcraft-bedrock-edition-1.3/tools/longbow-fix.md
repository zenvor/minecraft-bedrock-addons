# 长弓修复正式版 1.0.24

用户已确认测试版 1.0.28 可用，并明确要求将其内容以 1.0.24 作为正式版部署，接续腾讯云现有正式版 1.0.23。1.0.24 至 1.0.28 的候选包编号仅为测试历史；正式版 1.0.24 不是早期的同号候选包。

正式产物为 `dist/RLCraft Bedrock Edition 1.3-zh_CN-1.0.24.mcaddon`，SHA-256：`76cac1aeef6c1c5055696fd6f3cde27eec6287e484ddfe6555a6aa8de0de0977`。与已验收测试包 1.0.28 的包内差异为两个 manifest 的包版本、data/resources 模块版本与交叉依赖版本调整为 1.0.24，以及三类箭拾取感应器的格式兼容修正；其余 6,318 个文件逐字节一致，脚本模块及 API 版本不变。已验证双次构建一致、归档结构和完整性、版本依赖及 47 项专项测试。

正式部署的首次启动检查发现：三类箭的实体文件使用 `1.21.100`，但拾取组件仍保留旧版顶层 `event`、`event_filters`、`sensor_range`，BDS 对每类箭报告 3 条无效字段错误。该次部署已自动回退并确认 1.0.23 重新加载，未将有新增错误的启动视为成功。随后依据 [官方 entity_sensor 结构](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_entity_sensor?view=minecraft-bedrock-stable)，将原事件和玩家过滤器放入单个 `subsensors`，以 `range: [1.5, 1.5]` 替换旧半径字段。保留默认相对范围、普通箭回收与免费箭直接消失的分支；旋转、发射、伤害及附魔代码不变。新增回归检查覆盖三类箭的有效拾取结构和事件分支。

腾讯云“RLCraft 新纪元”最终已从 1.0.23 部署为 1.0.24。部署前确认零玩家并完成 `save hold/query/resume`；按 BDS 返回的文件清单和长度备份、逐文件核对哈希。回退目录为 `/opt/minecraft-bedrock/backups/manual-rlcraft-1.0.24-20261023-010806`，含世界快照、旧 BP/RP 和原世界包栈。两个包的 UUID、相对顺序和文件所有权均保持，正式包文件与归档逐文件匹配。

修正版先通过隔离网络、限制内存的临时 BDS 启动验证，启动错误为 0；正式部署后验证 BDS 与活动备份服务均为 active，实际包栈加载 1.0.24，NetherNet 的 TCP 19132 入口正常。端口检查曾错误采用传统 UDP 条件并触发回退，已根据本机 BDS 文档和实际监听改正。正式启动无新增错误，原有 BOP 的 `4ks_bop:origin_leaves` 错误仍存在，未在本次修改范围内。临时验证实例已停止；未进入正式服务器进行游戏内验收。

以下记录保留各测试版本的修复过程及当时的验证边界。

针对 `hfrlc:weapon_1`（根须长弓）、`hfrlc:dragon_bone_bow`（龙骨长弓）、`hfrlc:fire_dragon_bow`（余烬裂响）、`hfrlc:ice_dragon_bone_bow`（寒霜裂响）。反馈场景为手机触屏未开启分离控制时，拉弓没有准星；同时原先两种弓不能正常附上力量、冲击、火矢。

1.0.24 的附魔和伤害已获朋友反馈通过。1.0.25 仅补充实体 `setRotation`，用户截图确认箭身仍然横斜，不能将该版本视为视觉问题已解决。

1.0.26 改到资源包渲染路径：四种弓对应的三类箭改用独立的 `animation.hfrlc.longbow.flight`。客户端逐帧读取 `query.position_delta(0/1/2)`，由实际位移计算俯仰与偏航。该版本错误地假设渲染器会叠加实体偏航，因此在骨骼水平旋转中额外减去 `query.body_y_rotation`；这个错误直到 1.0.28 才移除。运动停止后缓存最后的有效角度；纯垂直运动保留原偏航，避免 atan2(0,0) 造成转向。1.0.26 的首帧初始化依赖新增 `client_sync` 属性，此方案已在 1.0.27 撤销。

1.0.26 用户反馈出现“有拉弓动作，但没有箭、没有伤害”。源码检查发现新加的 `setProperty` 位于 `projectile.shoot` 之前，与发射共用会删除箭实体的异常处理；故障注入已复现：写属性抛错后，箭被删除且 `shoot` 从未执行。后续用户提供的设备日志已确认具体异常：`InvalidArgumentError: Property "hfrlc:longbow_pitch" does not exist`，分别出现在 `hfrlc:player_bow`、`hfrlc:ice_arrow` 和 `hfrlc:fire_arrow`，与上述发射前失败并删除实体的路径一致。该日志没有提供运行包版本或时间，不能据此认定 1.0.27 已加载。

1.0.27 将 `longbow.js` 和三类箭的行为实体 JSON 逐字节恢复为已反馈能正常射击的 1.0.25，完全移除显示用属性和对应写入。首帧使用资源包内建的 `query.body_x_rotation/body_y_rotation`，后续仍从实际位移计算角度。行为包除更新导入所需的 manifest 版本外，应与 1.0.25 全包逐文件相同。测试对四种弓分别模拟拒绝自定义属性写入的实体，验证发射不再访问该能力，仍正常出箭、扣箭、扣耐久和选择附魔效果。

1.0.28 修正上述资源包旋转错误：骨骼直接使用位移计算出的偏航，不再减去实体偏航；首帧还没有位移时采用原版箭的 `-query.target_x_rotation` 和 `-query.target_y_rotation`。已对照原始模组、Mojang 原版箭动画，并只读分析用户此前提供的 Android 1.26.52.3 引擎文件：箭和雪球的渲染偏航方法都返回零，而 `query.body_y_rotation` 读取另一方法返回的实体偏航，两者不能互相抵消。对应地址、文件哈希和分析边界见 [静态分析记录](evidence/longbow-renderer-1.26.52.3.json)。

上一版数学测试同样错误地加回实体偏航，因此没有发现这个缺陷。本次先修正测试变换，再运行未修改的 1.0.27 资源包，三类箭合计 6 项方向测试失败；修改资源包后 46 项测试全部通过。这验证了已识别的公式错误，不替代客户端视觉验收。

原共享动画仍留给三叉戟和蛛网，模型、材质、伤害、弹速、附魔及准星逻辑不因这次视觉修复而变化。角度计算测试执行包内实际表达式的 JavaScript 兼容子集，并按 Molang 的角度制实现 atan2；它验证公式与状态保持，不模拟 Bedrock 渲染器。新版本仍需客户端视觉验收。

## 原因与实现

- 原物品的 `minecraft:enchantable.slot` 是 `flintsteel`，改为 `bow`。原使用行为通过 food 组件触发，射击由动画控制器生成 `hfrlc:player_bow`，并不走原版弓的发射流程。
- 保留原控制器的敏捷 15 / 20 门槛、蓄力状态及客户端动画。仅把四种弓的发射出口交给 `longbow.js`，明确设置射手、速度和实体朝向；其他武器及原版箭不改。
- 未附魔时保持投射物伤害 15 / 20、初速度 5。力量按自定义基础伤害乘以 `1 + 0.25 × (等级 + 1)` 后向上取整；无力量时不乘倍率。力量和火矢在发射前选择投射物组件，由一次原生命中结算，避免二次补伤。
- 余烬裂响继续生成原 `hfrlc:fire_arrow`，寒霜裂响继续生成原 `hfrlc:ice_arrow`，各自基础伤害 20。保留原火箭 `catch_fire`、冰箭 `mob_effect`（上游实际配置为 wither）和资源包粒子/模型，不根据中文名称擅改元素效果。
- 火矢通过投射物命中组件点燃目标 5 秒。冲击按射出时的附魔等级，在实际造成伤害后施加水平击退（每级 0.6，向上 0.1）；零伤害/格挡不会触发。此数值方案需要实机确认手感，不声称与原版物理表现完全一致。
- 开放弓类附魔同时允许无限：仍须持有普通箭，发射时不扣箭；无限、创造模式及原 `level_speed50` 免耗箭技能的箭禁止回收，避免复制。其他射击扣一支普通箭；成功发射后同步扣除本次弓槽位的耐久，保留原本每箭 4 点的基础损耗，并按耐久附魔逐点降低损耗概率。避免延迟标签导致漏扣或覆盖切换后的物品。
- 触屏使用这四种弓时，HUD 中央显示白色带阴影的 `+`。复用包已有的标题消息缓存方式，独立保存准星状态，控制标记不作为标题文字显示。松手、取消使用、切槽、死亡/重生时清除。分离控制模式仍保留原版准星，触屏补充标记可能与其重叠，需要手机验收。
- `main.js` 只新增一行模块导入，其余字节不变；不重新格式化或压缩上游主体。保留龙骨箭的原有粒子标记。BP/RP 的正式包版本及交叉依赖为 1.0.24，UUID、脚本模块独立版本及 API 依赖保持不变。

## 1.0.28 差异范围

相对 1.0.27，候选包仅 6 个文件发生变化：BP/RP 两个 manifest、三类箭的客户端实体首帧表达式，以及独立旋转动画的偏航表达式。行为包除 manifest 外，与 1.0.27 和 1.0.25 逐文件相同；发射、伤害、附魔、弹道和触屏准星代码未改。三类箭仍沿用原模组的 `minecraft:snowball` 运行时标识。

## 1.0.27 追加代码审查（2026-10-22）

这是 1.0.27 当时的审查记录；其中关于实体偏航抵消的判断已被 1.0.28 的静态分析纠正。当时按用户要求仅完成代码审查，停止搭建运行环境，未修改包内源码或递增版本。

- 核对四种弓的控制器出口、脚本事件参数、弹体类型、射手归属、发射速度及伤害组件事件；未发现新的发射或伤害结算阻断问题。
- 核对实体旋转动画别名、模型骨骼、位移各轴、角度制 atan2、实体偏航抵消，以及首帧、垂直飞行和停止运动分支。数学测试通过，但测试中的世界变换仍是模型化计算，不能证明客户端渲染效果。
- 用户日志中的 `hfrlc:longbow_pitch` 写入已不存在。四种弓的故障注入测试确认拒绝自定义属性写入不会再阻断发射；冰火箭继续选择各自原生弹体和元素组件。
- 重新运行 46 项测试全部通过；重新核对归档 CRC、路径安全、源码一致性及与 1.0.25 的差异。行为包除 manifest 外逐文件一致，资源包只有 manifest、三类箭的客户端实体和新增独立旋转动画发生变化。

当时结论限于代码和归档审查；后续反馈和静态分析证明原测试变换有误，不能用这次审查作为方向正确的证据。

## 测试候选阶段的自动验证与边界

运行专项测试：

```sh
node --test addons/rlcraft-bedrock-edition-1.3/tools/*.test.mjs
```

46 项测试通过（40 项长弓测试、6 项已有老鼠返还测试）。3,631 个 JSON 文件可解析，4 个 JavaScript 文件语法检查通过。新增 API 调用已对照官方发布的 `@minecraft/server@1.15.0` 类型声明核对。

根目录 `npm run check` 通过，但其登记范围不含 RLCraft，不能代替上述专项检查。离线 npm 审计为 0 漏洞。候选包双次构建逐字节一致，逐文件核对源码并验证外层和两个内包 CRC。

语言结构检查为 0 错误；严格模式仍报告旧包已有的 BP 2 项、RP 480 项人工复核警告，与修改前逐条一致，语言文件未修改。

当时候选产物位于 `dist/RLCraft Bedrock Edition 1.3-zh_CN-longbow-fix-1.0.28-candidate.mcaddon`，没有提交、推送或部署服务器；后续用户验收及 1.0.24 正式部署结果见本文开头。

候选交付时尚未运行 Minecraft 客户端或 BDS，当时列出的实机验收项目如下；后续 BDS 验证不替代这些玩法测试：

1. 四种弓分别在铁砧附力量 I/V、冲击 I/II、火矢 I，并检查附魔台候选；同时确认耐久和经验修补仍能使用。
2. 用高生命值、非火焰免疫目标比较普通箭、力量、火矢和冲击；检查近距离、远距离、盾牌格挡、多人同时射击以及射出后切换武器。
3. 检查蓄力不足不发射、敏捷门槛、每次只发一箭、普通箭消耗、耐久及无限箭不能回收。
4. 手机非分离控制下测试拉弓准星、松手/取消/切槽后隐藏；再检查分离控制、键鼠、第三人称、隐藏 HUD、死亡重生和重新进世界。
5. 朝东南西北、斜上与斜下射箭，观察箭头是否沿弹道方向、落地是否异常，重点复测“横着飞”。
6. 拉弓时观察原有口渴条、温度条、首领条和教程提示，确认标题消息复用没有造成显示丢失或闪烁。

官方依据：[物品附魔类别](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_enchantable?view=minecraft-bedrock-stable)、[投射物命中组件](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_projectile?view=minecraft-bedrock-stable)、[1.x 实体 API](https://learn.microsoft.com/en-us/minecraft/creator/priorscriptapi/minecraft/server-1xx/entity?view=minecraft-bedrock-stable)。


渲染依据：[Mojang 原版箭动画](https://github.com/Mojang/bedrock-samples/blob/main/resource_pack/animations/arrow.animation.json)、[Molang 位移与旋转查询](https://github.com/Mojang/bedrock-samples/blob/main/documentation/Molang.html)及上述本地引擎静态分析。[官方自定义投射物示例](https://learn.microsoft.com/en-us/minecraft/creator/documents/custom_projectiles?view=minecraft-bedrock-stable)中的朝向相机公式不能直接套用到本包的箭/雪球渲染路径；上一版采用了错误的偏航抵消假设。未启用实验性自定义投射物功能。

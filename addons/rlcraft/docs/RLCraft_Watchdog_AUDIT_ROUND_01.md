# RLCraft Watchdog 审计记录：第 1 轮

审计日期：2026-08-24（Asia/Shanghai）

## 边界与基线

- 仅审计本地副本；未修改 `.mcaddon`、服务器、世界、备份或资源包。
- 源包：`[RLCraft基岩版-附加包]RLCraft v1.2.0.mcaddon`
- SHA-256：`33b89f9a50cc0c2643c8aad0b921b03ab4f99fb1932f337f4e95b0efb38a2afe`
- `unzip -t` 通过。包为单层 ZIP，包含 `bp0/`、`rp0/`。

## 已确认的高风险路径

1. 光剑 glow/off：一次攻击最多创建 7 个 glow 实体；关灯阶段对 `31 x 31 x 31` 范围连续执行 12 次 `/fill ... replace light_block`，并伴随实体传送。路径：`bp0/animation_controllers/lrtc6oqos8qnekyf.json`、`bp0/entities/q4q9dpb863ge4u6e.json`、`bp0/animations/7uchnnb4n3kuphkl.json`。
2. 教程清怪：残留教程实体会以约 20Hz 扫描半径 48 内全部 `family=mob` 实体并逐个传送至 Y=-100。路径：`bp0/entities/r7dcr9x7y54zhvea.json`、`bp0/animations/60s3jwztag6oy59a.json`。
3. 蚁后跳跃：`hfrlc:jump` 在 12 tick 后创建每 tick 执行的 interval，仅在实体失效或落地时清理；异常滞空可能形成永久运行的实体扫描、击退和伤害逻辑。原始证据：`bp0/scripts/main.js`；反混淆审计副本：`/private/tmp/rlcraft-script-audit-20260824/main.fully-decoded.pretty.js:33241`。

## 次级风险

- 龙卷风的范围实体雷击和固定雷电召唤。
- 毒雾在 10 秒生命周期内反复向半径 5 的实体施加效果。
- selector 随机变形为 1--4 个实体，可能放大长期实体数量。

## 当前结论

以上是静态高风险候选，不等同于已证明的唯一崩溃根因。下一轮优先审计长期状态累积、定时器清理与持久实体清理，再设计每次只禁用一条路径的对照测试。

## 第 2 轮：长期运行累积研究

### 已确认的累积型缺陷

1. 古泰坦激光按坐标写入世界动态属性键：`hfrlc:block_damage_<type>_<x>_<y>_<z>`。首次命中只保留计数，只有达到破坏阈值时才删除；未发现 TTL、启动扫描或全局清理。路径为激光 `34571--34935` -> 方块扫描 `35082--35170` -> 写入 `35295--35383`（行号均指反混淆副本）。这些键会持久化到世界，属于无上限的长期数据增长。
2. 野生飞龙死亡后没有兜底销毁：9 种 wild death 分支不含 death timer，动画结束仅等待对话按钮触发 `/event entity @s despawn`。玩家未点击、离开或会话中断时尸体可能永久保留。水飞龙样本：`bp0/entities/ut9xzucajd40qpu8.json`；同构模式覆盖 air/dark/earth/fire/ice/lightning/nature/poison/water。
3. 太阳透镜按 `player.id` 使用两张 Map 缓存，断线未清理；海蛇 yaw Map 按实体 ID 缓存，仅 `hfrlc:death` 事件清理，未覆盖卸载/自然消失。它们都是可证实的进程期累计，但单条开销较小，需运行时计数评估总量。

### 高风险但需要运行时验证的候选

- `hfrlc:dead_shooter` 的每 tick interval 没有实体有效性检查或硬超时；目标失效或卡位可能永久运行。反混淆副本 `26595--26751`。
- 死亡骑士 emote interval 的停止依赖状态变化，缺少强制超时清理。`30432--30516`。
- 教程中断会留下含背包/装备 JSON 的世界动态属性；完成流程才清理，断线没有兜底。`3475--3484`、`3543--3880`。
- 雷电魔杖投射物命中后未见包内明确销毁路径；需要实体计数实测确认引擎是否隐式回收。

### 已排除的本轮疑点

- 饰品菜单实体虽为 persistent，但脚本每约 10 分钟跨维度删除该类型实体。
- 蜗牛 Map、两个 debounce Set、饰品空槽 Map 均存在短时或计数上限清理。

## 第 3 轮：重进与远处 Boss 研究

### 结论边界

未触发、玩家远离的普通 Boss 仅因存在于世界中，并不等于持续执行攻击代码。大多数 Boss 是 `persistent`，但不含 `tick_world`，并且初始处于 sleep/disabled；攻击、目标选择和攻击定时器要在唤醒后才加入。不能以“世界里有 Boss”直接归因卡顿。

### 为什么重进后仍会变卡

- `playerSpawn` 会恢复饰品菜单、读写库存/标签；恢复时跨三维查询并按玩家名清理旧菜单实体。
- 若玩家有 `did_tuto` 而缺 `update_1.2`，重进会执行一次三维全量实体扫描，逐个更新或清除血条名；实体残留越多，瞬时卡顿越重。
- 每 10 分钟脚本跨三维扫描饰品菜单；开启 lagwarn 时每 5 秒跨三维扫描掉落物。教程和温度逻辑也会在玩家重进后继续周期执行。
- 因此更符合的模型是：探索、死亡、投射物或旧结构遗留数据抬高实体基线；重进、靠近旧区或加载区块时恢复逻辑和周期扫描把负载暴露出来。无需当时遇到泰坦或 Boss。

### 需要重点计数的实体

- 被触发后未自然消失的 persistent Boss 及飞龙尸体。
- `hfrlc:sandworm_tail` 与 `hfrlc:sandworm_wheel`：带 `minecraft:tick_world`、`never_despawn: true`、半径 2；这是 Boss 附属物中可在附近无人时继续维持世界 tick 的例外。

### 下轮验证数据

在“进服前、进入旧探索区后、出现卡顿时”三次采集三维总实体数、掉落物、飞龙尸体、沙虫部件、饰品菜单、Boss 状态和动态属性总字节数；同时检查玩家 `update_1.2` 是否稳定保留。

## 附录：手机端飞龙与安慰小熊获取链

- 九种飞龙没有 `spawn_rules` 自然生成入口。它们依赖结构内命令方块执行 `functions/wyvern_*.mcfunction`：随机结构只抽 air/dark/fire/lightning/nature/poison/water；earth 仅沙漠结构，ice 仅冰原结构，fire 另有恶地结构。相关结构还受 48 x 48 平坦度、7%/10% 概率及低权重筛选限制。手机端长时间未遇到符合包设计的稀有度；若单人世界关闭命令方块，结构生成后也不会召唤飞龙。
- `hfrlc:teddy_of_comfort` 没有配方、普通战利品表、交易或脚本投放入口；它固定放在 67 个结构的 Trinket 容器中，例如 `house_5`、`underground_dungeon_2`、`desert_barn_2`、`mesa_ruin_4` 和全部 ice_spike 结构。每个对应 NBT 容器为 Count=1。

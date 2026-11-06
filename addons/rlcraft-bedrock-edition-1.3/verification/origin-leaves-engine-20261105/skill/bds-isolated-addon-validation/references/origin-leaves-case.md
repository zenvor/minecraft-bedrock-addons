# 已执行案例：origin_leaves

2026-11-05，BDS 1.26.61.1 build 53069370，完整未改 BOP 1.0.12。RLCraft 1.0.25 中 139 个 structure_template_feature 白名单把真实 `4ks_bop:origin_oak_leaves` 写成不存在的 `4ks_bop:origin_leaves`。

全量测试包由已发布 1.0.25/HEAD 基线加准确 139 个工作区 JSON 构建；每个文件只替换一次 ID，其余字节、UUID 和版本不变。原打包器读 Git ref，直接运行会遗漏未提交修复。

每组加载完整 BOP，另加探针 BP。基线/修复组使用原包/测试包内逐字节相同的 139 个 JSON，保留 features/structure 路径。原结构 identifier 在探针内对应 1×1×1 stone 结构，先通过 structureManager 核对大小与方块。未加载 RLCraft/Mowzie 脚本或原大结构。

每个 feature 经 feature_rules 绑定，匹配不存在的 biome tag，避免自然生成，仅原生 API 显式触发。最初缺少绑定时正向对照报 feature 未入 registry，是夹具失败，不是产品结论。修正后先证明 valid control 在空气和真实 BOP 树叶上均可放置 stone。

全新 FLAT 世界固定 grass 地面；目标先 air 再真实树叶，调用 dimension.placeFeature 后检查布尔返回及实际 stone。每项调用两次。

| 组别 | 未知方块错误 | 空气成功 | 树叶上成功 |
| --- | ---: | ---: | ---: |
| 有效正向对照 | 0 | 1/1 | 1/1 |
| 修复前 139 JSON | 139 | 139/139 | 0/139 |
| 修复后 139 JSON | 0 | 139/139 | 139/139 |

基线在叶块场景求值时惰性发出错误，并未让空气场景失败，不能声称所有原结构都无法生成。成功三组无脚本 ERROR、Watchdog、OOM 或保护终止。

主机约 3719MiB 无 swap，正式 BDS RSS 约 2.2GiB。最初复制运行文件/BOP、准备器常驻时余量不足；改为核对后只读共享引擎/vanilla/BOP，准备器退出后再启动。限额与 MemoryHigh 均 368MiB，宿主预留维持 384MiB。三组采样峰值约 333.5/345.4/337.1MiB，宿主最低可用约 478.6/463.3/456.5MiB，无 high/max/oom/oom_kill。早期复制 BOP 的失败夹具在 stop 后接近限额，被保护器终止，不计成功。

成功三组在运行前统一选定 complete 后计划 SIGTERM，记录 marker 及 -15。只证明原生白名单修复，未验证正常保存关服、原大结构、整合包脚本组合或玩家长期运行。

14 个含旧调色板 ID 的 BOP legacy mcstructure 保持原样且未主动调用，不在这 139 项验收范围。前后核对正式配置、包顺序、BOP 主脚本、14 结构哈希以及正式/备份 PID 均一致；无部署、提交或推送。

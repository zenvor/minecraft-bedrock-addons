兼容范围修订 0.1.1（本地静态验证候选）
BP、RP最低引擎版本均为1.26.40；箭定义format_version也改为1.26.40。
五处anchor使用旧格式整数1（眼高），damage使用数值0；归一化后与0.1.0箭定义完全一致。
保留显式projectile/arrow家族、玩家箭max_critical_damage=2147483647、其余倍率和事件。
无脚本，不补伤，不重复力量；仍然整份覆盖minecraft:arrow，其他包的自定义同名箭行为可能被覆盖。
RP无贴图，依赖同UUID的BP0.1.1；保持运维已验证的依赖方向，不增加反向依赖。
部署时两个包同步更新，世界引用版本同步为0.1.1；目标实际BP栈[00]补丁、[01]RLCraft，需要启动日志和冲突实体测试复核。
最低引擎版本不等于网络协议兼容保证，客户端与BDS连接兼容需另行验证。
Rabbit/InitialConnection-58的原因尚未确认，本修订只消除本包要求客户端26.52的门槛。
依据：官方26.40文档已记录ceil_pre_critical_damage、difficulty_randomization和should_bounce枚举；26.50公告记录anchor与damage的新格式。
26.40基线是从26.52.3安装包保留的vanilla_1.26.40目录提取，并非26.40实际安装包。
原生逆向只对比26.30.5和26.52.3，不能据此证实计算顺序首次变化恰好在26.40。
0.1.0此前用户报告修复有效；0.1.1尚未在26.40、26.45、26.51、26.52.3或未来版本游戏中验证。
官方文档：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.40?view=minecraft-bedrock-stable
26.50公告：https://feedback.minecraft.net/hc/en-us/articles/48826825649933-Minecraft-Bedrock-Edition-26-50-Changelog-Wilderness-Bound

服务器暂存目录清理记录（2026-11-04）

已删除用户指定的三个目录：
- /tmp/rlcraft-1.0.24.dMR3hI
- /tmp/rlcraft-1.0.25-release.vRcwlX
- /tmp/realistic-biomes-stage.hd3inj

删除前两次以 root 只读检查 /proc 中所有进程的 cwd、root、exe、打开文件描述符、内存映射和独立路径参数，均未发现引用这三个目录的进程；没有权限遗漏。三个目录不是符号链接，也没有目标内挂载点。

为保留源码和验证日志，先逐文件比对维护源码。18,954 个暂存文件与本地 RLCraft source 哈希相同；其余唯一源码以及顶层验证日志、部署/校验脚本共 1,985 项保存在 preserved-source-and-validation.tgz。Realistic Biomes 的两包源码完整包含在归档中。归档逐项 SHA-256 已校验，详细原始路径及匹配关系见 preservation-index.json。

保留归档 SHA-256：4843d8d17d6dc36d92a4887c534c102d1ade298cea64432758d462b40ee8da2f。

本地原有源码、验证记录与发布/候选包共 21,219 个文件在删除前逐文件校验未变。服务器删除操作只针对三个固定目录和本轮自建的两个临时归档辅助文件。正式服、备份、配置、包栈和维护源码未修改。清理前后正式服 PID 均为 3345578，备份服务 PID 均为 3345579；两者 active/running 及启动时间保持一致，线上 BOP 脚本哈希未变。过程原始结果见 server-cleanup.json。

本轮自建的本地临时索引已移除。服务器本次测得的可用磁盘增加量包含移除暂存归档临时副本，具体字节值见 server-cleanup.json。

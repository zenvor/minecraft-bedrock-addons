scoreboard players remove timer hf_fur:global 1
execute if score timer hf_fur:global matches ..0 run function hf/fur/cycle
execute if score timer hf_fur:global matches ..0 run scoreboard players set timer hf_fur:global 4
scoreboard players add @e[tag=hf_fur:reset_command] hf_fur:reset_command 1
event entity @e[tag=hf_fur:reset_command,scores={hf_fur:reset_command=2..}] reset_command
tag @e[tag=hf_fur:reset_command,scores={hf_fur:reset_command=2..}] remove hf_fur:reset_command
scoreboard players reset @e[tag=!hf_fur:reset_command,scores={hf_fur:reset_command=2..}] hf_fur:reset_command
scoreboard players add @e[scores={hf_fur:break=1..}] hf_fur:reset_command2 1
event entity @e[scores={hf_fur:reset_command2=30..}] reset_command
scoreboard players reset @e[scores={hf_fur:reset_command2=30..}] hf_fur:break
scoreboard players reset @e[scores={hf_fur:reset_command2=30..}] hf_fur:reset_command2
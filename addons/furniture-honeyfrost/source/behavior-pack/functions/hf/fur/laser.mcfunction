scoreboard players add @e[type=hf_fur:security_lazerdoor] hf_fur:laser 0
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~1~~ if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~1~~ run kill @e[type=player,r=0.5]
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~~~ if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~~~ run kill @e[type=player,r=0.5]
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~-1~~ if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=1}] at @s positioned ~-1~~ run kill @e[type=player,r=0.5]
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~ if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~ run kill @e[type=player,r=0.5]
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~1 if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~1 run kill @e[type=player,r=0.5]
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~-1 if entity @e[type=player,r=0.5,m=!c] run scoreboard players add "hf_fur:laser_hit" "hf_fur:jig_computer.addon_stats" 1
execute as @e[type=hf_fur:security_lazerdoor,scores={hf_fur:laser=2}] at @s positioned ~~~-1 run kill @e[type=player,r=0.5]
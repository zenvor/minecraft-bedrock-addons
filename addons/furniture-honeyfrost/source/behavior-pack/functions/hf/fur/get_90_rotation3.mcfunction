execute if entity @s[rym=-45,ry=45] run event entity @s rotate_0
execute if entity @s[rym=-45,ry=45] run fill ~ ~ ~ ~ ~ ~ hf_fur:custom_block_1 replace
execute if entity @s[rym=45,ry=135] run event entity @s rotate_1
execute if entity @s[rym=45,ry=135] run fill ~ ~ ~ ~ ~ ~ hf_fur:custom_block_2 replace
execute if entity @s[rym=135,ry=-135] run event entity @s rotate_2
execute if entity @s[rym=135,ry=-135] run fill ~ ~ ~ ~ ~ ~ hf_fur:custom_block_3 replace
execute if entity @s[rym=-135,ry=-45] run event entity @s rotate_3
execute if entity @s[rym=-135,ry=-45] run fill ~ ~ ~ ~ ~ ~ hf_fur:custom_block_0 replace
execute if entity @s[rym=-45,ry=45] run tp @s ~~~ 0 0
execute if entity @s[rym=45,ry=135] run tp @s ~~~ 90 0
execute if entity @s[rym=135,ry=-135] run tp @s ~~~ 180 0
execute if entity @s[rym=-135,ry=-45] run tp @s ~~~ -90 0
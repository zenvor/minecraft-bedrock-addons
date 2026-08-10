execute as @a[tag=!hf_fur:joined] at @s run loot spawn ~~~ loot "hf/fur/guide_book.loot"
execute as @a[tag=!hf_fur:joined] at @s run gamerule sendcommandfeedback false
tag @a[tag=!hf_fur:joined] add hf_fur:joined
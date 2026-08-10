execute as @s[tag=!hf_fur:place,rym=-22.5,ry=22.5] run tp @s ~ ~ ~ 0 0
execute as @s[tag=!hf_fur:place,rym=22.5,ry=67.5] run tp @s ~ ~ ~ 45 0
execute as @s[tag=!hf_fur:place,rym=67.5,ry=112.5] run tp @s ~ ~ ~ 90 0
execute as @s[tag=!hf_fur:place,rym=112.5,ry=157.5] run tp @s ~ ~ ~ 135 0
execute as @s[tag=!hf_fur:place,rym=-157.5,ry=-112.5] run tp @s ~ ~ ~ -135 0
execute as @s[tag=!hf_fur:place,rym=-112.5,ry=-67.5] run tp @s ~ ~ ~ -90 0
execute as @s[tag=!hf_fur:place,rym=-67.5,ry=-22.5] run tp @s ~ ~ ~ -45 0
execute as @s[tag=!hf_fur:place,rym=157.5,ry=180] run tp @s ~ ~ ~ 180 0
playsound hf_fur:furniture_put @a[r=9]
tag @s add hf_fur:place
execute if entity @s[rym=-22,ry=22] run event entity @s rotate_0
execute if entity @s[rym=23,ry=67] run event entity @s rotate_1
execute if entity @s[rym=68,ry=112] run event entity @s rotate_2
execute if entity @s[rym=113,ry=156] run event entity @s rotate_3
execute if entity @s[rym=-180,ry=-157] run event entity @s rotate_4
execute if entity @s[rym=156,ry=180] run event entity @s rotate_4
execute if entity @s[rym=-156,ry=-113] run event entity @s rotate_5
execute if entity @s[rym=-112,ry=-68] run event entity @s rotate_6
execute if entity @s[rym=-67,ry=-23] run event entity @s rotate_7
execute if entity @s[rym=-22,ry=22] run tp @s ~~~ 0 0
execute if entity @s[rym=23,ry=67] run tp @s ~~~ 45 0
execute if entity @s[rym=68,ry=112] run tp @s ~~~ 90 0
execute if entity @s[rym=113,ry=156] run tp @s ~~~ 135 0
execute if entity @s[rym=-180,ry=-157] run tp @s ~~~ 180 0
execute if entity @s[rym=156,ry=180] run tp @s ~~~ -180 0
execute if entity @s[rym=-156,ry=-113] run tp @s ~~~ -135 0
execute if entity @s[rym=-112,ry=-68] run tp @s ~~~ -90 0
execute if entity @s[rym=-67,ry=-23] run tp @s ~~~ -45 0
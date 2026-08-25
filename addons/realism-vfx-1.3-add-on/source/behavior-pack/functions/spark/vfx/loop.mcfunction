# © Spark Universe, 2024
# description: Game loop, runs 20 times a second
# called by: tick.json


scoreboard players add slow spark_vfx.time 1
execute as @a[c=1] if score slow spark_vfx.time matches 10 run function spark/vfx/effects
execute as @a[c=1] if score slow spark_vfx.time matches 20.. run scoreboard players set slow spark_vfx.time 0


# Clear emitter blocks
clear @a spark_vfx:emitter_aurora
clear @a spark_vfx:emitter_birds
clear @a spark_vfx:emitter_butterflies
clear @a spark_vfx:emitter_fireflies
clear @a spark_vfx:emitter_flies
clear @a spark_vfx:emitter_fog
clear @a spark_vfx:emitter_leaves
clear @a spark_vfx:emitter_meteor_shower
clear @a spark_vfx:emitter_rainbow
clear @a spark_vfx:emitter_shooting_star
clear @a spark_vfx:emitter_startled_birds
clear @a spark_vfx:emitter_tumbleweed
clear @a spark_vfx:emitter_creaking_wisps
clear @a spark_vfx:emitter_resin_fireflies
clear @a spark_vfx:emitter_warped_forest_dust
clear @a spark_vfx:emitter_warped_forest_spores
clear @a spark_vfx:emitter_crimson_forest_dust
clear @a spark_vfx:emitter_crimson_forest_spores
clear @a spark_vfx:emitter_nether_fireflies
clear @a spark_vfx:emitter_nether_bugs
clear @a spark_vfx:emitter_startled_spirits
clear @a spark_vfx:emitter_lingering_souls
clear @a spark_vfx:emitter_soul_godrays
clear @a spark_vfx:emitter_lava_busts
clear @a spark_vfx:emitter_lava_bubbles

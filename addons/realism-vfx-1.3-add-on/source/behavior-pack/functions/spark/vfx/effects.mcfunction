### Trigger command-based particles in a 1 hz loop
### triggered by: loop20


tag @a remove spark_vfx.particle_spawner_15
execute as @a at @s unless entity @a[tag=spark_vfx.particle_spawner_15,r=15] run tag @s add spark_vfx.particle_spawner_15

# Set biome in the end
scoreboard players set @a[scores={spark_vfx.dimension=2}] spark_vfx.biome 0


import { EntityComponentTypes, EntityInitializationCause, EquipmentSlot, GraphicsMode, LocationInUnloadedChunkError, MolangVariableMap, Player, WeatherType, system, world } from "@minecraft/server";
import { clamp, getPlayerBiome, isBlockLoaded, isUnderGround, isUnderWater, randomAB, randomInt, randomRange, tryAndGetBlock } from '../util/util';
import { Vector } from "../util/vector";
import { splashTick } from "./splash";
import { GlobalValues } from "./global_values";
import { biomeEffectTick } from "./ambient_effects";
import SimplexNoise from "../util/noise";
import BIOMES from './biomes';
import { isEffectEnabled } from "../settings";
import { netherEffectTick } from "./nether_effects";
import { tickLensFlare } from "./sun";
import { getOrCreateScoreboard } from "../util/util";
import { getWindDirection, getWindIntensity } from "../wind";
const WindNoise = new SimplexNoise();
const CLOUD_NOISE = new SimplexNoise();
const CAVE_DUST_BLOCKS = ["minecraft:stone", "minecraft:deepslate", "minecraft:gravel", "minecraft:clay"];
let worldtime_scoreboard;
let slow_tick = 0;
export function vfxTick() {
    worldtime_scoreboard = worldtime_scoreboard ?? getOrCreateScoreboard('spark_vfx.worldtime');
    let overworld = world.getDimension('overworld');
    let the_end = world.getDimension('the_end');
    let nether = world.getDimension("nether");
    const overworld_players = overworld.getPlayers();
    let old_absolute_time = GlobalValues.absolute_time;
    GlobalValues.time_of_day = world.getTimeOfDay();
    GlobalValues.absolute_time = world.getAbsoluteTime();
    GlobalValues.uptime += 1;
    worldtime_scoreboard.setScore('daytime', Math.round(GlobalValues.time_of_day));
    GlobalValues.wind_intensity = clamp(0.8 + WindNoise.noise(GlobalValues.time_of_day / 700, -400), 0.1, 2);
    if (GlobalValues.weather != WeatherType.Clear)
        GlobalValues.wind_intensity += 1.6;
    slow_tick++;
    if (slow_tick == 40) {
        let y_scoreboard = getOrCreateScoreboard('spark_vfx.y_pos');
        let dimension_scoreboard = getOrCreateScoreboard('spark_vfx.dimension');
        world.getAllPlayers().forEach(player => {
            if (!player.isValid)
                return;
            y_scoreboard.setScore(player, Math.round(player.location.y));
            dimension_scoreboard.setScore(player, player.dimension == the_end ? 2 : (player.dimension == overworld ? 0 : 1));
        });
        slow_tick = 0;
    }
    biomeEffectTick();
    netherEffectTick();
    if (isEffectEnabled("splashes") || isEffectEnabled("lava_splashes")) {
        splashTick(overworld);
        splashTick(the_end);
        splashTick(nether);
    }
    // Weather
    if (old_absolute_time && GlobalValues.absolute_time - old_absolute_time > 20) {
        GlobalValues.weather = WeatherType.Clear;
    }
    if (slow_tick % 3 == 0) {
        if (GlobalValues.weather != WeatherType.Clear) {
            worldtime_scoreboard.setScore("sunny", -10);
        }
        else {
            worldtime_scoreboard.addScore("sunny", 1);
        }
        const sunny_time = worldtime_scoreboard.getScore("sunny");
        overworld_players.forEach(player => {
            if (!player || !player.isValid || !isBlockLoaded(player.location, overworld))
                return;
            let biome = getPlayerBiome(player);
            if (GlobalValues.weather != WeatherType.Clear) {
                if (!isUnderGround(player) && !isUnderWater(player)) {
                    if (biome == BIOMES.frozen) {
                        if (slow_tick % 6 == 0 && GlobalValues.weather == WeatherType.Thunder && isEffectEnabled("snowstorms", player)) {
                            let location = player.location;
                            location = { x: location.x, y: location.y + 6, z: location.z + 2 };
                            const wind_dir = getWindDirection();
                            const wind_intensity = getWindIntensity(location);
                            let entity = overworld.spawnEntity("spark_vfx:blizzard_emitter", location);
                            entity.setProperty('spark_vfx:direction_x', wind_dir.x * (0.7 + wind_intensity * 0.3));
                            entity.setProperty('spark_vfx:direction_z', wind_dir.z * (0.7 + wind_intensity * 0.3));
                            player.setPropertyOverrideForEntity(entity, "spark_vfx:visible", true);
                        }
                    }
                    else if (biome != BIOMES.desert && biome != BIOMES.savanna && biome != BIOMES.mesa && isEffectEnabled("intense_rain", player)) {
                        player.spawnParticle("spark_vfx:light_rain_drizzle", player.location);
                        player.spawnParticle("spark_vfx:light_wind_gust", player.location);
                    }
                }
            }
            // Rainbow
            if (sunny_time == -2) {
                if (GlobalValues.time_of_day < 12000 && isEffectEnabled("rainbows", player)) {
                    const direction = GlobalValues.time_of_day < 5900 ? -1 : 1;
                    let location = Vector.copy(player.location);
                    location.y = 64;
                    let variables = new MolangVariableMap();
                    let distance = player.graphicsMode == GraphicsMode.Deferred ? 90 : 130;
                    variables.setFloat('offset_x', distance * direction);
                    try {
                        player.spawnParticle("spark_vfx:rainbow", location, variables);
                    }
                    catch (err) {
                        //console.warn(err);
                    }
                    if (biome != BIOMES.pale_garden)
                        player.runCommand("fog @s push spark_vfx:fog_rainbow rainbow");
                }
            }
            else if (sunny_time == 252) {
                player.runCommand("fog @s remove rainbow");
            }
        });
    }
    world.getAllPlayers().forEach(player => {
        if (!player || !player.isValid || !isBlockLoaded(player.location, player.dimension))
            return;
        let was_in_sandstorm = player.hasTag('spark_vfx.in_sandstorm');
        let in_sandstorm = false;
        if (GlobalValues.weather != WeatherType.Clear && player.dimension.id == 'minecraft:overworld') {
            if (!isUnderGround(player) && !isUnderWater(player) && isEffectEnabled('sandstorms', player)) {
                let biome = getPlayerBiome(player);
                if (biome == BIOMES.desert) {
                    in_sandstorm = true;
                    player.spawnParticle('spark_vfx:sandstorm', player.location);
                    player.spawnParticle('spark_vfx:sandstorm_sweep', player.location);
                    if (player.hasTag("spark_vfx.particle_spawner_15")) {
                        if (Math.random() < 0.1 && isEffectEnabled('tumbleweeds', player) && isBlockLoaded(player.location, overworld)) {
                            let tumbleweed = overworld.spawnEntity('spark_vfx:tumbleweed', player.location);
                            tumbleweed.addEffect('invisibility', 15, { showParticles: false });
                            tumbleweed.runCommand('spreadplayers ~-30 ~-30 1 40 @s');
                        }
                    }
                }
            }
        }
        if (slow_tick == 10 && was_in_sandstorm != in_sandstorm) {
            if (in_sandstorm) {
                player.addTag('spark_vfx.in_sandstorm');
                player.runCommand('fog @s push spark_vfx:fog_sandstorm spark_vfx.sandstorm');
            }
            else {
                player.removeTag('spark_vfx.in_sandstorm');
                player.runCommand(`fog @s remove spark_vfx.sandstorm`);
            }
        }
        // Pale garden fog
        if (slow_tick == 10) {
            let biome = getPlayerBiome(player);
            if (biome == BIOMES.pale_garden && isEffectEnabled('ground_fog') && player.location.y > 63) {
                player.addTag('spark_vfx.pale_garden_fog');
                player.runCommand('fog @s push spark_vfx:fog_pale_garden spark_vfx.pale_garden_fog');
            }
            else if (player.hasTag('spark_vfx.pale_garden_fog')) {
                player.removeTag('spark_vfx.pale_garden_fog');
                player.runCommand(`fog @s remove spark_vfx.pale_garden_fog`);
            }
        }
    });
    if (slow_tick % 10 == 0 &&
        worldtime_scoreboard.getScore("sunny") > 266 &&
        !(GlobalValues.northern_light_timer >= 1)) {
        const wind_dir = getWindDirection();
        for (let player of overworld_players) {
            if (isEffectEnabled("clouds", player) == false)
                return;
            if (player.location.y > 32 && player.location.y < 62 && player.isInWater)
                return;
            if (player.location.y < 40 || player.location.y > 300)
                return;
            const biome = player.getProperty("spark_vfx:biome_query");
            if (biome == BIOMES.desert)
                return;
            if (!isBlockLoaded(player.location, overworld) || !player.isValid)
                return;
            let overall_density = CLOUD_NOISE.noise(GlobalValues.absolute_time / 8_000, 420);
            let overall_type = CLOUD_NOISE.noise(GlobalValues.absolute_time / 14_000, -420);
            let overall_texture_val = CLOUD_NOISE.noise(GlobalValues.absolute_time / 10_000, -1420);
            let squish = overall_type > 0.3 ? 0.6 : overall_type < -0.5 ? 1.2 : 1;
            let base_height = 178;
            let min_radius = 32;
            let type_id = "spark_vfx:clouds_puffy";
            if (overall_texture_val > 0.5) {
                type_id = "spark_vfx:clouds_stratus";
                min_radius = 64;
            }
            else if (overall_texture_val > 0.2) {
                type_id = "spark_vfx:clouds_soft";
            }
            let iterations = Math.round((0.5 + overall_density) * 3.5);
            // Less clouds at night
            if (GlobalValues.time_of_day > 13000)
                iterations -= 2;
            // Regenerate clouds faster when walking
            iterations *= clamp(6 * Math.sqrt(player.getVelocity().x ** 2 + player.getVelocity().z ** 2), 1, 3);
            let location = player.location;
            for (let i = 0; i < iterations; i++) {
                let r = (1 - Math.pow(Math.random(), 2)) * 190 + min_radius;
                if (squish < 1)
                    r *= 2;
                const a = Math.random() * Math.PI * 2;
                const pos = [location.x + Math.sin(a) * r, location.z + Math.cos(a) * r];
                const shift = (GlobalValues.absolute_time / 1000) * 1.4;
                const noise_val = CLOUD_NOISE.noise(pos[0] / 100 + 1 * shift, pos[1] / 100 + 0.4 * shift);
                if (noise_val > randomAB(-0.3, 0.3)) {
                    const variables = new MolangVariableMap();
                    variables.setVector3("cloud_offset", {
                        x: pos[0] - location.x,
                        y: base_height + noise_val * 20 - location.y,
                        z: pos[1] - location.z,
                    });
                    variables.setFloat("squish", squish);
                    variables.setVector3("direction", wind_dir);
                    let speed = (0.8 + getWindIntensity(location) / 3);
                    variables.setFloat("speed", speed);
                    player.spawnParticle(type_id, location, variables);
                }
            }
        }
    }
    // Player Animations + Effects
    if (isEffectEnabled('swimming_trails')) {
        function spawnParticleForNearbyPlayers(effect_name, particle_id, location, variables) {
            overworld.getPlayers({ location, maxDistance: 72 }).forEach(player => {
                if (isEffectEnabled(effect_name, player)) {
                    player.spawnParticle(particle_id, location, variables);
                }
            });
        }
        overworld_players.forEach(player => {
            if (!player || !player.isValid || !player.isInWater)
                return;
            let block_location = player.location;
            block_location.y += 2.1;
            let block_top;
            try {
                block_top = overworld.getBlock(block_location);
            }
            catch (err) {
                return;
            }
            if (!block_top.isValid)
                return;
            if (block_top.isAir) {
                const location = { x: player.location.x, y: Math.round(player.location.y + 0.6), z: player.location.z };
                if (player.isSwimming) {
                    spawnParticleForNearbyPlayers("swimming_trails", "spark_vfx:swimming_trail", location);
                }
                if (slow_tick % 20 == 3 && Math.random() < 0.7) {
                    location.x += randomAB(-0.1, 0.1);
                    location.z += randomAB(-0.1, 0.1);
                    spawnParticleForNearbyPlayers("swimming_trails", "spark_vfx:player_ripple", location);
                }
                if (Math.random() < 0.14) {
                    location.x += randomAB(-1, 1);
                    location.z += randomAB(-1, 1);
                    spawnParticleForNearbyPlayers("swimming_trails", "spark_vfx:splash_ripple", location);
                }
            }
            else if (Math.random() < 0.2) {
                spawnParticleForNearbyPlayers("swimming_trails", "spark_vfx:swimming_trail_bubbles", player.location);
            }
        });
    }
    // Tumbleweed
    overworld.getEntities({ type: 'spark_vfx:tumbleweed' }).forEach(tumbleweed => {
        if (!tumbleweed.isValid)
            return;
        let velocity = tumbleweed.getVelocity();
        if (((velocity.x < 0 || velocity.z < 0) && Math.random() < 0.005) ||
            ((velocity.x == 0 && velocity.z == 0) && Math.random() < 0.001) ||
            tumbleweed.isInWater) {
            overworld.runCommand(`particle spark_vfx:tumbleweed_break ${tumbleweed.location.x} ${tumbleweed.location.y} ${tumbleweed.location.z}`);
            tumbleweed.remove();
            return;
        }
        let speed = 0.03 * (tumbleweed.getProperty("spark_vfx:wind_effect") || 1) * (tumbleweed.isOnGround ? 1 : 0.5) * GlobalValues.wind_intensity;
        if (speed > 0.015) {
            let bounce_up = Math.random() < 0.07;
            tumbleweed.applyImpulse({
                x: speed * (1 + (Math.random() - 0.5) * 2.0),
                y: Math.min(speed * (bounce_up ? 4 + Math.random() * 8 : 0), tumbleweed.isOnGround ? 0.76 : 0.2),
                z: speed * 1.12,
            });
        }
    });
    // Lava bubbles
    world.getPlayers().forEach((player) => {
        let is_nether = player.dimension.id == "minecraft:nether";
        if (isEffectEnabled(is_nether ? "lava_glow" : "bubbling_lava", player) == false)
            return;
        let player_location = player.location;
        for (let i = 0; i < 8; i++) {
            let position = {
                x: player_location.x + randomAB(-18, 18),
                y: player_location.y + randomAB(-5, 1),
                z: player_location.z + randomAB(-18, 18),
            };
            // Reduce duplicate lava effects at nether lava level
            if (is_nether && Math.floor(position.y) == 31 && Math.random() < 0.74)
                continue;
            let block = tryAndGetBlock(player.dimension, position);
            if (!(block &&
                block.isLiquid &&
                block.typeId == "minecraft:lava"))
                continue;
            let above = block.above();
            if (!above.isAir)
                continue;
            let depth = block.permutation.getState("liquid_depth");
            let dimension = player.dimension;
            let seed = Math.random();
            let spawn_pos = above.bottomCenter();
            const is_spawner_player = player.hasTag("spark_vfx.particle_spawner_15");
            if (depth) {
                spawn_pos.y -= depth / 16;
                if (seed < 0.15) {
                    spawn_pos.y -= 0.3;
                    player.spawnParticle("spark_vfx:bubbling_lava_single", spawn_pos);
                    if (is_spawner_player)
                        dimension.playSound("sound.spark_vfx.lava_burst", spawn_pos);
                }
                else if (seed < 0.3 && depth > 2) {
                    player.spawnParticle("spark_vfx:lava_burst_flowing", spawn_pos);
                    if (is_spawner_player)
                        dimension.playSound("sound.spark_vfx.lava_burst", spawn_pos);
                }
            }
            else {
                if (seed < 0.35) {
                    player.spawnParticle("spark_vfx:lava_bubble_m", spawn_pos);
                    if (is_spawner_player)
                        dimension.playSound("sound.spark_vfx.bubbling_lava", spawn_pos);
                }
                else if (seed < 0.45) {
                    player.spawnParticle("spark_vfx:lava_burst_big", spawn_pos);
                    if (is_spawner_player)
                        dimension.playSound("sound.spark_vfx.lava_burst", spawn_pos);
                }
                else if (seed < 0.6) {
                    player.spawnParticle("spark_vfx:lava_burst", spawn_pos);
                    if (is_spawner_player)
                        dimension.playSound("sound.spark_vfx.lava_burst", spawn_pos);
                }
                else if (seed < 0.7) {
                    player.spawnParticle("spark_vfx:bubbling_lava", spawn_pos);
                }
                if (isEffectEnabled("lava_glow")) {
                    player.spawnParticle("spark_vfx:lava_patterns_tiny", spawn_pos);
                }
            }
        }
    });
    // Sky Effects
    if (slow_tick % 20 == 7) {
        // Dust
        for (let player of overworld_players) {
            if (!isEffectEnabled("cave_dust", player))
                continue;
            if (player.location.y > 50)
                continue;
            let block = overworld.getBlockBelow(player.location);
            if (block && CAVE_DUST_BLOCKS.includes(block.typeId)) {
                player.spawnParticle("spark_vfx:cave_dust", player.location);
            }
        }
        // Underwater dust
        for (let player of overworld_players) {
            if (!isEffectEnabled("water_bubbles", player))
                continue;
            if (!player.isInWater)
                continue;
            player.spawnParticle("spark_vfx:underwater_dust", player.location);
            player.spawnParticle("spark_vfx:underwater_bubbles", player.location);
        }
        // Northern Lights
        if (GlobalValues.time_of_day > 13400 && GlobalValues.time_of_day < 20000) {
            const temp = randomInt(0, 600);
            if (temp == 1 && GlobalValues.northern_light_timer <= 0) {
                GlobalValues.northern_light_timer = 128;
                for (let player of overworld_players) {
                    const biome = player.getProperty("spark_vfx:biome_query");
                    if (!isEffectEnabled("northern_lights", player) || biome != BIOMES.frozen)
                        continue;
                    if (player.location.y < 61 || player.location.y > 100)
                        continue;
                    const effect_roll = randomInt(1, 5);
                    let position = Vector.copy(player.location);
                    position.y = 64;
                    try {
                        player.spawnParticle(`spark_vfx:northern_lights_${effect_roll}`, position);
                    }
                    catch (err) { }
                }
            }
        }
        if (GlobalValues.northern_light_timer > 0)
            GlobalValues.northern_light_timer--;
        // Shooting Star
        if (GlobalValues.time_of_day > 13_000 && GlobalValues.time_of_day < 13_030) {
            GlobalValues.shooting_star_chance = Math.pow(1 + Math.random() * 2.2, 2);
        }
        const shooting_star_roll = (Math.random() * 112) / GlobalValues.shooting_star_chance;
        if (GlobalValues.time_of_day > 13400 && GlobalValues.time_of_day < 22600 && shooting_star_roll < 1) {
            for (let player of overworld_players) {
                if (!isEffectEnabled("shooting_stars", player))
                    continue;
                const location = Vector.copy(player.location);
                location.x += randomRange(-50, 50);
                location.z += randomRange(-50, 50);
                try {
                    player.spawnParticle("spark_vfx:shooting_star", location);
                }
                catch (err) { }
            }
        }
        // Meteor shower
        if (GlobalValues.time_of_day > 13400 && GlobalValues.time_of_day < 21000) {
            // Trigger
            if (GlobalValues.meteor_shower_time < 1 && Math.random() * 580 < 1) {
                GlobalValues.meteor_shower_time = randomInt(30, 60);
            }
        }
        if (GlobalValues.meteor_shower_time > 0) {
            for (let player of overworld_players) {
                if (!isEffectEnabled("meteor_showers", player))
                    continue;
                const location = Vector.copy(player.location);
                location.x += randomRange(-50, 50);
                location.z += randomRange(-50, 50);
                try {
                    player.spawnParticle("spark_vfx:meteor_shower", location);
                }
                catch (err) { }
            }
            GlobalValues.meteor_shower_time--;
        }
        // Birds
        const bird_roll = randomInt(0, 40);
        if (GlobalValues.time_of_day < 13400) {
            for (let player of overworld_players) {
                if (bird_roll > 4)
                    continue;
                if (!isEffectEnabled('birds', player))
                    continue;
                let y = player.location.y;
                if (y < 63 || y > 200)
                    continue;
                try {
                    if (bird_roll == 1) {
                        player.spawnParticle('spark_vfx:sky_goose', player.location);
                    }
                    else if (bird_roll == 2) {
                        player.spawnParticle('spark_vfx:sky_buzzard', player.location);
                    }
                    else if (bird_roll == 3 || bird_roll == 4) {
                        player.spawnParticle('spark_vfx:sky_crow', player.location);
                    }
                }
                catch (err) {
                    if (err instanceof LocationInUnloadedChunkError == false)
                        console.error(err);
                }
            }
        }
    }
    tickLensFlare();
}
export function runBirdEvent(player, position, dimension, force) {
    if (!force) {
        let block = dimension.getBlock(position);
        if (!block || !block.isValid || block.isAir)
            return;
        if (!(block.permutation.matches('minecraft:grass') ||
            block.permutation.matches('minecraft:leaves') ||
            block.permutation.matches('minecraft:leaves2')))
            return;
    }
    let variables = new MolangVariableMap();
    let player_offset = [
        player.location.x - position.x,
        player.location.z - position.z,
    ];
    variables.setFloat('rotation', Math.atan2(player_offset[1], -player_offset[0]) / Math.PI * 180 + randomAB(-70, 70));
    for (let player2 of dimension.getPlayers({ location: position, maxDistance: 100 })) {
        if (!isEffectEnabled("startled_birds", player2))
            continue;
        player2.runCommand(`playsound sound.spark_vfx.bird_event @s ${position.x} ${position.y} ${position.z} 2`);
        player2.spawnParticle('spark_vfx:bird_event', position, variables);
    }
}
world.beforeEvents.explosion.subscribe((event) => {
    if (!event.source)
        return;
    if (event.source.typeId.includes('wind_charge'))
        return;
    if (!isEffectEnabled('explosions'))
        return;
    try {
        let location = event.source.location;
        system.runTimeout(() => {
            for (let player of event.dimension.getPlayers()) {
                if (!isEffectEnabled('explosions', player))
                    continue;
                player.spawnParticle('spark_vfx:explosion_main', location);
            }
        }, 0);
    }
    catch (err) {
    }
});
world.afterEvents.weatherChange.subscribe((event) => {
    GlobalValues.weather = event.newWeather;
});
world.afterEvents.entityHealthChanged.subscribe(arg => {
    // @ts-ignore
    arg.entity._health_difference = arg.newValue - arg.oldValue;
});
world.afterEvents.entityHitEntity.subscribe((event) => {
    if (event.damagingEntity instanceof Player && !event.damagingEntity.isOnGround && isEffectEnabled('explosions')) {
        let player = event.damagingEntity;
        let equippable = player.getComponent(EntityComponentTypes.Equippable);
        let item = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (item?.typeId == 'minecraft:mace') {
            system.runTimeout(() => {
                // @ts-ignore
                let health_difference = event.hitEntity._health_difference ?? 0;
                if (health_difference < -10) {
                    event.hitEntity.dimension.spawnParticle('spark_vfx:mace_shockwave', event.hitEntity.location);
                }
            }, 1);
        }
    }
});
world.afterEvents.playerInteractWithBlock.subscribe((e) => {
    if (e.block.typeId == "minecraft:end_portal_frame" && e.beforeItemStack?.typeId == "minecraft:ender_eye") {
        let pos = e.block.bottomCenter();
        pos.y += 0.82;
        e.block.dimension.spawnParticle('spark_vfx:end_portal_frame_activate', pos);
    }
});
world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (entity.typeId == 'spark_vfx:tumbleweed' &&
        entity.isValid &&
        !isEffectEnabled("tumbleweeds", entity.dimension.getPlayers({ location: entity.location, maxDistance: 60 })) &&
        cause == EntityInitializationCause.Spawned) {
        entity.remove();
    }
});
//# sourceMappingURL=vfx.js.map
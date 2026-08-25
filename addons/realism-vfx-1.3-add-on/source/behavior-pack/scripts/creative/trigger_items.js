import { GraphicsMode, MolangVariableMap, WeatherType, world } from "@minecraft/server";
import { getHighestPoint, getPlayerBiome, randomAB, randomInt, randomRange, sendUsageWarningMessage } from "../util/util";
import { GlobalValues } from "../vfx/global_values";
import { runBirdEvent } from "../vfx/vfx";
import biomes from "../vfx/biomes";
import { Vector } from "../util/vector";
world.afterEvents.itemUse.subscribe((event) => {
    if (!event.itemStack.typeId.startsWith('spark_vfx:trigger_'))
        return;
    let player = event.source;
    let dimension = player.dimension;
    let effect_id = event.itemStack.typeId.replace('spark_vfx:trigger_', '');
    let spawn_location;
    let look_at_block = player.getBlockFromViewDirection({ includePassableBlocks: false, maxDistance: 4 });
    if (look_at_block) {
        spawn_location = {
            x: look_at_block.block.location.x + look_at_block.faceLocation.x,
            y: look_at_block.block.location.y + look_at_block.faceLocation.y,
            z: look_at_block.block.location.z + look_at_block.faceLocation.z,
        };
    }
    else {
        let face_direction = player.getViewDirection();
        let head_pos = player.getHeadLocation();
        let dis = 1.6;
        spawn_location = {
            x: head_pos.x + face_direction.x * dis,
            y: head_pos.y + face_direction.y * dis,
            z: head_pos.z + face_direction.z * dis,
        };
    }
    let successful = true;
    switch (effect_id) {
        case 'startled_birds': {
            let face_direction = player.getViewDirection();
            let head_pos = player.getHeadLocation();
            let dis = randomAB(8, 9);
            spawn_location = {
                x: head_pos.x + face_direction.x * dis + randomAB(-7, 7),
                y: head_pos.y + 12,
                z: head_pos.z + face_direction.z * dis + randomAB(-7, 7),
            };
            spawn_location.y = getHighestPoint(dimension, spawn_location, true, false, spawn_location.y).y;
            runBirdEvent(player, spawn_location, dimension, true);
            break;
        }
        case 'tumbleweed': {
            if (player.dimension.getEntities({ location: spawn_location, maxDistance: 3, type: 'spark_vfx:tumbleweed' }).length == 0) {
                successful = false;
            }
            break;
        }
        case 'flies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 6);
            spawn_location.y += 0.3;
            dimension.spawnParticle('spark_vfx:flies', spawn_location, variables);
            player.playSound('sound.spark_vfx.flies', { location: spawn_location, volume: 1.2 });
            break;
        }
        case 'fireflies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 6);
            spawn_location.y += 0.3;
            dimension.spawnParticle('spark_vfx:fireflies', spawn_location, variables);
            break;
        }
        case 'aurora': {
            player.runCommand('scoreboard players set northern_lights spark_vfx.worldtime 128');
            player.runCommand('function spark/vfx/events/northern_lights');
            break;
        }
        case 'birds': {
            let variables = new MolangVariableMap();
            variables.setFloat('spawn_direction', (randomAB(-44, 44) - player.getRotation().y) / 360);
            let roll = Math.floor(Math.random() * 3.3);
            switch (roll) {
                case 0:
                    dimension.spawnParticle('spark_vfx:sky_goose', spawn_location, variables);
                    break;
                case 1:
                    dimension.spawnParticle('spark_vfx:sky_buzzard', spawn_location, variables);
                    break;
                default:
                    dimension.spawnParticle('spark_vfx:sky_crow', spawn_location, variables);
                    break;
            }
            break;
        }
        case 'butterflies': {
            let variables = new MolangVariableMap();
            variables.setFloat('rate', 7);
            dimension.spawnParticle('spark_vfx:butterflies', spawn_location, variables);
            break;
        }
        case 'leaves': {
            for (let i = 0; i < 14; i++) {
                dimension.spawnParticle('spark_vfx:ambient_leaves_normal', spawn_location);
            }
            break;
        }
        case 'fog': {
            dimension.spawnParticle('spark_vfx:ground_fog_spawn_manual', player.location);
            break;
        }
        case 'shooting_star': {
            const location = Vector.copy(player.location);
            location.x += randomRange(-20, 20);
            location.z += randomRange(-20, 20);
            try {
                player.dimension.spawnParticle("spark_vfx:shooting_star", location);
            }
            catch (err) { }
            break;
        }
        case 'meteor_shower': {
            GlobalValues.meteor_shower_time = randomInt(30, 60);
            break;
        }
        case 'rainbow': {
            const direction = GlobalValues.time_of_day < 5900 ? -1 : 1;
            let location = Vector.copy(player.location);
            location.y = 64;
            let variables = new MolangVariableMap();
            let distance = player.graphicsMode == GraphicsMode.Deferred ? 90 : 130;
            variables.setFloat('offset_x', distance * direction);
            try {
                player.dimension.spawnParticle("spark_vfx:rainbow", location, variables);
            }
            catch (err) {
                //console.warn(err);
            }
            break;
        }
        case 'rain': {
            if (getPlayerBiome(player) == biomes.desert) {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_desert');
                successful = false;
            }
            else if (player.dimension.id != 'minecraft:overworld') {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_overworld');
                successful = false;
            }
            else {
                dimension.setWeather(WeatherType.Rain);
            }
            break;
        }
        case 'thunderstorm': {
            if (getPlayerBiome(player) == biomes.desert) {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_desert');
                successful = false;
            }
            else if (player.dimension.id != 'minecraft:overworld') {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_overworld');
                successful = false;
            }
            else {
                dimension.setWeather(WeatherType.Thunder);
            }
            break;
        }
        case 'sand_storm': {
            if (getPlayerBiome(player) == biomes.desert) {
                dimension.setWeather(WeatherType.Rain);
            }
            else {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_desert');
                successful = false;
            }
            break;
        }
        case 'snow_storm': {
            if (getPlayerBiome(player) == biomes.frozen) {
                dimension.setWeather(WeatherType.Thunder);
            }
            else {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_frozen');
                successful = false;
            }
            break;
        }
        case 'nether_weather': {
            if (player.dimension.id == 'minecraft:nether') {
                dimension.runCommand('function spark/vfx/toggle_nether_weather');
            }
            else {
                sendUsageWarningMessage(player, 'spark_vfx.message.effect_failed_not_nether');
                successful = false;
            }
            break;
        }
        case 'creaking_wisps': {
            dimension.spawnParticle('spark_vfx:creaking_wisp_triggered', spawn_location);
            break;
        }
        case 'resin_fireflies': {
            dimension.spawnParticle('spark_vfx:resin_fireflies', spawn_location);
            break;
        }
        case 'warped_forest_dust': {
            dimension.spawnParticle('spark_vfx:warped_dust_trigger', spawn_location);
            break;
        }
        case 'warped_forest_spores': {
            dimension.spawnParticle('spark_vfx:warped_tree_spores', spawn_location);
            break;
        }
        case 'crimson_forest_dust': {
            dimension.spawnParticle('spark_vfx:crimson_dust', spawn_location);
            break;
        }
        case 'crimson_forest_spores': {
            dimension.spawnParticle('spark_vfx:crimson_tree_spores', spawn_location);
            break;
        }
        case 'nether_fireflies': {
            dimension.spawnParticle('spark_vfx:nether_fireflies', spawn_location);
            break;
        }
        case 'nether_bugs': {
            dimension.spawnParticle('spark_vfx:nether_bugs', spawn_location);
            break;
        }
        case 'startled_spirits': {
            let view_direction = player.getViewDirection();
            let head_pos = player.getHeadLocation();
            let dis = randomAB(8, 9);
            spawn_location = {
                x: head_pos.x + view_direction.x * dis + randomAB(-7, 7),
                y: head_pos.y + 12,
                z: head_pos.z + view_direction.z * dis + randomAB(-7, 7),
            };
            spawn_location.y = getHighestPoint(dimension, spawn_location, true, false, spawn_location.y).y;
            let variables = new MolangVariableMap();
            variables.setVector3("direction", {
                x: -view_direction.x,
                y: 0,
                z: -view_direction.z,
            });
            player.dimension.spawnParticle("spark_vfx:startled_spirits", spawn_location, variables);
            player.dimension.playSound("sound.spark_vfx.startled_spirits", spawn_location);
            break;
        }
        case 'lingering_souls': {
            dimension.spawnParticle('spark_vfx:lingering_soul_triggered', spawn_location);
            break;
        }
        case 'soul_godrays': {
            dimension.spawnParticle('spark_vfx:soul_ray_emitted', spawn_location);
            break;
        }
        case 'lava_busts': {
            dimension.spawnParticle('spark_vfx:lava_burst_big', spawn_location);
            dimension.playSound("sound.spark_vfx.lava_burst", spawn_location);
            break;
        }
        case 'lava_bubbles': {
            dimension.spawnParticle('spark_vfx:lava_bubble_m', spawn_location);
            dimension.playSound("sound.spark_vfx.bubbling_lava", spawn_location);
            break;
        }
    }
    if (successful) {
        player.playSound('sound.spark_vfx.trigger');
    }
});
//# sourceMappingURL=trigger_items.js.map
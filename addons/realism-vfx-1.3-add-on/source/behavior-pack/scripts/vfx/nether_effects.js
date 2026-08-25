import { MolangVariableMap, world, WeatherType, } from "@minecraft/server";
import { clamp, getPlayerBiome, lerp, printCoordinates, randomAB, randomRange, tryAndGetBlock, } from "../util/util";
import { Vector } from "../util/vector";
import { isEffectEnabled } from "../settings";
import { GlobalValues } from "./global_values";
import biomes from "./biomes";
import SimplexNoise from "../util/noise";
import { getOrCreateScoreboard } from "../util/util";
let nether;
const STRIDE = 10;
const RADIUS = 4;
const TEST_CAVITY_OFFSETS = [1, 4, 8, -2, 12, -8];
const WEATHER_CLEAR_TIME = [130, 570];
const WEATHER_STORM_TIME = [60, 150];
const WEATHER_DEBUG = false;
const NETHER_BIOMES = {
    nether_wastes: 0,
    crimson_forest: 1,
    warped_forest: 2,
    basalt_deltas: 3,
    soulsand_valley: 4,
};
const ASHY_BLOCKS = ["minecraft:basalt"];
const FlameStormNoiseX = new SimplexNoise();
const FlameStormNoiseY = new SimplexNoise();
const FlameStormNoiseZ = new SimplexNoise();
const FlameStormNoiseDensity = new SimplexNoise();
let worldtime_scoreboard;
let biome_scoreboard;
world.afterEvents.worldLoad.subscribe(() => {
    worldtime_scoreboard = getOrCreateScoreboard('spark_vfx.worldtime');
    biome_scoreboard = getOrCreateScoreboard('spark_vfx.biome');
});
class NetherEffectEmitter {
    chunks;
    chunk_index;
    current_chunk;
    biome_tester;
    constructor() {
        this.chunks = [];
        this.chunk_index = 0;
        let players = nether.getPlayers();
        if (!players.length)
            return;
        try {
            this.biome_tester = nether.spawnEntity("spark_vfx:biome_tester_nether", players[0].location);
            if (!this.biome_tester || !this.biome_tester.isValid)
                return;
        }
        catch (err) {
            return;
        }
        NetherEffectEmitter.active.push(this);
        let rows = [0];
        for (let i = 1; i <= RADIUS; i++) {
            // Handle close chunks first in case tester gets unloaded on accident
            rows.push(i, -i);
        }
        for (let player of players) {
            let speed = player.getVelocity();
            let pre_gen = 80;
            let pos = [
                Math.round((player.location.x + clamp(speed.x * pre_gen, -40, 40)) /
                    STRIDE) * STRIDE,
                Math.round((player.location.z + clamp(speed.z * pre_gen, -40, 40)) /
                    STRIDE) * STRIDE,
            ];
            let addChunk = (x, z) => {
                let player_location = player.location;
                let y = player_location.y;
                let found_cavity = false;
                for (let y_offset of TEST_CAVITY_OFFSETS) {
                    let test_block = tryAndGetBlock(nether, { x, y: y + y_offset, z });
                    if (test_block && test_block.isAir) {
                        y = y + y_offset;
                        found_cavity = true;
                        break;
                    }
                }
                if (!found_cavity)
                    return;
                let raycast_block = nether.getBlockFromRay({ x, y, z }, Vector.down, { includeLiquidBlocks: true, maxDistance: 100 });
                if (raycast_block) {
                    y = raycast_block.block.location.y + 1;
                }
                let distance = Math.sqrt((player_location.x - x) ** 2 +
                    (player_location.y - y) ** 2 +
                    (player_location.z - z) ** 2);
                let id = [x, y, z].join(" ");
                let existing_chunk = this.chunks.find((c) => c.id == id);
                if (existing_chunk) {
                    existing_chunk.distance_min = Math.min(existing_chunk.distance_min, distance);
                    existing_chunk.distance_max = Math.max(existing_chunk.distance_max, distance);
                    existing_chunk.players.push(player);
                }
                else {
                    let chunk = {
                        id,
                        surface_position: {
                            x: x + randomAB(-1, 1) * 5,
                            y,
                            z: z + randomAB(-1, 1) * 5,
                        },
                        ceiling_position: {
                            x: x + randomAB(-1, 1) * 5,
                            y,
                            z: z + randomAB(-1, 1) * 5,
                        },
                        player_plane_position: {
                            x: x + randomAB(-1, 1) * 5,
                            y: player.location.y,
                            z: z + randomAB(-1, 1) * 5,
                        },
                        distance_min: distance,
                        distance_max: distance,
                        players: [player],
                    };
                    this.chunks.push(chunk);
                }
            };
            for (let ox of rows) {
                for (let oz of rows) {
                    addChunk(pos[0] + ox * STRIDE, pos[1] + oz * STRIDE);
                }
            }
        }
    }
    tick() {
        let effect_chunk = this.chunks[this.chunk_index - 1];
        let test_chunk = this.chunks[this.chunk_index];
        if ((!effect_chunk && !test_chunk) ||
            !this.biome_tester ||
            !this.biome_tester.isValid) {
            return this.dispose();
        }
        if (effect_chunk) {
            let surface_position = effect_chunk.surface_position;
            let biome_id = this.biome_tester.getProperty("spark_vfx:biome_query");
            let biome_variant = this.biome_tester.getProperty("spark_vfx:biome_variant_query");
            if (this.chunk_index == 1 && effect_chunk.players[0].isValid) {
                biome_scoreboard.setScore(effect_chunk.players[0], 50 + biome_id);
            }
            if (surface_position && typeof biome_id == "number") {
                try {
                    this.emit(biome_id, biome_variant, effect_chunk);
                }
                catch (err) { }
            }
        }
        if (test_chunk) {
            try {
                let { x, y, z } = test_chunk.surface_position;
                let raycast_bottom = nether.getBlockFromRay({ x, y: y + 3, z }, Vector.down, { includeLiquidBlocks: true });
                let raycast_top = nether.getBlockFromRay({ x, y: y + 3, z }, Vector.up, { includeLiquidBlocks: false });
                let surface_block = raycast_bottom.block;
                if (surface_block.isValid && surface_block.isLiquid) {
                    test_chunk.discovered = "liquid";
                }
                test_chunk.surface_position.y = surface_block.location.y + 1;
                test_chunk.surface_block = surface_block;
                test_chunk.ceiling_position.y =
                    raycast_top?.block.location.y || 120;
                test_chunk.ceiling_block = raycast_top?.block;
                if (test_chunk.ceiling_position.y > y + 56) {
                    delete test_chunk.ceiling_position;
                }
                this.biome_tester.teleport({ x, y: y + 2, z });
                this.biome_tester.triggerEvent("spark_vfx:query_biome");
            }
            catch (err) {
                //console.error(err);
            }
        }
        this.chunk_index++;
    }
    particlePerPlayer(effect_id, particle_name, location, variables) {
        if (!this.current_chunk)
            return;
        for (let player of this.current_chunk.players) {
            if (!isEffectEnabled(effect_id, player))
                return;
            player.spawnParticle(particle_name, location, variables);
        }
    }
    emit(biome_id, biome_variant, chunk) {
        this.current_chunk = chunk;
        // nether.spawnParticle('spark_vfx:explosion_melt', chunk.surface_position);
        // nether.spawnParticle('spark_vfx:blue_melt', chunk.ceiling_position);
        if (chunk.discovered == "liquid" &&
            isEffectEnabled("lava_glow", chunk.players) &&
            chunk.surface_position.y == 32 &&
            Math.random() < 0.26) {
            let high_players = chunk.players.find((player) => player.location.y > 56);
            nether.runCommand(`particle spark_vfx:${high_players ? "lava_patterns_far" : "lava_patterns"} ${chunk.surface_position.x} 32 ${chunk.surface_position.z}`);
        }
        if (GlobalValues.nether_weather != WeatherType.Rain) {
            if ([
                NETHER_BIOMES.warped_forest,
                NETHER_BIOMES.crimson_forest,
            ].indexOf(biome_id) != -1 &&
                chunk.discovered != "liquid") {
                if (Math.random() < 1 / 35) {
                    this.particlePerPlayer("nether_fireflies", "spark_vfx:nether_fireflies", chunk.surface_position);
                }
            }
            if ([
                NETHER_BIOMES.warped_forest,
                NETHER_BIOMES.crimson_forest,
            ].indexOf(biome_id) != -1) {
                if (Math.random() < 1 / 10 && chunk.distance_min < 40) {
                    this.particlePerPlayer("nether_bugs", "spark_vfx:nether_bugs", chunk.surface_position);
                }
            }
        }
        if (chunk.discovered == "liquid" && chunk.distance_min < 52) {
            let seed = Math.random();
            if (chunk.surface_position.y > 33)
                seed *= 1.8;
            for (let player of chunk.players) {
                if (isEffectEnabled("lava_bursts", player) == false)
                    continue;
                if (seed < 0.08) {
                    player.spawnParticle("spark_vfx:lava_bubble_m_additive", chunk.surface_position);
                    player.runCommand(`playsound sound.spark_vfx.bubbling_lava @s ${printCoordinates(chunk.surface_position)}`);
                }
                else if (seed < 0.5) {
                    player.spawnParticle("spark_vfx:lava_burst", chunk.surface_position);
                    player.runCommand(`playsound sound.spark_vfx.lava_burst @s ${printCoordinates(chunk.surface_position)}`);
                }
                else if (seed < 0.62) {
                    player.spawnParticle("spark_vfx:lava_burst_big", chunk.surface_position);
                    player.runCommand(`playsound sound.spark_vfx.lava_burst @s ${printCoordinates(chunk.surface_position)}`);
                }
                if (seed < 0.7 && seed > 0.4 && chunk.distance_min < 35) {
                    player.spawnParticle("spark_vfx:bubbling_lava", chunk.surface_position);
                }
            }
        }
        if (chunk.surface_block?.isValid && ASHY_BLOCKS.indexOf(chunk.surface_block.typeId) != -1) {
            this.particlePerPlayer("ash_dust", "spark_vfx:ground_ash", chunk.surface_position);
        }
        if (biome_id == NETHER_BIOMES.crimson_forest && chunk.distance_min < 34 && GlobalValues.nether_weather != WeatherType.Rain) {
            if (Math.random() < 0.2) {
                this.particlePerPlayer("nether_forest_dust", "spark_vfx:crimson_dust", chunk.surface_position);
            }
            if (chunk.ceiling_position.y < chunk.surface_position.y + 20 &&
                (chunk.ceiling_block?.matches("minecraft:nether_wart_block"))) {
                this.particlePerPlayer("nether_forest_spores", "spark_vfx:crimson_tree_spores", chunk.ceiling_block.bottomCenter());
            }
        }
        if (biome_id == NETHER_BIOMES.warped_forest && chunk.distance_min < 40 && GlobalValues.nether_weather != WeatherType.Rain) {
            if (Math.random() < 1 / 6) {
                this.particlePerPlayer("nether_forest_dust", "spark_vfx:warped_dust", chunk.surface_position);
            }
            if (chunk.surface_block?.matches("minecraft:warped_nylium") || chunk.surface_block?.matches("minecraft:warped_wart_block")) {
                this.particlePerPlayer("nether_forest_spores", "spark_vfx:warped_tree_spores", chunk.surface_block.bottomCenter());
            }
        }
        if (biome_id == NETHER_BIOMES.soulsand_valley && GlobalValues.nether_weather != WeatherType.Rain) {
            if (Math.random() < 1 / 14) {
                this.particlePerPlayer("lingering_souls", "spark_vfx:lingering_souls", chunk.surface_position);
            }
            if (Math.random() < 1 / 9) {
                const variables = new MolangVariableMap();
                variables.setFloat("wind_intensity", 0.35 + Math.random() * 0.3);
                this.particlePerPlayer("soul_sand_dust", "spark_vfx:nether_dust_ground", chunk.surface_position, variables);
            }
            if (Math.random() < 1 / 10 && chunk.distance_max > 40) {
                const surface_y = chunk.surface_position.y;
                const ceiling_y = chunk.ceiling_position?.y ?? 100;
                if (ceiling_y - surface_y > 10) {
                    const pos_y = lerp(surface_y, ceiling_y, 0.1 + Math.random() * 0.8);
                    const pos = { x: chunk.surface_position.x, y: pos_y, z: chunk.surface_position.z };
                    this.particlePerPlayer("soul_godrays", "spark_vfx:soul_ray", pos);
                }
            }
        }
        // WEATHER
        if (GlobalValues.nether_weather == WeatherType.Rain || WEATHER_DEBUG) {
            if (biome_id == NETHER_BIOMES.soulsand_valley && chunk.distance_min < 56) {
                for (let player of chunk.players) {
                    if (isEffectEnabled("soul_storms", player) == false)
                        continue;
                    if (Math.random() < 0.65) {
                        player.spawnParticle("spark_vfx:soul_storm", chunk.surface_position);
                    }
                    player.spawnParticle("spark_vfx:soul_storm_dust", chunk.surface_position);
                    if (Math.random() < 0.3) {
                        player.spawnParticle("spark_vfx:wind_gust", chunk.surface_position);
                    }
                    if (chunk.discovered != "liquid" && Math.random() < 0.6) {
                        const variables = new MolangVariableMap();
                        variables.setFloat("wind_intensity", 2);
                        player.spawnParticle("spark_vfx:nether_dust_ground", chunk.surface_position, variables);
                    }
                }
            }
            if (biome_id == NETHER_BIOMES.basalt_deltas && chunk.distance_min < 50) {
                this.particlePerPlayer("ash_storms", "spark_vfx:ash_storm", chunk.surface_position);
            }
            if ([NETHER_BIOMES.nether_wastes, NETHER_BIOMES.crimson_forest, NETHER_BIOMES.warped_forest].indexOf(biome_id) != -1 &&
                isEffectEnabled("flame_storms", chunk.players) &&
                chunk.distance_min < 50) {
                const scale = 120;
                const direction = {
                    x: FlameStormNoiseX.noise(chunk.surface_position.x / scale, chunk.surface_position.z / scale + (GlobalValues.uptime * 0.2) / scale),
                    y: FlameStormNoiseY.noise(chunk.surface_position.x / scale, chunk.surface_position.z / scale - (GlobalValues.uptime * 0.2) / scale) - 0.15,
                    z: FlameStormNoiseZ.noise(chunk.surface_position.x / scale, chunk.surface_position.z / scale + (GlobalValues.uptime * 0.2) / scale),
                };
                const intensity = 1 + FlameStormNoiseDensity.noise(chunk.surface_position.x / 60, chunk.surface_position.z / 60 + GlobalValues.uptime * 0.3);
                const variables = new MolangVariableMap();
                variables.setVector3("direction", direction);
                variables.setFloat("speed", 6 + intensity * 8);
                for (let player of chunk.players) {
                    if (isEffectEnabled("flame_storms", player) == false)
                        continue;
                    player.spawnParticle("spark_vfx:flame_storm", chunk.player_plane_position, variables);
                    if (Math.random() < 0.5) {
                        player.spawnParticle("spark_vfx:flame_storm_dust", chunk.surface_position, variables);
                    }
                    if (Math.random() < 0.8) {
                        player.spawnParticle("spark_vfx:flame_storm_ash", chunk.surface_position, variables);
                    }
                    if (Math.random() < 0.3) {
                        player.spawnParticle("spark_vfx:flame_storm_large", chunk.player_plane_position, variables);
                    }
                    if (Math.random() < 0.1) {
                        player.spawnParticle("spark_vfx:flame_storm_gust", chunk.player_plane_position);
                    }
                    if (Math.random() < 0.17 && chunk.distance_min < 28) {
                        variables.setFloat("glow_intensity", clamp(intensity * 7 - 4, 0, 10));
                        player.spawnParticle("spark_vfx:flame_storm_glow", chunk.player_plane_position, variables);
                    }
                }
            }
        }
    }
    dispose() {
        let i = NetherEffectEmitter.active.indexOf(this);
        NetherEffectEmitter.active.splice(i, 1);
        if (this.biome_tester && this.biome_tester.isValid) {
            this.biome_tester.triggerEvent("spark_vfx:despawn");
        }
    }
    static active = [];
}
function enableWeatherFog(player) {
    if (!player.isValid)
        return;
    let biome = getPlayerBiome(player);
    let fog_id = "";
    if (biome == biomes.basalt_deltas) {
        if (isEffectEnabled("ash_storms", player))
            fog_id = "spark_vfx:fog_ash_storm";
    }
    else if (biome == biomes.soulsand_valley) {
        if (isEffectEnabled("soul_storms", player))
            fog_id = "spark_vfx:fog_soul_storm";
    }
    else {
        if (isEffectEnabled("flame_storms", player))
            fog_id = "spark_vfx:fog_flame_storm";
    }
    if (fog_id) {
        player.addTag("spark_vfx.nether_weather_fog");
        player.runCommand(`fog @s push ${fog_id} spark_vfx.nether_weather`);
    }
}
function getScore(scoreboard, participant) {
    if (scoreboard.hasParticipant(participant)) {
        return scoreboard.getScore(participant) ?? null;
    }
    else {
        return null;
    }
}
let nether_effect_tick = 0;
export function netherEffectTick() {
    nether = nether ?? world.getDimension("nether");
    if (nether_effect_tick % 20 == 4) {
        let time = getScore(worldtime_scoreboard, "nether_weather_time") ?? 0;
        let value = getScore(worldtime_scoreboard, "nether_weather") ?? 1;
        worldtime_scoreboard.addScore("nether_weather_time", -1);
        GlobalValues.nether_weather = value
            ? WeatherType.Rain
            : WeatherType.Clear;
        if (time <= 0) {
            if (value) {
                worldtime_scoreboard.setScore("nether_weather_time", randomRange(...WEATHER_CLEAR_TIME));
            }
            else {
                worldtime_scoreboard.setScore("nether_weather_time", randomRange(...WEATHER_STORM_TIME));
            }
            let new_value = value ? 0 : 1;
            worldtime_scoreboard.setScore("nether_weather", new_value);
            GlobalValues.nether_weather = new_value
                ? WeatherType.Rain
                : WeatherType.Clear;
        }
        world.getPlayers({ tags: ["spark_vfx.nether_weather_fog"] }).forEach((player) => {
            player.removeTag("spark_vfx.nether_weather_fog");
            player.runCommand("fog @s remove spark_vfx.nether_weather");
        });
        if (GlobalValues.nether_weather == WeatherType.Rain) {
            nether.getPlayers().forEach((player) => {
                enableWeatherFog(player);
            });
        }
    }
    nether_effect_tick++;
    if (nether_effect_tick == 40) {
        new NetherEffectEmitter();
        nether_effect_tick = 0;
    }
    NetherEffectEmitter.active.forEach((emitter) => {
        emitter.tick();
    });
    if (nether_effect_tick % 2 == 0) {
        world.getPlayers().forEach((player) => {
            let linear_velocity = Vector.getLength(player.getVelocity());
            if (linear_velocity > 0.05) {
                // Ash steps
                let location = player.location;
                let block = tryAndGetBlock(player.dimension, Vector.add(location, { x: 0, y: -0.7, z: 0 }));
                if (block && ASHY_BLOCKS.indexOf(block.typeId) != -1) {
                    player.dimension.spawnParticle("spark_vfx:ground_ash_step", location);
                }
                // Startled spirits
                if (player.dimension == nether && isEffectEnabled("startled_spirits", player) && Math.random() < 1 / 105) {
                    let biome = getPlayerBiome(player);
                    if (biome == biomes.warped_forest ||
                        biome == biomes.crimson_forest) {
                        let player_location = player.location;
                        let view_direction = player.getViewDirection();
                        let distance = 10 + Math.random() * 7;
                        let position = {
                            x: player_location.x +
                                view_direction.x * distance +
                                randomAB(-5, 5),
                            y: player_location.y + randomAB(-4, 4),
                            z: player_location.z +
                                view_direction.z * distance +
                                randomAB(-5, 5),
                        };
                        let block = tryAndGetBlock(nether, position);
                        if (block?.isAir && !block.below().isAir) {
                            let variables = new MolangVariableMap();
                            variables.setVector3("direction", {
                                x: -view_direction.x,
                                y: 0,
                                z: -view_direction.z,
                            });
                            for (let view_player of player.dimension.getPlayers({ location: player.location, maxDistance: 32 })) {
                                if (!isEffectEnabled("startled_spirits", view_player))
                                    continue;
                                view_player.spawnParticle("spark_vfx:startled_spirits", position, variables);
                                view_player.runCommand(`playsound sound.spark_vfx.startled_spirits @s ${printCoordinates(position)}`);
                            }
                        }
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=nether_effects.js.map
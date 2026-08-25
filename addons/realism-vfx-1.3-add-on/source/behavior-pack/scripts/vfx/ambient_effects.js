import { GraphicsMode, MolangVariableMap, WeatherType, world } from "@minecraft/server";
import { clamp, getHighestPoint, randomAB } from '../util/util';
import { Vector } from "../util/vector";
import SimplexNoise from "../util/noise";
import { GlobalValues } from "./global_values";
import BIOMES from './biomes';
import { runBirdEvent } from "./vfx";
import { isEffectEnabled } from "../settings";
import { getSunAngle } from "./sun";
import { getWindDirection, getWindIntensity } from "../wind";
const STRIDE = 10;
const RADIUS = 4;
let uptime = 0;
const FogNoise = new SimplexNoise();
let biome_scoreboard;
class AmbientEffectEmitter {
    chunks;
    chunk_index;
    biome_tester;
    dimension;
    current_chunk;
    constructor() {
        this.dimension = world.getDimension('overworld');
        this.chunks = [];
        this.chunk_index = 0;
        let players = world.getAllPlayers().filter(player => player.dimension == this.dimension);
        if (!players.length)
            return;
        try {
            this.biome_tester = this.dimension.spawnEntity('spark_vfx:biome_tester', players[0].location);
            if (!this.biome_tester || !this.biome_tester.isValid)
                return;
        }
        catch (err) {
            return;
        }
        AmbientEffectEmitter.active.push(this);
        let rows = [0];
        for (let i = 1; i <= RADIUS; i++) {
            // Handle close chunks first in case tester gets unloaded on accident
            rows.push(i, -i);
        }
        for (let player of players) {
            let speed = player.getVelocity();
            let pre_gen = 80;
            let pos = [
                Math.round((player.location.x + clamp(speed.x * pre_gen, -40, 40)) / STRIDE) * STRIDE,
                Math.round((player.location.z + clamp(speed.z * pre_gen, -40, 40)) / STRIDE) * STRIDE
            ];
            let addChunk = (x, z, distance) => {
                let id = [x, z].join(' ');
                let existing_chunk = this.chunks.find(c => c.id == id);
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
                            y: player.location.y,
                            z: z + randomAB(-1, 1) * 5
                        },
                        distance_min: distance,
                        distance_max: distance,
                        players: [player]
                    };
                    this.chunks.push(chunk);
                }
            };
            for (let ox of rows) {
                for (let oz of rows) {
                    addChunk(pos[0] + ox * STRIDE, pos[1] + oz * STRIDE, Math.sqrt(ox ** 2 + oz ** 2) * STRIDE);
                }
            }
        }
    }
    tick() {
        let effect_chunk = this.chunks[this.chunk_index - 1];
        let test_chunk = this.chunks[this.chunk_index];
        if ((!effect_chunk && !test_chunk) || !this.biome_tester || !this.biome_tester.isValid) {
            return this.dispose();
        }
        if (effect_chunk) {
            let surface_position = effect_chunk.surface_position;
            let biome_id = this.biome_tester.getProperty('spark_vfx:biome_query');
            let biome_variant = this.biome_tester.getProperty('spark_vfx:biome_variant_query');
            if (uptime < 200) {
                let weather_at_chunk = this.biome_tester.getProperty('spark_vfx:weather_query');
                if (weather_at_chunk == 1 || weather_at_chunk == 3) {
                    GlobalValues.weather = WeatherType.Rain;
                }
                else if (weather_at_chunk == 2 || weather_at_chunk == 4) {
                    GlobalValues.weather = WeatherType.Thunder;
                }
            }
            if (this.chunk_index == 1 && effect_chunk.players[0].isValid) {
                biome_scoreboard = biome_scoreboard ?? world.scoreboard.getObjective('spark_vfx.biome');
                biome_scoreboard.setScore(effect_chunk.players[0], biome_id);
            }
            if (surface_position && biome_id) {
                try {
                    this.current_chunk = effect_chunk;
                    this.emit(biome_id, biome_variant, effect_chunk);
                }
                catch (err) {
                }
            }
        }
        if (test_chunk) {
            try {
                let { x, z } = test_chunk.surface_position;
                let { y } = getHighestPoint(this.dimension, { x: Math.round(x), y: 64, z: Math.round(z) }, true, true, 140);
                let surface_block = this.dimension.getBlock({ x, y, z });
                if (surface_block.isValid && surface_block.isLiquid) {
                    test_chunk.discovered = "liquid";
                }
                for (let i = 0; i < 16; i++) {
                    if (!surface_block.isValid)
                        break;
                    if (surface_block.isAir ||
                        surface_block.permutation.matches("minecraft:leaves") ||
                        surface_block.permutation.matches("minecraft:pale_oak_leaves") ||
                        surface_block.permutation.matches("minecraft:mangrove_leaves") ||
                        (surface_block.permutation.matches("minecraft:leaves2") &&
                            y > 64)) {
                        if (!surface_block.isAir) {
                            test_chunk.discovered = "tree";
                            if (!test_chunk.discovered_variant) {
                                if (surface_block.permutation.matches("minecraft:spruce_leaves")) {
                                    test_chunk.discovered_variant = "spruce";
                                }
                                if (surface_block.permutation.matches("minecraft:birch_leaves")) {
                                    test_chunk.discovered_variant = "birch";
                                }
                                if (surface_block.permutation.matches("minecraft:pale_oak_leaves")) {
                                    test_chunk.discovered_variant = "pale_oak";
                                }
                            }
                        }
                        let block_below = surface_block.below();
                        if (surface_block.isAir == false &&
                            test_chunk.discovered_height == undefined &&
                            block_below.isAir) {
                            test_chunk.discovered_height = surface_block.location.y + 1;
                            test_chunk.canopy_thickness = i;
                        }
                        surface_block = block_below;
                        y--;
                    }
                    else {
                        test_chunk.structure_height = i;
                        break;
                    }
                }
                test_chunk.surface_position.y = y;
                this.biome_tester.teleport({ x, y: y + 2, z });
                this.biome_tester.triggerEvent('spark_vfx:query_biome');
                if (uptime < 200) {
                    this.biome_tester.triggerEvent('spark_vfx:query_weather');
                }
            }
            catch (err) {
                //console.error(err);
            }
        }
        this.chunk_index++;
    }
    particlePerPlayer(effect_id, particle_name, location, variables, condition) {
        if (!this.current_chunk)
            return;
        for (let player of this.current_chunk.players) {
            if (!isEffectEnabled(effect_id, player))
                return;
            if (condition && !condition(player))
                return;
            player.spawnParticle(particle_name, location, variables);
        }
    }
    emit(biome_id, biome_variant, chunk) {
        let surface_position = chunk.surface_position;
        if (chunk.discovered == "tree" && chunk.discovered_variant == "pale_oak" && biome_id == BIOMES.pale_garden) {
            const position = { x: surface_position.x + 0.5, y: chunk.discovered_height ?? surface_position.x, z: surface_position.z + 0.5 };
            this.dimension.spawnParticle("minecraft:pale_oak_leaves_particle", position);
        }
        if (biome_id == BIOMES.frozen && GlobalValues.weather == WeatherType.Clear) {
            this.particlePerPlayer("snowflakes", "spark_vfx:snow_crystals", surface_position);
        }
        if ([BIOMES.forest, BIOMES.jungle, BIOMES.plains, BIOMES.meadow].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11_000 && GlobalValues.weather == WeatherType.Clear && surface_position.y < 150) {
            let chance = 1 / 80;
            let clear_radius = 30;
            if (biome_variant == 1) {
                chance = 1 / 6;
                clear_radius = 12;
            }
            if (Math.random() < chance && chunk.distance_min > clear_radius) {
                this.particlePerPlayer("butterflies", "spark_vfx:butterflies", surface_position);
            }
        }
        if ([BIOMES.forest, BIOMES.dark_oak, BIOMES.birch, BIOMES.mangroves].indexOf(biome_id) != -1 &&
            GlobalValues.time_of_day < 11_000 &&
            GlobalValues.weather == WeatherType.Clear &&
            surface_position.y < 100) {
            let chance = 1 / 110;
            if (Math.random() < chance && chunk.distance_min > 9 && chunk.distance_max < 22 && chunk.players.find(player => player.isSprinting)) {
                runBirdEvent(chunk.players[0], surface_position, this.dimension);
            }
        }
        if ([BIOMES.swamp, BIOMES.jungle, BIOMES.mangroves].indexOf(biome_id) != -1 && GlobalValues.time_of_day > 13_000 && GlobalValues.time_of_day < 21_000) {
            if (Math.random() < (1 / 10) && chunk.distance_min > 24) {
                this.particlePerPlayer("fireflies", "spark_vfx:fireflies", surface_position);
            }
        }
        if (biome_id == BIOMES.pale_garden &&
            GlobalValues.time_of_day > 13_000 &&
            GlobalValues.time_of_day < 21_000) {
            if (Math.random() < 1 / 3 && chunk.distance_min > 24) {
                this.particlePerPlayer("resin_fireflies", "spark_vfx:resin_fireflies", surface_position);
            }
        }
        if (biome_id == BIOMES.pale_garden &&
            GlobalValues.time_of_day > 13_000 &&
            GlobalValues.time_of_day < 21_000 &&
            chunk.distance_max < 26 && chunk.distance_min > 15) {
            this.particlePerPlayer("creaking_wisps", "spark_vfx:creaking_wisp", surface_position);
            if (Math.random() < 1 / 5) {
                this.particlePerPlayer("creaking_wisps", "spark_vfx:creaking_wisp_group", surface_position);
            }
        }
        if (([BIOMES.swamp, BIOMES.mangroves].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11_000 && Math.random() < (1 / 70)) ||
            ([BIOMES.savanna, BIOMES.mushroom].indexOf(biome_id) != -1 && GlobalValues.time_of_day < 11_000 && Math.random() < (1 / 120))) {
            for (let player of this.current_chunk.players) {
                if (!isEffectEnabled('flies', player))
                    continue;
                player.spawnParticle('spark_vfx:flies_natural', surface_position);
                player.playSound('sound.spark_vfx.flies', {
                    location: {
                        x: surface_position.x + randomAB(-3, 3),
                        y: surface_position.y + randomAB(-1, 2),
                        z: surface_position.z + randomAB(-3, 3),
                    },
                    volume: randomAB(0.4, 0.9)
                });
            }
        }
        if (biome_id == BIOMES.desert && chunk.distance_max < 30 && GlobalValues.time_of_day < 12_500 && chunk.discovered != 'liquid') {
            const variables = new MolangVariableMap();
            variables.setFloat("wind_intensity", GlobalValues.wind_intensity);
            variables.setVector3("direction", getWindDirection());
            this.particlePerPlayer("desert_sand", "spark_vfx:sand_ground", surface_position, variables);
            if (chunk.surface_position.y > 63 && chunk.surface_position.y < 80 && chunk.distance_max < 20 && Math.random() < 0.6) {
                this.particlePerPlayer("desert_sand", "spark_vfx:sand_air", surface_position, variables);
            }
        }
        if ((biome_id == BIOMES.ocean || biome_id == BIOMES.river) &&
            chunk.distance_max < 30 &&
            GlobalValues.time_of_day < 12_500) {
            const underwater_players = chunk.players.filter((player) => {
                return player.isValid && player.location.y < 62.0 && player.location.y > 40.0;
            });
            for (let player of underwater_players) {
                if (!isEffectEnabled("water_godrays", player))
                    continue;
                const effect_id = isEffectEnabled("water_bubbles", player) ? "spark_vfx:water_godrays" : "spark_vfx:water_godrays_dustless";
                player.spawnParticle(effect_id, {
                    x: surface_position.x + randomAB(-6, 6),
                    y: surface_position.y,
                    z: surface_position.z + randomAB(-6, 6),
                });
                player.spawnParticle("spark_vfx:water_surface_caustics", {
                    x: surface_position.x + randomAB(-6, 6),
                    y: surface_position.y + 1,
                    z: surface_position.z + randomAB(-6, 6),
                });
            }
        }
        let has_fog = false;
        if (surface_position.y > 58 &&
            surface_position.y < 200 &&
            !(GlobalValues.northern_light_timer > 1) &&
            !chunk.players[0].isInWater) {
            let is_morning_fog = (GlobalValues.time_of_day > 23_000 || GlobalValues.time_of_day < 1000)
                && [BIOMES.forest, BIOMES.birch, BIOMES.dark_oak, BIOMES.extreme_hills, BIOMES.jungle, BIOMES.river, BIOMES.taiga].indexOf(biome_id) != -1;
            if (is_morning_fog ||
                (biome_id == BIOMES.frozen && GlobalValues.weather == WeatherType.Clear) ||
                biome_id == BIOMES.swamp ||
                biome_id == BIOMES.mangroves ||
                biome_id == BIOMES.pale_garden) {
                has_fog = true;
                let value = FogNoise.noise(surface_position.x, surface_position.z);
                value = 1 - Math.pow(1 - value, 2);
                if (biome_id == BIOMES.pale_garden) {
                    value *= 2.6;
                    if (chunk.distance_max > 32)
                        value = 0;
                }
                if (value > 0.1) {
                    let variables = new MolangVariableMap();
                    variables.setFloat('density', value * 9.5);
                    let fog_id = 'spark_vfx:ground_fog_spawn_chunk';
                    if (biome_id == BIOMES.frozen) {
                        fog_id = 'spark_vfx:ground_fog_cold_spawn_chunk';
                    }
                    if (biome_id == BIOMES.pale_garden) {
                        fog_id = "spark_vfx:ground_fog_pale_spawn_chunk";
                    }
                    this.particlePerPlayer("ground_fog", fog_id, surface_position, variables, (player) => {
                        // Reduce fog spawn attemps on vv
                        if (player.graphicsMode == GraphicsMode.Deferred)
                            return Math.random() < 0.5;
                        return true;
                    });
                    if (is_morning_fog && Math.random() < 0.22 && biome_id != BIOMES.river) {
                        variables.setFloat('angle', getSunAngle(true) / Math.PI * 180);
                        this.particlePerPlayer("light_rays", "spark_vfx:ground_fog_light_ray", surface_position, variables);
                    }
                }
            }
        }
        if (isEffectEnabled("light_rays", chunk.players) &&
            !has_fog &&
            chunk.discovered == 'tree' && chunk.discovered_height &&
            (GlobalValues.time_of_day < 12500 || GlobalValues.time_of_day > 23200) && GlobalValues.weather == WeatherType.Clear &&
            [BIOMES.savanna, BIOMES.desert, BIOMES.mesa, BIOMES.plains].indexOf(biome_id) == -1) {
            let sun_angle = getSunAngle(true);
            let ray_chance = (1 - Math.cos(sun_angle) * 0.9) * 1.1;
            if (Math.random() < ray_chance && chunk.canopy_thickness <= 2 && chunk.structure_height < 8) {
                let position = {
                    x: surface_position.x + 0.5,
                    y: chunk.discovered_height + Math.random() * 0.2,
                    z: surface_position.z + 0.5,
                };
                let direction = { x: Math.sin(sun_angle), y: -Math.cos(sun_angle), z: 0 };
                let ray = this.dimension.getBlockFromRay(position, direction, { excludeTypes: ['minecraft:leaves', 'minecraft:leaves2', 'minecraft:mangrove_leaves', 'minecraft:vine'] });
                let ray_length = 5;
                if (ray) {
                    ray_length = Vector.distance(position, ray.block.location);
                }
                if (ray_length > 2.8 && ray_length < 40 * Math.abs(direction.x)) {
                    let variables = new MolangVariableMap();
                    variables.setFloat('angle', sun_angle / Math.PI * 180);
                    variables.setFloat('length', clamp(ray_length, 3, 20));
                    this.particlePerPlayer("light_rays", "spark_vfx:light_ray", position, variables);
                }
            }
        }
        if (GlobalValues.weather != WeatherType.Clear && isEffectEnabled('raindrop_ripples') && chunk.distance_max < 15) {
            if (biome_id != BIOMES.frozen && biome_id != BIOMES.desert && biome_id != BIOMES.savanna && biome_id != BIOMES.mesa) {
                let particle_id = chunk.discovered == 'liquid' ? 'spark_vfx:rain_ripple' : 'spark_vfx:rain_ripple_ground';
                this.particlePerPlayer('raindrop_ripples', particle_id, surface_position);
            }
        }
        // Wind
        if (Math.random() < 0.3) {
            for (let player of chunk.players) {
                if (!isEffectEnabled("visible_wind", player))
                    continue;
                let wind_position = {
                    x: chunk.surface_position.x,
                    z: chunk.surface_position.z,
                    y: (player?.location.y ?? chunk.surface_position.y) + Math.random() * 8
                };
                if (wind_position.y <= 63)
                    continue;
                if (wind_position.y <= 90 && Math.random() > 0.2)
                    continue;
                let wind_intensity = getWindIntensity(wind_position, false);
                if (wind_intensity > (1 + Math.random() * 10) * 1.4) {
                    let variables = new MolangVariableMap();
                    variables.setFloat("intensity", wind_intensity);
                    variables.setVector3("direction", getWindDirection());
                    player.spawnParticle("spark_vfx:visible_wind", wind_position, variables);
                }
            }
        }
    }
    dispose() {
        let i = AmbientEffectEmitter.active.indexOf(this);
        AmbientEffectEmitter.active.splice(i, 1);
        if (this.biome_tester && this.biome_tester.isValid) {
            this.biome_tester.triggerEvent('spark_vfx:despawn');
        }
    }
    static active = [];
}
let biome_effect_tick = 0;
export function biomeEffectTick() {
    let the_end = world.getDimension('the_end');
    uptime++;
    biome_effect_tick++;
    if (biome_effect_tick == 40) {
        new AmbientEffectEmitter();
        // End effects
        for (const end_player of the_end.getPlayers({ location: { x: 0, y: 0, z: 0 }, maxDistance: 300 })) {
            if (isEffectEnabled("end_glow", end_player)) {
                try {
                    end_player.spawnParticle("spark_vfx:end_glow", { x: 0, y: 60, z: 0 });
                }
                catch (err) { }
            }
        }
        biome_effect_tick = 0;
    }
    if (biome_effect_tick % 2 == 0) {
        // End effects
        for (const end_player of the_end.getPlayers()) {
            if (isEffectEnabled("end_dust", end_player)) {
                try {
                    end_player.spawnParticle("spark_vfx:end_dust", end_player.location);
                }
                catch (err) { }
            }
        }
    }
    AmbientEffectEmitter.active.forEach(emitter => {
        emitter.tick();
    });
}
//# sourceMappingURL=ambient_effects.js.map
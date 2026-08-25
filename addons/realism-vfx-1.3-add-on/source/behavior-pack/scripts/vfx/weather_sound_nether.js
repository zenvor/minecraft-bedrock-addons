import { WeatherType, world, } from "@minecraft/server";
import { GlobalValues } from "./global_values";
import biomes from "./biomes";
import { isEffectEnabled } from "../settings";
import { getPlayerBiome } from "../util/util";
import { getOrCreateScoreboard } from "../util/util";
const WeatherSoundTimers = {};
const LoopDuration = 7 * 20;
let worldtime_scoreboard;
function playWeatherSound(player, starting) {
    let biome = getPlayerBiome(player);
    worldtime_scoreboard = worldtime_scoreboard ?? getOrCreateScoreboard('spark_vfx.worldtime');
    let weather_timer = worldtime_scoreboard.getScore("nether_weather_time");
    if (biome == biomes.soulsand_valley && isEffectEnabled("soul_storms")) {
        // Soul storm
        if (starting) {
            player.playSound("sound.spark_vfx.soul_storm_start");
        }
        else if (weather_timer < 7) {
            player.playSound("sound.spark_vfx.soul_storm_loop");
        }
        else {
            player.playSound("sound.spark_vfx.soul_storm_loop");
        }
    }
    else if (biome == biomes.basalt_deltas && isEffectEnabled("ash_storms")) {
        // Ash storm
        if (starting) {
            player.playSound("sound.spark_vfx.ash_storm_start");
        }
        else if (weather_timer < 7) {
            player.playSound("sound.spark_vfx.ash_storm_loop");
        }
        else {
            player.playSound("sound.spark_vfx.ash_storm_loop");
        }
    }
    else if ([
        biomes.crimson_forest,
        biomes.warped_forest,
        biomes.nether_wastes,
    ].indexOf(biome) != -1 &&
        isEffectEnabled("flame_storms")) {
        // Flame storm
        if (starting) {
            player.playSound("sound.spark_vfx.flame_storm_start");
        }
        else if (weather_timer < 7) {
            player.playSound("sound.spark_vfx.flame_storm_loop");
        }
        else {
            player.playSound("sound.spark_vfx.flame_storm_loop");
        }
    }
}
let nether;
let nether_weather_system_enabled = false;
world.afterEvents.worldLoad.subscribe(() => {
    nether = world.getDimension("nether");
});
export function netherWeatherSoundTick() {
    if (GlobalValues.nether_weather == WeatherType.Clear) {
        if (nether_weather_system_enabled) {
            nether_weather_system_enabled = false;
            for (let key in WeatherSoundTimers) {
                delete WeatherSoundTimers[key];
            }
        }
        return;
    }
    nether_weather_system_enabled = true;
    let players = nether.getPlayers();
    for (let player of players) {
        let starting = false;
        if (WeatherSoundTimers[player.id] == undefined) {
            WeatherSoundTimers[player.id] = 0;
            starting = true;
        }
        WeatherSoundTimers[player.id] += 1;
        if (WeatherSoundTimers[player.id] >= LoopDuration || starting) {
            playWeatherSound(player, starting);
            WeatherSoundTimers[player.id] = 0;
        }
    }
}
//# sourceMappingURL=weather_sound_nether.js.map
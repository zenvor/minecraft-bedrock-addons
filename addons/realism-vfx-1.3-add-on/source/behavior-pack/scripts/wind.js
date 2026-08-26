//import {clamp, degreeToRadian, getOrCreateScoreboard, randomRange, SimplexNoise, Vector} from "@minecraft-marketplace/utils";
import { system, WeatherType, world } from "@minecraft/server";
import { GlobalValues } from "./vfx/global_values";
import SimplexNoise from "./util/noise";
import { clamp, degreeToRadian, getOrCreateScoreboard, randomRange } from "./util/util";
import { Vector } from "./util/vector";
const config = {
    wind_speed_base: 0.7,
    wind_speed_increase_rain: 0.6,
    wind_speed_increase_thunder: 1.1,
    global_intensity_range: [0.1, 2],
    global_intensity_time_scale: 700,
    local_intensity_factor: 1.5,
    local_intensity_variation: 0.5,
    local_intensity_noise_scale: 90,
    local_intensity_time_scale: 1600,
    altitude_boost_base: 80,
    altitude_boost_scale: 100,
    direction_change_small: 0.1,
    direction_change_big: 0.4,
    direction_change_big_chance: 0.03,
    direction_change_moderate: 0.9,
};
const WIND_NOISE = new SimplexNoise();
const WindNoiseLat = new SimplexNoise();
let worldtime_scoreboard;
let wind_angle = Math.random() * 360 - 180;
let wind_delta = 0;
let wind_ff_amount = 0;
let wind_direction = new Vector(0, 0, 0);
function init() {
    worldtime_scoreboard = getOrCreateScoreboard("spark_vfx.worldtime");
    if (worldtime_scoreboard.hasParticipant("wind_angle")) {
        wind_angle = worldtime_scoreboard.getScore("wind_angle");
    }
}
world.afterEvents.worldLoad.subscribe(init);
/**
 * Get the global wind direction
 * @returns Returns the global wind direction as a normalized vector. Wind movement is always lateral so Y is always 0.
 */
export function getWindDirection() {
    return wind_direction;
}
/**
 * Get the wind direction as an angle
 * @returns Angle in degrees
 */
export function getWindAngle() {
    return wind_angle;
}
export function getWindFastForwardAmount() {
    return wind_ff_amount;
}
/**
 * Get the current wind intensity at a given position in the overworld
 * @param position Position vector to query
 * @param factor_global_intensity If true, global wind intensity is factored into the result. Passing false returns only the local intensity, which is useful for visualizing local differences.
 * @returns Returns the wind intensity, which is a value greater than 0 that typically ranges between 0.5 and 4, but can reach values above 10 at the right conditions at high altitude and during rain.
 */
export function getWindIntensity(position, factor_global_intensity = true) {
    let lat = WindNoiseLat.noise3d(position.x / config.local_intensity_noise_scale, GlobalValues.absolute_time / config.local_intensity_time_scale, position.z / config.local_intensity_noise_scale);
    let local_value = Math.pow(1 + lat * config.local_intensity_variation, 2) * config.local_intensity_factor;
    let altitude_boost = clamp((position.y - config.altitude_boost_base) / config.altitude_boost_scale, 0, 1);
    let global_factor = factor_global_intensity ? GlobalValues.wind_intensity : 1;
    return global_factor * local_value + altitude_boost;
}
export function fastFowardWind() {
    wind_ff_amount = clamp(wind_ff_amount + 2, 0, 20);
}
const North = Object.freeze(new Vector(0, 0, -1));
function windTick() {
    GlobalValues.wind_intensity = clamp(config.wind_speed_base + WIND_NOISE.noise(GlobalValues.time_of_day / config.global_intensity_time_scale, -400), ...config.global_intensity_range);
    if (GlobalValues.weather == WeatherType.Rain)
        GlobalValues.wind_intensity += config.wind_speed_increase_rain;
    if (GlobalValues.weather == WeatherType.Thunder)
        GlobalValues.wind_intensity += config.wind_speed_increase_thunder;
    // Change wind direction
    wind_delta += randomRange(-config.direction_change_small, config.direction_change_small);
    if (Math.random() < config.direction_change_big_chance) {
        wind_delta += randomRange(-config.direction_change_big, config.direction_change_big);
    }
    if (Math.abs(wind_delta) > Math.random()) {
        wind_delta *= config.direction_change_moderate;
    }
    wind_angle = ((wind_angle + wind_delta + 180 * 5) % 360) - 180;
    wind_direction = Vector.rotateY(North, degreeToRadian(wind_angle));
    worldtime_scoreboard.setScore("wind_angle", wind_angle);
}
// system.runInterval(() => {
// 	let player = world.getAllPlayers()[0]
// 	player.onScreenDisplay.setActionBar(`Angle: ${Math.round(wind_angle)}, Intensity: ${Math.round(getWindIntensity(player.location) * 100) / 100}, del: ${wind_delta}`)
// }, 2)
system.runInterval(windTick, 20);
system.runInterval(() => {
    if (wind_ff_amount > 0)
        wind_ff_amount--;
}, 1);
system.afterEvents.scriptEventReceive.subscribe(arg => {
    if (arg.id == 'spark_vfx:set_wind_direction') {
        let value = parseInt(arg.message);
        wind_angle = value;
        let player = arg.initiator;
        player.sendMessage({ translate: 'spark_vfx.message.wind_direction_set', with: [value.toString()] });
    }
}, { namespaces: ['spark'] });
//# sourceMappingURL=wind.js.map
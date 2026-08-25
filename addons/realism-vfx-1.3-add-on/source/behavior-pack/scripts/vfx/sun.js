import { GlobalValues } from "./global_values";
import { LinearCurve } from "../util/linear_curve";
import { WeatherType, world } from "@minecraft/server";
import { isEffectEnabled } from "../settings";
import { lerp } from "../util/util";
import { Vector } from "../util/vector";
const SUN_LOOKUP_TABLE = new LinearCurve({
    0: 0,
    1000: 710,
    2000: 1490,
    3000: 2300,
    4000: 3200,
    4500: 3670,
    5000: 4160,
    6000: 5160,
    7000: 6100,
});
const MOON_LOOKUP_TABLE = new LinearCurve({
    0: 0,
    2000: 2370,
    4000: 4660,
    5200: 5980,
    6000: 6400,
});
let overworld;
let lens_flare_smooth_y = {};
let lens_flare_smooth_opacity = {};
export function getSunAngle(is_day_time = true) {
    if (is_day_time) {
        let sun_time = ((GlobalValues.time_of_day + 6000) % 24000) - 12000;
        return ((SUN_LOOKUP_TABLE.get(Math.abs(sun_time)) *
            Math.sign(sun_time)) /
            12000) * Math.PI;
    }
    else {
        let moon_time = ((GlobalValues.time_of_day + 6000 + 12000) % 24000) - 12000;
        return ((MOON_LOOKUP_TABLE.get(Math.abs(moon_time)) *
            Math.sign(moon_time)) /
            12000) *
            Math.PI;
    }
}
export function tickLensFlare() {
    overworld = overworld ?? world.getDimension('overworld');
    // Lens flare
    let is_day_time = GlobalValues.time_of_day < 12800 || GlobalValues.time_of_day > 23200;
    if (GlobalValues.weather == WeatherType.Clear) {
        let flare_angle = getSunAngle(is_day_time);
        let variant = "day";
        if (is_day_time) {
            let sun_time = ((GlobalValues.time_of_day + 6000) % 24000) - 12000;
            if (Math.abs(sun_time) > 6000) {
                variant = "sunset";
            }
        }
        else {
            variant = "moon";
        }
        let transition_speed = 0.03;
        let transition_fade = Math.max(0, 1 - Math.abs(GlobalValues.time_of_day - 12800) * transition_speed, 1 - Math.abs(GlobalValues.time_of_day - 23200) * transition_speed);
        let distance = 55;
        let offset = {
            x: -Math.sin(flare_angle) * distance,
            y: Math.cos(flare_angle) * distance,
            z: 0,
        };
        overworld.getEntities({ type: 'spark_vfx:lens_flare' }).forEach((entity) => {
            if (!entity.isValid)
                return;
            entity.remove();
        });
        overworld.getPlayers().forEach((player) => {
            if (!player.isValid)
                return;
            if (is_day_time && !isEffectEnabled("sun_lens_flare", player))
                return;
            if (!is_day_time && !isEffectEnabled("moon_lens_flare", player))
                return;
            let eye = {
                x: player.location.x,
                y: player.location.y + (player.isSneaking ? 1.3 : 1.6),
                z: player.location.z,
            };
            eye.y = lerp(lens_flare_smooth_y[player.id] ?? eye.y, eye.y, 0.2);
            lens_flare_smooth_y[player.id] = eye.y;
            if (lens_flare_smooth_opacity[player.id] == undefined)
                lens_flare_smooth_opacity[player.id] = 0;
            let ray = overworld.getBlockFromRay(eye, offset, {
                includeLiquidBlocks: true,
                includePassableBlocks: false,
                maxDistance: 120
            });
            let is_blocked = ray && ray.block && ray.block.isValid && !ray.block.isAir;
            let target_opacity = (is_blocked ? 0 : 1);
            let opacity = lens_flare_smooth_opacity[player.id] = lerp(lens_flare_smooth_opacity[player.id], target_opacity, 0.5);
            opacity *= (1 - transition_fade);
            if (opacity < 0.05) {
                return;
            }
            try {
                let opacity_step = Math.round(opacity * 20);
                let entity = overworld.spawnEntity(`spark_vfx:lens_flare`, Vector.add(eye, offset), {
                    spawnEvent: `spark_vfx:${variant}_o_${opacity_step}>`
                });
                if (!entity || !entity.isValid) {
                    return;
                }
                player.setPropertyOverrideForEntity(entity, "spark_vfx:visible", true);
                let velocity = player.getVelocity();
                entity.applyImpulse(velocity);
            }
            catch (err) {
            }
        });
    }
    else {
        overworld.getEntities({ type: 'spark_vfx:lens_flare' }).forEach(entity => {
            if (!entity.isValid)
                return;
            entity.remove();
        });
    }
}
//# sourceMappingURL=sun.js.map
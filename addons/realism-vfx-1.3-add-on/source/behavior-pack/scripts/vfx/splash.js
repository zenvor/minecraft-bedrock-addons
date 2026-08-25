import { MolangVariableMap, Player, system } from "@minecraft/server";
import { clamp, isBlockLoaded, tryAndGetBlock } from "../util/util";
import { Vector } from "../util/vector";
import { isEffectEnabled } from "../settings";
const SplashSizes = {
    "minecraft:item": 1,
    "minecraft:fishing_hook": 1,
    'minecraft:xp_bottle': 1,
    'minecraft:splash_potion': 1,
    'minecraft:snowball': 1,
    'minecraft:egg': 1,
    'minecraft:arrow': 1,
    'minecraft:enderpearl': 1,
    "minecraft:rabbit": 1,
    "minecraft:bat": 1,
    "minecraft:pufferfish": 1,
    "minecraft:salmon": 1,
    "minecraft:cod": 1,
    "minecraft:tropicalfish": 1,
    "minecraft:ravager": 3,
    "minecraft:polar_bear": 3,
    "minecraft:panda": 3,
    "minecraft:iron_golem": 3,
    "minecraft:spider": 3,
    "minecraft:sniffer": 3,
    "minecraft:camel": 3,
    "minecraft:turtle": 3,
};
let falling_entities = {};
function entitySplashEffect(entity, velocity, is_lava) {
    let location = entity.location;
    location.y = Math.round(location.y - Math.max(velocity * 1, -2)) - 0.0;
    let ray = entity.dimension.getBlockFromRay(location, Vector.down, {
        includeLiquidBlocks: true,
        maxDistance: 20,
    });
    let size = SplashSizes[entity.typeId] || 2;
    if (ray && ray.block) {
        location.y = ray.block.location.y + 0.98;
    }
    if (is_lava) {
        entity.dimension.playSound("bucket.fill_lava", entity.location, {
            pitch: 1.5 - size * 0.3,
        });
    }
    let timeout = Math.round(clamp(velocity * -4 - 1, 0, 5));
    if (is_lava)
        timeout = 0;
    if (entity.typeId == "minecraft:fishing_hook")
        timeout += 4;
    system.runTimeout(() => {
        if (!entity.isValid || !isBlockLoaded(location, entity.dimension))
            return;
        if (entity.typeId == "minecraft:slime") {
            let component = entity.getComponent("minecraft:variant");
            if (component)
                size = component.value == 4 ? 3 : component.value;
        }
        let height = velocity < -0.8 ? "tall" : velocity < -0.55 ? "mid" : "low";
        let variables = new MolangVariableMap();
        variables.setFloat("speed", -velocity);
        variables.setFloat("radius", size == 1 ? 0.25 : size == 2 ? 0.5 : 1);
        let category = is_lava ? "lava_splash" : "splash";
        for (let player of entity.dimension.getPlayers({ location, maxDistance: 72 })) {
            if (!isEffectEnabled(is_lava ? "lava_splashes" : "splashes", player))
                continue;
            if (size == 1) {
                player.spawnParticle(`spark_vfx:${category}_ripple_sides_small`, location, variables);
                player.spawnParticle(`spark_vfx:${category}_sides_small`, location, variables);
            }
            else if (size == 2) {
                player.spawnParticle(`spark_vfx:${category}_ripple_sides_medium`, location, variables);
                player.spawnParticle(`spark_vfx:${category}_sides_medium_${height}`, location, variables);
            }
            else if (size == 3) {
                player.spawnParticle(`spark_vfx:${category}_ripple_sides_large`, location, variables);
                player.spawnParticle(`spark_vfx:${category}_sides_large_${height}`, location, variables);
            }
            player.spawnParticle(`spark_vfx:${category}_droplets`, location, variables);
        }
    }, timeout);
    if (entity instanceof Player) {
        let i = 0;
        let handle = system.runInterval(() => {
            i++;
            if (i > 8 || !entity.isValid || entity.getVelocity().y > -0.1) {
                system.clearRun(handle);
            }
            entity.dimension.spawnParticle('spark_vfx:splash_bubbles', entity.location);
        }, 1);
    }
}
export function splashTick(dimension) {
    dimension.getEntities().forEach((entity) => {
        let velocity = entity.getVelocity();
        let min_speed = -0.25;
        if (entity.typeId == "minecraft:fishing_hook" || entity.typeId == "minecraft:item")
            min_speed /= 10;
        if (velocity.y < min_speed) {
            let in_liquid = entity.isInWater;
            let is_lava = !entity.isInWater;
            if (!in_liquid && !entity.isOnGround) {
                let block = tryAndGetBlock(entity.dimension, entity.location);
                if (block?.isValid &&
                    block.isLiquid &&
                    block.typeId.includes("lava")) {
                    in_liquid = true;
                }
            }
            if (falling_entities[entity.id] === false &&
                in_liquid) {
                entitySplashEffect(entity, velocity.y, is_lava);
            }
            falling_entities[entity.id] = in_liquid;
        }
        else if (falling_entities[entity.id] !== undefined) {
            delete falling_entities[entity.id];
        }
    });
}
//# sourceMappingURL=splash.js.map
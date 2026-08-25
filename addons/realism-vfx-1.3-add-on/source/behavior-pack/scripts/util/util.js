import { world } from "@minecraft/server";
import { Vector } from "./vector";
/**
 * Clamps the input value to between the two numbers
 */
export const clamp = function (value, min, max) {
    return Math.max(Math.min(value, max), min);
};
export const lerp = function (start, end, lerp) {
    return start + (end - start) * lerp;
};
export const randomAB = function (start, end) {
    return start + Math.random() * (end - start);
};
export function radianToDegree(rad) {
    return (rad / Math.PI) * 180;
}
export function degreeToRadian(deg) {
    return Math.PI / (180 / deg);
}
/**
 * Returns a random Intager between two values
 *
 * @param min The min value
 * @param max The max value
 * @returns
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export const randomRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const isBlockLoaded = function (location, dimension) {
    try {
        return dimension.getBlock(location).isValid;
    }
    catch (e) {
        return false;
    }
    return false;
};
export const getHighestPoint = function (dimension, location, liquid = false, passable = false, maxHeight = 320) {
    let block = dimension.getBlockFromRay({ x: location.x, y: maxHeight, z: location.z }, Vector.down, { maxDistance: maxHeight + 64, includeLiquidBlocks: liquid, includePassableBlocks: passable });
    if (block == undefined)
        return { x: 0, y: -64, z: 0 };
    return { x: block.block.x, y: block.block.y, z: block.block.z };
};
export const getAboveHighestPoint = function (dimension, location) {
    let point = getHighestPoint(dimension, location);
    return Vector.add(point, Vector.up);
};
export const getBelowHighestPoint = function (dimension, location) {
    let point = getHighestPoint(dimension, location);
    return Vector.add(point, Vector.down);
};
export const isUnderGround = function (entity, maxHeight = 320) {
    let start_location = { x: entity.location.x, y: entity.location.y + 1.7, z: entity.location.z };
    let hit = entity.dimension.getBlockFromRay(start_location, Vector.up, { maxDistance: maxHeight + 64 });
    if (hit == undefined)
        return false;
    return true;
};
export const isUnderWater = function (entity) {
    if (!entity.isInWater)
        return false;
    let head_block = entity.dimension.getBlock({ x: entity.location.x, y: entity.location.y + 1.7, z: entity.location.z });
    if (!head_block.isValid)
        return false;
    return head_block.isLiquid;
};
export const isBlockAboveHead = function (entity) {
    let hit = entity.dimension.getBlockFromRay(entity.location, Vector.up, { maxDistance: 2 });
    return hit == undefined ? false : true;
};
export function tryAndGetBlock(dimension, location) {
    if (location.y > 320 || location.y < -64)
        return;
    if (dimension.id == 'minecraft:nether' && (location.y > 128 || location.y < 0))
        return;
    try {
        return dimension.getBlock(location);
    }
    catch (err) { }
}
export function isBlockAvailable(block) {
    if (!block)
        return false;
    return (block.isAir
        || block.isLiquid
        || block.permutation.matches('minecraft:tallgrass')
        || block.permutation.matches('minecraft:tall_grass')
        || block.permutation.matches('minecraft:snow_layer')
        || block.permutation.matches('minecraft:light_block')
        || block.permutation.matches('minecraft:light_block'));
}
/**
 * gets or creates a scoreboard objective
 *
 * @example
 * getOrCreateScoreboard("spark.example"): ScoreboardObjective // scoreboard objective for spark.example
 *
 * @export
 * @param {string} id the name of the scoreboard objective to get or create
 * @return {ScoreboardObjective}
 */
export function getOrCreateScoreboard(id) {
    let scoreboard = world.scoreboard.getObjective(id);
    if (!scoreboard) {
        scoreboard = world.scoreboard.addObjective(id, id);
    }
    return scoreboard;
}
const DIMENSIONS = [];
world.afterEvents.worldLoad.subscribe(() => {
    DIMENSIONS.push(world.getDimension("minecraft:overworld"), world.getDimension("minecraft:nether"), world.getDimension("minecraft:the_end"));
});
/**
 * queryies all dimensions for entities
 *
 * @example
 * getWorldwideEntities({ tags: ['foo'] }):Entity[]
 *
 * @export
 * @param {EntityQueryOptions} options
 * @return {Entity[]}
 */
export function getWorldwideEntities(options) {
    const entities = [];
    for (const dimension of DIMENSIONS) {
        const result = dimension.getEntities(options);
        entities.push(...result);
    }
    return entities;
}
export const getKeyFromBlock = function (block) {
    return getKeyFromVector(block.location);
};
export const getKeyFromVector = function (location) {
    return location.x.toString() + ":" + location.y.toString() + ":" + location.z.toString();
};
export const getVectorFromBlockKey = function (location) {
    let parts = location.split(":").map(Number);
    return { x: parts[0], y: parts[1], z: parts[2] };
};
export const printCoordinates = function (location) {
    return location.x.toString() + " " + location.y.toString() + " " + location.z.toString();
};
const ERROR_PREFIX = '§4[!]§7 ';
export function sendUsageWarningMessage(player, translate_key) {
    player.runCommand(`titleraw @s actionbar {"rawtext": [{"text": "${ERROR_PREFIX}"}, {"translate": "${translate_key}"}]}`);
}
let biome_scoreboard;
export function getPlayerBiome(player) {
    biome_scoreboard = biome_scoreboard ?? getOrCreateScoreboard('spark_vfx.biome');
    if (player.isValid && biome_scoreboard.hasParticipant(player)) {
        return biome_scoreboard.getScore(player);
    }
    else {
        return 0;
    }
}
//# sourceMappingURL=util.js.map
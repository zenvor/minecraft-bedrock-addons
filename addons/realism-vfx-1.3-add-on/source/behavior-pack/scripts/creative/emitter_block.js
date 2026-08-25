import { EntityComponentTypes, EquipmentSlot, GameMode, ItemStack, MolangVariableMap, system, world } from "@minecraft/server";
import { getHighestPoint, printCoordinates, randomAB, randomRange, sendUsageWarningMessage, tryAndGetBlock } from "../util/util";
import { Vector } from "../util/vector";
import { GlobalValues } from "../vfx/global_values";
import { runBirdEvent } from "../vfx/vfx";
import { isEffectEnabled } from "../settings";
import { getOrCreateScoreboard } from "../util/util";
class EmitterBlockInstance {
    block_location;
    location;
    particle_type;
    dimension;
    visible;
    destroyed;
    removing;
    phase;
    constructor(data = {}) {
        this.dimension = data.dimension;
        this.block_location = data.block_location;
        this.location = data.location;
        this.particle_type = data.particle_type;
        this.visible = data.visible;
        this.destroyed = false;
        this.removing = false;
        this.phase = 0;
        if (this.particle_type)
            this.calculatePhase();
    }
    get location_bottom() {
        return { x: this.location.x, y: this.location.y - 0.5, z: this.location.z };
    }
    add(key = this.getKey()) {
        emitterLocations.set(key, this);
        return this;
    }
    getKey() {
        return EmitterBlockInstance.getKey(this.block_location, this.dimension);
    }
    fromScoreboard(key, type) {
        let [x_string, y_string, z_string, dimension_id] = key.split(':');
        switch (dimension_id) {
            case '0':
                dimension_id = 'minecraft:overworld';
                break;
            case '1':
                dimension_id = 'minecraft:nether';
                break;
            case '2':
                dimension_id = 'minecraft:the_end';
                break;
        }
        let x = parseInt(x_string);
        let y = parseInt(y_string);
        let z = parseInt(z_string);
        this.dimension = world.getDimension(dimension_id);
        this.block_location = { x, y, z };
        this.location = { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
        this.visible = null;
        this.particle_type = type;
        this.calculatePhase();
        return this;
    }
    calculatePhase() {
        let emitter_type = EmitterTypesByNumber[this.particle_type];
        if (emitter_type) {
            this.phase = Math.floor(emitter_type.interval * Math.random());
        }
    }
    show() {
        if (this.visible === true)
            return true;
        try {
            let emitter_type = EmitterTypesByNumber[this.particle_type];
            this.dimension.runCommand(`setblock ${this.block_location.x} ${this.block_location.y} ${this.block_location.z} ${emitter_type.block_id}`);
            this.visible = true;
            this.verifyBlocksAround();
        }
        catch (err) {
            throw err;
        }
        finally {
            return this.visible;
        }
    }
    hide() {
        if (this.visible === false)
            return false;
        try {
            this.dimension.runCommand(`setblock ${this.block_location.x} ${this.block_location.y} ${this.block_location.z} spark_vfx:emitter_no_hitbox`);
            this.visible = false;
            this.verifyBlocksAround();
        }
        catch (err) {
            throw err;
        }
        finally {
            return this.visible;
        }
    }
    save() {
        emitterLocationBoard.setScore(this.getKey(), this.particle_type);
        return this;
    }
    remove(drop) {
        let key = this.getKey();
        emitterLocations.delete(key);
        emitterLocationBoard.removeParticipant(key);
        this.destroyed = true;
        if (drop) {
            try {
                let emitter_type = EmitterTypesByNumber[this.particle_type];
                let item_id = emitter_type.id.replace('emitter_', 'spark_vfx:emitter_placer_');
                this.dimension.spawnItem(new ItemStack(item_id, 1), this.location);
            }
            catch (err) { }
        }
    }
    verify() {
        if (this.removing)
            return true;
        try {
            let emitter_type = EmitterTypesByNumber[this.particle_type];
            let block = this.dimension.getBlock(this.block_location);
            let block_id = emitter_type.block_id;
            if (block && block.isValid) {
                if (!block.permutation.matches(block_id) && !block.permutation.matches('spark_vfx:emitter_no_hitbox')) {
                    this.remove(true);
                    EmitterBlockInstance.verifyBlocksAround(block, block_id);
                    system.runTimeout(() => {
                        EmitterBlockInstance.verifyBlocksAround(block, block_id);
                    }, 2);
                    return false;
                }
            }
        }
        catch (err) { }
        return true;
    }
    verifyBlocksAround() {
        let emitter_type = EmitterTypesByNumber[this.particle_type];
        let block = this.dimension.getBlock(this.block_location);
        let block_id = emitter_type.block_id;
        EmitterBlockInstance.verifyBlocksAround(block, block_id);
    }
    static getKey(location, dimension) {
        let dimension_id = dimension.id;
        switch (dimension_id) {
            case 'minecraft:overworld':
                dimension_id = '0';
                break;
            case 'minecraft:nether':
                dimension_id = '1';
                break;
            case 'minecraft:the_end':
                dimension_id = '2';
                break;
        }
        return location.x.toString() + ":" + location.y.toString() + ":" + location.z.toString() + ":" + dimension_id;
    }
    static verifyBlocksAround(block, block_id) {
        for (let side_block of [block.above(), block.below(), block.east(), block.west(), block.north(), block.south()]) {
            if (side_block.permutation.matches(block_id) || side_block.permutation.matches('spark_vfx:emitter_no_hitbox')) {
                let key = EmitterBlockInstance.getKey(side_block.location, block.dimension);
                if (!emitterLocations.get(key)) {
                    // Verify this is still the case 5 ticks later
                    system.runTimeout(() => {
                        let new_side_block = block.dimension.getBlock(side_block.location);
                        if (new_side_block.permutation.matches(block_id) || new_side_block.permutation.matches('spark_vfx:emitter_no_hitbox')) {
                            if (!emitterLocations.get(key)) {
                                block.dimension.runCommand(`setblock ${printCoordinates(side_block.location)} air`);
                            }
                        }
                    }, 5);
                }
            }
        }
    }
}
let emitterLocationBoard;
const emitterLocations = new Map();
const EmitterTypes = {};
const EmitterTypesByNumber = {};
class EmitterType {
    id;
    block_id;
    particle_type;
    setting;
    interval;
    range;
    constructor(id, particle_type, options, emit) {
        EmitterTypes[id] = this;
        EmitterTypesByNumber[particle_type] = this;
        this.id = id;
        this.block_id = `spark_vfx:${id}`;
        this.particle_type = particle_type;
        this.interval = options.interval || 20;
        this.range = options.range || 72;
        this.setting = options.setting || '';
        this.emit = emit;
    }
    emit(emitter, players) {
    }
}
new EmitterType('emitter_flies', 1, { interval: 40, range: 72, setting: 'flies' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:flies_emitterblock ${printCoordinates(emitter.location)}`);
    emitter.dimension.runCommand(`playsound sound.spark_vfx.flies @a ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_butterflies', 2, { interval: 30, range: 72, setting: 'butterflies' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:butterflies_emitterblock ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_aurora', 3, { interval: 60 * 20, range: 128, setting: 'northern_lights' }, (emitter) => {
    emitter.dimension.runCommand(`execute positioned ${printCoordinates(emitter.location)} run function spark/vfx/events/northernl_short`);
});
new EmitterType('emitter_birds', 4, { interval: 50, range: 72, setting: 'birds' }, (emitter) => {
    let roll = Math.floor(Math.random() * 7);
    let bird_id;
    switch (roll) {
        case 0:
            bird_id = 'spark_vfx:sky_goose';
            break;
        case 1:
            bird_id = 'spark_vfx:sky_buzzard';
            break;
        case 2:
        case 3:
            bird_id = 'spark_vfx:sky_crow';
            break;
    }
    emitter.dimension.runCommand(`particle ${bird_id} ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_fireflies', 5, { interval: 64, range: 80, setting: 'fireflies' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:fireflies ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_fog', 6, { interval: 70, range: 60, setting: 'ground_fog' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:ground_fog_spawn_emitterblock ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_leaves', 7, { interval: 30, range: 24 }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:ambient_leaves_normal_emitter ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_meteor_shower', 8, { interval: 20, range: 48, setting: 'meteor_showers' }, (emitter) => {
    if (Math.random() < 0.7) {
        const location = Vector.copy(emitter.location);
        location.x += randomRange(-50, 50);
        location.z += randomRange(-50, 50);
        try {
            emitter.dimension.runCommand(`particle spark_vfx:meteor_shower ${location.x} ${location.y} ${location.z}`);
        }
        catch (err) { }
    }
});
new EmitterType('emitter_shooting_star', 9, { interval: 100, range: 48, setting: 'shooting_stars' }, (emitter) => {
    if (Math.random() < 0.6) {
        const location = Vector.copy(emitter.location);
        location.x += randomRange(-50, 50);
        location.z += randomRange(-50, 50);
        try {
            emitter.dimension.runCommand(`particle spark_vfx:shooting_star ${location.x} ${location.y} ${location.z}`);
        }
        catch (err) { }
    }
});
new EmitterType('emitter_tumbleweed', 10, { interval: 30, range: 96, setting: 'tumbleweeds' }, (emitter) => {
    if (Math.random() < 0.4) {
        let nearby_tumbleweed = emitter.dimension.getEntities({
            type: 'spark_vfx:tumbleweed',
            maxDistance: 120,
            location: emitter.location
        });
        if (nearby_tumbleweed.length < 200) {
            emitter.dimension.runCommand(`execute positioned ${printCoordinates(emitter.location)} run function spark/vfx/events/random_tumbleweed`);
        }
    }
});
new EmitterType('emitter_rainbow', 11, { interval: 60 * 20, range: 96, setting: 'rainbows' }, (emitter) => {
    let direction = (GlobalValues.time_of_day % 12000) < 5900 ? -1 : 1;
    emitter.dimension.runCommand(`execute positioned ${emitter.location.x + 140 * direction} ${emitter.location.y} ${emitter.location.z} run particle spark_vfx:rainbow_emitterblock ~ 64 ~`);
});
new EmitterType('emitter_startled_birds', 12, { interval: 15 * 20, range: 20, setting: 'startled_birds' }, (emitter, players) => {
    if (players && players[0]) {
        let player_index = Math.floor(Math.random() * players.length);
        let position = {
            x: emitter.location.x + randomAB(-5, 5),
            y: emitter.location.y + randomAB(-0.6, 0.1),
            z: emitter.location.z + randomAB(-5, 5),
        };
        runBirdEvent(players[player_index], position, emitter.dimension, true);
    }
});
new EmitterType('emitter_creaking_wisps', 13, { interval: 10, range: 30, setting: 'creaking_wisps' }, (emitter) => {
    let position = {
        x: emitter.location.x + randomAB(-10, 10),
        y: emitter.location.y + randomAB(0, 3),
        z: emitter.location.z + randomAB(-10, 10),
    };
    emitter.dimension.runCommand(`particle spark_vfx:creaking_wisp ${printCoordinates(position)}`);
});
new EmitterType('emitter_resin_fireflies', 14, { interval: 50, range: 24, setting: 'fireflies' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:resin_fireflies ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_warped_forest_dust', 15, { interval: 30, range: 24, setting: 'nether_forest_dust' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:warped_dust ${printCoordinates(emitter.location_bottom)}`);
});
new EmitterType('emitter_warped_forest_spores', 16, { interval: 60, range: 24, setting: 'nether_forest_spores' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:warped_tree_spores ${printCoordinates(emitter.location_bottom)}`);
});
new EmitterType('emitter_crimson_forest_dust', 17, { interval: 60, range: 24, setting: 'nether_forest_dust' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:crimson_dust ${printCoordinates(emitter.location_bottom)}`);
});
new EmitterType('emitter_crimson_forest_spores', 18, { interval: 60, range: 24, setting: 'nether_forest_spores' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:crimson_tree_spores ${printCoordinates({ x: emitter.location.x, y: emitter.location.y + 0.5, z: emitter.location.z })}`);
});
new EmitterType('emitter_nether_fireflies', 19, { interval: 60, range: 24, setting: 'nether_fireflies' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:nether_fireflies ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_nether_bugs', 20, { interval: 30, range: 24, setting: 'nether_bugs' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:nether_bugs ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_startled_spirits', 21, { interval: 7 * 20, range: 20, setting: 'startled_spirits' }, (emitter, players) => {
    if (players && players[0]) {
        let player_index = Math.floor(Math.random() * players.length);
        let player = players[player_index];
        let player_location = player.location;
        let view_direction = player.getViewDirection();
        let distance = 10 + Math.random() * 7;
        let position = {
            x: player_location.x + view_direction.x * distance + randomAB(-5, 5),
            y: player_location.y + randomAB(-4, 4),
            z: player_location.z + view_direction.z * distance + randomAB(-5, 5),
        };
        position.y = getHighestPoint(player.dimension, position, true, false, position.y).y + 1.1;
        let block = tryAndGetBlock(player.dimension, position);
        if (block?.isAir) {
            let variables = new MolangVariableMap();
            variables.setVector3("direction", {
                x: -view_direction.x,
                y: 0,
                z: -view_direction.z,
            });
            player.dimension.spawnParticle("spark_vfx:startled_spirits", position, variables);
            player.dimension.playSound("sound.spark_vfx.startled_spirits", position);
        }
    }
});
new EmitterType('emitter_lingering_souls', 22, { interval: 30, range: 60, setting: 'lingering_souls' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:lingering_souls ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_soul_godrays', 23, { interval: 70, range: 100, setting: 'soul_godrays' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:soul_ray_emitted ${printCoordinates(emitter.location)}`);
});
new EmitterType('emitter_lava_busts', 24, { interval: 60, range: 40, setting: 'lava_bursts' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:lava_burst_big ${printCoordinates(emitter.location_bottom)}`);
    emitter.dimension.playSound("sound.spark_vfx.lava_burst", emitter.location);
});
new EmitterType('emitter_lava_bubbles', 25, { interval: 60, range: 40, setting: 'bubbling_lava' }, (emitter) => {
    emitter.dimension.runCommand(`particle spark_vfx:lava_bubble_m ${printCoordinates(emitter.location_bottom)}`);
    emitter.dimension.playSound("sound.spark_vfx.bubbling_lava", emitter.location);
});
world.afterEvents.worldLoad.subscribe(() => {
    emitterLocationBoard = getOrCreateScoreboard("spark_vfx:emitter_blocks");
    function loadData() {
        for (const identity of emitterLocationBoard.getParticipants()) {
            let key = identity.displayName;
            let score = emitterLocationBoard.getScore(identity);
            new EmitterBlockInstance().fromScoreboard(key, score).add();
        }
    }
    loadData();
});
// Placing / Breaking
let block_id_list = Object.keys(EmitterTypes).map(id => `spark_vfx:${id}`);
world.afterEvents.playerPlaceBlock.subscribe((event) => {
    let block = event.block;
    let particle_type = 0;
    let emitter_type;
    for (let id in EmitterTypes) {
        if (block.permutation.matches(`spark_vfx:${id}`)) {
            particle_type = EmitterTypes[id].particle_type;
            emitter_type = EmitterTypes[id];
        }
    }
    if (!particle_type) {
        event.dimension.runCommand(`setblock ${printCoordinates(block.location)} air`);
        return;
    }
    let emitter = new EmitterBlockInstance({
        block_location: Vector.copy(block.location),
        location: { x: block.location.x + 0.5, y: block.location.y + 0.5, z: block.location.z + 0.5 },
        particle_type,
        dimension: event.dimension,
    }).add().save();
    emitter.show();
    if (emitter_type && emitter_type.setting && !isEffectEnabled(emitter_type.setting, event.player)) {
        sendUsageWarningMessage(event.player, 'spark_vfx.message.effect_failed_disabled');
    }
}, {
    blockTypes: block_id_list
});
let key_before;
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    // Mark entry so verification in the tick loop does not catch this as invalid before the afterEvents.playerBreakBlock can run
    let key = EmitterBlockInstance.getKey(event.block.location, event.dimension);
    let emitter = emitterLocations.get(key);
    if (emitter) {
        emitter.removing = true;
    }
    // Workaround for issue where block location values are incorrect in the after event
    key_before = key;
}, {
    blockTypes: block_id_list
});
world.afterEvents.playerBreakBlock.subscribe((event) => {
    let key = key_before ?? EmitterBlockInstance.getKey(event.block.location, event.dimension);
    let emitter = emitterLocations.get(key);
    if (emitter) {
        emitter.remove();
    }
    else {
        // Shouldn't be required, but just in case
        emitterLocationBoard.removeParticipant(key);
    }
    // Transform item in case of silk touch
    let entities = event.dimension.getEntitiesAtBlockLocation(event.block.location);
    for (let entity of entities) {
        if (entity.typeId == 'minecraft:item') {
            let item_component = entity.getComponent('minecraft:item');
            let item_id = item_component.itemStack.typeId;
            if (item_id.startsWith('spark_vfx:emitter_') && !item_id.startsWith('spark_vfx:emitter_placer')) {
                let new_item_id = item_id.replace('spark_vfx:emitter_', 'spark_vfx:emitter_placer_');
                event.dimension.spawnItem(new ItemStack(new_item_id, 1), entity.location);
                entity.remove();
            }
        }
    }
}, {
    blockTypes: block_id_list
});
// Ticking
let tick = -1;
export function tickEmitterBlocks() {
    tick++;
    for (let id in EmitterTypes) {
        let type = EmitterTypes[id];
        if (type.setting && isEffectEnabled(type.setting) == false)
            continue;
        for (let [key, emitter] of emitterLocations) {
            if (emitter.particle_type != type.particle_type)
                continue;
            if ((tick + emitter.phase) % 4 == 0) {
                emitter.verify();
            }
            if ((tick + emitter.phase) % type.interval == 0) {
                if (!emitter.destroyed) {
                    let players = emitter.dimension.getPlayers({ location: emitter.location, maxDistance: type.range });
                    if (players.length) {
                        type.emit(emitter, players);
                    }
                }
            }
        }
    }
    if (tick % 3 == 0) {
        let players = world.getPlayers({
            excludeGameModes: [GameMode.Spectator, GameMode.Adventure]
        });
        players = players.filter(player => {
            let equippable_component = player.getComponent(EntityComponentTypes.Equippable);
            let hand_item = equippable_component.getEquipment(EquipmentSlot.Mainhand);
            return hand_item && hand_item.typeId.startsWith('spark_vfx:emitter_placer');
        });
        for (let [key, emitter] of emitterLocations) {
            let emitter_type = EmitterTypesByNumber[emitter.particle_type];
            let has_player_nearby = false;
            for (let player of players) {
                if (player.dimension != emitter.dimension)
                    continue;
                let distance = Vector.distance(player.location, emitter.location);
                if (distance < 24) {
                    has_player_nearby = true;
                    break;
                }
            }
            if (has_player_nearby) {
                emitter.show();
                if (emitter.visible) {
                    emitter.dimension.spawnParticle('spark_vfx:icon_' + emitter_type.id, emitter.location);
                }
            }
            else {
                emitter.hide();
            }
        }
    }
}
//# sourceMappingURL=emitter_block.js.map
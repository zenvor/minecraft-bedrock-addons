import { BlockPermutation, EquipmentSlot, system, world, GameMode, } from "@minecraft/server";
import { Vector } from "./util/vector";
import { isEffectEnabled } from "./settings";
var DynamicLightData;
(function (DynamicLightData) {
    // @config: number, distance player has to be moved between two ticks to clear old positioned light
    DynamicLightData.MIN_KILL_DISTANCE = 1.5;
    // @config: number, time in ticks to clear light behind player
    DynamicLightData.TRAIL_KILL_DELAY = 2;
    // @config: number, time in ticks, interval to check for active players in world
    DynamicLightData.ACTIVE_PLAYER_CHECK_INTERVAL = 40;
    DynamicLightData.MAX_CLEAN_ITERATIONS = 30;
    // @config: contains blocks light can replace
    DynamicLightData.REPLACE_BLOCKS = new Set([
        "minecraft:air",
        "minecraft:light_block",
        "minecraft:light_block_0",
        "minecraft:light_block_1",
        "minecraft:light_block_2",
        "minecraft:light_block_3",
        "minecraft:light_block_4",
        "minecraft:light_block_5",
        "minecraft:light_block_6",
        "minecraft:light_block_7",
        "minecraft:light_block_8",
        "minecraft:light_block_9",
        "minecraft:light_block_10",
        "minecraft:light_block_11",
        "minecraft:light_block_12",
        "minecraft:light_block_13",
        "minecraft:light_block_14",
        "minecraft:light_block_15",
    ]);
    // @config: define light types from hold items
    DynamicLightData.ITEM_TO_LIGHT_TYPE = new Map([
        ["minecraft:torch", "torch"],
        ["minecraft:lantern", "torch"],
        ["minecraft:redstone_torch", "redstone_torch"],
        ["minecraft:copper_torch", "torch"],
        ["minecraft:soul_torch", "soul_torch"],
        ["minecraft:soul_lantern", "soul_torch"],
        ["minecraft:copper_lantern", "torch"],
        ["minecraft:exposed_copper_lantern", "torch"],
        ["minecraft:oxidized_copper_lantern", "torch"],
        ["minecraft:weathered_copper_lantern", "torch"],
        ["minecraft:waxed_copper_lantern", "torch"],
        ["minecraft:waxed_exposed_copper_lantern", "torch"],
        ["minecraft:waxed_oxidized_copper_lantern", "torch"],
        ["minecraft:waxed_weathered_copper_lantern", "torch"],
    ]);
    // @config: define light types from hold items
    DynamicLightData.LIGHT_INTENSITY = new Map([
        ["torch", 15],
        ["redstone_torch", 7],
        ["soul_torch", 10],
    ]);
    // @config: main light placing config, only one instance of fallback supported by design
    DynamicLightData.LIGHT_OFFSET_DATA_LIST = [
        {
            lightLevel: new Map([
                ["torch", 15],
                ["redstone_torch", 7],
                ["soul_torch", 10],
            ]),
            x: 0,
            y: 0,
            z: 0,
            isFallback: false,
        },
        {
            lightLevel: new Map([
                ["torch", 15],
                ["redstone_torch", 7],
                ["soul_torch", 10],
            ]),
            x: 0,
            y: 1,
            z: 0,
            isFallback: false,
        },
        {
            lightLevel: new Map([
                ["torch", 15],
                ["redstone_torch", 7],
                ["soul_torch", 10],
            ]),
            x: 0,
            y: 2,
            z: 0,
            isFallback: false,
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 0,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 0, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 0,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 0, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 0,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 0, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 0,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 0, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 1,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 1, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 1,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 1, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 1,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 1, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 1,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 1, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 2,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 2, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: -1,
            y: 2,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 2, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 2,
            z: -1,
            isFallback: true,
            fallbackPos: { x: 0, y: 2, z: 0 },
        },
        {
            lightLevel: new Map([
                ["torch", 14],
                ["redstone_torch", 6],
                ["soul_torch", 9],
            ]),
            x: 1,
            y: 2,
            z: 1,
            isFallback: true,
            fallbackPos: { x: 0, y: 2, z: 0 },
        },
    ];
})(DynamicLightData || (DynamicLightData = {}));
class DynamicLight {
    lightMainPlaceList = [];
    lightFallBackMap = new Map();
    activePlayers = [];
    validItems = new Set(DynamicLightData.ITEM_TO_LIGHT_TYPE.keys());
    constructor() {
        this.init();
        system.runInterval(() => {
            this.tick();
        }, 1);
        world.afterEvents.playerSpawn.subscribe((evt) => {
            if (evt.initialSpawn) {
                this.activePlayers.push(evt.player);
                return;
            }
        });
    }
    getBlockPos(pos) {
        return {
            x: Math.round(pos.x - 0.5),
            y: Math.round(pos.y),
            z: Math.round(pos.z - 0.5),
        };
    }
    getStrongestLightItem(player) {
        let equipComponent = player.getComponent('minecraft:equippable');
        let mainHandItemID = equipComponent.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? '';
        let offHandItemID = equipComponent.getEquipment(EquipmentSlot.Offhand)?.typeId ?? '';
        if (this.validItems.has(mainHandItemID) && this.validItems.has(offHandItemID)) {
            let mainHandIntensity = DynamicLightData.LIGHT_INTENSITY.get(DynamicLightData.ITEM_TO_LIGHT_TYPE.get(mainHandItemID) ?? 'torch') ?? 0;
            let offHandIntensity = DynamicLightData.LIGHT_INTENSITY.get(DynamicLightData.ITEM_TO_LIGHT_TYPE.get(offHandItemID) ?? 'torch') ?? 0;
            return offHandIntensity > mainHandIntensity ? offHandItemID : mainHandItemID;
        }
        else if (this.validItems.has(mainHandItemID)) {
            return mainHandItemID;
        }
        else if (this.validItems.has(offHandItemID)) {
            return offHandItemID;
        }
        else {
            return null;
        }
    }
    cleanLight(player, basePos, block, lightLevel, lightType, iteration) {
        try {
            if (!block) {
                return;
            }
            if (!block.isValid) {
                return;
            }
            let itemID = this.getStrongestLightItem(player);
            if (player.matches({ excludeGameModes: [GameMode.Spectator] }) && (Vector.distance(player.location, basePos) < DynamicLightData.MIN_KILL_DISTANCE) && (itemID && DynamicLightData.ITEM_TO_LIGHT_TYPE.get(itemID) === lightType)) {
                if (iteration > DynamicLightData.MAX_CLEAN_ITERATIONS) {
                    return;
                }
                system.runTimeout(() => {
                    this.cleanLight(player, basePos, block, lightLevel, lightType, iteration++);
                }, DynamicLightData.TRAIL_KILL_DELAY);
                return;
            }
            if (!block.typeId.startsWith("minecraft:light_block")) {
                return;
            }
            if (block.permutation.getState("block_light_level") !== lightLevel) {
                return;
            }
            block.setType("minecraft:air");
        }
        catch { }
    }
    setLight(player, dim, basePos, lightType, lightData, block) {
        try {
            let lightLevel = lightData.lightLevel.get(lightType);
            block.setType("minecraft:light_block");
            let permutation = BlockPermutation.resolve("minecraft:light_block", { block_light_level: lightLevel });
            block.setPermutation(permutation);
            system.runTimeout(() => {
                this.cleanLight(player, basePos, block, lightLevel, lightType, 0);
            }, DynamicLightData.TRAIL_KILL_DELAY);
        }
        catch { }
    }
    setLightFallback(player, dim, basePos, lightType, block, dataFallbackPos) {
        this.lightFallBackMap
            .get(dataFallbackPos)
            .forEach((data) => {
            this.setLight(player, dim, basePos, lightType, data, block);
        });
    }
    setLightTrail(player, lightType) {
        if (player.matches({ gameMode: GameMode.Spectator })) {
            return;
        }
        const playerPos = player.location;
        const dim = player.dimension;
        const basePos = this.getBlockPos(playerPos);
        this.lightMainPlaceList.forEach((data) => {
            try {
                let block = dim.getBlock({
                    x: basePos.x + data.x,
                    y: basePos.y + data.y,
                    z: basePos.z + data.z,
                });
                if (!DynamicLightData.REPLACE_BLOCKS.has(block.typeId)) {
                    this.setLightFallback(player, dim, basePos, lightType, block, { x: data.x, y: data.y, z: data.z });
                    return;
                }
                this.setLight(player, dim, basePos, lightType, data, block);
                return;
            }
            catch { }
        });
    }
    initMainPlaceList() {
        DynamicLightData.LIGHT_OFFSET_DATA_LIST.forEach((data) => {
            if (data.isFallback) {
                return;
            }
            this.lightMainPlaceList.push(data);
        });
    }
    initFallBack() {
        DynamicLightData.LIGHT_OFFSET_DATA_LIST.forEach((data) => {
            if (!data.isFallback) {
                return;
            }
            let pos = data.fallbackPos;
            if (!this.lightFallBackMap.has(pos)) {
                this.lightFallBackMap.set(pos, []);
            }
            this.lightFallBackMap.get(pos).push(data);
        });
    }
    validateActivePlayers() {
        let validPlayers = [];
        this.activePlayers.forEach((p) => {
            if (!p) {
                return;
            }
            if (!p.isValid) {
                return;
            }
            validPlayers.push(p);
        });
        this.activePlayers = validPlayers;
    }
    init() {
        this.initFallBack();
        this.initMainPlaceList();
        system.runInterval(() => {
            this.validateActivePlayers();
        }, DynamicLightData.ACTIVE_PLAYER_CHECK_INTERVAL);
    }
    tick() {
        if (!isEffectEnabled('dynamic_lights')) {
            return;
        }
        this.activePlayers.forEach((p) => {
            if (!p || !p.isValid) {
                return;
            }
            let itemID = this.getStrongestLightItem(p);
            if (!itemID) {
                return;
            }
            if (!this.validItems.has(itemID)) {
                return;
            }
            this.setLightTrail(p, DynamicLightData.ITEM_TO_LIGHT_TYPE.get(itemID) ?? 'torch');
        });
    }
}
export default new DynamicLight();
//# sourceMappingURL=dynamic_light.js.map
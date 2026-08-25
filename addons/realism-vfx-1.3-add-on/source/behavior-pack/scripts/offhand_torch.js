import { BlockPermutation, EntityComponentTypes, EquipmentSlot, PlatformType, system, world } from "@minecraft/server";
import { isBlockAvailable } from "./util/util";
const SUPPORTED_ITEMS = [
    "minecraft:torch",
    "minecraft:lantern",
    "minecraft:soul_torch",
    "minecraft:soul_lantern",
    "minecraft:redstone_torch",
    "minecraft:copper_torch",
    "minecraft:copper_lantern",
    "minecraft:exposed_copper_lantern",
    "minecraft:oxidized_copper_lantern",
    "minecraft:weathered_copper_lantern",
    "minecraft:waxed_copper_lantern",
    "minecraft:waxed_exposed_copper_lantern",
    "minecraft:waxed_oxidized_copper_lantern",
    "minecraft:waxed_weathered_copper_lantern",
];
let playerLastPlaced = {};
let playerLastPlacedTime = {};
world.afterEvents.playerPlaceBlock.subscribe(e => {
    if (SUPPORTED_ITEMS.indexOf(e.block.typeId) != -1) {
        playerLastPlaced[e.player.id] = e.block.typeId;
    }
    playerLastPlacedTime[e.player.id] = true;
    system.runTimeout(() => {
        delete playerLastPlaced[e.player.id];
        delete playerLastPlacedTime[e.player.id];
    }, 1);
});
world.afterEvents.itemUse.subscribe(arg => {
    let player = arg.source;
    let itemStack = arg.itemStack;
    if (SUPPORTED_ITEMS.indexOf(itemStack.typeId) == -1)
        return;
    if (!player.isSneaking)
        return;
    if (playerLastPlaced[player.id] == itemStack.typeId)
        return;
    let equ = player.getComponent(EntityComponentTypes.Equippable);
    let offhand_equipment = equ.getEquipment(EquipmentSlot.Offhand);
    if (offhand_equipment && offhand_equipment.amount)
        return;
    player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 ${itemStack.typeId} ${itemStack.amount}`);
    equ.setEquipment(EquipmentSlot.Mainhand, undefined);
});
world.afterEvents.itemUse.subscribe(arg => {
    let player = arg.source;
    if (player.clientSystemInfo.platformType == PlatformType.Mobile)
        return;
    let equ = player.getComponent(EntityComponentTypes.Equippable);
    let offhand_equipment = equ.getEquipment(EquipmentSlot.Offhand);
    if (!offhand_equipment || !offhand_equipment.amount)
        return;
    if (SUPPORTED_ITEMS.indexOf(offhand_equipment.typeId) == -1)
        return;
    if (playerLastPlacedTime[player.id])
        return;
    let ray = player.dimension.getBlockFromRay(player.getHeadLocation(), player.getViewDirection(), { maxDistance: 7 });
    if (!ray)
        return;
    let dir = ray.face.toLowerCase();
    let facing = dir;
    if (dir == 'up') {
        dir = 'above';
        facing = 'top';
    }
    if (dir == 'down') {
        dir = 'below';
        facing = '';
    }
    switch (dir) {
        case 'north':
            facing = 'south';
            break;
        case 'south':
            facing = 'north';
            break;
        case 'east':
            facing = 'west';
            break;
        case 'west':
            facing = 'east';
            break;
    }
    // @ts-ignore
    let target_block = ray.block[dir]();
    if (!isBlockAvailable(target_block))
        return;
    let is_torch = offhand_equipment.typeId.includes('torch');
    let states = {};
    if (is_torch) {
        states.torch_facing_direction = facing;
    }
    target_block.setPermutation(BlockPermutation.resolve(offhand_equipment.typeId, states));
    let new_amount = offhand_equipment.amount - 1;
    if (new_amount) {
        player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 ${offhand_equipment.typeId} ${new_amount}`);
    }
    else {
        player.runCommand(`replaceitem entity @s slot.weapon.offhand 0 air 1`);
    }
    player.dimension.playSound(is_torch ? 'dig.wood' : 'block.lantern.place', target_block.location);
});
//# sourceMappingURL=offhand_torch.js.map
// 处理根须长弓、龙骨长弓、余烬裂响与寒霜裂响；保留上游动画控制器的蓄力与敏捷门槛。
const BOWS = new Map([
  ['hfrlc:weapon_1', { kind: 'root', agility: 15, projectile: 'hfrlc:player_bow' }],
  ['hfrlc:dragon_bone_bow', { kind: 'dragon', agility: 20, projectile: 'hfrlc:player_bow' }],
  ['hfrlc:fire_dragon_bow', { kind: 'fire', agility: 20, projectile: 'hfrlc:fire_arrow' }],
  ['hfrlc:ice_dragon_bone_bow', { kind: 'ice', agility: 20, projectile: 'hfrlc:ice_arrow' }],
]);
export const AIM_ON = 'hfrlc:longbow_aim_on;';
export const AIM_OFF = 'hfrlc:longbow_aim_off;';

function heldItem(player) {
  return player.getComponent('inventory')?.container?.getItem(player.selectedSlotIndex);
}

function enchantment(item, id, maximum) {
  return Math.min(
    maximum,
    Math.max(0, item.getComponent('enchantable')?.getEnchantment(id)?.level ?? 0),
  );
}

export function createLongbowFix({ system, random = Math.random }) {
  const aiming = new Map();
  const shots = new Map();
  const lastShot = new Map();

  function stopAiming(player) {
    if (!aiming.delete(player.id)) return;
    player.onScreenDisplay.setTitle(AIM_OFF);
  }

  function startAiming({ source: player, itemStack }) {
    if (!BOWS.has(itemStack?.typeId)) return;
    aiming.set(player.id, { player, typeId: itemStack.typeId, slot: player.selectedSlotIndex });
    player.onScreenDisplay.setTitle(AIM_ON);
  }

  function shoot({ id, message, sourceEntity: player }) {
    if (id !== 'hfrlc:longbow_shoot' || player?.typeId !== 'minecraft:player') return;
    const bowSlot = player.selectedSlotIndex;
    const item = heldItem(player);
    const bow = BOWS.get(item?.typeId);
    if (!bow || message !== bow.kind || (player.getComponent('health')?.currentValue ?? 0) <= 0)
      return;
    if ((player.getProperty('hfrlc:agility_unlock') ?? 0) < bow.agility) return;
    if (lastShot.get(player.id) === system.currentTick) return;

    const inventory = player.getComponent('inventory')?.container;
    let arrowSlot = -1;
    for (let slot = 0; slot < inventory.size; slot++) {
      const arrow = inventory.getItem(slot);
      // 与原控制器一致：使用普通箭，不把药箭当作普通箭扣除。
      if (arrow?.typeId === 'minecraft:arrow' && arrow.amount > 0) {
        arrowSlot = slot;
        break;
      }
    }
    if (arrowSlot < 0) return;

    const power = enchantment(item, 'power', 5);
    const punch = enchantment(item, 'punch', 2);
    const flame = enchantment(item, 'flame', 1);
    const freeArrow =
      player.getGameMode() === 'creative' ||
      player.hasTag('level_speed50') ||
      enchantment(item, 'infinity', 1) > 0;
    const direction = player.getViewDirection();
    const location = player.getHeadLocation();
    // 从眼睛位置发射，owner 排除射手；不把生成点推到墙的另一侧。
    const arrow = player.dimension.spawnEntity(bow.projectile, location);
    try {
      arrow.triggerEvent(`hfrlc:longbow_${bow.kind}_${power}_${flame}`);
      if (freeArrow) arrow.triggerEvent('hfrlc:longbow_no_pickup');
      const projectile = arrow.getComponent('projectile');
      if (!projectile) throw new Error('Longbow projectile component missing');
      projectile.owner = player;
      // 速度与实体朝向分别设置，供资源包箭身旋转动画读取。
      arrow.setRotation(player.getRotation());
      // 在发射之前记录，避免近距离命中遗漏冲击。力量与火矢由实体组件一次性结算。
      if (punch) shots.set(arrow.id, { punch, direction, expires: system.currentTick + 1200 });
      projectile.shoot({ x: direction.x * 5, y: direction.y * 5, z: direction.z * 5 });
    } catch (error) {
      shots.delete(arrow.id);
      arrow.remove();
      throw error;
    }
    lastShot.set(player.id, system.currentTick);
    if (!freeArrow) {
      const stack = inventory.getItem(arrowSlot);
      if (stack.amount === 1) inventory.setItem(arrowSlot, undefined);
      else {
        stack.amount -= 1;
        inventory.setItem(arrowSlot, stack);
      }
    }
    // 原包每箭扣 4 点。直接写回本次发射的槽位，避免松手事件先到而漏扣，
    // 或延迟写入主手覆盖玩家刚切换的物品；耐久附魔逐点降低损耗概率。
    if (player.getGameMode() !== 'creative') {
      const durability = item.getComponent('durability');
      if (durability) {
        const unbreaking = enchantment(item, 'unbreaking', 3);
        let damage = 0;
        for (let point = 0; point < 4; point++) {
          if (unbreaking === 0 || random() < 1 / (unbreaking + 1)) damage++;
        }
        if (durability.damage + damage >= durability.maxDurability) {
          inventory.setItem(bowSlot, undefined);
          player.playSound('random.break');
        } else if (damage > 0) {
          durability.damage += damage;
          inventory.setItem(bowSlot, item);
        }
      }
    }
    stopAiming(player);
  }

  function hitEntity(event) {
    const projectileId = event.damageSource?.damagingProjectile?.id;
    const shot = shots.get(projectileId);
    if (!shot || event.damage <= 0) return;
    shots.delete(projectileId);
    const target = event.hurtEntity;
    if (!target) return;
    const { x, z } = shot.direction;
    const horizontal = Math.hypot(x, z);
    if (horizontal > 0)
      target.applyKnockback(x / horizontal, z / horizontal, 0.6 * shot.punch, 0.1);
  }

  function tick() {
    for (const [id, state] of aiming) {
      const { player, typeId, slot } = state;
      if (!player.isValid()) {
        aiming.delete(id);
        continue;
      }
      if (
        player.selectedSlotIndex !== slot ||
        heldItem(player)?.typeId !== typeId ||
        (player.getComponent('health')?.currentValue ?? 0) <= 0
      )
        stopAiming(player);
    }
    for (const [id, shot] of shots) if (shot.expires <= system.currentTick) shots.delete(id);
    // 只用于同 tick 去重，不保留离线玩家状态。
    for (const [id, tick] of lastShot) if (tick < system.currentTick) lastShot.delete(id);
  }

  function leave({ playerId }) {
    aiming.delete(playerId);
    lastShot.delete(playerId);
  }

  return {
    startAiming,
    stopAiming,
    shoot,
    hitEntity,
    tick,
    leave,
    hitBlock: (event) => shots.delete(event.projectile.id),
  };
}

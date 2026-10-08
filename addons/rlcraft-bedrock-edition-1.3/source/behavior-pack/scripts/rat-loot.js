// 老鼠通过 hfrlc:loot 转换后消失，普通击杀不会走 entityDie 的返还逻辑。
export function handleRatLoot({ entity, eventId }) {
  if (eventId !== 'hfrlc:loot' || entity?.typeId !== 'hfrlc:rat') return;

  const container = entity.getComponent('inventory')?.container;
  const originalItem = container?.getItem(0);

  // 主手是 replaceitem 创建的展示副本，只有背包中存着完整的原始物品。
  entity.runCommand('replaceitem entity @s slot.weapon.mainhand 0 air');
  if (!originalItem) return;

  // 必须在本次事件中返还；延迟到下一 tick 时，老鼠可能已经转换消失。
  // 先生成原件，成功后才清空背包，失败时仍让原有 drop_inventory 保留掉落机会。
  entity.dimension.spawnItem(originalItem, entity.location);
  container.setItem(0, undefined);
}

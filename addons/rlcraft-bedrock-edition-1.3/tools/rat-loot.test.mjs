import assert from 'node:assert/strict';
import test from 'node:test';
import { handleRatLoot } from '../source/behavior-pack/scripts/rat-loot.js';

function fixture(item, options = {}) {
  let storedItem = item;
  let displayItem = item ? { typeId: item.typeId, amount: item.amount } : undefined;
  const calls = [];
  const dropped = [];
  const container = {
    getItem(slot) {
      assert.equal(slot, 0);
      calls.push('read-original');
      return storedItem;
    },
    setItem(slot, value) {
      assert.equal(slot, 0);
      calls.push('clear-inventory');
      storedItem = value;
    },
  };
  const entity = {
    typeId: 'hfrlc:rat',
    location: { x: 1, y: 2, z: 3 },
    getComponent(name) {
      assert.equal(name, 'inventory');
      return options.noInventory ? undefined : { container };
    },
    runCommand(command) {
      assert.equal(command, 'replaceitem entity @s slot.weapon.mainhand 0 air');
      calls.push('clear-display');
      if (options.commandError) throw options.commandError;
      displayItem = undefined;
    },
    dimension: {
      spawnItem(original, location) {
        calls.push('drop-original');
        assert.deepEqual(location, entity.location);
        assert.equal(displayItem, undefined);
        if (options.spawnError) throw options.spawnError;
        dropped.push(original);
      },
    },
  };
  return {
    entity,
    calls,
    dropped,
    get storedItem() {
      return storedItem;
    },
  };
}

test('普通击杀的 loot 事件同步返还完整原件，并清掉展示副本', () => {
  const original = {
    typeId: 'minecraft:diamond_sword',
    amount: 1,
    nameTag: '测试附魔剑',
    enchantments: [
      { id: 'sharpness', level: 5 },
      { id: 'unbreaking', level: 3 },
    ],
    durabilityDamage: 37,
    lore: ['原始描述'],
    dynamicProperties: { owner: 'test-player' },
  };
  const state = fixture(original);

  handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' });

  assert.deepEqual(state.calls, [
    'read-original',
    'clear-display',
    'drop-original',
    'clear-inventory',
  ]);
  assert.equal(state.dropped[0], original);
  assert.equal(state.storedItem, undefined);
});

test('重复 loot 事件只返还一次，保留可堆叠物品的数量', () => {
  const original = { typeId: 'minecraft:apple', amount: 32 };
  const state = fixture(original);

  handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' });
  handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' });

  assert.deepEqual(state.dropped, [original]);
  assert.equal(state.storedItem, undefined);
});

test('不处理其他实体或老鼠的其他事件', () => {
  const state = fixture({ typeId: 'minecraft:diamond_sword', amount: 1 });
  handleRatLoot({ entity: state.entity, eventId: 'hfrlc:death' });
  state.entity.typeId = 'minecraft:zombie';
  handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' });
  handleRatLoot({ entity: undefined, eventId: 'hfrlc:loot' });
  assert.deepEqual(state.calls, []);
});

test('背包为空或不可用时也清掉展示副本，不生成新物品', () => {
  for (const options of [{}, { noInventory: true }]) {
    const state = fixture(undefined, options);
    handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' });
    assert.ok(state.calls.includes('clear-display'));
    assert.deepEqual(state.dropped, []);
  }
});

test('生成掉落失败时保留背包原件', () => {
  const original = { typeId: 'minecraft:diamond_sword', amount: 1 };
  const error = new Error('spawn failed');
  const state = fixture(original, { spawnError: error });
  assert.throws(() => handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' }), error);
  assert.equal(state.storedItem, original);
  assert.deepEqual(state.dropped, []);
  assert.ok(!state.calls.includes('clear-inventory'));
});

test('清理展示副本失败时不手动生成另一份原件', () => {
  const original = { typeId: 'minecraft:diamond_sword', amount: 1 };
  const error = new Error('command failed');
  const state = fixture(original, { commandError: error });
  assert.throws(() => handleRatLoot({ entity: state.entity, eventId: 'hfrlc:loot' }), error);
  assert.equal(state.storedItem, original);
  assert.deepEqual(state.dropped, []);
});

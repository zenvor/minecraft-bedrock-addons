import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync, readdirSync } from 'node:fs';
import { AIM_ON, AIM_OFF, createLongbowFix } from '../source/behavior-pack/scripts/longbow.js';

const bows = {
  'hfrlc:weapon_1': ['root', 'hfrlc:player_bow'],
  'hfrlc:dragon_bone_bow': ['dragon', 'hfrlc:player_bow'],
  'hfrlc:fire_dragon_bow': ['fire', 'hfrlc:fire_arrow'],
  'hfrlc:ice_dragon_bone_bow': ['ice', 'hfrlc:ice_arrow'],
};
const read = (file) =>
  JSON.parse(readFileSync(new URL(`../source/${file}`, import.meta.url), 'utf8'));
function fixture({
  typeId = 'hfrlc:weapon_1',
  levels = {},
  arrows = 3,
  agility = 20,
  creative = false,
  skill = false,
  failShoot = false,
  rotation = { x: 0, y: 0 },
} = {}) {
  const system = { currentTick: 100 };
  const calls = {
    events: [],
    shots: [],
    titles: [],
    tags: [],
    removed: 0,
    knockback: [],
    properties: {},
  };
  const durability = { damage: 0, maxDurability: 1000 };
  const item = {
    typeId,
    getComponent: (id) =>
      id === 'enchantable'
        ? {
            getEnchantment: (id) => (levels[id] ? { level: levels[id] } : undefined),
          }
        : id === 'durability'
          ? durability
          : undefined,
  };
  const slots = [item, arrows ? { typeId: 'minecraft:arrow', amount: arrows } : undefined];
  const inventory = {
    size: 36,
    getItem: (slot) => slots[slot],
    setItem: (slot, item) => (slots[slot] = item),
  };
  const projectile = {
    shoot(velocity) {
      if (failShoot) throw new Error('shoot failed');
      calls.shots.push(velocity);
    },
  };
  const arrow = {
    id: 'arrow-1',
    setRotation: (value) => {
      calls.rotation = value;
    },
    setProperty: (key, value) => {
      calls.properties[key] = value;
    },
    triggerEvent: (event) => calls.events.push(event),
    getComponent: () => projectile,
    remove: () => calls.removed++,
  };
  const player = {
    id: 'player-1',
    typeId: 'minecraft:player',
    selectedSlotIndex: 0,
    getComponent: (id) => (id === 'inventory' ? { container: inventory } : { currentValue: 20 }),
    getProperty: () => agility,
    getGameMode: () => (creative ? 'creative' : 'survival'),
    hasTag: (tag) => tag === 'level_speed50' && skill,
    addTag: (tag) => calls.tags.push(tag),
    isValid: () => true,
    getRotation: () => rotation,
    getViewDirection: () => {
      const pitch = (rotation.x * Math.PI) / 180,
        yaw = (rotation.y * Math.PI) / 180;
      return {
        x: -Math.sin(yaw) * Math.cos(pitch) || 0,
        y: -Math.sin(pitch) || 0,
        z: Math.cos(yaw) * Math.cos(pitch),
      };
    },
    getHeadLocation: () => ({ x: 0, y: 1.6, z: 0 }),
    dimension: {
      spawnEntity(id, location) {
        assert.equal(id, bows[typeId][1]);
        assert.equal(location.z, 0);
        return arrow;
      },
    },
    playSound: () => {},
    onScreenDisplay: { setTitle: (text) => calls.titles.push(text) },
  };
  const fix = createLongbowFix({ system, random: () => 0.99 });
  const shoot = () =>
    fix.shoot({
      id: 'hfrlc:longbow_shoot',
      message: bows[typeId]?.[0],
      sourceEntity: player,
    });
  const hit = {
    projectile: arrow,
    damage: 15,
    damageSource: { damagingProjectile: arrow },
    hurtEntity: { applyKnockback: (...args) => calls.knockback.push(args) },
  };
  return { fix, system, item, slots, player, arrow, projectile, calls, shoot, hit, durability };
}

for (const typeId of Object.keys(bows)) {
  test(`${typeId} 发射一次、扣一支箭、同步扣耐久并保留射手归属`, () => {
    const f = fixture({ typeId });
    f.shoot();
    f.shoot();
    assert.equal(f.calls.shots.length, 1);
    assert.equal(f.slots[1].amount, 2);
    assert.deepEqual(f.calls.tags, []);
    assert.equal(f.durability.damage, 4);
    assert.equal(f.projectile.owner, f.player);
    assert.deepEqual(f.calls.shots[0], { x: 0, y: 0, z: 5 });
  });
}
test('力量、火矢在发射前选择，冲击按发射时附魔且只触发一次', () => {
  const f = fixture({ levels: { power: 5, flame: 1, punch: 2 } });
  f.shoot();
  f.slots[0] = { typeId: 'minecraft:stone' };
  f.fix.hitEntity(f.hit);
  f.fix.hitEntity(f.hit);
  assert.equal(f.calls.events[0], 'hfrlc:longbow_root_5_1');
  assert.deepEqual(f.calls.knockback, [[0, 1, 1.2, 0.1]]);
});
for (const opts of [{ levels: { infinity: 1 } }, { skill: true }, { creative: true }]) {
  test(`免耗箭必须禁止回收，避免复制箭：${JSON.stringify(opts)}`, () => {
    const f = fixture(opts);
    f.shoot();
    assert.equal(f.slots[1].amount, 3);
    assert.ok(f.calls.events.includes('hfrlc:longbow_no_pickup'));
    assert.equal(f.durability.damage, opts.creative ? 0 : 4);
  });
}
test('最后一支箭清空槽位', () => {
  const f = fixture({ arrows: 1 });
  f.shoot();
  assert.equal(f.slots[1], undefined);
});
for (const opts of [
  { arrows: 0 },
  { agility: 14 },
  { typeId: 'hfrlc:dragon_bone_bow', agility: 19 },
  { typeId: 'hfrlc:fire_dragon_bow', agility: 19 },
  { typeId: 'hfrlc:ice_dragon_bone_bow', agility: 19 },
  { typeId: 'minecraft:bow' },
]) {
  test(`不满足发射条件不生成箭、不扣耐久：${JSON.stringify(opts)}`, () => {
    const f = fixture(opts);
    f.shoot();
    assert.equal(f.calls.shots.length, 0);
    assert.equal(f.calls.tags.length, 0);
  });
}
test('发射失败清理实体，保留背包箭和耐久', () => {
  const f = fixture({ failShoot: true, levels: { punch: 2 } });
  assert.throws(f.shoot, /shoot failed/);
  assert.equal(f.durability.damage, 0);
  assert.equal(f.calls.removed, 1);
  assert.equal(f.slots[1].amount, 3);
  assert.equal(f.calls.tags.length, 0);
  f.fix.hitEntity(f.hit);
  assert.equal(f.calls.knockback.length, 0);
});
test('撞墙和过期清掉冲击状态，不影响其他箭', () => {
  const f = fixture({ levels: { punch: 2 } });
  f.shoot();
  f.fix.hitBlock(f.hit);
  f.fix.hitEntity(f.hit);
  f.system.currentTick++;
  f.shoot();
  f.system.currentTick += 1200;
  f.fix.tick();
  f.fix.hitEntity(f.hit);
  f.fix.hitEntity({ projectile: { id: 'vanilla-arrow' } });
  assert.equal(f.calls.knockback.length, 0);
});
test('准星在取消使用或切槽后隐藏，普通物品不显示', () => {
  const f = fixture();
  f.fix.startAiming({ source: f.player, itemStack: { typeId: 'minecraft:apple' } });
  assert.deepEqual(f.calls.titles, []);
  f.fix.startAiming({ source: f.player, itemStack: f.item });
  f.fix.stopAiming(f.player);
  f.fix.stopAiming(f.player);
  assert.deepEqual(f.calls.titles, [AIM_ON, AIM_OFF]);
  f.fix.startAiming({ source: f.player, itemStack: f.item });
  f.player.selectedSlotIndex = 1;
  f.fix.tick();
  assert.equal(f.calls.titles.at(-1), AIM_OFF);
});
test('完整的力量/火矢组合保留基础伤害，火矢只在附魔时开启', () => {
  const entity = read('behavior-pack/entities/5uo8q03goczx1lpn.json')['minecraft:entity'];
  for (const [kind, base] of [
    ['root', 15],
    ['dragon', 20],
  ])
    for (let power = 0; power <= 5; power++)
      for (let flame = 0; flame <= 1; flame++) {
        const name = `hfrlc:longbow_${kind}_${power}_${flame}`;
        const projectile = entity.component_groups[name]['minecraft:projectile'];
        assert.equal(
          projectile.on_hit.impact_damage.damage,
          power ? Math.ceil(base * (1 + 0.25 * (power + 1))) : base,
        );
        assert.equal(projectile.on_hit.impact_damage.catch_fire, flame ? true : undefined);
        if (kind === 'dragon')
          assert.deepEqual(entity.component_groups[name]['minecraft:is_stunned'], {});
        assert.deepEqual(entity.events[name].add.component_groups, [name]);
      }
});
test('控制器仅替换四种弓的发射出口，保留蓄力与等级检查；附魔类别为 bow', () => {
  const states = read('behavior-pack/animation_controllers/adwi07rcexosgj9p.json')
    .animation_controllers['controller.animation.weapons'].states;
  for (const [state, kind] of [
    ['weapon_1', 'root'],
    ['dragon_bow', 'dragon'],
    ['fire_bow', 'fire'],
    ['ice_bow', 'ice'],
  ]) {
    assert.deepEqual(states[`${state}_project`].on_entry, [
      `/scriptevent hfrlc:longbow_shoot ${kind}`,
    ]);
    assert.ok(
      states[`${state}_hold`].transitions.some((t) => t[`${state}_ready`] === 'q.variant == 1'),
    );
    assert.ok(states.default.transitions.some((t) => t[state]?.includes('agility_unlock')));
  }
  for (const filename of [
    '7849be1taoer5ox6',
    'w5tkcsu341gbvmht',
    'oz31tx5vcgbjzgdu',
    'wqdcltottie18bie',
  ]) {
    assert.equal(
      read(`behavior-pack/items/${filename}.json`)['minecraft:item'].components[
        'minecraft:enchantable'
      ].slot,
      'bow',
    );
  }
});
test('准星复用 HUD 独立状态缓存，只在触屏显示；标题不泄露控制标记', () => {
  const hud = read('resource-pack/ui/hud_screen.json');
  const controls = hud.hud_content.modifications[0].value;
  assert.equal(controls.find((c) => c.longbow_touch_aim).longbow_touch_aim.visible, '$touch');
  const filter =
    hud['hud_title_text/title_frame/title'].modifications[0].value.source_property_name;
  assert.ok(filter.includes(AIM_ON));
  assert.ok(filter.includes(AIM_OFF));
  const cache = controls.find((c) => c.longbow_aim_data).longbow_aim_data;
  assert.ok(cache.bindings.at(-1).source_property_name.includes('no_ui;'));
});

test('盾牌格挡或零伤害命中不触发冲击', () => {
  const f = fixture({ levels: { punch: 2 } });
  f.shoot();
  f.fix.hitEntity({ ...f.hit, damage: 0 });
  assert.deepEqual(f.calls.knockback, []);
});

test('耐久附魔降低损耗，不重建物品；损坏时只清掉弓槽位', () => {
  const saved = fixture({ levels: { unbreaking: 3 } });
  saved.shoot();
  assert.equal(saved.durability.damage, 0);
  assert.equal(saved.slots[0], saved.item);
  const broken = fixture();
  broken.durability.damage = 998;
  broken.shoot();
  assert.equal(broken.slots[0], undefined);
  assert.equal(broken.slots[1].amount, 2);
});

for (const typeId of Object.keys(bows)) {
  test(`${typeId} 朝向与发射方向同步，覆盖四向与俯仰；触屏准星可开关`, () => {
    for (const rotation of [
      { x: 0, y: 0 },
      { x: 0, y: 90 },
      { x: 0, y: 180 },
      { x: 0, y: -90 },
      { x: -45, y: 35 },
      { x: 45, y: -70 },
      { x: -90, y: 90 },
    ]) {
      const f = fixture({ typeId, rotation });
      f.fix.startAiming({ source: f.player, itemStack: f.item });
      f.shoot();
      assert.deepEqual(f.calls.rotation, rotation);
      const direction = f.player.getViewDirection();
      assert.deepEqual(f.calls.shots[0], {
        x: direction.x * 5,
        y: direction.y * 5,
        z: direction.z * 5,
      });
      assert.deepEqual(f.calls.titles, [AIM_ON, AIM_OFF]);
    }
  });
}
for (const [kind, filename] of [
  ['fire', 'cc0s4371bf2sl4mq'],
  ['ice', '85m06soyh877t6ae'],
]) {
  test(`${kind} 箭的附魔组合保留原生元素效果与免耗箭回收限制`, () => {
    const entity = read(`behavior-pack/entities/${filename}.json`)['minecraft:entity'];
    const base = entity.components['minecraft:projectile'];
    for (let power = 0; power <= 5; power++)
      for (let flame = 0; flame <= 1; flame++) {
        const name = `hfrlc:longbow_${kind}_${power}_${flame}`;
        const actual = entity.component_groups[name]['minecraft:projectile'];
        const expected = structuredClone(base);
        expected.on_hit.impact_damage.damage = power
          ? Math.ceil(20 * (1 + 0.25 * (power + 1)))
          : 20;
        if (flame) {
          expected.on_hit.impact_damage.catch_fire = true;
          expected.on_fire_time = 5;
        }
        assert.deepEqual(actual, expected);
        assert.deepEqual(entity.events[name].add.component_groups, [name]);
      }
    if (kind === 'fire') assert.equal(base.catch_fire, true);
    if (kind === 'ice') assert.equal(base.on_hit.mob_effect.effect, 'wither');
    assert.equal(entity.description.properties['hfrlc:longbow_no_pickup'].default, false);
    assert.equal(
      entity.events['hfrlc:longbow_no_pickup'].set_property['hfrlc:longbow_no_pickup'],
      true,
    );
    assert.deepEqual(entity.events['hfrlc:pickup_item'].sequence[0].add.component_groups, [
      'despawn',
    ]);
  });
}

const flightClients = ['tsq8uer94a9e54it', '135y9qknycyurflw', 'xrzewuhb7tmqxd0q'];
test('新版实体格式的三类箭通过 subsensors 感应玩家回收，免费箭仍直接消失', () => {
  for (const filename of ['5uo8q03goczx1lpn', '85m06soyh877t6ae', 'cc0s4371bf2sl4mq']) {
    const entity = read(`behavior-pack/entities/${filename}.json`)['minecraft:entity'];
    const sensor = entity.component_groups.pickup_item['minecraft:entity_sensor'];
    // 真实 BDS 曾拒绝旧版顶层 event/event_filters/sensor_range；不能只检查 JSON 可解析。
    assert.deepEqual(Object.keys(sensor), ['subsensors']);
    assert.equal(sensor.subsensors.length, 1);
    const sub = sensor.subsensors[0];
    assert.deepEqual(sub.range, [1.5, 1.5]);
    assert.deepEqual(sub.event_filters, { subject: 'other', test: 'is_family', value: 'player' });
    assert.equal(sub.event, 'hfrlc:spawn_item');
    assert.ok(entity.events[sub.event]);
    const [free, paid] = entity.events['hfrlc:pickup_item'].sequence;
    assert.equal(free.filters.value, true);
    assert.deepEqual(free.add.component_groups, ['despawn']);
    assert.equal(paid.filters.value, false);
    assert.deepEqual(paid.add.component_groups, ['pickup_item']);
  }
});
// 执行包内实际表达式的 JS 兼容子集；atan2 必须按 Molang 返回角度。
// 这些数学检查不模拟 Bedrock 渲染器，最终视觉效果仍需实机验收。
// Compose the authored geometry hierarchy rather than assuming a yaw/pitch formula.
// Bedrock model X/Y angles are negated when converted to right-handed coordinates
// (Blockbench bedrock codec). Arrow/Snowball's renderer adds the fixed root Y=180.
function rotateAxis([x, y, z], axis, angle) {
  const c = Math.cos(angle),
    s = Math.sin(angle);
  if (axis === 'X') return [x, c * y - s * z, s * y + c * z];
  if (axis === 'Y') return [c * x + s * z, y, -s * x + c * z];
  return [c * x - s * y, s * x + c * y, z];
}
function flightAnimation(filename, targetPitch = 0, targetYaw = 0, order = 'XYZ') {
  const desc = read(`resource-pack/entity/${filename}.json`)['minecraft:client_entity'].description;
  const animation = read('resource-pack/animations/longbow_flight.json').animations[
    desc.animations.move
  ];
  const models = readdirSync(new URL('../source/resource-pack/models/entity/', import.meta.url))
    .filter((name) => name.endsWith('.json'))
    .flatMap((name) => read(`resource-pack/models/entity/${name}`)['minecraft:geometry'] ?? []);
  const geometry = models.find((g) => g.description.identifier === desc.geometry.default);
  assert.ok(geometry, `Geometry ${desc.geometry.default} must resolve`);
  let motion = [0, 0, 0],
    bodyYaw = targetYaw;
  const context = vm.createContext({
    variable: {},
    query: {
      position_delta: (axis) => motion[axis],
      get target_x_rotation() {
        return targetPitch;
      },
      get target_y_rotation() {
        return targetYaw;
      },
      get body_x_rotation() {
        return targetPitch;
      },
      get body_y_rotation() {
        return bodyYaw;
      },
    },
    math: { sqrt: Math.sqrt, atan2: (y, x) => (Math.atan2(y, x) * 180) / Math.PI },
  });
  vm.runInContext(desc.scripts.initialize.join('\n'), context);
  return (delta, body = targetYaw) => {
    motion = delta;
    bodyYaw = body;
    vm.runInContext(desc.scripts.pre_animation.join('\n'), context);
    let direction = [0, 0, -1],
      bone = geometry.bones.find((b) => b.name === 'body');
    const rotations = [0, 0, 0],
      visited = new Set();
    while (bone) {
      assert.ok(!visited.has(bone.name), 'Geometry must not contain a parent cycle');
      visited.add(bone.name);
      const channels = animation.bones[bone.name] ?? {};
      const rotation = (channels.rotation ?? [0, 0, 0]).map((value) =>
        vm.runInContext(String(value), context),
      );
      const scale = channels.scale ?? [1, 1, 1];
      direction = direction.map((value, axis) => value * scale[axis]);
      for (let axis = 0; axis < 3; axis++) rotations[axis] += rotation[axis];
      const angles = rotation.map((value, axis) => (value * (axis === 2 ? 1 : -1) * Math.PI) / 180);
      // Test both combined-axis conventions. A single-axis bone is independent
      // of that convention; hierarchy explicitly fixes pitch before yaw.
      for (const axis of [...order].reverse())
        direction = rotateAxis(direction, axis, angles['XYZ'.indexOf(axis)]);
      if (!bone.parent) break;
      const parent = geometry.bones.find((b) => b.name === bone.parent);
      assert.ok(parent, `Missing parent ${bone.parent}`);
      bone = parent;
    }
    direction = rotateAxis(direction, 'Y', Math.PI);
    const length = Math.hypot(...direction);
    return { rotation: rotations, direction: direction.map((value) => value / length) };
  };
}
function closeVector(actual, expected) {
  const length = Math.hypot(...expected);
  for (let axis = 0; axis < 3; axis++)
    assert.ok(
      Math.abs(actual[axis] - expected[axis] / length) < 1e-10,
      `${actual} not aligned with ${expected}`,
    );
}
for (const filename of flightClients) {
  for (const order of ['XYZ', 'ZYX']) {
    test(`${filename} actual geometry ${order}: all headings and elevations align with flight`, () => {
      const frame = flightAnimation(filename, 0, 0, order);
      for (let yaw = -180; yaw < 180; yaw += 15)
        for (const elevation of [-90, -80, -60, -45, -15, -5, 0, 5, 15, 30, 45, 60, 80, 90]) {
          const y = (yaw * Math.PI) / 180,
            e = (elevation * Math.PI) / 180;
          const delta = [-Math.sin(y) * Math.cos(e), Math.sin(e), Math.cos(y) * Math.cos(e)];
          closeVector(frame(delta, yaw).direction, delta);
        }
      for (const delta of [
        [1, 3, 2],
        [1, -3, 2],
        [0, 5, 0],
        [0, -5, 0],
      ])
        closeVector(frame(delta, 123).direction, delta);
    });
  }
  test(`${filename} 首帧与原版箭的目标角度表达式一致，停止运动后不随实体偏航转动`, () => {
    const frame = flightAnimation(filename, 45, -60);
    // Mojang 原版 arrow.animation.json：[-q.target_x_rotation, -q.target_y_rotation, 0]。
    assert.deepEqual(frame([0, 0, 0], 123).rotation, [-45, 60, 0]);
    const inFlight = frame([2, -1, 3], 25);
    for (const body of [25, 140, -180]) {
      const stopped = frame([0, 0, 0], body);
      closeVector(stopped.direction, inFlight.direction);
    }
  });
}
test('四种弓使用独立飞行动画，不依赖自定义角度属性且不改三叉戟/蛛网动画', () => {
  for (const filename of ['5uo8q03goczx1lpn', '85m06soyh877t6ae', 'cc0s4371bf2sl4mq']) {
    const props = read(`behavior-pack/entities/${filename}.json`)['minecraft:entity'].description
      .properties;
    assert.equal(props['hfrlc:longbow_pitch'], undefined);
    assert.equal(props['hfrlc:longbow_yaw'], undefined);
  }
  for (const filename of flightClients) {
    const desc = read(`resource-pack/entity/${filename}.json`)['minecraft:client_entity']
      .description;
    assert.equal(desc.animations.move, 'animation.hfrlc.longbow.flight');
    assert.ok(!JSON.stringify(desc.scripts).includes('body_y_rotation'));
    assert.ok(!JSON.stringify(desc.scripts).includes('query.property'));
  }
  for (const filename of ['1ij6paim5f7unz02', 'g1n2g0zcut0zbhvw'])
    assert.equal(
      read(`resource-pack/entity/${filename}.json`)['minecraft:client_entity'].description
        .animations.move,
      'animation.player_arrow.move',
    );
});
for (const typeId of Object.keys(bows)) {
  test(`${typeId} 即使引擎拒绝自定义属性，也不阻断发射或删除箭`, () => {
    const f = fixture({ typeId, levels: { power: 5, flame: 1, punch: 2 } });
    let attempts = 0;
    f.arrow.setProperty = () => {
      attempts++;
      throw new Error('Entity property unavailable');
    };
    assert.doesNotThrow(f.shoot);
    assert.equal(attempts, 0);
    assert.equal(f.calls.shots.length, 1);
    assert.equal(f.calls.removed, 0);
    assert.equal(f.slots[1].amount, 2);
    assert.equal(f.durability.damage, 4);
    assert.equal(f.calls.events[0], `hfrlc:longbow_${bows[typeId][0]}_5_1`);
    f.fix.hitEntity(f.hit);
    assert.deepEqual(f.calls.knockback, [[0, 1, 1.2, 0.1]]);
  });
}
test('独立长弓模型仅新增偏航父骨骼，保留箭身、粒子定位点与原共享模型', () => {
  const models = read('resource-pack/models/entity/longbow_flight.geo.json')['minecraft:geometry'];
  for (const [index, original] of ['8y34h319aq7sp0pl', 'hldqj84jiqhd7pfc'].entries()) {
    const expected = read(`resource-pack/models/entity/${original}.json`)['minecraft:geometry'][0];
    const actual = structuredClone(models[index]);
    const root = actual.bones.shift();
    assert.equal(root.name, 'longbow_yaw');
    assert.deepEqual(root.pivot, actual.bones[0].pivot);
    assert.equal(actual.bones[0].parent, root.name);
    delete actual.bones[0].parent;
    actual.description.identifier = expected.description.identifier;
    assert.deepEqual(actual, expected);
  }
});

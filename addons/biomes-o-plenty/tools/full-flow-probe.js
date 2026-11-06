import {
  system as fullSystem,
  world as fullWorld,
  BlockPermutation as fullPermutation,
  ItemStack as fullItemStack,
  GameMode as fullGameMode,
} from '@minecraft/server';

var fullProbeInteraction;
var fullProbeCase;
var fullProbePhase = 'startup';
var fullProbeCases = [];
const fullEmit = (event) => console.warn('[BOPBENCH] ' + JSON.stringify(event));
const fullWait = (ticks = 1) => fullSystem.waitTicks(ticks);
const fullKey = (p) => `${p.x},${p.y},${p.z}`;
const fullAssert = (ok, message) => {
  if (!ok) throw new Error(message);
};
function fullProbeCaptureInteraction(callback) {
  fullProbeInteraction = callback;
  return callback;
}
function fullProbeCaptureStructure(id) {
  if (fullProbeCase) fullProbeCase.selected.push(id);
  return id;
}
function fullProbeCaptureFeature(result) {
  if (fullProbeCase) fullProbeCase.featureResults.push(result);
  return result;
}
function fullRandom(value, callback) {
  if (value === undefined) return callback();
  const original = Math.random;
  Math.random = () => value;
  try {
    return callback();
  } finally {
    Math.random = original;
  }
}
const fullOriginalSpace = PHwtS_;
PHwtS_ = function (block, size, options) {
  const at = Date.now();
  try {
    const result = fullOriginalSpace(block, size, options);
    if (fullProbeCase)
      fullProbeCase.space.push({
        anchor: block.location,
        size,
        options,
        result,
        elapsedMs: Date.now() - at,
      });
    return result;
  } catch (error) {
    if (fullProbeCase) fullProbeCase.space.push({ error: error.name, elapsedMs: Date.now() - at });
    throw error;
  }
};
const fullOriginalGrow = aXREUr;
aXREUr = function (...args) {
  const at = Date.now();
  try {
    return fullRandom(fullProbeCase?.growthRandom, () => fullOriginalGrow(...args));
  } catch (error) {
    if (fullProbeCase) fullProbeCase.errors.push({ name: error.name, message: error.message });
    throw error;
  } finally {
    if (fullProbeCase) fullProbeCase.growMs.push(Date.now() - at);
  }
};
const fullOriginalTick = dVRig7.onTick;
dVRig7.onTick = function (event) {
  if (
    !fullProbeCase?.allowNative ||
    !fullProbeCase.roots.some((root) => fullKey(root) === fullKey(event.block.location))
  )
    return;
  fullProbeCase.nativeEvents++;
  if (fullSystem.currentTick % M3tAkes !== 0) return fullOriginalTick(event);
  fullProbeCase.nativeGates.push({
    tick: fullSystem.currentTick,
    random: fullProbeCase.naturalRandom,
  });
  fullEmit({
    event: 'natural-gate',
    name: fullProbeCase.name,
    ...fullProbeCase.nativeGates[fullProbeCase.nativeGates.length - 1],
  });
  try {
    return fullRandom(fullProbeCase.naturalRandom, () => fullOriginalTick(event));
  } catch (error) {
    fullProbeCase.nativeError = { name: error.name, message: error.message };
  }
};
let fullLastTick = Date.now();
fullSystem.runInterval(() => {
  const now = Date.now();
  fullEmit({
    event: 'tick',
    tick: fullSystem.currentTick,
    at: now,
    gapMs: now - fullLastTick,
    stage: fullProbePhase,
  });
  fullLastTick = now;
}, 1);

function fullNewCase(name, type, square = false, root = { x: 16, y: 64, z: 16 }) {
  fullProbePhase = name;
  fullProbeCase = {
    name,
    type,
    square,
    roots: square
      ? [
          root,
          { ...root, x: root.x + 1 },
          { ...root, z: root.z + 1 },
          { ...root, x: root.x + 1, z: root.z + 1 },
        ]
      : [root],
    selected: [],
    featureResults: [],
    space: [],
    growMs: [],
    errors: [],
    nativeEvents: 0,
    nativeGates: [],
    growthRandom: 0,
    allowNative: false,
  };
  return fullProbeCase;
}
async function fullPrepare(dimension, state) {
  dimension.runCommand('fill 0 64 0 31 87 31 air');
  dimension.runCommand('fill 0 88 0 31 111 31 air');
  dimension.runCommand('fill 0 63 0 31 63 31 grass_block');
  for (const root of state.roots)
    dimension.getBlock(root).setPermutation(fullPermutation.resolve(state.type));
  await fullWait(3);
  fullAssert(
    state.roots.every((root) => dimension.getBlock(root)?.typeId === state.type),
    state.name + ': saplings did not remain planted',
  );
}
function fullForce(state, id) {
  const original = pujb8Z[state.type];
  fullAssert(original, 'growth configuration missing');
  const target = original.find(
    (group) => (group.size === '2x2') === state.square && group.type === 'structure',
  );
  fullAssert(target, 'structure configuration missing');
  const selected = target.structures.find((entry) => entry[0] === id);
  fullAssert(
    selected || id === 'bop_probe:missing_tree',
    'requested structure is not in actual growth configuration',
  );
  pujb8Z[state.type] = original.map((group) =>
    group === target ? { ...group, structures: [selected ?? [id, 1]] } : group,
  );
  return () => {
    pujb8Z[state.type] = original;
  };
}
function fullOrigin(anchor, size, offset) {
  return {
    x: Math.ceil(anchor.x - size.x / 2) + (offset?.x ?? 0),
    y: anchor.y + (offset?.y ?? 0),
    z: Math.ceil(anchor.z - size.z / 2) + (offset?.z ?? 0),
  };
}
async function fullVerifyStructure(dimension, state, index = 0) {
  const id = state.selected[index];
  const check = state.space[index];
  fullAssert(id && check?.result === true, state.name + ': no successful space check');
  const structure = fullWorld.structureManager.get(id);
  const origin = fullOrigin(check.anchor, structure.size, check.options.offset);
  let checked = 0,
    nonAir = 0,
    logs = 0,
    leaves = 0,
    mismatches = 0;
  const examples = [];
  for (let x = 0; x < structure.size.x; x++)
    for (let y = 0; y < structure.size.y; y++)
      for (let z = 0; z < structure.size.z; z++) {
        const expected = structure.getBlockPermutation({ x, y, z });
        if (expected && expected.type.id !== 'minecraft:structure_void') {
          const position = { x: origin.x + x, y: origin.y + y, z: origin.z + z };
          const actual = dimension.getBlock(position);
          checked++;
          if (expected.type.id !== 'minecraft:air') nonAir++;
          if (
            expected.type.id.endsWith('_log') ||
            expected.type.id.endsWith('_wood') ||
            expected.type.id.endsWith('_knot')
          )
            logs++;
          if (expected.type.id.endsWith('_leaves')) leaves++;
          if (actual?.typeId !== expected.type.id) {
            mismatches++;
            if (examples.length < 8)
              examples.push({ position, expected: expected.type.id, actual: actual?.typeId });
          }
        }
        if ((x * structure.size.y * structure.size.z + y * structure.size.z + z) % 128 === 127)
          await fullWait();
      }
  const verification = {
    id,
    origin,
    size: structure.size,
    checked,
    nonAir,
    logs,
    leaves,
    mismatches,
    examples,
  };
  state.verifications ??= [];
  state.verifications.push(verification);
  fullEmit({ event: 'structure-verification', name: state.name, ...verification });
  fullAssert(nonAir > 10 && logs > 2 && leaves > 5, state.name + ': expected tree contents absent');
  fullAssert(
    mismatches === 0,
    state.name + ': placed blocks differ from actual structure template',
  );
  fullAssert(
    state.roots.every((root) => dimension.getBlock(root)?.typeId !== state.type),
    state.name + ': sapling was not consumed',
  );
}
function fullPass(state) {
  state.passed = true;
  fullProbeCases.push(state);
  fullEmit({ event: 'case', ...state });
}
async function fullStructureCase(dimension, name, type, square, id, obstacleKind, root) {
  const state = fullNewCase(name, type, square, root);
  const restore = fullForce(state, id);
  try {
    await fullPrepare(dimension, state);
    const size =
      id === 'bop_probe:missing_tree' ? undefined : fullWorld.structureManager.get(id)?.size;
    if (obstacleKind && obstacleKind !== 'partial') {
      const anchor = square
        ? { ...state.roots[0], x: state.roots[0].x + 1, z: state.roots[0].z + 1 }
        : state.roots[0];
      const entry = pujb8Z[type].find((group) => (group.size === '2x2') === square).structures[0];
      const origin = fullOrigin(anchor, size, entry[2]);
      const firstY = square ? 6 : 3;
      const p =
        obstacleKind === 'last'
          ? { x: origin.x + size.x - 1, y: origin.y + size.y - 1, z: origin.z + size.z - 1 }
          : obstacleKind === 'middle'
            ? {
                x: origin.x + Math.floor(size.x / 2),
                y: origin.y + firstY + 2,
                z: origin.z + Math.floor(size.z / 2),
              }
            : {
                x: origin.x,
                y: origin.y + (obstacleKind === 'ignored' ? firstY - 1 : firstY),
                z: origin.z,
              };
      dimension.getBlock(p).setPermutation(fullPermutation.resolve('minecraft:stone'));
      state.obstacle = { kind: obstacleKind, position: p };
    }
    if (obstacleKind === 'partial')
      fullAssert(
        !dimension.getBlock({ x: 32, y: 70, z: 8 }),
        'partial case requires confirmed unloaded chunk',
      );
    aXREUr(dimension.getBlock(state.roots[0]), dimension);
    await fullWait(4);
    const reject = obstacleKind && obstacleKind !== 'ignored';
    if (reject || id === 'bop_probe:missing_tree') {
      fullAssert(
        state.roots.every((p) => dimension.getBlock(p)?.typeId === type),
        name + ': failed growth removed sapling',
      );
      if (reject)
        fullAssert(
          state.space.length === 1 && state.space[0].result === false,
          name + ': obstruction was not rejected',
        );
      if (state.obstacle)
        fullAssert(
          dimension.getBlock(state.obstacle.position).typeId === 'minecraft:stone',
          name + ': obstacle changed on rejection',
        );
    } else await fullVerifyStructure(dimension, state);
    fullPass(state);
  } finally {
    restore();
  }
}
async function fullNatural(dimension) {
  const state = fullNewCase('native-tick-probability-deny-then-grow', '4ks_bop:fir_sapling');
  await fullPrepare(dimension, state);
  fullAssert(M3tAkes === 1200 && YgHwAF === 50, 'natural interval/probability changed');
  state.allowNative = true;
  state.naturalRandom = 0.99;
  const waitUntil = async (predicate) => {
    for (let i = 0; i < 270; i++) {
      if (state.nativeError) throw new Error(JSON.stringify(state.nativeError));
      if (predicate()) return;
      await fullWait(5);
    }
    throw new Error('native natural tick did not arrive within 1350 ticks');
  };
  await waitUntil(() => state.nativeGates.length >= 1);
  fullAssert(
    state.growMs.length === 0 && dimension.getBlock(state.roots[0]).typeId === state.type,
    'probability rejection did not preserve sapling',
  );
  state.denyVerified = true;
  state.naturalRandom = 0;
  await waitUntil(() => state.nativeGates.length >= 2 && state.growMs.length > 0);
  state.allowNative = false;
  await fullWait(5);
  fullAssert(
    state.nativeGates[1].tick - state.nativeGates[0].tick === 1200,
    'natural gate cadence differs',
  );
  await fullVerifyStructure(dimension, state);
  fullPass(state);
}
async function fullBone(
  dimension,
  name,
  { count = 3, creative = false, blocked = false, repeat = 1, wrongItem = false } = {},
) {
  const state = fullNewCase(name, '4ks_bop:fir_sapling');
  const restore = fullForce(state, 'bop_ks:cf/fir_small_2');
  try {
    await fullPrepare(dimension, state);
    const chest = dimension.getBlock({ x: 31, y: 62, z: 31 });
    chest.setPermutation(fullPermutation.resolve('minecraft:chest'));
    const container = chest.getComponent('minecraft:inventory').container;
    container.setItem(
      0,
      new fullItemStack(wrongItem ? 'minecraft:stone' : 'minecraft:bone_meal', count),
    );
    const equipment = {
      getEquipment: () => container.getItem(0),
      setEquipment: (slot, item) => {
        container.setItem(0, item);
        return true;
      },
    };
    const player = {
      dimension,
      getComponent: (id) => {
        fullAssert(id === 'minecraft:equippable', 'unexpected Player facade component');
        return equipment;
      },
      getGameMode: () => (creative ? fullGameMode.Creative : fullGameMode.Survival),
    };
    if (blocked) {
      const size = fullWorld.structureManager.get('bop_ks:cf/fir_small_2').size;
      const origin = fullOrigin(state.roots[0], size);
      dimension
        .getBlock({ ...origin, y: origin.y + 3 })
        .setPermutation(fullPermutation.resolve('minecraft:stone'));
    }
    fullAssert(
      typeof fullProbeInteraction === 'function',
      'actual bone-meal subscriber was not captured',
    );
    for (let i = 0; i < repeat; i++)
      fullProbeInteraction({
        block: dimension.getBlock(state.roots[0]),
        player,
        itemStack: container.getItem(0),
        isFirstEvent: true,
        face: 'Up',
      });
    await fullWait(6);
    state.itemBefore = count;
    state.itemAfter = container.getItem(0)?.amount ?? 0;
    state.interactionInjected = true;
    state.playerAdapter = 'native chest Container backs Mainhand; no real client click';
    const expectedAmount = wrongItem || creative ? count : blocked ? count - repeat : count - 1;
    fullAssert(state.itemAfter === expectedAmount, name + ': held-item amount differs');
    if (blocked || wrongItem)
      fullAssert(
        dimension.getBlock(state.roots[0]).typeId === state.type,
        name + ': rejected interaction removed sapling',
      );
    else {
      fullAssert(
        state.selected.length === 1,
        name + ': repeated interaction placed more than one structure',
      );
      await fullVerifyStructure(dimension, state);
    }
    if (wrongItem) fullAssert(state.growMs.length === 0, 'non-bone item triggered growth');
    fullPass(state);
  } finally {
    restore();
  }
}
async function fullMultiple(dimension) {
  const state = fullNewCase('two-actual-saplings-same-callback', '4ks_bop:fir_sapling');
  state.roots = [
    { x: 8, y: 64, z: 8 },
    { x: 24, y: 64, z: 24 },
  ];
  const restore = fullForce(state, 'bop_ks:cf/fir_small_2');
  try {
    await fullPrepare(dimension, state);
    const start = Date.now();
    for (const root of state.roots) aXREUr(dimension.getBlock(root), dimension);
    state.batchMs = Date.now() - start;
    await fullWait(5);
    fullAssert(state.selected.length === 2, 'two saplings did not select two structures');
    await fullVerifyStructure(dimension, state, 0);
    await fullVerifyStructure(dimension, state, 1);
    fullPass(state);
  } finally {
    restore();
  }
}
async function fullFeatureRecovery(dimension) {
  const state = fullNewCase(
    'native-feature-failure-restores-sapling',
    '4ks_bop:origin_oak_sapling',
  );
  await fullPrepare(dimension, state);
  dimension.runCommand('fill 0 65 0 31 88 31 stone');
  dimension.runCommand('fill 0 89 0 31 111 31 stone');
  const before = dimension.getBlock(state.roots[0]).permutation;
  aXREUr(dimension.getBlock(state.roots[0]), dimension);
  await fullWait(4);
  fullAssert(
    state.featureResults.length === 1 && state.featureResults[0] === false,
    'blocked native feature did not return failure',
  );
  fullAssert(
    dimension.getBlock(state.roots[0]).typeId === before.type.id,
    'failed feature did not restore original sapling',
  );
  fullPass(state);
}
async function fullMain() {
  fullEmit({
    event: 'metadata',
    ...FULL_PROBE_CONFIG,
    naturalRandomControlled: true,
    naturalGateTicks: M3tAkes,
    naturalProbability: YgHwAF,
    timingResolutionMs: 1,
  });
  const dimension = fullWorld.getDimension('overworld');
  dimension.runCommand('gamerule randomtickspeed 0');
  dimension.runCommand('tickingarea add 0 0 0 31 0 31 bop_full_flow true');
  for (let i = 0; i < 100; i++) {
    if (dimension.getBlock({ x: 0, y: 64, z: 0 }) && dimension.getBlock({ x: 31, y: 111, z: 31 }))
      break;
    if (i === 99) throw new Error('chunks did not load');
    await fullWait(5);
  }
  if (FULL_PROBE_CONFIG.mode === 'full') await fullNatural(dimension);
  await fullStructureCase(
    dimension,
    'single-actual-structure',
    '4ks_bop:fir_sapling',
    false,
    'bop_ks:cf/fir_small_2',
  );
  await fullStructureCase(
    dimension,
    'maximum-2x2-actual-structure',
    '4ks_bop:fir_sapling',
    true,
    'bop_ks:cf/big_fir_4',
  );
  if (FULL_PROBE_CONFIG.mode === 'full') {
    for (const kind of ['first', 'last', 'middle', 'ignored'])
      await fullStructureCase(
        dimension,
        'maximum-' + kind,
        '4ks_bop:fir_sapling',
        true,
        'bop_ks:cf/big_fir_4',
        kind,
      );
    await fullStructureCase(
      dimension,
      'configured-palm-offset',
      '4ks_bop:palm_sapling',
      false,
      'bop_ks:palm/tree_1',
    );
    await fullStructureCase(
      dimension,
      'partial-unloaded-rejects-entire-growth',
      '4ks_bop:fir_sapling',
      true,
      'bop_ks:cf/big_fir_4',
      'partial',
      { x: 29, y: 64, z: 8 },
    );
    await fullStructureCase(
      dimension,
      'missing-structure-preserves-saplings',
      '4ks_bop:fir_sapling',
      true,
      'bop_probe:missing_tree',
    );
    await fullBone(dimension, 'bone-survival-success');
    await fullBone(dimension, 'bone-last-item-success', { count: 1 });
    await fullBone(dimension, 'bone-creative-retains-item', { creative: true });
    await fullBone(dimension, 'bone-blocked-preserves-sapling', { blocked: true });
    await fullBone(dimension, 'non-bone-item-does-not-grow', { wrongItem: true });
    await fullBone(dimension, 'repeated-interaction-consumes-once', { repeat: 2 });
    await fullBone(dimension, 'repeated-blocked-interaction', { repeat: 2, blocked: true });
    await fullMultiple(dimension);
    await fullFeatureRecovery(dimension);
  }
  fullProbeCase = undefined;
  fullProbePhase = 'complete';
  fullEmit({
    event: 'complete',
    variant: FULL_PROBE_CONFIG.variant,
    cases: fullProbeCases.length,
    passed: fullProbeCases.every((entry) => entry.passed),
    tick: fullSystem.currentTick,
  });
}
fullSystem.runTimeout(
  () =>
    fullMain().catch((error) =>
      fullEmit({
        event: 'fatal',
        stage: fullProbePhase,
        error: { name: error.name, message: error.message, stack: error.stack },
        currentCase: fullProbeCase,
      }),
    ),
  40,
);

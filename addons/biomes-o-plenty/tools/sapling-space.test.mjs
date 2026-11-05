import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';
import { parse } from '../../../node_modules/terser/lib/parse.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const scriptPath = 'addons/biomes-o-plenty/source/behavior-pack/scripts/bop/ks/main.js';
const baseline = execFileSync('git', ['show', `f6963709:${scriptPath}`], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
});
assert.equal(
  createHash('sha256').update(baseline).digest('hex'),
  'f524671e4b54d569a8fde83e6f00eaa900b97961ba109e26f9006b3a2ca40647',
);
const current = readFileSync(
  new URL('../source/behavior-pack/scripts/bop/ks/main.js', import.meta.url),
  'utf8',
);
const baselineAst = parse(baseline, { module: true });
function declaration(source, ast, name) {
  const node = ast.body.find((entry) => entry.TYPE === 'Defun' && entry.name.name === name);
  assert.ok(node, name);
  return source.slice(node.start.pos, node.end.pos + 1);
}
class Volume {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
}
class UnloadedChunksError extends Error {}
const decoder = vm.createContext({ TextDecoder, Uint8Array });
vm.runInContext(baseline.slice(0, baseline.indexOf('import{')) + ';function rUcsaG2(){}', decoder, {
  timeout: 2000,
});
vm.runInContext(declaration(baseline, baselineAst, 'PHwtS_'), decoder);
const before = vm.runInContext('PHwtS_', decoder);
const after = vm.runInNewContext(
  declaration(current, parse(current, { module: true }), 'PHwtS_') + ';PHwtS_',
  { BopGrowthVolume: Volume, BopUnloadedChunksError: UnloadedChunksError },
);
const configuration = baselineAst.body.find(
  (entry) =>
    entry.TYPE === 'SimpleStatement' && baseline.startsWith('rUcsaG2(M3tAkes=', entry.start.pos),
);
assert.ok(configuration);
vm.runInContext(baseline.slice(configuration.start.pos, configuration.end.pos + 1), decoder);
const growthTable = JSON.parse(vm.runInContext('JSON.stringify(pujb8Z)', decoder));

function dimensions(id) {
  const path = new URL(
    `../source/behavior-pack/structures/${id.replace(':', '/')}.mcstructure`,
    import.meta.url,
  );
  const bytes = readFileSync(path);
  const marker = Buffer.from([9, 4, 0, 115, 105, 122, 101, 3, 3, 0, 0, 0]);
  const start = bytes.indexOf(marker);
  assert.notEqual(start, -1, id);
  assert.equal(bytes.indexOf(marker, start + 1), -1, id);
  const offset = start + marker.length;
  const size = {
    x: bytes.readInt32LE(offset),
    y: bytes.readInt32LE(offset + 4),
    z: bytes.readInt32LE(offset + 8),
  };
  assert.ok(Object.values(size).every((value) => Number.isInteger(value) && value > 0));
  return size;
}
const structures = Object.entries(growthTable).flatMap(([sapling, groups]) =>
  groups.flatMap((group) =>
    (group.structures ?? []).map(([id, , offset]) => ({
      sapling,
      id,
      size: dimensions(id),
      options: { ignoreY: group.size === '2x2' ? 5 : 2, offset },
    })),
  ),
);
const key = ({ x, y, z }) => `${x},${y},${z}`;
function model({
  blockAt = () => 'minecraft:air',
  queryError,
  iteratorError,
  omitDone = false,
} = {}) {
  const stats = { getBlock: 0, getBlocks: 0, inspected: 0, matches: 0, next: 0, positions: [] };
  const dimension = {
    getBlock(position) {
      stats.getBlock++;
      stats.positions.push(key(position));
      const typeId = blockAt(position);
      return typeId === undefined ? undefined : { typeId };
    },
    getBlocks(volume, filter, allowUnloadedChunks) {
      stats.getBlocks++;
      assert.deepEqual(Array.from(filter.excludeTypes), ['minecraft:air']);
      assert.equal(allowUnloadedChunks, false);
      if (queryError) throw queryError;
      const matches = [];
      for (let y = volume.from.y; y <= volume.to.y; y++) {
        for (let z = volume.from.z; z <= volume.to.z; z++) {
          for (let x = volume.from.x; x <= volume.to.x; x++) {
            const position = { x, y, z };
            stats.inspected++;
            stats.positions.push(key(position));
            const typeId = blockAt(position);
            if (typeId === undefined) throw new UnloadedChunksError('unloaded');
            if (!filter.excludeTypes.includes(typeId)) matches.push(position);
          }
        }
      }
      stats.matches = matches.length;
      return {
        getBlockLocationIterator() {
          return {
            next() {
              stats.next++;
              if (iteratorError) throw iteratorError;
              if (matches.length === 0) return { done: true };
              return omitDone ? { value: matches[0] } : { done: false, value: matches[0] };
            },
          };
        },
      };
    },
  };
  return { stats, block: { location: { x: -17, y: 64, z: 31 }, dimension } };
}

test('actual structure sizes, offsets and ignored layers select the same coordinates', (t) => {
  for (const entry of structures) {
    const oldWorld = model();
    const newWorld = model();
    assert.equal(before(oldWorld.block, entry.size, entry.options), true, entry.id);
    assert.equal(after(newWorld.block, entry.size, entry.options), true, entry.id);
    assert.deepEqual(
      [...new Set(oldWorld.stats.positions)].sort(),
      [...new Set(newWorld.stats.positions)].sort(),
      entry.id,
    );
  }
  t.diagnostic(
    `${structures.length} configured structures checked from binary size tags; all-air coordinate sets match`,
  );
});

test('all eight range corners block growth for every configured structure', (t) => {
  let cases = 0;
  for (const { id, size, options } of structures) {
    const origin = {
      x: Math.ceil(-17 - size.x / 2) + (options.offset?.x ?? 0),
      y: 64 + (options.offset?.y ?? 0),
      z: Math.ceil(31 - size.z / 2) + (options.offset?.z ?? 0),
    };
    if (size.y <= options.ignoreY + 1) continue;
    for (const x of [origin.x, origin.x + size.x - 1]) {
      for (const y of [origin.y + options.ignoreY + 1, origin.y + size.y - 1]) {
        for (const z of [origin.z, origin.z + size.z - 1]) {
          const obstruction = key({ x, y, z });
          const blockAt = (position) =>
            key(position) === obstruction ? 'minecraft:stone' : 'minecraft:air';
          assert.equal(before(model({ blockAt }).block, size, options), false, id);
          assert.equal(after(model({ blockAt }).block, size, options), false, id);
          cases++;
        }
      }
    }
  }
  t.diagnostic(`${cases} corner obstruction cases`);
});

test('ignored layers and positions just outside the volume do not block growth', () => {
  const size = { x: 3, y: 8, z: 4 };
  const options = { ignoreY: 2, offset: { x: 2, y: -3, z: -1 } };
  const blockAt = ({ x, y, z }) =>
    x < -16 || x > -14 || z < 28 || z > 31 || y <= 63 || y > 68
      ? 'minecraft:stone'
      : 'minecraft:air';
  assert.equal(before(model({ blockAt }).block, size, options), true);
  assert.equal(after(model({ blockAt }).block, size, options), true);
});

test('water, leaves, cave air and custom blocks retain strict non-air rejection', () => {
  for (const type of [
    'minecraft:water',
    'minecraft:oak_leaves',
    'minecraft:cave_air',
    '4ks_bop:fir_leaves',
  ]) {
    const blockAt = () => type;
    assert.equal(before(model({ blockAt }).block, { x: 1, y: 5, z: 1 }), false);
    assert.equal(after(model({ blockAt }).block, { x: 1, y: 5, z: 1 }), false);
  }
});

test('an entirely ignored height returns true without reading blocks', () => {
  for (const ignoreY of [2, 5]) {
    const oldWorld = model();
    const newWorld = model();
    const size = { x: 3, y: ignoreY + 1, z: 3 };
    assert.equal(before(oldWorld.block, size, { ignoreY }), true);
    assert.equal(after(newWorld.block, size, { ignoreY }), true);
    assert.equal(oldWorld.stats.getBlock, 0);
    assert.equal(newWorld.stats.getBlocks, 0);
  }
});

test('unreadable blocks reject growth without allowing unloaded chunks to be skipped', () => {
  const size = { x: 3, y: 8, z: 3 };
  assert.equal(before(model({ blockAt: () => undefined }).block, size), false);
  assert.equal(after(model({ blockAt: () => undefined }).block, size), false);
  const unloadedAtEnd = ({ x, y, z }) =>
    x === -16 && y === 71 && z === 32 ? undefined : 'minecraft:air';
  assert.equal(before(model({ blockAt: unloadedAtEnd }).block, size), false);
  assert.equal(after(model({ blockAt: unloadedAtEnd }).block, size), false);
});

test('a conforming IteratorResult may omit done on a yielded obstruction', () => {
  const testWorld = model({
    blockAt: ({ y }) => (y === 67 ? 'minecraft:air' : 'minecraft:stone'),
    omitDone: true,
  });
  assert.equal(after(testWorld.block, { x: 1, y: 5, z: 1 }), false);
  assert.equal(testWorld.stats.getBlocks, 1);
});

test('a first-cell obstruction retains the original short circuit without allocating a query result', () => {
  const testWorld = model({ blockAt: () => 'minecraft:stone' });
  assert.equal(after(testWorld.block, { x: 14, y: 38, z: 14 }, { ignoreY: 5 }), false);
  assert.equal(testWorld.stats.getBlock, 1);
  assert.equal(testWorld.stats.getBlocks, 0);
});

test('unrelated query and iterator failures remain visible', () => {
  const error = new Error('diagnostic failure');
  assert.throws(
    () =>
      before(
        model({
          blockAt: () => {
            throw error;
          },
        }).block,
        { x: 1, y: 5, z: 1 },
      ),
    (caught) => caught === error,
  );
  assert.throws(
    () => after(model({ queryError: error }).block, { x: 1, y: 5, z: 1 }),
    (caught) => caught === error,
  );
  assert.throws(
    () => after(model({ iteratorError: error }).block, { x: 1, y: 5, z: 1 }),
    (caught) => caught === error,
  );
});

test('out-of-world errors propagate; an early obstacle plus a later unloaded block still rejects growth', () => {
  const error = Object.assign(new Error('outside world height'), {
    name: 'ArgumentOutOfBoundsError',
  });
  assert.throws(
    () => after(model({ queryError: error }).block, { x: 1, y: 5, z: 1 }),
    (caught) => caught === error,
  );
  const blockAt = ({ x, y, z }) =>
    x === -18 && y === 67 && z === 30 ? 'minecraft:stone' : undefined;
  const size = { x: 3, y: 8, z: 3 };
  assert.equal(before(model({ blockAt }).block, size), false);
  assert.equal(after(model({ blockAt }).block, size), false);
});

test('cost model counts API transitions and eager query work without claiming engine timings', (t) => {
  const largest = structures.toSorted(
    (a, b) =>
      b.size.x * b.size.z * Math.max(0, b.size.y - b.options.ignoreY - 1) -
      a.size.x * a.size.z * Math.max(0, a.size.y - a.options.ignoreY - 1),
  )[0];
  const air = model();
  before(air.block, largest.size, largest.options);
  const first = air.stats.positions[0];
  const last = air.stats.positions.at(-1);
  for (const [scenario, blockAt] of [
    ['all-air', () => 'minecraft:air'],
    [
      'first-obstructed',
      (position) => (key(position) === first ? 'minecraft:stone' : 'minecraft:air'),
    ],
    [
      'last-obstructed',
      (position) => (key(position) === last ? 'minecraft:stone' : 'minecraft:air'),
    ],
    ['all-solid', () => 'minecraft:stone'],
  ]) {
    const oldWorld = model({ blockAt });
    const newWorld = model({ blockAt });
    assert.equal(
      before(oldWorld.block, largest.size, largest.options),
      after(newWorld.block, largest.size, largest.options),
    );
    t.diagnostic(
      JSON.stringify({
        structure: largest.id,
        size: largest.size,
        ignoreY: largest.options.ignoreY,
        scenario,
        oldGetBlockCalls: oldWorld.stats.getBlock,
        newGetBlockCalls: newWorld.stats.getBlock,
        newGetBlocksCalls: newWorld.stats.getBlocks,
        modelQueryInspections: newWorld.stats.inspected,
        modelResultLocations: newWorld.stats.matches,
      }),
    );
  }
});

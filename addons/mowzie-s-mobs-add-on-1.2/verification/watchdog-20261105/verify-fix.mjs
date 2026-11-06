import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const verificationDirectory = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.resolve(
  verificationDirectory,
  '../../source/behavior-pack/scripts/main.js',
);
const source = fs.readFileSync(scriptPath, 'utf8');

function extract(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `找不到起始标记：${startMarker}`);
  assert.notEqual(end, -1, `找不到结束标记：${endMarker}`);
  return source.slice(start, end);
}

const registrySource = extract('const _0x8acd20=[];', 'function _0x434316');
const registryNames = new Map([
  [0x130a, 'length'],
  [0xeb9, 'splice'],
  [0x89c, 'isValid'],
  [0xc19, 'push'],
]);
const registryFixtures = {
  stale: { id: 'stale', isValid: () => false },
  oldTarget: { id: 'target', isValid: () => true },
  unrelated: { id: 'unrelated', isValid: () => true },
  replacement: { id: 'target', isValid: () => true },
};
const registrySandbox = {
  _0xb51871: (value) => registryNames.get(value) ?? `unknown-${value}`,
  fixtures: registryFixtures,
};
vm.runInNewContext(
  `${registrySource}
_0x8acd20.push(fixtures.stale, fixtures.oldTarget, undefined, fixtures.replacement, fixtures.unrelated);
_0x1e049e(fixtures.replacement);
globalThis.result = _0x8acd20;`,
  registrySandbox,
);
assert.deepEqual(
  Array.from(registrySandbox.result, (entity) => entity.id),
  ['unrelated', 'target'],
);
assert.equal(registrySandbox.result[1], registryFixtures.replacement);

const cleanupSource = extract('function _0x3aab40', 'function _0x591a8b');
const cleanupNames = new Map([
  [0x130a, 'length'],
  [0x89c, 'isValid'],
  [0xeb9, 'splice'],
  [0xa17, 'typeId'],
  [0x317, 'case-a'],
  [0xee2, 'case-b'],
  [0x93e, 'case-c'],
  [0x11e2, 'case-d'],
]);
const liveA = { id: 'live-a', typeId: 'none', isValid: () => true };
const liveB = { id: 'live-b', typeId: 'none', isValid: () => true };
const cleanupSandbox = {
  _0xb51871: (value) => cleanupNames.get(value) ?? `unknown-${value}`,
  _0x8acd20: [
    { id: 'stale-a', typeId: 'none', isValid: () => false },
    { id: 'stale-b', typeId: 'none', isValid: () => false },
    liveA,
    undefined,
    liveB,
    { id: 'stale-c', typeId: 'none', isValid: () => false },
  ],
};
vm.runInNewContext(`${cleanupSource};_0x3aab40();`, cleanupSandbox);
assert.deepEqual(cleanupSandbox._0x8acd20, [liveA, liveB]);
assert.equal(source.includes('_0x353147'), false);

const hurtSource = extract('function _0x4b2e12', 'function _0x37e00c');
const hurtNames = new Map([
  [0x16f, 'hurtEntity'],
  [0xeaa, 'getProperty'],
  [0x727, 'hf_mzs:is_testing'],
  [0xd62, 'damageSource'],
  [0x1340, 'damagingEntity'],
  [0x3bb, 'damagingProjectile'],
  [0xd5d, 'minecraft:projectile'],
  [0xced, 'owner'],
  [0x13d, 'setProperty'],
  [0x1267, 'hf_mzs:is_hurt'],
  [0x111b, 'setDynamicProperty'],
  [0x138f, 'getComponent'],
  [0x11b1, 'minecraft:health'],
  [0xd97, 'value'],
]);

function runHurtCase(damageSource) {
  const properties = new Map();
  const dynamicProperties = new Map();
  const hurtEntity = {
    getProperty: () => false,
    setProperty: (key, value) => properties.set(key, value),
    setDynamicProperty: (key, value) => dynamicProperties.set(key, value),
    getComponent: () => ({ value: 2 }),
  };
  const sandbox = {
    _0xb51871: (value) => hurtNames.get(value) ?? `unknown-${value}`,
    _0x4ae656: { runTimeout: () => undefined },
    event: { hurtEntity, damageSource },
  };
  vm.runInNewContext(`${hurtSource};_0x4b2e12(event);`, sandbox);
  assert.equal(properties.get('hf_mzs:is_hurt'), true);
  return dynamicProperties;
}

assert.equal(runHurtCase({}).has('hf_mzs:last_attacker'), false);
assert.equal(
  runHurtCase({ damagingEntity: { id: 'melee-owner' } }).get('hf_mzs:last_attacker'),
  'melee-owner',
);
assert.equal(
  runHurtCase({
    damagingProjectile: {
      getComponent: () => ({ owner: { id: 'projectile-owner' } }),
    },
  }).get('hf_mzs:last_attacker'),
  'projectile-owner',
);

console.log('注册表去重与失效清理：通过');
console.log('周期清理与有效实体保序：通过');
console.log('雕刻师三类伤害来源：通过');

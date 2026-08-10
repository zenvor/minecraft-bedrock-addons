import { deltaRanges } from './constants.js';
import { ItemFoodComponent } from '@minecraft/server';
const TelescopeToX = { 2: 0, 1: 0, 4: 5, 3: -5 },
  TelescopeToZ = { 2: 5, 1: -5, 4: 0, 3: 0 },
  RotateOrientationToBlockEnum = {
    2: 'hf_fur:custom_block_1',
    3: 'hf_fur:custom_block_2',
    1: 'hf_fur:custom_block_3',
    4: 'hf_fur:custom_block_0',
  },
  SpawnOrientationToBlockEnum = {
    2: 'hf_fur:custom_block_1',
    3: 'hf_fur:custom_block_2',
    1: 'hf_fur:custom_block_3',
    4: 'hf_fur:custom_block_0',
  },
  SpawnPatternedEnum = {
    2: 'hf_fur:custom_block_1',
    3: 'hf_fur:custom_block_2',
    1: 'hf_fur:custom_block_3',
    4: 'hf_fur:custom_block_0',
  },
  RotatePatternedEnum = {
    2: 'hf_fur:custom_block_1',
    3: 'hf_fur:custom_block_2',
    1: 'hf_fur:custom_block_3',
    4: 'hf_fur:custom_block_0',
  },
  PlayerTo90 = { 1: 180, 4: -90, 2: 0, 3: 90 };
function getWallBlocks(t) {
  const { dimension: o, location: e } = t,
    n = getWallOrientation(t.getRotation().y),
    { x: c, y: r, z: u } = e,
    { deltaXRange: a, deltaYRange: l } = deltaRanges[t.typeId],
    s = [];
  for (let t = -l; t <= l; t += 1)
    for (let e = -a; e <= a; e += 1) {
      let a, l, _;
      ((a = n >= 3 ? c : c < 0 ? c - e : c + e),
        (l = r < 0 ? r - t : r + t),
        (_ = n < 3 ? u : u < 0 ? u - e : u + e));
      o.getBlock({ x: a, y: l, z: _ }) && s.push({ x: a, y: l, z: _ });
    }
  return s;
}
function getWallOrientation(t) {
  const o = t % 360;
  return o >= -45 && o < 45
    ? 2
    : o >= 45 && o < 135
      ? 3
      : o >= 135 || o < -135
        ? 1
        : o >= -135 && o < -45
          ? 4
          : null;
}
function getOrientation(t) {
  switch (!0) {
    case t > 70 && t < 170:
      return 4;
    case t > -45 && t < 65:
      return 1;
    case t > -100 && t < -10:
      return 3;
    case t >= 148 || t < -100:
      return 2;
  }
}
function areVectorsEqual(t, o) {
  return (
    Math.trunc(t.x) === Math.trunc(o.x) &&
    Math.trunc(t.y) === Math.trunc(o.y) &&
    Math.trunc(t.z) === Math.trunc(o.z)
  );
}
function getItems(t, o = () => !0) {
  const e = [];
  for (let n = 0; n < t.container.size; n++) {
    const c = t.container.getItem(n);
    c && o(c) && e.push({ itemStack: c, slot: n });
  }
  return e;
}
function isFood(t) {
  const o = t.getComponent(o.componentId);
}
export {
  getWallOrientation,
  RotateOrientationToBlockEnum,
  SpawnOrientationToBlockEnum,
  SpawnPatternedEnum,
  RotatePatternedEnum,
  getWallBlocks,
  areVectorsEqual,
  getOrientation,
  PlayerTo90,
  TelescopeToX,
  TelescopeToZ,
  getItems,
};

import { BlockPermutation, system, world, EntityInventoryComponent } from '@minecraft/server';
import {
  PlayerTo90,
  RotatePatternedEnum,
  SpawnOrientationToBlockEnum,
  SpawnPatternedEnum,
  areVectorsEqual,
  getItems,
  getOrientation,
  getWallBlocks,
  getWallOrientation,
} from './lib/functions.js';
import { dimensions, fakeToReal, fakeWallIds, hitboxBlocks, wallTypeIds } from './lib/constants.js';
import './telescope.js';
import './rotation.js';
import './hf/fur/itemlore.js';
const wallBlocks = new Map();
(system.runInterval(() => {
  for (const t of dimensions)
    for (const e of t.getEntities({ families: ['fridge'] })) {
      const t = e.getComponent(EntityInventoryComponent.componentId);
      if (!t?.container) continue;
      getItems(t).length < 1 ? e.triggerEvent('hf_fur:remove_food') : e.triggerEvent('hf_fur:food');
    }
}, 40),
  world.afterEvents.entitySpawn.subscribe((t) => {
    const { entity: e } = t;
    if (!wallTypeIds.includes(e.typeId)) return;
    const { dimension: o } = e,
      n = e.getRotation().y,
      r = getWallOrientation(n),
      i = getWallBlocks(e);
    (wallBlocks.set(
      e.id,
      i.filter((t) => o.getBlock(t)?.permutation.matches('minecraft:air')),
    ),
      i.map((t) => {
        const n = o.getBlock(t);
        n &&
          n?.permutation.matches('minecraft:air') &&
          ('hf_fur:modern_wooden_wall_figures' != e.typeId
            ? n.setPermutation(BlockPermutation.resolve(SpawnOrientationToBlockEnum[r]))
            : n.setPermutation(BlockPermutation.resolve(SpawnPatternedEnum[r])));
      }));
  }),
  world.afterEvents.itemUseOn.subscribe((t) => {
    const { source: e, block: o } = t,
      n = { ...o.location, y: o.location.y + 1 },
      r = e.dimension.getEntitiesAtBlockLocation(n).find((t) => fakeWallIds.includes(t.typeId));
    if (!r) return;
    const { x: i, y: s, z: a } = r.location,
      l = e.getRotation().y,
      c = PlayerTo90[getOrientation(l)];
    (r.dimension.runCommandAsync(`summon ${fakeToReal[r.typeId]} ${i} ${s} ${a} ${c}`),
      r.triggerEvent('hf_fur:despawn'));
  }),
  world.beforeEvents.entityRemove.subscribe((t) => {
    const { removedEntity: e } = t;
    if (!wallTypeIds.includes(e.typeId)) return;
    const { dimension: o } = e;
    getWallBlocks(e).map((t) => {
      const e = o.getBlock(t);
      e &&
        hitboxBlocks.find((t) => e.permutation.matches(t)) &&
        system.run(() => e.setPermutation(BlockPermutation.resolve('minecraft:air')));
    });
  }),
  world.afterEvents.entityLoad.subscribe((t) => {
    const { entity: e } = t;
    if (!wallTypeIds.includes(e.typeId)) return;
    const { dimension: o } = e,
      n = getWallBlocks(e);
    wallBlocks.set(
      e.id,
      n.filter((t) => {
        const e = o.getBlock(t);
        return (
          hitboxBlocks.find((t) => e.permutation.matches(t)) ||
          e.permutation.matches('minecraft:air')
        );
      }),
    );
  }),
  system.afterEvents.scriptEventReceive.subscribe((t) => {
    const { id: e, sourceEntity: o } = t;
    if ('hf_fur:wall_rotation' !== e) return;
    if (!wallTypeIds.includes(o.typeId)) return;
    const { dimension: n } = o,
      r = getWallOrientation(o.getRotation().y),
      i = getWallBlocks(o),
      s = [];
    (i.map((t) => {
      const e = n.getBlock(t);
      if (!e) return;
      if ('hf_fur:modern_wooden_wall_figures' == o.typeId) {
        const a = RotatePatternedEnum[r];
        if (
          hitboxBlocks.find((t) => e.permutation.matches(t)) ||
          e.permutation.matches('minecraft:air')
        ) {
          (wallBlocks
            .get(o.id)
            .filter((t) => !i.find((e) => areVectorsEqual(t, e)))
            .map((t) => n.getBlock(t).setPermutation(BlockPermutation.resolve('minecraft:air'))),
            e.setPermutation(BlockPermutation.resolve(a)),
            s.push(t));
        }
        return;
      }
      const a = SpawnOrientationToBlockEnum[r];
      (hitboxBlocks.find((t) => e.permutation.matches(t)) ||
        e.permutation.matches('minecraft:air')) &&
        e.setPermutation(BlockPermutation.resolve(a));
    }),
      wallBlocks.set(o.id, s));
  }),
  world.afterEvents.itemUse.subscribe((t) => {
    const e = t.itemStack,
      o = t.source;
    return 'hf_fur:color_bucket' === e.typeId
      ? o.runCommandAsync('function hf/fur/color_bucket')
      : 'hf_fur:guide_book' === e.typeId
        ? o.runCommandAsync('playsound hf_fur:guide_book.page_flip @s')
        : void 0;
  }),
  world.afterEvents.playerSpawn.subscribe(async (t) => {
    const { player: e } = t;
    world.getAllPlayers().some((t) => t.hasTag('hf_fur:scoreboard')) ||
      (await e.dimension.runCommandAsync('function hf/fur/init'), e.addTag('hf_fur:scoreboard'));
  }));

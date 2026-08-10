import { world } from '@minecraft/server';
import { getOrientation, PlayerTo90 } from './lib/functions.js';
const entitiesConversion = {
  'hf_fur:garage_door_placer': 'hf_fur:garage_door',
  'hf_fur:security_lazerdoor_placer': 'hf_fur:security_lazerdoor',
};
world.afterEvents.itemUseOn.subscribe((e) => {
  const { source: o, block: r } = e,
    t = { ...r.location, y: r.location.y + 1 },
    n = o.dimension
      .getEntitiesAtBlockLocation(t)
      .find((e) => Object.keys(entitiesConversion).includes(e.typeId));
  if (!n) return;
  const { x: i, y: s, z: a } = n.location,
    c = o.getRotation().y,
    f = PlayerTo90[getOrientation(c)];
  (n.dimension.runCommandAsync(`summon ${entitiesConversion[n.typeId]} ${i} ${s} ${a} ${f}`),
    n.triggerEvent('hf_fur:despawn'));
});

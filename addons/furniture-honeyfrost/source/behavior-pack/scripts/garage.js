import { world } from '@minecraft/server';
import { getOrientation, PlayerTo90 } from './lib/functions.js';
world.afterEvents.itemUseOn.subscribe((o) => {
  const { source: t, block: n } = o,
    r = { ...n.location, y: n.location.y + 1 },
    e = t.dimension
      .getEntitiesAtBlockLocation(r)
      .find((o) => 'hf_fur:garage_door_placer' == o.typeId);
  if (!e) return;
  const { x: i, y: a, z: s } = e.location,
    c = t.getRotation().y,
    f = PlayerTo90[getOrientation(c)];
  (e.dimension.runCommandAsync(`summon hf_fur:garage_door ${i} ${a} ${s} ${f}`),
    e.triggerEvent('hf_fur:despawn'));
});

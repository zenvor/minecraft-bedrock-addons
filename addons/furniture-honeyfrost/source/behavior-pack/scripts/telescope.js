import { system } from '@minecraft/server';
system.afterEvents.scriptEventReceive.subscribe(async (e) => {
  const { id: t, sourceEntity: s } = e,
    i = s.dimension.getEntities({
      type: 'minecraft:player',
      location: s.location,
      closest: 1,
      maxDistance: 2,
    })[0];
  if (i)
    return 'hf_fur:telescope_exit' == t
      ? i.removeEffect('resistance')
      : void (
          'hf_fur:telescope_view' === t &&
          'hf_fur:medieval_telescope' === s.typeId &&
          (await i.runCommandAsync('camera @p[r=1.5] fade time 0.1 0.1 0.1 color 0 0 0'),
          i.addEffect('resistance', 2e7, { amplifier: 255, showParticles: !1 }),
          i.playSound('item.spyglass.use'))
        );
});

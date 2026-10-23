import { system, world } from '@minecraft/server';
import { AIM_OFF, createLongbowFix } from './longbow.js';

const fix = createLongbowFix({ system });
// 隔离单个失效实体导致的异常，同时让内容日志保留诊断信息。
function guarded(handler) {
  return (event) => {
    try {
      handler(event);
    } catch (error) {
      console.warn(`[RLCraft longbow] ${error}`);
    }
  };
}
world.afterEvents.itemStartUse.subscribe(guarded(fix.startAiming));
world.afterEvents.itemStopUse.subscribe(guarded(({ source }) => fix.stopAiming(source)));
world.afterEvents.itemReleaseUse.subscribe(guarded(({ source }) => fix.stopAiming(source)));
world.afterEvents.playerLeave.subscribe(fix.leave);
world.afterEvents.playerSpawn.subscribe(
  guarded(({ player }) => player.onScreenDisplay.setTitle(AIM_OFF)),
);
world.afterEvents.entityHurt.subscribe(guarded(fix.hitEntity));
world.afterEvents.projectileHitBlock.subscribe(guarded(fix.hitBlock));
system.afterEvents.scriptEventReceive.subscribe(guarded(fix.shoot));
system.runInterval(guarded(fix.tick), 1);

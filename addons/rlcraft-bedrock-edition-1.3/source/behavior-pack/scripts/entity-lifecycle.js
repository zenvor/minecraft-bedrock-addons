// @minecraft/server 1.x uses isValid(); recheck when the task executes,
// since a player can disconnect after the original event handler returns.
export function runEntityTimeout(system, entity, callback, ticks) {
  return system.runTimeout(() => {
    if (!entity.isValid()) return;
    callback();
  }, ticks);
}

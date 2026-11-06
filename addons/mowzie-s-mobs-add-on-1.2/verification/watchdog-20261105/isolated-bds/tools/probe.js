const emit = (value) => console.warn('[BDS_PROBE] ' + JSON.stringify(value));
const wait = (ticks = 1) => new Promise((resolve) => _0x4ae656.runTimeout(resolve, ticks));
const requireProbe = (value, message) => {
  if (!value) throw new Error(message);
};
const valid = (entity) => {
  try {
    return entity !== undefined && entity.isValid();
  } catch {
    return false;
  }
};
const registryEntries = () =>
  _0x8acd20.map((entity) => ({
    id: entity?.id,
    typeId: entity?.typeId,
    valid: valid(entity),
  }));
const registryCount = (id) => _0x8acd20.filter((entity) => entity?.id === id).length;
const waitFor = async (predicate, ticks, message) => {
  for (let elapsed = 0; elapsed < ticks; elapsed += 2) {
    if (predicate()) return elapsed;
    await wait(2);
  }
  if (predicate()) return ticks;
  throw new Error(message);
};

async function runMowzieProbe() {
  const fixedMarkers =
    !_0x3aab40.toString().includes('_0x353147') &&
    _0x1ed77d.toString().includes('_0x42b064') &&
    _0x4b2e12.toString().includes('?.');
  emit({
    event: 'metadata',
    scenario: MOWZIE_PROBE_CONFIG.scenario,
    expectedFixed: MOWZIE_PROBE_CONFIG.expectedFixed,
    fixedMarkers,
    baseScriptSha256: MOWZIE_PROBE_CONFIG.baseScriptSha256,
    packVersion: MOWZIE_PROBE_CONFIG.packVersion,
    registryArray: Array.isArray(_0x8acd20),
  });

  const dimension = _0x16f31c.getDimension('overworld');
  dimension.runCommand('gamerule randomtickspeed 0');
  dimension.runCommand('gamerule domobspawning false');
  dimension.runCommand('tickingarea add 0 0 0 15 0 15 mowzie_probe_near true');
  const near = { x: 8, y: 64, z: 8 };
  await waitFor(() => dimension.getBlock(near) !== undefined, 120, 'near test chunk did not load');
  dimension.runCommand('fill 0 63 0 15 63 15 grass_block');
  dimension.runCommand('fill 0 64 0 15 70 15 air');

  const lanterns = [];
  for (let index = 0; index < 6; index += 1) {
    lanterns.push(
      dimension.spawnEntity('hf_mzs:lantern', {
        x: 5 + index,
        y: 65,
        z: 5,
      }),
    );
  }
  await waitFor(
    () => lanterns.every((entity) => registryCount(entity.id) === 1),
    120,
    'spawned lanterns did not register exactly once',
  );
  emit({
    event: 'attempt',
    name: 'initial-registration',
    spawned: lanterns.length,
    registryLength: _0x8acd20.length,
    targetCounts: lanterns.map((entity) => registryCount(entity.id)),
  });

  for (const entity of lanterns) {
    entity.triggerEvent('register');
    entity.triggerEvent('register');
    entity.triggerEvent('register');
  }
  await wait(10);
  const duplicateCounts = lanterns.map((entity) => registryCount(entity.id));
  requireProbe(
    duplicateCounts.every((count) => count === 1),
    'duplicate register events created duplicate entries',
  );
  emit({
    event: 'attempt',
    name: 'duplicate-registration',
    targetCounts: duplicateCounts,
    registryLength: _0x8acd20.length,
  });

  const removed = lanterns.slice(0, 4);
  const removedIds = removed.map((entity) => entity.id);
  for (const entity of removed) entity.remove();
  await wait(50);
  const removedEntries = registryEntries().filter((entry) => removedIds.includes(entry.id));
  const removedInvalid = removedEntries.filter((entry) => !entry.valid);
  if (MOWZIE_PROBE_CONFIG.expectedFixed) {
    requireProbe(removedEntries.length === 0, 'fixed registry retained removed entities');
  } else {
    requireProbe(
      removedInvalid.length === removedIds.length,
      'baseline did not retain the expected invalid entities',
    );
  }
  emit({
    event: 'attempt',
    name: 'removed-entity-cleanup',
    removed: removedIds.length,
    retainedEntries: removedEntries.length,
    retainedInvalid: removedInvalid.length,
    registryLength: _0x8acd20.length,
  });

  const deathTarget = dimension.spawnEntity('hf_mzs:lantern', {
    x: 8,
    y: 65,
    z: 7,
  });
  await waitFor(() => registryCount(deathTarget.id) === 1, 120, 'death target did not register');
  const deathId = deathTarget.id;
  const killReturned = deathTarget.kill();
  const deathCleanupTicks = await waitFor(
    () => registryCount(deathId) === 0,
    120,
    'death target remained registered',
  );
  emit({
    event: 'attempt',
    name: 'death-cleanup',
    killReturned,
    cleanupTicks: deathCleanupTicks,
    retained: registryCount(deathId),
  });

  await wait(80);
  const liveLanterns = lanterns.slice(4);
  requireProbe(
    liveLanterns.every((entity) => valid(entity) && registryCount(entity.id) === 1),
    'periodic tasks lost or duplicated live lanterns',
  );
  emit({
    event: 'attempt',
    name: 'periodic-tasks',
    waitedTicks: 80,
    liveTargetCounts: liveLanterns.map((entity) => registryCount(entity.id)),
    registryLength: _0x8acd20.length,
  });

  const far = { x: 10000, y: 64, z: 10000 };
  dimension.runCommand('tickingarea add 9996 0 9996 10004 0 10004 mowzie_probe_far true');
  await waitFor(() => dimension.getBlock(far) !== undefined, 160, 'far test chunk did not load');
  const farEntity = dimension.spawnEntity('hf_mzs:lantern', {
    x: far.x,
    y: 65,
    z: far.z,
  });
  const farId = farEntity.id;
  await waitFor(() => registryCount(farId) === 1, 120, 'far entity did not register');
  await wait(40);
  dimension.runCommand('tickingarea remove mowzie_probe_far');
  let unloadTicks = null;
  for (let elapsed = 0; elapsed <= 300; elapsed += 2) {
    if (!valid(farEntity)) {
      unloadTicks = elapsed;
      break;
    }
    await wait(2);
  }
  let reload = {
    unloadObserved: unloadTicks !== null,
    unloadTicks,
    retainedWhileUnloaded: null,
    retainedInvalidWhileUnloaded: null,
    reloadObserved: false,
    registeredAfterReload: false,
  };
  if (unloadTicks !== null) {
    await wait(40);
    const unloadedEntries = registryEntries().filter((entry) => entry.id === farId);
    reload.retainedWhileUnloaded = unloadedEntries.length;
    reload.retainedInvalidWhileUnloaded = unloadedEntries.filter((entry) => !entry.valid).length;
    dimension.runCommand('tickingarea add 9996 0 9996 10004 0 10004 mowzie_probe_far true');
    await waitFor(
      () => dimension.getBlock(far) !== undefined,
      160,
      'far test chunk did not reload',
    );
    const reloadTicks = await waitFor(
      () => {
        const entity = _0x16f31c.getEntity(farId);
        return valid(entity);
      },
      240,
      'far entity did not become valid after reload',
    );
    reload.reloadObserved = true;
    reload.reloadTicks = reloadTicks;
    const registerTicks = await waitFor(
      () => _0x8acd20.some((entity) => entity?.id === farId && valid(entity)),
      160,
      'reloaded far entity did not register',
    );
    reload.registeredAfterReload = true;
    reload.registerTicks = registerTicks;
    requireProbe(registryCount(farId) === 1, 'reloaded far entity registered more than once');
    dimension.runCommand('tickingarea remove mowzie_probe_far');
  }
  emit({ event: 'attempt', name: 'chunk-unload-reload', ...reload });

  const sculptor = dimension.spawnEntity('hf_mzs:sculptor', {
    x: 8,
    y: 65,
    z: 10,
  });
  await waitFor(() => registryCount(sculptor.id) === 1, 160, 'sculptor did not register');
  const environmentalReturned = sculptor.applyDamage(2, {
    cause: _0x35e304.magic,
  });
  await wait(1);
  const environmentalHurt = sculptor.getProperty('hf_mzs:is_hurt');
  if (MOWZIE_PROBE_CONFIG.expectedFixed) {
    requireProbe(environmentalHurt === true, 'fixed environmental damage did not set hurt state');
  } else {
    requireProbe(
      environmentalHurt !== true,
      'baseline environmental damage unexpectedly completed',
    );
  }
  await wait(8);
  const attacker = liveLanterns[0];
  const directReturned = sculptor.applyDamage(2, {
    cause: _0x35e304.entityAttack,
    damagingEntity: attacker,
  });
  await wait(1);
  const directAttacker = sculptor.getDynamicProperty('hf_mzs:last_attacker');
  requireProbe(directAttacker === attacker.id, 'direct attacker was not recorded');
  await wait(8);
  const arrow = dimension.spawnEntity('minecraft:arrow', {
    x: 8,
    y: 66,
    z: 10,
  });
  const projectileComponent = arrow.getComponent('minecraft:projectile');
  requireProbe(projectileComponent !== undefined, 'arrow has no projectile component');
  projectileComponent.owner = attacker;
  const projectileReturned = _0x4b2e12({
    hurtEntity: sculptor,
    damageSource: { damagingProjectile: arrow },
  });
  await wait(1);
  const projectileAttacker = sculptor.getDynamicProperty('hf_mzs:last_attacker');
  requireProbe(projectileAttacker === attacker.id, 'projectile owner was not recorded');
  emit({
    event: 'attempt',
    name: 'sculptor-damage',
    environmentalReturned,
    environmentalHurt,
    directReturned,
    directAttackerMatches: directAttacker === attacker.id,
    projectileReturned,
    projectileAttackerMatches: projectileAttacker === attacker.id,
  });

  arrow.remove();
  sculptor.remove();
  for (const entity of liveLanterns) entity.remove();
  const complete = {
    event: 'complete',
    scenario: MOWZIE_PROBE_CONFIG.scenario,
    fixtureLoaded: true,
    fixedMarkers,
    initialRegistered: lanterns.length,
    duplicateCounts,
    removedRetained: removedEntries.length,
    removedInvalid: removedInvalid.length,
    deathCleanup: registryCount(deathId) === 0,
    periodicTasks: true,
    chunkReload: reload,
    damage: {
      environmentalReturned,
      environmentalHurt,
      directReturned,
      directAttackerMatches: directAttacker === attacker.id,
      projectileReturned,
      projectileAttackerMatches: projectileAttacker === attacker.id,
    },
    registryLengthAtComplete: _0x8acd20.length,
  };
  emit(complete);
}

_0x4ae656.runTimeout(
  () =>
    runMowzieProbe().catch((error) =>
      emit({
        event: 'fatal',
        scenario: MOWZIE_PROBE_CONFIG.scenario,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    ),
  60,
);

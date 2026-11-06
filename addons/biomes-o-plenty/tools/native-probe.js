const probeSize = { x: 14, y: 38, z: 14 };
const probeOptions = { ignoreY: 5 };
let probeStage = 'startup';
let previousProbeTickTime = Date.now();
const probeEmit = (entry) => console.warn('[BOPBENCH] ' + JSON.stringify(entry));
const probeWait = (ticks = 1) => system.waitTicks(ticks);
system.runInterval(() => {
  const now = Date.now();
  probeEmit({
    event: 'tick',
    tick: system.currentTick,
    at: now,
    gapMs: now - previousProbeTickTime,
    stage: probeStage,
  });
  previousProbeTickTime = now;
}, 1);

function probeInvoke(fn, block, count, expected) {
  const started = Date.now();
  let result;
  for (let i = 0; i < count; i++) {
    result = fn(block, probeSize, probeOptions);
    if (result !== expected) throw new Error('unexpected result: ' + String(result));
  }
  return Date.now() - started;
}

async function probeScenario(dimension, scenario, baseX, fillType, obstruction) {
  probeStage = scenario + '/setup';
  dimension.runCommand(`fill ${baseX} 70 0 ${baseX + 13} 101 13 ${fillType}`);
  if (obstruction)
    dimension.runCommand(`setblock ${obstruction.x} ${obstruction.y} ${obstruction.z} stone`);
  await probeWait(8);
  const block = { location: { x: baseX + 7, y: 64, z: 7 }, dimension };
  const expected = fillType === 'air' && !obstruction;
  const variants = [
    ['before', beforeSpace],
    ['after', afterSpace],
  ];
  for (let warm = 0; warm < 4; warm++) {
    for (const [variant, fn] of variants) {
      probeStage = scenario + '/warmup/' + variant;
      const elapsedMs = probeInvoke(fn, block, 1, expected);
      probeEmit({ event: 'warmup', scenario, variant, elapsedMs });
      if (elapsedMs > 750) throw new Error('single-call safety duration exceeded');
      await probeWait();
    }
  }
  let singleMaximum = 0;
  for (const count of [1, 2, 4, 16, 64]) {
    if (count > 1 && Math.max(singleMaximum, 1) * count > 600) {
      probeEmit({
        event: 'skipped',
        scenario,
        count,
        reason: 'predicted burst exceeds 600ms safety target',
        singleMaximum,
      });
      continue;
    }
    for (let sample = 0; sample < 24; sample++) {
      const order = sample % 2 === 0 ? variants : [...variants].reverse();
      for (const [variant, fn] of order) {
        probeStage = scenario + '/' + count + '/' + variant;
        const elapsedMs = probeInvoke(fn, block, count, expected);
        probeEmit({
          event: 'sample',
          scenario,
          variant,
          count,
          sample,
          elapsedMs,
          perCallMs: elapsedMs / count,
          expected,
          tick: system.currentTick,
          at: Date.now(),
        });
        if (count === 1) singleMaximum = Math.max(singleMaximum, elapsedMs);
        if (elapsedMs > 750) throw new Error('burst safety duration exceeded');
        await probeWait();
      }
    }
  }
}

async function probeMain() {
  probeEmit({
    event: 'metadata',
    ...PROBE_METADATA,
    clock: 'Date.now',
    timingResolutionMs: 1,
    batchCounts: [1, 2, 4, 16, 64],
    repeatsPerVariant: 24,
    size: probeSize,
    options: probeOptions,
    actualBopTickChain: false,
  });
  const dimension = world.getDimension('overworld');
  probeStage = 'load-two-chunks';
  dimension.runCommand('tickingarea add 0 0 0 31 0 15 bop_native_probe true');
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if (
        dimension.getBlock({ x: 0, y: 70, z: 0 }) &&
        dimension.getBlock({ x: 31, y: 101, z: 15 })
      ) {
        ready = true;
        break;
      }
    } catch {}
    await probeWait(5);
  }
  if (!ready) throw new Error('test chunks did not become readable');
  probeStage = 'idle-baseline';
  await probeWait(40);
  await probeScenario(dimension, 'all-air', 0, 'air');
  await probeScenario(dimension, 'first-obstructed', 0, 'air', { x: 0, y: 70, z: 0 });
  await probeScenario(dimension, 'last-obstructed', 0, 'air', { x: 13, y: 101, z: 13 });
  await probeScenario(dimension, 'all-solid', 0, 'stone');
  await probeScenario(dimension, 'cross-chunk-air', 12, 'air');
  probeStage = 'unloaded';
  for (const [variant, fn] of [
    ['before', beforeSpace],
    ['after', afterSpace],
  ]) {
    const block = { location: { x: 16000007, y: 64, z: 7 }, dimension };
    const started = Date.now();
    try {
      probeEmit({
        event: 'unloaded',
        variant,
        result: fn(block, probeSize, probeOptions),
        elapsedMs: Date.now() - started,
      });
    } catch (error) {
      probeEmit({
        event: 'unloaded',
        variant,
        error: { name: error.name, message: error.message },
        elapsedMs: Date.now() - started,
      });
    }
    await probeWait();
  }
  const chunkStates = [];
  for (const x of [0, 16, 32, 48, 64, 128]) {
    try {
      chunkStates.push({ x, readable: dimension.getBlock({ x, y: 70, z: 0 }) !== undefined });
    } catch (error) {
      chunkStates.push({ x, error: error.name });
    }
  }
  probeEmit({ event: 'chunk-states', states: chunkStates });
  const firstUnreadable = chunkStates.find((entry) => entry.x > 0 && entry.readable === false);
  if (
    firstUnreadable &&
    chunkStates.some((entry) => entry.x === firstUnreadable.x - 16 && entry.readable)
  ) {
    const baseX = firstUnreadable.x - 7;
    for (const [variant, fn] of [
      ['before', beforeSpace],
      ['after', afterSpace],
    ]) {
      try {
        probeEmit({
          event: 'partially-unloaded',
          variant,
          baseX,
          result: fn(
            { location: { x: baseX + 7, y: 64, z: 7 }, dimension },
            probeSize,
            probeOptions,
          ),
        });
      } catch (error) {
        probeEmit({
          event: 'partially-unloaded',
          variant,
          baseX,
          error: { name: error.name, message: error.message },
        });
      }
    }
  } else
    probeEmit({
      event: 'skipped',
      scenario: 'partially-unloaded',
      reason: 'no confirmed readable/unreadable adjacent boundary',
    });
  probeStage = 'final-idle';
  await probeWait(20);
  probeEmit({ event: 'complete', tick: system.currentTick, at: Date.now() });
}

system.runTimeout(
  () =>
    probeMain().catch((error) => {
      probeEmit({
        event: 'fatal',
        error: { name: error.name, message: error.message, stack: error.stack },
        stage: probeStage,
      });
    }),
  40,
);

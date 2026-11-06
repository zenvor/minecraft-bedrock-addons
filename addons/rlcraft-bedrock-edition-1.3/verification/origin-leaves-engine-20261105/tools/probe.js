import { world, system, BlockPermutation } from '@minecraft/server';

const position = { x: 8, y: 64, z: 8 };
const emit = (event) => console.warn('[BDS_PROBE] ' + JSON.stringify(event));
const wait = (ticks = 1) => system.waitTicks(ticks);
const require = (value, message) => {
  if (!value) throw new Error(message);
};

async function main() {
  emit({
    event: 'metadata',
    scenario: PROBE_CONFIG.scenario,
    featureCount: PROBE_CONFIG.features.length,
    fullBopUnchanged: PROBE_CONFIG.full_bop_unchanged,
    structureFixture: PROBE_CONFIG.structure_fixture,
    rlcraftScriptsLoaded: PROBE_CONFIG.rlcraft_scripts_loaded,
  });
  const dimension = world.getDimension('overworld');
  dimension.runCommand('gamerule randomtickspeed 0');
  dimension.runCommand('gamerule domobspawning false');
  dimension.runCommand('tickingarea add 0 0 0 15 0 15 reference_probe true');
  for (let i = 0; !dimension.getBlock(position); i++) {
    require(i < 100, 'test chunk did not load');
    await wait(2);
  }
  dimension.runCommand('fill 0 63 0 15 63 15 grass_block');
  dimension.runCommand('fill 0 64 0 15 67 15 air');
  const leaf = BlockPermutation.resolve('4ks_bop:origin_oak_leaves');
  const air = BlockPermutation.resolve('minecraft:air');
  const results = [];
  function checkTemplate(id) {
    const structure = world.structureManager.get(id);
    require(structure, 'missing structure: ' + id);
    require(structure.size.x === 1 &&
      structure.size.y === 1 &&
      structure.size.z === 1, 'fixture structure must be one block: ' + id);
    require(structure.getBlockPermutation({ x: 0, y: 0, z: 0 })?.type.id ===
      'minecraft:stone', 'fixture template is not stone: ' + id);
  }
  function attempt(id, existing) {
    dimension.getBlock(position).setPermutation(existing === 'leaf' ? leaf : air);
    const before = dimension.getBlock(position).typeId;
    let returned;
    let error;
    try {
      returned = dimension.placeFeature(id, position);
    } catch (caught) {
      error = { name: caught.name, message: caught.message };
    }
    const after = dimension.getBlock(position).typeId;
    const result = { id, existing, before, returned, error, after };
    emit({ event: 'attempt', ...result });
    return result;
  }
  checkTemplate('reference_probe:one_block');
  const control = ['air', 'leaf'].map((existing) => attempt('reference_probe:control', existing));
  require(control.every(
    (result) => result.returned === true && result.after === 'minecraft:stone',
  ), 'positive control failed');
  require(PROBE_CONFIG.scenario === 'control' ||
    PROBE_CONFIG.features.length === 139, 'target feature inventory incomplete');
  emit({ event: 'target-start', count: PROBE_CONFIG.features.length });
  for (const feature of PROBE_CONFIG.features) {
    checkTemplate(feature.structure);
    results.push(attempt(feature.id, 'air'), attempt(feature.id, 'leaf'));
    await wait();
  }
  const airSuccess = results.filter(
    (r) => r.existing === 'air' && r.returned === true && r.after === 'minecraft:stone',
  ).length;
  const leafSuccess = results.filter(
    (r) => r.existing === 'leaf' && r.returned === true && r.after === 'minecraft:stone',
  ).length;
  if (PROBE_CONFIG.scenario === 'fixed') {
    require(airSuccess === 139 && leafSuccess === 139, 'fixed features did not all place');
    require(results.every((r) => !r.error), 'fixed native calls threw errors');
  }
  emit({
    event: 'complete',
    scenario: PROBE_CONFIG.scenario,
    fixtureValid: true,
    targetFeatures: PROBE_CONFIG.features.length,
    nativeAttempts: results.length,
    airSuccess,
    leafSuccess,
    nativeExceptions: results.filter((r) => r.error).length,
    actualLeafType: leaf.type.id,
    actualLeafStates: leaf.getAllStates(),
  });
}

system.runTimeout(
  () =>
    main().catch((error) =>
      emit({
        event: 'fatal',
        error: { name: error.name, message: error.message, stack: error.stack },
      }),
    ),
  40,
);

import { world } from '@minecraft/server';
const wallTypeIds = [
    'hf_fur:luxury_patterned_wall',
    'hf_fur:tropical_wooden_wall',
    'hf_fur:modern_wooden_wall_figures',
  ],
  deltaRanges = {
    'hf_fur:luxury_patterned_wall': { deltaXRange: 0, deltaYRange: 1 },
    'hf_fur:tropical_wooden_wall': { deltaXRange: 0, deltaYRange: 0 },
    'hf_fur:modern_wooden_wall_figures': { deltaXRange: 1, deltaYRange: 1 },
    'hf_fur:modern_wooden_wall_figures_placer': { deltaXRange: 1, deltaYRange: 1 },
  },
  fakeWallIds = [
    'hf_fur:luxury_patterned_wall_placer',
    'hf_fur:modern_wooden_wall_figures_placer',
    'hf_fur:tropical_wooden_wall_placer',
  ],
  fakeToReal = {
    'hf_fur:luxury_patterned_wall_placer': 'hf_fur:luxury_patterned_wall',
    'hf_fur:modern_wooden_wall_figures_placer': 'hf_fur:modern_wooden_wall_figures',
    'hf_fur:tropical_wooden_wall_placer': 'hf_fur:tropical_wooden_wall',
  },
  hitboxBlocks = [
    'hf_fur:custom_block_1',
    'hf_fur:custom_block_2',
    'hf_fur:custom_block_3',
    'hf_fur:custom_block_0',
  ],
  dimensions = ['minecraft:overworld', 'minecraft:nether', 'minecraft:the_end'].map((e) =>
    world.getDimension(e),
  ),
  vanillaMeals = [
    'minecraft:salmon',
    'minecraft:cooked_salmon',
    'minecraft:cod',
    'minecraft:cooked_cod',
    'minecraft:chicken',
    'minecraft:cooked_chicken',
    'minecraft:beef',
    'minecraft:cooked_beef',
    'minecraft:rabbit',
    'minecraft:cooked_rabbit',
    'minecraft:potato',
    'minecraft:cooked_potato',
    'minecraft:porkchop',
    'minecraft:cooked_porkchop',
    'minecraft:mutton',
    'minecraft:cooked_mutton',
  ];
export {
  wallTypeIds,
  deltaRanges,
  hitboxBlocks,
  fakeWallIds,
  fakeToReal,
  dimensions,
  vanillaMeals,
};

import { world, system } from '@minecraft/server';
const loreMap = [
  { id: 'hf_fur:color_tool', lore: '§r为家具重新上色' },
  { id: 'hf_fur:color_bucket', lore: '§r为多件家具重新上色' },
  { id: 'bed_item', lore: '§r适合安睡一晚的完美床铺！' },
  { id: 'chair_item', lore: '§r兼具装饰性，坐起来很舒适！' },
  { id: 'hf_fur:futuristic_armchair_', lore: '§r兼具装饰性，坐起来很舒适！' },
  { id: 'hf_fur:western_rocking_chair_', lore: '§r兼具装饰性，坐起来很舒适！' },
  { id: 'hf_fur:modern_gym_bench_item', lore: '§r训练可获得力量效果！' },
];
system.runInterval(() => {
  for (const e of world.getAllPlayers()) {
    const r = e.getComponent('inventory').container;
    for (let e = 0; e < 36; e++) {
      const t = r.getItem(e);
      if (t)
        for (const { id: o, lore: i } of loreMap)
          if (t.typeId.includes(o)) {
            (t.setLore([i]), r.setItem(e, t));
            break;
          }
    }
  }
}, 50);

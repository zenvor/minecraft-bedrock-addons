import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const addonRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const behaviorPack = path.join(addonRoot, 'source', 'behavior-pack');

const replacements = [
  {
    file: path.join(behaviorPack, 'structures', 'hf', 'structure', 'underground_dungeon_4.mcstructure'),
    expectedCount: 8,
    from: 'loot_tables/jaar/great/great_chest.json',
    to: 'loot_tables/jaar/great/teddy_chest.json',
  },
  {
    file: path.join(
      behaviorPack,
      'structures',
      'hf',
      'dungeon',
      'default',
      'surface',
      'desert.mcstructure',
    ),
    expectedCount: 13,
    from: 'loot_tables/jaar/meh/meh_chest.json',
    to: 'loot_tables/jaar/meh/ted_chest.json',
  },
];

function countOccurrences(buffer, needle) {
  let count = 0;
  let offset = 0;
  while ((offset = buffer.indexOf(needle, offset)) !== -1) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

for (const replacement of replacements) {
  const from = Buffer.from(replacement.from, 'utf8');
  const to = Buffer.from(replacement.to, 'utf8');
  if (from.length !== to.length) {
    throw new Error(`Replacement changes NBT string length: ${replacement.file}`);
  }

  const original = await readFile(replacement.file);
  const count = countOccurrences(original, from);
  if (count !== replacement.expectedCount) {
    throw new Error(
      `${replacement.file}: expected ${replacement.expectedCount} source references, found ${count}`,
    );
  }

  const patched = Buffer.from(original);
  let offset = 0;
  while ((offset = patched.indexOf(from, offset)) !== -1) {
    to.copy(patched, offset);
    offset += to.length;
  }
  await writeFile(replacement.file, patched);
  console.log(`Patched ${replacement.expectedCount} desert-only chest references: ${replacement.file}`);
}

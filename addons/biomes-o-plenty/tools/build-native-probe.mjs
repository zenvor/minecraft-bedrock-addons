import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../../../node_modules/terser/lib/parse.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const sourcePath = 'addons/biomes-o-plenty/source/behavior-pack/scripts/bop/ks/main.js';
const before = execFileSync('git', ['show', `f6963709:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
});
const after = readFileSync(resolve(root, sourcePath), 'utf8');
const hash = (source) => createHash('sha256').update(source).digest('hex');
assert.equal(hash(before), 'f524671e4b54d569a8fde83e6f00eaa900b97961ba109e26f9006b3a2ca40647');
function extract(source, name) {
  const node = parse(source, { module: true }).body.find(
    (entry) => entry.TYPE === 'Defun' && entry.name.name === name,
  );
  assert.ok(node, name);
  return source.slice(node.start.pos, node.end.pos + 1);
}
const target = resolve(process.argv[2] ?? '/tmp/bop-native-probe-input');
const pack = resolve(target, 'behavior_packs/bop_native_probe');
mkdirSync(resolve(pack, 'scripts'), { recursive: true });
mkdirSync(resolve(target, 'worlds/isolated-probe'), { recursive: true });
mkdirSync(resolve(target, 'config/default'), { recursive: true });
const packId = '19d073a8-788c-4f95-96af-63c13733586b';
const metadata = {
  baselineCommit: 'f6963709',
  beforeSha256: hash(before),
  afterSha256: hash(after),
  intendedEngine: '1.26.61.1',
  intendedApi: '2.1.0',
  fixture: 'direct actual space functions on native Dimension, without full BOP pack',
};
const bootstrap = before.slice(0, before.indexOf('function LzUPbK(')) + extract(before, 'rUcsaG2');
const harness = readFileSync(new URL('./native-probe.js', import.meta.url), 'utf8');
const script =
  'import { world, system, BlockVolume as BopGrowthVolume, UnloadedChunksError as BopUnloadedChunksError } from "@minecraft/server";\n' +
  bootstrap +
  '\n' +
  extract(before, 'PHwtS_').replace('function PHwtS_', 'function beforeSpace') +
  '\n' +
  extract(after, 'PHwtS_').replace('function PHwtS_', 'function afterSpace') +
  '\n' +
  'const PROBE_METADATA = ' +
  JSON.stringify(metadata) +
  ';\n' +
  harness;
writeFileSync(resolve(pack, 'scripts/main.js'), script);
writeFileSync(
  resolve(pack, 'manifest.json'),
  JSON.stringify(
    {
      format_version: 2,
      header: {
        name: 'BOP native space probe',
        description: 'Isolated blank-world benchmark only',
        uuid: packId,
        version: [1, 0, 0],
        min_engine_version: [1, 26, 0],
      },
      modules: [
      {
        type: 'data',
        uuid: '44a99e20-f775-4431-9bee-a7bf9298904f',
        version: [1, 0, 0],
      },
        {
          type: 'script',
          language: 'javascript',
          uuid: '2099ec17-f2c1-4a80-98ee-106c021a6a61',
          version: [1, 0, 0],
          entry: 'scripts/main.js',
        },
      ],
      dependencies: [{ module_name: '@minecraft/server', version: '2.1.0' }],
    },
    null,
    2,
  ),
);
writeFileSync(
  resolve(target, 'worlds/isolated-probe/world_behavior_packs.json'),
  JSON.stringify([{ pack_id: packId, version: [1, 0, 0] }]),
);
writeFileSync(
  resolve(target, 'config/default/permissions.json'),
  JSON.stringify({ allowed_modules: ['@minecraft/server'] }),
);
writeFileSync(resolve(target, 'allowlist.json'), '[]');
writeFileSync(resolve(target, 'permissions.json'), '[]');
writeFileSync(
  resolve(target, 'server.properties'),
  [
    'server-name=Isolated native probe',
    'gamemode=creative',
    'difficulty=peaceful',
    'allow-cheats=true',
    'max-players=1',
    'online-mode=false',
    'allow-list=false',
    'server-port=19182',
    'server-portv6=19183',
    'enable-lan-visibility=false',
    'transport=raknet',
    'view-distance=5',
    'tick-distance=4',
    'max-threads=1',
    'level-name=isolated-probe',
    'level-seed=127013',
    'level-type=FLAT',
    'texturepack-required=false',
    'content-log-console-output-enabled=true',
    'content-log-file-enabled=false',
    'emit-server-telemetry=false',
    'client-side-chunk-generation-enabled=false',
    '',
  ].join('\n'),
);
writeFileSync(
  resolve(target, 'fixture-metadata.json'),
  JSON.stringify({ ...metadata, fixtureSha256: hash(script) }, null, 2),
);
console.log(JSON.stringify({ target, ...metadata, fixtureSha256: hash(script) }, null, 2));

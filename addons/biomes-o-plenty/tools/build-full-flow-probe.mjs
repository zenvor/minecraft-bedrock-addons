import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../../../node_modules/terser/lib/parse.js';
import { TreeWalker } from '../../../node_modules/terser/lib/ast.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const addon = 'addons/biomes-o-plenty/source/';
const entry = 'behavior-pack/scripts/bop/ks/main.js';
const hash = (content) => createHash('sha256').update(content).digest('hex');
const original = (path) =>
  execFileSync('git', ['show', `f6963709:${addon}${path}`], { cwd: root, maxBuffer: 1024 * 1024 });
const changed = execFileSync('git', ['diff', '--name-only', 'f6963709', '--', addon], {
  cwd: root,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
assert.ok(
  changed.every((path) =>
    [entry, 'behavior-pack/manifest.json', 'resource-pack/manifest.json'].includes(
      path.slice(addon.length),
    ),
  ),
  'Baseline asset differences require explicit review',
);
const target = resolve(process.argv[2]);
const mode = process.argv[3] ?? 'full';
assert.ok(['full', 'smoke'].includes(mode));
const harness = readFileSync(new URL('./full-flow-probe.js', import.meta.url), 'utf8');
mkdirSync(target, { recursive: true });
for (const variant of ['baseline', 'candidate']) {
  const folder = resolve(target, 'variant-packs', variant);
  cpSync(resolve(root, addon), folder, { recursive: true, errorOnExist: true });
  if (variant === 'baseline') {
    for (const path of [entry, 'behavior-pack/manifest.json', 'resource-pack/manifest.json'])
      writeFileSync(resolve(folder, path), original(path));
  }
  const source = readFileSync(resolve(folder, entry), 'utf8');
  const ast = parse(source, { module: true });
  const grow = ast.body.find((node) => node.TYPE === 'Defun' && node.name.name === 'aXREUr');
  const patches = [];
  let selected = 0;
  let feature = 0;
  grow.walk(
    new TreeWalker((node) => {
      if (node.TYPE !== 'VarDef' || !node.value) return;
      if (node.name.name === 'OJfDmLz' && node.value.TYPE === 'Call') {
        const argument = node.value.args[0];
        patches.push(
          [argument.start.pos, 'fullProbeCaptureStructure('],
          [argument.end.pos + String(argument.end.value).length, ')'],
        );
        selected++;
      }
      if (node.name.name === '_PbyiYw' && node.value.TYPE === 'Call') {
        patches.push(
          [node.value.start.pos, 'fullProbeCaptureFeature('],
          [node.value.end.pos + 1, ')'],
        );
        feature++;
      }
    }),
  );
  let interactions = 0;
  ast.walk(
    new TreeWalker((node) => {
      if (node.TYPE !== 'Call' || node.args.length !== 1 || node.args[0].TYPE !== 'Arrow') return;
      let base = node.expression;
      while (base.expression) base = base.expression;
      if (base.TYPE !== 'SymbolRef' || base.name !== 'n1J47Pi') return;
      const argument = node.args[0];
      patches.push([argument.start.pos, 'fullProbeCaptureInteraction('], [node.end.pos, ')']);
      interactions++;
    }),
  );
  assert.equal(selected, 1);
  assert.equal(feature, 1);
  assert.equal(interactions, 1);
  let instrumented = source;
  for (const [position, insertion] of patches.toSorted((a, b) => b[0] - a[0]))
    instrumented = instrumented.slice(0, position) + insertion + instrumented.slice(position);
  const manifest = JSON.parse(readFileSync(resolve(folder, 'behavior-pack/manifest.json')));
  const metadata = {
    variant,
    mode,
    sourceSha256: hash(source),
    packVersion: manifest.header.version,
    bpUuid: manifest.header.uuid,
    api: manifest.dependencies.filter((dep) => dep.module_name),
    entry: manifest.modules.find((module) => module.type === 'script').entry,
    fullPack: true,
    interactionInjection: 'captured actual subscriber with native-container-backed Player facade',
    naturalIntervalChanged: false,
  };
  instrumented += '\nconst FULL_PROBE_CONFIG = ' + JSON.stringify(metadata) + ';\n' + harness;
  writeFileSync(resolve(folder, entry), instrumented);
  writeFileSync(
    resolve(folder, 'probe-metadata.json'),
    JSON.stringify(
      {
        ...metadata,
        instrumentedSha256: hash(instrumented),
        observationInsertions: { selected, feature, interactions },
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ variant, sourceSha256: hash(source), instrumentedSha256: hash(instrumented) }),
  );
}
for (const name of ['config/default', 'worlds/full-flow-world'])
  mkdirSync(resolve(target, name), { recursive: true });
writeFileSync(
  resolve(target, 'config/default/permissions.json'),
  JSON.stringify({ allowed_modules: ['@minecraft/server', '@minecraft/server-ui'] }),
);
writeFileSync(resolve(target, 'permissions.json'), '[]');
writeFileSync(resolve(target, 'allowlist.json'), '[]');
writeFileSync(
  resolve(target, 'server.properties'),
  [
    'server-name=Isolated BOP full flow',
    'gamemode=creative',
    'difficulty=peaceful',
    'allow-cheats=true',
    'online-mode=false',
    'allow-list=false',
    'max-players=1',
    'server-port=19184',
    'server-portv6=19185',
    'enable-lan-visibility=false',
    'transport=raknet',
    'view-distance=5',
    'tick-distance=4',
    'max-threads=1',
    'level-name=full-flow-world',
    'level-seed=127013',
    'level-type=FLAT',
    'content-log-console-output-enabled=true',
    'content-log-file-enabled=false',
    'emit-server-telemetry=false',
    'client-side-chunk-generation-enabled=false',
    '',
  ].join('\n'),
);
cpSync(new URL('./run-native-probe.py', import.meta.url), resolve(target, 'run-native-probe.py'));

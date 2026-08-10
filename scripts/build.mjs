import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import JSON5 from 'json5';
import { minify } from 'terser';
import yazl from 'yazl';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(repositoryRoot, 'addons');
const buildRoot = path.join(repositoryRoot, '.build');
const distRoot = path.join(repositoryRoot, 'dist');
const archiveMtime = new Date('2000-01-01T00:00:00.000Z');
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const addons = [
  {
    id: 'furniture-honeyfrost',
    source: path.join(sourceRoot, 'furniture-honeyfrost', 'source'),
    output: 'Furniture by Honeyfrost-zh_CN.mcaddon',
    allowLatin: [/RGB/i, /Honeyfrost/i],
  },
  {
    id: 'furniture-xp-games',
    source: path.join(sourceRoot, 'furniture-xp-games', 'source'),
    output: 'FURNITURE Add-On by XP GAMES-zh_CN.mcaddon',
    allowLatin: [/RGB/i, /^XP$/i, /^GAMES$/i, /^FURNITURE$/i],
  },
];

const tokenPattern = /:_input_key\.[^:\r\n]+:|§.|%(?:\d+\$)?[A-Za-z%]|%\d+/g;
const hanSpacePattern = /[\u3400-\u4dbf\u4e00-\u9fff][ \t]+[\u3400-\u4dbf\u4e00-\u9fff]/;
const latinPattern = /[A-Za-z][A-Za-z'-]{1,}/g;

function fail(message) {
  throw new Error(message);
}

function relativePosix(base, target) {
  return path.relative(base, target).split(path.sep).join('/');
}

async function parseJsonFile(file) {
  const text = await readFile(file, 'utf8');
  try {
    return JSON.parse(text);
  } catch {
    try {
      return JSON5.parse(text);
    } catch (error) {
      fail(`${file} is neither valid JSON nor JSON5: ${error.message}`);
    }
  }
}

async function walk(directory) {
  const entries = (await readdir(directory, { withFileTypes: true })).sort((left, right) =>
    left.name.localeCompare(right.name, 'en'),
  );
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (entry.isFile()) files.push(target);
    else fail(`Unsupported filesystem entry (links are forbidden): ${target}`);
  }
  return files;
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

function parseLanguage(text, file) {
  const values = new Map();
  const order = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line || line.trimStart().startsWith('#') || !line.includes('=')) continue;
    const separator = line.indexOf('=');
    const key = line.slice(0, separator);
    const value = line
      .slice(separator + 1)
      .split('\t##')[0]
      .replace(/[ \t]+$/, '');
    if (values.has(key)) fail(`${file}:${index + 1} has duplicate language key ${key}`);
    values.set(key, value);
    order.push(key);
  }
  return { values, order };
}

function tokens(value) {
  return value.match(tokenPattern) ?? [];
}

function isAllowedLatin(value, patterns) {
  const words = value.replace(tokenPattern, ' ').match(latinPattern) ?? [];
  return words.every((word) => patterns.some((pattern) => pattern.test(word)));
}

async function validateLanguages(packRoot, addon) {
  const enPath = path.join(packRoot, 'texts', 'en_US.lang');
  const zhPath = path.join(packRoot, 'texts', 'zh_CN.lang');
  const languagesPath = path.join(packRoot, 'texts', 'languages.json');
  let enText;
  let zhText;
  let languagesText;
  try {
    [enText, zhText, languagesText] = await Promise.all([
      readFile(enPath, 'utf8'),
      readFile(zhPath, 'utf8'),
      readFile(languagesPath, 'utf8'),
    ]);
  } catch {
    return;
  }
  const en = parseLanguage(enText, enPath);
  const zh = parseLanguage(zhText, zhPath);
  if (en.order.join('\0') !== zh.order.join('\0')) fail(`${packRoot} language key order differs`);
  for (const key of en.order) {
    const source = en.values.get(key);
    const target = zh.values.get(key);
    if (tokens(source).join('\0') !== tokens(target).join('\0')) {
      fail(`${zhPath} changes placeholders or formatting codes for ${key}`);
    }
    if (hanSpacePattern.test(target)) fail(`${zhPath} contains Chinese word spacing for ${key}`);
    if (key !== 'contentKey' && target === source && (target.match(latinPattern) ?? []).length) {
      fail(`${zhPath} leaves ${key} untranslated`);
    }
    if (key !== 'contentKey' && !isAllowedLatin(target, addon.allowLatin)) {
      const words = target.replace(tokenPattern, ' ').match(latinPattern) ?? [];
      if (words.length) fail(`${zhPath} has unapproved Latin text for ${key}: ${words.join(', ')}`);
    }
  }
  const languages = JSON.parse(languagesText);
  if (!Array.isArray(languages) || !languages.includes('zh_CN')) {
    fail(`${languagesPath} does not register zh_CN`);
  }
}

async function manifestsIn(root) {
  const files = await walk(root);
  const manifests = [];
  for (const file of files.filter((file) => path.basename(file) === 'manifest.json')) {
    const data = await parseJsonFile(file);
    manifests.push({ file, data });
  }
  return manifests;
}

function packKind(manifest, file) {
  const types = new Set((manifest.modules ?? []).map((module) => module.type));
  if (types.has('data') && types.has('resources'))
    fail(`${file} mixes behavior and resource modules`);
  if (types.has('data')) return 'behavior';
  if (types.has('resources')) return 'resources';
  fail(`${file} is neither a behavior pack nor a resource pack manifest`);
}

function importedSpecifiers(code) {
  return [...code.matchAll(/(?:\bfrom\s*|\bimport\s*)(['"])([^'"\r\n]+)\1/g)].map(
    (match) => match[2],
  );
}

async function validateScriptPack(packRoot, manifest, files) {
  const scriptModules = (manifest.modules ?? []).filter((module) => module.type === 'script');
  const moduleDependencies = new Set(
    (manifest.dependencies ?? [])
      .map((dependency) => dependency.module_name)
      .filter((moduleName) => typeof moduleName === 'string'),
  );
  for (const module of scriptModules) {
    if (typeof module.entry !== 'string' || !module.entry.endsWith('.js')) {
      fail(`${path.join(packRoot, 'manifest.json')} has an invalid script entry`);
    }
    const entry = path.resolve(packRoot, module.entry);
    if (!isInside(packRoot, entry)) fail(`Script entry escapes its pack: ${module.entry}`);
    try {
      if (!(await stat(entry)).isFile()) fail(`Script entry is not a file: ${entry}`);
    } catch (error) {
      if (error?.code === 'ENOENT') fail(`Script entry does not exist: ${entry}`);
      throw error;
    }
  }
  for (const file of files.filter(
    (candidate) => candidate.endsWith('.js') && isInside(packRoot, candidate),
  )) {
    const code = await readFile(file, 'utf8');
    for (const specifier of importedSpecifiers(code)) {
      if (specifier.startsWith('.')) {
        if (!specifier.endsWith('.js'))
          fail(`${file} has an extensionless relative import: ${specifier}`);
        const target = path.resolve(path.dirname(file), specifier);
        if (!isInside(packRoot, target)) fail(`${file} imports outside its pack: ${specifier}`);
        try {
          if (!(await stat(target)).isFile()) fail(`${file} imports a non-file: ${specifier}`);
        } catch (error) {
          if (error?.code === 'ENOENT') fail(`${file} imports a missing file: ${specifier}`);
          throw error;
        }
      } else if (specifier.startsWith('@minecraft/')) {
        const moduleName = specifier.split('/').slice(0, 2).join('/');
        if (!moduleDependencies.has(moduleName)) {
          fail(`${file} imports ${moduleName} without a matching manifest dependency`);
        }
      }
    }
  }
}

async function validateResourceAssets(packRoot, files) {
  const relativeFiles = new Set(
    files.filter((file) => isInside(packRoot, file)).map((file) => relativePosix(packRoot, file)),
  );
  const textureLists = ['textures/texture_list.json', 'textures/textures_list.json'].filter(
    (file) => relativeFiles.has(file),
  );
  if (textureLists.length !== 1) {
    fail(`${packRoot} must contain exactly one texture_list.json or textures_list.json`);
  }
  const listedTextures = await parseJsonFile(path.join(packRoot, textureLists[0]));
  if (!Array.isArray(listedTextures) || listedTextures.some((item) => typeof item !== 'string')) {
    fail(`${textureLists[0]} must be an array of texture paths`);
  }
  if (new Set(listedTextures).size !== listedTextures.length) {
    fail(`${textureLists[0]} contains duplicate texture paths`);
  }
  const imageExtensions = ['.png', '.tga', '.jpg', '.jpeg'];
  const actualTextures = new Set(
    [...relativeFiles]
      .filter(
        (file) =>
          file.startsWith('textures/') &&
          imageExtensions.includes(path.posix.extname(file).toLowerCase()),
      )
      .map((file) => file.slice(0, -path.posix.extname(file).length)),
  );
  for (const texture of listedTextures) {
    if (!actualTextures.has(texture))
      fail(`${textureLists[0]} references a missing texture: ${texture}`);
  }
  for (const texture of actualTextures) {
    if (!listedTextures.includes(texture)) fail(`${textureLists[0]} omits texture: ${texture}`);
  }

  const definitionsPath = 'sounds/sound_definitions.json';
  if (!relativeFiles.has(definitionsPath)) return;
  const definitions = await parseJsonFile(path.join(packRoot, definitionsPath));
  for (const [event, definition] of Object.entries(definitions.sound_definitions ?? {})) {
    if (!Array.isArray(definition.sounds))
      fail(`${definitionsPath} has invalid sounds for ${event}`);
    for (const item of definition.sounds) {
      const sound = typeof item === 'string' ? item : item?.name;
      if (typeof sound !== 'string')
        fail(`${definitionsPath} has an invalid sound entry for ${event}`);
      const extension = path.posix.extname(sound).toLowerCase();
      const base = ['.ogg', '.wav', '.fsb'].includes(extension)
        ? sound.slice(0, -extension.length)
        : sound;
      if (!['.ogg', '.wav', '.fsb'].some((suffix) => relativeFiles.has(`${base}${suffix}`))) {
        fail(`${definitionsPath} references a missing sound for ${event}: ${sound}`);
      }
    }
  }
}

async function validateTree(root, addon) {
  const files = await walk(root);
  for (const file of files) {
    if (path.basename(file) === '.DS_Store' || relativePosix(root, file).includes('__MACOSX/')) {
      fail(`build contains a forbidden system file: ${file}`);
    }
    if (file.endsWith('.json')) await parseJsonFile(file);
    if (file.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.status !== 0) fail(`JavaScript syntax check failed: ${file}\n${result.stderr}`);
    }
  }
  const manifests = await manifestsIn(root);
  if (manifests.length !== 2) fail(`${root} must contain exactly two pack manifests`);
  const packs = manifests.map(({ file, data }) => ({
    file,
    data,
    root: path.dirname(file),
    kind: packKind(data, file),
  }));
  if (packs.filter((pack) => pack.kind === 'behavior').length !== 1) {
    fail(`${root} must contain exactly one behavior pack`);
  }
  if (packs.filter((pack) => pack.kind === 'resources').length !== 1) {
    fail(`${root} must contain exactly one resource pack`);
  }
  const headers = new Map();
  const uuids = new Map();
  for (const { file, data } of manifests) {
    if (!uuidPattern.test(data.header?.uuid ?? '')) fail(`${file} has an invalid header UUID`);
    if (uuids.has(data.header.uuid))
      fail(`${file} duplicates UUID from ${uuids.get(data.header.uuid)}`);
    uuids.set(data.header.uuid, file);
    headers.set(data.header.uuid, data.header.version);
    if (!Array.isArray(data.header?.version) || data.header.version.length !== 3) {
      fail(`${file} has an invalid header version`);
    }
    for (const module of data.modules ?? []) {
      if (!uuidPattern.test(module.uuid ?? '')) fail(`${file} has a module with an invalid UUID`);
      if (uuids.has(module.uuid)) fail(`${file} duplicates UUID from ${uuids.get(module.uuid)}`);
      uuids.set(module.uuid, file);
      if (
        ['data', 'resources'].includes(module.type) &&
        JSON.stringify(module.version) !== JSON.stringify(data.header.version)
      ) {
        fail(`${file} has a ${module.type} module version that differs from the header`);
      }
    }
    for (const dependency of data.dependencies ?? []) {
      if (
        dependency.uuid &&
        headers.has(dependency.uuid) &&
        JSON.stringify(dependency.version) !== JSON.stringify(headers.get(dependency.uuid))
      ) {
        fail(`${file} has an out-of-sync pack dependency`);
      }
    }
    const packRoot = path.dirname(file);
    await validateLanguages(packRoot, addon);
    await validateScriptPack(packRoot, data, files);
    if (packKind(data, file) === 'resources') await validateResourceAssets(packRoot, files);
  }
  return packs;
}

async function minifyScripts(source, destination) {
  const files = await walk(destination);
  for (const output of files.filter((file) => file.endsWith('.js'))) {
    const input = path.join(source, relativePosix(destination, output));
    const code = await readFile(input, 'utf8');
    const result = await minify(code, {
      module: true,
      compress: true,
      mangle: true,
      format: { comments: false },
    });
    if (!result.code) fail(`Terser produced no output for ${input}`);
    await writeFile(output, `${result.code}\n`, 'utf8');
  }
}

async function buildAddon(addon) {
  const output = path.join(buildRoot, addon.id);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(addon.source, output, {
    recursive: true,
    filter: (name) => !['.DS_Store', '__MACOSX'].includes(path.basename(name)),
  });
  await validateTree(addon.source, addon);
  await minifyScripts(addon.source, output);
  const packs = await validateTree(output, addon);
  return { output, packs };
}

async function createArchive(source, output, options = {}) {
  const { compress = true } = options;
  const zip = new yazl.ZipFile();
  const files = await walk(source);
  for (const file of files) {
    zip.addFile(file, relativePosix(source, file), {
      compress,
      mtime: archiveMtime,
      mode: 0o100644,
    });
  }
  await mkdir(path.dirname(output), { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  await rm(temporary, { force: true });
  const completed = new Promise((resolve, reject) => {
    const stream = createWriteStream(temporary);
    stream.on('close', resolve);
    stream.on('error', reject);
    zip.outputStream.on('error', reject).pipe(stream);
  });
  try {
    zip.end();
    await completed;
    const test = spawnSync('unzip', ['-t', temporary], { encoding: 'utf8' });
    if (test.status !== 0)
      fail(`ZIP CRC check failed for ${output}\n${test.stderr || test.stdout}`);
    await rename(temporary, output);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

async function createMcaddon(addon, built, output) {
  const packageRoot = path.join(buildRoot, 'packages', addon.id);
  await rm(packageRoot, { recursive: true, force: true });
  await mkdir(packageRoot, { recursive: true });
  const names = {
    behavior: `${addon.id}-behavior.mcpack`,
    resources: `${addon.id}-resources.mcpack`,
  };
  for (const pack of built.packs) {
    await createArchive(pack.root, path.join(packageRoot, names[pack.kind]));
  }
  const packagedFiles = await walk(packageRoot);
  if (packagedFiles.length !== 2 || packagedFiles.some((file) => !file.endsWith('.mcpack'))) {
    fail(`${packageRoot} must contain exactly two .mcpack files`);
  }
  await createArchive(packageRoot, output, { compress: false });
}

async function patchVersion(addon) {
  const manifests = await manifestsIn(addon.source);
  const headers = new Map();
  for (const { data } of manifests) {
    const version = data.header?.version;
    if (!Array.isArray(version) || version.length !== 3)
      fail(`Cannot bump malformed version in ${data.header?.uuid ?? 'unknown manifest'}`);
    headers.set(data.header.uuid, [version[0], version[1], version[2] + 1]);
  }
  for (const { file, data } of manifests) {
    data.header.version = headers.get(data.header.uuid);
    for (const module of data.modules ?? []) {
      if (['data', 'resources'].includes(module.type)) module.version = data.header.version;
    }
    for (const dependency of data.dependencies ?? []) {
      if (dependency.uuid && headers.has(dependency.uuid))
        dependency.version = headers.get(dependency.uuid);
    }
    await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
}

async function sha256(file) {
  return createHash('sha256')
    .update(await readFile(file))
    .digest('hex');
}

function selectedAddons(argument) {
  if (!argument || argument === 'all') return addons;
  const addon = addons.find((item) => item.id === argument);
  if (!addon) fail(`Unknown addon: ${argument}`);
  return [addon];
}

async function main() {
  const [command, target] = process.argv.slice(2);
  if (!['check', 'build', 'pack', 'verify:reproducible', 'version:patch'].includes(command)) {
    fail(
      'Usage: node scripts/build.mjs <check|build|pack|verify:reproducible|version:patch> [addon-id|all]',
    );
  }
  const selected = selectedAddons(target);
  if (command === 'version:patch') {
    for (const addon of selected) await patchVersion(addon);
    console.log(`Bumped patch version for ${selected.map((addon) => addon.id).join(', ')}`);
    return;
  }
  if (command === 'check') {
    for (const addon of selected) await validateTree(addon.source, addon);
    console.log(`Checked ${selected.map((addon) => addon.id).join(', ')}`);
    return;
  }
  if (command === 'verify:reproducible') {
    for (const addon of selected) {
      const output = path.join(distRoot, addon.output);
      await createMcaddon(addon, await buildAddon(addon), output);
      const first = await sha256(output);
      await createMcaddon(addon, await buildAddon(addon), output);
      const second = await sha256(output);
      if (first !== second) fail(`${addon.output} is not reproducible: ${first} != ${second}`);
      console.log(`${addon.output}: reproducible SHA-256 ${second}`);
    }
    return;
  }
  for (const addon of selected) {
    const built = await buildAddon(addon);
    if (command === 'pack') {
      const output = path.join(distRoot, addon.output);
      await createMcaddon(addon, built, output);
      console.log(`Created ${relativePosix(repositoryRoot, output)}`);
    } else {
      console.log(`Built ${relativePosix(repositoryRoot, built.output)}`);
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

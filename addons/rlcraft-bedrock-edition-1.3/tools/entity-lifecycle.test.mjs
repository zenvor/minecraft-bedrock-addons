import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { runEntityTimeout } from '../source/behavior-pack/scripts/entity-lifecycle.js';

const source = readFileSync(
  new URL('../source/behavior-pack/scripts/main.js', import.meta.url),
  'utf8',
);
// Extract original source expressions without rewriting/evaluating the game module.
function balanced(start, open, close) {
  let depth = 0,
    quote = '',
    escaped = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = '';
    } else if (c === "'" || c === '"' || c === '`') quote = c;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error('Unbalanced source');
}
function declaration(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1);
  const body = source.indexOf('{', start);
  return source.slice(start, body) + balanced(body, '{', '}');
}
const decoder = vm.createContext({});
const bootstrapStart = source.indexOf('const _0x613ea5=');
const bootstrapEnd = source.indexOf(';import{BlockInventoryComponent', bootstrapStart);
assert.ok(bootstrapStart > 0 && bootstrapEnd > bootstrapStart);
vm.runInContext(
  declaration('_0x193e') + declaration('_0x27c1') + source.slice(bootstrapStart, bootstrapEnd + 1),
  decoder,
  { timeout: 1000 },
);
const decode = (index) => vm.runInContext(`_0x27c1(${index})`, decoder);
const expressions = [...source.matchAll(/runEntityTimeout\(/g)].map(
  (match) => 'runEntityTimeout' + balanced(match.index + 'runEntityTimeout'.length, '(', ')'),
);
assert.equal(expressions.length, 7, 'All seven diagnosed delayed player callbacks must be guarded');

for (const [index, expression] of expressions.entries()) {
  for (const valid of [true, false]) {
    test(`actual callback ${index + 1}: ${valid ? 'active player retains behavior' : 'disconnect before execution skips entity access'}`, () => {
      let loaded = true;
      const calls = [],
        queued = [];
      const entity = {
        isValid: () => loaded,
        removeTag(tag) {
          assert.ok(loaded);
          calls.push(['removeTag', tag]);
        },
        hasTag() {
          assert.ok(loaded);
          return false;
        },
        addTag(tag) {
          assert.ok(loaded);
          calls.push(['addTag', tag]);
        },
        playSound(id) {
          assert.ok(loaded);
          calls.push(['playSound', id]);
        },
        addEffect(id, duration, options) {
          assert.ok(loaded);
          assert.equal(typeof options.amplifier, 'number');
          assert.equal(options.showParticles, false);
          calls.push(['addEffect', id, duration, options.amplifier]);
        },
        onScreenDisplay: {
          setActionBar() {
            assert.ok(loaded);
            calls.push(['actionBar']);
          },
        },
      };
      const system = {
        runTimeout(fn, ticks) {
          queued.push({ fn, ticks });
          return 42;
        },
      };
      const context = vm.createContext({ runEntityTimeout, _0x397b12: system });
      for (const name of ['_0x5af837', '_0x1f5b2f', '_0x113848', '_0x1e9b74', '_0x1f528a'])
        context[name] = entity;
      for (const name of [
        '_0x948285',
        '_0x38901f',
        '_0x3cf9ba',
        '_0x2ceaad',
        '_0x16917f',
        '_0x613ea5',
      ])
        context[name] = decode;
      vm.runInContext(declaration('_0x381646'), context);
      assert.equal(vm.runInContext(expression, context), 42);
      assert.equal(queued.length, 1);
      assert.ok([2, 3, 5, 400].includes(queued[0].ticks));
      loaded = valid;
      assert.doesNotThrow(queued[0].fn);
      if (!valid) assert.deepEqual(calls, []);
      else if (expression.includes('_0x1f528a'))
        assert.deepEqual(calls, [['addEffect', 'instant_health', 40, 0]]);
      else assert.ok(calls.some(([name]) => name === 'removeTag'));
    });
  }
}
test('unrelated callback errors remain visible for diagnosis', () => {
  let callback;
  runEntityTimeout(
    {
      runTimeout(fn) {
        callback = fn;
      },
    },
    { isValid: () => true },
    () => {
      throw new Error('real failure');
    },
    1,
  );
  assert.throws(callback, /real failure/);
});

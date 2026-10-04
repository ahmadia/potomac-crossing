/* The visual-check tools that can run without Safari or Quick Look: node --test */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'tools/shots.mjs');

test('shots.mjs: on a locked screen each shot gets a fresh short session; LOCKED overrides the check (no Safari needed)', () => {
  const run = (env) => spawnSync(process.execPath, [SHOTS, '--lock'], { encoding: 'utf8', env: Object.assign({}, process.env, env) });
  const on = run({ LOCKED: '1' }), off = run({ LOCKED: '0' }), ask = run({ LOCKED: '' });
  assert.equal(on.status, 0, on.stderr);
  assert.match(on.stdout, /^locked: a fresh short session for each shot/);
  assert.match(off.stdout, /^unlocked: one session for every shot/);
  assert.equal(ask.status, 0, ask.stderr);
  assert.match(ask.stdout, /^(locked|unlocked): /, 'reads the lock from the window server, or says unlocked when it cannot');
});

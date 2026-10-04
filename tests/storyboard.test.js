/* The storyboard is generated from the story data, so it must never lag behind it. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

test('docs/storyboard/ch01.md matches app/story/ch01.js (else run: node tools/storyboard.mjs)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    const out = path.join(tmp, 'ch01.md');
    const run = spawnSync(process.execPath, [path.join(ROOT, 'tools/storyboard.mjs'), path.join(ROOT, 'app/story/ch01.js'), out], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const fresh = fs.readFileSync(out, 'utf8');
    const committed = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch01.md'), 'utf8');
    assert.ok(fresh === committed, 'docs/storyboard/ch01.md is stale: run node tools/storyboard.mjs');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

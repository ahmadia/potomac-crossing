/* The storyboards are generated from the story data, so they must never lag behind it: every
 * chapter in app/story/ has its docs/storyboard/chNN.md, exactly as tools/storyboard.mjs writes it
 * now (else run: node tools/storyboard.mjs). Also: the tool prints a chapter-2 frame's skip-count,
 * gift and `when` conditions (checked on the fixture chapter). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TOOL = path.join(ROOT, 'tools/storyboard.mjs');
const chapters = fs.readdirSync(path.join(ROOT, 'app/story')).filter(f => /^ch\d+\.js$/.test(f)).sort();

function generate(storyFile, tmp) {
  const out = path.join(tmp, path.basename(storyFile, '.js') + '.md');
  const run = spawnSync(process.execPath, [TOOL, storyFile, out], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  return fs.readFileSync(out, 'utf8');
}

test('every chapter in app/story has a storyboard', () => {
  assert.ok(chapters.includes('ch01.js'));
  for (const f of chapters) {
    const md = path.join(ROOT, 'docs/storyboard', path.basename(f, '.js') + '.md');
    assert.ok(fs.existsSync(md), 'docs/storyboard/' + path.basename(md) + ' is missing: run node tools/storyboard.mjs');
  }
});

for (const f of chapters) {
  const id = path.basename(f, '.js');
  test('docs/storyboard/' + id + '.md matches app/story/' + f + ' (else run: node tools/storyboard.mjs)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
    try {
      const fresh = generate(path.join(ROOT, 'app/story', f), tmp);
      const md = path.join(ROOT, 'docs/storyboard', id + '.md');
      const committed = fs.existsSync(md) ? fs.readFileSync(md, 'utf8') : '';
      assert.ok(fresh === committed, 'docs/storyboard/' + id + '.md is stale: run node tools/storyboard.mjs');
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
}

test('it prints a chapter-2 frame’s skip-count, gift and when conditions (the fixture chapter 2)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    // the fixture chapter 2, as a story file of its own
    const file = path.join(tmp, 'fx02.js');
    fs.writeFileSync(file, 'const fx = require(' + JSON.stringify(path.join(ROOT, 'tests/fixtures/chapters.js')) + ')();\n' +
      'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {}; PC.story.fx02 = fx.ch02;\nmodule.exports = PC;\n');
    const md = generate(file, tmp);
    assert.match(md, /\*\*Then she counts by 2s\*\* \(the skip-count\): 5 taps, one on each cat in turn \(the next one glows; a tap anywhere else makes it wiggle\).*2, 4, 6, 8, 10\./);
    assert.match(md, /the grizzled old tom\. Then: “TEN! Flat ears still count\.”, and Next\./);
    assert.match(md, /\*\*Gift:\*\* Riffle’s lucky stone: dark and smooth, with a white stripe all the way around \(from Riffle, `riffle-stone`\)/);
    assert.match(md, /> The earth behind the pile is dug up\. \*\(only if specialty is "noticing"\)\*/);
    assert.match(md, /“Psst, it’s deep\.” \*\(only if worry is "water"\)\*/);
    assert.match(md, /“Your first mark is a little deeper\.” \*\(only if the ch02-tails lesson went without help\)\*/);
    assert.match(md, /“Hmph\.” \*\(only if not \(she got 10 × 2 right the first time\)\)\*/);
    assert.match(md, /This option shows only if specialty is "swimming"\./);
    assert.match(md, /- \*\*The old ferry otter\*\*: “WHAT\? SPEAK UP!”/);
    assert.match(md, /2 × 6 \(its own question\)/);
    assert.match(md, /After 5 × 2, right the first time \(the picture regroups as 2 × 5\)/);
    assert.match(md, /It adapts: a 1s fact that was hard for her last time takes question 2, and its twin becomes 1 × 3\./);
    assert.match(md, /comes back two questions later \(the questions in between come from `ch02-ears`, never a pair asked already while there is another, each asked in that lesson’s picture and words\)/);
    assert.match(md, /After 5 × 2, right on its retry \(regrouped again\):/);
    assert.match(md, /one claw mark on the trunk for each Count she has learned/);
    assert.match(md, /## Coming next[\s\S]*\*\*Chapter 3: Under the Old Bridge\*\*/);
    assert.match(md, /\| Skip-counts \| 1 \(5 taps, by 2s\) \|/);
    assert.match(md, /\| Gifts \| Riffle’s lucky stone \(a09\) \|/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('its words cover the art’s whole vocabulary: every set (with its time of day), camera, anchor, option value, pose, mood, effect and cast member', () => {
  const run = spawnSync(process.execPath, [TOOL, '--check-words'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
});

test('a frame’s scene says its own time of day, and the cast extras in words (chapter 2)', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/storyboard/ch02.md'), 'utf8');
  const scenes = md.split('\n').filter(l => l.startsWith('**Scene.** Den:'));
  assert.ok(scenes.some(l => /rosebush, in the morning\./.test(l)), 'the den in the morning');
  assert.ok(scenes.some(l => /rosebush, at night\./.test(l)), 'the den at night');
  assert.ok(!scenes.some(l => /in the morning/.test(l) && /at night/.test(l)));
  assert.match(md, /Riffle’s stone at the front paws/);
  assert.match(md, /purring \(the purr lines come from this one alone\)/);
  assert.match(md, /lifted onto a pouf/);
  assert.match(md, /ears laid flat/);
  assert.match(md, /on the far side of the old tree/);
  assert.match(md, /right where she put it/);
  assert.match(md, /- \*Caption\*: You touch your nose to each little stack\./);
  assert.doesNotMatch(md, /\[object Object\]/);
});

test('with no arguments the tool writes a storyboard for every chapter (run in a copy of the repo)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-storyboard-'));
  try {
    for (const d of ['tools', 'app/story', 'docs']) fs.mkdirSync(path.join(tmp, d), { recursive: true });
    fs.copyFileSync(TOOL, path.join(tmp, 'tools/storyboard.mjs'));
    fs.copyFileSync(path.join(ROOT, 'app/engine.js'), path.join(tmp, 'app/engine.js'));
    for (const f of chapters) fs.copyFileSync(path.join(ROOT, 'app/story', f), path.join(tmp, 'app/story', f));
    const run = spawnSync(process.execPath, [path.join(tmp, 'tools/storyboard.mjs')], { encoding: 'utf8', cwd: tmp });
    assert.equal(run.status, 0, run.stderr);
    for (const f of chapters) {
      const id = path.basename(f, '.js');
      const md = fs.readFileSync(path.join(tmp, 'docs/storyboard', id + '.md'), 'utf8');
      assert.match(md, new RegExp('^# Storyboard: Chapter \\d+, '), id);
      assert.match(run.stdout, new RegExp('Wrote docs/storyboard/' + id + '\\.md'));
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const bad = spawnSync(process.execPath, [TOOL, path.join(ROOT, 'no-such-chapter.js')], { encoding: 'utf8' });
  assert.notEqual(bad.status, 0, 'a story file that is not there fails loudly');
});

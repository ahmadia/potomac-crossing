/* The take-aways kit's tools (docs/take-aways.md v0.3, sections 6, 8 and 9: test file `takes-tools`): the storyboard's
 * words for a take frame and for the store under a book page, the Safari tool's take targets (tools/shots.mjs, through the
 * page's PC.debug.takes), the WebKit tool's `takes` job (dev/webkit/run.mjs: the gate's screens, the keypad checked at a
 * column and the next) and its measure's take keys (dev/webkit/measure.js), and the sweep's `col-off`, `keypad-moved` and
 * `--takes` over the page review's four more sizes (tools/sweep.mjs). The kit v0.4 (decision 57; the plan's tools owner,
 * ~/potomac-crossing-work/regroup/plan.md): the new targets and screens (the moves, a move-help, `ahead`, the marks page),
 * `@next` at a move, the measure's small boxes, targets, slot and marks page (on a stand-in page), `col-off`'s small boxes,
 * `hit-small`, `marks-small`, `--takes --compare` (take:first, the shelf, a store round and chapter 12's Spanish screens
 * byte for byte), and the
 * storyboard's marks page. No WebKit, Safari or Quick Look runs here; every cache is a scratch directory, and the
 * storyboards are written to one. On the stub chapters (tests/fixtures/takes-stub.js) until the real ones land.
 * node --test */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { load, ROOT } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/story/warrior.js'));
const E = PC.engine, S = PC.story, W = PC.warrior;
const stub = require('./fixtures/takes-stub.js');

const T = (f) => path.join(ROOT, f);
const imp = (f) => import(pathToFileURL(T(f)).href);
const scratch = (name) => fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-' + name + '-'));
const node = (args, more) => spawnSync(process.execPath, args, { encoding: 'utf8', cwd: ROOT, env: Object.assign({}, process.env, { PC_RENDER_LOCK: '' }, more || {}), timeout: 60000 });
const SHOTS = fs.readFileSync(T('tools/shots.mjs'), 'utf8');
const MEASURE = fs.readFileSync(T('dev/webkit/measure.js'), 'utf8');
const SWEEP = fs.readFileSync(T('tools/sweep.mjs'), 'utf8');

/* ------------------------------------------------------------------ the storyboard */

/* A chapter as a story file of its own (as tests/storyboard.test.js boards its fixtures), boarded into DIR. */
function board(dir, id, body) {
  const file = path.join(dir, id + '.js'), out = path.join(dir, id + '.md');
  fs.writeFileSync(file, 'globalThis.PC = globalThis.PC || {}; PC.story = PC.story || {};\n' + body + '\nmodule.exports = PC;\n');
  const r = spawnSync(process.execPath, [T('tools/storyboard.mjs'), file, out], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return fs.readFileSync(out, 'utf8');
}
const fromStub = (n) => 'PC.story.ch' + n + ' = require(' + JSON.stringify(T('tests/fixtures/takes-stub.js')) + ')().ch' + n + ';';
const thenOf = (md, set) => md.split('\n').find((l) => l.startsWith('**Then the take-aways** `' + set + '`')) || '';

test('storyboard.mjs: a take set’s lesson in a Counts frame’s place, as section 8 writes it (the stub chapter 12): its problems as written, the worked one marked, the store picture, its lines', () => {
  const dir = scratch('sb12');
  try {
    const md = board(dir, 'ch12', fromStub(12));
    const take = thenOf(md, 'ch12-take');
    assert.ok(take.startsWith('**Then the take-aways** `ch12-take` (the store’s prey in squares, rows and loose): 254 − 131, worked (its own question; its own lines once it is right in every column); 58 − 23, 76 − 42, 475 − 132, 368 − 145.'), take);
    assert.match(take, / Each needs: no spread \(254 − 131, 58 − 23, 76 − 42, 475 − 132, 368 − 145\)\./);
    assert.match(take, / Its step: `none` \(/);
    assert.match(take, /a helped one comes back as a twin \(new numbers, the same shape\) two problems later\. On to f002\.$/);
    assert.doesNotMatch(md, /×/, 'a take-away is never boarded as a Count');
    assert.doesNotMatch(md, /\*\*Then the Counts lesson\*\*/);
    // its lines, each in its speaker's balloon: the prompt, the right lines, the praise in turn, the closing line
    assert.ok(md.includes('- Asking 254 − 131:\n  - **Tallyheart**: “The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.”'));
    assert.ok(md.includes('- After 254 − 131, right in every column the first time:\n  - **Tallyheart**: “One square, two rows, three loose left.”'));
    assert.ok(md.includes('- Asking a problem with no words of its own: its column alone, and Read to me says it in words (“Fifty-eight take away twenty-three.”).'), 'the engine’s own words for it');
    assert.ok(md.includes('- Praise for a problem right in every column the first time, in turn (a blank one says nothing): “Yes!”, “That’s it.”, “Every column.”'));
    assert.ok(md.includes('- At the end: “Take-aways tell you HOW MANY.”'));
    // the story's take-away: Glintstar's question, straight on
    const st = thenOf(md, 'ch12-story');
    assert.ok(st.startsWith('**Then the take-aways** `ch12-story` (the store’s prey in squares, rows and loose): 175 − 42 (its own question).'), st);
    assert.ok(md.includes('- Asking 175 − 42:\n  - **Glintstar**: “How many are left?”\n- No closing line: the next frame goes straight on.'));
    // at a glance: a row of their own, never under the Counts
    assert.ok(md.includes('| Counts lessons | 0 () |'));
    assert.ok(md.includes('| Take-aways | 2 (ch12-take: 5 problems; ch12-story: 1 problem) |'));
    assert.ok(md.includes('or do a Counts lesson or a take-away lesson).'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('storyboard.mjs: worked and tapped problems, the made warm-up, the kinds with their flags, a set with no twins (the stub chapters 13, 17 and 21)', () => {
  const dir = scratch('sb13');
  try {
    const t13 = thenOf(board(dir, 'ch13', fromStub(13)), 'ch13-take');
    assert.ok(t13.includes(': 43 − 16, worked; 70 − 34, tapped; 85 − 39, 97 − 52, 486 − 253.'), t13);
    assert.match(t13, / Each needs: a row to spread \(43 − 16, 70 − 34, 85 − 39\); no spread \(97 − 52, 486 − 253\)\./);
    assert.match(t13, /A worked one is Tallyheart’s: /);
    assert.match(t13, /In a tapped one, the zone to spread from glows and the keypad waits until she taps it\./);
    const t17 = thenOf(board(dir, 'ch17', fromStub(17)), 'ch17-take');
    assert.match(t17, /a row and a square to spread \(731 − 696 \[no hundreds left\], 513 − 248 \[leaves a zero\]\)/);
    assert.match(t17, / First a made warm-up, new each time: a two-digit take-away with a row to spread \(a twin of 43 − 16\), never one of this chapter’s answers, introduced “One to warm up your whiskers\.”/);
    assert.doesNotMatch(t17, /worked|tapped/, 'all hers');
    const md21 = board(dir, 'ch21', fromStub(21)), t21 = thenOf(md21, 'ch21-story');
    assert.match(t21, /across two zeros \(700 − 463, 500 − 382, 500 − 467 \[no hundreds left\]\)/);
    assert.match(t21, /and a helped one does not come back \(`twins: false`\)\. On to f002\.$/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('storyboard.mjs: a Counts set and a take set side by side; the quick picture, a problem’s own picture, a set’s own lines, and the store under the book page', () => {
  const dir = scratch('sbmix');
  try {
    const md = board(dir, 'ch14', 'PC.story.ch14 = ' + JSON.stringify({
      id: 'ch14', number: 14, module: 2, title: 'Mixed', start: 'f001',
      frames: { f001: { board: 'STUB.', counts: { set: 'ch14-warm', next: 'f002' } }, f002: { board: 'STUB.', counts: { set: 'ch14-take', next: 'f003' } }, f003: { board: 'STUB.', end: true } },
      counts: {
        'ch14-warm': { teacher: 'tallyheart', table: 6, things: 'cats', facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }] },
        'ch14-take': { op: '-', teach: 'ones', warm: true, teacher: 'tallyheart', picture: { kind: 'marks' }, regroup: 'tap', done: '',
          lines: { warmIntro: 'Whiskers first.', twinIntro: ['Another.', 'Again.'], blank: { tens: 'No rows.', hundreds: 'No squares.' } },
          facts: [{ a: 352, b: 127, regroup: 'show' }, { a: 640, b: 218, picture: { kind: 'store' } }, [462, 135], { a: 768, b: 315, regroup: 'hers' }, [586, 231]] }
      },
      book: { title: '{name}’s First Frost-Time', recap: [{ text: 'She counted the store.' }], store: 133 }
    }) + ';');
    assert.ok(md.includes('| Counts lessons | 1 (ch14-warm: 2 facts) |'), 'the Counts row lists the Counts set alone');
    assert.ok(md.includes('| Take-aways | 1 (ch14-take: 5 problems, a made warm-up first) |'));
    assert.match(md, /\*\*Then the Counts lesson\*\* `ch14-warm`/, 'a Counts set is boarded as it always was');
    const t = thenOf(md, 'ch14-take');
    assert.ok(t.startsWith('**Then the take-aways** `ch14-take` (the quick picture on sand: squares, lines and dots): 352 − 127, worked; 640 − 218, tapped (drawn as the store’s prey in squares, rows and loose); 462 − 135, tapped; 768 − 315, 586 − 231, tapped.'), t);
    assert.match(t, /introduced “Whiskers first\.”/, 'the set’s own warm-up line');
    assert.ok(md.includes('- In place of the kit’s `warmIntro`: “Whiskers first.”.'));
    assert.ok(md.includes('- In place of the kit’s `twinIntro`: “Another.”, “Again.”.'));
    assert.ok(md.includes('- In place of the kit’s `blank`: tens: “No rows.”, hundreds: “No squares.”.'));
    assert.ok(md.includes('- No closing line: the next frame goes straight on.'));
    assert.ok(md.includes('**In the store:** under the recap, small, the store picture of 133 (one square, three rows and three loose), with “In the store:” in Comic Neue and 133 in Andika; it prints with the page.'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('storyboard.mjs, the kit v0.4: a take set’s `marks` boarded as “Then the marks page” before its first problem’s lines (the stub chapter 13’s four lines, two after-lines and the two labels, as E.takeMarksPage gives them); a set with none, none', () => {
  const dir = scratch('sbmarks');
  try {
    const md = board(dir, 'ch13', fromStub(13));
    const at = md.indexOf('**Then the marks page**'), take = md.indexOf('**Then the take-aways** `ch13-take`'), ask = md.indexOf('- Asking a problem with no words of its own: its column alone');
    assert.ok(take >= 0 && at > take && ask > at, 'after the lesson’s paragraph, before its problems’ lines');
    assert.ok(md.includes('**Then the marks page** (the kit’s; before 43 − 16’s prompt, the first problem here with a spread to make, while she has no marks yet: her pick is saved as her marks, and she can change it on the Hollow’s shelf, My marks): two picture buttons in the column’s place, 43 − 16 done in each style, “A little 1 in front” on the left and “The new number on top” on the right.'));
    assert.ok(md.includes(' Read to me says the lines, then the labels.\n- Its lines, in order:\n' +
      '  - **Chispapaw**: “My little Tall One writes it like THIS.”\n  - **Chispapaw**: “A little 1 in front!”\n' +
      '  - **Tallyheart**: “Some write the new number on top instead.”\n  - **Tallyheart**: “Both are right. Which marks do YOU like?”\n' +
      '- After “A little 1 in front”:\n  - **Chispapaw**: “Just like my little Tall One!”\n- After “The new number on top”:\n  - **Tallyheart**: “On top it is. That’s how I write it too!”\n\n- Asking'), md);
    assert.equal(md.split('**Then the marks page**').length, 2, 'once: the story set (52 − 27) has no marks');
    for (const n of [12, 14, 17]) assert.doesNotMatch(board(dir, 'ch' + n, fromStub(n)), /Then the marks page/, 'chapter ' + n + '’s stub sets have no marks');
    // a set's `marks` with no lines of its own: the kit's, in the set's teacher's voice; a made warm-up comes first; a set
    // with no spread never shows it
    const own = (facts, more) => board(dir, 'ch15', 'PC.story.ch15 = ' + JSON.stringify({ id: 'ch15', number: 15, module: 2, title: 'Marks', start: 'f001',
      frames: { f001: { board: 'STUB.', counts: { set: 'ch15-take', next: 'f002' } }, f002: { board: 'STUB.', end: true } },
      counts: { 'ch15-take': Object.assign({ op: '-', teach: 'tens', teacher: 'tallyheart', picture: { kind: 'store' }, facts, marks: {} }, more) } }) + ';');
    const kit = own([[97, 52], [526, 254]]);
    assert.ok(kit.includes('**Then the marks page** (the kit’s; before 526 − 254’s prompt, the first problem here with a spread to make,'));
    assert.ok(kit.includes('- Its lines, in order:\n  - **Tallyheart**: “When you spread a row, how do you write it?”\n  - **Tallyheart**: “Both are right. Tap the marks you like.”\n' +
      '- After “A little 1 in front”:\n  - **Tallyheart**: “Then that’s how we’ll write it.”\n- After “The new number on top”:\n  - **Tallyheart**: “Then that’s how we’ll write it.”'), kit);
    assert.ok(own([[97, 52]], { warm: true }).includes('(the kit’s; before the made warm-up’s prompt (it always has a row to spread), while she has no marks yet'));
    assert.ok(own([[97, 52], [486, 253]]).includes('**Then the marks page** (the kit’s; it never shows here: no problem in this set has a spread to make): two picture buttons'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('storyboard.mjs: no storyboard of chapters 1 to 11 or the Warrior Counts says a take-away word (their take branch is never reached; storyboard.test.js holds them byte for byte)', () => {
  for (const f of fs.readdirSync(T('docs/storyboard')).filter((x) => /^(ch(0\d|1[01])|warrior)\.md$/.test(x))) {
    const md = fs.readFileSync(T('docs/storyboard/' + f), 'utf8');
    assert.doesNotMatch(md, /take-away|Then the take-aways|In the store:|−/, f);
  }
});

/* ------------------------------------------------------------------ the Safari tool */

const TAKE_TARGETS = eval('(' + /const TAKE_TARGETS = (\{[\s\S]*?\n\});\n/.exec(SHOTS)[1] + ')');
const TAKES_JS = new Function('return `' + /const TAKES = `([\s\S]*?)`;\n/.exec(SHOTS)[1] + '`;')();
const WARRIOR_JS = new Function('return `' + /const WARRIOR = `([\s\S]*?)`;\n/.exec(SHOTS)[1] + '`;')();

test('shots.mjs: the take targets section 8 names, each opened through the page’s PC.debug.takes; take:first under a waiting Warrior Counts re-sit', () => {
  assert.deepEqual(Object.keys(TAKE_TARGETS), ['take:first', 'take:q', 'take:show', 'take:tap', 'take:spread', 'take:echo', 'take:sand', 'take:done', 'hollow:shelf', 'store:q',
    'take:touch', 'take:lend', 'take:get', 'take:get:one', 'take:chain', 'take:help:move', 'take:ahead', 'take:marks', 'hollow:marks']);
  assert.deepEqual(Object.values(TAKE_TARGETS).map((t) => t[0]), ['first', 'q', 'show', 'tap', 'spread', 'echo', 'sand', 'done', 'shelf', 'store',
    'touch', 'lend', 'get', 'get:one', 'chain', 'help:move', 'ahead', 'marks', 'hollow:marks'], 'PC.debug.takes’ words (section 8; the kit v0.4’s, the plan’s page owner)');
  assert.ok(Object.entries(TAKE_TARGETS).every(([k, t]) => (k === 'take:first') === !!t[1]), 'only take:first sets her Counts up');
  // take:first's recipe, run through the engine as the page runs a sitting: a pass, then a sitting again waiting
  const c = E.blankCat({ now: 1 }); c.name = 'Moon';
  const page = { engine: E, story: S, warrior: W, debug: { cat: () => c, save: () => true } };
  const made = new Function('PC', 'recipe', 'return (function () { ' + WARRIOR_JS + ' }).call(null, recipe);').call(null, page, TAKE_TARGETS['take:first'][1]);
  assert.equal(made, true);
  assert.ok(c.warrior.attempts.some((a) => a.finished && a.right >= 50), 'she has passed');
  assert.equal(E.warriorState(c, S, Date.now()).stale, null, 'a sitting again, with an answer in it, waits');
  const wait = E.hollowLines(c, S, { now: Date.now() }).waiting;
  assert.ok(typeof wait === 'string' && wait.length > 20, 'so the take lesson opens under the waiting line (startChapterLesson’s wWait)');
});

test('shots.mjs: the take screen’s page script asks PC.debug.takes for the screen, and for a step (in its options) only when one is given; a build without it says so', () => {
  const run = (debug, what, i) => new Function('PC', 'return (function () { ' + TAKES_JS + ' }).apply(null, arguments[1]);').call(null, { debug }, [what, i]);
  assert.equal(run({ cat: () => ({}) }, 'q', null), 'no take-aways in this build (PC.debug.takes)');
  assert.equal(run(undefined, 'q', null), 'no take-aways in this build (PC.debug.takes)');
  const calls = [];
  const debug = { cat: () => ({}), takes: function () { calls.push(Array.from(arguments)); return arguments[0] === 'q' ? true : 'no ' + arguments[0]; } };
  assert.equal(run(debug, 'q', null), true);
  assert.equal(run(debug, 'sand', -1), 'no sand');
  assert.deepEqual(calls, [['q'], ['sand', { step: -1 }]], 'the page’s own default when no step is asked; a step in its options');
  assert.equal(run({ cat: () => null, takes: () => true }, 'q', null), 'no cat');
  // `#n`: a step, 1 the first, -1 the last (PC.debug.takes counts from 0, from the end below 0); none, the page's own
  const takeTarget = new Function('TAKE_TARGETS', 'CAT', /(function takeTarget\(target, anchor\) \{[\s\S]*?\n\})\n/.exec(SHOTS)[1] + '\nreturn takeTarget;')(TAKE_TARGETS, {});
  assert.deepEqual(takeTarget('take:sand', undefined), { what: 'sand', step: null, recipe: null });
  assert.deepEqual(takeTarget('take:sand', '1'), { what: 'sand', step: 0, recipe: null });
  assert.deepEqual(takeTarget('take:sand', '-1'), { what: 'sand', step: -1, recipe: null });
  assert.deepEqual(takeTarget('take:show', '3'), { what: 'show', step: 2, recipe: null });
  assert.deepEqual(takeTarget('take:first', '').recipe, { sittings: [52], answers: 10 });
  assert.equal(takeTarget('hub', ''), null);
  const withCat = new Function('TAKE_TARGETS', 'CAT', /(function takeTarget\(target, anchor\) \{[\s\S]*?\n\})\n/.exec(SHOTS)[1] + '\nreturn takeTarget;')(TAKE_TARGETS, { warrior: { sittings: [46] } });
  assert.deepEqual(withCat('take:first', '').recipe, { sittings: [46] }, 'CAT’s own `warrior` wins');
  // wired into the single shot and the sheet's panes, before the chapter-frame and card-pick paths
  assert.match(SHOTS, /const tt = takeTarget\(target, anchor\);\n.*\n  if \(tt && tt\.recipe\) \{\n    const made = await run\(WARRIOR, \[tt\.recipe\]\);/);
  assert.match(SHOTS, /const pt = !screen && !tt && ch !== 'warrior'/, 'a take target is never a card pick');
  assert.match(SHOTS, /if \(!tt && \/\^\(take\|store\|hollow\):\/\.test\(target\)\) \{ console\.error\(t \+ ': the take-aways kit’s targets: '/, 'an unknown one is named, never opened as a chapter frame');
  assert.match(SHOTS, /const ok = tt \? await run\(TAKES, \[tt\.what, tt\.step\]\) : wt \?/);
  assert.match(SHOTS, /if \(takes\[i\]\) \{[\s\S]*?new w\.Function\(takesJs\)\.apply\(null, \[takes\[i\]\.what, takes\[i\]\.step\]\)[\s\S]*?\}\n        else if \(\/\^\(hub\|book\|hollow/);
  assert.match(SHOTS, / \* {3}node tools\/shots\.mjs OUTDIR take:first take:q take:show take:tap take:spread take:echo take:sand take:done\n/, 'the header names them');
  assert.match(SHOTS, / \* {3}node tools\/shots\.mjs OUTDIR take:touch take:lend take:get take:get:one take:chain take:help:move take:ahead\n \* {3}node tools\/shots\.mjs OUTDIR take:marks hollow:marks\n/, 'and the kit v0.4’s');
  assert.ok(!/speechSynthesis\.speak|readBtn/.test(TAKES_JS), 'nothing that could sound');
});

test('shots.mjs, the kit v0.4: each new target opens PC.debug.takes’ screen of the same name (two-part names kept whole), sets up no Counts, and is never a chapter frame, a screen or a card pick', () => {
  const takeTarget = new Function('TAKE_TARGETS', 'CAT', /(function takeTarget\(target, anchor\) \{[\s\S]*?\n\})\n/.exec(SHOTS)[1] + '\nreturn takeTarget;')(TAKE_TARGETS, {});
  const v4 = { 'take:touch': 'touch', 'take:lend': 'lend', 'take:get': 'get', 'take:get:one': 'get:one', 'take:chain': 'chain', 'take:help:move': 'help:move', 'take:ahead': 'ahead', 'take:marks': 'marks', 'hollow:marks': 'hollow:marks' };
  for (const [t, w] of Object.entries(v4)) {
    assert.deepEqual(takeTarget(t, undefined), { what: w, step: null, recipe: null }, t);
    assert.match(t, /^(take|store|hollow):/, t + ': the single shot reads it as a take target first');
    const calls = [];
    const r = new Function('PC', 'return (function () { ' + TAKES_JS + ' }).apply(null, arguments[1]);').call(null, { debug: { cat: () => ({}), takes: function () { calls.push(Array.from(arguments)); return true; } } }, [takeTarget(t).what, takeTarget(t).step]);
    assert.equal(r, true);
    assert.deepEqual(calls, [[w]], t + ': PC.debug.takes(' + JSON.stringify(w) + ')');
  }
  // (a sheet's pane: a take target is never a card pick, whatever colons it has)
  assert.match(SHOTS, /return t0\.includes\(':'\) && !t0\.startsWith\('warrior:'\) && !TAKE_TARGETS\[t0\] \? pickTarget\(a0\) : null;/);
});

/* ------------------------------------------------------------------ the WebKit tool's takes job */

test('dev/webkit/run.mjs: the `takes` job measures the gate’s screens (section 6) through the tree’s own shots.mjs scripts, verbatim: stills, Read to me off, take:first’s re-sit', async () => {
  const { pageScripts, measureJobs, call, takeOpen, SIZES, TAKE_SIZES, TAKE_SCREENS, TAKE_NEXT, TAKE_JS } = await imp('dev/webkit/run.mjs');
  assert.deepEqual(TAKE_NEXT, { 'take:q': 'column', 'take:echo': 'column', 'take:lend': 'lend', 'take:get': 'get' }, 'a column’s digit on v0.3’s two; a move’s number on take:lend and take:get (the keypad must not move between the moves)');
  assert.deepEqual(SIZES, ['1080x720', '1180x820', '820x1180', '390x844'], 'the sweep keeps its four sizes');
  assert.deepEqual(TAKE_SIZES, ['1080x700', '1024x768', '768x1024', '844x390'], 'the page review’s four more');
  // (pinned anew for the kit v0.4: its screens after v0.3's, which keep their order)
  assert.deepEqual(TAKE_SCREENS, ['take:first', 'take:q', 'take:show', 'take:tap', 'take:echo', 'take:sand', 'take:done', 'hollow:shelf', 'store:q',
    'take:touch', 'take:lend', 'take:get', 'take:get:one', 'take:chain', 'take:help:move', 'take:ahead', 'take:marks', 'hollow:marks']);
  assert.ok(TAKE_SCREENS.every((t) => TAKE_TARGETS[t]), 'each one opens through a TAKE_TARGETS entry');
  const Sx = pageScripts(ROOT);
  assert.equal(Sx.TAKES, TAKES_JS, 'TAKES is shots.mjs’s, verbatim');
  assert.deepEqual(Sx.TAKE_TARGETS, TAKE_TARGETS);
  const jobs = measureJobs(Sx, 'http://localhost:1/', ['takes'], { aas: [false, true] });
  assert.equal(jobs.length, 2 * TAKE_SCREENS.length, 'a fresh page a screen, Aa off and on');
  assert.ok(jobs.every((j) => j.name === 'takes'));
  const head = '(function(){' + Sx.SETUP + '\n}).apply(null, ';
  jobs.forEach((j, n) => {
    const t = TAKE_SCREENS[n % TAKE_SCREENS.length];
    assert.equal(j.steps[1].js, call(Sx.STILL), t + ': stills first');
    const setup = j.steps.find((s) => s.js.startsWith(head));
    assert.equal(JSON.parse(setup.js.slice(head.length, -1))[2], false, t + ': Read to me off');
    const open = j.steps.find((s) => s.js === takeOpen(Sx.TAKES, TAKE_TARGETS[t][0]).js);
    assert.ok(open.js.includes(Sx.TAKES), t + ': shots.mjs’s TAKES inside, verbatim');
    assert.ok(open, t + ': opened through PC.debug.takes(' + TAKE_TARGETS[t][0] + ')');
    const ms = j.steps.filter((s) => /window\.__JM\(arguments\[0\]\)/.test(s.js)).map((s) => JSON.parse(s.js.slice(s.js.lastIndexOf('}).apply(null, ') + 15, -1))[0]);
    assert.deepEqual(ms, TAKE_NEXT[t] ? [t, t + '@next'] : [t], t + ': measured (and after a right digit or number, the next column or box)');
    // what is typed: the outlined column's digit (v0.3's), or the ringed small box's number for the move (three keys at most: 1, 3, OK)
    const typed = j.steps.filter((s) => s.js === call(TAKE_JS.type) || s.js.startsWith('(function(){' + TAKE_JS.move));
    if (TAKE_NEXT[t] === 'column') assert.deepEqual(typed.map((s) => s.js), [call(TAKE_JS.type)], t);
    else if (TAKE_NEXT[t]) {
      assert.deepEqual(typed.map((s) => s.js), [call(TAKE_JS.move, [TAKE_NEXT[t]])], t + ': the ' + TAKE_NEXT[t] + '’s number');
      assert.equal(j.steps.filter((s) => s.js === call(TAKE_JS.key)).length, 3, t + ': up to two digits and OK');
      assert.ok(j.steps.some((s) => s.js === call(TAKE_JS.moveNext)), t + ': then the next box ringed');
    } else assert.equal(typed.length, 0, t + ': nothing typed');
    assert.ok(!j.steps.slice(j.steps.indexOf(open)).some((s) => /scrollTo\(/.test(s.js)), t + ': at the page’s own scroll (it brings the keypad into view)');
    assert.equal(j.steps.some((s) => s.js === call(Sx.WARRIOR, [{ sittings: [52], answers: 10 }])), t === 'take:first', t + ': the re-sit only for take:first');
    assert.ok(!j.steps.some((s) => /readBtn/.test(s.js) && !/QUIET|readAloud !== want/.test(s.js)), t + ': nothing taps Read to me');
  });
  // a tree whose shots.mjs has no take screens (the live one, before the merge): no takes job, so a compare is clean
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-tree-'));
  try {
    fs.mkdirSync(path.join(dir, 'tools'));
    fs.writeFileSync(path.join(dir, 'tools/shots.mjs'), SHOTS.replace('const TAKES = `', 'const TAKES_NOT = `'));
    const So = pageScripts(dir);
    assert.equal(So.TAKES, null);
    assert.deepEqual(measureJobs(So, 'http://localhost:1/', ['screens', 'warrior', 'takes'], { aas: [false] }).map((j) => j.name), ['screens', 'screens', 'warrior', 'warrior', 'warrior', 'warrior', 'warrior', 'warrior', 'warrior']);
    // a tree with v0.3's take screens and none of v0.4's (the live tree, v25): its own nine measured as before, the nine it
    // lacks named in one note (not nine fresh pages)
    const v3 = SHOTS.replace(/,\n  'take:touch'[^\n]*\n  'take:help:move'[^\n]*\n\};/, '\n};');
    assert.notEqual(v3, SHOTS);
    fs.writeFileSync(path.join(dir, 'tools/shots.mjs'), v3);
    const S3 = pageScripts(dir);
    assert.deepEqual(Object.keys(S3.TAKE_TARGETS), ['take:first', 'take:q', 'take:show', 'take:tap', 'take:spread', 'take:echo', 'take:sand', 'take:done', 'hollow:shelf', 'store:q']);
    const j3 = measureJobs(S3, 'http://localhost:1/', ['takes'], { aas: [false] });
    assert.equal(j3.length, 1 + 9);
    assert.ok(j3[0].steps.some((s) => s.js === call('return arguments[0];', [TAKE_SCREENS.slice(9).join(', ') + ': not in tools/shots.mjs TAKE_TARGETS'])), 'one note names them');
    // (the compare's narrowing: another tree's take:first alone)
    assert.deepEqual(measureJobs(Sx, 'http://localhost:1/', ['takes'], { aas: [false], takeScreens: ['take:first'] }).length, 1);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

/* A stand-in take page for the typing scripts: a column of `n` boxes labelled `label`, box `on` outlined, and a keypad
 * that records its taps. */
function fakePage(label, n, on) {
  const taps = [], boxes = Array.from({ length: n }, (_, i) => ({ classList: { contains: (c) => c === 'miss' && false }, on: i === on }));
  const col = {
    getAttribute: (k) => (k === 'aria-label' ? label : null),
    querySelector: (sel) => (sel === '.tbox.on' ? boxes.find((b) => b.on) || null : null),
    querySelectorAll: (sel) => (sel === '.tbox' ? boxes : [])
  };
  const document = { querySelector: (sel) => (sel === '#screen .tcol' ? col : /^#screen \.key\[data-k="(\w+)"\]$/.test(sel) ? { click: () => taps.push(/data-k="(\w+)"/.exec(sel)[1]) } : null) };
  const window = {};
  const run = (js) => new Function('PC', 'document', 'window', 'return (function () { ' + js + ' }).call(null);').call(null, { engine: E }, document, window);
  return { run, taps, window, boxes };
}

test('dev/webkit/run.mjs: on take:q and take:echo the outlined column’s right digit is typed on the page’s own keypad (read from the column’s words and the plan), then OK, then the next column is waited for', async () => {
  const { TAKE_JS } = await imp('dev/webkit/run.mjs');
  // 503 − 278, the ones outlined (the third of three boxes, left to right): 5, then OK
  let p = fakePage('Five hundred three take away two hundred seventy-eight.', 3, 2);
  assert.equal(p.run(TAKE_JS.type), true);
  assert.deepEqual(p.window.__tk.keys, ['5', 'ok']);
  assert.equal(p.run(TAKE_JS.key), true); assert.equal(p.run(TAKE_JS.key), true); assert.equal(p.run(TAKE_JS.key), true);
  assert.deepEqual(p.taps, ['5', 'ok'], 'one key a step, then nothing more');
  assert.equal(p.run(TAKE_JS.next), 'pending', 'the same column still outlined: wait');
  p.boxes[2].on = false;
  assert.equal(p.run(TAKE_JS.next), 'pending', 'none outlined while the spread lands: wait');
  p.boxes[1].on = true;
  assert.equal(p.run(TAKE_JS.next), true, 'the tens outlined');
  // the tens outlined, and words around the problem: 2
  p = fakePage('The column: five hundred three take away two hundred seventy-eight', 3, 1);
  assert.equal(p.run(TAKE_JS.type), true);
  assert.deepEqual(p.window.__tk.keys, ['2', 'ok']);
  // a two-digit problem's ones: 52 − 27 = 25
  p = fakePage('Fifty-two take away twenty-seven.', 2, 1);
  p.run(TAKE_JS.type);
  assert.deepEqual(p.window.__tk.keys, ['5', 'ok']);
  // 503 − 478 = 25: its tens, then its blank hundreds would be the last column (nothing after it to measure)
  p = fakePage('Five hundred three take away four hundred seventy-eight.', 3, 1);
  p.run(TAKE_JS.type);
  assert.deepEqual(p.window.__tk.keys, ['2', 'ok']);
  assert.equal(fakePage('Five hundred three take away four hundred seventy-eight.', 3, 0).run(TAKE_JS.type), 'the outlined box is the last column: no next column to measure');
  // what it refuses, and says
  assert.match(fakePage('', 3, 2).run(TAKE_JS.type), /^the column’s aria-label does not say its problem in words/);
  assert.match(fakePage('503 − 278', 3, 2).run(TAKE_JS.type), /^the column’s aria-label does not say its problem in words/);
  assert.equal(fakePage('Five hundred three take away two hundred seventy-eight.', 3, -1).run(TAKE_JS.type), 'no outlined box (.tbox.on) to type in');
  const failed = fakePage('Five hundred three take away two hundred seventy-eight.', 3, 2); failed.window.__tfail = true;
  assert.equal(failed.run(TAKE_JS.type), true, 'a screen that did not open types nothing (its one note is the open’s)');
  assert.equal(failed.run(TAKE_JS.next), true);
  assert.deepEqual(failed.taps, []);
});

/* A stand-in take page at a move (the kit v0.4): a column labelled `label` holding one ringed small box at `at` (its
 * left and top, or null for none) and an outlined answer box (`tbox`, true or false), a keypad (`dim` or not) that records
 * its taps. */
function movePage(label, at, tbox) {
  const taps = [], st = { at, tbox, dim: false };
  const rect = (xy) => ({ left: xy[0] + 0.3, top: xy[1] - 0.2, right: xy[0] + 30, bottom: xy[1] + 20 });
  const col = {
    getAttribute: (k) => (k === 'aria-label' ? label : null),
    querySelector: (sel) => (sel === '.tmini.on' ? (st.at ? { getBoundingClientRect: () => rect(st.at) } : null) : sel === '.tbox.on' ? (st.tbox ? { getBoundingClientRect: () => rect([200, 300]) } : null) : null)
  };
  const pad = { classList: { contains: (c) => c === 'dim' && st.dim } };
  const document = { querySelector: (sel) => (sel === '#screen .tcol' ? col : sel === '#screen .keypad' ? pad : /^#screen \.key\[data-k="(\w+)"\]$/.test(sel) ? { click: () => taps.push(/data-k="(\w+)"/.exec(sel)[1]) } : null) };
  const window = {};
  const run = (js, args) => new Function('PC', 'document', 'window', 'return (function () { ' + js + ' }).apply(null, arguments[3]);').call(null, { engine: E }, document, window, args || []);
  return { run, taps, window, st };
}

test('dev/webkit/run.mjs, the kit v0.4: on take:lend and take:get the ringed small box’s number is typed on the page’s own keypad (the lend’s new number; the get’s new number as a number, right in either style), then OK, then the next box is waited for; a move-help instead is said', async () => {
  const { TAKE_JS } = await imp('dev/webkit/run.mjs');
  // 43 − 16 at its lend (the 4 tapped): 3, OK
  let p = movePage('Forty-three take away sixteen.', [120, 80], true);
  assert.equal(p.run(TAKE_JS.move, ['lend']), true);
  assert.deepEqual(p.window.__tk.keys, ['3', 'ok']);
  assert.deepEqual(p.window.__tk.mini, [120, 80], 'where the ringed box stood');
  for (let k = 0; k < 3; k++) assert.equal(p.run(TAKE_JS.key), true);
  assert.deepEqual(p.taps, ['3', 'ok'], 'one key a step, then nothing more');
  assert.equal(p.run(TAKE_JS.moveNext), 'pending', 'the same box still ringed: wait');
  p.st.at = [160, 80];
  assert.equal(p.run(TAKE_JS.moveNext), true, 'the get’s box ringed');
  // 43 − 16 at its get: 1, 3, OK (13: the new number on top; the little 1’s box takes it too); then the answer box
  p = movePage('Forty-three take away sixteen.', [160, 80], true);
  p.run(TAKE_JS.move, ['get']);
  assert.deepEqual(p.window.__tk.keys, ['1', '3', 'ok']);
  for (let k = 0; k < 3; k++) p.run(TAKE_JS.key);
  assert.deepEqual(p.taps, ['1', '3', 'ok']);
  p.st.at = null;
  assert.equal(p.run(TAKE_JS.moveNext), true, 'no small box ringed, the answer box outlined');
  // 503 − 278: its first lend is the square's (5 to 4), its first get the zero's (10)
  p = movePage('Five hundred three take away two hundred seventy-eight.', [80, 80], false);
  p.run(TAKE_JS.move, ['lend']); assert.deepEqual(p.window.__tk.keys, ['4', 'ok']);
  p.run(TAKE_JS.move, ['get']); assert.deepEqual(p.window.__tk.keys, ['1', '0', 'ok']);
  // a slip's help instead (the keypad dims for its reading time): said, not measured as the next move
  p = movePage('Forty-three take away sixteen.', [120, 80], false);
  p.run(TAKE_JS.move, ['lend']);
  p.st.dim = true;
  assert.match(p.run(TAKE_JS.moveNext), /^the number typed brought a move-help/);
  // what it refuses, and says
  assert.equal(movePage('Forty-three take away sixteen.', null, true).run(TAKE_JS.move, ['lend']), 'no ringed small box (.tmini.on) to type in');
  assert.match(movePage('43 − 16', [1, 1], false).run(TAKE_JS.move, ['lend']), /^the column’s aria-label does not say its problem in words/);
  assert.equal(movePage('Forty-seven take away sixteen.', [1, 1], false).run(TAKE_JS.move, ['lend']), '47 − 16 has no lend move');
  const failed = movePage('Forty-three take away sixteen.', [120, 80], false); failed.window.__tfail = true;
  assert.equal(failed.run(TAKE_JS.move, ['lend']), true, 'a screen that did not open types nothing');
  assert.equal(failed.run(TAKE_JS.moveNext), true);
  assert.deepEqual(failed.taps, []);
  assert.ok(!/speechSynthesis|readBtn/.test(TAKE_JS.move + TAKE_JS.moveNext), 'nothing that could sound');
});

/* ------------------------------------------------------------------ the measure */

test('dev/webkit/measure.js: on a take page (its frame’s data-mode, or a column in the screen) the column, the outlined box, the stack’s last balloon and the bar’s bottom at any scroll; nothing on any other page', () => {
  // (the page's own column, never a marks page picture's, .tpick; a marks page alone is measured too)
  assert.match(MEASURE, /var tcol = Array\.prototype\.filter\.call\(document\.querySelectorAll\('#screen \.tcol'\), function \(e\) \{ return !e\.closest\('\.tpick'\); \}\)\[0\] \|\| null;\n    var tpk = document\.querySelector\('#screen \.tpick'\);\n    if \(\(fr && fr\.getAttribute\('data-mode'\) === 'take'\) \|\| tcol \|\| \(tpk && shown\(tpk\)\)\) \{/);
  assert.match(MEASURE, /m\.tbar = bar && shown\(bar\) \? Math\.round\(bar\.getBoundingClientRect\(\)\.bottom\) : 0;/, 'the sticky bar’s bottom, scrolled or not');
  assert.match(MEASURE, /m\.tcol = tcol && shown\(tcol\) \? box\(tcol\) : null;/);
  assert.match(MEASURE, /\.tbox\.on'\); m\.tbox = tbx && shown\(tbx\) \? box\(tbx\) : null;/);
  // (and the stack's first balloon, `tsf`: chapter 12's review, 58 − 23 opened with it under the bar and its last in view)
  assert.match(MEASURE, /querySelectorAll\('#screen #stack \.sb, #screen \.stack \.sb'\), shown\); m\.tsb = sbs\.length \? box\(sbs\[sbs\.length - 1\]\) : null; m\.tsf = sbs\.length \? box\(sbs\[0\]\) : null;/);
  // the take keys sit outside both fingerprints, so every existing page's fp and pfp are what they were
  const keys = MEASURE.indexOf('    var tcol = '), fp = MEASURE.indexOf('// fingerprints');
  assert.ok(keys > 0 && keys < fp && !/m\.(t(col|box|sb|sf|bar|mini|tgt|slot|pick|one)|hx)\b/.test(MEASURE.slice(fp)), 'not read by the fingerprints (nor the kit v0.4’s keys, nor the markup’s hash)');
  assert.ok(MEASURE.indexOf('m.hx = ') > keys && MEASURE.indexOf('m.hx = ') < fp);
});

// chapter 13's review: the sweep's cat had no marks, so chapter 13's f036 and f039 were measured on the kit's marks page
// and no sweep reached the take columns with the moves (the two highs at 1080 x 720 passed pages/summary.md)
test('dev/webkit/measure.js __JSWEEP lessons: a Counts frame that opens on the marks page (a cat with no marks) is measured as it opens (@lesson), then with her marks picked (@lesson:column); her marks kept for the chapter\'s later take frames, taken back off the cat when the chapter changes and at the end', () => {
  const at = MEASURE.indexOf('  window.__JSWEEP = function'), src = MEASURE.slice(at, MEASURE.indexOf('\n  };\n', at) + 5);
  // (as the page does: a take frame's button opens its take page, the marks page first while she has no marks, and puts the
  // lesson in the slot; the same frame opened again then comes back as the take page itself, with no button)
  const cat = { name: 'Crystal' }, S = { frame: null, ch: null, open: false, slot: null }, TAKE = { 'c2:f2': 1, 'c2:f3': 1, 'c3:f5': 1 };
  const here = () => S.ch + ':' + S.frame, styled = () => !!(cat.takes && cat.takes.style);
  // (each page's own zero-delay call, its keypad or pictures brought into view after go()'s scroll to the top, marks the
  // page scrolled when it runs; the real timer only queues it)
  const queued = [], soon = () => window.setTimeout(((at) => () => { S.scrolled = at; })(here()), 0);
  const PC = { story: { c1: { frames: { f1: {} } }, c2: { frames: { f2: {}, f3: {}, f4: {} } }, c3: { frames: { f5: {} } } },
    debug: { goto: (f, ch) => { S.frame = f; S.ch = ch; S.open = S.slot === here(); S.scrolled = null; if (S.open) soon(); return f; }, cat: () => cat },
    engine: { setTakeStyle: (c, st) => { c.takes = Object.assign({}, c.takes, { style: st }); } } };
  const document = {
    querySelector: (sel) => (sel === '#screen .frame' ? { getAttribute: (k) => (k === 'data-kind' ? (S.open ? 'lesson' : 'counts') : null) }
      : sel === '#screen .tpick' ? (S.open && TAKE[here()] && !styled() ? {} : null)
        : sel === '#screen #tcol' ? (S.open && TAKE[here()] ? { hidden: !styled() } : null) : null),
    getElementById: (id) => (id === 'nextBtn' && !S.open ? { click: () => { S.open = true; if (TAKE[here()]) S.slot = here(); soon(); } } : null)
  };
  const window = { scrollTo: () => {}, setTimeout: (f) => { queued.push(f); return 1; }, __JM: (t) => ({ t, bad: [], style: cat.takes ? cat.takes.style : null, scrolled: S.scrolled === here() }) };
  const sweep = new Function('window', 'document', 'PC', src + '\nreturn window.__JSWEEP;')(window, document, PC);
  // the marks page and the column measured as she sees them (their zero-delay call run first); every other row as before,
  // its call left to the real timer
  assert.deepEqual(sweep('lessons').map((r) => r.t + ' ' + r.style + (r.scrolled ? ' scrolled' : '')), ['c1:f1@lesson null', 'c2:f2@lesson null scrolled',
    'c2:f2@lesson:column above scrolled', 'c2:f3@lesson above', 'c2:f4@lesson above', 'c3:f5@lesson null scrolled', 'c3:f5@lesson:column above scrolled']);
  assert.ok(queued.length >= 3, 'the other rows\' calls handed to the real timer (' + queued.length + ')');
  assert.ok(!('takes' in cat), 'her marks taken back off the cat');
  // a cat with take data of her own gets it back as it was
  cat.takes = { log: [1], style: null };
  sweep('lessons');
  assert.deepEqual(cat.takes, { log: [1], style: null });
  // the sweep names an off-screen control on the column row as it does on a keypad's
  assert.match(fs.readFileSync(T('tools/sweep.mjs'), 'utf8'), /\/@lesson\(:column\)\?\$\/\.test\(at\) \? 'off-screen-keypad'/);
});

/* A stand-in page for the measure's kit v0.4 records (no DOM library: the few calls measure.js makes). `spec` is a tree of
 * { tag, cls, id, attrs, text, b (its box), ink (its lettering's box, a Range's), fs, oh (offsetHeight), cs, hidden, kids }. */
function standIn(spec) {
  const all = [];
  const simple = (e, sel) => {
    const m = /^([a-z]+|\*)?((?:\.[\w-]+|#[\w-]+|\[[^\]]+\])*)$/.exec(sel);
    if (!m) throw new Error('the stand-in cannot read ' + sel);
    if (m[1] && m[1] !== '*' && e.tagName !== m[1].toUpperCase()) return false;
    return (m[2].match(/\.[\w-]+|#[\w-]+|\[[^\]]+\]/g) || []).every((t) => {
      if (t[0] === '.') return (' ' + e.className + ' ').includes(' ' + t.slice(1) + ' ');
      if (t[0] === '#') return e.id === t.slice(1);
      const a = /^\[([\w-]+)(?:(\*?=)"([^"]*)")?\]$/.exec(t), v = e.getAttribute(a[1]);
      return !a[2] ? v != null : a[2] === '=' ? v === a[3] : v != null && String(v).includes(a[3]);
    });
  };
  const one = (e, sel) => {
    const parts = sel.trim().split(/\s+/);
    if (!simple(e, parts.pop())) return false;
    let a = e.parentElement;
    while (parts.length && a) { if (simple(a, parts[parts.length - 1])) parts.pop(); a = a.parentElement; }
    return !parts.length;
  };
  const within = (x, root) => { for (let a = x.parentElement; a; a = a.parentElement) if (a === root) return true; return false; };
  const rect = (b) => ({ left: b[0], top: b[1], right: b[2], bottom: b[3], width: b[2] - b[0], height: b[3] - b[1] });
  function make(o, parent) {
    const e = {
      tagName: (o.tag || 'span').toUpperCase(), className: o.cls || '', id: o.id || '', hidden: !!o.hidden, parentElement: parent, _o: o,
      getAttribute: (k) => (k === 'class' ? e.className : o.attrs && o.attrs[k] != null ? String(o.attrs[k]) : null),
      hasAttribute: (k) => e.getAttribute(k) != null,
      getBoundingClientRect: () => rect(o.b || [0, 0, 0, 0]),
      getClientRects: () => (o.b ? [rect(o.b)] : []),
      get textContent() { return (o.text || '') + e.children.map((c) => c.textContent).join(''); },
      get offsetHeight() { return o.oh != null ? o.oh : o.b ? o.b[3] - o.b[1] : 0; },
      matches: (sel) => sel.split(',').some((x) => one(e, x)),
      closest: (sel) => { for (let a = e; a; a = a.parentElement) if (a.matches(sel)) return a; return null; },
      querySelectorAll: (sel) => all.filter((x) => within(x, e) && x.matches(sel)),
      querySelector: (sel) => e.querySelectorAll(sel)[0] || null
    };
    all.push(e);
    e.children = (o.kids || []).map((k) => make(k, e));
    return e;
  }
  const root = make(spec, null);
  // (an element's own `text` is its one text node, inked at its `ink`; a tree walker over a root's text nodes, in order)
  const textOf = (e) => ({ nodeValue: e._o.text, parentElement: e, _o: { ink: e._o.ink || e._o.b } });
  const document = {
    querySelectorAll: (sel) => all.filter((x) => x.matches(sel)), querySelector: (sel) => document.querySelectorAll(sel)[0] || null,
    createRange: () => { let n = null; return { selectNodeContents: (e) => { n = e; }, getBoundingClientRect: () => rect(n._o.ink || n._o.b || [0, 0, 0, 0]) }; },
    createTreeWalker: (r) => { const list = [r].concat(r.querySelectorAll('*')).filter((x) => x._o.text).map(textOf); let i = 0; return { nextNode: () => list[i++] || null }; }
  };
  const getComputedStyle = (e) => Object.assign({ display: 'inline', visibility: 'visible', pointerEvents: 'auto', fontSize: (e._o.fs || 16) + 'px' }, e._o.cs || {});
  // measure.js's helpers and its takeMoves, as written (between its first helper and window.__JM)
  const src = MEASURE.slice(MEASURE.indexOf('  function box(e)'), MEASURE.indexOf('  window.__JM = function'));
  const takeMoves = new Function('document', 'getComputedStyle', 'NodeFilter', src + '\nreturn takeMoves;')(document, getComputedStyle, { SHOW_TEXT: 4 });
  return { root, document, takeMoves, find: (sel) => document.querySelector(sel) };
}
// 43 − 16 in 'one' at its get: the tens struck with its gold 3 over it, the little 1's box ringed before the ones' 3; a lend
// box resting in the marks row; the rows' target live and the squares' hidden; the slot's balloon in the stack
const COLUMN = { id: 'screen', b: [0, 0, 1080, 720], kids: [{ cls: 'frame', attrs: { 'data-mode': 'take' }, b: [0, 0, 1080, 720], kids: [
  { cls: 'tcol', id: 'tcol', b: [60, 40, 260, 260], kids: [
    { cls: 'tsign', text: '−', b: [60, 140, 90, 180] },
    { cls: 'thead', b: [100, 40, 140, 60], kids: [{ tag: 'svg', b: [100, 40, 140, 60] }] }, { cls: 'thead', b: [150, 40, 190, 60], kids: [{ tag: 'svg', b: [150, 40, 190, 60] }] },
    { cls: 'tmark', text: '3', b: [100, 62, 140, 92], ink: [112, 64, 128, 92] }, { cls: 'tmark', text: '', b: [150, 62, 190, 92] },
    { cls: 'tmini', b: [104, 64, 136, 92] },
    { cls: 'tdig ttop tstruck', text: '4', b: [100, 95, 140, 145], ink: [110, 95, 130, 145] }, { cls: 'tdig ttop', text: '3', b: [150, 95, 190, 145], ink: [162, 95, 178, 145] },
    { cls: 'tmini on', b: [146, 100, 161, 122] },
    { cls: 'tdig tbot', text: '1', b: [100, 150, 140, 200] }, { cls: 'tdig tbot', text: '6', b: [150, 150, 190, 200] },
    { cls: 'tbox', text: ' ', b: [100, 210, 140, 255] }, { cls: 'tbox', text: ' ', b: [150, 210, 190, 255] }, { cls: 'trule', b: [60, 205, 260, 208] },
    { attrs: { role: 'button', tabindex: '0', 'aria-label': 'Spread a row' }, b: [95, 40, 170, 205] },
    { attrs: { role: 'button', tabindex: '0', 'aria-label': 'Spread a square' }, hidden: true, b: [40, 40, 95, 205] }] },
  { id: 'stack', b: [300, 40, 600, 180], kids: [{ cls: 'sb', b: [300, 40, 600, 100] }, { cls: 'sb tslot', b: [300, 110, 600, 170] }] }] }] };
// the marks page: two picture buttons, the left 43 − 16 done in 'one' (its little 1 `little`), the right in 'above'
const PICK = (little, more) => ({ id: 'screen', b: [0, 0, 1080, 720], kids: [{ cls: 'tpick', b: [40, 100, 700, 400], kids: [
  { tag: 'button', attrs: Object.assign({ 'data-style': 'one' }, more), b: [40, 100, 360, 400], kids: [{ cls: 'tcol', b: [60, 110, 340, 330], kids: [
    { cls: 'tdig ttop tstruck', text: '4', b: [100, 150, 140, 200] }, { cls: 'tdig ttop', text: '3', b: [150, 150, 190, 200] },
    { cls: 'tdig tbot', text: '1', b: [100, 205, 140, 255] }, { cls: 'tdig tbot', text: '6', b: [150, 205, 190, 255] }].concat(little ? [little] : []) },
    { cls: 'tlabel', text: 'A little 1 in front', b: [60, 340, 340, 390] }] },
  { tag: 'button', attrs: { 'data-style': 'above' }, b: [380, 100, 700, 400], kids: [{ cls: 'tlabel', text: 'The new number on top', b: [400, 340, 680, 390] }] }] }] });

test('dev/webkit/measure.js, the kit v0.4 (on a stand-in page): every small box (ringed or not; a front box with its own digit and the neighbour’s mark), the tap targets’ hit boxes (live or not), the slot’s balloon; the marks page and its little 1’s size as drawn', () => {
  let d = standIn(COLUMN), m = {};
  d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m.tmini, [{ b: [104, 64, 136, 92], on: 0 }, { b: [146, 100, 161, 122], on: 1, front: 1, own: [162, 95, 178, 145], nb: [112, 64, 128, 92] }],
    'the marks row’s box is no front box; the ringed one stands in the top row: its own digit the 3’s ink, its neighbour’s mark the tens’ gold 3');
  assert.deepEqual(m.ttgt, [{ b: [95, 40, 170, 205], live: 1, n: 'Spread a row' }, { b: [40, 40, 95, 205], live: 0, n: 'Spread a square' }]);
  assert.deepEqual(m.tslot, [300, 110, 600, 170]);
  assert.ok(!('tpick' in m) && !('tone' in m), 'no marks page here');
  // a front box said so by its class, wherever it stands (811's tens in 'one': before its gold 0, in the marks row)
  const front = JSON.parse(JSON.stringify(COLUMN));
  front.kids[0].kids[0].kids[5] = { cls: 'tmini tfront on', b: [96, 66, 108, 90] };
  d = standIn(front); m = {};
  d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m.tmini[0], { b: [96, 66, 108, 90], on: 1, front: 1, own: [112, 64, 128, 92], nb: null }, 'its own: the gold mark beside it; no mark to its left');
  // the page's own markup (app/ui.js's takeCellHtml): the front box in a .tfront wrapper inside the digit's cell, its own digit
  // the cell's lettering outside it; in the marks row (811's tens, 'one': a little 1 boxed before its gold 0), the gold number
  const cells = JSON.parse(JSON.stringify(COLUMN)), kids = cells.kids[0].kids[0].kids;
  kids.splice(8, 1);   // (the loose ringed box)
  kids[7] = { cls: 'tdig ttop', text: '3', b: [150, 95, 190, 145], ink: [162, 95, 178, 145], kids: [{ cls: 'tfront tfb', b: [146, 100, 161, 122], kids: [{ cls: 'tmini tw2 on', text: '\u00a0', b: [146, 100, 161, 122] }] }] };
  kids[5] = { cls: 'tmark tbx', b: [100, 62, 140, 92], kids: [{ cls: 'tfront tin tfb', b: [96, 66, 108, 90], kids: [{ cls: 'tmini', text: '\u00a0', b: [96, 66, 108, 90] }] }, { cls: 'tmv', text: '0', b: [110, 64, 130, 92], ink: [113, 64, 127, 92] }] };
  kids[3] = { cls: 'tmark', b: [40, 62, 90, 92], kids: [{ cls: 'tmv', text: '7', b: [44, 64, 70, 92], ink: [50, 64, 66, 92] }] };
  d = standIn(cells); m = {};
  d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m.tmini, [{ b: [96, 66, 108, 90], on: 0, front: 1, own: [113, 64, 127, 92], nb: [50, 64, 66, 92] }, { b: [146, 100, 161, 122], on: 1, front: 1, own: [162, 95, 178, 145], nb: [113, 64, 127, 92] }],
    'each front box’s own lettering is its cell’s outside the box; its neighbour’s mark the nearest gold number to its left');
  // a target's liveness: aria-disabled, tabindex -1, pointer-events none
  const off = JSON.parse(JSON.stringify(COLUMN)), tg = off.kids[0].kids[0].kids;
  tg[14].attrs['aria-disabled'] = 'true'; tg[15].hidden = false; tg[15].attrs.tabindex = '-1';
  d = standIn(off); m = {}; d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m.ttgt.map((t) => t.live), [0, 0]);
  tg[14].attrs['aria-disabled'] = 'false'; tg[14].cs = { pointerEvents: 'none' };
  d = standIn(off); m = {}; d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m.ttgt.map((t) => t.live), [0, 0]);
  // a column with none of these (chapter 12's): no key at all
  const v3 = JSON.parse(JSON.stringify(COLUMN));
  v3.kids[0].kids[0].kids = v3.kids[0].kids[0].kids.filter((k) => !/tmini/.test(k.cls || '') && !(k.attrs && k.attrs.role));
  v3.kids[0].kids[1].kids.pop();
  d = standIn(v3); m = {}; d.takeMoves(m, d.find('#screen .tcol'));
  assert.deepEqual(m, {});
  // the marks page: the little 1 by its class; else the lone 1 that is no digit (16's 1 is the bottom's); its size as drawn
  d = standIn(PICK({ cls: 'tfront', text: '1', fs: 20, b: [138, 150, 150, 172] })); m = {}; d.takeMoves(m, null);
  assert.deepEqual(m, { tpick: [40, 100, 700, 400], tone: { b: [138, 150, 150, 172], fs: 20 } });
  d = standIn(PICK({ cls: 'tmk', text: '1', fs: 14, b: [138, 150, 150, 168] })); m = {}; d.takeMoves(m, null);
  assert.deepEqual(m.tone, { b: [138, 150, 150, 168], fs: 14 });
  d = standIn(PICK({ cls: 'tfront', text: '1', fs: 20, b: [138, 150, 150, 160], oh: 20 })); m = {}; d.takeMoves(m, null);
  assert.equal(m.tone.fs, 10, 'drawn at half size (a transform): what she sees');
  d = standIn(PICK(null)); m = {}; d.takeMoves(m, null);
  assert.equal(m.tone, null, 'none found: said as such (marks-small)');
  // (the 'one' picture found by its words when it has no data-style)
  const words = PICK({ cls: 'tfront', text: '1', fs: 18, b: [138, 150, 150, 168] });
  delete words.kids[0].kids[0].attrs['data-style'];
  words.kids[0].kids.reverse();
  d = standIn(words); m = {}; d.takeMoves(m, null);
  assert.equal(m.tone.fs, 18);
});

/* ------------------------------------------------------------------ the sweep */

const ROW = (t, more) => Object.assign({ t, vw: more && more.vw || 1080, vh: 720, sw: more && more.vw || 1080, sy: 0, bad: [], spill: [], broken: [], errs: 0, said: 0, read: false, silent: true, fp: 'a', pfp: 'b' }, more);
const TAKE = (t, more) => ROW(t, Object.assign({ take: true, tbar: 48, tcol: [40, 60, 300, 220], tbox: [240, 170, 290, 215], tsb: [40, 240, 500, 300], kp: [40, 420, 400, 700] }, more));

test('sweep.mjs col-off: a take page’s column, outlined box and stack’s last balloon wholly between the bar’s bottom and the viewport’s, or what is off', async () => {
  const { colOff } = await imp('tools/sweep.mjs');
  assert.deepEqual(colOff(TAKE('take:q')), [], 'all on the screen');
  assert.deepEqual(colOff(ROW('ch05:f010')), [], 'not a take page: nothing');
  assert.deepEqual(colOff(ROW('ch05:f010', { kp: [1, 2, 3, 900] })), [], 'a lesson’s keypad is the controls’ business');
  assert.deepEqual(colOff(TAKE('take:q', { tcol: [40, 30, 300, 190] })), ['the column 30-190: 18px under the bar']);
  assert.deepEqual(colOff(TAKE('take:q', { sy: 120, tbar: 48, tbox: [240, 700, 290, 745] })), ['the outlined box 700-745: 25px below the fold']);
  assert.deepEqual(colOff(TAKE('take:q', { tsb: [-20, 240, 500, 300] })), ['the stack’s last balloon 240-300: off the screen sideways']);
  assert.deepEqual(colOff(TAKE('take:q', { tcol: null, tbox: null })), ['no column (.tcol) shown on the take page']);
  assert.deepEqual(colOff(TAKE('take:done', { tbox: null, tsb: null })), [], 'no box outlined at a problem’s end, and no balloon: fine');
  assert.deepEqual(colOff(TAKE('take:q', { tbar: 0, tcol: [40, 0, 300, 160] })), [], 'no bar: the viewport’s top');
  // the stack's first balloon too (chapter 12's review: 58 − 23's “Now you try” under the bar, its last balloon on the screen);
  // a one-balloon stack, its first its last, said once
  assert.deepEqual(colOff(TAKE('take:first', { sy: 117, tsf: [40, -47, 500, 75], tsb: [40, 80, 500, 200] })), ['the stack’s first balloon -47-75: 95px under the bar']);
  assert.deepEqual(colOff(TAKE('take:q', { tsf: [40, 240, 500, 300] })), [], 'one balloon, on the screen');
  assert.deepEqual(colOff(TAKE('take:q', { tsf: [-20, 240, 500, 300], tsb: [-20, 240, 500, 300] })), ['the stack’s last balloon 240-300: off the screen sideways'], 'one balloon off: said once');
});

test('sweep.mjs: a take page’s problems in the summary (col-off, keypad-moved at a column and the next); the screens group measures the take screens; --takes their own folder at the four more sizes', async () => {
  const { summarize, keypadMoved } = await imp('tools/sweep.mjs');
  assert.equal(keypadMoved(TAKE('take:q'), TAKE('take:q@next')), null);
  assert.equal(keypadMoved(TAKE('take:q'), TAKE('take:q@next', { kp: [40, 428, 400, 708] })), 'the keypad moved from 420-700 (x 40-400) to 428-708 (x 40-400) between one column and the next');
  assert.equal(keypadMoved(TAKE('take:q', { kp: undefined }), TAKE('take:q@next')), 'no keypad at the first column');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-pages-'));
  try {
    fs.writeFileSync(path.join(d, '844x390-aa1-takes.json'), JSON.stringify({ size: [844, 390], big: true, jobs: [
      { name: 'takes', big: true, notes: [], ms: [TAKE('take:first', { vw: 844, vh: 390, tsb: [430, 300, 830, 420] })] },
      { name: 'takes', big: true, notes: [], ms: [TAKE('take:q', { vw: 844, vh: 390, kp: [10, 150, 400, 380] }), TAKE('take:q@next', { vw: 844, vh: 390, kp: [10, 162, 400, 392] })] },
      { name: 'takes', big: true, notes: [], ms: [TAKE('take:echo', { vw: 844, vh: 390, kp: [10, 150, 400, 380] }), TAKE('take:echo@next', { vw: 844, vh: 390, kp: [10, 150, 400, 380] })] },
      { name: 'takes', big: true, notes: ['step 14: no take-aways in this build (PC.debug.takes)'] }] }));
    const s = summarize(d, ['844x390']);
    assert.deepEqual(s.sizes, ['844x390']);
    assert.equal(s.measured, 5);
    assert.deepEqual(s.counts, { 'col-off': 1, 'keypad-moved': 1, 'page-error': 1 });
    assert.deepEqual(s.problems.filter((p) => p.kind === 'col-off').map((p) => p.at + ': ' + p.detail), ['take:first: the stack’s last balloon 300-420: 30px below the fold']);
    assert.deepEqual(s.problems.filter((p) => p.kind === 'keypad-moved').map((p) => p.at + ': ' + p.detail), ['take:q: the keypad moved from 150-380 (x 10-400) to 162-392 (x 10-400) between one column and the next'], 'take:echo’s keypad stayed put');
    assert.deepEqual(s.problems.filter((p) => p.kind === 'page-error').map((p) => p.detail), ['step 14: no take-aways in this build (PC.debug.takes)']);
    assert.equal(s.skipped, undefined, 'nothing skipped: every take screen is built');
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
  // (and chapter 12's Spanish screens, run.mjs's `spanish` job, in both: chapter 12's review, the echo page's Next under the
  // screen seen by no sweep)
  assert.match(SWEEP, /\['screens', \['screens', 'warrior', 'takes', 'spanish'\]\]/, 'the take and Spanish screens in --pages’ screens group, at its four sizes');
  assert.match(SWEEP, /const TAKES_RUN = \{ sub: 'takes', sizes: TAKE_SIZES, groups: \[\['takes', \['takes', 'spanish'\]\]\]/);
  assert.match(SWEEP, /const odir = await ensure\(o, Object\.assign\(\{\}, want, \{ takes: false, takesCompare: !!want\.takes \}\)/, 'a compare measures only what it holds byte for byte on the other tree (TAKE_COMPARED), and only with --takes');
});

test('sweep.mjs, the kit v0.4: col-off’s small boxes (out of the column, meeting the stack’s last balloon, a front box nearer the neighbour’s mark than its own digit) and the slot’s balloon; hit-small; marks-small; the marks page is no column-less take page', async () => {
  const { colOff, hitSmall, marksSmall, boxGap } = await imp('tools/sweep.mjs');
  // the stand-in column above, measured: clean
  const d = standIn(COLUMN), m = {};
  d.takeMoves(m, d.find('#screen .tcol'));
  const row = TAKE('take:get:one', Object.assign({ tbar: 30, tcol: [60, 40, 260, 260], tbox: null, tsb: [300, 40, 600, 100] }, m));
  assert.deepEqual(colOff(row), []);
  assert.deepEqual(hitSmall(row), []);
  assert.deepEqual(marksSmall(row), [], 'no marks page');
  assert.equal(boxGap([0, 0, 10, 10], [13, 14, 20, 20]), 5);
  assert.equal(boxGap([0, 0, 10, 10], [5, 5, 20, 20]), 0);
  // a small box out of the column (above its top edge, towards the stack), one meeting the stack's last balloon
  const out = (tmini, more) => colOff(TAKE('take:lend', Object.assign({ tbar: 30, tcol: [60, 40, 260, 260], tbox: null, tsb: [300, 40, 600, 100], tmini }, more)));
  assert.deepEqual(out([{ b: [104, 30, 136, 58], on: 1 }]), ['the small box (ringed) 104,30-136,58: out of the column (10px above)']);
  assert.deepEqual(out([{ b: [250, 64, 272, 92], on: 0 }]), ['the small box 250,64-272,92: out of the column (12px right)']);
  assert.deepEqual(out([{ b: [104, 64, 136, 92], on: 1 }], { tcol: [60, 40, 400, 260], tsb: [120, 80, 500, 140] }), ['the small box (ringed) 104,64-136,92: meets the stack’s last balloon 80-140']);
  assert.deepEqual(out([{ b: [104, 64, 136, 92], on: 1 }], { tsb: [136, 40, 500, 64] }), [], 'touching is not meeting');
  // a front box nearer the neighbour's mark than its own digit (at 844 x 390 a floor of 16 px filled the whole gap)
  assert.deepEqual(out([{ b: [128, 100, 146, 122], on: 1, front: 1, own: [162, 95, 178, 145], nb: [112, 64, 128, 92] }]), ['the front box (ringed) 128,100-146,122: nearer the neighbour’s mark (8px) than its own digit (16px)']);
  assert.deepEqual(out([{ b: [146, 100, 161, 122], on: 1, front: 1, own: [162, 95, 178, 145], nb: null }]), [], 'no neighbour’s mark (the leftmost): nothing to be nearer');
  // the slot's balloon: said when it is off the screen and not the stack's last (said once)
  assert.deepEqual(colOff(TAKE('take:help:move', { tsb: [40, 240, 500, 300], tslot: [40, 240, 500, 300], vh: 720 })), []);
  assert.deepEqual(colOff(TAKE('take:help:move', { tsb: [40, 640, 500, 760], tslot: [40, 640, 500, 760] })), ['the stack’s last balloon 640-760: 40px below the fold'], 'said once');
  assert.deepEqual(colOff(TAKE('take:help:move', { tslot: [40, 700, 500, 780] })), ['the slot’s balloon 700-780: 60px below the fold']);
  // the marks page: no column in its place is right (pictures there), its balloons still checked; the Hollow's too
  assert.deepEqual(colOff(TAKE('take:marks', { tcol: null, tbox: null, tpick: [40, 100, 700, 400], tone: { b: [1, 1, 2, 2], fs: 20 } })), []);
  assert.deepEqual(colOff(ROW('hollow:marks', { tpick: [40, 100, 700, 400], tsb: [40, 700, 500, 760] })), ['the stack’s last balloon 700-760: 40px below the fold']);
  // hit-small: a live target under 44 x 44 (844 x 390 before widening: 37 x 79); a target not live is no target
  assert.deepEqual(hitSmall(ROW('take:touch', { ttgt: [{ b: [10, 40, 47, 119], live: 1, n: 'Spread a row' }, { b: [47, 40, 60, 60], live: 0, n: 'Spread a square' }] })), ['“Spread a row” 37 x 79 at 10,40: under 44 x 44']);
  assert.deepEqual(hitSmall(ROW('take:touch', { ttgt: [{ b: [3, 40, 47, 119], live: 1 }, { b: [0, 0, 60, 43], live: 1 }] })), ['a target 60 x 43 at 0,0: under 44 x 44']);
  assert.deepEqual(hitSmall(ROW('ch05:f010')), []);
  // marks-small: the little 1 under 16 px, or not found on a marks page
  assert.deepEqual(marksSmall(ROW('take:marks', { tpick: [0, 0, 9, 9], tone: { b: [0, 0, 9, 9], fs: 15.5 } })), ['the little 1 is 15.5px: under 16px']);
  assert.deepEqual(marksSmall(ROW('take:marks', { tpick: [0, 0, 9, 9], tone: { b: [0, 0, 9, 9], fs: 16 } })), []);
  assert.match(marksSmall(ROW('hollow:marks', { tpick: [0, 0, 9, 9], tone: null }))[0], /^no little 1 found/);
  assert.deepEqual(marksSmall(ROW('take:q', { tone: { fs: 3 } })), [], 'only on a marks page');
});

test('sweep.mjs, the kit v0.4: the summary counts hit-small and marks-small, and keypad-moved between one move and the next (take:lend, take:get)', async () => {
  const { summarize, keypadMoved } = await imp('tools/sweep.mjs');
  assert.equal(keypadMoved(TAKE('take:lend'), TAKE('take:lend@next', { kp: [40, 421, 400, 701] }), 'move'), 'the keypad moved from 420-700 (x 40-400) to 421-701 (x 40-400) between one move and the next');
  assert.equal(keypadMoved(TAKE('take:get', { kp: undefined }), TAKE('take:get@next'), 'move'), 'no keypad at the first move');
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-pages4-'));
  try {
    fs.writeFileSync(path.join(d, '844x390-aa0-takes.json'), JSON.stringify({ size: [844, 390], big: false, jobs: [
      { name: 'takes', big: false, notes: [], ms: [TAKE('take:lend', { vw: 844, vh: 390, kp: [10, 150, 400, 380] }), TAKE('take:lend@next', { vw: 844, vh: 390, kp: [10, 151, 400, 381] })] },
      { name: 'takes', big: false, notes: [], ms: [TAKE('take:get', { vw: 844, vh: 390, kp: [10, 150, 400, 380] }), TAKE('take:get@next', { vw: 844, vh: 390, kp: [10, 150, 400, 380] })] },
      { name: 'takes', big: false, notes: [], ms: [TAKE('take:touch', { vw: 844, vh: 390, kp: [10, 150, 400, 380], ttgt: [{ b: [10, 40, 47, 119], live: 1, n: 'Spread a row' }] })] },
      { name: 'takes', big: false, notes: [], ms: [TAKE('take:marks', { vw: 844, vh: 390, tcol: null, tbox: null, tpick: [10, 60, 830, 380], tone: { b: [1, 1, 9, 9], fs: 12 } })] }] }));
    const s = summarize(d, ['844x390']);
    assert.deepEqual(s.counts, { 'keypad-moved': 1, 'hit-small': 1, 'marks-small': 1 });
    assert.deepEqual(s.problems.map((p) => p.kind + ' ' + p.at + ': ' + p.detail), [
      'keypad-moved take:lend: the keypad moved from 150-380 (x 10-400) to 151-381 (x 10-400) between one move and the next',
      'hit-small take:touch: “Spread a row” 37 x 79 at 10,40: under 44 x 44',
      'marks-small take:marks: the little 1 is 12px: under 16px']);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

/* Two caches for the takes compare: this tree's takes/ and the other's takes-compare/ (or takes/), each { tag: row }. */
function takeCaches(here, there, sub) {
  const mk = (rows, folder) => {
    const c = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-cmp-'));
    fs.mkdirSync(path.join(c, folder), { recursive: true });
    fs.writeFileSync(path.join(c, folder, '1080x700-aa1-takes.json'), JSON.stringify({ size: [1080, 700], big: true, jobs: [{ name: 'takes', big: true, notes: [], ms: Object.entries(rows).map(([t, r]) => Object.assign(ROW(t), r)) }] }));
    fs.writeFileSync(path.join(c, folder, 'summary.json'), '{}');
    return c;
  };
  return [mk(here, 'takes'), mk(there, sub || 'takes-compare')];
}

test('sweep.mjs --takes --compare: what a chapter-12-only player sees of the kit (take:first, the shelf, a store round and chapter 12’s eight Spanish screens) byte for byte against the other tree: its boxes and its markup, the rest of the kit’s screens not held', async () => {
  const { compareCaches } = await imp('tools/sweep.mjs');
  const { TAKE_COMPARED, ES_SCREENS } = await imp('dev/webkit/run.mjs');
  assert.deepEqual(TAKE_COMPARED, ['take:first', 'hollow:shelf', 'store:q'].concat(ES_SCREENS.filter((t) => /^es:/.test(t))), 'the plan’s L6: take:first, the shelf (no My marks for her), a store round and PC.debug.spanish’s eight');
  const same = { fp: 'f', pfp: 'p', hx: 'h' };
  const [a, b] = takeCaches({ 'take:first': same, 'es:echo': same, 'es:take': Object.assign({}, same, { fp: 'moved' }), 'es:skip': Object.assign({}, same, { hx: 'new markup' }), 'es:worked': same, 'take:touch': { fp: 'new' } },
    { 'take:first': same, 'es:echo': same, 'es:take': same, 'es:skip': same, 'es:try': same });
  try {
    const c = compareCaches(a, b);
    assert.equal(c.art, null); assert.equal(c.pages, null);
    assert.deepEqual(c.takes, { screens: TAKE_COMPARED, against: path.join(b, 'takes-compare'), rows: 5, same: 2, boxesMoved: ['1080x700 on es:take'], markupChanged: ['1080x700 on es:skip'], onlyHere: ['1080x700 on es:worked'], onlyThere: ['1080x700 on es:try'] },
      'take:touch (v0.4’s own) is not held to anything');
  } finally { for (const x of [a, b]) fs.rmSync(x, { recursive: true, force: true }); }
  // the other tree's full takes/ serves when it has one; with neither, nothing is compared
  const [a2, b2] = takeCaches({ 'take:first': same }, { 'take:first': same }, 'takes');
  try {
    assert.equal(compareCaches(a2, b2).takes.same, 1);
    fs.rmSync(path.join(b2, 'takes'), { recursive: true, force: true });
    assert.equal(compareCaches(a2, b2).takes, null);
  } finally { for (const x of [a2, b2]) fs.rmSync(x, { recursive: true, force: true }); }
  // wired: the other tree measured for TAKE_COMPARED alone, in takes-compare/, unless its takes/ is there
  assert.match(SWEEP, /const TAKES_COMPARE_RUN = \{ sub: 'takes-compare', sizes: TAKE_SIZES, groups: \[\['takes', \['takes', 'spanish'\]\]\], screens: \{ takeScreens: TAKE_COMPARED\.filter\(\(t\) => !\/\^es:\/\.test\(t\)\), esScreens: TAKE_COMPARED\.filter\(\(t\) => \/\^es:\/\.test\(t\)\) \},/);
  assert.match(SWEEP, /takesCompare: !!want\.takesCompare && !status\(dir\)\.takes && !existsSync\(join\(dir, 'takes-compare\/summary\.json'\)\)/);
});

test('sweep.mjs --takes --compare on two trees with no take screens: the other tree measured for TAKE_COMPARED alone (its takes-compare/; nothing to run, no WebKit), and the compare said', async () => {
  const { cacheKey } = await imp('tools/sweep.mjs');
  const cache = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-cache-')), locks = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-lock-'));
  const tree = (n) => {
    const t = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-tree-'));
    for (const f of ['index.html', 'app/engine.js']) { fs.mkdirSync(path.dirname(path.join(t, f)), { recursive: true }); fs.copyFileSync(T(f), path.join(t, f)); }
    fs.mkdirSync(path.join(t, 'tools'));
    fs.writeFileSync(path.join(t, 'tools/shots.mjs'), SHOTS.replace('const TAKES = `', 'const TAKES_NOT = `').replace('const SPANISH = `', 'const SPANISH_NOT = `') + '\n// tree ' + n + '\n');
    return t;
  };
  const t1 = tree(1), t2 = tree(2);
  try {
    const r = node([T('tools/sweep.mjs'), '--takes', '--root', t1, '--compare', t2], { PC_CACHE_DIR: cache, PC_LOCK_DIR: locks });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    assert.match(r.stdout, /\ntakes: 0 measured at 1080x700, 1024x768, 768x1024, 844x390; problems: none \(takes\/summary\.md\)/);
    assert.match(r.stdout, /\ntakes-compare: 0 measured at 1080x700, 1024x768, 768x1024, 844x390; problems: none \(takes-compare\/summary\.md\)/);
    assert.ok(r.stdout.includes('takes against ' + t2 + ' (take:first, the shelf, a store round and chapter 12\'s eight Spanish screens): 0 of 0 byte for byte; boxes moved on 0, markup changed on 0; only here 0, only there 0'), r.stdout);
    const d1 = path.join(cache, cacheKey(t1)), d2 = path.join(cache, cacheKey(t2));
    assert.equal(fs.readdirSync(path.join(d2, 'takes-compare')).filter((f) => f.endsWith('-takes.json')).length, 8, 'a record a size and an Aa');
    assert.ok(!fs.existsSync(path.join(d2, 'takes')) && !fs.existsSync(path.join(d2, 'pages')) && !fs.existsSync(path.join(d2, 'art')), 'the other tree: TAKE_COMPARED alone');
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(d1, 'compare-' + cacheKey(t2) + '.json'), 'utf8')).takes.rows, 0);
  } finally { for (const x of [cache, locks, t1, t2]) fs.rmSync(x, { recursive: true, force: true }); }
});

test('sweep.mjs --path names the take screens’ summary once it is there; --takes on a tree with no take screens runs nothing and says so', async () => {
  const { cacheKey } = await imp('tools/sweep.mjs');
  const cache = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-cache-'));
  try {
    const dir = path.join(cache, cacheKey(ROOT));
    fs.mkdirSync(path.join(dir, 'takes'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'takes/summary.json'), '{}');
    const r = node([T('tools/sweep.mjs'), '--path'], { PC_CACHE_DIR: cache });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stdout.trim().split('\n')[1], 'art: not built; pages: not built; takes: ready (' + path.join(dir, 'takes/summary.md') + ')');
    // a tree whose shots.mjs has no take screens (nor chapter 12's Spanish ones, which --takes measures too since chapter
    // 12's review): the run is empty, its summary says none were measured, no WebKit ran
    const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-tree-'));
    for (const f of ['index.html', 'app/engine.js']) { fs.mkdirSync(path.dirname(path.join(tree, f)), { recursive: true }); fs.copyFileSync(T(f), path.join(tree, f)); }
    fs.mkdirSync(path.join(tree, 'tools'));
    fs.writeFileSync(path.join(tree, 'tools/shots.mjs'), SHOTS.replace('const TAKES = `', 'const TAKES_NOT = `').replace('const SPANISH = `', 'const SPANISH_NOT = `'));
    const locks = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-takes-tools-lock-'));
    const t = node([T('tools/sweep.mjs'), '--takes', '--root', tree], { PC_CACHE_DIR: cache, PC_LOCK_DIR: locks });
    fs.rmSync(locks, { recursive: true, force: true });
    assert.equal(t.status, 0, t.stderr + t.stdout);
    assert.match(t.stdout, /takes: 0 measured at 1080x700, 1024x768, 768x1024, 844x390; problems: none \(takes\/summary\.md\)/);
    const tdir = path.join(cache, cacheKey(tree));
    assert.deepEqual(fs.readdirSync(path.join(tdir, 'takes')).filter((f) => f.endsWith('-takes.json')).length, 8, 'a record a size and an Aa');
    assert.ok(!fs.existsSync(path.join(tdir, 'pages')) && !fs.existsSync(path.join(tdir, 'art')), '--takes alone: neither the art nor the pages');
    fs.rmSync(tree, { recursive: true, force: true });
  } finally { fs.rmSync(cache, { recursive: true, force: true }); }
});

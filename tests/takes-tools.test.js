/* The take-aways kit's tools (docs/take-aways.md v0.3, sections 6, 8 and 9: test file `takes-tools`): the storyboard's
 * words for a take frame and for the store under a book page, the Safari tool's take targets (tools/shots.mjs, through the
 * page's PC.debug.takes), the WebKit tool's `takes` job (dev/webkit/run.mjs: the gate's screens, the keypad checked at a
 * column and the next) and its measure's take keys (dev/webkit/measure.js), and the sweep's `col-off`, `keypad-moved` and
 * `--takes` over the page review's four more sizes (tools/sweep.mjs). No WebKit, Safari or Quick Look runs here; every
 * cache is a scratch directory, and the storyboards are written to one. On the stub chapters (tests/fixtures/takes-stub.js)
 * until the real ones land. node --test */
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
  assert.deepEqual(Object.keys(TAKE_TARGETS), ['take:first', 'take:q', 'take:show', 'take:tap', 'take:spread', 'take:echo', 'take:sand', 'take:done', 'hollow:shelf', 'store:q']);
  assert.deepEqual(Object.values(TAKE_TARGETS).map((t) => t[0]), ['first', 'q', 'show', 'tap', 'spread', 'echo', 'sand', 'done', 'shelf', 'store'], 'PC.debug.takes’ words (section 8)');
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
  assert.ok(!/speechSynthesis\.speak|readBtn/.test(TAKES_JS), 'nothing that could sound');
});

/* ------------------------------------------------------------------ the WebKit tool's takes job */

test('dev/webkit/run.mjs: the `takes` job measures the gate’s screens (section 6) through the tree’s own shots.mjs scripts, verbatim: stills, Read to me off, take:first’s re-sit', async () => {
  const { pageScripts, measureJobs, call, takeOpen, SIZES, TAKE_SIZES, TAKE_SCREENS } = await imp('dev/webkit/run.mjs');
  assert.deepEqual(SIZES, ['1080x720', '1180x820', '820x1180', '390x844'], 'the sweep keeps its four sizes');
  assert.deepEqual(TAKE_SIZES, ['1080x700', '1024x768', '768x1024', '844x390'], 'the page review’s four more');
  assert.deepEqual(TAKE_SCREENS, ['take:first', 'take:q', 'take:show', 'take:tap', 'take:echo', 'take:sand', 'take:done', 'hollow:shelf', 'store:q']);
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
    assert.deepEqual(ms, t === 'take:q' || t === 'take:echo' ? [t, t + '@next'] : [t], t + ': measured (and after a right digit, the next column)');
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

/* ------------------------------------------------------------------ the measure */

test('dev/webkit/measure.js: on a take page (its frame’s data-mode, or a column in the screen) the column, the outlined box, the stack’s last balloon and the bar’s bottom at any scroll; nothing on any other page', () => {
  assert.match(MEASURE, /var tcol = document\.querySelector\('#screen \.tcol'\);\n    if \(\(fr && fr\.getAttribute\('data-mode'\) === 'take'\) \|\| tcol\) \{/);
  assert.match(MEASURE, /m\.tbar = bar && shown\(bar\) \? Math\.round\(bar\.getBoundingClientRect\(\)\.bottom\) : 0;/, 'the sticky bar’s bottom, scrolled or not');
  assert.match(MEASURE, /m\.tcol = tcol && shown\(tcol\) \? box\(tcol\) : null;/);
  assert.match(MEASURE, /\.tbox\.on'\); m\.tbox = tbx && shown\(tbx\) \? box\(tbx\) : null;/);
  // (and the stack's first balloon, `tsf`: chapter 12's review, 58 − 23 opened with it under the bar and its last in view)
  assert.match(MEASURE, /querySelectorAll\('#screen #stack \.sb, #screen \.stack \.sb'\), shown\); m\.tsb = sbs\.length \? box\(sbs\[sbs\.length - 1\]\) : null; m\.tsf = sbs\.length \? box\(sbs\[0\]\) : null;/);
  // the take keys sit outside both fingerprints, so every existing page's fp and pfp are what they were
  const keys = MEASURE.indexOf('var tcol = document.querySelector'), fp = MEASURE.indexOf('// fingerprints');
  assert.ok(keys > 0 && keys < fp && !/m\.t(col|box|sb|sf|bar)/.test(MEASURE.slice(fp)), 'not read by the fingerprints');
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
  assert.match(SWEEP, /const odir = await ensure\(o, Object\.assign\(\{\}, want, \{ takes: false \}\)/, 'a compare never measures take screens on the other tree');
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

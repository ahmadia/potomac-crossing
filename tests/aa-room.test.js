'use strict';
/* Bigger text (Aa) where the screen has little room: on an iPad held sideways that is narrow (1132px or
 * less) or short (800px or less), and on any screen held upright, the words beside or under the picture
 * are set at 1.14 times plain, on tighter lines and in snugger boxes, and a skip-count's "Tap to…" line
 * sits beside Back on any screen, so Back, Next, the options and the keypad stay on the screen without
 * scrolling (measured in WebKit over every frame of chapters 1 to 8 at
 * the iPad and phone sizes; aa-layout/judge). The suite has no DOM, so the rules are pinned here as text:
 * every one of them is Aa's alone (Aa off is the page as it was), none touches the picture, none makes
 * anything sticky (chapter 4: a sticky Back floated over the options and took their taps). */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const ROOM = '@media (orientation: portrait),\n' +
  '       (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-width: 1132px),\n' +
  '       (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 800px){';
const UPRIGHT = '@media (orientation: portrait){\n  html.big .frame{gap:10px}';

const SHORT = '@media (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 719px){\n  html.big .frame .col{line-height:1.2}\n}';
const SKIP = '/* Bigger text on a skip-count, on any screen:';
const PHONE = '@media (orientation: landscape) and (min-width: 700px) and (max-height: 500px){';

/* Plain rules in a stretch of CSS: [{ sel: [selectors], body }] (comments dropped). */
function rules(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').map((r) => r.trim()).filter(Boolean).map((r) => {
    const [sel, body] = r.split('{');
    return { sel: sel.split(/,(?![^(]*\))/).map((s) => s.trim()), body: body.trim() };
  });
}
/* The rules of the @media block that starts at `at`. */
function rulesAt(at) {
  const open = html.indexOf('{', at);
  let depth = 1, i = open + 1;
  while (depth && i < html.length) { if (html[i] === '{') depth++; else if (html[i] === '}') depth--; i++; }
  return rules(html.slice(open + 1, i - 1));
}
/* The skip-count's rules: top level, between their comment and the phone held sideways. */
function skipRules() { return rules(html.slice(html.indexOf(SKIP), html.indexOf(PHONE))); }

test('the block is there once, in its place: after the landscape spread, before the phone held sideways', () => {
  const at = html.indexOf(ROOM);
  assert.ok(at > 0, 'the media query, exactly');
  assert.equal(html.split(ROOM).length, 2, 'once');
  assert.ok(at > html.indexOf('.frame.solo.has-card .panel,.frame.solo.has-card .col{'), 'after the landscape spread’s rules it overrides');
  assert.ok(at < html.indexOf('@media (orientation: landscape) and (min-width: 700px) and (max-height: 500px){'), 'before the phone held sideways');
  const short = html.indexOf(SHORT), up = html.indexOf(UPRIGHT);
  assert.ok(short > at && up > short, 'then the short screen’s closer lines, then the upright block');
  assert.ok(html.indexOf(SKIP) > up && html.indexOf(SKIP) < html.indexOf(PHONE), 'then the skip-count’s rules, at the top level');
});

test('every rule is Bigger text’s alone, and none touches the picture or makes anything sticky (Aa off: nothing changes)', () => {
  const all = rulesAt(html.indexOf(ROOM)).concat(rulesAt(html.indexOf(SHORT)), rulesAt(html.indexOf(UPRIGHT)), skipRules());
  // 19, plus chapter 9's ask list (f118's six pairs; 2026-10-26)
  assert.equal(all.length, 20, all.length + ' rules');
  all.forEach((r) => {
    r.sel.forEach((s) => {
      assert.match(s, /^html\.big \.frame(\[data-kind="[a-z]+"\])?( |$)/, s + ': starts html.big .frame');
      assert.doesNotMatch(s, /\.panel|\.ov\b|\.art\b|\.keypad|\.key\b|\.q\b|#panel/, s + ': not the picture, the keypad or the question line');
    });
    assert.doesNotMatch(r.body, /sticky|position|--bfs|--scale|--fs\s*:/, r.sel.join(',') + ': ' + r.body);
  });
  // the chapter 4 rule stands: Back keeps its place under the options
  assert.match(html, /\.frame\[data-kind="choice"\] \.next-row\{position:static\}/);
});

test('the words stay clearly bigger than plain, a little under full Aa; Back and Next share one row and one size; options at least 54px', () => {
  const room = rulesAt(html.indexOf(ROOM));
  const col = room.find((r) => r.sel.includes('html.big .frame .col'));
  const k = Number(/font-size:calc\(var\(--fs\) \* ([\d.]+)\)/.exec(col.body)[1]);
  const full = Number(/html\.big\{--scale:([\d.]+)\}/.exec(html)[1]);
  assert.equal(full, 1.2);
  assert.ok(k >= 1.12 && k < full, 'the column at ' + k + ' times plain (full Aa ' + full + ')');
  assert.match(col.body, /line-height:1\.25/);
  // one rule for both buttons of the bottom row: Back as big as Next (decision 28)
  const row = room.find((r) => r.sel.includes('html.big .frame .next-row .btn.big'));
  assert.deepEqual(row.sel, ['html.big .frame .next-row .btn.big', 'html.big .frame .row.end .btn.big']);
  assert.match(row.body, /^padding:\.25em \.6em$/);
  assert.doesNotMatch(room.map((r) => r.body).join(';'), /min-height:(?!54px)/, 'no tap target under 54px');
  // upright, the options are as tall as Bigger text has them sideways
  assert.match(html, /html\.big \.choice\{padding-top:\.32em;padding-bottom:\.32em;min-height:54px\}/);
  assert.ok(rulesAt(html.indexOf(UPRIGHT)).some((r) => r.sel.includes('html.big .frame .choice') && r.body === 'min-height:54px'));
});

test('upright, the balloons stacked under the picture sit closer and snugger, and only there (ch06 f100 at 810 x 1080)', () => {
  const up = rulesAt(html.indexOf(UPRIGHT));
  assert.deepEqual(up.map((r) => r.sel.join(',')), ['html.big .frame', 'html.big .frame .choice', 'html.big .frame .stack', 'html.big .frame .sb']);
  assert.equal(up[2].body, 'gap:8px');
  // the balloon keeps its shape: padding only, still more than the caption's sideways, and never the type
  const pad = /^padding:\.(\d+)em \.(\d+)em \.(\d+)em$/.exec(up[3].body);
  assert.ok(pad, up[3].body);
  assert.ok(+pad[1] >= 30 && +pad[3] >= 30 && +pad[2] >= 70, 'a balloon at least .3em over and under its words, .7em beside them');
  // the landscape block's balloon rule is the one it overrides, later in the sheet with the same selector
  const room = rulesAt(html.indexOf(ROOM));
  assert.ok(room.some((r) => r.sel.includes('html.big .frame .sb')));
  assert.ok(html.indexOf(UPRIGHT) > html.indexOf(ROOM));
});

test('a skip-count: its "Tap to…" line beside Back only when the row holds nothing else (a card under the picture keeps the column)', () => {
  const sk = skipRules();
  assert.equal(sk.length, 5);
  assert.ok(sk.every((r) => r.sel.every((s) => s.startsWith('html.big .frame[data-kind="skip"] '))), 'skip-counts with Aa alone');
  const two = '.interact:has(> .tapline:first-child + .next-row:last-child)';
  const row = sk.filter((r) => r.sel.some((s) => s.includes(two)));
  assert.equal(row.length, 3, 'the row, its line, its buttons');
  assert.ok(row.every((r) => r.sel.every((s) => s.includes(two))), 'every one of them only in that case');
  assert.match(row[0].body, /flex-direction:row-reverse/);
});

/* ---- the polish release (2026-10-31): the Aa fix's three leftovers, and the Training Hollow with nine Counts.
 * Measured in WebKit at the iPad and phone sizes (polish-v20/builder); pinned here as text, as above. */
const { load } = require('./_load.js');
const PC = load();
const ui = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
/* The rules of every top-level @media block whose query is exactly `q`, in order. */
function blocksOf(q) {
  const out = []; let at = html.indexOf(q + '{');
  while (at >= 0) { out.push(rulesAt(at)); at = html.indexOf(q + '{', at + 1); }
  return out;
}
const SPREAD = '@media (orientation: landscape) and (min-width: 700px)';

test('ch04 f115 for a noticing cat: the two cards under a solo panel stay side by side (as two rows they ran Back and Next under a 1080 x 720 screen); no other page gives two cards, so nothing else changes', () => {
  const [spread, solo] = blocksOf(SPREAD);
  assert.ok(solo.some((r) => r.sel.includes('.frame.solo.has-card .panel') && /- 252px/.test(r.body)), 'the solo block, with the card room under the panel');
  const nw = solo.filter((r) => r.sel.includes('.frame.solo.has-card .cardnote'));
  assert.deepEqual(nw.map((r) => r.body), ['flex-wrap:nowrap']);
  assert.ok(!spread.some((r) => r.sel.some((s) => s.includes('cardnote'))));
  // with one card, nowrap is wrap: the only frame of chapters 1 to 9 that can show two is ch04 f115 (FLEW held beside the wing)
  const two = [];
  for (const [ch, st] of Object.entries(PC.story)) for (const [fid, f] of Object.entries(st.frames)) if (Array.isArray(f.card) && f.card.length > 1) two.push(ch + ':' + fid);
  assert.deepEqual(two, ['ch04:f115']);
  // a card's line still wraps inside its card (so the two fit side by side)
  assert.match(html, /\.cn-card\{display:flex;align-items:center;gap:12px;max-width:100%;/);
});

test('a Counts page already counted, Aa on, beside the picture: Back and Next keep the bottom row and "Count them again" sits over Next (in page order the three stacked, Next on top, and Back ran under a 720 fold)', () => {
  const [spread] = blocksOf(SPREAD);
  const r = spread.filter((x) => x.sel.some((s) => s.includes('#againBtn')));
  assert.deepEqual(r.map((x) => [x.sel, x.body]), [[['html.big .frame[data-kind="counts"]:not(.solo) .row.end > #againBtn'], 'order:1']]);
  // the counted page's row in page order: Back, Count them again, Next; the row wraps upward from Back's line
  assert.match(ui, /box\.innerHTML = '<div class="row end">' \+ backBottom\(\) \+ '<button class="btn quiet" id="againBtn" type="button">Count them again<\/button><button class="btn go big" id="nextBtn" type="button">Next<\/button><\/div>';/);
  assert.match(html, /\.next-row:has\(> \.btn\.back\),\.row\.end:has\(> \.btn\.back\)\{flex-wrap:wrap-reverse\}/);
  // the Hollow's reward page has an #againBtn too ("Another round"): its frame is `reward`, not `counts`
  assert.match(ui, /scr\.innerHTML = frameShell\('reward', 'reward'\);/);
});

test('her Case File: no word broken inside (the middle column at least 14em where a row of three is linked), and with Aa where the screen has little room its cards fit wherever they fit without Aa', () => {
  const wide = blocksOf('@media (min-width: 960px)');
  assert.equal(wide.length, 3, 'the file side by side, the linked file with many links, then the no-broken-word block');
  const nb = wide[2];
  assert.deepEqual(nb.map((r) => r.sel.join(',')), [
    '.cf-groups.linked:not(.many):has(> .cf-link.row)',
    'html.big .cf-groups.linked.many:has(.cf-link.row)',
    '.cf-groups.linked:not(.many):has(> .cf-link.row) .cf-link,html.big .cf-link',
    '.cf-groups.linked:not(.many):has(> .cf-link.row) .cf-pair .cf-line,html.big .cf-pair .cf-line',
    '.cf-groups.linked:not(.many):has(> .cf-link.row) .cf-pair.n3 .cf-card,html.big .cf-pair.n3 .cf-card']);
  // the middle column never under 14em (the longest card word, "ReedClan’s.", at Aa's size with its card's margins)
  nb.slice(0, 2).forEach((r) => assert.match(r.body, /^grid-template-columns:minmax\(0,[\d.]+fr\) minmax\(14em,[\d.]+fr\) minmax\(0,[\d.]+fr\)$/));
  // with Aa off only a file with a single row of three (no other link) is touched: the one that broke a word
  nb.forEach((r) => r.sel.forEach((s) => assert.ok(s.startsWith('html.big ') || s.startsWith('.cf-groups.linked:not(.many):has(> .cf-link.row)'), s)));
  // a card's words wrap at their spaces: nothing on the cards lets the browser cut a word (the title, her long name, may)
  assert.doesNotMatch(html, /\.cf-(card|cards|line|pair|link|linkline|group)\b[^{]*\{[^}]*(word-break:break-all|overflow-wrap:anywhere|hyphens:auto)/);
  assert.match(html, /\.cf-line\{display:block;text-shadow:[^}]*overflow-wrap:break-word;max-width:100%\}/, 'a word longer than its whole card would still wrap, never spill');
  // with Aa where room is little (as the frame's words): 1.14 times plain, closer lines, snugger boxes; Aa alone
  const at = html.indexOf('@media (orientation: landscape) and (min-width: 960px) and (min-height: 501px) and (max-width: 1132px),');
  assert.ok(at > 0);
  const little = rulesAt(at);
  assert.ok(little.every((r) => r.sel.every((s) => /^html\.big \.cf-/.test(s))), 'Aa alone, the Case File alone');
  assert.match(little.find((r) => r.sel.includes('html.big .cf-in')).body, /^font-size:calc\(var\(--fs\) \* 1\.14\)$/);
  little.forEach((r) => assert.doesNotMatch(r.body, /sticky|position|min-height/));
});

/* Chapter 10 (docs/chapters/10-the-gathering.spec.md, section 6, "The Training Hollow with ten Counts"): its lesson adds
 * the 7s, the tenth Count, last ("Clutches of seven · the 7s"), and with the polish release's rules the 7s' name wrapped and
 * My nest ran under a 1080 x 720 screen (78px; with Aa 34), 1080 x 700 and 1024 x 768. The polish release's blocks stand as
 * they were; chapter 10's three blocks come after them (worded "screen and", so no query here is looked up twice): beside the
 * picture, up to 860px tall, a wider column, every Count with the paw's room on both sides (a paw costs no line, glowing or
 * not), the buttons 50px (54px with Aa) and closer, My nest as tall; upright, the paw's room with Aa. Measured in WebKit at
 * 1080 x 720, 1080 x 700, 1024 x 768, 1180 x 820, 820 x 1180, 768 x 1024 and 390 x 844, Aa off and on, nine and ten Counts
 * (build-engine). The test passes on the stub (nine Counts) and with chapter 10's sets (ten, the 7s last). */
test('the Training Hollow with nine or ten Counts: on an iPad held sideways up to 860px tall its Counts are lower and closer, and every name keeps its line (the 7s and My nest were under a 1080 x 720 screen), with Aa never under its 54px, nor 48px without; a paw costs no line; nothing but the Hollow’s Counts changes', () => {
  const sw = blocksOf('@media (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)');
  const short = blocksOf('@media (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 719px)');
  const big = blocksOf('@media (orientation: portrait), (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)');
  assert.equal(sw.length, 1); assert.equal(big.length, 1);
  // the polish release's rules, as they were
  assert.deepEqual(sw[0].map((r) => [r.sel.join(','), r.body]), [
    ['.frame[data-kind="hollow"] .counts-pick', 'gap:8px'],
    ['.frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:56px;padding-top:.2em;padding-bottom:.2em']]);
  const sh = short.find((b) => b.some((r) => r.sel.some((s) => s.includes('hollow'))));
  assert.deepEqual(sh.map((r) => [r.sel.join(','), r.body]), [['.frame[data-kind="hollow"] .counts-pick', 'gap:6px']]);
  assert.deepEqual(big[0].map((r) => [r.sel.join(','), r.body]), [
    ['html.big .frame[data-kind="hollow"] .counts-pick', 'gap:6px'],
    ['html.big .frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:54px;padding:.12em .6em;line-height:1.1']]);
  // chapter 10's, after them
  const SW10 = '@media screen and (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)';
  const SH10 = '@media screen and (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 719px)';
  const UP10 = '@media screen and (orientation: portrait), screen and (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)';
  const [sw10] = blocksOf(SW10), [sh10] = blocksOf(SH10), [up10] = blocksOf(UP10);
  const polish = html.indexOf('@media (orientation: portrait), (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px){');
  [SW10, SH10, UP10].forEach((q) => { assert.equal(blocksOf(q).length, 1, q); assert.ok(html.indexOf(q + '{') > polish, q + ': after the polish release’s'); });
  assert.deepEqual(sw10.map((r) => [r.sel.join(','), r.body]), [
    ['.frame[data-kind="hollow"]', 'grid-template-columns:minmax(410px, .7fr) minmax(0, 1fr)'],
    ['.frame[data-kind="hollow"] .interact', 'gap:8px'],
    ['.frame[data-kind="hollow"] .counts-pick', 'grid-template-columns:minmax(0, 1fr);gap:6px'],
    ['.frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:50px;padding:.1em 1.45em'],
    ['.frame[data-kind="hollow"] #nestBtn', 'min-height:50px;padding-top:.1em;padding-bottom:.1em'],
    ['html.big .frame[data-kind="hollow"] .interact', 'gap:6px'],
    ['html.big .frame[data-kind="hollow"] .counts-pick', 'gap:4px'],
    ['html.big .frame[data-kind="hollow"] #nestBtn', 'min-height:54px']]);
  assert.deepEqual(sh10.map((r) => [r.sel.join(','), r.body]), [
    ['.frame[data-kind="hollow"] .interact', 'gap:6px'],
    ['html.big .frame[data-kind="hollow"] .interact', 'gap:4px'],
    ['html.big .frame[data-kind="hollow"] .counts-pick', 'gap:3px']]);
  assert.deepEqual(up10.map((r) => [r.sel.join(','), r.body]), [['html.big .frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:54px;padding:.08em 1.3em']]);
  // every one of them the Hollow's alone; no button under 48px, nor 54px with Aa; nothing sticky
  sw10.concat(sh10, up10).forEach((r) => r.sel.forEach((s) => {
    assert.match(s, /^(html\.big )?\.frame\[data-kind="hollow"\]( |$)/, s);
    const mh = /min-height:(\d+)px/.exec(r.body);
    if (mh) assert.ok(+mh[1] >= (s.startsWith('html.big') ? 54 : 48), s + ': ' + mh[1] + 'px');
    assert.doesNotMatch(r.body, /sticky|position/);
  }));
  // a paw costs no line: every Count has the paw's room. Without Aa the paw (.3em in, 1.1em wide) inside the 1.45em
  // padding; with Aa every Count's padding is the paw's own (the Warrior Counts' rule, which stays as it was)
  const paw = /\.counts-pick \.btn \.trickypaw\{position:absolute;left:\.3em;top:50%;width:1\.1em;/.test(html), pawAa = html.includes('html.big .frame[data-kind="hollow"] .counts-pick .btn.big:has(.trickypaw){padding-left:1.3em}');
  assert.ok(paw && pawAa, 'the Warrior Counts’ paw rules');
  assert.ok(0.3 + 1.1 < 1.45);
  // the Hollow is the only page with a list of Counts, and its frame is `hollow`
  assert.match(ui, /scr\.innerHTML = frameShell\('hollow', 'hollow'\);/);
  assert.equal((ui.match(/class="counts-pick"/g) || []).length, 1);
  assert.equal((ui.match(/id="nestBtn"/g) || []).length, 3, 'My nest: the Hollow’s list, its one Count, its reward page');
  // the list it holds: nine Counts once chapter 9 is finished; ten once chapter 10's 7s are in, the 7s last (each Count's own
  // set, in the order taught). On the orchestrator's stub (no Counts) nine; with the story builder's chapter, ten
  const E = PC.engine, sets = E.countSets(E.chapters(Object.keys(PC.story).sort().map((k) => PC.story[k])));
  const ten = !!(PC.story.ch10 && PC.story.ch10.counts && PC.story.ch10.counts['ch10-sevens']);
  assert.deepEqual(sets.map((c) => c.table), ten ? [1, 2, 5, 10, 9, 3, 6, 4, 8, 7] : [1, 2, 5, 10, 9, 3, 6, 4, 8]);
  if (ten) assert.equal(sets[9].setId, 'ch10-sevens');
});

/* Chapter 10's review (the Hollow for live players): the wider column chapter 10 gave ten names made the picture too
 * narrow for Tallyheart's line about glowing marks on a 1024-wide iPad held sideways, Aa off, so a chapter 5 to 9 cat's
 * Counts and My nest went under the screen (up to 215px at 1024 x 700, every mark glowing; live kept them on it); and
 * upright with Aa the paw's padding wrapped names no paw can reach (the paw comes only with ten Counts). Two blocks at
 * the sheet's end give a list of nine or fewer its room back: 370px beside the picture (Aa off, 1060px wide or less),
 * the polish release's .6em padding upright with Aa. A ten-Count list is untouched by both (measured in WebKit,
 * hollow-live/fixfinal: every ten-Count run box for box as before; no chapter 1 to 9 case worse than live). */
test('the Hollow with nine Counts or fewer gets live’s room back beside the picture (1024-wide sideways, Aa off) and its padding upright with Aa; ten Counts as chapter 10 lays them', () => {
  const NINE_SW = '@media screen and (orientation: landscape) and (min-width: 700px) and (max-width: 1060px) and (min-height: 501px) and (max-height: 860px)';
  const NINE_UP = '@media screen and (orientation: portrait)';
  const sw = html.indexOf(NINE_SW + '{'), up = html.indexOf(NINE_UP + '{\n  html.big .frame[data-kind="hollow"]');
  assert.equal(html.split(NINE_SW + '{').length, 2, 'once');
  assert.ok(sw > html.indexOf('@media screen and (orientation: portrait), screen and (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px){'), 'after chapter 10’s Hollow blocks');
  assert.ok(up > sw && up < html.indexOf('</style>'), 'the upright block after it, at the sheet’s end');
  assert.deepEqual(rulesAt(sw).map((r) => [r.sel.join(','), r.body]), [
    ['html:not(.big) .frame[data-kind="hollow"]:not(:has(.counts-pick > .btn:nth-child(10)))', 'grid-template-columns:370px minmax(0, 1fr)']]);
  assert.deepEqual(rulesAt(up).map((r) => [r.sel.join(','), r.body]), [
    ['html.big .frame[data-kind="hollow"] .counts-pick:not(:has(> .btn:nth-child(10))) .btn.big', 'padding:.12em .6em']]);
  // (the final review's L0: 1134px wide or more held sideways, Aa off, nine or fewer get live's own column back, so a chapter 1
  // to 9 player's picture and lettering at 1180 x 820 and 1194 x 834 are live's box for box; measured in WebKit, final-regress)
  const WIDE_SW = '@media screen and (orientation: landscape) and (min-width: 1134px) and (min-height: 501px) and (max-height: 860px)';
  const wd = html.indexOf(WIDE_SW + '{');
  assert.equal(html.split(WIDE_SW + '{').length, 2, 'once');
  assert.ok(wd > sw && wd < up, 'after the 1060 block');
  assert.deepEqual(rulesAt(wd).map((r) => [r.sel.join(','), r.body]), [
    ['html:not(.big) .frame[data-kind="hollow"]:not(:has(.counts-pick > .btn:nth-child(10)))', 'grid-template-columns:minmax(300px, 0.5fr) minmax(0, 1fr)']]);
  assert.match(html, /\.frame\{display:grid;grid-template-columns:minmax\(300px, 0\.5fr\) minmax\(0, 1fr\);/, 'live’s column: every frame’s own');
  // nothing sticky, nothing outside the Hollow, no height under the Hollow's floors
  rulesAt(sw).concat(rulesAt(up), rulesAt(wd)).forEach((r) => { assert.match(r.sel[0], /\.frame\[data-kind="hollow"\]/); assert.doesNotMatch(r.body, /sticky|position|min-height/); });
});

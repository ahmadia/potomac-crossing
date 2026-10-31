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

test('the Training Hollow with nine Counts: on an iPad held sideways up to 860px tall its Counts are a little lower and closer (the 8s and My nest were under a 1080 x 720 screen), with Aa never under its 54px; nothing but the Hollow’s Counts changes', () => {
  const sw = blocksOf('@media (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)');
  const short = blocksOf('@media (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 719px)');
  const big = blocksOf('@media (orientation: portrait), (orientation: landscape) and (min-width: 700px) and (min-height: 501px) and (max-height: 860px)');
  assert.equal(sw.length, 1); assert.equal(big.length, 1);
  assert.deepEqual(sw[0].map((r) => [r.sel.join(','), r.body]), [
    ['.frame[data-kind="hollow"] .counts-pick', 'gap:8px'],
    ['.frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:56px;padding-top:.2em;padding-bottom:.2em']]);
  // under 720px tall (Safari with its tab bar on a 10.2-inch iPad, 1080 x 700) a little closer still
  const sh = short.find((b) => b.some((r) => r.sel.some((s) => s.includes('hollow'))));
  assert.deepEqual(sh.map((r) => [r.sel.join(','), r.body]), [['.frame[data-kind="hollow"] .counts-pick', 'gap:6px']]);
  assert.deepEqual(big[0].map((r) => [r.sel.join(','), r.body]), [
    ['html.big .frame[data-kind="hollow"] .counts-pick', 'gap:6px'],
    ['html.big .frame[data-kind="hollow"] .counts-pick .btn.big', 'min-height:54px;padding:.12em .6em;line-height:1.1']]);
  // the Hollow is the only page with a list of Counts, and its frame is `hollow`
  assert.match(ui, /scr\.innerHTML = frameShell\('hollow', 'hollow'\);/);
  assert.equal((ui.match(/class="counts-pick"/g) || []).length, 1);
  // the list it holds: nine Counts once chapter 9 is finished (each Count's own set, in the order taught)
  const E = PC.engine, sets = E.countSets(E.chapters(Object.keys(PC.story).sort().map((k) => PC.story[k])));
  assert.deepEqual(sets.map((c) => c.table), [1, 2, 5, 10, 9, 3, 6, 4, 8]);
});

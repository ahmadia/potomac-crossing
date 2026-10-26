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
  assert.equal(all.length, 19, all.length + ' rules');
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

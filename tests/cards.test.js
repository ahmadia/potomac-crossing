// The Case File's cards (app/art/cards.js; docs/build.md, "Chapter 4", Cards art, and "Chapter 5"):
// node --test tests/cards.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { ROOT, scripts, load } = require('./_load.js');
const PC = load();
const art = PC.art;

// Every card that exists by the end of chapter 4, from the text's notes ("The Case File"): its id
// (the key of its drawing) and its mark.
const CARDS = [
  ['four-a-night', 'eye'], ['tidy', 'eye'], ['dug-earth', 'eye'], ['scale', 'eye'], ['fox-flew', 'ear'],
  ['fox-moon', 'ear'], ['squall-shapes', 'ear'], ['sprinkle-scales', 'eye'], ['cant-fly', 'eye']
];
const IDS = CARDS.map((c) => c[0]);

// Every card chapter 5 can give, from its text's notes ("The Case File"), in its order: ten, and
// nine of them new (`squall-shapes` is chapter 4's own drawing, for a cat who goes up the tower
// this chapter).
const CARDS5 = [
  ['prints-pile', 'eye'], ['squall-shapes', 'ear'], ['puddle-paws', 'ear'], ['otter-fox', 'ear'], ['fur', 'eye'],
  ['heron-no-moon', 'ear'], ['heron-shapes', 'ear'], ['prints-marsh', 'eye'], ['prints-tracks', 'eye'], ['wisp-fox', 'ear']
];
const NEW5 = CARDS5.filter((c) => !IDS.includes(c[0]));
const IDS5 = NEW5.map((c) => c[0]);
// every drawing there is, with its card's mark
const ALL = CARDS.concat(NEW5);
const ALL_IDS = ALL.map((c) => c[0]);
const MARK = Object.fromEntries(ALL);

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, no duplicate attributes.
function checkXml(svg, root) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m, first = null;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') { assert.fail('text in the markup (a card has no lettering): ' + tok.slice(0, 40)); }
    if (tok.startsWith('</')) {
      const name = tok.slice(2, -1).trim();
      assert.equal(stack.pop(), name, 'closing tag mismatch at </' + name + '>');
      continue;
    }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, 'malformed tag: ' + tok.slice(0, 120));
    const names = (mm[2].match(/[\w:.-]+(?==")/g) || []);
    assert.equal(new Set(names).size, names.length, 'duplicate attribute in ' + tok.slice(0, 80));
    assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(mm[2]), 'unescaped & in ' + tok.slice(0, 80));
    if (!first) first = mm[1];
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, 'unclosed tags: ' + stack.slice(-3).join(', '));
  assert.equal(first, root, 'the root element is <' + root + '>');
}

function checkSvg(svg, box, label) {
  assert.equal(typeof svg, 'string', label);
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + box + '"') && svg.endsWith('</svg>'), label + ': a complete <svg> with viewBox ' + box);
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(svg), label + ': no NaN/undefined in the markup');
  assert.ok(!/\sid="|<defs|url\(#|filter=|<use|<text|<style|<image|href=/.test(svg), label + ': no ids, defs, filters, text or links (many cards share a page)');
  assert.ok(!/\s(width|height)="/.test(svg.slice(0, svg.indexOf('>'))), label + ': no fixed size on the root, the page sizes it');
  checkXml(svg, 'svg');
}

// The markup of the group with this class (its own tags included), or '' when there is none.
function group(svg, cls) {
  const at = svg.indexOf('<g class="' + cls + '"');
  if (at < 0) return '';
  const re = /<g[\s>]|<\/g>/g;
  re.lastIndex = at;
  let depth = 0, m;
  while ((m = re.exec(svg))) {
    depth += m[0] === '</g>' ? -1 : 1;
    if (depth === 0) return svg.slice(at, m.index + 4);
  }
  assert.fail('unclosed group ' + cls);
}

// [a, b, c, d, e, f] of a transform list: translate(x y), rotate(deg), scale(k)
function matrix(t) {
  let m = [1, 0, 0, 1, 0, 0];
  const mul = (p, q) => [p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1], p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3],
    p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5]];
  const re = /(\w+)\(([^)]*)\)/g;
  let f;
  while ((f = re.exec(t || ''))) {
    const v = f[2].trim().split(/[\s,]+/).map(Number);
    if (f[1] === 'translate') m = mul(m, [1, 0, 0, 1, v[0], v[1] || 0]);
    else if (f[1] === 'scale') m = mul(m, [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0]);
    else if (f[1] === 'rotate') { const r = v[0] * Math.PI / 180; m = mul(m, [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]); }
    else assert.fail('a transform this test does not know: ' + f[1]);
  }
  return m;
}

// Every point a path touches or is pulled toward (ends and control points: a curve stays inside
// their hull), in the path's own coordinates. Arcs: only the half circles the drawings use.
function pathPoints(d) {
  const pts = [];
  const re = /([MLHVCQAZmlhvcqaz])([^MLHVCQAZmlhvcqaz]*)/g;
  let m, x = 0, y = 0, sx = 0, sy = 0;
  while ((m = re.exec(d))) {
    const c = m[1], rel = c === c.toLowerCase(), C = c.toUpperCase();
    const v = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    const per = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, A: 7, Z: 0 }[C];
    if (C === 'Z') { x = sx; y = sy; continue; }
    assert.ok(v.length && v.length % per === 0, 'path numbers for ' + c + ' in ' + d.slice(0, 50));
    for (let i = 0; i < v.length; i += per) {
      const a = v.slice(i, i + per);
      if (C === 'H') { x = rel ? x + a[0] : a[0]; pts.push([x, y]); continue; }
      if (C === 'V') { y = rel ? y + a[0] : a[0]; pts.push([x, y]); continue; }
      if (C === 'A') {
        const ex = rel ? x + a[5] : a[5], ey = rel ? y + a[6] : a[6];
        assert.ok(Math.abs(ey - y) < 1e-6 && Math.abs(Math.abs(ex - x) - 2 * a[0]) < 1e-6, 'an arc that is not half a circle on a level diameter: teach this test its box');
        pts.push([x, y - a[1]], [x, y + a[1]], [ex, ey - a[1]], [ex, ey + a[1]]);
        x = ex; y = ey;
        continue;
      }
      for (let k = 0; k < per; k += 2) pts.push([rel ? x + a[k] : a[k], rel ? y + a[k + 1] : a[k + 1]]);
      const last = pts[pts.length - 1];
      x = last[0]; y = last[1];
      if (C === 'M') { sx = x; sy = y; }
    }
  }
  return pts;
}

// The same walk, but along the curves themselves (each one sampled), for a box no bigger than the
// drawing. M, L, H, V, C, Q and Z only.
function curvePoints(d) {
  const out = [];
  const re = /([MLHVCQZmlhvcqz])([^MLHVCQZmlhvcqz]*)/g;
  let m, x = 0, y = 0, sx = 0, sy = 0;
  while ((m = re.exec(d))) {
    const c = m[1], rel = c === c.toLowerCase(), C = c.toUpperCase();
    const v = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    const per = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0 }[C];
    if (C === 'Z') { x = sx; y = sy; continue; }
    for (let i = 0; i < v.length; i += per) {
      const a = v.slice(i, i + per).map((n, k) => (rel ? n + (C === 'H' ? x : C === 'V' ? y : k % 2 ? y : x) : n));
      if (C === 'H') { x = a[0]; out.push([x, y]); continue; }
      if (C === 'V') { y = a[0]; out.push([x, y]); continue; }
      if (C === 'M' || C === 'L') { x = a[0]; y = a[1]; out.push([x, y]); if (C === 'M') { sx = x; sy = y; } continue; }
      for (let k = 1; k <= 16; k++) {
        const t = k / 16, u = 1 - t;
        if (C === 'Q') out.push([u * u * x + 2 * u * t * a[0] + t * t * a[2], u * u * y + 2 * u * t * a[1] + t * t * a[3]]);
        else out.push([u * u * u * x + 3 * u * u * t * a[0] + 3 * u * t * t * a[2] + t * t * t * a[4], u * u * u * y + 3 * u * u * t * a[1] + 3 * u * t * t * a[3] + t * t * t * a[5]]);
      }
      x = a[per - 2]; y = a[per - 1];
    }
  }
  return out;
}

// Every point of every path in a piece of markup, in the card's 200 x 240 box.
function points(markup) {
  const out = [];
  const re = /<path d="([^"]+)"(?: transform="([^"]+)")?/g;
  let m;
  while ((m = re.exec(markup))) {
    const M = matrix(m[2]);
    pathPoints(m[1]).forEach((p) => out.push([M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]]));
  }
  return out;
}
function bounds(pts) {
  return pts.reduce((b, p) => ({ x0: Math.min(b.x0, p[0]), y0: Math.min(b.y0, p[1]), x1: Math.max(b.x1, p[0]), y1: Math.max(b.y1, p[1]) }), { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
}
const r1 = (v) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------- the contract

test('cards.js gives the page PC.art.card, cardPictures and fileIcon before the stories and the page need them', () => {
  assert.equal(typeof art.card, 'function');
  assert.equal(typeof art.fileIcon, 'function');
  assert.equal(typeof art.cardGroup, 'function');
  assert.equal(typeof art.cardMark, 'function');
  assert.equal(typeof art.cardPictures, 'object');
  assert.deepEqual(art.cardMarks, ['eye', 'ear']);
  const order = scripts();
  const at = order.indexOf('app/art/cards.js');
  assert.ok(at >= 0, 'index.html loads app/art/cards.js');
  order.forEach((src, i) => {
    if (/^app\/(story\/|engine\.js|ui\.js)/.test(src)) assert.ok(i > at, src + ' loads after the cards');
  });
  assert.ok(/app\/art\/cards\.js/.test(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8')), 'sw.js caches app/art/cards.js');
});

test('one drawing for every card chapter 4 defines: the nine in the text\'s table, by id', () => {
  IDS.forEach((id) => {
    const p = art.cardPictures[id];
    assert.ok(p, 'a drawing for ' + id);
    assert.equal(typeof p.draw, 'function', id + ' draws');
    assert.ok(typeof p.label === 'string' && p.label.length > 8, id + ' says what it is, for a reader who cannot see it');
  });
  // and no drawing nobody asked for: each is one of these nine or of chapter 5's nine (below), or
  // a later chapter's card uses it
  const used = new Set(ALL_IDS);
  Object.keys(PC.story || {}).forEach((ch) => {
    const defs = (PC.story[ch] && PC.story[ch].cards) || {};
    Object.keys(defs).forEach((id) => used.add(defs[id] && typeof defs[id].picture === 'string' && defs[id].picture ? defs[id].picture : id));
  });
  Object.keys(art.cardPictures).forEach((key) => assert.ok(used.has(key), 'a card uses the drawing "' + key + '"'));
  // the text's own table (docs/chapters/04, "Every card that exists by the end of chapter 4")
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/04-the-glittering-scale.md'), 'utf8');
  const rows = md.split('\n').map((l) => /^\s*\|\s*`([a-z0-9-]+)`\s*\|\s*(eye|ear)\s*\|/.exec(l)).filter(Boolean).map((m) => [m[1], m[2]]);
  assert.deepEqual(rows, CARDS, 'this test\'s list is the text\'s list, in its order, with its marks');
});

test('every card a chapter defines, once a story carries them, has a drawing and a mark the art knows', (t) => {
  const chapters = Object.keys(PC.story || {}).filter((ch) => PC.story[ch] && PC.story[ch].cards && Object.keys(PC.story[ch].cards).length);
  if (!chapters.length) { t.skip('no chapter defines cards yet (app/story/ch04.js is to come)'); return; }
  chapters.forEach((ch) => {
    const defs = PC.story[ch].cards;
    Object.keys(defs).forEach((id) => {
      // the engine's own rule (E.cards): a definition's `picture`, or the card's id
      const def = defs[id], key = typeof def.picture === 'string' && def.picture ? def.picture : id;
      assert.ok(Object.prototype.hasOwnProperty.call(art.cardPictures, key), ch + ' card ' + id + ': a drawing for picture "' + key + '"');
      assert.ok(art.cardMarks.includes(def.mark), ch + ' card ' + id + ': mark ' + def.mark);
      assert.ok(group(art.card({ picture: key, mark: def.mark }), 'pcc-pic'), ch + ' card ' + id + ' has a picture on it');
    });
  });
  // chapter 4's are the nine of the text's table, with its marks
  const four = PC.story.ch04 && PC.story.ch04.cards;
  if (four) assert.deepEqual(Object.keys(four).sort().map((id) => [id, four[id].mark]), CARDS.slice().sort((a, b) => (a[0] < b[0] ? -1 : 1)), 'chapter 4 defines the nine');
  // chapter 5's, once its frames are written, are the ten of its table: its own nine, each drawn
  // under its own id, and chapter 4's `squall-shapes` (its own again, or left to chapter 4's)
  const five = PC.story.ch05 && PC.story.ch05.cards;
  if (five && Object.keys(five).length) {
    const mine = Object.keys(five).filter((id) => id !== 'squall-shapes').sort();
    assert.deepEqual(mine.map((id) => [id, five[id].mark]), NEW5.slice().sort((a, b) => (a[0] < b[0] ? -1 : 1)), 'chapter 5 defines the nine new ones, with the table\'s marks');
    mine.forEach((id) => assert.ok(!five[id].picture || five[id].picture === id, 'chapter 5 card ' + id + ' is drawn under its own id'));
    if (five['squall-shapes']) assert.equal(five['squall-shapes'].mark, 'ear');
  }
});

test('every card, small and large, with either mark or none, is one well-formed svg in the same 200 x 240 box', () => {
  const seen = new Set();
  ALL_IDS.forEach((id) => {
    [undefined, 'eye', 'ear'].forEach((mark) => {
      [false, true].forEach((big) => {
        const label = id + ' ' + (mark || 'no mark') + (big ? ' big' : '');
        const svg = art.card({ picture: id, mark: mark, big: big });
        checkSvg(svg, '0 0 200 240', label);
        assert.ok(/ role="img" aria-label="[^"]+"/.test(svg), label + ': it says what it is');
        assert.ok(group(svg, 'pcc-bark'), label + ': the bark');
        assert.ok(group(svg, 'pcc-pic'), label + ': the picture');
        assert.equal(!!group(svg, 'pcc-mark'), !!mark, label + ': the mark, when it has one');
        assert.equal(svg, art.card({ picture: id, mark: mark, big: big }), label + ': the same card every time');
        assert.ok(svg.length < 7000, label + ': a light drawing (' + svg.length + ' characters)');
        seen.add(svg);
      });
    });
  });
  assert.equal(ALL_IDS.length, 18, 'chapter 4\'s nine and chapter 5\'s nine');
  assert.equal(seen.size, ALL_IDS.length * 3 * 2, 'no two of them are the same drawing');
});

test('cardGroup is the same drawing without the outer svg, for a set that lays cards in a scene', () => {
  const g = art.cardGroup({ picture: 'scale', mark: 'eye' });
  assert.equal(g.w, 200);
  assert.equal(g.h, 240);
  assert.ok(!/<svg/.test(g.svg) && g.svg.startsWith('<g '), 'a group, not a document');
  assert.equal(art.card({ picture: 'scale', mark: 'eye' }), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" role="img" aria-label="' + g.label.replace(/"/g, '&quot;') + '">' + g.svg + '</svg>');
});

// ---------------------------------------------------------------- the bark

test('a blank curl has nothing scratched on it, whatever else is passed, and every card lies on the same bark', () => {
  const blank = art.card({ blank: true });
  checkSvg(blank, '0 0 200 240', 'blank');
  assert.ok(!group(blank, 'pcc-pic') && !group(blank, 'pcc-mark'), 'no picture, no mark');
  assert.equal(art.card({ blank: true, picture: 'scale', mark: 'eye' }), blank, 'blank wins over a picture and a mark');
  assert.equal(art.card(), blank, 'no options: the bare bark');
  assert.equal(art.card({}), blank);
  assert.equal(art.card(null), blank);
  assert.ok(/blank piece of bark/i.test(blank), 'and says so');
  ALL_IDS.forEach((id) => {
    assert.equal(group(art.card({ picture: id, mark: 'eye' }), 'pcc-bark'), group(blank, 'pcc-bark'), id + ' is scratched on the same curl');
  });
  const bigBlank = art.card({ blank: true, big: true });
  checkSvg(bigBlank, '0 0 200 240', 'big blank');
  assert.ok(bigBlank.length > blank.length, 'large, the bark shows more of its grain');
});

test('the bark is pale and papery, sits inside its box, and its foot still curls', () => {
  const bark = group(art.card({ blank: true }), 'pcc-bark');
  const fills = (bark.match(/fill="(#[0-9A-Fa-f]{6})"/g) || []).map((f) => f.slice(6, 13));
  const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  assert.ok(fills.some((f) => lum(f) > 0.82), 'a pale face to scratch on');
  assert.ok(fills.some((f) => lum(f) > 0.45 && lum(f) < 0.7), 'and the darker outside of the bark, where it curls');
  const b = bounds(points(bark));
  assert.ok(b.x0 >= 4 && b.y0 >= 4 && b.x1 <= 196 && b.y1 <= 236, 'inside the box with room for its outline: ' + JSON.stringify(b));
  assert.ok(b.x1 - b.x0 > 170 && b.y1 - b.y0 > 205, 'and it fills the box');
});

// ---------------------------------------------------------------- the marks

test('the eye and the ear are two different marks in the top left corner', () => {
  const eye = group(art.card({ blank: false, mark: 'eye' }), 'pcc-mark');
  const ear = group(art.card({ mark: 'ear' }), 'pcc-mark');
  assert.ok(eye && ear && eye !== ear);
  [eye, ear].forEach((mk, i) => {
    const b = bounds(points(mk));
    assert.ok(b.x0 >= 22 && b.y0 >= 22 && b.x1 <= 66 && b.y1 <= 63, (i ? 'ear' : 'eye') + ' keeps to its corner: ' + JSON.stringify(b));
    assert.ok(b.x1 - b.x0 >= 30, (i ? 'ear' : 'eye') + ' is big enough to read small');
  });
  // an almond with a slit: wider than tall, and one straight stroke down its middle
  const be = bounds(points(eye));
  assert.ok(be.x1 - be.x0 > 1.4 * (be.y1 - be.y0) * 0.5, 'the eye is an almond, wider than it is tall');
  assert.ok(/<path d="M44 [\d.]+V[\d.]+"/.test(eye), 'with a slit in it');
  // one triangle with a notch: a single closed outline, taller than the eye
  const ba = bounds(points(ear));
  assert.equal((ear.match(/<path /g) || []).length, 1, 'the ear is one outline');
  assert.ok(/Z"/.test(ear), 'closed');
  assert.ok(ba.y1 - ba.y0 > 30, 'the ear stands up');
  assert.ok(/L[\d.]+ [\d.]+L[\d.]+ [\d.]+/.test(ear), 'with a notch cut in one side');
});

test('a mark the art does not know leaves the corner empty, and never throws', () => {
  const plain = art.card({ picture: 'scale' });
  ['paw', 'EYE', '', null, 0, 'constructor', 'toString', '__proto__', {}, []].forEach((mk) => {
    assert.equal(art.card({ picture: 'scale', mark: mk }), plain, 'mark ' + JSON.stringify(mk));
  });
  assert.ok(/aria-label="A piece of bark: the scale, with shine lines"/.test(plain), 'the label names no mark then');
  assert.ok(/in its corner, an eye"/.test(art.card({ picture: 'scale', mark: 'eye' })));
  assert.ok(/in its corner, an ear"/.test(art.card({ picture: 'fox-flew', mark: 'ear' })));
  assert.ok(/aria-label="A piece of bark: in its corner, an ear"/.test(art.card({ mark: 'ear' })), 'a mark alone');
});

test('cardMark is the same eye and the same ear by itself, in the page\'s colour, for a heading beside the cards', () => {
  ['eye', 'ear'].forEach((mk) => {
    const icon = art.cardMark(mk);
    checkSvg(icon, '0 0 40 28', 'cardMark ' + mk);
    assert.ok(/stroke="currentColor"/.test(icon) && !/#[0-9A-Fa-f]{6}/.test(icon), mk + ': the page colours it');
    assert.ok(/ fill="none" /.test(icon) && (icon.match(/fill=/g) || []).length === 1, mk + ': lines only');
    // the very path data of the card's own mark
    const onCard = [...group(art.card({ mark: mk }), 'pcc-mark').matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual([...icon.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]), onCard, mk + ': the heading\'s mark is the card\'s mark');
    // and it sits inside its box, most of the way across or up it
    const M = matrix(/<g transform="([^"]+)"/.exec(icon)[1]);
    const pts = onCard.flatMap((d) => curvePoints(d)).map((p) => [M[0] * p[0] + M[4], M[3] * p[1] + M[5]]), b = bounds(pts);
    assert.ok(b.x0 >= 1.6 && b.x1 <= 38.4 && b.y0 >= 0.4 && b.y1 <= 27.6, mk + ' inside the box: ' + JSON.stringify(b));
    assert.ok(b.x1 - b.x0 > 22 || b.y1 - b.y0 > 22, mk + ' fills it');
    assert.equal(icon, art.cardMark(mk));
  });
  assert.notEqual(art.cardMark('eye'), art.cardMark('ear'));
  ['paw', '', null, undefined, 'constructor', 'toString', {}].forEach((mk) => assert.equal(art.cardMark(mk), '', 'no mark for ' + JSON.stringify(mk)));
});

test('the bark the cats hold and the bark the scenes lay down are this bark: the same pale face, edge and shadow', () => {
  const card = art.card({ blank: true });
  const face = /fill="(#[0-9A-Fa-f]{6})" stroke="(#[0-9A-Fa-f]{6})" stroke-width="3\.2"/.exec(card);
  const under = /<path d="[^"]+" fill="(#[0-9A-Fa-f]{6})" transform="translate\(2\.6 3\.4\)"\/>/.exec(card);
  assert.ok(face && under);
  [['app/art/cats.js', /var BARK_COL = \{([^}]+)\}/], ['app/art/scenes.js', /var BARK = \{([^}]+)\}/]].forEach(([file, re]) => {
    const m = re.exec(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    if (!m) return;   // that file draws no bark of its own (yet)
    const col = (k) => { const q = new RegExp('\\b' + k + ": '(#[0-9A-Fa-f]{6})'").exec(m[1]); return q && q[1].toUpperCase(); };
    assert.equal(col('face'), face[1].toUpperCase(), file + ': the face of the bark');
    assert.equal(col('edge'), face[2].toUpperCase(), file + ': its edge');
    assert.equal(col('under'), under[1].toUpperCase(), file + ': its shadow');
  });
});

// ---------------------------------------------------------------- the pictures

test('every picture is scratched lines and nothing else: nothing filled, round ends, one dark colour', () => {
  ALL_IDS.forEach((id) => {
    [false, true].forEach((big) => {
      const svg = art.card({ picture: id, mark: 'eye', big: big });
      ['pcc-pic', 'pcc-mark'].forEach((cls) => {
        const g = group(svg, cls);
        assert.ok(/^<g class="[\w-]+" fill="none" stroke-linecap="round" stroke-linejoin="round">/.test(g), id + ' ' + cls + ': lines with round ends');
        assert.equal((g.match(/fill=/g) || []).length, 1, id + ' ' + cls + ': nothing is filled');
        const cols = new Set((g.match(/stroke="#[0-9A-Fa-f]{6}"/g) || []));
        assert.equal(cols.size, big ? 2 : 1, id + ' ' + cls + ': one dark line' + (big ? ', and its pale lip' : ''));
      });
    });
  });
});

test('every picture keeps inside the bark, above the curl, and out of the mark\'s corner', () => {
  ALL_IDS.forEach((id) => {
    const pic = group(art.card({ picture: id, big: true }), 'pcc-pic');
    const pts = points(pic);
    assert.ok(pts.length > 6, id + ' has a drawing');
    const b = bounds(pts);
    assert.ok(b.x0 >= 20 && b.x1 <= 180, id + ' keeps off the bark\'s sides: x ' + r1(b.x0) + '..' + r1(b.x1));
    assert.ok(b.y0 >= 58 && b.y1 <= 206, id + ' keeps under the top and above the curl: y ' + r1(b.y0) + '..' + r1(b.y1));
    pts.forEach((p) => assert.ok(!(p[0] < 68 && p[1] < 64), id + ' keeps out of the mark\'s corner: ' + r1(p[0]) + ', ' + r1(p[1])));
    assert.ok(b.x1 - b.x0 >= 90, id + ' uses the width of the bark (' + r1(b.x1 - b.x0) + ')');
  });
});

test('small cards are drawn in heavier lines than large ones, and large ones add the lip of the scratch and the small touches', () => {
  const width = (g) => Number(/<g stroke="#3A281E" stroke-width="([\d.]+)"/.exec(g)[1]);
  ALL_IDS.forEach((id) => {
    const small = group(art.card({ picture: id }), 'pcc-pic'), big = group(art.card({ picture: id, big: true }), 'pcc-pic');
    assert.ok(width(small) >= 4 && width(small) <= 5, id + ': a small card reads in a row (' + width(small) + ' of 200)');
    assert.ok(width(big) >= 2 && width(big) <= 3, id + ': large, the lines are thin (' + width(big) + ' of 200)');
    assert.ok(/<g stroke="#[0-9A-Fa-f]{6}" stroke-width="[\d.]+" transform="translate\(1 1\.3\)" opacity="\.85">/.test(big), id + ': the pale lip, a hair down and right');
    assert.ok(!/transform="translate\(1 1\.3\)"/.test(small), id + ': no lip on a small card');
    // the dark lines of the large card hold everything the small card has
    const bp = points(big.slice(big.lastIndexOf('<g stroke="#3A281E"'))), sp = points(small);
    assert.ok(bp.length >= sp.length, id + ': nothing is lost large');
  });
  ['fox-flew', 'fox-moon', 'cant-fly', 'tidy', 'four-a-night',
    'prints-pile', 'puddle-paws', 'otter-fox', 'fur', 'heron-no-moon', 'heron-shapes', 'prints-marsh', 'wisp-fox'].forEach((id) => {
    const small = group(art.card({ picture: id }), 'pcc-pic'), big = group(art.card({ picture: id, big: true }), 'pcc-pic');
    assert.ok(points(big.slice(big.lastIndexOf('<g stroke="#3A281E"'))).length > points(small).length, id + ': a small touch more, large');
  });
});

test('her look changes nothing on a card', () => {
  const looks = [{ fur: 'black', marking: 'white-paws', eyes: 'green', sex: 'she' }, { fur: 'calico', marking: 'none', eyes: 'odd', sex: 'tom' }, {}, null];
  ALL_IDS.concat([undefined]).forEach((id) => {
    [false, true].forEach((big) => {
      const plain = art.card({ picture: id, mark: 'eye', big: big });
      looks.forEach((look) => assert.equal(art.card({ picture: id, mark: 'eye', big: big, look: look }), plain, String(id) + ' with a look'));
    });
  });
});

test('"Four gone every night": six little mice in a row of ten places, three, four empty places, three', () => {
  const pic = group(art.card({ picture: 'four-a-night' }), 'pcc-pic');
  const d = [...pic.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]).join('');
  // a mouse is a closed dome and an ear; an empty place is a short level scratch
  const mice = (d.match(/M[\d.]+ [\d.]+C[^MZ]+Z/g) || []).map((m) => { const b = bounds(pathPoints(m)); return { x: (b.x0 + b.x1) / 2, y: b.y1, w: b.x1 - b.x0 }; });
  const gaps = (d.match(/M[\d.]+ [\d.]+h[\d.]+/g) || []).map((m) => { const b = bounds(pathPoints(m)); return { x: (b.x0 + b.x1) / 2, y: b.y1, w: b.x1 - b.x0 }; });
  assert.equal(mice.length, 6, 'six mice');
  assert.equal(gaps.length, 4, 'four empty places');
  assert.equal((d.match(/Z/g) || []).length, 6, 'and nothing else closed in the row');
  const row = mice.concat(gaps).sort((a, b) => a.x - b.x);
  const kinds = row.map((p) => (mice.includes(p) ? 'm' : '-')).join('');
  assert.equal(kinds, 'mmm----mmm', 'three, four empty places, three');
  // one row on one ground, and one step from place to place (so the gap is exactly four places wide)
  row.forEach((p) => assert.ok(Math.abs(p.y - row[0].y) < 0.6, 'all on one ground line'));
  const step = (mice[5].x - mice[0].x) / 9;
  const mx = mice.map((p) => p.x), gx = gaps.map((p) => p.x);
  [0, 1, 2, 7, 8, 9].forEach((slot, i) => assert.ok(Math.abs(mx[i] - (mx[0] + slot * step)) < 0.3, 'mouse ' + i + ' sits in place ' + slot));
  // an empty place's scratch is in the middle of its place, a mouse a little off it (its nose reaches further than its rump)
  const off = gx[0] - (mx[0] + 3 * step);
  gx.forEach((x, i) => assert.ok(Math.abs(x - (mx[0] + (3 + i) * step) - off) < 0.3 && Math.abs(off) < 1.5, 'empty place ' + i + ' is place ' + (3 + i)));
  mice.forEach((p) => assert.ok(p.w < step - 2, 'a mouse leaves a space before the next one (' + r1(p.w) + ' of ' + r1(step) + ')'));
  gaps.forEach((p) => assert.ok(p.w < mice[0].w, 'an empty place is marked more lightly than a mouse'));
});

test('"The thief leaves the pile tidy": two short rows, every piece straight', () => {
  const pic = group(art.card({ picture: 'tidy' }), 'pcc-pic');
  const all = (pic.match(/<path d="([^"]+)"/g) || []).join(' ');
  const mice = (all.match(/M[\d.]+ [\d.]+C[^MZ]+Z/g) || []).map((m) => { const b = bounds(pathPoints(m)); return { x: r1((b.x0 + b.x1) / 2), y: r1(b.y1) }; });
  assert.equal(mice.length, 8, 'eight pieces');
  const ys = [...new Set(mice.map((p) => p.y))].sort((a, b) => a - b);
  assert.equal(ys.length, 2, 'in two rows');
  const rows = ys.map((y) => mice.filter((p) => p.y === y).map((p) => p.x).sort((a, b) => a - b));
  assert.deepEqual(rows[0], rows[1], 'the second row lies exactly under the first');
  assert.equal(rows[0].length, 4);
  const steps = rows[0].slice(1).map((x, i) => r1(x - rows[0][i]));
  assert.equal(new Set(steps).size, 1, 'evenly spaced: ' + steps.join(', '));
  // every tail is one straight level line, all the same length
  const tails = (all.match(/M[\d.]+ [\d.]+L[\d.]+ [\d.]+(?=M|$|")/g) || []).map((m) => pathPoints(m));
  assert.equal(tails.length, 8, 'eight straight tails');
  tails.forEach((p) => assert.equal(p[0][1], p[1][1], 'a level tail'));
  assert.equal(new Set(tails.map((p) => r1(p[0][0] - p[1][0]))).size, 1, 'all the same length');
  assert.equal((all.match(/M30 [\d.]+H172/g) || []).length, 2, 'and each row on its own ruled ground');
});

test('the two fox cards share one fox, drawn from the side with his mouth shut; the wings and the moon are what differ', () => {
  const flew = group(art.card({ picture: 'fox-flew' }), 'pcc-pic'), moon = group(art.card({ picture: 'fox-moon' }), 'pcc-pic');
  // the fox is every stroke scratched in his own box
  const foxOf = (g) => (g.match(/<path d="[^"]+" transform="translate\(22 122\)[^"]*"[^>]*\/>/g) || []);
  const rest = (g) => foxOf(g).reduce((r, p) => r.replace(p, ''), g);
  assert.ok(foxOf(flew).length >= 2, 'a head and a nose');
  assert.deepEqual(foxOf(flew), foxOf(moon), 'the same fox head in the same place');
  assert.notEqual(rest(flew), rest(moon), 'and a different story beside him');
  // the fox keeps to the lower left, what he says it did to the upper right
  const fox = bounds(points(foxOf(flew).join('')));
  assert.ok(fox.x1 <= 104 && fox.y0 >= 118, 'the fox in the lower left: ' + JSON.stringify(fox));
  [rest(flew), rest(moon)].forEach((g) => {
    const b = bounds(points(g));
    assert.ok(b.y1 <= 124 && b.x1 >= 150, 'his story above him, to the right: ' + JSON.stringify(b));
  });
  // from the side: one nose, at the far right of the head (a face seen from the front would have it in the middle)
  const nose = foxOf(flew).map((p) => /^<path d="M([\d.]+) ([\d.]+)h\.1"/.exec(p)).filter(Boolean);
  assert.equal(nose.length, 1, 'one nose');
  const head = bounds(points(foxOf(flew)[0].replace(/ transform="[^"]+"/, '')));
  assert.ok(Number(nose[0][1]) >= head.x1 - 2, 'at the end of a long muzzle: ' + nose[0][1] + ' of ' + head.x1);
  assert.ok(head.x1 - head.x0 > 55, 'a long head, seen from the side');
  // a round moon: a whole circle
  assert.ok(/a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z/.test(moon), 'the moon is round');
  // two wings, one the mirror of the other, raised
  const wings = bounds(points(/<path d="[^"]+" transform="translate\(127 112\)"\/>/.exec(flew)[0].replace(/ transform="[^"]+"/, '')));
  assert.ok(Math.abs(wings.x0 + wings.x1) < 0.2, 'two wings, a matching pair: ' + JSON.stringify(wings));
  assert.ok(wings.y0 < -30, 'raised');
});

test('"Sprinkle can\'t fly" is one wing hanging down to the ground, nothing like the fox\'s pair', () => {
  const droop = group(art.card({ picture: 'cant-fly' }), 'pcc-pic');
  const pts = points(droop), b = bounds(pts);
  assert.ok(b.y1 - b.y0 > 100, 'it hangs a long way down');
  const d = /<path d="([^"]+)"/.exec(droop)[1], p = pathPoints(d);
  assert.ok(p[0][1] < 90, 'from the shoulder, high on the bark');
  const lowest = pts.reduce((a, q) => (q[1] > a[1] ? q : a));
  assert.ok(lowest[1] >= 190, 'to the ground');
  assert.notEqual(droop, group(art.card({ picture: 'fox-flew' }), 'pcc-pic'));
});

test('"two skinny shapes": two long thin outlines and one small thing between them, beside the two lines of a track; nothing with ears, tails or feet', () => {
  const pic = group(art.card({ picture: 'squall-shapes' }), 'pcc-pic');
  const paths = [...pic.matchAll(/<path d="([^"]+)" transform="([^"]+)"/g)].map((m) => ({ d: m[1], t: m[2] }));
  assert.ok(paths.every((p) => p.t === paths[0].t), 'one view, from above: everything turned together');
  const rails = paths[0].d;
  assert.ok(/^M-?[\d.]+ -8H[\d.]+M-?[\d.]+ 8H[\d.]+$/.test(rails), 'the two lines of a track: ' + rails);
  const closed = paths.map((p) => p.d).join('').match(/M[^M]*Z/g) || [];
  assert.equal(closed.length, 3, 'two shapes and the something');
  const boxes = closed.map((c) => bounds(pathPoints(c))).map((b) => ({ w: b.x1 - b.x0, h: b.y1 - b.y0, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, y0: b.y0 }));
  const long = boxes.filter((b) => b.h > 3 * b.w), small = boxes.filter((b) => b.h <= 3 * b.w);
  assert.equal(long.length, 2, 'two long low shapes');
  assert.equal(small.length, 1, 'carrying one thing');
  assert.ok(small[0].cx > Math.min(long[0].cx, long[1].cx) && small[0].cx < Math.max(long[0].cx, long[1].cx), 'between them');
  long.forEach((b) => assert.ok(b.y0 > 14, 'the shapes are on their way to the track, not on it'));
  assert.equal(paths.length, 4, 'and nothing else: the rails, the ties, the shapes, the something');
});

test('the "scale" shines and Sprinkle\'s scales do not: one smooth outline with shine lines, against a patch of many bumpy ones', () => {
  const scale = group(art.card({ picture: 'scale' }), 'pcc-pic'), patch = group(art.card({ picture: 'sprinkle-scales' }), 'pcc-pic');
  assert.equal((scale.match(/Z/g) || []).length, 1, 'the scale is one closed outline');
  const rays = /<path d="((?:M-?[\d.]+ -?[\d.]+L-?[\d.]+ -?[\d.]+)+)"/g;
  const lines = [...scale.matchAll(rays)].map((m) => (m[1].match(/M/g) || []).length);
  assert.ok(lines.reduce((a, b) => a + b, 0) >= 5, 'with shine lines');
  assert.equal((patch.match(/Z/g) || []).length, 0, 'the patch is open scallops');
  const bumps = (patch.match(/h\.1/g) || []).length;
  assert.equal(bumps, 12, 'a bump on every one of its twelve scales');
  assert.ok(!/L/.test(patch), 'and no shine lines on it');
});

test('"freshly dug earth": a heap with crumbs, above and behind a row of mice', () => {
  const pic = group(art.card({ picture: 'dug-earth' }), 'pcc-pic');
  const all = (pic.match(/<path d="([^"]+)"/g) || []).join(' ');
  const mice = (all.match(/M[\d.]+ [\d.]+C[^MZ]+Z/g) || []).map((m) => bounds(pathPoints(m)));
  assert.equal(mice.length, 4, 'a row of four');
  const crumbs = [...all.matchAll(/M([\d.]+) ([\d.]+)h\.1/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.ok(crumbs.length >= 8, 'crumbly');
  const top = Math.min(...mice.map((b) => b.y0));
  crumbs.forEach((p) => assert.ok(p[1] < top, 'the earth is behind the row (above it on the bark)'));
});

// ---------------------------------------------------------------- chapter 4's cards, as chapter 4 shipped them

test('chapter 4\'s nine cards, the blank curl, the two marks and the button are byte for byte what chapter 4 shipped', () => {
  // the first twelve hex digits of the SHA-256 of each drawing's markup: [small, large], each card with
  // its own mark. A change here is a change to a card a cat already holds: make it on purpose, and say so.
  // (Chapter 5's nine are not listed yet: add them here, the same way, once chapter 5 is live.)
  const SHIPPED = {
    'four-a-night': ['fc1da48a297e', '19c8ef864f2a'], tidy: ['4fc7163d65d7', '5493205ca21d'], 'dug-earth': ['b37003d84269', 'e7f5243b929a'],
    scale: ['569ea3564557', '58716d875e70'], 'fox-flew': ['810d99a4ee30', '6a2f4f89571c'], 'fox-moon': ['a9ab094f52aa', 'e5915254cb31'],
    'squall-shapes': ['e18205cd4ef5', 'd61262de545c'], 'sprinkle-scales': ['643843d96cb3', '4a9fe66b4600'], 'cant-fly': ['d009a0f4a91a', '8fc93f1dd92f']
  };
  const sum = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
  assert.deepEqual(Object.keys(SHIPPED), IDS, 'the nine');
  CARDS.forEach(([id, mark]) => {
    assert.deepEqual([sum(art.card({ picture: id, mark: mark })), sum(art.card({ picture: id, mark: mark, big: true }))], SHIPPED[id], id + ' is the card chapter 4 gave her');
  });
  assert.deepEqual([sum(art.card({ blank: true })), sum(art.card({ blank: true, big: true }))], ['69ac05683f3c', '40e9377a3dd0'], 'the blank curl');
  assert.deepEqual([sum(art.cardMark('eye')), sum(art.cardMark('ear'))], ['966d8d51ecf0', '6be968c46aa9'], 'the two marks by themselves');
  assert.equal(sum(art.fileIcon()), '57c599728011', 'the Case File button');
});

// ---------------------------------------------------------------- chapter 5's pictures

// The dark strokes of a card's picture, in the order they were scratched: [{ d, t, sw }] (sw: the
// stroke's own width when it has one; large, the pale lip under the strokes is left out).
function ink(id, big) {
  const g = group(art.card({ picture: id, big: !!big }), 'pcc-pic');
  assert.ok(g, id + ' has a picture');
  const dark = g.slice(g.lastIndexOf('<g stroke="#3A281E"'));
  return [...dark.matchAll(/<path d="([^"]+)"(?: transform="([^"]+)")?(?: stroke-width="([\d.]+)")?\/>/g)].map((m) => ({ d: m[1], t: m[2] || '', sw: m[3] ? Number(m[3]) : null }));
}
// A stroke's points where they lie on the card (its transform applied): `hull`, its ends and
// control points; `along`, points on the line itself.
function place(p, pts) {
  const M = matrix(p.t);
  return pts.map((q) => [M[0] * q[0] + M[2] * q[1] + M[4], M[1] * q[0] + M[3] * q[1] + M[5]]);
}
const hull = (p) => place(p, pathPoints(p.d));
const along = (p) => place(p, curvePoints(p.d));
function box(pts) {
  const b = bounds(pts);
  return { x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1, w: b.x1 - b.x0, h: b.y1 - b.y0, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2 };
}
const subpaths = (d) => d.match(/M[^M]+/g) || [];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const NUM = '-?[\\d.]+';
const PECKS = new RegExp('^(?:M' + NUM + ' ' + NUM + 'h\\.1)+$');
const SHORTS = new RegExp('^(?:M' + NUM + ' ' + NUM + 'L' + NUM + ' ' + NUM + ')+$');
const LEVELS = /^(?:M[\d.]+ [\d.]+H[\d.]+)+$/;
const closed = (paths) => paths.reduce((n, p) => n + (p.d.match(/Z/g) || []).length, 0);
// Strokes of one weight scratched one after another share a path: each line of it by itself.
const pieces = (paths) => paths.flatMap((p) => subpaths(p.d).map((d) => ({ d: d, t: p.t, sw: p.sw })));
const foxOf = (paths) => paths.filter((p) => /^translate\([\d.]+ [\d.]+\) scale\(1\)$/.test(p.t));
const moved = (paths) => paths.filter((p) => /^translate\([\d.]+ [\d.]+\)$/.test(p.t));

// The tiny prints on a card: one stroke of short pads, and after it the pecks, five to a pad. Each
// print: where its pad is, its five toes, the way it walks (from the pad to the middle of its toes),
// and how far it is across the toes. padWidth and toeWidth: how heavy the two are drawn.
function printsOn(id, big) {
  const paths = ink(id, big);
  const base = Number(/<g stroke="#3A281E" stroke-width="([\d.]+)"/.exec(group(art.card({ picture: id, big: !!big }), 'pcc-pic'))[1]);
  const at = paths.findIndex((p, i) => SHORTS.test(p.d) && paths[i + 1] && new RegExp('^(?:M' + NUM + ' ' + NUM + 'h\\.1){5}').test(paths[i + 1].d));
  assert.ok(at >= 0, id + ' has prints on it');
  const pads = subpaths(paths[at].d).map((s) => { const q = pathPoints(s); return [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[1][1]) / 2]; });
  const pecked = subpaths(paths[at + 1].d).slice(0, 5 * pads.length);
  assert.ok(pecked.length === 5 * pads.length && pecked.every((s) => PECKS.test(s)), id + ': five toes to a pad');
  const toes = pecked.map((s) => pathPoints(s)[0]);
  const list = pads.map((pad, i) => {
    const t = toes.slice(5 * i, 5 * i + 5);
    const mid = [t.reduce((a, q) => a + q[0], 0) / 5, t.reduce((a, q) => a + q[1], 0) / 5], far = dist(pad, mid);
    return { pad: pad, toes: t, way: [(mid[0] - pad[0]) / far, (mid[1] - pad[1]) / far], across: dist(t[0], t[4]) };
  });
  return { list: list, padWidth: paths[at].sw || base, toeWidth: paths[at + 1].sw || base, toes: pecked.join('') };
}

test('one drawing for every card chapter 5 can give: the ten in its text\'s table, nine of them new', () => {
  // the text's own table (docs/chapters/05, "Every card this chapter can give"): id, mark, picture, line
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/05-riffles-river.md'), 'utf8');
  const rows = md.split('\n').map((l) => /^\s*\|\s*`([a-z0-9-]+)`\s*\|\s*(eye|ear)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/.exec(l)).filter(Boolean);
  assert.deepEqual(rows.map((m) => [m[1], m[2]]), CARDS5, 'this test\'s list is the text\'s list, in its order, with its marks');
  assert.equal(IDS5.length, 9, 'nine new');
  assert.ok(/chapter 4/.test(rows.find((m) => m[1] === 'squall-shapes')[3]), 'and Squall\'s is chapter 4\'s drawing');
  // what each drawing says it is, for a reader who cannot see it, and the words of the table's
  // picture that it keeps
  const SAYS = {
    'prints-pile': ['a small crumbly heap of earth with three tiny prints in it', ['small crumbly heap', 'three tiny prints in it']],
    'puddle-paws': ['two little paws lifting a mouse off a heap of mice, under a zigzag of lightning', ['two little paws lifting a mouse off a heap', 'under a zigzag of lightning']],
    'otter-fox': ['a fox’s head beside an otter’s ear', ['a fox’s head beside an otter’s ear']],
    fur: ['a tuft of fur caught on a twist of vine', ['a tuft of fur caught on a twist of vine']],
    'heron-no-moon': ['a heron’s head under a dark sky: clouds, and no moon', ['a heron’s head under a dark sky: clouds', 'no moon']],
    'heron-shapes': ['a heron’s head, and under it two small low shapes, each with something in its mouth', ['a heron’s head, and under it two small low shapes, each with something in its mouth']],
    'prints-marsh': ['a line of tiny prints, and her own paw held over one, twice its size', ['a line of tiny prints, and her own paw held over one, twice its size']],
    'prints-tracks': ['a line of tiny prints running off to the two lines of a track', ['a line of tiny prints running off to', 'lines']],
    'wisp-fox': ['a fox’s head, a small shining thing falling from its mouth, and a ring of ripples', ['a fox', 'falling from its mouth', 'a ring of ripples']]
  };
  assert.deepEqual(Object.keys(SAYS), IDS5);
  IDS5.forEach((id) => {
    const p = art.cardPictures[id], picture = rows.find((m) => m[1] === id)[3];
    assert.ok(p && typeof p.draw === 'function', 'a drawing for ' + id);
    assert.equal(p.label, SAYS[id][0], id + ' says what it is');
    SAYS[id][1].forEach((words) => {
      assert.ok(picture.includes(words), id + ': the text\'s picture has "' + words + '" (' + picture + ')');
      assert.ok(p.label.includes(words), id + ': and so has the drawing\'s label');
    });
    assert.equal(art.card({ picture: id, mark: MARK[id] }).match(/aria-label="([^"]+)"/)[1], 'A piece of bark: ' + p.label + '; in its corner, ' + (MARK[id] === 'eye' ? 'an eye' : 'an ear'));
  });
  // nothing a card says gives away what nobody in the story has said yet
  ALL_IDS.forEach((id) => assert.ok(!/weasel|stoat|tunnel|glass|thief|snip|snatch/i.test(art.cardPictures[id].label), id + ' names no culprit'));
});

test('a tiny print is a pad and five little toes close together, and it walks the way its toes point', () => {
  ['prints-pile', 'prints-marsh', 'prints-tracks'].forEach((id) => {
    const small = printsOn(id), large = printsOn(id, true);
    assert.ok(small.list.length >= 3, id + ': a line of them');
    assert.deepEqual(large.list.map((p) => p.pad), small.list.map((p) => p.pad), id + ': the same prints in the same places, small and large');
    assert.deepEqual(large.list.map((p) => p.toes), small.list.map((p) => p.toes));
    assert.ok(small.padWidth > small.toeWidth * 1.6 && large.padWidth > large.toeWidth * 1.6, id + ': the pad is the heavy part');
    small.list.forEach((p, i) => {
      const ahead = p.toes.map((t) => (t[0] - p.pad[0]) * p.way[0] + (t[1] - p.pad[1]) * p.way[1]);
      const side = p.toes.map((t) => (t[0] - p.pad[0]) * -p.way[1] + (t[1] - p.pad[1]) * p.way[0]);
      ahead.forEach((a) => assert.ok(a > 1, id + ' print ' + i + ': every toe is ahead of the pad'));
      assert.ok(ahead[2] > ahead[1] && ahead[1] > ahead[0] && ahead[2] > ahead[3] && ahead[3] > ahead[4], id + ' print ' + i + ': the toes in an arc, the middle one furthest');
      for (let k = 1; k < 5; k++) {
        assert.ok(side[k] > side[k - 1], id + ' print ' + i + ': the toes in order across it');
        assert.ok(dist(p.toes[k], p.toes[k - 1]) < 0.4 * p.across, id + ' print ' + i + ': close together');
      }
      assert.ok(Math.abs(side[0] + side[4]) < 0.3 && Math.abs(side[2]) < 0.3, id + ' print ' + i + ': even on both sides of the pad');
      assert.ok(Math.max(...ahead) < p.across, id + ' print ' + i + ': a short, wide print');
      // small, the toes run into one beaded line (nobody counts them): there is less bark between two
      // than a toe is wide; large, each stands by itself
      const step = Math.min(...p.toes.slice(1).map((t, k) => dist(t, p.toes[k])));
      assert.ok(step - small.toeWidth < 0.62 * small.toeWidth, id + ' print ' + i + ': small, the toes run together (' + r1(step - small.toeWidth) + ' between, ' + small.toeWidth + ' wide)');
      if (id !== 'prints-tracks') assert.ok(step - large.toeWidth > 0.62 * large.toeWidth, id + ' print ' + i + ': large, there is bark between them (' + r1(step - large.toeWidth) + ' between, ' + large.toeWidth + ' wide)');
    });
  });
});

test('the prints behind the pile and the prints at the marsh are sized one way ("half the size of yours", twice); from the top of the pole they are smaller', () => {
  // (a print's points are set down to a tenth, so a turned one measures a hair differently)
  const size = (id) => { const s = printsOn(id).list.map((p) => p.across); assert.ok(Math.max(...s) - Math.min(...s) < 0.3, id + ': every print on a card is one size'); return s[0]; };
  assert.ok(Math.abs(size('prints-pile') - size('prints-marsh')) < 0.3, 'the two cards the file lays touching: ' + r1(size('prints-pile')) + ' and ' + r1(size('prints-marsh')));
  assert.ok(size('prints-tracks') < size('prints-marsh') * 0.75, 'and smaller from up the pole');
  assert.ok(size('prints-marsh') < 24, 'tiny: under an eighth of the bark across');
});

test('"Tiny prints in the dug earth": her dug-earth heap again, half as big again, three prints going up it, and no row of mice', () => {
  const paths = ink('prints-pile'), heap = paths[0], was = ink('dug-earth').find((p) => /^M52 147C/.test(p.d));
  assert.ok(was, 'chapter 4\'s heap');
  assert.ok(!/Z/.test(heap.d), 'an open heap');
  // the same outline: each point in the same place across and up its own box
  const norm = (p) => { const q = hull(p), b = box(q); return q.map((v) => [(v[0] - b.x0) / b.w, (v[1] - b.y0) / b.h]); };
  const a = norm(heap), b = norm(was);
  assert.equal(a.length, b.length);
  a.forEach((v, i) => assert.ok(Math.abs(v[0] - b[i][0]) < 0.004 && Math.abs(v[1] - b[i][1]) < 0.004, 'point ' + i + ' of the heap is the dug-earth heap\'s'));
  assert.equal(r1(box(hull(heap)).w / box(hull(was)).w), 1.5, 'half as big again');
  assert.equal(closed(paths), 0, 'and no mice on this one: nothing closed');
  // three prints, walking one way, up and across the heap, every bit of them inside it
  const prints = printsOn('prints-pile').list, line = along(heap), feet = box(line);
  assert.equal(prints.length, 3, 'three prints');
  const under = (x) => line.filter((q) => Math.abs(q[0] - x) < 6).reduce((y, q) => Math.min(y, q[1]), 1e9);   // the heap's outline over x
  prints.forEach((p, i) => {
    assert.ok(Math.abs(p.way[0] - prints[0].way[0]) < 0.01 && Math.abs(p.way[1] - prints[0].way[1]) < 0.01, 'all three walk one way');
    assert.ok(p.way[0] > 0.5 && p.way[1] < -0.2, 'up the heap and across it');
    p.toes.concat([p.pad]).forEach((q) => {
      assert.ok(q[0] > feet.x0 + 20 && q[0] < feet.x1 - 20 && q[1] < feet.y1 - 6, 'print ' + i + ' is on the heap');
      assert.ok(q[1] - under(q[0]) > 8, 'print ' + i + ' is inside its outline (' + r1(q[1] - under(q[0])) + ' under it)');
    });
    if (i) assert.ok(p.pad[0] > prints[i - 1].pad[0] + 18 && p.pad[1] < prints[i - 1].pad[1], 'print ' + i + ' is the next step up');
  });
  // crumbly: loose crumbs round it, none where it could be taken for a toe
  const toes = printsOn('prints-pile').toes;
  const crumbs = paths.filter((p) => PECKS.test(p.d) && p.d !== toes).flatMap((p) => subpaths(p.d).map((s) => pathPoints(s)[0]));
  assert.ok(crumbs.length >= 6, 'crumbs');
  crumbs.forEach((q) => {
    assert.ok(q[1] < under(q[0]) - 4, 'a crumb lies outside the heap: ' + q);
    prints.forEach((p) => assert.ok(dist(q, p.pad) > 20, 'and well clear of the prints'));
  });
  const pecks = (big) => ink('prints-pile', big).filter((p) => PECKS.test(p.d)).reduce((n, p) => n + subpaths(p.d).length, 0);
  assert.equal(pecks(false), 15 + crumbs.length, 'fifteen toes and the crumbs');
  assert.ok(pecks(true) > pecks(false), 'large, a few crumbs more');
});

test('"Much smaller than a cat\'s": a line of five tiny prints across the mud, and her own paw held to one, twice its size: a paw, never a print of hers', () => {
  const paths = ink('prints-marsh'), found = printsOn('prints-marsh'), prints = found.list;
  assert.equal(prints.length, 5, 'five prints');
  prints.forEach((p) => assert.ok(p.way[0] > 0.99, 'all walking the same way, across the bark'));
  const xs = prints.map((p) => p.pad[0]), ys = prints.map((p) => p.pad[1]);
  const steps = xs.slice(1).map((x, i) => r1(x - xs[i]));
  assert.equal(new Set(steps).size, 1, 'evenly spaced: ' + steps.join(', '));
  assert.ok(xs[0] < 45 && xs[4] > 155, 'right across the bark');
  assert.equal(new Set(ys.map(r1)).size, 2, 'left feet and right feet');
  assert.ok(Math.max(...ys) - Math.min(...ys) <= 10 && ys[0] === ys[2] && ys[1] === ys[3], 'in one line, a step to each side');
  // her paw: one open outline that comes up from the foot of the picture (her own leg, from the raft)
  const legs = paths.filter((p) => /^M[\d.]+ 204C/.test(p.d) && / 204$/.test(p.d));
  assert.equal(legs.length, 1, 'one paw');
  const paw = legs[0], line = along(paw), pb = box(line);
  assert.ok(!/Z/.test(paw.d), 'open at the foot of the picture: a leg, not a mark in the mud');
  assert.ok(pb.h > 70, 'her leg comes all the way up from the raft');
  // four toes: four rises along its top, with a line between each pair
  const top = line.filter((q) => q[1] < pb.y0 + 16);
  let rises = 0;
  for (let i = 1; i < top.length - 1; i++) if (top[i][1] < top[i - 1][1] && top[i][1] <= top[i + 1][1]) rises++;
  assert.equal(rises, 4, 'four toes');
  const between = paths.find((p) => /^(?:M[\d.]+ [\d.]+V[\d.]+){3}$/.test(p.d));
  assert.ok(between, 'and the three lines between them');
  // held over one print: the middle one is right over her toes, and close
  const mid = prints[2], low = Math.max(...mid.toes.concat([mid.pad]).map((q) => q[1]));
  assert.ok(Math.abs(mid.pad[0] + 0.5 * (mid.toes[2][0] - mid.pad[0]) - pb.cx) < 4, 'the middle print is over the middle of her paw');
  assert.ok(pb.y0 - low > 4 && pb.y0 - low < 18, 'just clear of her toes (' + r1(pb.y0 - low) + ')');
  // twice its size, as they are drawn at the size of a paw: line to line
  const pawWide = pb.w + 4.3, printWide = mid.across + found.toeWidth;
  assert.ok(pawWide / printWide > 1.8 && pawWide / printWide < 2.3, 'her paw is twice as wide as a print (' + r1(pawWide / printWide) + ')');
  // never a cat's print in ReedClan's mud: nothing pecked or padded inside her paw, and no print as big as it
  prints.forEach((p) => p.toes.concat([p.pad]).forEach((q) => assert.ok(!(q[0] > pb.x0 - 2 && q[0] < pb.x1 + 2 && q[1] > pb.y0 - 2), 'no print under her paw')));
  assert.equal(paths.filter((p) => PECKS.test(p.d)).length, 1, 'and the only pecks on the bark are the tiny prints\' toes');
});

test('"toward the train tracks": Squall\'s own track, and six tiny prints running straight at it where his card has the two shapes', () => {
  const paths = ink('prints-tracks'), squall = ink('squall-shapes');
  assert.deepEqual(paths.slice(0, 2), squall.slice(0, 2), 'the rails and the ties of Squall\'s card, in the same place at the same slant');
  assert.deepEqual(ink('prints-tracks', true).slice(0, 2), ink('squall-shapes', true).slice(0, 2), 'large too');
  assert.equal(paths.length, 4, 'and nothing else but the prints: no shapes, nobody');
  const prints = printsOn('prints-tracks').list;
  assert.equal(prints.length, 6, 'six prints');
  // in the track's own frame the rails lie level at -8 and 8, and her side of them is below
  const M = matrix(paths[0].t), det = M[0] * M[3] - M[1] * M[2];
  const back = (q) => [(M[3] * (q[0] - M[4]) - M[2] * (q[1] - M[5])) / det, (M[0] * (q[1] - M[5]) - M[1] * (q[0] - M[4])) / det];
  const own = prints.map((p) => ({ pad: back(p.pad), toes: p.toes.map(back) }));
  own.forEach((p, i) => {
    assert.ok(Math.abs(p.pad[0]) < 8, 'print ' + i + ' is in the line');
    p.toes.forEach((t) => assert.ok(t[1] < p.pad[1], 'print ' + i + ' points at the track'));
    assert.ok(Math.min(...p.toes.map((t) => t[1])) > 8 + 4, 'print ' + i + ' is on her side of the rails');
    if (i) {
      assert.equal(r1(p.pad[1] - own[i - 1].pad[1]), r1(own[1].pad[1] - own[0].pad[1]), 'even steps');
      assert.ok(p.pad[0] * own[i - 1].pad[0] < 0, 'left foot, right foot');
    }
  });
  assert.ok(Math.min(...own[0].toes.map((t) => t[1])) < 8 + 16, 'the first of them is nearly at the rail: they run off to it');
  assert.ok(own[5].pad[1] > 100, 'and the line is a long one');
  // where Squall's two shapes are, on his card: the two cards touch in the file ("Both lead toward the tracks.")
  const shapes = box(squall.slice(2).flatMap((p) => along(p))), trail = box(prints.flatMap((p) => p.toes.concat([p.pad])));
  assert.ok(trail.cx > shapes.x0 && trail.cx < shapes.x1 && trail.cy > shapes.y0 && trail.cy < shapes.y1, 'the prints lie where the shapes went');
});

test('"clever little paws": two paws and nothing of whose, lifting the top mouse off a heap of five, under one zigzag of lightning', () => {
  const paths = ink('puddle-paws'), all = paths.map((p) => p.d).join(' ');
  // six mice: a heap of three and two, and the one that was on top, held up over it
  const mice = (all.match(/M[\d.]+ [\d.]+C[^MZ]+Z/g) || []).map((m) => box(curvePoints(m)));
  assert.equal(mice.length, 6, 'six mice');
  assert.equal(closed(paths), 6, 'and nothing else closed');
  const rows = [...new Set(mice.map((m) => r1(m.y1)))].sort((a, b) => b - a).map((y) => mice.filter((m) => r1(m.y1) === y));
  assert.deepEqual(rows.map((r) => r.length), [3, 2, 1], 'three, two on them, and one in the air');
  const heap = box(rows[0].concat(rows[1]).flatMap((m) => [[m.x0, m.y0], [m.x1, m.y1]])), up = rows[2][0];
  assert.ok(Math.abs(up.cx - heap.cx) < 3, 'the lifted one is right over the heap');
  assert.ok(heap.y0 - up.y1 > 12, 'and clear of it (' + r1(heap.y0 - up.y1) + ')');
  assert.ok(up.w > rows[0][0].w, 'it is the one to look at: drawn a little bigger');
  // two paws: open outlines, one each side of that mouse, at its height, round ends toward it
  const bits = pieces(paths);
  const paws = bits.filter((p) => new RegExp('^M' + NUM + ' ' + NUM + 'L' + NUM + ' ' + NUM + 'C[-\\d. ]+C[-\\d. ]+L' + NUM + ' ' + NUM + '$').test(p.d));
  assert.equal(paws.length, 2, 'two paws');
  const pb = paws.map((p) => box(along(p))).sort((a, b) => a.cx - b.cx);
  assert.ok(pb[0].x1 < up.cx && pb[1].x0 > up.cx, 'one on each side of the mouse');
  pb.forEach((b) => {
    assert.ok(b.y0 < up.y1 && b.y1 > up.y0 - 12, 'at its height');
    assert.ok(Math.max(b.w, b.h) < 40 && Math.min(b.w, b.h) < up.w, 'little paws: smaller than the mouse they lift');
  });
  assert.ok(Math.abs((up.cx - pb[0].cx) - (pb[1].cx - up.cx)) < 3, 'a matching pair');
  assert.ok(up.x0 - pb[0].x1 < 4 && pb[1].x0 - up.x1 < 4, 'holding it');
  // nothing of whose: each paw ends in a bare wrist (the two ends of its outline), and nothing joins it there
  paws.forEach((p, i) => {
    const q = hull(p), wrist = [q[0], q[q.length - 1]];
    assert.ok(dist(wrist[0], wrist[1]) > 8 && dist(wrist[0], wrist[1]) < 20, 'paw ' + i + ' has a wrist');
    bits.filter((o) => o !== p).forEach((o) => along(o).forEach((v) => wrist.forEach((w) => assert.ok(dist(v, w) > 8, 'nothing is joined to paw ' + i + ': no leg, no body'))));
    const far = wrist.map((w) => Math.abs(w[0] - up.cx));
    assert.ok(Math.min(...far) > Math.abs(box(along(p)).cx - up.cx), 'paw ' + i + ' reaches in toward the mouse from outside');
  });
  // the storm night: one zigzag, down the bark from its top
  const bolts = bits.filter((p) => /^M[\d.]+ [\d.]+L[\d.]+ [\d.]+H[\d.]+L[\d.]+ [\d.]+$/.test(p.d));
  assert.equal(bolts.length, 1, 'one zigzag');
  const z = pathPoints(bolts[0].d);
  assert.ok(z[0][1] < 66 && z[3][1] > z[0][1] + 60, 'from the top of the bark, a long way down');
  assert.ok(z[1][0] < z[0][0] && z[2][0] > z[1][0] && z[3][0] < z[2][0] && z[1][1] === z[2][1], 'left, right, left');
  assert.ok(z[3][1] < heap.y0, 'over the heap');
  assert.ok(Math.min(...z.map((q) => q[0])) > pb[1].x1, 'and clear of the paws');
  assert.ok(bolts[0].sw === null, 'in the heaviest line on the bark: FLASH');
});

test('every fox on a card is the one fox: the same head, side on, on the two chapter 4 gave her and the two she gets today', () => {
  ['fox-moon', 'otter-fox', 'wisp-fox'].forEach((id) => {
    [false, true].forEach((big) => {
      const strip = (list) => list.map((p) => [p.d, p.sw]);
      assert.deepEqual(strip(foxOf(ink(id, big))), strip(foxOf(ink('fox-flew', big))), id + (big ? ', large' : '') + ': the fox of "the fox says it FLEW"');
    });
    assert.ok(foxOf(ink(id)).length >= 2);
    assert.equal(new Set(foxOf(ink(id)).map((p) => p.t)).size, 1, id + ': one fox, in one place');
  });
});

test('"the fox told him": the fox\'s nose at the old otter\'s ear, and the otter looking the other way', () => {
  const paths = ink('otter-fox'), fox = foxOf(paths), otter = moved(paths);
  assert.equal(fox.length + otter.length, paths.length, 'a fox and an otter, and nothing else');
  assert.equal(new Set(otter.map((p) => p.t)).size, 1, 'one otter');
  const nose = hull(fox.find((p) => PECKS.test(p.d)))[0];
  const lines = pieces(otter), head = box(along(lines[0])), ear = box(along(lines[1]));
  assert.ok(!/Z/.test(lines[0].d) && head.h > 55 && head.w > 55, 'his head and his thick neck, open at the foot');
  // a small round ear, on the back of his head, and it is the nearest thing to the fox's nose
  assert.ok(ear.w > 12 && ear.w < 30 && Math.abs(ear.w - ear.h) < 6, 'a small round ear: ' + r1(ear.w) + ' by ' + r1(ear.h));
  assert.ok(ear.x0 <= head.x0 + 2 && ear.cx < head.cx - 18, 'on the back of his head');
  assert.ok(nose[1] > ear.y0 && nose[1] < ear.y1, 'the fox\'s nose is level with it');
  assert.ok(ear.x0 - nose[0] > 8 && ear.x0 - nose[0] < 24, 'and close to it (' + r1(ear.x0 - nose[0]) + ')');
  otter.forEach((p) => along(p).forEach((q) => assert.ok(dist(q, nose) >= dist([ear.x0, nose[1]], nose) - 1, 'nothing of the otter is nearer the fox than his ear')));
  // the otter faces away: his own nose and his whiskers are at the far side
  const pecks = otter.filter((p) => PECKS.test(p.d)).sort((a, b) => b.sw - a.sw).map((p) => hull(p)[0]);
  assert.equal(pecks.length, 2, 'a nose and an eye');
  assert.ok(pecks[0][0] > ear.x1 + 30 && pecks[1][0] > ear.x1 + 15, 'his face is turned away from the fox');
  const whiskers = otter.find((p) => /^(?:M[\d.]+ [\d.]+Q[\d. ]+){3}$/.test(p.d));
  assert.ok(whiskers && box(along(whiskers)).x1 > pecks[0][0] + 3, 'long whiskers, past his nose');
  // the fox is the taller of the two, leaning to him
  assert.ok(box(fox.flatMap((p) => along(p))).y0 < head.y0, 'the fox\'s ears stand over the otter');
  // large, he is told something: two small curves between the nose and the ear
  const told = ink('otter-fox', true).filter((p) => !p.t && /^(?:M[\d.]+ [\d.]+Q[\d. ]+){2}$/.test(p.d));
  assert.equal(told.length, 1);
  along(told[0]).forEach((q) => assert.ok(q[0] > nose[0] + 3 && q[0] < ear.x0 + 1, 'between the two of them'));
});

test('"Thin brown fur": one vine with a twist in it and two leaves, and a tuft of thin hairs caught in the twist', () => {
  const paths = ink('fur'), vine = paths[0], line = along(vine), vb = box(line);
  assert.ok(vine.sw === null && !/Z/.test(vine.d), 'the vine: one open line, the heaviest');
  assert.ok(vb.w >= 140, 'right across the bark');
  // a twist: the line turns back on itself and crosses over
  const backs = line.filter((q, i) => i && q[0] < line[i - 1][0]);
  assert.ok(backs.length >= 3, 'the vine turns back on itself');
  const twist = box(backs);
  assert.ok(twist.w < 30 && twist.cx > vb.x0 + 50 && twist.cx < vb.x1 - 50, 'one small twist, in the middle');
  // two leaves, each growing from the vine
  const leaves = paths.filter((p) => /Z/.test(p.d)).flatMap((p) => subpaths(p.d));
  assert.equal(leaves.length, 2, 'two leaves');
  leaves.forEach((l) => {
    const pts = curvePoints(l);
    assert.ok(Math.min(...pts.map((q) => Math.min(...line.map((v) => dist(q, v))))) < 4, 'a leaf grows from the vine');
    assert.ok(Math.min(...pts.map((q) => dist(q, [twist.cx, twist.cy]))) > 25, 'away from the twist');
  });
  // the tuft: thin hairs, all caught at one place in the twist, hanging and spreading
  const hairsOf = (list) => list.filter((p) => p.sw !== null && /^(?:M[\d.]+ [\d.]+C[\d. ]+)+$/.test(p.d) && !/Z/.test(p.d)).flatMap((p) => subpaths(p.d).map((s) => ({ pts: curvePoints(s), sw: p.sw })));
  const hairs = hairsOf(paths);
  assert.ok(hairs.length >= 7, 'a tuft of hairs (' + hairs.length + ')');
  hairs.forEach((h) => assert.ok(h.sw < 4.3 * 0.75, 'thin fur'));
  const roots = box(hairs.map((h) => h.pts[0])), tips = box(hairs.map((h) => h.pts[h.pts.length - 1]));
  assert.ok(roots.w < 9 && roots.h < 6, 'caught at one place');
  assert.ok(roots.cx > twist.x0 - 2 && roots.cx < twist.x1 + 2 && roots.cy > twist.y0 && roots.cy < twist.y1 + 2, 'in the twist');
  hairs.forEach((h) => assert.ok(h.pts[h.pts.length - 1][1] > h.pts[0][1] + 18, 'every hair hangs'));
  assert.ok(tips.w > 40, 'and the tuft spreads (' + r1(tips.w) + ')');
  assert.ok(new Set(hairs.map((h) => r1(dist(h.pts[0], h.pts[h.pts.length - 1])))).size >= 5, 'ragged: no two hairs much the same');
  assert.ok(hairsOf(ink('fur', true)).length >= hairs.length + 4, 'large, more hairs in it');
});

test('Patience\'s two cards share one heron, side on: a long bill, one round eye, and the stripe that runs back into a plume', () => {
  const sky = moved(ink('heron-no-moon')), mud = moved(ink('heron-shapes'));
  const strip = (list) => list.map((p) => [p.d, p.sw]);
  assert.deepEqual(strip(sky), strip(mud), 'the same heron on both');
  assert.deepEqual(strip(moved(ink('heron-no-moon', true))), strip(moved(ink('heron-shapes', true))), 'large too');
  assert.notEqual(sky[0].t, mud[0].t, 'low under the sky on one, high over the shapes on the other');
  assert.ok(matrix(sky[0].t)[5] > matrix(mud[0].t)[5] + 40);
  assert.ok(moved(ink('heron-no-moon', true)).length > sky.length, 'large: her shut bill, a second plume');
  // in her own box: the head, then the bill out to a point at the right
  const own = pieces(sky).map((p) => ({ d: p.d, sw: p.sw, pts: curvePoints(p.d) }));
  const head = own[0], hb = box(head.pts), tip = head.pts.reduce((a, q) => (q[0] > a[0] ? q : a));
  assert.ok(/L[\d.]+ [\d.]+L[\d.]+ [\d.]+/.test(head.d), 'two straight edges meet at the tip of her bill');
  const eyes = own.filter((p) => PECKS.test(p.d));
  assert.equal(eyes.length, 1, 'one eye, to the viewer');
  const eye = eyes[0].pts[0];
  assert.ok(tip[0] - eye[0] > 55, 'a long bill (' + r1(tip[0] - eye[0]) + ' from her eye)');
  assert.ok(Math.abs(tip[1] - eye[1]) < 10, 'held level');
  assert.ok(hb.w > 2.2 * (eye[0] - hb.x0), 'most of her head is bill');
  // the neck goes down and back from the head, two lines, and stops: a head and no more
  const neck = own[1], nb = box(neck.pts);
  assert.ok(nb.y1 > eye[1] + 40 && nb.x0 < eye[0] - 30, 'her neck curves down and back');
  assert.ok(!own.some((p) => /Z/.test(p.d)), 'nothing closed: no body');
  // the stripe starts over her eye and runs back past her head as a plume
  const stripe = own.find((p) => p !== head && p !== neck && !PECKS.test(p.d));
  assert.ok(dist(stripe.pts[0], eye) < 9 && stripe.pts[0][1] < eye[1], 'the stripe starts just over her eye');
  const end = stripe.pts[stripe.pts.length - 1];
  assert.ok(end[0] < Math.min(...head.pts.map((q) => q[0])) - 15 && end[1] > eye[1] + 10, 'and trails off behind her head');
  assert.ok(box(own.flatMap((p) => p.pts)).w >= 110, 'she is as wide as the bark allows');
});

test('"NO moon": clouds where the fox\'s card has its moon, a sky scratched dark, nothing round in it and nothing coming down', () => {
  [false, true].forEach((big) => {
    const paths = ink('heron-no-moon', big), heron = moved(paths), sky = paths.filter((p) => !heron.includes(p));
    const clouds = sky.filter((p) => /Z/.test(p.d)), dark = sky.filter((p) => !clouds.includes(p));
    // clouds: closed, flat-footed, scalloped on top
    const each = clouds.flatMap((p) => subpaths(p.d));
    assert.equal(each.length, 2, 'two clouds');
    const boxes = each.map((d) => box(curvePoints(d)));
    each.forEach((d, i) => {
      const pts = pathPoints(d);
      assert.equal(pts[0][1], pts[pts.length - 1][1], 'a flat foot');
      assert.equal(r1(boxes[i].y1), pts[0][1], 'and nothing of the cloud below it');
      assert.equal((d.match(/C/g) || []).length, 4, 'four soft bumps');
      assert.ok(boxes[i].w > 2 * boxes[i].h, 'wide and low');
    });
    // everything else in the sky is a level scratch: dark, and not rain
    assert.ok(dark.length >= 1 && dark.every((p) => LEVELS.test(p.d)), 'nothing in the sky but clouds and level scratches: no rain lines');
    const lines = dark.flatMap((p) => subpaths(p.d).map((d) => pathPoints(d)));
    assert.ok(lines.length >= 5, 'scratched dark (' + lines.length + ' lines)');
    assert.ok(lines.reduce((n, l) => n + l[1][0] - l[0][0], 0) > 300, 'most of the way across, over and over');
    lines.forEach((l) => each.forEach((d) => curvePoints(d).forEach((q) => {
      assert.ok(!(q[0] > l[0][0] - 3 && q[0] < l[1][0] + 3 && Math.abs(q[1] - l[0][1]) < 3), 'the dark stops at a cloud: the clouds are pale');
    })));
    // no moon: nothing round, nothing closed but the clouds, and a cloud lies where the fox's moon is
    paths.forEach((p) => assert.ok(!/[aA]/.test(p.d), 'no arc anywhere: nothing round'));
    assert.equal(closed(paths), 2, 'nothing closed but the two clouds');
    const moon = /<path d="M(\d+) (\d+)a(\d+) \3 0 1 0 (\d+) 0/.exec(group(art.card({ picture: 'fox-moon' }), 'pcc-pic'));
    const centre = [Number(moon[1]) + Number(moon[3]), Number(moon[2])];
    assert.deepEqual(centre, [140, 94], 'the fox\'s moon');
    assert.ok(boxes.some((b) => centre[0] > b.x0 + 8 && centre[0] < b.x1 - 8 && centre[1] > b.y0 && centre[1] < b.y1), 'a cloud is where the fox\'s card has its moon');
    // and all of it over her head
    const top = box(heron.flatMap((p) => along(p))).y0;
    sky.forEach((p) => hull(p).forEach((q) => assert.ok(q[1] < top - 4, 'the sky is over her head')));
    assert.ok(box(sky.flatMap((p) => hull(p))).w > 140, 'right across the bark');
  });
});

test('"two small shapes": under the heron, two long low outlines, each with one small thing at its front end, on her mud; Squall\'s kind of shape, and smaller', () => {
  const paths = ink('heron-shapes'), heron = moved(paths), rest = paths.filter((p) => !heron.includes(p));
  const shapes = rest.filter((p) => /rotate\(90\)$/.test(p.t));
  assert.equal(shapes.length, 2, 'two shapes');
  assert.equal(shapes[0].d, shapes[1].d, 'the same outline twice');
  assert.equal(closed(shapes), 2);
  const sb = shapes.map((p) => box(along(p)));
  sb.forEach((b) => assert.ok(b.w > 3 * b.h && b.h < 16, 'long and low: ' + r1(b.w) + ' by ' + r1(b.h)));
  // Squall's shapes are the same kind of outline (nothing with ears, tails or feet), and these are the smaller
  const his = ink('squall-shapes').find((p) => (p.d.match(/Z/g) || []).length === 2), one = subpaths(his.d).filter((d) => /Z/.test(d))[0];
  const hb = box(curvePoints(one));
  assert.equal((shapes[0].d.match(/C/g) || []).length, (one.match(/C/g) || []).length, 'drawn the way Squall\'s are');
  sb.forEach((b) => assert.ok(b.w < hb.h - 8, 'small shapes: shorter than his (' + r1(b.w) + ' to ' + r1(hb.h) + ')'));
  // each carries something: one small closed thing at its front end, level with it
  const things = rest.filter((p) => !p.t && /Z/.test(p.d)).flatMap((p) => subpaths(p.d)).map((d) => box(curvePoints(d)));
  assert.equal(things.length, 2, 'two somethings');
  assert.equal(closed(paths), 4, 'and nothing else closed: two shapes, two somethings');
  sb.forEach((b, i) => {
    const mine = things.filter((t) => Math.abs(t.cy - b.cy) < 3 && t.x0 > b.x1 - 3 && t.x0 < b.x1 + 4);
    assert.equal(mine.length, 1, 'shape ' + i + ' has one thing at its front end');
    assert.ok(mine[0].w < 14 && mine[0].h < 14 && mine[0].w < b.w / 3, 'a small thing');
  });
  // both going the same way, one after the other, not side by side (each carries its own)
  assert.ok(Math.abs(sb[0].cy - sb[1].cy) > 20 && Math.abs(sb[0].cx - sb[1].cx) > 30, 'one behind the other');
  // her mud: a level line under each
  const mud = rest.filter((p) => LEVELS.test(p.d)).flatMap((p) => subpaths(p.d).map((d) => pathPoints(d)));
  assert.equal(mud.length, 2, 'two lines of mud');
  sb.forEach((b, i) => assert.equal(mud.filter((l) => l[0][1] > b.y1 && l[0][1] < b.y1 + 12 && l[0][0] < b.x0 && l[1][0] > b.x1).length, 1, 'shape ' + i + ' is on the mud'));
  assert.equal(rest.length, 2 + 1 + 1, 'and that is all: the shapes, the somethings, the mud');
  // under the heron
  const low = box(heron.flatMap((p) => along(p))).y1;
  sb.concat(things).forEach((b) => assert.ok(b.y0 > low + 4, 'under her head'));
});

test('"Wisp drew a fox": the fox, a small "scale" with shine lines under his nose, and a ring of ripples under that', () => {
  const paths = ink('wisp-fox'), fox = foxOf(paths), rest = paths.filter((p) => !fox.includes(p));
  const nose = hull(fox.find((p) => PECKS.test(p.d)))[0], fb = box(fox.flatMap((p) => along(p)));
  // the small thing: the outline of her "scale" card, a third of the size
  const bits = pieces(rest), thing = bits.find((p) => /Z/.test(p.d) && !/a/.test(p.d)), tb = box(along(thing));
  const scale = ink('scale')[0], cb = box(along(scale));
  assert.equal((thing.d.match(/[A-Z]/g) || []).join(''), (scale.d.match(/[A-Z]/g) || []).join(''), 'drawn stroke for stroke as the scale is');
  assert.ok(Math.abs(tb.w / tb.h - cb.w / cb.h) < 0.02, 'the same shape');
  assert.ok(tb.w / cb.w > 0.25 && tb.w / cb.w < 0.36, 'small (' + r1(tb.w) + ' across to the scale\'s ' + r1(cb.w) + ')');
  assert.ok(thing.sw === null, 'in a full line: it is the thing to see');
  // falling from his mouth: under his nose, below his chin
  assert.ok(Math.abs(tb.cx - nose[0]) < 12, 'under his nose');
  assert.ok(tb.y0 > nose[1] + 12 && tb.y0 > fb.y1 - 6, 'below his head');
  // with shine lines: short rays, each pointing away from it
  const rays = bits.filter((p) => SHORTS.test(p.d)).map((p) => pathPoints(p.d));
  assert.ok(rays.length >= 4, 'shine lines');
  rays.forEach((r) => {
    const near = dist(r[0], [tb.cx, tb.cy]), far = dist(r[1], [tb.cx, tb.cy]);
    assert.ok(far > near + 6 && near > tb.w / 2 && near < tb.w * 1.3, 'a ray stands off it and points away');
  });
  assert.ok(rays.some((r) => r[0][0] < tb.cx) && rays.some((r) => r[0][0] > tb.cx), 'on both sides');
  // a ring of ripples: flat ovals about one middle, under the thing, the lowest things on the bark
  const rings = bits.map((p) => new RegExp('^M(' + NUM + ') (' + NUM + ')a(' + NUM + ') (' + NUM + ') 0 1 0 ' + NUM + ' 0a\\3 \\4 0 1 0 ' + NUM + ' 0Z$').exec(p.d)).filter(Boolean)
    .map((m) => ({ cx: Number(m[1]) + Number(m[3]), cy: Number(m[2]), rx: Number(m[3]), ry: Number(m[4]) }));
  assert.equal(rings.length, 2, 'two rings');
  rings.forEach((r) => {
    assert.ok(r.ry < r.rx / 3, 'flat: seen from the bank');
    assert.equal(r.cx, rings[0].cx);
    assert.equal(r.cy, rings[0].cy);
    assert.ok(Math.abs(r.cx - tb.cx) < 6, 'under the thing');
    assert.ok(r.cy - r.ry > tb.y1 + 6, 'well below it: it has not landed');
  });
  assert.ok(rings[0].rx > 2 * rings[1].rx || rings[1].rx > 2 * rings[0].rx, 'one inside the other');
  assert.ok(Math.max(...rings.map((r) => r.rx)) * 2 > fb.w, 'spreading wider than the fox\'s head');
  assert.equal(bits.length, 1 + rays.length + 2, 'and that is all she drew: the thing, its shine, two rings');
  // top to bottom: the fox, the thing, the ripples
  assert.ok(fb.cy < tb.cy && tb.cy < rings[0].cy);
  assert.equal(closed(rest), 3, 'no reeds, nobody else');
});

// ---------------------------------------------------------------- pictures nobody has drawn, and new ones

test('a picture nobody has drawn gives the bare bark with its mark, never an error', () => {
  const bare = art.card({ mark: 'ear' });
  ['prints', '', 'constructor', 'toString', 'hasOwnProperty', '__proto__', 42, {}, [], true].forEach((p) => {
    assert.equal(art.card({ picture: p, mark: 'ear' }), bare, 'picture ' + JSON.stringify(p));
  });
  assert.equal(art.card({ picture: 'prints' }), art.card({ blank: true }), 'and with no mark it is a blank curl');
});

test('a later chapter can add a drawing of its own, with the same claw', () => {
  const calls = [];
  art.cardPictures['test-prints'] = { label: 'a line of "paw" prints & <more>', draw: (c) => {
    calls.push(c.big);
    c.line('M40 100L160 100').fine('M40 120L160 120', { w: 0.5 }).dot(100, 150).line('M0 0L10 0', { t: 'translate(60 180)' });
  } };
  try {
    const small = art.card({ picture: 'test-prints', mark: 'eye' }), big = art.card({ picture: 'test-prints', mark: 'eye', big: true });
    checkSvg(small, '0 0 200 240', 'added, small');
    checkSvg(big, '0 0 200 240', 'added, big');
    assert.deepEqual(calls, [false, true], 'the claw says which size it is drawing');
    assert.ok(/aria-label="A piece of bark: a line of &quot;paw&quot; prints &amp; &lt;more&gt;; in its corner, an eye"/.test(small), 'its label is escaped');
    const sp = group(small, 'pcc-pic'), bp = group(big, 'pcc-pic');
    assert.ok(/M40 100L160 100/.test(sp) && !/M40 120L160 120/.test(sp), 'fine lines are left off the small card');
    assert.ok(/M40 120L160 120/.test(bp), 'and scratched on the large one');
    assert.ok(/<path d="M100 150h\.1" stroke-width="[\d.]+"\/>/.test(sp), 'a peck is a heavier dot');
    assert.ok(/<path d="M0 0L10 0" transform="translate\(60 180\)"\/>/.test(sp), 'a transform is kept');
    // a drawing that scratches nothing, or is not a drawing, leaves the bark bare
    art.cardPictures['test-prints'] = { label: 'nothing', draw: () => {} };
    assert.equal(art.card({ picture: 'test-prints', mark: 'eye' }), art.card({ mark: 'eye' }).replace('A piece of bark: in', 'A piece of bark: nothing; in'), 'nothing scratched: no picture group');
    art.cardPictures['test-prints'] = { label: 'broken' };
    assert.equal(art.card({ picture: 'test-prints', mark: 'eye' }), art.card({ mark: 'eye' }), 'no draw: the bare bark');
    art.cardPictures['test-prints'] = { label: 'broken', draw: (c) => { c.line('M40 100L160 100'); throw new Error('a slip of the claw'); } };
    assert.equal(art.card({ picture: 'test-prints', mark: 'eye' }), art.card({ mark: 'eye' }), 'a drawing that fails: the bare bark and its mark, not an error');
    assert.equal(art.cardGroup({ picture: 'test-prints', big: true }).svg, art.cardGroup({ blank: true, big: true }).svg);
  } finally {
    delete art.cardPictures['test-prints'];
  }
  assert.ok(!('test-prints' in art.cardPictures));
});

// ---------------------------------------------------------------- the Case File button

test('fileIcon is one curl of bark in a square box, in the hub icons\' own style', () => {
  const icon = art.fileIcon();
  checkSvg(icon, '0 0 48 48', 'fileIcon');
  assert.equal(icon, art.fileIcon(), 'the same every time');
  assert.ok(/stroke="#1b1622" stroke-width="3"/.test(icon), 'the hub icons\' ink outline');
  const b = bounds(points(icon));
  assert.ok(b.x0 >= 2 && b.y0 >= 2 && b.x1 <= 46 && b.y1 <= 46, 'inside its box with room for the outline: ' + JSON.stringify(b));
  assert.ok(b.x1 - b.x0 > 36 && b.y1 - b.y0 > 36, 'and it fills it, to read at the size of a button');
  const card = art.card({ blank: true });
  const face = /fill="(#[0-9A-Fa-f]{6})" stroke="#8A7350"/.exec(card)[1];
  assert.ok(icon.includes('fill="' + face + '"'), 'the same pale bark as the cards');
  assert.ok(icon.length < 1200, 'a light drawing');
});

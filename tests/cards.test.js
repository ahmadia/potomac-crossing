// The Case File's cards (app/art/cards.js; docs/build.md, "Chapter 4", Cards art): node --test tests/cards.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

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
  // and no drawing nobody asked for: each is one of the nine, or a later chapter's card uses it
  const used = new Set(IDS);
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
});

test('every card, small and large, with either mark or none, is one well-formed svg in the same 200 x 240 box', () => {
  const seen = new Set();
  IDS.forEach((id) => {
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
  assert.equal(seen.size, IDS.length * 3 * 2, 'no two of them are the same drawing');
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
  IDS.forEach((id) => {
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
  IDS.forEach((id) => {
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
  IDS.forEach((id) => {
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
  IDS.forEach((id) => {
    const small = group(art.card({ picture: id }), 'pcc-pic'), big = group(art.card({ picture: id, big: true }), 'pcc-pic');
    assert.ok(width(small) >= 4 && width(small) <= 5, id + ': a small card reads in a row (' + width(small) + ' of 200)');
    assert.ok(width(big) >= 2 && width(big) <= 3, id + ': large, the lines are thin (' + width(big) + ' of 200)');
    assert.ok(/<g stroke="#[0-9A-Fa-f]{6}" stroke-width="[\d.]+" transform="translate\(1 1\.3\)" opacity="\.85">/.test(big), id + ': the pale lip, a hair down and right');
    assert.ok(!/transform="translate\(1 1\.3\)"/.test(small), id + ': no lip on a small card');
    // the dark lines of the large card hold everything the small card has
    const bp = points(big.slice(big.lastIndexOf('<g stroke="#3A281E"'))), sp = points(small);
    assert.ok(bp.length >= sp.length, id + ': nothing is lost large');
  });
  ['fox-flew', 'fox-moon', 'cant-fly', 'tidy', 'four-a-night'].forEach((id) => {
    const small = group(art.card({ picture: id }), 'pcc-pic'), big = group(art.card({ picture: id, big: true }), 'pcc-pic');
    assert.ok(points(big.slice(big.lastIndexOf('<g stroke="#3A281E"'))).length > points(small).length, id + ': a small touch more, large');
  });
});

test('her look changes nothing on a card', () => {
  const looks = [{ fur: 'black', marking: 'white-paws', eyes: 'green', sex: 'she' }, { fur: 'calico', marking: 'none', eyes: 'odd', sex: 'tom' }, {}, null];
  IDS.concat([undefined]).forEach((id) => {
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

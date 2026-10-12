// The marsh set (app/art/sets/marsh.js, chapter 5): node --test tests/set-marsh.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { ROOT, load } = require('./_load.js');
const PC = load();
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const CAMS = ['wide', 'far', 'heron', 'mud', 'pole', 'reeds', 'wisp', 'draw'];   // the text's order
const COMP = { wide: 'main', far: 'far', heron: 'heron', mud: 'mud', pole: 'pole', reeds: 'reeds', wisp: 'wisp', draw: 'draw' };
const ANCHORS = ['raft-1', 'raft-2', 'shallows', 'reed', 'pole-top', 'log-1', 'log-2', 'log-3'];
// one spot more than the text lists, in the `mud` camera only: the front lip of the raft's near log, where
// our cat crouches to hold a paw over a print (“You hold your paw over one. It’s half the size of yours.”)
const EDGE = 'raft-edge';
const THIN = String(art.marshInfo.reedThin);   // how thin she is while she is still a reed (her group's opacity)
const OPTS = {
  prints: [false, true], fish: ['none', 'strings', 'spare'], owed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], pole: ['none', 'planted'],
  dragonfly: ['none', 'beak', 'nose'], frogs: ['sit', 'jump'], pale: ['reed', 'flinch', 'knees', 'blink'], snout: [false, true],
  drawing: ['none', 'herons', 'fox'], tap: ['none', 'mud', 'pole']
};
const DEFAULTS = { fish: 'none', owed: 0, pole: 'none', dragonfly: 'none', frogs: 'sit', pale: 'reed', drawing: 'none', tap: 'none' };
// which spots each camera shows
const SHOWS = {
  wide: ANCHORS, far: ANCHORS, heron: ANCHORS,
  mud: ['raft-1', 'raft-2', EDGE, 'shallows'], pole: ['pole-top'],
  reeds: ['raft-1', 'raft-2', 'shallows', 'reed', 'pole-top'], wisp: ['raft-1', 'raft-2', 'shallows', 'reed', 'pole-top'],
  draw: ['raft-1', 'raft-2', 'shallows']
};
const RAFTED = CAMS.filter((c) => c !== 'pole');                 // the cameras with the raft in them
const REEDED = ['wide', 'far', 'heron', 'reeds', 'wisp'];        // the cameras that show the pale reeds
const PATCHED = ['wide', 'far', 'heron', 'mud'];                 // the cameras that show the patch of mud to tap
const TOD = ['day', 'morning', 'sunset', 'dusk', 'night'];

// ---------------------------------------------------------------- helpers (as in set-roof.test.js)

function checkXml(svg) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m, first = null;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), 'unescaped & in text: ' + tok.slice(0, 60));
      continue;
    }
    if (tok.startsWith('</')) {
      const name = tok.slice(2, -1).trim();
      assert.equal(stack.pop(), name, 'closing tag mismatch at </' + name + '>');
      continue;
    }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, 'malformed tag: ' + tok.slice(0, 120));
    const names = (mm[2].match(/[\w:.-]+(?==")/g) || []);
    assert.equal(new Set(names).size, names.length, 'duplicate attribute in ' + tok.slice(0, 80));
    if (!first) first = mm[1];
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, 'unclosed tags: ' + stack.slice(-3).join(', '));
  assert.equal(first, 'svg', 'the root element is <svg>');
}

function checkRender(r, scene, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg);
  assert.ok(vb, label + ': a viewBox');
  assert.deepEqual(vb[1].split(/\s+/).map(Number), [0, 0, 1600, 1000], label + ': the whole 1600 x 1000 composition');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, (scene.cast || []).length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
  });
  for (const k of r.keep) assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel: ' + JSON.stringify(k));
}

const render = (cam, opts, cast, fx) => art.render({ set: 'marsh', cam, opts: opts || {}, cast: cast || [], fx: fx || [] }, { look: LOOK });
const count = (svg, re) => (svg.match(re) || []).length;
const R0 = (cam) => art.marshInfo()[COMP[cam]].raft;
const at = (svg, s) => svg.indexOf(s);
const num = (v) => { const r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); };
// where the cast member standing at world point (x, y) is drawn (scenes.js placeChar's transform)
const drawnAt = (svg, a) => svg.indexOf('<g transform="translate(' + num(a.x) + ' ' + num(a.y) + ')');
// render ids carry a per-render prefix (scenes.js) and a per-drawing counter (cats.js)
const strip = (s) => s.replace(/\bpc[0-9a-z]+-/g, '');
const info = () => art.marshInfo();
const spots = (cam) => art.sceneInfo('marsh').anchors[COMP[cam]];
const has = (who) => art.vocab.cast.includes(who);   // does app/art/cats.js draw this one yet?
// the markup of the first <g …> that carries this attribute text, to its matching </g>
function group(svg, attr) {
  const i = svg.indexOf(attr);
  if (i < 0) return '';
  const start = svg.lastIndexOf('<g', i);
  let depth = 0;
  const re = /<g\b[^>]*>|<\/g>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(svg))) {
    if (m[0] === '</g>') { depth--; if (depth === 0) return svg.slice(start, m.index + 4); } else depth++;
  }
  return svg.slice(start);
}
// is the point inside the polygon P (the mud's outline)?
function inside(P, x, y) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
  }
  return c;
}
// every "translate(x y)" a group with this attribute starts with
function placed(svg, attr) {
  const out = [];
  const re = new RegExp('<g[^>]*' + attr + '[^>]*>', 'g');
  let m;
  while ((m = re.exec(svg))) { const t = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(m[0]); if (t) out.push([+t[1], +t[2]]); }
  return out;
}
const HERON = (pose, more) => Object.assign({ who: 'patience', at: 'shallows', pose: pose || 'stand' }, more || {});
const ME = (pose, more) => Object.assign({ who: 'player', at: 'raft-1', pose: pose || 'sit' }, more || {});
const RIFFLE = (more) => Object.assign({ who: 'riffle', at: 'raft-2', pose: 'stand' }, more || {});

// ---------------------------------------------------------------- the text is the spec

test('the chapter text\'s Art needs: every camera, anchor and option it names for the marsh is here, by that name', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/chapters/05-riffles-river.md'), 'utf8').replace(/\s+/g, ' ');
  const a = md.indexOf('New place, the marsh (`marsh`)'), b = md.indexOf('Patience (new cast', a);
  assert.ok(a > 0 && b > a, 'the text has the marsh\'s paragraph');
  const sec = md.slice(a, b), cams = sec.slice(sec.indexOf('Cameras:'), sec.indexOf('Anchors:')), anch = sec.slice(sec.indexOf('Anchors:'), sec.indexOf('Its options:'));
  const opts = sec.slice(sec.indexOf('Its options:'), sec.indexOf('Our cat is on the raft'));
  // cameras: each is a name with its picture in brackets after it
  assert.deepEqual([...cams.matchAll(/`([a-z-]+)` \(/g)].map((m) => m[1]), CAMS, 'the text\'s cameras, in its order');
  assert.deepEqual(art.vocab.sets.marsh.cams, CAMS);
  // anchors: `log-1` to `log-3` is three
  const named = [...anch.matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1]);
  assert.deepEqual(named, ['raft-1', 'raft-2', 'shallows', 'reed', 'pole-top', 'log-1', 'log-3']);
  assert.ok(/`log-1` to `log-3`/.test(anch));
  // (and one the text does not name, on the raft: the front lip of its near log, for the paw the text's `mud`
  // camera holds over a print “from the raft”)
  assert.deepEqual(art.vocab.sets.marsh.anchors.slice().sort(), ANCHORS.concat([EDGE]).sort(), 'exactly the text\'s anchors and the raft\'s edge: nothing on the mud, nothing more in the reeds');
  // options: every `name: value | value` the text gives is a value the set takes
  const V = art.vocab.sets.marsh.opts, seen = [];
  for (const m of opts.matchAll(/`([a-z]+): ([^`]+)`/g)) {
    const name = m[1], vals = m[2].trim();
    assert.ok(V[name], 'the set has the option `' + name + '`');
    seen.push(name);
    if (vals === 'true') assert.ok(V[name].includes(true), name + ': true');
    else if (/^0.9$/.test(vals)) assert.deepEqual(V[name], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], name + ': 0 to 9');
    else for (const q of vals.split('|').map((s) => s.trim().replace(/^'|'$/g, ''))) assert.ok(V[name].includes(q), name + ': \'' + q + '\'');
  }
  assert.deepEqual(seen, ['prints', 'fish', 'owed', 'pole', 'dragonfly', 'frogs', 'pale', 'snout', 'drawing'], 'the text\'s nine options');
  // the one option the text does not list is the Tap's (its Build notes ask for the pc-tap targets)
  assert.deepEqual(Object.keys(V).filter((k) => !seen.includes(k)), ['tap']);
  assert.ok(/the patch of mud \(the same in `marsh`; “Look at the mud.”\)/.test(md) && /Riffle’s pole \(the same in `marsh`, on the `mud` camera; “Run up the pole.”\)/.test(md), 'the Build notes ask for both targets');
});

test('PC.art.vocab lists the marsh with its cameras, anchors and options; each camera is its own composition', () => {
  const v = art.vocab.sets.marsh;
  assert.ok(v, 'vocab.sets.marsh');
  assert.deepEqual(v.cams, CAMS);
  assert.deepEqual(v.opts, OPTS);
  const si = art.sceneInfo('marsh');
  assert.equal(si.label, 'the marsh at Roaches Run');
  assert.deepEqual(si.defaults, DEFAULTS);
  for (const cam of CAMS) {
    assert.equal(si.cams[cam].comp, COMP[cam], cam + ' has its own composition');
    assert.deepEqual([si.cams[cam].x, si.cams[cam].y, si.cams[cam].w], [0, 0, 1600], cam + ' looks at all of it');
    assert.deepEqual(Object.keys(si.anchors[COMP[cam]]).sort(), SHOWS[cam].slice().sort(), cam + ' shows these spots');
    for (const k of SHOWS[cam]) {
      const a = si.anchors[COMP[cam]][k];
      assert.ok(a.x > 0 && a.x < 1600 && a.y > 0 && a.y <= 1000 && a.h > 20, cam + ': ' + k + ' is in the panel');
    }
  }
  // it adds nothing to anybody else's vocabulary
  assert.ok(!art.vocab.fx.some((f) => /marsh|mist|reed/.test(f)), 'no effect of its own');
});

test('a still, warm afternoon by default; fx sunset is late gold; the other lights follow fx', () => {
  const P = art.kit.PAL;
  for (const cam of ['wide', 'far', 'heron', 'pole', 'reeds', 'wisp']) {
    const plain = render(cam).svg;
    assert.ok(plain.includes(P.day.sky[0]) && !plain.includes(P.golden.sky[0]), cam + ': the day\'s sky');
    assert.equal(strip(render(cam, {}, [], ['day']).svg), strip(plain), cam + ': fx day is the default');
    const gold = render(cam, {}, [], ['sunset']).svg;
    assert.ok(gold.includes(P.golden.sky[0]) && !gold.includes(P.day.sky[0]), cam + ': fx sunset is the golden light');
    for (const t of ['morning', 'dusk', 'night']) {
      const s = render(cam, {}, [], [t]).svg;
      assert.ok(s.includes(P[t].sky[0]) && !s.includes(P.day.sky[0]), cam + ': fx ' + t + ' redraws it');
    }
  }
  // the two close cameras look down at mud and water: no sky in them, and still every light differs
  for (const cam of ['mud', 'draw']) {
    assert.equal(count(render(cam).svg, /data-part="sky"/g), 0, cam + ': no sky');
    const seen = new Set(TOD.map((t) => strip(render(cam, {}, [], [t]).svg)));
    assert.equal(seen.size, TOD.length, cam + ': every light is its own');
    assert.equal(strip(render(cam, {}, [], ['day']).svg), strip(render(cam).svg), cam + ': day is the default');
  }
});

test('the Roar\'s world is nowhere in sight: no towers, no airplane, in any camera', () => {
  const P = art.kit.PAL.day;
  for (const cam of CAMS) {
    const svg = render(cam, { prints: true, pole: 'planted', owed: 9, fish: 'strings' }, [ME(), RIFFLE(), HERON()]).svg;
    for (const c of [P.glassTop, P.glassBot, P.glassEdge, P.mullion]) assert.ok(!svg.includes(c), cam + ': no glass ' + c);
    assert.ok(!/pln-/.test(svg), cam + ': no airplane');
    assert.ok(!/<text\b/.test(svg), cam + ': no lettering in the art, no number anywhere');
  }
});

// ---------------------------------------------------------------- every camera, anchor and option

test('every camera renders well-formed SVG with a cast member at each anchor, in every light and with every option', () => {
  let n = 0;
  const whos = [['player', 'sit'], ['riffle', 'stand'], ['patience', 'stand'], ['wisp', 'blink'], ['puddle', 'nostrils'], ['clancat', 'sit']];
  for (const cam of CAMS) {
    for (const where of ANCHORS.concat([EDGE])) {
      // (a spot out of this camera's sight: one cat is enough to say so)
      for (const [who, pose] of SHOWS[cam].includes(where) ? whos : whos.slice(0, 1)) {
        const scene = { set: 'marsh', cam, cast: [{ who, at: where, pose, mood: 'happy' }] };
        const r = art.render(scene, { look: LOOK });
        checkRender(r, scene, cam + ' ' + who + '/' + pose + '@' + where);
        // a spot the camera does not show is out of its sight; a cat at one it shows is in shot
        if (!SHOWS[cam].includes(where)) assert.equal(r.heads[0], null, cam + ': ' + where + ' is out of sight');
        else if (who === 'player' || who === 'clancat') assert.ok(r.heads[0], cam + ': a cat at ' + where + ' is in shot');
        n++;
      }
    }
    const full = { prints: true, fish: 'strings', owed: 9, pole: 'planted', dragonfly: 'beak', frogs: 'jump', pale: 'blink', snout: true, drawing: 'herons', tap: 'mud' };
    for (const t of TOD) {
      const scene = { set: 'marsh', cam, opts: full, cast: [ME(), RIFFLE({ holds: 'pole' }), HERON('point'), { who: 'clancat', variant: 2, at: 'log-1' }, { who: 'clancat', variant: 3, at: 'log-2' }, { who: 'clancat', variant: 5, at: 'log-3' }], fx: [t] };
      checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + t);
    }
    // every value of every option, one at a time, bare and with the cast
    for (const k of Object.keys(OPTS)) for (const v of OPTS[k]) {
      for (const cast of [[], [ME('loaf'), RIFFLE({ holds: 'pole' }), HERON(), { who: 'wisp', at: 'reed', pose: 'reed' }]].slice(0, cam === 'wide' || cam === 'mud' || cam === 'wisp' ? 2 : 1)) {
        const scene = { set: 'marsh', cam, opts: { [k]: v }, cast };
        checkRender(art.render(scene, { look: LOOK }), scene, cam + ' ' + k + ': ' + JSON.stringify(v));
      }
    }
    const odd = { set: 'marsh', cam, opts: { sparrows: 3, nope: true, owed: 'lots', fish: 'whale', pale: 'green', tap: true, pole: true, drawing: 7, dragonfly: 'ear' }, cast: [], fx: art.vocab.fx.slice() };
    checkRender(art.render(odd, { look: LOOK }), odd, cam + ' with stray options and every effect');
  }
  assert.equal(n, CAMS.reduce((t, cam) => t + SHOWS[cam].length * whos.length + (ANCHORS.length + 1 - SHOWS[cam].length), 0));
});

test('the same scene draws the same picture each time', () => {
  for (const cam of CAMS) {
    const s = { set: 'marsh', cam, opts: { prints: true, fish: 'spare', owed: 7, pole: 'planted', dragonfly: 'beak', snout: true, drawing: 'fox', tap: 'mud' }, cast: [ME(), RIFFLE(), HERON()] };
    assert.equal(strip(art.render(s, { look: LOOK }).svg), strip(art.render(s, { look: LOOK }).svg), cam);
  }
});

test('odd input never throws: unknown spots, spots of their own, no character drawings, no fish painter, no cards', () => {
  const cases = [
    { set: 'marsh' }, { set: 'marsh', cam: 'nowhere' }, { set: 'marsh', cam: 'mud', cast: [{ who: 'wisp', at: 'nowhere', pose: 'reed' }] },
    { set: 'marsh', cam: 'reeds', opts: { dragonfly: 'nose', pole: 'planted' }, cast: [{ who: 'player', at: { x: 300, y: 940 }, pose: 'loaf' }, { who: 'riffle', at: { x: 900, y: 880, h: 200 }, pose: 'swim', holds: 'fish' }] },
    { set: 'marsh', cam: 'heron', opts: { dragonfly: 'beak', owed: 3, tap: 'pole' }, cast: [{ who: 'patience', at: { x: 900, y: 900 } }, { at: 'shallows' }, null, 7] },
    { set: 'marsh', cam: 'wide', opts: { tap: 'pole' }, cast: [{ who: 'riffle', holds: 'pole' }] },
    { set: 'marsh', cam: 'draw', opts: { drawing: 'fox' }, cast: 'nobody' }
  ];
  for (const scene of cases) assert.doesNotThrow(() => checkRender(art.render(scene, { look: LOOK }), { cast: Array.isArray(scene.cast) ? scene.cast.filter((c) => c && typeof c === 'object') : [] }, JSON.stringify(scene)));
  const keepChar = art.character, keepPrey = art.prey, keepPics = art.cardPictures, keepCast = art.vocab.cast;
  try {
    art.character = undefined; art.prey = undefined; art.cardPictures = undefined;
    for (const cam of CAMS) {
      const scene = { set: 'marsh', cam, opts: { prints: true, fish: 'strings', owed: 9, pole: 'planted', dragonfly: 'beak', pale: 'blink', snout: true, drawing: 'fox', tap: 'pole' }, cast: [ME(), RIFFLE({ holds: 'pole' }), HERON(), { who: 'wisp', at: 'reed' }] };
      assert.doesNotThrow(() => checkRender(art.render(scene, { look: LOOK }), scene, cam + ' with nothing to draw with'), cam);
    }
    art.character = () => { throw new Error('no drawing'); };
    art.vocab.cast = keepCast.concat(['wisp', 'patience', 'puddle']);
    for (const cam of CAMS) assert.doesNotThrow(() => render(cam, { dragonfly: 'nose', owed: 2, pale: 'flinch', tap: 'pole' }, [ME(), RIFFLE({ holds: 'pole' }), HERON()]), cam + ': a drawing that throws');
  } finally { art.character = keepChar; art.prey = keepPrey; art.cardPictures = keepPics; art.vocab.cast = keepCast; }
});

// ---------------------------------------------------------------- the raft, and who is on it

test('our cat is on the raft in every marsh picture: both raft spots are on its logs, in shot, in every camera with the raft', () => {
  const I = info();
  for (const cam of RAFTED) {
    const R = I[COMP[cam]].raft, A = spots(cam), r = render(cam, {}, [ME(), RIFFLE()]), svg = r.svg;
    assert.equal(count(svg, /data-part="raft"/g), 1, cam + ': the raft');
    for (const k of ['raft-1', 'raft-2']) {
      const a = A[k];
      assert.ok(a.x > R.x0 + 40 && a.x < R.x1 - 40, cam + ': ' + k + ' is over the logs, not off their ends');
      assert.ok(a.y > R.top && a.y < R.bot + 4, cam + ': ' + k + ' is on the deck: ' + a.y + ' in ' + R.top + ' to ' + R.bot);
      assert.ok(a.x > 60 && a.x < 1540, cam + ': ' + k + ' is well inside the panel');
      assert.ok(!a.air && !a.elev && a.z !== 'behind', cam + ': ' + k + ' is plain ground: the logs');
    }
    r.heads.forEach((h, i) => assert.ok(h && h.x > 2 && h.x < 98 && h.y > 2 && h.y < 98, cam + ': the head at raft-' + (i + 1) + ' is in the picture: ' + JSON.stringify(h)));
    // our cat's place is the left one; Riffle's is on her right, at the raft's mud end
    assert.ok(A['raft-1'].x < A['raft-2'].x, cam + ': raft-1 is left of raft-2');
    // the two are side by side on one raft: about the same size, their faces apart
    assert.ok(Math.abs(A['raft-1'].h / A['raft-2'].h - 1) < 0.03 && Math.abs(A['raft-1'].y - A['raft-2'].y) < 12, cam + ': side by side');
    const d = Math.hypot((r.heads[0].x - r.heads[1].x) * 16, (r.heads[0].y - r.heads[1].y) * 10);
    assert.ok(d > (r.heads[0].r + r.heads[1].r) * 16 * 1.1, cam + ': two faces, apart: ' + d.toFixed(0));
    // the raft is drawn before (under) them
    assert.ok(at(svg, 'data-part="raft"') < drawnAt(svg, A['raft-1']) && drawnAt(svg, A['raft-1']) > 0, cam + ': they sit on it');
  }
  // from the top of the pole only the pole's top is in sight, and it is under whoever is up it
  assert.equal(I.pole.raft, null);
  const up = render('pole', {}, [{ who: 'player', at: 'pole-top', pose: 'crouch' }]);
  assert.ok(up.heads[0] && up.heads[0].y < 80, 'pole: our cat is in shot at the top of it');
  assert.equal(count(up.svg, /data-part="pole"/g), 1, 'pole: the pole she is up');
  const T = I.pole.top, P = spots('pole')['pole-top'];
  assert.ok(Math.abs(T.x - P.x) < 2 && Math.abs(T.y - P.y) < 2, 'pole: its top is the spot');
});

test('ReedClan\'s mud: no spot is on it, and none in the reeds takes a cat', () => {
  const I = info();
  for (const cam of CAMS) {
    const A = spots(cam), mud = I[COMP[cam]].mud;
    for (const k of Object.keys(A)) {
      // nobody's feet are on the mud: not on the raft, not in the shallows, not at the reed
      if (mud && cam !== 'pole') assert.ok(!inside(mud, A[k].x, A[k].y), cam + ': ' + k + ' is not on the mud');
      // the places a cat can be: the logs, the top of the pole, the far log
      const forCats = /^raft-|^log-|^pole-top$/.test(k);
      if (!forCats) assert.ok(A[k].air === true, cam + ': ' + k + ' is in the water (the heron\'s, the dragonet\'s): no shadow is laid there');
    }
    assert.deepEqual(Object.keys(A).filter((k) => !/^raft-|^log-|^pole-top$/.test(k)).sort(), SHOWS[cam].filter((k) => k === 'shallows' || k === 'reed').sort(), cam);
  }
  // the wide cameras' mud is beside the raft, and the raft lies against it
  for (const cam of ['wide', 'far', 'heron', 'reeds']) {
    const R = I[COMP[cam]].raft, mud = I[COMP[cam]].mud;
    assert.ok(inside(mud, R.x1 + 60, (R.top + R.bot) / 2 + 20), cam + ': mud just past the raft\'s end');
    assert.equal(count(render(cam).svg, /data-part="mud"/g), 1, cam);
  }
});

// ---------------------------------------------------------------- Patience in the shallows

test('the heron stands in the shallows beyond the mud: in shot in every pose, the water ringed round her leg', { skip: !has('patience') }, () => {
  const I = info();
  for (const cam of RAFTED) {
    const A = spots(cam), a = A.shallows, mud = I[COMP[cam]].mud;
    assert.ok(!inside(mud, a.x, a.y), cam + ': she stands in water');
    for (const pose of art.vocab.otherPoses.patience) {
      const r = render(cam, {}, [ME(), HERON(pose)]);
      assert.ok(r.heads[1] && r.heads[1].y > 1.5 && r.heads[1].x > 2 && r.heads[1].x < 98, cam + ': her head is in the picture, ' + pose + ': ' + JSON.stringify(r.heads[1]));
      assert.equal(count(r.svg, /data-part="wade"/g), 1, cam + ': the water round her leg');
      assert.ok(at(r.svg, 'data-part="wade"') > drawnAt(r.svg, a) && drawnAt(r.svg, a) > 0, cam + ': drawn over her foot');
    }
    // nobody there, no rings
    assert.equal(count(render(cam).svg, /data-part="wade"/g), 0, cam);
    // she is the tall one: her head is higher in the panel than a cat's on the raft
    const r = render(cam, {}, [ME(), HERON()]);
    assert.ok(r.heads[1].y < r.heads[0].y, cam + ': above our cat');
  }
  // `heron`: tall in the panel, our cat and Riffle low in the corner
  const r = render('heron', {}, [ME(), RIFFLE(), HERON()]), f = art.marshInfo.figure('heron', HERON(), LOOK), a = spots('heron').shallows;
  assert.ok(a.y - f.box[1] > 620, 'heron: she fills most of the panel\'s height: ' + (a.y - f.box[1]).toFixed(0));
  assert.ok(r.heads[0].y > 60 && r.heads[1].y > 60 && r.heads[0].x < 40 && r.heads[1].x < 40, 'heron: the two on the raft are low in the corner');
  assert.ok(r.heads[2].y < 35, 'heron: her head is high');
});

test('the set places the cast as scenes.js does: the heron, the dragonets and the cats, to the pixel', () => {
  const who = [ME('sit'), ME('loaf'), RIFFLE(), RIFFLE({ holds: 'pole' })];
  if (has('patience')) who.push(HERON('stand'), HERON('point'), HERON('gulp'));
  if (has('wisp')) who.push({ who: 'wisp', at: 'reed', pose: 'blink' }, { who: 'wisp', at: 'reed', pose: 'reed' });
  if (has('puddle')) who.push({ who: 'puddle', at: 'raft-2', pose: 'head' });
  let n = 0;
  for (const cam of CAMS) for (const m of who) {
    if (!SHOWS[cam].includes(m.at)) continue;
    const r = render(cam, {}, [m]), f = art.marshInfo.figure(cam, m, LOOK);
    assert.ok(f && f.head, cam + ' ' + m.who);
    // (a head off the panel is not reported, or, a heron's, reported where what shows of it is)
    if (!r.heads[0] || f.head[0] < 0 || f.head[0] > 1600 || f.head[1] < 0 || f.head[1] > 1000) continue;
    assert.ok(Math.abs(r.heads[0].x * 16 - f.head[0]) < 1.7 && Math.abs(r.heads[0].y * 10 - f.head[1]) < 1.1, cam + ' ' + m.who + '/' + m.pose + ': scenes ' + JSON.stringify(r.heads[0]) + ', the set ' + f.head.map((v) => v.toFixed(1)));
    n++;
  }
  assert.ok(n > 20, 'compared ' + n);
  // the sizes it holds the three to are scenes.js's own (its SIZE_BAND), and the wash of each light (its CAST_TINT)
  const src = fs.readFileSync(path.join(ROOT, 'app/art/scenes.js'), 'utf8');
  for (const [tod, m] of Object.entries(art.marshInfo.castTint)) assert.ok(src.includes(tod + ": '" + m + "'"), 'scenes.js still washes the cast in the ' + tod + ' light with ' + m);
  for (const [k, b] of Object.entries(art.marshInfo.sizeBand)) {
    const m = new RegExp(k + ": \\{ ref: '(\\w+)', pose: '(\\w+)', by: '(\\w+)', min: ([\\d.]+), max: ([\\d.]+) \\}").exec(src);
    if (!m) continue;   // scenes.js holds no such band (yet): the comparison above is the check
    assert.deepEqual([b.ref, b.pose, b.by, b.min, b.max], [m[1], m[2], m[3], +m[4], +m[5]], k + ': the same band as scenes.js');
  }
});

// ---------------------------------------------------------------- what Riffle owes

test('owed: pairs of fish in a thought cloud over the heron, a pair more each time, none ever moving; no number', () => {
  const pairsOf = (svg) => [...svg.matchAll(/<g data-pair="(\d+)">(.*?)<\/g><\/g><\/g>/g)];
  for (const cam of RAFTED) {
    const cast = [ME(), RIFFLE(), HERON()];
    assert.equal(count(render(cam, {}, cast).svg, /data-part="thought"/g), 0, cam + ': nothing owed, no cloud');
    assert.equal(count(render(cam, { owed: 0 }, cast).svg, /data-part="thought"/g), 0, cam + ': 0');
    let before = [];
    for (let k = 1; k <= 9; k++) {
      const r = render(cam, { owed: k }, cast), svg = r.svg, th = group(svg, 'data-part="thought"');
      assert.ok(th && /data-owed="\d"/.test(th) && +/data-owed="(\d)"/.exec(th)[1] === k, cam + ' owed ' + k);
      const where = placed(th, 'data-fish="1"');
      assert.equal(count(th, /data-pair="/g), k, cam + ': ' + k + ' pairs');
      assert.equal(where.length, 2 * k, cam + ': two fish a pair');
      // the pairs that were there are exactly where they were
      assert.deepEqual(where.slice(0, before.length), before, cam + ': pair ' + k + ' moved nothing');
      before = where;
      // in rows of three, each new row above the last
      const rows = [...new Set(where.filter((_, i) => i % 2 === 0).map((q) => q[1]))];
      assert.equal(rows.length, Math.ceil(k / 3), cam + ' owed ' + k + ': rows of three');
      for (let i = 1; i < rows.length; i++) assert.ok(rows[i] < rows[i - 1], cam + ': the next row is above');
      // the lettering keeps off it; it is all in the panel
      const kp = r.keep.find((q) => q.y < 40 && q.w > 3 && where.every((w) => w[0] / 16 > q.x && w[0] / 16 < q.x + q.w && w[1] / 10 > q.y && w[1] / 10 < q.y + q.h));
      assert.ok(kp, cam + ' owed ' + k + ': the cloud is in keep: ' + JSON.stringify(r.keep));
      assert.ok(kp.x > 0.5 && kp.y > 0.5 && kp.x + kp.w < 99.5, cam + ': inside the panel');
      if (has('patience')) {
        // over her head (beside it in the two close cameras, where her head is at the top of the
        // picture), never on it; a trail of small bubbles leads down to her
        const h = r.heads[2];
        if (cam !== 'mud' && cam !== 'draw') assert.ok(kp.y + kp.h <= h.y + 2.5, cam + ': above her head');
        assert.ok(!(h.x > kp.x && h.x < kp.x + kp.w && h.y > kp.y && h.y < kp.y + kp.h), cam + ': not on her face');
        assert.ok(count(th, /<circle /g) >= 3, cam + ': three bubbles down to her');
      }
      assert.ok(at(svg, 'data-part="thought"') > drawnAt(svg, spots(cam).shallows), cam + ': in front');
    }
    assert.equal(before.length, 18);
    // nine: three rows of three
    assert.equal(new Set(before.map((q) => q[1])).size, 6, cam + ': three rows, two fish high each');
    // out of range stays in range
    assert.equal(+/data-owed="(\d)"/.exec(render(cam, { owed: 40 }, cast).svg)[1], 9);
    assert.equal(count(render(cam, { owed: -2 }, cast).svg, /data-part="thought"/g), 0);
  }
  assert.equal(count(render('pole', { owed: 9 }, [{ who: 'player', at: 'pole-top' }]).svg, /data-part="thought"/g), 0, 'pole: she is not in sight, nor her thought');
  // the cloud never covers the pale reed, nor the two on the raft
  for (const cam of REEDED) {
    const r = render(cam, { owed: 9 }, [ME(), RIFFLE(), HERON()]), kp = r.keep[0], a = spots(cam).reed;
    assert.ok(!(a.x / 16 > kp.x - 1 && a.x / 16 < kp.x + kp.w + 1 && (a.y - a.h) / 10 < kp.y + kp.h), cam + ': clear of the pale reed');
    for (const h of r.heads.slice(0, 2)) assert.ok(h.y > kp.y + kp.h, cam + ': over the raft, not on it');
  }
});

test('the fish are the Counts pictures\' fish: small, silver, eyes shut', () => {
  const fish = art.prey({ kind: 'fish', seed: 900 });
  const th = group(render('heron', { owed: 1 }, [HERON()]).svg, 'data-part="thought"');
  assert.ok(th.includes(fish.svg), 'the cloud\'s first fish is PC.art.prey\'s fish, untouched');
  assert.ok(/M114 21Q118 25 123 21/.test(fish.svg), 'its eye is a shut lid');
  const st = group(render('heron', { fish: 'strings' }).svg, 'data-part="strings"');
  assert.ok(st.includes(art.prey({ kind: 'fish', seed: 500 }).svg), 'and the fish on the strings');
});

// ---------------------------------------------------------------- the catch

test('fish: four strings of five laid across the logs, a reed looped round the tails; spare: three emptied, two fish left', () => {
  const I = info();
  for (const cam of RAFTED) {
    const R = I[COMP[cam]].raft, F = I[COMP[cam]].strings, A = spots(cam);
    assert.equal(count(render(cam).svg, /data-part="strings"/g), 0, cam + ': none by default');
    assert.equal(count(render(cam, { fish: 'none' }).svg, /data-part="strings"/g), 0, cam);
    const full = group(render(cam, { fish: 'strings' }, [ME(), RIFFLE()]).svg, 'data-part="strings"');
    assert.ok(/data-fish-mode="strings"/.test(full), cam);
    const counts = [...full.matchAll(/data-string="(\d)" data-fish-count="(\d)"/g)].map((m) => +m[2]);
    assert.deepEqual(counts, [5, 5, 5, 5], cam + ': four strings, five fish on every string');
    const where = placed(full, 'data-fish="1"');
    assert.equal(where.length, 20, cam + ': twenty fish');
    // on the logs: over the raft, in front of the feet of the two on it (so nothing hides them)
    assert.equal(F.xs.length, 4);
    for (const x of F.xs) assert.ok(x > R.x0 + 10 && x < R.x1 - 10 && x > 0, cam + ': a string at ' + x + ' is over the raft, in the panel');
    for (const q of where) {
      assert.ok(q[1] > Math.max(A['raft-1'].y, A['raft-2'].y) - 2 && q[1] < R.bot + 26 * R.k && q[1] < 1000, cam + ': a fish at y ' + q[1] + ' lies on the front logs');
      assert.ok(q[0] > 0 && q[0] < 1600, cam);
    }
    // each string: its five fish fanned from one loop, heads toward us (below the loop)
    for (let s = 0; s < 4; s++) {
      const five = where.slice(s * 5, s * 5 + 5);
      assert.ok(five.every((q) => q[1] > F.y + F.len * 0.3), cam + ': heads below the loop');
      assert.ok(Math.abs(five[4][0] - five[0][0]) < F.len * 0.5 && Math.abs(five[4][0] - five[0][0]) > F.len * 0.2, cam + ': side by side, a fan');
      assert.ok(Math.abs((five[0][0] + five[4][0]) / 2 - F.xs[s]) < 1, cam + ': hung from its loop');
    }
    // nothing goes through a fish: every fish is the painter's own markup, whole, and the loop is drawn
    // round the tails (one stroke behind the fish, the rest over them); no hook, no blood
    const one = art.prey({ kind: 'fish', seed: 500 }).svg;
    assert.ok(full.includes(one), cam + ': a fish as the painter drew it');
    assert.ok(!/#(?:c00|d00|e00|f00|b0000|cc0000|ff0000|a11|b22)/i.test(full.replace(one, '')), cam + ': nothing red');
    const firstString = /<g data-string="1"[^>]*>(.*?)<g data-string="2"/.exec(full)[1];
    assert.ok(firstString.indexOf('<path') < firstString.indexOf('data-fish="1"') && firstString.lastIndexOf('<path') > firstString.lastIndexOf('data-fish="1"'), cam + ': the loop goes behind the tails and comes round over them');
    // spare
    const spare = group(render(cam, { fish: 'spare' }).svg, 'data-part="strings"');
    assert.deepEqual([...spare.matchAll(/data-string="(\d)" data-fish-count="(\d)"/g)].map((m) => +m[2]), [0, 0, 0, 2], cam + ': three emptied strings, the fourth with two');
    assert.equal(placed(spare, 'data-fish="1"').length, 2, cam + ': two to spare');
    assert.equal(count(spare, /<ellipse /g) >= 6, true, cam + ': the three emptied loops lie on the logs');
  }
  assert.equal(count(render('pole', { fish: 'strings' }).svg, /data-part="strings"/g), 0, 'pole: the raft is under us');
});

// ---------------------------------------------------------------- the pole, and where he dived

test('pole: planted, it stands in the mud beside the raft with the raft\'s vine round it; a ring of ripples where he dived', () => {
  const I = info();
  for (const cam of RAFTED) {
    const L = I[COMP[cam]], P = L.pole, R = L.raft;
    // by default he has it: in his paws (cats.js draws it with him: the set draws none), or, when his paws
    // are busy (he hops, he sits, he is flat on his back), lying along the raft's near log, at their feet,
    // in the colour of the one he holds: it never just vanishes (it did, for the eleven panels of his seven
    // questions and the bill)
    const held = render(cam, {}, [ME(), { who: 'riffle', at: 'raft-2', pose: 'stand', holds: 'pole' }]).svg;
    assert.equal(count(held, /data-part="pole"/g), 0, cam + ': in his paws, the set draws none');
    for (const pose of ['hop', 'sit', 'fall']) {
      const lying = render(cam, {}, [ME(), { who: 'riffle', at: 'raft-2', pose }]).svg;
      assert.equal(count(lying, /data-part="pole" data-pole="lying"/g), 1, cam + ' ' + pose + ': it lies on the raft');
      assert.equal(count(lying, /data-part="pole"/g), 1, cam);
      const d = /data-pole="lying"[^>]*><path d="M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)"/.exec(lying).slice(1).map(Number);
      const feet = Math.max(spots(cam)['raft-1'].y, spots(cam)['raft-2'].y);
      assert.ok(d[0] >= R.x0 && d[2] <= R.x1 && d[2] - d[0] > 150 * R.k * 0.6, cam + ': along the raft, within it: ' + d);
      assert.ok(Math.min(d[1], d[3]) > feet + 6 && Math.max(d[1], d[3]) <= R.bot, cam + ': on the near log, in front of their feet (' + feet + '): ' + d);
      assert.ok(at(lying, 'data-part="raft"') < at(lying, 'data-pole="lying"') && at(lying, 'data-pole="lying"') < drawnAt(lying, spots(cam)['raft-1']), cam + ': on the logs, under the cast');
      assert.ok(/data-pole="lying"[^>]*><path [^>]*stroke="#6b4a26"[^>]*\/><path [^>]*stroke="#cba469"/.test(lying), cam + ': the pole he holds, by its colours');
    }
    assert.equal(count(render(cam, {}, [ME()]).svg, /data-part="dive"/g), 0, cam);
    const svg = render(cam, { pole: 'planted' }, [ME()]).svg;
    assert.equal(count(svg, /data-part="pole" data-pole="planted"/g), 1, cam + ': the pole, planted');
    assert.equal(count(svg, /data-part="pole"/g), 1, cam + ': and only there');
    assert.ok(inside(L.mud, P.x, P.foot - 2), cam + ': its foot is in the mud');
    assert.ok(P.x > R.x1 && P.x - R.x1 < 80 * R.k, cam + ': right beside the raft\'s end');
    assert.ok(P.top < P.foot - 200 * R.k * 0.6, cam + ': a long pole');
    // it holds the raft still: the vine runs from the raft to the pole
    const pole = group(svg, 'data-part="pole"');
    const tie = new RegExp('M' + num(R.x1 - 34 * R.k).replace('.', '\\.') + ' ').test(pole);
    assert.ok(tie, cam + ': the raft\'s vine is round it');
    assert.ok(at(svg, 'data-part="raft"') < at(svg, 'data-part="pole"'), cam + ': in front of the raft\'s end');
    // where he dived: rings on open water, in the panel, off the mud and clear of the raft
    assert.equal(count(svg, /data-part="dive"/g), 1, cam + ': a ring of ripples');
    const d = L.dive;
    assert.ok(d[0] > 60 && d[0] < 1540 && d[1] > 60 && d[1] < 1000 && !inside(L.mud, d[0], d[1]), cam + ': on the water');
    assert.ok(!(d[0] > R.x0 && d[0] < R.x1 && d[1] > R.top - 20 && d[1] < R.bot + 40), cam + ': not under the raft');
    assert.ok(count(group(svg, 'data-part="dive"'), /<ellipse /g) === 3, cam + ': three rings');
    // an otter's head can be put there (a spot of its own): it is in shot
    const r = render(cam, { pole: 'planted' }, [ME(), { who: 'riffle', pose: 'swim', holds: 'fish', at: { x: d[0], y: d[1] + 8 } }]);
    assert.ok(r.heads[1], cam + ': his head pops up in the ring');
  }
  // the pole is as cats.js draws it in his paws: about one and a half sitting cats long, thin
  const held = art.character('riffle', { pose: 'stand', holds: 'pole' });
  if (held.pole && held.pole.w > 0) {
    const len = Math.hypot(held.pole.x1 - held.pole.x0, held.pole.y1 - held.pole.y0) / 200, P = I.main.pole, h = spots('wide')['raft-2'].h;
    assert.ok(Math.abs((P.foot - P.top) / h / len - 1) < 0.08, 'as long as the one he holds: ' + ((P.foot - P.top) / h).toFixed(2) + ' against ' + len.toFixed(2));
    assert.ok(Math.abs(P.w * 2 / h / (held.pole.w / 200) - 1) < 0.2, 'as thick: ' + (P.w * 2 / h).toFixed(3) + ' against ' + (held.pole.w / 200).toFixed(3));
  }
  // its top is a spot: somebody up it has the pole under them, planted or not
  for (const cam of REEDED) {
    const a = spots(cam)['pole-top'], P = I[COMP[cam]].pole;
    assert.ok(Math.abs(a.y - P.top) < 1 && Math.abs(a.x - (P.x + P.lean)) < 1 && a.elev && a.air, cam + ': pole-top is the pole\'s top');
    const r = render(cam, {}, [{ who: 'player', at: 'pole-top', pose: 'crouch' }]);
    assert.equal(count(r.svg, /data-part="pole" data-pole="standing"/g), 1, cam + ': the pole is there for whoever is up it');
    assert.equal(count(r.svg, /data-part="pole"/g), 1, cam + ': one pole, not a second lying on the logs');
    assert.ok(r.heads[0], cam + ': and she is in the picture');
  }
});

// ---------------------------------------------------------------- the dragonfly

test('dragonfly: asleep on the heron\'s bill, or on our cat\'s nose; the same insect cats.js draws; never two', { skip: !has('patience') }, () => {
  const D = art.marshInfo.dragonfly;
  for (const cam of RAFTED) {
    const cast = [ME('loaf'), HERON()];
    assert.equal(count(render(cam, {}, cast).svg, /data-part="dragonfly"/g), 0, cam + ': none by default');
    assert.equal(count(render(cam, { dragonfly: 'none' }, cast).svg, /data-part="dragonfly"/g), 0, cam);
    // on her bill
    const r = render(cam, { dragonfly: 'beak' }, cast), fly = placed(r.svg, 'data-part="dragonfly"');
    assert.equal(fly.length, 1, cam + ': one dragonfly');
    assert.ok(/data-part="dragonfly" data-asleep="1"/.test(r.svg), cam + ': asleep');
    const f = art.marshInfo.figure(cam, HERON(), LOOK), ch = art.character('patience', { pose: 'stand', facing: 'left' });
    const want = [spots(cam).shallows.x + (ch.bill.x - ch.w / 2) * f.k, spots(cam).shallows.y + (ch.bill.y - ch.h) * f.k];
    assert.ok(Math.abs(fly[0][0] - want[0]) < 1 && Math.abs(fly[0][1] - want[1]) < 1, cam + ': where her drawing says the bill is: ' + fly[0] + ' / ' + want.map((v) => v.toFixed(1)));
    assert.ok(fly[0][0] < f.head[0], cam + ': out along her bill, the way she faces');
    assert.ok(at(r.svg, 'data-part="dragonfly"') > drawnAt(r.svg, spots(cam).shallows), cam + ': on her, not behind her');
    // nobody at `shallows`: nothing to sit on
    assert.equal(count(render(cam, { dragonfly: 'beak' }, [ME()]).svg, /data-part="dragonfly"/g), 0, cam);
    // when the cast wears cats.js's own, the set draws none
    assert.equal(count(render(cam, { dragonfly: 'beak' }, [ME(), HERON('stand', { dragonfly: true })]).svg, /data-part="dragonfly"/g), 0, cam + ': hers already');
    // on our cat's nose
    const n = render(cam, { dragonfly: 'nose' }, cast), nose = placed(n.svg, 'data-part="dragonfly"');
    assert.equal(nose.length, 1, cam + ': one, on her nose');
    assert.ok(/data-part="dragonfly" data-asleep="0"/.test(n.svg), cam + ': awake');
    const h = n.heads[0];
    assert.ok(Math.hypot(nose[0][0] - h.x * 16, nose[0][1] - h.y * 10) < h.r * 16 * 0.7, cam + ': in the middle of her face');
    assert.ok(at(n.svg, 'data-part="dragonfly"') > drawnAt(n.svg, spots(cam)['raft-1']), cam + ': over her');
    assert.equal(count(render(cam, { dragonfly: 'nose' }, [HERON()]).svg, /data-part="dragonfly"/g), 0, cam + ': no cat, no nose');
    assert.equal(count(render(cam, { dragonfly: 'nose' }, [ME('loaf', { dragonfly: true }), HERON()]).svg, /data-part="dragonfly"/g), 0, cam + ': hers already');
  }
  // the insect is cats.js's: its colours, its two laid-back wings asleep, four held out awake
  const own = art.character('patience', { pose: 'stand', dragonfly: true }).svg.toLowerCase();
  if (own.includes('pc-dragonfly')) for (const k of ['body', 'line', 'head', 'wing', 'wingLine']) assert.ok(own.includes(D[k].toLowerCase()), 'cats.js still draws it with ' + k + ' ' + D[k]);
  const mine = group(render('heron', { dragonfly: 'beak' }, [HERON()]).svg, 'data-part="dragonfly"').toLowerCase();
  for (const k of ['body', 'line', 'head', 'wing', 'wingLine']) assert.ok(mine.includes(D[k].toLowerCase()), 'the set\'s is ' + k + ' ' + D[k]);
  assert.equal(count(mine, /<ellipse [^>]*rotate/g), 2, 'asleep: two wings laid back');
  assert.equal(count(group(render('reeds', { dragonfly: 'nose' }, [ME('loaf')]).svg, 'data-part="dragonfly"'), /<ellipse [^>]*rotate/g), 4, 'awake: four wings');
});

// ---------------------------------------------------------------- lily pads and frogs

test('lily pads on the still water; frogs: sitting on their pads, eyes open, or every one of them in the air', () => {
  const I = info();
  for (const cam of CAMS) {
    const L = I[COMP[cam]], frogPads = L.pads.filter((q) => q[3] === 'frog'), svg = render(cam).svg;
    assert.equal(count(svg, /data-part="pads"/g), 1, cam + ': lily pads');
    assert.ok(L.pads.length >= 3 && frogPads.length >= 1, cam + ': pads, and a frog\'s among them');
    for (const q of L.pads) {
      assert.ok(q[1] > L.hz + 20 || !L.sky, cam + ': a pad lies on the water');
      if (L.mud) assert.ok(!inside(L.mud, q[0], q[1]), cam + ': not on the mud: ' + q);
      if (L.raft) assert.ok(!(q[0] > L.raft.x0 && q[0] < L.raft.x1 && q[1] > L.raft.top - q[2] && q[1] < L.raft.bot + 30 * L.raft.k), cam + ': not under the raft: ' + q);
    }
    // sitting is the default: one frog a frog's pad, each with two open eyes
    const sit = group(svg, 'data-part="frogs"');
    assert.ok(/data-frogs="sit"/.test(sit), cam);
    assert.equal(count(sit, /data-frog="sit"/g), frogPads.length, cam + ': a frog on each of its pads');
    assert.equal(count(sit, /data-frog="jump"/g), 0, cam);
    assert.equal(count(sit, /fill="#22301C"/gi), frogPads.length * 2, cam + ': two open eyes each: alive');
    assert.equal(strip(render(cam, { frogs: 'sit' }).svg), strip(svg), cam + ': sit is the default');
    // every frog jumps in: the same frogs, in the air, a ring where each will land
    const jump = group(render(cam, { frogs: 'jump' }).svg, 'data-part="frogs"');
    assert.ok(/data-frogs="jump"/.test(jump), cam);
    assert.equal(count(jump, /data-frog="jump"/g), frogPads.length, cam + ': every frog jumps');
    assert.equal(count(jump, /data-frog="sit"/g), 0, cam + ': none left sitting');
    assert.equal(count(jump, /<ellipse [^>]*fill="none"/g), frogPads.length * 3, cam + ': rings on the water');
    assert.equal(count(jump, /fill="#22301C"/gi), frogPads.length, cam + ': each still has its eye open');
    // frogs are in front of the pads, and no frog covers the two on the raft or the heron's place
    assert.ok(at(svg, 'data-part="frogs"') > at(svg, 'data-part="pads"'), cam);
    if (L.raft) for (const q of frogPads) for (const k of ['raft-1', 'raft-2']) assert.ok(Math.hypot(q[0] - spots(cam)[k].x, q[1] - spots(cam)[k].y) > q[2] * 2.2, cam + ': a frog\'s pad is clear of ' + k);
  }
  // The frogs are out on the water: drawn BEFORE everyone on the raft or in the water, never over them
  // (a frog sat on Riffle's forehead in the middle of his dive, on his back as he swam, and on our cat's ear).
  for (const cam of RAFTED) {
    const L = I[COMP[cam]], dive = L.dive;
    for (const mode of ['sit', 'jump']) {
      const cast = [ME(), { who: 'riffle', pose: 'swim', holds: 'fish', at: { x: dive[0], y: dive[1] + 8 } }, HERON()];
      const svg = render(cam, { frogs: mode, pole: 'planted' }, cast).svg, fr = at(svg, 'data-part="frogs"');
      assert.ok(fr > 0, cam);
      for (const a of [spots(cam)['raft-1'], { x: dive[0], y: dive[1] + 8 }, spots(cam).shallows]) {
        const d = drawnAt(svg, a);
        assert.ok(d > fr, cam + ' ' + mode + ': the frogs are drawn before whoever is at ' + Math.round(a.x) + ',' + Math.round(a.y));
      }
    }
    // and the picture is arranged so that none is hidden behind a head on the raft: no frog's pad lies
    // behind our cat's head or Riffle's, sitting or standing
    const r = render(cam, {}, [ME(), RIFFLE()]);
    L.pads.filter((q) => q[3] === 'frog').forEach((q) => r.heads.forEach((h, i) => {
      const hx = h.x * 16, hy = h.y * 10, hr = (h.r || 4) * 16;
      assert.ok(Math.hypot(q[0] - hx, q[1] - q[2] * 0.4 - hy) > hr + q[2] * 0.7, cam + ': the frog of pad ' + q.slice(0, 2) + ' is clear of the head at raft-' + (i + 1));
    }));
    // nor on the spot where his head comes up
    L.pads.filter((q) => q[3] === 'frog').forEach((q) => assert.ok(Math.hypot(q[0] - dive[0], q[1] - dive[1]) > dive[2] * 1.16 + q[2], cam + ': the frog of pad ' + q.slice(0, 2) + ' is clear of the rings where he dived'));
  }
});

test('her paw held over a print, from the raft\'s edge (`raft-edge`, the `mud` camera, cats.js\'s `reach`): crouched on the lip of the near log, one forepaw out and down over the mud and touching nothing, a tiny print right under it, half its size', () => {
  const I = info(), M = I.mud, a = spots('mud')[EDGE], R = M.raft;
  // the spot: over the raft's front edge, and off the mud (it is where her held-out paw hangs: her feet are on the lip)
  assert.ok(a && a.air === true && a.elev === true, 'no ground shadow from scenes.js there, and nobody lands there for want of a spot');
  assert.ok(a.x > R.x0 + 100 && a.x < R.x1 - 300 && !inside(M.mud, a.x, a.y), 'over the raft\'s front edge, not on the mud');
  assert.ok(M.lip > R.bot && M.lip < R.bot + 30 * R.k && a.y > M.lip + 20, 'the lip of the near log, and the paw\'s place below it: ' + M.lip + ' / ' + a.y);
  CAMS.filter((c) => c !== 'mud').forEach((c) => assert.equal(spots(c)[EDGE], undefined, c + ': only the mud camera has it'));
  assert.equal(render('wide', {}, [{ who: 'player', at: EDGE, pose: 'crouch', reach: true }]).heads[0], null, 'out of sight anywhere else');
  // a nearer place than the raft's two seats, so she is a little bigger there (the camera looks down the logs)
  assert.ok(a.h > spots('mud')['raft-1'].h * 1.1 && a.h < spots('mud')['raft-1'].h * 1.3);
  const cast = [HERON(), { who: 'player', at: EDGE, pose: 'crouch', mood: 'wonder', facing: 'right', reach: true }, RIFFLE({ holds: 'pole', facing: 'left' })];
  const r = render('mud', { prints: true, tap: 'pole' }, cast), svg = r.svg;
  checkRender(r, { cast }, 'the prints panel');
  // her drawing says where the paw is and where the edge is; the set puts the edge on the lip
  const ch = art.character('player', { pose: 'crouch', mood: 'wonder', facing: 'right', reach: true, look: LOOK, sex: LOOK.sex });
  assert.ok(ch.reach && ch.reach.y > ch.reach.edge + 8 && ch.reach.x > 140, 'the paw hangs below the line of her other feet, out in front: ' + JSON.stringify(ch.reach));
  assert.equal(art.character('player', { pose: 'crouch', look: LOOK }).reach, undefined, 'only when asked');
  assert.equal(art.character('player', { pose: 'sit', reach: true, look: LOOK }).reach, undefined, 'and only crouching');
  const F = art.marshInfo.figure('mud', cast[1], LOOK), k = F.k;
  const lipY = a.y + (ch.reach.edge - ch.h) * k, paw = { x: a.x + (ch.reach.x - ch.w / 2) * k, y: a.y + (ch.reach.y - ch.h) * k, r: ch.reach.r * k };
  assert.ok(Math.abs(lipY - M.lip) <= 4, 'her feet are on the lip of the near log: ' + lipY.toFixed(1) + ' against ' + M.lip);
  // the paw: past the raft's front face, over the mud's edge, touching nothing
  assert.ok(paw.y + paw.r * 0.6 > R.bot + 20 * R.k, 'out past the logs: ' + paw.y.toFixed(0));
  // …and one tiny print lies right under it: the line of prints is laid so
  const U = M.printUnder;
  assert.ok(U && inside(M.mud, U.x, U.y), 'a print, in the mud');
  assert.ok(Math.abs(U.x - paw.x) < paw.r * 0.6, 'right under the paw: ' + U.x.toFixed(0) + ' against ' + paw.x.toFixed(0));
  const gap = (U.y - U.w * 0.36) - (paw.y + paw.r * 0.6);
  assert.ok(gap > 6 && gap < paw.r * 2.4, 'held over it, not on it, and not far above: ' + gap.toFixed(0));
  // half the size of hers (“It’s half the size of yours.”)
  assert.ok(U.w / (paw.r * 2) > 0.42 && U.w / (paw.r * 2) < 0.62, 'the print is half the paw: ' + U.w.toFixed(1) + ' against ' + (paw.r * 2).toFixed(1));
  const prints = group(svg, 'data-part="prints"');
  assert.ok(prints.includes('M' + num(U.x - U.w * 0.4)) || count(prints, /data-print="tiny"/g) > 20, 'that print is drawn');
  // her shadow on the log where her feet are, and the paw's small one on the mud at the print
  const sh = group(svg, 'data-part="edge-shadow"');
  assert.equal(count(sh, /<ellipse /g), 2);
  assert.ok(new RegExp('<ellipse cx="' + num(a.x) + '" cy="' + num(lipY - 1).replace('.', '\\.') + '"').test(sh), 'her shadow, on the lip');
  assert.ok(new RegExp('<ellipse cx="' + num(paw.x).replace('.', '\\.') + '" cy="[\\d.]+"[^>]*data-part="paw-shadow"').test(sh), 'the paw\'s shadow, under it');
  assert.ok(at(svg, 'data-part="raft"') < at(svg, 'data-part="edge-shadow"') && at(svg, 'data-part="prints"') < at(svg, 'data-part="edge-shadow"') && at(svg, 'data-part="edge-shadow"') < drawnAt(svg, a), 'on the logs and the mud, under her');
  // the lettering keeps off the paw and its print
  assert.ok(r.keep.some((q) => q.x * 16 < paw.x && (q.x + q.w) * 16 > paw.x && q.y * 10 < paw.y && (q.y + q.h) * 10 > U.y), 'kept clear: ' + JSON.stringify(r.keep));
  // without the extra (or the drawing) she simply sits there, with a plain shadow at the spot; nobody else's picture changes
  const plain = render('mud', { prints: true }, [HERON(), { who: 'player', at: EDGE, pose: 'sit' }]);
  assert.equal(count(group(plain.svg, 'data-part="edge-shadow"'), /<ellipse /g), 1);
  assert.equal(count(render('mud', { prints: true }, [HERON(), ME()]).svg, /data-part="edge-shadow"/g), 0, 'nothing of it when nobody is there');
  // every look: the white of white paws, a tabby's bars: it is her own paw
  for (const look of [{ fur: 'black', marking: 'none' }, { fur: 'ginger', marking: 'white-paws' }, { fur: 'tortie', marking: 'white-chest' }]) {
    const rr = art.render({ set: 'marsh', cam: 'mud', opts: { prints: true }, cast, fx: ['day'] }, { look: Object.assign({ eyes: 'green', sex: 'she' }, look) });
    checkRender(rr, { cast }, 'look ' + look.fur);
    assert.equal(count(rr.svg, /data-part="paw-shadow"/g), 1);
  }
});

// ---------------------------------------------------------------- the pale reed

test('one reed is Wisp: the set draws her among the pale reeds in every picture that shows them, behind the reeds in front of her', () => {
  const I = info();
  for (const cam of CAMS) {
    const svg = render(cam, {}, [ME(), RIFFLE(), HERON()]).svg;
    assert.equal(count(svg, /data-part="pale-reed"/g), REEDED.includes(cam) ? 1 : 0, cam + ': ' + (REEDED.includes(cam) ? 'she is there' : 'the pale reeds are out of sight'));
    assert.equal(count(render(cam).svg, /data-part="pale-reed"/g), REEDED.includes(cam) ? 1 : 0, cam + ': with nobody in the cast too: from the first picture');
    if (!REEDED.includes(cam)) continue;
    const a = spots(cam).reed, L = I[COMP[cam]];
    // among the PALE reeds: a stand of them stands at her spot, taller than she is
    const stand = L.reeds.find((q) => Array.isArray(q.pale) && a.x > q.pale[0] + 40 && a.x < q.pale[1] - 40 && q.layer === 'back');
    assert.ok(stand, cam + ': pale reeds on both sides of her');
    const tall = art.marshInfo.figure(cam, { who: 'wisp', at: 'reed', pose: 'reed' }, LOOK);
    if (has('wisp')) assert.ok(stand.h * stand.vary[0] > a.y - tall.box[1], cam + ': the shortest of the reeds is taller than she is: ' + (stand.h * stand.vary[0]).toFixed(0) + ' against ' + (a.y - tall.box[1]).toFixed(0));
    // behind the heron: further back, and to her far side from the raft
    const s = spots(cam).shallows;
    assert.ok(a.y < s.y && a.x > s.x + 100, cam + ': behind Patience');
    assert.ok(a.h < s.h && a.z === 'behind', cam + ': further off, and drawn behind the cast');
    // the order: the reeds behind her, her, the reeds in front of her, then the mist and everyone else
    const order = [at(svg, 'data-layer="back"'), at(svg, 'data-part="pale-reed"'), at(svg, 'data-part="reed-front"'), at(svg, 'data-part="mud"'), drawnAt(svg, s)];
    assert.ok(order.every((v) => v > 0), cam + ': ' + order);
    for (let i = 1; i < order.length; i++) assert.ok(order[i] > order[i - 1], cam + ': layer ' + i + ' is over layer ' + (i - 1));
    // default: still a reed. She is drawn as cats.js draws her, when it does
    assert.ok(/data-part="pale-reed" data-pale="reed"/.test(svg), cam + ': a reed by default');
    if (has('wisp')) {
      const her = group(svg, 'data-part="pale-reed"'), ch = art.character('wisp', { pose: 'reed', mood: 'neutral', facing: 'left' });
      assert.ok(/data-wisp="cast"/.test(her), cam + ': the cast\'s own drawing of her');
      assert.ok(strip(her).includes(strip(ch.svg).slice(0, 200)), cam + ': her `reed` pose, as cats.js draws it');
      // at the size and the place scenes.js would put her
      const there = render(cam, {}, [{ who: 'wisp', at: 'reed', pose: 'reed' }]);
      const t1 = /<g transform="(translate\([^"]+)"/.exec(her.slice(her.indexOf('<g', 3)))[1], t2 = /<g transform="(translate\([^"]+)"/.exec(there.svg.slice(drawnAt(there.svg, a)))[1];
      assert.equal(t1, t2, cam + ': exactly where the cast\'s Wisp stands');
      // and in the light of the scene, as the cast is: washed at night, in the gold, at dusk; not by day
      assert.ok(!/feColorMatrix/.test(svg) || !/marsh-tint/.test(svg), cam + ': by day, no wash');
      for (const tod of ['sunset', 'dusk', 'night']) {
        const lit = render(cam, {}, [ME()], [tod]).svg, mine = /<g transform="translate\([^"]+"( filter="url\(#[^"]+marsh-tint\)")?>/.exec(group(lit, 'data-part="pale-reed"').slice(3));
        assert.ok(mine && mine[1], cam + ' ' + tod + ': the set\'s Wisp wears the light\'s wash');
        const mats = [...lit.matchAll(/<feColorMatrix type="matrix" values="([^"]+)"/g)].map((m) => m[1]);
        assert.ok(mats.length === 2 && mats[0] === mats[1], cam + ' ' + tod + ': the very wash our cat wears');
      }
    }
  }
});

test('never pointed at: she is not in keep, nothing glows on her, and she is the same whoever else is in the picture', () => {
  for (const cam of REEDED) {
    const a = spots(cam).reed;
    for (const opts of [{}, { owed: 9 }, { tap: 'mud', prints: true }, { pole: 'planted', dragonfly: 'beak', fish: 'strings', snout: true }]) {
      const r = render(cam, opts, [ME(), RIFFLE({ holds: 'pole' }), HERON('point')]);
      const body = [a.x / 16, (a.y - a.h * 0.9) / 10];
      for (const k of r.keep) assert.ok(!(body[0] > k.x && body[0] < k.x + k.w && body[1] > k.y && body[1] < k.y + k.h), cam + ' ' + JSON.stringify(opts) + ': keep does not hold her');
      const her = group(r.svg, 'data-part="pale-reed"') + group(r.svg, 'data-part="reed-front"');
      assert.ok(!/pc-tap|pcs-pulse|pcs-glint|pc-glint|sparkle/.test(her), cam + ': nothing glows or twinkles on her');
    }
    // the picture of her does not change with the rest of the scene
    const alone = group(render(cam).svg, 'data-part="pale-reed"'), busy = group(render(cam, { owed: 5, pole: 'planted', prints: true }, [ME(), RIFFLE(), HERON('eye')]).svg, 'data-part="pale-reed"');
    assert.equal(strip(alone), strip(busy), cam);
  }
});

test('pale: reed, flinch, knees, blink: the reeds in front of her cover all of her, then less', () => {
  const stems = (g) => count(g, /[MLQ]/g), zones = (g) => /data-zones="([\d. ]+)"/.exec(g)[1].split(' ').map(Number);
  for (const cam of REEDED) {
    const by = {};
    for (const mode of OPTS.pale) {
      const svg = render(cam, { pale: mode }).svg;
      assert.ok(new RegExp('data-part="pale-reed" data-pale="' + mode + '"').test(svg), cam + ' ' + mode);
      assert.ok(new RegExp('data-part="reed-front" data-cover="' + mode + '"').test(svg), cam + ' ' + mode + ': its reeds');
      by[mode] = { her: group(svg, 'data-part="pale-reed"'), front: group(svg, 'data-part="reed-front"') };
    }
    assert.equal(strip(render(cam, { pale: 'green' }).svg), strip(render(cam).svg), cam + ': an unknown value is the default');
    // what the reeds cover, [her legs, her body, her head]: all of the still one; a little of her
    // face at the flinch; her legs once they have parted, her face still in the plumes; then her face
    assert.deepEqual(zones(by.reed.front), [1, 1, 1], cam + ': a reed among reeds');
    const fl = zones(by.flinch.front), kn = zones(by.knees.front), bl = zones(by.blink.front);
    assert.ok(fl[0] === 1 && fl[1] === 1 && fl[2] > 0 && fl[2] < 1, cam + ': the flinch shows a little of her face: ' + fl);
    assert.ok(kn[0] < 1 && kn[1] < 1 && kn[2] === 1, cam + ': knees: her legs, not yet her face: ' + kn);
    assert.ok(bl[0] < 1 && bl[1] <= kn[1] && bl[2] === 0, cam + ': blink: her face: ' + bl);
    // and there is that much more reed drawn in front of her
    assert.ok(stems(by.reed.front) > stems(by.flinch.front) && stems(by.reed.front) > stems(by.knees.front) && stems(by.knees.front) > stems(by.blink.front) * 1.5, cam + ': ' + OPTS.pale.map((m) => m + ' ' + stems(by[m].front)).join(', '));
    if (has('wisp')) {
      // knees is the same still pose (it is the reeds that parted); blink and flinch are her own poses
      assert.ok(strip(by.knees.her).replace('data-pale="knees"', '') === strip(by.reed.her).replace('data-pale="reed"', '').replace(' opacity="' + THIN + '"', ''), cam + ': knees: she has not moved');
      for (const mode of ['blink', 'flinch']) {
        const ch = art.character('wisp', { pose: mode, mood: 'neutral', facing: 'left' });
        assert.ok(strip(by[mode].her).includes(strip(ch.svg).slice(0, 200)), cam + ' ' + mode + ': her pose of that name');
        assert.notEqual(strip(by[mode].her), strip(by.reed.her).replace('"reed"', '"' + mode + '"'), cam + ' ' + mode + ' is not the still reed');
      }
    }
    // while she is still a reed she is thinner yet behind her plumes (a paler strip between the stems, found
    // on a second look); her knees, her flinch and her eyes are as solid as she ever is
    assert.match(by.reed.her, new RegExp('^<g data-part="pale-reed" data-pale="reed" data-wisp="(cast|own)" opacity="' + THIN + '">'), cam + ': the still reed is thin');
    for (const mode of ['flinch', 'knees', 'blink']) assert.doesNotMatch(by[mode].her.slice(0, by[mode].her.indexOf('>') + 1), /opacity=/, cam + ' ' + mode + ': no thinner than she is');
    // …and a sheaf of plumes stands right across her face, long leaves across her body: far more reed in front
    // of the still one than she is wide (she read as a dragonet at first look through eight thin stems)
    const plumes = (g) => count(g, /Q[\d. -]+ [\d. -]+ [\d. -]+ [\d. -]+/g);
    assert.ok(stems(by.reed.front) >= stems(by.blink.front) * 3, cam + ': ' + stems(by.reed.front) + ' against ' + stems(by.blink.front));
    // the flinch: one jerk: a few quick lines beside her, rings at her foot; no other reed moves
    assert.equal(count(by.flinch.her, /data-part="flinch"/g), 1, cam + ': quick lines beside her');
    assert.equal(count(by.reed.her, /data-part="flinch"/g), 0, cam);
    const still = (svg) => group(svg, 'data-layer="back"');
    assert.equal(strip(still(render(cam, { pale: 'flinch' }).svg)), strip(still(render(cam).svg)), cam + ': the reeds behind her have not stirred');
  }
  // out of sight, the option changes nothing
  for (const cam of ['mud', 'pole', 'draw']) for (const mode of OPTS.pale) assert.equal(strip(render(cam, { pale: mode }).svg), strip(render(cam).svg), cam + ' ' + mode);
});

test('when the cast has a Wisp of its own the set draws none; the reeds stay in front of her while she is still a reed', { skip: !has('wisp') }, () => {
  for (const cam of REEDED) {
    const a = spots(cam).reed;
    for (const pose of art.vocab.otherPoses.wisp) {
      const hiding = pose === 'reed' || pose === 'flinch';
      for (const mode of OPTS.pale) {
        const r = render(cam, { pale: mode }, [ME(), { who: 'wisp', at: 'reed', pose }]), svg = r.svg;
        assert.equal(count(svg, /data-part="pale-reed"/g), 0, cam + ' ' + pose + ': only one of her');
        assert.equal(count(svg, /data-part="reed-front"/g), 1, cam + ' ' + pose + ': the reeds at her foot');
        assert.ok(new RegExp('data-part="reed-front" data-cover="' + (hiding ? mode : 'found') + '"').test(svg), cam + ' ' + pose + ' pale ' + mode + ': ' + (hiding ? 'still hidden as `pale` says' : 'found: they stand aside'));
        if (!hiding) assert.ok(/data-zones="0 0 0"/.test(svg), cam + ' ' + pose + ': nothing of her is covered');
        assert.ok(at(svg, 'data-part="reed-front"') > drawnAt(svg, a) && drawnAt(svg, a) > 0, cam + ': in front of her');
      }
    }
    // found: next to nothing in front of her
    const found = group(render(cam, {}, [{ who: 'wisp', at: 'reed', pose: 'blink' }]).svg, 'data-part="reed-front"');
    const hidden = group(render(cam, {}, [{ who: 'wisp', at: 'reed', pose: 'reed' }]).svg, 'data-part="reed-front"');
    assert.ok(count(found, /[MLQ]/g) * 4 < count(hidden, /[MLQ]/g), cam + ': a blade or two against a clump');
    // a Wisp anywhere in the cast is the only one
    assert.equal(count(render(cam, {}, [{ who: 'wisp', at: { x: 800, y: 800 }, pose: 'pawup' }]).svg, /data-part="pale-reed"/g), 0, cam);
  }
  // her face is in the picture where the camera is hers
  const r = render('wisp', {}, [ME(), HERON(), { who: 'wisp', at: 'reed', pose: 'shh' }]);
  assert.ok(r.heads[2] && r.heads[2].y > 3, 'wisp: her head is in shot');
  assert.ok(Math.abs(r.heads[2].y - r.heads[1].y) < 22 && r.heads[2].x > r.heads[1].x + 20, 'wisp: beside the heron, about as tall: she believes she is one');
});

test('without cats.js\'s drawing the set draws her itself: slim, on one leg with a knee, pearl-white, her eyes shut until she blinks', () => {
  const keepCast = art.vocab.cast, W = art.marshInfo.wisp;
  try {
    art.vocab.cast = keepCast.filter((w) => w !== 'wisp');
    for (const cam of REEDED) {
      const her = (mode) => group(render(cam, { pale: mode }).svg, 'data-part="pale-reed"');
      const reed = her('reed'), blink = her('blink'), flinch = her('flinch');
      assert.ok(/data-wisp="own"/.test(reed), cam + ': the set\'s own lines');
      assert.ok(reed.toLowerCase().includes(W.fill) && reed.toLowerCase().includes(W.line), cam + ': pearl, a fine line');
      assert.equal(count(reed, /data-wisp="knee"/g), 2, cam + ': a knee on the leg she stands on, and the tucked one');
      assert.equal(count(reed, /data-wisp="eye-shut"/g), 1, cam + ': eye shut');
      assert.equal(count(reed, /data-wisp="eye"/g), 0, cam);
      assert.equal(count(blink, /data-wisp="eye"/g), 2, cam + ': two eyes, open');
      assert.ok(blink.toLowerCase().includes(W.eye), cam + ': pale gold');
      assert.ok(/fill-opacity="0\.[6-8]"/.test(reed), cam + ': thin enough to see the reeds through');
      assert.ok(/transform="rotate\(/.test(flinch) && !/transform="rotate\(/.test(reed), cam + ': the flinch is a jerk');
      assert.ok(strip(her('knees')).replace('"knees"', '"reed"') === strip(reed).replace(' opacity="' + THIN + '"', ''), cam + ': knees: she has not moved');
      assert.ok(reed.startsWith('<g data-part="pale-reed" data-pale="reed" data-wisp="own" opacity="' + THIN + '">'), cam + ': thinner still while she is a reed');
    }
  } finally { art.vocab.cast = keepCast; }
});

test('the set\'s Wisp and Puddle wear the colours app/art/cats.js gives them', () => {
  const W = art.marshInfo.wisp, P = art.marshInfo.puddle;
  if (has('wisp')) {
    const svg = art.character('wisp', { pose: 'blink' }).svg.toLowerCase();
    for (const k of ['fill', 'line', 'claw', 'eye']) assert.ok(svg.includes(W[k]), 'cats.js still draws Wisp with ' + k + ' ' + W[k]);
  }
  if (has('puddle')) {
    const svg = art.character('puddle', { pose: 'nostrils' }).svg.toLowerCase() + art.character('puddle', { pose: 'head' }).svg.toLowerCase();
    for (const k of ['base', 'line', 'light', 'belly', 'nostril']) assert.ok(svg.includes(P[k]), 'cats.js still draws Puddle with ' + k + ' ' + P[k]);
  }
});

// ---------------------------------------------------------------- Puddle's snout

test('snout: the tip of a blue-grey snout up between two of the raft\'s logs; not when the cast has brought him', () => {
  const I = info(), P = art.marshInfo.puddle;
  for (const cam of RAFTED) {
    const R = I[COMP[cam]].raft, S0 = I[COMP[cam]].snout, A = spots(cam);
    assert.equal(count(render(cam).svg, /data-part="snout"/g), 0, cam + ': not by default');
    const r = render(cam, { snout: true }, [ME(), HERON()]), sn = group(r.svg, 'data-part="snout"');
    assert.ok(sn, cam + ': the snout');
    for (const k of ['base', 'line', 'belly', 'nostril']) assert.ok(sn.toLowerCase().includes(P[k]), cam + ': his ' + k);
    assert.equal(count(sn, /data-nostril="1"/g), 2, cam + ': two nostrils');
    // between two logs: on the line where the third log meets the fourth, over the raft, in the panel
    const dy = (R.bot - R.top) / 4, gapY = R.top + S0.gap * dy;
    const m = /<ellipse cx="([-\d.]+)" cy="([-\d.]+)"/.exec(sn);
    assert.ok(Math.abs(+m[1] - S0.x) < 0.2 && Math.abs(+m[2] - gapY) < 8 * R.k, cam + ': in the gap between two logs: ' + m[2] + ' at ' + gapY.toFixed(0));
    assert.ok(S0.gap >= 1 && S0.gap <= 3 && S0.x > Math.max(R.x0, 0) + 40 && S0.x < R.x1 - 60 && gapY < 990, cam + ': in the raft, in the picture');
    // beside our cat, not under her, and nothing dark in the water under the raft
    for (const k of ['raft-1', 'raft-2']) assert.ok(Math.abs(S0.x - A[k].x) > A[k].h * 0.28, cam + ': clear of ' + k + ': ' + Math.abs(S0.x - A[k].x) + ' of ' + A[k].h);
    assert.ok(at(r.svg, 'data-part="snout"') > drawnAt(r.svg, A['raft-1']), cam + ': in front of the logs');
    // he is small: the tip of a nose, not a head
    const w = /Q[-\d.]+ [-\d.]+ ([-\d.]+) [-\d.]+Z/.exec(sn);
    assert.ok(w && Math.abs(+w[1] - S0.x) * 2 < A['raft-1'].h * 0.3, cam + ': a nose tip');
    // the cast's own Puddle: the set draws none
    assert.equal(count(render(cam, { snout: true }, [ME(), { who: 'puddle', at: 'raft-2', pose: 'nostrils' }]).svg, /data-part="snout"/g), 0, cam + ': only one of him');
    // the catch and the snout do not lie on each other
    const F = I[COMP[cam]].strings;
    for (const x of F.xs) assert.ok(Math.abs(x - S0.x) > F.len * 0.5, cam + ': a string at ' + x + ' is clear of the snout at ' + S0.x);
  }
  assert.equal(count(render('pole', { snout: true }).svg, /data-part="snout"/g), 0, 'pole');
});

// ---------------------------------------------------------------- the prints, and the two Taps

test('prints: tiny ones in a line across the mud, half the size of a cat\'s paw, beside one great heron print; never a cat\'s', () => {
  const I = info();
  for (const cam of CAMS) {
    const L = I[COMP[cam]], R = L.prints;
    assert.equal(count(render(cam).svg, /data-part="prints"/g), 0, cam + ': not until she looks');
    const svg = render(cam, { prints: true }, []).svg, pr = group(svg, 'data-part="prints"');
    if (!R) { assert.equal(pr, '', cam + ': no mud for them here'); continue; }
    assert.ok(pr, cam + ': prints');
    const tiny = count(pr, /data-print="tiny"/g);
    assert.ok(tiny >= 5, cam + ': a line of them: ' + tiny);
    assert.equal(count(pr, /data-print="heron"/g), cam === 'pole' ? 0 : 1, cam + ': one great heron print');
    assert.equal(count(pr, /data-print="/g), tiny + (cam === 'pole' ? 0 : 1), cam + ': and no other kind of print: never a cat\'s');
    // in the mud, all along the line
    for (const q of R.line) if (q[1] < 1000) assert.ok(inside(L.mud, q[0], Math.min(q[1], 996)), cam + ': the line runs over the mud: ' + q);
    if (R.heron) assert.ok(inside(L.mud, R.heron[0], Math.min(R.heron[1], 996)), cam + ': the heron print is in the mud');
    // after the mud, before the raft and the cast
    assert.ok(at(svg, 'data-part="prints"') > at(svg, 'data-part="mud"'), cam);
    if (L.raft) {
      const h = spots(cam)['raft-1'].h, paw = h * 0.115;   // a cat's forepaw is about this wide
      if (cam === 'mud') assert.ok(R.w > paw * 0.4 && R.w < paw * 0.62, 'mud: a tiny print is half the size of her paw: ' + R.w + ' against ' + paw.toFixed(1));
      else assert.ok(R.w < paw * 0.7, cam + ': tiny: ' + R.w);
      assert.ok(R.heron[2] > R.w * 4.5, cam + ': the heron\'s is great beside them');
    }
  }
  // the close-up: the line passes under our cat's place on the raft, just off the logs
  const M = I.mud, a = spots('mud')['raft-1'], near = M.prints.line.reduce((b, q) => Math.min(b, Math.hypot(q[0] - (a.x + a.h * 0.36), q[1] - (M.raft.bot + 110))), 1e9);
  assert.ok(near < 60, 'mud: a print lies just below her reaching paw: ' + near.toFixed(0));
  // from the pole, they run off toward the two shiny lines, smaller and smaller
  const P = I.pole, last = P.prints.line[P.prints.line.length - 1], first = P.prints.line[0];
  assert.ok(P.prints.w1 < P.prints.w / 3 && last[1] < first[1] - 500, 'pole: away into the distance');
  const railY = P.tracks.y0 + (P.tracks.y1 - P.tracks.y0) * (last[0] - P.tracks.x0) / (P.tracks.x1 - P.tracks.x0);
  assert.ok(Math.abs(last[1] - railY) < 30, 'pole: the line of them ends at the tracks: ' + last[1] + ' / ' + railY.toFixed(0));
});

test('pole: two shiny lines far away, on a low bank; the lettering keeps off them', () => {
  const r = render('pole', { prints: true }, [{ who: 'player', at: 'pole-top', pose: 'crouch' }]), tr = group(r.svg, 'data-part="tracks"'), T = info().pole.tracks;
  assert.ok(tr, 'the tracks');
  const rails = [...tr.matchAll(/<path d="M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)"[^>]*data-rail="(\d)"/g)].map((m) => m.slice(1, 5).map(Number));
  assert.equal(rails.length, 2, 'two lines');
  assert.ok(rails[1][1] - rails[0][1] > 5 && rails[1][1] - rails[0][1] < 14 && Math.abs((rails[0][3] - rails[0][1]) - (rails[1][3] - rails[1][1])) < 3, 'side by side, a little apart: two, not one');
  assert.ok(rails.every((q) => q[1] < 420 && q[3] < 420 && q[1] > info().pole.hz), 'far away, this side of the far trees');
  assert.ok(/class="pcs-glint"/.test(tr), 'shiny');
  assert.equal(count(render('pole', {}, [], ['night']).svg, /data-part="tracks"/g), 1);
  const k = r.keep[0];
  assert.ok(k && k.y < 40 && k.y + k.h > T.y1 / 10 && k.x + k.w > 80, 'in keep: ' + JSON.stringify(r.keep));
  for (const cam of CAMS.filter((c) => c !== 'pole')) assert.equal(count(render(cam).svg, /data-part="tracks"|data-rail=/g), 0, cam + ': only from the top of the pole');
});

test('tap: no target unless the frame\'s scene asks; then one unpainted pc-tap, named, on the mud or on the pole; the art itself never glows', () => {
  const I = info();
  const HIT = /<ellipse cx="([-\d.]+)" cy="([-\d.]+)" rx="([-\d.]+)" ry="([-\d.]+)" fill="none" class="pc-tap" data-tap="(\w+)"\/>/;
  // never by default, whatever else is in the picture (the page takes a pc-tap in a picture for the
  // thing to touch: on Riffle's seven questions it must find none here, and glow on him)
  for (const cam of CAMS) for (const opts of [{}, { prints: true }, { pole: 'planted' }, { owed: 9, prints: true, pole: 'planted', fish: 'strings', snout: true }]) {
    const svg = render(cam, opts, [ME(), RIFFLE({ holds: 'pole' }), HERON('point')]).svg;
    assert.equal(count(svg, /pc-tap|data-tap=|pc-next|data-art="glint"|pc-glint/g), 0, cam + ' ' + JSON.stringify(opts) + ': no target');
  }
  // and the art draws no glow of its own in any case: the page lays its soft glow on the target
  for (const cam of CAMS) for (const tap of ['mud', 'pole']) {
    const svg = render(cam, { tap, pole: 'planted' }, [ME(), RIFFLE({ holds: 'pole' }), HERON('point')]).svg;
    assert.equal(count(svg, /data-art="glint"|pc-glint|pcs-pulse/g), 0, cam + ' tap ' + tap + ': nothing of the art\'s glows');
    assert.ok(count(svg, /class="pc-tap"/g) <= 1, cam + ': never two targets');
    // the picture is the same picture with the target as without it (the mark is unpainted)
    const plain = render(cam, { pole: 'planted' }, [ME(), RIFFLE({ holds: 'pole' }), HERON('point')]).svg;
    assert.equal(strip(svg).replace(HIT, ''), strip(plain), cam + ' tap ' + tap + ': nothing else changes');
  }
  // the patch of mud beside the raft
  for (const cam of CAMS) {
    const r = render(cam, { tap: 'mud' }, [ME(), RIFFLE({ holds: 'pole' }), HERON('point')]), svg = r.svg, patch = I[COMP[cam]].patch;
    if (!PATCHED.includes(cam)) { assert.equal(count(svg, /pc-tap/g), 0, cam + ': no patch to tap here'); assert.equal(patch, null); continue; }
    assert.equal(count(svg, /class="pc-tap"/g), 1, cam + ': one target');
    const hit = HIT.exec(svg);
    assert.ok(hit && hit[5] === 'mud', cam + ': an unpainted ellipse, class pc-tap, data-tap="mud"');
    assert.deepEqual(hit.slice(1, 5).map(Number), patch, cam + ': the patch');
    assert.ok(inside(I[COMP[cam]].mud, patch[0], patch[1]) && patch[0] - patch[2] > 0 && patch[0] + patch[2] < 1600 && patch[1] + patch[3] < 1012, cam + ': on the mud, in the panel');
    // about the size of the glow the page will lay on it: not a speck, not half the panel
    assert.ok(patch[2] >= 70 && patch[2] <= 130 && patch[3] < patch[2], cam + ': the size of a patch of mud: ' + patch);
    // the page's glow (a circle two and a half times the mark's longer half across) stays on the mud's side of the raft
    if (cam === 'mud') assert.ok(patch[1] - patch[2] * 1.25 > R0(cam).bot, cam + ': the glow is below the logs, on the mud');
    else assert.ok(patch[0] - patch[2] * 1.25 > R0(cam).x1 - 40, cam + ': the glow is clear of the two on the raft');
    // beside the raft: within a raft's length of its mud end
    const R = I[COMP[cam]].raft;
    assert.ok(patch[0] > R.x1 - 500 * R.k && patch[0] - R.x1 < 420 * R.k, cam + ': beside the raft');
    // it is what the picture is about: first in keep (so a page that finds no target puts its star there too)
    assert.ok(r.keep[0] && Math.abs(r.keep[0].x + r.keep[0].w / 2 - patch[0] / 16) < 1.5 && Math.abs(r.keep[0].y + r.keep[0].h / 2 - Math.min(patch[1], 990) / 10) < 6, cam + ': keep[0] is the patch: ' + JSON.stringify(r.keep[0]));
  }
  // without the option: in the `mud` camera, and wherever the heron points, the patch is still first in keep
  for (const cam of PATCHED) {
    const patch = I[COMP[cam]].patch, first = (r) => r.keep[0] && Math.abs(r.keep[0].x + r.keep[0].w / 2 - patch[0] / 16) < 1.5;
    assert.ok(first(render(cam, { owed: 9 }, [ME(), RIFFLE(), HERON('point')])), cam + ': she points at it: it comes before the cloud');
    assert.equal(!!first(render(cam, { owed: 9 }, [ME(), RIFFLE(), HERON('stand')])), cam === 'mud', cam + ': not pointing: only the close-up keeps it');
  }
  // where her bill points, in the two pictures the Tap is likeliest in: down at the patch
  if (has('patience')) for (const cam of ['wide', 'heron']) {
    const f = art.marshInfo.figure(cam, HERON('point'), LOOK), ch = art.character('patience', { pose: 'point', facing: 'left' }), a = spots(cam).shallows, patch = I[COMP[cam]].patch;
    const tip = [a.x + (ch.bounds.x0 - ch.w / 2) * f.k, a.y + (ch.headBox.y1 - ch.h) * f.k];
    assert.ok(tip[0] > patch[0] - patch[2] * 1.6 && tip[0] < patch[0] + patch[2] * 2.2 && tip[1] < patch[1], cam + ': her bill is over the patch: ' + tip.map((v) => v.toFixed(0)) + ' / ' + patch);
  }
  // Riffle's pole, in his paws
  const held = art.character('riffle', { pose: 'stand', holds: 'pole' });
  for (const cam of RAFTED) {
    const r = render(cam, { tap: 'pole', prints: true }, [ME(), RIFFLE({ holds: 'pole' })]), svg = r.svg;
    assert.equal(count(svg, /class="pc-tap"/g), 1, cam + ': one target');
    const m = HIT.exec(svg), hit = m.slice(1, 5).map(Number);
    assert.equal(m[5], 'pole', cam + ': data-tap="pole"');
    const a = spots(cam)['raft-2'];
    if (held.pole) {
      // on the pole itself, as his drawing reports it, just over his head: clear of him, so the glow says "the pole"
      const f = art.marshInfo.figure(cam, RIFFLE({ holds: 'pole' }), LOOK), X = (u) => a.x + (u - held.w / 2) * f.k, Y = (v) => a.y + (v - held.h) * f.k;
      const P = held.pole, onLine = X(P.x0) + (X(P.x1) - X(P.x0)) * (hit[1] - Y(P.y0)) / (Y(P.y1) - Y(P.y0));
      assert.ok(Math.abs(hit[0] - onLine) < 1.5, cam + ': on the pole: ' + hit[0] + ' / ' + onLine.toFixed(1));
      assert.ok(hit[1] < f.box[1] && hit[1] + hit[3] > f.box[1] - hit[3] * 0.6, cam + ': just over his head: ' + hit[1] + ' above ' + f.box[1].toFixed(0));
      assert.ok(hit[1] > Math.max(Y(P.y1), 0) && hit[1] - hit[3] > -60, cam + ': and still on the pole, in the picture');
    }
    assert.ok(Math.abs(hit[0] - a.x) < a.h * 0.5 && hit[1] < a.y && hit[1] > a.y - a.h * 1.6, cam + ': it is his pole, beside him');
    assert.ok(hit[2] === hit[3] && hit[2] >= 56 && hit[2] <= 84, cam + ': round, a paw\'s reach across: the pole itself is thin');
    assert.ok(at(svg, 'class="pc-tap"') > drawnAt(svg, a), cam + ': over him');
    assert.ok(Math.abs(r.keep[0].x + r.keep[0].w / 2 - hit[0] / 16) < 1.5 && Math.abs(r.keep[0].y + r.keep[0].h / 2 - hit[1] / 10) < 1.5, cam + ': keep[0] is the pole: ' + JSON.stringify(r.keep[0]));
  }
  // planted, with nobody holding it: the planted pole
  const r = render('mud', { tap: 'pole', pole: 'planted' }, [ME()]), P = I.mud.pole, hit = HIT.exec(r.svg).slice(1, 5).map(Number);
  assert.ok(Math.abs(hit[0] - (P.x + P.lean / 2)) < 12 && hit[1] > P.top && hit[1] < P.foot, 'mud: on the planted pole');
  // no pole anywhere: no target (and no throw)
  assert.equal(count(render('mud', { tap: 'pole' }, [ME(), RIFFLE()]).svg, /pc-tap/g), 0, 'no pole, no target');
  assert.equal(strip(render('wide', { tap: 'nose' }).svg), strip(render('wide').svg), 'an unknown target is none');
  // the page's own rule for which marked thing a frame's tap is for (app/ui.js, tapPick): by its data-tap
  const ui = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
  if (/function tapPick/.test(ui)) assert.ok(/m\.tap === name/.test(ui) && /\.pc-tap/.test(ui), 'the page still finds a target by class pc-tap and picks it by data-tap');
});

// ---------------------------------------------------------------- the far log

test('far across the water, three on a log: small, in the mist, no face to read', () => {
  const I = info(), three = [{ who: 'clancat', variant: 1, at: 'log-1' }, { who: 'clancat', variant: 2, at: 'log-2' }, { who: 'clancat', variant: 4, at: 'log-3' }];
  for (const cam of ['wide', 'far', 'heron']) {
    const A = spots(cam), G = I[COMP[cam]].log, r = render(cam, {}, [ME(), RIFFLE()].concat(three)), svg = r.svg;
    assert.equal(count(svg, /data-part="log"/g), 1, cam + ': the log');
    const xs = ['log-1', 'log-2', 'log-3'].map((k) => A[k].x);
    assert.ok(xs[0] < xs[1] && xs[1] < xs[2] && xs[2] - xs[0] < G.w, cam + ': in a row, on it');
    for (const k of ['log-1', 'log-2', 'log-3']) {
      const a = A[k];
      assert.ok(Math.abs(a.y - G.y) < G.h && a.x > G.x - G.w / 2 && a.x < G.x + G.w / 2, cam + ': ' + k + ' sits on the log');
      assert.ok(a.h <= 64 && a.h < A['raft-1'].h / 4.5, cam + ': ' + k + ' is small: ' + a.h);
      assert.equal(a.z, 'behind', cam + ': ' + k + ' is behind the mist');
      assert.ok(a.y < I[COMP[cam]].hz + 110 && a.y > I[COMP[cam]].hz, cam + ': far across, near the far bank');
    }
    // their faces are specks: under a hundredth of the panel across
    for (const h of r.heads.slice(2)) assert.ok(h && h.r < 0.85, cam + ': no face to read: r ' + h.r);
    // the mist lies over them
    const last = Math.max(...['log-1', 'log-2', 'log-3'].map((k) => drawnAt(svg, A[k])));
    assert.ok(at(svg, 'data-part="veil"') > last && at(svg, 'data-mist="over"') > last && last > 0, cam + ': the veil and the low mist are drawn over the three');
    assert.ok(at(svg, 'data-part="veil"') < drawnAt(svg, A['raft-1']), cam + ': and under the two on the raft');
    const V = I[COMP[cam]];
    assert.ok(V.log && Math.abs(G.x - A['log-2'].x) < 12, cam);
  }
  // `far` is their picture: the log is near the middle, the raft only a corner
  const A = spots('far'), R = I.far.raft;
  assert.ok(A['log-2'].x > 700 && A['log-2'].x < 1200 && A['log-2'].y < 450, 'far: the log, across the water');
  assert.ok(R.x1 < 620 && R.top > 800, 'far: the raft\'s corner, low and left');
  assert.ok(spots('far')['log-1'].h > spots('wide')['log-1'].h, 'far: a little nearer than in the wide picture');
  // mist low on the water, in every camera with a horizon
  for (const cam of ['wide', 'far', 'heron', 'pole', 'reeds']) assert.ok(count(render(cam).svg, /data-part="mist"/g) >= 2, cam + ': mist, far and near');
});

// ---------------------------------------------------------------- her drawings

test('drawing: seven little herons in the mud at her foot, four above three, each on one leg; one pale claw down in the mud', () => {
  const I = info();
  assert.equal(count(render('draw').svg, /data-part="drawing"/g), 0, 'nothing drawn yet');
  const r = render('draw', { drawing: 'herons' }, [ME()]), dr = group(r.svg, 'data-part="drawing"'), D = I.draw.drawing;
  assert.ok(/data-drawing="herons" data-from="own"/.test(dr));
  // seven glyphs: a body, a neck, a bill, one leg with its foot, the other tucked, a tail feather, an eye, the water
  assert.equal(+/data-strokes="(\d+)"/.exec(dr)[1], 7 * 8, 'seven herons, eight strokes each');
  const at7 = [...new Set([...dr.matchAll(/<path [^>]*transform="translate\(([-\d.]+) ([-\d.]+)\) scale/g)].map((m) => m[1] + ' ' + m[2]))].map((s) => s.split(' ').map(Number));
  assert.equal(at7.length, 7, 'seven places');
  const ys = [...new Set(at7.map((q) => q[1]))].sort((a, b) => a - b);
  assert.equal(ys.length, 2, 'two rows');
  assert.equal(at7.filter((q) => q[1] === ys[0]).length, 4, 'four above');
  assert.equal(at7.filter((q) => q[1] === ys[1]).length, 3, 'three below');
  const xs = at7.filter((q) => q[1] === ys[0]).map((q) => q[0]).sort((a, b) => a - b);
  assert.ok(xs[1] - xs[0] > 40, 'each stands clear of the next');
  // one leg each: the leg stroke goes straight down to the foot at (0, 0); the other is a short tucked stroke
  assert.equal(count(dr, /M2 -44L0 0M0 0L-7 3M0 0L7 3M0 0L0 5/g), 14, 'one standing leg a heron (the groove and its lit lip)');
  // big in the picture, in the mud, the lettering off it (first in keep)
  const k = r.keep[0];
  assert.ok(k.w > 30 && k.h > 35 && Math.abs(k.x + k.w / 2 - D.x / 16) < 3 && Math.abs(k.y + k.h / 2 - D.y / 10) < 3, 'keep[0] is the drawing: ' + JSON.stringify(k));
  assert.ok(inside(I.draw.mud, D.x, D.y) && at(r.svg, 'data-part="drawing"') > at(r.svg, 'data-part="mud"'), 'scratched in the mud');
  // her forepaw: always in this camera, in front, five claws, pearl, see-through, its long claw's point at the drawing's end
  for (const what of ['none', 'herons', 'fox']) {
    const s = render('draw', { drawing: what }, [ME()]).svg, paw = group(s, 'data-part="wisp-paw"');
    assert.ok(paw, what + ': her forepaw');
    assert.equal(count(paw, /data-claw="wisp"/g), 5, what + ': five claws');
    assert.ok(paw.toLowerCase().includes(art.marshInfo.wisp.fill) && /fill-opacity="0\.[6-8]"/.test(paw), what + ': pearl, and the mud shows through');
    assert.ok(at(s, 'data-part="wisp-paw"') > drawnAt(s, spots('draw')['raft-1']), what + ': in front');
  }
  assert.equal(spots('draw').reed, undefined, 'she herself is above the picture: no spot for her here');
  for (const cam of CAMS.filter((c) => c !== 'draw')) assert.equal(count(render(cam, { drawing: 'herons' }).svg, /data-part="wisp-paw"/g), 0, cam + ': the set\'s forepaw is the close-up\'s');
  // the same herons, small, at her foot in her own camera; nowhere else
  const w = group(render('wisp', { drawing: 'herons' }).svg, 'data-part="drawing"');
  assert.ok(w && +/data-strokes="(\d+)"/.exec(w)[1] === 56, 'wisp: the drawing at her foot');
  const Dw = I.wisp.drawing, aw = spots('wisp').reed;
  assert.ok(inside(I.wisp.mud, Dw.x, Dw.y) && Math.abs(Dw.x - aw.x) < aw.h * 0.6 && Dw.x < aw.x, 'wisp: in the mud in front of her');
  for (const cam of CAMS.filter((c) => c !== 'draw' && c !== 'wisp')) assert.equal(count(render(cam, { drawing: 'fox' }).svg, /data-part="drawing"/g), 0, cam);
  // behind it: the raft, and our cat on it, small
  const A = spots('draw');
  assert.ok(A['raft-1'].h < 200 && A['raft-1'].y < 300 && r.heads[0], 'draw: our cat on the raft, behind');
});

test('drawing: fox: her card, stroke for stroke, when cards.js has drawn it; else a fox of the set\'s own', () => {
  const rec = () => ({ big: true, out: [], line(d, o) { this.out.push(String(d)); return this; }, fine(d, o) { return this.line(d, o); }, dot(x, y, o) { this.out.push('dot'); return this; } });
  const fox = (svg) => group(svg, 'data-part="drawing"');
  const keepPics = art.cardPictures;
  if (art.cardPictures && art.cardPictures['wisp-fox']) {
    const c = rec();
    art.cardPictures['wisp-fox'].draw(c);
    const dr = fox(render('draw', { drawing: 'fox' }).svg);
    assert.ok(/data-drawing="fox" data-from="card"/.test(dr), 'from the card');
    assert.equal(+/data-strokes="(\d+)"/.exec(dr)[1], c.out.length, 'every stroke of the card, and no more');
    for (const d of c.out.filter((s) => s !== 'dot')) assert.ok(dr.includes('d="' + d + '"'), 'the card\'s stroke ' + d.slice(0, 30));
  }
  try {
    art.cardPictures = {};
    const dr = fox(render('draw', { drawing: 'fox' }).svg);
    assert.ok(/data-drawing="fox" data-from="own"/.test(dr), 'the set\'s own fox');
    assert.ok(+/data-strokes="(\d+)"/.exec(dr)[1] >= 6, 'a head, an eye, a nose, a small thing, its shine, a ring of ripples');
    // a card whose drawing throws leaves the set's own fox, never half a picture
    art.cardPictures = { 'wisp-fox': { draw(c) { c.line('M0 0L5 5'); throw new Error('oops'); } } };
    assert.ok(/data-from="own"/.test(fox(render('draw', { drawing: 'fox' }).svg)));
  } finally { art.cardPictures = keepPics; }
  // lines only: a claw's scratches, nothing filled
  const dr = fox(render('draw', { drawing: 'fox' }).svg);
  assert.ok(/fill="none" stroke-linecap="round"/.test(dr) && !/<path[^>]*fill="#/.test(dr), 'scratched lines');
});

// ---------------------------------------------------------------- still water, reeds taller than a cat

test('still water behind a low bank, reeds taller than a cat, the bottom showing at the mud\'s edge', () => {
  const I = info();
  for (const cam of CAMS) {
    const L = I[COMP[cam]], svg = render(cam).svg;
    assert.equal(count(svg, /data-part="water"/g), 1, cam + ': water');
    assert.equal(count(svg, /data-part="far-bank"/g), L.sky ? 1 : 0, cam + ': the far bank under the sky');
    assert.ok(count(svg, /data-part="reeds"/g) >= 1, cam + ': reeds');
    // the tall stands (not the far ones in the haze) are taller than a cat sitting at their feet
    if (L.sky && L.raft) {
      // how tall a cat would sit at the reeds' own feet (the composition's depth)
      const D = L.depth, catAt = (y) => D[1] + (D[3] - D[1]) * (y - D[0]) / (D[2] - D[0]);
      const near = L.reeds.filter((q) => q.layer === 'back' && q.h > 150);
      assert.ok(near.length >= 2, cam + ': stands of reeds near enough to measure');
      for (const q of near) assert.ok(q.h * q.vary[0] > catAt(Math.max(q.y0, q.y1)) * 1.05, cam + ': the shortest reed of the stand at x ' + q.x0 + ' is ' + (q.h * q.vary[0]).toFixed(0) + ' tall, a cat there ' + catAt(Math.max(q.y0, q.y1)).toFixed(0));
    }
    // shallow water over the mud's edge: pebbles on the bottom, drawn with the mud
    if (L.mud && cam !== 'pole') assert.ok(count(group(svg, 'data-part="mud"'), /<path /g) >= 8, cam + ': the mud, its wet rim, the shallows round it');
  }
  // still: far fewer glints than the Crossing's river, and long level streaks
  const wide = render('wide').svg, crossing = art.render({ set: 'crossing', cam: 'wide' }, { look: LOOK }).svg;
  const glints = (s) => [...s.matchAll(/<path d="([^"]+)"[^>]*class="pcs-glint"/g)].reduce((n, m) => n + count(m[1], /M/g), 0);
  assert.ok(glints(wide) * 4 < glints(crossing), 'still water: ' + glints(wide) + ' glints against the river\'s ' + glints(crossing));
});

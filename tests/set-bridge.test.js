// The Old Bridge set (app/art/sets/bridge.js): node --test tests/set-bridge.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT, load } = require('./_load.js');

const PC = load();
const art = PC.art;
const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };

// docs/build.md, "Art vocabulary, chapter 2" and "Chapter 3 (v0.4)": the names the story is written against
// (chapter 6 adds `wall`, Coil's close beats, a composition of its own; chapters 2 to 5 had the first five)
const CAMS5 = ['bank', 'mouth', 'under', 'back', 'paws'];
const CAMS = [...CAMS5, 'wall'];
const DRAG_CAMS = ['bank', 'mouth', 'under', 'back'];   // the cameras with drag marks, drips and the train
// (chapter 6: `gap` in `back`, the mouth of Coil's gap in the stone leg; `wall` shares `back`'s names)
const ANCHORS = { bank: ['bank-left', 'bank-right', 'reeds'], mouth: ['rock', 'edge', 'sun', 'sun-edge'], under: ['mud', 'inside'],
  back: ['near', 'dragon', 'beside', 'back-left', 'back-right', 'gap'], paws: [], wall: ['gap', 'back-left', 'back-right', 'dragon'] };
const OPTS = { train: [true, false], eyes: ['none', 'open', 'blink', 'sprinkle'], drag: [true, false], drips: [true, false],
  pebble: ['in', 'out', 'paws'], branch: [true, false], prints: [true, false], pawsIn: [true, false, 'both'], hop: [false, true], stones: [true, false] };
const CH3_OPTS = ['pebble', 'branch', 'prints', 'pawsIn', 'hop'];

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text.
function checkXml(svg, label) {
  const stack = [];
  const re = /<[^>]*>|[^<]+/g;
  let m;
  while ((m = re.exec(svg))) {
    const tok = m[0];
    if (tok[0] !== '<') {
      assert.ok(!/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(tok), label + ': unescaped & in text');
      continue;
    }
    if (tok.startsWith('</')) { assert.equal(stack.pop(), tok.slice(2, -1).trim(), label + ': closing tag mismatch'); continue; }
    const mm = /^<([a-zA-Z][\w:.-]*)((?:\s+[\w:.-]+="[^"<]*")*)\s*(\/?)>$/.exec(tok);
    assert.ok(mm, label + ': malformed tag ' + tok.slice(0, 100));
    const names = mm[2].match(/[\w:.-]+(?==")/g) || [];
    assert.equal(new Set(names).size, names.length, label + ': duplicate attribute in ' + tok.slice(0, 80));
    if (!mm[3]) stack.push(mm[1]);
  }
  assert.equal(stack.length, 0, label + ': unclosed tags');
}

function checkRender(r, cast, label) {
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg, label);
  const vb = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(r.svg)[1].split(/\s+/).map(Number);
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10');
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': inside the world');
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h) => { if (h) assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ': head in the panel'); });
  (r.keep || []).forEach((k) => assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, label + ': keep inside the panel'));
  return vb;
}

const render = (cam, opts, cast, fx) => art.render({ set: 'bridge', cam, opts: opts || {}, cast: cast || [], fx: fx || ['day'] }, { look: LOOK });
// render ids differ per render (the renderer's and the character drawings' counters); nothing else may
const strip = (s) => s.replace(/\bpcs?[0-9a-z]+-/g, '');

// ---------------------------------------------------------------- vocabulary

test('bridge: the vocabulary lists the cameras, anchors and options of docs/build.md', () => {
  const v = art.vocab.sets.bridge;
  assert.ok(v, 'PC.art.vocab.sets.bridge exists');
  assert.deepEqual(v.cams, CAMS);
  for (const list of Object.values(ANCHORS)) for (const a of list) assert.ok(v.anchors.includes(a), 'anchor ' + a);
  for (const [k, vals] of Object.entries(OPTS)) {
    assert.ok(Array.isArray(v.opts[k]), 'option ' + k + ' lists its values');
    for (const x of vals) assert.ok(v.opts[k].includes(x), k + ': ' + x);
  }
  assert.ok(art.vocab.sets.bridge && art.vocab.fx.includes('day') && art.vocab.fx.includes('morning'));
});

test('bridge: the build.md row and the set agree (every name in the row exists)', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith('| `bridge`'));
  assert.ok(row, 'build.md has the bridge row');
  const cells = row.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.trim());
  const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  const v = art.vocab.sets.bridge;
  for (const c of ticks(cells[1])) assert.ok(v.cams.includes(c), 'camera ' + c);
  for (const a of ticks(cells[2])) assert.ok(v.anchors.includes(a), 'anchor ' + a);
  for (const o of ticks(cells[3]).map((t) => t.split(':')[0].trim())) assert.ok(Object.prototype.hasOwnProperty.call(v.opts, o), 'option ' + o);
});

test('bridge: defaults are day, no train, no eyes, drag marks and drips on; chapter 3\'s props off', () => {
  const info = art.sceneInfo('bridge');
  // (chapter 5's `mudPaws` is off too: 0; chapter 6's `stones` too: chapters 3 to 5's back has no leg)
  assert.deepEqual(info.defaults, { train: false, eyes: 'none', drag: true, drips: true, branch: false, prints: false, pawsIn: false, hop: false, mudPaws: 0, stones: false });
  const plain = render('back', {}).svg, none = render('back', { eyes: 'none', drag: true, drips: true, train: false }).svg;
  assert.equal(strip(plain).length, strip(none).length, 'an empty opts is the defaults');
});

// ---------------------------------------------------------------- cameras and anchors

test('bridge: each camera frames its own anchors, inside its box', () => {
  const info = art.sceneInfo('bridge');
  // (one spot stands below its panel on purpose: chapter 6's `dragon` in `wall`, where only Sprinkle's
  // head and neck come into the panel at its right edge, her feet far below it; its own test is below)
  const below = (cam, k) => cam === 'wall' && k === 'dragon';
  for (const cam of CAMS) {
    const box = info.cams[cam], comp = info.anchors[box.comp];
    assert.ok(comp, cam + ': has its anchors');
    for (const a of ANCHORS[cam]) {
      const at = comp[a];
      assert.ok(at, cam + ': anchor ' + a + ' is in its composition');
      assert.ok(at.x >= box.x && at.x <= box.x + box.w && at.y >= box.y && (below(cam, a) || at.y <= box.y + box.h), cam + ' ' + a + ' inside ' + JSON.stringify(box));
      assert.ok(at.h > 0, cam + ' ' + a + ': a cat height');
    }
    for (const [k, at] of Object.entries(comp)) assert.ok(at.x >= box.x && at.x <= box.x + box.w && at.y >= box.y && (below(cam, k) || at.y <= box.y + box.h), cam + ' ' + k + ' inside');
  }
});

test('bridge: every camera renders with a cat at each of its anchors, its head on the panel', () => {
  const who = ['player', 'tallyheart', 'clancat', 'riffle', 'otter'];
  for (const cam of CAMS) {
    ANCHORS[cam].forEach((at, i) => {
      for (const w of who) {
        const cast = [{ who: w, at, pose: 'sit', mood: 'worried', facing: i % 2 ? 'left' : 'right' }];
        const r = render(cam, {}, cast);
        checkRender(r, cast, cam + ' ' + at + ' ' + w);
        assert.ok(r.heads[0], cam + ': ' + w + ' at ' + at + ' is in sight');
      }
    });
    // all of its anchors at once
    const cast = ANCHORS[cam].map((at, i) => ({ who: ['tallyheart', 'player', 'riffle'][i % 3], at }));
    const r = render(cam, {}, cast);
    checkRender(r, cast, cam + ' (all anchors)');
    r.heads.forEach((h, i) => assert.ok(h, cam + ': ' + cast[i].at + ' in sight'));
  }
});

test('bridge: depth: nearer spots hold bigger cats', () => {
  const a = art.sceneInfo('bridge').anchors;
  assert.ok(a.main['bank-left'].h > a.main.reeds.h, 'the bank is nearer than the reeds');
  assert.ok(a.main.reeds.h > a.main.edge.h, 'the reeds are nearer than the dark\'s edge');
  assert.ok(a.mouth.sun.h > a.mouth.edge.h, 'in the sun, in front, is nearer than the shadow\'s edge');
  // sun-edge: out of the shadow, beside `sun`, at the depth a spot of its own there would have
  assert.ok(a.mouth['sun-edge'].x > a.mouth.edge.x + 200 && a.mouth['sun-edge'].x < a.mouth.sun.x, 'sun-edge: between the shadow and the sun spot');
  assert.ok(a.mouth['sun-edge'].h > a.mouth.edge.h && a.mouth['sun-edge'].h < a.mouth.sun.h);
  assert.ok(a.under.mud.h > a.under.inside.h, 'the mud is nearer than further in');
  assert.ok(a.back.near.h > a.under.mud.h, 'the cat looking in at the back is right in front of us');
  assert.ok(a.mouth.rock.elev && a.main.rock.elev, 'Riffle\'s rock is elevated');
});

test('bridge: a spot from another camera is out of sight', () => {
  const r = render('bank', {}, [{ who: 'player', at: 'near' }, { who: 'player', at: 'mud' }, { who: 'player', at: 'sun' }]);
  assert.deepEqual(r.heads, [null, null, null]);
  const b = render('back', {}, [{ who: 'player', at: 'bank-left' }]);
  assert.equal(b.heads[0], null);
  // Riffle's rock and the shadow's edge also show, small, in the wide view
  const w = render('bank', {}, [{ who: 'riffle', at: 'rock' }, { who: 'player', at: 'edge' }]);
  assert.ok(w.heads[0] && w.heads[1]);
});

// ---------------------------------------------------------------- options

test('bridge: every option value renders on every camera', () => {
  for (const cam of CAMS) {
    for (const [k, vals] of Object.entries(OPTS)) {
      for (const val of vals) {
        const cast = [{ who: 'player', at: ANCHORS[cam][0] }];
        checkRender(render(cam, { [k]: val }, cast), cast, cam + ' ' + k + '=' + val);
      }
    }
    const all = { train: true, eyes: 'blink', drag: false, drips: false };
    checkRender(render(cam, all, []), [], cam + ' all options');
    const ch3 = { train: true, eyes: 'open', pebble: 'out', branch: true, prints: true, pawsIn: true };
    for (const fx of [['day'], ['sunset'], ['dusk']]) checkRender(render(cam, ch3, [{ who: 'player', at: ANCHORS[cam][0] }], fx), [{}], cam + ' chapter 3 options, ' + fx);
  }
});

test('bridge: the train crosses on top (bank, mouth) and shakes grit down (under, back)', () => {
  for (const cam of DRAG_CAMS) {
    const off = strip(render(cam, { train: false }).svg), on = strip(render(cam, { train: true }).svg);
    assert.ok(on.length > off.length, cam + ': train: true draws more');
  }
});

test('bridge: the eyes: open and blink differ, none is only the dark; they keep the lettering off', () => {
  for (const cam of ['back', 'under']) {
    const none = render(cam, { eyes: 'none' }), open = render(cam, { eyes: 'open' }), blink = render(cam, { eyes: 'blink' });
    assert.ok(strip(open.svg).length > strip(none.svg).length, cam + ': open draws eyes');
    assert.notEqual(strip(open.svg), strip(blink.svg), cam + ': blink is not open');
    assert.equal(none.keep.length, 0, cam + ': nothing to keep clear without eyes');
    assert.ok(open.keep.length >= 1 && blink.keep.length >= 1, cam + ': the eyes are what the picture is about');
  }
  // the eyes are round with round pupils, never slits: no snake looked out of the dark
  const r = render('back', { eyes: 'open' }).svg;
  assert.ok((r.match(/<circle/g) || []).length >= 6, 'round eyes and pupils');
  // and they belong to the back of the dark only
  assert.equal(strip(render('bank', { eyes: 'open' }).svg).length, strip(render('bank', { eyes: 'none' }).svg).length, 'no eyes from the riverbank');
});

test('bridge: drag marks and drips can be turned off', () => {
  for (const cam of DRAG_CAMS) {
    const on = strip(render(cam, {}).svg).length;
    assert.ok(strip(render(cam, { drag: false }).svg).length < on, cam + ': drag: false draws less');
    assert.ok(strip(render(cam, { drips: false }).svg).length < on, cam + ': drips: false draws less');
  }
  // drips animate only through the shared CSS classes (prefers-reduced-motion safe), never SMIL
  assert.ok(/pcs-float/.test(render('under', {}).svg) && /pcs-ring/.test(render('under', {}).svg));
  for (const cam of CAMS) assert.ok(!/<animate/.test(render(cam, { train: true, eyes: 'open' }).svg), cam + ': no SMIL');
});

test('bridge: odd option values and times of day never throw', () => {
  for (const cam of CAMS) {
    checkRender(render(cam, { train: 'yes', eyes: 'wide', drag: 0, drips: null }, []), [], cam + ' odd values');
    for (const fx of ['morning', 'day', 'sunset', 'dusk', 'night']) checkRender(render(cam, {}, [{ who: 'player' }], [fx]), [{}], cam + ' ' + fx);
    checkRender(render(cam, {}, [], ['rain', 'lightning', 'glow', 'sparkle', 'motion']), [], cam + ' effects');
  }
});

test('bridge: the dark is never black, and the same scene draws the same picture', () => {
  for (const cam of ['under', 'back', 'paws']) for (const fx of ['day', 'sunset', 'dusk']) {
    const svg = render(cam, { prints: true, branch: true, pawsIn: true, pebble: 'in' }, [], [fx]).svg;
    assert.ok(!/fill="#0{3,6}"/i.test(svg), cam + ' ' + fx + ': no pure black fills');
  }
  for (const cam of CAMS) {
    const s = () => strip(render(cam, { train: true, eyes: 'open' }, [{ who: 'player', at: ANCHORS[cam][0] }]).svg);
    assert.equal(s(), s(), cam + ': deterministic');
  }
});

// ---------------------------------------------------------------- chapter 3 (docs/build.md, "Chapter 3 (v0.4)")

const renderL = (cam, opts, cast, fx, look) => art.render({ set: 'bridge', cam, opts: opts || {}, cast: cast || [], fx: fx || ['day'] }, { look: look || LOOK });
const count = (s, re) => (s.match(re) || []).length;
// the groups a set draws for one prop: <g data-art="print">…</g> (none of them nests another group)
const groupsOf = (svg, name) => svg.match(new RegExp('<g data-art="' + name + '"[^>]*>(.*?)</g>', 'g')) || [];
const numbers = (d) => (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
// a polygon path's points ("M x yL x y…Z")
const polyOf = (d) => d.replace(/Z/g, '').split(/(?=[ML])/).map((t) => t.slice(1).trim().split(/\s+/).map(Number));
// the paws' shapes, in drawing order: data-paw (a paw's silhouette pieces) and data-claw (one claw each)
function pawParts(svg) {
  const out = [], re = /<path d="([^"]+)"[^>]*?data-(paw|claw)="(\w+)"/g;
  let m;
  while ((m = re.exec(svg))) out.push({ kind: m[2], who: m[3], at: m.index, P: polyOf(m[1]) });
  return out;
}
function inside(P, x, y) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c;
  return c;
}
const tipOf = (claw) => claw.P[2];
const baseOf = (claw) => [(claw.P[0][0] + claw.P[4][0]) / 2, (claw.P[0][1] + claw.P[4][1]) / 2];

test('bridge (chapter 3): build.md names every new camera, anchor and option, and the set has them', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sec = md.slice(md.indexOf('## Chapter 3 (v0.4)'));
  const sets = sec.slice(sec.indexOf('**Sets**'), sec.indexOf('`pile` gains'));
  assert.ok(sets.length > 100, 'build.md has the chapter 3 sets paragraph');
  const v = art.vocab.sets.bridge;
  for (const k of CH3_OPTS) {
    assert.ok(sets.includes('`' + k), 'build.md names ' + k);
    assert.ok(Object.prototype.hasOwnProperty.call(v.opts, k), 'the set takes ' + k);
  }
  for (const val of ['in', 'out', 'paws']) assert.ok(sets.includes("'" + val + "'") && v.opts.pebble.includes(val), 'pebble: ' + val);
  for (const a of ['dragon', 'beside', 'back-left', 'back-right', 'near']) {
    assert.ok(sets.includes('`' + a + '`'), 'build.md names the anchor ' + a);
    assert.ok(art.sceneInfo('bridge').anchors.back[a], a + ' is in the back composition');
  }
  assert.ok(sets.includes('`paws`') && v.cams.includes('paws'), 'the paws camera');
});

test('bridge (chapter 3): chapters 1 and 2 keep their look: none of their scenes asks for a chapter 3 prop, and none draws one', () => {
  let n = 0;
  for (const id of ['ch01', 'ch02']) {
    for (const [fid, f] of Object.entries(PC.story[id].frames)) {
      const sc = f.scene;
      if (!sc || sc.set !== 'bridge') continue;
      n++;
      for (const k of CH3_OPTS) assert.ok(!(sc.opts && k in sc.opts), id + ' ' + fid + ': no ' + k);
      assert.notEqual(sc.cam, 'paws');
      const svg = art.render(sc, { look: LOOK }).svg;
      for (const name of ['print', 'pebble', 'branch', 'paws']) assert.equal(groupsOf(svg, name).length, 0, id + ' ' + fid + ': no ' + name);
      if (sc.cam === 'under' || sc.cam === 'back') assert.equal(count(svg, /mix-blend-mode:screen/g), 0, id + ' ' + fid + ': no evening light');
    }
  }
  assert.ok(n >= 20, 'chapter 2 visits the bridge: ' + n);
  // the chapter 3 options off draw exactly what leaving them out draws
  for (const cam of CAMS) assert.equal(strip(render(cam, {}).svg), strip(render(cam, { branch: false, prints: false, pawsIn: false }).svg), cam);
});

test('bridge (chapter 3): Sprinkle\'s prints, beside the drag marks in `under` and `back`: a trail, five claws each, as big as a heron\'s foot', () => {
  const info = art.sceneInfo('bridge').anchors;
  // a sitting cat's height where a print lies: the back is a cat-height camera (h = y - 560); under, from its two anchors
  const hAt = { back: (y) => y - 560, under: (y) => info.under.mud.h + (info.under.mud.h - info.under.inside.h) / (info.under.mud.y - info.under.inside.y) * (y - info.under.mud.y) };
  for (const cam of ['under', 'back']) {
    const svg = render(cam, { prints: true }).svg, prints = groupsOf(svg, 'print');
    assert.ok(prints.length >= 6, cam + ': a trail of prints (' + prints.length + ')');
    let biggest = 0;
    for (const pr of prints) {
      const ds = (pr.match(/ d="([^"]+)"/g) || []).map((x) => x.slice(4, -1));
      assert.equal(ds.length, 4, cam + ': the pad and toes, and the claws, each with its lit lip');
      assert.equal(count(ds[3], /Z/g), 5, cam + ': five claws a print');
      assert.equal(count(ds[1], /Z/g), 6, cam + ': a pad and five toes');
      const xy = numbers(ds[1]), xs = xy.filter((_, i) => i % 2 === 0), ys = xy.filter((_, i) => i % 2 === 1);
      const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), y = (Math.max(...ys) + Math.min(...ys)) / 2;
      biggest = Math.max(biggest, span / hAt[cam](y));
    }
    // a cat's own forepaw print is about an eighth of its sitting height; a heron's foot is far bigger
    assert.ok(biggest > 0.3, cam + ': big prints, ' + biggest.toFixed(2) + ' of a cat\'s height there');
    assert.equal(groupsOf(render(cam, {}).svg, 'print').length, 0, cam + ': off unless asked (chapter 2 keeps its look)');
  }
  for (const cam of ['bank', 'mouth', 'paws']) assert.equal(groupsOf(render(cam, { prints: true }).svg, 'print').length, 0, cam + ': no prints outside the dark');
});

test('bridge (chapter 3): chapter 3 and every later chapter draw Sprinkle\'s prints wherever the drag marks show in the dark, and use the props where they are drawn', () => {
  const later = Object.values(PC.story).filter((st) => st && st.number >= 3 && st.frames);
  assert.ok(later.length >= 1, 'chapter 3 is loaded');
  for (const st of later) for (const [fid, f] of Object.entries(st.frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'bridge') continue;
    const o = sc.opts || {}, at = st.id + ' ' + fid;
    if ((sc.cam === 'under' || sc.cam === 'back') && o.drag !== false) assert.equal(o.prints, true, at + ': prints: true, beside the drag marks (the set draws none by default, for chapter 2)');
    if (o.pebble != null) assert.ok(['mouth', 'under'].includes(sc.cam) && OPTS.pebble.includes(o.pebble), at + ': the pebble rolls in `mouth` or `under`');
    if (o.pawsIn) assert.equal(sc.cam, 'paws', at + ': pawsIn belongs to the paws camera');
    if (o.branch) assert.ok(['back', 'under'].includes(sc.cam), at + ': the branch lies across the back');
  }
});

test('bridge (chapter 3): Riffle\'s fifth pebble: in the dark, rolling out toward her, at her paws; plain round brown; kept clear of the lettering', () => {
  const A = art.sceneInfo('bridge').anchors.mouth['sun-edge'];
  const cast = (facing) => [{ who: 'riffle', at: 'rock' }, { who: 'player', at: 'sun-edge', facing }];
  const one = (mode, facing) => {
    const r = render('mouth', { pebble: mode, drag: false }, cast(facing || 'left'));
    assert.equal(groupsOf(r.svg, 'pebble').length, 1, mode + ': one pebble');
    assert.equal(r.keep.length, 1, mode + ': the pebble is what the panel is about');
    const k = r.keep[0];
    return { r, x: k.x + k.w / 2, y: k.y + k.h / 2 };
  };
  const paws = one('paws'), out = one('out'), inn = one('in');
  const front = (A.x - A.h * 0.36) / 16;
  assert.ok(Math.abs(paws.x - front) < 3, 'right at her paws, on the side she faces: ' + paws.x.toFixed(1) + ' vs ' + front.toFixed(1));
  assert.ok(Math.abs(paws.y - A.y / 10) < 4, 'on the ground at her feet');
  assert.ok(one('paws', 'right').x > A.x / 16, 'facing the sun, it lies on that side of her');
  assert.ok(inn.x > 11 && inn.x < 67 && inn.y < A.y / 10, 'in the dark under the deck');
  assert.ok(out.x > inn.x && out.x < paws.x, 'rolling out, between the dark and her paws');
  // plain, round and brown: none of Riffle's stone's white band, none of Sprinkle's grey-green
  const g = groupsOf(paws.r.svg, 'pebble')[0];
  assert.ok(/fill="#93704f"/i.test(g), 'brown');
  assert.ok(!/fill="#f{3}(f{3})?"/i.test(g), 'no white band');
  assert.equal(count(g, /<ellipse/g), 3, 'a round pebble: its shadow, itself and its shine');
  // under the bridge too; never from the bank, at the back or in the paws close-up; no cat: the camera's own spot
  for (const mode of OPTS.pebble) assert.equal(groupsOf(render('under', { pebble: mode }, [{ who: 'player', at: 'mud' }]).svg, 'pebble').length, 1, 'under ' + mode);
  for (const cam of ['bank', 'back', 'paws']) assert.equal(groupsOf(render(cam, { pebble: 'paws' }, [{ who: 'player', at: ANCHORS[cam][0] }]).svg, 'pebble').length, 0, cam + ': no pebble');
  const lone = render('mouth', { pebble: 'paws' }, []);
  assert.equal(groupsOf(lone.svg, 'pebble').length, 1);
  assert.equal(groupsOf(render('mouth', { pebble: 'lost' }).svg, 'pebble').length, 0, 'an odd value draws none');
  // the old tom's own spot { x, y } works as well as an anchor
  checkRender(render('mouth', { pebble: 'paws' }, [{ who: 'player', at: { x: 980, y: 950 } }]), [{}], 'a spot of its own');
});

test('bridge (chapter 3): the fallen branch lies across the back in front of Sprinkle\'s spot; from `under`, a small heap at the far back', () => {
  const a = art.sceneInfo('bridge').anchors.back;
  const svg = render('back', { branch: true }, [{ who: 'tallyheart', at: 'dragon' }, { who: 'snorer', at: 'beside' }]).svg;
  const b = svg.indexOf('data-art="branch"');
  assert.equal(groupsOf(svg, 'branch').length, 1, 'one branch');
  assert.ok(svg.indexOf('translate(' + a.dragon.x + ' ' + a.dragon.y + ')') < b, 'drawn over whoever is at dragon (she can peek over it)');
  assert.ok(svg.indexOf('translate(' + a.beside.x + ' ' + a.beside.y + ')') > b, 'and under whoever is drawn after');
  // nobody at dragon: it is still there
  assert.equal(groupsOf(render('back', { branch: true }).svg, 'branch').length, 1);
  // under: small, at the far back where the bank meets the deck
  const u = groupsOf(render('under', { branch: true }).svg, 'branch');
  assert.equal(u.length, 1);
  // its absolute outlines (sticks, forks, the limb, the twigs; not the leaves' relative curves)
  const xy = numbers((u[0].match(/ d="([^"]+)"/g) || []).map((x) => x.slice(4, -1)).filter((d) => !/[a-z]/.test(d)).join(' '));
  const xs = xy.filter((_, i) => i % 2 === 0), ys = xy.filter((_, i) => i % 2 === 1);
  assert.ok(Math.min(...xs) > 950 && Math.max(...xs) < 1450 && Math.max(...ys) < 600, 'a heap at the far back');
  for (const cam of ['bank', 'mouth', 'paws']) assert.equal(groupsOf(render(cam, { branch: true }).svg, 'branch').length, 0, cam + ': no branch');
  assert.equal(groupsOf(render('back', {}).svg, 'branch').length, 0, 'off by default');
  // in `back`, a heap: three limbs massed from the floor up to her shoulders, x 600 to 1500, and none of
  // its forks, twigs or leaves rises into her face as she peers over it (790–975 × 540–722)
  const heap = groupsOf(svg, 'branch')[0];
  // three limbs, each drawn like the one small heap seen from `under`
  const joins = (x) => (x.match(/stroke-linejoin="round"/g) || []).length;
  assert.equal(joins(heap) / joins(u[0]), 3, 'three limbs');
  const hxy = numbers((heap.match(/ d="([^"]+)"/g) || []).map((x) => x.slice(4, -1)).filter((d) => !/[a-z]/.test(d)).join(' '));
  for (let i = 0; i + 1 < hxy.length; i += 2) assert.ok(!(hxy[i] > 796 && hxy[i] < 969 && hxy[i + 1] > 546 && hxy[i + 1] < 716), 'clear of her face: ' + hxy[i] + ',' + hxy[i + 1]);
  const hys = hxy.filter((_, i) => i % 2 === 1);
  assert.ok(Math.min(...hys) < 700 && Math.max(...hys) > 860, 'from the floor up past her chin');
});

test('bridge (chapter 3): her eyes in the dark, at her size, where her face is when she sits up at `dragon`', { skip: art.vocab.cast.includes('sprinkle') ? false : 'no sprinkle in cats.js yet' }, () => {
  const eyes = render('back', { eyes: 'sprinkle' });
  const her = art.render({ set: 'bridge', cam: 'back', opts: {}, cast: [{ who: 'sprinkle', pose: 'unfold', mood: 'scared', at: 'dragon', facing: 'left' }], fx: ['day'] }, { look: LOOK });
  const h = her.heads[0], hx = h.x * 16, hy = h.y * 10;
  const irises = [...eyes.svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="url\(#[^)]+\)"/g)].map((m) => m.slice(1).map(Number)).filter((c) => c[2] > 15);
  assert.equal(irises.length, 2, 'two eyes');
  const mx = (irises[0][0] + irises[1][0]) / 2, gap = Math.abs(irises[0][0] - irises[1][0]);
  assert.ok(Math.abs(mx - hx) < 15 && Math.abs(irises[0][1] - hy) < 20, 'on her face: ' + [mx, irises[0][1]] + ' vs ' + [hx, hy]);
  assert.ok(gap > 55 && gap < 90 && irises[0][2] < 32, 'her spacing and size: gap ' + gap + ', r ' + irises[0][2]);
  assert.ok(eyes.keep.length >= 1, 'the lettering keeps off them');
  // chapter 2's eyes are as they were
  assert.ok(render('back', { eyes: 'open' }).svg.includes('r="44"'), 'chapter 2: the big pair');
});

test('bridge (chapter 3): the hop: every paw’s five claws lit gold and 5, 10, 15 lettered beyond them, on no paw, in pile order', () => {
  for (const look of [LOOK, { fur: 'black', marking: 'none' }, { fur: 'ginger' }]) {
    const r = art.render({ set: 'bridge', cam: 'paws', opts: { pawsIn: true, hop: true }, cast: [], fx: ['day'] }, { look });
    const nums = [...r.svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*data-hop="(\d+)"[^>]*>(\d+)</g)].map((m) => [+m[1], +m[2], m[3], m[4]]);
    assert.deepEqual(nums.map((x) => x[3]), ['5', '10', '15'], 'in pile order');
    assert.equal((r.svg.match(/data-claw="[a-z]+"[^>]*/g) || []).length, 15);
    assert.equal((r.svg.match(/fill="#FFE07A"[^>]*data-claw/g) || []).length, 15, 'all fifteen claws gold');
    // each number by its own paw's claws: nearer them than any other paw's
    const claws = (who) => [...r.svg.matchAll(new RegExp('<path d="([^"]+)" fill="#FFE07A"[^>]*data-claw="' + who + '"', 'g'))].map((m) => numbers(m[1]));
    ['player', 'sprinkle', 'riffle'].forEach((who, i) => {
      const [x, y] = nums[i], d = (w) => Math.min(...claws(w).map((c) => Math.hypot(c[0] - x, c[1] - y)));
      assert.ok(d(who) < 220, who + ': ' + nums[i][3] + ' beside its claws (' + Math.round(d(who)) + ')');
      ['player', 'sprinkle', 'riffle'].filter((o) => o !== who).forEach((o) => assert.ok(d(who) < d(o), who + ': nearer its own claws than ' + o + '’s'));
    });
    assert.ok(r.keep.length >= 4, 'the pile and the three numbers keep the lettering off');
  }
  const plain = art.render({ set: 'bridge', cam: 'paws', opts: { pawsIn: true }, cast: [], fx: ['day'] });
  assert.ok(!/data-hop/.test(plain.svg) && !plain.svg.includes('#FFE07A'), 'off by default');
});

test('bridge (chapter 3): the back of the dark holds Sprinkle and three more: one floor (h = y - 560), nearest in front', () => {
  const a = art.sceneInfo('bridge').anchors.back;
  for (const k of ANCHORS.back) assert.ok(Math.abs(a[k].h - (a[k].y - 560)) <= 1, k + ': on the one floor');
  assert.ok(Math.abs(a.dragon.x - 1040) <= 60, 'Sprinkle sits in the nook\'s mouth, where her eyes shone in chapter 2');
  assert.equal(a.dragon.face, 'left', 'facing the way in');
  assert.ok(Math.abs(a.beside.x - a.dragon.x) < 200 && a.beside.h > a.dragon.h, 'beside: against her flank, a step nearer, so drawn over her');
  assert.ok(a['back-left'].x < a.dragon.x - 300 && a['back-right'].x > a.beside.x + 200, 'Riffle and Tallyheart either side, clear of her and the cat beside her');
  assert.ok(a.near.h > a['back-left'].h && a.near.h > a['back-right'].h, 'the cat looking in is nearest of all');
  for (const k of ANCHORS.back) assert.ok(!a[k].elev, k + ' on the ground');
});

const hasSprinkle = art.vocab.cast.includes('sprinkle');
test('bridge (chapter 3): Sprinkle at `dragon`, her head well above Tallyheart\'s; a cat at `beside` pressed against her side', { skip: hasSprinkle ? false : 'no sprinkle in cats.js yet' }, () => {
  const cast = [{ who: 'sprinkle', pose: 'sit', mood: 'shy', at: 'dragon' }, { who: 'player', at: 'beside' }, { who: 'riffle', at: 'back-left' }, { who: 'tallyheart', at: 'back-right' }];
  const r = render('back', {}, cast);
  checkRender(r, cast, 'the four at the back');
  r.heads.forEach((h, i) => assert.ok(h, cast[i].at + ' in sight'));
  assert.ok(r.heads[0].y < r.heads[3].y - 8, 'her head well above Tallyheart\'s: ' + r.heads[0].y + ' vs ' + r.heads[3].y);
  const a = art.sceneInfo('bridge').anchors.back, d = art.character('sprinkle', { pose: 'sit', facing: 'left' }), R = art.character('clancat', { pose: 'sit', variant: 1 }).h;
  const s = a.dragon.h / R, b = d.bounds || { x0: 0, x1: d.w }, x0 = a.dragon.x + (b.x0 - d.w / 2) * s, x1 = a.dragon.x + (b.x1 - d.w / 2) * s;
  assert.ok(a.beside.x > Math.min(x0, x1) + 40 && a.beside.x < Math.max(x0, x1) - 40, 'the cat beside her sits against her body: ' + a.beside.x + ' in ' + Math.round(x0) + '..' + Math.round(x1));
  // and Tallyheart at back-right stands clear of that cat
  assert.ok(r.heads[3].x - r.heads[1].x > 12, 'Tallyheart apart from the cat beside Sprinkle');
});

test('bridge (chapter 3): the promise: three forepaws piled, fifteen claws, five each, not one covered', () => {
  const looks = art.vocab.looks.fur.map((fur, i) => ({ fur, marking: art.vocab.looks.marking[i % art.vocab.looks.marking.length], eyes: 'green', sex: i % 2 ? 'tom' : 'she' }));
  for (const look of looks) {
    const r = renderL('paws', { pawsIn: true }, [], ['day'], look), parts = pawParts(r.svg), claws = parts.filter((p) => p.kind === 'claw');
    checkRender(r, [], 'paws ' + look.fur);
    for (const who of ['player', 'sprinkle', 'riffle']) assert.equal(claws.filter((c) => c.who === who).length, 5, look.fur + ': five claws on ' + who + '\'s forepaw');
    assert.equal(claws.length, 15);
    // piled in the text's order: hers, then Sprinkle's set on it, then Riffle's on top
    const firstOf = (who) => parts.find((p) => p.who === who).at;
    assert.ok(firstOf('player') < firstOf('sprinkle') && firstOf('sprinkle') < firstOf('riffle'), 'hers at the bottom, Riffle\'s on top');
    for (const c of claws) {
      const later = parts.filter((p) => p.at > c.at && p.who !== c.who);
      for (const pt of [tipOf(c), baseOf(c)]) assert.ok(!later.some((p) => inside(p.P, pt[0], pt[1])), look.fur + ': ' + c.who + '\'s claw at ' + pt.map(Math.round) + ' shows');
    }
    // each claw apart from the others, so they can be counted, and all of them where the lettering keeps off
    for (let i = 0; i < claws.length; i++) for (let j = i + 1; j < claws.length; j++) assert.ok(Math.hypot(tipOf(claws[i])[0] - tipOf(claws[j])[0], tipOf(claws[i])[1] - tipOf(claws[j])[1]) > 25, 'claw tips apart');
    const k = r.keep[0];
    for (const c of claws) assert.ok(tipOf(c)[0] / 16 > k.x && tipOf(c)[0] / 16 < k.x + k.w && tipOf(c)[1] / 10 > k.y && tipOf(c)[1] / 10 < k.y + k.h, 'claws inside keep');
  }
  // only with pawsIn, only on the paws camera; and no face in it (the close-up is all paws)
  assert.equal(pawParts(render('paws', {}).svg).length, 0, 'pawsIn off: the floor only');
  for (const cam of DRAG_CAMS) assert.equal(pawParts(render(cam, { pawsIn: true }).svg).length, 0, cam + ': no paws pile');
  const faces = render('paws', { pawsIn: true }, [{ who: 'sprinkle', at: 'dragon' }, { who: 'player' }, { who: 'riffle', at: 'near' }]);
  assert.deepEqual(faces.heads, [null, null, null], 'balloons in the close-up come from off the panel');
});

test('bridge (chapter 3): her forepaw wears her look; Sprinkle\'s is mist grey with long pale claws; Riffle\'s is his brown, webbed', () => {
  const src = fs.readFileSync(path.join(ROOT, 'app/art/cats.js'), 'utf8');
  const FUR = Function('return ' + /var FUR = (\{[\s\S]*?\n  \});/.exec(src)[1])();
  const rif = /riffle: \{[^\n]*\n[^\n]*pal: \{ base: '(#[0-9a-f]{6})', line: '(#[0-9a-f]{6})'/.exec(src);
  assert.ok(rif, 'cats.js has Riffle\'s colours');
  const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.3 * (v >> 16) + 0.59 * ((v >> 8) & 255) + 0.11 * (v & 255); };
  for (const fur of art.vocab.looks.fur) {
    for (const marking of ['none', 'white-paws']) {
      const svg = renderL('paws', { pawsIn: true }, [], ['day'], { fur, marking }).svg, parts = pawParts(svg);
      const mine = svg.slice(svg.indexOf('data-art="paws"'), parts.find((p) => p.who === 'sprinkle').at);
      assert.ok(mine.includes('fill="' + FUR[fur].base + '"'), fur + ': her arm in her coat');
      assert.ok(mine.includes('stroke="' + FUR[fur].line + '"'), fur + ': outlined in her coat\'s line');
      if (FUR[fur].stripe && FUR[fur].pattern === 'tabby') assert.ok(mine.includes('fill="' + FUR[fur].stripe + '"'), fur + ': tabby bands');
      if (FUR[fur].patches) for (const pc of FUR[fur].patches) assert.ok(mine.includes('fill="' + pc + '"'), fur + ': patches');
      const white = /fill="#(ffffff|fcf9f3)"/i.test(mine.slice(mine.indexOf('stroke-linejoin', 0)));
      if (marking === 'white-paws') assert.ok(white, fur + ': a white paw');
      else if (fur !== 'white' && fur !== 'calico') assert.ok(!/fill="#(ffffff|fcf9f3)"/i.test(mine), fur + ': no white paw unless she has white paws');
    }
  }
  const svg = renderL('paws', { pawsIn: true }).svg, parts = pawParts(svg);
  const riffle = svg.slice(parts.find((p) => p.who === 'riffle').at);
  assert.ok(riffle.includes('fill="' + rif[1] + '"') && riffle.includes('stroke="' + rif[2] + '"'), 'Riffle\'s own brown, from cats.js');
  // webbed: skin between his toes, a shade apart from his fur
  const rifFills = new Set((riffle.match(/fill="#[0-9a-f]{6}"/gi) || []).map((x) => x.slice(6, -1).toLowerCase()));
  assert.ok(rifFills.size >= 3, 'fur, the webs between his toes, and his claws');
  // Sprinkle: grey (no colour to speak of), her claws long and pale
  const dz = parts.filter((p) => p.who === 'sprinkle'), dzSvg = svg.slice(dz[0].at, parts.find((p) => p.who === 'riffle').at);
  const body = /<path d="[^"]+" fill="(#[0-9a-f]{6})"(?! stroke)/i.exec(dzSvg.slice(dzSvg.indexOf('data-paw="sprinkle"')))[1];
  const v = parseInt(body.slice(1), 16), rgb = [v >> 16, (v >> 8) & 255, v & 255];
  assert.ok(Math.max(...rgb) - Math.min(...rgb) < 30, 'mist grey: ' + body);
  const clawFill = /fill="(#[0-9a-f]{6})"[^>]*data-claw="sprinkle"/i.exec(svg)[1];
  assert.ok(lum(clawFill) > lum(body) + 30, 'pale claws on a grey paw');
  const len = (c) => Math.hypot(tipOf(c)[0] - baseOf(c)[0], tipOf(c)[1] - baseOf(c)[1]);
  const mean = (who) => { const cs = parts.filter((p) => p.kind === 'claw' && p.who === who); return cs.reduce((s, c) => s + len(c), 0) / cs.length; };
  assert.ok(mean('sprinkle') > mean('player') * 1.4, 'Sprinkle\'s claws long, easy to count');
});

test('bridge (chapter 3): evening under the bridge: gold at sunset, a softer rose at dusk; by day, nothing changes', () => {
  for (const cam of ['under', 'back']) {
    const day = render(cam, {}, [], ['day']).svg, gold = render(cam, {}, [], ['sunset']).svg, dusk = render(cam, {}, [], ['dusk']).svg;
    assert.equal(count(day, /mix-blend-mode:screen/g), 0, cam + ': no evening light by day (chapter 2)');
    assert.ok(count(gold, /mix-blend-mode:screen/g) >= 2, cam + ': the low sun reaches in at sunset');
    assert.ok(count(dusk, /mix-blend-mode:screen/g) >= 2, cam + ': a rose light by the way in at dusk');
    assert.notEqual(strip(gold), strip(dusk), cam + ': sunset and dusk differ');
  }
  // the paws close-up's pool of light takes the evening's colour too
  assert.notEqual(strip(render('paws', { pawsIn: true }, [], ['day']).svg), strip(render('paws', { pawsIn: true }, [], ['sunset']).svg));
});

// ================================================================ chapter 4 (docs/build.md, "Chapter 4 (v0.4)"; the
// chapter text's Build notes): pawsIn: 'both', the thirty-claw promise

const crypto = require('crypto');
const FRIENDS = ['sprinkle', 'player', 'riffle'];   // the pile's order: Sprinkle holds out both forepaws, hers go on top, then Riffle's
const both = (opts, fx, look) => renderL('paws', Object.assign({ pawsIn: 'both' }, opts || {}), [], fx || ['day'], look);
const pawsGroup = (svg) => { const a = svg.indexOf('<g data-art="paws"'), b = svg.indexOf('</g><rect', a); return svg.slice(a, b); };
// the paws of a pile, in drawing order: each paw's outline pieces come in one run, before its claws
function pawsOf(svg) {
  const out = [];
  for (const p of pawParts(svg)) {
    if (p.kind === 'paw' && (!out.length || out[out.length - 1].claws.length)) out.push({ who: p.who, shapes: [], claws: [] });
    out[out.length - 1][p.kind === 'paw' ? 'shapes' : 'claws'].push(p);
  }
  return out;
}
function distTo(P, x, y) {
  if (inside(P, x, y)) return 0;
  let d = Infinity;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[j], b = P[i], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    d = Math.min(d, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy));
  }
  return d;
}

test('bridge (chapter 4): build.md names pawsIn: \'both\', and the set takes it, on the paws camera only', () => {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sec = md.slice(md.indexOf('## Chapter 4 (v0.4)')).replace(/\s+/g, ' ');
  assert.ok(sec.includes("`pawsIn: 'both'`"), 'build.md names pawsIn: \'both\'');
  assert.deepEqual(art.vocab.sets.bridge.opts.pawsIn, [true, false, 'both']);
  assert.equal(art.sceneInfo('bridge').defaults.pawsIn, false, 'off by default');
  for (const cam of DRAG_CAMS) {
    assert.equal(pawParts(render(cam, { pawsIn: 'both', hop: true }).svg).length, 0, cam + ': no paws pile');
    assert.equal(strip(render(cam, { pawsIn: 'both', hop: 2 }).svg), strip(render(cam, {}).svg), cam + ': nothing of it');
  }
  // every light the chapter might ask for
  for (const fx of [['day'], ['sunset'], ['dusk'], ['night'], ['morning']]) for (const hop of [false, true, 0, 1, 2, 3]) checkRender(both({ hop }, fx), [], 'both ' + fx + ' hop ' + hop);
  assert.ok(!/fill="#0{3,6}"/i.test(both({ hop: true }).svg), 'the dark is never black');
  assert.equal(strip(both({ hop: 2 }).svg), strip(both({ hop: 2 }).svg), 'deterministic');
});

test('bridge (chapter 4): chapter 3\'s promise is as it was: three forepaws, drawn exactly as before', () => {
  // sha1 of the pile's own markup (ids stripped), recorded from the chapter 3 build
  const GOLD = { calico: '5693c15789e24f4d', 'calico:hop': '041956767a8b516a', black: '26edc826571ac868', 'black:hop': 'e471644293cd07b1', ginger: '1e92eadbd1866309', 'ginger:hop': '29ace89a797023f1' };
  const LOOKS = { calico: LOOK, black: { fur: 'black', marking: 'none' }, ginger: { fur: 'ginger' } };
  for (const [name, look] of Object.entries(LOOKS)) for (const hop of [false, true]) {
    const svg = strip(renderL('paws', { pawsIn: true, hop }, [], ['day'], look).svg);
    assert.equal(crypto.createHash('sha1').update(pawsGroup(svg)).digest('hex').slice(0, 16), GOLD[name + (hop ? ':hop' : '')], name + (hop ? ', hopped' : '') + ': as chapter 3 drew it');
  }
  const three = pawsOf(render('paws', { pawsIn: true }).svg);
  assert.deepEqual(three.map((p) => p.who), ['player', 'sprinkle', 'riffle'], 'chapter 3: hers at the bottom, then Sprinkle\'s, then Riffle\'s');
  assert.ok(!/data-lit/.test(render('paws', { pawsIn: true, hop: true }).svg), 'chapter 3\'s pile carries no data-lit');
  // every chapter 3 frame at the paws camera asks for the three (pawsIn: true)
  for (const f of Object.values(PC.story.ch03.frames)) if (f.scene && f.scene.set === 'bridge' && f.scene.cam === 'paws') assert.equal(f.scene.opts.pawsIn, true);
});

test('bridge (chapter 4): the thirty-claw promise: six forepaws piled, a friend\'s pair to a layer, thirty claws, ten each, not one covered', () => {
  const looks = art.vocab.looks.fur.map((fur, i) => ({ fur, marking: art.vocab.looks.marking[i % art.vocab.looks.marking.length], eyes: 'green', sex: i % 2 ? 'tom' : 'she' }));
  for (const look of looks) {
    const r = both({}, ['day'], look), paws = pawsOf(r.svg), parts = pawParts(r.svg), claws = parts.filter((p) => p.kind === 'claw');
    checkRender(r, [], 'both ' + look.fur);
    assert.equal(paws.length, 6, look.fur + ': six forepaws');
    // piled in the text's order, a pair at a time
    assert.deepEqual(paws.map((p) => p.who), ['sprinkle', 'sprinkle', 'player', 'player', 'riffle', 'riffle'], look.fur + ': Sprinkle\'s two, hers on top, then Riffle\'s');
    paws.forEach((p, i) => assert.equal(p.claws.length, 5, look.fur + ': five claws on paw ' + i));
    assert.equal(claws.length, 30);
    for (const who of FRIENDS) assert.equal(claws.filter((c) => c.who === who).length, 10, look.fur + ': ten claws for ' + who);
    // not one covered: nothing drawn after a claw (another paw's arm, palm or toes, or a later claw) lies on its tip or its base
    for (const c of claws) {
      const later = parts.filter((p) => p.at > c.at && (p.kind === 'paw' || p.who !== c.who));
      for (const pt of [tipOf(c), baseOf(c), [(tipOf(c)[0] + baseOf(c)[0]) / 2, (tipOf(c)[1] + baseOf(c)[1]) / 2]]) {
        assert.ok(!later.some((p) => inside(p.P, pt[0], pt[1])), look.fur + ': ' + c.who + '\'s claw at ' + pt.map(Math.round) + ' shows');
        // and with room round it, so it can be counted
        const near = Math.min(...later.filter((p) => p.kind === 'paw').map((p) => distTo(p.P, pt[0], pt[1])).concat([Infinity]));
        assert.ok(near > 12, look.fur + ': ' + c.who + '\'s claw at ' + pt.map(Math.round) + ' has room (' + near.toFixed(0) + ')');
      }
    }
    // each claw apart from every other, all of them in the panel and where the lettering keeps off
    for (let i = 0; i < claws.length; i++) for (let j = i + 1; j < claws.length; j++) assert.ok(Math.hypot(tipOf(claws[i])[0] - tipOf(claws[j])[0], tipOf(claws[i])[1] - tipOf(claws[j])[1]) > 40, look.fur + ': claw tips apart');
    const k = r.keep[0];
    for (const c of claws) for (const q of c.P) {
      assert.ok(q[0] > 40 && q[0] < 1560 && q[1] > 40 && q[1] < 960, look.fur + ': a claw whole in the panel: ' + q.map(Math.round));
      assert.ok(q[0] / 16 > k.x && q[0] / 16 < k.x + k.w && q[1] / 10 > k.y && q[1] / 10 < k.y + k.h, look.fur + ': claws inside keep');
    }
    assert.equal(r.keep.length, 1, 'the pile, and nothing else, without the hop');
  }
  // only with pawsIn: 'both'; no face in it
  const faces = both({}, ['day']);
  assert.deepEqual(art.render({ set: 'bridge', cam: 'paws', opts: { pawsIn: 'both' }, cast: [{ who: 'sprinkle', at: 'dragon' }, { who: 'player' }, { who: 'riffle', at: 'near' }], fx: ['day'] }, { look: LOOK }).heads, [null, null, null], 'balloons in the close-up come from off the panel');
  assert.ok(/<g data-art="paws" data-lit="0">/.test(faces.svg), 'the pile is the Tap\'s target, and says nobody is lit');
});

test('bridge (chapter 4): fanned so all thirty show: three rows of ten, top to bottom in pile order, each friend\'s two paws side by side', () => {
  const paws = pawsOf(both().svg);
  const mid = (cl) => [cl.reduce((s, c) => s + tipOf(c)[0], 0) / cl.length, cl.reduce((s, c) => s + tipOf(c)[1], 0) / cl.length];
  const rows = FRIENDS.map((who) => paws.filter((p) => p.who === who));
  rows.forEach((pair, i) => {
    assert.equal(pair.length, 2);
    const a = mid(pair[0].claws), b = mid(pair[1].claws);
    // side by side: level with each other, a paw's width and more apart
    assert.ok(Math.abs(a[1] - b[1]) < 30, FRIENDS[i] + ': her two paws level: ' + [a[1], b[1]].map(Math.round));
    assert.ok(Math.abs(a[0] - b[0]) > 220, FRIENDS[i] + ': a pair, side by side');
    // a row: all ten claws of the pair within a band, the next friend's row below it
    const ys = pair[0].claws.concat(pair[1].claws).map((c) => tipOf(c)[1]);
    if (i) {
      const prev = rows[i - 1][0].claws.concat(rows[i - 1][1].claws).map((c) => tipOf(c)[1]);
      assert.ok(Math.min(...ys.slice().sort((p, q) => p - q).slice(0, 8)) > Math.min(...prev) + 60, FRIENDS[i] + ': her row lies below ' + FRIENDS[i - 1] + '\'s');
      assert.ok(ys.reduce((s, y) => s + y, 0) / 10 > prev.reduce((s, y) => s + y, 0) / 10 + 90, FRIENDS[i] + ': a row of its own');
    }
  });
  // every arm reaches in from the bottom edge (her own forepaws as she sees them): each paw's toes point up the panel
  for (const p of paws) { const m = mid(p.claws), palm = p.shapes[p.shapes.length - 2].P, py = palm.reduce((s, q) => s + q[1], 0) / palm.length; assert.ok(m[1] < py - 40, p.who + ': toes up, arm from the bottom'); }
  // each upper paw rests on the pair below: its palm's middle lies on a paw of the friend beneath
  const middle = (P) => [P.reduce((s, q) => s + q[0], 0) / P.length, P.reduce((s, q) => s + q[1], 0) / P.length];
  [2, 3, 4, 5].forEach((i) => {
    const palm = paws[i].shapes.reduce((best, sh) => (sh.P.length > best.P.length ? sh : best), paws[i].shapes[0]), c = middle(palm.P);
    const below = paws.slice(i < 4 ? 0 : 2, i < 4 ? 2 : 4);
    assert.ok(below.some((p) => p.shapes.some((sh) => inside(sh.P, c[0], c[1]))), paws[i].who + ' paw ' + i + ' rests on the pair below: ' + c.map(Math.round));
  });
  // Sprinkle's are the biggest, with the longest claws; hers next; Riffle's webbed and smallest
  const len = (c) => Math.hypot(tipOf(c)[0] - baseOf(c)[0], tipOf(c)[1] - baseOf(c)[1]);
  const mean = (who) => { const cs = paws.filter((p) => p.who === who).flatMap((p) => p.claws); return cs.reduce((s, c) => s + len(c), 0) / cs.length; };
  assert.ok(mean('sprinkle') > mean('player') * 1.4 && mean('sprinkle') > mean('riffle') * 1.4, 'Sprinkle\'s claws long, easy to count');
});

test('bridge (chapter 4): both of her forepaws wear her look; Sprinkle\'s are mist grey, Riffle\'s his webbed brown', () => {
  const src = fs.readFileSync(path.join(ROOT, 'app/art/cats.js'), 'utf8');
  const FUR = Function('return ' + /var FUR = (\{[\s\S]*?\n  \});/.exec(src)[1])();
  for (const fur of art.vocab.looks.fur) for (const marking of ['none', 'white-paws']) {
    const svg = both({}, ['day'], { fur, marking }).svg, parts = pawParts(svg);
    const first = (who) => parts.find((p) => p.who === who).at;
    const mine = svg.slice(first('player'), first('riffle'));
    // two arms in her coat, outlined in her coat's line
    assert.ok(mine.split('fill="' + FUR[fur].base + '"').length - 1 >= 2, fur + ': both arms in her coat');
    assert.ok(mine.includes('stroke="' + FUR[fur].line + '"'), fur + ': outlined in her coat\'s line');
    if (FUR[fur].stripe && FUR[fur].pattern === 'tabby') assert.ok(mine.split('fill="' + FUR[fur].stripe + '"').length - 1 >= 2, fur + ': tabby bands on both');
    if (FUR[fur].patches) for (const pc of FUR[fur].patches) assert.ok(mine.includes('fill="' + pc + '"'), fur + ': patches');
    const white = (mine.match(/fill="#(ffffff|fcf9f3)"/gi) || []).length;
    if (marking === 'white-paws') assert.ok(white >= 10, fur + ': two white paws');
    else if (fur !== 'white' && fur !== 'calico') assert.equal(white, 0, fur + ': no white paws unless she has them');
  }
  const svg = both().svg, parts = pawParts(svg), dz = svg.slice(parts.find((p) => p.who === 'sprinkle').at, parts.find((p) => p.who === 'player').at);
  const body = /<path d="[^"]+" fill="(#[0-9a-f]{6})"(?! stroke)/i.exec(dz.slice(dz.indexOf('data-paw="sprinkle"')))[1];
  const v = parseInt(body.slice(1), 16), rgb = [v >> 16, (v >> 8) & 255, v & 255];
  assert.ok(Math.max(...rgb) - Math.min(...rgb) < 30, 'Sprinkle: mist grey: ' + body);
  const rif = /riffle: \{[^\n]*\n[^\n]*pal: \{ base: '(#[0-9a-f]{6})', line: '(#[0-9a-f]{6})'/.exec(src);
  const riffle = svg.slice(parts.find((p) => p.who === 'riffle').at);
  assert.ok(riffle.split('fill="' + rif[1] + '"').length - 1 >= 2 && riffle.includes('stroke="' + rif[2] + '"'), 'Riffle\'s own brown, on both');
});

test('bridge (chapter 4): the hop lights a friend\'s pair at a time: ten claws gold and 10, 20, 30 lettered beside their rows, on no paw', () => {
  const gold = (svg, who) => (svg.match(new RegExp('fill="#FFE07A"[^>]*data-claw="' + (who || '[a-z]+') + '"', 'g')) || []).length;
  const numsOf = (svg) => [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*font-size="(\d+)"[^>]*data-hop="(\d+)"[^>]*>(\d+)</g)].map((m) => ({ x: +m[1], y: +m[2] - +m[3] * 0.36, fs: +m[3], n: +m[4], text: m[5] }));
  for (const look of [LOOK, { fur: 'black', marking: 'none' }, { fur: 'white', marking: 'white-paws' }]) {
    for (let n = 0; n <= 3; n++) {
      const r = both({ hop: n }, ['day'], look), nums = numsOf(r.svg);
      assert.equal(gold(r.svg), n * 10, 'hop ' + n + ': ' + n * 10 + ' claws lit');
      FRIENDS.forEach((who, i) => assert.equal(gold(r.svg, who), i < n ? 10 : 0, 'hop ' + n + ': ' + who + (i < n ? ' lit' : ' not yet')));
      assert.deepEqual(nums.map((q) => q.text), ['10', '20', '30'].slice(0, n), 'hop ' + n + ': the running totals so far, by tens');
      nums.forEach((q) => assert.equal(String(q.n), q.text));
      assert.ok(new RegExp('<g data-art="paws" data-lit="' + n + '">').test(r.svg), 'hop ' + n + ': the pile says how far the hop has got');
      assert.equal(r.keep.length, 1 + n, 'hop ' + n + ': the pile and each number keep the lettering off');
      // the same six paws in the same places: lighting moves nothing
      assert.deepEqual(pawParts(r.svg).map((p) => p.P), pawParts(both({}, ['day'], look).svg).map((p) => p.P), 'hop ' + n + ': the pile holds still');
    }
    // hop: true is every friend; `lit` counts as `hop` does (the Tap may pass either); out of range is clamped
    assert.equal(strip(both({ hop: true }, ['day'], look).svg), strip(both({ hop: 3 }, ['day'], look).svg));
    for (let n = 0; n <= 3; n++) assert.equal(strip(both({ lit: n }, ['day'], look).svg), strip(both({ hop: n }, ['day'], look).svg), 'lit ' + n + ' is hop ' + n);
    assert.equal(strip(both({ hop: 9 }, ['day'], look).svg), strip(both({ hop: 3 }, ['day'], look).svg));
    assert.equal(strip(both({ hop: -2 }, ['day'], look).svg), strip(both({}, ['day'], look).svg));
    assert.equal(strip(both({ hop: 'all' }, ['day'], look).svg), strip(both({}, ['day'], look).svg), 'an odd value lights nobody');
    assert.equal(strip(both({ hop: false, lit: 2 }, ['day'], look).svg), strip(both({ hop: 2 }, ['day'], look).svg), 'hop: false (the default) with lit: 2 is two friends');
    // each number beside its own friend's row of claws, to its right, level with it; on no paw, arm or claw
    const r = both({ hop: true }, ['day'], look), parts = pawParts(r.svg), nums = numsOf(r.svg);
    FRIENDS.forEach((who, i) => {
      const cl = parts.filter((p) => p.kind === 'claw' && p.who === who), xs = cl.map((c) => tipOf(c)[0]), ys = cl.map((c) => tipOf(c)[1]), q = nums[i];
      assert.ok(q.x > Math.max(...xs) + 30, who + ': ' + q.text + ' beyond its claws: ' + q.x + ' vs ' + Math.max(...xs).toFixed(0));
      assert.ok(q.x < Math.max(...xs) + 260, who + ': and near them');
      assert.ok(q.y > Math.min(...ys) - 40 && q.y < Math.max(...ys) + 60, who + ': level with its row: ' + q.y.toFixed(0) + ' in ' + [Math.min(...ys), Math.max(...ys)].map(Math.round));
      const hw = q.fs * 0.32 * q.text.length + 8, hh = q.fs * 0.42 + 8;
      for (let dx = -1; dx <= 1; dx += 0.5) for (let dy = -1; dy <= 1; dy += 0.5) {
        const px = q.x + dx * hw, py = q.y + dy * hh;
        assert.ok(!parts.some((p) => inside(p.P, px, py)), who + ': ' + q.text + ' on no paw');
        assert.ok(px > 20 && px < 1580 && py > 20 && py < 980, who + ': ' + q.text + ' in the panel');
      }
      assert.ok(Math.min(...parts.map((p) => distTo(p.P, q.x, q.y))) > 40, who + ': ' + q.text + ' clear of the pile');
      if (i) assert.ok(q.y > nums[i - 1].y + 100, 'the totals run down the panel: ' + nums.map((z) => Math.round(z.y)));
    });
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) assert.ok(Math.abs(nums[i].y - nums[j].y) > 110, 'no two totals crowd each other');
    // gold: the claws' own fill, with a soft glow under each; the unlit ones keep their pale claws
    const one = both({ hop: 1 }, ['day'], look).svg;
    assert.equal((one.match(/fill="#FFD86E"/g) || []).length, 10, 'a glow under each lit claw');
    assert.equal((one.match(/data-claw="[a-z]+"/g) || []).length, 30, 'thirty claws whatever is lit');
  }
});

test('bridge (chapter 4): whatever chapter 4 puts under the bridge renders, and its paws frames ask for both forepaws', () => {
  const st = PC.story.ch04;
  if (!st || !st.frames) return;
  const v = art.vocab.sets.bridge;
  for (const [fid, f] of Object.entries(st.frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'bridge') continue;
    assert.ok(v.cams.includes(sc.cam), fid + ': camera ' + sc.cam);
    for (const [k, val] of Object.entries(sc.opts || {})) assert.ok(Array.isArray(v.opts[k]) && v.opts[k].includes(val), fid + ': ' + k + '=' + JSON.stringify(val));
    checkRender(art.render(sc, { look: LOOK }), sc.cast || [], 'ch04 ' + fid);
    if (sc.opts && sc.opts.pawsIn) assert.equal(sc.opts.pawsIn, 'both', fid + ': the thirty-claw promise is six forepaws (three friends, ten claws each)');
    if (sc.opts && sc.opts.pawsIn) assert.equal(sc.cam, 'paws', fid + ': pawsIn belongs to the paws camera');
  }
});

// ================================================================ chapter 5 (docs/chapters/05-riffles-river.md, "Art needs",
// "Places from before", and "Build", "Sets and options"): the Old Bridge at sunset. `bank` with Riffle
// swimming alongside (the anchor `water`); `back` with the seven little forepaws in the mud (`mudPaws`).

const TEXT5 = path.join(ROOT, 'docs/chapters/05-riffles-river.md');
const same5 = (a, b) => strip(a) === strip(b);   // (assert.ok on this: a failed assert.equal would print both pictures)
const sha12 = (x) => crypto.createHash('sha1').update(x).digest('hex').slice(0, 12);
// The box of everything a piece of markup draws, in world units: path data (absolute and relative
// commands, control points counted), ellipses, circles and rects; transforms are not applied.
function pathBox(d, box) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = '';
  const num = () => +toks[i++];
  const see = (px, py) => { box.x0 = Math.min(box.x0, px); box.x1 = Math.max(box.x1, px); box.y0 = Math.min(box.y0, py); box.y1 = Math.max(box.y1, py); };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase(), c = cmd.toUpperCase();
    if (c === 'Z') { x = sx; y = sy; continue; }
    if (c === 'H') { x = rel ? x + num() : num(); see(x, y); continue; }
    if (c === 'V') { y = rel ? y + num() : num(); see(x, y); continue; }
    if (c === 'A') { i += 5; const ax = num(), ay = num(); x = rel ? x + ax : ax; y = rel ? y + ay : ay; see(x, y); continue; }
    const pairs = c === 'C' ? 3 : c === 'Q' || c === 'S' ? 2 : 1;
    let nx = x, ny = y;
    for (let k = 0; k < pairs; k++) { const px = num(), py = num(); nx = rel ? x + px : px; ny = rel ? y + py : py; see(nx, ny); }
    x = nx; y = ny;
    if (c === 'M') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; }
  }
  return box;
}
function boxOf(markup) {
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const m of markup.match(/ d="[^"]+"/g) || []) pathBox(m.slice(4, -1), box);
  return Object.assign(box, { w: box.x1 - box.x0, h: box.y1 - box.y0, cx: (box.x0 + box.x1) / 2, cy: (box.y0 + box.y1) / 2 });
}
// the markup of the one <g data-art="name" …>…</g> (nesting counted), or ''
function groupNamed(svg, name) {
  const start = svg.indexOf('<g data-art="' + name + '"');
  if (start < 0) return '';
  const re = /<g\b[^>]*>|<\/g>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(svg))) { if (m[0] === '</g>') { if (--depth === 0) return svg.slice(start, re.lastIndex); } else depth++; }
  return '';
}
const mudPawsOf = (svg) => (groupNamed(svg, 'mud-paws').match(/<g data-paw="mud"[^>]*>.*?<\/g>/g) || []).map((p) => Object.assign(boxOf(p), { own: /data-own="sprinkle"/.test(p), claws: count(p, /data-claw="mud"/g) }));
const hit = (a, b, pad) => a.x0 < b.x1 + pad && a.x1 > b.x0 - pad && a.y0 < b.y1 + pad && a.y1 > b.y0 - pad;

test('bridge (chapter 5): chapters 2 to 4 keep their bridge: every picture they draw here, with nobody in it, to the byte', () => {
  // sha1 of the markup (ids stripped) and the keep list, recorded from the chapter 4 build; one for each
  // different scene (camera, options, light), under the first frame that uses it
  const GOLD = {
    'ch02:f046': '6444cdd7333c', 'ch02:f048': '5d67e345371b', 'ch02:f050': 'a5ddc91c442e', 'ch02:f087a': 'bf241abce0fb',
    'ch02:f088a': 'bf241abce0fb', 'ch02:f090a': '8696f13a3304', 'ch02:f091a': '1f2b856dbfec', 'ch02:f092a': '06deb02cbdbe',
    'ch03:f042': 'd360a673df09', 'ch03:f043': '31e73fe59018', 'ch03:f044a': '67045f8acec9', 'ch03:f051': '99eddc8778ff', 'ch03:f052': '0ecc67e629dc',
    'ch03:f053': '0c2a38c617f1', 'ch03:f066': '7b2923884eab', 'ch03:f083': '7a3409903ae8', 'ch03:f084': 'e0c6b839938d', 'ch03:f085': 'f16049e22677',
    'ch03:f086': 'c5c9e851c058', 'ch03:f095a': 'd8dba5ac712d', 'ch03:f099b': 'b443b8839c49', 'ch04:f090': '31a0a0b276d8',
    'ch04:f103': '642cb145a442', 'ch04:f104': '25b4beb4c109'
  };
  for (const [key, want] of Object.entries(GOLD)) {
    const [id, fid] = key.split(':'), sc = PC.story[id].frames[fid].scene;
    assert.equal(sc.set, 'bridge', key);
    const fx = (sc.fx || []).filter((f) => ['morning', 'day', 'sunset', 'dusk', 'night'].includes(f));
    const r = art.render({ set: sc.set, cam: sc.cam, opts: sc.opts, cast: [], fx }, { look: LOOK });
    assert.equal(sha12(strip(r.svg) + JSON.stringify(r.keep)), want, key + ' (' + sc.cam + ' ' + JSON.stringify(sc.opts || {}) + '): drawn as it was');
  }
  // none of their frames asks for anything of chapter 5's, and none draws it; nobody of theirs is in the river
  let n = 0;
  for (const id of ['ch02', 'ch03', 'ch04']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'bridge') continue;
    n++;
    assert.ok(!(sc.opts && 'mudPaws' in sc.opts), id + ' ' + fid + ': no mudPaws');
    assert.ok(!(sc.cast || []).some((m) => m.at === 'water'), id + ' ' + fid + ': nobody at `water`');
    const svg = art.render(sc, { look: LOOK }).svg;
    assert.ok(!/data-art="(mud-paws|swim)"|data-paw="mud"/.test(svg), id + ' ' + fid + ': no forepaws in the mud, no swimmer\'s water');
  }
  assert.ok(n >= 100, 'chapters 2 to 4 visit the bridge: ' + n);
  // `mudPaws` off is nothing at all, on every camera; and the spots they stand on have not moved
  for (const cam of CAMS) for (const off of [0, false, null, 'none']) assert.ok(same5(render(cam, { mudPaws: off, prints: true }).svg, render(cam, { prints: true }).svg), cam + ': mudPaws ' + JSON.stringify(off));
  const A = art.sceneInfo('bridge').anchors;
  assert.deepEqual([A.main['bank-left'], A.main['bank-right'], A.main.reeds, A.main.edge, A.back.dragon, A.back.beside, A.back['back-left'], A.back['back-right'], A.back.near, A.under.mud].map((a) => [a.x, a.y, a.h]),
    [[300, 930, 285], [1250, 936, 285], [1000, 880, 240], [330, 772, 176], [1040, 820, 260], [1150, 850, 290], [560, 900, 340], [1430, 885, 325], [360, 1000, 440], [640, 900, 320]]);
});

test('bridge (chapter 5): the text\'s notes name what the set has: `bank` with Riffle swimming alongside, `back` at sunset, `mudPaws: 7`', () => {
  const md = fs.readFileSync(TEXT5, 'utf8').replace(/\s+/g, ' ');
  // (the names the notes fix, short enough to survive an editor's round on the words around them)
  for (const want of ['on `back`, `mudPaws: 7`', 'the Old Bridge `bank` (Riffle swimming alongside)', '`back` at sunset', 'seven little forepaws']) assert.ok(md.includes(want), 'the notes say: ' + want);
  const v = art.vocab.sets.bridge, info = art.sceneInfo('bridge');
  assert.deepEqual(v.opts.mudPaws, [0, 6, 7]);
  assert.equal(info.defaults.mudPaws, 0);
  assert.deepEqual(v.cams.slice(0, 5), CAMS5, 'no new camera: the bank and the back are chapter 2\'s and 3\'s (chapter 6 adds `wall` after them)');
  // `water`: on the bank's composition only (the other cameras cannot see the river she walks beside)
  assert.ok(v.anchors.includes('water'));
  for (const comp of Object.keys(info.anchors)) assert.equal(!!info.anchors[comp].water, comp === 'main', comp + ': water');
  assert.deepEqual(render('mouth', {}, [{ who: 'riffle', at: 'water', pose: 'swim' }]).heads, [null], 'out of sight from the mouth');
});

test('bridge (chapter 5): `water`: Riffle swims alongside, in the river just off the bank where the reeds part; the river closes over him, never over the mud', () => {
  const A = art.sceneInfo('bridge').anchors.main, a = A.water;
  // beyond the bank's edge, further off than the reeds, nearer than the dark's mouth: sized by the bank's own depth
  assert.ok(a.y < A.reeds.y - 30 && a.y > A.edge.y + 30, 'in the river: ' + a.y);
  assert.ok(a.h < A.reeds.h && a.h > A.edge.h, 'further off than the reeds, nearer than the shadow\'s edge: ' + a.h);
  const perY = (A['bank-left'].h - A.edge.h) / (A['bank-left'].y - A.edge.y), want = A.edge.h + perY * (a.y - A.edge.y);
  assert.ok(Math.abs(a.h - want) / want < 0.12, 'on the bank\'s own depth line: ' + a.h + ' vs ' + want.toFixed(0));
  // alongside: left of the cat walking the bank at `bank-right`, ahead of her (they are going upriver, toward the bridge)
  assert.ok(a.x < A['bank-right'].x - 200 && a.x > 700, 'beside her, a little ahead: ' + a.x);
  assert.equal(a.face, 'left', 'heading upriver, toward the bridge');
  // where the reeds part (the gap where something came up out of the river): a clear view of him
  assert.ok(Math.abs(a.x - 925) < 60, 'in the gap in the reeds');
  const cast = [{ who: 'riffle', at: 'water', pose: 'swim', mood: 'happy', facing: 'left' }, { who: 'player', at: 'bank-right', pose: 'walk', mood: 'happy', facing: 'left' }];
  for (const fx of [['sunset'], ['day'], ['dusk'], ['night'], art.vocab.fx.slice()]) {
    const r = render('bank', {}, cast, fx);
    checkRender(r, cast, 'bank, swimming alongside, ' + fx.join('+'));
    assert.ok(r.heads[0] && r.heads[1], 'both in sight');
    // his head is out on the river: above the walker's feet, left of her, in the middle band of the panel
    assert.ok(r.heads[0].x < r.heads[1].x - 8 && r.heads[0].y > 55 && r.heads[0].y < 90, 'out on the river beside her: ' + JSON.stringify(r.heads));
  }
  // the river closes over him: the same water, clipped to a patch at his waterline, drawn after him, with rings
  const svg = render('bank', {}, cast, ['sunset']).svg, dry = render('bank', {}, [cast[1]], ['sunset']).svg;
  const cover = groupNamed(svg, 'swim');
  assert.ok(cover && !groupNamed(dry, 'swim'), 'the swimmer\'s water, only when somebody swims');
  assert.ok(svg.includes('-c-brswim"') && svg.includes('-c-brswimedge"') && !dry.includes('-c-brswim'), 'its clips');
  const riffleAt = svg.indexOf('translate(' + a.x + ' ' + a.y + ') scale(');
  assert.ok(riffleAt > 0 && riffleAt < svg.indexOf('<g data-art="swim"'), 'drawn after him: he is in the water, not on it');
  assert.ok(count(cover, /stroke-dasharray/g) >= 3, 'rings round him');
  // never over the mud: the patch is clipped to the river side of the bank's edge (the edge clip runs along the bank)
  const edge = new RegExp('<clipPath id="[^"]*-c-brswimedge"><path d="([^"]+)"').exec(svg)[1], eb = boxOf(' d="' + edge + '"');
  assert.ok(eb.x0 <= 0 && eb.x1 >= 1600 && eb.y1 > 860 && eb.y1 < 900 && eb.y0 < 600, 'the river\'s side of the bank: ' + JSON.stringify(eb));
  const patch = boxOf(' d="' + new RegExp('<clipPath id="[^"]*-c-brswim"><path d="([^"]+)"').exec(svg)[1] + '"');
  assert.ok(patch.y0 > a.y - a.h * 0.12 && patch.y0 < a.y, 'an otter swimming shows all of himself above the water: only his bottom edge goes under');
  // anyone else sits deeper (a custom pose, a cat): never dry on the surface
  const deep = boxOf(' d="' + new RegExp('<clipPath id="[^"]*-c-brswim"><path d="([^"]+)"').exec(render('bank', {}, [{ who: 'otter', variant: 2, at: 'water', pose: 'stand' }], ['day']).svg)[1] + '"');
  assert.ok(deep.y0 < patch.y0 - a.h * 0.15, 'standing in the river, the water comes higher');
  // he and his water are drawn before everyone on the bank, whatever the cast's order (z: 'behind'): his river
  // never lies over a cat who stands between him and us
  assert.equal(a.z, 'behind');
  for (const order of [[0, 1], [1, 0]]) {
    const both = [{ who: 'riffle', at: 'water', pose: 'swim' }, { who: 'player', at: 'reeds', pose: 'sit' }], c2 = order.map((i) => both[i]);
    const sv = render('bank', {}, c2, ['sunset']).svg, cat = sv.indexOf('translate(' + A.reeds.x + ' ' + A.reeds.y + ') scale(');
    assert.ok(sv.indexOf('<g data-art="swim"') > 0 && sv.indexOf('<g data-art="swim"') < cat, 'the swimmer and his water, then the cat in the reeds (cast order ' + order + ')');
  }
  // the reeds that stand between him and us are drawn again in front of him (with the drag marks off, the reeds do not part)
  assert.ok(cover.includes('-c-brswimreeds)'), 'reeds in front');
  for (const drag of [true, false]) checkRender(render('bank', { drag }, cast, ['sunset']), cast, 'bank drag ' + drag);
  // every otter pose there renders; the same picture every time; nobody in the water changes nothing else
  for (const pose of art.vocab.otherPoses.riffle) checkRender(render('bank', {}, [{ who: 'riffle', at: 'water', pose }], ['sunset']), [1], 'water ' + pose);
  assert.ok(same5(render('bank', {}, cast, ['sunset']).svg, render('bank', {}, cast, ['sunset']).svg), 'deterministic');
});

test('bridge (chapter 5): the bank at sunset: the sunset sky over the river, the dark under the near end still dark, everyone on the bank in sight', () => {
  const pal = art.kit.PAL, cast = [{ who: 'player', at: 'bank-left', pose: 'sit', mood: 'wonder' }, { who: 'riffle', at: 'water', pose: 'swim' }, { who: 'tallyheart', at: 'bank-right', pose: 'sit' }];
  const sun = render('bank', {}, cast, ['sunset']), day = render('bank', {}, cast, ['day']);
  checkRender(sun, cast, 'bank at sunset');
  assert.ok(sun.svg.includes(pal.sunset.sky[0]) && !sun.svg.includes(pal.day.sky[0]), 'the sunset sky');
  assert.ok(day.svg.includes(pal.day.sky[0]), 'by day unless the frame says');
  assert.deepEqual(sun.heads, day.heads, 'nobody moves with the light');
  sun.heads.forEach((h) => assert.ok(h));
  // the same bank: nothing added or taken away by the light
  const shapes = (svg) => count(svg, /<(path|rect|ellipse|circle)\b/g);
  assert.equal(shapes(render('bank', {}, [], ['sunset']).svg), shapes(render('bank', {}, [], ['day']).svg));
  // the sun has come down: behind the truss at sunset, going behind the far shore at dusk; by day (and at night,
  // when there is none) the bank is as chapters 2 to 4 drew it
  const sunAt = (fx) => { const m = /<circle cx="([\d.]+)" cy="([\d.]+)" r="[\d.]+" fill="url/.exec(render('bank', {}, [], fx).svg); return m ? [+m[1], +m[2]] : null; };
  assert.deepEqual(sunAt(['day']), [1430, 130], 'the high sun by day');
  const set = sunAt(['sunset']), dusk = sunAt(['dusk']);
  assert.ok(set[1] > 360 && set[1] < 470 && set[0] > 1000 && set[0] < 1500, 'at sunset the sun is behind the iron truss: ' + set);
  assert.ok(dusk[1] > set[1] + 100 && dusk[1] < 600, 'at dusk it is going behind the far shore: ' + dusk);
});

test('bridge (chapter 5): mudPaws: little forepaws drawn in the mud in front of Sprinkle\'s spot: chapter 3\'s six again, and with 7 her own; a palm and five claw marks each', () => {
  const A = art.sceneInfo('bridge').anchors.back;
  const seven = render('back', { mudPaws: 7, prints: true }, [], ['sunset']), six = render('back', { mudPaws: 6, prints: true }, [], ['sunset']);
  const P7 = mudPawsOf(seven.svg), P6 = mudPawsOf(six.svg);
  assert.equal(P7.length, 7, 'seven little forepaws');
  assert.equal(P6.length, 6, 'six, before she adds her own');
  assert.ok(/<g data-art="mud-paws" data-count="7">/.test(seven.svg) && /<g data-art="mud-paws" data-count="6">/.test(six.svg));
  for (const p of P7.concat(P6)) assert.equal(p.claws, 5, 'five claw marks a forepaw');
  // four above three, as the mud count's own picture lays seven (chapter 3's mud picture, two rows)
  const rows = (P) => { const mid = (Math.min(...P.map((p) => p.cy)) + Math.max(...P.map((p) => p.cy))) / 2; return [P.filter((p) => p.cy < mid).sort((a, b) => a.cx - b.cx), P.filter((p) => p.cy >= mid).sort((a, b) => a.cx - b.cx)]; };
  const [top, bot] = rows(P7);
  assert.deepEqual([top.length, bot.length], [4, 3], 'four above three');
  for (let i = 1; i < top.length; i++) assert.ok(top[i].x0 > top[i - 1].x1 - 2, 'side by side, none on another');
  for (let i = 1; i < bot.length; i++) assert.ok(bot[i].x0 > bot[i - 1].x1 - 2);
  assert.ok(Math.min(...bot.map((p) => p.y0)) > Math.max(...top.map((p) => p.y1)) - 6, 'the rows apart');
  // the six are the same six, with or without the seventh; the seventh is her own: the first, top left, nearest her claw
  const own = P7.filter((p) => p.own);
  assert.equal(own.length, 1, 'one is her own');
  assert.ok(own[0] === P7.find((p) => p.cx === top[0].cx), 'the first of the top row');
  assert.equal(P6.filter((p) => p.own).length, 0, 'not there yet with six');
  const rest = P7.filter((p) => !p.own);
  rest.forEach((p, i) => assert.ok(Math.abs(p.cx - P6[i].cx) < 0.01 && Math.abs(p.cy - P6[i].cy) < 0.01, 'the same six: ' + i));
  assert.ok(own[0].cx < Math.min(...rest.map((p) => p.cx)), 'the new one is the one nearest Sprinkle (she sits at the left of them, facing in)');
  // little: each much smaller than one of her own big prints beside the drag marks ("her own enormous feet")
  const prints = groupsOf(seven.svg, 'print').map((g) => boxOf(g)), big = Math.max(...prints.map((b) => Math.max(b.w, b.h)));
  for (const p of P7) assert.ok(p.w < big * 0.8 && p.w > 50 && p.w < 110, 'a little forepaw, big enough to see: ' + p.w.toFixed(0) + ' (her print: ' + big.toFixed(0) + ')');
  // on the floor in front of her spot: below her feet and the feet of whoever sits beside her, inside the panel
  const all = boxOf(groupNamed(seven.svg, 'mud-paws').replace(/<path d="[^"]+" fill="#[0-9a-f]+"[^>]*\/>/g, ''));
  const box = { x0: Math.min(...P7.map((p) => p.x0)), x1: Math.max(...P7.map((p) => p.x1)), y0: Math.min(...P7.map((p) => p.y0)), y1: Math.max(...P7.map((p) => p.y1)) };
  assert.ok(box.y0 > A.dragon.y + 40 && box.y0 > A.beside.y + 20 && box.y1 < 985, 'in front of her and of the cat at her side: ' + JSON.stringify(box));
  assert.ok(box.x0 > A.dragon.x - 140 && box.x1 < A['back-right'].x - A['back-right'].h * 0.36, 'under her nose, clear of whoever sits at the right: ' + JSON.stringify(box));
  assert.ok(box.x0 > A['back-left'].x + A['back-left'].h * 0.5, 'clear of whoever sits at the left');
  assert.ok(all.x0 > 0, 'whole');
  // clear of the drag marks' trough and of every one of her own prints
  for (const b of prints) for (const p of P7) assert.ok(!hit(p, b, 4), 'no little forepaw lies on one of her prints: ' + JSON.stringify([p, b]));
  // what the panel is about: one keep box round them all
  const k = seven.keep.find((q) => q.x * 16 < box.x0 && (q.x + q.w) * 16 > box.x1 && q.y * 10 < box.y0 && (q.y + q.h) * 10 > box.y1);
  assert.ok(k && k.w * 16 < (box.x1 - box.x0) + 60, 'kept clear of the lettering, snugly: ' + JSON.stringify(seven.keep));
  // drawn on the floor, under everyone: a cat at `beside` and Sprinkle at `dragon` come after them in the panel
  const withCast = render('back', { mudPaws: 7, prints: true }, [{ who: 'sprinkle', at: 'dragon', pose: 'draw' }, { who: 'player', at: 'beside', pose: 'sit' }], ['sunset']).svg;
  assert.ok(withCast.indexOf('data-art="mud-paws"') < withCast.indexOf('translate(' + A.dragon.x + ' ' + A.dragon.y + ') scale('), 'the drawing is on the floor');
  // grooves in the mud: dark lines with a pale lip, never lit, never filled (the count's own picture does the lighting)
  const g7 = groupNamed(seven.svg, 'mud-paws');
  assert.ok(/fill="none" stroke="#[0-9a-f]{6}" stroke-width="[\d.]+" stroke-linecap="round"/.test(g7), 'drawn in lines');
  assert.ok(!/pcs-pulse|#ffb21f|#ffe36e|#FFE07A/i.test(g7), 'nothing lights here');
});

test('bridge (chapter 5): mudPaws is the back camera\'s; odd values never throw; every light renders', () => {
  for (const cam of ['bank', 'mouth', 'under', 'paws']) {
    assert.equal(mudPawsOf(render(cam, { mudPaws: 7 }).svg).length, 0, cam + ': no forepaws in the mud there');
    assert.ok(same5(render(cam, { mudPaws: 7 }).svg, render(cam, {}).svg), cam + ': nothing changes');
  }
  for (const [v, want] of [[7, 7], [6, 6], [0, 0], [true, 7], [false, 0], [3, 3], [99, 7], [-2, 0], ['7', 7], ['lots', 0], [null, 0], [6.4, 6]]) {
    const r = render('back', { mudPaws: v });
    checkRender(r, [], 'mudPaws ' + JSON.stringify(v));
    assert.equal(mudPawsOf(r.svg).length, want, 'mudPaws: ' + JSON.stringify(v));
  }
  // with every other prop of the back, in every light, with a full cast
  const cast = [{ who: 'sprinkle', at: 'dragon', pose: 'sit' }, { who: 'player', at: 'beside' }, { who: 'riffle', at: 'back-left' }, { who: 'tallyheart', at: 'back-right' }, { who: 'clancat', at: 'near' }];
  for (const opts of [{ mudPaws: 7 }, { mudPaws: 7, prints: true, branch: true }, { mudPaws: 6, eyes: 'sprinkle' }, { mudPaws: 7, train: true, drag: false, drips: false }]) {
    for (const fx of [['day'], ['sunset'], ['dusk'], ['night'], art.vocab.fx.slice()]) checkRender(render('back', opts, cast, fx), cast, 'back ' + JSON.stringify(opts) + ' ' + fx.join('+'));
  }
  // the same drawing in every light (the lines take the light; the forepaws do not move)
  const at = (fx) => mudPawsOf(render('back', { mudPaws: 7 }, [], fx).svg).map((p) => [Math.round(p.cx), Math.round(p.cy)]);
  assert.deepEqual(at(['sunset']), at(['day']));
  assert.deepEqual(at(['dusk']), at(['day']));
  assert.ok(same5(render('back', { mudPaws: 7 }, [], ['sunset']).svg, render('back', { mudPaws: 7 }, [], ['sunset']).svg), 'deterministic');
  // Sprinkle's eyes over the branch, her forepaws in the mud, her prints: the sunset panels of the chapter
  for (const [opts, who] of [[{ eyes: 'sprinkle', prints: true }, []], [{ eyes: 'sprinkle', branch: true, prints: true }, []],
    [{ prints: true, mudPaws: 7 }, [{ who: 'sprinkle', at: 'dragon', pose: 'draw' }, { who: 'player', at: 'beside', pose: 'sit' }]],
    [{ prints: true, mudPaws: 7, branch: true }, [{ who: 'sprinkle', at: 'dragon', pose: 'sit' }, { who: 'player', at: 'back-left', pose: 'sit' }, { who: 'riffle', at: 'near', pose: 'sit' }]]]) {
    const r = render('back', opts, who, ['sunset']);
    checkRender(r, who, 'back at sunset ' + JSON.stringify(opts));
    r.heads.forEach((h, i) => assert.ok(h, who[i].who + ' in sight'));
    assert.ok(count(r.svg, /mix-blend-mode:screen/g) >= 2, 'the evening light reaches in');
  }
});

test('bridge (chapter 5): whatever chapter 5 puts at the Old Bridge renders, with the vocabulary; only an otter is ever in the water (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch05;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'bridge' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 5 has no frames at the Old Bridge yet'); return; }
  const v = art.vocab.sets.bridge;
  let mud = 0;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    for (const [k, val] of Object.entries(sc.opts || {})) assert.ok(Array.isArray(v.opts[k]) && v.opts[k].includes(val), id + ': ' + k + '=' + JSON.stringify(val));
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc.cast || [], 'ch05 ' + id);
    (sc.cast || []).forEach((m, i) => { if (typeof m.at === 'string') assert.ok(r.heads[i], id + ': ' + m.who + ' at ' + m.at + ' is in sight of the ' + sc.cam + ' camera'); });
    for (const m of sc.cast || []) if (m.at === 'water') assert.ok(m.who === 'riffle' || m.who === 'otter', id + ': only an otter swims');
    if (sc.opts && sc.opts.mudPaws) { mud++; assert.equal(sc.cam, 'back', id + ': the forepaws in the mud are the back camera\'s'); }
  }
  t.diagnostic(frames.length + ' frames at the Old Bridge, ' + mud + ' with the forepaws in the mud');
});

// ================================================================ chapter 6: the stone leg, Coil's gap and `wall`
// docs/chapters/06-the-snake-in-the-stones.spec.md, section 4 ("Places", the bridge row) and section 5

const SPEC6 = path.join(ROOT, 'docs/chapters/06-the-snake-in-the-stones.spec.md');
const refH = () => art.character('clancat', { pose: 'sit', variant: 1 }).h;
// A cast member's body and head boxes where scenes.js draws it at anchor `a`: [x0, y0, x1, y1] in the world
// (the cats' units, and the size band PC.art.sizeBands holds a newcomer to, as Coil's).
function bandOf(who) {
  const b = art.sizeBands && art.sizeBands[who];
  if (!b) return 1;
  const meas = (w, p) => { const c = art.character(w, { pose: p, mood: 'neutral' }), hb = c.headBox; return b.by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : c.h - hb.y0; };
  const ratio = meas(who, b.pose) / meas(b.ref, 'sit');
  return Math.min(b.max, Math.max(b.min, ratio)) / ratio;
}
function boxesAt(m, a) {
  const o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: m.facing || a.face || 'right' };
  if (m.variant) o.variant = m.variant;
  if (m.who === 'player') { o.look = LOOK; o.sex = LOOK.sex; }
  const ch = art.character(m.who, o), s = a.h * (m.size > 0 ? m.size : 1) / refH() * bandOf(m.who);
  const W = (b) => [a.x + (b.x0 - ch.w / 2) * s, a.y + (b.y0 - ch.h) * s, a.x + (b.x1 - ch.w / 2) * s, a.y + (b.y1 - ch.h) * s];
  return { body: W(ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h }), head: ch.headBox ? W(ch.headBox) : null };
}
const meets = (p, q) => p[0] < q[2] && p[2] > q[0] && p[1] < q[3] && p[3] > q[1];
// a head's size as the scenes' size bands measure it: the head box, width and height averaged
const headSize = (b) => ((b[2] - b[0]) + (b[3] - b[1])) / 2;
// Coil, once app/art/cats.js draws him (the spec: one box for every pose, his head at its bottom
// centre, facing right, his body trailing back from it along the bottom line)
const COIL_POSES = ['stone', 'head', 'long', 'longer', 'still', 'listen', 'think', 'slide'];
const coilDraws = (() => {
  if (!art.vocab.cast.includes('coil')) return false;
  try { return COIL_POSES.every((pose) => { const c = art.character('coil', { pose, facing: 'right' }); return !!c && !c.placeholder && c.w > 0 && !!c.headBox; }); } catch (e) { return false; }
})();
// His head at `a` as the spec places it: at the anchor's bottom centre, smaller than a cat's head there
// (a sitting Clan cat's head is about 0.46 of its height across; his, at most about four fifths of
// that): the drawing's own, once there is one.
function coilHead(a) {
  if (coilDraws) return boxesAt({ who: 'coil', pose: 'head' }, a).head;
  return [a.x - 0.18 * a.h, a.y - 0.3 * a.h, a.x + 0.18 * a.h, a.y];
}
// The strip of floor his body lies along, from the panel's edge behind him to his head (facing right:
// the left edge), as high as he lies, a little over his head's height.
function coilStrip(a) { return [a.face === 'left' ? a.x : 0, a.y - 0.3 * a.h, a.face === 'left' ? 1600 : a.x, a.y]; }
// Everyone who sits at the bridge's spots in this chapter, in poses they take; Sprinkle in hers
const SITTERS = [].concat(
  ['sit', 'stand', 'walk', 'crouch', 'pawup', 'lookup', 'peer', 'loaf'].map((pose) => ({ who: 'player', pose })),
  ['sit', 'stand', 'walk', 'pawup'].map((pose) => ({ who: 'tallyheart', pose })),
  [1, 2, 3, 4, 5, 6].map((variant) => ({ who: 'clancat', variant, pose: 'sit' })),
  ['sit', 'stand', 'juggle', 'hop', 'puff', 'point', 'scramble', 'hush'].filter((p) => art.vocab.otherPoses.riffle.includes(p)).map((pose) => ({ who: 'riffle', pose })));
const SPRINKLE = ['sit', 'peek', 'sniff', 'unfold', 'pawup', 'lie', 'curl', 'gulp'].filter((p) => art.vocab.otherPoses.sprinkle.includes(p));
const legOf = (svg) => groupNamed(svg, 'leg');
function gapOf(svg) {
  const m = /<g data-art="gap" data-x0="([-\d.]+)" data-x1="([-\d.]+)" data-top="([-\d.]+)" data-foot="([-\d.]+)">/.exec(svg);
  return m ? { x0: +m[1], x1: +m[2], top: +m[3], foot: +m[4], box: [+m[1], +m[3], +m[2], +m[4]] } : null;
}
// a `keep` box (percent of the panel) holding the world point (x, y) of a full-world camera
const kept = (r, x, y) => (r.keep || []).some((k) => x / 16 >= k.x && x / 16 <= k.x + k.w && y / 10 >= k.y && y / 10 <= k.y + k.h);

test('bridge (chapter 6): the spec names `stones`, `gap` and the camera `wall`, and the set has them; `wall` is a composition of its own', () => {
  const md = fs.readFileSync(SPEC6, 'utf8').replace(/\s+/g, ' ');
  for (const want of ['**`stones: true`** on `back`', '**Anchor `gap`** in `back`', "**Camera `wall`, its own composition** (`cams.wall = { box: [0, 0, 1600], comp: 'wall' }`",
    '**`gap`** (default facing right', '**`back-left`**', '**`back-right`**', '**`dragon`**', 'No `near` or `beside`', '`train: true` works here']) assert.ok(md.includes(want), 'the spec says: ' + want);
  const v = art.vocab.sets.bridge, info = art.sceneInfo('bridge');
  assert.deepEqual(v.cams, CAMS, 'chapter 2 to 5\'s five cameras, then `wall`');
  assert.deepEqual(v.opts.stones, [false, true]);
  assert.equal(info.defaults.stones, false, 'off unless a frame asks: chapters 3 to 5\'s back has no leg');
  assert.equal(info.cams.wall.comp, 'wall');
  assert.deepEqual([info.cams.wall.x, info.cams.wall.y, info.cams.wall.w], [0, 0, 1600], 'the whole world, as `back` and `paws`');
  assert.deepEqual(Object.keys(info.anchors.wall).sort(), ['back-left', 'back-right', 'dragon', 'gap'], 'wall: the four, sharing their names');
  assert.ok(!info.anchors.wall.near && !info.anchors.wall.beside, 'no `near` or `beside`: none of Tallyheart\'s told-path spots is in view');
  for (const comp of Object.keys(info.anchors)) assert.equal(!!info.anchors[comp].gap, comp === 'back' || comp === 'wall', comp + ': gap');
});

test('bridge (chapter 6): chapters 2 to 5 keep their bridge: none of their frames asks for the leg or the wall, and `stones` off draws exactly what it drew', () => {
  let n = 0;
  for (const id of ['ch02', 'ch03', 'ch04', 'ch05']) for (const [fid, f] of Object.entries(PC.story[id].frames)) {
    const sc = f.scene;
    if (!sc || sc.set !== 'bridge') continue;
    n++;
    assert.ok(!(sc.opts && 'stones' in sc.opts), id + ' ' + fid + ': no stones');
    assert.notEqual(sc.cam, 'wall', id + ' ' + fid + ': not the wall');
    assert.ok(!(sc.cast || []).some((m) => m.at === 'gap'), id + ' ' + fid + ': nobody at `gap`');
    assert.ok(!/data-art="(leg|gap)"/.test(art.render(sc, { look: LOOK }).svg), id + ' ' + fid + ': no leg, no gap');
  }
  assert.ok(n >= 120, 'chapters 2 to 5 visit the bridge: ' + n);
  // `stones` off, false or odd is nothing at all; and on, it is `back`'s alone
  for (const cam of CAMS5) for (const opts of [{}, { prints: true }, { eyes: 'sprinkle', prints: true }, { branch: true, train: true, prints: true }, { mudPaws: 7, prints: true }]) {
    const plain = render(cam, opts).svg;
    for (const off of [false, null, 'no', 0]) assert.ok(same5(render(cam, Object.assign({ stones: off }, opts)).svg, plain), cam + ' ' + JSON.stringify(opts) + ': stones ' + JSON.stringify(off));
    assert.equal(same5(render(cam, Object.assign({ stones: true }, opts)).svg, plain), cam !== 'back', cam + ': stones: true draws ' + (cam === 'back' ? 'the leg' : 'nothing here'));
  }
  // the back's five spots have not moved, and the new one is on their floor (h = y - 560), so a spot of its own
  // gets the depth it always got
  const A = art.sceneInfo('bridge').anchors.back;
  assert.deepEqual(['dragon', 'beside', 'back-left', 'back-right', 'near'].map((k) => [A[k].x, A[k].y, A[k].h]), [[1040, 820, 260], [1150, 850, 290], [560, 900, 340], [1430, 885, 325], [360, 1000, 440]]);
  assert.equal(A.gap.h, A.gap.y - 560);
});

test('bridge (chapter 6): `stones: true`: the stone leg beside Sprinkle\'s nook, big old fitted stones on the dry floor, one dark gap low in it, its mouth at `gap`', () => {
  const r = render('back', { stones: true, prints: true }), svg = r.svg, a = art.sceneInfo('bridge').anchors.back.gap;
  checkRender(r, [], 'back with the leg');
  const leg = legOf(svg), G = gapOf(svg);
  assert.ok(leg && G, 'the leg, and the gap in it');
  assert.ok(leg.includes('data-art="gap"'), 'the gap is in the leg');
  // beside the nook: the leg stands at the left, clear of the nook's mouth (Sprinkle's spot) and its arch
  const lb = boxOf(leg);
  assert.ok(lb.x0 <= 0 && lb.x1 < 700 && lb.x1 > 500, 'the leg at the left, beside the nook: x ' + Math.round(lb.x0) + '..' + Math.round(lb.x1));
  assert.ok(lb.y1 > 700 && lb.y1 < 790, 'its foot on the dry floor: ' + Math.round(lb.y1));
  assert.ok(lb.y0 < 140, 'up into the dark under the deck');
  // big old fitted stones: many of them, of different widths
  const stones = (leg.match(/<path d="([^"]+)" fill="#[0-9A-Fa-f]{6}"\/>/g) || []).flatMap((p) => (p.match(/M[^MZ]+Z/g) || [])).map((d) => boxOf(' d="' + d + '"'));
  const big = stones.filter((b) => b.w > 60);
  assert.ok(big.length >= 14, 'courses of big blocks: ' + big.length);
  assert.ok(Math.max(...big.map((b) => b.w)) > Math.min(...big.map((b) => b.w)) * 1.6, 'old, of uneven sizes');
  // the gap: low, in the bottom course, its mouth on the floor at `gap`
  assert.ok(a.x > G.x0 && a.x < G.x1 && Math.abs(a.y - G.foot) < 3, 'gap: the mouth of the gap: ' + JSON.stringify(a) + ' ' + JSON.stringify(G));
  assert.ok(G.foot - G.top < 120 && G.foot - G.top > 50 && G.top > 600, 'low in the leg, one block high: ' + G.top + '..' + G.foot);
  assert.ok(G.x1 - G.x0 > 80 && G.x1 - G.x0 < 200, 'a block wide');
  assert.equal(a.face, 'right', 'Coil faces the cats; his body trails back toward the panel\'s left edge');
  assert.ok(kept(r, a.x, a.y - 30), 'the lettering keeps off the gap and his head');
  // his head is smaller than the stones round his door
  const hd = coilHead(a);
  assert.ok(hd[2] - hd[0] < Math.max(...big.map((b) => b.w)) && hd[2] - hd[0] < 0.46 * a.h + 1, 'no bigger than a stone of the wall, smaller than a cat\'s head');
});

test('bridge (chapter 6): Coil at `gap` in `back` lies along the wall\'s foot behind everyone, toward the panel\'s edge; `dragon`, `beside`, `back-left`, `back-right` and `near` all still read', () => {
  const A = art.sceneInfo('bridge').anchors.back, a = A.gap, hd = coilHead(a), strip = coilStrip(a);
  assert.ok(strip[2] - strip[0] > 0.5 * a.h, 'room for his body between the gap and the panel\'s edge');
  // no one at any spot, in any pose this chapter gives them, is over his head or the floor his body lies on
  for (const at of ['near', 'back-left', 'back-right', 'beside']) for (const m of SITTERS) for (const facing of ['left', 'right']) {
    const b = boxesAt(Object.assign({ facing }, m), A[at]).body;
    assert.ok(!meets(b, hd), at + ': ' + m.who + ' (' + m.pose + ') is clear of Coil\'s head');
    assert.ok(!meets(b, strip), at + ': ' + m.who + ' (' + m.pose + ') is clear of the floor his body lies along');
  }
  for (const pose of SPRINKLE) {
    const b = boxesAt({ who: 'sprinkle', pose, facing: 'left' }, A.dragon).body;
    assert.ok(!meets(b, hd) && !meets(b, strip), 'Sprinkle (' + pose + ') at `dragon` is clear of him');
  }
  if (coilDraws) for (const pose of COIL_POSES) {
    const c = boxesAt({ who: 'coil', pose, facing: 'right' }, a);
    assert.ok(c.body[2] <= a.x + 0.4 * a.h, pose + ': nothing of him reaches past his head toward the cats');
    for (const at of ['near', 'back-left', 'back-right', 'beside']) assert.ok(!meets(c.body, boxesAt({ who: 'player' }, A[at]).body), pose + ': not over ' + at);
  }
  // the whole cast at once, with every prop of the back, in every light: every face in sight
  const cast = [{ who: 'sprinkle', at: 'dragon', pose: 'sit' }, { who: 'player', at: 'beside' }, { who: 'riffle', at: 'back-left' }, { who: 'tallyheart', at: 'back-right' }, { who: 'clancat', at: 'near', variant: 2 }]
    .concat(coilDraws ? [{ who: 'coil', at: 'gap', pose: 'head' }] : []);
  for (const opts of [{ stones: true, prints: true }, { stones: true, prints: true, branch: true, train: true }, { stones: true, eyes: 'sprinkle', mudPaws: 7 }]) {
    for (const fx of [['day'], ['sunset'], ['dusk'], ['night']]) {
      const r = render('back', opts, cast, fx);
      checkRender(r, cast, 'back ' + JSON.stringify(opts) + ' ' + fx[0]);
      r.heads.forEach((h, i) => assert.ok(h, cast[i].who + ' at ' + cast[i].at + ' in sight'));
    }
  }
});

test('bridge (chapter 6): `wall`: at cat height, the stone leg across the middle distance, its gap low, a quarter to a third of the way across; the dry floor in front', () => {
  const info = art.sceneInfo('bridge'), A = info.anchors.wall, r = render('wall', {}), svg = r.svg;
  checkRender(r, [], 'wall');
  const leg = legOf(svg), G = gapOf(svg), lb = boxOf(leg);
  assert.ok(leg && G, 'the leg and its gap');
  assert.ok(lb.x0 <= 0 && lb.x1 > 1100, 'across the middle distance: x ' + Math.round(lb.x0) + '..' + Math.round(lb.x1));
  assert.ok(lb.y1 > 640 && lb.y1 < 760 && lb.y0 < 120, 'from under the deck to its foot on the floor: ' + Math.round(lb.y0) + '..' + Math.round(lb.y1));
  const gx = (G.x0 + G.x1) / 2;
  assert.ok(gx >= 1600 / 4 && gx <= 1600 / 3, 'the gap a quarter to a third of the way across: ' + gx);
  assert.ok(Math.abs(G.foot - lb.y1) < 12 && G.foot - G.top < 120, 'low: in the bottom course, its mouth on the floor');
  assert.ok(A.gap.x > G.x0 && A.gap.x < G.x1 && Math.abs(A.gap.y - G.foot) < 3, '`gap` at its mouth');
  assert.ok(kept(r, A.gap.x, A.gap.y - 30), 'kept clear of the lettering');
  // always drawn here: `stones` says nothing to this camera
  for (const opts of [{ stones: true }, { stones: false }]) assert.ok(same5(render('wall', opts).svg, svg), 'wall ' + JSON.stringify(opts));
  // the spots: Coil facing the cats; our cat near, between the gap and the centre, facing it; Riffle near on the
  // right; Sprinkle at the right edge
  assert.equal(A.gap.face, 'right');
  assert.ok(A['back-left'].x > G.x1 && A['back-left'].x < 800 && A['back-left'].face === 'left', 'back-left: between the gap and the centre, facing it');
  assert.ok(A['back-right'].x > A['back-left'].x + 250 && A['back-right'].face === 'left', 'back-right: on the right, facing left');
  for (const k of ['back-left', 'back-right']) assert.ok(A[k].y > A.gap.y + 150, k + ': near, on the floor in front');
  // Coil is drawn by his own size band (smaller than a cat's head, no bigger than a stone): `gap`'s height is
  // his size in this close shot, not a depth, and it makes his head about two fifths of our cat's beside him,
  // so his eyes read (at 205 they were a few pixels across)
  if (coilDraws) {
    const hd = coilHead(A.gap), cat = boxesAt({ who: 'player', facing: 'left' }, A['back-left']).head;
    const share = headSize(hd) / headSize(cat);
    assert.ok(share > 0.36 && share < 0.55, 'his head beside our cat\'s: ' + share.toFixed(2));
    const big = (legOf(svg).match(/<path d="([^"]+)" fill="#[0-9A-Fa-f]{6}"\/>/g) || []).flatMap((p) => (p.match(/M[^MZ]+Z/g) || [])).map((d) => boxOf(' d="' + d + '"')).filter((b) => b.w > 60);
    assert.ok(hd[2] - hd[0] < Math.max(...big.map((b) => b.w)), 'no bigger than a stone of the wall');
  }
  assert.ok(A.dragon.x >= 1500 && A.dragon.face === 'left' && A.dragon.z === 'behind', 'dragon: at the right edge, facing left (drawn behind the cats, out of the depth sums)');
  assert.ok(A.dragon.y > 1000, 'her feet far below the panel');
  // and nobody else's spot is seen from here
  const far = render('wall', {}, [{ who: 'tallyheart', at: 'near' }, { who: 'player', at: 'beside' }, { who: 'riffle', at: 'mud' }, { who: 'player', at: 'bank-left' }]);
  assert.deepEqual(far.heads, [null, null, null, null], 'no `near`, no `beside`: the told path\'s spots are out of the panel');
});

test('bridge (chapter 6): in `wall` no cat\'s box covers the gap or Coil\'s head; his body trails left along the wall\'s foot and off the panel, away from them; Sprinkle shows only her head and neck', () => {
  const A = art.sceneInfo('bridge').anchors.wall, G = gapOf(render('wall', {}).svg), hd = coilHead(A.gap), strip = coilStrip(A.gap);
  assert.equal(strip[0], 0, 'his body goes off the panel\'s left edge');
  for (const at of ['back-left', 'back-right']) for (const m of SITTERS) for (const facing of ['left', 'right']) {
    const b = boxesAt(Object.assign({ facing }, m), A[at]).body;
    assert.ok(!meets(b, G.box), at + ': ' + m.who + ' (' + m.pose + ', ' + facing + ') is clear of the gap');
    assert.ok(!meets(b, hd), at + ': ' + m.who + ' (' + m.pose + ', ' + facing + ') is clear of Coil\'s head');
    assert.ok(!meets(b, strip), at + ': ' + m.who + ' (' + m.pose + ', ' + facing + ') is clear of the floor his body lies along');
  }
  for (const pose of SPRINKLE) {
    const s = boxesAt({ who: 'sprinkle', pose, facing: 'left' }, A.dragon);
    assert.ok(!meets(s.body, G.box) && !meets(s.body, hd) && !meets(s.body, strip), 'Sprinkle (' + pose + ') is clear of the gap and of him');
    assert.ok(s.body[2] > 1600 || s.body[3] > 1000, pose + ': the rest of her is off the panel');
  }
  // sitting up: her head in the panel at its right edge, level with the cats' heads; her chest and forepaws below it
  const sit = boxesAt({ who: 'sprinkle', pose: 'sit', facing: 'left' }, A.dragon), cat = boxesAt({ who: 'player', facing: 'left' }, A['back-left']);
  const shown = Math.max(0, Math.min(sit.head[2], 1600) - sit.head[0]) / (sit.head[2] - sit.head[0]);
  assert.ok(shown > 0.6 && sit.head[3] < 1000 && sit.head[1] > 300, 'her head is in the panel at its right edge: ' + sit.head.map(Math.round));
  assert.ok(Math.abs((sit.head[1] + sit.head[3]) / 2 - (cat.head[1] + cat.head[3]) / 2) < 150, 'about level with our cat\'s');
  assert.ok(A.dragon.y - 0.4 * A.dragon.h > 950, 'her chest at the panel\'s foot, her forepaws below it: only her head and neck');
  // the whole cast, Coil drawn where cats.js draws him: every face in sight, Sprinkle's head at the right edge
  const cast = [{ who: 'sprinkle', at: 'dragon', pose: 'sit' }, { who: 'player', at: 'back-left' }, { who: 'riffle', at: 'back-right' }]
    .concat(coilDraws ? [{ who: 'coil', at: 'gap', pose: 'longer' }] : []);
  const r = render('wall', {}, cast);
  checkRender(r, cast, 'wall, everyone');
  r.heads.forEach((h, i) => assert.ok(h, cast[i].who + ' at ' + cast[i].at + ' in sight'));
  assert.ok(r.heads[0].x > 80, 'Sprinkle\'s face at the right edge');
  if (coilDraws) for (const pose of COIL_POSES) {
    const c = boxesAt({ who: 'coil', pose, facing: 'right' }, A.gap);
    assert.ok(c.body[2] <= A.gap.x + 0.4 * A.gap.h, pose + ': nothing of him toward the cats past his head');
    assert.ok(!meets(c.body, cat.body), pose + ': never over our cat');
  }
});

test('bridge (chapter 6): `train: true` on `wall` shakes grit down in front of the wall; the wall renders in every light, with every option', () => {
  const floats = (svg) => count(svg, /class="pcs-float"/g);
  assert.ok(floats(render('wall', { train: true }).svg) >= floats(render('wall', {}).svg) + 20, 'grit falling from the deck');
  assert.ok(floats(render('back', { train: true, stones: true }).svg) >= floats(render('back', { stones: true }).svg) + 20, 'and on `back` with the leg');
  const cast = [{ who: 'sprinkle', at: 'dragon', pose: 'peek' }, { who: 'player', at: 'back-left', pose: 'pawup' }, { who: 'riffle', at: 'back-right', pose: 'juggle' }];
  for (const fx of [['day'], ['sunset'], ['dusk'], ['night'], art.vocab.fx.slice()]) for (const opts of [{}, { train: true }, { drips: false, train: true }]) {
    checkRender(render('wall', opts, cast, fx), cast, 'wall ' + JSON.stringify(opts) + ' ' + fx.join('+'));
  }
  assert.ok(count(render('wall', {}, [], ['sunset']).svg, /mix-blend-mode:screen/g) >= 2, 'the evening light reaches in');
  assert.ok(same5(render('wall', {}, cast).svg, render('wall', {}, cast).svg), 'the same picture every time');
  // the dark is never black here either
  const fills = (render('wall', {}).svg.match(/fill="#([0-9A-Fa-f]{6})"/g) || []).map((f) => parseInt(f.slice(7, 13), 16));
  assert.ok(!fills.includes(0), 'no pure black');
});

test('bridge (chapter 6): Coil is the same size beside the cats in every frame he is in, close (`wall`) or wide (`back`, his `size`): his head about two fifths of our cat\'s, never a speck, never a cat\'s; nobody covers it', (t) => {
  const ch = PC.story && PC.story.ch06;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'bridge' && (f.scene.cast || []).some((m) => m.who === 'coil')) : [];
  if (!frames.length || !coilDraws) { t.diagnostic('no Coil yet'); return; }
  const A = art.sceneInfo('bridge').anchors, shares = {};
  for (const [id, f] of frames) {
    const sc = f.scene, cast = sc.cast, co = cast.find((m) => m.who === 'coil'), me = cast.find((m) => m.who === 'player');
    assert.equal(co.at, 'gap', id + ': at his gap');
    const hd = boxesAt(Object.assign({}, co, { pose: 'head' }), A[sc.cam].gap).head;
    if (me) {
      const cat = boxesAt(me, typeof me.at === 'string' ? A[sc.cam][me.at] : me.at).head;
      const share = headSize(hd) / headSize(cat);
      (shares[sc.cam] = shares[sc.cam] || []).push(share);
      assert.ok(share > 0.36 && share < 0.55, id + ' (' + sc.cam + '): his head beside our cat\'s: ' + share.toFixed(2));
    }
    const head = boxesAt(co, A[sc.cam].gap).head;
    for (const m of cast) if (m !== co && typeof m.at === 'string' && m.at !== 'dragon') assert.ok(!meets(boxesAt(m, A[sc.cam][m.at]).body, head), id + ': ' + m.who + ' at ' + m.at + ' is clear of his head');
  }
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  assert.ok(shares.wall && shares.back && Math.abs(mean(shares.wall) - mean(shares.back)) < 0.03, 'close or wide, the same size: wall ' + mean(shares.wall).toFixed(3) + ', back ' + mean(shares.back).toFixed(3));
});

test('bridge (chapter 6): whatever chapter 6 puts at the Old Bridge renders, with the vocabulary; Coil at `gap` only, on `back` with the leg or on `wall` (once the chapter is written)', (t) => {
  const ch = PC.story && PC.story.ch06;
  const frames = ch && ch.frames ? Object.entries(ch.frames).filter(([, f]) => f.scene && f.scene.set === 'bridge' && f.board !== 'STUB.') : [];
  if (!frames.length) { t.diagnostic('chapter 6 has no frames at the Old Bridge yet'); return; }
  const v = art.vocab.sets.bridge;
  for (const [id, f] of frames) {
    const sc = f.scene;
    assert.ok(v.cams.includes(sc.cam), id + ': camera ' + sc.cam);
    for (const [k, val] of Object.entries(sc.opts || {})) assert.ok(Array.isArray(v.opts[k]) && v.opts[k].includes(val), id + ': ' + k + '=' + JSON.stringify(val));
    const r = art.render(sc, { look: LOOK });
    checkRender(r, sc.cast || [], 'ch06 ' + id);
    (sc.cast || []).forEach((m, i) => { if (typeof m.at === 'string') assert.ok(r.heads[i] || m.who === 'coil', id + ': ' + m.who + ' at ' + m.at + ' is in sight of the ' + sc.cam + ' camera'); });
    for (const m of sc.cast || []) if (m.at === 'gap') assert.ok(sc.cam === 'wall' || (sc.opts && sc.opts.stones === true), id + ': the gap is only there with the leg');
  }
  t.diagnostic(frames.length + ' frames at the Old Bridge');
});

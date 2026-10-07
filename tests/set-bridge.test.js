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
const CAMS = ['bank', 'mouth', 'under', 'back', 'paws'];
const DRAG_CAMS = ['bank', 'mouth', 'under', 'back'];   // the cameras with drag marks, drips and the train
const ANCHORS = { bank: ['bank-left', 'bank-right', 'reeds'], mouth: ['rock', 'edge', 'sun', 'sun-edge'], under: ['mud', 'inside'],
  back: ['near', 'dragon', 'beside', 'back-left', 'back-right'], paws: [] };
const OPTS = { train: [true, false], eyes: ['none', 'open', 'blink', 'sprinkle'], drag: [true, false], drips: [true, false],
  pebble: ['in', 'out', 'paws'], branch: [true, false], prints: [true, false], pawsIn: [true, false], hop: [false, true] };
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
  assert.deepEqual(info.defaults, { train: false, eyes: 'none', drag: true, drips: true, branch: false, prints: false, pawsIn: false, hop: false });
  const plain = render('back', {}).svg, none = render('back', { eyes: 'none', drag: true, drips: true, train: false }).svg;
  assert.equal(strip(plain).length, strip(none).length, 'an empty opts is the defaults');
});

// ---------------------------------------------------------------- cameras and anchors

test('bridge: each camera frames its own anchors, inside its box', () => {
  const info = art.sceneInfo('bridge');
  for (const cam of CAMS) {
    const box = info.cams[cam], comp = info.anchors[box.comp];
    assert.ok(comp, cam + ': has its anchors');
    for (const a of ANCHORS[cam]) {
      const at = comp[a];
      assert.ok(at, cam + ': anchor ' + a + ' is in its composition');
      assert.ok(at.x >= box.x && at.x <= box.x + box.w && at.y >= box.y && at.y <= box.y + box.h, cam + ' ' + a + ' inside ' + JSON.stringify(box));
      assert.ok(at.h > 0, cam + ' ' + a + ': a cat height');
    }
    for (const [k, at] of Object.entries(comp)) assert.ok(at.x >= box.x && at.x <= box.x + box.w && at.y >= box.y && at.y <= box.y + box.h, cam + ' ' + k + ' inside');
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

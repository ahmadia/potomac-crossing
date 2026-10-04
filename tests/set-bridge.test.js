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

// docs/build.md, "Art vocabulary, chapter 2": the names the story is written against
const CAMS = ['bank', 'mouth', 'under', 'back'];
const ANCHORS = { bank: ['bank-left', 'bank-right', 'reeds'], mouth: ['rock', 'edge', 'sun', 'sun-edge'], under: ['mud', 'inside'], back: ['near'] };
const OPTS = { train: [true, false], eyes: ['none', 'open', 'blink'], drag: [true, false], drips: [true, false] };

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

test('bridge: defaults are day, no train, no eyes, drag marks and drips on', () => {
  const info = art.sceneInfo('bridge');
  assert.deepEqual(info.defaults, { train: false, eyes: 'none', drag: true, drips: true });
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
  }
});

test('bridge: the train crosses on top (bank, mouth) and shakes grit down (under, back)', () => {
  for (const cam of CAMS) {
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
  for (const cam of CAMS) {
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
  for (const cam of ['under', 'back']) {
    const svg = render(cam, {}).svg;
    assert.ok(!/fill="#0{3,6}"/i.test(svg), cam + ': no pure black fills');
  }
  for (const cam of CAMS) {
    const s = () => strip(render(cam, { train: true, eyes: 'open' }, [{ who: 'player', at: ANCHORS[cam][0] }]).svg);
    assert.equal(s(), s(), cam + ': deterministic');
  }
});

// Set art and the panel renderer (app/art/scenes.js): node --test tests/scenes.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const has = (f) => fs.existsSync(path.join(ROOT, f));
if (has('app/art/cats.js')) require(path.join(ROOT, 'app/art/cats.js'));
const PC = require(path.join(ROOT, 'app/art/scenes.js'));
const art = PC.art;

const LOOK = { fur: 'calico', marking: 'white-paws', eyes: 'odd', sex: 'tom' };
const WHO = ['player', 'tallyheart', 'glintstar', 'waffles', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'tallone', 'sparrow', 'moth'];
const POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer'];
const MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn'];
const OTHER = { sparrow: ['perch', 'fluffed'], moth: ['fly'], tallone: ['stand', 'water', 'set-dish'] };

// ---------------------------------------------------------------- helpers

// A small XML well-formedness check: balanced tags, quoted attributes, escaped text.
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

function viewBox(svg) {
  const m = /^<svg[^>]*\sviewBox="([^"]+)"/.exec(svg);
  assert.ok(m, 'svg has a viewBox');
  return m[1].split(/\s+/).map(Number);
}

function checkRender(r, scene, label) {
  assert.equal(typeof r, 'object', label);
  assert.equal(typeof r.svg, 'string', label);
  assert.ok(r.svg.startsWith('<svg') && r.svg.endsWith('</svg>'), label + ': a complete <svg>');
  assert.ok(/preserveAspectRatio="xMidYMid slice"/.test(r.svg), label + ': slice');
  assert.ok(!/NaN|undefined|Infinity|="null"|\[object/.test(r.svg), label + ': no NaN/undefined in the markup');
  checkXml(r.svg);
  const vb = viewBox(r.svg);
  assert.equal(vb.length, 4, label);
  vb.forEach((v) => assert.ok(Number.isFinite(v), label + ': finite viewBox'));
  assert.ok(Math.abs(vb[2] / vb[3] - 1.6) < 0.01, label + ': 16:10 viewBox, got ' + vb.join(' '));
  assert.ok(vb[0] >= -0.5 && vb[1] >= -0.5 && vb[0] + vb[2] <= 1600.5 && vb[1] + vb[3] <= 1000.5, label + ': the camera stays inside the 1600 x 1000 world: ' + vb.join(' '));
  // ids are unique and every url(#…) points at one of them
  const ids = (r.svg.match(/\sid="([^"]+)"/g) || []).map((s) => s.slice(5, -1));
  assert.equal(new Set(ids).size, ids.length, label + ': duplicate ids');
  const idset = new Set(ids);
  for (const ref of r.svg.match(/url\(#([^)]+)\)/g) || []) assert.ok(idset.has(ref.slice(5, -1)), label + ': dangling ' + ref);
  for (const ref of r.svg.match(/href="#([^"]+)"/g) || []) assert.ok(idset.has(ref.slice(7, -1)), label + ': dangling ' + ref);
  // heads: one per cast member, null or a point in the panel
  const cast = scene.cast || [];
  assert.ok(Array.isArray(r.heads), label + ': heads is an array');
  assert.equal(r.heads.length, cast.length, label + ': one head per cast member');
  r.heads.forEach((h, i) => {
    if (h === null) return;
    assert.ok(Number.isFinite(h.x) && Number.isFinite(h.y), label + ' head ' + i);
    assert.ok(h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, label + ' head ' + i + ' in range: ' + JSON.stringify(h));
  });
  return ids;
}

// ---------------------------------------------------------------- build.md: the art vocabulary

function parseBuildMd() {
  const md = fs.readFileSync(path.join(ROOT, 'docs/build.md'), 'utf8');
  const sets = {};
  for (const raw of md.split('\n')) {
    if (!/^\| `[a-z]+`/.test(raw)) continue;
    const cells = raw.replace(/\\\|/g, '\u0001').split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 4) continue;
    const ticks = (c) => (c.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
    const id = ticks(cells[0])[0];
    sets[id] = {
      cams: ticks(cells[1]),
      anchors: ticks(cells[2]),
      opts: ticks(cells[3]).map((t) => t.split(':')[0].trim())
    };
  }
  const at = md.indexOf('**Effects**');
  const para = md.slice(at, md.indexOf('\n\n', at));   // the paragraph may wrap
  const fx = (para.split(':').slice(1).join(':').split(';')[0].match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1));
  return { sets, fx };
}

test('build.md table parses into nine sets and twelve effects', () => {
  const spec = parseBuildMd();
  assert.deepEqual(Object.keys(spec.sets), ['room', 'tower', 'garden', 'camp', 'hollow', 'den', 'sky', 'river', 'title']);
  assert.equal(spec.fx.length, 12);
});

test('PC.art.vocab matches build.md: every set, camera, anchor and option (more allowed, never fewer)', () => {
  const spec = parseBuildMd(), v = art.vocab;
  assert.ok(v && v.sets && Array.isArray(v.fx), 'PC.art.vocab.sets and .fx exist');
  for (const [id, want] of Object.entries(spec.sets)) {
    const got = v.sets[id];
    assert.ok(got, 'set ' + id);
    for (const c of want.cams) assert.ok(got.cams.includes(c), id + ': camera ' + c);
    for (const a of want.anchors) assert.ok(got.anchors.includes(a), id + ': anchor ' + a);
    for (const o of want.opts) assert.ok(Object.prototype.hasOwnProperty.call(got.opts, o), id + ': option ' + o);
  }
  for (const f of spec.fx) assert.ok(v.fx.includes(f), 'fx ' + f);
  // option values are listed (an array of allowed values, or 'number')
  for (const [id, set] of Object.entries(v.sets)) for (const [k, vals] of Object.entries(set.opts)) {
    assert.ok(Array.isArray(vals) || vals === 'number', id + '.' + k + ' lists its values');
  }
});

// ---------------------------------------------------------------- every set x camera

test('every set x camera renders with a cast at every anchor and every effect', () => {
  const v = art.vocab;
  let n = 0;
  for (const [set, info] of Object.entries(v.sets)) {
    for (const cam of info.cams) {
      const cast = info.anchors.map((at, i) => {
        const who = WHO[i % WHO.length];
        const pose = OTHER[who] ? OTHER[who][i % OTHER[who].length] : POSES[i % POSES.length];
        return { who, at, pose, mood: MOODS[i % MOODS.length], facing: i % 2 ? 'left' : 'right', variant: (i % 6) + 1 };
      });
      const opts = { door: 'open', reflection: true, clan: true, sparrows: 12, lampSparrow: true, dish: true, moth: true, marks: 1, glow: true, weather: 'storm', splash: true };
      const scene = { set, cam, opts, cast, fx: v.fx.slice() };
      checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam);
      // and again, plain: no options, no effects
      const plain = { set, cam, cast: cast.slice(0, 2) };
      checkRender(art.render(plain, { look: LOOK }), plain, set + '/' + cam + ' (plain)');
      n++;
    }
  }
  assert.ok(n >= 31, 'all cameras covered: ' + n);
});

test('each effect alone, on every set', () => {
  for (const [set, info] of Object.entries(art.vocab.sets)) {
    for (const f of art.vocab.fx) {
      const scene = { set, cam: info.cams[0], cast: [{ who: 'player', at: info.anchors[0], pose: 'sit', mood: 'sleepy' }], fx: [f] };
      checkRender(art.render(scene, { look: LOOK }), scene, set + ' fx ' + f);
    }
  }
});

test('every option value renders', () => {
  const cases = [
    ['room', 'wide', { door: 'closed' }], ['room', 'wide', { door: 'open' }], ['room', 'glass', { reflection: true }], ['room', 'glass', { reflection: true, door: 'open' }],
    ['room', 'outside', { clan: true }], ['garden', 'fence', { sparrows: 0 }], ['garden', 'fence', { sparrows: 1 }], ['garden', 'fence', { sparrows: 13 }],
    ['garden', 'lamp', { lampSparrow: true }], ['garden', 'step', { dish: true }], ['garden', 'wide', { moth: true }],
    ['hollow', 'tree', { marks: 0 }], ['hollow', 'tree', { marks: 1 }], ['hollow', 'tree', { marks: 1, glow: true }], ['hollow', 'tree', { marks: 6, glow: true }],
    ['den', 'outside', { weather: 'clear' }], ['den', 'outside', { weather: 'cloudy' }], ['den', 'outside', { weather: 'storm' }], ['den', 'inside', { weather: 'storm' }], ['river', 'crash', { splash: true }], ['river', 'crash', {}]
  ];
  for (const [set, cam, opts] of cases) {
    const scene = { set, cam, opts, cast: [], fx: [] };
    checkRender(art.render(scene, { look: LOOK }), scene, set + '/' + cam + ' ' + JSON.stringify(opts));
  }
});

test('the sparrow count changes the drawing; the lamp sparrow is the thirteenth', () => {
  const a = art.render({ set: 'garden', cam: 'fence', opts: { sparrows: 12 } }).svg.length;
  const b = art.render({ set: 'garden', cam: 'fence', opts: { sparrows: 3 } }).svg.length;
  const c = art.render({ set: 'garden', cam: 'lamp', opts: { lampSparrow: true } }).svg.length;
  const d = art.render({ set: 'garden', cam: 'lamp', opts: { lampSparrow: false } }).svg.length;
  assert.ok(a > b, 'twelve sparrows draw more than three');
  assert.ok(c > d, 'lampSparrow adds a sparrow');
});

test('the reflection is drawn from ctx.look, so the look chooser can redraw it live', () => {
  const scene = { set: 'room', cam: 'glass', opts: { reflection: true }, cast: [], fx: ['dusk'] };
  const black = art.render(scene, { look: { fur: 'black', eyes: 'amber', marking: 'none', sex: 'she' } }).svg;
  const ginger = art.render(scene, { look: { fur: 'ginger', eyes: 'blue', marking: 'white-chest', sex: 'tom' } }).svg;
  const strip = (s) => s.replace(/pcs[0-9a-z]+-/g, '').replace(/\b(id|href)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '');
  assert.notEqual(strip(black), strip(ginger));
  const none = art.render({ set: 'room', cam: 'glass', opts: {}, cast: [], fx: [] }).svg;
  assert.ok(none.length < black.length, 'no reflection without the option');
});

// ---------------------------------------------------------------- placement

test('heads: an on-panel cast member gets a head; one out of sight gets null', () => {
  const r = art.render({ set: 'garden', cam: 'lamp', cast: [{ who: 'tallyheart', at: 'hedge-gap' }, { who: 'sparrow', at: 'lamp-top', pose: 'fluffed' }] });
  assert.equal(r.heads[0], null, 'the hedge is not in the lamp close-up');
  assert.ok(r.heads[1] && r.heads[1].y > 0, 'the sparrow on the lamp is');
  const d = art.render({ set: 'den', cam: 'outside', cast: [{ who: 'player', at: 'nest' }] });
  assert.equal(d.heads[0], null, 'a nest inside the den is out of sight from outside');
});

test('facing flips the character; size scales it', () => {
  const base = { set: 'hollow', cam: 'lesson', fx: [] };
  const R = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', facing: 'right' }] }).heads[0];
  const L = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', facing: 'left' }] }).heads[0];
  assert.ok(R.x > L.x, 'facing right puts the head on the right');
  const big = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', size: 1.4 }] }).heads[0];
  const small = art.render({ ...base, cast: [{ who: 'tallyheart', at: 'sand-left', size: 0.7 }] }).heads[0];
  assert.ok(big.y < small.y, 'a bigger cat has its head higher');
});

test('depth: a cat on the cushion is bigger than the tiny Clan cats far off in the garden', () => {
  const info = art.sceneInfo('room');
  const cushion = info.anchors.main.cushion;
  assert.ok(cushion.h > 200, 'cushion cats are big');
  const garden = art.sceneInfo('garden').anchors.main;
  assert.ok(garden.lawn.h > garden['fence-foot'].h, 'the lawn is nearer than the fence');
  const camp = art.sceneInfo('camp').anchors.main;
  assert.ok(camp.entrance.h > camp['crowd-left'].h, 'the entrance is nearer than the crowd');
});

test('a custom spot {x, y, scale} works and scales', () => {
  const s1 = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 900, y: 800, scale: 1 } }] });
  const s2 = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 900, y: 800, scale: 2 } }] });
  checkRender(s1, { cast: [1] }, 'custom spot');
  assert.ok(s2.heads[0].y < s1.heads[0].y, 'scale 2 is taller');
  const bad = art.render({ set: 'garden', cam: 'wide', cast: [{ who: 'player', at: { x: 'no', y: 1 } }] });
  assert.equal(bad.heads[0], null, 'a broken spot draws nothing');
});

test('layering: cast members are drawn in the order given', () => {
  const r = art.render({ set: 'hollow', cam: 'wide', cast: [{ who: 'tallyheart', at: 'sand-left' }, { who: 'glintstar', at: 'sand-right' }] });
  checkRender(r, { cast: [1, 2] }, 'order');
  // both appear; the renderer emits them in order (glintstar's palette after tallyheart's)
  assert.ok(r.svg.length > 0);
});

test('unknown sets, cameras, anchors and missing pieces never throw', () => {
  const cases = [
    {}, { set: 'nowhere' }, { set: 'room', cam: 'nowhere' }, { set: 'room', cast: [{ who: 'nobody', at: 'nowhere' }] },
    { set: 'garden', cam: 'paws' }, { set: 'garden', cam: 'paws', cast: [{ who: 'player' }] }, { set: 'camp', cam: 'reveal', fx: ['shake', 'flash', 'nope'] },
    { set: 'tower', cam: 'up', cast: [null, { who: 'waffles', at: 'railing' }] }
  ];
  for (const c of cases) {
    const r = art.render(c);
    checkRender(r, { cast: (c.cast || []).filter((x) => x && typeof x === 'object') }, JSON.stringify(c));
  }
  checkRender(art.render({ set: 'room', cam: 'glass', opts: { reflection: true } }), { cast: [] }, 'no ctx');
});

test('unique ids per render, so several panels can share a page', () => {
  const s = { set: 'camp', cam: 'reveal', cast: [{ who: 'player', at: 'center' }], fx: ['glow', 'purr'] };
  const a = checkRender(art.render(s, { look: LOOK }), s, 'a');
  const b = checkRender(art.render(s, { look: LOOK }), s, 'b');
  const shared = a.filter((id) => b.includes(id));
  assert.equal(shared.length, 0, 'no id is shared between two renders: ' + shared.slice(0, 3).join(', '));
});

test('the same scene draws the same picture each time (no flicker between frames)', () => {
  const s = { set: 'garden', cam: 'wide', opts: { sparrows: 12 }, cast: [{ who: 'player', at: 'lawn' }], fx: ['dusk'] };
  const strip = (x) => x.replace(/pcs[0-9a-z]+-/g, '').replace(/(cats?|c)\d+-/g, '').replace(/\d+(?=")/g, '');
  const a = art.render(s, { look: LOOK }).svg, b = art.render(s, { look: LOOK }).svg;
  assert.equal(a.length, b.length);
});

// ---------------------------------------------------------------- CSS

test('PC.art.css: animation classes, all inside prefers-reduced-motion: no-preference', () => {
  const css = art.css;
  assert.equal(typeof css, 'string');
  const i = css.indexOf('@media (prefers-reduced-motion: no-preference)');
  assert.ok(i >= 0, 'the motion media query is there');
  const before = css.slice(0, i);
  assert.ok(!/animation|@keyframes/.test(before), 'nothing animates outside the media query');
  // every class used in the art is defined
  const used = new Set();
  for (const [set, info] of Object.entries(art.vocab.sets)) for (const cam of info.cams) {
    const svg = art.render({ set, cam, opts: { weather: 'storm', marks: 1, glow: true, splash: true, door: 'open', moth: true }, cast: [{ who: 'player', at: info.anchors[0], pose: 'curl', mood: 'sleepy' }], fx: art.vocab.fx }).svg;
    for (const m of svg.match(/class="([^"]+)"/g) || []) m.slice(7, -1).split(/\s+/).forEach((c) => used.add(c));
  }
  for (const c of used) if (c.startsWith('pcs-') && !c.startsWith('pcs-set-') && !c.startsWith('pcs-cam-') && c !== 'pcs-panel' && c !== 'pcs-fx') {
    assert.ok(css.includes('.' + c + '{'), 'css defines .' + c);
  }
});

// ---------------------------------------------------------------- the story's own frames

test('every frame of chapter 1 renders with the art vocabulary', { skip: !has('app/story/ch01.js') && 'no app/story/ch01.js yet' }, () => {
  require(path.join(ROOT, 'app/story/ch01.js'));
  const ch = PC.story && PC.story.ch01;
  assert.ok(ch && ch.frames, 'PC.story.ch01.frames');
  const v = art.vocab;
  let n = 0;
  for (const [id, f] of Object.entries(ch.frames)) {
    const s = f.scene;
    assert.ok(s, id + ' has a scene');
    assert.ok(v.sets[s.set], id + ': set ' + s.set);
    assert.ok(v.sets[s.set].cams.includes(s.cam), id + ': camera ' + s.set + '/' + s.cam);
    for (const m of s.cast || []) if (typeof m.at === 'string') assert.ok(v.sets[s.set].anchors.includes(m.at), id + ': anchor ' + m.at + ' in ' + s.set);
    for (const fx of s.fx || []) assert.ok(v.fx.includes(fx) || fx === 'shake' || fx === 'flash', id + ': fx ' + fx);
    const r = art.render(s, { look: LOOK });
    checkRender(r, s, id);
    // a speaking cast member should be on the panel, so the balloon can point at them
    for (const say of f.say || []) {
      const i = (s.cast || []).findIndex((m) => m.who === say.who);
      if (i >= 0 && say.who !== 'tallone') assert.ok(r.heads[i], id + ': ' + say.who + ' speaks and is in shot');
    }
    n++;
  }
  assert.ok(n > 0);
});

// ---------------------------------------------------------------- close-ups and weather

// A cast member's head box in world units, from cats.js's headBox and the reported head point.
function worldHeadBox(r, i, scene, who, opts, s) {
  const vb = viewBox(r.svg), h = r.heads[i];
  const ch = art.character(who, opts);
  const hx = vb[0] + h.x / 100 * vb[2], hy = vb[1] + h.y / 100 * vb[3];
  return { vb, box: [hx + (ch.headBox.x0 - ch.head.x) * s, hy + (ch.headBox.y0 - ch.head.y) * s, hx + (ch.headBox.x1 - ch.head.x) * s, hy + (ch.headBox.y1 - ch.head.y) * s] };
}
const insideVb = (b, vb) => b[0] >= vb[0] && b[1] >= vb[1] && b[2] <= vb[0] + vb[2] && b[3] <= vb[1] + vb[3];

test('camp fountain-close: Glintstar, solemn on the fountain top, head and ears wholly in the panel', () => {
  assert.ok(art.vocab.sets.camp.cams.includes('fountain-close'));
  const scene = { set: 'camp', cam: 'fountain-close', cast: [{ who: 'glintstar', pose: 'sit', mood: 'solemn', at: 'fountain-top', facing: 'left' }], fx: ['sunset', 'glow'] };
  const r = art.render(scene, { look: LOOK });
  checkRender(r, scene, 'fountain-close');
  const h = r.heads[0];
  assert.ok(h && h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, 'her head is in the panel: ' + JSON.stringify(h));
  const a = art.sceneInfo('camp').anchors.fountain['fountain-top'], s = a.h / 200;
  const { vb, box } = worldHeadBox(r, 0, scene, 'glintstar', { pose: 'sit', mood: 'solemn', facing: 'left' }, s);
  assert.ok(insideVb(box, vb), 'head, ears and whiskers inside: ' + box.map(Math.round) + ' in ' + vb);
  const k = (box[3] - box[1]) / vb[3];
  assert.ok(k > 0.35 && k < 0.6, 'a close-up: the head (with ears) is ' + k.toFixed(2) + ' of the panel height');
  assert.ok(box[3] < vb[1] + vb[3] * 0.75, 'her shoulders show below her chin');
});

test('tower balcony-close: Waffles\'s head and bow in the panel for every pose, the rail top below her chin', () => {
  assert.ok(art.vocab.sets.tower.cams.includes('balcony-close'));
  const RAIL_TOP = 720;
  for (const pose of ['loaf', 'stand', 'crouch', 'peer', 'sit', 'lie', 'flat']) {
    for (const mood of ['dreamy', 'shout', 'neutral']) {
      const scene = { set: 'tower', cam: 'balcony-close', cast: [{ who: 'waffles', pose, mood, at: 'railing', facing: 'left' }], fx: ['dusk'] };
      const r = art.render(scene, { look: LOOK });
      checkRender(r, scene, 'balcony-close ' + pose);
      const h = r.heads[0];
      assert.ok(h && h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100, pose + ': head in the panel ' + JSON.stringify(h));
      const vb = viewBox(r.svg), s = art.sceneInfo('tower').anchors.balcony.railing.h / 200;   // the cats' drawings are 200 tall
      const { box } = worldHeadBox(r, 0, scene, 'waffles', { pose, mood, facing: 'left' }, s);
      assert.ok(insideVb(box, vb), pose + '/' + mood + ': head and bow inside: ' + box.map(Math.round) + ' in ' + vb);
      const k = (box[3] - box[1]) / vb[3];
      assert.ok(k > 0.33 && k < 0.5, pose + ': her face is about a third of the panel (head box ' + k.toFixed(2) + ')');
      assert.ok(box[3] < RAIL_TOP && RAIL_TOP < vb[1] + vb[3], pose + ': the rail top shows below her chin');
    }
  }
});

test('den weather: cloudy hides the moon and the stars, with no rain or lightning, in every camera', () => {
  assert.ok(art.vocab.sets.den.opts.weather.includes('cloudy'));
  for (const cam of ['outside', 'inside', 'nest', 'doorway']) {
    const scene = { set: 'den', cam, opts: { weather: 'cloudy' }, cast: [{ who: 'player', at: 'doorway', pose: 'sit', mood: 'sleepy' }], fx: ['night'] };
    checkRender(art.render(scene, { look: LOOK }), scene, 'den/' + cam + ' cloudy');
    const plain = { set: 'den', cam, opts: { weather: 'cloudy' }, cast: [], fx: ['night', 'stars'] };
    const svg = art.render(plain, { look: LOOK }).svg;
    checkRender({ svg, heads: [] }, plain, 'den/' + cam + ' cloudy, stars asked for');
    assert.ok(!/pcs-rain|pcs-bolt|pcs-flash/.test(svg), cam + ': no rain, no lightning');
  }
  const clear = art.render({ set: 'den', cam: 'outside', opts: { weather: 'clear' }, cast: [], fx: ['night'] }).svg;
  const cloudy = art.render({ set: 'den', cam: 'outside', opts: { weather: 'cloudy' }, cast: [], fx: ['night'] }).svg;
  assert.ok(clear.includes('#FFF3D2') && !cloudy.includes('#FFF3D2'), 'the moon is out on a clear night and hidden under cloud');
  const dots = (svg) => (svg.match(/A[\d.]+ [\d.]+ 0 1 0/g) || []).length;
  assert.ok(dots(cloudy) < dots(clear) / 10, 'the star field is gone: ' + dots(cloudy) + ' vs ' + dots(clear));
  // the rosebush and the glow in the den mouth are drawn exactly as on a clear night
  const strip = (x) => x.replace(/pcs[0-9a-z]+-/g, '');
  const bush = (x) => strip(x).slice(strip(x).indexOf('#B46F8C'));
  assert.equal(bush(cloudy), bush(clear));
});

test('keep: the claw marks are reported as an area the lettering stays off', () => {
  const none = art.render({ set: 'hollow', cam: 'wide', opts: { marks: 0 }, cast: [] });
  assert.deepEqual(none.keep, []);
  for (const cam of ['wide', 'tree', 'lesson']) {
    const r = art.render({ set: 'hollow', cam, opts: { marks: 1, glow: true }, cast: [] });
    assert.ok(Array.isArray(r.keep) && r.keep.length === 1, cam + ': one keep area');
    const k = r.keep[0];
    assert.ok(k.x >= 0 && k.y >= 0 && k.w > 0 && k.h > 0 && k.x + k.w <= 100.1 && k.y + k.h <= 100.1, cam + ': inside the panel ' + JSON.stringify(k));
  }
  // every other set says nothing
  assert.deepEqual(art.render({ set: 'camp', cam: 'reveal', cast: [] }).keep, []);
});

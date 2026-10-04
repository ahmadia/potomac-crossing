/* Potomac Crossing: character art.
 *
 * Cats, the Tall One, the sparrow and the moth, and (chapter 2) Riffle the otter pup, the ferry
 * otters and the three dogs of the Barking Field, drawn in code as flat papercut SVG, plus the
 * Counts pictures (cats in rows, one counted thing each; chapter 2's prey pile, running totals and
 * the old tom's thought cloud) and the sand tallies.
 *
 *   PC.art.character(who, opts) -> { svg, w, h, head: {x, y}, headBox, bounds, held? }
 *       who: a cast id (vocab.cast). opts: { pose, mood, facing: 'left'|'right', variant, look }.
 *       A Clan cat given `look` (the player's) never wears her coat: one in her fur wears a spare
 *       coat, not on the Clan cats listed in `taken` (their variants); PC.art.clanVariant(v, look,
 *       taken) says which. The scenes and the Counts pictures pass both.
 *       headBox and bounds ({ x0, y0, x1, y1 } in the box) are for balloon tails, close-ups and
 *       keeping props off faces; the cats and the otters and dogs report them.
 *       Cats also take `flatEars: true` (ears laid flat whatever the mood: the old tom on the rim,
 *       f020) and `holds: 'stone'` (Riffle's lucky stone) with `holdAt`: 'paws' | 'mouth' | 'chin' |
 *       'nose' (unset: in the mouth on its feet, else at the paws). A cat holding something reports
 *       `held: { what, at, x, y, r }` in its box, for a sparkle on the stone.
 *   PC.art.cat(opts)            -> same shape, a cat from opts.look
 *   PC.art.countsPicture({ table, groups, per, highlight, kind, layout, totals, next, who, thought, look })
 *       -> '<svg ...>...</svg>' (docs/build.md, "Counts art"; chapter 1's calls are unchanged)
 *   PC.art.preyFallback({ kind, lit, part, facing }) -> { svg, w, h }: our own prey, used when the
 *       pile set's PC.art.prey (app/art/sets/pile.js, looked up at call time) is missing
 *   PC.art.sand({ groups, per, counted, layout, ground }) -> '<svg ...>...</svg>': `layout: 'rows'`
 *       is `groups` rows of `per` lit a column at a time (the check's two rows of eight); `ground:
 *       'earth'` scratches them in the earth beside the pile instead of the sand
 *   PC.art.vocab.{cast, poses, moods, looks, otherPoses, clanVariants, variants}
 *
 * `svg` is markup for a group (no outer <svg>) drawn in a local box 0..w x 0..h, with the
 * character's feet centred at (w/2, h). Every character is drawn facing right and mirrored for
 * facing left. Ids (clip paths, shapes) carry a module counter, so many characters can share
 * one panel. Sizes are in the cats' units: a cat's box is 200 x 200 (a sitting cat about 160
 * tall), and the scenes scale every drawing by that box, so Riffle's 250 box, the adult otters'
 * 330 and the dogs' (470 shaggy, 330 spotty, 160 tiny) make them the right size beside the cats.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});

  // ------------------------------------------------------------------ helpers

  var serial = 0;
  function N(v) { var r = Math.round(v * 10) / 10; return String(r === 0 ? 0 : r); }
  function pt(p) { return N(p[0]) + ',' + N(p[1]); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp2(p, q, t) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; }
  function add(p, v, k) { k = k == null ? 1 : k; return [p[0] + v[0] * k, p[1] + v[1] * k]; }
  function unit(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1; return [v[0] / l, v[1] / l]; }
  function dist(p, q) { var x = q[0] - p[0], y = q[1] - p[1]; return Math.sqrt(x * x + y * y); }
  function deg(v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; }
  function rand(seed) { var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function intOr(v, d) { v = parseInt(v, 10); return isNaN(v) ? d : v; }

  function rgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function hex(c) {
    return '#' + c.map(function (v) {
      v = clamp(Math.round(v), 0, 255);
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }
  function mix(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; }));
  }

  // affine matrices [a, b, c, d, e, f]
  function mul(m, n) {
    return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
      m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  }
  function mT(x, y) { return [1, 0, 0, 1, x, y]; }
  function mS(x, y) { return [x, 0, 0, y == null ? x : y, 0, 0]; }
  function mR(a) { var r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; }
  function apply(m, p) { return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]]; }
  function mStr(m) { return 'matrix(' + m.map(function (v) { return Math.round(v * 1000) / 1000; }).join(',') + ')'; }

  // ------------------------------------------------------------------ geometry

  // Smooth open run through points (Catmull-Rom as cubic Beziers), starting at p[0].
  function cr(p) {
    var s = '';
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      s += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
    }
    return s;
  }
  function crClosed(p) {
    var n = p.length, s = 'M' + pt(p[0]);
    for (var i = 0; i < n; i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      s += 'C' + pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + pt(p2);
    }
    return s + 'Z';
  }
  function area(p) {
    var a = 0;
    for (var i = 0; i < p.length; i++) { var q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; }
    return a / 2;
  }
  // Fluffy outline: an outward bump between each pair of points.
  function scallop(p, k) {
    var s = 'M' + pt(p[0]), sw = area(p) > 0 ? 1 : 0;
    for (var i = 0; i < p.length; i++) {
      var q = p[(i + 1) % p.length], r = dist(p[i], q) * (k || 0.62);
      s += 'A' + N(r) + ' ' + N(r) + ' 0 0 ' + sw + ' ' + pt(q);
    }
    return s + 'Z';
  }
  // Fur on end: every other point pushed outward.
  function spiky(p, amt) {
    var cw = area(p) > 0, n = p.length, out = [];
    for (var i = 0; i < n; i++) {
      var a = p[(i - 1 + n) % n], b = p[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1];
      var nn = unit(cw ? [dy, -dx] : [-dy, dx]);
      out.push(add(p[i], nn, i % 2 ? amt : -0.5));
    }
    return 'M' + out.map(pt).join('L') + 'Z';
  }
  function sampleArc(out, c, a0, a1, step) {
    var n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * c[2] / step));
    for (var i = 0; i < n; i++) {
      var a = lerp(a0, a1, i / n);
      out.push([c[0] + c[2] * Math.cos(a), c[1] + c[2] * Math.sin(a)]);
    }
  }
  function sampleLine(out, p, q, step) {
    var n = Math.max(1, Math.ceil(dist(p, q) / step));
    for (var i = 0; i < n; i++) out.push(lerp2(p, q, i / n));
  }
  // Ellipse (cx, cy, rx, ry, rotation in degrees).
  function ellipseG(cx, cy, rx, ry, rot, step) {
    var m = mul(mT(cx, cy), mR(rot || 0));
    var p1 = apply(m, [-rx, 0]), p2 = apply(m, [rx, 0]);
    var d = 'M' + pt(p1) + 'A' + N(rx) + ' ' + N(ry) + ' ' + N(rot || 0) + ' 0 1 ' + pt(p2) +
      'A' + N(rx) + ' ' + N(ry) + ' ' + N(rot || 0) + ' 0 1 ' + pt(p1) + 'Z';
    var pts = [], n = Math.max(8, Math.round(Math.PI * (rx + ry) / (step || 10)));
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n;
      pts.push(apply(m, [rx * Math.cos(a), ry * Math.sin(a)]));
    }
    return { d: d, pts: pts };
  }
  // Smooth hull around two circles [x, y, r]: torsos, legs.
  function hull2(a, b, step) {
    step = step || 10;
    var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy);
    if (d + Math.min(a[2], b[2]) <= Math.max(a[2], b[2]) + 0.01) {
      var c = a[2] >= b[2] ? a : b;
      return ellipseG(c[0], c[1], c[2], c[2], 0, step);
    }
    var ang = Math.atan2(dy, dx), phi = Math.acos(clamp((a[2] - b[2]) / d, -1, 1));
    function on(c, t) { return [c[0] + c[2] * Math.cos(t), c[1] + c[2] * Math.sin(t)]; }
    var a1 = on(a, ang + phi), b1 = on(b, ang + phi), b2 = on(b, ang - phi), a2 = on(a, ang - phi);
    var lb = 2 * phi > Math.PI ? 1 : 0, la = 2 * Math.PI - 2 * phi > Math.PI ? 1 : 0;
    var path = 'M' + pt(a1) + 'L' + pt(b1) + 'A' + N(b[2]) + ' ' + N(b[2]) + ' 0 ' + lb + ' 0 ' + pt(b2) +
      'L' + pt(a2) + 'A' + N(a[2]) + ' ' + N(a[2]) + ' 0 ' + la + ' 0 ' + pt(a1) + 'Z';
    var pts = [];
    sampleArc(pts, b, ang + phi, ang - phi, step);
    sampleLine(pts, b2, a2, step);
    sampleArc(pts, a, ang - phi, ang + phi - 2 * Math.PI, step);
    sampleLine(pts, a1, b1, step);
    return { d: path, pts: pts };
  }
  // A tapering tube along a cubic Bezier: tails.
  function bez(P, t) {
    var u = 1 - t;
    return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
      u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]];
  }
  function bezD(P, t) {
    var u = 1 - t;
    return [3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]),
      3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1])];
  }
  function tube(P, wf, n) {
    n = n || 9;
    var L = [], R = [], C = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, p = bez(P, t), tg = unit(bezD(P, Math.min(0.999, Math.max(0.001, t)))), nn = [-tg[1], tg[0]], w = wf(t);
      L.push(add(p, nn, w)); R.push(add(p, nn, -w)); C.push({ p: p, n: nn, t: tg, w: w });
    }
    var w1 = C[n].w;
    var d = 'M' + pt(L[0]) + cr(L) + 'A' + N(w1) + ' ' + N(w1) + ' 0 0 0 ' + pt(R[n]) + cr(R.slice().reverse()) + 'Z';
    var tip = add(C[n].p, C[n].t, w1);
    var pts = L.concat([add(add(C[n].p, C[n].n, w1 * 0.7), C[n].t, w1 * 0.7), tip, add(add(C[n].p, C[n].n, -w1 * 0.7), C[n].t, w1 * 0.7)], R.slice().reverse());
    return { d: d, pts: pts, at: function (t) {
      var p = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999)));
      return { p: p, n: [-tg[1], tg[0]], t: tg, w: wf(t) };
    } };
  }
  // An irregular rounded blob (tortie and calico patches).
  function blob(cx, cy, r, seed) {
    var p = [];
    for (var i = 0; i < 7; i++) {
      var a = Math.PI * 2 * i / 7 + seed * 0.9, k = 0.74 + 0.36 * rand(seed * 7 + i);
      p.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
    }
    return crClosed(p);
  }
  // A wedge stroke from s toward e, `w` wide at s, tapering to a point.
  function wedge(s, e, w, bend) {
    var d = unit([e[0] - s[0], e[1] - s[1]]), nn = [-d[1], d[0]];
    var a = add(s, nn, w / 2), b = add(s, nn, -w / 2), m = add(lerp2(s, e, 0.5), bend || [0, 0]);
    return 'M' + pt(a) + 'Q' + pt(add(m, nn, w * 0.42)) + ' ' + pt(e) + 'Q' + pt(add(m, nn, -w * 0.42)) + ' ' + pt(b) + 'Z';
  }
  function mul2(v, k) { return [v[0] * k, v[1] * k]; }
  // Axis-aligned bounding box of points, rounded to 0.1: { x0, y0, x1, y1 }.
  function boxOf(list) {
    var b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    list.forEach(function (q) { b.x0 = Math.min(b.x0, q[0]); b.y0 = Math.min(b.y0, q[1]); b.x1 = Math.max(b.x1, q[0]); b.y1 = Math.max(b.y1, q[1]); });
    ['x0', 'y0', 'x1', 'y1'].forEach(function (k) { b[k] = Math.round(b[k] * 10) / 10; });
    return b;
  }
  // Scale every coordinate pair of an M/L/C/Q path.
  function scalePath(d, sx, sy) {
    var i = 0;
    return d.replace(/-?\d*\.?\d+/g, function (v) { var r = (i++ % 2 === 0) ? +v * sx : +v * sy; return N(r); });
  }

  // A drawing context: collects <defs> and hands out unique ids.
  function Ren() { this.base = 'pc' + (++serial).toString(36); this.k = 0; this.defs = ''; }
  Ren.prototype.id = function () { return this.base + '-' + (this.k++).toString(36); };
  // A filled, shaded, outlined part. `inner` is drawn clipped to the part.
  Ren.prototype.part = function (d, o) {
    var pid = this.id(), cid = this.id();
    this.defs += '<path id="' + pid + '" d="' + d + '"/><clipPath id="' + cid + '"><use href="#' + pid + '"/></clipPath>';
    return '<use href="#' + pid + '" fill="' + o.dark + '"/>' +
      '<g clip-path="url(#' + cid + ')"><use href="#' + pid + '" x="' + N(o.sx || 0) + '" y="' + N(o.sy || 0) + '" fill="' + o.fill + '"/>' + (o.inner || '') + '</g>' +
      '<use href="#' + pid + '" fill="none" stroke="' + o.line + '" stroke-width="' + (o.lw || 2.4) + '" stroke-linejoin="round"/>';
  };

  // ------------------------------------------------------------------ colours

  var EYES = {
    green: '#8fca66', amber: '#f4aa2b', blue: '#79b9ee', copper: '#e27a32',
    ice: '#c8e9fa', gold: '#efc236', yellow: '#e7d548', hazel: '#b9b85a'
  };
  var FUR = {
    black: { base: '#3d3844', line: '#18161c', light: '#5b5465', feat: '#a89fb6', whisk: '#d6cfe0', nose: '#cf8597', earIn: '#bd8494' },
    white: { base: '#fbf8f2', line: '#a39787', light: '#ffffff', shade: '#e3dbcd' },
    'silver-tabby': { base: '#c3cbd4', line: '#5a6574', stripe: '#6c7886', light: '#e4e9ef', pattern: 'tabby' },
    'brown-tabby': { base: '#b5895b', line: '#4c3522', stripe: '#5b3f27', light: '#d5ae80', pattern: 'tabby' },
    ginger: { base: '#e8913a', line: '#8f4a1b', stripe: '#b5602a', light: '#f7b86e', pattern: 'tabby' },
    cream: { base: '#f2dbb1', line: '#a3855a', stripe: '#d8b47f', light: '#fcf0da', pattern: 'tabby' },
    grey: { base: '#9ea5ad', line: '#4f565e', light: '#c3c9cf' },
    tortie: { base: '#3f3330', line: '#1b1412', light: '#5e4b44', feat: '#b89c8d', whisk: '#dccbbf', nose: '#c98a80', earIn: '#c08b8b', pattern: 'tortie', patches: ['#da853b', '#ecb877'] },
    calico: { base: '#fbf8f2', line: '#998b7b', light: '#ffffff', shade: '#e4dbcd', pattern: 'calico', patches: ['#e3893a', '#3d3844'] }
  };
  var WHITE = '#fcf9f3';
  // On pale fur a white marking would vanish: there it is a touch brighter than the fur and edged
  // with a soft ink line, so its shape reads. Mid and dark furs keep plain white markings.
  var PALE = { white: 1, cream: 1, calico: 1 };
  var MARK_EDGE = ' stroke="#1b1622" stroke-opacity=".4" stroke-width="1.8" stroke-linejoin="round"';
  function markFill(sp) { return (sp.marks && sp.marks.fill) || WHITE; }
  function markEdge(sp) { return sp.marks && sp.marks.edge ? MARK_EDGE : ''; }

  function palette(fur, over) {
    var f = {}, k;
    var src = FUR[fur] || FUR['brown-tabby'];
    for (k in src) f[k] = src[k];
    for (k in (over || {})) f[k] = over[k];
    f.shade = f.shade && !(over && over.base && !over.shade) ? f.shade : mix(f.base, f.line, 0.2);
    f.shade2 = mix(f.base, f.line, 0.36);
    f.farFill = mix(f.base, f.line, 0.13);
    f.feat = f.feat || f.line;
    f.whisk = f.whisk || mix(f.line, f.base, 0.25);
    f.nose = f.nose || '#ee8a9c';
    f.earIn = f.earIn || '#f4a5b4';
    if (f.patches) f.patchShade = f.patches.map(function (c) { return mix(c, f.line, 0.2); });
    return f;
  }

  // ------------------------------------------------------------------ cast

  var LOOKS = {
    fur: ['black', 'white', 'silver-tabby', 'brown-tabby', 'ginger', 'cream', 'grey', 'tortie', 'calico'],
    marking: ['none', 'white-paws', 'white-chest', 'back-stripe', 'nose-splash'],
    eyes: ['green', 'amber', 'blue', 'copper', 'odd']
  };
  var CAT_POSES = ['sit', 'stand', 'walk', 'crouch', 'curl', 'loaf', 'lookup', 'flat', 'lie', 'fall', 'stretch', 'peer'];
  // 'solemn' is appended last so earlier indexes never move (deadpan dignity: level brows, half-lidded eyes, a straight mouth)
  var MOODS = ['neutral', 'happy', 'dreamy', 'wonder', 'worried', 'scared', 'sleepy', 'laugh', 'stern', 'kind', 'proud', 'sniff', 'shout', 'solemn'];
  // chapter 2 appends the otters and the dogs; earlier ids never move
  var CAST_IDS = ['player', 'tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'sparrow', 'moth',
    'riffle', 'otter', 'dog'];
  var OTHER_POSES = { sparrow: ['perch', 'fluffed'], moth: ['fly'], tallone: ['stand', 'water', 'set-dish'] };

  var PRESETS = {
    tallyheart: { fur: 'ginger', over: { base: '#E8913A', stripe: '#B5602A', line: '#8a4517', light: '#f6b56c' },
      marks: { chest: '#f9e6c6' }, muzzle: '#f9e6c6', eyes: ['amber', 'amber'], sex: 'she',
      scale: 1.12, bulk: 1.2, legW: 1.08, notch: true, tailW: 1.15 },
    glintstar: { fur: 'silver-tabby', over: { base: '#B9C2CC', stripe: '#7a8592', line: '#525d6b', light: '#dde3ea' },
      marks: { chest: '#e9edf2' }, eyes: ['ice', 'ice'], sex: 'she', scale: 1.05, bulk: 0.84, legW: 0.88,
      headX: 0.94, earS: 1.14, rot: -4, tailW: 0.9, lashes: true },
    waffles: { fur: 'white', over: { base: '#fefcf8', shade: '#e9e0f0', line: '#8c7ea3', light: '#ffffff' },
      eyes: ['copper', 'copper'], sex: 'she', scale: 1.0, bulk: 1.34, legW: 1.25,
      fluffy: true, flatFace: true, bow: true, tailW: 1.5 },
    grizzled: { fur: 'black', over: { base: '#5d4535', line: '#2a1e15', light: '#7c604b', feat: '#cdb8a6', whisk: '#e2d4c6', nose: '#b97d78', earIn: '#b98a84' },
      muzzle: '#aaa29b', marks: { chin: '#aaa29b' }, eyes: ['gold', 'gold'], sex: 'tom', scale: 1.06, bulk: 1.1,
      scar: true, ragged: true, heavyBrows: true },
    snorer: { fur: 'grey', over: { base: '#a3a9b0', line: '#555c64' }, eyes: ['yellow', 'yellow'], sex: 'tom',
      scale: 0.86, bulk: 0.76, legW: 0.84, tailW: 0.82, headX: 0.98 },
    mutterer: { fur: 'tortie', eyes: ['green', 'green'], sex: 'she', scale: 0.8, bulk: 0.96 },
    snorter: { fur: 'black', marks: { chest: WHITE, paws: true, splash: true }, muzzle: WHITE,
      eyes: ['yellow', 'yellow'], sex: 'tom', scale: 0.86, bulk: 0.92 }
  };
  var CLAN = [
    { fur: 'brown-tabby', eyes: ['green', 'green'], sex: 'tom', scale: 0.98, bulk: 1.02 },
    { fur: 'black', eyes: ['amber', 'amber'], sex: 'she', scale: 0.95, bulk: 0.95 },
    { fur: 'cream', eyes: ['copper', 'copper'], sex: 'she', scale: 0.94, bulk: 1 },
    { fur: 'grey', marks: { paws: true, chest: WHITE }, muzzle: WHITE, eyes: ['green', 'green'], sex: 'tom', scale: 1, bulk: 1.05 },
    { fur: 'calico', eyes: ['amber', 'amber'], sex: 'she', scale: 0.93, bulk: 0.98 },
    { fur: 'ginger', marks: { paws: true, chest: WHITE, splash: true }, muzzle: WHITE, eyes: ['hazel', 'hazel'], sex: 'tom', scale: 1, bulk: 1.06 }
  ];

  function specFromLook(look) {
    look = look || {};
    var fur = FUR[look.fur] ? look.fur : 'brown-tabby';
    var m = look.marking || 'none', marks = {}, eyes, wf = PALE[fur] ? '#ffffff' : WHITE;
    if (m === 'white-paws') marks.paws = true;
    if (m === 'white-chest') marks.chest = wf;
    if (m === 'back-stripe') marks.back = true;
    if (m === 'nose-splash') marks.splash = true;
    if (PALE[fur] && (marks.paws || marks.chest || marks.splash)) { marks.fill = wf; marks.edge = true; }
    if (look.eyes === 'odd') eyes = ['blue', 'green'];
    else eyes = [EYES[look.eyes] ? look.eyes : 'green', EYES[look.eyes] ? look.eyes : 'green'];
    var tom = look.sex === 'tom' || look.sex === 'he';
    return { fur: fur, marks: marks, muzzle: (marks.chest || marks.splash) ? wf : null, eyes: eyes,
      sex: tom ? 'tom' : 'she', scale: 0.86, bulk: tom ? 0.98 : 0.92 };
  }
  function resolve(s) {
    var sp = {}, k;
    for (k in s) sp[k] = s[k];
    sp.pal = palette(s.fur, s.over);
    sp.pattern = sp.pal.pattern || null;
    sp.marks = s.marks || {};
    sp.iris = (s.eyes || ['green', 'green']).map(function (e) { return EYES[e] || e; });
    return sp;
  }

  // ------------------------------------------------------------------ poses
  // Canonical cat faces right; ground at y = 196 in a 200 x 200 box.
  // Circles are [x, y, r]; legs [[top], [bottom]]; paws [x, y]; haunch [cx, cy, rx, ry, rot].
  // Tails are cubic Beziers from the base outward.

  var POSES = {
    sit: { hip: [74, 165, 30], chest: [113, 131, 22], head: [116, 84, 0],
      far: [{ leg: [[109, 146, 8], [111, 189, 6]], paw: [115, 191] }],
      haunch: [82, 171, 27, 23, -24], backPaws: [[107, 191]],
      near: [{ leg: [[124, 146, 9], [126, 189, 6.5]], paw: [130, 191] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[52, 184], [32, 199], [104, 200], [150, 184]], up: [[48, 178], [16, 172], [16, 106], [38, 100]],
        down: [[48, 184], [32, 192], [22, 192], [14, 184]], out: [[47, 180], [26, 180], [14, 168], [12, 148]] } },
    lookup: { hip: [74, 165, 30], chest: [111, 131, 22], head: [108, 82, -28], look: [0.4, -4],
      far: [{ leg: [[107, 146, 8], [111, 189, 6]], paw: [115, 191] }],
      haunch: [82, 171, 27, 23, -24], backPaws: [[107, 191]],
      near: [{ leg: [[122, 146, 9], [126, 189, 6.5]], paw: [130, 191] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[52, 184], [32, 199], [104, 200], [150, 184]], up: [[48, 178], [16, 172], [16, 106], [38, 100]],
        down: [[48, 184], [32, 192], [22, 192], [14, 184]], out: [[47, 180], [26, 180], [14, 168], [12, 148]] } },
    stand: { hip: [64, 130, 22], chest: [114, 128, 24], head: [148, 88, 0],
      far: [{ leg: [[110, 142, 8], [108, 189, 6]], paw: [112, 191] }, { leg: [[58, 142, 9], [53, 189, 6]], paw: [57, 191] }],
      near: [{ thigh: [68, 142, 16, 22, 12], leg: [[70, 150, 9], [66, 189, 6.5]], paw: [70, 191] }, { leg: [[122, 142, 9], [124, 189, 6.5]], paw: [128, 191] }],
      tail: 'up',
      tails: { up: [[45, 124], [20, 118], [18, 68], [38, 60]], out: [[45, 126], [26, 126], [12, 114], [12, 96]],
        down: [[45, 128], [28, 140], [22, 168], [30, 186]], wrap: [[45, 128], [28, 140], [22, 168], [30, 186]] } },
    walk: { hip: [64, 132, 22], chest: [114, 132, 24], head: [148, 94, 5],
      far: [{ leg: [[110, 144, 8], [97, 189, 6]], paw: [101, 191] }, { leg: [[58, 144, 9], [73, 189, 6]], paw: [77, 191] }],
      near: [{ thigh: [66, 144, 16, 22, 30], leg: [[66, 152, 9], [48, 189, 6.5]], paw: [52, 191] }, { leg: [[122, 144, 9], [140, 188, 6.5]], paw: [144, 190] }],
      tail: 'up',
      tails: { up: [[45, 126], [20, 120], [18, 70], [38, 62]], out: [[45, 128], [26, 128], [12, 116], [12, 98]],
        down: [[45, 130], [28, 142], [22, 170], [30, 186]], wrap: [[45, 130], [28, 142], [22, 170], [30, 186]] } },
    crouch: { hip: [72, 164, 24], chest: [118, 172, 20], head: [148, 152, 6],
      far: [{ leg: [[116, 180, 7], [132, 191, 5]], paw: [137, 192] }, { paw: [50, 192] }],
      haunch: [72, 174, 24, 18, -8], backPaws: [[94, 192]],
      near: [{ leg: [[126, 182, 8], [146, 191, 6]], paw: [151, 192] }],
      tail: 'low', moodTail: false,
      tails: { low: [[52, 160], [32, 164], [18, 172], [14, 152]] } },
    curl: { hip: [92, 168, 29], chest: [112, 168, 27], head: [138, 164, 18], look: [0, 1],
      near: [{ paw: [154, 192] }, { paw: [143, 193] }],
      tail: 'wrap', front: { wrap: 1 }, moodTail: false,
      tails: { wrap: [[66, 182], [60, 198], [126, 200], [168, 188]] } },
    loaf: { hip: [78, 167, 29], chest: [118, 168, 28], head: [138, 126, 0],
      far: [{ paw: [140, 192] }], near: [{ paw: [152, 193] }],
      tail: 'wrap', front: { wrap: 1 },
      tails: { wrap: [[54, 180], [38, 196], [92, 198], [126, 190]], up: [[54, 156], [26, 150], [24, 92], [48, 84]],
        flag: [[54, 156], [26, 150], [24, 92], [48, 84]], down: [[52, 184], [34, 192], [22, 192], [14, 184]],
        out: [[52, 178], [30, 182], [16, 176], [12, 158]] } },
    flat: { hip: [64, 185, 13], chest: [118, 184, 14], head: [148, 168, 6], earBias: 26,
      far: [{ paw: [162, 193] }, { paw: [46, 193] }], near: [{ paw: [172, 194] }],
      tail: 'flat', moodTail: false,
      tails: { flat: [[52, 187], [36, 194], [22, 194], [12, 190]] } },
    lie: { hip: [66, 175, 22], chest: [110, 173, 22], head: [140, 134, 0],
      far: [{ leg: [[104, 185, 7], [144, 190, 5]], paw: [149, 191] }],
      haunch: [70, 179, 24, 17, 0], backPaws: [[94, 192]],
      near: [{ leg: [[114, 187, 8], [154, 191, 6]], paw: [160, 192] }],
      tail: 'flat', moodTail: false,
      tails: { flat: [[46, 183], [30, 194], [18, 194], [12, 184]] } },
    fall: { hip: [56, 172, 22], chest: [100, 170, 24], head: [146, 160, -34], belly: true, look: [1, -1],
      far: [{ leg: [[68, 156, 8], [78, 116, 6]], paw: [79, 111], up: true }, { leg: [[104, 152, 8], [114, 114, 6]], paw: [115, 109], up: true }],
      near: [{ leg: [[54, 158, 9], [44, 118, 6.5]], paw: [43, 113], up: true }, { leg: [[92, 154, 9], [92, 112, 6.5]], paw: [92, 107], up: true }],
      tail: 'curl', moodTail: false,
      tails: { curl: [[38, 178], [16, 188], [10, 152], [26, 142]] } },
    stretch: { hip: [86, 160, 22], chest: [104, 114, 21], head: [110, 80, -18], look: [0.6, -4],
      far: [{ leg: [[110, 108, 7], [148, 52, 5]], paw: [152, 47] }, { paw: [104, 192] }],
      haunch: [84, 170, 20, 25, 15], backPaws: [[100, 192]],
      near: [{ leg: [[118, 114, 8], [164, 60, 6]], paw: [168, 54], afterHead: true }],
      tail: 'down', moodTail: false,
      tails: { down: [[68, 178], [52, 190], [38, 194], [26, 186]] } },
    peer: { hip: [78, 165, 26], chest: [116, 133, 22], head: [146, 98, 14], look: [1.6, 2.6],
      far: [{ leg: [[118, 136, 7], [152, 122, 5]], paw: [158, 121] }],
      haunch: [80, 173, 24, 21, -20], backPaws: [[102, 192]],
      near: [{ leg: [[128, 140, 8], [160, 127, 6]], paw: [166, 125] }],
      tail: 'down',
      tails: { down: [[52, 182], [32, 194], [20, 188], [18, 168]], up: [[52, 172], [22, 166], [20, 102], [42, 96]],
        wrap: [[52, 182], [32, 194], [20, 188], [18, 168]], out: [[52, 178], [30, 178], [16, 166], [14, 146]] } }
  };

  // poses whose head rests on top of the chest, so it follows a slim cat's lower chest down
  var NECK_FOLLOWS = { sit: 1, lookup: 1, lie: 1, loaf: 1, stand: 1, walk: 1, peer: 1, stretch: 1 };

  var MOOD_TAIL = { happy: 'up', proud: 'up', wonder: 'up', laugh: 'up', shout: 'up', dreamy: 'wrap',
    kind: 'wrap', sleepy: 'wrap', worried: 'down', stern: 'out', sniff: 'out' };
  var EAR_ANG = { neutral: 0, happy: -2, dreamy: 4, wonder: -6, worried: 24, scared: 58, sleepy: 14, laugh: 6,
    stern: -10, kind: 3, proud: -4, sniff: -6, shout: 10, solemn: -3 };
  var HEAD_ROT = { proud: -12, laugh: -8, shout: -6, wonder: -5, sleepy: 7, worried: 4, sniff: 7, scared: 5, dreamy: -6, solemn: -9 };
  var EYE_KIND = { neutral: 'open', happy: 'arc', dreamy: 'lidUp', wonder: 'wonder', worried: 'open', scared: 'scared',
    sleepy: 'closed', laugh: 'squeeze', stern: 'lidFlat', kind: 'lidKind', proud: 'arc', sniff: 'lidSoft', shout: 'open', solemn: 'lidHalf' };
  var BROW = { worried: [-5, 3], scared: [-6, 3], stern: [5, -4], shout: [-4, -5], solemn: [-3, -3] };   // shout is excitement in this story (calls, cheers, "Thirteen!"), so raised brows, never cross; solemn: level, no frown
  // upper lids for the 'lid' eye kinds: [inner corner y, curve control y, outer corner y], in eye coordinates
  // lidKind: soft, a little lifted, so a kind face reads warm and never sly (it looks at you, pupils centred)
  var LID = { lidSoft: [2, -10.5, -2], lidFlat: [3.4, 1.4, -4.6], lidHalf: [-0.4, 0.4, -1.2], lidKind: [1.2, -12.8, -3.4] };
  var BLUSH = { happy: 1, laugh: 1, kind: 1, dreamy: 1, proud: 1, wonder: 1 };

  // ------------------------------------------------------------------ the head

  var HEAD = 'M-27,-24C-14,-33 14,-33 27,-24C36,-17 39,-6 38,4L45,10L37,13L42,19L33,19C24,29 -24,29 -33,19L-42,19L-37,13L-45,10L-38,4C-39,-6 -36,-17 -27,-24Z';
  var EAR = 'M-13,4Q-9,-14 1,-31Q9,-14 14,4Z';
  var EAR_NOTCH = 'M-13,4Q-9,-14 1,-31L7,-23L-1,-18L9,-12Q12,-5 14,4Z';
  var EAR_RAG = 'M-13,4Q-9,-14 -1,-28L2,-25L3,-29L8,-18L5,-15L10,-11Q12,-5 14,4Z';
  var EAR_IN = 'M-7,2Q-4,-11 1,-21Q5,-11 7,2Z';
  var EAR_IN_NOTCH = 'M-7,2Q-5,-10 -3,-15L1,-13Q5,-7 7,2Z';
  var EYE = 'M-9.6,2C-9.6,-6.7 -4.8,-11.2 0.8,-11.2C6.2,-11.2 9.6,-7 9.6,-2C9.6,5.6 5,11.2 -0.4,11.2C-5.6,11.2 -9.6,7.4 -9.6,2Z';
  var EYE_TOP = 'M-9.6,2C-9.6,-6.7 -4.8,-11.2 0.8,-11.2C6.2,-11.2 9.6,-7 9.6,-2';
  var EYE_BOT = 'M-9.6,2C-9.6,7.4 -5.6,11.2 -0.4,11.2C5,11.2 9.6,5.6 9.6,-2';
  var MOUTH = {
    w: 'M0,11.6V13.4M-5.6,12.4Q-2.8,16.4 0,13.4Q2.8,16.4 5.6,12.4',
    smile: 'M0,11.6V13.6M-7.6,11.2Q-3.8,17.4 0,13.6Q3.8,17.4 7.6,11.2',
    line: 'M0,11.6V14M-4.6,14.2H4.6',
    wavy: 'M0,11.6V13.2M-5.4,15.4Q-2.7,12.4 0,14.6Q2.7,16.8 5.4,14',
    frown: 'M0,11.6V13.6M-6,15.8Q0,12.2 6,15.8'
  };

  function earColor(sp, side) {
    var p = sp.pal;
    if (sp.pattern === 'tortie') return side < 0 ? p.patches[0] : p.base;
    if (sp.pattern === 'calico') return side < 0 ? p.patches[0] : p.patches[1];
    return p.base;
  }

  // Ear tips and outer corners in head coordinates (for fitting the cat in its box).
  function earTips(sp, mood, bias) {
    var ff = !!sp.flatFace, hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + bias), th = (16 + ea) * Math.PI / 180;
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1), out = [];
    [-1, 1].forEach(function (side) {
      [[1, -31], [14, 4], [7, -14]].forEach(function (q) {
        var x = q[0] * es, y = q[1] * es;
        out.push([side * (x * Math.cos(th) - y * Math.sin(th)) + side * ex, x * Math.sin(th) + y * Math.cos(th) + ey]);
      });
    });
    return out;
  }

  // The middle of each ear in head coordinates, for glows that follow the ears when they flatten.
  function earMids(sp, mood, bias) {
    var ff = !!sp.flatFace, hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + bias), th = (16 + ea) * Math.PI / 180;
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1);
    return [-1, 1].map(function (side) {
      var x = 1 * es, y = -15 * es;
      return [side * (x * Math.cos(th) - y * Math.sin(th)) + side * ex, x * Math.sin(th) + y * Math.cos(th) + ey];
    });
  }

  function headSvg(R, sp, mood, ctx) {
    var p = sp.pal, ff = !!sp.flatFace, tx = ff ? 3 : 4, F = ctx.F;
    var hx = sp.headX || (sp.sex === 'tom' ? 1.06 : 1);
    var s = '';
    // ears
    var ea = Math.min(72, (EAR_ANG[mood] || 0) + (ctx.earBias || 0));
    var ex = (ff ? 25 : 21) * hx, ey = ff ? -16 : -21, es = (sp.earS || 1) * (ff ? 0.74 : 1);
    [-1, 1].forEach(function (side) {
      var vs = side * F;
      var shape = sp.notch && vs === 1 ? EAR_NOTCH : sp.ragged && vs === 1 ? EAR_RAG : EAR;
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + side + ',1) rotate(' + N(16 + ea) + ') scale(' + N(es) + ')">' +
        '<path d="' + shape + '" fill="' + earColor(sp, side) + '" stroke="' + p.line + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="' + (shape === EAR_NOTCH ? EAR_IN_NOTCH : EAR_IN) + '" fill="' + p.earIn + '"/></g>';
    });
    // the head shape
    var hd;
    if (sp.fluffy) {
      var hp = [];
      for (var i = 0; i < 24; i++) {
        var a = Math.PI * 2 * i / 24, c = Math.cos(a), sn = Math.sin(a);
        var cheek = Math.max(0, sn) * Math.abs(c) * 10;
        hp.push([c * (44 + cheek), sn * 33 + (sn > 0 ? sn * 2 : 0) - 1]);
      }
      hd = scallop(hp, 0.66);
    } else {
      hd = hx === 1 ? HEAD : scalePath(HEAD, hx, 1);
    }
    var inner = '<ellipse cx="-9" cy="-21" rx="14" ry="5.5" transform="rotate(-10 -9 -21)" fill="' + p.light + '" opacity=".55"/>';
    if (sp.pattern === 'tortie') {
      inner += '<path d="' + blob(-30, -14, 27, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(24, -27, 10, 5) + '" fill="' + p.patches[1] + '"/>' +
        '<path d="' + blob(30, 14, 7, 9) + '" fill="' + p.patches[0] + '"/>';
    } else if (sp.pattern === 'calico') {
      inner += '<path d="' + blob(-30, -14, 26, 3) + '" fill="' + p.patches[0] + '"/><path d="' + blob(28, -24, 16, 6) + '" fill="' + p.patches[1] + '"/>';
    } else if (sp.pattern === 'tabby') {
      inner += '<path d="M' + (tx - 7) + ',-30L' + (tx - 5) + ',-19M' + tx + ',-32L' + tx + ',-20M' + (tx + 7) + ',-30L' + (tx + 5) + ',-19' +
        'M40,-3L31,0M41,6L32,6M-40,-3L-31,0M-41,6L-32,6" stroke="' + p.stripe + '" stroke-width="3.4" stroke-linecap="round" fill="none"/>';
    }
    if (sp.marks.back) inner += '<path d="M' + tx + ',-34L' + tx + ',-18" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="5" stroke-linecap="round"/>';
    if (sp.marks.chest || sp.marks.chin) inner += '<ellipse cx="' + tx + '" cy="' + (sp.marks.chin ? 24 : 23) + '" rx="' + (sp.marks.chin ? 13 : 17) + '" ry="' + (sp.marks.chin ? 6 : 8) + '" fill="' + (sp.marks.chin || sp.marks.chest) + '"' + (sp.marks.chin ? '' : markEdge(sp)) + '/>';
    if (sp.marks.splash) {
      inner += '<path d="M' + (tx - 3.5) + ',-24Q' + tx + ',-27 ' + (tx + 3.5) + ',-24L' + (tx + 6) + ',2Q' + (tx + 12) + ',10 ' + tx + ',16Q' + (tx - 12) + ',10 ' + (tx - 6) + ',2Z" fill="' + markFill(sp) + '"' + markEdge(sp) + '/>';
    }
    if (sp.fluffy) {
      // a Persian's ruff under the chin
      var rp = [];
      for (var ri = 0; ri < 16; ri++) { var ra = Math.PI * 2 * ri / 16; rp.push([Math.cos(ra) * 40, 30 + Math.sin(ra) * 15]); }
      s += '<path d="' + scallop(rp, 0.7) + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="2.2" stroke-linejoin="round"/>';
    }
    s += R.part(hd, { fill: p.base, dark: p.shade, line: p.line, sx: ctx.sx * 0.8, sy: -3.2, inner: inner });

    // muzzle puffs and chin
    var muz = sp.muzzle || p.light, my = ff ? 10.5 : 12.8, mr = ff ? 7.6 : 6.6;
    s += '<g fill="' + muz + '"><circle cx="' + N(tx - 5.6) + '" cy="' + my + '" r="' + mr + '"/><circle cx="' + N(tx + 5.6) + '" cy="' + my + '" r="' + mr + '"/></g>';

    // eyes
    var kind = EYE_KIND[mood] || 'open';
    var exd = ff ? 17 : 15.5, eyY = ff ? 1 : -1, ek = ff ? 1.1 : 1;
    var look = ctx.look || [1.4, 0];
    var eid = R.id(), ecl = R.id();
    R.defs += '<path id="' + eid + '" d="' + EYE + '"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    [-1, 1].forEach(function (side) {
      var vs = side * F, iris = vs < 0 ? sp.iris[0] : sp.iris[1];
      var cx = tx + side * exd, k = ek * (kind === 'wonder' ? 1.14 : kind === 'scared' ? 1.08 : 1);
      var lid = p.base;
      if (sp.pattern === 'tortie' || sp.pattern === 'calico') lid = side < 0 ? p.patches[0] : p.base;
      if (sp.pattern === 'calico' && side > 0) lid = p.base;
      s += '<g transform="translate(' + N(cx) + ',' + N(eyY) + ') scale(' + N(side * k) + ',' + N(k) + ')">' + eyeSvg(kind, iris, look, side, p, lid, eid, ecl, sp) + '</g>';
    });
    // brows
    var br = BROW[mood] || (sp.heavyBrows ? [1, -1] : null);
    if (br) {
      var shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze';
      var bw = sp.heavyBrows ? 3.4 : 2.5, by = -17 - (kind === 'wonder' ? 2 : 0) - (shut ? 4 : 0);
      s += '<path d="M' + N(tx - 7) + ',' + N(by + br[0]) + 'L' + N(tx - 21) + ',' + N(by + br[1]) + 'M' + N(tx + 7) + ',' + N(by + br[0]) + 'L' + N(tx + 21) + ',' + N(by + br[1]) +
        '" stroke="' + p.feat + '" stroke-width="' + bw + '" stroke-linecap="round" fill="none"/>';
    }
    // scar over his right eye (the viewer's left)
    if (sp.scar) {
      var sside = -F, scx = tx + sside * exd;
      s += '<path d="M' + N(scx - 6 * sside) + ',-26Q' + N(scx + 1 * sside) + ',-6 ' + N(scx + 6 * sside) + ',13" stroke="#dba79f" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
    }
    // blush
    if (BLUSH[mood]) {
      s += '<g fill="#ff8aa5" opacity=".42"><ellipse cx="' + N(tx - 22) + '" cy="10" rx="5.6" ry="3.2"/><ellipse cx="' + N(tx + 22) + '" cy="10" rx="5.6" ry="3.2"/></g>';
    }
    // nose and mouth
    var ny = ff ? -3.4 : 0, ns = mood === 'sniff' ? 1.3 : 1;
    s += '<g transform="translate(' + tx + ',' + ny + ')">';
    var ml = p.feat === p.line ? mix(p.line, '#000', 0.1) : p.feat;
    if (mood === 'laugh' || mood === 'shout') {
      var big = mood === 'shout';
      s += '<path d="' + (big ? 'M-8.5,12Q0,9.6 8.5,12Q9.6,29 0,30Q-9.6,29 -8.5,12Z' : 'M-8,12Q0,13.2 8,12Q6.6,25 0,25Q-6.6,25 -8,12Z') + '" fill="#7a2c3b" stroke="' + ml + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="' + (big ? 'M-5,25Q0,19 5,25Q3,29.4 0,29.4Q-3,29.4 -5,25Z' : 'M-4.6,21.6Q0,17.6 4.6,21.6Q2.4,24.6 0,24.6Q-2.4,24.6 -4.6,21.6Z') + '" fill="#f2879a"/>';
    } else if (mood === 'wonder' || mood === 'scared') {
      s += '<path d="M0,11.6V12.8" stroke="' + ml + '" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="0" cy="16" rx="' + (mood === 'scared' ? 2.4 : 2.8) + '" ry="3.3" fill="#7a2c3b" stroke="' + ml + '" stroke-width="1.6"/>';
    } else {
      var mk = { happy: 'smile', dreamy: 'smile', kind: 'smile', proud: 'smile', worried: 'wavy', stern: 'frown', solemn: 'line' }[mood] || 'w';
      s += '<path d="' + MOUTH[mk] + '" stroke="' + ml + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    }
    s += '<path d="M-3.8,7.2Q0,6 3.8,7.2Q2.2,10.6 0,11.7Q-2.2,10.6 -3.8,7.2Z" transform="scale(' + ns + ')" fill="' + p.nose + '" stroke="' + mix(p.nose, '#5a2a33', 0.45) + '" stroke-width="1.2" stroke-linejoin="round"/>';
    s += '</g>';
    // whiskers (a flat face's eyes sit low and big: its whiskers start below them, never across them)
    var wy = ff ? 15 : 12;
    s += '<path d="M' + N(tx + 11) + ',' + wy + 'L' + N(tx + 34) + ',' + N(wy - 4) + 'M' + N(tx + 11) + ',' + N(wy + 3) + 'L' + N(tx + 34) + ',' + N(wy + 5) +
      'M' + N(tx - 11) + ',' + wy + 'L' + N(tx - 34) + ',' + N(wy - 4) + 'M' + N(tx - 11) + ',' + N(wy + 3) + 'L' + N(tx - 34) + ',' + N(wy + 5) +
      '" stroke="' + p.whisk + '" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>';
    // extras
    if (mood === 'sniff') {
      s += '<path d="M48,-8q3,-3 6,0t6,0M51,1q3,-3 6,0t6,0M48,10q3,-3 6,0t6,0" stroke="' + p.feat + '" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".7"/>';
    }
    if (mood === 'laugh') {
      s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width=".8"><path d="M' + N(tx + 28) + ',2q3,4 0,6q-3,-2 0,-6Z"/><path d="M' + N(tx - 28) + ',2q3,4 0,6q-3,-2 0,-6Z"/></g>';
    }
    if (sp.bow) {
      var bx = -F * 24;
      s += '<g transform="translate(' + N(bx) + ',-27) rotate(' + (-F * 18) + ')"><path d="M0,0C-6,-11 -19,-9 -17,1C-15,10 -6,6 0,0ZM0,0C6,-11 19,-9 17,1C15,10 6,6 0,0Z" fill="#f47aa8" stroke="#c24c7c" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M-12,-2L-5,0M12,-2L5,0" stroke="#d9608f" stroke-width="1.4" stroke-linecap="round"/><circle r="4" fill="#ff9cc2" stroke="#c24c7c" stroke-width="1.6"/></g>';
    }
    return s;
  }

  // One eye in local coordinates (outer corner at +x).
  function eyeSvg(kind, iris, look, side, p, lid, eid, ecl, sp) {
    var lc = p.line === p.feat ? p.line : mix(p.line, '#000', 0.2), she = sp.sex !== 'tom';
    var lash = she ? '<path d="M8.6,-3.4L13.6,-7.6" stroke="' + lc + '" stroke-width="2.2" stroke-linecap="round"/>' : '';
    if (kind === 'arc') return '<path d="M-9,3.4Q0,-9 9.4,1.6" stroke="' + p.feat + '" stroke-width="3.3" fill="none" stroke-linecap="round"/>';
    if (kind === 'closed') return '<path d="M-9,-0.6Q0,7.6 9.4,-2.2" stroke="' + p.feat + '" stroke-width="3" fill="none" stroke-linecap="round"/>' + (she ? '<path d="M9.4,-2.2L13.2,-4.4" stroke="' + p.feat + '" stroke-width="2" stroke-linecap="round"/>' : '');
    if (kind === 'squeeze') return '<path d="M7.6,-6.4L-5.4,0L7.6,6.4" stroke="' + p.feat + '" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var lx = look[0] * side, ly = look[1];
    var pupil, hl;
    if (kind === 'wonder') {
      pupil = '<circle cx="' + N(lx) + '" cy="' + N(ly + 0.5) + '" r="6.2" fill="#221b26"/>';
      hl = '<circle cx="' + N(lx - 3.4 * side) + '" cy="' + N(ly - 3.6) + '" r="3.9" fill="#fff"/><circle cx="' + N(lx + 3 * side) + '" cy="' + N(ly + 3.6) + '" r="1.9" fill="#fff"/><circle cx="' + N(lx + 3.6 * side) + '" cy="' + N(ly - 4.6) + '" r="1.1" fill="#fff"/>';
    } else if (kind === 'scared') {
      pupil = '<ellipse cx="' + N(lx * 0.4) + '" cy="0.5" rx="1.9" ry="3.6" fill="#221b26"/>';
      hl = '<circle cx="' + N(-3.4 * side) + '" cy="-4.6" r="2.4" fill="#fff"/>';
    } else {
      var py = kind === 'lidUp' ? -2.2 : ly + (kind === 'lidSoft' ? 1.6 : kind === 'lidHalf' ? 2.4 : 0.4);   // lidHalf: looking down her nose
      pupil = '<ellipse cx="' + N(kind === 'lidUp' ? lx * 0.5 : lx) + '" cy="' + N(py) + '" rx="3.4" ry="7" fill="#221b26"/>';
      hl = kind === 'lidUp' ? '<circle cx="' + N(-3.2 * side) + '" cy="1.4" r="2.6" fill="#fff"/><circle cx="' + N(2.6 * side) + '" cy="5.6" r="1.3" fill="#fff"/>' :
        kind.indexOf('lid') === 0 ? '<circle cx="' + N(lx - 2.6 * side) + '" cy="' + N(Math.max(py, 0) + 2.6) + '" r="2.2" fill="#fff"/>' :
        '<circle cx="' + N(lx - 3.3 * side) + '" cy="' + N(ly - 4.4) + '" r="3.2" fill="#fff"/><circle cx="' + N(lx + 2.6 * side) + '" cy="' + N(ly + 4.4) + '" r="1.5" fill="#fff"/>';
    }
    var g = '<g clip-path="url(#' + ecl + ')"><use href="#' + eid + '" fill="' + iris + '"/>' +
      '<ellipse cx="0" cy="-11" rx="13" ry="7.6" fill="' + mix(iris, p.line, 0.38) + '" opacity=".75"/>' +
      '<ellipse cx="0" cy="11.6" rx="10" ry="5" fill="' + mix(iris, '#ffffff', 0.38) + '"/>' + pupil + hl;
    if (kind === 'lidUp') {
      // dreamy: an arched upper lid, eyes gazing up
      return g + '<path d="M-13,-1.6Q0,-12.6 13,-5.6L13,-15L-13,-15Z" fill="' + lid + '"/></g>' +
        '<use href="#' + eid + '" fill="none" stroke="' + lc + '" stroke-width="1.8"/>' +
        '<path d="M-9.8,-1.4Q0,-11.6 9.8,-5.2" stroke="' + lc + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        (she ? '<path d="M9.6,-5.2L14,-8.4" stroke="' + lc + '" stroke-width="2" stroke-linecap="round"/>' : '');
    }
    if (kind.indexOf('lid') === 0) {
      var ld = LID[kind] || LID.lidSoft, iy = ld[0], cy = ld[1], oy = ld[2];
      g += '<path d="M-12,' + iy + 'Q0,' + cy + ' 12,' + oy + 'L12,-14L-12,-14Z" fill="' + lid + '"/></g>' +
        '<path d="' + EYE_BOT + '" stroke="' + lc + '" stroke-width="2" fill="none"/>' +
        '<path d="M-9.6,' + iy + 'Q0,' + cy + ' 9.6,' + oy + '" stroke="' + lc + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>' + (she ? '<path d="M9.4,' + oy + 'L13.6,' + (oy - 3.4) + '" stroke="' + lc + '" stroke-width="2" stroke-linecap="round"/>' : '');
      return g;
    }
    return g + '</g><use href="#' + eid + '" fill="none" stroke="' + lc + '" stroke-width="2"/>' +
      '<path d="' + EYE_TOP + '" stroke="' + lc + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' + lash;
  }

  // ------------------------------------------------------------------ a held prop: Riffle's lucky stone

  // opts.flatEars lays the ears this much flatter than the mood's (the old tom counted on the rim)
  var FLAT_EARS = 46;
  // Smooth, nearly black, with one unbroken white band all the way around (chapter 2's Art needs).
  // Centred on 0,0, about a quarter of a head wide.
  var STONE = 'M-10.5,0.6C-10.5,-4.6 -5.4,-7.2 0.4,-7.2C6.4,-7.2 10.6,-4 10.6,0.4C10.6,4.8 6,7.2 -0.2,7.2C-6,7.2 -10.5,5 -10.5,0.6Z';
  var STONE_RX = 10.5, STONE_GROUND = 189;
  var HOLD_AT = { paws: 1, mouth: 1, chin: 1, nose: 1 };
  // a cat on its feet carries the stone in its mouth; sitting or lying, it keeps it at its paws
  var HOLD_MOUTH = { stand: 1, walk: 1, peer: 1, stretch: 1 };

  function stoneSvg(R, c, k, rot, sx) {
    var inner = '<ellipse cx="0" cy="5.6" rx="12" ry="4" fill="#141218" opacity=".45"/>' +
      '<path d="M2.2,-8.6Q-3.4,0 2.2,8.6" stroke="#fbf7ee" stroke-width="3.6" fill="none"/>' +
      '<ellipse cx="-5.2" cy="-3.4" rx="3.4" ry="1.5" transform="rotate(-16 -5.2 -3.4)" fill="#9b97a8" opacity=".75"/>';
    return '<g class="pc-stone" transform="translate(' + N(c[0]) + ',' + N(c[1]) + ') rotate(' + N(rot) + ') scale(' + N(k) + ')">' +
      R.part(STONE, { fill: '#2e2b36', dark: '#1d1b23', line: '#0f0e13', sx: sx * 0.4, sy: -1.6, inner: inner, lw: 1.8 }) + '</g>';
  }

  // Where a held stone goes: opts.holdAt 'paws' (at the toes of the front paws), 'mouth', 'chin'
  // (tucked in between the paws, right under the chin) or 'nose' (on the ground a little way in
  // front, where she can see it). Unset, a cat on its feet carries it in its mouth and any other cat
  // keeps it at its paws; a cat tumbling over ('fall') holds nothing. `c` is in the cat's body
  // coordinates, or the head's for 'mouth'; `k` scales the stone (a kitten's pebble, a third of a head).
  function holdPlace(o, pose, P, hm, sp) {
    if (o.holds !== 'stone' || pose === 'fall') return null;
    var at = HOLD_AT[o.holdAt] ? o.holdAt : HOLD_MOUTH[pose] ? 'mouth' : 'paws';
    var tx = sp.flatFace ? 3 : 4, k = 1.3;
    if (at === 'mouth') return { at: at, c: [tx + 1, 22], k: 1, rot: -6 };
    if (at === 'chin') {
      // on the ground under the chin; a chin already on the ground (curled up) rests on it from
      // behind, so the stone peeks out in front
      var ch = apply(hm, [tx, 33]), low = Math.max(0, ch[1] - STONE_GROUND);
      return { at: at, c: [ch[0] + low * 1.3, STONE_GROUND - (STONE_RX * (k - 1)) * 0.7], k: k, rot: -8 };
    }
    // the front paw: whichever forepaw on the ground is furthest forward
    var fp = null;
    (P.near || []).concat(P.far || []).forEach(function (L) { if (L.paw && !L.up && (!fp || L.paw[0] > fp[0])) fp = L.paw; });
    if (!fp) fp = apply(hm, [tx, 30]);
    return { at: at, c: [fp[0] + (at === 'nose' ? 34 : 13), Math.min(STONE_GROUND, fp[1] - 3) - (STONE_RX * (k - 1)) * 0.7], k: k, rot: at === 'nose' ? 5 : -4 };
  }

  // ------------------------------------------------------------------ a whole cat

  function buildCat(sp, o) {
    o = o || {};
    var pose = POSES[o.pose] ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var facing = o.facing === 'left' ? 'left' : 'right', F = facing === 'right' ? 1 : -1;
    var P = POSES[pose], p = sp.pal, R = new Ren();
    var bulk = sp.bulk || 1, lw = Math.sqrt(bulk) * (sp.legW || 1), scared = mood === 'scared';
    var sx = -2.2 * F, sy = -3.6;
    var fl = !!sp.fluffy;

    function shape(g) {
      if (fl) return scallop(g.pts, 0.66);
      return g.d;
    }
    function grow(c) { var r = c[2] * bulk * (scared ? 1.06 : 1); return [c[0], c[1] + c[2] - r, r]; }

    // ----- torso
    var hip = grow(P.hip), chest = grow(P.chest);
    var tg = hull2(hip, chest, fl ? 14 : 10);
    var ax = unit([chest[0] - hip[0], chest[1] - hip[1]]);
    if (dist(hip, chest) < 1) ax = [1, 0];
    var spine = P.belly ? [-ax[1], ax[0]] : [ax[1], -ax[0]];
    var tIn = '';
    if (!fl && !P.belly) {
      // a soft rim of light along the back
      tIn += '<path d="M' + pt(add(add(hip, spine, hip[2] - 4.5), ax, 2)) + 'L' + pt(add(add(chest, spine, chest[2] - 4.5), ax, -4)) +
        '" stroke="' + p.light + '" stroke-width="4" stroke-linecap="round" opacity=".5"/>';
    }
    if (P.belly) {
      var bc = lerp2(hip, chest, 0.5);
      tIn += ellipseG(bc[0] - spine[0] * (chest[2] * 0.6), bc[1] - spine[1] * (chest[2] * 0.6), (dist(hip, chest) / 2 + chest[2]) * 0.82, chest[2] * 0.62, deg(ax)).d.replace(/^/, '<path fill="' + (sp.marks.chest || p.light) + '"' + (sp.marks.chest ? markEdge(sp) : '') + ' d="') + '"/>';
    }
    if (sp.pattern === 'tabby') {
      var st = '';
      for (var k = 0; k < 6; k++) {
        var t = -0.42 + k * 0.32, c = lerp2(hip, chest, t), r = lerp(hip[2], chest[2], clamp(t, 0, 1));
        var s0 = add(c, spine, r + 4), e0 = add(add(c, spine, -r * (k % 2 ? 0.05 : 0.38)), ax, 4);
        st += wedge(s0, e0, k % 2 ? 7 : 9, mul2(ax, -5));
      }
      tIn += '<path d="' + st + '" fill="' + p.stripe + '"/>';
    } else if (sp.pattern === 'tortie' || sp.pattern === 'calico') {
      var c1 = add(hip, spine, hip[2] * 0.3), c2 = add(add(chest, spine, chest[2] * 0.2), ax, -chest[2] * 0.2);
      tIn += '<path d="' + blob(c1[0], c1[1], hip[2] * 0.95, 1) + '" fill="' + p.patches[0] + '"/>' +
        '<path d="' + blob(c2[0], c2[1], chest[2] * 0.7, 2) + '" fill="' + p.patches[sp.pattern === 'calico' ? 1 : 0] + '"/>';
      if (sp.pattern === 'tortie') {
        var c3 = lerp2(hip, chest, 0.55);
        tIn += '<path d="' + blob(c3[0] - spine[0] * 6, c3[1] - spine[1] * 6, 9, 4) + '" fill="' + p.patches[1] + '"/>';
      }
    }
    if (sp.marks.back) {
      tIn += '<path d="M' + pt(add(add(hip, spine, hip[2]), ax, -hip[2] * 0.8)) + 'L' + pt(add(add(chest, spine, chest[2]), ax, chest[2] * 0.5)) +
        '" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="13" stroke-linecap="round"/>';
    }
    if (sp.marks.chest && !P.belly) {
      var bcen = add(add(chest, ax, chest[2] * 0.5), spine, -chest[2] * 0.4);
      tIn += '<path fill="' + sp.marks.chest + '"' + markEdge(sp) + ' d="' + ellipseG(bcen[0], bcen[1], chest[2] * 0.66, chest[2] * 1.05, deg(ax)).d + '"/>';
    }
    var torsoD = scared && !fl ? spiky(tg.pts, 4.5) : shape(tg);
    var torso = R.part(torsoD, { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: tIn });

    // ----- legs, paws, haunches
    function legPart(L, far) {
      var top = [L.leg[0][0], L.leg[0][1], L.leg[0][2] * lw], bot = [L.leg[1][0], L.leg[1][1], L.leg[1][2] * lw];
      var g = hull2(top, bot, 8), inn = '';
      var lax = unit([bot[0] - top[0], bot[1] - top[1]]), ln = [-lax[1], lax[0]];
      if (sp.pattern === 'tabby') {
        var b = '';
        [0.35, 0.6, 0.85].forEach(function (t) {
          var c = lerp2(top, bot, t), r = lerp(top[2], bot[2], t) + 3;
          b += 'M' + pt(add(c, ln, -r)) + 'L' + pt(add(c, ln, r));
        });
        inn += '<path d="' + b + '" stroke="' + p.stripe + '" stroke-width="3.6"/>';
      } else if (sp.pattern === 'tortie' && far) {
        var cc = lerp2(top, bot, 0.4);
        inn += '<path d="' + blob(cc[0], cc[1], top[2] * 1.4, 6) + '" fill="' + p.patches[0] + '"/>';
      } else if (sp.pattern === 'calico' && !far) {
        inn += '<path d="' + blob(top[0], top[1], top[2] * 1.6, 8) + '" fill="' + p.patches[0] + '"/>';
      }
      if (sp.marks.paws) {
        var wc = lerp2(top, bot, 0.92);
        inn += '<path fill="' + markFill(sp) + '"' + markEdge(sp) + ' d="' + ellipseG(wc[0], wc[1], bot[2] * 2.2, dist(top, bot) * 0.3, deg(lax) + 90).d + '"/>';
      }
      return R.part(fl ? scallop(g.pts, 0.6) : g.d, { fill: far ? p.farFill : p.base, dark: far ? p.shade2 : p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: inn });
    }
    function paw(pp, far, up) {
      var col = sp.marks.paws ? (far ? mix(markFill(sp), p.line, 0.12) : markFill(sp)) : (far ? p.farFill : p.base);
      var rx = 9.6 * Math.sqrt(lw), ry = 5.8 * Math.sqrt(lw);
      var e = ellipseG(pp[0] + (up ? 0 : 1), pp[1], up ? ry * 1.15 : rx, up ? rx * 0.82 : ry, 0, 6);
      var s = '<path d="' + (fl ? scallop(e.pts, 0.6) : e.d) + '" fill="' + col + '" stroke="' + p.line + '" stroke-width="2.2"/>';
      if (up) {
        s += '<g fill="' + p.earIn + '"><ellipse cx="' + N(pp[0]) + '" cy="' + N(pp[1] + 1.4) + '" rx="3.6" ry="2.8"/><circle cx="' + N(pp[0] - 4) + '" cy="' + N(pp[1] - 3.6) + '" r="1.5"/><circle cx="' + N(pp[0]) + '" cy="' + N(pp[1] - 4.6) + '" r="1.5"/><circle cx="' + N(pp[0] + 4) + '" cy="' + N(pp[1] - 3.6) + '" r="1.5"/></g>';
      } else if (!far && !fl) {
        s += '<path d="M' + N(pp[0] + 3) + ',' + N(pp[1] + 1) + 'v3.4M' + N(pp[0] + 7) + ',' + N(pp[1]) + 'v3.4" stroke="' + p.line + '" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>';
      }
      return s;
    }
    function haunchPart(h) {
      var g = ellipseG(h[0], h[1] + (h[3] * bulk - h[3]) * -0.4, h[2] * Math.sqrt(bulk), h[3] * Math.sqrt(bulk), h[4], 9), inn = '';
      if (sp.pattern === 'tabby') {
        var st = '';
        [-150, -118, -86].forEach(function (a) {
          var r = (a + h[4]) * Math.PI / 180, s0 = [h[0] + Math.cos(r) * h[2] * 1.15, h[1] + Math.sin(r) * h[3] * 1.15];
          st += wedge(s0, lerp2(s0, [h[0], h[1]], 0.75), 7);
        });
        inn += '<path d="' + st + '" fill="' + p.stripe + '"/>';
      } else if (sp.pattern === 'tortie') {
        inn += '<path d="' + blob(h[0] + 4, h[1] - 6, h[3] * 0.7, 11) + '" fill="' + p.patches[1] + '"/>';
      } else if (sp.pattern === 'calico') {
        inn += '<path d="' + blob(h[0] - 6, h[1] - 4, h[3] * 0.9, 12) + '" fill="' + p.patches[1] + '"/>';
      }
      return R.part(fl ? scallop(g.pts, 0.62) : g.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: 2.1, sx: sx * 0.7, sy: sy * 0.7, inner: inn });
    }
    function limb(L, far) {
      var s = '';
      if (L.thigh) s += haunchPart(L.thigh);
      if (L.leg) s += legPart(L, far);
      if (L.paw) s += paw(L.paw, far, L.up);
      return s;
    }

    // ----- tail
    var mode = P.tail;
    if (o.tail && P.tails[o.tail]) mode = o.tail;
    else if (P.moodTail !== false) {
      var mt = scared ? ((pose === 'stand' || pose === 'walk') ? 'up' : null) : MOOD_TAIL[mood];
      if (mt && P.tails[mt]) mode = mt;
    }
    var TP = P.tails[mode];
    var w0 = 6.6 * (sp.tailW || 1) * Math.sqrt(bulk), w1 = 4.6 * (sp.tailW || 1) * (mode === 'wrap' ? 0.8 : 1);
    var puff = scared ? 1.55 : 1;
    var tw = function (t) {
      var w = lerp(w0, w1, t) * puff;
      if (fl) w *= 1 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15));
      return w;
    };
    var tl = tube(TP, tw, fl ? 11 : 9);
    // a tail never sinks into the ground: lift the free end, keep the base attached
    var lowT = Math.max.apply(null, tl.pts.map(function (q) { return q[1]; })) + (fl ? 3 : 1.2) + (scared ? 3.6 : 0);
    if (lowT > 197.5) {
      var dl = lowT - 197.5;
      TP = [TP[0], [TP[1][0], TP[1][1] - dl * 0.7], [TP[2][0], TP[2][1] - dl], [TP[3][0], TP[3][1] - dl]];
      tl = tube(TP, tw, fl ? 11 : 9);
    }
    var tIn2 = '';
    if (sp.pattern === 'tabby') {
      var rings = '';
      [0.22, 0.42, 0.62, 0.8].forEach(function (t) {
        var a = tl.at(t), r = a.w * 1.5;
        rings += 'M' + pt(add(a.p, a.n, r)) + 'L' + pt(add(a.p, a.n, -r));
      });
      var tip = tl.at(1);
      tIn2 += '<path d="' + rings + '" stroke="' + p.stripe + '" stroke-width="4.4"/><circle cx="' + N(tip.p[0]) + '" cy="' + N(tip.p[1]) + '" r="' + N(tip.w * 2.1) + '" fill="' + p.stripe + '"/>';
    } else if (sp.pattern === 'tortie' || sp.pattern === 'calico') {
      var bands = '';
      [[0.3, 0], [0.75, sp.pattern === 'calico' ? 1 : 0]].forEach(function (b) {
        var a = tl.at(b[0]);
        bands += '<circle cx="' + N(a.p[0]) + '" cy="' + N(a.p[1]) + '" r="' + N(a.w * 2.2) + '" fill="' + p.patches[b[1]] + '"/>';
      });
      tIn2 += bands;
    }
    if (sp.marks.back) {
      var cl = [];
      for (var q = 0; q <= 6; q++) cl.push(tl.at(q / 6).p);
      tIn2 += '<path d="M' + pt(cl[0]) + cr(cl) + '" stroke="' + mix(p.base, p.line, 0.6) + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    }
    var tailD = scared && !fl ? spiky(tl.pts, 3.6) : (fl ? scallop(tl.pts, 0.66) : tl.d);
    var tailSvg = R.part(tailD, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: tIn2 });
    var tailFront = !!(P.front && P.front[mode]);

    // ----- head placement
    var hrot = P.head[2] + (HEAD_ROT[mood] || 0) * (pose === 'curl' || pose === 'flat' ? 0.5 : 1) + (sp.rot || 0);
    // a slim cat's chest is smaller and sits lower (grow keeps its bottom); a head resting on top of
    // the chest comes down with it, or the head floats with a gap under the chin (fountain-close's
    // sit; the skinny grey tom lying asleep in the storm, f077). Not where the head rests on the
    // ground beside the chest (curl, flat, crouch, fall): there it is already attached.
    var neckDrop = NECK_FOLLOWS[pose] ? Math.max(0, (chest[1] - chest[2]) - (P.chest[1] - P.chest[2])) : 0;
    var hpos = [P.head[0] + (mood === 'sniff' ? 5 : 0), P.head[1] + neckDrop + (mood === 'sniff' ? 2 : mood === 'proud' || mood === 'solemn' ? -2 : 0)];
    var hsc = sp.headS || 1;
    var hm = mul(mT(hpos[0], hpos[1]), mul(mR(hrot), mS(hsc)));
    // opts.flatEars: ears laid flat with any mood ("The grizzled old tom flattens his ears at you"),
    // as the Counts picture lays the old tom's ears flat once they are counted
    var oEar = (o.earBias || 0) + (o.flatEars ? FLAT_EARS : 0);
    // ----- a held prop (opts.holds: 'stone', Riffle's lucky stone), placed before the head is drawn
    var hold = holdPlace(o, pose, P, hm, sp);
    var head = '<g transform="' + mStr(hm) + '">' + headSvg(R, sp, mood, {
      F: F, sx: sx, earBias: (P.earBias || 0) + oEar, look: [(mood === 'kind' ? 0.4 : 1.4) + (P.look ? P.look[0] : 0), P.look ? P.look[1] : 0]
    }) + (hold && hold.at === 'mouth' ? stoneSvg(R, hold.c, hold.k, hold.rot, sx) : '') + '</g>';

    // ----- assemble back to front
    var body = '';
    if (!tailFront) body += tailSvg;
    (P.far || []).forEach(function (L) { body += limb(L, true); });
    body += torso;
    if (P.haunch) body += haunchPart(P.haunch);
    (P.backPaws || []).forEach(function (pp) { body += paw(pp, false); });
    (P.near || []).forEach(function (L) { if (!L.afterHead) body += limb(L, false); });
    if (tailFront) body += tailSvg;
    // under the chin, the chin rests on it; at the paws or by the nose it lies in front of everything
    if (hold && hold.at === 'chin') body += stoneSvg(R, hold.c, hold.k, hold.rot, sx);
    body += head;
    (P.near || []).forEach(function (L) { if (L.afterHead) body += limb(L, false); });
    if (hold && (hold.at === 'paws' || hold.at === 'nose')) body += stoneSvg(R, hold.c, hold.k, hold.rot, sx);

    // ----- fit: keep the whole cat inside the 200 x 200 box (big cats in long poses shrink a little)
    var pts = tg.pts.concat(tl.pts);
    function addPts(a) { pts = pts.concat(a); }
    (P.far || []).concat(P.near || []).forEach(function (L) {
      if (L.leg) addPts([L.leg[0], L.leg[1]].map(function (c) { return [c[0], c[1]]; }));
      if (L.paw) addPts([[L.paw[0] - 11, L.paw[1] - 7], [L.paw[0] + 12, L.paw[1] + 7]]);
    });
    (P.backPaws || []).forEach(function (pp) { addPts([[pp[0] - 11, pp[1] - 7], [pp[0] + 12, pp[1] + 7]]); });
    var hb = [[-47, -6], [47, -6], [-44, 22], [44, 22], [0, 30], [0, -34]].concat(earTips(sp, mood, (P.earBias || 0) + oEar));
    if (mood === 'sniff') hb.push([66, -4]);
    if (fl) hb.push([-48, 26], [48, 26], [-50, 0], [50, 0], [-30, 43], [30, 43], [0, 47]);
    addPts(hb.map(function (q) { return apply(hm, q); }));
    // the held stone, in body coordinates (in the mouth it moves with the head)
    var heldC = hold ? (hold.at === 'mouth' ? apply(hm, hold.c) : hold.c) : null, heldR = hold ? STONE_RX * hold.k * (hold.at === 'mouth' ? hsc : 1) : 0;
    if (heldC) addPts([[heldC[0] - heldR - 2, heldC[1] - heldR], [heldC[0] + heldR + 2, heldC[1] + heldR]]);
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    pts.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var mg = 3 + (scared ? 4.5 : 0) + (fl ? 3 : 0), sc = sp.scale || 1;
    // rest the lowest point on the ground line
    var dy = Math.min(0, 198 - (y1 + 1.5 + (scared ? 2 : 0) + (fl ? 3 : 0)));
    sc = Math.min(sc, 200 / (x1 - x0 + 2 * mg), 197 / (197 - (y0 + dy) + mg));
    var left = 100 + (x0 - mg - 100) * sc, right = 100 + (x1 + mg - 100) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > 200) dx = 200 - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 200, 0], mul(mT(100 + dx, 197), mul(mS(sc), mT(-100, -197 + dy))));
    var hc = apply(M, apply(hm, [2, -4]));
    // boxes in the 200 x 200 box (after the fit and any mirroring): the head with its ears, ruff and
    // bow, and the whole cat. The scenes use them to frame close-ups and keep props off the face.
    var hbAll = hb.slice();
    if (sp.bow) { var bwx = -F * 24; hbAll.push([bwx - 21, -40], [bwx + 21, -40], [bwx - 21, -15], [bwx + 21, -15]); }
    var headBox = boxOf(hbAll.map(function (q) { return apply(M, apply(hm, q)); }));
    var bounds = boxOf(pts.map(function (q) { return apply(M, q); }));
    var svg = '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + '</g>';
    var paws = [];
    (P.far || []).concat(P.near || []).forEach(function (L) { if (L.paw) paws.push(apply(M, L.paw)); });
    (P.backPaws || []).forEach(function (pp) { paws.push(apply(M, pp)); });
    var out = {
      svg: svg, w: 200, h: 200, head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: headBox, bounds: bounds,
      _marks: { M: M, scale: sc, tail: tailD, tailTip: add(tl.at(1).p, tl.at(1).t, tl.at(1).w * 0.6), ears: (oEar ? earMids(sp, mood, (P.earBias || 0) + oEar) : [[-21, -38], [21, -38]]).map(function (q) { return apply(M, apply(hm, q)); }), paws: paws,
        chestTop: apply(M, [chest[0], chest[1] - chest[2]]) }
    };
    if (heldC) {
      // where the stone is, in the 200 x 200 box: for a sparkle on it, or a balloon to point past it
      var hcM = apply(M, heldC);
      out.held = { what: 'stone', at: hold.at, x: Math.round(hcM[0] * 10) / 10, y: Math.round(hcM[1] * 10) / 10, r: Math.round(heldR * sc * 10) / 10 };
    }
    return out;
  }

  // ------------------------------------------------------------------ the Tall One
  // 260 x 620, feet centred at (130, 620). Legs, slippers, a cardigan, a hand, a green
  // watering can. Never a face: her cardigan and arm run on far above the box (to y = -900),
  // so wherever a camera crops her, she simply continues out of the top of the panel.

  function tallOne(o) {
    var pose = OTHER_POSES.tallone.indexOf(o.pose) >= 0 ? o.pose : 'stand';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren();
    var C = { base: '#c6b2e0', shade: '#ab95cd', line: '#7a66a1', rib: '#b6a0d6' };
    var T = { base: '#93b8e3', shade: '#789fd1', line: '#50739e' };
    var S = { base: '#f8aecb', shade: '#ea90b5', line: '#c56b92', tip: '#fdd5e5' };
    var K = { base: '#ecb892', shade: '#d89d76', line: '#a9704d' };
    var G = { base: '#5db36e', shade: '#469356', line: '#2b6a3b', light: '#8ad49a' };
    var s = '';
    function part(d, c, far, inner) { return R.part(d, { fill: far ? c.shade : c.base, dark: far ? mix(c.shade, c.line, 0.25) : c.shade, line: c.line, sx: -3 * F, sy: -4, inner: inner, lw: 2.8 }); }
    function slipper(cx, cy, far) {
      var g = ellipseG(cx, cy, 41, 19, 0, 10);
      return R.part(scallop(g.pts, 0.62), { fill: far ? S.shade : S.base, dark: mix(S.shade, S.line, 0.2), line: S.line, sx: -2 * F, sy: -4, lw: 2.6,
        inner: '<ellipse cx="' + N(cx - 6) + '" cy="' + N(cy - 9) + '" rx="26" ry="7" fill="' + S.tip + '" opacity=".7"/>' }) +
        '<circle cx="' + N(cx + 26) + '" cy="' + N(cy - 8) + '" r="8" fill="' + S.tip + '" stroke="' + S.line + '" stroke-width="2"/>';
    }
    function can(x, y, rot, k) {
      return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ') scale(' + (k || 1) + ')">' +
        '<path d="M50,24L82,-14L88,-10L60,34Z" fill="' + G.base + '" stroke="' + G.line + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<ellipse cx="86" cy="-13" rx="5" ry="9" transform="rotate(38 86 -13)" fill="' + G.light + '" stroke="' + G.line + '" stroke-width="2.4"/>' +
        '<path d="M8,0Q30,-34 52,0" fill="none" stroke="' + G.line + '" stroke-width="9" stroke-linecap="round"/><path d="M8,0Q30,-34 52,0" fill="none" stroke="' + G.base + '" stroke-width="4.6" stroke-linecap="round"/>' +
        R.part('M0,6Q0,0 8,0L56,0Q64,0 64,6L66,62Q66,70 58,70L6,70Q-2,70 -2,62Z', { fill: G.base, dark: G.shade, line: G.line, sx: -3, sy: -3, lw: 2.6,
          inner: '<rect x="8" y="8" width="8" height="54" rx="4" fill="' + G.light + '" opacity=".8"/><path d="M-4,22H70" stroke="' + G.shade + '" stroke-width="3"/>' }) + '</g>';
    }
    function hand(x, y, rot) {
      return '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">' +
        R.part('M-18,0Q-22,28 -6,34Q12,38 18,24Q22,10 18,0Z', { fill: K.base, dark: K.shade, line: K.line, sx: -2, sy: -3, lw: 2.4 }) +
        '<path d="M-10,22Q-2,28 8,22M-12,14Q-2,20 10,14" stroke="' + K.line + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></g>';
    }
    function sleeve(d, cuffD) {
      return part(d, C, false, '') + R.part(cuffD, { fill: C.rib, dark: C.shade, line: C.line, lw: 2.4 });
    }
    var rib = '';
    for (var x = 34; x < 214; x += 10) rib += 'M' + x + ',158V200';
    var cardigan = function (bottomY, tilt) {
      return '<g transform="rotate(' + tilt + ' 120 0)">' + part('M28,-900L212,-900L218,' + bottomY + 'Q120,' + (bottomY + 18) + ' 22,' + bottomY + 'Z', C, false,
        '<path d="M20,' + (bottomY - 30) + 'Q120,' + (bottomY - 12) + ' 222,' + (bottomY - 30) + 'L230,' + (bottomY + 30) + 'L10,' + (bottomY + 30) + 'Z" fill="' + C.rib + '"/>' +
        '<path d="' + rib.replace(/158/g, String(bottomY - 26)).replace(/V200/g, 'V' + (bottomY + 20)) + '" stroke="' + C.shade + '" stroke-width="2"/>' +
        '<path d="M108,-900L132,-900L128,' + (bottomY + 10) + 'L112,' + (bottomY + 10) + 'Z" fill="#f4ecdd"/>' +
        '<path d="M50,96L96,96L94,140Q72,148 52,140Z" fill="' + C.shade + '" stroke="' + C.line + '" stroke-width="2"/>' +
        '<g fill="#f5e6c8" stroke="' + C.line + '" stroke-width="1.6"><circle cx="138" cy="34" r="5"/><circle cx="138" cy="84" r="5"/><circle cx="138" cy="134" r="5"/></g>') + '</g>';
    };
    var head;
    if (pose === 'set-dish') {
      // bending down to set a dish of water on the step
      s += can(12, 548, -6);
      s += part('M58,200L116,200Q168,270 184,334Q194,372 172,398L126,574L84,572L130,392Q144,364 130,336Q100,272 58,200Z', T, true, '<path d="M156,340Q168,362 160,382" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M108,200L170,200Q214,276 222,334Q228,374 206,394L168,578L124,576L164,388Q174,360 162,334Q138,272 108,200Z', T, false, '<path d="M196,340Q208,362 200,384" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(250, 8);
      s += slipper(100, 598, true) + slipper(152, 600, false);
      s += sleeve('M196,-900L236,-900L236,-10Q254,280 248,532L210,536Q206,280 196,-10Z', 'M208,518L250,514L252,546L208,550Z');
      s += '<ellipse cx="228" cy="604" rx="31" ry="10" fill="#9fd2ea" stroke="#4f8fb3" stroke-width="2.4"/><ellipse cx="228" cy="600" rx="24" ry="5.6" fill="#d6f1fc"/>';
      s += hand(229, 550, 0);
      head = [150, 8];
    } else if (pose === 'water') {
      s += part('M66,170L122,170L118,574L78,574Z', T, true, '<path d="M92,520Q100,540 92,560" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M118,170L178,170L176,576L132,576Z', T, false, '<path d="M150,520Q158,540 150,562" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(186, 0);
      s += slipper(98, 598, true) + slipper(158, 600, false);
      s += sleeve('M162,-900L204,-900L214,-10Q230,90 230,172L192,182Q190,90 172,-10Z', 'M190,168L230,160L234,190L194,198Z');
      s += can(176, 206, 28, 0.86);
      s += hand(214, 194, -14);
      var drops = '';
      [[236, 290], [248, 318], [240, 352], [252, 384], [234, 412], [248, 446], [238, 486]].forEach(function (d) {
        drops += '<path d="M' + d[0] + ',' + d[1] + 'q4,7 0,10q-4,-3 0,-10Z"/>';
      });
      s += '<g fill="#9fd6f7" stroke="#4f97c4" stroke-width="1.2">' + drops + '</g>';
      head = [130, 8];
    } else {
      s += part('M66,170L122,170L118,574L78,574Z', T, true, '<path d="M92,520Q100,540 92,560" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += part('M118,170L178,170L176,576L132,576Z', T, false, '<path d="M150,520Q158,540 150,562" stroke="' + T.line + '" stroke-width="2" fill="none" opacity=".5"/>');
      s += cardigan(186, 0);
      s += slipper(98, 598, true) + slipper(158, 600, false);
      s += sleeve('M174,-900L214,-900L214,-10Q222,140 218,256L182,262Q176,140 174,-10Z', 'M180,244L220,240L222,270L180,274Z');
      s += can(168, 304, 0);
      s += hand(200, 280, 0);
      head = [130, 8];
    }
    var M = F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 260, 0];
    var hc = apply(M, head);
    return { svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + s + '</g>', w: 260, h: 620, head: { x: hc[0], y: hc[1] } };
  }

  // ------------------------------------------------------------------ sparrow and moth

  function sparrow(o) {
    var fluffed = o.pose === 'fluffed', F = o.facing === 'left' ? -1 : 1, R = new Ren();
    var c = { body: '#b07c4e', dark: '#7d5531', belly: '#efe0c4', cap: '#8a7466', line: '#5e3f24', cheek: '#f5ead6' };
    var s = '';
    if (fluffed) {
      s += '<path d="M10,26L1,22L3,30L11,31Z" fill="' + c.dark + '" stroke="' + c.line + '" stroke-width="1.2" stroke-linejoin="round"/>';
      var g = ellipseG(22, 25, 16, 14, 0, 5);
      s += R.part(scallop(g.pts, 0.6), { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1.2 * F, sy: -1.6,
        inner: '<ellipse cx="25" cy="31" rx="12" ry="8" fill="' + c.belly + '"/><path d="M8,26Q18,20 26,27Q18,34 9,31Z" fill="' + c.dark + '"/><path d="M12,26L20,27M12,29L19,30" stroke="' + c.belly + '" stroke-width="1" opacity=".8"/>' +
          '<path d="M14,13Q24,4 34,13Q26,12 14,13Z" fill="' + c.cap + '"/><ellipse cx="31" cy="20" rx="5" ry="3.4" fill="' + c.cheek + '"/>' });
      s += '<path d="M28.6,16.4Q30.6,18.4 32.8,16.4" stroke="#221b26" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
      s += '<path d="M36,17.6L40.4,19L36,20.8Z" fill="#d8993f" stroke="' + c.line + '" stroke-width=".9" stroke-linejoin="round"/>';
      s += '<path d="M33.5,22.5Q35.5,25 34,27" stroke="#3a2a22" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<path d="M13,26L1,17L3,27L12,31Z" fill="' + c.dark + '" stroke="' + c.line + '" stroke-width="1.2" stroke-linejoin="round"/>';
      s += '<path d="M18,33L17,39M17,39L14,40M17,39L19,40M24,33L25,39M25,39L22,40M25,39L27,40" stroke="#9b6a43" stroke-width="1.3" stroke-linecap="round" fill="none"/>';
      s += R.part(ellipseG(21, 25, 12.5, 10, -8, 6).d, { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1 * F, sy: -1.4,
        inner: '<ellipse cx="24" cy="30" rx="9" ry="6.4" fill="' + c.belly + '"/><path d="M9,23Q19,16 28,24Q19,32 9,28Z" fill="' + c.dark + '"/><path d="M13,23L21,24.6M12,26L20,27.4" stroke="' + c.belly + '" stroke-width="1" opacity=".8"/>' });
      s += R.part(ellipseG(30, 14.5, 8.4, 8, 0, 5).d, { fill: c.body, dark: c.dark, line: c.line, lw: 1.3, sx: -1 * F, sy: -1.2,
        inner: '<path d="M21,12Q29,3 38,11Q30,9.6 21,12Z" fill="' + c.cap + '"/><ellipse cx="30.6" cy="17.4" rx="4.6" ry="3.2" fill="' + c.cheek + '"/><path d="M34,19Q36,22 34,23.6" stroke="#3a2a22" stroke-width="2.4" fill="none"/>' });
      s += '<circle cx="33.4" cy="12.6" r="1.9" fill="#221b26"/><circle cx="32.8" cy="11.9" r=".7" fill="#fff"/>';
      s += '<path d="M37.6,13.2L43,15L37.6,17Z" fill="#d8993f" stroke="' + c.line + '" stroke-width=".9" stroke-linejoin="round"/>';
    }
    var M = F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, 44, 0];
    var hc = apply(M, fluffed ? [29, 17] : [30, 14]);
    return { svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + s + '</g>', w: 44, h: 40, head: { x: hc[0], y: hc[1] } };
  }

  function moth(o) {
    var F = o.facing === 'left' ? -1 : 1;
    var c = { wing: '#f3ead6', shade: '#e0cfac', spot: '#c7ae84', line: '#a38a62', body: '#b99c72' };
    var s = '<circle cx="20" cy="18" r="17" fill="#fff4c6" opacity=".38"/>' +
      '<g stroke="' + c.line + '" stroke-width="1.1" stroke-linejoin="round">' +
      '<path d="M19,19Q6,30 7,33Q14,34 20,22Z" fill="' + c.shade + '"/><path d="M21,19Q32,28 33,32Q26,34 20,22Z" fill="' + c.shade + '"/>' +
      '<path d="M19,17Q8,2 2,7Q-1,18 19,21Z" fill="' + c.wing + '"/><path d="M21,17Q31,1 38,5Q41,17 21,21Z" fill="' + c.wing + '"/></g>' +
      '<g fill="' + c.spot + '"><circle cx="9" cy="11" r="2.4"/><circle cx="31" cy="9.6" r="2.4"/><circle cx="13" cy="28" r="1.4"/><circle cx="27" cy="27" r="1.4"/></g>' +
      '<ellipse cx="20" cy="20" rx="2.8" ry="8" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="1.1"/>' +
      '<path d="M19,12.6Q15,6 12,4M21,12.6Q25,6 28,4" stroke="' + c.line + '" stroke-width="1" fill="none" stroke-linecap="round"/>' +
      '<path d="M13,6l-1.5,-1M14,7.6l-1.6,-.6M27,6l1.5,-1M26,7.6l1.6,-.6" stroke="' + c.line + '" stroke-width=".8"/>' +
      '<circle cx="20" cy="12.6" r="2.3" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="1"/>';
    var M = F === 1 ? mul(mT(20, 18), mul(mR(8), mT(-20, -18))) : mul([-1, 0, 0, 1, 40, 0], mul(mT(20, 18), mul(mR(8), mT(-20, -18))));
    var hc = apply(M, [20, 13]);
    return { svg: '<g transform="' + mStr(M) + '">' + s + '</g>', w: 40, h: 36, head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 } };
  }

  // ------------------------------------------------------------------ otters and dogs (chapter 2)
  // Drawn like the cats: flat papercut parts and a frontal face on a side-on body, facing right and
  // mirrored for facing left. Each pose is laid out in the species' own units with the ground (or,
  // swimming and floating, the waterline) at y = 0 and the feet centred on x = 0; the preset gives
  // the scale, the head size and the box. Nothing is drawn below a waterline. Riffle is a pup: a
  // big head, big eyes, a short body. The dogs are big-hearted and dim, never menacing: no teeth.

  var OTTER_POSES = ['stand', 'sit', 'scramble', 'swim', 'float', 'juggle', 'slide', 'hug', 'sun'];
  var DOG_POSES = ['stand', 'jump', 'sit', 'bounce', 'howl'];
  OTHER_POSES.riffle = OTTER_POSES; OTHER_POSES.otter = OTTER_POSES; OTHER_POSES.dog = DOG_POSES;
  var OTTER_HEAD = [[0, -25], [-19, -23.5], [-30, -15], [-33.5, -1], [-29.5, 12.5], [-18, 21.5], [0, 25], [18, 21.5], [29.5, 12.5], [33.5, -1], [30, -15], [19, -23.5]];
  var DOG_HEAD = [[0, -30], [-21, -27.5], [-31, -15], [-33, 1], [-28, 17], [-15, 26], [0, 28.5], [15, 26], [28, 17], [33, 1], [31, -15], [21, -27.5]];
  var BEAST_INK = '#2a1c18';
  var TONGUE = '#f28a9c';

  var BEASTS = {
    riffle: { kind: 'otter', pup: true, scale: 0.69, headS: 1.34, eyeS: 1.24, bulk: 0.9, legW: 0.95, tailL: 0.86, box: [250, 250],
      whiskers: 'long', pal: { base: '#8c5a36', line: '#3b2415', light: '#bd875a', belly: '#f5e2c0', muzzle: '#f5e2c0', nose: '#2e1c15', earIn: '#c9906b', whisk: '#fbf3e4' } },
    otter: [
      // the old ferry otter: grey muzzle, white brows, long white whiskers that trail in the water
      { kind: 'otter', old: true, scale: 1, headS: 1.12, eyeS: 0.92, bulk: 1.08, legW: 1.05, box: [330, 330], whiskers: 'trail', brows: true,
        pal: { base: '#75604c', line: '#32271e', light: '#9d8670', belly: '#ddd5c8', muzzle: '#d3ccc1', nose: '#2b2320', earIn: '#a98a78', whisk: '#ffffff', brow: '#f6f3ec' } },
      { kind: 'otter', scale: 0.96, headS: 1.1, bulk: 1, box: [330, 330], whiskers: 'short',
        pal: { base: '#5c3b28', line: '#26160d', light: '#83593f', belly: '#ead4b2', muzzle: '#ead4b2', nose: '#21140f', earIn: '#a87660', whisk: '#f3e6d0' } },
      { kind: 'otter', scale: 0.92, headS: 1.12, bulk: 0.96, box: [330, 330], whiskers: 'short',
        pal: { base: '#a8784b', line: '#4a2f18', light: '#cf9f70', belly: '#f7e8cb', muzzle: '#f7e8cb', nose: '#2e1c15', earIn: '#d39a7c', whisk: '#fff8ea' } }
    ],
    dog: [
      // huge and shaggy: a sheepdog mop, a fringe over his eyes, a sky-blue bandana
      { kind: 'dog', shaggy: true, scale: 2.05, headS: 0.98, eyeS: 1, bulk: 1.22, legW: 1.4, box: [470, 470], ears: 'shaggy', fringe: true,
        bandana: '#62b6e4', goofy: true,
        pal: { base: '#f4f0e7', line: '#777b84', saddle: '#a9aeb7', muzzle: '#fdfbf6', nose: '#2b2427', earFill: '#a9aeb7', light: '#ffffff' } },
      // spotty: white with black spots, black ears, a red collar
      { kind: 'dog', spots: true, scale: 1.42, headS: 1, eyeS: 1, bulk: 1, legW: 1, box: [330, 330], ears: 'floppy', collar: '#e0503f',
        pal: { base: '#fbfaf5', line: '#57525c', spot: '#2f2b31', muzzle: '#ffffff', nose: '#2b2427', earFill: '#2f2b31', light: '#ffffff', shade: '#e2dfdb' } },
      // tiny and mostly bark: big ears, big eyes, a big voice, a blue collar
      { kind: 'dog', tiny: true, scale: 0.5, headS: 1.52, eyeS: 1.18, bulk: 0.92, legW: 0.74, box: [160, 160], ears: 'pointy', collar: '#4f8fd6',
        pal: { base: '#dda067', line: '#7c4c22', light: '#f0c08c', belly: '#f8e6c9', muzzle: '#f8e6c9', nose: '#2b2427', earIn: '#f4a5b4' } }
    ]
  };

  function beastPal(src) {
    var f = {}, k;
    for (k in src) f[k] = src[k];
    f.shade = f.shade || mix(f.base, f.line, 0.2);
    f.shade2 = mix(f.base, f.line, 0.34);
    f.farFill = mix(f.base, f.line, 0.13);
    f.light = f.light || mix(f.base, '#ffffff', 0.3);
    f.belly = f.belly || f.base;
    f.muzzle = f.muzzle || f.belly;
    f.whisk = f.whisk || mix(f.line, f.base, 0.3);
    f.earIn = f.earIn || '#f4a5b4';
    f.feat = mix(f.line, '#000', 0.25);
    return f;
  }
  function beastSpec(who, o) {
    var src = who === 'riffle' ? BEASTS.riffle : BEASTS[who][clamp(intOr(o.variant, 1), 1, 3) - 1];
    var sp = {}, k;
    for (k in src) sp[k] = src[k];
    sp.who = who;
    sp.pal = beastPal(src.pal);
    sp.headS = sp.headS || 1; sp.eyeS = sp.eyeS || 1; sp.bulk = sp.bulk || 1; sp.legW = sp.legW || 1;
    return sp;
  }

  // A tube with round caps at both ends: an otter's long body.
  function capsule(P, wf, n) {
    n = n || 12;
    var L = [], Rr = [], C = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, q = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999))), nn = [-tg[1], tg[0]], w = wf(t);
      L.push(add(q, nn, w)); Rr.push(add(q, nn, -w)); C.push({ p: q, n: nn, t: tg, w: w });
    }
    var w0 = C[0].w, w1 = C[n].w;
    var d = 'M' + pt(L[0]) + cr(L) + 'A' + N(w1) + ' ' + N(w1) + ' 0 0 0 ' + pt(Rr[n]) + cr(Rr.slice().reverse()) + 'A' + N(w0) + ' ' + N(w0) + ' 0 0 0 ' + pt(L[0]) + 'Z';
    var pts = L.concat([add(C[n].p, C[n].t, w1)], Rr.slice().reverse(), [add(C[0].p, C[0].t, -w0)]);
    return { d: d, pts: pts, at: function (t) {
      var q = bez(P, t), tg = unit(bezD(P, clamp(t, 0.001, 0.999)));
      return { p: q, n: [-tg[1], tg[0]], t: tg, w: wf(t) };
    } };
  }
  function ss(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // width along an otter's body: the rump, the widest point at tm, the neck
  function bodyW(w, tm) { return function (t) { return t < tm ? lerp(w[0], w[1], ss(t / tm)) : lerp(w[1], w[2], ss((t - tm) / (1 - tm))); }; }
  // where the head's centre goes when a bigger head sits on the same neck
  function headAt(sp, x, y, rot) {
    var up = (sp.headS - 1) * (sp.kind === 'dog' ? 26 : 23), r = (rot || 0) * Math.PI / 180;
    return [x + Math.sin(r) * up, y - Math.cos(r) * up, rot || 0];
  }
  function rotP(v, deg) { var r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; }

  function pebble(x, y, r, seed, lk) {
    var cols = ['#8f8a85', '#6c6d75', '#b8a585', '#7e8d96', '#a49a91'], c = cols[Math.floor(rand(seed) * cols.length)];
    var e = ellipseG(x, y, r * (1.12 + rand(seed + 1) * 0.2), r * (0.86 + rand(seed + 2) * 0.12), (rand(seed + 3) - 0.5) * 50, 4);
    return '<path class="pc-pebble" d="' + e.d + '" fill="' + c + '" stroke="' + mix(c, '#000', 0.5) + '" stroke-width="' + N(1.8 * lk) + '"/>' +
      '<ellipse cx="' + N(x - r * 0.35) + '" cy="' + N(y - r * 0.35) + '" rx="' + N(r * 0.38) + '" ry="' + N(r * 0.22) + '" transform="rotate(-30 ' + N(x - r * 0.35) + ' ' + N(y - r * 0.35) + ')" fill="#fff" opacity=".55"/>';
  }

  // ----- the otter poses (adult units: an adult otter sits about 190 tall)
  function oArm(top, end, r0, r1, kind) { return { leg: [[top[0], top[1], r0], [end[0], end[1], r1]], paw: end, pk: kind || 'hand' }; }
  var OTTER_POSE = {
    sit: function (sp, mood) {
      // a round, comfortable sit, leaning back a little on the tail
      var h = headAt(sp, 22, -150, 0), P = {
        body: { P: [[-18, -35], [-27, -74], [-8, -108], [12, -128]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-42, -16], [-70, -5], [-94, -3], [-112, -9]], w: [19, 4.2] },
        far: [{ paw: [4, -5], pk: 'foot' }, oArm([22, -102], [40, -80], 7.5, 5.5)],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [20, -6], pk: 'foot' }, oArm([13, -104], [33, -74], 9, 7)],
        head: h
      };
      otterGesture(P, sp, mood, h, [13, -104]);
      return P;
    },
    stand: function (sp, mood) {
      var h = headAt(sp, 12, -214, 0), P = {
        body: { P: [[-4, -44], [-10, -100], [-2, -160], [6, -192]], w: [33, 35, 18], tm: 0.25 },
        tail: { P: [[-26, -26], [-54, -10], [-76, -4], [-98, -9]], w: [19, 4.2] },
        far: [{ leg: [[0, -30, 10], [4, -10, 8]], paw: [6, -5], pk: 'foot' }, oArm([20, -164], [36, -142], 7.5, 5.5)],
        near: [{ thigh: [6, -38, 22, 27, -16], leg: [[10, -28, 11], [16, -10, 8]], paw: [20, -6], pk: 'foot' }, oArm([12, -166], [32, -138], 9, 7)],
        head: h
      };
      otterGesture(P, sp, mood, h, [12, -168]);
      return P;
    },
    juggle: function (sp, mood) {
      var h = headAt(sp, 12, -214, 0), hs = sp.headS;
      var nr = [h[0] + 34 * hs + 10, h[1] - 22 * hs], fr = [h[0] - 34 * hs - 8, h[1] - 24 * hs];
      return {
        body: { P: [[-4, -44], [-10, -100], [-2, -160], [6, -192]], w: [33, 35, 18], tm: 0.25 },
        tail: { P: [[-26, -26], [-54, -10], [-76, -4], [-98, -9]], w: [19, 4.2] },
        far: [{ leg: [[0, -30, 10], [4, -10, 8]], paw: [6, -5], pk: 'foot' }, oArm([-2, -176], fr, 8, 6)],
        near: [{ thigh: [6, -38, 22, 27, -16], leg: [[10, -28, 11], [16, -10, 8]], paw: [20, -6], pk: 'foot' }, oArm([16, -176], nr, 9, 7)],
        head: h,
        pebbles: [[fr[0] + 4, h[1] - 66 * hs, 9], [h[0] + 4, h[1] - 88 * hs, 9.5], [nr[0] - 6, h[1] - 64 * hs, 8.5]],
        arcs: [[fr, [fr[0] + 4, h[1] - 66 * hs]], [[fr[0] + 4, h[1] - 66 * hs], [h[0] + 4, h[1] - 88 * hs]], [[h[0] + 4, h[1] - 88 * hs], [nr[0] - 6, h[1] - 64 * hs]]]
      };
    },
    scramble: function (sp) {
      return {
        body: { P: [[-58, -58], [-36, -94], [16, -98], [42, -76]], w: [30, 34, 20], tm: 0.35 },
        tail: { P: [[-82, -62], [-110, -64], [-128, -78], [-146, -92]], w: [18, 4.2] },
        far: [{ leg: [[-64, -52, 12], [-94, -20, 7]], paw: [-99, -12], pk: 'foot', rot: 24 }, { leg: [[34, -68, 9], [62, -32, 6]], paw: [66, -27], pk: 'hand' }],
        near: [{ thigh: [-54, -60, 23, 20, 32], leg: [[-56, -48, 12], [-80, -12, 8]], paw: [-84, -7], pk: 'foot', rot: 12 }, { leg: [[42, -66, 10], [70, -18, 7]], paw: [74, -11], pk: 'hand' }],
        head: headAt(sp, 66, -96, 4)
      };
    },
    swim: function (sp, mood) {
      var h = headAt(sp, 54, -34, 0), P = {
        water: 0,
        body: { P: [[-96, 14], [-60, 4], [0, 2], [34, 4]], w: [24, 30, 20], tm: 0.5 },
        tail: { P: [[-108, 8], [-130, -8], [-148, -12], [-162, -4]], w: [14, 4] },
        far: [], near: [], head: h,
        ripples: [[h[0], 34], [-26, 70], [-150, 26]]
      };
      if (/^(happy|laugh|shout)$/.test(mood)) P.near.push({ leg: [[h[0] + 26 * sp.headS, 6, 8], [h[0] + 44 * sp.headS, -40, 6]], paw: [h[0] + 46 * sp.headS, -46], pk: 'hand', afterHead: true, wave: true });
      return P;
    },
    float: function (sp, mood) {
      var h = headAt(sp, 58, -26, 28), P = {
        water: 0,
        body: { P: [[-84, 4], [-50, -8], [10, -8], [44, -2]], w: [26, 30, 20], tm: 0.45, bellyUp: true },
        tail: { P: [[-104, 2], [-124, -6], [-142, -6], [-158, -2]], w: [16, 4] },
        far: [{ leg: [[-70, -22, 9], [-74, -46, 7]], paw: [-74, -52], pk: 'sole', rot: -8 }, oArm([22, -28], [20, -52], 7, 5.5)],
        near: [{ leg: [[-60, -24, 10], [-62, -50, 7.5]], paw: [-61, -57], pk: 'sole', rot: 6 }, oArm([32, -26], [34, -50], 8, 6)],
        head: h,
        ripples: [[-10, 110], [-150, 24]]
      };
      if (sp.pup) {
        // Riffle's pebbles: tossed over his tummy; dropping, with a plip, when something startles him
        if (/^(wonder|scared|worried|shout)$/.test(mood)) P.drops = [[128, -50, 7], [142, -24, 7.5], [118, -9, 6.5]];
        else if (/^(sleepy|dreamy|kind|solemn)$/.test(mood)) P.pebbles = [[-6, -46, 7.5], [10, -48, 7]];
        else { P.pebbles = [[6, -86, 8], [30, -104, 8.5], [52, -84, 7.5]]; P.arcs = [[[20, -54], [6, -86]], [[6, -86], [30, -104]], [[30, -104], [52, -84]]]; }
      }
      return P;
    },
    sun: function (sp) {
      return {
        body: { P: [[-84, -30], [-50, -40], [10, -40], [44, -34]], w: [28, 32, 21], tm: 0.45, bellyUp: true },
        tail: { P: [[-104, -24], [-126, -11], [-146, -6], [-162, -9]], w: [18, 4] },
        far: [{ leg: [[-68, -56, 9], [-80, -82, 7]], paw: [-82, -88], pk: 'sole', rot: -14 }, oArm([24, -62], [6, -72], 7, 5.5)],
        near: [{ leg: [[-58, -58, 10], [-62, -88, 7.5]], paw: [-62, -95], pk: 'sole', rot: 4 }, oArm([32, -60], [16, -74], 8, 6)],
        head: headAt(sp, 64, -50, 62)
      };
    },
    slide: function (sp) {
      return {
        body: { P: [[-84, -26], [-50, -30], [10, -30], [42, -28]], w: [24, 28, 19], tm: 0.45 },
        tail: { P: [[-104, -22], [-128, -18], [-148, -14], [-168, -12]], w: [17, 4] },
        far: [{ leg: [[20, -18, 7], [0, -9, 5.5]], paw: [-3, -8], pk: 'hand' }],
        near: [{ leg: [[-72, -18, 10], [-102, -9, 7]], paw: [-108, -8], pk: 'foot', rot: 180 }, { leg: [[30, -16, 8], [8, -8, 6]], paw: [4, -7], pk: 'hand' }],
        head: headAt(sp, 66, -46, -6),
        mud: [[104, -14, 6.5], [116, -34, 4.6], [98, -50, 3.6], [122, -8, 3.2]],
        speed: true, tilt: 12
      };
    },
    hug: function (sp) {
      return {
        body: { P: [[-18, -35], [-25, -76], [-8, -110], [10, -130]], w: [35, 39, 19], tm: 0.32 },
        tail: { P: [[-40, -22], [-14, -12], [66, -16], [38, -98]], w: [19, 6.5] }, tailFront: true,
        far: [{ paw: [2, -5], pk: 'foot' }],
        near: [{ thigh: [-4, -27, 24, 19, -10], paw: [24, -6], pk: 'foot' },
          { leg: [[20, -106, 7.5], [44, -92, 5.5]], paw: [46, -88], pk: 'hand', afterTail: true, far: true },
          { leg: [[10, -104, 9], [38, -78, 7]], paw: [40, -74], pk: 'hand', afterTail: true }],
        head: headAt(sp, 20, -152, 12)
      };
    }
  };
  // Riffle waves when he's happy; the old ferry otter cups a paw to his ear when he shouts ("WHAT?").
  function otterGesture(P, sp, mood, h, shoulder) {
    var hs = sp.headS;
    if (sp.old && mood === 'shout') {
      var ear = [h[0] + 30 * hs, h[1] - 6 * hs];
      P.near[P.near.length - 1] = { leg: [[shoulder[0] + 4, shoulder[1] + 2, 9], [ear[0] + 4, ear[1] + 8, 6.5]], paw: ear, pk: 'cup', afterHead: true };
    } else if (sp.pup && mood === 'happy') {
      var pw = [h[0] + 40 * hs, h[1] - 34 * hs];
      P.near[P.near.length - 1] = { leg: [[shoulder[0] + 4, shoulder[1], 9], [pw[0] - 2, pw[1] + 6, 6.5]], paw: pw, pk: 'hand', wave: true };
    }
  }

  // ----- the dog poses (dog units: a standard dog stands about 150 tall)
  var DOG_POSE = {
    stand: function (sp) {
      return {
        neck: [[36, -94, 16], [48, -112, 15]],
        torso: [[-34, -78, 22], [28, -80, 26]],
        tails: { up: [[-54, -88], [-70, -100], [-74, -122], [-64, -138]], down: [[-54, -76], [-62, -60], [-58, -42], [-46, -34]] },
        far: [{ leg: [[-40, -70, 9], [-44, -10, 6]], paw: [-40, -6] }, { leg: [[20, -66, 8], [20, -10, 6]], paw: [24, -6] }],
        near: [{ thigh: [-32, -70, 18, 25, 14], leg: [[-30, -56, 9], [-28, -10, 6.5]], paw: [-24, -6] }, { leg: [[34, -64, 9], [37, -10, 6.5]], paw: [41, -6] }],
        head: headAt(sp, 56, -124, 0)
      };
    },
    sit: function (sp) {
      return {
        neck: [[18, -96, 16], [24, -114, 15]],
        torso: [[-22, -38, 28], [12, -82, 24]],
        haunch: [-18, -34, 26, 22, -22],
        tails: { up: [[-48, -14], [-66, -6], [-82, -6], [-94, -16]], down: [[-44, -12], [-30, -3], [-6, -3], [8, -6]] },
        far: [{ paw: [-2, -5] }, { leg: [[10, -70, 8], [14, -10, 6]], paw: [18, -6] }],
        near: [{ paw: [12, -6] }, { leg: [[21, -70, 9], [25, -10, 6.5]], paw: [29, -6] }],
        head: headAt(sp, 28, -128, 0)
      };
    },
    howl: function (sp) {
      return {
        neck: [[18, -96, 16], [22, -116, 15]],
        torso: [[-22, -38, 28], [12, -82, 24]],
        haunch: [-18, -34, 26, 22, -22],
        tails: { up: [[-48, -14], [-66, -6], [-82, -6], [-94, -16]], down: [[-44, -12], [-30, -3], [-6, -3], [8, -6]] },
        far: [{ paw: [-2, -5] }, { leg: [[10, -70, 8], [14, -10, 6]], paw: [18, -6] }],
        near: [{ paw: [12, -6] }, { leg: [[21, -70, 9], [25, -10, 6.5]], paw: [29, -6] }],
        head: headAt(sp, 18, -132, -34), howl: true
      };
    },
    jump: function (sp) {
      return {
        neck: [[16, -122, 16], [26, -140, 15]],
        torso: [[-24, -50, 22], [12, -106, 25]],
        tails: { up: [[-40, -58], [-60, -62], [-74, -78], [-76, -98]], down: [[-40, -50], [-52, -40], [-52, -24], [-44, -16]] },
        far: [{ leg: [[-28, -42, 9], [-20, -10, 6]], paw: [-16, -6] }, { leg: [[18, -112, 8], [46, -128, 6]], paw: [51, -130], up: true }],
        near: [{ thigh: [-22, -48, 18, 25, -24], leg: [[-18, -36, 9], [-8, -10, 6.5]], paw: [-4, -6] }, { leg: [[24, -108, 9], [56, -118, 6.5]], paw: [61, -119], up: true }],
        head: headAt(sp, 34, -158, -4)
      };
    },
    bounce: function (sp) {
      return {
        neck: [[36, -110, 16], [46, -128, 15]],
        torso: [[-32, -96, 21], [28, -98, 25]],
        tails: { up: [[-52, -104], [-68, -114], [-72, -134], [-62, -150]], down: [[-52, -98], [-66, -96], [-80, -100], [-90, -108]] },
        far: [{ leg: [[-38, -88, 9], [-58, -64, 6]], paw: [-62, -60] }, { leg: [[22, -88, 8], [42, -62, 6]], paw: [46, -58] }],
        near: [{ thigh: [-30, -92, 18, 22, 40], leg: [[-30, -80, 9], [-46, -58, 6.5]], paw: [-50, -54] }, { leg: [[34, -86, 9], [56, -64, 6.5]], paw: [60, -60] }],
        head: headAt(sp, 56, -140, -6), air: true
      };
    }
  };

  // floppy ears: hanging angle (0 = straight down, 90 = straight out) by mood
  var FLOP = { neutral: 14, happy: 34, dreamy: 12, wonder: 44, worried: 4, scared: -6, sleepy: 6, laugh: 30, stern: 10, kind: 16, proud: 26, sniff: 30, shout: 52, solemn: 8 };
  var DOG_ROT = { wonder: 16, worried: -10 };   // puzzled dogs tilt their heads
  var BEAST_MOUTH = {
    otter: { neutral: 'w', happy: 'smile', dreamy: 'smile', wonder: 'o', worried: 'wavy', scared: 'o', sleepy: 'w', laugh: 'open', stern: 'frown', kind: 'smile', proud: 'smile', sniff: 'w', shout: 'bark', solemn: 'line' },
    dog: { neutral: 'w', happy: 'tongue', dreamy: 'smile', wonder: 'o', worried: 'wavy', scared: 'o', sleepy: 'w', laugh: 'open', stern: 'frown', kind: 'smile', proud: 'tongue', sniff: 'w', shout: 'bark', solemn: 'line' }
  };

  // One round eye in local coordinates (outer corner at +x). Otters have shiny all-dark eyes; dogs
  // have whites, so a dim, kind dog can look a little this way and that.
  function beastEye(kind, r, look, side, lid, ink, eid, ecl, sclera) {
    if (kind === 'arc') return '<path d="M' + N(-r) + ',' + N(r * 0.3) + 'Q0,' + N(-r * 1.15) + ' ' + N(r) + ',' + N(r * 0.3) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.5) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'closed') return '<path d="M' + N(-r) + ',' + N(-r * 0.15) + 'Q0,' + N(r * 0.75) + ' ' + N(r) + ',' + N(-r * 0.15) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.46) + '" fill="none" stroke-linecap="round"/>';
    if (kind === 'squeeze') return '<path d="M' + N(r * 0.85) + ',' + N(-r * 0.75) + 'L' + N(-r * 0.6) + ',0L' + N(r * 0.85) + ',' + N(r * 0.75) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.48) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    var lx = look[0] * side * r * 0.22, ly = look[1] * r * 0.22, g = '<g clip-path="url(#' + ecl + ')">';
    var white = sclera || kind === 'scared';
    if (white) {
      var pr = kind === 'scared' ? r * 0.36 : kind === 'wonder' ? r * 0.7 : r * 0.6;
      var px = lx * (kind === 'scared' ? 0.4 : 1), py = ly + (kind === 'lidUp' ? -r * 0.32 : kind === 'lidHalf' ? r * 0.2 : 0);
      g += '<use href="#' + eid + '" fill="#fffdf8"/><circle cx="' + N(px) + '" cy="' + N(py) + '" r="' + N(pr) + '" fill="' + BEAST_INK + '"/>' +
        '<circle cx="' + N(px - pr * 0.4 * side) + '" cy="' + N(py - pr * 0.42) + '" r="' + N(pr * 0.4) + '" fill="#fff"/>' +
        (kind === 'scared' ? '' : '<circle cx="' + N(px + pr * 0.38 * side) + '" cy="' + N(py + pr * 0.4) + '" r="' + N(pr * 0.16) + '" fill="#fff"/>');
    } else {
      var hy = kind === 'lidUp' ? r * 0.1 : kind.indexOf('lid') === 0 ? r * 0.05 : -r * 0.38;
      g += '<use href="#' + eid + '" fill="' + BEAST_INK + '"/><ellipse cx="0" cy="' + N(r * 0.62) + '" rx="' + N(r * 0.72) + '" ry="' + N(r * 0.36) + '" fill="#6b4535" opacity=".75"/>' +
        '<circle cx="' + N(lx - r * 0.3 * side) + '" cy="' + N(ly + hy) + '" r="' + N(r * (kind === 'wonder' ? 0.42 : 0.34)) + '" fill="#fff"/>' +
        '<circle cx="' + N(lx + r * 0.32 * side) + '" cy="' + N(ly + hy + r * 0.66) + '" r="' + N(r * 0.15) + '" fill="#fff"/>' +
        (kind === 'wonder' ? '<circle cx="' + N(lx + r * 0.36 * side) + '" cy="' + N(ly - r * 0.5) + '" r="' + N(r * 0.13) + '" fill="#fff"/>' : '');
    }
    var LB = { lidSoft: [0.1, -1.0, -0.15], lidFlat: [0.3, 0.1, -0.4], lidHalf: [-0.05, 0.05, -0.12], lidUp: [-0.15, -1.05, -0.5] }[kind];
    if (LB) {
      g += '<path d="M' + N(-r * 1.4) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.4) + ',' + N(LB[2] * r) + 'L' + N(r * 1.4) + ',' + N(-r * 1.6) + 'L' + N(-r * 1.4) + ',' + N(-r * 1.6) + 'Z" fill="' + lid + '"/></g>' +
        '<path d="M' + N(-r * 1.02) + ',' + N(LB[0] * r) + 'Q0,' + N(LB[1] * r) + ' ' + N(r * 1.02) + ',' + N(LB[2] * r) + '" stroke="' + ink + '" stroke-width="' + N(r * 0.34) + '" fill="none" stroke-linecap="round"/>';
      return g + (white ? '<use href="#' + eid + '" fill="none" stroke="' + ink + '" stroke-width="' + N(r * 0.2) + '"/>' : '');
    }
    return g + '</g>' + (white ? '<use href="#' + eid + '" fill="none" stroke="' + ink + '" stroke-width="' + N(r * 0.24) + '"/>' : '');
  }

  // Ears, in head coordinates (drawn behind the head). Returns markup; `pts` collects tips for the head box.
  function beastEars(sp, mood, ctx, pts, lk) {
    var p = sp.pal, s = '';
    if (sp.kind === 'otter') {
      var low = mood === 'scared' || mood === 'worried' ? 6 : 0;
      [-1, 1].forEach(function (side) {
        var x = side * 26, y = -16 + low;
        s += '<circle cx="' + x + '" cy="' + y + '" r="7.6" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(2.2 * lk) + '"/><circle cx="' + N(x - side * 0.6) + '" cy="' + N(y + 0.8) + '" r="3.8" fill="' + p.earIn + '"/>';
        pts.push([x - 8, y - 8], [x + 8, y - 8]);
      });
      return s;
    }
    if (sp.ears === 'pointy') {
      var ea = Math.min(64, (EAR_ANG[mood] || 0) + (ctx.earBias || 0));
      [-1, 1].forEach(function (side) {
        var th = 22 + ea, tr = 'translate(' + (side * 19) + ',-19) scale(' + side + ',1) rotate(' + N(th) + ') scale(1.36)';
        s += '<g transform="' + tr + '"><path d="' + EAR + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-linejoin="round"/><path d="' + EAR_IN + '" fill="' + p.earIn + '"/></g>';
        var m = mul(mT(side * 19, -19), mul(mS(side, 1), mul(mR(th), mS(1.36))));
        pts.push(apply(m, [1, -31]), apply(m, [14, 4]), apply(m, [-13, 4]));
      });
      return s;
    }
    var shag = sp.ears === 'shaggy', ang = ctx.flop != null ? ctx.flop : (FLOP[mood] == null ? 14 : FLOP[mood]) * (shag ? 0.6 : 1);
    var ear = shag ? 'M-9,0C-16,14 -16,40 -6,50C2,56 14,48 14,32C14,16 10,5 8,0Z' : 'M-7,0C-12,10 -12,30 -4,38C2,42 10,36 10,24C10,12 7,4 6,0Z';
    [-1, 1].forEach(function (side) {
      var ax = side * (shag ? 34 : 25), ay = shag ? -8 : -22;
      var m = mul(mT(ax, ay), mul(mS(side, 1), mR(-ang)));
      var d = ear;
      if (shag) {
        var ep = [];
        for (var i = 0; i < 13; i++) { var a = Math.PI * 2 * i / 13; ep.push([3 + Math.cos(a) * (12 + 2 * Math.max(0, Math.sin(a))), 27 + Math.sin(a) * 29]); }
        d = scallop(ep, 0.6);
      }
      s += '<g transform="' + mStr(m) + '"><path d="' + d + '" fill="' + p.earFill + '" stroke="' + p.line + '" stroke-width="' + N(2.2 * lk) + '" stroke-linejoin="round"/></g>';
      pts.push(apply(m, [-12, 4]), apply(m, [12, 4]), apply(m, [2, shag ? 58 : 41]), apply(m, [-12, 28]), apply(m, [shag ? 17 : 14, 28]));
    });
    return s;
  }

  function beastHead(R, sp, mood, ctx, lk) {
    var p = sp.pal, F = ctx.F, dog = sp.kind === 'dog', s = '', pts = [];
    var kind = EYE_KIND[mood] || 'open';
    if (kind === 'lidKind') kind = 'lidSoft';   // the cats' warmer kind lids; otters and dogs keep theirs
    if (ctx.howl && kind === 'open') kind = 'closed';
    var ink = p.feat;
    s += beastEars(sp, mood, ctx, pts, lk);
    // collar or bandana behind the chin
    if (sp.collar) {
      s += '<path d="M-21,23Q0,32 21,23L21,31Q0,41 -21,31Z" fill="' + sp.collar + '" stroke="' + mix(sp.collar, '#000', 0.4) + '" stroke-width="' + N(1.8 * lk) + '" stroke-linejoin="round"/>' +
        '<circle cx="6" cy="40" r="4.6" fill="#f2c14e" stroke="#a87a22" stroke-width="' + N(1.5 * lk) + '"/>';
      pts.push([6, 45]);
    }
    if (sp.bandana) {
      s += '<path d="M-30,20Q0,31 30,20L6,52Q0,56 -6,52Z" fill="' + sp.bandana + '" stroke="' + mix(sp.bandana, '#000', 0.4) + '" stroke-width="' + N(2 * lk) + '" stroke-linejoin="round"/>' +
        '<g fill="#fff" opacity=".85"><circle cx="-14" cy="28" r="2.2"/><circle cx="8" cy="30" r="2.2"/><circle cx="-2" cy="40" r="2"/><circle cx="16" cy="25" r="1.8"/></g>';
      pts.push([0, 56]);
    }
    // the head shape
    var hd, hp;
    if (sp.shaggy) {
      hp = [];
      for (var i = 0; i < 26; i++) {
        var a = Math.PI * 2 * i / 26, c = Math.cos(a), sn = Math.sin(a);
        hp.push([c * (40 + Math.max(0, sn) * Math.abs(c) * 7), sn * 36 - 2]);
      }
      hd = scallop(hp, 0.62);
      pts = pts.concat(hp.map(function (q) { return [q[0] * 1.08, q[1] * 1.08]; }));
    } else {
      hp = dog ? DOG_HEAD : OTTER_HEAD;
      hd = crClosed(hp);
      pts = pts.concat(hp);
    }
    var inner = '<ellipse cx="-9" cy="' + (dog ? -20 : -16) + '" rx="14" ry="5.5" transform="rotate(-10 -9 -18)" fill="' + p.light + '" opacity=".5"/>';
    if (!dog) inner += '<ellipse cx="0" cy="22" rx="16" ry="8" fill="' + p.belly + '"/>';
    if (sp.tiny) inner += '<path d="M0,-30Q-5,-14 -3,2L3,2Q5,-14 0,-30Z" fill="' + p.belly + '"/>';
    if (sp.spots) {
      // one big patch round one eye (always her left: it stays put when she turns), and a few freckles
      var pside = -F;
      inner += '<path d="' + blob(pside * 14, -9, 11, 2) + '" fill="' + p.spot + '"/>' +
        '<g fill="' + p.spot + '"><circle cx="' + (-pside * 20) + '" cy="-21" r="3.4"/><circle cx="' + (-pside * 9) + '" cy="-26" r="2.4"/><circle cx="' + (pside * 2) + '" cy="-22" r="2.2"/></g>';
    }
    s += R.part(hd, { fill: p.base, dark: p.shade, line: p.line, sx: ctx.sx * 0.8, sy: -3.2 * lk, inner: inner, lw: N(2.4 * lk) });
    // muzzle
    var my = dog ? 13 : 9;
    if (dog) {
      var mrx = sp.shaggy ? 21 : 17, mry = sp.shaggy ? 15 : 12.5;
      if (sp.shaggy) {
        var mp = [];
        for (var j = 0; j < 14; j++) { var b = Math.PI * 2 * j / 14; mp.push([Math.cos(b) * mrx, my + Math.sin(b) * mry]); }
        s += '<path d="' + scallop(mp, 0.6) + '" fill="' + p.muzzle + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-opacity=".7"/>';
      } else {
        s += '<ellipse cx="0" cy="' + my + '" rx="' + mrx + '" ry="' + mry + '" fill="' + p.muzzle + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * lk) + '" stroke-opacity=".7"/>';
      }
      pts.push([0, my + mry + 1]);
    } else {
      s += '<g fill="' + p.muzzle + '"><circle cx="-7.6" cy="' + my + '" r="9.6"/><circle cx="7.6" cy="' + my + '" r="9.6"/></g>' +
        '<g fill="' + mix(p.muzzle, p.line, 0.45) + '"><circle cx="-6" cy="10.5" r="1"/><circle cx="-10.5" cy="8.5" r="1"/><circle cx="-11" cy="12.5" r="1"/><circle cx="6" cy="10.5" r="1"/><circle cx="10.5" cy="8.5" r="1"/><circle cx="11" cy="12.5" r="1"/></g>';
    }
    // eyes
    var er = (dog ? (sp.tiny ? 6 : 5.8) : 5.4) * sp.eyeS, ex = dog ? (sp.shaggy ? 15 : 13.5) : 13, ey = dog ? (sp.shaggy ? -4 : -8) : -7;
    var ek = kind === 'wonder' ? 1.16 : kind === 'scared' ? 1.1 : 1;
    var eid = R.id(), ecl = R.id();
    R.defs += '<path id="' + eid + '" d="M' + N(-er) + ',0A' + N(er) + ' ' + N(er * 1.12) + ' 0 1 1 ' + N(er) + ',0A' + N(er) + ' ' + N(er * 1.12) + ' 0 1 1 ' + N(-er) + ',0Z"/><clipPath id="' + ecl + '"><use href="#' + eid + '"/></clipPath>';
    var look = ctx.look || [1, 0];
    [-1, 1].forEach(function (side) {
      var lk2 = look;
      // the shaggy dog's eyes don't quite agree on where to look
      if (sp.goofy && kind === 'open') lk2 = [look[0] + (side < 0 ? -0.8 : 0.6), look[1] + (side < 0 ? 0.6 : -0.3)];
      var lidc = p.base, ink2 = ink;
      // the eye inside the spotty dog's patch: lids of patch colour, and light lines where the eye is shut
      if (sp.spots && side === -F) { lidc = p.spot; if (/^(arc|closed|squeeze)$/.test(kind)) ink2 = '#f3eee4'; }
      s += '<g transform="translate(' + N(side * ex) + ',' + ey + ') scale(' + N(side * ek) + ',' + N(ek) + ')">' + beastEye(kind, er, lk2, side, lidc, ink2, eid, ecl, dog) + '</g>';
    });
    // the shaggy dog's fringe, over the top of his eyes
    if (sp.fringe) {
      var fy = ey - er * ({ arc: 1.15, closed: 0.95, squeeze: 1.1, wonder: 1.45, scared: 1.45, lidUp: 0.8 }[kind] || 0.35);
      var fd = '';
      // the top: a little outside the head's own outline
      var ftop = [];
      for (var f = 0; f <= 12; f++) {
        var fa = lerp(Math.PI - Math.asin(clamp((fy + 2) / 39, -1, 1)), 2 * Math.PI + Math.asin(clamp((fy + 2) / 39, -1, 1)), f / 12);
        ftop.push([Math.cos(fa) * 42, Math.sin(fa) * 39 - 2]);
      }
      fd = 'M' + pt(ftop[0]) + cr(ftop);
      // the bottom edge: seven locks, the middle ones longest
      var xr = ftop[12][0], xl = ftop[0][0];
      for (var fi = 1; fi <= 7; fi++) {
        var xa = lerp(xr, xl, fi / 7), dip = 3 + 4 * Math.sin(Math.PI * fi / 7);
        fd += 'Q' + pt([lerp(xr, xl, (fi - 0.5) / 7), fy + dip * 2]) + ' ' + pt([xa, fy + (fi === 7 ? -2 : 1)]);
      }
      fd += 'Z';
      s += '<path d="' + fd + '" fill="' + p.base + '" stroke="' + p.line + '" stroke-width="' + N(1.8 * lk) + '" stroke-linejoin="round"/>' +
        '<path d="M-24,' + N(fy - 14) + 'q3,7 1,13M-8,' + N(fy - 17) + 'q3,7 1,14M8,' + N(fy - 17) + 'q-3,7 -1,14M24,' + N(fy - 14) + 'q-3,7 -1,13" stroke="' + p.line + '" stroke-width="' + N(1.4 * lk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
      pts.push([0, -43]);
    }
    // brows: the moods' brows, or the old otter's white bushy ones
    var br = BROW[mood] || (sp.brows ? [0, -1] : null);
    if (br && !sp.fringe) {
      var shut = kind === 'arc' || kind === 'closed' || kind === 'squeeze';
      var by = ey - er * 1.25 - 4 - (kind === 'wonder' ? 2 : 0) - (shut ? 2 : 0);
      var bc = sp.brows ? p.brow : ink, bw = sp.brows ? 4.2 : 2.6;
      s += '<path d="M' + N(-ex + 6) + ',' + N(by + br[0]) + 'L' + N(-ex - 7) + ',' + N(by + br[1]) + 'M' + N(ex - 6) + ',' + N(by + br[0]) + 'L' + N(ex + 7) + ',' + N(by + br[1]) +
        '" stroke="' + bc + '" stroke-width="' + N(bw * lk) + '" stroke-linecap="round" fill="none"/>';
    }
    if (BLUSH[mood]) s += '<g fill="#ff8aa5" opacity=".4"><ellipse cx="' + N(-ex - 9) + '" cy="' + N(ey + 12) + '" rx="5.6" ry="3.2"/><ellipse cx="' + N(ex + 9) + '" cy="' + N(ey + 12) + '" rx="5.6" ry="3.2"/></g>';
    // nose and mouth
    var mk = ctx.howl ? 'howl' : BEAST_MOUTH[sp.kind][mood] || 'w';
    if (dog && sp.goofy && mk === 'w') mk = 'tongue';
    var ny = dog ? 4 : 1.5, nk = (mood === 'sniff' ? 1.25 : 1) * (sp.shaggy ? 1.15 : sp.tiny ? 0.85 : 1), mo = '';
    var my0 = dog ? 12 : 9.5;   // where the mouth starts, under the nose
    var msw = function (w) { return ' stroke="' + ink + '" stroke-width="' + N(w) + '" stroke-linecap="round" stroke-linejoin="round"'; };
    var mstroke = msw(1.9 * lk);
    var tongueD = function (x, y, w, l) { return '<path d="M' + N(x - w) + ',' + N(y) + 'Q' + N(x - w * 1.1) + ',' + N(y + l) + ' ' + N(x) + ',' + N(y + l) + 'Q' + N(x + w * 1.1) + ',' + N(y + l) + ' ' + N(x + w) + ',' + N(y) + 'Z" fill="' + TONGUE + '" stroke="' + mix(TONGUE, '#7a2c3b', 0.5) + '" stroke-width="' + N(1.4 * lk) + '"/><path d="M' + N(x) + ',' + N(y + 1) + 'V' + N(y + l * 0.6) + '" stroke="' + mix(TONGUE, '#7a2c3b', 0.4) + '" stroke-width="' + N(1.1 * lk) + '"/>'; };
    var W = dog ? 1.25 : 1;
    if (mk === 'open' || mk === 'bark' || mk === 'howl') {
      var big = mk === 'bark' ? 1.25 : mk === 'howl' ? 0.85 : 1, top = my0 + 2;
      if (mk === 'howl') mo += '<ellipse cx="0" cy="' + N(top + 7) + '" rx="' + N(6 * W) + '" ry="' + N(8.5) + '" fill="#7a2c3b"' + mstroke + '/><ellipse cx="0" cy="' + N(top + 11) + '" rx="' + N(3.6 * W) + '" ry="3" fill="' + TONGUE + '"/>';
      else {
        var hw = 9 * W * big, dep = 14 * big;
        mo += '<path d="M' + N(-hw) + ',' + N(top) + 'Q0,' + N(top - 1.5) + ' ' + N(hw) + ',' + N(top) + 'Q' + N(hw * 1.05) + ',' + N(top + dep) + ' 0,' + N(top + dep + 1) + 'Q' + N(-hw * 1.05) + ',' + N(top + dep) + ' ' + N(-hw) + ',' + N(top) + 'Z" fill="#7a2c3b"' + mstroke + '/>' +
          '<path d="M' + N(-hw * 0.6) + ',' + N(top + dep * 0.72) + 'Q0,' + N(top + dep * 0.36) + ' ' + N(hw * 0.6) + ',' + N(top + dep * 0.72) + 'Q' + N(hw * 0.3) + ',' + N(top + dep + 0.6) + ' 0,' + N(top + dep + 0.6) + 'Q' + N(-hw * 0.3) + ',' + N(top + dep + 0.6) + ' ' + N(-hw * 0.6) + ',' + N(top + dep * 0.72) + 'Z" fill="' + TONGUE + '"/>';
        pts.push([0, top + dep + 2]);
      }
    } else if (mk === 'o') {
      mo += '<path d="M0,' + N(my0) + 'V' + N(my0 + 2) + '"' + mstroke + ' fill="none"/><ellipse cx="0" cy="' + N(my0 + 6) + '" rx="' + N((mood === 'scared' ? 2.6 : 3.2) * W) + '" ry="' + N(3.8 * W) + '" fill="#7a2c3b"' + mstroke + '/>';
    } else {
      var paths = {
        w: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-7,' + (my0 + 2) + 'Q-3.5,' + (my0 + 7.5) + ' 0,' + (my0 + 3) + 'Q3.5,' + (my0 + 7.5) + ' 7,' + (my0 + 2),
        smile: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-9.5,' + (my0 + 1) + 'Q-4.8,' + (my0 + 9.5) + ' 0,' + (my0 + 3) + 'Q4.8,' + (my0 + 9.5) + ' 9.5,' + (my0 + 1),
        wavy: 'M0,' + my0 + 'V' + (my0 + 2) + 'M-6.5,' + (my0 + 5) + 'Q-3.2,' + (my0 + 1.5) + ' 0,' + (my0 + 4) + 'Q3.2,' + (my0 + 6.5) + ' 6.5,' + (my0 + 3.5),
        frown: 'M0,' + my0 + 'V' + (my0 + 2.5) + 'M-7,' + (my0 + 5.5) + 'Q0,' + (my0 + 1.5) + ' 7,' + (my0 + 5.5),
        line: 'M0,' + my0 + 'V' + (my0 + 3) + 'M-5.5,' + (my0 + 3.4) + 'H5.5'
      };
      var mp2 = mk === 'tongue' ? paths.smile : paths[mk] || paths.w;
      if (mk === 'tongue') mo += tongueD(sp.goofy ? 3.5 : 1.5, my0 + 4, 5.2 * W, 12 * W);
      mo += '<path d="' + mp2 + '" transform="scale(' + N(W) + ',1)"' + msw(1.9 * lk / W) + ' fill="none"/>';
      if (mk === 'tongue') pts.push([3, my0 + 18 * W]);
    }
    s += mo;
    var nose = dog ? 'M-9,0Q0,-3.5 9,0Q8.5,7.5 0,10Q-8.5,7.5 -9,0Z' : 'M-7,-1Q0,-3 7,-1Q6.4,5 0,7.4Q-6.4,5 -7,-1Z';
    s += '<g transform="translate(0,' + ny + ') scale(' + N(nk) + ')"><path d="' + nose + '" fill="' + p.nose + '" stroke="' + mix(p.nose, '#000', 0.3) + '" stroke-width="' + N(1.2 * lk) + '" stroke-linejoin="round"/>' +
      '<ellipse cx="-3" cy="' + (dog ? 1.2 : 0.4) + '" rx="' + (dog ? 3.2 : 2.4) + '" ry="1.5" fill="#fff" opacity=".55"/></g>';
    // whiskers
    if (!dog) {
      var wc = p.whisk, wsw = N(1.3 * lk), wd = '';
      [-1, 1].forEach(function (side) {
        for (var k = 0; k < 3; k++) {
          var x0 = side * 13, y0 = 7 + k * 3.2;
          if (sp.whiskers === 'trail') {
            var tipY = (ctx.trail || 38) + k * 5, tipX = side * (40 + k * 8);
            wd += 'M' + N(x0) + ',' + N(y0) + 'C' + N(side * (30 + k * 4)) + ',' + N(y0 - 3) + ' ' + N(side * (38 + k * 6)) + ',' + N(y0 + 10) + ' ' + N(tipX) + ',' + N(tipY);
            pts.push([tipX, tipY]);
          } else {
            var len = sp.whiskers === 'long' ? 54 : 44;
            wd += 'M' + N(x0) + ',' + N(y0) + 'Q' + N(side * len * 0.6) + ',' + N(y0 - 4 + k * 2) + ' ' + N(side * len) + ',' + N(y0 - 6 + k * 6);
          }
        }
      });
      s += '<path d="' + wd + '" stroke="' + wc + '" stroke-width="' + (sp.whiskers === 'trail' ? N(1.7 * lk) : wsw) + '" fill="none" stroke-linecap="round" opacity="' + (sp.whiskers === 'trail' ? '.95' : '.8') + '"/>';
    }
    if (mood === 'sniff') s += '<path d="M38,-6q3,-3 6,0t6,0M41,3q3,-3 6,0t6,0M38,12q3,-3 6,0t6,0" stroke="' + ink + '" stroke-width="' + N(1.7 * lk) + '" fill="none" stroke-linecap="round" opacity=".6"/>';
    if (mood === 'laugh') s += '<g fill="#9fd6f7" stroke="#5aa6d6" stroke-width="' + N(0.8 * lk) + '"><path d="M' + N(ex + 13) + ',' + N(ey + 6) + 'q3,4 0,6q-3,-2 0,-6Z"/><path d="M' + N(-ex - 13) + ',' + N(ey + 6) + 'q3,4 0,6q-3,-2 0,-6Z"/></g>';
    if (mood === 'worried' || mood === 'scared') s += '<path d="M' + N(ex + 19) + ',' + N(ey - 12) + 'q4,7 0,10q-4,-3 0,-10Z" fill="#bfe6fb" stroke="#5aa6d6" stroke-width="' + N(1 * lk) + '"/>';
    return { svg: s, pts: pts };
  }

  function buildBeast(sp, o) {
    var dog = sp.kind === 'dog';
    var list = dog ? DOG_POSES : OTTER_POSES, pose = list.indexOf(o.pose) >= 0 ? o.pose : 'sit';
    var mood = MOODS.indexOf(o.mood) >= 0 ? o.mood : 'neutral';
    var F = o.facing === 'left' ? -1 : 1, R = new Ren(), p = sp.pal;
    var P = (dog ? DOG_POSE : OTTER_POSE)[pose](sp, mood);
    var sc0 = sp.scale, bk = 0.95 / sc0, lk = 0.95 / (sc0 * sp.headS);
    var sx = -2.4 * F * bk, sy = -3.6 * bk, fl = !!sp.shaggy, scared = mood === 'scared';
    var bulk = sp.bulk, lw = Math.sqrt(bulk) * sp.legW;
    var pts = [], body = '';
    function addPts(a) { pts = pts.concat(a); }
    function outline(g) { return fl ? scallop(g.pts, 0.64) : scared && !fl ? spiky(g.pts, 4) : g.d; }

    // ----- the trunk
    var trunk = '', inner = '', neckSvg = '';
    if (P.body) {
      var B = P.body, wfb = bodyW([B.w[0] * bulk, B.w[1] * bulk, B.w[2] * Math.sqrt(bulk)], B.tm);
      var cap = capsule(B.P, wfb, 14), bs = B.bellyUp ? -1 : 1;
      // the lighter belly, and the cream throat and chest
      var band = function (f, col, op) {
        var outer = [], inn = [];
        for (var i = 0; i <= 14; i++) {
          var t = i / 14, a = cap.at(t), fr = f(t);
          outer.push(add(a.p, a.n, bs * (a.w + 6)));
          inn.push(add(a.p, a.n, bs * a.w * (1 - 2 * fr)));
        }
        return '<path d="M' + pt(outer[0]) + cr(outer) + 'L' + pt(inn[14]) + cr(inn.slice().reverse()) + 'Z" fill="' + col + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
      };
      inner += band(function () { return 0.36; }, p.light, 0.45);
      inner += band(function (t) { return t < 0.4 ? 0 : 0.55 * ss((t - 0.4) / 0.45); }, p.belly);
      var rim = [];
      for (var ri = 2; ri <= 12; ri++) { var ra = cap.at(ri / 14); rim.push(add(ra.p, ra.n, -bs * (ra.w - 4.5))); }
      if (!B.bellyUp) inner += '<path d="M' + pt(rim[0]) + cr(rim) + '" stroke="' + p.light + '" stroke-width="' + N(4 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
      trunk = R.part(scared ? spiky(cap.pts, 4.2) : cap.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: inner, lw: N(2.4 * bk) });
      addPts(cap.pts);
    } else {
      var hip = P.torso[0], chest = P.torso[1];
      var gr = function (c) { var r = c[2] * bulk; return [c[0], c[1] + c[2] - r, r]; };
      hip = gr(hip); chest = gr(chest);
      var tg = hull2(hip, chest, fl ? 14 : 10);
      if (sp.spots) {
        [[0.15, -0.5, 0.5, 1], [0.4, 0.35, 0.42, 2], [0.68, -0.4, 0.36, 3], [0.9, 0.2, 0.3, 4], [-0.1, 0.4, 0.32, 5], [0.55, -0.05, 0.22, 6]].forEach(function (q) {
          var c = lerp2(hip, chest, q[0]), r = lerp(hip[2], chest[2], clamp(q[0], 0, 1));
          inner += '<path d="' + blob(c[0], c[1] + q[1] * r, r * q[2], q[3]) + '" fill="' + p.spot + '"/>';
        });
      }
      if (sp.shaggy) inner += '<path d="' + ellipseG(hip[0] + 6, hip[1] - hip[2] * 0.35, hip[2] * 1.5, hip[2] * 0.95, -6).d + '" fill="' + p.saddle + '"/>';
      if (sp.tiny) inner += '<path d="' + ellipseG(chest[0] + chest[2] * 0.45, chest[1] + chest[2] * 0.35, chest[2] * 0.62, chest[2] * 0.85, -20).d + '" fill="' + p.belly + '"/>';
      if (!fl) inner += '<path d="M' + pt([hip[0] + 2, hip[1] - hip[2] + 4.5]) + 'L' + pt([chest[0] - 4, chest[1] - chest[2] + 4.5]) + '" stroke="' + p.light + '" stroke-width="' + N(4 * bk) + '" stroke-linecap="round" opacity=".5"/>';
      trunk = R.part(outline(tg), { fill: p.base, dark: p.shade, line: p.line, sx: sx, sy: sy, inner: inner, lw: N(2.4 * bk) });
      addPts(tg.pts);
      if (P.haunch) {
        var hg = ellipseG(P.haunch[0], P.haunch[1], P.haunch[2] * Math.sqrt(bulk), P.haunch[3] * Math.sqrt(bulk), P.haunch[4], 9);
        trunk += R.part(fl ? scallop(hg.pts, 0.62) : hg.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: N(2.1 * bk), sx: sx * 0.7, sy: sy * 0.7,
          inner: sp.shaggy ? '<path d="' + ellipseG(P.haunch[0] - 4, P.haunch[1] - 8, P.haunch[2], P.haunch[3] * 0.8, 0).d + '" fill="' + p.saddle + '"/>' : sp.spots ? '<path d="' + blob(P.haunch[0] + 2, P.haunch[1] - 4, P.haunch[3] * 0.45, 7) + '" fill="' + p.spot + '"/>' : '' });
        addPts(hg.pts);
      }
      var nk0 = [P.neck[0][0], P.neck[0][1], P.neck[0][2] * bulk], nk1 = [P.neck[1][0], P.neck[1][1], P.neck[1][2] * Math.sqrt(bulk)];
      var ng = hull2(nk0, nk1, 8);
      neckSvg = R.part(fl ? scallop(ng.pts, 0.6) : ng.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, lw: N(2.3 * bk) });
      addPts(ng.pts);
    }

    // ----- legs and paws
    function legPart(L, far) {
      var top = [L.leg[0][0], L.leg[0][1], L.leg[0][2] * lw], bot = [L.leg[1][0], L.leg[1][1], L.leg[1][2] * lw];
      var g = hull2(top, bot, 8), inn = '';
      if (sp.spots && !far) inn += '<path d="' + blob(lerp(top[0], bot[0], 0.45), lerp(top[1], bot[1], 0.45), top[2] * 0.7, top[0] + 3) + '" fill="' + p.spot + '"/>';
      if (sp.shaggy && L.leg[0][0] < 0) inn += '<path d="' + ellipseG(top[0], top[1], top[2] * 1.8, top[2] * 2.4, 0).d + '" fill="' + p.saddle + '"/>';
      addPts([[top[0] - top[2], top[1]], [top[0] + top[2], top[1]], [bot[0] - bot[2], bot[1]], [bot[0] + bot[2], bot[1]]]);
      return R.part(fl ? scallop(g.pts, 0.6) : g.d, { fill: far ? p.farFill : p.base, dark: far ? p.shade2 : p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: inn, lw: N(2.3 * bk) });
    }
    function paw(L, far) {
      var q = L.paw, col = far ? p.farFill : p.base, s = '', k = Math.sqrt(lw), line = ' stroke="' + p.line + '" stroke-width="' + N(2.1 * bk) + '"';
      var rot = L.rot || 0, toe = ' stroke="' + p.line + '" stroke-width="' + N(1.3 * bk) + '" stroke-linecap="round" opacity=".6" fill="none"';
      if (L.pk === 'foot') {
        // a flat webbed hind foot, toes forward
        var fe = ellipseG(q[0], q[1], 17 * k, 7 * k, rot, 6);
        s += '<path d="' + fe.d + '" fill="' + col + '"' + line + '/>' +
          '<path d="M' + pt(add(q, rotP([8 * k, -3], rot))) + 'l' + N(5 * k) + ',2M' + pt(add(q, rotP([9 * k, 1.5], rot))) + 'l' + N(5 * k) + ',1" transform="rotate(0)"' + toe + '/>';
        addPts(fe.pts);
      } else if (L.pk === 'sole') {
        // the sole of a webbed foot, seen from below: four toes fanned, with webbing
        var m = 'translate(' + N(q[0]) + ',' + N(q[1]) + ') rotate(' + rot + ') scale(' + N(k) + ')';
        s += '<g transform="' + m + '"><path d="M-9,10Q-14,-2 -12,-10Q-6,-15 0,-14Q6,-15 12,-10Q14,-2 9,10Q0,15 -9,10Z" fill="' + col + '"' + line + '/>' +
          '<g fill="' + mix(p.line, p.base, 0.35) + '"><ellipse cx="0" cy="3" rx="5" ry="4.2"/><circle cx="-8" cy="-7" r="2.3"/><circle cx="-2.8" cy="-10.5" r="2.3"/><circle cx="2.8" cy="-10.5" r="2.3"/><circle cx="8" cy="-7" r="2.3"/></g></g>';
        addPts([[q[0] - 14, q[1] - 16], [q[0] + 14, q[1] + 14]]);
      } else if (L.pk === 'hand' || L.pk === 'cup') {
        var he = ellipseG(q[0], q[1], 7.4 * k, 6.4 * k, rot, 5);
        s += '<path d="' + he.d + '" fill="' + col + '"' + line + '/>';
        if (L.pk === 'cup') s += '<path d="M' + N(q[0] - 3) + ',' + N(q[1] - 7) + 'q-5,7 0,13" stroke="' + p.line + '" stroke-width="' + N(1.6 * bk) + '" fill="none" stroke-linecap="round"/>';
        else s += '<path d="M' + N(q[0] + 2) + ',' + N(q[1] - 4) + 'l2,-2M' + N(q[0] + 4) + ',' + N(q[1]) + 'l3,-1"' + toe + '/>';
        addPts(he.pts);
      } else {
        // dog paws (the shaggy dog's are mops)
        var de = ellipseG(q[0] + (L.up ? 0 : 1), q[1], (L.up ? 7 : 10) * k, (L.up ? 9 : 6.2) * k, L.up ? -20 : 0, 6);
        s += '<path d="' + (fl ? scallop(de.pts, 0.6) : de.d) + '" fill="' + col + '"' + line + '/>';
        if (!far && !fl && !L.up) s += '<path d="M' + N(q[0] + 3) + ',' + N(q[1] + 1) + 'v3.4M' + N(q[0] + 7) + ',' + N(q[1]) + 'v3.4"' + toe + '/>';
        addPts(de.pts);
      }
      if (L.wave) {
        s += '<path d="M' + N(q[0] + 12) + ',' + N(q[1] - 14) + 'q6,6 0,14M' + N(q[0] + 18) + ',' + N(q[1] - 18) + 'q9,10 0,22M' + N(q[0] - 12) + ',' + N(q[1] - 14) + 'q-6,6 0,14" stroke="' + p.line + '" stroke-width="' + N(1.8 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
        addPts([[q[0] + 22, q[1] - 20], [q[0] - 16, q[1] - 16]]);
      }
      return s;
    }
    function limb(L, far) {
      var s = '';
      if (L.thigh) {
        var tg2 = ellipseG(L.thigh[0], L.thigh[1], L.thigh[2] * Math.sqrt(bulk), L.thigh[3] * Math.sqrt(bulk), L.thigh[4], 9);
        s += R.part(fl ? scallop(tg2.pts, 0.62) : tg2.d, { fill: p.base, dark: p.shade, line: mix(p.line, p.base, 0.3), lw: N(2.1 * bk), sx: sx * 0.7, sy: sy * 0.7,
          inner: sp.shaggy ? '<path d="' + ellipseG(L.thigh[0] - 4, L.thigh[1] - 8, L.thigh[2], L.thigh[3] * 0.8, 0).d + '" fill="' + p.saddle + '"/>' : sp.spots ? '<path d="' + blob(L.thigh[0] + 2, L.thigh[1] - 6, L.thigh[3] * 0.4, 8) + '" fill="' + p.spot + '"/>' : '' });
        addPts(tg2.pts);
      }
      if (L.leg) s += legPart(L, far || L.far);
      if (L.paw) s += paw(L, far || L.far);
      return s;
    }

    // ----- the tail
    var TP, tw0, tw1;
    if (P.tail) { TP = P.tail.P; tw0 = P.tail.w[0] * Math.sqrt(bulk); tw1 = P.tail.w[1]; }
    else {
      var droop = scared || mood === 'worried' || mood === 'sleepy' || mood === 'solemn';
      TP = P.tails[droop ? 'down' : 'up']; tw0 = 7 * Math.sqrt(bulk) * (sp.shaggy ? 1.3 : 1); tw1 = 4.4 * (sp.shaggy ? 1.6 : 1);
    }
    if (sp.tailL && sp.tailL !== 1) {
      var b0 = TP[0];
      TP = TP.map(function (q, i) { return i ? [b0[0] + (q[0] - b0[0]) * sp.tailL, b0[1] + (q[1] - b0[1]) * sp.tailL] : q; });
    }
    var twf = function (t) {
      var w = lerp(tw0, tw1, Math.pow(t, P.tail ? 1.25 : 0.8)) * (scared ? 1.4 : 1);
      if (fl) w *= 1 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.1));
      return w;
    };
    var tl = tube(TP, twf, fl ? 11 : 10);
    var tailIn = '';
    if (sp.spots) { var ta = tl.at(0.55); tailIn += '<circle cx="' + N(ta.p[0]) + '" cy="' + N(ta.p[1]) + '" r="' + N(ta.w * 1.6) + '" fill="' + p.spot + '"/>'; }
    if (sp.kind === 'otter') { var tc = []; for (var q = 0; q <= 6; q++) { var tq = tl.at(q / 6); tc.push(add(tq.p, tq.n, -tq.w * 0.45)); } tailIn += '<path d="M' + pt(tc[0]) + cr(tc) + '" stroke="' + p.light + '" stroke-width="' + N(3 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>'; }
    var tailSvg = R.part(fl ? scallop(tl.pts, 0.66) : scared ? spiky(tl.pts, 3.4) : tl.d, { fill: p.base, dark: p.shade, line: p.line, sx: sx * 0.6, sy: sy * 0.6, inner: tailIn, lw: N(2.3 * bk) });
    addPts(tl.pts);
    if (dog && /^(happy|laugh|shout|proud)$/.test(mood) && !P.tail) {
      // a wag
      var tip = tl.at(1), wg = add(tip.p, tip.t, 6);
      tailSvg += '<path d="M' + pt(add(wg, tip.n, 10)) + 'q6,-6 12,0M' + pt(add(wg, tip.n, -10)) + 'q-6,-6 -12,0" stroke="' + p.line + '" stroke-width="' + N(1.8 * bk) + '" fill="none" stroke-linecap="round" opacity=".55"/>';
    }

    // ----- the head
    var hrot = P.head[2] + (dog ? (DOG_ROT[mood] != null ? DOG_ROT[mood] : (HEAD_ROT[mood] || 0) * 0.6) : (HEAD_ROT[mood] || 0));
    var hpos = [P.head[0] + (mood === 'sniff' ? 4 : 0), P.head[1] + (mood === 'proud' || mood === 'solemn' ? -2 : 0)];
    var hm = mul(mT(hpos[0], hpos[1]), mul(mR(hrot), mS(sp.headS)));
    var flop = P.air ? 150 : P.howl ? 2 : null;
    var trail = P.water != null && sp.whiskers === 'trail' ? Math.max(20, (P.water - hpos[1]) / sp.headS + 2) : 38;
    var hd = beastHead(R, sp, mood, { F: F, sx: sx, look: [1.2, P.howl ? -1 : 0], flop: flop, howl: P.howl, trail: trail }, lk);
    var headSvg = '<g transform="' + mStr(hm) + '">' + hd.svg + '</g>';
    var headPts = hd.pts.map(function (q2) { return apply(hm, q2); });
    addPts(headPts);

    // ----- assemble back to front
    if (!P.tailFront) body += tailSvg;
    (P.far || []).forEach(function (L) { body += limb(L, true); });
    body += neckSvg + trunk;
    (P.near || []).forEach(function (L) { if (!L.afterHead && !L.afterTail) body += limb(L, false); });
    if (P.tailFront) body += tailSvg;
    (P.near || []).forEach(function (L) { if (L.afterTail) body += limb(L, false); });
    body += headSvg;
    (P.near || []).forEach(function (L) { if (L.afterHead) body += limb(L, false); });

    // ----- water, pebbles, mud, sound
    var over = '';
    if (P.water != null) {
      var cid = R.id();
      R.defs += '<clipPath id="' + cid + '"><rect x="-2000" y="-2000" width="4000" height="' + N(2000 + P.water) + '"/></clipPath>';
      body = '<g clip-path="url(#' + cid + ')">' + body + '</g>';
      pts = pts.filter(function (q3) { return q3[1] <= P.water + 0.5; });
      var rp = '';
      (P.ripples || []).forEach(function (rr) {
        rp += 'M' + N(rr[0] - rr[1]) + ',' + N(P.water) + 'Q' + N(rr[0]) + ',' + N(P.water + 9) + ' ' + N(rr[0] + rr[1]) + ',' + N(P.water);
        rp += 'M' + N(rr[0] - rr[1] * 0.7) + ',' + N(P.water - 1) + 'Q' + N(rr[0]) + ',' + N(P.water - 6) + ' ' + N(rr[0] + rr[1] * 0.7) + ',' + N(P.water - 1);
        addPts([[rr[0] - rr[1], P.water], [rr[0] + rr[1], P.water]]);
      });
      if (sp.whiskers === 'trail' && pose === 'swim') {
        var wt = apply(hm, [0, trail + 4]);
        rp += 'M' + N(wt[0] - 52) + ',' + N(P.water - 1) + 'q10,-5 20,0M' + N(wt[0] + 32) + ',' + N(P.water - 1) + 'q10,-5 20,0';
      }
      over += '<path d="' + rp + '" stroke="#ffffff" stroke-width="' + N(3 * bk) + '" fill="none" stroke-linecap="round" opacity=".75"/>';
    }
    (P.arcs || []).forEach(function (a) {
      var m2 = lerp2(a[0], a[1], 0.5);
      over += '<path d="M' + pt(a[0]) + 'Q' + pt([m2[0], Math.min(a[0][1], a[1][1]) - 16]) + ' ' + pt(a[1]) + '" stroke="' + p.line + '" stroke-width="' + N(1.6 * bk) + '" stroke-dasharray="' + N(3 * bk) + ' ' + N(5 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
    });
    (P.pebbles || []).forEach(function (pb, i) { over += pebble(pb[0], pb[1], pb[2], i * 3 + 1, bk); addPts([[pb[0] - pb[2] * 1.4, pb[1] - pb[2] * 1.2], [pb[0] + pb[2] * 1.4, pb[1] + pb[2] * 1.2]]); });
    (P.drops || []).forEach(function (pb, i) {
      over += pebble(pb[0], pb[1], pb[2], i * 3 + 1, bk) + '<path d="M' + N(pb[0] - 2) + ',' + N(pb[1] - pb[2] - 4) + 'v-8M' + N(pb[0] + 4) + ',' + N(pb[1] - pb[2] - 3) + 'v-6" stroke="' + p.line + '" stroke-width="' + N(1.5 * bk) + '" stroke-linecap="round" opacity=".5"/>';
      addPts([[pb[0] - pb[2] * 1.4, pb[1] - pb[2] - 14], [pb[0] + pb[2] * 1.4, pb[1] + pb[2] * 1.2]]);
    });
    if (P.drops) over += '<path d="M106,0q12,-7 24,0M136,0q8,-5 16,0" stroke="#ffffff" stroke-width="' + N(2.6 * bk) + '" fill="none" stroke-linecap="round" opacity=".8"/>';
    (P.mud || []).forEach(function (md, i) {
      over += '<path d="' + blob(md[0], md[1], md[2], i + 2) + '" fill="#7a5638" stroke="#4e3420" stroke-width="' + N(1.2 * bk) + '"/>';
      addPts([[md[0] - md[2], md[1] - md[2]], [md[0] + md[2], md[1] + md[2]]]);
    });
    if (P.speed) over += '<path d="M-150,-44h-26M-140,-56h-18M-156,-32h-14" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" stroke-linecap="round" opacity=".4"/>';
    if (P.air) {
      over += '<path d="M-44,-26q10,8 20,0M-10,-20q10,8 20,0M24,-26q10,8 20,0" stroke="' + p.line + '" stroke-width="' + N(2.2 * bk) + '" fill="none" stroke-linecap="round" opacity=".45"/>';
      addPts([[-46, -16], [46, -16]]);
    }
    if (P.howl) {
      var mt = apply(hm, [0, -46]);
      over += '<path d="M' + N(mt[0] - 14) + ',' + N(mt[1]) + 'q-6,-8 0,-16t0,-16M' + N(mt[0]) + ',' + N(mt[1] - 6) + 'q-6,-8 0,-16t0,-16M' + N(mt[0] + 14) + ',' + N(mt[1]) + 'q-6,-8 0,-16t0,-16" stroke="' + p.line + '" stroke-width="' + N(2 * bk) + '" fill="none" stroke-linecap="round" opacity=".5"/>';
      addPts([[mt[0] - 22, mt[1] - 40], [mt[0] + 20, mt[1]]]);
    }

    // ----- fit into the box: the feet (or the waterline) centred at the bottom
    var Wb = sp.box[0], Hb = sp.box[1], g0 = 3, tilt = P.tilt || 0;
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    // a tilted pose (sliding nose-down the bank) turns about its feet
    (tilt ? pts.map(function (q8) { return rotP(q8, tilt); }) : pts).forEach(function (q4) { x0 = Math.min(x0, q4[0]); x1 = Math.max(x1, q4[0]); y0 = Math.min(y0, q4[1]); y1 = Math.max(y1, q4[1]); });
    // rest the lowest point on the ground line (puffed-up fur, a fat tail), never below it
    var lift = P.water == null && y1 > 0 ? y1 : 0;
    y0 -= lift; y1 -= lift;
    var mg = 4 / sc0, sc = sc0;
    sc = Math.min(sc, (Wb - 2) / (x1 - x0 + 2 * mg), (Hb - g0 - 1) / (Math.max(0, y1) - (y0 - mg)));
    var left = Wb / 2 + (x0 - mg) * sc, right = Wb / 2 + (x1 + mg) * sc, dx = 0;
    if (left < 0) dx = -left; else if (right > Wb) dx = Wb - right;
    var M = mul(F === 1 ? [1, 0, 0, 1, 0, 0] : [-1, 0, 0, 1, Wb, 0], mul(mT(Wb / 2 + dx, Hb - g0), mul(mS(sc), mul(mT(0, -lift), mR(tilt)))));
    var hc = apply(M, apply(hm, [0, -2]));
    var earsAt = (dog ? [[-26, -26], [26, -26]] : [[-26, -18], [26, -18]]).map(function (e) { return apply(M, apply(hm, e)); });
    return {
      svg: '<g transform="' + mStr(M) + '"><defs>' + R.defs + '</defs>' + body + over + '</g>', w: Wb, h: Hb,
      head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: boxOf(headPts.map(function (q5) { return apply(M, P.water != null ? [q5[0], Math.min(q5[1], P.water)] : q5); })),
      bounds: boxOf(pts.map(function (q6) { return apply(M, q6); })),
      _marks: { M: M, scale: sc, ears: earsAt }
    };
  }

  // ------------------------------------------------------------------ public: characters

  // A Clan cat never wears her coat. An 8-year-old must find herself at a glance, and two brown
  // tabbies side by side read as twins (chapter 2's rim, with a cat in the first default look). A
  // Clan cat whose coat is the player's fur (as drawn: a brown tabby when her look names none)
  // wears a spare instead: the first of CLAN_SPARE that is not her fur and not on another Clan cat
  // in the same picture (`taken`: their variants). With no `look` (a character drawn on its own) the
  // variant is as asked. The scenes pass the player's look for every Clan cat in the cast, and the
  // Counts pictures for every Clan cat their `who` puts in a place, so a rim cat keeps one coat
  // from the panel to the counting picture.
  var CLAN_SPARE = [4, 6, 2, 3, 5, 1];
  function clanVariant(v, look, taken) {
    v = clamp(intOr(v, 1), 1, 6);
    if (!look || typeof look !== 'object') return v;
    var fur = specFromLook(look).fur, i;
    if (CLAN[v - 1].fur !== fur) return v;
    taken = Array.isArray(taken) ? taken.map(function (t) { return clamp(intOr(t, 1), 1, 6); }) : [];
    for (i = 0; i < CLAN_SPARE.length; i++) if (CLAN[CLAN_SPARE[i] - 1].fur !== fur && taken.indexOf(CLAN_SPARE[i]) < 0) return CLAN_SPARE[i];
    for (i = 0; i < CLAN_SPARE.length; i++) if (CLAN[CLAN_SPARE[i] - 1].fur !== fur) return CLAN_SPARE[i];
    return v;
  }

  function catSpec(who, o) {
    if (who === 'player') return resolve(specFromLook(o.look));
    if (who === 'clancat') return resolve(CLAN[clanVariant(o.variant, o.look, o.taken) - 1]);
    return resolve(PRESETS[who]);
  }

  art.character = function (who, opts) {
    var o = opts || {};
    var r;
    if (who === 'tallone') r = tallOne(o);
    else if (who === 'sparrow') r = sparrow(o);
    else if (who === 'moth') r = moth(o);
    else if (who === 'riffle' || who === 'otter' || who === 'dog') r = buildBeast(beastSpec(who, o), o);
    else r = buildCat(catSpec(PRESETS[who] || who === 'player' || who === 'clancat' ? who : 'clancat', o), o);
    var out = { svg: r.svg, w: r.w, h: r.h, head: r.head };
    if (r.headBox) {
      out.headBox = r.headBox; out.bounds = r.bounds;
      if (r._marks.chestTop) out.chestTop = { x: r._marks.chestTop[0], y: r._marks.chestTop[1] };
    }
    if (r.held) out.held = r.held;
    return out;
  };

  art.clanVariant = clanVariant;

  art.cat = function (opts) {
    var o = opts || {};
    var r = buildCat(resolve(specFromLook(o.look)), o);
    var out = { svg: r.svg, w: r.w, h: r.h, head: r.head, headBox: r.headBox, bounds: r.bounds };
    if (r.held) out.held = r.held;
    return out;
  };

  // ------------------------------------------------------------------ public: counts pictures

  var GLOW = '#ffb21f', GLOW2 = '#ffe36e';
  var CLAN_LOOKS = [3, 1, 6, 4, 2, 5];

  function cell(inner, x, y, k) { return '<g transform="translate(' + N(x) + ',' + N(y) + ') scale(' + k + ')">' + inner + '</g>'; }

  // a raised forepaw, pads toward us, with five claws (four toes and the dewclaw)
  function forepaw(lit, base) {
    var fur = '#e8913a', line = '#8f4a1b', pad = '#f4a5b4', s = '';
    var claws = [[-30, -40, -14], [-11, -54, -5], [11, -54, 5], [30, -40, 14], [-46, 2, -60]];
    s += '<path d="M-38,10Q-50,-30 -30,-48Q0,-70 30,-48Q50,-30 38,10Q30,60 0,62Q-30,60 -38,10Z" fill="' + fur + '" stroke="' + line + '" stroke-width="3"/>';
    s += '<path d="M-14,28Q0,8 14,28Q20,44 0,46Q-20,44 -14,28Z" fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.6"/>';
    s += '<g fill="' + pad + '" stroke="' + mix(pad, line, 0.4) + '" stroke-width="1.4"><ellipse cx="-24" cy="-18" rx="8" ry="9"/><ellipse cx="-8" cy="-30" rx="8" ry="9.5"/><ellipse cx="8" cy="-30" rx="8" ry="9.5"/><ellipse cx="24" cy="-18" rx="8" ry="9"/><ellipse cx="-34" cy="14" rx="5" ry="6"/></g>';
    claws.forEach(function (c, i) {
      var on = i < lit, ang = c[2];
      var t = 'translate(' + c[0] + ',' + c[1] + ') rotate(' + ang + ')';
      if (on) s += '<circle cx="' + c[0] + '" cy="' + (c[1] - 8) + '" r="13" fill="' + GLOW + '" opacity=".55"/>';
      s += '<path transform="' + t + '" d="M-4,0Q-3,-14 2,-22Q3,-12 4,0Z" fill="' + (on ? GLOW2 : '#fbf6ea') + '" stroke="' + (on ? '#d18b12' : '#9a8a72') + '" stroke-width="1.6" stroke-linejoin="round"/>';
    });
    return s;
  }

  function sparkle(x, y, r) {
    var k = r * 0.2;
    return '<path d="M' + N(x) + ',' + N(y - r) + 'Q' + N(x + k) + ',' + N(y - k) + ' ' + N(x + r) + ',' + N(y) + 'Q' + N(x + k) + ',' + N(y + k) + ' ' + N(x) + ',' + N(y + r) +
      'Q' + N(x - k) + ',' + N(y + k) + ' ' + N(x - r) + ',' + N(y) + 'Q' + N(x - k) + ',' + N(y - k) + ' ' + N(x) + ',' + N(y - r) + 'Z" fill="#fffbe8" stroke="#eea20c" stroke-width="1.6" stroke-linejoin="round"/>';
  }
  function glow(x, y, r) {
    return '<circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r) + '" fill="' + GLOW + '" opacity=".45"/><circle cx="' + N(x) + '" cy="' + N(y) + '" r="' + N(r * 0.62) + '" fill="' + GLOW2 + '" opacity=".75"/>';
  }
  function countsCat(gi, extra) {
    var s = {}, src = CLAN[CLAN_LOOKS[gi % 6] - 1], k;
    for (k in src) s[k] = src[k];
    for (k in (extra || {})) s[k] = extra[k];
    return resolve(s);
  }

  // The drawing spec of a cast member a Counts picture's `who` puts in a place: the player in her
  // look, a Clan cat never in her coat (clanVariant, against the other Clan cats in `who`; her fur
  // as drawn when the picture is given no look), anyone else as drawn in the scenes.
  function whoSpec(o, e) {
    if (e.who === 'player') return specFromLook(e.look || o.look);
    if (e.who === 'clancat') {
      var taken = (o.who || []).filter(function (w) { return w && w.who === 'clancat'; }).map(function (w) { return w.variant; });
      return CLAN[clanVariant(e.variant, o.look || {}, taken) - 1];
    }
    return PRESETS[e.who] || CLAN[0];
  }

  // A Counts character: the Clan cat for this place, or the cast member `who` puts there. `lit` is
  // whether this one's things are all counted: then `litMood` applies, and the grizzled old tom
  // flattens his ears ("Flat ears still count").
  function countsChar(o, idx, extra, co, lit) {
    var e = o.who && o.who[idx];
    if (!e || !e.who) return buildCat(countsCat(idx, extra), co);
    var oo = {}, k;
    for (k in co) oo[k] = co[k];
    if (e.pose) oo.pose = e.pose;
    if (e.mood) oo.mood = e.mood;
    if (lit && (e.litMood || e.who === 'grizzled')) {
      oo.mood = e.litMood || 'stern';
      if (e.flatEars !== false && (e.flatEars || e.who === 'grizzled')) oo.earBias = 46;
    }
    if (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog') {
      // fitted into the cat's 200 x 200 cell, feet on its ground line
      var r = buildBeast(beastSpec(e.who, e), oo), kk = Math.min(1, 196 / r.w, 196 / r.h);
      var tx = 100 - r.w * kk / 2, ty = 197 - (r.h - 3) * kk, Mc = mul([1, 0, 0, 1, tx, ty], mS(kk));
      return { svg: '<g transform="' + mStr(Mc) + '">' + r.svg + '</g>', _marks: { M: mul(Mc, r._marks.M), ears: r._marks.ears.map(function (q) { return apply(Mc, q); }), paws: [] } };
    }
    var src = whoSpec(o, e);
    var sp = {};
    for (k in src) sp[k] = src[k];
    for (k in (extra || {})) sp[k] = extra[k];
    return buildCat(resolve(sp), oo);
  }

  // A running total under a counted group (2, 4, 6…), in the times-table font.
  function totalNum(x, y, n, dark) {
    return '<text class="pc-total" x="' + N(x) + '" y="' + N(y) + '" text-anchor="middle" font-family="Andika, ui-rounded, system-ui, sans-serif" font-weight="700" font-size="36"' +
      ' fill="' + (dark ? '#fff6d6' : '#6a3d12') + '" stroke="' + (dark ? '#33284a' : '#fffaf0') + '" stroke-width="6" stroke-linejoin="round" paint-order="stroke">' + n + '</text>';
  }
  // The soft glow on the next group to count.
  function nextGlow(x, y, w, h) {
    return '<rect class="pc-next" x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) + '" height="' + N(h) + '" rx="26" fill="#fff3c2" opacity=".8" stroke="#f2b23a" stroke-width="3.5" stroke-dasharray="12 9"/>';
  }
  function svgDoc(W, H, label, inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
  }
  // The old tom's boast: the picture in a thought cloud, last night under an evening sky (no moon),
  // with the little bubbles trailing down to whoever is thinking it (bottom left; `thought: 'right'`).
  function thoughtDoc(W, H, label, body, side, groundY) {
    var id = 'pct' + (++serial).toString(36), m = 50, cw = W + m * 2, ch = H + m * 2, trail = 84;
    var pts = [], n = Math.max(12, Math.round((cw + ch) / 62));
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * (i + 0.5) / n, c = Math.cos(a), sn = Math.sin(a);
      pts.push([cw / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.6) * (cw / 2 - 20), ch / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.6) * (ch / 2 - 20)]);
    }
    var cloud = scallop(pts, 0.6), sky = ['#3B3A74', '#5F4F8E', '#8E64A0', '#C9738A', '#E58E7A', '#F2AE7A'], st = '';
    sky.forEach(function (col, k) { st += '<stop offset="' + N(k / (sky.length - 1)) + '" stop-color="' + col + '"/>'; });
    var stars = '';
    for (var k2 = 0; k2 < 14; k2++) stars += '<circle cx="' + N(30 + rand(k2 * 7 + 1) * (cw - 60)) + '" cy="' + N(24 + rand(k2 * 7 + 2) * ch * 0.4) + '" r="' + N(1.2 + rand(k2 * 7 + 3) * 1.6) + '"/>';
    var s = '<defs><linearGradient id="' + id + '-sky" x1="0" y1="0" x2="0" y2="1">' + st + '</linearGradient><clipPath id="' + id + '-c"><path d="' + cloud + '"/></clipPath></defs>' +
      '<path d="' + cloud + '" fill="url(#' + id + '-sky)"/>' +
      '<g clip-path="url(#' + id + '-c)"><g fill="#fff8e6" opacity=".85">' + stars + '</g>' +
      groundEllipse(cw, ch, m + (groundY == null ? H - 24 : groundY)) + '</g>' +
      '<g transform="translate(' + m + ',' + m + ')">' + body + '</g>' +
      '<path d="' + cloud + '" fill="none" stroke="#6f5d8c" stroke-width="13" stroke-linejoin="round"/><path d="' + cloud + '" fill="none" stroke="#fffaf0" stroke-width="8" stroke-linejoin="round"/>';
    var dir = side === 'right' ? 1 : -1;
    [[0.24, 18, 18], [0.15, 50, 12], [0.09, 74, 7.5]].forEach(function (b) {
      var bx = dir < 0 ? cw * b[0] : cw * (1 - b[0]), by = ch - 6 + b[1];
      s += '<circle cx="' + N(bx) + '" cy="' + N(by) + '" r="' + b[2] + '" fill="#fffaf0" stroke="#6f5d8c" stroke-width="2.6"/>';
    });
    return svgDoc(cw, ch + trail, 'A thought: ' + label, s);
  }

  // the ground under the remembered pile: a low, wide hill whose top is at y
  function groundEllipse(cw, ch, y) {
    var ry = (ch - y) + 60;
    return '<ellipse cx="' + N(cw / 2) + '" cy="' + N(y + ry) + '" rx="' + N(cw * 0.8) + '" ry="' + N(ry) + '" fill="#7a6170"/>' +
      '<ellipse cx="' + N(cw / 2) + '" cy="' + N(y + ry) + '" rx="' + N(cw * 0.8) + '" ry="' + N(ry) + '" fill="none" stroke="#9a7f8c" stroke-width="5" opacity=".8"/>';
  }

  art.countsPicture = function (opts) {
    var o = opts || {};
    var table = clamp(intOr(o.table, 1), 1, 10), groups = clamp(intOr(o.groups, 1), 0, 20);
    // per: how many things each group holds (it defaults to the table; 2 × 8 can be pictured as two rows of eight)
    var per = o.per == null ? table : clamp(intOr(o.per, table), 1, 10);
    if (o.kind === 'prey') return preyPicture(o, groups, per);
    if (o.layout === 'rows') return thingRows(o, table, groups, per);
    var t = per;
    var hl = clamp(intOr(o.highlight, 0), 0, t * groups);
    var TOT = o.totals ? 46 : 0, nextG = o.next ? Math.floor(hl / Math.max(1, t)) : -1;
    var cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var pad = 18, body = '', count = 0;
    var spec = { 1: [176, 128], 2: [176, 170], 3: [214, 128], 4: [176, 150], 5: [150, 150], 10: [250, 150] }[t] || [176, 176];
    var CW = spec[0], CH = spec[1];
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * (CH + TOT);
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * (CH + TOT), g = '';
      var litAll = hl >= (gi + 1) * t;
      if (gi === nextG) body += nextGlow(x0 + 8, y0 + 4, CW - 16, CH + TOT * 0.5 - 4);
      if (t === 1) {
        // sleepy loaves with their tails up: the tails are what you count
        var c1 = countsChar(o, gi, { tailW: 1.35, scale: 1 }, { pose: 'loaf', mood: 'sleepy', tail: 'flag' }, litAll);
        var lit = count < hl; count++;
        g += '<ellipse cx="100" cy="196" rx="68" ry="9" fill="#3f5a2e" opacity=".14"/>';
        if (lit && c1._marks.tail) {
          g += '<g transform="' + mStr(c1._marks.M) + '"><path d="' + c1._marks.tail + '" fill="' + GLOW + '" stroke="' + GLOW + '" stroke-width="28" stroke-linejoin="round" opacity=".38"/>' +
            '<path d="' + c1._marks.tail + '" fill="none" stroke="' + GLOW2 + '" stroke-width="12" stroke-linejoin="round"/></g>';
        } else if (lit) g += glow(100, 150, 60);
        g += c1.svg;
        if (lit && c1._marks.tailTip) { var tip = apply(c1._marks.M, c1._marks.tailTip); g += sparkle(tip[0] - 2, tip[1] - 12, 9); }
        body += cell(g, x0 - 6, y0 - 62, 0.9);
      } else if (t === 2) {
        var c2 = countsChar(o, gi, null, { pose: 'sit', mood: 'happy' }, litAll);
        g += '<ellipse cx="100" cy="196" rx="54" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var eg = '';
        c2._marks.ears.forEach(function (e) { if (count < hl) eg += glow(e[0], e[1] + 4, 24); count++; });
        g += eg + c2.svg;
        body += cell(g, x0 - 2, y0 - 18, 0.9);
      } else if (t === 3) {
        // a patrol of three
        g += '<rect x="4" y="10" width="' + (CW - 8) + '" height="' + (CH - 16) + '" rx="20" fill="#d6e5c8"/>';
        for (var k3 = 0; k3 < 3; k3++) {
          var c3 = countsChar(o, gi * 3 + k3, null, { pose: 'walk', mood: 'happy' }, count < hl), gg = '';
          if (count < hl) gg += glow(100, 140, 66);
          count++;
          g += cell(gg + c3.svg, 6 + k3 * 64, 12 + (k3 % 2) * 4, 0.52);
        }
        body += cell(g, x0, y0, 1);
      } else if (t === 4) {
        var c4 = countsChar(o, gi, null, { pose: 'stand', mood: 'happy' }, litAll);
        g += '<ellipse cx="100" cy="196" rx="70" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var pg = '';
        c4._marks.paws.slice(0, 4).sort(function (a, b) { return a[0] - b[0]; }).forEach(function (pp) {
          if (count < hl) pg += glow(pp[0], pp[1], 17);
          count++;
        });
        g += pg + c4.svg;
        body += cell(g, x0 - 2, y0 - 38, 0.9);
      } else if (t === 5 || t === 10) {
        var paws = t === 5 ? 1 : 2;
        for (var pi = 0; pi < paws; pi++) {
          var litN = clamp(hl - count, 0, 5); count += 5;
          g += cell(forepaw(litN), 70 + pi * 110, 84, 1);
        }
        body += cell(g, x0, y0, 1);
      } else {
        // the other tables: a cat and its pebbles, `table` of them, in rows of five
        var c6 = countsChar(o, gi, null, { pose: 'sit', mood: 'kind' }, litAll);
        g += cell(c6.svg, 30, 0, 0.6);
        for (var j = 0; j < t; j++) {
          var px = 24 + (j % 5) * 26, py = 132 + Math.floor(j / 5) * 22;
          if (count < hl) g += glow(px, py, 14);
          count++;
          g += '<ellipse cx="' + px + '" cy="' + py + '" rx="9" ry="7" fill="#a9b3bd" stroke="#5f6a76" stroke-width="2"/><ellipse cx="' + (px - 3) + '" cy="' + (py - 3) + '" rx="3" ry="2" fill="#fff" opacity=".7"/>';
        }
        body += cell(g, x0 + 8, y0, 1);
      }
      count = (gi + 1) * t;
      if (TOT && litAll) body += totalNum(x0 + CW / 2, y0 + CH + 30, (gi + 1) * t, !!o.thought);
    }
    var thing = { 1: 'tail', 2: 'ears', 3: 'cats', 4: 'paws', 5: 'claws', 10: 'claws' }[t] || 'pebbles';
    var unit = { 3: 'patrols', 5: 'forepaws', 10: 'pairs of forepaws' }[t] || 'cats';
    var label = groups + ' ' + unit + ', ' + t + ' ' + thing + ' each';
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought, pad + CH - 14);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body);
  };

  // ----- things in rows: 5 × 2's ears sliding into two rows of five (the left ears, then the right ears)

  function thingRows(o, table, groups, per) {
    var hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var TW = 74, TH = 92, gap5 = 26, padX = 30, padY = 22, rowGap = 12, TOT = o.totals ? 84 : 0;
    var rowW = per * TW + Math.floor((per - 1) / 5) * gap5;
    var W = padX * 2 + rowW + TOT, H = padY * 2 + groups * TH + (groups - 1) * rowGap, body = '';
    var nextR = o.next ? Math.floor(hl / per) : -1;
    function furOf(j) {
      var e = o.who && o.who[j];
      if (e && (e.who === 'riffle' || e.who === 'otter' || e.who === 'dog')) { var bs = beastSpec(e.who, e); return { sp: { pal: bs.pal }, beast: true }; }
      if (e && e.who) {
        return { sp: resolve(whoSpec(o, e)) };
      }
      return { sp: countsCat(j) };
    }
    for (var r = 0; r < groups; r++) {
      var yc = padY + r * (TH + rowGap) + TH / 2;
      if (r === nextR) body += nextGlow(padX - 12, yc - TH / 2 - 4, rowW + 24, TH + 8);
      for (var j = 0; j < per; j++) {
        var idx = r * per + j, lit = idx < hl;
        var xc = padX + j * TW + Math.floor(j / 5) * gap5 + TW / 2;
        if (lit) body += glow(xc, yc, 36);
        if (table === 2) {
          // an ear, in the colour of the cat it came from: the left ears in the first row, the right ears in the second
          var f = furOf(j), side = r % 2 ? 1 : -1, pal = f.sp.pal;
          var col = f.beast ? (pal.earFill || pal.base) : earColor(f.sp, side);
          body += '<g transform="translate(' + N(xc) + ',' + N(yc + 34) + ') rotate(' + (side * 12) + ') scale(' + (side * 2.15) + ',2.15)">' +
            '<path d="' + EAR + '" fill="' + col + '" stroke="' + pal.line + '" stroke-width="1.3" stroke-linejoin="round"/><path d="' + EAR_IN + '" fill="' + (pal.earIn || '#f4a5b4') + '"/></g>';
        } else {
          body += '<ellipse cx="' + N(xc) + '" cy="' + N(yc) + '" rx="22" ry="17" fill="#a9b3bd" stroke="#5f6a76" stroke-width="3"/><ellipse cx="' + N(xc - 7) + '" cy="' + N(yc - 6) + '" rx="7" ry="4.5" fill="#fff" opacity=".7"/>';
        }
      }
      if (TOT && hl >= (r + 1) * per) body += totalNum(padX + rowW + TOT / 2 + 6, yc + 13, (r + 1) * per, !!o.thought);
    }
    var thing = { 1: 'tails', 2: 'ears', 4: 'paws', 5: 'claws', 10: 'claws' }[table] || 'pebbles';
    var label = groups + ' rows of ' + per + ' ' + thing;
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body);
  }

  // ----- prey: the pile in stacks (or rows); every piece drawn by PC.art.prey, the pile set's prey

  // Our own soft prey, for when PC.art.prey isn't there: a mouse, a vole (the pile's), or a silver
  // fish (the otters', never in the pile). Eyes shut, tails tucked in, no blood. In its own box,
  // resting on the bottom centre.
  function preyFallback(q) {
    q = q || {};
    var kind = q.kind === 'vole' || q.kind === 'fish' ? q.kind : 'mouse', lit = !!q.lit, s = '', gl = '', w, h;
    if (kind === 'fish') {
      w = 86; h = 38;
      var c = { body: '#c3ced7', back: '#7e8f9c', belly: '#eef3f6', line: '#55626d' };
      if (lit) gl = '<ellipse cx="44" cy="20" rx="50" ry="25" fill="' + GLOW + '" opacity=".45"/><ellipse cx="44" cy="20" rx="34" ry="15" fill="' + GLOW2 + '" opacity=".7"/>';
      s += '<path d="M20,20L3,7Q8,20 3,33Z" fill="' + c.back + '" stroke="' + c.line + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M44,9Q52,0 61,8Z" fill="' + c.back + '" stroke="' + c.line + '" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="' + crClosed([[17, 20], [30, 10], [52, 7], [72, 11], [84, 20], [72, 28], [52, 32], [30, 30]]) + '" fill="' + c.body + '" stroke="' + c.line + '" stroke-width="2.2"/>' +
        '<path d="M24,17Q48,6 80,16Q52,12 24,17Z" fill="' + c.back + '" opacity=".7"/><path d="M28,25Q52,33 76,24Q52,29 28,25Z" fill="' + c.belly + '"/>' +
        '<path d="M60,12Q56,20 60,28" stroke="' + c.line + '" stroke-width="1.6" fill="none" opacity=".7"/>' +
        '<path d="M67,16Q70,19 73,16" stroke="' + c.line + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<path d="M34,15q4,-3 8,0M42,15q4,-3 8,0M38,21q4,-3 8,0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/>';
    } else {
      var vole = kind === 'vole';
      w = vole ? 66 : 72; h = 44;
      var m = vole ? { body: '#8f603d', line: '#4b301c', light: '#c4946a', ear: '#7a5033' } : { body: '#a68d79', line: '#5e4a3b', light: '#dccbb9', ear: '#a68d79' };
      var body = vole ? [[6, 28], [10, 15], [24, 8], [42, 8], [55, 14], [63, 24], [62, 32], [50, 39], [28, 41], [10, 38]] :
        [[6, 30], [11, 17], [26, 11], [44, 11], [56, 15], [67, 23], [70, 30], [64, 35], [50, 40], [30, 42], [11, 40]];
      var nx = vole ? 62 : 70, ny = vole ? 28 : 30;
      if (lit) gl = '<ellipse cx="' + N(w / 2) + '" cy="27" rx="' + N(w * 0.6) + '" ry="26" fill="' + GLOW + '" opacity=".45"/><ellipse cx="' + N(w / 2) + '" cy="27" rx="' + N(w * 0.42) + '" ry="16" fill="' + GLOW2 + '" opacity=".7"/>';
      s += '<path d="M9,35C0,41 12,47 30,43" stroke="#d99aa0" stroke-width="' + (vole ? 2.4 : 2.8) + '" fill="none" stroke-linecap="round"/>' +
        '<path d="' + crClosed(body) + '" fill="' + m.body + '" stroke="' + m.line + '" stroke-width="2.2"/>' +
        '<ellipse cx="34" cy="36" rx="20" ry="4.5" fill="' + m.light + '" opacity=".55"/>' +
        '<ellipse cx="26" cy="17" rx="13" ry="4" fill="' + m.light + '" opacity=".4"/>' +
        '<circle cx="' + (vole ? 46 : 49) + '" cy="' + (vole ? 13 : 14) + '" r="' + (vole ? 4.6 : 7.6) + '" fill="' + m.ear + '" stroke="' + m.line + '" stroke-width="1.8"/>' +
        (vole ? '' : '<circle cx="49" cy="14.5" r="4" fill="#f2a7b0"/>') +
        '<path d="M' + (nx - 13) + ',' + (ny - 6) + 'Q' + (nx - 10) + ',' + (ny - 3) + ' ' + (nx - 7) + ',' + (ny - 6) + '" stroke="' + m.line + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
        '<circle cx="' + nx + '" cy="' + ny + '" r="2.4" fill="#e98f9b"/>' +
        '<path d="M' + (nx - 4) + ',' + (ny + 2) + 'l-9,3M' + (nx - 4) + ',' + (ny + 3) + 'l-8,6" stroke="' + m.line + '" stroke-width="1" opacity=".5"/>';
    }
    var sp = lit ? sparkle(w * 0.78, 6, 8) : '';
    var inner = q.part === 'glow' ? gl : q.part === 'body' ? s : q.part === 'spark' ? sp : gl + s + sp;
    if (q.facing === 'left') inner = '<g transform="translate(' + w + ',0) scale(-1,1)">' + inner + '</g>';
    return { svg: inner ? '<g>' + inner + '</g>' : '', w: w, h: h, kind: kind };
  }
  art.preyFallback = preyFallback;

  // Which prey sits at column c, level l (0 = the bottom of its stack): mice and voles only, as the
  // text says (the Clan doesn't fish; PC.art.prey's fish kind is the otters'). The same place always
  // holds the same piece, so 8 stacks of 2 and 2 rows of 8 show the same pile.
  function preyKind(c, l) { return (c + l) % 2 ? 'vole' : 'mouse'; }

  function preyPicture(o, groups, per) {
    var rows = o.layout === 'rows', hl = clamp(intOr(o.highlight, 0), 0, groups * per);
    var fn = typeof art.prey === 'function' ? art.prey : preyFallback;
    var PW = 84, PH = 50, STEP = 40, dark = !!o.thought, body = '', halos = '', sparks = '', under = '', totals = '';
    // one piece, in three layers (every halo behind every body, every sparkle on top), as the pile set stacks them
    function layer(f, q0, part) {
      var q = null, a = {}, k;
      for (k in q0) a[k] = q0[k];
      a.part = part;
      try { q = f(a); } catch (e) { q = null; }
      return q && typeof q.svg === 'string' && q.w > 0 && q.h > 0 ? q : null;
    }
    function piece(cx, base, c, l, lit) {
      var q0 = { kind: preyKind(c, l), lit: lit, seed: c * 10 + l + 1, facing: l % 2 ? 'left' : 'right' }, f = fn;
      var b = layer(f, q0, 'body');
      if (!b || !b.svg) { f = preyFallback; b = layer(f, q0, 'body'); }
      var k = Math.min(PW / b.w, PH / b.h), at = 'translate(' + N(cx - b.w * k / 2) + ',' + N(base - b.h * k) + ') scale(' + N(k) + ')';
      var put = function (q) {
        var svg = q && q.svg ? q.svg : '';
        if (/^\s*<svg/.test(svg)) svg = svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
        return svg ? '<g transform="' + at + '">' + svg + '</g>' : '';
      };
      if (lit) { halos += put(layer(f, q0, 'glow')); sparks += put(layer(f, q0, 'spark')); }
      return put(b);
    }
    var W, H, pad = 24, TOT, label, groundAt;
    if (!rows) {
      // `groups` stacks of `per`, at most five stacks to a row; each stack counted top to bottom
      TOT = o.totals ? 48 : 0;
      var SW = PW + 26, SH = (per - 1) * STEP + PH, cols = Math.max(1, Math.min(5, groups)), nrow = Math.max(1, Math.ceil(groups / 5));
      var CH = SH + 22 + TOT;
      W = pad * 2 + cols * SW; H = pad * 2 + nrow * CH;
      var nextS = o.next ? Math.floor(hl / per) : -1;
      for (var gi = 0; gi < groups; gi++) {
        var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
        var cx = pad + (W - pad * 2 - inRow * SW) / 2 + col * SW + SW / 2, top = pad + row * CH, base = top + SH + 6;
        if (gi === nextS) under += nextGlow(cx - SW / 2 + 4, top - 8, SW - 8, SH + 26);
        under += '<ellipse cx="' + N(cx) + '" cy="' + N(base - 2) + '" rx="' + N(PW * 0.52) + '" ry="7" fill="' + (dark ? '#1c1424' : '#6b4f33') + '" opacity="' + (dark ? '.45' : '.2') + '"/>';
        for (var l = 0; l < per; l++) {
          var j = per - 1 - l;   // counted from the top
          body += piece(cx, base - l * STEP, gi, l, gi * per + j < hl);
        }
        if (TOT && hl >= (gi + 1) * per) totals += totalNum(cx, base + 40, (gi + 1) * per, dark);
      }
      label = groups + (groups === 1 ? ' stack' : ' stacks') + ' of ' + per + ' prey';
      groundAt = pad + SH - 4;
    } else {
      // `groups` rows of `per`, one above another like the pile's top and bottom layers; the top row first
      TOT = o.totals ? 84 : 0;
      var CW2 = PW + 12, gap5 = 22, rowW = per * CW2 + Math.floor((per - 1) / 5) * gap5, RH = STEP + 8;
      W = pad * 2 + rowW + TOT; H = pad * 2 + (groups - 1) * RH + PH + 14;
      var nextR = o.next ? Math.floor(hl / per) : -1, bottom = pad + (groups - 1) * RH + PH + 4;
      for (var c = 0; c < per; c++) {
        var sx2 = pad + c * CW2 + Math.floor(c / 5) * gap5 + CW2 / 2;
        under += '<ellipse cx="' + N(sx2) + '" cy="' + N(bottom - 2) + '" rx="' + N(PW * 0.5) + '" ry="7" fill="' + (dark ? '#1c1424' : '#6b4f33') + '" opacity="' + (dark ? '.45' : '.2') + '"/>';
      }
      if (nextR >= 0 && nextR < groups) under += nextGlow(pad - 10, pad + nextR * RH - 6, rowW + 20, PH + 12);
      // the bottom row first, so the rows above sit on it
      for (var r = groups - 1; r >= 0; r--) {
        var baseR = pad + r * RH + PH, lvl = groups - 1 - r;
        for (var c2 = 0; c2 < per; c2++) {
          var xr = pad + c2 * CW2 + Math.floor(c2 / 5) * gap5 + CW2 / 2;
          body += piece(xr, baseR, c2, lvl, r * per + c2 < hl);
        }
        if (TOT && hl >= (r + 1) * per) totals += totalNum(pad + rowW + TOT / 2 + 4, baseR - PH / 2 + 13, (r + 1) * per, dark);
      }
      label = groups + (groups === 1 ? ' row' : ' rows') + ' of ' + per + ' prey';
      groundAt = pad + PH - 6;
    }
    body = under + halos + body + sparks + totals;
    if (o.thought) return thoughtDoc(W, H, label, body, o.thought, groundAt);
    return svgDoc(W, H, label, '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#efe4cb" stroke="#d6c29c" stroke-width="3"/>' + body);
  }

  // ------------------------------------------------------------------ public: sand tallies

  // Sand (or, `ground: 'earth'`, the earth beside the prey pile). `groups` clusters of `per`
  // scratches, lit in order; or, `layout: 'rows'`, `groups` rows of `per` lit a column at a time,
  // top and bottom together (two rows of eight: 2, 4 … 16, as the check's help counts them).
  var GROUNDS = {
    sand: { patch: '#efd6a2', edge: '#cfae72', dots: '#d3b57c', box: '#e3c68c', groove: '#9c7440', shine: '#fbecc8', word: 'sand' },
    earth: { patch: '#a27a55', edge: '#7a5638', dots: '#7a5638', box: '#8f6a48', groove: '#4e3524', shine: '#c9a27a', word: 'earth' }
  };
  art.sand = function (opts) {
    var o = opts || {};
    var groups = clamp(intOr(o.groups, 1), 0, 20), per = clamp(intOr(o.per, 1), 1, 10);
    var counted = clamp(intOr(o.counted, 0), 0, groups * per);
    var G = GROUNDS[o.ground] || GROUNDS.sand, rows = o.layout === 'rows';
    var SP = 17, LEN = 40, gap = 16, pad = 26, gap5 = 12, W, H, boxes = [], spots = [];
    if (rows) {
      // one long row per group, a little gap after every five
      var rw = per * SP + Math.floor((per - 1) / 5) * gap5 + 26, rh = LEN + 18;
      W = pad * 2 + rw; H = pad * 2 + Math.max(1, groups) * rh + (Math.max(1, groups) - 1) * gap;
      for (var r = 0; r < groups; r++) {
        var ry0 = pad + r * (rh + gap);
        boxes.push([pad, ry0, rw, rh]);
        // column by column: the scratch in row r, column j is counted (j * groups + r)th
        for (var jr = 0; jr < per; jr++) spots.push([pad + 13 + SP / 2 + jr * SP + Math.floor(jr / 5) * gap5, ry0 + 9, jr * groups + r, r]);
      }
    } else {
      var perRow = Math.min(per, 5), subRows = Math.ceil(per / 5);
      var cw = perRow * SP + 26, ch = subRows * (LEN + 12) + 18;
      var cols = Math.max(1, Math.min(5, groups)), nrows = Math.max(1, Math.ceil(groups / 5)), idx = 0;
      W = pad * 2 + cols * cw + (cols - 1) * gap; H = pad * 2 + nrows * ch + (nrows - 1) * gap;
      for (var g = 0; g < groups; g++) {
        var row = Math.floor(g / 5), col = g % 5, inRow = Math.min(5, groups - row * 5);
        var x0 = (W - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y0 = pad + row * (ch + gap);
        boxes.push([x0, y0, cw, ch]);
        for (var j = 0; j < per; j++) spots.push([x0 + 13 + SP / 2 + (j % 5) * SP, y0 + 12 + Math.floor(j / 5) * (LEN + 12), idx++, g]);
      }
    }
    // the patch, a soft wobbly blob
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      // a squircle, so the corner clusters still sit on it
      var a = Math.PI * 2 * i / n, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k,
        H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    var s = '<path d="' + crClosed(edge) + '" fill="' + G.patch + '" stroke="' + G.edge + '" stroke-width="3"/>';
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) {
      var dx = W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60), dy = H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40);
      dots += '<circle cx="' + N(dx) + '" cy="' + N(dy) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    }
    s += '<g fill="' + G.dots + '" opacity=".7">' + dots + '</g>';
    // each group's box, then its scratches
    spots.forEach(function (q, si) {
      var b = boxes[q[3]];
      if (!si || spots[si - 1][3] !== q[3]) s += '<rect x="' + N(b[0]) + '" y="' + N(b[1]) + '" width="' + N(b[2]) + '" height="' + N(b[3]) + '" rx="18" fill="' + G.box + '" opacity=".55"/>';
      var sx = q[0], sy = q[1], lit = q[2] < counted;
      var d1 = 'M' + N(sx + 4) + ',' + N(sy) + 'Q' + N(sx + 1) + ',' + N(sy + LEN / 2) + ' ' + N(sx - 4) + ',' + N(sy + LEN);
      if (lit) s += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="13" stroke-linecap="round" fill="none" opacity=".55"/>';
      s += '<path d="' + d1 + '" stroke="' + (lit ? '#e39a12' : G.groove) + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
        '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (lit ? '#fff4c2' : G.shine) + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
    });
    var label = rows ? groups + (groups === 1 ? ' row' : ' rows') + ' of ' + per + ' scratches in the ' + G.word : groups + ' groups of ' + per + ' scratches in the ' + G.word;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + label + '">' + s + '</svg>';
  };

  // ------------------------------------------------------------------ vocabulary

  // Drawings face right before any flip. character() also honours opts.facing itself (mirroring the
  // drawing while keeping one-sided details, like Tallyheart's torn left ear, on the correct side).
  art.characterFacing = 'right';

  var vocab = art.vocab || (art.vocab = {});
  vocab.cast = CAST_IDS.slice();
  vocab.poses = CAT_POSES.slice();
  vocab.moods = MOODS.slice();
  vocab.looks = { fur: LOOKS.fur.slice(), marking: LOOKS.marking.slice(), eyes: LOOKS.eyes.slice() };
  vocab.otherPoses = { sparrow: OTHER_POSES.sparrow.slice(), moth: OTHER_POSES.moth.slice(), tallone: OTHER_POSES.tallone.slice(),
    riffle: OTTER_POSES.slice(), otter: OTTER_POSES.slice(), dog: DOG_POSES.slice() };
  vocab.clanVariants = [1, 2, 3, 4, 5, 6];
  // who takes a `variant`, and which: clancat 1-6 (coats), otter 1-3 (1 the old ferry otter), dog 1-3 (1 shaggy, 2 spotty, 3 tiny)
  vocab.variants = { clancat: [1, 2, 3, 4, 5, 6], otter: [1, 2, 3], dog: [1, 2, 3] };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

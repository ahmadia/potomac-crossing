/* Potomac Crossing: character art.
 *
 * Cats, the Tall One, the sparrow and the moth, drawn in code as flat papercut SVG, plus the
 * Counts pictures (cats in rows, one counted thing each) and the sand tallies.
 *
 *   PC.art.character(who, opts) -> { svg, w, h, head: {x, y} }
 *   PC.art.cat(opts)            -> same shape, a cat from opts.look
 *   PC.art.countsPicture({ table, groups, highlight }) -> '<svg ...>...</svg>'
 *   PC.art.sand({ groups, per, counted })              -> '<svg ...>...</svg>'
 *   PC.art.vocab.{cast, poses, moods, looks}
 *
 * `svg` is markup for a group (no outer <svg>) drawn in a local box 0..w x 0..h, with the
 * character's feet centred at (w/2, h). Every cat is drawn facing right and mirrored for
 * facing left. Ids (clip paths, shapes) carry a module counter, so many characters can share
 * one panel.
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
  var CAST_IDS = ['player', 'tallyheart', 'glintstar', 'waffles', 'tallone', 'grizzled', 'snorer', 'mutterer', 'snorter', 'clancat', 'sparrow', 'moth'];
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

  var MOOD_TAIL = { happy: 'up', proud: 'up', wonder: 'up', laugh: 'up', shout: 'up', dreamy: 'wrap',
    kind: 'wrap', sleepy: 'wrap', worried: 'down', stern: 'out', sniff: 'out' };
  var EAR_ANG = { neutral: 0, happy: -2, dreamy: 4, wonder: -6, worried: 24, scared: 58, sleepy: 14, laugh: 6,
    stern: -10, kind: 3, proud: -4, sniff: -6, shout: 10, solemn: -3 };
  var HEAD_ROT = { proud: -12, laugh: -8, shout: -6, wonder: -5, sleepy: 7, worried: 4, sniff: 7, scared: 5, dreamy: -6, solemn: -9 };
  var EYE_KIND = { neutral: 'open', happy: 'arc', dreamy: 'lidUp', wonder: 'wonder', worried: 'open', scared: 'scared',
    sleepy: 'closed', laugh: 'squeeze', stern: 'lidFlat', kind: 'lidSoft', proud: 'arc', sniff: 'lidSoft', shout: 'open', solemn: 'lidHalf' };
  var BROW = { worried: [-5, 3], scared: [-6, 3], stern: [5, -4], shout: [-4, -5], solemn: [-3, -3] };   // shout is excitement in this story (calls, cheers, "Thirteen!"), so raised brows, never cross; solemn: level, no frown
  // upper lids for the 'lid' eye kinds: [inner corner y, curve control y, outer corner y], in eye coordinates
  var LID = { lidSoft: [2, -10.5, -2], lidFlat: [3.4, 1.4, -4.6], lidHalf: [-0.4, 0.4, -1.2] };
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
    // whiskers
    var wy = ff ? 8 : 12;
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
    // the chest comes down with it, or a close-up (fountain-close) shows a gap under the chin
    var neckDrop = pose === 'sit' || pose === 'lookup' ? Math.max(0, (chest[1] - chest[2]) - (P.chest[1] - P.chest[2])) : 0;
    var hpos = [P.head[0] + (mood === 'sniff' ? 5 : 0), P.head[1] + neckDrop + (mood === 'sniff' ? 2 : mood === 'proud' || mood === 'solemn' ? -2 : 0)];
    var hsc = sp.headS || 1;
    var hm = mul(mT(hpos[0], hpos[1]), mul(mR(hrot), mS(hsc)));
    var head = '<g transform="' + mStr(hm) + '">' + headSvg(R, sp, mood, {
      F: F, sx: sx, earBias: P.earBias || 0, look: [1.4 + (P.look ? P.look[0] : 0), P.look ? P.look[1] : 0]
    }) + '</g>';

    // ----- assemble back to front
    var body = '';
    if (!tailFront) body += tailSvg;
    (P.far || []).forEach(function (L) { body += limb(L, true); });
    body += torso;
    if (P.haunch) body += haunchPart(P.haunch);
    (P.backPaws || []).forEach(function (pp) { body += paw(pp, false); });
    (P.near || []).forEach(function (L) { if (!L.afterHead) body += limb(L, false); });
    if (tailFront) body += tailSvg;
    body += head;
    (P.near || []).forEach(function (L) { if (L.afterHead) body += limb(L, false); });

    // ----- fit: keep the whole cat inside the 200 x 200 box (big cats in long poses shrink a little)
    var pts = tg.pts.concat(tl.pts);
    function addPts(a) { pts = pts.concat(a); }
    (P.far || []).concat(P.near || []).forEach(function (L) {
      if (L.leg) addPts([L.leg[0], L.leg[1]].map(function (c) { return [c[0], c[1]]; }));
      if (L.paw) addPts([[L.paw[0] - 11, L.paw[1] - 7], [L.paw[0] + 12, L.paw[1] + 7]]);
    });
    (P.backPaws || []).forEach(function (pp) { addPts([[pp[0] - 11, pp[1] - 7], [pp[0] + 12, pp[1] + 7]]); });
    var hb = [[-47, -6], [47, -6], [-44, 22], [44, 22], [0, 30], [0, -34]].concat(earTips(sp, mood, P.earBias || 0));
    if (mood === 'sniff') hb.push([66, -4]);
    if (fl) hb.push([-48, 26], [48, 26], [-50, 0], [50, 0], [-30, 43], [30, 43], [0, 47]);
    addPts(hb.map(function (q) { return apply(hm, q); }));
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
    return {
      svg: svg, w: 200, h: 200, head: { x: Math.round(hc[0] * 10) / 10, y: Math.round(hc[1] * 10) / 10 },
      headBox: headBox, bounds: bounds,
      _marks: { M: M, scale: sc, tail: tailD, tailTip: add(tl.at(1).p, tl.at(1).t, tl.at(1).w * 0.6), ears:[apply(M, apply(hm, [-21, -38])), apply(M, apply(hm, [21, -38]))], paws: paws }
    };
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

  // ------------------------------------------------------------------ public: characters

  function catSpec(who, o) {
    if (who === 'player') return resolve(specFromLook(o.look));
    if (who === 'clancat') {
      var v = clamp(intOr(o.variant, 1), 1, 6);
      return resolve(CLAN[v - 1]);
    }
    return resolve(PRESETS[who]);
  }

  art.character = function (who, opts) {
    var o = opts || {};
    var r;
    if (who === 'tallone') r = tallOne(o);
    else if (who === 'sparrow') r = sparrow(o);
    else if (who === 'moth') r = moth(o);
    else r = buildCat(catSpec(PRESETS[who] || who === 'player' || who === 'clancat' ? who : 'clancat', o), o);
    var out = { svg: r.svg, w: r.w, h: r.h, head: r.head };
    if (r.headBox) { out.headBox = r.headBox; out.bounds = r.bounds; }
    return out;
  };

  art.cat = function (opts) {
    var o = opts || {};
    var r = buildCat(resolve(specFromLook(o.look)), o);
    return { svg: r.svg, w: r.w, h: r.h, head: r.head, headBox: r.headBox, bounds: r.bounds };
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

  art.countsPicture = function (opts) {
    var o = opts || {};
    var table = clamp(intOr(o.table, 1), 1, 10), groups = clamp(intOr(o.groups, 1), 0, 20);
    var hl = clamp(intOr(o.highlight, 0), 0, table * groups);
    var cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var pad = 18, body = '', count = 0;
    var spec = { 1: [176, 128], 2: [176, 170], 3: [214, 128], 4: [176, 150], 5: [150, 150], 10: [250, 150] }[table] || [176, 176];
    var CW = spec[0], CH = spec[1];
    var W = pad * 2 + cols * CW, H = pad * 2 + rows * CH;
    for (var gi = 0; gi < groups; gi++) {
      var row = Math.floor(gi / 5), col = gi % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = pad + (W - pad * 2 - inRow * CW) / 2 + col * CW, y0 = pad + row * CH, g = '';
      if (table === 1) {
        // sleepy loaves with their tails up: the tails are what you count
        var c1 = buildCat(countsCat(gi, { tailW: 1.35, scale: 1 }), { pose: 'loaf', mood: 'sleepy', tail: 'flag' });
        var lit = count < hl; count++;
        g += '<ellipse cx="100" cy="196" rx="68" ry="9" fill="#3f5a2e" opacity=".14"/>';
        if (lit) {
          g += '<g transform="' + mStr(c1._marks.M) + '"><path d="' + c1._marks.tail + '" fill="' + GLOW + '" stroke="' + GLOW + '" stroke-width="28" stroke-linejoin="round" opacity=".38"/>' +
            '<path d="' + c1._marks.tail + '" fill="none" stroke="' + GLOW2 + '" stroke-width="12" stroke-linejoin="round"/></g>';
        }
        g += c1.svg;
        if (lit) { var tip = apply(c1._marks.M, c1._marks.tailTip); g += sparkle(tip[0] - 2, tip[1] - 12, 9); }
        body += cell(g, x0 - 6, y0 - 62, 0.9);
      } else if (table === 2) {
        var c2 = buildCat(countsCat(gi), { pose: 'sit', mood: 'happy' });
        g += '<ellipse cx="100" cy="196" rx="54" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var eg = '';
        c2._marks.ears.forEach(function (e) { if (count < hl) eg += glow(e[0], e[1] + 4, 24); count++; });
        g += eg + c2.svg;
        body += cell(g, x0 - 2, y0 - 18, 0.9);
      } else if (table === 3) {
        // a patrol of three
        g += '<rect x="4" y="10" width="' + (CW - 8) + '" height="' + (CH - 16) + '" rx="20" fill="#d6e5c8"/>';
        for (var k3 = 0; k3 < 3; k3++) {
          var c3 = buildCat(countsCat(gi * 3 + k3), { pose: 'walk', mood: 'happy' }), gg = '';
          if (count < hl) gg += glow(100, 140, 66);
          count++;
          g += cell(gg + c3.svg, 6 + k3 * 64, 12 + (k3 % 2) * 4, 0.52);
        }
        body += cell(g, x0, y0, 1);
      } else if (table === 4) {
        var c4 = buildCat(countsCat(gi), { pose: 'stand', mood: 'happy' });
        g += '<ellipse cx="100" cy="196" rx="70" ry="8" fill="#3f5a2e" opacity=".14"/>';
        var pg = '';
        c4._marks.paws.slice(0, 4).sort(function (a, b) { return a[0] - b[0]; }).forEach(function (pp) {
          if (count < hl) pg += glow(pp[0], pp[1], 17);
          count++;
        });
        g += pg + c4.svg;
        body += cell(g, x0 - 2, y0 - 38, 0.9);
      } else if (table === 5 || table === 10) {
        var paws = table === 5 ? 1 : 2;
        for (var pi = 0; pi < paws; pi++) {
          var litN = clamp(hl - count, 0, 5); count += 5;
          g += cell(forepaw(litN), 70 + pi * 110, 84, 1);
        }
        body += cell(g, x0, y0, 1);
      } else {
        // the other tables: a cat and its pebbles, `table` of them, in rows of five
        var c6 = buildCat(countsCat(gi), { pose: 'sit', mood: 'kind' });
        g += cell(c6.svg, 30, 0, 0.6);
        for (var j = 0; j < table; j++) {
          var px = 24 + (j % 5) * 26, py = 132 + Math.floor(j / 5) * 22;
          if (count < hl) g += glow(px, py, 14);
          count++;
          g += '<ellipse cx="' + px + '" cy="' + py + '" rx="9" ry="7" fill="#a9b3bd" stroke="#5f6a76" stroke-width="2"/><ellipse cx="' + (px - 3) + '" cy="' + (py - 3) + '" rx="3" ry="2" fill="#fff" opacity=".7"/>';
        }
        body += cell(g, x0 + 8, y0, 1);
      }
    }
    var thing = { 1: 'tail', 2: 'ears', 3: 'cats', 4: 'paws', 5: 'claws', 10: 'claws' }[table] || 'pebbles';
    var unit = { 3: 'patrols', 5: 'forepaws', 10: 'pairs of forepaws' }[table] || 'cats';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + groups + ' ' + unit + ', ' + table + ' ' + thing + ' each">' +
      '<rect x="4" y="4" width="' + N(W - 8) + '" height="' + N(H - 8) + '" rx="22" fill="#e6efdc" stroke="#c4d6b6" stroke-width="3"/>' + body + '</svg>';
  };

  // ------------------------------------------------------------------ public: sand tallies

  art.sand = function (opts) {
    var o = opts || {};
    var groups = clamp(intOr(o.groups, 1), 0, 20), per = clamp(intOr(o.per, 1), 1, 10);
    var counted = clamp(intOr(o.counted, 0), 0, groups * per);
    var SP = 17, LEN = 40, perRow = Math.min(per, 5), subRows = Math.ceil(per / 5);
    var cw = perRow * SP + 26, ch = subRows * (LEN + 12) + 18, gap = 16, pad = 26;
    var cols = Math.max(1, Math.min(5, groups)), rows = Math.max(1, Math.ceil(groups / 5));
    var W = pad * 2 + cols * cw + (cols - 1) * gap, H = pad * 2 + rows * ch + (rows - 1) * gap;
    // the sandy patch, a soft wobbly blob
    var edge = [], n = 28;
    for (var i = 0; i < n; i++) {
      // a squircle, so the corner clusters still sit on sand
      var a = Math.PI * 2 * i / n, k = 0.97 + 0.03 * rand(i * 3 + 1), c = Math.cos(a), sn = Math.sin(a);
      edge.push([W / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.42) * (W / 2 - 5) * k,
        H / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.42) * (H / 2 - 5) * k]);
    }
    var s = '<path d="' + crClosed(edge) + '" fill="#efd6a2" stroke="#cfae72" stroke-width="3"/>';
    var dots = '';
    for (var d = 0; d < Math.round(W * H / 900); d++) {
      var dx = W / 2 + (rand(d * 5 + 2) - 0.5) * (W - 60), dy = H / 2 + (rand(d * 5 + 3) - 0.5) * (H - 40);
      dots += '<circle cx="' + N(dx) + '" cy="' + N(dy) + '" r="' + N(0.8 + rand(d) * 1.4) + '"/>';
    }
    s += '<g fill="#d3b57c" opacity=".7">' + dots + '</g>';
    var idx = 0;
    for (var g = 0; g < groups; g++) {
      var row = Math.floor(g / 5), col = g % 5, inRow = Math.min(5, groups - row * 5);
      var x0 = (W - (inRow * cw + (inRow - 1) * gap)) / 2 + col * (cw + gap), y0 = pad + row * (ch + gap);
      s += '<rect x="' + N(x0) + '" y="' + N(y0) + '" width="' + cw + '" height="' + ch + '" rx="18" fill="#e3c68c" opacity=".55"/>';
      for (var j = 0; j < per; j++) {
        var sx = x0 + 13 + SP / 2 + (j % 5) * SP, sy = y0 + 12 + Math.floor(j / 5) * (LEN + 12);
        var lit = idx < counted; idx++;
        var d1 = 'M' + N(sx + 4) + ',' + N(sy) + 'Q' + N(sx + 1) + ',' + N(sy + LEN / 2) + ' ' + N(sx - 4) + ',' + N(sy + LEN);
        if (lit) s += '<path d="' + d1 + '" stroke="#ffd25e" stroke-width="13" stroke-linecap="round" fill="none" opacity=".55"/>';
        s += '<path d="' + d1 + '" stroke="' + (lit ? '#e39a12' : '#9c7440') + '" stroke-width="4.6" stroke-linecap="round" fill="none"/>' +
          '<path d="' + d1 + '" transform="translate(1.8,0)" stroke="' + (lit ? '#fff4c2' : '#fbecc8') + '" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"/>';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + ' ' + N(H) + '" role="img" aria-label="' + groups + ' groups of ' + per + ' scratches in the sand">' + s + '</svg>';
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
  vocab.otherPoses = { sparrow: OTHER_POSES.sparrow.slice(), moth: OTHER_POSES.moth.slice(), tallone: OTHER_POSES.tallone.slice() };
  vocab.clanVariants = [1, 2, 3, 4, 5, 6];

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

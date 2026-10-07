/* Potomac Crossing · app/art/scenes.js
 *
 * The sets and the panel renderer.  PC.art.render(scene, ctx) -> { svg, heads, keep }.
 * heads: one per cast member, in cast order: null when out of shot, else { x, y } in percent of
 * the panel, plus r (the face's radius, percent of the panel width) for cats, Riffle, the otters
 * and the dogs (see faceR).
 *
 * Every set is drawn in a 1600 x 1000 world, and each camera is a 16:10 viewBox onto it
 * (docs/build.md, "Art vocabulary").  A few cameras look at a set from somewhere the wide
 * shot cannot (the balcony nineteen floors up, the inside of the den): those cameras have
 * their own composition in the same 1600 x 1000 space, with their own anchor spots.
 *
 * Characters come from PC.art.character(who, opts) in app/art/cats.js.  If it is missing,
 * a plain placeholder cat is drawn so the sets can still be checked.
 *
 * Style: flat papercut, 3-5 depth layers, a soft shadow under each layer, rounded shapes.
 * Animation is CSS only (PC.art.css), all of it inside prefers-reduced-motion: no-preference.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});

  var WORLD_W = 1600, WORLD_H = 1000, TENTHS = 0.625;
  var serial = 0;

  // ------------------------------------------------------------------ numbers and colours

  function n(v) { var r = Math.round(v * 10) / 10; return r === 0 ? '0' : String(r); }
  function n4(v) { var r = Math.round(v * 10000) / 10000; return r === 0 ? '0' : String(r); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function sgn(v) { return v < 0 ? -1 : 1; }
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedOf(str) {
    var h = 2166136261;
    str = String(str);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function gauss(r) { var u = r() || 1e-6, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function hexRgb(h) {
    h = String(h).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var v = parseInt(h, 16) || 0;
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function rgbHex(c) {
    var s = '#';
    for (var i = 0; i < 3; i++) {
      var x = clamp(Math.round(c[i]), 0, 255);
      s += (x < 16 ? '0' : '') + x.toString(16);
    }
    return s;
  }
  function mix(a, b, t) {
    var A = hexRgb(a), B = hexRgb(b);
    return rgbHex([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]);
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ------------------------------------------------------------------ SVG strings

  function attrs(o) {
    var s = '';
    if (!o) return s;
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var v = o[k];
      if (v === null || v === undefined || v === false) continue;
      s += ' ' + k + '="' + (typeof v === 'number' ? n(v) : esc(v)) + '"';
    }
    return s;
  }
  function rect(x, y, w, h, fill, o) {
    return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(Math.max(0, w)) + '" height="' +
      n(Math.max(0, h)) + '" fill="' + fill + '"' + attrs(o) + '/>';
  }
  function circ(cx, cy, r, fill, o) {
    return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(Math.max(0, r)) + '" fill="' + fill + '"' + attrs(o) + '/>';
  }
  function ell(cx, cy, rx, ry, fill, o) {
    return '<ellipse cx="' + n(cx) + '" cy="' + n(cy) + '" rx="' + n(Math.max(0, rx)) + '" ry="' +
      n(Math.max(0, ry)) + '" fill="' + fill + '"' + attrs(o) + '/>';
  }
  function path(d, fill, o) { return d ? '<path d="' + d + '" fill="' + fill + '"' + attrs(o) + '/>' : ''; }
  function stroke(d, color, w, o) {
    if (!d) return '';
    var a = { stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (o) for (var k in o) a[k] = o[k];
    return '<path d="' + d + '" fill="none"' + attrs(a) + '/>';
  }
  function pts(list) {
    var d = '';
    for (var i = 0; i < list.length; i++) d += (i ? 'L' : 'M') + n(list[i][0]) + ' ' + n(list[i][1]);
    return d;
  }
  function poly(list, fill, o) { return path(pts(list) + 'Z', fill, o); }
  function g(inner, o) { return inner ? '<g' + attrs(o) + '>' + inner + '</g>' : ''; }
  function tr(x, y, sx, sy) {
    return 'translate(' + n(x) + ' ' + n(y) + ')' + (sx != null ? ' scale(' + n4(sx) + ' ' + n4(sy == null ? sx : sy) + ')' : '');
  }
  function dot(x, y, r) {
    return 'M' + n(x - r) + ' ' + n(y) + 'a' + n(r) + ' ' + n(r) + ' 0 1 0 ' + n(2 * r) + ' 0a' + n(r) + ' ' +
      n(r) + ' 0 1 0 ' + n(-2 * r) + ' 0';
  }
  function leafD(x, y, len, ang, wid) {
    var c = Math.cos(ang), s = Math.sin(ang), ex = x + c * len, ey = y + s * len;
    var mx = x + c * len * 0.5, my = y + s * len * 0.5, px = -s * wid, py = c * wid;
    return 'M' + n(x) + ' ' + n(y) + 'Q' + n(mx + px) + ' ' + n(my + py) + ' ' + n(ex) + ' ' + n(ey) +
      'Q' + n(mx - px) + ' ' + n(my - py) + ' ' + n(x) + ' ' + n(y) + 'Z';
  }
  function bladeD(x, y, h, lean, w) {
    return 'M' + n(x - w) + ' ' + n(y) + 'Q' + n(x + lean * 0.3) + ' ' + n(y - h * 0.6) + ' ' + n(x + lean) + ' ' +
      n(y - h) + 'Q' + n(x + lean * 0.2 + w * 0.4) + ' ' + n(y - h * 0.5) + ' ' + n(x + w) + ' ' + n(y) + 'Z';
  }
  function sparkleD(x, y, r) {
    var k = r * 0.22;
    return 'M' + n(x) + ' ' + n(y - r) + 'Q' + n(x + k) + ' ' + n(y - k) + ' ' + n(x + r) + ' ' + n(y) +
      'Q' + n(x + k) + ' ' + n(y + k) + ' ' + n(x) + ' ' + n(y + r) + 'Q' + n(x - k) + ' ' + n(y + k) + ' ' +
      n(x - r) + ' ' + n(y) + 'Q' + n(x - k) + ' ' + n(y - k) + ' ' + n(x) + ' ' + n(y - r) + 'Z';
  }
  function bez2(a, b, c, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]; }
  function bez3(a, b, c, d, t) {
    var u = 1 - t;
    return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
  }

  // A rounded, scalloped mound sitting on a flat base (hedges, bushes, dens, tree lines).
  // box 0 = half-ellipse, 1 = nearly a rounded rectangle.
  function mound(x0, x1, base, top, k, r, bulge, jit, box) {
    var cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = base - top, e = 1 - (box || 0) * 0.75, P = [];
    for (var i = 0; i <= k; i++) {
      var a = Math.PI + Math.PI * i / k, c = Math.cos(a), s = Math.sin(a);
      var j = (i === 0 || i === k) ? 1 : 1 + (r() - 0.5) * jit;
      P.push([cx + sgn(c) * Math.pow(Math.abs(c), e) * rx * j, base + sgn(s) * Math.pow(Math.abs(s), e) * ry * j]);
    }
    return scallops(P, cx, base, bulge, false);
  }
  // A closed, bumpy blob (clouds, canopies, moss).
  function blob(cx, cy, rx, ry, k, r, jit, bulge) {
    var P = [];
    for (var i = 0; i < k; i++) {
      var a = Math.PI * 2 * i / k + (r() - 0.5) * 0.3, j = 1 + (r() - 0.5) * jit;
      P.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    return scallops(P, cx, cy, bulge, true);
  }
  function scallops(P, cx, cy, bulge, closed) {
    var d = 'M' + n(P[0][0]) + ' ' + n(P[0][1]), m = closed ? P.length : P.length - 1;
    for (var i = 0; i < m; i++) {
      var A = P[i], B = P[(i + 1) % P.length], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      var nx = B[1] - A[1], ny = -(B[0] - A[0]), L = Math.sqrt(nx * nx + ny * ny) || 1;
      nx /= L; ny /= L;
      if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
      d += 'Q' + n(mx + nx * L * bulge) + ' ' + n(my + ny * L * bulge) + ' ' + n(B[0]) + ' ' + n(B[1]);
    }
    return d + 'Z';
  }

  // ------------------------------------------------------------------ palettes (time of day)
  // The daylight palettes (morning, day) carry `day: true`: no lamps, fireflies or star-lit gaps,
  // and lit windows read as glints on the glass (`lit` at `litOp` of the usual strength).

  var PAL = {
    sunset: {
      sky: ['#6B5797', '#A9668F', '#E57A6E', '#F39A6B', '#F6B26B', '#FBD08C'],
      sun: '#FFE9AE', glow: '#FFC77D', haze: '#E99A82',
      glassTop: '#4F8C94', glassBot: '#244B58', glassEdge: '#9CD0CF', refl: '#F7A866', lit: '#FFD27F', litP: 0.2, mullion: '#0E2630',
      grass: '#4C7C4F', grassFar: '#76955A', grassNear: '#2F5240', grassLight: '#8FB066',
      leaf: '#2F5240', leafMid: '#3E6B4A', leafLight: '#68955A', rim: '#F6B26B',
      wood: '#A06E50', woodLight: '#CB9469', woodDark: '#6A4434',
      stone: '#C9B4A2', stoneDark: '#8F7D78', stoneLight: '#EBD7C2', moss: '#7E9C52',
      sand: '#EBC992', sandDark: '#CFA46E', sandLight: '#F7E3B6',
      water: '#4D5F93', shade: '#2A1F3D', ink: '#2A2236', starOp: 0.5
    },
    dusk: {
      sky: ['#3B3A74', '#5F4F8E', '#8E64A0', '#C9738A', '#E58E7A', '#F2AE7A'],
      sun: '#FFD9A0', glow: '#F2A27E', haze: '#9C7AA0',
      glassTop: '#3E6F80', glassBot: '#1E3C4C', glassEdge: '#7FB3BC', refl: '#E8907A', lit: '#FFD27F', litP: 0.33, mullion: '#0B1E28',
      grass: '#3E6748', grassFar: '#5E7A58', grassNear: '#264538', grassLight: '#6E9060',
      leaf: '#264538', leafMid: '#335A43', leafLight: '#557E57', rim: '#E89A8A',
      wood: '#87604F', woodLight: '#A87A62', woodDark: '#573A30',
      stone: '#AE9FA0', stoneDark: '#7A6E76', stoneLight: '#CFC0BC', moss: '#647F4E',
      sand: '#D4B391', sandDark: '#B38E72', sandLight: '#E6CDAE',
      water: '#3E4C80', shade: '#1E1730', ink: '#221C30', starOp: 0.6
    },
    golden: {
      sky: ['#B98AA6', '#DE9F86', '#F0B878', '#F7CF8C', '#FBE3AE'],
      sun: '#FFF1C4', glow: '#FFD98A', haze: '#E9B98A',
      glassTop: '#F4CB78', glassBot: '#A9785A', glassEdge: '#FFE6A8', refl: '#FFEFC0', lit: '#FFF3CC', litP: 0.12, mullion: '#5A3A2A',
      grass: '#6A8A48', grassFar: '#97A45A', grassNear: '#3F6339', grassLight: '#B6C06A',
      leaf: '#2F5240', leafMid: '#46704A', leafLight: '#86A55A', rim: '#F2C46D',
      wood: '#8E6448', woodLight: '#B9895E', woodDark: '#5E3F2E',
      stone: '#CDB89C', stoneDark: '#94806A', stoneLight: '#EEDDBE', moss: '#8AA552',
      sand: '#EDCB8C', sandDark: '#D1A566', sandLight: '#F8E4B4',
      water: '#5A6E96', shade: '#3A2A2A', ink: '#2E2420', starOp: 0.4
    },
    night: {
      sky: ['#0E1A33', '#132246', '#1A2B52', '#22345F', '#2C3F6C'],
      sun: null, glow: '#3A4C80', haze: '#2A3A62',
      glassTop: '#2C4862', glassBot: '#142638', glassEdge: '#5D7FA6', refl: '#3D5A88', lit: '#FFD27F', litP: 0.38, mullion: '#06101C',
      grass: '#1F3A36', grassFar: '#2A4644', grassNear: '#142824', grassLight: '#3E5E58',
      leaf: '#14302B', leafMid: '#1D3E36', leafLight: '#365E52', rim: '#8FA8D8',
      wood: '#4C3E48', woodLight: '#6A5866', woodDark: '#2E2430',
      stone: '#5E6378', stoneDark: '#3E4256', stoneLight: '#7C8298', moss: '#3C5A4A',
      sand: '#77748A', sandDark: '#5A586E', sandLight: '#8E8BA0',
      water: '#16233A', shade: '#050A18', ink: '#050A18', starOp: 0.9
    },
    storm: {
      sky: ['#151B26', '#1D2533', '#273140', '#323D4E', '#3C4859'],
      sun: null, glow: '#556680', haze: '#2C3644',
      glassTop: '#2A3A4A', glassBot: '#151F2B', glassEdge: '#5A6E86', refl: '#3A4A60', lit: '#FFD27F', litP: 0.3, mullion: '#05090F',
      grass: '#1B302C', grassFar: '#25393A', grassNear: '#11221F', grassLight: '#33504A',
      leaf: '#13261F', leafMid: '#1B3229', leafLight: '#2E4A40', rim: '#9FB0C8',
      wood: '#423A40', woodLight: '#5A5058', woodDark: '#29222A',
      stone: '#4F5566', stoneDark: '#343848', stoneLight: '#6A7084', moss: '#33503F',
      sand: '#66667A', sandDark: '#4C4C60', sandLight: '#7A7A8E',
      water: '#0F1824', shade: '#03060C', ink: '#03060C', starOp: 0
    },
    // chapter 2: the morning after the storm, washed clean, low sun, everything wet and bright
    morning: {
      sky: ['#8FB8DA', '#A9C9E2', '#C5DAE8', '#E3E6E0', '#F6E7C8'],
      sun: '#FFF4D6', glow: '#FFE2A8', haze: '#D8E2E6',
      glassTop: '#9CC6DA', glassBot: '#4F7E96', glassEdge: '#DDF0F6', refl: '#FFF1CF', lit: '#F2FAFC', litP: 0.04, litOp: 0.45, mullion: '#1F3A48',
      grass: '#5E9152', grassFar: '#8DB070', grassNear: '#3C6B43', grassLight: '#A8CC7A',
      leaf: '#336447', leafMid: '#4A7F55', leafLight: '#86B567', rim: '#FFF0C8',
      wood: '#8F6A50', woodLight: '#B98F6C', woodDark: '#5C4334',
      stone: '#C2BCB2', stoneDark: '#8A857E', stoneLight: '#E6E1D6', moss: '#86A85A',
      sand: '#E6CF9E', sandDark: '#C7AA74', sandLight: '#F4E6C2',
      water: '#6F98B8', shade: '#2C3A4A', ink: '#25303C', starOp: 0, day: true
    },
    // full daylight (the afternoon walk, the Crossing)
    day: {
      sky: ['#5FA3DC', '#7DB6E4', '#9CC9EA', '#BFDDEE', '#DCEDF2'],
      sun: '#FFFBE6', glow: '#FFF3C4', haze: '#CFE3EE',
      glassTop: '#8EC3E0', glassBot: '#3E7392', glassEdge: '#E2F4FB', refl: '#FFFFFF', lit: '#F4FBFE', litP: 0.03, litOp: 0.4, mullion: '#1A3444',
      grass: '#5C9A4C', grassFar: '#8CBB66', grassNear: '#3A7040', grassLight: '#A9D27A',
      leaf: '#2F6A40', leafMid: '#468650', leafLight: '#86BF62', rim: '#FFFFFF',
      wood: '#94704F', woodLight: '#C29A72', woodDark: '#5E4532',
      stone: '#C8C4BA', stoneDark: '#8C8880', stoneLight: '#EEEAE0', moss: '#88AE58',
      sand: '#EBD39E', sandDark: '#CBAE74', sandLight: '#F7EAC6',
      water: '#5F8FB8', shade: '#2A3A4C', ink: '#222C38', starOp: 0, day: true
    }
  };

  // A gentle colour wash on the characters so they sit in the light of the scene.
  var CAST_TINT = {
    dusk: '0.98 0 0 0 0.01  0 0.94 0 0 0.01  0 0 0.98 0 0.025  0 0 0 1 0',
    golden: '1 0 0 0 0.025  0 0.97 0 0 0.012  0 0 0.88 0 0  0 0 0 1 0',
    night: '0.7 0 0 0 0.015  0 0.74 0 0 0.025  0 0 0.88 0 0.07  0 0 0 1 0',
    storm: '0.64 0 0 0 0.015  0 0.68 0 0 0.025  0 0 0.8 0 0.06  0 0 0 1 0'
  };

  // ------------------------------------------------------------------ render context

  function makeCtx(uid) {
    var S = { uid: uid, defs: [], made: {}, n: 0, covers: {} };
    function once(key, xml) {
      if (!S.made[key]) { S.made[key] = true; S.defs.push(xml); }
      return 'url(#' + uid + '-' + key + ')';
    }
    function fresh(prefix) { S.n += 1; return prefix + S.n; }
    function stopsXml(stops) {
      var s = '';
      for (var i = 0; i < stops.length; i++) {
        var st = stops[i];
        s += '<stop offset="' + (+st[0]).toFixed(3) + '" stop-color="' + st[1] + '"' +
          (st[2] != null ? ' stop-opacity="' + (+st[2]).toFixed(3) + '"' : '') + '/>';
      }
      return s;
    }
    S.id = function (k) { return uid + '-' + k; };
    // Linear gradient over each shape's own box (vertical unless told otherwise).
    S.lin = function (key, stops, x1, y1, x2, y2) {
      return once('l-' + key, '<linearGradient id="' + uid + '-l-' + key + '" x1="' + (x1 || 0) + '" y1="' + (y1 || 0) +
        '" x2="' + (x2 == null ? 0 : x2) + '" y2="' + (y2 == null ? 1 : y2) + '">' + stopsXml(stops) + '</linearGradient>');
    };
    // Linear gradient in world coordinates (a fresh one each call).
    S.linU = function (stops, x1, y1, x2, y2) {
      var k = fresh('lu');
      return once(k, '<linearGradient id="' + uid + '-' + k + '" gradientUnits="userSpaceOnUse" x1="' + n(x1) + '" y1="' +
        n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '">' + stopsXml(stops) + '</linearGradient>');
    };
    // Radial gradient centred in each shape's box.
    S.radB = function (key, stops) {
      return once('r-' + key, '<radialGradient id="' + uid + '-r-' + key + '">' + stopsXml(stops) + '</radialGradient>');
    };
    // Radial gradient in world coordinates (a fresh one each call).
    S.radU = function (stops, cx, cy, r) {
      var k = fresh('ru');
      return once(k, '<radialGradient id="' + uid + '-' + k + '" gradientUnits="userSpaceOnUse" cx="' + n(cx) + '" cy="' +
        n(cy) + '" r="' + n(r) + '">' + stopsXml(stops) + '</radialGradient>');
    };
    S.clip = function (key, shape) {
      return once('c-' + key, '<clipPath id="' + uid + '-c-' + key + '">' + shape + '</clipPath>');
    };
    S.pattern = function (key, w, h, inner) {
      return once('p-' + key, '<pattern id="' + uid + '-p-' + key + '" width="' + w + '" height="' + h +
        '" patternUnits="userSpaceOnUse">' + inner + '</pattern>');
    };
    S.filter = function (key, inner, region) {
      return once('f-' + key, '<filter id="' + uid + '-f-' + key + '" ' + (region || 'x="-10%" y="-10%" width="120%" height="120%"') +
        ' color-interpolation-filters="sRGB">' + inner + '</filter>');
    };
    S.blur = function (key, std) {
      return S.filter('b-' + key, '<feGaussianBlur stdDeviation="' + n(std) + '"/>', 'x="-50%" y="-50%" width="200%" height="200%"');
    };
    // The papercut shadow under a layer: s(mall), m(edium), l(arge).
    S.shadow = function (size) {
      var k = { s: [2.5, 3, 0.24], m: [5, 6, 0.3], l: [9, 10, 0.34] }[size || 'm'];
      return S.filter('sh-' + (size || 'm'),
        '<feGaussianBlur in="SourceAlpha" stdDeviation="' + k[0] + '"/><feOffset dx="0" dy="' + k[1] + '" result="o"/>' +
        '<feFlood flood-color="' + S.pal.shade + '" flood-opacity="' + k[2] + '"/><feComposite in2="o" operator="in"/>' +
        '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>',
        'x="-8%" y="-8%" width="116%" height="125%"');
    };
    S.grid = function () {
      return S.pattern('grid', 18, 22, '<path d="M0 .6H18M.6 0V22" stroke="' + S.pal.mullion +
        '" stroke-opacity=".28" stroke-width="1.3" fill="none"/>');
    };
    return S;
  }

  // ------------------------------------------------------------------ characters

  var FUR = {
    'midnight black': ['#2E2A33', '#46404C'], black: ['#2E2A33', '#46404C'],
    'snow white': ['#F5F2EC', '#DCD6CE'], white: ['#F5F2EC', '#DCD6CE'],
    'silver tabby': ['#B8BCC6', '#7E828E'], 'brown tabby': ['#8C6446', '#5E412E'],
    ginger: ['#E38B3E', '#B9662A'], cream: ['#F0D9B0', '#D6B98A'], grey: ['#8F949E', '#6C707A'], gray: ['#8F949E', '#6C707A'],
    tortoiseshell: ['#5A3A2C', '#C9773A'], calico: ['#F4EADC', '#D9853E']
  };
  var PRESET = {
    tallyheart: ['#E38B3E', '#B9662A'], glintstar: ['#C6CCD6', '#99A0AE'], waffles: ['#FBF8F3', '#E3DCD2'],
    grizzled: ['#5C4232', '#3E2C22'], snorer: ['#959BA4', '#71767F'], mutterer: ['#5A3A2C', '#C9773A'],
    snorter: ['#2D2A2E', '#F2EEE8'], player: ['#9A8C80', '#6E645C']
  };
  var CLAN = [['#9C7A5A', '#6E543E'], ['#6E6A72', '#4C4850'], ['#D9A066', '#B07A44'], ['#3A3438', '#5A5258'],
    ['#C9B9A4', '#9E8C78'], ['#7E5A44', '#C08A5A']];
  var EYES = { green: '#7BC86C', amber: '#F2B33D', blue: '#6FB7E8', copper: '#D9773A' };

  function placeholderChar(who, o) {
    o = o || {};
    var pose = o.pose || 'sit';
    if (who === 'sparrow') {
      var fl = pose === 'fluffed', bw = fl ? 15 : 12, bh = fl ? 12 : 9.5;
      return {
        svg: ell(16, 17, bw, bh, '#9A6B4A') + ell(14, 20, bw * 0.7, bh * 0.55, '#ECDCC2') +
          path('M2 14L-5 10L-3 18Z', '#7A5038') + circ(fl ? 25 : 24, fl ? 9 : 9.5, fl ? 6.5 : 6, '#8A5A3C') +
          circ(fl ? 27 : 26, 8.5, 1.4, '#1C1410') + path('M29 9.5L34 11L29 12.5Z', '#E0A040') +
          stroke('M14 26V30M19 26V30', '#7A5038', 1.3),
        w: 34, h: 30, head: { x: 25, y: 9 }, placeholder: true
      };
    }
    if (who === 'moth') {
      return {
        svg: ell(12, 10, 10, 7, '#F2E6CC', { transform: 'rotate(-25 12 10)' }) + ell(26, 10, 10, 7, '#F2E6CC', { transform: 'rotate(25 26 10)' }) +
          ell(19, 13, 3, 8, '#B59A78') + stroke('M18 6L15 1M20 6L23 1', '#8A7458', 1),
        w: 38, h: 24, head: { x: 19, y: 6 }, placeholder: true
      };
    }
    if (who === 'tallone') {
      var can = pose === 'water' || pose === 'stand';
      return {
        svg: rect(40, 0, 44, 380, '#5B7FA6') + rect(96, 0, 44, 380, '#4F739A') + rect(30, 0, 120, 70, '#7C5C9E') +
          ell(58, 392, 34, 14, '#F2A9B6') + ell(122, 392, 34, 14, '#F2A9B6') +
          (can ? path('M150 150H210V215H150Z', '#5FA05A') + stroke('M210 165L250 140', '#5FA05A', 10) + ell(160, 128, 18, 10, '#E8C9A8') : '') +
          (pose === 'set-dish' ? ell(170, 260, 22, 14, '#E8C9A8') : ''),
        w: 260, h: 405, head: { x: 90, y: 0 }, placeholder: true
      };
    }
    var c = PRESET[who] || (who === 'clancat' ? CLAN[(Math.max(1, Math.round(+o.variant || 1)) - 1) % 6] : null) || PRESET.player;
    if (who === 'player' && o.look && FUR[o.look.fur]) c = FUR[o.look.fur];
    var fur = c[0], dk = c[1], eye = EYES[(o.look && o.look.eyes) || 'green'] || '#7BC86C';
    var low = { curl: 1, loaf: 1, lie: 1, flat: 1 }[pose], long = { stand: 1, walk: 1, crouch: 1, peer: 1, stretch: 1, fall: 1 }[pose];
    var s;
    if (low) {
      s = ell(60, 36, 52, 18, fur) + path('M14 40Q-2 30 12 22', 'none', { stroke: dk, 'stroke-width': 8, 'stroke-linecap': 'round' }) +
        circ(98, 28, 16, fur) + path('M88 16L92 2L99 14ZM100 14L109 3L110 18Z', dk) + circ(104, 27, 2.4, pose === 'curl' ? dk : eye);
      return { svg: s, w: 120, h: 54, head: { x: 98, y: 26 }, placeholder: true };
    }
    if (long) {
      s = ell(62, 46, 44, 20, fur) + rect(28, 52, 9, 30, dk) + rect(80, 52, 9, 30, dk) +
        path('M20 40Q2 28 8 10', 'none', { stroke: dk, 'stroke-width': 8, 'stroke-linecap': 'round' }) +
        circ(108, 30, 17, fur) + path('M98 17L101 2L109 14ZM110 14L120 4L121 20Z', dk) + circ(114, 28, 2.6, eye);
      return { svg: s, w: 130, h: 82, head: { x: 108, y: 28 }, placeholder: true };
    }
    var up = pose === 'lookup';
    s = ell(44, 72, 30, 28, fur) + path('M20 92Q-4 90 6 66', 'none', { stroke: dk, 'stroke-width': 8, 'stroke-linecap': 'round' }) +
      circ(up ? 54 : 58, up ? 30 : 34, 19, fur) + path(up ? 'M42 22L40 6L52 16ZM56 14L64 2L68 18Z' : 'M44 24L45 8L56 19ZM60 18L70 6L74 22Z', dk) +
      circ(up ? 62 : 66, up ? 26 : 32, 2.8, eye) + rect(40, 84, 9, 14, dk) + rect(54, 84, 9, 14, dk);
    return { svg: s, w: 90, h: 100, head: { x: up ? 54 : 58, y: up ? 30 : 34 }, placeholder: true };
  }

  function getChar(who, o) {
    var fn = art.character;
    if (typeof fn === 'function' && !fn.placeholder) {
      try {
        var c = fn(who, o);
        if (c && typeof c.svg === 'string' && c.w > 0 && c.h > 0) {
          if (!c.head) c.head = { x: c.w / 2, y: c.h * 0.25 };
          return c;
        }
      } catch (e) { /* fall through to the placeholder */ }
    }
    return placeholderChar(who, o);
  }

  // The height of a standard sitting cat in the character drawings' own units.  Anchor
  // heights in this file are "how tall a sitting cat is at this spot", in world units.
  var refCache = { fn: undefined, h: 100 };
  function refH() {
    var fn = art.character;
    if (refCache.fn === fn) return refCache.h;
    var h = getChar('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }).h || 100;
    refCache = { fn: fn, h: h };
    return h;
  }
  // Which way the character drawings face before any flip.
  function drawnFacing() { return art.characterFacing === 'left' ? 'left' : 'right'; }
  function defaultPose(who) {
    return who === 'sparrow' ? 'perch' : who === 'moth' ? 'fly' : who === 'tallone' ? 'stand' : 'sit';
  }
  // A cast member's drawing options for cats.js: pose, mood, variant, the player's look, and the
  // cast extras cats.js draws (`flatEars: true`; `holds: 'stone' | 'pebble' | 'vole' | 'fish' |
  // 'fish2'` with `holdAt`; chapter 3's `tear`, `mist`, `claws`, `puffed`, `squeeze` and `moss`, each
  // `true`, and a juggling otter's `pebbles: 4 | 5`). `purr` and `lift` are the scene's own (fxPurr,
  // liftPlan), not the drawing's.
  var CAST_EXTRAS = ['flatEars', 'holds', 'holdAt', 'tear', 'mist', 'claws', 'puffed', 'squeeze', 'moss', 'pebbles'];
  function charOpts(S, who, m) {
    var o = { pose: (m && m.pose) || defaultPose(who), mood: (m && m.mood) || 'neutral' };
    if (m && m.variant != null) o.variant = m.variant;
    if (m) CAST_EXTRAS.forEach(function (k) { if (m[k] != null) o[k] = m[k]; });
    if (who === 'player') {
      o.look = S.look || {};
      if (o.look.sex) o.sex = o.look.sex;
    }
    // a Clan cat never wears her coat (cats.js, clanVariant): it knows her look, and the other Clan
    // cats in the panel, so a spare coat is one nobody else here wears
    if (who === 'clancat') {
      o.look = S.look || {};
      o.taken = (S.cast || []).filter(function (c) { return c && c.who === 'clancat'; }).map(function (c) { return c.variant; });
    }
    return o;
  }
  // Place a character with its feet (bottom-centre) at x, y.  Returns { svg, head:[x,y] } in world units.
  function placeChar(S, who, o, x, y, s, face, extra) {
    // cats.js mirrors its own drawing for opts.facing, keeping one-sided details (Tallyheart's
    // torn left ear, Grizzled's scar, odd eyes) on the right side; only placeholders get flipped here
    var oo = {}, k;
    for (k in o) oo[k] = o[k];
    oo.facing = face || 'right';
    var ch = getChar(who, oo);
    var flip = ch.placeholder ? (face || 'right') !== drawnFacing() : false;
    var sx = flip ? -s : s;
    var at = '<g transform="' + tr(x, y, sx, s) + ' translate(' + n(-ch.w / 2) + ' ' + n(-ch.h) + ')"' + attrs(extra) + '>';
    var out = { svg: at + ch.svg + '</g>', ch: ch, head: [x + (ch.head.x - ch.w / 2) * sx, y + (ch.head.y - ch.h) * s], w: ch.w * s, h: ch.h * s };
    // `over`: a part of the drawing that goes over whoever comes after it in the cast (Sprinkle's tail,
    // curled round the cat beside her), in the same box
    if (typeof ch.over === 'string' && ch.over) out.over = at + ch.over + '</g>';
    return out;
  }

  // ------------------------------------------------------------------ shared painters

  function skyGrad(S) {
    var sk = S.pal.sky, st = [];
    for (var i = 0; i < sk.length; i++) st.push([i / (sk.length - 1), sk[i]]);
    return S.lin('sky', st);
  }

  function sky(S, x, y, w, h, o) {
    o = o || {};
    var p = S.pal, s = rect(x, y, w, h, skyGrad(S));
    if (p.sun && o.sun) {
      var R = o.sunR || 380;
      s += circ(o.sun[0], o.sun[1], R, S.radU([[0, p.sun, 0.95], [0.16, p.glow, 0.6], [0.5, p.glow, 0.18], [1, p.glow, 0]], o.sun[0], o.sun[1], R));
      s += circ(o.sun[0], o.sun[1], R * 0.1, p.sun, { opacity: 0.85 });
    }
    if (S.tod === 'storm') s += clouds(S, x, y, w, h * (o.cloudH || 0.75));
    var starry = S.tod === 'night' || S.fx.stars || o.stars;
    if (o.cloudy && S.tod !== 'storm') {
      // a heavy bank of cloud: the moon, the stars and the Sky River are gone; a few stars at the left edge
      if (starry) s += stars(S, x, y, w * 0.075, h * 0.42, 7, (o.seed || 0) + 5);
      return s + cloudBank(S, x, y, w, h);
    }
    if (starry && S.tod !== 'storm') {
      var count = o.starCount || Math.round(w * h / (S.tod === 'night' ? 2300 : 4200));
      s += stars(S, x, y, w, h * (o.starDepth || 0.92), count, o.seed);
    }
    if ((S.fx.skyriver || o.river) && S.tod !== 'storm') s += skyRiver(S, x, y, w, h * (o.riverH || 1), o.riverAt);
    if (S.fx.lightning || o.bolt) s += bolt(S, x + w * (o.boltX == null ? 0.28 : o.boltX), y + h * 0.04, h * (o.boltH || 0.78));
    return s;
  }

  function stars(S, x, y, w, h, count, seed) {
    var r = rng(seed || seedOf(S.set + S.comp + 'stars')), a = '', b = '', c = '', tw = '', nt = 0;
    var op = S.tod === 'night' ? 0.9 : 0.55;
    for (var i = 0; i < count; i++) {
      var sx = x + r() * w, sy = y + Math.pow(r(), 1.35) * h, rr = 0.8 + r() * r() * 2.4, k = r();
      if (i % 10 === 0 && nt < 36) {
        nt++;
        tw += path(sparkleD(sx, sy, rr * 2.6), '#FFF6DE', { 'class': 'pcs-twk', style: 'animation-delay:-' + (r() * 4).toFixed(1) + 's' });
        continue;
      }
      if (k < 0.55) a += dot(sx, sy, rr); else if (k < 0.8) b += dot(sx, sy, rr); else c += dot(sx, sy, rr);
    }
    return path(a, '#FFFFFF', { opacity: op }) + path(b, '#FFE9B8', { opacity: op * 0.8 }) + path(c, '#C4D6FF', { opacity: op * 0.85 }) + tw;
  }

  // The Sky River: a glowing band of light packed with tiny stars, rising left to right.
  // `at` ({ cx, cy, L, ang, T }) places the band by hand, where a set needs it somewhere else.
  function skyRiver(S, x, y, w, h, at) {
    var r = rng(seedOf('skyriver' + S.set + S.comp));
    var cx = x + w * 0.5, cy = y + h * 0.47, L = Math.sqrt(w * w + h * h) * 1.12;
    var ang = -Math.atan2(h * 0.55, w) * 180 / Math.PI, T = Math.max(60, h * 0.2);
    if (at) { cx = at.cx; cy = at.cy; L = at.L; ang = at.ang; T = at.T; }
    var blur = S.blur('river' + Math.round(T), T * 0.24), blur2 = S.blur('river2' + Math.round(T), T * 0.07);
    var s = g(
      ell(0, 0, L * 0.55, T * 1.7, '#7F6FD6', { opacity: 0.26 }) +
      ell(-L * 0.22, -T * 0.2, L * 0.3, T * 1.1, '#6EC6F0', { opacity: 0.24 }) +
      ell(L * 0.22, T * 0.15, L * 0.32, T * 1.05, '#F09AD8', { opacity: 0.24 }) +
      ell(0, 0, L * 0.46, T * 0.72, '#FFE9C8', { opacity: 0.45 }) +
      ell(-L * 0.04, 0, L * 0.26, T * 0.42, '#FFF8EC', { opacity: 0.72 }) +
      ell(-L * 0.1, -T * 0.05, L * 0.12, T * 0.26, '#FFFFFF', { opacity: 0.5 }), { filter: blur });
    var knots = '';
    for (var i = 0; i < 22; i++) {
      var ku = (r() - 0.5) * L * 0.88, kv = gauss(r) * T * 0.24, kc = ['#FFF2DC', '#E3DCFF', '#CDEBFF', '#FFD9F0'][i % 4];
      knots += ell(ku, kv, T * (0.3 + r() * 0.7), T * (0.1 + r() * 0.2), kc, { opacity: 0.3 + r() * 0.25 });
    }
    s += g(knots, { filter: blur2 });
    // the dark rift down the middle
    var d = 'M' + n(-L * 0.48) + ' ' + n(T * 0.05);
    for (i = 1; i <= 16; i++) d += 'L' + n(-L * 0.48 + L * 0.96 * i / 16) + ' ' + n(Math.sin(i * 1.1) * T * 0.15 + (r() - 0.5) * T * 0.08);
    s += stroke(d, S.pal.sky[0], T * 0.17, { opacity: 0.4, filter: blur2 });
    // thousands of tiny stars, packed along the band
    var a = '', b = '', c = '', N = Math.round(2600 * Math.min(1, L / 1800));
    for (i = 0; i < N; i++) {
      var u = (r() - 0.5) * L, fall = 1 - Math.pow(Math.abs(u) / (L * 0.5), 2) * 0.55;
      var v = gauss(r) * T * 0.48 * fall, rr = 0.5 + r() * r() * 1.8, k = r();
      if (k < 0.5) a += dot(u, v, rr); else if (k < 0.78) b += dot(u, v, rr); else c += dot(u, v, rr);
    }
    s += path(a, '#FFFFFF', { opacity: 0.95 }) + path(b, '#FFE7C2', { opacity: 0.9 }) + path(c, '#CFE0FF', { opacity: 0.95 });
    // bright stars with glints
    var tw = '';
    for (i = 0; i < 26; i++) {
      var bu = (r() - 0.5) * L * 0.9, bv = gauss(r) * T * 0.7, br = 3 + r() * 5;
      tw += path(sparkleD(bu, bv, br * 2.3), '#FFFFFF', { 'class': i % 2 ? 'pcs-twk' : null, style: i % 2 ? 'animation-delay:-' + (r() * 4).toFixed(1) + 's' : null });
    }
    s += tw;
    return g(s, { transform: 'translate(' + n(cx) + ' ' + n(cy) + ') rotate(' + n(ang) + ')' });
  }

  // A huge white splash, far off: a crown of water with spray falling outward.

  function clouds(S, x, y, w, h) {
    var r = rng(seedOf('clouds' + S.set + S.comp)), s = '', p = S.pal;
    for (var row = 0; row < 3; row++) {
      var col = mix(p.sky[0], '#6E7E96', 0.18 + row * 0.13), rim = mix(col, '#AFC0D8', 0.35), d = '', dr = '';
      for (var i = 0; i < 7; i++) {
        var cx = x + w * (i + r() * 0.6) / 6.4, cy = y + h * (0.12 + row * 0.26) + (r() - 0.5) * h * 0.1;
        var rx = w * (0.11 + r() * 0.07), ry = h * (0.1 + r() * 0.06);
        d += blob(cx, cy, rx, ry, 10, r, 0.25, 0.32);
        dr += blob(cx, cy + ry * 0.12, rx, ry, 10, rng(seedOf(cx + ':' + cy)), 0.25, 0.32);
      }
      s += path(dr, rim, { opacity: 0.5 }) + path(d, col, { opacity: 0.92 });
    }
    return s;
  }

  // A heavy bank of night cloud over the whole sky but its left edge: dark lumpy rows, lit a
  // little on top, darker underneath. No rain, no lightning.
  function cloudBank(S, x, y, w, h) {
    var p = S.pal, r = rng(seedOf('bank' + S.set + S.comp)), s = '';
    var body = mix(p.sky[1], '#4A5674', 0.5), under = mix(p.sky[0], '#2A3248', 0.55), rim = mix(body, '#9AAAD0', 0.5);
    var left = x + w * 0.09, bottom = y + h * 0.72, step = w * 0.085;
    // the mass: from above the top edge down to a lumpy underside
    var mass = 'M' + n(x + w + 120) + ' ' + n(y - 40) + 'H' + n(left + step * 0.5) + 'Q' + n(left - step * 0.4) + ' ' + n(y + h * 0.2) + ' ' + n(left) + ' ' + n(y + h * 0.42);
    for (var cx = left; cx < x + w + 120; cx += step) {
      var nx = cx + step, dip = bottom + (r() - 0.5) * h * 0.08 - (cx < left + step * 2 ? h * 0.12 : 0);
      mass += 'Q' + n(cx + step * 0.5) + ' ' + n(dip + h * 0.09) + ' ' + n(nx) + ' ' + n(dip);
    }
    mass += 'V' + n(y - 40) + 'Z';
    s += path(mass, under);
    // rows of lumps, lighter toward the top
    for (var row = 0; row < 4; row++) {
      var col = mix(body, under, row / 3.4), rc = mix(rim, col, 0.35 + row * 0.15), d = '', dr = '';
      var yy = y + h * (0.04 + row * 0.16), x0 = left + step * (row === 3 ? 1.6 : row * 0.3);
      for (var bx = x0; bx < x + w + 120; bx += step * (0.9 + r() * 0.5)) {
        var rx = step * (0.75 + r() * 0.5), ry = h * (0.07 + r() * 0.05), by = yy + (r() - 0.5) * h * 0.05;
        d += blob(bx, by, rx, ry, 9, r, 0.2, 0.3);
        dr += blob(bx - rx * 0.06, by - ry * 0.16, rx, ry, 9, rng(seedOf(bx + ':' + by)), 0.2, 0.3);
      }
      s += path(dr, rc, { opacity: 0.7 }) + path(d, col);
    }
    return g(s, { 'class': 'pcs-drift', style: 'animation-duration:40s' });
  }

  function bolt(S, x, top, len) {
    var r = rng(seedOf('bolt' + S.set + S.comp)), P = [[x, top]], cx = x, cy = top, seg = len / 9;
    for (var i = 1; i <= 9; i++) { cx += (r() - 0.45) * seg * 1.1; cy += seg * (0.8 + r() * 0.4); P.push([cx, cy]); }
    var d = pts(P), b = P[4], bx = b[0], by = b[1], br = [[bx, by]];
    for (i = 0; i < 4; i++) { bx += seg * (0.5 + r() * 0.4); by += seg * (0.6 + r() * 0.3); br.push([bx, by]); }
    d += pts(br);
    var inner = stroke(d, '#BFD8FF', len * 0.03, { opacity: 0.5, filter: S.blur('bolt', len * 0.012) }) +
      stroke(d, '#FFFFFF', Math.max(2, len * 0.006));
    return g(inner, { 'class': S.boltOn ? 'pcs-bolton' : 'pcs-bolt' });
  }

  function tower(S, t) {
    var p = S.pal, r = rng(seedOf('tw' + t.x + ':' + t.top + ':' + t.w)), far = t.far || 0;
    var x = t.x, w = t.w, top = t.top, base = t.base, slant = t.cap === 'slant' ? w * 0.35 : 0;
    var cTop = mix(p.glassTop, p.haze, far * 0.55), cBot = mix(p.glassBot, p.haze, far * 0.42);
    var fill = S.lin('tw' + Math.round(far * 5), [[0, cTop], [1, cBot]]);
    var d;
    if (t.cap === 'step') {
      var sw = w * 0.62, sx = x + (w - sw) / 2;
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + 70) + 'H' + n(sx) + 'V' + n(top) + 'H' + n(sx + sw) + 'V' + n(top + 70) + 'H' + n(x + w) + 'V' + n(base) + 'Z';
    } else if (t.cap === 'slant') {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + slant) + 'L' + n(x + w) + ' ' + n(top) + 'V' + n(base) + 'Z';
    } else if (t.cap === 'round') {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top + w * 0.3) + 'Q' + n(x) + ' ' + n(top) + ' ' + n(x + w / 2) + ' ' + n(top) +
        'Q' + n(x + w) + ' ' + n(top) + ' ' + n(x + w) + ' ' + n(top + w * 0.3) + 'V' + n(base) + 'Z';
    } else {
      d = 'M' + n(x) + ' ' + n(base) + 'V' + n(top) + 'H' + n(x + w) + 'V' + n(base) + 'Z';
    }
    function topAt(xx) {
      if (t.cap === 'slant') return top + slant * (1 - (xx - x) / w);
      if (t.cap === 'step') return (xx < x + (w - w * 0.62) / 2 || xx > x + w - (w - w * 0.62) / 2) ? top + 70 : top;
      if (t.cap === 'round') return top + w * 0.3;
      return top;
    }
    var s = path(d, fill) + path(d, S.grid(), { opacity: n(0.85 - far * 0.5) });
    var cw = 18, ch = 22, lit = '', litP = p.litP * (t.lit == null ? 1 : t.lit);
    for (var yy = Math.floor((base - ch) / ch) * ch; yy > top; yy -= ch) {
      for (var xx = Math.ceil(x / cw) * cw; xx + cw <= x + w; xx += cw) {
        if (r() < litP && yy > topAt(xx) + 2 && yy > topAt(xx + cw) + 2) {
          lit += 'M' + n(xx + 3) + ' ' + n(yy + 4) + 'h12v14h-12z';
        }
      }
    }
    s += path(lit, p.lit, { opacity: n((0.92 - far * 0.35) * (p.litOp || 1)) });
    if (p.refl) {
      var a = top + 90 + (base - top - 90) * (0.1 + r() * 0.35), th = 36 + r() * 90, k = 0.45;
      var y0 = Math.max(a, topAt(x + w) + 4);
      s += poly([[x, y0 + k * w], [x + w, y0], [x + w, y0 + th], [x, y0 + th + k * w]], p.refl, { opacity: n(0.42 - far * 0.18) });
      s += poly([[x, y0 + k * w + th + 18], [x + w, y0 + th + 18], [x + w, y0 + th + 26], [x, y0 + th + 26 + k * w]], p.refl, { opacity: n(0.3 - far * 0.12) });
    }
    s += rect(x + w - Math.max(3, w * 0.035), topAt(x + w), Math.max(3, w * 0.035), base - topAt(x + w), p.glassEdge, { opacity: n(0.55 - far * 0.25) });
    if (t.cap === 'spire') {
      s += rect(x + w / 2 - 2.5, top - 64, 5, 64, cBot) + circ(x + w / 2, top - 66, 4.5, '#FF5A4E', { 'class': 'pcs-blink' });
    }
    return s;
  }
  function towers(S, list) { var s = ''; for (var i = 0; i < list.length; i++) s += tower(S, list[i]); return s; }

  function plane(S, x, y, s, dir) {
    var p = S.pal, f = dir === 'right' ? -1 : 1, night = S.tod === 'night' || S.tod === 'storm';
    var body = night ? '#4A5470' : '#F4EFF5', belly = night ? '#323A52' : '#C9C2D6';
    var inner =
      path('M-6 1L9 14H16L7 1Z', night ? '#3A4260' : '#D9D2E2') +
      path('M-32 0C-32-4-27-5.5-22-5.5L22-5C28-5 31-3 32 0L31 2C24 5-22 5-26 4.5C-30 4-32 2-32 0Z', body) +
      path('M-26 2.5C-20 4.5 20 4.5 31 2L32 0C26 3-20 3.2-26 2.5Z', belly) +
      path('M19-4.5L27-18H32L30-3Z', night ? '#4A5470' : '#E9E3EE') +
      stroke('M-22-2.4H18', night ? '#FFD27F' : '#8E86A6', 1.5, { 'stroke-dasharray': '1.6 2.6' }) +
      (night ? '' : stroke('M-24-4.6C-14-6 14-6 22-5.6', p.rim, 1.6, { opacity: 0.85 })) +
      circ(-31, 1.5, 9, S.radB('landing', [[0, '#FFF6D0', 1], [0.4, '#FFF0B8', 0.5], [1, '#FFF0B8', 0]])) +
      circ(31, -17, 2, '#FF6B5E', { 'class': 'pcs-blink' });
    return g(g(inner, { transform: tr(x, y, s * f, s) + ' rotate(-7)' }), { 'class': 'pcs-drift' });
  }

  function hedge(S, x0, x1, top, base, o) {
    o = o || {};
    var p = S.pal, r = rng(o.seed || 21), k = Math.max(6, Math.round((x1 - x0) / (o.bump || 70)));
    var d = mound(x0, x1, base, top, k, r, 0.3, 0.08, o.box == null ? 0.85 : o.box);
    var s = path(d, p.rim, { transform: 'translate(' + n(o.rimX || 0) + ' ' + n(o.rimY == null ? -(o.rimW || 6) : o.rimY) + ')', opacity: 0.85 });
    s += path(d, o.color || p.leaf);
    var h = base - top, w = x1 - x0;
    s += path(mound(x0 + w * 0.05, x1 - w * 0.07, base - h * 0.04, top + h * 0.08, k, r, 0.3, 0.12, o.box == null ? 0.85 : o.box), o.color2 || p.leafMid, { opacity: 0.85 });
    var t1 = '', t2 = '', cnt = Math.min(420, Math.round(w * h / (o.texture || 700)));
    for (var i = 0; i < cnt; i++) {
      var lx = x0 + w * 0.04 + r() * w * 0.92, ly = top + h * 0.12 + r() * h * 0.86, ll = (o.leaf || 13) * (0.7 + r() * 0.6);
      var ld = leafD(lx, ly, ll, r() * Math.PI * 2, ll * 0.3);
      if (r() < 0.55) t1 += ld; else t2 += ld;
    }
    s += path(t1, p.leafLight, { opacity: 0.5 }) + path(t2, p.leaf, { opacity: 0.55 });
    if (o.gap) {
      var gx = o.gap.x, gw = o.gap.w, gh = o.gap.h;
      var gd = 'M' + n(gx - gw / 2) + ' ' + n(base + 2) + 'V' + n(base - gh * 0.5) + 'Q' + n(gx - gw / 2) + ' ' + n(base - gh) + ' ' + n(gx) + ' ' + n(base - gh) +
        'Q' + n(gx + gw / 2) + ' ' + n(base - gh) + ' ' + n(gx + gw / 2) + ' ' + n(base - gh * 0.5) + 'V' + n(base + 2) + 'Z';
      s += path(gd, '#12201A');
      s += ell(gx, base - gh * 0.25, gw * 0.42, gh * 0.4, S.radB('gapglow', [[0, '#F7CF7A', 0.85], [0.5, '#F2C46D', 0.35], [1, '#F2C46D', 0]]));
      // leaves hanging over the gap's edge
      var e = '';
      for (i = 0; i < 9; i++) {
        var a = Math.PI + Math.PI * (i + 0.5) / 9;
        e += leafD(gx + Math.cos(a) * gw * 0.5, base - gh * 0.45 + Math.sin(a) * gh * 0.55, (o.leaf || 13) * 1.4, Math.PI / 2 + (r() - 0.5), (o.leaf || 13) * 0.4);
      }
      s += path(e, p.leafMid);
    }
    return s;
  }

  function fence(S, x0, x1, top, base, o) {
    o = o || {};
    var p = S.pal, r = rng(o.seed || 5), bw = o.bw || 34, gap = Math.max(1.5, bw * 0.09), rh = o.rail || 14;
    var d = '', d2 = '', d3 = '';
    for (var x = x0; x < x1; x += bw + gap) {
      var bt = top + rh * 0.5 + r() * 2;
      d += 'M' + n(x) + ' ' + n(base) + 'V' + n(bt) + 'H' + n(x + bw) + 'V' + n(base) + 'Z';
      if (r() < 0.45) d2 += 'M' + n(x + bw * 0.62) + ' ' + n(base) + 'V' + n(bt) + 'H' + n(x + bw) + 'V' + n(base) + 'Z';
      if (r() < 0.25) d3 += dot(x + bw * (0.3 + r() * 0.4), bt + (base - bt) * (0.2 + r() * 0.6), bw * 0.06);
    }
    var s = path(d, p.wood) + path(d2, p.woodDark, { opacity: 0.28 }) + path(d3, p.woodDark, { opacity: 0.6 });
    s += rect(x0, top + (base - top) * 0.62, x1 - x0, rh * 0.7, p.woodDark, { opacity: 0.35 });
    s += rect(x0 - rh * 0.6, top, x1 - x0 + rh * 1.2, rh, p.woodLight);
    s += rect(x0 - rh * 0.6, top, x1 - x0 + rh * 1.2, rh * 0.32, p.rim, { opacity: 0.75 });
    s += rect(x0 - rh * 0.6, top + rh * 0.75, x1 - x0 + rh * 1.2, rh * 0.25, p.woodDark, { opacity: 0.5 });
    var post = o.post || 240;
    for (var px = x0 + post / 2; px < x1; px += post) {
      s += rect(px - rh * 0.65, top - rh * 0.4, rh * 1.3, base - top + rh * 0.4, p.woodDark) + rect(px - rh * 0.65, top - rh * 0.4, rh * 1.3, rh * 0.3, p.rim, { opacity: 0.6 });
    }
    s += rect(x0, base - rh * 0.6, x1 - x0, rh * 0.6, p.shade, { opacity: 0.22 });
    return s;
  }

  function lampPost(S, x, base, top, k) {
    var p = S.pal, s = '', post = '#2C3838', lt = top + 13 * k, lb = top + 82 * k, mid = (lt + lb) / 2, off = p.day;
    // by day the lamp is off: no glow, pale glass with a glint
    if (!off) s += circ(x, mid, 200 * k, S.radU([[0, '#FFF1C0', 0.8], [0.28, '#FFDC8E', 0.3], [1, '#FFD98A', 0]], x, mid, 200 * k), { 'class': 'pcs-lamp' });
    s += path('M' + n(x - 6 * k) + ' ' + n(lb + 6 * k) + 'L' + n(x - 8 * k) + ' ' + n(base - 16 * k) + 'L' + n(x - 20 * k) + ' ' + n(base) +
      'H' + n(x + 20 * k) + 'L' + n(x + 8 * k) + ' ' + n(base - 16 * k) + 'L' + n(x + 6 * k) + ' ' + n(lb + 6 * k) + 'Z', post);
    s += rect(x + 2.5 * k, lb + 10 * k, 3 * k, base - lb - 30 * k, p.rim, { opacity: 0.5 });
    s += rect(x - 11 * k, lb + 30 * k, 22 * k, 7 * k, post);
    s += rect(x - 19 * k, lb, 38 * k, 8 * k, post);
    s += path('M' + n(x - 19 * k) + ' ' + n(lb) + 'L' + n(x - 26 * k) + ' ' + n(lt) + 'H' + n(x + 26 * k) + 'L' + n(x + 19 * k) + ' ' + n(lb) + 'Z', off ? mix(p.glassTop, '#FFFFFF', 0.55) : '#FFEFB8');
    s += off ? ell(x, mid + 4 * k, 8 * k, 15 * k, '#F2F0E6', { opacity: 0.8 }) + poly([[x - 22 * k, lt + 8 * k], [x - 15 * k, lt + 4 * k], [x - 10 * k, lb - 4 * k], [x - 16 * k, lb - 2 * k]], '#FFFFFF', { opacity: 0.6 })
      : ell(x, mid + 4 * k, 11 * k, 20 * k, '#FFFCEA');
    s += stroke('M' + n(x - 19 * k) + ' ' + n(lb) + 'L' + n(x - 26 * k) + ' ' + n(lt) + 'M' + n(x + 19 * k) + ' ' + n(lb) + 'L' + n(x + 26 * k) + ' ' + n(lt) +
      'M' + n(x) + ' ' + n(lb) + 'V' + n(lt), post, 3 * k);
    s += path('M' + n(x - 34 * k) + ' ' + n(lt + 2 * k) + 'L' + n(x - 13 * k) + ' ' + n(top) + 'H' + n(x + 13 * k) + 'L' + n(x + 34 * k) + ' ' + n(lt + 2 * k) + 'Z', post);
    s += stroke('M' + n(x - 13 * k) + ' ' + n(top + 1) + 'H' + n(x + 13 * k), p.rim, 2.5 * k, { opacity: 0.8 });
    return s;
  }

  function tufts(S, x0, x1, y0, y1, count, seed, colA, colB, size) {
    var r = rng(seed), a = '', b = '';
    for (var i = 0; i < count; i++) {
      var tx = x0 + r() * (x1 - x0), ty = y0 + Math.pow(r(), 0.8) * (y1 - y0), sc = (size || 1) * lerp(0.45, 1.5, (ty - y0) / Math.max(1, y1 - y0));
      var d = '';
      for (var j = 0; j < 4; j++) d += bladeD(tx + (j - 1.5) * 4 * sc, ty, (12 + r() * 12) * sc, (j - 1.5) * 4 * sc + (r() - 0.5) * 6 * sc, 1.8 * sc);
      if (r() < 0.6) a += d; else b += d;
    }
    return path(a, colA, { opacity: 0.85 }) + path(b, colB, { opacity: 0.8 });
  }

  function flowers(S, x0, x1, y0, y1, count, seed, col) {
    var r = rng(seed), petals = '', mids = '';
    for (var i = 0; i < count; i++) {
      var fx = x0 + r() * (x1 - x0), fy = y0 + r() * (y1 - y0), sc = lerp(0.6, 1.6, (fy - y0) / Math.max(1, y1 - y0)), pr = 3.2 * sc;
      for (var j = 0; j < 5; j++) { var a = j * Math.PI * 2 / 5; petals += dot(fx + Math.cos(a) * pr, fy + Math.sin(a) * pr * 0.7, pr * 0.62); }
      mids += dot(fx, fy, pr * 0.5);
    }
    return path(petals, col || '#FFF8EC', { opacity: 0.92 }) + path(mids, '#F2C04D');
  }

  function frond(x, y, len, ang, bend, r, lw) {
    var P0 = [x, y], P1 = [x + Math.cos(ang) * len * 0.55, y + Math.sin(ang) * len * 0.55];
    var P2 = [P1[0] + Math.cos(ang + bend) * len * 0.5, P1[1] + Math.sin(ang + bend) * len * 0.5];
    var stem = 'M' + n(P0[0]) + ' ' + n(P0[1]) + 'Q' + n(P1[0]) + ' ' + n(P1[1]) + ' ' + n(P2[0]) + ' ' + n(P2[1]);
    var leaves = '', pairs = Math.max(6, Math.round(len / 25));
    for (var i = 1; i <= pairs; i++) {
      var t = 0.1 + 0.88 * i / pairs, q = bez2(P0, P1, P2, t);
      var tx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]), ty = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
      var tl = Math.sqrt(tx * tx + ty * ty) || 1; tx /= tl; ty /= tl;
      var l = len * (lw || 0.2) * Math.pow(1 - t * 0.85, 0.85) * (0.85 + r() * 0.3);
      for (var side = -1; side <= 1; side += 2) {
        var nx = -ty * side, ny = tx * side, dx = nx * 0.8 + tx * 0.55, dy = ny * 0.8 + ty * 0.55;
        leaves += leafD(q[0], q[1], l, Math.atan2(dy, dx), l * 0.22);
      }
    }
    return { stem: stem, leaves: leaves };
  }

  // Would a frond (as frond() draws it) reach into any of the boxes [x0, y0, x1, y1]?
  function frondHits(x, y, len, ang, bend, lw, boxes) {
    var P0 = [x, y], P1 = [x + Math.cos(ang) * len * 0.55, y + Math.sin(ang) * len * 0.55];
    var P2 = [P1[0] + Math.cos(ang + bend) * len * 0.5, P1[1] + Math.sin(ang + bend) * len * 0.5];
    for (var t = 0; t <= 1.0001; t += 0.05) {
      var q = bez2(P0, P1, P2, t), l = len * lw * 1.15 * Math.pow(1 - t * 0.85, 0.85) + 4;
      for (var k = 0; k < boxes.length; k++) {
        var b = boxes[k];
        if (q[0] > b[0] - l && q[0] < b[2] + l && q[1] > b[1] - l && q[1] < b[3] + l) return true;
      }
    }
    return false;
  }

  // o.avoid: boxes no frond may cross (a cast member's head and body); a frond that would is
  // shortened, or left out when too little of it is left.
  function fernClump(S, x, y, size, o) {
    o = o || {};
    var p = S.pal, seed = o.seed || seedOf('fern' + x + ':' + y), r = rng(seed), cnt = o.count || 7, st = '', lv = '';
    var spread = o.spread || 2.3, lean = o.lean || 0, avoid = o.avoid && o.avoid.length ? o.avoid : null;
    for (var i = 0; i < cnt; i++) {
      var a = -Math.PI / 2 + lean + (cnt === 1 ? 0 : (i / (cnt - 1) - 0.5) * spread) + (r() - 0.5) * 0.2;
      var bend = sgn(a + Math.PI / 2 + 1e-6) * (0.45 + r() * 0.5);
      var f;
      if (avoid) {
        var fx0 = x + (r() - 0.5) * size * 0.08, len = size * (0.68 + r() * 0.38), lw = o.lw || 0.2;
        while (len >= size * 0.3 && frondHits(fx0, y, len, a, bend, lw, avoid)) len *= 0.85;
        if (len < size * 0.3) continue;
        f = frond(fx0, y, len, a, bend, rng(seed * 31 + i * 977), lw);
      } else {
        f = frond(x + (r() - 0.5) * size * 0.08, y, size * (0.68 + r() * 0.38), a, bend, r, o.lw || 0.2);
      }
      st += f.stem; lv += f.leaves;
    }
    var col = o.color || p.leafMid, off = Math.max(1.5, size * 0.012);
    return path(lv, o.rim || p.rim, { transform: 'translate(' + n(-off * 0.4) + ' ' + n(-off) + ')', opacity: o.rimOp == null ? 0.9 : o.rimOp }) +
      path(lv, col) + stroke(st, mix(col, '#1A140E', 0.35), Math.max(1.2, size * 0.011));
  }

  function bramble(S, x0, x1, base, top, o) {
    o = o || {};
    var p = S.pal, r = rng(o.seed || 9), w = o.w || 10, H = base - top, cx = (x0 + x1) / 2, rx = (x1 - x0) / 2;
    var stems = '', thorns = '', leafUp = '', leafDown = '', berries = '', blossoms = '';
    function cane(A, B, C, D) {
      stems += 'M' + n(A[0]) + ' ' + n(A[1]) + 'C' + n(B[0]) + ' ' + n(B[1]) + ' ' + n(C[0]) + ' ' + n(C[1]) + ' ' + n(D[0]) + ' ' + n(D[1]);
      var L = Math.sqrt(Math.pow(D[0] - A[0], 2) + Math.pow(D[1] - A[1], 2)) + Math.abs(B[1] - A[1]);
      var step = Math.max(0.03, (w * 2.9) / L), side = 1;
      for (var t = 0.07; t < 0.98; t += step) {
        var q = bez3(A, B, C, D, t), q2 = bez3(A, B, C, D, Math.min(1, t + 0.01));
        var tx = q2[0] - q[0], ty = q2[1] - q[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
        tx /= tl; ty /= tl; side = -side;
        var nx = -ty * side, ny = tx * side;
        thorns += 'M' + n(q[0] + tx * w * 0.3) + ' ' + n(q[1] + ty * w * 0.3) + 'L' + n(q[0] + nx * w * 0.95 - tx * w * 0.35) + ' ' +
          n(q[1] + ny * w * 0.95 - ty * w * 0.35) + 'L' + n(q[0] - tx * w * 0.2) + ' ' + n(q[1] - ty * w * 0.2) + 'Z';
        if (r() < 0.85) {
          var la = Math.atan2(ny + ty * 0.7, nx + tx * 0.7), ll = w * (1.9 + r() * 1.3);
          var tri = leafD(q[0], q[1], ll, la, ll * 0.36) + leafD(q[0], q[1], ll * 0.78, la + 0.7, ll * 0.28) + leafD(q[0], q[1], ll * 0.78, la - 0.7, ll * 0.28);
          if (ny < 0.2) leafUp += tri; else leafDown += tri;
        }
        if (o.fruit !== false && r() < 0.07) for (var b = 0; b < 5; b++) berries += dot(q[0] + nx * w * 1.7 + (b % 3 - 1) * w * 0.44, q[1] + ny * w * 1.7 + Math.floor(b / 3) * w * 0.44, w * 0.31);
        if (o.fruit !== false && r() < 0.05) for (b = 0; b < 5; b++) { var ba = b * 1.2566; blossoms += dot(q[0] - nx * w * 1.5 + Math.cos(ba) * w * 0.44, q[1] - ny * w * 1.5 + Math.sin(ba) * w * 0.44, w * 0.34); }
      }
    }
    // canes spring from the mound, arch up and over, and droop at the tips
    var k = o.canes || Math.max(3, Math.round((x1 - x0) / 75));
    for (var i = 0; i < k; i++) {
      var u = ((i + 0.5) / k * 2 - 1) * 0.9 + (r() - 0.5) * 0.12;
      var sx = cx + u * rx, edge = base - H * Math.sqrt(Math.max(0, 1 - u * u));
      var sy = edge + H * (0.1 + r() * 0.25), dir = u < 0 ? -1 : 1;
      if (Math.abs(u) < 0.35 && r() < 0.5) dir = -dir;
      var len = (o.len || H * 0.7) * (0.7 + r() * 0.5), peak = len * (0.32 + r() * 0.22);
      cane([sx, sy], [sx + dir * len * 0.12, sy - peak * 1.35], [sx + dir * len * 0.8, sy - peak * 1.1], [sx + dir * len, sy + len * (0.1 + r() * 0.28)]);
    }
    // canes arching over each den opening
    (o.openings || []).forEach(function (op) {
      var ox = op[0], ow = op[1], oh = op[2];
      for (var j = 0; j < 2; j++) {
        var e = ow * (0.6 + j * 0.14), hh = oh * (1.28 + j * 0.14);
        cane([ox - e, base + 2], [ox - e * 0.95, base - hh], [ox + e * 0.95, base - hh], [ox + e, base + 2]);
      }
    });
    var stemCol = o.stem || mix(p.woodDark, p.leaf, 0.35), upCol = o.leafCol2 || p.leafMid;
    return stroke(stems, o.rim || p.rim, w * 0.8, { transform: 'translate(0 ' + n(-w * 0.35) + ')', opacity: 0.8 }) +
      stroke(stems, stemCol, w) + path(thorns, stemCol) +
      path(leafDown, o.leafCol || p.leaf) +
      path(leafUp, o.rim || p.rim, { opacity: 0.55, transform: 'translate(' + n(-w * 0.12) + ' ' + n(-w * 0.28) + ')' }) + path(leafUp, upCol) +
      path(berries, o.berry || '#4A2A4E') + path(blossoms, o.blossom || '#FFF6EA', { opacity: 0.92 });
  }

  function stonePath(S, P, o) {
    o = o || {};
    var p = S.pal, r = rng(o.seed || 3), s = '', moss = '', hi = '', y0 = o.y0 || 560, y1 = o.y1 || 1000;
    var total = 0, seg = [];
    for (var i = 1; i < P.length; i++) { var L = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(L); total += L; }
    var at = 0;
    while (at < total) {
      var acc = 0, j = 0;
      while (j < seg.length - 1 && acc + seg[j] < at) { acc += seg[j]; j++; }
      var t = (at - acc) / (seg[j] || 1), x = lerp(P[j][0], P[j + 1][0], t), y = lerp(P[j][1], P[j + 1][1], t);
      var dep = clamp((y - y0) / (y1 - y0), 0, 1), rx = (o.size || 30) * lerp(0.45, 1.25, dep) * (0.8 + r() * 0.4);
      var sx = x + (r() - 0.5) * rx * 1.2, sy = y + (r() - 0.5) * rx * 0.3;
      s += ell(sx, sy + rx * 0.1, rx, rx * 0.4, p.stoneDark) + ell(sx, sy, rx * 0.96, rx * 0.36, mix(p.stone, p.stoneLight, r() * 0.5));
      hi += 'M' + n(sx - rx * 0.6) + ' ' + n(sy - rx * 0.12) + 'Q' + n(sx) + ' ' + n(sy - rx * 0.38) + ' ' + n(sx + rx * 0.55) + ' ' + n(sy - rx * 0.16);
      if (r() < 0.55) moss += blob(sx + (r() - 0.5) * rx * 0.8, sy + rx * 0.05, rx * (0.3 + r() * 0.3), rx * 0.14, 7, r, 0.3, 0.3);
      at += rx * 1.75;
    }
    return s + stroke(hi, p.rim, 2, { opacity: 0.55 }) + path(moss, p.moss, { opacity: 0.9 });
  }

  function rose(x, y, rr, col, dark, light) {
    var pet = '';
    for (var i = 0; i < 5; i++) { var a = i * 1.2566 - 1.5708; pet += dot(x + Math.cos(a) * rr * 0.5, y + Math.sin(a) * rr * 0.46, rr * 0.56); }
    return path(pet, dark) + path(pet, col, { transform: 'translate(0 ' + n(-rr * 0.1) + ')' }) +
      circ(x, y - rr * 0.12, rr * 0.42, light, { opacity: 0.6 }) +
      stroke('M' + n(x - rr * 0.28) + ' ' + n(y - rr * 0.05) + 'Q' + n(x) + ' ' + n(y - rr * 0.42) + ' ' + n(x + rr * 0.26) + ' ' + n(y - rr * 0.12) +
        'M' + n(x - rr * 0.12) + ' ' + n(y + rr * 0.08) + 'Q' + n(x + rr * 0.1) + ' ' + n(y - rr * 0.12) + ' ' + n(x + rr * 0.16) + ' ' + n(y + rr * 0.1), dark, rr * 0.12);
  }

  function silhouettes(S, list, col) {
    var R = refH(), out = '';
    var sil = S.filter('sil', '<feFlood flood-color="' + col + '"/><feComposite in2="SourceAlpha" operator="in"/>', 'x="-5%" y="-5%" width="110%" height="110%"');
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      out += ell(c[0], c[1], c[2] * 0.42, c[2] * 0.05, S.pal.shade, { opacity: 0.25 });
      out += placeChar(S, c[5] || 'clancat', { pose: c[3], mood: 'neutral', variant: (i % 6) + 1 }, c[0], c[1], c[2] / R, c[4], { filter: sil }).svg;
    }
    return out;
  }

  function sparrowRow(S, x0, x1, y, count, depthH, seed) {
    count = Math.max(0, Math.min(40, Math.round(+count || 0)));
    var r = rng(seed || 77), out = '', R = refH();
    for (var i = 0; i < count; i++) {
      var x = count === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (count - 1) + (r() - 0.5) * (x1 - x0) / count * 0.25;
      out += placeChar(S, 'sparrow', { pose: 'perch', mood: 'neutral' }, x, y, depthH / R * (0.92 + r() * 0.16), r() < 0.6 ? 'right' : 'left').svg;
    }
    return out;
  }

  function moth(S, x, y, depthH, k) {
    var c = placeChar(S, 'moth', { pose: 'fly', mood: 'neutral' }, x, y, depthH / refH(), 'right');
    return g(g(c.svg, { 'class': 'pcs-flutter' }), { 'class': k || 'pcs-hover' });
  }

  // ------------------------------------------------------------------ ROOM

  var ROOMPAL = {
    warm: { wallTop: '#E6BFA0', wallBot: '#F2D5B5', paper: '#D9AE8A', floorTop: '#C38C61', floorBot: '#93603F', light: '#FFC98A', lightOp: 0.36, lamp: 0.5 },
    dusk: { wallTop: '#C49FA3', wallBot: '#DAB8A9', paper: '#B89092', floorTop: '#A97A5C', floorBot: '#7B523F', light: '#F4A88A', lightOp: 0.22, lamp: 0.62 },
    night: { wallTop: '#584A6A', wallBot: '#705C78', paper: '#4E4064', floorTop: '#6C4E48', floorBot: '#463230', light: '#9DB0E0', lightOp: 0.1, lamp: 0.85 }
  };
  var ROOM = { GX0: 584, GX1: 1416, GY0: 112, GY1: 800, MID: 1000, SLIDE: 700, SLIDE1: 1110 };

  function drawRoom(S) {
    var p = S.pal, o = S.opts, G = ROOM, back = '', over = '';
    var R = ROOMPAL[(S.tod === 'night' || S.tod === 'storm') ? 'night' : S.tod === 'dusk' ? 'dusk' : 'warm'];
    var open = o.door === 'open';
    var glassClip = S.clip('glass', rect(G.GX0, G.GY0, G.GX1 - G.GX0, G.GY1 - G.GY0, '#fff'));

    // --- the garden through the glass
    var v = sky(S, G.GX0, G.GY0, G.GX1 - G.GX0, 480, { sun: [930, 575], sunR: 340 });
    v += towers(S, [
      { x: 560, w: 110, top: 250, base: 575, far: 0.7 }, { x: 664, w: 88, top: 330, base: 575, far: 0.8, cap: 'slant' },
      { x: 760, w: 150, top: 168, base: 575, far: 0.45, cap: 'spire' }, { x: 926, w: 98, top: 300, base: 575, far: 0.75 },
      { x: 1036, w: 172, top: 196, base: 575, far: 0.5, cap: 'step' }, { x: 1226, w: 116, top: 282, base: 575, far: 0.7, cap: 'slant' },
      { x: 1342, w: 112, top: 150, base: 575, far: 0.5 }
    ]);
    v += plane(S, 860, 238, 0.9, 'left') + plane(S, 1286, 178, 0.62, 'left') + plane(S, 1150, 318, 1.15, 'left');
    v += path(mound(540, 1460, 600, 500, 18, rng(3), 0.3, 0.25, 0.25), mix(p.leaf, p.haze, 0.3));
    v += rect(G.GX0, 590, G.GX1 - G.GX0, G.GY1 - 590, S.lin('lawnv', [[0, p.grassFar], [1, p.grass]]));
    v += g(fence(S, 560, 1180, 522, 604, { bw: 17, rail: 8, post: 124, seed: 4 }) + sparrowRow(S, 610, 1140, 522, 12, 52, 5), { filter: S.shadow('s') });
    v += g(hedge(S, 1172, 1470, 418, 616, { gap: { x: 1330, w: 52, h: 66 }, bump: 40, seed: 8, leaf: 7, texture: 300, rimW: 4 }), { filter: S.shadow('s') });
    v += lampPost(S, 1120, 622, 408, 0.44);
    v += tufts(S, G.GX0, G.GX1, 610, 790, 60, 13, p.grassNear, p.grassLight, 0.6);
    v += flowers(S, G.GX0, G.GX1, 640, 780, 18, 14);
    if (o.clan) {
      v += silhouettes(S, [
        [700, 640, 40, 'walk', 'right'], [800, 616, 33, 'sit', 'left'], [880, 616, 36, 'sit', 'right'],
        [960, 668, 46, 'crouch', 'right'], [1046, 626, 34, 'lookup', 'left'], [1236, 638, 38, 'walk', 'left'], [1300, 676, 44, 'sit', 'left']
      ], '#3A2E50');
    }
    v += rect(G.GX0, 772, G.GX1 - G.GX0, 28, p.stone) + rect(G.GX0, 772, G.GX1 - G.GX0, 5, p.stoneLight, { opacity: 0.8 });
    back += g(v, { 'clip-path': glassClip });

    // --- the reflection ghosted in the glass (the look chooser draws here)
    if (o.reflection) back += reflection(S, open ? 860 : 1140, 800, 262);

    // --- glass sheen
    var sh = '', panes = open ? [[G.GX0, G.MID - 10], [G.SLIDE, G.SLIDE1]] : [[G.GX0, G.MID - 10], [G.MID + 10, G.GX1]];
    for (var i = 0; i < panes.length; i++) {
      var a = panes[i][0], b = panes[i][1], wdt = b - a;
      sh += poly([[a + wdt * 0.55, G.GY0], [a + wdt * 0.72, G.GY0], [a + wdt * 0.2, G.GY1], [a + wdt * 0.03, G.GY1]], '#FFFFFF', { opacity: 0.1 });
      sh += poly([[a + wdt * 0.78, G.GY0], [a + wdt * 0.82, G.GY0], [a + wdt * 0.33, G.GY1], [a + wdt * 0.29, G.GY1]], '#FFFFFF', { opacity: 0.16 });
      sh += rect(a, G.GY0, wdt, G.GY1 - G.GY0, '#CDEBF0', { opacity: 0.07 });
    }
    sh += g(path(pawPrint(952, 752, 7) + pawPrint(972, 726, 7), '#FFFFFF'), { opacity: 0.22 });
    back += g(sh, { 'clip-path': glassClip });

    // --- the wall, with a hole for the door
    var hole = 'M0 0H1600V800H0ZM560 90V806H1440V90Z';
    back += path(hole, S.lin('wall', [[0, R.wallTop], [1, R.wallBot]]), { 'fill-rule': 'evenodd' });
    back += path(hole, S.pattern('paper', 64, 64, path('M32 14C37 22 37 30 32 38C27 30 27 22 32 14Z', R.paper, { opacity: 0.55 }) +
      path(dot(0, 52, 2.4) + dot(64, 52, 2.4), R.paper)), { 'fill-rule': 'evenodd', opacity: 0.8 });
    back += circ(330, 300, 470, S.radU([[0, '#FFE2A2', R.lamp], [0.45, '#FFD58A', R.lamp * 0.35], [1, '#FFD58A', 0]], 330, 300, 470));
    back += rect(0, 780, 560, 20, '#F4E6D6') + rect(1440, 780, 160, 20, '#F4E6D6') + rect(0, 780, 560, 3, '#FFFFFF', { opacity: 0.6 }) + rect(1440, 780, 160, 3, '#FFFFFF', { opacity: 0.6 });
    back += rect(0, 0, 1600, 14, '#F4E6D6', { opacity: 0.7 });

    // --- floor
    back += rect(0, 800, 1600, 200, S.lin('floor', [[0, R.floorTop], [1, R.floorBot]]));
    var pl = '';
    for (var bx = -900; bx <= 2500; bx += 120) pl += 'M' + n(bx) + ' 1000L' + n(800 + (bx - 800) * 0.42) + ' 800';
    back += stroke(pl, '#5A3424', 2, { opacity: 0.28 });
    back += stroke('M0 860H1600M0 935H1600', '#5A3424', 1.5, { opacity: 0.12 });

    // --- door frame
    var fr = '#F1E8DC', frs = '#CDBDAB';
    back += rect(560, 90, 880, 22, fr) + rect(560, 90, 24, 716, fr) + rect(1416, 90, 24, 716, fr) + rect(548, 798, 904, 12, frs);
    back += rect(560, 106, 880, 6, frs, { opacity: 0.6 }) + rect(578, 112, 6, 688, frs, { opacity: 0.6 }) + rect(1416, 112, 6, 688, frs, { opacity: 0.6 });
    if (!open) {
      back += rect(988, 112, 24, 688, fr) + rect(1007, 112, 5, 688, frs, { opacity: 0.7 }) + rect(994, 420, 6, 70, '#B9A68E');
    } else {
      back += rect(990, 112, 16, 688, fr, { opacity: 0.9 });
      back += rect(G.SLIDE, 112, G.SLIDE1 - G.SLIDE, 688, '#CDEBF0', { opacity: 0.1 });
      back += rect(G.SLIDE - 4, 112, 20, 688, fr) + rect(G.SLIDE1 - 16, 112, 20, 688, fr) + rect(G.SLIDE1 - 12, 420, 6, 70, '#B9A68E');
      back += rect(G.SLIDE1 + 4, 112, 6, 688, S.pal.shade, { opacity: 0.12 });
    }

    // --- curtains and rod
    back += rect(470, 62, 1060, 9, '#B88A4A') + circ(470, 66, 9, '#C99A55') + circ(1530, 66, 9, '#C99A55');
    back += curtain(S, 490, 600, 1, open) + curtain(S, 1510, 1400, -1, open);

    // --- bookshelf, picture, lamp, plants
    back += g(bookshelf(S), { filter: S.shadow('m') });
    back += g(rect(70, 150, 150, 112, '#7A5236') + rect(80, 160, 130, 92, '#F7D9A6') + rect(80, 214, 130, 38, '#6F93B8') +
      circ(170, 196, 14, '#F59E5B') + stroke('M86 214Q120 196 150 214', '#3E6B4A', 6) + stroke('M80 230H210', '#BFD8EA', 2, { opacity: 0.8 }) +
      path('M100 214l8-14 8 14z', '#2F5240'), { filter: S.shadow('s') });
    back += g(floorLamp(S, 330, 880), { filter: S.shadow('m') });
    back += g(hangingPlant(S, 430), { filter: S.shadow('s') });
    back += g(snakePlant(S, 455, 806), { filter: S.shadow('m') });
    back += g(monstera(S, 1535, 806), { filter: S.shadow('m') });

    // --- rug, toy mouse, cushion
    back += ell(600, 928, 480, 72, '#B7586A') + ell(600, 926, 455, 62, '#F1D7C0') + ell(600, 925, 410, 52, '#5E9AA3') +
      ell(600, 924, 360, 42, '#F1D7C0') + ell(600, 923, 300, 32, '#E3A857') + ell(600, 922, 200, 18, '#F1D7C0');
    var fringe = '';
    for (var fx = 128; fx <= 1072; fx += 14) { var fy = 928 + 72 * Math.sqrt(Math.max(0, 1 - Math.pow((fx - 600) / 480, 2))); fringe += 'M' + n(fx) + ' ' + n(fy) + 'v8'; }
    back += stroke(fringe, '#F1D7C0', 3);
    back += toyMouse(S, 250, 962);
    var lightA = S.linU([[0, R.light, R.lightOp], [1, R.light, 0]], 0, 800, 0, 1000);
    back += g(poly([[600, 800], [988, 800], [1010, 1000], [500, 1000]], lightA) +
      poly([[1012, 800], [1400, 800], [1530, 1000], [1030, 1000]], lightA) +
      (open ? poly([[1110, 800], [1400, 800], [1530, 1000], [1180, 1000]], lightA, { opacity: 0.7 }) : ''), { style: 'mix-blend-mode:screen' });
    back += cushion(S, 640, 846);
    return { back: back, over: over, front: '' };
  }

  function pawPrint(x, y, r) {
    return dot(x, y, r) + dot(x - r * 1.1, y - r * 1.25, r * 0.42) + dot(x - r * 0.35, y - r * 1.7, r * 0.42) +
      dot(x + r * 0.45, y - r * 1.65, r * 0.42) + dot(x + r * 1.1, y - r * 1.1, r * 0.42);
  }

  function reflection(S, x, y, h) {
    var m = null, cast = S.cast || [];
    for (var i = 0; i < cast.length; i++) if (cast[i] && cast[i].who === 'player') { m = cast[i]; break; }
    var o = charOpts(S, 'player', m ? { pose: m.pose === 'peer' ? 'sit' : m.pose, mood: m.mood } : null);
    var c = placeChar(S, 'player', o, x, y, h / refH(), 'left');
    var inner = ell(x, y - h * 0.48, h * 0.78, h * 0.62, S.radB('reflback', [[0, '#1C2740', 0.45], [0.7, '#1C2740', 0.2], [1, '#1C2740', 0]])) +
      g(c.svg, { opacity: 0.86 }) +
      poly([[x - h * 0.1, y - h * 1.15], [x + h * 0.05, y - h * 1.15], [x - h * 0.35, y + 2], [x - h * 0.5, y + 2]], '#FFFFFF', { opacity: 0.1 });
    return g(inner, { 'clip-path': S.clip('glass', rect(ROOM.GX0, ROOM.GY0, ROOM.GX1 - ROOM.GX0, ROOM.GY1 - ROOM.GY0, '#fff')) });
  }

  function curtain(S, xOut, xIn, dir, open) {
    var top = 70, bot = 800, tie = 470, wTop = Math.abs(xIn - xOut);
    var xi = xOut + dir * wTop * 0.45, xb = xOut + dir * wTop * 0.85;
    var d = 'M' + n(xOut) + ' ' + top + 'H' + n(xIn) + 'Q' + n(xIn - dir * 6) + ' ' + n(tie - 160) + ' ' + n(xi + dir * 6) + ' ' + tie +
      'Q' + n(xb + dir * 4) + ' ' + n(tie + 160) + ' ' + n(xb) + ' ' + bot + 'H' + n(xOut - dir * 6) + 'Q' + n(xOut - dir * 14) + ' ' + n(tie + 100) +
      ' ' + n(xOut) + ' ' + n(tie) + 'Z';
    var folds = '';
    for (var i = 1; i < 4; i++) {
      var ft = xOut + dir * wTop * i * 0.24, fm = xOut + dir * (wTop * 0.45) * i * 0.24, fb = xOut + dir * (wTop * 0.85) * i * 0.24;
      folds += 'M' + n(ft) + ' ' + n(top + 6) + 'Q' + n(fm) + ' ' + n(tie - 100) + ' ' + n(fm) + ' ' + tie + 'Q' + n(fm) + ' ' + n(tie + 100) + ' ' + n(fb) + ' ' + n(bot - 4);
    }
    var flutter = open && dir < 0 ? { 'class': 'pcs-sway' } : null;
    return g(g(path(d, '#E3A657') + stroke(folds, '#B87C3A', 5, { opacity: 0.45 }) + stroke(folds, '#F6C98A', 2, { opacity: 0.5, transform: 'translate(' + (6 * dir) + ' 0)' }) +
      rect(Math.min(xi, xi + dir * 26) - 2, tie - 9, 30, 18, '#C9853F', { rx: 8 }), flutter), { filter: S.shadow('m') });
  }

  function bookshelf(S) {
    var r = rng(19), s = rect(26, 326, 216, 474, '#7E5038') + rect(38, 338, 192, 450, '#5E3A2A');
    var cols = ['#C0504D', '#4F81BD', '#9BBB59', '#F2C46D', '#8064A2', '#4BACC6', '#E57A6E', '#7C5C9E', '#3E6B4A', '#E8DCC4'];
    var shelves = [446, 556, 666, 786];
    for (var i = 0; i < shelves.length; i++) {
      var y = shelves[i];
      s += rect(30, y, 208, 10, '#8E5E42');
      var x = 44;
      while (x < 222) {
        if (i === 1 && x > 150) { s += yarn(190, y - 24); break; }
        if (i === 2 && x > 170) { s += rect(178, y - 46, 40, 46, '#D9C9B0') + rect(182, y - 42, 32, 38, '#9CC3D5') + circ(198, y - 24, 8, '#F2C46D'); break; }
        var bw = 10 + r() * 12, bh = 58 + r() * 36, c = cols[Math.floor(r() * cols.length)];
        if (r() < 0.12 && x < 200) { s += path('M' + n(x) + ' ' + y + 'L' + n(x + bh * 0.42) + ' ' + n(y - bh * 0.9) + 'L' + n(x + bh * 0.42 + bw) + ' ' + n(y - bh * 0.9 + 4) + 'L' + n(x + bw + 2) + ' ' + y + 'Z', c); x += bh * 0.42 + bw + 3; continue; }
        s += rect(x, y - bh, bw, bh, c) + rect(x, y - bh + 8, bw, 3, '#FFFFFF', { opacity: 0.35 });
        x += bw + 1.5;
      }
    }
    s += potPlant(S, 80, 326, 0.8);
    return s;
  }
  function yarn(x, y) {
    return circ(x, y, 20, '#E88AA0') + stroke('M' + (x - 16) + ' ' + (y - 8) + 'Q' + x + ' ' + (y - 2) + ' ' + (x + 14) + ' ' + (y - 12) + 'M' + (x - 18) + ' ' + (y + 4) +
      'Q' + x + ' ' + (y + 10) + ' ' + (x + 18) + ' ' + y + 'M' + (x - 8) + ' ' + (y + 17) + 'Q' + (x + 4) + ' ' + y + ' ' + (x - 2) + ' ' + (y - 18), '#C9667E', 2.5) +
      stroke('M' + (x + 14) + ' ' + (y + 14) + 'q20 12 6 24', '#E88AA0', 2.5);
  }
  function potPlant(S, x, y, k) {
    var p = S.pal, l = '';
    for (var i = 0; i < 7; i++) l += leafD(x, y - 26 * k, 34 * k, -Math.PI / 2 + (i - 3) * 0.42, 9 * k);
    return path(l, '#4E8A55') + path('M' + n(x - 20 * k) + ' ' + n(y - 30 * k) + 'H' + n(x + 20 * k) + 'L' + n(x + 15 * k) + ' ' + n(y) + 'H' + n(x - 15 * k) + 'Z', '#C46A4A') +
      rect(x - 21 * k, y - 32 * k, 42 * k, 7 * k, '#D9805E');
  }
  function floorLamp(S, x, y) {
    return ell(x, y, 54, 12, '#4A3A44') + rect(x - 4, 322, 8, y - 322, '#5A4652') +
      ell(x, 332, 64, 12, '#FFF3CC', { opacity: 0.9 }) +
      path('M' + (x - 80) + ' 332L' + (x - 56) + ' 222H' + (x + 56) + 'L' + (x + 80) + ' 332Z', '#F9DDA6') +
      path('M' + (x - 80) + ' 332L' + (x - 56) + ' 222H' + (x - 30) + 'L' + (x - 42) + ' 332Z', '#FFF0C8', { opacity: 0.7 }) +
      rect(x - 80, 326, 160, 8, '#E9B870') + rect(x - 56, 220, 112, 6, '#E9B870');
  }
  function hangingPlant(S, x) {
    var vines = '', lv = '', r = rng(23);
    var s = stroke('M' + x + ' 0L' + (x - 30) + ' 150M' + x + ' 0L' + (x + 30) + ' 150M' + x + ' 0V150', '#D9C2A0', 2.5);
    for (var i = 0; i < 4; i++) {
      var vx = x - 40 + i * 26, len = 90 + r() * 120;
      vines += 'M' + vx + ' 170Q' + n(vx + (r() - 0.5) * 50) + ' ' + n(170 + len * 0.5) + ' ' + n(vx + (r() - 0.5) * 30) + ' ' + n(170 + len);
      for (var t = 20; t < len; t += 22) lv += leafD(vx + (r() - 0.5) * 20, 170 + t, 18, Math.PI / 2 + (r() < 0.5 ? -1 : 1) * (0.9 + r() * 0.4), 8);
    }
    return s + stroke(vines, '#3E6B4A', 3) + path(lv, '#5E9A5A') + path('M' + (x - 42) + ' 146H' + (x + 42) + 'L' + (x + 32) + ' 190H' + (x - 32) + 'Z', '#E8D8C0') +
      rect(x - 42, 146, 84, 8, '#D6C2A6');
  }
  function snakePlant(S, x, y) {
    var r = rng(29), s = '';
    for (var i = 0; i < 6; i++) {
      var bx = x - 22 + i * 9, h = 130 + r() * 90, lean = (i - 2.5) * 10;
      s += path('M' + n(bx - 7) + ' ' + n(y - 60) + 'Q' + n(bx - 9 + lean * 0.4) + ' ' + n(y - 60 - h * 0.6) + ' ' + n(bx + lean) + ' ' + n(y - 60 - h) +
        'Q' + n(bx + 9 + lean * 0.4) + ' ' + n(y - 60 - h * 0.6) + ' ' + n(bx + 7) + ' ' + n(y - 60) + 'Z', i % 2 ? '#3E7A4E' : '#4F8A55', { stroke: '#D9D27A', 'stroke-width': 2 });
    }
    return s + path('M' + (x - 36) + ' ' + (y - 66) + 'H' + (x + 36) + 'L' + (x + 28) + ' ' + y + 'H' + (x - 28) + 'Z', '#C46A4A') + rect(x - 38, y - 70, 76, 10, '#D9805E');
  }
  function monstera(S, x, y) {
    var r = rng(31), s = '', stems = '';
    var L = [[-70, -250, 64], [10, -300, 70], [60, -200, 56], [-30, -170, 50], [-100, -150, 46]];
    for (var i = 0; i < L.length; i++) {
      var lx = x + L[i][0], ly = y - 70 + L[i][1] * 0.95, rr = L[i][2];
      stems += 'M' + x + ' ' + (y - 70) + 'Q' + n(x + L[i][0] * 0.2) + ' ' + n(ly + 80) + ' ' + n(lx) + ' ' + n(ly + rr * 0.5);
      s += path(blob(lx, ly, rr, rr * 0.82, 9, r, 0.12, 0.2), i % 2 ? '#3E7A4E' : '#2F6A44');
      s += stroke('M' + n(lx) + ' ' + n(ly + rr * 0.6) + 'L' + n(lx) + ' ' + n(ly - rr * 0.7), '#6FAA6A', 2.5);
      for (var j = -1; j <= 1; j += 2) s += stroke('M' + n(lx + j * rr * 0.35) + ' ' + n(ly - rr * 0.1) + 'L' + n(lx + j * rr * 0.95) + ' ' + n(ly - rr * 0.2), '#F1D7C0', 5, { opacity: 0.55 });
    }
    return stroke(stems, '#3E6B4A', 6) + s + path('M' + (x - 55) + ' ' + (y - 82) + 'H' + (x + 55) + 'L' + (x + 45) + ' ' + y + 'H' + (x - 45) + 'Z', '#ECE4D8') +
      rect(x - 50, y - 50, 100, 10, '#7C5C9E', { opacity: 0.6 });
  }
  function toyMouse(S, x, y) {
    return ell(x, y, 24, 13, '#9C9AA6') + circ(x + 18, y - 8, 7, '#B5B2BE') + circ(x + 18, y - 8, 3.5, '#F2A9B6') + circ(x + 25, y - 2, 2, '#2A2236') +
      stroke('M' + (x - 22) + ' ' + y + 'q-20 4-26 18q-6 10 8 14', '#C9667E', 2.5);
  }
  function cushion(S, x, y) {
    var seams = '';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; seams += 'M' + x + ' ' + y + 'Q' + n(x + Math.cos(a + 0.3) * 80) + ' ' + n(y + Math.sin(a + 0.3) * 18) + ' ' + n(x + Math.cos(a) * 150) + ' ' + n(y + Math.sin(a) * 31); }
    return ell(x, y + 36, 172, 26, S.pal.shade, { opacity: 0.25 }) +
      path('M' + (x - 160) + ' ' + y + 'V' + (y + 22) + 'A160 34 0 0 0 ' + (x + 160) + ' ' + (y + 22) + 'V' + y + 'Z', '#B35A6E') +
      ell(x, y + 22, 160, 34, 'none', { stroke: '#F4C6CC', 'stroke-width': 3, opacity: 0.6 }) +
      ell(x, y, 160, 34, '#D9788C') + stroke(seams, '#B35A6E', 2.5, { opacity: 0.55 }) + ell(x, y, 160, 34, 'none', { stroke: '#F4C6CC', 'stroke-width': 4 }) +
      ell(x - 40, y - 12, 80, 12, '#F2A9B6', { opacity: 0.55 }) + circ(x, y, 6, '#8E4458');
  }

  // ------------------------------------------------------------------ TOWER

  // 19 floors above the ground floor, foreshortened as we look up.
  var TOWER = (function () {
    var ys = [800], h = 50;
    for (var k = 0; k < 19; k++) { ys.push(ys[k] - h); h *= 0.935; }
    function edge(y) { var t = (1000 - y) / 960; return [lerp(230, 560, t), lerp(1370, 1040, t)]; }
    return { ys: ys, edge: edge };
  })();

  function drawTower(S) { return S.comp === 'balcony' ? drawBalcony(S) : drawTowerUp(S); }

  function drawTowerUp(S) {
    var p = S.pal, back = '', over = '', front = '', T = TOWER, r = rng(61);
    back += sky(S, 0, 0, 1600, 1000, { sun: [180, 760], sunR: 560 });
    back += plane(S, 1330, 150, 1.25, 'left') + plane(S, 300, 260, 0.8, 'left');
    // neighbouring towers, leaning in
    back += g(path('M-80 1000L60 120H330L360 1000Z', S.lin('nbL', [[0, mix(p.glassTop, p.haze, 0.35)], [1, mix(p.glassBot, p.haze, 0.25)]])) +
      path('M-80 1000L60 120H330L360 1000Z', S.grid(), { opacity: 0.5 }) +
      path('M1250 1000L1290 300H1560L1700 1000Z', S.lin('nbR', [[0, mix(p.glassTop, p.haze, 0.45)], [1, mix(p.glassBot, p.haze, 0.3)]])) +
      path('M1250 1000L1290 300H1560L1700 1000Z', S.grid(), { opacity: 0.5 }) +
      poly([[60, 300], [330, 210], [334, 330], [56, 420]], p.refl, { opacity: 0.35 }) +
      poly([[1290, 470], [1560, 400], [1590, 470], [1280, 560]], p.refl, { opacity: 0.3 }), { filter: S.shadow('m') });
    // the tower
    var topY = 40, e0 = T.edge(1000), et = T.edge(topY);
    var shape = 'M' + n(e0[0]) + ' 1000L' + n(et[0]) + ' ' + topY + 'H' + n(et[1]) + 'L' + n(e0[1]) + ' 1000Z';
    var tw = path(shape, S.lin('mainT', [[0, p.glassTop], [0.6, mix(p.glassTop, p.glassBot, 0.5)], [1, p.glassBot]]));
    // floors, mullions, lit windows
    var floors = '', mull = '', lit = '';
    for (var k = 0; k <= 19; k++) { var e = T.edge(T.ys[k]); floors += 'M' + n(e[0]) + ' ' + n(T.ys[k]) + 'H' + n(e[1]); }
    var eTopLine = T.edge(T.ys[19]);
    floors += 'M' + n(eTopLine[0]) + ' ' + n(T.ys[19]) + 'L' + n(et[0]) + ' ' + topY;
    for (var j = 1; j < 10; j++) {
      var u = j / 10, xb = lerp(T.edge(800)[0], T.edge(800)[1], u), xt = lerp(et[0], et[1], u);
      mull += 'M' + n(xb) + ' 800L' + n(xt) + ' ' + topY;
    }
    for (k = 0; k < 19; k++) {
      var yA = T.ys[k], yB = T.ys[k + 1], eA = T.edge(yA), eB = T.edge(yB);
      for (j = 0; j < 10; j++) {
        if (r() < (p.day ? p.litP * 2 : 0.3)) {
          var u0 = j / 10 + 0.012, u1 = (j + 1) / 10 - 0.012, ih = (yA - yB) * 0.14;
          lit += pts([[lerp(eA[0], eA[1], u0), yA - ih], [lerp(eA[0], eA[1], u1), yA - ih], [lerp(eB[0], eB[1], u1), yB + ih], [lerp(eB[0], eB[1], u0), yB + ih]]) + 'Z';
        }
      }
    }
    tw += path(lit, p.lit, { opacity: 0.85 * (p.litOp || 1) });
    tw += stroke(mull, p.mullion, 2.2, { opacity: 0.45 }) + stroke(floors, p.mullion, 3, { opacity: 0.55 });
    tw += stroke(floors, p.glassEdge, 1.2, { opacity: 0.35, transform: 'translate(0 -3)' });
    // the sunset sliding across the glass
    var towerClip = S.clip('tower', path(shape, '#fff'));
    tw += g(poly([[0, 760], [1600, 260], [1600, 420], [0, 920]], p.refl, { opacity: 0.32 }) + poly([[0, 560], [1600, 60], [1600, 120], [0, 620]], p.refl, { opacity: 0.22 }), { 'clip-path': towerClip });
    tw += path('M' + n(e0[1] - 14) + ' 1000L' + n(et[1] - 8) + ' ' + topY + 'H' + n(et[1]) + 'L' + n(e0[1]) + ' 1000Z', p.glassEdge, { opacity: 0.45 });
    tw += rect(et[0] - 10, topY - 14, et[1] - et[0] + 20, 16, p.glassBot) + rect(et[0] - 10, topY - 14, et[1] - et[0] + 20, 4, p.rim, { opacity: 0.7 });
    tw += rect((et[0] + et[1]) / 2 - 3, topY - 80, 6, 66, p.glassBot) + circ((et[0] + et[1]) / 2, topY - 82, 5, '#FF5A4E', { 'class': 'pcs-blink' });
    back += g(tw, { filter: S.shadow('l') });
    // balconies
    var bal = '';
    var list = [[3, 1], [6, -1], [8, 1], [11, -1], [13, 1], [16, -1]];
    for (k = 0; k < list.length; k++) bal += balconySmall(S, list[k][0], list[k][1], false);
    back += g(bal, { filter: S.shadow('s') });
    // Waffles's balcony, nineteen floors up
    back += balconySmall(S, 19, 1, true, 'back');
    over += balconySmall(S, 19, 1, true, 'front');
    // the ground floor: our home, warm behind the glass
    var gl = 520, gr = 1080, gtop = 812;
    back += path('M230 800H1370V1000H230Z', S.lin('gfloor', [[0, mix(p.stone, p.rim, 0.25)], [1, p.stoneDark]]));
    over += rect(230, 796, 1140, 18, mix(p.stone, p.glassBot, 0.2)) + rect(230, 796, 1140, 5, p.rim, { opacity: 0.7 }) + rect(gl - 14, 812, 14, 190, '#EDE4D8') + rect(gr, 812, 14, 190, '#EDE4D8');
    back += rect(gl, gtop, gr - gl, 190, S.lin('homeIn', [[0, '#F6D2A4'], [1, '#E7A877']]));
    back += circ(gl + 90, gtop + 40, 220, S.radU([[0, '#FFF1C8', 0.8], [1, '#FFE0A0', 0]], gl + 90, gtop + 40, 220));
    back += path('M' + (gl + 50) + ' ' + (gtop + 70) + 'L' + (gl + 66) + ' ' + (gtop + 22) + 'H' + (gl + 114) + 'L' + (gl + 130) + ' ' + (gtop + 70) + 'Z', '#F9DDA6');
    back += ell(gl + 330, gtop + 158, 110, 22, '#D9788C') + rect(gr - 120, gtop, 120, 170, '#E3A657', { opacity: 0.9 }) + rect(gl, gtop, 70, 170, '#E3A657', { opacity: 0.9 });
    over += rect(gl, gtop, gr - gl, 190, '#CDEBF0', { opacity: 0.1 });
    over += poly([[gl + 330, gtop], [gl + 390, gtop], [gl + 230, gtop + 190], [gl + 170, gtop + 190]], '#FFFFFF', { opacity: 0.14 });
    over += poly([[gl + 410, gtop], [gl + 426, gtop], [gl + 266, gtop + 190], [gl + 250, gtop + 190]], '#FFFFFF', { opacity: 0.18 });
    over += rect(gl + 392, gtop, 16, 190, '#EDE4D8') + rect(gl - 14, 992, gr - gl + 28, 10, '#D9CCBA');
    // foreground shrubs
    front += g(path(mound(-60, 300, 1010, 900, 7, rng(62), 0.35, 0.2, 0.3), p.leaf) + path(mound(1300, 1660, 1010, 880, 7, rng(63), 0.35, 0.2, 0.3), p.leaf) +
      path(mound(-30, 240, 1010, 930, 6, rng(64), 0.35, 0.2, 0.3), p.leafMid) + path(mound(1340, 1630, 1010, 920, 6, rng(65), 0.35, 0.2, 0.3), p.leafMid) +
      flowers(S, 0, 260, 940, 990, 8, 66, '#F6C7D2') + flowers(S, 1350, 1600, 930, 990, 8, 67, '#FFF6EA'), { filter: S.shadow('m') });
    return { back: back, over: over, front: front };
  }

  // part: undefined = all, 'back' = slab, door and shade; 'front' = railing (drawn over the cat).
  function balconySmall(S, k, side, special, part) {
    var p = S.pal, y = TOWER.ys[k], e = TOWER.edge(y), fh = TOWER.ys[k - 1] - TOWER.ys[k];
    var big = special ? 2.7 : 1, w = 96 * big * (0.8 + 0.2 * (1 - k / 19)), d = 20 * big, rh = fh * 0.55 * big;
    var x0 = side > 0 ? e[1] - w * 0.7 : e[0] - w * 0.3, x1 = x0 + w;
    var slabY = y + fh * 0.98;
    var s = '';
    if (special) S.balconySpot = { x: x0 + w * 0.42, y: slabY };
    if (part !== 'front') {
      if (special) {
        s += rect(x0 + 10, slabY - fh * 1.9, w * 0.55, fh * 1.9, '#FBE3B0') + circ(x0 + 10 + w * 0.27, slabY - fh, fh * 1.6, S.radB('wglow', [[0, '#FFF0C6', 0.9], [1, '#FFE0A0', 0]])) +
          rect(x0 + 10, slabY - fh * 1.9, w * 0.14, fh * 1.9, '#F2A9B6');
      }
      s += rect(x0, slabY, w, d * 0.5, mix(p.stone, p.glassBot, 0.3)) + rect(x0, slabY + d * 0.5, w, d * 0.35, p.shade, { opacity: 0.3 });
    }
    if (part !== 'back') {
      s += rect(x0 + 2, slabY - rh, w - 4, rh, '#CFE6EA', { opacity: special ? 0.22 : 0.4 }) +
        rect(x0, slabY - rh - 3, w, 4, special ? '#F4F0EA' : '#DAD3CB') + stroke('M' + n(x0 + 2) + ' ' + n(slabY) + 'V' + n(slabY - rh) + 'M' + n(x1 - 2) + ' ' + n(slabY) + 'V' + n(slabY - rh), '#DAD3CB', 2);
      if (special) {
        // the wind chime (chime: true), tiny from down here, beside the geranium
        if (S.opts.chime) {
          var cs = chimeStand(S, x1 - 22, slabY - rh + 4, slabY - rh - 44, 14, 0.22);
          s += cs.svg + windChime(S, cs.tip[0], cs.tip[1], 0.22);
        }
        s += circ(x1 - 10, slabY - rh - 6, 6, '#F28CA6') + circ(x1 - 18, slabY - rh - 9, 5, '#F7B7C6') + rect(x1 - 20, slabY - rh - 2, 16, 8, '#C46A4A');
        var lights = '';
        for (var i = 0; i < 6; i++) lights += dot(x0 + 6 + i * (w - 12) / 5, slabY - rh - 1 + (i % 2) * 2, 1.8);
        s += path(lights, '#FFE9A0');
      }
    }
    return s;
  }

  // A wind chime (tower, chime: true), hanging from the top of its string at (x, y), k its size (1 on
  // the balcony camera): a little wooden disc, five silver tubes on threads, the longest in the
  // middle, a clapper and a pink heart of a wind sail. It sways gently from the top.
  function windChime(S, x, y, k) {
    var p = S.pal, s = '', tubes = '', caps = '', shine = '', threads = '';
    var disc = y + 30 * k, lens = [62, 78, 94, 78, 62];
    threads += 'M' + n(x) + ' ' + n(y) + 'V' + n(disc);
    for (var i = 0; i < 5; i++) {
      var tx = x + (i - 2) * 11 * k, ty = disc + (10 + Math.abs(i - 2) * 2) * k, L = lens[i] * k;
      threads += 'M' + n(x + (i - 2) * 9 * k) + ' ' + n(disc) + 'L' + n(tx) + ' ' + n(ty);
      tubes += 'M' + n(tx - 3 * k) + ' ' + n(ty) + 'h' + n(6 * k) + 'v' + n(L) + 'h' + n(-6 * k) + 'z';
      caps += 'M' + n(tx - 3.6 * k) + ' ' + n(ty) + 'h' + n(7.2 * k) + 'v' + n(2.2 * k) + 'h' + n(-7.2 * k) + 'z';
      shine += 'M' + n(tx + 1.2 * k) + ' ' + n(ty + 4 * k) + 'v' + n(L - 8 * k);
    }
    var clap = disc + 64 * k, sail = disc + 124 * k;
    threads += 'M' + n(x) + ' ' + n(disc) + 'V' + n(sail - 8 * k);
    s += stroke(threads, '#6B5A52', Math.max(0.6, 1.3 * k), { opacity: 0.9 });
    s += ell(x, disc, 24 * k, 6.5 * k, '#9C6B48') + ell(x, disc - 1.5 * k, 24 * k, 4.5 * k, '#C8925E');
    s += path(tubes, S.lin('chimetube', [[0, '#7E8C9C'], [0.45, '#E8EEF4'], [1, '#93A1B0']], 0, 0, 1, 0), { stroke: '#4E5866', 'stroke-width': n(Math.max(0.4, 1.1 * k)) }) + path(caps, '#4E5866');
    s += stroke(shine, p.rim, Math.max(0.5, 1.4 * k), { opacity: 0.75 });
    s += ell(x, clap, 7 * k, 2.6 * k, '#9C6B48');
    // the sail: a little pink heart, Waffles's colour
    s += path('M' + n(x) + ' ' + n(sail + 18 * k) + 'C' + n(x - 22 * k) + ' ' + n(sail + 4 * k) + ' ' + n(x - 14 * k) + ' ' + n(sail - 12 * k) + ' ' + n(x) + ' ' + n(sail - 4 * k) +
      'C' + n(x + 14 * k) + ' ' + n(sail - 12 * k) + ' ' + n(x + 22 * k) + ' ' + n(sail + 4 * k) + ' ' + n(x) + ' ' + n(sail + 18 * k) + 'Z', '#F28CA6');
    return g(s, { 'class': 'pcs-chime' });
  }
  // The chime's stand on the balcony: a shepherd's crook planted beside the geranium's pot, curling
  // over at the top; returns the crook's tip, where the chime hangs.
  function chimeStand(S, x0, base, top, reach, k) {
    var tip = [x0 - reach, top + 26 * k];
    var d = 'M' + n(x0) + ' ' + n(base) + 'V' + n(top + 30 * k) + 'C' + n(x0) + ' ' + n(top - 6 * k) + ' ' + n(x0 - reach) + ' ' + n(top - 10 * k) + ' ' + n(tip[0]) + ' ' + n(tip[1] - 10 * k);
    return { svg: stroke(d, '#3E3A40', 6 * k) + stroke(d, '#8E8A90', 2 * k, { opacity: 0.6, transform: 'translate(' + n(-1.5 * k) + ' ' + n(-k) + ')' }), tip: tip };
  }

  function drawBalcony(S) {
    var p = S.pal, back = '', over = '', r = rng(71);
    back += sky(S, 0, 0, 1600, 1000, { sun: [1250, 760], sunR: 620 });
    back += plane(S, 1040, 230, 2.6, 'left') + plane(S, 1420, 120, 1.5, 'left') + plane(S, 640, 330, 1.1, 'left');
    // the river far below, glinting
    back += rect(380, 780, 1220, 220, S.lin('rvb', [[0, mix(p.water, p.sky[4], 0.4)], [1, p.water]]));
    var gl = '';
    for (var i = 0; i < 26; i++) gl += 'M' + n(420 + r() * 1160) + ' ' + n(790 + r() * 200) + 'h' + n(20 + r() * 60);
    back += stroke(gl, p.sky[5] || p.sun || '#FFD08C', 3, { opacity: 0.55, 'class': 'pcs-glint' });
    // the city across the way
    back += towers(S, [
      { x: 420, w: 150, top: 560, base: 1000, far: 0.65 }, { x: 600, w: 110, top: 640, base: 1000, far: 0.75, cap: 'slant' },
      { x: 860, w: 170, top: 520, base: 1000, far: 0.6, cap: 'spire' }, { x: 1080, w: 120, top: 610, base: 1000, far: 0.7 },
      { x: 1250, w: 190, top: 470, base: 1000, far: 0.55, cap: 'step' }, { x: 1480, w: 140, top: 580, base: 1000, far: 0.7 }
    ]);
    // Waffles's building: glass wall and her lit sliding door
    var wall = rect(-20, -20, 460, 1040, S.lin('bwall', [[0, p.glassTop], [1, p.glassBot]])) + rect(-20, -20, 460, 1040, S.grid(), { opacity: 0.6 });
    wall += rect(60, 250, 300, 650, '#EFE6DA') + rect(74, 264, 272, 636, S.lin('wroom', [[0, '#FCE3B2'], [1, '#F2B98A']]));
    wall += circ(210, 430, 260, S.radU([[0, '#FFF4D0', p.day ? 0.45 : 0.9], [1, '#FFE6A8', 0]], 210, 430, 260));
    wall += path('M74 264H170Q150 560 196 900H74Z', '#F2A9B6') + stroke('M100 270Q92 560 120 896M140 270Q130 560 160 896', '#E07E98', 4, { opacity: 0.6 });
    wall += ell(270, 880, 70, 18, '#F7C6D0') + ell(270, 872, 60, 12, '#FBD9E0');
    wall += rect(440, -20, 14, 1040, p.glassEdge, { opacity: 0.6 }) + poly([[74, 520], [346, 380], [346, 440], [74, 580]], '#FFFFFF', { opacity: 0.18 });
    back += g(wall, { filter: S.shadow('l') });
    // balcony floor
    back += path('M0 900H1600V1000H0Z', mix(p.stone, p.glassBot, 0.2)) + rect(0, 900, 1600, 10, p.stoneLight, { opacity: 0.8 });
    // the wind chime (chime: true), on a crook planted in the geranium's pot, hanging beside it
    if (S.opts.chime) {
      var cs = chimeStand(S, 1316, 800, 372, 96, 1.5);
      back += g(cs.svg + windChime(S, cs.tip[0], cs.tip[1], 1.5), { filter: S.shadow('s') });
    }
    // pots of pink flowers
    var fl = '';
    for (i = 0; i < 14; i++) fl += dot(1380 + (r() - 0.5) * 150, 690 + (r() - 0.5) * 90, 14 + r() * 8);
    back += g(path(fl, '#F28CA6') + path(fl, '#F7B7C6', { transform: 'translate(-4 -5) scale(1)', opacity: 0.6 }) +
      stroke('M1380 820L1360 720M1380 820L1400 700M1380 820L1340 760M1380 820L1420 750', '#3E6B4A', 6) +
      path('M1300 800H1460L1440 905H1320Z', '#C46A4A') + rect(1292, 790, 176, 22, '#D9805E'), { filter: S.shadow('m') });
    // railing: frosted glass panels with a rail of fairy lights (drawn over the cat)
    var rl = '';
    for (var x = 440; x < 1600; x += 290) rl += rect(x + 6, 742, 278, 160, '#D6ECEF', { opacity: 0.16 }) + poly([[x + 150, 742], [x + 186, 742], [x + 126, 902], [x + 90, 902]], '#FFFFFF', { opacity: 0.2 }) +
      poly([[x + 200, 742], [x + 210, 742], [x + 150, 902], [x + 140, 902]], '#FFFFFF', { opacity: 0.28 });
    over += rl + rect(430, 720, 1190, 26, '#F4F0EA') + rect(430, 720, 1190, 7, '#FFFFFF', { opacity: 0.8 }) + rect(430, 742, 1190, 6, '#BDB4AA');
    for (x = 440; x <= 1600; x += 290) over += rect(x - 6, 720, 14, 190, '#E6E0D8');
    var bulbs = '';
    for (i = 0; i < 22; i++) bulbs += dot(450 + i * 54, 752 + (i % 2) * 10, 7);
    if (p.day) {
      // switched off in the daytime: clear little bulbs with a glint
      var glints = '';
      for (i = 0; i < 22; i++) glints += dot(447 + i * 54, 749 + (i % 2) * 10, 2.4);
      over += path(bulbs, '#DCE6EA', { opacity: 0.85 }) + path(glints, '#FFFFFF', { opacity: 0.9 });
    } else {
      over += path(bulbs, '#FFE9A0', { 'class': 'pcs-twk', style: 'animation-duration:2.6s' });
      over += path(bulbs, '#FFF6D0', { opacity: 0.5, transform: 'translate(-2 -2)' });
    }
    return { back: back, over: g(over, { filter: S.shadow('m') }), front: '' };
  }

  // ------------------------------------------------------------------ GARDEN

  function drawGarden(S) {
    var p = S.pal, o = S.opts, back = '', front = '', r = rng(81);
    back += sky(S, 0, 0, 1600, 680, { sun: [980, 610], sunR: 480 });
    back += towers(S, [
      { x: 10, w: 150, top: 220, base: 600, far: 0.7 }, { x: 380, w: 120, top: 300, base: 600, far: 0.75, cap: 'slant' },
      { x: 700, w: 170, top: 240, base: 600, far: 0.65, cap: 'step' }, { x: 1010, w: 120, top: 330, base: 600, far: 0.75 },
      { x: 1420, w: 150, top: 260, base: 600, far: 0.7, cap: 'round' }
    ]);
    back += towers(S, [
      { x: 150, w: 210, top: 70, base: 600, far: 0.3, cap: 'spire' }, { x: 520, w: 170, top: 140, base: 600, far: 0.35 },
      { x: 880, w: 130, top: 190, base: 600, far: 0.4, cap: 'slant' }, { x: 1150, w: 230, top: 40, base: 600, far: 0.25, cap: 'step' }
    ]);
    back += plane(S, 540, 165, 1.5, 'left') + plane(S, 1290, 110, 0.95, 'left');
    back += g(path(mound(-80, 1680, 610, 455, 22, rng(82), 0.32, 0.3, 0.25), mix(p.leaf, p.haze, 0.25)), { filter: S.shadow('s') });
    // lawn
    back += rect(0, 630, 1600, 370, S.lin('lawn', [[0, p.grassFar], [0.3, p.grass], [1, p.grassNear]]));
    var stripes = '';
    for (var i = -6; i < 14; i += 2) stripes += poly([[i * 140, 1000], [(i + 1) * 140, 1000], [800 + ((i + 1) * 140 - 800) * 0.35, 640], [800 + (i * 140 - 800) * 0.35, 640]], '#FFFFFF', { opacity: 0.035 });
    back += stripes;
    back += ell(980, 700, 520, 60, p.rim, { opacity: 0.12 });
    // fence and its sparrows
    back += g(fence(S, -20, 1150, 520, 668, { seed: 2 }), { filter: S.shadow('m') });
    var sp = o.sparrows == null ? 12 : o.sparrows;
    back += sparrowRow(S, 330, 1050, 520, sp, 168, 83);
    // hedge with the gap
    back += g(hedge(S, 1150, 1680, 300, 716, { gap: { x: 1390, w: 132, h: 168 }, seed: 12, leaf: 15 }), { filter: S.shadow('m') });
    // lamp post (and the thirteenth sparrow)
    back += g(lampPost(S, 1105, 704, 280, 1), { filter: S.shadow('s') });
    var mothsAtLamp = '';
    for (i = 0; i < (p.day ? 0 : 3); i++) {
      var mx0 = 1105 + (i - 1) * 40, my0 = 296 + (i % 2) * 44;
      mothsAtLamp += g(ell(mx0 - 4, my0 - 2, 4.5, 2.6, '#F2E6CC') + ell(mx0 + 4, my0 - 2, 4.5, 2.6, '#F2E6CC') + ell(mx0, my0, 1.6, 3.4, '#B59A78'),
        { 'class': 'pcs-hover', style: 'animation-duration:' + (1.6 + i * 0.5) + 's' });
    }
    back += mothsAtLamp;
    if (o.lampSparrow) back += placeChar(S, 'sparrow', { pose: 'fluffed', mood: 'neutral' }, 1105, 281, 150 / refH() * 1.05, 'left').svg;
    // lawn texture
    back += tufts(S, 0, 1600, 680, 1000, 170, 84, p.grassNear, p.grassLight, 1.1);
    back += flowers(S, 520, 1600, 700, 990, 26, 85);
    back += path(clover(1260, 930, 9) + clover(1300, 950, 8) + clover(860, 960, 9), p.grassLight, { opacity: 0.9 });
    // the house: our door, open, and the patio step
    back += g(gardenHouse(S), { filter: S.shadow('l') });
    if (o.towel) back += towel(S, 205, 822);
    if (o.dish) back += dish(S, 430, 836);
    if (o.moth) back += moth(S, 560, 620, 240);
    // grass in front of paws on the lawn (the paws close-up)
    S.covers.lawn = lawnCover(S, 660, 844, 245);
    // foreground grass framing the bottom corners
    front += g(tufts(S, 0, 260, 975, 1010, 18, 86, p.grassNear, p.grassLight, 2.6) + tufts(S, 1340, 1600, 975, 1010, 18, 87, p.grassNear, p.grassLight, 2.6) +
      flowers(S, 1400, 1580, 960, 995, 6, 88, '#F7D6E0'), { filter: S.shadow('s') });
    return { back: back, over: '', front: front };
  }

  function clover(x, y, r) { return dot(x - r * 0.6, y, r * 0.65) + dot(x + r * 0.6, y, r * 0.65) + dot(x, y - r * 0.8, r * 0.65); }

  function gardenHouse(S) {
    var p = S.pal, s = '';
    s += rect(-20, -20, 282, 800, S.lin('hwall', [[0, p.glassTop], [1, p.glassBot]])) + rect(-20, -20, 282, 800, S.grid(), { opacity: 0.6 });
    var lit = '', r = rng(91);
    for (var y = 20; y < 290; y += 22) for (var x = 0; x < 250; x += 18) if (r() < p.litP) lit += 'M' + (x + 3) + ' ' + (y + 4) + 'h12v14h-12z';
    s += path(lit, p.lit, { opacity: 0.8 * (p.litOp || 1) }) + rect(-20, 296, 282, 14, mix(p.stone, p.glassBot, 0.2)) + rect(250, -20, 12, 800, p.glassEdge, { opacity: 0.5 });
    s += poly([[-20, 120], [262, 40], [262, 90], [-20, 170]], p.refl, { opacity: 0.35 });
    // the open patio door with the warm room inside
    s += rect(34, 320, 214, 458, '#EFE6DA');
    s += rect(46, 332, 190, 446, S.lin('inside', [[0, '#F6D3A4'], [1, '#E3A877']]));
    s += circ(120, 420, 160, S.radU([[0, '#FFF2C8', 0.9], [1, '#FFE2A0', 0]], 120, 420, 160));
    s += rect(46, 332, 36, 446, '#E3A657') + rect(200, 332, 36, 446, '#E3A657', { opacity: 0.85 });
    s += path('M150 700L160 676H200L210 700Z', '#F9DDA6') + rect(178, 700, 4, 70, '#5A4652');
    s += ell(140, 770, 70, 10, '#D9788C');
    s += rect(46, 332, 76, 446, '#CDEBF0', { opacity: 0.22 }) + rect(116, 332, 10, 446, '#EFE6DA') + poly([[60, 332], [80, 332], [46, 520], [46, 470]], '#FFFFFF', { opacity: 0.25 });
    // light spilling out over the patio
    s += poly([[122, 778], [236, 778], [500, 848], [140, 848]], '#FFD9A0', { opacity: p.day ? 0.12 : 0.3 });
    // patio slab and step
    s += path('M-20 776H452L494 848H-20Z', S.lin('patio', [[0, p.stoneLight], [1, p.stone]]));
    s += stroke('M100 776L80 848M220 776L230 848M330 776L352 848M-20 810H473', p.stoneDark, 2, { opacity: 0.45 });
    s += path('M-20 848H494L500 884H-20Z', p.stoneDark) + rect(-20, 848, 514, 4, p.rim, { opacity: 0.6 });
    s += path(blob(20, 852, 40, 10, 8, rng(92), 0.3, 0.3) + blob(470, 856, 30, 8, 8, rng(93), 0.3, 0.3), p.moss);
    return s;
  }

  function dish(S, x, y) {
    return ell(x, y + 4, 40, 8, S.pal.shade, { opacity: 0.25 }) + path('M' + (x - 36) + ' ' + (y - 6) + 'Q' + x + ' ' + (y + 18) + ' ' + (x + 36) + ' ' + (y - 6) + 'Z', '#D9E3EA') +
      ell(x, y - 6, 36, 9, '#EEF4F7') + ell(x, y - 5, 29, 6.4, S.lin('water', [[0, '#9CC6D8'], [1, '#6E9FC0']])) +
      ell(x - 10, y - 7, 9, 2, '#FFFFFF', { opacity: 0.8 }) + ell(x + 12, y - 4, 5, 1.2, S.pal.rim, { opacity: 0.8 });
  }

  // A folded towel on the patio (the Tall One's, in case you come home soggy): x is its centre,
  // y the patio under it.
  function towel(S, x, y) {
    var p = S.pal, w = 136, h = 30, x0 = x - w / 2, top = y - h, body = '#6FA8C8', lite = '#9ACBE2', dk = '#4C82A4', cream = '#F6F1E6';
    var s = ell(x + 4, y + 1, w * 0.56, 9, p.shade, { opacity: 0.28 });
    // the folded stack: three soft layers, the fold edge rounded at the right
    s += rect(x0, top + 4, w, h - 4, dk, { rx: 13 });
    s += rect(x0, top, w - 2, h - 6, body, { rx: 12 });
    s += rect(x0 + 4, top - 7, w - 12, 15, lite, { rx: 7.5 });
    s += stroke('M' + n(x0 + w - 14) + ' ' + n(top + 2) + 'q10 5 10 12M' + n(x0 + w - 16) + ' ' + n(top + 11) + 'q12 6 11 14', dk, 2.2, { opacity: 0.7 });
    s += stroke('M' + n(x0 + 10) + ' ' + n(top + 12) + 'H' + n(x0 + w - 20) + 'M' + n(x0 + 8) + ' ' + n(top + 20) + 'H' + n(x0 + w - 22), dk, 1.6, { opacity: 0.35 });
    // two cream stripes wrapping over the top, and a little fringe at the left end
    s += rect(x0 + 24, top - 7, 11, h + 6, cream, { opacity: 0.95 }) + rect(x0 + 41, top - 7, 6, h + 6, cream, { opacity: 0.95 });
    var fr = '';
    for (var i = 0; i < 6; i++) fr += 'M' + n(x0 + 1) + ' ' + n(top + 1 + i * 4.4) + 'h-6';
    s += stroke(fr, cream, 2, { opacity: 0.9 });
    s += stroke('M' + n(x0 + 10) + ' ' + n(top - 5) + 'H' + n(x0 + w - 18), '#FFFFFF', 2.4, { opacity: 0.55 });
    return g(s, { filter: S.shadow('s') });
  }

  function lawnCover(S, x, y, h) {
    var p = S.pal, r = rng(95), a = '', b = '', dew = '', k = h / 270;
    for (var i = 0; i < 26; i++) {
      var bx = x + (r() - 0.5) * 190 * k, by = y + 4 + r() * 16 * k, bh = (22 + r() * 34) * k;
      var d = bladeD(bx, by, bh, (r() - 0.5) * 22 * k, 2.6 * k);
      if (r() < 0.55) a += d; else b += d;
      if (r() < 0.25) dew += dot(bx + (r() - 0.5) * 6 * k, by - bh * 0.7, 2.4 * k);
    }
    return path(a, p.grassNear) + path(b, p.grassLight, { opacity: 0.95 }) + path(dew, '#E6F4FF', { opacity: 0.85 }) +
      g(ell(0, 0, 6 * k, 5 * k, '#D9453F') + circ(5 * k, -1 * k, 2.6 * k, '#2A2236') + stroke('M' + n(-6 * k) + ' 0H' + n(6 * k), '#2A2236', 0.8 * k) +
        path(dot(-2.5 * k, -2 * k, 1.1 * k) + dot(-2.5 * k, 2 * k, 1.1 * k), '#2A2236'), { transform: tr(x - 78 * k, y - 22 * k) });
  }

  // ------------------------------------------------------------------ CAMP

  function drawCampWide(S) {
    var p = S.pal, back = '', front = '', r = rng(101);
    back += sky(S, 0, 0, 1600, 660, { sun: [1000, 540], sunR: 560 });
    back += towers(S, [
      { x: 470, w: 120, top: 300, base: 640, far: 0.65 }, { x: 610, w: 90, top: 350, base: 640, far: 0.75, cap: 'slant' },
      { x: 880, w: 150, top: 250, base: 640, far: 0.6, cap: 'step' }, { x: 1050, w: 110, top: 320, base: 640, far: 0.7 },
      { x: 330, w: 130, top: 200, base: 640, far: 0.45, cap: 'spire' }, { x: 1170, w: 140, top: 180, base: 640, far: 0.45, cap: 'slant' }
    ]);
    back += g(towers(S, [
      { x: -60, w: 270, top: 20, base: 660, far: 0.08 }, { x: 196, w: 140, top: 150, base: 660, far: 0.22, cap: 'round' },
      { x: 1290, w: 150, top: 110, base: 660, far: 0.22, cap: 'step' }, { x: 1420, w: 260, top: -10, base: 660, far: 0.08, cap: 'slant' }
    ]), { filter: S.shadow('m') });
    back += plane(S, 760, 150, 1.1, 'left');
    // light rays between the towers
    back += g(poly([[1000, 470], [1060, 470], [1300, 1000], [980, 1000]], S.linU([[0, p.sun || '#FFE9AE', 0.3], [1, p.sun || '#FFE9AE', 0]], 0, 470, 0, 1000)) +
      poly([[950, 470], [990, 470], [620, 1000], [420, 1000]], S.linU([[0, p.sun || '#FFE9AE', 0.22], [1, p.sun || '#FFE9AE', 0]], 0, 470, 0, 1000)), { style: 'mix-blend-mode:screen' });
    // the wild ring of trees and hedge around camp
    var ring = path(mound(-90, 1690, 660, 470, 24, rng(102), 0.32, 0.3, 0.35), p.rim, { transform: 'translate(0 -7)' }) +
      path(mound(-90, 1690, 660, 470, 24, rng(102), 0.32, 0.3, 0.35), p.leaf) +
      path(blob(560, 480, 120, 70, 9, rng(103), 0.2, 0.3) + blob(1010, 470, 140, 80, 9, rng(104), 0.2, 0.3) + blob(250, 500, 110, 60, 9, rng(105), 0.2, 0.3), p.leaf) +
      path(blob(560, 476, 120, 70, 9, rng(103), 0.2, 0.3), p.rim, { opacity: 0.35 });
    back += g(ring, { filter: S.shadow('m') });
    // ground
    back += rect(0, 610, 1600, 390, S.lin('campground', [[0, p.grassFar], [0.35, p.grass], [1, p.grassNear]]));
    back += ell(1000, 760, 420, 90, p.rim, { opacity: 0.16 }) + ell(560, 900, 300, 60, p.rim, { opacity: 0.1 });
    back += tufts(S, 0, 1600, 640, 1000, 130, 106, p.grassNear, p.grassLight, 1);
    back += flowers(S, 0, 1600, 660, 990, 30, 107, '#FFF6EA') + flowers(S, 0, 1600, 700, 990, 14, 108, '#F2C46D');
    // seven rain puddles, the morning after the storm (Tallyheart counted them)
    if (S.opts.puddles) back += puddles(S, [[640, 905, 64, 11], [1030, 870, 78, 12], [1170, 958, 120, 17], [410, 868, 54, 9], [870, 975, 104, 15], [530, 970, 70, 12], [1330, 846, 52, 8]], 106);
    // the back bramble arch behind the fountain
    back += g(path(mound(610, 990, 640, 520, 8, rng(109), 0.32, 0.2, 0.3), p.leaf) + bramble(S, 620, 980, 640, 540, { seed: 110, arches: 4, w: 8 }), { filter: S.shadow('m') });
    // a whole-camp purr's rings ripple out across the ground, behind the crowd and everyone else
    back += purrRings(S);
    // the whole Clan (crowd: true): the row behind the fountain, its bodies hidden by the basin
    var crowd = !!S.opts.crowd;
    if (crowd) back += crowdCats(S, CROWD.back, 0);
    // paths of old stone, mossy
    back += stonePath(S, [[830, 1000], [815, 860], [800, 770]], { size: 34, seed: 111, y0: 600 }) +
      stonePath(S, [[260, 830], [450, 790], [600, 760]], { size: 26, seed: 112, y0: 600 }) +
      stonePath(S, [[1360, 840], [1180, 800], [1010, 765]], { size: 26, seed: 113, y0: 600 });
    // dens under arching brambles
    back += g(denMound(S, 20, 620, 770, 410, [[190, 150, 132], [452, 128, 112]], 121), { filter: S.shadow('l') });
    back += g(denMound(S, 980, 1600, 778, 400, [[1150, 140, 122], [1436, 156, 134]], 122), { filter: S.shadow('l') });
    // the fountain
    back += g(fountain(S), { filter: S.shadow('l') });
    // the crowd in front of the dens, on either side of the fountain
    if (crowd) back += crowdCats(S, CROWD.sides, CROWD.back.length);
    // ferns: middle ground
    back += fernClump(S, 640, 790, 130, { seed: 131, count: 6 }) + fernClump(S, 960, 795, 120, { seed: 132, count: 6 }) +
      fernClump(S, 300, 812, 120, { seed: 133, count: 6 });
    // and the nearer cats at the edges, among the ferns
    if (crowd) back += crowdCats(S, CROWD.near, CROWD.back.length + CROWD.sides.length);
    // fern bed where an apprentice can fall over: the bed is behind him; the fronds in front of
    // him (and the framing ferns) keep clear of his head and body
    var avoid = spotBoxes(S, 'ferns');
    back += fernClump(S, 1440, 905, 330, { seed: 134, count: 9, spread: 2.6 });
    S.covers.ferns = fernClump(S, 1360, 940, 200, { seed: 135, count: 5, spread: 1.6, lean: -0.15, avoid: avoid });
    // foreground ferns framing the corners
    front += fernClump(S, -70, 1010, 300, { seed: 136, count: 6, spread: 1.6, lean: 0.45, avoid: avoid }) +
      fernClump(S, 1690, 1015, 300, { seed: 137, count: 6, spread: 1.6, lean: -0.45, avoid: avoid });
    return { back: back, over: '', front: g(front, { filter: S.shadow('m') }) };
  }

  function denMound(S, x0, x1, base, top, openings, seed) {
    var p = S.pal, r = rng(seed), s = '';
    var d = mound(x0, x1, base, top, 11, r, 0.32, 0.22, 0.3);
    s += path(d, p.rim, { transform: 'translate(0 -8)' }) + path(d, p.leaf);
    s += path(mound(x0 + 30, x1 - 30, base - 10, top + 40, 10, r, 0.3, 0.2, 0.3), p.leafMid, { opacity: 0.75 });
    var tex = '';
    for (var i = 0; i < 120; i++) tex += leafD(x0 + 40 + r() * (x1 - x0 - 80), top + 60 + r() * (base - top - 80), 12 + r() * 10, r() * 6.28, 4);
    s += path(tex, p.leafLight, { opacity: 0.4 });
    for (i = 0; i < openings.length; i++) {
      var ox = openings[i][0], ow = openings[i][1], oh = openings[i][2];
      s += path('M' + n(ox - ow / 2) + ' ' + n(base + 2) + 'Q' + n(ox - ow / 2) + ' ' + n(base - oh * 1.15) + ' ' + n(ox) + ' ' + n(base - oh) +
        'Q' + n(ox + ow / 2) + ' ' + n(base - oh * 1.15) + ' ' + n(ox + ow / 2) + ' ' + n(base + 2) + 'Z', '#1C1A14');
      s += ell(ox, base - oh * 0.2, ow * 0.3, oh * 0.25, S.radB('denin', [[0, '#5A4A30', 0.6], [1, '#5A4A30', 0]]));
      s += ell(ox, base, ow * 0.62, oh * 0.12, p.moss, { opacity: 0.8 });
    }
    s += bramble(S, x0 + 20, x1 - 20, base, top + 30, { seed: seed + 1, w: 10, openings: openings });
    return s;
  }

  // o.water: full of rain (default: the camp's rainFountain option)
  function fountain(S, o) {
    var p = S.pal, s = '', r = rng(141), wet = o && o.water != null ? !!o.water : !!(S.opts && S.opts.rainFountain);
    s += ell(800, 770, 270, 40, p.shade, { opacity: 0.22 });
    s += path('M562 700L566 760Q800 835 1034 760L1038 700Z', S.lin('basin', [[0, p.stone], [1, p.stoneDark]]));
    var bricks = '';
    for (var x = 590; x < 1020; x += 46) bricks += 'M' + x + ' ' + n(712 + Math.pow((x - 800) / 238, 2) * -6) + 'V' + n(760 + (1 - Math.pow((x - 800) / 238, 2)) * 26);
    s += stroke(bricks + 'M566 732Q800 800 1034 732', p.stoneDark, 2.5, { opacity: 0.6 });
    s += ell(800, 700, 238, 52, p.stoneLight) + ell(800, 704, 208, 40, wet ? fountainWater(S, 'basinwater') : mix(p.stoneDark, p.sand, 0.35));
    s += ell(800, 696, 238, 52, 'none', { stroke: p.rim, 'stroke-width': 4, opacity: 0.7, 'stroke-dasharray': '300 900', 'stroke-dashoffset': '-560' });
    var lv = '';
    for (var i = 0; i < 14; i++) lv += leafD(640 + r() * 320, 690 + r() * 26, 14, r() * 6.28, 5);
    if (wet) {
      // brimming: the sky in the water, rings where the drips land, a few leaves afloat
      s += ell(800, 700, 204, 7, mix(p.stoneDark, p.shade, 0.3), { opacity: 0.35 }) + stroke('M660 712q60 -8 120 -2M840 716q70 -6 130 2', '#FFFFFF', 3, { opacity: 0.6 });
      s += ell(760, 716, 34, 7, 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.55, 'class': 'pcs-ring' }) +
        ell(872, 708, 26, 5, 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.5, 'class': 'pcs-ring', style: 'animation-delay:-1.8s' });
      s += path(leafD(700, 714, 14, 0.4, 5) + leafD(910, 700, 13, 2.8, 5) + leafD(822, 724, 12, 5.6, 4.5), '#C9853F', { opacity: 0.9 });
    } else {
      s += path(lv, '#C9853F', { opacity: 0.9 });
    }
    s += path(blob(600, 702, 34, 10, 8, r, 0.3, 0.3) + blob(1000, 706, 40, 10, 8, r, 0.3, 0.3) + blob(700, 748, 36, 12, 8, r, 0.3, 0.3), p.moss);
    // pedestal
    s += path('M768 708L778 530H822L832 708Z', S.lin('ped', [[0, p.stoneLight], [1, p.stoneDark]], 0, 0, 1, 0));
    s += rect(760, 690, 80, 16, p.stone, { rx: 4 }) + rect(770, 604, 60, 12, p.stone, { rx: 4 }) + rect(772, 530, 56, 12, p.stone, { rx: 4 });
    s += path(blob(790, 640, 14, 30, 7, r, 0.3, 0.3), p.moss, { opacity: 0.9 });
    // the top bowl, a mossy seat
    s += path('M694 488C698 524 750 540 800 540C850 540 902 524 906 488Z', S.lin('bowl', [[0, p.stone], [1, p.stoneDark]]));
    if (wet) {
      // the top bowl full to the brim, spilling over in drips
      s += ell(800, 488, 106, 22, p.stoneLight) + ell(800, 489, 94, 17, fountainWater(S, 'bowlwater')) + stroke('M744 486q30 -5 62 -2', '#FFFFFF', 3, { opacity: 0.7 });
    } else {
      s += ell(800, 488, 106, 22, p.stoneLight) + ell(800, 489, 94, 17, p.moss) + ell(790, 485, 70, 9, mix(p.moss, '#FFFFFF', 0.25), { opacity: 0.5 });
    }
    s += ell(800, 486, 106, 22, 'none', { stroke: p.rim, 'stroke-width': 3, opacity: 0.8, 'stroke-dasharray': '150 400', 'stroke-dashoffset': '-280' });
    s += path('M712 500q-4 14 2 24q4-10 6-22zM884 502q4 12-1 20q-4-8-6-18z', p.moss);
    s += path('M846 534q10 14 4 26q-8-10-8-24z', '#6A8A48');
    if (wet) {
      s += waterDrops(S, [[702, 516, 5, false], [898, 516, 5, false], [760, 538, 4.5, false], [700, 560, 5, true], [702, 630, 5, true], [898, 590, 5, true], [896, 660, 5, true], [760, 610, 4.5, true]], 142);
    }
    return s;
  }
  // Rainwater in a stone basin: the sky, lighter at the far edge.
  function fountainWater(S, key) {
    var p = S.pal;
    return S.lin(key, [[0, mix(p.sky[p.sky.length - 2], '#FFFFFF', 0.25)], [0.55, mix(p.sky[2], p.water, 0.3)], [1, mix(p.sky[1], p.water, 0.55)]]);
  }

  // ------------------------------------------------------------------ the whole Clan (camp, crowd: true)

  // The Warrior Counts: every cat in camp crowded round the fountain. Seats [x, y, facing, pose,
  // size], feet on the ground in the camp's main composition, every cat turned to the fountain: a row
  // behind it (between the dens, heads and shoulders over the basin), a group in front of each den,
  // and the nearer cats among the ferns at the edges. The clearing in front of the fountain stays
  // open: its foot (where a cat sits alone, small, to be tested) and the middle of camp.
  var CROWD = {
    back: [[652, 666, 'right', 'sit', 0.92], [700, 660, 'right', 'lookup', 1], [742, 670, 'right', 'sit', 0.66], [860, 670, 'left', 'sit', 0.7],
      [902, 660, 'left', 'lookup', 1], [952, 666, 'left', 'sit', 0.92]],
    sides: [[104, 756, 'right', 'lookup', 0.92], [276, 754, 'right', 'sit', 0.9], [1150, 756, 'left', 'sit', 0.9], [1388, 752, 'left', 'lookup', 0.92], [1480, 758, 'left', 'sit', 0.9],
      [58, 786, 'right', 'sit', 1], [148, 776, 'right', 'loaf', 1], [236, 792, 'right', 'sit', 1.04], [312, 778, 'right', 'lookup', 0.96], [290, 806, 'right', 'sit', 0.66],
      [1104, 782, 'left', 'sit', 0.98], [1186, 790, 'left', 'lookup', 1], [1232, 806, 'left', 'sit', 0.68], [1268, 780, 'left', 'sit', 1.04], [1350, 788, 'left', 'loaf', 1],
      [1432, 778, 'left', 'sit', 0.96], [1522, 786, 'left', 'stand', 1]],
    near: [[96, 874, 'right', 'sit', 1], [196, 858, 'right', 'lookup', 0.98], [1392, 862, 'left', 'sit', 1], [1505, 878, 'left', 'lookup', 1.02]]
  };
  // the coats round the fountain, in turn (each a Clan cat's variant; none ever wears her coat)
  var CROWD_COATS = [3, 1, 6, 4, 2, 5, 1, 4, 6, 3, 5, 2];
  var CROWD_MOODS = ['neutral', 'wonder', 'kind', 'neutral', 'proud', 'wonder', 'solemn', 'kind'];

  // The cast tint filter for the time of day (one per panel), shared by the cast and the crowd.
  function castTint(S) {
    return (CAST_TINT[S.tod] && S.set !== 'room') ? S.filter('tint', '<feColorMatrix type="matrix" values="' + CAST_TINT[S.tod] + '"/>') : null;
  }
  // Where the panel's own cast stands (world boxes), so the crowd keeps clear of them: no crowd cat
  // in front of one of them, or level with one, overlaps her, and none comes near a face (the
  // balloons point there).
  function castZones(S) {
    var R = refH(), out = [], used = {}, cast = S.cast || [];
    cast.forEach(function (m) { if (m && typeof m.at === 'string') used[m.at] = true; });
    cast.forEach(function (m) {
      if (!m) return;
      var a = resolveAnchor(S, m, used);
      if (!a) return;
      var b = castBoxes(castPlan(S, m, a, R));
      out.push({ y: a.y, head: b.head, body: b.body });
    });
    return out;
  }
  function boxHit(a, b, pad) {
    pad = pad || 0;
    return a[0] < b[2] + pad && a[2] > b[0] - pad && a[1] < b[3] + pad && a[3] > b[1] - pad;
  }
  // The crowd's seats that are free, drawn as Clan cats: the purr makes them all happy, eyes shut.
  function crowdCats(S, seats, k0) {
    var R = refH(), zones = S.crowdZones || (S.crowdZones = castZones(S)), tint = castTint(S), out = '';
    var taken = (S.cast || []).filter(function (c) { return c && c.who === 'clancat'; }).map(function (c) { return c.variant; });
    seats.forEach(function (st, j) {
      var i = k0 + j, s = depthAt(S, st[1]) / R * st[4];
      var o = { pose: st[3], mood: S.fx.purr ? 'happy' : CROWD_MOODS[i % CROWD_MOODS.length], variant: CROWD_COATS[i % CROWD_COATS.length], look: S.look || {}, taken: taken };
      var c = placeChar(S, 'clancat', o, st[0], st[1], s, st[2], tint ? { filter: tint } : null);
      var b = castBoxes({ who: 'clancat', co: o, s: s, face: st[2], x: st[0], y: st[1] }, c.ch);
      // in a close camera (the 'ferns' close-up, a third of the camp wide) a face the panel's edge
      // would cut through is left out: a crowd cat there is wholly in the picture or wholly out of
      // it, never sliced at the eyes (the wide shots keep their full edges, cats small at the frame)
      var hb = b.head, B = S.box;
      if (B && B.w < 1000 && ((hb[1] < B.y && hb[3] > B.y) || (hb[0] < B.x && hb[2] > B.x) || (hb[0] < B.x + B.w && hb[2] > B.x + B.w))) return;
      for (var z = 0; z < zones.length; z++) {
        var hw = zones[z].head[2] - zones[z].head[0];
        if (boxHit(b.body, zones[z].head, hw * 0.12)) return;
        if (st[1] >= zones[z].y - 6 && boxHit(b.body, zones[z].body)) return;
      }
      // each crowd cat says where its body is (world units), for the tests and the gallery
      out += g(ell(st[0], st[1] - 1, c.w * 0.4, Math.max(2.5, c.h * 0.045), S.pal.shade, { opacity: 0.28 }) + c.svg,
        { 'data-crowd': 'cat', 'data-box': b.body.map(n).join(' '), 'data-head': b.head.map(n).join(' ') });
    });
    return out;
  }
  // From the low angle under the fountain: the crowd's heads and ears, dark against the light, along
  // the bottom of the panel, all looking up at the leader (feet far below the panel). The middle,
  // where the fountain's foot rises toward us, stays open.
  var CROWD_HEADS = [[40, 1090, 'right', 440], [250, 1075, 'right', 410], [462, 1085, 'right', 430], [628, 1068, 'right', 370],
    [972, 1068, 'left', 370], [1138, 1085, 'left', 430], [1350, 1075, 'left', 410], [1560, 1090, 'left', 440]];
  function crowdHeads(S) {
    var p = S.pal, R = refH(), out = '';
    // dusky shapes, each lit along its top and right by the low sun behind the leader
    var sil = S.filter('crowdsil', '<feFlood flood-color="' + mix(p.shade, p.leafMid, 0.28) + '"/><feComposite in2="SourceAlpha" operator="in" result="s"/>' +
      '<feOffset in="SourceAlpha" dx="-6" dy="6" result="off"/>' +
      '<feFlood flood-color="' + p.rim + '"/><feComposite in2="SourceAlpha" operator="in" result="rf"/>' +
      '<feComposite in="rf" in2="off" operator="out" result="r"/>' +
      '<feMerge><feMergeNode in="s"/><feMergeNode in="r"/></feMerge>');
    CROWD_HEADS.forEach(function (st, i) {
      out += placeChar(S, 'clancat', { pose: 'lookup', mood: 'neutral', variant: CROWD_COATS[i % CROWD_COATS.length] }, st[0], st[1], st[3] / R, st[2], { filter: sil }).svg;
    });
    return g(out, { 'data-crowd': 'heads' });
  }
  // From above, at the newcomer's feet (the entrance camera): more long shadows of watching cats,
  // round every edge. [x, y, rotation, facing, size]
  var CROWD_SHADOWS = [[700, -60, 180, 'right', 230], [1050, -40, 190, 'left', 190], [-60, 300, 100, 'right', 170], [-50, 700, 80, 'right', 210],
    [1660, 760, -80, 'left', 200], [520, 1080, 10, 'right', 180], [1180, 1070, -12, 'left', 160]];

  // ------------------------------------------------------------------ HOLLOW

  // Where the claw marks go on the old tree, [x, y, size] each, in order: one Count each, left to
  // right. One or two marks are full size side by side at her reach (the first exactly where chapter
  // 1 scratched it); three to six are smaller, three to a row; seven to ten (every table to ten times
  // ten) smaller again, four to a row, each row set in a little as the trunk leans: all of them on the
  // trunk, clear of the knot hole, and inside the tree close-up.
  var MAX_MARKS = 10;
  function markSpots(count) {
    if (count <= 2) return [[1126, 516, 1], [1188, 516, 1]].slice(0, count);
    var out = [], i;
    if (count <= 6) {
      for (i = 0; i < count; i++) out.push([(i < 3 ? 1104 : 1112) + (i % 3) * 50, i < 3 ? 500 : 570, 0.72]);
      return out;
    }
    for (i = 0; i < count; i++) { var row = Math.floor(i / 4); out.push([[1100, 1110, 1116][row] + (i % 4) * 35, 505 + row * 55, 0.55]); }
    return out;
  }
  // glow: true lights every mark; a list lights mark i when glow[i] is true. ('auto' is the UI's to
  // fill in from the cat; left unfilled, as in the gallery, nothing glows and no marks are drawn.)
  function markGlows(glow, i) { return Array.isArray(glow) ? glow[i] === true : glow === true; }
  // How deep each mark is: 0 a fresh scratch, 1 deeper, 2 deepest (drawn wider, with a dark groove
  // down the middle). depth: a number for every mark, or a list, one per mark (true counts as 1).
  // Left out (or 'auto' left unfilled), practice has deepened every mark but the newest, the oldest
  // most: two marks are [1, 0], three [2, 1, 0], so "your first mark is a little deeper".
  function markDepths(depth, count) {
    var out = [];
    for (var i = 0; i < count; i++) {
      var d = Array.isArray(depth) ? depth[i] : typeof depth === 'number' || typeof depth === 'boolean' ? depth : Math.min(2, count - 1 - i);
      out.push(d === true ? 1 : clamp(Math.round(+d || 0), 0, 2));
    }
    return out;
  }

  function drawHollow(S) {
    var p = S.pal, o = S.opts, back = '', front = '', r = rng(151);
    back += sky(S, 0, 0, 1600, 620, { sun: [160, 470], sunR: 520 });
    back += towers(S, [
      { x: 40, w: 160, top: 150, base: 620, far: 0.45, cap: 'spire' }, { x: 230, w: 110, top: 260, base: 620, far: 0.6, cap: 'slant' },
      { x: 1380, w: 200, top: 200, base: 620, far: 0.5, cap: 'step' }
    ]);
    // camp edge: brambles and ferns behind
    back += g(path(mound(-80, 1680, 700, 430, 20, rng(152), 0.32, 0.28, 0.3), p.rim, { transform: 'translate(0 -7)' }) +
      path(mound(-80, 1680, 700, 430, 20, rng(152), 0.32, 0.28, 0.3), p.leaf) +
      bramble(S, 0, 700, 700, 470, { seed: 153, arches: 5, w: 10 }), { filter: S.shadow('m') });
    back += flowers(S, 0, 1600, 520, 680, 16, 159, '#FFF6EA');
    back += fernClump(S, 500, 716, 150, { seed: 158, count: 6 }) + fernClump(S, 860, 712, 170, { seed: 154 }) + fernClump(S, 1480, 720, 170, { seed: 155 });
    // ground and the sandy hollow
    back += rect(0, 680, 1600, 320, S.lin('hground', [[0, p.grassFar], [1, p.grassNear]]));
    back += ell(780, 892, 600, 128, mix(p.sand, p.grass, 0.45));
    back += ell(780, 896, 560, 112, S.lin('sand', [[0, p.sandLight], [0.5, p.sand], [1, p.sandDark]]));
    var rip = '', peb = '';
    for (var i = 0; i < 60; i++) {
      var rx0 = 300 + r() * 960, ry0 = 806 + r() * 176, rl = 24 + r() * 46;
      if (Math.pow((rx0 - 780) / 520, 2) + Math.pow((ry0 - 896) / 102, 2) > 0.85) continue;
      rip += 'M' + n(rx0) + ' ' + n(ry0) + 'q' + n(rl / 2) + ' ' + n(-4 - r() * 3) + ' ' + n(rl) + ' 0';
    }
    back += stroke(rip, p.sandDark, 2.4, { opacity: 0.32 });
    for (i = 0; i < 40; i++) { var px = 300 + r() * 960, py = 820 + r() * 150; if (Math.pow((px - 780) / 540, 2) + Math.pow((py - 896) / 105, 2) < 1) peb += blob(px, py, 3 + r() * 5, 2 + r() * 3, 6, r, 0.3, 0.3); }
    back += path(peb, p.stoneDark, { opacity: 0.7 });
    // the sun patch
    back += ell(330, 846, 250, 66, S.radB('sunpatch', [[0, '#FFF0B8', 0.75], [0.6, '#FFE29A', 0.4], [1, '#FFE29A', 0]]));
    back += g(poly([[-40, 0], [200, 0], [520, 860], [150, 860]], S.linU([[0, '#FFF0C0', 0.22], [1, '#FFF0C0', 0.05]], 0, 0, 0, 860)), { style: 'mix-blend-mode:screen' });
    // the old tree, leaning over the hollow like it's listening
    var trunk = 'M1140 880C1120 760 1104 640 1098 560C1088 450 1010 330 880 250C800 200 720 170 640 150L700 110C800 130 900 170 990 230C1130 330 1240 440 1262 560C1280 660 1300 780 1340 880Z';
    var tree = path(trunk, p.rim, { transform: 'translate(-6 -5)' }) + path(trunk, S.lin('bark', [[0, '#8A6448'], [1, '#5E4232']], 0, 0, 1, 0));
    var grooves = 'M1160 870C1150 760 1140 650 1132 560C1120 470 1060 380 960 300M1200 870C1196 760 1188 660 1180 580C1170 480 1110 390 1010 310M1250 870C1250 780 1240 680 1226 590C1210 500 1150 410 1060 330M1300 870C1290 800 1280 720 1266 640';
    tree += stroke(grooves, '#4A3226', 4, { opacity: 0.55 }) + stroke(grooves, p.rim, 1.5, { opacity: 0.35, transform: 'translate(-3 0)' });
    tree += path('M1120 880C1060 870 1000 884 960 900C1010 896 1070 892 1150 900ZM1320 880C1380 874 1440 886 1490 904C1430 900 1380 896 1310 900Z', '#6A4A36');
    tree += ell(1206, 690, 18, 26, '#3A281E') + ell(1210, 694, 10, 16, '#24180F');
    tree += path(blob(1180, 820, 50, 22, 8, rng(156), 0.3, 0.3), p.moss, { opacity: 0.9 });
    // claw marks: one for every Count she knows, left to right (markSpots); each glows on its own
    var marks = clamp(Math.round(+o.marks || 0), 0, MAX_MARKS), mk = '', glow = '';
    var mkIn = '', mkLit = '', sparks = '', glowTight = '', spots = markSpots(marks), kx0 = 1e9, ky0 = 1e9, kx1 = -1e9, ky1 = -1e9;
    var depths = markDepths(o.depth, marks), core = '', coreLit = '';
    for (i = 0; i < marks; i++) {
      var mx = spots[i][0], my = spots[i][1], k = spots[i][2], lit = markGlows(o.glow, i), dp = depths[i];
      for (var j = 0; j < 3; j++) {
        var x0 = mx + j * 14 * k, y0 = my - j * 5 * k, x1 = x0 + 20 * k, y1 = y0 + 70 * k;
        // a deeper mark is gouged wider, and its groove is dark down the middle
        mk += taper([x0, y0], [x0 + 9 * k, y0 + 22 * k], [x0 + 15 * k, y0 + 46 * k], [x1, y1], 11 * k * (1 + 0.24 * dp), 2 * k * (1 + 0.5 * dp), 10);
        var inner = taper([x0 - 1 * k, y0 + 1 * k], [x0 + 8 * k, y0 + 23 * k], [x0 + 14 * k, y0 + 46 * k], [x1 - 1 * k, y1 - 2 * k], 5 * k * (1 + 0.16 * dp), 1 * k, 10);
        if (lit) mkLit += inner; else mkIn += inner;
        if (dp) {
          var groove = taper([x0 - 0.5 * k, y0 + 4 * k], [x0 + 8.5 * k, y0 + 24 * k], [x0 + 14.5 * k, y0 + 46 * k], [x1 - 2 * k, y1 - 8 * k], (1.4 + 1 * dp) * k, 0.4 * k, 10);
          if (lit) coreLit += groove; else core += groove;
        }
      }
      if (lit && marks === 1) {
        glow += ell(mx + 26 * k, my + 32 * k, 70 * k, 82 * k, '#FFD86E', { opacity: 0.85 });
        for (j = 0; j < 4; j++) sparks += g(path(sparkleD(0, 0, (9 + j * 2) * k), '#FFF8D8', { 'class': 'pcs-tw', style: 'animation-delay:-' + (j * 0.7).toFixed(1) + 's' }), { transform: tr(mx + (-20 + j * 30) * k, my + (-20 + (j % 2) * 110) * k) });
      } else if (lit) {
        // beside other marks, each glow keeps to its own mark, so a plain one beside it stays plain
        glowTight += ell(mx + 25 * k, my + 32 * k, 38 * k, 62 * k, '#FFD86E', { opacity: 0.9 });
        for (j = 0; j < 4; j++) sparks += g(path(sparkleD(0, 0, (8 + j * 2) * k), '#FFF8D8', { 'class': 'pcs-tw', style: 'animation-delay:-' + (j * 0.7).toFixed(1) + 's' }), { transform: tr(mx + (-10 + j * 20) * k, my + (-16 + (j % 2) * 100) * k) });
      }
      kx0 = Math.min(kx0, mx - 22 * k); ky0 = Math.min(ky0, my - 22 * k); kx1 = Math.max(kx1, mx + 74 * k); ky1 = Math.max(ky1, my + 90 * k);
    }
    if (marks) {
      // the marks are what the panel is about: ask the lettering to keep off all of them
      (S.keep = S.keep || []).push({ x: kx0, y: ky0, w: kx1 - kx0, h: ky1 - ky0 });
    }
    if (glow) tree += g(g(glow, { filter: S.blur('markglow', 22) }), { 'class': 'pcs-pulse' });
    if (glowTight) tree += g(g(glowTight, { filter: S.blur('markglow2', 10) }), { 'class': 'pcs-pulse' });
    tree += path(mk, '#3A281E') + path(mkIn, '#E9D2A6') + path(mkLit, '#FFF6D0', { 'class': 'pcs-pulse' }) +
      path(core, '#6B4A32', { opacity: 0.9 }) + path(coreLit, '#E3A752', { opacity: 0.8 }) + sparks;
    // the canopy, tipping over the hollow
    var can = '';
    can += path(blob(780, 120, 560, 170, 16, rng(157), 0.2, 0.32), p.rim, { transform: 'translate(0 -8)' });
    can += path(blob(780, 120, 560, 170, 16, rng(157), 0.2, 0.32), p.leaf);
    can += path(blob(560, 170, 260, 110, 12, rng(158), 0.25, 0.32) + blob(1060, 180, 240, 100, 12, rng(159), 0.25, 0.32), p.leafMid);
    var dap = '';
    for (i = 0; i < 160; i++) dap += leafD(260 + r() * 1040, 30 + r() * 260, 14 + r() * 10, r() * 6.28, 5);
    can += path(dap, p.leafLight, { opacity: 0.55 });
    // close on the trunk (`tree`), the canopy is far above the panel (it ends near y 320, the camera
    // starts at 430), so it is left out: the same picture, and the trunk's papercut shadow alone stays
    // small enough for Quick Look (tools/frames.mjs), which drops a filtered group whose region
    // passes about 4,000 pixels, the trunk and the claw marks with it
    back += g(S.cam === 'tree' ? tree : tree + can, { filter: S.shadow('l') });
    // hanging twigs
    back += stroke('M420 230q-10 60 6 120M520 260q4 50-8 90M940 250q10 50 0 100', '#5E4232', 3) +
      path(leafD(426, 350, 16, 1.8, 6) + leafD(512, 350, 16, 1.2, 6) + leafD(940, 350, 16, 1.6, 6), p.leafMid);
    // front: grass lip of the hollow
    front += g(tufts(S, 0, 1600, 960, 1010, 40, 160, p.grassNear, p.grassLight, 2.2), { filter: S.shadow('s') });
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ DEN

  function drawDen(S) { return S.comp === 'outside' ? drawDenOutside(S) : drawDenInside(S); }

  function roseCols(S) {
    return S.tod === 'storm' ? ['#8E5A6E', '#6A3E50', '#B98498'] : S.tod === 'night' ? ['#B46F8C', '#82506A', '#E0A4BC'] : ['#E07A98', '#B05070', '#F7B7C6'];
  }

  function moon(S, x, y, r) {
    return circ(x, y, r * 3, S.radU([[0, '#FFF6DE', 0.32], [1, '#FFF6DE', 0]], x, y, r * 3)) +
      path('M' + n(x - r * 0.2) + ' ' + n(y - r) + 'A' + n(r) + ' ' + n(r) + ' 0 1 0 ' + n(x - r * 0.2) + ' ' + n(y + r) +
        'A' + n(r * 0.78) + ' ' + n(r * 0.95) + ' 0 1 1 ' + n(x - r * 0.2) + ' ' + n(y - r) + 'Z', '#FFF3D2');
  }

  function drawDenOutside(S) {
    var p = S.pal, back = '', r = rng(171), storm = S.opts.weather === 'storm', cloudy = S.opts.weather === 'cloudy', rc = roseCols(S);
    // the rosebush fills the middle of the sky, so the Sky River runs across the top, above it
    back += sky(S, 0, 0, 1600, 760, { seed: 172, cloudy: cloudy, riverAt: { cx: 800, cy: 80, L: 2000, ang: -7, T: 72 } });
    // no moon unless a frame asks for one: her first night is a new moon (the case: "there was no
    // moon that night"), so Russet's "by moonlight" is a lie a careful reader can catch
    if (S.opts.moon && S.tod === 'night' && !cloudy) back += moon(S, 1330, 150, 44);
    back += towers(S, [
      { x: 20, w: 170, top: 240, base: 700, far: 0.5 }, { x: 210, w: 120, top: 330, base: 700, far: 0.6, cap: 'slant' },
      { x: 1180, w: 150, top: 280, base: 700, far: 0.55, cap: 'spire' }, { x: 1400, w: 200, top: 200, base: 700, far: 0.45, cap: 'step' }
    ]);
    back += g(path(mound(-80, 1680, 740, 560, 20, rng(173), 0.32, 0.3, 0.3), p.leaf), { filter: S.shadow('s') });
    back += rect(0, 720, 1600, 280, S.lin('denground', [[0, p.grassFar], [1, p.grassNear]]));
    back += tufts(S, 0, 1600, 740, 1000, 90, 174, p.grassNear, p.grassLight, 1);
    // the enormous rosebush
    var bush = '';
    var d = mound(140, 1460, 816, 100, 20, rng(175), 0.32, 0.16, 0.25);
    bush += path(d, p.rim, { transform: 'translate(0 -7)', opacity: 0.7 }) + path(d, p.leaf);
    bush += path(mound(200, 1400, 806, 160, 18, rng(176), 0.3, 0.2, 0.25), p.leafMid, { opacity: 0.8 });
    var tex = '';
    for (var i = 0; i < 280; i++) tex += leafD(220 + r() * 1160, 170 + r() * 600, 16 + r() * 12, r() * 6.28, 6);
    bush += path(tex, p.leafLight, { opacity: 0.45 });
    // the hollow beneath it (by day a deep green shade, not the black of night)
    bush += path('M650 818Q640 570 800 556Q960 570 950 818Z', p.day ? mix(p.leaf, '#06100C', 0.72) : '#0B0F14');
    bush += ell(800, 770, 130, 60, S.radB('denin2', [[0, '#4E6A50', 0.55], [1, '#4E6A50', 0]]));
    bush += path(mound(660, 940, 820, 792, 8, rng(178), 0.3, 0.2, 0.2), p.moss);
    bush += bramble(S, 160, 1440, 816, 150, { seed: 177, w: 11, fruit: false, len: 300, canes: 16, openings: [[800, 300, 262]] });
    for (i = 0; i < 40; i++) {
      var a = Math.PI + r() * Math.PI, rr = r();
      var rx2 = 800 + Math.cos(a) * 640 * (0.3 + rr * 0.66), ry2 = 816 + Math.sin(a) * 700 * (0.3 + rr * 0.66);
      if (Math.abs(rx2 - 800) < 190 && ry2 > 520) continue;
      bush += rose(rx2, ry2, 15 + r() * 10, rc[0], rc[1], rc[2]);
    }
    var sway = storm ? { 'class': 'pcs-sway', style: 'animation-duration:1.6s' } : null;
    back += g(g(bush, sway), { filter: S.shadow('l') });
    back += stonePath(S, [[800, 1000], [800, 840]], { size: 34, seed: 179, y0: 700 });
    if (storm) back += path(blob(400, 930, 120, 16, 10, rng(180), 0.2, 0.3) + blob(1150, 960, 150, 18, 10, rng(181), 0.2, 0.3), '#3A4A60', { opacity: 0.6 });
    if (S.opts.drips) back += denDripsOutside(S);
    var front = g(fernClump(S, -40, 1010, 260, { seed: 182, count: 6, spread: 1.5, lean: 0.4 }) + fernClump(S, 1650, 1010, 260, { seed: 183, count: 6, spread: 1.5, lean: -0.4 }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  var DEN_DOOR = 'M1210 900C1196 640 1270 430 1390 420C1510 430 1584 640 1570 900Z';

  // Riffle's stone in her nest (the den's `stone` option), drawn on the moss in front of whoever
  // lies there: true (or 'auto' left unfilled) between her front paws, 'nose' just past her nose,
  // where she can see it, 'chin' tucked under her chin. With nobody in the nest, in the front moss.
  // It always rests on something: a cat lying with her head down (curled up, or lying flat) has it
  // by her nose or under her chin, at her head; a cat holding her head up (a loaf, sitting) has it on
  // the moss, under her chin just in front of her paws, or out past her nose, never in the air.
  function denStone(S, x, y, k) {
    var o = S.opts.stone;
    if (!o) return '';
    var r = 12 * k, crest = y - 4 * k, sx = x - 140 * k * 0.1, sy = crest;
    var m = null, a = S.anchorMap && S.anchorMap.nest;
    (S.cast || []).forEach(function (c) { if (c && c.at === 'nest' && CAT_IDS[c.who || 'clancat'] && !m) m = c; });
    if (m && a) {
      var pl = castPlan(S, m, a, refH()), hb = castBoxes(pl).head, dir = pl.face === 'left' ? -1 : 1;
      var hx = (hb[0] + hb[2]) / 2, hw = hb[2] - hb[0];
      // head up: her chin is well above the moss, where the stone would hang in the air
      var up = crest - hb[3] > r * 2;
      if (o === 'nose') {
        sx = (dir > 0 ? hb[2] : hb[0]) + dir * r * 1.2; sy = up ? crest : clamp(hb[3] - r * 0.6, hb[1] + hw * 0.5, crest);
        // head up, with someone else beside the nest (Murmurpaw at its edge): out past the head box
        // it would land at her paws and read as hers, so it lies on our cat's own moss, ahead of her paws
        if (up && (S.cast || []).some(function (c) {
          if (!c || c === m || !CAT_IDS[c.who || 'clancat'] && c.who !== 'riffle') return false;
          var ca = resolveAnchor(S, c, {}), bb = ca && castBoxes(castPlan(S, c, ca, refH())).body;
          return bb && sx + r > bb[0] - r && sx - r < bb[2] + r && sy > bb[1];
        })) sx = hx + dir * hw * 0.45;
      }
      else if (o === 'chin') { sx = hx + dir * hw * (up ? 0.24 : 0.06); sy = up ? crest : clamp(hb[3] + r * 0.2, hb[1] + hw * 0.6, crest); }
      else { sx = hx + dir * hw * 0.12; sy = crest; }
    }
    return luckyStone(S, sx, sy, r);
  }

  function drawDenInside(S) {
    var p = S.pal, back = '', front = '', r = rng(191), storm = S.opts.weather === 'storm', cloudy = S.opts.weather === 'cloudy', rc = roseCols(S), i;
    var day = !!p.day;
    // outside, through the doorway
    var out = sky(S, 1180, 380, 420, 560, { seed: 192, starCount: 70, boltX: 0.5, boltH: 0.6, cloudy: cloudy });
    out += path(mound(1150, 1650, 760, 640, 8, rng(193), 0.3, 0.3, 0.3), p.leaf) + rect(1180, 740, 420, 200, S.lin('doorground', [[0, p.grassFar], [1, p.grassNear]]));
    out += tufts(S, 1200, 1600, 760, 900, 30, 194, p.grassNear, p.grassLight, 1);
    if (storm) out += path(blob(1400, 860, 120, 12, 8, rng(195), 0.2, 0.3), '#3A4A60', { opacity: 0.7 });
    back += g(out, { 'clip-path': S.clip('door', path(DEN_DOOR, '#fff')) });
    S.weatherClip = S.clip('door', path(DEN_DOOR, '#fff'));
    // the back of the hollow: a wall of leaves in the dark
    // (by day: a shady green, lit from the door and through the leaves)
    var dark = storm ? ['#0B1316', '#14211B'] : day ? [mix(p.leaf, '#0E1A14', 0.55), mix(p.leafMid, '#0E1A14', 0.5)] : ['#0F1C24', '#1A2E27'];
    var wallD = 'M0 0H1600V1000H0Z' + DEN_DOOR;
    back += path(wallD, S.lin('denwall', [[0, dark[0]], [1, dark[1]]]), { 'fill-rule': 'evenodd' });
    var wl = '', wl2 = '';
    for (i = 0; i < 300; i++) {
      var lx = r() * 1600, ly = 140 + r() * 640;
      if (lx > 1170 && ly > 380) continue;
      var ld = leafD(lx, ly, 24 + r() * 18, r() * 6.28, 9);
      if (r() < 0.55) wl += ld; else wl2 += ld;
    }
    back += path(wl, mix(p.leaf, '#000000', 0.15), { opacity: 0.9 }) + path(wl2, p.leafMid, { opacity: 0.4 });
    // moonlight from the door, pooling across the floor

    // the floor: soft moss
    back += path('M0 730Q400 700 800 712Q1100 720 1230 760L1230 1000H0Z', S.lin('denfloor', [[0, mix(p.moss, '#000000', 0.2)], [1, mix(p.moss, '#000000', 0.5)]]));
    back += path(blob(300, 960, 240, 30, 12, rng(196), 0.25, 0.3) + blob(900, 985, 280, 30, 12, rng(197), 0.25, 0.3), p.moss, { opacity: 0.55 });
    if (day) {
      // sunlight through the door: a warm pool on the floor and a soft shaft of light
      back += ell(1180, 930, 440, 96, S.radB('doorsun', [[0, '#FFF1C4', 0.5], [1, '#FFF1C4', 0]]));
      back += g(poly([[1236, 470], [1420, 420], [1120, 1000], [560, 1000]], S.linU([[0, '#FFF3CC', 0.26], [1, '#FFF3CC', 0.04]], 1300, 430, 800, 1000)), { style: 'mix-blend-mode:screen' });
    } else {
      back += ell(1180, 930, 420, 90, S.radB('doorpool', [[0, storm || cloudy ? '#7F92B4' : '#C9D8FF', storm ? 0.12 : cloudy ? 0.14 : 0.22], [1, '#C9D8FF', 0]]));
    }
    // old rose stems, rising out of the floor into the leaves
    var stemCol = storm ? '#3E3530' : '#5A4638', stems = '', thorns = '', sprigs = '';
    var ST = [[60, 1010, 170, 250, 78], [470, 1010, 560, 210, 40], [870, 1010, 760, 220, 46], [1150, 1010, 1110, 300, 60]];
    for (i = 0; i < ST.length; i++) {
      var b = ST[i], A = [b[0], b[1]], B = [b[0] + (b[2] - b[0]) * 0.2 - 50, b[1] - (b[1] - b[3]) * 0.45], C = [b[2] + 60, b[3] + (b[1] - b[3]) * 0.3], D = [b[2], b[3]];
      var td = taper(A, B, C, D, b[4], b[4] * 0.35, 16);
      stems += path(td, p.rim, { opacity: storm ? 0.15 : 0.4, transform: 'translate(' + n(-b[4] * 0.12) + ' 0)' }) + path(td, stemCol) +
        path(taper([A[0] + b[4] * 0.15, A[1]], [B[0] + b[4] * 0.12, B[1]], [C[0] + b[4] * 0.1, C[1]], [D[0] + b[4] * 0.06, D[1]], b[4] * 0.45, b[4] * 0.15, 16), mix(stemCol, '#000000', 0.3), { opacity: 0.6 });
      for (var t = 0.15; t < 0.95; t += 0.12) {
        var q = bez3(A, B, C, D, t), sd = (Math.round(t * 100) % 2) ? 1 : -1;
        thorns += 'M' + n(q[0] + sd * b[4] * 0.4) + ' ' + n(q[1] - 7) + 'L' + n(q[0] + sd * b[4] * 0.85) + ' ' + n(q[1] - 2) + 'L' + n(q[0] + sd * b[4] * 0.4) + ' ' + n(q[1] + 6) + 'Z';
        if (r() < 0.5) sprigs += leafD(q[0] + sd * b[4] * 0.4, q[1], 30, sd > 0 ? -0.5 : Math.PI + 0.5, 11) + leafD(q[0] + sd * b[4] * 0.4, q[1], 24, sd > 0 ? 0.2 : Math.PI - 0.2, 9);
      }
    }
    back += stems + path(thorns, stemCol) + path(sprigs, p.leafMid);
    // the ceiling: leaves hanging low, with roses and starlight between them
    var cd = 'M-40 -40H1640V' + n(330), bx = 1640, by = 330;
    while (bx > -40) {
      var nx2 = bx - 70 - r() * 50, ny2 = 170 + 150 * Math.pow(Math.abs(nx2 - 760) / 800, 2) + r() * 50;
      cd += 'Q' + n((bx + nx2) / 2) + ' ' + n(Math.max(by, ny2) + 46 + r() * 20) + ' ' + n(nx2) + ' ' + n(ny2);
      bx = nx2; by = ny2;
    }
    cd += 'V-40Z';
    var ceil = path(cd, p.rim, { opacity: storm ? 0.12 : 0.3, transform: 'translate(0 6)' }) + path(cd, mix(p.leaf, '#000000', 0.2));
    var hang = '', hang2 = '', gaps = '';
    for (i = 0; i < 70; i++) {
      var hx = r() * 1600, hy = 150 + 150 * Math.pow(Math.abs(hx - 760) / 800, 2) + r() * 60;
      var hd = leafD(hx, hy - 20, 30 + r() * 16, Math.PI / 2 + (r() - 0.5) * 1.2, 10);
      if (r() < 0.5) hang += hd; else hang2 += hd;
    }
    ceil += path(hang, p.leaf) + path(hang2, p.leafMid);
    // starlight between the leaves (under cloud the gaps show only dark sky); by day, bright sky
    if (!storm) for (i = 0; i < 16; i++) { var gx = 60 + r() * 1100, gy = 30 + r() * 120, gr = 3 + r() * 3; gaps += day ? dot(gx, gy, gr * 1.5) : sparkleD(gx, gy, gr); }
    if (day) ceil += path(gaps, mix(p.sky[1], '#FFFFFF', 0.35), { opacity: 0.75 });
    else if (!cloudy) ceil += path(gaps, '#FFF6DE', { opacity: 0.85, 'class': 'pcs-twk' });
    var drops = [[260, 260], [620, 220], [980, 250]];
    for (i = 0; i < drops.length; i++) {
      var dx = drops[i][0], dy = drops[i][1], dl = 90 + r() * 70;
      ceil += stroke('M' + dx + ' ' + (dy - 40) + 'q' + n(-14) + ' ' + n(dl * 0.5) + ' ' + n(6) + ' ' + n(dl), stemCol, 6) +
        path(leafD(dx - 4, dy + dl * 0.4, 26, 2.4, 9) + leafD(dx + 2, dy + dl * 0.6, 24, 0.6, 9), p.leafMid) + rose(dx + 6, dy - 40 + dl + 8, 16, rc[0], rc[1], rc[2]);
    }
    for (i = 0; i < 7; i++) ceil += rose(140 + i * 160 + r() * 60, 90 + r() * 90, 14 + r() * 8, rc[0], rc[1], rc[2]);
    back += g(g(ceil, storm ? { 'class': 'pcs-sway', style: 'animation-duration:1.8s' } : null), { filter: S.shadow('l') });
    // the doorway, framed by thick old stems
    back += stroke('M1188 920C1172 640 1252 404 1390 396C1528 404 1612 640 1596 920', stemCol, 30) +
      stroke('M1188 920C1172 640 1252 404 1390 396C1528 404 1612 640 1596 920', p.rim, 3, { opacity: storm ? 0.2 : 0.45, transform: 'translate(0 -10)' }) +
      path(leafD(1230, 600, 44, 2.2, 14) + leafD(1270, 470, 42, 2.6, 13) + leafD(1340, 410, 40, 3.0, 12) + leafD(1470, 430, 42, 0.4, 13) + leafD(1550, 560, 44, 0.9, 14), p.leafMid);
    // fireflies on a clear night
    if (!storm && !day) {
      var ff = '';
      for (i = 0; i < 8; i++) ff += g(circ(200 + r() * 900, 380 + r() * 300, 9, '#FFF2A0', { opacity: 0.25 }) + circ(200 + r() * 900, 380 + r() * 300, 3.5, '#FFF7C0'), { 'class': 'pcs-float', style: 'animation-delay:-' + (i * 0.8).toFixed(1) + 's' });
      back += ff;
    }
    // three moss nests (the front rims hold the sleepers)
    var N = [['sleeper-1', 330, 808, 0.98], ['sleeper-2', 640, 850, 1.02], ['nest', 1060, 886, 1.06]];
    for (i = 0; i < N.length; i++) {
      var nn = nest(S, N[i][1], N[i][2], N[i][3], N[i][0] === 'nest');
      back += nn.back;
      S.covers[N[i][0]] = nn.front + (N[i][0] === 'nest' ? denStone(S, N[i][1], N[i][2], N[i][3]) : '');
    }
    if (storm) {
      // rain leaking through the roof: each drop falls from the leaves and fades (pcs-drip, as the
      // morning's drips do; reduced motion leaves them hanging)
      var dr = '';
      for (i = 0; i < 10; i++) dr += g(path('M0 0q4 8 0 12q-4-4 0-12z', '#9FB8D8', { transform: tr(150 + r() * 1000, 230 + r() * 200) }), { 'class': 'pcs-drip', style: 'animation-duration:2.2s;animation-delay:-' + (r() * 2).toFixed(1) + 's' });
      back += dr;
    }
    if (S.opts.drips) back += denDripsInside(S);
    return { back: back, over: '', front: front };
  }

  // A water drop with its point up; (x, y) is the bottom of the drop.
  function dropD(x, y, rr) {
    return 'M' + n(x) + ' ' + n(y - rr * 2.7) + 'Q' + n(x + rr * 0.35) + ' ' + n(y - rr * 1.7) + ' ' + n(x + rr) + ' ' + n(y - rr * 0.9) +
      'A' + n(rr) + ' ' + n(rr) + ' 0 1 1 ' + n(x - rr) + ' ' + n(y - rr * 0.9) + 'Q' + n(x - rr * 0.35) + ' ' + n(y - rr * 1.7) + ' ' + n(x) + ' ' + n(y - rr * 2.7) + 'Z';
  }
  // Drops [x, y, r, falling]: hanging ones sit still, falling ones slide down and fade (pcs-drip),
  // each with its own delay, so a column of them reads as drip, drip, drip.
  function waterDrops(S, list, seed) {
    var r = rng(seed || 401), still = '', glint = '', fall = '', col = mix(S.pal.sky[2] || '#CFE6F2', '#E8F6FF', 0.6);
    for (var i = 0; i < list.length; i++) {
      var d = list[i], x = d[0], y = d[1], rr = d[2];
      var one = path(dropD(x, y, rr), col, { opacity: 0.9 }) + circ(x - rr * 0.35, y - rr * 1.05, rr * 0.32, '#FFFFFF');
      if (d[3]) fall += g(one, { 'class': 'pcs-drip', style: 'animation-delay:-' + (r() * 2.4).toFixed(1) + 's' });
      else { still += dropD(x, y, rr); glint += dot(x - rr * 0.35, y - rr * 1.05, rr * 0.32); }
    }
    return path(still, col, { opacity: 0.9 }) + path(glint, '#FFFFFF') + fall;
  }
  // Soft spots of sunlight through the leaves, [cx, cy, rx, ry] each: warm, bright in the middle,
  // fading at the edge.
  function sunSpots(S, list) {
    var f = S.radB('sunspot', [[0, '#FFF4B8', 0.85], [0.5, '#FFE58A', 0.5], [1, '#FFE58A', 0]]), s = '';
    for (var i = 0; i < list.length; i++) s += ell(list[i][0], list[i][1], list[i][2], list[i][3], f);
    return s;
  }
  // Tiny glints of water on wet leaves.
  function wetGlints(S, x0, x1, y0, y1, count, seed, keepOut) {
    var r = rng(seed), d = '', tw = '';
    for (var i = 0; i < count; i++) {
      var x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), rr = 2.2 + r() * 2.6;
      if (keepOut && keepOut(x, y)) continue;
      if (i % 6 === 0) tw += path(sparkleD(x, y, rr * 2.4), '#FFFFFF', { 'class': 'pcs-twk', style: 'animation-delay:-' + (r() * 3.6).toFixed(1) + 's' });
      else d += dot(x, y, rr);
    }
    return path(d, '#F2FAFF', { opacity: 0.85 }) + tw;
  }

  // The morning after the storm, inside the den: sun spots on the moss, water dripping from the
  // leaves overhead (over every nest, and from the doorway's arch), a shiny wet patch by the door.
  function denDripsInside(S) {
    var p = S.pal, s = '';
    if (p.sun) s += sunSpots(S, [[420, 760, 80, 20], [180, 905, 100, 22], [760, 935, 120, 24], [520, 992, 90, 18], [985, 818, 70, 15], [1150, 912, 80, 17],
      [930, 762, 46, 11], [1060, 872, 60, 12], [330, 820, 60, 12]]);
    // rain that blew in at the door
    s += puddles(S, [[1300, 935, 110, 14], [1480, 955, 70, 10]], 413);
    var D = [];
    // from the ceiling's leaf tips, over the nests and the floor
    [[300, 300], [345, 290], [600, 245], [655, 250], [1010, 300], [1085, 320], [1180, 350], [800, 230], [140, 330]].forEach(function (t) { D.push([t[0], t[1], 6, false]); });
    // falling: columns of drops over each nest (the nest close-up sees the right-hand ones)
    [[300, 420], [300, 600], [655, 380], [655, 640], [1010, 520], [1010, 760], [1085, 600], [1085, 820], [1180, 700], [800, 520], [1100, 712]].forEach(function (t) { D.push([t[0], t[1], 5.5, true]); });
    // from the doorway's arch
    [[1262, 520], [1330, 430], [1452, 432], [1530, 520]].forEach(function (t) { D.push([t[0], t[1], 6.5, false]); });
    [[1262, 640], [1530, 680]].forEach(function (t) { D.push([t[0], t[1], 6, true]); });
    s += waterDrops(S, D, 415);
    s += wetGlints(S, 40, 1180, 170, 330, 40, 416);
    return s;
  }
  // Outside, the morning after: the rosebush glitters, drops hang from the den's arch and fall past
  // the doorway, puddles on the grass and the path, dapples of sun at the den mouth.
  function denDripsOutside(S) {
    var p = S.pal, s = '';
    // the bush's outline, as drawn in drawDenOutside, so the glints stay on the leaves
    var inBush = function (x, y) {
      var u = (x - 800) / 660, top = 816 - 716 * Math.sqrt(Math.max(0, 1 - u * u));
      return !(y > top + 20 && y < 800 && Math.abs(u) < 0.96) || (Math.abs(x - 800) < 170 && y > 540);
    };
    s += wetGlints(S, 150, 1450, 120, 790, 150, 421, inBush);
    s += puddles(S, [[330, 905, 120, 16], [1230, 940, 150, 18], [640, 975, 70, 10], [1010, 885, 60, 9]], 422);
    if (p.sun) s += sunSpots(S, [[800, 832, 100, 14], [700, 884, 50, 9], [905, 905, 64, 10]]);
    var D = [];
    // along the arch over the den mouth, and from a few roses and leaves higher up
    [[668, 640], [690, 600], [728, 568], [800, 548], [872, 568], [910, 600], [932, 640], [420, 520], [1180, 500], [560, 330], [1030, 300]].forEach(function (t) { D.push([t[0], t[1], 6, false]); });
    [[690, 700], [910, 690], [800, 640], [420, 600], [1180, 590]].forEach(function (t) { D.push([t[0], t[1], 5.5, true]); });
    s += waterDrops(S, D, 424);
    return s;
  }
  // Rain puddles, [cx, cy, rx, ry] each: the sky in them, a wet dark rim, a glint.
  function puddles(S, list, seed) {
    var p = S.pal, r = rng(seed || 431), wet = '', water = '', shine = '', ring = '';
    var fill = S.lin('puddle', [[0, mix(p.sky[1], p.water, 0.35)], [0.7, p.sky[2]], [1, mix(p.sky[3] || p.sky[2], '#FFFFFF', 0.12)]]);
    for (var i = 0; i < list.length; i++) {
      var x = list[i][0], y = list[i][1], rx = list[i][2], ry = list[i][3];
      wet += blob(x, y + ry * 0.15, rx * 1.14, ry * 1.4, 11, r, 0.14, 0.1);
      water += blob(x, y, rx, ry, 11, r, 0.14, 0.08);
      shine += 'M' + n(x - rx * 0.5) + ' ' + n(y - ry * 0.15) + 'h' + n(rx * 0.32) + 'M' + n(x + rx * 0.05) + ' ' + n(y + ry * 0.25) + 'h' + n(rx * 0.22);
      if (i % 2 === 0) ring += ell(x + rx * 0.2, y, rx * 0.3, ry * 0.42, 'none', { stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.6, 'class': 'pcs-ring', style: 'animation-delay:-' + (r() * 3.6).toFixed(1) + 's' });
    }
    return path(wet, mix(p.grassNear, p.shade, 0.35), { opacity: 0.4 }) + path(water, fill) +
      stroke(shine, '#FFFFFF', 2.6, { opacity: 0.75 }) + ring;
  }

  function nest(S, x, y, k, special) {
    var p = S.pal, r = rng(seedOf('nest' + x)), rx = 140 * k, ry = 40 * k, moss = mix(p.moss, '#FFFFFF', 0.06), hi = mix(moss, '#FFFFFF', 0.16);
    var backS = ell(x, y + 8 * k, rx * 1.06, ry * 1.15, p.shade, { opacity: 0.4 }) + ell(x, y, rx, ry, moss) + ell(x, y + 3 * k, rx * 0.72, ry * 0.56, mix(p.moss, '#000000', 0.42));
    var bumps = '', bumps2 = '';
    for (var i = 0; i < 24; i++) {
      var a = Math.PI + i * Math.PI / 23, br = 12 * k + r() * 6 * k;
      bumps += dot(x + Math.cos(a) * rx * 0.9, y + Math.sin(a) * ry * 0.82, br);
      bumps2 += dot(x + Math.cos(a) * rx * 0.9 - br * 0.2, y + Math.sin(a) * ry * 0.82 - br * 0.3, br * 0.55);
    }
    backS += path(bumps, moss) + path(bumps2, hi, { opacity: 0.6 });
    var rim = 'M' + n(x - rx) + ' ' + n(y) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(x + rx) + ' ' + n(y) + 'L' + n(x + rx * 0.72) + ' ' + n(y + 3 * k) +
      'A' + n(rx * 0.72) + ' ' + n(ry * 0.56) + ' 0 0 1 ' + n(x - rx * 0.72) + ' ' + n(y + 3 * k) + 'Z';
    var fb = '', fb2 = '', strands = '';
    for (i = 0; i < 20; i++) {
      var a2 = i * Math.PI / 19, br2 = 13 * k + r() * 6 * k, fx2 = x + Math.cos(a2) * rx * 0.86, fy2 = y + Math.sin(a2) * ry * 0.98;
      fb += dot(fx2, fy2, br2);
      fb2 += dot(fx2 - br2 * 0.25, fy2 - br2 * 0.35, br2 * 0.5);
      if (r() < 0.5) strands += 'M' + n(fx2 - br2 * 0.6) + ' ' + n(fy2 + br2 * 0.3) + 'q' + n(br2 * 0.5) + ' ' + n(-br2 * 0.5) + ' ' + n(br2 * 1.1) + ' ' + n(-br2 * 0.1);
    }
    var frontS = path(rim, moss) + path(fb, moss) + path(fb2, hi, { opacity: 0.55 }) + stroke(strands, mix(moss, '#000000', 0.25), 2 * k, { opacity: 0.6 });
    if (special) {
      frontS += path(leafD(x + rx * 0.5, y + ry * 0.75, 50 * k, -0.45, 10 * k), '#EEE7D8') + stroke('M' + n(x + rx * 0.5) + ' ' + n(y + ry * 0.75) + 'l' + n(45 * k) + ' ' + n(-22 * k), '#B9AE98', 1.6 * k);
      frontS += path(blob(x - rx * 0.5, y + ry * 0.8, 10 * k, 7 * k, 6, r, 0.3, 0.3), roseCols(S)[0]);
    }
    return { back: backS, front: frontS };
  }

  // Riffle's lucky stone: a smooth, nearly black pebble with a white band all the way round it,
  // centred at (x, y), r its half-height (world units). The band curves like a smile, so it reads
  // as going round the back. o: { shadow: false, sparkle: true, tilt: degrees }.
  function luckyStone(S, x, y, r, o) {
    o = o || {};
    var rx = r * 1.3, ry = r, out = '';
    if (o.shadow !== false) out += ell(x + r * 0.12, y + ry * 0.8, rx * 0.95, ry * 0.32, S.pal.shade, { opacity: 0.4 });
    var yu = -0.16 * ry, yl = 0.2 * ry, c = 0.42 * ry;
    var xu = rx * Math.sqrt(1 - yu * yu / (ry * ry)), xl = rx * Math.sqrt(1 - yl * yl / (ry * ry));
    var band = 'M' + n(-xu) + ' ' + n(yu) + 'Q0 ' + n(yu + c) + ' ' + n(xu) + ' ' + n(yu) + 'L' + n(xl) + ' ' + n(yl) + 'Q0 ' + n(yl + c) + ' ' + n(-xl) + ' ' + n(yl) + 'Z';
    var st = ell(0, 0, rx, ry, '#24252C', { stroke: '#121318', 'stroke-width': n(r * 0.12) }) +
      ell(-rx * 0.22, -ry * 0.32, rx * 0.62, ry * 0.42, '#3C3E4A', { opacity: 0.85 }) +
      path(band, '#F6F3EC') + ell(-rx * 0.48, -ry * 0.5, rx * 0.2, ry * 0.11, '#FFFFFF', { opacity: 0.7, transform: 'rotate(-20 ' + n(-rx * 0.48) + ' ' + n(-ry * 0.5) + ')' });
    out += g(st, { transform: 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(o.tilt == null ? -8 : o.tilt) + ')' });
    if (o.sparkle) out += g(path(sparkleD(0, 0, r * 0.55), '#FFF8D8', { 'class': 'pcs-tw' }), { transform: tr(x + rx * 0.45, y + ry * 0.05) });
    return out;
  }

  // ------------------------------------------------------------------ SKY

  function drawSky(S) {
    var p = S.pal, back = '', front = '', r = rng(201);
    back += sky(S, 0, 0, 1600, 1000, { river: true, starCount: 520, seed: 202, riverH: 0.85 });
    // the horizon: towers and the camp, black against the stars
    var ink = '#070C1C', ink2 = '#0B1328';
    back += towers(S, [
      { x: 60, w: 160, top: 640, base: 1000, far: 0.2, lit: 0.6 }, { x: 260, w: 110, top: 700, base: 1000, far: 0.3, cap: 'slant', lit: 0.6 },
      { x: 1130, w: 140, top: 660, base: 1000, far: 0.25, cap: 'spire', lit: 0.6 }, { x: 1320, w: 220, top: 600, base: 1000, far: 0.2, cap: 'step', lit: 0.6 }
    ]);
    var sil = path(mound(-80, 1680, 1000, 800, 20, rng(203), 0.32, 0.4, 0.3), ink2);
    sil += path(mound(820, 1300, 960, 720, 10, rng(204), 0.32, 0.2, 0.3), ink2);
    sil += path('M40 1000C60 880 110 770 190 700C220 676 250 664 280 660C240 690 220 720 205 760C180 840 170 920 175 1000Z', ink);
    sil += path(blob(250, 610, 140, 76, 11, rng(205), 0.3, 0.32) + blob(390, 650, 120, 62, 10, rng(207), 0.3, 0.32) + blob(110, 650, 110, 70, 10, rng(208), 0.3, 0.32) +
      blob(300, 545, 100, 56, 10, rng(209), 0.3, 0.32), ink);
    var fr = '';
    for (var i = 0; i < 5; i++) fr += frond(200 + i * 300, 1000, 160 + r() * 80, -Math.PI / 2 + (r() - 0.5) * 1.4, (r() - 0.5) * 1.2, r, 0.2).leaves;
    sil += path(fr, ink);
    sil += rect(0, 960, 1600, 40, ink);
    back += sil;
    back += stroke('M190 700C220 676 250 664 280 660', '#5D6FA6', 3, { opacity: 0.5 });
    // grass the cats sit on
    front += g(tufts(S, 300, 1300, 985, 1010, 30, 206, '#050914', '#0B1328', 1.8));
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ RIVER

  function drawRiver(S) {
    var p = S.pal, back = '', front = '', r = rng(211), o = S.opts;
    S.boltOn = true;
    back += sky(S, 0, 0, 1600, 560, { bolt: true, boltX: 0.33, boltH: 0.9, cloudH: 0.7 });
    // the far shore: city lights and the Needle
    back += path('M0 520Q200 500 400 512Q800 500 1200 508Q1450 498 1600 512V560H0Z', '#0D121C');
    var cl = '';
    for (var i = 0; i < 60; i++) cl += dot(r() * 1600, 512 + r() * 30, 1.3 + r() * 1.4);
    back += path(cl, '#FFD27F', { opacity: 0.8 });
    back += path('M1290 512L1298 330L1306 312L1314 330L1322 512Z', '#1A2130') + circ(1306, 322, 3, '#FF6B5E', { 'class': 'pcs-blink' });
    // water
    back += rect(0, 540, 1600, 460, S.lin('river', [[0, '#1C2838'], [0.5, '#121C2A'], [1, '#0A1018']]));
    var rip = '';
    for (i = 0; i < 70; i++) { var y = 560 + Math.pow(r(), 1.4) * 400, w = 20 + (y - 540) * 0.25; rip += 'M' + n(r() * 1600) + ' ' + n(y) + 'h' + n(w); }
    back += stroke(rip, '#5A6E8E', 2, { opacity: 0.45 });
    back += poly([[520, 560], [560, 560], [600, 1000], [470, 1000]], S.linU([[0, '#CFE0FF', 0.35], [1, '#CFE0FF', 0]], 0, 560, 0, 1000), { 'class': 'pcs-bolton' });
    // the Old Bridge: long and low, dark against the storm
    var br = 'M-40 440L1640 470V500L-40 478Z', piers = '', arches = '';
    for (var x = 30; x < 1640; x += 150) {
      var yb = 476 + (x / 1600) * 26;
      piers += 'M' + n(x - 16) + ' ' + n(yb) + 'h32V' + n(560 + (x / 1600) * 8) + 'h-32Z';
      arches += 'M' + n(x + 16) + ' ' + n(yb + 2) + 'Q' + n(x + 75) + ' ' + n(yb + 40) + ' ' + n(x + 134) + ' ' + n(yb + 4);
    }
    back += path(br, '#05080E') + path(piers, '#05080E') + stroke(arches, '#05080E', 10);
    back += stroke('M-40 440L1640 470', '#9FB0C8', 2.5, { opacity: 0.55 });
    var truss = '';
    for (x = 0; x < 1640; x += 60) truss += 'M' + n(x) + ' ' + n(441 + x / 1600 * 30) + 'l30 -22l30 22';
    back += stroke(truss, '#05080E', 4) + stroke('M0 ' + n(419) + 'L1640 ' + n(449), '#05080E', 5);
    // the splash: a huge white plume, far off
    if (o.splash) back += g(splash(S, 1060, 540, 1), { filter: S.shadow('s') });
    // the camp's edge, in the foreground
    var fg = path('M0 1000V900Q200 860 420 880Q700 900 900 870Q1200 840 1600 880V1000Z', '#05080E');
    var reeds = '';
    for (i = 0; i < 46; i++) { var rx = r() * 1600, rh = 80 + r() * 130; reeds += bladeD(rx, 960, rh, (r() - 0.5) * 50, 4); }
    fg += path(reeds, '#070B12') + stroke('M0 900Q200 860 420 880Q700 900 900 870Q1200 840 1600 880', '#7F92B4', 2.5, { opacity: 0.5 });
    fg += bramble(S, 1150, 1600, 980, 820, { seed: 216, arches: 3, w: 9, stem: '#05080E', rim: '#7F92B4', leafCol: '#070B12', berry: '#070B12', blossom: '#070B12' });
    front += fg;
    return { back: back, over: '', front: front };
  }

  // ------------------------------------------------------------------ TITLE

  function drawTitle(S) {
    var p = S.pal, back = '', front = '', r = rng(221);
    // by day the sun stands high over the river, and its glitter on the water moves under it
    var sx = p.day ? 1250 : 1120, sd = sx - 1120;
    back += sky(S, 0, 0, 1600, 700, p.day ? { sun: [sx, 170], sunR: 420 } : { sun: [1120, 620], sunR: 620 });
    back += plane(S, 1000, 210, 1.7, 'left') + plane(S, 1380, 130, 1.1, 'left') + plane(S, 1530, 70, 0.7, 'left');
    // the far shore and the Needle
    back += path('M560 620Q800 590 1100 604Q1350 596 1600 606V650H560Z', mix(p.haze, p.sky[1], 0.4));
    back += path('M1384 606L1390 446L1396 432L1402 446L1408 606Z', mix(p.haze, p.sky[1], 0.55));
    // glass towers: Crystal City on the near bank
    back += g(towers(S, [
      { x: 330, w: 140, top: 330, base: 660, far: 0.5 }, { x: 470, w: 110, top: 420, base: 660, far: 0.6, cap: 'slant' },
      { x: -40, w: 200, top: 110, base: 660, far: 0.1, cap: 'spire' }, { x: 150, w: 160, top: 210, base: 660, far: 0.2, cap: 'step' },
      { x: 300, w: 90, top: 380, base: 660, far: 0.3, cap: 'round' }
    ]), { filter: S.shadow('m') });
    // the river
    back += rect(0, 640, 1600, 360, S.lin('triver', [[0, mix(p.sky[4], p.water, 0.25)], [0.4, mix(p.sky[2], p.water, 0.5)], [1, p.water]]));
    back += poly([[1060 + sd, 640], [1180 + sd, 640], [1300 + sd, 1000], [940 + sd, 1000]], S.linU([[0, p.sun || p.glow, p.day ? 0.4 : 0.55], [1, p.sun || p.glow, 0]], 0, 640, 0, 1000));
    var gl = '';
    for (var i = 0; i < 60; i++) { var y = 650 + Math.pow(r(), 1.2) * 340, x = 960 + sd + (r() - 0.5) * (300 + (y - 640) * 1.4); gl += 'M' + n(x) + ' ' + n(y) + 'h' + n(14 + (y - 640) * 0.12); }
    back += stroke(gl, '#FFF0C8', 3, { opacity: 0.75, 'class': 'pcs-glint' });
    var gl2 = '';
    for (i = 0; i < 40; i++) { y = 660 + r() * 320; gl2 += 'M' + n(r() * 900) + ' ' + n(y) + 'h' + n(20 + (y - 640) * 0.15); }
    back += stroke(gl2, mix(p.sky[3], '#FFFFFF', 0.3), 2.5, { opacity: 0.4 });
    // the long bridge, low across the river, with a little Ironsnake crossing
    var bridge = 'M-40 690L1640 650V668L-40 712Z', piers = '', arches = '';
    for (var bx = 40; bx < 1640; bx += 120) {
      var by = 708 - bx * 0.025;
      piers += 'M' + n(bx - 9) + ' ' + n(by - 4) + 'h18V' + n(by + 40) + 'h-18Z';
      arches += 'M' + n(bx + 9) + ' ' + n(by - 2) + 'Q' + n(bx + 60) + ' ' + n(by + 22) + ' ' + n(bx + 111) + ' ' + n(by - 4);
    }
    var bcol = mix(p.shade, p.sky[1], 0.35);
    back += path(bridge, bcol) + path(piers, bcol) + stroke(arches, bcol, 6) + stroke('M-40 690L1640 650', p.rim, 2, { opacity: 0.7 });
    var train = '';
    for (i = 0; i < 5; i++) { var tx = 640 + i * 62, ty = 690 - tx * 0.025 - 26; train += rect(tx, ty, 58, 24, bcol, { rx: 5 }); }
    back += train;
    var tw = '';
    for (i = 0; i < 5; i++) for (var j = 0; j < 4; j++) { var wx = 646 + i * 62 + j * 13, wy = 690 - (640 + i * 62) * 0.025 - 20; tw += 'M' + n(wx) + ' ' + n(wy) + 'h8v8h-8z'; }
    back += path(tw, p.day ? mix(p.sky[2], '#FFFFFF', 0.4) : '#FFD27F', { opacity: 0.9 });
    // the low stone wall in the foreground
    var wall = path('M560 1000V852Q560 838 576 838H1640V1000Z', S.lin('twall', [[0, p.stone], [1, p.stoneDark]]));
    var mortar = '';
    for (var row = 0; row < 4; row++) {
      var yy = 870 + row * 36;
      mortar += 'M560 ' + yy + 'H1640';
      for (var xx = 560 + (row % 2) * 40; xx < 1640; xx += 82) mortar += 'M' + xx + ' ' + (yy - 36 + (row === 0 ? 4 : 0)) + 'V' + yy;
    }
    wall += stroke(mortar, mix(p.stoneDark, '#000', 0.2), 3, { opacity: 0.5 });
    wall += rect(552, 826, 1100, 20, p.stoneLight, { rx: 8 }) + rect(552, 826, 1100, 5, p.rim, { rx: 3, opacity: 0.9 });
    wall += path(blob(700, 846, 60, 10, 8, rng(222), 0.3, 0.3) + blob(1420, 848, 70, 10, 8, rng(223), 0.3, 0.3), p.moss);
    front += g(wall, { filter: S.shadow('l') });
    front += g(tufts(S, 0, 560, 930, 1005, 30, 224, p.grassNear, p.grassLight, 2.4) + fernClump(S, 520, 1010, 200, { seed: 225, count: 6 }) +
      flowers(S, 0, 540, 950, 995, 10, 226, '#F7D6E0'), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  function taper(A, B, C, D, w0, w1, steps) {
    var L = [], R = [], k = steps || 14;
    for (var i = 0; i <= k; i++) {
      var t = i / k, q = bez3(A, B, C, D, t), q2 = bez3(A, B, C, D, Math.min(1, t + 0.01)), q1 = bez3(A, B, C, D, Math.max(0, t - 0.01));
      var tx = q2[0] - q1[0], ty = q2[1] - q1[1], tl = Math.sqrt(tx * tx + ty * ty) || 1, w = lerp(w0, w1, t) / 2;
      L.push([q[0] - ty / tl * w, q[1] + tx / tl * w]);
      R.push([q[0] + ty / tl * w, q[1] - tx / tl * w]);
    }
    return pts(L.concat(R.reverse())) + 'Z';
  }

  function drawCamp(S) {
    if (S.comp === 'fountain') return drawCampFountain(S);
    if (S.comp === 'entrance') return drawCampEntrance(S);
    return drawCampWide(S);
  }

  // Low angle, looking up at the leader on her fountain against the golden towers.

  function drawCampFountain(S) {
    var p = S.pal, back = '', front = '', r = rng(161), i;
    back += sky(S, 0, 0, 1600, 1000, { sun: [1090, 420], sunR: 720 });
    function lean(list, ang) { return g(towers(S, list), { transform: 'translate(0 1000) skewX(' + ang + ') translate(0 -1000)' }); }
    back += g(lean([{ x: -120, w: 300, top: -300, base: 1000, far: 0.12 }, { x: 190, w: 170, top: 80, base: 1000, far: 0.3, cap: 'slant' }], -11) +
      lean([{ x: 1240, w: 170, top: 40, base: 1000, far: 0.3, cap: 'step' }, { x: 1420, w: 300, top: -300, base: 1000, far: 0.12 }], 11), { filter: S.shadow('m') });
    back += lean([{ x: 470, w: 120, top: 260, base: 1000, far: 0.6, cap: 'spire' }], -4) + lean([{ x: 1010, w: 130, top: 300, base: 1000, far: 0.6 }], 4);
    back += plane(S, 1240, 170, 1.3, 'left');
    back += g(poly([[1060, 420], [1120, 420], [1500, 1000], [1180, 1000]], S.linU([[0, p.sun || '#FFE9AE', 0.3], [1, p.sun || '#FFE9AE', 0]], 0, 420, 0, 1000)) +
      poly([[1040, 420], [1080, 420], [700, 1000], [520, 1000]], S.linU([[0, p.sun || '#FFE9AE', 0.22], [1, p.sun || '#FFE9AE', 0]], 0, 420, 0, 1000)), { style: 'mix-blend-mode:screen' });
    // the tops of the brambles all round, seen from below
    back += g(path(mound(-120, 1720, 1060, 760, 18, rng(162), 0.34, 0.3, 0.3), p.leaf, { transform: 'translate(0 -8)' }) +
      path(mound(-120, 1720, 1060, 760, 18, rng(162), 0.34, 0.3, 0.3), p.leafMid) +
      bramble(S, -60, 1660, 1040, 800, { seed: 163, w: 14, len: 260, canes: 14 }), { filter: S.shadow('m') });
    // the fountain: the pedestal rising toward us, the bowl seen from beneath
    var f = '';
    f += path('M742 700L700 1010H900L858 700Z', S.lin('pedlow', [[0, p.stoneLight], [0.55, p.stone], [1, p.stoneDark]], 0, 0, 1, 0));
    f += rect(722, 760, 156, 22, p.stone, { rx: 6 }) + rect(712, 880, 176, 26, p.stone, { rx: 6 }) + rect(722, 760, 156, 6, p.rim, { rx: 3, opacity: 0.7 });
    f += path(blob(860, 820, 18, 50, 7, r, 0.3, 0.3), p.moss);
    f += path('M436 600Q470 716 800 730Q1130 716 1164 600Z', S.lin('bowlunder', [[0, p.stone], [1, mix(p.stoneDark, p.shade, 0.25)]]));
    var carve = '';
    for (i = 0; i < 9; i++) { var cx = 520 + i * 70; carve += 'M' + cx + ' ' + n(640 + Math.abs(cx - 800) * -0.12) + 'q20 26 40 0'; }
    f += stroke(carve, p.stoneDark, 4, { opacity: 0.45 });
    f += ell(800, 596, 366, 22, p.stoneLight) + ell(800, 592, 366, 14, p.rim, { opacity: 0.55 });
    var drape = '';
    for (i = 0; i < 9; i++) { var dx = 470 + i * 82 + r() * 30; drape += 'M' + n(dx - 22) + ' 606q22 ' + n(26 + r() * 40) + ' 44 0z'; }
    f += path(drape, p.moss) + path('M1100 612q16 40 4 70q-12-26-14-62z', p.moss);
    f += fernClump(S, 1120, 612, 90, { seed: 164, count: 5, spread: 1.6, lean: 0.4 });
    if (S.opts.rainFountain) {
      // brimming with rain: a bright wet edge, dark wet streaks, drips falling from the lip
      f += ell(800, 590, 352, 9, mix(p.sky[2], '#FFFFFF', 0.4), { opacity: 0.8 });
      f += stroke('M520 640q6 30 2 60M640 668q4 26 0 50M960 668q-4 26 0 50M1080 642q-6 30-2 58', mix(p.stoneDark, p.shade, 0.3), 9, { opacity: 0.35 });
      f += waterDrops(S, [[472, 622, 7, false], [610, 642, 7, false], [990, 642, 7, false], [1128, 622, 7, false], [472, 700, 7, true], [472, 820, 7, true],
        [610, 730, 7, true], [990, 760, 7, true], [1128, 690, 7, true], [1128, 860, 7, true], [800, 760, 7, true]], 160);
    }
    back += g(f, { filter: S.shadow('l') });
    // the whole Clan (crowd: true): heads and ears along the bottom, looking up at her
    if (S.opts.crowd) back += crowdHeads(S);
    front += g(fernClump(S, -60, 1060, 420, { seed: 166, count: 7, spread: 1.4, lean: 0.55 }) + fernClump(S, 1680, 1060, 420, { seed: 167, count: 7, spread: 1.4, lean: -0.55 }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  // High angle, looking down at the newcomer in a ring of golden light.

  function drawCampEntrance(S) {
    var p = S.pal, back = '', front = '', r = rng(165), i;
    back += rect(0, 0, 1600, 1000, S.lin('higround', [[0, mix(p.grassFar, p.grass, 0.3)], [1, p.grass]]));
    var moss = '';
    for (i = 0; i < 26; i++) moss += blob(r() * 1600, r() * 1000, 60 + r() * 120, 30 + r() * 50, 9, r, 0.3, 0.3);
    back += path(moss, p.grassNear, { opacity: 0.16 });
    // dappled light through the brambles
    var dap = '';
    for (i = 0; i < 18; i++) dap += blob(r() * 1600, r() * 1000, 30 + r() * 60, 16 + r() * 30, 8, r, 0.3, 0.3);
    back += path(dap, p.rim, { opacity: 0.18 });
    // the light pool the newcomer sits in
    back += ell(800, 720, 560, 340, S.radB('pool', [[0, p.sun || '#FFE9AE', 0.75], [0.55, p.glow || '#FFD98A', 0.3], [1, p.glow || '#FFD98A', 0]]));
    // old stepping stones, round from above, curving past
    var st = '', P = [[-40, 300], [240, 360], [480, 420], [1180, 540], [1420, 640], [1660, 760]];
    st += stonePath(S, P, { size: 70, seed: 168, y0: 0, y1: 1000 });
    back += st;
    if (S.opts.puddles) back += puddles(S, [[300, 640, 130, 62], [1300, 880, 130, 58], [600, 170, 90, 40], [1060, 290, 104, 44], [150, 930, 96, 44], [1460, 420, 80, 38], [880, 980, 70, 26]], 176);
    back += tufts(S, 0, 1600, 0, 1000, 120, 169, p.grassNear, p.grassLight, 1.2);
    back += flowers(S, 0, 1600, 0, 1000, 30, 170, '#FFF6EA') + flowers(S, 0, 1600, 0, 1000, 14, 171, '#F2C46D');
    var lv = '';
    for (i = 0; i < 20; i++) lv += leafD(r() * 1600, r() * 1000, 26 + r() * 14, r() * 6.28, 10);
    back += path(lv, '#C98A45', { opacity: 0.85 });
    // the long, soft shadows of the Clan cats watching from the edge
    var sh = S.filter('watch', '<feFlood flood-color="' + mix(p.shade, p.grassNear, 0.4) + '"/><feComposite in2="SourceAlpha" operator="in"/>', 'x="-5%" y="-5%" width="110%" height="110%"');
    var R = refH(), spots = [[210, -40, 200, -1], [1390, -50, 160, 1], [1560, 420, 110, 1]];
    for (i = 0; i < spots.length; i++) {
      var c = placeChar(S, 'clancat', { pose: 'sit', mood: 'neutral', variant: i + 1 }, spots[i][0], spots[i][1], 300 / R, spots[i][3] < 0 ? 'right' : 'left', { filter: sh });
      back += g(c.svg, { opacity: 0.24, transform: 'rotate(' + spots[i][2] + ' ' + spots[i][0] + ' ' + spots[i][1] + ')' });
    }
    // the whole Clan (crowd: true): shadows of watching cats round every edge
    if (S.opts.crowd) {
      CROWD_SHADOWS.forEach(function (st, j) {
        var cs = placeChar(S, 'clancat', { pose: 'sit', mood: 'neutral', variant: CROWD_COATS[j] }, st[0], st[1], st[4] / R, st[3], { filter: sh });
        back += g(cs.svg, { opacity: 0.22, transform: 'rotate(' + st[2] + ' ' + st[0] + ' ' + st[1] + ')', 'data-crowd': 'shadow' });
      });
    }
    // fronds leaning in over the edges
    front += g(fernClump(S, -80, 1060, 380, { seed: 172, count: 6, spread: 1.3, lean: 0.6 }) + fernClump(S, 1680, 1080, 360, { seed: 173, count: 6, spread: 1.3, lean: -0.6 }) +
      fernClump(S, 1680, -80, 300, { seed: 174, count: 5, spread: 1.2, lean: -2.3 }) + bramble(S, -40, 520, 120, -120, { seed: 175, w: 14, len: 220, canes: 5 }), { filter: S.shadow('m') });
    return { back: back, over: '', front: front };
  }

  function splash(S, sx, sy, k) {
    var r = rng(212), s = '', crown = 'M' + n(sx - 150 * k) + ' ' + n(sy);
    var tips = 9;
    for (var i = 0; i <= tips; i++) {
      var t = i / tips, x = sx - 150 * k + 300 * k * t, mid = 1 - Math.pow(2 * t - 1, 2);
      var ty = sy - (90 + 230 * mid + r() * 50) * k, tx = x + (t - 0.5) * 60 * k;
      crown += 'Q' + n(x - 12 * k) + ' ' + n(sy - (40 + 130 * mid) * k) + ' ' + n(tx) + ' ' + n(ty) + 'Q' + n(x + 14 * k) + ' ' + n(sy - (40 + 120 * mid) * k) + ' ' + n(x + 300 * k / tips * 0.5) + ' ' + n(sy - (30 + 90 * mid) * k);
    }
    crown += 'L' + n(sx + 150 * k) + ' ' + n(sy) + 'Z';
    s += path(crown, '#DCE8F6');
    s += path('M' + n(sx - 70 * k) + ' ' + n(sy) + 'C' + n(sx - 70 * k) + ' ' + n(sy - 200 * k) + ' ' + n(sx - 40 * k) + ' ' + n(sy - 330 * k) + ' ' + n(sx - 6 * k) + ' ' + n(sy - 360 * k) +
      'C' + n(sx + 30 * k) + ' ' + n(sy - 330 * k) + ' ' + n(sx + 70 * k) + ' ' + n(sy - 200 * k) + ' ' + n(sx + 74 * k) + ' ' + n(sy) + 'Z', '#EEF4FC');
    s += path(blob(sx - 8 * k, sy - 340 * k, 40 * k, 36 * k, 8, r, 0.3, 0.3) + blob(sx + 30 * k, sy - 260 * k, 36 * k, 40 * k, 8, r, 0.3, 0.3), '#FFFFFF', { opacity: 0.9 });
    s += path(blob(sx, sy - 110 * k, 80 * k, 100 * k, 10, r, 0.3, 0.3), '#F4F8FF', { opacity: 0.9 });
    s += path(blob(sx - 20 * k, sy - 40 * k, 120 * k, 50 * k, 10, r, 0.3, 0.3), '#FFFFFF', { opacity: 0.85 });
    var drops = '';
    for (i = 0; i < 46; i++) {
      var a = -Math.PI * (0.08 + r() * 0.84), d = (150 + r() * 170) * k;
      drops += dot(sx + Math.cos(a) * d * 1.15, sy - 140 * k + Math.sin(a) * d * 1.2, (2.5 + r() * 5) * k);
    }
    s += path(drops, '#EAF2FC', { opacity: 0.9 });
    var mist = ell(sx, sy - 120 * k, 260 * k, 180 * k, S.radB('mist', [[0, '#DCE8F6', 0.35], [1, '#DCE8F6', 0]]));
    return mist + g(s, { 'class': 'pcs-splash' }) +
      ell(sx, sy + 6 * k, 220 * k, 18 * k, '#E8F0FA', { opacity: 0.6 }) + ell(sx, sy + 22 * k, 320 * k, 26 * k, 'none', { stroke: '#C9D8EC', 'stroke-width': 3, opacity: 0.5 }) +
      ell(sx, sy + 38 * k, 430 * k, 34 * k, 'none', { stroke: '#C9D8EC', 'stroke-width': 2, opacity: 0.3 });
  }

  // ------------------------------------------------------------------ the sets table

  function A(x, y, h, face, more) {
    var a = { x: x, y: y, h: h, face: face || 'right' };
    if (more) for (var k in more) a[k] = more[k];
    return a;
  }

  var SETS = {
    room: {
      label: 'the room by the glass door', tod: 'sunset', draw: drawRoom,
      cams: { wide: { box: [0, 0, 1600] }, cushion: { box: [200, 352, 880] }, glass: { box: [720, 470, 560] }, outside: { box: [600, 250, 800] } },
      anchors: { main: { cushion: A(640, 850, 285), floor: A(380, 896, 320), glass: A(866, 824, 262), doorway: A(1262, 814, 262, 'left') } },
      opts: { door: ['closed', 'open'], reflection: [true, false], clan: [true, false] }, defaults: { door: 'closed' }
    },
    tower: {
      label: 'looking up the glass tower', tod: 'sunset', draw: drawTower,
      cams: {
        // on the balcony a cast member marked `lift: true` (Waffles flopped on her back, say) is
        // raised onto a pouf, so her face clears the rail; unmarked, a cat stays on the tiles behind
        // the rail (chapter 1's peer rests her chin on it)
        up: { box: [0, 0, 1600], comp: 'up' }, balcony: { box: [0, 0, 1600], comp: 'balcony', lift: { y: 720, gap: 10, seat: 24, ask: true } },
        // close on Waffles: framed on her head, face about a third of the panel; a cat whose chin
        // would sink behind the rail is raised onto a pouf, so the rail top shows below her chin
        'balcony-close': { box: [300, 380, 840], comp: 'balcony', head: { face: 0.42, at: [0.56, 0.38] }, lift: { y: 720, gap: 10, seat: 24 } }
      },
      anchors: {
        up: { window: A(700, 1000, 215, 'right', { z: 'behind' }), railing: A(0, 0, 84, 'left', { z: 'behind', elev: true, balcony: true }) },
        balcony: { railing: A(800, 905, 520, 'left', { z: 'behind' }) }
      },
      // chime: a wind chime on Waffles's balcony, hanging beside her geranium (chapter 3: CrystalClan
      // hears it every day, so "clear as a chime" points at something)
      opts: { chime: [true, false] }, defaults: {}
    },
    garden: {
      label: 'the garden at dusk', tod: 'sunset', draw: drawGarden,
      cams: {
        wide: { box: [0, 0, 1600] }, paws: { box: [540, 760, 260], follow: 0.95 }, step: { box: [0, 330, 860] }, fence: { box: [300, 330, 840] },
        lamp: { box: [985, 215, 240] }, meet: { box: [490, 400, 720] }, hedge: { box: [1100, 420, 500] },
        // close at the gap, framed on the first cast member's head (chapter 3, the kept path: her nod,
        // eyes down, the vole in her mouth, Tallyheart at the edge)
        'hedge-close': { box: [1150, 520, 400], head: { face: 0.3, at: [0.6, 0.42] } }
      },
      anchors: {
        main: {
          step: A(330, 846, 270), lawn: A(660, 846, 280), 'fence-foot': A(780, 678, 205, 'left'), 'lamp-top': A(1105, 281, 150, 'left', { elev: true }),
          'hedge-gap': A(1390, 718, 210), doorway: A(178, 778, 255),
          // on the lawn just left of the gap, in the hedge close-up too: a second cat at the hedge
          // (chapter 3, the kept path at sunset: Tallyheart in the gap, you with your vole); its height
          // is the lawn's own depth there, so a spot of its own ({ x, y }) sizes exactly as before
          'hedge-side': A(1205, 726, 222.9)
        }
      },
      opts: { sparrows: 'number', lampSparrow: [true, false], dish: [true, false], moth: [true, false], towel: [true, false] }, defaults: { sparrows: 12 }
    },
    camp: {
      label: 'CrystalClan camp at last light', tod: 'golden', todMap: { sunset: 'golden' }, draw: drawCamp,
      cams: {
        reveal: { box: [0, 0, 1600] }, crowd: { box: [240, 280, 1120] }, fountain: { box: [0, 0, 1600], comp: 'fountain' }, entrance: { box: [0, 0, 1600], comp: 'entrance' },
        // head and shoulders of a cat sitting on the fountain top (size 1), sunlit towers behind
        'fountain-close': { box: [380, 138, 690], comp: 'fountain' },
        ferns: { box: [1080, 640, 520] }, purr: { box: [80, 100, 1440] }
      },
      anchors: {
        main: {
          entrance: A(270, 935, 300), 'fountain-top': A(800, 492, 190, 'left', { elev: true }), 'fountain-foot': A(520, 836, 240),
          'crowd-left': A(390, 784, 225), 'crowd-right': A(1215, 790, 225, 'left'), ferns: A(1400, 915, 280, 'left'), center: A(830, 912, 285)
        },
        fountain: { 'fountain-top': A(800, 598, 440, 'left', { elev: true }) },
        entrance: { entrance: A(800, 820, 500) }
      },
      // crowd: the whole Clan crowded round the fountain (the Warrior Counts, chapter 3): rows of cats
      // behind the cast, never in front of one or near a face; heads along the bottom from below the
      // fountain; more watching shadows from above
      opts: { puddles: [true, false], rainFountain: [true, false], crowd: [true, false] }, defaults: {}
    },
    hollow: {
      label: 'the Training Hollow', tod: 'golden', todMap: { sunset: 'golden' }, draw: drawHollow,
      cams: { wide: { box: [0, 0, 1600] }, lesson: { box: [380, 440, 760] }, sand: { box: [560, 740, 400] }, tree: { box: [1000, 430, 400] } },
      anchors: {
        main: {
          'sand-left': A(640, 892, 280), 'sand-right': A(930, 892, 280, 'left'), sunpatch: A(330, 846, 255), tree: A(1066, 868, 270),
          'sunpatch-2': A(140, 856, 258), 'sunpatch-3': A(500, 852, 256, 'left'),
          // on the far side of the old tree, the trunk between her and the rim: a teacher clearly
          // apart from the five cats she is counting (f019, f021)
          'tree-far': A(1440, 905, 284, 'left'),
          // five cats along the back rim of the hollow, drying in the sun (rim-5 at the right end, by the tree)
          'rim-1': A(490, 786, 223, 'left'), 'rim-2': A(635, 774, 216, 'left'), 'rim-3': A(780, 770, 214, 'left'),
          'rim-4': A(925, 774, 216, 'left'), 'rim-5': A(1070, 786, 223, 'left')
        }
      },
      // marks: one claw mark per Count (0-10, every table to ten times ten); glow: true, or a list of booleans, one per mark
      // ('auto' for both: the UI fills them in from the cat before drawing); depth: 0 fresh, 1 deeper,
      // 2 deepest, for every mark or a list, one per mark (left out or unfilled: every mark but the
      // newest is deeper, the oldest most, as practice deepens them)
      opts: { marks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'auto'], glow: [true, false, 'auto'], depth: [0, 1, 2, 'auto'] }, defaults: { marks: 0 }
    },
    den: {
      label: "the apprentices' den", tod: 'night', draw: drawDen,
      cams: {
        outside: { box: [0, 0, 1600], comp: 'outside' }, inside: { box: [0, 0, 1600], comp: 'inside' },
        nest: { box: [860, 690, 400], comp: 'inside' }, doorway: { box: [900, 500, 700], comp: 'inside' }
      },
      anchors: {
        outside: { 'entrance-left': A(540, 870, 270), 'entrance-right': A(1060, 870, 270, 'left'), doorway: A(800, 830, 250, 'left') },
        inside: {
          'entrance-left': A(1310, 898, 190), 'entrance-right': A(1476, 898, 190, 'left'), doorway: A(1392, 896, 250, 'left'),
          nest: A(1060, 892, 250), 'sleeper-1': A(330, 814, 245), 'sleeper-2': A(640, 856, 250, 'left')
        }
      },
      // stone: Riffle's lucky stone in her nest (true: between her paws; 'nose' or 'chin', where she
      // put it; 'auto' is the UI's to fill from her choice, and left unfilled is true)
      opts: { weather: ['clear', 'cloudy', 'storm'], moon: [false, true], drips: [true, false], stone: [false, true, 'nose', 'chin', 'auto'] }, defaults: { weather: 'clear' }
    },
    sky: {
      label: 'the Sky River', tod: 'night', draw: drawSky,
      cams: { up: { box: [160, 0, 1280] }, cats: { box: [0, 0, 1600] } },
      anchors: { main: { 'ground-left': A(680, 992, 290), 'ground-right': A(940, 992, 300, 'left') } },
      opts: {}, defaults: {}
    },
    river: {
      label: 'the river in the storm', tod: 'storm', draw: drawRiver,
      cams: { crash: { box: [0, 0, 1600] } },
      anchors: { main: { bank: A(300, 1000, 260) } },
      opts: { splash: [true, false] }, defaults: {}
    },
    title: {
      label: 'the river at dusk', tod: 'sunset', draw: drawTitle,
      cams: { wide: { box: [0, 0, 1600] } },
      // wall-2: a second cat on the wall, left of the first
      anchors: { main: { wall: A(1180, 840, 255, 'left'), 'wall-2': A(900, 840, 255, 'left') } },
      opts: {}, defaults: {}
    }
  };
  var SET_ORDER = ['room', 'tower', 'garden', 'camp', 'hollow', 'den', 'sky', 'river', 'title'];
  var FX = ['sunset', 'dusk', 'night', 'stars', 'skyriver', 'rain', 'lightning', 'glow', 'purr', 'sparkle', 'zzz', 'motion', 'morning', 'day', 'bonk'];

  /* A set defined in its own file (app/art/sets/*.js, loaded after this one) joins the table here:
   * art.defineSet('bridge', { label, tod, draw, cams, anchors, opts, defaults, todMap?, todFixed? }),
   * the same shape as the entries above. Its draw(S) uses the painters in art.kit. */
  art.defineSet = function (id, def) {
    if (!id || !def || typeof def.draw !== 'function' || !def.cams || !def.anchors) throw new Error('defineSet: bad set ' + id);
    def.opts = def.opts || {};
    def.defaults = def.defaults || {};
    SETS[id] = def;
    if (SET_ORDER.indexOf(id) < 0) SET_ORDER.push(id);
    refreshVocab();
    return def;
  };
  /* An effect name a set file adds (drawn by that set itself from S.fx). */
  art.defineFx = function (name) { if (FX.indexOf(name) < 0) FX.push(name); refreshVocab(); };

  function camList(set) { return Object.keys(set.cams); }
  function compOf(set, camId) { return set.cams[camId].comp || 'main'; }

  // ------------------------------------------------------------------ cast

  function anchorsFor(S) {
    var set = SETS[S.set], base = set.anchors[S.comp] || {}, out = {};
    for (var k in base) {
      var a = base[k];
      if (a.balcony && S.balconySpot) a = A(S.balconySpot.x, S.balconySpot.y, a.h, a.face, { z: a.z, elev: true });
      out[k] = a;
    }
    return out;
  }

  // Height of a sitting cat at a ground point y, from this composition's ground anchors.
  function depthAt(S, y) {
    var A0 = S.anchorMap, xs = [], ys = [];
    for (var k in A0) if (!A0[k].elev && A0[k].z !== 'behind') { xs.push(A0[k].y); ys.push(A0[k].h); }
    if (xs.length === 0) return 220;
    if (xs.length === 1) return ys[0] * clamp(y / xs[0], 0.3, 2);
    var mx = 0, my = 0;
    for (var i = 0; i < xs.length; i++) { mx += xs[i]; my += ys[i]; }
    mx /= xs.length; my /= xs.length;
    var num = 0, den = 0;
    for (i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) * (xs[i] - mx); }
    var b = den ? num / den : 0;
    return clamp(my + b * (y - mx), 30, 600);
  }

  function resolveAnchor(S, m, used) {
    var at = m ? m.at : null;
    if (at && typeof at === 'object') {
      var x = +at.x, y = +at.y;
      if (!isFinite(x) || !isFinite(y)) return null;
      var h = at.h > 0 ? +at.h : depthAt(S, y) * (at.scale > 0 ? +at.scale : 1);
      return A(x, y, h, at.facing || 'right', { z: at.z, elev: !!at.elev });
    }
    if (typeof at === 'string') {
      if (S.anchorMap[at]) return S.anchorMap[at];
      var set = SETS[S.set];
      for (var c in set.anchors) if (set.anchors[c][at]) return null;   // that spot is out of this camera's sight
    }
    // no spot given (or an unknown one): take the first free anchor here
    for (var k in S.anchorMap) if (!used[k] && !S.anchorMap[k].elev) { used[k] = true; return S.anchorMap[k]; }
    for (k in S.anchorMap) return S.anchorMap[k];
    return null;
  }

  // How a cast member stands at spot `a`: who, drawing options, scale, facing and feet (world units).
  function castPlan(S, m, a, R) {
    var who = m.who || 'clancat', co = charOpts(S, who, m);
    var s = a.h / R * (m.size > 0 ? +m.size : 1), face = m.facing || a.face || 'right', ay = a.y;
    if (who === 'moth' && !a.elev) ay = a.y - a.h * 0.55;
    if (who === 'tallone' && S.box) {
      var th = getChar(who, co).h;
      s = Math.max(s, (a.y - S.box.y + S.box.h * 0.04) / th);
    }
    var pl = { who: who, co: co, s: s, face: face, x: a.x, y: ay, lift: 0 };
    liftPlan(S, pl, m);
    return pl;
  }
  function planChar(pl) {
    var oo = {}, k;
    for (k in pl.co) oo[k] = pl.co[k];
    oo.facing = pl.face || 'right';
    return getChar(pl.who, oo);
  }
  // A planned cast member's head box and whole-body box in world units, as [x0, y0, x1, y1].
  // cats.js reports both; for anything else they are estimated from the drawing's size.
  function castBoxes(pl, ch) {
    ch = ch || planChar(pl);
    var s = pl.s, flip = ch.placeholder ? (pl.face || 'right') !== drawnFacing() : false, sx = flip ? -s : s;
    var hb = ch.headBox || { x0: ch.head.x - ch.w * 0.2, y0: ch.head.y - ch.h * 0.18, x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 };
    var bb = ch.bounds || { x0: 0, y0: 0, x1: ch.w, y1: ch.h };
    function w(b) {
      var xa = pl.x + (b.x0 - ch.w / 2) * sx, xb = pl.x + (b.x1 - ch.w / 2) * sx;
      return [Math.min(xa, xb), pl.y + (b.y0 - ch.h) * s, Math.max(xa, xb), pl.y + (b.y1 - ch.h) * s];
    }
    return { head: w(hb), body: w(bb), cat: !!ch.headBox };
  }
  // A camera with `lift` ({ y, gap }) raises any cat whose chin would fall below y - gap, so a face
  // never sits behind the balcony rail; a cat raised by `seat` or more sits on a pouf. With `ask`,
  // only a cast member marked `lift: true` is raised.
  function liftPlan(S, pl, m) {
    var L = S.camDef && S.camDef.lift;
    if (!L || !CAT_IDS[pl.who] || (L.ask && !(m && m.lift === true))) return;
    var hb = castBoxes(pl).head, over = hb[3] - (L.y - L.gap);
    if (over > 0) { pl.y -= over; pl.lift = over; }
  }
  // (`murmurchime`: the tortie named, chapter 3, if cats.js gives her a cast id of her own)
  var CAT_IDS = { player: 1, tallyheart: 1, glintstar: 1, waffles: 1, grizzled: 1, snorer: 1, mutterer: 1, murmurchime: 1, snorter: 1, clancat: 1 };
  // Bigger than a cat (Sprinkle, heron-sized): drawn in the cats' units like everyone (cats.js gives
  // her a box bigger than a cat's, so a cat's anchor fits her), her face's r from her head box as the
  // otters' and dogs' are, and her shadow under her body rather than her whole box.
  var BIG = { sprinkle: 1 };
  // A face's size, for balloon tails and for keeping the lettering off it: its radius in percent of
  // the panel width (a head's `r`). A cat's is a fifth of its 200 box (chapter 1's measure, which the
  // UI used to estimate from the markup); anything else with a head box (Riffle, the otters, the
  // dogs) gets the same share of its head box as a sitting cat's face has of its own. The sparrow,
  // the moth, the Tall One and placeholder drawings report none (the UI knows their sizes).
  var faceCal = { fn: undefined, k: 0 };
  function faceShare() {
    var fn = art.character;
    if (faceCal.fn === fn) return faceCal.k;
    var c = getChar('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }), hb = c.headBox;
    faceCal = { fn: fn, k: hb && !c.placeholder ? 0.2 * c.h / ((hb.x1 - hb.x0 + hb.y1 - hb.y0) / 2) : 0 };
    return faceCal.k;
  }
  function faceR(S, who, ch, s) {
    if (!ch || ch.placeholder) return null;
    var world = null, hb = ch.headBox;
    if (CAT_IDS[who]) world = 0.2 * ch.h * s;
    else if (hb && faceShare()) world = faceShare() * ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 * s;
    return world != null && world > 0 && isFinite(world) ? world / S.box.w * 100 : null;
  }
  function seat(S, bb, top, floor) {
    var w = Math.max(60, (bb[2] - bb[0]) * 0.84), cx = (bb[0] + bb[2]) / 2, x0 = cx - w / 2, h = Math.max(20, floor - top);
    var buttons = '';
    for (var i = 0; i < 3; i++) buttons += dot(x0 + w * (0.25 + i * 0.25), top + 30 + Math.min(70, h * 0.3), 6);
    return rect(x0, top, w, h, '#E58FA8', { rx: 30 }) + rect(x0, top, w, h, 'none', { rx: 30, stroke: '#B85A7A', 'stroke-width': 4 }) +
      ell(cx, top + 8, w / 2 - 6, 14, '#F7B7C6') + path(buttons, '#B85A7A', { opacity: 0.7 });
  }

  // The body boxes (world units, padded) of the cast members placed at a named spot, for
  // foreground props that must keep off them.
  function spotBoxes(S, spot, pad) {
    var out = [], R = refH(), a = S.anchorMap && S.anchorMap[spot];
    if (!a) return out;
    pad = pad == null ? 0.04 : pad;
    (S.cast || []).forEach(function (m) {
      if (!m || m.at !== spot) return;
      var b = castBoxes(castPlan(S, m, a, R)).body, px = (b[2] - b[0]) * pad, py = (b[3] - b[1]) * pad;
      out.push([b[0] - px, b[1] - py, b[2] + px, b[3] + py]);
    });
    return out;
  }

  function drawCast(S, cast) {
    var behind = '', front = '', heads = [], info = [], used = {}, covered = {}, R = refH(), overBehind = '', overFront = '';
    var tint = castTint(S);
    for (var i = 0; i < cast.length; i++) if (cast[i] && typeof cast[i].at === 'string') used[cast[i].at] = true;
    for (i = 0; i < cast.length; i++) {
      var m = cast[i] || {};
      var a = resolveAnchor(S, m, used);
      if (!a) { heads.push(null); info.push(null); continue; }
      var pl = castPlan(S, m, a, R), who = pl.who, co = pl.co, face = pl.face, ay = pl.y;
      var c = placeChar(S, who, co, a.x, ay, pl.s, face, tint ? { filter: tint } : null);
      var bx = castBoxes(pl, c.ch);
      var piece = '';
      // the pouf's top meets the body's lowest point: at the feet for a sitting cat, higher for a
      // loaf, and well above the feet line for one flopped on her back (the `fall` pose), who
      // would otherwise float over it
      var seated = pl.lift > 0 && pl.lift >= S.camDef.lift.seat, restY = seated ? Math.min(ay, bx.body[3]) : ay;
      if (seated) piece += g(seat(S, bx.body, restY - 6, a.y), tint ? { filter: tint } : null);
      if (BIG[who]) {
        // bigger than a cat, and her box is mostly neck, wings and tail: the shadow lies under her
        // body as drawn (none when only her eyes show in the dark)
        if (co.pose !== 'eyes') piece += ell((bx.body[0] + bx.body[2]) / 2, restY - 1, (bx.body[2] - bx.body[0]) * 0.42, Math.max(3.5, a.h * 0.06), S.pal.shade, { opacity: 0.28 });
      } else if (who !== 'moth' && !a.air && co.pose !== 'fall') piece += ell(a.x, restY - 1, c.w * 0.4, Math.max(2.5, a.h * 0.045), S.pal.shade, { opacity: 0.28 });
      // `holds: 'stone'` is drawn by cats.js with the cat (in her paws, or in the mouth on her feet),
      // which reports where it is (`held`, in its box): the sparkle effect twinkles on it
      piece += c.svg;
      var held = null;
      if (c.ch.held) {
        var hsx = c.ch.placeholder && (face || 'right') !== drawnFacing() ? -pl.s : pl.s;
        held = { what: c.ch.held.what, x: a.x + (c.ch.held.x - c.ch.w / 2) * hsx, y: ay + (c.ch.held.y - c.ch.h) * pl.s, r: c.ch.held.r * pl.s };
      }
      if (typeof m.at === 'string' && S.covers[m.at] && !covered[m.at]) { piece += S.covers[m.at]; covered[m.at] = true; }
      if (a.z === 'behind') behind += piece; else front += piece;
      if (c.over) { if (a.z === 'behind') overBehind += c.over; else overFront += c.over; }
      var px = (c.head[0] - S.box.x) / S.box.w * 100, py = (c.head[1] - S.box.y) / S.box.h * 100;
      var inside = px >= 0 && px <= 100 && py >= 0 && py <= 100;
      if (!inside && BIG[who]) {
        // a head that tops a cat's camera (Sprinkle at a cat's spot, her head well above everyone's):
        // when a good part of her face is still in the panel, the balloon points at what shows of it
        var hv = [Math.max(bx.head[0], S.box.x), Math.max(bx.head[1], S.box.y), Math.min(bx.head[2], S.box.x + S.box.w), Math.min(bx.head[3], S.box.y + S.box.h)];
        var full = (bx.head[2] - bx.head[0]) * (bx.head[3] - bx.head[1]);
        if (hv[2] > hv[0] && hv[3] > hv[1] && full > 0 && (hv[2] - hv[0]) * (hv[3] - hv[1]) >= full * 0.35) {
          px = ((hv[0] + hv[2]) / 2 - S.box.x) / S.box.w * 100; py = ((hv[1] + hv[3]) / 2 - S.box.y) / S.box.h * 100; inside = true;
        }
      }
      var hr = faceR(S, who, c.ch, pl.s);
      heads.push(inside ? (hr != null ? { x: Math.round(px * 10) / 10, y: Math.round(py * 10) / 10, r: Math.round(hr * 100) / 100 } : { x: Math.round(px * 10) / 10, y: Math.round(py * 10) / 10 }) : null);
      var toP = function (b) { return [(b[0] - S.box.x) / S.box.w * 1600, (b[1] - S.box.y) / S.box.h * 1000, (b[2] - S.box.x) / S.box.w * 1600, (b[3] - S.box.y) / S.box.h * 1000]; };
      info.push({ who: who, pose: co.pose, mood: co.mood, face: face, px: px * 16, py: py * 10, hp: c.h / S.box.h * 1000, wp: c.w / S.box.w * 1600, footY: (ay - S.box.y) / S.box.h * 1000, footX: (a.x - S.box.x) / S.box.w * 1600,
        hb: toP(bx.head), bb: toP(bx.body), purr: m.purr === true,
        held: held ? { what: held.what, x: (held.x - S.box.x) / S.box.w * 1600, y: (held.y - S.box.y) / S.box.h * 1000, r: held.r / S.box.w * 1600 } : null });
    }
    var spare = '';
    for (var k in S.covers) if (!covered[k]) spare += S.covers[k];
    return { behind: behind + overBehind, front: front + overFront, spare: spare, heads: heads, info: info };
  }

  // ------------------------------------------------------------------ effects (panel space: 1600 x 1000)

  function fxRain(S) {
    var r = rng(301), near = '', far = '';
    for (var i = 0; i < 9; i++) { var x = 22 + r() * 96, y = r() * 330; near += 'M' + n(x) + ' ' + n(y) + 'l-18 60'; }
    for (i = 0; i < 12; i++) { x = 16 + r() * 72, y = r() * 250; far += 'M' + n(x) + ' ' + n(y) + 'l-9 30'; }
    var pn = S.pattern('rain', 120, 400, stroke(near, '#D6E6F6', 2.6, { opacity: 0.75 }));
    var pf = S.pattern('rain2', 90, 300, stroke(far, '#C3D4EA', 1.6, { opacity: 0.6 }));
    return g(rect(-400, -800, 2400, 2200, pf), { 'class': 'pcs-rain2' }) + g(rect(-400, -800, 2400, 2200, pn), { 'class': 'pcs-rain' }) +
      rect(0, 0, 1600, 1000, '#26334A', { opacity: 0.12 });
  }

  function fxFlash(S) { return rect(-10, -10, 1620, 1020, '#EEF4FF', { opacity: 0, 'class': 'pcs-flash' }); }

  function fxGlow(S) {
    var r = rng(311), s = ell(800, 470, 820, 560, S.radB('fxglow', [[0, '#FFE9AE', 0.5], [0.55, '#FFD98A', 0.18], [1, '#FFD98A', 0]]), { style: 'mix-blend-mode:screen' });
    for (var i = 0; i < 16; i++) {
      s += g(circ(150 + r() * 1300, 300 + r() * 650, 4 + r() * 5, '#FFF3C4', { opacity: 0.9 }), { 'class': 'pcs-float', style: 'animation-delay:-' + (r() * 6).toFixed(1) + 's;animation-duration:' + (5 + r() * 3).toFixed(1) + 's' });
    }
    return s;
  }

  function waves(x, y, w, amp, count, gap) {
    var d = '';
    for (var j = 0; j < count; j++) {
      var yy = y + j * gap, k = 4;
      d += 'M' + n(x - w / 2) + ' ' + n(yy);
      for (var i = 0; i < k; i++) d += 'q' + n(w / k / 4) + ' ' + n(-amp) + ' ' + n(w / k / 2) + ' 0t' + n(w / k / 2) + ' 0';
    }
    return d;
  }

  // Purring. Cast members marked `purr: true` purr alone: rings ripple out from each of them, sound
  // arcs ring them and 'purrr' floats behind them, and nobody else in the panel purrs (Riffle, who
  // has never heard a purr, stays quiet). With nobody marked, it is chapter 1's whole-camp purr:
  // every cast member purrs, fixed spots stand in for cats out of shot, and the rings fill the camp.
  // The whole-camp purr's rings (nobody marked purr: chapter 1's camp, the naming's wide panel): soft
  // rings rippling out through the camp, in panel units like the rest of the fx, but drawn behind
  // everyone, the crowd and the cast, so they never run across a face (in a close camera one ring is
  // a single line across the panel). A set with a crowd puts them under it; otherwise they go just
  // over the set's back layer. Once a panel.
  function purrRings(S) {
    if (S.purrRingsDone || !S.fx || !S.fx.purr || (S.cast || []).some(function (c) { return c && c.purr; })) return '';
    S.purrRingsDone = true;
    var s = '', kx = S.box.w / WORLD_W;
    for (var i = 0; i < 3; i++) s += ell(800, 700, 560, 190, 'none', { stroke: '#FFF1C8', 'stroke-width': 4, opacity: 0.45, 'class': 'pcs-ring', style: 'animation-delay:-' + (i * 1.2).toFixed(1) + 's' });
    return g(s, { transform: 'translate(' + n(S.box.x) + ' ' + n(S.box.y) + ') scale(' + n4(kx) + ')', 'class': 'pcs-fx-under' });
  }
  function fxPurr(S, info) {
    var s = '', r = rng(321), col = '#FFF1C8', srcs = [], i, marked = [];
    for (i = 0; i < info.length; i++) if (info[i] && info[i].purr) marked.push(info[i]);
    var who = marked.length ? marked : info.filter(function (c) { return c; });
    var words = [], sides = [];
    if (!marked.length) for (i = 0; i < who.length; i++) srcs.push([who[i].footX, who[i].footY - who[i].hp * 0.42, Math.max(60, who[i].wp * 0.5), Math.max(50, who[i].hp)]);
    // a marked purrer's arcs hug her own body (its box, not the drawing's whole square), and a side
    // with someone else beside it (Riffle, leaning in to listen) keeps its arcs to itself: they never
    // cross a friend's face or body
    for (i = 0; i < marked.length; i++) {
      var mb = marked[i].bb || [marked[i].footX - marked[i].wp / 4, marked[i].footY - marked[i].hp * 0.8, marked[i].footX + marked[i].wp / 4, marked[i].footY];
      var mk = clamp(marked[i].hp / 260, 0.5, 1.6), mh = Math.max(40, (mb[2] - mb[0]) * 0.5 + 6), reach = mh + 3 * 16 * mk + 6;
      var mcx = (mb[0] + mb[2]) / 2, mcy = mb[1] + (mb[3] - mb[1]) * 0.55, span = reach * Math.sin(0.55) + 6;
      var free = [-1, 1].map(function (side) {
        return !info.some(function (o) {
          if (!o || o === marked[i] || o.purr) return false;
          return [o.hb, o.bb].some(function (b) {
            if (!b) return false;
            var x0 = side > 0 ? mcx + mh * 0.6 : mcx - reach, x1 = side > 0 ? mcx + reach : mcx - mh * 0.6;
            return b[0] < x1 && b[2] > x0 && b[1] < mcy + span && b[3] > mcy - span;
          });
        });
      });
      srcs.push([mcx, mcy, mh, Math.max(50, marked[i].hp)]);
      sides.push(free);
    }
    if (marked.length) {
      // rings from each purring cat's middle, and two 'purrr's behind it (away from the way it faces)
      for (i = 0; i < marked.length; i++) {
        var c = marked[i], b = c.bb || [c.footX - c.wp / 2, c.footY - c.hp, c.footX + c.wp / 2, c.footY];
        var cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, rx = Math.max(90, Math.max(b[2] - b[0], b[3] - b[1]) * 0.62), back = c.face === 'left' ? 1 : -1;
        for (var q = 0; q < 3; q++) s += ell(cx, cy, rx, rx * 0.6, 'none', { stroke: col, 'stroke-width': 4, opacity: 0.45, 'class': 'pcs-ring', style: 'animation-delay:-' + (q * 1.2).toFixed(1) + 's' });
        // a 'purrr' is about 110 wide at size 1: one beside its back when there is room there, and
        // one over its head, leaning back, so neither covers its face or a friend's
        var ws = clamp(c.hp / 260, 0.6, 1.5), half = 60 * ws, room = back < 0 ? b[0] : 1600 - b[2];
        var h = c.hb || b, hx = (h[0] + h[2]) / 2;
        if (room >= half * 2 + 10) words.push([(back < 0 ? b[0] : b[2]) + back * (half + 8), clamp(cy, 60, 960), back * 8, ws]);
        words.push([clamp(hx + back * half, half + 4, 1596 - half), Math.max(50 * ws, h[1] - 14 * ws), -back * 6, ws * 0.9]);
      }
    } else {
      var fixed = [[300, 660, 90, 120], [1280, 670, 90, 120], [800, 600, 80, 110]];
      for (i = 0; i < fixed.length && srcs.length < 3; i++) srcs.push(fixed[i]);
      // the soft rings rippling out through the whole camp are drawn behind everyone (purrRings);
      // the three words keep off every face: a word over a head lifts to just above it
      words = [[230, 470, -8, 1], [1290, 500, 7, 1], [800, 330, 0, 1]].map(function (w) {
        for (var t = 0; t < 3; t++) {
          var ws = w[3], box = [w[0] - 60 * ws, w[1] - 40 * ws, w[0] + 60 * ws, w[1] + 8 * ws], hit = null;
          for (var j = 0; j < info.length && !hit; j++) {
            var hb = info[j] && info[j].hb;
            if (hb && box[0] < hb[2] && box[2] > hb[0] && box[1] < hb[3] && box[3] > hb[1]) hit = hb;
          }
          if (!hit) break;
          w = [w[0], Math.max(46 * ws, hit[1] - 24), w[2], ws];
        }
        return w;
      });
    }
    // little sound arcs on both sides of every purring cat
    for (i = 0; i < srcs.length; i++) {
      var x = srcs[i][0], y = srcs[i][1], half = srcs[i][2], k = clamp(srcs[i][3] / 260, 0.5, 1.6), arcs = '', sd = sides[i] || [true, true];
      for (var j = 1; j <= 3; j++) {
        var R = half + j * 16 * k, a = 0.55;
        if (sd[1]) arcs += 'M' + n(x + Math.cos(-a) * R) + ' ' + n(y + Math.sin(-a) * R) + 'A' + n(R) + ' ' + n(R) + ' 0 0 1 ' + n(x + Math.cos(a) * R) + ' ' + n(y + Math.sin(a) * R);
        if (sd[0]) arcs += 'M' + n(x - Math.cos(-a) * R) + ' ' + n(y + Math.sin(-a) * R) + 'A' + n(R) + ' ' + n(R) + ' 0 0 0 ' + n(x - Math.cos(a) * R) + ' ' + n(y + Math.sin(a) * R);
      }
      if (!arcs) continue;
      s += g(stroke(arcs, '#7A4E2A', 6 * k, { opacity: 0.18 }) + stroke(arcs, col, 3.5 * k, { opacity: 0.9 }), { 'class': 'pcs-purr', style: 'animation-delay:-' + (r() * 2.4).toFixed(1) + 's' });
    }
    for (i = 0; i < words.length; i++) {
      var w = words[i];
      s += g('<text x="' + n(w[0]) + '" y="' + n(w[1]) + '" text-anchor="middle" font-family="&quot;Comic Neue&quot;, &quot;Chalkboard SE&quot;, &quot;Comic Sans MS&quot;, sans-serif" font-size="' + n(46 * w[3]) + '" font-style="italic" font-weight="700" fill="' + col +
        '" stroke="#7A4E2A" stroke-width="3" stroke-opacity=".35" paint-order="stroke" transform="rotate(' + w[2] + ' ' + n(w[0]) + ' ' + n(w[1]) + ')">purrr</text>',
        { 'class': 'pcs-purr', style: 'animation-delay:-' + (i * 0.8).toFixed(1) + 's' });
    }
    return s;
  }

  // The Sky River: a glowing band of light packed with tiny stars, rising left to right.

  // Sparkles. When someone holds Riffle's stone (f075: he has just set it in her paws), or Sprinkle
  // her pebble, they twinkle on the stone itself: one on its white band, two small ones beside it.
  // A vole or a fish held in a mouth never sparkles. Otherwise they scatter round the first cast member.
  var SPARKLY = { stone: 1, pebble: 1 };
  function fxSparkle(S, info) {
    var r = rng(331), s = '', cx = 800, cy = 450, i;
    var held = info.filter(function (c) { return c && c.held && (c.held.what == null || SPARKLY[c.held.what]); }).map(function (c) { return c.held; });
    if (held.length) {
      held.forEach(function (h, j) {
        var rr = Math.max(6, h.r);
        [[0.05, -0.15, 1.15, 0], [1.6, -1.25, 0.6, 0.9], [-1.5, -0.9, 0.45, 1.7]].forEach(function (t) {
          s += g(path(sparkleD(0, 0, rr * t[2]), t[2] > 1 ? '#FFF8D8' : '#FFE08A', { 'class': 'pcs-tw', style: 'animation-delay:-' + (t[3] + j * 0.4).toFixed(1) + 's' }), { transform: tr(h.x + rr * t[0], h.y + rr * t[1]) });
        });
      });
      return s;
    }
    for (i = 0; i < info.length; i++) if (info[i]) { cx = info[i].px; cy = info[i].py; break; }
    for (i = 0; i < 18; i++) {
      var a = r() * Math.PI * 2, d = 120 + r() * 520, x = clamp(cx + Math.cos(a) * d * 1.3, 40, 1560), y = clamp(cy + Math.sin(a) * d * 0.8, 40, 960), rr = 10 + r() * 22;
      s += g(path(sparkleD(0, 0, rr), i % 3 ? '#FFF6D8' : '#FFE08A', { 'class': 'pcs-tw', style: 'animation-delay:-' + (r() * 3).toFixed(1) + 's' }), { transform: tr(x, y) });
    }
    return s;
  }

  function fxZzz(S, info) {
    var who = [], i;
    for (i = 0; i < info.length; i++) if (info[i] && info[i].mood === 'sleepy') who.push(info[i]);
    if (!who.length) for (i = 0; i < info.length; i++) if (info[i] && { curl: 1, lie: 1, loaf: 1 }[info[i].pose] && info[i].mood !== 'scared' && info[i].mood !== 'worried') who.push(info[i]);
    var spots = who.length ? who.map(function (c) { return [c.px, c.py, c.face, c.hp]; }) : [[800, 380, 'right', 200]];
    var s = '';
    for (i = 0; i < spots.length; i++) {
      var x = spots[i][0], y = spots[i][1], dir = spots[i][2] === 'left' ? -1 : 1, k = clamp(spots[i][3] / 220, 0.6, 1.8);
      var letters = [['z', 0, 0, 34], ['Z', 26, -38, 46], ['Z', 56, -86, 60]];
      for (var j = 0; j < 3; j++) {
        var L = letters[j];
        s += g('<text x="' + n(x + dir * (20 + L[1]) * k) + '" y="' + n(y - 30 * k + L[2] * k) + '" font-family="Bangers, &quot;Marker Felt&quot;, Impact, sans-serif" font-size="' + n(L[3] * k) +
          '" fill="#EAF0FF" stroke="#1C2440" stroke-width="' + n(3 * k) + '" paint-order="stroke" text-anchor="middle">' + L[0] + '</text>',
          { 'class': 'pcs-z', style: 'animation-delay:-' + (j * 0.9 + i * 0.4).toFixed(1) + 's' });
      }
    }
    return s;
  }

  // A bonk: a smooth grey pebble bouncing off the first cast member's head, two little motion ticks
  // and three stars circling the bump (Riffle's slippery pebble). Nobody in the panel: mid-panel.
  // Bonking Riffle himself, it is his own fifth juggling pebble (chapter 3): plain, round and brown,
  // as the bridge set draws it rolling back out of the dark.
  var BONK_PEBBLE = { grey: ['#A39E96', '#5F5A55', '#D9D5CE'], fifth: ['#93704F', '#5D4331', '#C8A27D'] };
  function fxBonk(S, info) {
    var c = null, i;
    for (i = 0; i < info.length; i++) if (info[i]) { c = info[i]; break; }
    var hb = c && c.hb ? c.hb : [740, 330, 860, 450], hw = Math.max(40, hb[2] - hb[0]), cx = (hb[0] + hb[2]) / 2, top = hb[1];
    var k = clamp(hw / 130, 0.5, 2.4), back = c && c.face === 'left' ? 1 : -1, pc = BONK_PEBBLE[c && c.who === 'riffle' ? 'fifth' : 'grey'];
    // the pebble, bouncing up and away behind the head
    var px = clamp(cx + back * hw * 0.32, 30, 1570), py = Math.max(24 * k, top - 40 * k), s = '';
    s += g(ell(0, 0, 18 * k, 12 * k, pc[0], { stroke: pc[1], 'stroke-width': n(2.5 * k) }) + ell(-5 * k, -4 * k, 8 * k, 4 * k, pc[2], { opacity: 0.9 }),
      { transform: 'translate(' + n(px) + ' ' + n(py) + ') rotate(' + (back * 18) + ')' });
    // motion ticks: the path it took off the top of the head
    var tk = 'M' + n(cx - back * 6 * k) + ' ' + n(top + 2 * k) + 'Q' + n((cx + px) / 2) + ' ' + n(top - 26 * k) + ' ' + n(px - back * 16 * k) + ' ' + n(py + 12 * k) +
      'M' + n(cx + back * 10 * k) + ' ' + n(top + 6 * k) + 'Q' + n((cx + px) / 2 + back * 14 * k) + ' ' + n(top - 14 * k) + ' ' + n(px - back * 4 * k) + ' ' + n(py + 18 * k);
    s += stroke(tk, '#FFFFFF', 4 * k, { opacity: 0.85, 'stroke-dasharray': n(10 * k) + ' ' + n(7 * k) });
    // three little stars circling the bump
    for (i = 0; i < 3; i++) {
      var a = Math.PI * (1.1 + i * 0.4), sx = cx + Math.cos(a) * hw * 0.55, sy = top + 6 * k + Math.sin(a) * 18 * k, d = '';
      for (var j = 0; j < 10; j++) {
        var rr = (j % 2 ? 0.45 : 1) * 13 * k, an = -Math.PI / 2 + j * Math.PI / 5;
        d += (j ? 'L' : 'M') + n(sx + Math.cos(an) * rr) + ' ' + n(sy + Math.sin(an) * rr);
      }
      s += path(d + 'Z', '#FFE27A', { stroke: '#7A4E2A', 'stroke-width': n(2 * k), 'stroke-linejoin': 'round', 'class': 'pcs-tw', style: 'animation-delay:-' + (i * 0.9).toFixed(1) + 's' });
    }
    return s;
  }

  function fxMotion(S, info) {
    var c = null, i;
    for (i = 0; i < info.length; i++) if (info[i]) { c = info[i]; break; }
    var s = '', r = rng(341);
    function streak(x0, y, len, th, dir) {
      return path('M' + n(x0) + ' ' + n(y - th / 2) + 'L' + n(x0 + dir * len) + ' ' + n(y) + 'L' + n(x0) + ' ' + n(y + th / 2) + 'Z', '#FFFFFF');
    }
    if (!c) {
      for (i = 0; i < 8; i++) s += g(streak(-10, 140 + i * 100 + r() * 40, 220 + r() * 300, 10, 1), { opacity: 0.6, 'class': 'pcs-whoosh', style: 'animation-delay:-' + (r()).toFixed(2) + 's' });
      return s;
    }
    var cx = c.footX, cy = c.footY - c.hp * 0.38;
    if (c.pose === 'fall') {
      // tumble arcs around the body, each pushed outward until it clears the face
      var R0 = Math.max(c.wp, c.hp) * 0.58, arcs = '', ex = R0, ey = R0 * 0.8, lw = Math.max(8, c.hp * 0.05);
      if (c.bb) {
        cx = (c.bb[0] + c.bb[2]) / 2; cy = (c.bb[1] + c.bb[3]) / 2;
        ex = (c.bb[2] - c.bb[0]) / 2 * 1.08 + 16; ey = (c.bb[3] - c.bb[1]) / 2 * 1.08 + 16;
      }
      var hb = c.hb, hm = hb ? Math.max(hb[2] - hb[0], hb[3] - hb[1]) * 0.1 + lw : 0;
      var arcAt = function (a, k) {
        var pts0 = [];
        for (var t = 0; t <= 1.0001; t += 0.1) { var an = (a[0] + (a[1] - a[0]) * t) * Math.PI / 180; pts0.push([cx + Math.cos(an) * ex * k, cy + Math.sin(an) * ey * k]); }
        return pts0;
      };
      var clear = function (list) {
        if (!hb) return true;
        for (var q = 0; q < list.length; q++) if (list[q][0] > hb[0] - hm && list[q][0] < hb[2] + hm && list[q][1] > hb[1] - hm && list[q][1] < hb[3] + hm) return false;
        return true;
      };
      [[200, 250], [290, 340], [20, 70], [110, 150]].forEach(function (a, j) {
        var k = 1 + (j % 2) * 0.12, P = arcAt(a, k);
        for (var tries = 0; tries < 12 && !clear(P); tries++) { k *= 1.08; P = arcAt(a, k); }
        if (!clear(P)) return;
        var a0 = a[0] * Math.PI / 180, a1 = a[1] * Math.PI / 180;
        arcs += 'M' + n(cx + Math.cos(a0) * ex * k) + ' ' + n(cy + Math.sin(a0) * ey * k) + 'A' + n(ex * k) + ' ' + n(ey * k) + ' 0 0 1 ' + n(cx + Math.cos(a1) * ex * k) + ' ' + n(cy + Math.sin(a1) * ey * k);
      });
      s += g(stroke(arcs, '#3A2A40', lw, { opacity: 0.25 }) + stroke(arcs, '#FFFFFF', Math.max(5, c.hp * 0.03)), { 'class': 'pcs-pulse' });
      return s;
    }
    var dir = c.face === 'left' ? 1 : -1, backX = cx + dir * c.wp * 0.38;
    for (i = 0; i < 6; i++) {
      var y = c.footY - c.hp * (0.15 + 0.7 * (i + r() * 0.6) / 6), len = c.wp * (0.3 + r() * 0.45), th = Math.max(6, c.hp * (0.025 + r() * 0.02));
      s += g(streak(backX + dir * (12 + r() * 30), y, len, th, dir), { opacity: (0.55 + r() * 0.35).toFixed(2), 'class': 'pcs-whoosh', style: 'animation-delay:-' + (r() * 0.5).toFixed(2) + 's' });
    }
    return s;
  }

  // ------------------------------------------------------------------ render

  function cameraBox(S, camDef, cast) {
    var b = camDef.box, x = b[0], y = b[1], w = b[2];
    if (camDef.follow && cast.length) {
      var a = resolveAnchor(S, cast[0], {});
      if (a) { w = clamp(a.h * camDef.follow, 160, 900); x = a.x - w / 2; y = a.y - w * TENTHS * 0.6; }   // feet at 60% down: paws and grass, no face
    }
    if (camDef.head && cast.length) {
      // a close-up framed on the first cast member's head: its head box is `face` of the panel
      // height, its centre at `at` (fractions of the panel)
      var ah = resolveAnchor(S, cast[0], {});
      if (ah && CAT_IDS[cast[0].who || 'clancat']) {
        var hb = castBoxes(castPlan(S, cast[0], ah, refH())).head, hh = Math.max(20, hb[3] - hb[1]);
        w = clamp(hh / camDef.head.face / TENTHS, 160, WORLD_W);
        x = (hb[0] + hb[2]) / 2 - w * camDef.head.at[0];
        y = (hb[1] + hb[3]) / 2 - w * TENTHS * camDef.head.at[1];
      }
    }
    var h = w * TENTHS;
    x = clamp(x, 0, WORLD_W - w); y = clamp(y, 0, WORLD_H - h);
    return { x: x, y: y, w: w, h: h };
  }

  art.render = function (scene, ctx) {
    scene = scene || {};
    ctx = ctx || {};
    var setId = Object.prototype.hasOwnProperty.call(SETS, scene.set) ? scene.set : 'title';
    var set = SETS[setId];
    var camId = Object.prototype.hasOwnProperty.call(set.cams, scene.cam) ? scene.cam : camList(set)[0];
    var camDef = set.cams[camId];
    var opts = {}, k;
    for (k in set.defaults) opts[k] = set.defaults[k];
    if (scene.opts && typeof scene.opts === 'object') for (k in scene.opts) opts[k] = scene.opts[k];
    var fx = {}, list = Array.isArray(scene.fx) ? scene.fx : [];
    for (var i = 0; i < list.length; i++) fx[list[i]] = true;
    var tod = fx.night ? 'night' : fx.dusk ? 'dusk' : fx.sunset ? 'sunset' : fx.morning ? 'morning' : fx.day ? 'day' : set.tod;
    if (set.todMap && set.todMap[tod]) tod = set.todMap[tod];
    if (set.todFixed) tod = set.todFixed;
    if (setId === 'den' && opts.weather === 'storm') tod = 'storm';
    if (setId === 'river' || setId === 'sky') tod = setId === 'river' ? 'storm' : 'night';
    var cast = Array.isArray(scene.cast) ? scene.cast.filter(function (c) { return c && typeof c === 'object'; }) : [];
    // the title screen's cat on the wall, when no cast is given
    var silhouetteCat = setId === 'title' && cast.length === 0 && opts.cat !== false;

    serial += 1;
    var S = makeCtx('pcs' + serial.toString(36) + (typeof ctx.uid === 'string' ? ctx.uid.replace(/[^A-Za-z0-9_-]/g, '') : ''));
    S.set = setId; S.cam = camId; S.camDef = camDef; S.comp = compOf(set, camId); S.opts = opts; S.fx = fx; S.tod = tod; S.pal = PAL[tod] || PAL.sunset;
    S.look = ctx.look || {}; S.cast = cast;
    S.anchorMap = (set.anchors[S.comp] || {});
    // a first camera box (anchors that depend on the drawing are fixed after it)
    S.box = cameraBox(S, camDef, cast);
    var layers = set.draw(S);
    S.anchorMap = anchorsFor(S);
    S.box = cameraBox(S, camDef, cast);
    var C = drawCast(S, cast);
    var castFront = C.front;
    if (silhouetteCat) {
      var wa = S.anchorMap.wall, R = refH();
      var sil = S.filter('titlecat', '<feFlood flood-color="#2A1F3D"/><feComposite in2="SourceAlpha" operator="in" result="s"/>' +
        '<feOffset in="SourceAlpha" dx="-5" dy="4" result="off"/>' +
        '<feFlood flood-color="' + S.pal.rim + '"/><feComposite in2="SourceAlpha" operator="in" result="rf"/>' +
        '<feComposite in="rf" in2="off" operator="out" result="r"/>' +
        '<feMerge><feMergeNode in="s"/><feMergeNode in="r"/></feMerge>');
      castFront += placeChar(S, 'clancat', { pose: 'sit', mood: 'dreamy', variant: 1 }, wa.x, wa.y, wa.h / R, 'left', { filter: sil }).svg;
    }

    // effects drawn over the panel, in panel units
    var kx = S.box.w / WORLD_W, over = '', weather = '';
    if (fx.glow) over += fxGlow(S);
    if (fx.purr) over += fxPurr(S, C.info);
    if (fx.sparkle) over += fxSparkle(S, C.info);
    if (fx.zzz) over += fxZzz(S, C.info);
    if (fx.motion) over += fxMotion(S, C.info);
    if (fx.bonk) over += fxBonk(S, C.info);
    var rainy = fx.rain || tod === 'storm';
    if (rainy) weather += fxRain(S);
    if (fx.lightning) weather += fxFlash(S);
    var panelT = 'translate(' + n(S.box.x) + ' ' + n(S.box.y) + ') scale(' + n4(kx) + ')';
    var fxSvg = '';
    if (weather) {
      var wclip = setId === 'room' ? S.clip('glass', rect(ROOM.GX0, ROOM.GY0, ROOM.GX1 - ROOM.GX0, ROOM.GY1 - ROOM.GY0, '#fff')) : S.weatherClip;
      fxSvg += g(g(weather, { transform: panelT }), wclip ? { 'clip-path': wclip } : null);
    }
    if (over) fxSvg += g(over, { transform: panelT, 'class': 'pcs-fx' });

    var label = set.label + ', ' + camId;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + n(S.box.x) + ' ' + n(S.box.y) + ' ' + n(S.box.w) + ' ' + n(S.box.h) +
      '" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" class="pcs-panel pcs-set-' + setId + ' pcs-cam-' + camId +
      '" role="img" aria-label="' + esc(label) + '">' +
      '<defs>' + S.defs.join('') + '</defs>' +
      layers.back + purrRings(S) + C.spare + C.behind + (layers.over || '') + castFront + (layers.front || '') + fxSvg + '</svg>';
    // keep: areas the lettering should not cover (the claw marks), in percent of the panel
    var keep = [];
    (S.keep || []).forEach(function (k) {
      var x0 = Math.max(k.x, S.box.x), y0 = Math.max(k.y, S.box.y), x1 = Math.min(k.x + k.w, S.box.x + S.box.w), y1 = Math.min(k.y + k.h, S.box.y + S.box.h);
      if (x1 > x0 && y1 > y0) keep.push({ x: Math.round((x0 - S.box.x) / S.box.w * 1000) / 10, y: Math.round((y0 - S.box.y) / S.box.h * 1000) / 10, w: Math.round((x1 - x0) / S.box.w * 1000) / 10, h: Math.round((y1 - y0) / S.box.h * 1000) / 10 });
    });
    return { svg: svg, heads: C.heads, keep: keep };
  };

  // ------------------------------------------------------------------ CSS (the UI injects it once)

  art.css = [
    '.pcs-panel{display:block;overflow:hidden}',
    '.pcs-fx-under{pointer-events:none}',
    '@media (prefers-reduced-motion: no-preference){',
    '.pcs-twk{animation:pcs-twk 3.6s ease-in-out infinite}',
    '@keyframes pcs-twk{0%,100%{opacity:1}50%{opacity:.25}}',
    '.pcs-tw{animation:pcs-tw 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes pcs-tw{0%,100%{opacity:.25;transform:scale(.45) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(20deg)}}',
    '.pcs-rain{animation:pcs-rain .5s linear infinite}',
    '@keyframes pcs-rain{from{transform:translate(0,0)}to{transform:translate(-120px,400px)}}',
    '.pcs-rain2{animation:pcs-rain2 .8s linear infinite}',
    '@keyframes pcs-rain2{from{transform:translate(0,0)}to{transform:translate(-90px,300px)}}',
    '.pcs-flash{animation:pcs-flash 6s linear infinite}',
    '@keyframes pcs-flash{0%,6%,9.6%,11%,14%,100%{opacity:0}7%{opacity:.7}8.4%{opacity:.12}12%{opacity:.45}}',
    '.pcs-bolt{animation:pcs-bolt 6s linear infinite}',
    '@keyframes pcs-bolt{0%,5.8%,14%,100%{opacity:0}6.6%,12%{opacity:1}9%{opacity:.35}}',
    '.pcs-bolton{animation:pcs-bolton 6s linear infinite}',
    '@keyframes pcs-bolton{0%,5.8%,14%,100%{opacity:.75}6.6%,12%{opacity:1}9%{opacity:.4}}',
    '.pcs-blink{animation:pcs-blink 1.8s steps(1) infinite}',
    '@keyframes pcs-blink{0%,100%{opacity:1}50%{opacity:.15}}',
    '.pcs-drift{animation:pcs-drift 24s ease-in-out infinite alternate}',
    '@keyframes pcs-drift{from{transform:translate(0,0)}to{transform:translate(-60px,22px)}}',
    '.pcs-float{animation:pcs-float 6s ease-in-out infinite}',
    '@keyframes pcs-float{0%{transform:translate(0,0);opacity:0}20%{opacity:.95}100%{transform:translate(14px,-110px);opacity:0}}',
    '.pcs-purr{animation:pcs-purr 2.4s ease-in-out infinite}',
    '@keyframes pcs-purr{0%,100%{opacity:.3;transform:translate(-8px,0)}50%{opacity:1;transform:translate(8px,-4px)}}',
    '.pcs-ring{animation:pcs-ring 3.6s ease-out infinite;transform-box:fill-box;transform-origin:center}',
    '@keyframes pcs-ring{from{transform:scale(.35);opacity:.8}to{transform:scale(1.45);opacity:0}}',
    '.pcs-z{animation:pcs-z 2.7s ease-in-out infinite}',
    '@keyframes pcs-z{0%{opacity:0;transform:translate(0,12px)}25%{opacity:1}100%{opacity:0;transform:translate(16px,-44px)}}',
    '.pcs-whoosh{animation:pcs-whoosh .6s ease-in-out infinite alternate}',
    '@keyframes pcs-whoosh{from{transform:translate(0,0)}to{transform:translate(-14px,0)}}',
    '.pcs-speed{animation:pcs-speed .45s linear infinite}',
    '@keyframes pcs-speed{to{stroke-dashoffset:-120}}',
    '.pcs-sway{animation:pcs-sway 2.4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes pcs-sway{from{transform:skewX(-1.6deg)}to{transform:skewX(1.6deg)}}',
    '.pcs-flutter{animation:pcs-flutter .22s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}',
    '@keyframes pcs-flutter{to{transform:scaleY(.6)}}',
    '.pcs-hover{animation:pcs-hover 2.6s ease-in-out infinite alternate}',
    '@keyframes pcs-hover{from{transform:translate(0,0)}to{transform:translate(22px,-14px)}}',
    '.pcs-pulse{animation:pcs-pulse 2.6s ease-in-out infinite}',
    '@keyframes pcs-pulse{0%,100%{opacity:.55}50%{opacity:1}}',
    '.pcs-lamp{animation:pcs-lamp 4s ease-in-out infinite}',
    '@keyframes pcs-lamp{0%,100%{opacity:.85}50%{opacity:1}}',
    '.pcs-glint{animation:pcs-glint 3.2s ease-in-out infinite}',
    '@keyframes pcs-glint{0%,100%{opacity:.25}50%{opacity:.9}}',
    '.pcs-splash{animation:pcs-splash 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}',
    '@keyframes pcs-splash{0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,1.07)}}',
    '.pcs-chime{animation:pcs-chime 3.4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}',
    '@keyframes pcs-chime{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}',
    '.pcs-drip{animation:pcs-drip 2.4s ease-in infinite}',
    '@keyframes pcs-drip{0%{transform:translate(0,-30px);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translate(0,90px);opacity:0}}',
    '}'
  ].join('\n');

  // ------------------------------------------------------------------ vocabulary (docs/build.md, Art vocabulary)

  var vocab = art.vocab || (art.vocab = {});
  function refreshVocab() {
    vocab.sets = {};
    SET_ORDER.forEach(function (id) {
      var set = SETS[id], anchors = [], seen = {};
      for (var c in set.anchors) for (var k in set.anchors[c]) if (!seen[k]) { seen[k] = true; anchors.push(k); }
      vocab.sets[id] = { cams: camList(set), anchors: anchors, opts: JSON.parse(JSON.stringify(set.opts)) };
    });
    vocab.fx = FX.slice();
  }
  refreshVocab();

  /* The painters and helpers, for sets defined in their own files (art.defineSet). Everything here
   * works in the 1600 x 1000 world; S is the render context a set's draw(S) receives (S.pal is the
   * palette for the time of day, S.opts the set options, S.fx the effects, S.lin/linU/radB/radU/
   * clip/pattern/filter/blur/shadow make defs). */
  art.kit = {
    WORLD_W: WORLD_W, WORLD_H: WORLD_H, TENTHS: TENTHS, PAL: PAL,
    n: n, n4: n4, lerp: lerp, clamp: clamp, sgn: sgn, rng: rng, seedOf: seedOf, gauss: gauss, hexRgb: hexRgb, rgbHex: rgbHex, mix: mix, esc: esc,
    attrs: attrs, rect: rect, circ: circ, ell: ell, path: path, stroke: stroke, pts: pts, poly: poly, g: g, tr: tr, dot: dot,
    leafD: leafD, bladeD: bladeD, sparkleD: sparkleD, bez2: bez2, bez3: bez3, mound: mound, blob: blob, scallops: scallops, taper: taper,
    skyGrad: skyGrad, sky: sky, stars: stars, skyRiver: skyRiver, clouds: clouds, cloudBank: cloudBank, bolt: bolt, moon: moon,
    tower: tower, towers: towers, plane: plane, hedge: hedge, fence: fence, lampPost: lampPost, tufts: tufts, flowers: flowers,
    frond: frond, fernClump: fernClump, bramble: bramble, stonePath: stonePath, rose: rose, silhouettes: silhouettes,
    sparrowRow: sparrowRow, moth: moth, splash: splash, denMound: denMound, nest: nest, fountain: fountain, luckyStone: luckyStone,
    // the morning after the storm: puddles(S, [[cx, cy, rx, ry], …]), waterDrops(S, [[x, y, r, falling], …]),
    // dropD(x, y, r) (one drop's outline), sunSpots(S, [[cx, cy, rx, ry], …]), wetGlints(S, x0, x1, y0, y1, count, seed)
    puddles: puddles, waterDrops: waterDrops, dropD: dropD, sunSpots: sunSpots, wetGlints: wetGlints,
    anchor: A
  };

  // For the gallery and the tests: where each camera looks and where each anchor is.
  art.sceneInfo = function (setId) {
    var set = SETS[setId];
    if (!set) return null;
    var cams = {};
    camList(set).forEach(function (c) { var b = set.cams[c].box; cams[c] = { x: b[0], y: b[1], w: b[2], h: b[2] * TENTHS, comp: compOf(set, c), follow: !!set.cams[c].follow, head: !!set.cams[c].head }; });
    return { label: set.label, cams: cams, anchors: JSON.parse(JSON.stringify(set.anchors)), defaults: JSON.parse(JSON.stringify(set.defaults)) };
  };
  art.world = { w: WORLD_W, h: WORLD_H };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

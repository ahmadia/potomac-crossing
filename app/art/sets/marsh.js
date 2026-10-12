/* Potomac Crossing · app/art/sets/marsh.js
 *
 * The set: the marsh at Roaches Run (chapter 5, "The marsh", "The pale reed", "Twenty fish"), in
 * the afternoon. The river slides into still green water behind a low bank: reeds taller than a
 * cat, lily pads, mist low on the water, and the otters' raft lying against a mud flat with
 * shallow water over its edge, clear enough to show the bottom. The Roar's world is nowhere in
 * sight: no towers, no airplanes, no far shore but trees.
 *
 * ReedClan's mud is never stepped on (Tallyheart's rule): our cat is on the raft in every picture
 * (up Riffle's pole in one), and no anchor on the mud or in the reeds takes a cat. `shallows` is
 * the heron's, `reed` the pale dragonet's, and the three `log` spots are for three far ReedClan
 * cats, who are always behind the marsh's mist: small, and no face to read. Nobody but an otter
 * and a dragonet is ever in the water, and nothing is ever drawn as a shape under it.
 *
 * Among the pale reeds behind the heron, in every picture that shows them, one reed is Wisp: to be
 * found on a second look and never pointed at (she is never in `keep`, never glows, and nothing in
 * the picture leans toward her). The set draws her there itself, standing on one leg, as
 * app/art/cats.js draws her (`wisp`, the pose `reed`; in its own few pale lines when there is no
 * such drawing), with the pale reeds she hides in standing in front of her. `pale` says how much of
 * her they leave to see. When the cast has a `wisp` of its own the set draws none (there is only
 * ever one of her), and the reeds stay in front of her as `pale` says while her pose is still
 * `reed` or `flinch`; in any other pose she has been found, and they stand aside.
 *
 * Light: a still, warm afternoon by default (the `day` palette, the sun low and a warm haze over
 * the far trees); `fx` `sunset` (the `golden` palette: late light), `morning`, `dusk` and `night`
 * redraw it.
 *
 * Eight cameras, each its own composition in the 1600 x 1000 world (the chapter text's Art needs):
 *   main   `wide`   the raft at the left edge, the mud flat beside it, Patience in the shallows,
 *                   the reeds behind her; three cats on a log far across the water.
 *   far    `far`    across the water: three cats in a row on a log, small, in the mist; the raft's
 *                   corner in the foreground.
 *   heron  `heron`  Patience tall in the panel; our cat and Riffle low in the corner, on the logs.
 *   mud    `mud`    the mud beside the raft, from the raft: a line of tiny prints beside one great
 *                   heron print (`prints: true`); the heron in the shallows beyond, her bill over
 *                   it. The picture of the mud Tap and of its close-up, and of a climber's Tap on
 *                   the pole in Riffle's paws. Our cat's paw is held over one of the prints from
 *                   `raft-edge`: crouched on the front lip of the near log (`pose: 'crouch'` with
 *                   cats.js's `reach: true`), her forepaw out and down over the mud, touching
 *                   nothing; one tiny print lies right under it (the line of prints is laid so),
 *                   half the paw's size, with the paw's small shadow on it.
 *   pole   `pole`   from the top of Riffle's pole, over the reed tops: the prints running off
 *                   toward two shiny lines, far away. Only `pole-top` is in sight.
 *   reeds  `reeds`  the stand of reeds: one paler than the rest; then with knees; then two eyes.
 *   wisp   `wisp`   close: the pale dragonet on one leg among the reeds, the heron beside her.
 *   draw   `draw`   close on the mud at her foot: her drawings (`drawing`) and one pale claw down
 *                   in the mud (the set draws her forepaw: she herself is above the picture); the
 *                   raft, our cat and the heron small behind.
 *
 * Anchors: `raft-1` (our cat's place on the logs) and `raft-2` (Riffle's, on her right, at the
 * raft's mud end): every composition but `pole`. `raft-edge` (the front lip of the near log, over
 * the prints: `mud` only; the spot is where her held-out paw hangs, and her feet are on the lip
 * above it, so it is `air` and `elev` to app/art/scenes.js, and the set draws her shadow on the
 * log itself). `shallows` (the heron, standing in the water
 * beyond the mud, the water ringed round her leg): every composition but `pole`. `reed` (among the
 * pale reeds) and `pole-top` (the top of the planted pole; the pole is drawn whenever somebody is
 * up it): `wide`, `far`, `heron`, `reeds`, `wisp`; and `pole-top` alone in `pole`. `log-1` to
 * `log-3` (far across): `wide`, `far`, `heron`. A spot a camera does not show is out of its sight.
 *
 * Options (all optional; an unknown value is the default):
 *   prints: true        the tiny prints in a line across the mud, beside one great heron print
 *   fish: 'strings'     four strings of five fish laid across the logs, each string a reed looped
 *                       round the tails; eyes shut; nothing goes through a fish, no hook, no blood
 *         'spare'       three emptied strings and the fourth with two fish still on it
 *         'none'        (default)
 *   owed: 0-9           pairs of small silver fish in a thought cloud over the heron, in rows of
 *                       three filled in order (a new pair never moves the others; nine is three
 *                       rows of three); no number anywhere; 0 (default): no cloud. It is in `keep`.
 *   pole: 'planted'     Riffle's pole standing in the mud beside the raft, a twist of the raft's
 *                       vine round it, holding the raft still; and out on the water, where he
 *                       dived, a ring of ripples (she is alone on the logs, and the picture says
 *                       why that is safe). To show his head there, put him in the cast at the
 *                       spot PC.art.marshInfo()[composition].dive gives. 'none' (default): he has
 *                       it, in his paws (`holds: 'pole'`, cats.js's drawing) or, when his paws are
 *                       busy (hopping, sitting, flat on his back), lying along the raft's near log
 *                       at their feet: the set draws it there whenever it is neither planted, held,
 *                       nor climbed.
 *   dragonfly: 'beak'   asleep on the heron's bill (whoever is at `shallows`)
 *              'nose'   on our cat's nose (the `player` in the cast)
 *              'none'   (default). The set draws it, the same insect app/art/cats.js draws, and
 *                       leaves it to the cast when that cast member carries cats.js's own
 *                       `dragonfly: true` (which also crosses a cat's eyes to look at it).
 *   frogs: 'sit'        frogs sitting on their lily pads, eyes open (default)
 *          'jump'       every frog jumps in: frogs in the air, rings on the water
 *                       (the frogs are out on the water, behind the raft and whoever is on it or
 *                       swimming: they are drawn before the cast, never over anyone)
 *   pale: 'reed'        she is one of the reeds: they stand across all of her, a sheaf of plumes
 *                       where her face is, and she is thinner still behind them: a paler strip
 *                       among the stems, to be found on a second look (default)
 *         'flinch'      she jerks, once, among reeds that do not: a little of her face shows
 *         'knees'       the reeds have parted low down: her body, a leg, a knee; her face still in
 *                       the plumes
 *         'blink'       and now her face: two pale gold eyes, open
 *   snout: true         the tip of a blue-grey snout up between two of the raft's logs (Puddle
 *                       meets his sister); not drawn when the cast has a `puddle` of its own
 *   drawing: 'herons'   in the mud at her foot (the `draw` camera; small, in `wisp`): seven little
 *                       herons, four above three, each on one leg
 *            'fox'      a fox, something small with shine lines falling from its mouth, a ring of
 *                       ripples: the Case File card `wisp-fox`, stroke for stroke, once
 *                       app/art/cards.js has drawn it. 'none' (default)
 *   tap: 'mud' | 'pole' NOT in the text's list (the text asks for a `pc-tap` target on each, and a
 *                       scene has to say which frame is the Tap's, or the mark would be in every
 *                       frame of the picture: the page takes a `pc-tap` for the thing to touch on
 *                       Riffle's seven questions too): this frame's one-tap target, an unpainted
 *                       ellipse of class `pc-tap` named `data-tap="mud"` or `"pole"`. 'mud': the
 *                       patch of mud beside the raft (`wide`, `far`, `heron`, `mud`); 'pole': the
 *                       pole in Riffle's paws (`holds: 'pole'`: on it just over his head, where it
 *                       stands clear of him), or planted. The page lays its own soft glow on it; the
 *                       art draws none, so nothing ever glows in a frame that is not the Tap's.
 *                       The target also comes first in `keep`. 'none' (default).
 *                       Without it the page's star falls on the first `keep` area, which in the
 *                       `mud` camera, and wherever the heron's pose is `point`, is that patch of mud.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit. The fish
 * are PC.art.prey's (app/art/sets/pile.js): the Counts pictures' fish. PC.art.marshInfo() says
 * where each composition puts its things, for the tests and the gallery.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, n4 = K.n4, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke, pts = K.pts, poly = K.poly, g = K.g,
    tr = K.tr, dot = K.dot, mix = K.mix, lerp = K.lerp, clamp = K.clamp, rng = K.rng, blob = K.blob, mound = K.mound, leafD = K.leafD,
    bladeD = K.bladeD, A = K.anchor;

  // ------------------------------------------------------------------ colours from the palette

  // Puddle's and Wisp's scales, as app/art/cats.js draws them (tests/set-marsh.test.js checks they
  // still match his drawing and hers). Puddle: blue-grey, bluer and a shade darker than Sprinkle's
  // mist-grey, his snout paler. Wisp: pearl-white, thin enough to see the reeds through; her eyes
  // pale gold, the one solid thing about her.
  var PUDDLE = { base: '#8fa3b8', line: '#3f4d5e', light: '#b9c7d5', belly: '#d7e2ea', nostril: '#4a5868' };
  var WISP = { fill: '#f2efe4', line: '#868f86', shade: '#cbd1c5', eye: '#f7e29c', eyeLine: '#6f6650', pupil: '#3a2f22', claw: '#fdfbf3', clawLine: '#a5a191' };

  function colors(S) {
    var p = S.pal, dark = S.tod === 'night' || S.tod === 'storm', sk = p.sky, low = sk[sk.length - 1];
    var dim = dark ? 0.55 : S.tod === 'dusk' ? 0.24 : S.tod === 'sunset' ? 0.08 : 0;
    function d(c, t) { return mix(c, p.shade, dim * (t == null ? 1 : t)); }
    var green = mix('#5F9A6E', p.water, 0.22), deep = mix('#356A55', p.water, 0.18);
    return {
      dark: dark, dim: dim, low: low, d: d,
      haze: mix(p.haze, low, 0.5), warm: p.glow || '#FFE2A8',
      waterFar: mix(mix('#CFE2CF', low, 0.5), p.shade, dim * 0.7), waterMid: mix(mix('#93BD9C', low, 0.2), p.shade, dim * 0.7),
      water: d(green, 0.8), waterDeep: d(deep, 0.8), reflect: d(mix('#3F7354', p.leaf, 0.4), 0.8),
      glint: dark ? '#C9D6F0' : '#FFFDF0', ring: mix('#FFFFFF', p.water, dark ? 0.55 : 0.12),
      shallow: d(mix('#C9C58E', green, 0.42), 0.8), pebble: d('#7C6A4C'), pebbleLt: d('#E4D9B4'),
      mud: d(mix('#8A6B4A', p.sand, 0.1)), mudWet: d('#644A33'), mudDk: d('#46331F'), mudLt: d(mix('#B79872', p.rim, 0.2)), mudSheen: mix(low, '#FFFFFF', dark ? 0.1 : 0.5),
      reed: d(mix('#5C9440', p.leafMid, 0.3)), reedDk: d(mix('#35693A', p.leaf, 0.35)), reedLt: d(mix('#A3C766', p.leafLight, 0.3)),
      tail: d('#6A4630'), tailLt: d('#9A6C48'),
      straw: d('#CDBE84'), strawDk: d('#AC9C62'), strawLt: d('#E7DDB0'), plume: d('#EDE5C6'), plumeLt: d('#FBF7E4'),
      pad: d(mix('#5DA352', p.leafMid, 0.2)), padDk: d(mix('#2F7243', p.leaf, 0.3)), padLt: d(mix('#93CC72', p.leafLight, 0.3)),
      petal: d('#FFFDF6', 0.6), petalPink: d('#F7CADB', 0.6), petalShade: d('#E3D6DE', 0.6), stamen: d('#F2C04D', 0.5),
      frog: d('#6BB04A'), frogDk: d('#3C7A34'), frogLt: d('#A6D776'), frogBelly: d('#E2EDB2'),
      wood: p.wood, woodLt: p.woodLight, woodDk: p.woodDark, cut: mix(p.sand, p.woodLight, 0.4), vine: mix(p.leaf, p.woodDark, 0.25), vineLt: p.leafLight, leaf: p.leafMid,
      poleLt: mix(p.woodLight, p.sand, 0.35), pole: mix(p.wood, p.woodLight, 0.4), poleDk: mix(p.woodDark, p.wood, 0.35),
      far: mix(p.leafMid, mix(p.haze, low, 0.5), 0.62), farNear: mix(p.leaf, mix(p.haze, low, 0.5), 0.42),
      log: d(mix('#7A6652', p.haze, 0.3)), logDk: d(mix('#4E4034', p.haze, 0.2)),
      cloud: mix(low, '#FFFFFF', dark ? 0.12 : 0.75), cloudShade: mix(sk[Math.min(2, sk.length - 1)], '#FFFFFF', dark ? 0.04 : 0.35),
      mist: dark ? '#C4D0E6' : '#FFFFFF', mistOp: dark ? 0.5 : 1,
      think: d('#FFFAF0', 0.5), thinkIn: d('#E6F1F2', 0.5), thinkLine: '#6f5d8c',
      rail: mix('#FFFFFF', p.sun || p.rim, dark ? 0.6 : 0.15), bed: d(mix('#9A8E7C', p.haze, 0.35)), tie: d('#6E5A46'),
      groove: d('#3E2C1C'), grooveHi: mix('#D8BE94', p.rim, 0.2),
      shade: p.shade, rim: p.rim
    };
  }

  // ------------------------------------------------------------------ small geometry

  // A rounded closed shape through the midpoints of a polygon (the mud, the papercut land).
  function smooth(P) {
    var m = P.length, s = [(P[m - 1][0] + P[0][0]) / 2, (P[m - 1][1] + P[0][1]) / 2], d = 'M' + n(s[0]) + ' ' + n(s[1]);
    for (var i = 0; i < m; i++) {
      var c = P[i], e = P[(i + 1) % m];
      d += 'Q' + n(c[0]) + ' ' + n(c[1]) + ' ' + n((c[0] + e[0]) / 2) + ' ' + n((c[1] + e[1]) / 2);
    }
    return d + 'Z';
  }
  // A point on the polyline P at t (0..1 of its length), with the unit direction there.
  function alongLine(P, t) {
    var L = [], tot = 0, i;
    for (i = 1; i < P.length; i++) { var l = Math.sqrt(Math.pow(P[i][0] - P[i - 1][0], 2) + Math.pow(P[i][1] - P[i - 1][1], 2)); L.push(l); tot += l; }
    var want = clamp(t, 0, 1) * tot;
    for (i = 0; i < L.length; i++) {
      if (want <= L[i] || i === L.length - 1) {
        var u = L[i] ? want / L[i] : 0, a = P[i], b = P[i + 1], dx = (b[0] - a[0]) / (L[i] || 1), dy = (b[1] - a[1]) / (L[i] || 1);
        return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, dx: dx, dy: dy, len: tot };
      }
      want -= L[i];
    }
    return { x: P[0][0], y: P[0][1], dx: 1, dy: 0, len: tot };
  }
  function ellPts(cx, cy, rx, ry, a0, a1, k) {
    var P = [];
    for (var i = 0; i <= k; i++) { var a = lerp(a0, a1, i / k); P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return P;
  }
  function keep(S, x, y, w, h, first) {
    var q = { x: x, y: y, w: w, h: h };
    S.keep = S.keep || [];
    if (first) S.keep.unshift(q); else S.keep.push(q);
  }

  // ------------------------------------------------------------------ the cast, as scenes.js will place it

  // The height of a sitting cat in the drawings' own units (app/art/cats.js: 200).
  var cal = { fn: null, ref: 200 };
  function refH() {
    var fn = art.character;
    if (cal.fn === fn) return cal.ref;
    cal = { fn: fn, ref: 200 };
    if (typeof fn === 'function' && !fn.placeholder) {
      try { var c = fn('clancat', { pose: 'sit', mood: 'neutral', variant: 1 }); if (c && c.h > 0) cal.ref = c.h; } catch (e) { /* default */ }
    }
    return cal.ref;
  }
  // Does app/art/cats.js draw this character itself? (An id it does not know comes back as a Clan cat.)
  function drawn(who) {
    var v = art.vocab || {};
    return typeof art.character === 'function' && !art.character.placeholder && Array.isArray(v.cast) && v.cast.indexOf(who) >= 0;
  }
  function castOf(S, test) {
    var cast = S.cast || [];
    for (var i = 0; i < cast.length; i++) if (cast[i] && test(cast[i])) return cast[i];
    return null;
  }
  function castAt(S, spot) { return castOf(S, function (m) { return m.at === spot; }); }
  function castWho(S, who) { return castOf(S, function (m) { return m.who === who; }); }
  // Where a cast member stands: its anchor here, or a spot of its own ({ x, y }).
  function spotOf(S, m, AM, L) {
    if (!m) return null;
    if (typeof m.at === 'string') return AM[m.at] || null;
    if (m.at && typeof m.at === 'object' && isFinite(+m.at.x) && isFinite(+m.at.y)) {
      return { x: +m.at.x, y: +m.at.y, h: m.at.h > 0 ? +m.at.h : depthAt(L, +m.at.y) * (m.at.scale > 0 ? +m.at.scale : 1), face: m.at.facing || 'right' };
    }
    return null;
  }
  // The sizes app/art/scenes.js holds chapter 5's three to, whatever their boxes say (its
  // SIZE_BAND, measure for measure: tests/set-marsh.test.js checks the two still agree): each is
  // measured in one pose against another's sitting drawing and brought inside its band.
  var SIZE_BAND = {
    patience: { ref: 'tallyheart', pose: 'stand', by: 'tall', min: 1.4, max: 2.6 },
    puddle: { ref: 'sprinkle', pose: 'head', by: 'head', min: 0.88, max: 1.12 },
    wisp: { ref: 'sprinkle', pose: 'blink', by: 'head', min: 0.7, max: 0.94 }
  };
  var bandMemo = { fn: null, k: {} };
  function measure(who, pose, by) {
    var ch = art.character(who, { pose: pose, mood: 'neutral' });
    var hb = ch.headBox || { x0: ch.head.x - ch.w * 0.2, y0: Math.max(0, ch.head.y - ch.h * 0.18), x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 };
    return Math.max(1, by === 'head' ? ((hb.x1 - hb.x0) + (hb.y1 - hb.y0)) / 2 : ch.h - hb.y0);
  }
  function bandK(who) {
    var b = SIZE_BAND[who];
    if (!b || !drawn(who)) return 1;
    if (bandMemo.fn !== art.character) bandMemo = { fn: art.character, k: {} };
    if (bandMemo.k[who] == null) {
      try { var ratio = measure(who, b.pose, b.by) / measure(b.ref, 'sit', b.by); bandMemo.k[who] = clamp(ratio, b.min, b.max) / ratio; } catch (e) { bandMemo.k[who] = 1; }
    }
    return bandMemo.k[who];
  }
  // The drawing of a cast member and where its box lands in the world: X(u), Y(v) map its own
  // units; null when there is no drawing to ask.
  function figure(S, m, a) {
    var fn = art.character;
    if (!m || !a || typeof fn !== 'function' || fn.placeholder) return null;
    var who = m.who || 'clancat', face = m.facing || a.face || 'right', o = { pose: m.pose || 'sit', mood: m.mood || 'neutral', facing: face }, ch;
    if (m.variant != null) o.variant = m.variant;
    if (m.holds != null) o.holds = m.holds;
    if (m.reach != null) o.reach = m.reach;
    if (who === 'player') { o.look = S.look || {}; if (o.look.sex) o.sex = o.look.sex; }
    try { ch = fn(who, o); } catch (e) { return null; }
    if (!ch || !(ch.w > 0) || !(ch.h > 0)) return null;
    var k = a.h / refH() * (m.size > 0 ? +m.size : 1) * bandK(who);
    var out = { ch: ch, k: k, face: face, who: who, X: function (u) { return a.x + (u - ch.w / 2) * k; }, Y: function (v) { return a.y + (v - ch.h) * k; } };
    var hb = ch.headBox || (ch.head ? { x0: ch.head.x - ch.w * 0.2, y0: ch.head.y - ch.h * 0.18, x1: ch.head.x + ch.w * 0.2, y1: ch.head.y + ch.h * 0.18 } : null);
    if (hb) out.head = [out.X(hb.x0), out.Y(hb.y0), out.X(hb.x1), out.Y(hb.y1)];
    return out;
  }

  // ------------------------------------------------------------------ the sky and the far bank

  // A flat-bottomed papercut cloud: a shaded under-layer, the body above it.
  function cloud(S, C, x, base, w, h, seed) {
    var d = mound(x - w / 2, x + w / 2, base, base - h, 5, rng(seed), 0.42, 0.28, 0.1);
    return path(d, C.cloudShade, { opacity: 0.85 }) + path(d, C.cloud, { transform: 'translate(0 ' + n(-h * 0.14) + ')' });
  }

  function skyLayer(S, C, L) {
    var hz = L.hz, s = K.sky(S, 0, 0, 1600, hz + 8, { sun: L.sun, sunR: L.sunR || 460, starDepth: 0.95, seed: 7001 });
    // the afternoon: a warm haze low over the trees
    if (!C.dark) s += rect(0, hz - 170, 1600, 178, S.linU([[0, C.warm, 0], [0.7, C.warm, 0.3], [1, C.warm, 0.42]], 0, hz - 170, 0, hz + 8));
    if (S.tod !== 'storm') (L.clouds || []).forEach(function (c) { s += cloud(S, C, c[0], c[1], c[2], c[3], c[4]); });
    return g(s, { 'data-part': 'sky' });
  }

  // The far side of the marsh: willows and reed beds in the haze, nothing built. Their reflection
  // lies in the still water under them.
  function farBank(S, C, L) {
    var hz = L.hz, bh = L.bankH, r = rng(L.seed + 1), a = '', b = '', x, w;
    for (x = -80; x < 1680; x += w * 0.72) { w = bh * (1.5 + r() * 1.8); a += mound(x, x + w, hz + 2, hz - bh * (0.62 + r() * 0.38), 5, r, 0.32, 0.25, 0.25); }
    for (x = -60; x < 1680; x += w * 0.8) { w = bh * (0.9 + r() * 1.3); b += mound(x, x + w, hz + 2, hz - bh * (0.26 + r() * 0.3), 4, r, 0.3, 0.25, 0.3); }
    // a pale fringe of far reeds right at the water
    var fr = '', rr = rng(L.seed + 2);
    for (x = -10; x < 1620; x += 7 + rr() * 9) fr += bladeD(x, hz + 2, bh * (0.12 + rr() * 0.14), (rr() - 0.5) * 6, 1.6);
    var trees = path(a, C.far) + path(b, C.farNear);
    var s = g(trees + path(fr, mix(C.straw, C.haze, 0.45), { opacity: 0.9 }), { 'data-part': 'far-bank' });
    // the same, upside down and soft, in the water
    s += g(trees, { transform: 'translate(0 ' + n(hz + 2) + ') scale(1 -0.62) translate(0 ' + n(-(hz + 2)) + ')', opacity: C.dark ? 0.25 : 0.4 });
    return s;
  }

  // ------------------------------------------------------------------ the water, the mist

  function waterLayer(S, C, L) {
    var hz = L.hz;
    return g(rect(-20, hz, 1640, 1012 - hz, S.linU([[0, C.waterFar], [0.16, C.waterMid], [0.5, C.water], [1, C.waterDeep]], 0, hz, 0, 1000)), { 'data-part': 'water' });
  }
  // Still water: long level streaks of sky, very few glints (after the trees' reflection).
  function waterShine(S, C, L) {
    var hz = L.hz, r = rng(L.seed + 6), a = '', b = '', i, span = 1000 - hz;
    for (i = 0; i < (L.streaks == null ? 26 : L.streaks); i++) {
      var t = Math.pow(r(), 1.2), y = hz + 14 + t * (span - 20), len = (60 + t * 220) * (0.5 + r()), x = r() * 1600 - len / 2;
      a += 'M' + n(x) + ' ' + n(y) + 'h' + n(len);
    }
    for (i = 0; i < (L.glints == null ? 14 : L.glints); i++) {
      var gy = hz + 10 + Math.pow(r(), 1.1) * (span - 16);
      b += 'M' + n(r() * 1600) + ' ' + n(gy) + 'h' + n(8 + (gy - hz) * 0.07);
    }
    return stroke(a, C.mudSheen, 2.2, { opacity: C.dark ? 0.12 : 0.26 }) + stroke(b, C.glint, 2.6, { opacity: 0.7, 'class': 'pcs-glint' });
  }

  // Mist low on the water: long soft bands, drifting. list: [[cx, cy, rx, ry, opacity], …]
  function mist(S, C, list, key) {
    var s = '';
    (list || []).forEach(function (m) {
      s += ell(m[0], m[1], m[2], m[3], S.radB('mist', [[0, C.mist, 0.9], [0.55, C.mist, 0.42], [1, C.mist, 0]]), { opacity: n4((m[4] == null ? 0.6 : m[4]) * C.mistOp) });
    });
    return s ? g(g(s, { 'class': 'pcs-drift', style: 'animation-duration:70s' }), { 'data-part': 'mist', 'data-mist': key || 'low' }) : '';
  }

  // Rings on still water where something went in, or stands. `half`: only the near side of each ring.
  function rings(S, C, x, y, w, op, half) {
    var out = '', o = op == null ? 0.7 : op, list = [[0.5, 0.15, 1], [0.82, 0.24, 0.65], [1.16, 0.34, 0.36]];
    for (var i = 0; i < list.length; i++) {
      var q = list[i], rx = w * q[0], ry = w * q[1], sw = Math.max(1.3, w * 0.03);
      if (half) out += stroke('M' + n(x - rx) + ' ' + n(y) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(x + rx) + ' ' + n(y), C.ring, sw, { opacity: n4(o * q[2]) });
      else out += ell(x, y, rx, ry, 'none', { stroke: C.ring, 'stroke-width': n(sw), opacity: n4(o * q[2]) });
    }
    return out;
  }

  // ------------------------------------------------------------------ lily pads, frogs, a dragonfly

  // One pad at (x, y): radius r across, f its foreshortening, the notch toward `rot` (radians).
  function padD(x, y, r, f, rot) { return pts(ellPts(x, y, r, r * f, rot + 0.26, rot + Math.PI * 2 - 0.26, 22).concat([[x, y]])) + 'Z'; }
  function lilyPad(S, C, q) {
    var x = q[0], y = q[1], r = q[2], f = q[3] || 0.36, rr = rng(Math.round(x * 7 + y * 3)), rot = rr() * 6.28, d = padD(x, y, r, f, rot), s = '';
    s += path(d, C.padDk, { transform: 'translate(0 ' + n(Math.max(1.5, r * 0.08)) + ')', opacity: 0.8 }) + path(d, C.pad);
    s += ell(x - r * 0.2, y - r * f * 0.25, r * 0.5, r * f * 0.42, C.padLt, { opacity: 0.55 });
    var veins = '';
    for (var i = 0; i < 5; i++) { var a = rot + 0.9 + i * 1.1; veins += 'M' + n(x) + ' ' + n(y) + 'L' + n(x + Math.cos(a) * r * 0.78) + ' ' + n(y + Math.sin(a) * r * f * 0.78); }
    s += stroke(veins, C.padDk, Math.max(1, r * 0.035), { opacity: 0.45 });
    return s;
  }
  // A water lily sitting on the water at (x, y): pointed petals, a gold middle.
  function lily(S, C, x, y, r, pink) {
    var s = '', back = '', front = '', i, col = pink ? C.petalPink : C.petal;
    for (i = 0; i < 5; i++) { var a = -Math.PI / 2 + (i - 2) * 0.5; back += leafD(x, y, r * 1.05, a, r * 0.26); }
    for (i = 0; i < 4; i++) { var b = -Math.PI / 2 + (i - 1.5) * 0.62; front += leafD(x, y + r * 0.1, r * 0.8, b, r * 0.24); }
    s += ell(x, y + r * 0.12, r * 0.9, r * 0.22, C.padDk, { opacity: 0.35 }) + path(back, C.petalShade) + path(front, col) + circ(x, y - r * 0.12, r * 0.18, C.stamen);
    return s;
  }

  // A frog. Sitting: on its pad, eyes open, alive. Jumping: in the air, legs out behind, on its way in.
  function frog(S, C, x, y, k, dir, jump) {
    var s = '', X = function (u) { return x + u * k * dir; }, Y = function (v) { return y + v * k; };
    function P(list) { return pts(list.map(function (q) { return [X(q[0]), Y(q[1])]; })) + 'Z'; }
    if (jump) {
      // stretched out along its leap, up and forward
      var body = [[-16, 2], [-8, -8], [8, -12], [22, -10], [28, -4], [22, 2], [6, 6], [-8, 7]];
      s += stroke('M' + n(X(-18)) + ' ' + n(Y(3)) + 'L' + n(X(-34)) + ' ' + n(Y(12)) + 'L' + n(X(-48)) + ' ' + n(Y(8)) + 'M' + n(X(-14)) + ' ' + n(Y(6)) + 'L' + n(X(-30)) + ' ' + n(Y(20)) + 'L' + n(X(-44)) + ' ' + n(Y(20)), C.frogDk, 4.6 * k) +
        stroke('M' + n(X(-18)) + ' ' + n(Y(3)) + 'L' + n(X(-34)) + ' ' + n(Y(12)) + 'L' + n(X(-48)) + ' ' + n(Y(8)) + 'M' + n(X(-14)) + ' ' + n(Y(6)) + 'L' + n(X(-30)) + ' ' + n(Y(20)) + 'L' + n(X(-44)) + ' ' + n(Y(20)), C.frog, 2.6 * k);
      s += path(smooth(body.map(function (q) { return [X(q[0]), Y(q[1])]; })), C.frog) + path(P([[-4, 5], [10, 5], [22, 1], [8, 0]]), C.frogBelly, { opacity: 0.9 });
      s += stroke('M' + n(X(14)) + ' ' + n(Y(-2)) + 'L' + n(X(26)) + ' ' + n(Y(8)), C.frogDk, 3 * k);
      s += circ(X(19), Y(-11), 4.6 * k, C.frog) + circ(X(20), Y(-11.6), 2.6 * k, '#FFFDF0') + circ(X(20.6), Y(-11.6), 1.3 * k, '#22301C');
      return g(s, { 'data-frog': 'jump' });
    }
    // sitting: haunches, a round back, two eye bumps, forefeet together
    s += ell(x, y + 1.5 * k, 21 * k, 5.5 * k, C.shade, { opacity: 0.2 });
    s += path(smooth([[-20, 2], [-22, -6], [-12, -12], [-2, -6], [-6, 3]].map(function (q) { return [X(q[0]), Y(q[1])]; })), C.frogDk);
    s += path(smooth([[-16, 3], [-14, -12], [0, -20], [14, -17], [20, -8], [16, 2], [4, 4]].map(function (q) { return [X(q[0]), Y(q[1])]; })), C.frog);
    s += path(smooth([[4, 3], [6, -6], [16, -6], [18, 1]].map(function (q) { return [X(q[0]), Y(q[1])]; })), C.frogBelly, { opacity: 0.92 });
    s += ell(X(-3), Y(-13), 8 * k, 4 * k, C.frogLt, { opacity: 0.6 });
    s += stroke('M' + n(X(9)) + ' ' + n(Y(-2)) + 'L' + n(X(10)) + ' ' + n(Y(4)) + 'M' + n(X(14)) + ' ' + n(Y(-2)) + 'L' + n(X(16)) + ' ' + n(Y(4)), C.frogDk, 2.4 * k);
    s += circ(X(8), Y(-18), 4.8 * k, C.frog) + circ(X(17), Y(-15), 4.4 * k, C.frog) + circ(X(8.6), Y(-18.6), 2.8 * k, '#FFFDF0') + circ(X(17.6), Y(-15.6), 2.6 * k, '#FFFDF0') +
      circ(X(9.2), Y(-18.6), 1.4 * k, '#22301C') + circ(X(18.2), Y(-15.6), 1.3 * k, '#22301C');
    s += stroke('M' + n(X(12)) + ' ' + n(Y(-9)) + 'Q' + n(X(17)) + ' ' + n(Y(-7)) + ' ' + n(X(20)) + ' ' + n(Y(-10)), C.frogDk, 1.4 * k, { opacity: 0.8 });
    return g(s, { 'data-frog': 'sit' });
  }

  // The pads of a composition, far to near. list: [[x, y, r, what], …]; what: 0 plain, 1 a white
  // lily, 2 a pink one, 'frog' a frog's pad (the frogs themselves come later, in front).
  function pads(S, C, L) {
    var s = '';
    (L.pads || []).forEach(function (q) {
      s += lilyPad(S, C, [q[0], q[1], q[2], L.padF]);
      if (q[3] === 1 || q[3] === 2) s += lily(S, C, q[0] + q[2] * 0.2, q[1] - q[2] * 0.12, q[2] * 0.42, q[3] === 2);
    });
    return s ? g(s, { 'data-part': 'pads' }) : '';
  }
  function frogs(S, C, L, mode) {
    var s = '', i = 0;
    (L.pads || []).forEach(function (q) {
      if (q[3] !== 'frog') return;
      var k = q[2] / 30, dir = i % 2 ? -1 : 1;
      if (mode === 'jump') {
        // off the pad and into the water beside it: the frog in the air, a ring where it will land
        var lx = q[0] + dir * q[2] * 2.1, ly = q[1] + q[2] * 0.3;
        s += rings(S, C, lx, ly, q[2] * 0.7, 0.75) + frog(S, C, q[0] + dir * q[2] * 1.1, q[1] - q[2] * 1.15, k, dir, true) +
          stroke('M' + n(q[0] + dir * q[2] * 0.2) + ' ' + n(q[1] - q[2] * 0.3) + 'Q' + n(q[0] + dir * q[2] * 0.5) + ' ' + n(q[1] - q[2] * 1.3) + ' ' + n(q[0] + dir * q[2] * 0.75) + ' ' + n(q[1] - q[2] * 1.25),
            C.ring, Math.max(1.4, 2.2 * k), { opacity: 0.6, 'stroke-dasharray': n(5 * k) + ' ' + n(6 * k) });
      } else s += frog(S, C, q[0] - dir * q[2] * 0.1, q[1] - q[2] * 0.02, k, dir, false);
      i++;
    });
    return s ? g(s, { 'data-part': 'frogs', 'data-frogs': mode }) : '';
  }

  /* The dragonfly, the same insect app/art/cats.js draws on the heron's bill and on a cat's nose
   * (its `dragonflySvg`, shape for shape, so it is one dragonfly whoever draws it): a slim teal
   * body in segments, a round head, two pairs of glassy wings. (x, y) is where its feet rest, `rot`
   * turns it (degrees; 0: lying along +x, its head at +x), `flip` mirrors it; asleep, the wings are
   * laid back together over its tail. */
  var DFLY = { body: '#2f97a8', line: '#1c5f6c', head: '#3db1b6', wing: '#e4f6f7', wingLine: '#7dbcc6', eye: '#12414b' };
  function dragonfly(S, C, x, y, k, rot, asleep, flip) {
    var wings = '';
    (asleep ? [[-152, 19], [-164, 17]] : [[-128, 17], [-104, 18], [-66, 15], [-48, 14]]).forEach(function (w, i) {
      var r = w[0] * Math.PI / 180, cx = 4.6 + Math.cos(r) * w[1] * 0.55, cy = -5 + Math.sin(r) * w[1] * 0.55;
      wings += '<ellipse cx="' + n(cx) + '" cy="' + n(cy) + '" rx="' + n(w[1] * 0.55) + '" ry="' + (asleep ? 3 : 3.4) + '" transform="rotate(' + w[0] + ' ' + n(cx) + ' ' + n(cy) + ')" opacity="' + (i % 2 ? '.7' : '.86') + '"/>';
    });
    var body = C.d(DFLY.body), line = C.d(DFLY.line), s = '<g fill="' + C.d(DFLY.wing, 0.6) + '" stroke="' + C.d(DFLY.wingLine) + '" stroke-width=".9">' + wings + '</g>' +
      stroke('M-17 -2.2Q-6 -3.4 3 -4.4', line, 3.6) + stroke('M-17 -2.2Q-6 -3.4 3 -4.4', body, 2.2) +
      stroke('M-12.4 -4.2v2.6M-8 -4.8v2.8M-3.6 -5.4v2.8', line, 0.8, { 'stroke-linecap': 'butt' }) +
      ell(5.4, -5, 4.4, 3.3, body, { stroke: line, 'stroke-width': 1 }) + circ(10.6, -5.2, 2.9, C.d(DFLY.head), { stroke: line, 'stroke-width': 1 }) +
      (asleep ? stroke('M9.6 -5.4q1.3 1.1 2.6 0', DFLY.eye, 0.8) : circ(11.5, -6, 1, DFLY.eye)) +
      stroke('M3 -2.2l-1.4 2.2M6 -2l0.4 2M8.6 -2.4l1.8 2.2', line, 0.7);
    return '<g data-part="dragonfly" data-asleep="' + (asleep ? 1 : 0) + '" transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rot || 0) + ') scale(' + n4(flip ? -k : k) + ' ' + n4(k) + ')">' + s + '</g>';
  }

  // ------------------------------------------------------------------ reeds

  /* A stand of reeds: blades, cattails on their stems, and pale reeds (straw stems, a soft plume).
   * q: { x0, x1, y0, y1 (the line of their feet, left to right), h, n, seed, k (line scale),
   *      vary: [lo, hi] (heights, as shares of h), lean, wob (how far the feet wander),
   *      pale: [xa, xb] (pale reeds between these) | number (their share), tails (the share of
   *      cattails among the green ones), far: 0..1 (haze) }. */
  function reedStand(S, C, q) {
    var r = rng(q.seed), k = q.k || 1, far = q.far || 0, dark = '', mid = '', light = '', stems = '', tails = '', pStem = '', pLeaf = '', pl = '', plLt = '';
    var v0 = q.vary ? q.vary[0] : 0.72, v1 = q.vary ? q.vary[1] : 1.18, tailShare = q.tails == null ? 0.3 : q.tails;
    function fade(c) { return far ? mix(c, C.haze, far) : c; }
    for (var i = 0; i < q.n; i++) {
      var t = (i + r()) / q.n, x = lerp(q.x0, q.x1, t), y = lerp(q.y0, q.y1, t) + (r() - 0.5) * (q.wob || 0);
      var h = q.h * lerp(v0, v1, r()), lean = ((q.lean || 0) + (r() - 0.5) * 0.6) * h * 0.2, kind = r();
      var isPale = Array.isArray(q.pale) ? (x >= q.pale[0] && x <= q.pale[1] && r() < 0.9) : r() < (q.pale || 0);
      if (isPale) {
        var tx = x + lean, ty = y - h, dir = r() < 0.5 ? -1 : 1, len = h * (0.12 + r() * 0.06);
        pStem += 'M' + n(x) + ' ' + n(y) + 'Q' + n(x + lean * 0.2) + ' ' + n(y - h * 0.55) + ' ' + n(tx) + ' ' + n(ty);
        pl += leafD(tx, ty + len * 0.25, len, -Math.PI / 2 + dir * 0.55, len * 0.19) + leafD(tx, ty + len * 0.5, len * 0.82, -Math.PI / 2 + dir * 1.0, len * 0.16);
        plLt += leafD(tx, ty + len * 0.15, len * 0.8, -Math.PI / 2 - dir * 0.12, len * 0.13);
        // a narrow leaf or two off the stem
        var ly = y - h * (0.3 + r() * 0.3), lx = x + lean * 0.25;
        pLeaf += leafD(lx, ly, h * (0.2 + r() * 0.12), -Math.PI / 2 + dir * (0.5 + r() * 0.4), Math.max(1.2, h * 0.012));
        if (r() < 0.5) pLeaf += leafD(x + lean * 0.1, y - h * 0.16, h * 0.2, -Math.PI / 2 - dir * 0.6, Math.max(1.2, h * 0.012));
      } else if (kind >= tailShare) {
        var bd = bladeD(x, y, h * (0.8 + r() * 0.35), lean * 1.6, Math.max(1.4, h * 0.014 + 0.5) * (q.w || 1));
        var sh = r();
        if (sh < 0.4) dark += bd; else if (sh < 0.8) mid += bd; else light += bd;
      } else {
        // a cattail: a brown velvet head a little below the tip of its stem
        var cx = x + lean * 0.8, cy = y - h * 0.94, tl = Math.min(h * 0.13, 70 * k), ang = Math.atan2(cy - (y - h * 0.55), cx - (x + lean * 0.15));
        stems += 'M' + n(x) + ' ' + n(y) + 'Q' + n(x + lean * 0.15) + ' ' + n(y - h * 0.55) + ' ' + n(cx) + ' ' + n(cy);
        var bx = cx - Math.cos(ang) * tl * 1.25, by = cy - Math.sin(ang) * tl * 1.25;
        tails += 'M' + n(bx) + ' ' + n(by) + 'L' + n(bx + Math.cos(ang) * tl) + ' ' + n(by + Math.sin(ang) * tl);
      }
    }
    var lw = Math.max(1.2, Math.min(q.h * 0.012, 6)) * k, tw = Math.max(3, Math.min(q.h * 0.04, 15 * k)) * (q.tailK || 1), s = '';
    s += path(dark, fade(C.reedDk)) + stroke(stems, fade(C.reedDk), lw) + path(mid, fade(C.reed)) + path(light, fade(C.reedLt), { opacity: 0.95 });
    s += stroke(tails, fade(C.tail), tw) + stroke(tails, fade(C.tailLt), tw * 0.28, { opacity: 0.6, transform: 'translate(' + n(-tw * 0.2) + ' 0)' });
    if (pStem) {
      s += stroke(pStem, fade(C.strawDk), lw * 1.15) + stroke(pStem, fade(C.strawLt), lw * 0.45, { transform: 'translate(' + n(-lw * 0.3) + ' 0)', opacity: 0.8 }) +
        path(pLeaf, fade(C.straw)) + path(pl, fade(C.plume)) + path(plLt, fade(C.plumeLt), { opacity: 0.95 });
    }
    return s;
  }
  // The stands of a composition for one layer ('back' | 'over' | 'front'), each with its soft
  // reflection lying in the still water at its feet (no hard edge anywhere).
  function reeds(S, C, L, layer) {
    var s = '';
    (L.reeds || []).forEach(function (q) {
      if ((q.layer || 'back') !== layer) return;
      var body = reedStand(S, C, q), yb = Math.max(q.y0, q.y1);
      if (q.mirror !== false && layer === 'back') {
        var mh = q.h * 0.36, pale = Array.isArray(q.pale) || q.pale > 0.5, col = pale ? mix(C.reflect, C.strawDk, 0.4) : C.reflect, cx = (q.x0 + q.x1) / 2;
        s += ell(cx, yb + mh * 0.22, Math.abs(q.x1 - q.x0) / 2 + 30, mh * 0.6, S.radB(pale ? 'reflp' : 'refl', [[0, col, 0.55], [0.6, col, 0.34], [1, col, 0]]));
      }
      s += q.shadow ? g(body, { filter: S.shadow(q.shadow) }) : body;
    });
    return s ? g(s, { 'data-part': 'reeds', 'data-layer': layer }) : '';
  }

  // ------------------------------------------------------------------ the mud flat

  /* The mud beside the raft: P its outline. Round it, shallow water lies over its edge, clear
   * enough to show the bottom: pale sand, pebbles, the mud running down under the water. */
  function mudFlat(S, C, L) {
    var M = L.mud;
    if (!M) return '';
    var d = smooth(M.P), r = rng(L.seed + 11), s = '', i, k = M.k || 1, yr = [1e9, -1e9];
    M.P.forEach(function (q) { yr[0] = Math.min(yr[0], q[1]); yr[1] = Math.max(yr[1], q[1]); });
    yr[1] = Math.min(yr[1], 1000);
    // the shallows: the bottom showing through, lighter than the green water round it
    var halo = M.halo == null ? 46 * k : M.halo;
    s += path(d, C.shallow, { stroke: C.shallow, 'stroke-width': n(halo * 2), 'stroke-linejoin': 'round', opacity: 0.5 });
    s += path(d, C.shallow, { stroke: C.shallow, 'stroke-width': n(halo * 1.1), 'stroke-linejoin': 'round', opacity: 0.55 });
    // pebbles on the bottom, seen through the water, just off the mud
    var peb = '', pebLt = '';
    (M.pebbles || []).forEach(function (q) {
      for (i = 0; i < q[4]; i++) {
        var px = q[0] + (r() - 0.5) * q[2] * 2, py = q[1] + (r() - 0.5) * q[3] * 2, pr = (2.2 + r() * 3.4) * k;
        if (r() < 0.6) peb += blob(px, py, pr * 1.4, pr * 0.75, 6, r, 0.3, 0.3); else pebLt += blob(px, py, pr * 1.2, pr * 0.65, 6, r, 0.3, 0.3);
      }
    });
    s += path(peb, C.pebble, { opacity: 0.4 }) + path(pebLt, C.pebbleLt, { opacity: 0.55 });
    // where the still water meets the mud: one thin bright line
    s += path(d, 'none', { stroke: C.ring, 'stroke-width': n(Math.max(1.6, 2.6 * k)), opacity: 0.55, transform: 'translate(0 ' + n(-halo * 0.16) + ')' });
    // the wet rim, then the mud itself
    s += path(d, C.mudWet, { stroke: C.mudWet, 'stroke-width': n(14 * k), 'stroke-linejoin': 'round' });
    s += path(d, S.linU([[0, mix(C.mud, C.mudLt, 0.35)], [0.5, C.mud], [1, mix(C.mud, C.mudDk, 0.4)]], 0, yr[0], 0, yr[1]));
    // lumps and hollows, and the sky's sheen on the wet
    var clipId = S.clip('mud-' + S.comp, path(d, '#fff')), lumps = '', hol = '', sheen = '';
    var x0 = 1e9, x1 = -1e9;
    M.P.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); });
    x0 = Math.max(x0, -20); x1 = Math.min(x1, 1620);
    var count = M.lumps == null ? Math.round((x1 - x0) * (yr[1] - yr[0]) / 9000) : M.lumps;
    for (i = 0; i < count; i++) {
      var lx = x0 + r() * (x1 - x0), ly = yr[0] + r() * (yr[1] - yr[0]), lr = (8 + r() * 22) * k, kk = r();
      if (kk < 0.4) lumps += blob(lx, ly, lr, lr * 0.3, 7, r, 0.25, 0.3); else if (kk < 0.75) hol += blob(lx, ly, lr * 0.8, lr * 0.22, 7, r, 0.25, 0.3);
      else sheen += 'M' + n(lx - lr) + ' ' + n(ly) + 'q' + n(lr) + ' ' + n(-lr * 0.16) + ' ' + n(lr * 2) + ' 0';
    }
    s += g(path(lumps, C.mudLt, { opacity: 0.35 }) + path(hol, C.mudDk, { opacity: 0.3 }) + stroke(sheen, C.mudSheen, Math.max(1.5, 3 * k), { opacity: C.dark ? 0.12 : 0.3 }), { 'clip-path': clipId });
    return g(s, { 'data-part': 'mud' });
  }

  // One tiny print at (x, y), w wide, pointing along (dx, dy): a small pad and four toes pressed
  // into the mud. Nobody counts the toes; what matters is how small it is.
  function tinyPrint(x, y, w, dx, dy, sq) {
    var nx = -dy, ny = dx, d = '', f = sq || 1;
    function Q(u, v) { return [x + (dx * u + nx * v) * w, y + (dy * u + ny * v) * w * f]; }
    var c = Q(-0.1, 0);
    d += 'M' + n(c[0] - w * 0.3) + ' ' + n(c[1]) + 'a' + n(w * 0.3) + ' ' + n(w * 0.24 * f) + ' 0 1 0 ' + n(w * 0.6) + ' 0a' + n(w * 0.3) + ' ' + n(w * 0.24 * f) + ' 0 1 0 ' + n(-w * 0.6) + ' 0';
    [[0.36, -0.36], [0.5, -0.13], [0.5, 0.13], [0.36, 0.36]].forEach(function (t) { var q = Q(t[0], t[1]); d += dot(q[0], q[1], w * 0.11); });
    return d;
  }
  // The great heron print: three long toes spread forward and one back, pressed deep, each with
  // the dint of its claw: a bird's foot as long as a cat's foreleg.
  function heronPrint(x, y, len, ang, sq) {
    var d = '', f = sq || 1;
    function P(a, r) { return [x + Math.cos(a) * r, y + Math.sin(a) * r * f]; }
    [[0, 1], [-0.6, 0.84], [0.6, 0.84], [Math.PI, 0.46]].forEach(function (t) {
      var a = ang + t[0], L = len * t[1], w = len * 0.085, tip = P(a, L), m1 = P(a + 0.5 * w / (L * 0.45), L * 0.45), m2 = P(a - 0.5 * w / (L * 0.45), L * 0.45);
      var b1 = P(a + Math.PI / 2, w * 0.5), b2 = P(a - Math.PI / 2, w * 0.5);
      d += 'M' + n(b1[0]) + ' ' + n(b1[1]) + 'Q' + n(m1[0] + (m1[0] - x) * 0.1) + ' ' + n(m1[1]) + ' ' + n(tip[0]) + ' ' + n(tip[1]) + 'Q' + n(m2[0]) + ' ' + n(m2[1]) + ' ' + n(b2[0]) + ' ' + n(b2[1]) + 'Z';
      // the joints of the toe, two soft bulges, and the claw's dint beyond its tip
      [0.34, 0.66].forEach(function (u) { var j = P(a, L * u); d += dot(j[0], j[1], w * (0.66 - u * 0.3)); });
      var c = P(a, L * 1.09); d += dot(c[0], c[1], w * 0.2);
    });
    return d + dot(x, y, len * 0.075);
  }
  /* The prints: tiny ones in a line across the mud (along R.line), the two feet taking turns, and
   * beside them one great heron print. R: { line: [[x, y], …], w (a tiny print's width near the
   * start), w1 (at the far end), gap (between prints, in widths), heron: [x, y, len, ang], sq }. */
  // Where the tiny prints fall along R.line, the two feet taking turns; `t0`: how far along the line
  // the first one is.
  function printSpots(R, t0) {
    var total = alongLine(R.line, 0).len, out = [], t = t0 || 0, i = 0, sq = R.sq || 1;
    while (t < total) {
      var u = t / total, q = alongLine(R.line, u), w = lerp(R.w, R.w1 == null ? R.w : R.w1, u), side = i % 2 ? 1 : -1;
      out.push({ x: q.x - q.dy * side * w * 0.55, y: q.y + q.dx * side * w * 0.55 * sq, w: w, dx: q.dx, dy: q.dy });
      t += w * (R.gap || 2.6) * (0.9 + (i % 3) * 0.1);
      i++;
    }
    return out;
  }
  // The prints of a composition: { spots, at }. With `under: [x, y]` (the `mud` camera: where our
  // cat's paw is held over them) the line starts where one print falls right there, and `at` is
  // that print; without it the line starts at its beginning, as it always did.
  function printsFor(R) {
    if (!R.under) return { spots: printSpots(R, 0), at: null };
    if (R._for) return R._for;
    var best = null, step = R.w * (R.gap || 2.6), k, pick = function (spots) {
      spots.forEach(function (q) { var d = Math.pow(q.x - R.under[0], 2) + Math.pow(q.y - R.under[1], 2); if (!best || d < best.d) best = { d: d, spots: spots, at: q }; });
    };
    for (k = 0; k < 48; k++) pick(printSpots(R, step * k / 48));
    R._for = { spots: best.spots, at: best.at };
    return R._for;
  }
  function printsSvg(S, C, R) {
    if (!R) return '';
    var s = '', deep = '', lip = '', sq = R.sq || 1;
    printsFor(R).spots.forEach(function (q) {
      var d = tinyPrint(q.x, q.y, q.w, q.dx, q.dy, sq);
      deep += d;
      lip += '<path d="' + d + '" data-print="tiny"/>';
    });
    var lw = Math.max(0.6, R.w * 0.06);
    s += path(deep, C.grooveHi, { opacity: 0.55, transform: 'translate(' + n(lw) + ' ' + n(lw * 1.4) + ')' }) + g(lip, { fill: C.groove, opacity: 0.9 });
    if (R.heron) {
      var H = R.heron, hd = heronPrint(H[0], H[1], H[2], H[3], sq), hw = Math.max(0.8, H[2] * 0.016);
      s += path(hd, C.grooveHi, { opacity: 0.6, transform: 'translate(' + n(hw) + ' ' + n(hw * 1.5) + ')' }) + path(hd, C.groove, { opacity: 0.9, 'data-print': 'heron' });
    }
    return g(s, { 'data-part': 'prints' });
  }

  // A one-tap target, for the frame whose scene asks for it (`tap`): an unpainted ellipse the size
  // of the thing, of class `pc-tap` and named (`data-tap`). The page finds it there and lays its own
  // soft glow on it, as it does on the old tom's nose and the tuft of fur (a round glow, two and a
  // half times the mark's longer half: the marks are sized for that); the art itself draws nothing,
  // so no other frame of the same picture ever shows a glow.
  function tapMark(name, x, y, rx, ry) { return ell(x, y, rx, ry, 'none', { 'class': 'pc-tap', 'data-tap': name }); }

  // ------------------------------------------------------------------ the raft, the pole, the fish

  /* The otters' raft, the Crossing's: four logs side by side, lashed with vines, riding low. Here
   * its cut ends are at the right, against the mud. R: { x0, x1, top, bot, k, seed }. */
  function raftSvg(S, C, R) {
    var r = rng(R.seed || 561), s = '', logs = 4, k = R.k, dy = (R.bot - R.top) / logs, front = 20 * k, i;
    // its shade on the water, and the still water's line along it
    s += path('M' + n(R.x0 + 10 * k) + ' ' + n(R.bot + front - 4 * k) + 'H' + n(R.x1 - 6 * k) + 'Q' + n(R.x1 + 12 * k) + ' ' + n(R.bot + front + 14 * k) + ' ' + n(R.x1 - 20 * k) + ' ' + n(R.bot + front + 24 * k) +
      'H' + n(R.x0 + 24 * k) + 'Z', C.shade, { opacity: 0.24 });
    for (i = 0; i < logs; i++) {
      var ya = R.top + i * dy - 4 * k, yb = ya + dy + 10 * k, la = R.x0 + (r() - 0.5) * 30 * k, lb = R.x1 + (r() - 0.5) * 26 * k - (i % 2) * 12 * k, rr = (yb - ya) / 2;
      var col = i % 2 ? C.woodLt : C.wood, bark = mix(col, C.woodDk, 0.45), last = i === logs - 1;
      s += rect(la, ya, lb - la, yb - ya + (last ? front : 0), S.linU([[0, mix(col, C.rim, 0.25)], [0.45, col], [1, bark]], 0, ya, 0, yb + (last ? front : 0)), { rx: n(rr) });
      var tex = '';
      for (var j = 0; j < 7; j++) { var tx = la + 30 * k + r() * Math.max(10, lb - la - 90 * k); tex += 'M' + n(tx) + ' ' + n(ya + rr * (0.5 + r() * 0.6)) + 'h' + n((18 + r() * 40) * k); }
      s += stroke(tex, C.woodDk, 2.2 * k, { opacity: 0.4 }) + stroke('M' + n(la + rr) + ' ' + n(ya + 3 * k) + 'H' + n(lb - rr), C.rim, 2.4 * k, { opacity: 0.5 });
      // the cut end at the right, with its rings
      var ex = lb - rr * 0.55, ey = ya + rr;
      s += ell(ex, ey, rr * 0.55, rr * 0.92, C.cut) + ell(ex, ey, rr * 0.34, rr * 0.6, 'none', { stroke: C.woodDk, 'stroke-width': n(1.6 * k), opacity: 0.5 }) + ell(ex, ey, rr * 0.14, rr * 0.25, C.woodDk, { opacity: 0.45 });
    }
    // vine lashings: wound round every log, a knot on top, a few leaves
    var lv = '', ln = '', knots = '', span = R.x1 - R.x0, lash = R.lash || [0.22, 0.52, 0.82];
    lash.forEach(function (f) {
      var vx = R.x0 + span * f + (r() - 0.5) * 16 * k;
      for (i = 0; i < logs; i++) {
        var la0 = R.top + i * dy - 2 * k, lb0 = R.top + (i + 1) * dy + (i === logs - 1 ? front : 6 * k);
        for (var w2 = 0; w2 < 2; w2++) { var wx = vx + w2 * 13 * k + i * 3 * k; ln += 'M' + n(wx - 4 * k) + ' ' + n(la0) + 'Q' + n(wx + 7 * k) + ' ' + n((la0 + lb0) / 2) + ' ' + n(wx - 1 * k) + ' ' + n(lb0); }
      }
      knots += dot(vx + 8 * k, R.top + 2 * k, 9 * k);
      lv += leafD(vx + 8 * k, R.top, 24 * k, -2.4, 9 * k) + leafD(vx + 10 * k, R.top, 20 * k, -0.6, 8 * k);
    });
    s += stroke(ln, C.vine, 6 * k) + stroke(ln, C.vineLt, 1.8 * k, { opacity: 0.55, transform: 'translate(-1.5 -1)' }) + path(knots, C.vine) + path(lv, C.leaf);
    s += stroke('M' + n(R.x0 + 6 * k) + ' ' + n(R.bot + front + 1 * k) + 'H' + n(R.x1 - 10 * k), C.ring, 3 * k, { opacity: 0.5 });
    return g(s, { 'data-part': 'raft' });
  }
  // The line between two of the raft's logs (the i-th gap from the back).
  function raftGap(R, i) { return { y: R.top + i * (R.bot - R.top) / 4 + 4 * R.k }; }

  /* Riffle's pole, planted: standing in the mud beside the raft, a twist of the raft's vine round
   * it. P: { x, foot, top, w (half its width at the foot), tie: [x, y] (where the vine comes from) }. */
  function poleSvg(S, C, P, planted) {
    var x = P.x, w0 = P.w, w1 = P.w * 0.72, lean = P.lean || 0, tx = x + lean, s = '';
    if (planted) {
      // the mud heaped a little round its foot, a small wet ring
      s += ell(x, P.foot + w0 * 0.3, w0 * 3.6, w0 * 1.1, C.mudDk, { opacity: 0.55 }) + ell(x, P.foot, w0 * 2.6, w0 * 0.8, C.mudLt, { opacity: 0.7 });
    }
    var shaft = S.linU([[0, C.poleLt], [0.4, C.pole], [1, C.poleDk]], x - w0, 0, x + w0, 0);
    s += poly([[x - w0, P.foot], [tx - w1, P.top], [tx + w1, P.top], [x + w0, P.foot]], shaft);
    if (P.top > -20) s += ell(tx, P.top, w1, w1 * 0.42, mix(C.cut, C.poleLt, 0.4));
    // knots along it, where the twigs were
    var knots = '', len = P.foot - P.top, r = rng(Math.round(x * 3 + P.foot));
    for (var y = P.foot - len * 0.16; y > P.top + len * 0.06; y -= len * (0.17 + r() * 0.08)) {
      var f = (P.foot - y) / len, cx = x + lean * f, wy = lerp(w0, w1, f);
      knots += 'M' + n(cx - wy) + ' ' + n(y) + 'q' + n(wy) + ' ' + n(wy * 0.7) + ' ' + n(wy * 2) + ' 0';
    }
    s += stroke(knots, C.poleDk, Math.max(1, w0 * 0.22), { opacity: 0.7 }) +
      stroke('M' + n(x - w0 * 0.45) + ' ' + n(P.foot - w0) + 'L' + n(tx - w1 * 0.45) + ' ' + n(P.top + w1), '#FFFFFF', Math.max(1, w0 * 0.25), { opacity: C.dark ? 0.1 : 0.35 });
    // the wet, dark foot of it
    s += poly([[x - w0, P.foot], [x - lerp(w0, w1, 0.12) + lean * 0.12, P.foot - len * 0.12], [x + lerp(w0, w1, 0.12) + lean * 0.12, P.foot - len * 0.12], [x + w0, P.foot]], C.mudWet, { opacity: 0.55 });
    if (planted && P.tie) {
      // the vine from the raft, twice round the pole: it holds the raft still
      var ty = P.foot - len * 0.2, vy = ty + w0 * 0.4, cxp = x + lean * 0.2;
      s += stroke('M' + n(P.tie[0]) + ' ' + n(P.tie[1]) + 'Q' + n((P.tie[0] + cxp) / 2) + ' ' + n(Math.max(P.tie[1], vy) + w0 * 2.2) + ' ' + n(cxp - w0 * 1.2) + ' ' + n(vy), C.vine, Math.max(2.4, w0 * 0.6)) +
        stroke('M' + n(cxp - w0 * 1.25) + ' ' + n(ty - w0 * 0.5) + 'q' + n(w0 * 1.25) + ' ' + n(w0 * 0.9) + ' ' + n(w0 * 2.5) + ' 0M' + n(cxp - w0 * 1.25) + ' ' + n(ty + w0 * 0.5) + 'q' + n(w0 * 1.25) + ' ' + n(w0 * 0.9) + ' ' + n(w0 * 2.5) + ' 0', C.vine, Math.max(2.4, w0 * 0.6)) +
        path(leafD(cxp + w0 * 1.1, ty, w0 * 3, -0.5, w0 * 1.1) + leafD(cxp + w0 * 1.1, ty + w0 * 0.4, w0 * 2.6, 0.5, w0), C.leaf);
    }
    return g(s, { 'data-part': 'pole', 'data-pole': planted ? 'planted' : 'standing', filter: S.shadow('s') });
  }

  /* Riffle's pole lying along the raft's near log, in front of everyone's feet, its foot toward the
   * mud: where it is when his paws are busy (he hops, he sits, he falls flat on his back) and it is
   * not planted. In the colours app/art/cats.js gives the pole in his paws (LYING), so it is plainly
   * the same pole and does not vanish into the logs. R: the raft; a: his place on it (`raft-2`). */
  var LYING = { fill: '#cba469', dark: '#a8804a', line: '#6b4a26' };
  function lyingPole(S, C, R, a) {
    var h = a.h, w = poleHalf(h) * 2, x1 = R.x1 - 34 * R.k, x0 = Math.max(R.x0 + 16 * R.k, x1 - poleLen(h));
    var y = Math.min(R.bot - 3 * R.k, Math.max(R.top + (R.bot - R.top) * 0.84, a.y + h * 0.05));
    var d = 'M' + n(x0) + ' ' + n(y + 3 * R.k) + 'L' + n(x1) + ' ' + n(y);
    return g(stroke(d, C.d(LYING.line), w + Math.max(2, w * 0.36)) + stroke(d, C.d(LYING.fill), w) +
      stroke(d, C.d(LYING.dark), Math.max(0.8, w * 0.3), { opacity: 0.7, transform: 'translate(0 ' + n(w * 0.24) + ')' }), { 'data-part': 'pole', 'data-pole': 'lying', filter: S.shadow('s') });
  }

  // One fish from the Counts pictures (PC.art.prey; app/art/sets/pile.js), eyes shut; or, without
  // it, a small silver fish of our own, eye shut. Returns { svg, w, h }: facing right in its box.
  function fishBox(seed) {
    if (typeof art.prey === 'function') {
      try { var f = art.prey({ kind: 'fish', seed: seed }); if (f && f.w > 0 && f.h > 0 && typeof f.svg === 'string') return f; } catch (e) { /* our own */ }
    }
    var s = path('M30 22L6 6Q12 22 6 40Z', '#9FB3C6') + path('M28 23C44 6 96 2 124 20C134 26 134 30 126 34C104 48 54 46 28 26Z', '#C5D2DE') +
      path('M31 30C56 43 102 43 126 33C104 39 60 39 31 30Z', '#EEF3F8') + stroke('M114 21Q118 25 123 21', '#2F3A48', 2.6) + stroke('M106 16Q100 26 106 36', '#8DA2B8', 2);
    return { svg: s, w: 140, h: 46 };
  }
  // A fish drawn with its middle at (x, y), `len` long, turned by `rot` degrees.
  function fishAt(x, y, len, rot, seed) {
    var f = fishBox(seed), k = len / f.w;
    return '<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rot) + ') scale(' + n4(k) + ') translate(' + n(-f.w / 2) + ' ' + n(-f.h / 2) + ')" data-fish="1">' + f.svg + '</g>';
  }

  /* The catch, laid across the logs: four strings, five fish on every string, fanned out side by
   * side from the loop that holds them, heads toward us, eyes shut. A string is a reed looped round
   * the tails (the loop lies over them: nothing goes through a fish; no hook, no blood).
   * F: { xs: [x, …4], y (the loops' line), len (a fish's length) }.
   * 'spare': three emptied loops, and the fourth with two fish still on it. */
  function stringsSvg(S, C, F, mode) {
    if (!F || (mode !== 'strings' && mode !== 'spare')) return '';
    var s = '', len = F.len, reed = mix(C.straw, C.reed, 0.45), reedDk = mix(C.strawDk, C.reedDk, 0.5), lw = Math.max(1.5, len * 0.045);
    F.xs.forEach(function (x, si) {
      var count = mode === 'strings' ? 5 : si === F.xs.length - 1 ? 2 : 0, body = '', i, y = F.y, loop = '';
      for (i = 0; i < count; i++) {
        var ang = 90 + (i - (count - 1) / 2) * 13, a = ang * Math.PI / 180;
        // its tail in the loop, its head out toward us
        body += fishAt(x + Math.cos(a) * len * 0.44, y + Math.sin(a) * len * 0.44, len, ang, 500 + si * 7 + i);
      }
      if (count) {
        // the loop, round the tails where they are narrowest: the far side of it behind them, the
        // near side over them, and the knot with its two loose ends
        var ry = len * 0.06, rx = len * (0.07 + count * 0.022), ly = y + len * 0.13;
        s += '<g data-string="' + (si + 1) + '" data-fish-count="' + count + '">' +
          stroke('M' + n(x - rx) + ' ' + n(ly) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 1 ' + n(x + rx) + ' ' + n(ly), reedDk, lw) + '<g>' + body + '</g>' +
          stroke('M' + n(x - rx) + ' ' + n(ly) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(x + rx) + ' ' + n(ly), reedDk, lw * 1.5) +
          stroke('M' + n(x - rx) + ' ' + n(ly) + 'A' + n(rx) + ' ' + n(ry) + ' 0 0 0 ' + n(x + rx) + ' ' + n(ly), reed, lw) +
          stroke('M' + n(x + rx) + ' ' + n(ly) + 'l' + n(len * 0.13) + ' ' + n(-len * 0.09) + 'M' + n(x + rx) + ' ' + n(ly) + 'l' + n(len * 0.15) + ' ' + n(len * 0.03), reed, lw) +
          circ(x + rx, ly, lw * 0.9, reedDk) + '</g>';
      } else {
        // emptied: the loop lies slack on the logs, its ends loose
        var ex = len * 0.2, ey = len * 0.085, cy = y + len * 0.2;
        loop = ell(x, cy, ex, ey, 'none', { stroke: reedDk, 'stroke-width': n(lw * 1.5) }) + ell(x, cy, ex, ey, 'none', { stroke: reed, 'stroke-width': n(lw) }) +
          stroke('M' + n(x + ex) + ' ' + n(cy) + 'q' + n(len * 0.1) + ' ' + n(-len * 0.1) + ' ' + n(len * 0.2) + ' ' + n(-len * 0.04) + 'M' + n(x + ex) + ' ' + n(cy) + 'q' + n(len * 0.08) + ' ' + n(len * 0.08) + ' ' + n(len * 0.17) + ' ' + n(len * 0.1), reed, lw) +
          circ(x + ex, cy, lw * 0.9, reedDk);
        s += '<g data-string="' + (si + 1) + '" data-fish-count="0">' + loop + '</g>';
      }
    });
    return g(s, { 'data-part': 'strings', 'data-fish-mode': mode });
  }

  /* What Riffle owes: a thought cloud over the heron, a pair of small silver fish for every
   * answer, in rows of three: the first row at the bottom, each row filled from the side nearest
   * her head, so the cloud grows up and away from her and a new pair never moves the others. No
   * number anywhere. T: { x, y (the bottom centre of the cloud at its widest), len (a fish's length),
   * head: [x, y] (her crown) }. */
  function thoughtSvg(S, C, T, owed) {
    var count = clamp(Math.round(+owed || 0), 0, 9);
    if (!T || !count) return '';
    var len = T.len, fh = len * 0.33, pw = len * 1.16, ph = fh * 1.62, gx = len * 0.3, gy = fh * 0.62, rows = Math.ceil(count / 3), cols = Math.min(3, count);
    var pad = len * 0.52, fullW = 3 * pw + 2 * gx + pad * 2, cw = cols * pw + (cols - 1) * gx + pad * 2, ch = rows * ph + (rows - 1) * gy + pad * 2;
    // from the right when her head is to the right of the cloud, else from the left
    var fromRight = !T.head || T.head[0] >= T.x, xa = T.x - fullW / 2, x0 = fromRight ? xa + fullW - cw : xa, y0 = T.y - ch, P = [], i;
    var k = Math.max(12, Math.round((cw + ch) / (len * 0.95)));
    for (i = 0; i < k; i++) {
      var a = Math.PI * 2 * (i + 0.5) / k, c = Math.cos(a), sn = Math.sin(a);
      P.push([x0 + cw / 2 + (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 0.6) * (cw / 2 - len * 0.2), y0 + ch / 2 + (sn < 0 ? -1 : 1) * Math.pow(Math.abs(sn), 0.6) * (ch / 2 - len * 0.2)]);
    }
    var d = K.scallops(P, x0 + cw / 2, y0 + ch / 2, 0.3, true), lw = Math.max(3, len * 0.085), s = '';
    s += path(d, S.linU([[0, C.think], [1, C.thinkIn]], 0, y0, 0, y0 + ch), { stroke: C.thinkLine, 'stroke-width': n(lw), 'stroke-linejoin': 'round' });
    s += path(d, 'none', { stroke: C.think, 'stroke-width': n(lw * 0.5), 'stroke-linejoin': 'round' });
    // the pairs: two fish side by side, the second a little lower and further on
    for (i = 0; i < count; i++) {
      var row = Math.floor(i / 3), col = i % 3, px = fromRight ? xa + fullW - pad - (col + 1) * pw - col * gx : xa + pad + col * (pw + gx), py = T.y - pad - row * (ph + gy) - ph;
      s += '<g data-pair="' + (i + 1) + '">' + fishAt(px + len * 0.5, py + fh * 0.5, len, 0, 900 + i * 2) + fishAt(px + len * 0.66, py + fh * 1.12, len, 0, 901 + i * 2) + '</g>';
    }
    // the little bubbles down to her head
    if (T.head) {
      var bx = fromRight ? x0 + cw - pad * 0.9 : x0 + pad * 0.9, by = T.y + lw, hx = T.head[0], hy = T.head[1];
      [[0.2, 0.2], [0.5, 0.135], [0.78, 0.085]].forEach(function (b) {
        s += circ(lerp(bx, hx, b[0]), lerp(by, hy, b[0]), len * b[1], C.think, { stroke: C.thinkLine, 'stroke-width': n(Math.max(1.6, lw * 0.34)) });
      });
    }
    keep(S, x0 - lw, y0 - lw, cw + lw * 2, ch + lw * 2);
    return g(s, { 'data-part': 'thought', 'data-owed': count });
  }

  // ------------------------------------------------------------------ Puddle's snout, the far log

  // A blue-grey snout up between two logs: the tip of Puddle's nose as app/art/cats.js draws it
  // (his `nostrils`, a little further out of the water): pale on top, two nostrils, a bubble or
  // two beside it, the water in the gap ringed round it. k: a sitting cat's height there / 200.
  function snoutSvg(S, C, x, y, k) {
    var base = C.d(PUDDLE.base), line = C.d(PUDDLE.line), belly = C.d(PUDDLE.belly), w = 22 * k, hh = 18 * k, s = '';
    // the slot it comes up through: the dark water between the logs
    s += ell(x, y + 2.5 * k, w * 1.5, 5 * k, C.waterDeep) + ell(x, y + 2 * k, w * 1.28, 3 * k, 'none', { stroke: C.ring, 'stroke-width': n(Math.max(1, 1.5 * k)), opacity: 0.7 });
    var d = 'M' + n(x - w) + ' ' + n(y + 3 * k) + 'Q' + n(x - w) + ' ' + n(y - hh) + ' ' + n(x) + ' ' + n(y - hh - 2 * k) + 'Q' + n(x + w) + ' ' + n(y - hh) + ' ' + n(x + w) + ' ' + n(y + 3 * k) + 'Z';
    s += path(d, belly, { stroke: line, 'stroke-width': n(Math.max(1.2, 2.4 * k)), 'stroke-linejoin': 'round' });
    s += path('M' + n(x - w * 0.93) + ' ' + n(y + 2 * k) + 'Q' + n(x - w * 0.93) + ' ' + n(y - hh * 0.25) + ' ' + n(x) + ' ' + n(y - hh * 0.14) + 'Q' + n(x + w * 0.93) + ' ' + n(y - hh * 0.25) + ' ' + n(x + w * 0.93) + ' ' + n(y + 2 * k) + 'Z', base, { opacity: 0.55 });
    [-1, 1].forEach(function (sd) {
      var nx = x + sd * 8 * k, ny = y - hh * 0.6;
      s += ell(nx, ny, 3.4 * k, 2.4 * k, C.d(PUDDLE.nostril), { transform: 'rotate(' + (sd * 20) + ' ' + n(nx) + ' ' + n(ny) + ')', 'data-nostril': 1 });
    });
    // bubbles beside it, as round as his
    [[26, -14, 4.6], [34, -30, 3.6], [29, -44, 2.8]].forEach(function (b) {
      s += circ(x + b[0] * k, y + b[1] * k, b[2] * k, '#eef8fc', { 'fill-opacity': 0.55, stroke: '#6ea9c8', 'stroke-width': n(Math.max(1, b[2] * k * 0.22)) });
    });
    return g(s, { 'data-part': 'snout' });
  }

  // The log far across the water: a fallen trunk on a bar of mud, a stub of a branch, far reeds.
  function farLog(S, C, G) {
    var x = G.x, y = G.y, w = G.w, h = G.h, s = '';
    s += ell(x, y + h * 0.9, w * 0.66, h * 0.7, mix(C.mud, C.haze, 0.45), { opacity: 0.9 });
    s += rect(x - w / 2, y + h * 1.0, w, h * 1.4, S.linU([[0, C.reflect, 0.45], [1, C.reflect, 0]], 0, y + h, 0, y + h * 2.4));
    s += rect(x - w / 2, y - h * 0.1, w, h * 1.1, S.linU([[0, mix(C.log, C.rim, 0.2)], [1, C.logDk]], 0, y - h * 0.1, 0, y + h), { rx: n(h * 0.5) });
    s += ell(x + w / 2 - h * 0.3, y + h * 0.45, h * 0.3, h * 0.5, mix(C.log, C.cut, 0.5));
    s += stroke('M' + n(x - w * 0.3) + ' ' + n(y) + 'l' + n(-h * 0.5) + ' ' + n(-h * 0.9), C.logDk, Math.max(2, h * 0.24));
    return g(s, { 'data-part': 'log' });
  }

  // ------------------------------------------------------------------ the pale reed

  /* Wisp, in our own few lines, for when app/art/cats.js has not drawn her: a dragonet as slim as
   * a reed, standing on one leg, wings folded long down her back like a heron's, her long tail
   * hanging straight as a leaf; pearl-white, thin enough that what is behind her shows through.
   * Still, she holds her snout straight up, as a bittern does among reeds; `blink` brings her face
   * down and round to us, two pale gold eyes open. u: a hundredth of a sitting cat's height
   * there; she stands about 165 u tall. */
  function wispOwn(S, C, a, mode) {
    var u = a.h / 100, dir = (a.face || 'left') === 'left' ? -1 : 1, x = a.x, y = a.y, s = '';
    function X(px) { return x + px * u * dir; }
    function Y(py) { return y - py * u; }
    function Q(list) { return list.map(function (q) { return [X(q[0]), Y(q[1])]; }); }
    var fill = C.d(WISP.fill, 0.6), line = C.d(WISP.line, 0.6), shade = C.d(WISP.shade, 0.6), lw = Math.max(1, 1.25 * u);
    var op = { stroke: line, 'stroke-width': n(lw), 'stroke-linejoin': 'round', 'fill-opacity': 0.78 };
    // the tail: hanging straight down behind the leg, one more blade
    s += path(pts(Q([[-6, 76], [-12, 44], [-13, 16], [-11, 6], [-8, 18], [-5, 46], [-1, 70]])) + 'Z', fill, op);
    // the leg she stands on: thin, one joint bending back, the foot in the water
    var leg = pts(Q([[1, 70], [-3, 35], [0, 1]]));
    s += stroke(leg, line, Math.max(1.5, 3.2 * u)) + stroke(leg, fill, Math.max(0.8, 1.7 * u));
    s += circ(X(-3), Y(35), Math.max(1.2, 2.6 * u), fill, { stroke: line, 'stroke-width': n(lw * 0.8), 'data-wisp': 'knee' });
    // the other, folded up under her: only its knee shows
    s += path(pts(Q([[3, 73], [12, 60], [6, 56], [0, 66]])) + 'Z', fill, { stroke: line, 'stroke-width': n(lw), 'stroke-linejoin': 'round', 'fill-opacity': 0.78, 'data-wisp': 'knee' });
    // the body: a long leaf, upright
    s += path(smooth(Q([[8, 72], [12, 94], [9, 114], [2, 121], [-7, 114], [-10, 94], [-6, 72], [1, 66]])), fill, op);
    // the wing, folded long down her back
    s += path(pts(Q([[-3, 117], [-11, 100], [-14, 74], [-13, 52], [-9, 76], [-5, 98]])) + 'Z', shade, { stroke: line, 'stroke-width': n(lw * 0.8), 'stroke-linejoin': 'round', 'fill-opacity': 0.72 });
    if (mode === 'blink') {
      // her face to us: small and round-cheeked, two soft nubs, two pale gold eyes, open
      s += path(pts(Q([[-1, 114], [0, 140], [6, 140], [6, 114]])) + 'Z', fill, op);
      var hx = 3, hy = 150;
      s += path(pts(Q([[hx + 5, hy + 8], [hx + 7, hy + 15], [hx + 9, hy + 8]])) + 'Z' + pts(Q([[hx - 9, hy + 8], [hx - 7, hy + 15], [hx - 5, hy + 8]])) + 'Z', shade, { stroke: line, 'stroke-width': n(lw * 0.7), 'stroke-linejoin': 'round' });
      s += path(smooth(Q([[hx - 12, hy], [hx - 10, hy + 9], [hx, hy + 11], [hx + 10, hy + 9], [hx + 12, hy], [hx + 8, hy - 9], [hx, hy - 11], [hx - 8, hy - 9]])), fill, { stroke: line, 'stroke-width': n(lw), 'stroke-linejoin': 'round', 'fill-opacity': 0.94 });
      [-1, 1].forEach(function (sd) {
        var ex = X(hx + sd * 5.2), ey = Y(hy + 1.5);
        s += circ(ex, ey, Math.max(1.2, 3.4 * u), C.d(WISP.eye, 0.4), { stroke: C.d(WISP.eyeLine, 0.4), 'stroke-width': n(Math.max(0.6, 0.8 * u)), 'data-wisp': 'eye' }) +
          ell(ex, ey, Math.max(0.4, 0.9 * u), Math.max(0.9, 2.4 * u), WISP.pupil) + circ(ex - 1 * u, ey - 1.1 * u, Math.max(0.3, 0.8 * u), '#FFFFFF');
      });
      s += path(dot(X(hx - 1.6), Y(hy - 6), Math.max(0.4, 0.7 * u)) + dot(X(hx + 1.6), Y(hy - 6), Math.max(0.4, 0.7 * u)), line);
    } else {
      // still: the neck straight up, the snout straight up after it, the eye shut
      s += path(pts(Q([[-1, 114], [0, 141], [2, 162], [4.6, 166], [6, 162], [7, 141], [6, 114]])) + 'Z', fill, op);
      s += path(pts(Q([[0.4, 146], [-4.4, 143], [0.2, 141]])) + 'Z', shade, { stroke: line, 'stroke-width': n(lw * 0.7), 'stroke-linejoin': 'round' });
      var ex0 = X(4.2), ey0 = Y(149);
      s += mode === 'flinch' ? stroke('M' + n(ex0 - 1.8 * u) + ' ' + n(ey0 - 1.6 * u) + 'L' + n(ex0 + 1.6 * u) + ' ' + n(ey0) + 'L' + n(ex0 - 1.8 * u) + ' ' + n(ey0 + 1.6 * u), line, Math.max(0.8, 1 * u), { 'data-wisp': 'eye-shut' }) :
        stroke('M' + n(ex0 - 2 * u) + ' ' + n(ey0) + 'q' + n(2 * u) + ' ' + n(1.9 * u) + ' ' + n(4 * u) + ' 0', line, Math.max(0.8, 1 * u), { 'data-wisp': 'eye-shut' });
    }
    return g(s, mode === 'flinch' ? { transform: 'rotate(' + n(7 * dir) + ' ' + n(x) + ' ' + n(y) + ')' } : null);
  }
  // The wash app/art/scenes.js lays on the cast so they sit in the light of the scene (its
  // CAST_TINT, value for value: tests/set-marsh.test.js checks they still agree), for the Wisp
  // the set draws itself: she is in the same light as everyone.
  var CAST_TINT = {
    dusk: '0.98 0 0 0 0.01  0 0.94 0 0 0.01  0 0 0.98 0 0.025  0 0 0 1 0',
    golden: '1 0 0 0 0.025  0 0.97 0 0 0.012  0 0 0.88 0 0  0 0 0 1 0',
    night: '0.7 0 0 0 0.015  0 0.74 0 0 0.025  0 0 0.88 0 0.07  0 0 0 1 0',
    storm: '0.64 0 0 0 0.015  0 0.68 0 0 0.025  0 0 0.8 0 0.06  0 0 0 1 0'
  };
  // Wisp as app/art/cats.js draws her, placed as scenes.js places a cast member: feet at the spot.
  function wispCast(S, a, pose) {
    var fn = art.character, ch, face = a.face || 'left';
    try { ch = fn('wisp', { pose: pose, mood: 'neutral', facing: face }); } catch (e) { return ''; }
    if (!ch || typeof ch.svg !== 'string' || !(ch.w > 0) || !(ch.h > 0)) return '';
    var k = a.h / refH() * bandK('wisp');
    var tint = CAST_TINT[S.tod] ? ' filter="' + S.filter('marsh-tint', '<feColorMatrix type="matrix" values="' + CAST_TINT[S.tod] + '"/>') + '"' : '';
    return '<g transform="' + tr(a.x, a.y, k) + ' translate(' + n(-ch.w / 2) + ' ' + n(-ch.h) + ')"' + tint + '>' + ch.svg + '</g>';
  }
  /* The pale reeds that stand in front of her: the clump she is hiding in. W: how she stands there
   * ({ tall, wide }: her height and her head's width, in hundredths of a sitting cat's height).
   * Z: how much of her they cover, 0 to 1 each: { legs, body, head }. All three: she is one of
   * them, a paler strip between the stems (a sheaf of plumes right across her face, long leaves
   * across her body: nothing of her reads at first look). None: she has been found, a blade or two
   * at her foot. */
  function frontReeds(S, C, a, Z, W, seed) {
    var u = a.h / 100, r = rng(seed || 77), stem = '', leaf = '', pl = '', plLt = '', dark = '', i, x, y, lean, h, off;
    var tall = (W && W.tall) || 165, half = Math.max(12, ((W && W.wide) || 24) / 2), reach = half + 20;
    function sideOff(k) { return (k < 0 ? -1 : 1) * (half * 0.62 + r() * (reach - half * 0.62)) * u; }
    function blade(o2, share, w) {
      x = a.x + o2; y = a.y + (2 + r() * 9) * u; h = share * tall * u; lean = (r() - 0.5) * 12 * u + o2 * 0.08;
      if (r() < 0.5) leaf += bladeD(x, y, h, lean * 1.5, Math.max(1.4, w * u)); else dark += bladeD(x, y, h * 0.94, lean * 1.5, Math.max(1.4, w * 0.9 * u));
    }
    function reed(o2, share) {
      var hh = tall * share * u, dir = o2 < 0 ? -1 : 1, len = Math.max(hh * 0.13, 16 * u);
      x = a.x + o2; y = a.y + (3 + r() * 9) * u; lean = (r() - 0.5) * 8 * u;
      var tx = x + lean, ty = y - hh;
      stem += 'M' + n(x) + ' ' + n(y) + 'Q' + n(x + lean * 0.2) + ' ' + n(y - hh * 0.55) + ' ' + n(tx) + ' ' + n(ty);
      pl += leafD(tx, ty + len * 0.25, len, -Math.PI / 2 + dir * 0.55, len * 0.2) + leafD(tx, ty + len * 0.5, len * 0.84, -Math.PI / 2 + dir, len * 0.17) + leafD(tx, ty + len * 0.7, len * 0.7, -Math.PI / 2 - dir * 0.8, len * 0.15);
      plLt += leafD(tx, ty + len * 0.15, len * 0.8, -Math.PI / 2 - dir * 0.12, len * 0.14);
      leaf += leafD(x + lean * 0.3, y - hh * (0.28 + r() * 0.22), hh * 0.2, -Math.PI / 2 + dir * (0.5 + r() * 0.4), Math.max(1.3, 2 * u));
    }
    // short blades at her foot and legs: across her when they cover, else only out at her sides
    var low = Math.round(4 + 12 * Z.legs);
    for (i = 0; i < low; i++) {
      off = Z.legs >= 1 ? ((i + r()) / low - 0.5) * 2 * reach * u : sideOff(i % 2 ? 1 : -1);
      blade(off, Z.legs >= 1 ? lerp(0.24, 0.46, r()) : Z.legs > 0 ? lerp(0.14, 0.3, r()) : 0.08 + r() * 0.07, 3);
    }
    // longer leaves across her body
    var mid = Math.round(20 * Z.body);
    for (i = 0; i < mid; i++) {
      off = Z.body >= 1 ? ((i + r()) / mid - 0.5) * 2 * reach * u : sideOff(i % 2 ? 1 : -1);
      blade(off, lerp(0.5, 0.74, r()), 2.6);
    }
    // whole reeds, plume and all: a pair at her shoulders whenever she is hiding, and when they
    // cover her head, more of them right across her, their plumes where her face is
    if (Z.legs || Z.body || Z.head) { reed(-(half + 6 + r() * 10) * u, 1.06 + r() * 0.12); reed((half + 5 + r() * 10) * u, 1.0 + r() * 0.16); reed(-(half + 16 + r() * 6) * u, 0.86 + r() * 0.1); }
    var top = Math.round(16 * Z.head);
    for (i = 0; i < top; i++) reed(((i + 0.2 + r() * 0.6) / top - 0.5) * 2 * (half + 4) * u, lerp(0.84, 1.1, (i * 5 % top) / Math.max(1, top - 1)));
    var lw = Math.max(1.3, 2.1 * u);
    return rings(S, C, a.x, a.y + 1.5 * u, 13 * u, 0.6) + path(dark, C.strawDk) + path(leaf, C.straw) + stroke(stem, C.strawDk, lw) +
      stroke(stem, C.strawLt, lw * 0.4, { opacity: 0.8, transform: 'translate(' + n(-lw * 0.3) + ' 0)' }) + path(pl, C.plume) + path(plLt, C.plumeLt, { opacity: 0.95 });
  }
  // What `pale` leaves covered: still a reed, all of her; the flinch shows a little of her face;
  // `knees`, her legs (her face still among the plumes); `blink`, her face.
  var PALE = { reed: 1, flinch: 1, knees: 1, blink: 1 }, REED_THIN = 0.6;
  var COVER = { reed: { legs: 1, body: 1, head: 1 }, flinch: { legs: 1, body: 1, head: 0.4 }, knees: { legs: 0.5, body: 0.3, head: 1 }, blink: { legs: 0.5, body: 0.2, head: 0 }, found: { legs: 0, body: 0, head: 0 } };
  // How she stands at `a`, for the reeds in front of her: as app/art/cats.js draws her, else ours.
  function wispSize(a, pose) {
    if (drawn('wisp')) {
      try {
        var ch = art.character('wisp', { pose: pose || 'reed', mood: 'neutral' }), hb = ch.headBox, k = bandK('wisp') * 100 / refH();
        if (ch && hb && ch.h > 0) return { tall: (ch.h - hb.y0) * k, wide: (hb.x1 - hb.x0) * k };
      } catch (e) { /* ours */ }
    }
    return { tall: 165, wide: 24 };
  }
  // The reeds in front of her, as a group that says what it covers (data-cover; data-zones: her
  // legs, her body, her head, 0 to 1 each).
  function frontGroup(S, C, a, cover, W) {
    var Z = COVER[cover] || COVER.found;
    return g(frontReeds(S, C, a, Z, W, 771), { 'data-part': 'reed-front', 'data-cover': cover, 'data-zones': Z.legs + ' ' + Z.body + ' ' + Z.head });
  }
  /* The set's own Wisp at `reed` (nobody of that name in the cast): returns { body, front }.
   * `reed`: still, eyes shut, the pale reeds across her; `flinch`: one jerk; `knees`: the reeds
   * have parted; `blink`: her eyes are open. */
  function paleReed(S, C, a, mode) {
    mode = PALE[mode] ? mode : 'reed';
    var pose = mode === 'knees' ? 'reed' : mode, real = drawn('wisp') ? wispCast(S, a, pose) : '';
    var body = real || wispOwn(S, C, a, mode), u = a.h / 100, extra = '', W = wispSize(a, pose);
    if (mode === 'flinch') {
      // one jerk: a few quick lines beside her, rings round her foot; the reeds beside her are still
      var x = a.x, y = a.y, w = W.wide / 2 + 14, t = W.tall;
      extra += stroke('M' + n(x - w * u) + ' ' + n(y - t * 0.72 * u) + 'l' + n(-9 * u) + ' ' + n(-5 * u) + 'M' + n(x - (w + 2) * u) + ' ' + n(y - t * 0.6 * u) + 'l' + n(-10 * u) + ' 0M' + n(x + w * u) + ' ' + n(y - t * 0.76 * u) + 'l' + n(9 * u) + ' ' + n(-5 * u) +
        'M' + n(x + (w + 2) * u) + ' ' + n(y - t * 0.63 * u) + 'l' + n(10 * u) + ' 0', C.ring, Math.max(1.4, 2 * u), { opacity: 0.9, 'data-part': 'flinch' }) + rings(S, C, x, y + 3 * u, 30 * u, 0.85);
    }
    // still a reed: thinner yet behind her sheaf of plumes, a paler strip between the stems and no
    // more (found on a second look; her knees, her flinch and her eyes are as solid as she ever is)
    var attrs = { 'data-part': 'pale-reed', 'data-pale': mode, 'data-wisp': real ? 'cast' : 'own' };
    if (mode === 'reed') attrs.opacity = REED_THIN;
    return { body: g(body + extra, attrs), front: frontGroup(S, C, a, mode, W) };
  }

  // ------------------------------------------------------------------ her drawings in the mud

  // What a Case File picture is scratched with (app/art/cards.js), kept here so the mud at her
  // foot can hold the very strokes of her card.
  function Claw() { this.big = true; this.out = []; }
  Claw.prototype.line = function (d, o) { this.out.push({ d: String(d), t: (o && o.t) || '', w: (o && o.w) || 1 }); return this; };
  Claw.prototype.fine = function (d, o) { return this.line(d, o); };
  Claw.prototype.dot = function (x, y, o) { return this.line('M' + n(x) + ' ' + n(y) + 'h.1', { t: o && o.t, w: (o && o.w) || 1.6 }); };

  // One little heron as a claw draws it, on one leg, its foot at (0, 0): about 64 wide, 92 tall.
  function heronGlyph(c, x, y, k, flip) {
    var t = 'translate(' + n(x) + ' ' + n(y) + ') scale(' + n4(flip ? -k : k) + ' ' + n4(k) + ')';
    c.line('M-2 -44C-16 -46 -24 -56 -18 -66C-10 -76 12 -74 22 -62C26 -54 18 -44 6 -44Z', { t: t });                 // the body
    c.line('M14 -68C22 -78 10 -84 14 -92C16 -98 24 -98 26 -92', { t: t });                                           // the neck, in an S
    c.line('M26 -93L44 -89', { t: t });                                                                              // the bill
    c.line('M2 -44L0 0M0 0L-7 3M0 0L7 3M0 0L0 5', { t: t, w: 0.9 });                                                 // one leg, and its foot
    c.line('M-4 -44L-10 -36L-4 -32', { t: t, w: 0.9 });                                                              // the other, tucked up
    c.line('M-16 -62L-28 -56', { t: t, w: 0.9 });                                                                    // a tail feather
    c.dot(21, -94, { t: t, w: 1.2 });                                                                                // the eye
    c.line('M-14 6Q-7 2 0 6T14 6', { t: t, w: 0.7 });                                                                // the water round its leg
  }
  // seven: four above three, as Squall's seven forepaws were scratched (in the card's own box)
  var HERONS = [[27, 112], [75, 112], [123, 112], [171, 112], [51, 192], [99, 192], [147, 192]];
  // Our own fox, for when the card is not drawn yet: a fox's head, a small thing with shine lines
  // falling from its mouth, a ring of ripples under it. In the card's own 200 x 240 box.
  function foxOwn(c) {
    c.line('M52 74L50 102C50 122 66 136 84 136L112 126L96 118C100 104 96 90 86 84L82 62L70 78Z');   // the head, an ear up
    c.line('M52 74L44 54L62 70', { w: 0.9 });                                                        // the far ear
    c.line('M66 100Q71 96 76 100', { w: 0.9 });                                                      // the eye, half shut
    c.dot(111, 126, { w: 1.8 });                                                                     // the nose
    c.line('M118 148L128 156L118 164L108 156Z');                                                     // the small thing, falling
    c.line('M134 144L144 138M136 156H148M134 168L144 174M102 144L94 138', { w: 0.8 });               // it shines
    c.line('M92 196a28 8 0 1 0 56 0a28 8 0 1 0 -56 0ZM76 196a44 13 0 1 0 88 0', { w: 0.8 });         // a ring of ripples
  }
  /* Her drawing, scratched in the mud: D: { x, y (its middle), k (its scale: the card's box is
   * 200 x 240), sq (how much the ground squashes it) }. Returns { svg, box, tip }. */
  function drawingSvg(S, C, D, what) {
    if (!D || (what !== 'herons' && what !== 'fox')) return null;
    var c = new Claw(), k = D.k, sq = D.sq == null ? 1 : D.sq, cx = 100, cy = 132, from = 'own', tip;
    if (what === 'herons') {
      HERONS.forEach(function (q) { heronGlyph(c, q[0], q[1], 0.6, false); });
      tip = [HERONS[6][0] + 12, HERONS[6][1] + 4];
    } else {
      var pic = art.cardPictures && art.cardPictures['wisp-fox'];
      if (pic && typeof pic.draw === 'function') { try { pic.draw(c); from = 'card'; } catch (e) { c = new Claw(); } }
      if (from !== 'card') foxOwn(c);
      tip = [164, 196];
    }
    var T = 'translate(' + n(D.x) + ' ' + n(D.y) + ') scale(' + n4(k) + ' ' + n4(k * sq) + ') translate(' + (-cx) + ' ' + (-cy) + ')';
    var sw = D.sw || 3.2, body = '';
    c.out.forEach(function (it) {
      body += '<path d="' + it.d + '"' + (it.t ? ' transform="' + it.t + '"' : '') + (it.w !== 1 ? ' stroke-width="' + n(sw * it.w) + '"' : '') + '/>';
    });
    // each scratch: a dark groove, the wet lip it raises catching the light
    var s = '<g transform="' + T + '" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<g stroke="' + C.grooveHi + '" stroke-width="' + n(sw) + '" opacity="' + (C.dark ? '.4' : '.8') + '" transform="translate(' + n(1.1) + ' ' + n(1.5) + ')">' + body + '</g>' +
      '<g stroke="' + C.groove + '" stroke-width="' + n(sw) + '" data-strokes="' + c.out.length + '">' + body + '</g></g>';
    var box = { x: D.x - 92 * k, y: D.y - 80 * k * sq, w: 184 * k, h: 156 * k * sq };
    return { svg: g(s, { 'data-part': 'drawing', 'data-drawing': what, 'data-from': from }), box: box, tip: [D.x + (tip[0] - cx) * k, D.y + (tip[1] - cy) * k * sq] };
  }

  /* Her forepaw, in from the edge of the picture, one claw down in the mud: pearl-white, a fine
   * outline, thin enough that the mud shows through; five toes fanned like a hand, a claw pale as
   * frost on each, the middle one long and straight: the one she draws with.
   * B: { tip: [x, y] (that claw's point), from: [x, y] (where the foreleg comes from), w (the paw's width) }. */
  var WISP_TOES = [-0.84, -0.42, 0, 0.42, 0.84];
  function wispPaw(S, C, B) {
    var fill = C.d(WISP.fill, 0.6), line = C.d(WISP.line, 0.6), shade = C.d(WISP.shade, 0.6), claw = C.d(WISP.claw, 0.5), w = B.w, tx = B.tip[0], ty = B.tip[1], fx = B.from[0], fy = B.from[1];
    var ax = tx - fx, ay = ty - fy, al = Math.sqrt(ax * ax + ay * ay) || 1, ux = ax / al, uy = ay / al, nx = -uy, ny = ux, s = '';
    // the middle of the palm, back along the foreleg from the claw's point; a point at angle f off
    // the way the middle toe points, r paw-widths out from the palm
    var REACH = 1.02, px = tx - ux * w * REACH, py = ty - uy * w * REACH;
    function Q(f, r, side) { var c = Math.cos(f), sn = Math.sin(f), q = side || 0; return [px + ((ux * c + nx * sn) * r + (-ux * sn + nx * c) * q) * w, py + ((uy * c + ny * sn) * r + (-uy * sn + ny * c) * q) * w]; }
    var lw = Math.max(1.6, w * 0.03), op = { stroke: line, 'stroke-width': n(lw), 'stroke-linejoin': 'round', 'fill-opacity': 0.74 };
    var cl = { stroke: line, 'stroke-width': n(lw * 0.8), 'stroke-linejoin': 'round', 'data-claw': 'wisp' };
    // the foreleg, back to where she stands, with the soft ridges her scales make
    var arm = [Q(Math.PI, 0.3, -0.27), [fx + nx * w * 0.36, fy + ny * w * 0.36], [fx - nx * w * 0.36, fy - ny * w * 0.36], Q(Math.PI, 0.3, 0.27)], ridges = '';
    s += path(pts(arm) + 'Z', fill, op);
    for (var t = 0.1; t < 0.96; t += 0.1) {
      var a0 = [lerp(arm[0][0], arm[1][0], t), lerp(arm[0][1], arm[1][1], t)], a1 = [lerp(arm[3][0], arm[2][0], t), lerp(arm[3][1], arm[2][1], t)];
      ridges += 'M' + n(a0[0]) + ' ' + n(a0[1]) + 'Q' + n((a0[0] + a1[0]) / 2 + ux * w * 0.06) + ' ' + n((a0[1] + a1[1]) / 2 + uy * w * 0.06) + ' ' + n(a1[0]) + ' ' + n(a1[1]);
    }
    s += stroke(ridges, line, lw * 0.7, { opacity: 0.38 });
    // the toes and their claws: the outer four short, their claws curled; the middle one out straight
    var toes = '', claws = '';
    WISP_TOES.forEach(function (f, i) {
      var mid = i === 2, r1 = mid ? 0.66 : i === 0 || i === 4 ? 0.48 : 0.56, hw = 0.1, P = [Q(f, 0.16, hw)], k;
      for (k = 0; k <= 6; k++) { var a = Math.PI / 2 - Math.PI * k / 6; P.push(Q(f, r1 + Math.cos(a) * hw * 0.9, Math.sin(a) * hw * 0.9)); }
      P.push(Q(f, 0.16, -hw));
      toes += path(pts(P) + 'Z', fill, op);
      var c0 = r1 + 0.03, c1 = mid ? REACH : r1 + 0.24, bend = mid ? 0 : (f < 0 ? -0.05 : 0.05);
      claws += path(pts([Q(f, c0, 0.055), Q(f, (c0 + c1) / 2, 0.03 + bend), Q(f, c1, bend * 1.4), Q(f, (c0 + c1) / 2, -0.03 + bend), Q(f, c0, -0.055)]) + 'Z', claw, cl);
    });
    s += claws + toes;
    // the palm over the roots of the toes, a soft light on it
    var palm = [];
    for (var j = 0; j < 20; j++) { var b = Math.PI * 2 * j / 20; palm.push(Q(0, -0.02 + Math.cos(b) * 0.36, Math.sin(b) * 0.4)); }
    s += path(pts(palm) + 'Z', fill, op);
    var pad = [];
    for (j = 0; j < 14; j++) { var b2 = Math.PI * 2 * j / 14; pad.push(Q(0, -0.08 + Math.cos(b2) * 0.18, -0.08 + Math.sin(b2) * 0.2)); }
    s += path(pts(pad) + 'Z', shade, { opacity: 0.45 });
    // the crumb of mud the claw's point has turned up
    s += path(blob(tx + w * 0.07, ty + w * 0.045, w * 0.09, w * 0.035, 6, rng(9), 0.3, 0.3), C.mudDk, { opacity: 0.6 });
    return g(s, { 'data-part': 'wisp-paw' });
  }

  // ------------------------------------------------------------------ the compositions

  // How tall a sitting cat is at ground height y in composition L (for a spot of its own).
  function depthAt(L, y) { var D = L.depth; return clamp(D[1] + (D[3] - D[1]) * (y - D[0]) / (D[2] - D[0]), 30, 700); }
  // Riffle's pole as app/art/cats.js draws it in his paws: about one and a half sitting cats long,
  // a twenty-sixth of one thick. h: how tall a sitting cat is where it stands.
  function poleLen(h) { return h * 1.53; }
  function poleHalf(h) { return Math.max(3, h * 0.019); }

  var COMPS = {
    // wide: the raft at the left edge, the mud beside it, Patience in the shallows, the reeds behind her
    main: {
      hz: 338, bankH: 78, seed: 7100, sun: [250, 96], sunR: 520, depth: [700, 190, 1000, 300],
      clouds: [[980, 150, 300, 56, 3], [1420, 92, 200, 40, 4], [520, 214, 180, 32, 5]],
      mistFar: [[380, 372, 520, 26, 0.75], [1180, 380, 480, 22, 0.6], [820, 420, 380, 16, 0.4]],
      mistOver: [[560, 452, 260, 22, 0.8], [1240, 712, 420, 30, 0.6], [900, 676, 300, 20, 0.4]],
      log: { x: 560, y: 424, w: 250, h: 15 }, veil: [560, 404, 200, 44, 0.55],
      pads: [[250, 528, 22, 0], [318, 548, 28, 1], [228, 566, 18, 0], [640, 498, 18, 0], [704, 520, 24, 'frog'], [770, 506, 16, 0], [846, 590, 30, 2], [778, 620, 22, 0],
        [1300, 880, 46, 'frog'], [1402, 916, 56, 1], [1232, 936, 38, 0], [1500, 872, 34, 0], [120, 664, 32, 0], [60, 610, 34, 'frog'], [60, 712, 26, 2]],
      padF: 0.34,
      reeds: [
        { x0: -30, x1: 330, y0: 384, y1: 392, h: 62, n: 46, seed: 7111, far: 0.42, pale: 0.25, k: 0.8 },
        { x0: 1120, x1: 1640, y0: 408, y1: 398, h: 96, n: 70, seed: 7112, far: 0.3, pale: 0.3, k: 0.8 },
        { x0: 960, x1: 1090, y0: 664, y1: 674, h: 250, n: 26, seed: 7115, wob: 30, shadow: 's', tails: 0.3, vary: [0.8, 1.05] },
        { x0: 1070, x1: 1450, y0: 656, y1: 686, h: 400, n: 84, seed: 7113, pale: [1070, 1450], wob: 44, shadow: 's', vary: [0.82, 1.12] },
        { x0: 1430, x1: 1640, y0: 676, y1: 692, h: 380, n: 40, seed: 7116, wob: 40, shadow: 's', tails: 0.36 },
        { x0: 1380, x1: 1640, y0: 1010, y1: 1016, h: 430, n: 26, seed: 7114, layer: 'front', k: 1.5, lean: -0.5, shadow: 'm', tails: 0.3 }
      ],
      mud: { P: [[236, 1040], [240, 968], [300, 940], [410, 934], [448, 880], [436, 812], [520, 776], [660, 764], [800, 776], [884, 806], [930, 862], [918, 930], [880, 1040]],
        pebbles: [[690, 742, 190, 14, 26], [950, 860, 26, 60, 14], [470, 790, 30, 20, 6]] },
      raft: { x0: -50, x1: 440, top: 806, bot: 900, k: 1, seed: 561 },
      pole: { x: 476, foot: 892, lean: 6 },
      prints: { line: [[470, 962], [560, 902], [680, 854], [790, 826], [872, 830]], w: 9, w1: 7, gap: 2.4, heron: [760, 900, 54, -2.5], sq: 0.5 },
      patch: [640, 872, 96, 44],
      dive: [690, 690, 60],
      thought: { x: 770, y: 296, len: 60 },
      strings: { xs: [30, 96, 210, 418], y: 862, len: 46 },
      snout: { x: 262, gap: 3 }
    },
    // far: across the water, the three on their log; the raft's corner in front
    far: {
      hz: 292, bankH: 96, seed: 7200, sun: [210, 80], sunR: 520, depth: [600, 150, 1000, 360],
      clouds: [[620, 130, 280, 50, 13], [1300, 80, 220, 44, 14]],
      mistFar: [[700, 330, 620, 30, 0.8], [1250, 344, 420, 24, 0.6]],
      mistOver: [[1000, 428, 330, 30, 0.85], [560, 470, 460, 30, 0.55], [1280, 500, 380, 26, 0.45], [1450, 690, 320, 34, 0.5]],
      log: { x: 1004, y: 392, w: 330, h: 20 }, veil: [1004, 366, 250, 60, 0.5],
      pads: [[380, 560, 30, 0], [470, 590, 38, 'frog'], [330, 610, 24, 1], [820, 600, 34, 0], [900, 640, 44, 2], [760, 680, 30, 'frog'], [1090, 760, 50, 0], [1180, 820, 60, 'frog'], [1010, 850, 40, 1]],
      padF: 0.34,
      reeds: [
        { x0: 640, x1: 1420, y0: 404, y1: 410, h: 84, n: 90, seed: 7211, far: 0.36, pale: 0.3, k: 0.8 },
        { x0: -30, x1: 420, y0: 352, y1: 360, h: 60, n: 50, seed: 7212, far: 0.5, pale: 0.2, k: 0.7 },
        { x0: 1190, x1: 1410, y0: 612, y1: 628, h: 230, n: 40, seed: 7215, wob: 30, shadow: 's', tails: 0.3, vary: [0.8, 1.12] },
        { x0: 1390, x1: 1640, y0: 618, y1: 650, h: 400, n: 60, seed: 7213, pale: [1390, 1640], wob: 40, shadow: 's', vary: [0.82, 1.12] },
        { x0: 1430, x1: 1640, y0: 1010, y1: 1016, h: 460, n: 22, seed: 7214, layer: 'front', k: 1.6, lean: -0.5, shadow: 'm', tails: 0.3 }
      ],
      mud: { P: [[420, 1040], [430, 1004], [540, 990], [556, 924], [620, 892], [760, 896], [842, 942], [834, 1040]], pebbles: [[700, 874, 110, 12, 14]] },
      raft: { x0: -90, x1: 560, top: 852, bot: 966, k: 1.3, seed: 562 },
      pole: { x: 604, foot: 962, lean: 8 },
      prints: { line: [[500, 1012], [600, 986], [680, 946], [770, 928], [830, 940]], w: 11, w1: 9, gap: 2.4, heron: [720, 984, 60, -2.4], sq: 0.5 },
      patch: [700, 948, 72, 32],
      dive: [860, 800, 78],
      thought: { x: 1130, y: 300, len: 52 },
      strings: { xs: [36, 126, 226, 524], y: 928, len: 58 },
      snout: { x: 300, gap: 3 }
    },
    // heron: Patience tall in the panel; our cat and Riffle low in the corner, on the logs
    heron: {
      hz: 318, bankH: 82, seed: 7300, sun: [230, 90], sunR: 540, depth: [700, 200, 972, 300],
      clouds: [[1180, 120, 280, 50, 23], [860, 60, 200, 38, 24]],
      mistFar: [[360, 356, 520, 26, 0.75], [1150, 362, 520, 22, 0.55]],
      mistOver: [[330, 392, 220, 20, 0.8], [1330, 850, 420, 34, 0.55], [820, 760, 320, 22, 0.4]],
      log: { x: 330, y: 366, w: 210, h: 12 }, veil: [330, 350, 160, 36, 0.55],
      pads: [[150, 560, 30, 0], [240, 590, 38, 1], [110, 620, 24, 0], [470, 620, 34, 'frog'], [560, 660, 26, 0], [396, 688, 30, 2], [250, 730, 40, 0],
        [1330, 952, 52, 'frog'], [1450, 978, 60, 1], [1250, 990, 36, 0], [1548, 936, 34, 0]],
      padF: 0.34,
      reeds: [
        { x0: -30, x1: 260, y0: 350, y1: 356, h: 54, n: 40, seed: 7311, far: 0.45, pale: 0.25, k: 0.7 },
        { x0: 640, x1: 1150, y0: 764, y1: 792, h: 330, n: 64, seed: 7315, wob: 40, shadow: 's', tails: 0.3, k: 1.2, vary: [0.8, 1.12] },
        { x0: 1120, x1: 1560, y0: 772, y1: 802, h: 760, n: 90, seed: 7313, pale: [1120, 1560], wob: 50, shadow: 's', k: 1.6, vary: [0.82, 1.1] },
        { x0: 1540, x1: 1650, y0: 792, y1: 802, h: 700, n: 18, seed: 7316, tails: 0.36, k: 1.6, shadow: 's' },
        { x0: 1460, x1: 1650, y0: 1012, y1: 1016, h: 520, n: 18, seed: 7314, layer: 'front', k: 1.8, lean: -0.5, shadow: 'm', tails: 0.3 }
      ],
      mud: { P: [[400, 1040], [410, 1000], [520, 984], [538, 920], [600, 888], [740, 880], [862, 904], [906, 964], [886, 1040]], pebbles: [[720, 858, 140, 12, 18], [930, 952, 22, 40, 8]] },
      raft: { x0: -70, x1: 540, top: 866, bot: 962, k: 1.3, seed: 563 },
      pole: { x: 578, foot: 958, lean: 8 },
      prints: { line: [[470, 1012], [560, 986], [640, 950], [740, 926], [836, 930], [878, 950]], w: 12, w1: 10, gap: 2.4, heron: [716, 984, 66, -2.5], sq: 0.5 },
      patch: [664, 936, 76, 34],
      dive: [720, 800, 84],
      thought: { x: 470, y: 236, len: 64 },
      strings: { xs: [40, 110, 340, 506], y: 928, len: 62 },
      snout: { x: 270, gap: 3 }
    },
    // mud: the mud beside the raft, from the raft; the heron in the shallows beyond, her bill over it
    mud: {
      hz: -40, seed: 7400, depth: [404, 220, 548, 384], noSky: true, streaks: 14, glints: 6,
      mistOver: [[300, 150, 420, 34, 0.5], [1180, 170, 380, 30, 0.4]],
      pads: [[110, 214, 54, 0], [250, 262, 64, 'frog'], [470, 204, 46, 1], [560, 268, 50, 0], [900, 196, 50, 2], [1050, 270, 60, 'frog'], [800, 286, 40, 0]],
      padF: 0.42,
      reeds: [
        { x0: -30, x1: 1650, y0: 122, y1: 138, h: 300, n: 130, seed: 7411, pale: [1150, 1650], wob: 40, k: 1.5, vary: [0.9, 1.3], tails: 0.1 },
        { x0: 1500, x1: 1650, y0: 1016, y1: 1016, h: 520, n: 12, seed: 7414, layer: 'front', k: 2.4, lean: -0.6, shadow: 'm', tails: 0.3 }
      ],
      mud: { P: [[-60, 1060], [-60, 690], [240, 664], [640, 660], [1010, 662], [1096, 606], [1128, 506], [1206, 432], [1348, 420], [1506, 468], [1660, 560], [1660, 1060]], k: 2.2, halo: 70,
        pebbles: [[1300, 372, 150, 20, 26], [1560, 470, 60, 30, 10], [1140, 430, 40, 40, 10]], lumps: 70 },
      raft: { x0: -120, x1: 1010, top: 330, bot: 590, k: 2.3, seed: 564, lash: [0.14, 0.47, 0.86] },
      pole: { x: 1056, foot: 664, lean: 12 },
      // (the line passes under the paw our cat holds out from `raft-edge`: one print lies right there)
      prints: { line: [[40, 900], [250, 800], [400, 708], [480, 672], [570, 688], [700, 720], [940, 746], [1180, 660], [1420, 560], [1560, 520]], w: 21, w1: 18, gap: 2.6, heron: [1010, 868, 176, -2.2], sq: 0.72,
        under: [480, 676] },
      lip: 604,
      patch: [700, 772, 120, 70],
      dive: [1250, 290, 110],
      thought: { x: 1010, y: 236, len: 60 },
      strings: { xs: [100, 450, 640, 890], y: 552, len: 76 },
      snout: { x: 560, gap: 3 }
    },
    // pole: from the top of the pole, over the reed tops: the prints run off toward two shiny lines
    pole: {
      hz: 300, bankH: 60, seed: 7500, sun: [330, 110], sunR: 520, depth: [700, 240, 1000, 330],
      clouds: [[1120, 120, 320, 56, 43], [640, 70, 200, 38, 44]],
      mistFar: [[400, 322, 420, 18, 0.7], [760, 440, 420, 22, 0.45]],
      mistOver: [[700, 540, 520, 30, 0.35]],
      pads: [[560, 470, 22, 0], [640, 492, 28, 1], [520, 510, 18, 0], [820, 600, 34, 0], [900, 640, 44, 'frog'], [760, 680, 30, 2], [1480, 640, 40, 0], [1550, 700, 50, 0], [240, 560, 30, 0], [150, 600, 38, 1]],
      padF: 0.4,
      reeds: [
        { x0: 300, x1: 900, y0: 410, y1: 420, h: 70, n: 66, seed: 7511, far: 0.3, pale: 0.3, k: 0.8 },
        { x0: 1380, x1: 1650, y0: 470, y1: 480, h: 110, n: 40, seed: 7512, far: 0.2, pale: 0.4, k: 0.9 },
        { x0: 560, x1: 1650, y0: 1020, y1: 1030, h: 250, n: 110, seed: 7513, pale: 0.45, wob: 30, k: 1.5, mirror: false, layer: 'front', shadow: 'm', tails: 0.3 },
        { x0: -30, x1: 300, y0: 1020, y1: 1026, h: 300, n: 30, seed: 7514, pale: 0.3, wob: 30, k: 1.5, mirror: false, layer: 'front', shadow: 'm', tails: 0.3 }
      ],
      // the mud winds from under us away to the bank the tracks run along
      mud: { P: [[980, 1060], [1000, 930], [1064, 800], [1130, 690], [1146, 600], [1118, 520], [1132, 450], [1184, 396], [1250, 350], [1334, 344], [1304, 404], [1272, 470], [1292, 560], [1332, 660], [1392, 800], [1470, 930], [1520, 1060]],
        k: 1, halo: 26, lumps: 30 },
      prints: { line: [[1232, 990], [1212, 880], [1212, 770], [1230, 660], [1216, 570], [1200, 500], [1212, 440], [1244, 392], [1288, 356]], w: 17, w1: 3.6, gap: 2.8, sq: 0.6 },
      tracks: { x0: 560, y0: 344, x1: 1660, y1: 322 },
      top: { x: 420, y: 800, w: 9 }
    },
    // reeds: the stand of reeds, and the one that is paler than the rest
    reeds: {
      hz: 246, bankH: 70, seed: 7600, sun: [200, 70], sunR: 500, depth: [700, 250, 1000, 330],
      clouds: [[420, 90, 260, 44, 53]],
      mistFar: [[300, 270, 420, 20, 0.6]],
      mistOver: [[1040, 782, 620, 34, 0.5], [300, 660, 300, 24, 0.4]],
      pads: [[560, 800, 30, 0], [742, 832, 40, 1], [1104, 946, 44, 'frog'], [1272, 858, 40, 2], [1446, 930, 56, 'frog'], [1180, 962, 34, 0], [1560, 850, 30, 0], [250, 700, 34, 0], [150, 742, 42, 0], [236, 566, 30, 'frog']],
      padF: 0.34,
      reeds: [
        { x0: -30, x1: 380, y0: 300, y1: 310, h: 70, n: 40, seed: 7611, far: 0.4, pale: 0.2, k: 0.8 },
        { x0: 380, x1: 900, y0: 700, y1: 732, h: 400, n: 80, seed: 7615, wob: 50, shadow: 's', tails: 0.3, k: 1.4 },
        { x0: 860, x1: 1420, y0: 716, y1: 762, h: 620, n: 110, seed: 7613, pale: [860, 1420], wob: 60, shadow: 's', k: 1.6, vary: [0.82, 1.1] },
        { x0: 1400, x1: 1650, y0: 750, y1: 772, h: 560, n: 36, seed: 7616, wob: 40, shadow: 's', tails: 0.36, k: 1.5 },
        { x0: 1470, x1: 1650, y0: 1012, y1: 1016, h: 560, n: 16, seed: 7614, layer: 'front', k: 2, lean: -0.5, shadow: 'm', tails: 0.3 }
      ],
      mud: { P: [[300, 1040], [310, 1008], [400, 996], [414, 930], [470, 892], [600, 888], [680, 924], [690, 1040]], pebbles: [[560, 872, 110, 10, 12]] },
      raft: { x0: -80, x1: 420, top: 876, bot: 976, k: 1.25, seed: 565 },
      pole: { x: 462, foot: 968, lean: 6 },
      prints: { line: [[380, 1014], [450, 990], [520, 950], [600, 930], [664, 940]], w: 11, w1: 9, gap: 2.4, heron: [560, 984, 56, -2.4], sq: 0.5 },
      dive: [900, 880, 84],
      thought: { x: 330, y: 300, len: 58 },
      strings: { xs: [24, 100, 316, 400], y: 940, len: 52 },
      snout: { x: 235, gap: 3 }
    },
    // wisp: close on the pale dragonet on one leg among the reeds, the heron beside her
    wisp: {
      hz: 150, bankH: 50, seed: 7700, sun: [180, 40], sunR: 420, depth: [900, 440, 1000, 520],
      mistOver: [[1140, 910, 620, 40, 0.45], [300, 830, 360, 30, 0.35]],
      pads: [[1520, 962, 44, 'frog'], [1574, 926, 32, 1], [730, 978, 30, 0]],
      padF: 0.3,
      reeds: [
        { x0: -30, x1: 800, y0: 838, y1: 850, h: 760, n: 56, seed: 7715, wob: 50, shadow: 's', tails: 0.16, k: 2.2 },
        { x0: 760, x1: 1650, y0: 842, y1: 858, h: 900, n: 90, seed: 7713, pale: [760, 1650], wob: 60, shadow: 's', k: 2.4, vary: [0.9, 1.2] }
      ],
      mud: { P: [[380, 1040], [392, 1000], [440, 972], [520, 968], [600, 992], [700, 998], [820, 990], [900, 966], [990, 946], [1190, 938], [1390, 948], [1460, 980], [1450, 1040]], k: 1.4, halo: 34,
        pebbles: [[840, 960, 40, 12, 8], [560, 952, 60, 8, 6]], lumps: 16 },
      raft: { x0: -120, x1: 400, top: 884, bot: 972, k: 1.3, seed: 566 },
      pole: { x: 446, foot: 990, lean: 6 },
      dive: [770, 946, 60],
      thought: { x: 836, y: 190, len: 50 },
      drawing: { x: 1010, y: 976, k: 0.8, sq: 0.34, sw: 4.4 },
      strings: { xs: [16, 86, 290, 372], y: 946, len: 50 },
      snout: { x: 215, gap: 3 }
    },
    // draw: close on the mud at her foot; the raft, our cat and the heron small behind
    draw: {
      hz: -40, seed: 7800, depth: [214, 176, 276, 130], noSky: true, streaks: 12, glints: 6,
      mistOver: [[420, 120, 420, 30, 0.4]],
      pads: [[620, 100, 34, 1], [960, 96, 36, 0], [1010, 176, 46, 'frog'], [900, 214, 30, 2], [600, 216, 26, 0]],
      padF: 0.38,
      reeds: [
        { x0: -30, x1: 620, y0: 104, y1: 112, h: 240, n: 60, seed: 7812, wob: 24, k: 1.1, vary: [0.9, 1.3], tails: 0.12 },
        { x0: 1060, x1: 1650, y0: 250, y1: 300, h: 420, n: 44, seed: 7811, pale: [1060, 1650], wob: 60, k: 2.4, shadow: 's', vary: [0.9, 1.3] }
      ],
      mud: { P: [[-60, 1060], [-60, 304], [200, 270], [520, 258], [900, 300], [1250, 340], [1660, 334], [1660, 1060]], k: 2.4, halo: 50, lumps: 80,
        pebbles: [[1060, 282, 180, 12, 20], [700, 250, 90, 10, 10]] },
      raft: { x0: 60, x1: 500, top: 176, bot: 238, k: 0.72, seed: 567 },
      pole: { x: 528, foot: 272, lean: 3 },
      dive: [690, 196, 44],
      thought: { x: 600, y: 140, len: 34 },
      drawing: { x: 700, y: 668, k: 3.3, sq: 0.86, sw: 3 },
      paw: { from: [1650, 250], w: 200, rest: [1040, 600] },
      strings: { xs: [96, 232, 312, 452], y: 216, len: 30 },
      snout: { x: 272, gap: 3 }
    }
  };

  // ------------------------------------------------------------------ the far tracks (from the pole)

  // Two shiny lines, far away, along a low bank at the marsh's edge: a bed of pale stones, the
  // ties too small to count. T: { x0, y0, x1, y1 }: the line of the rails.
  function tracksSvg(S, C, T) {
    var a = [T.x0, T.y0], b = [T.x1, T.y1], s = '', gap = 8, r = rng(7590);
    function Y(x) { return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); }
    // the bank: grass on its shoulders, running into the reeds at its near end
    var bank = 'M' + n(a[0] - 150) + ' ' + n(a[1] + 30) + 'Q' + n(a[0] - 60) + ' ' + n(a[1] + 26) + ' ' + n(a[0] - 10) + ' ' + n(a[1] + 2) + 'L' + n(b[0]) + ' ' + n(b[1] + 2) + 'V' + n(b[1] + 44) + 'Q' + n((a[0] + b[0]) / 2) + ' ' + n((a[1] + b[1]) / 2 + 30) + ' ' + n(a[0] - 150) + ' ' + n(a[1] + 30) + 'Z';
    s += path(bank, mix(C.farNear, C.mudLt, 0.3)) + path(bank, C.rim, { opacity: 0.3, transform: 'translate(0 -2)' }) + path(bank, mix(C.farNear, C.mudLt, 0.3));
    var tuft = '';
    for (var tx = a[0] - 60; tx < b[0]; tx += 16 + r() * 26) tuft += bladeD(tx, Y(Math.max(tx, a[0])) + 14 + r() * 16, 8 + r() * 9, (r() - 0.5) * 5, 1.5);
    s += path(tuft, C.farNear, { opacity: 0.9 });
    s += stroke(pts([a, b]), C.bed, 17, { 'stroke-linecap': 'butt' });
    var ties = '';
    for (var x = a[0] + 8; x < b[0]; x += 15) ties += 'M' + n(x) + ' ' + n(Y(x) - 7.5) + 'v15';
    s += stroke(ties, C.tie, 2.4, { opacity: 0.6, 'stroke-linecap': 'butt' });
    s += stroke(pts([[a[0], a[1] - gap / 2], [b[0], b[1] - gap / 2 - 1]]), C.rail, 2.6, { 'data-rail': '1' }) + stroke(pts([[a[0], a[1] + gap / 2], [b[0], b[1] + gap / 2 + 1]]), C.rail, 3, { 'data-rail': '2' });
    if (!C.dark) [0.34, 0.72].forEach(function (f, i) { s += path(K.sparkleD(lerp(a[0], b[0], f), lerp(a[1], b[1], f) - 3, i ? 15 : 11), '#FFFFFF', { opacity: 0.95, 'class': 'pcs-glint', style: i ? 'animation-delay:-1.4s' : null }); });
    return g(s, { 'data-part': 'tracks' });
  }

  // ------------------------------------------------------------------ the spots

  // `raft-1` is our cat's place, `raft-2` Riffle's, on her right at the raft's mud end. `shallows`
  // and `reed` are in the water (no shadow is laid there: the set draws rings); `reed` and the three
  // on the log are behind the mist and the nearer reeds.
  var WET = { air: true }, FAR = { z: 'behind', air: true }, LOGC = { z: 'behind' };
  var SPOTS = {
    main: {
      'raft-1': A(150, 858, 248), 'raft-2': A(338, 852, 246), shallows: A(980, 812, 262, 'left', WET), reed: A(1262, 718, 205, 'left', FAR),
      'log-1': A(494, 424, 46, 'left', LOGC), 'log-2': A(560, 422, 46, 'left', LOGC), 'log-3': A(626, 424, 46, 'left', LOGC)
    },
    far: {
      'raft-1': A(170, 924, 330), 'raft-2': A(420, 918, 327), shallows: A(1300, 730, 230, 'left', WET), reed: A(1512, 654, 190, 'left', FAR),
      'log-1': A(924, 392, 64, 'left', LOGC), 'log-2': A(1004, 390, 64, 'left', LOGC), 'log-3': A(1084, 392, 64, 'left', LOGC)
    },
    heron: {
      'raft-1': A(150, 926, 300), 'raft-2': A(390, 920, 298), shallows: A(1010, 962, 440, 'left', WET), reed: A(1340, 852, 380, 'left', FAR),
      'log-1': A(276, 366, 40, 'left', LOGC), 'log-2': A(330, 364, 40, 'left', LOGC), 'log-3': A(384, 366, 40, 'left', LOGC)
    },
    // (`raft-edge`: the spot is where her held-out paw hangs; her feet are on the log's lip, above it)
    mud: { 'raft-1': A(330, 548, 384), 'raft-2': A(700, 540, 380), 'raft-edge': A(360, 656, 450, 'right', { air: true, elev: true }), shallows: A(1400, 404, 220, 'left', WET) },
    pole: { 'pole-top': A(420, 800, 290, 'right', { elev: true, air: true }) },
    reeds: { 'raft-1': A(140, 938, 318), 'raft-2': A(330, 934, 316), shallows: A(640, 900, 330, 'left', WET), reed: A(1130, 774, 300, 'left', FAR) },
    wisp: { 'raft-1': A(120, 944, 330), 'raft-2': A(310, 940, 328), shallows: A(640, 968, 500, 'left', WET), reed: A(1180, 930, 480, 'left', FAR) },
    draw: { 'raft-1': A(190, 214, 176), 'raft-2': A(360, 210, 174), shallows: A(820, 276, 130, 'left', WET) }
  };
  // The top of the planted pole, wherever a composition shows all of it: a cat can sit there.
  Object.keys(COMPS).forEach(function (k) {
    var L = COMPS[k], AM = SPOTS[k], r2 = AM['raft-2'];
    if (!L.pole || !r2) return;
    L.pole.w = poleHalf(r2.h);
    L.pole.top = L.pole.foot - poleLen(r2.h);
    if (L.pole.top - r2.h * 0.9 > 0 && AM.reed) AM['pole-top'] = A(L.pole.x + L.pole.lean, Math.round(L.pole.top), r2.h, 'left', { elev: true, air: true });
  });

  // A heron stands about this many sitting cats tall, as app/art/cats.js draws her (the layouts
  // are made for it: where her head comes, where the thought cloud goes).
  var TALL = 1.62;

  // ------------------------------------------------------------------ what the cast reports

  // Where the dragonfly's feet rest on the heron's bill, its turn and its size: from what her
  // drawing reports (`bill`, in her box; `_marks.scale`, her fit), else out along her face.
  function billSpot(hf) {
    var ch = hf.ch, b = ch.bill, dir = hf.face === 'left' ? -1 : 1, hw = hf.head[2] - hf.head[0], hh = hf.head[3] - hf.head[1];
    if (b && isFinite(+b.x) && isFinite(+b.y) && ch.head) {
      // the bill's own slope (her head turns with her neck): the dragonfly lies along it
      var ang = Math.atan2(+b.y - ch.head.y, Math.abs(+b.x - ch.head.x)) * 180 / Math.PI + 3.7 - 5;
      return { x: hf.X(+b.x), y: hf.Y(+b.y), k: 0.92 * ((ch._marks && +ch._marks.scale > 0) ? +ch._marks.scale : 1) * hf.k, rot: dir > 0 ? ang : -ang, flip: dir < 0 };
    }
    return { x: (hf.head[0] + hf.head[2]) / 2 + dir * hw * 0.3, y: hf.head[1] + hh * 0.62, k: Math.max(0.5, hw / 60), rot: 0, flip: dir < 0 };
  }
  // The pole in Riffle's paws, as scenes.js will draw it: its box in the world, the line of it, the
  // top of his head, and where his paws are on it; from what his drawing reports (`pole`:
  // { x0, y0, x1, y1, w } in his box, and `held`), else a guess beside him.
  function heldPole(S, AM, L) {
    var m = castOf(S, function (c) { return c.holds === 'pole'; });
    if (!m) return null;
    var a = spotOf(S, m, AM, L), f = a ? figure(S, m, a) : null;
    if (!a) return null;
    if (f) {
      var p = f.ch.pole, h = f.ch.held && f.ch.held.what === 'pole' ? f.ch.held : null;
      if (p && isFinite(+p.x0) && isFinite(+p.y0) && isFinite(+p.x1) && isFinite(+p.y1)) {
        var xa = f.X(+p.x0), ya = f.Y(+p.y0), xb = f.X(+p.x1), yb = f.Y(+p.y1), w = Math.max(6, (+p.w > 0 ? +p.w : 8) * f.k);
        var out = { x: Math.min(xa, xb) - w / 2, y: Math.min(ya, yb), w: Math.abs(xb - xa) + w, h: Math.abs(yb - ya), line: [xa, ya, xb, yb], head: f.head ? f.head[1] : null };
        if (h && isFinite(+h.x) && isFinite(+h.y)) out.at = [f.X(+h.x), f.Y(+h.y)];
        return out;
      }
      if (h && isFinite(+h.x) && isFinite(+h.y)) { var r = Math.max(8, (+h.r > 0 ? +h.r : 6) * f.k); return { x: f.X(+h.x) - r, y: f.Y(+h.y) - a.h * 0.7, w: r * 2, h: a.h * 1.4, at: [f.X(+h.x), f.Y(+h.y)] }; }
    }
    var dir = (m.facing || a.face || 'right') === 'left' ? -1 : 1;
    return { x: a.x + dir * a.h * 0.12 - a.h * 0.03, y: a.y - a.h * 1.4, w: a.h * 0.06, h: a.h * 1.45 };
  }

  // ------------------------------------------------------------------ draw

  function draw(S) {
    var L = COMPS[S.comp] || COMPS.main, AM = SPOTS[S.comp] || SPOTS.main, C = colors(S), o = S.opts || {}, back = '', over = '', front = '';
    var planted = o.pole === 'planted', tap = o.tap === 'mud' || o.tap === 'pole' ? o.tap : 'none';
    var heron = castAt(S, 'shallows'), hf = heron && AM.shallows ? figure(S, heron, AM.shallows) : null;

    // ---- far to near: the sky, the water, the far bank in it, mist, the far log
    if (!L.noSky) back += skyLayer(S, C, L);
    back += waterLayer(S, C, L);
    if (!L.noSky) back += farBank(S, C, L);
    back += waterShine(S, C, L);
    back += mist(S, C, L.mistFar, 'far');
    if (L.tracks) back += tracksSvg(S, C, L.tracks);
    if (L.log) back += farLog(S, C, L.log);
    back += reeds(S, C, L, 'back');
    back += pads(S, C, L);

    // ---- the pale reed: ours, unless the cast has brought her. While she is still being a reed
    // (her pose `reed` or `flinch`) the reeds stay in front of her, as `pale` says; once she has
    // been found (any other pose) only a blade or two at her foot.
    var ra = AM.reed, wisp = castWho(S, 'wisp');
    if (ra) {
      if (wisp) {
        if (wisp.at === 'reed') {
          var hiding = !wisp.pose || wisp.pose === 'reed' || wisp.pose === 'flinch', cv = hiding ? (PALE[o.pale] ? o.pale : 'reed') : 'found';
          S.covers.reed = frontGroup(S, C, ra, cv, wispSize(ra, wisp.pose));
        }
      } else {
        var PR = paleReed(S, C, ra, o.pale);
        back += PR.body + PR.front;
      }
    }

    // ---- the mud flat, what is in it, the raft, the pole
    back += mudFlat(S, C, L);
    var patch = L.patch;
    if (tap === 'mud' && patch) back += tapMark('mud', patch[0], patch[1], patch[2], patch[3]);
    if (o.prints === true && L.prints) back += printsSvg(S, C, L.prints);
    var D = L.drawing ? drawingSvg(S, C, L.drawing, o.drawing) : null;
    if (D) back += D.svg;
    if (L.paw) front += wispPaw(S, C, { tip: D ? D.tip : L.paw.rest, from: L.paw.from, w: L.paw.w });
    if (L.raft) back += g(raftSvg(S, C, L.raft), { filter: S.shadow('m') });
    // ---- our cat at the raft's edge, a paw held out over the prints (`raft-edge`): her shadow on
    // the log where her feet are (the spot is `air` to scenes.js: with `reach` her paw hangs below
    // her feet), a small one on the mud under the paw, and the lettering keeps off the paw and its print
    var edgeCat = AM['raft-edge'] ? castAt(S, 'raft-edge') : null;
    if (edgeCat) {
      var ea = AM['raft-edge'], ef = figure(S, edgeCat, ea), rc = ef && ef.ch.reach, lipY = rc ? ef.Y(rc.edge) : ea.y;
      var sh = ell(ea.x, lipY - 1, ea.h * 0.33, Math.max(2.5, ea.h * 0.036), C.shade, { opacity: 0.28 });
      if (rc) {
        var under = L.prints && L.prints.under ? printsFor(L.prints).at : null, pwx = ef.X(rc.x), pwy = ef.Y(rc.y), pr = rc.r * ef.k;
        var gy = under ? under.y : pwy + pr * 2.2;
        sh += ell(pwx, gy + pr * 0.1, pr * 1.05, pr * 0.42, C.shade, { opacity: 0.24, 'data-part': 'paw-shadow' });
        keep(S, pwx - pr * 2.4, pwy - pr * 1.6, pr * 4.8, gy - pwy + pr * 3.4);
      }
      back += g(sh, { 'data-part': 'edge-shadow' });
    }
    // the top of the pole we are looking from: it comes up from below the picture
    if (L.top) back += poleSvg(S, C, { x: L.top.x, foot: 1040, top: L.top.y, w: L.top.w, lean: 0 }, false);
    var poleBox = null;
    if (L.pole && (planted || castAt(S, 'pole-top'))) {
      var P = L.pole, R0 = L.raft;
      back += poleSvg(S, C, { x: P.x, foot: P.foot, top: P.top, w: P.w, lean: P.lean, tie: R0 ? [R0.x1 - 34 * R0.k, R0.top + (R0.bot - R0.top) * 0.42] : null }, planted);
      poleBox = { x: Math.min(P.x, P.x + P.lean) - P.w, y: P.top, w: Math.abs(P.lean) + P.w * 2, h: P.foot - P.top };
    } else if (L.pole && L.raft && AM['raft-2'] && !castOf(S, function (c) { return c.holds === 'pole'; })) {
      // nobody has it and it is not planted: it lies along the raft's near log, at their feet
      back += lyingPole(S, C, L.raft, AM['raft-2']);
    }
    // where he dived: a ring of ripples, a bubble or two (she is alone on the logs; he is coming back)
    if (planted && L.dive) {
      var dv = L.dive;
      back += g(rings(S, C, dv[0], dv[1], dv[2], 0.85) + path(dot(dv[0] - dv[2] * 0.14, dv[1] - dv[2] * 0.04, dv[2] * 0.05) + dot(dv[0] + dv[2] * 0.1, dv[1] - dv[2] * 0.1, dv[2] * 0.035) + dot(dv[0] + dv[2] * 0.02, dv[1] + dv[2] * 0.03, dv[2] * 0.028), C.ring, { opacity: 0.9 }),
        { 'data-part': 'dive' });
    }

    // ---- the heron's place: the still water over her foot, a ring round her leg
    if (heron && AM.shallows) {
      var sa = AM.shallows;
      S.covers.shallows = g(ell(sa.x, sa.y - sa.h * 0.012, sa.h * 0.12, sa.h * 0.026, C.water, { opacity: 0.6 }) + rings(S, C, sa.x, sa.y - sa.h * 0.02, sa.h * 0.15, 0.8), { 'data-part': 'wade' });
    }

    // ---- mist round the reeds' feet and over the far water: the three on the log are in it
    if (L.veil) over += g(ell(L.veil[0], L.veil[1], L.veil[2], L.veil[3], S.radB('veil', [[0, C.mist, 0.9], [0.6, C.mist, 0.5], [1, C.mist, 0]]), { opacity: n4(L.veil[4] * C.mistOp) }), { 'data-part': 'veil' });
    over += mist(S, C, L.mistOver, 'over');
    over += reeds(S, C, L, 'over');
    // ---- the frogs: out on the water, so before the cast (never on a diving otter's head, a
    // swimmer's back or our cat's ear)
    over += frogs(S, C, L, o.frogs === 'jump' ? 'jump' : 'sit');

    // ---- what Riffle owes, over her head
    if (L.thought && +o.owed > 0) {
      var T = L.thought, crown = null;
      if (hf && hf.head) crown = [(hf.head[0] + hf.head[2]) / 2 + (hf.face === 'left' ? 1 : -1) * (hf.head[2] - hf.head[0]) * 0.18, hf.head[1]];
      else if (AM.shallows) crown = [AM.shallows.x - AM.shallows.h * 0.2, AM.shallows.y - AM.shallows.h * TALL];
      front += thoughtSvg(S, C, { x: T.x, y: T.y, len: T.len, head: crown }, o.owed);
    }

    // ---- on the logs: the catch, a snout between two of them
    if (L.strings) front += stringsSvg(S, C, L.strings, o.fish);
    if (o.snout === true && L.snout && L.raft && !castWho(S, 'puddle')) front += snoutSvg(S, C, L.snout.x, raftGap(L.raft, L.snout.gap).y, (AM['raft-2'] ? AM['raft-2'].h : 240) / 200 * bandK('puddle'));

    // ---- the dragonfly (not ours when the cast wears it: `dragonfly: true` is cats.js's own)
    if (o.dragonfly === 'beak' && hf && hf.head && !heron.dragonfly) {
      var bs = billSpot(hf);
      front += dragonfly(S, C, bs.x, bs.y, bs.k, bs.rot, true, bs.flip);
    } else if (o.dragonfly === 'nose') {
      var me = castWho(S, 'player'), ms = me && !me.dragonfly ? spotOf(S, me, AM, L) : null, mf = ms ? figure(S, me, ms) : null;
      if (mf && mf.head && mf.ch.head) {
        var mw = mf.head[2] - mf.head[0], mh = mf.head[3] - mf.head[1];
        front += dragonfly(S, C, mf.X(mf.ch.head.x) - mw * 0.02, mf.Y(mf.ch.head.y) + mh * 0.2, mw * 0.4 / 31, -8, false, false);
      }
    }

    // ---- foreground reeds
    front += reeds(S, C, L, 'front');

    // ---- what the lettering keeps off, the thing to tap first
    if (D && S.comp === 'draw') keep(S, D.box.x, D.box.y, D.box.w, D.box.h, true);
    if (L.tracks) { var Tk = L.tracks; keep(S, lerp(Tk.x0, Tk.x1, 0.5), Math.min(Tk.y0, Tk.y1) - 26, (Tk.x1 - Tk.x0) * 0.34, 64, true); }
    var pointing = !!heron && heron.pose === 'point';
    if (patch && (S.comp === 'mud' || tap === 'mud' || pointing)) keep(S, patch[0] - patch[2], patch[1] - patch[3], patch[2] * 2, patch[3] * 2, true);
    if (tap === 'pole') {
      // on the pole just over his head, where it stands clear of him (the page's glow there says
      // "the pole", not "Riffle"); planted, a little above half way up it. A round target about a
      // paw's reach across, since the pole itself is thin
      var held = heldPole(S, AM, L) || poleBox;
      if (held) {
        var hy0 = Math.max(held.y, 30), hy1 = Math.min(held.y + held.h, 980), near = AM['raft-2'] || AM['raft-1'], pr = clamp((near ? near.h : 240) * 0.2, 56, 84);
        var cy = lerp(hy0, hy1, 0.42), cx = held.x + held.w / 2;
        if (held.line && held.head != null && held.line[3] !== held.line[1]) {
          cy = clamp(held.head - pr * 0.75, hy0 + pr * 0.4, hy1 - pr);
          cx = held.line[0] + (held.line[2] - held.line[0]) * (cy - held.line[1]) / (held.line[3] - held.line[1]);
        } else if (held.at) { cx = held.at[0]; cy = clamp(held.at[1] - pr * 0.4, hy0 + pr, hy1 - pr); }
        front += tapMark('pole', cx, cy, pr, pr);
        keep(S, cx - pr, cy - pr, pr * 2, pr * 2, true);
      }
    }
    return { back: back, over: over, front: front };
  }

  // ------------------------------------------------------------------ the set

  art.defineSet('marsh', {
    label: 'the marsh at Roaches Run', tod: 'day', todMap: { sunset: 'golden' }, draw: draw,
    cams: {
      wide: { box: [0, 0, 1600] },
      far: { box: [0, 0, 1600], comp: 'far' },
      heron: { box: [0, 0, 1600], comp: 'heron' },
      mud: { box: [0, 0, 1600], comp: 'mud' },
      pole: { box: [0, 0, 1600], comp: 'pole' },
      reeds: { box: [0, 0, 1600], comp: 'reeds' },
      wisp: { box: [0, 0, 1600], comp: 'wisp' },
      draw: { box: [0, 0, 1600], comp: 'draw' }
    },
    anchors: SPOTS,
    opts: {
      prints: [false, true], fish: ['none', 'strings', 'spare'], owed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], pole: ['none', 'planted'],
      dragonfly: ['none', 'beak', 'nose'], frogs: ['sit', 'jump'], pale: ['reed', 'flinch', 'knees', 'blink'], snout: [false, true],
      drawing: ['none', 'herons', 'fox'], tap: ['none', 'mud', 'pole']
    },
    defaults: { fish: 'none', owed: 0, pole: 'none', dragonfly: 'none', frogs: 'sit', pale: 'reed', drawing: 'none', tap: 'none' }
  });

  // For the tests and the gallery: where each composition puts its things.
  art.marshInfo = function () {
    var out = {};
    Object.keys(COMPS).forEach(function (k) {
      var L = COMPS[k];
      out[k] = JSON.parse(JSON.stringify({ hz: L.hz, sky: !L.noSky, depth: L.depth, raft: L.raft || null, pole: L.pole || null, mud: L.mud ? L.mud.P : null, patch: L.patch || null, dive: L.dive || null,
        thought: L.thought || null, strings: L.strings || null, snout: L.snout || null, prints: L.prints ? { line: L.prints.line, w: L.prints.w, w1: L.prints.w1, gap: L.prints.gap, heron: L.prints.heron, sq: L.prints.sq, under: L.prints.under } : null,
        lip: L.lip == null ? null : L.lip, printUnder: L.prints && L.prints.under ? (function (q) { return { x: q.x, y: q.y, w: q.w }; })(printsFor(L.prints).at) : null,
        drawing: L.drawing || null, paw: L.paw || null, log: L.log || null,
        tracks: L.tracks || null, top: L.top || null, pads: L.pads || [], reeds: (L.reeds || []).map(function (q) { return { x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, h: q.h, vary: q.vary || [0.72, 1.18], pale: q.pale || 0, layer: q.layer || 'back' }; }) }));
    });
    return out;
  };
  // Where the set takes a cast member's drawing to land (as scenes.js places it): its scale, the
  // middle of its head, its head box; null when the camera does not show the spot.
  art.marshInfo.figure = function (cam, m, look) {
    var comp = { wide: 'main' }[cam] || cam, L = COMPS[comp], AM = SPOTS[comp];
    if (!L || !AM || !m) return null;
    var a = spotOf({}, m, AM, L), f = a ? figure({ look: look || {} }, m, a) : null;
    if (!f) return null;
    return { k: f.k, head: f.ch.head ? [f.X(f.ch.head.x), f.Y(f.ch.head.y)] : null, box: f.head || null };
  };
  art.marshInfo.puddle = PUDDLE;
  art.marshInfo.wisp = WISP;
  art.marshInfo.dragonfly = DFLY;
  art.marshInfo.tall = TALL;
  art.marshInfo.sizeBand = SIZE_BAND;
  art.marshInfo.castTint = CAST_TINT;
  art.marshInfo.reedThin = REED_THIN;

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

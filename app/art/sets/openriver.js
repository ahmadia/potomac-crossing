/* Potomac Crossing · app/art/sets/openriver.js
 *
 * The set: the open river under the Roar (chapter 5, "Riffle's River"): the ferry raft out on wide,
 * bright water. The Crossing's rocks are close behind it, a few raft-lengths off, with the three
 * ferry otters on them; the glass towers stand in the water upside down (the tallest with its red
 * light); far across the river a tall white needle of stone stands above the trees. The raft is the
 * Crossing's, close for the first time: four logs lashed with vines, riding low, a long pole.
 *
 * The rules of the place (docs/chapters/05-riffles-river.md, "Art needs"; tests/set-openriver.test.js
 * holds the set to every one of them):
 *   - The water is the Crossing's own sunny water, a page further out: BRIGHT BLUE, the colour of
 *     the sky toward the far shore, a touch greener and deeper near the raft, and NEVER DARK, never
 *     black, never murky, in any light a frame can ask for (README, "Claude's calls under decision
 *     46": the text's "green-brown" was there to keep the river from looking dark and frightening,
 *     and drawn that way it read as a lawn). The set has two lights: day (the default; `morning` is
 *     a paler day) and the late gold of the way home (`late: true`, or fx sunset): the sky's gold
 *     lies on the far water and the water under the raft is a soft evening blue, still plainly a
 *     river. Dusk and night are not this set's: they draw the late gold.
 *   - NOTHING is ever drawn as a shape under the raft: no shadow, no reflection, no dark patch. What
 *     is under it is only ever shown by what comes up: small rings (`shiver`), a foot between two
 *     logs (`foot`), two nostrils and a string of bubbles (`bubbles`), and then his head, in plain
 *     sight, beside the raft.
 *   - The airplane is always WELL ABOVE the raft, never level with it; nothing blows, and the water
 *     under it stays flat: every `plane` value draws the same water, raft and rocks, to the byte.
 *     It casts no shadow.
 *   - Nobody but an otter or a dragonet is ever in the water: the one spot in it is `beside` (the
 *     river laps over whoever is there), and no frame puts a cat at it.
 *
 * Nine cameras, each its own composition in the 1600 x 1000 world:
 *   wide    the wonder screen: the raft small on the shining river, the towers and their
 *           reflections at the left, the needle far off at the right.
 *   raft    cat height on the logs: our cat (`raft-1`) and Riffle (`raft-2`) shoulder to shoulder;
 *           the rocks behind them with the otters, and whoever is at `far-rocks` on the tall one.
 *   light   far down the river, one bright light low in the sky (the airplane `far`, which this
 *           camera draws unless told `plane: 'none'`), growing (`near`); the raft in the near corner.
 *   log     THE ROAR'S PANEL, as she sees it: her own two forepaws on a log (drawn here, from the
 *           player's look), Riffle's webbed forepaw planted on the same log close beside them, not
 *           touching, his shoulder at the panel's edge; the flat water; the rocks behind, with the
 *           otters and Tallyheart on the tall rock, one paw up; and all the sky above for the
 *           skymonster at three sizes (`plane: 'far' | 'near' | 'over'`: a glint, a shape with wings,
 *           a belly filling the top of the panel; `far` unless the frame says). `claws: 0-9` digs
 *           that many claws into the log, left to right, each lit gold (five on her left paw, four on
 *           her right); the tenth, the last toe of her right paw, stays tucked ("one tucked for
 *           luck"). The Tap redraws this scene with `claws` as her taps so far (`taps` counts the same),
 *           and the skymonster comes on with every one: far for claws 1 to 3, near for 4 to 6, over
 *           from 7 (the Tap's `steps`), growing a little at each claw within its size.
 *           Tallyheart is the cast's when someone is at `far-rocks` (or she is anywhere in the cast);
 *           otherwise the set draws her there itself, so the picture is never without her raised
 *           paw, from before the first tap (never in the late gold, and not with `plane: 'gone'`:
 *           after the Roar she goes home). The only anchor here is `far-rocks`: the cat and Riffle are
 *           the picture's own, and a cast member at `raft-1` or `raft-2` is out of this camera's sight.
 *   sky     straight up from the raft: the airplane's belly and its row of little round windows
 *           (drawn unless told `plane: 'none'`: only blue sky); with `face: true`, one small face at
 *           one of them, never a wave. Heads at `raft-1`, `raft-2` and `pole` look up from the
 *           bottom edge.
 *   rocks   from the raft, looking back: the otters slapping their tails on the water (always, in
 *           this camera), whoever is at `far-rocks` on the tall rock, the raft along the bottom.
 *   edge    close on the raft's edge and the gap between two logs. `beside` here is the gap itself:
 *           whoever is there comes up between the logs, the near log over his lower half.
 *   beside  the water beside the raft: whoever is at `beside` is in it, his head above it.
 *   under   the raft from underneath: four logs in a row, ten little bump stars on each (the
 *           riddle's picture). Sunny blue water all round, never dark.
 *
 * Anchors: `raft-1`, `raft-2` (on the logs), `pole` (the poling spot at the raft's end), `beside`
 * (in the water beside the raft; in `edge`, the gap between the logs), `far-rocks` (the tall rock at
 * the Crossing). wide, raft, light and rocks have all five; sky has `raft-1`, `raft-2`, `pole`; edge
 * and beside have `raft-1`, `raft-2`, `beside`; log has `far-rocks`; under has `beside`.
 * `beside` is `air` and `elev` to app/art/scenes.js: no ground shadow is drawn there (a dark shape
 * on the water is the one thing this river never shows), and nobody lands in the water for want of
 * a spot. The three spots on the raft are at one depth, so a spot of a frame's own (`at: { x, y }`)
 * is sized as they are wherever it is: give it its own `h` when it is not on the raft (an otter on
 * the rocks: the `otterH` the set's own otters have there, `PC.art.openriverInfo()`).
 * The three ferry otters on the rocks are the set's (drawn with the game's own otter, sitting; in
 * `rocks`, in its `slap` pose); so the only cast a frame brings to the rocks is whoever stands at
 * `far-rocks`.
 *
 * The pole: with someone at `pole` it stands beside him, its foot in the river behind the raft;
 * with nobody there it lies along the logs. A cast member with `holds: 'pole'` carries his own
 * (app/art/cats.js draws it), and the set then draws none.
 *
 * Options: `plane: 'none' | 'far' | 'near' | 'over' | 'gone'` (`gone`: small, going away to land,
 * where the camera looks that way; light and log look up the river, and their sky is empty again);
 * `shiver: true` (small rings all round the raft); `foot: true` (a blue-grey foot, much too big, up
 * between two logs, wiggling); `bubbles: true` (two nostrils and a string of bubbles between the
 * logs); `late: true` (the same water in the gold light of evening); `face: true` (the `sky` camera); `claws: 0-9`
 * (the `log` camera). An option counts only when it is exactly `true`.
 * `fish: 'spare'` (the way home): the marsh's fourth string, a reed loop with its two spare fish
 * ("Eighteen for Patience. Two to spare."), lying on the far logs at the raft's end, clear of
 * everyone's feet and of whatever comes up between the logs: every camera that shows the logs from
 * above (wide, raft, light, rocks, edge, beside). The fish are PC.art.prey's, on its string
 * (app/art/sets/pile.js); 'none' (default).
 * The foot is Puddle's own, as app/art/cats.js draws his `foot` pose (the set's own drawing until
 * it does), and the nostrils are in his blue-grey, taken from his drawing; while Puddle himself is
 * in a panel's cast the set draws neither (he cannot be in two places). In `edge` a frame may cast
 * him at `beside` instead (`foot`, `nostrils`, `head`): it is the same gap.
 *
 * Registered with PC.art.defineSet (app/art/scenes.js); painters come from PC.art.kit.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var art = PC.art || (PC.art = {});
  var K = art.kit;
  if (!K || !art.defineSet) return;

  var n = K.n, mix = K.mix, clamp = K.clamp, rng = K.rng, rect = K.rect, circ = K.circ, ell = K.ell, path = K.path, stroke = K.stroke,
    pts = K.pts, g = K.g, dot = K.dot, blob = K.blob, mound = K.mound, leafD = K.leafD, sparkleD = K.sparkleD, A = K.anchor;

  // ------------------------------------------------------------------ the light, and the river's colours

  /* The river in each of the set's lights, far to near: `hi` (the shine at the far waterline), `far`
   * (the sky lying on it), `mid` (the Crossing's blue, brighter for being out in the open), `near`
   * and `low` (at our feet: a touch greener, a touch deeper), `sheen` (long pale streaks of sky on
   * it), `line` (the darkest mark ever made on it: a ripple's shaded side), `glint`, and `under`
   * (the bright surface seen from below). Blue, sunny, and nowhere dark: in day and morning the blue
   * leads the red in every colour of it; in the late gold the far water takes the sky's gold (`hi`,
   * `far`) and from `mid` to our feet it is an evening blue, warmer than the day's and still water
   * (the tests measure all of it). app/art/cats.js keeps a copy of the day's `far`, `mid` and `near`
   * for its small pictures on the raft (RIVER, there): change them together. */
  var WATER = {
    day: { hi: '#E6F4F7', far: '#B4D9EC', mid: '#74B2D4', near: '#58A2BE', low: '#4E97B1', sheen: '#C9E6F2', line: '#3E86A6', glint: '#FFFDE8', under: '#C4E9F1' },
    morning: { hi: '#EDF5F7', far: '#C6E0EC', mid: '#8CBFD8', near: '#6FAEC6', low: '#62A2B8', sheen: '#D6EAF2', line: '#5290AA', glint: '#FFFFFF', under: '#D0EDF2' },
    golden: { hi: '#FFEFC6', far: '#EBD6C6', mid: '#A9A9CC', near: '#7E97C4', low: '#6F8ABC', sheen: '#F3DDBE', line: '#5D76A8', glint: '#FFF4C8', under: '#DCDDF0' }
  };

  // The set's light for this panel: the late gold (asked for, or by the frame's fx), else day or
  // morning. The palette is set here, so the sky, the cast's wash and every shadow agree with it.
  function light(S) {
    if (S.opts.late === true || S.tod === 'golden') { S.tod = 'golden'; S.pal = K.PAL.golden; }
    else if (S.tod !== 'morning') { S.tod = 'day'; S.pal = K.PAL.day; }
    return S.tod;
  }

  function colors(S) {
    var p = S.pal, W = WATER[S.tod] || WATER.day, gold = S.tod === 'golden', low = p.sky[p.sky.length - 1];
    return {
      W: W, gold: gold, low: low,
      cloud: mix('#FFFFFF', low, gold ? 0.3 : 0.15), cloudShade: mix(p.sky[Math.min(2, p.sky.length - 1)], '#FFFFFF', gold ? 0.3 : 0.5),
      far: mix(p.haze, p.sky[Math.min(3, p.sky.length - 1)], 0.35), farTrees: mix(p.haze, p.leaf, 0.4), pale: mix(p.haze, '#FFFFFF', 0.45),
      needle: mix('#FFFFFF', p.haze, gold ? 0.12 : 0.06), needleShade: mix(mix('#FFFFFF', p.haze, 0.5), p.stone, 0.25),
      bank: mix(p.grassFar, p.haze, 0.25), trees: mix(p.leaf, p.haze, 0.22), treesLight: mix(p.leafLight, p.haze, 0.2),
      vine: mix(p.leaf, p.woodDark, 0.25), foam: gold ? '#FFF9E2' : '#FFFFFF',
      gravel: mix(p.sand, p.stone, 0.6)
    };
  }

  // ------------------------------------------------------------------ small things

  // A rounded closed shape through the midpoints of a polygon (papercut rocks, the land).
  function smooth(P) {
    var m = P.length, s = [(P[m - 1][0] + P[0][0]) / 2, (P[m - 1][1] + P[0][1]) / 2], d = 'M' + n(s[0]) + ' ' + n(s[1]);
    for (var i = 0; i < m; i++) {
      var c = P[i], e = P[(i + 1) % m];
      d += 'Q' + n(c[0]) + ' ' + n(c[1]) + ' ' + n((c[0] + e[0]) / 2) + ' ' + n((c[1] + e[1]) / 2);
    }
    return d + 'Z';
  }
  function boxOf(P) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    P.forEach(function (q) { b = [Math.min(b[0], q[0]), Math.min(b[1], q[1]), Math.max(b[2], q[0]), Math.max(b[3], q[1])]; });
    return b;
  }
  function keep(S, x, y, w, h) { (S.keep = S.keep || []).push({ x: x, y: y, w: w, h: h }); }
  function castAt(S, spot) {
    var m = null;
    (S.cast || []).forEach(function (c) { if (!m && c && c.at === spot) m = c; });
    return m;
  }
  function castHas(S, who) { return (S.cast || []).some(function (c) { return c && c.who === who; }); }

  // A flat-bottomed papercut cloud: a shaded under-layer, the body above it.
  function cloud(S, C, x, base, w, h, seed) {
    var d = mound(x - w / 2, x + w / 2, base, base - h, 5, rng(seed), 0.42, 0.28, 0.1);
    return path(d, C.cloudShade, { opacity: 0.85 }) + path(d, C.cloud, { transform: 'translate(0 ' + n(-h * 0.14) + ')' });
  }
  function skyLayer(S, C, L) {
    var s = K.sky(S, 0, 0, 1600, L.hz + 14, { sun: L.sun, sunR: L.sunR || 430 }), cl = '';
    (L.clouds || []).forEach(function (c) { cl += cloud(S, C, c[0], c[1], c[2], c[3], c[4]); });
    return s + g(cl, { 'class': 'pcs-drift', style: 'animation-duration:70s' });
  }

  // One of the game's characters drawn by the set itself (the otters on their rocks; Tallyheart on
  // hers in the Roar's panel when the frame has not cast her), standing where a cast member at an
  // anchor of height h would: feet at (x, y). null when app/art/cats.js is not there to draw it.
  function figure(who, o, x, y, h) {
    var fn = art.character;
    if (typeof fn !== 'function' || fn.placeholder) return null;
    var ch;
    try { ch = fn(who, o); } catch (e) { return null; }
    if (!ch || typeof ch.svg !== 'string' || !(ch.w > 0) || !(ch.h > 0)) return null;
    var s = h / 200;
    return { svg: '<g transform="translate(' + n(x) + ' ' + n(y) + ') scale(' + K.n4(s) + ') translate(' + n(-ch.w / 2) + ' ' + n(-ch.h) + ')">' + ch.svg + '</g>', ch: ch, s: s,
      box: ch.bounds ? [x + (ch.bounds.x0 - ch.w / 2) * s, y + (ch.bounds.y0 - ch.h) * s, x + (ch.bounds.x1 - ch.w / 2) * s, y + (ch.bounds.y1 - ch.h) * s] : [x - ch.w * s / 2, y - ch.h * s, x + ch.w * s / 2, y] };
  }

  // ------------------------------------------------------------------ the far shore, and the needle

  // Far across the river: a low line of trees in the haze, a few pale roofs, and above the trees a
  // tall white needle of stone. F: { x0, x1, base, k, needle (its x) }.
  function farShore(S, C, F) {
    var k = F.k, base = F.base, r = rng(7011), s = '', x;
    var line = 'M' + n(F.x0) + ' ' + n(base + 2) + 'Q' + n(F.x0 + 40 * k) + ' ' + n(base - 8 * k) + ' ' + n(F.x0 + 110 * k) + ' ' + n(base - 10 * k);
    for (x = F.x0 + 110 * k; x < F.x1; x += 150 * k) line += 'Q' + n(x + 75 * k) + ' ' + n(base - (13 + r() * 9) * k) + ' ' + n(x + 150 * k) + ' ' + n(base - (8 + r() * 4) * k);
    s += path(line + 'V' + n(base + 2) + 'Z', C.far);
    var bld = '';
    for (x = F.x0 + 150 * k; x < F.x1 - 30; x += (34 + r() * 60) * k) {
      if (Math.abs(x - F.needle) < 46 * k) continue;
      var bh = (9 + r() * 15) * k, bw = (18 + r() * 30) * k;
      bld += 'M' + n(x) + ' ' + n(base) + 'v' + n(-bh) + 'h' + n(bw) + 'v' + n(bh) + 'z';
    }
    s += path(bld, mix(C.far, C.pale, 0.5));
    // the needle: a tall white shaft with a little pointed cap, its shaded side to the right
    var nx = F.needle, nb = base - 3 * k, H = 150 * k, w0 = 9 * k, w1 = 5.4 * k, cap = 14 * k;
    s += g(path('M' + n(nx - w0) + ' ' + n(nb) + 'L' + n(nx - w1) + ' ' + n(nb - H + cap) + 'L' + n(nx) + ' ' + n(nb - H) + 'L' + n(nx + w1) + ' ' + n(nb - H + cap) + 'L' + n(nx + w0) + ' ' + n(nb) + 'Z', C.needle) +
      path('M' + n(nx) + ' ' + n(nb) + 'L' + n(nx) + ' ' + n(nb - H) + 'L' + n(nx + w1) + ' ' + n(nb - H + cap) + 'L' + n(nx + w0) + ' ' + n(nb) + 'Z', C.needleShade, { opacity: 0.7 }), { 'data-part': 'needle' });
    // the trees along the water
    var tr2 = '';
    for (x = F.x0 + 20 * k; x < F.x1 + 20; x += (13 + r() * 22) * k) tr2 += blob(x, base - 4 * k, (9 + r() * 10) * k, (5 + r() * 5) * k, 7, r, 0.2, 0.3);
    s += path(tr2 + 'M' + n(F.x0 + 10 * k) + ' ' + n(base - 4 * k) + 'H' + n(F.x1 + 20) + 'V' + n(base + 2) + 'H' + n(F.x0 + 10 * k) + 'Z', C.farTrees);
    return g(s, { 'data-part': 'far-shore' });
  }

  // ------------------------------------------------------------------ our shore: the glass towers

  // The tallest tower: a plain glass slab with a flat roof, a little hut on top and the mast of the
  // little red light (as the riverbank path sees it). Returns where the light is.
  function tallest(S, t) {
    var p = S.pal, s = K.tower(S, { x: t.x, w: t.w, top: t.top, base: t.base, far: t.far == null ? 0.14 : t.far }), k = t.w / 186;
    var roofCol = mix(p.glassBot, p.shade, 0.25), lip = mix(p.glassEdge, p.stoneLight, 0.4), mx = t.x + t.w * 0.74, my = t.top - 50 * k;
    s += rect(t.x - 4 * k, t.top - 8 * k, t.w + 8 * k, 12 * k, roofCol, { rx: 3 * k }) + rect(t.x - 4 * k, t.top - 8 * k, t.w + 8 * k, 3.5 * k, lip, { rx: 2 * k, opacity: 0.9 });
    s += rect(t.x + t.w * 0.14, t.top - 34 * k, t.w * 0.3, 27 * k, roofCol, { rx: 3 * k }) + rect(t.x + t.w * 0.14, t.top - 34 * k, t.w * 0.3, 3 * k, lip, { opacity: 0.8 });
    s += rect(mx - 2.5 * k, my, 5 * k, t.top - my - 6 * k, roofCol) + rect(mx - 7 * k, t.top - 14 * k, 14 * k, 7 * k, roofCol, { rx: 2 * k });
    return { svg: s, light: [mx, my, Math.max(3.2, 7 * k)] };
  }

  /* Our own shore, at the far waterline: Crystal City's glass towers standing behind a low green
   * bank. H: { x0, x1, base, treeH, far: [towers], near: [towers], tall: { x, w, top, far } }. The
   * same list is what the river turns upside down (reflections). */
  function ourShore(S, C, H) {
    var p = S.pal, r = rng(7021), s = '', base = H.base, i;
    function based(list) { return list.map(function (t) { var o = {}; for (var k in t) o[k] = t[k]; o.base = base + 4; return o; }); }
    s += K.towers(S, based(H.far));
    var T = tallest(S, { x: H.tall.x, w: H.tall.w, top: H.tall.top, base: base + 4, far: H.tall.far });
    s += g(K.towers(S, based(H.near)) + T.svg, { filter: S.shadow('s') });
    s += g(K.redLight(S, T.light[0], T.light[1], T.light[2], true), { 'data-part': 'red-light' });
    keep(S, T.light[0] - T.light[2] * 5, T.light[1] - T.light[2] * 5, T.light[2] * 10, T.light[2] * 10);
    // the bank: a strip of land, bushes and little trees hiding the towers' feet
    var th = H.treeH, bush = '', lv = '';
    for (var x = H.x0; x < H.x1 - th; x += th * (1.6 + r() * 1.2)) {
      var w = th * (2.2 + r() * 1.6), hgt = th * (0.7 + r() * 0.6);
      bush += mound(x, Math.min(H.x1, x + w), base + 2, base - hgt, 5, r, 0.34, 0.22, 0.25);
    }
    for (i = 0; i < Math.round((H.x1 - H.x0) / 22); i++) lv += leafD(H.x0 + r() * (H.x1 - H.x0), base - th * (0.15 + r() * 0.5), th * 0.24, r() * 6.28, th * 0.08);
    var end = 'M' + n(H.x0) + ' ' + n(base + 3) + 'V' + n(base - th * 0.3) + 'H' + n(H.x1 - th * 1.4) + 'Q' + n(H.x1 - th * 0.3) + ' ' + n(base - th * 0.3) + ' ' + n(H.x1) + ' ' + n(base + 3) + 'Z';
    s += path(end, C.bank) + path(bush, p.rim, { transform: 'translate(0 ' + n(-Math.max(1.5, th * 0.07)) + ')', opacity: 0.7 }) + path(bush, C.trees) + path(lv, C.treesLight, { opacity: 0.5 });
    // a pale line of sand where it meets the water
    s += stroke('M' + n(H.x0) + ' ' + n(base + 2) + 'H' + n(H.x1 - th * 0.2), mix(p.sandLight, C.W.hi, 0.4), Math.max(2, th * 0.07), { opacity: 0.8, 'stroke-linecap': 'butt' });
    return { svg: g(s, { 'data-part': 'towers' }), light: T.light };
  }

  /* The towers standing on their heads in the water: each one's own width, as long as the tower is
   * tall (times k), its edges wobbling more the nearer they come, cut through by the river's light,
   * fading out at its far end. `at`: the line they hang from, where that is not the towers' own foot
   * (the `rocks` view, across the beach). `light`: the tallest carries its red light down with it
   * (the wonder panel, where the raft floats at its tip; elsewhere a red spot alone on the water
   * would only be a puzzle). */
  function reflections(S, C, H, k, yMax, at, light) {
    var p = S.pal, base = at != null ? at : H.base + 3, s = '', cuts = '', all = H.far.concat(H.near).concat([{ x: H.tall.x, w: H.tall.w, top: H.tall.top, far: H.tall.far == null ? 0.14 : H.tall.far, tall: true }]);
    all.forEach(function (t) {
      var far = t.far || 0, len = Math.min((H.base - t.top) * k, yMax - base), L = [], R = [], y = base, i = 0;
      if (len < 12) return;
      while (y < base + len) {
        var d = y - base, amp = (1.2 + d * 0.03) * (i % 2 ? 1 : -1);
        L.push([t.x + amp, y]); R.push([t.x + t.w + amp, y]);
        if (i % 2 === 0 && d > 6) cuts += 'M' + n(t.x - 6) + ' ' + n(y) + 'h' + n(t.w + 12);
        y += 6 + d * 0.085; i++;
      }
      L.push([t.x, base + len]); R.push([t.x + t.w, base + len]);
      var cTop = mix(mix(p.glassTop, p.haze, far * 0.55), C.W.mid, 0.3), cBot = mix(mix(p.glassBot, p.haze, far * 0.42), C.W.mid, 0.3);
      // by day the glass is the water's own blue: the far end of a tower's reflection is drawn a shade
      // deeper than the tower, so it can still be seen on the river (gold glass shows on it as it is)
      if (!C.gold) cTop = mix(cTop, C.W.line, 0.35);
      var op = 0.82 - far * 0.35;
      // upside down: the tower's foot is at the waterline, its top at the far end
      s += path(pts(L.concat(R.slice().reverse())) + 'Z', S.linU([[0, cBot, op], [0.75, cTop, op * 0.75], [1, cTop, 0]], 0, base, 0, base + len));
      s += stroke(pts(R), mix(p.glassEdge, C.W.hi, 0.3), Math.max(1.5, t.w * 0.03), { opacity: 0.4 * (1 - far * 0.5) });
      if (t.tall && light) {
        // its little red light, at the very end of it
        var kk = t.w / 186, lx = t.x + t.w * 0.74, ly = Math.min(base + (H.base - (t.top - 50 * kk)) * k, yMax - 6), lr = Math.max(3.4, 7 * kk);
        s += stroke('M' + n(lx) + ' ' + n(base + len - 2) + 'V' + n(ly - lr), mix(p.glassBot, C.W.mid, 0.4), Math.max(2, 4 * kk), { opacity: 0.6, 'stroke-linecap': 'butt' });
        s += g(ell(lx, ly, lr * 3.2, lr * 1.5, S.radU([[0, '#FF6A5A', 0.55], [1, '#FF5A4E', 0]], lx, ly, lr * 3.2)) + ell(lx - lr * 0.5, ly, lr * 1.3, lr * 0.55, '#FF5A4E') + ell(lx + lr * 1.1, ly + lr * 1.1, lr * 0.9, lr * 0.4, '#FF5A4E', { opacity: 0.7 }),
          { 'class': 'pcs-blink', 'data-part': 'red-light-refl' });
      }
    });
    // the river's own light, cutting them into bands
    s += stroke(cuts, C.W.far, 2.4, { opacity: 0.55, 'stroke-linecap': 'butt' });
    return g(s, { 'data-part': 'reflections' });
  }

  // ------------------------------------------------------------------ the river

  /* The river from y0 down to y1 (the bottom of the panel by default): bright blue and sunny, and
   * FLAT: short level swells and glints, nothing higher than a ripple. o: { k (how big its marks are,
   * near the camera), sunX (where the sun's path lies on it), seed, marks (how many), y1 }. Returns
   * { svg, inner, fill }: the same drawing bare, and its fill, to lay the river back over whatever sits in it. */
  function water(S, C, y0, o) {
    o = o || {};
    var W = C.W, k = o.k || 1, r = rng(o.seed || 7031), y1 = o.y1 || 1000, h = y1 - y0, s = '', i;
    var fill = S.linU([[0, W.hi], [0.1, W.far], [0.46, W.mid], [0.86, W.near], [1, W.low]], 0, y0, 0, y1);
    s += rect(-20, y0, 1640, h + 4, fill);
    // long pale streaks of sky lying on it (calm water: they say how wide it is)
    var sheen = '';
    for (i = 0; i < 10; i++) {
      var t = 0.16 + r() * 0.84, sy = y0 + t * h, len = (140 + r() * 300) * (0.35 + t) * k, sx = r() * 1800 - 150;
      sheen += 'M' + n(sx) + ' ' + n(sy) + 'q' + n(len / 2) + ' ' + n((r() - 0.5) * 5) + ' ' + n(len) + ' 0';
    }
    s += stroke(sheen, W.sheen, Math.max(4, 10 * k), { opacity: 0.26 });
    if (o.sunX != null) {
      var shine = S.pal.sun || '#FFF6D0';
      s += ell(o.sunX, y0 + Math.min(26, h * 0.07), 330 * Math.max(0.6, k), Math.max(12, Math.min(38, h * 0.07)), S.radB('orshine', [[0, shine, 0.85], [1, shine, 0]]));
      s += ell(o.sunX, y0 + h * 0.5, 200 * Math.max(0.6, k), h * 0.56, S.radB('orshine2', [[0, shine, 0.36], [0.6, shine, 0.13], [1, shine, 0]]));
    }
    var sw = '', sh = '', gl = '', gl2 = '', marks = o.marks || 60;
    for (i = 0; i < marks; i++) {
      var tt = Math.pow(r(), 1.25), y = y0 + 8 + tt * (h - 12), l2 = (14 + tt * 80) * k * (0.6 + r() * 0.8), x = r() * 1640 - 20;
      // level, every one: a swell is a line a few units high at most
      if (i % 3) sw += 'M' + n(x) + ' ' + n(y) + 'q' + n(l2 / 2) + ' ' + n(-(1.5 + tt * 2.5) * Math.min(1.4, k)) + ' ' + n(l2) + ' 0';
      else sh += 'M' + n(x) + ' ' + n(y) + 'h' + n(l2 * 0.8);
    }
    s += stroke(sw, mix(W.mid, '#FFFFFF', 0.5), Math.max(1.6, 2.2 * k), { opacity: 0.5 }) + stroke(sh, W.line, Math.max(1.4, 2 * k), { opacity: 0.3 });
    for (i = 0; i < marks; i++) {
      var gy = y0 + 5 + Math.pow(r(), 1.2) * (h - 10), spread = 70 * k + (gy - y0) * 0.75;
      var gx = o.sunX != null && i % 2 ? o.sunX + (r() - 0.5) * spread * 2 : r() * 1600, gw = (9 + (gy - y0) * 0.09) * Math.max(0.7, k);
      if (i % 3) gl += 'M' + n(gx) + ' ' + n(gy) + 'h' + n(gw); else gl2 += 'M' + n(gx) + ' ' + n(gy) + 'h' + n(gw * 0.8);
    }
    s += stroke(gl, W.glint, Math.max(2, 3 * k), { opacity: 0.85, 'class': 'pcs-glint' }) + stroke(gl2, '#FFFFFF', Math.max(1.6, 2.2 * k), { opacity: 0.6, 'class': 'pcs-glint', style: 'animation-delay:-1.6s' });
    return { svg: g(s, { 'data-part': 'water' }), inner: s, fill: fill };
  }

  // Rings on the water round (x, y): where something sits in it, or has just come up. Thin, pale, level.
  function rings(S, C, x, y, w, count, op) {
    var out = '', c = mix(C.W.mid, '#FFFFFF', 0.6);
    for (var i = 0; i < (count || 3); i++) {
      var rx = w * (0.55 + i * 0.26), ry = rx * 0.17;
      out += ell(x, y + i * w * 0.03, rx, ry, 'none', { stroke: i ? c : C.foam, 'stroke-width': Math.max(1.4, w * (0.02 - i * 0.004)), opacity: (op == null ? 0.8 : op) * (1 - i * 0.24) });
    }
    return out;
  }

  // ------------------------------------------------------------------ the Crossing's rocks

  // A papercut rock: lit rim up and to the left, a lighter top face, cracks and a little moss.
  function rock(S, P, o) {
    o = o || {};
    var p = S.pal, d = smooth(P), b = boxOf(P), r = rng(o.seed || 7), s = '';
    var fill = S.linU([[0, mix(p.stoneLight, p.rim, 0.15)], [0.3, p.stone], [1, mix(p.stoneDark, p.shade, 0.12)]], 0, b[1], 0, b[3]);
    s += path(d, p.rim, { transform: 'translate(' + n(-(o.rim || 3)) + ' ' + n(-(o.rim || 3) * 1.6) + ')', opacity: 0.75 }) + path(d, fill);
    if (o.face) {
      var f = o.face;   // [cx, cy, rx, ry]: the flat top somebody sits on
      s += path(blob(f[0], f[1], f[2], f[3], 12, r, 0.08, 0.2), mix(p.stoneLight, p.rim, 0.25), { opacity: 0.85 });
    }
    if (o.cracks) s += stroke(o.cracks, mix(p.stoneDark, p.shade, 0.25), o.crackW || 2.5, { opacity: 0.4 });
    if (o.moss) {
      var ms = '';
      o.moss.forEach(function (m) { ms += blob(m[0], m[1], m[2], m[2] * 0.35, 8, r, 0.3, 0.3); });
      s += path(ms, p.moss, { opacity: 0.9 });
    }
    return s;
  }

  /* The rocks of the Crossing, in their own units: the waterline at y = 0, up is negative. The tall
   * rock (`far-rocks` is its top), two low slabs and a rock out in the water (the otters' places,
   * each barely above the river, so a tail reaches it), the gravel of the point behind them. */
  var ROCKS = {
    w: 790,
    tall: [[250, 8], [252, -84], [282, -128], [338, -146], [398, -142], [432, -118], [446, -70], [448, 8]],
    perch: [342, -139],
    slabs: [
      [[36, 10], [44, -12], [92, -22], [178, -22], [224, -10], [232, 10]],
      [[452, 10], [460, -12], [498, -22], [566, -22], [606, -10], [612, 10]],
      [[640, 12], [648, -8], [676, -18], [722, -18], [746, -6], [750, 12]]
    ],
    otters: [[134, -19, 1, 'right'], [532, -19, 2, 'right'], [700, -15, 3, 'right']],
    land: [[-30, 10], [-20, -58], [60, -74], [190, -70], [262, -52], [300, 10]],
    bits: [[6, 6, 20], [318, 10, 15], [770, 8, 14], [590, 26, 12], [206, 24, 13]]
  };
  function rockSpot(G, q) { return [G.x + q[0] * G.s, G.y + q[1] * G.s]; }

  /* G: { x, y, s (the cluster's place and size), otters: 'real' | 'mini' | false, otterH (the height
   * of a cat where they sit), slap (their tails slapping the water), extra: [[x, y, w], …] (more
   * rocks along the water, in the panel's own units) }. */
  function rocksAt(S, C, G) {
    var p = S.pal, s = '', k = G.s, i;
    function M(P) { return P.map(function (q) { return rockSpot(G, q); }); }
    // the point's own land: gravel, a little grass on top
    var land = M(ROCKS.land), lb = boxOf(land);
    s += path(smooth(land), p.rim, { transform: 'translate(0 ' + n(-3 * k) + ')', opacity: 0.7 }) +
      path(smooth(land), S.linU([[0, p.grass], [0.3, mix(p.grass, C.gravel, 0.6)], [1, mix(C.gravel, p.stoneDark, 0.3)]], 0, lb[1], 0, lb[3]));
    (G.extra || []).forEach(function (q, qi) {
      var rr = rng(7060 + qi), w0 = q[2];
      s += rock(S, [[q[0] - w0, q[1] + 6], [q[0] - w0 * 0.82, q[1] - w0 * 0.42], [q[0] - w0 * 0.1, q[1] - w0 * (0.58 + rr() * 0.2)], [q[0] + w0 * 0.72, q[1] - w0 * 0.45], [q[0] + w0, q[1] + 6]], { seed: 7060 + qi, rim: Math.max(1, 3 * k) });
    });
    ROCKS.bits.forEach(function (q, qi) {
      var c = rockSpot(G, q), w0 = q[2] * k;
      s += rock(S, [[c[0] - w0, c[1] + 3 * k], [c[0] - w0 * 0.8, c[1] - w0 * 0.5], [c[0], c[1] - w0 * 0.75], [c[0] + w0 * 0.8, c[1] - w0 * 0.45], [c[0] + w0, c[1] + 3 * k]], { seed: 7070 + qi, rim: Math.max(1, 2.4 * k) });
    });
    var pc = rockSpot(G, ROCKS.perch);
    s += g(rock(S, M(ROCKS.tall), { seed: 7051, rim: Math.max(1, 3 * k), face: [pc[0], pc[1] + 5 * k, 56 * k, 10 * k], crackW: Math.max(1, 2.5 * k),
      cracks: pts(M([[282, -60], [296, -24], [290, 2]])) + pts(M([[404, -92], [392, -52], [410, -12]])), moss: [[rockSpot(G, [300, -6])[0], rockSpot(G, [300, -6])[1], 40 * k], [rockSpot(G, [424, -40])[0], rockSpot(G, [424, -40])[1], 18 * k]] }),
      { filter: S.shadow(k > 0.7 ? 'm' : 's') });
    ROCKS.slabs.forEach(function (P, pi) {
      var W0 = M(P), b = boxOf(W0);
      s += g(rock(S, W0, { seed: 7052 + pi, rim: Math.max(1, 2.6 * k), face: [(b[0] + b[2]) / 2, b[1] + 7 * k, (b[2] - b[0]) * 0.36, 6 * k] }), { filter: S.shadow('s') });
    });
    // where the river meets them: a pale line, and nothing else
    var wl = '';
    [[20, 240], [246, 452], [450, 616], [636, 754]].forEach(function (q) { var a = rockSpot(G, [q[0], 9]), b = rockSpot(G, [q[1], 9]); wl += 'M' + n(a[0]) + ' ' + n(a[1]) + 'H' + n(b[0]); });
    s += stroke(wl, C.foam, Math.max(1.4, 3 * k), { opacity: 0.6 });
    s = g(s, { 'data-part': 'rocks' });
    // the ferry otters: the old one and two more
    var ot = '', sl = '';
    if (G.otters) {
      ROCKS.otters.forEach(function (q, qi) {
        var c = rockSpot(G, q), h = G.otterH, one = null, face = q[3];
        // (their applause is cats.js's own pose, the tail swung down flat, once it draws one; sitting till then)
        var poses = (art.vocab && art.vocab.otherPoses && art.vocab.otherPoses.otter) || [], pose = G.slap && poses.indexOf('slap') >= 0 ? 'slap' : 'sit';
        if (G.otters === 'real') one = figure('otter', { variant: q[2], pose: pose, mood: G.slap ? (qi === 1 ? 'laugh' : 'happy') : (qi === 0 ? 'kind' : 'happy'), facing: face }, c[0], c[1], h);
        if (one) ot += g(ell(c[0], c[1] - 1, h * 0.26, Math.max(2, h * 0.04), p.shade, { opacity: 0.22 }) + one.svg, { 'data-otter': q[2] });
        else ot += g(miniOtter(S, c[0], c[1], h * 0.94, q[2], face), { 'data-otter': q[2] });
        // where the otters are what the panel is about (their applause), the lettering keeps off each of them
        if (G.slap) {
          // (from the top of his head down to his rock, as wide as his head)
          var hb = one && one.ch.headBox;
          if (hb) keep(S, c[0] + (hb.x0 - one.ch.w / 2) * one.s - 6, c[1] - (one.ch.h - hb.y0) * one.s - 6, (hb.x1 - hb.x0) * one.s + 12, (one.ch.h - hb.y0) * one.s + 6);
          else keep(S, c[0] - h * 0.3, c[1] - h, h * 0.6, h);
        }
        // his tail lies behind him, off the back of his rock and onto the water
        if (G.slap) { var tx = c[0] + (face === 'right' ? -1 : 1) * h * 0.62, ty = rockSpot(G, [0, 9])[1]; sl += slap(S, C, tx, ty, h * 0.5, face === 'right' ? -1 : 1, 7080 + qi); }
      });
    }
    return s + g(ot, { 'data-part': 'otters' }) + g(sl, { 'data-part': 'slap' });
  }

  // The three ferry otters' coats (app/art/cats.js, BEASTS.otter), for the ones too far off for a face.
  var OTTERS = [{ base: '#75604c', belly: '#ddd5c8', line: '#32271e' }, { base: '#5c3b28', belly: '#ead4b2', line: '#26160d' }, { base: '#a8784b', belly: '#f7e8cb', line: '#4a2f18' }];
  // An otter a long way off: sitting up, a round head, a pale chin and chest, a thick tail behind him.
  function miniOtter(S, x, y, h, variant, face) {
    var o = OTTERS[(variant - 1) % 3], f = face === 'left' ? -1 : 1, w = h * 0.34;
    function X(u) { return x + u * f * h; }
    return path('M' + n(X(-0.1)) + ' ' + n(y - h * 0.08) + 'Q' + n(X(-0.44)) + ' ' + n(y - h * 0.1) + ' ' + n(X(-0.62)) + ' ' + n(y - h * 0.01) + 'Q' + n(X(-0.4)) + ' ' + n(y + h * 0.03) + ' ' + n(X(-0.06)) + ' ' + n(y) + 'Z', o.base) +
      ell(X(0), y - h * 0.34, w * 0.5, h * 0.36, o.base) + ell(X(0.05), y - h * 0.34, w * 0.26, h * 0.26, o.belly) +
      circ(X(0.04), y - h * 0.78, h * 0.2, o.base) + ell(X(0.07), y - h * 0.72, h * 0.12, h * 0.085, o.belly) +
      circ(X(-0.1), y - h * 0.95, h * 0.05, o.base) + circ(X(0.17), y - h * 0.95, h * 0.05, o.base) +
      path(dot(X(-0.02), y - h * 0.82, Math.max(0.8, h * 0.026)) + dot(X(0.13), y - h * 0.82, Math.max(0.8, h * 0.026)), o.line);
  }

  // A tail slapping the water at (x, y): a low crown of splash, a few drops, two quick arcs above
  // where the tail came down. Small and bright, and only ever at the rocks.
  function slap(S, C, x, y, w, dir, seed) {
    var r = rng(seed), s = '', d = '', drops = '';
    for (var i = 0; i < 5; i++) {
      var a = Math.PI * (0.12 + 0.76 * i / 4), len = w * (0.34 + r() * 0.22), bx = x + Math.cos(a) * w * 0.3 * -dir, by = y;
      d += 'M' + n(bx - w * 0.06) + ' ' + n(by) + 'Q' + n(bx + Math.cos(a) * len * 0.6 * -dir) + ' ' + n(by - Math.sin(a) * len * 1.1) + ' ' + n(bx + Math.cos(a) * len * -dir) + ' ' + n(by - Math.sin(a) * len) +
        'Q' + n(bx + Math.cos(a) * len * 0.5 * -dir + w * 0.05) + ' ' + n(by - Math.sin(a) * len * 0.5) + ' ' + n(bx + w * 0.06) + ' ' + n(by) + 'Z';
      drops += dot(bx + Math.cos(a) * (len + w * 0.16) * -dir, by - Math.sin(a) * (len + w * 0.14), Math.max(1.2, w * (0.03 + r() * 0.025)));
    }
    s += rings(S, C, x, y + w * 0.03, w * 0.7, 2, 0.8);
    s += path(d, C.foam, { opacity: 0.95 }) + path(drops, C.foam, { opacity: 0.9 });
    s += stroke('M' + n(x + dir * w * 0.36) + ' ' + n(y - w * 0.62) + 'q' + n(-dir * w * 0.3) + ' ' + n(w * 0.06) + ' ' + n(-dir * w * 0.4) + ' ' + n(w * 0.36) +
      'M' + n(x + dir * w * 0.62) + ' ' + n(y - w * 0.5) + 'q' + n(-dir * w * 0.3) + ' ' + n(w * 0.04) + ' ' + n(-dir * w * 0.42) + ' ' + n(w * 0.3), C.foam, Math.max(1.4, w * 0.035), { opacity: 0.85 });
    return g(s, { 'class': 'pcs-splash', 'data-slap': '1' });
  }

  // ------------------------------------------------------------------ the raft

  /* The ferry raft: four logs side by side (the far one first), lashed with vines, a cut end with
   * its rings on every log, RIDING LOW: the river laps well up the near log. R: { x0, x1, top, bot
   * (the deck: its far edge and its near edge), k (the size of its details), seed, ends: 'left' |
   * 'right' (which end's cut faces show), gap (open water between the two near logs: the `edge`
   * camera), sink (how much of the near log is under the river), fill (the river's own fill),
   * between (drawn between the two near logs, the near one over its foot) }.
   * Nothing is drawn under it: no shadow on the water, no reflection, no shape. Returns { svg, wl
   * (its waterline), seam (the line between the two near logs), deckTop, near: [x0, x1] (the near
   * log's ends), logs }; with `split`, { far, nearLog } in place of svg: the three far logs and the
   * near one as two layers, for whoever comes up between them. */
  function raft(S, C, R) {
    var p = S.pal, r = rng(R.seed || 7101), k = R.k, x0 = R.x0, x1 = R.x1, logs = 4, gap = R.gap || 0, right = R.ends === 'right';
    var dy = (R.bot - R.top - gap) / logs, front = 26 * k, far = '', near = '', L = [], i;
    for (i = 0; i < logs; i++) {
      var last = i === logs - 1, ya = R.top + i * dy + (last ? gap : 0) - 4 * k, yt = ya + dy + 10 * k, yb = yt + (last ? front : 0);
      var ja = (r() - 0.5) * 28 * k, jb = (r() - 0.5) * 28 * k, la = x0 + ja + (i % 2) * 13 * k, lb = x1 + jb - (i % 2) * 10 * k, rr = (yt - ya) / 2;
      var col = i % 2 ? p.woodLight : p.wood, bark = mix(col, p.woodDark, 0.45), one = '';
      one += rect(la, ya, lb - la, yb - ya, S.linU([[0, mix(col, p.rim, 0.25)], [0.45, col], [1, bark]], 0, ya, 0, yb), { rx: rr });
      var tex = '';
      for (var j = 0; j < Math.round(5 + (lb - la) / (150 * k)); j++) { var tx = la + 30 * k + r() * Math.max(10, lb - la - 110 * k); tex += 'M' + n(tx) + ' ' + n(ya + rr * (0.5 + r() * 0.7)) + 'h' + n((18 + r() * 44) * k); }
      one += stroke(tex, p.woodDark, 2.2 * k, { opacity: 0.4 }) + stroke('M' + n(la + rr) + ' ' + n(ya + 3 * k) + 'H' + n(lb - rr), p.rim, 2.4 * k, { opacity: 0.55 });
      // the cut end, with its rings
      var ex = right ? lb - rr * 0.55 : la + rr * 0.55, ey = ya + rr;
      one += ell(ex, ey, rr * 0.55, rr * 0.92, mix(p.sand, p.woodLight, 0.4)) + ell(ex, ey, rr * 0.34, rr * 0.6, 'none', { stroke: p.woodDark, 'stroke-width': 1.6 * k, opacity: 0.5 }) +
        ell(ex, ey, rr * 0.14, rr * 0.25, p.woodDark, { opacity: 0.45 });
      if (last) near = one; else far += one;
      L.push({ la: la, lb: lb, ya: ya, yt: yt, yb: yb, rr: rr });
    }
    // vine lashings: a vine wound round every log, a knot on top and a few leaves
    var lv = '', lnFar = '', lnNear = '', knots = '', N = L[logs - 1], bands = R.bands || [0.2, 0.5, 0.8];
    var wl = N.ya + (N.yb - N.ya) * (1 - (R.sink == null ? 0.42 : R.sink));
    bands.forEach(function (f) {
      var vx = x0 + (x1 - x0) * f + (r() - 0.5) * 20 * k;
      for (var q = 0; q < logs; q++) {
        var lastQ = q === logs - 1, a0 = L[q].ya + 2 * k, b0 = lastQ ? wl + 2 * k : L[q].yt;
        for (var w2 = 0; w2 < 2; w2++) {
          var wx = vx + w2 * 13 * k + q * 3 * k, seg = 'M' + n(wx - 4 * k) + ' ' + n(a0) + 'Q' + n(wx + 7 * k) + ' ' + n((a0 + b0) / 2) + ' ' + n(wx - 1 * k) + ' ' + n(b0);
          if (lastQ) lnNear += seg; else lnFar += seg;
          // across the open water between the two near logs, pulled tight
          if (gap && q === logs - 2) lnNear += 'M' + n(wx - 1 * k) + ' ' + n(b0 - 2 * k) + 'L' + n(wx + 2 * k) + ' ' + n(N.ya + 4 * k);
        }
      }
      knots += dot(vx + 8 * k, R.top + 2 * k, 9 * k);
      lv += leafD(vx + 8 * k, R.top, 24 * k, -2.4, 9 * k) + leafD(vx + 10 * k, R.top, 20 * k, -0.6, 8 * k);
    });
    function vine(d) { return stroke(d, C.vine, 6 * k) + stroke(d, p.leafLight, 1.8 * k, { opacity: 0.55, transform: 'translate(-1.5 -1)' }); }
    var sh = S.shadow(k > 1.4 ? 'm' : 's'), tops = path(knots, C.vine) + path(lv, p.leafMid);
    // riding low: the river itself over the lower part of the near log (and over the soft edge the
    // paper shadow would leave below it), a lapping line along it, level. It is the river's own
    // drawing again (R.water: its fill and every streak, swell and glint on it), cut to a level
    // patch, so the patch cannot be told from the water round it: a patch of the bare fill showed as
    // a box wherever the sun's path or a streak of sky ran under it, plainly so on blue water.
    var lapBox = [x0 - 60 * k, wl, x1 - x0 + 120 * k, N.yb - wl + 18 * k];
    var lap = R.water ? g(R.water, { 'clip-path': S.clip('or-lap', rect(lapBox[0], lapBox[1], lapBox[2], lapBox[3], '#fff')) })
      : rect(lapBox[0], lapBox[1], lapBox[2], lapBox[3], R.fill || C.W.near);
    var wave = 'M' + n(N.la + 2 * k) + ' ' + n(wl), step = 26 * k, wx2 = N.la + 2 * k, up = true;
    while (wx2 < N.lb - step) { wave += 'q' + n(step / 2) + ' ' + n((up ? -1 : 1) * 2.2 * Math.min(k, 1.6)) + ' ' + n(step) + ' 0'; wx2 += step; up = !up; }
    lap += stroke(wave, C.foam, Math.max(1.6, 3 * k), { opacity: 0.75 });
    var dash = '';
    for (i = 0; i < Math.round((x1 - x0) / (130 * k)); i++) { var dx = N.la + 20 * k + r() * (N.lb - N.la - 90 * k); dash += 'M' + n(dx) + ' ' + n(wl + (7 + r() * 9) * k) + 'h' + n((26 + r() * 40) * k); }
    lap += stroke(dash, C.foam, Math.max(1.2, 2 * k), { opacity: 0.45 });
    // a loose end of vine trailing on the water
    var tx0 = right ? N.la + 40 * k : N.lb - 34 * k, td = right ? -1 : 1;
    lap += stroke('M' + n(tx0) + ' ' + n(wl + 1 * k) + 'q' + n(td * 26 * k) + ' ' + n(10 * k) + ' ' + n(td * 58 * k) + ' ' + n(6 * k) + 't' + n(td * 46 * k) + ' ' + n(3 * k), C.vine, 4.5 * k) +
      path(leafD(tx0 + td * 100 * k, wl + 9 * k, 20 * k, td > 0 ? 0.2 : 2.9, 7 * k), p.leafMid);
    var out = { wl: wl, seam: N.ya + 2 * k, deckTop: L[0].ya, near: [N.la, N.lb], logs: L, k: k };
    if (R.split) {
      // in two layers: the three far logs, and the near one (the raft's edge) with the river on it
      out.far = g(far + vine(lnFar) + tops, { filter: sh, 'data-part': 'raft' });
      out.nearLog = g(g(near + vine(lnNear), { filter: sh }) + lap, { 'data-part': 'raft-near' });
    } else {
      out.svg = g(g(far + (R.between || '') + near + vine(lnFar + lnNear) + tops, { filter: sh }) + lap, { 'data-part': 'raft' });
    }
    return out;
  }

  // The long pole. P: [x0, y0, x1, y1, width]: light along its upper side, darker under.
  function pole(S, P) {
    var p = S.pal, d = 'M' + n(P[0]) + ' ' + n(P[1]) + 'L' + n(P[2]) + ' ' + n(P[3]), w = P[4];
    return g(stroke(d, mix(p.woodDark, p.shade, 0.15), w + Math.max(1.6, w * 0.3)) + stroke(d, mix(p.woodLight, p.sandLight, 0.3), w) +
      stroke(d, '#FFFFFF', Math.max(0.8, w * 0.25), { opacity: 0.45, transform: 'translate(' + n(-w * 0.18) + ' ' + n(-w * 0.18) + ')' }), { 'data-part': 'pole' });
  }
  // Where the pole is in a panel with the raft in it: standing beside whoever is at `pole` (its foot
  // in the river behind the raft, so it is drawn before the raft), else lying along the logs; none
  // when someone carries his own. a: the `pole` anchor; B: the raft ({ x0, x1, top, bot, k }).
  function poleFor(S, a, B) {
    if ((S.cast || []).some(function (c) { return c && c.holds === 'pole'; })) return { behind: '', lying: '' };
    var w = Math.max(2.4, 9 * B.k);
    if (a && castAt(S, 'pole')) return { behind: pole(S, [a.x + a.h * 0.3, a.y - a.h * 1.72, a.x + a.h * 0.06, B.top + 2 * B.k, w]), lying: '' };
    var L = B.x1 - B.x0, d = B.bot - B.top;
    return { behind: '', lying: pole(S, [B.x0 + L * 0.3, B.top + d * 0.3, B.x1 - L * 0.03, B.top + d * 0.12, w]) };
  }

  // `fish: 'spare'`: the string of two spare fish (PC.art.prey.string), laid on the logs with its loop
  // at (x, y), the fish lying along the log toward +x; h: how tall a sitting cat is there.
  function spareFish(S, x, y, h) {
    if (S.opts.fish !== 'spare' || !art.prey || typeof art.prey.string !== 'function') return '';
    var len = h * 0.19;
    return g('<g transform="translate(' + n(x) + ' ' + n(y) + ') rotate(-84)">' + art.prey.string({ count: 2, len: len }) + '</g>', { filter: S.shadow('s'), 'data-part': 'spare-fish' });
  }

  // `shiver`: small rings all round the raft, and nothing else: the water is no rougher for it.
  function shiver(S, C, B) {
    var k = B.k, y = B.wl, s = '', i, c = C.foam, ry;
    for (i = 0; i < 3; i++) {
      var d = (16 + i * 20) * k;
      ry = (14 + i * 9) * k;
      s += 'M' + n(B.x0 - d * 0.5) + ' ' + n(y - ry) + 'A' + n(d) + ' ' + n(ry) + ' 0 0 0 ' + n(B.x0 - d * 0.5) + ' ' + n(y + ry);
      s += 'M' + n(B.x1 + d * 0.5) + ' ' + n(y - ry) + 'A' + n(d) + ' ' + n(ry) + ' 0 0 1 ' + n(B.x1 + d * 0.5) + ' ' + n(y + ry);
    }
    var cnt = Math.max(3, Math.round((B.x1 - B.x0) / (170 * k)));
    for (i = 0; i < cnt; i++) {
      var x = B.x0 + (B.x1 - B.x0) * (i + 0.5) / cnt, w = 44 * k;
      // in front of it, two rows; behind it, one
      s += 'M' + n(x - w) + ' ' + n(y + 24 * k) + 'q' + n(w) + ' ' + n(9 * k) + ' ' + n(w * 2) + ' 0' + 'M' + n(x - w * 0.6 + 30 * k) + ' ' + n(y + 44 * k) + 'q' + n(w * 0.6) + ' ' + n(7 * k) + ' ' + n(w * 1.2) + ' 0';
      if (B.top != null) s += 'M' + n(x - w * 0.7) + ' ' + n(B.top - 9 * k) + 'q' + n(w * 0.7) + ' ' + n(-6 * k) + ' ' + n(w * 1.4) + ' 0';
    }
    return g(stroke(s, c, Math.max(1.4, 2.6 * k), { opacity: 0.85 }), { 'class': 'pcs-pulse', style: 'animation-duration:.7s', 'data-part': 'shiver' });
  }

  // ------------------------------------------------------------------ what comes up from under it

  /* Puddle's scales, for the two things of his the set draws itself (the foot between the logs, the
   * nostrils): blue-grey, bluer and a shade darker than Sprinkle's mist grey, pale claws. When
   * app/art/cats.js draws Puddle, the set takes the blue-grey most of him is from his own drawing,
   * so the foot and the dragonet it belongs to are one colour. */
  var PUDDLE = { base: '#7f95ab', line: '#3d4d5f', light: '#b3c5d6', ridge: '#687c92', claw: '#efe9dd', clawLine: '#857f73' };
  var pcal = { fn: 0, poses: 0, c: PUDDLE };
  function lum(h) { return parseInt(h.slice(1, 3), 16) * 0.3 + parseInt(h.slice(3, 5), 16) * 0.59 + parseInt(h.slice(5, 7), 16) * 0.11; }
  function puddleCols() {
    var fn = art.character, poses = (art.vocab && art.vocab.otherPoses && art.vocab.otherPoses.puddle) || null;
    if (pcal.fn === fn && pcal.poses === poses) return pcal.c;
    pcal = { fn: fn, poses: poses, c: PUDDLE };
    if (typeof fn !== 'function' || !poses || !poses.length) return PUDDLE;
    try {
      var svg = fn('puddle', { pose: poses.indexOf('head') >= 0 ? 'head' : poses[0], mood: 'happy', facing: 'right' }).svg, count = {}, best = null, want = lum(PUDDLE.base);
      (svg.match(/fill="#[0-9a-fA-F]{6}"/g) || []).forEach(function (m) { var c = m.slice(6, 13).toLowerCase(); count[c] = (count[c] || 0) + 1; });
      Object.keys(count).forEach(function (c) {
        var rr = parseInt(c.slice(1, 3), 16), gg = parseInt(c.slice(3, 5), 16), bb = parseInt(c.slice(5, 7), 16), l = lum(c);
        // a blue-grey of about the right depth, used for more than a detail
        if (bb - rr < 12 || Math.abs(gg - (rr + bb) / 2) > 22 || l < 95 || l > 185 || count[c] < 2) return;
        if (!best || Math.abs(l - want) < Math.abs(lum(best) - want)) best = c;
      });
      if (best) pcal.c = { base: best, line: mix(best, '#17212e', 0.62), light: mix(best, '#ffffff', 0.42), ridge: mix(best, '#17212e', 0.22), claw: PUDDLE.claw, clawLine: PUDDLE.clawLine };
    } catch (e) { /* the set's own blue-grey */ }
    return pcal.c;
  }

  // A paw's own frame: u along it (the toes at +u), v across; (ox, oy) the middle of its palm, `a`
  // the way the toes point (radians), s its width.
  function pawFrame(ox, oy, a, s) {
    var ca = Math.cos(a), sa = Math.sin(a);
    return function (u, v) { return [ox + (u * ca - v * sa) * s, oy + (u * sa + v * ca) * s]; };
  }
  function ovalP(X, u0, v0, ru, rv, k) {
    var P = [];
    for (var i = 0; i < k; i++) { var t = Math.PI * 2 * i / k; P.push(X(u0 + Math.cos(t) * ru, v0 + Math.sin(t) * rv)); }
    return P;
  }
  function digitP(X, f, r0, r1, w0, w1) {
    var cu = Math.cos(f), cv = Math.sin(f), nu = -cv, nv = cu, P = [X(cu * r0 + nu * w0, cv * r0 + nv * w0)];
    for (var i = 0; i <= 6; i++) {
      var a = Math.PI / 2 - Math.PI * i / 6, su = Math.sin(a) * w1, fu = Math.cos(a) * w1;
      P.push(X(cu * (r1 + fu) + nu * su, cv * (r1 + fu) + nv * su));
    }
    P.push(X(cu * r0 - nu * w0, cv * r0 - nv * w0));
    return P;
  }
  function clawUV(X, u0, v0, u1, v1, w, bend) {
    var du = u1 - u0, dv = v1 - v0, l = Math.sqrt(du * du + dv * dv) || 1, nu = -dv / l, nv = du / l, b = bend * l, um = (u0 + u1) / 2, vm = (v0 + v1) / 2;
    return [X(u0 + nu * w, v0 + nv * w), X(um + nu * (w * 0.5 + b), vm + nv * (w * 0.5 + b)), X(u1 + nu * b * 0.6, v1 + nv * b * 0.6),
      X(um - nu * (w * 0.5 - b), vm - nv * (w * 0.5 - b)), X(u0 - nu * w, v0 - nv * w)];
  }
  function clawP(X, f, r0, r1, w, bend) { var cu = Math.cos(f), cv = Math.sin(f); return clawUV(X, cu * r0, cv * r0, cu * r1, cv * r1, w, bend); }

  /* `foot`: one blue-grey foot, much too big, up between two logs, wiggling: a broad sole, five
   * round toes fanned like a hand, a pale claw on each, the ankle going down behind the near log.
   * (x, y): where it comes up; w: its width. */
  var FOOT_TOES = [-0.8, -0.4, 0, 0.4, 0.8];
  function foot(S, x, y, w) {
    // his own foot, as app/art/cats.js draws it (Puddle's `foot` pose), once it draws him: the same
    // foot whether the frame casts him in the gap or asks the set for it
    var poses = (art.vocab && art.vocab.otherPoses && art.vocab.otherPoses.puddle) || [];
    var own = poses.indexOf('foot') >= 0 ? figure('puddle', { pose: 'foot', mood: 'happy', facing: 'right' }, x, y + w * 0.16, w * 2.3) : null;
    if (own) return g(g(own.svg, { 'class': 'pcs-sway', style: 'animation-duration:.42s' }), { 'data-part': 'foot', 'data-foot': 'puddle' });
    var D = puddleCols(), X = pawFrame(x, y - w * 0.92, -Math.PI / 2 + 0.1, w), lw = Math.max(1.6, w * 0.014), shapes = [], claws = [], s = '', pads = '';
    // the ankle, from the logs up to the sole
    shapes.push([X(-0.3, -0.25), X(-1.0, -0.2), X(-1.0, 0.2), X(-0.3, 0.25)]);
    FOOT_TOES.forEach(function (f, i) {
      var r1 = i === 0 || i === 4 ? 0.56 : 0.66;
      shapes.push(digitP(X, f, 0.18, r1, 0.115, 0.1));
      claws.push(clawP(X, f, r1 + 0.05, r1 + 0.3, 0.06, 0.1));
      var c = X(Math.cos(f) * (r1 - 0.02), Math.sin(f) * (r1 - 0.02));
      pads += dot(c[0], c[1], w * 0.058);
    });
    shapes.push(ovalP(X, -0.02, 0, 0.42, 0.46, 24));
    shapes.forEach(function (P) { s += path(pts(P) + 'Z', D.line, { stroke: D.line, 'stroke-width': n(lw * 2), 'stroke-linejoin': 'round' }); });
    shapes.forEach(function (P) { s += path(pts(P) + 'Z', D.base); });
    // the sole, paler, and a pad on every toe
    s += path(pts(ovalP(X, -0.04, 0, 0.27, 0.3, 18)) + 'Z', D.light, { opacity: 0.75 }) + path(pads, D.light, { opacity: 0.8 });
    claws.forEach(function (P) { s += path(pts(P) + 'Z', D.claw, { stroke: D.clawLine, 'stroke-width': n(Math.max(1.4, lw)), 'stroke-linejoin': 'round', 'data-claw': 'foot' }); });
    // it wiggles: quick little arcs either side of the toes, and (with motion allowed) a sway from the ankle
    var a = X(0.78, -0.62), b = X(0.78, 0.62), q = w * 0.14;
    var wig = stroke('M' + n(a[0] - q) + ' ' + n(a[1] - q * 0.4) + 'q' + n(-q * 0.7) + ' ' + n(q * 0.9) + ' ' + n(-q * 0.1) + ' ' + n(q * 1.8) + 'M' + n(a[0] - q * 1.9) + ' ' + n(a[1]) + 'q' + n(-q * 0.6) + ' ' + n(q * 0.7) + ' ' + n(-q * 0.1) + ' ' + n(q * 1.4) +
      'M' + n(b[0] + q) + ' ' + n(b[1] - q * 0.4) + 'q' + n(q * 0.7) + ' ' + n(q * 0.9) + ' ' + n(q * 0.1) + ' ' + n(q * 1.8) + 'M' + n(b[0] + q * 1.9) + ' ' + n(b[1]) + 'q' + n(q * 0.6) + ' ' + n(q * 0.7) + ' ' + n(q * 0.1) + ' ' + n(q * 1.4),
      '#FFFFFF', Math.max(1.6, w * 0.022), { opacity: 0.9 });
    return g(g(s, { 'class': 'pcs-sway', style: 'animation-duration:.42s' }) + wig, { 'data-part': 'foot', 'data-foot': 'set' });
  }

  /* `bubbles`: two nostrils and a string of bubbles between the logs: he is up again, and breathing.
   * (x, y): where the snout tip shows; w: its width; dir: which way the bubbles trail; level: along
   * open water (the gap in the `edge` camera), not up over the logs. */
  function bubbles(S, C, x, y, w, dir, level) {
    var D = puddleCols(), s = '', b = '', i, r = rng(7151);
    // the tip of a snout: a low round bump, two nostrils on top of it
    s += path('M' + n(x - w * 0.5) + ' ' + n(y + w * 0.1) + 'Q' + n(x - w * 0.52) + ' ' + n(y - w * 0.3) + ' ' + n(x - w * 0.2) + ' ' + n(y - w * 0.36) + 'Q' + n(x) + ' ' + n(y - w * 0.3) + ' ' + n(x + w * 0.2) + ' ' + n(y - w * 0.36) +
      'Q' + n(x + w * 0.52) + ' ' + n(y - w * 0.3) + ' ' + n(x + w * 0.5) + ' ' + n(y + w * 0.1) + 'Z', D.base, { stroke: D.line, 'stroke-width': n(Math.max(1.4, w * 0.035)), 'stroke-linejoin': 'round' });
    s += ell(x - w * 0.2, y - w * 0.27, w * 0.12, w * 0.05, D.light, { opacity: 0.7 }) + ell(x + w * 0.2, y - w * 0.27, w * 0.12, w * 0.05, D.light, { opacity: 0.7 });
    s += ell(x - w * 0.2, y - w * 0.17, w * 0.085, w * 0.06, D.line, { 'data-nostril': '1' }) + ell(x + w * 0.2, y - w * 0.17, w * 0.085, w * 0.06, D.line, { 'data-nostril': '2' });
    // a string of bubbles, away along the gap and up
    for (i = 0; i < 7; i++) {
      var bx = x + dir * w * (0.82 + i * 0.5 + r() * 0.1), by = y - w * (level ? 0.14 + (i % 2) * 0.2 : 0.1 + i * 0.13 + (i % 2) * 0.2), br = w * (0.2 - i * 0.014);
      b += g(circ(bx, by, br, '#FFFFFF', { 'fill-opacity': 0.45, stroke: '#FFFFFF', 'stroke-width': n(Math.max(1.4, w * 0.04)) }) + circ(bx - br * 0.35, by - br * 0.35, br * 0.24, '#FFFFFF'), { 'data-bubble': i + 1 });
    }
    // one going pop
    var px = x + dir * w * 4.5, py = y - w * (level ? 0.5 : 1.36), q = w * 0.13;
    b += stroke('M' + n(px - q) + ' ' + n(py - q) + 'l' + n(-q * 0.7) + ' ' + n(-q * 0.7) + 'M' + n(px + q) + ' ' + n(py - q) + 'l' + n(q * 0.7) + ' ' + n(-q * 0.7) + 'M' + n(px) + ' ' + n(py - q * 1.3) + 'v' + n(-q), C.foam, Math.max(1.2, w * 0.03), { opacity: 0.9 });
    return g(s + g(b, { 'data-part': 'bubble-string' }), { 'data-part': 'bubbles' });
  }

  // ------------------------------------------------------------------ the Roar's panel: three forepaws on a log

  // The cats' coats (app/art/cats.js, FUR: base, line, stripe, light, pattern, patches), so her own
  // forepaws wear her look; tests/set-openriver.test.js checks they still match cats.js. A white-paws
  // marking makes the paws white (bright white on a pale coat, as cats.js does).
  var FURS = {
    black: { base: '#3d3844', line: '#18161c', light: '#5b5465' },
    white: { base: '#fbf8f2', line: '#a39787', light: '#ffffff' },
    'silver-tabby': { base: '#c3cbd4', line: '#5a6574', stripe: '#6c7886', light: '#e4e9ef', pattern: 'tabby' },
    'brown-tabby': { base: '#b5895b', line: '#4c3522', stripe: '#5b3f27', light: '#d5ae80', pattern: 'tabby' },
    ginger: { base: '#e8913a', line: '#8f4a1b', stripe: '#b5602a', light: '#f7b86e', pattern: 'tabby' },
    cream: { base: '#f2dbb1', line: '#a3855a', stripe: '#d8b47f', light: '#fcf0da', pattern: 'tabby' },
    grey: { base: '#9ea5ad', line: '#4f565e', light: '#c3c9cf' },
    tortie: { base: '#3f3330', line: '#1b1412', light: '#5e4b44', pattern: 'tortie', patches: ['#da853b', '#ecb877'] },
    calico: { base: '#fbf8f2', line: '#998b7b', light: '#ffffff', pattern: 'calico', patches: ['#e3893a', '#3d3844'] }
  };
  var PALE_FUR = { white: 1, cream: 1, calico: 1 };
  // Riffle (cats.js BEASTS.riffle's base, line and light), the skin between his toes a little paler
  var RIFFLE_PAW = { base: '#8c5a36', line: '#3b2415', light: '#bd875a', web: '#b98a62', claw: '#f3e4c8' };
  // a claw dug into the log is lit, as every counted claw in the game is: warm gold
  var DUG = { fill: '#FFE07A', line: '#C98A12', glow: '#FFD86E' };

  function patchP(X, u0, v0, ru, rv, seed) {
    var P = [], r = rng(seed), k = 16, ph = r() * 6.28, ph2 = r() * 6.28;
    for (var i = 0; i < k; i++) {
      var t = Math.PI * 2 * i / k, w = 1 + 0.18 * Math.sin(3 * t + ph) + 0.1 * Math.sin(5 * t + ph2);
      P.push(X(u0 + Math.cos(t) * ru * w, v0 + Math.sin(t) * rv * w));
    }
    return P;
  }

  /* One of her forepaws on the log, as she sees it: the foreleg coming up from the bottom of the
   * panel in her coat, the paw (white for white paws), four toes and the dewclaw on its inner side
   * (`dew`: +1 right, -1 left). `state` says what each of its five claws is doing, the four toes left
   * to right and then the dewclaw: a number (dug into the wood, lit gold: that claw's place in the
   * count), 0 (not yet: sheathed) or 'tuck' (the toe curled under: the tenth). Returns { svg, box }. */
  var CAT_TOES = [-0.68, -0.23, 0.23, 0.68];
  function herPaw(S, ox, oy, deg, s, look, dew, state) {
    look = look || {};
    var reach = Math.max(0.6, (1040 - oy) / s);   // how far back the foreleg is drawn, in paw widths: to just past the panel's bottom
    var X = pawFrame(ox, oy, deg * Math.PI / 180, s), furId = FURS[look.fur] ? look.fur : 'brown-tabby', F = FURS[furId], white = look.marking === 'white-paws';
    var pawC = white ? (PALE_FUR[furId] ? '#ffffff' : '#fcf9f3') : F.base, lw = Math.max(1.6, s * 0.018), out = '', under = '', shapes = [], box = [1e9, 1e9, -1e9, -1e9];
    function grow(P) { P.forEach(function (q) { box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; }); return P; }
    var aw = 0.4 + (reach - 0.3) * 0.04, arm = [X(-0.3, -0.4), X(-reach, -aw), X(-reach, aw), X(-0.3, 0.4)];
    if (F.pattern === 'tabby') {
      var bands = '';
      [-0.74, -1.16, -1.6, -2.06, -2.52].forEach(function (u, i) {
        if (u - 0.12 < -reach) return;
        var w = 0.4 + (-0.3 - u) * 0.04, t = 0.08 + (i % 2) * 0.02;
        bands += pts([X(u, -w), X(u + 0.07, -w * 0.3), X(u + 0.02, w * 0.25), X(u + 0.06, w), X(u - t, w), X(u - t - 0.03, w * 0.25), X(u - t + 0.04, -w * 0.3), X(u - t, -w)]) + 'Z';
      });
      under += path(bands, F.stripe, { opacity: 0.9 });
    } else if (F.pattern === 'tortie' || F.pattern === 'calico') {
      // a patch of each of her colours on the foreleg, cut to it
      under += g(path(pts(patchP(X, -0.86, 0.2, 0.3, 0.26, 61)) + 'Z', F.patches[0]) + path(pts(patchP(X, -0.98, -0.3, 0.26, 0.22, 62)) + 'Z', F.patches[1]), { 'clip-path': S.clip('or-arm' + (dew > 0 ? 'l' : 'r'), path(pts(arm) + 'Z', '#fff')) });
    }
    under += path(pts([X(-0.36, 0.22), X(-reach, aw * 0.6), X(-reach, aw), X(-0.36, 0.4)]) + 'Z', mix(F.base, F.line, 0.2), { opacity: 0.5 }) +
      stroke(pts([X(-0.5, -0.26), X(-reach, -aw * 0.66)]), F.light, s * 0.045, { opacity: 0.45 });
    if (white) shapes.push([[X(-0.64, -0.41), X(-0.72, -0.2), X(-0.65, 0), X(-0.73, 0.2), X(-0.64, 0.41), X(-0.1, 0.47), X(-0.1, -0.47)], pawC]);
    // the toes: a tucked one is pulled back under the paw, smaller
    CAT_TOES.forEach(function (f, i) {
      var tuck = state[i] === 'tuck', rad = tuck ? 0.33 : 0.43;
      shapes.push([grow(ovalP(X, Math.cos(f) * rad, Math.sin(f) * rad, tuck ? 0.15 : 0.2, tuck ? 0.14 : 0.175, 16)), pawC, true]);
    });
    shapes.push([grow(ovalP(X, 0, 0, 0.44, 0.5, 24)), pawC]);
    shapes.push([grow(ovalP(X, -0.16, dew * 0.47, 0.12, 0.1, 12)), pawC]);
    [[arm, F.base]].concat(shapes).forEach(function (sh) { out += path(pts(sh[0]) + 'Z', F.line, { stroke: F.line, 'stroke-width': n(lw * 2), 'stroke-linejoin': 'round', 'data-paw': 'player' }); });
    out += path(pts(arm) + 'Z', F.base) + under;
    // (every toe keeps a line of its own, so a white paw's toes can be told apart)
    shapes.forEach(function (sh) { out += path(pts(sh[0]) + 'Z', sh[1], sh[2] ? { stroke: F.line, 'stroke-width': n(lw * 0.7), 'stroke-opacity': 0.6 } : null); });
    var parts = '';
    [-0.45, 0, 0.45].forEach(function (f) { parts += pts([X(Math.cos(f) * 0.3, Math.sin(f) * 0.3), X(Math.cos(f) * 0.56, Math.sin(f) * 0.56)]); });
    out += stroke(parts, F.line, lw * 1.3, { opacity: 0.7 }) + stroke(pts([X(-0.27, dew * 0.38), X(-0.1, dew * 0.42)]), F.line, lw, { opacity: 0.5 });
    // the claws: one not yet dug in is sheathed, and nothing of it shows
    function claw(P, tip, mid, st) {
      grow(P);
      if (!st || st === 'tuck') return '';
      // dug in: a short hooked claw lit gold, its tip gone into the wood: a nick in the bark, two chips
      var c = '', q = s * 0.045;
      c += circ(mid[0], mid[1], s * 0.1, DUG.glow, { opacity: 0.5 });
      c += path(pts(P) + 'Z', DUG.fill, { stroke: DUG.line, 'stroke-width': n(Math.max(1.6, lw * 0.8)), 'stroke-linejoin': 'round' });
      c += ell(tip[0], tip[1], q * 1.25, q * 0.5, mix(S.pal.woodDark, S.pal.shade, 0.15)) +
        stroke('M' + n(tip[0] - q * 1.9) + ' ' + n(tip[1] - q * 0.7) + 'l' + n(-q * 0.9) + ' ' + n(-q * 0.8) + 'M' + n(tip[0] + q * 1.9) + ' ' + n(tip[1] - q * 0.7) + 'l' + n(q * 0.9) + ' ' + n(-q * 0.8), '#FFFFFF', Math.max(1.4, lw * 0.7), { opacity: 0.9 });
      return g(c, { 'data-claw': 'dug', 'data-n': st });
    }
    CAT_TOES.forEach(function (f, i) {
      var st = state[i];
      if (st === 'tuck') {
        // the tenth: no claw, only the curl of the toe that hides it
        var a = X(Math.cos(f) * 0.47 - 0.02, Math.sin(f) * 0.47 - 0.12), m = X(Math.cos(f) * 0.52, Math.sin(f) * 0.52), b = X(Math.cos(f) * 0.44 + 0.03, Math.sin(f) * 0.44 + 0.12);
        out += g(stroke('M' + n(a[0]) + ' ' + n(a[1]) + 'Q' + n(m[0]) + ' ' + n(m[1]) + ' ' + n(b[0]) + ' ' + n(b[1]), F.line, lw * 1.4, { opacity: 0.75 }), { 'data-claw': 'tucked' });
        return;
      }
      var cu = Math.cos(f), cv = Math.sin(f);
      out += claw(clawP(X, f, 0.56, 0.8, 0.072, 0.13), X(cu * 0.8, cv * 0.8), X(cu * 0.7, cv * 0.7), st);
    });
    // the dewclaw: on the paw's inner side, a little way back, hooked forward
    out += claw(clawUV(X, -0.12, dew * 0.53, 0.08, dew * 0.72, 0.062, 0.13 * dew), X(0.08, dew * 0.72), X(0, dew * 0.64), state[4]);
    return { svg: out, box: box };
  }

  /* Riffle's forepaw, planted on the same log: sleek brown, five short toes with the skin stretched
   * between them (webbed), little pale claws; his foreleg running back to his shoulder, which is all
   * of him the panel shows, at its right edge. palm: [x, y]; deg: the way his toes point; s: the
   * paw's width; sh: [x, y, rx, ry], the shoulder. */
  var OTTER_TOES = [-0.92, -0.46, 0, 0.46, 0.92];
  function rifflePaw(S, palm, deg, s, sh) {
    var R = RIFFLE_PAW, X = pawFrame(palm[0], palm[1], deg * Math.PI / 180, s), lw = Math.max(1.6, s * 0.015), shapes = [], claws = [], out = '', box = [1e9, 1e9, -1e9, -1e9], i;
    function grow(P) { P.forEach(function (q) { box = [Math.min(box[0], q[0]), Math.min(box[1], q[1]), Math.max(box[2], q[0]), Math.max(box[3], q[1])]; }); return P; }
    var tipR = OTTER_TOES.map(function (f, ti) { return ti === 0 || ti === 4 ? 0.56 : 0.63; });
    for (i = 0; i < 4; i++) {
      var g0 = OTTER_TOES[i], g1 = OTTER_TOES[i + 1], gm = (g0 + g1) / 2, rr = Math.min(tipR[i], tipR[i + 1]) - 0.07;
      shapes.push([[X(Math.cos(g0) * 0.28, Math.sin(g0) * 0.28), X(Math.cos(g0) * rr, Math.sin(g0) * rr), X(Math.cos(gm) * (rr - 0.08), Math.sin(gm) * (rr - 0.08)),
        X(Math.cos(g1) * rr, Math.sin(g1) * rr), X(Math.cos(g1) * 0.28, Math.sin(g1) * 0.28)], R.web]);
    }
    OTTER_TOES.forEach(function (f, ti) {
      shapes.push([grow(digitP(X, f, 0.2, tipR[ti], 0.08, 0.066)), R.base]);
      claws.push(grow(clawP(X, f, tipR[ti] + 0.04, tipR[ti] + 0.22, 0.034, 0.1)));
    });
    shapes.push([grow(ovalP(X, 0, 0, 0.38, 0.44, 22)), R.base]);
    // the foreleg: from the wrist back to the shoulder, thicker as it goes
    var wr = X(-0.3, 0), ex = sh[0] - sh[2] * 0.55, ey = sh[1] + sh[3] * 0.3, ax = ex - wr[0], ay = ey - wr[1], al = Math.sqrt(ax * ax + ay * ay) || 1, nx = -ay / al, ny = ax / al;
    var w0 = s * 0.3, w1 = s * 0.46, arm = [[wr[0] + nx * w0, wr[1] + ny * w0], [ex + nx * w1, ey + ny * w1], [ex - nx * w1, ey - ny * w1], [wr[0] - nx * w0, wr[1] - ny * w0]];
    // the shoulder: a big round of fur, cut by the panel's edge
    var xr = Math.min(1640, sh[0] + sh[2] * 1.2), yb = Math.min(1040, sh[1] + sh[3] * 1.2);
    var shD = 'M' + n(xr) + ' ' + n(yb) + 'H' + n(sh[0] - sh[2] * 0.7) + 'Q' + n(sh[0] - sh[2] * 1.06) + ' ' + n(sh[1] + sh[3] * 0.5) + ' ' + n(sh[0] - sh[2]) + ' ' + n(sh[1]) +
      'Q' + n(sh[0] - sh[2] * 0.92) + ' ' + n(sh[1] - sh[3] * 0.82) + ' ' + n(sh[0] - sh[2] * 0.2) + ' ' + n(sh[1] - sh[3]) + 'Q' + n(sh[0] + sh[2] * 0.1) + ' ' + n(sh[1] - sh[3] * 1.06) + ' ' + n(xr) + ' ' + n(sh[1] - sh[3] * 0.96) + 'Z';
    out += path(shD, R.line, { stroke: R.line, 'stroke-width': n(lw * 2), 'stroke-linejoin': 'round', 'data-paw': 'riffle-shoulder' });
    [[arm, R.base]].concat(shapes).forEach(function (q) { out += path(pts(q[0]) + 'Z', R.line, { stroke: R.line, 'stroke-width': n(lw * 2), 'stroke-linejoin': 'round', 'data-paw': 'riffle' }); });
    out += path(shD, S.linU([[0, R.light], [0.22, R.base], [1, mix(R.base, R.line, 0.3)]], sh[0] - sh[2], sh[1] - sh[3], sh[0], sh[1] + sh[3]));
    // sleek fur: a few short strokes lying back along it, light along its top
    var fur = '', rr2 = rng(7161);
    for (i = 0; i < 16; i++) { var fx = sh[0] - sh[2] * (0.75 - rr2() * 1.2), fy = sh[1] - sh[3] * (0.7 - rr2() * 1.5); fur += 'M' + n(fx) + ' ' + n(fy) + 'q' + n(s * 0.08) + ' ' + n(s * 0.1) + ' ' + n(s * 0.06) + ' ' + n(s * 0.24); }
    out += stroke(fur, R.line, lw, { opacity: 0.3 });
    out += path(pts(arm) + 'Z', R.base) + stroke(pts([arm[0], arm[1]]), R.light, s * 0.05, { opacity: 0.5 }) +
      path(pts([[wr[0] - nx * w0 * 0.3, wr[1] - ny * w0 * 0.3], [ex - nx * w1 * 0.3, ey - ny * w1 * 0.3], [ex - nx * w1, ey - ny * w1], [wr[0] - nx * w0, wr[1] - ny * w0]]) + 'Z', mix(R.base, R.line, 0.22), { opacity: 0.5 });
    shapes.forEach(function (q) { out += path(pts(q[0]) + 'Z', q[1]); });
    out += path(pts(ovalP(X, -0.08, -0.12, 0.2, 0.13, 12)) + 'Z', R.light, { opacity: 0.4 });
    claws.forEach(function (P) { out += path(pts(P) + 'Z', R.claw, { stroke: R.line, 'stroke-width': n(Math.max(1.6, lw)), 'stroke-linejoin': 'round', 'data-claw': 'riffle' }); });
    return { svg: out, box: box };
  }

  // ------------------------------------------------------------------ the skymonster

  /* Three sizes, and then gone. Far: one bright light, low in the sky. Near: a shape with wings,
   * head on, its lights lit. Over: an airliner from below and a little to one side, its belly, its
   * row of little round windows, its wheels down. Gone: small, tail on, going away to land.
   * Always high: every size is all of it above `ceil`, the line each composition keeps its own
   * things under (the tests measure it). It has no shadow. */
  function glintLight(S, x, y, k) {
    var c = '#FFEFA8', R = 60 * k;
    var s = circ(x, y, R, S.radU([[0, '#FFFBE2', 1], [0.22, c, 0.8], [0.55, c, 0.3], [1, c, 0]], x, y, R));
    s += path(sparkleD(x, y, 30 * k), '#FFFFFF', { opacity: 0.95 }) + circ(x, y, 6.5 * k, '#FFFFFF');
    // far behind the light, the faintest hint of what carries it
    s += stroke('M' + n(x - 20 * k) + ' ' + n(y - 3 * k) + 'L' + n(x + 20 * k) + ' ' + n(y - 3 * k), mix(S.pal.sky[1], '#FFFFFF', 0.25), Math.max(1, 1.6 * k), { opacity: 0.55, 'stroke-linecap': 'butt' });
    return g(g(s, { 'class': 'pcs-pulse', style: 'animation-duration:1.6s' }), { 'data-part': 'plane', 'data-plane': 'far' });
  }

  function planeCols(S) {
    var p = S.pal, gold = S.tod === 'golden';
    return { body: mix('#F8F6FA', p.sky[p.sky.length - 1], gold ? 0.25 : 0.15), hi: gold ? '#FFF8E6' : '#FFFFFF', belly: mix('#BFC3D2', p.shade, 0.1), under: mix('#A3A9BE', p.shade, 0.18),
      blue: '#3B7BC2', win: '#2B3C56', glint: '#FFFFFF', sun: '#FFD25E', sun2: '#FFE9A0' };
  }

  // Head on, a little above the horizon and coming this way: a round body, two long wings, an
  // engine under each, the tail standing behind, wheels down, and its lights. k: half its wingspan / 100.
  function planeFront(S, x, y, k) {
    var c = planeCols(S), s = '';
    function P(list) { return pts(list.map(function (q) { return [x + q[0] * k, y + q[1] * k]; })) + 'Z'; }
    // the tail: fin and tailplane, behind the body
    s += path(P([[-3.4, -12], [-2.2, -47], [2.2, -47], [3.4, -12]]), c.blue) + circ(x, y - 34 * k, 4.6 * k, c.sun) +
      path(P([[-36, -19], [0, -23.5], [36, -19], [36, -16.6], [0, -19.2], [-36, -16.6]]), c.under);
    // the wings: out and a little up, thin
    s += path(P([[-12, 2], [-100, -9], [-100, -6.4], [-12, 9.5]]), c.under) + path(P([[12, 2], [100, -9], [100, -6.4], [12, 9.5]]), c.under) +
      path(P([[-12, 2], [-100, -9], [-100, -8], [-12, 4.4]]), c.hi, { opacity: 0.8 }) + path(P([[12, 2], [100, -9], [100, -8], [12, 4.4]]), c.hi, { opacity: 0.8 });
    // the engines
    [-41, 41].forEach(function (ex) {
      s += circ(x + ex * k, y + 11 * k, 9.2 * k, c.body) + circ(x + ex * k, y + 11 * k, 6.6 * k, '#2A2E3C') + circ(x + ex * k, y + 11 * k, 2 * k, c.hi);
    });
    // wheels down
    s += stroke('M' + n(x - 13 * k) + ' ' + n(y + 12 * k) + 'v' + n(11 * k) + 'M' + n(x + 13 * k) + ' ' + n(y + 12 * k) + 'v' + n(11 * k) + 'M' + n(x) + ' ' + n(y + 14 * k) + 'v' + n(9 * k), '#6A7088', 2.4 * k, { 'stroke-linecap': 'butt' }) +
      path(dot(x - 13 * k, y + 24 * k, 3.6 * k) + dot(x + 13 * k, y + 24 * k, 3.6 * k) + dot(x, y + 24 * k, 2.8 * k), '#2A2A34');
    // the body: round, the belly in shade, the windscreen a dark band
    s += circ(x, y, 15.5 * k, c.body) + path('M' + n(x - 15.2 * k) + ' ' + n(y + 3 * k) + 'A' + n(15.5 * k) + ' ' + n(15.5 * k) + ' 0 0 0 ' + n(x + 15.2 * k) + ' ' + n(y + 3 * k) + 'Q' + n(x) + ' ' + n(y + 9 * k) + ' ' + n(x - 15.2 * k) + ' ' + n(y + 3 * k) + 'Z', c.belly) +
      path(P([[-9.5, -7.6], [9.5, -7.6], [11.6, -2.6], [-11.6, -2.6]]), c.win) + path(P([[-8, -6.6], [-2, -6.6], [-3, -3.6], [-9.6, -3.6]]), c.glint, { opacity: 0.55 }) +
      path('M' + n(x - 14.6 * k) + ' ' + n(y + 0.6 * k) + 'H' + n(x + 14.6 * k) + 'L' + n(x + 15 * k) + ' ' + n(y + 2.6 * k) + 'H' + n(x - 15 * k) + 'Z', c.blue);
    // its lights: one under the nose, one at each wing root
    var L = '';
    [[0, 12, 38], [-19, 6, 30], [19, 6, 30]].forEach(function (q) {
      var lx = x + q[0] * k, ly = y + q[1] * k, R = q[2] * k;
      L += circ(lx, ly, R, S.radU([[0, '#FFFBE2', 0.95], [0.25, '#FFF0B8', 0.55], [1, '#FFF0B8', 0]], lx, ly, R)) + circ(lx, ly, 2.6 * k, '#FFFFFF');
    });
    s += g(L, { 'class': 'pcs-pulse', style: 'animation-duration:1.2s' });
    s += circ(x - 100 * k, y - 8 * k, 1.8 * k, '#FF5A4E', { 'class': 'pcs-blink' }) + circ(x + 100 * k, y - 8 * k, 1.8 * k, '#58D68D', { 'class': 'pcs-blink' });
    return g(s, { 'data-part': 'plane', 'data-plane': 'near' });
  }

  // Tail on, small, going away down the river to land.
  function planeAway(S, x, y, k) {
    var c = planeCols(S), s = '';
    function P(list) { return pts(list.map(function (q) { return [x + q[0] * k, y + q[1] * k]; })) + 'Z'; }
    s += path(P([[-12, 1], [-78, -5], [-78, -3], [-12, 7]]), c.under) + path(P([[12, 1], [78, -5], [78, -3], [12, 7]]), c.under);
    [-34, 34].forEach(function (ex) { s += circ(x + ex * k, y + 8 * k, 6.4 * k, c.belly); });
    s += circ(x, y, 12.5 * k, c.body) + path('M' + n(x - 12.2 * k) + ' ' + n(y + 3 * k) + 'A' + n(12.5 * k) + ' ' + n(12.5 * k) + ' 0 0 0 ' + n(x + 12.2 * k) + ' ' + n(y + 3 * k) + 'Z', c.belly);
    s += path(P([[-30, -6.5], [0, -9.5], [30, -6.5], [30, -4.2], [0, -6], [-30, -4.2]]), c.hi) + path(P([[-2.8, -6], [-1.8, -38], [1.8, -38], [2.8, -6]]), c.blue) + circ(x, y - 26 * k, 3.8 * k, c.sun);
    s += circ(x, y - 39 * k, 1.6 * k, '#FF5A4E', { 'class': 'pcs-blink' });
    return g(g(s, { 'class': 'pcs-drift', style: 'animation-duration:18s' }), { 'data-part': 'plane', 'data-plane': 'gone', opacity: 0.9 });
  }

  /* The airliner from below and a little to one side, in its own units: 1000 from tail (x -500) to
   * nose (x +500), flying to the right; the set mirrors it, so it crosses the panel to the left, on
   * its way down to land. o: { span (how long the wings are drawn), gear, face (one small face at
   * one window: pressed to the glass, never a wave), faceAt (which window, by its x) }. */
  var WIN = { y: -24, r: 11, rim: 14.5, x0: -322, step: 34, count: 21 };
  var FUS = 'M-470 -46Q-420 -66 -330 -70L380 -70Q468 -68 500 -14Q512 20 472 48Q440 70 380 70L-180 70Q-300 66 -400 22Q-470 -10 -482 -30Q-484 -44 -470 -46Z';
  function wingPts(rootL, dir, len, sweep, chord) {
    var ly = dir > 0 ? 58 : -48, tipL = [rootL - sweep * len, ly + dir * len];
    return { ly: ly, tipL: tipL, tipT: [tipL[0] - chord, tipL[1] - dir * 8] };
  }
  function airlinerLocal(S, o) {
    var c = planeCols(S), sp = o.span == null ? 1 : o.span, s = '';
    function wing(rootL, rootT, dir, len, sweep, chord) {
      var w = wingPts(rootL, dir, len, sweep, chord);
      w.d = 'M' + n(rootL) + ' ' + n(w.ly) + 'L' + n(w.tipL[0]) + ' ' + n(w.tipL[1]) + 'Q' + n(w.tipL[0] - chord * 0.5) + ' ' + n(w.tipL[1] + dir * 10) + ' ' + n(w.tipT[0]) + ' ' + n(w.tipT[1]) + 'L' + n(rootT) + ' ' + n(w.ly) + 'Z';
      return w;
    }
    function engine(cx, cy) {
      var e = '';
      e += path('M' + n(cx - 20) + ' ' + n(cy - 46) + 'L' + n(cx + 40) + ' ' + n(cy - 46) + 'L' + n(cx + 24) + ' ' + n(cy - 20) + 'L' + n(cx - 30) + ' ' + n(cy - 20) + 'Z', c.under);
      e += path('M' + n(cx - 90) + ' ' + n(cy - 30) + 'Q' + n(cx - 110) + ' ' + n(cy) + ' ' + n(cx - 90) + ' ' + n(cy + 30) + 'L' + n(cx + 80) + ' ' + n(cy + 38) + 'L' + n(cx + 80) + ' ' + n(cy - 38) + 'Z',
        S.lin('or-eng', [[0, c.hi], [0.35, c.body], [1, c.belly]]));
      e += ell(cx + 80, cy, 15, 38, mix(c.body, c.belly, 0.4)) + ell(cx + 82, cy, 10, 31, '#2A2E3C') + circ(cx + 86, cy, 7, c.hi) +
        stroke('M' + n(cx + 84) + ' ' + n(cy - 26) + 'L' + n(cx + 84) + ' ' + n(cy + 26) + 'M' + n(cx + 78) + ' ' + n(cy - 18) + 'L' + n(cx + 90) + ' ' + n(cy + 18) + 'M' + n(cx + 90) + ' ' + n(cy - 18) + 'L' + n(cx + 78) + ' ' + n(cy + 18), '#4A5068', 2.4);
      e += stroke('M' + n(cx - 80) + ' ' + n(cy - 26) + 'L' + n(cx + 74) + ' ' + n(cy - 32), c.hi, 3, { opacity: 0.7 });
      return e;
    }
    // the far wing, its engine and the far tailplane, behind the body
    var up = wing(70, -150, -1, 320 * sp, 0.72, 80);
    s += path(up.d, mix(c.under, S.pal.sky[1], 0.25)) + engine(70 - 0.72 * 320 * sp * 0.36 + 10, -48 - 320 * sp * 0.36 + 44);
    s += path('M-350 -40L-440 -40L-520 -122Q-526 -132 -514 -132L-488 -132Z', c.under);
    // the tail fin, with a round sun on it
    s += path('M-300 -64L-394 -252Q-402 -266 -420 -266L-466 -266Q-488 -264 -486 -244L-474 -46Z', c.blue) +
      path('M-300 -64L-394 -252Q-399 -260 -408 -263L-326 -66Z', '#FFFFFF', { opacity: 0.25 }) + circ(-426, -168, 26, c.sun) + circ(-426, -168, 16, c.sun2);
    // the body
    var fus = path(FUS, S.lin('or-body', [[0, c.hi], [0.3, c.body], [0.62, mix(c.body, c.belly, 0.5)], [1, c.under]]));
    var band = path('M-470 6L470 6L478 20L-460 22Z', c.blue) + path('M-466 26L476 26L472 32L-458 32Z', c.sun, { opacity: 0.85 }) +
      path('M-480 40Q0 46 480 40V80H-480Z', mix(c.belly, S.pal.shade, 0.15), { opacity: 0.5 });
    fus += g(band, { 'clip-path': S.clip('or-fus', path(FUS, '#fff')) });
    fus += stroke('M-330 -62L384 -62', c.hi, 6, { opacity: 0.85 });
    // the row of little round windows
    var wins = '', rims = '', gls = '', faceX = null, i;
    for (i = 0; i < WIN.count; i++) {
      var wx = WIN.x0 + i * WIN.step;
      if (o.face && faceX === null && wx >= (o.faceAt == null ? 52 : o.faceAt)) { faceX = wx; rims += dot(wx, WIN.y, WIN.rim); continue; }
      rims += dot(wx, WIN.y, WIN.rim); wins += dot(wx, WIN.y, WIN.r); gls += dot(wx - 3.6, WIN.y - 3.6, 3);
    }
    fus += path(rims, mix(c.body, c.belly, 0.55)) + path(wins, c.win) + path(gls, c.glint, { opacity: 0.85 });
    if (faceX !== null) fus += windowFace(S, faceX, WIN.y, WIN.r);
    fus += path('M-392 -54h30a8 8 0 0 1 8 8v70a8 8 0 0 1-8 8h-30a8 8 0 0 1-8-8v-70a8 8 0 0 1 8-8Z' + 'M392 -54h30a8 8 0 0 1 8 8v70a8 8 0 0 1-8 8h-30a8 8 0 0 1-8-8v-70a8 8 0 0 1 8-8Z', 'none',
      { stroke: mix(c.body, '#5A6078', 0.5), 'stroke-width': 2.6 });
    fus += path('M438 -40L462 -42L472 -26L440 -24Z' + 'M468 -40L486 -32L491 -22L476 -24Z', c.win) + path('M442 -37L454 -38L446 -28Z', c.glint, { opacity: 0.7 });
    s += fus;
    // the near tailplane, the near wing, its engine, the wheels and the lights
    s += path('M-350 30L-440 30L-508 118Q-512 128 -500 128L-476 128Z', c.under);
    var lo = wing(90, -170, 1, 330 * sp, 0.74, 86);
    s += path(lo.d, S.lin('or-wing', [[0, mix(c.under, c.hi, 0.25)], [1, c.under]])) +
      path('M90 58L' + n(lo.tipL[0]) + ' ' + n(lo.tipL[1]) + 'L' + n(lo.tipL[0] - 12) + ' ' + n(lo.tipL[1] - 4) + 'L78 58Z', c.hi, { opacity: 0.55 });
    s += circ(lo.tipL[0] - 30, lo.tipL[1] + 2, 6, '#FF5A4E', { 'class': 'pcs-blink' });
    s += engine(90 - 0.74 * 330 * sp * 0.42 + 20, 58 + 330 * sp * 0.42 + 40);
    if (o.gear !== false) {
      var gear = '', tyre = '#2A2A34', hub = '#C9CDD8', leg = '#6A7088', gy = 150;
      gear += stroke('M-150 60L-158 ' + n(gy) + 'M-96 60L-104 ' + n(gy) + 'M420 62V120', leg, 10);
      gear += stroke('M-158 ' + n(gy - 30) + 'L-104 ' + n(gy - 30), leg, 6);
      gear += circ(-158, gy, 27, tyre) + circ(-104, gy, 27, tyre) + circ(-158, gy, 11, hub) + circ(-104, gy, 11, hub) + circ(418, 132, 20, tyre) + circ(418, 132, 8, hub);
      s += gear;
    }
    s += circ(120, 66, 70, S.radB('or-light', [[0, '#FFF8D8', 0.95], [0.25, '#FFF0B8', 0.6], [1, '#FFF0B8', 0]])) + circ(120, 66, 9, '#FFFDF0');
    s += circ(60, 72, 6, '#FF5A4E', { 'class': 'pcs-blink' });
    return { svg: s, faceX: faceX };
  }

  // One small face at one window: warm light behind it, a round face close to the glass, two eyes
  // looking down at the river, a little hair. No hand: nobody waves.
  function windowFace(S, x, y, r) {
    var s = circ(x, y, r, '#FFE9B4') + circ(x, y, r * 1.9, 'none', { stroke: '#FFF3C4', 'stroke-width': n(r * 0.28), opacity: 0.7 });
    var f = circ(x, y + r * 0.18, r * 0.74, '#F2C7A0') + path('M' + n(x - r * 0.78) + ' ' + n(y - r * 0.02) + 'Q' + n(x - r * 0.7) + ' ' + n(y - r * 0.86) + ' ' + n(x) + ' ' + n(y - r * 0.84) + 'Q' + n(x + r * 0.7) + ' ' + n(y - r * 0.86) + ' ' + n(x + r * 0.78) + ' ' + n(y - r * 0.02) +
      'Q' + n(x + r * 0.3) + ' ' + n(y - r * 0.42) + ' ' + n(x) + ' ' + n(y - r * 0.4) + 'Q' + n(x - r * 0.3) + ' ' + n(y - r * 0.42) + ' ' + n(x - r * 0.78) + ' ' + n(y - r * 0.02) + 'Z', '#6B4A32') +
      path(dot(x - r * 0.28, y + r * 0.12, r * 0.11) + dot(x + r * 0.28, y + r * 0.12, r * 0.11), '#2B2430') +
      stroke('M' + n(x - r * 0.16) + ' ' + n(y + r * 0.5) + 'q' + n(r * 0.16) + ' ' + n(r * 0.12) + ' ' + n(r * 0.32) + ' 0', '#8A4B3A', Math.max(0.6, r * 0.08));
    s += g(f, { 'clip-path': S.clip('or-face', circ(x, y, r, '#fff')) });
    s += path(dot(x - r * 0.42, y - r * 0.46, r * 0.16), '#FFFFFF', { opacity: 0.8 });
    return g(s, { 'data-part': 'face' });
  }

  // The airliner where a composition puts it. V: [x, y, k, rot, span]; o: { face, faceAt, gear }.
  // The panel's point for its unit point (u, v): mirrored, turned by rot, scaled by k.
  function planeXY(V, u, v) {
    var a = (V[3] || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    return [V[0] - V[2] * (u * ca - v * sa), V[1] + V[2] * (u * sa + v * ca)];
  }
  // its lowest point on the panel (wing tip, engine, wheels, the belly's two ends): nothing of it is below this
  function planeLow(V, gearOn) {
    var sp = V[4] == null ? 1 : V[4], lo = wingPts(90, 1, 330 * sp, 0.74, 86), ecx = 90 - 0.74 * 330 * sp * 0.42 + 20, ecy = 58 + 330 * sp * 0.42 + 40;
    var P = [[lo.tipL[0], lo.tipL[1] + 8], [lo.tipT[0], lo.tipT[1] + 10], [lo.tipL[0] - 43, lo.tipL[1] + 12], [ecx - 100, ecy + 30], [ecx + 95, ecy + 38], [-180, 70], [380, 70], [472, 48], [-500, 128], [120, 136]];
    if (gearOn !== false) P = P.concat([[-158, 177], [-104, 177], [418, 152]]);
    return Math.max.apply(null, P.map(function (q) { return planeXY(V, q[0], q[1])[1]; }));
  }
  function airliner(S, V, o) {
    o = o || {};
    var A0 = airlinerLocal(S, { span: V[4], face: o.face, faceAt: o.faceAt, gear: o.gear });
    var body = '<g transform="translate(' + n(V[0]) + ' ' + n(V[1]) + ') scale(' + K.n4(-V[2]) + ' ' + K.n4(V[2]) + ') rotate(' + n(V[3] || 0) + ')">' + A0.svg + '</g>';
    if (A0.faceX !== null) { var f = planeXY(V, A0.faceX, WIN.y), fr = WIN.rim * V[2] * 1.5; keep(S, f[0] - fr, f[1] - fr, fr * 2, fr * 2); }
    return body;
  }
  // The roar itself, drawn: jagged lines of sound close under the belly, fore and aft of the wing, in
  // the sky and nowhere else. Nothing moves on the water for it.
  function roarLines(S, V, yMax) {
    var out = '', r = rng(7171), lw = Math.max(2.4, 3.2 * V[2]);
    [[-338, -196], [204, 396]].forEach(function (U) {
      for (var row = 0; row < 2; row++) {
        var P = [], v = 100 + row * 30, u = U[0] + row * 14, j = 0, d = '';
        while (u <= U[1] - row * 14) { P.push(planeXY(V, u, v + (j % 2 ? 8 : -8) + r() * 3)); u += 15; j++; }
        // in two pieces, so it reads as sound and not as a fence
        var half = Math.floor(P.length / 2);
        [P.slice(0, half - 1), P.slice(half + 1)].forEach(function (Q) { if (Q.length > 1 && Q.every(function (q) { return q[1] < yMax && q[0] > 16 && q[0] < 1584; })) d += pts(Q); });
        if (d) out += g(stroke(d, '#2A2236', lw * 1.8, { opacity: 0.2 }) + stroke(d, '#FFFDF6', lw), { 'class': 'pcs-pulse', style: 'animation-duration:.9s;animation-delay:-' + (row * 0.45).toFixed(2) + 's' });
      }
    });
    return g(out, { 'data-part': 'roar' });
  }

  /* The airplane for this panel. P: the composition's places for it, { far: [x, y, k], near: [x, y,
   * k], over: [x, y, k, rot, span], gone: [x, y, k] } (a size it has no place for is not drawn);
   * dflt: what the camera draws when the frame does not say. Returns the svg, and what it is. */
  function planeOf(S, P, dflt) {
    var v = S.opts.plane;
    if (v == null) v = dflt || 'none';
    return P && P[v] ? v : 'none';
  }
  function planeFor(S, P, state, o) {
    o = o || {};
    if (state === 'far') { keep(S, P.far[0] - 46 * P.far[2], P.far[1] - 46 * P.far[2], 92 * P.far[2], 92 * P.far[2]); return glintLight(S, P.far[0], P.far[1], P.far[2]); }
    if (state === 'near') return planeFront(S, P.near[0], P.near[1], P.near[2]);
    if (state === 'gone') return planeAway(S, P.gone[0], P.gone[1], P.gone[2]);
    if (state === 'over') {
      var body = airliner(S, P.over, o), roar = o.roar === false ? '' : roarLines(S, P.over, o.ceil == null ? 1000 : o.ceil - 8);
      // (the shared drift carries it on the way it is going, to the left, and at most 22 lower: `ceil` allows for it)
      return g(g(body + roar, { 'class': 'pcs-drift', style: 'animation-duration:9s' }), { 'data-part': 'plane', 'data-plane': 'over' });
    }
    return '';
  }

  // ------------------------------------------------------------------ the open views: wide, raft, light, rocks

  /* Each open view: hz (the far waterline), the sun, clouds, our shore's towers (far, near, the
   * tallest), the far shore and its needle, how long the towers' reflections are, the Crossing's
   * rocks (where, how big, the otters on them), the raft, where along it something comes up between
   * the logs, the airplane's places, and `ceil`: the line every size of airplane stays above, itself
   * well above every head on the raft and on the rocks. */
  var VIEWS = {
    // the wonder screen: the raft small on the shining river
    wide: {
      hz: 420, sun: [1180, 150], sunR: 430, seed: 7201, wk: 0.8, marks: 80,
      clouds: [[330, 150, 260, 54, 11], [1450, 260, 200, 42, 12], [800, 74, 170, 34, 13]],
      shore: { x0: -20, x1: 930, treeH: 32,
        far: [{ x: 14, w: 110, top: 262, cap: 'slant', far: 0.6 }, { x: 258, w: 86, top: 290, far: 0.66 }, { x: 760, w: 76, top: 310, far: 0.7, cap: 'slant' }, { x: 852, w: 56, top: 344, far: 0.76 }],
        near: [{ x: 116, w: 134, top: 196, cap: 'step', far: 0.34 }, { x: 344, w: 116, top: 160, cap: 'round', far: 0.3 }, { x: 640, w: 108, top: 226, far: 0.4 }],
        tall: { x: 480, w: 140, top: 84 } },
      far: { x0: 900, x1: 1620, k: 0.8, needle: 1320 },
      refl: 0.86, reflMax: 760, redRefl: true, shines: true,
      rocks: { x: -60, y: 672, s: 0.45, otters: 'mini', otterH: 60 },
      raft: { x0: 640, x1: 836, top: 716, bot: 752, k: 0.4 }, spot: 0.67,
      planes: { far: [1100, 300, 0.8], near: [1010, 232, 1.5], over: [800, 150, 0.72, 6, 0.5], gone: [240, 150, 1.0] }, ceil: 400
    },
    // cat height on the logs: shoulder to shoulder, the rocks behind
    raft: {
      hz: 470, sun: [1300, 130], sunR: 440, seed: 7202, wk: 1.25, marks: 64,
      clouds: [[1080, 280, 260, 54, 21], [1480, 110, 200, 42, 22]],
      shore: { x0: -20, x1: 900, treeH: 46,
        far: [{ x: -30, w: 120, top: 262, far: 0.6, cap: 'slant' }, { x: 300, w: 100, top: 300, far: 0.66 }, { x: 770, w: 90, top: 340, far: 0.7 }],
        near: [{ x: 96, w: 150, top: 176, cap: 'step', far: 0.32 }, { x: 610, w: 126, top: 240, cap: 'round', far: 0.4 }],
        tall: { x: 420, w: 156, top: 60 } },
      far: { x0: 880, x1: 1620, k: 0.9, needle: 1450 },
      refl: 0.42, reflMax: 700,
      rocks: { x: -10, y: 544, s: 0.8, otters: 'real', otterH: 106 },
      raft: { x0: 150, x1: 1230, top: 794, bot: 902, k: 1.05 }, spot: 0.13,
      // (`over`: to the right of the tallest tower, whose roof and red light stay clear of it)
      planes: { far: [1400, 300, 1.0], near: [1150, 190, 1.7], over: [1040, 74, 0.8, 5, 0.34], gone: [210, 160, 1.5] }, ceil: 276
    },
    // far down the river, one bright light low in the sky
    light: {
      hz: 590, sun: [300, 150], sunR: 430, seed: 7203, wk: 1.0, marks: 60, planeDefault: 'far',
      clouds: [[620, 180, 280, 58, 31], [1380, 250, 220, 46, 32], [1010, 90, 170, 34, 33]],
      shore: { x0: -20, x1: 700, treeH: 30,
        far: [{ x: 60, w: 80, top: 446, far: 0.7 }, { x: 420, w: 70, top: 476, far: 0.76, cap: 'slant' }, { x: 604, w: 54, top: 506, far: 0.8 }],
        near: [{ x: 170, w: 100, top: 390, far: 0.5, cap: 'step' }, { x: 506, w: 78, top: 440, far: 0.6, cap: 'round' }],
        tall: { x: 300, w: 100, top: 330, far: 0.4 } },
      far: { x0: 1010, x1: 1620, k: 0.62, needle: 1400 },
      refl: 0.5, reflMax: 760,
      rocks: { x: -60, y: 660, s: 0.5, otters: 'mini', otterH: 64 },
      raft: { x0: 60, x1: 760, top: 808, bot: 894, k: 0.85 }, spot: 0.1,
      planes: { far: [880, 424, 1.35], near: [870, 330, 2.3], over: [760, 86, 0.9, 5, 0.34] }, ceil: 512
    },
    // from the raft, looking back at the rocks
    rocks: {
      hz: 450, sun: [1400, 110], sunR: 420, seed: 7204, wk: 1.15, marks: 64, slap: true,
      clouds: [[420, 96, 240, 50, 41], [1180, 300, 200, 40, 42]],
      shore: { x0: -20, x1: 1640, treeH: 54,
        far: [{ x: 40, w: 130, top: 232, far: 0.6, cap: 'slant' }, { x: 560, w: 110, top: 262, far: 0.62 }, { x: 1130, w: 116, top: 226, far: 0.6, cap: 'step' }, { x: 1456, w: 130, top: 270, far: 0.66 }],
        near: [{ x: 216, w: 170, top: 146, cap: 'step', far: 0.3 }, { x: 870, w: 150, top: 176, cap: 'round', far: 0.34 }, { x: 1286, w: 146, top: 124, far: 0.3, cap: 'slant' }],
        tall: { x: 640, w: 180, top: 60 } },
      far: null,
      beach: [476, 622], refl: 0.34, reflAt: 630, reflMax: 800,
      rocks: { x: 640, y: 650, s: 1.25, otters: 'real', otterH: 158,
        extra: [[70, 634, 44], [176, 646, 62], [318, 636, 40], [430, 650, 56], [560, 640, 36]] },
      raft: { x0: 120, x1: 1340, top: 886, bot: 960, k: 0.9 }, spot: 0.085,
      planes: { far: [1450, 250, 1.0], near: [1200, 170, 1.7], over: [760, 70, 0.74, 5, 0.34], gone: [200, 150, 1.5] }, ceil: 270
    }
  };

  function shoreOf(L) { return { x0: L.shore.x0, x1: L.shore.x1, base: L.hz, treeH: L.shore.treeH, far: L.shore.far, near: L.shore.near, tall: L.shore.tall }; }
  function seamOf(B) { var gap = B.gap || 0; return B.top + (B.bot - B.top - gap) / 4 * 3 + gap - 2 * B.k; }

  // The river over the lower part of whoever is at `beside`: the river's own drawing, a level lip
  // with rings round it. A swimmer's drawing already ends at the waterline (app/art/cats.js draws
  // nothing below one): only its bottom edge goes under.
  function dunk(S, C, a, W, m, lim) {
    var who = (m && m.who) || '', pose = (m && m.pose) || '', swims = who === 'puddle' || ((who === 'riffle' || who === 'otter') && /^(swim|float|dive)$/.test(pose));
    var h = a.h, top = swims ? a.y - h * 0.035 : a.y - h * 0.34, bot = a.y + h * 0.22, x0 = a.x - h * 0.6, x1 = a.x + h * 0.6;
    // as wide as whoever it is (a long tail and all), but never over the raft
    var f = figure(who || 'clancat', { pose: pose || 'sit', mood: 'neutral', facing: (m && m.facing) || a.face || 'right', variant: m && m.variant }, a.x, a.y, h * (m && m.size > 0 ? +m.size : 1));
    if (f) { x0 = Math.min(x0, f.box[0] - h * 0.08); x1 = Math.max(x1, f.box[2] + h * 0.08); }
    if (lim && lim.xMin != null) x0 = Math.max(x0, lim.xMin);
    if (lim && lim.xMax != null) x1 = Math.min(x1, lim.xMax);
    var step = (x1 - x0) / 8, d = 'M' + n(x0) + ' ' + n(bot) + 'V' + n(top + h * 0.03) + 'Q' + n(x0 + step * 0.5) + ' ' + n(top) + ' ' + n(x0 + step) + ' ' + n(top);
    for (var i = 1; i < 7; i++) d += 'q' + n(step / 2) + ' ' + n((i % 2 ? -1 : 1) * h * 0.012) + ' ' + n(step) + ' 0';
    d += 'Q' + n(x1 - step * 0.5) + ' ' + n(top) + ' ' + n(x1) + ' ' + n(top + h * 0.03) + 'V' + n(bot) + 'Z';
    // the river itself (the same drawing, cut to a patch with a level lip), so the patch cannot be told from the water round it
    return g(W.inner, { 'clip-path': S.clip('or-dunk', path(d, '#fff')) }) + rings(S, C, a.x, top + h * 0.02, h * 0.56, 3, 0.85);
  }

  // The logs buzz while it goes over: quick little zigzags on the wood itself, never on the water.
  // The water does not move.
  function buzz(S, list, k) {
    var d = '';
    list.forEach(function (q) {
      var x = q[0], y = q[1], w = (q[2] || 16) * k, dir = q[3] || 1;
      d += 'M' + n(x) + ' ' + n(y) + 'l' + n(w * 0.25) + ' ' + n(-w * 0.5 * dir) + 'l' + n(w * 0.25) + ' ' + n(w * 0.5 * dir) + 'l' + n(w * 0.25) + ' ' + n(-w * 0.5 * dir) + 'l' + n(w * 0.25) + ' ' + n(w * 0.5 * dir);
    });
    return g(stroke(d, '#2A2236', Math.max(2.4, 5 * k), { opacity: 0.2 }) + stroke(d, '#FFFDF6', Math.max(1.4, 2.8 * k)), { 'class': 'pcs-pulse', style: 'animation-duration:.5s', 'data-part': 'buzz' });
  }

  function drawView(S, C, L, AM) {
    var o = S.opts, p = S.pal, back = '', B = L.raft, H = shoreOf(L);
    back += skyLayer(S, C, L);
    if (L.far) back += farShore(S, C, { x0: L.far.x0, x1: L.far.x1, base: L.hz, k: L.far.k, needle: L.far.needle });
    back += ourShore(S, C, H).svg;
    var W = water(S, C, L.hz, { k: L.wk, sunX: L.sun[0], seed: L.seed, marks: L.marks });
    var mid = W.svg;
    if (L.beach) {
      // looking straight at our own shore: the gravel of the point, down to the water
      var by0 = L.beach[0], by1 = L.beach[1], bd = 'M-20 ' + n(by0) + 'H1620V' + n(by1 - 8), r = rng(L.seed + 5), x;
      for (x = 1620; x > -20; x -= 164) bd += 'Q' + n(x - 82) + ' ' + n(by1 + (r() - 0.3) * 22) + ' ' + n(x - 164) + ' ' + n(by1 - 6 + (r() - 0.5) * 10);
      mid += path(bd + 'Z', S.linU([[0, mix(p.grass, C.bank, 0.4)], [0.3, mix(p.grass, C.gravel, 0.65)], [1, mix(C.gravel, p.stoneDark, 0.25)]], 0, by0, 0, by1));
      var peb = '';
      for (x = 0; x < 90; x++) peb += blob(r() * 1600, by0 + 36 + r() * (by1 - by0 - 52), 3 + r() * 6, 2 + r() * 3, 6, r, 0.3, 0.3);
      mid += path(peb, p.stoneDark, { opacity: 0.4 }) + K.tufts(S, 0, 1600, by0 + 4, by0 + 40, 46, L.seed + 6, p.grassNear, p.grassLight, 0.9);
    }
    mid += reflections(S, C, H, L.refl, L.reflMax, L.reflAt, L.redRefl === true);
    if (L.shines) {
      // "the whole river shines": little stars of light on it, most of them down the sun's own path
      var sp = '', rs = rng(L.seed + 9);
      for (var si = 0; si < 22; si++) {
        var ty = Math.pow(rs(), 0.9), sy = L.hz + 24 + ty * (1000 - L.hz - 60), sx = si % 3 ? L.sun[0] + (rs() - 0.5) * (120 + ty * 520) : 40 + rs() * 1520;
        sp += sparkleD(sx, sy, (5 + ty * 13) * (0.7 + rs() * 0.6));
      }
      mid += g(path(sp, '#FFFFFF', { opacity: 0.95, 'class': 'pcs-twk' }), { 'data-part': 'shine' });
    }
    var G = L.rocks;
    mid += rocksAt(S, C, { x: G.x, y: G.y, s: G.s, otters: G.otters, otterH: G.otterH, slap: L.slap === true, extra: G.extra });
    // the raft, and whatever comes up between its logs
    var between = '', seam = seamOf(B), sx = B.x0 + (B.x1 - B.x0) * L.spot, own = !castHas(S, 'puddle');
    if (own && o.foot === true) between += foot(S, sx, seam + 6 * B.k, 104 * B.k);
    if (own && o.bubbles === true) between += bubbles(S, C, sx + (o.foot === true ? 150 * B.k : 0), seam + 3 * B.k, 76 * B.k, 1);
    var pl = poleFor(S, AM.pole, B);
    var R = raft(S, C, { x0: B.x0, x1: B.x1, top: B.top, bot: B.bot, k: B.k, seed: L.seed + 1, water: W.inner, between: between });
    mid += pl.behind + R.svg + pl.lying;
    // the two spare fish on their string, at the raft's far end (the way home)
    // (on the far logs: whatever comes up between the two near ones, and its bubbles, are well clear of it)
    mid += spareFish(S, B.x0 + (B.x1 - B.x0) * 0.055, B.top + (B.bot - B.top) * 0.14, (AM['raft-1'] || { h: 300 }).h);
    if (o.shiver === true) mid += shiver(S, C, { x0: R.near[0], x1: R.near[1], wl: R.wl, top: R.deckTop, k: B.k });
    var swimmer = castAt(S, 'beside');
    if (swimmer && AM.beside) S.covers.beside = dunk(S, C, AM.beside, W, swimmer, AM.beside.x > B.x1 ? { xMin: Math.max.apply(null, R.logs.map(function (q) { return q.lb; })) + 10 * B.k } : { xMax: Math.min.apply(null, R.logs.map(function (q) { return q.la; })) - 10 * B.k });
    // the airplane, last of all: the river, the rocks and the raft are drawn before it, and are the
    // same to the byte whatever is in the sky
    var st = planeOf(S, L.planes, L.planeDefault), sky2 = planeFor(S, L.planes, st, { ceil: L.ceil });
    if (st === 'over') {
      var bl = B.x1 - B.x0;
      mid += buzz(S, [[B.x0 + bl * 0.07, R.deckTop + 12 * B.k, 20, 1], [B.x0 + bl * 0.3, R.deckTop + 12 * B.k, 20, 1], [B.x0 + bl * 0.56, R.deckTop + 12 * B.k, 20, 1], [B.x0 + bl * 0.9, R.deckTop + 12 * B.k, 20, 1],
        [B.x0 + bl * 0.26, R.wl - 13 * B.k, 18, -1], [B.x0 + bl * 0.72, R.wl - 13 * B.k, 18, -1]], B.k);
    }
    return { back: back + sky2 + mid, over: '', front: '' };
  }

  // ------------------------------------------------------------------ log: the Roar's panel

  var LOG = {
    hz: 530, sun: [240, 120], sunR: 430, seed: 7301, planeDefault: 'far',
    clouds: [[590, 250, 240, 50, 51], [1400, 190, 210, 44, 52], [1020, 420, 170, 34, 53]],
    shore: { x0: -20, x1: 790, treeH: 40,
      far: [{ x: 26, w: 110, top: 326, far: 0.6, cap: 'slant' }, { x: 580, w: 90, top: 370, far: 0.66 }],
      near: [{ x: 170, w: 130, top: 270, cap: 'step', far: 0.36 }, { x: 462, w: 100, top: 318, cap: 'round', far: 0.42 }],
      tall: { x: 316, w: 128, top: 196, far: 0.2 } },
    far: { x0: 820, x1: 1620, k: 0.8, needle: 1392 },
    refl: 0.4, reflMax: 656,
    rocks: { x: 130, y: 606, s: 0.92, otters: 'real', otterH: 104 },
    edge: 668,                                          // the far edge of the log her paws are on
    paws: [[500, 858, -86, 186, 1], [806, 856, -94, 186, -1]],    // [palm x, palm y, the toes' direction, width, the dewclaw's side]
    riffle: { palm: [1100, 862], deg: -98, s: 152, sh: [1596, 884, 190, 250] },
    planes: { far: [1230, 236, 1.15], near: [1050, 200, 2.3], over: [800, 6, 1.42, 5, 0.3] }, ceil: 318
  };
  // what each of her ten claws is doing after `count` taps: the left paw's four toes and its dewclaw
  // (1 to 5), the right paw's dewclaw and three of its toes (6 to 9); its last toe is the tucked one
  function clawStates(count) {
    function st(k) { return k <= count ? k : 0; }
    return [[st(1), st(2), st(3), st(4), st(5)], [st(7), st(8), st(9), 'tuck', st(6)]];
  }
  function clawCount(o) {
    var v = o.claws != null ? o.claws : o.taps != null ? o.taps : 0;
    v = Math.round(+v);
    return isFinite(v) ? clamp(v, 0, 9) : 0;
  }
  /* The skymonster comes on with every tap. The Tap shows each of its three sizes for three taps
   * (far for claws 1 to 3, near for 4 to 6, over from 7); within a size it grows a little at each
   * claw, and is that size in full at its last one. Never bigger or lower than the full size: the
   * line it stays above is measured for that. With any other count it is drawn in full. */
  var STAGES = { far: [1, 3, 0.6], near: [4, 6, 0.68], over: [7, 9, 0.84] };
  function stageGrowth(st, count) {
    var g0 = STAGES[st];
    return !g0 || count < g0[0] || count > g0[1] ? 1 : g0[2] + (1 - g0[2]) * (count - g0[0]) / (g0[1] - g0[0]);
  }
  function stagePlaces(P, st, count) {
    var f = stageGrowth(st, count), out = { far: P.far, near: P.near, over: P.over };
    if (f === 1) return out;
    if (st === 'far') out.far = [P.far[0] + (1 - f) * 60, P.far[1] + (1 - f) * 40, P.far[2] * f];
    // (nearer, it climbs the sky from where the light was)
    if (st === 'near') out.near = [P.near[0] + (1 - f) * (P.far[0] - P.near[0]), P.near[1] + (1 - f) * (P.far[1] - P.near[1]), P.near[2] * f];
    // (and comes in over the panel from the right)
    if (st === 'over') out.over = [P.over[0] + (1 - f) * 1100, P.over[1], P.over[2] * f, P.over[3], P.over[4]];
    return out;
  }

  function drawLog(S, C) {
    var L = LOG, o = S.opts, p = S.pal, back = '', front = '', H = shoreOf(L), r = rng(L.seed), i;
    back += skyLayer(S, C, L);
    back += farShore(S, C, { x0: L.far.x0, x1: L.far.x1, base: L.hz, k: L.far.k, needle: L.far.needle });
    back += ourShore(S, C, H).svg;
    var W = water(S, C, L.hz, { k: 1.1, sunX: 980, seed: L.seed, marks: 40, y1: L.edge + 30 });
    var mid = W.svg + reflections(S, C, H, L.refl, L.reflMax);
    mid += rocksAt(S, C, { x: L.rocks.x, y: L.rocks.y, s: L.rocks.s, otters: L.rocks.otters, otterH: L.rocks.otterH });
    if (o.shiver === true) mid += shiver(S, C, { x0: 120, x1: 1480, wl: L.edge - 40, top: null, k: 1.2 });
    // the log: its far edge against the river, the round of it coming toward us, bark, a lashing
    var e = L.edge, edgeD = 'M-20 ' + n(e + 6) + 'Q400 ' + n(e - 9) + ' 800 ' + n(e - 3) + 'T1620 ' + n(e + 5);
    // (pale, sun-bleached wood: her paws read on it in any coat, and so does his brown one)
    var pale = mix(p.woodLight, p.sandLight, 0.42);
    var lg = path(edgeD + 'V1010H-20Z', S.linU([[0, mix(pale, '#FFFFFF', 0.35)], [0.1, pale], [0.55, mix(pale, p.woodLight, 0.6)], [1, mix(p.woodLight, p.wood, 0.6)]], 0, e - 8, 0, 1000));
    var bark = '', knots = '';
    for (i = 0; i < 26; i++) {
      var by = e + 26 + Math.pow(r(), 0.8) * 270, bx = r() * 1700 - 80, bl = 90 + r() * 260;
      bark += 'M' + n(bx) + ' ' + n(by) + 'q' + n(bl / 2) + ' ' + n((r() - 0.5) * 12) + ' ' + n(bl) + ' ' + n((r() - 0.5) * 6);
    }
    [[250, e + 150, 26], [1250, e + 96, 20]].forEach(function (q) { knots += ell(q[0], q[1], q[2], q[2] * 0.42, 'none', { stroke: p.woodDark, 'stroke-width': 3, opacity: 0.4 }) + ell(q[0], q[1], q[2] * 0.4, q[2] * 0.16, p.woodDark, { opacity: 0.35 }); });
    lg += stroke(bark, p.woodDark, 3, { opacity: 0.26 }) + knots + stroke(edgeD, p.rim, 5, { opacity: 0.7 }) + stroke(edgeD, C.foam, 3, { opacity: 0.55, transform: 'translate(0 -5)' });
    // a vine lashing, over the log and away under it
    var vd = '', lv = '';
    [86, 112].forEach(function (vx) { vd += 'M' + n(vx - 8) + ' ' + n(e - 4) + 'Q' + n(vx + 26) + ' ' + n(e + 150) + ' ' + n(vx - 2) + ' 1010'; });
    lv += leafD(100, e - 2, 44, -2.2, 16) + leafD(108, e, 38, -0.7, 14);
    lg += stroke(vd, C.vine, 13) + stroke(vd, p.leafLight, 3.6, { opacity: 0.5, transform: 'translate(-3 -1)' }) + path(dot(100, e + 2, 17), C.vine) + path(lv, p.leafMid);
    front += g(lg, { 'data-part': 'log' });
    // Riffle, right there: his shoulder at the panel's edge, his webbed forepaw on the same log
    var Rf = L.riffle, rp = rifflePaw(S, Rf.palm, Rf.deg, Rf.s, Rf.sh);
    front += g(rp.svg, { filter: S.shadow('m'), 'data-part': 'riffle-paw' });
    // her own two forepaws, a claw dug in for every tap, the tenth tucked
    var count = clawCount(o), states = clawStates(count), box = rp.box.slice(), paws = '';
    L.paws.forEach(function (q, qi) {
      var hp = herPaw(S, q[0], q[1], q[2], q[3], S.look, q[4], states[qi]);
      paws += hp.svg;
      box = [Math.min(box[0], hp.box[0]), Math.min(box[1], hp.box[1]), Math.max(box[2], hp.box[2]), Math.max(box[3], hp.box[3])];
    });
    front += g(paws, { filter: S.shadow('m'), 'data-part': 'her-paws', 'data-claws': count });
    keep(S, box[0] - 14, box[1] - 14, box[2] - box[0] + 28, box[3] - box[1] + 28);
    // the airplane, last of all (see drawView); and Tallyheart on her rock, until it has gone (she
    // is there before the first tap, calling, so the Tap never pops her in)
    var st = planeOf(S, L.planes, L.planeDefault), a = SPOTS.log['far-rocks'], stand = '';
    if (o.plane !== 'gone' && !C.gold && !castAt(S, 'far-rocks') && !castHas(S, 'tallyheart')) {
      var T = figure('tallyheart', { pose: 'pawup', mood: 'shout', facing: 'right' }, a.x, a.y, a.h);
      if (T) {
        stand = g(ell(a.x, a.y - 1, a.h * 0.3, Math.max(2.5, a.h * 0.045), p.shade, { opacity: 0.28 }) + T.svg, { 'data-part': 'tallyheart' });
        keep(S, T.box[0] - 6, T.box[1] - 6, T.box[2] - T.box[0] + 12, T.box[3] - T.box[1] + 12);
      }
    }
    var sky2 = planeFor(S, stagePlaces(L.planes, st, count), st, { ceil: L.ceil });
    if (st === 'over') {
      front += buzz(S, [[250, e + 34, 30, 1], [640, e + 30, 30, 1], [934, e + 34, 30, 1], [1296, e + 32, 30, 1]], 1);
    }
    return { back: back + sky2 + mid + stand, over: '', front: front };
  }

  // ------------------------------------------------------------------ sky: straight up from the raft

  var SKY = {
    sun: [1380, 170], sunR: 520, planeDefault: 'over',
    clouds: [[250, 250, 300, 62, 61], [1290, 800, 280, 58, 62], [470, 900, 230, 46, 63]],
    // (`over`: its wheels and its near engine clear of both heads at the bottom edge, with sky between)
    planes: { far: [1060, 300, 1.2], near: [880, 340, 0.6, 7, 1], over: [800, 200, 1.9, 7, 0.45], gone: [300, 240, 1.3] }, faceAt: 52
  };
  function drawSky(S, C) {
    var L = SKY, back = '', cl = '', a = SPOTS.sky.pole;
    back += K.sky(S, 0, 0, 1600, 1000, { sun: L.sun, sunR: L.sunR });
    L.clouds.forEach(function (c) { cl += cloud(S, C, c[0], c[1], c[2], c[3], c[4]); });
    back += g(cl, { 'class': 'pcs-drift', style: 'animation-duration:70s' });
    var st = planeOf(S, L.planes, L.planeDefault);
    if (st === 'near') back += g(airliner(S, L.planes.near, { gear: true }), { 'data-part': 'plane', 'data-plane': 'near' });
    else back += planeFor(S, L.planes, st, { face: S.opts.face === true, faceAt: L.faceAt, roar: false });
    // the top of the pole, beside whoever holds it
    if (castAt(S, 'pole') && !(S.cast || []).some(function (c) { return c && c.holds === 'pole'; })) back += pole(S, [a.x + 150, 1010, a.x + 96, 700, 15]);
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ edge, beside: close on the raft

  // (`fish`: where the string of spare fish lies, its loop: on a far log, clear of the cast and the gap)
  var EDGE = { raft: { x0: -90, x1: 1250, top: 150, bot: 870, k: 3.3, gap: 126, ends: 'right', sink: 0.44, bands: [0.24, 0.9] }, seed: 7401, at: 930, fish: [990, 404] };
  var BESIDE = { raft: { x0: -80, x1: 800, top: 270, bot: 560, k: 2.2, ends: 'right', sink: 0.44, bands: [0.16, 0.86] }, seed: 7501, spot: 0.5, fish: [384, 318] };

  function drawEdge(S, C) {
    var L = EDGE, o = S.opts, B = L.raft, W = water(S, C, -460, { k: 2.2, seed: L.seed, marks: 90 }), back = W.svg, over = '', own = !castHas(S, 'puddle'), seam = seamOf(B);
    var pl = poleFor(S, null, { x0: B.x0 + 160, x1: B.x1 - 60, top: B.top + 40, bot: B.top + 190, k: 1.9 });
    // the three far logs behind whoever is in the gap; the near log, the one at the raft's edge, over them
    var R = raft(S, C, { x0: B.x0, x1: B.x1, top: B.top, bot: B.bot, k: B.k, seed: L.seed + 1, gap: B.gap, ends: B.ends, sink: B.sink, bands: B.bands, water: W.inner, split: true });
    back += R.far + pl.lying + spareFish(S, L.fish[0], L.fish[1], SPOTS.edge['raft-1'].h);
    if (own && o.foot === true) back += foot(S, L.at, seam + 16, 170);
    if (own && o.bubbles === true) back += bubbles(S, C, L.at - (o.foot === true ? 330 : 40), seam + 8, 112, -1, true);
    over += R.nearLog;
    if (o.shiver === true) over += shiver(S, C, { x0: R.near[0], x1: R.near[1], wl: R.wl, top: null, k: 2.2 });
    var m = castAt(S, 'beside'), a = SPOTS.edge.beside;
    if (m) S.covers.beside = rings(S, C, a.x, a.y - 4, a.h * 0.5, 2, 0.8);
    return { back: back, over: over, front: '' };
  }

  function drawBeside(S, C) {
    var L = BESIDE, o = S.opts, B = L.raft, W = water(S, C, -420, { k: 2.2, seed: L.seed, marks: 90, sunX: 1250 }), back = W.svg, own = !castHas(S, 'puddle'), seam = seamOf(B);
    var between = '', sx = B.x0 + (B.x1 - B.x0) * L.spot;
    if (own && o.foot === true) between += foot(S, 130, seam + 12, 100);
    if (own && o.bubbles === true) between += bubbles(S, C, o.foot === true ? sx + 20 : 96, seam + 6, 84, 1);
    // (the lying pole: along the near log, in front of their feet; higher, it ran through her head)
    var pl = poleFor(S, null, { x0: B.x0 + 120, x1: B.x1 - 40, top: B.top + 222, bot: B.top + 262, k: 1.5 });
    var R = raft(S, C, { x0: B.x0, x1: B.x1, top: B.top, bot: B.bot, k: B.k, seed: L.seed + 1, ends: B.ends, sink: B.sink, bands: B.bands, water: W.inner, between: between });
    back += R.svg + pl.lying + spareFish(S, L.fish[0], L.fish[1], SPOTS.beside['raft-1'].h);
    if (o.shiver === true) back += shiver(S, C, { x0: R.near[0], x1: R.near[1], wl: R.wl, top: R.deckTop, k: 2 });
    var m = castAt(S, 'beside');
    if (m) S.covers.beside = dunk(S, C, SPOTS.beside.beside, W, m, { xMin: Math.max.apply(null, R.logs.map(function (q) { return q.lb; })) + 12 });
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ under: the raft from underneath

  /* Four logs in a row, ten little bump stars on each: where he has bumped his head. Looking up
   * through sunny blue water at the bright surface: the lightest picture in the chapter. */
  var UNDER = { logs: [[150, 312], [334, 496], [518, 680], [702, 864]], x0: 110, x1: 1490, stars: 10, sx0: 262, sx1: 1338, seed: 7601, vines: [176, 1424] };
  function drawUnder(S, C) {
    var L = UNDER, o = S.opts, p = S.pal, W = C.W, r = rng(L.seed), back = '', i;
    back += rect(-20, -20, 1640, 1040, S.radU([[0, mix(W.under, '#FFFFFF', 0.5)], [0.35, W.under], [1, mix(W.under, W.mid, 0.75)]], 520, 120, 1500));
    // the sun on the surface, and its light coming down through the water
    var rays = '';
    [[-0.5, 0.2], [-0.16, 0.16], [0.14, 0.2], [0.52, 0.16], [0.86, 0.2]].forEach(function (q) {
      var a0 = Math.PI / 2 + q[0] - q[1] / 2, a1 = Math.PI / 2 + q[0] + q[1] / 2;
      rays += pts([[520, 70], [520 + Math.cos(a0) * 1500, 70 + Math.sin(a0) * 1500], [520 + Math.cos(a1) * 1500, 70 + Math.sin(a1) * 1500]]) + 'Z';
    });
    back += path(rays, '#FFFFFF', { opacity: 0.16 }) + circ(520, 70, 300, S.radU([[0, '#FFFFFF', 0.9], [0.3, '#FFFBE0', 0.5], [1, '#FFFBE0', 0]], 520, 70, 300));
    var rip = '';
    for (i = 0; i < 34; i++) { var x = r() * 1600, y = r() * 1000, l = 40 + r() * 110; rip += 'M' + n(x) + ' ' + n(y) + 'q' + n(l / 2) + ' ' + n(-6 - r() * 6) + ' ' + n(l) + ' 0'; }
    back += stroke(rip, '#FFFFFF', 4, { opacity: 0.4 });
    // the logs, wet and brown, lit from above round their edges
    var logs = '', stars = '', wood = mix(p.wood, W.mid, 0.16), dark = mix(p.woodDark, W.mid, 0.3), lit = mix(p.woodLight, W.under, 0.45);
    L.logs.forEach(function (q, qi) {
      var ya = q[0], yb = q[1], rr = (yb - ya) / 2, x0 = L.x0 + (qi % 2) * 26, x1 = L.x1 - (qi % 2 ? 0 : 30), one = '', tex = '', st = '';
      one += rect(x0, ya, x1 - x0, yb - ya, S.linU([[0, lit], [0.16, wood], [0.6, mix(wood, dark, 0.5)], [0.88, wood], [1, lit]], 0, ya, 0, yb), { rx: rr });
      for (var j = 0; j < 12; j++) { var tx = x0 + 60 + r() * (x1 - x0 - 260), ty = ya + rr * (0.3 + r() * 1.4); tex += 'M' + n(tx) + ' ' + n(ty) + 'h' + n(40 + r() * 120); }
      one += stroke(tex, dark, 4, { opacity: 0.4 });
      // a little river weed hanging from it
      var weed = '';
      for (j = 0; j < 5; j++) { var wx = x0 + 90 + r() * (x1 - x0 - 180); weed += 'M' + n(wx) + ' ' + n(yb - 4) + 'q' + n(8) + ' ' + n(14) + ' ' + n(-3) + ' ' + n(24 + r() * 12); }
      one += stroke(weed, mix(p.leafMid, W.mid, 0.3), 5, { opacity: 0.8 });
      // ten little bump stars, in a row
      for (j = 0; j < L.stars; j++) {
        var bx = L.sx0 + (L.sx1 - L.sx0) * j / (L.stars - 1), by = (ya + yb) / 2 + (j % 2 ? 10 : -10), br = 27;
        st += g(path(sparkleD(bx, by, br), '#FFF4B8', { stroke: '#D9A22E', 'stroke-width': 3, 'stroke-linejoin': 'round' }) + circ(bx, by, 5, '#FFFFFF'), { 'data-bump': qi * L.stars + j + 1 });
      }
      logs += g(one, { 'data-log': qi + 1 });
      stars += g(st, { 'data-bumps': qi + 1 });
    });
    back += g(logs, { filter: S.shadow('m'), 'data-part': 'raft-under' });
    // the vines that lash them, across all four
    var vd = '';
    L.vines.forEach(function (vx) { [0, 16].forEach(function (dx) { vd += 'M' + n(vx + dx - 5) + ' ' + n(L.logs[0][0] - 6) + 'Q' + n(vx + dx + 12) + ' 500 ' + n(vx + dx - 3) + ' ' + n(L.logs[3][1] + 6); }); });
    back += stroke(vd, mix(C.vine, W.mid, 0.2), 9) + stroke(vd, p.leafLight, 2.6, { opacity: 0.5, transform: 'translate(-2 0)' });
    back += g(stars, { 'data-part': 'bumps' });
    if (o.bubbles === true && !castHas(S, 'puddle')) {
      var b = '';
      for (i = 0; i < 7; i++) { var bx2 = 800 + (i % 2 ? 26 : -18) + i * 6, by2 = 960 - i * 46, br2 = 20 - i * 1.6; b += circ(bx2, by2, br2, '#FFFFFF', { opacity: 0.4, stroke: '#FFFFFF', 'stroke-width': 3 }) + circ(bx2 - br2 * 0.35, by2 - br2 * 0.35, br2 * 0.22, '#FFFFFF'); }
      back += g(b, { 'data-part': 'bubbles' });
    }
    return { back: back, over: '', front: '' };
  }

  // ------------------------------------------------------------------ the set

  var DRAW = { log: drawLog, sky: drawSky, edge: drawEdge, beside: drawBeside, under: drawUnder };
  function draw(S) {
    light(S);
    var C = colors(S);
    if (VIEWS[S.comp]) return drawView(S, C, VIEWS[S.comp], SPOTS[S.comp]);
    return (DRAW[S.comp] || drawUnder)(S, C);
  }

  function perch(G, h, face) { var q = rockSpot(G, ROCKS.perch); return A(Math.round(q[0]), Math.round(q[1]), h, face || 'right', { elev: true }); }
  // (`beside`, the spot in the water: `air`, no ground shadow there; `elev`, so nobody is put in the
  // river for want of a spot, and a spot of a frame's own is sized from the raft's three)
  function wet(x, y, h, face, more) { var o = { elev: true, air: true }; for (var k in (more || {})) o[k] = more[k]; return A(x, y, h, face, o); }
  var SPOTS = {
    wide: { 'raft-1': A(690, 736, 66), 'raft-2': A(734, 736, 66, 'left'), pole: A(806, 736, 66, 'left'), beside: wet(920, 786, 64, 'left'), 'far-rocks': perch(VIEWS.wide.rocks, 74) },
    raft: { 'raft-1': A(640, 852, 372), 'raft-2': A(838, 852, 372, 'left'), pole: A(1110, 852, 372, 'left'), beside: wet(1420, 956, 300, 'left'), 'far-rocks': perch(VIEWS.raft.rocks, 150) },
    light: { 'raft-1': A(390, 854, 320), 'raft-2': A(560, 854, 320, 'left'), pole: A(700, 854, 320, 'left'), beside: wet(980, 946, 280, 'left'), 'far-rocks': perch(VIEWS.light.rocks, 86) },
    log: { 'far-rocks': perch(LOG.rocks, 150) },
    sky: { 'raft-1': A(270, 1100, 430), 'raft-2': A(1390, 1100, 430, 'left'), pole: A(590, 1124, 400, 'left', { elev: true }) },
    rocks: { 'raft-1': A(400, 932, 262), 'raft-2': A(590, 932, 262, 'left'), pole: A(1200, 932, 262, 'left'), beside: wet(1474, 972, 220, 'left'), 'far-rocks': perch(VIEWS.rocks.rocks, 190, 'left') },
    edge: { 'raft-1': A(560, 600, 410), 'raft-2': A(350, 600, 410), beside: wet(EDGE.at, 716, 300, 'left', { z: 'behind' }) },
    beside: { 'raft-1': A(585, 470, 340), 'raft-2': A(270, 470, 340), beside: wet(1130, 800, 380, 'left') },
    under: { beside: wet(800, 1000, 300) }
  };

  art.defineSet('openriver', {
    label: 'the open river under the Roar', tod: 'day', todMap: { sunset: 'golden', dusk: 'golden', night: 'golden' }, draw: draw,
    cams: {
      wide: { box: [0, 0, 1600], comp: 'wide' }, raft: { box: [0, 0, 1600], comp: 'raft' }, light: { box: [0, 0, 1600], comp: 'light' },
      log: { box: [0, 0, 1600], comp: 'log' }, sky: { box: [0, 0, 1600], comp: 'sky' }, rocks: { box: [0, 0, 1600], comp: 'rocks' },
      edge: { box: [0, 0, 1600], comp: 'edge' }, beside: { box: [0, 0, 1600], comp: 'beside' }, under: { box: [0, 0, 1600], comp: 'under' }
    },
    anchors: SPOTS,
    opts: { plane: ['none', 'far', 'near', 'over', 'gone'], shiver: [false, true], foot: [false, true], bubbles: [false, true], late: [false, true], face: [false, true], claws: 'number', fish: ['none', 'spare'] },
    defaults: {}
  });

  // For the tests: where each composition puts the things the rules are about.
  art.openriverInfo = function () {
    var out = {};
    function towersOf(L) { return L.shore.far.concat(L.shore.near).concat([L.shore.tall]).map(function (t) { return { x: t.x, w: t.w, top: t.top }; }); }
    Object.keys(VIEWS).forEach(function (k) {
      var L = VIEWS[k], pl = {};
      Object.keys(L.planes).forEach(function (st) { pl[st] = planeSpan(L.planes, st); });
      out[k] = { hz: L.hz, raft: { x0: L.raft.x0, x1: L.raft.x1, top: L.raft.top, bot: L.raft.bot, k: L.raft.k }, rocks: { x: L.rocks.x, y: L.rocks.y, s: L.rocks.s, w: ROCKS.w * L.rocks.s },
        needle: L.far ? L.far.needle : null, planes: pl, planeDefault: L.planeDefault || 'none', ceil: L.ceil, slap: L.slap === true, spot: L.raft.x0 + (L.raft.x1 - L.raft.x0) * L.spot, seam: seamOf(L.raft),
        otterH: L.rocks.otterH, otters: ROCKS.otters.map(function (q) { var c = rockSpot(L.rocks, q); return { x: c[0], y: c[1], variant: q[2], facing: q[3] }; }),
        towers: towersOf(L), reflAt: L.reflAt == null ? L.hz + 3 : L.reflAt, refl: L.refl };
    });
    var lp = {};
    Object.keys(LOG.planes).forEach(function (st) { lp[st] = planeSpan(LOG.planes, st); });
    out.log = { hz: LOG.hz, edge: LOG.edge, rocks: { x: LOG.rocks.x, y: LOG.rocks.y, s: LOG.rocks.s, w: ROCKS.w * LOG.rocks.s }, needle: LOG.far.needle, planes: lp, planeDefault: LOG.planeDefault, ceil: LOG.ceil,
      paws: LOG.paws.map(function (q) { return q.slice(); }), riffle: JSON.parse(JSON.stringify(LOG.riffle)), stages: JSON.parse(JSON.stringify(STAGES)),
      towers: towersOf(LOG), reflAt: LOG.hz + 3, refl: LOG.refl };
    var sp = {};
    Object.keys(SKY.planes).forEach(function (st) { sp[st] = planeSpan(SKY.planes, st); });
    out.sky = { planes: sp, planeDefault: SKY.planeDefault };
    out.edge = { raft: JSON.parse(JSON.stringify(EDGE.raft)), gapAt: EDGE.at, seam: seamOf(EDGE.raft), fish: EDGE.fish.slice() };
    out.beside = { raft: JSON.parse(JSON.stringify(BESIDE.raft)), seam: seamOf(BESIDE.raft), fish: BESIDE.fish.slice() };
    out.under = JSON.parse(JSON.stringify(UNDER));
    return out;
  };
  // the box an airplane size takes on the panel (the drift included): [x0, y0, x1, y1]
  function planeSpan(P, st) {
    var q = P[st];
    if (st === 'far') return [q[0] - 60 * q[2], q[1] - 60 * q[2], q[0] + 60 * q[2], q[1] + 60 * q[2]];
    if (st === 'gone') return [q[0] - 78 * q[2] - 60, q[1] - 41 * q[2], q[0] + 78 * q[2], q[1] + 16 * q[2] + 22];
    if (q.length < 4) return [q[0] - 102 * q[2], q[1] - 48 * q[2], q[0] + 102 * q[2], q[1] + 44 * q[2]];
    var low = planeLow(q, true), a = planeXY(q, 500, 0), b = planeXY(q, -500, 0), top = planeXY(q, -440, -266);
    return [Math.min(a[0], b[0]) - 60, Math.min(top[1], a[1], b[1]), Math.max(a[0], b[0]), low + (st === 'over' ? 22 : 0)];
  }
  art.openriverInfo.water = WATER;
  art.openriverInfo.puddle = function () { var c = puddleCols(), o = {}; for (var k in c) o[k] = c[k]; return o; };
  art.openriverInfo.rifflePaw = RIFFLE_PAW;
  art.openriverInfo.furs = FURS;
  art.openriverInfo.otters = OTTERS;

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

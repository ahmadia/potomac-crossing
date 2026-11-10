/* Book two, the page (docs/take-aways.md v0.3, section 7; section 10, step 6): node --test
 *
 * Read my book in volumes (app/ui.js renderBook): the two buttons under the title that switch them (44px at least, the
 * open one pressed, never printed), the volume a chapter's end and Read my book open, the store under a module 2
 * chapter's page drawn by the kit's place-value picture (PC.art.placeValue, `small`) with "In the store:" in Comic Neue
 * and the number in Andika, the winter sleepers (the dragonets' classes), the badger page's two columns (a row's
 * sighting under its rumours under 520px wide), the keepsake, what Read to me says of each, and the print rules. The
 * browser part of ui.js needs a DOM, so its book-two functions run here in a sandbox of their own, taken from the source
 * as written with the helpers they call (the way tests/takes-ui.test.js runs treasureSvg), on the real engine and art;
 * the wiring is pinned as text. Nothing a player can reach changes: a cat with no module 2 chapter finished gets v23's
 * book (renderBook's first volume is today's markup; the CSS block is book two's own, after the take block).
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/ui.js'));
const E = PC.engine;
const UI_SRC = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const stub = require('./fixtures/takes-stub.js');

// a function of ui.js as written (two-space indent): one line, or to its closing brace at the same indent
function fnSrc(name) {
  const i = UI_SRC.indexOf('  function ' + name + '(');
  assert.ok(i >= 0, name);
  const eol = UI_SRC.indexOf('\n', i), line = UI_SRC.slice(i, eol);
  if (/\}\s*$/.test(line) && line.split('{').length === line.split('}').length) return line + '\n';
  return UI_SRC.slice(i, UI_SRC.indexOf('\n  }\n', i) + 4);
}
// a var of ui.js as written: an array on one line, or an object to its closing brace at the same indent
function varSrc(name) {
  const i = UI_SRC.indexOf('  var ' + name + ' = ');
  assert.ok(i >= 0, name);
  return UI_SRC.charAt(i + name.length + 9) === '[' ? UI_SRC.slice(i, UI_SRC.indexOf('];\n', i) + 3) : UI_SRC.slice(i, UI_SRC.indexOf('\n  };\n', i) + 6);
}
const FNS = ['f1', 'esc', 'rich', 'richN', 'cap1', 'numWord', 'artCall', 'takeStoreFallback', 'markSvg', 'treasureSvg', 'wrapChar',
  'bookVol', 'bookVolButtons', 'bookTitleTwo', 'storePic', 'storeSays', 'sleeperPages', 'sleepersMore', 'sleeperArt', 'badgerPage', 'keepsakePage', 'bookTwoSays'];
// the page's book-two pieces, on this cat and these stories
function page(cat, list) {
  const src = ['NUMW', 'MARK'].map(varSrc).join('\n') + FNS.map(fnSrc).join('');
  return new Function('PC', 'E', 'cat', 'root', 'stories', src + '\nreturn {' + FNS.join(', ') + '};')(PC, E, cat, globalThis, () => list || PC.story);
}
const count = (s, re) => (s.match(re) || []).length;

/* The stand-in module 2 chapters with books (tests/book2.test.js has the engine's side). */
function two() {
  const s = stub();
  s.list.forEach((c) => { c.book = { recap: [{ text: 'Chapter ' + c.number + '.' }], store: 100 + c.number }; });
  s.ch12.book.title = '{name}{ending}’s First Frost-Time';
  s.ch12.book.store = 133;
  s.ch13.book.sleeper = { id: 'groundhog', name: 'the groundhog', lines: ['Round, brown and grumpy: “I was ASLEEP.”'] };
  s.ch13.book.badger = [{ row: 'sat', say: { text: 'A badger SAT on my whole patrol!', who: 'the old tom' } }, { row: 'size', say: { text: 'As big as a FOX!', who: 'the ferry otters' } }];
  s.ch17.book.badger = [{ row: 'size', saw: { text: 'As big as three cats. And grumpy.' } }];
  s.ch21.book.keepsake = { id: 'stone-tooth', name: 'The stone tooth', lines: ['Older than the river.'] };
  // (the real chapters to 12 beside the stand-ins; a real chapter 13 on is left out for its stand-in, whose book these
  // tests write: chapter 13's own badger rows and sleeper are tests/story-ch13.test.js's)
  return E.chapters(PC.story).filter((c) => (c.number || 1) < 13).concat(s.list);
}
function catAt(n, list, over) {
  const cat = Object.assign({ name: 'Fern', ending: 'heart', look: { sex: 'she', fur: 'calico', marking: 'white-paws', eyes: 'odd' }, flags: {}, finished: {}, dreams: {} }, over || {});
  list.forEach((s) => { if ((s.number || 1) <= n) cat.finished[s.id] = true; });
  return cat;
}

/* ------------------------------------------------------------------ the volumes */

test('the volume buttons: none with one volume; with two, "First Moon" and "First Frost-Time" under the title, the open one pressed, each its module\'s; never printed; at least 44px, Aa or not', () => {
  const list = two(), P = page(catAt(12, list), list);
  assert.equal(P.bookVolButtons(E.books(catAt(11, list), list), 1), '', 'one volume: nothing, as before');
  const vols = E.books(catAt(12, list), list);
  const h = P.bookVolButtons(vols, 2);
  assert.equal(h, '<div class="vols no-print" role="group" aria-label="Your books">' +
    '<button class="btn vol" type="button" data-vol="1" aria-pressed="false">First Moon</button>' +
    '<button class="btn vol" type="button" data-vol="2" aria-pressed="true">First Frost-Time</button></div>');
  assert.match(P.bookVolButtons(vols, 1), /data-vol="1" aria-pressed="true">First Moon<\/button>.*data-vol="2" aria-pressed="false"/);
  // 44px: the rule, and nothing after it in the book-two block makes them shorter (Aa only scales the type up)
  const css = bookCss();
  assert.match(css, /\n\.book \.vols \.btn\{min-height:44px;/);
  assert.equal(count(css, /\.vols[^{]*\{[^}]*min-height/g), 1);
  assert.doesNotMatch(css, /html\.big/);
  assert.match(HTML, /\.no-print,\.sheet,\.cfile\{display:none!important\}/, 'print hides .no-print (v23\'s rule)');
});

test('which volume opens: the one she pressed (or came back to); from a chapter\'s end, that chapter\'s; else her latest finished chapter\'s; one she has no chapter in never', () => {
  const list = two(), cat = catAt(12, list), P = page(cat, list), vols = E.books(cat, list);
  assert.equal(P.bookVol({}, vols), 2, 'Read my book: her latest finished chapter\'s');
  assert.equal(P.bookVol({ vol: 1 }, vols), 1);
  assert.equal(P.bookVol({ from: 'end', scrollTo: 'ch05' }, vols), 1, 'chapter 5 read again: its end opens the first volume');
  assert.equal(P.bookVol({ from: 'end', scrollTo: 'ch12' }, vols), 2);
  const one = catAt(11, list), P1 = page(one, list), v1 = E.books(one, list);
  assert.equal(P1.bookVol({ vol: 2 }, v1), 1, 'no second volume yet');
  assert.equal(P1.bookVol({}, v1), 1);
  assert.equal(page(catAt(0, list), list).bookVol({}, []), 1, 'no chapter finished: the first, empty');
});

test('renderBook: the first volume is v23\'s markup (the title line, the pages, the dragonets, the signature) with nothing added; the second\'s title, store, sleepers, badger page and keepsake only behind vol > 1', () => {
  const rb = fnSrc('renderBook');
  assert.ok(rb.includes("    var vols = E.books(cat, stories()), vol = bookVol(opts, vols);\n    var b = vol > 1 ? E.buildFullBook(cat, stories(), vol) : E.buildFullBook(cat, stories());"), 'the first volume: today\'s call, today\'s object');
  assert.ok(rb.includes("(vol > 1 ? bookTitleTwo(b.title) + volBtns : '<h1' + ((E.clanName(cat) || E.displayName(cat)).length > 12 ? ' class=\"long\"' : '') + '>' + esc(b.title) + '</h1>' + volBtns) +"));
  assert.ok(rb.includes("'<article class=\"book' + (vol > 1 ? ' vol' + vol : '') + '\" aria-label=\"' + esc(b.title) + '\">' +"));
  assert.ok(rb.includes("          (pg.store != null ? storePic(pg.store) : '') +\n          (pg.dream ? '<p class=\"dream\">' + richN(pg.dream) + '</p>' : '') + '</section>';"), 'the store under the recap, before the dream');
  assert.ok(rb.includes("      dragonetPages(b.dragonets) +\n      (vol > 1 ? sleeperPages(b.sleepers) + badgerPage(b.badger) + keepsakePage(b.keepsake) : '') +\n      '<div class=\"sig\">' + nameHtml(cat) + ' of CrystalClan</div>' +"));
  // the Warrior Counts' teaser lines as they were (pinned by story-ch11 and warrior-ui): they never touch the second volume,
  // whose chapters come after the Ceremony (built: wsBook's change needs it unbuilt) and none of whose teasers lead to it
  assert.ok(rb.includes('    var wsBook = t && !t.built && warriorBuilt() ? warriorNow() : null;'));
  assert.ok(rb.includes("    var wsNext = t && t.built && warriorBuilt() && (E.chapter(t.next, stories()) || {}).opensWhen === 'warrior' ? warriorNow() : null;"));
  const two0 = two();
  two0.filter((c) => E.moduleOf(c) === 2).forEach((c) => {
    const t = E.teaser(c, null, two0);
    assert.ok(!t || !t.next || E.chapter(t.next, two0).opensWhen !== 'warrior', c.id);
  });
  assert.ok(two0.some((c) => c.opensWhen === 'warrior' && c.number < 12), 'the Ceremony is built before module 2');
  // switching: the other volume from its top, Back as it was; the Hollow and My nest come back to it
  assert.ok(rb.includes("        if (m !== vol) go('book', { from: view.opts.from, vol: m });"));
  assert.ok(rb.includes("go(w, vols.length > 1 ? { from: 'book', vol: vol } : { from: 'book' });"), 'one volume: the links\' opts as before');
  assert.ok(fnSrc('onBack').includes("    if (n === 'hollow' || n === 'nest') return go(view.opts.from === 'book' ? 'book' : 'hub', view.opts.from === 'book' && view.opts.vol ? { back: true, vol: view.opts.vol } : { back: true });"));
  // a chapter's end still opens at its page; Read to me as before, then the store and book two's pages
  assert.ok(rb.includes('    if (opts && opts.scrollTo && b.pages.length > 1) {'));
  assert.ok(rb.includes("      if (pg.store != null) currentSpeech.push({ text: storeSays(pg.store) });\n      if (pg.dream) currentSpeech.push({ text: pg.dream });"));
  assert.ok(rb.includes('    if (vol > 1) bookTwoSays(b).forEach(function (it) { currentSpeech.push(it); });'));
  assert.ok(UI_SRC.includes("nextBtn('See your book', function () { go('book', { from: 'end', scrollTo: story.id }); });"), 'a chapter\'s end as before');
});

test('the volume she left survives the Hollow\'s shelf and One Count at a time (the take-aways review, screens S4): First Moon, the Hollow, One Count at a time, ‹, ‹ comes back to First Moon, not to First Frost-Time', () => {
  // the shelf's button and onBack, taken from the source as written, run on stand-ins: each go() is recorded
  const gone = [];
  const go = (n, o) => { gone.push([n, o]); };
  const L = two();
  const sh = UI_SRC.slice(UI_SRC.indexOf("    $('countsBtn').addEventListener('click',"), UI_SRC.indexOf('\n', UI_SRC.indexOf("    $('countsBtn').addEventListener('click',")));
  let tap = null;
  new Function('$', 'go', 'view', 'opts', sh)(() => ({ addEventListener: (t, f) => { tap = f; } }), go, { name: 'hollow', opts: { from: 'book', vol: 1, stories: L } }, { stories: L });
  tap();
  assert.deepEqual(gone[0], ['hollow', { counts: true, from: 'book', vol: 1, stories: L }], 'One Count at a time keeps the volume');
  const back = (view, hollowSub) => new Function('view', 'hollowSub', 'go', 'E', 'cat', 'story', 'persist', fnSrc('onBack') + 'return onBack;')(view, hollowSub, go, E, null, null, () => {})();
  back({ name: 'hollow', opts: gone[0][1] }, 'counts');
  assert.deepEqual(gone[1], ['hollow', { from: 'book', vol: 1, back: true, stories: L }], '‹: the shelf, the volume kept');
  back({ name: 'hollow', opts: gone[1][1] }, null);
  assert.deepEqual(gone[2], ['book', { back: true, vol: 1 }], '‹ again: First Moon');
  // from camp, as before: the shelf and its ‹ go back to camp
  gone.length = 0;
  back({ name: 'hollow', opts: { from: 'hub', back: true } }, 'counts');
  back({ name: 'hollow', opts: gone[0][1] }, null);
  assert.deepEqual(gone.map((g) => g[0]), ['hollow', 'hub']);
});

test('the second volume\'s title: her warrior name, which may break at its join (richN), smaller when long, as the first volume\'s is', () => {
  const list = two();
  const short = page(catAt(12, list), list).bookTitleTwo('Fernheart’s First Frost-Time');
  assert.equal(short, '<h1><span class="wn">Fern<wbr>heart’s</span> First <span class="nw">Frost-Time</span></h1>', 'Frost-Time kept whole');
  const long = catAt(12, list, { name: 'Thunderwhisker', ending: 'butterscotch' });
  assert.equal(page(long, list).bookTitleTwo(E.books(long, list)[1].title), '<h1 class="long longer"><span class="wn">Thunderwhisker<wbr>butterscotch’s</span> First <span class="nw">Frost-Time</span></h1>');
  assert.match(page(catAt(12, list, { name: 'Moonsilver', ending: 'heart' }), list).bookTitleTwo('x'), /^<h1 class="long">/);
  assert.match(bookCss(), /\n\.book h1\.longer\{font-size:clamp\(24px, 4vw, 44px\)\}\n\.book h1 \.nw\{white-space:nowrap\}\n/);
});

/* ------------------------------------------------------------------ the store under a page */

test('the store under a chapter\'s page: the kit\'s place-value picture (small) as the chapter left it, 133 as one square, three rows and three loose; "In the store:" in Comic Neue and 133 in Andika; Read to me says it in words', () => {
  const list = two(), P = page(catAt(12, list), list);
  const h = P.storePic(133);
  const svg = PC.art.placeValue({ hundreds: 1, tens: 3, ones: 3, kind: 'store', small: true });
  assert.equal(h, '<figure class="storepic"><div class="sp-pic" aria-hidden="true">' + svg + '</div>' +
    '<figcaption><span class="sp-words">In the store:</span> <span class="sp-num">133</span></figcaption></figure>');
  assert.equal(count(svg, /class="pc-pv-square[" ]/g), 1);
  assert.equal(count(svg, /class="pc-pv-row[" ]/g), 3);
  assert.equal(count(svg, /class="pc-pv-loose[" ]/g), 3);
  assert.equal(count(svg, /pc-pv-(taken|fresh|moving|tray)/g), 0, 'nothing taken, nothing spread: the store as it stands');
  [[999, 9, 9, 9], [40, 0, 4, 0], [7, 0, 0, 7]].forEach(([n, sq, rw, lo]) => {
    const s = P.storePic(n);
    assert.equal([count(s, /class="pc-pv-square[" ]/g), count(s, /class="pc-pv-row[" ]/g), count(s, /class="pc-pv-loose[" ]/g)].join(), [sq, rw, lo].join(), String(n));
  });
  assert.equal(P.storePic(0), '<figure class="storepic"><figcaption><span class="sp-words">In the store:</span> <span class="sp-num">0</span></figcaption></figure>', 'an empty store: the words alone');
  assert.equal(P.storeSays(133), 'In the store: one hundred thirty-three.');
  // the two fonts: the words in the book's Comic Neue, the number in Andika (--digits), as everywhere
  const css = bookCss();
  assert.match(css, /\n\.book \.storepic figcaption\{font-family:var\(--comic\);/);
  assert.match(css, /\n\.book \.storepic \.sp-num\{font-family:var\(--digits\);/);
  assert.match(HTML, /--comic:"Comic Neue",/);
  assert.match(HTML, /--digits:"Andika",/);
  // without the art, the kit's own stand-in (the take page's)
  const bare = new Function('PC', 'E', 'cat', 'root', 'stories', ['NUMW', 'MARK'].map(varSrc).join('\n') + FNS.map(fnSrc).join('') + '\nreturn storePic;')({}, E, null, globalThis, () => list);
  assert.match(bare(133), /<text x="270" y="440"[^>]*>1<\/text><text x="800"[^>]*>3<\/text><text x="1330"[^>]*>3<\/text>/);
});

/* ------------------------------------------------------------------ the sleepers, the badger page, the keepsake */

test('the winter sleepers, as the dragonets\' pages (their classes): her picture and room for her own drawing ("Draw the groundhog here"), six silhouettes, "Six more, still sleeping."; every silhouette the plain shape', () => {
  const list = two(), cat = catAt(13, list), P = page(cat, list);
  assert.equal(P.sleeperPages(null), '');
  const sp = E.buildFullBook(cat, list, 2).sleepers;
  const h = P.sleeperPages(sp);
  assert.match(h, /^<section class="bookpage dragonets sleepers" id="book-sleepers"><h2 class="chap">The winter sleepers<\/h2><div class="dragonet sleeper"><div class="dn-pic" aria-hidden="true"><svg/);
  assert.ok(h.includes('<div class="dn-text"><h3>The groundhog</h3><p>Round, brown and grumpy: “I was ASLEEP.”</p><div class="dn-draw" aria-hidden="true">Draw the groundhog here</div></div></div>'));
  assert.equal(count(h, /<div class="dragonet sil sleeper">/g), 6);
  assert.ok(h.endsWith('</div><p class="dn-more">Six more, still sleeping.</p></section>'));
  const sil = P.sleeperArt(null, true, 0);
  // (chapter 13 brings the groundhog's art: its found page draws it; a silhouette is always called with null, so it stays plain)
  assert.notEqual(P.sleeperArt('groundhog', false, 0), P.sleeperArt(null, false, 0), 'the found page draws the real groundhog, not the plain shape');
  assert.ok(P.sleeperArt('groundhog', false, 0).includes('class="pc-groundhog"'));
  assert.ok(!sil.includes('pc-groundhog') && !h.slice(h.indexOf('<div class="dn-find"')).includes('pc-groundhog'), 'the silhouettes, called with null, stay the plain shape');
  assert.ok(!sil.includes('#a08a6e') && sil.includes('#1b1622'));
  assert.notEqual(P.sleeperArt(null, true, 1), sil, 'every other one facing the other way');
  assert.deepEqual(P.bookTwoSays({ sleepers: sp }).map((x) => x.text), ['The winter sleepers.', 'The groundhog.', 'Round, brown and grumpy: “I was ASLEEP.”', 'Six more, still sleeping.']);
});

test('the groundhog’s sleeper page (chapter 13): drawn by PC.art.character in its `sleep` pose (curled round, eyes shut, a little smile), facing right, or in the page’s own `pose`; an unknown id the plain shape', () => {
  const list = two(), cat = catAt(13, list), P = page(cat, list);
  const art = PC.art.character('groundhog', { pose: 'sleep', mood: 'neutral', facing: 'right' });
  const want = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + art.w + ' ' + art.h + '" preserveAspectRatio="xMidYMid meet">';
  const strip = (x) => x.replace(/pcs?[0-9a-z]+-/g, '');
  const found = P.sleeperArt('groundhog', false, 0);
  assert.ok(found.startsWith(want), 'its own box');
  assert.equal(strip(found), strip(want + art.svg + '</svg>'), 'the groundhog asleep, as cats.js draws it');
  assert.ok(found.includes('data-pose="sleep"'));
  assert.equal(strip(P.sleeperArt('groundhog', false, 0, 'doze')), strip(want + PC.art.character('groundhog', { pose: 'doze', mood: 'neutral', facing: 'right' }).svg + '</svg>'), 'the page’s own pose');
  // on the found page itself (book.sleeper with no pose: its default, `sleep`)
  const h = P.sleeperPages(E.buildFullBook(cat, list, 2).sleepers);
  const pic = h.slice(h.indexOf('<div class="dn-pic" aria-hidden="true">'), h.indexOf('<div class="dn-text">'));
  assert.ok(pic.includes('class="pc-groundhog" data-pose="sleep"'), 'its page draws it asleep');
  assert.equal(P.sleeperArt('nobody', false, 0), P.sleeperArt(null, false, 0), 'an id the art does not know: the plain shape');
});

test('the badger page: "What is a badger LIKE?", They say (an ear) and I saw (an eye), the Case File\'s marks; a crossed rumour struck through; Read to me says each rumour, "Crossed out:" before a crossed one, then the sighting', () => {
  const list = two(), cat = catAt(13, list), P = page(cat, list);
  assert.equal(P.badgerPage(null), '');
  let bg = E.badgerPage(cat, list);
  let h = P.badgerPage(bg);
  const ear = '<i class="bg-mark" aria-hidden="true">' + PC.art.cardMark('ear') + '</i>', eye = '<i class="bg-mark" aria-hidden="true">' + PC.art.cardMark('eye') + '</i>';
  assert.ok(h.startsWith('<section class="bookpage badger" id="book-badger"><h2 class="chap">What is a badger LIKE?</h2><div class="bg-heads" aria-hidden="true"><span class="bg-h">' + ear + 'They say</span><span class="bg-h">' + eye + 'I saw</span></div>'));
  assert.ok(h.includes('<div class="bg-row"><ul class="bg-say" aria-label="They say"><li>' + ear + '<span class="bg-line">A badger SAT on my whole patrol! <span class="bg-who">the old tom</span></span></li></ul><ul class="bg-saw" aria-label="I saw"></ul></div>'));
  assert.equal(count(h, /<s>/g), 0);
  cat.finished.ch17 = true;
  bg = E.badgerPage(cat, list);
  h = P.badgerPage(bg);
  assert.ok(h.includes('<div class="bg-row crossed"><ul class="bg-say" aria-label="They say"><li>' + ear + '<span class="bg-line"><span class="sr">crossed out: </span><s>As big as a FOX!</s> <span class="bg-who">the ferry otters</span></span></li></ul>' +
    '<ul class="bg-saw" aria-label="I saw"><li>' + eye + '<span class="bg-line">As big as three cats. And grumpy.</span></li></ul></div>'));
  assert.deepEqual(P.bookTwoSays({ badger: bg }).map((x) => x.text), ['What is a badger LIKE?', 'The old tom said, A badger SAT on my whole patrol!',
    'Crossed out: the ferry otters said, As big as a FOX!', 'I saw: As big as three cats. And grumpy.']);
  // two columns; under 520px wide a row's sighting goes under its rumours, the heads side by side as a key
  const css = bookCss();
  assert.match(css, /\n\.book \.badger \.bg-heads,\.book \.badger \.bg-row\{display:grid;grid-template-columns:1fr 1fr;/);
  assert.match(css, /\n@media \(max-width: 520px\)\{\n {2}\.book \.badger \.bg-row\{grid-template-columns:1fr\}\n/);
  assert.match(css, /\n\.book \.badger s\{text-decoration-line:line-through;/);
  assert.match(HTML, /\n\.sr\{position:absolute!important;/, 'the screen reader\'s "crossed out:" hidden on the page');
});

test('the keepsake closes the volume, drawn as a nest treasure is (treasureSvg), its name and lines under it', () => {
  const list = two(), cat = catAt(21, list), P = page(cat, list);
  const k = E.buildFullBook(cat, list, 2).keepsake;
  assert.equal(P.keepsakePage(null), '');
  assert.equal(P.keepsakePage(k), '<section class="bookpage keepsake" id="book-keepsake"><div class="ks-pic" aria-hidden="true">' + P.treasureSvg('stone-tooth') + '</div>' +
    '<h2 class="chap">The stone tooth</h2><p>Older than the river.</p></section>');
  assert.deepEqual(P.bookTwoSays({ keepsake: k }).map((x) => x.text), ['The stone tooth.', 'Older than the river.']);
});

/* ------------------------------------------------------------------ the CSS and the print rules */

function bookCss() {
  const i = HTML.indexOf('/* ---------- book two ('), end = HTML.indexOf('</style>');
  assert.ok(i > HTML.indexOf('/* ---------- the take-aways kit: the take page') && end > i, 'book two\'s block after the take block, before </style>');
  return HTML.slice(i, end);
}

test('the CSS is book two\'s own block: every rule under .book and a class only book two draws (a module 1 book draws none of them), after the take block', () => {
  const css = bookCss();
  const sels = [];
  css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{/g, '').split('}').forEach((r) => {
    const sel = r.split('{')[0].trim();
    if (sel) sel.split(',').forEach((s) => sels.push(s.trim()));
  });
  assert.ok(sels.length > 20);
  sels.forEach((s) => assert.match(s, /^\.book (\.vols|h1\.longer|h1 \.nw|\.storepic|\.badger|\.bookpage\.badger|\.keepsake)\b/, s));
  // none of its classes is in v23's markup of the book (renderBook's first volume, dragonetPages)
  const v1 = fnSrc('dragonetPages') + fnSrc('dragonetArt');
  ['vols', 'longer', '"nw"', 'storepic', 'badger', 'keepsake', 'bg-', 'sp-', 'ks-'].forEach((c) => assert.ok(!v1.includes(c), c));
  assert.ok(!/class="[^"]*\b(vols|storepic|badger|keepsake)\b/.test(fnSrc('renderHub') + fnSrc('renderNest')));
});

test('the print rules, pinned as text: a chapter a page as v23 prints the first volume (the same rules print the second), the store picture and the marks in colour and the store at most 45mm tall, the badger page in two columns, running on between rows; the volume buttons never printed', () => {
  const css = bookCss();
  const pr = css.slice(css.indexOf('@media print{'));
  assert.equal(pr, '@media print{\n' +
    '  .book .storepic,.book .keepsake .ks-pic,.book .badger .bg-mark{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n' +
    '  .book .storepic .sp-pic svg{max-height:45mm}\n' +
    '  .book .badger .bg-heads,.book .badger .bg-row{grid-template-columns:1fr 1fr}\n' +
    '  /* the badger page may run on to a second sheet, between two of its rows */\n' +
    '  .book .bookpage.badger{break-inside:auto}\n' +
    '  .book .badger .bg-row{break-inside:avoid}\n' +
    '}\n');
  // v23's: every page after the first on a sheet of its own, and the sleepers (class dragonets) running on between pages
  assert.match(HTML, /@media print\{[\s\S]*\.book \.bookpage \+ \.bookpage\{break-before:page;border-top:0;margin-top:0;padding-top:0\}/);
  assert.match(HTML, /@media print\{[\s\S]*\.book \.bookpage\.dragonets\{break-inside:auto\}\n\s*\.book \.dragonet\{break-inside:avoid\}/);
  // each of book two's pages is a .bookpage: a chapter, the sleepers, the badger page and the keepsake each start a sheet
  const list = two(), cat = catAt(21, list), P = page(cat, list), b = E.buildFullBook(cat, list, 2);
  [P.sleeperPages(b.sleepers), P.badgerPage(b.badger), P.keepsakePage(b.keepsake)].forEach((h) => assert.match(h, /^<section class="bookpage /));
  assert.match(P.bookVolButtons(E.books(cat, list), 2), /^<div class="vols no-print"/);
});

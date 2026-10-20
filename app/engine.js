/* Potomac Crossing: the engine.
 *
 * Pure logic, no DOM. Loads in Node (module.exports = PC) and in the browser (window.PC.engine).
 * The UI owns drawing; the engine owns state: the cats on this device, tokens, the chapters and
 * the flow through each one's frames (her place in each chapter kept apart), input cleaning, lines that show only `when` they match, the
 * Counts lesson runner, the skip-count, gifts, the book, the Training Hollow (one claw mark per
 * Count), and saving to localStorage under one key, 'potomac-crossing.v1' (save version 2 since
 * chapter 2; E.migrate brings a version-1 save forward without losing anything). Chapter 3 adds
 * frames shown only `when` they match, the words the page says around a question (E.promptLines,
 * E.helpPlan: who counts, on which ground), borrowed questions in the borrower's voice, the adaptive
 * warm-up's ordered alt and `avoid`, reading time in E.hardFacts, and the book's dragonet pages
 * (docs/build.md, "Chapter 3 (v0.4)"). Chapter 4 adds her Case File (a chapter's `cards`, a frame's
 * `card`, the save's `cards`, E.cards, E.caseFile), two kinds of page (`scratch`: the bark Taps and
 * the glitter Tap; `file`: her Case File opened the first time), flags set by reaching a frame and
 * never unset (a frame's `sets`), an option's label that depends on her (`labelWhen`), a dragonet's
 * page shown `when` she has found it, the 10s (the zero rule, swipes in pairs, a row at a time, the
 * roof's grit), the skip-counts on both forepaws and on the pile of six, and the pictures and words
 * the page is given (E.lessonPicture, E.sandOpts, E.skipPicture, E.skipWords, E.hollowLines), so Node
 * can test them (docs/build.md, "Chapter 4 (v0.4)"). Chapter 5 adds the 9s (one claw tucked: the hop
 * and the tuck as a question is asked, `light: 'tuck'`; a help in two phases; four openings for the
 * four likeliest slips; two answers scratched in the sand, `shows`), sets that are not Tallyheart's
 * (a silent one lettered in captions, `teacher: 'caption'`; a help that lights the set's own picture,
 * `help: 'picture'`; borrowed questions drawn as the borrower's, `fillPicture`; the raft's log for a
 * ground), a lesson that fills its own gaps with the easiest of her right answers, a warm-up whose
 * hard pick has an `avoid` list of its own, a Counts frame that says none of its lines again
 * (`intro: false`), the skip-count's new forms (the tuck, her four paws aboard, nine claws in a log
 * with the scene redrawn as she taps, a forepaw in the mud for everyone found, the bedtime nines), a
 * page of questions she taps out of an otter (`ask`), cards that name the cards they touch
 * (`link.with`) and so lie three in a row, and a dragonet's own pose in her book (docs/build.md,
 * "Chapter 5 (v0.4)").
 *
 * Functions that change a cat change the object they are given (and return it or a result).
 * Nothing here reads the clock on its own: callers pass `now` (ms since epoch) where it matters,
 * so the tests are deterministic. Where a function needs the chapters, it takes them as its last
 * argument (one story, a list, or a map like PC.story); without it, it uses PC.story.
 */
(function (root) {
  'use strict';
  var PC = root.PC || (root.PC = {});
  var E = {};

  E.VERSION = '0.7.0 (chapter 7, 2026-10-20)';
  E.STORAGE_KEY = 'potomac-crossing.v1';   // the key stays: renaming it would strand every save
  E.SAVE_VERSION = 2;
  E.MAX_CATS = 4;
  E.FAST_MS = 4000;          // an answer under this earns a "didn't even have to count" line
  E.REQUEUE_GAP = 2;         // a missed fact comes back two questions later
  E.MAX_REQUEUE = 2;         // ...at most twice per fact per lesson
  E.HISTORY_CAP = 500;
  E.LOG_CAP = 2000;          // counts answers kept per cat
  E.CLAN_MAX = 14;
  E.PET_MAX = 24;
  E.DREAM_MAX = 200;
  E.GLOW_ROUNDS = 3;         // Training Hollow rounds of one Count without help before its claw mark glows
  E.MAX_MARKS = 10;          // claw marks on the tree: one per Count, the 1s to the 10s (every table to 10 × 10)
  E.DRAGONETS = 7;           // the clutch: a page in her book for each, a silhouette until she finds it

  /* ------------------------------------------------------------ helpers */
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function isObj(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function own(o, k) { return o != null && Object.prototype.hasOwnProperty.call(o, k); }
  function median(a) {
    if (!a.length) return null;
    var s = a.slice().sort(function (x, y) { return x - y; }), h = s.length >> 1;
    return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
  }
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(list, i) {
    if (!list) return '';
    if (typeof list === 'string') return list;
    if (!list.length) return '';
    return list[((i % list.length) + list.length) % list.length];
  }
  function asList(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  E.util = { clone: clone, median: median, rng: mulberry32 };

  /* ------------------------------------------------------------ looks
   * The ids the engine stores; they match PC.art.vocab.looks (app/art/cats.js), which draws them. Labels and swatches are
   * for the reflection chooser; PC.art may publish its own list, which the UI prefers. */
  E.LOOKS = {
    sex: [
      { id: 'she', label: 'She-cat' },
      { id: 'tom', label: 'Tom' }
    ],
    fur: [
      { id: 'black', label: 'Midnight black', swatch: ['#3d3844', '#5b5465'] },
      { id: 'white', label: 'Snow white', swatch: ['#fbf8f2', '#e3dbcd'] },
      { id: 'silver-tabby', label: 'Silver tabby', swatch: ['#c3cbd4', '#6c7886'], stripes: true },
      { id: 'brown-tabby', label: 'Brown tabby', swatch: ['#b5895b', '#5b3f27'], stripes: true },
      { id: 'ginger', label: 'Ginger', swatch: ['#e8913a', '#b5602a'], stripes: true },
      { id: 'cream', label: 'Cream', swatch: ['#f2dbb1', '#d8b47f'], stripes: true },
      { id: 'grey', label: 'Grey', swatch: ['#9ea5ad', '#7d848c'] },
      // a soft hyphen: a narrow swatch breaks the word as Tortoise-shell
      { id: 'tortie', label: 'Tortoise­shell', swatch: ['#3f3330', '#da853b', '#ecb877'], patches: true },
      { id: 'calico', label: 'Calico', swatch: ['#fbf8f2', '#e3893a', '#3d3844'], patches: true }
    ],
    marking: [
      { id: 'none', label: 'No marking' },
      { id: 'white-paws', label: 'White paws' },
      { id: 'white-chest', label: 'A white chest' },
      { id: 'back-stripe', label: 'A dark stripe down your back' },
      { id: 'nose-splash', label: 'A splash of white on your nose' }
    ],
    eyes: [
      { id: 'green', label: 'Green', swatch: ['#8fca66'] },
      { id: 'amber', label: 'Amber', swatch: ['#f4aa2b'] },
      { id: 'blue', label: 'Blue', swatch: ['#79b9ee'] },
      { id: 'copper', label: 'Copper', swatch: ['#e27a32'] },
      { id: 'odd', label: 'One blue, one green', swatch: ['#79b9ee', '#8fca66'] }
    ]
  };
  E.LOOK_KEYS = ['sex', 'fur', 'marking', 'eyes'];
  var DEFAULT_FURS = ['brown-tabby', 'ginger', 'silver-tabby', 'grey'];
  E.defaultLook = function (i) {
    i = i || 0;
    return { sex: 'she', fur: DEFAULT_FURS[((i % 4) + 4) % 4], marking: 'none', eyes: 'green' };
  };
  /* Merge a partial look into a cat's look. Unknown keys are ignored; values are kept as given
   * (the art may know more than the engine's list), but must be short strings. */
  E.setLook = function (cat, partial) {
    if (!cat.look) cat.look = E.defaultLook(0);
    if (!isObj(partial)) return cat.look;
    E.LOOK_KEYS.forEach(function (k) {
      var v = partial[k];
      if (typeof v === 'string' && v.length && v.length <= 32) cat.look[k] = v;
    });
    return cat.look;
  };

  /* ------------------------------------------------------------ tokens */
  E.pronouns = function (sex) {
    var tom = sex === 'tom';
    return {
      they: tom ? 'he' : 'she', them: tom ? 'him' : 'her', their: tom ? 'his' : 'her',
      shecat: tom ? 'tom' : 'she-cat'
    };
  };
  function cap1(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  E.tokens = function (cat) {
    cat = cat || {};
    var look = cat.look || {};
    var p = E.pronouns(look.sex);
    var name = cat.name || '';
    var pet = cat.petname || '';
    if (!name) name = pet || 'Pillow';
    if (!pet) pet = 'Pillow Cat';
    // the tortoiseshell denmate (chapter 3): Murmurpaw, then Murmurchime; Mutterpaw and Mutterchime
    // for a player whose own Clan name is Murmur ("{murmur}ing", "{murmur}ed" read right either way)
    var murmur = E.tortieWord(cat);
    var t = {
      name: name, petname: pet, dream: E.dreamOf(cat, cat.chapter),
      they: p.they, them: p.them, their: p.their, shecat: p.shecat,
      They: cap1(p.they), Them: cap1(p.them), Their: cap1(p.their), Shecat: cap1(p.shecat),
      THEY: p.they.toUpperCase(), THEM: p.them.toUpperCase(), THEIR: p.their.toUpperCase(),
      SHECAT: p.shecat.toUpperCase(), NAME: name.toUpperCase(), PETNAME: pet.toUpperCase(),
      Murmur: cap1(murmur), murmur: murmur, MURMUR: murmur.toUpperCase()
    };
    return t;
  };
  /* "murmur", or "mutter" when her own Clan name is Murmur, so the tortie never shares her name. */
  E.tortieWord = function (cat) {
    return cat && typeof cat.name === 'string' && cat.name.toLowerCase() === 'murmur' ? 'mutter' : 'murmur';
  };
  /* Fill {tokens} from a cat. Unknown tokens stay as written, so a typo shows up instead of
   * vanishing. `extra` adds tokens (the Counts runner uses {a} {b} {groups} ...). */
  E.fill = function (text, cat, extra) {
    if (text == null) return '';
    var t = E.tokens(cat);
    return String(text).replace(/\{([A-Za-z]+)\}/g, function (m, k) {
      if (extra && own(extra, k)) return String(extra[k]);
      return own(t, k) ? t[k] : m;
    });
  };
  /* Only a question's own tokens ({a} {b} {answer}); the cat's are filled later, by the UI. */
  function fillFact(text, q) {
    return String(text == null ? '' : text).replace(/\{(a|b|answer)\}/g, function (m, k) {
      return String(k === 'answer' ? q.a * q.b : q[k]);
    });
  }

  /* ------------------------------------------------------------ input cleaning */
  var LETTER = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/;
  function keepNameChars(raw) {
    var s = String(raw == null ? '' : raw).replace(/[‘’ʼ]/g, "'").replace(/[‐-—]/g, '-');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (LETTER.test(c) || c === "'" || c === '-') out += c;
      else if (/\s/.test(c)) out += ' ';
    }
    return out.replace(/\s+/g, ' ').replace(/^[\s'-]+|[\s'-]+$/g, '');
  }
  function titleCase(s) {
    return s.toLowerCase().replace(/(^|[\s-])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
  }
  function niceCase(s) {
    if (!s) return s;
    var first = s.charAt(0), rest = s.slice(1);
    // ALL CAPS (caps lock) reads like shouting on every screen, and stray capitals ("pAw",
    // "mOON") are slips: both become Title case. "McFluff" and "Sir Pounce-a-lot" stay as typed.
    var allCaps = s.length > 1 && s === s.toUpperCase() && s !== s.toLowerCase();
    var stray = first === first.toLowerCase() && rest !== rest.toLowerCase();
    if (allCaps || stray) return titleCase(s);
    return first.toUpperCase() + rest;
  }
  /* Shorten a name to max characters, at a word boundary when the cut would split a later word
   * ("Shimmering River" -> "Shimmering", not "Shimmering Riv"); one long word is simply cut. A
   * clipped name never ends on a small word: "the destroyer of socks and…" never stops at "and". */
  var SMALL_WORDS = /[\s-]+(a|an|and|of|the)$/i;
  function clip(s, max) {
    if (s.length <= max) return s;
    var cut = s.slice(0, max);
    if (LETTER.test(s.charAt(max))) {
      var b = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('-'));
      if (b > 0) cut = cut.slice(0, b);
    }
    cut = cut.replace(/[\s'-]+$/, '');
    while (SMALL_WORDS.test(cut)) cut = cut.replace(SMALL_WORDS, '').replace(/[\s'-]+$/, '');
    return cut;
  }
  E.hasLetter = function (raw) { return LETTER.test(String(raw == null ? '' : raw)); };
  /* The first part of a Clan name. Letters, space, hyphen, apostrophe; at most 14 characters;
   * a trailing "paw" in any case is dropped (Moonpaw -> Moon, never Moonpawpaw) unless nothing
   * would be left (a cat called "Paw" becomes Pawpaw); first letter capitalised; never empty. */
  E.cleanClanName = function (raw, fallback) {
    var s = keepNameChars(raw);
    for (var guard = 0; guard < 4; guard++) {
      var m = /^(.*?)[\s'-]*paw$/i.exec(s);
      if (!m) break;
      var rest = m[1].replace(/[\s'-]+$/, '');
      if (!rest || !LETTER.test(rest)) break;
      s = rest;
    }
    s = clip(s, E.CLAN_MAX);
    s = niceCase(s);
    if (!s || !LETTER.test(s)) s = fallback ? E.cleanClanName(fallback) : 'Moon';
    return s;
  };
  E.cleanPetName = function (raw, fallback) {
    var s = keepNameChars(raw);
    s = clip(s, E.PET_MAX);
    // A name typed all in small letters gets a capital on every word, the way pet names are
    // written ("princess sparkle muffin" -> "Princess Sparkle Muffin"); anything else as niceCase.
    if (s && s === s.toLowerCase()) {
      var small = /^(a|an|and|at|for|in|of|on|the|to)$/;
      s = s.split(' ').map(function (w, i) {
        return (i > 0 && small.test(w)) || !w ? w : w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');
    }
    else s = niceCase(s);
    if (!s || !LETTER.test(s)) s = fallback ? E.cleanPetName(fallback) : 'Muffin';
    return s;
  };
  /* The dream line: optional, at most 200 characters, whitespace tidied. Empty means skipped. */
  E.cleanDream = function (raw) {
    var s = String(raw == null ? '' : raw).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
    if (s.length > E.DREAM_MAX) s = s.slice(0, E.DREAM_MAX).trim();
    return s;
  };
  E.clanName = function (cat) { return cat && cat.name ? cat.name + 'paw' : ''; };
  E.displayName = function (cat) {
    if (!cat) return '';
    if (cat.name) return cat.name + 'paw';
    if (cat.petname) return cat.petname;
    return 'New cat';
  };

  /* ------------------------------------------------------------ chapters
   * Each chapter is one story file (app/story/chNN.js) defining PC.story.chNN. They are read in
   * the order of their `number`; chapter n+1 opens once chapter n is finished. */
  function storyList(x) {
    if (x && x.frames) return [x];
    if (Array.isArray(x)) return x.filter(function (s) { return s && s.frames; });
    var src = x || PC.story || {};
    return Object.keys(src).map(function (k) { return src[k]; }).filter(function (s) { return s && s.frames; });
  }
  E.chapters = function (stories) {
    return storyList(stories).map(function (s, i) { return { s: s, i: i }; }).sort(function (x, y) {
      return num(x.s.number, 0) - num(y.s.number, 0) || x.i - y.i;
    }).map(function (x) { return x.s; });
  };
  E.chapter = function (id, stories) {
    var list = storyList(stories);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };
  E.firstChapter = function (stories) { return E.chapters(stories)[0] || null; };
  /* The chapter after this one, if it is built. */
  E.nextChapter = function (story, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) if (list[i].id === story.id) return list[i + 1] || null;
    return null;
  };
  E.chapterHeading = function (story) { return 'Chapter ' + (story.number || 1) + ': ' + (story.title || ''); };
  E.isFinished = function (cat, id) { return !!(cat && isObj(cat.finished) && cat.finished[id]); };
  E.hasFinished = function (cat) {
    return !!(cat && isObj(cat.finished) && Object.keys(cat.finished).some(function (k) { return cat.finished[k]; }));
  };
  /* A chapter is open when it is the first, when the one before it is finished, or when it was
   * finished itself (read again). */
  E.isOpen = function (cat, story, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id !== story.id) continue;
      return i === 0 || E.isFinished(cat, list[i - 1].id) || E.isFinished(cat, story.id);
    }
    return false;
  };
  /* The chapter a cat reads next: the first, in order, that she has not finished, while it is
   * open. Null when every built chapter is finished. */
  E.upNext = function (cat, stories) {
    var list = E.chapters(stories);
    for (var i = 0; i < list.length; i++) {
      if (E.isFinished(cat, list[i].id)) continue;
      return E.isOpen(cat, list[i], list) ? list[i] : null;
    }
    return null;
  };
  /* The "coming soon" after a chapter: its teaser, filled, with `built` true when the next
   * chapter exists after all (then the hub offers that chapter instead). */
  E.teaser = function (story, cat, stories) {
    if (!story) return null;
    var next = E.nextChapter(story, stories);
    var t = isObj(story.teaser) ? story.teaser : null;
    if (!t && !next) return null;
    return {
      title: E.fill(t && t.title ? t.title : E.chapterHeading(next), cat),
      lines: asList(t && t.lines).map(function (l) { return E.fill(l, cat); }),
      built: !!next, next: next ? next.id : null
    };
  };
  /* Where a cat is in the chapters: the hub's buttons, the cards on "Who's playing?", the title. */
  E.progress = function (cat, stories) {
    var list = E.chapters(stories);
    var finished = list.filter(function (s) { return E.isFinished(cat, s.id); });
    var reading = cat && E.chapter(cat.chapter, list);
    var atEnd = !!(reading && E.kindOf(E.currentFrame(cat, reading)) === 'end');
    var next = E.upNext(cat, list);
    var latest = finished.length ? finished[finished.length - 1] : null;
    var teaser = latest ? E.teaser(latest, cat, list) : null;
    // her place in the next chapter: the one she is reading, or one parked while she reads another
    var np = next ? E.place(cat, next.id) : null;
    return {
      chapters: list, finished: finished, latest: latest, reading: reading, atEnd: atEnd,
      page: reading ? (cat.history || []).length + 1 : 0,
      next: next,
      // she is partway through the next chapter: its button resumes, it doesn't start over
      nextInProgress: !!(np && (np.history.length || np.frame !== next.start || np.lesson)),
      nextPage: np ? np.history.length + 1 : 0,
      soon: !next && teaser && !teaser.built ? teaser : null
    };
  };
  /* "Chapter 2 · page 7", "Chapter 2 finished", or "Just starting". */
  E.status = function (cat, stories) {
    if (!cat) return '';
    var p = E.progress(cat, stories);
    if (!p.reading) return p.latest ? 'Chapter ' + (p.latest.number || 1) + ' finished' : 'Just starting';
    var n = p.reading.number || 1;
    if (p.atEnd && E.isFinished(cat, p.reading.id)) return 'Chapter ' + n + ' finished';
    if (!(cat.history && cat.history.length) && !p.finished.length) return 'Just starting';
    return 'Chapter ' + n + ' · page ' + p.page;
  };

  /* ------------------------------------------------------------ saves and cats
   * Save version 2 (the stored object carries `version: 2`). Per cat: `chapter`, `frame` and
   * `history` are the chapter being read, its frame and that chapter's back-history, and `lesson`
   * a lesson in progress (that chapter's, or a Training Hollow round), and `hollowWaiting` a Hollow
   * round in progress that gave way to a chapter lesson (E.hollowRound); `places` keeps every other
   * chapter she is partway through, by chapter id: { frame, history, lesson } (see "places" below);
   * `finished` maps a chapter id to when its end frame was first reached; `dreams` maps a chapter
   * id to her dream as typed; `flags` and `choices` are one object for all chapters (a choice is
   * keyed "chapter:frame"); `lessons` holds finished lessons by set id; `hollow` counts every round
   * and keeps each Count's rounds and glow in `byTable`; `nest` holds treasure and gift ids; `cards`
   * (chapter 4 on: a new optional field, the save stays version 2) holds her Case File's cards in
   * the order found, { id, chapter, at } each. */
  E.newSave = function () {
    return { version: E.SAVE_VERSION, cats: [], current: null, settings: { readAloud: false, bigText: false } };
  };
  var idSeq = 0;
  function newId(now) {
    idSeq = (idSeq + 1) % 1000;
    return 'c' + Math.floor(now || 0).toString(36) + idSeq.toString(36) + Math.floor(Math.random() * 1296).toString(36);
  }
  function blankHollow() { return { rounds: 0, byTable: {} }; }
  function blankTable() { return { rounds: 0, cleanRounds: 0, glow: false }; }
  E.blankCat = function (opts) {
    opts = opts || {};
    var now = opts.now || 0;
    return {
      id: opts.id || newId(now),
      created: now, updated: now,
      look: opts.look ? clone(opts.look) : E.defaultLook(opts.index || 0),
      petname: '', name: '',
      flags: {}, choices: {},
      chapter: null, frame: null, history: [],
      places: {},            // chapter id -> { frame, history, lesson }: her place in a chapter she isn't reading now
      finished: {},          // chapter id -> when its end frame was first reached
      dreams: {},            // chapter id -> her dream, as typed ('' = skipped)
      counts: [],            // every Counts answer: {set, a, b, answer, correct, ms, helped, retry, at}
      lessons: {},           // finished lessons by set id: summary
      lesson: null,          // a lesson in progress: { mode, frame, state }
      hollowWaiting: null,   // a Training Hollow round in progress that gave way to a chapter lesson: { mode: 'hollow', state }
      nest: [],              // treasure and gift ids, in the order found
      cards: [],             // her Case File: { id, chapter, at } for each card, in the order found
      hollow: blankHollow()  // { rounds, byTable: { '1': { rounds, cleanRounds, glow } } }
    };
  };
  /* Add a cat to the device. Returns the cat, or null when four cats already live here. */
  E.addCat = function (save, opts) {
    if (save.cats.length >= E.MAX_CATS) return null;
    opts = opts || {};
    var cat = E.blankCat({ now: opts.now, index: save.cats.length, look: opts.look });
    while (E.getCat(save, cat.id)) cat.id = newId(opts.now) + 'x';
    save.cats.push(cat);
    save.current = cat.id;
    return cat;
  };
  E.getCat = function (save, id) {
    if (!save || !save.cats) return null;
    for (var i = 0; i < save.cats.length; i++) if (save.cats[i].id === id) return save.cats[i];
    return null;
  };
  E.currentCat = function (save) { return E.getCat(save, save && save.current); };
  E.removeCat = function (save, id) {
    var n = save.cats.length;
    save.cats = save.cats.filter(function (c) { return c.id !== id; });
    if (save.current === id) save.current = null;
    return save.cats.length < n;
  };
  /* Start a cat over: same slot, same id, everything else new. */
  E.resetCat = function (save, id, now) {
    for (var i = 0; i < save.cats.length; i++) {
      if (save.cats[i].id === id) {
        var fresh = E.blankCat({ id: id, now: now, index: i });
        save.cats[i] = fresh;
        return fresh;
      }
    }
    return null;
  };

  /* A version-1 cat (chapter 1 only) in the version-2 shape. Nothing is lost: `done`/`doneAt`
   * become finished.ch01, `dream` becomes dreams.ch01 ('' when a finished chapter 1 skipped it),
   * the one Hollow record becomes the 1s', and
   * a choice keyed by its frame id ("f031") is keyed "ch01:f031". */
  function isV1Cat(c) {
    if (isObj(c.finished) || isObj(c.dreams)) return false;
    return !(isObj(c.hollow) && isObj(c.hollow.byTable));
  }
  function fromV1(c) {
    var out = {};
    Object.keys(c).forEach(function (k) {
      if (k !== 'done' && k !== 'doneAt' && k !== 'dream' && k !== 'hollow' && k !== 'choices') out[k] = c[k];
    });
    out.finished = {};
    if (c.done === true) out.finished.ch01 = (typeof c.doneAt === 'number' && c.doneAt) || 1;
    out.dreams = {};
    // a finished chapter 1 went past the dream frame: an empty dream there was skipped
    if (typeof c.dream === 'string' && (c.dream || out.finished.ch01)) out.dreams.ch01 = c.dream;
    var h = isObj(c.hollow) ? c.hollow : {};
    out.hollow = {
      rounds: num(h.rounds, 0),
      byTable: { '1': { rounds: num(h.rounds, 0), cleanRounds: num(h.cleanRounds, 0), glow: !!h.glow } }
    };
    out.choices = {};
    if (isObj(c.choices)) Object.keys(c.choices).forEach(function (k) { out.choices[k.indexOf(':') >= 0 ? k : 'ch01:' + k] = c.choices[k]; });
    return out;
  }
  /* A saved lesson the runner can take up: { mode?, frame?, chapter?, state } whose state has a
   * queue of facts (finite a and b), a whole-number pos inside it, a log list and a requeues
   * object. Anything else (a hand-edited or half-written save) is dropped, so E.lessonAt,
   * E.counts.done and the keypad never meet it; the Count is simply started again. */
  function okNum(v) { return typeof v === 'number' && isFinite(v); }
  function okLesson(L) {
    if (!isObj(L) || !isObj(L.state)) return false;
    if (L.mode != null && L.mode !== 'chapter' && L.mode !== 'hollow') return false;
    if (L.frame != null && typeof L.frame !== 'string' && typeof L.frame !== 'number') return false;
    if (L.chapter != null && typeof L.chapter !== 'string') return false;
    var st = L.state;
    if (!Array.isArray(st.queue) || !st.queue.every(function (q) { return isObj(q) && okNum(q.a) && okNum(q.b); })) return false;
    if (!okNum(st.pos) || st.pos !== Math.floor(st.pos) || st.pos < 0 || st.pos > st.queue.length) return false;
    if (!Array.isArray(st.log) || !st.log.every(isObj) || !isObj(st.requeues)) return false;
    if (st.lines != null && !isObj(st.lines)) return false;
    if ((st.pool != null && !Array.isArray(st.pool)) || (st.asked != null && !Array.isArray(st.asked))) return false;
    if (st.avoid != null && !Array.isArray(st.avoid)) return false;
    if (st.own != null && !Array.isArray(st.own)) return false;
    return true;
  }
  E.okLesson = okLesson;
  function normCat(c, i) {
    if (isV1Cat(c)) c = fromV1(c);
    var b = E.blankCat({ id: typeof c.id === 'string' && c.id ? c.id : undefined, index: i });
    var out = b;
    Object.keys(b).forEach(function (k) {
      if (!own(c, k)) return;
      var v = c[k];
      if (Array.isArray(b[k])) { if (Array.isArray(v)) out[k] = v; }
      else if (isObj(b[k])) { if (isObj(v)) out[k] = v; }
      else if (k === 'lesson') { out[k] = okLesson(v) ? v : null; }
      else if (k === 'hollowWaiting') { out[k] = okLesson(v) && v.mode === 'hollow' ? v : null; }
      else if (k === 'chapter' || k === 'frame') { out[k] = (typeof v === 'string' || typeof v === 'number') ? v : null; }
      else if (typeof v === typeof b[k]) out[k] = v;
    });
    var look = E.defaultLook(i);
    E.LOOK_KEYS.forEach(function (k) { if (out.look && typeof out.look[k] === 'string') look[k] = out.look[k]; });
    out.look = look;
    var h = isObj(out.hollow) ? out.hollow : {};
    out.hollow = { rounds: num(h.rounds, 0), byTable: {} };
    if (isObj(h.byTable)) Object.keys(h.byTable).forEach(function (t) {
      var r = h.byTable[t];
      if (!isObj(r)) return;
      out.hollow.byTable[t] = { rounds: num(r.rounds, 0), cleanRounds: num(r.cleanRounds, 0), glow: !!r.glow };
    });
    Object.keys(out.finished).forEach(function (k) { if (!out.finished[k]) delete out.finished[k]; });
    Object.keys(out.dreams).forEach(function (k) { if (typeof out.dreams[k] !== 'string') delete out.dreams[k]; });
    // her Case File (none in a save from before chapter 4): each card once, as { id, chapter, at }
    var held = {};
    out.cards = out.cards.filter(function (k) {
      if (!isObj(k) || typeof k.id !== 'string' || !k.id || held[k.id]) return false;
      held[k.id] = true;
      return true;
    }).map(function (k) { return { id: k.id, chapter: typeof k.chapter === 'string' ? k.chapter : null, at: num(k.at, 0) }; });
    // places (none in a version-1 save, or a version-2 save from before them): { frame, history,
    // lesson } each; a place with no frame is a chapter lesson waiting for its frame (E.lessonAt)
    var pl = out.places;
    out.places = {};
    Object.keys(pl).forEach(function (id) {
      var p = pl[id];
      if (!isObj(p)) return;
      var frame = typeof p.frame === 'string' || typeof p.frame === 'number' ? p.frame : null;
      var lesson = okLesson(p.lesson) ? p.lesson : null;
      if (frame == null && !lesson) return;
      out.places[id] = { frame: frame, history: frame != null && Array.isArray(p.history) ? p.history : [], lesson: lesson };
    });
    return out;
  }
  /* Bring any stored value up to the current save shape: version 1 (chapter 1's) or 2. Lossless
   * for a version-1 save, idempotent, and never throws. */
  E.migrate = function (data) {
    var s = E.newSave();
    if (!isObj(data)) return s;
    if (Array.isArray(data.cats)) {
      s.cats = data.cats.filter(isObj).slice(0, E.MAX_CATS).map(normCat);
    }
    if (typeof data.current === 'string' && E.getCat(s, data.current)) s.current = data.current;
    if (isObj(data.settings)) {
      s.settings.readAloud = !!data.settings.readAloud;
      s.settings.bigText = !!data.settings.bigText;
    }
    return s;
  };

  /* Storage that cannot break the game. Every access is in try/catch; if the browser refuses
   * (private mode, full disk, blocked site data) the game carries on with an in-memory copy. */
  E.createStore = function (storage) {
    var memory = null;
    var useGiven = arguments.length > 0;
    function ls() {
      try { return useGiven ? (typeof storage === 'function' ? storage() : storage) : root.localStorage; }
      catch (e) { return null; }
    }
    var store = {
      ok: true,
      load: function () {
        var raw = null;
        try { var s = ls(); raw = s ? s.getItem(E.STORAGE_KEY) : null; }
        catch (e) { store.ok = false; raw = null; }
        if (raw == null || raw === '') return memory ? clone(memory) : E.newSave();
        try { return E.migrate(JSON.parse(raw)); }
        catch (e) { return memory ? clone(memory) : E.newSave(); }
      },
      save: function (data) {
        var json;
        try { json = JSON.stringify(data); } catch (e) { return false; }
        memory = JSON.parse(json);
        try {
          var s = ls();
          if (!s) { store.ok = false; return false; }
          s.setItem(E.STORAGE_KEY, json);
          store.ok = true;
          return true;
        } catch (e) { store.ok = false; return false; }
      },
      clear: function () {
        memory = null;
        try { var s = ls(); if (s) s.removeItem(E.STORAGE_KEY); return true; } catch (e) { return false; }
      }
    };
    return store;
  };

  /* ------------------------------------------------------------ gifts and treasures */
  E.TREASURES = [
    { id: 'moss', name: 'A pillow of soft green moss' },
    { id: 'feather', name: 'A blue jay feather' },
    { id: 'shell', name: 'A tiny river shell' },
    { id: 'pebble', name: 'A shiny speckled pebble' },   // speckled: Riffle’s lucky stone is the striped one
    { id: 'acorn', name: 'An acorn in its little hat' },
    { id: 'snail', name: 'A swirly snail shell (nobody home)' },
    { id: 'eggshell', name: 'A sky-blue robin’s eggshell' },
    { id: 'glass', name: 'A piece of river glass, smooth as soap' },
    { id: 'clover', name: 'A four-leaf clover' },
    { id: 'dandelion', name: 'A dandelion puff (don’t sneeze!)' },
    { id: 'leaf', name: 'A bright red leaf from leaf-drop' },
    { id: 'pinecone', name: 'A tiny pinecone' },
    { id: 'marble', name: 'A Tallwalker marble with a swirl inside' },
    { id: 'button', name: 'A lost Tallwalker button, very shiny' }
  ];
  /* Gifts come from the story (a frame's `gift`), once each; My nest shows them first. */
  E.GIFTS = [
    { id: 'riffle-stone', name: 'Riffle’s lucky stone: dark and smooth, with a white stripe all the way around', from: 'Riffle' }
  ];
  E.gift = function (id) {
    for (var i = 0; i < E.GIFTS.length; i++) if (E.GIFTS[i].id === id) return E.GIFTS[i];
    return null;
  };
  E.treasure = function (id) {
    for (var i = 0; i < E.TREASURES.length; i++) if (E.TREASURES[i].id === id) return E.TREASURES[i];
    return E.gift(id);
  };
  /* Put a gift in her nest, once. Returns true when it is new. */
  E.giveGift = function (cat, id) {
    if (!id || !cat) return false;
    if (!Array.isArray(cat.nest)) cat.nest = [];
    if (cat.nest.indexOf(id) >= 0) return false;
    cat.nest.push(id);
    return true;
  };
  /* The nest, grouped: [{ treasure, count, gift }] in the order first found. */
  E.nestItems = function (cat) {
    var seen = {}, out = [];
    (cat.nest || []).forEach(function (id) {
      if (seen[id]) { seen[id].count++; return; }
      var g = E.gift(id);
      var t = E.treasure(id) || { id: id, name: id };
      seen[id] = { treasure: t, count: 1, gift: !!g };
      out.push(seen[id]);
    });
    return out;
  };
  /* For My nest: the gifts from friends first, then the treasures. */
  E.nestGroups = function (cat) {
    var all = E.nestItems(cat);
    return { gifts: all.filter(function (x) { return x.gift; }), treasures: all.filter(function (x) { return !x.gift; }) };
  };

  /* ------------------------------------------------------------ lines that show `when` they match
   * A book recap line, a caption, a balloon or a choice option shows when every key in its `when`
   * matches: a flag first, then the look (sex, fur ...), then the cat's own fields. A value may be
   * a list (any of). Two lesson keys: `lessonClean: 'ch02-tails'` (that lesson finished with no
   * help) and `firstTry: '10x2'` (her most recent first ask of that fact, in either order, was
   * right without help). `not: { … }` matches when what it holds does not. No `when` = always. */
  function anyOf(want, fn) { return asList(want).some(function (w) { return fn(w); }); }
  E.lessonClean = function (cat, setId) {
    var L = cat && cat.lessons && cat.lessons[setId];
    return !!(L && L.noHelp && L.finished !== false);
  };
  E.firstTry = function (cat, key) {
    var m = /^(\d+)\s*[x×*]\s*(\d+)$/.exec(String(key == null ? '' : key).trim());
    if (!m) return false;
    var k = pairKey(+m[1], +m[2]), log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (!e || e.retry || e.filler || pairKey(e.a, e.b) !== k) continue;
      return !!e.correct && !e.helped;
    }
    return false;
  };
  E.matches = function (when, cat) {
    if (!when) return true;
    if (!isObj(when)) return true;
    cat = cat || {};
    return Object.keys(when).every(function (k) {
      var want = when[k], have;
      if (k === 'not') return isObj(want) ? !E.matches(want, cat) : true;
      if (k === 'lessonClean') return anyOf(want, function (s) { return E.lessonClean(cat, s); });
      if (k === 'firstTry') return anyOf(want, function (f) { return E.firstTry(cat, f); });
      if (cat.flags && own(cat.flags, k)) have = cat.flags[k];
      else if (cat.look && own(cat.look, k)) have = cat.look[k];
      else if (own(cat, k) && k !== 'flags' && k !== 'look') have = cat[k];
      if (Array.isArray(want)) return want.indexOf(have) !== -1;
      if (want === true) return have === true;
      if (want === false) return have === false || have == null || have === '';
      return have === want;
    });
  };
  /* A frame's captions as she sees them (raw text, tokens unfilled): a caption is a string or
   * { when, text }. */
  E.captions = function (frame, cat) {
    return asList(frame && frame.caption).map(function (c) {
      if (typeof c === 'string') return c;
      if (isObj(c) && typeof c.text === 'string' && E.matches(c.when, cat)) return c.text;
      return null;
    }).filter(function (c) { return c; });
  };
  /* A frame's captions as Read to me says them (raw text, tokens unfilled): E.captions, and the
   * frame's `sfxRead` when it has one. A sound effect is lettering and is never read aloud (nobody
   * can say “SNNNRRRK.”), so a caption that runs on into its sound (“On the rocks, otter tails go”,
   * “Then, a little later:”) was heard as a sentence nobody finished. `sfxRead` is the sound in
   * words, for the listener only (“a long, long snore.”); nothing on the page changes. It is said right
   * after the first caption she sees that does not end a sentence (the one that runs on into the
   * sound), or after the last caption when every one does, and before the balloons. */
  E.captionsRead = function (frame, cat) {
    var caps = E.captions(frame, cat);
    var heard = frame && typeof frame.sfxRead === 'string' ? frame.sfxRead : '';
    if (!heard.trim()) return caps;
    var at = caps.length - 1;
    for (var i = 0; i < caps.length; i++) if (!E.endsSentence(caps[i])) { at = i; break; }
    return caps.slice(0, at + 1).concat([heard], caps.slice(at + 1));
  };
  /* Does this line end a sentence (a full stop, a question or exclamation mark, or dots trailing
   * off, with any closing quote, bracket or emphasis mark after it)? A caption that ends on a colon,
   * a comma or a bare word runs on into what comes next. */
  E.endsSentence = function (text) {
    return /[.!?…][\s*”’"')\]]*$/.test(String(text == null ? '' : text));
  };
  /* A frame's balloons as she sees them: [{ who, text, kind, … }]. `nth` is the speaker's place
   * among all of that speaker's balloons (hidden ones included), so a balloon keeps its cast
   * member however many before it are hidden. */
  E.balloons = function (frame, cat) {
    var nth = {}, out = [];
    asList(frame && frame.say).forEach(function (s) {
      if (typeof s === 'string') s = { text: s };
      if (!isObj(s)) return;
      var who = s.who || '';
      var k = nth[who] = nth[who] == null ? 0 : nth[who] + 1;
      if (!E.matches(s.when, cat)) return;
      var b = {};
      Object.keys(s).forEach(function (x) { if (x !== 'when') b[x] = s[x]; });
      b.who = who; b.nth = k;
      out.push(b);
    });
    return out;
  };
  /* A choice's options as she sees them: [{ option, index }] (index into choice.options). An
   * option with a `when` that doesn't match is hidden; a choice keeps at least one option. */
  E.options = function (frame, cat) {
    var opts = (frame && frame.choice && frame.choice.options) || [];
    var out = [];
    opts.forEach(function (o, i) { if (o && E.matches(o.when, cat)) out.push({ option: o, index: i }); });
    if (!out.length && opts.length) out.push({ option: opts[0], index: 0 });
    return out;
  };
  /* An option's label as she reads it (tokens unfilled): the first of its `labelWhen` variants
   * ([{ when, label }]) that matches her, else its `label` (chapter 4's tower choice, for a cat who
   * has met Squall: "Go up and see Squall again."). */
  E.optionLabel = function (option, cat) {
    if (!option) return '';
    var v = asList(option.labelWhen);
    for (var i = 0; i < v.length; i++) if (isObj(v[i]) && typeof v[i].label === 'string' && E.matches(v[i].when, cat)) return v[i].label;
    return option.label;
  };

  /* ------------------------------------------------------------ her Case File (chapter 4 on)
   * A chapter may carry `cards: { id: { mark: 'eye' | 'ear', line, picture?, answers?, when?, link? } }`:
   * a piece of bark for each thing she finds out, with one picture scratched on it (`picture`: the
   * art's name for it, the card's id unless it says), one line, and a mark: an eye for what she saw
   * herself, an ear for what she was only told. A frame gives cards with `card: 'id'`, or a list of
   * ids and { id, when } entries; reaching the frame puts each in her file, once, like a gift (Back
   * never takes one away, a second reading never gives it twice). `cat.cards` keeps them in the
   * order found: { id, chapter, at }.
   * A definition's `when` hides its card while it doesn't match (`squall-shapes`: she holds it from
   * the roof, and her file shows it once the roof scene is finished: `{ foundSquall: true }`), except
   * on the frame that gives it and the pages she reads on from it (while that frame is behind her in
   * this reading: the roof's two last pages; Back past it hides it again). `answers` (on a claim, an
   * ear card: the ids of the cards that answer it) is for chapter 10 and only stored now; with
   * `link: { when, line }` the claim and the answers she holds are drawn touching once `when` matches
   * (`{ ch4CaughtFly: true }`: "They can’t both be true."), and kept apart until then.
   * Chapter 5: a link may name its partners itself, `link: { with: ['fox-moon'], line: 'One of them is
   * wrong.' }` (any cards, an ear beside an ear, an eye beside an eye; `answers` stays chapter 10's):
   * the card and each partner she holds are drawn touching from the moment she holds both (a `when`
   * may still hold it back). A card two links name (`squall-shapes`, touched by the heron's two
   * shapes and by a climber's prints) lies between them: three in a row, a line for each join. */
  function cardEntries(x) {
    return asList(x).map(function (c) { return typeof c === 'string' ? { id: c } : c; })
      .filter(function (c) { return isObj(c) && typeof c.id === 'string' && c.id; });
  }
  /* A card's definition: this chapter's, else any chapter's (a later chapter may give an earlier
   * chapter's card: the roof, found later). Null when no chapter has it. */
  E.cardDef = function (id, story, stories) {
    if (story && isObj(story.cards) && isObj(story.cards[id])) return story.cards[id];
    var list = storyList(stories);
    for (var i = 0; i < list.length; i++) if (isObj(list[i].cards) && isObj(list[i].cards[id])) return list[i].cards[id];
    return null;
  };
  /* The cards a frame shows her under its panel: its `card` entries whose own `when` matches
   * ({ id, when?, line?, mark?, held? }). An entry with `held: true` is a card she already has, laid
   * beside the new one for this one panel (the wing beside the fox's FLEW, for the cat who caught
   * it): shown only when she holds it, and never given here. E.frameGives is the rest: the cards
   * reaching the frame puts in her file. */
  E.frameCards = function (frame, cat) {
    return cardEntries(frame && frame.card).filter(function (c) { return E.matches(c.when, cat) && (c.held !== true || E.hasCard(cat, c.id)); });
  };
  E.frameGives = function (frame, cat) {
    return cardEntries(frame && frame.card).filter(function (c) { return c.held !== true && E.matches(c.when, cat); });
  };
  /* Put a card in her Case File, once. Returns true when it is new. Her first card is where the file
   * begins (`caseFile: true`, a flag for the story to read). */
  E.giveCard = function (cat, id, chapterId, now) {
    if (!cat || typeof id !== 'string' || !id) return false;
    if (!Array.isArray(cat.cards)) cat.cards = [];
    if (cat.cards.some(function (c) { return c && c.id === id; })) return false;
    cat.cards.push({ id: id, chapter: chapterId || cat.chapter || null, at: now || 0 });
    if (!isObj(cat.flags)) cat.flags = {};
    cat.flags.caseFile = true;
    return true;
  };
  E.hasCard = function (cat, id) { return !!(cat && Array.isArray(cat.cards) && cat.cards.some(function (c) { return c && c.id === id; })); };
  /* Her Case File's button is there (the top bar on every frame, the hub) once she has reached a
   * `file` frame: chapter 4's "Skritch". */
  E.hasFile = function (cat) { return !!(cat && isObj(cat.flags) && cat.flags.caseFileOpen === true); };
  // the ids the frame she is on gives her (a `card` frame, or a row of bark she is scratching), and
  // the frames behind her in this reading (her back-history: a card given a page ago is still going
  // into her file on the next page, before the frame that sets its flag; Back past the frame that
  // gave it takes that frame out of her history, and the card out of her file)
  function givenHere(cat, list) {
    var out = {}, story = cat && E.chapter(cat.chapter, list);
    if (!story || !story.frames) return out;
    [cat.frame].concat(Array.isArray(cat.history) ? cat.history : []).forEach(function (id) {
      var f = story.frames[id];
      if (!f) return;
      E.frameGives(f, cat).forEach(function (c) { out[c.id] = true; });
      if (isObj(f.scratch)) cardEntries(f.scratch.cards).forEach(function (c) { if (E.matches(c.when, cat)) out[c.id] = true; });
    });
    return out;
  }
  /* Her cards as her Case File shows them, in the order found: [{ id, chapter, at, mark, line,
   * picture, answers, link, shown }] (the line's tokens unfilled). A card whose definition is gone is
   * skipped, never an error; one whose `when` doesn't match is left out, unless she is on the frame
   * that gives it or has read on from it (givenHere). `opts.all` keeps those too, marked `shown:
   * false` (the grown-ups corner). */
  E.cards = function (cat, stories, opts) {
    var out = [], list = E.chapters(stories), all = !!(opts && opts.all), here = null;
    ((cat && cat.cards) || []).forEach(function (c) {
      if (!isObj(c) || typeof c.id !== 'string') return;
      var def = E.cardDef(c.id, E.chapter(c.chapter, list), list);
      if (!def) return;
      var shown = !def.when || E.matches(def.when, cat);
      if (!shown) { here = here || givenHere(cat, list); shown = !!here[c.id]; }
      if (!shown && !all) return;
      out.push({
        id: c.id, chapter: c.chapter || null, at: c.at || 0,
        mark: def.mark === 'ear' ? 'ear' : 'eye', line: typeof def.line === 'string' ? def.line : '',
        picture: typeof def.picture === 'string' && def.picture ? def.picture : c.id,
        answers: asList(def.answers).filter(function (a) { return typeof a === 'string'; }),
        link: isObj(def.link) ? def.link : null, shown: shown
      });
    });
    return out;
  };
  /* The cards a frame shows under its panel as she reaches it: each with its definition, and
   * whether its line and its mark are lettered there. The line is lettered once: when one of the
   * frame's own balloons or captions already says it (her first card: the line is her balloon), or
   * the entry says `line: false`, the card is its picture alone. `mark: false` leaves the mark off
   * (her first card, before Tallyheart gives the eye and the ear their rule). */
  function sayable(t) { return String(t == null ? '' : t).replace(/\*+/g, '').replace(/^[\s“"‘']+|[\s”"’']+$/g, '').replace(/\s+/g, ' '); }
  E.cardsOn = function (frame, cat, story, stories) {
    var said = E.balloons(frame, cat).map(function (b) { return sayable(E.fill(b.text, cat)); })
      .concat(E.captions(frame, cat).map(function (c) { return sayable(E.fill(c, cat)); }));
    var out = [];
    E.frameCards(frame, cat).forEach(function (e) {
      var def = E.cardDef(e.id, story, stories);
      if (!def) return;
      var line = typeof def.line === 'string' ? def.line : '';
      var c = {
        id: e.id, mark: def.mark === 'ear' ? 'ear' : 'eye', line: line,
        picture: typeof def.picture === 'string' && def.picture ? def.picture : e.id,
        showLine: e.line !== false && !!line && said.indexOf(sayable(E.fill(line, cat))) < 0,
        showMark: e.mark !== false
      };
      if (e.held === true) c.held = true;   // a card she already holds, laid beside the new one
      out.push(c);
    });
    return out;
  };
  /* A frame that gives a card makes the Case File's button wiggle and glow, once the button is there
   * (so each new card is seen to go into the file she can open). Not the `file` frame itself, where
   * the button glows until she taps it. */
  E.fileWiggles = function (cat, story, frameId) {
    var f = story && story.frames && story.frames[frameId];
    return !!f && E.hasFile(cat) && !f.file && E.frameGives(f, cat).length > 0;
  };
  /* The Case File's screen: "{name}paw’s Case File", her cards in two groups, each in the order
   * found: "What I saw myself" (the eye cards) and "What I was told (to check)" (the ear cards). Side
   * by side on a wide screen; one above the other on a narrow one, the claims first (`narrow`): as one
   * list, what she saw and then what she was told, the last thing she saw would lie beside the first
   * thing she was told, and nothing may put "Sprinkle can’t fly." beside "The fox says it FLEW."
   * before she has made that link herself. Once she has (the claim's `link.when` matches), the claim
   * and the cards that answer it leave their groups and are drawn touching, across the groups, over
   * the link's line (`links`). Empty places are never shown: the file never says how many there are. */
  E.FILE_GROUPS = [
    { mark: 'eye', title: 'What I saw myself', means: 'I saw this myself.' },
    { mark: 'ear', title: 'What I was told (to check)', means: 'Somebody told me. A thing to check.' }
  ];
  E.FILE_COLS = { wide: 3, narrow: 2 };   // cards across a group (the page's CSS lays them out so)
  E.caseFile = function (cat, stories) {
    var cards = E.cards(cat, stories), by = {}, inLink = {}, links = [];
    cards.forEach(function (c) { by[c.id] = c; });
    // the link a card lies in, and whether it is at one of its ends (a row can only grow at its ends)
    function rowOf(id) { for (var i = 0; i < links.length; i++) if (links[i].cards.some(function (k) { return k.id === id; })) return links[i]; return null; }
    function atEnd(L, id) { return L.cards[0].id === id ? 'first' : L.cards[L.cards.length - 1].id === id ? 'last' : null; }
    function lines(L) { return L.lines || [L.line]; }
    // chapter 5, `link.with`: `c` and its partner `p` lie touching, over `line`. Neither in a row yet:
    // a new row, the partner first. One of them at the end of a row: the other joins it there (the
    // row is then three long, with a line for each join). Otherwise they cannot touch, and stay put.
    function touch(p, c, line) {
      var P = rowOf(p.id), C = rowOf(c.id), e;
      if (!P && !C) { links.push({ cards: [p, c], line: line }); }
      else if (P && !C) {
        e = atEnd(P, p.id);
        if (!e) return;
        var lp = lines(P);
        if (e === 'last') { P.cards.push(c); P.lines = lp.concat([line]); } else { P.cards.unshift(c); P.lines = [line].concat(lp); }
        P.line = P.lines[0];
      } else if (C && !P) {
        e = atEnd(C, c.id);
        if (!e) return;
        var lc = lines(C);
        if (e === 'last') { C.cards.push(p); C.lines = lc.concat([line]); } else { C.cards.unshift(p); C.lines = [line].concat(lc); }
        C.line = C.lines[0];
      } else return;   // both in rows already (the same one, or two): left as they lie
      inLink[p.id] = true; inLink[c.id] = true;
    }
    cards.forEach(function (c) {
      if (!c.link || !E.matches(c.link.when, cat)) return;
      var line = typeof c.link.line === 'string' && c.link.line ? c.link.line : 'They can’t both be true.';
      if (Array.isArray(c.link.with)) {
        c.link.with.forEach(function (id) { var p = by[id]; if (p && p.id !== c.id) touch(p, c, line); });
        return;
      }
      if (inLink[c.id]) return;
      var ans = c.answers.map(function (id) { return by[id]; }).filter(function (a) { return a && a.id !== c.id && !inLink[a.id]; });
      if (!ans.length) return;
      inLink[c.id] = true;
      ans.forEach(function (a) { inLink[a.id] = true; });
      links.push({ cards: ans.concat([c]), line: line });
    });
    return {
      title: E.fill('{name}paw’s Case File', cat),
      groups: E.FILE_GROUPS.map(function (g) {
        return { mark: g.mark, title: g.title, means: g.means, cards: cards.filter(function (c) { return c.mark === g.mark && !inLink[c.id]; }) };
      }),
      links: links, narrow: ['ear', 'eye'], count: cards.length
    };
  };
  E.markMeans = function (mark) { return (E.FILE_GROUPS.filter(function (g) { return g.mark === mark; })[0] || E.FILE_GROUPS[0]).means; };
  /* Whether two cards lie next to each other on the Case File's screen, in either layout: in one
   * group, side by side or one above the other; across the groups, side by side (what she saw on the
   * left: the card that ends a row of it and the claim that starts the same row of the other group),
   * or, one group above the other with the claims first, the last row of claims over the first row
   * of what she saw (the same column, or the last claim and the first thing she saw: one after the
   * other as she reads). Two cards in one link touch; in a row of three (chapter 5: a link with a
   * line for each join), the two that lie side by side. */
  E.fileNeighbours = function (file, a, b) {
    function where(id) {
      var i, k;
      for (i = 0; i < file.links.length; i++) for (k = 0; k < file.links[i].cards.length; k++) if (file.links[i].cards[k].id === id) return { link: i, at: k, row: !!file.links[i].lines };
      for (i = 0; i < file.groups.length; i++) for (k = 0; k < file.groups[i].cards.length; k++) {
        if (file.groups[i].cards[k].id === id) return { g: i, i: k, n: file.groups[i].cards.length, mark: file.groups[i].mark };
      }
      return null;
    }
    var A = where(a), B = where(b);
    if (!A || !B || a === b) return false;
    if (A.link != null || B.link != null) return A.link != null && A.link === B.link && (!A.row || Math.abs(A.at - B.at) === 1);
    return ['wide', 'narrow'].some(function (lay) {
      var cols = E.FILE_COLS[lay], row = function (p) { return Math.floor(p.i / cols); }, col = function (p) { return p.i % cols; };
      if (A.g === B.g) { var d = Math.abs(A.i - B.i); return (d === 1 && row(A) === row(B)) || d === cols; }
      var eye = A.mark === 'eye' ? A : B, ear = A.mark === 'eye' ? B : A;
      if (lay === 'wide') return row(eye) === row(ear) && (col(eye) === cols - 1 || eye.i === eye.n - 1) && col(ear) === 0;
      var lastRow = Math.floor((ear.n - 1) / cols);
      return row(ear) === lastRow && row(eye) === 0 && (col(ear) === col(eye) || (ear.i === ear.n - 1 && eye.i === 0));
    });
  };

  /* `scratch`, the bark Taps (the skip-count's cousin): `scratch: { cards: ['tidy', { id, when }, …],
   * next }` lays blank curls of bark in a row, the next one glowing; a tap scratches its picture in,
   * letters its line under it and gives her the card; the last tap turns the page. `head` lists cards
   * already scratched that lie at the head of the row (her first card). `draws: 'id'` is the same
   * with no card: one curl, the tap scratches that card's picture and turns the page (the frame it
   * turns to gives the card, with `card`). `tap: 'glint'` is the plainest form, with nothing
   * scratched: the scene's glint pulses, a tap on it makes it flare and turns the page. Nothing can
   * be got wrong, and nothing is logged.
   * E.scratchPieces is the row as she sees it: [{ id, mark, line, picture, head?, draws?, done }]:
   * a piece is done when she holds its card, so the row picks up where she left it. */
  E.scratchPieces = function (frame, cat, story, stories) {
    var sc = frame && frame.scratch, out = [];
    if (!isObj(sc)) return out;
    function piece(e, extra) {
      var def = E.cardDef(e.id, story, stories) || {};
      return Object.assign({ id: e.id, mark: def.mark === 'ear' ? 'ear' : 'eye', line: typeof def.line === 'string' ? def.line : '',
        picture: typeof def.picture === 'string' && def.picture ? def.picture : e.id, done: E.hasCard(cat, e.id) }, extra || {});
    }
    cardEntries(sc.head).forEach(function (e) { out.push(piece(e, { head: true, done: true })); });
    if (typeof sc.draws === 'string' && sc.draws) out.push(piece({ id: sc.draws }, { draws: true, done: false }));
    cardEntries(sc.cards).forEach(function (e) { if (E.matches(e.when, cat)) out.push(piece(e)); });
    return out;
  };
  /* One tap on the row: the next blank piece is scratched and its card is hers. Returns that card's
   * id, or null when no piece is left (the page turns). */
  E.scratchTap = function (cat, story, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.scratch) return null;
    var next = E.scratchPieces(f, cat, story).filter(function (p) { return !p.head && !p.draws && !p.done; })[0];
    if (!next) return null;
    E.giveCard(cat, next.id, story.id, now);
    if (now) cat.updated = now;
    return next.id;
  };
  /* A scratch or file frame's words: the instruction under the panel and the hidden button's. */
  E.tapWords = function (frame) {
    var f = frame || {}, sc = f.scratch, fl = f.file;
    if (isObj(fl) || fl === true) {
      return { prompt: isObj(fl) && typeof fl.prompt === 'string' ? fl.prompt : '**Tap** your Case File. You can open it any time.', label: 'Open your Case File' };
    }
    if (!isObj(sc)) return { prompt: '', label: '' };
    var kind = sc.tap ? 'tap' : sc.draws && !cardEntries(sc.cards).length ? 'draws' : 'cards';
    var dp = kind === 'tap' ? (sc.tap === 'glint' ? '**Tap** the glitter.' : '') : kind === 'draws' ? '**Tap** the bark to scratch it.' : '**Tap** each piece of bark to scratch it.';
    var dl = kind === 'tap' ? (sc.tap === 'glint' ? 'Look at the glitter.' : 'Tap it.') : kind === 'draws' ? 'Scratch the bark' : 'Scratch the next piece of bark';
    var w = { kind: kind, prompt: typeof sc.prompt === 'string' ? sc.prompt : dp, label: typeof sc.label === 'string' && sc.label ? sc.label : dl };
    // chapter 5: `miss`, the small answer to a tap anywhere else, lettered small by the spot ("snnrrk…")
    if (kind === 'tap' && typeof sc.miss === 'string' && sc.miss) w.miss = sc.miss;
    return w;
  };

  /* `ask` (chapter 5: Riffle's seven questions), a Tap that counts nothing: `ask: { who: 'riffle', to:
   * 'patience', pairs: [[question, answer], …], next, prompt?, label? }`. The asker glows softly on the
   * frame's own scene. A tap on him letters his next question in his balloon and her answer in hers,
   * and adds one to the scene's `owed` (the marsh: a pair of fish in the thought cloud over the heron;
   * `opt` names another option); the pairs before it stay under the panel, small, so all of them can
   * be read back. A tap anywhere else makes him hop. After the last pair the frame shows Next. No
   * number is shown and nothing is logged.
   * E.askView(ask, taps) is the page after that many taps: { taps, total, done, who, to, pair: the
   * newest [question, answer] or null, before: the pairs before it, owed }. */
  function askPairs(ask) {
    return asList(ask && ask.pairs).filter(function (p) { return Array.isArray(p) && typeof p[0] === 'string' && typeof p[1] === 'string'; });
  }
  E.askView = function (ask, taps) {
    ask = ask || {};
    var pairs = askPairs(ask), n = Math.max(0, Math.min(pairs.length, num(taps, 0) | 0));
    return { taps: n, total: pairs.length, done: n >= pairs.length, who: ask.who || 'riffle', to: ask.to || '',
      pair: n ? pairs[n - 1].slice(0, 2) : null, before: pairs.slice(0, Math.max(0, n - 1)).map(function (p) { return p.slice(0, 2); }), owed: n };
  };
  /* The frame's scene after that many taps: its own, with `owed` (or the option `ask.opt` names) set
   * to its own number plus the taps. The story's scene is never changed. */
  E.askScene = function (scene, ask, taps) {
    if (!scene) return scene;
    var s = clone(scene), k = typeof (ask && ask.opt) === 'string' && ask.opt ? ask.opt : 'owed';
    if (!isObj(s.opts)) s.opts = {};
    s.opts[k] = num(s.opts[k], 0) + E.askView(ask, taps).taps;
    return s;
  };
  E.askWords = function (ask) {
    ask = ask || {};
    return { prompt: typeof ask.prompt === 'string' ? ask.prompt : '**Tap** to ask the next question.',
      label: typeof ask.label === 'string' && ask.label ? ask.label : 'Ask the next question.' };
  };

  /* ------------------------------------------------------------ flow */
  E.KINDS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'];
  E.kindOf = function (frame) {
    if (!frame) return null;
    if (frame.end) return 'end';
    if (frame.choice) return 'choice';
    if (frame.input) return 'input';
    if (frame.look) return 'look';
    if (frame.counts) return 'counts';
    if (frame.skip) return 'skip';
    if (frame.scratch) return 'scratch';
    if (frame.file) return 'file';
    if (frame.ask) return 'ask';
    if (frame.next) return 'next';
    return 'end';
  };
  /* A frame may carry `when` (matched as lines are: E.matches). A frame whose `when` doesn't match
   * is skipped, forward and back, as if its `next` led straight on (chapter 3's river-path screen).
   * Chapter 4: with `else: 'frameId'` beside its `when`, a frame that doesn't show leads there
   * instead, so a choice, and the pages only it leads to, can be for some cats only (the roof offered
   * again in a later chapter to a cat who has not found Squall: `when: { foundSquall: false }, else:
   * …`; everyone else goes straight past the choice and the roof). */
  E.shows = function (frame, cat) { return !!frame && (!frame.when || E.matches(frame.when, cat)); };
  /* Where a page turn to `to` lands for her: `to`, or the first frame after it that shows. */
  E.landing = function (cat, story, to) {
    for (var guard = 0; guard < 64 && to && story.frames[to] && !E.shows(story.frames[to], cat); guard++) {
      var f = story.frames[to];
      to = typeof f.else === 'string' && f.else ? f.else : E.exits(f)[0];
    }
    return to;
  };
  /* Arriving on a frame: an end frame finishes its chapter (the first time); a gift frame puts its
   * gift in her nest (once; Back never takes it away). Chapter 4: a frame's `sets` are flags set by
   * reaching it and never unset (`foundSquall`, `ch4CaughtFly`: Back replaces what a choice set, never
   * these); its `card` goes into her Case File (once, like a gift); and a `file` frame is where her
   * Case File's button appears, for good (`caseFileOpen`). */
  function arrive(cat, story, id, now) {
    var f = story.frames[id];
    if (!f) return;
    if (f.end && !E.isFinished(cat, story.id)) {
      if (!isObj(cat.finished)) cat.finished = {};
      cat.finished[story.id] = now || 1;
    }
    if (f.gift) E.giveGift(cat, f.gift);
    if (isObj(f.sets)) {
      if (!isObj(cat.flags)) cat.flags = {};
      Object.keys(f.sets).forEach(function (k) { cat.flags[k] = f.sets[k]; });
    }
    if (f.card != null) E.frameGives(f, cat).forEach(function (c) { E.giveCard(cat, c.id, story.id, now); });
    if (f.file) {
      if (!isObj(cat.flags)) cat.flags = {};
      cat.flags.caseFileOpen = true;
    }
  }
  /* ------------------------------------------------------------ places: one reading position per chapter
   * The chapter she is reading keeps its place on the cat itself (`chapter`, `frame`, `history`,
   * and its lesson in progress in `lesson`). Every other chapter she is partway through waits in
   * `places`, by chapter id: { frame, history, lesson }. Going from one chapter to another parks
   * the one she leaves (E.startChapter, E.openChapter), so reading a finished chapter again never
   * moves her place in another; E.openChapter picks a parked place up where she left it. A
   * finished chapter is never parked: it is read again from its start. The one lesson slot
   * (`lesson`) is shared with the Training Hollow: a chapter lesson that gives way to a Hollow round
   * waits in its chapter's place with no frame, and E.lessonAt brings it back at its frame. */
  // L, when it is a chapter lesson of chapter `id` (a lesson with no `chapter` belongs to `owner`)
  function lessonOf(L, owner, id) {
    return isObj(L) && L.mode !== 'hollow' && isObj(L.state) && (L.chapter || owner) === id ? L : null;
  }
  function placesOf(cat) { return isObj(cat.places) ? cat.places : (cat.places = {}); }
  function busy(L) { return isObj(L) && isObj(L.state) && !E.counts.done(L.state); }
  // Two chapter lessons of one chapter in progress and one place to keep them (a Count she counts
  // again while a later lesson waits): a first go is never pushed out by counting a finished Count
  // again; otherwise the newer stays.
  function keepOne(cat, newer, older) {
    if (!busy(older)) return newer || older || null;
    if (!busy(newer)) return older;
    var again = function (L) { return !!(L.state.set && isObj(cat.lessons) && cat.lessons[L.state.set]); };
    return again(newer) && !again(older) ? older : newer;
  }
  /* Park the chapter she is reading (its frame, back-history and lesson in progress); a finished
   * one is let go. Afterwards she is reading nothing, until the caller opens a chapter. */
  function park(cat) {
    var id = cat.chapter;
    if (!id) return;
    var P = placesOf(cat), waiting = P[id] && P[id].lesson;
    var L = lessonOf(cat.lesson, id, id);
    if (L && !busy(L)) { E.settleLesson(cat); L = null; }   // all answered, never recorded: record it
    if (L) cat.lesson = null;
    delete P[id];
    if (cat.frame != null && !E.isFinished(cat, id)) P[id] = { frame: cat.frame, history: cat.history || [], lesson: keepOne(cat, L, waiting) };
    cat.chapter = null; cat.frame = null; cat.history = [];
  }
  /* Where she is in a chapter: { frame, history, lesson } (the chapter she is reading, or a parked
   * one), else null. */
  E.place = function (cat, id) {
    if (!cat || !id) return null;
    var P = isObj(cat.places) ? cat.places[id] : null;
    if (cat.chapter === id && cat.frame != null) {
      return { frame: cat.frame, history: cat.history || [], lesson: lessonOf(cat.lesson, id, id) || (P && P.lesson) || null };
    }
    return P && P.frame != null ? { frame: P.frame, history: P.history || [], lesson: P.lesson || null } : null;
  };
  /* Read a chapter from its first page (a new chapter, or a finished one again). The chapter she
   * was reading is parked first; this chapter's own old place, if any, is let go. */
  E.startChapter = function (cat, story, now) {
    if (cat.chapter && cat.chapter !== story.id) park(cat);
    if (isObj(cat.places)) delete cat.places[story.id];
    cat.chapter = story.id;
    cat.frame = E.landing(cat, story, story.start);
    cat.history = [];
    if (!(isObj(cat.lesson) && cat.lesson.mode === 'hollow')) cat.lesson = null;   // a Hollow round in progress stays
    arrive(cat, story, cat.frame, now);
    if (now) cat.updated = now;
    return cat;
  };
  /* Go to a chapter where she left it: the chapter she is reading carries on; a parked place is
   * picked up (frame, back-history, lesson); else the chapter starts from its first page. */
  E.openChapter = function (cat, story, now) {
    if (cat.chapter === story.id && cat.frame != null) return cat;
    var P = isObj(cat.places) ? cat.places[story.id] : null;
    if (!P || P.frame == null) return E.startChapter(cat, story, now);
    park(cat);
    delete cat.places[story.id];
    cat.chapter = story.id;
    // a parked page that no longer shows (f081 after chapter 2 is read again on the other path)
    // lands as a page turn would: on the first frame after it that shows
    cat.frame = E.landing(cat, story, P.frame);
    // (a page she has never been on: it gives its card and sets its flags as a page turn would)
    if (cat.frame !== P.frame) arrive(cat, story, cat.frame, now);
    cat.history = Array.isArray(P.history) ? P.history : [];
    if (P.lesson) {
      if (isObj(cat.lesson) && !busy(cat.lesson)) E.settleLesson(cat);
      // a Hollow round in progress keeps the slot; the chapter's lesson waits for its frame
      if (busy(cat.lesson)) cat.places[story.id] = { frame: null, history: [], lesson: P.lesson };
      else cat.lesson = P.lesson;
    }
    if (now) cat.updated = now;
    return cat;
  };
  /* The chapter lesson in progress at this frame of the chapter she is reading, or null. One that
   * waits in the chapter's place takes the slot now (as starting a lesson there would). */
  E.lessonAt = function (cat, story, frameId) {
    if (!cat || !story) return null;
    var L = lessonOf(cat.lesson, cat.chapter, story.id);
    if (L && L.frame === frameId && busy(L)) return L;
    var P = cat.chapter === story.id && isObj(cat.places) ? cat.places[story.id] : null;
    var W = P && lessonOf(P.lesson, story.id, story.id);
    if (W && W.frame === frameId && busy(W)) {
      delete cat.places[story.id];
      setAsideHollow(cat);
      cat.lesson = W;
      return W;
    }
    return null;
  };
  /* A Training Hollow round in progress gives way to a chapter lesson as a chapter lesson gives way
   * to a round: when E.lessonAt or E.beginLesson takes the slot from it, it waits in
   * `hollowWaiting` (a round all answered but never recorded counts now instead), and E.hollowRound
   * hands it back when she opens the Hollow again. */
  function setAsideHollow(cat) {
    var L = cat.lesson;
    if (!(isObj(L) && L.mode === 'hollow' && isObj(L.state))) return;
    if (!busy(L)) { E.settleLesson(cat); return; }
    cat.hollowWaiting = L;
    cat.lesson = null;
  }
  /* The Training Hollow round in progress, in the slot, or null. One that gave way to a chapter
   * lesson comes back into the slot now, and that chapter lesson waits in its chapter's place
   * (E.holdLesson), as it does when a round starts. A round in the slot is returned as it is (the
   * caller settles one whose last answer is in). */
  E.hollowRound = function (cat) {
    if (!cat) return null;
    var L = cat.lesson;
    if (isObj(L) && L.mode === 'hollow' && isObj(L.state)) return L;
    var W = cat.hollowWaiting;
    if (!(isObj(W) && W.mode === 'hollow' && busy(W))) { cat.hollowWaiting = null; return null; }
    E.holdLesson(cat);
    if (busy(cat.lesson)) return null;   // the slot can't be freed: the round keeps waiting
    cat.lesson = W;
    cat.hollowWaiting = null;
    return W;
  };
  /* Before a Training Hollow round takes the lesson slot: a chapter lesson in progress there waits
   * in its chapter's place (E.lessonAt brings it back at its frame). */
  E.holdLesson = function (cat) {
    var L = cat && isObj(cat.lesson) && cat.lesson.mode !== 'hollow' && isObj(cat.lesson.state) ? cat.lesson : null;
    if (!L) return false;
    if (!busy(L)) { E.settleLesson(cat); return false; }   // all answered, never recorded: record it
    var id = L.chapter || cat.chapter, P = placesOf(cat);
    // a lesson already waiting there (one she left to count an earlier Count again) is kept too
    if (id && id === cat.chapter) P[id] = { frame: null, history: [], lesson: keepOne(cat, L, P[id] && P[id].frame == null ? P[id].lesson : null) };
    else if (id && P[id] && P[id].frame != null) P[id].lesson = keepOne(cat, L, P[id].lesson);
    else return false;
    cat.lesson = null;
    return true;
  };
  /* A chapter lesson starts at a frame ("Let’s count!", or "Count them again" on a Count she has
   * finished) and takes the slot. A lesson still going at another frame of this chapter (she went
   * Back past it to count an earlier Count again) waits in the chapter's place, as it does for a
   * Hollow round, and E.lessonAt hands it back at its own frame. Returns the new lesson. */
  E.beginLesson = function (cat, story, frameId, state) {
    var L = lessonOf(cat.lesson, cat.chapter, story.id);
    if (L && L.frame !== frameId && cat.chapter === story.id) E.holdLesson(cat);
    setAsideHollow(cat);   // a Hollow round in progress waits too (E.hollowRound)
    cat.lesson = { mode: 'chapter', frame: frameId, chapter: story.id, state: state };
    return cat.lesson;
  };
  /* The frame a cat is on. A save that points at a frame the story no longer has (the story was
   * edited) falls back to the last frame in its history that still exists, then the start. */
  E.frameId = function (cat, story) {
    if (cat.frame && story.frames[cat.frame]) return cat.frame;
    for (var i = cat.history.length - 1; i >= 0; i--) if (story.frames[cat.history[i]]) return cat.history[i];
    return story.start;
  };
  E.currentFrame = function (cat, story) { return story.frames[E.frameId(cat, story)]; };
  E.go = function (cat, story, to, now) {
    if (!to || !story.frames[to]) return false;
    var from = E.frameId(cat, story);
    cat.history.push(from);
    if (cat.history.length > E.HISTORY_CAP) cat.history.splice(0, cat.history.length - E.HISTORY_CAP);
    cat.frame = to;
    cat.chapter = story.id;
    arrive(cat, story, to, now);
    if (now) cat.updated = now;
    return true;
  };
  E.next = function (cat, story, now) {
    var f = E.currentFrame(cat, story);
    var to = f && (f.next || (f.look && f.look.next) || (f.skip && f.skip.next) || (f.scratch && f.scratch.next) || (f.file && f.file.next) || (f.ask && f.ask.next));
    // a row of bark turns its page on the last tap; however the page turns, no card is left behind
    if (f && f.scratch) for (var guard = 0; guard < 24 && E.scratchTap(cat, story, now); guard++);
    return E.go(cat, story, E.landing(cat, story, to), now);
  };
  /* A choice is remembered under "chapter:frame", so chapters never overwrite each other's. */
  E.choiceKey = function (story, frameId) { return story.id + ':' + frameId; };
  E.chosen = function (cat, story, frameId) {
    var c = cat && cat.choices && cat.choices[E.choiceKey(story, frameId)];
    return c || null;
  };
  E.choose = function (cat, story, index, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.choice || !f.choice.options || !f.choice.options[index]) return false;
    // a hidden option can't be chosen
    if (!E.options(f, cat).some(function (o) { return o.index === index; })) return false;
    var opt = f.choice.options[index];
    var label = E.optionLabel(opt, cat);   // as she read it, before her pick changes anything
    if (isObj(opt.sets)) Object.keys(opt.sets).forEach(function (k) { cat.flags[k] = opt.sets[k]; });
    cat.choices[E.choiceKey(story, id)] = { index: index, label: label };
    return E.go(cat, story, E.landing(cat, story, opt.next), now);
  };
  /* Store what she typed (cleaned) and move on. For a dream, an empty value means skipped; each
   * chapter keeps its own dream. */
  E.submitInput = function (cat, story, value, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.input) return false;
    var kind = f.input.kind;
    if (kind === 'petname') cat.petname = E.cleanPetName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'clanname') cat.name = E.cleanClanName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'dream') { if (!isObj(cat.dreams)) cat.dreams = {}; cat.dreams[story.id] = E.cleanDream(value); }
    else if (kind) { cat.flags[kind] = E.cleanDream(value); }
    return E.go(cat, story, E.landing(cat, story, f.input.next), now);
  };
  /* Her dream for a chapter, as typed ('' when skipped or not reached). */
  E.dreamOf = function (cat, chapterId) {
    if (!cat) return '';
    if (typeof cat.dream === 'string' && cat.dream) return cat.dream;   // a version-1 cat, or a test's
    var d = isObj(cat.dreams) && chapterId ? cat.dreams[chapterId] : '';
    return typeof d === 'string' ? d : '';
  };
  E.confirmLook = function (cat, story, look, now) {
    var f = E.currentFrame(cat, story);
    if (!f || !f.look) return false;
    if (look) E.setLook(cat, look);
    cat.flags.looked = true;
    return E.go(cat, story, E.landing(cat, story, f.look.next), now);
  };
  /* Next on a Counts frame (its lesson just finished, or finished before). Only this frame's own
   * lesson leaves the slot: Next on an earlier Count she finished long ago (she went Back past a
   * later lesson in progress) never touches that later lesson, nor a Training Hollow round. */
  E.finishCounts = function (cat, story, summary, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.counts) return false;
    if (summary) cat.lessons[f.counts.set] = summary;
    var L = cat.lesson;
    if (!(isObj(L) && (L.mode === 'hollow' || (busy(L) && L.frame !== id)))) cat.lesson = null;
    return E.go(cat, story, E.landing(cat, story, f.counts.next), now);
  };
  E.canBack = function (cat) { return !!(cat && cat.history && cat.history.length); };
  E.back = function (cat, story) {
    while (cat.history.length) {
      var prev = cat.history.pop();
      // a lesson in progress stays: coming forward again resumes it at the same question; a page
      // whose `when` no longer matches is passed over, as it is going forward
      if (!story || (story.frames[prev] && E.shows(story.frames[prev], cat))) { cat.frame = prev; return true; }
    }
    return false;
  };
  /* Where to go from a frame, for graph checks and the storyboard. */
  E.exits = function (frame) {
    var k = E.kindOf(frame);
    if (k === 'next') return [frame.next];
    if (k === 'choice') return frame.choice.options.map(function (o) { return o.next; });
    if (k === 'input') return [frame.input.next];
    if (k === 'look') return [frame.look.next];
    if (k === 'counts') return [frame.counts.next];
    if (k === 'skip') return [frame.skip.next];
    if (k === 'scratch') return [frame.scratch.next];
    if (k === 'file') return [frame.file.next];
    if (k === 'ask') return [frame.ask.next];
    return [];
  };

  /* ------------------------------------------------------------ the skip-count
   * `skip: { table, groups, who?, next, done? }`: each tap counts the next group, lighting its
   * things and adding its running total (2, 4, 6…). Nothing can be got wrong and nothing is logged.
   * skipView(skip, taps) is what the panel shows after that many taps.
   * Chapter 4: `paws: 'both'` (the bedtime tens: her two forepaws patted down together, ten claws a
   * tap, the count trailing off in her murmur: "10… 20… 30… 40… 50…"), `paws: 'pile'` (the promise:
   * six piled forepaws, one friend's pair lit by each tap, the count in her own balloon), one group
   * (Squall's raised forepaw: one tap, its five claws, a big 5), `prompt` (an instruction under the
   * panel: "**Tap** the cats, left to right."), `label` (the hidden button's words for VoiceOver)
   * and `carry: false` (the page it turns to doesn't show the number reached: the roof's 5 stays on
   * the roof).
   * Chapter 5: `tuck: true` (the 9s: every cat's ten claws lit and the number at groups × 10; each
   * tap curls one claw in on the glowing cat and steps the number back by one, 49, 48 … 45; no
   * number under any cat, ever); `paws: 'board'` (her four paws set down on the raft one at a time,
   * counted in words: "One.", "Two."); `paws: 'log'` (nine claws dug into a log, the count in her own
   * thought, a tap anywhere counts, and no counting picture: the frame's scene stays up and is drawn
   * again at each tap, E.skipScene, with `steps`: [{ from: 4, opts: { plane: 'near' }, sfx: 'RRR…' }]);
   * `paws: 'mud'` (seven forepaws in the mud, one lit for each of `who`); `paws: 'both'` at table 9
   * (the bedtime nines); and `who` entries with a `when`, with no `groups`: the count is as long as
   * the entries that match her (E.skipFor, which every caller with a cat goes through first). */
  var COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  /* The skip-count as this cat meets it: `who` without the entries whose `when` doesn't match her,
   * and, when the story gives no `groups`, one group for each that is left (Sprinkle's forepaw and
   * one for every dragonet she has met: two to four). A skip with neither is handed back as it is. */
  E.skipFor = function (skip, cat) {
    if (!isObj(skip)) return skip;
    var who = Array.isArray(skip.who) ? skip.who : null;
    var cond = !!who && who.some(function (w) { return isObj(w) && w.when != null; });
    if (!cond && skip.groups != null) return skip;
    var out = Object.assign({}, skip);
    if (cond) {
      out.who = who.filter(function (w) { return !isObj(w) || E.matches(w.when, cat); }).map(function (w) {
        if (!isObj(w) || w.when == null) return w;
        var c = {};
        Object.keys(w).forEach(function (k) { if (k !== 'when') c[k] = w[k]; });
        return c;
      });
    }
    if (skip.groups == null) out.groups = Math.max(1, (out.who || []).length);
    return out;
  };
  E.skipView = function (skip, taps) {
    skip = skip || {};
    var table = Math.max(1, num(skip.table, 2) | 0), groups = Math.max(1, num(skip.groups, 5) | 0);
    var n = Math.max(0, Math.min(groups, num(taps, 0) | 0));
    var totals = [];
    for (var i = 1; i <= n; i++) totals.push(i * table);
    var done = n >= groups;
    // the tuck: the count runs backwards from groups × 10, a claw a tap (the art is told how many
    // cats have tucked; `highlight` is the claws still out and lit)
    if (skip.tuck) {
      var start = groups * 10, back = [];
      for (var b = 1; b <= n; b++) back.push(start - b);
      return { table: table, groups: groups, per: table, taps: n, highlight: start - n, total: start - n, totals: back, done: done,
        count: !n ? '' : back.join('… ') + (done ? '!' : '…'), tuck: true, start: start, tucked: n };
    }
    var v = {
      table: table, groups: groups, per: table, taps: n, highlight: n * table,
      total: n * table, totals: totals, done: done,
      // the teacher's balloon keeps the count: "2… 4… 6…", and the last number on its own at the end
      // (the bedtime hop, `paws: 'own'`, trails off sleepily: "5… 10… 15… 20…"; so do the bedtime tens)
      count: !n ? '' : totals.join('… ') + (done ? (skip.paws === 'own' || skip.paws === 'both' ? '…' : '!') : '…')
    };
    // `paws: 'own'` (the bedtime hop): her own two forepaws taking turns, left, right, left, right;
    // `lit` is the paw the last tap lit, `nextPaw` the one glowing for the next
    if (skip.paws === 'own') {
      v.paws = 'own';
      v.lit = n ? (n % 2 ? 'left' : 'right') : null;
      v.nextPaw = done ? null : (n % 2 ? 'right' : 'left');
    }
    // `paws: 'both'` (the bedtime tens): both forepaws together, every tap; `paws: 'pile'` (the promise)
    if (skip.paws === 'both') {
      v.paws = 'both';
      v.lit = n ? 'both' : null;
      v.nextPaw = done ? null : 'both';
    }
    if (skip.paws === 'pile') v.paws = 'pile';
    // chapter 5: her four paws onto the raft, counted in words by whoever keeps the count ("One.
    // Two."; `say`: the newest); nine claws into the log (`anywhere`: any tap counts); the mud count
    if (skip.paws === 'board') {
      v.paws = 'board';
      v.count = totals.map(function (t) { return (COUNT_WORDS[t] || String(t)) + '.'; }).join(' ');
      v.say = n ? (COUNT_WORDS[n * table] || String(n * table)) + '.' : '';
    }
    if (skip.paws === 'log') { v.paws = 'log'; v.anywhere = true; }
    if (skip.paws === 'mud') v.paws = 'mud';
    return v;
  };
  /* A skip-count that keeps the frame's own scene on screen (`paws: 'log'`): the scene after that
   * many taps, with the options of the step reached laid over its own (`steps`: [{ from, opts, sfx }],
   * `from` the tap a step starts at) and `claws`, the taps so far. `sfx` is that step's lettering
   * (the roar, growing), else the frame's own. The story's scene is never changed.
   * Returns { scene, sfx, step } (step: the index of the step reached, -1 before the first). */
  E.skipScene = function (scene, skip, taps, sfx) {
    skip = skip || {};
    var v = E.skipView(skip, taps), steps = asList(skip.steps).filter(isObj), at = -1;
    steps.forEach(function (st, i) { if (v.taps >= Math.max(1, num(st.from, 1) | 0)) at = i; });
    var s = scene ? clone(scene) : null;
    if (s) {
      if (!isObj(s.opts)) s.opts = {};
      for (var i = 0; i <= at; i++) if (isObj(steps[i].opts)) Object.assign(s.opts, steps[i].opts);
      s.opts.claws = v.taps;
    }
    var word = sfx || '';
    for (var k = 0; k <= at; k++) if (typeof steps[k].sfx === 'string') word = steps[k].sfx;
    return { scene: s, sfx: word, step: at };
  };
  /* Whether a skip-count shows the frame's scene, redrawn as she taps, and not a counting picture. */
  E.skipOnScene = function (skip) { return !!skip && skip.paws === 'log'; };
  /* The skip-count's picture, as PC.art.countsPicture takes it (the page adds her `look`), after
   * that many taps: the groups, what is lit, the running totals under them, the next group glowing.
   * Her own forepaws (`paws: 'own'`) take `taps`, `lit` and `nextPaw` and no totals; both together
   * (`paws: 'both'`) are the art's `paws: 'own'` at table 10, with `both: true`; the promise
   * (`paws: 'pile'`) is the art's `paws: 'promise'`, a friend's pair lit by each tap. */
  var SKIP_THINGS = { 2: ['ear', 'ears'], 5: ['claw', 'claws'], 9: ['claw', 'claws'], 10: ['claw', 'claws'] };
  function skipThings(skip, table) {
    var d = skip.paws === 'board' ? ['paw', 'paws'] : skip.paws === 'log' ? ['claw', 'claws'] : SKIP_THINGS[table] || ['thing', 'things'];
    return [skip.thing || d[0], skip.things || d[1]];
  }
  function skipPaws(skip, po, v) {
    if (skip.paws === 'own') { po.paws = 'own'; po.taps = v.taps; po.lit = v.lit; po.nextPaw = v.nextPaw; po.totals = false; }
    else if (skip.paws === 'both') { po.paws = 'own'; po.both = true; po.taps = v.taps; po.lit = v.lit; po.nextPaw = v.nextPaw; po.totals = false; }
    else if (skip.paws === 'pile') { po.paws = 'promise'; po.taps = v.taps; }
    // chapter 5: her four paws (no totals: Tallyheart counts them aloud); nine claws in a log (the
    // scene is the picture: this one is only for a frame with no scene); seven forepaws in the mud,
    // drawn as chapter 3's six were, the first `groups` of them hers to light
    else if (skip.paws === 'board') { po.paws = 'board'; po.taps = v.taps; po.totals = false; }
    else if (skip.paws === 'log') { po.paws = 'log'; po.taps = v.taps; po.totals = false; }
    else if (skip.paws === 'mud') { po.paws = 'mud'; po.kind = 'mud'; po.of = Math.max(E.DRAGONETS, v.groups); }
    // the tuck: how many cats have curled a claw in (`tuck: true` is the art's word for this picture:
    // every claw still out is lit, the next cat glows; `taps` and `tucked` both say how many); no
    // number under any cat (a row of totals would read 9, 18, 27, 36, 45, the lesson's own answers,
    // before its first question)
    if (v.tuck) { po.tuck = true; po.taps = v.tucked; po.tucked = v.tucked; po.totals = false; }
    return po;
  }
  E.skipPicture = function (skip, taps) {
    skip = skip || {};
    var v = E.skipView(skip, taps), t = skipThings(skip, skip.table);
    return skipPaws(skip, { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: !v.done, who: skip.who, thing: t[0], things: t[1] }, v);
  };
  /* The same picture on the pages a skip-count's totals stay on (`keep`): every group lit, nothing glowing.
   * (The tuck: nine claws lit and one dark on every cat, and still no number under any of them.) */
  E.keptPicture = function (skip) {
    skip = skip || {};
    var v = E.skipView(skip, skip.groups), t = skipThings(skip, v.table);
    var po = skipPaws(skip, { table: v.table, groups: v.groups, per: v.per, highlight: v.highlight, totals: true, next: false, who: skip.who, thing: t[0], things: t[1] }, v);
    if (po.nextPaw != null) po.nextPaw = null;
    return po;
  };
  /* The skip-count's words: who keeps the count (the frame's `teacher`; else the player on her own
   * paws or the pile; else whoever speaks first on the frame, `first`; else Tallyheart), whether it
   * is murmured, what is counted, the hidden button for VoiceOver and the panel's label. */
  E.skipWords = function (skip, first) {
    skip = skip || {};
    var paws = skip.paws, mine = paws === 'own' || paws === 'both' || paws === 'pile' || paws === 'log';
    var v0 = E.skipView(skip, 0), t = skipThings(skip, skip.table);
    var w = {
      teacher: skip.teacher || (mine ? 'player' : first || 'tallyheart'),
      whisper: paws === 'own' || paws === 'both',
      thing: t[0], things: t[1],
      label: typeof skip.label === 'string' && skip.label ? skip.label
        : skip.tuck ? 'Tuck in the next cat’s claw.' : paws === 'board' ? 'Put the next paw on the raft.' : paws === 'log' ? 'Dig in the next claw.' : paws === 'mud' ? 'Count the next forepaw.'
        : paws === 'own' ? 'Tap your next forepaw.' : paws === 'both' ? 'Tap your forepaws.' : paws === 'pile' ? 'Count the next friend.'
          : skip.table === 10 ? 'Count the next cat.' : 'Count the next ' + (skip.table === 2 ? 'cat' : skip.table === 5 ? 'paw' : 'one'),
      aria: skip.tuck ? cap1(E.numWord(v0.groups)) + ' cats sitting up, ten claws out on each. Touch the glowing cat to tuck one claw in.'
        : paws === 'board' ? 'Your ' + E.numWord(v0.groups) + ' paws at the raft’s edge. Touch the glowing one.'
        : paws === 'log' ? 'Your two forepaws on a log. Touch anywhere to dig in the next claw.'
        : paws === 'mud' ? cap1(E.numWord(Math.max(E.DRAGONETS, v0.groups))) + ' forepaws in the mud. Touch the glowing one.'
        : paws === 'own' ? 'Your two forepaws on the moss. Touch the glowing one.'
        : paws === 'both' ? 'Your two forepaws on the moss. Touch them.'
          : paws === 'pile' ? cap1(E.numWord(v0.groups * 2)) + ' forepaws in a pile. Touch the glowing pair.'
            : v0.groups === 1 ? 'Counting picture: one group of ' + E.numWord(v0.table) + '. Touch it.'
              : 'Counting picture: ' + E.numWord(v0.groups) + ' groups of ' + E.numWord(v0.table) + '. Touch the glowing one.',
      prompt: typeof skip.prompt === 'string' ? skip.prompt : ''
    };
    // chapter 5: the count in her own thought (the log), or said in words (her paws aboard)
    if (paws === 'log') w.think = true;
    if (paws === 'board') w.words = true;
    // (no big number over these pictures: Tallyheart says her paws aboard, and the mud's forepaws
    // carry their own 5, 10, 15 under them, where the big one would sit on the next to light)
    if (paws === 'board' || paws === 'mud') w.noNumber = true;
    return w;
  };
  /* `keep: true` on a skip: the running totals stay. The page it turns to, the plain pages after
   * that, and the first Counts frame they reach (until its lesson starts) show the skip's counting
   * picture, every group lit, its running totals under the groups ("every number you land on ends
   * in a five or a zero"), in place of their scenes. Returns { id, skip } for such a page, else null. */
  E.keptSkip = function (story, frameId, cat) {
    var F = (story && story.frames) || {};
    for (var id in F) {
      if (!own(F, id) || !F[id] || !F[id].skip || !F[id].skip.keep) continue;
      if (cat && !E.shows(F[id], cat)) continue;   // a count she never reads keeps no picture for her
      var at = cat ? E.landing(cat, story, F[id].skip.next) : F[id].skip.next;
      for (var guard = 0; guard < 32 && at && F[at]; guard++) {
        if (at === frameId) return { id: id, skip: cat ? E.skipFor(F[id].skip, cat) : F[id].skip };
        var k = E.kindOf(F[at]);
        if (k !== 'next') break;
        at = cat ? E.landing(cat, story, F[at].next) : F[at].next;
      }
    }
    return null;
  };
  /* The skip-count a page comes straight after (it shows the number reached, big), or null. A skip
   * with `carry: false` keeps its number to itself, and so does one this cat never reads: a skip
   * frame whose `when` does not match her hands no number on, though the page turn past it lands on
   * the same page (chapter 5's mud count, f148: a cat who met no dragonet today reads the page after
   * it with no number over it). */
  E.skipInto = function (story, frameId, cat) {
    var F = (story && story.frames) || {};
    for (var id in F) {
      if (!own(F, id) || !F[id] || !F[id].skip || F[id].skip.carry === false) continue;
      if (cat && !E.shows(F[id], cat)) continue;
      if ((cat ? E.landing(cat, story, F[id].skip.next) : F[id].skip.next) === frameId) return cat ? E.skipFor(F[id].skip, cat) : F[id].skip;
    }
    return null;
  };
  /* The number that page shows: what the count reached (the tuck: where it stopped, 45). */
  E.skipReached = function (skip) { var v = E.skipView(skip, 1e9); return v.tuck ? v.total : v.groups * v.table; };

  /* ------------------------------------------------------------ scene options from the cat
   * On the `hollow` set, `marks: 'auto'` is one mark per Count she has learned (E.learnedCounts: the
   * Count's own set finished), and `glow: 'auto'` lights each mark whose Count glows in the Training
   * Hollow. On the `den`, `stone: 'auto'` is Riffle's stone where she put it (`flags.ch2Stone`), and
   * `bark: 'auto'` is the cards along her nest's edge: the ones her Case File shows, in its order,
   * each `{ picture, mark }` (chapter 4; a row drawn from a count would show cards she doesn't hold).
   * On any set, a `cards` list (the hollow's row of bark on the sand) is written as a row of bark is,
   * ids and `{ id, when }` entries: the entries that are hers become `{ picture, mark }`, whether or
   * not she holds the card yet (the picture is the story's: what the panel shows her scratching). The
   * story's own scene is never changed: a resolved scene is a copy. */
  E.resolveScene = function (scene, cat, stories) {
    if (!scene || !isObj(scene.opts)) return scene;
    var o = scene.opts;
    if (o.marks !== 'auto' && o.glow !== 'auto' && o.stone !== 'auto' && o.bark !== 'auto' && !Array.isArray(o.cards)) return scene;
    var s = clone(scene);
    if (o.marks === 'auto' || o.glow === 'auto') {
      var counts = E.learnedCounts(cat, stories).slice(0, E.MAX_MARKS);
      var byT = (cat && cat.hollow && cat.hollow.byTable) || {};
      if (s.opts.marks === 'auto') s.opts.marks = counts.length;
      if (s.opts.glow === 'auto') s.opts.glow = counts.map(function (c) { return !!(byT[c.table] && byT[c.table].glow); });
    }
    // the den's `stone: 'auto'`: Riffle's stone where she put it in her nest (chapter 2's f108 sets
    // `ch2Stone`, 'nose' or 'chin'); not chosen yet, between her paws
    if (o.stone === 'auto') {
      var put = cat && isObj(cat.flags) ? cat.flags.ch2Stone : null;
      s.opts.stone = put === 'nose' || put === 'chin' ? put : true;
    }
    // `bark: 'auto'`: her Case File along the mossy edge of her nest, her own cards in her file's order
    if (o.bark === 'auto') s.opts.bark = E.cards(cat, stories).map(function (c) { return { picture: c.picture, mark: c.mark }; });
    // a `cards` list: the row as the story lays it, without the entries that are not this cat's
    if (Array.isArray(o.cards)) {
      s.opts.cards = E.frameCards({ card: o.cards }, cat).map(function (c) {
        var def = E.cardDef(c.id, null, stories) || {};
        return { picture: typeof def.picture === 'string' && def.picture ? def.picture : c.id, mark: def.mark === 'ear' ? 'ear' : 'eye' };
      });
    }
    return s;
  };

  /* ------------------------------------------------------------ the Counts runner
   * A lesson is plain data, so it can be saved mid-lesson and resumed:
   *   state = { set, table, queue: [{a,b,retry,filler?,hard?, …}], pos, requeues: {"3x1": n}, log: [],
   *             lines, missed, pool?, asked?, avoid? }
   * question(state) -> the fact to ask now, or null when the lesson is over.
   * answer(state, def, value, ms, now) -> what happened (and the state moves on).
   * A miss shows help, reveals the answer, and puts the fact back exactly two questions later, at
   * most twice per fact. Near the end of a lesson there may be fewer than two questions left, so
   * filler questions are added first: from the set named by `fillFrom` (her right answers there,
   * then its facts; carried in state.pool), else facts she already got right in this lesson, else
   * other facts from it already asked. A fact still ahead in the queue is never a filler (it would
   * be asked twice running), and while there is another to take, a filler is never a pair this
   * lesson has asked already, nor one its sibling sets (the pile and the check: the sets of the
   * chapter that borrow from the same set) asked in this reading (state.asked), nor one the set
   * avoids (state.avoid: chapter 3's warm-up stays off the pile's pairs). An avoided pair comes last
   * of all, after every other pair (chapter 2 has none, so it borrows as it did); so does one of the
   * lesson's own pairs in a set that borrows the easiest (state.own, chapter 4: with its fresh pairs
   * used up, the pile lends 1 × 10 and 5 × 10 again, never its own rows as 10 × 3). A borrowed filler
   * carries `from`, its lending set: it is asked in that set's picture and words, with that set's
   * praise (E.questionDef). With too few fillers the retry comes back as late as it can. Nothing
   * ever blocks: every answer moves the lesson forward.
   * A fact is [a, b] or { a, b, table?, groups?, per?, picture?, who?, lit?, light?, prompt?,
   * retryPrompt?, right?, rightAgain?, rightPicture?, check?, hard? }.
   * Chapter 5: a set may carry `light` itself (`light: 'tuck'` on the nines: every first ask and every
   * retry gets it, a fact's own wins, a filler never does); `fillOrder: 'easiest'` with no `fillFrom`
   * fills a lesson's own gaps with the easiest of her right answers, not the latest (state.easiest);
   * a fact may carry its own `miss` and `missLast` lines, and `shows: { kind: 'answers', of: [[2, 9]],
   * also: 'One and eight make nine. ' }`: with its `right` line and with its miss line the page draws
   * her answers scratched in the sand, this fact's and each of `of` she has answered right with no
   * ask of it still ahead (res.shows), and `{also}` in those lines is the `also` words when every one
   * of `of` is there, else nothing. state.shown is set from then on (the nines' digits line waits
   * for it: res.notNine). */
  function factKey(a, b) { return a + 'x' + b; }
  function pairKey(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }   // 9×1 and 1×9 are one fact
  function groupsFor(a, b, table) {
    // the picture: `groups` cats each carrying `per` things (for the 1s, n cats, one tail each)
    if (table && b === table) return { groups: a, per: b };
    if (table && a === table) return { groups: b, per: a };
    return { groups: a, per: b };
  }
  /* A fact's own keys. `who` puts characters in the picture's places (the rim cats); `lit` is how
   * many things glow as it is asked (2 × 6: the first five cats' ten ears); `light: 'groups'`
   * lights the picture a group at a time as it is asked, with no number (the pile's stacks, or the
   * check's two rows); `check: true` goes on its log entry (E.hardFacts skips a right one). */
  var FACT_KEYS = ['table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'prompt', 'retryPrompt', 'right', 'rightAgain', 'rightPicture', 'miss', 'missLast', 'shows'];
  // a retry is pictured the same and asked plainly, unless the fact keeps a prompt for it (retryPrompt)
  var RETRY_KEYS = ['table', 'groups', 'per', 'picture', 'who', 'lit', 'light', 'check', 'rightPicture', 'miss', 'missLast', 'shows'];
  var LIGHTS = ['groups', 'rows', 'tuck'];
  function normFact(f) {
    if (Array.isArray(f)) return { a: +f[0], b: +f[1], retry: false };
    var item = { a: +f.a, b: +f.b, retry: false };
    if (f.hard) item.hard = true;
    FACT_KEYS.forEach(function (k) { if (f[k] != null) item[k] = clone(f[k]); });
    return item;
  }
  function copyKeys(from, to, keys) { keys.forEach(function (k) { if (from[k] != null) to[k] = clone(from[k]); }); return to; }
  var C = {};
  C.start = function (def, opts) {
    opts = opts || {};
    var facts = opts.facts || def.facts || [];
    var st = {
      set: opts.set || def.id || null,
      table: def.table || null,
      mode: opts.mode || 'chapter',
      queue: facts.map(normFact),
      pos: 0,
      requeues: {},
      log: [],
      lines: { praise: 0, fast: 0, again: 0, fastLast: false },
      missed: false,
      startedAt: opts.now || 0
    };
    if (Array.isArray(opts.pool) && opts.pool.length) st.pool = opts.pool.map(function (p) { return copyKeys(p, { a: +p.a, b: +p.b }, ['table', 'from']); });
    // the pairs this lesson's sibling sets have asked in this reading (a filler skips them while it can)
    if (Array.isArray(opts.asked) && opts.asked.length) st.asked = opts.asked.slice();
    // the pairs the set avoids (`avoid`): a filler takes them only when nothing else is left
    if (Array.isArray(opts.avoid) && opts.avoid.length) st.avoid = opts.avoid.slice();
    // chapter 4: the lesson's own pairs, for a set that borrows the easiest (`fillOrder: 'easiest'`):
    // it never lends one of its own questions back, the other way round, while another pair is left
    // (the pile's 3 × 10 and 2 × 10 never come back as 10 × 3 and 10 × 2)
    if (Array.isArray(opts.own) && opts.own.length) st.own = opts.own.slice();
    // chapter 5: a set's own `light` goes on every question it asks first (a fact's own wins; a retry
    // keeps it, a filler has none); and a lesson that fills its own gaps with the easiest
    if (LIGHTS.indexOf(def.light) >= 0) st.queue.forEach(function (it) { if (it.light == null) it.light = def.light; });
    if (def.fillOrder === 'easiest' && !def.fillFrom) st.easiest = true;
    return st;
  };
  C.done = function (st) { return !st || st.pos >= st.queue.length; };
  /* The count of a miss goes up by the Count's table (2, 4, 6… for the 2s) when the picture's
   * groups divide that way, else by one. */
  function stepFor(table, per) { return table > 1 && per % table === 0 ? table : 1; }
  C.question = function (st) {
    if (C.done(st)) return null;
    var q = st.queue[st.pos];
    var table = q.table || st.table || null;
    var g = groupsFor(q.a, q.b, table);
    if (typeof q.groups === 'number') g.groups = q.groups;
    if (typeof q.per === 'number') g.per = q.per;
    var first = !q.retry && !q.filler;
    return {
      a: q.a, b: q.b, answer: q.a * q.b, retry: !!q.retry, filler: !!q.filler, hard: !!q.hard,
      from: q.from || null,
      number: st.pos + 1, total: st.queue.length,
      groups: g.groups, per: g.per, table: table,
      picture: q.picture || null,
      who: Array.isArray(q.who) ? q.who : null,
      lit: Math.max(0, num(q.lit, 0) | 0),
      light: LIGHTS.indexOf(q.light) >= 0 ? q.light : null,
      // a retry is asked plainly ("Here's that one again." and the generic question) unless the
      // fact keeps a prompt for it (2 × 6's hop on from ten, the check's "Two rows of eight.")
      prompt: first ? (q.prompt != null ? q.prompt : null) : (q.retry && q.retryPrompt != null ? q.retryPrompt : null),
      right: first && q.right != null ? q.right : null,
      rightPicture: q.rightPicture || null,
      step: stepFor(table || 1, g.per)
    };
  };
  C.ask = function (def, q) {
    return E.fill(def.ask || '{a} × {b}', null, { a: q.a, b: q.b });
  };
  /* Up to n facts to ask between a miss and its retry when the lesson is nearly over (see above).
   * Never the missed pair or one still ahead; first, nothing already asked (in this lesson, or by a
   * sibling set in this reading: state.asked) and nothing the set avoids (state.avoid); then, if that
   * leaves too few, the next pair in order that the set doesn't avoid (chapter 2's rule as it shipped:
   * with no `avoid`, these two passes are exactly its fresh-then-anything); and last an avoided pair. */
  function fillers(st, q, n) {
    var miss = pairKey(q.a, q.b), out = [], taken = {}, asked = {}, avoided = {};
    taken[miss] = true;
    for (var k = st.pos + 1; k < st.queue.length; k++) taken[pairKey(st.queue[k].a, st.queue[k].b)] = true;
    // (chapter 5, a lesson that fills its own gaps with the easiest: every candidate is a pair it has
    // asked, so "fresh" there is a pair not yet used to fill a gap: after a second miss she gets the
    // next two easy ones, 3 × 9 and 4 × 9, not 9 × 1 and 2 × 9 again)
    st.log.forEach(function (e) { if (!st.easiest || e.filler) asked[pairKey(e.a, e.b)] = true; });
    (st.asked || []).forEach(function (key) { asked[key] = true; });
    (st.avoid || []).forEach(function (key) { avoided[key] = true; });
    (st.own || []).forEach(function (key) { avoided[key] = true; });
    var cands = [], rights = [];
    (st.pool || []).forEach(function (p) { cands.push({ a: p.a, b: p.b, table: p.table, from: p.from }); });
    for (var i = st.log.length - 1; i >= 0; i--) {
      var e = st.log[i];
      if (e.correct) rights.push({ a: e.a, b: e.b, table: e.table, i: rights.length });
    }
    // chapter 5 (state.easiest): the easiest of her right answers first, not the latest (a missed
    // 9 × 9, the last and hardest, is followed by 9 × 1 and 2 × 9, never 7 × 9 and 5 × 9)
    if (st.easiest) rights.sort(function (x, y) { return x.a * x.b - y.a * y.b || x.i - y.i; });
    rights.forEach(function (r) { cands.push({ a: r.a, b: r.b, table: r.table }); });
    for (var j = 0; j <= st.pos && j < st.queue.length; j++) {
      var it = st.queue[j];
      if (!it.retry && !it.filler) cands.push({ a: it.a, b: it.b, table: it.table });
    }
    // three passes: fresh pairs; then anything but an avoided pair, in order; and only then an
    // avoided one (st.avoid: the pile's 9 × 2 and 7 × 2 at chapter 3's warm-up)
    [0, 1, 2].forEach(function (pass) {
      cands.forEach(function (c) {
        var key = pairKey(c.a, c.b);
        if (out.length >= n || taken[key] || (pass < 2 && avoided[key]) || (pass < 1 && asked[key])) return;
        taken[key] = true;
        var f = { a: c.a, b: c.b, retry: false, filler: true };
        if (c.table && c.table !== st.table) f.table = c.table;
        if (c.from) f.from = c.from;
        out.push(f);
      });
    });
    return out;
  }
  /* The retry of a missed fact: pictured the same; its retryPrompt (true: the fact's own prompt)
   * and its rightAgain lines (true: its `right` lines; by default, a fact whose picture regroups
   * after a right answer keeps its `right` lines, which say why the picture moved). */
  function retryOf(q) {
    var r = copyKeys(q, { a: q.a, b: q.b, retry: true }, RETRY_KEYS);
    var rp = q.retryPrompt === true ? q.prompt : q.retryPrompt;
    if (rp != null && rp !== false) r.retryPrompt = clone(rp);
    var ra = q.rightAgain === true ? q.right : q.rightAgain;
    if (ra == null && q.rightPicture && q.right != null) ra = q.right;
    if (ra != null && ra !== false) r.rightAgain = clone(ra);
    if (q.from) r.from = q.from;
    return r;
  }
  /* Chapter 5, `shows: { kind: 'answers', of, also }`: her answers scratched in the sand as this fact
   * is answered: each pair of `of` she has answered right in this lesson with no ask of it still ahead
   * (a retry of 2 × 9 still to come keeps eighteen off the sand), then this fact's own. `all`: every
   * one of `of` is there (so the fact's lines may say the `also` words about them). */
  function shownAnswers(st, q) {
    var mine = pairKey(q.a, q.b), ahead = {}, right = {}, out = [], all = true;
    for (var k = st.pos + 1; k < st.queue.length; k++) ahead[pairKey(st.queue[k].a, st.queue[k].b)] = true;
    st.log.forEach(function (e) { if (e.correct) right[pairKey(e.a, e.b)] = true; });
    asList(q.shows.of).forEach(function (f) {
      var p = factPair(f), key = pairKey(p[0], p[1]);
      if (!(p[0] >= 0 && p[1] >= 0) || key === mine) return;
      if (right[key] && !ahead[key]) out.push(p[0] * p[1]); else all = false;
    });
    out.push(q.a * q.b);
    return { answers: out, all: all };
  }
  function digitSum(n) { var t = 0; String(Math.abs(n | 0)).split('').forEach(function (d) { t += +d; }); return t; }
  /* Lines tied to one question, as balloons: a string is the teacher's. */
  function balloonList(x) {
    return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; });
  }
  C.answer = function (st, def, value, ms, now) {
    if (C.done(st)) return null;
    def = def || {};
    var q = st.queue[st.pos];
    var qq = C.question(st);
    var right = q.a * q.b;
    var n = typeof value === 'number' ? value : parseInt(String(value == null ? '' : value).replace(/\D/g, ''), 10);
    var given = isNaN(n) ? null : n;
    var correct = given === right;
    ms = Math.max(0, Math.round(+ms || 0));
    var entry = {
      set: st.set, a: q.a, b: q.b, answer: given, correct: correct, ms: ms,
      helped: !correct, retry: !!q.retry, at: now || 0
    };
    if (q.filler) entry.filler = true;
    if (q.from) entry.from = q.from;   // a borrowed question: the set it came from
    // a check (the pile's 8 × 2 and 2 × 8): its clock runs while she reads, and "sixteen" is on
    // screen by then, so a right one never makes the fact hard or easy (E.hardFacts)
    if (q.check) entry.check = true;
    if (q.table && q.table !== st.table) entry.table = q.table;   // a fact from another Count (mixed lessons)
    // "after a miss" lines are true only once a miss has happened in this lesson
    var missedBefore = !!st.missed || st.log.some(function (e) { return !e.correct; });
    // chapter 5: whether the lesson had shown her answers in the sand before this one (the nines'
    // digits line waits for it), and what this fact shows with its right line or its miss line
    var shownBefore = !!st.shown;
    var shows = isObj(q.shows) && (!correct || !q.retry) ? shownAnswers(st, q) : null;
    st.log.push(entry);
    var res = { correct: correct, right: right, fast: correct && ms < E.FAST_MS, entry: entry, requeued: false, line: '', lineKind: '' };
    var L = st.lines || (st.lines = { praise: 0, fast: 0, again: 0, fastLast: false });
    if (correct) {
      if (q.rightPicture) res.rightPicture = clone(q.rightPicture);
      // after a miss in this lesson (and only then) the fastAfterMiss lines lead, taking turns with the fast ones
      var afterMiss = missedBefore && def.fastAfterMiss && def.fastAfterMiss.length ? asList(def.fastAfterMiss) : null;
      var fastLines = afterMiss ? afterMiss.concat(asList(def.fast)) : (def.fast && def.fast.length ? asList(def.fast) : null);
      if (q.retry && q.rightAgain != null) {
        // this question's own lines for a right retry (the old tom's "Hmph."; 5 × 2's same ten)
        res.balloons = clone(balloonList(q.rightAgain));
        res.lineKind = 'right'; L.fastLast = false;
      } else if (q.retry) {
        res.line = pick(def.again || ['There it is. You remembered that one.', 'Yes! That one came back, and you knew it.'], L.again++);
        res.lineKind = 'again'; L.fastLast = false;
      } else if (q.hard) {
        // the Hollow (and an adaptive warm-up) remembers what was hard last time: "Not today!" only
        // when it was quick today; right but slow again, it is getting easier
        var ri = L.remembered || 0; L.remembered = ri + 1;
        if (res.fast) {
          res.line = pick(def.remembered || 'Last time {a} × {b} made you stop and think. Not today!', ri);
          res.lineKind = 'remembered';
        } else {
          res.line = pick(def.rememberedSlow || '{a} × {b} again, and you got it. It’s getting easier.', ri);
          res.lineKind = 'rememberedSlow';
        }
        L.fastLast = false;
      } else if (qq.right) {
        // this question's own lines, in place of praise (the story goes on in them)
        res.balloons = clone(balloonList(qq.right));
        res.lineKind = 'right'; L.fastLast = false;
      } else if (res.fast && fastLines && !L.fastLast) {
        var fi = afterMiss ? (L.fastAfter || 0) : L.fast;
        if (afterMiss) L.fastAfter = fi + 1; else L.fast++;
        res.line = pick(fastLines, fi); res.lineKind = 'fast'; L.fastLast = true;
      } else {
        res.line = pick(def.praise || ['Yes!'], L.praise++); res.lineKind = 'praise'; L.fastLast = false;
      }
      res.line = fillFact(res.line, q);
    } else {
      L.fastLast = false;
      st.missed = true;
      res.lineKind = 'miss';
      res.help = { a: q.a, b: q.b, answer: right, groups: qq.groups, per: qq.per };
      // `near`: one hop of the count off (|answer − right| ≤ step: 1 on the 1s, 2 on the 2s, the hop
      // the sand counts in), or exactly one group off (a row of eight on the check: one row counted,
      // or three), when the help opens on "Close." (the set's helpIntro). Not anything within a
      // row: 10 or 24 for the check's 16 is not close.
      var off = given != null ? Math.abs(given - right) : null;
      res.near = off != null && (off <= Math.max(1, qq.step) || off === qq.per);
      // on the 5s, an answer that ends in neither 5 nor 0 (34 for 7 × 5) gets the five-or-zero
      // reminder first (a set's helpIntroNotFive)
      if (qq.table === 5 && given != null && given % 5 !== 0) res.notFive = true;
      // and on the 10s, one that doesn't end in a zero (13 for 3 × 10, 34 for 10 × 3) gets the zero
      // rule first (a set's helpIntroNotTen)
      if (qq.table === 10 && given != null && given % 10 !== 0) res.notTen = true;
      // chapter 5, the 9s (one claw tucked in): she typed the tens (the hop without the tuck: 40 for
      // 4 × 9), she tucked one claw only (39; two cats or more), or her answer's two numbers don't make
      // nine (never on 9 × 1, and only once the lesson has shown her that they should: state.shown;
      // in the Training Hollow, always). The set's helpIntroTens, helpIntroOneTuck, helpIntroNotNine.
      if (qq.table === 9 && qq.per === 9 && given != null) {
        if (given === qq.groups * 10) res.tens = true;
        if (qq.groups >= 2 && given === qq.groups * 10 - 1) res.oneTuck = true;
        if (right !== 9 && digitSum(given) !== 9 && (st.mode === 'hollow' || shownBefore)) res.notNine = true;
      }
      if (qq.table && qq.table !== 1) res.help.table = qq.table;
      if (qq.step !== 1) res.help.step = qq.step;
      var key = factKey(q.a, q.b);
      var used = st.requeues[key] || 0;
      if (used < E.MAX_REQUEUE) {
        st.requeues[key] = used + 1;
        // exactly REQUEUE_GAP questions between the miss and its retry: pad the end when it is near
        var left = st.queue.length - (st.pos + 1);
        if (left < E.REQUEUE_GAP) st.queue.push.apply(st.queue, fillers(st, q, E.REQUEUE_GAP - left));
        var at = Math.min(st.pos + 1 + E.REQUEUE_GAP, st.queue.length);
        var back = retryOf(q);
        // chapter 5: every retry in a lesson whose set has a `light` plays it (the nines' hop and
        // tuck), the retry of a missed filler of its own too: a filler itself shows the still
        // picture, but she has just watched the two steps in the sand. Not a borrowed pair (another
        // set's picture), and never in the Hollow (its definition has no `light`).
        if (back.light == null && !q.from && LIGHTS.indexOf(def.light) >= 0) back.light = def.light;
        st.queue.splice(at, 0, back);
        res.requeued = true;
      }
      // "we'll come back to that one" only when it really comes back (chapter 5: a fact may have
      // miss lines of its own, 4 × 9's "Thirty-six. Now look. …")
      res.line = res.requeued ? pick(q.miss != null ? q.miss : (def.miss || 'There. We\'ll come back to that one.'), 0)
        : pick(q.missLast != null ? q.missLast : (def.missLast || 'There. Now you’ve seen it counted.'), 0);
      res.line = fillFact(res.line, q);
    }
    if (isObj(q.shows)) {
      // `{also}` in this fact's lines: the words about the other answers, when they are all in the sand
      var also = shows && shows.all && typeof q.shows.also === 'string' ? q.shows.also : '';
      var put = function (t) { return String(t == null ? '' : t).replace(/\{also\}/g, also).replace(/ {2,}/g, ' ').replace(/^ +| +$/g, ''); };
      if (res.balloons) res.balloons.forEach(function (b) { b.text = put(b.text); });
      res.line = put(res.line);
      if (shows) { res.shows = { kind: 'answers', answers: shows.answers }; st.shown = true; }
    }
    st.pos++;
    res.done = C.done(st);
    return res;
  };
  C.summary = function (st) {
    var log = st.log;
    var seen = {}, firstRight = 0, facts = 0;
    log.forEach(function (e) {
      var k = factKey(e.a, e.b);
      if (!seen[k]) { seen[k] = true; facts++; if (e.correct) firstRight++; }
    });
    var helped = log.filter(function (e) { return e.helped; }).length;
    return {
      set: st.set, mode: st.mode,
      answers: log.length,
      correct: log.filter(function (e) { return e.correct; }).length,
      fast: log.filter(function (e) { return e.correct && e.ms < E.FAST_MS; }).length,
      facts: facts, firstTry: firstRight, helped: helped, noHelp: helped === 0,
      finished: C.done(st)
    };
  };
  E.counts = C;

  /* A chapter's Counts set by id: this story's first, then any chapter's. */
  E.countsSet = function (setId, story, stories) {
    if (story && story.counts && story.counts[setId]) return story.counts[setId];
    var list = storyList(stories);
    for (var i = 0; i < list.length; i++) if (list[i].counts && list[i].counts[setId]) return list[i].counts[setId];
    return null;
  };
  /* The facts a chapter lesson asks, after `warmHard` adapts them: if E.hardFacts(cat, table) has a
   * fact (passing over the set's `avoid` pairs, either way round: none left, nothing is hard), it
   * takes position `at` (marked hard, so a right answer earns the `remembered` line).
   * `alt` as one pair (chapter 2's): another fact that is the same pair as the hard one becomes it.
   * `alt` as an ordered list (chapter 3's): the opener is replaced when its pair is the hard fact's or
   * one of her top hard facts (E.hardFacts(…).slice(0, E.HARD_PER_ROUND)), by the first entry whose
   * pair is not the hard fact's, not one of those, and not in `avoid`; if none is, the first that
   * isn't the hard fact's pair. So she never opens on a hard fact, nor meets one pair twice running. */
  function factPair(f) { return Array.isArray(f) ? [+f[0], +f[1]] : isObj(f) ? [+f.a, +f.b] : [NaN, NaN]; }
  function pairSet(list) {
    var out = {};
    asList(list).forEach(function (f) { var p = factPair(f); if (p[0] >= 0 && p[1] >= 0) out[pairKey(p[0], p[1])] = true; });
    return out;
  }
  // a list of pairs ([[2, 3], [2, 2]]), not one pair ([1, 3])
  function altList(alt) { return Array.isArray(alt) && alt.length > 0 && (Array.isArray(alt[0]) || isObj(alt[0])); }
  E.lessonFacts = function (cat, def, stories) {
    var facts = (def.facts || []).slice();
    var w = def.warmHard;
    if (!isObj(w) || !facts.length) return facts;
    // chapter 5: the hard pick may have an `avoid` list of its own (`warmHard.avoid`), read in place
    // of the set's (which then only governs the questions it borrows: 4 × 10 may be the hard pick)
    var avoid = pairSet(w.avoid != null ? w.avoid : def.avoid);
    var all = E.hardFacts(cat, w.table || def.table || 1, stories);
    var hard = all.filter(function (f) { return !avoid[pairKey(f[0], f[1])]; })[0];
    if (!hard) return facts;
    var at = Math.max(0, Math.min(facts.length - 1, num(w.at, 0) | 0));
    var hk = pairKey(hard[0], hard[1]);
    if (!altList(w.alt)) {
      return facts.map(function (f, i) {
        if (i === at) return { a: hard[0], b: hard[1], hard: true };
        var p = factPair(f);
        if (pairKey(p[0], p[1]) === hk && w.alt) return clone(w.alt);
        return f;
      });
    }
    var top = {};
    all.slice(0, E.HARD_PER_ROUND).forEach(function (f) { top[pairKey(f[0], f[1])] = true; });
    var alts = w.alt.filter(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; });
    var pk = function (f) { var p = factPair(f); return pairKey(p[0], p[1]); };
    var pickAlt = alts.filter(function (f) { var k = pk(f); return k !== hk && !top[k] && !avoid[k]; })[0] ||
      alts.filter(function (f) { return pk(f) !== hk; })[0] || null;
    return facts.map(function (f, i) {
      if (i === at) return { a: hard[0], b: hard[1], hard: true };
      var k = pk(f), opener = i === 0;
      if (pickAlt && (k === hk || (opener && top[k]))) return clone(pickAlt);
      return f;
    });
  };
  /* The fillers a set lends another (its `fillFrom`): her right answers there, most recent first,
   * then its facts. Each carries `from: setId`, so it is asked as that set's question. `order:
   * 'easiest'` (the borrowing set's `fillOrder`) sorts them by product instead, smallest first (a
   * missed dinner under the bridge borrows 1 × 5 and 5 × 3, never the lesson's 10 × 5 and 7 × 5). */
  E.EASIEST_POOL = 5;
  E.fillPool = function (cat, setId, stories, order) {
    var out = [], seen = {};
    function add(a, b, table) {
      var k = pairKey(a, b);
      if (seen[k] || !(a > 0) || !(b > 0)) return;
      seen[k] = true;
      var p = { a: a, b: b };
      if (table) p.table = table;
      p.from = setId;
      out.push(p);
    }
    var log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) { var e = log[i]; if (e && e.set === setId && e.correct && !e.filler) add(+e.a, +e.b, e.table); }
    var def = E.countsSet(setId, null, stories);
    (def && def.facts || []).forEach(function (f) {
      if (Array.isArray(f)) add(+f[0], +f[1]);
      else if (isObj(f)) add(+f.a, +f.b, f.table);
    });
    if (order === 'easiest') {
      out = out.map(function (p, i) { return { p: p, i: i }; })
        .sort(function (x, y) { return x.p.a * x.p.b - y.p.a * y.p.b || x.i - y.i; })
        .map(function (x) { return x.p; });
    }
    return out;
  };
  /* The pairs a borrowing set and its siblings (the sets of its chapter that borrow from the same
   * set: the pile and the check) have asked in this reading, fillers included: the cat's latest run
   * of their answers, back to the last answer from another lesson of the chapter (the ears lesson
   * before the pile). Answers from elsewhere (a Hollow round, chapter 1 read again) don't end the
   * run. A borrowed question skips these while there is another to take. */
  E.siblingAsked = function (cat, story, setId) {
    var counts = (story && story.counts) || {}, def = counts[setId];
    if (!def || !def.fillFrom) return [];
    var sets = {};
    Object.keys(counts).forEach(function (id) { if (counts[id] && counts[id].fillFrom === def.fillFrom) sets[id] = true; });
    sets[setId] = true;
    var out = [], seen = {}, log = (cat && cat.counts) || [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (!e) continue;
      if (sets[e.set]) { var k = pairKey(e.a, e.b); if (!seen[k]) { seen[k] = true; out.push(k); } continue; }
      if (counts[e.set]) break;
    }
    return out;
  };
  /* Start a chapter lesson: the set's definition (with its id) and a fresh lesson state. */
  E.chapterLesson = function (cat, story, setId, now, stories) {
    var raw = E.countsSet(setId, story, stories) || {};
    var def = Object.assign({ id: setId }, raw);
    var opts = { facts: E.lessonFacts(cat, def, stories || story), set: setId, mode: 'chapter', now: now };
    if (def.fillFrom) {
      opts.pool = E.fillPool(cat, def.fillFrom, stories || story, def.fillOrder);
      // 'easiest' (Sprinkle's dinner and the six): only the five easiest, so a child who has just
      // missed twice is never handed the lesson's hardest (7 × 5, 5 × 8, 9 × 5); when those five are
      // used up, an easy pair comes round again
      if (def.fillOrder === 'easiest') opts.pool = opts.pool.slice(0, E.EASIEST_POOL);
      opts.asked = E.siblingAsked(cat, story, setId);
      // `avoid` (the warm-up stays off the pile's pairs): what it borrows passes over them too,
      // while the pool has any other pair, fresh or not (state.avoid; fillers() takes them last)
      opts.avoid = Object.keys(pairSet(def.avoid));
      // ... and, borrowing the easiest with an `avoid` list (chapter 4's four), never one of its own
      // questions the other way round. Chapter 3's two such sets have no `avoid`: they borrow
      // exactly as they did (Sprinkle's dinner, missed four times, still lends 5 × 2)
      if (def.fillOrder === 'easiest' && opts.avoid.length) opts.own = Object.keys(pairSet(opts.facts));
    }
    return { def: def, state: C.start(def, opts) };
  };
  /* The set a question is asked as: a borrowed filler (or its retry) is its lending set's question,
   * in that set's picture and words, with its praise and fast lines; anything else, the lesson's
   * own. The UI asks with it and passes it to E.counts.answer.
   * A borrowing set with `fillVoice: 'borrower'` (Sprinkle's two under the bridge) keeps its own
   * voice: a borrowed question takes only the lending set's picture (VOICE_PICTURE) and everything
   * said (teacher, praise, fast, again, miss, the help's lines and who counts) is the borrower's.
   * Chapter 5, `fillPicture: 'borrower'` beside it: a borrowed pair takes nothing from its lender but
   * the pair. It is drawn and worded as the borrowing set's own ("One answer. How many fish?"). */
  var VOICE_PICTURE = ['table', 'thing', 'things', 'unit', 'units', 'picture', 'who'];
  E.questionDef = function (def, q, story, stories) {
    if (!q || !q.from || (def && def.id === q.from)) return def;
    var lend = E.countsSet(q.from, story, stories);
    if (!lend) return def;
    if (def && def.fillVoice === 'borrower') {
      var out = Object.assign({}, def, { id: q.from, voice: def.id });
      if (def.fillPicture !== 'borrower') VOICE_PICTURE.forEach(function (k) { if (lend[k] != null) out[k] = lend[k]; else delete out[k]; });
      ['firstPrompt', 'prompt', 'facts', 'warmHard'].forEach(function (k) { delete out[k]; });
      return out;
    }
    return Object.assign({ id: q.from }, lend);
  };
  /* ------------------------------------------------------------ what the page says around a question
   * Pure, so Node can test the words: the question as asked (E.promptLines), the generic question
   * ("Three cats. How many tails?"), and the help after a miss (E.helpPlan). `def` is the lesson's
   * set, `D` the set the question is asked as (E.questionDef). Lines are { who, text, kind? } (a
   * line of kind 'caption' is narration); a question's own tokens ({a} {b} {answer} {groups} {per}
   * {thing} {things}) are filled here, the cat's ({name}…) are left for the page. */
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  E.numWord = function (n) { return NUMW[n] || String(n); };
  function pictureOf(D, q) { return Object.assign({}, (D && D.picture) || {}, (q && q.picture) || {}); }
  function fillQ(text, D, q) {
    var x = { a: q.a, b: q.b, answer: q.answer != null ? q.answer : q.a * q.b, groups: q.groups, per: q.per,
      thing: (D && D.thing) || 'tail', things: (D && D.things) || 'tails' };
    return String(text == null ? '' : text).replace(/\{([A-Za-z]+)\}/g, function (m, k) { return own(x, k) ? String(x[k]) : m; });
  }
  /* "Three cats. How many tails?": a group is a cat unless the set says otherwise (the pile's
   * pairs, the bridge's forepaws); a picture in rows is counted in rows ("Two rows of eight."). */
  E.genericQuestion = function (D, q) {
    D = D || {};
    var things = D.things || 'tails';
    if (pictureOf(D, q).layout === 'rows') return cap1(E.numWord(q.groups)) + ' ' + (q.groups === 1 ? 'row' : 'rows') + ' of ' + E.numWord(q.per) + '. How many ' + things + '?';
    var unit = D.unit || 'cat', units = D.units || (D.unit ? D.unit + 's' : 'cats');
    return cap1(E.numWord(q.groups)) + ' ' + (q.groups === 1 ? unit : units) + '. How many ' + things + '?';
  };
  E.teacherOf = function (def, D) { return (D && D.teacher) || (def && def.teacher) || 'tallyheart'; };
  /* Chapter 5: a silent set (`teacher: 'caption'`, Wisp's riddle) has nobody to say its lines: every
   * line the engine words itself is lettered as a caption. E.spoken(who, text) is such a line as the
   * page takes it: a balloon of `who`'s, or a caption. */
  E.spoken = function (who, text, kind) {
    if (who === 'caption') return { text: text, kind: 'caption' };
    var l = { who: who, text: text };
    if (kind) l.kind = kind;
    return l;
  };
  /* What is said before she answers: the question's own prompt (a line, or balloons from anyone),
   * else the set's firstPrompt (its first question), its prompt, or the generic question. A retry:
   * the set's `againIntro` ("Here’s that one again.") and the generic question, or the prompt the fact
   * keeps for it. A borrowed question: the borrowing set's `fillIntro` ("One from yesterday."), then
   * its own lesson's generic question. */
  E.promptLines = function (def, D, q) {
    def = def || {}; D = D || def;
    var teacher = E.teacherOf(def, D), silent = teacher === 'caption';
    var by = function (text) { return silent ? { text: text, kind: 'caption' } : { who: teacher, text: text }; };
    // an opening line and the question after it: one balloon; in a silent set, a caption each
    var two = function (lead, question) { return silent ? [by(lead), by(question)] : [by(lead + ' ' + question)]; };
    var lines = function (x) {
      return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; })
        .map(function (b) { return b.kind === 'caption' || (silent && !b.who) ? { text: fillQ(b.text, D, q), kind: 'caption' } : { who: b.who || teacher, text: fillQ(b.text, D, q), kind: b.kind }; });
    };
    if (q.retry) {
      // a borrowed question coming back under the bridge isn't "my dinner again": it opens as it did,
      // in the borrower's words ("Count another one with me.")
      var lentBack = q.from && def.fillVoice === 'borrower' && def.id !== q.from && def.fillIntro;
      var again = lentBack ? def.fillIntro : (D.againIntro || 'Here’s that one again.');
      if (typeof q.prompt === 'string') return two(again, fillQ(q.prompt, D, q));
      if (q.prompt != null) return [by(again)].concat(lines(q.prompt));
      return two(again, E.genericQuestion(D, q));
    }
    if (q.filler && q.from && def.fillIntro) return two(def.fillIntro, E.genericQuestion(D, q));
    if (q.prompt != null) {
      if (typeof q.prompt === 'string') return [by(fillQ(q.prompt, D, q))];
      return lines(q.prompt);
    }
    if (D.firstPrompt && q.number === 1) return [by(fillQ(D.firstPrompt, D, q))];
    if (D.prompt) return [by(fillQ(D.prompt, D, q))];
    return [by(E.genericQuestion(D, q))];
  };
  /* Where the help is scratched: the lesson set's `ground` ('sand', 'earth', 'mud', and chapter 4's
   * 'grit', the tower roof); else, for a borrowed question, earth when the borrowing set's own picture
   * is prey (the pile scratches a borrowed ears question in the earth beside it), else sand; for its
   * own question, earth for prey, mud for a picture drawn in the mud, grit for one scratched in the
   * grit (`kind: 'grit'`, or a picture's own `ground`), else sand. The Training Hollow is always sand.
   * Chapter 5: 'log' (a log of the otters' raft: out on the river there is no sand, and the marsh's
   * mud is ReedClan's). */
  E.GROUNDS = ['sand', 'earth', 'mud', 'grit', 'log'];
  E.helpGround = function (def, D, q) {
    def = def || {};
    if (E.GROUNDS.indexOf(def.ground) >= 0) return def.ground;
    var borrowed = q && q.from && def.id !== q.from;
    var pic = borrowed ? (def.picture || {}) : pictureOf(D || def, q || {});
    if (pic.ground != null && E.GROUNDS.indexOf(pic.ground) >= 0) return pic.ground;
    var kind = pic.kind;
    return kind === 'prey' ? 'earth' : kind === 'mud' ? 'mud' : kind === 'grit' ? 'grit' : 'sand';
  };
  /* The help after a miss (E.counts.answer's `help`, `near`, `notFive`, `notTen`, `line`): its first
   * line, who keeps the count (the teacher, or with `helpCounter: 'you'` the player: under the bridge
   * she hops and Sprinkle swipes), the ground, the scratches' style ('swipe': five short lines a paw,
   * on the 5s) and the count, step by step (5 · 10 · 15 … on the 5s), then the miss line.
   * Chapter 4, the 10s: an answer that doesn't end in a zero opens with the set's `helpIntroNotTen`;
   * the swipes come in pairs, two for every cat, once for each forepaw (`pair: true`, hopped by tens);
   * and a picture in rows of ten is scratched ten marks a row and lit a whole row at a time
   * (`byRow: true`: the help hops by the row, 10 · 20 · 30). Both keys are there only when true.
   * Chapter 5, the 9s: three more openings, checked in this order after those two: the set's
   * `helpIntroTens` (she typed the tens), `helpIntroOneTuck` (she tucked one claw only),
   * `helpIntroNotNine` (her answer's two numbers don't make nine, once she has been shown that they
   * should); "close" is within nine. The help itself is the lesson done slowly, in two phases
   * (`tuck: true`): Tallyheart swipes the sand twice for every cat and hops the pairs by tens, then
   * rubs out one line for every cat and steps back by ones, so `nums` reads 10 · 20 · 30 · 40 · 39 ·
   * 38 · 37 · 36 and `hops` is how many of them are hops (E.helpSteps has each step's scratches).
   * A set's `helpSays` is who says the opening line when it is not the teacher (`says`: Patience's
   * one line in Wisp's silent set); `help: 'picture'` lights the set's own picture a group at a time
   * and scratches nothing (`picture: true`, no ground: Puddle's bumps, Wisp's herons). Each of these
   * keys is there only when it applies, so chapters 1 to 4's plans are what they were. */
  E.helpPlan = function (def, D, q, res) {
    def = def || {}; D = D || def;
    var hp = res.help || {}, step = hp.step || 1, total = hp.groups * hp.per;
    var teacher = E.teacherOf(def, D);
    var helpIntro = D.helpIntro || 'Let’s scratch it out together.';
    var intro = res.notFive && D.helpIntroNotFive ? D.helpIntroNotFive
      : res.notTen && D.helpIntroNotTen ? D.helpIntroNotTen
        : res.tens && D.helpIntroTens ? D.helpIntroTens
          : res.oneTuck && D.helpIntroOneTuck ? D.helpIntroOneTuck
            : res.notNine && D.helpIntroNotNine ? D.helpIntroNotNine
              : res.near ? helpIntro : (D.helpIntroFar || helpIntro.replace(/^Close\.\s*/, ''));
    var nums = [];
    for (var i = step; i <= total; i += step) nums.push(i);
    if (nums[nums.length - 1] !== total) nums.push(total);
    var pic = pictureOf(D, q || {}), table = hp.table || (q && q.table), rows = pic.layout === 'rows';
    var own = D.help === 'picture';
    var pair = table === 10 && hp.per === 10 && !rows && !own;
    // the 9s: hop the pairs by tens, then rub one line out of each and step back by ones
    var tuck = table === 9 && hp.per === 9 && !rows && !own;
    if (tuck) {
      nums = [];
      for (var h = 1; h <= hp.groups; h++) nums.push(h * 10);
      for (var b = 1; b <= hp.groups; b++) nums.push(hp.groups * 10 - b);
    }
    var plan = {
      // (a set nobody speaks in has nobody to keep the count but her)
      intro: intro, teacher: teacher, counter: D.helpCounter === 'you' || teacher === 'caption' ? 'player' : teacher,
      ground: own ? null : E.helpGround(def, D, q), style: !own && ((table === 5 && hp.per === 5) || pair || tuck) ? 'swipe' : null,
      layout: rows ? 'rows' : null,
      step: tuck ? 10 : step, total: total, nums: nums, groups: hp.groups, per: hp.per, answer: hp.answer, line: res.line || ''
    };
    if (pair || tuck) plan.pair = true;
    if (tuck) { plan.tuck = true; plan.hops = hp.groups; }
    if (rows && step > 1 && step === hp.per) plan.byRow = true;
    if (own) plan.picture = true;
    if (typeof D.helpSays === 'string' && D.helpSays) plan.says = D.helpSays;
    return plan;
  };
  /* The help, step by step, as the page counts it out: [{ n, counted, rubbed? }]: the number said at
   * each step and the scratches lit then (E.sandOpts(plan, counted, rubbed)). Chapters 1 to 4: one
   * step for each number of `nums`, that many lit. The 9s: the hops (10, 20 … lit), then, with every
   * swipe lit, one line rubbed out of a pair at each step back (`rubbed`: 1, 2 …). */
  E.helpSteps = function (plan) {
    plan = plan || {};
    return asList(plan.nums).map(function (n, i) {
      if (!plan.tuck || i < plan.hops) return { n: n, counted: n };
      return { n: n, counted: plan.hops * 10, rubbed: i - plan.hops + 1 };
    });
  };
  /* The scratches as PC.art.sand takes them, with `counted` of them lit: the plan's groups, ground
   * and style; swipes in pairs for the 10s (`pair`); and `step` when the help hops a whole row at a
   * time (the pile's rows of ten: after the first hop exactly the first row's ten marks are lit). */
  E.sandOpts = function (plan, counted, rubbed) {
    plan = plan || {};
    var o = { groups: plan.groups, per: plan.per, counted: counted, layout: plan.layout || undefined, ground: plan.ground === 'sand' ? undefined : plan.ground };
    if (plan.style) o.style = plan.style;
    if (plan.pair) o.pair = true;
    if (plan.byRow) o.step = plan.step;
    // chapter 5, the 9s: ten lines a cat (two swipes of five), and `rubbed` of the pairs, from the
    // left, with one line rubbed out (the nine left in such a pair stay lit)
    if (plan.tuck) { o.per = 10; if (rubbed > 0) o.rubbed = rubbed; }
    return o;
  };
  /* Chapter 5: her answers scratched in the sand (a fact's `shows`, res.shows), as PC.art.sand takes
   * them: { answers: [18, 36] }, on the lesson's ground when it is not sand. */
  E.answersOpts = function (plan, shows) {
    var o = { answers: asList(shows && shows.answers).slice() };
    if (plan && plan.ground && plan.ground !== 'sand') o.ground = plan.ground;
    return o;
  };
  /* A question's picture as PC.art.countsPicture takes it (the page adds her `look`): the set's
   * picture with the fact's own on top (cats or prey, stacks or rows, a thought cloud), `highlight`
   * things lit, the fact's `who` (else the set's) in its places. `over` redraws it another way after
   * a right answer (`rightPicture`: in rows unless it says otherwise). Chapter 4: forepaws scratched
   * in the roof's grit are `kind: 'grit'` (a picture written `{ kind: 'mud', ground: 'grit' }` is the
   * same), and a picture's `ground` goes to the art with it. */
  E.lessonPicture = function (D, q, highlight, over, more) {
    D = D || {}; q = q || {};
    var p = Object.assign({}, D.picture || {}, q.picture || {}, over ? Object.assign({ layout: 'rows' }, over.picture || {}) : {});
    var g = over && typeof over.groups === 'number' ? over.groups : q.groups;
    var per = over && typeof over.per === 'number' ? over.per : q.per;
    var who = q.who || (Array.isArray(D.who) ? D.who : null);
    var o = { table: q.table || per, groups: g, per: per, highlight: highlight || 0, kind: p.kind, layout: p.layout, thought: p.thought,
      who: who || undefined, thing: D.thing || 'tail', things: D.things || 'tails' };
    if (p.kind === 'grit' || (p.kind === 'mud' && p.ground === 'grit')) { o.kind = 'grit'; o.ground = 'grit'; }
    else if (p.ground != null) o.ground = p.ground;
    // chapter 5: `more` goes to the art with it (the 9s' `tuck`: how many cats have curled a claw in)
    if (isObj(more)) Object.keys(more).forEach(function (k) { o[k] = more[k]; });
    return o;
  };
  /* A question that lights its picture as it is asked (`light`), step by step, as the page plays it:
   * [{ picture, wait }] (`wait`: ms after the step before, the first after the question appears), the
   * clock starting again at the last. 'groups' and 'rows' light a group, or a row, at a time, with no
   * number (chapters 2 to 4). Chapter 5's 'tuck' is the 9s' two steps without a word: the picture
   * opens with all ten claws lit on every cat (`open`: the hop), one curls in on each (the tuck),
   * and then the claws go unlit, nine out and one tucked, and she types. */
  E.LIGHT_MS = { first: 700, groups: 560, rows: 1000, hop: 1300, tuck: 1300 };
  E.lightSteps = function (D, q) {
    q = q || {};
    var out = [], g = q.groups, per = q.per, base = q.lit || 0;
    if (q.light === 'tuck') {
      // (`tuck` is the art's key: how many cats, from the first, have curled a claw in; `tucked` says the same)
      out.open = E.lessonPicture(D, q, g * 10, null, { tuck: 0, tucked: 0 });
      out.push({ picture: E.lessonPicture(D, q, g * per, null, { tuck: g, tucked: g }), wait: E.LIGHT_MS.hop });
      out.push({ picture: E.lessonPicture(D, q, 0), wait: E.LIGHT_MS.tuck });
      return out;
    }
    if (q.light !== 'groups' && q.light !== 'rows') return out;
    for (var k = 1; k <= g; k++) out.push({ picture: E.lessonPicture(D, q, Math.max(base, k * per)), wait: k === 1 ? E.LIGHT_MS.first : E.LIGHT_MS[q.light] });
    return out;
  };

  /* A finished lesson goes on the cat the moment its last answer is in, not after the praise
   * pause, so a page closed in that gap loses nothing. Chapter: the summary under its set id.
   * Hollow: the round counts (E.hollowFinish, exactly once). Returns { mode, summary, hollow }. */
  E.recordLesson = function (cat, st) {
    if (!st || !C.done(st)) return null;
    if (st.mode === 'hollow') {
      var h = E.hollowFinish(cat, st);
      return { mode: 'hollow', summary: h.summary, hollow: h };
    }
    var sum = C.summary(st);
    if (st.set) cat.lessons[st.set] = sum;
    cat.lesson = null;
    return { mode: st.mode || 'chapter', summary: sum, hollow: null };
  };
  /* A saved lesson whose last answer is in but which was never recorded (an older save, or a
   * page closed at just the wrong moment): record it now. Returns what recordLesson returns, or
   * null when there is nothing to settle. */
  E.settleLesson = function (cat) {
    var L = cat && cat.lesson;
    if (!L || !L.state || !C.done(L.state)) return null;
    if (!L.state.mode && L.mode) L.state.mode = L.mode;
    return E.recordLesson(cat, L.state);
  };
  /* Log a lesson's answer on the cat (capped), so the grown-ups corner sees it. */
  E.logAnswer = function (cat, entry) {
    cat.counts.push(entry);
    if (cat.counts.length > E.LOG_CAP) cat.counts.splice(0, cat.counts.length - E.LOG_CAP);
  };
  /* Per-fact table for grown-ups: attempts, right first time (per lesson), helped, median ms. */
  E.factTable = function (log) {
    var rows = {}, order = [];
    (log || []).forEach(function (e) {
      var k = factKey(e.a, e.b);
      if (!rows[k]) { rows[k] = { a: e.a, b: e.b, attempts: 0, firstAsks: 0, rightFirst: 0, helped: 0, times: [] }; order.push(k); }
      var r = rows[k];
      r.attempts++;
      if (e.helped) r.helped++;
      if (e.correct && typeof e.ms === 'number') r.times.push(e.ms);
      if (!e.retry && !e.filler) { r.firstAsks++; if (e.correct) r.rightFirst++; }
    });
    return order.map(function (k) {
      var r = rows[k];
      return { a: r.a, b: r.b, attempts: r.attempts, firstAsks: r.firstAsks, rightFirst: r.rightFirst, helped: r.helped, medianMs: median(r.times) };
    }).sort(function (x, y) {
      var ax = Math.max(x.a, x.b), ay = Math.max(y.a, y.b);
      return ax - ay || x.a - y.a;
    });
  };
  /* Which Count an answer belongs to: its own `table` (a mixed lesson), else its set's (a
   * chapter's set, or the Hollow's "hollow-2s"), else the smaller factor of the fact. */
  E.tableOf = function (entry, stories) {
    if (!entry) return 1;
    if (typeof entry.table === 'number') return entry.table;
    var m = /^hollow-(\d+)s$/.exec(entry.set || '');
    if (m) return +m[1];
    var def = entry.set && E.countsSet(entry.set, null, stories);
    if (def && def.table) return def.table;
    return Math.min(entry.a, entry.b) || 1;
  };
  /* The grown-ups' Counts, one per-fact table for each Count: [{ table, name, rows }]. */
  E.factTables = function (cat, stories) {
    var by = {};
    ((cat && cat.counts) || []).forEach(function (e) {
      var t = E.tableOf(e, stories);
      (by[t] || (by[t] = [])).push(e);
    });
    return Object.keys(by).map(Number).sort(function (a, b) { return a - b; }).map(function (t) {
      var c = E.countFor(t, stories);
      return { table: t, name: c ? E.countName(c.def, t) : 'The ' + t + 's', rows: E.factTable(by[t]) };
    });
  };

  /* ------------------------------------------------------------ the book */
  /* The dream as the book prints it (the cat keeps what she typed): a capital first letter,
   * "i" and "i'm" as "I" and "I'm", and a full stop unless it already ends a sentence. */
  E.tidyDream = function (raw) {
    var s = E.cleanDream(raw);
    if (!s) return s;
    s = s.replace(/(^|[^\p{L}\p{N}'’])i(?=$|[^\p{L}\p{N}])/gu, '$1I');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/[.!?…"”’'»]$/.test(s)) s += '.';
    return s;
  };
  /* One chapter's page: its heading, its recap (lines whose `when` matches), its dream line. */
  E.buildBook = function (story, cat) {
    var book = (story && story.book) || {};
    var recap = (book.recap || []).filter(function (r) {
      return r && typeof r.text === 'string' && E.matches(r.when, cat);
    }).map(function (r) { return E.fill(r.text, cat); });
    var typed = E.dreamOf(cat, story && story.id);
    var dream = typed ? E.fill(book.dream || '{name}paw’s dream: “{dream}”', cat, { dream: E.tidyDream(typed) })
      : (book.noDream ? E.fill(book.noDream, cat) : '');
    return {
      title: E.fill(book.title || '{name}paw’s First Moon', cat),
      chapter: E.fill(book.chapter || ('Chapter ' + (story.number || 1) + ': ' + (story.title || '')), cat),
      recap: recap,
      dream: dream,
      dreamText: typed
    };
  };
  /* Her whole book: the title once, then a page per finished chapter, in order, then the latest
   * finished chapter's teaser. */
  E.buildFullBook = function (cat, stories) {
    var list = E.chapters(stories);
    var first = list[0];
    var pages = list.filter(function (s) { return E.isFinished(cat, s.id); }).map(function (s) {
      var b = E.buildBook(s, cat);
      return { id: s.id, number: s.number || 1, heading: b.chapter, recap: b.recap, dream: b.dream, dreamText: b.dreamText };
    });
    var latest = pages.length ? E.chapter(pages[pages.length - 1].id, list) : null;
    return {
      title: E.fill((first && first.book && first.book.title) || '{name}paw’s First Moon', cat),
      pages: pages,
      dragonets: E.dragonets(cat, list),
      teaser: latest ? E.teaser(latest, cat, list) : null
    };
  };
  /* The dragonets she has found: a page in her book for each, from the finished chapter that finds
   * it (`book.dragonet: { id, name, lines }`, Sprinkle in chapter 3), in chapter order; the rest of the
   * clutch (E.DRAGONETS in all) are silhouettes, still to find. Null until she has found one.
   * A dragonet with a `when` is one she may not find (Squall, chapter 4: `{ foundSquall: true }`): his
   * page is there once it matches, whichever chapter she found him in, and not before. A chapter
   * may find several (chapter 5: a list, Puddle's page and Wisp's, each with its `when`), and a page
   * may say the `pose` its dragonet is drawn in. */
  E.dragonets = function (cat, stories) {
    var found = [], seen = {};
    E.chapters(stories).forEach(function (s) {
      asList(s.book && s.book.dragonet).forEach(function (d) {
        if (!isObj(d) || !d.id || seen[d.id]) return;
        if (d.when != null ? !E.matches(d.when, cat) : !E.isFinished(cat, s.id)) return;
        seen[d.id] = true;
        var page = { id: d.id, name: E.fill(d.name || d.id, cat), lines: asList(d.lines).map(function (l) { return E.fill(l, cat); }), chapter: s.id };
        // chapter 5: how the art draws it on its page, when sitting is not its way (Puddle's head
        // out of the water, Wisp on one leg)
        if (typeof d.pose === 'string' && d.pose) page.pose = d.pose;
        found.push(page);
      });
    });
    return found.length ? { found: found, toFind: Math.max(0, E.DRAGONETS - found.length) } : null;
  };

  /* ------------------------------------------------------------ the Training Hollow
   * One claw mark per Count: once the Count's own chapter lesson (E.countSets) is finished, the
   * Hollow offers it, a round of its ten facts at a time. Each Count keeps its own rounds and glow;
   * every full round (of any Count) earns the next treasure. */
  var COUNT_THINGS = { 1: ['tail', 'tails'], 2: ['ear', 'ears'], 3: ['cat', 'cats'], 4: ['paw', 'paws'], 5: ['claw', 'claws'], 9: ['life', 'lives'], 10: ['claw', 'claws'] };
  function setTable(def) {
    if (!def) return null;
    if (def.table) return def.table;
    var f = (def.facts || [])[0];
    return f && !Array.isArray(f) && f.table ? f.table : null;
  }
  /* Every Count the chapters teach, in the order they are taught: [{ table, setId, def, chapter }].
   * A Count's own set is the first chapter's to use its table (the one with the most facts there). */
  E.countSets = function (stories) {
    var out = [], byT = {};
    E.chapters(stories).forEach(function (s) {
      Object.keys(s.counts || {}).forEach(function (id) {
        var def = s.counts[id], t = setTable(def);
        if (!t) return;
        var n = (def.facts || []).length;
        if (!byT[t]) { byT[t] = { table: t, setId: id, def: def, chapter: s.id, n: n }; out.push(byT[t]); }
        else if (byT[t].chapter === s.id && n > byT[t].n) { byT[t].setId = id; byT[t].def = def; byT[t].n = n; }
      });
    });
    return out.map(function (c) { return { table: c.table, setId: c.setId, def: c.def, chapter: c.chapter }; });
  };
  E.countFor = function (table, stories) {
    var all = E.countSets(stories);
    for (var i = 0; i < all.length; i++) if (all[i].table === table) return all[i];
    return null;
  };
  /* "Tails · the 1s", "Ears · the 2s"; a set's `label` says it its own way ("Both forepaws · the 10s"). */
  E.countName = function (def, table) {
    table = table || setTable(def) || 1;
    var things = (def && (def.label || def.things)) || (COUNT_THINGS[table] || ['thing', 'things'])[1];
    return cap1(things) + ' · the ' + table + 's';
  };
  /* Tallyheart's word for a Count in the Training Hollow: the set's `hollowThings` ("tens": the 5s
   * and the 10s are both claws), else its `things`. */
  E.hollowWord = function (def) { return (def && (def.hollowThings || def.things)) || 'tails'; };
  function andList(a) { return a.length > 2 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a.join(' and '); }
  /* The Hollow's opening page: the Counts she can practise (each with its round's definition, its
   * name for the button and whether its mark glows), Tallyheart's greeting, and her line about the
   * marks that glow (or null). `opts.reward`: she has just finished a round. */
  E.hollowLines = function (cat, stories, opts) {
    var counts = E.learnedCounts(cat, stories).map(function (c) {
      var def = E.hollowDef(stories, c.table);
      return { table: c.table, def: def, glow: E.hollowTable(cat, c.table).glow, name: E.countName(def, c.table) };
    });
    var one = counts.length === 1 ? counts[0] : null;
    var glowing = counts.filter(function (d) { return d.glow; });
    var greet = opts && opts.reward ? 'Another round? I’ve got all evening.'
      : one ? 'Back for more ' + E.hollowWord(one.def) + '? A full round earns a treasure for your nest.'
        : counts.length ? 'Which Count today? A full round earns a treasure for your nest.' : 'Finish a Count in your story first. Then come back and practise it.';
    var glow = one && one.glow ? 'Look at your claw mark. It glows now. You know your ' + E.hollowWord(one.def) + '.'
      : glowing.length ? 'Look at your claw marks. Your ' + andList(glowing.map(function (d) { return E.hollowWord(d.def); })) + ' ' + (glowing.length === 1 ? 'mark glows' : 'marks glow') + ' now.' : null;
    return { counts: counts, one: one, greet: greet, glow: glow };
  };
  E.hollowRoundLine = function (def) { return 'A round of ' + E.hollowWord(def) + '. Ready? Here we go.'; };
  /* When a mark starts to glow: `many` Counts on the tree, and it names which. */
  E.hollowGlowNote = function (def, many) {
    return many ? 'Look! Your ' + E.hollowWord(def) + ' claw mark on the tree is glowing.' : 'Look! Your claw mark on the tree is glowing.';
  };
  /* The Counts she has learned, in the order they are taught: a Count is learned once its own set
   * (E.countSets: the chapter lesson that teaches it) is finished. Another set on the same table
   * does not teach it: chapter 6 asks four patrols of three (`ch06-four`) before Tallyheart teaches
   * the threes, and until that lesson the Hollow offers no 3s and the tree has no sixth mark. In
   * chapters 1 to 5 each Count's own set is the first of its table she finishes, so they read as
   * they always did. */
  E.learnedCounts = function (cat, stories) {
    return E.countSets(E.chapters(stories)).filter(function (c) {
      var L = cat && cat.lessons && cat.lessons[c.setId];
      return !!(L && L.finished !== false);
    });
  };
  /* One round: the ten facts of a table (n × table, both orders mixed), shuffled the same way
   * every time for the same round number. */
  E.hollowFacts = function (round, table) {
    table = table || 1;
    var rnd = mulberry32(((round | 0) + 1) * 2654435761 ^ (table * 40503));
    var facts = [];
    for (var n = 1; n <= 10; n++) facts.push(rnd() < 0.5 ? [n, table] : [table, n]);
    for (var i = facts.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1)), t = facts[i]; facts[i] = facts[j]; facts[j] = t;
    }
    return facts;
  };
  /* The lesson definition for a Hollow round: the Count's own set (lines and pictures), with the
   * round's facts and the Hollow's ending. */
  E.hollowDef = function (stories, table) {
    table = table || 1;
    var c = E.countFor(table, stories);
    var things = COUNT_THINGS[table] || ['thing', 'things'];
    var def = clone(c ? c.def : { thing: things[0], things: things[1], teacher: 'tallyheart', ask: '{a} × {b}', praise: ['Yes!'], fast: [], miss: 'There. We\'ll come back to that one.' });
    def.id = 'hollow-' + table + 's';
    def.table = table;
    def.done = 'A full round! That deserves a treasure for your nest.';
    delete def.firstPrompt;   // the chapter's first question is about the cats in the picture before it
    delete def.warmHard; delete def.fillFrom; delete def.facts;
    // the Hollow is Tallyheart's sand: nothing borrowed, nothing scratched anywhere else
    delete def.fillIntro; delete def.fillOrder; delete def.fillVoice; delete def.avoid; delete def.ground;
    // chapter 5: nor does the picture play the hop and the tuck there (the still picture: she knows
    // the two steps by now), and a round is Tallyheart's, in balloons, on her sand
    delete def.light; delete def.fillPicture; delete def.help; delete def.helpSays;
    return def;
  };
  /* The facts of a table that were hard last time: the most recent first ask of each (not a retry,
   * not a filler, not a right check) in the cat's Counts log was wrong, or right but not fast. 9×1 and 1×9 are one
   * fact. Returns [[a, b]] as last asked, the misses first, then the slowest. */
  /* A fact asked under something to read first: its clock ran while she read, so a right answer's
   * speed says nothing about the fact. From the answer's own set (no new log field, so chapter 2's
   * saves work as they are): the fact has its own `prompt` there (2 × 6's "hop on from ten", the old
   * tom's 10 × 2), or it opens the set (its first fact, or a warm-up's `alt` opener) and the set has a
   * `firstPrompt` or its Counts frame has balloons (asked under them). The Hollow's are never.
   * "Opens" is where it was asked, not which pair it is: only the first answer of a run of the set
   * in the log can be the opener, so a warm-up's hard pick asked second (whatever its pair, 4 × 2
   * or an `alt` pair among them) is timed for itself. Returns { own, open } by fact key. */
  function readFacts(setId, stories) {
    // the chapters given, then every chapter loaded (a warm-up given only its own chapter still
    // knows chapter 1's lesson)
    var list = storyList(stories).concat(stories ? storyList() : []), story = null, def = null;
    for (var i = 0; i < list.length && !def; i++) if (list[i].counts && list[i].counts[setId]) { story = list[i]; def = list[i].counts[setId]; }
    if (!def) return null;
    var out = { own: {}, open: {} }, facts = def.facts || [];
    facts.forEach(function (f) { if (isObj(f) && f.prompt != null) out.own[factKey(+f.a, +f.b)] = true; });
    // (chapter 5: a Counts frame with `intro: false` says none of its lines over the first question,
    // so that question is timed on itself, like any other)
    var balloons = Object.keys(story.frames || {}).some(function (id) {
      var f = story.frames[id];
      return f && f.counts && f.counts.set === setId && f.counts.intro !== false && asList(f.say).length > 0;
    });
    if (facts.length && (def.firstPrompt || balloons)) {
      var p = factPair(facts[0]);
      out.open[factKey(p[0], p[1])] = true;
      var w = def.warmHard;
      if (isObj(w) && num(w.at, 0) !== 0 && w.alt) (altList(w.alt) ? w.alt : [w.alt]).forEach(function (f) { var q = factPair(f); out.open[factKey(q[0], q[1])] = true; });
    }
    return out;
  }
  // `opener`: whether the entry was the first answer of its run of the set (E.hardFacts reads it
  // from the log); left out, an opener pair counts as read first
  E.readFirst = function (entry, stories, memo, opener) {
    if (!entry || !entry.set) return false;
    var r = memo && own(memo, entry.set) ? memo[entry.set] : readFacts(entry.set, stories);
    if (memo) memo[entry.set] = r;
    var k = factKey(entry.a, entry.b);
    return !!(r && (r.own[k] || (opener !== false && r.open[k])));
  };
  E.hardFacts = function (cat, table, stories) {
    table = table || 1;
    var mine = {};
    for (var n = 1; n <= 10; n++) mine[pairKey(n, table)] = true;
    var last = {}, memo = {};
    (cat && cat.counts || []).forEach(function (e, i, log) {
      // a right check says nothing about the fact (she read the long prompt; the answer was on
      // screen already), so the pair's ask before it decides; a missed check still counts. A right
      // first ask read under a prompt is the same: only a miss there makes the fact hard. The
      // opener is the first answer of its run of the set (a warm-up's hard pick, second, is not)
      if (!e || e.retry || e.filler || (e.check && e.correct)) return;
      var opener = !(i > 0 && log[i - 1] && log[i - 1].set === e.set);
      if (e.correct && mine[pairKey(e.a, e.b)] && E.readFirst(e, stories, memo, opener)) return;
      var k = pairKey(e.a, e.b);
      if (mine[k]) last[k] = { e: e, i: i };
    });
    return Object.keys(last).map(function (k) { return last[k]; }).filter(function (x) {
      return !x.e.correct || !(typeof x.e.ms === 'number' && x.e.ms < E.FAST_MS);
    }).sort(function (x, y) {
      return (x.e.correct ? 1 : 0) - (y.e.correct ? 1 : 0) || (y.e.ms || 0) - (x.e.ms || 0) || y.i - x.i;
    }).map(function (x) { return [x.e.a, x.e.b]; });
  };
  E.HARD_PER_ROUND = 3;
  function tableRecord(cat, table) {
    if (!isObj(cat.hollow)) cat.hollow = blankHollow();
    if (!isObj(cat.hollow.byTable)) cat.hollow.byTable = {};
    var key = String(table || 1);
    return cat.hollow.byTable[key] || (cat.hollow.byTable[key] = blankTable());
  }
  E.hollowTable = function (cat, table) {
    var r = cat && cat.hollow && cat.hollow.byTable && cat.hollow.byTable[String(table || 1)];
    return r ? { rounds: num(r.rounds, 0), cleanRounds: num(r.cleanRounds, 0), glow: !!r.glow } : blankTable();
  };
  E.hollowStart = function (cat, stories, now, table) {
    table = table || 1;
    var round = E.hollowTable(cat, table).rounds + 1;   // each Count's rounds are shuffled on their own
    var def = E.hollowDef(stories, table);
    var facts = E.hollowFacts(round, table);
    // up to three facts that were hard last time come early (positions 1-3, in this round's own
    // order of a and b); the first question stays an easy one
    var hard = {};
    E.hardFacts(cat, table, stories).slice(0, E.HARD_PER_ROUND).forEach(function (f) { hard[pairKey(f[0], f[1])] = true; });
    var easy = facts.filter(function (f) { return !hard[pairKey(f[0], f[1])]; });
    var early = facts.filter(function (f) { return hard[pairKey(f[0], f[1])]; }).map(function (f) { return { a: f[0], b: f[1], hard: true }; });
    if (early.length && easy.length) facts = [easy[0]].concat(early, easy.slice(1));
    var st = C.start(def, { facts: facts, set: def.id, mode: 'hollow', now: now });
    st.round = round;
    return { def: def, state: st };
  };
  /* A finished round earns the next treasure, and counts toward its own Count's glow. */
  E.hollowFinish = function (cat, state) {
    var sum = C.summary(state);
    if (!sum.finished) return { awarded: null, summary: sum, glowNow: false };
    var table = state.table || 1;
    var rec = tableRecord(cat, table), h = cat.hollow;
    h.rounds = num(h.rounds, 0) + 1;
    rec.rounds = num(rec.rounds, 0) + 1;
    if (sum.noHelp) rec.cleanRounds = num(rec.cleanRounds, 0) + 1;
    var t = E.TREASURES[(h.rounds - 1) % E.TREASURES.length];
    cat.nest.push(t.id);
    var wasGlow = !!rec.glow;
    rec.glow = rec.cleanRounds >= E.GLOW_ROUNDS;
    cat.lesson = null;
    return { awarded: t, summary: sum, glowNow: rec.glow && !wasGlow, rounds: h.rounds, table: table };
  };

  /* ------------------------------------------------------------ story checks */
  /* Problems with a story's frame graph, as strings (empty = fine). Used by tests and the UI's
   * debug hook. `stories` (optional: the other chapters) lets a frame use a Counts set or a card
   * that another chapter defines (the roof found in a later chapter runs chapter 4's frames);
   * without it, everything a chapter uses must be its own. */
  E.checkStory = function (story, stories) {
    var errs = [];
    if (!story || !story.frames) return ['no frames'];
    if (!story.frames[story.start]) errs.push('start frame missing: ' + story.start);
    var others = stories ? storyList(stories) : [];
    function hasSet(id) { return !!((story.counts && story.counts[id]) || others.some(function (s) { return s.counts && s.counts[id]; })); }
    function hasCard(id) { return !!((isObj(story.cards) && isObj(story.cards[id])) || others.some(function (s) { return isObj(s.cards) && isObj(s.cards[id]); })); }
    // a card entry: 'id' or { id, when?, line?, mark? }; on a frame's `card` (`shown`) also `held: true`,
    // a card she already has, laid beside the new one (a frame still gives at least one)
    function checkCards(where, x, plain, shown) {
      if (x == null) return;
      asList(x).forEach(function (c, i) {
        var id = typeof c === 'string' ? c : isObj(c) ? c.id : null;
        if (typeof id !== 'string' || !id) { errs.push(where + ': card ' + i + ' is an id or { id, when }'); return; }
        if (!hasCard(id)) errs.push(where + ': unknown card ' + id);
        if (isObj(c)) { if (plain && c.when != null) errs.push(where + ': card ' + id + ' takes no when here'); else checkWhen(where + ' card ' + id, c.when); }
        if (isObj(c) && c.held != null && !(shown && c.held === true)) errs.push(where + ': card ' + id + ': held is true, on a frame’s card only');
      });
      if (shown && asList(x).length && asList(x).every(function (c) { return isObj(c) && c.held === true; })) errs.push(where + ': every card is held: the frame gives none');
    }
    // flags a frame sets for good, by key: a choice must not set them too (Back would replace them)
    var sticky = {};
    Object.keys(story.frames).forEach(function (id) { var f = story.frames[id]; if (f && isObj(f.sets)) Object.keys(f.sets).forEach(function (k) { sticky[k] = id; }); });
    function checkWhen(where, w) {
      if (w == null) return;
      if (!isObj(w)) { errs.push(where + ': when must be an object'); return; }
      if (isObj(w.not)) checkWhen(where + ' (not)', w.not);
      asList(w.lessonClean).forEach(function (s) { if (!E.countsSet(s, story)) errs.push(where + ': lessonClean names no counts set here: ' + s); });
      asList(w.firstTry).forEach(function (k) { if (!/^\d+\s*[x×]\s*\d+$/.test(String(k))) errs.push(where + ': firstTry wants "AxB": ' + k); });
    }
    Object.keys(story.frames).forEach(function (id) {
      var f = story.frames[id];
      var kinds = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'ask', 'end'].filter(function (k) { return f[k]; });
      if (kinds.length !== 1) errs.push(id + ': needs exactly one of next/choice/input/look/counts/skip/scratch/file/ask/end, has ' + (kinds.join(',') || 'none'));
      E.exits(f).forEach(function (to) { if (!story.frames[to]) errs.push(id + ' -> missing ' + to); });
      if (f.counts && !hasSet(f.counts.set)) errs.push(id + ': unknown counts set ' + f.counts.set);
      if (f.counts && f.counts.intro != null && typeof f.counts.intro !== 'boolean') errs.push(id + ': counts intro is false (none of the frame’s lines is said again over the first question)');
      // chapter 5: a skip may count its `who` (entries with a `when`, and no `groups`: a forepaw for
      // everyone she has found); somebody must always be there to count
      var skWho = f.skip && Array.isArray(f.skip.who) ? f.skip.who : [];
      var skCond = skWho.some(function (w) { return isObj(w) && w.when != null; });
      if (f.skip && !(num(f.skip.table, 0) >= 1 && (num(f.skip.groups, 0) >= 1 || (f.skip.groups == null && skWho.length)))) errs.push(id + ': skip needs a table and groups');
      if (f.skip && (skCond || f.skip.groups == null) && skWho.length && !skWho.some(function (w) { return !isObj(w) || w.when == null; })) errs.push(id + ': skip who can never be empty: one entry has no when');
      skWho.forEach(function (w, i) { if (isObj(w)) checkWhen(id + ' skip who ' + i, w.when); });
      if (f.gift && !E.gift(f.gift)) errs.push(id + ': unknown gift ' + f.gift);
      // chapter 5: a frame may say where its sound effect is lettered (`sfxAt: [x, y]`, the middle of
      // the lettering in hundredths of the panel); only on a frame that has one
      if (f.sfxAt != null && !(Array.isArray(f.sfxAt) && f.sfxAt.length === 2 && f.sfxAt.every(function (v) { return typeof v === 'number' && v >= 0 && v <= 100; }) && typeof f.sfx === 'string' && f.sfx)) {
        errs.push(id + ': sfxAt is [x, y], each 0 to 100 (the middle of the lettering, in hundredths of the panel), on a frame with an sfx');
      }
      // and what Read to me says for it (`sfxRead`, the sound in words: E.captionsRead): only on a
      // frame that has one, and never on a page that letters its own sounds as she taps (a skip, a
      // page of questions, a row of bark), which reads its captions without it
      if (f.sfxRead != null && !(typeof f.sfxRead === 'string' && f.sfxRead.trim() && typeof f.sfx === 'string' && f.sfx && !f.skip && !f.ask && !f.scratch)) {
        errs.push(id + ': sfxRead is the sound in words for Read to me, on a frame with an sfx (not a skip, an ask or a scratch frame)');
      }
      asList(f.caption).forEach(function (c, i) {
        if (isObj(c)) { if (typeof c.text !== 'string') errs.push(id + ': caption ' + i + ' has no text'); checkWhen(id + ' caption ' + i, c.when); }
        else if (typeof c !== 'string') errs.push(id + ': caption ' + i + ' must be a string or { when, text }');
      });
      asList(f.say).forEach(function (b, i) {
        if (!isObj(b)) return;
        checkWhen(id + ' say ' + i, b.when);
        if (b.digits != null && (typeof b.digits !== 'string' || !b.digits.trim())) errs.push(id + ': say ' + i + ': digits is a short line, like "7 × 8"');
      });
      if (f.choice) (f.choice.options || []).forEach(function (o, i) {
        if (!o) return;
        checkWhen(id + ' option ' + i, o.when);
        // an option's label for a cat it matches: labelWhen: [{ when, label }], beside its plain label
        if (o.labelWhen != null) {
          if (typeof o.label !== 'string' || !o.label) errs.push(id + ' option ' + i + ': labelWhen needs a plain label beside it');
          asList(o.labelWhen).forEach(function (v, n) {
            if (!isObj(v) || typeof v.label !== 'string' || !v.label.trim() || !isObj(v.when)) errs.push(id + ' option ' + i + ': labelWhen ' + n + ' is { when, label }');
            else checkWhen(id + ' option ' + i + ' labelWhen ' + n, v.when);
          });
        }
        if (isObj(o.sets)) Object.keys(o.sets).forEach(function (k) { if (own(sticky, k)) errs.push(id + ' option ' + i + ': sets ' + k + ', which frame ' + sticky[k] + ' sets for good'); });
      });
      // chapter 4: flags set by reaching the frame, the cards it gives, the bark Taps, her Case File
      if (f.sets != null && !(isObj(f.sets) && Object.keys(f.sets).every(function (k) { var v = f.sets[k]; return typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number'; }))) {
        errs.push(id + ': sets is an object of flags, like { foundSquall: true }');
      }
      checkCards(id, f.card, false, true);
      if (f.scratch) {
        var sc = f.scratch;
        if (!isObj(sc)) errs.push(id + ': scratch is { cards | draws | tap, next }');
        else {
          var forms = ['cards', 'draws', 'tap'].filter(function (k) { return sc[k] != null; });
          if (forms.length !== 1) errs.push(id + ': scratch needs exactly one of cards (the row of bark), draws (one curl, no card) or tap (the glint), has ' + (forms.join(',') || 'none'));
          if (sc.cards != null && !(Array.isArray(sc.cards) && sc.cards.length)) errs.push(id + ': scratch cards is a list of cards');
          checkCards(id + ' scratch', sc.cards);
          checkCards(id + ' scratch head', sc.head, true);
          if (sc.draws != null && (typeof sc.draws !== 'string' || !hasCard(sc.draws))) errs.push(id + ': scratch draws names no card: ' + sc.draws);
          if (sc.tap != null && (typeof sc.tap !== 'string' || !sc.tap)) errs.push(id + ': scratch tap names what is tapped, like "glint"');
          if (sc.at != null && !(isObj(sc.at) && num(sc.at.x, -1) >= 0 && num(sc.at.y, -1) >= 0)) errs.push(id + ': scratch at is { x, y } in percent of the panel');
          ['prompt', 'label', 'ground', 'miss'].forEach(function (k) { if (sc[k] != null && typeof sc[k] !== 'string') errs.push(id + ': scratch ' + k + ' is a line'); });
          if (sc.miss != null && sc.tap == null) errs.push(id + ': scratch miss (the small answer to a tap anywhere else) goes with tap');
        }
      }
      // chapter 5: the questions she taps out of somebody (`ask`)
      if (f.ask) {
        var ak = f.ask;
        if (!isObj(ak)) errs.push(id + ': ask is { who, to, pairs: [[question, answer], …], next }');
        else {
          if (typeof ak.who !== 'string' || !ak.who) errs.push(id + ': ask who is the one who asks, like "riffle"');
          if (typeof ak.to !== 'string' || !ak.to) errs.push(id + ': ask to is the one who answers, like "patience"');
          if (!(Array.isArray(ak.pairs) && ak.pairs.length && ak.pairs.every(function (pr) { return Array.isArray(pr) && pr.length === 2 && typeof pr[0] === 'string' && pr[0].trim() && typeof pr[1] === 'string' && pr[1].trim(); }))) {
            errs.push(id + ': ask pairs is a list of [question, answer]');
          }
          ['prompt', 'label', 'opt'].forEach(function (k) { if (ak[k] != null && typeof ak[k] !== 'string') errs.push(id + ': ask ' + k + ' is a line'); });
          var cast = (f.scene && f.scene.cast) || [];
          [ak.who, ak.to].forEach(function (w) { if (typeof w === 'string' && w && f.scene && !cast.some(function (c) { return c && c.who === w; })) errs.push(id + ': ask: ' + w + ' is not in the frame’s cast'); });
        }
      }
      if (f.file && f.file !== true && !(isObj(f.file) && (f.file.prompt == null || typeof f.file.prompt === 'string'))) errs.push(id + ': file is { next, prompt? }');
      // a frame shown only `when` it matches is passed over as if its next led straight on
      if (f.when != null) {
        checkWhen(id + ' when', f.when);
        // ... or, with `else`, to the frame it names (a choice some cats never see)
        if (f.else == null && E.exits(f).length !== 1) errs.push(id + ': a frame with when needs exactly one way on (next), or an else');
        if (id === story.start) errs.push(id + ': the start frame always shows (no when)');
      }
      if (f.else != null) {
        if (f.when == null) errs.push(id + ': else goes with a when (where the page turns when the frame does not show)');
        if (typeof f.else !== 'string' || !story.frames[f.else]) errs.push(id + ' -> missing ' + f.else + ' (else)');
      }
      if (f.skip && f.skip.paws != null && ['own', 'both', 'pile', 'board', 'log', 'mud'].indexOf(f.skip.paws) < 0) errs.push(id + ': skip paws is "own", "both", "pile", "board", "log" or "mud"');
      if (f.skip && f.skip.tuck != null && typeof f.skip.tuck !== 'boolean') errs.push(id + ': skip tuck is true or false');
      if (f.skip && f.skip.steps != null) {
        if (!(Array.isArray(f.skip.steps) && f.skip.steps.every(function (st) { return isObj(st) && num(st.from, 0) >= 1 && (st.opts == null || isObj(st.opts)) && (st.sfx == null || typeof st.sfx === 'string'); }))) {
          errs.push(id + ': skip steps is a list of { from, opts, sfx }: the tap a step starts at, the scene options from then on, its lettering');
        }
        if (!E.skipOnScene(f.skip)) errs.push(id + ': skip steps redraw the frame’s scene: only a skip that keeps its scene up has them (paws: "log")');
      }
      if (f.skip && E.skipOnScene(f.skip) && !f.scene) errs.push(id + ': this skip-count is tapped on the frame’s own scene: it needs one');
      if (f.skip && f.skip.keep != null && typeof f.skip.keep !== 'boolean') errs.push(id + ': skip keep is true or false');
      if (f.skip && f.skip.carry != null && typeof f.skip.carry !== 'boolean') errs.push(id + ': skip carry is true or false');
      if (f.skip) ['prompt', 'label'].forEach(function (k) { if (f.skip[k] != null && typeof f.skip[k] !== 'string') errs.push(id + ': skip ' + k + ' is a line'); });
    });
    asList(story.book && story.book.dragonet).forEach(function (dn) {
      if (!(isObj(dn) && typeof dn.id === 'string' && dn.id && typeof dn.name === 'string' && dn.name)) errs.push('book.dragonet needs an id and a name');
      else {
        checkWhen('book.dragonet ' + dn.id, dn.when);
        if (dn.pose != null && (typeof dn.pose !== 'string' || !dn.pose)) errs.push('book.dragonet ' + dn.id + ': pose is one of its poses, like "head"');
      }
    });
    // her Case File's cards
    if (story.cards != null && !isObj(story.cards)) errs.push('cards is an object: { id: { mark, line, picture } }');
    Object.keys(isObj(story.cards) ? story.cards : {}).forEach(function (cid) {
      var c = story.cards[cid];
      if (!isObj(c)) { errs.push('card ' + cid + ': needs a mark and a line'); return; }
      if (c.mark !== 'eye' && c.mark !== 'ear') errs.push('card ' + cid + ': mark is "eye" (she saw it herself) or "ear" (she was told)');
      if (typeof c.line !== 'string' || !c.line.trim()) errs.push('card ' + cid + ': needs its one line');
      if (c.picture != null && (typeof c.picture !== 'string' || !c.picture)) errs.push('card ' + cid + ': picture is the art’s name for its drawing');
      if (c.answers != null && !(Array.isArray(c.answers) && c.answers.every(function (a) { return typeof a === 'string' && a; }))) errs.push('card ' + cid + ': answers is a list of card ids');
      if (c.answers != null && c.mark !== 'ear') errs.push('card ' + cid + ': only a claim (an ear card) has answers');
      checkWhen('card ' + cid, c.when);
      if (c.link != null) {
        if (!isObj(c.link) || (c.link.line != null && typeof c.link.line !== 'string')) errs.push('card ' + cid + ': link is { when, line }');
        else checkWhen('card ' + cid + ' link', c.link.when);
        // chapter 5: a link may name its partners itself (`with`), any cards, hers or another chapter's
        var lw = isObj(c.link) ? c.link.with : null;
        if (lw != null) {
          if (!(Array.isArray(lw) && lw.length && lw.every(function (a) { return typeof a === 'string' && a; }))) errs.push('card ' + cid + ': link with is a list of card ids');
          else lw.forEach(function (a) { if (a === cid) errs.push('card ' + cid + ': link with names the card itself'); else if (!hasCard(a)) errs.push('card ' + cid + ': link with names an unknown card ' + a); });
        } else if (!(Array.isArray(c.answers) && c.answers.length)) errs.push('card ' + cid + ': link needs answers (the cards it is drawn touching), or with');
      }
    });
    if (story.names != null && !(isObj(story.names) && Object.keys(story.names).every(function (k) { return typeof story.names[k] === 'string' && story.names[k]; }))) {
      errs.push('names is an object of labels by speaker, like { squall: "The little dragon" }');
    }
    Object.keys(story.counts || {}).forEach(function (sid) {
      var d = story.counts[sid];
      if (d.fillFrom && !E.countsSet(d.fillFrom, story, stories)) errs.push('counts ' + sid + ': fillFrom names no set in this chapter: ' + d.fillFrom);
      if (d.fillIntro != null && typeof d.fillIntro !== 'string') errs.push('counts ' + sid + ': fillIntro must be a line');
      if (d.fillIntro != null && !d.fillFrom) errs.push('counts ' + sid + ': fillIntro without fillFrom');
      // chapter 3's keys
      if (d.ground != null && E.GROUNDS.indexOf(d.ground) < 0) errs.push('counts ' + sid + ': ground is "sand", "earth", "mud", "grit" or "log"');
      if (d.fillOrder != null && d.fillOrder !== 'easiest') errs.push('counts ' + sid + ': fillOrder is "easiest"');
      if (d.fillVoice != null && d.fillVoice !== 'borrower') errs.push('counts ' + sid + ': fillVoice is "borrower"');
      // (chapter 5: fillOrder may stand without fillFrom: the lesson's own gaps, filled with the easiest)
      if (d.fillVoice != null && !d.fillFrom) errs.push('counts ' + sid + ': fillVoice needs fillFrom');
      if (d.fillPicture != null && d.fillPicture !== 'borrower') errs.push('counts ' + sid + ': fillPicture is "borrower"');
      if (d.fillPicture != null && d.fillVoice !== 'borrower') errs.push('counts ' + sid + ': fillPicture goes with fillVoice: "borrower" (a borrowed pair asked and drawn as this set’s own)');
      if (d.helpCounter != null && d.helpCounter !== 'you') errs.push('counts ' + sid + ': helpCounter is "you"');
      if (d.help != null && d.help !== 'picture') errs.push('counts ' + sid + ': help is "picture" (the help lights the set’s own picture, and scratches nothing)');
      if (d.light != null && LIGHTS.indexOf(d.light) < 0) errs.push('counts ' + sid + ': light is "groups", "rows" or "tuck"');
      // chapter 4 adds the zero rule's line, the Hollow's button (`label`) and Tallyheart's word there (`hollowThings`);
      // chapter 5 the 9s' three openings and who says a help's first line when the teacher doesn't
      ['againIntro', 'helpIntroNotFive', 'helpIntroNotTen', 'helpIntro', 'helpIntroFar', 'label', 'hollowThings', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine', 'helpSays'].forEach(function (k) {
        if (d[k] != null && (typeof d[k] !== 'string' || !d[k].trim())) errs.push('counts ' + sid + ': ' + k + ' is a line');
      });
      if (isObj(d.picture) && d.picture.ground != null && E.GROUNDS.indexOf(d.picture.ground) < 0) errs.push('counts ' + sid + ': picture ground is "sand", "earth", "mud", "grit" or "log"');
      if (isObj(d.warmHard) && d.warmHard.avoid != null && !(Array.isArray(d.warmHard.avoid) && d.warmHard.avoid.every(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; }))) {
        errs.push('counts ' + sid + ': warmHard avoid is a list of facts, like [[5, 10], [3, 10]]');
      }
      if (d.done != null && typeof d.done !== 'string') errs.push('counts ' + sid + ': done is a line, \'\' or null');
      if (d.avoid != null && !(Array.isArray(d.avoid) && d.avoid.every(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; }))) errs.push('counts ' + sid + ': avoid is a list of facts, like [[9, 2], [7, 2]]');
      if (isObj(d.warmHard) && d.warmHard.alt != null) {
        var alts = altList(d.warmHard.alt) ? d.warmHard.alt : [d.warmHard.alt];
        if (!alts.every(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0; })) errs.push('counts ' + sid + ': warmHard alt is a fact, or a list of facts in order');
      }
      (d.facts || []).forEach(function (f, i) {
        var a = Array.isArray(f) ? f[0] : f && f.a, b = Array.isArray(f) ? f[1] : f && f.b;
        if (!(a >= 0 && b >= 0)) errs.push('counts ' + sid + ': fact ' + i + ' needs a and b');
        if (!isObj(f)) return;
        if (f.light != null && LIGHTS.indexOf(f.light) < 0) errs.push('counts ' + sid + ': fact ' + i + ': light is "groups", "rows" or "tuck"');
        ['miss', 'missLast'].forEach(function (k) { if (f[k] != null && (typeof f[k] !== 'string' || !f[k].trim())) errs.push('counts ' + sid + ': fact ' + i + ': ' + k + ' is a line'); });
        if (f.shows != null) {
          var sh = f.shows;
          if (!isObj(sh) || sh.kind !== 'answers') errs.push('counts ' + sid + ': fact ' + i + ': shows is { kind: "answers", of, also }');
          else {
            if (sh.of != null && !(Array.isArray(sh.of) && sh.of.every(function (x) { var p = factPair(x); return p[0] >= 0 && p[1] >= 0; }))) errs.push('counts ' + sid + ': fact ' + i + ': shows of is a list of facts, like [[2, 9]]');
            if (sh.also != null && typeof sh.also !== 'string') errs.push('counts ' + sid + ': fact ' + i + ': shows also is the words for {also}');
          }
        }
        if (f.lit != null && !(num(f.lit, -1) >= 0)) errs.push('counts ' + sid + ': fact ' + i + ': lit is a number of things');
        if (f.who != null && !Array.isArray(f.who)) errs.push('counts ' + sid + ': fact ' + i + ': who is a list, left to right');
        if (f.retryPrompt === true && f.prompt == null) errs.push('counts ' + sid + ': fact ' + i + ': retryPrompt: true keeps a prompt it does not have');
        if (f.rightAgain === true && f.right == null) errs.push('counts ' + sid + ': fact ' + i + ': rightAgain: true keeps right lines it does not have');
      });
    });
    return errs;
  };

  PC.engine = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

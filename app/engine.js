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
 * "Chapter 5 (v0.4)"). Chapter 8 lets such a link give a partner a line of its own (`link.lines`), so
 * one card can join two rows' ends over two different lines (docs/build.md, "Chapter 8 (v0.1)").
 * Chapter 10 adds the card pick (`pick`: Reynard's claim answered with a card from her Case File; its
 * own section, after `ask`'s; docs/chapters/10-the-gathering.spec.md, section 6), which stores nothing
 * new: the card she picks is its flag. Chapter 11 adds her warrior name (docs/chapters/11-the-warrior-
 * ceremony.spec.md, section 6): an optional `ending` on a cat, absent until she is named (the save stays
 * version 2), the thirty endings Glintstar draws her three from (E.warriorOffers), the ending she types
 * (an input of kind 'ending': E.cleanEnding, E.checkEnding), the token {ending} ('paw' until then), two
 * computed `when` keys (`offer`, `nameHas`), an option's `ending`, a skip's `name`, and E.warriorName,
 * which E.displayName shows first. Nothing changes for a cat who has not been named. The take-aways kit
 * (docs/take-aways.md, built before chapter 12) adds three-digit subtraction: a Counts set with `op: '-'`,
 * its own runner (E.takes), plan, slips, help in the sand and twins, and an optional `takes` on a cat, its
 * own log, absent until her first take-away (its own section, after the Warrior Counts'). No chapter 1 to 11
 * has a take set, so nothing it adds is reached before chapter 12. Chapter 12 adds Chispapaw's Spanish
 * (docs/chapters/12-a-spark-at-the-hedge.spec.md, section 6; its own section, after the kit's): PC.words' Spanish,
 * the {es:key} token filled in E.fill's one pass as «…», a whole Spanish line (`lang: 'es'`, E.esLine with its
 * English), the voices' parts (E.speechParts), a set's `echo`, a skip's `lang`, the kit's school words, Count the
 * store's friend and the guards. No line of chapters 1 to 11 reaches any of it; the save is untouched.
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

  E.VERSION = '0.11.1 (the take-aways kit, 2026-11-07)';
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
  E.ENDING_MAX = 12;         // chapter 11: her warrior name's ending (14 + 12: the longest name is 26 letters)
  E.GLOW_ROUNDS = 3;         // Training Hollow rounds of one Count without help before its claw mark glows
  E.MAX_MARKS = 10;          // claw marks on the tree: one per Count, the 1s to the 10s (every table to 10 × 10)
  E.DRAGONETS = 7;           // the clutch: a page in her book for each, a silhouette until she finds it
  E.SLEEPERS = 7;            // book two: the winter sleepers, a page in her second book for each, a silhouette until found

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
      Murmur: cap1(murmur), murmur: murmur, MURMUR: murmur.toUpperCase(),
      // chapter 11: her warrior ending, 'paw' until she has one, so {name}{ending} is {name}paw for every cat
      // who has not been named (no other token: {NAME}{ending} is never written)
      ending: hasEnding(cat) ? cat.ending : 'paw'
    };
    return t;
  };
  /* "murmur", or "mutter" when her own Clan name is Murmur, so the tortie never shares her name. */
  E.tortieWord = function (cat) {
    return cat && typeof cat.name === 'string' && cat.name.toLowerCase() === 'murmur' ? 'mutter' : 'murmur';
  };
  /* Fill {tokens} from a cat. Unknown tokens stay as written, so a typo shows up instead of
   * vanishing. `extra` adds tokens (the Counts runner uses {a} {b} {groups} ...).
   * Chapter 12: a Spanish token, {es:key} or {Es:key}, is filled in the same one pass (a value the fill
   * inserted, a typed dream or a name, is never scanned again), between the engine's marks, «…»
   * (the section "chapter 12: Spanish", below: esFill). Every other token fills exactly as before. */
  E.fill = function (text, cat, extra) {
    if (text == null) return '';
    return esFill(String(text), cat, extra, 'marks');
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
  /* Her name on the page: her warrior name once she has one (chapter 11), else her Clan name, else her
   * pet name, else "New cat". */
  E.displayName = function (cat) {
    if (!cat) return '';
    var w = E.warriorName(cat);
    if (w) return w;
    if (cat.name) return cat.name + 'paw';
    if (cat.petname) return cat.petname;
    return 'New cat';
  };

  /* ------------------------------------------------------------ her warrior name (chapter 11)
   * docs/chapters/11-the-warrior-ceremony.spec.md, section 6. Only the ending is stored (`cat.ending`,
   * optional, absent until she is named: never in E.blankCat); her name is `{name}{ending}`. Glintstar
   * offers three endings, one a row: her `ch10Best`'s, her `specialty`'s and the moon's (E.warriorOffers);
   * or she types her own (an input of kind 'ending': E.cleanEnding, E.checkEnding). */
  // the thirty endings (the story's For us): a row a value; the first offered, the next two standing by
  E.WARRIOR_ENDINGS = {
    ch10Best: { sprinkle: ['mist', 'flash', 'sky'], friends: ['purr', 'friend', 'hug'], truth: ['true', 'clear', 'brave'],
      counts: ['mark', 'count', 'tally'] },
    specialty: { noticing: ['bright', 'eye', 'sight'], sneaking: ['hush', 'sharp', 'spark'], climbing: ['leap', 'climb', 'reach'],
      swimming: ['splash', 'wave', 'ripple'], friends: ['cheer', 'smile', 'kind'] },
    moon: ['moon', 'silver', 'river'],
    fallback: { ch10Best: 'truth', specialty: 'noticing' }
  };
  // a first part (letters only, lower case) that makes, with the word, a whole name on either wiki (the names critic's
  // guard list, critic-names-tone-r2/guardlist.txt: every title ending in one of the thirty words; grey spelled both ways)
  // or a word already (honey: Honeymoon). (Four titles are left out: 15 to 21 letters, never a first part, which is at
  // most E.CLAN_MAX, 14.)
  E.WARRIOR_GUARD = {
    mist: ['alightinthe', 'cloud', 'dawn', 'echo', 'gray', 'grey', 'lightinthe', 'lightsinthe', 'morning'],
    sky: ['bright', 'clear', 'du', 'gray', 'grey', 'night', 'pale', 'shattered'],
    purr: ['ripple', 'stalk'],
    bright: ['dawn'],
    eye: ['arch', 'bright', 'lion', 'one', 'white'],
    sight: ['bookofclear', 'clear', 'far', 'shadow', 'spire', 'templeofclear', 'the'],
    leap: ['branch', 'deer', 'druids', 'fin', 'fish', 'fox', 'frog', 'hound', 'hunt', 'light', 'rabbit', 'rain', 'song', 'stag',
      'tumble', 'vixen', 'wiggle'],
    splash: ['clover', 'lark', 'mud', 'nettle', 'otter', 'rain', 'rapid'],
    wave: ['lapping'],
    ripple: ['brook', 'river', 'stream'],
    moon: ['amber', 'half', 'harvey', 'hidden', 'honey', 'rising', 'signofthe'],
    river: ['dark', 'dawn', 'diamondspray', 'greatfivetail', 'gullet', 'snarling', 'windingtail']
  };
  /* Every letter, lower case: spaces, hyphens, apostrophes and digits dropped, and the × and ÷ signs too
   * (inside LETTER's range; here only, so E.cleanClanName is unchanged). */
  function lettersOf(s) {
    var str = String(s == null ? '' : s), out = '';
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      if (LETTER.test(c) && c !== '\u00d7' && c !== '\u00f7') out += c;
    }
    return out.toLowerCase();
  }
  function hasEnding(cat) { return !!cat && typeof cat.ending === 'string' && cat.ending !== ''; }
  // her rows, in Glintstar's order: her ch10Best's, her specialty's, the moon's (an unknown value reads the fallback)
  function warriorRows(cat) {
    var W = E.WARRIOR_ENDINGS, fl = cat && isObj(cat.flags) ? cat.flags : {};
    var best = own(W.ch10Best, fl.ch10Best) ? fl.ch10Best : W.fallback.ch10Best;
    var spec = own(W.specialty, fl.specialty) ? fl.specialty : W.fallback.specialty;
    return [W.ch10Best[best], W.specialty[spec], W.moon];
  }
  // a row's offer for a first part (letters only): the first word not doubled (in her first part already), not
  // guarded (a whole name on a wiki) and not tripled (three of one letter at the join: Mosssplash); else its third
  function rowOffer(row, f) {
    for (var i = 0; i < row.length; i++) {
      var w = row[i];
      if (f && f.indexOf(w) >= 0) continue;
      if (own(E.WARRIOR_GUARD, w) && E.WARRIOR_GUARD[w].indexOf(f) >= 0) continue;
      if (/(.)\1\1/.test(f.slice(-2) + w.slice(0, 2))) continue;
      return w;
    }
    return row[2];
  }
  // every row of the thirty, in the data's order
  function allRows() {
    var W = E.WARRIOR_ENDINGS;
    return Object.keys(W.ch10Best).map(function (k) { return W.ch10Best[k]; })
      .concat(Object.keys(W.specialty).map(function (k) { return W.specialty[k]; }), [W.moon]);
  }
  E.warriorOffers = function (cat) {
    var f = lettersOf(cat && cat.name);
    return warriorRows(cat).map(function (row) { return rowOffer(row, f); });
  };
  /* What she typed, as an ending: letters only, lower case, a leading copy of her first part dropped once
   * (Fernheart typed by Fern is "heart"), at most E.ENDING_MAX letters. */
  E.cleanEnding = function (raw, cat) {
    var e = lettersOf(raw), f = lettersOf(cat && cat.name);
    if (f && e.indexOf(f) === 0) e = e.slice(f.length);
    return e.slice(0, E.ENDING_MAX);
  };
  /* { ending, refuse, who }: refuse null, or the first that holds of 'own' (no letter left), 'star', 'paw',
   * 'kit' (the ending, every trailing s dropped, ends so: kitten, kitty and kittie are kit), 'clan' (her first
   * part and the ending make a Clan cat's whole name; `who` that cat). A typed ending is never guarded. */
  E.checkEnding = function (raw, cat) {
    var e = E.cleanEnding(raw, cat), f = lettersOf(cat && cat.name), out = { ending: e, refuse: null, who: null };
    var bare = e.replace(/s+$/, ''), clan = clanCat(f + e, cat);
    if (!e) out.refuse = 'own';
    else if (/star$/.test(bare)) out.refuse = 'star';
    else if (/paw$/.test(bare)) out.refuse = 'paw';
    else if (/(kit|kitten|kitty|kittie)$/.test(bare)) out.refuse = 'kit';
    else if (clan) { out.refuse = 'clan'; out.who = clan; }
    return out;
  };
  // the Clan cat whose whole name this is (letters, lower case: tallyheart, thymeleaf, the tortoiseshell's murmurchime or,
  // for a cat named Murmur, mutterchime), or null
  function clanCat(whole, cat) {
    if (whole === 'tallyheart' || whole === 'thymeleaf') return whole;
    if (whole === E.tortieWord(cat) + 'chime') return 'murmurchime';
    return null;
  }
  /* Her warrior name, `{name}{ending}`, once she has both halves; '' until then. */
  E.warriorName = function (cat) { return cat && cat.name && hasEnding(cat) ? cat.name + cat.ending : ''; };

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
      // the Ceremony (docs/warrior-counts.md, section 7): a chapter with `opensWhen: 'warrior'` opens
      // once she has passed her Warrior Counts, not when the chapter before it is finished
      if (story.opensWhen === 'warrior') return warriorPassed(cat) || E.isFinished(cat, story.id);
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
    // the take-aways kit: a take state (`op: '-'`) also needs each problem in range, `col` within its
    // columns, and `got`, `first`, `slips` and `cols` lists (okTakeState); a Counts state has no `op`
    if (st.op != null && !okTakeState(st)) return false;
    return true;
  }
  E.okLesson = okLesson;
  // a saved lesson whose state is a Warrior Counts sitting's (E.recordLesson would record it as a sitting)
  function isSittingState(L) { return L.state.mode === 'warrior'; }
  function normCat(c, i) {
    if (isV1Cat(c)) c = fromV1(c);
    var b = E.blankCat({ id: typeof c.id === 'string' && c.id ? c.id : undefined, index: i });
    var out = b;
    Object.keys(b).forEach(function (k) {
      if (!own(c, k)) return;
      var v = c[k];
      if (Array.isArray(b[k])) { if (Array.isArray(v)) out[k] = v; }
      else if (isObj(b[k])) { if (isObj(v)) out[k] = v; }
      // (a lesson whose state is a sitting's, `mode: 'warrior'`, is no lesson: the Warrior Counts keep their
      // sitting in `warrior`, never here, so only a hand-edited save has one; dropped like any bad lesson)
      else if (k === 'lesson') { out[k] = okLesson(v) && !isSittingState(v) ? v : null; }
      else if (k === 'hollowWaiting') { out[k] = okLesson(v) && !isSittingState(v) && v.mode === 'hollow' ? v : null; }
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
      var lesson = okLesson(p.lesson) && !isSittingState(p.lesson) ? p.lesson : null;
      if (frame == null && !lesson) return;
      out.places[id] = { frame: frame, history: frame != null && Array.isArray(p.history) ? p.history : [], lesson: lesson };
    });
    // the Warrior Counts (docs/warrior-counts.md, section 6): optional, absent until her first sitting
    // starts; a sitting whose last answer is in but was never recorded is settled now (her own key only,
    // as every key above: a `__proto__` in a hand-edited save is never hers)
    if (own(c, 'warrior') && isObj(c.warrior)) {
      out.warrior = normWarrior(c.warrior);
      if (out.warrior.sitting && C.done(out.warrior.sitting.state)) E.warriorFinish(out, out.warrior.sitting.state);
    }
    // her warrior ending (chapter 11): optional, absent until she is named; kept as its letters, lower case, at
    // most E.ENDING_MAX (no first-part rule: that is for what she types); anything else is dropped (a hand-edited
    // save only: she is unnamed again)
    if (own(c, 'ending') && typeof c.ending === 'string') {
      var ending = lettersOf(c.ending).slice(0, E.ENDING_MAX);
      if (ending) out.ending = ending;
    }
    // the take-aways kit (docs/take-aways.md, section 4): optional, absent until her first take-away is
    // logged; her own key only, as every key above (normTakes)
    if (own(c, 'takes') && isObj(c.takes)) out.takes = normTakes(c.takes);
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
    { id: 'riffle-stone', name: 'Riffle’s lucky stone: dark and smooth, with a white stripe all the way around', from: 'Riffle' },
    // chapter 10: Sprinkle's goodbye, laid on the moss (the story's words)
    { id: 'mist-stone', name: 'Sprinkle’s mist stone: grey, until the moonlight finds it', from: 'Sprinkle' }
  ];
  E.gift = function (id) {
    for (var i = 0; i < E.GIFTS.length; i++) if (E.GIFTS[i].id === id) return E.GIFTS[i];
    return null;
  };
  E.treasure = function (id) {
    for (var i = 0; i < E.TREASURES.length; i++) if (E.TREASURES[i].id === id) return E.TREASURES[i];
    // the take-aways kit: a full Count the store round's frost-time treasures (docs/take-aways.md, section 5)
    var F = E.FROST_TREASURES || [];
    for (var j = 0; j < F.length; j++) if (F[j].id === id) return F[j];
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
      // chapter 11: one of the three endings Glintstar offers her; her first part has the word in it (her own
      // `ending` needs no key of its own: it is her field, read below)
      if (k === 'offer') { var offers = E.warriorOffers(cat); return anyOf(want, function (w) { return offers.indexOf(w) >= 0; }); }
      if (k === 'nameHas') { var f1 = lettersOf(cat.name); return anyOf(want, function (w) { return typeof w === 'string' && !!w && f1.indexOf(w) >= 0; }); }
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
        // chapter 8: `lines: { <partner id>: line }` gives a partner its own line (the brag touches FLEW
        // over one line and Sleet's dry den over another); every other partner joins over `line`. No
        // card of chapters 1 to 7 has `lines`, so every file of theirs lies as it did. The order of
        // `with` is the order of the joins, and a row only grows at its ends (`touch`)
        c.link.with.forEach(function (id) {
          var p = by[id], own = isObj(c.link.lines) && typeof c.link.lines[id] === 'string' && c.link.lines[id] ? c.link.lines[id] : line;
          if (p && p.id !== c.id) touch(p, c, own);
        });
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

  /* ------------------------------------------------------------ the card pick (chapter 10)
   * `pick: { claim, who?, by?, right, own?, nudges, flag, prompt?, label?, next }`: Reynard's claim in
   * the strip over her whole Case File, every card face up; she answers it with a card. `claim` has one
   * word in capitals (the word the strip lights); `who` makes it (default 'reynard'); `by` nudges, in a
   * whisper only she hears (default 'tallyheart'); `right` is every card whose own line answers it (held
   * or not); `own` a wrong card's own nudge; `nudges` the first and the second wrong pick's (the second
   * on every wrong pick after it); `flag` is set to the card she picks right, for the next screens'
   * `when`s, and replaced as a choice's `sets` are. After E.PICK_GLOW wrong picks the right cards she
   * holds glow and only they can be picked: it can never fail. Nothing is logged and nothing new is
   * stored (the wrongs are the page's). The parameter is `pk`, never `pick`: the module's `pick(list,
   * i)` above cycles, and a nudge must never come round to the first again. */
  E.PICK_GLOW = 3;
  E.PICK_PROMPT = '**Pick a card** from your Case File.';
  E.PICK_LABEL = 'Open your Case File and pick a card.';
  /* The claim's one word in capitals (two letters or more): 'FLEW' in "It FLEW out of your camp!".
   * Null unless there is exactly one ("I" is one letter, so "How could I get the prey OUT?" has one). */
  E.pickWord = function (claim) {
    var words = String(claim == null ? '' : claim).match(/[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ’']*/g) || [];
    var caps = words.filter(function (w) { var l = w.replace(/[’']/g, ''); return l.length >= 2 && l === l.toUpperCase() && l !== l.toLowerCase(); });
    return caps.length === 1 ? caps[0] : null;
  };
  /* Her file's order: E.caseFile's groups first ("What I saw myself", then "What I was told"), each
   * group's cards in order, then each linked row, its cards left to right (as drawFile reads them). */
  function fileOrder(F) {
    var out = [];
    F.groups.forEach(function (g) { out = out.concat(g.cards); });
    F.links.forEach(function (l) { out = out.concat(l.cards); });
    return out;
  }
  E.fileOrder = function (cat, stories) { return fileOrder(E.caseFile(cat, stories)).map(function (c) { return c.id; }); };
  // the right cards she holds, in her file's order
  function pickHeld(pk, cat, stories) {
    var right = asList(pk && pk.right);
    return E.fileOrder(cat, stories).filter(function (id) { return right.indexOf(id) >= 0; });
  }
  /* The cards she may pick: every card her file shows; after the glow (`wrongs` >= E.PICK_GLOW) only
   * the glowing ones (ids). */
  E.pickOpen = function (pk, cat, wrongs, stories) {
    wrongs = num(wrongs, 0);
    if (wrongs >= E.PICK_GLOW) return pickHeld(pk, cat, stories);
    return E.cards(cat, stories).map(function (c) { return c.id; });
  };
  /* A pick judged (pure): null for a card she may not pick (not in her file; off the glow after the
   * third wrong pick): no line, nothing changes. Right: { right: true, card, flag }. Wrong: { right:
   * false, card, wrongs: n, line, by, glow }: the card's own nudge, else the first nudge on the first
   * wrong pick and the second on every one after (clamped); `glow` empty until the third, then the
   * right cards she holds in her file's order. The guard (a data slip: she holds no right card at all):
   * the third wrong pick is taken as right, { right: true, card, flag, guard: true }. */
  E.pickJudge = function (pk, cat, cardId, wrongs, stories) {
    if (!isObj(pk)) return null;
    wrongs = num(wrongs, 0);
    if (E.pickOpen(pk, cat, wrongs, stories).indexOf(cardId) < 0) return null;
    if (asList(pk.right).indexOf(cardId) >= 0) return { right: true, card: cardId, flag: pk.flag };
    var n = wrongs + 1, held = n >= E.PICK_GLOW ? pickHeld(pk, cat, stories) : [];
    if (n >= E.PICK_GLOW && !held.length) return { right: true, card: cardId, flag: pk.flag, guard: true };
    var nudges = asList(pk.nudges);
    var line = (pk.own && pk.own[cardId]) || nudges[Math.min(n, 2) - 1];
    return { right: false, card: cardId, wrongs: n, line: line, by: pk.by || 'tallyheart', glow: held };
  };
  /* A pick on the frame she is on. Null, changing nothing, when the frame has no `pick` or the card
   * may not be picked. Right (or the guard): the flag is set to the card, then the page turns to
   * `next` (where it lands for her). Wrong: nothing in the save changes. Returns the judge's answer. */
  E.pick = function (cat, story, cardId, now, wrongs, stories) {
    var f = E.currentFrame(cat, story), pk = f && f.pick;
    if (!isObj(pk)) return null;
    var r = E.pickJudge(pk, cat, cardId, wrongs, stories);
    if (!r || !r.right) return r;
    if (!isObj(cat.flags)) cat.flags = {};
    cat.flags[pk.flag] = r.card;
    E.go(cat, story, E.landing(cat, story, pk.next), now);
    return r;
  };
  /* The pick screen's view (pure): { claim, word, who, by, right: the right cards she holds in her
   * file's order, file: E.caseFile }. */
  E.pickView = function (frame, cat, stories) {
    var pk = (frame && frame.pick) || {}, file = E.caseFile(cat, stories);
    var right = asList(pk.right);
    return { claim: typeof pk.claim === 'string' ? pk.claim : '', word: E.pickWord(pk.claim), who: pk.who || 'reynard', by: pk.by || 'tallyheart',
      right: fileOrder(file).map(function (c) { return c.id; }).filter(function (id) { return right.indexOf(id) >= 0; }), file: file };
  };
  /* The instruction under the panel and the hidden button's words. */
  E.pickWords = function (frame) {
    var pk = (frame && frame.pick) || {};
    return { prompt: typeof pk.prompt === 'string' ? pk.prompt : E.PICK_PROMPT, label: typeof pk.label === 'string' && pk.label ? pk.label : E.PICK_LABEL };
  };

  /* ------------------------------------------------------------ flow */
  E.KINDS = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'];
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
    if (frame.pick) return 'pick';
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
  E.next = function (cat, story, now, stories) {
    var f = E.currentFrame(cat, story);
    var to = f && (f.next || (f.look && f.look.next) || (f.skip && f.skip.next) || (f.scratch && f.scratch.next) || (f.file && f.file.next) || (f.ask && f.ask.next));
    // chapter 10: a card pick turns its page only by a pick (E.pick); with no card in her file (a data slip) Next follows it
    if (f && f.pick) { if (E.cards(cat, stories).length) return false; to = f.pick.next; }
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
    // (chapter 11: an offered name is stored as her warrior name, so the grown-ups' corner says the name she has, even
    // once a chapter-1 reread renames her and her ending is taken again from its row: Fernleap renamed Fox, Foxclimb)
    if (typeof opt.ending === 'string' && opt.ending) label = '{name}{ending}';
    if (isObj(opt.sets)) Object.keys(opt.sets).forEach(function (k) { cat.flags[k] = opt.sets[k]; });
    // chapter 11: an offered name sets her ending as given (never through the first-part rule, which is for typing)
    if (typeof opt.ending === 'string' && opt.ending) cat.ending = opt.ending;
    cat.choices[E.choiceKey(story, id)] = { index: index, label: label };
    return E.go(cat, story, E.landing(cat, story, opt.next), now);
  };
  /* Store what she typed (cleaned) and move on. For a dream, an empty value means skipped; each
   * chapter keeps its own dream. */
  E.submitInput = function (cat, story, value, now) {
    var id = E.frameId(cat, story), f = story.frames[id];
    if (!f || !f.input) return false;
    var kind = f.input.kind;
    // chapter 11: her own ending. Refused, nothing is stored, no flag is set and the page stays (the page says
    // why, by the line of `refuse`); accepted, her ending, then the input's `sets` (read for this kind only)
    if (kind === 'ending') {
      var chk = E.checkEnding(value, cat);
      if (chk.refuse) return false;
      cat.ending = chk.ending;
      if (isObj(f.input.sets)) Object.keys(f.input.sets).forEach(function (k) { cat.flags[k] = f.input.sets[k]; });
      return E.go(cat, story, E.landing(cat, story, f.input.next), now);
    }
    if (kind === 'petname') cat.petname = E.cleanPetName(value, f.input.suggestions && f.input.suggestions[0]);
    else if (kind === 'clanname') {
      cat.name = E.cleanClanName(value, f.input.suggestions && f.input.suggestions[0]);
      // chapter 11: chapter 1 read again, renamed. An offered ending she no longer would be offered (doubled,
      // guarded or tripled by the new first part) is taken again from its row (Fern with moon renamed Moon is
      // Moonsilver); an ending she typed stays hers
      if (isObj(cat.flags) && cat.flags.ch11Named === 'offer' && hasEnding(cat) && E.warriorOffers(cat).indexOf(cat.ending) < 0) {
        var row = allRows().filter(function (r) { return r.indexOf(cat.ending) >= 0; })[0];
        if (row) cat.ending = rowOffer(row, lettersOf(cat.name));
      }
      // ... and a typed ending that now makes a Clan cat's whole name with her new first part (Fern, typed heart, renamed
      // Tally: Tallyheart; Thymeleaf; {Murmur}chime), which the Type screen refuses, gives way to the first name
      // Glintstar sees in her (her best at the Gathering's row, as offered for the new first part: Tallytrue), and is
      // an offered one from then on (the polish release v23). Every other typed ending stays hers, a doubled one too
      else if (isObj(cat.flags) && cat.flags.ch11Named === 'self' && hasEnding(cat) && clanCat(lettersOf(cat.name) + cat.ending, cat)) {
        cat.ending = E.warriorOffers(cat)[0];
        cat.flags.ch11Named = 'offer';
      }
    }
    else if (kind === 'dream') { if (!isObj(cat.dreams)) cat.dreams = {}; cat.dreams[story.id] = E.cleanDream(value); }
    else if (kind) { cat.flags[kind] = E.cleanDream(value); }
    return E.go(cat, story, E.landing(cat, story, f.input.next), now);
  };
  /* Her dream for a chapter, as typed ('' when skipped or not reached). Chapter 12: a « or » she typed is
   * read as “ or ” (the engine's own marks letter Spanish), on read, so a save made before keeps working
   * and nothing stored changes. */
  function dreamMarks(s) { return s.indexOf('«') < 0 && s.indexOf('»') < 0 ? s : s.replace(/«/g, '“').replace(/»/g, '”'); }
  E.dreamOf = function (cat, chapterId) {
    if (!cat) return '';
    if (typeof cat.dream === 'string' && cat.dream) return dreamMarks(cat.dream);   // a version-1 cat, or a test's
    var d = isObj(cat.dreams) && chapterId ? cat.dreams[chapterId] : '';
    return typeof d === 'string' ? dreamMarks(d) : '';
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
    if (k === 'pick') return [frame.pick.next];
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
    // chapter 12: a Spanish count (`lang: 'es'`, section "chapter 12: Spanish"); every other skip exactly as before
    if (skip.lang === 'es') esSkip(v, totals, n, done, table);
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
    // chapter 12: a Spanish count is said out loud (its counter is the skip's own `teacher`) and lettered in words, in
    // Comic Neue (the plain counter's Andika bold has no italic, and Spanish is never lettered in Andika)
    if (skip.lang === 'es') { w.whisper = false; w.words = true; }
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
    // the take-aways kit (docs/take-aways.md, section 4): a chapter's Counts warm-up across every table
    if (w.table === 'all') return warmAcross(cat, def, facts, w, stories);
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
  /* The take-aways kit's Counts warm-up across both strands (docs/take-aways.md, section 4; `warmHard: { table: 'all',
   * at: [0, 1] }`, chapters 12 on): her hardest facts over the 54 pairs other than 10 × 10 (E.warriorHard, which reads
   * only `counts`, never a take-away), passing over the set's `avoid` pairs (or the pick's own), the hardest at the
   * first of `at`, the next at the second (`at` a number: one pick), each marked `hard` (a right one earns the
   * `remembered` line) and given its anchor Count as `table` (E.warriorAnchor), so E.questionDef asks and helps it in
   * that Count's words and picture. Fewer hard facts than places: the set's own facts stand in the rest; none, the set as
   * written. Another of the set's facts that is the same pair as a pick gives way to the set's `alt` (one pair, or a
   * list: its first entry that is no pick's pair nor already asked). */
  function warmAcross(cat, def, facts, w, stories) {
    var avoid = pairSet(w.avoid != null ? w.avoid : def.avoid);
    var hard = E.warriorHard(cat, stories).filter(function (f) { return !avoid[pairKey(f[0], f[1])]; });
    var at = [];
    (Array.isArray(w.at) ? w.at : [w.at]).forEach(function (x) {
      var i = Math.max(0, Math.min(facts.length - 1, num(x, 0) | 0));
      if (at.indexOf(i) < 0) at.push(i);
    });
    var picks = hard.slice(0, at.length);
    if (!picks.length) return facts;
    var rank = taughtRank(stories), mine = {}, pk = function (f) { var p = factPair(f); return pairKey(p[0], p[1]); };
    picks.forEach(function (p) { mine[pairKey(p[0], p[1])] = true; });
    var alts = (altList(w.alt) ? w.alt : w.alt ? [w.alt] : []).filter(function (f) { var p = factPair(f); return p[0] >= 0 && p[1] >= 0 && !mine[pk(f)]; });
    var out = facts.map(function (f, i) {
      var j = at.indexOf(i);
      if (j >= 0 && j < picks.length) { var p = picks[j]; return { a: p[0], b: p[1], hard: true, table: E.warriorAnchor(p[0], p[1], stories, rank) }; }
      return f;
    });
    return out.map(function (f, i) {
      var j = at.indexOf(i);
      if ((j >= 0 && j < picks.length) || !mine[pk(f)]) return f;
      var used = {};
      out.forEach(function (g, k) { if (k !== i) used[pk(g)] = true; });
      var alt = alts.filter(function (x) { return !used[pk(x)]; })[0] || alts[0];
      return alt ? clone(alt) : f;
    });
  }
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
    // the take-aways kit: a take set (`op: '-'`) has its own runner and lesson (docs/take-aways.md, section 8)
    if (raw.op === '-') return E.takeLesson(cat, story, setId, now, stories);
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
  /* The take-aways kit (docs/take-aways.md, section 4): a Counts warm-up across every table (`warmHard: { table: 'all' }`)
   * asks a question whose numeric `table` is not the set's in its anchor Count's way, as the Warrior Counts' sittings do
   * (E.warriorAsk's W_ASK_KEYS from E.hollowDef: the picture, the thing and things, the unit and units, the help's
   * openings), the set's own lines kept, on Tallyheart's sand. Every other set and question as before. */
  E.questionDef = function (def, q, story, stories) {
    if (def && isObj(def.warmHard) && def.warmHard.table === 'all' && q && !q.from && okNum(q.table) && q.table !== def.table) {
      var A = E.hollowDef(stories, q.table), D = Object.assign({}, def);
      W_ASK_KEYS.forEach(function (k) { if (A[k] != null) D[k] = clone(A[k]); else delete D[k]; });
      if (D.ground == null) D.ground = 'sand';
      return D;
    }
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
  /* Number words to a hundred ("fifty-two"), for the Warrior Counts' results; E.numWord stops at twelve. */
  var ONES = NUMW.concat(['thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']);
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  E.countWords = function (n) {
    if (!(typeof n === 'number' && isFinite(n) && n === Math.floor(n) && n >= 0 && n <= 100)) return String(n);
    if (n === 100) return 'one hundred';
    if (n < 20) return ONES[n];
    return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  };
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
    // (chapter 12's design for the chapters after it: a prompt balloon with `lang: 'es'` is a whole Spanish line, lettered
    // through E.esLine with the question's own numbers, so '¿{Es:a} {es:por} {es:b}?' asks any pair; it keeps its `lang`)
    var lines = function (x) {
      return asList(x).map(function (b) { return typeof b === 'string' ? { text: b } : b; }).filter(function (b) { return b && b.text; })
        .map(function (b) {
          if (b.kind === 'caption' || (silent && !b.who)) return { text: fillQ(b.text, D, q), kind: 'caption' };
          if (b.lang === 'es') return { who: b.who || teacher, text: E.esLine(b.text, null, { a: q.a, b: q.b }), kind: b.kind, lang: 'es' };
          return { who: b.who || teacher, text: fillQ(b.text, D, q), kind: b.kind };
        });
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
    // (a set's prompt given as balloons, chapter 12's design for a Spanish ask: no set of chapters 1 to 11 has one)
    if (D.prompt && typeof D.prompt !== 'string') return lines(D.prompt);
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
    // the Warrior Counts (docs/warrior-counts.md, section 7): a sitting is an attempt, never a lesson;
    // it never touches `lessons` or `lesson`
    if (st.mode === 'warrior') {
      var w = E.warriorFinish(cat, st);
      return w ? { mode: 'warrior', summary: C.summary(st), hollow: null, warrior: w } : null;
    }
    // the take-aways kit (docs/take-aways.md, section 8): a take state is summed by its own runner; a chapter's
    // goes under its set, as any lesson's; a Count the store round (`mode: 'hollow'`) goes to E.takeRoundFinish
    // and never reaches E.hollowFinish, module 1's treasures and `byTable['1']`
    if (st.op === '-') {
      var ts = T.summary(st);
      if (st.mode === 'hollow') {
        var store = E.takeRoundFinish(cat, st);
        if (isObj(cat.lesson) && cat.lesson.state === st) cat.lesson = null;
        return { mode: 'store', summary: ts, hollow: null, store: store };
      }
      if (st.set) cat.lessons[st.set] = ts;
      cat.lesson = null;
      return { mode: st.mode || 'chapter', summary: ts, hollow: null };
    }
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
    var s = dreamMarks(E.cleanDream(raw));   // (chapter 12: a typed « » as “ ”, as E.dreamOf reads it)
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
   * finished chapter's teaser.
   * Book two (docs/take-aways.md, section 7): one volume a module, `vol` (default 1). Module 1's is the book as it
   * always was, key for key ({ title, pages, dragonets, teaser }), from module 1's chapters only; module 2's adds
   * `sleepers`, `badger` and `keepsake`, and `store` on a page whose chapter has one (`book.store`). A volume's teaser is
   * its latest finished chapter's, left out once she has finished the chapter it points to (chapter 11's "A new
   * adventure" in the first volume, once chapter 12 is in the second): her book never promises what she has read. With
   * one module there is no such chapter, so the first volume is today's book exactly. */
  E.buildFullBook = function (cat, stories, vol) {
    var all = E.chapters(stories), v = bookVol(vol);
    var list = all.filter(function (s) { return E.moduleOf(s) === v; });
    var first = list[0];
    var pages = list.filter(function (s) { return E.isFinished(cat, s.id); }).map(function (s) {
      var b = E.buildBook(s, cat);
      var pg = { id: s.id, number: s.number || 1, heading: b.chapter, recap: b.recap, dream: b.dream, dreamText: b.dreamText };
      if (v > 1 && isStore(s.book && s.book.store)) pg.store = s.book.store;
      return pg;
    });
    var latest = pages.length ? E.chapter(pages[pages.length - 1].id, list) : null;
    var teaser = latest ? E.teaser(latest, cat, all) : null;
    if (teaser && teaser.next && E.isFinished(cat, teaser.next)) teaser = null;
    var out = {
      title: bookTitle(first, v, cat),
      pages: pages,
      dragonets: E.dragonets(cat, list),
      teaser: teaser
    };
    if (v > 1) {
      out.sleepers = E.sleepers(cat, list);
      out.badger = E.badgerPage(cat, list);
      out.keepsake = keepsakeOf(cat, list);
    }
    return out;
  };

  /* ------------------------------------------------------------ book two (docs/take-aways.md, section 7)
   * Read my book in volumes, one a module: a chapter's `module` (chapters 12 to 21 say 2; absent is 1, so chapters 1
   * to 11 are module 1's, as they always were). Nothing else reads it: E.chapters, E.upNext, E.progress and the hub go
   * on by `number`. Book two adds nothing to the save. */
  var BOOK_TITLES = { 1: '{name}paw’s First Moon', 2: '{name}{ending}’s First Frost-Time' };
  E.moduleOf = function (story) {
    var m = story && story.module;
    return typeof m === 'number' && m >= 1 && m === Math.floor(m) ? m : 1;
  };
  function bookVol(vol) { return typeof vol === 'number' && vol > 1 && vol === Math.floor(vol) ? vol : 1; }
  function isStore(n) { return typeof n === 'number' && n === Math.floor(n) && n >= 0 && n <= 999; }
  // a volume's title: its first chapter's `book.title` (chapter 1's "{name}paw’s First Moon", chapter 12's
  // "{name}{ending}’s First Frost-Time"), else the module's own
  function bookTitle(first, v, cat) {
    return E.fill((first && first.book && first.book.title) || BOOK_TITLES[v] || BOOK_TITLES[1], cat);
  }
  /* The volumes she has a finished chapter in, in module order: [{ module, title }]. Read my book shows the buttons that
   * switch them once there are two. */
  E.books = function (cat, stories) {
    var by = {}, out = [];
    E.chapters(stories).forEach(function (s) {
      var m = E.moduleOf(s);
      if (!by[m]) { by[m] = { module: m, first: s, any: false }; out.push(by[m]); }
      if (E.isFinished(cat, s.id)) by[m].any = true;
    });
    return out.filter(function (x) { return x.any; }).sort(function (a, b) { return a.module - b.module; })
      .map(function (x) { return { module: x.module, title: bookTitle(x.first, x.module, cat) }; });
  };
  /* The winter sleepers she has found, as the dragonets' pages are: a finished chapter's `book.sleeper: { id, name,
   * lines, when?, pose? }` (the groundhog is chapter 13's, `when: { foundGroundhog: true }`), in chapter order; the rest
   * (E.SLEEPERS in all) silhouettes, still sleeping. Null until she has found one. Unlike a dragonet's, a sleeper's `when`
   * never stands in for the chapter being finished: each is its chapter's own optional find, so its page comes with
   * that chapter's page, never before it. */
  E.sleepers = function (cat, stories) {
    var found = [], seen = {};
    E.chapters(stories).forEach(function (s) {
      var d = s.book && s.book.sleeper;
      if (!isObj(d) || typeof d.id !== 'string' || !d.id || seen[d.id] || !E.isFinished(cat, s.id)) return;
      if (d.when != null && !E.matches(d.when, cat)) return;
      seen[d.id] = true;
      var page = { id: d.id, name: E.fill(d.name || d.id, cat), lines: asList(d.lines).map(function (l) { return E.fill(l, cat); }), chapter: s.id };
      if (typeof d.pose === 'string' && d.pose) page.pose = d.pose;
      found.push(page);
    });
    return found.length ? { found: found, toFind: Math.max(0, E.SLEEPERS - found.length) } : null;
  };
  /* The badger page, "What is a badger LIKE?" (from chapter 13): a chapter's `book.badger` is a list of `{ row, say:
   * { text, who } }` (They say, an ear) and `{ row, saw: { text } }` (I saw, an eye). Only lines of finished chapters show;
   * a row shows once one of its lines does, the rows in the order first seen (chapter order, then each list's), one row
   * per answer (`row` names it: the three "as big as" rumours share one), and a row's rumours are `crossed` once one of
   * its sightings shows. { rows: [{ row, say: [{ text, who, chapter }], saw: [{ text, chapter }], crossed }] }, or null
   * until there is a row. */
  E.badgerPage = function (cat, stories) {
    var rows = [], by = {};
    E.chapters(stories).forEach(function (s) {
      if (!E.isFinished(cat, s.id) || !(s.book && Array.isArray(s.book.badger))) return;
      s.book.badger.forEach(function (l) {
        if (!isObj(l) || typeof l.row !== 'string' || !l.row) return;
        var say = isObj(l.say) && typeof l.say.text === 'string' ? l.say : null, saw = isObj(l.saw) && typeof l.saw.text === 'string' ? l.saw : null;
        if (!say === !saw) return;
        var r = own(by, l.row) ? by[l.row] : null;
        if (!r) { r = by[l.row] = { row: l.row, say: [], saw: [], crossed: false }; rows.push(r); }
        if (say) r.say.push({ text: E.fill(say.text, cat), who: E.fill(typeof say.who === 'string' ? say.who : '', cat), chapter: s.id });
        else { r.saw.push({ text: E.fill(saw.text, cat), chapter: s.id }); r.crossed = true; }
      });
    });
    return rows.length ? { rows: rows } : null;
  };
  /* E.checkStory's guards for book two's keys, as every earlier story key has: `module` is 1 or 2 and module 2's chapters
   * come after module 1's; `book.store`, `book.sleeper`, `book.badger` and `book.keepsake` only on a module 2 chapter;
   * `book.store` a whole number 0 to 999; `book.sleeper` is { id, name, lines, when?, pose? }, its id distinct across the
   * chapters, at most E.SLEEPERS of them; each `book.badger` line has a string `row` and exactly one of `say: { text,
   * who }` or `saw: { text }`; `book.keepsake` is { id, name, lines }. `others`: every chapter handed in with it. */
  function checkBookTwo(story, others, checkWhen) {
    var errs = [], bk = isObj(story.book) ? story.book : {}, two = E.moduleOf(story) === 2, n = num(story.number, 0);
    var rest = others.filter(function (o) { return o !== story && o.id !== story.id; });
    function str(x) { return typeof x === 'string' && !!x.trim(); }
    function linesOk(x) { return str(x) || (Array.isArray(x) && x.length > 0 && x.every(str)); }
    function onlyKeys(where, o, keys) {
      Object.keys(o).forEach(function (k) { if (keys.indexOf(k) < 0) errs.push(where + ' takes ' + keys.join(', ') + ': not ' + k); });
    }
    if (story.module != null && story.module !== 1 && story.module !== 2) errs.push('module is 1 or 2 (absent: 1), not ' + JSON.stringify(story.module));
    rest.forEach(function (o) {
      var m = E.moduleOf(o), on = num(o.number, 0);
      if (two && m === 1 && on > n) errs.push('module 2’s chapters come after module 1’s: chapter ' + on + ' (' + o.id + ') is module 1');
      if (!two && m === 2 && on < n) errs.push('module 2’s chapters come after module 1’s: chapter ' + on + ' (' + o.id + ') is module 2');
    });
    ['store', 'sleeper', 'badger', 'keepsake'].forEach(function (k) {
      if (bk[k] != null && !two) errs.push('book.' + k + ' is book two’s: the chapter needs module: 2');
    });
    if (bk.store != null && !isStore(bk.store)) errs.push('book.store is the store’s count, a whole number 0 to 999');
    var sl = bk.sleeper;
    if (sl != null) {
      if (!(isObj(sl) && str(sl.id) && str(sl.name) && linesOk(sl.lines))) errs.push('book.sleeper is { id, name, lines, when?, pose? }');
      else {
        onlyKeys('book.sleeper ' + sl.id, sl, ['id', 'name', 'lines', 'when', 'pose']);
        checkWhen('book.sleeper ' + sl.id, sl.when);
        if (sl.pose != null && !str(sl.pose)) errs.push('book.sleeper ' + sl.id + ': pose is one of its poses, like "sleep"');
        var ids = {};
        ids[sl.id] = true;
        rest.forEach(function (o) {
          var d = o.book && o.book.sleeper;
          if (!(isObj(d) && str(d.id))) return;
          if (d.id === sl.id) errs.push('book.sleeper ' + sl.id + ': chapter ' + (o.number || o.id) + ' has this sleeper too');
          ids[d.id] = true;
        });
        if (Object.keys(ids).length > E.SLEEPERS) errs.push('book.sleeper ' + sl.id + ': more than ' + E.SLEEPERS + ' sleepers across the chapters (E.SLEEPERS)');
      }
    }
    if (bk.badger != null) {
      if (!Array.isArray(bk.badger)) errs.push('book.badger is a list of { row, say: { text, who } } and { row, saw: { text } }');
      else bk.badger.forEach(function (l, i) {
        var at = 'book.badger ' + i;
        if (!isObj(l)) { errs.push(at + ': is { row, say: { text, who } } or { row, saw: { text } }'); return; }
        onlyKeys(at, l, ['row', 'say', 'saw']);
        if (!str(l.row)) errs.push(at + ': row is a string, the same on every line of one answer');
        if ((l.say != null) === (l.saw != null)) errs.push(at + ': exactly one of say or saw');
        if (l.say != null) {
          if (!(isObj(l.say) && str(l.say.text) && str(l.say.who))) errs.push(at + ': say is { text, who }');
          else onlyKeys(at + ' say', l.say, ['text', 'who']);
        }
        if (l.saw != null) {
          if (!(isObj(l.saw) && str(l.saw.text))) errs.push(at + ': saw is { text }');
          else onlyKeys(at + ' saw', l.saw, ['text']);
        }
      });
    }
    var ks = bk.keepsake;
    if (ks != null) {
      if (!(isObj(ks) && str(ks.id) && str(ks.name) && linesOk(ks.lines))) errs.push('book.keepsake is { id, name, lines }');
      else onlyKeys('book.keepsake ' + ks.id, ks, ['id', 'name', 'lines']);
    }
    return errs;
  }
  // the keepsake that closes a volume (chapter 21's stone tooth): the last finished chapter's `book.keepsake: { id, name,
  // lines }`, drawn as a nest treasure is; null until then
  function keepsakeOf(cat, list) {
    var k = null;
    list.forEach(function (s) {
      var d = s.book && s.book.keepsake;
      if (isObj(d) && typeof d.id === 'string' && d.id && E.isFinished(cat, s.id)) {
        k = { id: d.id, name: E.fill(d.name || d.id, cat), lines: asList(d.lines).map(function (l) { return E.fill(l, cat); }), chapter: s.id };
      }
    });
    return k;
  }
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
    var out = { counts: counts, one: one, greet: greet, glow: glow };
    // the Warrior Counts (docs/warrior-counts.md, section 5): only with `warrior` data, so every
    // other cat's Hollow reads exactly as it did
    if (cat && isObj(cat.warrior)) warriorHollow(out, cat, stories, opts || {});
    return out;
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
    return hardRule(cat, mine, stories);
  };
  /* E.hardFacts' rule over any set of pairs (`mine`, by pair key): shared with the Warrior Counts'
   * E.warriorHard, which reads it over the 54 pairs other than 10 × 10. */
  function hardRule(cat, mine, stories) {
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
  }
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

  /* ------------------------------------------------------------ the Warrior Counts
   * docs/warrior-counts.md (v0.4; decisions 48 and 49): once chapter 10 is finished, every pair up to
   * 10 × 10 once (55), in one sitting, from the hub; 50 right passes, a miss counts against her and
   * gets the sand's help, and she may try again whenever she likes. The story around it is
   * app/story/warrior.js, `PC.warrior` (not in PC.story, so no chapter, progress, Count or storyboard of
   * chapters 1 to 9 ever sees it): `after`, the chapter that opens it; `counts`, the sitting's lines
   * (`praise`, `fast`, `remembered`, `rememberedSlow`, `missLast`: four, in turn) and 10 × 10's own
   * under `counts.last` (`prompt`, `right`, `missLast`).
   * The save gains one optional field on a cat, `warrior`, absent until her first sitting starts:
   * { sitting: { at, state } | null, attempts: [{ n, at, done, finished, answered, right, passed,
   * missed, ms, seen, aside? }] (the last E.WARRIOR_KEEP), passedAt }. The sitting is a lesson state
   * with `mode: 'warrior'`, run by the Counts runner untouched: its queue of 55, `requeues` at
   * E.MAX_REQUEUE for every fact (a miss never comes back), `shown: true`, `crowd` and `beats`. It has
   * its own slot, never `lesson`, `places`, `hollowWaiting` or `lessons`. Each answer goes into
   * `counts` as every lesson's does (set 'warrior', its `table` the pair's anchor Count). */
  E.WARRIOR_PASS = 50;                       // nine in every ten of 55 is 49.5
  E.WARRIOR_BEATS = [14, 28, 42];            // the pauses after these answers; 28 is the halfway page
  E.WARRIOR_PAUSE_MS = 7200000;              // a sitting left partway picks up within two hours
  E.WARRIOR_TRICKY = 12;                     // her hardest facts spread through a sitting
  E.WARRIOR_NEW = [[7, 7], [7, 8], [8, 8]];  // the module's last new facts, always among the tricky ones
  E.WARRIOR_KEEP = 100;                      // attempts kept
  E.WARRIOR_STARTS = [100, 200];             // the order's fill: rule 4 relaxed after the first, the last resort after the second
  var W_GENTLE = [1, 2, 10], W_EASY = [1, 2, 5, 10], W_EASY_AT = [2, 3, 15, 29, 43];
  function warriorStory() { return isObj(PC.warrior) ? PC.warrior : {}; }
  function warriorLines() { var c = warriorStory().counts; return isObj(c) ? c : {}; }
  function warriorAfter() { var a = warriorStory().after; return typeof a === 'string' && a ? a : 'ch10'; }
  function warriorData(cat, create) {
    if (!cat) return null;
    if (!isObj(cat.warrior)) {
      if (!create) return null;
      cat.warrior = { sitting: null, attempts: [], passedAt: 0 };
    }
    var W = cat.warrior;
    if (!Array.isArray(W.attempts)) W.attempts = [];
    if (!okNum(W.passedAt)) W.passedAt = 0;
    if (!isObj(W.sitting)) W.sitting = null;
    return W;
  }
  function warriorAttempts(cat) { return cat && isObj(cat.warrior) && Array.isArray(cat.warrior.attempts) ? cat.warrior.attempts : []; }
  function warriorPassed(cat) { return !!(cat && isObj(cat.warrior) && num(cat.warrior.passedAt, 0) > 0); }
  function latestFinished(A) { for (var i = A.length - 1; i >= 0; i--) if (A[i] && A[i].finished) return i; return -1; }
  // the number the next sitting carries: one more than the last attempt's
  function nextSitting(cat) {
    var A = warriorAttempts(cat), last = A[A.length - 1];
    return last && okNum(last.n) ? last.n + 1 : A.length + 1;
  }

  /* The 55: every {a, b} with 1 ≤ a ≤ b ≤ 10, ten squares among them. */
  E.warriorPairs = function () {
    var out = [];
    for (var a = 1; a <= 10; a++) for (var b = a; b <= 10; b++) out.push([a, b]);
    return out;
  };
  /* The order the Counts are taught in (E.countSets: 1, 2, 5, 10, 9, 3, 6, 4, 8, 7 once chapter 10 is
   * built), as a rank: a table with no set yet comes after every taught one, the smaller first. */
  function taughtRank(stories) {
    var r = {};
    E.countSets(stories).forEach(function (c, i) { if (!own(r, c.table)) r[c.table] = i; });
    return function (t) { return own(r, t) ? r[t] : 1000 + t; };
  }
  /* A pair's anchor Count: of its two numbers, the one taught first (3 × 8 is eight patrols of three,
   * 9 × 7 seven cats' nine lives, 7 × 8 seven spiders). Its help is pictured in that Count's way. */
  E.warriorAnchor = function (a, b, stories, rank) {
    rank = rank || taughtRank(stories);
    return rank(a) <= rank(b) ? a : b;
  };
  /* Her hard facts for the Warrior Counts: E.hardFacts' rule over the 54 pairs other than 10 × 10 (a
   * slow right 10 × 10, three digits to type, is never one of the tricky ones): [[a, b]] as last
   * asked, the misses first, then the slowest. */
  E.warriorHard = function (cat, stories) {
    var mine = {};
    E.warriorPairs().forEach(function (p) { if (!(p[0] === 10 && p[1] === 10)) mine[pairKey(p[0], p[1])] = true; });
    return hardRule(cat, mine, stories);
  };

  /* The order (section 2): 10 × 10 last; a gentle first (a 1, 2 or 10 with a number up to 5); an easy
   * pair (a 1, 2, 5 or 10) at 2, 3 and first after each pause (15, 29, 43); the tricky ones at even
   * spacing over 4 to 54, never two in a row, never right after a pause; no two in a row sharing a
   * number, no number in more than two of any five in a row, never three in a row of the 21 pairs of
   * 3, 4, 6, 7, 8 and 9. The fill is greedy and starts over on the same stream when stuck; after
   * E.WARRIOR_STARTS[0] starts it keeps only the first of those three, after [1] it takes the last
   * resort, which cannot fail. Keys are "axb" with a ≤ b. */
  var W_KEYS = E.warriorPairs().map(function (p) { return pairKey(p[0], p[1]); });
  var W_PAIR = {}, W_AT = {};
  E.warriorPairs().forEach(function (p, i) { W_PAIR[pairKey(p[0], p[1])] = p; W_AT[pairKey(p[0], p[1])] = i; });
  function wHas(p, set) { return set.indexOf(p[0]) >= 0 || set.indexOf(p[1]) >= 0; }
  // each pair (by its place in E.warriorPairs) and its numbers (a square's once), as a list and as
  // bits, and its kind, worked out once: the fill runs on these, thousands of times in the tests
  var W_N = W_KEYS.length, W_NUMS = [], W_BITS = [], W_TIER = [], W_GENT = [], W_EASE = [];
  E.warriorPairs().forEach(function (p, i) {
    W_NUMS[i] = p[0] === p[1] ? [p[0]] : [p[0], p[1]];
    W_BITS[i] = (1 << p[0]) | (1 << p[1]);
    W_EASE[i] = wHas(p, W_EASY);
    W_TIER[i] = !W_EASE[i];
    W_GENT[i] = (W_GENTLE.indexOf(p[0]) >= 0 && p[1] <= 5) || (W_GENTLE.indexOf(p[1]) >= 0 && p[0] <= 5);
  });
  var W_LAST = W_AT[pairKey(10, 10)];
  function wShare(j, k) { return j >= 0 && k >= 0 && (W_BITS[j] & W_BITS[k]) !== 0; }
  function wShuffle(rnd, a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // whether the pair at i keeps the rules with what is placed around it (`relax`: only the first);
  // `out` holds pair numbers, -1 where nothing is placed yet
  var W_COUNT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  function wOkAt(out, i, relax) {
    var k = out[i], N = out.length, s, j, m;
    if ((i > 0 && wShare(k, out[i - 1])) || (i + 1 < N && wShare(k, out[i + 1]))) return false;
    if (relax) return true;
    for (s = Math.max(0, i - 4); s <= Math.min(i, N - 5); s++) {
      for (m = 1; m <= 10; m++) W_COUNT[m] = 0;
      for (j = s; j < s + 5; j++) {
        if (out[j] < 0) continue;
        var ns = W_NUMS[out[j]];
        for (m = 0; m < ns.length; m++) if (++W_COUNT[ns[m]] > 2) return false;
      }
    }
    var tier = function (x) { return x >= 0 && W_TIER[x]; };
    for (s = Math.max(0, i - 2); s <= Math.min(i, N - 3); s++) if (tier(out[s]) && tier(out[s + 1]) && tier(out[s + 2])) return false;
    return true;
  }
  // the tricky ones' places (1-based): even spacing over 4 to 54 with a little jitter, each moved to
  // the nearest place that is not 15, 29 or 43 (right after a pause) and touches no other
  function wSlots(rnd, k, N) {
    var lo = 4, hi = N - 1, span = hi - lo + 1, taken = {}, out = [];
    var bad = function (p) { return p < lo || p > hi || W_EASY_AT.indexOf(p) >= 0 || taken[p] || taken[p - 1] || taken[p + 1]; };
    for (var i = 0; i < k; i++) {
      var want = Math.round(lo - 0.5 + (i + 0.5 + (rnd() - 0.5) * 0.5) * span / k), at = null;
      for (var d = 0; d <= span && at == null; d++) {
        if (!bad(want + d)) at = want + d;
        else if (!bad(want - d)) at = want - d;
      }
      // (fifteen always fit: fourteen placed take at most 42 of the 51 places, and the pauses three)
      if (at != null) taken[at] = true;
      out.push(at);
    }
    return out;
  }
  // `tricky`: pair keys. Returns the 55 keys in order.
  function warriorOrder(rnd, tricky, giveUp, info) {
    var N = W_N, starts = 0, T = tricky.map(function (k) { return W_AT[k]; });
    for (;;) {
      starts++;
      var out = [], used = [], i;
      for (i = 0; i < N; i++) { out.push(-1); used.push(false); }
      out[N - 1] = W_LAST; used[W_LAST] = true;
      var order = wShuffle(rnd, T.slice()), slots = wSlots(rnd, order.length, N);
      // (a tricky pair with a 10 never sits at 54, beside 10 × 10, where no fill could save the start)
      var end = slots.indexOf(N - 1);
      if (end >= 0 && wShare(order[end], W_LAST)) {
        for (var s = 0; s < order.length; s++) if (s !== end && !wShare(order[s], W_LAST)) { var x = order[s]; order[s] = order[end]; order[end] = x; break; }
      }
      order.forEach(function (k, n) { if (slots[n] != null) { out[slots[n] - 1] = k; used[k] = true; } });
      var free = function (want) {
        var f = [];
        for (var k = 0; k < N; k++) if (!used[k] && (!want || want[k])) f.push(k);
        return f;
      };
      var done = function (how) {
        if (info) { info.starts = starts; info.relaxed = how === 'relaxed'; info.lastResort = how === 'last'; info.slots = slots; }
        return out.map(function (k) { return W_KEYS[k]; });
      };
      if (giveUp || starts > E.WARRIOR_STARTS[1]) {
        // the last resort: rules 1 to 3 by construction (at most twelve of the fourteen gentle pairs
        // can be tricky, so two are always free), rule 4 not looked at
        var put = function (at, k) { out[at] = k; used[k] = true; };
        if (out[0] < 0) put(0, wShuffle(rnd, free(W_GENT))[0]);
        W_EASY_AT.forEach(function (p) { if (out[p - 1] < 0) put(p - 1, wShuffle(rnd, free(W_EASE))[0]); });
        var rest = wShuffle(rnd, free(null));
        for (i = 0; i < N; i++) if (out[i] < 0) put(i, rest.shift());
        return done('last');
      }
      var relax = starts > E.WARRIOR_STARTS[0], ok = true;
      for (i = 0; i < N && ok; i++) {
        if (out[i] >= 0) { if (!wOkAt(out, i, relax)) ok = false; continue; }
        var pos = i + 1, want = pos === 1 ? W_GENT : W_EASY_AT.indexOf(pos) >= 0 ? W_EASE : null;
        // the free pairs in a random order, drawn one at a time until one fits (a shuffle that stops early)
        var pool = free(want), got = -1;
        for (var j = 0; j < pool.length && got < 0; j++) {
          var r = j + Math.floor(rnd() * (pool.length - j)), y = pool[r];
          pool[r] = pool[j]; pool[j] = y;
          out[i] = y;
          if (wOkAt(out, i, relax) && (out[i + 1] < 0 || wOkAt(out, i + 1, relax))) got = y;
        }
        if (got < 0) { out[i] = -1; ok = false; }
        else used[got] = true;
      }
      if (ok) return done(relax ? 'relaxed' : 'kept');
    }
  }
  // the sitting's stream: from `now` and the sitting's number, so the same `now` gives the same order
  function warriorSeed(now, n) {
    var t = Math.floor(Math.abs(num(now, 0))), lo = t % 4294967296, hi = Math.floor(t / 4294967296) % 4294967296;
    return (lo ^ Math.imul(hi | 0, 0x85EBCA6B) ^ Math.imul((n | 0) + 1, 0x9E3779B1)) >>> 0;
  }
  // 10 × 10's own lines: the caption and Glintstar's balloon, her shout, its miss line
  function warriorFinale() {
    var f = isObj(warriorLines().last) ? warriorLines().last : {};
    return {
      prompt: f.prompt != null ? clone(f.prompt) : [{ text: 'At last:', kind: 'caption' }, { who: 'glintstar', text: 'Ten times ten.' }],
      right: f.right != null ? clone(f.right) : [{ who: 'player', text: 'A HUNDRED!', kind: 'shout' }],
      missLast: f.missLast != null ? clone(f.missLast) : 'There. A hundred. And that’s every Count!'
    };
  }
  /* The sitting's queue: 55 { a, b, table, prompt, hard? } in section 2's order. `table` is the pair's
   * anchor; `prompt` Glintstar's balloon ("Seven times eight."); her own hard facts (the first
   * E.WARRIOR_TRICKY of E.warriorHard) carry `hard: true`, so a right one earns the `remembered` line;
   * 10 × 10, last, carries its caption in its prompt, its `right` and its `missLast`, and never `hard`.
   * Each pair that is not a square is shown one way round or the other, afresh every sitting.
   * `opts.giveUp` forces the last resort (for the test); `opts.info`, an object, is told how the order
   * was made ({ starts, relaxed, lastResort, slots, tricky }). */
  E.warriorFacts = function (cat, stories, now, opts) {
    opts = opts || {};
    var rnd = mulberry32(warriorSeed(now, nextSitting(cat)));
    var orient = {};
    W_KEYS.forEach(function (k) { var p = W_PAIR[k]; orient[k] = p[0] === p[1] || rnd() < 0.5 ? [p[0], p[1]] : [p[1], p[0]]; });
    var hard = {}, tricky = [], inT = {};
    E.warriorHard(cat, stories).slice(0, E.WARRIOR_TRICKY).forEach(function (f) { hard[pairKey(f[0], f[1])] = true; });
    Object.keys(hard).concat(E.WARRIOR_NEW.map(function (f) { return pairKey(f[0], f[1]); })).forEach(function (k) {
      if (!inT[k] && W_PAIR[k] && k !== pairKey(10, 10)) { inT[k] = true; tricky.push(k); }
    });
    var info = isObj(opts.info) ? opts.info : null;
    var keys = warriorOrder(rnd, tricky, !!opts.giveUp, info);
    if (info) info.tricky = tricky.slice();
    var rank = taughtRank(stories), fin = warriorFinale();
    return keys.map(function (k) {
      var p = orient[k], q = { a: p[0], b: p[1], table: E.warriorAnchor(p[0], p[1], stories, rank) };
      if (k === pairKey(10, 10)) { q.prompt = fin.prompt; q.right = fin.right; q.missLast = fin.missLast; return q; }
      q.prompt = [{ who: 'glintstar', text: cap1(E.countWords(p[0])) + ' times ' + E.countWords(p[1]) + '.' }];
      if (hard[k]) q.hard = true;
      return q;
    });
  };
  /* The sitting's set: Tallyheart's sand and PC.warrior's lines. No `table`, so every answer logs its
   * anchor as its `table`; no `fastAfterMiss` ("You didn't even look at the sand" could land forty
   * questions after the sand); `missLast` the four, which E.warriorAsk hands out in turn. */
  var W_SET_LINES = ['praise', 'fast', 'remembered', 'rememberedSlow', 'missLast'];
  E.warriorDef = function (stories) {
    var c = warriorLines(), def = { id: 'warrior', teacher: 'tallyheart', ground: 'sand', ask: '{a} × {b}' };
    W_SET_LINES.forEach(function (k) { if (c[k] != null) def[k] = clone(c[k]); });
    return def;
  };
  /* The set a question is asked as, in place of E.questionDef: the sitting's, with only the picture
   * and the help openings of its anchor's E.hollowDef (so its help is scratched in that Count's way,
   * with that Count's first lines); nothing else of the anchor's, so none of its remembered,
   * fastAfterMiss, miss, again, prompt or helpCounter comes in. Its `missLast` is one line: the
   * sitting's list in turn, by the misses in the sitting so far (never one twice running). */
  var W_ASK_KEYS = ['table', 'thing', 'things', 'unit', 'units', 'picture',
    'helpIntro', 'helpIntroFar', 'helpIntroNotFive', 'helpIntroNotTen', 'helpIntroTens', 'helpIntroOneTuck', 'helpIntroNotNine'];
  E.warriorAsk = function (def, st, q, stories) {
    def = def || E.warriorDef(stories);
    var t = q && okNum(q.table) ? q.table : q ? E.warriorAnchor(q.a, q.b, stories) : 1;
    var A = E.hollowDef(stories, t), D = {};
    Object.keys(def).forEach(function (k) { D[k] = def[k]; });
    W_ASK_KEYS.forEach(function (k) { if (A[k] != null) D[k] = clone(A[k]); else delete D[k]; });
    var lines = asList(def.missLast), misses = st && Array.isArray(st.log) ? st.log.filter(function (e) { return e && !e.correct; }).length : 0;
    if (lines.length) D.missLast = pick(lines, misses); else delete D.missLast;
    return D;
  };
  // the time of her latest logged Counts answer (chapters, the Hollow, the sittings), else 0; and, the take-aways kit
  // (docs/take-aways.md, section 4), her latest take-away's (`cat.takes.log`: absent, nothing more is read)
  function lastAnswerAt(cat) {
    var t = 0;
    ((cat && cat.counts) || []).concat(takeLog(cat)).forEach(function (e) { if (e && okNum(e.at) && e.at > t) t = e.at; });
    return t;
  }
  // a sitting left partway: why it no longer picks up ('practice': a Counts answer from anything else
  // came after its last answer, before its two hours were up; 'late': two hours went by), or null. A take-away is
  // practice as any lesson answer is (section 4: a problem is the answer, logged when its last column is in, so a
  // digit typed and its problem left sets nothing aside); a cat with no `takes` reads `counts` alone, as before
  function warriorStale(cat, S, now) {
    var at = num(S.at, 0), first = null;
    ((cat && cat.counts) || []).concat(takeLog(cat)).forEach(function (e) {
      if (e && e.set !== 'warrior' && num(e.at, 0) > at && (first == null || e.at < first)) first = e.at;
    });
    if (first != null && first < at + E.WARRIOR_PAUSE_MS) return 'practice';
    if (num(now, 0) - at >= E.WARRIOR_PAUSE_MS) return 'late';
    return null;
  }
  // an attempt from a sitting's state: finished (all 55 in) or set aside (`aside`)
  function warriorAttempt(cat, st, aside) {
    var sum = C.summary(st), log = st.log || [], end = log[log.length - 1];
    var times = log.filter(function (e) { return e && e.correct && okNum(e.ms); }).map(function (e) { return e.ms; });
    var a = {
      n: nextSitting(cat), at: num(st.startedAt, 0), done: end ? num(end.at, 0) : num(st.startedAt, 0),
      finished: !!sum.finished, answered: log.length, right: sum.firstTry, passed: false,
      // (only real pairs: a hand-edited log never puts junk in a chip, and a second migrate changes nothing)
      missed: log.filter(function (e) { return e && !e.correct && wInt(e.a) && wInt(e.b); }).map(function (e) { return [e.a, e.b]; }),
      ms: times.length ? Math.round(median(times)) : null,
      seen: !!aside   // a finished attempt's result is shown until it is seen; a set-aside one has none
    };
    a.passed = a.finished && a.right >= E.WARRIOR_PASS;
    if (aside) a.aside = aside;
    return a;
  }
  function keepAttempt(W, a) {
    W.attempts.push(a);
    if (W.attempts.length > E.WARRIOR_KEEP) W.attempts.splice(0, W.attempts.length - E.WARRIOR_KEEP);
  }
  function sameSitting(S, st) { return !!(S && isObj(S.state) && (S.state === st || (okNum(st.startedAt) && S.state.startedAt === st.startedAt))); }
  // a sitting whose last answer is in but was never recorded: one finished attempt, at any age
  function settleSitting(cat) {
    var W = warriorData(cat, false), S = W && W.sitting;
    if (!S || !isObj(S.state) || !C.done(S.state)) return null;
    var r = E.warriorFinish(cat, S.state);
    if (W.sitting === S) W.sitting = null;
    return r;
  }
  /* A sitting's end: its attempt (E.counts.summary: `firstTry` is her right count), timed by its last
   * answer, so it needs no clock of its own; `passedAt` on a first pass, never moved after; the
   * sitting cleared. Recorded once (a second call returns null). Returns { attempt, passed,
   * firstPass, clean }. */
  E.warriorFinish = function (cat, st) {
    if (!cat || !st || st.mode !== 'warrior' || !C.done(st)) return null;
    var W = warriorData(cat, true);
    if (st.recorded) { if (sameSitting(W.sitting, st)) W.sitting = null; return null; }
    var a = warriorAttempt(cat, st, null);
    keepAttempt(W, a);
    st.recorded = true;
    var firstPass = a.passed && !(W.passedAt > 0);
    if (firstPass) W.passedAt = Math.max(1, a.done);
    if (sameSitting(W.sitting, st)) W.sitting = null;
    return { attempt: clone(a), passed: a.passed, firstPass: firstPass, clean: a.finished && a.right === W_KEYS.length };
  };
  /* The sitting to run: a done one is settled first; one in progress within E.WARRIOR_PAUSE_MS, with
   * no other Counts answer since its last, is picked up (its `at` moved to now: two hours from when she
   * was last there); else a stale one becomes an unfinished attempt (`aside`; dropped when it has no
   * answer) and a new one starts: the runner's own start with `mode: 'warrior'`, every fact's requeues
   * at E.MAX_REQUEUE (a miss is logged once and never asked again), `shown: true` (the 9s' digits line
   * from the first question, as in the Hollow), `crowd` (the whole Clan watches until she has a
   * finished sitting), `beats` (the pauses shown) and `aside` (why the sitting before it was set aside
   * or dropped, else null: its opening's reason). Saved as `warrior.sitting`; `warrior` is created on
   * her first. Returns { def, state, opening }. */
  E.warriorBegin = function (cat, stories, now) {
    var W = warriorData(cat, true);
    settleSitting(cat);
    var S = W.sitting, st = null;
    // (picked up: her coming back counts as being there, so the two hours run from now, not from her last
    // answer, and a sitting picked up late in its two hours never goes stale before she answers again;
    // nothing is skipped: a pick-up means no other Counts answer came in since S.at)
    if (S && isObj(S.state) && !warriorStale(cat, S, now)) { st = S.state; S.at = Math.max(num(S.at, 0), num(now, 0)); }
    else {
      // (why it was set aside, on the new sitting, so its opening says this reason, once: a sitting with
      // no answer is dropped, never recorded, and still has its reason)
      var why = S && isObj(S.state) ? warriorStale(cat, S, now) || 'late' : null;
      if (S && isObj(S.state) && Array.isArray(S.state.log) && S.state.log.length) keepAttempt(W, warriorAttempt(cat, S.state, why));
      W.sitting = null;
      var def = E.warriorDef(stories);
      st = C.start(def, { facts: E.warriorFacts(cat, stories, now), set: 'warrior', mode: 'warrior', now: now });
      st.queue.forEach(function (q) { st.requeues[factKey(q.a, q.b)] = E.MAX_REQUEUE; });
      st.shown = true;
      st.crowd = !W.attempts.some(function (a) { return a && a.finished; });
      st.beats = [];
      st.aside = why;
      // (never earlier than her latest logged answer: a device clock set back after she played would
      // otherwise put her chapter or Hollow answers "after" the new sitting, which is then stale as
      // 'practice' from its first answer, and she could not take the Counts until the clock passed them)
      // her latest answer's time only when it is less than two hours ahead of the clock (a clock set back a
      // little); further ahead, the clock's own time, so practice and the pause still set a sitting aside
      var last = lastAnswerAt(cat), t = num(now, 0);
      W.sitting = { at: last > t && last - t < E.WARRIOR_PAUSE_MS ? last : t, state: st };
    }
    if (now) cat.updated = now;
    return { def: E.warriorDef(stories), state: st, opening: E.warriorOpen(cat, st) };
  };
  /* The opening: 'resume' for a sitting picked up with an answer in it; else the sitting's own, 'first'
   * (no attempt yet: one set aside with no answer was never one), 'again' (attempts, none finished:
   * the crowd again) or 'quiet'; and `aside`, on 'again' and 'quiet', why the sitting before this one was
   * set aside or dropped: the reason E.warriorBegin put on this sitting (`st.aside`), so it is said once
   * and is this set-aside's own (a sitting saved without the key: the last attempt's, as before). The
   * first opening never says one: she had begun nothing. */
  E.warriorOpen = function (cat, st) {
    var A = warriorAttempts(cat), prev = A[A.length - 1] || null;
    var kind = st && Array.isArray(st.log) && st.log.length ? 'resume'
      : !A.length ? 'first' : A.some(function (a) { return a && a.finished; }) ? 'quiet' : 'again';
    var why = st && own(st, 'aside') ? st.aside : prev ? prev.aside : null;
    var aside = (kind === 'again' || kind === 'quiet') && (why === 'late' || why === 'practice') ? why : null;
    return { kind: kind, aside: aside, crowd: !!(st && st.crowd) };
  };
  /* After an answer that is not the last: the sitting kept, with the time its last answer went in. */
  E.warriorKeep = function (cat, st, now) {
    var W = warriorData(cat, true);
    // (never moved back: a sitting's `at` stays at or after her latest answer, as E.warriorBegin set it)
    W.sitting = { at: Math.max(num(now, 0), sameSitting(W.sitting, st) ? num(W.sitting.at, 0) : 0), state: st };
    if (now) cat.updated = now;
    return W.sitting;
  };
  /* The pause due before the next question: 14 (Tallyheart's line), 28 (the halfway page) or 42, each
   * once a sitting (kept in `st.beats`, so a page picked up after it never shows it again; `opts.peek`
   * only looks); else 0. Never after the last answer. */
  E.warriorBeat = function (st, opts) {
    if (!st || C.done(st)) return 0;
    var at = st.pos;
    if (E.WARRIOR_BEATS.indexOf(at) < 0) return 0;
    if (!Array.isArray(st.beats)) st.beats = [];
    if (st.beats.indexOf(at) >= 0) return 0;
    if (!(opts && opts.peek)) st.beats.push(at);
    return at;
  };
  /* The four paw prints, each 0 to 1: one a quarter (14, 14, 14 and 13 questions). The one she is on
   * fills a little at every answer, a miss the same as a right one; how far, never how well. */
  E.warriorPaws = function (st) {
    var n = st && okNum(st.pos) ? st.pos : 0, total = st && Array.isArray(st.queue) && st.queue.length ? st.queue.length : W_KEYS.length;
    var bounds = [0].concat(E.WARRIOR_BEATS, [total]), out = [];
    for (var i = 0; i + 1 < bounds.length; i++) out.push(Math.max(0, Math.min(1, (n - bounds[i]) / (bounds[i + 1] - bounds[i]))));
    return out;
  };
  function warriorPaw(st) {
    var n = st && okNum(st.pos) ? st.pos : 0, k = 1;
    E.WARRIOR_BEATS.forEach(function (b) { if (n >= b) k++; });
    return k;
  }
  /* The tricky Counts of some misses: each missed pair counts for both its numbers (a square once);
   * the one or two tables with the most, ties to the one taught later, never the 1s. */
  function trickyTables(missed, stories) {
    var rank = taughtRank(stories), n = {};
    asList(missed).forEach(function (p) {
      (p[0] === p[1] ? [p[0]] : [p[0], p[1]]).forEach(function (t) { if (t !== 1) n[t] = (n[t] || 0) + 1; });
    });
    return Object.keys(n).map(Number).sort(function (x, y) { return n[y] - n[x] || rank(y) - rank(x); }).slice(0, 2);
  }
  /* The result of her latest finished attempt, so the hub can show it again while it is unseen:
   * { attempt, right, last, short, missed (up to six, the named Counts' first), tricky (the tables
   * named), tokens (for E.fill, in number words: {right} {Right} {last} {Last} {short}; and {tricky}
   * {Tricky}, "the 7s and the 8s"), seen, variant }.
   * `variant`: { kind: 'pass' | 'notYet' | 'afterPass', clean (55 right), quiet (a sitting without the
   * crowd), nth: which not-yet ('first', 'second', 'later'), number (her number is said: on a not-yet,
   * 45 or more, or more than last time; after the pass, 50 to 54), tone ('better', 'close' on 47 to 49,
   * 'plain' under 45, else null), keys (the story's keys that apply, as 'notYet.first'; 'pass.quiet' for
   * a pass in a quiet sitting; 'afterPass.number') }. Null before a finished attempt. */
  E.warriorResult = function (cat, stories) {
    var A = warriorAttempts(cat), at = latestFinished(A);
    if (at < 0) return null;
    var att = A[at], before = A.slice(0, at), done = before.filter(function (a) { return a && a.finished; });
    var prev = done[done.length - 1] || null, passedAt = cat && cat.warrior ? num(cat.warrior.passedAt, 0) : 0;
    var after = passedAt > 0 && (!att.passed || before.some(function (a) { return a && a.passed; }) || passedAt < num(att.done, 0));
    var kind = after ? 'afterPass' : att.passed ? 'pass' : 'notYet';
    var right = num(att.right, 0), last = prev ? num(prev.right, 0) : null;
    var v = { kind: kind, clean: kind !== 'notYet' && right === W_KEYS.length, quiet: after || done.length > 0, nth: null, number: false, tone: null, keys: [kind] };
    if (v.clean) v.keys.push(kind + '.clean');
    if (kind === 'pass' && v.quiet) v.keys.push('pass.quiet');   // a pass in a quiet sitting: the Clan comes running
    // a sitting again after the pass says her number only when it is good news (decision 49): a passing
    // score, 50 to 54 (55 is `clean`, its own words); under 50, no number
    if (kind === 'afterPass' && !v.clean && right >= E.WARRIOR_PASS) { v.number = true; v.keys.push('afterPass.number'); }
    if (kind === 'notYet') {
      var k = done.filter(function (a) { return !a.passed; }).length + 1, better = last != null && right > last;
      v.nth = k === 1 ? 'first' : k === 2 ? 'second' : 'later';
      v.number = right >= 45 || better;
      v.tone = better ? 'better' : right >= 47 ? 'close' : right < 45 ? 'plain' : null;
      v.keys.push('notYet.' + v.nth);
      if (v.number) v.keys.push('notYet.number');
      if (v.tone) v.keys.push('notYet.' + v.tone);
    }
    var tricky = trickyTables(att.missed, stories);
    var named = function (p) { return tricky.indexOf(p[0]) >= 0 || tricky.indexOf(p[1]) >= 0; };
    // the named Counts' misses first; within each, a pair with a 1 last (1 × 8 is a slip more than a tricky one)
    var one = function (p) { return p[0] === 1 || p[1] === 1; };
    var by = function (L) { return L.filter(function (p) { return !one(p); }).concat(L.filter(one)); };
    var M = asList(att.missed);
    var missed = by(M.filter(named)).concat(by(M.filter(function (p) { return !named(p); }))).slice(0, 6);
    var short = Math.max(0, E.WARRIOR_PASS - right), named2 = andList(tricky.map(function (t) { return 'the ' + t + 's'; }));
    return {
      attempt: clone(att), right: right, last: last, short: short, missed: clone(missed), tricky: tricky, seen: !!att.seen, variant: v,
      tokens: { right: E.countWords(right), Right: cap1(E.countWords(right)), last: last != null ? E.countWords(last) : '', Last: last != null ? cap1(E.countWords(last)) : '',
        short: E.countWords(short), tricky: named2, Tricky: cap1(named2) }
    };
  };
  /* The result's last button: her latest finished attempt is seen. True when that changed anything. */
  E.warriorSeen = function (cat) {
    var A = warriorAttempts(cat), at = latestFinished(A);
    if (at < 0 || A[at].seen === true) return false;
    A[at].seen = true;
    return true;
  };
  /* For the hub and the grown-ups corner (a done sitting settled first): `open` (chapter 10 finished),
   * `passed`, `passedAt`, `sat` (any attempt or sitting), `sitting` to pick up ({ at, answered, paw:
   * 1 to 4, paws }; one with an answer in it, none once stale, and then `stale` says why it will be set
   * aside), `unseen` (the latest finished attempt's result not yet seen), `notYet` (her latest finished
   * attempt, before any pass, did not pass), `attempts` and `last` (the latest finished). */
  E.warriorState = function (cat, stories, now) {
    if (cat && isObj(cat.warrior)) settleSitting(cat);
    var W = warriorData(cat, false), A = W ? W.attempts : [], S = W ? W.sitting : null;
    var why = S && isObj(S.state) ? warriorStale(cat, S, now) : null, at = latestFinished(A), last = at >= 0 ? A[at] : null;
    var passed = warriorPassed(cat);
    return {
      open: E.isFinished(cat, warriorAfter()),
      passed: passed, passedAt: W ? num(W.passedAt, 0) : 0,
      sat: A.length > 0 || !!S,
      // (a sitting to pick up has an answer in it: one opened and left before its first answer has nothing
      // to keep going with; E.warriorBegin still picks it up within its two hours and plays its opening)
      sitting: S && isObj(S.state) && !why && Array.isArray(S.state.log) && S.state.log.length ? { at: num(S.at, 0), answered: S.state.log.length, paw: warriorPaw(S.state), paws: E.warriorPaws(S.state) } : null,
      stale: S && why ? why : null,
      unseen: !!(last && last.seen === false),
      notYet: !!(last && !passed && !last.passed),
      attempts: clone(A), last: last ? clone(last) : null
    };
  };
  /* E.hollowLines with `warrior` data: while a sitting with an answer in it is paused (`opts.now` to
   * tell a stale one), the waiting line; while she has not passed and her latest finished attempt is a
   * not-yet whose result she has seen (Glintstar says it first), the tricky greeting and `tricky: true`
   * on the Counts whose missed pairs are still hard (E.warriorHard). A
   * Count's paw goes once none of its missed pairs is hard; the greeting names only the Counts still
   * marked ("the tricky one" when one pair is left in them), and goes with the last paw. After a round
   * (`opts.reward`) the reward line keeps its place, unless `opts.tricky`: the first Hollow page after a
   * round she went back to from a not-yet, where the greeting was waiting (section 5). The page says
   * the waiting line in the greeting's place (a Count in the Hollow is a times table: "Warrior Counts"). */
  E.WARRIOR_WAITING = 'Your Warrior Counts are waiting at the fountain. Finish them first, or practice now and start them fresh later.';
  function warriorHollow(out, cat, stories, opts) {
    var W = cat.warrior, S = isObj(W.sitting) ? W.sitting : null;
    // (waiting: a sitting with an answer in it; setting one aside with none loses nothing)
    if (S && isObj(S.state) && !C.done(S.state) && Array.isArray(S.state.log) && S.state.log.length && !warriorStale(cat, S, opts.now != null ? opts.now : S.at)) out.waiting = E.WARRIOR_WAITING;
    if (warriorPassed(cat)) return;
    var A = warriorAttempts(cat), at = latestFinished(A), last = at >= 0 ? A[at] : null;
    // (a not-yet whose result is unseen: the Hollow never says it before Glintstar does)
    if (!last || last.passed || last.seen === false) return;
    var hard = pairSet(E.warriorHard(cat, stories)), missed = asList(last.missed);
    var still = missed.filter(function (p) { return Array.isArray(p) && hard[pairKey(p[0], p[1])]; });
    var here = {};
    out.counts.forEach(function (c) { here[c.table] = true; });
    var marked = trickyTables(missed, stories).filter(function (t) {
      return here[t] && still.some(function (p) { return p[0] === t || p[1] === t; });
    });
    if (!marked.length) return;
    out.counts.forEach(function (c) { if (marked.indexOf(c.table) >= 0) c.tricky = true; });
    out.tricky = marked;
    var left = still.filter(function (p) { return marked.some(function (t) { return p[0] === t || p[1] === t; }); }).length;
    if (!opts.reward || opts.tricky) out.greet = cap1(andList(marked.map(function (t) { return 'the ' + t + 's'; }))) + ' first? I’ve got the tricky ' + (left === 1 ? 'one' : 'ones') + ' ready.';
  }
  /* The save's `warrior` (section 6), from E.migrate: attempts that are objects with a numeric `right`
   * (0 to 55) and `at`, in their shape (a stored `passed` kept; bad pairs out of `missed`; `seen` true
   * unless it is false; `aside` only 'late' or 'practice'), the last E.WARRIOR_KEEP; the sitting only
   * when the runner can take it up (E.okLesson), its mode 'warrior', its `at` a number, its queue 55
   * distinct pairs in 1 to 10 and its `beats` numbers; `passedAt` when positive, else the first passed
   * attempt's `done`, else 0. Idempotent. (normCat settles a done sitting.) */
  function wInt(v) { return typeof v === 'number' && v === Math.floor(v) && v >= 1 && v <= 10; }
  function okWarriorPair(p) { return Array.isArray(p) && p.length === 2 && wInt(p[0]) && wInt(p[1]); }
  function okSitting(S) {
    if (!isObj(S) || !okNum(S.at) || !okLesson({ state: S.state })) return false;
    var st = S.state, seen = {};
    if (st.mode !== 'warrior' || !Array.isArray(st.beats) || !st.beats.every(okNum) || st.queue.length !== W_KEYS.length) return false;
    return st.queue.every(function (q) {
      if (!wInt(q.a) || !wInt(q.b)) return false;
      var k = pairKey(q.a, q.b);
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
  }
  function normAttempt(a, prevN) {
    var missed = (Array.isArray(a.missed) ? a.missed : []).filter(okWarriorPair).map(function (p) { return [p[0], p[1]]; });
    var finished = typeof a.finished === 'boolean' ? a.finished : num(a.answered, 0) >= W_KEYS.length;
    var x = {
      n: okNum(a.n) && a.n >= 1 ? a.n : prevN + 1,
      at: a.at,
      done: okNum(a.done) ? a.done : a.at,
      finished: finished,
      answered: okNum(a.answered) && a.answered >= 0 && a.answered <= W_KEYS.length ? a.answered : finished ? W_KEYS.length : Math.min(W_KEYS.length, a.right + missed.length),
      right: a.right,
      passed: typeof a.passed === 'boolean' ? a.passed : finished && a.right >= E.WARRIOR_PASS,
      missed: missed,
      ms: okNum(a.ms) && a.ms >= 0 ? a.ms : null,
      seen: a.seen !== false
    };
    if (a.aside === 'late' || a.aside === 'practice') x.aside = a.aside;
    return x;
  }
  function normWarrior(w) {
    var out = { sitting: null, attempts: [], passedAt: 0 }, prevN = 0;
    (Array.isArray(w.attempts) ? w.attempts : []).forEach(function (a) {
      if (!isObj(a) || !okNum(a.right) || a.right < 0 || a.right > W_KEYS.length || !okNum(a.at)) return;
      var x = normAttempt(a, prevN);
      prevN = x.n;
      out.attempts.push(x);
    });
    if (out.attempts.length > E.WARRIOR_KEEP) out.attempts = out.attempts.slice(-E.WARRIOR_KEEP);
    if (okSitting(w.sitting)) out.sitting = { at: w.sitting.at, state: w.sitting.state };
    if (okNum(w.passedAt) && w.passedAt > 0) out.passedAt = w.passedAt;
    else {
      var p = out.attempts.filter(function (a) { return a.passed; })[0];
      out.passedAt = p ? Math.max(1, num(p.done, 0)) : 0;
    }
    return out;
  }

  /* ------------------------------------------------------------ the take-aways kit
   * docs/take-aways.md (v0.3; decisions 53 and 54): three-digit subtraction with regrouping, written in a
   * column and answered a column at a time, ones first, with OK. A take set is a Counts set with `op: '-'`
   * on an ordinary Counts frame (section 3), run by its own runner (E.takes) on its own page. The plan
   * (E.takePlan) is the US decomposition column by column; a wrong digit is named (E.takeSlip) and helped
   * in the sand (E.takeHelp), and the problem comes back as a twin (E.takeTwin) of the same shape. Every
   * answer goes into its own log, `cat.takes` (optional, absent until her first take-away is logged: the
   * save stays version 2), never `counts`, so nothing that reads `counts` ever sees a take-away (section
   * 4). Every word the kit says is in E.TAKE_LINES, the maths words as tokens filled at call time from
   * E.TAKE_WORDS, which reads PC.words (chapter 12 brings it) over the English. Nothing here is reached
   * before chapter 12: no chapter 1 to 11 has a take set. Columns are numbered ones first (0 the ones, 1
   * the tens, 2 the hundreds) everywhere: a plan's `cols`, a state's `got`, `first` and `cols`, a slip's
   * `col`, the marks. A log entry's `given` is the one thing written left to right, as an answer reads.
   * It also holds the Hollow's shelf and Count the store (E.hollowShelf, E.takeRoundStart, E.takeRoundFinish),
   * the cross-table Counts warm-up (E.lessonFacts and E.questionDef, behind `warmHard.table === 'all'`), a
   * take-away read as practice by a waiting Warrior Counts re-sit (warriorStale, lastAnswerAt) and the
   * grown-ups' table (E.takeTable). */
  E.TAKE_KINDS = ['none', 'ones', 'tens', 'both', 'zero', 'zeros'];
  E.TAKE_STEPS = ['none', 'ones2', 'ones', 'tens', 'both', 'mixed', 'zero', 'zeros'];
  E.TAKE_SLIPS = ['zero', 'flip', 'nospread', 'kept', 'extra', 'fact'];   // named in this order: the first that matches
  E.TAKE_REGROUP = ['show', 'tap', 'hers'];
  // Count the store's templates by step (section 5): the chapters' own problems, and two of the store's own
  E.TAKE_TEMPLATES = {
    none: [[58, 23], [475, 132]], ones2: [[43, 16], [70, 34]], ones: [[352, 127], [640, 218], [352, 28]],
    tens: [[526, 254], [607, 283]], both: [[432, 178], [811, 356]], mixed: [[382, 345], [731, 696]],
    zero: [[702, 345], [403, 57]], zeros: [[400, 156], [500, 412]]
  };
  E.TAKE_TRIES = 400;        // a twin's draws, read at call time; then the problem itself, asked again
  E.TAKE_ROUND = 5;          // problems in a Count the store round
  E.TAKE_LOG_CAP = 500;      // take-aways kept per cat: four cats at both caps stay near 1.4M characters, half the quota Potion Lab shares
  E.FROST_TREASURES = [      // a full store round's treasures, in turn by the store's own rounds (section 5)
    { id: 'frost-leaf', name: 'A frosted leaf' },
    { id: 'snow-feather', name: 'A snow-white feather' },
    { id: 'acorn-cap', name: 'An acorn cap' },
    { id: 'river-pebble', name: 'A smooth river pebble' }
  ];
  var TAKE_OK_MS = 400;                          // keys ignored after every OK (the guard "Got it!" has: padLockedUntil)
  var TAKE_COLS = ['ones', 'tens', 'hundreds'];  // the columns, ones first: their names in E.TAKE_WORDS' keys

  /* E.TAKE_WORDS: the kit's maths words, each form a key (the token that says it in E.TAKE_LINES: {rows},
   * {Spread} …). Read at call time from PC.words, whose top-level keys of these names win over the English
   * (any other key, Spanish beside them, is the chapters' own); a lower-case form given alone brings its
   * capital with it ("trade" gives "Trade"). The regrouping word is used in its base form only, before what
   * it acts on or after it, never before a pronoun (section 8), so any of "spread", "trade", "regroup",
   * "break apart" fits every slot. */
  var TAKE_WORDS_EN = {
    loose: 'loose', row: 'row', rows: 'rows', Row: 'Row', square: 'square', squares: 'squares',
    ones: 'ones', tens: 'tens', hundreds: 'hundreds', takeAway: 'take away', TakeAway: 'Take away',
    spread: 'spread', Spread: 'Spread', OnesFirst: 'Ones first'
  };
  var TAKE_CAPS = { Row: 'row', TakeAway: 'takeAway', Spread: 'spread' };
  function wordOk(v) { return typeof v === 'string' && v !== ''; }
  function takeWords() {
    var w = {}, src = isObj(PC.words) ? PC.words : null;
    Object.keys(TAKE_WORDS_EN).forEach(function (k) { w[k] = src && own(src, k) && wordOk(src[k]) ? src[k] : TAKE_WORDS_EN[k]; });
    if (src) Object.keys(TAKE_CAPS).forEach(function (k) {
      var lo = TAKE_CAPS[k];
      if (!(own(src, k) && wordOk(src[k])) && own(src, lo) && wordOk(src[lo])) w[k] = cap1(src[lo]);
    });
    return w;
  }
  Object.defineProperty(E, 'TAKE_WORDS', { enumerable: true, configurable: true, get: takeWords });

  /* E.TAKE_LINES: every line the kit says. A value is a line, a list (taken in turn: praise, again), or an
   * object of forms: by the column whose turn it is ('ones', 'tens', 'hundreds'), with 'Zero' after it
   * where her top there is 0 ("No rows." where "Only zero rows" would stand), by the step
   * (rememberedStep), or 'some' and 'none' (what a sweep leaves). Number tokens are number words: {top}
   * (the top as it stands, or after its spread where a line says so), {bottom}, {first}, {rest}, {left},
   * {digit}, and {A} and {B}, the problem's own numbers; a capital ({Top}) starts a sentence ({A} always
   * does, {B} never). A count before a noun agrees with it ("one row", "two rows"). The word tokens are
   * E.TAKE_WORDS' keys; no maths word is written into a line. The cat's tokens ({name} …) are left for the
   * page. A set's `lines` may override any key, with a value of the same kind. */
  E.TAKE_LINES = {
    // the column's line as it is outlined (section 1): its name, then what it asks
    colName: { ones: '{OnesFirst}.', tens: 'Now the {tens}.', hundreds: 'Now the {hundreds}.' },
    colFirst: '{OnesFirst}. {Top} {takeAway} {bottom}.',
    colHers: '{TakeAway} {bottom}.',
    colShown: '{Top} {takeAway} {bottom}.',
    nothingHers: 'Nothing to take.',
    nothingShown: 'Nothing to take: {top}.',
    ask: '{A} {takeAway} {B}.',
    schoolWords: 'A {row} is a ten. A {square} is a hundred.',
    blank: { tens: 'No {rows} left. We don’t write a zero in front.', hundreds: 'No {squares} left. We don’t write a zero in front.' },
    onesFirst: '{OnesFirst}: this box, on the right.',
    // 'tap': the zone to tap glows (tapHere's forms are by that zone)
    tap: { ones: 'Not enough {loose}. {Spread} a {row}: tap it.', tens: 'Not enough {rows}. {Spread} a {square}: tap it.' },
    tapSquare: 'Not enough {loose}, and no {rows}. {Spread} a {square}: tap it.',
    tapRow: 'Now tap a {row}.',
    tapHere: { tens: 'The {rows}: up here.', hundreds: 'The {squares}: up here.' },
    // 'show', and the spreads a help draws
    showOpen: {
      ones: '{Top} {takeAway} {bottom}? Only {top} {loose}. Not enough.', tens: '{Top} {takeAway} {bottom}? Only {top} {rows}. Not enough.',
      onesZero: '{Top} {takeAway} {bottom}? No {loose}. Not enough.', tensZero: '{Top} {takeAway} {bottom}? No {rows}. Not enough.'
    },
    showSpread: {
      ones: 'So I {spread} a {row}: ten more {loose}.', tens: 'So I {spread} a {square}: ten more {rows}.',
      onesZero: 'So I {spread} a {row}: ten {loose}.', tensZero: 'So I {spread} a {square}: ten {rows}.'
    },
    chainSquare: 'So a {square} first: ten {rows}.',
    chainRow: { ones: 'Now a {row}: ten more {loose}.', onesZero: 'Now a {row}: ten {loose}.' },
    spread: {
      ones: '{Spread} a {row}: ten more {loose}.', tens: '{Spread} a {square}: ten more {rows}.',
      onesZero: '{Spread} a {row}: ten {loose}.', tensZero: '{Spread} a {square}: ten {rows}.'
    },
    // the slips' first lines (section 2): `zero` at the chain's turn (the ones) and at the lent zero (the tens)
    zero: {
      ones: '{Top} {takeAway} {bottom}? Not enough {loose}, and no {rows} to {spread}.',
      onesZero: '{Top} {takeAway} {bottom}? No {loose}, and no {rows} to {spread}.',
      tens: 'Careful. That zero became ten {rows}, then gave one away. Nine {rows} now.'
    },
    flip: {
      ones: 'Careful: it’s {top} {takeAway} {bottom}, the top {takeAway} the bottom. Only {top} {loose}. Not enough.',
      tens: 'Careful: it’s {top} {takeAway} {bottom}, the top {takeAway} the bottom. Only {top} {rows}. Not enough.',
      onesZero: 'Careful: it’s {top} {takeAway} {bottom}, the top {takeAway} the bottom. No {loose}. Not enough.',
      tensZero: 'Careful: it’s {top} {takeAway} {bottom}, the top {takeAway} the bottom. No {rows}. Not enough.'
    },
    nospread: {
      ones: '{Top} {takeAway} {bottom}? Not enough {loose}. But we can {spread} a {row}.',
      tens: '{Top} {takeAway} {bottom}? Not enough {rows}. But we can {spread} a {square}.',
      onesZero: 'No {loose} to take {bottom} from? But we can {spread} a {row}.',
      tensZero: 'No {rows} to take {bottom} from? But we can {spread} a {square}.'
    },
    kept: {
      tens: 'Careful. One {row} went to the {loose}. {Top} {rows} now.',
      hundreds: 'Careful. One {square} became ten {rows}. {Top} {squares} now.',
      tensZero: 'Careful. One {row} went to the {loose}. No {rows} now.',
      hundredsZero: 'Careful. One {square} became ten {rows}. No {squares} now.'
    },
    extra: {
      tens: 'Careful. The {loose} had enough, so no {row} went. {Top} {rows} still.',
      hundreds: 'Careful. The {rows} had enough, so no {square} went. {Top} {squares} still.'
    },
    fact: 'Let’s scratch it out.',
    factSpread: { ones: '{Top} {takeAway} {bottom}: we {spread} a {row}, then take {bottom}.', tens: '{Top} {takeAway} {bottom}: we {spread} a {square}, then take {bottom}.' },
    factChain: 'Across the zero: {top} {loose}. {TakeAway} {bottom}.',
    factZero: '{Top} {takeAway} {bottom}: let’s scratch it out.',
    // the take: to ten, then the rest; by ones for five or less; one sweep otherwise
    takeTeen: { ones: '{Top} {loose}. {TakeAway} {bottom}.', tens: '{Top} {rows}. {TakeAway} {bottom}.', hundreds: '{Top} {squares}. {TakeAway} {bottom}.' },
    takeFirst: 'Take {first}: ten left.',
    takeRest: '{Rest} more: {left} left.',
    takeSmall: { ones: '{Top} {loose} {takeAway} {bottom} {loose}.', tens: '{Top} {rows} {takeAway} {bottom} {rows}.', hundreds: '{Top} {squares} {takeAway} {bottom} {squares}.' },
    takeBack: '{Left}.',
    takeSweep: { some: 'Take {bottom}: {left} left.', none: 'Take {bottom}: none left.' },
    takeNothing: 'Nothing to take.',
    digit: {
      ones: '{Digit} {loose}.', tens: '{Digit} {rows}.', hundreds: '{Digit} {squares}.',
      onesZero: 'No {loose}: zero.', tensZero: 'No {rows}: zero.', hundredsZero: 'No {squares}: zero.'
    },
    // the problem's end, and what comes before a problem
    twinIntro: 'One like it.',
    warmIntro: 'One to warm up your whiskers.',
    again: ['There it is. You remembered how.', 'The one like it, and every column was yours.'],
    rememberedStep: {
      none: 'Every column yours, and no sand needed!',
      ones2: 'A {row} to {spread}, and no sand needed!',
      ones: 'Three columns and a {row} to {spread}: no sand needed!',
      tens: 'A {square} to {spread}, and no sand needed!',
      both: 'A {row} and a {square} to {spread}, and no sand needed!',
      mixed: 'No {squares} left, and no sand needed!',
      zero: 'Across the zero, and no sand needed!',
      zeros: 'Across two zeros, and no sand needed!'
    },
    miss: 'And you finished it. We’ll do one like it soon.',
    missLast: 'And you finished it.',
    praise: ['Yes!', '', 'That’s it.', '', 'Every column.', '']
  };
  function takeLine(def, key) {
    return def && isObj(def.lines) && def.lines[key] != null ? def.lines[key] : E.TAKE_LINES[key];
  }
  function takeForm(v, keys) {
    if (!isObj(v)) return v;
    for (var i = 0; i < keys.length; i++) if (own(v, keys[i]) && v[keys[i]] != null) return v[keys[i]];
    var k = Object.keys(v);
    return k.length ? v[k[0]] : '';
  }
  function formKeys(name, zero) { return zero ? [name + 'Zero', name] : [name]; }
  function takeNum(nums, k) {
    if (!nums) return null;
    var lo = k === 'A' || k === 'B' ? k.toLowerCase() : k.charAt(0).toLowerCase() + k.slice(1);
    return own(nums, lo) && typeof nums[lo] === 'number' ? nums[lo] : null;
  }
  /* A line with its tokens filled: E.TAKE_WORDS' forms, and the numbers in `nums` as number words. */
  function takeFill(text, nums, words) {
    words = words || takeWords();
    var s = String(text == null ? '' : text);
    s = s.replace(/\{([A-Za-z]+)\} \{(rows|squares)\}/g, function (m, k, noun) {
      return !own(words, k) && takeNum(nums, k) === 1 ? '{' + k + '} {' + noun.slice(0, -1) + '}' : m;
    });
    return s.replace(/\{([A-Za-z]+)\}/g, function (m, k) {
      if (own(words, k)) return words[k];
      var v = takeNum(nums, k);
      if (v == null) return m;
      var w = E.numberWords(v);
      return /^[A-Z]/.test(k) && k !== 'B' ? cap1(w) : w;
    });
  }
  E.takeFill = takeFill;
  // a line from a list taken in turn, never blank where the kit's own must not be
  function takeTurn(list, i, fallback) {
    var L = asList(list).filter(function (x) { return typeof x === 'string' && x.trim(); });
    return L.length ? L[((i % L.length) + L.length) % L.length] : pick(fallback, i);
  }

  /* Number words 0 to 1,000, American ("five hundred three", "one hundred eighteen", never "and"); the
   * same as E.countWords to 100. */
  E.numberWords = function (n) {
    if (!(typeof n === 'number' && n === Math.floor(n) && n >= 0 && n <= 1000)) return String(n);
    if (n === 1000) return 'one thousand';
    var h = Math.floor(n / 100), r = n % 100, s = h ? ONES[h] + ' hundred' : '';
    if (r || !h) s = (s ? s + ' ' : '') + (r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''));
    return s;
  };

  /* The plan (section 3), or null for a problem the kit does not ask: whole numbers, 10 ≤ a ≤ 999,
   * 1 ≤ b < a, b no longer than a. Column by column, ones first, as the algorithm goes: a column whose top
   * as it stands is below its bottom digit spreads from the next; if that one is 0, the one after spreads
   * into it first (a square into ten rows), then it gives a row. Each column: `top` as written, `before`
   * (as it stands when it is outlined), `at` (after its own spreads: what it is taken from), `bottom`
   * (null: none), `digit`, `spreads` [{ from, to }], `chain` (across a zero), `lent` (it gave to the
   * right), `end` (what it ends as: its gold mark once it has changed), `toZero` (brought to 0 by lending)
   * and `blank` (its answer digit is a leading zero). */
  function digitsOf(n) { return String(n).split('').reverse().map(Number); }
  function okTake(a, b) {
    return typeof a === 'number' && typeof b === 'number' && a === Math.floor(a) && b === Math.floor(b) &&
      a >= 10 && a <= 999 && b >= 1 && b < a && String(b).length <= String(a).length;
  }
  E.takePlan = function (a, b) {
    if (!okTake(a, b)) return null;
    var T = digitsOf(a), B = digitsOf(b), n = T.length, cur = T.slice(), cols = [];
    for (var i = 0; i < n; i++) {
      var bot = i < B.length ? B[i] : null, bv = bot == null ? 0 : bot, before = cur[i], spreads = [], chain = false;
      if (cur[i] < bv) {
        if (cur[i + 1] === 0) { cur[i + 2] -= 1; cur[i + 1] += 10; spreads.push({ from: i + 2, to: i + 1 }); chain = true; }
        cur[i + 1] -= 1; cur[i] += 10; spreads.push({ from: i + 1, to: i });
      }
      cols.push({ col: i, top: T[i], before: before, at: cur[i], bottom: bot, digit: cur[i] - bv, spreads: spreads, chain: chain });
    }
    var answer = a - b, nd = String(answer).length;
    cols.forEach(function (c, i) {
      c.lent = cols.some(function (d) { return d.spreads.some(function (s) { return s.from === i; }); });
      c.end = cur[i];
      c.toZero = c.top > 0 && c.before === 0;
      c.blank = i >= nd;
    });
    return { a: a, b: b, answer: answer, n: n, cols: cols };
  };
  /* The kind (section 3), by which turns spread. */
  E.takeKind = function (p) {
    if (!p || !p.cols) return null;
    if (p.cols.some(function (c) { return c.chain; })) return p.cols[0].top === 0 ? 'zeros' : 'zero';
    var o = p.cols[0].spreads.length > 0, t = p.n > 1 && p.cols[1].spreads.length > 0;
    return o && t ? 'both' : o ? 'ones' : t ? 'tens' : 'none';
  };
  /* The flags the chapters' rules read (only the true ones): leavesZero, toZero, idleZero, noHundreds, noLoose. */
  E.takeFlags = function (p) {
    var f = {};
    if (!p || !p.cols) return f;
    p.cols.forEach(function (c, i) {
      if (c.toZero) f.toZero = true;
      if (c.toZero && c.spreads.length && !c.chain) f.leavesZero = true;
      if (c.top === 0 && !c.spreads.length && !c.lent && !p.cols.some(function (d) { return d.spreads.some(function (s) { return s.to === i; }); })) f.idleZero = true;
    });
    if (p.n === 3 && p.cols[2].blank) f.noHundreds = true;
    if (p.cols[0].top === 0) f.noLoose = true;
    return f;
  };
  /* The shape a twin keeps exactly (section 3). */
  E.takeShape = function (p) {
    if (!p || !p.cols) return null;
    return {
      n: p.n, nb: String(p.b).length,
      cols: p.cols.map(function (c) {
        return { zero: c.top === 0, bottom: c.bottom == null ? 'none' : c.bottom === 0 ? 'zero' : 'some', spreads: c.spreads.length,
          chain: c.chain, toZero: c.toZero, digitZero: !c.blank && c.digit === 0, blank: c.blank };
      }),
      flags: Object.keys(E.takeFlags(p)).sort()
    };
  };
  function shapeKey(p) { return JSON.stringify(E.takeShape(p)); }
  /* The step a problem belongs to (her hard steps, the guards, the store's templates). */
  E.takeStepOf = function (p) {
    var k = E.takeKind(p);
    if (!k) return null;
    if (p.n === 2 && k === 'ones') return 'ones2';
    if (k === 'zero' || k === 'zeros') return k;
    if (E.takeFlags(p).noHundreds) return 'mixed';
    return k;
  };
  // a turn whose flip (bottom − top, the smaller from the bigger) lands on its right digit (section 1)
  function flipLands(p) { return p.cols.some(function (c) { return c.spreads.length > 0 && (c.bottom || 0) - c.before === c.digit; }); }
  E.takeFlipLands = function (p) { return !!(p && p.cols && flipLands(p)); };

  /* A twin (section 3): the same shape, new digits, built column by column, ones first: each top digit drawn
   * to the zero pattern, each bottom digit from the range that makes the turn spread or not as the
   * original's did (a 0 answer digit or a blank: the bottom equals the top as it stands), the spreads
   * applied as drawn, the whole checked against the shape. Never the original's top, nor its answer nor
   * one in `avoid`; for `mode` 'hers' (the default), never one whose flip lands on a right digit. At most
   * E.TAKE_TRIES draws (read at call time), then the original itself: { a, b, tries, fallback: true }. */
  E.takeTwin = function (plan, seed, avoid, mode) {
    if (!plan || !plan.cols) return null;
    var rnd = mulberry32(num(seed, 0)), want = shapeKey(plan), nb = String(plan.b).length, n = plan.n;
    var avoidSet = {}, noLand = (mode == null ? 'hers' : mode) === 'hers';
    asList(avoid).forEach(function (x) { avoidSet[x] = true; });
    var tries = Math.max(0, Math.floor(num(E.TAKE_TRIES, 400)));
    var pickIn = function (lo, hi) { return hi < lo ? null : lo + Math.floor(rnd() * (hi - lo + 1)); };
    for (var k = 0; k < tries; k++) {
      var td = plan.cols.map(function (c) { return c.top === 0 ? 0 : 1 + Math.floor(rnd() * 9); });
      var cur = td.slice(), bd = [], bad = false;
      for (var i = 0; i < n && !bad; i++) {
        if (i >= nb) continue;
        var c = plan.cols[i], need = c.spreads.length > 0, zeroDigit = !c.blank && c.digit === 0, d;
        if (c.bottom === 0) d = 0;
        else if (need) d = pickIn(Math.max(1, cur[i] + 1), 9);
        else if (zeroDigit || c.blank) d = cur[i] >= 1 ? cur[i] : null;
        else d = pickIn(1, cur[i] - 1 >= 1 ? cur[i] - 1 : cur[i]);
        if (d == null || (i === nb - 1 && d === 0)) { bad = true; break; }
        bd.push(d);
        if (need) {
          if (i + 1 >= n) { bad = true; break; }
          if (cur[i + 1] === 0) {
            if (i + 2 >= n || cur[i + 2] === 0) { bad = true; break; }
            cur[i + 2] -= 1; cur[i + 1] += 10;
          }
          cur[i + 1] -= 1; cur[i] += 10;
        }
      }
      if (bad) continue;
      var a = +td.slice().reverse().join(''), b = +bd.slice().reverse().join('');
      if (!(b >= 1 && b < a)) continue;
      var q = E.takePlan(a, b);
      if (!q || shapeKey(q) !== want) continue;
      if (a === plan.a || avoidSet[q.answer] || q.answer === plan.answer) continue;
      if (noLand && flipLands(q)) continue;
      return { a: a, b: b, tries: k + 1 };
    }
    return { a: plan.a, b: plan.b, tries: tries, fallback: true };
  };
  /* The made warm-up (section 3): a twin of 43 − 16, 'hers', its flip never landing. */
  E.takeWarm = function (seed, avoid) {
    var t = E.takeTwin(E.takePlan(43, 16), seed, avoid, 'hers');
    return { a: t.a, b: t.b };
  };
  // a twin's seed: the lesson's start, its place and the requeue count
  function takeSeed(t, pos, used) {
    var s = Math.floor(Math.abs(num(t, 0))) % 4294967296;
    return (s ^ Math.imul(pos + 1, 2654435761) ^ Math.imul(used + 1, 40503)) >>> 0;
  }

  /* Her slip in a column (section 2's table, in its order), or null for the right digit. `given` is a
   * digit; '' (OK on the empty leftmost box) is read as 0. `shown`: the turn's spreads were shown or
   * tapped, so they are in the sand already and never her slip: no `flip`, `nospread` or chain's `zero`.
   * `taught` (the steps taught so far: E.takeSteps for a store round, chapterSteps for a lesson; absent, every
   * step) keeps `extra` to a column whose spread she has met: "no row went" at the tens once a step that spreads a
   * row is taught (`ones2` on), "no square went" at the hundreds once one that spreads a square is (`tens` on);
   * before that the column's slip is `fact`, "Let's scratch it out." A 0 typed where the bottom is empty or 0 (1
   * with nothing to take, or 1 − 0, read as 0) is `fact`, never `extra`. At a column that lent and needs its own spread, `kept`
   * (the one not taken off, the top as written) comes before the flip of the written top, then `nospread`. */
  E.takeSlip = function (plan, col, given, shown, taught) {
    var c = plan && plan.cols && plan.cols[col];
    if (!c) return null;
    var bv = c.bottom || 0, g = given === '' || given == null ? 0 : +given;
    if (g === c.digit) return null;
    var needs = c.spreads.length > 0;
    if (needs && c.chain) return !shown && (g === bv - c.before || g === 0) ? 'zero' : 'fact';
    if (c.top === 0 && c.lent) return g === 10 - bv || g === bv || g === 0 ? 'zero' : 'fact';
    if (needs && !shown && g === bv - c.before) return 'flip';
    if (c.lent && g === (c.top >= bv ? c.top - bv : c.top + 10 - bv)) return 'kept';
    if (needs && c.lent && !shown && g === bv - c.top) return 'flip';
    if (needs && !shown && g === 0) return 'nospread';
    if (col > 0 && !c.lent && !needs && spreadTaught(taught, col) && !(g === 0 && bv === 0) && g === c.before - 1 - bv) return 'extra';
    return 'fact';
  };
  // a step that spreads out of this column is taught: a row (the tens') from `ones2` on, a square (the
  // hundreds') from `tens` on; with no list, every step
  function spreadTaught(taught, col) {
    if (!Array.isArray(taught)) return true;
    var from = E.TAKE_STEPS.indexOf(col === 1 ? 'ones2' : 'tens');
    return taught.some(function (s) { return E.TAKE_STEPS.indexOf(s) >= from; });
  }

  /* The column's gold marks (section 1): per column, ones first, { struck, mark } (mark null: nothing
   * lettered). In 'show' and 'tap' (the scaffold) every spread letters the columns it touches as it lands
   * (a zero "10", then "9"); in 'hers' a turn that spread strikes its lenders, and a column's value is
   * lettered once its own digit is in; a help is the scaffold too, for the spreads of its own turn
   * (`helped`: { col: true }). Columns before `col` are done; `k` of col's own spreads have landed. */
  function marksInit(p) { return p.cols.map(function (c) { return { struck: false, mark: null, cur: c.top }; }); }
  function marksSpread(M, s, letter) {
    M[s.from].cur -= 1; M[s.to].cur += 10;
    M[s.from].struck = true; M[s.to].struck = true;
    if (letter) { M[s.from].mark = M[s.from].cur; M[s.to].mark = M[s.to].cur; }
  }
  function marksDone(M, i) { if (M[i].struck) M[i].mark = M[i].cur; }
  function marksOut(M) { return M.map(function (m) { return { struck: m.struck, mark: m.mark }; }); }
  function marksTo(p, mode, helped, col, k) {
    var M = marksInit(p);
    helped = helped || {};
    for (var i = 0; i < col && i < p.n; i++) {
      var all = mode !== 'hers' || !!helped[i];
      p.cols[i].spreads.forEach(function (s) { marksSpread(M, s, all); });
      marksDone(M, i);
    }
    if (col < p.n && k > 0) p.cols[col].spreads.slice(0, k).forEach(function (s) { marksSpread(M, s, mode !== 'hers'); });
    return M;
  }
  E.takeMarks = function (plan, mode, helped, col, k) {
    if (!plan || !plan.cols) return null;
    return marksOut(marksTo(plan, E.TAKE_REGROUP.indexOf(mode) >= 0 ? mode : 'hers', helped, num(col, 0), num(k, 0)));
  };
  function spreadName(s) { return { from: TAKE_COLS[s.from], to: TAKE_COLS[s.to] }; }

  /* The store picture as PC.art.placeValue takes it (section 8's pinned object): the counts as they
   * stand, `taken` per zone, `fresh` (a spread's ten: 10, or 9 once a row of it has spread on across a
   * zero), `spread` (the last spread landed, in flight at `stage.flight`: the counts are its end), `glow`,
   * `kind`, `small`. `q` is a question (T.question) or a problem ({ a, b, picture? }); `stage` says how far
   * the problem has gone: 'start', 'done', or 'before' / 'after' / 'taken' (q's column: outlined, its
   * spreads landed, its take gone pale), or { col, spreads, taken, flight, glow, small } (columns before
   * `col` spread and taken; `spreads` of col's own landed). */
  function takeKindOf(def, q) {
    var k = (q && isObj(q.picture) && q.picture.kind) || (def && isObj(def.picture) && def.picture.kind);
    return k === 'marks' ? 'marks' : 'store';
  }
  E.takePicture = function (def, q, stage) {
    var p = q && (q.plan && q.plan.cols ? q.plan : E.takePlan(q.a, q.b));
    if (!p) return null;
    var qc = num(q.col, 0), s = stage;
    if (s === 'done') s = { col: p.n };
    else if (s === 'before' || s == null) s = { col: qc };
    else if (s === 'after') s = { col: qc, spreads: 9 };
    else if (s === 'taken') s = { col: qc, spreads: 9, taken: true };
    else if (s === 'start') s = { col: 0 };
    else if (!isObj(s)) s = { col: qc };
    var col = Math.max(0, Math.min(p.n, num(s.col, qc)));
    var cur = [0, 0, 0], old = [0, 0, 0], fresh = [0, 0, 0], taken = [0, 0, 0], last = null;
    p.cols.forEach(function (c, i) { cur[i] = c.top; old[i] = c.top; });
    var land = function (sp) {
      cur[sp.from] -= 1; cur[sp.to] += 10;
      if (old[sp.from] > 0) old[sp.from] -= 1; else fresh[sp.from] -= 1;   // an old piece goes first
      fresh[sp.to] += 10;
      last = sp;
    };
    for (var i = 0; i < col; i++) { p.cols[i].spreads.forEach(land); taken[i] = p.cols[i].bottom || 0; last = null; }
    if (col < p.n) {
      p.cols[col].spreads.slice(0, Math.max(0, num(s.spreads, 0))).forEach(land);
      if (s.taken) taken[col] = p.cols[col].bottom || 0;
    }
    var o = {
      hundreds: cur[2], tens: cur[1], ones: cur[0],
      taken: { hundreds: taken[2], tens: taken[1], ones: taken[0] },
      fresh: { tens: fresh[1], ones: fresh[0] },
      spread: null, glow: null, kind: takeKindOf(def, q), small: !!s.small
    };
    if (s.flight && last) o.spread = { from: TAKE_COLS[last.from], to: TAKE_COLS[last.to], stage: s.flight === 'slide' || s.flight === 'open' ? s.flight : 'end' };
    if (s.glow === 'hundreds' || s.glow === 'tens') o.glow = s.glow;
    return o;
  };

  /* The help's sand as PC.art.sand takes it (`kind: 'quick'`, section 8's pinned object): the number as it
   * stands, the marks spent by spreads (`crossed`) and the ten new marks each spread drew (`fresh`), from
   * the first column on (so the sand agrees with the column and the store picture), `take` of column
   * `col`'s marks being taken, `lit` of them so far. */
  var SAND_KEYS = ['kind', 'hundreds', 'tens', 'ones', 'crossed', 'fresh', 'take', 'lit', 'col', 'ground'];
  function takeGround(def) { return def && (def.ground === 'earth' || def.ground === 'sand') ? def.ground : 'sand'; }
  function sandInit(p) {
    var cur = [0, 0, 0];
    p.cols.forEach(function (c, i) { cur[i] = c.top; });
    return { cur: cur, crossed: { squares: 0, lines: 0 }, fresh: { lines: 0, dots: 0 } };
  }
  function sandSpread(S, s) {
    S.cur[s.from] -= 1; S.cur[s.to] += 10;
    if (s.from === 2) { S.crossed.squares++; S.fresh.lines += 10; } else { S.crossed.lines++; S.fresh.dots += 10; }
  }
  function sandOf(S, col, take, lit, ground) {
    return { kind: 'quick', hundreds: S.cur[2], tens: S.cur[1], ones: S.cur[0], crossed: clone(S.crossed), fresh: clone(S.fresh),
      take: take, lit: lit, col: col, ground: ground };
  }
  E.takeSandOpts = function (step) {
    var s = step && isObj(step.sand) ? step.sand : step;
    if (!isObj(s)) return null;
    var o = {};
    SAND_KEYS.forEach(function (k) { o[k] = clone(s[k]); });
    o.kind = 'quick';
    if (o.ground == null) o.ground = 'sand';
    return o;
  };

  /* The column's line (section 1). 'hers': the column and its bottom digit, never its top (the first
   * column its top as written); 'show' and 'tap': the top as it stands, and at a turn that spreads, the new
   * top 'after' its show or taps. 'Before' them, a 'show' turn says the column's name alone (the show's first
   * step says its top: "Three take away eight? Only three loose."); a 'tap' turn says its top as it stands, as
   * any column does, since the tap line says none ("Ones first. Three take away eight." then "Not enough
   * loose. Spread a row: tap it."). `full` false: the column's name alone. The cat's tokens are left for the
   * page. */
  E.takeLine = function (def, plan, col, stage, mode, full) {
    var c = plan && plan.cols && plan.cols[col];
    if (!c) return '';
    mode = E.TAKE_REGROUP.indexOf(mode) >= 0 ? mode : 'hers';
    var words = takeWords(), bv = c.bottom;
    var name = takeFill(takeForm(takeLine(def, 'colName'), [TAKE_COLS[col]]), {}, words);
    if (mode !== 'hers' && c.spreads.length && (stage === 'after' || mode === 'show')) return stage === 'after' ? takeFill(takeLine(def, 'colShown'), { top: c.at, bottom: bv || 0 }, words) : name;
    if (full === false) return name;
    if (col === 0) return takeFill(takeLine(def, 'colFirst'), { top: c.before, bottom: bv || 0 }, words);
    var part = mode === 'hers' ? takeLine(def, bv == null ? 'nothingHers' : 'colHers') : takeLine(def, bv == null ? 'nothingShown' : 'colShown');
    // chapter 12 (the kit's design, its section 1 and call 28): the school words once on chapter 12's and 13's worked examples,
    // before a 'show' problem's tens line in a teach 'none' or 'ones2' set (never on the first column, the kit's longest; its
    // twin is 'tap', so they are said once)
    var school = col === 1 && mode === 'show' && def && (def.teach === 'none' || def.teach === 'ones2') ? takeFill(takeLine(def, 'schoolWords'), {}, words) + ' ' : '';
    return school + name + ' ' + takeFill(part, { top: c.before, bottom: bv || 0 }, words);
  };

  /* 'show''s steps and 'tap''s lines for a turn that spreads (null for one that does not). `steps`
   * [{ say, spread, marks, picture }] ('show': Tallyheart works it, the last step the new top, then the
   * keypad wakes); `taps` [{ say, glow, spread, marks, picture }], one a spread; `here` the line for a tap
   * off the glowing zone, by that zone; `line` the column's line after. `opts.mode` 'show' (the default) or
   * 'tap', `opts.helped` the columns helped before. */
  E.takeShow = function (def, plan, col, opts) {
    var c = plan && plan.cols && plan.cols[col];
    if (!c || !c.spreads.length) return null;
    opts = opts || {};
    var mode = opts.mode === 'tap' ? 'tap' : 'show', helped = opts.helped || {};
    var words = takeWords(), name = TAKE_COLS[col], zero = c.before === 0, bv = c.bottom || 0, nums = { top: c.before, bottom: bv };
    var q = { plan: plan, col: col, picture: opts.picture };
    var fill = function (key, keys, n) { return takeFill(takeForm(takeLine(def, key), keys || []), n || nums, words); };
    var M = marksTo(plan, mode, helped, col, 0), k = 0, steps = [];
    var push = function (say, s) {
      steps.push({ say: say, spread: s ? spreadName(s) : null, marks: marksOut(M), picture: E.takePicture(def, q, { col: col, spreads: k, flight: s ? 'end' : null }) });
    };
    var land = function (s) { marksSpread(M, s, true); k++; };
    var oneKeys = zero ? ['onesZero', 'ones'] : ['ones'];
    if (c.chain) {
      push(fill('zero', oneKeys), null);
      land(c.spreads[0]); push(fill('chainSquare'), c.spreads[0]);
      land(c.spreads[1]); push(fill('chainRow', oneKeys), c.spreads[1]);
    } else {
      push(fill('showOpen', formKeys(name, zero)), null);
      land(c.spreads[0]); push(fill('showSpread', formKeys(name, zero)), c.spreads[0]);
    }
    var after = takeFill(takeLine(def, 'colShown'), { top: c.at, bottom: bv }, words);
    push(after, null);
    var T2 = marksTo(plan, mode, helped, col, 0), taps = [];
    c.spreads.forEach(function (s, i) {
      var say = c.chain ? (i === 0 ? fill('tapSquare') : fill('tapRow')) : fill('tap', [name]);
      var glow = TAKE_COLS[s.from];
      var before = { say: say, glow: glow, spread: spreadName(s), marks: marksOut(T2), picture: E.takePicture(def, q, { col: col, spreads: i, glow: glow }) };
      marksSpread(T2, s, true);
      taps.push(before);
    });
    var here = {};
    c.spreads.forEach(function (s) { var z = TAKE_COLS[s.from]; here[z] = fill('tapHere', [z]); });
    return { col: col, steps: steps, taps: taps, here: here, line: after };
  };

  /* The help (section 2): { col, slip, intro, steps: [{ say, sand, marks, n?, hop?, glow?, write? }], digit,
   * blank, line }. The first step is the slip's line (`intro`, which stays above the steps to the end), the
   * last writes the digit into the box (`line`, `write: true`; a blank column's is the "no zero in front"
   * line, and its digit null). `sand` is E.takeSandOpts' object; `marks` the column's gold marks at that
   * step; `n` the counter after a hop of the take; `hop` a step that is only a number (775 ms). The spreads
   * the sand draws are lettered as `'show'` letters them, in every mode (the help is the scaffold), and a
   * column that lent has its value lettered with the first line (`glow` for `kept` and `zero`). `opts`:
   * `mode` the problem's, `helped` the columns helped before, `shown` its spreads were shown or tapped (so
   * the sand starts with them drawn and the help starts at the take). */
  E.takeHelp = function (def, plan, col, slip, opts) {
    var c = plan && plan.cols && plan.cols[col];
    if (!c) return null;
    opts = opts || {};
    var mode = E.TAKE_REGROUP.indexOf(opts.mode) >= 0 ? opts.mode : 'hers';
    var shown = !!opts.shown && c.spreads.length > 0;
    if (E.TAKE_SLIPS.indexOf(slip) < 0) slip = 'fact';
    var words = takeWords(), name = TAKE_COLS[col], bv = c.bottom || 0, ground = takeGround(def);
    var S = sandInit(plan), M = marksTo(plan, mode, opts.helped || {}, col, 0), take = 0, lit = 0, steps = [];
    for (var i = 0; i < col; i++) plan.cols[i].spreads.forEach(function (s) { sandSpread(S, s); });
    var zero = c.before === 0, keys = formKeys(name, zero), nums = { top: c.before, bottom: bv };
    var fill = function (key, k, n) { return takeFill(takeForm(takeLine(def, key), k || []), n || nums, words); };
    var push = function (say, more) {
      var st = { say: say, sand: sandOf(S, col, take, lit, ground), marks: marksOut(M) };
      if (more) Object.keys(more).forEach(function (x) { st[x] = more[x]; });
      steps.push(st);
    };
    var land = function (s) { sandSpread(S, s); marksSpread(M, s, true); };
    var chainFact = slip === 'fact' && c.chain;
    var pre = shown || chainFact;
    if (pre) c.spreads.forEach(land);
    var intro;
    if (slip === 'zero') intro = c.chain ? fill('zero', zero ? ['onesZero', 'ones'] : ['ones']) : fill('zero', ['tens']);
    else if (slip === 'flip' || slip === 'nospread' || slip === 'kept' || slip === 'extra') intro = fill(slip, keys);
    else if (c.chain) intro = fill('factChain', null, { top: c.at, bottom: bv });
    else if (c.top === 0 && c.lent) intro = fill('factZero');
    else if (c.spreads.length && !pre) intro = fill('factSpread', keys);
    else intro = fill('fact');
    var glow = (slip === 'kept' || slip === 'zero') && c.lent;
    if (c.lent) M[col].mark = M[col].cur;
    push(intro, glow ? { glow: true } : null);
    if (!pre) {
      if (c.chain) {
        land(c.spreads[0]); push(fill('chainSquare'));
        land(c.spreads[1]); push(fill('chainRow', zero ? ['onesZero', 'ones'] : ['ones']));
      } else c.spreads.forEach(function (s) { land(s); push(fill('spread', keys)); });
    }
    // the take: a teen top to ten, then the rest (the old marks first); five or less from a top under ten
    // by ones; a sweep otherwise
    var top = c.at;
    if (bv === 0) push(fill('takeNothing'));
    else if (top >= 10 && bv > top - 10) {
      take = bv;
      if (!chainFact) push(fill('takeTeen', [name], { top: top, bottom: bv }));
      if (top === 10) { lit = bv; push(fill('takeSweep', ['some'], { bottom: bv, left: 10 - bv }), { n: 10 - bv }); }
      else {
        var first = top - 10, rest = bv - first;
        lit = first; push(fill('takeFirst', null, { first: first }), { n: 10 });
        lit = bv; push(fill('takeRest', null, { rest: rest, left: 10 - rest }), { n: 10 - rest });
      }
    } else {
      take = bv;
      push(fill('takeSmall', [name], { top: top, bottom: bv }));
      if (bv <= 5) for (var h = 1; h <= bv; h++) { lit = h; push(fill('takeBack', null, { left: top - h }), { n: top - h, hop: true }); }
      else { lit = bv; push(fill('takeSweep', [top - bv === 0 ? 'none' : 'some'], { bottom: bv, left: top - bv }), { n: top - bv }); }
    }
    marksDone(M, col);
    var line = c.blank ? fill('blank', [name]) : c.digit === 0 ? fill('digit', [name + 'Zero', name]) : fill('digit', [name], { digit: c.digit });
    push(line, { write: true });
    return { col: col, slip: slip, intro: intro, steps: steps, digit: c.blank ? null : c.digit, blank: c.blank, line: line };
  };

  /* What comes before the first column (sections 1 and 6): the prompt's balloons and a twin's or the
   * warm-up's introduction, lettered and said (`balloons`), then the problem in words, said only (`ask`);
   * `heard` is the speech in its order. `q` is a question (T.question) or a queue item. */
  E.takeQuestion = function (def, q) {
    def = def || {}; q = q || {};
    var teacher = E.teacherOf(def), words = takeWords(), balloons = [];
    asList(q.prompt).forEach(function (b) {
      if (typeof b === 'string') { if (b) balloons.push({ who: teacher, text: b }); }
      else if (isObj(b) && b.text) balloons.push(clone(b));
    });
    var intro = q.of || q.twin ? takeLine(def, 'twinIntro') : q.warm ? takeLine(def, 'warmIntro') : null;
    if (intro) balloons.push({ who: teacher, text: takeFill(intro, {}, words) });
    var ask = { who: teacher, text: takeFill(takeLine(def, 'ask'), { a: q.a, b: q.b }, words) };
    return { balloons: balloons, ask: ask, heard: balloons.concat([ask]) };
  };

  /* ------------------------------------------------------------ the runner: E.takes (T)
   * A take state: { op: '-', set, mode, queue: [{ a, b, regroup, prompt?, right?, picture?, of?, warm?,
   * hard? }], pos, col, got, first, slips, cols, tapped, requeues, log, lineIdx, missed, onesFirst,
   * startedAt, logged, okAt, tapHere, round?, taught?, avoid? }. `pos` moves only when a problem is done, so
   * T.done and E.counts.done agree and the slot machinery takes the state as it is; `col` is the column she is on
   * (ones first); `got` the digits in her boxes, `first` her first digit in each, `slips` this problem's
   * [{ col, given, slip }], `cols` its columns' times; `tapped` the spreads tapped in this column;
   * `requeues` by lineage (a twin's `of`, its original's 'a-b'); `lineIdx` the praise and again lines'
   * turn; `onesFirst` whether this problem's pointer was given; `logged` the take-aways in her log when
   * the lesson began (the pointer's first five); `okAt` the last OK's time (the 400 ms guard); `tapHere`
   * whether this column's "up here" was said; `hard` (a store round's) the step a problem asks her about;
   * `taught` the steps taught so far (E.takeSlip's `extra`: a round's E.takeSteps, a lesson's chapterSteps; absent,
   * every step); `avoid` answers no twin may have beyond the queue's (a lesson's: its chapter's, section 3). */
  var T = {};
  function takeItem(f, def) {
    var it = Array.isArray(f) ? { a: +f[0], b: +f[1] } : isObj(f) ? { a: +f.a, b: +f.b } : { a: NaN, b: NaN };
    var reg = isObj(f) && E.TAKE_REGROUP.indexOf(f.regroup) >= 0 ? f.regroup : E.TAKE_REGROUP.indexOf(def.regroup) >= 0 ? def.regroup : 'hers';
    it.regroup = reg;
    if (isObj(f)) {
      ['prompt', 'right', 'picture'].forEach(function (k) { if (f[k] != null) it[k] = clone(f[k]); });
      if (typeof f.of === 'string' && f.of) it.of = f.of;
      if (f.warm === true) it.warm = true;
      if (E.TAKE_STEPS.indexOf(f.hard) >= 0) it.hard = f.hard;
    }
    return it;
  }
  T.start = function (def, opts) {
    def = def || {}; opts = opts || {};
    var facts = opts.facts || def.facts || [];
    var st = {
      op: '-', set: opts.set || def.id || null, mode: opts.mode || 'chapter',
      queue: asList(facts).map(function (f) { return takeItem(f, def); }).filter(function (q) { return !!E.takePlan(q.a, q.b); }),
      pos: 0, col: 0, got: [], first: [], slips: [], cols: [], tapped: 0,
      requeues: {}, log: [], lineIdx: { praise: 0, again: 0, remembered: 0 }, missed: false, onesFirst: false,
      startedAt: opts.now || 0, logged: Math.max(0, Math.floor(num(opts.logged, 0))), okAt: 0, tapHere: false
    };
    if (opts.round != null) st.round = opts.round;
    if (Array.isArray(opts.taught)) st.taught = opts.taught.filter(function (s) { return E.TAKE_STEPS.indexOf(s) >= 0; });
    if (Array.isArray(opts.avoid)) st.avoid = opts.avoid.filter(okNum);
    return st;
  };
  T.done = function (st) { return C.done(st); };
  function takeKey(a, b) { return a + '-' + b; }
  function helpedCols(st) { var h = {}; (st.slips || []).forEach(function (s) { if (s) h[s.col] = true; }); return h; }
  function stateItem(st) {
    if (T.done(st)) return null;
    var q = st.queue[st.pos], p = q && E.takePlan(q.a, q.b);
    return p ? { q: q, p: p, mode: E.TAKE_REGROUP.indexOf(q.regroup) >= 0 ? q.regroup : 'hers', col: Math.max(0, Math.min(p.n - 1, num(st.col, 0) | 0)) } : null;
  }
  /* The problem as it stands: its plan, the column she is on, the line's mode and form (`full`: a set's
   * first two problems of her own ('hers', not a twin; the made warm-up is one), every 'show' and 'tap' one, a
   * twin, and the column after a help; the page words it with E.takeLine), `stage` for E.takeLine, `show` (this column has a show to play first: E.takeShow),
   * `tap` (spreads still to tap), her digits so far (`got`, ones first; '' for a blank), the marks lettered
   * as the column is outlined, `okEmpty` (OK is lit on an empty box: the leftmost only), and its prompt
   * (with a prompt and `full` false, the first column says nothing past the prompt's balloon),
   * `right` lines, picture, `twin` (its lineage), `warm`, `worked` and `hard`. */
  T.question = function (st) {
    var it = stateItem(st);
    if (!it) return null;
    var q = it.q, p = it.p, mode = it.mode, col = it.col, c = p.cols[col], helped = helpedCols(st);
    var pending = mode === 'tap' ? Math.max(0, c.spreads.length - num(st.tapped, 0)) : 0;
    var hl = []; Object.keys(helped).forEach(function (k) { hl.push(+k); });
    // (a set's first two problems of her own: 'hers', the made warm-up among them; a 'show' or 'tap' one and a
    // twin have their full lines anyway, so they use up neither place)
    var own = st.queue.slice(0, st.pos).filter(function (x) { return !x.of && x.regroup === 'hers'; }).length;
    return {
      a: q.a, b: q.b, answer: p.answer, plan: p, kind: E.takeKind(p), step: E.takeStepOf(p),
      number: st.pos + 1, total: st.queue.length, col: col, n: p.n, mode: mode,
      full: mode !== 'hers' || !!q.of || own < 2 || (col > 0 && !!helped[col - 1]),
      stage: mode === 'tap' && c.spreads.length && !pending ? 'after' : 'before',
      show: mode === 'show' && c.spreads.length > 0, tap: pending, tapped: num(st.tapped, 0),
      got: st.got.slice(), helped: hl.sort(),
      marks: marksOut(marksTo(p, mode, helped, col, mode === 'tap' ? num(st.tapped, 0) : 0)),
      okEmpty: col === p.n - 1, onesFirst: !!st.onesFirst,
      prompt: q.prompt != null ? clone(q.prompt) : null, right: q.right != null ? clone(q.right) : null,
      picture: q.picture != null ? clone(q.picture) : null,
      twin: q.of || null, warm: !!q.warm, worked: mode === 'show', hard: q.hard || null
    };
  };
  function pointerOn(st, def) { return (def && def.teach === 'none') || num(st.logged, 0) + (st.log || []).length < 5; }
  /* One column's OK (`digit` 0 to 9, or '' for OK on the empty leftmost box). Ignored (`{ ignored }`)
   * within 400 ms of the last OK ('guard'), before a 'tap' turn's spreads ('tap': the zone wiggles), on an
   * empty box that is not the leftmost ('empty'). Her first digit of a problem, wrong and the answer's
   * leading digit, in her first five take-aways or a `teach: 'none'` set, is pointed at once (`pointer`,
   * its `line`): not checked, not logged. Otherwise: `right`, the `slip` and the `help` (the column is
   * done with the right digit either way), `spread` (the 'hers' spreads the picture plays now), `blank`
   * and its `blankLine`, the `marks` after the column, `next` (the next column), and at a problem's end
   * `problemDone`, its log `entry` (the caller logs it: E.logTake), `twin` (the twin queued), its one
   * line (`line`, `lineKind`: 'again', 'rememberedStep', 'praise', 'miss'; or `balloons` for its own
   * `right` lines, 'right') and `done` (the lesson is over). */
  T.digit = function (st, def, digit, ms, now) {
    var it = stateItem(st);
    if (!it) return null;
    def = def || {};
    var q = it.q, p = it.p, mode = it.mode, col = it.col, c = p.cols[col];
    now = num(now, 0);
    if (st.okAt && now >= st.okAt && now - st.okAt < TAKE_OK_MS) return { ignored: 'guard' };
    if (mode === 'tap' && c.spreads.length > num(st.tapped, 0)) return { ignored: 'tap' };
    var g = digit === '' || digit == null ? '' : +digit;
    if (g !== '' && !(g === Math.floor(g) && g >= 0 && g <= 9)) return { ignored: 'digit' };
    if (g === '' && col !== p.n - 1) return { ignored: 'empty' };
    st.okAt = now;
    var val = g === '' ? 0 : g, words = takeWords();
    if (col === 0 && !st.onesFirst && val !== c.digit && pointerOn(st, def) && val === +String(p.answer).charAt(0)) {
      st.onesFirst = true;
      return { pointer: true, col: 0, line: takeFill(takeLine(def, 'onesFirst'), {}, words) };
    }
    var right = val === c.digit, shown = mode !== 'hers' && c.spreads.length > 0, before = helpedCols(st);
    st.first[col] = g;
    st.cols[col] = Math.max(0, Math.round(num(ms, 0)));
    st.got[col] = c.blank ? '' : c.digit;
    var res = { col: col, right: right, given: g, digit: c.blank ? null : c.digit, blank: c.blank, slip: null, help: null, spread: null };
    if (right) {
      if (mode === 'hers' && c.spreads.length) res.spread = c.spreads.map(spreadName);
      if (c.blank) res.blankLine = takeFill(takeForm(takeLine(def, 'blank'), [TAKE_COLS[col]]), {}, words);
    } else {
      res.slip = E.takeSlip(p, col, g, shown, st.taught);
      st.slips.push({ col: col, given: g, slip: res.slip });
      st.missed = true;
      res.help = E.takeHelp(def, p, col, res.slip, { mode: mode, helped: before, shown: shown });
    }
    res.marks = marksOut(marksTo(p, mode, helpedCols(st), col + 1, 0));
    st.col = col + 1; st.tapped = 0; st.tapHere = false;
    if (st.col < p.n) { res.next = st.col; return res; }
    // the problem is done: its log entry, its twin, its one line
    var correct = st.slips.length === 0, given = '', ms2 = 0;
    for (var i = p.n - 1; i >= 0; i--) given += st.first[i] == null ? '' : String(st.first[i]);
    st.cols.forEach(function (x) { ms2 += num(x, 0); });
    var entry = {
      set: st.set, a: q.a, b: q.b, answer: p.answer, given: given, correct: correct, helped: !correct,
      slips: clone(st.slips), ms: ms2, cols: st.cols.slice(), at: now, kind: E.takeKind(p), digits: p.n, regroup: mode
    };
    if (q.of) entry.twin = q.of;
    if (q.warm) entry.warm = true;
    if (mode === 'show') entry.worked = true;
    if (st.round != null) entry.round = st.round;
    st.log.push(entry);
    res.entry = entry;
    res.requeued = false;
    if (!correct && def.twins !== false) {
      var key = q.of || takeKey(q.a, q.b), used = st.requeues[key] || 0;
      if (used < E.MAX_REQUEUE) {
        st.requeues[key] = used + 1;
        var tmode = mode === 'show' ? 'tap' : 'hers';
        var tw = E.takeTwin(p, takeSeed(st.startedAt, st.pos, used), st.queue.map(function (x) { return x.a - x.b; }).concat(asList(st.avoid)), tmode);
        var item = { a: tw.a, b: tw.b, regroup: tmode, of: key };
        if (q.picture != null) item.picture = clone(q.picture);
        var at = Math.min(st.pos + 1 + E.REQUEUE_GAP, st.queue.length);
        st.queue.splice(at, 0, item);
        res.requeued = true;
        res.twin = { a: tw.a, b: tw.b, at: at, of: key };
      }
    }
    var L = isObj(st.lineIdx) ? st.lineIdx : (st.lineIdx = { praise: 0, again: 0, remembered: 0 });
    if (correct) {
      if (q.of) { var ai = num(L.again, 0); L.again = ai + 1; res.line = takeTurn(takeLine(def, 'again'), ai, E.TAKE_LINES.again); res.lineKind = 'again'; }
      else if (q.hard) {
        var rs = takeLine(def, 'rememberedStep'), kit = E.TAKE_LINES.rememberedStep[q.hard];
        var r = isObj(rs) ? rs[q.hard] : rs;
        res.line = typeof r === 'string' && r.trim() ? r : kit;
        L.remembered = num(L.remembered, 0) + 1;
        res.lineKind = 'rememberedStep';
      } else if (q.right != null) {
        res.balloons = asList(q.right).map(function (b) { return typeof b === 'string' ? { text: b } : clone(b); }).filter(function (b) { return b && b.text; });
        res.lineKind = 'right';
      } else {
        var pi = num(L.praise, 0); L.praise = pi + 1;
        res.line = pick(def.praise != null ? def.praise : takeLine(def, 'praise'), pi);
        res.lineKind = 'praise';
      }
    } else {
      res.line = takeLine(def, res.requeued ? 'miss' : 'missLast');
      res.lineKind = 'miss';
    }
    if (res.line != null && typeof res.line !== 'string') res.line = pick(res.line, 0);
    if (res.line != null) res.line = takeFill(res.line, {}, words);
    if (res.balloons) res.balloons.forEach(function (b) { b.text = takeFill(b.text, {}, words); });
    st.pos++;
    st.col = 0; st.got = []; st.first = []; st.slips = []; st.cols = []; st.onesFirst = false; st.tapped = 0; st.tapHere = false;
    res.problemDone = true;
    res.done = T.done(st);
    return res;
  };
  /* One spread of a 'tap' turn: { spread, tapped, left, glow (the next zone to tap), marks }, or null when
   * there is none to tap. `off`: a tap elsewhere, which makes the zone glow again: { off, glow, say }, `say`
   * true the first time in the column (E.takeShow's `here` has the line). */
  T.tap = function (st, off) {
    var it = stateItem(st);
    if (!it || it.mode !== 'tap') return null;
    var c = it.p.cols[it.col], done = num(st.tapped, 0);
    if (done >= c.spreads.length) return null;
    if (off) {
      var say = !st.tapHere;
      st.tapHere = true;
      return { off: true, glow: TAKE_COLS[c.spreads[done].from], say: say };
    }
    var s = c.spreads[done];
    st.tapped = done + 1;
    var left = c.spreads.length - st.tapped;
    return {
      spread: spreadName(s), tapped: st.tapped, left: left, glow: left ? TAKE_COLS[c.spreads[st.tapped].from] : null,
      marks: marksOut(marksTo(it.p, 'tap', helpedCols(st), it.col, st.tapped))
    };
  };
  /* E.counts.summary's keys, from the take-aways (`facts` the first asks, `firstTry` those right in every
   * column; no take-away is fast), with `op: '-'`. */
  T.summary = function (st) {
    var log = (st && st.log) || [], firsts = log.filter(function (e) { return e && !e.twin; });
    var helped = log.filter(function (e) { return e && e.helped; }).length;
    return {
      set: st.set, mode: st.mode, op: '-',
      answers: log.length, correct: log.filter(function (e) { return e && e.correct; }).length, fast: 0,
      facts: firsts.length, firstTry: firsts.filter(function (e) { return e.correct; }).length,
      helped: helped, noHelp: helped === 0, finished: T.done(st)
    };
  };
  E.takes = T;

  /* The steps a chapter's take sets and every earlier chapter's teach (`teach` on an `op: '-'` set), as a map
   * and as a list in E.TAKE_STEPS' order: E.checkTakes' `taught`, and a lesson's (E.takeSlip's `extra`). */
  function taughtBy(story, stories) {
    var number = num(story && story.number, 0), got = {};
    storyList(stories).filter(function (s) { return s !== story && s.id !== (story && story.id); }).concat(story ? [story] : []).forEach(function (s) {
      if (num(s.number, 0) > number) return;
      Object.keys(s.counts || {}).forEach(function (id) { var d = s.counts[id]; if (isObj(d) && d.op === '-' && E.TAKE_STEPS.indexOf(d.teach) >= 0) got[d.teach] = true; });
    });
    return got;
  }
  function chapterSteps(story, stories) {
    var got = taughtBy(story, stories);
    return E.TAKE_STEPS.filter(function (s) { return got[s]; });
  }
  // the answers of every take set in a chapter (its lessons and its stories)
  function chapterAnswers(story) {
    var out = [];
    Object.keys((story && story.counts) || {}).forEach(function (id) {
      var d = story.counts[id];
      if (!isObj(d) || d.op !== '-') return;
      asList(d.facts).forEach(function (f) {
        var a = Array.isArray(f) ? f[0] : isObj(f) ? f.a : NaN, b = Array.isArray(f) ? f[1] : isObj(f) ? f.b : NaN;
        if (okTake(a, b)) out.push(a - b);
      });
    });
    return out;
  }
  /* A chapter's take lesson: the set (with its id), its made warm-up first when it says `warm` (seeded
   * by the lesson's start, avoiding the chapter's answers), and a fresh take state, which knows the steps taught
   * by this chapter and the earlier ones (`taught`) and the chapter's answers, which no twin takes (`avoid`). */
  E.takeLesson = function (cat, story, setId, now, stories) {
    var raw = E.countsSet(setId, story, stories) || {};
    var def = Object.assign({ id: setId }, raw);
    var facts = asList(def.facts).slice();
    if (def.warm === true) {
      var w = E.takeWarm(takeSeed(now, -1, 0), chapterAnswers(story));
      facts.unshift({ a: w.a, b: w.b, regroup: 'hers', warm: true });
    }
    var logged = cat && isObj(cat.takes) && Array.isArray(cat.takes.log) ? cat.takes.log.length : 0;
    return { def: def, state: T.start(def, { facts: facts, set: setId, mode: 'chapter', now: now, logged: logged,
      taught: chapterSteps(story, stories), avoid: chapterAnswers(story) }) };
  };

  /* ------------------------------------------------------------ the record: cat.takes (section 4)
   * { log: [entry…] (the last E.TAKE_LOG_CAP), rounds, cleanRounds }, created on her first take-away.
   * An entry: { set, a, b, answer, given, correct, helped, slips: [{ col, given, slip }], ms, cols, at,
   * kind, digits, regroup, twin?, warm?, worked?, round? }. Never `counts`: E.hardFacts, E.warriorHard,
   * E.firstTry, E.fillPool, E.siblingAsked, E.readFirst, E.factTable, E.tableOf, E.factTables,
   * E.hollowStart, the corner's "a slip?" and E.LOG_CAP never see a take-away. */
  E.logTake = function (cat, entry) {
    if (!cat || !isObj(entry)) return;
    if (!isObj(cat.takes)) cat.takes = { log: [], rounds: 0, cleanRounds: 0 };
    if (!Array.isArray(cat.takes.log)) cat.takes.log = [];
    cat.takes.log.push(entry);
    if (cat.takes.log.length > E.TAKE_LOG_CAP) cat.takes.log.splice(0, cat.takes.log.length - E.TAKE_LOG_CAP);
  };
  function takeLog(cat) { return cat && isObj(cat.takes) && Array.isArray(cat.takes.log) ? cat.takes.log : []; }
  // her own first ask: not a twin, not worked, not 'tap' (she was told to spread); the made warm-up and a store
  // round's problems are
  function ownAsk(e) { return isObj(e) && !e.twin && !e.worked && e.regroup !== 'tap' && e.regroup !== 'show'; }
  /* Her hard steps: the steps whose most recent own first ask (ownAsk) was helped, the most recent first. Speed
   * never makes a take-away hard. */
  E.hardTakes = function (cat) {
    var log = takeLog(cat), seen = {}, out = [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (!ownAsk(e)) continue;
      var s = E.takeStepOf(E.takePlan(e.a, e.b));
      if (!s || seen[s]) continue;
      seen[s] = true;
      if (e.helped) out.push(s);
    }
    return out;
  };
  /* The grown-ups' table by kind: [{ kind, problems, firstAsks (her own: ownAsk, E.hardTakes' rule), rightFirst,
   * helped, ms (the median of her right answers she spread herself, as the Counts' table takes right answers
   * only), slip (her commonest, or null) }] in E.TAKE_KINDS' order; `teen`: the facts her `fact` slips missed at a
   * top of ten or more, [{ top, bottom, n, text: '13 − 8 ×2' }], the most first; `capped` (the log is at
   * E.TAKE_LOG_CAP, so the table is her last `cap`, not her whole record) and `cap`. */
  E.takeTable = function (cat) {
    var rows = {}, teen = {}, order = [];
    takeLog(cat).forEach(function (e) {
      var p = isObj(e) && E.takePlan(e.a, e.b);
      if (!p) return;
      var k = E.takeKind(p), r = rows[k] || (rows[k] = { kind: k, problems: 0, firstAsks: 0, rightFirst: 0, helped: 0, times: [], slips: {} });
      r.problems++;
      if (ownAsk(e)) { r.firstAsks++; if (e.correct) r.rightFirst++; }
      if (e.helped) r.helped++;
      if (e.regroup === 'hers' && e.correct && okNum(e.ms)) r.times.push(e.ms);
      asList(e.slips).forEach(function (s) {
        if (!isObj(s) || E.TAKE_SLIPS.indexOf(s.slip) < 0) return;
        r.slips[s.slip] = (r.slips[s.slip] || 0) + 1;
        var c = p.cols[s.col];
        if (s.slip === 'fact' && c && c.at >= 10) {
          var key = c.at + '-' + (c.bottom || 0);
          if (!teen[key]) { teen[key] = { top: c.at, bottom: c.bottom || 0, n: 0 }; order.push(key); }
          teen[key].n++;
        }
      });
    });
    var out = E.TAKE_KINDS.filter(function (k) { return rows[k]; }).map(function (k) {
      var r = rows[k], best = null;
      E.TAKE_SLIPS.forEach(function (s) { if (r.slips[s] && (best == null || r.slips[s] > r.slips[best])) best = s; });
      return { kind: k, problems: r.problems, firstAsks: r.firstAsks, rightFirst: r.rightFirst, helped: r.helped,
        ms: r.times.length ? Math.round(median(r.times)) : null, slip: best };
    });
    var tl = order.map(function (k, i) { var t = teen[k]; return { top: t.top, bottom: t.bottom, n: t.n, i: i }; })
      .sort(function (x, y) { return y.n - x.n || x.i - y.i; })
      .map(function (t) { return { top: t.top, bottom: t.bottom, n: t.n, text: t.top + ' − ' + t.bottom + ' ×' + t.n }; });
    return { rows: out, teen: tl, capped: takeLog(cat).length >= E.TAKE_LOG_CAP, cap: E.TAKE_LOG_CAP };
  };
  /* ------------------------------------------------------------ the Hollow's shelf and Count the store (section 5)
   * Once she has finished a take set with `teach` (E.storeOpen: chapter 12's lesson), the Training Hollow opens on a
   * shelf: Count the store, One Count at a time (the Counts page, word for word as before) and My nest; before that the
   * Hollow is exactly as it was. A store round is five problems, each a twin of a template of a step she has learned
   * (E.TAKE_TEMPLATES, the chapters' own problems, and the store's own 352 − 28 and 403 − 57), seeded by the round's
   * number and its place, every answer different, all 'hers', none with a flip that lands; it lives in the lesson slot as
   * a Hollow round does (`{ mode: 'hollow', state }`, its state a take state with `round`), gives way to a chapter lesson
   * and comes back through `hollowWaiting` (E.holdLesson and E.hollowRound, untouched). A full round earns a frost-time
   * treasure, in turn by the store's own rounds (`takes.rounds`); module 1's rounds, glow and treasures are never touched
   * (E.recordLesson sends a store round here, never to E.hollowFinish). */
  E.STORE_LINES = {
    greet: 'Count the store, or one Count at a time? A full round earns a treasure for your nest.',
    again: 'Another round? I’ve got all evening.',
    intro: 'Five from the store. Ready? Here we go.',
    done: 'The whole store, counted! That deserves a treasure for your nest.'
  };
  /* The steps her finished `teach` sets taught, in E.TAKE_STEPS' order (the order the chapters teach them). A set is
   * finished as a Count's own set is (E.learnedCounts): its summary is in `lessons` and not unfinished. */
  E.takeSteps = function (cat, stories) {
    var got = {}, L = cat && isObj(cat.lessons) ? cat.lessons : {};
    E.chapters(stories).forEach(function (s) {
      Object.keys(s.counts || {}).forEach(function (id) {
        var d = s.counts[id];
        if (isObj(d) && d.op === '-' && E.TAKE_STEPS.indexOf(d.teach) >= 0 && own(L, id) && isObj(L[id]) && L[id].finished !== false) got[d.teach] = true;
      });
    });
    return E.TAKE_STEPS.filter(function (s) { return got[s]; });
  };
  E.storeOpen = function (cat, stories) { return E.takeSteps(cat, stories).length > 0; };
  /* The shelf (null while the store is closed): Tallyheart's greeting (after a round, `opts.reward`, the reward line; while
   * a Warrior Counts sitting waits, its waiting line in that place: `waiting`, from E.hollowLines, reused, with `opts.now`
   * to tell a stale one), `line` the one she says, and the buttons in their order (chapter 14 puts Tricky Counts between
   * the two big ones). `opts.stories` stands in for `stories` (PC.debug.takes: a stub chapter, never registered). */
  E.hollowShelf = function (cat, stories, opts) {
    opts = opts || {};
    var S = opts.stories || stories;
    if (!E.storeOpen(cat, S)) return null;
    var greet = opts.reward ? E.STORE_LINES.again : E.STORE_LINES.greet;
    var out = { greet: greet, line: greet, steps: E.takeSteps(cat, S),
      buttons: [{ id: 'store', label: 'Count the store' }, { id: 'counts', label: 'One Count at a time' }, { id: 'nest', label: 'My nest' }] };
    if (cat && isObj(cat.warrior)) {
      var w = E.hollowLines(cat, S, opts.now != null ? { now: opts.now } : {}).waiting;
      if (w) { out.waiting = w; out.line = w; }
    }
    // chapter 12 (the kit's section 5 leaves her lines to it): Chispapaw's "¡A contar!" after Tallyheart's greeting, absent
    // while a Warrior Counts sitting waits (its waiting line takes the place, and the room); the store opens only once
    // chapter 12's lesson is finished, so she is always met by then
    if (!out.waiting) out.friend = { who: 'chispapaw', text: E.esLine('{es:aContar}') };
    return out;
  };
  /* A store round's set: Tallyheart's, the store picture, the kit's praise, its own closing line and its introduction.
   * Chapter 12: Chispapaw echoes the round's first problem right in every column, in Spanish (one echo a round). */
  E.takeRoundDef = function () {
    return { id: 'store', op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, praise: clone(E.TAKE_LINES.praise),
      done: E.STORE_LINES.done, intro: E.STORE_LINES.intro,
      echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } };
  };
  /* A round (section 5): 1 an easy one (a `none` template); 2 her hardest step (E.hardTakes, among the steps she has
   * learned), else the newest; 3 her next hardest, else an older step; 4 the newest; 5 an older step (an older step is
   * one that spreads, learned before the newest; with none, the newest: so a round has one `none`, place 1's, unless
   * `none` is a hard step). A problem picked for a hard step carries it (`hard`), so right in every column it earns
   * that step's `rememberedStep` line. Each a twin of a template of its
   * step (a twin keeps its shape, so no answer without hundreds comes before `mixed` is learned), seeded by the round's
   * number and its place, avoiding the round's answers so far ('hers': its flip never lands). Its entries carry `round`
   * and are first asks; its state knows the steps learned (`taught`: E.takeSlip's `extra`). Returns { def, state }. */
  E.takeRoundStart = function (cat, stories, now, opts) {
    opts = opts || {};
    var learned = E.takeSteps(cat, opts.stories || stories);
    if (!learned.length) learned = ['none'];
    var n = (cat && isObj(cat.takes) ? wholeNum(cat.takes.rounds) : 0) + 1;
    var rnd = mulberry32(Math.imul(n, 2654435761) >>> 0);
    var newest = learned[learned.length - 1], older = learned.slice(0, -1).filter(function (s) { return s !== 'none'; });
    var hard = E.hardTakes(cat).filter(function (s) { return learned.indexOf(s) >= 0; }).slice(0, 2);
    var anOlder = function () { return older.length ? older[Math.floor(rnd() * older.length)] : newest; };
    var slots = [{ step: 'none' }, { step: hard[0] || newest, hard: hard[0] }];
    slots.push({ step: hard[1] || anOlder(), hard: hard[1] }, { step: newest }, { step: anOlder() });
    var answers = [], facts = [];
    slots.forEach(function (sl, place) {
      var list = E.TAKE_TEMPLATES[sl.step], t = list[Math.floor(rnd() * list.length)], p = E.takePlan(t[0], t[1]), tw = null;
      for (var k = 0; k < 8 && (!tw || tw.fallback || answers.indexOf(tw.a - tw.b) >= 0); k++) tw = E.takeTwin(p, takeSeed(n, place, k), answers, 'hers');
      answers.push(tw.a - tw.b);
      var f = { a: tw.a, b: tw.b, regroup: 'hers' };
      if (sl.hard) f.hard = sl.hard;
      facts.push(f);
    });
    var def = E.takeRoundDef();
    // (chapter 12's review: a round played while a chapter with a take set is begun and not finished, between its lesson and
    // its store, never queues a twin on one of that chapter's answers, as its lesson's twins never do: the store's 133 is
    // asked at sunset. No such chapter, no `avoid`: the round's state as before)
    var avoid = [];
    asList(opts.stories || stories).forEach(function (s) {
      if (s && s.id && E.place(cat, s.id) && !E.isFinished(cat, s.id)) chapterAnswers(s).forEach(function (x) { if (avoid.indexOf(x) < 0) avoid.push(x); });
    });
    var so = { facts: facts, set: def.id, mode: 'hollow', now: now, round: n, logged: takeLog(cat).length, taught: learned };
    if (avoid.length) so.avoid = avoid;
    return { def: def, state: T.start(def, so) };
  };
  /* A finished store round, once (its state is marked `recorded`): `takes.rounds` and, with no help, `takes.cleanRounds`
   * counted, and the next frost treasure in her nest. No claw mark, no glow, nothing of module 1's touched. Returns
   * { awarded (null for a round not finished, or recorded already), summary, rounds, clean }. */
  E.takeRoundFinish = function (cat, st) {
    var sum = T.summary(st || {});
    var none = { awarded: null, summary: sum, rounds: cat && isObj(cat.takes) ? wholeNum(cat.takes.rounds) : 0, clean: false };
    if (!cat || !isObj(st) || st.op !== '-' || st.mode !== 'hollow' || !sum.finished || st.recorded) return none;
    st.recorded = true;
    if (!isObj(cat.takes)) cat.takes = { log: [], rounds: 0, cleanRounds: 0 };
    var K = cat.takes;
    K.rounds = wholeNum(K.rounds) + 1;
    if (sum.noHelp) K.cleanRounds = wholeNum(K.cleanRounds) + 1;
    var t = E.FROST_TREASURES[(K.rounds - 1) % E.FROST_TREASURES.length];
    if (!Array.isArray(cat.nest)) cat.nest = [];
    cat.nest.push(t.id);
    return { awarded: t, summary: sum, rounds: K.rounds, clean: !!sum.noHelp };
  };
  /* The saved `takes` (normCat): her own key only; entries that are objects with a problem the kit asks and
   * a numeric `at`, `kind` recomputed when missing or wrong, the last E.TAKE_LOG_CAP; `rounds` and
   * `cleanRounds` whole numbers. */
  function wholeNum(v) { return okNum(v) && v >= 0 ? Math.floor(v) : 0; }
  function normTakes(t) {
    var log = (Array.isArray(t.log) ? t.log : []).filter(function (e) { return isObj(e) && okNum(e.at) && okTake(e.a, e.b); });
    log.forEach(function (e) { var k = E.takeKind(E.takePlan(e.a, e.b)); if (e.kind !== k) e.kind = k; });
    if (log.length > E.TAKE_LOG_CAP) log = log.slice(log.length - E.TAKE_LOG_CAP);
    return { log: log, rounds: wholeNum(t.rounds), cleanRounds: wholeNum(t.cleanRounds) };
  }
  // a saved take state the runner can take up (okLesson, for a state with `op`)
  function okTakeState(st) {
    if (st.op !== '-') return false;
    if (!st.queue.every(function (q) { return okTake(q.a, q.b); })) return false;
    if (!Array.isArray(st.got) || !Array.isArray(st.first) || !Array.isArray(st.slips) || !Array.isArray(st.cols)) return false;
    if (!st.slips.every(isObj)) return false;
    if (!okNum(st.col) || st.col !== Math.floor(st.col) || st.col < 0) return false;
    if (st.pos < st.queue.length && st.col >= String(st.queue[st.pos].a).length) return false;
    if (st.tapped != null && !(okNum(st.tapped) && st.tapped >= 0)) return false;
    if (st.taught != null && !(Array.isArray(st.taught) && st.taught.every(function (s) { return E.TAKE_STEPS.indexOf(s) >= 0; }))) return false;
    if (st.avoid != null && !(Array.isArray(st.avoid) && st.avoid.every(okNum))) return false;
    return true;
  }

  /* The guards (section 3), as a list of errors: none for a chapter with no take set. */
  var TAKE_NOT_KEYS = ['table', 'fillFrom', 'fillOrder', 'warmHard', 'light', 'help'];
  function okTakePicture(p) { return isObj(p) && (p.kind === 'store' || p.kind === 'marks'); }
  function firstBalloon(x) {
    var list = asList(x);
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (typeof b === 'string') return b;
      if (isObj(b) && b.kind !== 'caption' && typeof b.text === 'string') return b.text;
    }
    return null;
  }
  function wordCount(s) { return String(s).split(/\s+/).filter(function (w) { return w; }).length; }
  E.checkTakes = function (story, stories) {
    var errs = [];
    if (!story || !isObj(story.counts)) return errs;
    var ids = Object.keys(story.counts).filter(function (sid) { return isObj(story.counts[sid]) && story.counts[sid].op != null; });
    if (!ids.length) return errs;
    var all = storyList(stories).filter(function (s) { return s !== story && s.id !== story.id; }).concat([story]);
    var number = num(story.number, 0), taught = taughtBy(story, stories);
    var answers = {};
    ids.forEach(function (sid) {
      var d = story.counts[sid], w = 'counts ' + sid + ': ';
      if (d.op !== '-') { errs.push(w + 'op is "-" (a take set)'); return; }
      TAKE_NOT_KEYS.forEach(function (k) { if (d[k] != null) errs.push(w + 'a take set has no ' + k); });
      if (d.teach != null && E.TAKE_STEPS.indexOf(d.teach) < 0) errs.push(w + 'teach is one of ' + E.TAKE_STEPS.join(', '));
      ['twins', 'warm'].forEach(function (k) { if (d[k] != null && typeof d[k] !== 'boolean') errs.push(w + k + ' is true or false'); });
      if (d.regroup != null && E.TAKE_REGROUP.indexOf(d.regroup) < 0) errs.push(w + 'regroup is "show", "tap" or "hers"');
      if (d.picture != null && !okTakePicture(d.picture)) errs.push(w + 'picture is { kind: "store" } or { kind: "marks" }');
      if (d.lines != null) {
        if (!isObj(d.lines)) errs.push(w + 'lines is { key: words }, with E.TAKE_LINES’ keys');
        else Object.keys(d.lines).forEach(function (k) { if (!own(E.TAKE_LINES, k)) errs.push(w + 'lines: unknown key ' + k); });
      }
      all.forEach(function (s) {
        Object.keys(s.counts || {}).forEach(function (id) { var o = s.counts[id]; if (isObj(o) && o.fillFrom === sid) errs.push(w + 'the Counts set ' + id + ' fills from it (a take set lends nothing)'); });
      });
      if (!(Array.isArray(d.facts) && d.facts.length)) errs.push(w + 'facts is a list of take-aways');
      var plans = [];
      asList(d.facts).forEach(function (f, i) {
        var at = w + 'fact ' + i + ': ';
        if (!(Array.isArray(f) && f.length === 2) && !isObj(f)) { errs.push(at + 'is [a, b] or { a, b }'); return; }
        var a = Array.isArray(f) ? f[0] : f.a, b = Array.isArray(f) ? f[1] : f.b, p = E.takePlan(a, b);
        if (!p) { errs.push(at + a + ' − ' + b + ' is not a take-away the kit asks (whole numbers, 10 ≤ a ≤ 999, 1 ≤ b < a, b no longer than a)'); return; }
        if (String(p.answer).length < p.n - 1) errs.push(at + a + ' − ' + b + ': the answer is more than one digit shorter than the top');
        if (isObj(f)) {
          if (f.table != null) errs.push(at + 'a take-away has no table');
          if (f.regroup != null && E.TAKE_REGROUP.indexOf(f.regroup) < 0) errs.push(at + 'regroup is "show", "tap" or "hers"');
          if (f.picture != null && !okTakePicture(f.picture)) errs.push(at + 'picture is { kind: "store" } or { kind: "marks" }');
          // every balloon at most 12 words (captions apart): the page joins the first column's line to the last
          // one when it is the teacher's, and no balloon gets more room than the joined one
          if (f.prompt != null) {
            if (firstBalloon(f.prompt) == null) errs.push(at + 'prompt is a line, or balloons and captions');
            else asList(f.prompt).forEach(function (b, j) {
              var t = typeof b === 'string' ? b : isObj(b) && b.kind !== 'caption' && typeof b.text === 'string' ? b.text : '';
              if (wordCount(t) > 12) errs.push(at + 'its prompt’s balloon ' + j + ' is ' + wordCount(t) + ' words (12 at most: the first column’s line joins the last balloon when it is the teacher’s)');
            });
          }
        }
        plans.push(p);
        if (answers[p.answer]) errs.push(at + a + ' − ' + b + ': the answer ' + p.answer + ' is asked twice in the chapter (' + answers[p.answer] + ')');
        else answers[p.answer] = sid + ' fact ' + i;
        if (E.takeFlags(p).noHundreds && !taught.mixed) errs.push(at + a + ' − ' + b + ' has no hundreds left, before the chapter that teaches "mixed"');
      });
      var steps = plans.map(E.takeStepOf), kinds = plans.map(E.takeKind);
      if (d.teach === 'none') {
        if (!kinds.every(function (k) { return k === 'none'; })) errs.push(w + 'teach "none": every take-away needs no spread');
      } else if (d.teach === 'mixed') {
        var ks = {};
        kinds.forEach(function (k) { ks[k] = true; });
        if (Object.keys(ks).length < 4 || !ks.none) errs.push(w + 'teach "mixed": four kinds or more, one of them "none"');
        if (!plans.some(function (p) { return E.takeFlags(p).noHundreds; })) errs.push(w + 'teach "mixed": one take-away with no hundreds left');
        if (!plans.some(function (p) { return E.takeFlags(p).leavesZero; })) errs.push(w + 'teach "mixed": one take-away that leaves a zero');
      } else if (E.TAKE_STEPS.indexOf(d.teach) >= 0) {
        var ti = E.TAKE_STEPS.indexOf(d.teach), mine = steps.filter(function (s) { return s === d.teach; }).length;
        if (mine !== 3) errs.push(w + 'teach "' + d.teach + '": exactly three take-aways of that step, not ' + mine);
        if (!steps.every(function (s) { return s === d.teach || E.TAKE_STEPS.indexOf(s) < ti; })) errs.push(w + 'teach "' + d.teach + '": every other take-away an earlier step');
        if (number >= 13 && kinds.indexOf('none') < 0) errs.push(w + 'teach "' + d.teach + '": from chapter 13, one take-away that needs no spread');
      } else if (d.teach == null) {
        steps.forEach(function (s, i) { if (!taught[s]) errs.push(w + 'fact ' + i + ': its step "' + s + '" is taught by no take set of this chapter or an earlier one'); });
      }
    });
    return errs;
  };

  /* ------------------------------------------------------------ chapter 12: Spanish
   * docs/chapters/12-a-spark-at-the-hedge.spec.md, section 6 (decisions 53 and 54): Chispapaw's Spanish, chapter 12's one
   * feature. No new interaction, and the save is untouched. The words are PC.words.es (app/story/words.js, read at call
   * time); a story writes a Spanish word as a token, {es:key} ({Es:key} capitalised), which E.fill letters between the
   * engine's marks, «…», and a whole Spanish line as a balloon with `lang: 'es'` whose text is tokens and punctuation only,
   * lettered by E.esLine: the Spanish between the marks, then on a line of its own its English in parentheses, made here
   * (E.esGloss), so no story information is ever in Spanish only. The page reads the marks: rich() letters them in italics
   * with lang="es", Read to me says them in the Spanish voice (E.speechParts), so every page that passes text (a frame, the
   * Counts page's balloons, the take page's echo, the skip's counter, the shelf) carries Spanish with no change of its own.
   * Reached only by a `lang`, a {es:…} token, a set's `echo`, a skip's `lang` or the marks the engine makes: no line of
   * chapters 1 to 11, PC.warrior, E.TAKE_LINES or E.STORE_LINES has one, and a « or » typed into a dream is read as “ or ”
   * (E.dreamOf). Numbers are Latin American (the same words everywhere), 0 to 1,000. */
  var ES_ONES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce',
    'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
    'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var ES_TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var ES_HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  var ES_ASK = ['a', 'b', 'answer'];                    // a question's own numbers, as tokens ({Es:answer}); `fact` beside them
  var ES_OPEN = { '¡': '!', '¿': '?' };                 // an opening mark before a token goes inside the marks with its close
  var ES_STRIP = /[¡!¿?…,.⁠]/g;                    // what E.esEnglish ignores around a word
  /* The bare Spanish number: "cero" … "quince", "dieciséis", "veintiuno", "treinta y uno", "cien", "ciento uno" (never
   * "ciento y uno"), "doscientos", "mil"; outside 0 to 1,000 the digits as a string. */
  E.esNumber = function (n) {
    if (!(typeof n === 'number' && n === Math.floor(n) && n >= 0 && n <= 1000)) return String(n);
    if (n === 1000) return 'mil';
    if (n === 100) return 'cien';
    var h = Math.floor(n / 100), r = n % 100, s = h ? ES_HUNDREDS[h] : '';
    if (r || !h) s = (s ? s + ' ' : '') + (r < 30 ? ES_ONES[r] : ES_TENS[Math.floor(r / 10)] + (r % 10 ? ' y ' + ES_ONES[r % 10] : ''));
    return s;
  };
  /* PC.words.es, read at call time (as E.TAKE_WORDS reads PC.words); {} when there is none. */
  E.esWords = function () { var w = isObj(PC.words) ? PC.words.es : null; return isObj(w) ? w : {}; };
  function esWord(key, side, fallback) { var w = E.esWords()[key]; return isObj(w) && typeof w[side] === 'string' && w[side] ? w[side] : fallback; }
  /* "siete por ocho, cincuenta y seis" (Aron's form, decision 53: the fact, a comma, the answer). */
  E.esFact = function (a, b) { return E.esNumber(a) + ' ' + esWord('por', 'es', 'por') + ' ' + E.esNumber(b) + ', ' + E.esNumber(a * b); };
  // the first letter in capitals, after any leading ¡ ¿ … or word joiner (U+2060)
  function esCap(s) { return String(s).replace(/^([¡¿…⁠\s]*)(.)/, function (m, lead, c) { return lead + c.toUpperCase(); }); }
  /* A token's key, as { es, en } (en: the English the gloss takes; a word's own `say` is E.esEnglish's), or null: a whole
   * number (E.esNumber); `fact`, `a`, `b`, `answer` when `extra` has them (a Counts page or a take page); else a key of
   * PC.words.es. An unknown key stays as written, as any token does. */
  function esValue(key, extra) {
    if (/^\d+$/.test(key)) return { es: E.esNumber(+key), en: E.numberWords(+key) };
    if (key === 'fact' && extra && okNum(extra.a) && okNum(extra.b)) {
      return { es: E.esFact(extra.a, extra.b), en: E.numberWords(extra.a) + ' ' + esWord('por', 'en', 'times') + ' ' + E.numberWords(extra.b) + ', ' + E.numberWords(extra.a * extra.b) };
    }
    if (ES_ASK.indexOf(key) >= 0 && extra && okNum(extra[key])) return { es: E.esNumber(extra[key]), en: E.numberWords(extra[key]) };
    if (key === 'fact' || ES_ASK.indexOf(key) >= 0) return null;
    var w = E.esWords()[key];
    return own(E.esWords(), key) && isObj(w) && typeof w.es === 'string' ? { es: w.es, en: typeof w.en === 'string' ? w.en : '' } : null;
  }
  /* The one pass that fills both kinds of token (E.fill's): the first group is exactly the old \{([A-Za-z]+)\}, filled
   * exactly as before (`extra`, then the cat's), so every existing line fills as it did; the second is {es:key} or
   * {Es:key}. `mode`: 'marks' (E.fill: a Spanish token between «», a ¡ or ¿ just before it with its ! or ? just after
   * going inside with it), 'bare' (E.esLine's inside: the Spanish alone), 'en' (E.esGloss: its English), 'esmarks' (an
   * echo's English line: the Spanish tokens filled with marks, the cat's left for the page). */
  function esFill(s, cat, extra, mode) {
    var re = /\{(?:([A-Za-z]+)|([Ee]s):([^}]+))\}/g, out = '', i = 0, t = null, m;
    while ((m = re.exec(s))) {
      var from = i;
      out += s.slice(i, m.index);
      i = re.lastIndex;
      if (m[1] != null) {
        if (mode === 'esmarks') { out += m[0]; continue; }
        if (extra && own(extra, m[1])) { out += String(extra[m[1]]); continue; }
        if (!t) t = E.tokens(cat);
        out += own(t, m[1]) ? t[m[1]] : m[0];
        continue;
      }
      var v = esValue(m[3], extra);
      if (!v) { out += m[0]; continue; }
      var word = mode === 'en' ? v.en : v.es;
      if (m[2] === 'Es') word = esCap(word);
      if (mode === 'bare' || mode === 'en') { out += word; continue; }
      var pre = m.index > from ? s.charAt(m.index - 1) : '';
      if (ES_OPEN[pre] && s.charAt(i) === ES_OPEN[pre]) { out = out.slice(0, -1); word = pre + word + s.charAt(i); i++; }
      out += '«' + word + '»';
    }
    return out + s.slice(i);
  }
  /* A line's Spanish tokens filled between the marks, its cat's tokens left as written (an echo's English line, and the
   * storyboard's words for a {es:key}). */
  E.esMarks = function (text, extra) { return text == null ? '' : esFill(String(text), null, extra, 'esmarks'); };
  /* The English of a Spanish line: each token by its English (a number by E.numberWords; `fact` as "seven times eight,
   * fifty-six"; a word by its `en`), {Es:…} capitalised, ¡ and ¿ dropped, every other character kept. */
  E.esGloss = function (text, cat, extra) { return text == null ? '' : esFill(String(text), cat, extra, 'en').replace(/[¡¿]/g, ''); };
  /* A whole Spanish line as the page letters it: its tokens filled with no inner marks, the whole between «», then a new
   * line and its gloss in parentheses: "«…once, doce. Doce gatos.»\n(…eleven, twelve. Twelve cats.)". */
  E.esLine = function (text, cat, extra) {
    if (text == null) return '';
    return '«' + esFill(String(text), cat, extra, 'bare') + '»\n(' + E.esGloss(text, cat, extra) + ')';
  };
  var ES_NUM_AT = null;
  function esNumberAt(s) {
    if (!ES_NUM_AT) { ES_NUM_AT = {}; for (var n = 0; n <= 1000; n++) ES_NUM_AT[E.esNumber(n)] = n; }
    return own(ES_NUM_AT, s) ? ES_NUM_AT[s] : null;
  }
  /* What a Spanish word or phrase is in English, for speech with no Spanish voice: a words-table entry's `say`, else its
   * `en` (matched on its `es`); a number's words, matched against E.esNumber(0 … 1000) ignoring case, ¡ ! ¿ ? … , . and
   * U+2060 (the English capitalised as the Spanish was); else ''. */
  E.esEnglish = function (s) {
    s = String(s == null ? '' : s).trim();
    var bare = s.replace(ES_STRIP, '').replace(/\s+/g, ' ').trim(), W = E.esWords(), keys = Object.keys(W), k, i;
    var said = function (w) { return typeof w.say === 'string' && w.say ? w.say : typeof w.en === 'string' ? w.en : ''; };
    for (i = 0; i < keys.length; i++) { k = W[keys[i]]; if (isObj(k) && k.es === s) return said(k); }
    for (i = 0; i < keys.length && bare; i++) { k = W[keys[i]]; if (isObj(k) && typeof k.es === 'string' && k.es.replace(ES_STRIP, '').trim().toLowerCase() === bare.toLowerCase()) return said(k); }
    var n = bare ? esNumberAt(bare.toLowerCase()) : null;
    if (n == null) return '';
    var en = E.numberWords(n);
    return bare.charAt(0) !== bare.charAt(0).toLowerCase() ? cap1(en) : en;
  };
  /* English speech, respelled (PC.words.sayAs): whole words, in the table's order (Chispapaw before Chispa, so never
   * "Cheespapaw"); a respelled word that is the cat's own name, her Clan name, her warrior name or her pet name (ignoring
   * case) is skipped, so a cat a player named Chispa is said as she always was. A no-op for every line of chapters 1 to 11. */
  E.sayAs = function (text, cat) {
    var s = String(text == null ? '' : text), list = isObj(PC.words) && Array.isArray(PC.words.sayAs) ? PC.words.sayAs : [];
    if (!s || !list.length) return s;
    var mine = [];
    if (cat && typeof cat.name === 'string' && cat.name) mine.push(cat.name, cat.name + 'paw', E.warriorName(cat));
    if (cat && typeof cat.petname === 'string' && cat.petname) mine.push(cat.petname);
    mine = mine.filter(Boolean).map(function (x) { return x.toLowerCase(); });
    list.forEach(function (p) {
      if (!Array.isArray(p) || typeof p[0] !== 'string' || !p[0] || typeof p[1] !== 'string' || mine.indexOf(p[0].toLowerCase()) >= 0) return;
      var re = new RegExp('(^|[^\\p{L}\\p{N}])' + p[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\p{L}\\p{N}])', 'gu');
      s = s.replace(re, function (m, lead) { return lead + p[1]; });
    });
    return s;
  };
  /* A filled line split for the voices: [{ text, lang: 'en' | 'es', en?, line?, gloss? }]. Outside «» English (E.sayAs
   * applied); inside Spanish, its `en` E.esEnglish's. A Spanish part is a line (`line: true`) only when the text after its
   * closing » is exactly a new line and its gloss in parentheses (that part `gloss: true`); every other Spanish part is a
   * word in a line. A line with no « and `lang: 'es'` is one Spanish part with no English; any other one English part. */
  E.speechParts = function (text, lang, cat) {
    var s = String(text == null ? '' : text), out = [], i = 0;
    if (s.indexOf('«') < 0) return lang === 'es' ? [{ text: s, lang: 'es', en: '' }] : [{ text: E.sayAs(s, cat), lang: 'en' }];
    var en = function (x) { if (x) out.push({ text: E.sayAs(x, cat), lang: 'en' }); };
    while (i < s.length) {
      var a = s.indexOf('«', i), b = a < 0 ? -1 : s.indexOf('»', a + 1);
      if (a < 0 || b < 0) { en(s.slice(i).replace(/«/g, '')); break; }
      en(s.slice(i, a));
      var es = s.slice(a + 1, b), g = /^\n\(([^«»\n]*)\)$/.exec(s.slice(b + 1));
      if (g) {
        out.push({ text: es, lang: 'es', en: E.esEnglish(es), line: true });
        out.push({ text: E.sayAs(g[1], cat), lang: 'en', gloss: true });
        return out;
      }
      out.push({ text: es, lang: 'es', en: E.esEnglish(es) });
      i = b + 1;
    }
    return out;
  };
  /* The echoes: a set's `echo`, { on: 'first' | [[a, b], …], lines: [{ who, text, lang?, kind? }] }. A `lang: 'es'` line is
   * lettered by E.esLine with the answer's numbers; an English line takes its Spanish tokens filled, its cat's for the page. */
  function echoLines(def) { return isObj(def && def.echo) ? asList(def.echo.lines).filter(function (l) { return isObj(l) && typeof l.text === 'string' && l.text; }) : []; }
  function echoOn(on, a, b, either) { return Array.isArray(on) && on.some(function (p) { var q = factPair(p); return (q[0] === a && q[1] === b) || (!!either && q[0] === b && q[1] === a); }); }
  function echoBalloon(l, x) {
    var o = { who: l.who || 'chispapaw', text: l.lang === 'es' ? E.esLine(l.text, null, x) : esFill(l.text, null, x, 'esmarks') };
    if (l.lang === 'es') o.lang = 'es';
    if (l.kind) o.kind = l.kind;
    return o;
  }
  /* The Counts page's echo (runLesson, one guarded statement after E.counts.answer): null unless the set has `echo` and the
   * answer is right; `on: 'first'` only for the lesson's first right answer (its log's right entries are one: a retry or a
   * filler counts, and a lesson picked up after it never echoes again); a list, when the answer's pair is one of it (either
   * order). The balloons the page shows, waiting for Next: the line this answer earned (`res.line`, the teacher's, if any;
   * else the fact's own `res.balloons`), then each echo line, its numbers the answer's as it was asked. */
  E.countsEcho = function (def, st, res, teacher) {
    if (!def || !isObj(def.echo) || !res || !res.correct || !isObj(res.entry)) return null;
    var e = res.entry, on = def.echo.on;
    if (on === 'first') { if (((st && st.log) || []).filter(function (x) { return x && x.correct; }).length !== 1) return null; }
    else if (!echoOn(on, e.a, e.b, true)) return null;
    var out = res.line ? [{ who: teacher || def.teacher || 'tallyheart', text: res.line }] : res.balloons && res.balloons.length ? clone(asList(res.balloons)) : [];
    var x = { a: e.a, b: e.b, answer: e.a * e.b };
    echoLines(def).forEach(function (l) { out.push(echoBalloon(l, x)); });
    return out.length ? out : null;
  };
  /* The take page's echo (runTakes' problem end, for every finished problem; never the kit's `o.echo` hook, which would hold
   * an echo's room above every column): null unless the set has `echo` and `info` is a problem (a column is never echoed);
   * a list, when its pair is one of it, right or helped (a twin never has the original's top, so it never matches); `on:
   * 'first'`, only for a problem right in every column that is the first such in the state's log (a store round's: one echo
   * a round). One balloon, { who, text }: the first echo line, its numbers the problem's. */
  E.takeEcho = function (def, info, st) {
    if (!def || !isObj(def.echo) || !isObj(info) || !info.problem) return null;
    var on = def.echo.on;
    if (on === 'first') {
      if (!info.correct) return null;
      var log = (st && st.log) || [], rights = log.filter(function (x) { return x && x.correct; }), last = log[log.length - 1];
      if (rights.length > 1 || (rights.length === 1 && !(last && last.correct && last.a === info.a && last.b === info.b))) return null;
    } else if (!echoOn(on, info.a, info.b, false)) return null;
    var l = echoLines(def)[0];
    if (!l) return null;
    var b = echoBalloon(l, { a: info.a, b: info.b, answer: okNum(info.answer) ? info.answer : info.a - info.b });
    return { who: b.who, text: b.text };
  };
  /* The Spanish count (E.skipView, a skip with `lang: 'es'`): the numbers so far in Spanish words between the marks, the
   * first capitalised, joined by commas, "…" after them while it grows and the last "¡…!" when done (a capital made before
   * the ¡…! is put round a word, so a one-group count is "¡Diez!"); done, a new line and its English in parentheses.
   * `say`: the newest number between the marks ("«veinte»"); `gloss`: the English line when done; `wait`: the page waits
   * for Next (a Spanish count never turns its own page). */
  function esSkip(v, totals, n, done, table) {
    var es = totals.map(function (t) { return E.esNumber(t); }), en = totals.map(function (t) { return E.numberWords(t); });
    if (n) { es[0] = esCap(es[0]); en[0] = cap1(en[0]); }
    if (done && n) { es[n - 1] = '¡' + es[n - 1] + '!'; en[n - 1] = en[n - 1] + '!'; }
    v.lang = 'es';
    v.count = !n ? '' : '«' + es.join(', ') + (done ? '' : '…') + '»' + (done ? '\n(' + en.join(', ') + ')' : '');
    v.say = n ? '«' + E.esNumber(n * table) + '»' : '';
    if (done && n) v.gloss = en.join(', ');
    v.wait = true;
    return v;
  }
  /* Chapter 12's guards, added to E.checkStory's errors (none for a chapter with no Spanish: chapters 1 to 11 raise none).
   * A balloon's `lang` is 'es', only on a frame's `say` balloon, a set's `echo.lines` or a Counts set's prompt balloon (a
   * fact's `prompt` or `retryPrompt`, a set's `prompt` given as balloons: the design the chapters after this one ask for);
   * never a caption, an option, a take set's prompt or any other line. A `lang: 'es'` line has a token and, its tokens
   * removed, no letter; filled with its largest numbers it is at most eight words; it holds no cat token. Every {es:key}
   * resolves: a whole number 0 to 1,000; `fact`, `a`, `b`, `answer` only in an echo line (`fact` only on a set without
   * `op: '-'`), `a` and `b` in a Counts prompt's Spanish line; else a key of PC.words.es with string `es` and `en`; and no
   * words-table key is a number or one of those four. No « or » anywhere in a story file. A skip's `lang` is 'es', its
   * groups × table at most 1,000. A set's `echo` is { on, lines }: `on` 'first' or pairs among the set's facts, `lines`
   * one to three on a Counts set and exactly one on a take set, each { who, text, lang?, kind? }. For the chapters after
   * this one: a lowercase {es:…} lettered lowercase that opens a line, or follows . ! or ? (after any ¡ or ¿; never after
   * "…"); a number token ending in "uno" straight before a word token ("veintiuno gatos" for veintiún). */
  E.ES_MAX_WORDS = 8;
  E.checkSpanish = function (story) {
    var errs = [], W = E.esWords();
    if (!story || typeof story !== 'object') return errs;
    var counts = isObj(story.counts) ? story.counts : {};
    Object.keys(W).forEach(function (k) {
      if (/^\d+$/.test(k) || k === 'fact' || ES_ASK.indexOf(k) >= 0) errs.push('PC.words.es: ' + k + ' is a number or a question’s own token, never a word');
      else if (!(isObj(W[k]) && typeof W[k].es === 'string' && W[k].es && typeof W[k].en === 'string' && W[k].en)) errs.push('PC.words.es: ' + k + ' is { es, en, say? }');
    });
    // where a line sits decides what its tokens may name: 'echo' (a set's echo line), 'ask' (a Counts prompt's Spanish line)
    function tokens(where, text, ctx) {
      var re = /\{([Ee]s):([^}]+)\}/g, m;
      while ((m = re.exec(text))) {
        var k = m[2], ok;
        if (/^\d+$/.test(k)) ok = +k >= 0 && +k <= 1000;
        else if (k === 'fact') ok = ctx.echo && !ctx.take;
        else if (ES_ASK.indexOf(k) >= 0) ok = ctx.echo || (ctx.ask && k !== 'answer');
        else ok = own(W, k) && isObj(W[k]) && typeof W[k].es === 'string' && typeof W[k].en === 'string';
        if (!ok) errs.push(where + ': ' + m[0] + ' names nothing it may here (a whole number 0 to 1,000, a word of PC.words.es; fact, a, b, answer in an echo line, fact on a Counts set; a, b in a Counts prompt’s Spanish line)');
        // (the chapters after this one) a lowercase token lettered lowercase at a sentence's start
        if (ok && m[1] === 'es') {
          var v = esValue(k, { a: 7, b: 8, answer: 56 }), lead = text.slice(0, m.index).replace(/[¡¿]+$/, '');
          if (v && /^[¡¿…⁠]*\p{Ll}/u.test(v.es) && (/(^|\n)\s*$/.test(lead) || /[.!?]\s*$/.test(lead))) errs.push(where + ': ' + m[0] + ' opens a sentence in lower case: {Es:' + k + '}');
        }
      }
      var n = /\{[Ee]s:(\d+)\}\s+\{[Ee]s:([A-Za-z]+)\}/g;
      while ((m = n.exec(text))) if (/uno$/.test(E.esNumber(+m[1])) && own(W, m[2])) errs.push(where + ': ' + m[0] + ': a number ending in uno before a word is cut short in Spanish (veintiún gatos): reword it');
    }
    function esLineCheck(where, text, ctx) {
      if (!/\{[Ee]s:[^}]+\}/.test(text)) errs.push(where + ': a Spanish line (lang: \'es\') is written in {es:…} tokens');
      if (/\{[A-Za-z]+\}/.test(text)) errs.push(where + ': a Spanish line holds only {es:…} tokens ({name} is never Spanish)');
      if (/\p{L}/u.test(text.replace(/\{[^}]*\}/g, ''))) errs.push(where + ': a Spanish line is tokens and punctuation only (its English is made by the engine)');
      var big = ctx.take ? { a: 999, b: 999, answer: 999 } : { a: 9, b: 9, answer: 999 };
      var words = esFill(text, null, big, 'bare').split(/\s+/).filter(function (w) { return /[\p{L}\p{N}]/u.test(w); }).length;
      if (words > E.ES_MAX_WORDS) errs.push(where + ': a Spanish line is at most ' + E.ES_MAX_WORDS + ' words (' + words + ' with its largest numbers)');
    }
    function balloonCheck(where, b, ctx, langOk) {
      if (!isObj(b)) return;
      if (b.lang != null && !(langOk && b.lang === 'es')) errs.push(where + ': lang is \'es\', on a frame’s balloon, an echo line or a Counts prompt’s balloon only');
      else if (b.lang === 'es' && typeof b.text === 'string') esLineCheck(where, b.text, ctx);
    }
    // every string in the story: no « or » (the engine's marks), every token resolved where it stands (a set's echo line:
    // `echo`; a Counts prompt's Spanish balloon: `ask`; a take set: `take`)
    var seen = [];
    function walk(o, where, ctx, depth) {
      if (o == null || depth > 40) return;
      if (typeof o === 'string') {
        if (/[«»]/.test(o)) errs.push(where + ': « and » are the engine’s marks for Spanish: write {es:…}');
        tokens(where, o, ctx);
        return;
      }
      if (typeof o !== 'object' || seen.indexOf(o) >= 0) return;
      seen.push(o);
      var inner = ctx.prompt && o.lang === 'es' ? { ask: true, take: ctx.take } : ctx;
      Object.keys(o).forEach(function (k) { if (k !== 'scene') walk(o[k], where + '.' + k, inner, depth + 1); });   // (a scene: the art's options)
    }
    Object.keys(story).forEach(function (k) {
      if (k !== 'counts') return walk(story[k], k, {}, 1);
      Object.keys(counts).forEach(function (sid) {
        var d = counts[sid], take = isObj(d) && d.op === '-';
        if (!isObj(d)) return;
        Object.keys(d).forEach(function (k2) {
          var at = 'counts ' + sid + '.' + k2, c = { take: take };
          if (k2 === 'echo') return walk(d.echo, at, { take: take, echo: true }, 2);
          if (k2 === 'prompt') return walk(d.prompt, at, { take: take, prompt: !take }, 2);
          if (k2 !== 'facts' || !Array.isArray(d.facts)) return walk(d[k2], at, c, 2);
          d.facts.forEach(function (f, i) {
            if (!isObj(f)) return walk(f, at + '.' + i, c, 3);
            Object.keys(f).forEach(function (k3) { walk(f[k3], at + '.' + i + '.' + k3, k3 === 'prompt' || k3 === 'retryPrompt' ? { take: take, prompt: !take } : c, 4); });
          });
        });
      });
    });
    // a balloon's lang: where it may stand
    Object.keys(isObj(story.frames) ? story.frames : {}).forEach(function (id) {
      var f = story.frames[id];
      if (!isObj(f)) return;
      asList(f.say).forEach(function (b, i) { balloonCheck(id + ' say ' + i, b, {}, true); });
      asList(f.caption).forEach(function (c, i) { balloonCheck(id + ' caption ' + i, c, {}, false); });
      if (isObj(f.choice)) asList(f.choice.options).forEach(function (o, i) { balloonCheck(id + ' option ' + i, o, {}, false); });
      if (isObj(f.skip) && f.skip.lang != null) {
        if (f.skip.lang !== 'es') errs.push(id + ': skip lang is \'es\' (the count in Spanish words)');
        else if (num(f.skip.groups, 0) * num(f.skip.table, 0) > 1000) errs.push(id + ': a Spanish count goes no higher than 1,000 (groups × table)');
      }
    });
    Object.keys(counts).forEach(function (sid) {
      var d = counts[sid];
      if (!isObj(d)) return;
      var take = d.op === '-', at = 'counts ' + sid;
      (d.facts || []).forEach(function (f, i) {
        if (!isObj(f)) return;
        ['prompt', 'retryPrompt'].forEach(function (k) { if (f[k] != null && typeof f[k] !== 'string' && f[k] !== true && f[k] !== false) asList(f[k]).forEach(function (b, j) { balloonCheck(at + ': fact ' + i + ' ' + k + ' ' + j, b, { ask: true }, !take && b && b.kind !== 'caption'); }); });
        ['right', 'rightAgain'].forEach(function (k) { if (f[k] != null && typeof f[k] !== 'string' && f[k] !== true) asList(f[k]).forEach(function (b, j) { balloonCheck(at + ': fact ' + i + ' ' + k + ' ' + j, b, {}, false); }); });
      });
      if (d.prompt != null && typeof d.prompt !== 'string') asList(d.prompt).forEach(function (b, j) { balloonCheck(at + ': prompt ' + j, b, { ask: true }, !take && b && b.kind !== 'caption'); });
      if (d.echo == null) return;
      var E2 = d.echo;
      if (!isObj(E2) || Object.keys(E2).some(function (k) { return k !== 'on' && k !== 'lines'; })) { errs.push(at + ': echo is { on, lines }'); return; }
      var pairs = pairSet(d.facts || []);
      if (!(E2.on === 'first' || (Array.isArray(E2.on) && E2.on.length && E2.on.every(function (p) { var q = factPair(p); return own(pairs, pairKey(q[0], q[1])) && (!take || (d.facts || []).some(function (f) { var r = factPair(f); return r[0] === q[0] && r[1] === q[1]; })); })))) {
        errs.push(at + ': echo on is \'first\' or a list of the set’s own facts, like [[475, 132]]');
      }
      var L = Array.isArray(E2.lines) ? E2.lines : [];
      if (take ? L.length !== 1 : !(L.length >= 1 && L.length <= 3)) errs.push(at + ': echo lines are ' + (take ? 'exactly one on a take set (the kit’s echo is one balloon)' : 'one to three on a Counts set'));
      L.forEach(function (l, j) {
        if (!(isObj(l) && typeof l.who === 'string' && l.who && typeof l.text === 'string' && l.text && Object.keys(l).every(function (k) { return ['who', 'text', 'lang', 'kind'].indexOf(k) >= 0; }))) errs.push(at + ': echo line ' + j + ' is { who, text, lang?, kind? }');
        else balloonCheck(at + ': echo line ' + j, l, { echo: true, take: take }, true);
      });
    });
    return errs;
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
      // chapter 11: the two computed keys
      asList(w.offer).forEach(function (v) { if (THIRTY.indexOf(v) < 0) errs.push(where + ': offer names one of the thirty endings (E.WARRIOR_ENDINGS), not ' + JSON.stringify(v)); });
      asList(w.nameHas).forEach(function (v) { if (!(typeof v === 'string' && /^[a-z]+$/.test(v))) errs.push(where + ': nameHas is a word in lower-case letters, not ' + JSON.stringify(v)); });
    }
    // chapter 11: the thirty endings an offer may name; flags no `sets` may name (E.matches computes the first
    // two, and `ending` is her own field, set only by an option's `ending` or the Type screen)
    var THIRTY = [].concat.apply([], allRows());
    var COMPUTED = ['offer', 'nameHas', 'ending'];
    function checkSets(where, sets) {
      if (!isObj(sets)) return;
      Object.keys(sets).forEach(function (k) { if (COMPUTED.indexOf(k) >= 0) errs.push(where + ': sets ' + k + ', which no flag may be (offer and nameHas are computed, ending is her own field)'); });
    }
    // chapter 10: the card pick. Its flag is set only by its pick: no frame `sets` it, no option, no other pick
    var optSets = {}, pickFlags = {};
    Object.keys(story.frames).forEach(function (id) {
      var f = story.frames[id];
      if (f && f.choice) (f.choice.options || []).forEach(function (o) { if (o && isObj(o.sets)) Object.keys(o.sets).forEach(function (k) { optSets[k] = id; }); });
      if (f && isObj(f.pick) && typeof f.pick.flag === 'string') (pickFlags[f.pick.flag] = pickFlags[f.pick.flag] || []).push(id);
    });
    function isLine(v) { return typeof v === 'string' && !!v.trim(); }
    function checkEndingInput(id, f) {
      var inp = f.input, cast = (f.scene && f.scene.cast) || [];
      var inCast = function (w) { return cast.some(function (c) { return c && c.who === w; }); };
      var rf = inp.refuse;
      if (!isObj(rf)) errs.push(id + ': an ending input has refuse: { own, star, paw, kit: { who, text }, clan: { text } }');
      else {
        ['own', 'star', 'paw', 'kit'].forEach(function (k) {
          var r = rf[k];
          if (!(isObj(r) && isLine(r.who) && isLine(r.text))) errs.push(id + ': ending refuse ' + k + ' is { who, text }');
          else if (!inCast(r.who)) errs.push(id + ': ending refuse ' + k + ': ' + r.who + ' is not in the frame’s cast');
        });
        if (!(isObj(rf.clan) && isLine(rf.clan.text))) errs.push(id + ': ending refuse clan is { text }: the Clan cat whose name it is says it');
        else if (rf.clan.who != null) errs.push(id + ': ending refuse clan has no who: the Clan cat whose name it is says it');
        ['tallyheart', 'thymeleaf', 'murmurchime'].forEach(function (w) { if (!inCast(w)) errs.push(id + ': ending refuse clan: ' + w + ' is not in the frame’s cast (each may say it)'); });
        Object.keys(rf).forEach(function (k) { if (['own', 'star', 'paw', 'kit', 'clan'].indexOf(k) < 0) errs.push(id + ': ending refuse has no ' + k + ' (own, star, paw, kit, clan)'); });
      }
      if (inp.sets != null) {
        if (!(isObj(inp.sets) && Object.keys(inp.sets).every(function (k) { var v = inp.sets[k]; return typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number'; }))) {
          errs.push(id + ': input sets is an object of flags, like { ch11Named: "self" }');
        } else {
          Object.keys(inp.sets).forEach(function (k) { if (own(sticky, k)) errs.push(id + ' input: sets ' + k + ', which frame ' + sticky[k] + ' sets for good'); });
          checkSets(id + ' input', inp.sets);
        }
      }
    }
    function checkPick(id, f) {
      var pk = f.pick;
      if (!isObj(pk)) { errs.push(id + ': pick is { claim, right, nudges, flag, next }'); return; }
      if (!isLine(pk.claim) || !E.pickWord(pk.claim)) errs.push(id + ': pick claim is a line with exactly one word in capitals (the word the strip lights), like "It FLEW out of your camp!"');
      var who = pk.who == null ? 'reynard' : pk.who;
      if (!isLine(who)) errs.push(id + ': pick who is the one who makes the claim, like "reynard"');
      else if (!(f.scene && (f.scene.cast || []).some(function (c) { return c && c.who === who; }))) errs.push(id + ': pick: ' + who + ' (who makes the claim) is not in the frame’s cast');
      if (pk.by != null && !isLine(pk.by)) errs.push(id + ': pick by is the one who nudges, like "tallyheart"');
      var right = Array.isArray(pk.right) ? pk.right : null;
      if (!(right && right.length && right.every(function (c) { return isLine(c); }))) errs.push(id + ': pick right is a list of the cards that answer the claim');
      else right.forEach(function (c) { if (!hasCard(c)) errs.push(id + ': pick right: unknown card ' + c); });
      if (pk.own != null) {
        if (!isObj(pk.own)) errs.push(id + ': pick own is { <a wrong card>: its own nudge }');
        else Object.keys(pk.own).forEach(function (c) {
          if (!hasCard(c)) errs.push(id + ': pick own: unknown card ' + c);
          if (right && right.indexOf(c) >= 0) errs.push(id + ': pick own: ' + c + ' is a right card (own is a wrong card’s nudge)');
          if (!isLine(pk.own[c])) errs.push(id + ': pick own: ' + c + ' needs its one line');
        });
      }
      if (!(Array.isArray(pk.nudges) && pk.nudges.length === 2 && pk.nudges.every(isLine))) errs.push(id + ': pick nudges is two lines: the first wrong pick’s, then the second’s (and every one after)');
      if (!isLine(pk.flag)) errs.push(id + ': pick flag is the flag her pick sets, like "ch10PickFlew"');
      else {
        if (own(sticky, pk.flag)) errs.push(id + ': pick flag ' + pk.flag + ' is set for good by frame ' + sticky[pk.flag]);
        if (own(optSets, pk.flag)) errs.push(id + ': pick flag ' + pk.flag + ' is set by a choice too (frame ' + optSets[pk.flag] + ')');
        if ((pickFlags[pk.flag] || []).length > 1) errs.push(id + ': pick flag ' + pk.flag + ' is another pick’s too (' + pickFlags[pk.flag].filter(function (x) { return x !== id; }).join(', ') + ')');
      }
      ['prompt', 'label'].forEach(function (k) { if (pk[k] != null && typeof pk[k] !== 'string') errs.push(id + ': pick ' + k + ' is a line'); });
    }
    Object.keys(story.frames).forEach(function (id) {
      var f = story.frames[id];
      var kinds = ['next', 'choice', 'input', 'look', 'counts', 'skip', 'scratch', 'file', 'pick', 'ask', 'end'].filter(function (k) { return f[k]; });
      if (kinds.length !== 1) errs.push(id + ': needs exactly one of next/choice/input/look/counts/skip/scratch/file/pick/ask/end, has ' + (kinds.join(',') || 'none'));
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
        checkSets(id + ' option ' + i, o.sets);
        // chapter 11: an offered name's ending, as given
        if (o.ending != null && !(typeof o.ending === 'string' && new RegExp('^[a-z]{1,' + E.ENDING_MAX + '}$').test(o.ending))) {
          errs.push(id + ' option ' + i + ': ending is 1 to ' + E.ENDING_MAX + ' lower-case letters, like "mist"');
        }
      });
      // chapter 11: the Type screen (an input of kind 'ending'): where to go, the five refusals and who says
      // each (every speaker in the frame's cast), and the flags an accepted ending sets
      if (f.input && f.input.kind === 'ending') checkEndingInput(id, f);
      else if (f.input && f.input.sets != null) errs.push(id + ': an input’s sets are read for kind "ending" only');
      if (f.skip && f.skip.name != null && !isLine(f.skip.name)) errs.push(id + ': skip name is a line (the name tag on the counter’s balloon, like "{name}{ending}")');
      // chapter 4: flags set by reaching the frame, the cards it gives, the bark Taps, her Case File
      if (f.sets != null && !(isObj(f.sets) && Object.keys(f.sets).every(function (k) { var v = f.sets[k]; return typeof v === 'string' || typeof v === 'boolean' || typeof v === 'number'; }))) {
        errs.push(id + ': sets is an object of flags, like { foundSquall: true }');
      }
      checkSets(id, f.sets);
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
      // chapter 10: the card pick (its flag is checked against every `when` in the story below)
      if (f.pick) checkPick(id, f);
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
    // chapter 10: every `when` in the story that names a pick's flag (a caption's, a balloon's, a frame's, an
    // option's, a recap line's, inside `not` too) names only cards in that pick's `right` (a typo'd id is an error)
    var pickRight = {};
    Object.keys(story.frames).forEach(function (id) { var pk = story.frames[id] && story.frames[id].pick; if (isObj(pk) && typeof pk.flag === 'string' && Array.isArray(pk.right)) pickRight[pk.flag] = pk.right; });
    if (Object.keys(pickRight).length) {
      var seen = [];
      (function walk(o, where, depth) {
        if (!o || typeof o !== 'object' || depth > 40 || seen.indexOf(o) >= 0) return;
        seen.push(o);
        if (Array.isArray(o)) { o.forEach(function (x, i) { walk(x, where + '.' + i, depth + 1); }); return; }
        Object.keys(o).forEach(function (k) {
          if (k === 'when' && isObj(o[k])) (function names(w, at) {
            Object.keys(w).forEach(function (fk) {
              if (fk === 'not' && isObj(w.not)) return names(w.not, at + ' (not)');
              if (!own(pickRight, fk)) return;
              var vals = Array.isArray(w[fk]) ? w[fk] : [w[fk]];
              vals.forEach(function (v) { if (pickRight[fk].indexOf(v) < 0) errs.push(at + ': when ' + fk + ' names ' + JSON.stringify(v) + ', not a card in that pick’s right'); });
            });
          })(o[k], where);
          walk(o[k], where + '.' + k, depth + 1);
        });
      })(story, story.id || 'story', 0);
    }
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
        // chapter 8: a partner's own line, `lines: { <a card in with>: line }`, checked as `line` is
        var ll = isObj(c.link) ? c.link.lines : null;
        if (ll != null) {
          if (!isObj(ll)) errs.push('card ' + cid + ': link lines is { <a card it touches>: its own line }');
          else Object.keys(ll).forEach(function (k) {
            if (!(Array.isArray(lw) && lw.indexOf(k) >= 0)) errs.push('card ' + cid + ': link lines names a card its with does not: ' + k);
            if (typeof ll[k] !== 'string' || !ll[k].trim()) errs.push('card ' + cid + ': link lines for ' + k + ' needs its one line');
          });
        }
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
    // book two's guards (docs/take-aways.md, section 7): none for a chapter with no `module` and none of the four keys
    checkBookTwo(story, others, checkWhen).forEach(function (e) { errs.push(e); });
    // the take-aways kit's guards (docs/take-aways.md, section 3): none for a chapter with no take set
    E.checkTakes(story, stories).forEach(function (e) { errs.push(e); });
    // chapter 12's Spanish guards (the section "chapter 12: Spanish"): none for a chapter with no Spanish
    E.checkSpanish(story, stories).forEach(function (e) { errs.push(e); });
    return errs;
  };

  PC.engine = E;
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

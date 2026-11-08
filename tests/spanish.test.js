/* Chapter 12's one engine feature, Spanish (docs/chapters/12-a-spark-at-the-hedge.spec.md, section 6; decisions 53, 54 and 55):
 * node --test
 *
 * PC.words (app/story/words.js), the numbers (E.esNumber, E.esFact), the tokens filled in E.fill's one pass ({es:key} and
 * {Es:key} between the engine's marks), a whole Spanish line (E.esLine, its English made by E.esGloss), what a Spanish
 * word is in English (E.esEnglish), English speech respelled (E.sayAs), a line split for the voices (E.speechParts), the
 * echoes (E.countsEcho, E.takeEcho), the Spanish count (E.skipView, E.skipWords), the kit's school words (E.takeLine),
 * Count the store's friend (E.hollowShelf, E.takeRoundDef), the typed dream's marks, the guards (E.checkStory) and a Counts
 * prompt asked in Spanish (E.promptLines: the design the chapters after this one ask for); and the page in Node: rich()
 * and plain(), the Spanish voice (UI.voices.pick) and what Read to me says, row by row (UI.voices.plan), with a Spanish
 * voice and without, never aloud; the CSS block and the page's wiring pinned as text. Chapters 1 to 11, the Warrior Counts
 * and the kit's lines fill, letter, check and sound exactly as before. Fixtures are inline (never the stub chapter 12), but
 * for Count the store's real rounds, played on a cat who has finished the built chapter 12 (the final review). */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { load, ROOT } = require('./_load.js');
const PC = load();
require(path.join(ROOT, 'app/ui.js'));
const E = PC.engine, U = PC.ui, V = PC.ui.voices, L = PC.ui.letter;
const UI_SRC = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const clone = (o) => JSON.parse(JSON.stringify(o));
const WJ = '⁠';
const OLD = E.chapters(PC.story).filter((s) => s.number <= 11);

// every string a story holds (its scenes left out: the art's options), with where it is
function strings(o, at, out) {
  out = out || [];
  if (typeof o === 'string') out.push([at, o]);
  else if (o && typeof o === 'object') Object.keys(o).forEach((k) => { if (k !== 'scene') strings(o[k], at + '.' + k, out); });
  return out;
}
const OLD_LINES = [].concat(...OLD.map((s) => strings(s, s.id)), strings(PC.warrior, 'warrior'), strings(E.TAKE_LINES, 'TAKE_LINES'), strings(E.STORE_LINES, 'STORE_LINES')).map((x) => x[1]);
// the v23 E.fill, rich() and plain(), as they were before chapter 12 (the reference every old line is held to)
function oldFill(text, cat, extra) {
  if (text == null) return '';
  const t = E.tokens(cat);
  return String(text).replace(/\{([A-Za-z]+)\}/g, (m, k) => (extra && Object.prototype.hasOwnProperty.call(extra, k) ? String(extra[k]) : Object.prototype.hasOwnProperty.call(t, k) ? t[k] : m));
}
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function oldRich(s) {
  return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>').replace(/([A-Za-z0-9À-ɏ])—/g, '$1⁠—');
}
function oldPlain(s) { return U.takes.minus(String(s == null ? '' : s).replace(/\*+/g, '').replace(/×/g, ' times ')); }
function fnSrc(src, name) { const i = src.indexOf('  function ' + name + '('); assert.ok(i >= 0, name); return src.slice(i, src.indexOf('\n  }\n', i) + 4); }
// cats to fill with: a plain one, a tom, one named Chispa, one whose pet name is Chispa, one with a typed dream
const CATS = [
  Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', petname: 'Biscuit' }),
  Object.assign(E.blankCat({ now: 1 }), { name: 'Moss', petname: 'Mr Whiskers', look: Object.assign(E.defaultLook(1), { sex: 'tom' }) }),
  Object.assign(E.blankCat({ now: 1 }), { name: 'Chispa', petname: 'Sparky', ending: 'heart' }),
  Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', petname: 'Chispa' }),
  Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', petname: 'Biscuit', chapter: 'ch03', dreams: { ch03: 'to swim {es:12} times' } })
];

/* ------------------------------------------------------------------ the words and the numbers */

test('PC.words: the kit\'s fourteen English words (E.TAKE_WORDS unchanged), the Spanish words with their English, and sayAs; app/story/words.js is never taken for a chapter', () => {
  const W = PC.words;
  assert.deepEqual(E.TAKE_WORDS, { loose: 'loose', row: 'row', rows: 'rows', Row: 'Row', square: 'square', squares: 'squares', ones: 'ones', tens: 'tens', hundreds: 'hundreds',
    takeAway: 'take away', TakeAway: 'Take away', spread: 'spread', Spread: 'Spread', OnesFirst: 'Ones first' });
  assert.deepEqual(W.es, { gatos: { es: 'gatos', en: 'cats' }, por: { es: 'por', en: 'times' }, aContar: { es: '¡A contar!', en: 'Let’s count!' }, galleta: { es: 'Galleta', en: 'cookie', say: 'gah-YEH-tah' } });
  assert.deepEqual(W.sayAs, [['Chispapaw', 'Cheespa-paw'], ['Chispa', 'Cheespa']]);
  assert.deepEqual(E.esWords(), W.es);
  assert.ok(!E.chapters(PC.story).some((s) => s.id === 'words'));
  assert.ok(!fs.readdirSync(path.join(ROOT, 'docs/storyboard')).includes('words.md'));
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(html.indexOf('<script src="app/story/ch11.js">') < html.indexOf('<script src="app/story/words.js">'), 'its script tag after chapter 11');
});

test('E.esNumber: 0 to 1,000 by hand (Latin American, never "ciento y"), the digits outside it; E.esFact for every pair to 10 × 10', () => {
  const hand = { 0: 'cero', 1: 'uno', 11: 'once', 12: 'doce', 15: 'quince', 16: 'dieciséis', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 26: 'veintiséis', 31: 'treinta y uno',
    56: 'cincuenta y seis', 100: 'cien', 101: 'ciento uno', 110: 'ciento diez', 115: 'ciento quince', 121: 'ciento veintiuno', 133: 'ciento treinta y tres', 200: 'doscientos',
    343: 'trescientos cuarenta y tres', 500: 'quinientos', 700: 'setecientos', 900: 'novecientos', 999: 'novecientos noventa y nueve', 1000: 'mil' };
  Object.keys(hand).forEach((n) => assert.equal(E.esNumber(+n), hand[n], n));
  for (let n = 0; n <= 1000; n++) assert.ok(!/ciento y|^y |  /.test(E.esNumber(n)), n + ': ' + E.esNumber(n));
  assert.equal(new Set(Array.from({ length: 1001 }, (_, n) => E.esNumber(n))).size, 1001, 'every number its own words');
  assert.equal(E.esNumber(1001), '1001'); assert.equal(E.esNumber(-1), '-1'); assert.equal(E.esNumber(2.5), '2.5');
  assert.equal(E.esFact(7, 8), 'siete por ocho, cincuenta y seis');
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) assert.equal(E.esFact(a, b), E.esNumber(a) + ' por ' + E.esNumber(b) + ', ' + E.esNumber(a * b));
});

/* ------------------------------------------------------------------ the tokens, the lines, the English */

test('E.fill: {es:key} and {Es:key} between the marks (a number, fact, a, b, answer, a word), an unknown key as written; a ¡ or ¿ before it with its ! or ? after go inside; the capitals ("¡Ciento…", "Doce gatos.", "¡cincuenta!" in mid-line, "…once" kept small)', () => {
  const x = { a: 7, b: 8, answer: 56 };
  assert.equal(E.fill('{es:12} and {Es:12}'), '«doce» and «Doce»');
  assert.equal(E.fill('{Es:fact}', null, x), '«Siete por ocho, cincuenta y seis»');
  assert.equal(E.fill('{es:a} {es:b} {Es:answer}', null, x), '«siete» «ocho» «Cincuenta y seis»');
  assert.equal(E.fill('My Tall Ones call me {es:galleta}. It means cookie.'), 'My Tall Ones call me «Galleta». It means cookie.');
  assert.equal(E.fill('{es:nope} {es:fact} {es:answer} {Es:12x}'), '{es:nope} {es:fact} {es:answer} {Es:12x}', 'unknown, or a question\'s own with no question: as written');
  assert.equal(E.fill('¡{Es:500}! Five hundred.'), '«¡Quinientos!» Five hundred.', 'the ¡…! inside the marks, whole');
  assert.equal(E.fill('¿{Es:a} {es:por} {es:b}?', null, x), '¿«Siete» «por» «ocho»?', 'each token its own word: the ¿ and ? not round one token stay outside');
  assert.equal(E.fill('¡{Es:133}, ya!'), '¡«Ciento treinta y tres», ya!', 'no closing ! straight after: the ¡ stays outside');
  assert.equal(E.fill('¡{Es:133}!'), '«¡Ciento treinta y tres!»');
  assert.equal(E.fill('¡{Es:300}…'), '¡«Trescientos»…');
  assert.equal(E.fill('Diez, ¡{es:50}!'), 'Diez, «¡cincuenta!»', 'small in mid-line');
  assert.equal(E.fill('…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.'), '…' + WJ + '«once», «doce». «Doce» «gatos».');
  assert.equal(E.fill('{Es:aContar}'), '«¡A contar!»', 'a capital after a leading ¡');
  assert.equal(E.fill('Hi, {name}: {es:12}.', CATS[0]), 'Hi, Fern: «doce».', 'both kinds in one line');
  assert.equal(E.fill('{a} × {b} {es:a}', null, x), '7 × 8 «siete»');
});

test('E.fill fills in one pass: a typed dream "{es:12}" (or a «») inserted by {dream} stays as typed; every line of chapters 1 to 11, PC.warrior, E.TAKE_LINES and E.STORE_LINES fills exactly as before, for every cat', () => {
  const dreamer = Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', chapter: 'ch01', dreams: { ch01: 'run {es:12} laps {name}' } });
  assert.equal(E.fill('Her dream: {dream}', dreamer), 'Her dream: run {es:12} laps {name}');
  assert.equal(E.fill('{x}', null, { x: '{es:12}' }), '{es:12}', 'an extra\'s value is never scanned again');
  let n = 0;
  OLD_LINES.forEach((s) => {
    assert.ok(!/\{[Ee]s:|[«»]/.test(s), 'no Spanish token or mark in an old line: ' + s);
    CATS.forEach((c) => { assert.equal(E.fill(s, c), oldFill(s, c)); n++; });
    assert.equal(E.fill(s, CATS[0], { a: 7, b: 8, answer: 56, groups: 7, per: 8 }), oldFill(s, CATS[0], { a: 7, b: 8, answer: 56, groups: 7, per: 8 }));
  });
  assert.ok(n > 20000, n);
});

test('E.esGloss and E.esLine: the English of a Spanish line (numbers by E.numberWords, fact, a word\'s en, {Es:} capitalised, ¡ ¿ dropped); a whole line between the marks with its gloss on the next line', () => {
  const doce = '…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.';
  assert.equal(E.esGloss(doce), '…' + WJ + 'eleven, twelve. Twelve cats.');
  assert.equal(E.esLine(doce), '«…' + WJ + 'once, doce. Doce gatos.»\n(…' + WJ + 'eleven, twelve. Twelve cats.)');
  assert.equal(E.esGloss('¡{Es:fact}!', null, { a: 7, b: 8 }), 'Seven times eight, fifty-six!');
  assert.equal(E.esLine('¡{Es:fact}!', null, { a: 7, b: 8 }), '«¡Siete por ocho, cincuenta y seis!»\n(Seven times eight, fifty-six!)');
  assert.equal(E.esLine('¡{Es:answer}!', null, { a: 475, b: 132, answer: 343 }), '«¡Trescientos cuarenta y tres!»\n(Three hundred forty-three!)');
  assert.equal(E.esLine('¡{Es:133}!'), '«¡Ciento treinta y tres!»\n(One hundred thirty-three!)');
  assert.equal(E.esGloss('{es:aContar}'), 'Let’s count!');
  assert.equal(E.esLine('{es:aContar}'), '«¡A contar!»\n(Let’s count!)');
  assert.equal(E.esGloss('Diez, ¡{es:50}!'), 'Diez, fifty!', 'small in mid-line, the ¡ dropped');
  assert.equal(E.esLine('¿{Es:a} {es:por} {es:b}?', null, { a: 6, b: 9 }), '«¿Seis por nueve?»\n(Six times nine?)');
  assert.equal(E.esLine(null), '');
});

test('E.esEnglish: a word\'s say, else its en; a number\'s words (case as the Spanish, punctuation ignored); else nothing', () => {
  assert.equal(E.esEnglish('Galleta'), 'gah-YEH-tah');
  assert.equal(E.esEnglish('galleta'), 'gah-YEH-tah');
  assert.equal(E.esEnglish('gatos'), 'cats');
  assert.equal(E.esEnglish('¡A contar!'), 'Let’s count!');
  assert.equal(E.esEnglish('cincuenta'), 'fifty');
  assert.equal(E.esEnglish('¡Cincuenta!'), 'Fifty');
  assert.equal(E.esEnglish('¡Trescientos cuarenta y tres!'), 'Three hundred forty-three');
  assert.equal(E.esEnglish('…' + WJ + 'veinte,'), 'twenty');
  assert.equal(E.esEnglish('dieciséis'), 'sixteen');
  assert.equal(E.esEnglish('Diez, veinte…'), '', 'a phrase that is neither: nothing (with no Spanish voice it is not said)');
  assert.equal(E.esEnglish('hola'), '');
});

test('E.sayAs: whole words, the longer first ("Cheespa-paw’s", never "Cheespapaw"), "Chips-paw?" kept; the cat\'s own name, Clan name, warrior name and pet name never respelled; every line of chapters 1 to 11 said exactly as before, for a cat named Chispa and a cat whose pet name is Chispa', () => {
  assert.equal(E.sayAs('Chispapaw’s nose.'), 'Cheespa-paw’s nose.');
  assert.equal(E.sayAs('Chispa. It means spark.'), 'Cheespa. It means spark.');
  assert.equal(E.sayAs('Chips-paw? ANOTHER pillow cat?'), 'Chips-paw? ANOTHER pillow cat?');
  assert.equal(E.sayAs('Chispapaw and Chispa'), 'Cheespa-paw and Cheespa');
  assert.equal(E.sayAs('Chispas, Chispapaws'), 'Chispas, Chispapaws', 'whole words only');
  assert.equal(E.sayAs('Chispapaw and Chispa', CATS[2]), 'Chispapaw and Chispa', 'a cat named Chispa: as she always was');
  assert.equal(E.sayAs('Chispaheart!', CATS[2]), 'Chispaheart!');
  assert.equal(E.sayAs('Chispa, Chispapaw', CATS[3]), 'Chispa, Cheespa-paw', 'her pet name kept; the newcomer respelled');
  OLD_LINES.forEach((s) => CATS.forEach((c) => { const t = E.fill(s, c); assert.equal(E.sayAs(t, c), t); }));
  const keep = PC.words;
  try { delete PC.words; assert.equal(E.sayAs('Chispapaw'), 'Chispapaw', 'no table: as written'); } finally { PC.words = keep; }
});

test('E.speechParts: a whole line (its Spanish, then its gloss), a word in a line, a whispered line, the kit\'s stub echo, "«veinte»" alone (a word part), f027\'s "«Galleta».", f075\'s caption', () => {
  const doce = E.esLine('…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.');
  assert.deepEqual(E.speechParts(doce), [{ text: '…' + WJ + 'once, doce. Doce gatos.', lang: 'es', en: '', line: true }, { text: '…' + WJ + 'eleven, twelve. Twelve cats.', lang: 'en', gloss: true }]);
  assert.deepEqual(E.speechParts(E.esLine('¡{Es:answer}!', null, { answer: 343 }), 'es'),
    [{ text: '¡Trescientos cuarenta y tres!', lang: 'es', en: 'Three hundred forty-three', line: true }, { text: 'Three hundred forty-three!', lang: 'en', gloss: true }]);
  assert.deepEqual(E.speechParts(E.fill('My Tall Ones call me {es:galleta}. It means cookie.')),
    [{ text: 'My Tall Ones call me ', lang: 'en' }, { text: 'Galleta', lang: 'es', en: 'gah-YEH-tah' }, { text: '. It means cookie.', lang: 'en' }]);
  assert.deepEqual(E.speechParts(E.fill('Mice… {es:50} mice…')), [{ text: 'Mice… ', lang: 'en' }, { text: 'cincuenta', lang: 'es', en: 'fifty' }, { text: ' mice…', lang: 'en' }], 'a whispered word');
  assert.deepEqual(E.speechParts('¡Trece menos ocho son cinco! ¡Muy bien, amiga!', 'es'), [{ text: '¡Trece menos ocho son cinco! ¡Muy bien, amiga!', lang: 'es', en: '' }], 'the kit\'s stub echo');
  assert.deepEqual(E.speechParts('«veinte»'), [{ text: 'veinte', lang: 'es', en: 'twenty' }], 'a word part, not a line');
  assert.deepEqual(E.speechParts(E.fill('{es:galleta}.')), [{ text: 'Galleta', lang: 'es', en: 'gah-YEH-tah' }, { text: '.', lang: 'en' }]);
  assert.deepEqual(E.speechParts(E.fill('By {es:50}, the grey tom is snoring.')), [{ text: 'By ', lang: 'en' }, { text: 'cincuenta', lang: 'es', en: 'fifty' }, { text: ', the grey tom is snoring.', lang: 'en' }]);
  assert.deepEqual(E.speechParts('Chispapaw counts.'), [{ text: 'Cheespa-paw counts.', lang: 'en' }], 'any other line one English part, respelled');
  assert.deepEqual(E.speechParts('Chispapaw counts.', 'en', CATS[2]), [{ text: 'Chispapaw counts.', lang: 'en' }]);
  assert.deepEqual(E.speechParts('«a» then «b»\n(not a gloss) more'), [{ text: 'a', lang: 'es', en: '' }, { text: ' then ', lang: 'en' }, { text: 'b', lang: 'es', en: '' }, { text: '\n(not a gloss) more', lang: 'en' }], 'a gloss only at the very end');
});

/* ------------------------------------------------------------------ the echoes */

const WARM = { id: 'ch12-warm', teacher: 'tallyheart', warmHard: { table: 'all', at: [0, 1], alt: [{ a: 3, b: 8, table: 3 }, { a: 4, b: 7, table: 4 }, { a: 9, b: 6, table: 9 }] },
  facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }], praise: [], fast: [], done: '',
  echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }, { who: 'chispapaw', text: 'My little Tall One says these every night! I never knew what they MEANT.' }] } };
const T12 = (t) => ({ who: 'tallyheart', text: t });
const TAKE = { id: 'ch12-take', op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
  facts: [{ a: 254, b: 131, regroup: 'show', prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.', right: [T12('One square, two rows, three loose left.')] },
    { a: 58, b: 23, prompt: [T12('Now you try, all by yourself. Little take-aways first, then big.')] },
    { a: 76, b: 42, prompt: [{ who: 'chispapaw', kind: 'whisper', text: 'My little Tall One always sighs at homework.' }] }, [475, 132], [368, 145]],
  echo: { on: [[475, 132]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } };
const SIETE = '«¡Siete por ocho, cincuenta y seis!»\n(Seven times eight, fifty-six!)', MEANT = 'My little Tall One says these every night! I never knew what they MEANT.';
const TRES = '«¡Trescientos cuarenta y tres!»\n(Three hundred forty-three!)';

test('E.countsEcho: on her first right answer only (a retry and a filler count; never again after it, a lesson picked up included), the line it earned kept before it (the remembered line, a retry\'s, a fact\'s own balloons), the order asked; a list; null for every set of chapters 1 to 11', () => {
  const play = (facts, answers) => {
    const st = E.counts.start(WARM, { facts, set: WARM.id, now: 1 }), out = [];
    answers.forEach((v, i) => { const q = E.counts.question(st); const res = E.counts.answer(st, WARM, v === 'R' ? q.a * q.b : v, i ? 9000 : 1000, 1000 * (i + 1)); out.push(E.countsEcho(WARM, st, res, 'tallyheart')); });
    return { st, out };
  };
  // her hard pick first, right and quick: the remembered line, then the echo, in the order it was asked
  const hard = play([{ a: 7, b: 8, table: 8, hard: true }, { a: 3, b: 9, table: 3 }], ['R', 'R']);
  assert.deepEqual(hard.out[0], [{ who: 'tallyheart', text: 'Last time 7 × 8 made you stop and think. Not today!' }, { who: 'chispapaw', text: SIETE, lang: 'es' }, { who: 'chispapaw', text: MEANT }]);
  assert.equal(hard.out[1], null, 'once a lesson');
  // the order it was asked: 8 × 7 is "ocho por siete"
  assert.equal(play([[8, 7]], ['R']).out[0][0].text, '«¡Ocho por siete, cincuenta y seis!»\n(Eight times seven, fifty-six!)', 'no praise: the echo alone');
  // a miss first: no echo then; the retry, right, earns the again line and the echo
  const miss = play([[6, 7], [3, 9], [4, 8]], [41, 'R', 'R', 'R']);
  assert.equal(miss.out[0], null, 'a miss never echoes');
  assert.equal(miss.out[1][miss.out[1].length - 2].text, '«¡Tres por nueve, veintisiete!»\n(Three times nine, twenty-seven!)', 'the first right answer, whichever it is');
  assert.deepEqual(miss.out.slice(2), [null, null]);
  // a lesson picked up after its first right answer (the log kept in the slot): never again
  const st = clone(hard.st);
  st.queue.push({ a: 2, b: 2, retry: false });
  const q = E.counts.question(st), res = E.counts.answer(st, WARM, q.a * q.b, 1000, 9);
  assert.equal(E.countsEcho(WARM, st, res, 'tallyheart'), null);
  // a retry's own lines and a fact's own `right` balloons stay before it
  const own = Object.assign(clone(WARM), { facts: [{ a: 2, b: 5, right: [{ who: 'glintstar', text: 'Ten. Good.' }] }] });
  const s2 = E.counts.start(own, { set: own.id, now: 1 }), r2 = E.counts.answer(s2, own, 10, 3000, 1);
  assert.deepEqual(E.countsEcho(own, s2, r2, 'tallyheart').map((b) => b.text), ['Ten. Good.', '«¡Dos por cinco, diez!»\n(Two times five, ten!)', MEANT]);
  // a list: when the pair is one of it (either order), every time
  const list = Object.assign(clone(WARM), { echo: { on: [[7, 8]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] } });
  const s3 = E.counts.start(list, { facts: [[2, 3], [8, 7], [7, 8]], set: list.id, now: 1 });
  const got = [0, 1, 2].map((i) => { const qq = E.counts.question(s3); return E.countsEcho(list, s3, E.counts.answer(s3, list, qq.a * qq.b, 9000, i), 'tallyheart'); });
  assert.equal(got[0], null);
  assert.deepEqual(got[1], [{ who: 'chispapaw', text: '«¡Cincuenta y seis!»\n(Fifty-six!)', lang: 'es' }]);
  assert.deepEqual(got[2], got[1]);
  // every set of chapters 1 to 11 and the Warrior Counts: null
  OLD.forEach((s) => Object.keys(s.counts || {}).forEach((id) => assert.equal(E.countsEcho(s.counts[id], { log: [{ correct: true }] }, { correct: true, entry: { a: 2, b: 3 }, line: 'Yes!' }, 'tallyheart'), null, id)));
  assert.equal(E.countsEcho(WARM, { log: [] }, { correct: false, entry: { a: 7, b: 8 } }), null);
});

test('E.takeEcho: 475 − 132 right and helped, its twin never, a column never; `on: \'first\'` only for the first problem right in every column (a store round\'s one echo); one balloon', () => {
  const info = (a, b, correct) => ({ problem: true, a, b, answer: a - b, correct, helped: !correct });
  assert.deepEqual(E.takeEcho(TAKE, info(475, 132, true), { log: [] }), { who: 'chispapaw', text: TRES });
  assert.deepEqual(E.takeEcho(TAKE, info(475, 132, false), { log: [] }), { who: 'chispapaw', text: TRES }, 'helped: still echoed');
  assert.equal(E.takeEcho(TAKE, info(565, 411, true), { log: [] }), null, 'its twin (a different top) never');
  assert.equal(E.takeEcho(TAKE, info(254, 131, true), { log: [] }), null);
  assert.equal(E.takeEcho(TAKE, { col: 1, top: 7, bottom: 3, digit: 4, a: 475, b: 132 }, { log: [] }), null, 'a column never');
  assert.equal(E.takeEcho({ op: '-' }, info(475, 132, true), { log: [] }), null, 'no echo key: nothing');
  // played through the runner: the twin of a helped 475 − 132 is never echoed
  const st = E.takes.start(TAKE, { facts: [[475, 132]], now: 1 });
  E.takes.digit(st, TAKE, 0, 2000, 1000);            // a slip at the ones: helped
  E.takes.digit(st, TAKE, 4, 2000, 2000); const end = E.takes.digit(st, TAKE, 3, 2000, 3000);
  assert.equal(end.entry.helped, true);
  assert.deepEqual(E.takeEcho(TAKE, { problem: true, a: end.entry.a, b: end.entry.b, answer: end.entry.answer, correct: end.entry.correct, helped: end.entry.helped }, st), { who: 'chispapaw', text: TRES });
  const twin = E.takes.question(st);
  assert.ok(twin && twin.a !== 475, 'its twin comes back');
  assert.equal(E.takeEcho(TAKE, info(twin.a, twin.b, true), st), null);
  // the store round's: its first problem right in every column, once
  const def = E.takeRoundDef(), round = { log: [] };
  round.log.push({ a: 58, b: 23, correct: false });
  assert.equal(E.takeEcho(def, info(58, 23, false), round), null, 'helped: no echo on first');
  round.log.push({ a: 76, b: 42, correct: true });
  assert.deepEqual(E.takeEcho(def, info(76, 42, true), round), { who: 'chispapaw', text: '«¡Treinta y cuatro!»\n(Thirty-four!)' });
  round.log.push({ a: 368, b: 145, correct: true });
  assert.equal(E.takeEcho(def, info(368, 145, true), round), null, 'one echo a round');
});

// Count the store played as the page plays it (storeBtn: E.takeRoundStart and cat.lesson; runTakes: T.digit a column at a
// time, E.logTake, E.recordLesson at the end; problemEnd: E.takeEcho(E.takeRoundDef(), info, st)), real rounds in a row on
// a cat who has finished chapter 12 (its lesson and its store played through E.takeLesson, PC.story.ch12's own sets), so
// a change that carried a round's log into the next, or lost it on a reload, cannot pass on a hand-made log (the final
// review; its template, ~/potomac-crossing-work/ch12/gap-store-round/node-check.js)
test('Count the store, real rounds in a row: one echo a round, on the first problem right in every column; none on a helped one or after it; a twin right counts when every problem before it was helped; none again after the save is reloaded mid-round', () => {
  const T = E.takes, STORIES = E.chapters(PC.story);
  const cat = E.blankCat({ now: 1 });
  cat.name = 'Moon';
  STORIES.forEach((s, i) => { cat.finished[s.id] = 1000 + i; });
  E.countSets(STORIES).forEach((k) => { cat.lessons[k.setId] = { set: k.setId, mode: 'chapter', answers: 10, correct: 10, fast: 5, facts: 10, firstTry: 10, helped: 0, noHelp: true, finished: true }; });
  // the column's own digit, or (a slip) the next one; the ones-first pointer answered as the page does, the same digit again
  const type = (st, def, miss, t) => {
    const q = T.question(st), c = q.plan.cols[q.col];
    const d = c.blank ? '' : String(miss ? (c.digit + 1) % 10 : c.digit);
    let r = T.digit(st, def, d, 2000, t);
    if (r && r.pointer) r = T.digit(st, def, d, 2000, t + 500);
    return r;
  };
  ['ch12-take', 'ch12-store'].forEach((id) => {
    const L = E.takeLesson(cat, PC.story.ch12, id, 5000, STORIES);
    let t = 6000;
    while (!T.done(L.state)) {
      if (T.question(L.state).mode === 'tap') while (T.tap(L.state)) { /* the worked example's taps */ }
      const r = type(L.state, L.def, false, t += 1000);
      if (r && r.entry) E.logTake(cat, r.entry);
      if (r && r.done) E.recordLesson(cat, L.state);
    }
  });
  assert.ok(E.storeOpen(cat, STORIES), 'the store is open');
  let me = cat;
  // one round: help(q, i) says whether problem i gets a slip at its ones; trip, the problem after whose end the save goes
  // through JSON, E.migrate and E.hollowRound, and the round is picked up from the copy
  const round = (now, help, trip) => {
    const R0 = E.takeRoundStart(me, STORIES, now, {});
    me.lesson = { mode: 'hollow', state: R0.state };
    let st = R0.state, def = E.takeRoundDef(), t = now, i = 0;
    const out = [];
    while (!T.done(st)) {
      const q0 = T.question(st), miss = !!help(q0, i);
      let res;
      do {
        const q = T.question(st);
        res = type(st, def, miss && q.col === 0, t += 1500);
        if (res.entry) E.logTake(me, res.entry);
        if (res.done) E.recordLesson(me, st);
      } while (!res.problemDone);
      const e = res.entry, echo = E.takeEcho(def, { problem: true, a: e.a, b: e.b, answer: e.answer, correct: e.correct, helped: e.helped }, st);
      out.push({ a: e.a, b: e.b, correct: e.correct, twin: !!e.twin, echo });
      if (echo) assert.deepEqual(echo, { who: 'chispapaw', text: E.esLine('¡{Es:answer}!', null, { a: e.a, b: e.b, answer: e.a - e.b }) }, e.a + ' − ' + e.b);
      if (i === trip && !res.done) {
        const save = E.newSave(); save.cats = [me]; save.current = me.id;
        me = E.migrate(JSON.parse(JSON.stringify(save))).cats[0];
        const HL = E.hollowRound(me);
        assert.ok(HL && !T.done(HL.state), 'the round picked up after the reload');
        st = HL.state; def = E.takeRoundDef();
      }
      i++;
    }
    return out;
  };
  const echoed = (P) => P.map((p, i) => (p.echo ? i : -1)).filter((i) => i >= 0);
  const firstRight = (P) => P.findIndex((p) => p.correct);
  // the first problem helped, the rest right: the echo on the second, the first right in every column, and only there
  const r1 = round(100000, (q, i) => i === 0);
  assert.equal(r1[0].correct, false);
  assert.deepEqual(echoed(r1), [firstRight(r1)], 'round 1: ' + JSON.stringify(r1));
  assert.equal(firstRight(r1), 1);
  // every problem right, twice: an echo in each round, after one in the round before (no log carried over)
  [200000, 300000].forEach((now) => { const r = round(now, () => false); assert.deepEqual(echoed(r), [0], 'round at ' + now); });
  // her first three problems helped: the first right in every column is the first one's twin, and it is echoed (spec
  // section 6: a twin right counts when every problem before it was helped), once
  const r4 = round(400000, (q, i) => i <= 2 && !q.twin);
  assert.deepEqual(r4.slice(0, 3).map((p) => p.correct), [false, false, false]);
  assert.equal(r4[3].twin, true, 'the first one’s twin comes back fourth');
  assert.deepEqual(echoed(r4), [3], 'round 4: ' + JSON.stringify(r4));
  // the save reloaded right after the echo, and two problems after it: the round finishes with no second echo
  const r5 = round(500000, () => false, 0);
  assert.deepEqual(echoed(r5), [0], 'reloaded after the echo');
  const r6 = round(600000, (q, i) => i === 0, 1);
  assert.deepEqual(echoed(r6), [1], 'helped, the echo, then reloaded');
  const r7 = round(700000, () => false, 2);
  assert.deepEqual(echoed(r7), [0], 'reloaded two problems after the echo');
});

/* ------------------------------------------------------------------ the Spanish count */

test('the Spanish count (E.skipView with lang: \'es\'): taps 0 to 5, its say, gloss and wait; a one-group count "¡Diez!"; E.skipWords\' whisper: false and words: true; every existing skip\'s view and words unchanged', () => {
  const sk = { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, next: 'f075' };
  const counts = ['', '«Diez…»', '«Diez, veinte…»', '«Diez, veinte, treinta…»', '«Diez, veinte, treinta, cuarenta…»', '«Diez, veinte, treinta, cuarenta, ¡cincuenta!»\n(Ten, twenty, thirty, forty, fifty!)'];
  const says = ['', '«diez»', '«veinte»', '«treinta»', '«cuarenta»', '«cincuenta»'];
  counts.forEach((c, t) => {
    const v = E.skipView(sk, t);
    assert.equal(v.count, c, 'tap ' + t); assert.equal(v.say, says[t]); assert.equal(v.wait, true); assert.equal(v.lang, 'es');
    assert.equal(v.gloss, t === 5 ? 'Ten, twenty, thirty, forty, fifty!' : undefined);
    assert.equal(v.total, t * 10); assert.equal(v.paws, 'both'); assert.equal(v.done, t === 5);
  });
  assert.equal(E.skipView(Object.assign({}, sk, { groups: 1 }), 1).count, '«¡Diez!»\n(Ten!)');
  assert.equal(E.skipView(Object.assign({}, sk, { table: 2, groups: 3 }), 3).count, '«Dos, cuatro, ¡seis!»\n(Two, four, six!)');
  const w = E.skipWords(sk);
  assert.deepEqual([w.teacher, w.whisper, w.words, w.label], ['chispapaw', false, true, 'Tap your forepaws.']);
  assert.deepEqual(E.skipPicture(sk, 2), E.skipPicture(Object.assign({}, sk, { lang: undefined }), 2), 'the picture is chapter 4\'s bedtime tens');
  // every skip of chapters 1 to 11: none of the new keys, its words as before (no `words` but on the raft)
  let n = 0;
  OLD.forEach((s) => Object.keys(s.frames).forEach((id) => {
    const f = s.frames[id];
    if (!f.skip) return;
    const k = E.skipFor(f.skip, CATS[0]);
    for (let t = 0; t <= (k.groups || 5); t++) {
      const v = E.skipView(k, t);
      assert.ok(!('lang' in v) && !('wait' in v) && !('gloss' in v), s.id + ' ' + id);
      assert.ok(!/[«»]/.test(v.count + (v.say || '')));
      n++;
    }
    const sw = E.skipWords(k);
    assert.equal(!!sw.words, k.paws === 'board', s.id + ' ' + id);
    assert.equal(sw.whisper, k.paws === 'own' || k.paws === 'both');
  }));
  assert.ok(n > 40);
});

/* ------------------------------------------------------------------ the school words, the shelf, the round */

test('E.takeLine\'s school words on a \'show\' problem of a teach \'none\' set\'s tens, not on its twin, not on any other set; E.takeRoundDef\'s echo; E.hollowShelf\'s friend, absent while a sitting waits', () => {
  const line = (def, col, mode) => E.takeLine(def, E.takePlan(254, 131), col, null, mode, true);
  assert.equal(line(TAKE, 1, 'show'), 'A row is a ten. A square is a hundred. Now the tens. Five take away three.');
  assert.equal(line(TAKE, 0, 'show'), 'Ones first. Four take away one.');
  assert.equal(line(TAKE, 1, 'tap'), 'Now the tens. Five take away three.', 'its twin');
  assert.equal(line({}, 1, 'show'), 'Now the tens. Five take away three.', 'any other set');
  assert.deepEqual(E.takeRoundDef().echo, { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] });
  const story = { id: 'fx12', number: 12, module: 2, start: 'f001', frames: { f001: { end: true } }, counts: { t: { op: '-', teach: 'none', facts: [[58, 23]] } } };
  const cat = Object.assign(E.blankCat({ now: 1 }), { name: 'Fern' });
  cat.lessons.t = { set: 't', op: '-', finished: true };
  const SH = E.hollowShelf(cat, [story]);
  assert.deepEqual(SH.friend, { who: 'chispapaw', text: '«¡A contar!»\n(Let’s count!)' });
  assert.deepEqual(E.hollowShelf(cat, [story], { reward: true }).friend, SH.friend, 'after a round too');
  // a waiting Warrior Counts sitting (its line, as E.hollowLines reads it, stood in): the line in the greeting's place, no friend
  const keepHL = E.hollowLines;
  try {
    E.hollowLines = () => ({ waiting: E.WARRIOR_WAITING });
    const W = E.hollowShelf(Object.assign({}, cat, { warrior: { attempts: [] } }), [story], { now: 1 });
    assert.equal(W.line, E.WARRIOR_WAITING);
    assert.ok(!('friend' in W), 'the waiting line takes the room');
  } finally { E.hollowLines = keepHL; }
  assert.equal(E.hollowShelf(E.blankCat({ now: 1 }), [story]), null, 'the store closed: no shelf');
});

/* ------------------------------------------------------------------ the typed dream */

test('the typed dream: a « or » she typed is read as “ or ” (E.dreamOf, E.tidyDream; never stored so): a dream \'«hola» {es:12}\' gets no Spanish lettering and no Spanish speech in her book', () => {
  const cat = Object.assign(E.blankCat({ now: 1 }), { name: 'Fern', dreams: { ch01: '«hola» {es:12}' } });
  assert.equal(E.dreamOf(cat, 'ch01'), '“hola” {es:12}');
  assert.equal(cat.dreams.ch01, '«hola» {es:12}', 'what she typed is kept');
  assert.equal(E.tidyDream('«hola» {es:12}'), '“hola” {es:12}.');
  assert.equal(E.dreamOf({ dream: 'a «v1» dream' }), 'a “v1” dream', 'a version-1 cat too');
  const ch01 = E.chapter('ch01', PC.story), page = E.buildBook(ch01, cat);
  assert.ok(page.dream.includes('“hola” {es:12}.'), page.dream);
  assert.ok(!/[«»]/.test(page.dream));
  assert.ok(!L.rich(page.dream).includes('class="es"'), 'no Spanish italics');
  assert.deepEqual(E.speechParts(page.dream).map((p) => p.lang), ['en'], 'said in English');
  assert.equal(E.dreamOf(Object.assign(E.blankCat({ now: 1 }), { dreams: { ch01: 'plain' } }), 'ch01'), 'plain');
});

/* ------------------------------------------------------------------ a Counts prompt asked in Spanish (for the chapters after this one) */

test('a Counts prompt balloon with lang: \'es\' (chapter 21\'s ferry, the Spanish-asked warm-up picks, Tricky Counts): lettered by E.esLine with the question\'s own a and b, kept with its lang; a retry\'s too; every other prompt as before', () => {
  const ask = { who: 'chispapaw', lang: 'es', text: '¿{Es:a} {es:por} {es:b}?' };
  const def = { id: 'x', teacher: 'tallyheart', facts: [{ a: 6, b: 9, prompt: [ask], retryPrompt: true }] };
  const st = E.counts.start(def, { set: 'x', now: 1 }), q = E.counts.question(st);
  assert.deepEqual(E.promptLines(def, def, q), [{ who: 'chispapaw', text: '«¿Seis por nueve?»\n(Six times nine?)', kind: undefined, lang: 'es' }]);
  E.counts.answer(st, def, 50, 2000, 1);
  E.counts.answer(st, def, 54, 2000, 2);
  let rq; for (let i = 0; i < 4 && !(rq && rq.retry); i++) { rq = E.counts.question(st); if (!rq) break; if (!rq.retry) E.counts.answer(st, def, rq.a * rq.b, 2000, 3 + i); }
  if (rq && rq.retry) assert.deepEqual(E.promptLines(def, def, rq).map((l) => l.text), ['Here’s that one again.', '«¿Seis por nueve?»\n(Six times nine?)']);
  // a set's prompt given as balloons: any pair it asks
  const set = { id: 'y', teacher: 'tallyheart', prompt: [ask], facts: [[7, 8]] };
  const s2 = E.counts.start(set, { set: 'y', now: 1 });
  assert.equal(E.promptLines(set, set, E.counts.question(s2))[0].text, '«¿Siete por ocho?»\n(Seven times eight?)');
  // every prompt of chapters 1 to 11: no lang key appears
  OLD.forEach((s) => Object.keys(s.counts || {}).forEach((id) => {
    const d = Object.assign({ id }, s.counts[id]);
    if (d.op === '-') return;
    (d.facts || []).forEach((f) => {
      const fq = Object.assign({ number: 1, retry: false }, Array.isArray(f) ? { a: f[0], b: f[1] } : f);
      if (!(fq.a >= 0)) return;
      E.promptLines(d, d, fq).forEach((l) => assert.ok(!('lang' in l), s.id + ' ' + id));
    });
  }));
  // Read to me: the Spanish, then its English; with no Spanish voice, the English alone
  const item = Object.assign({}, E.promptLines(def, def, q)[0]);
  assert.deepEqual(V.plan([item], [PAULINA, SAMANTHA]).map((r) => [r.lang, r.text]), [['es', '¿Seis por nueve?'], ['en', 'Six times nine?']]);
  assert.deepEqual(V.plan([item], [SAMANTHA]).map((r) => [r.lang, r.text]), [['en', 'Six times nine?']]);
  assert.ok(UI_SRC.includes("        if (l.lang) x.lang = l.lang;   // (chapter 12's design: a Spanish ask keeps its lang)"), 'the page\'s promptLines keeps it');
});

/* ------------------------------------------------------------------ the guards */

function fx(extra) {
  return Object.assign({ id: 'fx12', number: 12, title: 'Fixture', module: 2, start: 'f001', frames: { f001: { board: 'B', next: 'f002' }, f002: { board: 'B', end: true } }, counts: {}, cards: {} }, extra);
}
function errsOf(story) { return E.checkSpanish(story).concat(E.checkStory(story, OLD).filter((e) => /Spanish|lang|«|echo|\{es:|\{Es:|PC\.words/.test(e))); }
test('E.checkStory\'s Spanish guards: lang only where it may stand, a Spanish line of tokens and punctuation (at most eight words, no cat token), every token resolved where it stands, no « », a skip\'s lang, a set\'s echo; the later chapters\' (a sentence opened in lower case, "veintiuno gatos"); none for chapters 1 to 11 or the Warrior Counts; none for the spec\'s own lines', () => {
  OLD.forEach((s) => assert.deepEqual(E.checkSpanish(s, OLD), [], s.id));
  assert.deepEqual(E.checkSpanish(PC.warrior), []);
  OLD.forEach((s) => assert.ok(!E.checkStory(s, OLD).some((e) => /Spanish|lang|«/.test(e)), s.id));
  // the spec's own lines, sets and skip: clean
  const good = fx({ frames: {
    f001: { board: 'B', caption: ['By {es:50}, the grey tom is snoring.', 'Mice… {es:50} mice…'], say: [{ who: 'chispapaw', kind: 'whisper', lang: 'es', text: '…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.' }, { who: 'chispapaw', text: 'My Tall Ones call me {es:galleta}. It means cookie.' }, { who: 'chispapaw', text: '{es:galleta}.' }], next: 'f002' },
    f002: { board: 'B', say: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:133}!' }, { who: 'chispapaw', lang: 'es', text: '{es:aContar}' }], next: 'f003' },
    f003: { board: 'B', counts: { set: 'ch12-warm', intro: false, next: 'f004' } },
    f004: { board: 'B', counts: { set: 'ch12-take', intro: false, next: 'f005' } },
    f005: { board: 'B', skip: { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es', carry: false, prompt: '**Tap** your forepaws.', next: 'f006' } },
    f006: { board: 'B', end: true } }, counts: { 'ch12-warm': clone(WARM), 'ch12-take': clone(TAKE) } });
  delete good.counts['ch12-warm'].id; delete good.counts['ch12-take'].id;
  assert.deepEqual(errsOf(good), []);
  const bad = (frames, counts) => E.checkSpanish(fx({ frames: Object.assign({ f001: { board: 'B', next: 'f002' }, f002: { board: 'B', end: true } }, frames), counts: counts || {} }));
  const one = (frames, counts, re) => { const e = bad(frames, counts); assert.ok(e.some((x) => re.test(x)), re + ' in ' + JSON.stringify(e)); };
  // lang where it may not stand
  one({ f001: { board: 'B', caption: [{ text: '{es:12}', lang: 'es' }], next: 'f002' } }, null, /caption 0: lang/);
  one({ f001: { board: 'B', choice: { options: [{ label: '{es:12}', lang: 'es', next: 'f002' }] } } }, null, /option 0: lang/);
  one({ f001: { board: 'B', say: [{ who: 'x', lang: 'fr', text: '{es:12}' }], next: 'f002' } }, null, /say 0: lang is 'es'/);
  one({}, { t: { op: '-', facts: [{ a: 58, b: 23, prompt: [{ who: 'chispapaw', lang: 'es', text: '{es:12}' }] }] } }, /fact 0 prompt 0: lang/);
  one({}, { c: { facts: [{ a: 2, b: 3, right: [{ who: 'chispapaw', lang: 'es', text: '{es:12}' }] }] } }, /fact 0 right 0: lang/);
  // a Spanish line: tokens and punctuation, at most eight words, no cat token
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '¡Hola!' }], next: 'f002' } }, null, /written in \{es:…\} tokens/);
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '{es:12} gatos' }], next: 'f002' } }, null, /tokens and punctuation only/);
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '{es:777} {es:777} {es:12}' }], next: 'f002' } }, null, /at most 8 words \(9/);
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '{Es:12}, {name}!' }], next: 'f002' } }, null, /only \{es:…\} tokens/);
  // every token resolved where it stands
  one({ f001: { board: 'B', say: [{ who: 'c', text: '{es:hola}' }], next: 'f002' } }, null, /\{es:hola\} names nothing/);
  one({ f001: { board: 'B', caption: ['{es:1001} cats'], next: 'f002' } }, null, /\{es:1001\} names nothing/);
  one({ f001: { board: 'B', say: [{ who: 'c', text: 'It is {es:answer}.' }], next: 'f002' } }, null, /\{es:answer\} names nothing/);
  one({}, { t: { op: '-', facts: [[475, 132]], echo: { on: [[475, 132]], lines: [{ who: 'c', lang: 'es', text: '¡{Es:fact}!' }] } } }, /\{Es:fact\} names nothing/);
  one({}, { c: { facts: [{ a: 6, b: 9, prompt: [{ who: 'c', lang: 'es', text: '¿{Es:answer}?' }] }] } }, /\{Es:answer\} names nothing/);
  one({}, { c: { facts: [{ a: 6, b: 9, prompt: 'Six {es:a}?' }] } }, /\{es:a\} names nothing/);
  assert.deepEqual(bad({}, { c: { facts: [{ a: 6, b: 9, prompt: [{ who: 'chispapaw', lang: 'es', text: '¿{Es:a} {es:por} {es:b}?' }], retryPrompt: true }] } }), [], 'a Counts prompt asked in Spanish');
  assert.deepEqual(bad({}, { c: { prompt: [{ who: 'chispapaw', lang: 'es', text: '¿{Es:a} {es:por} {es:b}?' }], facts: [[6, 9]] } }), [], 'a set\'s prompt as balloons');
  // no « »; the words table's keys
  one({ f001: { board: 'B', say: [{ who: 'c', text: 'My name is «Galleta».' }], next: 'f002' } }, null, /engine’s marks/);
  one({}, { c: { facts: [{ a: 2, b: 3, miss: 'Not «dos».' }] } }, /engine’s marks/);
  const keep = PC.words;
  try {
    PC.words = Object.assign({}, keep, { es: Object.assign({}, keep.es, { 12: { es: 'doce', en: 'twelve' }, answer: { es: 'x', en: 'y' }, half: { es: 'medio' } }) });
    const e = E.checkSpanish(fx());
    ['PC.words.es: 12', 'PC.words.es: answer', 'PC.words.es: half'].forEach((k) => assert.ok(e.some((x) => x.startsWith(k)), k));
  } finally { PC.words = keep; }
  // a skip's lang; a set's echo
  one({ f001: { board: 'B', skip: { table: 10, groups: 5, lang: 'fr', next: 'f002' } } }, null, /skip lang is 'es'/);
  one({ f001: { board: 'B', skip: { table: 300, groups: 4, lang: 'es', next: 'f002' } } }, null, /no higher than 1,000/);
  one({}, { c: { facts: [[2, 3]], echo: { on: 'first', lines: [] } } }, /one to three on a Counts set/);
  one({}, { c: { facts: [[2, 3]], echo: { on: 'first', lines: [1, 2, 3, 4].map(() => ({ who: 'c', text: 'Hi.' })) } } }, /one to three/);
  one({}, { t: { op: '-', facts: [[475, 132]], echo: { on: [[475, 132]], lines: [{ who: 'c', text: 'a' }, { who: 'c', text: 'b' }] } } }, /exactly one on a take set/);
  one({}, { t: { op: '-', facts: [[475, 132]], echo: { on: [[132, 475]], lines: [{ who: 'c', text: 'a' }] } } }, /echo on is 'first' or a list of the set’s own facts/);
  one({}, { c: { facts: [[2, 3]], echo: { on: [[4, 5]], lines: [{ who: 'c', text: 'a' }] } } }, /echo on/);
  one({}, { c: { facts: [[2, 3]], echo: { on: 'every', lines: [{ who: 'c', text: 'a' }] } } }, /echo on/);
  one({}, { c: { facts: [[2, 3]], echo: { on: 'first', lines: [{ who: 'c', text: 'a', voice: 'x' }] } } }, /echo line 0 is \{ who, text, lang\?, kind\? \}/);
  one({}, { c: { facts: [[2, 3]], echo: { on: 'first', lines: [{ who: 'c', text: 'a' }], again: true } } }, /echo is \{ on, lines \}/);
  assert.deepEqual(bad({}, { c: { facts: [[3, 2]], echo: { on: [[2, 3]], lines: [{ who: 'c', text: 'Yes, {es:answer}!' }] } } }), [], 'a Counts pair either way; an English echo line may name the answer');
  // the chapters after this one: a sentence opened in lower case; a number in uno before a word
  one({ f001: { board: 'B', say: [{ who: 'c', text: '{es:50} mice.' }], next: 'f002' } }, null, /opens a sentence in lower case/);
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '¡{es:133}!' }], next: 'f002' } }, null, /opens a sentence in lower case: \{Es:133\}/);
  one({ f001: { board: 'B', say: [{ who: 'c', text: 'Yes. {es:12} cats.' }], next: 'f002' } }, null, /lower case/);
  one({ f001: { board: 'B', say: [{ who: 'c', lang: 'es', text: '{Es:21} {es:gatos}.' }], next: 'f002' } }, null, /veintiún gatos/);
  assert.deepEqual(bad({ f001: { board: 'B', say: [{ who: 'c', text: 'Mice… {es:50} mice… Diez, {es:20}.' }, { who: 'c', lang: 'es', text: '{Es:21}.' }, { who: 'c', lang: 'es', text: '{Es:12} {es:gatos}.' }], next: 'f002' } }), [], 'after "…", mid-sentence, a number in uno with no word after it');
});

/* ------------------------------------------------------------------ the page in Node: the lettering */

test('rich(): «…» in italics with lang="es" (the marks dropped), the gloss on the line after it upright, in a span of its own; every line of chapters 1 to 11, PC.warrior and the kit\'s lettered exactly as before, for every cat; plain() drops the marks', () => {
  assert.equal(L.rich('«…' + WJ + 'once, doce. Doce gatos.»\n(…' + WJ + 'eleven, twelve. Twelve cats.)'), '<i class="es" lang="es">…' + WJ + 'once, doce. Doce gatos.</i><br><span class="gloss">(…' + WJ + 'eleven, twelve. Twelve cats.)</span>');
  assert.equal(L.rich('My Tall Ones call me «Galleta». It means cookie.'), 'My Tall Ones call me <i class="es" lang="es">Galleta</i>. It means cookie.');
  assert.equal(L.rich('«Diez, veinte…»'), '<i class="es" lang="es">Diez, veinte…</i>');
  assert.equal(L.rich(E.skipView({ table: 10, groups: 5, lang: 'es' }, 5).count), '<i class="es" lang="es">Diez, veinte, treinta, cuarenta, ¡cincuenta!</i><br><span class="gloss">(Ten, twenty, thirty, forty, fifty!)</span>');
  assert.equal(L.rich('Mice… «cincuenta» mice… **big**'), 'Mice… <i class="es" lang="es">cincuenta</i> mice… <strong>big</strong>');
  assert.equal(L.rich('A <b> & «x»'), 'A &lt;b&gt; &amp; <i class="es" lang="es">x</i>');
  assert.equal(L.plain('My Tall Ones call me «Galleta». 7 × 8 *now*'), 'My Tall Ones call me Galleta. 7  times  8 now');
  let n = 0;
  OLD_LINES.forEach((s) => CATS.forEach((c) => { const t = E.fill(s, c); assert.equal(L.rich(t), oldRich(t)); assert.equal(L.plain(t), oldPlain(t)); n++; }));
  assert.ok(n > 20000);
  assert.ok(UI_SRC.includes("      var b = { who: s.who || '', text: s.lang === 'es' ? E.esLine(s.text || '', cat) : fill(s.text || ''), kind: s.kind || 'say', name: s.name, nth: s.nth, variant: member && member.variant, raw: s };"), 'balloonsOf: a whole Spanish line through E.esLine');
});

test('the CSS block "chapter 12: Spanish", before the take-aways block, pinned as text: the Spanish italic, the gloss upright, a whispered balloon with Spanish upright; no Aa rule in it', () => {
  const at = HTML.indexOf('/* ---------- chapter 12: Spanish ('), take = HTML.indexOf('/* ---------- the take-aways kit: the take page');
  assert.ok(at > 0 && take > at);
  const block = HTML.slice(at, take);
  assert.ok(block.endsWith('*/\n.es{font-style:italic}\n.gloss{font-style:normal}\n.sb.whisper:has(.es),.ov .btext.whisper:has(.es){font-style:normal}\n'), block.slice(-200));
  assert.ok(!/html\.big|@media/.test(block.replace(/\/\*[\s\S]*?\*\//g, '')), 'no Aa rule');
  assert.ok(HTML.includes('.counter.words{font-family:var(--comic);'), 'a Spanish count\'s counter is Comic Neue');
});

/* ------------------------------------------------------------------ the page in Node: the voices */

const NOVELTY = ['Eddy (Spanish (Mexico))', 'Flo (Spanish (Mexico))', 'Grandma (Spanish (Mexico))', 'Grandpa (Spanish (Spain))', 'Reed (Spanish (Mexico))', 'Rocko (Spanish (Mexico))', 'Sandy (Spanish (Spain))', 'Shelley (Spanish (Mexico))']
  .map((name, i) => ({ name, lang: i % 3 ? 'es-MX' : 'es-ES' }));
const PAULINA = { name: 'Paulina', lang: 'es-MX' }, SAMANTHA = { name: 'Samantha', lang: 'en-US' };
test('UI.voices.pick: es-US Google first, then Paulina; an es_MX voice and a decomposed "Mónica" found; never Eddy … Shelley (a real voice whose name only begins so kept); other Latin American before es-ES; null with none; English as before', () => {
  const GOOGLE = { name: 'Google español de Estados Unidos', lang: 'es-US' }, JUAN = { name: 'Juan', lang: 'es_MX' }, MONICA = { name: 'Mónica', lang: 'es-MX' };
  const MONICA_ES = { name: 'Mónica', lang: 'es-ES' }, LATAM = { name: 'Diego', lang: 'es-419' }, AR = { name: 'Florencia', lang: 'es-AR' }, REEDY = { name: 'Reedy', lang: 'es-MX' };
  assert.equal(V.pick(NOVELTY.concat([JUAN, PAULINA, GOOGLE, SAMANTHA]), 'es'), GOOGLE, 'es-US first');
  assert.equal(V.pick(NOVELTY.concat([JUAN, PAULINA, SAMANTHA]), 'es'), PAULINA, 'then a she-voice of es-MX by name, before a he-voice');
  assert.equal(V.pick(NOVELTY.concat([JUAN, SAMANTHA]), 'es'), JUAN, 'an es_MX voice, its lang normalised');
  assert.equal(V.pick([JUAN, MONICA], 'es'), MONICA, 'a decomposed name, NFC first');
  assert.equal(V.pick([MONICA_ES, LATAM], 'es'), LATAM, 'es-ES last');
  assert.equal(V.pick([MONICA_ES, AR], 'es'), AR, 'a real voice whose name begins "Flo" is kept');
  assert.equal(V.pick(NOVELTY.concat([REEDY]), 'es'), REEDY);
  assert.equal(V.pick([MONICA_ES].concat(NOVELTY), 'es'), MONICA_ES);
  assert.equal(V.pick(NOVELTY.concat([SAMANTHA]), 'es'), null, 'novelty voices only: none');
  assert.equal(V.pick([], 'es'), null); assert.equal(V.pick(null, 'es'), null);
  NOVELTY.forEach((v) => assert.equal(V.pick([v], 'es'), null, v.name));
  // English: pickVoice's rule, as before
  const KAREN = { name: 'Karen', lang: 'en-AU' }, DANIEL = { name: 'Daniel', lang: 'en-GB' }, US = { name: 'Fred', lang: 'en-US' };
  assert.equal(V.pick([DANIEL, KAREN, SAMANTHA]), SAMANTHA); assert.equal(V.pick([DANIEL, KAREN], 'en'), KAREN);
  assert.equal(V.pick([DANIEL, US]), US); assert.equal(V.pick([DANIEL, PAULINA]), DANIEL); assert.equal(V.pick([PAULINA]), null);
  assert.ok(UI_SRC.includes("speechSynthesis.onvoiceschanged = function () { voice = null; voiceEs = null; };"), 'onvoiceschanged clears both');
});

test('UI.voices.plan on three lists (an es-MX Paulina; novelty-only Spanish; none at all): a whole line, a word in a line, f027, f075 and the paw thing\'s taps: each part\'s voice, lang, rate and pitch; the gloss after the Spanish; a line not said with no voice; a name\'s respelling; no row of punctuation alone; never Spanish in an English voice; every other item as before', () => {
  const lists = { paulina: NOVELTY.concat([{ name: 'Juan', lang: 'es-MX' }, PAULINA, SAMANTHA]), novelty: NOVELTY.concat([SAMANTHA]), none: [] };
  const plan = (items, list) => V.plan(items, lists[list]).map((r) => [r.lang, r.text, r.voice, r.rate, r.pitch]);
  const C = (text) => ({ text, who: 'chispapaw' });
  const doce = C(E.esLine('…' + WJ + '{es:11}, {es:12}. {Es:12} {es:gatos}.'));
  assert.deepEqual(plan([doce], 'paulina'), [['es', '…' + WJ + 'once, doce. Doce gatos.', 'Paulina', 0.918, 1.42], ['en', '…' + WJ + 'eleven, twelve. Twelve cats.', 'Samantha', 1.02, 1.42]]);
  assert.deepEqual(plan([doce], 'novelty'), [['en', '…' + WJ + 'eleven, twelve. Twelve cats.', 'Samantha', 1.02, 1.42]], 'no Spanish voice: the gloss alone');
  assert.deepEqual(plan([doce], 'none'), [['en', '…' + WJ + 'eleven, twelve. Twelve cats.', null, 1.02, 1.42]]);
  const f018 = C(E.fill('My Tall Ones call me {es:galleta}. It means cookie.'));
  assert.deepEqual(plan([f018], 'paulina').map((r) => r.slice(0, 3)), [['en', 'My Tall Ones call me', 'Samantha'], ['es', 'Galleta', 'Paulina'], ['en', '. It means cookie.', 'Samantha']]);
  // (with no Spanish voice a line's English parts in a row are one utterance, its punctuation closed up: three in one voice
  // paused between them, the third starting at a full stop; chapter 12's review)
  assert.deepEqual(plan([f018], 'novelty').map((r) => r.slice(0, 2)), [['en', 'My Tall Ones call me gah-YEH-tah. It means cookie.']], 'a name: its respelling');
  const f027 = C(E.fill('{es:galleta}.'));
  assert.deepEqual(plan([f027], 'paulina').map((r) => r.slice(0, 2)), [['es', 'Galleta']], 'no utterance of "." alone');
  assert.deepEqual(plan([f027], 'none').map((r) => r.slice(0, 2)), [['en', 'gah-YEH-tah']]);
  const f075 = { text: E.fill('By {es:50}, the grey tom is snoring.') };
  assert.deepEqual(plan([f075], 'paulina'), [['en', 'By', 'Samantha', 0.95, 1], ['es', 'cincuenta', 'Paulina', 0.855, 1], ['en', ', the grey tom is snoring.', 'Samantha', 0.95, 1]], 'a caption: the narrator\'s pitch and rate');
  assert.deepEqual(plan([f075], 'novelty').map((r) => r[1]), ['By fifty, the grey tom is snoring.']);
  assert.deepEqual(plan([f075], 'none'), [['en', 'By fifty, the grey tom is snoring.', null, 0.95, 1]], 'one row, the narrator\'s');
  // two speakers' items are never joined, nor an English row to a Spanish one
  assert.deepEqual(V.plan([f075, C(E.fill('{es:galleta}.'))], lists.none).map((r) => r.text), ['By fifty, the grey tom is snoring.', 'gah-YEH-tah']);
  // the paw thing: each tap's number, and at the last its gloss after it, or the gloss alone
  const sk = { table: 10, groups: 5, paws: 'both', teacher: 'chispapaw', lang: 'es' };
  const tapItem = (t) => { const v = E.skipView(sk, t); return C(v.gloss ? v.say + '\n(' + v.gloss + ')' : v.say); };
  assert.deepEqual([1, 2, 3, 4, 5].map((t) => plan([tapItem(t)], 'paulina').map((r) => r[0] + ' ' + r[1])),
    [['es diez'], ['es veinte'], ['es treinta'], ['es cuarenta'], ['es cincuenta', 'en Ten, twenty, thirty, forty, fifty!']]);
  assert.deepEqual([1, 2, 3, 4, 5].map((t) => plan([tapItem(t)], 'novelty').map((r) => r[0] + ' ' + r[1])),
    [['en ten'], ['en twenty'], ['en thirty'], ['en forty'], ['en Ten, twenty, thirty, forty, fifty!']], 'with no Spanish voice: "ten", "twenty" … and the gloss in place of "fifty"');
  // the kit's stub echo (lang es, no marks): the Spanish voice, or nothing
  assert.deepEqual(plan([{ text: '¡Trece menos ocho son cinco!', who: 'chispapaw', lang: 'es' }], 'paulina').map((r) => r[0]), ['es']);
  assert.deepEqual(plan([{ text: '¡Trece menos ocho son cinco!', who: 'chispapaw', lang: 'es' }], 'none'), []);
  // English respelled; a cat named Chispa as she was
  assert.deepEqual(V.plan([{ text: 'Chispapaw, come here!', who: 'tallyheart' }], lists.none).map((r) => r.text), ['Cheespa-paw, come here!']);
  assert.deepEqual(V.plan([{ text: 'Chispapaw, come here!', who: 'tallyheart' }], lists.none, { cat: CATS[2] }).map((r) => r.text), ['Chispapaw, come here!']);
  // never Spanish in an English voice; no row of punctuation alone; every es row in the Spanish voice
  const spanish = new Set();
  const all = [doce, f018, f027, f075, tapItem(3), tapItem(5), C(E.esLine('¡{Es:answer}!', null, { answer: 343 })), C(E.esLine('{es:aContar}'))];
  all.forEach((it) => E.speechParts(it.text).filter((p) => p.lang === 'es').forEach((p) => spanish.add(p.text)));
  Object.keys(lists).forEach((k) => V.plan(all, lists[k]).forEach((r) => {
    assert.ok(/[\p{L}\p{N}]/u.test(r.text), k + ': ' + JSON.stringify(r.text));
    if (r.lang === 'en') assert.ok(!spanish.has(r.text), k + ': Spanish in an English voice: ' + r.text);
    else assert.equal(r.voice, 'Paulina', k);
  }));
  // every other item exactly as before: its words cleaned (plain), the speaker's rate and pitch, the English voice, punctuation kept
  const old = [{ text: 'Seven spiders. How many legs?', who: 'tallyheart' }, { text: '…', who: 'riffle' }, { text: '<b>7 × 8</b>', who: 'glintstar' }, { text: '', who: 'x' }];
  assert.deepEqual(V.plan(old, [SAMANTHA]), [
    { text: 'Seven spiders. How many legs?', lang: 'en', voice: 'Samantha', rate: 0.95, pitch: 0.92 },
    { text: '…', lang: 'en', voice: 'Samantha', rate: 0.95, pitch: 1.5 },
    { text: '7  times  8', lang: 'en', voice: 'Samantha', rate: 0.95, pitch: 0.85 }]);
  OLD_LINES.slice(0, 4000).forEach((s) => { const t = E.fill(s, CATS[0]), r = V.plan([{ text: t }], [SAMANTHA]); assert.deepEqual(r.map((x) => x.text), oldPlain(t.replace(/<[^>]+>/g, ' ')).trim() ? [oldPlain(t.replace(/<[^>]+>/g, ' ')).trim()] : []); });
  assert.deepEqual([U.speakers.pitch('chispapaw'), U.speakers.rate('chispapaw'), U.speakers.NAMES.chispapaw], [1.42, 1.02, 'Chispapaw']);
});

/* ------------------------------------------------------------------ the page's wiring, pinned as text */

test('the page\'s wiring as designed: speakItems keeps its line and hands UI.voices.plan\'s rows over; PC.debug.speech keeps its shape and prints the parts with "[es] "; runLesson\'s echo statement; problemEnd\'s echo line; renderSkip\'s four branches; renderShelf\'s friend; the corner\'s voice line; PC.debug.spanish', () => {
  const sp = fnSrc(UI_SRC, 'speakItems');
  assert.ok(sp.includes("          var txt = plain(String(it.text || '').replace(/<[^>]+>/g, ' ')).trim();\n          if (!txt) return;\n          said = { text: E.sayAs(txt, cat), who: it.who, variant: it.variant };"), 'the pinned line, then E.sayAs');
  assert.ok(sp.includes('        voicePlan([said], vs, { cat: cat }).forEach(function (r) {'));
  assert.ok(sp.includes("          var v = r.lang === 'es' ? vs.es : vs.en; if (v) u.voice = v;"));
  assert.ok(sp.includes('      if (last && onDone) last.onend = function () { onDone(); };'), 'onDone on the last row said');
  assert.ok(fnSrc(UI_SRC, 'pickVoice').includes("      try { voiceEs = voicePick(speechSynthesis.getVoices() || [], 'es'); } catch (e) { voiceEs = null; }"));
  const hook = /\n      speech: function \(\) \{ return ([^\n]*) \},\n/.exec(UI_SRC);
  assert.ok(hook && hook[1].startsWith('(currentSpeech || []).map(') && hook[1].includes('saysSpanish(it) ? speechRows(it)'));
  assert.ok(fnSrc(UI_SRC, 'speechRows').includes("return (r.lang === 'es' ? '[es] ' : '') + r.text;"));
  assert.ok(fnSrc(UI_SRC, 'runLesson').includes("      var echoed = res.correct ? E.countsEcho(def, st, res, teacher) : null; if (echoed) res.balloons = echoed;"));
  const sk = fnSrc(UI_SRC, 'renderSkip');
  assert.ok(sk.includes("        if (sk.lang === 'es') counter.html = '<span class=\"counter words\">' + rich(v.count) + '</span>';"), '(1) the lettering');
  assert.ok(sk.includes('      var showNext = v.done && (!!sk.done || !!v.wait);') && sk.includes("      if (v.done && (sk.done || v.wait)) {\n        var nb = $('nextBtn');") &&
    sk.includes("        if (nb && v.wait) { var nbb = nb.getBoundingClientRect().bottom, nvh = root.innerHeight || 0; if (nvh && nbb > nvh) root.scrollBy(0, nbb - nvh + 8); }\n        if (nb) nb.focus({ preventScroll: true });"), '(2) Next and its focus (the Spanish wait brings Next in, chapter 12\'s review: a phone held sideways left it under the screen)');
  assert.ok(sk.includes("      speakItems([{ text: sk.lang === 'es' && v.gloss ? v.say + '\\n(' + v.gloss + ')' : v.say || String(v.total), who: teacher }]"), '(3) the speech');
  assert.ok(sk.includes('        if (E.skipView(sk, taps).done) { if (sk.done || E.skipView(sk, taps).wait) advance(); } else tap();'), '(4) the key handler');
  const sh = fnSrc(UI_SRC, 'renderShelf');
  assert.ok(sh.includes("      say: [{ who: 'tallyheart', text: SH.line }].concat(SH.friend ? [SH.friend] : [])"));
  assert.ok(sh.includes("    if (SH.friend) f.scene.cast.push({ who: 'chispapaw', pose: 'sit', mood: 'happy', at: 'sand-right', facing: 'left' });"));
  const line = fnSrc(UI_SRC, 'esVoiceLine');
  assert.ok(line.includes("'Chispapaw’s Spanish is read by this iPad’s Spanish voice: ' + esc(v.name) + ' (' + esc(v.lang) + ').'") && !line.includes('E.fill'), 'built by concatenation');
  assert.ok(line.includes('No Spanish voice on this iPad, so Read to me says her Spanish in English. To add one: Settings › Accessibility › Spoken Content › Voices › Spanish.'));
  assert.ok(fnSrc(UI_SRC, 'openGrownups').includes("    if (ch12 && cats.some(function (c) { return E.isOpen(c, ch12, stories()); })) html += esVoiceLine();"));
  assert.ok(UI_SRC.includes("      spanish: function (what) { return spanishDebug(what); },\n"));
  assert.ok(UI_SRC.includes("  var ES_DEBUG = { echo: 1, take: 1, skip: 1, worked: 1, 'worked:tens': 1, 'try': 1, 'try:pointer': 1, store: 1 };"));
  const dbg = fnSrc(UI_SRC, 'spanishDebug');
  assert.ok(dbg.includes('var ch = PC.story && PC.story.ch12;') && !dbg.includes('persist();\n    var t'), 'the chapter\'s own sets when there; nothing saved (a Counts page\'s answer put back)');
  // the echo page and the Spanish count keep the scroll the page made after the answer or the last tap, from a question page
  // at the top (chapter 12's review: what a phone held sideways shows, its Next brought in); every other screen as before
  assert.ok(dbg.includes("var t = now(), done = function (own) { renderedAt = now(); renderedPerf = perfNow(); updateBar(); if (!own) root.scrollTo(0, 0); return true; };"));
  assert.equal((dbg.match(/done\(true\)/g) || []).length, 2, 'the echo and the count only');
  assert.equal((dbg.match(/      root\.scrollTo\(0, 0\);\n/g) || []).length, 2, 'each from the top');
  // its inline sets are section 2's, and pass the guards
  const sets = new Function('return ' + /var ES_DEBUG_SETS = (\{[\s\S]*?\n {2}\});/.exec(UI_SRC)[1].replace(/esT\(([^)]*)\)/g, "{ who: 'tallyheart', text: $1 }"))();
  assert.deepEqual(sets['ch12-warm'].echo, WARM.echo); assert.deepEqual(sets['ch12-take'].echo, TAKE.echo);
  assert.deepEqual(sets['ch12-take'].facts, TAKE.facts);
  assert.deepEqual(E.checkSpanish(fx({ counts: sets })), []);
  assert.deepEqual(E.checkTakes(fx({ counts: sets }), OLD), []);
});

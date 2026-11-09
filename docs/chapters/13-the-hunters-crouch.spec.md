# Chapter 13 spec: The Hunter's Crouch

*v0.3 · 2026-11-09 (decision 57: the kit v0.4's moves and marks page; `ch13-take` gains `marks`; the run notes redone on
the design, `~/potomac-crossing-work/regroup/design.md` and `plan.md`)*

*v0.2 · 2026-11-07 (the spec editor: the spec critics' findings, counts, continuity, kit and Spanish, and decision 55;
what changed and why in `~/potomac-crossing-work/ch13/spec-editor/notes.md`)*

*The build's contract for chapter 13, beside `docs/build.md`, the take-aways kit's design (`docs/take-aways.md` v0.4,
decision 57) and chapter 12's spec (`12-a-spark-at-the-hedge.spec.md` v0.2, whose Spanish feature, Chispapaw and book
two this chapter uses as built). The story, [`13-the-hunters-crouch.md`](13-the-hunters-crouch.md) (Draft v0.4, final
but for decision 55's one line, its v0.5, and decision 57's marks page and notes, its v0.6), is the source of every word
she reads. This spec adds no line she reads except the instruction lines under a panel (each Tap's `prompt` is the
story's own **Tap** line; a `label` is the hidden button's words), the dream's placeholder, the book page (recap, the
badger page's four lines, the groundhog's sleeper page), the teaser's title, the Counts sets' engine lines (the
groundhog's help and filler lines, borrowed from chapter 9's sleeper), the three words-table entries, **decision 55's
«¡Desagrupo!»** (Chispapaw's whisper on f035: the story's one v0.5 line, queued in
`~/potomac-crossing-work/ch13/after-spec.md`; this spec carries it whether or not v0.5 has landed when the build starts)
and the grown-ups corner's words for the two flags. Where the story's italic notes and this spec differ, the spec is the
build's (section 7, item 2). Names in `code` are fixed: the art, the storyboard words and the story builder use exactly
these.*

*Decisions 53, 54 and 55 bind it: 53 (Aron's: multiplication kept fresh, long subtraction with two-digit regrouping as
its warm-up, a Spanish-speaking friend, the words easy to change) is why the chapter has a Counts warm-up, the take-aways
lesson's first spreads, «la resta» and "¡No alcanza!"; 54 (her own apprentice) is why the chapter's one real choice,
`teach`, is a mentor's; 55 (her word for a spread is *desagrupo*, "breaking it into groups", so the kit's method stands
and "me llevo una" is not hers) is why Chispapaw whispers «¡Desagrupo!» as the row spreads (the README's call on it) and
why nothing waits on Aron before the build. Every other call is Claude's under decision 46 (section 9), each Aron's to
reverse.*

*Run, not guessed. The Counts sets of section 2 were run against the take-aways tree (`~/potomac-crossing-ta`, branch
`take-aways`, 08f477a, read-only) with stub chapters 12 and 13 held in memory: `E.checkTakes` and `E.checkStory` clean
(and clean with 486 − 253 cut); every kind and step as section 2's table; the lesson played through `E.takes` (the worked
example's `'show'` steps and right line, 70 − 34's `'tap'`, a helped 43 − 16 queuing a `'tap'` twin with no prompt and no
right line, every slip named below). Script and output: `~/potomac-crossing-work/ch13/spec-writer/` (`probe.js`,
`sets13.js`, `probe.txt`); detail in its `notes.md`. Since then, on the same tree: **the take sets on the integrator's
working copy as of 2026-11-07**, with rules (a) and (b) and the twins' `avoid` in it (critic-spec-counts' `take13.txt`,
critic-kit-r1's `probe-now.txt` and `probe2.txt`); **the three story Counts exactly as section 2 writes them**
(critic-spec-counts' `story13.txt`, and the spec editor's `story13b.txt` with dawn's `ground: 'earth'` and both one-fact
sets' `miss: 'There.'`: `E.checkStory` clean, dawn's help scratched in the earth); **the warm-up's picks with this
`avoid`** over all 2,916 one-pick and two-pick cases on the 54 pairs (the spec editor's `warm13b.txt`): no pair twice,
never 3 × 4 or 6 × 8, every question with a numeric `table` (the alt 7 × 4 used 110 times, 9 × 9 twice; 7 × 8 asked in the
107 cases where it is a pick), and the same with the third Count cut. Under
`~/potomac-crossing-work/ch13/critic-spec-counts/`, `critic-kit-r1/` and `spec-editor/`.*

*The tree it is built on* (the orchestrator's): **main, after the take-aways kit and book two are merged and chapter 12 is
built**. Chapter 13 codes against the kit as its integrator merges it, with the three changes the integrator is making
(a: a round or set never says a line about a step she has not learned, so the hundreds' `extra` line "no square went" is
not said before `tens` is learned: `E.takeSlip`'s fifth argument `taught`, a lesson's being the steps of this chapter and
earlier ones, a round's `E.takeSteps`; b: only `'hers'` problems count toward a set's first two full-line problems; c: a
lesson's twins avoid every take answer of the chapter, `avoid: chapterAnswers(story)`), and against chapter 12's spec for
Spanish (`PC.words`, `{es:key}` and `{Es:key}`, `lang: 'es'` balloons, a set's `echo`) and the school words
(`E.takeLine` for a `'show'` problem of a `teach: 'ones2'` set), Chispapaw (`chispapaw`, `collar: false`, `holds:
'mouse'` for cats), the hollow's `HOL_YOU`, `module: 2` and book two's `book.store`, `book.sleeper`, `book.badger`.
Section 6 names the three checks the build makes on that tree before it starts.

**In one line: data and art only. Two flags (`teach`, `foundGroundhog`); six Counts sets (three story Counts, the warm-up,
the lesson, the pile); three words-table lines; the groundhog (the one new cast member, the first of the seven sleepers); the
camp's first frost; the grove's dig by the old oak with the marks beside it (one option on `oak`, one new composition with
two cameras); the hollow's spread in the sand; Chispapaw's collar in the den. No engine feature, no new interaction, no
card, no new place.**

---

## 1. Flags

**Two new**, as the brief planned.

| Flag | Values | Set where | Sticky or replaced | Read by |
|---|---|---|---|---|
| `teach` | `'show'`, `'try'`, `'words'` | f018, the crouch's **Choose** (each option's `sets`) | **replaced**: Back to f018, or picking again on a reread, replaces it, as `ch10Best` is | chapter 13: f019 (Chispapaw's reply: one caption and one balloon each by `when`) and f078 (her bedtime crouch: one caption and one balloon each by `when`); the grown-ups corner; **chapter 21** (Chispapaw's "You showed me. Just like that." / "You let me try. So I tried." / "Feeds the whole Clan, right?") |
| `foundGroundhog` | `true` | f064, the groundhog's last screen (`sets: { foundGroundhog: true }` on the frame, never on an option) | **sticky**: never unset | the book's recap line and its sleeper page (`book.sleeper`'s `when`); the grown-ups corner; chapter 20 (module-2's Rules: the first sleeper she missed is offered once more there) |

- Every other choice sets nothing (`sets: {}`): f003 (waking), f016 (Chispapaw's "Is it tomorrow NOW?"), f051 (the polite
  ask: its two options go to their own frames, f052a and f052b, which meet at f053), f058 ("Look closer." /
  "Home before sunset."). Saying no to the groundhog sets nothing; the plain path loses nothing.
- **Read here, from earlier chapters**: `specialty` (f010: the swimmer's caption; f058: one caption each for all five,
  none for a cat without one), `ch2Stone` (f076: one caption each, none before chapter 2's choice). `{name}{ending}`,
  `{Murmur}chime`, `{their}` (the book) as tokens. No `ch10Best`, `ch11Named` or `{petname}` line.
- **The grown-ups corner** (`FLAG_WORDS`, `app/ui.js`): `teach: { show: 'taught Chispapaw the hunter’s crouch by showing
  her (chapter 21 remembers)', try: 'let Chispapaw try the hunter’s crouch first, and watched (chapter 21 remembers)',
  words: 'taught Chispapaw the hunter’s crouch with Tallyheart’s own words (chapter 21 remembers)' }`; `foundGroundhog: {
  'true': 'found the groundhog asleep beside the big dig in GroveClan’s woods (later chapters remember)' }`.

## 2. Counts sets

**Eleven typed answers on the plain path** (five Counts, six take-aways), **twelve with the groundhog**. Every key below
is one the engine has (chapters 2 to 11), the kit has, or chapter 12 adds (`echo`, `{Es:…}`); none is new.

### Every fact, in the order she meets it

| # | Where | Fact | How | Picture |
|---|---|---|---|---|
| 1 | Dawn, leaving camp (f007) | 3 × 4 = 12 | typed (`ch13-dawn`) | the 4s' own: three cats side-on, four paws each |
| 2, 3 | The Hollow, the warm-up (f029) | her two hardest of the 54 pairs (`E.warriorHard`), passing over 3 × 4 and 6 × 8; with none, 9 × 7 and 4 × 6; with one, it and 4 × 6 (7 × 4 when her one pick is 4 × 6) | typed (`ch13-warm`) | each in its anchor Count's picture, on the sand (`E.questionDef`) |
| 4 | the same | 8 × 8, or the first `alt` not already asked (7 × 4, then 9 × 9) when a pick is 8 × 8 | typed | its anchor's |
| 5 | The Hollow, worked (f036) | 43 − 16 = 27 | take, `'show'` (`ch13-take`) | the kit's store picture |
| 6 | the same | 70 − 34 = 36 | take, `'tap'` | the same |
| 7 to 9 | the same | 85 − 39 = 46, 97 − 52 = 45, 486 − 253 = 233 | take, `'hers'` | the same |
| 10 | Noon at camp (f038) | 6 × 8 = 48 | typed (`ch13-noon`) | six piles of eight pieces of prey (`picture: { kind: 'prey' }`) |
| 11 | Noon at camp (f039) | 52 − 27 = 25 | take (`ch13-pile`, `twins: false`) | the kit's store picture |
| (12) | The groundhog, optional (f063) | 7 × 8 = 56 | typed (`ch13-lullaby`) | seven twigs of eight acorns (`picture: { kind: 'acorns' }`, chapter 9's sleeper's) |

Kinds and steps (run): 43 − 16, 70 − 34 (`noLoose`), 85 − 39 and 52 − 27 are `ones`, step `ones2`; 97 − 52 and
486 − 253 are `none`. Three of the new step, two older, one with no spread; every written answer different (27, 36, 46,
45, 233, 25; the Counts' 12, 48, 56 and the warm-up's are the times tables' own). No take-away is called a Count.

### `ch13-dawn`, the dawn patrol's prints (Counts frame f007, `intro: false`)

```js
var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';                 // chapter 10's
var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';  // chapter 10's
// (MISS only for the lullaby, which has fillers; a one-fact set's fact comes straight back, so its miss is 'There.')
'ch13-dawn': {
  table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}',
  ground: 'earth',
  facts: [{ a: 3, b: 4,
    prompt: [T('Let’s count something. Three cats, four paws each. How many paws?')], retryPrompt: true,
    right: [T('Twelve paws.'), { who: 'murmurchime', text: 'And not ONE of them warm.' }], rightAgain: true }],
  praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
}
```

- The frame letters the caption ("Behind you, three cats’ pawprints march across the white. Tallyheart looks back at
  them."); the Count's page opens on Tallyheart's prompt (the story's line, her habit, chapter 12's "Let's count
  something."). Right: her "Twelve paws." and {Murmur}chime's "And not ONE of them warm.", waiting for Next, on a retry too
  (`rightAgain`). A miss: the 4s' help scratched in the earth (`ground: 'earth'`, as the camp's Counts of chapters 3 to 6:
  without it the help is sand, in the frosty camp), then "There." and the fact again at once, "Here’s that one again." (a
  one-fact set with no `fillFrom` has no fillers, so nothing comes back later: chapter 11's pile, `miss: 'There.'`, is the
  precedent), up to three asks, the last miss "There. Now you’ve seen it counted." (run: `story13b.txt`). `done: null`: the
  frame after answers.

### `ch13-warm`, the Counts warm-up (Counts frame f029, `intro: false`)

```js
'ch13-warm': {
  teacher: 'tallyheart',
  // the kit's cross-table warm-up: her hardest at 0, her next at 1, passing over 3 × 4 (dawn) and 6 × 8 (noon), never
  // over the optional lullaby's 7 × 8 (call 4); each alt with its E.warriorAnchor table, as chapter 12's (an alt with no
  // table is asked in this set's own words)
  warmHard: { table: 'all', at: [0, 1], avoid: [[3, 4], [6, 8]],
    alt: [{ a: 7, b: 4, table: 4 }, { a: 9, b: 9, table: 9 }] },
  facts: [{ a: 9, b: 7, table: 9 }, { a: 4, b: 6, table: 6 }, { a: 8, b: 8, table: 8 }],
  praise: [], fast: [], done: '',
  // chapter 12's Spanish: her first right answer of the lesson, a retry's counted; the fact alone, nothing after it
  echo: { on: 'first', lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:fact}!' }] }
}
```

- **The set's own three** are the brief's (`check.txt`): no pair of chapter 12's own, this chapter's story Counts or
  chapter 14's; no answer the chapter has elsewhere. **`avoid`** keeps her hard picks off 3 × 4 and 6 × 8: 3 × 4 is asked
  at dawn, an hour before (a miss there is already retried until right or shown), 6 × 8 an hour on, on every path. So a cat
  whose hardest is 6 × 8 meets her next hardest instead (run). **7 × 8 is not passed over**: the lullaby is optional, so a
  plain-path cat whose hardest fact is 7 × 8 would meet it nowhere today, and the README's difficulty call counts on
  module 2 to keep her missed facts fresh; a cat who reads the groundhog meets it twice, hours apart, as spaced practice
  (call 4). **`alt`** (7 × 4 = 28, as 4 × 7 chapter 12's second alt, asked there only in a few pick cases, harmless;
  9 × 9 = 81; no answer of this chapter) stands in when a pick is the same pair as the set's 8 × 8, or her one pick is
  4 × 6 (run: one pick 4 × 6 asks 4 × 6, 7 × 4, 8 × 8; 7 × 6 then 8 × 8 asks 7 × 6, 8 × 8, 7 × 4). 2,916 cases, none bad
  (`warm13b.txt`).
- **The cuts** (the kit's order, `docs/take-aways.md` section 3 rule 4, and the brief's): first 486 − 253 (`ch13-take`,
  below). The second, the warm-up's third Count, is **not a cut this chapter can make without a story edit** (call 28):
  f029 letters "First, three Counts, to wake up your whiskers.", so it needs f029's "three" changed to "two" (a story
  version) and the story test's warm-up count changed. It runs clean (`facts: [{ a: 9, b: 7, table: 9 }, { a: 4, b: 6,
  table: 6 }]`, the `alt` unchanged: 2,916 cases, none bad, `warm13b.txt`).
- **The words** (chapter 12's, run there): the frame letters Tallyheart's "First, three Counts, to wake up your whiskers."
  and "Let's count!"; each question in its anchor Count's words and picture (9 × 7 in the 9s' lives: the Hollow is on land),
  on the sand. Right: nothing (`praise: []`, `fast: []`), but a hard pick's `remembered` line, a slow
  one's `rememberedSlow`, a retry's `again`.
- **The echo** (chapter 12's `E.countsEcho`): on her first right answer of the lesson, the line it earned (if any), then
  Chispapaw's balloon, out loud (the Hollow), "«¡Nueve por siete, sesenta y tres!»" with "(Nine times seven,
  sixty-three!)" under it for 9 × 7 asked as 9 × 7 (the order it was asked: "¡Siete por nueve…" for 7 × 9), and nothing
  after it (the brief: "I never knew what they MEANT." is not repeated). Once a lesson.
- `done: ''`: f030 answers.

### `ch13-take`, the lesson (Counts frame f036, `intro: false`)

```js
function T(text) { return { who: 'tallyheart', text: text }; }
function C(text) { return { who: 'chispapaw', text: text }; }
'ch13-take': {
  op: '-', teach: 'ones2', teacher: 'tallyheart', picture: { kind: 'store' }, done: '',
  facts: [
    { a: 43, b: 16, regroup: 'show',
      prompt: 'Pretend the pile holds forty-three, and the Clan eats sixteen.',   // ten words (the kit allows twelve)
      right: [T('Two rows, seven loose left.')] },
    { a: 70, b: 34, regroup: 'tap', prompt: 'Your turn.' },
    [85, 39], [97, 52], [486, 253]
    // if play drags: [486, 253] is cut, the chapter's only maths cut without a story edit (call 28; E.checkTakes still
    // clean, run)
  ],
  echo: { on: [[85, 39]], lines: [{ who: 'chispapaw', lang: 'es', text: '¡{Es:answer}!' }] },
  // the kit's marks page (decision 57): once, before 43 − 16's prompt, while she has no marks; her style, never a flag
  marks: {
    lines: [C('My little Tall One writes it like THIS.'), C('A little 1 in front!'),
            T('Some write the new number on top instead.'), T('Both are right. Which marks do YOU like?')],
    one: [C('Just like my little Tall One!')],
    above: [T('On top it is. That’s how I write it too!')]
  }
  // + lines: LINES13 only if the merged kit lacks rule (a) (section 6, check 1): below, "The extra slip"
}
var LINES13 = { extra: { tens: 'Careful. The {loose} had enough, so no {row} went. {Top} {rows} still.',
                         hundreds: 'Let’s scratch it out.' } };
```

- **The marks page** (the kit v0.4's `E.takeMarksPage`; shown once, before 43 − 16's prompt, because she has no marks
  yet: `cat.takes.style` absent; every player meets it here, as no spread is asked before `ones2`): two picture buttons,
  43 − 16 done in each style (27 in its boxes, the receiver's mark haloed); four balloons, one at a time, each picture
  glowing with its lines: Chispapaw's "My little Tall One writes it like THIS." and "A little 1 in front!" (the left
  picture, a little 1), Tallyheart's "Some write the new number on top instead." (the right, 13 over the struck 3) and
  "Both are right. Which marks do YOU like?" (both glow; the buttons go live). A tap sets `cat.takes.style` (`'one'` or
  `'above'`), never a flag, and letters Chispapaw's "Just like my little Tall One!" or Tallyheart's "On top it is.
  That’s how I write it too!" (each as warm as the other: the page asks which marks she really uses); she can switch
  while it shows; the answer line's reading time, or a tap on the stack or the panel, goes on to the prompt.
  Read to me says the lines, then the labels "A little 1 in front" and "The new number on top".
- **The worked example, 43 − 16** (`'show'`; run on the kit): the prompt's balloon and the first column's line are one
  balloon (both Tallyheart's): "Pretend the pile holds forty-three, and the Clan eats sixteen. Ones first." Then
  Tallyheart works the spread **and she types its numbers** (decision 57): "Three take away six? Only three loose. Not
  enough." / "So I spread a row. Four rows, one goes: three." (a paw-tap on the 4, the 4 struck, a row slides out of the
  rows; the box over the 4 ringed: she types 3) / "Ten more loose: thirteen. Write it on top." (the ten opens beside the
  three loose; the box over the struck 3 ringed: she types 13; in `'one'`, "Ten more loose: write a little 1 in front.",
  the box in front of the 3: she types 1) / "Thirteen take away six." She types 7. A wrong number here is lettered for
  her, no slip (the worked example). The tens: **the kit's school words before its line**, chapter 12's `E.takeLine`
  change for a `'show'` problem of a `teach: 'ones2'` set: "A row is a ten. A square is a hundred. Now the tens. Three
  take away one." She types 2 (her own gold 3 is the top). Right in every column: "Two rows, seven loose left."
  (Tallyheart), waiting for Next. Helped: the kit's "And you finished it. We'll do one like it soon."; **its twin is
  `'tap'`**, every number asked (the row's link is this chapter's) (the kit's rule: a `'show'` problem's twin; run:
  65 − 47 with the tap step), introduced "One like it.", **no prompt and no right line**.
- **70 − 34** (`'tap'`): "Your turn. Ones first. Zero take away four." (the prompt joined), "No loose. Spread a row: tap
  it." (the kit v0.4's `tap.onesZero`: section 7, item 16, closed; the 7 and the rows zone glow, the keypad dim; a tap
  off them: "The rows: the glowing ones."); she taps: the row slides out, "One row goes. How many rows now?" (she types
  6); the ten opens, "No loose, and ten more. How many loose now?" (she types 10; in `'one'`, "No loose, and ten more:
  write a little 1 in front.", 1); then "Ten take away four." and "Now the tens. Six take away three." Its twin, if
  helped, `'hers'`, asked with "One like it." only.
- **85 − 39, 97 − 52, 486 − 253** (`'hers'`). With moves: each spread is hers, the tap, the two new numbers, then the
  answer, and nothing glows (85 − 39: she taps the 8, types 7, types 15 or 1, then 6). A right digit typed before the
  moves is the kit's `ahead`: kept pale, "Right! Now show me your marks.", the 8 glows; never right first time. With the
  integrator's rule (b), 85 − 39 and 97 − 52 are the set's first two `'hers'` problems, so their lines are full: "Ones
  first. Five take away nine." (seeing she can't is the lesson) and "Now the tens. Take away three."; "Ones first. Seven
  take away two." and "Now the tens. Take away five."; 486 − 253 says the columns' names alone ("Ones first." "Now the
  tens." "Now the hundreds."). (Run both ways: under the kit's present rule 85 − 39 heard only "Ones first." / "Now the
  tens.": the maths critic's round-3 finding, now the integrator's.)
- **No line says which problems need a spread** ("Do we need to spread?" is chapter 17's). A spread taken where none is
  needed is the kit's `extra` slip, caught twice over: **at the tap**, a tap on 97 − 52's 9 (or 486 − 253's 8) strikes
  it and opens its box, and typing its new number is `extra`, "Careful: seven take away two? The loose have enough. No
  row goes." (the strike undone; logged `{ col: 0, move: 'touch', slip: 'extra' }`, with a twin; a second tap on the
  struck 9 before typing undoes it, a nudge); and **in her head**, 97 − 52's tens typed 3 (9 − 1 − 5) still gets
  "Careful. The loose had enough, so no row went. Nine rows still.", the lesson's point (run).
- **The `extra` slip at the hundreds.** 486 − 253's hundreds typed 1 (4 − 1 − 2) got, on the kit at 08f477a, "Careful.
  The rows had enough, so no square went. Four squares still." (run): spreading a square is chapter 15's. **The
  integrator's rule (a) makes the kit say no line about a step she has not learned**: as merged it is `E.takeSlip`'s
  fifth argument `taught` (the lesson's: the steps of this chapter and earlier ones, which lack `tens`), so the slip itself
  becomes `fact` and the help opens "Let’s scratch it out." (run on the integrator's working copy: `take13.txt`). With it
  the set has no `lines`. **If the merged kit lacks (a)** (section 6's first check), the set carries `lines: LINES13`: both
  forms, because a set's `lines.extra` replaces the whole key and `takeForm` falls back to the first form given (the maths
  critic's `probe2.js`: with only `hundreds`, 97 − 52's tens help would also say "Let's scratch it out."). **The slip is
  logged `fact` under the merged rule (a)**, which fixes the grown-ups corner's label of chapter 12's item 16; it is logged
  `extra` only if the LINES13 fallback is used. The story test pins `fact` in the take log.
- **The ones-first pointer is off** (`teach: 'ones2'` and more than five take-aways logged since chapter 12): her
  left-to-right habit is a chapter 12 matter, spent.
- **The echo** (chapter 12's `E.takeEcho`, read at the problem's end, never the kit's `o.echo` hook): after 85 − 39,
  **right or helped**, never its twin (a twin never has 85 at its top), Chispapaw's balloon, out loud, "«¡Cuarenta y
  seis!»" with "(Forty-six!)" under it, after the kit's end line. No column is ever echoed, and never «menos».
- **Never** "borrow", "carry" or "regroup"; no spreading a square, no three-digit spread: the kit's lines and the set's
  facts keep all three (486 − 253 needs no spread).
- `done: ''`: f037 carries the story's two *Done* balloons. Finishing this set adds `ones2` to `E.takeSteps`: Count the
  store's rounds take it from then on, their help speaking of spreading (the kit; the brief's "Count the store needs
  nothing new"), and Chispapaw's echo and greeting on them are chapter 12's.

### `ch13-noon`, the morning's hunt (Counts frame f038, `intro: false`)

```js
function G(text) { return { who: 'glintstar', text: text }; }
'ch13-noon': {
  table: 8, thing: 'piece', things: 'pieces', unit: 'hunter', units: 'hunters', teacher: 'tallyheart', ask: '{a} × {b}',
  picture: { kind: 'prey' }, help: 'picture',
  facts: [{ a: 6, b: 8, prompt: [G('Six hunters went out this morning. Eight pieces each.')], retryPrompt: true,
    right: [G('Forty-eight.')], rightAgain: true }],
  praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: 'There.', missLast: LAST, done: null
}
```

- Six piles of eight pieces (`preyPicture` without `rows`: stacks, never rows: a row means ten, module-2's amendment 1);
  a miss lights them a pile at a time in Tallyheart's hops, then "There." and the fact again at once (a one-fact set, as
  dawn's: run, `story13b.txt`). Glintstar's prompt is the story's line on the fountain; her
  right line "Forty-eight." on a retry too (`rightAgain`, editor-r1's "harmless if the spec adds it"). **The fifty-two is
  never this set's line**: it is a frame balloon on f039, so a retried or helped 6 × 8 still hears where it comes from (the
  maths critic's round-1 finding, the story's call 11).

### `ch13-pile`, the noon pile (Counts frame f039, `intro: false`)

```js
'ch13-pile': {
  op: '-', teacher: 'tallyheart', picture: { kind: 'store' }, twins: false, done: '',
  facts: [{ a: 52, b: 27,
    prompt: [G('Twenty-seven go down to the store. How many stay for the Clan?')],   // twelve words: the kit's most
    right: [G('Twenty-five for the Clan.')] }]
}
```

- No `teach`: a story set whose problem's step (`ones2`) this chapter's lesson teaches (the kit's guard; run clean).
  `teach: 'none'` cannot be used for the pointer here, as chapter 12's store did, since the problem spreads.
- The frame (f039) letters Glintstar's "With the dawn patrol’s four, that’s fifty-two on the pile." and "Let's count!";
  the take page opens on her question (her prompt), then Tallyheart's column line in her own balloon: "Ones first. Two take
  away seven." (the set's first problem: full lines), then "Now the tens. Take away two." Right: Glintstar's line, waiting
  for Next. Helped: "And you finished it." (no twin: `twins: false`, as chapter 12's store).
- **The flip lands** at its ones (7 − 2 = 5, the right digit). Under decision 57 the spread is hers to make: a 5 typed
  before any move is the kit's `ahead` in its flip form, "Marks first, then the answer." (no "Right!": it may be a
  flip), her 5 kept pale and the 5 of the tens glowing; she taps it, types 4 and 12 (or 1), and OKs her 5. The problem
  is not `correct` but has no slip, so it ends on Glintstar's "Twenty-five for the Clan." (run). A 2 typed first is a
  `fact` slip ("Two take away seven: we spread a row, then take seven."): its help takes Glintstar's right line (section
  7, item 9). After her own gold 4, a 3 at the tens is `kept`, "Careful. One row went to the loose. Four rows now."
- The page shows the kit's store picture at 52 (five rows, two loose): the only picture of the pile's number in the
  chapter (section 4, "No pile drawn").

### `ch13-lullaby`, the groundhog's lullaby (Counts frame f063, `intro: false`; optional)

```js
'ch13-lullaby': {
  table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'groundhog', ask: '{a} × {b}',
  picture: { kind: 'acorns' }, help: 'picture',
  facts: [{ a: 7, b: 8, prompt: [{ who: 'groundhog', kind: 'whisper', text: 'Seven… times… eight…' }], retryPrompt: true,
    right: [{ who: 'player', kind: 'whisper', text: 'Fifty-six.' },
            { who: 'groundhog', kind: 'whisper', text: 'Fifty… six… thank you…' },
            { kind: 'caption', text: '*Snore.*' }],
    rightAgain: true }],
  helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
  fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
  avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
}
```

- **Chapter 9's sleeper's set, `ch09-mizzle`, is the model** (the module's sleepers are dragonets' successors: module-2's
  "What she can find"): its picture (seven twigs, eight acorns each, in two clusters of four: never marks, so nothing on
  this page looks like the badger's line and pokes), its help (the twigs lit a twig at a time), its borrowed fillers
  (chapter 9's easiest eights, drawn as twigs, never 6 × 8, 7 × 8 or 8 × 8) and its lines (her help and filler lines,
  said in the groundhog's voice: the only engine lines this spec borrows). Its `miss` stays MISS: it has fillers, so a
  missed 7 × 8 does come back, after two easy eights (run: `story13.txt`).
- **The lullaby is lettered only in the Count's prompt**, the groundhog's whispered balloon "Seven… times… eight…" (the
  maths critic's round-1 low; the leftover-lows' note: Tallyheart is at the bridge, so the prompt is the groundhog's):
  f063's own balloon ends at "Unless…". Right: her whispered "Fifty-six.", its "Fifty… six… thank you…" and the caption
  *Snore.*, on a retry too (`rightAgain`, the maths critic's round-1 low). A cat helped twice hears none of them; f064
  shows it asleep regardless (section 7, item 10).

## 3. The Case File

**No card**, given or shown (`cards: {}`). Module 2 has no Case File; the badger page does its work (section 5, "The
book"). The Case File's button and title stay as they are.

## 4. Art needs

**New: one cast member, `groundhog` (`cats.js`, every pose below); two keys on the kit's quick marks, `crossed` and
`fresh` (`cats.js`); `curl` with `tailUp` for cats (`cats.js`); on the camp, the option `frost` and two spots on `ferns`
(`scenes.js`); on the hollow, the option `spreadMarks` (`scenes.js`); on the den, the option `collar` (`scenes.js`); on the
grove, the option `dig` on `oak` (and, only if fewer than four of its spots are clear of the dig, one spot `oak-near`),
and a new composition `dig` with two cameras (`dig`, `marks`), its spots, covers and options `marks` and `tap`
(`sets/grove.js`). Nothing else is new.** Every new option is off by default and every new camera,
composition and spot additional, so chapters 1 to 12, the Warrior Counts and the kit's pages draw byte for byte (section
7, item 3).

**Times of day**: `morning` from first light to the Hollow (the den, the camp's frost, the Crossing, the river path, the
ferns, the lesson: "Late in the morning"); `day` at noon in camp and on the path to GroveClan (or `morning`, if chapter
12's sets owner moved its midday run to `morning` by its call 19: the story builder follows chapter 12's built frames);
the grove keeps its bright afternoon (`todFixed`); `sunset` home; `night` from the stars to the end. **No moon is drawn**
(the brief's call 1: at bedtime it has not risen; the den's `moon` left out, the camp's too). **Never dark.**
**First light by the river has never been drawn**: the Crossing only by `day`, the riverbank only by `day` and `night`,
and nobody holds `crossing.js` or `riverbank.js`. The sets owner looks once at the Crossing's `wide`, `low`, `rocks` and
`raft` (with `plane: 'none'`) and the riverbank's `path` by `morning`; if either reads wrong, that set's frames take `day`
(as chapter 12's call 19 moved its midday run), and the story builder follows the sets owner's notes.

### Places

| Set | Cameras the chapter uses | Options | New |
|---|---|---|---|
| `den` (`scenes.js`) | `nest` (her warrior's nest: first light, bedtime, the dream); `inside` (the apprentices' den: morning, bedtime, the end) | her nest: `DENW13 = { weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true, nextNest: true, miststone: true }` by `morning` and `night` (no `moon`); the apprentices' den: `{ weather: 'clear' }`, with **`collar: true`** from f027 on | **`collar`** |
| `camp` (`scenes.js`) | `reveal`, `crowd`, `ferns` (morning, frost); `crowd`, `fountain`, `reveal` (noon); `reveal`, `crowd` (sunset); `reveal` (night) | **`frost: true`** (f004, f006, f016 to f026), **`frost: 'prints'`** (f007 only); `crowd: true` at noon; at night nothing (no `moon`: the camp under the stars) | **`frost`**, **spots `ferns-1`, `ferns-2`** |
| `riverbank` (`sets/riverbank.js`) | `path` (morning: home from the Crossing, mice carried; `day`: the walk to GroveClan) | `{}` | nothing (the sets owner looks once at `path` by `morning`; fallback `day`) |
| `crossing` (`sets/crossing.js`) | `wide`, `low`, `rocks`, `raft` (morning) | **`CROSS13 = { plane: 'none' }` on every frame** (the set's default plane is `'high'`, an airplane the story never mentions: chapter 5's `CROSS`), with `pebbles: true` where Riffle juggles | nothing (first light at the Crossing: the sets owner looks once at `wide`, `low`, `rocks` and `raft` by `morning`; fallback `day`) |
| `hollow` (`scenes.js`) | `lesson` (morning; `sand` for f035 only if the spread does not read on `lesson`) | `H13 = { marks: 10, glow: 'auto' }` on every frame (her ten claw marks), with **`spreadMarks`** on f032 to f037 | **`spreadMarks`** |
| `grove` (`sets/grove.js`) | `wide`, `meet` (the bridge's end, the elder); `oak` with **`dig: true`**; **`dig`** and **`marks`** (the new composition) | `oak`: `{ dig: true }`; `dig`: `{ marks: 'leaves' }` or `{ marks: 'bare' }`, `tap: 'leaves'` (f065), `tap: 'marks'` (f068) | **`dig` on `oak` (and `oak-near`, only if needed); the `dig` composition, cameras `dig` and `marks`, its spots, covers and options** |

**No pile drawn** (call 12): noon is on the camp (`crowd`, `fountain`, `reveal`), the prey pile off the picture, since
the pile set draws only its stacks of two or chapter 4's four rows of ten, and a countable picture of anything but 52 would
lie (the store is drawn only at the story's numbers; the pile likewise). The take page draws 52 in the kit's picture.

#### The camp's first frost (`scenes.js`, the `camp` set)

- **`frost`** (`[false, true, 'prints']`, off by default), on the main composition's cameras (`reveal`, `crowd`, `ferns`,
  `purr`; not `fountain`, `entrance` or `herbs`, which the chapter never frosts): **the first frost, at first light**:
  every fern edged and tipped silver-white with rime (the fronds still green under it, so they read as ferns, white at
  the edges: "every fern is WHITE"), the moss and the mossy path stones pale with rime, the grass silvered, a white rim on
  the dry fountain's edge and on the tops of the bramble dens, a few soft glints (not stars); the morning sky clear and
  pale. Cold and bright, never grey or dark. Drawn whatever the light (the story builder sets it only by `morning`).
- **`'prints'`**: the same, and **three trails of small pawprints** pressed green through the white, side by side, from
  the dens across the camp toward the entrance at the left, many prints a trail (never twelve, never a countable number),
  for the three cats of the dawn patrol (f007 only: "Behind you, three cats’ pawprints march across the white."; on f006
  the three are still walking toward the entrance, so trails there would run ahead of them, and f006 takes `frost: true`).
  In `keep` as one box (the lettering off them).
- **Spots on `ferns`** (box `[1080, 640, 520]`): **`ferns-1`** (front left, facing right: our cat, teaching) and
  **`ferns-2`** (front middle, facing right, toward the ferns: Chispapaw in her crouch, room before her nose for the pounce),
  with the existing `crowd-right` (behind, facing left: Tallyheart, off to the side, watching) and the ferns themselves
  at the right (where the mouse is: never drawn). About `A(1150, 930, 270)` and `A(1300, 935, 270)`; the sets owner
  settles them with `tools/frames.mjs`. **Acceptance**: the three at once, with Chispapaw in `crouch` with `tailUp: true`
  and in `stand` (the bounce) and `crouch` with `holds: 'leaf'`, `holdAt: 'paws'`, our cat `sit` and `crouch`, none
  touching, at 1080 × 720 and 390 × 844. If three cannot stand on `ferns` without touching, the crouch frames (f017 to
  f026) move to `crowd` with the same two spots added there (the sets owner says which in its notes; the story builder
  follows it).
- Off, every camp frame of chapters 1 to 12 draws byte for byte.

#### The spread in the sand (`scenes.js`, the `hollow` set)

- **`spreadMarks`** (`[false, 'standing', 'spread', 'two']`, off by default), on `lesson` and `sand`, in **a keep box of
  its own** on the sand between our cat's nose and Tallyheart's paws, clear of the claw marks and of all three cats (the
  sets owner sizes it, and may widen it toward our cat; it need not be chapter 12's `quick` box, which is about 185 × 50 on
  `lesson`: each spread forty-three, with its frame of ten, is about 250 × 90 at scale 1, so two side by side in that box
  come to about 0.35, dot cells near 5 px at 390 × 844, the kit critic's measure). Drawn by the kit's quick marks
  (`PC.art.kit.quick`, ground `'sand'`), each set scaled to its share of the box by `PC.art.quickMarks.size(o)`, which
  counts the struck line and the frame of ten (the cats owner's), right to left as chapter 12's `quick`:
  - `'standing'`: **Tallyheart's forty-three**, at her paws (nearest `tree`): four lines and three dots,
    `kit.quick(x, y, k, { tens: 4, ones: 3, ground: 'sand' })` (f032 to f034).
  - `'spread'`: **the same forty-three, spread**: one line crossed out and ten new dots in a scratched frame under the
    three old ones, five and five, as the help's sand draws them: `kit.quick(x, y, k, { tens: 3, ones: 13, crossed: {
    lines: 1 }, fresh: { dots: 10 }, ground: 'sand' })`, the quick marks' two new keys (below) (f035).
  - `'two'`: **Tallyheart's spread forty-three and yours beside it** (nearest our cat), the same marks twice, a little
    apart (f036, f037: "your own forty-three beside hers"). Chispapaw scratches none.
  Never with `store` or `quick` on one frame (chapter 13 never asks). **No runtime fallback**: `kit.quick` (scenes.js)
  passes `o` whole to `quickMarks`, and nothing tells scenes.js when the new keys have landed, so the sets owner writes the
  final calls above; until the cats owner's keys land they draw three lines and thirteen loose dots, which nobody judges,
  and the orchestrator looks once both owners have landed. **Acceptance** (the sets owner, `tools/frames.mjs`, on f032 to
  f037's opts with chapter 12's staging): on `lesson`, the standing forty-three (f032 to f034) and the spread one (f035)
  with every line and dot countable at 1080 × 720 and 390 × 844 (the crossed line plainly struck, the ten-frame plainly
  five and five, the three old dots apart from it); the two spreads (f036, f037) every line and dot countable at
  1080 × 720, and at 390 × 844 plainly two spread forty-threes (each struck line and each frame of ten plain: she counted
  the spread on f035, and f036's words ask no count); nobody over the box. **If the single spread does not read on
  `lesson`, f035 alone moves to `sand`** (one caption and the spread itself; Chispapaw's «¡Desagrupo!» whisper then comes
  from off the panel with `name: 'Chispapaw'`, as f079's call, since `sand`, x 560 to 960, shows neither her at
  `sunpatch-3` nor Tallyheart at `tree`). **f036 and f037 stay on `lesson` with `'two'` whatever happens**: both speak
  there, and on `sand` their balloons would have no faces. The sets owner says which in its notes.
- **Never "rows" of five in any word about it**: the storyboard says "ten new dots in a scratched frame, five and five"
  (a row means ten, only: module-2's amendment 1; the Spanish critic's round-1 low).
- Off, every hollow frame of chapters 1 to 12 and the kit's pages draws byte for byte.

#### The collar (`scenes.js`, the `den` set)

- **`collar`** (`[false, true]`, off by default), on `inside`: **Chispapaw's collar** (narrow, red, its tiny round gold
  bell: the collar `cats.js` draws on her, the same red and gold) lying curled in a little hollow pressed in the moss
  beside the apprentices' nest at `nest` (the player's old nest, Chispapaw's since chapter 12), on the side away from the
  grey tom, clear of whoever lies in the nest, small but plainly a collar and a bell at 390 × 844 (f027, f078, f080, f084).
  In `keep` (no lettering over it). Off, every den frame draws byte for byte.

#### GroveClan's woods: the dig and the marks (`sets/grove.js`)

The grove has had no options (`opts: {}`); chapter 13 gives it its first. Drawn only by day, as ever (`todFixed`).

- **`dig`** on the **`oak`** camera (`[false, true]`, off by default): **the big dig at the old oak's roots**, at the
  trunk's foot on its sunny right side among the roots: a wide, shallow hole under a root, its inside a soft warm
  earth-brown (never black), earth thrown back in two loose heaps either side of it, **five long scratches** raking down
  its near side in a row (the digging claws' marks: wide curved rakes in the dig's sloping wall, never straight strokes
  like a quick line on flat earth), no fur, no feathers; just beside it on its left, between it and a root, **a smaller
  doorway** (a round burrow mouth about half the dig's width, its inside soft brown), half under fallen leaves. **The
  marks are never drawn on `oak`** (too small there; found on `dig`). The dig and the doorway in `keep`, and no spot of the
  chapter's on them. **f053 and f056 need four cats on `oak`** (the elder and our three): the sets owner checks `root-1`,
  `root-2`, `root-3` and `elder` against the dig (it may well cover `root-3`, at 1010, 946, and crowd `elder`) and says
  which are clear; **only if fewer than four are clear**, it adds one spot, **`oak-near`** (on the ground in front of the
  trunk, clear of the dig and the doorway, facing right, a cat's height for the camera's depth), and the story builder uses
  it. Acceptance: four clear spots on `oak` with `dig`, none touching.
- **The `dig` composition** (new, `comp: 'dig'`): **the dig close, at cat height**, the same place: at the left the
  oak's foot (moss-furred bark, a root like an arm across the ground) and, under that root, the smaller doorway, half
  under leaves; in the middle **the big dig**, its heaps and its five long scratches big enough to count; at the right,
  beside the dig on the side away from the doorway, **a patch of flat bare earth** among the leaf litter, where the marks
  lie (option `marks`); ferns at the back; dappled afternoon light. Nothing frightening; nothing dark in the holes.
  - **Cameras**: **`dig`** (`{ box: [0, 0, 1600], comp: 'dig' }`, the whole composition) and **`marks`** (the same
    composition's box cropped on the flat earth, the marks filling about half the panel, the dig's near rim with two of its
    five long scratches at the panel's left edge, so "They're not like the dig's big scratches" reads in one picture; no
    spots: a face is never in it, its balloons come from off the panel, as the pile's `gap-close`).
  - **Spots** (`dig`): **`door-1`** (in front of the doorway, a cat crouched facing it, facing left: our cat in the
    groundhog's scene), **`door-2`** (beside her, a step back, facing left: Chispapaw), **`doorway`** (in the doorway
    itself: the groundhog, its lower half under the `leaves` cover; no ground shadow), **`dig-front`** (front middle, before
    the dig, facing left toward it: the sniff), **`marks-1`** and **`marks-2`** (front right, by the flat earth, facing
    right toward the marks: our cat and Chispapaw), **`dig-elder`** (back right, facing left: the elder), **`dig-fern`**
    (back left, half hidden by a fern, facing right: the GroveClan apprentice peeking, `z: 'behind'`, as the grove's
    `fern`).
  - **Covers** (scenes.js `S.covers`, keyed by spot, each drawn just after whoever is at that spot, with `data-part` and
    `data-box`; a cover keyed by anything but a spot is drawn as a spare, behind the cast): **`S.covers.doorway`**,
    `data-part` `'cover-leaves'` (over whoever is at `doorway`: a drift of fallen leaves over their lower half, so a round
    brown shape lies "half under the leaves", "its bottom sticking out"; nothing over the face when it sits up), and
    **`S.covers['dig-fern']`**, `data-part` `'cover-fern'` (over whoever is at `dig-fern`, to the eyes, as the grove's own
    `cover-fern`). "The `leaves` and `fern` covers" below mean these two.
  - **`marks`** (`[false, 'leaves', 'bare']`, off by default), on `dig` and `marks`: **one long line and eight little
    pokes scratched in the flat earth**, drawn as the kit's quick picture on earth (module-2's amendment 2: one picture for
    the help, the lessons and the clue; no new key): `PC.art.kit.quick(x, y, k, { tens: 1, ones: 8, ground: 'earth' })`, a
    line about a cat's paw-height long and eight small neat pokes beside it, five and three (run on the kit: one line 56
    tall, eight dots 28 across). Apart from the dig's five scratches, on flat earth, by themselves. `'leaves'`: **half
    under the leaves** (a few fallen leaves over half of them: the line's top end and three or four pokes showing);
    `'bare'`: the leaves brushed aside to the edges, the line and all eight pokes plain. In `keep`.
  - **`tap`** (`['none', 'leaves', 'marks']`): an unpainted `<g class="pc-tap pc-tap-leaves">` over the leaves on the
    marks (f065: "Tap to brush the leaves away."), or `pc-tap-marks` over the marks (f068: "Tap to look one more time."),
    each its target's box, generous at 390 × 844.
  - **Acceptance** (the sets owner, `tools/frames.mjs`, a stand-in for the groundhog until it lands: a `clancat` in
    `curl` at `doorway`, or `mizzle` in `curl`): on `oak` with `dig`, f053's cast clear of the dig; on `dig`, f054, f055,
    f058, f059 to f064, f065 to f067's casts, none touching, nobody over the dig, the doorway or the marks; the five
    scratches countable and the marks' line and eight pokes countable at 1080 × 720 and 390 × 844 on `dig` (`'bare'`) and on
    `marks`; **on `marks`, the close-up reads as one line and eight pokes**, the two scratches of the dig at its left edge
    plainly the dig's curved rakes in its wall, never two more lines (a child who knows the quick picture must not read
    38); the leaves over half the marks on `'leaves'`; the groundhog's face clear of the `leaves` cover in `wake`, `sit`
    and `yawn`; the apprentice's eyes and ears over the fern.
  - `PC.art.groveInfo()` gains the dig's box, the doorway's box and the marks' box (for the tests).
- Off (no `dig`, no new camera), every grove frame of chapters 9 and 10 draws byte for byte.

### Cast

Every cat side-on, facing left or right. **No two cats touch.** No grown cat in `laugh`; Tallyheart's pride is `proud`.
Crowded casts listed back to front, **except where an order is needed** (section 5): a balloon comes from the nth cast
member of its speaker (so the GroveClan elder is listed before the apprentice on every frame with both, chapter 9's
helper, whatever the depth; the otters of f012 and f013 as listed there), and `motion` and `bonk` play on the first cast
member.

**New: the groundhog** (`groundhog`, `cats.js`; not a cat: poses of its own, as `mizzle`'s). **The first of module 2's
seven sleepers** (module-2's table).
- **Its look**: a groundhog: **round and brown**, plump and soft, a grizzled warm brown coat (darker on the back, a
  little paler and gingery on the belly), a short furry tail, small round ears close to the head, a blunt nose with
  whiskers, small dark sleepy eyes with heavy lids, short legs and little dark paws. **Something BIG**: sitting up, about
  our cat's sitting height and twice as round (bigger than Chispapaw: "Something BIG"); curled, about as long as our cat
  lying. **Never a tooth** (no incisors drawn, ever: the "never toothy" rule of every small creature since Mizzle), never
  claws raised, nothing fierce. Grumpy in the brows and the mouth, never frightening. Nothing like a badger (no stripes,
  no black-and-white face: the badger is never on screen, not even a shadow; a child must never take the groundhog for one
  after the panel that asks), nothing like a cat.
- **Poses**: **`doze`** (in a doorway, round and asleep, back and bottom toward the viewer and the face tucked down:
  "its bottom is sticking out in the cold"; with the `motion` effect for "It shivers"); **`wake`** (the same, its head up
  and turned to the viewer, both eyes open, its whole grumpy face, the body still curled: f060); **`sit`** (sitting up in
  the doorway on its haunches, forepaws folded on its belly, talking: f061, f062); **`yawn`** (sitting up, an enormous
  yawn, eyes squeezed shut, mouth wide and round, no teeth: f063); **`sleep`** (curled round, face showing, eyes shut, a
  little smile: asleep again, f064, and **the book's sleeper page**, whose default pose is `sleep`). An unknown pose draws
  `sleep`.
- **Moods**, every one drawn its way: `neutral`, `sleepy`, `stern` (its grumpy look: f060), `shout` (capital words:
  f061), `sniff` (f062), `happy` (the "thank you" smile, asleep).
- **Its size and shadow** (`scenes.js`, the sets owner's lines): `SIZE_CAP` holds only a reference id and is a ceiling,
  with no slot for a ratio and no floor, so the groundhog is held as Sloshbank is, in a band: **`SIZE_BAND.groundhog = {
  ref: 'player', pose: 'sit', by: 'tall', min: 1.0, max: 1.15 }`** (sitting up, our cat's sitting height to a little
  more: bigger than Chispapaw, never a giant; a drawing already inside the band is left as drawn). The cats owner draws it
  inside the band in cats' units and reports its measured ratio in its notes. Its own shadow (`OWN_SHADOW.groundhog`),
  none in `doze`, `wake` or `sleep` (it lies in the hole: `NO_SHADOW.groundhog = { doze: 1, wake: 1, sleep: 1 }`, read by
  pose; the chapter draws those poses only at `doorway`).
- **Its label and voice** (`app/ui.js`, the cats owner's): `NAMES.groundhog` **"The groundhog"** (the page's default
  label); its balloons on f060 to f062 carry `name: 'The round brown thing'` ("it never names itself early": the story's
  call 9; it says GROUNDHOG on f062, and the tag changes on f063, as Chispapaw's did on her naming). Voice low, grumpy and
  slow: `PITCH.groundhog` 0.78, `RATE.groundhog` 0.84.
- **In `cats.js`'s `CAST_IDS`** (as `mizzle` is) and **`PC.art.vocab.otherPoses.groundhog`** (the five poses): the
  book's `sleeperArt` draws `PC.art.character('groundhog', { pose: 'sleep' })` only for an id in `PC.art.vocab.cast`, and
  the plain curled shape otherwise. **Not scenes.js's cat** (no `CAT_IDS` entry in `scenes.js`).

**New for cats: `tailUp` with `curl`** (the cats owner's): a curled sleeper's tail rising straight up out of the curl, its
tip soft (the chapter's last picture: "Chispapaw’s tail twitches in her sleep. Straight up.", f084, with the `motion`
effect). Off unless asked (no frame of chapters 1 to 12 gives `curl` a `tailUp`: the cats owner checks), so every
fingerprint stands; a `tests/cats.test.js` case.

**New for the kit's quick marks: `crossed` and `fresh`** (the cats owner's, `cats.js`; `PC.art.kit.quick`, which is
scenes.js's, already passes `o` whole, as for chapter 12's `round`: no edit to it, and the cats owner never touches it):
`quickMarks(x, y, scale, o)`'s `o` gains `crossed: { lines }` and `fresh: { dots }`, with **the help's sand's meaning and
drawing** (`quickSand`): the lines drawn are `tens` + `crossed.lines`, the last of them struck through and dim;
`fresh.dots` (at most ten) of the `ones` drawn in a scratched frame (the sand's groove colour, a rounded rectangle, as
`quickSand`'s tray) under the old dots, five and five. **`PC.art.quickMarks.size(o)` counts them** (the struck line and
the frame), so the hollow can fit a spread set to its box. Without them, every existing call and size draws byte for byte
(chapter 12's three `quick` sets, the badger's marks, every `kit.quick` call): a test. For `spreadMarks` only.

**Everyone else is drawn already:**
- **Our cat**: `curl` (`asleep`), `loaf` (`sleepy`, `dreamy`), `sit`, `stand`, `walk` (`holds: 'mouse'`, f015: chapter
  12's), `crouch` (teaching; sniffing; at the doorway; at the marks), `pawup` (the catch), `flat` (the flop); `tap: 'paw'`,
  `'nose'`, `'tail'` (with `tailUp`).
- **Chispapaw** (`chispapaw`, chapter 12's): `curl` with `asleep` (f005, with her collar: her bell tings in the caption;
  f084 with `tailUp`), `stand` with the `motion` effect (the bounces, f016, f017, f045), `crouch` (the hunter's crouch,
  with `tailUp: true` from f020: "her tail sticks straight UP, like a flag"; with `holds: 'leaf'`, `holdAt: 'paws'` on
  f022: "Got it!… It's a leaf."; creeping, f024), `sit` (`proud`: "sits up very straight"; `shy`: "Sorry, leaf."), `walk`
  (at heels, f046), `flat` (f072), `crouch` in her nest at bedtime (f078); moods `happy`, `wonder`, `shy`, `proud`,
  `worried`, `sniff`, `sleepy`. **`collar: false` on every frame from f027 to the end** (she leaves it in her nest; the
  den's `collar: true` draws it there); the collar on before f027. Chapter 12's spec readied `collar: false` (its call 18):
  first used here.
- **Tallyheart**: `peer` (her head over the nest's edge, f002), `walk`, `sit`, `stand`; `kind`, `proud`, `happy`,
  `wonder`.
- **{Murmur}chime** (`murmurchime`): `sit` at `next-nest` (`happy`), `walk` with `holds: 'mouse'` (one mouse drawn: "catches
  three"), `lie` at `next-nest` (`sleepy`, then `asleep`).
- **Riffle**: `juggle` (with `holds: 'pebbles'`) and the `bonk` effect (f009: "One bonks his nose."), `stand`, `hop`
  (f014, his goodbye: chapter 11's cheer; Riffle has no `pawup`), on land at the Crossing (juggling is allowed anywhere
  but under the Old Bridge: Otter's honor).
- **Granny** (`otter` variant 3, `holds: 'pole'`), balloons with `name: 'Granny'`; **the ferry otters** (`otter`
  variants 1, the old ferry otter, and 2), labelled by the page's variant names ("The old ferry otter", "An otter"). No
  chapter `names` entry for `otter` (it would call every otter Granny). Granny is not in f012's and f013's casts (section
  5: three otters there would give the third otter balloon her face).
- **Glintstar**: `stand` on `fountain-top`, `sit`, `walk`; `solemn`, `kind`, `proud`.
- **The old tom** (`grizzled`): `sit`; `shout`, `stern`, `sniff`. **The grey tom** (`snorer`, still unnamed): `sit`,
  `curl` with `asleep`; `wonder`, `sleepy`.
- **The GroveClan elder** (`groveclan` 1) and **apprentice** (`groveclan` 2, peeking from a fern; never speaks).
- **Clan cats** (`clancat`): noon's crowd (`crowd: true` and two in the cast).

### Counts art

Nothing new: the 4s' picture (three cats, four paws each), the anchors' pictures for the warm-up (`E.questionDef`), the
kit's store picture and sand for the take pages, `preyPicture`'s stacks for 6 × 8 (no `rows`), chapter 9's acorns for
7 × 8, their helps as drawn.

### Heard, not seen

*Ting! Ting! Ting!* (f016), *Crunch!* (f022), *Ting.* (f024): each the frame's `sfx`, lettered, never read. The bell's
*ting* in a caption (f005, f078) and *nibble, nibble* (f024) are the captions' own italics; *Sniff.* (f055) the caption's;
*WHUMP!* (f071) the balloon's; *Snore.* (the lullaby's right lines) a caption's. No frame letters a sound the story does
not.

## 5. Build notes

General rules, then the chapter frame by frame. Chapter 12's file (`app/story/ch12.js`, built) is the model: its helpers
(`c`, `S`, `merge`, `T`), frame ids in reading order, a `board` on every frame, its named raw spots.

- **The chapter**: `PC.story.ch13 = { id: 'ch13', number: 13, title: 'The Hunter’s Crouch', module: 2, start: 'f001', names:
  { player: '{name}{ending}' }, frames, counts: { 'ch13-dawn': …, 'ch13-warm': …, 'ch13-take': …, 'ch13-noon': …,
  'ch13-pile': …, 'ch13-lullaby': … }, cards: {}, book, teaser }` (section 2's sets, `T`, `G`, `HOP`, `HOP_FAR`, `MISS`
  and `LAST` as written there). It opens when chapter 12 is finished (number order: no `opensWhen`).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen, the
  screen is split (the splits are in the frame list; the words never change). **No panel holds five boxes.** A speaker's
  paragraphs in a row are balloons in a row; a quote the story splits round its tag is one balloon, its comma a full stop
  where the quote resumes with a new sentence.
- **Speech tags' narration is not lettered** (the picture carries it): "Tallyheart’s head pokes over the edge of your
  nest." between her two quotes (f002), "says Granny, frost on her whiskers" (f011; the frost on her whiskers is not drawn:
  section 7, item 4), "She looks down at her paws." (f022), "Chispapaw’s ears shoot up." (f030: `wonder`, ears up), "It
  sniffs." (f062: `sniff`), "on her way past your nest" (f081), "in the next nest" (f077), "it grumbles", "it huffs",
  "mumbles", "breathes", "squeaks", "calls", "whispers". **Lettered as captions**, being narration the picture cannot
  carry: "{Murmur}chime is up already." (f003), "One bonks his nose." (f009), "The elder blinks." (f052b), "The old tom
  licks his lips." (f041), "Glintstar has heard Tallyheart’s news." (f042), "Glintstar’s whiskers twitch." (f044),
  "Tallyheart looks at you." (f020), "Then she looks at you: your turn to ask." (f051).
- **Long captions** (at most 95 characters a box; split at a sentence break, the words unchanged): f004, f005, f054,
  f069, f070, and f058's `friends` caption, one sentence of 102 characters, split at its colon (named below). f055,
  f064 and f065 are 94: the story test pins every box at 95 or under.
- **Speakers**: every balloon's speaker is in the frame's cast, but two off-panel voices, each with `name` (no face, the
  tail out of the panel): Tallyheart's call from the bridge (f068, `name: 'Tallyheart'`) and Chispapaw's goodnight from
  across the camp (f079, `name: 'Chispapaw'`), and, only under section 4's `sand` fallback, Chispapaw's f035 whisper
  (`name: 'Chispapaw'`). Granny's balloons carry `name: 'Granny'` (f011); the groundhog's on f060 to
  f062 `name: 'The round brown thing'`. **A balloon comes from the nth cast member of its speaker** (`E.balloons`' `nth`,
  its place among that speaker's balloons; `ui.js` falls back to the first member when the cast has fewer), so where one
  speaker id has several members the cast order is the balloons' order: the otters on f012 and f013 (below), and the
  GroveClan elder listed before the apprentice on every frame with both (f050 to f052b), whatever the depth.
- **Balloon kinds**: `whisper` for Chispapaw's "It’s bigger than my WHOLE nest." (f053), "WORMS? For SUPPER?" (f055),
  "Was THAT the badger?" (f059), "Sleep tight. All frost-time." (f064), "Claw marks?" (f067), "What’s a courtesy
  patrol?" and our cat's "A polite one." (f043), her «¡Desagrupo!» as the row spreads (f035), the pile's "¡Veinticinco!"
  (f040), her bedtime "The crouch… feeds… you…" (f078, `words`), the grey tom's "If a badger sits on me, wake me up."
  (f080), Tallyheart's "Mentor." (f081), the lullaby's prompt and right lines. `shout` for Riffle's "We’re not under the
  Old Bridge. So juggling’s ALLOWED!", "{name}{ending}! CATCH!" and "Say HI to the badger for me!", the otters'
  "BIGGER!", the groundhog's "What do I LOOK like? A BADGER?", Tallyheart's call (f068), Chispapaw's "Goodnight,
  MENTOR!" (f079), the old tom's tale (f071). Every other balloon plain. **Chispapaw's Spanish**: out loud in the Hollow
  (f030, f033, the echoes), whispered as the row spreads (f035: the README's call on decision 55, "Chispapaw whispers it
  as the row spreads") and before the Clan (f040).
- **Spanish** (chapter 12's feature): a whole Spanish line is a balloon with **`lang: 'es'`**, its text tokens and
  punctuation only, its English made by the engine and lettered under it: f033 `'{Es:noAlcanza}'` ("«¡No alcanza!»" over
  "(Not enough!)"), **f035 `'{Es:desagrupo}'`** (whispered: "«¡Desagrupo!»" over "(Breaking it into groups!)", Lissa's own
  words for it), f040 `'¡{Es:25}!'` ("«¡Veinticinco!»" over "(Twenty-five!)"). A Spanish word inside an English line is a
  token: **f030 `'{Es:resta} THAT’S what take-aways are! My little Tall One’s homework this frost-time!'`**, lettered
  "«¡La resta!» THAT’S …" in the italics and the Spanish voice. **The table holds the form as lettered** (chapter 12's
  pattern: `galleta` 'Galleta', `aContar`, `noAlcanza`), because chapter 12's `E.esEnglish` matches a words-table entry
  on its `es` with case kept (only numbers are matched ignoring case and ¡ ! ¿ ?): a table entry `'la resta'` under
  `'¡{Es:resta}!'` would letter the same but leave Read to me with no Spanish voice saying nothing for the word ("THAT’S
  what take-aways are!", pointing at nothing). With `'¡La resta!'` it says "Take-aways! THAT’S what take-aways are! …".
  `{Es:…}` on a value that already opens "¡L", "¡N" or "¡D" is a no-op; the tokens open their lines as `{Es:…}` (chapter
  12's guard for later chapters). A later chapter that letters «la resta» mid-sentence adds its own one-line entry. Never
  «» in the story file.
- **The words table** (`app/story/words.js`, `PC.words.es`, three lines, the cats owner's):
  `resta: { es: '¡La resta!', en: 'Take-aways!' }`, `noAlcanza: { es: '¡No alcanza!', en: 'Not enough!' }` and
  `desagrupo: { es: '¡Desagrupo!', en: 'Breaking it into groups!' }` (decision 55: her class's *desagrupar* as she says
  it, glossed with her words; never replacing the English "spread a row").
- **"Spread" is fixed English in two frame lines**: f034's "Then we spread a row. Ten more loose." and f037's "Not enough?
  Spread a row. That’s a warrior’s trick." (frame balloons: `E.fill` fills no `E.TAKE_WORDS` token, and the lesson set's
  `done` is `''`, so the take page fills neither). **The story test asserts `PC.words.spread === 'spread'` and
  `PC.words.Spread === 'Spread'`**, its message naming those two lines (f034, f037), so a word swap fails loudly (the
  Spanish critic's round-2 low; decision 55 keeps the English "spread a row", so no Spain-style rewrite is pending). Both
  are in the kit's base-form slot ("we spread a row", "Spread a row"), so any word Aron gives fits them by hand.
- **The choices**: labels with the story's quotes, `sets: {}` but `teach`'s. Where each option has its own reply (the
  polite ask), each goes to its own frame (f052a, f052b), which meet at f053.
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; a cast target drawn only where the cast entry carries `tap`,
  a scene target by the set's `tap` option). Each Tap's response is drawn on the next frame, or not at all where the page
  turns at once (section 7, item 4):

  | Frame | `tap` (who carries it) | `prompt` | `label` |
  |---|---|---|---|
  | f004 the first frost | `paw` (our cat, `walk`, `wonder`) | `**Tap** to crunch it again.` | `Crunch it again.` |
  | f006 the dragon puff | `nose` (our cat, `walk`) | `**Tap** to puff one back.` | `Puff one back.` |
  | f010 Riffle's pebble | `paw` (our cat, `pawup`) | `**Tap** to catch it.` | `Catch it.` |
  | f021 the frosty leaf | `nose` (our cat, `sit`) | `**Tap** to whisper, “Wait for it…”` | `Whisper, “Wait for it…”` |
  | f027 the collar | `paw` (our cat, `sit`) | `**Tap** to help her tuck it in.` | `Help her tuck it in.` |
  | f035 the spread | `paw` (our cat, `sit`: a crouch reaches into the marks, chapter 12's f047) | `**Tap** to scratch yours.` | `Scratch yours.` |
  | f049 the bridge's end | `paw` (our cat, `sit`) | `**Tap** to sit and wait.` | `Sit and wait.` |
  | f054 the dig | `nose` (our cat, `crouch`, `sniff`, at `dig-front`) | `**Tap** to sniff the dig.` | `Sniff the dig.` |
  | f059 the round brown shape | `nose` (our cat, `crouch`, at `door-1`) | `**Tap** to whisper, “Hello?”` | `Whisper, “Hello?”` |
  | f064 asleep again | `paw` (our cat, `crouch`, at `door-1`) | `**Tap** to tuck the leaves back over it.` | `Tuck the leaves back over it.` |
  | f065 half under the leaves | `leaves` (the grove's `tap: 'leaves'`) | `**Tap** to brush the leaves away.` | `Brush the leaves away.` |
  | f068 the marks, close | `marks` (the grove's `tap: 'marks'`) | `**Tap** to look one more time.` | `Look one more time.` |
  | f071 the old tom's tale | `paw` (our cat, `sit`) | `**Tap** to flop flat too.` | `Flop flat too.` |
  | f079 goodnight | `tail` (our cat, `sit`, `tailUp: true`) | `**Tap** to wave goodnight.` | `Wave goodnight.` |
  | f082 the hook | `nose` (our cat, `loaf`, `dreamy`) | `**Tap** to curl up tight.` | `Curl up tight.` |

- **Shared opts**: `DENW13` (above: her warrior's nest, `morning` and `night`, no `moon`); `DEN_APP = { weather: 'clear' }`
  and `DEN_COLLAR = { weather: 'clear', collar: true }` (the apprentices' den); `FROST = { frost: true }`, `PRINTS = {
  frost: 'prints' }` (f007 only); `CAMP_DAY = { crowd: true }`; `CROSS13 = { plane: 'none' }` (every crossing frame,
  merged under `pebbles: true` where Riffle juggles); `H13 = { marks: 10, glow: 'auto' }` (merged into every Hollow frame's
  opts, with `spreadMarks` on top); `DIG = { dig: true }` (`oak`); `LEAVES = { marks: 'leaves' }`, `BARE = { marks: 'bare'
  }` (`dig`, `marks`).
- **Spots**: the den's `nest`, `next-nest`, `sleeper-1`, `sleeper-2` (our cat beside Chispapaw's nest on f027, facing
  right), and chapter 12's raw spot for Tallyheart passing at the nest's edge (its f077); the camp's `entrance`,
  `fountain-top`, `fountain-foot`, `crowd-left`, `crowd-right`, `center`, `ferns-1`, `ferns-2` (new); the Crossing's
  `rock-left`, `rock-high`, `rock-right`, `shore`, `pebbles`, `raft-1` to `raft-3` (and, on f008, a raw spot for the third
  cat); the riverbank's `path-left`, `path-right` (and a raw spot for a third cat, f015, f046); **the story builder settles
  each raw spot with `tools/frames.mjs`**, touching nobody, and names it in the file as chapter 12 does; the hollow's
  `tree`, `sunpatch-3` and chapter 12's `HOL_YOU`; the grove's `edge-1` to `edge-3`, `elder`, `fern` (`wide`), `meet-1` to
  `meet-3`, `elder`, `fern` (`meet`), the four `oak` spots the sets owner reports clear of the dig (with `oak-near` if it
  had to add it), and the `dig` spots (new). **Vary the camp's
  cameras at noon** (`crowd`, `fountain`, `reveal`), so eight panels are not one.
- **The storyboard**: `tools/storyboard.mjs` prints the set's marks page as "**Then the marks page**" with its four
  lines and two after-lines, before the worked example (the kit's tools owner adds it).

### The frames

78 frames on a plain reading, 84 with the groundhog (cap 125): f001 to f084 with f052a and f052b, the groundhog's f059 to
f064 read only after "Look closer.". The words of each are the story's screen, named by its first words; every line below
is the story's.

**First light** (her warrior's nest, `DENW13`, `morning`)
- **f001** `den`/`nest`: our cat `curl` `asleep` at `nest`, {Murmur}chime `sit` at `next-nest` (`happy`, awake). Caption
  "Chapter 13: The Hunter’s Crouch". The start, every path (the brief's title panel).
- **f002** the same, our cat `loaf` `sleepy`; Tallyheart `peer` at the nest's edge (a raw spot behind it, touching
  nobody). Her balloon "First light, warrior. Riffle’s waiting."
- **f003** the same, our cat `sit`: caption "{Murmur}chime is up already."; her "Your first dawn patrol! Just the three of
  us."; **Choose** "“I’m UP!”" / "“First light ALREADY?”", both to f004.
- **f004** `camp`/`reveal`, `FROST`, `morning`: our cat `walk` (`wonder`) in front, Tallyheart and {Murmur}chime behind;
  the camp white. Captions "Outside, every fern is WHITE. The first frost!" / "All your pillow life, frost was a picture
  through the glass. Now it CRUNCHES under your paws." / "It’s like your very first step on grass. Only CRUNCHIER."
  (split at its sentences); the crunch Tap.

**The dawn patrol** (`morning`)
- **f005** `den`/`inside`, `DEN_APP`, `zzz`: the grey tom `curl` `asleep` at `sleeper-1`, Chispapaw `curl` `asleep` at
  `nest` (collar on). Captions "The three of you pad out of camp, past the apprentices’ den." / "The grey tom is still
  asleep, and so is Chispapaw." / "Her bell goes *ting* with every snore. *Ting.* *Ting.*" (the first split at its
  sentence).
- **f006** `camp`/`crowd`, `FROST` (no trails yet: they are being made), our cat `walk`, {Murmur}chime `walk` facing her
  (`happy`), Tallyheart ahead, toward the entrance. Caption "Your breath makes little clouds in the cold air.
  {Murmur}chime puffs one at you."; her "Look! I’m a DRAGON!"; the puff Tap (the breath is not drawn: section 7, item
  4).
- **f007** `camp`/`reveal`, `PRINTS`: the three near `entrance` facing left, Tallyheart turned back (facing right) over
  the trails. Caption "Behind you, three cats’ pawprints march across the white. Tallyheart looks back at them.";
  `counts: { set: 'ch13-dawn', intro: false, next: 'f008' }` (her prompt is the Count's page).

**The Crossing** (`crossing`, `morning`, or `day` if the sets owner's look says so; `CROSS13` under every frame's opts)
- **f008** `crossing`/`wide`, `merge(CROSS13, { pebbles: true })`: Riffle `juggle` with `holds: 'pebbles'` at `pebbles`;
  our three arriving at `rock-left`, `shore` and a raw spot the story builder settles. Caption "Down at the Crossing,
  Riffle is juggling. One pebble, two, THREE!"; his "We’re not under the Old Bridge. So juggling’s ALLOWED!" (shout).
- **f009** the same, the `bonk` effect, Riffle listed first (the pebble bounces off the first cast member's head): caption "One bonks his nose."; his "That one was a spare."
- **f010** `crossing`/`low`, `CROSS13`: Riffle `juggle` (tossing), our cat `pawup`. Caption by `specialty: 'swimming'`:
  "Steam curls off the river. Even the water is breathing little clouds."; his "{name}{ending}! CATCH!" (shout); the
  catch Tap.
- **f011** `crossing`/`rocks`, `CROSS13`: Riffle `stand` (`happy`), Granny (`otter` 3, `holds: 'pole'`) at `raft-1`, our
  three. Riffle's "You’re a NATURAL! Granny! They came! Tell them!"; Granny's (`name: 'Granny'`) "Badger. A FRESH one.
  GroveClan’s side of the little channel. Saw it from the ferry. Like the island’s print. But NEW."
- **f012** `crossing`/`raft`, `CROSS13`: the ferry otters at `raft-2`, `raft-3`, **listed otter 2 first, then otter 1**,
  Riffle, our three; **Granny not in the cast** (off the panel: with three otters listed, the third otter balloon would
  take her face and voice). Caption "The ferry otters crowd in."; otter 2's "As big as a FOX, we heard!" (the first
  otter balloon: slot 0, otter 2); otter 1's "BIGGER!" (shout; slot 1, otter 1); otter 2's "Well. As big as a fox." (slot 2,
  past two otters, so the first: otter 2).
- **f013** the same cast, the same order: **otter 2's** "And it dug a big HOLE in GroveClan’s woods!" (the gossip's, the
  story names no speaker; slot 0); Tallyheart's "A thing to check." (split: six boxes on one panel).
- **f014** `crossing`/`wide`, `CROSS13`: Riffle `hop` at `pebbles` (his goodbye), the three walking off left. His "Say
  HI to the badger for me!" (shout).
- **f015** `riverbank`/`path`, `morning` (or `day`, by the sets owner's look): our cat `walk` with `holds: 'mouse'`,
  {Murmur}chime `walk` with `holds: 'mouse'`, Tallyheart. Caption "On the way home, the patrol hunts. You catch one
  mouse. {Murmur}chime catches three." (split from Riffle's call: narration after a balloon); our cat's "Show-off.";
  Tallyheart's "Four for the pile."

**The hunter's crouch** (the camp, `FROST`, `morning`; from f017 on `ferns`: our cat at `ferns-1`, Chispapaw at
`ferns-2`, Tallyheart at `crowd-right`, `proud`, off to the side)
- **f016** `camp`/`crowd`, `FROST`: Chispapaw `stand` with the `motion` effect at the camp's edge (listed first, for the
  motion), our cat and Tallyheart coming in; `sfx: 'Ting! Ting! Ting!'`. Caption "At the edge of camp, something small
  is bouncing."; her "Is it tomorrow NOW? And everything CRUNCHES! Like SUGAR!"; **Choose** "“It’s tomorrow.”" / "“My
  first frost too! Mouse lesson?”", both to f017.
- **f017** `camp`/`ferns`: Chispapaw `stand` with `motion` (listed first). Captions "Chispapaw bounces so high, her bell
  rings twice on the way up." / "In the frosty ferns, you find the perfect spot. Tallyheart sits off to the side."; our
  cat's "The hunter’s crouch. Every warrior starts here."
- **f018** the same, our cat `sit`, Chispapaw `sit` (`wonder`): caption "Tallyheart taught you on your first evening. How
  will you teach her?"; **Choose** "Show her: “Belly low. Tail straight out. Like this.”" (`sets: { teach: 'show' }`) /
  "Let her try: “You try. I’ll watch.”" (`teach: 'try'`) / "Tallyheart’s words: “The crouch feeds you. The Counts feed
  your whole Clan.”" (`teach: 'words'`), all to f019.
- **f019** the same, Chispapaw `crouch` (`proud`), our cat `sit`, Tallyheart `proud`: **one picture for all three**, and
  by `when`: (`show`) caption "You show her. Chispapaw copies every bit." and her "Like THIS?"; (`try`) caption "Chispapaw
  tries it all by herself." and her "Am I doing it? I’m DOING it!"; (`words`) caption "Tallyheart’s ears go up: her own
  words. Chispapaw’s eyes go big." and her "My WHOLE Clan? Then I’d better get it right." Exactly one pair shows.
- **f020** the same, Chispapaw `crouch` with `tailUp: true`: captions "But her tail sticks straight UP, like a flag." /
  "Tallyheart looks at you."; Tallyheart's "Hmph. I remember another tail like that." (split from f019: narration after
  her balloon).
- **f021** the same, Chispapaw `crouch` with `tailUp` and the `motion` effect (the wiggle; listed first): caption "A
  frosty leaf skitters past. Chispapaw’s bottom starts to wiggle."; the whisper Tap (the leaf is not drawn until it is
  caught).
- **f022** the same, Chispapaw `crouch` with `holds: 'leaf'`, `holdAt: 'paws'` (`wonder`, looking down); `sfx: 'Crunch!'`.
  Caption "Too late! Chispapaw POUNCES."; her "Got it! …⁠It’s a leaf." (a word joiner after the ellipsis, chapter 11's
  f048).
- **f023** the same, Chispapaw `sit` (`shy`), no leaf: caption "She lets it go, very politely."; her "Sorry, leaf." (split:
  narration after her balloon).
- **f024** the same, Chispapaw `crouch` creeping toward the ferns (no mouse drawn); `sfx: 'Ting.'`. Captions "Then, deep in
  the ferns: *nibble, nibble.* A mouse!" / "Chispapaw creeps closer. Closer. Closer…".
- **f025** the same, Chispapaw `sit` (`worried`) looking at the ferns: captions "The ferns twitch. A tail tip flicks.
  Gone." / "Chispapaw looks at the ferns. At her bell. At the ferns again."; her "…⁠Mice have ears."; our cat's "You
  worked that out all by yourself."
- **f026** the same, Chispapaw `sit` (`proud`): caption "Chispapaw sits up very straight." (split: narration after the
  balloons).
- **f027** `den`/`inside`, `DEN_COLLAR`, `morning`: Chispapaw `sit` at `nest` with `collar: false`, the collar in its hollow
  beside her; our cat `sit` at `sleeper-2` facing right. Caption "Back in camp, she wriggles out of her collar."; her "My
  Tall Ones gave me this. It can stay safe, by my nest."; the tuck Tap (from here Chispapaw is `collar: false` on every
  frame).

**The Training Hollow** (`hollow`/`lesson`, `morning`, `H13` under every frame's opts: Tallyheart at `tree` facing left,
our cat at `HOL_YOU` and Chispapaw at `sunpatch-3`, both facing right, our cat `sit`; the marks in `spreadMarks`' own
box, section 4)
- **f028**: caption "Late in the morning, Tallyheart calls you both to the Training Hollow."; Tallyheart's "Even mentors
  have lessons."; Chispapaw's "Mentors have HOMEWORK?"
- **f029**: Tallyheart's "First, three Counts, to wake up your whiskers."; `counts: { set: 'ch13-warm', intro: false, next:
  'f030' }` (the warm-up and its echo: section 2).
- **f030**: Tallyheart's "Now, take-aways."; Chispapaw (`wonder`, ears up) `'¡{Es:resta}! THAT’S what take-aways are! My
  little Tall One’s homework this frost-time!'`.
- **f031**: Tallyheart's "Yesterday, every column had enough loose. Today, one won’t."
- **f032** `merge(H13, { spreadMarks: 'standing' })`: Tallyheart `sit` at `tree` (a crouch would reach into the
  box). Caption "She scratches forty-three in the sand: four lines, three dots."; her "Three loose. Take away six?"
  (split from f031: narration after her balloon).
- **f033** `merge(H13, { spreadMarks: 'standing' })`: Chispapaw's `{ who: 'chispapaw', lang: 'es', text:
  '{Es:noAlcanza}' }` (lettered "«¡No alcanza!»", "(Not enough!)" under it), then her "My little Tall One says that every
  night."
- **f034** `merge(H13, { spreadMarks: 'standing' })`: Tallyheart's "Then we spread a row. Ten more loose."
- **f035** `merge(H13, { spreadMarks: 'spread' })`: caption "She crosses out one line and scratches ten new dots." (split
  from f034); **Chispapaw's whisper `{ who: 'chispapaw', kind: 'whisper', lang: 'es', text: '{Es:desagrupo}' }`**, after
  the caption, before the Tap (lettered "«¡Desagrupo!»" over "(Breaking it into groups!)": decision 55's line, the
  story's v0.5; a frame balloon, chapter 12's feature, never the take page's `o.echo` hook); the scratch Tap (its
  response, hers beside Tallyheart's, is f036). On `lesson`; on `sand` only by section 4's fallback, her whisper then off
  the panel with `name: 'Chispapaw'`.
- **f036** `merge(H13, { spreadMarks: 'two' })`, always on `lesson`: Chispapaw (`wonder`). Caption "Chispapaw stares.";
  her "Three, and ten more… It’s like opening a pack of cookies!"; Tallyheart's "Exactly. Three rows, thirteen loose.
  Still forty-three." and "I’ll say each step. You type it." (four boxes); `counts: { set: 'ch13-take', intro: false,
  next: 'f037' }` (the lesson: section 2; the take page carries the story's next three screens: the kit's marks page
  (once, while she has no marks), the worked example's prompt and column, "Your turn" and Tallyheart's four, and the
  echo after 85 − 39).
- **f037** `merge(H13, { spreadMarks: 'two' })`, always on `lesson`: Tallyheart's "Not enough? Spread a row. That’s a
  warrior’s trick."; Chispapaw's "Tonight, I’ll sit on my little Tall One’s homework. To HELP." (the story's *Done*
  lines: `done: ''` on the set, so they are this frame's).

**Noon at the pile** (the camp at noon, `CAMP_DAY`, `day`: section 4's times; the pile off the picture)
- **f038** `camp`/`crowd`: Glintstar `stand` on `fountain-top`, our cat with Chispapaw close beside her (not touching),
  Tallyheart, the old tom, two Clan cats. Captions "At noon, the whole Clan crowds round the pile. Chispapaw stays close
  beside you." / "Glintstar leaps onto the fountain."; `counts: { set: 'ch13-noon', intro: false, next: 'f039' }` (her
  prompt is the Count's page).
- **f039** `camp`/`fountain`: Glintstar `stand` at `fountain-top`. Her "With the dawn patrol’s four, that’s fifty-two on the
  pile."; `counts: { set: 'ch13-pile', intro: false, next: 'f040' }` (her question is the take page's prompt).
- **f040** `camp`/`crowd`: our cat and Chispapaw in front (`happy`). Chispapaw's `{ who: 'chispapaw', kind: 'whisper',
  lang: 'es', text: '¡{Es:25}!' }` ("«¡Veinticinco!»", "(Twenty-five!)" under it; "just to you" is the whisper and the
  picture).
- **f041** the same, the old tom in front (`sniff`): caption "The old tom licks his lips."; his "Dibs on the BIG one."
- **f042** `camp`/`fountain`: Glintstar (`solemn`): caption "Glintstar has heard Tallyheart’s news."; her "A fresh print,
  and a hole in GroveClan’s woods."
- **f043** `camp`/`reveal`, `CAMP_DAY`: Glintstar `sit` at `fountain-foot`, our cat, Chispapaw, Tallyheart. Glintstar's
  "{name}{ending}, take your apprentice and Tallyheart. A courtesy patrol, to GroveClan."; Chispapaw's whisper "What’s a
  courtesy patrol?"; our cat's whisper "A polite one."; Glintstar's "Ask about their hole."
- **f044** the same, Glintstar `kind`: caption "Glintstar’s whiskers twitch."; her "Politely." (the story's split).
- **f045** `camp`/`crowd`: Chispapaw `stand` with the `motion` effect (listed first), no collar, no sfx: caption
  "Chispapaw bounces. Silently, for once."

**GroveClan** (the path by `day`; the grove by its own afternoon)
- **f046** `riverbank`/`path`: our cat `walk`, Chispapaw `walk` at her heels, Tallyheart behind. Caption "On the path,
  Chispapaw trots at your heels."; her "What does a badger look like?"; our cat's "The otters HEARD it’s as big as a FOX.
  Hearing isn’t seeing."
- **f047** the same, Tallyheart `proud`: caption "Tallyheart gives you a look. A pleased one." (split: narration after
  the balloons).
- **f048** `grove`/`wide`: the three at `edge-1` to `edge-3` facing right (no one in the woods). Caption "At the end of
  GroveClan’s little bridge, you stop. The frost has melted."; our cat's "We wait here to be asked in. Best manners."
- **f049** the same, Tallyheart's ear: caption "Tallyheart’s ear twitches. She once said that to you."; the sit Tap
  (split: narration after her balloon).
- **f050** the same, all three `sit` (the Tap's response: three tails round three sets of paws), the elder (`groveclan` 1)
  at `elder`, the apprentice (`groveclan` 2) at `fern`, **the elder listed before the apprentice** (so on f050 to f052b,
  whatever the depth: her balloons are slot 0). Caption "Out pads the GroveClan elder."; the elder's "The polite
  one. I said I’d remember you."
- **f051** `grove`/`meet`: our cat, Tallyheart (`kind`), Chispapaw at `meet-1` to `meet-3`, the elder at `elder`, the
  apprentice at `fern`. Caption "Tallyheart dips her head to her. Then she looks at you: your turn to ask."; **Choose**
  "“Please, may we see your hole?”" (f052a) / "“We’ve come about your hole. POLITELY.”" (f052b).
- **f052a** the same, the elder `kind`: her "Very nicely asked. Come in." → f053. **f052b** the same, the elder (`wonder`):
  caption "The elder blinks."; her "Very polite. And very LOUD. Come in." → f053.
- **f053** `grove`/`oak`, `DIG`: the elder by the oak, our cat, Chispapaw (`wonder`), Tallyheart, at the four spots the
  sets owner reports clear of the dig (`oak-near` among them only if it had to add it). Caption "She leads you under the
  trees to the old oak. At its roots, there’s a dig. A BIG one." (the option replies' screen's narration, after both
  meet); Chispapaw's whisper "It’s bigger than my WHOLE nest."
- **f054** `grove`/`dig`, `LEAVES`: our cat `crouch` (`sniff`) at `dig-front`, Chispapaw at `marks-2`, the elder at
  `dig-elder`. Captions "Earth is thrown back in heaps. Five long scratches run down the dig’s sides." / "No fur. No
  feathers. Just dirt." (split at its sentence); the sniff Tap.
- **f055** the same, our cat `sit`: caption "*Sniff.* Earth, roots, worms… and a smell you’ve smelled once before, on the
  island. Only FRESH."; the elder's "Badger. Digging for worms, I’d say."; Chispapaw's whisper "WORMS? For SUPPER?"
- **f056** `grove`/`oak`, `DIG`: the elder (`kind`), the three, at f053's four spots. Her "When I was a kit, a badger
  wintered in these woods. Grumpy. Never bothered a cat that didn’t bother her." and "Look all you like. Now, if you’ll
  excuse me, my den is calling. It says, ‘NAP.’" (two balloons: two paragraphs).
- **f057** the same, no elder (she has gone: she never sees the marks), Tallyheart `walk` facing left toward the bridge:
  caption "Tallyheart heads back to wait at the bridge."; her "Your patrol, warrior."
- **f058** `grove`/`dig`, `LEAVES`: our cat `sit` (facing left, toward the doorway) at `door-1`, Chispapaw at `door-2`, the
  apprentice peeking at `dig-fern` (on every path: section 7, item 4). One caption by `specialty` (split from f057:
  narration after her balloon): (`noticing`) "You take one last look, and spot it: a smaller doorway, right beside the big
  dig."; (`friends`) "The shy GroveClan apprentice peeks out of a fern, and points:" / "a smaller doorway, right beside
  the dig." (102 characters in one sentence: the one caption split at a colon, the words unchanged); (`climbing`) "From the oak’s low branch, you see it: a smaller doorway, right beside the big dig."; (`sneaking`)
  "You creep up to the dig without a sound. From a smaller doorway beside it comes a tiny snore."; (`swimming`) "Then you
  hear it. Something is snoring, in a little doorway under the leaves beside the dig."; **Choose** "“Look closer.”" (f059)
  / "“Home before sunset.”" (f065).

**The groundhog** (optional; `grove`/`dig`, `LEAVES`, the groundhog at `doorway`, our cat at `door-1`, Chispapaw at
`door-2`; no apprentice)
- **f059**: the groundhog `doze` (listed first, for the `motion` effect: "It shivers"); our cat `crouch` (`wonder`),
  Chispapaw `crouch` (`worried`). Captions "You pad closer. In the little doorway, half under the leaves, lies something
  round and brown." / "Something BIG. It shivers. Its bottom is sticking out in the cold."; Chispapaw's whisper "Was THAT
  the badger?"; the Hello Tap.
- **f060**: the groundhog `wake` (`stern`). Caption "The round brown thing opens one eye. Then the other. Then its whole
  grumpy face."; its balloon (`name: 'The round brown thing'`) "I was ASLEEP. I sleep ALL frost-time. It’s my JOB."
- **f061**: the groundhog `sit` (`shout`), Chispapaw `sit` (`wonder`). Chispapaw's "What ARE you?"; its "What do I LOOK
  like? A BADGER?" (shout, `name`); hers "…⁠I don’t know what a badger looks like."; its "Neither do I." (`name`).
- **f062**: the groundhog `sit` (`sniff`): its balloon (`name`) "Not a badger. GROUNDHOG. Something BIGGER dug past my
  bedroom. Sniffing. All. Night."
- **f063**: the groundhog `yawn` (`sleepy`): caption "It yawns an enormous yawn."; its "Now I’ll NEVER get back to sleep.
  Unless…" (no `name`: "The groundhog" from here); `counts: { set: 'ch13-lullaby', intro: false, next: 'f064' }` (its
  whispered prompt is the Count's page).
- **f064**: the groundhog `sleep` (`happy`), `zzz`; our cat `crouch` with `tap: 'paw'`, Chispapaw `sit` (`kind`). Caption
  "At your ceremony, you promised to look after every friend who needs you. Even the grumpy ones."; Chispapaw's whisper
  "Sleep tight. All frost-time."; the tuck Tap; **`sets: { foundGroundhog: true }`** on the frame. → f065.

**The marks** (every path; `grove`/`dig` with our cat at `marks-1` and Chispapaw at `marks-2`, facing the marks; nobody
else: only she and Chispapaw ever see them)
- **f065** `LEAVES` with `tap: 'leaves'`: our cat `sit`, Chispapaw `sit`. Caption "On the way out, something catches your
  eye, on the far side of the dig, half under the leaves."; the brush Tap. (The doorway is drawn as on f058, half under
  leaves, empty-looking, on both paths: section 7, item 4.)
- **f066** `BARE`: our cat `crouch` (`wonder`), Chispapaw `crouch` (`wonder`). Captions "Scratched in the earth: one long
  line. And eight little pokes, small and neat." / "They’re not like the dig’s big scratches. These lie all by
  themselves, on the flat earth."
- **f067** `BARE`: Chispapaw `sit` (`worried`): her whisper "Claw marks?"
- **f068** `grove`/`marks`, `merge(BARE, { tap: 'marks' })`, no cast (the close-up): caption "She isn’t sure. You aren’t
  sure either." (split from f067); Tallyheart's call, off the panel (`name: 'Tallyheart'`, shout), "Home, you two! Before
  sunset!"; the look Tap (the close-up the story's Tap note gives is this frame's picture: section 7, item 4).

**Home at sunset** (the camp, `sunset`; the pile off the picture)
- **f069** `camp`/`reveal`: Glintstar `sit` at `fountain-foot`, our cat, Chispapaw, Tallyheart. Captions "The sun is low
  when you get home." / "You tell Glintstar the elder’s guess: a badger, digging for worms." (split at its sentence).
- **f070** `camp`/`crowd`: the old tom `sit` (`shout`) and the grey tom `sit` (`wonder`) at the right, our cat and
  Chispapaw coming up. Captions "The afternoon’s hunters bring more down to the store." / "By the pile, the old tom tells
  the grey tom a story." (the story's screen split in two panels at its sentences: four boxes in one would leave Glintstar
  and the old tom in one picture).
- **f071** the same, the old tom `shout`: his "A badger SAT on my whole patrol once! Flat as leaves!" and "There we were,
  minding our own business. Then… *WHUMP!*" (shout); the grey tom's "Were you scared?"; the old tom's "I was FLAT."; the
  flop Tap.
- **f072** the same, our cat `flat`, Chispapaw `flat` (the Tap's response): her "THIS flat?"; his "FLATTER."
- **f073** the same, our cat `sit`, Chispapaw `sit`, the old tom `stern`: caption "You tell him about the marks: one long
  line, eight little pokes."; his "Claw marks. Mark my words."
- **f074** the same, our cat `sit` (`wonder`): caption "In your book, a new page opens: “What is a badger LIKE?”" (split
  from f073: narration after his balloon; with f072 and f073 the "THIS flat?" screen's four beats get a panel each, the
  heart critic's round-1 low, which the text could not take without a fourth quiet screen).

**Bedtime** (`night`, no moon)
- **f075** `camp`/`reveal`, `night`, `stars`: the camp asleep, two Clan cats curled at their dens. Caption "The stars come
  out over camp, sharp and bright with cold." (If the camp under stars alone reads too dark, the sets owner says so and
  this frame is `sky`/`up` with `night` and `stars`.)
- **f076** `den`/`nest`, `DENW13`, `night`: our cat `loaf` at `nest`, {Murmur}chime `lie` at `next-nest`. Captions "Your
  warrior’s nest is soft and deep, beside {Murmur}chime’s." / "Your mist stone is grey on the moss." / one by `ch2Stone`:
  (`nose`) "Riffle’s stone is by your nose."; (`chin`) "Riffle’s stone is under your chin." (the story's screen split from
  f075 so the stars and the nest each have a picture).
- **f077** the same, {Murmur}chime `sleepy`: her "Three mice this morning. Not that I’m counting."
- **f078** `den`/`inside`, `DEN_COLLAR`, `night`: Chispapaw `crouch` in her nest at `nest`, the collar beside her, the grey
  tom `curl` `asleep` at `sleeper-1`. Caption "Across camp, Chispapaw’s collar lies beside her nest. Not one *ting*."; by
  `when`: (`show`) caption "In her nest, she crouches one more time." and her "Belly low. Tail out. Like THIS."; (`try`)
  caption "In her nest, she tries the crouch one more time." and her "Lower… lower… GOT it."; (`words`) caption "In her
  nest, she crouches one more time." and her whisper "The crouch… feeds… you…". Exactly one pair shows (three boxes).
- **f079** `den`/`nest`, `DENW13`: our cat `sit` with `tailUp: true` at `nest`, {Murmur}chime `lie`. Chispapaw's call from
  across the camp, off the panel (`name: 'Chispapaw'`, shout), "Goodnight, MENTOR!"; the wave Tap (split from f078: our
  cat's tail is the Tap, and she is in her own nest).
- **f080** `den`/`inside`, `DEN_COLLAR`: Chispapaw `curl` at `nest` (awake, `happy`), the grey tom `curl` (`sleepy`). Her
  "I caught a leaf today. A BIG one."; his whisper "If a badger sits on me, wake me up." **(The story's screen drawn as two
  frames, the verify round's low: the apprentices' den, then her nest.)**
- **f081** `den`/`nest`, `DENW13`: our cat `loaf` at `nest`, {Murmur}chime `lie` `asleep`, Tallyheart `walk` past at the
  close-up's edge (chapter 12's raw spot, touching nobody). Her "Goodnight." and her whisper "Mentor." (two balloons: "Then,
  softly"). Her "Mentor." never sits in the apprentices' den beside Chispapaw's "MENTOR!".
- **f082** the same, no Tallyheart, our cat `loaf` (`dreamy`): captions "You close your eyes, and there they are again.
  One long line. Eight little pokes." / "Where have you seen that before? You KNOW you have."; the curl Tap. Never answered.

**Chapter end**
- **f083** `den`/`nest`, `DENW13`, `night`, `zzz`, `sparkle`: our cat `curl` `asleep`, {Murmur}chime `lie` `asleep`. Caption
  "What did {name}{ending} dream, on the night of the first frost?"; `input: { kind: 'dream', placeholder: 'Frost… a
  crouch… a long line…', next: 'f084' }`.
- **f084** `den`/`inside`, `DEN_COLLAR`, `night`, the `motion` effect: Chispapaw `curl` `asleep` with `tailUp: true` at
  `nest` (listed first, for the motion), the collar beside her, the grey tom asleep at `sleeper-1`. Captions
  "{name}{ending} sleeps." / "Across the camp, Chispapaw’s tail twitches in her sleep. Straight up." / "End of Chapter
  Thirteen."; `end: true`.

### The book (the story builder's; proposed here)

```js
book: {
  title: '{name}{ending}’s First Frost-Time', chapterTitle: 'The Hunter’s Crouch',
  store: 178,   // book two: the store drawn under the recap (one square, seven rows, eight loose); never said on screen
  dream: '{name}{ending}’s dream: “{dream}”',
  noDream: '{name}{ending}’s dream, the night of the first frost, stayed a secret.',
  recap: [
    { text: 'On the morning of the first frost, {name}{ending} walked {their} first dawn patrol as a warrior, with Tallyheart and {Murmur}chime.' },
    { text: 'At the Crossing, Granny had news of a fresh badger print on GroveClan’s side, and the ferry otters had heard it was as big as a FOX.' },
    { text: 'In the frosty ferns, {name}{ending} taught Chispapaw the hunter’s crouch: she caught a leaf, a mouse heard her bell, and she left her collar safe by her nest.' },
    { text: 'In the Training Hollow, Tallyheart taught them both what to do when there aren’t enough loose ones: spread a row, ten more loose.' },
    { text: 'At noon, twenty-seven pieces went down to the store, and twenty-five stayed for the Clan.' },
    { text: 'On a courtesy patrol to GroveClan, the elder showed them a big dig by the old oak: a badger, digging for worms, she said.' },
    { when: { foundGroundhog: true }, text: 'Beside the dig, {name}{ending} woke a grumpy groundhog, finished its sleepy seven times eight, and tucked the leaves back over it.' },
    { text: 'And half under the leaves, scratched in the earth, {name}{ending} found one long line and eight little pokes.' }
  ],
  // the badger page opens (module-2's table; rows in the order first heard or seen; row names fixed for chapters 14 to 21)
  badger: [
    { row: 'size', say: { text: 'As big as a FOX!', who: 'the ferry otters' } },
    { row: 'mice', saw: { text: 'A big dig, turned earth, no fur or feathers: it digs for worms.' } },
    { row: 'sat', say: { text: 'A badger SAT on my whole patrol!', who: 'the old tom' } },
    { row: 'marks', say: { text: 'Those scratches are claw marks.', who: 'the old tom' } }
  ],
  // the first of the seven sleepers' pages (E.sleepers): without foundGroundhog no sleepers page at all (null); with it,
  // the groundhog's page (its `sleep` pose, by PC.art.vocab.cast) and six plain silhouettes
  sleeper: { id: 'groundhog', name: 'The groundhog', when: { foundGroundhog: true },
    lines: ['Asleep in a little doorway beside the big dig in GroveClan’s woods. It sleeps ALL frost-time. It’s its JOB.',
            '“Not a badger. GROUNDHOG. Something BIGGER dug past my bedroom. Sniffing. All. Night.”'] }
}
```

- Seven recap lines on every reading, eight with the groundhog, each true on every path (the twenty-five whether 52 − 27
  was helped or not; "taught Chispapaw the hunter's crouch" for all three `teach`); English only (chapter 12's call 22);
  no line says what the store holds, or who made the marks, or calls them a count. The volume's title is chapter 12's
  (book two takes it from the module's first chapter); `title` here keeps the chapter-end page's title right.
- **The badger page's row names** (`size`, `mice`, `sat`, `marks`) are the module's from now on: chapter 14's "As big as
  a DOG." joins `size`; chapter 16's "It ate EIGHT HUNDRED ELEVEN mice!" joins `mice` (and shows crossed at once, by this
  chapter's sighting, as module-2's table means) and "They're a COUNT." crosses `marks`; chapter 17's "As big as three
  cats. And grumpy." crosses `size`; chapter 18 crosses `sat`. `mice` shows this chapter's sighting with no rumour beside
  it (the engine marks the row `crossed`, with nothing to strike).
- The sleeper page, **as the kit draws it** (run, critic-kit-r1's `probe2.txt`): for a cat without `foundGroundhog`,
  `E.sleepers` returns null, so there is no sleepers page and no silhouettes at all; after the find, the groundhog's page
  ("Draw the groundhog here" under it, the page's own words, from `name`) and six plain silhouettes, "Six more, still
  sleeping." beside it. A silhouette for a missed sleeper would be an engine need, not this chapter's data.

### The teaser (proposed)

`teaser: { title: 'Chapter 14: The Night Watch', lines: ['More holes, and a watch to keep. Who will stay awake?'] }`: the
story's own line, module-2's title for chapter 14, saying no more than its entry (holes, a watch, no shape). With chapter
13 built, chapter 12's teaser is `built: true, next: 'ch13'` (section 10).

### Tests the story builder adds (`tests/story-ch13.test.js`)

As chapter 12's, and: every frame renders with the art's vocabulary (`groundhog` and its five poses; the camp's `frost`
both values and `ferns-1`, `ferns-2`; the hollow's `spreadMarks`; the den's `collar`; the grove's `dig` on `oak`, the
`dig` and `marks` cameras, their spots, `marks` and `tap`; `curl` with `tailUp`) and every Tap's target is in its
picture; every speaker in the cast but f068's and f079's calls (both named, so no face; and f035's whisper only if
section 4's fallback moved f035 to `sand`); **the balloons' faces**: f012's three otter balloons from otter 2, otter 1,
otter 2 and f013's from otter 2 (no Granny in either cast), the elder listed before the apprentice on f050 to f052b, the
first cast member of every `motion` and `bonk` frame the one the story moves (f009 Riffle; f016, f017, f021, f045, f084
Chispapaw; f059 the groundhog), every pose in its cast's vocabulary (f014's Riffle `hop`), `plane: 'none'` on every
crossing frame, `frost: 'prints'` on f007 only; **the grown-ups corner**: `UI.flagWords.teach` and
`UI.flagWords.foundGroundhog` exactly as section 1 (this file pins them, as `story-ch11.test.js` pinned `ch11Named`; the
cats owner writes them); **the flags**: for every `teach` (three), f019 shows exactly one caption-and-balloon pair and
f078 exactly one; for every `specialty` (five and none) × `ch2Stone` (two and none): f010 shows the steam caption only
for a swimmer, f058 at most one specialty caption, f076 at most one stone caption; f064 sets `foundGroundhog` and no
choice sets it; "Home before sunset." reaches f065 without f059 to f064; the option frames meet (f052a, f052b → f053);
**Chispapaw's collar**: on f005 to f026 she has no `collar` key, on f027 to f084 `collar: false`, and the den's `collar:
true` on f027, f078, f080, f084 only; **the Spanish**, by structure, not literal Spanish (so a class word changed in
`words.js` is one line, decision 53, and the literal Spanish lives only in `tests/spanish.test.js`): every `lang: 'es'`
balloon is f033's, f035's or f040's, its text tokens and punctuation only: f033 `'{Es:noAlcanza}'`, f035
`'{Es:desagrupo}'` (`kind: 'whisper'`), f040 `'¡{Es:25}!'` (`kind: 'whisper'`); for a words key, `E.esLine(text)` is
`'«' + PC.words.es[key].es + '»\n(' + PC.words.es[key].en + ')'`, for f040 the same made from `E.esNumber(25)` and
`E.numberWords(25)`, each capitalised, inside ¡ and !; f030's text is `'{Es:resta} THAT’S …'`, its filled text opening
`'«' + PC.words.es.resta.es + '»'` (never «¡la resta!»), and `E.esEnglish(PC.words.es.resta.es)` is
`PC.words.es.resta.en` (so with no Spanish voice Read to me says "Take-aways! THAT’S …"); no «» in the file; **the
words**: `PC.words.spread === 'spread'` and `PC.words.Spread === 'Spread'`, its message naming f034 and f037; **the
Counts claims of section 2, pinned**: `E.countSets(STORIES)` is chapter 10's ten; `E.checkStory` and `E.checkTakes`
clean, and clean without 486 − 253; the lesson as section 2 plays it (the worked example's show steps, the school words
before its tens line, its right line; 70 − 34's tap lines; a helped 43 − 16's twin `'tap'` with no `prompt` and no
`right`; 85 − 39's and 97 − 52's full lines and 486 − 253's names alone under rule (b); the echo after 85 − 39 right and
helped, never after its twin; the lesson's `state.avoid` is the chapter's take answers, 27, 36, 46, 45, 233, 25, so no
twin lands on one); **no square talk**: 486 − 253's hundreds typed 1 opens "Let’s scratch it out." and is logged slip
`fact` in the take log (by rule (a); `extra` only under `LINES13`); 97 − 52's tens typed 3 is the kit's tens `extra`
line; **the marks page**: `E.takeMarksPage(def, cat)` gives `ch13-take`'s four lines and two after-lines, `E.checkTakes`
clean; picking writes `cat.takes.style` and no flag; 43 − 16's show asks 3, then 13 (or 1), then 7; 70 − 34's
`tap.onesZero` and both asks; 97 − 52's 9 tapped and 8 typed logged `{ col: 0, move: 'touch', slip: 'extra' }`; the
warm-up over every one-pick and two-pick case (no pair twice, never 3 × 4 or 6 × 8, every question a numeric `table`
whose first line is `E.genericQuestion` of `E.hollowDef(STORIES, q.table)`), its echo on the first right answer only,
"¡Nueve por siete, sesenta y tres!" for 9 × 7; 52 − 27 answered 5 first, then its moves: `ahead` in its flip form, the
entry `{ correct: false, helped: false, ahead: [0] }`, Glintstar's right line; its 3 at the tens `kept`, no twin;
6 × 8's and 7 × 8's right lines on a retry (`rightAgain`); the lullaby's prompt the groundhog's "Seven… times… eight…"
and f063's balloon ending "Unless…"; captions at most 95 characters and no panel with five boxes; 78 frames on a plain
reading, 84 with the groundhog; the book's lines (seven, eight with `foundGroundhog`), `store: 178`, the badger rows and
names, the sleeper, `module: 2`; **the sleepers page as the kit draws it**: `E.buildFullBook(cat, stories, 2).sleepers`
null without `foundGroundhog`, and with it the groundhog found (its page drawing `PC.art.character('groundhog', { pose:
'sleep' })`) and six plain silhouettes still to find; the teaser; a tom reads every line with he and him; no "borrow",
"carry", "regroup", "StarClan", "Twoleg", "kittypet", "fresh-kill", "Thunderpath", "vigil", "warriors’ den",
"whisker-length", "claw-length"; no line calls the marks a dot, a number or a count; no badger in any cast.

## 6. Engine needs

**One, the kit's: decision 57's v0.4 (the moves and the marks page), merged before the frames; then none, on a tree that
passes the four checks below.** No new interaction, no new key, no save change (version 2; `teach` and `foundGroundhog`
are flags). The chapter is data, art and words: three words-table lines, two flags, six sets, the book's keys, the art
above. Spanish asked as a question is chapter 14's (the sleepers' Spanish asks), not this chapter's. Each check names
the one engine line the cats owner adds, with its test, only if that check fails.

**Four checks before the build** (the orchestrator's, on main once the kit, book two and chapter 12 are in):
1. **The kit's rules as merged** (rules (a) and (b), and the twins' `avoid`, are in the integrator's working copy as of
   2026-11-07: critic-spec-counts' `take13.txt`, critic-kit-r1's `probe-now.txt`). **(a)**, in three parts: play
   `E.takeLesson(cat, ch13, 'ch13-take')` with `T.digit`, typing 1 at 486 − 253's hundreds: the slip is `'fact'` and the
   help's intro is "Let’s scratch it out."; `E.takeSlip(E.takePlan(486, 253), 2, 1, false, ['none', 'ones2']) ===
   'fact'`; and `E.takeRoundStart(cat13).state.taught` deep-equals `E.takeSteps(cat13)` for a cat that has finished
   chapter 13. (Never read `E.takeHelp` alone: called directly with `'extra'` it still says "no square went", and the rule
   lives in the slip.) If `taught` is absent, `ch13-take` carries `lines: LINES13` (section 2) **and Count the store's
   rounds need the same until `tens` is learned**: chapter 12's `E.takeRoundStart` gives a round chapter 12's
   `lines.extra` only while `none` is the only step (its spec, section 6), so after chapter 13 a round's hundreds would
   say "no square went" (the maths critic's round-2 medium): the one engine line chapter 13 would then need (that
   condition read as "while `tens` is not learned", with a `hundreds`-only override once `ones2` is, both forms given), the
   cats owner's, with a test. With `taught` present, neither LINES13 nor that line. **(b)** `T.question`'s `full` counts
   only `'hers'` problems: 85 − 39 hears "Ones first. Five take away nine.". If not, the lesson still plays; 85 − 39 hears
   "Ones first." only (accepted, section 7, item 12). **(c)** the lesson's `state.avoid` is the chapter's take answers
   (section 7, item 6); if not, item 6's old wording holds (a twin may land on 25: accepted).
2. **Chapter 12's Spanish on chapter 13's three words: a confirmation.** The table holds each word as lettered (section 5),
   so chapter 12's `E.esEnglish`, which matches a words-table `es` with case kept, finds all three:
   `E.fill('{Es:resta} THAT’S …')` letters "«¡La resta!» THAT’S …"; `E.esEnglish('¡La resta!') === 'Take-aways!'`,
   `E.esEnglish('¡No alcanza!') === 'Not enough!'`, `E.esEnglish('¡Desagrupo!') === 'Breaking it into groups!'`;
   `E.esLine('{Es:desagrupo}')` is "«¡Desagrupo!»\n(Breaking it into groups!)". `{Es:…}` on a value that already opens
   "¡L", "¡N" or "¡D" is a no-op. Checked in Node with `E.speechParts`, and on the page with both voice lists, never
   aloud: `VOICES=none DRY=1 node tools/shots.mjs OUT ch13:f030 ch13:f033 ch13:f035 ch13:f040` and the same with
   `VOICES=es` (chapter 12's silent stub defaults to `VOICES=none`, so `DRY=1` alone checks only the no-voice path).
   f030's no-voice row reads "Take-aways! THAT’S …", and no row pairs Spanish text with an English voice. No engine line:
   if it fails, chapter 12's build departed from its spec, and the fix is chapter 12's, not this chapter's.
3. **The school words** (chapter 12's `E.takeLine` change, not the kit's: the kit defines `schoolWords` and never says
   it). On main after chapter 12, `E.takeLine` for 43 − 16's tens, in `'show'`, on a `teach: 'ones2'` set, begins "A row
   is a ten. A square is a hundred." If not (on the kit alone it is "Now the tens. Three take away one."), the cats owner
   adds that one `E.takeLine` condition, with its test.
4. **The kit v0.4 merged** (decision 57; `~/potomac-crossing-work/regroup/plan.md`): `E.takeMoves`, `T.touch`,
   `E.takeMarksPage` exist; `E.takeLesson(cat, ch13, 'ch13-take')` has `taught` `['none', 'ones2']`, shows the marks
   page before 43 − 16's prompt for a cat with no `takes.style`, and its show steps ask 3 and 13; `E.checkTakes` clean
   with `marks`. If it is not merged the frames wait: decision 57 supersedes v0.3's `'hers'`.

`E.VERSION` `'0.13.0 (chapter 13, <ship date>)'` and its pin are the orchestrator's, at the ship.

## 7. Known issues the text critics left

Checked against Draft v0.4. The text took two critique rounds (v0.2, v0.3) and a verify round (v0.4). Every low in
`critique-known.json` (rounds 1 and 2) and `critique-verify.json` is applied in v0.4 or is a spec item here; the editors'
"For the spec" lists (`editor-r1`, `editor-r2`, `editor-r3/notes.md`, r3's superseding the earlier two) are all carried.
What is still true of v0.4, and how the build handles it:

1. **The story is final at Draft v0.4**, but for decision 55's one line (v0.5, queued in `after-spec.md`: Chispapaw's
   whispered «¡Desagrupo!» on f035, with the *For us* block's Spanish list). No other word of it changes.
2. **The story's notes this spec supersedes or settles** (she reads none of them):
   - *«¡La resta!»* is built `'{Es:resta} THAT’S what take-aways are! My little Tall One’s homework this frost-time!'`
     with the table entry `resta: { es: '¡La resta!', en: 'Take-aways!' }` (v0.4's line as lettered; editor-r1's item 4,
     "'¡{Es:resta}! Take-aways! …'", is superseded, as the verify round found; the leftover-lows' `'la resta'` entry under
     `'¡{Es:resta}!'` is superseded too, since chapter 12's `E.esEnglish` matches a table `es` with case kept and would
     find nothing for "¡La resta!", leaving Read to me with no Spanish voice silent on the word: the Spanish spec
     critic's finding).
   - *"its twin, if any, is `'tap'` (the kit's rule): no prompt, no right line"* (43 − 16): run so; never set to `'hers'`.
   - *"(the set's `lines`: `extra` with both forms …)"*: only if the merged kit lacks rule (a) (section 6).
   - *"its prompt the groundhog's balloon, "Seven… times… eight…", lettered only there"*: the set's prompt; f063's balloon
     ends at "Unless…".
   - *"the fifty-two is a frame balloon of Glintstar's before Let's count"*: f039.
   - *"the kit's "A row is a ten. A square is a hundred." comes here, once, before its tens line"*: chapter 12's
     `E.takeLine` for `teach: 'ones2'`, inherited.
   - *"Chispapaw says the first right answer in Spanish … written out here for 9 × 7"*: whatever her first right answer
     is, in the order asked; 9 × 7 only when it comes first.
3. **Chapters 1 to 12, the Warrior Counts and the kit's pages draw and read byte for byte** for every live save: every new
   option is off by default (`frost`, `spreadMarks`, `collar`, `dig`, `marks`, `tap`), the `dig` composition and its two
   cameras and the camp's two spots are new names, `groundhog` is a new id, `curl` with `tailUp` and the quick marks'
   `crossed` and `fresh` were drawn by no frame before. **The proof**: the existing fingerprints and goldens; the sets
   owner's **`<ch13-fingerprint>`**, recorded from a snapshot of main before any edit, in a process of its own: every frame
   of chapter 12, every `camp` camera with `frost` off, every `hollow` camera with `spreadMarks` off, every `den` camera
   with `collar` off, every `grove` camera of chapters 9 and 10; the cats owner's fingerprints of every existing cast member
   and of every existing `quickMarks` call untouched.
4. **Can't be built literally, built nearly**: "Your breath makes little clouds" and "Steam curls off the river" (said, not
   drawn); "frost on her whiskers" (a speech tag, not drawn); "A frosty leaf skitters past" (the leaf drawn only once
   caught, f022); "The ferns twitch. A tail tip flicks." (no mouse drawn at all, not even its tail: the brief's "never drawn
   whole", kept to nothing); "her bell rings twice" (no sfx: the story letters none there); "crunch!", "your cloud floats
   up", "you catch the pebble and toss it back", "a little hollow in the moss … and the page turns", "your cloud floats up
   and away", "nose to tail" (the Taps turn the page; the next picture shows what it can: the collar in its hollow on
   f027's own picture, the flop on f072, three sitting cats on f050); "From the oak's low branch" (a climber's caption;
   our cat stays on the ground, chapter 12's hedge-top precedent); "The shy GroveClan apprentice … points" (he peeks from
   his fern on f058 for every cat, never pointing in the art); "Tallyheart heads back" (walking off, f057); "the leaves
   settle over the little doorway" (the page turns; the doorway is half under leaves on f065 on both paths, so the
   frames after the scene are shared); "the long line and the eight little pokes, close up" (the Tap's frame, f068, is the
   close-up itself, its Tap the look; the response the story gives after the tap is shown with it); "you wave your tail,
   she waves hers" (our tail only: she is across the camp); "By the pile" and "crowds round the pile" (the pile off the
   picture: section 4); "The afternoon's hunters bring more down to the store" (said: the store is under the Old Bridge);
   "Glintstar leaps onto the fountain" (`stand` on its top); "three cats' pawprints" (three trails of many prints, never
   twelve).
5. **The Count's picture for 6 × 8 is prey in piles** (`preyPicture`'s stacks), not rows: a row means ten. Kept.
6. **With the kit's merged `avoid`, no lesson twin takes a take answer of the chapter** (`E.takeLesson` passes `avoid:
   chapterAnswers(story)`, here 27, 36, 46, 45, 233, 25: run on the integrator's working copy, 0 of 600 twins of a helped
   43 − 16 and 0 of 600 of a helped 97 − 52 on 25; the 1.6% and 2.1% of v0.1 were 08f477a's). Twins may still land on the
   Counts' answers (12, 24, 48, 56, 63, 64 …: 70 − 34's twin 90 − 34 = 56 came up), harmless. The story test pins
   `state.avoid`. If the merged kit lacks the `avoid` (section 6, check 1 (c)), a twin may land on the pile's 25, asked in
   the Hollow before noon: accepted (chapter 12's item 15).
7. **The warm-up's echo needs a right answer** (chapter 12's item 7): a cat who misses all three and every retry hears
   none. Kept.
8. **A re-sit waiting over the take lesson** (chapter 12's item 10): every take frame takes `intro: false`; the rest is
   the kit's.
9. **The pile's ones-first pointer is off** (her twelfth take-away or later, and `teach: 'none'` cannot mark a problem
   that spreads): a 2 typed first at the ones is a `fact` slip, and its help takes Glintstar's "Twenty-five for the Clan.";
   f040's whisper still says the number. Kept.
10. **The lullaby's right lines need a right answer** (`rightAgain` covers a retry): a cat helped twice hears no "Fifty…
    six… thank you…"; f064 draws it asleep and the scene ends as written.
11. **"Those scratches are claw marks."** on the badger page (the brief's words, module-2's table): "scratches" could be
    read as the dig's five long scratches. The page is hers to read later, the old tom's guess is about the line and the
    pokes ("You tell him about the marks"), and chapter 16 answers it. Kept.
12. **If the merged kit lacks rule (b)**, 85 − 39, her first spread on her own, hears only "Ones first." / "Now the tens."
    (the maths critic's round-3 low; chapters 14 to 19 have the same order). The integrator is making the rule; nothing in
    chapter 13's data changes either way.
13. **Frames: 78 plain, 84 with the groundhog**, against the story's estimate of 63 to 73 (70 to 82): the captions-first
    splits, the title panel, the option frames, the verify round's two bedtime frames and f070's and f075's picture
    splits. Under the brief's 125.
14. **Aron's one fact: answered by decision 55** (2026-11-07): "me llevo una" is not hers, so the kit's method and lines
    and the spread and cookie screens (f032 to f036) stand, and her word «desagrupo» comes at the first spread (f035).
    **Answered by decision 57**: she chooses how a spread is marked (the kit's marks page, this chapter's worked
    example); still open, not blocking: whether it heads the columns C D U; module-2 says either is one CSS rule and the
    heads, not words-table work, so the build does not wait on it.
15. **If decision 54 is reversed** (Tallyheart takes Chispapaw), the screens that change are f016 to f027 (the crouch
    taught by her mentor, the collar), `teach` and its two readers (f019, f078) and chapter 21's payoffs, f079 ("Goodnight,
    MENTOR!"), f081 ("Mentor."), and the recap's third line.
16. **70 − 34's tap line over an empty loose zone** says "Not enough loose. Spread a row: tap it.": the kit's
    `E.TAKE_LINES.tap` has no Zero form, though `showOpen` and `showSpread` have one ("No loose. Not enough."). Kit data,
    the integrator's: `tap.onesZero: 'No {loose}. {Spread} a {row}: tap it.'` and `tap.tensZero` (the kit's test 13 fills
    every line); the orchestrator asks for it. Never a set's `lines.tap` here, which would replace the whole key and need
    every form. If the kit does not take it: accepted, polish ("not enough loose" is still true of none). **Closed by
    the kit v0.4** (`tap.onesZero` and `tensZero`): 70 − 34 says "No loose. Spread a row: tap it."

## 8. What chapter 14 inherits

- **When.** Chapter 13 is day 2, the first frost. First light (frost on every fern, crunchy), the dawn patrol to the
  Crossing, the crouch in the frosty ferns, the lesson late in the morning, noon at the pile, GroveClan in the afternoon
  (the frost gone), home at sunset, bedtime under the stars with **no moon risen and none drawn** (it rises later each night
  now; chapter 14 draws its night's moon by module-2's clock: day 13 the new moon, day 27 full).
- **The store.** 133 (day 1) + 27 at noon + the afternoon's hunters, unnumbered on screen; **178 in her book only**
  (`book.store`, module-2's bracketed day 2). No line has said what it holds.
- **Chispapaw.** `collar: false` from now on: her collar and bell lie in a little hollow beside her nest in the apprentices'
  den (`den`, `collar: true` on `inside`), kept safe ("My Tall Ones gave me this."). No catch yet (her first mouse is
  chapter 21's); she caught a leaf, and "Mice have ears." `teach` says how she was taught the crouch (chapter 21 pays it).
  Her little Tall One's homework this frost-time is «la resta», and she plans to sit on it "To HELP"; "¡No alcanza!" is what
  her little Tall One says over it, and «¡Desagrupo!» (Lissa's word, decision 55) is what she whispered as the row
  spread. Spanish whispered before the Clan and at the first spread, aloud in the Hollow otherwise. New to spreading too;
  never corrects her.
- **The maths.** `ones2` learned (`E.takeSteps`: `none`, `ones2`): spread a row, two digits; Count the store's rounds take
  it. The school words said on the worked example (second time). The quick marks spread: a crossed line and a framed ten
  (`crossed`, `fresh`), in the sand. Counts: none new; the warm-up across the 54 pairs has run twice (`avoid` and `alt` by
  each chapter's own Counts; here `avoid` 3 × 4 and 6 × 8, never the optional lullaby's 7 × 8). Till chapter 15 no
  hundreds line speaks of spreading a square (rule (a): a lesson's `taught`, a round's `E.takeSteps`; only on a kit
  without it do chapter 14's sets and the store's rounds carry the override: section 6). A slip at a hundreds column that
  spreads a square she has not learned is logged `fact`. Chapter 14's lesson (352 − 127 …) has hundreds that can be
  `extra`. The take answers of a chapter are its lesson twins' `avoid` (the kit's).
- **Her marks and the moves** (decision 57, the kit v0.4): `cat.takes.style` from this chapter's marks page; every
  spread made as moves; a `'tap'` problem asks no numbers for a row's link from chapter 14 on (the row's link is this
  chapter's).
- **Spanish.** `PC.words.es` gains `resta` ('¡La resta!', Take-aways!: the table holds the form as lettered, so a later
  chapter that letters «la resta» mid-sentence adds its own entry), `noAlcanza` ('¡No alcanza!', Not enough!) and
  `desagrupo` ('¡Desagrupo!', Breaking it into groups!). **Her word for a spread, «¡Desagrupo!», whispered once, at the
  first spread** (f035, decision 55); chapter 14 has it again, Chispapaw's word at a spread now that she knows it;
  «¿Hay que desagrupar?» stays chapter 17's. No Count asked in Spanish, no column echoed, no «menos». The two fixed
  English "spread" lines (f034, f037) are pinned by the story test; decision 55 keeps the English "spread a row".
- **The badger.** Granny saw a fresh print on GroveClan's side of the little channel (from the ferry); the ferry otters
  heard "As big as a FOX"; a big dig by GroveClan's old oak (earth thrown back, five long scratches, no fur or feathers):
  "Badger. Digging for worms, I'd say." (the elder, who knew one as a kit: "Grumpy. Never bothered a cat that didn't bother
  her."). Glintstar has the elder's guess. The old tom's tale ("A badger SAT on my whole patrol once! Flat as leaves!"; its
  truth is chapter 18's) and his "Claw marks. Mark my words.". **Her book's badger page is open**, rows `size`, `mice`,
  `sat`, `marks` (section 5): later chapters add to these rows by name.
- **The marks.** Beyond the dig, on flat earth, half under the leaves: **one long line and eight little pokes**, the kit's
  quick picture on earth (`kit.quick`, `{ tens: 1, ones: 8, ground: 'earth' }`). **Seen only by her and Chispapaw** (never
  by Tallyheart, the elder or the apprentice), **told only to the old tom** (the grey tom heard), never to Tallyheart.
  Never called a dot, a number or a count; nobody has read them. She thinks she has seen them before (never answered).
- **The groundhog** (`foundGroundhog`): asleep in its doorway beside the dig, its leaves tucked back; "Something BIGGER dug
  past my bedroom. Sniffing. All. Night." The first of the seven sleepers' pages (`book.sleeper` id `groundhog`); six
  silhouettes left. Chapter 20 may offer it once more to a cat who missed it, with a found-here flag of its own (as
  chapter 10's `ch10Puddle`), and chapter 13's recap line then reads `{ foundGroundhog: true }` with that flag's `not`.
- **Who is where.** She asleep in her warrior's nest beside {Murmur}chime's (the mist stone grey on the moss, Riffle's
  stone where she put it); Chispapaw and the grey tom in the apprentices' den ("If a badger sits on me, wake me up.");
  Tallyheart called her "Mentor." Riffle juggles anywhere but under the Old Bridge. The GroveClan elder remembers "the
  polite one".
- **Drawn now** (copy into continuity's places table at ship): the camp's `frost` (and `'prints'`), spots `ferns-1` and
  `ferns-2`; the hollow's `spreadMarks`; the den's `collar`; the grove's `dig` on `oak`, the `dig` composition with
  cameras `dig` and `marks`, spots `door-1`, `door-2`, `doorway`, `dig-front`, `marks-1`, `marks-2`, `dig-elder`,
  `dig-fern`, covers at `doorway` (`cover-leaves`) and `dig-fern` (`cover-fern`), options `marks` and `tap` (and `oak-near`
  on `oak`, if the sets owner had to add it); the groundhog (`doze`, `wake`, `sit`, `yawn`, `sleep`; `SIZE_BAND` against
  our cat sitting); `curl` with `tailUp`; the quick marks' `crossed` and `fresh`; `collar:
  false` on Chispapaw, first used. The Crossing and the riverbank by `morning` (or not, by the sets owner's look).
- **Words on screen now**: the first frost, the dawn patrol, a patrol of three, the hunter's crouch, a courtesy patrol,
  best manners, a dig, claw marks (a guess), "a long line" and "little pokes", groundhog, spread a row, ten more loose, not
  enough; «la resta» (lettered «¡La resta!»), "¡No alcanza!", «¡Desagrupo!» (breaking it into groups). Not used: borrow,
  carry, regroup, StarClan, Twoleg, kittypet, fresh-kill,
  Thunderpath, vigil, warriors' den, whisker-length, claw-length.
- **Standing rules, still**: chapter 12's, and: no badger on screen, not even a shadow (the groundhog is drawn as nothing
  like one); the marks are never read before chapter 16 ("They're a COUNT." is the cat's moment); nothing in the woods is
  dark; no CrystalClan cat goes into GroveClan's woods unasked.
- **Flags**: `teach` (replaced), `foundGroundhog` (sticky). Every earlier flag stands.

## 9. Calls made

1. **No engine feature, and no new interaction.** Reason: module-2's engine table (chapter 13 is data only) and the brief;
   every piece is a set, a line, an art option or a book key. The three checks of section 6 guard what the merged trees
   give, each naming the one engine line its failure would need.
2. **The kit's three pending changes are coded against, with a fallback each** (rule (a), `E.takeSlip`'s `taught`: no
   `lines` on the lesson set, the hundreds slip logged `fact`; rule (b): full lines for 85 − 39 and 97 − 52; the twins'
   `avoid`: no twin on a take answer). Reason: the integrator is making all three, and its working copy has them (the
   critics' runs); the fallbacks keep the chapter right if any is missing.
3. **Six Counts sets: three story Counts on chapters 10 and 11's shape, the warm-up on chapter 12's, the lesson, the pile.**
   Reason: every key exists; the shapes have shipped.
4. **The warm-up's `avoid` (3 × 4 and 6 × 8, never 7 × 8) and `alt`.** Reason: the maths critics' rounds 2 and 3: her
   hard picks would repeat a story Count every reader meets the same day, and a pick equal to 8 × 8 (or 4 × 6 with one
   pick) would leave a pair asked twice; run over every case. 7 × 8 is left in (the spec critic's finding): the lullaby is
   optional, so passing it over would leave a plain-path cat whose hardest is 7 × 8 meeting it nowhere today, against the
   README's difficulty call; the trade is that a groundhog reader may meet 7 × 8 twice, hours apart, which is spaced
   practice, not a repeat.
5. **The lullaby is chapter 9's sleeper set again** (acorns, twigs lit, borrowed easy eights, its help and filler lines in
   the groundhog's voice). Reason: the sleepers are module 1's dragonets' heirs; the acorns are the woods' own picture, and
   never marks, so the page never shows anything like the clue.
6. **6 × 8 is drawn as six piles of eight pieces, never rows.** Reason: module-2's amendment 1 (a row means ten), and the
   prey of a morning's hunt.
7. **`rightAgain` on 6 × 8 and 7 × 8.** Reason: the maths critic's round-1 lows; their right lines carry the scene.
8. **The fifty-two is f039's balloon; the take's prompt is Glintstar's twelve words.** Reason: the story's call 11; a
   retried 6 × 8 still hears where fifty-two comes from.
9. **The frost is the camp's option only, with `'prints'` for the dawn patrol's trails.** Reason: the brief's one budgeted
   frost; the patrol's "march across the white" is staged leaving camp (f006, f007), so no other set needs frost, and the
   breath and the river's steam stay words (module-2's fallback: "or words alone").
10. **The crouch on the camp's `ferns` camera, two new spots**, with a fallback to `crowd`. Reason: "In the frosty ferns";
    the hedge's three-in-500 precedent says it can fit.
11. **The mouse is never drawn, not even its tail tip.** Reason: the brief's "never drawn whole", kept to nothing so no
    prey art is new; "The ferns twitch. A tail tip flicks. Gone." reads on its own.
12. **No pile drawn at noon; the camp instead.** Reason: the pile set draws only countable stacks or rows, never 52; the
    take page shows 52 in the kit's picture.
13. **The spread in the sand is a hollow option (`spreadMarks`) on the kit's quick marks, which gain `crossed` and
    `fresh`.** Reason: the maths critics' rounds 1 to 3 and editor-r3's item 1: the drawn spread existed only in the help's
    sand (a whole SVG with its lit column); two keys on `quickMarks`, with `quickSand`'s meaning, keep one picture for the
    help and the lesson, as chapter 12's `round` did. No runtime fallback (nothing in scenes.js can tell the keys have
    landed); the orchestrator looks once both owners have.
14. **The collar is a den option, beside her nest.** Reason: the story's "a little hollow in the moss beside her nest",
    drawn every time the apprentices' den is (f027, f078, f080, f084); her `collar: false` is chapter 12's.
15. **The grove's dig: an option on `oak` and a new composition, `dig`, with a close camera `marks`.** Reason: the brief's
    "options on sets that exist … on the grove's oak, the dig"; the groundhog's face, the five scratches and the line and
    pokes must read at 390 × 844, which the whole oak cannot give. A composition is not a place (chapter 12's store camera
    was "a camera, no new place").
16. **The marks are the kit's quick marks on earth, `{ tens: 1, ones: 8 }`, beside the dig on the doorway's far side.**
    Reason: module-2's amendment 2 (one picture: help, lessons, clue) and the text (the marks "on the far side of the dig").
17. **The close-up of the marks is f068's own picture** (the look Tap's frame), not a wordless frame after it. Reason: no
    chapter has a frame with no words; the close-up shown as she looks one more time keeps the story's screens.
18. **The groundhog: round, brown, BIG, toothless, grumpy, nothing like a badger; five poses; labelled "The round brown
    thing" until it says GROUNDHOG.** Reason: module-2's sleeper and the brief's call 9 ("Was THAT the badger?" is one
    panel's red herring, so nothing in the drawing may keep it a badger); the story's call 9 (it never names itself early).
19. **The apprentice peeks on f058 for every cat**, and never in the marks' frames. Reason: one picture for the five
    specialties (a choice frame cannot fork by flag cheaply); only she and Chispapaw ever see the marks.
20. **Bedtime's last two screens are four frames** (f078 to f081): the apprentices' den with the collar and her crouch, her
    nest with the goodnight Tap, the den again, her nest with Tallyheart's "Mentor.". Reason: the verify round's low (two
    places on one screen) and the Tap's target (her tail, in her nest).
21. **The stars and the nest split (f075, f076); no moon drawn anywhere.** Reason: the brief's call 1; each beat gets its
    picture.
22. **`curl` with `tailUp`, for the last picture.** Reason: the story's last line is a callback to chapter 1's tail; worth
    one small cat case.
23. **The badger page's rows are named `size`, `mice`, `sat`, `marks`, in the order first heard or seen.** Reason: book
    two shows rows "in the order first seen"; the names are module-2's answers, fixed now for chapters 14 to 21.
24. **The book page proposed in eight lines (seven plain), English only, the store at 178.** Reason: chapters 10 to 12's
    shape; the brief's call 14.
25. **The grown-ups corner words both flags.** Reason: every flag a later chapter reads has corner words (chapters 9 to
    11's precedent).
26. **Two owners: cats (with the words) and sets.** Reason: section 10.
27. **Decisions 53, 54 and 55 bind it** (the maths and the Spanish friend; her own apprentice and so `teach`; her word
    for a spread). Recorded in the README with these calls.
28. **Chapter 13's only maths cut is 486 − 253.** The kit's second cut, the warm-up's third Count, would make f029's
    "First, three Counts" false, so it is not made without a story version (f029's "three" to "two") and the story test's
    count changed; it runs clean. Reason: the story is final, and the brief's cut order is the kit's.
29. **«¡Desagrupo!» on f035, Chispapaw's whisper, a words-table line.** Reason: the README's call on decision 55 ("Chispapaw
    whispers it as the row spreads, glossed with Lissa's own words"), over the brief's older "out loud in the Hollow" and
    its "desagrupar is chapter 14's" (both superseded by decision 55); f035 is the screen where the row is drawn spread. A
    frame balloon (chapter 12's feature), never the take page's `o.echo` hook, which would be engine work.
30. **`resta` stored as lettered, `'¡La resta!'` / `'Take-aways!'`, and f030 written `'{Es:resta} THAT’S …'`.** Reason:
    chapter 12's `E.esEnglish` matches a table `es` with case kept, as `galleta`, `aContar` and `noAlcanza` rely on; the
    lettering is unchanged and Read to me with no Spanish voice says the word. Data only: no engine line.
31. **`spreadMarks` gets a keep box of its own, and only f035 may move to `sand`.** Reason: chapter 12's quick box cannot
    hold two spread forty-threes countably (the kit critic's measure); `sand` shows neither Tallyheart nor Chispapaw, who
    speak on f036 and f037. At 390 × 844 the two spreads need read only as two struck, framed forty-threes: she counted the
    spread on f035, and f036's words ask no count.
32. **The groundhog is held by `SIZE_BAND` against our cat sitting (1.0 to 1.15), not `SIZE_CAP`.** Reason: `SIZE_CAP` is
    a ceiling with no ratio; the band gives a floor too, so it always reads bigger than Chispapaw (Sloshbank's shape).
33. **Granny leaves the cast on f012 and f013; the otters are listed otter 2, then otter 1; f013's "And it dug a big
    HOLE…" is otter 2's.** Reason: a balloon takes the nth cast member of its speaker, so a third otter would lend the
    third balloon Granny's face and voice; the story names no speaker for f013's line.
34. **Riffle `hop` on f014** (he has no `pawup`). Reason: chapter 11's cheer is his goodbye; no new pose.
35. **`plane: 'none'` at the Crossing; first light by the river looked at once, `day` its fallback.** Reason: the set's
    default airplane is in no line of the story (chapter 5's `CROSS`); neither the Crossing nor the riverbank has been
    drawn by `morning`, and nobody holds their files.

## 10. For the orchestrator

- **Before the build: the three checks of section 6.** Nothing waits on Aron: decision 55 answered his one fact (section
  7, item 14; the paper marks and C D U are open and not blocking). Ask the integrator for the kit's `tap` Zero forms
  (section 7, item 16).
- The kit v0.4 (decision 57) is merged before the frames (section 6, check 4).
- **Step 1, the stub** (on main, after the kit, book two and chapter 12):
  - `app/story/ch13.js`: `PC.story.ch13 = { id: 'ch13', number: 13, title: 'The Hunter’s Crouch', module: 2, start:
    'f001', names: { player: '{name}{ending}' }, frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.',
    end: true } }, counts: {}, cards: {}, teaser: { title: 'Chapter 14: The Night Watch', lines: ['More holes, and a watch
    to keep. Who will stay awake?'] } }`, in chapter 12's wrapper.
  - Its script tag after `ch12.js` in **`index.html` and `dev/gallery.html`**; in `sw.js`'s `ASSETS` after `ch12.js`;
    **`CACHE` one past the ledger's latest**; `node tools/storyboard.mjs app/story/ch13.js` for `docs/storyboard/ch13.md`.
  - **No new set file**: the grove's dig lives in `app/art/sets/grove.js`, everything else in `scenes.js` and `cats.js`.
  - **The tests that fail with the stub, each the orchestrator's to change with it** (chapter 12's step 1 found five; by
    the same shape, expect): `tests/story-ch12.test.js`' teaser case (chapter 12's teaser is now `built: true, next:
    'ch13'`) and its hub case (after chapter 12 the hub's next is chapter 13 itself); `tests/warrior-ui.test.js` and
    `tests/warrior-engine.test.js` where a cat finishes every chapter and reads the last one's teaser (now chapter 13's,
    "Chapter 14: The Night Watch"); `tests/takes-ui.test.js`' `index.html` hash (cut the new script tag too); `tests/sw.test.js`'
    CACHE; **`tests/book2.test.js` and `tests/book2-ui.test.js`** (`fixtures/takes-stub.js` puts a stand-in ch13 beside the
    real stub in `E.chapters(PC.story).concat(s.list)`). Run the full suite on the stub and name each. **`main` is never
    pushed while the stub stands.**
- **Step 2, the build: two owners, disjoint** (call 26):
  - **cats** (and the words): `app/art/cats.js` (the groundhog, in `CAST_IDS` and `PC.art.vocab.otherPoses`, drawn inside
    section 4's `SIZE_BAND`; `quickMarks`' `crossed` and `fresh`, and `quickMarks.size` counting them; `curl` with
    `tailUp`), `tests/cats.test.js`, `dev/gallery-cats.html`; `tools/storyboard.mjs` (words for every new name: `groundhog`,
    its poses and SPEAKER, `frost`, `ferns-1`, `ferns-2`, `spreadMarks`, `collar`, `dig`, `oak-near`, the `dig` and `marks`
    cameras and their spots, `marks`, `tap`, `curl` with `tailUp`; **the grove's `marks` and `tap` branched on `set ===
    'grove'` before the hollow's claw-mark words**, since `optWords` looks options up by name and grove's `marks: 'leaves'`
    would otherwise print the hollow's "claw marks on the trunk"; a `--check-words` list for chapter 13's names) and
    `tests/storyboard.test.js` only where a pin needs it, plus a case that a grove scene's `marks` words (`'leaves'`,
    `'bare'`) say "one long line and eight little pokes" and never "claw mark" or a number (chapter 13's story file is the
    story builder's, later); `app/ui.js` (`NAMES.groundhog`, appended last, `PITCH.groundhog`,
    `RATE.groundhog`, `FLAG_WORDS.teach`, `FLAG_WORDS.foundGroundhog`); **one line of `tests/engine.test.js`**: the "one new
    name, the last" pin of `Object.keys(NAMES)` (line 6918 on main today, `['mistscale']`; chapter 12's `chispapaw` moves it
    first), extended with `'groundhog'` (the slices at 6184, 6504 and 6564 end at earlier names and stand); **one case of
    `tests/book2-ui.test.js`** (line 199 on the take-aways tree: "until its chapter brings the art, the plain shape"),
    rewritten to assert that the found page draws the real groundhog (`sleeperArt('groundhog', false, 0)` differs from the
    plain shape) and that silhouettes, always called with `null`, stay plain; `app/story/words.js` (`resta`, `noAlcanza`,
    `desagrupo`) and `tests/spanish.test.js` (their cases); `docs/build.md`'s "Chapter 13" section; and **only if section
    6's check 1 or 3 fails**, `app/engine.js` (the `E.takeRoundStart` condition; the school words' `E.takeLine` condition)
    with tests. Never `kit.quick` (scenes.js's).
  - **sets**: `app/art/scenes.js` (the camp's `frost` and two spots; the hollow's `spreadMarks` in its own box; the den's
    `collar`; the groundhog's `SIZE_BAND`, `OWN_SHADOW`, `NO_SHADOW` lines), `app/art/sets/grove.js` (`dig` on `oak`, and
    `oak-near` only if fewer than four spots are clear; the `dig` composition, cameras, spots, covers keyed `doorway` and
    `dig-fern`, options; `groveInfo`), `tests/scenes.test.js` (the `<ch13-fingerprint>` first, before any edit),
    `tests/set-grove.test.js`, `dev/gallery.html` (`EXTRA` entries only, each labelled "chapter 13: "). It settles and
    reports the `ferns` spots (or the move to `crowd`), the four `oak` spots clear of the dig (or `oak-near`), the
    hollow's camera for f035 (f036 and f037 stay on `lesson`), the camp at night, and the Crossing and the riverbank's
    `path` by morning (or `day`).
  - Nobody holds `app/story/ch13.js`, `tests/story-ch13.test.js` or `docs/storyboard/ch13.md` (the story builder's,
    later), nor `sw.js`, `tests/sw.test.js`, `tests/story-ch12.test.js`, `tests/warrior-ui.test.js`,
    `tests/warrior-engine.test.js` (the orchestrator's, at the stub), `tests/engine.test.js` but its one NAMES pin (the
    orchestrator's, at the ship), `tests/book2*.test.js` but line 199's case (the orchestrator's, at the stub), `app/art/cards.js`,
    `app/art/sets/riverbank.js`, `crossing.js`, `bridge.js` (untouched), or any `takes-*` test.
  - **Between owners**: the sets owner places the groundhog with a stand-in and writes `spreadMarks`' final calls (no
    runtime fallback: until the cats owner's keys land they draw unstruck lines and loose dots, which nobody judges); the
    cats owner reports the groundhog's measured ratio against our cat sitting; the orchestrator looks at the dig frames
    (f058, f059, f066, f068) and the Hollow's spread (f035, f036) once both have landed.
- **Step 3, the story builder** writes `app/story/ch13.js` from section 5 on the built art, with its test and storyboard.
  **Then** the sets owner's acceptances on the real casts (the ferns, the Hollow's box, the dig).
- **README** (end of the spec phase): section 9's calls in short, under "Claude's calls under decision 46", and that
  decisions 53, 54 and 55 bind the chapter. At ship, the echo list takes: a mentor's first lesson, the pupil copying the
  teacher's tail (chapter 1 mirrored); a sleeper woken and tucked back in.
- **`docs/continuity.md`** (ship): section 8 as "What chapter 14 inherits"; the store's running count (178, day 2, the book
  only); the places table (section 8, "Drawn now"); the cast (the groundhog); the flags table (`teach`, `foundGroundhog`);
  the Counts table, row 13: three story Counts (3 × 4, 6 × 8, the groundhog's 7 × 8), the warm-up, six take-aways (step
  `ones2`), the pile's 52 − 27; no new Count, marks 10.
- **The page review** (Node, the WebKit tool, and both voice lists, `VOICES=none DRY=1` and `VOICES=es DRY=1 node
  tools/shots.mjs OUT ch13:f030 ch13:f033 ch13:f035 ch13:f040`; nothing aloud): f030 («¡La resta!» italic in an upright
  balloon; with no voice, "Take-aways! THAT’S …"), f033 (the Spanish balloon with its gloss over the sand), f035 (the
  whispered «¡Desagrupo!» and its gloss, upright, clear of the spread marks' box), f036 (four boxes over the spread
  marks), f040 (the whispered Spanish), at the four sizes, Aa off and on; no row pairs Spanish text with an English
  voice; the take pages through the kit's targets (the worked example's tens column with the school words, a `'tap'`
  page, the pile's first column with Glintstar's twelve words): no `col-off`.
- **The ship's look** (at most 25 pictures, silent, the screen locked: `tools/shots.mjs`): the title panel (f001); the
  first frost (f004); the trails (f007); Riffle juggling (f008); the otters (f012); the crouch with her tail up (f020); the
  pounce (f022); the collar in the den (f027); the spread and her «¡Desagrupo!» (f035); the spread, hers and yours (f036); the
  noon crowd (f038); the bridge's end (f048); the dig by the oak (f053); the dig close (f054); the doorway (f058); the
  groundhog asleep, awake and yawning (f059, f061, f063); the marks bare (f066) and close (f068); the old tom's tale and the
  flop (f071, f072); her nest under the stars (f076); the last frame (f084); after the chapter, her book's chapter 13 page
  (the store at 178), the badger page and the groundhog's sleeper page.
- **Frames**: 78 a plain reading, 84 with the groundhog, f084 the end (cap 125).

# Chapter 7 spec: The Counts Don’t Lie

*v0.3 · 2026-10-20 (v0.1 with the spec critics' findings applied: the goldens, the nest's spacing, the
face rule, one to ten cheeks, the comparison's place, the snapshot and the gallery's script tag; v0.3, the
build review's integration round 1: the print close up drawn true to size, the told tunnel screen in two
panels, one story line, the book's FLEW sentence, two known issues, call 29)*

*The build's contract for chapter 7, beside `docs/build.md`. The story,
[`07-the-counts-dont-lie.md`](07-the-counts-dont-lie.md) (Draft v0.4, final), is the source of every
word she reads; this spec adds no line she reads except the engine's own wording of a question, a
filler's opening, a retry's opening, a right retry's line and a last miss, each named here and kept to
chapter 6's lines or the story's own words. Every Counts set below was run on the live engine (0.6.0)
with scripted answers, exactly as written here (`~/potomac-crossing-work/ch07/spec-writer/sets.js`,
run by `sim.js`, `sim2.js` and `sim3.js` there, and the Case File's links by `sim4.js`; `E.checkStory`
clean with the Counts frames as section 5 has them). The round-2 editor's engine notes (`editor-r2/for-the-spec.txt`) are folded in; where
they and the story differ (the sixty's fillers), the story wins. Names in `code` are fixed: the art,
the engine, the storyboard words and the story builder use exactly these.*

---

## 1. Flags

**One new flag, sticky; no new choice flag** (brief: "Flags"). No choice in this chapter sets
anything.

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `ch7Flew` | `true` | the screen "The fox says it FLEW. Sprinkle can’t fly. / They can’t both be true." (its choice frame, every path), `sets: { ch7Flew: true }` | sticky (never unset; Back does not unset it) | chapter 4's `fox-flew` card link (one edit, below), so her Case File draws `fox-flew` and `cant-fly` touching, "They can’t both be true.", for every cat from that screen on; the Grown-ups corner's words. Nothing else reads it. |

- **Chapter 7 never sets `ch4CaughtFly`** (call 1, section 9; the orchestrator's known issue "flew",
  section 7). The brief's call 5 asks for FLEW against can't-fly linked for everyone, and the story's
  note suggests doing it by setting `ch4CaughtFly` and guarding its other readers with `specialty:
  'noticing'`. That guard cannot keep chapters 4 and 5 byte-identical for every live save: a cat who
  caught FLEW as a noticing cat and then picked another specialty on a reread of chapter 1 holds
  `ch4CaughtFly` without `specialty: 'noticing'`, and would lose her chapter 4 recap line and her
  "Flew. Again." today; and after chapter 7 a cat who switched to noticing late would gain lines she
  never earned. A found-here flag of chapter 7's own makes both exact: `ch4CaughtFly` keeps the one
  meaning it has had since chapter 4 (a noticing cat caught the fox's FLEW at the border), and the one
  reader whose meaning should widen, the card link, reads either flag.
- **The one edit in shipped code** (`app/story/ch04.js`, `cards['fox-flew'].link.when`, line 1667):
  `{ ch4CaughtFly: true }` becomes `{ not: { ch4CaughtFly: false, ch7Flew: false } }`. `E.matches`
  already does this: `not` over two keys matches when either flag is `true` (`false` also matches a
  flag never set). For every live save `ch7Flew` is unset, so the link matches exactly when it did.
  `answers: ['cant-fly']` and the line stay as they are. **What it draws is unchanged for every live
  save; the card data is not.** `E.cards` copies each card's `link` definition into its output as it
  stands, `when` included (engine.js, `link: isObj(def.link) ? def.link : null`), and so does
  `E.caseFile`; chapter 4's golden (`tests/fixtures/ch04-golden.json`) hashes both on every frame. With
  the edit alone, on a scratch copy, the suite fails in exactly two places: `tests/engine.test.js`'s
  "chapters 1 to 4 play exactly as they did" at ch04 f066 on the first script, for every save, `ch7Flew`
  or not; and `tests/story-ch04.test.js`'s assertion of the link. So the goldens compare what a link
  draws (whether `E.matches(link.when, cat)`), not its raw `when`, and `ch04-golden.json` is never
  re-recorded (section 7, item 2). Chapter 4's storyboard reprints that one card row's condition
  (`docs/storyboard/ch04.md`; and the den's `hidden` words in chapters 4 to 6: section 6); nothing else
  of chapters 1 to 6 that she reads or that is drawn changes.
- **Every shipped reader of `ch4CaughtFly`, and why each stays as it is** (each means "she caught FLEW
  at the border in chapter 4", which is still all the flag means):

  | Where | What it shows | After chapter 7 |
  |---|---|---|
  | `app/story/ch04.js` f043, `when: { specialty: 'noticing' }`, `sets: { ch4CaughtFly: true }` | the catch: "Wait. FLEW? Sprinkle’s wing droops…" | unchanged: still the only frame that sets it |
  | `app/story/ch04.js` `cards['fox-flew'].link` | `fox-flew` and `cant-fly` touching | **edited** as above: also with `ch7Flew` |
  | `app/story/ch04.js` book recap (line 1870), `{ ch4CaughtFly: true }` | "{They} caught one hole in the fox’s story: Reynard said the dragon flew, and Sprinkle can’t fly." | unchanged |
  | `app/story/ch04.js` book recap (lines 1877–1879), the Squall lines with `not: { ch4CaughtFly: true }` and `ch4CaughtFly: true` | two Squall sentences, or one for a cat who caught FLEW | unchanged |
  | `app/story/ch05.js` f159 (line 1714), `{ ch4CaughtFly: true, ch3Told: true }` | Tallyheart's whisper "One hole in his story for certain. Maybe two." | unchanged |
  | `app/story/ch05.js` the otters' fourth frame (f070a and f135; line 2047), `{ ch4CaughtFly: true }` | "Flew. Again. You know a dragon who can’t." | unchanged |
  | `app/ui.js` `FLAG_WORDS.ch4CaughtFly` (line 436) | "caught the fox’s “flew”: Sprinkle can’t fly (later chapters remember)" | unchanged (true of exactly the cats who hold it) |
  | `app/story/ch04.js` f115, `card: ['cant-fly', { id: 'fox-flew', when: { specialty: 'noticing' }, held: true }]` | the fox's card beside the wing at bedtime | keyed on `specialty`, not the flag: unchanged |
  | chapter 6 | nothing (its test asserts no `when` names it) | unchanged |

  So a player who rereads chapters 4 and 5 after chapter 7 reads exactly what she read before, and
  only her Case File differs (the link, which is the point). The words owner's test proves it
  (section 7, item 2).
- **Chapter 7 reads `ch4CaughtFly` once**, as the story marks it: "I KNEW it!" / "I knew it at the
  border!" with `{ specialty: 'noticing', ch4CaughtFly: true }`. Because chapter 7 never sets the flag,
  that line is airtight: a cat who became noticing after chapter 4 never reads it, on any reading
  (the verify critic's low, closed).
- **The light choices set nothing** (`sets: {}`): Waffles' "Is grass SOFT?"; the told sum's "So it
  WASN’T Sprinkle!" / "So the thief is somebody SMALL!"; the kept sum's two; the FLEW screen's "So
  Reynard LIED!" / "The fox’s story isn’t TRUE!" (its frame sets `ch7Flew`, never an option); "Sniff
  the tunnel." / "Listen at the tunnel."
- **Flags read from earlier chapters:**
  - `ch3Told`: who is there (section 5): told, Tallyheart does the whole sum, goes to the Old Bridge
    and says FLY, and looks at the back with her at dusk; kept, the sixty is Riffle's, Riffle says
    FLY, and she finds the tunnel alone. Every screen the story marks *Told path only* / *Kept path
    only* and every `[if ch3Told: …]` line.
  - `specialty`: `noticing` (the told FLY line "Tallyheart looks at you…", and the dug earth at
    dusk; with `ch4CaughtFly`, "I KNEW it!"); `not noticing` (the told "Tallyheart goes very still";
    Coil's "Under" at dusk); `sneaking` (one caption at the slip round); `climbing` (the climber's
    screen of its own after the sniff-or-listen choice).
  - `worry`: one caption each at the tunnel's mouth (`small`, `water`, `talk`, `shiny`).
  - `ch2Stone`: one bedtime caption (and the den's `stone: 'auto'`).
  - `lessonClean: 'ch07-sixes'` and `not` it: the seventh mark's two pairs of lines.
  - Not read: `foundSquall`, `foundPuddle`, `foundWisp`, `foundSleet` (the story mentions no tally and
    passes on no "five"), `ch2Path`, `ch2SaidAloud`, `stepOut`, `spokeUp`, `joinReason`, `ch5First`,
    `ch5Roof`.
- **Grown-ups corner** (`PC.ui.flagWords`): `ch7Flew: { 'true': 'saw Sprinkle try to fly at the Old
  Bridge: the fox’s “flew” can’t be true (later chapters remember)' }`. `ch4CaughtFly`'s words stay.

## 2. Counts sets

**15 typed answers on every path** (the story's For us; the brief's "about 16": a sixteenth would
be a fourth twenty-four). Every key below is one the engine has (chapters 2 to 6); no set needs a
new one. Shared pieces, as chapter 6's file has them: `T(x)` is `{ who: 'tallyheart', text: x }`;
`QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.']`; `HOP = 'Close.
Let’s hop it together.'`, `HOP_FAR = 'Let’s hop it together.'`; `MISS = 'There. We’ll come back to
that one.'`, `LAST = 'There. Now you’ve seen it counted.'`; `RIM` is chapter 5's and 6's five rim
cats (`clancat` 1, `murmurchime`, `clancat` 3, `clancat` 5, `grizzled`); and:

```js
var PATROLS = { table: 3, thing: 'cat', things: 'cats', unit: 'patrol', units: 'patrols', teacher: 'tallyheart', ask: '{a} × {b}' };
var CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart',
  ask: '{a} × {b}', picture: { kind: 'cheeks' } };
var NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };
// a question that doubles or steps: its way, said once more before the last line; on a last miss its way alone
function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
var TOP = { kind: 'cheeks-top' };   // a question that doubles opens with every cheek's top row lit (art only)
// 2 × 6, "That’s one whole cat.": one cat's two cheeks, drawn as one face (section 4's face rule)
var ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];
```

Lines use the story's typographic quotes and apostrophes.

Engine lines that reach her and that no set words: **a retry** opens with “Here’s that one again.”
(in the pile, the twenty-four and the sixties, whose fillers keep the borrower's voice, a lent
question's retry opens with that set's `fillIntro`, “An easy one.”, instead); **a right retry** of a fact with
no `right` kept for it gets “There it is. You remembered that one.” then “Yes! That one came back, and
you knew it.” (the warm-up's first question, and any missed filler); **a generic question** where a
question has no words of its own (below, set by set). Chapter 6 used the same; the build needs
nothing.

### Every fact, in the order she meets it

| # | Set | Fact (answer) | Where | Picture |
|---|---|---|---|---|
| 1 | `ch07-pile` | 3 × 10 (30), a check | the sixth morning count | prey in rows, lit a row at a time |
| 2 | `ch07-threes` | 7 × 3 (21), or her hardest 3s fact from chapter 6 | the warm-up | patrols |
| 3 | `ch07-threes` | 4 × 3 (12) | the warm-up | four patrols |
| 4–13 | `ch07-sixes` | 2 × 6, 5 × 6, 6 × 6, 6 × 3, 6 × 4, 6 × 7, 6 × 8, 4 × 6, 7 × 6, 8 × 6 (12, 30, 36, 18, 24, 42, 48, 24, 42, 48) | the lesson | that many cheeks; 6 × 6 with five lit; the doubling ones with every top row lit |
| 14 | `ch07-gone` | 4 × 6 (24), `table: 4` | the sum, every path, in the Hollow | six nights of four marks, in the sand |
| 15 | `ch07-dragon` (told) or `ch07-riffle` (kept) | 10 × 6 (60) | told: the Hollow; kept: under the Old Bridge | six nights of ten marks, in the sand or the mud |

The lesson kit holds: seven of the ten are new facts (6 × 6, 6 × 4, 6 × 7, 6 × 8, 4 × 6, 7 × 6,
8 × 6; at least six from 6 × 4, 6 × 6, 6 × 7, 6 × 8 in either order), three are known stepping stones
(2 × 6 from chapter 2, 5 × 6 from chapter 3, 6 × 3 from chapter 6's guards); both orders; the method
is double the threes (6 × 3, 6 × 4, 6 × 7, 6 × 8) or step off one she knows (6 × 6 off 5 × 6); twins
three places apart; each new pair typed twice (6 × 4 / 4 × 6, the sum's 4 × 6 a third; 6 × 7 / 7 × 6;
6 × 8 / 8 × 6), 6 × 6 once. The story questions come after the lesson. Not typed (taps, never logged):
the four gaps (1 to 4), her whiskers (3, 6), five cheeks (6 to 30), Tallyheart's six Counts at the
tree (`ask`), the bedtime cheeks (6 to 24), and eight one-tap frames (section 5).

### `ch07-pile`, the sixth morning count (one question; Counts frame `intro: false`)

```js
'ch07-pile': {
  table: 10, thing: 'piece', things: 'pieces', unit: 'row', units: 'rows', teacher: 'tallyheart',
  picture: { kind: 'prey', layout: 'rows' },
  facts: [{ a: 3, b: 10, light: 'rows', check: true,
    prompt: [{ kind: 'caption', text: 'Three front rows of ten. How many pieces?' }], retryPrompt: true }],
  ask: '{a} × {b}', praise: [], ground: 'earth',
  helpIntro: 'Let’s scratch it out: ten marks for every row.',
  helpIntroNotTen: 'Remember: counting by tens, every number ends in a zero. Let’s scratch it out: ten marks for every row.',
  fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower',
  avoid: [[4, 10], [5, 10]], fillIntro: 'An easy one.',
  miss: MISS, missLast: LAST, again: ['There it is. You remembered that one.'], done: null
}
```

Chapter 6's pile, the story's caption. Run: a miss scratches ten marks a row in the earth (10 · 20 ·
30), then “An easy one. One row of ten. How many pieces?” (1 × 10) and “An easy one. Two rows of ten.
How many pieces?” (10 × 2), on the pile's own rows, then the retry; a second miss lends the same two
again (`avoid` keeps four and five full rows out). No praise: the gap answers. `intro: false`: the
frame's one balloon (“{name}paw. Eighteen guards. Let’s see if it worked.”) is not said again over the
caption, so the keypad page holds only the rows and their question.

### `ch07-threes`, the warm-up (two questions; Counts frame `intro: false`)

```js
'ch07-threes': Object.assign({}, PATROLS, {
  facts: [[7, 3], { a: 4, b: 3, right: [T('Twelve! Hold on to that.')], rightAgain: true }],
  warmHard: { table: 3, at: 0, avoid: [[1, 3], [3, 2], [3, 9], [3, 10], [3, 4]] }, avoid: [[3, 4]],
  fillFrom: 'ch06-threes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
  praise: ['Hop, hop, hop!', 'Three more, every time!', 'You hopped it!'],
  fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
  helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
  remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
  rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
})
```

- **The hard pick** (`warmHard`, position 0): her hardest 3s fact by `E.hardFacts(cat, 3)`, in the
  order she was asked it; 7 × 3 when nothing was hard. Never 1 × 3, 3 × 2, 3 × 9 or 3 × 10, whose
  timed answers can be other days' (chapter 6's spec, section 8: chapter 5's 3 × 9, chapter 4's
  10 × 3, the 1s' and 2s' Hollow rounds), and never 3 × 4 or 4 × 3, which comes second anyway. Runs:
  nothing hard → “Seven patrols. How many cats?”, and a quick right answer earns “Quick as a pounce!”;
  a chapter-6 miss of 3 × 8 (8 × 3 a check, right and quick) → 3 × 8 first, “Eight patrols. How many
  cats?”, and quick earns “Yesterday, 3 × 8 made you stop and think. Not today!”; a slow chapter-6
  3 × 5 → 3 × 5 first, and slow again earns “3 × 5 again, and you got it. It’s getting easier.”; a cat
  whose only hard facts are the avoided ones gets plain 7 × 3. A slow 3s answer from a Hollow round of
  the 3s (played between chapters 6 and 7) is picked too, which is still "yesterday" enough.
- **The words**: the two lines of the Counts frame (the caption “In the Training Hollow, five cats
  sit up on the rim.” and “Threes first, to wake up your whiskers.”) are read on the frame and not
  again (`intro: false`), so the first question is timed on itself; both questions are asked in the
  engine's generic words, which for 4 × 3 are the story's own (“Four patrols. How many cats?”), so
  4 × 3 is timed too (no `prompt`). 4 × 3's right line “Twelve! Hold on to that.” is kept on a retry
  (6 × 4's prompt says “twelve, like your warm-up”).
- **Help and fillers**: a miss hops the sand by threes (chapter 6's), “Close. Let’s hop it together.”
  within one hop. Fillers are chapter 6's lesson's easiest, in chapter 6's patrols: a miss on the
  first lends one, “One from yesterday. One patrol. How many cats?” (1 × 3); a miss on 4 × 3 lends two,
  1 × 3 then “One from yesterday. Two patrols. How many cats?” (3 × 2). Run.

### `ch07-sixes`, the lesson (ten facts; Counts frame `intro: false`)

```js
'ch07-sixes': Object.assign({}, CHEEKS, {
  label: 'Whiskers', hollowThings: 'sixes', fillOrder: 'easiest', prompt: 'How many whiskers?',
  facts: [
    { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? That’s one whole cat.', retryPrompt: true, right: [T('Twelve! Six and six.')], rightAgain: true },
    { a: 5, b: 6, right: [T('Thirty! You hopped that one already.')], rightAgain: true },
    Object.assign({ a: 6, b: 6, lit: 30, prompt: 'Six cheeks. Five cheeks made thirty. One more cheek: six more.', retryPrompt: true,
      right: [T('Thirty-six! That’s a new one.')], rightAgain: true }, way('Five cheeks made thirty. Six more: thirty-six.')),
    Object.assign({ a: 6, b: 3, picture: TOP, prompt: 'Three cheeks. Three threes on top: nine. Three threes below: nine more.', retryPrompt: true,
      right: [T('Eighteen, like the guards! Nine and nine. That’s doubling.')], rightAgain: true }, way('Nine and nine: eighteen.')),
    Object.assign({ a: 6, b: 4, picture: TOP, prompt: 'Four cheeks. Four threes on top: twelve, like your warm-up. Four threes below: twelve more.', retryPrompt: true,
      right: [T('Twenty-four! You doubled the threes.')], rightAgain: true }, way('Twelve and twelve: twenty-four.')),
    Object.assign({ a: 6, b: 7, picture: TOP, prompt: 'Seven cheeks. Seven threes on top: twenty-one. Twenty-one below, too. Twenty-one and twenty-one: twenty and twenty, then one and one.', retryPrompt: true,
      right: [T('Forty-two! You doubled twenty-one.')], rightAgain: true }, way('Twenty and twenty make forty. One and one make two. Forty-two.')),
    Object.assign({ a: 6, b: 8, picture: TOP, prompt: 'Eight cheeks. Eight threes on top: twenty-four. Twenty-four below, too. Twenty-four and twenty-four: twenty and twenty, then four and four.', retryPrompt: true,
      right: [T('Forty-eight! The hardest one, and you did it.')], rightAgain: true }, way('Twenty and twenty make forty. Four and four make eight. Forty-eight.')),
    { a: 4, b: 6, prompt: 'Four cheeks? You did that one, turned round.', retryPrompt: true, right: [T('Twenty-four! Same fact.')], rightAgain: true },
    { a: 7, b: 6, prompt: 'Seven cheeks? You did that one the other way round.', retryPrompt: true, right: [T('Forty-two! Same fact.')], rightAgain: true },
    { a: 8, b: 6, check: true, right: [T('Forty-eight! Same fact.')], rightAgain: true }
  ],
  praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
  fast: QUICK2, fastAfterMiss: ['Ha! You didn’t even look at the sand that time.'],
  helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the sixes.'
})
```

- **The Count**: the first set chapter 7 gives table 6 with the most facts, so it is the 6s' own
  (`E.countSets`: run, `6:ch07-sixes`; the twenty-four's set is table 6 with one fact, the sixty's
  table 10). The Hollow's button reads “Whiskers · the 6s”; Tallyheart says “A round of sixes. Ready?
  Here we go.”; the tree gets its seventh mark once this lesson is finished (`E.learnedCounts`), never
  before.
- **Pictures** (`E.lessonPicture` passes the picture's `kind`, and a retry keeps it): every question
  opens on that many cheeks close up, three whiskers on top and three below (`kind: 'cheeks'`, per 6,
  groups = the cheeks: 2 × 6 two, 6 × 4 and 4 × 6 four, 8 × 6 eight). **2 × 6 is one cat's face**
  (`who: ONE_CAT`): its prompt says “That’s one whole cat.”, so its two cheeks are one `clancat` 1's,
  side by side as one face (section 4's face rule), never two cheeks in two coats; a fact's `who` is
  in the engine's `FACT_KEYS` and `RETRY_KEYS`, so the retry keeps it. A 2 × 6 lent as a filler (in the
  lesson, or by the twenty-four) or asked in a Hollow round carries no `who` (the engine's fillers keep
  only `a`, `b`, `table` and `from`; `E.hollowDef` drops the facts) and draws two cheeks in the rim's
  first two coats; its words (“How many whiskers?” in the lesson; “An easy one. Two cheeks. How many
  whiskers?” when the twenty-four lends it) claim no one cat. The four doubling questions
  (6 × 3, 6 × 4, 6 × 7, 6 × 8) open with every cheek's top row lit and the row below unlit (`kind:
  'cheeks-top'`; never `lit`, which lights whole cheeks in order); 6 × 6 opens with the five cheeks of
  5 × 6 lit and the sixth not (`lit: 30`). A right answer lights every whisker (the page's rule). The
  art draws `cheeks-top` (section 4), so the story's fallback (every cheek unlit) is not needed.
- **Words**: eight facts have their own prompt (kept on a retry, after “Here’s that one again.”); 5 × 6
  and 8 × 6 have none and are asked “How many whiskers?” (the set's `prompt`, the story's words); their
  retries are asked in the engine's generic words, “Here’s that one again. Five cheeks. How many
  whiskers?”. Every fact's right line is its own (kept on a retry), so praise is heard only on a filler
  and in Hollow rounds; quick fillers get the fast lines, and after a miss “Ha! You didn’t even look at
  the sand that time.” leads. The Counts frame's balloon (“Six of them you knew already… or double the
  threes.”) is read on the frame and not said again (`intro: false`), so 2 × 6's own line is the only
  balloon over the first question.
- **Help** (run, every single miss): Tallyheart scratches six marks for every cheek, three and three
  (`PC.art.sand` at per 6: section 4), and hops them by sixes from the first cheek (6 × 4: 6 · 12 · 18
  · 24); “Close. Let’s hop it together.” within one hop of six, else “Let’s hop it together.”; then
  the fact's own miss line: for 6 × 6 “Five cheeks made thirty. Six more: thirty-six. There. We’ll come
  back to that one.”, for 6 × 3 “Nine and nine: eighteen. There. …”, 6 × 4 “Twelve and twelve:
  twenty-four. There. …”, 6 × 7 “Twenty and twenty make forty. One and one make two. Forty-two. There.
  …”, 6 × 8 “… Four and four make eight. Forty-eight. There. …”; the others “There. We’ll come back to
  that one.” On a last miss: the way alone, or “There. Now you’ve seen it counted.” Never a wall; no
  clock.
- **Order** (run): a missed fact comes back two questions later; a single miss of 6 × 4, 6 × 7 or 6 × 8
  comes back before its twin (R6×4 before 4 × 6; R6×7 before 7 × 6; R6×8 before 8 × 6). Missing 6 × 4,
  6 × 7 and 6 × 8 in a row gives R6×4, R6×7, R6×8, then 4 × 6, 7 × 6, 8 × 6; a retry missed again can
  land just after its twin, as in chapter 6's lesson (the story's note says so). Fillers near the end
  are her easiest right answers in the lesson (`fillOrder: 'easiest'` alone): a miss on 7 × 6 lends
  2 × 6; on 8 × 6, 2 × 6 then 6 × 3, asked “How many whiskers?” in their own cheeks.
- **8 × 6 is a check** (`check: true`; call 8): a missed 6 × 8 comes back as the question just before
  8 × 6, the same eight cheeks and the same 48 she has just been shown twice; a quick right 8 × 6 there
  would be the pair's latest timed ask and hide the miss from chapter 8. As a check it never does. The
  cost: a slow 8 × 6 goes unseen (the 6s' Hollow rounds time all ten).
- **Timing** (run, for chapter 8): every fact but 5 × 6 is read first (its own prompt) or a check, so
  5 × 6 is the lesson's only fact `E.hardFacts` times on itself; any miss counts.

### `ch07-gone`, the twenty-four (one question, every path; Counts frame has no balloon)

```js
'ch07-gone': Object.assign({}, NIGHTS, {
  table: 6, teacher: 'tallyheart', picture: { kind: 'marks' },
  facts: [Object.assign({ a: 4, b: 6, table: 4,
    prompt: [{ kind: 'caption', text: 'Four gone a night, for six nights. How many gone?' }], retryPrompt: true,
    right: [T('Twenty-four! Four every night, for six nights. You just did that one with the whiskers!')], rightAgain: true },
    way('Three nights make twelve. Six nights is twice that. Twelve and twelve: twenty-four.'))],
  help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
  fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'An easy one.', avoid: [[6, 6]],
  praise: [], miss: MISS, missLast: LAST, done: null
})
```

- **`table: 4` on the fact** (the orchestrator's known issue "table4"; call 6): the engine pictures
  4 × 6 at table 4 as six groups of four (`groupsFor`: six nights, four marks each) and hops the help
  by fours, 4 · 8 · 12 · 16 · 20 · 24 (run). At the set's table 6 it would picture four groups of six
  (four nights of six: wrong), and `groups: 6, per: 4` alone would fix the picture but hop the help by
  ones, all twenty-four marks.
  The set stays `table: 6`, so `E.countSets` still gives the 6s to `ch07-sixes` and no chapter-7 set
  owns the 4s (run: no table 4 in `E.countSets`). **Its one side effect**: the answer is logged with
  `table: 4` (`C.answer` logs a fact's own table when it differs from its set's), so `E.tableOf` files
  it under the 4s, and the Grown-ups corner shows a table "The 4s" with this one row (4 × 6) until
  chapter 8's lesson makes it "Paws · the 4s" (run: `E.factTables` lists `4 The 4s 4x6`). The Training
  Hollow never offers the 4s before chapter 8 (`E.learnedCounts` reads the sets, not the log). For
  chapter 9's warm-up on the 4s, `E.hardFacts(cat, 4)` finds a chapter-7 miss of the twenty-four
  (run: `[[4, 6]]`), two days old by then (section 8).
- **Picture**: the sand, six nights side by side, four marks each, unlit (`kind: 'marks'`, new Counts
  art: section 4; per 4 alone would draw the 4s' paws). No night is ever drawn with other than four
  marks.
- **Help** (`help: 'picture'`): no new scratching; the marks already in the sand light a night at a time
  as Tallyheart hops by fours, then the fact's miss line: “Three nights make twelve. Six nights is twice
  that. Twelve and twelve: twenty-four. There. We’ll come back to that one.” (last miss: the way
  alone).
- **Fillers**: two easy sixes the lesson lends, in the lesson's own cheek picture (`fillVoice:
  'borrower'` without `fillPicture`: Tallyheart's voice, the cheeks): “An easy one. Two cheeks. How many
  whiskers?” (2 × 6), then “An easy one. Three cheeks. How many whiskers?” (6 × 3); then the six nights
  of four marks come back, unlit, with the question's own words (after “Here’s that one again.”). A
  second miss lends 5 × 6 then 2 × 6 again: `avoid: [[6, 6]]` keeps thirty-six, a new fact, from ever
  being "an easy one" (run; without it the second miss lent 5 × 6 and 6 × 6). The right line is the same
  on the retry (`rightAgain: true`).
- **Timing**: its own prompt, so a right answer is never timed; a miss counts (for chapter 8's 6s and
  chapter 9's 4s).

### `ch07-dragon`, the sixty, told path (one question, in the Hollow)

```js
'ch07-dragon': Object.assign({}, NIGHTS, {
  table: 10, teacher: 'tallyheart', picture: { kind: 'marks' },
  facts: [{ a: 10, b: 6, prompt: [{ kind: 'caption', text: 'Ten a night, for six nights. How many would a dragon take?' }], retryPrompt: true,
    right: [T('Sixty! Ten a night adds up fast.')], rightAgain: true }],
  help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
  fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
  praise: [], miss: 'Tens land on a zero. ' + MISS, missLast: 'Tens land on a zero.', done: null
})
```

Typed 10 × 6, in the twenty-four's order (a night's count, then the nights): the brief's 6 × 10 turned
round, the same fact on the 10s (the story's call 8). Picture: the sand, six nights side by side, ten
marks each, unlit (`kind: 'marks'`; per 10 alone would draw two forepaws a night). Run: a miss lights
the marks a night at a time, 10 · 20 · 30 · 40 · 50 · 60, then “Tens land on a zero. There. We’ll come
back to that one.”; then “An easy one. One night. How many pieces?” (1 × 10) and “An easy one. Two
nights. How many pieces?” (10 × 2), drawn as one night and then two nights of ten marks (`fillPicture:
'borrower'`), then the six nights again, unlit, with the question's own words. A second miss lends
10 × 3 and 4 × 10 (three and four nights). The pile is its sibling (both borrow from `ch04-tens`), but
the warm-up, the lesson and the twenty-four answered between them end the siblings' run, so the sixty
always starts from 1 × 10 (run). The Counts frame's balloon (“If she were our thief, that’s ten every
night.”) is said again over the question with the caption: Tallyheart's line and the question read
together.

### `ch07-riffle`, the sixty, kept path (one question, under the Old Bridge)

```js
'ch07-riffle': Object.assign({}, NIGHTS, {
  table: 10, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' },
  facts: [{ a: 10, b: 6, prompt: [{ who: 'riffle', kind: 'whisper', text: 'Six nights. How many would she take?' }], retryPrompt: true,
    right: [{ who: 'riffle', kind: 'shout', text: 'SIXTY!' }, { who: 'riffle', kind: 'whisper', text: '…sixty.' }], rightAgain: true }],
  help: 'picture', helpIntro: 'Hop by tens! Ten, twenty…', helpIntroFar: 'Hop by tens! Ten, twenty…',
  fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
  praise: [], miss: MISS, missLast: LAST, done: null
})
```

The told path's sum in Riffle's voice. The story's “If SHE were the thief, she’d take ten every
night,” whispers Riffle. “Six nights. How many would she take?” is split at its speech tag: the first
sentence is the Counts frame's balloon, said again over the question (default intro), the second the
fact's own prompt, so the keypad page shows both whispers, and the retry asks “Here’s that one again.”
then “Six nights. How many would she take?”. The right line is his shout “SIXTY!”, then “…sixty.”
as a second balloon, a whisper (the story's “Then, very quietly:” is the speech tag that whisper
carries). Picture: ten marks scratched in the mud for every night, six nights, unlit (`ground: 'mud'`). Run: a miss gets “Hop by tens! Ten,
twenty…”, the marks lit a night at a time (10 to 60, Riffle counting), “There. We’ll come back to that
one.”, then “An easy one. One night. How many pieces?” and “An easy one. Two nights. How many
pieces?” in his voice, then the six nights again. A second miss lends three and four nights. The
engine's own lines in a set have no balloon kind, so “Hop by tens!…”, “Here’s that one again.”, “An
easy one.” and the miss line are plain balloons, not whispers (section 7, item 6).

### The taps that count (skip and ask)

- **The four gaps** (“Right in the middle of the back row: empty spaces.”): `skip: { table: 1, groups: 4,
  thing: 'gap', things: 'gaps', teacher: 'player', label: 'Count the next empty space.', prompt:
  '**Tap** the empty spaces.', carry: false, next }`. The picture is the back row close up (new Counts
  art, keyed on `thing: 'gap'`), the next gap glowing; each tap lights one and puts the count in her
  balloon, “1… 2… 3… 4!”; a tap elsewhere wiggles the glowing gap. The fourth tap turns the page;
  `carry: false` (call 11): the next page is her “Four gone.” over the pile, three cats and a crowd, and
  her balloon says the number.
- **Her whiskers** (“Up close, you can count her whiskers.”): `skip: { table: 3, groups: 2, who: [{ who:
  'tallyheart' }], thing: 'whisker', things: 'whiskers', teacher: 'player', label: 'Count the next row
  of whiskers.', prompt: '**Tap** her whiskers.', keep: true, next }`. One cheek close up, Tallyheart's
  (the `who`), six whiskers, its two rows the two groups (new Counts art, keyed on `thing: 'whisker'`
  at table 3, before the 3s' patrols): the first tap lights the top row and puts 3 in her balloon, the
  second the row below, 6, and turns the page. `keep: true`: the page it turns to (“Six whiskers on one
  cheek… Six is two threes.” / “So a six is a three, TWICE?” / “Exactly.”) keeps the cheek, both rows
  lit, 3 and 6 beside them, under a big 6; the skip after it ends the kept run (`E.keptSkip`).
- **Five cheeks** (“Now hop by sixes… Touch each cheek.”): `skip: { table: 6, groups: 5, who: RIM, thing:
  'whisker', things: 'whiskers', teacher: 'tallyheart', label: 'Count the next cheek.', prompt: '**Tap**
  the cheeks.', carry: false, next }`. Five cheeks close up in a row, each in its rim cat's coat, the
  next glowing; each tap lights its six whiskers, three and three, its running total under it and a big
  number over the picture, Tallyheart's count “6… 12… 18… 24… 30!”. The fifth tap turns the page to the
  ask (whose page draws no carried number anyway; `carry: false` says so for the storyboard).
- **The tree** (“Thirty! Now, a secret… One from every mark on this tree.” / “I DO?”): `ask: { who:
  'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.',
  pairs: [['Tails?', 'Six cats, six tails!'], ['Ears?', 'Six cats, twelve ears!'], ['Claws?', 'Six
  forepaws, thirty claws!'], ['Both forepaws?', 'Six cats, sixty claws!'], ['Nine lives?', 'Six cats,
  fifty-four lives!'], ['Patrols?', 'Six patrols, eighteen guards!']], next }`, on `hollow`/`wide` with
  `{ marks: 6, glow: 'auto' }` so the six marks are in the panel (the story: "The tree’s six claw marks
  are in the panel and don’t change"; the `lesson` camera sees only the tree's edge), Tallyheart at
  `tree-far` with `glow: true`. No `opt`: the hollow ignores `owed`. Next after the sixth.
- **Bedtime** (“He puffs out his cheeks. You puff out yours.”): `skip: { table: 6, groups: 4, who: [{ who:
  'snorer' }, { who: 'snorer' }, { who: 'player' }, { who: 'player' }], thing: 'whisker', things:
  'whiskers', teacher: 'player', label: 'Count the next cheek.', prompt: '**Tap** the cheeks.', next }`.
  His face and hers close up side by side, cheeks puffed (two consecutive `who` entries with the same
  `who` and the same `variant` are one face, its two cheeks: section 4), his two first; her count “6…
  12… 18… 24!”; the fourth tap turns
  the page to “TWENTY-FOUR?” under a big 24 (carried).

## 3. The Case File

Four new cards, one ear and three eyes, and two new links; and chapter 4's FLEW link drawn for
everyone from the FLEW screen on (section 1). Nobody says weasel or glass.

| id | Mark | Line as lettered | Given | To whom | Links |
|---|---|---|---|---|---|
| `waffles-no-moon` | ear | Waffles says there was NO moon on the storm night. | “The wind chime”: “You told me that on my second day…” / “Darling. EVERYTHING I say matters.” | everyone | `link: { with: ['fox-moon'], line: 'Two say no moon. Only the fox says moon.' }` |
| `my-count` | eye | My count: twenty-four gone in six nights. A dragon would take sixty. | told: the panel after the Hollow's sum choice; kept: the panel after the bridge's sum choice (section 5) | everyone (one id, both paths) | none |
| `prints-sprinkle` | eye | Sprinkle’s prints are huge. The thief’s are tiny. | “Under the Old Bridge”: “Hers are as big as Patience’s feet,” whispers Riffle… | everyone | none |
| `tunnel` | eye | A tunnel under the back of the pile, too small for a dragon. | “Always the back”: “It’s much too small for a dragon…” | everyone | `link: { with: ['coil-diggers'], line: 'Coil felt them. Now I’ve seen where.' }` |

- **The moon, answered by two witnesses.** Patience's card (chapter 5's `heron-no-moon`) already lies
  touching `fox-moon` ("One of them is wrong."). Waffles' joins the same row at its other end, so her
  file shows three in a row: Waffles' ear — "Two say no moon. Only the fox says moon." — the fox's ear
  — "One of them is wrong." — Patience's ear (`E.caseFile`'s `touch`: the fox's card is at an end of
  Patience's row, so Waffles' card is laid at that end; run in the engine's own order, Patience's card
  found first). **No `answers`** (call 2): `answers` lives on the claim's definition, chapter 4's
  `fox-moon`, so the engine cannot carry it from chapter 7 without editing chapter 4's card (which
  would also put "answered by …" into chapter 4's storyboard and the Case File's card data). It is
  stored only for chapter 10 anyway, and chapter 10 can read the links or add it then.
- **The tunnel touches Coil's card**: an eye beside an ear (`link.with` takes any cards). Both lie under
  the moss in her nest, so the link shows the Clan nothing.
- **The sum card keeps one mark, an eye** (the round-2 fidelity low, closed by the story's note): both
  numbers are her own count, the sixty worked from the ten fish a meal she already knew.
- **Pictures** (`app/art/cards.js`, keys = the ids), scratched as the others are, the shared motifs
  drawn one way:
  - **`waffles-no-moon`**: Waffles' head (flat face, round fluffy cheeks, the bow) under the same dark
    sky as `heron-no-moon` draws (clouds where the fox's card has its moon, nothing falling), since the
    three lie in one row. Label: "a fluffy cat’s head with a bow, under a dark sky: clouds, and no moon".
  - **`my-count`**: two straight lines scratched one above the other, the long one two and a half times
    the short one, “24” by the short and “60” by the long (the panel's own comparison). Label: "a short
    line and a long one, 24 and 60".
  - **`prints-sprinkle`**: one big print with five long claw marks, and beside it a tiny print, much
    smaller (the tiny print drawn as `prints-marsh` draws its prints). Label: "one big print with five
    long claws, and a tiny print beside it".
  - **`tunnel`**: the pile's mice in a row on a ground line, drawn exactly as `coil-diggers` draws them
    (the two lie touching), and at one end of the line the tunnel, **in lines only** (a card fills
    nothing, `cards.js`: "Lines only"): its mouth a small oval in the ground, hatched close inside so it
    reads dark, and from it two lines slanting down and in under the ground line, under the mice; a few
    root lines arching over the mouth. Nothing in it or coming out of it. It must look plainly unlike
    `sleet-den`'s "round den mouth with three short dry lines over it" (an arch standing on the ground,
    open, dry lines above), since chapter 10 has her pick cards from this file. Label: "a row of mice on
    the ground, and a tunnel going down under them, its mouth hatched dark, roots over it".
- **In her nest** (the den, `bark: 'auto', hidden: true`): Waffles' card goes along the mossy edge;
  `my-count`, `prints-sprinkle` and `tunnel` go **under the moss** with Sprinkle's two and Coil's, on
  every path (the story's notes; the bedtime caption "Three more curls go under the moss."): the sum
  names a dragon's sixty, the prints were under the Old Bridge, and the tunnel is not told to the Clan.
  Six secrets, a corner showing for each.
- She holds **18 to 24 cards** by bedtime (14 to 20 before, plus four for everyone).
- Not cards, on purpose: the dish ("I see your Tall One fill that dish"), the guards' nothing, "always
  the back", Glintstar's "A good count", the climber's tracks (`prints-tracks` already holds them),
  the sniff ("very faintly, mice") and the listen.

## 4. Art needs

No new place and no new cast: every place is a set chapters 1 to 6 built; the pile and the bridge gain
cameras and options, the hollow an option, and the den three more cards under the moss. **New** marks what the art must add; every option is off by default
and every camera and anchor additional, so chapters 1 to 6 draw byte-identically. Times of day:
`night` in the den at waking, `morning` in the garden, at the tower and at the pile, and in the Hollow;
`day` under the Old Bridge; `sunset` at the pile; `dusk` at the pile and round the back (from “The moon
comes out, fatter again.” on, `moon: 7`); `night` in the den.

### Places

| Set (file) | What the chapter uses | New |
|---|---|---|
| `pile` (`sets/pile.js`) | morning: `rows` with chapter 6's `{ rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], back: 'shadow', scale: 'behind' }` for the count, and the walk round (`tap: 'back'`); `gap` and `wide` with `{ rows: …, scale: 'behind', dug: 'big' }` after it. Sunset: `wide`/`low` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`. Dusk: the same, `moon: 7` from “The moon comes out” (`wide`, `low`); the slip round (`tap: 'back'`, `rows` or `wide`); round the back on `rear`; the mouth on `hole`; the climber on `wide` with `tracks: true`, our cat at `arch` | **Option `tap: 'none' \| 'back' \| 'roots'`** (default `'none'`), the target of a one-tap frame: an unpainted `<rect class="pc-tap" data-tap="…">`, as the marsh's `tap` and the pile's own `dug-tap` are; nothing painted, so a scene with it draws as it does without. `'back'` (on `rows` and `wide`): the back row's box (the shadow band under `back: 'shadow'`, else the back row and the strip of earth behind it). `'roots'` (on `rear` while `tunnel` is false): the low roots' box. **Camera `rear`**, a composition of its own (`comp: 'rear'`, as `gap` and `gap-close` are): round the back, at cat height, from behind the back row looking toward the pile's front and the camp. Nearest, the low roots of the bramble arch hanging over the ground; under and behind them the dug earth heaped (`dug: 'big'`), and at the heap's foot, under the roots, the tunnel's mouth (hidden while `tunnel` is false); beyond, the bare earth with the "scale" lying small on it (`scale: 'behind'`: a glimmer, well clear of the mouth), then the back row seen from behind (full at dusk: `rows: [10, 10, 10, 10]`), the other rows, and past the pile's front the camp at dusk; no sky (the arch is overhead), so `rear` takes no `moon`. Anchors **`rear-1`** (our cat, left of the mouth, facing right toward it), **`rear-2`** (right of the mouth, facing left: Tallyheart on the told path, where she sat the first watch: "And I SAT here… Right beside it!"), **`guard-1`**, **`guard-2`**, **`guard-3`** (small, past the rows at the pile's front: the first guards settling in, side-on as every cat is drawn, facing out over the camp, left or right as the composition has it, never toward the back). No cat at `rear-1` or `rear-2` stands on the mouth or hides it. Takes `rows`, `dug`, `scale`, `tunnel`, `tap`. **Option `tunnel: true`** (default false; on `rear`): the roots lifted back and, under them, the round dark mouth of a small tunnel in the dug earth, going down and in under the pile; false, the roots hang low over the heap's foot and nothing can be made out under them. **Camera `hole`** (`comp: 'hole'`): close on the mouth from behind, at cat height: the round dark hole in the dug earth under the lifted roots, going down, and in, under the pile, its far end dark; the back row's backs along the top edge. Much too small for a dragon: about as wide as a small cat's shoulders. Anchor **`brink`**: our cat crouched at its edge, facing it, so the size reads (the mouth as wide as her shoulders, never as wide as she is long). The "scale" may glimmer beyond, never in or beside the mouth. The roots are always lifted in `hole`. `hole` takes `rows`, `scale` and `dug` as `rear` does (its frames always carry `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`, and the back row's backs along the top edge and the glimmer are drawn from them) and ignores `tunnel` and `tap`. **Option `tracks: true`** (default false; on `wide`, at dusk or sunset only): far off past the towers, low at the horizon, the train tracks catching the last light, drawn to read on an iPad page (the panel about 680 px wide): a dark bed, the sleepers across it, two bright rails about 5 wide each over a soft glow, from near the middle of the panel, right of the climber, off behind the tallest tower (final review: two hairlines were missed). **Anchor `arch`** on `wide`: on top of the bramble arch over the pile, standing (the climber's look), as big as a cat by the back row (`h` 172; at 108 she was a speck: final review). `moon: 7` needs no change (chapter 6 made `moon` a number) |
| `bridge` (`sets/bridge.js`) | `back` with `{ prints: true, stones: true }` (the told path's first panel with `branch: true`, Sprinkle peeking over it); `wall` for Coil and Sprinkle's head (shared by both paths); `under` with `{ prints: true }` for the shared shots (the prints, the kept sixty and its comparison, Riffle's "even her FEET"); `print` for her paw over the print; `train: true` at most once | **Option `tap: 'none' \| 'print'`** on `under` (with `prints: true`): the nearest of Sprinkle's big prints beside the drag marks carries an unpainted `<rect class="pc-tap" data-tap="print">`, its box the print. **Camera `print`**, its own composition (`comp: 'print'`, as `wall` is): at cat height, close on the mud: one of Sprinkle's big prints in front (five long claw marks, as big as a heron's foot: the print `prints: true` draws, big), the drag marks' edge at one side. Anchor **`over`**: our cat crouched with chapter 5's `reach: true`, her near forepaw held just over the print's broad heel pad, the pad showing all round it and the five toes and long claws fanned out beyond it, toward us and clear of her foreleg, so the whole print reads round her paw with room to spare. The print is as big as the wide shots draw it (about four-tenths of her sitting height, as big as a heron's foot), so her paw is about a fifth of its length: the marsh's measure turned round, where her paw was twice a tiny print (built: integration round 1, after two reviewers found the first build's print, at half that size with its toes under her paw, read as her own claws out; its lit rim is drawn after her shadows). The set puts her reach line on the mud just above the print, as the marsh's `raft-edge` puts it on the log's lip. No spot of Tallyheart's. **Option `compare`** on `under`, declared `opts: { compare: [false, [24, 60]] }`, `defaults: { compare: false }` (a list of two numbers, the long line's length to the short one's as theirs; compared by value, as the pile's `rows` is: the story tests and the storyboard's `--check-words` take exactly this shape): two straight lines scratched in the open mud at the front, **right of `mud`, about x 980–1325, y 855–955 in the world** (digits about 42 tall, well off the panel's bottom edge: integration round 1 raised and enlarged the first build's, which sat at y 900–985, 34 tall, almost on the border), clear of the drag marks and the prints (which run from about (570, 1016) back toward (1040, 506)) and of every cast box at `mud`, at `inside` and at Riffle's spot for that panel (`{ x: 400, y: 940 }`, section 5); the long one two and a half times the short one, “24” scratched by the short line and “60” by the long one, in the scratched digits of chapter 5's answers in the sand; the group's box goes in the render's `keep`, so no balloon covers it. **Option `wing: true`** on `back` (final review), declared `[false, true]`, default false: Sprinkle's drooping wing, where her `wings` at `dragon` holds it out low toward `back-right` (x 1040–1440, y 630–780 in the world), goes in the render's `keep`, so no balloon covers it on the FLY pair (on the told panel our cat's “I KNEW it!”, the second balloon, landed on it); nothing is drawn, and off it is as before |
| `hollow` (`scenes.js`) | `wide` with chapter 5's five rim cats sitting up (`rim()`), Tallyheart at `tree-far`, `{ marks: 6, glow: 'auto' }` until SKRITCH; `lesson` for the lesson and the talk; `tree` with `{ marks: 7, glow: 'auto' }` for SKRITCH; every `hollow` frame after it `{ marks: 7, glow: 'auto' }`; the told comparison on `lesson` with `compare: [24, 60]`; after “bound off to breakfast” the rim is empty | **Option `compare`**, as the bridge's and declared the same (`[false, [24, 60]]`, default false; one drawing for both: one painter in `PC.art.kit`), on `lesson` and `sand`: the two lines and their numbers scratched in the sand between the two cats, the group's box in `keep`. **`marks: 7` draws as `markSpots` has drawn seven since chapter 1** (a call: section 9): four to a row, a little smaller (0.55), so at SKRITCH the six marks of the frames before shrink and stand four and three, the seventh beside the sixth, as the third mark relaid the first two in chapter 3. Nothing to change (the seven-to-ten layout is pinned by the chapters 1 to 3 fingerprint, which draws `marks: 10`); check it reads at `tree` and `wide` |
| `den` (`scenes.js`) | `nest` and `inside` at night, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }`; the grey tom at `sleeper-1` | **`hidden: true` also takes `my-count`, `prints-sprinkle` and `tunnel` under the moss** (`BARK_SECRET` gains the three: six secrets, a corner showing for each; chapters 4 to 6, whose files hold none of them, draw exactly as they do). **The row keeps chapter 6's room** (a call: section 9). Today `denBark` gives the row `T = 86 − 8·max(0, hid − 2)` (in k): 78 at three hidden, but 54 at six, which sets chapter 7's fullest nests 2.1 apart (24 cards) and 3.3 apart (18), a solid stack where Waffles' piece, which the bedtime caption names, cannot be told apart (measured; chapter 6's fullest is 5.3–6.1). So for `hid > 3` hold `T` at 78 (`86 − 8·min(1, max(0, hid − 2))`), which keeps each course's step at least 5k (`(78 − 38) / 8`, chapter 6's fullest), and lay the corners from t = 87k on, about 8k apart (they may run a little past the nest's middle, or stand as a second, staggered layer); `hid ≤ 3` draws exactly as today. Check the most she can hold tonight: 24 cards, six hidden, eighteen along the edge two deep (`BARK_MAX` is 24), both courses' steps at least 5k, six `data-bark="corner"`, every piece inside the `nest` camera; and 18 cards (six hidden, twelve along the edge) |
| `garden` (`scenes.js`) | `step` with `{ dish: true }`, morning: our cat on her old step, the dish full | nothing |
| `tower` (`scenes.js`) | `up` (our cat at `foot`, Waffles at `railing`: the panels where both speak), `balcony` (Waffles, `lift: true` where her chin would sink), `balcony-close`; `{ chime: true }` on every tower panel; morning | nothing |

### New cast

None (brief). Everyone on screen has been on screen before.

### The cast from before, new extras and the poses they use

- **Riffle**: **new** `tap: 'fish'`: in `stand` with `holds: 'string'` (chapter 6's reed string of three
  fish; chapter 6's scene rule pins the string to `stand`), the string marked for the page (an unpainted
  `pc-tap pc-tap-fish`, the string's box): the toss Tap.
  In `hush` for “…ten,” (a paw over his mouth). Never `juggle` under the Old Bridge, never `hug` in a
  frame that names Coil (the standing rules).
- **Sprinkle**: **new** `tap: 'mist'`: with `mist: true` (the little cloud of a burp) in pose `burp`, the
  cloud marked (`pc-tap pc-tap-mist`): the HURP Tap. Poses she has: `peek` (over Tallyheart's branch),
  `gulp`, `sit`, `wings` (both open, the right one drooping: “Her good wing goes up. Her hurt wing
  won’t.”), `curl` (her tail's loop is in front of her, so “She wraps her tail round you.” puts our cat
  in the loop, chapter 3's spot: section 5), `pawsup` (“I’m so happy I could FLY!”, chapter 3's happy
  pose; never `tailup`, her shy huddle), `burp`, moods `wonder` (every peek over the branch: big round
  eyes, as the caption names them), `happy`, `sad`.
- **Waffles**: `peer` at the railing (as chapter 2), `pawup` waving at the railing on `up` (check it
  reads at `up`'s small size), `puffed: true` (“She fluffs herself up.”), moods `shout`, `proud`,
  `dreamy`, `sniff` (“Ew.”), `solemn` (“NO moon.”).
- **Tallyheart**: `wink: true` (“She winks.”), `stretch` at `tree` (SKRITCH), `glow: true` at the ask,
  `kind` for “warm as a sunny stone”, `sit` with mood `laugh` for “Not THAT close.” (side-on, facing our
  cat, who stands nose to nose with her: the art has no leaning back, and the closeness is the joke).
- **Our cat**: `tap: 'ears'` (the look-up Tap), `tap: 'paw'` in `pawup` (the wave), `crouch` with
  `reach: true` at `over`, mood `sniff` (“Sniff the tunnel.”), `crouch` with mood `wonder` at `brink`
  for the listen (“Listen at the tunnel.”: the art has no ears-forward), `sit` with mood `proud` for
  “You feel taller.” (no tail-up extra; built with a cartoon stretch, `size: 1.12`, that panel only, so
  the beat has a picture and she is nearly level with Tallyheart's ear, integration round 1), `curl` with
  mood `kind` and **`asleep: 'half'`** as she curls up to sleep (half-shut lids and a small smile, never a
  cross face: `kind` alone looks out, wide awake, so the final review added the value `'half'` to chapter
  5's `asleep` extra in `cats.js`: heavy lids down to the middle of the eyes, sagging a little, whatever
  the mood, which keeps its own mouth and blush; `true` still shuts them; the next panel, f104, is asleep,
  `sleepy`).
- Every cat is drawn side-on, facing left or right: "facing away" in this spec means facing the other
  way along the panel, never a cat seen from behind.
- **Coil**: at `gap`, `stone` for “Quietly” (his head one more stone of the wall), `still` or `head`
  for “She can’t fly… Now, QUIET, please.”; eyes never shut, no tongue, no fangs, never toward a cat.
- **The old tom**: `holds: 'pinecone'` with `holdAt: 'paws'` at the morning count.
- **The guards**: at the morning count, three `clancat`s in one column at the left end of `rows`, listed
  back to front (`crowd-2`, `crowd-1`, `pile-left`), so each nearer cat is drawn over the one behind it and
  every face shows; at dusk on `wide`, the three at the pile's front face out, right, away from the pile
  and from our cat, over the camp (“Nobody is looking at you.”).
- {Murmur}chime, Glintstar, the grey tom, the black-and-white apprentice, `clancat` guards: poses
  they have.

### Counts art (`app/art/cats.js`)

All new; every one keyed so that no picture of chapters 1 to 6 changes (each is reached only by a
`kind` or a `thing` no earlier chapter passes, or by `PC.art.sand` at per 6: the shipped chapters'
`thing`s are `tail`, `ear`, `claw`, `front claw`, `cat`, `piece`, `life`, `fish`, `bump`, `leg in the water` and `HERE`).
**Per 6 alone is never a key for `countsPicture`**: no chapter before 7 draws per 6, but chapter 1's
counts fingerprint (`tests/cats.test.js`, "chapter 1’s counts pictures are unchanged") sweeps
`countsPicture({ table: 6, groups, highlight })`, no kind and no thing, so table 6's old pebble cats
must draw as they do and that hash must hold. **The game's cats keep
two whiskers a side** (the orchestrator's known issue "counting"): every six-whisker cheek below is a
close-up in a Counts picture, and no character drawing changes.

- **Cheeks, the 6s** (`countsPicture({ table: 6, per: 6, groups, highlight, kind?, who?, totals?, next?
  })`, with `kind: 'cheeks'` or `'cheeks-top'` (the lesson, its fillers and retries, the 6s' Hollow
  rounds), or at per 6 with `thing: 'whisker'` and no kind (the skip-counts: `E.skipPicture` passes the
  skip's `thing` and no kind); per 6 with neither draws as today): each group one cheek close up, a
  rounded cheek and the edge of a muzzle in a cat's coat, with six whiskers in two rows of three (three
  whisker dots in each row, each whisker a thin curve fanning out), plainly "three on top, three
  below". Coats: each `who` entry's, else the rim's coats in order (`clancat` 1, {Murmur}chime's
  tortoiseshell, `clancat` 3, `clancat` 5, the old tom's), round again; never her coat
  (`PC.art.clanVariant`). **One to ten cheeks**, up to five a row (six to ten: five, then the rest):
  the lesson asks two to eight, but `E.hollowDef(stories, 6)` clones `ch07-sixes`, cheeks picture and
  prompt included, so a 6s Hollow round asks 1 × 6 to 10 × 6 in both orders and needs one, nine and
  ten (6 × 1, 6 × 9, 10 × 6; a simulated round 1 gave 8, 6, 9, 4, 10, 3, 2, 7, 5 and 1). `highlight`
  lights whiskers in order, cheek by cheek, each cheek's top three then its bottom three (6 × 6's
  `lit: 30` is five whole cheeks). **`'cheeks-top'`**: every cheek's top three lit from the start
  whatever `highlight` says, the bottom rows lit only as `highlight` reaches them (so the right answer
  lights all). **In a skip** (`totals`, `next`): the running total under each cheek, the next one
  glowing. **The face rule**: in a `who` list, two consecutive entries with the same `who` and the
  same `variant` (both absent counts as the same) are one character's face close up, its two cheeks
  side by side, both puffed round, one group each; pairs are taken from the left, so the entry after a
  pair starts afresh. Entries that differ only by `variant` are two cats: `RIM`'s `clancat` 3 and
  `clancat` 5 are two cheeks of two cats, so the five cheeks are five rim cats each turning a cheek.
  The default coat order never makes a face: faces come only from an explicit `who`. So: the five
  cheeks (`who: RIM`) are five cheeks; the bedtime list (`[snorer, snorer, player, player]`) is two
  faces, the grey tom's then hers from her look; the lesson's 2 × 6 (`ONE_CAT`, section 2) is one
  `clancat` 1's face; a lesson or Hollow picture with no `who` is that many separate cheeks. Label "N
  cheeks, six whiskers each".
- **One cheek close up** (`table: 3, per: 3, groups: 2, thing: 'whisker'`, no kind; dispatched on
  `thing: 'whisker'` before the 3s' patrols): one big cheek, `who[0]`'s coat (Tallyheart's ginger
  tabby), six whiskers, the top row of three the first group and the row below the second;
  `highlight` 3 lights the top row, 6 both; `totals` puts 3 and 6 beside the rows; `next` glows on the
  next row. Label "One cheek: two rows of three whiskers".
- **The gaps** (`table: 1, per: 1, groups: 4, thing: 'gap'`; dispatched on `thing: 'gap'` before the
  1s' tails): the back row close up on the earth, three pieces, four empty pressed places, three
  pieces (`PC.art.prey`, mice and voles, eyes shut, as the pile draws them); each empty place a group,
  the next glowing, a lit one outlined in gold; `totals` 1 to 4 under them. Label "The back row: four
  empty places".
- **Marks, the nights** (`kind: 'marks'`, per 4 or 10, table 4 or 10; dispatched on the kind before
  the 10s' forepaws): the nights side by side in one row (one to six), each night a cluster of `per`
  short upright scratches (four in a row; ten as two rows of five), a clear gap between nights, and
  nothing else to count (no moon, no number); on sand, or with `ground: 'mud'` on the bridge's mud.
  `highlight` lights the marks in order, a night at a time (the help `help: 'picture'` lights it so).
  Label "N nights, M marks each".
- **The sand at per 6** (`PC.art.sand({ groups, per: 6, counted })`, the lesson's help and the 6s'
  Hollow rounds, **one to ten groups**): each group scratched as two short rows of three, one above the
  other, lit in order, top row then bottom, group by group. (Today per 6 would scratch a row of five
  and one more; no chapter has asked for it.)
- From before, unchanged: the patrols (the warm-up and its fillers), the prey rows (the pile), the
  sand at per 3 and per 10.

### Heard, not seen

The wind chime's ring (*Ting-a-ling.*, lettered); whoever dug the tunnel (nothing at its far end,
nothing in it); the fox (named only).

## 5. Build notes

General rules for the story builder, then screen by screen where a screen needs one. Chapter 6's
file (`app/story/ch06.js`) is the model: its helpers (`c`, `S`, `merge`, `RIM`, `rim()`), frame ids in
reading order with letters for outcomes, a `board` on every frame.

- **Speakers.** No `names` map: everyone on screen is named. Coil's “Quietly,” (“says a voice in the
  stones”) is his balloon with Coil at `gap` in pose `stone` (his head one more stone; `faceHidden`, so
  no face in a stacked balloon), labelled "Coil" as the page labels him (call 19); his last line (“She
  can’t fly,” says Coil, from the stones) has him at `gap` in `still` or `head`. Every speaker is in the
  frame's cast (chapter 5's test).
- **Captions first, then balloons** (chapter 5's rule). Where the story puts narration after a balloon
  on one screen, the panel is split, or the narration opens the next panel (a `when` caption there if
  it is one path's). The screens where the order matters:
  - “{petname}! DARLING!” / Princess Waffles leans over her balcony.: the shout alone on `up`; the
    caption opens the next panel, over “You came BACK!…”.
  - “A WITNESS?” / She fluffs herself up. / “Darling, I was BORN for this…”: her call up and Waffles'
    shout on `up` (both in the panel); the caption opens the `balcony` panel over the rest (`puffed: true`).
  - “I see your Tall One fill that dish…” / Between the towers, the sun peeks up. The count! / “Go,
    {petname}…”: the dish line a panel of its own; the caption and “Go, {petname}…” on the wave Tap's
    panel.
  - “Four gone,” you say. / Still tidy. Still the back. / “FOUR?”… / The last guards look at their
    paws.: her line a panel of its own; “Still tidy. Still the back.” opens the next with {Murmur}chime's
    “FOUR?…”; “The last guards look at their paws.” opens the next with “Tallyheart stares at the gap.”
  - “But why is it ALWAYS the back?” you ask. / Nobody knows.: the caption opens the next panel, over
    Glintstar's “Four more…”.
  - “Speaking of whiskers… Come close. Closer.” / You come VERY close. / “Not THAT close.” / She turns
    her cheek to you.: Tallyheart's line alone; “You come VERY close.” and “Not THAT close.” (our cat
    nose to nose with her; Tallyheart `sit`, mood `laugh`, facing her: section 4); “She turns her cheek
    to you.” opens the whisker Tap.
  - “Now,” says Tallyheart. “Glintstar’s question.” / In the sand she scratches…: her line alone; the
    caption is the twenty-four's Counts frame.
  - “Now, a dragon… I know one who eats ten fish a meal.” / She winks. / “If she were our thief…”: the
    first balloon alone; “She winks.” and the second balloon are the told sixty's Counts frame
    (Tallyheart `wink: true`).
  - Kept: “Twenty-four pieces in six nights,” / She frowns at the sand. / “Four a night… For a DRAGON.” /
    You KNOW a dragon…: the first balloon alone; the caption and the second balloon; then “You KNOW a
    dragon who eats ten fish a meal! But you can’t say so without saying who.” a panel of its own (her
    thought: the caption only).
  - Tallyheart looks at you… / “Everybody in camp says ‘dragon’…” / You feel taller…: the caption and her
    balloon; “You feel taller. Almost as tall as Tallyheart.” a panel of its own (our cat `proud`, sitting
    tall), both paths.
  - Kept: “Back by sunset…” / Your ears go hot.: the caption opens a panel of its own (our cat `shy`,
    ears flat) before the Old Bridge, as chapter 6's did.
  - “I KNEW I didn’t do it… now the NUMBERS know!” / She wraps her tail round you…: the balloon alone;
    the caption with Sprinkle in `curl`, our cat at `beside`.
  - “I’m so happy I could FLY!” / She lifts her wings. / Her good wing goes up. Her hurt wing won’t. /
    “Oh. Not yet.”: the first balloon alone; the captions and “Oh,” she says. “Not yet.” (`wings`, `sad`).
  - “For once… I’m GLAD I can’t fly!” / She’s so happy, she burps a little cloud of mist. *HURP.*: the
    told or kept line and Sprinkle's in one panel; the caption, the sound and the mist Tap the next.
  - “Twenty-four,” you say. “Four every night. Guards or no guards.” / You don’t say sixty. Not without
    saying who.: the caption opens the next panel, over Glintstar's “Twenty-four. A good count.”
  - Told: “I want to see the back,” you whisper. / Tallyheart’s ears go up. / “Let’s look.”: the
    section's first caption (“At dusk, the first guards take their places…”) and her whisper over the
    dusk pile; then “Tallyheart’s ears go up.”, her “Let’s look.” and the slip Tap. On the told path
    the sneaking line (“Your paws go silent. Not one guard looks round.”) opens the roots panel (a `when` caption, first); on the kept
    path it stays on the slip Tap, after the guards' caption, as the story has it.
  - “{name}paw?” whispers the grey tom. “Do the paw thing.” / “It’s whiskers tonight… Hold still.” /
    He puffs out his cheeks. You puff out yours.: the two balloons in the den; the caption is the
    bedtime skip's.
  - “TWENTY-FOUR?” he mumbles… / Soon he’s snoring.: the caption opens the last panel, before
    “Somewhere, that tunnel comes out. Where?”
- **Long captions** (chapter 5's rule: one that can be lettered on the panel is at most 95
  characters; longer, it is split at a sentence break into boxes, the words unchanged): “Behind the back
  row is the dug earth…” (121), “Always the back. Why? Then you remember Coil…” (120: “Always the back.
  Why?” / “Then you remember Coil, in the stones:” / “‘Small diggers…’ UNDER!” as the box allows), the
  climber's (136), “When she lets go, you look down…” (161), “Seven claw marks on the tree…” (101), “You
  nearly call Tallyheart…” (121), “The guards are still settling in…” (98), “Tallyheart takes you
  straight to the Old Bridge…” (123).
- **Paths in the picture.** A scene cannot vary by flag. Tallyheart is in the Hollow on both paths
  (the warm-up to the twenty-four, and the warm screen), and in camp at the pile on both. On the told
  path she also goes to the Old Bridge and round the back at dusk; on the kept path she does not. A
  frame whose picture holds one of her spots, or whose lines are hers, is two frames by `ch3Told`, one
  after the other, with opposite `when`s (chapter 6's rule). The close shots with none of her spots are
  written once: the bridge's `wall` (Coil, Sprinkle's head), `under` (the prints, the sixty, the feet)
  and `print`, and the pile's `hole`. **A choice only one path sees** (the told sum's, the kept sum's,
  the told and kept twins of "So THAT’S why…") carries `when` and an `else` (chapter 4's roof offer), so
  the other path's reader is turned straight to her own frame.
- **Sound effects** as the story letters them: *Ting-a-ling.* (the step panel, with `sfxAt` near the top
  edge, so it rings from far up; its caption ends a sentence, so no `sfxRead`), *Gulp. Gulp. Gulp.*,
  *HURP.* (by Sprinkle's mouth, `sfxAt`), *SKRITCH!* (the tree), *skritch, skritch.* (lower case: small
  and pale; the nest's “In your nest:” runs on into it: `sfxRead: 'skritch, skritch.'`, as chapter 6's).
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; the target is the cast extra or the set's
  `tap` mark of that name; no `miss` line, the glow wobbles). The story's response is drawn on the next
  panel (chapter 6's call 13):

  | Screen | `tap` (who or what carries it) | `prompt` | `label` | Next panel shows |
  |---|---|---|---|---|
  | Far, far up, a wind chime rings | `ears` (our cat at the garden `step`, `sit`, `wonder`) | `**Tap** to look up.` | `Look up.` | the tower from the step: Waffles at her railing |
  | Go, {petname}. Be FABULOUS | `paw` (our cat at the tower's `foot`, `pawup`, already waving; Waffles at `railing` in `pawup`, waving back) | `**Tap** to wave goodbye.` | `Wave goodbye.` | the pile (the wave is the tap) |
  | The back row is still in the shadow | `back` (`pile`/`rows`, `back: 'shadow'`, `tap: 'back'`) | `**Tap** to walk round the back.` | `Walk round the back.` | the gap skip: the back row, out of the shadow |
  | FISH! | `fish` (Riffle, `holds: 'string'`) | `**Tap** to toss her one.` | `Toss her a fish.` | Sprinkle gulping (*Gulp. Gulp. Gulp.*) |
  | Her prints are still in the mud | `print` (`bridge`/`under`, `prints: true`, `tap: 'print'`) | `**Tap** a print to hold your paw over it.` | `Hold your paw over a print.` | her paw over the print, room to spare (`print`) |
  | She burps a little cloud of mist | `mist` (Sprinkle, `burp`, `mist: true`) | `**Tap** the little cloud of mist.` | `Puff the mist away.` | Coil from the stones; no mist |
  | Slip round the back (dusk) | `back` (`pile`/`rows` or `wide` at dusk, `tap: 'back'`) | `**Tap** to slip round the back.` | `Slip round the back.` | round the back (`rear`, the roots down) |
  | The bramble roots | `roots` (`pile`/`rear`, `tunnel: false`, `tap: 'roots'`) | `**Tap** the bramble roots.` | `Lift the roots.` | the mouth (`hole`) |

- **Cards on their frames**: `waffles-no-moon` on “You told me that on my second day…”; `my-count` on
  the panel after each sum choice (told: the caption “The Counts don’t lie.”; kept: Riffle's whisper
  “The Counts don’t lie.”), both options leading to that one panel (call 22); `prints-sprinkle` on
  Riffle's “Hers are as big as Patience’s feet…” (on `under`, shared); `tunnel` on “It’s much too small
  for a dragon…” (on `hole`, shared). No card's line is said on its frame, so each is lettered.
- **The FLEW screen** (“The fox says it FLEW. Sprinkle can’t fly.” / “They can’t both be true.” and its
  choice, both options to the next screen, no outcome panel) carries `sets: { ch7Flew: true }`. Written
  once if its picture has none of Tallyheart's spots (`under`: Sprinkle in `wings`, the right one
  drooping, at `inside`; our cat at `mud`), else as a told and kept pair, both with the `sets`, each
  with `when` and `else` (a choice has two ways on).

### The wind chime

- Waking: `den`/`nest`, `night`, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden:
  true }`, our cat sitting up in her nest, ears up (`wonder`); captions only.
- The step: `garden`/`step`, `{ dish: true }`, `morning`, our cat at `step` (the look-up Tap). Then
  chapter 2's staging: `tower`/`up` with `{ chime: true }` (Waffles at `railing` in `peer`), `balcony`,
  `balcony-close`; a panel where both speak is `up` (our cat at `foot` looking up, Waffles at
  `railing`), else her lines are on the garden `step` looking up and Waffles' on the balcony.
- The grass choice: two options, `sets: {}`, outcome panels `a` (“I KNEW it,” sighs Waffles: `dreamy`)
  and `b` (“Ew. Tell me no more.”: `sniff`), both on to “Waffles, I need a witness”.
- The wave: `tower`/`up`, `morning` (the sun between the towers), our cat at `foot` in `pawup` with
  `tap: 'paw'`, Waffles at `railing` in `pawup`.

### The sixth count

- The count: `pile`/`rows`, `morning`, chapter 6's shade (`{ rows: [10, 10, 10, { n: 10, gap: [3, 4, 5,
  6] }], back: 'shadow', scale: 'behind' }`), the last guards yawning at the front (three `clancat`s,
  `sleepy`), the Clan round, Tallyheart and our cat at the front rows. Counts frame `{ set: 'ch07-pile',
  intro: false }`. Then the walk-round Tap (`tap: 'back'`), then the gap skip (its storyboard scene
  `gap` with `{ rows: …, scale: 'behind', dug: 'big' }`), then her “Four gone.” on `gap`.
- {Murmur}chime, the old tom (`holds: 'pinecone', holdAt: 'paws'`), Glintstar at `fountain-edge` on
  `wide`; nobody is blamed (no `stern` at anyone; the guards `shy`, looking at their paws).

### Whiskers

- The warm-up: `hollow`/`wide`, `morning`, `rim()`, Tallyheart at `tree-far` (`size: 1.2`), our cat at
  `sunpatch-2`, `{ marks: 6, glow: 'auto' }`; Counts frame `{ set: 'ch07-threes', intro: false }`.
- The whisker Tap on `lesson` (the board: Tallyheart's cheek turned to our cat, close); its kept page
  (“Six whiskers on one cheek…”) shows the cheek picture in play.
- The five cheeks: the skip on `wide` with the rim (the board: the five rim cats turning a cheek each).
- The ask on `wide`, `{ marks: 6, glow: 'auto' }`, Tallyheart at `tree-far` with `glow: true`, our cat
  at `sunpatch-2`; its own `say` the two balloons before it (“Thirty! Now, a secret…”, “I DO?”).
- The lesson: Counts frame `{ set: 'ch07-sixes', intro: false }` on `lesson`, `{ marks: 6, glow: 'auto'
  }`. Then SKRITCH! on `tree` with `{ marks: 7, glow: 'auto' }` (captions “Tallyheart stretches up the
  leaning tree.” and “A seventh claw mark.”, the sound), then `wide` with `{ marks: 7, glow: 'auto' }`
  for “Whiskers. That’s your seventh Count.” and the two `lessonClean: 'ch07-sixes'` pairs (balloons with
  `when`, as chapter 6's f014). Every `hollow` frame after it is `{ marks: 7, glow: 'auto' }`.

### Can’t be fooled

- “The cats on the rim bound off…”: `hollow`/`lesson`, the rim empty (one `clancat` trotting off at a
  spot of its own on the rim, if the board wants one).
- The twenty-four: Counts frame `{ set: 'ch07-gone' }`, scene `hollow`/`sand` (the board: Tallyheart
  scratching four marks for every night); the caption is the frame's, the question the fact's. Tallyheart
  `crouch` with `claws: true` (her claws out on the forepaw at the sand, so the panel shows the scratching
  its caption reads aloud: `pawup` on `sand` takes her head out of the panel; final review). The marks
  themselves are the Counts picture's.
- Told: the sixty's Counts frame `{ set: 'ch07-dragon' }` with `when: { ch3Told: true }`, caption “She
  winks.”, Tallyheart's “If she were our thief, that’s ten every night.” (said again over the
  question); then the comparison on `lesson` with `compare: [24, 60]` (told only), then the told sum
  choice (`when` and `else`), its one outcome panel with the caption “The Counts don’t lie.” and the card.
- Kept: the three panels (Tallyheart's “Twenty-four pieces…”, “She frowns at the sand.” with “Four a
  night… For a DRAGON.”, and her thought), `when: { ch3Told: false }`.
- Both: “Tallyheart looks at you, warm as a sunny stone.” with “Everybody in camp says ‘dragon’. But you
  counted. A warrior who knows {their} Counts can’t be fooled.” (the `{their}` token, as the story
  means it), then “You feel taller…”; kept, “Back by sunset…” and “Your ears go hot.”

### Under the Old Bridge

- The arrival, by path: told, `back` with `{ prints: true, stones: true, branch: true }` (the told
  path's first panel only, as chapters 4 and 6), Sprinkle `peek` at `dragon` over the branch,
  Tallyheart at `near`, Riffle in `stand` at `back-right` with `holds: 'string'` and `tap: 'fish'`, our cat at
  `back-left`; kept, `back` with `{ prints: true, stones: true }`, the same without Tallyheart and the
  branch. Both carry the toss Tap.
- *Gulp. Gulp. Gulp.* and the told/kept lines: a pair on `back` (told: “Tell them,” says Tallyheart;
  Riffle's “It’s TRUE!…”; kept: her “Four every night.”, Riffle's “TEN!…”).
- “Quietly,” / “…ten,” whispers Riffle: `wall` (Coil `stone` at `gap`, Riffle `hush` at `back-right`,
  our cat at `back-left`, Sprinkle's head at `dragon`): once, both paths.
- Kept only: the sixty's Counts frame `{ set: 'ch07-riffle' }` with `when: { ch3Told: false }` on `under`
  (its balloon Riffle's whisper “If SHE were the thief, she’d take ten every night.”); the comparison on
  `under` with `{ prints: true, compare: [24, 60] }` (our cat at `mud` facing right, scratching, `pawup`,
  `claws: true`; Riffle at `{ x: 400, y: 940 }`, chapter 6's three-shot spot, facing right; Sprinkle at
  `inside`; the lines lie right of `mud`, clear of all three: section 4); the kept sum choice (`when`,
  `else`) and its one outcome panel with Riffle's whisper and the card.
- “Sprinkle’s eyes go round…” on `wall` (once; our cat and Riffle facing right, up at her, and her two lines
  in one balloon, the same words in the same order, so the first one's tail never runs under the second).
  “I KNEW I didn’t do it…” and the tail round you on `back` (pairs: Sprinkle `curl` at `dragon`, listed
  first; our cat in the loop of her tail in front of her, chapter 3's spot for the same hug,
  `{ x: 750, y: 822 }`, `size: 0.9`, facing right: she faces left, so the loop is on her left, never at
  `beside`, against her right flank; Tallyheart at `near` on the told path).
- The prints: `under` with `{ prints: true, tap: 'print' }`, our cat crouched at `mud` looking down (once);
  then `print` with our cat at `over` (`crouch`, `reach: true`), “Your whole paw fits inside, with room to
  spare.” and her balloon about the marsh prints (once); then Riffle's line and the card on `under`
  (Riffle at `{ x: 400, y: 940 }`, chapter 6's three-shot spot).
- FLY: “I’m so happy I could FLY!” (Sprinkle `pawsup`, `happy`, chapter 3's happy pose: never `tailup`,
  her shy huddle) and the wing (`wings`, `sad`), then the FLY lines (a told and kept
  pair: told, the caption “Tallyheart goes very still.” or “Tallyheart looks at you.” by specialty and her
  balloon; kept, “Riffle stops wiggling.” and his; on both, “I KNEW it!…” with `{ specialty: 'noticing',
  ch4CaughtFly: true }`; on the told panel Tallyheart stands by the wall behind our cat, at
  `{ x: 300, y: 960, h: 330 }`, facing right, listed after Sprinkle and before our cat, so nobody stands in
  front of the hurt wing, the evidence the chapter turns on: across the nook she hid it, final review; both
  panels take `wing: true`, so no balloon covers it either), then the FLEW screen (`sets: { ch7Flew: true }`, above), “No moon, and no
  flying” (pair), the Gathering and Sprinkle's “I’m GLAD I can’t fly!” (pair), the mist Tap on `wall`
  (once: Sprinkle's head at `dragon` in `burp` with `mist: true, tap: 'mist'`, *HURP.* by her mouth), and
  Coil's last line on `wall` with “Sorry, Coil,” everybody whispers. as the panel's caption, quote and
  all (call 20). On the mist Tap our cat and Riffle face right, laughing at her.

### A good count

`pile`/`wide` (and `low`), `sunset`, `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`, the Clan
at the `crowd-*` spots, Glintstar at `fountain-edge`, the old tom, Tallyheart, our cat. No moon yet.
Glintstar hears twenty-four and never sixty.

### Always the back

- Dusk at the pile, `wide` or `low` with `moon: 7` from “The moon comes out, fatter again.”, the first
  guards (three `clancat`s) settling in at the front. Told: the frame with her whisper, then “Tallyheart’s
  ears go up.” / “Let’s look.” with the slip Tap; kept: the guards' caption, the sneaking line and the
  slip Tap. The Tap's scene `rows` (or `wide`) with `tap: 'back'`.
- Round the back on `rear` (`{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tap: 'roots' }`;
  `rear` shows no sky, the arch overhead, so it takes no `moon`): our cat at `rear-1`, Tallyheart at `rear-2`
  on the told path (pair); the guards small at `guard-1`…`guard-3`, side-on, facing out over the camp;
  captions: (told) the sneaking line,
  then the noticing or not-noticing line, then (told) “A snake’s secret,” whispers Tallyheart.
- The mouth on `hole`, every `hole` frame with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`
  (no `tunnel`: the roots are always lifted there), our cat at `brink`, or nobody: “Under the roots… It’s
  the mouth of a tunnel.”
  (once), then “It’s much too small for a dragon…” with the worry captions and the `tunnel` card (once).
- “So THAT’S why it’s always the back…” and the choice: `rear` with `tunnel: true`, a told and kept pair,
  each with `when` and `else`. On the told path her whisper is a panel of its own first (`when` only,
  passed over by a kept reader), and “And I SAT here,” whispers Tallyheart, with the choice on the next
  (Tallyheart `wonder`, astonished, never scared): one panel with both whispers ran our cat's balloon tail
  through Tallyheart's balloon, so the page joined them as one speaker (integration round 1). The two
  outcome panels `a`
  (sniff: our cat `crouch`, mood `sniff`, at `brink`) and `b` (listen: our cat `crouch`, mood `wonder`,
  at `brink`) on `hole`, shared,
  their captions the story's parentheses (“Earth. And, very faintly, mice.” / “Not a sound. Whoever dug
  it isn’t here.”).
- The climber: one frame `when: { specialty: 'climbing' }`, straight after the outcome panels: `pile`/
  `wide`, `dusk`, `moon: 7`, `tracks: true`, our cat at `arch` (standing, looking out); nobody else needs
  to be drawn.
- The last two screens: told and kept pairs on `rear` with `tunnel: true` (told: Tallyheart at `rear-2`;
  kept: our cat alone, the guards far off).
- Nobody goes in, nobody says weasel, nothing is drawn in the tunnel or at its far end; the "scale"
  stays where it lies, clear of the mouth.

### Seven claw marks

- The nest: `den`/`nest`, `night`, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden:
  true }`, our cat lying down (so the stone is under her chin or by her nose, as the caption says);
  captions “In your nest:” (with the sound and `sfxRead`), “Waffles’ curl of bark goes along the mossy
  edge. Three more curls go under the moss.”, the `ch2Stone` lines, and the summary (two boxes).
- The grey tom on `inside` (`sleeper-1`), then the bedtime skip, then “TWENTY-FOUR?” under the big 24,
  then the last panel (`zzz` on him): “Soon he’s snoring.”, “Somewhere, that tunnel comes out. Where?”,
  the told or kept line, “You curl up tight, warm and safe, and sleep.”
- Chapter end: the dream input (“What did {name}paw dream, the night the Counts didn’t lie?”), then the
  end frame, as chapter 6's.

### The book

The story builder writes it; proposed (seven entries on every path, some of two or three sentences; the cat named, never two
different he's in one sentence):

1. `Before the sun was up, {name}paw asked Princess Waffles about the storm night. NO moon, she said, not a sliver: two witnesses against one fox.`
2. `At the sixth morning count, four more pieces were gone, though eighteen guards had watched all night: twenty-four in six nights.`
3. `Tallyheart taught {name}paw {their} seventh Count, whiskers: the sixes.`
4. *(told)* `Then {name}paw and Tallyheart worked it out: four a night for six nights is twenty-four, but a dragon who eats ten fish a meal would have taken sixty.`
   *(kept)* `{name}paw and Tallyheart counted twenty-four in six nights. Under the Old Bridge, {name}paw and Riffle worked out that a dragon who eats ten fish a meal would have taken sixty.`
5. `Under the Old Bridge, Sprinkle’s prints were huge; the thief’s, in the marsh, were tiny. Sprinkle tried to fly, and couldn’t, so Reynard’s story that the dragon FLEW can’t be true.` (The thief's tiny prints are in the marsh mud, never under the bridge; "Sprinkle", not "she", since the cat may be a she too. As built after integration round 1: the proposed "…couldn’t. Reynard said the dragon FLEW: they can’t both be true." left "they" for a child to read as Sprinkle and Reynard, so the two claims are named; still two sentences.)
6. *(told)* `At dusk, behind the back row, {name}paw and Tallyheart found the mouth of a tunnel under the bramble roots, much too small for a dragon.`
   *(kept)* `At dusk, behind the back row, {name}paw found the mouth of a tunnel under the bramble roots, much too small for a dragon.`
7. `That night, the grey tom and {name}paw counted their whiskers: twenty-four, between them.`

`dream: '{name}paw’s dream: “{dream}”'`; `noDream` e.g. `'{name}paw’s dream that night went uncounted.'`.
No dragonet page (nobody new is found).

### The teaser

Chapter 8, *The Night Trail* (not built): `{ title: 'Chapter 8: The Night Trail', lines: ['Tomorrow
night, a trail in the dark.', 'Where does that tunnel come out?'] }` (curious, never scary; who walks it
is the bedtime line's). Chapter 6's teaser stands (its title is this chapter's, and both its promises
are kept: the sixth morning count after a night of guards; the pile did not add up).

### Tests the story builder adds (`tests/story-ch07.test.js`, beside chapter 6's)

- Every Counts set exactly as section 2, and the runs section 2 cites: each lesson miss comes back two
  questions later, and a single miss before its twin; a missed 6 × 8 is still in `E.hardFacts(cat, 6)`
  after a quick 8 × 6 (a check); the warm-up's hard pick (7 × 3 when nothing; never 1 × 3, 3 × 2, 3 × 9,
  3 × 10, 3 × 4 even when slow there; a chapter-6 miss of 3 × 8 opens on 3 × 8 with “Yesterday…”); the
  twenty-four's help hops 4 to 24, its fillers are 2 × 6 then 6 × 3 in the cheek picture and never
  6 × 6, its log entry has `table: 4`, `E.tableOf` files it under 4, and `E.countSets` gives table 6 to
  `ch07-sixes` and no set to table 4; the sixty's fillers are 1 × 10 then 10 × 2 on both paths; 15 typed
  answers on every path; the Hollow offers "Whiskers · the 6s" and the tree has seven marks only after
  the lesson.
- `ch7Flew` is set on the FLEW screen and nowhere else, on every path; no frame or option of chapter 7
  sets `ch4CaughtFly`; her Case File draws `fox-flew` and `cant-fly` touching from that screen on for
  every cat, and before it only for a cat with `ch4CaughtFly`; “I KNEW it!” only with `specialty:
  'noticing'` and `ch4CaughtFly`.
- The four cards on their frames on every path; `my-count`, `prints-sprinkle` and `tunnel` hidden in the
  den, Waffles' in the row; Waffles' card in a row of three with `fox-moon` and `heron-no-moon`, both
  lines; `tunnel` touching `coil-diggers`.
- Every `ch3Told` pair; the path-only choices with `when` and `else`; the skip-counts and the ask as
  section 2 (tables, groups, `who`, `keep`, `carry`); each one-tap target present in the art.
- Coil never in a pose that closes his eyes or shows a tongue; Riffle never in `juggle` under the
  bridge, never in `hug` in a frame that names Coil; nobody says weasel or glass; no "whisker-length".
- Every caption at most 95 characters on a panel; the nest's caption runs into its sound with
  `sfxRead`; the book on every path (seven entries, no token left unfilled, a tom's pronouns); the
  teaser.

## 6. Engine needs

**None: no new key and no new behaviour.** Every interaction is one chapters 1 to 6 built: a choice
(with `when` and `else` where one path sees it), typed answers, `skip` (one to five groups, `who`,
`keep`, `carry`), `ask`, one-tap `scratch` frames on a cast extra or a set's mark, frame `when`,
sticky `sets`, cards with `link.with`, `lessonClean`, `sfxAt` and `sfxRead`, the dream input. The
Counts keys are all in section 2 and all exist (`table` on a fact, `picture.kind` on a fact,
`help: 'picture'`, `fillVoice` with and without `fillPicture`, `avoid`, `warmHard.avoid`, `check`,
`lit`, `retryPrompt`, `rightAgain`, `miss`/`missLast` on a fact). The OR in chapter 4's link is
`E.matches`' own `not`.

Code beside the engine, the words owner's (section 10's owners):

- `E.VERSION = '0.7.0 (chapter 7, <ship date>)'` and its assertion.
- `app/story/ch04.js`: the one link edit (section 1), and chapter 4's test that pins the link
  (`tests/story-ch04.test.js`, which asserts the old `when` word for word).
- `PC.ui.flagWords.ch7Flew` (section 1). No new speaker, voice or `faceHidden` pose.
- `tools/storyboard.mjs`: words for every new name in section 4 and the Counts art: the pile's
  cameras `rear` and `hole` (in `SET_CAMS.pile`, since the global word for a `hole` or `rear` camera
  must not be guessed), anchors `rear-1`, `rear-2`, `guard-1`…`guard-3`, `brink`, `arch`, options
  `tunnel`, `tracks` and `tap` (`back`, `roots`); the bridge's camera `print` (in `SET_CAMS.bridge`),
  anchor `over`, options `tap` (`print`) and `compare`; the hollow's `compare`; the cast extras
  `tap: 'fish'` and `tap: 'mist'` (`TAPS`); the one-tap names `ears`, `paw`, `back`, `fish`, `print`,
  `mist`, `roots` where a frame taps them; the Counts pictures `kind: 'cheeks'`, `'cheeks-top'` and
  `'marks'` (with its ground), the skip-counts on `thing: 'gap'` (the back row's empty places),
  `thing: 'whisker'` at table 3 (one cheek's two rows) and at table 6 (cheeks; a `who` pair as a
  face, puffed), and the sand at per 6 (three and three). `compare` is declared `[false, [24, 60]]`
  (section 4), and the words owner's `more.json` uses that shape. `whenWords` reads a `not` whose every
  value is `false` as "ch4CaughtFly or ch7Flew is true" (no shipped `when` has such a `not`, so nothing
  else prints differently; today the row reads "once not (ch4CaughtFly is false or not set and ch7Flew
  is false or not set)", run). **The den's `hidden` words** are count-free: today "two of the pieces of
  bark under the moss, two corners showing" (`tools/storyboard.mjs`), already wrong for chapter 6's three
  and wrong for chapter 7's six, so they become "her secret cards under the moss, a corner showing for
  each" (`tests/storyboard.test.js` pins the old words twice, lines 161 and 411: the words owner updates
  both). Chapters 1 to 3's storyboards regenerate byte for byte; chapters 4 to 6's differ only in
  chapter 4's one card row (the link's condition) and the `hidden` phrase on their den rows: with those
  two put back, each is the shipped file byte for byte (section 7, item 2 (d)).
- `docs/build.md`: a short "Chapter 7" section, the new art names and words as built, pointing here.

## 7. Known issues the text critics left

Checked against Draft v0.4. Every other low of both rounds (`critique.json`, `critique-verify.json`)
is fixed in the story as it stands: the kept sixty's words, the eye on the sum card (a note), the two
link lines, "Let’s look.", "isn’t here", "tell Riffle", the guards settling in, the sneaking line, the
6 × 7 and 6 × 8 prompts, "Fine for BRAVE cats.", the bedtime "Two witnesses: no moon.", "Three nights
make twelve", the twenty-four's right line, "a job for the sixes", "Some were tricky", the named fillers
(1 × 10 then 10 × 2, which the engine lends: run), the lines drawn to scale with their numbers, 7 × 3 as
the warm-up's default, the wiggle lines, "The cats on the rim", "Go, {petname}", Glintstar's "How many
is that?", "FLY," she says, the climber's thought, "the thief’s prints in the marsh", the wave and mist
Taps, "Tallyheart’s branch", the frame estimate, the twins clause, "Four is a SMALL supper.", the
digits and `thing` keys of the skip-counts, the praise lines, "Twenty-one and twenty-one", the last-miss
wording, "The right line is the same on the retry.", 10 × 6 recorded, "You don’t follow it.", the talk
worry, the "scale" note. What is still open, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes but one: integration round 1 changed the
   told path's “Twenty-four gone in six nights.” under the Old Bridge to “Four a night, for six nights:
   twenty-four.”, in the story and on its panel, because nobody had said “four a night” there and
   Sprinkle's shared “Only FOUR a night?” answered it. Where its italic notes and this spec differ, the
   spec is the build's (item 5).
2. **FLEW for everyone** (the orchestrator's "flew"). Setting `ch4CaughtFly` for everyone would change
   what chapters 4 and 5 show a cat on a reread, and a `specialty: 'noticing'` guard on their lines
   cannot keep every live save as it is (a noticing cat who caught FLEW and later chose another
   specialty would lose her chapter 4 recap line and "Flew. Again."). Build: chapter 7 sets its own
   sticky `ch7Flew`, never `ch4CaughtFly`; the one reader whose meaning widens (chapter 4's `fox-flew`
   link) reads `{ not: { ch4CaughtFly: false, ch7Flew: false } }`; every other reader is listed in
   section 1 and stays as it is. The test that proves it (the words owner's): (a) **a golden of
   chapters 1 to 6**, `tests/fixtures/make-ch06-golden.js` recording `tests/fixtures/ch06-golden.json`
   from the shipped tree (`GOLDEN_ROOT`, the copy the orchestrator takes before the build: section
   10), as chapter 4's golden was made: every frame and what it shows (scene with the cat's options
   filled, and a hash of `PC.art.render(scene, { look }).svg` for a fixed look **with the per-render
   ids stripped**, `svg.replace(/pcs?[0-9a-z]+-/g, '')`, plus `heads` and `keep`, as
   `tests/scenes.test.js` and `tests/set-pile.test.js` hash renders: the ids carry a counter of every
   render in the process, so a raw hash would depend on what ran before it; captions, balloons,
   options and labels, the card under the panel, the pages she taps, her file's button and its whole
   screen), every skip tap by tap, every question, picture, line and help, the Training Hollow, the
   book with its dragonets, and the cat at the end; **in `E.caseFile` and `E.cards` every card's
   `link` is digested as `{ with, line, drawn: E.matches(link.when, cat) }`, its raw `when` dropped**,
   both when recording from the shipped tree and in today's comparison (the link's condition is the one
   piece of card data the build changes: section 1); its scripts cover every specialty and worry, told
   and kept, both chapter 2 paths, the roof and "Not today", Puddle, Wisp and Sleet found and not,
   misses of every kind, and **a noticing cat who catches FLEW and then rereads chapter 1 as a climber
   before reading chapters 4 and 5 again**; it loads the shipped tree from `GOLDEN_ROOT` in a process of
   its own (`GOLDEN_ROOT/tests/_load.js`, which section 10's snapshot copies, or by reading
   `GOLDEN_ROOT/index.html`'s scripts itself, as `_load.js` does); `tests/engine.test.js` compares
   today's engine and art against it whole: chapters 1 to 6 play and render byte-identically for
   every save without `ch7Flew` (every live save). (a′) **Chapter 4's golden stays as recorded**:
   `ch04-golden.json` (0.4.0) hashes the raw link, so its test in `tests/engine.test.js` runs over the
   stories with `ch04.cards['fox-flew'].link.when` set back to `{ ch4CaughtFly: true }` (on a deep clone,
   or set and restored in a `finally`) and is never re-recorded; and the same test asserts that, at every frame of every golden run,
   `E.matches({ ch4CaughtFly: true }, cat) === E.matches({ not: { ch4CaughtFly: false, ch7Flew: false } },
   cat)`, so the restored clone hides nothing. (b) **after chapter 7**: every golden run's final
   cat with `flags.ch7Flew = true` reads chapters 4 and 5 again, and every frame, line, card under a
   panel, recap and dragonet page is identical to the same reading without the flag; only
   `E.caseFile`'s links differ, by `fox-flew` and `cant-fly` touching over "They can’t both be true.",
   and only for a cat without `ch4CaughtFly`; (c) `E.caseFile` draws that link exactly when
   `ch4CaughtFly` or `ch7Flew` is true, on a table of every combination; (d) chapters 1 to 3's
   storyboards regenerate byte for byte, and chapters 4 to 6's differ only in chapter 4's one card row
   (the link's condition, "once ch4CaughtFly or ch7Flew is true") and the den rows' count-free `hidden`
   words (section 6): with those two put back, each is the shipped file byte for byte.
3. **`table: 4` on the twenty-four** (the orchestrator's "table4"; call 6). Build: section 2,
   `ch07-gone`. Its one side effect: that answer is filed under the 4s (`E.tableOf`), so the Grown-ups
   corner shows "The 4s" with one row until chapter 8 teaches them and names the table "Paws · the 4s"
   (the Hollow offers no 4s before then; a miss there is a 4s hard fact for chapter 9: section 8).
4. **Six whiskers on a cheek** (the orchestrator's "counting"). The game's cats are drawn with two
   whiskers a side; the six (two rows of three) exist only in the Counts close-ups: the one-cheek Tap,
   the five cheeks, the lesson's cheeks, the bedtime faces (section 4). No character drawing changes,
   and no line claims six of the drawings in other panels ("Up close, you can count her whiskers.").
5. **The story's notes this spec supersedes** (she reads none of them; no line she reads changes):
   the FLEW note's mechanism (set `ch4CaughtFly`, guard its readers with `specialty: noticing`): item
   2; Waffles' "`answers` if the engine can carry it from this chapter": it cannot (`answers` is chapter
   4's definition), so a link (call 2); the lesson's "If the art does not draw it, every cheek opens
   unlit": the art draws `cheeks-top`; the round-2 editor's "10 × 1 then 10 × 2" and "or ten fish on
   the kept path" (`for-the-spec.txt`): the story's 1 × 10 then 10 × 2, in marks on both paths; its
   whisker-Tap fallback ("two items"): the skip of two groups of three is exactly that, drawn as one
   cheek.
6. **Riffle's engine-worded lines are not whispers.** Under the bridge everyone whispers after Coil's
   "Quietly", but a set's engine lines carry no balloon kind: his help's opening ("Hop by tens! Ten,
   twenty…"), "Here’s that one again.", "An easy one." and "There. We’ll come back to that one." are
   plain balloons (only a kept cat who misses the sixty reads them). Build: nothing; his prompt and
   right lines are whispers as the story has them.
7. **A cat who became noticing after chapter 4** reads the told noticing FLY line ("Tallyheart looks at
   you. “The fox said the dragon FLEW. There’s the hole in his story. Now we’ve SEEN it.”"), keyed on
   `specialty` as the story marks it. It claims no catch at the border, so it stays; "I KNEW it! I knew
   it at the border!" is airtight (`ch4CaughtFly`, which only chapter 4 sets).
8. **The "scale" behind the back row** (the verify critic's low) lies on the bare earth there since
   chapter 4 and is drawn in `rear` and `hole`: a small glimmer, never remarked on, never in or beside
   the mouth (section 4). The shiny worry's "Nothing shines in there." stays true: the mouth itself has
   nothing shining.
9. **"Whiskers"** is also a minor Warriors pet cat's name (the story's For us). Build: a picture word
   and the Count's label only ("Whiskers · the 6s"), never a cat's name.
10. **15 typed answers** against the brief's "about 16". The story's call; a sixteenth would be a
    fourth twenty-four.
11. **Choices with no outcome panel echo nothing**: the FLEW screen's two lines lead straight on (as
    chapter 6's Coil question), and each sum choice's two lines lead to one outcome panel with the
    story's one reply and the card (call 22): her pick is never lettered back to her.
12. **"“Sorry, Coil,” everybody whispers."** is lettered as a caption, quote and all (call 20), not as a
    balloon from each of four speakers.
13. **The branch**: the told path's first panel under the bridge has `branch: true` and the told `back`
    panels after it do not, chapters 4 and 6's convention (a later chapter may add `branch: 'auto'`).
14. **The 6s lesson never notices speed** (the build review's counts lens). Module-1 has Tallyheart
    notice speed out loud, but all ten of `ch07-sixes`' facts carry a right line of their own, and a
    fact's own right line always wins over the set's `fast` and `praise` (the engine's order), so on a
    clean reading “Quick as a pounce!” and the praise lines never play in the lesson: only on a filler
    after a miss, and in the 6s' Hollow rounds. In the chapter, speed is noticed once, on the warm-up's
    first question. Kept as built: every right line is the story's, and dropping 5 × 6's (“Thirty! You
    hopped that one already.”, the one fact asked with no prompt of its own) would change the story for
    one speed line. Chapter 8 should leave a fact or two of its lesson without a right line of its own.
15. **A reread of chapter 3 that turns kept into told mid-chapter can skip her count's card** (the build
    review's paths lens). A kept cat who leaves chapter 7 for the hub anywhere from f041 to f055, rereads
    chapter 3 and this time tells Tallyheart, lands past both sum panels (the told f040 is behind her; the
    kept f056 no longer shows): no `my-count`, and before f054 no typed sixty either (14 typed answers).
    Her bedtime still letters “Three more curls go under the moss.” though two went, and the told
    bridge's “Four a night, for six nights: twenty-four. A dragon would eat SIXTY.” is a sum she did not
    type. Told into kept is safe (the kept sixty and f056 come after). No engine-free fix keeps the card
    on the sum's own panel (a `when` cannot test whether she holds a card, and a second `card:
    'my-count'` on the shared f057 would show it again to every reader). Kept: rereading chapter 7 gives
    it. Chapter 10's card picking must not require `my-count` to be held (section 8).

## 8. What chapter 8 inherits

- **Where the story stands.** Bedtime on her seventh evening, after her sixth morning count: twenty-four
  gone in six nights, four a night, from the middle of the back row; eighteen guards saw nothing.
  Glintstar has heard twenty-four and never sixty ("A good count."); the dragon's case is still the
  Gathering's, and no cat goes looking for it ("Until then, we guard."). Whether the seventh night is
  robbed is chapter 8's.
- **The tunnel.** At dusk, behind the back row, under the low bramble roots, in the dug earth: the round
  dark mouth of a small tunnel going down and in under the pile, much too small for a dragon ("Just
  right for somebody with TINY feet."). Nobody went in; nobody said weasel or what is at the other end;
  sniffed, it smells of earth "and, very faintly, mice"; listened at, "Not a sound. Whoever dug it isn’t
  here." A noticing cat found it by the dug earth, everyone else by Coil's "Under". The small worry: "A
  small cat could just squeeze in… A small cat like you." (her brave moment is chapter 8's). A climber
  saw the tracks from the bramble arch ("The tiny prints ran that way.").
- **Who walks the night trail** (module-1's rule, kept): told, Tallyheart ("Tomorrow night, you and I
  find out where it comes out."; she would not wait and pounce, and keeps it from the Clan: "A hole
  isn’t a thief. Not yet."); kept, Riffle ("Tomorrow night, you and Riffle will find out."; she did not
  follow it, "Not without Riffle", and did not tell Tallyheart, who would ask "what ELSE you know";
  "Tomorrow, you’ll tell Riffle. He heard Coil too."). The Clan has not been told on either path.
  **Who knows of the tunnel**: she does, and on the told path Tallyheart (she sat the first watch right
  beside it); nobody else. Riffle, Sprinkle and Coil do not know yet on either path (kept: "Tomorrow,
  you’ll tell Riffle."); the guards, Glintstar and the Clan do not.
- **The case so far.** The moon: Waffles (ear) and Patience (ear) against the fox: a row of three in
  her file. FLEW: every cat has seen Sprinkle try to fly and fail; `fox-flew` and `cant-fly` lie touching
  for everyone ("So Reynard LIED!" may have been said; nobody has charged him: the Gathering's). The
  count: twenty-four against a dragon's sixty (her card); Tallyheart knows the sixty on the told path,
  half-knows on the kept ("For a DRAGON."). The prints: Sprinkle's huge, the thief's tiny. The tunnel,
  touching Coil's "small diggers". Nobody has said weasel, glass, or what the "scale" is.
- **Sprinkle** has heard the good news on both paths: the numbers (twenty-four, not sixty) and her own
  prints say she didn’t do it ("now the NUMBERS know!"). She is happy, and still can’t fly (her good wing
  goes up, her hurt wing won’t; module-1 has her practise flying in chapter 9). Riffle knows the sixty
  on both paths (he caught every one of her fish); Coil listened from the stones (his “Quietly,” and
  “She can’t fly,”).
- **Waffles**: on her balcony, a witness now (card `waffles-no-moon`); she has seen the Tall One fill the
  dish every morning; the elevator is "the little room that goes DING", terrifying (for her).
- **Flags**: `ch7Flew` (sticky, every cat who read the FLEW screen); `ch4CaughtFly` still means only a
  noticing cat's catch in chapter 4. No choice flag. **Cards**: `waffles-no-moon`, `my-count`,
  `prints-sprinkle`, `tunnel` (18 to 24 held; six under the moss: Sprinkle's two, Coil's, and the three
  eyes of chapter 7). `my-count` can be missing for a cat who turned kept into told by a reread of
  chapter 3 in the middle of this chapter (section 7, item 15): no later chapter, and not chapter 10's
  card picking, may require it to be held. **Her nest is at its limit**: `BARK_MAX` caps the row at 24 pieces (past it the
  oldest are left out), and eighteen along the edge, two courses of nine, is the most that keeps chapter 6's spacing
  (section 4, the den); a chapter that adds cards decides how the nest grows (a third course, more
  under the moss, or a larger `BARK_MAX`) before it adds them.
- **The Counts.** The 6s are her seventh Count ("Whiskers · the 6s", seven marks on the tree; "Six is two
  threes"). Chapter 8 teaches the 4s (paws, module-1): 4 × 6 = 24 is already hers (the sum), filed under
  the 4s in the Grown-ups corner until then; a chapter-8 set on table 4 with the most facts there
  becomes the 4s' own (`E.countSets`), as planned. **Chapter 8's warm-up is the 6s.** `E.hardFacts(cat,
  6)` reads every 6s pair in the whole log, and finds: any chapter-7 miss of a 6s pair (the lesson, the
  twenty-four, the sixty's 10 × 6); a slow right 5 × 6 (the only lesson fact timed on itself: the
  others have prompts, and 8 × 6 is a check); the warm-up's hard pick when it is 3 × 6 or 6 × 3, timed
  too (asked with no prompt and `intro: false`: a cat who missed chapter 6's guards, 3 × 6, opens the
  warm-up on 3 × 6, and then `E.hardFacts(cat, 6)` returns `[[3, 6]]`, run; [3, 6] is in the avoid list
  below anyway); and older timed answers chapter 7 never replaced, from
  other days: 1 × 6 / 6 × 1 (chapter 1, the 1s' Hollow), 2 × 6 (the 2s' Hollow), 3 × 6 / 6 × 3 (the 3s'
  Hollow), 6 × 9 / 9 × 6 (the 9s' Hollow), 6 × 10 / 10 × 6 (the 10s' Hollow). Run (`sim3.js`): older
  slow Hollow answers of 1 × 6, 2 × 6, 6 × 9 and 10 × 6 survive a clean, quick chapter 7. So a warm-up
  that says "Yesterday" needs `warmHard: { table: 6, at: 0, avoid: [[1, 6], [2, 6], [3, 6], [6, 9],
  [6, 10]] }` (plus its own second question), and then picks only chapter 7's misses and slow 5 × 6
  (run: `[[4, 6], [5, 6]]`); the cost, as chapter 6's, is that a chapter-7 miss of 2 × 6, 6 × 3 or 10 × 6
  is passed over. Its fillers can borrow from `ch07-sixes` (`fillOrder: 'easiest'`: 2 × 6, 6 × 3, …;
  avoid 6 × 6 as "an easy one"). **Chapter 9's warm-up is the 4s**: `E.hardFacts(cat, 4)` will find a
  chapter-7 miss of the twenty-four (two days old by then: run).
- **Drawn now**: the pile's `rear` and `hole` (the tunnel's mouth, `tunnel: true`), its `tap` marks, the
  bramble arch's `arch` and the far `tracks`; the bridge's `print` and `compare`; the hollow's `compare`;
  the seventh claw mark; the Counts close-ups of cheeks and whiskers, the back row's gaps, and nights of
  marks.
- **A later chapter keeps** (copy into `docs/continuity.md`'s places table at ship): the tunnel's mouth
  lies behind the back row under the bramble roots (`rear`, `hole`; `tunnel: true` once found: a
  chapter after 7 never draws the roots down over it unless the story hides it again: chapter 7's last
  panels round the back leave the roots lifted and the mouth open, on both paths); the pile's `moon`
  is the evening's age (8 in chapter 8) on `wide` and `low`; the den's `hidden: true` keeps six cards
  under the moss; the "scale" still lies behind the back row, clear of the mouth; seven claw marks.
- **Words on screen now**: tunnel, doubling ("That’s doubling."), "A warrior who knows {their} Counts
  can’t be fooled." (said once, no promise); Waffles' "the little room that goes DING" and "the glowing
  box". **Names**: none new. Snip and Snatch wait for chapter 8's names check; Hail is chapter 8's.
- **Standing rules, still**: Riffle never juggles under the Old Bridge; Coil never shuts his eyes and is
  never frightening; nobody steps past the last post; nobody has been in the tunnel.

## 9. Calls made

1. **`ch7Flew`, not `ch4CaughtFly`** (section 1). Reason: the brief's effect (FLEW against can't-fly
   linked for everyone) with chapters 1 to 6 exact for every live save and every reread; one edit in
   shipped code instead of guards on six lines, and "I KNEW it!" airtight.
2. **Waffles' card links `fox-moon` with `link.with`, no `answers`.** Reason: `answers` lives on chapter
   4's definition; the link draws the two witnesses against the fox now, and chapter 10 can add
   `answers` when it judges cards.
3. **The tunnel card touches Coil's** ("Coil felt them. Now I’ve seen where."). Reason: the story offers
   it; it is the chain that makes the case (a thing to check, checked).
4. **One sum card, `my-count`, an eye, given on both paths after the sum's choice.** Reason: the same
   count on both paths, in her own words; the story's note keeps one mark.
5. **The three eye cards under the moss on every path.** Reason: the story says so; hidden on every path
   reads no flag, and the sixty, the bridge's prints and the tunnel are secrets on both paths.
6. **`table: 4` on the twenty-four, set `table: 6`.** Reason: the help hops by fours (a night at a
   time), and the 6s stay the lesson's Count; the side effect is named (section 7, item 3).
7. **The doubling picture is a picture `kind` (`cheeks-top`), art only.** Reason: no `light: 'rows'`
   or new engine key; `E.lessonPicture` passes the kind and a retry keeps it.
8. **8 × 6 is a check.** Reason: chapter 6's 8 × 3: asked right after a missed 6 × 8's retry, a quick
   right answer is an echo and would hide the miss from chapter 8.
9. **The twenty-four never lends 6 × 6** (`avoid: [[6, 6]]`). Reason: "An easy one." must be easy;
   thirty-six is the lesson's newest fact.
10. **`intro: false` on the pile, the warm-up and the lesson.** Reason: the warm-up's first question is
    timed on itself (the story); the pile's caption and 2 × 6's own line each carry their question, and
    the keypad page stays one picture and one line.
11. **`carry: false` on the gaps and the cheeks; `keep: true` on her whiskers.** Reason: "Four gone." says
    the number on a crowded panel; the cheeks turn to the ask, which carries no number; the one cheek
    stays up while Tallyheart says "Six is two threes".
12. **`help: 'picture'` for the twenty-four and both sixties.** Reason: the marks are already in the sand
    or mud; lighting them a night at a time is the story's help, with nothing new scratched beside them.
13. **The lesson's set `prompt` is "How many whiskers?"** Reason: the story's words for a question with
    none of its own; the Hollow's rounds ask it too, under the cheeks picture.
14. **The comparison is a scene option, `compare: [24, 60]`**, on the hollow and the bridge's `under`.
    Reason: a plain page shows its scene, not a Counts picture; drawn to scale with its numbers, as the
    story asks.
15. **Two new pile cameras, `rear` and `hole`, and options `tunnel` and `tap`.** Reason: the mouth faces
    away from the pile, so it reads only from behind; a set's `tap` option (the marsh's) marks the back
    row and the roots without changing any earlier picture.
16. **A bridge camera `print`, her paw held over the print (`reach`).** Reason: the story's "as it went
    over the tiny ones in the marsh"; one panel shows the paw, the print round it, and her face for her
    line.
17. **The climber's look on the pile's `wide`, with `arch` and `tracks`.** Reason: the towers and the
    sky are already in `wide`; one anchor and one far detail, not a new view.
18. **The warm-up lends "One from yesterday."** Reason: chapter 6's warm-up opened its fillers so, and
    the 3s were yesterday's lesson.
19. **Coil's "Quietly" is labelled "Coil"**, his head a stone. Reason: he has been named since chapter
    6; the joke is the voice in the stones, which the picture shows.
20. **"“Sorry, Coil,” everybody whispers." is a caption.** Reason: the story's words exactly, without
    four tiny balloons on one panel.
21. **"Tens land on a zero." is the told sixty's miss line**, after the marks light. Reason: the story's
    order (lit, then the line, then back); chapter 4's rule said once more.
22. **One outcome panel per sum choice, carrying the card.** Reason: both options have the same reply;
    the card under a choice's panel would crowd its options on a phone.
23. **The book's recap and the teaser are proposed here** (the story builder owns them). Reason: each
    sentence must be true on every path.
24. **2 × 6 is one cat's face** (`who: ONE_CAT`, two entries of `clancat` 1), and a face is two
    consecutive `who` entries with the same `who` and `variant`, never the default coats. Reason: the
    prompt says “That’s one whole cat.”, and the picture is the teaching; the rim's `clancat` 3 and 5
    must stay two cats.
25. **The nest keeps chapter 6's spacing** (the row's room held at 78k past three hidden; the six
    corners from 87k, about 8k apart). Reason: at 54k the bark stands 2 apart and Waffles' piece, which
    bedtime names, cannot be seen; three or fewer hidden draw as today.
26. **The seventh claw mark relays the six as `markSpots` always has** (four to a row, a little
    smaller). Reason: chapter 3's third mark did the same, the frames before SKRITCH keep their six, and
    the seven-to-ten layout is pinned by the earlier chapters' fingerprints.
27. **The kept comparison lies in the open mud right of `mud`**, Riffle at chapter 6's three-shot spot,
    its box in `keep`. Reason: the sum must be crystal clear; no cat or balloon may stand on the lines.
28. **The den's `hidden` storyboard words are count-free.** Reason: "two corners showing" was wrong
    for chapter 6's three and would be for chapter 7's six; chapters 4 to 6's storyboards change in
    that phrase only, which the proof checks by putting it back.
29. **Integration round 1** (the build review's findings, `~/potomac-crossing-work/ch07/review.json`):
    her paw over a print drawn true to size (section 4's bridge row); the told tunnel screen split in two
    (section 5, Always the back); the told “Four a night, for six nights: twenty-four.” (item 1 of
    section 7); the book's FLEW sentence naming both claims (section 5, The book); Sprinkle's two lines in
    one balloon on “Sprinkle’s eyes go round.”; the guards back to front at the count and facing out at
    dusk, our cat in the loop of the tail, Sprinkle's `pawsup` for FLY, her `wonder` peek; the kept sum
    in the mud raised and enlarged; the `hole` heap without its soft dips (no second and third “hole”).
    Reason for each: the picture or the words did not say what the panel says; each stays inside chapter
    7's frames and its own options, so chapters 1 to 6 draw and play as they did. The storyboard's
    `intro: false` sentence is now worded from a set's first fact (its own question read first, a check
    never timed), which corrects chapter 5's bill row as well: words for an illustrator, not play.

## 10. For the orchestrator

- **Before the build, in this order:**
  1. **Snapshot the shipped tree** for the words owner's golden: `mkdir -p
     /Users/aron/potomac-crossing-work/ch07/shipped/tests && cp -R /Users/aron/potomac-crossing/app
     /Users/aron/potomac-crossing/index.html /Users/aron/potomac-crossing-work/ch07/shipped/ && cp
     /Users/aron/potomac-crossing/tests/_load.js /Users/aron/potomac-crossing-work/ch07/shipped/tests/`
     (the chapter 6 state, before any stub or owner edit; it is the `GOLDEN_ROOT`). `_load.js` finds
     its root from its own directory, so a golden maker modelled on `make-ch04-golden.js`
     (`require(path.join(GOLDEN_ROOT, 'tests/_load.js'))`) needs it inside the snapshot.
  2. **Stub** `app/story/ch07.js` (a chapter with one `board: 'STUB.'` frame, `PC.story.ch07` with id,
     number 7, title 'The Counts Don’t Lie', empty `counts` and `cards`, a teaser), its script tag in
     `index.html` after `ch06.js`, its `sw.js` `ASSETS` entry and a `CACHE` past the live value, and
     `docs/storyboard/ch07.md` generated from the stub (`node tools/storyboard.mjs
     app/story/ch07.js`): `tests/storyboard.test.js` requires a current storyboard for every story file.
     **No new set file**: every place is an existing set.
- **Owners**: three, disjoint. **places**: `app/art/sets/pile.js`, `app/art/sets/bridge.js`,
  `app/art/scenes.js`, `app/art/cards.js`, `dev/gallery.html` and their tests (`tests/set-pile.test.js`,
  `tests/set-bridge.test.js`, `tests/scenes.test.js`, `tests/cards.test.js`): section 4's places and
  section 3's pictures, and `<script src="../app/story/ch07.js"></script>` after `ch06.js` in
  `dev/gallery.html` (the gallery test, `tests/scenes.test.js`, requires the gallery to load exactly
  `index.html`'s art and story scripts in order, so it fails once the stub's tag is in `index.html`). **counts**: `app/art/cats.js`, `dev/gallery-cats.html`, `tests/cats.test.js`:
  section 4's Counts art and the two new tap extras. **words**: `app/engine.js`, `app/ui.js`,
  `tools/storyboard.mjs`, `app/story/ch04.js`, `docs/build.md`, `docs/storyboard/ch01.md` to `ch07.md`
  (regenerated; chapter 7's from the stub), `tests/engine.test.js`, `tests/storyboard.test.js`,
  `tests/tools.test.js`, `tests/story-ch04.test.js`, `tests/fixtures/make-ch06-golden.js`,
  `tests/fixtures/ch06-golden.json`: section 6 and section 7's item 2. **No test reads the work
  directory**: a test that compares with the shipped tree uses hashes computed once from the snapshot,
  in a separate process, and committed (as constants in the test file, as `CH6_FINGERPRINT` and the
  counts fingerprints are, or as the golden fixture), so the suite travels and never loads two trees
  into one `globalThis.PC`. `app/story/ch07.js`,
  `tests/story-ch07.test.js`, `docs/storyboard/ch07.md` as built, chapter 6's teaser test and the
  tests that count Counts (the Hollow now offers seven) are the story builder's, later.
- **Can't be built literally, built nearly**: "She fluffs herself up." (`puffed: true` on the panel the
  caption opens); "her forepaw waves, Waffles waves a fluffy paw back" (both drawn waving: the tap is the
  wave); "a fish flies from Riffle’s string, Sprinkle catches it" (the next panel: Sprinkle gulping);
  "it puffs away" (the next panel has no mist); "the shadow lifts" (the next picture is the back row in
  the light); "her forepaw lifts the low roots" (the next panel has them lifted); "One at a time, the
  cats on the rim turn a cheek to you." and "He puffs out his cheeks. You puff out yours." (in the
  counting pictures); "Tallyheart stretches up the leaning tree." (`stretch` at the tree, as chapter
  6); "The cats on the rim bound off" (the rim empty, one cat trotting off); "Two big eyes peek over
  Tallyheart’s branch" (Sprinkle `peek` behind it).
- **Frames**: about 80 on a told reading and 85 on a kept one (the story's 58 and 60 screens, the
  captions-first splits, the told/kept pairs), under the brief's 120. As built: 81 or 82 told (the
  tunnel screen's two whispers a panel each, integration round 1), 84 or 85 kept; one more for a climber.
- **README** (end of the spec phase): record section 9's calls under "Claude's calls under decision
  46"; call 5's effect stands as the README has it ("FLEW against can't-fly is linked for everyone"),
  and the mechanism is `ch7Flew` (call 1). Amend the brief's call 3 in the README to read "The sum is 4 ×
  6 = 24 against 10 × 6 = 60" with the reason: the brief's 6 × 10 turned round (the story's call 8), so
  both read "a night's count, for six nights"; the same fact on the 10s. **`docs/continuity.md`** (ship): section 8, the four cards,
  `ch7Flew` in the flags table (and `ch4CaughtFly`'s row: "chapter 7 does not set it"), the 6s row of
  the Counts table (warm-up 7 × 3 or her hardest 3s, 4 × 3; the lesson; the pile 3 × 10, the sum 4 × 6
  and 10 × 6), seven marks, the places table's new keeps, "tunnel" now said. And in the cards table,
  `fox-moon`'s row: touched now by `heron-no-moon` and `waffles-no-moon` (a row of three), still with no
  `answers` (chapter 10's); the **Moonlight** paragraph rewritten (two witnesses, Patience and Waffles,
  against the fox, laid in one row; not yet answered); the "third witness" note ("The chapter that brings
  Waffles gives her card and sets `fox-moon`'s `answers`") rewritten to what was built (her card, a
  link, no `answers`: call 2); and who knows of the tunnel (section 8).
- **`docs/build.md`** gets a short "Chapter 7" section from the words owner.
- **The ship's Safari look** should include the whisker Tap (one cheek), a doubling question (top rows
  lit), the twenty-four with a miss (the marks lit night by night), the comparison, her paw over the
  print, the mouth on `hole`, and her Case File after chapter 7 for a non-noticing cat (FLEW touching
  can't-fly; Waffles, the fox, Patience in a row; the tunnel beside Coil's card).

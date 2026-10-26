# Chapter 9 spec: Featherlight

*v0.2 · 2026-10-24 (v0.1 with the spec critics' findings applied: the one-fact sets' filler rule and its
table, the book's eighth morning, the case at `read: 7` and Glintstar's entry on `case`, the shadows at the
bank's new spots and Squall's tail tip, the dew on `two`, the bank's `skim` and `run-2`; no word of the story
changed)*

*The build's contract for chapter 9, beside `docs/build.md`. The story, [`09-featherlight.md`](09-featherlight.md) (Draft v0.4,
final), is the source of every word she reads; this spec adds no line she reads except the engine's own wording of a question, a
filler's opening, a retry's opening, a right retry's line and a last miss, each named here and kept to chapters 6 to 8's lines or
the story's own words, and the book and the teaser, which it proposes. Every Counts set below was run on the live engine (0.8.0)
with scripted answers, exactly as written here (`~/potomac-crossing-work/ch09/spec-writer/sets.js`, run by `sim1.js` (the warm-up
and the lesson), `sim2.js` (the sleepy question and the three doses, with an exhaustive run of every way to answer them), `sim3.js`
(her Case File after this chapter) and `sim4.js` (what chapter 10's warm-up will find); `E.checkStory` is clean on the mock chapter
that holds the sets; the one-fact sets' first misses in every earlier-set state are the math critic's
`~/potomac-crossing-work/ch09/counts-critic/probe3.js`, and the warm-up's 2 × 4 without its prompt (v0.2) is
`~/potomac-crossing-work/ch09/spec-editor/probe-2x4.js`: every line she reads the same). Where the story's italic notes and this
spec differ, the spec is the build's (section 7). Names in `code` are fixed: the art, the engine, the storyboard words and the story
builder use exactly these.*

---

## 1. Flags

**Two new flags, both sticky; no choice flag** (the brief, "Flags": "At most one more choice flag, only if
chapter 10 reads it"; chapter 10 needs none, so there is none). No choice in this chapter sets anything.

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `foundMizzle` | `true` | Mizzle's last screen, “Tell Sprinkle: five,” mumbles Mizzle… (the optional scene's last frame, with the leaf Tap): `sets: { foundMizzle: true }` on the frame, never on an option | sticky (never unset; Back does not unset it) | this chapter: the oak's choice, its first option read “Go and see Mizzle again.” with it (`labelWhen`, one option, as chapter 8's log); her card `mizzle-wing` (`when: { foundMizzle: true }`); “And Mizzle says five,” you tell Sprinkle. (the remedy); “Sprinkle’s eyes shine.” (with `foundSquall` or `foundHail`); “And Mizzle says Sprinkle’s wing was hurt before the rain stopped.” (the case); her page in the book (`book.dragonet`); her recap line; the Grown-ups corner. Only chapter 9 offers her, so it is her found-here flag too (as `foundSleet`, `foundHail`) |
| `ch9Roof` | `true` | the roof scene's last frame (chapter 4's `f089a`, copied: his forepaw Tap), with `foundSquall`: `sets: { foundSquall: true, ch9Roof: true }` | sticky | this chapter: the dew's screen (“I’ll guard the dew!”, and “Two skinny shapes, he said…”); her recap line (“On the roof of {their} old tower, {they} found Squall…”). **Chapter 4's page** (section 5, the one edit to shipped story code): its three “found Squall” lines take `ch9Roof: false` beside their `ch5Roof: false`, and a cat with `ch9Roof` reads its “still roaring” line, as chapter 5's `ch5Roof` did. The Grown-ups corner |

- **`foundSquall` from the roof here.** The roof scene is chapter 4's own frames run again (section 5): its
  last frame sets `foundSquall` and `ch9Roof` together, as chapter 5's set `foundSquall` and `ch5Roof`. Only a
  cat with `foundSquall: false` is offered it. The two flags can still both be set (the review, 2026-10-26): a cat
  who goes up here, goes back to camp from the middle of the roof copy and reads chapter 5 again is offered chapter
  5's roof, and finishing the copy then sets `ch9Roof` too; chapter 4's "still roaring" line for `ch9Roof` takes
  `ch5Roof: false`, so her page says it once, as a chapter 5 roof cat's.
- **The light choices set nothing** (`sets: {}`): the reed root's “For a friend who’s hurt.” / Dip your head,
  very politely.; the oak's “Climb up to the hollow.” (or “Go and see Mizzle again.”) / “Ask the elder which
  moss.” (saying no sets nothing: the moss is still found); the roof's “Go up and find Sprinkle’s littlest
  brother.” / “Just the dew today.”; Glintstar's “Me?” / Sit up very straight.
- **Flags read from earlier chapters:**
  - `ch3Told`: told, Riffle's “Every bit” (two screens and the told-only panels round them) and the told
    Tallyheart's “This is Thymeleaf,” …; kept, “Too big to carry” (four screens), the kept “Next time, you take
    ME.” line at the wall, and the remedy's kept screen (Sprinkle hides from two big cats); Glintstar's two
    openings (“The case is ready,” … / “It’s time Glintstar heard it,” …); the told path's branch on the first
    `back` panel (section 5).
  - `specialty`: `noticing` (“No new dug earth. No new tiny prints.”; “You notice: every day, her hurt wing
    lifts a little higher.”), `climbing` (the roof's outside, chapter 4's `f076a`; “You show her a climber’s
    leap…”), `sneaking` (“You show her how to land without a sound…”), `friends` (“Thank you, Sloshbank!”; “You
    cheer the loudest.”), `swimming` (“Paddle with your back legs!”).
  - `worry`: `water` (the little bridge: “One paw at a time.”), `small` (“Next to these trees, EVERYBODY is
    small.”), `shiny` (the dew: “It sparkles. You don’t stare. Much.”), `talk` (“All this time, you held it in.
    Tomorrow, you get to say it ALL.”).
  - `ch2Stone`: one bedtime caption (and the den's `stone: 'auto'`).
  - `foundSquall`: the roof's offer (only without it), the dew's three lines (with and without `ch9Roof`), “You
    tell her Squall’s five.”, “Sprinkle’s eyes shine.”; `foundHail`: Riffle's two balloons (told), “I SAVED the
    best bit! Hail says FIVE!…”, “Sprinkle’s eyes shine.”; any found dragonet (`{ not: { foundSquall: false,
    foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false } }`): the kept “Then the others
    you’ve found, name by name.” and Mizzle's “I’ve found more of you!” / “Mmm. Tell me… after my nap.”.
    `foundPuddle`, `foundWisp`, `foundSleet` are read only inside that `not`.
  - `lessonClean: 'ch09-eights'` and `not` it: the ninth mark's two pairs of lines.
  - Not read: `ch2Path`, `ch2SaidAloud`, `stepOut`, `spokeUp`, `joinReason`, `ch4CaughtFly`, `ch5First`,
    `ch5Roof`, `ch7Flew` (her file reads `ch7Flew` through chapter 4's link, as since chapter 7).
- **Grown-ups corner** (`PC.ui.flagWords`): `foundMizzle: { 'true': 'found Mizzle in the old oak in GroveClan’s
  woods (later chapters remember)' }`; `ch9Roof: { 'true': 'met Squall in chapter 9: the roof, offered again
  ({their} book says so on chapter 9’s page)' }`.

## 2. Counts sets

**15 typed answers on every reading; 16 with Mizzle (6 × 8) or the roof (chapter 4's 7 × 5); 17 with both**
(the story's For us; the brief's "about 16"): two 4s, ten 8s, the three doses. Every key below is one the
engine has (chapters 2 to 8); no set needs a new one. Shared pieces, as chapter 8's file has them:

```js
function T(text) { return { who: 'tallyheart', text: text }; }
function TH(text) { return { who: 'thymeleaf', text: text }; }
var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
var AFTER = ['Ha! You didn’t even look at the sand that time.'];
var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
var PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };   // chapter 8's
var LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };
var DOSE = { table: 8, unit: 'row', units: 'rows', ask: '{a} × {b}', picture: { kind: 'dose', layout: 'rows' }, help: 'picture',
  fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', praise: [], done: null };
var WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';
```

Lines use the story's typographic quotes and apostrophes. A balloon carries the spoken words only: a quote the story splits round
"says X" is one balloon. Its comma before the tag becomes a full stop when the quote resumes with a new sentence (a capital: chapter
8's “That’s a HUNDRED.”); when it resumes mid-sentence the sentence's own comma stays and a comma that only marked the tag goes:
“Fours first, to wake up your whiskers.”, “Eight rubs, three times a day. Morning, noon and night.”, “A dragonet who couldn’t fly
didn’t fly off with our prey.”. Engine lines that reach her and that no set words: **a retry** opens with “Here’s that one again.”
(the dew's: “The drops again.”, its `againIntro`; a lent question's retry in a set that borrows in its own voice, `fillVoice:
'borrower'`, opens with its `fillIntro` again); **a right retry** of a fact with no `rightAgain` gets “There it is. You remembered
that one.” then “Yes! That one came back, and you knew it.”; **a generic question** where a question has no words of its own (set by
set, below).

### Every fact, in the order she meets it

| # | Set | Fact (answer) | Where | Picture |
|---|---|---|---|---|
| 1 | `ch09-fours` | 4 × 7 (28), or her hardest 4s fact from chapter 8 | the warm-up, in the Hollow | that many cats side-on, four paws each (chapter 8's) |
| 2 | `ch09-fours` | 2 × 4 (8) | the warm-up | two cats |
| 3–12 | `ch09-eights` | 2 × 8, 8 × 5, 4 × 8, 7 × 8, 8 × 3, 8 × 8, 8 × 7, 6 × 8, 8 × 10, 9 × 8 (16, 40, 32, 56, 24, 64, 56, 48, 80, 72) | the lesson | that many spiders, eight legs each, four a side |
| (13) | `ch09-mizzle` | 6 × 8 (48) | the sleepy question, in the oak's hollow (optional) | six twigs, eight acorns on each |
| (13) | `ch04-riddle` | 7 × 5 (35) | Squall's riddle (the roof scene, optional: chapter 4's set, as chapter 5 ran it) | seven forepaws in the grit |
| 13 | `ch09-dew` | 8 × 4 (32) | the dew, on the roof at first light | four rows of eight drops |
| 14 | `ch09-rubs` | 3 × 8 (24) | the remedy, under the Old Bridge | three rows of eight paw marks |
| 15 | `ch09-flaps` | 8 × 8 (64) | the remedy | eight rows of eight marks |

The lesson kit holds (the brief): ten facts on the 8s, both orders mixed (8 first in 8 × 5, 8 × 3, 8 × 7, 8 × 10 and 8 × 8; second
in the other five); the three new facts, 7 × 8, 8 × 7 and 8 × 8, all in the ten, the twins three places apart (4th and 7th); the
seven she knows are stepping stones, one from each Count she has but the 1s (8 × 1 is the tree's ask alone): 2 × 8 chapter 2's,
8 × 5 chapter 3's 5 × 8 turned round, 4 × 8 chapter 8's, 8 × 3 chapter 6's, 6 × 8 chapter 7's, 8 × 10 chapter 4's 10 × 8 turned
round, 9 × 8 chapter 5's; the method is "an eight is two fours": count one side, a fours fact she knows, and double it (4 × 8 before
7 × 8, so the first doubling is easy); 8 × 3 and 8 × 10 have no right line of their own, so a quick answer is noticed. The story
questions (the doses) come after the lesson, on table 8 (never table 7), each a fact she has just met. Not typed (taps, never
logged): the spider's legs (4, 8), the five spiders in the sand (8 to 40), Tallyheart's eight Counts at the tree (`ask`),
Thymeleaf's four things (`ask`), the six rows of the case (`ask`), the bedtime paws (4, 8), and the one-tap frames (section 5).

### `ch09-fours`, the warm-up (two questions; Counts frame `intro: false`)

```js
'ch09-fours': Object.assign({}, PAWS, {
  facts: [[4, 7], { a: 2, b: 4, right: [T('Eight! Just like the spider’s legs.')], rightAgain: true }],
  warmHard: { table: 4, at: 0, avoid: [[1, 4], [2, 4], [4, 9], [4, 6]] }, avoid: [[4, 4]],
  fillFrom: 'ch08-fours', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
  praise: ['Two twos make a four!', 'Four more, every time!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
  remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
  rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
})
```

- **The hard pick** (`warmHard`, position 0, continuity's list exactly): her hardest 4s fact by
  `E.hardFacts(cat, 4)`, in the order she was asked it; 4 × 7 when nothing was. Runs (`sim1.js`): nothing hard →
  “Seven cats. How many paws?”, quick “Quick as a pounce!”, slow “Two twos make a four!”; a chapter-8 miss of 4 × 4,
  4 × 7, 7 × 4 or 4 × 8, or a slow 3 × 4, 4 × 5 or 10 × 4 (the lesson's facts timed on themselves) → that fact first
  (“Four cats. How many paws?” …), quick “Yesterday, 4 × 4 made you stop and think. Not today!”, slow “4 × 4 again,
  and you got it. It’s getting easier.”. **Passed over** (the cost, chapter 8's section 8): a chapter-8 miss of
  2 × 4 or 4 × 6 opens on 4 × 7.
- **The words**: the Counts frame's caption and balloon (“In the Training Hollow, five cats sit up on the rim.” /
  “Fours first,” … “to wake up your whiskers.”) are read on the frame and not again (`intro: false`), so the first
  question is timed on itself, in the engine's words; 2 × 4 is asked in the engine's words too, which are the
  story's (“Two cats. How many paws?”; its retry “Here’s that one again. Two cats. How many paws?”), so it has no
  `prompt` of its own (v0.2: a `prompt` there would add no word and only mark it read first, so a right 2 × 4 would
  never be timed nor replace her old 2 × 4 timing that `E.hardFacts(cat, 2)` and `(cat, 4)` read; run,
  `probe-2x4.js`: every line the same, right, quick, missed once and twice). Its right line “Eight! Just like the
  spider’s legs.” (Tallyheart's) is kept on a retry, and both questions are timed on themselves.
- **Help** (run): chapter 8's per-4 sand, two and two, hopped by fours; “Close. Let’s hop it together.” within one
  hop, else “Let’s hop it together.”; then “There. We’ll come back to that one.” (last miss “There. Now you’ve seen
  it counted.”).
- **Fillers** (run): chapter 8's lesson's easiest, in its cats, after “One from yesterday.” (the borrowed question
  is the lender's, in its picture and words, as chapter 8's warm-up): never 4 × 4 (`avoid`), never the warm-up's
  own two (`own`: the engine adds them, `fillOrder: 'easiest'` with an `avoid`). A miss on the first question lends
  one: “One from yesterday. Three cats. How many paws?” (3 × 4), after 2 × 4 (“After a miss on the first, the
  second question is one of the two.”: 4×7✗ 2×4 F:3×4 R:4×7); a miss on 2 × 4 lends two, 3 × 4 then 4 × 5 (4×7
  2×4✗ F:3×4 F:4×5 R:2×4); when the hard pick is 3 × 4, the fillers are 4 × 5 then 4 × 6; when it is 4 × 5, 3 × 4
  then 4 × 6.
- **Known, kept** (section 7, item 6): when the hard pick is 3 × 4 or 4 × 5, only two of the lender's five easiest
  are free, and after three misses (280 of the 1,024 ways to answer its first ten questions right or wrong; never
  fewer) the last pass lends one of the warm-up's own pairs or 4 × 4 back (3×4✗ 2×4 F:4×5✗ R:3×4 F:4×6✗ R:4×5
  F:2×4 R:4×6). The words are true (every one of them was in yesterday's lesson, and “One from yesterday.” says no
  more), so the data stays; the story builder's test pins it: never before the third miss, never with any other
  hard pick.

### `ch09-eights`, the lesson (ten facts; Counts frame `intro: false`)

```js
'ch09-eights': Object.assign({}, LEGS, {
  label: 'Spiders’ legs', hollowThings: 'eights', fillOrder: 'easiest', prompt: 'How many legs?',
  facts: [
    { a: 2, b: 8, prompt: 'Two spiders. How many legs?', retryPrompt: true, right: [T('Sixteen! Eight and eight.')], rightAgain: true },
    { a: 8, b: 5, right: [T('Forty! You hopped that one already.')], rightAgain: true },
    Object.assign({ a: 4, b: 8, prompt: 'Four spiders. One side: sixteen. The other side: sixteen more.', retryPrompt: true,
      right: [T('Thirty-two! Sixteen, doubled.')], rightAgain: true }, way('Sixteen and sixteen: thirty-two.')),
    Object.assign({ a: 7, b: 8, prompt: 'Seven spiders. One side: twenty-eight, like seven cats’ paws. Double it: twenty and twenty, then eight and eight.', retryPrompt: true,
      right: [T('Fifty-six! You doubled twenty-eight.')], rightAgain: true }, way(WAY56)),
    [8, 3],
    Object.assign({ a: 8, b: 8, prompt: 'Eight spiders. One side: thirty-two, like eight cats’ paws. Double it!', retryPrompt: true,
      right: [T('Sixty-four! The biggest new one.')], rightAgain: true }, way('Thirty and thirty make sixty. Two and two make four. Sixty-four.')),
    Object.assign({ a: 8, b: 7, check: true, prompt: 'Seven spiders? You did that one the other way round.', retryPrompt: true,
      right: [T('Fifty-six! Same fact.')], rightAgain: true }, way(WAY56)),
    Object.assign({ a: 6, b: 8, prompt: 'Six spiders. One side: twenty-four. That’s YOUR count!', retryPrompt: true,
      right: [T('Forty-eight! Twenty-four and twenty-four.')], rightAgain: true }, way('Twenty-four and twenty-four: forty-eight.')),
    [8, 10],
    Object.assign({ a: 9, b: 8, prompt: 'Nine spiders. Ten would be eighty.', retryPrompt: true,
      right: [T('Seventy-two! Seven and two make nine.')], rightAgain: true }, way('Eighty, and one spider less: seventy-two.'))
  ],
  praise: ['Two fours make an eight!', 'Eight more, every time!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the eights.'
})
```

- **The Count**: chapter 9 is the first chapter to use table 8, and this is its set with the most facts, so it is
  the 8s' own (`E.countSets`, run: `… 4:ch08-fours 8:ch09-eights`; Mizzle's and the three doses are table 8 with one
  fact each). The Hollow's button reads “Spiders’ legs · the 8s”; Tallyheart says “A round of eights. Ready? Here we
  go.” (run); the tree gets its ninth mark once this lesson is finished (`E.learnedCounts`), never before. A Hollow
  round of the 8s (run) asks 1 × 8 to 10 × 8 in both orders, “How many legs?”, in one to ten spiders.
- **Picture** (section 4, Counts art): every question opens on that many spiders, eight legs each, four a side, all
  unlit (no `lit`: the story's "all unlit"), the den's little spider as drawn there, in rows of five. A right answer
  lights every leg (the page's rule).
- **Words** (run): seven facts have words of their own (2 × 8, 4 × 8, 7 × 8, 8 × 8, 8 × 7, 6 × 8, 9 × 8; kept on a
  retry, after “Here’s that one again.”); 8 × 5, 8 × 3 and 8 × 10 are asked “How many legs?” (the set's `prompt`, the
  story's words), their retries in the engine's generic words (“Here’s that one again. Three spiders. How many
  legs?”). Right lines: every fact's own but 8 × 3 and 8 × 10, which get the fast lines when quick (“Quick as a
  pounce!” on 8 × 3, “You knew that one before I finished asking.” on 8 × 10; after any miss, “Ha! You didn’t even
  look at the sand that time.” leads) or the praise when slow (“Two fours make an eight!”, “Eight more, every
  time!”). 8 × 5 has its own right line (the story's), so it is timed but never praised.
- **Help** (run, every single miss): Tallyheart scratches eight marks in the sand for every spider, four and four
  with a gap (`PC.art.sand` at per 8: section 4), and hops them by eights from the first spider (7 × 8: 8 · 16 · 24 ·
  32 · 40 · 48 · 56); “Close. Let’s hop it together.” within one hop (an answer up to eight off), else “Let’s hop it
  together.”; then the fact's own way and “There. We’ll come back to that one.”: 4 × 8 “Sixteen and sixteen:
  thirty-two.”, 7 × 8 and 8 × 7 the fifty-six line, 8 × 8 “Thirty and thirty make sixty. Two and two make four.
  Sixty-four.”, 6 × 8 “Twenty-four and twenty-four: forty-eight.”, 9 × 8 “Eighty, and one spider less: seventy-two.”;
  the others “There. We’ll come back to that one.” On a last miss: the way alone, or “There. Now you’ve seen it
  counted.” Never a wall; no clock.
- **Order** (run): a missed fact comes back two questions later; a single miss of 7 × 8 comes back before its twin
  (2×8 8×5 4×8 7×8✗ 8×3 8×8 R:7×8 8×7 6×8 8×10 9×8); missing 7 × 8 and 8 × 8 gives 2×8 8×5 4×8 7×8✗ 8×3 8×8✗ R:7×8
  8×7 R:8×8 6×8 8×10 9×8. Near the end the fillers are her easiest right answers in the lesson, asked “How many
  legs?”: a miss on 9 × 8 lends 2 × 8 then 8 × 3; on 8 × 10, 2 × 8; a second miss on 9 × 8, 4 × 8 then 8 × 5.
- **8 × 7 is a check** (`check: true`; the story; chapter 8's 8 × 4): asked right after a missed 7 × 8's retry, a
  quick right 8 × 7 never hides that miss (run: 7 × 8 missed twice, then 8 × 7 quick: `E.hardFacts(cat, 8)` and
  `E.hardFacts(cat, 7)` are both still `[[7, 8]]`).
- **Timing** (run, for chapter 10): 8 × 5, 8 × 3 and 8 × 10 are the lesson's facts timed on themselves; every other
  right answer is read first or a check; any miss counts. A miss of 7 × 8 is a 7s hard fact too (chapter 10's 7s).

### `ch09-mizzle`, the sleepy question (one question, the optional scene)

```js
'ch09-mizzle': {
  table: 8, thing: 'acorn', things: 'acorns', unit: 'twig', units: 'twigs', teacher: 'mizzle', ask: '{a} × {b}',
  picture: { kind: 'acorns' },
  facts: [{ a: 6, b: 8, prompt: [{ who: 'mizzle', text: 'How many… acorns…' }], retryPrompt: true,
    right: [{ who: 'mizzle', text: 'Forty-eight? Lovely. I fell asleep at sixteen.' }], rightAgain: true }],
  help: 'picture', helpIntro: 'Hop by eights! Eight, sixteen…', helpIntroFar: 'Hop by eights! Eight, sixteen…',
  fillFrom: 'ch09-eights', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one…',
  avoid: [[6, 8], [7, 8], [8, 8]], praise: [], miss: MISS, missLast: LAST, done: null
}
```

- **The riddle is 6 × 8** (the brief: a fact not yet a riddle, an 8s fact best; the riddles so far are 7 × 5, 4 × 10,
  7 × 1, 7 × 3, 4 × 4, and Sprinkle's 2 × 5 and 6 × 5). The story's balloon is split at its question, as Hail's:
  “Want a sleepy question? When I can’t sleep, I count acorns. Eight on every twig. Six twigs.” is the Counts frame's
  balloon (default intro: said again over the question, one balloon), with *Zzz.* the frame's sound; “How many…
  acorns…” is the fact's own prompt, so the keypad page shows both, and a retry asks “Here’s that one again.” then
  her question. Her lines are “The sleepy dragonet”'s (the chapter's `names`): the riddle comes before “I’m Mizzle.”.
- **Picture**: six twigs, eight acorns on each, unlit (`kind: 'acorns'`, new Counts art: section 4). Her fillers are
  drawn as twigs too (`fillPicture: 'borrower'`): “An easy one… Two twigs. How many acorns?”.
- **Help** (`help: 'picture'`): “Hop by eights! Eight, sixteen…” in her voice, the twigs lit one at a time, 8 to 48;
  then “There. We’ll come back to that one.” (her teacher's line, chapter 6's words: the story gives her none, as it
  gave Hail none). The snort she wakes with is not lettered (section 7, item 9).
- **Fillers** (run): two easy eights from this morning, in her twigs and words: 2 × 8, then 8 × 3 (6×8✗ F:2×8 F:8×3
  R:6×8); on a second miss 4 × 8, then 8 × 5 (… R:6×8✗ F:4×8 F:8×5 R:6×8). She is the first of the four one-fact
  sets on any reading, so these hold for every cat (the rule: "How the one-fact sets lend", below). Never its own
  pair or a new fact (the story's `avoid`, its own pair in it on purpose; the exhaustive run: section 6).
- **The right line** is kept on a retry. **Timing**: its own words, never timed; a miss is an 8s hard fact.

### `ch09-dew`, the dew (one question, every reading, on the roof)

```js
'ch09-dew': Object.assign({}, DOSE, {
  thing: 'drop', things: 'drops', teacher: 'caption',
  facts: [{ a: 8, b: 4, prompt: [{ kind: 'caption', text: 'How many drops must you gather?' }], retryPrompt: true,
    right: [{ who: 'player', text: 'Thirty-two!' }, { kind: 'caption', text: 'Plip. Plip. Plip. Into your leaf they go.' }], rightAgain: true,
    miss: 'Sixteen and sixteen: thirty-two. There.', missLast: 'Sixteen and sixteen: thirty-two.' }],
  helpIntro: 'You count them, a row at a time: eight, sixteen…', helpIntroFar: 'You count them, a row at a time: eight, sixteen…',
  againIntro: 'The drops again.', avoid: [[4, 8], [6, 8], [7, 8], [8, 8]], miss: 'There.', missLast: 'There.'
})
```

- **On table 8, a silent set** (`teacher: 'caption'`, chapter 5's Wisp): Tallyheart is not on the roof, so every line
  the engine words itself is a caption, and the help's count is hers (`counter: 'player'`, run). The Counts frame's
  caption “Eight drops a day, for four days, to the full moon.” is read on the frame; the question is the fact's
  caption. 8 × 4 is four rows of eight (`groupsFor`), so the words for a filler come from the rows layout (“Two rows of
  eight. How many drops?”).
- **Picture**: four rows of eight drops, each row four and four, unlit (`kind: 'dose'`, `thing: 'drop'`: section 4).
- **Help** (`help: 'picture'`, run): “You count them, a row at a time: eight, sixteen…”, the drops lit a row at a time
  (8 · 16 · 24 · 32, `byRow`), then “Sixteen and sixteen: thirty-two. There.” (last miss: “Sixteen and sixteen:
  thirty-two.”); a missed filler's close is “There.”.
- **Fillers** (run, the story's order): “An easy one.” / “Two rows of eight. How many drops?” (2 × 8), then three rows
  (8 × 3), then “The drops again.” / “How many drops must you gather?”, with Mizzle not met, right, or missed twice;
  after the sleepy question missed once (its sibling: it borrows from the same lesson, `E.siblingAsked`), 8 × 5 then
  2 × 8. A second miss lends 8 × 5, then 2 × 8 (Mizzle not met or right), or 2 × 8, then 8 × 3 (Mizzle missed). Each
  is the rule below in one state (the story's own filler note, "after a missed sleepy question, 8 × 5, then 2 × 8",
  is true after one miss: section 7, item 7). Never 4 × 8 (its own pair), 6 × 8 (too big to be easy after thirty-two)
  or a new fact.
- **The right line**: “Thirty-two!” (our cat's: nobody else is there) and the caption “Plip. Plip. Plip. Into your
  leaf they go.” (the story's sound, lettered in its caption: section 7, item 9), kept on a retry. **Timing**: its own
  words, never timed; a miss is an 8s and a 4s hard fact (`E.tableOf`: the 8s; its pair is 4 × 8).

### `ch09-rubs` and `ch09-flaps`, the remedy's doses (one question each, under the Old Bridge)

```js
'ch09-rubs': Object.assign({}, DOSE, {
  thing: 'rub', things: 'rubs', teacher: 'thymeleaf',
  facts: [{ a: 3, b: 8, prompt: [{ kind: 'caption', text: 'How many rubs a day?' }], retryPrompt: true,
    right: [TH('Twenty-four!'), { who: 'sprinkle', text: 'Twenty-four TICKLES.' }], rightAgain: true }],
  helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
  avoid: [[3, 8], [6, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
}),
'ch09-flaps': Object.assign({}, DOSE, {
  thing: 'flap', things: 'flaps', teacher: 'thymeleaf',
  facts: [Object.assign({ a: 8, b: 8, prompt: [{ kind: 'caption', text: 'How many flaps a day?' }], retryPrompt: true,
    right: [TH('Sixty-four!')], rightAgain: true }, way('One side: thirty-two. Thirty and thirty make sixty. Two and two make four. Sixty-four.'))],
  helpIntro: 'Let’s count them together.', helpIntroFar: 'Let’s count them together.',
  avoid: [[3, 8], [4, 8], [7, 8], [8, 8]], miss: MISS, missLast: LAST
})
```

- **Thymeleaf's voice throughout** (`teacher: 'thymeleaf'`): the Counts frame's balloon (“Eight rubs,” … “Morning, noon
  and night.”; “And practice,” … “Eight times a day.”) is said again over the question (default intro, one balloon),
  then the question's caption. The right lines: “Twenty-four!” (Thymeleaf's) and Sprinkle's “Twenty-four TICKLES.”
  (the story's “…,” giggles Sprinkle.); “Sixty-four!” (Thymeleaf's). Kept on a retry.
- **Pictures**: the rubs, three rows of eight little paw marks; the flaps, eight rows of eight plain marks; each row
  four and four, unlit (`kind: 'dose'` with `thing: 'rub'` and `'flap'`: section 4).
- **Help** (`help: 'picture'`, run): “Let’s count them together.”, the marks lit a row at a time in Thymeleaf's count
  (8 · 16 · 24; 8 to 64); then “There. We’ll come back to that one.”, and for the flaps the way first: “One side:
  thirty-two. Thirty and thirty make sixty. Two and two make four. Sixty-four. There. We’ll come back to that one.”
- **Fillers** (run), each after his “An easy one.” in the dose's own rows (“An easy one. Two rows of eight. How many
  rubs?”). With Mizzle not met and every earlier dose right: the rubs 2 × 8, then 8 × 5, and on a second miss 2 × 8,
  then 4 × 8 (the dew's pair hours after the dew, on purpose); the flaps 2 × 8, then 8 × 5, and on a second miss
  6 × 8, then 2 × 8. In every other state the order is the rule below, and the table there gives each first miss by
  its earlier sets' states (the rubs lend the dew's 4 × 8 on a first miss too, after the dew missed twice, Mizzle
  missed twice, or Mizzle and the dew each missed). Never their own pairs, an avoided pair or a new fact (section 6).
- **Timing**: their own words, never timed; a miss is an 8s hard fact.

### How the one-fact sets lend (Mizzle's and the three doses: the rule, run)

The four one-fact sets all borrow from the lesson (`fillFrom: 'ch09-eights'`, `fillOrder: 'easiest'`), so they are
siblings (`E.siblingAsked`), and every filler they lend follows one rule (the engine's `fillers()` as shipped; run,
`sim2.js` and `probe3.js`). Each lends from the lesson's five easiest, in their order (2 × 8, 8 × 3, 4 × 8, 8 × 5,
6 × 8), only its **lendable** pairs (in that pool, not its own pair, not in its `avoid`: Mizzle 2 × 8, 8 × 3, 4 × 8,
8 × 5; the dew 2 × 8, 8 × 3, 8 × 5; the rubs 2 × 8, 4 × 8, 8 × 5; the flaps 2 × 8, 8 × 5, 6 × 8): **first those
nothing has asked this reading** (the set itself, its fillers so far included, and every earlier one of the four,
its own fact and its fillers alike: the dew's own 8 × 4 counts as the rubs' 4 × 8 asked, and Mizzle's own 6 × 8 as the
flaps' 6 × 8 asked),
**then any lendable pair**, in the same order. Every order in this section is that rule in one state. The test pins
the rule's guarantees (never the set's own pair, an avoided pair or a new fact: section 6's exhaustive run) and named
runs with their earlier sets' states written out, never a sentence about "a missed X" alone.

**First miss, by the earlier sets' states** (`probe3.js`, every combination; each earlier set right, missed once, or
missed twice (its retry missed too), its fillers right; Mizzle also not met; the dew and the rubs are on every reading):

| Set | Lends, in order | When |
|---|---|---|
| `ch09-mizzle` | 2 × 8, 8 × 3 | always (the first of the four) |
| `ch09-dew` | 2 × 8, 8 × 3 | Mizzle not met, right, or missed twice |
| | 8 × 5, 2 × 8 | Mizzle missed once |
| `ch09-rubs` | 2 × 8, 8 × 5 | the dew right, and Mizzle not met or right |
| | 8 × 5, 2 × 8 | the dew missed once, Mizzle not met or right; or Mizzle missed once, the dew right |
| | 2 × 8, 4 × 8 | the dew missed twice; or Mizzle missed twice; or Mizzle and the dew each missed |
| `ch09-flaps` | 2 × 8, 8 × 5 | Mizzle not met, the dew and the rubs right; or Mizzle met, in every state but the next row's two |
| | 8 × 5, 2 × 8 | Mizzle right, the dew missed once, the rubs right; or Mizzle missed once, the dew and the rubs right |
| | 6 × 8, 2 × 8 | Mizzle not met, and the rubs missed (once or twice) or the dew missed twice |
| | 8 × 5, 6 × 8 | Mizzle not met, the dew missed once, the rubs right |

**Second miss** (`sim2.js`): Mizzle 4 × 8, 8 × 5; the dew 8 × 5, 2 × 8 (Mizzle not met or right) or 2 × 8, 8 × 3
(Mizzle missed); the rubs 2 × 8, 4 × 8 in every state; the flaps 6 × 8, 2 × 8 (Mizzle not met, the dew and the rubs
right) or else 2 × 8, 8 × 5. A missed filler comes back as itself (R:2×8) and takes a slot, so a later pass may lend one
pair fewer; the guarantees still hold (the exhaustive runs miss fillers too).

**Every dose missed once** (run): with Mizzle not met, 2 × 8, 8 × 3 (the dew), 8 × 5, 2 × 8 (the rubs), 6 × 8, 2 × 8 (the
flaps): 2 × 8 three times as “An easy one.”, no other filler twice (the story's claim holds on that reading); with Mizzle
right, the flaps lend 2 × 8, 8 × 5, so 8 × 5 comes twice as well; with Mizzle missed once (her “An easy one…” lent 2 × 8,
8 × 3), the dew 8 × 5, 2 × 8, the rubs 2 × 8, 4 × 8, the flaps 2 × 8, 8 × 5: 2 × 8 three times in the doses and four in
the day, 8 × 5 twice. Section 7, item 14.

### The taps that count (skip and ask)

- **The spider's legs** (Thymeleaf's den: “In a corner of the den, a tiny spider stops spinning and waves a leg at
  you. You wave back.”): `skip: { table: 4, groups: 2, who: [{ who: 'spider' }], thing: 'leg', things: 'legs', teacher:
  'player', label: 'Count the next four legs.', prompt: '**Tap** her legs.', next }`. One spider close (the
  table-4 picture with a `who` of one spider, keyed on `thing: 'leg'`: section 4): the first tap lights the four legs on
  one side and puts 4 in her balloon, the second the four on the other, 8, and turns the page. **No `keep`**: the page
  it turns to (“Eight legs,” says Tallyheart. …) shows its own scene under the big 8 carried (`E.skipInto`); a kept
  picture would also take the warm-up's Counts frame in the Hollow, two pages on (`E.keptSkip` runs to the first
  Counts frame).
- **Five spiders in the sand** (“In the sand, Tallyheart scratches five little spiders, four legs on each side.” / “Hop
  by eights,” she says.): `skip: { table: 8, groups: 5, thing: 'leg', things: 'legs', teacher: 'tallyheart', label:
  'Count the next spider’s legs.', prompt: '**Tap** the spiders.', carry: false, next }`. Five spiders, the next
  glowing; each tap lights her eight legs, four and four, its running total under her and a big number over the
  picture, Tallyheart's count “8… 16… 24… 32… 40!”. `carry: false`: the page it turns to is the tree's ask.
- **The tree** (“Forty! Now, a secret,” … “One from every mark on this tree.” / “AGAIN?”): `ask: { who: 'tallyheart',
  to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.', pairs: [['Tails?', 'Eight cats,
  eight tails!'], ['Ears?', 'Eight cats, sixteen ears!'], ['Claws?', 'Eight forepaws, forty claws!'], ['Both
  forepaws?', 'Eight cats, eighty claws!'], ['Nine lives?', 'Eight cats, seventy-two lives!'], ['Patrols?', 'Eight
  patrols, twenty-four guards!'], ['Whiskers?', 'Eight cheeks, forty-eight whiskers!'], ['Paws?', 'Eight cats,
  thirty-two paws. That was YESTERDAY!']], next }` (eight pairs, one for each claw mark: 8 × 1, 8 × 2, 8 × 5, 8 × 10,
  8 × 9, 8 × 3, 8 × 6, 8 × 4), on `hollow`/`wide` with `{ marks: 8, glow: 'auto' }`, Tallyheart at `tree-far` with
  `glow: true`, our cat at `sunpatch-2`, the rim's five sitting up (`rim()`, as at the warm-up: nobody leaves the rim in this
  chapter); the frame's own `say` the two balloons before it. Next after the eighth.
- **Thymeleaf's four things** (“A wing is a wing,” … “one from every corner of the river.”): `ask: { who: 'thymeleaf',
  to: 'thymeleaf', prompt: '**Tap** his claws.', label: 'Hear the next thing.', pairs: [['Reed root, from ReedClan.',
  'It holds it all together.'], ['Oak moss, from GroveClan.', 'It calms the hurt.'], ['River mint, from the otters’
  Holt.', 'It cools.'], ['And dew from the glass towers,', 'gathered high up at first light.']], next }` on the camp's
  `herbs` (Thymeleaf in `pawup`, his forepaw raised, `glow: true`). The ask letters two lines a tap, and `E.checkStory`
  wants both non-empty, so each of the story's four balloons is his two balloons, split at its sentence break (the
  fourth at its comma, a balloon that runs on into the next): no word changes. Next after the fourth (the story's "The
  fourth tap turns the page" cannot be: the ask shows the last pair before Next; section 7, item 7).
- **The case** (“That evening, the den is empty.” … “You lay out your bark, row by row.”): `ask: { who: 'tallyheart', to:
  'player', opt: 'read', prompt: '**Tap** each row.', label: 'Read the next row.', pairs: [['The moon?', 'Waffles and
  Patience say NO moon. Only the fox says moon.'], ['The fox’s little story?', 'He says it FLEW. But on the storm
  night, Sprinkle couldn’t fly at all.'], ['The piles?', 'Ours and ReedClan’s were both robbed, and the prey is all in
  one stash.'], ['The scale?', 'It’s not a scale. It’s tower glass.'], ['The prints?', 'Sprinkle’s are huge. The
  thief’s are tiny.'], ['The tunnel?', 'Coil felt small diggers, and I found their tunnel.']], next }` on the den's
  `case` with `read: 0` (section 4): each tap adds one to the scene's `read` (`ask.opt`, `E.askScene`), so the next
  row lights; the art marks the row to tap next (`pc-next`), which the page takes as the asker's spot (ui.js reads the
  art's own mark first), so she taps the row, not Tallyheart. No Tallyheart glow. Next after the sixth. (The panel's
  VoiceOver label still says “Touch Tallyheart to hear the next question.”: section 7, item 15.)
- **Bedtime** (“Tonight it’s LEGS,” you say. “Spider legs.”): chapter 8's skip exactly: `skip: { table: 4, groups: 2,
  who: [{ who: 'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the
  next cat’s paws.', prompt: '**Tap** the paws.', next }`; her count “4… 8!”; the second tap turns the page to “Eight,”
  you say. … under a big 8 (carried).

## 3. The Case File

**One new card**, an ear, under the moss; **no link**. Squall's card (chapter 4's `squall-shapes`) is given again by the
roof scene's own frame (`f087a`, copied) to a cat who meets him here.

| id | Mark | Line as lettered | Given | To whom | Links |
|---|---|---|---|---|---|
| `mizzle-wing` | ear | Mizzle says Sprinkle’s wing was hurt before the rain stopped. | the panel of her thought, “The fox says the dragon FLEW off when the rain stopped. With a hurt wing? She COULDN’T!” (after her “I know. In the storm…”) | only with `foundMizzle` (`when: { foundMizzle: true }`: shown from the frame that gives it, as `squall-shapes` and `hail-shapes`) | none |

- **No link** (the story leaves it to the spec). Her card bears on FLEW, but that row is `cant-fly` — `fox-flew` —
  `fox-brag` (— `sleet-den`), and a row grows only at its ends (`E.caseFile`'s `touch`): only `cant-fly`'s end is
  free, and the default join, “They can’t both be true.”, would be false between two cards that are both true; a line
  of the spec's own would be a line she reads that the story does not have, and a row of five is a page layout chapter
  8 never made (`cf-pair n4` is the longest). The caption on her frame says why it matters, in the cat's own thought,
  and the case reads it aloud (“And Mizzle says…”). Answering FLEW with it is chapter 10's (`answers`, README 45).
- **Picture** (`app/art/cards.js`, key `mizzle-wing`): `cant-fly`'s own drooping wing (one wing drawn one way: cards.js's
  rule for cards that tell of one thing), smaller and lower, under slanting rain lines, with one lightning zigzag above.
  Label: "the drooping wing under falling rain and a flash of lightning". It must look unlike `cant-fly` ("a drooping
  wing") at a paw's size: the rain and the flash are the difference.
- **In her nest**: under the moss (`BARK_SECRET` gains `mizzle-wing`): a dragonet's card, as Hail's.
- She holds **20 to 30 cards** by bedtime (20 to 29 before: 29 only for a cat who read chapter 1 again to change her
  specialty, so she holds noticing's `dug-earth` and `prints-pile` and the climber's `prints-tracks`; a 30th with Mizzle;
  `squall-shapes` new here for a cat who meets him on the roof); **eight to eleven under the moss**. The fullest cat
  (every dragonet, Mizzle, and both specialties' cards by that reread) holds 30: nineteen along the edge and eleven under
  the moss. Her nest stands in three courses (6, 6 and 7, past `BARK_THIRD.hidden`, 18, as a 29-card file after chapter
  8 already stands), with corners in two layers, and neither cap (`BARK_MAX` 27, `CORNER_MAX` 18) is reached. On a
  straight reading the fullest is 29 (a noticing cat): eighteen along the edge, two courses. (Corrected 2026-10-26 by
  the review, read through the engine; this section first said 20 to 29, the fullest 29.)
- **Her file's rows after chapter 9** (run, `sim3.js`): as after chapter 8, every cat: `cant-fly` — `fox-flew` —
  `fox-brag` (— `sleet-den`), `waffles-no-moon` — `fox-moon` — `heron-no-moon`, `tidy` — `reed-pile` — `stash`,
  `coil-diggers` — `tunnel`, `scale` — `glass`; and chapter 5's pairs where she holds them (`squall-shapes` —
  `heron-shapes`; `prints-pile` — `prints-marsh`; a climber's `prints-tracks` — `squall-shapes` — `heron-shapes`, which
  a climber who meets Squall on the roof here now has). `mizzle-wing` lies alone among the ears.
- **The laid-out case reads six rows every cat holds** (the story's Tap): the moon (`waffles-no-moon`, `fox-moon`,
  `heron-no-moon`), FLEW (`cant-fly`, `fox-flew`, `fox-brag`, and `sleet-den` at its end for a Sleet cat), the piles
  (`tidy`, `reed-pile`, `stash`), the scale (`scale`, `glass`), the prints (`prints-sprinkle`, a row of one) and the
  tunnel (`coil-diggers`, `tunnel`). Every one of those fourteen is an everyone card (checked against continuity's
  table), so every cat lays them all out. Her count (`my-count`, which may be missing: chapter 7's known issue 15) and
  Mizzle's card (with `foundMizzle`) are said on the next screen and laid out then, and stay laid out on every `case`
  frame after it (`read: 7`: section 4, the den's `case`; section 5); the rest of her bark lies stacked by the nest,
  unread. Nothing is "answered": picking the cards is chapter 10's.
- Not cards, on purpose: the forty, the tunnel left open as proof, the four ingredients, Thymeleaf's yes, the elder's
  memory, the doses, the four wingbeats, Glintstar's ruling and her "you will speak".

## 4. Art needs

One new place and the new cast the brief names. **New** marks what the art must add; every option is off by default
and every camera and anchor additional, so chapters 1 to 8 draw byte-identically for every live save (section 7, item
2: the proof). Times of day: `morning` at the pile, behind it, in Thymeleaf's den and in the Hollow (day 9), at the
tower, on the roof and back in Thymeleaf's den (day 10); `day` at the ReedClan border, in GroveClan's woods, under the
Old Bridge (the remedy) and on its sunny bank (the practice, days 10 to 13); `sunset` at the wall's end on the way home
(the root); `dusk` at the pile for the montage (`moon: 12`); `night` in the den on evening 13 (`moon: 13` where the sky
shows) and at bedtime.

### Places

| Set (file) | What the chapter uses | New |
|---|---|---|
| **`grove`** (new: `sets/grove.js`) | GroveClan's woods: the little bridge over the channel, the old trees, the elder, the old oak, the hollow in its trunk (the brief: the one new place) | **The whole set** (below) |
| `camp` (`scenes.js`) | Thymeleaf's den, a nook of the camp's bramble dens, day 9 (the meeting, the spider) and day 10 (the remedy mixed) | **Camera `herbs`** (below), **option `remedy`** |
| `den` (`scenes.js`) | evening 13: the case laid out, and Glintstar on `case` (her entry too); bedtime: `nest`, `inside`, `doorway` | **Camera `case`**, **option `read`**, **`moon: 13`**; `mizzle-wing` under the moss (below) |
| `hollow` (`scenes.js`) | `wide` with the five rim cats sitting up (`rim()`), Tallyheart at `tree-far`, our cat at `sunpatch-2`, `{ marks: 8, glow: 'auto' }` until SKRITCH; `lesson` for the lesson's balloon; `sand` for the five spiders; `tree` with `{ marks: 9, glow: 'auto' }` (Tallyheart `stretch`); every `hollow` frame after it `{ marks: 9, glow: 'auto' }` | nothing: `marks: 9` draws as `markSpots` has always laid nine (four, four and one); check it reads at `tree` and `wide` |
| `pile` (`sets/pile.js`) | morning: `rows` with chapter 7's shade and `tap: 'back'` but every row whole (`{ rows: [10, 10, 10, 10], back: 'shadow', scale: 'behind', tap: 'back' }`); `gap` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }` ("no gaps"); `wide`/`low` for the cheer; `rear` at **morning** with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true }` (Tallyheart's whisper; the told Riffle at the hedge; the kept talk); dusk: `wide` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 12 }` (the montage) | nothing by name. Three states no shipped frame draws, to check in the morning light: **`rear` by morning** (drawn at dusk and at night so far); **`rows` with `back: 'shadow'` over a whole back row** (chapters 4 to 7 shaded a gapped one): the whole row in the brambles' shade, the `data-tap="back"` box on the band; **`gap` with every row whole** (drawn only at dusk, chapter 6's f113). Chapter 7's and 8's frames draw as they do |
| `title` (`scenes.js`) | the ReedClan border at the wall's end (`end`, `meet`) by day, and on the way home at `sunset` (the first time `end` is drawn by anything but day) | **Options `root` and `tap: 'none' \| 'root'`** (below) |
| `tower` (`scenes.js`) | `up` at `morning`: our cat at `foot` with her leaf, Waffles at `railing`, `{ chime: true, light: true }`, `roar: true` for the roar; the ride, as chapter 4's `f078a` (`{ chime: true, ding: true }`, nobody at the foot) | nothing |
| `roof` (`sets/roof.js`) | chapter 4's roof frames, run again at `morning` (the roof's own `morning` light); the dew: `two` (close enough that Squall's face, or his tail tip and mist ring, and the silver puddle read) | **Option `dew`**, **anchor `puddle`** (below) |
| `bridge` (`sets/bridge.js`) | `day`: `back` with `{ prints: true, stones: true }` (the remedy; `branch: true` on the told twin of its first panel); `wall` (Coil's “QUIET”); `bank` in the sunshine (the practice) | **Option `shallows`**, **anchors `run`, `run-2`, `skim`, `air`, `paddle`, `watch-1`…`watch-4` on `bank`** (below) |

#### The new set, `grove` (`app/art/sets/grove.js`)

`PC.art.defineSet('grove', { label: 'GroveClan’s woods: the little bridge, the old trees and the old oak', tod: 'day',
… })`, drawn with `PC.art.kit` in the 1600 × 1000 world: **bright afternoon, green and gold, never dark**; very old,
very tall trees, wide trunks and roots like arms, ferns, dappled light on soft ground; the channel under the little
bridge **narrow, bright and clear in the afternoon sun, never dark** (the standing rule for water). Nothing in it is
frightening; the hollow is a cosy nook, never a dark hole. It is drawn only by day.

| Camera | Composition | Anchors | Options |
|---|---|---|---|
| `bridge` | the approach: the river path's near bank at the left, a little old footbridge (low stone sides, worn flat top) over a narrow channel of clear, bright water, and on its far side the very old trees of the woods | `near-1`, `near-2` (on the near bank at the bridge's foot, facing right), `span-1`, `span-2` (on the bridge itself: Riffle waiting with his mint; our cat stepping on, one paw at a time), `far` (at the bridge's far end) | none |
| `wide` | over the bridge: the bridge's end small at the left, the woods rising across the panel, huge trunks, green-gold light, ferns; the visitors small under the trees | `edge-1`, `edge-2`, `edge-3` (at the bridge's end, waiting to be asked in, facing right), `elder` (stepping out from between the trunks at the right, facing left), `fern` (behind the elder, half hidden by a fern: the apprentice, a face and ears showing) | none |
| `meet` | at cat height under the trees: the elder at the right, the visitors at the left | `meet-1`, `meet-2`, `meet-3` (our cat, Tallyheart, Riffle: left, facing right), `elder` (right, facing left), `fern` (behind the elder, as on `wide`) | none |
| `oak` | the old oak: an enormous trunk furry with moss, **green, gold and grey**, and on its shaded north side, low, a patch of **soft silver moss** (always drawn: the elder's and Mizzle's "silver kind"); roots like arms at its foot; **high in the trunk, the hollow**: a round opening, its inside a soft dusk-green, never black | `root-1`, `root-2`, `root-3` (at the oak's foot among the roots), `elder` (beside the oak, right), `trunk` (on the trunk partway up toward the hollow: a climber in `stretch`; `{ elev: true, air: true }`, so no ground shadow is laid on the bark), `moss` (at the silver moss, low: a cat crouched there gathering it) | none |
| `hollow` | inside the hollow, close: a snug round nook of old wood lined with soft moss, warm green-gold light through the opening at the left | `nook` (on the moss: Mizzle, small, curled or sitting up), `lip` (at the opening: our cat, head, shoulders and forepaws in, the rest of her cut by the opening's rim, as `tracks`' `stash-in`; the rim cuts below her forepaws, so a leaf held at her paws, and its `tap: 'leaf'` box, stay in view) | none |

Declared: `opts: {}`, `defaults: {}`. The snore from the hollow is the frame's sound (*Zzz… snrk.*), not the art's.
GroveClan's two cats stand in `wide`, `meet` and `oak`; the visitors never go past the bridge's end until the elder's
"Take what you need" (the story's note): `edge-*` and `meet-*` are at the bridge's end.

#### Thymeleaf's den: the camp's `herbs` (`scenes.js`)

A camera of the camp, a composition of its own (`comp: 'herbs'`): **a nook of the bramble dens at the camp's edge**,
seen from just inside its mouth: a curtain of drying leaves across the top (bunches of leaves and stems hung upside
down from the brambles), more bunches along the walls, a ledge of stones with leaves laid out to dry, a flat mixing
stone on the floor, and in the top corner a small web where the spider lives; morning light through the leaves, green
and warm. Anchors: `herbs-1` (Thymeleaf, among his leaves at the left, facing right), `herbs-2` (our cat, right, facing
left), `herbs-3` (Tallyheart, beside our cat, further right), `web` (the spider's corner, high: a tiny cast member there).
**Option `remedy: 'none' | 'four' | 'mixed'`** (default `'none'`): on the mixing stone, `'four'` the four things in a
row (a long pale root, a roll of soft silver moss, a bunch of mint, a curled leaf holding dew drops); `'mixed'` one
curled leaf of **pale green** remedy, the stone smeared green. The rest of the camp's frames draw as they do.

#### The den: the case laid out (`case`), `read`, `moon: 13`, the secret card (`scenes.js`)

- **Camera `case`** (`comp: 'case'`): close, a little above, on the den floor in front of her nest at night (moonlight
  from the doorway, out of frame), her nest at the back with **its moss rolled back**. On the floor her bark **laid
  out in rows**, each piece face up (`PC.art.cardGroup`, at a size where the pictures read on an iPad page), the
  pieces of a row touching as her file lays them: six rows in the order she reads them (the moon; FLEW; the piles; the
  scale; the prints; the tunnel: section 3), and a **seventh row** of her count (`my-count`) and Mizzle's card
  (`mizzle-wing`), each only if she holds it, **laid out only with `read: 7`**. The pieces come from `bark: 'auto'`
  (`E.resolveScene` already fills it with every card she holds as `{ picture, mark }`, and a card's picture is its id):
  the art finds the rows' pieces by picture, lays `sleet-den` at the end of FLEW's row when she holds it, and stacks
  every other piece she holds **face down** by the nest's edge, unread (no BARK_MAX here). **Before `read: 7`**,
  `my-count` and `mizzle-wing` lie in the face-down stack; **at `read: 7`** they leave it for row seven. So at most 15
  pieces lie face up before `read: 7` and 17 at it, and the stack holds the rest: up to 15 (a 30-card file before
  `read: 7`) and up to 13 at it. Her glass in its leaf lies beside the rows with `glass: true`. **Riffle's stone** lies
  in her nest at the back with `stone: 'auto'` (every den frame has drawn it since chapter 2; every `case` frame carries
  it). Anchors: `case-1` (our cat at the rows' near left, facing right), `case-2` (Tallyheart across the rows at the
  right, facing left), `case-3` (a standing cat at the far side by the doorway's light, facing left: Glintstar, a
  little bigger, as the leader; Glintstar `walk` there is her entry, stepping in from the doorway's light, and `walk`
  facing right her going). The rows are in `keep`.
- **Option `read`** (a number, default 0; on `case` only): the rows lit (the pieces' bark warm, as a lit card is on the
  page), the first `read` of the six; the next row, while `read` < 6, carries the glow the page takes as the Tap's
  spot: **one `<rect class="pc-next" …>` emitted immediately before that row's `<g>`**, as cats.js emits a glowing
  cat's (the page's hop wiggle wraps the `.pc-next` rect with its `nextElementSibling`, so the row's group must follow
  it at once); nothing else in the scene carries `pc-next` or `pc-tap`. `read: 6`: all six lit, nothing glowing;
  `read: 7`: the seventh row laid out and lit too, nothing glowing. Every `case` frame after the ask is `read: 7`
  (section 5), so `read: 6` is drawn only by the gallery and the tests.
- **`moon: 13`** (the den's `moon` list gains 13: `[false, true, 5, 8, 13]`): the thirteenth evening's moon, **nearly
  round** (the art's clock, `moonT(13)` = −0.82), at night or dusk, from outside and in the doorway's patch of sky
  (`denMoonAged` already takes any age from 8). For the bedtime panels on `doorway` and `inside` (section 5).
- **`BARK_SECRET` gains `mizzle-wing`.** Up to eleven corners under the moss (the second layer, chapter 8's growth);
  along the edge at most nineteen (three courses: a reread cat's 29-card file after chapter 8 already has nineteen). No
  live save holds the card, so every live file draws as it does.
- In chapter 4's bedtime frames (no `hidden`), a 30-card file shows its newest 27 (chapter 8's rule; 28- and 29-card files
  already did after chapter 8, so only 30 is new).

#### The ReedClan border: the reed root (`title`, `scenes.js`)

**Option `root: true`** (`end` and `meet`; default false): at the wall's end, on the dry stones (never in the mud or the
reeds), **a long, pale reed root** lying along the stones, and beside it **one wet pawprint**, dark on the dry stone;
nobody in the reeds (with `rustle: true` they move). **`tap: 'none' | 'root'`** (default `'none'`): the root's box, an
unpainted `<rect class="pc-tap" data-tap="root">` (the take-the-root Tap). At `sunset` the wall's end in the late gold
(the title set's own light): `end` and `meet` have only been drawn by day (chapter 6), so the sunset branch of their sun
and river glint is drawn here for the first time; check that the root, the pawprint (still dark on the stone in the
late gold) and the reeds read at `sunset` with `root: true` and `tap: 'root'`, the tap box on the root inside the
camera. Chapter 6's frames draw as they do.

#### The roof at first light: the dew (`roof`, `sets/roof.js`)

- **Option `dew: true`** (default false; every camera that shows the rain puddle): **the rain puddle silver with dew**
  at first light, its surface pale and bright, tiny beads of dew on the grit round it, catching the low sun. The roof's
  `morning` light as it draws today (its header: `day`, `morning`, `dusk` and `night` redraw it); chapter 4's and 5's
  frames draw as they do.
- **Anchor `puddle`** (`wide` and `two`): at the puddle's edge, a cat crouched over it (her leaf at her paws), clear of
  the pole's spot and of the wall. The chapter's dew frames are on **`two`** (cat and dragonet at the same height, the
  pole behind him, the puddle about 190 wide): on `wide` a sitting cat at `pole` is 150 tall, and his face, his tail tip
  and the puddle would be a few pixels. On `two` at `morning` with `dew: true`: the silver puddle and its beads read,
  Squall at `pole` (`roar`) reads, and so do his `hidden` tail tip and mist ring at the pole's foot, with `plane: true`.

#### The sunny bank: the practice (`bridge`, `sets/bridge.js`)

- **Option `shallows: true`** (on `bank`; default false): the water at the bank's edge **bright and clear in the sun**:
  pale green-gold over a sandy bottom you can see, sparkles, small rings, and **a strip of soft pale sand** along it;
  the river beyond as it is. Never dark. Chapters 2 to 8's `bank` frames (`shallows` off) draw as they do.
- **Where it lies**: the sand strip and the shallows are tucked at the bridge's foot, screened from the river path by the
  bank's reeds and the edge of the bridge's shadow (she practises by day before Glintstar is told): no frame on the
  bank shows the Clan's side or a patrol in view.
- **New anchors on `bank`** (additional): `run` (on the sand, mid-right: Sprinkle running, flapping, landing; at her
  heron size), `run-2` (on the sand beside `run`, on its left, facing her: our cat in the specialty chain, cat-sized),
  `skim` (between `run` and `paddle`, at the water's edge, her paws just clear of the sand: the low glide of the first
  days; `{ elev: true, air: true }`), `air` (above `run`, her paws a little more than her own leg's length off the sand:
  the lift of the last day only; `{ elev: true, air: true }`), `paddle` (in the bright shallows at the sand's edge: the
  water over her legs, rings and drops round her; `{ air: true }`), `watch-1`…`watch-4` (her friends on the bank at the
  left, side by side, facing right; cat-sized, the otter at his own size).
- **Shadows at the new spots.** `scenes.js` lays a shadow at the anchor's foot under every cast member; an `air: true`
  anchor stops it for a cat, but Sprinkle is in `OWN_SHADOW`, whose branch reads no `air`. So the nest owner adds
  `NO_SHADOW.sprinkle = { glide: 1, fly: 1, splash: 1 }` (no body shadow in the air or in the water: new poses, so no
  shipped frame moves), and `bridge.js` draws the shadows itself, as chapter 7's `over` has the set draw them: a soft
  one on the sand below `air` and a fainter one below `skim`, each only when `S.cast` has someone there (`bridge.js`
  reads `S.cast` for `water` already); at `paddle` the water and its rings over her legs, and nothing dark in the water
  under her (chapter 5's rule). In `hop` at `run` she keeps her shadow: cats.js draws her lifted inside her box, so the
  shadow at the foot lies on the sand under her.

### New cast (`app/art/cats.js`; their scene rules in `scenes.js`)

- **Thymeleaf** (`thymeleaf`, a tom): CrystalClan's medicine cat, old and calm. A soft, long-furred **oatmeal-grey tom
  with a white chest and white paws**, a little thin at the shoulders, a greyer muzzle, long white whiskers, bushy pale
  brows, **green-gold eyes with a twinkle** (a bright catchlight and smile creases at their corners), and **a sprig of
  mint tucked behind one ear** (always: he smells of mint). Plainly not the grizzled old tom (dark brown, scarred), nor
  Glintstar (silver), nor any player look. Every cat pose and mood (he is a cat): `sit`, `stand`, `walk`, `crouch` (over
  his mixing stone, sniffing a wing), `pawup` (a forepaw raised, claws out: counting his four things), `lookup`.
  `holds: 'leaf'` (the remedy, curled in a leaf). Never `laugh` (no grown cat is drawn in tears).
- **Mizzle** (`mizzle`, she): the last dragonet, on Sprinkle's model (as Sleet and Hail are), **little**: sitting no
  taller than our cat (`SIZE_CAP` in `scenes.js`: `mizzle: 'player'`, Squall's and Hail's rule), so she fits the hollow.
  **Pearly green**: pale green scales with a soft pearl sheen (a pink-lilac shimmer on the highlights), pale green-white
  belly, soft rounded ridges, small folded wings, two soft horn nubs, a short round snout; **big sleepy eyes**, heavy
  lids. Sweet, never toothy. Plainly not Wisp (see-through pale), Sprinkle (mist grey) or Hail (white, speckled). Poses:
  **`curl`** (curled on the moss, tail round her nose: what an unknown pose draws), **`yawn`** (head up, one eye open, a
  big round yawn: no teeth), **`sit`** (sitting up, drowsy), **`wake`** (sitting up straight, both eyes wide open, frills
  and ears up: "Both eyes open." / "wide awake for once"), **`pawup`** (one forepaw raised, a claw pointing: "the soft
  silver kind, on the north side"). She honours `asleep: true` (eyes shut, a little `zzz` from the fx) and `asleep:
  'half'` (half-lidded). Every mood, drawn her way (`sleepy` her resting face). In `scenes.js`: `OWN_SHADOW.mizzle` (her
  shadow under her body, not her wings and tail, as Hail's), no `NO_SHADOW` entry, not `BIG`.
- **In `scenes.js`, for all four** (the nest owner's): each new cast id placed as its kind is: `thymeleaf` and `groveclan`
  as cats (every cat rule: side-on, the cat's shadow, the cat's size at an anchor; `groveclan` by variant, as `reedclan`),
  `mizzle` as a dragonet (above), `spider` tiny (her drawing a small fraction of the anchor's height: about the size of a
  cat's forepaw at `web`; no shadow). And for the cast from before: `NO_SHADOW.squall = { hidden: 1 }` and
  `NO_SHADOW.sprinkle = { glide: 1, fly: 1, splash: 1 }` (below, and "The sunny bank").
- **GroveClan's cats** (`groveclan`, variants 1 and 2): cats, every cat pose and mood, in **woodland coats of their own**
  that no player's cat and no CrystalClan or ReedClan cat can have (as `reedclan`'s marsh coats): **1, the elder** (a
  she-cat): a dappled grey-brown coat, the dapples like sun through leaves, **a white muzzle**, grey hairs at her ears,
  upright and sharp-eyed (hazel), kind; **2, the apprentice**: small (apprentice-sized, as our cat), dappled fawn and
  cream, big eyes, a scrap of moss on one ear; shy; never speaks. Labels by variant (section 5).
- **The spider** (`spider`): one tiny garden spider: **a small round body, smooth, no hair, no fangs**, two dot eyes and
  a little smile, **four legs on each side**, a soft brown with a pale pattern on her back; friendly, never creepy, never
  crawling toward anyone. Poses: **`spin`** (in her corner on a few threads, spinning), **`wave`** (one front leg raised,
  waving). Tiny in any scene (the set's `web` anchor gives her a spot about the size of a cat's paw). She is the 8s'
  picture (Counts art).

### The cast from before, new poses and extras

- **Sprinkle: in flight** (the brief: new art for her): **`hop`** (a hop off the sand, all four paws up, wings half open: drawn
  lifted a little inside her box, so the shadow at her anchor's foot lies on the sand under her), **`flap`** (both wings up,
  flapping hard: her hurt right wing a little lower and stiffer than the good one, so "her hurt wing lifts a little higher" can be
  seen across the days), **`glide`** (wings spread wide, gliding low at `skim`, paws tucked), **`fly`** (in the air at `air`, both
  wings up mid-beat, paws off the ground, joyful: the lift), **`splash`** (sitting up in the bright shallows at `paddle`, water to
  her chest, drops flying, laughing). `glide`, `fly` and `splash` get no body shadow from `scenes.js` (`NO_SHADOW.sprinkle`: the
  bank draws the sand's shadows itself). **`tap: 'wing'`**: her hurt right wing marked for the page (an unpainted `pc-tap
  pc-tap-wing` over the wing, in any pose that shows it: the rub Tap). Her laugh is `happy` (her `laugh`, if it draws tears as a
  cat's does, is not used). Her other poses as they are (`hide`, `peek`, `burp` with `mist`, `wings`, `sit`, `lie`, `flat`).
- **Squall: new pose `hidden`**: out of sight behind the red light's pole: nothing of him but **the tip of his slate tail
  with its yellow flecks**, curled round the pole's foot, and a small ring of hiccup mist rising beside it; never his
  face. `NO_FACE_POSES` already has `hidden` (Sleet's), so a balloon of his with a `name` keeps its face to itself
  (`faceHidden`): “AND STAY OUT, giant dragon!”, `name: 'A voice'`. cats.js reports a `headBox` round the tail tip and
  the mist ring, as Sleet's `hidden` reports one where the grass trembles, so the balloon's tail points there. Squall is
  in `scenes.js`'s `OWN_SHADOW`, so the nest owner adds **`NO_SHADOW.squall = { hidden: 1 }`** (as Sleet's `hidden`: a
  shadow there would give him away).
- **Riffle: new `holds: 'mint'`**: a bunch of river mint as big as his head, held in his forepaws (`holdAt: 'paws'`, the
  default) standing or sitting; in his mouth on all fours (`holdAt: 'mouth'`).
- **Cats**: our cat `holds: 'leaf'` (the dew's leaf, the moss's, the root tucked in with it) and `holds: 'glass'` (chapter
  8's), `tap: 'leaf'`, `tap: 'nose'` (chapter 5's, for "With your NOSE."), `tap: 'paw'`, `tap: 'ears'` and `tap: 'tail'`
  on any cat (chapter 6's and 8's), `stretch` (climbing the oak), `tailUp` (cheering). Tallyheart `proud` for “Hmph.”,
  never `laugh`; `lookup` for “Tallyheart looks at the sky.”. Glintstar `walk`/`stand` at `case-3`, by the doorway's
  light. The grey tom as chapter 8 drew him.
- Every cat is drawn side-on, facing left or right (chapter 7's rule).

### Counts art (`app/art/cats.js`)

**What is pinned** (read this first): chapter 1's fingerprint sweeps `countsPicture({ table, groups, highlight })` for
tables 1 to 9 with no `thing`; chapter 6's, tables 1 to 10 with no `thing`; `sweep7` every table with `THING[t]` (table
8's is `'thing'`) and `'piece'`, the who pictures at tables 1 to 6, 9 and 10, kind `'prey'` and `layout: 'rows'`, and the
sand at per 1 to 10 (per 4 and per 6 only where styled); `sweep8` chapter 7's kinds (`cheeks`, `marks` without a layout)
and the sand at per 6. So:

- **The spiders** (new, keyed on **`thing: 'leg'`**, no kind: no sweep reaches it; dispatched before the table-8 and
  table-4 pictures as drawn today): `countsPicture({ table: 8, per: 8, groups, thing: 'leg', highlight, totals, next })`:
  that many spiders, the den's spider as drawn there, from above, **four legs on each side**, in rows of five with space
  between, never touching, none bigger than the den's; `highlight` lights legs in order, a spider's left four then her
  right four, then the next spider; `totals` and `next` as the table-4 picture's (a glowing next spider). One to ten
  spiders (the lesson, its fillers, the five in the sand, the 8s' Hollow rounds). Label "N spiders, eight legs each".
- **One spider's two sides** (new, `thing: 'leg'` at table 4 with a `who` of one `spider`):
  `countsPicture({ table: 4, per: 4, groups: 2, thing: 'leg', who: [{ who: 'spider' }], highlight, totals, next })`: one
  spider big in the middle, from above, her four legs on one side the first group and the four on the other the second;
  `highlight` 4 lights one side, 8 both; `totals` puts 4 and 8 beside the sides; `next` glows on the side to tap. Label
  "One spider: four legs on each side".
- **The doses** (new, **`kind: 'dose'`** with `layout: 'rows'`): `groups` rows of eight, **each row four and four** with a
  gap, the rows stacked top to bottom; the mark by the set's `thing`: `'drop'` a round dewdrop with a highlight, `'rub'` a
  small paw mark (a pad and four toes), `'flap'` a short plain stroke; lit in order, a mark at a time (a row at a time by
  the help's hops). One to ten rows (8 × 8 is eight rows; a filler of 8 × 5 is five). Label "N rows of eight drops (paw
  marks, marks), four and four".
- **The acorns** (new, **`kind: 'acorns'`**): `groups` short twigs side by side (a twig and a leaf or two), **eight acorns
  on each**, in two clusters of four, lit in order an acorn at a time. One to six twigs at least (Mizzle's lends up to
  8 × 5). Label "N twigs, eight acorns each".
- **The sand at per 8: four and four** (new): `PC.art.sand({ groups, per: 8, counted })` scratches each group as two fours
  with a gap (as per 6 is three and three and per 4 two and two), lit in order. **Only where plain** (no `style`, no
  `layout`): the rows layout at per 8 (chapter 2's check, "Two rows of eight", earth) and every styled sand draw as they
  do. Per-8 plain sand is drawn by no shipped frame (no set before chapter 9 is on table 8, and every shipped help's per is
  its set's table or a row; the chapter 8 golden proves it: section 7, item 2), but `sweep7` sweeps it (`[5, 8, 13]`): the
  cats owner skips per 8 in `sweep7`'s sand only where plain (`if ((p === 6 || p === 4 || p === 8) && !style)`), keeps
  the styled per-8 swipes pinned, and re-takes its hash on the shipped snapshot, saying so in the test (as chapter 8 did
  for per 4).
- From before, unchanged: the table-4 cats with paws (the warm-up and its fillers), chapter 8's two cats' paws at
  bedtime, chapter 4's grit forepaws (Squall's riddle).

### Heard, not seen

The snore from the hollow (*Zzz… snrk.*), Mizzle's yawn and her two *Zzz.*, the drips in the reeds (*Drip.*), Coil
counting Sprinkle's footsteps on the last day ("Even Coil, in his stones, counts her footsteps.": he is not drawn on the
bank), the hum as Thymeleaf mixes (a caption), Squall's shout for a cat who has not met him (his tail tip only).

## 5. Build notes

General rules for the story builder, then section by section where a screen needs one. Chapter 8's file
(`app/story/ch08.js`) is the model: its helpers (`c`, `S`, `merge`, `RIM`, `rim()`), frame ids in reading order with
letters for outcomes, a `board` on every frame.

- **Speakers.** `names: { mizzle: 'The sleepy dragonet' }`; from “I’m Mizzle.” on, her balloons carry `name: 'Mizzle'`
  (her riddle comes before it). Thymeleaf is "Thymeleaf" from his first balloon (Tallyheart has just said his name;
  `PC.ui.speakers`). GroveClan's elder speaks with the page's label by variant, "A GroveClan elder" (`groveclan`, 1); the
  apprentice (2) never speaks ("A GroveClan apprentice"). Squall's shout for a cat who has never met him: `name: 'A
  voice'`, in pose `hidden`. Coil's “Some of us asked for QUIET.” in `stone`: `name: 'Coil'` (chapter 7's call 19).
  Sprinkle under her tail (`hide`) says nothing; her “…Do you count FISH?” is in `peek`. Every speaker is in the frame's
  cast (chapter 5's test).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen,
  the narration opens the next panel or the panel is split; an action beat inside a quote (“CrystalClan,” says the elder.
  She looks at Tallyheart. “I remember YOU…”) splits the panel there, the beat opening the second. The screens where it
  matters are named below.
- **No panel holds five boxes** (chapter 7's rule); **long captions** (at most 95 characters on a panel; longer is split
  at a sentence break into boxes, the words unchanged): “On the way home, at the old wall’s end: a long, pale root on the
  dry stones. And one wet pawprint.”, “Every morning: forty. Every day, rubs and flaps. Every evening, a rounder moon.
  Every night, Tallyheart by the tunnel.”, “Nine claw marks on the tree. Four gifts from four corners of the river. And a
  dragonet whose paws left the ground.”, “Tomorrow: the otters’ Moon Ferry. Every Clan, at the Gathering. And Reynard, with
  his little story.”, “The fox says the dragon FLEW off when the rain stopped. With a hurt wing? She COULDN’T!”, “Down the
  river path, a little bridge crosses a narrow channel. Riffle is waiting on it, with a bunch of mint as big as his
  head.”, “On the last day before the full moon, Sprinkle’s friends all come to watch. Even Coil, in his stones, counts
  her footsteps.”, “That evening, the den is empty. Tallyheart helps you lift the moss. You lay out your bark, row by
  row.”.
- **Paths in the picture.** A scene cannot vary by flag. From “Now we mend a friend” on, Tallyheart is with her on both
  paths, so almost nothing is a twin. The twins: the dew's screen and its Counts frame by `foundSquall` (Squall at his
  pole, or his tail tip `hidden`); the first `back` panel of the remedy by `ch3Told` (the told one with `branch: true`,
  chapter 4's rule for the told path's first panel under the bridge); the roar caption's panel by `foundSquall` (below).
  Path-only screens are frames with a `when`: *Told path only* `{ ch3Told: true }`, *Kept path only* `{ ch3Told: false }`.
- **Sound effects** as the story letters them: *Rustle.*, *Drip.* (three times), *Zzz… snrk.*, *Yaaawn.*, *Zzz.* (twice),
  *Hic!* (the dew's screen), *SKRITCH!*, *BUMP.*, *SPLASH!*, *Burp.*, *Flump.*; the DING! is the tower art's own (`ding:
  true`). One `sfx` a frame: “ReedClan!” calls Tallyheart. *Rustle.* Out steps Sloshbank. *Drip.* is two panels (the call
  and the rustle, nobody in the reeds; then “Out steps Sloshbank.” and the drip). No caption here runs on into its sound,
  so no `sfxRead` (the story's DING note; the drip in the reeds ends a sentence).
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; the target is the cast extra or the set's `tap` mark of that
  name, and cats.js draws a cast member's target only when the frame's cast entry carries `tap: '<name>'`, so every row
  below writes it; the story's response is drawn on the next panel, chapter 6's call 13):

  | Screen | `tap` (who or what carries it) | `prompt` | `label` | Next panel shows |
  |---|---|---|---|---|
  | The back row in the brambles' shadow | `back` (`pile`/`rows`, `tap: 'back'`) | `**Tap** to walk round the back.` | `Walk round the back.` | the back row whole (`gap`) |
  | “Tell me EVERY bit!” (told) | `ears` (Riffle at the hedge, `tap: 'ears'`) | `**Tap** to tell him EVERY bit.` | `Tell Riffle every bit.` | his list, on his back |
  | “I always was.” (kept) | `ears` (Tallyheart, `tap: 'ears'`) | `**Tap** to whisper it.` | `Whisper it.` | “The last of it: the dragonets.” |
  | “Come and meet Thymeleaf…” | `tail` (Tallyheart, `walk`ing off, `tailUp: true`, `tap: 'tail'`) | `**Tap** to follow Tallyheart.` | `Follow Tallyheart.` | Thymeleaf's den |
  | the little bridge | `paw` (our cat, `walk`, at `span-1`, `tap: 'paw'`) | `**Tap** to cross.` | `Cross the bridge.` | over the bridge, the old trees |
  | the silver moss | `leaf` (our cat, `crouch`, `holds: 'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`, at `moss`) | `**Tap** to roll it in a leaf.` | `Roll the moss in a leaf.` | “Thank you,” to the elder |
  | Mizzle's last screen | `leaf` (our cat at `lip`, `holds: 'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`: above the rim) | `**Tap** to tuck a leaf over her.` | `Tuck a leaf over her.` | “You gather the soft silver moss.” |
  | the root at the wall's end | `root` (`title`, `root: true`, `tap: 'root'`) | `**Tap** to take the root.` | `Take the root.` | next morning, the tower |
  | “With your NOSE.” | `nose` (our cat at the tower's `foot`, `tap: 'nose'`) | `**Tap** to ride up.` | `Ride up.` | the ride: “The little room hums.” |
  | “Hello, wing. Let’s mend you.” | `wing` (Sprinkle, `wings`, `tap: 'wing'`) | `**Tap** to rub the remedy in.` | `Rub the remedy in.` | “Eight rubs,” says Thymeleaf… |
  | the SPLASH | `paw` (our cat, `pawup`, `tap: 'paw'`) | `**Tap** to clap.` | `Clap.` | Coil's “QUIET” |
  | “HARDER…” | `tail` (our cat, `sit`, `tailUp: true`, `tap: 'tail'`) | `**Tap** to cheer!` | `Cheer!` | “…and she LIFTS.” |
  | “And then: Sprinkle.” | `leaf` (our cat at `case-1`, `crouch`, `holds: 'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`) | `**Tap** to show Glintstar your glass.` | `Show Glintstar your glass.` | the leaf open (`holds: 'glass'`) |

- **Cards on their frames**: `mizzle-wing` on her thought's panel (“The fox says the dragon FLEW off…”), shared; Squall's
  `squall-shapes` on chapter 4's own frame in the roof copy. No card's line is said on its frame, so each is lettered.
- **`sets`**: `{ foundMizzle: true }` on Mizzle's last screen; `{ foundSquall: true, ch9Roof: true }` on the roof copy's
  last frame.
- **The start frame always shows**: the story opens on a screen both paths read (“At sunrise, the whole Clan is waiting by
  the pile.”), so it is the start, with no `when` (`E.checkStory`); no title panel is needed (chapter 8's had one only
  because it opened on a told screen and a kept one).

### All forty

- The count: `pile`/`rows`, `morning`, `{ rows: [10, 10, 10, 10], back: 'shadow', scale: 'behind', tap: 'back' }`, the Clan
  round, Glintstar, Tallyheart and our cat at the front; the caption and Glintstar's balloon (“{name}paw. The count,
  please.”); the walk-round Tap. **No Counts frame** (the count is said, not asked: the brief's call 2).
- “The middle of the back row: no gaps.” and her “Forty. All forty. Not one piece gone.” on `gap` (`{ rows: [10, 10, 10,
  10], scale: 'behind', dug: 'big' }`); the noticing caption (“No new dug earth. No new tiny prints.”) opens the next panel,
  a noticing-only frame on `gap` (our cat `sniff`, looking at the earth).
- “The guards cheer.” with the old tom's “It was my PINECONE.” (`wide` or `low`; `grizzled` `holds: 'pinecone'`, `holdAt:
  'paws'`, `proud`); then “Behind the pile, Tallyheart yawns.” with her whisper (one balloon) on `rear`, `morning`,
  `tunnel: true` (Tallyheart `sit`, `sleepy`, at `rear-2`; our cat at `rear-1`): the tunnel open behind them.

### Every bit (told) and Too big to carry (kept)

- Told, on `rear` (`morning`, `tunnel: true`): Riffle at the hedge (chapter 8's spot `{ x: 1430, y: 962, h: 380 }`,
  `stand`, `tap: 'ears'`), the caption and his balloon, the Tap; then the list (“The tunnel. The weasels…”, the `foundHail`
  line, “Riffle flops onto his back.”, Riffle `fall`) with his balloon in two forms by `foundHail`; then “I’m telling
  Sprinkle!” (Riffle `scramble`, off) and “And he’s gone.” on a told panel of its own (the hedge, its leaves still
  swinging).
- Kept, on `rear` (`morning`, `tunnel: true`), our cat and Tallyheart: “Sprinkle still can’t fly…” / “Your secret is
  getting bigger.” (our cat `shy`); her “Tallyheart? My secret is too big…” with “I’m right here.”; then “Her tail curls
  round you.” (a caption: no art draws a tail round another cat) with “I always was.” and the whisper Tap (Tallyheart
  `tap: 'ears'`); “The last of it: the dragonets…” with the any-found line; “I knew there was something under that moss…”
  / “You’re not angry?” / “Angry? You fed a hungry friend…” (Tallyheart `kind`, never cross).
- Both: “We know who took the prey,” … “Come and meet Thymeleaf, our medicine cat.” on `rear`, the follow Tap (Tallyheart
  `walk` away, `tailUp`, `tap: 'tail'`).

### Thymeleaf

- On the camp's `herbs` (`morning`), Thymeleaf at `herbs-1`, our cat at `herbs-2`, Tallyheart at `herbs-3`, the spider at
  `web` (`spin`, tiny) on every panel here: the two captions and his “There, there. You’ll be dry by sunset.” (Thymeleaf
  `sit`, `kind`, facing his leaves); his “Tallyheart! And the apprentice who counts things…” alone; then “Tallyheart tells
  him everything.” / “Thymeleaf’s ears go up.” (Thymeleaf `wonder`).
- “A wing is a wing,” … “one from every corner of the river.” is the four-things ask's own balloon (section 2; Thymeleaf
  `pawup`, `glow: true`).
- “The towers?” … / “And the Holt is Riffle’s,” …; then “Good,” says Thymeleaf. … / “But the full moon is in five days!” /
  “Then we’d better hurry.” (three balloons).
- The spider's legs: the skip frame carries the two captions (“In a corner of the den, a tiny spider stops spinning and
  waves a leg at you.” / “You wave back.”); its picture is the spider close (section 2). Then “Eight legs,” … / “Two fours!…”
  / “Exactly. Doubling, AGAIN. That’s today’s Count.” on `herbs` under the big 8 (the spider `wave` at `web`).

### Spiders' legs

- The warm-up: `hollow`/`wide`, `morning`, `rim()`, Tallyheart at `tree-far` (`size: 1.2`), our cat at `sunpatch-2`, `{ marks:
  8, glow: 'auto' }`; Counts frame `{ set: 'ch09-fours', intro: false }` with the caption and Tallyheart's balloon.
- The five spiders: the skip frame on `sand` (Tallyheart `crouch`, `claws: true`) with the caption and “Hop by eights.”; its
  picture is five spiders (the counting picture: the "scratched" spiders are the lesson's own, section 7, item 10).
- The tree: the ask on `wide` (section 2), its two balloons. The rim's five sit up on every `wide` panel of the Hollow here
  (`rim()`): unlike chapter 8's, they never hop down.
- The lesson: Counts frame `{ set: 'ch09-eights', intro: false }` on `lesson` (`{ marks: 8, glow: 'auto' }`), its balloon
  “Only two are new,” … “For those, count one side, and double it!”. Then SKRITCH! on `tree` with `{ marks: 9, glow: 'auto' }`
  (captions “Tallyheart stretches up the leaning tree.” and “A ninth claw mark.”, the sound), then `wide` with `{ marks: 9,
  glow: 'auto' }`: “Spiders’ legs. That’s your ninth Count.” and the two `lessonClean: 'ch09-eights'` pairs (balloons with
  `when`, as chapter 8's f020).

### Reed root

- `title`/`end`, `day`, our cat at `end-1`, Tallyheart at `end-2`, facing right: the captions (the kept “Last night she
  said…” with its `when`) and “ReedClan!” with *Rustle.* (`rustle: true`, nobody seen); then “Out steps Sloshbank.” with
  *Drip.* (Sloshbank at `reed-1`, `stand`, `stern`).
- On `meet`: “We need reed root,” … “For a remedy.” / “For a CrystalClan remedy?” and **Choose** (`sets: {}`, both to the
  next frame; no outcome panel); “He looks at you for a long time.” *Drip.* with his balloon; the friends' “Thank you,
  Sloshbank!” on a friends-only panel, then “His ear twitches. Almost a smile.” on another (Sloshbank still there), **both
  with `when: { specialty: 'friends' }`** (the story has both sentences under the one `[if specialty: friends]`); “The
  reeds close behind him.” on `end` with `rustle: true`, nobody in the reeds. No CrystalClan paw in the mud (the standing
  rule: `end-*` are on the dry ground).

### GroveClan

- `grove`/`bridge`, `day`: our cat and Tallyheart at `near-1`, `near-2`, Riffle at `span-2` (`stand`, `holds: 'mint'`): the
  captions (split) and Riffle's “Granny says it’s the BEST mint. She says that about everything.”; the water caption opens
  the next panel, the cross Tap (our cat `walk` at `span-1`, `tap: 'paw'`).
- `wide`: “Over the bridge, the trees are very, very old.” with Tallyheart's whisper (`whisper`), the three at `edge-1`…`edge-3`;
  the small caption opens the next panel: “Out pads a GroveClan elder with a white muzzle.” with her “CrystalClan.”
  (elder at `elder`, the apprentice at `fern`, `shy`); then, on `meet`, “She looks at Tallyheart.” with “I remember YOU…” and
  “Hmph.” (Tallyheart `proud`); then her “Please,” … “For a friend who’s hurt.” and the elder's “You asked. Take what you
  need from the old oak.”.
- `oak`: the three captions and *Zzz… snrk.*, the visitors at `root-1`…`root-3`, the elder at `elder`; **Choose**: “Climb up
  to the hollow.” (`labelWhen: [{ when: { foundMizzle: true }, label: 'Go and see Mizzle again.' }]`, to the hollow's first
  frame) / “Ask the elder which moss.” (to the elder's screen); `sets: {}` on both.
- The elder's “The softest moss is the silver kind,” … (her `pawup`, pointing at the north side) only after the second option;
  then, for every cat, “You gather the soft silver moss.” and the roll Tap at `moss`; “Thank you.” (our cat to the elder) alone;
  then “And, very politely, the oak.” (our cat dipping her head to the trunk, `crouch`, `kind`) with the elder's “A polite one.
  I’ll remember you.”.
- **The mint's way to Thymeleaf** (art and boards only, no new words): Riffle carries his mint (`holds: 'mint'`) on every grove
  frame up to the roll Tap, the hollow's “Riffle folds his paws” among them; from “Thank you.” on, his paws are empty and our cat
  `holds: 'leaf'` (`holdAt: 'paws'`): the mint has gone into her leaf with the moss, and those frames' boards say so (“her leaf
  holds the moss and Riffle's mint”). The root then goes in with them (the story's “she tucks it into her leaf with the moss”),
  so the leaf she carries home holds three of the four things, and the dew the fourth next morning.
- The root on the way home: `title`/`end` at `sunset`, `{ root: true, tap: 'root' }`, our cat (`holds: 'leaf'`) and Tallyheart
  on the dry ground: the captions (split) and *Drip.*, the take-root Tap. Riffle has gone home (he is not on screen; his mint
  is in her leaf).

### The hollow in the oak (the optional scene)

- On `oak`: “Up you climb.” / “Below, Riffle folds his paws.” with his “Otters don’t climb. Otters SUPERVISE.” (our cat at
  `trunk` in `stretch`; Riffle at `root-2`, `sit`, `proud`, his mint still in his paws; Tallyheart and the elder below, beside him).
- On `hollow` (our cat at `lip`, Mizzle at `nook`), every panel after: “In the hollow, curled on moss, is a little dragonet.
  She’s pearly green, and fast asleep.” (Mizzle `curl`, `asleep: true`, fx `zzz`); “One eye opens.” *Yaaawn.* with her “Oh.
  Hello. Are you a dream?…”, “I’m a cat.”, “Even nicer.” (Mizzle `yawn`); the riddle's Counts frame `{ set: 'ch09-mizzle' }`
  (Mizzle `sit`, `asleep: 'half'`; its balloon; *Zzz.*); “I’m Mizzle. Mama says stay where you land. So I’m napping.” with
  “Are you Sprinkle’s sister?”; “Both eyes open.” with “SPRINKLE? Is she safe?” and “She’s safe, under the Old Bridge. But
  her wing is hurt.” (Mizzle `wake`); her “I know. In the storm…” alone; her thought (two boxes) with the card; “We’re making
  her a remedy. With oak moss.” alone; “Mizzle sits up, wide awake for once.” with “Then you need the RIGHT moss…” (`wake`,
  then `pawup`); her last screen (the any-found pair with its `when`, “Tell Sprinkle: five. And tell her I’m…” and *Zzz.*,
  Mizzle `curl`), with the leaf Tap and `sets: { foundMizzle: true }`. Tallyheart waits below with the elder: no cat of
  GroveClan sees into the hollow (the story's call 5).

### First light, the roof scene, the dew

- `tower`/`up`, `morning`, `{ chime: true, light: true }`: “Next morning, before the sun…” and “Up on her balcony, Waffles is
  already awake.” with her “{petname}! DARLING! At DAWN?” (our cat at `foot`, `holds: 'leaf'`; Waffles at `railing`, `peer`,
  `shout`); “I need dew from the roof!” with “I’m being USEFUL… How THRILLING.”; then **the roar's panel, a pair by
  `foundSquall`** (`roar: true`, the caption “From the roof comes a roar, and a tiny hiccup.” on both): `{ foundSquall: false
  }` carries **Choose** (“Go up and find Sprinkle’s littlest brother.” to the roof copy's first frame; “Just the dew today.” to
  the ride; `sets: {}`), with `else` to its twin; `{ foundSquall: true }` carries `next` to the ride. (One frame with `when`
  and `else`, chapter 4's way with a choice only some cats see.)
- **The ride** (every cat who does not go to the roof scene): “The little room that goes DING! It’s TERRIFYING. Press the top
  button, darling. With your NOSE.” (Waffles, one balloon) with the nose Tap; then chapter 4's `f078a` look (`{ chime: true,
  ding: true }`, Waffles `peer`, `happy`, nobody at the foot) with the captions “The little room hums. Your tummy goes UP.” and
  “The roof!”: the art's DING! between them is the caption's sound, so the caption's *DING!* is not lettered again.
- **The roof scene** (the story: chapter 4's frames, run again as chapter 5 ran them): a `roof(first, home)` of this file's own, as
  chapter 5's (`app/story/ch05.js`, "The roof, shared"; this file `require`s `ch04.js` in Node the same way): chapter 4's frames
  from the tower choice's first option along its `a` frames to the forepaw Tap (`f076a` to `f089a`), copied under this chapter's
  ids, word for word; `next`, `counts.next` and `skip.next` mapped, the last to the dew's first frame (`home`); **the hour is first
  light**: every copied frame's `fx` becomes `['morning'].concat(fx without ROOF_HOURS)` (chapter 5's own code, `['day'].concat(…)`,
  with `morning`; `ROOF_HOURS` is `day`, `morning`, `sunset`, `dusk`, `night`), on the tower's frames and the roof's alike (chapter
  5 changed the roof's only, its tower already in daylight). Chapter 4's roof frames carry no hour at all (`fx: []`, the roof's
  default afternoon gold), so a plain "replace" would leave them in the afternoon: the hour is prepended, never only swapped, and
  the story-ch09 test pins `fx[0] === 'morning'` on every copied frame. The two boards that name the afternoon say the morning (`'in
  the gold of the afternoon'` → `'in the first light of morning'`, `'catch the afternoon sun'` → `'catch the first sun'`); the last
  frame `sets: { foundSquall: true, ch9Roof: true }`. The riddle is chapter 4's set (`ch04-riddle`), the card chapter 4's
  (`squall-shapes`). A climber goes up the outside (`f076a`), anyone else in the little room (`f077a`, `f078a`), as in chapter 4;
  nobody is drawn coming down (the story's "comes down in the little room with her leaf" is never on screen: the dew is on the roof,
  and the remedy opens in Thymeleaf's den).
- **The dew's screen, a pair by `foundSquall`** on `roof`/`two` (`morning`, `dew: true`; our cat at `puddle`, `crouch`,
  `holds: 'leaf'`, `holdAt: 'paws'`; on `two`, not `wide`, so his face, or his tail tip and mist ring, and the silver puddle
  read: section 4): with Squall at `pole` (`roar`, `shout`): “By the red light, the rain puddle is silver with dew.” and his
  balloon by `ch9Roof` (“I’m still GUARDING! Tell Sprinkle: FIVE! LOUDLY!” with `ch9Roof: false`; “I’ll guard the dew!” with
  `ch9Roof: true`), *Hic!*; without him (`plane: true`, Squall `hidden` at `pole`): the caption, “From behind the red light:”
  and his “AND STAY OUT, giant dragon!” (`name: 'A voice'`), *Hic!*. **The trailing captions open the next panel**, three
  frames with `when`s on the same pictures, of which each cat reads at most one: `{ foundSquall: true, ch9Roof: true }` “Two
  skinny shapes, he said. Now you know EXACTLY who they are. And they haven’t come back.” (with the shiny line); `{
  foundSquall: true, ch9Roof: false, worry: 'shiny' }` the shiny line alone; `{ foundSquall: false }` “Somebody small is busy
  guarding.” (with the shiny line).
- The dew's Counts frame `{ set: 'ch09-dew' }`, a pair by `foundSquall` on the same pictures (`roof`/`two`; one set read from
  two frames, as chapter 5's Puddle sets were), its caption “Eight drops a day, for four days, to the full moon.”. Every dew
  frame (the pair, the three trailing captions, the two Counts frames) is on `two`; the chapter draws no `wide` of its own on
  the roof (the roof copy's `f079a` is chapter 4's).

### The remedy

- `camp`/`herbs`, `morning`: “In Thymeleaf’s den, four things lie in a row: root, moss, mint and dew.” (`remedy: 'four'`), then
  “He mixes, and mashes, and hums. The remedy comes out pale green.” (`remedy: 'mixed'`, Thymeleaf `crouch` over the stone).
- `bridge`/`back`, `day`, `{ prints: true, stones: true }` (and `branch: true` on the told twin of the first panel): our cat at
  `back-left`, Sprinkle at `dragon`, Thymeleaf at `beside` (against her flank, `holds: 'leaf'`: the remedy), Tallyheart at the
  told spot across the nook (`{ x: 1250, y: 900 }`) on both paths. “That afternoon, Thymeleaf and Tallyheart pad under the Old
  Bridge with you.” with Sprinkle's “Riffle told me EVERYTHING! Weasels! GLASS!” (Sprinkle `pawsup`, `happy`: bouncing); the
  `foundSquall` caption (“You tell her Squall’s five. LOUDLY, the Squall way.”) on a panel of its own; kept: “Then Sprinkle sees
  two big cats, and hides under her tail.” with Tallyheart's “Hello, Sprinkle. I’m Tallyheart. I count things.” (Sprinkle
  `hide`), then “One eye peeks out.” with “…Do you count FISH?” (`peek`) and “Especially fish.”; told: “This is Thymeleaf. He
  mends things.” (Tallyheart) alone; then, both, the told “Sprinkle ducks under her tail, then peeks out.” (with its `when`)
  opening the panel of “Thymeleaf sniffs Sprinkle’s wing. Then he talks to it.” and “Hello, wing. Let’s mend you.” (Thymeleaf
  `crouch`, `kind`; Sprinkle `wings`, `tap: 'wing'`) with the rub Tap.
- The rubs' Counts frame `{ set: 'ch09-rubs' }` with Thymeleaf's balloon; “Riffle pops up with fish.” with “Otter medicine!”
  (Riffle at `back-right`, `hop`, `holds: 'fish'`), the `foundHail` balloon (Riffle's) and the `foundMizzle` one (our cat's,
  “And Mizzle says five. Then she fell asleep.”); “Sprinkle’s eyes shine.” on a panel of its own (`when: { not: { foundSquall:
  false, foundHail: false, foundMizzle: false } }`, Sprinkle `happy`, `sparkle`); the flaps' Counts frame `{ set: 'ch09-flaps' }`
  with his balloon; “SIXTY-FOUR? My wing will be SO tired!” with “Tired is good. Wings like work.”. Riffle is never in `juggle`
  here, and Coil (if drawn at `gap`) never shuts his eyes (the standing rules).

### Featherlight

- `bridge`/`bank`, `day`, `{ shallows: true, drag: false }` (the reeds stand again by now; chapters 2 to 8's bank keeps its drag
  marks): “Day by day, on the sunny bank, Sprinkle practices.” / “A hop. A flap. A wobble.” *BUMP.* with her “I’m FINE!” (Sprinkle
  `flap` at `run`, `happy`; our cat and Riffle at `watch-1`, `watch-2`); then the specialty chain, a frame each with its `when`
  (noticing: our cat at `watch-1` watching her wing, Sprinkle `flap`; climbing: our cat `crouch` at `run-2`, about to leap, beside
  her; sneaking: our cat `walk` at `run-2`, quiet, Sprinkle landing `flat` at `run`; friends: our cat `sit` at `watch-1`, `tailUp`,
  `shout`, “GO, Sprinkle!”); a swimmer passes them all.
- “A run along the bank, a glide…” (Sprinkle `glide` at `skim`, low over the sand's edge, the bank's faint shadow under her: never
  at `air`, which is the last day's lift); then *SPLASH!* with “Into the sunny shallows. Up she pops, laughing.” and Riffle's “Ten
  out of ten. For the SPLASH.”, the swimmer's “Paddle with your back legs!” and the clap Tap (Sprinkle `splash` at `paddle`,
  `happy`; our cat `pawup`, `tap: 'paw'`); “She does. It helps.” on a swimmer-only panel after the Tap (the clap answers her call;
  no word moves).
- Coil's “Some of us asked for QUIET.” on `wall` (Coil `stone` at `gap`, `name: 'Coil'`, nobody else: the voice in the stones);
  then, on `bank`, Sprinkle's “Sorry, Coil!” (`shy`); then *Burp.* with “Out comes a little cloud of mist.” (Sprinkle `burp`,
  `mist: true`).
- The montage, one panel: `pile`/`wide`, `dusk`, `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 12 }`, the
  first guards at the front, Tallyheart at `behind` (going round to the tunnel), the caption in two boxes.
- The last day, `bank` (`shallows: true`): the captions (split) with our cat, Riffle, Tallyheart and Thymeleaf at
  `watch-1`…`watch-4` (Coil not drawn), Sprinkle `flap` at `run`; “Sprinkle runs along the bank. She flaps. Harder. HARDER…” with
  the cheer Tap; “…and she LIFTS. One wingbeat. Two. Three. FOUR! Her paws are off the ground!” (Sprinkle `fly` at `air`, her soft
  shadow on the sand below, drawn by the bank: section 4; `air` is used on this panel only); *Flump.* “Down she comes, onto the soft
  sand, laughing.” (Sprinkle `lie` at `run`, `happy`); “I was UP!…” with Thymeleaf's “Not mended yet. But nearly. The full moon will
  tell.” She is not mended: nothing shows her flying higher.

### The case and Glintstar

- `den`/`case`, `night`, `{ weather: 'clear', stone: 'auto', bark: 'auto', glass: true, read: 0 }`, our cat at `case-1`, Tallyheart
  at `case-2` (Glintstar not yet): the three captions and the six-row ask (section 2). Then, `read: 7`: “And my count,” … “A dragon
  would take sixty.” with the `foundMizzle` balloon (“And Mizzle says Sprinkle’s wing was hurt before the rain stopped.”); then
  “Tallyheart looks at the rows for a long time.” with “That’s not a story. That’s a case.” (Tallyheart `solemn`).
- **Every `case` frame after the ask is `read: 7`** (`{ weather: 'clear', stone: 'auto', bark: 'auto', glass: true, read: 7 }`,
  the `glass` off only while the leaf is in her paws): her count and Mizzle's card, laid out on “And my count,”, stay on the
  floor while Tallyheart tells Glintstar “everything, row by row”, and `read: 7` has nothing glowing, so no frame needs
  `read: 6`. The story-ch09 test pins it: no `case` frame after the ask has `read` < 7, and every `case` frame carries
  `stone: 'auto'`.
- Glintstar, all on `case`: Tallyheart's opening by `ch3Told` (two balloons with `when`); then “She pads out. Soon Glintstar
  steps into the den, silver in the moonlight.” on `case` too (Glintstar `walk` at `case-3`, stepping in from the doorway's
  light, which stays out of frame; Tallyheart back at `case-2`): `doorway` cannot draw the laid-out rows (its `bark: 'auto'`
  stands the bark along the nest's edge with the moss in place), so it is kept for bedtime. Then (Glintstar `stand` at
  `case-3`): “Tallyheart tells her everything, row by row. And then: Sprinkle.” with the show-glass Tap (our cat `crouch`,
  `holds: 'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`; the scene's `glass` off while the leaf is in her paws); the leaf open
  (`holds: 'glass'`) with “I said no cat goes looking for the dragon.” and “{They} didn’t go looking. {They} went to FEED
  her.”; “Glintstar looks at Tallyheart. Tallyheart looks at the sky.” alone (Tallyheart `lookup`); her two balloons (“A
  dragonet who couldn’t fly didn’t fly off with our prey.” / “And a fox who lies at my border will be answered. At the
  Gathering. By the one who found it out.”); “She looks at you.” with **Choose** (`sets: {}`, both to the next frame, no
  outcome panel); her “You gathered from every corner of the river, {name}paw. You spoke to every Clan. At the Gathering, you
  will speak.” alone; “Your whiskers tingle, right to the tips.” and the talk line; “Not a word to the Clan yet. Tomorrow,
  every Clan hears it together.” alone; “She dips her head to you, and she is gone.” (Glintstar `walk` at `case-3`, facing
  right, turning to go into the doorway's light). Glintstar is never `stern` at anyone here, and never `laugh`.

### Nine claw marks

- **Every bedtime den frame's opts in full**, as chapter 8's: on `nest`, `{ weather: 'clear', moon: false, stone: 'auto', bark:
  'auto', hidden: true, glass: true }`; on `doorway` and `inside`, the same with `moon: 13` (chapter 8's `DEN_GLASS` and
  `DEN_MOON` with 13).
- `den`/`nest`, `night`: “Your glass and your secret bark go back under the moss.” and the `ch2Stone` lines (our cat `lie`);
  then the summary (two boxes) on `doorway`.
- The grey tom on `inside` (`sleeper-1`, `lie`, `sleepy`) with his “{name}paw? Do the paw thing.” (`whisper`) and her “Tonight
  it’s LEGS. Spider legs.”: the bedtime skip; then “Eight. Two cats make one whole spider!” with “So we’re ONE SPIDER?” under the
  big 8; “Soon he’s snoring.” opens the next panel (`inside`, `moon: 13`, `zzz` on him) with “Outside, the moon is nearly round.
  Tomorrow, it’s full.”; then the hook (two boxes) and “And you, with your case.” on `doorway` (`moon: 13`); the last panel on
  `nest` (our cat `curl`, `asleep: 'half'`, `kind`): “Will Sprinkle’s wing hold?” / “You curl up tight, warm and safe, and sleep.”
- Chapter end: the dream input (“What did {name}paw dream, the night before the Gathering?”), then the end frame, as chapter 8's.

### The edit to chapter 4's page (`app/story/ch04.js`, `book.recap`)

As chapter 5 did for `ch5Roof`: the three "found Squall" lines' `when`s gain `ch9Roof: false` (`{ foundSquall: true, ch5Roof:
false, ch9Roof: false, not: { ch4CaughtFly: true } }` twice, `{ foundSquall: true, ch5Roof: false, ch9Roof: false, ch4CaughtFly:
true }`), and a new line after the `ch5Roof` one: `{ when: { ch9Roof: true }, text: 'On the roof of {their} old tower, Sprinkle’s
littlest brother is still roaring, and hiccuping.' }` (its `when` is `{ ch9Roof: true, ch5Roof: false }` since the review of
2026-10-26: a cat can hold both roof flags, section 1, and then reads the line once, as a chapter 5 roof cat). No live save holds `ch9Roof`, so chapter 4's page reads exactly as it does
for every one of them (the golden proves it). **Chapter 5's page needs nothing**: its one Squall line reads `ch5Roof`, never
`foundSquall` (checked). Chapter 4's and 5's frames that read `foundSquall` show their found variants on a reread to a cat who met
him here, as they do for a `ch5Roof` cat (a reread oddity, kept: section 7, item 13). Squall's page in the book (`foundSquall`,
"whichever chapter she finds him in") is true as it stands.

### The book

The story builder writes it; proposed (seven to ten entries: seven on a told reading, eight kept, one more each with Mizzle and
with the roof; the story-ch09 test pins 7 told and 8 kept on a plain reading, as chapter 8's pins 7 and 8; the cat named wherever
a tom's "he" could mean another animal):

1. `At the eighth morning count, all forty pieces were in the pile. Tallyheart had sat by the weasels’ tunnel all night, and not one came.`
   (Day 9 is her eighth morning count, as chapters 7's and 8's books count them, “At the sixth morning count”, “At the seventh
   morning count”; continuity corrected chapter 8's spec on the same slip. The test: the book never says “ninth morning”.)
2. *(kept)* `{name}paw told Tallyheart about Sprinkle at last. Tallyheart wasn’t angry: she said thank you.`
3. `Tallyheart took {name}paw to meet Thymeleaf, the medicine cat, who said at once that a wing is a wing, and asked for four things, one from every corner of the river.`
4. `Tallyheart taught {name}paw {their} ninth Count, spiders’ legs: the eights. An eight is two fours.`
5. `Four gifts came from four corners of the river: reed root from ReedClan, oak moss from GroveClan, river mint from the otters’ Holt, and dew from the roof of {their} old tower.`
6. *(foundMizzle)* `High in GroveClan’s old oak, {name}paw found Mizzle, the sleepiest dragonet, who knew the right moss for a wing, and saw Sprinkle hurt before the rain stopped.`
7. *(ch9Roof)* `On the roof of {their} old tower, {name}paw found Squall, the littlest dragonet, who told {them} about two skinny shapes that go to the tracks every night.`
8. `Thymeleaf made the remedy, and Sprinkle practised every day. On the last day before the full moon, her paws left the ground: four wingbeats.`
9. `That evening, {name}paw laid out {their} case, row by row, and Tallyheart told Glintstar everything, Sprinkle too. At the Gathering, {name}paw will speak.`
10. `At bedtime, the grey tom and {name}paw counted their paws: eight. One whole spider.`

`dream: '{name}paw’s dream: “{dream}”'`; `noDream` e.g. `'{name}paw’s dream, the night before the Gathering, stayed a secret.'`.
**Mizzle's page**: `book.dragonet: { id: 'mizzle', name: 'Mizzle', when: { foundMizzle: true }, pose: 'yawn', lines: ['Pearly green,
sweet and sleepy, and always about to nod off.', '{name}paw found her in a hollow high in the old oak in GroveClan’s woods.', 'She
knows the right moss for a dragon’s wing. Five more claws, counted.'] }` (as Puddle's and Wisp's pages, three lines).

### The teaser

Chapter 10, *The Gathering* (not built): `{ title: 'Chapter 10: The Gathering', lines: ['Tomorrow: the otters’ Moon Ferry. Every
Clan, at the Gathering.', 'And Reynard, with his little story. And you, with your case.'] }` (the story's hook, its words; curious
and brave, never scary). Chapter 8's teaser stands (its two lines are this chapter's promise, kept: she flies a little, and the wing
is mended by a remedy).

### Tests the story builder adds (`tests/story-ch09.test.js`, beside chapter 8's)

- Every Counts set exactly as section 2, and the runs it cites: the warm-up's hard pick (4 × 7 when nothing; each chapter-8 miss or
  slow fact named there opens on itself with “Yesterday…”; never 1 × 4, 2 × 4, 4 × 9 or 4 × 6), its fillers (3 × 4 after a missed
  first; 3 × 4 then 4 × 5 after a missed 2 × 4; never 4 × 4 before the third miss, and the own-pair slip only with a hard 3 × 4 or
  4 × 5); the lesson's order, twins and fillers; 8 × 3 and 8 × 10 get the fast lines when quick; a missed 7 × 8 is still hard (8s
  and 7s) after a quick 8 × 7; the help's per-8 sand and hops; Mizzle's and the doses' fillers by the rule of section 2 ("How the
  one-fact sets lend"): its guarantees (no filler of a one-fact set is ever its own pair, an avoided pair or a new fact: section 6's
  exhaustive run, or a sample of it) and named runs, each with its earlier sets' states written out (the table's rows, the second
  misses, and the every-dose-missed runs with Mizzle not met, right and missed once), never a general "after a missed X"; the
  warm-up's 2 × 4 timed on itself (no `prompt`); 15 typed answers on every reading, 16 with Mizzle or the roof, 17 with both;
  `E.countSets` gives table 8 to `ch09-eights`; the Hollow offers "Spiders’ legs · the 8s" and the tree has nine marks only after
  the lesson.
- `foundMizzle` set on her last screen and nowhere else; `ch9Roof` and `foundSquall` on the roof copy's last frame and nowhere
  else; saying no sets nothing; Mizzle's card and page only with her flag; chapter 4's page for a `ch9Roof` cat, and unchanged for
  every other (the truth table of `foundSquall`, `ch5Roof`, `ch9Roof`, `ch4CaughtFly`).
- The roof copy: chapter 4's frames word for word, ids mapped, `fx[0] === 'morning'` on every copied frame and no other hour in
  its `fx`, the two boards' words; offered only without `foundSquall`; a climber up the outside; the dew after it, every dew frame
  on `roof`/`two`.
- The case's ask: six pairs, `opt: 'read'`, every cat holds the six rows' fourteen cards (a Sleet cat's den at FLEW's end); no
  `case` frame after the ask has `read` < 7; every `case` frame carries `stone: 'auto'`; Glintstar's entry on `case`, never
  `doorway`; every bedtime den frame's opts as section 5 writes them in full.
- The reed root's two friends panels both `when: { specialty: 'friends' }`; the bank: Sprinkle `glide` only at `skim`, `fly`
  only at `air`, `splash` only at `paddle`; Riffle `holds: 'mint'` on the grove's frames up to the roll Tap and not after it.
- The book: 7 entries told and plain, 8 kept, one more each with Mizzle and the roof; never “ninth morning”.
- Every `ch3Told` frame, the path-only screens, the specialty chains, every worry line, the `foundSquall` pairs, each one-tap
  target present in the art; Riffle never in `juggle` under the bridge; Coil never shuts his eyes; no grown cat in `laugh`; no
  "whisker-length", "Ironsnake", "Twoleg"; GroveClan's cats unnamed; every caption at most 95 characters on a panel; no panel with
  five boxes; the book on every path (no token unfilled, a tom's pronouns), Mizzle's page, the teaser; every reading under 130
  frames.

## 6. Engine needs

**None.** Every key above is one chapters 1 to 8 built: choices (with `when` and `else`, options with `labelWhen`), typed answers,
`skip` (one to five groups, `who`, `thing`, `carry`), `ask` (with `opt`, chapter 5's), one-tap `scratch` frames on a cast extra or a
set's mark, frame `when` (with `E.matches`' lists and `not`), sticky `sets`, a card with a definition's `when`, `lessonClean`,
`book.dragonet` with `when` and `pose`, the dream input, and the Counts keys (`table`, `picture.kind` and `layout`, `help: 'picture'`,
`teacher: 'caption'`, `fillVoice` and `fillPicture`, `avoid`, `warmHard.avoid`, `check`, `retryPrompt`, `rightAgain`, `againIntro`, a
fact's `miss`/`missLast`, `label`, `hollowThings`). The brief allows one new interaction; none is used.

**The engine need chapter 8 left** (continuity, "What chapter 9 inherits"; chapter 8's spec, section 7, items 13 and 14), **decided
under decision 46: no engine change; chapter 9 meets both by its data, and the engine stays as shipped.**

- *(a) `fillers()`' last pass should never take a one-fact set's own pair.* Changing the last pass would change chapter 8's readings
  (Hail's riddle lends its own 4 × 4 after three misses: pinned by `tests/story-ch08.test.js`) and any chapter 1 to 7 reading that
  reaches it (chapter 7's pile, whose own 3 × 10 is first among its avoided pairs), and chapters 1 to 8 must stay byte-identical for
  every live save. It is not needed for chapter 9: **the last pass is reached only when a set has two lendable pairs or fewer.** A
  filler is wanted only when fewer than two questions are left after a miss (`E.REQUEUE_GAP`), so at most one pair is ahead and one
  is the miss, and the first two passes take any lendable pair that is neither (asked or not). A set with three lendable pairs (in
  its pool, not its own, not avoided) always finds its fillers there. Chapter 9's four one-fact sets lend from the lesson's five
  easiest (2 × 8, 8 × 3, 4 × 8, 8 × 5, 6 × 8: `E.EASIEST_POOL`, the same five for every cat, since all ten facts are in the lender's
  list) and keep three or four: Mizzle 2, 3, 4 and 5 eights; the dew 2, 3 and 5; the rubs 2, 4 and 5; the flaps 2, 5 and 6. Run
  (`sim2.js`): every way to answer the first twelve questions right or wrong (4,096 plans), for each set alone and after its siblings
  missed or right: no filler is ever the set's own pair, 7 × 8 or 8 × 8; and (the math critic's `probe3.js`) for each set after every
  combination of its earlier siblings not met, right, missed once or missed twice (217,088 plans in all): no avoided pair at all
  (the dew's 6 × 8 among them). The order within those guarantees is section 2's rule and table. (The warm-up has two facts and is
  chapter 8's case 15, not this: section 2.)
- *(b) A set that lends one-group fillers should give `helpIntroFar` no numbers.* No chapter-9 set lends a one-group filler: every
  pool's smallest pair is 2 × 8 (two rows, two twigs, two spiders), and the warm-up's 2 × 4 (two cats). So the numbers in the dew's
  and Mizzle's help (“eight, sixteen…”) are true of every question they open (run: a missed 2 × 8 filler hops 8 · 16).
- *For chapter 10* (section 8): a borrowing one-fact set keeps three lendable pairs, or takes the cost; a set that can lend a
  one-group filler gives `helpIntroFar` no numbers. If chapter 10 needs the engine changed, the change must leave chapters 1 to 9's
  readings as they are (an opt-in key on the set).

Code beside the engine, the words owner's (section 10's owners):

- `E.VERSION = '0.9.0 (chapter 9, <ship date>)'` and its assertion; the save stays version 2 and nothing new is stored.
- `PC.ui.flagWords.foundMizzle`, `.ch9Roof` (section 1); `PC.ui.speakers` NAMES `thymeleaf: 'Thymeleaf'`, `mizzle: 'Mizzle'`,
  `groveclan: 'A GroveClan cat'`, with `VARIANT_NAMES.groveclan = { 1: 'A GroveClan elder', 2: 'A GroveClan apprentice' }` (no variant
  reads as 1, as ReedClan's); Read to me's pitch and pace: Thymeleaf low, warm and slow (`PITCH.thymeleaf` 0.82, `RATE.thymeleaf`
  0.85), Mizzle sweet and sleepy, slow (`PITCH.mizzle` 1.35, `RATE.mizzle` 0.82), the elder old and slow (`VARIANT_PITCH.groveclan =
  { 1: 0.78 }`, `RATE.groveclan` 0.86: `rateOf(who)` takes no variant, so the rate is every GroveClan cat's, harmless since the
  apprentice never speaks); nobody else's voice changes; the engine test pins those keys. No new `faceHidden`
  pose: Squall's `hidden` is a name `NO_FACE_POSES` already has. The tests that pin chapter 8's lists (the speakers' names, the
  corner's last flag) take the new entries.
- `tools/storyboard.mjs`: words for every new name of section 4 (the `grove` set, its cameras in `SET_CAMS.grove`, place words of its
  own for `oak` and `hollow`; the camp's `herbs` and `remedy`; the den's `case`, `read`, `moon: 13` "nearly round, thirteen evenings
  old"; the title's `root` and `tap: 'root'`; the roof's `dew` and `puddle`; the bridge's `shallows` and its new anchors; the cast
  `thymeleaf`, `mizzle` (every pose, `MIZZLE_POSE`), `groveclan` by variant, `spider` (`spin`, `wave`); Sprinkle's `hop`, `flap`,
  `glide`, `fly`, `splash` and `tap: 'wing'` in `SPRINKLE_POSE`; Squall's `hidden` in `SQUALL_POSE`; Riffle's `holds: 'mint'`); the
  Counts pictures (`thing: 'leg'` as spiders and as one spider's two sides; `kind: 'dose'` by its `thing`; `kind: 'acorns'`; the sand
  at per 8 four and four); an `ask` whose asker and answerer are one (Thymeleaf naming his things) and an `ask` with `opt: 'read'` on
  the case (a row lit a tap); a recap line read only with `ch9Roof`; the bank's new anchors `run`, `run-2`, `skim`, `air`, `paddle`,
  `watch-1`…`watch-4`. `--check-words more.json` with section 4's names. Chapters 1 to 8's storyboards regenerate byte for byte, but
  `ch04.md`'s book rows (the recap edit: section 5). The words owner also regenerates the stub's `docs/storyboard/ch09.md` with the
  tool change (`node tools/storyboard.mjs app/story/ch09.js`), so `tests/storyboard.test.js` stays green until the story builder
  regenerates it for the built chapter.
- `docs/build.md`: a short "Chapter 9" section, the new art names and words as built, pointing here.

## 7. Known issues the text critics left

Checked against Draft v0.4. Every other low of both rounds (`critique.json`'s `known.lows`, `critique-verify.json`'s `known.lows`) is
fixed in the story as it stands: the deadline (“…Sprinkle needs her wings by the full moon.”), Squall's own shout for a cat who has not
met him, “two big cats”, “Even Coil, in his stones, counts her footsteps.”, “No new tiny prints.”, the elder's “apprentice… at the
Gathering”, “I SAVED the best bit!”, the eyes' shine with Squall, the “narrow channel”, How to read's short lists and the calls'
reasons, “You never gave up,”, the doses' filler notes (run: true), Thymeleaf before the lesson recorded, the names record, “The middle
of the back row: no gaps.”, “She’s safe, under the Old Bridge,”, “Which one?” cut, the montage's order and its “Every day, rubs and
flaps.”, “It calms the hurt.” and “wing medicine”, “I’m right here,” … “I always was.”, “Riffle!” named and his balloon in two forms,
the case's sentence split and its rows read as sentences, the For us figures and the roof's re-measure, “on the sunny bank”, the told
“This is Thymeleaf,”, Squall's “And they haven’t come back.”, the DING note, the `{They}` tokens, the channel note, the “Hmph.” note,
“That afternoon, Thymeleaf and Tallyheart pad under the Old Bridge with you.”, and the reed root's “Dip your head, very politely.”. What
is still open, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes. Where its italic notes and this spec differ, the spec is the build's
   (item 7 lists them).
2. **Chapters 1 to 8 byte-identical for every live save** (the orchestrator's "golden"). The proof is the golden owner's (section 10):
   `tests/fixtures/make-ch08-golden.js` records `tests/fixtures/ch08-golden.json` from the shipped snapshot
   (`GOLDEN_ROOT=/Users/aron/potomac-crossing-work/ch09/shipped`, commit b6a8d4f, engine 0.8.0, in a process of its own; since
   2026-10-26 with the live depth hotfix's three story files in it, `git show 83313a1:app/story/ch0{6,7,8}.js`, so the snapshot is
   chapters 1 to 8 as they are live), as
   `make-ch07-golden.js` recorded chapter 7's: chapters 1 to 8, every frame and what it shows (the scene with her options filled and a
   hash of its drawing, ids stripped; captions and what Read to me says; balloons with labels and voices; options; the card under the
   panel; her whole Case File with every card drawn, the brag's row of four included; the pages she taps), every skip tap by tap, every
   question, picture, line and help hop by hop, the Training Hollow (the 4s' rounds among them), the book with its dragonets, the
   grown-ups corner and the cat. Its scripts cover every specialty and worry, told and kept, both chapter 2 paths, the roofs and "Not
   today", Puddle, Wisp, Sleet and Hail found and not, both of chapter 8's routes, slow and quick, a tom, and misses of every kind in
   chapter 8's sets (the pile; the warm-up's hard pick from a chapter-7 miss or a slow 5 × 6; the fours' twins and the 8 × 4 check; the
   twenty-eight twice; Hail's riddle three times, its known 4 × 4 slip; Snip's share told and kept, a missed one-night filler). Its
   test, `tests/golden-ch08.test.js`, compares today's tree: (a) chapters 1 to 8 handed to the engine, exactly; (b) every loaded story
   handed to the engine (ui.js's `stories()`), exactly, but for the deltas a later chapter is allowed, by name: chapter 8's teaser in
   her book `built: true, next: 'ch09'` (its words as they were) and the hub's next chapter. `E.chapters` keeps a stub (chapter 8's
   spec checked it), so both deltas show in both states; nothing else may move (no chapter-1-to-8 cat logs a table-8 answer, so
   `E.factTables` gains no heading). The test tells the stub by its boards (every frame's `board` 'STUB.') and says which state it ran
   in. `ch07-golden.json`, `ch06-golden.json`, `ch04-golden.json` and their tests stay as they are and must still pass. **The
   fingerprints**, each art owner's for its own files, recorded once from the snapshot in a separate process and committed as
   constants (no test reads the work directory): the bridge's frames of chapters 2 to 8 and the roof's of chapters 4 and 5 (the
   places owner); the den's row and corners for every file a live save can hold after chapter 8 (1 to 29 cards, 0 to 10 under the
   moss, up to nineteen along the edge, with `hidden` on and off, `glass`, both facings; the 29-card, nineteen-edge files added
   2026-10-26), the camp's and the title's frames, the hollow at eight marks, and the
   cards' 29 pictures (the nest owner); in `tests/cats.test.js`, `sweep7` re-taken without the plain per-8 sand, and a `sweep9` of
   chapter 8's own cast and Counts art (Hail's, Snip's and Snatch's poses and moods, the cats' `run`, `tailUp`, `holds: 'leaf' |
   'glass' | 'mouse'`, `tap: 'tail' | 'leaf'`, the dogs' `lie` and `asleep`, Reynard's `trot`, `kind: 'dogs'`, marks with `layout:
   'pairs'`, one cat's paws by pairs, the sand at per 4) hashed on the snapshot (the cast owner).
3. **The water worry goes to sleep on the Moon Ferry** (the world critic's optional low; skipped: “Tomorrow: the otters’ Moon Ferry.”
   with no friend-near line for a water-worry cat). Built as written; chapter 10's first screen carries the reassurance (section 8).
4. **The Thyme, Leaf and Grove clause** (the world critic's low; skipped, since the editor writes only the story): README "Chapter 9's
   brief" item 7 takes it at ship (the For us says so), and the brief's "neither half on the Warriors Names page" is wrong for "-leaf";
   the brief is not re-versioned. For the orchestrator (section 10).
5. **The bridge's river is "brown and swirly"** (the verify critic: the set's own words), and the practice's shallows must be bright and
   clear. Built: the bridge's `shallows: true` on `bank` (section 4), off for every earlier frame.
6. **The warm-up can lend its own pair after three misses** (section 2): only when its hard pick is 3 × 4 or 4 × 5; the words are true.
   Kept, pinned by the story builder's test (as chapter 8's known issue 15).
7. **The story's notes this spec supersedes** (she reads none of them; no line she reads changes): Thymeleaf's claws (“a claw lights at
   each”: he glows and raises a forepaw; no claw lights; “one balloon to a tap … The fourth tap turns the page”: two balloons of his a
   tap, split at the sentence, and Next after the fourth, since an `ask` letters two non-empty lines a tap and never turns the page on
   its last); the five spiders "scratched" in the sand (the counting picture draws the lesson's spiders); the spider's legs "and the
   page turns" (no `keep`, so the next page shows its own scene under the big 8); Mizzle's "the spec decides whether it touches
   `cant-fly`" (no link: section 3); "How the laid-out file is drawn is the spec's" (the den's `case`: section 4); "the twigs lit one at
   a time" (built so); the roof's "comes down in the little room with her leaf" (not drawn); Coil "a voice in the stones" on the bank
   (a cut to `wall`, his stones); Waffles' "button is words only" (the nose Tap); "Tallyheart is not here, so the help is narration"
   (`teacher: 'caption'`); the dew's filler note "after a missed sleepy question, 8 × 5, then 2 × 8" (true after one miss; after two,
   2 × 8 then 8 × 3: section 2's rule and table).
8. **The roof's way up is chapter 4's at dawn.** A non-climber hears Waffles twice about the little room (this chapter's “…Press the top
   button, darling.” is read only by a cat who does not go to the roof; the roof reader gets chapter 4's own “Take the little room,
   darling!”): never both. The copy's boards say "first light"; no word she reads changes.
9. **Sounds on a Counts line.** A lesson's lines have no sound slot: Mizzle's right line drops the story's *Snrk!*, her help does not
   letter "she wakes with a snort", and the dew's *Plip. Plip. Plip.* is a caption's words (Read to me says “Plip. Plip. Plip.”, a sound
   that can be said). The words are the story's; only the lettering of three sounds is lost.
10. **The five spiders "scratched in the sand" are drawn as the lesson's spiders.** The skip's picture is the counting picture, not the
    sand (a skip has no sand picture); the caption carries the scratching.
11. **What the art cannot draw literally**: section 10's list.
12. **`my-count` may be missing** (chapter 7's known issue 15): nothing in chapter 9 requires it; her count is said in words on every
    path, and the case lays the card out only if she holds it.
13. **Chapters 4, 5, 6 and 8 read `foundSquall` on a reread**, so a cat who met Squall in chapter 9 sees their found variants when
    she reads them again (as a `ch5Roof` cat does today): chapter 4's and 5's roof frames, chapter 6's news to Sleet (`f061a`/`f062a`),
    chapter 8's “Just what Squall saw from his roof!” (`f100`) and its news to Hail (`f086`/`f087`). Only the pages are made to say
    "found" in the right chapter (section 5).
14. **The doses' fillers say "An easy one." three times for a cat who misses all three** (the math critic's low, kept by the editors):
    with Mizzle not met, 2 × 8 three times, no other filler twice (run); with the sleepy question right, 8 × 5 twice as well (the
    story's flaps note, "no other filler twice", is true only without Mizzle: her 6 × 8 leaves the flaps nothing fresh, so the
    engine's second pass takes its pool in order); with it missed once, 2 × 8 three times in the doses and four in the day (her
    own “An easy one…” first), 8 × 5 twice, and the rubs lend the dew's 4 × 8 on their first miss. Kept: each is easy and true, the
    doses are hours apart, and bending the data (say, 4 × 8 in the rubs' `avoid`) would leave the rubs two lendable pairs and reopen
    the last-pass slip section 6 rules out. The test pins the three readings (section 2, "How the one-fact sets lend").
15. **The case ask's VoiceOver label names Tallyheart** (the math critic's low). Its tap spot is the art's glowing row (`spot.art`),
    but `renderAsk` labels the panel from `ask.who`: “Touch Tallyheart to hear the next question.”, the first ask whose spot is not
    the asker. The hidden “Read the next row.” button (the ask's `label`) works, so it is wording only. Kept, and ui.js is not
    changed: the shipped asks' spots are `spot.art` too (a glowing asker's `pc-next` from cats.js: chapter 8's tree, Tallyheart
    `glow: true`), so keying the label on `spot.art` would move chapters 5 to 8's panels. If chapter 10 lays the case out again with
    an ask, an opt-in key on the ask is the way (chapters 1 to 9 unchanged).
16. **The Grown-ups corner's kept words** (`FLAG_WORDS.ch3Told` false: “kept Sprinkle’s secret: only Riffle knows too (later
    chapters remember)”) are no longer true after chapter 9's kept path tells Tallyheart, and Tallyheart tells Thymeleaf and
    Glintstar. Kept: the words describe the chapter 3 choice, and changing them would move every kept golden cat's corner
    (chapters 1 to 8 byte-identical). The words owner leaves the string as it is and adds a note in `tests/engine.test.js` (with a
    test pinning it) so nobody "fixes" it.
17. **The roof copy draws her without the dew leaf** (the review, 2026-10-26, a low). At the tower's foot she holds the leaf
    (`f060` to `f062`), the copy's frames (`f066` to `f079`) are chapter 4's scenes with only their `fx` changed, so she is drawn
    bare-pawed up there, and the leaf is back at the dew (`f080`). Kept: the copy is chapter 4's scene run again, its forepaw and
    riddle frames need her paws, and a leaf on some of its frames would make the copy no longer chapter 4's.

## 8. What chapter 10 inherits

- **When.** The full moon, day 14 (`moon: 14`, full by the art's clock), the morning after evening 13; chapter 10 opens on the day of the
  Gathering (the brief's call 1). The pile has been whole since night 8 ("Forty. All forty."); Tallyheart sits by the tunnel every night;
  the tunnel stays open, the roots lifted, as proof.
- **Who knows what, every path.** Tallyheart, Thymeleaf, Riffle and Glintstar know everything: the tunnel, the weasels, the brag, the stash,
  the glass, and Sprinkle (the kept path told Tallyheart this morning: "Your secret is getting bigger."; Tallyheart told Thymeleaf, then
  Glintstar, row by row, "And then: Sprinkle."). Sprinkle knows the trail (Riffle told her) and has met Thymeleaf and Tallyheart. The Clan
  does not: “Not a word to the Clan yet. Tomorrow, every Clan hears it together.” ReedClan was told “For a remedy.” (and maybe “For a
  friend who’s hurt.”: her choice, which sets no flag, so chapter 10 must not assume it); GroveClan was asked “For a friend who’s hurt.” by
  every cat; no cat of another Clan heard "wing" or "dragon". GroveClan's elder saw Tallyheart count at a Gathering as an apprentice, and
  will remember our cat ("A polite one."). Coil asked for QUIET. Only her cat has met Mizzle (Tallyheart and Riffle stayed below).
- **Which dragonets each knows.** Tallyheart knows every dragonet she found (told: as she found them; kept: since this morning, “the others
  you’ve found, name by name”), and hears “And Mizzle says…” in the case. Thymeleaf heard, under the bridge, the fives of Squall, Hail and
  Mizzle where she found them, and nothing says more. **Glintstar has been told of Sprinkle; nothing says she has heard of the others**:
  chapter 10's "the dragonets she found come to stand beside her" must not assume it.
- **Where they are**, evening 13: Sprinkle under the Old Bridge; Mizzle in her oak in GroveClan's woods ("stay where you land"); Squall on
  the roof of the tallest tower; Riffle home at the Holt; the remedy in Thymeleaf's den; Tallyheart by the tunnel's mouth at night; her
  glass and secret bark under the moss of her nest, the rest of her bark along its edge; Puddle, Wisp, Sleet and Hail where continuity has
  them (this chapter moves none).
- **Glintstar has ruled again**: “A dragonet who couldn’t fly didn’t fly off with our prey.” / “And a fox who lies at my border will be
  answered. At the Gathering. By the one who found it out.” / “At the Gathering, you will speak.” No promise of a name. She has seen the
  glass. Her count, the twenty-four and the sixty, is said to Tallyheart on both paths now (“And my count,” in the den), before
  Glintstar comes in: no line has Glintstar hear the sixty ("Tallyheart tells her everything, row by row" says no more), and her
  "Bring your count" (chapter 7) waits for the Gathering.
- **Sprinkle** lifted four wingbeats on the last day (“I felt FEATHERLIGHT!”), and is **not mended**: “The full moon will tell.” `cant-fly`
  still reads "can't", and the case says it of the storm night. Whether her wing holds is the Gathering's.
- **Flags**: `foundMizzle`, `ch9Roof` (sticky). By chapter 9's end each of the six may be found or not: Squall (the roof, chapters 4, 5
  and 9), Puddle and Wisp (chapter 5), Sleet (chapter 6), Hail (chapter 8), Mizzle (chapter 9). Chapter 10 may offer any again with a
  found-here flag of its own (`ch10Puddle`, …), and the earlier chapter's page then reads `{ foundX: true, ch10X: false }` (chapter 4's
  page now reads `ch5Roof` and `ch9Roof`). The riddles so far: 7 × 5, 4 × 10, 7 × 1, 7 × 3, 4 × 4, 6 × 8 (and
  Sprinkle's 2 × 5, 6 × 5).
- **The case** (her file, 20 to 30 cards; eight to eleven under the moss): the rows as section 3 lists them, and `mizzle-wing` alone among
  the ears. Laid out on evening 13, read row by row; her glass is back under the moss in its leaf. **Picking the cards to answer Reynard is
  chapter 10's** (README 45): `fox-flew` still holds the only `answers` (`cant-fly`); `mizzle-wing` (when held) bears on FLEW too, as
  `waffles-no-moon` and `heron-no-moon` do on the moon, `glass` on the scale and `fox-brag` on the whole story (chapter 10 decides what
  answers what): nothing may require `my-count`, `mizzle-wing` or any optional card. **The nest has room**: 30 is the most a cat holds (29 on a straight reading), nineteen along the edge and eleven under the moss;
  chapter 10 has eight more along the edge (`BARK_MAX` 27) and seven more corners (18) before either cap. The den's `case` camera can lay the
  file out again (`read`).
- **The Counts.** The 8s are her ninth Count ("Spiders’ legs · the 8s", nine marks on the tree; "An eight is two fours"). Chapter 10 teaches
  the 7s (sunrises in a quarter-moon, module-1); of the 7s only **7 × 7** is new now (7 × 8 came in chapter 9). **Chapter 10's warm-up is the
  8s.** `E.hardFacts(cat, 8)` (run, `sim4.js`) finds chapter 9's misses (the lesson's, the doses', Mizzle's), a slow 8 × 5, 8 × 3 or 8 × 10
  (the lesson's facts timed on themselves), and **older timed answers chapter 9 did not replace**, because chapter 9 asks those pairs read
  first or as a check: 1 × 8 (chapter 1's 8 × 1, and the 1s' Hollow rounds), 2 × 8 (chapter 2 and the 2s' rounds), 6 × 8 (chapter 7 and the
  6s' rounds), 9 × 8 (chapter 5 and the 9s' rounds), 4 × 8 (chapter 8 and the 4s' rounds, unless the warm-up asked it). A warm-up that says
  "Yesterday" needs `warmHard: { table: 8, at: 0, avoid: [[1, 8], [2, 8], [4, 8], [6, 8], [8, 9]] }`; the cost is that a chapter-9 miss of
  2 × 8, 4 × 8 (or the dew's 8 × 4), 6 × 8 or 9 × 8 is passed over. 7 × 8 and 8 × 8 have no record before chapter 9, so a chapter-9 miss of
  either is found. **For the 7s**: a missed 7 × 8 is in `E.hardFacts(cat, 7)` (run), as chapter 8's missed twenty-eight and 2 × 7 are. The
  8s warm-up's fillers can borrow from `ch09-eights` (`fillOrder: 'easiest'`: 2 × 8, 8 × 3, 4 × 8, 8 × 5, 6 × 8), avoiding 8 × 8 and 7 × 8 as "an easy
  one". **The filler rule** (section 6): a borrowing one-fact set keeps three lendable pairs, or takes the cost; a set that can lend a
  one-group filler gives `helpIntroFar` no numbers.
- **Her worry's brave moment.** Water's is chapter 10's Moon Ferry at night (the open river bright blue, never dark), and **chapter 10's
  first screen should carry a friend-near line for a water-worry cat** (section 7, item 3: she went to sleep on “Tomorrow: the otters’ Moon
  Ferry.”). Talk's is her speech at the Gathering (“At the Gathering, you will speak.”; “All this time, you held it in. Tomorrow, you get to
  say it ALL.”).
- **Drawn now** (copy into continuity's places table at ship): the `grove` set (the little bridge over the bright channel, the old trees, the
  elder and the apprentice, the old oak with its moss, green, gold, grey and the silver kind on the north side, the hollow); Thymeleaf's den
  (`camp`/`herbs`, `remedy`); the den's `case` and `read`, `moon: 13`; the title's `root`; the roof's `dew` and `puddle`; the bridge's sunny
  bank (`shallows`, `run`, `run-2`, `skim`, `air`, `paddle`, `watch-*`); Thymeleaf, Mizzle, GroveClan's two, the spider; Sprinkle in
  flight; Squall's `hidden` (`NO_SHADOW.squall`); Riffle's mint; the Counts pictures of spiders, doses, acorns, and the sand at per 8.
- **The moon.** Thirteen evenings old at bedtime, nearly round; chapter 10's Gathering frames use `moon: 14` (the den's list, and any set's
  `moon` that is a list, add 14; the pile's and the field's take any number).
- **Words on screen now**: Thymeleaf, medicine cat, GroveClan, the Holt, Mizzle, the Moon Ferry (named, not yet seen: the otters' ferry raft),
  a remedy, wing medicine, reed root, oak moss, river mint, SUPERVISE, featherlight (a word, never a name). **Labels**: "A GroveClan elder",
  "A GroveClan apprentice", "The sleepy dragonet". Not used: Dew, Ironsnake, Twoleg.
- **Standing rules, still**: as chapter 8's, and: no CrystalClan paw on ReedClan's mud (the root lay on the dry stones); no cat of GroveClan
  has seen into the hollow; no grown cat is drawn in `laugh`; the shallows are bright and clear; the spider is friendly and never creepy;
  Mizzle stays in her oak ("stay where you land").

## 9. Calls made

1. **Two sticky flags, `foundMizzle` and `ch9Roof`; no choice flag.** Reason: the brief; chapter 10 reads no choice of this chapter, and
   every light choice here leads to the same next screen.
2. **The roof is chapter 4's frames, copied by this file's own `roof()`, every hour first light.** Reason: the brief (no new writing; as
   chapter 5); the story's "here by first light" for the tower's frames as well as the roof's, so the climb is not by day under a dawn sky.
3. **Chapter 4's page reads `ch9Roof`; chapter 5's needs nothing.** Reason: the brief; a page says "found" only in the chapter that found
   him, and chapter 5's one Squall line reads `ch5Roof` (checked).
4. **The 8s' picture is keyed on `thing: 'leg'`, with no `kind`.** Reason: the skip-counts (the spider's two sides, the five spiders) pass
   `thing` and `who` but no kind, and no fingerprint sweep reaches `thing: 'leg'`, so one key draws the lesson, its fillers, the skips and the
   8s' Hollow rounds.
5. **The doses share one new kind, `kind: 'dose'`, with `layout: 'rows'`, the mark by `thing`.** Reason: the story's one layout (rows of
   eight, four and four) with three marks; `layout: 'rows'` gives the generic words “Two rows of eight. How many drops?” and the help's
   row-at-a-time hops, as the pile's rows do.
6. **The dew is a silent set (`teacher: 'caption'`).** Reason: Tallyheart is not on the roof (the story); chapter 5's Wisp made the engine's
   own lines captions and the count hers.
7. **The sand at per 8 is four and four, and `sweep7`'s plain per 8 is re-taken.** Reason: "an eight is two fours" in the help's picture, as
   chapter 8 did for per 4; no shipped frame draws plain per-8 sand.
8. **No engine change for chapter 8's inherited need; chapter 9 meets it by its data.** Reason: section 6 (the proof, and the exhaustive run);
   changing `fillers()` would change chapter 8's shipped readings.
9. **Mizzle's riddle is 6 × 8, its fillers twigs.** Reason: the brief (an 8s fact not yet a riddle); the story's avoid list.
10. **Mizzle's card lies alone, under the moss.** Reason: section 3 (no free end but `cant-fly`'s, no true default line, no row of five); a
    dragonet's card is a secret, as Hail's.
11. **Thymeleaf's four things are an `ask` with himself as both voices.** Reason: chapter 8's tree Tap is an `ask`; it letters two lines a tap,
    so each balloon of the story's is split at its sentence, no word changed; a skip would count, and four one-tap frames would cost four
    frames.
12. **The case is laid out on a new den camera, `case`, lit row by row by an `ask` with `opt: 'read'`.** Reason: the story's Tap ("a row of
    bark lights at each"); `ask.opt` is chapter 5's, and the page already takes the art's own mark as the Tap's spot; a new camera leaves every
    chapter 1 to 8 den frame as it is, and laying out at most fifteen pieces face up (seventeen at `read: 7`; the rest stacked face down)
    keeps the 28- to 30-card files clear of `BARK_MAX`. Every `case` frame after the ask is `read: 7`, and Glintstar's entry is on `case`
    too (`doorway` cannot draw the laid-out rows).
13. **The pieces come from `bark: 'auto'`, found by picture in the art.** Reason: `E.resolveScene` already resolves it per cat; no engine change,
    and a Sleet cat's den card lies at FLEW's end as in her file, with no twin frames.
14. **Her count and Mizzle's card are laid out on the next screen (`read: 7`).** Reason: the story ("Hail's card and `my-count` lie where they
    lie, unread; Mizzle's … is read on the next screen"); her count is said there on every path.
15. **One new place, `grove`, with five cameras; Thymeleaf's den a camera of the camp.** Reason: the brief.
16. **The reed root is a title option with its own Tap.** Reason: the story's picture (a pale root and one wet pawprint on the dry stones) and
    "Tap to take the root".
17. **The dew's puddle and the sunny shallows are options of their sets** (`dew`, `shallows`). Reason: the standing rule (the shallows never
    dark; the bridge's river is brown after the storm); off by default, so every earlier frame draws as it does.
18. **Squall unmet is a tail tip (`hidden`) labelled "A voice".** Reason: the story ("no face shown… so he stays unmet"); every speaker is in
    the cast, and `NO_FACE_POSES` already hides a `hidden` speaker's face.
19. **The roar's panel is a pair by `foundSquall`, the choice on one.** Reason: the roar caption is everyone's, the choice only an unmet cat's;
    chapter 4's way (`when` and `else`).
20. **The dew's screen and its Counts frame are pairs by `foundSquall`; its trailing captions are three frames with `when`s.** Reason: a scene
    cannot vary by flag, and captions come first on a panel.
21. **Coil's “QUIET” is a cut to `wall`.** Reason: every speaker is in the cast, Coil is at `gap` whenever he is there, and he never comes out
    (the standing rules); the bank keeps the practice in the sun.
22. **The told path keeps its branch on the first panel under the bridge (a twin).** Reason: chapter 4's rule for the told path's first `back`
    panel; it costs one frame.
23. **No title panel.** Reason: the story opens on a screen both paths read.
24. **The book and the teaser are proposed here** (the story builder owns them). Reason: each sentence must be true on every path.
25. **The golden of chapters 1 to 8 has an owner and a test file of its own** (`tests/golden-ch08.test.js`). Reason: the words owner holds
    `tests/engine.test.js`; the golden is a large, separate job that runs in parallel (chapter 8's call 24).
26. **The edit to chapter 4's page is the words owner's.** Reason: it moves `docs/storyboard/ch04.md`, which the words owner regenerates; one
    owner for the story file and its storyboard.

## 10. For the orchestrator

- **Before the build, in this order:**
  1. **The snapshot** is taken (`/Users/aron/potomac-crossing-work/ch09/shipped/`, from commit b6a8d4f: `app/`, `index.html`,
     `tests/_load.js`; engine 0.8.0). It is the `GOLDEN_ROOT` and every fingerprint's source. Do not change it, but for what is
     live: on 2026-10-26 the depth hotfix (83313a1, live before chapter 9) took its `app/story/ch06.js`, `ch07.js` and `ch08.js`
     in (b6a8d4f's are kept in `ch09/integrate-r1/shipped-b6a8d4f-story/`), and the golden and the two `pile` keys of
     `CH9_FINGERPRINT` were recorded again from it.
  2. **Stub `app/art/sets/grove.js`**: a set registered with `PC.art.defineSet('grove', …)` (one camera `wide`, **at least one anchor** on
     it, e.g. `'edge-1': K.anchor(600, 900, 250)`, no options, and a `draw` that paints nothing and returns `{ back: '', over: '', front:
     '' }`), and its script tag in `index.html` after `app/art/sets/tracks.js` (chapter 8's lessons: zero anchors spins
     `tests/scenes.test.js`; a `draw` that returns `''` fails four render tests).
  3. **Stub `app/story/ch09.js`**: a chapter with one `board: 'STUB.'` frame, `PC.story.ch09` with id `ch09`, number 9, title
     'Featherlight', empty `counts` and `cards`, a teaser (`{ title: 'Chapter 10: The Gathering', lines: ['Tomorrow: the otters’ Moon
     Ferry. Every Clan, at the Gathering.'] }`); its script tag in `index.html` after `ch08.js`; both new files in `sw.js`'s `ASSETS` and a
     `CACHE` past the live value; `docs/storyboard/ch09.md` generated from the stub (`node tools/storyboard.mjs app/story/ch09.js`).
     `node --test`: only these may fail until their owners land: the storyboard's `--check-words` (the stub set has no words: the words
     owner's); the gallery test (`tests/scenes.test.js`: `dev/gallery.html` must load every script `index.html` does, in its order, so
     it lacks `../app/art/sets/grove.js` after `tracks.js` and `../app/story/ch09.js` after `ch08.js`, and the new set's cameras are not
     yet sampled: the places owner adds both tags and the samples);
     `tests/story-ch08.test.js`'s teaser test (with `ch09` in `PC.story`, `E.teaser(ch08)` is `built: true, next: 'ch09'` and the hub's next
     chapter `ch09`: **the orchestrator updates it with the stub**, as chapter 8's spec had chapter 7's updated); and
     `tests/scenes.test.js`'s chapter-7 fingerprint, whose list of new gallery keys gains `gallery/grove/wide` (**the nest owner's**: the
     list becomes chapter 7's three, chapter 8's `gallery/tracks/<cam>`, and a `gallery/grove/<cam>` for every `grove` camera in the
     vocabulary, plus `gallery/camp/herbs` and `gallery/den/case`, so it passes on the stub and on the built sets), with its "the den takes
     nothing new by name" test, whose list of den options gains `read` (the nest owner's). The other `tests/scenes.test.js` pins the new
     camp and den cameras and the title's options move are the nest owner's too, each changed with a chapter-9 comment: the ch1–3
     fingerprint's `ch1Cams()` excludes `herbs` and `case` (as `CH6_NEW` excludes `end` and `meet`; chapter 1's fixed anchors are not
     theirs) and chapter 6's vocabulary test that compares cameras and anchors to `CH1_CAMS`/`CH6_NEW` takes them as chapter 9's; the
     camp crowd test's loop over every camp camera at `sunset`, `morning` and `dusk`+`purr` (`herbs` must draw at every camp light);
     chapter 8's den pins (`den.cams`, `den.anchors`, `Object.keys(den.opts)`, `den.opts.moon`); chapter 6's `title.opts`.
- **Owners**: five, disjoint (the build's `owners`). **places**: the new set and the bridge's and the roof's changes, their tests, and the
  gallery page (append only: new `SAMPLES.grove` and new `EXTRA` entries after the last, no other set's `SAMPLES` and no existing `EXTRA`
  entry touched, since the nest owner's chapter-7 fingerprint hashes every old camera's sample and the first 93 extras; since no other owner
  holds the page, its samples also show the camp's `herbs` with each `remedy`, the den's `case` at `read` 0, 3, 6 and 7 with a 21- and a
  29-card file (and, appended 2026-10-26, the fullest, 30 cards, at `read` 3 and 7 and at bedtime), `moon: 13`, the title's `root` (by day and at `sunset`), the roof's `dew` with our cat at `puddle` on `two` and `wide`, with
  Squall at `pole` and with his `hidden` tail tip and `plane: true`, the hollow's `marks: 9` at `tree` and `wide`, Riffle's mint on the
  grove's `bridge`, and the bank's `shallows` with Sprinkle at `run`, `skim`, `air` and `paddle` and a cat at `run-2`); `pile.js` too, only
  if `rear` by morning, the shaded whole back row or `gap` by morning needs a fix. **words** also regenerates the stub's
  `docs/storyboard/ch09.md` with its tool change. **cast**: cats.js, its test and its gallery. **nest**: scenes.js
  and cards.js, their tests. **words**: the engine's version, the UI's words, the storyboard tool and every storyboard, build.md, chapter 4's
  page, their tests. **golden**: the chapters 1 to 8 golden, its maker, fixture and test. No owner for `app/story/ch09.js`,
  `tests/story-ch09.test.js` or `docs/storyboard/ch09.md` as built: the story builder's, later, with the tests that count Counts (the Hollow
  now offers nine; the tree's nine marks); chapter 8's teaser test is the orchestrator's, updated with the stub, and the story builder checks
  it still holds for the built chapter.
- **Engine need** (section 6): decided (none: met by the data, the engine unchanged). Record it in the README with the calls.
- **Can't be built literally, built nearly**: “Riffle folds his paws” (Riffle `sit`, `proud`: no otter pose folds its arms); “Her tail curls
  round you.” (a caption: no art draws a tail round another cat, chapter 6's rule); “a claw lights at each” (Thymeleaf glows, his forepaw
  raised); “the leaf settles” over Mizzle (the next page is the moss: the Tap is on the leaf in our cat's paws); “she whispers in Tallyheart’s
  ear” (the next panel); “Thymeleaf talks to his leaves / to it” (his balloon, facing them); “Sprinkle ducks under her tail, then peeks out”
  (a caption over the sniff's picture); “she dips her head … and she is gone” (Glintstar `walk` at `case-3`, facing right, turning to go into the doorway's light); “the moss goes into its
  leaf” and “she tucks it into her leaf with the moss” (the next panel has her leaf); the hum (a caption); Coil "counts her footsteps" (not
  drawn); the snort (not lettered).
- **Frames**: about 94 on a told plain reading, 96 kept; about 106 with Mizzle, 107 with the roof, 117 with both (the story's 63 to 72
  screens, the captions-first splits, the twins, the path-only panels); under the brief's 130.
- **README** (end of the spec phase): record section 9's calls under "Claude's calls under decision 46", and section 6's engine need as
  decided. At ship, item 7 of "Chapter 9's brief" takes the Thyme, Leaf and Grove clause (section 7, item 4).
- **`docs/continuity.md`** (ship): section 8; `foundMizzle` and `ch9Roof` in the flags table; `mizzle-wing`; Mizzle's row in the dragonets
  table (her riddle 6 × 8, her "five", her card; Dew renamed); Thymeleaf, the GroveClan elder and apprentice in the cast table; the 8s row of
  the Counts table (warm-up 4 × 7 or her hardest 4s, 2 × 4; the lesson; Mizzle 6 × 8; the doses 8 × 4, 3 × 8, 8 × 8); nine marks; the places
  table's new keeps (section 8, "Drawn now"); who knows what.
- **`docs/build.md`** gets a short "Chapter 9" section from the words owner.
- **The ship's Safari look** should include: the spider close (her two sides lit), a lesson question with ten spiders, the help's four-and-four
  sand, the doses' rows (drops, paw marks, eight rows of marks) with a miss lit a row at a time, the acorns, Thymeleaf's den with the spider
  and the remedy, GroveClan's bridge, woods, elder and oak, the hollow with Mizzle, the roof's dew on `two` with and without Squall's tail
  tip, the sunny bank (the shallows, Sprinkle gliding low at `skim`, splashing, and in the air at `air` with the sand's soft shadow under
  her), the case laid out (a row lit, the next glowing, and `read: 7`), Glintstar stepping in on `case`, the doorway under a nearly round
  moon at bedtime, the root at the wall's end at sunset, and her nest at bedtime (eleven corners for a Mizzle cat).

# Chapter 10 spec: The Gathering

*v0.3 · 2026-10-26 (v0.2 with the verify critics' findings applied: the hotfix and the Warrior Counts are uncommitted worktrees, so
step 0 says where each comes from, lists their files, brings the hotfix onto chapter 9 (ch09 f112's cast, the ch08 golden, chapter 9's
fingerprints) and checks what a no-op merge would miss; `CACHE` counted from the tree; no depth rule: casts back to front, the leaders'
roots behind their Clans, a depth check over chapter 10; the golden's version constant; the stubs' labels; the pick's mode class on
`.cf-in`, its double tap, its hooks in the Case File's code (`fileKey`, the backdrop, `fileCard`, the speech), `E.next`'s guard with
`stories`, `pickPage`'s `opened` and `said`, the nudge clamped, VoiceOver after the glow, the corner's words for every card, the tests
that pin `E.KINDS`, the storyboard's own row; a fullest-file pick look and the plain file's look before the build; her file's groups
first, and their sizes; `K.crowd`'s leave-out as new; Mama's shadow; the sixty's cast and Snatch's mouse; 133 frames; the depth faults
deferred again; no line of the story changed)*

*v0.2 · 2026-10-25 (v0.1 with the spec critics' findings applied: the 7s' words and timing as the engine has them, 7 × 8's way
chapter 9's, Tallyheart in the sixty's picture; chapter 5's two recap lines; the roll call's HERE! on a panel of its own with Mama
`lift`; Puddle's `eyes` shadowless in the water; the crowd's coats and its standing; the ferry's `sit-3`; the pick judged null off the
glow, its storyboard graph, its Read to me, hook and order; the Warrior Counts' merge as step 0 and their hub test; the stub's two
frames; no line of the story changed)*

*The build's contract for chapter 10, beside `docs/build.md`. The story, [`10-the-gathering.md`](10-the-gathering.md) (Draft v0.5,
final), is the source of every word she reads; this spec adds no line she reads except the engine's own wording of a question, a
filler's opening, a retry's opening, a right retry's line and a last miss, each named here and kept to chapters 6 to 9's lines or the
story's own words, the instruction lines under a panel (as every chapter's), and the book and the teaser, which it proposes. Every
Counts set below was run on the live engine (0.9.0, main's working tree with chapter 9 built) with scripted answers, exactly as
written here: `~/potomac-crossing-work/ch10/spec-writer/sets.js` (the sets on a mock chapter 10, `E.checkStory` clean), run by
`sim1.js` (the warm-up, for every chapter-9 record that picks its first question, to six misses), `sim2.js` (the 7s, to four
misses, with the giveaway check), `sim3.js` (the Moon Ferry Counts, to four misses, how each pattern ends), `sim4.js` (the sixty and
Puddle's riddle) and `sim5.js` (her Case File at the Gathering for the thinnest and the fullest files, and each claim's right cards).
Where the story's italic notes and this spec differ, the spec is the build's (section 7, item 2). Names in `code` are fixed: the art,
the engine, the storyboard words and the story builder use exactly these.*

*The tree it is built on* (the orchestrator's): main after (1) chapter 9 ships, (2) the hotfix of chapters 6 to 8's cast order
(Charlie's bug, ch08 f030: a far cat painted over a near one) is brought onto it, and (3) the Warrior Counts (`docs/warrior-counts.md`
v0.2, decisions 48 and 49) are brought onto that: `E.warrior*`, `app/story/warrior.js` (`PC.warrior`, `after: 'ch10'`), the hub's offer
once chapter 10 is finished, and a Ceremony chapter that opens with `opensWhen: 'warrior'`. Where this spec touches those, it says
exactly what chapter 10 sets or calls (section 6, "Where chapter 10 meets the Warrior Counts"). **The hotfix adds no depth rule and
changes no engine** (`~/potomac-crossing-work/hotfix-ch08/plan.json`, which rejects both a set-level `z: 'behind'` and a kit-wide sort):
it moves the far cat at `crowd-2` to the head of the cast in 12 pile frames (ch06 f004, f107, f109; ch07 f018, f021, f077, f079 to f082;
ch08 f009, f030) and adds a guard for the pile's `wide` camera (`tests/set-pile.test.js`'s depth-hotfix test, its list `DEPTH_FIXED`).
**Neither has a commit** (as found 2026-10-25): branches `hotfix-ch08-f030` and `warrior-counts` both still point at chapter 8's
`b6a8d4f` (`E.VERSION` '0.8.0', `CACHE` v16), and both pieces of work are uncommitted files in their worktrees,
`/Users/aron/potomac-crossing-hotfix` (16 modified) and `/Users/aron/potomac-crossing-wc` (8 modified, 6 new; both lists in section
10, step 0). A `git merge warrior-counts` therefore says "Already up to date" and brings nothing. Bringing both onto chapter 9 is the
orchestrator's step 0 (section 10), before the snapshot.

---

## 1. Flags

**Seven new flags: one sticky (`ch10Puddle`), one choice flag the Ceremony reads (`ch10Best`), and five pick flags**, each the record
of one card pick, read only inside this chapter (section 9, call 1: the brief's "at most one choice flag" is about what later
chapters read; a pick must remember the card it took for the screen after it, and a flag is the record `when` already reads).

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `ch10Puddle` | `true` | the last screen of "Under the raft" (“Oh. She HEARD.” … “FIVE anyway!” he whispers, with the wave Tap): `sets: { foundPuddle: true, ch10Puddle: true }` on the frame, never on an option | sticky | this chapter: nothing reads it but the book (its recap line). **Chapter 5's page** (section 5, the one edit to shipped story code): its two recap lines that read `foundPuddle` (the Puddle line, and the forepaw line's “found a dragonet today”, ch05.js's `ANY`) leave out a cat whose only Puddle is chapter 10's, as chapter 4's took `ch5Roof` and `ch9Roof`. The Grown-ups corner. Only a cat with `foundPuddle: false` is offered the scene, so `foundPuddle` and `ch10Puddle` are set together, never `ch10Puddle` alone |
| `ch10Best` | `sprinkle`, `friends`, `truth`, `counts` | Tallyheart's “Which part of this moon will you remember most?”: each option's `sets` (“Sprinkle.” `sprinkle`, “My friends.” `friends`, “Finding the truth.” `truth`, “The Counts!” `counts`) | replaced | this chapter: Tallyheart's four replies (one balloon each, by `when`); **the Warrior Ceremony** (Glintstar's first suggested ending, module-1: endings drawn from what she did); the Grown-ups corner |
| `ch10PickFlew` | the card id she answered with: `cant-fly`, `fox-brag`, `mizzle-wing` | the first pick, “It FLEW out of your camp!” (its frame's `pick.flag`; section 6) | replaced (Back to the pick and a new right pick, or a reread, replaces it) | the answer screen after it (her line, by card) |
| `ch10PickMoon` | `waffles-no-moon`, `heron-no-moon` | the second pick, “By the light of the MOON.” | replaced | the answer screen (her line, by card) |
| `ch10PickScale` | `glass`, `scale`, `sprinkle-scales`, `wisp-fox` | the third pick, “A dragon SCALE by your pile!” | replaced | the answer screen (her line, by card) |
| `ch10PickBig` | `prints-sprinkle`, `stash`, `tunnel`, `coil-diggers`, `heron-shapes`, `prints-marsh`, `fur`, `four-a-night`, `prints-pile`, `prints-tracks`, `squall-shapes`, `puddle-paws`, `hail-shapes`, `my-count` | the fourth pick, “Only something BIG could take so much!” | replaced | the answer screen (her line by card; Sloshbank's “OURS?” and *Drip.* with `stash`, a twin frame: section 5) and the sixty's screen (“And your count, {name}paw?” with `{ not: { ch10PickBig: 'my-count' } }`, “Your count,” with `{ ch10PickBig: 'my-count' }`) |
| `ch10PickOut` | `fox-brag`, `tunnel`, `coil-diggers`, `stash`, `heron-shapes`, `dug-earth`, `prints-pile`, `squall-shapes`, `hail-shapes`, `puddle-paws` | the fifth pick, “I never even saw your pile! How could I get the prey OUT?” | replaced | the answer screen (her line, by card) |

- **The light choices set nothing** (`sets: {}`): “Peek between the logs.” / “Sit tight.” (only a cat who has never found Puddle;
  saying no sets nothing: Puddle is found only by reading his scene to its last frame); Sprinkle's goodbye, “Fly SAFE!” / Hug her back,
  tight. Both lead on to the same screen.
- **Counted conditions are written out, never computed** (E.matches reads flags, not counts). With the six found flags of the
  clutch (`foundSquall`, `foundPuddle`, `foundWisp`, `foundSleet`, `foundHail`, `foundMizzle`; Sprinkle is everyone's):
  - *any of the six found*: `{ not: { foundSquall: false, foundPuddle: false, foundWisp: false, foundSleet: false, foundHail: false, foundMizzle: false } }`
    (chapter 9's);
  - *none of the six*: all six `false`; *all seven found*: all six `true`;
  - *just one of the six*: six frames, each with one flag `true` and the other five `false`;
  - *two or more*, *five of the six*, *four or fewer*: reached by a chain of frames with `when` and `else` (section 5, "The roll
    call"): the just-one frames come first, so a frame with the any-found `when` after them is read only with two or more; the
    five-of-six frames (each one flag `false`, five `true`) come after the all-seven frame, and the four-or-fewer frame, with no `when`,
    is reached only through their `else`s.
- **Flags read from earlier chapters:**
  - `worry`: `water` (the first screen's friend-near panel; Tallyheart's “One paw at a time,” and the four-paw boarding; the low raft's
    “Tallyheart doesn’t even blink.”; the brave look at the river; Puddle's “Your nose is VERY close to the river.”), `small` (the
    island), `talk` (the case: “All this time, you held it in…”; after the fifth pick, “You said it ALL.”), `shiny` (the mist stone:
    “It sparkles. It shines. And this one, you get to KEEP.”).
  - `specialty`: one line each at the case (noticing, climbing, sneaking, swimming, friends).
  - `ch3Told`: Sprinkle's kept line on the island (“And one vole.” with `false`), and her thanks to Tallyheart (two by path).
  - `ch2Stone`: one bedtime caption (`nose`, `chin`), and the den's `stone: 'auto'`.
  - `foundPuddle`: the low raft (his foot and whisper, or Riffle's “LOG thing” and the choice); his goodbye. `foundWisp`: “Somewhere,
    Wisp nods.” or “a quiet one nods.”; her goodbye. `foundSquall`: his goodbye; “Squall, saying goodbye. LOUDLY.” on the walk home.
    `foundSleet`, `foundHail`, `foundMizzle`: their goodbyes. All six: the roll call's forepaws, the counted conditions above, Sprinkle's
    two farewells (any found / none).
  - `lessonClean: 'ch10-sevens'` and `not` it: the tenth mark's lines.
  - Not read: `stepOut`, `spokeUp` (“Sharp eyes.” is said on both paths), `joinReason`, `ch2Path`, `ch2SaidAloud`, `ch4CaughtFly`,
    `ch5First`, `ch5Roof`, `ch7Flew` (her file reads it through chapter 4's link, as since chapter 7), `ch9Roof`.
- **Grown-ups corner** (`PC.ui.flagWords`): `ch10Puddle: { 'true': 'found Puddle under the Moon Ferry (chapter 10; {their} book says
  so on chapter 10’s page)' }`; `ch10Best: { sprinkle: 'will remember Sprinkle most', friends: 'will remember {their} friends most',
  truth: 'will remember finding the truth most', counts: 'will remember the Counts most' }`; the five pick flags in words built from
  the picks themselves (section 6: “answered Reynard’s “It FLEW out of your camp!” with: Sprinkle can’t fly.”).

## 2. Counts sets

**21 typed answers on every reading, 22 with Puddle** (the story's For us; the brief's "about 18 to 22"): two 8s in the warm-up, ten
7s, eight in the Moon Ferry Counts, the sixty; and chapter 5's log riddle in "Under the raft". **Five card picks** (section 6). Every
key below is one the engine has (chapters 2 to 9); no set needs a new one. Shared pieces, as chapter 9's file has them:

```js
function T(text) { return { who: 'tallyheart', text: text }; }
var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
var AFTER = ['Ha! You didn’t even look at the sand that time.'];
var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
var LEGS = { table: 8, thing: 'leg', things: 'legs', unit: 'spider', units: 'spiders', teacher: 'tallyheart', ask: '{a} × {b}' };   // chapter 9's
var CLUTCH = { table: 7, thing: 'dragonet', things: 'dragonets', unit: 'clutch', units: 'clutches', teacher: 'tallyheart', ask: '{a} × {b}' };
var WAY49 = 'Six sevens is forty-two. One more seven: forty-nine.';
var WAY56 = 'Twenty and twenty make forty. Eight and eight make sixteen. Forty and sixteen: fifty-six.';   // chapter 9's, exactly
```

Lines use the story's typographic quotes and apostrophes. A balloon carries the spoken words only (chapter 9's rule): a quote the story
splits round "says X" is one balloon, its comma before the tag a full stop when the quote resumes with a new sentence (“Eighteen guards.
I was one. Awake, mostly.”). Engine lines that reach her and that no set words: **a retry** opens with “Here’s that one again.” (a
borrowed filler's retry, in a set that borrows in its own voice, opens with its `fillIntro` again); **a right retry** of a fact with no
`rightAgain` gets “There it is. You remembered that one.” then “Yes! That one came back, and you knew it.”; **a generic question** where
a question has no words of its own (set by set, below).

### Every fact, in the order she meets it

| # | Set | Fact (answer) | Where | Picture |
|---|---|---|---|---|
| 1 | `ch10-eights` | 8 × 8 (64), or her hardest 8s fact from chapter 9 | the warm-up, the empty Hollow | that many spiders, eight legs each, four a side (chapter 9's) |
| 2 | `ch10-eights` | 2 × 8 (16) | the warm-up | two spiders |
| 3–12 | `ch10-sevens` | 2 × 7, 7 × 5, 7 × 3, 4 × 7, 6 × 7, 10 × 7, 7 × 1, 7 × 7, 7 × 8, 9 × 7 (14, 35, 21, 28, 42, 70, 7, 49, 56, 63) | the lesson | that many clutches, seven little dragonets each, a row of four over a row of three (**new**, section 4) |
| (13) | `ch05-puddle` | 4 × 10 (40) | the log riddle, under the raft, before the Moon Ferry pushes off (optional: chapter 5's set, run as chapter 5 ran it) | the raft from underneath, four logs, ten bumps each (chapter 5's) |
| 13–20 (14–21 with Puddle) | `ch10-ferry` | 8 × 1, 5 × 2, 3 × 10, 6 × 3, 4 × 6, 9 × 4, 6 × 8, 7 × 7 (8, 10, 30, 18, 24, 36, 48, 49) | the Moon Ferry, upriver at night | each fact its own Count's picture: tails, ears, both forepaws, patrols, cheeks, paws, spiders; 7 × 7 seven rows of seven marks scratched on a log (**new**) |
| 21 (22 with Puddle) | `ch10-sixty` | 10 × 6 (60) | the case, Glintstar's “I said bring it.” | six nights of ten marks (chapter 7's) |

The lesson kit holds (the brief): the warm-up on the 8s, two questions, one adapting to her hardest 8s fact (chapter 9's spec, section
8's avoid list); the lesson ten facts on the 7s, both orders mixed (five each way: 7 first in 7 × 5, 7 × 3, 7 × 1, 7 × 7, 7 × 8; second
in 2 × 7, 4 × 7, 6 × 7, 10 × 7, 9 × 7), **7 × 7 the only new fact**, asked with stepping stones (6 × 7 three before it, lit 42) and again
on the Moon Ferry; the Moon Ferry eight touching all ten tables (1s 8 × 1; 2s and 5s 5 × 2; 10s 3 × 10; 3s and 6s 6 × 3; 6s and 4s
4 × 6; 4s and 9s 9 × 4; 8s and 6s 6 × 8; 7s 7 × 7), the easiest first, never the nine lives on the water (chapter 5's rule). Not
typed (taps, never logged): the five clutches in the sand (7 to 35), Tallyheart's one-pair ask at the tree, the four paws aboard (a
water-worry cat), the confession's ask, the roll call's seven forepaws (5 to 35), and every one-tap frame (section 5).

### `ch10-eights`, the warm-up (two questions; Counts frame `intro: false`)

```js
'ch10-eights': Object.assign({}, LEGS, {
  facts: [[8, 8], { a: 2, b: 8, right: [T('Sixteen! Eight and eight.')], rightAgain: true }],
  warmHard: { table: 8, at: 0, avoid: [[1, 8], [2, 8], [4, 8], [6, 8], [8, 9]] }, avoid: [[6, 8]],
  fillFrom: 'ch09-eights', fillOrder: 'easiest', fillIntro: 'One from the spiders.',
  praise: ['Two fours make an eight!', 'Eight more, every time!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
  remembered: 'Last time, {a} × {b} made you stop and think. Not today!',
  rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
})
```

- **The hard pick** (`warmHard`, position 0, chapter 9's spec section 8's list exactly): her hardest 8s fact by `E.hardFacts(cat, 8)`,
  in the order she was asked it; 8 × 8 when nothing was. Runs (`sim1.js`, every one of these as she meets it): nothing hard → “Eight
  spiders. How many legs?”, quick “Quick as a pounce!”, slow “Two fours make an eight!”; a chapter-9 miss of 8 × 8 (the lesson or the
  flaps), 7 × 8 or the rubs' 3 × 8, or a slow 8 × 3, 8 × 5 or 8 × 10 (the lesson's facts timed on themselves) → that fact first, in its
  spiders (“Three spiders. How many legs?”), quick “Last time, 8 × 3 made you stop and think. Not today!”, slow “8 × 3 again, and you got
  it. It’s getting easier.” (never “Yesterday”: chapter 9 was days ago). **Passed over** (the cost chapter 9's spec named): a chapter-9
  miss of 2 × 8, 4 × 8 (or the dew's 8 × 4), 6 × 8 (Mizzle's) or 9 × 8 opens on 8 × 8, so the Moon Ferry's 6 × 8 is never the warm-up's.
- **The words**: the Counts frame's caption and balloon (“The Training Hollow is empty. Just you and Tallyheart.” / “Eights first, to
  wake up your whiskers.”) are read on the frame and not again (`intro: false`), so the first question is timed on itself, in the
  engine's words. 2 × 8 is asked in the engine's words too, which are the story's (“Two spiders. How many legs?”; its retry “Here’s that
  one again. Two spiders. How many legs?”), so it has **no `prompt`** and is timed on itself (chapter 9's v0.2 call for its 2 × 4). Its
  right line, “Sixteen! Eight and eight.”, is neutral on purpose (the story: after a missed first question, more eights follow it) and
  kept on a retry.
- **Help** (run): chapter 9's per-8 sand, four and four, hopped by eights (8 · 16 … 64); “Close. Let’s hop it together.” within one hop,
  else “Let’s hop it together.”; then “There. We’ll come back to that one.” (last miss: “There. Now you’ve seen it counted.”).
- **Fillers** (run, to six misses, every hard pick): chapter 9's lesson's five easiest (2 × 8, 8 × 3, 4 × 8, 8 × 5, 6 × 8), less the
  warm-up's own two (`own`: the engine adds them, `fillOrder: 'easiest'` with an `avoid`) and 6 × 8 (`avoid`: the Moon Ferry's eight),
  each after “One from the spiders.” in its spiders (“One from the spiders. Three spiders. How many legs?”): 8 × 3, then 4 × 8, then
  8 × 5; never 8 × 8, 7 × 8 or 6 × 8, however many misses. After a miss on the first, 2 × 8 is one of the two, then one easy eight
  (!8×8 2×8 F:8×3 R:8×8); after a miss on 2 × 8, two (8×8 !2×8 F:8×3 F:4×8 R:2×8).
- **A hard 7 × 8 is met again in the lesson, on purpose**: a chapter-9 miss of 7 × 8 makes it the warm-up's hard pick (“Seven spiders.
  How many legs?”), and the 7s ask it again as their ninth question minutes later (run: warm-up 7x8h 2x8, lesson … 7x8), so she meets the
  pair twice this morning, three or four times with a miss (its retry), and the lesson's “You did that one with spiders.” is this
  morning's spiders too. Good practice; the story builder's test pins it.
- **Known, kept** (section 7, item 6): when the hard pick is 8 × 3, 3 × 8 or 8 × 5, only two of the five are lendable, and after three
  misses the last pass lends 2 × 8 back as “One from the spiders.” (run: !8×3 2×8 !4×8f 8×3r !8×5f 4×8r 2×8f 8×5r). True (it is one from
  the spiders); the story builder's test pins it: never before the third miss, never with any other hard pick.

### `ch10-sevens`, the lesson (ten facts; Counts frame `intro: false`)

```js
'ch10-sevens': Object.assign({}, CLUTCH, {
  label: 'Clutches of seven', hollowThings: 'sevens', fillOrder: 'easiest', prompt: 'How many dragonets?',
  facts: [
    { a: 2, b: 7, prompt: 'Two clutches. How many dragonets?', retryPrompt: true, right: [T('Fourteen! Seven and seven.')] },
    { a: 7, b: 5, right: [T('Thirty-five! You hopped that one already.')] },
    [7, 3],
    Object.assign({ a: 4, b: 7, prompt: 'Four clutches. Two clutches, doubled.', retryPrompt: true, right: [T('Twenty-eight!')] },
      way('Fourteen and fourteen. Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
    Object.assign({ a: 6, b: 7, lit: 35, prompt: 'Six clutches. Five sevens is thirty-five. One more seven…', retryPrompt: true,
      right: [T('Forty-two!')] }, way('Five sevens is thirty-five. One more seven: forty-two.')),
    [10, 7],
    [7, 1],
    Object.assign({ a: 7, b: 7, lit: 42, prompt: 'Seven clutches. Six sevens is forty-two. One more seven…', retryPrompt: true,
      right: [T('Forty-nine! The new one.')], rightAgain: true }, way(WAY49)),
    Object.assign({ a: 7, b: 8, prompt: 'Eight clutches? You did that one with spiders. Twenty-eight, doubled.', retryPrompt: true,
      right: [T('Fifty-six!')] }, way(WAY56)),
    Object.assign({ a: 9, b: 7, prompt: 'Nine clutches. Ten would be seventy.', retryPrompt: true,
      right: [T('Sixty-three! Six and three make nine.')] }, way('Seventy, and one clutch less: sixty-three.'))
  ],
  praise: ['Seven more, every time!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the sevens.'
})
```

- **The Count**: no set before chapter 10 is on table 7, so this is the 7s' own (`E.countSets`, run: `… 8:ch09-eights 7:ch10-sevens`).
  The Hollow's button reads “Clutches of seven · the 7s”; Tallyheart says “A round of sevens. Ready? Here we go.” (run, `E.hollowDef`
  `hollow-7s`); the tree gets its tenth mark once this lesson is finished (`E.learnedCounts`), never before. A Hollow round of the 7s asks
  1 × 7 to 10 × 7 in both orders, “How many dragonets?”, in one to ten clutches. In the Warrior Counts a pair is helped in its anchor
  Count, the one of its two numbers taught first (`E.warriorAnchor`, `E.countSets`' order 1, 2, 5, 10, 9, 3, 6, 4, 8, 7), so only 7 × 7
  is helped as clutches there, with this set's help openings; every other seven anchors to its other number's Count.
- **The order** (the story's, run): 2 × 7, 7 × 5, 7 × 3, 4 × 7, 6 × 7, 10 × 7, 7 × 1, 7 × 7, 7 × 8, 9 × 7. 6 × 7 comes three before 7 × 7,
  so a missed 6 × 7's retry lands just before it (2×7 7×5 7×3 4×7 !6×7 10×7 7×1 R:6×7 7×7), and 7 × 7's stepping stone is a fact she has
  just typed; 9 × 7's “Ten would be seventy.” points back to 10 × 7, four questions before.
- **Words** (run): six facts have words of their own (2 × 7, 4 × 7, 6 × 7, 7 × 7, 7 × 8, 9 × 7; kept on a retry, after “Here’s that one
  again.”, `retryPrompt: true`); 7 × 5, 7 × 3, 10 × 7 and 7 × 1 are asked “How many dragonets?” (the set's `prompt`, the story's words).
  Their retries have no `retryPrompt`, so they are asked in the engine's own words, which give the clutches (run): “Here’s that one
  again. Five clutches. How many dragonets?” (7 × 5), “Here’s that one again. Three clutches. How many dragonets?”, “… Ten clutches. …”
  and “… One clutch. …”; the story builder's test pins all four. Right lines: the story's for seven facts (the six, and 7 × 5's “Thirty-five!
  You hopped that one already.”); 7 × 3, 10 × 7 and 7 × 1 get the fast lines when quick (“Quick as a pounce!” on 7 × 3, “You knew that one
  before I finished asking.” on 10 × 7; after any miss, “Ha! You didn’t even look at the sand that time.” leads) or the praise when slow
  (“Seven more, every time!”). **No two fast lines run** (the engine's `fastLast`): 10 × 7 and 7 × 1 come back to back, so a quick 7 × 1
  straight after a quick 10 × 7 gets the praise (run, quick everywhere: 7 × 3 “Quick as a pounce!”, 10 × 7 “You knew that one…”, 7 × 1
  “Seven more, every time!”). The order keeps both between 6 × 7 and 7 × 7, so this is recorded, not reordered, and pinned. 7 × 5 has its
  own right line, so it is timed but never praised; 35 is on screen a few screens before it (the five clutches' count, then the tree's
  “Thirty-five! Now, a secret”), so a quick 7 × 5 reads as known, kept as chapter 9's 8 × 5 was.
  **Only 7 × 7's right line plays on its retry** (`rightAgain: true`: “Here’s that one again. Seven clutches. Six sevens is forty-two. One
  more seven…” → “Forty-nine! The new one.”); every other right retry gets the engine's “There it is. You remembered that one.” (the
  story names 7 × 7 alone; section 9, call 8).
- **Picture** (section 4, Counts art): every question opens on that many clutches, seven little dragonets each (a row of four over a row
  of three), unlit, in tidy rows of five clutches, except the two step-offs: 6 × 7 opens with five clutches lit (`lit: 35`) and 7 × 7 with
  six (`lit: 42`), one clutch left to hop. A right answer lights every dragonet (the page's rule).
- **Help** (run, every single miss): Tallyheart scratches seven marks in the sand for every clutch, four and three with a gap (the sand
  at per 7, **new**), and hops them by sevens (7 · 14 · 21 …); “Close. Let’s hop it together.” within one hop (an answer up to seven off),
  else “Let’s hop it together.”; then the fact's way and “There. We’ll come back to that one.” (4 × 7, 6 × 7, 7 × 7, 7 × 8, 9 × 7 as
  written above), or just the last line. On a last miss, the way alone, or “There. Now you’ve seen it counted.” Never a wall; no clock.
  **7 × 8's way is chapter 9's `WAY56`, exactly**, as the story's note names it (“chapter 9’s way”): the note's extra opening
  sentence, “Twenty-eight and twenty-eight.”, would make the miss line 24 words, past the 22 that chapters 7 to 9's tests allow a
  miss, prompt or help opening (18 for any other Counts line: Lissa reads them herself); the prompt already says “Twenty-eight,
  doubled.” (section 7, item 2). With `MISS`, 21 words.
- **Fillers** (run, to four misses): near the end a retry's fillers are the lesson's own easiest she has answered right (`fillOrder:
  'easiest'` with no `fillFrom`, chapter 5's state.easiest), each asked “How many dragonets?” over its clutches: 7 × 1, then 2 × 7, then
  7 × 3 and 4 × 7 (a missed 9 × 7 lends 7 × 1 and 2 × 7; a second miss 7 × 3 and 4 × 7). 7 × 7 is never a filler before four misses (run:
  once, at four). The set borrows from none, so no `avoid`.
- **Giveaways** (the story's claim, run to four misses with every line said within three questions before each question): **after one
  miss of each of any two facts, no prompt, right line, help opening or way says a later question's answer**. The help's hop count is
  left out of the claim, and of its test: counting by sevens names every seven on the way, so with one miss of each of two facts the
  count says a pending retry's answer in 12 patterns (e.g. !7×7 7×8 !9×7: 7 · 14 … 63 says 49 one question before 7 × 7's retry; run in
  `critic-spec-counts/give2.js`), harmless and inherent to skip-count help. After two misses of one fact the
  story's three are there (6 × 7's prompt says 35 two questions before 7 × 5's last retry; 7 × 7's says 42 two before 6 × 7's; 9 × 7's
  says 70 just before 10 × 7's), and two more the run found: 4 × 7's help says fourteen two questions before 2 × 7's last retry (2 × 7
  missed twice and 4 × 7 once: !2×7 7×5 7×3 !2×7r !4×7 6×7 2×7r), and 7 × 8's prompt says twenty-eight just before 4 × 7 comes as a filler
  (7 × 8 missed twice and one more miss). Kept (section 7, item 7): by then the help has counted each twice.
- **Timing**: 7 × 5, 7 × 3, 10 × 7 and 7 × 1 are the lesson's facts timed on themselves (`E.readFirst`: no `prompt` of their own); every
  other is read under its own prompt; any miss counts. So after a slow, clean lesson `E.hardFacts(cat, 7)` is
  `[[7, 1], [10, 7], [7, 3], [7, 5]]` (run): these four are what the Hollow's and the Warrior Counts' tricky 7s can bring back from
  it. A miss of 7 × 8 here is an 8s and a 7s hard fact, as chapter 9's was.

### `ch10-ferry`, the Moon Ferry Counts (eight answers; Counts frame `intro: false`)

```js
'ch10-ferry': {
  table: 2, thing: 'leg', things: 'legs', teacher: 'tallyheart', ask: '{a} × {b}', ground: 'log',
  fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillIntro: 'One more!', avoid: [[2, 5]],
  facts: [
    { a: 8, b: 1, table: 1, prompt: 'Tails! Eight cats.', retryPrompt: true, right: [{ who: 'murmurchime', text: 'Eight!' }], rightAgain: true },
    { a: 5, b: 2, table: 2, prompt: 'Ears! Five cats.', retryPrompt: true, right: [{ who: 'snorer', text: 'Ten!' }], rightAgain: true },
    { a: 3, b: 10, table: 10, prompt: 'Both forepaws! Three cats.', retryPrompt: true,
      right: [{ who: 'riffle', text: 'Thirty! That’s a LOT of claws.' }], rightAgain: true },
    { a: 6, b: 3, table: 3, prompt: 'Patrols! Six patrols.', retryPrompt: true,
      right: [{ who: 'grizzled', text: 'Eighteen guards. I was one. Awake, mostly.' }], rightAgain: true },
    { a: 4, b: 6, table: 6, picture: { kind: 'cheeks' }, prompt: 'Whiskers! Four cheeks.', retryPrompt: true,
      right: [{ who: 'glintstar', text: 'Twenty-four. I remember that count.' }], rightAgain: true },
    { a: 9, b: 4, table: 4, prompt: 'Paws! Nine cats.', retryPrompt: true,
      right: [{ kind: 'caption', text: 'Thump! Granny bangs her pole.' }, { who: 'otter', variant: 3, text: 'Thirty-six!' }], rightAgain: true },
    { a: 6, b: 8, table: 8, prompt: 'Spiders’ legs! Six spiders.', retryPrompt: true,
      right: [{ who: 'thymeleaf', text: 'Forty-eight!' }, { kind: 'caption', text: 'From the luggage: a happy puff of mist.' }], rightAgain: true },
    Object.assign({ a: 7, b: 7, table: 7, picture: { kind: 'marks', ground: 'log' }, prompt: 'And the new one. Seven sevens!', retryPrompt: 'Seven sevens!',
      right: [T('Forty-nine!'), { kind: 'caption', text: 'The whole Moon Ferry cheers.' }], rightAgain: true }, way(WAY49))
  ],
  praise: [], helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: null
}
```

- **Every fact carries its own Count** (`table` on each fact: chapter 7's mixed lesson key), so each is drawn and hopped as that Count:
  run, the pictures handed to the art (`E.lessonPicture`): 8 × 1 eight cats' tails (table 1); 5 × 2 five cats' ears; 3 × 10 three cats'
  both forepaws; 6 × 3 six patrols; 4 × 6 four cheeks (`kind: 'cheeks'`); 9 × 4 nine cats' paws (table 4, nine cats in rows of five and
  four); 6 × 8 six spiders; 7 × 7 seven rows of seven marks on a log (`kind: 'marks'`, `ground: 'log'`, **new**: section 4). Each answer is
  logged under its own table (run: `8x1:1 5x2:(the set's 2) 3x10:10 6x3:3 4x6:6 9x4:4 6x8:8 7x7:7`), so the Hollow and the corner read
  each as its Count.
- **The set's `thing: 'leg'`** is what draws 6 × 8 as spiders (the spiders are keyed on `thing: 'leg'` at per 8, chapter 9's call 4; the
  engine hands the picture the set's `thing`, never a fact's). No other ferry picture reads `thing`: the tails, ears, forepaws, patrols,
  cheeks (its `kind`), the table-4 cats (one spider's two sides need a `who` of one spider) and the marks are drawn as their tables and
  kinds say (run). Every ferry question has words of its own, so the set's things are never said; a borrowed filler is worded by its
  lender (below).
- **The set's own table is the 2s** (`table: 2`, which only 5 × 2 of its eight shares): a borrowed filler carries no table, so it is
  grouped by the set's: 2 × 1 is “One cat. How many ears?” (with no table the set would ask “Two cats” there: the story's note; run).
- **Words** (run): Tallyheart calls each Count by name (each fact's `prompt`, hers, no other words), our cat answers, and a Clanmate cheers
  (each fact's `right`, its speaker's balloon, with the story's captions as caption lines: “Thump! Granny bangs her pole.” and “From the
  luggage: a happy puff of mist.” and “The whole Moon Ferry cheers.”). Granny's balloon is `{ who: 'otter', variant: 3 }`, labelled
  “Granny” by the chapter's `names` (section 5): a lesson line takes no variant from the frame's cast (the page passes the line's own
  `variant` to its face and its voice, and the engine keeps it, run), so without it her cheer would get the old ferry otter's face and
  pitch (variant 1, 0.68) instead of hers (`VARIANT_PITCH.otter[3]` 0.92); the story builder's test checks this balloon's face and pitch
  are variant 3's. **Every cheer plays on its retry too** (`rightAgain: true`), and every fact keeps its words for its retry
  (`retryPrompt: true`: “Here’s that one again. Paws! Nine cats.”), except **7 × 7, whose retry drops “And the new one.”**
  (`retryPrompt: 'Seven sevens!'`: “Here’s that one again. Seven sevens!”). The 7 × 7 cheer's “Forty-nine!” is Tallyheart's (the story
  leaves it unsaid whose; section 9, call 9).
- **Help** (run): the fact's own Count scratched on a log (`ground: 'log'`, chapter 5's raft help), hopped together in its table's
  steps: 8 × 1 one by one; 5 × 2 by twos; 3 × 10 two swipes a cat by tens (chapter 4's pairs); 6 × 3 by threes; 4 × 6 by sixes, three and
  three; 9 × 4 by fours, two and two; 6 × 8 by eights, four and four; 7 × 7 by sevens, four and three (**new on a log**: section 4). Then
  “There. We’ll come back to that one.”, and 7 × 7 its way first: “Six sevens is forty-two. One more seven: forty-nine. There. We’ll come
  back to that one.” On a last miss, “There. Now you’ve seen it counted.” (7 × 7: its way alone).
- **Fillers** (run, to four misses, every pattern): chapter 2's lesson's easy ears (`fillFrom: 'ch02-ears'`, its five easiest: 2 × 1,
  2 × 2, 3 × 2, 4 × 2, 2 × 5), less the ferry's own 5 × 2 (`avoid`, and `own`), in that order, in the lender's picture (ears: `fillVoice:
  'borrower'` keeps the lender's picture and things, the set's voice) and the ferry's words: “One more! One cat. How many ears?” (2 × 1),
  “One more! Two cats. How many ears?” (2 × 2), then three cats, then four. **With no cheer**: the set's `praise` is empty and it has no
  `fast`, so a right filler says nothing. Never one of the ferry's own pairs, never cheeks, spiders, marks or clutches (run: no own pair
  lent in 707 patterns).
- **How it ends** (run, `sim6.js`, every pattern to four misses, 707): 475 end on a cheer; 193 on a missed filler's retry (“There it is.
  You remembered that one.” or “Yes! That one came back, and you knew it.”: a filler's, as the story's note allows, “a right last answer is
  always cheered but a filler’s”); 39 on a last miss of a fact missed three times. Never a wall; no clock.

### `ch10-sixty`, the sixty (one question, at the case; Counts frame default intro)

```js
'ch10-sixty': {
  table: 10, thing: 'fish', things: 'fish', unit: 'night', units: 'nights', teacher: 'tallyheart', ask: '{a} × {b}',
  picture: { kind: 'marks' },
  facts: [{ a: 10, b: 6, prompt: [], retryPrompt: [{ who: 'player', text: 'And a dragon who eats ten fish a meal, for six nights?' }],
    right: [{ who: 'player', text: 'SIXTY!' }, { who: 'glintstar', text: 'A good count.' }], rightAgain: true }],
  help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
  fillFrom: 'ch04-tens', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
  praise: [], miss: MISS, missLast: LAST, done: null
}
```

- **Said, then typed**: the Counts frame's two balloons (Glintstar's, by `ch10PickBig`, and our cat's “Four a night, for six nights:
  twenty-four. And a dragon who eats ten fish a meal, for six nights?”) are said again over the question (the default intro: one or two
  balloons), and the fact's own prompt is empty (`prompt: []`: no more words), so the keypad page shows her question and `10 × 6 = ?`. Read
  under her own question, it is never timed (`E.readFirst`: a fact with its own `prompt`). Its retry: “Here’s that one again.” (Tallyheart)
  and her question again (`retryPrompt`: the story's "the sixty again with its own words"). The empty prompt is a first use: a sixty
  resumed mid-question (the page closed on it) has no intro to say, so it asks `10 × 6 = ?` over the six nights with no words (section
  7, item 17: known, kept).
- **Picture**: chapter 7's six nights of ten marks (`kind: 'marks'`, on the 10s), unlit. A miss (`help: 'picture'`, run) lights them a
  night at a time, 10 · 20 … 60, in Tallyheart's count (the story's whisper, “Ten, twenty…”, is the count itself: the help's opening has no
  numbers, since the set lends a one-night filler: chapter 9's filler rule), “Close. Let’s hop it together.” or “Let’s hop it together.”,
  then “There. We’ll come back to that one.”. Every one of these is Tallyheart's **ordinary balloon**, not a whisper (no Counts key
  carries `kind: 'whisper'`; section 7, item 2), so she is in the sixty frame's picture (section 5, "The case", item 5).
- **Fillers** (run): two easy tens from `ch04-tens`, the easiest first, each after “An easy one.”, in the sixty's own picture and words
  (`fillVoice` and `fillPicture: 'borrower'`, as `ch07-dragon`): “An easy one. One night. How many fish?” (1 × 10), then “An easy one. Two
  nights. How many fish?” (10 × 2); on a second miss 10 × 3, then 4 × 10. No cheer on a filler (`praise: []`).
- **Right**: “SIXTY!” (our cat's) and Glintstar's “A good count.”, kept on a retry. On every path (chapter 7's “Bring your count” paid off
  by name without `my-count`, which may be missing).
- **Puddle's riddle and the sixty both borrow `ch04-tens`** but are not siblings (`ch05-puddle` is chapter 5's set), so a cat who misses
  both meets 1 × 10 and 10 × 2 twice, first as bumps (“Do another one! One log. How many bumps?”), then as fish (section 7, item 8).
- **How it ends**: like the Moon Ferry, the sixty can end on a missed filler's retry: after “SIXTY!” / “A good count.”, “An easy one. One
  night. How many fish?” → “There it is. You remembered that one.” comes last, and Snatch's “Twenty-four?” follows (run: !10x6 !1x10f
  10x2f 10x6r 1x10r; section 7, item 9).

### `ch05-puddle`, the log riddle (optional; chapter 5's set, run as chapter 5 ran it)

- The Counts frame `{ set: 'ch05-puddle' }` in "Under the raft" (`E.checkStory` accepts another chapter's set, as chapter 9 ran
  `ch04-riddle`). Its balloon is only “Want a log riddle?” (Puddle's, default intro: said again over the question), and the riddle is the
  set's own prompt: “Four logs in this raft. I’ve bumped my head ten times on every one. How many bumps?” (run), so the story's balloon
  reaches her whole, once. Right: “FORTY!” / “No wonder it hurts.” (`rightAgain: true`); a miss: “Count my bumps! You hop!”, the bumps lit
  a log at a time in her count, “There! Let’s do that one again.”; fillers “Do another one! One log. How many bumps?” (1 × 10), then two
  logs; its retry “My bumps again! Four logs, ten bumps on every one. How many bumps?” (all chapter 5's, run). His book page keeps the
  riddle it has. His lesson lines are labelled by the chapter's `names` (“The big-footed dragon”, section 5): the riddle comes before “I’m
  Puddle.”.

### The taps that count (skip and ask)

- **Five clutches in the sand** (“In the sand, Tallyheart scratches five clutches of little dragonets, seven in each.” / “Hop by
  sevens,” she says.): `skip: { table: 7, groups: 5, thing: 'dragonet', things: 'dragonets', teacher: 'tallyheart', label: 'Count the next
  clutch.', prompt: '**Tap** the clutches.', carry: false, next }`. Five clutches, the next glowing; each tap lights its seven, a row of
  four and a row of three, its running total under it and a big number over the picture, Tallyheart's count “7… 14… 21… 28… 35!”. The fifth
  tap turns the page; `carry: false`: the page it turns to is the tree's ask, whose balloon says “Thirty-five!”. The picture is the
  lesson's clutches (the counting picture; the caption carries the scratching: chapter 9's spiders).
- **The tree** (“Thirty-five! Now, a secret,” … “One from every mark on this tree.” / “ALL of them?”): `ask: { who: 'tallyheart', to:
  'player', prompt: '**Tap** Tallyheart to find out.', label: 'Say the sevens with her.', pairs: [['Say them with me. Seven…', 'Fourteen,
  twenty-one, twenty-eight, thirty-five, forty-two… um… fifty-six, sixty-three, seventy!']], next }`: chapter 9's tree Tap made one pair,
  on `hollow`/`wide` with `{ marks: 9, glow: 'auto' }`, Tallyheart at `tree-far` with `glow: true`, our cat at `sunpatch-2`, **nobody on
  the rim**. The frame's own `say` holds the two balloons before it. Next after the one tap (an `ask` never turns the page on its last
  pair). Nothing goes in the sand; 49 is never said or drawn.
- **Four paws aboard** (a water-worry cat only): `skip: { table: 1, groups: 4, paws: 'board', teacher: 'tallyheart', carry: false,
  prompt: '**Tap** each paw onto the raft.', next }`, chapter 5's own: her four paws at the raft's edge, the next glowing; each tap sets
  one down and Tallyheart counts it in words, “One.” “Two.” “Three.” “Four.” (`E.skipView`'s words). Every other cat steps aboard with
  one tap (section 5).
- **The confession** (“And then it ALL tumbles out.”): `ask: { who: 'snatch', to: 'snip', prompt: '**Tap** the weasels.', label: 'Hear the
  next bit.', pairs: [['Two each, every night, he said!', 'Up the TUNNEL!'], ['Keep it TIDY!', 'Leave the shiny bit by the pile!'],
  ['Then the dragon’s dry den is HIS!', 'And WE can’t even COUNT!']], next }`: an `ask` letters two lines a tap, so the story's six
  balloons, Snatch and Snip by turns, are three taps of two, Snatch first (he started it: “It was HER idea!”), and Next after the third
  (section 7, item 2: the note's "six taps, the sixth turns the page" cannot be). Snatch glows (`glow: true`).
- **The roll call** (“Forepaws UP,” says Mama.): `skip: { table: 5, groups: 7, teacher: 'mistscale', thing: 'claw', things: 'claws',
  label: 'Count the next forepaw.', prompt: '**Tap** each forepaw.', carry: false, who: ROLL, next }`, where `ROLL` is Sprinkle and, for
  each of the six in the story's order, two entries by its found flag:
  `[{ who: 'sprinkle' }, { who: 'squall', when: { foundSquall: true } }, { who: 'squall', shape: true, when: { foundSquall: false } }, …,
  { who: 'mizzle', when: { foundMizzle: true } }, { who: 'mizzle', shape: true, when: { foundMizzle: false } }]`. `E.skipFor` keeps the
  seven that match her (`groups: 7` always): the found ones' forepaws in the moonlight, each dragonet small behind its own raised forepaw,
  the others as soft grey shapes in the mist behind misty forepaws (`shape: true`, **new**: section 4). Each tap lights one forepaw's five
  claws, Mama's count “5… 10… 15… 20… 25… 30… 35!”; the seventh tap turns the page to “Thirty-five,” says Mama. `carry: false` (Mama says
  the number). Mama keeps the count (`teacher: 'mistscale'`, her balloon labelled “Mama” by her variant: section 5).

## 3. The Case File

**No new card.** Chapter 5's `puddle-paws` is given again, by "Under the raft", to a cat who meets Puddle here.

| id | Mark | Line as lettered | Given | To whom | Links |
|---|---|---|---|---|---|
| `puddle-paws` (chapter 5's) | ear | Puddle says clever little paws picked up mice on the storm night. | the panel of his “On the storm night, in a flash, I saw something with clever little paws, picking up mice. Very tidy.” (`card: 'puddle-paws'`; his balloon does not say the line, so it is lettered) | a cat who reads "Under the raft" (its definition's `when: { foundPuddle: true }`: shown from the frame that gives it, as `squall-shapes` in chapter 9) | none (as in chapter 5) |

- Its record says chapter 10 (`E.giveCard`'s `chapter`); its picture and line are chapter 5's. It lies **along the mossy edge** (not
  `BARK_SECRET`, which goes by picture: adding it would move the bark of every chapter-5 Puddle cat in chapters 5 to 9). **Known**: a cat
  may already hold a `puddle-paws` record from chapter 5 without `foundPuddle` (the card is given at f064a, and she can go Back out of
  the scene before f065a sets the flag); the card stays hidden (its `when`) until chapter 10 sets `foundPuddle`, `E.giveCard` then
  returns false, and the record keeps `chapter: 'ch05'` and its place among chapter 5's cards, so her file's and her bark's order (and a
  pick's glow order) are chapter 5's for her. Its line and picture are the same, and nothing else changes; the story builder's test
  covers this order.
- She holds **20 to 30 cards** at the Gathering (sim5: the thinnest file 20, with no `my-count`; the fullest 29 on a straight reading: a
  noticing cat with every dragonet and Mizzle; **30 only by a reread**: a noticing cat who gets `dug-earth` (chapter 4) and `prints-pile`
  (chapter 5's f005), leaves chapter 5 after f005, rereads chapter 1 to become a climber and gets `prints-tracks` at f093, with every
  dragonet and Mizzle: `critic-pick-r1/fullest2.js`; a cat who meets Puddle here holds one more than she did, or the same with chapter
  5's record, never past 30). Eight to
  eleven under the moss, as after chapter 9. The den draws a 30-card file as chapter 9 draws it; the nest owner's fingerprints run to
  30 (section 7, item 3), and the ship's look takes the pick screen on a 30-card file (`#pickfull`, section 6).
- **Her file at the Gathering**, in her file's order (section 6: the groups first, then the linked rows; run, `sim5.js` and
  `critic-cardpick-r1/rows.js` over every straight reading, 30,720 ends and 10,240 more with Puddle found here, `E.caseFile`):
  "What I saw myself" (five to seven: `four-a-night`, `sprinkle-scales`, `fur`, `my-count`, `prints-sprinkle`, `prints-marsh` unless
  linked, a noticing cat's `dug-earth`, a climber's `prints-tracks` unless linked, that is without Squall: six or seven on a straight
  reading, five only on a reread that drops `my-count`), then "What I was told" (one to six: `otter-fox`, `heron-shapes` unless linked,
  that is without Squall, and the dragonets' ears, `puddle-paws`, `wisp-fox`, `mizzle-wing`, `hail-shapes`); then the linked rows: every
  cat's `cant-fly` — `fox-flew` — `fox-brag` (— `sleet-den`), `waffles-no-moon` — `fox-moon` — `heron-no-moon`, `tidy` — `reed-pile` —
  `stash`, `coil-diggers` — `tunnel`, `scale` — `glass`; and chapter 5's where she holds them (`squall-shapes` — `heron-shapes`;
  `prints-pile` — `prints-marsh`; a climber's `prints-tracks` — `squall-shapes` — `heron-shapes`). This is what the card pick shows
  (section 6).
- **What answers what is the picks' data** (section 6), never the cards' `answers`: chapter 4's `fox-flew` keeps the only `answers`
  (`cant-fly`), stored and still unread (section 9, call 3). **The twenty cards every cat holds** (continuity's table; sim5's
  thinnest file, and every path of `critic-pick-r1/walk.js` and `flips.js`): `cant-fly`, `fox-flew`, `fox-brag`, `waffles-no-moon`,
  `fox-moon`, `heron-no-moon`, `tidy`, `reed-pile`, `stash`, `coil-diggers`, `tunnel`, `scale`, `glass`, `four-a-night`,
  `sprinkle-scales`, `fur`, `prints-marsh`, `prints-sprinkle`, `otter-fox`, `heron-shapes` (the storyboard tool's constant, section 6).
  Each claim's right cards among them: FLEW `cant-fly`, `fox-brag`; MOON `waffles-no-moon`, `heron-no-moon`; SCALE `glass`, `scale`, `sprinkle-scales`;
  BIG `prints-sprinkle`, `stash`, `tunnel`, `coil-diggers`, `heron-shapes`, `prints-marsh`, `fur`, `four-a-night`; OUT `fox-brag`,
  `tunnel`, `coil-diggers`, `stash`, `heron-shapes` (run). Nothing needs `my-count`, `mizzle-wing` or an optional card; `sleet-den` is
  right for no claim (its line says only that he talks of a dry den).
- Not cards, on purpose: the sevens, the Moon Ferry, the luggage, Puddle's “FIVE”, the picks themselves, the sixty said again, the
  confession, the chase, the mist, the roll call, the mist stone (a gift in her nest: section 6), Glintstar's honour, the badger's track.

## 4. Art needs

Two new places (the brief: Gathering Island and the Moon Ferry, two build windows) and the new cast the brief names. **New** marks what
the art must add; every option is off by default and every camera and anchor additional, so chapters 1 to 9 draw byte-identically for
every live save (section 7, item 3: the proof). **Never dark**: the Moon Ferry's river and the island are moonlit, bright silver and
silver-blue (the README rule of 2026-10-12, the brief). Times of day: `morning` in the den and the Hollow; `dusk` at the Moon Ferry's
boarding; `night` everywhere after (the full moon, `moon: 14`, wherever the sky shows). **Depth**: there is no depth rule in the art
(the hotfix reorders casts and adds none: `drawCast` paints each z layer in cast order), so the story builder lists every crowded cast
back to front, far cats first, as chapter 4's border frames do and as the hotfix did for chapters 6 to 8: where two cats in the same
z layer meet (the farther cat's body over the nearer cat's head), the farther is listed first, and the story test checks it (section 5).
The sets' set-drawn crowds are drawn behind the cast. The leaders' roots sit behind their Clans' spots (`island`, `wide`, below), so
this rule and the leader-first rule for balloons (section 5, "Speakers") never disagree.

### Places

| Set (file) | What the chapter uses | New |
|---|---|---|
| **`ferry`** (new: `sets/ferry.js`) | the Moon Ferry: the otters' line of rafts at the Crossing at dusk, aboard by moonlight, under the raft, upriver and home | **The whole set** (below) |
| **`island`** (new: `sets/island.js`) | Gathering Island: the shore, the clearing under the great tree, the leaders' roots, the case, the mist and the Mistscales, the sky, her paws with the stone | **The whole set** (below) |
| `den` (`scenes.js`) | morning: `inside` (Tallyheart's head at `doorway`, as chapter 4's f002) and `nest`; night: `outside` (the old tom and {Murmur}chime, “In camp:”), `nest`, `inside`, `doorway`, and the close on the stone | **`moon: 14`**, **option `miststone`**, **camera `stone`** (below) |
| `hollow` (`scenes.js`) | `morning`, **nobody on the rim** (no `rim()` on any frame): `wide` (Tallyheart at `tree-far`, our cat at `sunpatch-2`), `lesson`, `sand`, `tree`; `{ marks: 9, glow: 'auto' }` until SKRITCH, `{ marks: 10, glow: 'auto' }` after | nothing: `marks: 10` draws as `markSpots` lays ten (four, four and two; never drawn by a shipped frame): check it reads at `tree` and `wide`, and that the tree close-up (empty, as chapters 6 to 9's) shows the tenth |
| `riverbank` (`sets/riverbank.js`) | the walk home by night: `path` (“Past the Old Bridge, on the walk home…”) and `roof` (the last roar) | **Options `moon` and `flyer`** (below) |
| `tower` (`scenes.js`) | Waffles on her balcony by night: `up`, our cat at `foot`, Waffles at `railing` | **The tower by `night`** (never drawn), **option `moon`** (below) |

#### The new set, `ferry` (`app/art/sets/ferry.js`)

`PC.art.defineSet('ferry', { label: 'the otters’ Moon Ferry: a line of log rafts on the moonlit river', tod: 'night', … })`, drawn with
`PC.art.kit` in the 1600 × 1000 world: **the otters' long line of rafts**, logs lashed with reeds, the front raft (the ferry itself)
biggest and nearest, more rafts tied behind it in a line; the river **silver-blue under the full moon, bright and clear, never black**:
moonlight on every ripple, the far banks dark green but lit, the glass towers far off downriver. Drawn at `dusk` (the boarding at the
Crossing: rose and lilac light, the moon just up, round, over the water) and at `night` (everything after). The raft is never damaged and
never tips; nothing in the water is dark under a cat (chapter 5's rule). **No otter is drawn by the set**: every otter is cast.

| Camera | Composition | Anchors | Options |
|---|---|---|---|
| `shore` | the Crossing's edge at dusk: the flat stones and pebbles of chapter 2's Crossing at the left, the line of rafts tied along the bank, the front raft's near end at the stones' edge, the rafts behind it going off upriver; the full moon rising | `bank-1`, `bank-2`, `bank-3` (on the stones, walking down to the rafts, facing right), `edge` (at the stones' edge by the front raft: a cat about to step aboard), `log-1`, `log-2` (on the front raft's near logs: Riffle, a cat just aboard), `pole` (standing at the front raft's far end with a long pole: Granny) | `moon`, `clan` |
| `deck` | aboard the front raft, from its back end looking forward, upriver: the logs running away from us, the Clan seated along both sides, the front end and the poler against the moonlit river, the full moon ahead and high | `seat-1` … `seat-6` (seated along the logs, three a side, the near ones bigger), `front` (our cat, mid-raft at the left, facing right), `beside` (beside `front`: Tallyheart), `pole` (standing at the front end with her pole: Granny), `back` (at the near right corner, beside the luggage: Riffle) | `moon`, `clan`, `luggage` |
| `back` | close on the very back of the front raft: **the heap of reeds** (the luggage) taking the right half, its reeds loose and green-gold in the moonlight, a cat's height and more; the river behind | `heap` (beside the heap: Riffle), `back-1`, `back-2`, `back-3` (Tallyheart, Glintstar, Granny at the left, facing right) | `moon`, `luggage`, `puff` |
| `low` | at cat height on the front raft's logs, close, the raft **riding low**: the water lapping right at the logs' tops, silver rings, and between two logs a gap of silver water | `gap` (in the water between two logs: Puddle's foot, or nothing; `{ air: true }`: no ground shadow, the set draws its rings), `lie` (lying flat on the logs at the gap's edge, chin over it: our cat peeking), `sit-1`, `sit-2`, `sit-3` (on the logs beside the gap: our cat, Riffle, Tallyheart; three, since all three sit on Puddle's last screen and the low raft's panels) | `moon`, `low` |
| `under` | looking straight down into the gap between two logs: the silver water filling the panel, the logs' wet tops at the edges, the moon's reflection; **never dark**: a cat's face reflected at the top edge | `water` (in the water, centre: Puddle `eyes`, `head`, `log`, `pawup`, `foot`; `{ air: true }`), `lip` (at the top edge, looking down: our cat's head and forepaws, the rest cut by the edge, as `grove`'s `lip`; `{ elev: true }`, as grove's, so it never skews the camera's depth scale) | `moon` |
| `river` | wide: the Moon Ferry gliding upriver under the full moon, the front raft with its poler and its small seated cats, the line of rafts behind; later the same raft bumping home at the Crossing's stones | `raft-1`, `raft-2` (small cats on the front raft), `pole` (Granny, small) | `moon`, `clan`, `luggage`, `home` |

Options (every one off by default): **`moon`** (a number: 14, the full moon, round, wherever the sky or its reflection shows); **`clan:
true`** (the rest of CrystalClan seated along the logs of the front raft and the rafts behind, drawn by the set as small seated Clan
cats in their coats, through the kit's crowd helper (`K.crowd`, below), keeping clear of the frame's cast); **`luggage: true`** (the
heap of reeds at the back of the front raft, round and lumpy, nothing of Sprinkle showing); **`puff: true`** (a little cloud of mist
puffing out of the heap: `back`); **`low: true`** (the front raft riding low: `low`; the water at the logs' tops, never over them);
**`home: true`** (`river`: the raft at the Crossing's stones, bumping in, the moon high: “as the Moon Ferry bumps home”). Declared:
`opts: { moon: 'number', clan: [false, true], luggage: [false, true], puff: [false, true], low: [false, true], home: [false, true] }`.

#### The new set, `island` (`app/art/sets/island.js`)

`PC.art.defineSet('island', { label: 'Gathering Island: the clearing under the great tree', tod: 'night', … })`, always at night under
**the full moon, high, bright silver, never dark**: a round island in the river, its shore of pebbles and mud, and in the middle one
**great tree** (very old, wide-crowned, never named), its huge roots running out across a clearing of short moonlit grass. **The three
leaders sit on three big roots**, never in the branches (the README's echo note). The crowd of every Clan sits round the clearing.
Nothing is frightening: the mist is soft and silver with the moon glowing through it; the grown Mistscales are gentle shapes in it.

| Camera | Composition | Anchors | Options |
|---|---|---|---|
| `shore` | the island's shore: pebbles and soft mud at the water's edge, the river silver behind; up the slope, the great tree's crown and the clearing's edge | `land-1`, `land-2`, `land-3` (stepping off onto the shore, facing right, up the slope), `raft` (at the Moon Ferry's front, in the water's edge: Granny), `drag` (on the mud beside the luggage: Riffle dragging), `print` (on the mud beside the print: her paw lands there; `crouch` to sniff) | `ferry`, `luggage`, `print`, `tap` |
| `wide` | the clearing under the great tree, every Clan: the trunk at the middle back, its three big roots running out, a leader on each; the crowd in a wide ring (CrystalClan at the left, ReedClan's marsh coats at the right, GroveClan's dappled coats at the back), the river at the far right edge where the fox comes up | `root-1`, `root-2`, `root-3` (on the three roots, left to right: ReedClan's leader, Glintstar in the middle, GroveClan's leader; sitting up, a little bigger), `crowd-1` … `crowd-6` (named cats at the front of the ring: the left three CrystalClan's, the right three for Sloshbank, the ReedClan she-cat and the young tom), `elder` (GroveClan's elder, at the back left of the ring, still in front of the roots: "Depth on `wide`", below), `centre` (the middle of the clearing: our cat), `beside` (beside `centre`: Sprinkle, or Tallyheart), `edge`, `edge-2`, `edge-3` (at the clearing's river edge, right: Reynard, Snip, Snatch; `edge` is Glintstar's once the foxes have gone, facing left to Sprinkle), `bank` (at the river edge, right, in front of `edge`, by the water: Granny), `luggage` (at the clearing's left edge: the reed heap) | `crowd`, `luggage`, `mist`, `tap`, `bubbles` |
| `roots` | closer on the great tree's three roots: the leaders sitting up on them, the trunk's bark behind, moonlight through the crown | `root-1`, `root-2`, `root-3` (as on `wide`), `step` (below `root-2`, where a cat called up to the tree stands), `near-1`, `near-2` (beside `step`: Tallyheart, Thymeleaf) | `crowd`, `mist` |
| `case` | at cat height in the clearing: our cat a little left of centre in the moonlight, the crowd's front behind, and across the grass at the right the clearing's river edge | `speak` (our cat, facing right), `beside` (at her right, between her and the fox: Sprinkle, or a dragonet saying goodbye), `mentor` (behind her at the left: Tallyheart), `root` (on a low root of the great tree behind her: a climber up where every Clan can see her; `{ elev: true }`), `fox`, `weasel-1`, `weasel-2` (at the river edge, right, facing left), `front-1` … `front-4` (named cats at the crowd's front behind her, whoever speaks or is named on the panel: Sloshbank, the ReedClan she-cat and the young tom, the old tom, Thymeleaf, Riffle, the elder) | `crowd`, `mist`, `small`, `drawing`, `tap` |
| `fox` | close on Reynard at the clearing's edge with the river behind him, Snip and Snatch at his heels; in the water at the right, the way off the island | `fox` (Reynard, facing left), `weasel-1`, `weasel-2` (behind him), `water`, `water-2`, `water-3` (in the river, swimming away: Reynard and the weasels; `{ air: true }`, no ground shadow: their bodies are in the water) | `crowd`, `mist` |
| `mist` | the clearing's edge by the great tree with the mist rolling in off the river: the trunk at the left, the mist a soft silver bank filling the right half, the moon glowing through it; **Mama's great face** leans out of the mist here, the rest of her in the mist behind the tree | `mama` (her face and neck, out of the mist at the right, the anchor's height her face's height: about two cats tall; `{ elev: true }`, so her height never skews the camera's depth scale), `eldest` (the eldest's face, lower and further right, bowing to the grass; `{ elev: true }`), `nose` (on the grass under Mama's lowered nose: Sprinkle, nuzzled), `beside` (on the grass beside our cat, facing the mist: Sprinkle before Mama comes), `speak`, `mentor`, `front-1`, `front-2` (our cat, Tallyheart, friends at the left, facing right) | `mist`, `tail`, `grown`, `small`, `tap` |
| `sky` | looking up past the great tree's crown: the full moon, the sky, the mist's top edge; for the flight and the leaving | `fly` (in the air over the clearing: Sprinkle flying round the tree), `nose` (high at the right, beside Mama's face in the mist), `far` (far up the river, small); all three `{ elev: true, air: true }` (in the air: no ground under them, no shadow) | `mist`, `grown`, `rising`, `zip` |
| `paws` | close on our cat's forepaws held out in the moonlight, on the grass, with room above for Sprinkle's head and claws | `close` (our cat, sitting, her forepaws and chest filling the lower panel), `above` (Sprinkle `lookdown`, leaning down from the top right, her claws holding the pebble at the bottom of her box; `{ elev: true }`) | `tap` |

Options (every one off by default; **no `moon`**: the island is always under the full moon, and the story builder writes none);
**`crowd: true`** (every Clan in the ring: small seated cats in the coats
of their Clans, through the kit's crowd helper, keeping clear of the cast; on `wide`, `roots`, `case`, `fox`), its seats only anonymous
coats, never a named cat's: CrystalClan's `clancat` (`CROWD_COATS`), ReedClan's `reedclan` 3 and 4 (“A ReedClan cat”), GroveClan's new
crowd coats `groveclan` 4 and 5 (below: the elder, the apprentice and the leader are 1 to 3), and a few otters, `otter` 1 and 2 (Granny
is 3); **`crowd: 'standing'`** (`wide`, `fox`: the same seats with every cat and otter standing, `stand`, for “Every cat on the island
stands up, and every otter too.” and the panels after it while the foxes are there); **`luggage: 'none' | 'heap' | 'open'`** (the reed heap,
round and lumpy; `'open'`: the reeds pulled off, lying in a pile); **`ferry: true`** (`shore`: the Moon Ferry's front raft at the water's
edge); **`print: true`** (`shore`: **the badger's old track** in the mud, one big print, a wide pad and five toes in a row, long digging
claw marks, old and dry at its edges, in bright moonlight; never fresh, never with the animal); **`mist: 'none' | 'rolling' | 'thick'`**
(the mist coming up the river: `rolling` a low silver bank over the water and the clearing's edge, `thick` round the great tree too, the
moon always glowing through it, everything silver, never grey-dark); **`tail: true`** (`mist`: the tip of a huge, soft grey tail curling
through the mist: the mist Tap's response); **`grown: true`** (`mist`, `sky`: the other grown Mistscales as great soft grey shapes in the
mist, gentle, no faces, no teeth or claws); **`small: 'none' | 'one' | 'some' | 'coming'`** (`case`, `mist`: small dragonet shapes in
the mist, grey and soft, faceless: `one` one shape, `some` three or four, `coming` small shapes stepping out of the mist toward her, still
misty: “the dragonets you found come to stand beside you”); **`rising: true`** (`sky`: the Mistscales rising into the mist and away
upriver, great soft shapes going up, a small one with them); **`zip: true`** (`sky`: one small winged shape zipping off the other way,
toward the towers far downriver, a little ring of hiccup mist behind it); **`drawing: 'none' | 'cat'`** (`case`: a little cat scratched in
the earth in front of `beside`, four legs, two ears and a tail: Wisp's); **`bubbles: true`** (`wide`: little bubbles rising over the otters
in the crowd: “It sounds like bubbles.”); **`tap: 'none' | 'reeds' | 'mist' | 'print'`** (unpainted `<rect class="pc-tap"
data-tap="…">` boxes: `reeds` on the luggage heap, on `wide`; `mist` on the mist bank, on `mist`; `print` on the badger print, on
`shore`). Declared: `opts: { crowd: [false, true, 'standing'], luggage: ['none', 'heap', 'open'], ferry: [false, true], print: [false, true], mist:
['none', 'rolling', 'thick'], tail: [false, true], grown: [false, true], small: ['none', 'one', 'some', 'coming'], rising: [false,
true], zip: [false, true], drawing: ['none', 'cat'], bubbles: [false, true], tap: ['none', 'reeds', 'mist', 'print'] }`.

- **Depth on `wide`** (the places owner's): `root-1`, `root-2` and `root-3` lie further up the panel (a smaller `y`) than every
  `crowd-1` … `crowd-6` and the `elder` spot. A leader is then always the farther of two cats of the same Clan on the camera, so back
  to front (above) lists the leader first, exactly as section 5's leader-first rule needs (the ReedClan she-cat and the young tom at
  `crowd-5`, `crowd-6` below ReedClan's leader at `root-1`; the elder below GroveClan's leader at `root-3`). The set's test pins it.
- **Shadows**: the island draws soft moon shadows under cats on the grass (the cast's own, from `scenes.js`); nothing under `fox`'s water
  anchors (`air: true`), Mama or the eldest (in the mist: a no-shadow rule of her own in `scenes.js`, below). On the Moon Ferry
  nothing dark is drawn under Puddle in the
  water in any pose, `eyes` included (`IN_WATER.puddle.eyes`, below), and `gap` and `water` are `air: true` besides.
- **The mist over the cast** (`mist: 'thick'` on `mist` and `sky`): a thin veil in the `over` layer at the panel's right only, never over
  a face at `speak`, `mentor`, `nose` or `mama`.

#### The den: `moon: 14`, the mist stone, the stone close-up (`scenes.js`)

- **`moon: 14`** (the den's `moon` list gains 14: `[false, true, 5, 8, 13, 14]`): the full moon, round (the art's clock, `moonT(14)`), at
  night, from outside and in the doorway's patch of sky (`denMoonAged` takes any age from 8). For “In camp:” (`outside`), bedtime
  (`inside`, `doorway`) and the last panels.
- **Option `miststone: false | true | 'flash'`** (`nest`, `doorway`, `stone`; default false): **the mist stone** on the moss of her nest,
  beside her glass in its leaf and the corners of her secret bark: a smooth grey pebble, egg-shaped, the size of her paw; with `'flash'`
  it **flashes blue and green** in the moonlight from the doorway (labradorite's flash: a band of blue and green light across its face,
  the rest still grey). Off, every den frame draws as it does.
- **Camera `stone`** (`comp` of its own, **new**): extreme close on the moss at her nest's edge in the moonlight from the doorway: the mist
  stone big in the middle (`miststone: 'flash'`), the corner of a curl of bark, her glass's leaf, the tip of her sleeping tail; no anchor
  but `tail` (her curled tail's tip at the panel's bottom edge, a cast member there in `curl`, `asleep: true`). The chapter's last panel.
- Bark and secrets as chapter 9 left them (no new secret; up to 30 cards, section 3; `glass: true`, `hidden: true` at bedtime).

#### The kit's crowd helper (`scenes.js`, for the two new sets)

**`PC.art.kit.crowd(S, seats, k0)`** (**new**, the nest owner's): the camp's `crowdCats` (the Warrior Counts' crowd round the fountain),
given its seats by the set: `seats` a list of `[x, y, facing, pose, size, who, variant]` in world units, the camp's seats with two
optional places more (`who` `'clancat'`, `'reedclan'`, `'groveclan'` or `'otter'`, `variant` its coat; without them a `clancat` in the
camp's coats, `CROWD_COATS`, as today), `k0` the index its coats and moods start from; it draws seated, sitting-up or standing cats (and
otters) in their Clans' coats, as each seat's pose says (`stand` for the island's `crowd: 'standing'`), small, tinted for the hour
(`castTint`), each left out where it would cut through the frame's own cast (`castZones`), each marked `data-crowd="cat"` with its
box, and returns the SVG for the set's `back` layer. **New**: a seat that carries an explicit `who` and `variant` is left out when a
member of the frame's cast has the same `who` and `variant` (no cat is in the picture twice). This is not the camp's `taken`, which
`crowdCats` passes to cats.js's `clanVariant`: that only swaps a Clan seat whose coat is the player's fur to a spare coat no other Clan
cat in the picture wears, and never drops a seat. Seats without `who` and `variant` (the camp's crowd, the Warrior Counts' crowd round
the fountain, the ferry's CrystalClan) keep today's `CROWD_COATS` with `taken` passed to `clanVariant`, so the camp's crowd and the
Warrior Counts' crowd draw byte for byte (they call the same code with their own seats): the nest owner's fingerprints prove both
(section 7, item 3). Until it lands, the sets call it guarded (`K.crowd ? K.crowd(…) : ''`), so the places
owner and the nest owner build side by side.

#### The tower by night (`scenes.js`)

**`night`** on `up` (never drawn): the glass tower dark blue against a starry sky, many windows lit warm gold, the balcony nineteen floors
up lit by its window, the red light on the tallest tower beside; **option `moon`** (a number: 14, the full moon high over the towers).
Waffles at `railing`, our cat at `foot`. Chapters 1 to 9's tower frames (dusk, sunset, morning, day) draw as they do.

#### The riverbank by night: the walk home (`sets/riverbank.js`)

- **Option `moon`** (a number: 14; `path` and `roof`): the full moon over the towers, and under it **the river silver**, moonlight on its
  ripples, never the black water of chapter 3's night (the moonlit night is a light of its own: with `moon` set the night's water is
  silver-blue); the path pale in the moonlight.
- **Option `flyer: true`** (`roof`): a small winged shape flying off upriver across the sky by the red light, slate-dark, wings out, a
  tiny ring of hiccup mist behind it (“Then a small shape flies off upriver.”). With `roar: true` (chapter 2's) the roar's lines come
  from the roof first.
- Chapters 2 to 9's riverbank frames draw as they do.

### New cast (`app/art/cats.js`; their scene rules in `scenes.js`)

- **The grown Mistscales** (`mistscale`, **new**): huge, gentle, misty, never frightening (the brief; world.md's grown Mistscales, huge:
  her face in the clearing, the rest of her in the mist). **Drawn as a great head and neck leaning out of mist**: the neck curving back
  into soft mist at the drawing's edge, the body never drawn (the mist is the island's); mist-grey scales like Sprinkle's but larger and
  softer, ridges like rounded hills, **big, kind eyes**, mouths shut, **no teeth, no claws shown**, two soft horns. **Variant 1, Mama**:
  grey as a rain cloud, Sprinkle's colour grown; **variant 2, the eldest**: grey and weathered, a paler muzzle, a few lichen-pale spots,
  heavy-lidded old eyes, as big as Mama, **never silver-white** (Sleet is the clutch's eldest, and silver-white). Poses: **`lean`** (the
  face leaning out of the mist, eyes kind: what an unknown pose draws), **`nuzzle`** (head lowered, nose down to a small dragonet's
  height, eyes half shut), **`lift`** (the great head lifted high, mouth a little open in a call, no teeth: “ROLL CALL!”), **`bow`** (the
  eldest: the head bowed all the way down to the grass, eyes closed, the neck a long curve). Every mood drawn her way (`kind` her resting
  face; never `stern`, `scared` or `laugh`). In `scenes.js`: **no shadow under her in any pose** (her body is in the mist), not
  `BIG`'s size cap: her anchor gives her face's height (the scene rule, below).
- **ReedClan's leader** (`reedclan`, **variant 5**, **new**): a big, broad, grand cat in a marsh coat of its own (deep brown with
  reed-dark stripes, a pale grey chest, a notch in one ear, wise amber eyes), sitting up on a root; every cat pose and mood. Labelled
  “ReedClan’s leader”.
- **GroveClan's leader** (`groveclan`, **variant 3**, **new**): tall and lean, a dappled woodland coat (grey-brown dapples like the elder's,
  darker, with a white chest and white forepaws), long whiskers, calm green eyes; every cat pose and mood. Labelled “GroveClan’s leader”.
  Plainly unlike every player's cat, CrystalClan's and ReedClan's cats, and the elder.
- **Two GroveClan crowd coats** (`groveclan`, **variants 4 and 5**, **new**): anonymous GroveClan cats for the island's crowd (`K.crowd`'s
  seats; ReedClan's 3 and 4 are its anonymous coats already): woodland dapples of their own, one light grey-brown, one ginger-brown,
  plainly unlike the elder (1), the apprentice (2) and the leader (3); every cat pose and mood; no story balloon (labelled by
  `NAMES.groveclan`, “A GroveClan cat”, should one ever speak). In `vocab.variants.groveclan` and the storyboard's words.
- **Granny** is no new drawing: **chapter 5's otter variant 3** (labelled “An otter” there; it never speaks in chapter 5, and variant 2 is
  chapter 5's gossiping “he”: the story's call), labelled “Granny” through this chapter's `names`. `holds: 'pole'` (chapter 5's otter pole,
  on `otter` as on `riffle`: check it draws on `otter` standing, held upright). Her wink is the board's (no art draws a wink: `kind`).

### The cast from before, new poses and extras

- **Puddle: new pose `eyes`**: only his two big round eyes and the top of his head above the silver water, a ring of ripples round them
  (“Two big eyes look up at you, out of the silver water.”); laid on the waterline at the bottom of his box, as his other water poses.
  His `foot`, `head`, `log`, `pawup` and `sit` as they are.
- **The dragonets' goodbyes: `tap: 'nose'`** on `squall`, `puddle`, `wisp`, `sleet`, `hail` and `mizzle` (**new** on them): an unpainted
  `<rect class="pc-tap pc-tap-nose">` over the snout, in any pose that shows it, for “**Tap** to say goodbye.”
- **Reynard: new poses `bow`** (a low sweeping bow, one forepaw forward, his tail flourished up behind: charming, vain) **and `swim`**
  (only his head and the line of his back above the water, ears flat, his tail floating behind, paddling away: no splash at anyone);
  **Snip and Snatch: new poses `swim`** (heads up, paddling after him) **and `hidepaws`** (standing up, forepaws hidden behind their
  backs, eyes wide and innocent: “Snip and Snatch quickly hide their tiny paws behind their backs.”). **New extra `wet: true`** on
  `reynard`, `snip`, `snatch`: a little darker, the fur flattened and spiky at its edges, two or three drips falling (“A rather DAMP fox.”,
  “Snip and Snatch drip along behind him.”). Reynard never shows his teeth, never snarls or lunges, never comes toward her or Sprinkle; his
  “THERE!” points with his nose (`think`), from where he stands. Snatch's `holds: 'mouse'` (chapter 8's) on every island frame till he
  “holds up his mouse” (`up`): in his mouth in `stand` (as drawn) and in `hidepaws` (**new**: `holds: 'mouse'` with `hidepaws` draws it
  in his mouth, his forepaws behind his back), in his forepaws in `up` (seen first on “Snatch holds up his mouse.”: his earlier
  “Twenty-four?” is `stand`, section 5); after “It is NOT.” the story builder drops `holds`, so `swim`
  needs no mouse. Reynard's arrival (“Up from the river comes a fox.”) is chapter 8's **`trot`** (on all fours, tail high): he has no
  `walk` pose, and an unknown pose draws his `sit`.
- **Our cat: new `holds: 'miststone'`** (the pebble in her two forepaws held out, or in one forepaw over the moss; with **`flash: true`**
  its blue and green flash) **and `tap: 'stone'` on it** (the Tap's box over the held stone: `tap: 'stone'` is chapter 6's name, on her
  when she holds the stone). `holds: 'leaf'` and `holds: 'glass'` (chapter 8's), `tap: 'leaf'`, `tap: 'paw'`, `tap: 'nose'`, `tap: 'tail'`
  and `tailUp` as chapter 9's.
- **Sprinkle**: `holds: 'pebble'` (chapter 3's grey pebble), held in her claws in `sit` (as drawn) and, **new**, in `fly` (fluttering down
  low to `case` `beside`: the pebble in her forepaws) and in `lookdown` (at `paws` `above`: the pebble at the bottom of her box, in her
  claws, over our cat's paws), each reporting `held` there (today every pose without a hold point, `fly`, `flap`, `glide` and `lookdown`
  among them, puts it at `nose`, on the ground at her box's foot: in the air it would float below her); `curl` beside our cat (her tail round her: the storyboard's word since chapter
  3), `fly` high over the clearing (chapter 9's pose: **check her right wing is up as high as her left**: “Her wing holds.”), `flap`,
  `pawup` (“as big as a heron’s foot”), `sit`, `shy` and `happy`; on the Moon Ferry nothing of her is drawn (she is the luggage).
- **The dragonets on the island** as chapters 4 to 9 drew them (Squall `roar`, Puddle `sit`, Wisp `draw`, Sleet `point`, Hail `bounce`,
  Mizzle `yawn`), at their sizes since chapters 4 to 9: Squall, Hail and Mizzle no taller than our cat (`SIZE_CAP`); Puddle, Wisp and
  Sleet Sprinkle's size (`BIG`, `SIZE_BAND`, chapters 5 and 6). The places owner checks each fits at `case` `beside`.
- **Cats**: Tallyheart `lookup` and `kind` (never `laugh`), `crouch` for her head pressed to ours (no art draws two cats touching: they sit
  nose to nose); Glintstar `lookup`; the old tom, the grey tom, {Murmur}chime as drawn; Thymeleaf, Sloshbank, the ReedClan she-cat and the
  young tom, the GroveClan elder as chapter 9 drew them. Every cat is drawn side-on, facing left or right (chapter 7's rule).
- **In `scenes.js`** (the nest owner's): `mistscale` placed as a dragon is, with its own size rule (its anchor's `h` is its face's
  height, never capped) and **no shadow in any pose**: a branch of its own at the head of `drawCast`'s shadow chain (beside `IN_WATER`'s:
  nothing drawn under her, whatever the pose, an unknown one included). `NO_SHADOW.mistscale` alone would do nothing: `drawCast` reads
  `NO_SHADOW` only inside its `OWN_SHADOW` branch, and a cast id outside `OWN_SHADOW` and `SHADOW_5` gets the generic shadow unless its
  anchor is `air`, which `mama` and `eldest` (`elev`) are not; with a test that no shade ellipse is drawn under `mistscale` at `mama` or
  `eldest` in `lean`, `nuzzle`, `lift`, `bow` or an unknown pose. `NO_SHADOW.reynard = { swim: 1 }`, `NO_SHADOW.snip =
  NO_SHADOW.snatch = { swim: 1 }` (in the water: no
  shadow, as chapter 5's rule for anything in the water); **`IN_WATER.puddle.eyes = 1`** (his new pose is in the water at `gap` and
  `water`: without it `SHADOW_5` draws a dark ellipse under his eyes, the one thing the open river must never show), with a test; the
  variants 5 and 3 (and the crowd's `groveclan` 4 and 5) as their Clans' cats are.

### Counts art (`app/art/cats.js`)

**What is pinned** (read this first, as chapter 9's): the fingerprint sweeps of chapters 1, 6, 7, 8 and 9 (`sweep7` every table with
`THING[t]` and `'piece'`, the who pictures, the sand at per 1 to 10 where styled; `sweep8`, `sweep9`). Table 7 is drawn by no shipped
frame (no set before chapter 10 is on it), but `sweep7` sweeps table 7 with `THING[7]` and the plain sand at per 7: so the cast owner
skips per 7 in `sweep7`'s plain sand (`if ((p === 4 || p === 6 || p === 7 || p === 8) && !style)`), keeps the styled ones pinned, and
re-takes its hash on the shipped snapshot, saying so in the test (as chapters 8 and 9 did). `sweep8` (the nights' marks on sand and mud,
per 1 to 10) is untouched: per-7 marks change only on `ground: 'log'` (below), which it does not sweep.

- **The clutches** (new, keyed on **`thing: 'dragonet'`** at per 7, no `kind`: the lesson, its fillers, the five clutches in the sand,
  the Hollow's 7s and the Warrior Counts' 7 × 7): `countsPicture({ table: 7, per: 7, groups, thing: 'dragonet', highlight, totals, next
  })`: that many clutches, each **seven little dragonets, a row of four over a row of three** (four sisters and three brothers, chapter
  6's call), small and simple, mist-grey, round-eyed and smiling, never toothy; the clutches in rows of five with space between, never
  touching; `highlight` lights dragonets in order, a clutch's top four then its bottom three, then the next clutch; `totals` and `next` as
  the table-4 picture's (a glowing next clutch). One to ten clutches. Label "N clutches, seven dragonets each". Dispatched before the
  generic per-7 picture as drawn today.
- **The sand at per 7: four and three** (new): `PC.art.sand({ groups, per: 7, counted })` scratches each group as a four and a three with
  a gap (as per 8 is four and four), lit in order. **Only where plain** (no `style`, no `layout`), on any ground (sand, and `ground:
  'log'` for the Moon Ferry's 7 × 7).
- **Marks at per 7: four and three, on a log** (new): `kind: 'marks'` at per 7 **with `ground: 'log'`** (the only use: the Moon Ferry's
  7 × 7) lays each group's seven marks as four and three with a gap, scratched on a log's top (the raft's wet logs, as chapter 5's log
  help), seven rows of seven for 7 × 7, lit in order; its label “Seven rows of seven marks” (N rows of seven marks: no “nights”, which a
  log's marks are not). **Only on the log**: per-7 marks on sand or mud stay as today (`perRow` five, then two), because `sweep8`
  ('the nights' marks, without a layout: per 1 to 10, in the sand and the mud') pins them, so `sweep8`'s hash stands. Chapter 7's marks
  (per 10, 6, 4) draw as they do.
- **The sand on a log** (check): the Moon Ferry's helps scratch on `ground: 'log'` at per 1, 2, 3, 4 (two and two), 6 (three and
  three), 7, 8 (four and four) and 10 (swipes in pairs): the grouping rules hold on the log as on the sand. Chapter 5's log helps (per 2
  and 5) draw as they do.
- **The roll call's forepaws** (`whoPawsPicture`, table 5 with `who`): **Hail and Mizzle** small behind a raised forepaw of their own, as
  Puddle, Wisp and Sleet are (`dragonetBehind`; **new** for them: no shipped frame draws them there); **a `who` entry with `shape: true`**
  (**new**; not `mist`, which is already a cast extra of Sprinkle's and Puddle's): a soft grey dragonet shape, faceless, in a wisp of mist, behind a misty grey forepaw whose five claws light pale silver;
  **seven in one row** when every entry is a dragonet (the clutch in a row; no shipped picture has seven dragonets: chapter 5's seven
  forepaws are `paws: 'mud'`). Label "Seven forepaws, five claws each".
- **The Moon Ferry's pictures** (as drawn): eight cats' tails (table 1), five cats' ears, three cats' both forepaws, six patrols, four
  cheeks (`kind: 'cheeks'`), nine cats standing with four paws each (table 4: rows of five and four; check nine reads), six spiders.
- From before, unchanged: chapter 9's spiders and the per-8 sand (the warm-up), chapter 7's nights of marks (the sixty), chapter 5's
  bumps (Puddle's riddle), chapter 5's four paws aboard (`paws: 'board'`), chapter 2's ears (the ferry's fillers).

### Heard, not seen

*Blub.* (the low raft, twice; Puddle), *Drip.* (Sloshbank, three times), the heap's burp and giggle, the luggage's “happy puff of mist”
(drawn: `puff`), *Thump!* (Granny's pole, in a caption's words: section 7), *SKRITCH!*, *Hic!* (twice), the small voices' “HERE! HERE!
HERE!” and the dogs' “BYE, GIANT SQUIRREL!” (lettered as sounds: section 5), the voice in the stones (a caption), the purr (fx `purr`),
the otters' bubbles (`bubbles`).

## 5. Build notes

General rules for the story builder, then section by section where a screen needs one. Chapter 9's file (`app/story/ch09.js`) is the
model: its helpers (`c`, `S`, `merge`, `fid`), frame ids in reading order (letters only where a choice has outcome panels of its own), a
`board` on every frame. Chapter 10 opens on a screen every path reads, so it is the start, with no `when` and no title panel.

- **Speakers.** `names: { puddle: 'The big-footed dragon', otter: 'Granny' }` (the chapter's: Puddle's riddle, its help, fillers and
  retry read it; every otter balloon in this chapter is Granny's, the only otter who speaks). Puddle's first balloons in "Under the raft"
  carry `name: 'Two big eyes'` (until “Then two ENORMOUS feet.”), and from “I’m Puddle.” on `name: 'Puddle'`, as do his balloons on the
  low raft and at the goodbyes for a cat who found him before. Mama is `mistscale` variant 1: her first balloon, “Sprinkle?”, carries
  `name: 'A soft voice'`; from “MAMA!” on her balloons carry `name: 'Mama'` (her variant's label too), so the roll call's count, a
  balloon the page adds itself, takes it (`PC.ui.speakers.nameOn`). The eldest never speaks. ReedClan's leader is `reedclan`
  variant 5, GroveClan's `groveclan` variant 3 (labels by variant, section 6). **A leader first among its Clan's cast**: a frame
  balloon takes its variant (its label, voice and face) from the nth cast member with the same `who` (ui.js's `balloonsOf`, `mine[s.nth]
  || mine[0]`; `E.balloons` counts `nth` per `who`), and from the arrival on the ReedClan she-cat (`reedclan` 1) and the young tom (2)
  are in the picture, as is the GroveClan elder (`groveclan` 1) wherever drawn. So on every panel where a leader speaks beside another
  cat of the same id, the story builder lists the leader first among that id in the cast (“THAT’S the dragon?”, “Or ReedClan’s.”, “Who is
  Princess Waffles?”, “Or GroveClan’s.”), and the story test asserts each such balloon's label (“ReedClan’s leader”, “GroveClan’s
  leader”) and pitch (0.8, 0.88). **This agrees with back to front** (section 4, "Depth"): every one of those panels is on `island`
  `wide`, where the leaders' roots lie behind every spot of their Clans' other cats (section 4, "Depth on `wide`"), so the leader is the
  farther cat and comes first either way; should a panel ever put a leader in front of a cat of the same id, the places owner's anchors
  are what change, never the order. The ReedClan she-cat and the young tom never speak here
  (their mouthed “You can DO it!” is the friends cat's caption). Every speaker is in the frame's cast (chapter 5's test), a lesson's
  cheering Clanmates included: the Moon Ferry's Counts frame has Tallyheart, our cat, {Murmur}chime (`murmurchime`), the grey tom
  (`snorer`), Riffle, the old tom (`grizzled`), Glintstar, Granny (`otter`, variant 3) and Thymeleaf; the sixty's has Glintstar, our cat
  and Tallyheart (she letters its retry's opening, the help, the count and the fillers), with Sprinkle, Reynard, Snip and Snatch in the
  picture too (section 5, "The case", item 5).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one screen, the narration
  opens the next panel or the panel is split; a speech tag's own narration (“…,” says Riffle, as the Moon Ferry bumps home; “…,” calls
  Waffles, from her balcony, of course; “…,” he whispers, as loud as a whisper goes) is not lettered: the picture carries it (section 10).
  The screens where the order matters are named below.
- **No panel holds five boxes** (chapter 7's rule); **a speaker's lines on a panel are one balloon** where the story writes them so,
  except where the story gives a speaker two paragraphs in a row (Glintstar's honour, Tallyheart's “Sharp eyes.” and “Still {name}paw…”):
  two balloons in a row, as chapter 9's Glintstar. A speaker with a line only some cats read beside a line every cat reads is one balloon
  written twice by `when` (chapter 9's rule: Sprinkle's thanks to Tallyheart and Thymeleaf).
- **Long captions** (at most 95 characters on a panel; longer is split at a sentence break into boxes, the words unchanged): “Then the mist
  comes, up the river, cool and soft.” / “The moon glows right through it. Everything shines silver.”; “Out of the mist leans a great,
  gentle face, grey as a rain cloud, with big, kind eyes.” / “The rest of her is as big as a bridge.”; “Ten claw marks on the tree.” /
  ““One day, there’ll be ten marks here,” Tallyheart said, on your third day.” / “And today is that day.”; “On your very first night, there
  was no moon at all.” / “Tonight it’s round and full. And you’re HOME.”; and the one with no sentence break, split at its colon, the second
  box running on: “On the island’s shore, your paw lands beside a BIG print in the mud:” / “five toes in a row, and claws made for
  digging.” (chapter 9's Thymeleaf balloon that runs on into the next).
- **Paths in the picture.** A scene cannot vary by flag. The twins: the low raft by `foundPuddle` (his foot between the logs, or none);
  the boarding by `worry` (four paws aboard, or one tap); the brave look at the river by `worry`; the case's answer to the fourth claim by
  `ch10PickBig: 'stash'` (Sloshbank's “OURS?” and its *Drip.*: a sound has no `when`); the roll call's after-screens by the counted
  conditions (below). Path-only screens are frames with a `when`.
- **Sound effects** as the story letters them, one `sfx` a frame: *Blub.* (the low raft; Puddle's eyes; his “This one does.”; *Blub
  blub!*), *Drip.* (three times), *SKRITCH!*, *Hic!* (the leaving; the last roar is a caption's “tiny hiccup”), and two shouts from off the
  island lettered as sounds, each with **`sfxRead`** so Read to me says them: the small voices' **“HERE! HERE! HERE!”** (`sfxRead: 'Here!
  Here! Here!'`) and the Barking Field dogs' **“BYE, GIANT SQUIRREL!”** (`sfxRead: 'Bye, giant squirrel!'`): their speakers are not on
  the island, and a balloon's speaker must be in the cast (section 9, call 14). *Thump!* is said in the ferry's 9 × 4 caption (a Counts line
  has no sound slot: section 7, item 10). **An `sfxRead` goes only on a plain frame**: `E.checkStory` rejects it on a skip, an ask or a
  scratch frame, and a skip that is not `paws: 'log'` draws its counting picture, never the frame's `sfx`; so HERE! has a plain `mist`
  panel of its own before the roll call's skip ("The roll call", below), and the dogs' sound is on the plain `fox` panel of the swim.
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; the target is the cast extra or the set's `tap` mark of that name, and
  cats.js draws a cast member's target only when the frame's cast entry carries `tap: '<name>'`; the story's response is drawn on the next
  panel, chapter 6's call 13, or on this one where the story says the page turns at once):

  | Screen | `tap` (who or what carries it) | `prompt` | `label` |
  |---|---|---|---|
  | “The full moon comes up…” (not a water worry) | `paw` (our cat at `ferry`/`shore` `edge`, `walk`, `tap: 'paw'`) | `**Tap** to step aboard.` | `Step aboard.` |
  | Puddle's last screen | `paw` (our cat at `low` `sit-1`, `pawup`, `tap: 'paw'`; Riffle and Tallyheart at `sit-2`, `sit-3`; his `foot` waving back on the same panel) | `**Tap** to wave to Puddle.` | `Wave to Puddle.` |
  | the GroveClan elder's “And the polite one.” | `nose` (our cat, `crouch`, `kind`, `tap: 'nose'`: her head dipped) | `**Tap** to dip your head, very politely.` | `Dip your head.` |
  | “She nods to you.” | `reeds` (`island`/`wide`, `luggage: 'heap'`, `tap: 'reeds'`) | `**Tap** to pull the reeds off the luggage.` | `Pull the reeds off.` |
  | “THAT’S the dragon?” | `paw` (our cat, `walk`, `tap: 'paw'`, toward Sprinkle) | `**Tap** to sit beside her.` | `Sit beside Sprinkle.` |
  | the third answer (the glass) | `leaf` (our cat, `crouch`, `holds: 'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`) | `**Tap** to show every Clan your glass.` | `Show every Clan your glass.` |
  | “Every cat on the island stands up…” | `paw` (our cat, `stand`, `tap: 'paw'`; `island`/`wide`, `crowd: 'standing'`) | `**Tap** to take a step with every Clan.` | `Take a step with every Clan.` |
  | “That’s MY mist.” | `mist` (`island`/`mist`, `mist: 'rolling'`, `tap: 'mist'`) | `**Tap** the mist.` | `Look at the mist.` |
  | “Sprinkle runs. She flaps.…” | `tail` (our cat, `sit`, `tailUp: true`, `tap: 'tail'`) | `**Tap** to cheer!` | `Cheer!` |
  | each dragonet's goodbye | `nose` (the dragonet at `case` `beside`, `tap: 'nose'`) | `**Tap** to say goodbye.` | `Say goodbye.` |
  | the eldest's bow | `nose` (our cat, `crouch`, `proud`, `tap: 'nose'`) | `**Tap** to bow back.` | `Bow back.` |
  | “This is for you.” | `paw` (our cat at `paws` `close`, `tap: 'paw'`) | `**Tap** to hold out your paws.` | `Hold out your paws.` |
  | “And it FLASHES.” | `stone` (our cat, `holds: 'miststone'`, `flash: true`, `tap: 'stone'`) | `**Tap** to tilt it.` | `Tilt the stone.` |
  | the Mistscales rise | `paw` (our cat, `pawup`, `tap: 'paw'`: waving) | `**Tap** to wave back.` | `Wave back.` |
  | “Glintstar calls you up…” | `paw` (our cat, `walk`, `tap: 'paw'`) | `**Tap** to step up.` | `Step up.` |
  | “…you belong to CrystalClan.” | `nose` (our cat at `roots` `step`, `crouch`, `proud`, `tap: 'nose'`) | `**Tap** to bow, with tremendous dignity.` | `Bow.` |
  | the badger's print | `print` (`island`/`shore`, `print: true`, `tap: 'print'`; our cat `crouch`, `sniff`) | `**Tap** to sniff it, very carefully.` | `Sniff the print.` |
  | “And the day after THAT!” | `ears` (Riffle, `stand`, `tap: 'ears'`; his `hug` on the next panel) | `**Tap** to hug him.` | `Hug Riffle.` |
  | Waffles' “I have to lie DOWN.” | `paw` (our cat at `foot`, `pawup`, `tap: 'paw'`) | `**Tap** to wave up at her.` | `Wave up at Waffles.` |
  | “Ten claw marks on the tree.…” | `stone` (our cat, `crouch`, `holds: 'miststone'`, `holdAt: 'paws'`, `tap: 'stone'`) | `**Tap** to lay the mist stone on the moss.` | `Lay the stone on the moss.` |

- **`sets`**: `{ foundPuddle: true, ch10Puddle: true }` on Puddle's last screen; `ch10Best` on the four options of “Which part of this moon
  will you remember most?”; the picks' flags by the picks (section 6). **`gift: 'mist-stone'`** on the frame that lays the stone on the
  moss (section 6: the stone goes in My nest, a gift from Sprinkle; the page's note under the panel says “Sprinkle’s mist stone is in your
  nest.”).
- **`card: 'puddle-paws'`** on Puddle's storm-night panel (section 3). No other frame gives a card.

### Full moon

- `den`/`inside`, `morning`, `{ weather: 'clear', stone: 'auto', bark: 'auto', hidden: true, glass: true }` (DEN, chapter 9's bedtime
  opts by morning): Tallyheart's head at `doorway` (`peer`, `happy`), the grey tom asleep at `sleeper-1`, our cat sitting up in her nest
  (`nest`): the caption and Tallyheart's whisper (“Big day. Counts this morning. The Moon Ferry at dusk. And tonight, the Gathering.”:
  `kind: 'whisper'`). This is the start frame.
- **The water panel** (`when: { worry: 'water' }`, the same picture, Tallyheart `kind`): the caption “The Moon Ferry. On the river. At
  NIGHT.” and her “I’ll be right beside you. Every paw of the way.” (the brief's friend-near line, on the chapter's first screen).
- `nest`, `morning`: “Glintstar gave you one moon. Tonight, it’s over.” / “Your whiskers tingle.” (our cat `sit`, `wonder`, `sparkle`).

### Clutches of seven

- **Nobody on the rim** on any `hollow` frame (the story's note: the clutch is news on the island). H9 = `{ marks: 9, glow: 'auto' }`,
  H10 = `{ marks: 10, glow: 'auto' }`.
- The warm-up: `hollow`/`wide`, `morning`, H9, Tallyheart at `tree-far` (`size: 1.2`), our cat at `sunpatch-2`; Counts frame `{ set:
  'ch10-eights', intro: false }` with the caption and Tallyheart's balloon.
- “Now, today’s Count,” … “What comes in sevens?” on `lesson` (H9; Tallyheart at `sand-left`, our cat at `sand-right`), her balloon alone;
  then **a panel of its own** for the caption “You KNOW.” with our cat's “Sprinkle’s clutch! Sprinkle, and her six brothers and sisters!”
  and Tallyheart's “A clutch of seven. Exactly.” (the caption opens it).
- The five clutches: the skip on `sand` (Tallyheart `crouch`, `claws: true`; our cat `crouch`, `wonder`) with the caption and “Hop by
  sevens.” (section 2).
- The tree's ask on `wide` (H9; Tallyheart `glow: true`; section 2), its two balloons on the frame.
- The lesson: Counts frame `{ set: 'ch10-sevens', intro: false }` on `lesson` (H9), her balloon “Only one is new. Seven clutches. Seven
  sevens. We’ll hop to it.”. Then SKRITCH! on `tree` with H10, nobody in it (chapters 6 to 9's: a stretching cat covers the mark), the
  captions “Tallyheart stretches up the leaning tree.” and “A tenth claw mark.”; then `wide` with H10: “Clutches of seven. That’s your tenth
  Count. Every Count a warrior needs.” and the two `lessonClean: 'ch10-sevens'` pairs (balloons with `when`: “Not one miss. Not even the new
  one.” (Tallyheart) with `lessonClean`; “Some were tricky.” (ours) and “And you kept going. That’s the whole secret.” (hers) with `not`).

### The Moon Ferry

- `ferry`/`shore`, `dusk`, `{ moon: 14, clan: true }`: the Clan padding down the stones (our cat at `bank-1`, Tallyheart at `bank-2`),
  Riffle at `log-1` (`hop`, `shout`), Granny at `pole` (`stand`, `holds: 'pole'`): the caption and Riffle's “The MOON FERRY! Granny’s
  steering. Everybody ON!”; then **a panel of its own** for “Your glass is with you, safe in its leaf. For proof.” (our cat `walk`,
  `holds: 'leaf'`, `holdAt: 'mouth'`).
- The moonrise and the boarding, **a pair by `worry`**, on `shore` with the moon up (`dusk`, `{ moon: 14, clan: true }`; our cat at
  `edge`): `{ worry: 'water' }` carries the caption, Tallyheart's “One paw at a time. I’ll count.” and the four-paw skip (section 2), with
  `else` to its twin; the twin carries the caption and the one-tap step aboard. The water twin's skip turns to **a water-only panel** on
  `deck` (`night`, our cat at `front`, Tallyheart at `beside`): “One. Two. Three. FOUR. You’re ON. Tallyheart is right beside you.”
  (two boxes if the panel needs: the story's sentences). Both meet at the luggage.
- The luggage on `back` (`night`, `{ moon: 14, luggage: true, puff: true }`): the two captions (“At the very back sits a big heap of
  reeds.”, “The heap burps. A little cloud of mist puffs out.”) with Riffle's “That’s… luggage. VERY important luggage.” (`heap`, `hush`);
  then **a panel of its own** for “Granny winks. Tallyheart looks at the sky. So does Glintstar.” (Granny `kind`, Tallyheart and Glintstar
  `lookup`, at `back-1` to `back-3`).
- **The low raft** on `low` (`night`, `{ moon: 14, low: true }`, sfx *Blub.*): **a pair by `foundPuddle`**: `{ foundPuddle: true }` (with
  `else` to its twin) the caption “The front raft rides low. Very low.” and “Between the logs, a big blue-grey foot waves.” with Puddle's
  whisper “Tonight I’m a FAST log!” (`name: 'Puddle'`, `kind: 'whisper'`; Puddle `foot` at `gap`); the twin, `{ foundPuddle: false }`, the
  first caption and Riffle's “Logs ride low. It’s a LOG thing.” (`hush`, nothing at `gap`). Then a water-only panel, “Tallyheart doesn’t
  even blink. So you don’t either.” (`{ worry: 'water' }`; Tallyheart `sit`, `kind`, beside our cat). Then **the choice**, `{ foundPuddle:
  false }` with `else` to the push-off, on `low` with nothing at `gap`: “Peek between the logs.” (to "Under the raft") / “Sit tight.” (to
  the push-off), `sets: {}` on both.
- The push-off and the Moon Ferry Counts: `deck`, `night`, `{ moon: 14, clan: true, luggage: true }`, the whole cast of the cheers (above):
  the two captions (“Granny pushes off with her long pole, and the Moon Ferry glides upriver.”, “Nobody says a word. Big Gathering
  nerves.”) and Tallyheart's “At my first Gathering, I was so nervous, I counted EVERYTHING. Out loud. So let’s count.”; Counts frame `{
  set: 'ch10-ferry', intro: false }` (section 2).
- **The brave look, a pair by `worry`** on `low` (`night`, `{ moon: 14 }`; our cat `peer` at the raft's edge, `sit-1`, Tallyheart beside at `sit-2`):
  `{ worry: 'water' }` (with `else` to its twin) the caption “You look down at the river, on purpose. Deep, and silver, and full of moon.
  You forgot to be scared!” (two boxes at its sentence breaks) and the two balloons (“Nerves?” / “What nerves?”); the twin, `{ not: { worry:
  'water' } }`, the two balloons alone. Then the island.

### Under the raft (the optional scene)

- On the Moon Ferry before it pushes off, at the Crossing (`low` and `under`, `night`, `{ moon: 14 }`; Riffle and Tallyheart beside her
  on the logs on every `low` panel, at `sit-2` and `sit-3`, our cat at `lie` or `sit-1`). Every balloon of his and hers about Sprinkle is a whisper (`kind: 'whisper'`).
- `low`: our cat at `lie`, `flat`, chin over the gap; the captions (“You lie flat on the logs and peek down between them. Up front, the
  Clan is busy finding seats.”, the water line with its `when`, “Two big eyes look up at you, out of the silver water.”), *Blub.*, and his
  “Hello.” (`name: 'Two big eyes'`; Puddle `eyes` at `gap`).
- `under` (Puddle `eyes` at `water`, our cat at `lip`): “I’m a log.” / “Logs don’t have eyes.” / “This one does.” (his two `name: 'Two big
  eyes'`) and *Blub.*; then **a panel of its own**, the caption “Up pops a blue-grey head. Then two ENORMOUS feet.” (Puddle `log`).
- The riddle: Counts frame `{ set: 'ch05-puddle' }` on `under` (Puddle `head`), its balloon “Want a log riddle?” (section 2).
- `under`: “I’m Puddle. Mama says stay where you land. I landed under a raft.” (`name: 'Puddle'`) / “Sprinkle’s safe. She’s in the
  luggage.” / “Sprinkle?” (whispers) and *Blub blub!*.
- `under`: his “On the storm night, in a flash, I saw something with clever little paws, picking up mice. Very tidy.” (one balloon: the
  story's quote split round “says Puddle” resumes mid-sentence), `card: 'puddle-paws'`.
- `low` (Puddle `head` at `gap`): “Tell Sprinkle: FIVE!” (whisper); then **a panel**: the caption “From the luggage: a happy burp.” and
  “Oh. She HEARD.”; then **the last panel**, `sets: { foundPuddle: true, ch10Puddle: true }`: the caption “He sinks, and pops up again.”,
  “FIVE anyway!” (whisper) and the wave Tap (Puddle `foot` waving). Then the push-off.

### Gathering Island

- **Arrival** on `shore` (`{ ferry: true, luggage: 'heap' }`; our cat at `land-1`, Tallyheart at `land-2`, Riffle at `drag`, Granny at
  `raft`): “The Moon Ferry bumps onto Gathering Island. Under one great tree, every Clan is here.” and “Riffle and Granny drag the luggage up
  behind you. It giggles.” Then `wide` (`{ crowd: true, luggage: 'heap' }`): *Drip.* and Sloshbank's “CrystalClan.” (Sloshbank at
  `crowd-4`, the ReedClan she-cat and the young tom at `crowd-5`, `crowd-6`, **in the picture from here on, at the crowd's front**); then
  the small cat's caption on a panel of its own (`{ worry: 'small' }`, our cat `sit`, `proud`, at `centre`).
- The elder (`wide`; the elder at `elder`): the caption, “Still counting out loud?” and Tallyheart's “Hmph.” (`proud`); then **a panel**:
  “And the polite one.” (the elder's second balloon) with the dip Tap.
- The leaders on `roots` (Glintstar at `root-2`, ReedClan's leader at `root-1`, GroveClan's at `root-3`): the caption and Glintstar's
  “Tonight is the truce. Under the Accord, nobody hunts anybody. And every Clan hears the dragon’s case.”
- The fox on `fox` (`{ crowd: true }`; Reynard `trot` (chapter 8's: he has no `walk`), `wet: true`, at `fox`; Snip and Snatch `stand`, `wet: true`, Snatch `holds:
  'mouse'`): the two captions (each under 95). Then Reynard's “Good evening, my dear Clans! And Glintstar, what lovely FUR. Nearly as lovely
  as mine.” (`bow`); then **a panel** on `wide`: “Glintstar does not smile.” with her “Reynard, tell your story. {name}paw will answer it.”
- `wide`: Reynard's “A PILLOW cat? How SWEET. And where is your DRAGON?” and Glintstar's “She’s here.”; then **a panel** on `wide`:
  “She nods to you.” and the reeds Tap (`luggage: 'heap'`, `tap: 'reeds'`).
- `wide` (`luggage: 'open'`): “Out shuffles Sprinkle, her hurt wing drooping.” with her “Hello. I didn’t take your prey. I only ate Riffle’s
  fish.” (Sprinkle `sit`, `shy`, at the luggage), and her kept line, “And one vole. {name}paw gave it to me.”, as the same balloon written
  twice by `ch3Told` (one balloon of hers). Then “Every Clan gasps. Then every Clan goes, “Awww.”” (the caption with its quote) and
  ReedClan's leader's “THAT’S the dragon?”, with the sit Tap.
- `case` (our cat at `speak`, Sprinkle at `beside`): “I’m right here.” (whisper) and Reynard's “THERE! There’s your THIEF!” (`think`,
  pointing with his nose).

### The case

- `case` (`{ crowd: true }`; our cat at `speak`, Tallyheart at `mentor`, Sprinkle at `beside`, Reynard and the weasels at `fox`,
  `weasel-1`, `weasel-2`, the friends at `front-1`…`front-3`): “Every eye in the clearing is on you.”; the specialty chain, one panel
  each with its `when` (noticing: our cat `sniff` toward Snatch's mouse; climbing: our cat at `root`, `stand`; sneaking: our cat `walk` into the moonlight; swimming: our
  cat `proud`; friends: the ReedClan she-cat and the young tom at the front, their mouthed line in the caption); the talk line; then
  Tallyheart's whisper “Your Case File. Pick the card that shows he’s wrong.” on a panel of its own (it teaches the pick, once).
- **The five picks, their answers, and the sixty between the fourth and the fifth** (section 6 has the pick; every nudge is Tallyheart's
  whisper; the first pick on `fox`, for his bow, the other four on `case`, where Tallyheart's “That’s one.” is on the panel, and every
  answer on `case`):
  1. Pick `ch10PickFlew` on `fox` (Reynard `bow`, then his claim): the caption “Reynard bows low.” and his balloon “On the storm night, I saw
     it with my own eyes. A dragon! It FLEW out of your camp, its claws full of mice!”. Its answer on `case`: our cat's line by
     `ch10PickFlew` (three balloons with `when`: `cant-fly`, `mizzle-wing`, `fox-brag`), Sprinkle's “That night, I couldn’t even FLAP.”,
     Reynard's “Did I say FLEW? I meant… hopped. Very HIGH.” (`flap`).
  2. Pick `ch10PickMoon` on `case`: Tallyheart's “That’s one.” (whisper) and Reynard's “But I saw it
     clearly, by the light of the MOON.” (`chest`). Its answer on `case`: our cat's line by card (two `when`s, each naming both witnesses).
     Then `wide`: GroveClan's leader's “Who is Princess Waffles?” and our cat's “She’s very sensitive.”; then **a panel** on `fox`:
     “Reynard coughs.” and “A very… moony sort of dark.”
  3. Pick `ch10PickScale` on `case`: “That’s two.”, Reynard's “Well, it left a dragon SCALE by your pile! Shiny! Glittering!” (`comb`) and
     the old tom's “I SAW it!” (at `front-4`). Its answer on `case`: our cat's line by card (four `when`s), with the glass Tap. Then
     `case` (our cat `holds: 'glass'`, held up): “Your piece of glass shines in the moonlight. Smooth. Clear. Flat.” and the old tom's
     “Glass? I said DRAGON about GLASS?”.
  4. “That’s three.” (Tallyheart, whisper) **on a panel of its own** (her balloon comes before the caption); then pick `ch10PickBig` on
     `case`: “Reynard’s tail twitches.” and “Then who else could take so much prey? Only something BIG. A great big dragon!” (`flap`).
     Its answer, **a pair by `ch10PickBig: 'stash'`** on `case`: the stash twin (`when: { ch10PickBig: 'stash' }`, `else` to the other) with
     our cat's stash line, Sloshbank's “OURS?” and *Drip.*; the other with our cat's line by the thirteen other cards. Then `case`:
     “Sprinkle holds up a forepaw. It’s as big as a heron’s foot.” / “Snip and Snatch quickly hide their tiny paws behind their backs.”
     (Sprinkle `pawup`; the weasels `hidepaws`).
  5. The sixty: Counts frame `{ set: 'ch10-sixty' }` on `wide` (the clearing as the case's other `wide` panels draw it; Glintstar on
     her root, `root-2`; our cat at `centre`; Sprinkle at `beside`, as on every `case` panel round it; **Tallyheart at `crowd-1`**, the
     front of CrystalClan's seats, `kind`: she letters the retry's opening, the help, the count and the fillers, and every voice of a set
     is in its Counts frame's picture, chapters 7 to 9's `castOf(id, teacher)` test; Reynard, Snip and Snatch at `edge`, `edge-2`,
     `edge-3`, Snatch with his mouse in his mouth, so the case's whole cast stays in the picture and Snatch, who answers next, is
     there): Glintstar's
     line by pick (“And your count, {name}paw? I said bring it.” with `{ not: { ch10PickBig: 'my-count' } }`; “Your count. I said bring
     it.” with `{ ch10PickBig: 'my-count' }`) and our cat's (section 2). Then Snatch's “Twenty-four? It was a HUNDRED, at LEAST!”
     (`stand`, `shout`: the mouse still in his mouth; `up`, the mouse held up in his forepaws, is kept for “Snatch holds up his mouse.”);
     then **a panel**: “Every cat looks at Snatch.” and Snip's “SHHH!” (`point`, `shout`).
  6. “That’s four.” **on a panel of its own**; then pick `ch10PickOut` on `case`: “Reynard laughs, a little too loudly.” and “My friends
     can’t count! And me? I never even saw your pile! How could I get the prey OUT?” (`chest`, `laugh`). Its answer on `case`: our cat's
     line by card (ten `when`s) and Tallyheart's “Five.” (whisper); then the talk line on a panel of its own (`{ worry: 'talk' }`).
- Reynard is never drawn coming toward her or Sprinkle, never with teeth; the weasels never snarl; nobody touches anybody.

### Snip and Snatch

- `fox`: “Snip looks at Snatch. Snatch looks at Snip.” with “It was HER idea!” (Snatch, `point`) and “It was the FOX’S idea!” (Snip,
  `point`). Then the confession's ask (section 2) on `fox`, the caption “And then it ALL tumbles out.”, Snatch `glow: true`.
- `fox`: Reynard's “Weasels.” (`sit`, `solemn`) alone; then **a panel** on `wide`: “Snatch holds up his mouse.” with “This one’s mine,
  though.” (`up`) and Glintstar's “It is NOT.”. From the next frame on, Snatch has no `holds`.
- `wide` (`{ crowd: true }`): Glintstar's “Reynard. You lied at my border, and you lied here. From tonight, stay past the last post. Not one
  paw in our territory.”, ReedClan's leader's “Or ReedClan’s.”, GroveClan's leader's “Or GroveClan’s.”, Granny's “Or the RIVER. Once you’ve
  swum home.” (four boxes; Granny at `bank`, by the water; the two leaders first among their Clans' cast). Then “Every cat on the
  island stands up, and every otter too.” with the step Tap (`{ crowd: 'standing' }`: every Clan standing; our cat `stand`).
- `fox` (`{ crowd: 'standing' }`): “Reynard looks at all those cats.” and “Well. This is all very… DAMP.”; then `fox` with Reynard and the weasels at `water` …
  `water-3` (`swim`): “Back into the river he slinks, with Snip and Snatch paddling after him.”, “Far, far away, the Barking Field dogs
  start up.” and the dogs' sound (above).
- `roots`: Glintstar's “Tomorrow, CrystalClan and ReedClan bring their prey home from the stash.”; then `wide`: “Glintstar turns to
  Sprinkle.” with “Sprinkle of the Mistscales. Every Clan was ready to blame you. We were wrong.” (Glintstar at `edge`, the
  panel's right, facing left, `kind`, never `stern` at Sprinkle).

### The mist

- `mist` (`{ mist: 'rolling', tap: 'mist' }`; our cat at `speak`, Sprinkle at `beside`, `sniff`, Tallyheart at `mentor`): the two
  caption boxes, “Sprinkle sniffs the air.” and her “That’s MY mist.”, with the mist Tap. The Tap's response, the tip of a huge, soft grey
  tail curling through the mist, is on the next panel (chapter 6's call 13), with Mama's face: `{ mist: 'thick', tail: true }`, Mama
  `lean` at `mama`: the two caption boxes and her “Sprinkle?” (`name: 'A soft voice'`).
- `mist`: Sprinkle's “MAMA!” (`shout`) alone; then **a panel** (`{ mist: 'thick', grown: true }`): “Every Clan looks up, and up.”,
  Tallyheart's “Mistscales. They keep the Accord too.” (whisper, `lookup`) and the old tom's “Now THAT is a dragon.”.
- `mist`: “Sprinkle runs. She flaps. Harder. HARDER…” (Sprinkle `flap`) with the cheer Tap. Then `sky` (`{ mist: 'thick', grown: true }`,
  Sprinkle `fly` at `fly`): the three captions (“…and she FLIES. Up over the clearing, round the great tree, all the way to her Mama’s
  nose.”, “Her wing holds.”, “The fox said she flew. That night, she couldn’t. Tonight, at last, she can.”).
- `case` (`{ crowd: true, mist: 'thick' }`): Thymeleaf's “The full moon has told us. Mended.”, *Drip.* and Sloshbank's “So THAT’S what our
  root was for.”, the elder's “And our moss. I’ll remember that.”, Riffle's “TEN out of ten! And NO splash!” (four boxes).

### The roll call

- `mist` (Mama `nuzzle`, Sprinkle `sit` at `nose`): “Mama nuzzles Sprinkle, very softly.”, Mama's “There you are. You stayed where you
  landed. Mostly.”, Sprinkle's “And then I FLEW!”, Mama's “ROLL CALL!” (the story's “and lifts her great head”
  is the next panel's picture: Mama `lift` on the HERE! panel).
- **The HERE! panel**, a plain frame of its own (the story's screen break after “ROLL CALL!”), on `mist` (`{ mist: 'thick', grown: true,
  small: 'some' }`, Mama `lift` at `mama`, Sprinkle at `nose`, our cat at `speak`): the caption “Out of the mist, from near and far, come
  small voices.” and `sfx: 'HERE! HERE! HERE!'`, `sfxRead: 'Here! Here! Here!'` (a plain frame, so `E.checkStory` takes the `sfxRead` and
  the page letters the sound). This is where the `lift` pose is seen.
- The skip frame (section 2) on `mist`: Wisp's caption by `foundWisp` (two captions with `when`) and Mama's “Forepaws UP.” (her label
  “Mama”), then the seven forepaws. A skip that is not `paws: 'log'` puts its counting picture in the panel, so this frame's scene
  (`{ mist: 'thick', grown: true, small: 'some' }`, Mama `lift`) is for the board and the storyboard only, as section 7, item 2 says of
  the five clutches; it carries no `sfx`.
- `mist`: Mama's “Thirty-five. And nobody’s missing.” and Sprinkle's “Not ONE!”. Then **the caption that follows them opens a panel of its
  own, by the counted conditions** (section 1), each on `case` with `{ crowd: true, mist: 'thick' }`: six frames, *just one of the six*, in
  the story's order (Squall, Puddle, Wisp, Sleet, Hail, Mizzle), each `when` one flag `true` and five `false`, `next` to that dragonet's
  goodbye and `else` to the next of the six; their caption “Out of the mist, the dragonet you found comes to stand beside you.”, the dragonet
  stepping out at `beside`. After them, the any-found frame (`else` the shapes' screen below), “Out of the mist, the dragonets you found
  come to stand beside you.” (`small: 'coming'`), `next` to the goodbyes. A cat who found none goes straight to the shapes' screen.
- **The goodbyes**: one frame for each dragonet, in the story's order, each with its found flag as `when` (no `else`: a frame that does
  not show leads on to the next), on `case` (`{ crowd: true, mist: 'thick' }`), the dragonet at `beside` with `tap: 'nose'`, our cat at
  `speak`: its goodbye in its balloon (Squall `roar`, “GOODBYE, {name}paw! One more roar from my tower. THEN home!” and the sound *Hic!*;
  Puddle `sit`, “Bye, {name}paw! I’ll miss being a log.” (`name: 'Puddle'`); Wisp `draw` with `drawing: 'cat'`, the caption “Wisp says
  nothing. She draws a little cat in the earth: you.”; Sleet `point`, “Roll call DONE. Goodbye, {name}paw. That’s an ORDER.”; Hail `bounce`,
  “Bye, {name}paw! Can I come BACK? Can I bring the DOGS?”; Mizzle `yawn`, “Bye-bye, {name}paw. The silver moss WORKED.”), and the goodbye
  Tap (section 7, item 4: one panel each, its balloon before her Tap). The last goodbye frame leads to the shapes' screen.
- **The shapes' screen, by the counted conditions**: the all-seven frame first (`when` all six `true`, `else` the first five-of-six frame),
  on `mist` (`{ mist: 'thick', grown: true }`, the eldest `bow` at `eldest`; the elder at `front-1`): the two caption boxes (“Then, out of
  the mist, comes the eldest of ALL the Mistscales, older than the great tree.”, “The eldest bows low to you, all the way to the grass.”), the
  elder's “A Mistscale, bowing to a cat. I’ll remember THAT.” and the bow-back Tap; then six five-of-six frames (each `when` one flag `false`
  and five `true`, `else` the next, the last's `else` the four-or-fewer frame), `small: 'one'`, “One more small shape waits in the mist, a
  dragonet you’ve never met. To be met another time.”; then the four-or-fewer frame (no `when`), `small: 'some'`, “Other small shapes wait in
  the mist, dragonets you’ve never met. To be met another time.”. Every one of them leads to "The mist stone". (So every cat reads one of the
  three, and the bow is decision 20's small extra: all seven get home either way.)

### The mist stone

- `case` (Sprinkle at `beside`, `holds: 'pebble'`, fluttering down: `fly` low): the caption and her “This is for you.” with the paws Tap.
- `paws` (our cat at `close`, `holds: 'miststone'`; Sprinkle at `above`): “The full moon shines on the pebble.” / “And it FLASHES. Blue!
  Green! Blue again!” (`flash: true`) and the tilt Tap.
- `mist` (our cat at `speak`, `holds: 'miststone'`, `flash: true`; Sprinkle at `nose`; Mama `lean` at `mama`): Mama's “A mist stone.
  Grey, until the moonlight finds it. Our thanks. You saved one of our own.” and Sprinkle's “When the moonlight finds it, that’s me,
  saying hello.”; then the shiny line on a panel of its own (`{ worry: 'shiny' }`).

### Goodbye

- `case`: “Sprinkle says goodbye to everyone, by name.” with her “Riffle. Thank you for ALL the fish.”; then **a panel**: “Riffle sniffs.”
  with “Otters don’t cry. That’s river water.”.
- `case`: Sprinkle's thanks, one balloon written twice by `ch3Told` (told: “Tallyheart. Thank you for keeping my secret. Thymeleaf. Thank
  you for my wing.”; kept: “Tallyheart. Thank you for coming to meet me. Keep counting fish. ESPECIALLY fish. Thymeleaf. Thank you for my
  wing.”), Thymeleaf's “Goodbye, wing. Behave.” and Sprinkle's “And tell Coil I’ll be QUIET now.” (the comma that only marked the tag goes:
  chapter 9's rule).
- `case` (Sprinkle `curl` beside our cat: her tail round her): “Then Sprinkle wraps her tail round you, the way she did under the bridge.”
  with her farewell, one balloon by the any-found `when` and its `not`; then **a panel**: “You’re happy. You’re sad. You’re both at once.”,
  our cat's “Goodbye, Sprinkle.” (whisper) and **Choose** (“Fly SAFE!” / Hug her back, tight.; `sets: {}`, both to the next frame).
- `sky` (`{ rising: true, zip: true, grown: true }`, Sprinkle `fly` small at `far`, her tail up): the three captions, *Hic!*, the wave Tap.

### One moon

- `roots`: “Glintstar calls you up to the great tree.” with the step-up Tap; then `roots` (our cat at `step`): Glintstar's “One moon ago, you
  came to us from behind the glass. Tonight, your moon is over.”; her two balloons (“Tallyheart said to judge you…” / “You noticed what was
  missing…”); “{name}paw, you belong to CrystalClan.” with the bow Tap.
- `wide` (`{ crowd: true, bubbles: true }`, fx `purr`): the two captions (“The whole Clan purrs your name. Then ReedClan does. Then
  GroveClan.”, “The otters try too. It sounds like bubbles.”).
- `case` (Tallyheart at `beside`, `crouch`, nose to nose): “Tallyheart presses her head against yours.” and her two balloons (whispers:
  “Sharp eyes. I knew it, from the thirteenth sparrow.” / “Still {name}paw, for now. Your warrior name is coming. And this moon will be in
  it.”); then, on a `case` panel of its own (the story's screen break; Tallyheart still at `beside`, `crouch`, nose to nose), our cat's
  `{ who: 'player', text: 'When?', kind: 'whisper' }` and Tallyheart's whisper “When you pass your Warrior Counts. They’re yours, whenever
  you’re ready. At the fountain, like {Murmur}chime.” (`kind: 'whisper'`): the line that hands chapter 10 to the Warrior Counts, whose hub
  button (“When you’re ready”) echoes it; the story test pins both strings exactly, and {Murmur}chime's “When you sit your Warrior Counts,
  I’ll be right at the front.” (the story's own lines; warrior-counts.md section 1 gives a looser example);
  then her “Which part of this moon will you remember most?” with **Choose** (`ch10Best`); then her reply on a frame of its own, four
  balloons each with its `when` (“Me too. Every full moon.” · “Me too. Every one of them.” · “Me too. So will every Clan.” · “Ha! Me too.”).

### Home

- `shore` (`{ print: true, ferry: true, tap: 'print' }`; our cat at `print`, `crouch`, `sniff`; Granny at `raft`, Tallyheart at
  `land-2`): the caption (two boxes at its colon), Granny's “Badger. An old track. From far upriver.”, Tallyheart's “A thing to check.
  Another day.”, the sniff Tap. Nothing is drawn but the print: old, dry at its edges, in bright moonlight, never fresh.
- `ferry`/`river` (`{ moon: 14, home: true, clan: true }`; Riffle and our cat at `raft-1`, `raft-2`): Riffle's “Best Gathering EVER.”, “See
  you tomorrow?”, “And the day after. And the day after THAT!” and the hug Tap (Riffle `tap: 'ears'`).
- `riverbank`/`path` (`night`, `{ moon: 14 }`, nobody on it but our cat and Tallyheart walking home): the caption, in two boxes, “Past the
  Old Bridge, on the walk home, a voice in the stones whispers,” / ““Quiet at last. I’ll miss the burps.””: Coil is not drawn, so his words
  are the caption's quote (section 9, call 15). Then `riverbank`/`roof` (`night`, `{ moon: 14, roar: true, flyer: true }`): “From the tallest
  tower: one last roar, and a tiny hiccup. Then a small shape flies off upriver.” and the `foundSquall` caption.
- `tower`/`up` (`night`, `{ moon: 14, chime: true, light: true }`; our cat at `foot`, Waffles at `railing`, `peer`): Waffles' “{petname}!
  DARLING! I saw MIST! And DRAGONS!” and our cat's “Every Clan heard about you tonight! You were a WITNESS!”; then her “ME? At the
  GATHERING?”; then **a panel**: “She sways.” with “I have to lie DOWN.” (Waffles `peer`, `dreamy`, leaning back from the railing) and the wave Tap.
- `den`/`outside` (`night`, `{ weather: 'clear', moon: 14 }`; the old tom and {Murmur}chime by the entrance, our cat coming in): “In
  camp:” with the old tom's “I always said that dragon was innocent.”, our cat's “You said that GLASS was a dragon’s.” and his “An innocent
  mistake.” (four boxes); then {Murmur}chime's “When you sit your Warrior Counts, I’ll be right at the front.” on a panel of its own.

### Ten claw marks

- **Every bedtime den frame's opts in full**, as chapter 9's: on `nest`, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto',
  hidden: true, glass: true }` (DEN_GLASS), with `miststone: true` from the frame after the stone is laid; on `doorway` and `inside`, the same
  with `moon: 14` (DEN_MOON).
- `nest`: “Your nest, at last.” and the `ch2Stone` caption (our cat `lie`); then `inside` (the grey tom at `sleeper-1`, `lie`, `sleepy`):
  his “Do the paw thing…” (whisper; the tag “Across the den, the grey tom mumbles,” is the picture); then **a panel**: “He’s snoring before
  you can.” (`zzz` on him).
- `nest` (our cat `crouch`, `holds: 'miststone'`): the three caption boxes (“Ten claw marks on the tree.”, the remembered line, “And today
  is that day.”), the lay-the-stone Tap, `gift: 'mist-stone'` (a small inset of the tree's ten marks in the board only).
- The hook: `island`/`shore` (`{ print: true }`, nobody: the print alone in the moonlight): “Out on the island, the badger’s old track lies
  in the moonlight. What is a badger LIKE?”
- `doorway` (`moon: 14`, `miststone: 'flash'`; our cat `lie`, `kind`): “In the doorway, the full moon looks in. Your stone flashes, blue and
  green.” and her “Hello, Sprinkle.” (whisper); then **a panel** on `nest` (`curl`, `asleep: 'half'`, `miststone: true`): the two caption
  boxes and “You curl up tight, warm and safe, and sleep.”.
- Chapter end: the dream input (“What did {name}paw dream, the night of the Gathering?”) on `nest`; then **the end frame on the den's new
  `stone` camera** (`miststone: 'flash'`, our cat's tail tip at `tail`): “On the moss, your mist stone flashes blue and green under the full
  moon.” and “End of Chapter Ten. The end of {name}paw’s First Moon.” (`end: true`): the stone close and flashing, so she knows the real one
  when it is hers.

### The edit to chapter 5's page (`app/story/ch05.js`, `book.recap`)

As chapter 9 did for `ch9Roof` on chapter 4's, **two** recap lines read `foundPuddle` and both leave out a cat whose only Puddle is
chapter 10's:
- the "found Puddle" line: `when: { foundPuddle: true }` becomes `{ foundPuddle: true, ch10Puddle: false }`;
- the forepaw line, “Under the Old Bridge, Sprinkle lit a forepaw for everyone found so far. Mama’s count is coming back.”, is `when: ANY`
  (ch05.js's “found a dragonet today”, `{ not: { ch5Roof: false, foundPuddle: false, foundWisp: false } }`), and a cat who found nobody in
  chapter 5 and meets Puddle here would gain it, a forepaw count under the bridge she was never part of. Its `when` (in `book.recap`
  only; the frames keep `ANY`) becomes `{ not: { ch5Roof: false, foundWisp: false, not: { foundPuddle: true, ch10Puddle: false } } }`. Checked with `E.matches` over all
  twelve combinations of `ch5Roof`, `foundWisp` and (`foundPuddle`, `ch10Puddle`): it equals `ANY` for every live save and is false for
  a cat whose only find is Puddle in chapter 10 (`spec-editor/c2.js`).

No new line on chapter 5's page: chapter 10's own page says it (below). No live save holds `ch10Puddle`, so chapter 5's page reads exactly
as it does for every one of them (the golden proves it); `tests/story-ch05.test.js`'s truth table covers both lines. Puddle's page in
the book (`foundPuddle`, “{name}paw found
him under the otters’ ferry raft…”) is true as it stands: the Moon Ferry is the otters' ferry raft. Chapters 5, 6, 8 and 9's frames that
read `foundPuddle` show their found variants on a reread to a cat who met him here (section 7, item 12).

### The book

The story builder writes it; proposed (seven to ten entries, one sentence each, true on every path; the cat named wherever a tom's
“he” could mean another animal):

1. `On the morning of the Gathering, Tallyheart taught {name}paw {their} tenth Count, clutches of seven: the sevens.`
2. `At dusk the otters’ Moon Ferry carried CrystalClan upriver under the full moon, and Tallyheart ran the Counts to steady everyone’s nerves.`
3. *(ch10Puddle)* `Under the Moon Ferry, {name}paw found Puddle, Sprinkle’s brother with the enormous feet, who saw clever little paws picking up mice on the storm night.`
4. `On Gathering Island, Reynard told every Clan his story, and {name}paw answered it, card by card, out loud.`
5. `Snip and Snatch blamed each other and told everything, and every Clan, standing together, sent the fox and the weasels away past the last post.`
6. `Then the Mistscales came in the mist for their clutch, and Sprinkle’s wing held: she flew to her Mama.`
7. *(all seven found)* `The eldest Mistscale bowed low to {name}paw, the cat who found all seven.`
8. `Sprinkle pressed her grey pebble into {name}paw’s paws, and under the full moon it flashed blue and green: a mist stone.`
9. `In front of every Clan, Glintstar said that {name}paw belongs to CrystalClan, and Tallyheart said {their} warrior name is coming, with this moon in it.`
10. `At bedtime there were ten claw marks on the tree, and a mist stone on the moss.`

`chapterTitle: 'The Gathering'`; `dream: '{name}paw’s dream: “{dream}”'`; `noDream: '{name}paw’s dream, the night of the Gathering,
stayed a secret.'`. **No dragonet page** (Puddle's is chapter 5's). 8 entries on a plain reading, 9 with Puddle or with all seven, 10 with both (a
cat who completes the seven with Puddle here); the story-ch10 test pins 8 on a plain reading.

### The teaser

The Ceremony's (`docs/warrior-counts.md`, section 1): `teaser: { title: 'The Warrior Ceremony', lines: ['Pass your Warrior Counts, and
the Clan will gather for your name.'] }`. It is what her book shows under chapter 10's page while the Ceremony is unbuilt; the Warrior
Counts' UI replaces its lines with “Your ceremony is coming soon.” once she has passed, and hides the hub's "coming soon" while the Counts
are open (section 6).

### Tests the story builder adds (`tests/story-ch10.test.js`, beside chapter 9's)

- Every Counts set exactly as section 2, and the runs it cites: the warm-up's hard pick (8 × 8 when nothing; each chapter-9 miss or slow
  fact named there opens on itself with “Last time…”; never 1 × 8, 2 × 8, 4 × 8, 6 × 8 or 9 × 8), its fillers (never 6 × 8, 8 × 8 or 7 × 8;
  the 2 × 8 slip only after the third miss and only with a hard 8 × 3, 3 × 8 or 8 × 5); the 7s' order, step-offs (`lit` 35, 42), words, the
  one `rightAgain`, the four engine-worded retries (“Here’s that one again. Five clutches. How many dragonets?” …), the quick 7 × 1 after a
  quick 10 × 7 praised, the four timed facts (`E.hardFacts` after a slow clean lesson), the fillers (7 × 1, 2 × 7, then 7 × 3 and 4 × 7),
  7 × 8's way chapter 9's `WAY56`, the warm-up's hard 7 × 8 met again in the lesson, and the giveaway claim (after one miss of each of any
  two facts, no prompt, right line, help opening or way says a later question's answer; the hop count excluded); every Counts line
  short (chapters 7 to 9's rule: at most 22 words for a prompt, a help opening or a miss, 18 for any other; whole sentences); every
  voice of a set in its Counts frame's picture (the sixty's Tallyheart included); Granny's “Thirty-six!” with variant 3's face and pitch;
  the ferry's tables, pictures (6 × 8 spiders, 7 × 7 marks on a log), cheers on retries, 7 × 7's retry words, fillers (“One more! One cat.
  How many ears?”; never an own pair) and how it ends; the sixty's words and fillers and its ending on a missed filler's retry; Puddle's
  riddle as chapter 5's, and its 10 × 3 filler (missed twice) before the ferry's 3 × 10, read first there; 21 typed answers on
  every reading, 22 with Puddle; `E.countSets` gives table 7 to `ch10-sevens`; the Hollow offers “Clutches of seven · the 7s” and the tree
  has ten marks only after the lesson.
- The picks: five pick frames, their flags, and every right card has its own answer line: for each card in `right`, with the flag set to
  that card, the frame `E.landing(cat, story, pick.next)` reaches carries a balloon whose `when` names that card, or the frame's own
  `when` does (claim 4's `next` is the stash twin, whose own `when: { ch10PickBig: 'stash' }` names it, and whose `else` holds the other
  thirteen, each on a balloon's `when`); `by` and `who` are keys of `PC.ui.speakers.NAMES`; and
  **every claim has a right card in the thinnest file** (the twenty cards every cat holds: section 3) and in every golden cat's file; no
  pick needs `my-count`, `mizzle-wing` or an optional card; `sleet-den` right for none.
- `ch10Puddle` and `foundPuddle` on Puddle's last screen and nowhere else; saying no sets nothing; `puddle-paws` given there; `ch10Best` on
  the four options; chapter 5's page for a `ch10Puddle` cat (neither of its two Puddle-reading recap lines), and unchanged for every
  other (the truth table of `ch5Roof`, `foundWisp`, `foundPuddle` and `ch10Puddle`, `tests/story-ch05.test.js`'s); a cat holding chapter
  5's `puddle-paws` record without `foundPuddle` keeps its chapter-5 place in her file.
- The counted conditions: for all 64 combinations of the six found flags, exactly the right one of the roll call's after-screens, the
  right goodbyes in order, and exactly one of the three shapes' screens.
- Every `ch3Told` frame, the path-only screens, the specialty chain, every worry line, each one-tap target present in the art; nobody on the
  Hollow's rim; no grown cat in `laugh`; no "whisker-length", "claw-length", "Ironsnake", "Twoleg", "StarClan", "kittypet"; every caption at
  most 95 characters on a panel; no panel with five boxes; the book on every path (no token unfilled, a tom's pronouns), the teaser; every
  reading under 170 frames; the last frame `end: true`; every pose and variant in `PC.art.vocab` (Reynard's arrival `trot`); every
  leader's balloon labelled and voiced as the leader; the HERE! panel's `sfxRead` on a plain frame.
- **Depth** (there is no depth rule in the art, section 4): on every chapter 10 frame on the `ferry`, `island`, `den` and `tower` sets,
  every pair of cast members in the same z layer where the farther one's body meets the nearer one's head lists the farther first: the
  hotfix's own check (`tests/set-pile.test.js`'s depth-hotfix test: `bodyAt` and `meets7`, anchors' `y` for near and far, `elev`
  anchors left out), run over chapter 10's frames as each reading resolves them (every speaking leader's panel among them), so Charlie's
  bug cannot come back on the panels where most cats meet (`island` `wide`, `roots`, `case`, `fox`, `mist`; `ferry` `deck`).
- **Finishing chapter 10 opens the Warrior Counts**, checked through the Warrior Counts' own code on each scripted reading (not a bare
  `E.isFinished`): one frame before the end (the dream input), `E.warriorState(cat, stories, now).open === false` and
  `PC.ui.warrior.hub(state, E.progress(cat, stories))` is null; on the end frame, `open` is true, the hub's `big` is 'The Warrior Counts' /
  'When you’re ready', `hideSoon` is true, the book's teaser under chapter 10's page is 'The Warrior Ceremony' with 'Pass your Warrior
  Counts, and the Clan will gather for your name.', and the corner's line reads 'open; not sat yet'.

## 6. Engine needs

**One: the card pick** (the brief: "One new engine feature: the card pick"), designed below so that it changes nothing in chapters 1 to
9: no chapter 1 to 9 frame has a `pick`, every hook is a branch only a `pick` reaches, and nothing new is stored. Everything else is
what chapters 1 to 9 built: choices with `when`/`else` and `labelWhen`, typed answers, `skip` (with `who` entries and `when`s, `paws:
'board'`), `ask`, one-tap `scratch` frames on a cast extra or a set's mark, frame `when` (E.matches' lists and `not`), sticky `sets`, a
card another chapter defines, `gift`, `lessonClean`, `sfxRead`, the dream input, and the Counts keys (`table` on a fact, `picture.kind`
and `ground`, `help: 'picture'`, `fillVoice` and `fillPicture`, `fillOrder`, `avoid`, `warmHard.avoid`, `retryPrompt` as a line, a list or
`true`, `rightAgain`, `lit`, `label`, `hollowThings`, a fact's `miss`/`missLast`). The counted conditions of the roll call are written as
frames with `when` and `else` (section 1), the goodbyes as one frame each (section 7, item 4): no engine change for either.

### The card pick

**The frame key.** `pick` is a frame's one interaction (it joins `E.KINDS`, after `file`):

```js
pick: {
  claim: 'It FLEW out of your camp!',   // his words in the strip above her file: exactly one word in capitals (two letters or
                                        // more), the word the strip lights and Tallyheart's first nudge echoes
  who: 'reynard',                       // who makes the claim (default 'reynard'): his balloon, his label, his voice
  by: 'tallyheart',                     // who nudges (default 'tallyheart'), in a whisper only she hears
  right: ['cant-fly', 'fox-brag', 'mizzle-wing'],   // every card whose own line answers the claim (held or not)
  own: { 'fox-flew': 'Hmm. That’s what HE says. Which card shows what YOU found out?' },   // optional: a wrong card's own nudge
  nudges: ['Hmm. Does that one say if Sprinkle could FLY?', 'Think of Sprinkle, under the bridge. Could she fly?'],   // 1st, 2nd wrong
  flag: 'ch10PickFlew',                 // set to the card she picks right, for the next screens' `when`s
  prompt: '**Pick a card** from your Case File.',   // optional: the instruction under the panel (this is the default)
  label: 'Open your Case File and pick a card.',    // optional: the hidden button's words (this is the default)
  next: 'f071'
}
```

**The five picks** (the story's words exactly; `who` and `by` their defaults):

| # | `flag` | `claim` | `right` | `own` | `nudges` |
|---|---|---|---|---|---|
| 1 | `ch10PickFlew` | It FLEW out of your camp! | `cant-fly`, `fox-brag`, `mizzle-wing` | `fox-flew`: Hmm. That’s what HE says. Which card shows what YOU found out? | Hmm. Does that one say if Sprinkle could FLY? · Think of Sprinkle, under the bridge. Could she fly? |
| 2 | `ch10PickMoon` | By the light of the MOON. | `waffles-no-moon`, `heron-no-moon` | `fox-moon`: Hmm. That’s what HE says. Who says different? | Hmm. Does that one say anything about the MOON? · Who said there was NO moon? One stayed up ALL night with her nerves. One stands in the marsh. |
| 3 | `ch10PickScale` | A dragon SCALE by your pile! | `glass`, `scale`, `sprinkle-scales`, `wisp-fox` | none | Hmm. Does that one say anything about the SCALE? · What did you find in a heap, that shines just like the ‘scale’? |
| 4 | `ch10PickBig` | Only something BIG could take so much! | `prints-sprinkle`, `stash`, `tunnel`, `coil-diggers`, `heron-shapes`, `prints-marsh`, `fur`, `four-a-night`, `prints-pile`, `prints-tracks`, `squall-shapes`, `puddle-paws`, `hail-shapes`, `my-count` | none | Hmm. Does that one say how BIG the thief was? Or how much it took? · Think of the prints. Big ones, and tiny ones. |
| 5 | `ch10PickOut` | I never even saw your pile! How could I get the prey OUT? | `fox-brag`, `tunnel`, `coil-diggers`, `stash`, `heron-shapes`, `dug-earth`, `prints-pile`, `squall-shapes`, `hail-shapes`, `puddle-paws` | none | Hmm. Does that one say how the prey got OUT of our pile? · What goes UNDER our pile? Coil felt it. |

(Claim 5's “I” is one letter, so OUT is its one word in capitals. The first nudges of claims 2 to 5 echo the lit word; claim 1's
echoes it as “FLY”.)

**How a pick is judged** (`E.pickJudge(pk, cat, cardId, wrongs, stories)`, pure; `pk` is the frame's `pick` block, named so that it
never shadows engine.js's module-level `pick(list, i)` helper; `wrongs` is how many wrong picks she has made on this frame so far, the
page's count, read as `wrongs = num(wrongs, 0)`, so an undefined count is 0, never `NaN`):
- Only a card her file shows can be picked (`E.cards(cat, stories)`); any other id returns `null` and changes nothing.
- **Right**: `pk.right` holds the id: `{ right: true, card, flag: pk.flag }`.
- **Wrong**: `n = wrongs + 1`; `line = (pk.own && pk.own[id]) || pk.nudges[Math.min(n, 2) - 1]`: the card's own nudge when it has one,
  else `nudges[0]` on the first wrong pick and `nudges[1]` on the second and every one after (clamped, never engine.js's cycling
  `pick(list, i)`, which would give `nudges[0]` again on the third); returns `{ right: false, card, wrongs: n, line, by, glow }`, where
  `glow` is empty until `n >= E.PICK_GLOW` (3) and then **the right cards she holds, in her file's order**.
- **Before the glow** (`wrongs < E.PICK_GLOW`), `E.pickOpen(pk, cat, wrongs, stories)`, the cards she may still pick, is every card
  `E.cards` shows. **After the glow** (`wrongs >= E.PICK_GLOW`) it is only the glowing ones, and **`E.pickJudge` (and `E.pick`) return
  `null` for any card not in `E.pickOpen`**: no pick, no line, nothing changes, no fourth nudge; the page answers `null` by wiggling the
  glowing cards. A glowing card is right. So every pick ends within four picks (taps on dimmed cards are not picks), and **it can never
  fail**, in the pure engine as on the page.
- **Her file's order** (one definition, used for `glow`, `E.pickView`'s `right`, `PC.ui.pickPage`'s `cards`, the speech and the tests):
  the Case File screen's reading order, `E.caseFile`'s groups first (“What I saw myself”, then “What I was told”), each group's cards in
  order, then each linked row, its cards left to right (as `drawFile` reads them aloud).
- **The guard** (a data slip the story test rules out): if she holds no right card at all, there is nothing to glow, so the third wrong
  pick is taken as right: `E.pickJudge` returns `{ right: true, card, flag: pk.flag, guard: true }`, `E.pick` sets the flag to that
  card and lands as on a right pick, and the page pops it as a right pick. The corner has words for that value too (`FLAG_WORDS` holds
  an entry for every card id, "The Grown-ups corner", below). And if her file shows no card at all (`E.cards` empty), she cannot make a
  wrong pick, so `E.next` on that pick frame follows `pick.next` (its one pick branch, below) and `renderPickFrame` shows Next in place of
  the instruction. Both are unreachable on real paths; the story test proves it.

**What a pick does** (`E.pick(cat, story, cardId, now, wrongs, stories)`; `stories` passed through to `E.pickJudge` and `E.pickOpen`, as
`E.cards` and `E.caseFile` take them, so a fixture chapter's cards are seen; without it `E.cards` falls back to the global `PC.story`):
- When `E.currentFrame` has no `pick`: returns `null` and changes nothing.
- Right (or the guard): `cat.flags[pick.flag] = cardId`, then `E.go(cat, story, E.landing(cat, story, pick.next), now)`; returns the
  judge's result. The flag is **replaced**, as a choice's `sets` are: Back to the pick and a new right pick, or a reread, replaces it.
- Wrong: nothing in the save changes; returns the judge's result (the page shows the nudge). A card off the glow after the third: `null`.
- **Nothing is logged** (as an `ask`) and **nothing new is stored**: the pick's card is its flag in `cat.flags`, the record `when`
  already reads; the wrongs are the page's, never saved (a page reloaded mid-pick starts it fresh, with no glow). The save stays version 2;
  `E.migrate` and `normCat` are unchanged (flags are kept as they are).
- `E.next` on a pick frame does nothing (the frame has no `next` of its own: the pick is the only way on, as a lesson is a Counts
  frame's), but for the empty-file guard above. **`E.next(cat, story, now, stories)`** gains an optional fourth argument for it, read
  only on a pick frame, one branch after `to` is computed: `if (f && f.pick) { if (E.cards(cat, stories).length) return false; to =
  f.pick.next; }`. Without `stories`, `E.cards` takes its own fallback, the global `PC.story`, which on the page is every loaded story
  (ui.js's `stories()`), so the page's existing `E.next` calls stay as they are; `renderPickFrame`'s Next (the guard's) passes
  `stories()`, and the engine test's fixture passes its own list (without it, the fixture chapter's cards, which are not in `PC.story`,
  would read as an empty file, and E.next would follow `pick.next`). `E.back` is as on any frame; Back from the answer screen lands on
  the pick frame, which starts fresh.

**The view and the words** (pure): `E.pickView(frame, cat, stories)` is `{ claim, word, who, by, right: [the right cards she holds, in
her file's order], file: E.caseFile(cat, stories) }` (`word` the claim's one word in capitals); `E.pickWords(frame)` is `{ prompt,
label }` with the defaults above.

**The hooks** (each a branch only a `pick` reaches): `E.KINDS` gains `'pick'` (after `'file'`); `E.kindOf`: `if (frame.pick) return
'pick';` after the `file` line; `E.exits`: `pick` → `[frame.pick.next]`; `E.next`: its one pick branch (above); `E.checkStory`: its
kinds list gains `'pick'` (its message reads “needs exactly one of next/choice/input/look/counts/skip/scratch/file/pick/ask/end”), and a
pick block after the `ask`
block checks that `pick` is an object; `claim` is a line with exactly one word in capitals (two letters or more); `who` (default `reynard`) is
in the frame's cast (Reynard is on every pick panel); `by` (when given) is a non-empty string (the engine has no list of speakers:
`NAMES` is ui.js's, which Node's `_load` skips, so the check that `by` and `who` are speaker ids is in `tests/story-ch10.test.js` and the
engine test's fixture); `right` is a non-empty list of known card ids;
`own` (when given) maps known cards not in `right` to lines; `nudges` is two non-empty lines; `flag` is a string that no frame `sets`, no
choice option sets and no other pick uses; `prompt` and `label` (when given) are lines; and **every `when` in the story that names a
pick's flag** (a caption's, a balloon's, a frame's, an option's, inside `not` too) **names only cards in that pick's `right`** (a typo'd
id is an error). Every chapter 1 to 9 story stays clean.

**What the page offers** (`app/ui.js`, a section of its own, "the card pick", beside the Case File's):
- **On the frame**: the panel (its scene, captions and balloons: Reynard's speech, Tallyheart's “That’s one.”), and under it the
  instruction, “**Pick a card** from your Case File.”, with the Case File's curl as its tap icon (chapter 4's `file` frame), the bottom
  row's Back, and the hidden button. A tap on the panel, on the icon, on the top bar's Case File button (which glows on a pick frame, as on
  a `file` frame), or Space, Enter or → opens **the pick screen**.
- **The pick screen** is her Case File's own screen (`#file`, over the page) in pick mode:
  - **its head**, in place of the title: **the claim strip**, the claim as his balloon (labelled as his balloons are, “Reynard”), its one
    word in capitals lit gold; under it, once she has picked wrong, **the nudge**, Tallyheart's whisper balloon (labelled “Tallyheart”,
    the newest only). The strip stays at the top while she scrolls. Its Close button reads “Back”.
  - **its body: her whole Case File as she holds it, laid out as `drawFile` lays it** (`E.caseFile`'s two groups, “What I saw myself”
    and “What I was told (to check)”, and its linked rows with their lines, side by side or one above the other as the Case File screen
    lays them; read in her file's order, above), every card face up, each a button with its picture, its mark and its line (the file's
    own `fileCard`). A tap picks the card;
    there is no large-card view in pick mode (the line is under each picture already).
- **A right pick**: the card glows gold and pops (scaled 1.08) and the others fade; `E.pick` (saving the flag and the landing) runs at
  the tap, and 900 ms later (at once with reduced motion) the screen closes and the page turns to the answer (`go('frame')`, plain:
  never `go('frame', { fromSkip: true })`, whose count in ui.js `tests/sw.test.js` pins at three), as a skip's last tap turns its page.
  **From the right tap to the page turn the pick screen ignores taps and keys** (another card, its Back, Escape, ←, a tap on the dark
  edge round it: `fileState.pending` is set for that time, and the hooks below read it), as a skip's last tap does, so nothing is
  judged after a right pick and the screen never closes on a pending pick. No word is added: the answer screen says it.
- **A wrong pick**: the card wiggles (the bark's wiggle) and the nudge appears under the claim. Never a sound, never red, never a cross: a
  wiggle and a whisper. **A double tap picks one card, not two** (as the skip's, the ask's and the bark's taps): after each pick the page
  re-arms the screen's tap guard (`fileState.at = now()`, the 350 ms that bindChrome's capture guard on `#file` already swallows after
  opening), and a tap on the card she just picked wrong, while its wiggle runs, is no new pick: the card wiggles again and the nudge
  stays. `PC.debug.pick` calls the pick handler directly, past the guard, so `#pick3`'s three taps count. **After the third**: the right
  cards she holds glow (the page's soft pulse) and the others dim (still readable); a tap on a dimmed card makes the glowing ones wiggle
  and gives no nudge (Read to me and the live region say the glowing cards' lines again, below).
- **Back** (the screen's Back, Escape or ←) closes the pick screen; the frame stays, and its wrong count and its count of openings are
  kept while she is on the frame (the page's, never saved; reopened after three, the glow is there). The frame's own Back steps to the
  previous frame.
- **Read to me** (the mute rules stand: nothing speaks unless Read to me is on; any tap stops the reading): on the pick frame, its
  captions and balloons, then the instruction (“Pick a card from your Case File.”), as a `file` frame reads its hint. On the pick screen,
  `pickPage`'s `speech` when it opens and its `said` after a pick (below):
  - **the first opening on the frame** (`opened` 1): the claim, in his voice (`PC.ui.speakers` pitch and rate), then every card's line
    in her file's order: **the cards' lines only**, no group headings and no link lines (only cards are picked; her whole file,
    headings and link lines included, is about 250 words for the thinnest file and 350 for the fullest, two minutes or more:
    `critic-pick-r1/speech.js`; the cards' lines alone are a little less);
  - **a reopen** after Back (`opened` 2 or more): the claim, then `said`, if she has picked wrong;
  - **after a wrong pick**, `said`, cutting off what was being read: the nudge (in Tallyheart's voice, whispered) alone after the first
    and the second; after the third, the nudge and then the glowing cards' lines in her file's order, so a listening reader hears where
    to tap;
  - **a tap on a dimmed card** after the glow: no nudge; the glowing cards' lines again (`said` without its nudge);
  - **a right pick**: nothing (the next page reads itself).
- **VoiceOver and keys**: the screen is a dialog labelled “Pick a card”; the strip a heading; the nudge a polite live region, which says
  what Read to me's `said` says (after the third, the nudge and the glowing cards' lines; a dimmed tap repeats it); each card's label
  its line and its mark's meaning, then “Pick this card.”; after the third wrong pick, dimmed cards carry `aria-disabled="true"` (still
  focusable, their labels unchanged) and the glowing ones keep “Pick this card.”; Tab through the cards, Enter or Space picks, Escape or
  ← closes.
- **Pure, for Node**: `PC.ui.pickPage(view, wrongs, nudge, opened)` → `{ strip: { who, text, word }, nudge: { who, text, kind: 'whisper' }
  | null, cards: [{ id, glow, dim }], speech: [...], said: [...] }`, which the page draws and the tests read. `opened` counts the openings
  of the pick screen on this frame (1 is the first), kept by the page beside `wrongs`. `speech` is what Read to me says as the screen
  opens: `opened` 1, the claim (`who` 'reynard') and every card's line in her file's order; `opened` above 1, the claim and then `said`.
  `said` is what the newest wrong pick says: nothing with no wrong pick; the nudge (`who` 'tallyheart', a whisper) after one or two; the
  nudge and the glowing cards' lines after three or more.
- **Hooks in shared code**, each a branch only pick mode reaches (with no `pick` on the frame and none in `fileState`, every one is
  today's code path, byte for byte):
  - `renderInteractionKind`'s `if (kind === 'pick') return renderPickFrame(…)`; `renderFrame`'s `soloOk` list gains `'pick'`;
  - `updateBar`: the glow's `=== 'file'` gains `|| … === 'pick'` (the `var hasFile = …` line above it stays byte for byte: section 6,
    "The files both touch"); the Case File button's handler opens the pick screen on a pick frame;
  - `openFile(o)`: an `o.pick` (the frame's view) is kept as `fileState.pick` and drawn by the pick section's own `drawPick` in place of
    `drawFile`; the plain Case File is drawn as it is;
  - `fileKey`, a first line: `if (fileState.pick) { e.preventDefault(); if (!fileState.pending && (e.key === 'Escape' || e.key ===
    'ArrowLeft')) closeFile(); return; }` (Tab, Enter and Space are left to the buttons; today `fileKey` handles ← only while a card is
    shown large);
  - bindChrome's backdrop click: `if (e.target === fo && !(fileState && fileState.pending)) closeFile();`, so a tap on the dark edge in
    the 900 ms after a right pick never closes the screen while the cat is already on the answer frame;
  - `fileCard(c, o)`: an optional second argument that only `drawPick` passes, read as `o && o.pick === true` (the plain file's
    `.map(fileCard)` passes an index there): it adds `id="pickcard-<card id>"` (so `shots.mjs`'s `@id` taps reach it), appends
    “ Pick this card.” to the label, and puts `aria-disabled="true"` on a dimmed card; with no second argument its HTML is byte-identical;
  - the speech: `drawPick` sets `currentSpeech` to `pickPage`'s `speech` (so `PC.debug.speech()` and `DRY=1 shots.mjs` on a `#pick`
    target print the pick screen's words, not the frame's: `drawFile` sets none), and the pick's `onClose` (`openFile`'s own option, so
    `closeFile` is unchanged) puts the frame's speech back and returns focus;
  - **the pick-mode class lives on the `.cf-in` wrapper that `drawPick` writes** (`<div class="cf-in picking">`), never on `#file`:
    `#file` lives for the whole page session and `closeFile` and `drawFile` never touch its classes, so a class set there would outlive
    the pick screen and restyle every plain Case File opened after it (later in chapter 10, and chapters 4 to 9 reread from the hub).
    Every `innerHTML` replaces the wrapper, so no plain file can carry it. **Every pick-mode CSS rule is scoped under `.cf-in.picking`**,
    so no rule on `.cfile`, `.cf-head`, `.cf-card` or `.cf-close` can change chapters 4 to 9's plain Case File (which no golden sees:
    they record engine output and art, never ui.js's HTML or index.html's CSS).
  Source pins in `tests/engine.test.js` (as `tests/sw.test.js` pins the other screens): `picking` is written in ui.js only inside
  `drawPick`'s `.cf-in`, and every index.html rule that names it is under `.cf-in.picking`; the double-tap guard's line (as the ask's
  “a double tap asks one question, not two”); `fileCard` with one argument unchanged.
- **`PC.debug.pick(ids)`** (after the Warrior Counts' `PC.debug.warrior` entry): opens the pick screen on the current pick frame and
  taps those card ids in turn through the pick handler (past the tap guard), for `tools/shots.mjs` (which reads `#` only on book, file
  and warrior targets).
- **The Grown-ups corner**: the five pick flags in words, built at load from the stories' pick frames: `FLAG_WORDS[pick.flag]` gets an
  entry for **every card id any loaded story defines**, a card in `right` as `'answered Reynard’s “' + claim + '” with: ' + the card's
  line`, any other as `'answered Reynard’s “' + claim + '”'` (the guard's, unreachable), so `openGrownups`, which reads
  `FLAG_WORDS[k][String(c.flags[k])]` and has no fallback, is unchanged and the corner never prints a bare id.

**The storyboard words** (`tools/storyboard.mjs`): a pick frame prints, after the panel's words, “**Pick a card.** Her Case File opens over
the panel, every card face up as her file lays them, under Reynard's claim “It FLEW out of your camp!” (FLEW lit). Right: Sprinkle can’t
fly. (`cant-fly`), Reynard calls ‘It FLEW off’ his little story. He wants the dry den. (`fox-brag`), Mizzle says Sprinkle’s wing was hurt
before the rain stopped. (`mizzle-wing`, a card only some cats hold). The fox's own card (`fox-flew`): “Hmm. That’s what HE says. Which
card shows what YOU found out?” Any other card: “Hmm. Does that one say if Sprinkle could FLY?” A second wrong card: “Think of Sprinkle,
under the bridge. Could she fly?” After a third, the right cards she holds glow. Her pick is remembered (`ch10PickFlew`).” **“A card
only some cats hold”** is every right card outside section 3's twenty, which the tool holds as a constant (`my-count` among them, since a
reread can drop it); no data rule is used (a card definition's `when` misses `dug-earth`, `prints-pile` and `prints-tracks`, and the
frames' `when`s misfire on `prints-marsh`). A `when` that reads a pick flag prints “if she answered with “Sprinkle can’t fly.”” (the
card's whole line, never cut), and a `not` of one “unless she answered with “…”” (the whole line). `--check-words` passes with the spec's
names.

**The tool's own graph** (it has its own `exits(f)`, apart from the engine's): `exits(f)` gains `if (f.pick) return [f.pick.next];`
before the `f.next` fallback, so `reach`, `order` and the read-through follow a pick, and the stash twin's frame `when` on `ch10PickBig`
is enumerated like any flag's (without it every frame after the first pick lists as "Not reachable from the start", and the panel counts
and minutes are wrong). **The picks get their own row** in "At a glance", `| Card picks | 5 (fNNN, …) |`; `taps` and the "Other things
she taps" row are unchanged (`taps` only decides whether that row prints, and its list runs every frame that is neither file nor ask
through `F[id].scratch.tap`: adding picks there would print them twice, and the filter would throw).
`docs/storyboard/ch10.md` never matches /Not reachable from the start/ (the words owner's test).

**Tests** (the engine owner's: a "card pick" block in `tests/engine.test.js`, on a fixture chapter with two pick frames and an answer
frame each):
- `E.kindOf`, `E.KINDS`, `E.exits`; `E.next` does nothing on a pick frame (the fixture's `stories` passed: its cards seen) and follows
  `pick.next` for a cat whose file shows no card; `E.checkStory` clean on the fixture and on every chapter 1 to 9 story, and each of its
  pick errors named (a claim with no word or two in capitals, an unknown right card, an own card in `right`, one nudge, a sticky or shared
  flag, a `when` naming a card not in `right`, `who` not in the cast, an empty `by`); `by` and `who` keys of `PC.ui.speakers.NAMES` (the
  fixture); no chapter 1 to 9 frame has `pick`. **The tests that pin today's kinds change with them**: `tests/engine.test.js`'s
  `assert.deepEqual(E.KINDS, [… 'file', 'ask', 'end'], 'chapter 5 adds ask')` (line 4159 in chapter 9's tree) gains `'pick'` after
  `'file'` (“chapter 10 adds `pick`”), and the two regexes on the kinds message (lines 4158 and 5365) read
  `…/scratch/file/pick/ask/end`, as the message now does.
- `E.pickJudge`: each right card she holds is right; a card she does not show is `null`; the own nudge, the first, the second, the third
  (the second again, never the first: the nudge is clamped, and the glow of her right cards in her file's order, groups then links);
  **after the third wrong pick, a dimmed card is `null` and a glowing card is right: no fourth nudge**; `wrongs` undefined read as 0;
  `E.pickOpen` before the glow (every card `E.cards` shows) and after it (the glowing ones); the guard's shape (`guard: true`).
- `E.pick`: sets the flag and lands on `next` (past a frame whose `when` does not match); a new right pick replaces the flag; a wrong pick
  leaves the cat deep-equal; a dimmed card after the glow is `null` and leaves the cat deep-equal; `null` on a frame with no `pick`; the
  fixture chapter's cards seen through `stories`; Back from the answer lands on the pick; nothing is logged.
- `E.pickView`'s `file` deep-equals `E.caseFile`; `word`; `E.pickWords`' defaults.
- `PC.ui.pickPage`: the strip, the nudge, glow and dim after three; `speech` on a first opening (`opened` 1: the claim, then every
  card's line in her file's order, cards' lines only, no heading or link line) and on a reopen (the claim and `said`; the claim alone
  with no wrong pick); `said` after a first, a second and a third wrong pick (the nudge; the nudge; the nudge and the glowing cards'
  lines); the corner's pick-flag words for a she-cat and a tom, a right card's and any other card's (every card id has an entry).
- The goldens: chapters 1 to 9 byte-identical (section 7, item 3).
- In Safari, for the ship's look (`tools/shots.mjs`, a section of its own): `ch10:fNNN#pick` (the pick screen open on the first claim:
  `PC.debug.pick([])`) and `#pick3` (after three wrong picks, the glow: `PC.debug.pick(['tidy', 'otter-fox', 'reed-pile'])`, none in
  claim 1's `right` and none its `own`, so `cant-fly` and `fox-brag` then glow), the screen locked, a fresh short session each, silent.
  The look's cat is the thinnest file, not `PC.debug.goto`'s default (which holds no cards): `cards` section 3's twenty, `flags: {
  caseFileOpen: true, caseFile: true, ch7Flew: true }`, chapters 1 to 9 finished, at `ch10:<first pick frame>`. **And `#pickfull`**:
  the pick screen open on the first claim (`PC.debug.pick([])`) on **the fullest file**, the sticky strip over thirty face-up cards,
  the layout most likely to break: `cards` the thirty of `critic-pick-r1/fullest2.js` (section 3's twenty and `dug-earth`,
  `prints-pile`, `prints-tracks`, `sleet-den`, `my-count`, `squall-shapes`, `puddle-paws`, `wisp-fox`, `mizzle-wing`, `hail-shapes`), with
  the flags their definitions' `when`s need beside the thin cat's (the six found flags among them), checked in Node first
  (`E.cards(cat, PC.story).length` is 30). **Beside them, the plain Case File**: `file` on a chapter 9 frame with the thin cat, the
  "before" taken by the orchestrator on the snapshot tree before the build starts (section 10, step 1) and the "after" by the engine
  owner on the built tree, at the same frame and size, compared (the plain Case File unchanged by the pick's CSS).

### Data beside the engine (the engine owner's)

- **`E.GIFTS` gains the mist stone**: `{ id: 'mist-stone', name: 'Sprinkle’s mist stone: grey, until the moonlight finds it', from:
  'Sprinkle' }` (a gift, as Riffle's stone: data, no new behaviour; the story's words); the frame that lays it on the moss carries
  `gift: 'mist-stone'`, so My nest shows it under “From friends” and the page's note says “Sprinkle’s mist stone is in your nest.”. ui.js's
  `treasureSvg('mist-stone')`: a grey egg-shaped pebble with a band of blue and green across it. No live save has it.
- **`E.VERSION`** one minor version past the merged tree's `E.VERSION` as found after step 0 (section 10: the Warrior Counts' merge moves
  chapter 9's 0.9.0 to 0.10.0, since their branch never moved it), so chapter 10's is `'0.11.0 (chapter 10, <ship date>)'`, with its pin
  in `tests/engine.test.js`; the save stays version 2.
- **`PC.ui.speakers`**: `NAMES.mistscale = 'A Mistscale'`, `VARIANT_NAMES.mistscale = { 1: 'Mama', 2: 'The eldest Mistscale' }`;
  `VARIANT_NAMES.reedclan[5] = 'ReedClan’s leader'`; `VARIANT_NAMES.groveclan[3] = 'GroveClan’s leader'`. Granny is labelled by the
  chapter's `names` (`otter: 'Granny'`). Read to me (pitch, rate): Mama low, soft and slow (`PITCH.mistscale` 0.7, `RATE.mistscale` 0.8;
  `VARIANT_PITCH.mistscale = { 2: 0.6 }`, the eldest, who never speaks); ReedClan's leader `VARIANT_PITCH.reedclan[5]` 0.8, GroveClan's
  `VARIANT_PITCH.groveclan[3]` 0.88 (their rates are their Clans', which take no variant); Granny `VARIANT_PITCH.otter[3]` 0.92 (no rate:
  `rateOf(who)` takes no variant, and changing `RATE.otter` would change chapter 5's otters' voices). No new `faceHidden` pose. The tests
  that pin the speakers' lists and the corner's flags take the new entries.
- **`PC.ui.flagWords`**: `ch10Puddle`, `ch10Best` (section 1) and the pick flags (above).

### Where chapter 10 meets the Warrior Counts (the merged tree's API, `docs/warrior-counts.md` v0.2)

- **What chapter 10 sets**: `PC.story.ch10` with `id: 'ch10'` (`PC.warrior.after`), `number: 10`, and its last frame `end: true`. Reaching
  it finishes chapter 10 (`cat.finished.ch10`, `arrive`'s), and that alone opens the Warrior Counts: `E.warriorState(cat, stories,
  now).open` is `E.isFinished(cat, 'ch10')`, the hub's big button offers them, and the corner's line reads them open. **Chapter 10 calls
  nothing** of the Warrior Counts and reads no `cat.warrior`.
- **The teaser** is the Ceremony's (section 5). `E.teaser` is unchanged; the Warrior Counts' UI hides the hub's "coming soon" while they
  are open (`hideSoon`) and shows “Your ceremony is coming soon.” in place of chapter 10's teaser lines in her book once she has passed;
  when the Ceremony chapter (`opensWhen: 'warrior'`, number 11) is built, `E.teaser(ch10)` is `built: true, next: 'ch11'`.
- **The 7s**: `ch10-sevens` (table 7) is the 7s' own Count, so `E.warriorAnchor` and `E.warriorAsk` find the 7s there (7 × 7 is helped as
  clutches, with this set's help openings, `E.hollowDef(stories, 7)`), and the Hollow's tricky greeting can name “the 7s”. The Warrior
  Counts' tests stub a chapter 10 with the same set id: once chapter 10 is built, their stub stands beside it (it is a test fixture),
  and with the real `ch10-sevens`, `ch10-ferry` and `ch10-sixty` beside it `E.warriorAsk(7 × 7)` takes the clutches and their help
  openings with nothing leaking (run on a scratch copy of the merged tree: `critic-warrior-handoff/`). **One Warrior Counts test does
  not stand**: `tests/warrior-ui.test.js`'s first hub test marks every chapter of `E.chapters(PC.story)` finished and expects no Warrior
  Counts, so once `PC.story.ch10` exists (the stub included) it finishes chapter 10 too and fails. The orchestrator changes it with the
  stub (section 10, step 3): every chapter finished but `PC.warrior.after`, the null assertion kept.
- **The words**: Tallyheart's “When you pass your Warrior Counts. They’re yours, whenever you’re ready. At the fountain, like
  {Murmur}chime.” and {Murmur}chime's “When you sit your Warrior Counts, I’ll be right at the front.” are the story's own lines
  (warrior-counts.md section 1 gives a looser example: “The Warrior Counts are yours, whenever you're ready. At the fountain, like
  {Murmur}chime.”, and “Murmurchime at the front”), and the teaser is warrior-counts.md's "Pass your Warrior Counts, and the Clan will
  gather for your name.".
- **`ch10Best`** is the Ceremony's to read (E.matches), for Glintstar's first suggested ending.
- **The files both touch**, and how they meet: in `app/engine.js` the pick's code is a section of its own after the `ask` section (before
  "flow"), with one-line hooks in `E.KINDS`, `E.kindOf`, `E.exits`, `E.next` (its one pick branch) and `E.checkStory` (its kinds list,
  and a pick block after the `ask` block), the gift's entry in `E.GIFTS` and `E.VERSION`: none is in a function the Warrior Counts
  changed (`E.isOpen`, `normCat`, `E.recordLesson`, `E.hollowLines`, `E.hardFacts`, their new section). In `app/ui.js` the pick's code is
  a section of its own after the Case File's `drawFile`; its hooks are the ones listed above ("Hooks in shared code"). Only two of them
  are in spots the Warrior Counts also changed: `updateBar` (one expression: the glow's) and the `PC.debug` object, where `pick:` goes
  after their `warrior:` entry, with a comma (one entry); the Case File's `openFile`, `fileKey`, `fileCard` and bindChrome's backdrop
  handler the Warrior Counts never touched. **`tests/warrior-ui.test.js` pins ui.js's and `tools/shots.mjs`'s source text by regex**,
  and no owner holds it: the engine owner leaves every pinned line byte-identical, among them updateBar's `var hasFile = n === 'frame'
  && !!cat && E.hasFile(cat) && !inLesson;` (beside the glow line the pick changes), `warrior: function (what, i) { return
  warriorDebug(what, i); }` (beside which `pick:` goes), shots.mjs's `run('return PC.debug.warrior(arguments[0], arguments[1]);', …)` and
  its `WARRIOR` recipe (the `const WARRIOR =` template the test evaluates), and the lesson and hub lines, and runs
  `tests/warrior-ui.test.js` before handing back.
  `index.html`: the pick screen's CSS in a block of its own after the Case File's; the script tags are the stub's (section 10).
  `tools/storyboard.mjs` and `tools/shots.mjs`: sections of their own; the Warrior Counts' `warrior.md` and `warrior:*` targets stand.
  `sw.js`: the stub's entries and `CACHE` (section 10).

## 7. Known issues the text critics left

Checked against Draft v0.5. The text took four rounds (v0.2 to v0.5); every low of every round (`critique.json`'s, `critique-verify.json`'s
and `critique-r4.json`'s `known.lows`) was applied by v0.5 but those below, and every editor's skip is either applied another way (its
reason recorded with it in those files) or listed here. Applied, among others: the second nudges of claims 2 and 3 and the first of
claim 4; Puddle's card along the mossy edge; the mist up the river; “One more small shape” for five of the six; the tunnel “still open”;
the old tom's GLASS joke; the ferry's 3 × 10 for 6 × 10; “as the Moon Ferry bumps home”; the case's layout note; the Ceremony's teaser in
the inherits; “Granny winks.”; `sleet-den` dropped from claim 5; the tree as a one-pair ask; the warm-up's one easy eight; Puddle's own
right lines; the sixty's fillers and marks; 21 typed answers; the friends' group cheer; the eldest, grey and weathered, never silver; the
badger's old track; Reynard's tone; the tail in the mist; “Two big eyes”; Mama huge, her face in the clearing; the echoes for the README;
the grey tom's one bedtime line; “Twenty-eight!”; “That night, she couldn’t.”; “And today is that day.”; the hook's wording and placing; the
minutes; the none-found farewell; Tallyheart's four replies; the kept thanks; the past tense of FLEW; the end line; the water cat's calm
mentor; the Taps by count; Granny as otter variant 3; Thymeleaf's “Forty-eight!”; “our pile”; the 7s' order (7 × 3 before 4 × 7); the
giveaway note; 7 × 7's retry words in both sets; the warm-up's and the ferry's notes; and the build keys the notes carry, moved into
this spec (sections 2 and 5). What is still open, and how the build handles it:

1. **The story is final at Draft v0.5.** No word of it changes. Where its italic notes and this spec differ, the spec is the build's
   (item 2 lists them).
2. **The story's notes this spec supersedes** (she reads none of them; no line she reads changes):
   - *the pick screen* (“Her file opens over the island’s own picture, laid out as chapter 9’s case was, its rows and their names …,
     every other card stacked but still pickable”): the pick screen is her Case File's own screen, over the page, **every card face up**
     as her file lays them (its rows, which are chapter 9's case rows, and its two groups), none stacked (a stacked card cannot be read);
   - *“after a third the right cards glow, so every pick ends within four taps”*: made true, as “within four picks”, by letting only the
     glowing cards be picked after the third wrong one (section 6: a tap on a dimmed card is no pick, `null` in the engine too);
   - *7 × 8's way* (“Twenty-eight and twenty-eight. Twenty and twenty make forty. … fifty-six.”, “chapter 9’s way”): chapter 9's way
     exactly, `WAY56`, as the note names it; the note's added first sentence would make the miss line 24 words, past the 22 a miss line
     may have (section 2). This is the one help line quoted in a note that she reads shorter; every line the story letters is unchanged;
   - *the sixty's help “in Tallyheart’s whisper”* and *“a miss gets two whispered tens”* (For us, call 5): the engine letters every line a
     set words (the filler opening, the help opening, the count) as a plain balloon, and no Counts key carries `kind: 'whisper'`, so the
     tens and the count are Tallyheart's ordinary balloons;
   - *the confession* (“Six taps, one balloon to a tap … the sixth turns the page”): an `ask` letters two lines a tap and never turns the
     page on its last, so it is three taps of two balloons, Snatch and Snip by turns, and Next after the third (chapter 9's Thymeleaf);
   - *the goodbyes* (“**Tap** each dragonet to say goodbye. One tap for each dragonet she found …, its goodbye in its balloon; the last
     tap turns the page”): a scene cannot show only the dragonets she found, so each is a frame of its own with its found flag, the
     dragonet beside her, **its balloon (or Wisp's caption) before her Tap**, and the prompt “**Tap** to say goodbye.” on each (the
     story's line for just one; “each dragonet” would be wrong on a panel with one);
   - *“Tap the clutches … in the sand”*: the skip's picture is the lesson's clutches (a skip has no sand picture; the caption carries the
     scratching), as chapter 9's spiders;
   - *the Moon Ferry boarding* (“chapter 5’s words, hers, over the four taps”): Tallyheart's, as in chapter 5 (she says “I’ll count.”);
     the count is the engine's words, “One.” “Two.” “Three.” “Four.”, and the caption after it keeps the story's “FOUR.”;
   - *“a Clanmate cheers”* for 7 × 7: the story's “Forty-nine!” has no speaker; it is Tallyheart's (section 9, call 9);
   - *the mist Tap's response* (“it swirls, and the tip of a huge, soft grey tail curls through it; the page turns”): the tail is on the
     next panel, with Mama's face (chapter 6's call 13);
   - *“Under the raft … at the Crossing before the Moon Ferry pushes off”*: on the Moon Ferry set's own cameras (`low`, `under`), as the
     story's boarding note says;
   - *“the `bridge` set by night from the path … no new look is needed”*: the bridge has never been drawn at night; the walk home is the
     riverbank's path by moonlight, and the voice in the stones is a caption (section 9, call 15).
3. **Chapters 1 to 9 byte-identical for every live save** (the orchestrator's "golden"). The proof is the golden owner's (section 10):
   `tests/fixtures/make-ch09-golden.js` records `tests/fixtures/ch09-golden.json` from the snapshot of the tree this chapter is built on
   (chapter 9 shipped, the hotfix and the Warrior Counts brought onto it by section 10's step 0), in a process of its own, as
   `make-ch08-golden.js` recorded chapter 8's. **Its version constant is the snapshot's own `E.VERSION`** after step 0, `'0.10.0 (the
   Warrior Counts, <date>)'` as step 0 writes it (read it from `GOLDEN_ROOT/app/engine.js`), not chapter 9's '0.9.0 (chapter 9,
   2026-10-24)': its model records only when `E.VERSION` is its constant (`make-ch08-golden.js` exits with “This tree is not chapter
   8’s (…)” on any other), and `golden-ch08.test.js` pins `GOLDEN8.engine` to it, so a maker with chapter 9's string would refuse the
   snapshot. The test's message calls it the engine of the merged tree chapter 10 is built on, not chapter 9's. It records chapters 1 to
   9, every frame and what it shows (the scene with her options filled and a hash of its drawing, ids stripped;
   captions and what Read to me says; balloons with labels and voices; options; the card under the panel; her whole Case File; the pages
   she taps), every skip tap by tap, every question, picture, line and help hop by hop, the Training Hollow (the 8s' rounds among them),
   the book with its dragonets, the grown-ups corner, the hub and the cat. Its scripts cover every specialty and worry, told and kept, both
   chapter 2 paths, the roofs, Puddle, Wisp, Sleet, Hail and Mizzle found and not, both of chapter 8's routes, slow and quick, a tom, and
   misses of every kind in chapter 9's sets. Its test, `tests/golden-ch09.test.js`, compares today's tree: (a) chapters 1 to 9 handed to
   the engine, exactly; (b) every loaded story handed to the engine, exactly, but for the deltas a later chapter is allowed, by name:
   chapter 9's teaser in her book `built: true, next: 'ch10'` (its words as they were) and the hub's next chapter. The stub keeps both
   deltas in both states (the test tells the stub by its boards, `'STUB.'`, and says which state it ran in). `ch08-golden.json` (as
   step 0 re-records it for the hotfix) and the older goldens and their tests stay as they are and must still pass. **The
   fingerprints**, each art owner's for its own files, recorded once from the snapshot in a separate process and committed as
   constants: the riverbank's frames of chapters 2 to 9 (the places owner);
   the den's frames and nest for every file a live save can hold after chapter 9 (1 to 30 cards, 0 to 11 under the moss, `hidden`,
   `glass`, both facings), the tower's and the hollow's, and, since `K.crowd` rewrites the camp's crowd code, **every `scene` in
   `app/story/warrior.js`** (`PC.warrior`'s fountain with the crowd and quiet, the halfway frame, the pass's Waffles frame on
   `tower`/`balcony`) and every shipped camp frame with `crowd: true` (the nest owner: the Warrior Counts' pages are in no golden, which
   records `PC.story` only, and they go live with chapter 10); in `tests/cats.test.js`, `sweep7` re-taken without the plain per-7 sand
   (`sweep8` unchanged), and a `sweep10` of chapter 9's own cast and Counts art hashed on the snapshot (the cast owner). The words owner
   regenerates every storyboard with the bare `node tools/storyboard.mjs`: chapters 1 to 9's and `docs/storyboard/warrior.md` come out
   byte for byte (`tests/storyboard.test.js` compares them), but `ch05.md`'s book rows.
4. **The goodbyes' Tap comes after the balloon** (item 2): the beat is the same (one tap for each dragonet she found, in the story's
   order), the order within each is the dragonet's goodbye, then hers.
5. **The dish on her old step** (the heart critic's optional beat, H12): skipped by the editor (words and time; call 9's list of home beats
   does not have it; her last line is already “And you’re HOME.”). Not built.
6. **The warm-up can lend its own 2 × 8 back after three misses**, only when its hard pick is 8 × 3, 3 × 8 or 8 × 5 (section 2; the
   story's own note). The words are true. Kept, pinned by the story builder's test (as chapter 9's item 6).
7. **The 7s' giveaways after two misses of one fact** (section 2): the story's three, and two more the run found (4 × 7's help before
   2 × 7's last retry; 7 × 8's prompt before 4 × 7 as a filler). Kept: by then the help has counted each twice, and moving them would break
   the stepping stones that point back.
8. **Puddle's riddle and the sixty lend the same easy tens** (1 × 10, 10 × 2) to a cat who misses both (section 2): the riddle is chapter
   5's set, so they are not siblings. True and easy, minutes apart, as bumps and then as fish. Kept. **And the riddle meets the ferry**:
   missed twice, the riddle lends 10 × 3 (“Do another one! Three logs. How many bumps?”; run: !4x10 1x10f 10x2f !4x10r 10x3f 1x10f
   4x10r), and any miss there counts 10 · 20 · 30 · 40, minutes before the ferry's third question, 3 × 10 (“Both forepaws! Three cats.”).
   Known and kept: true, easy, and read first on the ferry (its own prompt), so it never touches `E.hardFacts`; pinned by the test. The
   only ferry 10s fact free of every collision would be 9 × 10 (1 to 5 × 10 are the riddle's, 6 × 10 the sixty's, 7 × 10 the lesson's,
   8 × 10 a possible warm-up pick), and the story is final.
9. **The Moon Ferry and the sixty can end without a cheer** (section 2): the ferry on a missed filler's retry (“There it is. You
   remembered that one.”) or a third miss; the sixty on a missed filler's retry, after “SIXTY!” / “A good count.” (run: !10x6 !1x10f
   10x2f 10x6r 1x10r), Snatch's “Twenty-four?” following. The story's note says so (“a right last answer is always cheered but a
   filler’s”). Kept; both pinned by the test.
10. **Sounds and tags that are not lettered**: a Counts line has no sound slot, so Granny's *Thump!* is said in its caption's words
    (“Thump! Granny bangs her pole.”: Read to me says it); speech-tag narration is carried by the picture, not lettered: “…,” says Riffle,
    **as the Moon Ferry bumps home** (the ferry at the Crossing's stones); “…,” he whispers, **as loud as a whisper goes** (a whisper
    balloon with its capitals); “…,” calls Waffles, **from her balcony, of course** (she is at her railing); “Across the den, the grey tom
    mumbles,” (the grey tom across the den). The small voices' “HERE! HERE! HERE!” and the dogs' “BYE, GIANT SQUIRREL!” are lettered as
    sounds, read aloud by `sfxRead` (section 5).
11. **Granny is chapter 5's otter variant 3** (the r4 verify critic; applied in the story): the README's "Claude's calls under decision
    46" should say so, and why (variant 2 is chapter 5's gossiping “he”): the editor could not write there (section 10).
12. **Chapters 5, 6, 8 and 9 read `foundPuddle` on a reread**, so a cat who met Puddle here sees their found variants when she reads them
    again (as a `ch5Roof` or `ch9Roof` cat does): chapter 5's raft and mud tally, chapter 6's news to Sleet, chapter 8's “Clever little
    paws. Just what Puddle saw!” and its news to Hail, chapter 9's any-found lines. Only the pages are made to say "found" in the right
    chapter (section 5: chapter 5's page).
13. **`my-count` may be missing** (chapter 7's known issue 15): nothing in chapter 10 requires it; the sixty is said and typed on every
    path, and a cat who answers the fourth claim with it reads “Your count,” after.
14. **The For us figures are the story's model**: the build counts the confession as three taps (not six) and the goodbyes as one frame
    each, so the reading's Taps differ by a few (never more than the story's longest); the words and the minutes stand. Frames: about 112
    on a plain reading with no dragonet found, about 119 with all seven, up to about 133 with every worry's and specialty's panels and
    Puddle's scene (112 + 7 + 9 + 5: section 10, with the HERE! panel); under the brief's 170. With Read to me on, the pick screen's
    first opening reads
    her whole file (two minutes or more a pick, section 6), past the story's 25 seconds a pick: the minutes are for a cat who reads.
15. **One caption has no sentence break and runs past 95 characters** (the badger print): split at its colon, the second box running on
    (section 5), as chapter 9's balloon that ran on.
16. **The work-folder runs** (r4's skip 3): the story says "run in the engine" and cites none; this spec cites its own runs in
    `~/potomac-crossing-work/ch10/spec-writer/` (as chapter 9's did), and the critics' are in `critic-counts-v04-r1/` and `editor-v04-r1/`;
    the spec critics' (v0.1 to v0.2) in `critic-spec-counts/`, `critic-pick-r1/` and `critic-warrior-handoff/`, the editor's in
    `spec-editor/` and `spec-editor-r2/`; the verify critics' (v0.2 to v0.3) in `critic-edit-round/`, `critic-cardpick-r1/` and
    `critic-build-merged/` (the scratch merge of chapter 9, the hotfix and the Warrior Counts, its `merge.sh` and test runs), the
    editor's in `spec-verify-edit/` (with v0.2 as `spec-v0.2.md`).
17. **The sixty's empty prompt is a first use** (section 2): a sixty resumed mid-question (the page closed on it) has no intro to say
    (`lessonIntro` returns nothing), so the first question shows `10 × 6 = ?` over six nights of marks with no words; its retry has its
    own words. Rare, and she has just read the frame. Kept (the alternative, our cat's line as the fact's own prompt, moves a line off the
    story's screen).
18. **The Moon Ferry's eight are all groups first** (`8 × 1 = ?` … `9 × 4 = ?`, `6 × 8 = ?`: the story writes each fact's order), so the
    "every table, mixed" review never shows the other order (module 1's both-orders rule). The 7s lesson balances its own five and five,
    and flipping a ferry fact would change the sum she reads; kept as the story has it.
19. **The depth faults the hotfix left are deferred again** (`hotfix-ch08/plan.json`, "notFixing"): ch04 f043 (Glintstar's tail tip
    across Tallyheart's cheek, about 3.5% of her head, a noticing cat's panel only; the plan said to batch it with the next chapter) and
    the faint far-over-near overlaps in ch01 f029a, f030 to f033 and f055, ch04 f028, ch06 f069 and ch07 f067 (1.5 to 5% of a head, mostly
    shadow edges; ch01 f055's purr arcs walk the cast in order). Chapter 10 takes none of them: chapters 1 to 9 stay byte-identical for
    the golden (item 3), and fixing f043 would pull the ch04, ch06, ch07, ch08 and ch09 goldens and the ch04 storyboard into this build.
    They wait for a later release (section 9, call 35). ch09 f112, the one chapter 9 frame with the pile's fault, is fixed before the
    snapshot (section 10, step 0), so it is in the golden as fixed.

## 8. What chapter 11 inherits

Chapter 11 is the Warrior Ceremony (decision 34; `docs/warrior-counts.md`): a chapter with `opensWhen: 'warrior'`, open once she has
passed her Warrior Counts, which open once chapter 10 is finished. Module 1 ends here; the badger's track is module 2's.

- **When.** Chapter 10 ends the night of the full moon, day 14, the Gathering over; she sleeps at home. The Ceremony is the evening of
  the day she passes her Warrior Counts, whenever that is: the pass page's “Tonight, the Clan gathers again. For your warrior name.”
  (Glintstar, in morning light, `app/story/warrior.js`), and the teaser's “Pass your Warrior Counts, and the Clan will gather for your
  name.”. **Where**: the Ceremony's own call (only the Counts are taken at the fountain, chapter 3's scene; neither warrior-counts.md nor
  decisions 48 and 49 place the Ceremony).
- **Who she is.** {name}paw of CrystalClan: Glintstar, in front of every Clan, “{name}paw, you belong to CrystalClan.”; her one moon is
  over. **Still {name}paw**: no warrior name (decisions 13 and 34). Tallyheart: “Still {name}paw, for now. Your warrior name is coming. And
  this moon will be in it.” and “When you pass your Warrior Counts. They’re yours, whenever you’re ready. At the fountain, like
  {Murmur}chime.” {Murmur}chime: “When you sit your Warrior Counts, I’ll be right at the front.” **The promise the Ceremony keeps**: this
  moon in her name, drawn from `ch10Best` (`sprinkle`, `friends`, `truth`, `counts`: what she will remember most) and what she did
  (module-1's endings).
- **What every cat knows.** Everything: the Clans heard the case, card by card; Snip and Snatch confessed it all (two each, every night,
  up the tunnel, tidy, the shiny bit by the pile, the dry den, and they cannot count); the dragon was innocent (“We were wrong.”); the
  Mistscales keep the Accord; Sprinkle is home. ReedClan and GroveClan honoured her too (they purred her name), and their gifts mended the
  wing (“So THAT’S what our root was for.” / “And our moss. I’ll remember that.”).
- **Where they are.** Reynard, Snip and Snatch past the last post, off every Clan's territory and the river (Glintstar's, both leaders',
  Granny's); the prey comes home from the stash tomorrow (CrystalClan's and ReedClan's). The clutch gone home upriver with the Mistscales,
  all seven (decision 19), Squall by way of one last roar from his tower; the tunnel still open behind the pile, nobody using it; Waffles
  on her balcony, a witness at the Gathering (“I have to lie DOWN.”); Riffle at the Holt (“See you tomorrow?” “And the day after.”); the
  Clan in camp; she in her nest.
- **What she keeps.** **The mist stone** on the moss of her nest and in My nest (a gift from Sprinkle, `mist-stone`): grey until the
  moonlight finds it, then blue and green (“that’s me, saying hello”); the real labradorite is Aron's to give. Her glass in its leaf and her
  secret bark under the moss; Riffle's stone; her Case File, final at 20 to 30 cards (30 only by a reread, section 3; `puddle-paws` given here to a cat who met Puddle).
- **The Counts.** Ten Counts, ten claw marks (“Every Count a warrior needs.”); the 7s are “Clutches of seven · the 7s” (`ch10-sevens`); the
  Hollow offers all ten; 7 × 7 met twice (the lesson and the Moon Ferry). Her answers since chapter 1 are in `counts`, where the Warrior
  Counts read her tricky facts (`E.warriorHard`).
- **Flags**: `ch10Puddle` (sticky), `ch10Best` (replaced: the Ceremony's), the five pick flags (this chapter's only: a later chapter must not
  read which card answered which claim). Every dragonet's found flag is final: a dragonet not found was never met (“To be met another
  time.”), and all seven got home. All seven found earned the eldest's bow.
- **Words on screen now**: Gathering Island, the great tree (never a name), the truce, luggage, a mist stone, a soft voice, Mama, the
  eldest of all the Mistscales, ReedClan's leader, GroveClan's leader, Granny (spoken at last), badger. Labels: “Two big eyes”, “A soft
  voice”, “ReedClan’s leader”, “GroveClan’s leader”, “Granny”. Not used: StarClan, Twoleg, kittypet, Ironsnake, whisker-length,
  claw-length.
- **Drawn now** (copy into continuity's places table at ship): the `ferry` set (the line of rafts at the Crossing at dusk, aboard by the
  full moon, the luggage heap, the low raft and its gap, the moonlit river) and the `island` set (the shore and its badger print, the
  clearing under the great tree with every Clan, the three roots, the mist, the sky over the crown, her paws with the stone); the den's
  `moon: 14`, `miststone` and `stone` close-up; the tower by night; the riverbank by moonlight with a small flyer; the grown Mistscales
  (Mama, the eldest), ReedClan's and GroveClan's leaders, Granny speaking; Puddle's `eyes`, the dragonets' `tap: 'nose'`, Reynard's `bow`
  and `swim`, the weasels' `swim` and `hidepaws`, `wet`; our cat's `holds: 'miststone'`; the clutches (the 7s' picture), the sand and the
  marks at per 7, the roll call's misty forepaws.
- **Standing rules, still**: as chapter 9's, and: the moonlit river is silver-blue, never black; nobody fights or is hurt (the foxes were
  sent off by every Clan standing together); the Mistscales are gentle, never frightening, no teeth or claws; the badger is a curious hook,
  never seen, never scary.

## 9. Calls made

1. **Five pick flags hold the picks, beside one choice flag and one sticky flag.** Reason: the screen after each pick says the card she
   picked, and a claim's card is read again two screens on (the sixty's “And your count?”); a flag is the record `when` already reads, so
   the engine needs no new key for it and nothing new is stored. The brief's "at most one choice flag" is about what later chapters read:
   only `ch10Best` is for the Ceremony.
2. **`ch10Best` is the one choice flag; the light choices set nothing.** Reason: the brief; the story's call 13 (the Ceremony reads it).
3. **What answers what is the pick's data, not the cards' `answers`.** Reason: every claim has two to fourteen right cards, from five
   chapters; writing `answers` on shipped cards would edit chapters 4 to 9's data, and `answers` drawn by the Case File would move live
   files. `fox-flew`'s `answers` stays stored and unread.
4. **The pick screen is her whole Case File, laid out as the file is, every card face up.** Reason: the orchestrator's design and the
   story's "her Case File opens"; a stacked card cannot be read or picked by an eight-year-old; the file's rows are chapter 9's case rows.
5. **A wrong pick wiggles and gets Tallyheart's whisper; after the third, only the right cards she holds can be picked, and they glow.**
   Reason: the brief's "never a fail"; the story's "within four taps" (four picks: a tap on a dimmed card is no pick, `null` in the pure
   engine as on the page); a tap off the glowing cards does what a tap off a skip's glowing group does.
6. **The wrong count is the page's, never saved; nothing is logged.** Reason: a pick is a Tap that cannot be got wrong (as an `ask`); the
   save stays version 2 with nothing new in it.
7. **The confession is an `ask` of three taps, two balloons a tap; the goodbyes are a frame each.** Reason: the frame contract (an `ask`
   letters two lines a tap; a scene cannot show only the dragonets she found); no new engine key.
8. **In the 7s, only 7 × 7's right line plays on its retry.** Reason: the story names it alone; the other right retries get the engine's
   “There it is. You remembered that one.”, which says the fact came back and she knew it.
9. **The Moon Ferry's 7 × 7 cheer, “Forty-nine!”, is Tallyheart's.** Reason: the story gives it no speaker; she asked it, and the caption
   after it is the whole ferry's cheer.
10. **The Moon Ferry set's `thing` is `'leg'`, its table the 2s.** Reason: the spiders are keyed on `thing: 'leg'` and the engine hands the
    picture the set's `thing`, never a fact's; no other ferry picture reads it (run). The 2s group a borrowed ear filler (“One cat.”).
11. **The sixty's prompt is empty and its two frame balloons are its question.** Reason: the story's screen is Glintstar's line and our
    cat's; said again over the question (the default intro), they need no more words, and read under them it is never timed.
12. **The sixty's help opens with no numbers** (“Let’s hop it together.”; the count is “Ten, twenty…”). Reason: it lends a one-night
    filler (chapter 9's filler rule).
13. **Puddle's riddle is chapter 5's set, run as chapter 5 ran it, its balloon “Want a log riddle?”.** Reason: the story; the riddle is the
    set's own prompt, so the story's balloon is said once.
14. **The small voices' “HERE! HERE! HERE!” and the dogs' “BYE, GIANT SQUIRREL!” are sounds, with `sfxRead`.** Reason: their speakers are
    off the island or unseen, every balloon's speaker must be in the cast, and a shout from afar reads as a sound.
15. **Coil's “Quiet at last.” is a caption's quote, on the riverbank's path by moonlight.** Reason: the walk home is off the ferry and the
    bridge has never been drawn by night; a caption may quote (chapter 9's “Last night she said, “Next time, you take ME.””), and the voice
    in the stones is unseen.
16. **Two new sets, `ferry` and `island`; no new place for the walk home.** Reason: the brief's two places; the riverbank, the tower and the
    den take a moonlit look by option.
17. **The grown Mistscales are one new cast id, `mistscale`, by variant (1 Mama, 2 the eldest), drawn as a head and neck out of the
    mist.** Reason: they are huge (world.md); her face in the clearing, the rest of her in the mist; no body to draw, so nothing in the
    picture can frighten.
18. **The two leaders are their Clans' new variants** (`reedclan` 5, `groveclan` 3). Reason: the brief's labels only; a variant carries
    its label and its voice, as chapter 6's and 9's Clan cats.
19. **Granny is chapter 5's otter variant 3, labelled by the chapter's `names`.** Reason: the story's call (no new drawing; variant 2 is
    chapter 5's gossiping “he”); `names` labels every otter balloon in this chapter, and she is the only otter who speaks.
20. **The 7s' picture is keyed on `thing: 'dragonet'`, no kind; each clutch a row of four over a row of three.** Reason: the skip-count
    and the lesson share it (a skip passes no kind), and no fingerprint sweep reaches it; four sisters and three brothers (chapter 6).
21. **The sand at per 7 is four and three, and so are the marks at per 7 on a log; `sweep7`'s plain per 7 is re-taken, `sweep8` stands.**
    Reason: the story's help; no shipped frame draws plain per-7 sand (no set before chapter 10 is on table 7), and the only per-7 marks
    are the Moon Ferry's 7 × 7 on a log, so the nights' marks on sand and mud, which `sweep8` pins, stay five and two.
22. **The roll call's forepaws are chapter 3's thought come true: seven in a row, the unfound ones as misty shapes.** Reason: the story;
    `who` entries with `when` (chapter 5's), and a `shape: true` entry is the art's, no engine key.
23. **The roll call's after-screens are written out by the six found flags** (just one, two or more, five of the six, four or fewer).
    Reason: E.matches reads flags, not counts; a chain of frames with `when` and `else` reaches each cat's one screen with no engine change.
24. **The mist stone is a gift in My nest as well as on her moss.** Reason: decision 13 (her reward is a stone); a gift is data the
    engine already has (Riffle's stone), and My nest is where she looks for what she keeps.
25. **The den's last panel is a new close-up, `stone`.** Reason: the story's closing frame: the stone close and flashing, so she knows
    the real one when it is hers.
26. **Chapter 5's page reads `ch10Puddle`, in both of its lines that read `foundPuddle`** (the Puddle line and the forepaw line).
    Reason: a page says "found" only in the chapter that found him (chapters 4 and 9's rule).
27. **The book and the teaser are proposed here** (the story builder owns them). Reason: each sentence must be true on every path; the
    teaser is the Ceremony's.
28. **The golden of chapters 1 to 9 has an owner and a test file of its own** (`tests/golden-ch09.test.js`). Reason: chapter 9's call 25.
29. **The card pick's code lives in sections of its own in the files the Warrior Counts also changed.** Reason: the orchestrator's; one
    expression in `updateBar` and one entry in `PC.debug` are the only spots both change. The pick's other hooks in shared code (in
    ui.js `renderInteractionKind`, `soloOk`, the Case File button, `openFile`, `fileKey`, the backdrop, `fileCard` and the speech; in
    engine.js `E.KINDS`, `E.kindOf`, `E.exits`, `E.next` and `E.checkStory`: section 6) are branches only a pick reaches, in code the
    Warrior Counts did not change.
30. **The island's crowd stands when the story says every cat stands** (`crowd: 'standing'`, on `wide` and `fox`). Reason: the caption she
    reads on that panel is “Every cat on the island stands up, and every otter too.”; the seats' pose is the set's, so it costs one option.
31. **The crowd wears only anonymous coats** (`clancat`, `reedclan` 3 and 4, two new `groveclan` crowd coats 4 and 5, `otter` 1 and 2),
    and `K.crowd` leaves out a seat with an explicit `who` and `variant` that a member of the frame's cast has (new: the camp's `taken`
    only swaps a coat that is the player's fur, and seats without `who` keep it, byte for byte). Reason: GroveClan had no anonymous coat,
    and a crowd seat in a named cat's coat puts that cat in the picture twice.
32. **The roll call's HERE! is a plain panel of its own, with Mama `lift`.** Reason: an `sfxRead` is refused on a skip frame and a skip's
    scene is never drawn; the story breaks the screen there.
33. **The hotfix, then the Warrior Counts, are brought onto chapter 9 before the snapshot, each moving `CACHE` one past the tree's
    (v18, then v19, if chapter 9 ships at v17), the Warrior Counts moving `E.VERSION` to 0.10.0** (section 10, step 0). Reason: both
    sit uncommitted on chapter 8 and moved neither past chapter 8's (the hotfix's own v16 → v17 merges silently onto chapter 9's v17);
    the snapshot is every golden's and fingerprint's source.
34. **No depth rule: every crowded cast is listed back to front, and the leaders' roots sit behind their Clans' spots.** Reason: the
    hotfix's call (per-frame order, no set or kit rule: a kit-wide sort flips frames where the list order is the better one); chapter
    10's crowded panels get the hotfix's own check (section 5), and with the roots behind, the leader-first rule for balloons and back
    to front never disagree.
35. **The depth faults the hotfix deferred stay deferred** (ch04 f043 and the faint overlaps of chapters 1, 4, 6 and 7: section 7, item
    19). Reason: chapters 1 to 9 stay byte-identical for the golden; f043 would pull five goldens and a storyboard into this build for
    3.5% of a head on a noticing cat's panel.

## 10. For the orchestrator

- **Before the build, in this order** (on main after chapter 9 ships):
  0. **The hotfix, then the Warrior Counts, brought onto chapter 9** (the orchestrator's). **Neither is a commit** (header): branches
     `hotfix-ch08-f030` and `warrior-counts` both point at chapter 8's `b6a8d4f`, and the work is uncommitted in their worktrees, so a
     `git merge` of either branch as found does nothing ("Already up to date"), and every check below but (d) would then pass on a tree
     without them. Take each from its worktree in one of two ways: either its owner commits it on its branch first (Aron's or the
     orchestrator's call: agents treat both worktrees as read-only) and step 0 merges that commit; or step 0 brings its files over one
     by one, each a three-way merge against `b6a8d4f` (`git merge-file`, as `~/potomac-crossing-work/ch10/critic-build-merged/merge.sh`
     did on a scratch copy). The files:
     - **the hotfix**, `/Users/aron/potomac-crossing-hotfix`, 16 modified: `app/story/ch06.js`, `ch07.js`, `ch08.js`;
       `docs/storyboard/ch06.md`, `ch07.md`, `ch08.md`; `tests/fixtures/ch06-golden.json`, `ch07-golden.json`, `make-ch06-golden.js`,
       `make-ch07-golden.js`; `tests/scenes.test.js`, `tests/set-pile.test.js`, `tests/story-ch07.test.js`, `tests/story-ch08.test.js`;
       `sw.js`; `README.md` (`plan.json` records its fixer as stopped, but the worktree holds the whole fix: on the critics' scratch merge
       every hotfix test passes but the ones (a) names);
     - **the Warrior Counts**, `/Users/aron/potomac-crossing-wc`, 8 modified: `README.md`, `app/engine.js`, `app/ui.js`,
       `dev/gallery.html`, `index.html`, `sw.js`, `tools/shots.mjs`, `tools/storyboard.mjs`; and 6 new: `app/story/warrior.js`,
       `docs/storyboard/warrior.md`, `docs/warrior-counts.md` (already in main's tree, untracked, byte-identical to the worktree's),
       `tests/warrior-engine.test.js`, `tests/warrior-story.test.js`, `tests/warrior-ui.test.js`.

     (a) **The hotfix first.** Its files merge onto chapter 9 cleanly but `README.md`, which conflicts with chapter 9's (keep every
     side's decisions and calls), and `sw.js`, which merges "cleanly" to v17, because both sides made the same v16 → v17 edit: **move
     `CACHE` one past chapter 9's by hand** (v18 if chapter 9 ships at v17, as the hotfix plan says). Merged as it is, the tree then
     fails four tests, none of them chapter 10's or the Warrior Counts' (`critic-build-merged/merged-ch9-hotfix-warrior.test.txt`: 1,496
     tests, 4 failures), and step 0 fixes all of them before going on:
     1. **ch09 f112's cast.** `tests/set-pile.test.js`'s depth-hotfix test fails on “ch09 f112: clancat at `crowd-2` is drawn over
        clancat's head at `beside`”: chapter 9's montage (`app/story/ch09.js` f112) lists `beside` before `crowd-2`, the same picture
        as Charlie's ch08 f030. Reorder its cast with the `crowd-2` cat first, as the hotfix did its twelve (f112 has no balloon, so no
        speaker moves); regenerate `docs/storyboard/ch09.md` (one Cast line changes); optionally add `'ch09:f112'` to `DEPTH_FIXED`, so
        the guard names it.
     2. **The ch08 golden.** Both tests in `tests/golden-ch08.test.js` fail (first diff ch06 f004): chapter 9's
        `tests/fixtures/ch08-golden.json` was recorded on the pre-hotfix snapshot `~/potomac-crossing-work/ch09/shipped`. Re-record it
        with `GOLDEN_ROOT` on a copy of that snapshot with the hotfix's twelve reorders applied (`node tests/fixtures/make-ch08-golden.js`;
        the copy stays at `E.VERSION` '0.8.0', since the maker exits on any other), as the hotfix plan re-recorded the ch06 and ch07
        goldens: the diff is the readings' `shown` digests and `recorded` only.
     3. **Chapter 9's fingerprints.** `tests/scenes.test.js`'s `CH9_FINGERPRINT` test fails on “frames/ch07/pile draws something else
        than it did when chapter 8 shipped”: re-take `frames/ch07/pile`, `frames/ch08/pile` and any other entry the reorders move, on
        that same copy, saying so in the test.
     4. The `CACHE` bump above.

     (b) **Then the Warrior Counts.** Their files merge onto that tree cleanly in `app/engine.js`, `app/ui.js`, `tools/shots.mjs` and
     `tools/storyboard.mjs`, and conflict in `index.html`, `sw.js` and `dev/gallery.html` at the line after `ch08.js` (resolve each as
     `ch09.js`, then `warrior.js`) and in `README.md` (keep every side's decisions and calls). The merge moves `E.VERSION` to `'0.10.0 (the
     Warrior Counts, <date>)'` with its pin in `tests/engine.test.js` (their branch never moved it from chapter 8's '0.8.0 (chapter 8,
     2026-10-21)'), and `CACHE` one past the hotfix's (v19 if the hotfix took v18): `warrior.js`, `engine.js` and `ui.js` are cached
     files. They bring no `docs/build.md` section (the words owner's adds a pointer: below), and their tests had never run beside the real
     chapter 9.
     (c) `node --test` runs green on the merged tree.
     (d) **Checks a no-op merge cannot pass**: `app/story/warrior.js` is in the tree and loads (`PC.warrior.after === 'ch10'`), and
     `index.html` loads it after `ch09.js`; the three `tests/warrior-*.test.js` are in the tree and `node --test` reports their 67 tests
     passing; `tests/set-pile.test.js`'s depth-hotfix test and `DEPTH_FIXED` are there, and the twelve hotfix frames and ch09 f112 list
     the `crowd-2` cat first; `E.VERSION` is 0.10.0 and `CACHE` two past chapter 9's. Only then is the snapshot taken: it is every
     golden's and fingerprint's source, so a bad merge would be frozen into them.
  1. **The snapshot** is taken (`/Users/aron/potomac-crossing-work/ch10/shipped/`, from that merged tree: `app/`, `index.html`,
     `tests/_load.js`). It is the `GOLDEN_ROOT` and every fingerprint's source. Do not change it. **Then, before step 2, the plain Case
     File's "before" look** (section 6), on the tree as the snapshot froze it: `CAT='{…}'` holding section 6's thinnest-file cat
     (`cards` section 3's twenty, `flags: { caseFileOpen: true, caseFile: true, ch7Flew: true }`, chapters 1 to 9 finished) with its
     `at` on a chapter 9 frame, then `node tools/shots.mjs ~/potomac-crossing-work/ch10/file-before file` (her Case File open over that
     page), silent, the screen locked, a fresh short session; the `CAT` and the size go in the folder's notes, for the engine owner's
     "after".
  2. **Stub `app/art/sets/ferry.js` and `app/art/sets/island.js`**: each a set registered with `PC.art.defineSet('ferry', …)` /
     `('island', …)` (**its final `label`** from section 4, `'the otters’ Moon Ferry: a line of log rafts on the moonlit river'` /
     `'Gathering Island: the clearing under the great tree'`, `tod: 'night'`, one camera, `deck` / `wide`, **at least one anchor** on it,
     e.g. `'front': K.anchor(600, 900, 250)` / `'centre': K.anchor(800, 900, 250)`, `opts: {}`, `defaults: {}`, and a `draw` that paints
     nothing and returns `{ back: '', over: '', front: '' }`), with their script tags in `index.html` after `app/art/sets/grove.js`
     (ferry, then island) and both in `sw.js`'s `ASSETS` (chapter 8's and 9's lessons: zero anchors spins `tests/scenes.test.js`; a
     `draw` that returns `''` fails four render tests; and a set with no `label` renders `aria-label="undefined, deck"`, which
     `checkRender`'s no-'undefined' rule fails in "each effect alone, on every set" and the vocabulary sweeps).
  3. **Stub `app/story/ch10.js`**: `PC.story.ch10` with `id: 'ch10'`, `number: 10`, `title: 'The Gathering'`, `start: 'f001'`, two
     frames, `f001: { board: 'STUB.', next: 'f002' }` and `f002: { board: 'STUB.', end: true }` (so opening it finishes nothing:
     `E.startChapter` arrives on the start frame, and a start frame that is the end would set `cat.finished.ch10` at once, which alone
     opens the Warrior Counts and is never unset), empty `counts` and `cards`, and the teaser (`{ title: 'The Warrior Ceremony', lines:
     ['Pass your Warrior Counts, and the Clan will gather for your name.'] }`); its script tag in `index.html` **after `ch09.js` and
     before `app/story/warrior.js`** (the Warrior Counts' tag stays after the chapters); in `sw.js`'s `ASSETS`, with `CACHE` past step
     0's value (v20 or later if step 0 left v19); `docs/storyboard/ch10.md` generated from the stub (`node tools/storyboard.mjs
     app/story/ch10.js`). **`main` is never
     pushed while the stub stands** (a child's save would meet it). With the stub, the orchestrator also updates **chapter 9's teaser
     test** (below) and **`tests/warrior-ui.test.js`'s first hub test** ('the hub: no Warrior Counts before chapter 10 is finished'): it
     marks every chapter of `E.chapters(PC.story)` finished, which now includes `ch10`; it becomes `E.chapters(S).filter(s => s.id !==
     W.after).forEach(…)`, the null assertion kept (checked on a scratch copy: with the stub, or with the real chapter 10's three sets,
     it is the one Warrior Counts test of 67 that fails, `critic-warrior-handoff/`).
  4. `node --test`: only these may fail until their owners land (on the critics' scratch tree with labelled stubs and neither of step
     3's test changes, these failed and nothing else beside the four that step 0 fixes, 13 in all: `critic-build-merged/
     merged-plus-stubs.test.txt`, line numbers as found there; `set-tracks`' pins fail only once the places owner adds samples): the
     gallery test (`tests/scenes.test.js:2219`: `dev/gallery.html` must load every script `index.html` does, in its order, so it lacks the
     two set files and `ch10.js`: **the places owner** adds the tags and the samples); **`tests/set-tracks.test.js`'s gallery pins**
     (lines 788 to 796: it hashes every `SAMPLES` entry but `tracks` and `grove`,
     and allows only `['grove']` after `SAMPLES.tracks`, so `SAMPLES.ferry` and `SAMPLES.island` fail both: **the places owner** adds
     `delete others.ferry; delete others.island;` beside `delete others.grove` and `['grove', 'ferry', 'island']`, each with a
     chapter-10 comment, in chapter 9's style); the storyboard's words, `tests/storyboard.test.js:814` (“its words cover the art’s whole
     vocabulary”) and `tests/tools.test.js`'s four `--check-words` tests (286, 323, 357 and 403, chapters 6 to 9's specs: “No words in
     tools/storyboard.mjs for: set ferry”; the stub sets have no words: **the words owner's**); **`tests/story-ch09.test.js`'s
     teaser test** (with `ch10` in `PC.story`, `E.teaser(ch09)` is `built: true, next: 'ch10'` and the hub's next chapter `ch10`: **the
     orchestrator updates it with the stub**, as chapter 9's spec had chapter 8's updated); `tests/warrior-ui.test.js`'s first hub test
     (`:75`, changed with the stub, step 3); and `tests/scenes.test.js`'s pins that list the gallery's new keys and each set's cameras,
     anchors and options (`:3649`'s list of gallery keys among them; `gallery/ferry/<cam>`, `gallery/island/<cam>` for every camera in the
     vocabulary, and `gallery/den/stone`; the den's `cams`, `Object.keys(den.opts)` and `den.opts.moon`; the tower's options): **the nest
     owner's**, each changed with a chapter-10 comment so it passes on the stub and on the built sets. The Warrior Counts' tests keep their own
     stand-in chapter 10 (a fixture) and pass with the stub and with the built chapter, but for the hub test step 3 changes (the
     orchestrator's, with the stub: no owner holds `tests/warrior-*.test.js`).
- **Owners**: six, disjoint (the build's `owners`): **places** (the two new sets, the riverbank's options, their tests, the gallery page:
  append only, new `SAMPLES` and new `EXTRA` entries after the last, each new EXTRA's label beginning “chapter 10: ” (scenes.test.js's
  and set-tracks.test.js's rules), since the nest owner's fingerprints hash every old camera's sample and extra; it also samples the
  den's `moon: 14`, `miststone` and `stone`, the tower by night, and the hollow's `marks: 10`, as no other owner holds the page; and
  `tests/set-tracks.test.js`'s two gallery pins, step 4; and the island's `wide` depth, its roots behind every Clan spot, section 4);
  **cast** (cats.js, its test, its gallery: the new cast, poses, extras and Counts art); **nest** (scenes.js and its
  test: the den, the tower, the hollow's check, the kit's crowd helper, the new cast's scene rules); **engine** (the card pick and the data
  beside it: engine.js, ui.js, index.html, tools/shots.mjs, tests/engine.test.js); **words** (tools/storyboard.mjs and every storyboard,
  regenerated with the bare `node tools/storyboard.mjs`, `docs/storyboard/warrior.md` among them, byte for byte but ch05.md's book rows
  and the stub's ch10.md; docs/build.md, chapter 5's page, their tests); **golden** (the chapters 1 to 9 golden, its maker, fixture and
  test, its version constant the snapshot's). No owner holds `tests/sw.test.js` or `tests/warrior-*.test.js` (the orchestrator's): the
  engine owner leaves their pinned lines byte-identical and runs both before handing back. No owner for
  `app/story/ch10.js`, `tests/story-ch10.test.js` or `docs/storyboard/ch10.md` as built: the story builder's, later, with the tests that
  count Counts (the Hollow now offers ten; the tree's ten marks); chapter 9's teaser test is the orchestrator's, updated with the stub, and
  the story builder checks it still holds for the built chapter.
- **Engine need** (section 6): the card pick, the one the brief allows, as designed; the mist stone's gift entry is data. Record the pick
  in the README under "Claude's calls under decision 46" with chapter 8's precedent (a data key read by one chapter, chapters 1 to 9
  unchanged), and that nothing new is stored.
- **README** (end of the spec phase): section 9's calls under "Claude's calls under decision 46" (in short, as chapter 9's), and **Granny
  is chapter 5's otter variant 3** (the r4 verify critic's; the editor could not write there): variant 2 is chapter 5's gossiping “he”. At
  ship, the story's For us echoes into "Names and words that may still echo the books": the great tree's clearing (Warriors' Great Oak:
  leaders in its low branches there, on its roots here), Tree, Root and Stone as names in both series (lowercase nouns here), a mist stone
  (Mist- and -stone), the truce, and mist over a Gathering's moon (Warriors' broken-truce sign: here the moon glows through it and Sprinkle
  names it first).
- **`docs/continuity.md`** (ship): section 8; `ch10Puddle`, `ch10Best` and the five pick flags in the flags table (the pick flags marked
  this chapter's only); `puddle-paws` given again in chapter 10; the dragonets' table (Puddle under the Moon Ferry; every dragonet home);
  the cast table (Mama, the eldest, ReedClan's and GroveClan's leaders, Granny speaking); the Counts table (the 8s warm-up, the 7s lesson
  with 7 × 7, the Moon Ferry's eight, the sixty typed at last; ten marks); the places table (section 8, "Drawn now"); who knows what (every
  Clan, everything).
- **`docs/build.md`** gets a short "Chapter 10" section from the words owner: the card pick (pointing to section 6), the art's new names
  and the words as built; and, since the Warrior Counts brought none and `app/story/warrior.js` is a new kind of story file (`PC.warrior`,
  not in `PC.story`), a short pointer to `docs/warrior-counts.md`: `PC.warrior` and its `after`, its storyboard
  (`docs/storyboard/warrior.md`), and its test cat in `tools/shots.mjs` (the `WARRIOR` recipe and the `warrior:*` targets).
- **Can't be built literally, built nearly**: the speech tags' narration (section 7, item 10); “Granny winks.” (`kind`: no art draws a
  wink); “Tallyheart presses her head against yours.” (nose to nose: no art draws two cats touching); “Sprinkle wraps her tail round you”
  (Sprinkle `curl` beside her, the storyboard's own words); “every Clan takes one step toward the fox” (every cat standing, `crowd:
  'standing'`; our cat's step); “Back into the river he slinks” (`swim`); “The heap burps.” and “It giggles.” (captions over the heap; `puff`); “Out of the mist,
  from near and far, come small voices.” (unseen: a sound); “The last thing you see is Sprinkle’s tail, waving.” (`fly` small and far, her
  tail up); “Mama counts the claws” (her count in her balloon over the forepaws); the pick screen “over the island's own picture” (over the
  page: the Case File's screen); “the sixth tap turns the page” and “the last tap turns the page” (section 7, item 2).
- **Frames**: about 112 on a plain reading with no dragonet found (two at the start, eight in the Hollow, eight on the Moon Ferry, thirteen
  on arrival, twenty-three at the case, ten for the confession and the chase, seven in the mist, five at the roll call (the HERE! panel
  its own), three for the stone, six goodbyes, nine for the honour, nine on the way home, seven at bedtime, the dream and the end); +7 with
  all seven (the coming-out panel and six goodbyes); +9 for Puddle's scene; +1 to +5 for the worries' and the specialty's panels; at most
  about 133 (112 + 7 + 9 + 5). Under the brief's 170. With Read to me on, each pick screen's first opening reads her whole file (two
  minutes or more:
  section 6), so a listening reading runs longer than the story's minutes, which are for a cat who reads.
- **The ship's Safari look** should include: the Hollow empty, ten marks on the tree; a lesson question with seven clutches and one with
  six lit (6 × 7), the help's four-and-three sand; the five clutches skip; the Moon Ferry boarding at dusk and the deck by the full moon
  (the river silver, never dark), the luggage heap with its puff, the low raft with Puddle's foot, the gap with his eyes; a ferry question
  of each picture (9 × 4's nine cats, 6 × 8's spiders, 7 × 7's marks on a log, a missed one's help on the log); Gathering Island's shore,
  the clearing with every Clan and the three leaders on their roots, Reynard damp at the edge; **the card pick** (`#pick` and `#pick3`
  on the thinnest file, `#pickfull` on the fullest, thirty cards under the sticky strip), and the plain Case File's "after" beside step
  1's "before" (section 6);
  the sixty's six nights; the weasels swimming off; the mist with Mama's face and the tail; Sprinkle flying round the great tree; the roll
  call's seven forepaws with misty ones; a goodbye (Wisp's drawing); the eldest's bow; the stone in her paws, grey and flashing; the
  honour; the badger's old print; the tower by night with Waffles; the walk home by moonlight; the den's stone close-up at the end.

# Chapter 8 spec: The Night Trail

*v0.2 · 2026-10-21 (v0.1 with the spec critics' findings applied: the nest's third course only past what live
saves hold, with or without the moss; `fence-top` on the field's `wide`; the stub state's deltas and the stub
set's one anchor; the poses at `tunnel-end`, Riffle on all fours, a speaker on `stash-close`, the weasels'
holes, the crawl's roof, the spots at home and at waking; the moon's arithmetic for chapters 9 and 10; the
counts' wording. No word she reads changes.)*

*The build's contract for chapter 8, beside `docs/build.md`. The story,
[`08-the-night-trail.md`](08-the-night-trail.md) (Draft v0.4, final), is the source of every word she
reads; this spec adds no line she reads except the engine's own wording of a question, a filler's
opening, a retry's opening, a right retry's line and a last miss, each named here and kept to chapter 6
and 7's lines or the story's own words, and the book and the teaser, which it proposes. Every Counts set
below was run on the live engine (0.7.0) with scripted answers, exactly as written here
(`~/potomac-crossing-work/ch08/spec-writer/sets.js`, run by `sim1.js` to `sim3.js` there; the Case File's
links by `sim4.js`, with section 6's one engine change patched in; what chapter 9's warm-up will find by
`sim5.js`; `E.checkStory` clean on the mock chapter that holds the sets). Where the story's italic notes and
this spec differ, the spec is the build's (section 7). Names in `code` are fixed: the art, the engine, the
storyboard words and the story builder use exactly these.*

---

## 1. Flags

**One new flag, sticky; no choice flag** (brief: "Flags"; the story's call 6). No choice in this chapter
sets anything.

| Flag | Values | Set where | Reread | Read by |
|---|---|---|---|---|
| `foundHail` | `true` | Hail's last screen, "Tell Sprinkle: five!" Hail calls, going round again… (the optional scene's last frame, with its slip-past Tap): `sets: { foundHail: true }` on the frame (a told and a kept twin, both carrying it), never on an option | sticky (never unset; Back does not unset it) | this chapter: the hollow log choice's two labels ("Who’s in the log?" with `{ foundHail: false }`, "Go and see Hail again." with `{ foundHail: true }`); the chase's dogs (the frame pair by `foundHail`: Hail bounces with them); her card `hail-shapes` (`when: { foundHail: true }`, as `squall-shapes` and `sleet-den`); her page in the book (`book.dragonet`, `when: { foundHail: true }`); the Grown-ups corner's words. A later chapter that offers Hail again sets a found-here flag of its own (section 8). |

- **No `ch8Route`** (the story's call 6): nothing after "The weasel holes" reads which way she went, the
  way home is round the near side of the field on both routes, and the book is worded so it never says.
  Chapter 9 may not say she went through the tunnel (a field-route cat never has: section 8).
- **The light choices set nothing** (`sets: {}`): "Two ways to the tracks" (it routes, it records nothing);
  sniff the left way or the right; the hollow log's "Not tonight." (saying no sets nothing); glare or tongue
  at the fox; the kept "I’m sorry." / "But I found the THIEVES!".
- **Flags read from earlier chapters:**
  - `ch3Told`: who walks the trail and who is in the picture (section 5): told, Tallyheart wakes her before
    dawn, plans the trail ("Just us."), goes over the tunnel or round the field with her, keeps watch at the
    stash and walks her home; kept, the guards saw nothing, Tallyheart sends her off ("Back by sunset."), she
    tells Riffle at the Old Bridge, Riffle walks the trail, and Tallyheart is waiting behind the pile. Every
    screen the story marks *Told path only* / *Kept path only* and every `[if ch3Told: …]` line.
  - `specialty`: `noticing` (tiny prints in the tunnel; tiny prints round every hole), `sneaking` (flat in the
    grass past the dogs; "Not one weasel stirs."), `climbing` (along the fence top), `friends` ("Hello,
    dogs!"), `noticing` or `swimming` (the friend's fetch: `{ specialty: ['noticing', 'swimming'] }`, which
    `E.matches` reads as either; with `ch3Told` for whose).
  - `worry`: `small` (the tunnel: "A small cat could just squeeze in…", "You fit PERFECTLY…"; the stash
    hole: "A tight squeeze. In you go!" and its wriggle Tap), not `small` (the peek Tap), `water` ("Neither way
    is wet."), `talk` ("You want to jump up and shout LIAR!…"), `shiny` (the heap; "Not for keeping.").
  - `ch2Stone`: one bedtime caption (and the den's `stone: 'auto'`).
  - `foundSquall`, `foundPuddle`, `foundWisp`, `foundSleet`: one line each where its clue comes true (the
    story's call 10): Squall's two shapes, Puddle's clever little paws, Sleet's dry den (`foundSleet: false`
    reads "He said that at the border!"), Wisp's glittering drop; and Hail's "And I’ve found more of you!"
    with `{ not: { foundSquall: false, foundPuddle: false, foundSleet: false, foundWisp: false } }` (any one).
  - `lessonClean: 'ch08-fours'` and `not` it: the eighth mark's two pairs of lines.
  - Not read: `ch2Path`, `ch2SaidAloud`, `stepOut`, `spokeUp`, `joinReason`, `ch4CaughtFly`, `ch5First`,
    `ch5Roof`, `ch7Flew` (her file reads `ch7Flew` through chapter 4's link, as it has since chapter 7).
- **Grown-ups corner** (`PC.ui.flagWords`): `foundHail: { 'true': 'found Hail in the hollow log in the
  Barking Field (later chapters remember)' }`.

## 2. Counts sets

**15 typed answers on every reading, 16 with Hail** (the story's For us; the brief's "about 16"): the pile,
two sixes, ten fours, the twenty-eight, Snip's share; and Hail's riddle. Every key below is one the engine
has (chapters 2 to 7); no set needs a new one. Shared pieces, as chapter 7's file has them:

```js
function T(text) { return { who: 'tallyheart', text: text }; }
var QUICK2 = ['Quick as a pounce!', 'You knew that one before I finished asking.'];
var AFTER = ['Ha! You didn’t even look at the sand that time.'];
var HOP = 'Close. Let’s hop it together.', HOP_FAR = 'Let’s hop it together.';
var MISS = 'There. We’ll come back to that one.', LAST = 'There. Now you’ve seen it counted.';
function way(text) { return { miss: text + ' ' + MISS, missLast: text }; }
var CHEEKS = { table: 6, thing: 'whisker', things: 'whiskers', unit: 'cheek', units: 'cheeks', teacher: 'tallyheart',
  ask: '{a} × {b}', picture: { kind: 'cheeks' } };                      // chapter 7's
var PAWS = { table: 4, thing: 'paw', things: 'paws', unit: 'cat', units: 'cats', teacher: 'tallyheart', ask: '{a} × {b}' };
var NIGHTS = { thing: 'piece', things: 'pieces', unit: 'night', units: 'nights', ask: '{a} × {b}' };   // chapter 7's
var ONE_CAT = [{ who: 'clancat', variant: 1 }, { who: 'clancat', variant: 1 }];                   // chapter 7's face
var FIELD = [{ who: 'dog', variant: 1 }, { who: 'dog', variant: 2 }, { who: 'dog', variant: 3 }, { who: 'hail' }];
var RIM = [{ who: 'clancat', variant: 1 }, { who: 'murmurchime' }, { who: 'clancat', variant: 3 }, { who: 'clancat', variant: 5 }, { who: 'grizzled' }];
```

Lines use the story's typographic quotes and apostrophes. Engine lines that reach her and that no set words:
**a retry** opens with “Here’s that one again.” (Riffle's kept set: “That one again!”, its `againIntro`; a lent
question's retry in a set that borrows in its own voice (`fillVoice: 'borrower'`: the pile, the twenty-eight,
Hail's, Snip's and Riffle's) opens with its `fillIntro` instead; the warm-up's opens with “Here’s that one again.”
and the lender's generic question, as `E.promptLines` words it); **a right retry** of a fact with no
`rightAgain` gets “There it is. You remembered that one.” then “Yes! That one came back, and you knew it.”;
**a generic question** where a question has no words of its own (set by set, below).

### Every fact, in the order she meets it

| # | Set | Fact (answer) | Where | Picture |
|---|---|---|---|---|
| 1 | `ch08-pile` | 3 × 10 (30), a check | the seventh morning count | prey in rows, lit a row at a time |
| 2 | `ch08-sixes` | 6 × 8 (48), or her hardest 6s fact from chapter 7 | the warm-up | cheeks |
| 3 | `ch08-sixes` | 2 × 6 (12) | the warm-up | one cat's face, two cheeks |
| 4–13 | `ch08-fours` | 2 × 4, 4 × 5, 4 × 4, 3 × 4, 4 × 7, 4 × 8, 4 × 6, 7 × 4, 8 × 4, 10 × 4 (8, 20, 16, 12, 28, 32, 24, 28, 32, 40) | the lesson | that many cats side-on, four paws each; 4 × 8 with seven cats lit |
| 14 | `ch08-gone` | 4 × 7 (28) | the sum, every path, in the Hollow | seven nights of four marks, two and two, in the sand |
| (15) | `ch08-hail` | 4 × 4 (16) | Hail's riddle (optional scene) | three dogs and Hail, four paws each |
| 15 | `ch08-snip` (told) or `ch08-riffle` (kept) | 2 × 7 (14) | Snip's share, at the weasel holes | seven nights of two marks, in the mud |

The lesson kit holds: five of the ten are new facts (4 × 4, 4 × 7, 4 × 8, 7 × 4, 8 × 4: the brief's three new
facts in either order), five are stepping stones she knows (2 × 4, chapter 2's ears turned round; 4 × 5 from
chapter 3; 3 × 4 from chapter 6; 4 × 6 her own count; 10 × 4 from chapter 4: each one of the seven Counts
Tallyheart names at the tree); both orders; the method is
"a four is two twos" (count the front paws and double: 4 × 4, 4 × 7) or step off one she knows (4 × 8 off
4 × 7, its seven cats lit); twins three places apart (4 × 7 / 7 × 4, 4 × 8 / 8 × 4); 3 × 4 and 10 × 4 have no
right line of their own, so a quick answer there is noticed. The story questions come after the lesson. Not
typed (taps, never logged): her paws (2, 4), the rim's five cats (4 to 20), Tallyheart's seven Counts at the
tree (`ask`), the bedtime paws (4, 8), and sixteen one-tap frames (section 5).

### `ch08-pile`, the seventh morning count (one question; Counts frame `intro: false`)

```js
'ch08-pile': {
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

Chapter 7's `ch07-pile` exactly, under this chapter's id (the story: "Chapter 7’s question, with its picture
and its help"). Run: right, no praise (the gap answers); a miss scratches ten marks a row in the earth
(10 · 20 · 30), then “An easy one. One row of ten. How many pieces?” and “An easy one. Two rows of ten. How
many pieces?”, then “Here’s that one again.” and the caption; a second miss lends the same two again. The
Counts frame's one balloon (Glintstar's “{name}paw,” … “The count, please.”) is read on the frame and not said
again (`intro: false`).

### `ch08-sixes`, the warm-up (two questions; Counts frame `intro: false`)

```js
'ch08-sixes': Object.assign({}, CHEEKS, {
  facts: [[6, 8], { a: 2, b: 6, who: ONE_CAT, prompt: 'Two cheeks? One whole cat.', retryPrompt: true,
    right: [T('Twelve! Six and six. That’s doubling.')], rightAgain: true }],
  warmHard: { table: 6, at: 0, avoid: [[1, 6], [2, 6], [3, 6], [6, 9], [6, 10], [4, 6]] }, avoid: [[6, 6], [4, 6]],
  fillFrom: 'ch07-sixes', fillOrder: 'easiest', fillIntro: 'One from yesterday.',
  praise: ['Two threes make a six!', 'Six more, every time!', 'Three and three, every cheek!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST,
  remembered: 'Yesterday, {a} × {b} made you stop and think. Not today!',
  rememberedSlow: '{a} × {b} again, and you got it. It’s getting easier.', done: null
})
```

- **The hard pick** (`warmHard`, position 0): her hardest 6s fact by `E.hardFacts(cat, 6)`, in the order she
  was asked it; 6 × 8 when nothing was. The avoid list is continuity's with `[4, 6]` added (the story):
  never 1 × 6, 2 × 6, 3 × 6, 6 × 9 or 6 × 10 (other days' timed answers), never 4 × 6 or 6 × 4 (asked in the
  4s lesson minutes later, as "YOUR count"). Runs (`sim1.js`): nothing hard → “Eight cheeks. How many
  whiskers?”, a quick right answer earns “Quick as a pounce!”, a slow one the praise “Two threes make a six!”;
  a chapter-7 miss of 5 × 6 (or a slow 5 × 6, the only chapter-7 lesson fact timed on itself) → 5 × 6 first,
  “Yesterday, 5 × 6 made you stop and think. Not today!” quick, “5 × 6 again, and you got it. It’s getting
  easier.” slow; a chapter-7 miss of 6 × 7, 6 × 8 or 6 × 6 opens on it the same way. **Passed over** (the cost,
  as chapter 7's): a chapter-7 miss of 2 × 6, 6 × 3, 6 × 4, 4 × 6 (the lesson's or the twenty-four's) or
  10 × 6 (the sixty) opens on 6 × 8.
- **The words**: the Counts frame's caption and balloon (“In the Training Hollow, five cats sit up on the
  rim.” / “Four a night? That’s a job for the fours,” … “to wake up your whiskers.”) are read on the frame and
  not again, so the first question is timed on itself. The first question has no words of its own (the
  engine's “Eight cheeks. How many whiskers?”); 2 × 6 is asked in its own words, “Two cheeks? One whole
  cat.”, drawn as one `clancat` 1's face (`who: ONE_CAT`, chapter 7's face rule), and its right line “Twelve!
  Six and six. That’s doubling.” is kept on a retry.
- **Help and fillers** (run): a miss hops the sand by sixes, three and three (chapter 7's per-6 sand); the
  fillers are chapter 7's lesson's easiest, in the cheeks: a miss on the first question lends one, “One from
  yesterday. Three cheeks. How many whiskers?” (6 × 3), after 2 × 6; a miss on 2 × 6 lends two, 6 × 3 then
  “One from yesterday. Five cheeks. How many whiskers?” (5 × 6), or 6 × 3 then 4 × 6 in four cheeks when the
  hard one was 5 × 6 (the set's own `avoid` takes 4 × 6 last, and 6 × 6 never). Everything wrong: 6×8✗ 2×6✗
  6×3 R6×8✗ R2×6✗ 5×6 R6×8 R2×6.

### `ch08-fours`, the lesson (ten facts; Counts frame `intro: false`)

```js
'ch08-fours': Object.assign({}, PAWS, {
  label: 'Paws', hollowThings: 'fours', fillOrder: 'easiest', prompt: 'How many paws?',
  facts: [
    { a: 2, b: 4, prompt: 'Two cats. How many paws?', retryPrompt: true, right: [T('Eight! Four and four.')], rightAgain: true },
    { a: 4, b: 5, right: [T('Twenty! You hopped that one already.')], rightAgain: true },
    Object.assign({ a: 4, b: 4, prompt: 'Four cats. Front paws: eight. Back paws: eight more.', retryPrompt: true,
      right: [T('Sixteen! Eight and eight. You doubled it.')], rightAgain: true }, way('Eight and eight: sixteen.')),
    [3, 4],
    Object.assign({ a: 4, b: 7, prompt: 'Seven cats. Front paws: fourteen. Back paws: fourteen more. Fourteen and fourteen: ten and ten, then four and four.', retryPrompt: true,
      right: [T('Twenty-eight! You doubled fourteen.')], rightAgain: true }, way('Ten and ten make twenty. Four and four make eight. Twenty-eight.')),
    Object.assign({ a: 4, b: 8, lit: 28, prompt: 'Eight cats. Seven cats made twenty-eight. One more cat: four more paws.', retryPrompt: true,
      right: [T('Thirty-two! The biggest new one.')], rightAgain: true }, way('Twenty-eight, and four more: thirty-two.')),
    { a: 4, b: 6, prompt: 'Six cats? That’s YOUR count!', retryPrompt: true, right: [T('Twenty-four! Four a night, for six nights.')], rightAgain: true },
    { a: 7, b: 4, prompt: 'Seven cats? You did that one the other way round.', retryPrompt: true, right: [T('Twenty-eight! Same fact.')], rightAgain: true },
    { a: 8, b: 4, check: true, right: [T('Thirty-two! Same fact.')], rightAgain: true },
    [10, 4]
  ],
  praise: ['Two twos make a four!', 'Four more, every time!'],
  fast: QUICK2, fastAfterMiss: AFTER, helpIntro: HOP, helpIntroFar: HOP_FAR, miss: MISS, missLast: LAST, done: 'That’s the fours.'
})
```

- **The Count**: the first set chapter 8 gives table 4 with the most facts, so it is the 4s' own
  (`E.countSets`, run: `… 6:ch07-sixes 4:ch08-fours`; the twenty-eight and Hail's riddle are table 4 with one
  fact each). The Hollow's button reads “Paws · the 4s”; Tallyheart says “A round of fours. Ready? Here we
  go.”; the tree gets its eighth mark once this lesson is finished (`E.learnedCounts`), never before. A 4s
  Hollow round (run) asks 1 × 4 to 10 × 4 in both orders, in the lesson's picture (one to ten cats), and asks
  “How many paws?”.
- **Picture**: every question opens on that many cats side-on, standing, four paws each, all unlit (the
  table-4 picture as cats.js has drawn it since chapter 1: no `kind`, the set's `thing: 'paw'`; section 4,
  Counts art: it is pinned, and it is what the story asks); 4 × 8 opens with seven cats lit (`lit: 28`: the
  first seven cats' paws). A right answer lights every paw (the page's rule). 4 × 4 and 4 × 7 open unlit, and
  their words carry the doubling (the story; the picture lights whole cats in order, never front paws alone).
- **Words** (run): six facts have words of their own (2 × 4, 4 × 4, 4 × 7, 4 × 8, 4 × 6, 7 × 4; kept on a
  retry, after “Here’s that one again.”); 4 × 5, 3 × 4, 8 × 4 and 10 × 4 are asked “How many paws?” (the
  set's `prompt`, the story's words), and their retries in the engine's generic words (“Here’s that one
  again. Three cats. How many paws?”). Right lines: every fact's own but 3 × 4 and 10 × 4, which get the fast
  lines when quick (clean and quick: “Quick as a
  pounce!” on 3 × 4, “You knew that one before I finished asking.” on 10 × 4; after any miss, “Ha! You didn’t
  even look at the sand that time.” leads) or the praise when slow (“Two twos make a four!”, “Four more,
  every time!”). This is the one place in the lesson speed is noticed (chapter 7's known issue 14, answered).
- **Help** (run, every single miss): Tallyheart scratches four marks in the sand for every cat, two and two
  with a gap (`PC.art.sand` at per 4: section 4), and hops them by fours from the first cat (4 × 7: 4 · 8 ·
  12 · 16 · 20 · 24 · 28); “Close. Let’s hop it together.” within one hop (an answer up to four off), else
  “Let’s hop it together.”; then the fact's own line: 4 × 4 “Eight and eight: sixteen. There. We’ll come back
  to that one.”, 4 × 7 “Ten and ten make twenty. Four and four make eight. Twenty-eight. There. …”, 4 × 8
  “Twenty-eight, and four more: thirty-two. There. …”; the others “There. We’ll come back to that one.” On a
  last miss (the third): the way alone, or “There. Now you’ve seen it counted.” Never a wall; no clock.
- **Order** (run): a missed fact comes back two questions later; a single miss of 4 × 7 or 4 × 8 comes back
  before its twin (R4×7 before 7 × 4; R4×8 before 8 × 4). Missing 4 × 4, 4 × 7 and 4 × 8 in a row gives
  2×4 4×5 4×4✗ 3×4 4×7✗ R4×4 4×8✗ R4×7 4×6 R4×8 7×4 8×4 10×4. Near the end the fillers are her easiest right
  answers in the lesson (`fillOrder: 'easiest'`): a miss on 8 × 4 lends 2 × 4; on 10 × 4, 2 × 4 then 3 × 4,
  asked “How many paws?” in their own cats.
- **8 × 4 is a check** (`check: true`; the story; chapter 7's 8 × 6): asked right after a missed 4 × 8's retry,
  a quick right 8 × 4 never hides that miss (run: a missed 4 × 8 is still `E.hardFacts(cat, 4)`'s `[[4, 8]]`
  after a quick 8 × 4). The cost: a slow 8 × 4 goes unseen (the 4s' Hollow rounds time all ten).
- **Timing** (run, for chapter 9): 4 × 5, 3 × 4 and 10 × 4 are the lesson's facts timed on themselves (slow
  everywhere: `[[10, 4], [3, 4], [4, 5]]`); every other right answer is read first or a check; any miss counts.

### `ch08-gone`, the twenty-eight (one question, every path; Counts frame has no balloon)

```js
'ch08-gone': Object.assign({}, NIGHTS, {
  table: 4, teacher: 'tallyheart', picture: { kind: 'marks', layout: 'pairs' },
  facts: [Object.assign({ a: 4, b: 7, prompt: [{ kind: 'caption', text: 'Four gone a night, for seven nights. How many gone?' }], retryPrompt: true,
    right: [T('Twenty-eight! Just like seven cats’ paws.')], rightAgain: true }, way('Two and two, every night. Fourteen and fourteen: twenty-eight.'))],
  help: 'picture', helpIntro: HOP, helpIntroFar: HOP_FAR,
  fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.', avoid: [[3, 4], [4, 4]],
  praise: [], miss: MISS, missLast: LAST, done: null
})
```

- **On the 4s, set and fact** (the brief: "Sums go on table 4"): a night's count, then the nights, as
  chapter 7's twenty-four. Pictured as seven nights of four marks (`groupsFor`), hopped by fours. The set is
  table 4 with one fact, so the lesson stays the 4s' own Count.
- **Picture**: the sand, seven nights side by side, four marks a night scratched two and two with a gap
  (`kind: 'marks'` with `layout: 'pairs'`, new Counts art: section 4; chapter 7's twenty-four, `kind: 'marks'`
  with no layout, keeps its four in a row), unlit.
- **Help** (`help: 'picture'`): no new scratching; the marks light a night at a time as Tallyheart hops by
  fours, 4 to 28, then “Two and two, every night. Fourteen and fourteen: twenty-eight. There. We’ll come back
  to that one.” (last miss: the way alone).
- **Fillers** (run): two easy fours the lesson lends, drawn in this set's own picture and words
  (`fillPicture: 'borrower'`): “An easy one. Two nights. How many pieces?” (2 × 4) then “An easy one. Five
  nights. How many pieces?” (4 × 5), then the seven nights again, unlit, with the question's own words; a
  second miss lends “An easy one. Six nights. How many pieces?” (4 × 6) then 2 × 4 again. Never 4 × 4 (one of
  today's new ones) and never 3 × 4 lent first (`avoid`); the same whatever the lesson missed.
- **Timing**: its own words, so a right answer is never timed; a miss is a 4s and a 7s hard fact (section 8).

### `ch08-hail`, Hail's riddle (one question, the optional scene)

```js
'ch08-hail': {
  table: 4, thing: 'paw', things: 'paws', unit: 'dog', units: 'dogs', teacher: 'hail', ask: '{a} × {b}',
  picture: { kind: 'dogs' }, who: FIELD,
  facts: [{ a: 4, b: 4, prompt: [{ who: 'hail', text: 'How many paws go round and round this field?' }], retryPrompt: true,
    right: [{ who: 'hail', text: 'SIXTEEN! Did you count them? ALL of them? Can I count YOURS?' }], rightAgain: true }],
  help: 'picture', helpIntro: 'Hop by fours! Four, eight…', helpIntroFar: 'Hop by fours! Four, eight…',
  fillFrom: 'ch08-fours', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', avoid: [[4, 5], [4, 6]],
  praise: [], miss: MISS, missLast: LAST, done: null
}
```

- **The riddle is 4 × 4** (the story's call 8; the riddles so far are 7 × 5, 4 × 10, 7 × 1, 7 × 3, and Sprinkle's
  2 × 5 and 6 × 5). The story's balloon is split at its question: “Want a riddle? Here’s one! Three dogs, and me.
  That’s four of us. Four paws each!” is the Counts frame's balloon, said again over the question (default
  intro, as chapter 7's kept sixty), and “How many paws go round and round this field?” the fact's own prompt,
  so the keypad page shows both, and a retry asks “Here’s that one again.” then the question.
- **Picture**: the three dogs (Good Boy, Drop It, the tiny one) and Hail last, side-on, four paws each, unlit
  (`kind: 'dogs'`, new Counts art: section 4). The set's `who` is the picture's for the riddle and for every
  filler (`fillPicture: 'borrower'` keeps it, and fillers carry no `who` of their own), so a filler of two
  draws the first two dogs and a filler of three the three dogs.
- **Help** (`help: 'picture'`): “Hop by fours! Four, eight…” in Hail's voice, the paws lit one animal at a
  time, 4 to 16, Hail counting; then “There. We’ll come back to that one.” (her teacher's line, chapter 6's
  words: the story gives her none).
- **Fillers** (run): two easy fours from this morning, as the engine words them after Hail's “An easy one!”:
  “An easy one! Two dogs. How many paws?” (2 × 4) and “An easy one! Three dogs. How many paws?” (3 × 4), in
  that order after a right twenty-eight, the other way round after a missed one (the twenty-eight is her
  sibling, borrowing from the same lesson: `E.siblingAsked`); a second miss lends the same two again. Never
  4 × 5 or 4 × 6 (five or six animals: the field has four).
- **The right line** is kept on a retry. **Timing**: its own words, never timed; a miss is a 4s hard fact.

### `ch08-snip` and `ch08-riffle`, Snip's share (one question, at the weasel holes)

```js
'ch08-snip': Object.assign({}, NIGHTS, {
  table: 2, teacher: 'tallyheart', picture: { kind: 'marks', ground: 'mud' },
  facts: [{ a: 2, b: 7, prompt: [{ kind: 'caption', text: 'You scratch two marks a night, for seven nights. How many did Snip carry?' }], retryPrompt: true,
    right: [{ who: 'player', kind: 'whisper', text: 'Fourteen!' }], rightAgain: true }],
  help: 'picture', helpIntro: 'Let’s hop it together. Two, four…', helpIntroFar: 'Let’s hop it together. Two, four…',
  fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one.',
  praise: [], miss: MISS, missLast: LAST, done: null
}),
'ch08-riffle': Object.assign({}, NIGHTS, {
  table: 2, teacher: 'riffle', picture: { kind: 'marks', ground: 'mud' },
  facts: [{ a: 2, b: 7, prompt: [{ kind: 'caption', text: 'You scratch two marks a night, for seven nights. How many did Snip carry?' }], retryPrompt: true,
    right: [{ who: 'player', kind: 'whisper', text: 'Fourteen!' }], rightAgain: true }],
  help: 'picture', helpIntro: 'Hop by twos! Two, four…', helpIntroFar: 'Hop by twos! Two, four…',
  fillFrom: 'ch02-ears', fillOrder: 'easiest', fillVoice: 'borrower', fillPicture: 'borrower', fillIntro: 'An easy one!', againIntro: 'That one again!',
  praise: [], miss: 'There! Again in a bit.', missLast: 'There! Now you’ve seen it.', done: null
})
```

- **Two frames by `ch3Told`, one question each** (the story). Table 2, a table she knows; never a 7s set
  (`E.countSets` still gives table 2 to `ch02-ears`). Picture: her own scratches in the earth at the foot of
  the bank, two a night for seven nights, unlit: chapter 7's marks picture at per 2, as drawn today, on
  `ground: 'mud'` (the bank's foot is earth and mud; no new ground).
- **Help** (run): told, “Let’s hop it together. Two, four…”, the marks lit a night at a time, 2 to 14,
  Tallyheart counting, “There. We’ll come back to that one.”; kept, all in Riffle's voice: “Hop by twos! Two,
  four…”, Riffle counting, “There! Again in a bit.” (last miss: “There! Now you’ve seen it.”). A missed
  one-night filler (2 × 1) opens with the same “Two, four…” while its help lights two marks and stops at 2
  (run): a known cost, kept (section 7, item 13).
- **Fillers** (run): chapter 2's easiest twos, in this set's marks: told “An easy one. One night. How many
  pieces?” (2 × 1) then “An easy one. Two nights. How many pieces?” (2 × 2); kept the same after “An easy
  one!”; then the retry, told after “Here’s that one again.”, kept after “That one again!” (`againIntro`), with
  the caption. A second miss lends three and four nights (3 × 2, 4 × 2).
- **The right line**, “Fourteen!” she whispers (`kind: 'whisper'`), is the same on both paths and on the
  retry. The lines the engine words itself are plain balloons (chapter 7's known issue 6).
- **Timing**: its own words, never timed; a miss is a 2s and a 7s hard fact (section 8).

### The taps that count (skip and ask)

- **Her paws** (“Four paws on every cat,” … “Count mine.”): `skip: { table: 2, groups: 2, who: [{ who:
  'tallyheart' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next pair of paws.',
  prompt: '**Tap** her paws.', keep: true, next }`. One cat close, Tallyheart side-on, standing, her four
  paws, the front pair the first group and the back pair the second (new Counts art, keyed on `thing: 'paw'`
  at per 2: section 4): the first tap lights the front pair and puts 2 in her balloon, the second the back
  pair, 4, and turns the page. `keep: true`: the page it turns to (“Two front paws. Two back paws,” … “A four
  is two twos.” / “Two twos! Like a six is two threes!” / “Exactly. Doubling, AGAIN.”) keeps the picture, both
  pairs lit, 2 and 4 beside them, under a big 4; the skip after it ends the kept run (`E.keptSkip`).
- **The rim's paws** (“One by one, the cats on the rim hop down and pad past you.” / “Hop by fours,” … “Four
  paws on every cat.”): `skip: { table: 4, groups: 5, who: RIM, thing: 'paw', things: 'paws', teacher:
  'tallyheart', label: 'Count the next cat’s paws.', prompt: '**Tap** the cats as they go by.', carry: false,
  next }`. Five cats side-on in the rim's coats, the next glowing; each tap lights its four paws, its running
  total under it and a big number over the picture, Tallyheart's count “4… 8… 12… 16… 20!” (the table-4
  picture with a `who`, as drawn today). `carry: false`: the page it turns to is the ask, which draws no
  carried number.
- **The tree** (“Twenty! Now, a secret,” … “One from every mark on this tree.” / “I DO?”): `ask: { who:
  'tallyheart', to: 'player', prompt: '**Tap** Tallyheart to find out.', label: 'Ask the next Count.', pairs:
  [['Tails?', 'Four cats, four tails!'], ['Ears?', 'Four cats, eight ears!'], ['Claws?', 'Four forepaws, twenty
  claws!'], ['Both forepaws?', 'Four cats, forty claws!'], ['Nine lives?', 'Four cats, thirty-six lives!'],
  ['Patrols?', 'Four patrols, twelve guards!'], ['Whiskers?', 'Four cheeks, twenty-four whiskers. That’s MY
  count!']], next }` (seven pairs, one for each claw mark: 4 × 1, 4 × 2, 4 × 5, 4 × 10, 4 × 9, 4 × 3, 4 × 6),
  on `hollow`/`wide` with `{ marks: 7, glow: 'auto' }`, Tallyheart at `tree-far` with `glow: true`, our cat at
  `sunpatch-2`; its own `say` the two balloons before it. Next after the seventh.
- **Bedtime** (“Tonight it really IS the paw thing,” you say.): `skip: { table: 4, groups: 2, who: [{ who:
  'snorer' }, { who: 'player' }], thing: 'paw', things: 'paws', teacher: 'player', label: 'Count the next
  cat’s paws.', prompt: '**Tap** the paws.', next }`. The grey tom and her, side-on, standing, his four paws
  first, the next four glowing (the table-4 picture with a `who`, as drawn today: she is drawn from her
  look); her count “4… 8!”; the second tap turns the page to “EIGHT?” under a big 8 (carried).

## 3. The Case File

Four new cards, two eyes and two ears; four new links. Every one goes under the moss in her nest (section 4,
the den): the stash, the glass and the brag are the proof she keeps for the Gathering ("Not a word to the Clan
yet."; "This goes to the Gathering"), and Hail's is a dragonet's. Nobody's card shows the thieves themselves
(cards.js's rule: paws, prints, shapes, nothing more of the animal).

| id | Mark | Line as lettered | Given | To whom | Links |
|---|---|---|---|---|---|
| `stash` | eye | The weasels have a stash: our prey, and ReedClan’s. | “Mice and voles, in tidy rows. Of COURSE they’re tidy.” / “Some smell of your camp…” (in the stash) | everyone | `link: { with: ['reed-pile'], line: 'Two piles robbed. One stash.' }` |
| `glass` | eye | A heap of glass in the weasels’ stash, just like the ‘scale’. | “It’s not a scale,” you whisper. “It’s GLASS.” | everyone | `link: { with: ['scale'], line: 'It’s not a scale. It’s GLASS.' }` |
| `fox-brag` | ear | Reynard calls ‘It FLEW off’ his little story. He wants the dry den. | the panel of “He laughs, a soft little yip. “Nobody saw a thing.”” | everyone | `link: { with: ['fox-flew', 'sleet-den'], line: 'He said FLEW. Now he calls it a story.', lines: { 'sleet-den': 'The same fine, dry den.' } }` (section 6) |
| `hail-shapes` | ear | Hail says two skinny shapes cross her field every night, toward the tracks. | Hail's “Are you following the skinny ones?…” | only with `foundHail` (`when: { foundHail: true }`: shown from the frame that gives it, as `squall-shapes`) | none |

- **The rows** (run, `sim4.js`, with section 6's change): every cat who read chapter 7's FLEW screen gets
  `cant-fly` — “They can’t both be true.” — `fox-flew` — “He said FLEW. Now he calls it a story.” —
  `fox-brag`, and a cat who found Sleet `— “The same fine, dry den.” — sleet-den` at its end (a row of four);
  a cat without `ch7Flew` (only a reread oddity) gets `fox-flew — fox-brag (— sleet-den)`. `tidy` — “Two
  piles. Both left tidy.” — `reed-pile` — “Two piles robbed. One stash.” — `stash` (every cat holds both
  since chapter 6). `scale` — “It’s not a scale. It’s GLASS.” — `glass` (a new row). The link lines judge
  nothing (the story's note): that is the Gathering's. **Order matters**: `fox-brag`'s `with` lists `fox-flew`
  first, so the brag joins the FLEW row before Sleet's card joins the brag (the other order leaves the two
  rows apart: `E.caseFile`'s `touch` never merges two rows).
- **Not linked, on purpose**: Hail's card (the story gives it none; `squall-shapes` is often the middle of a
  row of three, where nothing can join); the glass and `wisp-fox` (Wisp's line is a payoff, not a card's).
- **No `answers`** anywhere (chapter 10's).
- **Pictures** (`app/art/cards.js`, keys = the ids), scratched as the others are, the shared motifs drawn one
  way (cards.js's `fox`, `shard`, `slink`, the mice):
  - **`stash`**: a tidy row of mice (as `tidy` and `coil-diggers` draw them) under a low arched roof line of
    earth (the inside of a burrow), two of them spotted with mud dots (ReedClan's). Label: "a tidy row of mice
    under the low roof of a burrow, two of them muddy". It lies at the end of `tidy`'s row and `reed-pile`'s,
    so its mice are theirs; it must look unlike `tunnel` (mice on the ground and a hatched mouth going down)
    and `four-a-night`.
  - **`glass`**: a heap of four or five of the `scale` card's own flat pieces (`shard`), overlapping, each with
    its two "smooth" strokes, and shine lines round the heap. Label: "a heap of flat pieces like the scale,
    with shine lines". It lies touching `scale`.
  - **`fox-brag`**: the fox's head (`fox`, as `fox-flew` and `fox-moon` draw it, unchanged: its smile is always
    on, and cards laid touching show one fox drawn one way, so the brag is the bridge's, not a new smile), and
    beside it the Old Bridge: a long flat deck line on two stone legs with a dark arch hatched under it (the dry
    den). Label: "the fox’s head, smiling, and the Old Bridge with a dark arch under it". It must look unlike
    `sleet-den` ("a fox’s head saying something, and a round den mouth with three short dry lines over it"),
    which may lie at the end of its row, and unlike `fox-flew`.
  - **`hail-shapes`**: two long low shapes (`slink`) squeezing under a wire fence (three or four diamonds of
    wire and a post), one with something in its mouth. Label: "two long low shapes squeezing under a wire
    fence". No track (that is `squall-shapes`, which it must not look like).
- **In her nest** (the den, `bark: 'auto', hidden: true`): all four go **under the moss** on every path
  (`BARK_SECRET` gains them), so the row along the edge holds what it held after chapter 7 and the corners
  grow (section 4, the den). The bedtime caption ("New curls of bark. And under the moss, in its leaf, your
  glass.") is true of every cat.
- She holds **20 to 28 cards** by bedtime (17 to 24 before: chapter 7's 18 to 24, one fewer when `my-count` is
  missing, chapter 7's known issue 15; three more for everyone, a fourth with Hail); **eight to ten under the
  moss** (eight when she holds neither `my-count` nor Hail's card).
- Not cards, on purpose: the twenty-eight (the Clan knows four a night for seven nights; the twenty-eight is
  hers and Tallyheart's, worked in the Hollow, said aloud), the guards'
  nothing, Tallyheart's bumps in the night, the tunnel's far end, the dogs, the weasels' squabble and their
  fourteen (her own sum, said aloud), "Nobody’s land", the chase.

## 4. Art needs

One new place and three new characters (the brief). **New** marks what the art must add; every option is
off by default and every camera and anchor additional, so chapters 1 to 7 draw byte-identically for every
live save (section 7, item 2: the proof). Times of day: `night` in the den as she wakes (told) and at
bedtime; `morning` at the pile (both paths: the kept path's yawning guards are at first light) and in the
Hollow; `day` under the Old Bridge (kept); `dusk` at the pile for "The sun goes down…" (`moon: 8`); `night`
everywhere after that: round the back of the pile, in the tunnel, the Barking Field, the bank by the tracks,
the stash, the chase, home behind the pile, the den.

### Places

| Set (file) | What the chapter uses | New |
|---|---|---|
| **`tracks`** (new: `sets/tracks.js`) | the trail's end: the railway bank by the tracks, its holes, the stash, and the inside of the weasels' tunnel (the brief: one new place; the tunnel's inside is a camera of it) | **The whole set** (below) |
| `field` (`sets/field.js`) | **at night** (never drawn so: chapters 2, 4 and 6 are by day): `wide`, `dogs`, `fence`; the dogs asleep in a heap, waking and bounding; Hail at the log, at the wire and going round; the specialty ways past; the chase home along the path | **The night** (below), **option `moon`** (a number, the evening's age, as the pile's: drawn at night or dusk in the sky of `wide`, `dogs` and `fence`, where each shows sky; `moon: 8` a half moon, lit side and height by the art's clock, `moonT`, "high in the sky" at night), **option `tap: 'none' \| 'path'`** (on `wide`, `dogs`, `fence`: the path ahead on the right, the way to the tracks: an unpainted `<rect class="pc-tap" data-tap="path">`, nothing painted), **anchors** below |
| `pile` (`sets/pile.js`) | morning: `rows` with chapter 7's shade (`{ rows: [10, 10, 10, { n: 10, gap: [3, 4, 5, 6] }], back: 'shadow', scale: 'behind' }`) and `tap: 'back'`; `gap` with `{ rows: …, scale: 'behind', dug: 'big' }`; `wide`/`low` for Glintstar and the old tom; dusk: `wide` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 8, tap: 'back' }`; night: `rear` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel: true }` (the trail's start and home) and `hole` | **Anchor `poke`** on `rear`: at the tunnel mouth's right edge, so a cat there facing left has her nose at the mouth's right rim and her shoulders plainly wider than the mouth (Tallyheart: "Her shoulders stick."; Riffle: "He pokes his head in."), her head kept clear of the mouth's `tap: 'mouth'` box, so the told wriggle-in Tap's glow lands on the mouth and not on her face; its height `rear-2`'s. **`tap: 'mouth'`** (the `tap` option gains a value): on `rear` while `tunnel` is true and on `hole`, the mouth's box, unpainted (the wriggle-in Tap; `hole` took no `tap` until now and still ignores `'back'` and `'roots'`). **`night` on `rear` and `hole`** (drawn only at dusk so far): check it reads, moonlit, never black; chapter 6's `wide` and `low` at night and chapter 7's dusk frames draw as they do |
| `den` (`scenes.js`) | `nest` and `inside` at night, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }` at waking (told); at bedtime the same with `glass: true`, and `moon: 8` on the last panels (`inside`: `doorway`'s box, x 900 to 1600, leaves out `sleeper-1`); Tallyheart beside her nest at waking (a raw spot on `inside`, about `{ x: 1250, y: 896, h: 250 }`, facing left, measured beside `nest` at x 1060 and checked on the frame by the story builder; `sleeper-2`, Murmurchime's empty nest at x 640, is across the den, not beside hers); the grey tom at `sleeper-1` | **`moon: 8`** (the den's `moon` list gains 8: `[false, true, 5, 8]`): the eighth evening's half moon, at night or dusk, in the sky of `outside` and in the doorway's patch of sky on `inside` and `doorway` (chapter 5's `moon: 5` is drawn at dusk only; `moon: true` from outside only: both as before). **`glass: true`** (`[false, true]`, default false; `nest` and `inside`): her piece of glass in its leaf, tucked under the moss beside the corners of bark: the leaf's tip and one small glint showing, inside the nest's `keep`. **The nest grows** (below) |
| `hollow` (`scenes.js`) | `wide` with the five rim cats sitting up (`rim()`), Tallyheart at `tree-far`, our cat at `sunpatch-2`, `{ marks: 7, glow: 'auto' }` until SKRITCH; `lesson` for the lesson and the talk; `tree` with `{ marks: 8, glow: 'auto' }` for SKRITCH (Tallyheart `stretch`); every `hollow` frame after it `{ marks: 8, glow: 'auto' }`; `sand` for the twenty-eight (Tallyheart `crouch`, `claws: true`, chapter 7's) | nothing: `marks: 8` draws as `markSpots` has laid eight since chapter 1 (pinned by the chapters 1 to 3 fingerprint); check it reads at `tree` and `wide` |
| `bridge` (`sets/bridge.js`) | kept only, `day`: `back` with `{ prints: true, stones: true }` (Riffle in `stand` with `holds: 'string'` and `tap: 'ears'`, Sprinkle at `dragon`, our cat at `back-left`, Coil at `gap` in `stone`); `wall` for “A TUNNEL?…” and “Quietly,” / “…pile,” | nothing |

#### The new set, `tracks` (`app/art/sets/tracks.js`)

`PC.art.defineSet('tracks', { label: 'the railway bank by the tracks, its weasel holes, and the weasels’
tunnel', tod: 'night', … })`, drawn with `PC.art.kit` in the 1600 × 1000 world, always at night (it is never
drawn by day): moonlit and silver, never black (the brief: "the night is silver, not black"); the tunnel and
the stash dim blue-grey and readable ("cats see well in the dark" is the caption's: no art key draws shining
eyes, and the night's cast tint is the scene's). Nothing in it is frightening. **Nothing of the Clan's** is
here: no cat stands on the rails or the sleepers in any camera ("Not
one paw on the rails."), and Reynard is only ever up on the tracks, far above the cats, never looking their
way (the story's note).

| Camera | Composition | Anchors | Options it takes |
|---|---|---|---|
| `wide` | the railway bank at night: a high grassy bank rising across the panel from its foot (about y 760) to a flat top (about y 380), on top the ballast, the sleepers and **two long rails, bright in the moonlight** (each about 5 wide over a soft glow, as the pile's `tracks` were made to read on an iPad page), the sky above with stars and the moon; along the bank's face five or six **holes** (dark ovals with a lip of earth): the **biggest**, low on the bank to the right (the stash), a **little one** left of it (the weasels' bed), two more higher up, and at the very foot, at the left, the **tunnel's end**; **faint tiny prints round every hole** (always drawn, as the crawl floor's: the noticing cat's “Round every hole: tiny prints.”); **tall weeds** along the bank's foot (taller than a sitting cat's ears), the near ground dark earth and short grass | `tunnel-end` (in the tunnel's end hole at the bank's foot: whoever is there, in any pose, has the hole's lip drawn over her back half, head and shoulders out: wriggling out; the frames use our cat in `crouch` and Riffle in `scramble`, neither of whom has a `peek`), `foot-1`, `foot-2` (two cats on the ground at the bank's foot, right of the tunnel's end, at a cat's size), `hole-1`, `hole-2` (a weasel at each of two holes, small), `rails` (on the tracks at the top: a fox there is small) | `moon`, `tap: 'weeds'` (the tall weeds' box: the hide Tap) |
| `hide` | at cat height **in the tall weeds** at the bank's foot, looking up the bank: the weeds' tops across the bottom fifth of the panel, two cats' heads in them, the bank rising beyond with its holes, and at the top the rails against the moonlit sky | `weeds-1` (left), `weeds-2` (right): whoever is there has **tall weeds drawn over her up to the eyes**, just after her (ears, eyes and the top of the head above; as the field's `grass` covers Sleet), and beside her face as high as her back, so her back, flank and haunch are in the weeds too (crouched, they rise above her eyes), and a **`tailUp` tail's tip stands above the weeds**; `hole-1`, `hole-2` (weasels at their holes, mid-distance, smaller than the cats' heads); `rails` (Reynard, up on the tracks, **never bigger than a cat's head in the weeds**) | `moon` |
| `holes` | close on the bank's face at weasel height: the little hole (left), a second small hole just beside it (higher up, between it and the biggest), and the biggest hole (right), whose mouth is about as wide as a small cat's shoulders, a little bigger than the pile's tunnel ("A tight squeeze"); faint tiny prints round every hole (always drawn); tall weeds at the left edge | `hole-1` (the little hole), `hole-2` (the second small hole beside it), both clear of `stash-mouth` and of the `tap: 'stash'` box (a weasel at each: in `peek` the hole's lip is drawn over its back half; standing, sitting up or pointing, on the slope in front of its hole; here a weasel is about half a cat's height; in the chase Snip sits up at `hole-2`, beside Snatch at `hole-1` as the story's note has her, while our cat is at `stash-mouth`), `stash-mouth` (a cat crouched at the biggest hole, her head at it, so the mouth's size reads against her shoulders), `watch` (a cat a little way off at the left, among the weeds, weeds over her legs: the friend keeping watch) | `tap: 'stash'` (the biggest hole's mouth: the peek or wriggle Tap) |
| `brag` | low angle up the bank from beside the holes: **Reynard on the rails at the top** against the moon and stars, the slope falling to the bottom corners where the two weasels sit up looking up at him. No cat of the Clan in this camera | `rails` (Reynard, here at a fox's size beside the weasels, still on the tracks), `slope-1` (bottom left), `slope-2` (bottom right) | `moon` |
| `stash` | inside the biggest hole: a low earthen chamber with roots in its roof, lit by a shaft of moonlight from the mouth at the left; along the back **mice and voles in tidy rows** (`PC.art.prey`, eyes shut, no blood; about a third of them with darker, muddy bellies and feet: ReedClan's), and beside them on the right **a heap of tower glass**: flat, clear, angular pieces with straight edges, piled, glittering (white glints, a pale blue-green edge, the "scale"'s look) | `stash-in` (at the left edge, a cat come in from the mouth: head, shoulders and forepaws in the chamber, the rest of her cut by the mouth's rim; the same for a cat who peeks and one who wriggles in: "The same stash camera.") | `tap: 'glass'` (one small piece at the heap's near edge, unpainted: the take-one Tap) |
| `stash-close` | close on the glass heap in the stash (its composition, zoomed): smooth, clear, flat pieces, the moonlight through them, one big piece in front | `near` (the corner of her face and a forepaw at the panel's left edge, drawn bigger than the panel as the field's `border-fox` `left` is: her head point inside the panel, so her whisper has a speaker in the cast; clear of the heap's keep box) | none |
| `crawl` | **inside the tunnel**, at cat height: dark earth walls close round a crawling cat (just wide enough: the roof low, just clearing a sitting cat's ears at `crawl-1`, where her raised forepaw in `pawup` touches the roots hanging from it, the roof Tap; lower behind her toward `crawl-2`), roots hanging from the roof, a soft earth floor with **tiny prints going both ways** (faint, always there: the noticing cat notices them), dim blue-grey, no light source; over the roof (here and in `fork`) solid dark earth to the top of the panel, no lighter bands, a lip of earth along the roof line and short roots in it, so the tunnel reads just taller than she is (the final review, 2026-10-24) | `crawl-1` (the leader, crawling, facing right), `crawl-2` (behind her at the left, partly cut by the panel's edge) | `tight: true` (the tunnel narrows at `crawl-2`: an earth lip and roots drawn over the back half of whoever is there: "I’m stuck.") |
| `fork` | inside the tunnel where it **splits in two**: a small cat's way, the roof low just over her ears (as `crawl`'s), and at the far wall two small ways on, flat on the floor like doorways (never round eyes), unequal and offset, each in a rim of dug earth of its own, a root hanging between them that ends above her ears; nothing in it looks like a face or a cavern (the integrator's round) | `fork-1` (a cat at the split, between the ways: facing one, her nose at its rim), `fork-2` (behind her, nearer us at the right, clear of both ways) | `worm: true` (one pink worm poking out of the left way's wall just in front of her nose as she sniffs it: "Worms. Just worms.") |

Declared: `opts: { moon: 'number', tap: ['none', 'weeds', 'stash', 'glass'], tight: [false, true], worm: [false,
true] }`, `defaults: { tap: 'none', tight: false, worm: false }` (`moon` off unless given). `crawl` and `fork`
are a composition of their own; `stash` and `stash-close` another; `wide`, `hide`, `holes` and `brag` look at
the one bank. Each `tap` value is an unpainted `<rect class="pc-tap" data-tap="…">` (the marsh's, the pile's),
so a scene with it draws as it does without.

#### The Barking Field at night (`field`)

- **The night look** (`fx: ['night']`, drawn by no earlier chapter): "silver in the moonlight": the grass, the
  path and the fence's wire catch a cool silver light, the hollow log's dark mouth reads, the sky deep blue
  with stars and (with `moon`) the half moon. Every frame of chapters 2, 4 and 6 (all by day) draws
  byte-identically.
- **New anchors** (additional; the border's three cameras unchanged):
  - `heap-1`, `heap-2`, `heap-3` (`wide`): three dogs lying close together inside the fence, near it, behind
    the wire (z behind, as `dog-1`…`dog-3`): the heap.
  - `log` (`wide` and `dogs`): at the hollow log's mouth, far inside the fence; whoever is there has the log's
    near rim drawn over her lower body, head and shoulders out (a dragonet popping up). Big enough on `dogs`
    for her face to read.
  - `wire` (`dogs` and `fence`): inside, at the wire, a dragonet's spot beside the dogs (Hail bouncing up to
    the fence; face to face with a cat on the path in `fence`).
  - `ring-1`…`ring-4` (`wide`): four spots in the field round the log, inside the fence, for animals running
    round in a big circle (each facing along the loop).
  - `fence-top` (`wide` only): on the fence's top rail (about y 250 on `wide`, where a cat of about h 180 to 220
    fits), drawn in front of the wire: a climber walking along it, the dogs at `dog-1`…`dog-3` jumping below her.
    Not on `dogs`: its rail is at y 74 (`COMPS.dogs.fence.top`), so a cat on it would stand almost wholly above
    the panel, and the rail cannot move (chapter 2's `dogs` frames are pinned).
  - `trail-1`, `trail-2`: on `wide`, on the path right of `path-right`: two weasels chasing the cats, who run
    left, home; on `dogs` (where `path-right` is at x 1450 of 1600 and there is no room right of it), along the
    middle of the path, about x 700 and x 1050, for the frames with the weasels alone on the path.
- On every field camera the way to the tracks is to the right and home to the left: the trail out faces
  right, the chase home runs left.
- **A cat lying flat on the path at night lies in the grass at its edge** (no option: the night draws it): grass
  over her lower body, as Sleet's long grass is over his (about half as high as she lies, up to her chin in
  front of her face, never over her eyes), in the night's greens and silver, in front of everyone. On `dogs`
  our cat is never on the path's puddle (x 670 to 930, under `trail-1`): the sneak puts her flat at a spot of
  the frame's own, `{ x: 470, y: 975, h: 285 }`, ahead of the friend at `path-left`, and Hail's scene sits her
  at `{ x: 520, y: 968, h: 286 }` to talk to Hail at the wire; dry on every page, as the water-worry cat was
  told (final review, 2026-10-24).

#### The nest grows (`den`, `scenes.js`: a call, section 9)

The decision for chapters 8 to 10, made before any card is added (the brief). Today (`denBark`): the secret
cards go under the moss (`BARK_SECRET`), a corner showing for each, from t = 87k about 8k apart when more
than three; the rest stand along the mossy edge, one course of up to nine, and from the tenth two courses,
the older half behind (`BARK_LIFT` higher), each half the row however long (a 24-piece row stands twelve and
twelve), the row's room held at 78k past three hidden; and `BARK_MAX` (24) caps the row. A live save holds at
most 24 cards and at most six secret, so **with `hidden: true`** at most eighteen stand along the edge; but
**chapter 4's two bedtime frames hide nothing** (`ch04.js` f114 on `nest` and f115 on `doorway`: `DEN_BARK =
{ bark: 'auto' }`, no `hidden`), so a cat who has read chapter 6 or 7 and rereads chapter 4 has 19 to 24 pieces
along the edge there today, in two courses (checked in Node: f114 resolves `bark` to every card she holds, and
a 24-card cat's drawing reports `data-count` 24, two courses of twelve). Every live save's file draws exactly as
it does now: everything below applies only past six secrets, past eighteen along the edge with `hidden: true`,
or past twenty-four with `hidden` off, which no live save reaches.

- **`BARK_SECRET` gains `stash`, `glass`, `fox-brag`, `hail-shapes`** (section 3). Chapter 8 adds no piece
  along the edge: a full chapter-8 file is at most eighteen along the edge and eight to ten under the moss
  with `hidden: true` (and up to 28 along the edge in chapter 4's bedtime frames, below).
- **More than six under the moss: the corners stand in layers of six.** The first six stand as today (t =
  87k on, 8k apart). The seventh to twelfth make a second layer behind them: half a gap along (staggered
  between the first layer's), lifted on the rim's inner lip (about `BARK_LIFT` · k · 0.6), drawn first, so
  each still shows a corner over the moss; a thirteenth to eighteenth make a third layer the same way behind
  the second. Past eighteen no more corners are drawn (the file still holds the cards). Check eight (a cat
  without `my-count` or Hail), ten (a Hail cat's) and twelve: every corner visible, all inside the `nest`
  camera, none over her head.
- **A third course: past eighteen along the edge with `hidden: true`, past twenty-four with `hidden` off.**
  With `hidden` off, 19 to 24 pieces draw exactly as now (two courses: chapter 4's bedtime frames for every
  live save that has read chapter 6 or 7). Past the threshold the row stands three deep: the oldest third
  highest (two lifts up), the middle third one lift up, the newest third in front, each course at most nine,
  half a step along from the one in front, every course's step at least 5k (chapter 6's fullest). `BARK_MAX`
  becomes **27** (three courses of nine); past it the oldest are left out, as now. Check 27 along the edge with
  twelve under the moss: every piece inside the `nest` camera, the newest course readable, the corners still
  showing; and 25 to 27 with `hidden` off on `nest` and `doorway` (a chapter-8 cat of 25 to 28 cards rereading
  chapter 4: a new state, no live save holds more than 24).
- **Room left**: a chapter-8 cat holds at most 28 cards (18 along, 10 under). Chapters 9 and 10 can add eight
  more under the moss and nine more along the edge before either cap is reached, and if chapter 9 or 10
  lifts the moss (her case file laid out), 27 along the edge still reads. In chapter 4's bedtime frames (no
  `hidden`) a file past 27 shows its newest 27.

### New cast (`app/art/cats.js`; their scene rules in `scenes.js`)

- **Hail** (`hail`, she): a Mistscale dragonet on Sprinkle's model (as Sleet is), little: about Squall's size,
  sitting no taller than our cat (`SIZE_CAP` in `scenes.js`: `hail: 'player'`, Squall's rule). **White with
  grey speckles** all over (round speckles, like hailstones' shadows), pale grey ridges along her back, pale
  grey wing membranes folded small, a pale belly, two soft horn nubs, big round dark eyes with a big shine,
  eager brows; a bouncy curl in her tail. Plainly not Sleet (silver-white, blue-grey shade, bossy brows) and
  not Wisp (see-through pale). Never toothy, never fierce. Poses: **`sit`** (what an unknown pose draws; her
  book page is `bounce`, `book.dragonet`'s `pose`: section 5, The book), **`stand`** (on all fours, side-on),
  **`bounce`** (mid-hop, all four paws off the ground, wings
  half out, tail up: *BOING.*), **`run`** (running flat out round the field, wings flapping a little), **`peek`**
  (head and shoulders up, the rest of her below: out of the log, which the field's `log` draws over her),
  **`pawup`** (one forepaw raised, curious: "Can I touch it?"), **`tilt`** (head tilted, full of questions).
  Every mood, drawn her way (Sprinkle's moods). In `scenes.js`: `OWN_SHADOW.hail` (her shadow under her body,
  not her wings and tail), `NO_SHADOW.hail = { peek: 1 }` (in the log), not `BIG`.
- **Snip** (`snip`, she) and **Snatch** (`snatch`, he), weasels: sister and brother, long thin bodies, short
  legs, small round ears, pointed noses, black bead eyes with a shine, short tails; **thin brown fur, like the
  tuft at the Crossing** (chapter 5's `fur` card). Funny, greedy, quick, never cruel: small mouths, **no teeth or
  fangs ever shown**, never a snarl. **Snip**: a little smaller, lighter golden-brown, a white chin and bib down
  her front, a pale tail tip; the squeaky one (a mouth open a little wider when she talks). **Snatch**: darker
  chestnut, a cream belly, a black tail tip, a round full tummy; always holding a mouse. Size: "half your
  size": `SIZE_BAND` in `scenes.js` for both, `{ ref: 'player', pose: 'up', by: 'tall', min: 0.5, max: 0.65 }`.
  Poses (both): **`stand`** (on all fours, the long body low, side-on), **`up`** (sitting up tall on the hind
  legs, forepaws tucked: the weasel's look-out; what an unknown pose draws), **`run`** (bounding, the back
  arched), **`skid`** (front paws braced, the back end swinging round: "skid to a stop"), **`peek`** (head and
  shoulders out of a hole: a set draws the hole's lip over the rest), **`point`** (one forepaw out, pointing:
  the squabble), **`curl`** (curled up asleep: "two tiny snores"). Every mood, drawn their way (`shout` a
  squeak, `laugh` cheeky, `sleepy`, `worried`; `stern` a pout). Extras: **`holds: 'mouse'`** (a mouse,
  `PC.art.prey`'s, eyes shut, its tail dangling: in the mouth, `holdAt: 'mouth'`, the default; in the forepaws
  when sitting `up`, `holdAt: 'paws'`); `asleep: true` (eyes shut, in `curl`). In `scenes.js`:
  `OWN_SHADOW.snip`, `OWN_SHADOW.snatch` (under the long body), `NO_SHADOW` for both in `peek`.
- Labels (section 5): "A weasel" for both until “Snip is the squeaky one. Snatch is holding a mouse.”; "The
  speckled dragonet" for Hail until “I’m Hail!” (her first balloon from the log, “Ooh! Visitors!”, "A white
  head"); the dogs by their own labels ("The shaggy dog", "The spotty dog", "The tiny dog") until “I’m GOOD
  BOY!” and “I’m DROP IT!”, then "Good Boy" and "Drop It"; the tiny one keeps his.

### The cast from before, new poses and extras

- **Cats (every cat): new pose `run`**: running flat out, body low and long, forelegs reaching, hind legs
  pushing, tail streaming behind; eyes open; any mood (the chase: our cat and Tallyheart). `tap: 'paw'` marks
  its front paw (the RUN Tap).
- **Cats: new extra `tailUp: true`**: the tail held straight up, its tip curled over (in `sit`, `stand`,
  `crouch`, `walk`), standing above the head of a crouching cat: Tallyheart's tail sticking up out of the weeds,
  and "Your tail goes straight up." (our cat, `sit`, mood `proud`). **`tap: 'tail'`** marks the raised tail's
  tip (an unpainted `pc-tap pc-tap-tail`).
- **Cats: new `holds: 'leaf'`** (a leaf folded round something small: in the mouth walking, standing or
  running, `holdAt: 'mouth'`; at the forepaws sitting, crouching or lying, `holdAt: 'paws'`) and **`holds:
  'glass'`** (the leaf open on the ground at her forepaws, the small clear piece on it shining: `holdAt:
  'paws'` only); **`tap: 'leaf'`** marks the leaf's box with either (the put-down and show-her Taps).
- **Riffle**: **`tap: 'ears'`** (his small round ears marked: the whisper Tap), **`tap: 'paw'`** (his near
  forepaw marked: the pull-through Tap, in `scramble`), **`tailUp: true`** (his thick rudder tail stuck
  straight up) and **`tap: 'tail'`** (its tip). **No new pose**: he has no `run` and no `walk`, so on the trail
  and in the chase he goes on all fours in `scramble` (section 5). Never `juggle` under the Old Bridge, never
  `hug` in a frame that names Coil (the standing rules).
- **Dogs: new pose `lie`** (lying down, head on forepaws), and the dogs honour `asleep: true` (eyes shut
  whatever the mood): the heap. Their other poses as they are (`stand`, `jump`, `sit`, `bounce`, `howl`):
  `bounce` for racing and chasing, `howl` for "barking their heads off", `sit` with mood `happy` for wagging.
- **Reynard: new pose `trot`** (trotting along on all fours, tail high, his smile on): "Along the tracks trots
  Reynard"; "He trots off along the tracks, humming." `comb` ("He admires his tail."; "He fluffs his tail."),
  `chest` and `flap` (“It FLEW off, by moonlight!”) as they are. Never full-face, never teeth.
- **Tallyheart**: `stand` side-on for her paws (the board; the counting picture is the art's), `stretch` at
  `tree` (SKRITCH), `glow: true` at the ask, `crouch` with `claws: true` at the sand (chapter 7's), crouched at
  `poke` with her nose at the tunnel mouth's right rim (mood `proud`: “Hmph. Just as I thought.”, a wry smile; `laugh` draws tears, and no mentor looks hurt or crying), `run`, `tailUp` with `tap:
  'tail'` in the
  weeds, `worried` and `kind` at home (kept: “I’m not angry… I was scared.”).
- **Our cat**: `crouch` crawling at `crawl-1`, and at `tunnel-end` wriggling out; `pawup` with `tap: 'paw'`
  (the roof Tap, sitting up under the roots at `crawl-1`; the wave goodbye),
  `run` with `tap: 'paw'` and `holds: 'leaf'` (`holdAt: 'mouth'`), `crouch` with `holds: 'leaf'` (`holdAt:
  'paws'`, `tap: 'leaf'`) and `holds: 'glass'` at home, `flat` in the grass (sneaking), on `fence-top` in `walk`
  (climbing), `sit` with `tailUp: true` and mood `proud`, `curl` with `asleep: 'half'` and mood `kind` at the
  last panel (chapter 7's).
- Every cat is drawn side-on, facing left or right (chapter 7's rule).

### Counts art (`app/art/cats.js`)

**What is pinned** (read this first): chapter 1's counts fingerprint (`tests/cats.test.js`) sweeps
`countsPicture({ table, groups, highlight })` for tables 1 to 9; chapter 6's sweeps tables 1 to 10 with no
`thing`; and chapter 7's (`sweep7`) sweeps every table with the `thing`s `THING[t]` (table 4's is `'paw'`)
and `'piece'`, the who pictures at tables 1 to 6, 9 and 10 (dogs, Riffle, Sprinkle and the rest among them)
with those `thing`s, and the sand at per 4 (`[3, 4, 7]`). So:

- **The 4s lesson's picture is the table-4 picture as it is** (cats side-on, standing, four paws each, lit in
  order; one to ten cats, five to a row): with the lesson's `thing: 'paw'`, its fillers, retries and the 4s'
  Hollow rounds; and the rim's paws and the bedtime paws (table 4 with a `who`). Nothing to build; check it
  reads (four paws on every cat; `lit: 28` lights exactly seven cats; ten cats in two rows of five).
- **One cat's paws, a pair at a time** (new, keyed on `thing: 'paw'` at per 2, no kind: no sweep reaches it;
  dispatched before the 2s' ears): `countsPicture({ table: 2, per: 2, groups: 2, thing: 'paw', who: [{ who:
  'tallyheart' }], highlight, totals, next })`: one big cat (`who[0]`, Tallyheart's ginger tabby) side-on,
  standing, her four paws plain at the bottom: **the front pair the first group, the back pair the second**;
  `highlight` 2 lights the front pair, 4 both; `totals` puts 2 and 4 under the pairs; `next` glows on the next
  pair. Label "One cat: two front paws and two back paws".
- **The field's four** (new, `kind: 'dogs'`): the table-4 picture's tiles, each animal of `who` side-on,
  standing, four paws each, lit in order an animal at a time: the dogs by variant (shaggy, spotty, tiny, at
  their sizes, fitted to the tile) **with paw marks that light** (a dog has none in the counts picture today),
  and **Hail** standing with her four paws; a cat in the list as the table-4 picture draws it. A `who` longer
  than `groups` draws its first `groups` entries (a filler of two: the first two dogs). One to four animals at
  least (Hail's set never lends more: `avoid`). Label "N animals, four paws each".
- **Marks two and two** (new, `kind: 'marks'` with `layout: 'pairs'`): each night's `per` marks scratched in
  pairs with a gap between the pairs (four: two and two), on sand or `ground: 'mud'`; `highlight` lights the
  marks in order, a night at a time. **Without `layout`, marks draw exactly as chapter 7's** (the twenty-four's
  four in a row, the sixties' two rows of five, Snip's two).
- **The sand at per 4: two and two** (new): `PC.art.sand({ groups, per: 4, counted })` scratches each group
  as two pairs with a gap (as chapter 7's per 6 is three and three), lit in order. Per 4 is drawn by no shipped
  frame (no chapter before 8 helps a 4s fact in the sand: the twenty-four's help is its own picture; the goldens
  prove it), but `sweep7` pins it: the cats owner skips `[3, 4, 7]` in `sweep7`'s sand only where it is plain
  (`!style`, exactly as per 6 is skipped today: `if ((p === 6 || p === 4) && !style) continue`), so the per-4
  swipes, with and without `pair`, on every ground, stay pinned, and re-takes its hash on the shipped snapshot,
  saying so in the test (as chapter 6 took table 3 out of chapter 5's sweep).
- From before, unchanged: the cheeks (the warm-up), the prey rows (the pile), the marks at per 2 on mud
  (Snip's share).

### Heard, not seen

Tallyheart's pawstep count over the tunnel ("Forty-one…", "A hundred and ten…"); the dogs snoring and
sleep-talking over the tunnel ("Mmmf. Squirrel…", "Drop it…"): all lettered as captions, never drawn; the
weasels' "two tiny snores" (*Squee. Squee.*, the sound).

## 5. Build notes

General rules for the story builder, then section by section where a screen needs one. Chapter 7's file
(`app/story/ch07.js`) is the model: its helpers (`c`, `S`, `merge`, `RIM`, `rim()`), frame ids in reading
order with letters for outcomes, a `board` on every frame.

- **Speakers.** `names: { snip: 'A weasel', snatch: 'A weasel', hail: 'The speckled dragonet' }`. From the
  panel of “Snip is the squeaky one. Snatch is holding a mouse.” on, every balloon of theirs carries `name:
  'Snip'` / `'Snatch'`; from “I’m Hail!” on, Hail's carry `name: 'Hail'` (her riddle comes before it, so the
  Counts lines are "The speckled dragonet"'s); her first balloon from the log, “Ooh! Visitors!”, carries
  `name: 'A white head'`. The dogs speak with the page's own labels ("The shaggy dog" is variant 1, Good Boy,
  "the biggest dog"; "The spotty dog" variant 2, Drop It, "the next"; "The tiny dog" variant 3, who "forgets
  his name a lot") until their names: from “I’m GOOD BOY!” and “I’m DROP IT!” on, `name: 'Good Boy'` and
  `name: 'Drop It'` (the chase's “SQUIRRELS!” included, on both routes: a tunnel reader heard both names from
  above); “BYE, RUDE SQUIRRELS!” bark the dogs is one balloon from Good Boy with `name: 'The dogs'`. Every
  speaker is in the frame's cast (chapter 5's test).
- **Captions first, then balloons** (chapter 5's rule): where the story puts narration after a balloon on one
  screen, the narration opens the next panel or the panel is split. The screens where it matters are named
  below, section by section.
- **No panel holds five boxes** (chapter 7's rule; the reader critic's three crowded screens): split at a
  speaker. The screens: “One ear twitches…” (the waking heap, then the three at the fence); the fetch (“FETCH!”
  then “Three dogs race after it.” and its four balloons, split after “No, MINE!”); “Behind you: sniff, sniff.”
  (Snatch's “I smell CAT.” panel, then Snip's and Snatch's lines); “Under the Old Bridge!” (three balloons, then
  “Reynard sighs.” with “Weasels.”); POP! (“Otters are bendy,” … “Mostly.”, then the three-line “Are we nearly
  there?”).
- **Long captions** (chapter 5's rule: at most 95 characters on a panel; longer is split at a sentence break
  into boxes, the words unchanged): “At the Old Bridge, you check the bank first…” (101), “Behind the back row,
  a wet nose pokes through the hedge…” (115), “Inside, it’s just wide enough for you…” (97), “The Barking Field
  is silver in the moonlight. Inside the fence…” (96), “Out bounces a little dragonet…” (114), “Up onto the fence
  top you go…” (138), “Along the tracks trots Reynard…” (117), “It sparkles. It shines…” (142), “Outside, the moon
  is half full…” (128), “Eight claw marks on the tree…” (121).
- **Paths in the picture.** A scene cannot vary by flag. A frame whose picture holds the friend (Tallyheart on
  the told path, Riffle on the kept) or whose lines are the friend's is two frames by `ch3Told`, one after the
  other, with opposite `when`s (chapter 6's rule); the close shots that hold neither are written once: the
  tunnel's `crawl` shots of our cat alone, `holes` close on her at the stash's mouth, `stash`, `stash-close`,
  `brag`, `fence` with Hail, `dogs` with the dogs (and the weasels, and Hail). Likewise a picture with Hail in it
  after her scene (the chase's fence) is two frames by `foundHail`. **A choice only one path sees** carries
  `when` and an `else` (chapter 4's roof offer): the told and kept forks in the tunnel, the told and kept hollow
  log choices, the told and kept fox choices, the kept "I’m sorry." choice (its `else` past the kept panels to
  the shared “She touches her nose to yours.”). Each of those choices has its own outcome panels (chapter 7's:
  the storyboard walks a choice's branches to where they meet).
- **The routes are a real branch.** “Two ways to the tracks” (written once: section below) leads to the
  tunnel's first frame or the field's; each route's frames are reached only through its option and need no
  route `when`; the two meet at the first frame of “The weasel holes”. The specialty frames after “Not
  tonight.” are a chain, each with its own `when` (`{ specialty: 'sneaking' }`; `'climbing'`; `'friends'`;
  `{ specialty: ['noticing', 'swimming'], ch3Told: true }`; the same with `false`), each ending on the
  slip-past Tap, each Tap leading to the next frame of the chain (passed over when it is not hers:
  `E.landing`) and the last to the weasel holes.
- **Sound effects** as the story letters them: *Snore. Snore. Snore.* (the heap), *BOING. BOING. BOING.*,
  *POP!*, *SKRITCH!* (the tree), *Squee. Squee.* (the little hole), *ACHOO!*, and the small pale ones: *sniff,
  sniff.* and *skritch, skritch.*. **`sfxRead`**: “In your nest:” runs on into its sound (`sfxRead: 'skritch,
  skritch.'`, as chapter 7's nest line); “Behind you:” runs on into its sound (`sfxRead: 'sniff, sniff.'`).
  **The sneeze is a panel of its own** (section 7, item 4): the caption “Then your nose tickles. The stash
  smells of weasel. Weasel smells like very old socks.” and her balloon “Ah… ah…” on one panel with no sound,
  then *ACHOO!* alone on the next with `sfxRead: 'a great big sneeze: ACHOO!'` (`E.captionsRead` says a
  frame's `sfxRead` after its captions and before its balloons, so on one panel the listener would hear the
  sneeze before the “Ah… ah…”).
- **One-tap frames** (`scratch: { tap, prompt, label, next }`; the target is the cast extra or the set's `tap`
  mark of that name; no `miss` line; the story's response is drawn on the next panel, chapter 6's call 13):

  | Screen | `tap` (who or what carries it) | `prompt` | `label` | Next panel shows |
  |---|---|---|---|---|
  | The back row is still in the brambles' shadow | `back` (`pile`/`rows`, chapter 7's shade, `tap: 'back'`) | `**Tap** to walk round the back.` | `Walk round the back.` | the gap: four empty spaces (`gap`) |
  | At the Old Bridge (kept) | `ears` (Riffle, `stand`, `holds: 'string'`) | `**Tap** to whisper in Riffle’s ear.` | `Whisper in Riffle’s ear.` | “A TUNNEL?” on `wall` |
  | The sun goes down… The camp turns silver. | `back` (`pile`/`wide`, dusk, `moon: 8`, `tap: 'back'`) | `**Tap** to slip round the back.` | `Slip round the back.` | behind the back row (`rear`, night) |
  | Through the tunnel: you go under (told), “You first,” (kept) | `mouth` (`pile`/`rear`, `tunnel: true`, `tap: 'mouth'`) | `**Tap** to wriggle in.` | `Wriggle in.` | inside the tunnel (`crawl`) |
  | Is Tallyheart still up there? (told) | `paw` (our cat at `crawl-1` in `pawup`, her forepaw at the roots) | `**Tap** the roof, softly.` | `Tap the roof.` | the count from above |
  | “Um,” he whispers. “I’m stuck.” (kept) | `paw` (Riffle at `crawl-2` in `scramble`, `crawl` with `tight: true`) | `**Tap** to pull Riffle through.` | `Pull Riffle through.` | *POP!* |
  | each way past the dogs, and Hail's last screen | `path` (`field`, `tap: 'path'`) | `**Tap** to slip past.` | `Slip past.` | the bank by the tracks |
  | Voices! Squeaky ones, coming closer. | `weeds` (`tracks`/`wide`, `tap: 'weeds'`) | `**Tap** to hide in the tall weeds.` | `Hide in the weeds.` | in the weeds (`hide`) |
  | The tip of the friend's tail is sticking up | `tail` (the friend at `weeds-2`, `tailUp: true`) | `**Tap** the tail to pull it down.` | `Pull the tail down.` | the tail down, Reynard on the tracks |
  | The biggest hole (not `small`) | `stash` (`tracks`/`holes`, `tap: 'stash'`) | `**Tap** to peek inside.` | `Peek inside.` | the stash (`stash`) |
  | The biggest hole (`small`) | `stash` | `**Tap** to wriggle in.` | `Wriggle in.` | the stash (`stash`) |
  | Proof. | `glass` (`tracks`/`stash`, `tap: 'glass'`) | `**Tap** to take one small piece.` | `Take one small piece.` | her nose tickles, the leaf in her paws |
  | “GET THAT CAT!”… | `paw` (our cat in `run`, `holds: 'leaf'`) | `**Tap** to RUN!` | `Run!` | the chase on the field |
  | Nobody’s hurt. | `paw` (our cat in `pawup`) | `**Tap** to wave goodbye.` | `Wave goodbye.` | home behind the pile |
  | Through the hedge, behind the pile (told) | `leaf` (our cat, `holds: 'leaf'`, `holdAt: 'paws'`) | `**Tap** to put down the glass.` | `Put down the glass.` | the leaf open, the piece shining (`holds: 'glass'`) |
  | Everything but the dragonets (kept) | `leaf` | `**Tap** to show her the glass.` | `Show her the glass.` | the leaf open, the piece shining |

- **Cards on their frames**: `stash` on “Mice and voles, in tidy rows…” (on `stash`, shared); `glass` on “It’s
  not a scale,” you whisper. “It’s GLASS.” (shared); `fox-brag` on the panel of “He laughs, a soft little yip.
  “Nobody saw a thing.”” (on `brag`, shared); `hail-shapes` on Hail's “Are you following the skinny ones?…”
  (on `fence`, shared). No card's line is said on its frame, so each is lettered.
- **`sets: { foundHail: true }`** on Hail's last screen, both twins (told and kept: her friend on the path).

### The seventh count

- Told: `den`/`inside`, `night`, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden: true }`,
  our cat waking in her nest (`lie`, `wonder`), Tallyheart crouched beside the nest (the raw spot of section 4's
  den row, about `{ x: 1250, y: 896, h: 250 }`, facing left; eyes shining: `happy`),
  the grey tom asleep at `sleeper-1`; her whisper and “Did you pounce?” / “No. If we pounce here…” (two
  panels, `when: { ch3Told: true }`).
- Kept: `pile`/`wide`, `morning`, chapter 7's shade, the last guards yawning at the front (three `clancat`s,
  `sleepy`), {Murmur}chime's “Nothing,” (`when: { ch3Told: false }`).
- Both: the count on `rows` (chapter 7's shade; the Clan round, Glintstar, Tallyheart and our cat at the
  front; Counts frame `{ set: 'ch08-pile', intro: false }`, its caption “At sunrise, the whole Clan is waiting
  by the pile.” and Glintstar's balloon); the walk-round Tap; “Right in the middle of the back row: four empty
  spaces.” and her “Four gone,” … “Still tidy.” on `gap` (`{ rows: …, scale: 'behind', dug: 'big' }`); “The
  guards look at their paws.” opens the next panel (`wide` or `low`) over Glintstar's “Nobody here is to blame,”
  and the old tom's “…WHISKERS.” (`grizzled`, `holds: 'pinecone'`, `holdAt: 'paws'` as chapter 7). Nobody is
  blamed: no `stern` at anyone; the guards `shy`.

### Paws

- The warm-up: `hollow`/`wide`, `morning`, `rim()`, Tallyheart at `tree-far` (`size: 1.2`), our cat at
  `sunpatch-2`, `{ marks: 7, glow: 'auto' }`; Counts frame `{ set: 'ch08-sixes', intro: false }` with the
  caption and Tallyheart's balloon.
- “Today’s Count is right under you,” … “What has every cat got FOUR of?” alone on `lesson`; then “You look
  down.” opens the next panel with her “PAWS!” (our cat `crouch`, mood `wonder`, head down to her paws: the
  art has no looking-down pose).
- “Four paws on every cat,” says Tallyheart. alone on `lesson` (Tallyheart `sit`); “She stands so you can see
  all of hers.” and “Count mine.” are the paws skip's panel (Tallyheart `stand`, side-on; section 2). Its kept
  page carries the three balloons “Two front paws…”, “Two twos!…”, “Exactly. Doubling, AGAIN.”.
- The rim's paws: the skip on `wide` with the rim (the board: the five rim cats hopping down and padding past
  her one by one).
- The ask on `wide`, `{ marks: 7, glow: 'auto' }` (section 2).
- The lesson: Counts frame `{ set: 'ch08-fours', intro: false }` on `lesson`, `{ marks: 7, glow: 'auto' }`, its
  balloon “Seven of them you knew already,” … “Or count the front paws, and double it!”. Then SKRITCH! on `tree`
  with `{ marks: 8, glow: 'auto' }` (captions “Tallyheart stretches up the leaning tree.” and “An eighth claw
  mark.”, the sound), then `wide` with `{ marks: 8, glow: 'auto' }` for “Paws. That’s your eighth Count.” and
  the two `lessonClean: 'ch08-fours'` pairs (balloons with `when`, as chapter 7's f032). Every `hollow` frame
  after it is `{ marks: 8, glow: 'auto' }`.

### Twenty-eight

- “Now,” says Tallyheart. “Let’s count what’s gone.” alone on `lesson`; the twenty-eight's Counts frame `{ set:
  'ch08-gone' }` on `sand` (Tallyheart `crouch` with `claws: true`), its caption “In the sand she scratches four
  marks for every night. Seven nights.”; the question is the fact's.
- Told: “Twenty-eight,” says Tallyheart softly… / “Just us?” / “Just us…” on `lesson` (one panel, three
  balloons).
- Kept: “Twenty-eight,” says Tallyheart, frowning… “Back by sunset.” alone on `lesson`; then “You know why: they
  come from UNDER!…” a panel of its own (her thought: the caption only, our cat `shy`).
- Kept, at the Old Bridge (`day`): the whisper Tap on `back` (captions “At the Old Bridge, you check the bank
  first. No ginger ears.” / “Riffle is there, with fish for Sprinkle.”; Riffle `stand` with `holds: 'string'`
  and `tap: 'ears'`; Sprinkle at `dragon`, `sit`, `happy`; Coil at `gap` in `stone`, `size: 1.45`); “A TUNNEL?
  Under your PILE?” squeaks Riffle. alone on `wall` (Riffle `stand`, mood `shout`, no string: the dropped fish
  is not drawn, section 10); then “Quietly,” (Coil `stone` at `gap`, labelled "Coil", chapter 7's call 19) and
  “…pile,” (Riffle `hush`) on `wall`; then “Granny says…” / “Be careful,” says Sprinkle… on `back`.

### The night trail

- `pile`/`wide`, `dusk`, `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', moon: 8, tap: 'back' }`: the
  first guards at the front facing out (three `clancat`s, side-on, away from the pile), our cat alone near the
  pile; the two captions and the slip Tap. (Written once: on the told path Tallyheart is already behind the
  back row.)
- Behind the back row, `night`, on `rear` with `{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big', tunnel:
  true }` (the guards small at `guard-1`…`guard-3`): told, Tallyheart at `rear-2` by the mouth, our cat at
  `rear-1`; kept, Riffle at `rear-2` (his wet nose through the hedge: the caption carries it), our cat at
  `rear-1` (a pair). Then “Two ways to the tracks,” whispers Tallyheart… (told, alone) or Riffle's two panels
  (kept: “Two ways…” alone; “He pokes his head in.” with “I’d fit. Otters are bendy.”, Riffle at `poke`).
- **The route choice**, written once, on `hole` (`{ rows: [10, 10, 10, 10], scale: 'behind', dug: 'big' }`):
  our cat crouched at `brink`, the mouth the width of her shoulders; the worry captions (`small`, `water`) and
  **Choose**: “Through the tunnel.” / “Around the Barking Field.” (`sets: {}`; each to its route's first frame).

### Through the tunnel

- The first screen, a pair on `rear` with `tunnel: true, tap: 'mouth'`: told, Tallyheart crouched at `poke`,
  her nose at the mouth's right rim (the mouth's tap box clear of her head, section 4), mood `proud`, a wry smile
  (call 28; the captions “Tallyheart pokes her head in, just to see. Her shoulders
  stick.” and her “Hmph. Just as I thought,” … “Listen for me.”; built nearly: section 10), our cat at
  `rear-1`; kept, Riffle at `rear-2` (“You first,”…), our cat at `rear-1`. Both carry the wriggle Tap.
- Inside, written once on `crawl`: our cat crouched at `crawl-1`; the captions (split: “Inside, it’s just wide
  enough for you. And dark.” / “But cats see well in the dark, even pillow cats.”), “Roots. Earth. And the smell
  of mice.”, the `small` and `noticing` lines.
- Told: the roof Tap (our cat `pawup` at `crawl-1`, sitting up under the roots, `tap: 'paw'`: the roof there
  clears a sitting cat's ears, section 4), then “From above, very faint: “Forty-one…”” (a caption)
  and “It’s Tallyheart, counting her pawsteps over your head. You grin in the dark.” (our cat `crouch`,
  `laugh`). Kept: “Riffle comes in after you…” with “Um,” he whispers. “I’m stuck.” and the pull Tap on `crawl`
  with `tight: true` (Riffle at `crawl-2`, `scramble`, `tap: 'paw'`); then *POP!* and his two panels.
- The fork, a pair on `fork` (told: our cat alone at `fork-1` and the told caption “Far above: “A hundred and
  ten…” Tallyheart is still counting.”; kept: Riffle at `fork-2`), each a choice with `when` and `else`: “Sniff
  the left way.” / “Sniff the right way.” (`sets: {}`); each choice's own two outcome panels on `fork` (a, our
  cat facing left, mood `sniff`, `worm: true`, the caption “Worms. Just worms. The other way, then!”; b, facing
  right, mood `happy`, “Mice! LOTS of mice. This way!”), all four leading on to the shared next frame.
- “On and on you go…” written once on `crawl`, our cat looking up (`crouch`, `wonder`), the dogs' sleep-talk as
  captions: “On and on you go. Then, right over your head, something snores. Something doggy.”, ““Mmmf.
  Squirrel,” it mumbles. “Who’s a Good Boy? ME.””, ““Drop it,” mumbles another. “That’s my NAME.””, “You’re right
  under the Barking Field!” (a caption may carry quotes, as chapter 7's "“Sorry, Coil,” everybody whispers.").
- The far end, a pair on `tracks`/`wide` (`moon: 8`): told, our cat at `tunnel-end` in `crouch` wriggling out
  (the hole's lip over her back half), Tallyheart sitting at `foot-2` (“Three hundred and twelve pawsteps,”…);
  kept, our cat at `foot-1`, Riffle at `tunnel-end` in `scramble` (“Ta-DA!” / “SHH!”).

### Around the Barking Field

- “Then we go together,” whispers Tallyheart… (told) or “Round the near side,” whispers Riffle… (kept): a pair
  on `rear` with `tunnel: true` (the friend and our cat, setting off), each alone; then a pair on `field`/`wide`,
  `night`, `moon: 8`: the caption (split: “The Barking Field is silver in the moonlight.” / “Inside the fence,
  three dogs are asleep in a heap.”), *Snore. Snore. Snore.*, the dogs at `heap-1`…`heap-3` in `lie` with
  `asleep: true` (`zzz`), our cat and the friend walking right on the path (`path-left`, `path-right`; our cat and
  Tallyheart in `walk`, Riffle on all fours in `scramble`: he has no `walk`), and the
  friend's caption (“Tallyheart pads beside you, quiet as moss.” / “Riffle pads beside you, not saying a word.
  For once.”).
- “One ear twitches.” with “WHO’S THERE?” (the heap waking, `wide`: Good Boy at his heap spot in `sit`, his head
  up, since `lie` is head on forepaws; the other two still in `lie`), then the three at the
  fence on `dogs` (`jump`, `bounce`, mood `shout`) with “A SQUIRREL!” / “It’s a CAT.” / “A cat is just a BIG
  squirrel!” (the story's note: the picture shows all three bounding to the fence; no words say so). The names
  on `dogs`: Good Boy's and Drop It's balloons; then “The third one just barks. He forgets his name a lot.” (the
  tiny dog `howl`) with her whisper “That’s what their Tall Ones shout…”. Pairs where the friend is on the path.
- The hollow log: a pair on `dogs` (or `wide` if her face reads there), Hail at `log` in `peek` (“Ooh!
  Visitors!”, `name: 'A white head'`), the dogs at the fence, our cat and the friend on the path; **Choose**:
  “Who’s in the log?” (`when: { foundHail: false }`) / “Go and see Hail again.” (`when: { foundHail: true }`)
  (both to the hollow log's first frame) / “Not tonight. Keep going.” (to its outcome panel: “The white head
  ducks back in.”, the log empty, then the specialty chain); each twin with `when` and `else`.
- The specialty chain (each frame `when` as above; written once where the friend is not in the picture):
  - sneaking: `dogs`, our cat `flat` on the path, the dogs at the fence sniffing (`stand`, mood `sniff`), Good
    Boy's “Where did the squirrel GO?” (the captions first).
  - climbing: `wide` (the field's `fence-top` is on `wide` only: section 4), our cat at `fence-top` in `walk`,
    the dogs at `dog-1`…`dog-3` in `jump` barking at her tail.
  - friends: three panels: her “Hello, dogs!” (our cat `pawup` at the fence); “The dogs stop.” with Good Boy's
    “Nobody ever says HELLO to us,”; “While all three wag, you trot past.” (the dogs `sit`, `happy`) with the Tap.
  - noticing or swimming, told: “Tallyheart flicks a pinecone over the fence.” with her “FETCH!” (Tallyheart
    `pawup`); then “Three dogs race after it.” and the four dogs' lines over two panels (Good Boy “MINE!” and
    “Drop it!”, Drop It “No, MINE!” and “I AM Drop It!”), the dogs `bounce` away from the fence, the Tap on the
    last. Kept: the same with Riffle and a pebble (Riffle `point`).
- The slip-past Tap (`tap: 'path'`) ends each, to the weasel holes.

### The hollow log (the optional scene)

- *BOING.* and “Out bounces a little dragonet…” (two boxes) with the friend's “Another one!” / “ANOTHER
  dragon!”: a pair on `dogs`, Hail at `wire` in `bounce`, the dogs `bounce` behind her, our cat and the friend
  on the path. Her first appearance is clear: nothing in front of her at the wire (the spotty dog bounds up
  from far back, at the camera's `field`, by the log: the dogs come after her), and the *BOING* is lettered
  high over the trees with `sfxAt: [55, 32]`, off her (final review, 2026-10-24: at `dog-2` the spotty dog's
  legs hid half of her, and the page lettered the sound across her body).
- Written once on `fence` (Hail at `wire`, our cat on the path at `path-left`): “Hello! Are you a cat?…” (Hail
  `tilt`); the riddle's Counts frame `{ set: 'ch08-hail' }` (on `dogs`, the dogs and Hail at the fence, no cat:
  her balloon “Want a riddle? Here’s one! Three dogs, and me. That’s four of us. Four paws each!”); “I’m Hail!
  Mama says…” with “Are you Sprinkle’s sister?” you ask.; “SPRINKLE? Is she safe?…” with “Under the Old Bridge,”
  you say. “She’s safe.”; for a cat who has found any dragonet, “And I’ve found more of you!” / “MORE? WHO? Tell
  me EVERYTHING!” on a panel of their own (with the `not` `when`), and “You tell her, name by name.” opens the
  next; “Are you following the skinny ones?…” with the `hail-shapes` card.
- “Want to get past the dogs? Watch THIS!” alone (`fence`); “Hail bounces off across the field.” with “DOGS!
  Chase me!” (`wide`, Hail at `ring-1` in `run`, the dogs turning); “Three dogs chase her in a big, silly circle.
  Round. And round. And ROUND.” (`wide`, Hail and the dogs at `ring-1`…`ring-4`, `run` and `bounce`, `motion`);
  then her last screen, “Tell Sprinkle: five!” … “And tell her I’m the BOUNCIEST!”, a pair on `wide` (Hail, who
  speaks, at a ring spot in `run`; our cat and the friend at `path-left` and `path-right`; `tap: 'path'`), each
  with `sets: { foundHail: true }` and the slip-past Tap.

### The weasel holes

- A pair on `tracks`/`wide` (`moon: 8`), our cat at `foot-1` and the friend at `foot-2`: “A high bank rises in
  the moonlight. On top run two long, shiny lines: the train tracks.” / “All along the bank are holes, like the
  one under your pile.” and the friend's “Not fox country,”…; the `noticing` caption opens the next panel, the
  hide Tap's (“Voices! Squeaky ones, coming closer.”, `tap: 'weeds'`), also a pair.
- On `hide`, a pair (our cat at `weeds-1`, the friend at `weeds-2`): “Out of two holes pop two skinny shapes:
  long, thin and quick.” and the friend's “Weasels,” (Tallyheart's a whisper balloon; Riffle mouths his without a
  sound, so on the kept panel the story's own line is a second caption, “WEASELS,” Riffle mouths, without a sound.,
  and no balloon of his is read aloud: the final review, 2026-10-24); Snip
  and Snatch at `hole-1`, `hole-2` in `peek`. The `foundSquall` caption opens the next panel.
- On `holes`, written once: “Just what Squall saw from his roof!” (with `when`), “Thin brown fur…” and “The
  thieves!” (the weasels `up` and `stand`; Snatch `holds: 'mouse'`); the squabble (“I carried MORE than you,
  Snatch!” and “A vole is just a fat mouse, Snip,”: labels "A weasel"); “Snip is the squeaky one. Snatch is
  holding a mouse. Snatch is ALWAYS holding a mouse.” opens the next panel, with “Seven nights of it!” (`name:
  'Snip'`) and “That’s a HUNDRED,” (`name: 'Snatch'`).
- Snip's share: two Counts frames by `ch3Told` on `hide` (`{ set: 'ch08-snip' }` with `when: { ch3Told: true
  }`, `{ set: 'ch08-riffle' }` with `when: { ch3Told: false }`), the caption “These two can’t count. But YOU
  can.”; then “And fourteen for Snatch…” with her whisper and the friend's “The Counts don’t lie,” (a pair).

### The fox

- On `hide`, a pair: “Then a smell you know. FOX.” / “Along the tracks trots Reynard…” (two boxes), Reynard at
  `rails` in `trot`; then the tail Tap (the friend `tailUp: true`, `tap: 'tail'`; Reynard at `rails`, never
  looking their way).
- On `brag`, written once (Reynard at `rails`, Snip and Snatch at `slope-1`, `slope-2` looking up): “Good
  evening, my clever little paws,” alone; “He admires his tail.” (Reynard `comb`) with “And such a fine, dry den,
  waiting just for me.”; then the `foundPuddle` and `foundSleet` captions open the next panel, with “Under the
  Old Bridge!” (Snip), “At the Gathering, the Clans will chase their dragon away,” (Reynard) and “And their pile
  is OURS!” (Snatch, the mouse in his mouth); “Reynard sighs.” with “Weasels.”; “One shiny bit by their pile,” …
  “And the whole Clan said DRAGON.” alone (Reynard `flap`); “He laughs, a soft little yip.” with “Nobody saw a
  thing.” and the `fox-brag` card (Reynard `chest`, `laugh`).
- “He fluffs his tail. He is VERY pleased with himself.”, the `talk` line and **Choose** (“Glare at him.” /
  “Stick out your tongue.”, `sets: {}`): a pair on `hide` (Reynard `comb` at `rails`), each with `when` and
  `else`, each with its one outcome panel “He doesn’t see. Good.” (both options): our cat `proud`, pleased with
  herself, which is true after either (not `laugh`, which a cat who chose “Glare at him.” would see as giggling).
- “Nap now, my little sneaks,” … “And keep it TIDY.” alone (`brag`); “He trots off along the tracks, humming.”
  opens the next panel with “The weasels pop down a little hole. Soon: two tiny snores.” and *Squee. Squee.*
  (`holes`, nobody: `peek` draws head and shoulders out of a hole, never tails going in, so the caption and
  *Squee. Squee.* carry it).

### The stash

- On `holes`: told, “Now’s your chance. You creep to the biggest hole.” with Tallyheart's “Too small for me,” …
  (our cat at `stash-mouth`, Tallyheart at `watch`); kept, “Now’s your chance…” and “Riffle keeps watch.”
  (Riffle at `watch`). Then the Tap, two frames by worry, written once each (our cat alone at `stash-mouth`,
  the friend out of this close shot): `{ worry: 'small' }` with the `sneaking` line, “A tight squeeze. In you
  go!” and the wriggle Tap; `{ not: { worry: 'small' } }` with the `sneaking` line and the peek Tap.
- On `stash`, written once, our cat at `stash-in`: “Mice and voles…” / “Some smell of your camp…” and the
  `stash` card (mood `sniff`); “Beside the prey is a heap…” and the `shiny` caption (split into boxes; mood
  `wonder`, the heap sparkling); on `stash-close` (our cat at `near`, the corner of her face and a forepaw at the
  left edge, so her whisper's speaker is in the cast): “Smooth. Clear. Flat…” / “You saw it every day as a pillow
  cat…” and “It’s not a scale,” you whisper. “It’s GLASS.” with the `glass` card; back on `stash`: “Tower
  glass…”, the `foundWisp` caption, “Proof.”, the `shiny` line and the take-one Tap (`tap: 'glass'`).
- The sneeze (two panels: section 5's sounds), on `holes`: our cat backing out at `stash-mouth` with `holds:
  'leaf'` (`holdAt: 'paws'`), mood `worried` then (the *ACHOO!* panel) eyes squeezed (`squeeze: true`).

### The chase

- On `holes`, written once: “Behind you: sniff, sniff.” (`sfxRead`) and “Snatch pokes his head out of a hole,
  mouse and all.” with “I smell CAT.” (Snatch at `hole-1` in `peek`, `holds: 'mouse'`; Snip at `hole-2` `up`; our
  cat at `stash-mouth`); then “You ALWAYS smell cat. We ROB cats.” (Snip) and “This one’s RIGHT HERE!”.
- The RUN Tap, a pair on `holes` (the friend at `watch`): “GET THAT CAT!” “No, YOU get that cat!” “We BOTH get
  that cat!” (Snatch, Snip, Snatch, `point`, mood `shout`), the friend's “Run!” … / “RUN!” squeaks Riffle., our
  cat in `run` with `holds: 'leaf'` (`holdAt: 'mouth'`) and `tap: 'paw'`.
- On `field`/`wide`, `night`, `moon: 8`, a pair: “Down the bank you run, round the near side of the field, two
  weasels behind you.” with “Come BACK!” … “We’ll… we’ll SQUEAK at you!” (one balloon, Snip's: "they squeak"),
  our cat and the friend facing left at `path-left` and `path-right` (our cat and Tallyheart in `run`; Riffle
  on all fours in `scramble`: he has no `run`), Snip and Snatch in `run` at `trail-1`, `trail-2` (on `wide`,
  right of `path-right`); “They’re half your size. They’re very, very LOUD.” opens the next panel, on `dogs` with
  the weasels alone on the path (at `dogs`' own `trail-1`, `trail-2`, along the middle of the path), with “Snatch
  is slow. He won’t drop his mouse.” / “Drop the MOUSE!” / “NEVER!”.
- On `dogs`, a pair by `foundHail`: without, “Inside the fence, three dogs leap up.” and “They bounce along the
  fence, barking their heads off.” with “SQUIRRELS!” (Good Boy); with, “DOGS!” calls Hail. “SQUIRRELS! THAT way!”
  (one balloon, Hail at `wire`); then (a pair) “Snip and Snatch skid to a stop. They spin round, and run all the
  way back.” (the weasels `skid` on the path), after Hail's own bounce caption when she is there, with “BYE, RUDE
  SQUIRRELS!” (the dogs `howl` and `bounce`). (The dogs' bounce goes with their leap, so the skid panel's “They” is
  only ever the weasels: the final review, 2026-10-24.)
- “Nobody’s hurt.” with the wave Tap: a pair by `foundHail` on `dogs` (our cat `pawup` on the path, the dogs at
  the fence, Hail at `wire` when found).

### Home

- (The talk cuts between `rear` and `hole`, the close shot at the tunnel's mouth behind the back row, call 25: the
  told “Weasels,” she says…, and the kept two balloons with **Choose**, both outcomes and “This goes to the
  Gathering,” on `hole` (our cat at `brink`, Tallyheart across the mouth at a spot of the frame's own, about
  `{ x: 1220, y: 958, h: 470 }`, facing left); the rest on `rear`. Riffle waves goodbye at the hedge's edge, right of
  `rear-2`, where Tallyheart is on the next panel; our cat leans into Tallyheart's side on “Her tail curls round
  you.” (about `{ x: 1060, y: 960, h: 470 }` on `hole`).)
- Told, on `rear` with `tunnel: true`, `night`: the put-down Tap (our cat at `rear-1`, `crouch`, `holds:
  'leaf'`, `holdAt: 'paws'`, `tap: 'leaf'`; Tallyheart at `rear-2`); then the leaf open (`holds: 'glass'`),
  Tallyheart `wonder` then `solemn`: “Tallyheart looks at it for a long time. “So THAT’S our dragon’s scale.”” and
  ““Weasels,” she says…”.
- Kept, on `rear` with `tunnel: true`: “At the hedge, Riffle waves goodbye.” with his “Otter’s honor…” (Riffle
  `hop`, standing tall with a forepaw raised by his cheek: a wave; `happy`, at the hedge's edge); “Behind the pile, a big ginger shape is waiting in the moonlight. Tallyheart.”
  a panel of its own (Tallyheart at `rear-2`, `worried`); her two balloons and **Choose** (“I’m sorry.” / “But I
  found the THIEVES!”, `when: { ch3Told: false }` and an `else` to the shared panel below), its outcomes “Her
  tail curls round you.” (a caption: no art draws a tail round another cat) and “You WHAT?” (Tallyheart,
  `wonder`); “You tell her everything…” / “Everything but the dragonets. Not yet.” with the show-her Tap; the
  leaf open with “So THAT’S our dragon’s scale. A fox’s trick.” and ““This goes to the Gathering,”…”.
- Both, written once (Tallyheart is there on both paths): “She touches her nose to yours.” with her balloon, on
  `pile`/`rear` with `tunnel: true`, `night` (Tallyheart at `rear-2`, facing left; our cat nose to nose with her
  at a raw spot measured on `rear` beside `rear-2`, about `{ x: 1000, y: 960, h: 380 }`, facing right, checked on
  the frame by the story builder: chapter 7's `CLOSE` is a spot on the hollow's sand, the wrong depth and size
  here); then “Your tail goes straight up.” (our cat `sit`,
  `tailUp: true`, mood `proud`) with the kept balloon (“But next time,” says Tallyheart, “you take ME. Not just
  Riffle.”) or the told caption (“Tomorrow, Riffle will want to hear EVERY bit.”), each with its `when`.

### Eight claw marks

- The nest: `den`/`nest`, `night`, `{ weather: 'clear', moon: false, stone: 'auto', bark: 'auto', hidden:
  true, glass: true }`, our cat lying down; captions “In your nest:” (the sound, `sfxRead`), “New curls of
  bark. And under the moss, in its leaf, your glass.”, the `ch2Stone` lines, and the summary (two boxes).
- The grey tom on `inside` (`sleeper-1`, `lie`, `sleepy`) with his balloon and hers; then the bedtime skip;
  then “EIGHT?” he mumbles. “I only ever use four.” under the big 8; “Soon he’s snoring.” opens the next panel
  (`inside` with `moon: 8`, `zzz` on him: `doorway`'s box, x 900 to 1600, leaves out `sleeper-1`) with “Outside,
  the moon is half full…” (split); then the
  last panel on `nest` (our cat `curl`, `asleep: 'half'`, mood `kind`): “Whatever the Clans decide…”, “How do
  you mend a dragon’s wing?”, “You curl up tight, warm and safe, and sleep.”
- Chapter end: the dream input (“What did {name}paw dream, after the night trail?”), then the end frame, as
  chapter 7's.

### The book

The story builder writes it; proposed (eight to ten entries; the cat named wherever a tom's "he" could mean
another animal; nothing says which route she took):

1. *(told)* `Before the sun was up, Tallyheart told {name}paw she had heard the thieves come in the night, and let them go, to find out where the prey went.`
2. `At the seventh morning count, four more pieces were gone from the back row: twenty-eight in seven nights.`
3. `Tallyheart taught {name}paw {their} eighth Count, paws: the fours. A four is two twos.`
4. *(told)* `That night, {name}paw and Tallyheart followed the thieves’ trail all the way to the weasel holes by the train tracks.`
   *(kept)* `That night, {name}paw and Riffle followed the thieves’ trail all the way to the weasel holes by the train tracks.`
5. *(foundHail)* `In the Barking Field, {name}paw found Hail, a bouncy speckled dragonet who lives in a hollow log and lets the dogs think she is a dog.`
6. `The thieves were two weasels, Snip and Snatch, and they worked for Reynard. {name}paw heard him brag that once the Clans chase the dragon away, the dry den under the Old Bridge will be his.`
7. `In the weasels’ stash lay prey from both Clans, and a heap of tower glass. The “scale” was only ever glass. {name}paw took one small piece, for proof.`
8. *(told)* `Tallyheart says it all goes to the Gathering, where every Clan should hear it.`
   *(kept)* `Tallyheart was waiting at home, more scared than cross. {name}paw told her everything but the dragonets.`
9. `At bedtime, the grey tom and {name}paw counted their paws: eight, between them.`

`dream: '{name}paw’s dream: “{dream}”'`; `noDream` e.g. `'{name}paw’s dream that night went uncounted.'`.
**Hail's page**: `book.dragonet: { id: 'hail', name: 'Hail', when: { foundHail: true }, lines: ['White with grey
speckles, and the bounciest of the clutch. She lives in a hollow log in the Barking Field, where the dogs think
she is a dog.'], pose: 'bounce' }`.

### The teaser

Chapter 9, *Featherlight* (not built): `{ title: 'Chapter 9: Featherlight', lines: ['Sprinkle has to fly by the
full moon.', 'How do you mend a dragon’s wing?'] }` (curious, never scary; the story's hook). Chapter 7's teaser
stands (its title is this chapter's; both its promises are kept: a trail in the dark, and where the tunnel
comes out, on the tunnel route seen, on the field route found from the other end).

### Tests the story builder adds (`tests/story-ch08.test.js`, beside chapter 7's)

- Every Counts set exactly as section 2, and the runs section 2 cites: each lesson miss comes back two
  questions later, and a single miss before its twin; a missed 4 × 8 is still in `E.hardFacts(cat, 4)` after a
  quick 8 × 4 (a check); 3 × 4 and 10 × 4 get the fast lines when quick; the warm-up's hard pick (6 × 8 when
  nothing; a chapter-7 miss or slow 5 × 6 opens on 5 × 6 with “Yesterday…”; never 1 × 6, 2 × 6, 3 × 6, 4 × 6,
  6 × 9 or 6 × 10); the warm-up's fillers 6 × 3 then 5 × 6 (6 × 3 then 4 × 6 when the hard one was 5 × 6); the
  twenty-eight's help hops 4 to 28 and its fillers are 2 × 4 then 4 × 5, never 4 × 4; Hail's fillers are two
  dogs and three dogs; Snip's are 2 × 1 then 2 × 2, in Riffle's words on the kept path with “That one again!”;
  15 typed answers on every reading, 16 with Hail; `E.countSets` gives table 4 to `ch08-fours`; the Hollow
  offers "Paws · the 4s" and the tree has eight marks only after the lesson.
- `foundHail` is set on Hail's last screen and nowhere else, on both paths; saying no sets nothing; her card
  and page only with it.
- The four cards on their frames on every path; all four hidden in the den; the rows of section 3 (with section
  6's change), both lines of the brag's row for a Sleet cat.
- Every `ch3Told` pair, every `foundHail` pair, the specialty chain (each specialty reaches exactly its own
  frames and the weasel holes), the worry pair at the stash, the path-only choices with `when` and `else`, the
  skip-counts and the ask as section 2 (tables, groups, `who`, `thing`, `keep`, `carry`), each one-tap target
  present in the art.
- Coil never in a pose that closes his eyes or shows a tongue; Riffle never in `juggle` under the bridge, never
  in `hug` in a frame that names Coil; nobody on the rails; Reynard only at `rails`, never in a frame with a cat
  of the Clan nearer than the weeds; no "whisker-length", "Ironsnake", "Twoleg".
- Every caption at most 95 characters on a panel; no panel with five boxes; the nest's and the sniff's
  captions run into their sounds with `sfxRead`; the sneeze's `sfxRead` on a panel with no balloon; the book on
  every path (no token left unfilled, a tom's pronouns, nothing about the route); Hail's page; the teaser.

## 6. Engine needs

**One, and it is not an interaction: a card link may give each partner its own line.** The brag's card touches
two cards with two different lines (the story's note: “He said FLEW. Now he calls it a story.” with `fox-flew`,
“The same fine, dry den.” with `sleet-den`), and `link: { with, line }` has one line for every partner: the
den's join would read “He said FLEW. Now he calls it a story.” (run, without the change). The change, in
`E.caseFile`'s `link.with` branch: `link.lines: { <partner id>: line }` overrides `link.line` for that partner:

```js
c.link.with.forEach(function (id) {
  var p = by[id], own = isObj(c.link.lines) && typeof c.link.lines[id] === 'string' && c.link.lines[id] ? c.link.lines[id] : line;
  if (p && p.id !== c.id) touch(p, c, own);
});
```

No card of chapters 1 to 7 has `lines`, so every file of every live save is exactly as it is (run: a chapter-7
file through the patched `E.caseFile` is identical; the goldens prove it in the build). `E.cards` copies the
`link` as it stands, `lines` included, for the page. **`E.checkStory`** checks `lines` as it checks `link.line`:
when present, an object whose every key is one of the link's `with` and whose every value is a non-empty string
(a key not in `with`, or a value that is not a line, is reported); every chapter 1 to 7 story stays clean. If
the orchestrator refuses any engine change, the
fallback is `link: { with: ['fox-flew'], line: 'He said FLEW. Now he calls it a story.' }` alone (the card's own
words still name the dry den; a Sleet cat's den card then lies apart), and section 7 records it.

Everything else is a key chapters 1 to 7 built: a choice (with `when` and `else` where one path sees it, options
with `when`), typed answers, `skip` (one to five groups, `who`, `thing`, `keep`, `carry`), `ask` (seven pairs),
one-tap `scratch` frames on a cast extra or a set's mark, frame `when` (with `E.matches`' lists and `not`),
sticky `sets`, cards with `link.with` and a definition's `when`, `lessonClean`, `sfxRead`, `sfxAt` (chapter 5's,
on the BOING pair only), `book.dragonet` with
`when` and `pose`, the dream input. The Counts keys are all in section 2 and all exist (`table` on a set and a
fact, `picture.kind` and `picture.layout` passed to the art, a set's `who`, `help: 'picture'`, `fillVoice` and
`fillPicture`, `avoid`, `warmHard.avoid`, `check`, `lit`, `retryPrompt`, `rightAgain`, `againIntro`, a fact's
`miss`/`missLast`).

Code beside the engine, the words owner's (section 10's owners):

- `E.VERSION = '0.8.0 (chapter 8, <ship date>)'` and its assertion.
- `PC.ui.flagWords.foundHail` (section 1); `PC.ui.speakers` NAMES `hail: 'Hail'`, `snip: 'Snip'`, `snatch:
  'Snatch'`; Read to me's pitch and pace (Hail bright and quick, about 1.5 and 1.08; Snip squeaky, about 1.65 and
  1.12; Snatch a little lower, his mouth full, about 1.35 and 1.0); no new `faceHidden` pose (every new pose
  shows a face). The two tests that pin chapter 7's lists (the speakers' names, the corner's last flag) take the
  new entries.
- `tools/storyboard.mjs`: words for every new name of section 4 (the `tracks` set, its cameras in
  `SET_CAMS.tracks`, since the global words for `glass`, `wide` or a `fox` must not be guessed, and place words of
  its own for `crawl` and `fork`; its anchors and options; the field's `moon`, `tap: 'path'` and anchors; the
  pile's `poke` and `tap: 'mouth'`; the den's `moon: 8` and `glass`; the cast `hail`, `snip`, `snatch` and every
  pose; the dog's `lie`, Reynard's `trot`, the cats' `run`; the extras `tailUp`, `tap: 'tail' | 'leaf'`, Riffle's
  `tap: 'ears' | 'paw'`, `holds: 'leaf' | 'glass' | 'mouse'`); the Counts pictures (`kind: 'dogs'`, marks with
  `layout: 'pairs'`, `thing: 'paw'` at per 2 as one cat's pairs of paws, the sand at per 4 two and two); a card
  link's `lines` (each partner's line on the card row). `--check-words more.json` with section 4's names, the
  option declarations exactly as section 4 gives them. Chapters 1 to 7's storyboards regenerate byte for byte.
- `docs/build.md`: a short "Chapter 8" section, the new art names and words as built, pointing here.

## 7. Known issues the text critics left

Checked against Draft v0.4. Every other low of both rounds (`critique.json`'s `known`, `critique-verify.json`'s
`known`) is fixed in the story as it stands: the brag's two link lines in its note, "a ‘scale’ that was only
ever glass", "four pieces of prey", the kept "says Tallyheart… Not just Riffle.", "like the one under your
pile", the marks at per 2, the quick-after-a-miss line, the warm-up timed on itself and its fillers, "Two cats.
How many paws?", "You worked every one out", "These two can’t count", "Something big." cut, "That’s my NAME.",
"ALL of them?", "Get the glass HOME.", "Not one paw on the rails.", the For us names and new words, "A tight
squeeze. In you go!", the tunnel's way out ("at the foot of a high bank"), "full", the three `sfxRead` notes,
"Nobody’s hurt.", the three crowded screens trimmed, Hail's card at thirteen words, Snip's fillers (2 × 1 then
2 × 2), the whispers (only the question's words and "Fourteen!"; `againIntro`), the warm-up's own `avoid`, the
front paws ("4 × 4 and 4 × 7 open unlit"), "the near side of the field", the prints "coming and going", "a
little hole", the brag card's wording, "You saw it every day as a pillow cat", Riffle's "Granny says", Tallyheart's
"Just as I thought", the hook, Hail's news of the found ones, Reynard far above, call 6's warning. What is still
open, and how the build handles it:

1. **The story is final at Draft v0.4.** No word of it changes. Where its italic notes and this spec differ,
   the spec is the build's (item 9).
2. **Chapters 1 to 7 byte-identical for every live save** (the orchestrator's "golden"). The proof is the
   golden owner's (section 10): `tests/fixtures/make-ch07-golden.js` records `tests/fixtures/ch07-golden.json`
   from the shipped snapshot (`GOLDEN_ROOT=/Users/aron/potomac-crossing-work/ch08/shipped`, engine 0.7.0, in a
   process of its own), as `make-ch06-golden.js` recorded chapter 6's: chapters 1 to 7, every frame and what it
   shows (the scene with her options filled and a hash of its drawing, ids stripped; captions and what Read to me
   says; balloons with labels and voices; options; the card under the panel; her whole Case File with every card
   drawn; the pages she taps), every skip tap by tap, every question, picture, line and help hop by hop, the
   Training Hollow, the book with its dragonets, the grown-ups corner and the cat; its scripts cover every
   specialty and worry, told and kept, both chapter 2 paths, the roofs and "Not today", Puddle, Wisp and Sleet
   found and not, misses of every kind in chapter 7's sets (the pile, the warm-up's hard pick, the sixes' twins
   and check, the twenty-four twice, both sixties), slow and quick, a tom, and chapter 7's known issue 15 (a kept
   cat who leaves chapter 7 between its sums, rereads chapter 3 as told, and comes back). `tests/golden-ch07.test.js`
   compares today's tree: (a) chapters 1 to 7 handed to the engine, exactly; (b) every loaded story handed to the
   engine (ui.js's `stories()`), exactly, but for the deltas a later chapter is allowed, by name: chapter 7's
   teaser in her book `built: true, next: 'ch08'` (its words as they were) and the hub's next chapter, and the
   grown-ups corner's table-4 heading (`E.factTables`: "The 4s" becomes "Paws · the 4s" for every cat whose log
   holds chapter 7's twenty-four, since `E.countFor(4)` now finds `ch08-fours`: run). **`E.chapters` does not
   skip the stub** (its `storyList` keeps every story with `frames`; checked in Node: with a STUB `ch08` in
   `PC.story`, `E.chapters` lists it, `E.teaser(ch07)` is `{ built: true, next: 'ch08' }`, and a chapter-7 cat's
   `E.progress().next` is `ch08` with `soon` null). So **in both states** chapter 7's teaser and the hub's next
   chapter move; **only the `E.factTables` heading waits for the built chapter** (the stub's `counts` are
   empty). The test tells the stub by its boards (every frame's `board` 'STUB.', as `tests/engine.test.js`'s
   teaser test does), and says which state it ran in. `ch06-golden.json`,
   `ch04-golden.json` and their tests stay as they are and must still pass (chapter 8 changes nothing they read:
   no card of chapters 1 to 6 has `lines`, and no chapter-1-to-6 cat logs a 4s fact). **The fingerprints**,
   each art owner's for its own files, recorded once from the snapshot in a separate process and committed as
   constants (no test reads the work directory): the field's and the pile's frames of chapters 2 to 7 on every
   camera they use; the den's row and corners for every file a live save can hold (1 to 24 cards, 0 to 6 under
   the moss, both facings), **and with `hidden` off, 19 to 24 along the edge on `nest` and `doorway`, both
   facings** (chapter 4's bedtime frames f114 and f115, which hide nothing, for a cat of 19 to 24 cards: the
   chapter 6 fingerprint's 15-card file and the 0-to-6-secret sweep would not catch a third course there); the
   cards' 25 pictures (as `CH7_CARDS_FINGERPRINT`); and in `tests/cats.test.js`,
   `sweep7` rewritten over chapter 7's vocabulary as constants (it reads `A.vocab.poses`, `otherPoses` and
   `cast` live, so any new pose or cast member moves its hash: with constants equal to the shipped vocabulary
   its hash on the snapshot is the recorded one) and without the plain per-4 sand (`[3, 4, 7]` skipped only where
   `!style`, as per 6 is: the swipes stay pinned; re-taken on the snapshot, on purpose), and a `sweep8` of
   chapter 7's own Counts art and extras (the cheeks and `cheeks-top`,
   one cheek, the gaps, marks at per 1 to 10 without `layout` on sand and mud, the sand at per 6, `tap: 'fish'`,
   `tap: 'mist'`, `asleep: 'half'`) hashed on the snapshot.
3. **Two and two** (the verify critic's "two and two is new art"). Built as new art: the sand at per 4 (item 2:
   `sweep7` without the plain per 4) and the marks' `layout: 'pairs'` (the twenty-eight only; the twenty-four
   keeps its
   four in a row). The miss line “Two and two, every night.” is true of both.
4. **The sneeze's `sfxRead`** (the reader critic's sound notes; the story's note "The balloon runs on into its
   sound"). `E.captionsRead` says `sfxRead` after the captions and before the balloons, so on one panel a
   listener would hear “a great big sneeze: ACHOO!” before “Ah… ah…”. Built: two panels (section 5). The nest's
   and the sniff's captions run on into their sounds as chapter 7's did.
5. **Crowded screens** (the reader critic's three; trimmed in the story). The build splits the screens that
   still hold five boxes at a speaker (section 5's list); no words change.
6. **The brag's two link lines** need section 6's one engine change (the critic's fidelity low gave the lines;
   the engine had one line a link). Fallback in section 6.
7. **"Snatch"** has an adult slang sense in English (the world critic's low, the story's For us): kept by
   decision 21, Aron's to change before ship; "Snip-" waits in the README beside Puddle and Sleet. A rename is
   the story's words, the speakers' names, the storyboard and the art's cast id (`snatch`): all in this
   chapter's files.
8. **What the art cannot draw literally**: section 10's list (Riffle's dropped fish, Tallyheart's head in the
   tunnel, her tail curling round, the pinecone in flight).
9. **The story's notes this spec supersedes** (she reads none of them; no line she reads changes): the
   Snip's-share "or the new place's earth" (mud: no new ground); "her balloon's label names her" for Snip popping
   up (her label is "Snip" by then); the paws Tap's "`thing: 'paw'` at per 2" (built so); the stash card's "The
   spec decides, with the nest's room" (it touches `reed-pile`, and every card goes under the moss: sections 3
   and 4); Hail's "a dog has no paw marks in the counts picture today" (`kind: 'dogs'`, new); the sneeze's note
   (item 4).
10. **The route is not recorded** (the story's call 6, the verify critic's low). A field-route cat has never
    been in the tunnel; nothing after the holes, the book included, says which way she went. A reread by the
    other route reads exactly the other route; `foundHail` stays set from an earlier reading, and Hail's card and
    page with it (true: she did find Hail in chapter 8).
11. **`my-count` may be missing** (chapter 7's known issue 15): nothing in chapter 8 requires it. Such a cat
    holds 20 cards (21 with Hail) and eight (nine) under the moss: the nest's checks include eight (section 4).
12. **The brief's slip** (the world critic): the brief says Hail waits in the README beside Puddle and Sleet;
    Hail keeps her name by a call of 2026-10-10. The story's For us is right; the brief is not changed.
13. **Snip's share's help says “Two, four…” on a one-night filler** (the counts critic's low). `ch08-snip` and
    `ch08-riffle` set `helpIntro` and `helpIntroFar` to lines with numbers in them (“Let’s hop it together. Two,
    four…” / “Hop by twos! Two, four…”: the story's note's words), and lend fillers in their own voice and
    picture, so a missed 2 × 1 opens with “Two, four…” while its help lights two marks and stops at 2 (run:
    F:2x1✗ gives “Hop by twos! Two, four…”, nums 2). Kept as a known cost, inherited from chapter 7 (Riffle's
    sixty had the same with 1 × 10): it is rare (a miss on the easiest filler), the count shown is right, and the
    words are the story's. A later chapter that lends one-group fillers should give `helpIntroFar` no numbers.
14. **Hail's riddle can lend its own 4 × 4 back as a filler after three misses** (the paths critic, the
    integrator's round). Her set borrows the easiest of the 4s lesson, and `E.EASIEST_POOL` keeps five of them:
    2 × 4, 3 × 4, 4 × 4, 4 × 5 and 4 × 6. Its own pair and its `avoid` taken out, only 2 × 4 and 3 × 4 are left,
    so while one of them waits for its retry, `fillers()`' last pass takes the set's own pair, and the engine words
    it in the set's unit: “An easy one! Four dogs. How many paws?” over three dogs and Hail, a new fact called easy.
    Run: 15, 7, 12, 16, 7, 12 gives 4x4✗ F:2x4✗ F:3x4 R:4x4 R:2x4✗ F:3x4 F:4x4 R:2x4; three misses is the fewest
    that reaches it (96 of the 256 ways to answer her first eight questions right or wrong). No data change keeps
    “Two dogs” and “Three dogs” and removes it (no set lends 1 × 4; every filler is worded with the set's `unit`),
    so it is kept as a known cost: it needs three misses on one riddle, the sum shown is right, and the help is
    the picture's. `tests/story-ch08.test.js` pins it: no answer plan with fewer than three misses lends 4 × 4.
    Chapter 9's "Engine needs" should take it up (section 8). The words-always-true alternative, if Aron wants it:
    `unit: 'animal', units: 'animals'` on `ch08-hail` (“An easy one! Two animals.”…).
15. **The warm-up may lend its own 2 × 6 as “One from yesterday.”** (the counts critic's low, beside call 10).
    With 6 × 3 waiting for its retry the pool has no fresh pair, and the last pass takes the easiest that is the
    set's own or avoided: 2 × 6, ahead of 4 × 6. It needs two misses for a cat whose hardest 6s fact yesterday was
    5 × 6 (5x6✗ 2x6 F:6x3✗ R:5x6 F:2x6 R:6x3), three for any other (6x8✗ 2x6 F:6x3✗ R:6x8 F:5x6✗ R:6x3 F:2x6
    R:5x6). The words are true (2 × 6 was in chapter 7's lesson) and the fact is easy, so the data stays; the test
    pins it: never before the second miss, and never 6 × 6.

## 8. What chapter 9 inherits

- **An engine need for chapter 9's spec** (section 7, item 14): `fillers()`' last pass should never take the set's
  own pair (`st.own`) for a one-fact set that borrows its fillers, so a riddle never lends its own new fact back
  as “An easy one!”. Chapter 8 keeps the cost; chapter 9's "Engine needs" decides.

- **Where the story stands.** Bedtime on her eighth evening, after her seventh morning count: twenty-eight
  gone in seven nights, four a night from the middle of the back row. The moon is a half moon, eight evenings
  old; the Gathering is at the full moon. That night she followed the thieves' trail to the railway bank by the
  tracks, with Tallyheart (told) or Riffle (kept): through the tunnel (it comes out at the foot of the bank,
  under the Barking Field on the way) or round the near side of the Barking Field. Whether the eighth night is
  robbed is chapter 9's (Reynard: “Nap now… Rob later.”): a ninth morning count would be thirty-two, an 8s fact.
- **The case, broken open.** The thieves are two weasels, **Snip** (she, the squeaky one) and **Snatch** (he,
  always holding a mouse), who come up through the tunnel under the back of the pile, "two a night each", and
  carry the prey to their **stash**, the biggest hole in the bank: CrystalClan's prey and ReedClan's (muddy, by
  the Barking Field: Hail's "two skinny shapes"). They can't count. **Reynard** is their boss: she overheard him,
  unseen, from the tall weeds: once the Clans chase the dragon away at the Gathering, the dry den under the Old
  Bridge is his and their pile the weasels'; “One shiny bit by their pile. One little story: ‘It FLEW off, by
  moonlight!’ And the whole Clan said DRAGON.” “Nobody saw a thing.” In the stash lies a **heap of tower glass**:
  she said it, “It’s not a scale. It’s GLASS.”, and took **one small piece**, wrapped in a leaf, now under her
  moss (the den's `glass: true`). The "scale" still lies behind the back row. Nobody has charged Reynard, and no
  Clan has been told: “This goes to the Gathering… Every Clan should hear it.” (Tallyheart, both paths);
  Glintstar knows four a night for seven nights (“Seven nights now.”; the old tom's “Four a night, for SEVEN
  nights?”), and nothing more; the twenty-eight is hers and Tallyheart's, worked in the Hollow. Glintstar knows
  of no dragonet.
- **Who knows what.** *Told:* Tallyheart was there for all of it (she went over the tunnel, or round the field,
  and kept watch at the stash); Riffle hears tomorrow ("Tomorrow, Riffle will want to hear EVERY bit."); her
  chapter 4 promise ("Then we tell her everything.", to Glintstar) falls due: when is chapter 9's. *Kept:* Riffle
  walked the whole trail ("Otter’s honor. I’ll tell NOBODY. Except Sprinkle."); Tallyheart was waiting behind
  the pile ("I’m not angry. I was scared.") and has heard everything but the dragonets: the tunnel, Riffle's part,
  the weasels, the fox, the stash, the glass ("But next time, you take ME. Not just Riffle."); she still knows no
  dragonet (when the kept path tells is chapter 9's). Sprinkle heard of the tunnel (kept: “come back and TELL
  me”), and Coil hushed Riffle; on the told path neither knows yet. **The weasels** know "a CAT" saw the stash,
  not which (they ran back from the Barking Field's dogs); **Reynard saw nothing.** **Hail** (if found) knows
  Sprinkle is safe under the Old Bridge, and who else the player has found; she has been met by Tallyheart
  (told) or Riffle (kept), and her “five” (and “I’m the BOUNCIEST!”) waits to be carried to Sprinkle, which is
  chapter 9's job (the kept Riffle's “Except Sprinkle.”). For continuity's dragonets table.
- **Flags**: `foundHail` (sticky, the optional scene's last screen). No route flag: **chapter 9 may not say she
  went through the tunnel** (a field-route cat never has). A later chapter that offers Hail again sets a
  found-here flag of its own, and chapter 8's book line and page then read `{ foundHail: true, chNHail: false }`
  (as chapter 4's did for `ch5Roof`).
- **Cards**: `stash`, `glass`, `fox-brag` (everyone), `hail-shapes` (Hail): 20 to 28 held, eight to ten under the
  moss (the low ends without `my-count`). Rows: `cant-fly` — `fox-flew` — `fox-brag` (— `sleet-den` for a
  Sleet cat), `tidy` — `reed-pile` — `stash`, `scale` — `glass`, beside chapter 7's (the moon's three,
  `coil-diggers` — `tunnel`). `my-count` can still be missing: nothing may require it, chapter 10's picking
  included. **The nest has room** (section 4): corners in layers of six to eighteen, a third course along the
  edge to twenty-seven (past eighteen with `hidden: true`, past twenty-four with it off: chapter 4's bedtime
  frames hide nothing); chapter 9 decides where its own cards go, and whether laying out her case file lifts
  the moss.
- **The Counts.** The 4s are her eighth Count ("Paws · the 4s", eight marks on the tree; "A four is two twos").
  Chapter 9 teaches the 8s (a spider's legs: double the 4s); 4 × 8 / 8 × 4 are hers now. **Chapter 9's warm-up is
  the 4s.** `E.hardFacts(cat, 4)` (run, `sim5.js`) finds chapter 8's misses (the lesson's, the twenty-eight's
  4 × 7, Hail's 4 × 4), a slow 4 × 5, 3 × 4 or 10 × 4 (the lesson's three facts timed on themselves; 8 × 4 is a
  check), and older timed answers chapter 8 never replaced: a slow cat's chapter 1 and 2 `[[4, 2], [4, 1]]`, and
  Hollow rounds' `[[4, 9], [4, 6], [2, 4], [1, 4]]`. A warm-up that says "Yesterday" needs `warmHard: { table:
  4, at: 0, avoid: [[1, 4], [2, 4], [4, 9], [4, 6]] }`; the cost is that a chapter-8 miss of 2 × 4 or 4 × 6 is
  passed over (4 × 6 is also her old count, the twenty-four). Its fillers can borrow from `ch08-fours`
  (`fillOrder: 'easiest'`: 2 × 4, 3 × 4, …; avoid 4 × 4 as "an easy one"). **For the 8s**: a chapter-8 miss of
  4 × 8 or 8 × 4 is in `E.hardFacts(cat, 8)` too (run). **For chapter 10's 7s**: a missed twenty-eight (4 × 7) or
  Snip's 2 × 7 is in `E.hardFacts(cat, 7)` (run).
- **Drawn now**: the `tracks` set (the bank, its holes, the stash and its glass, the tunnel's inside and its
  fork, the rails, Reynard on them); the field at night (the moon, the sleeping heap, the log's `log`, `wire`,
  the ring, `fence-top`, the path's `trail-1`/`trail-2`, `tap: 'path'`); the pile's `poke` and `tap: 'mouth'`, and
  `rear` at night; the den's `moon: 8` and `glass`; Hail, Snip and Snatch; the cats' `run`, `tailUp`, `holds:
  'leaf' | 'glass'`; the dogs' `lie`; Reynard's `trot`; the Counts pictures `kind: 'dogs'`, marks two and two, one
  cat's paws by pairs, the sand at per 4.
- **A later chapter keeps** (copy into `docs/continuity.md`'s places table at ship): the tunnel runs from the
  pile's back to the foot of the railway bank (`tracks`, `tunnel-end`); the stash is the biggest hole, its glass
  heap and the prey still there (the weasels "mean to rob again"); the "scale" still behind the back row; the
  den's `glass: true` from now on (her piece under the moss), `hidden: true` with every secret card; the pile's
  and the field's `moon` is the evening's age (9 next); eight claw marks (`marks: 9` next); nobody on the rails;
  Reynard only on the tracks, never near her.
- **The moon's arithmetic** (the art's clock, `moonT` in `scenes.js`: `0.8 − 0.18 · (age − 4)`, half at about
  evening 8.4, full at evening 14). At evening 8 the moon is half; it is full about evening 14, and module-1 puts
  the Gathering under the full moon. At one chapter an evening, chapter 10 would be evening 10, and `moon: 10` is
  drawn gibbous, not full. **Chapters 9 and 10 must cover about six evenings between them** (chapter 9 spanning
  days, or chapter 10 opening days later), and the Gathering's frames use a moon of about 14.
- **Words on screen now**: weasel, glass, tower glass, stash, the rails, Fetch, "Nobody’s land. The trains own
  it.", "Not one paw on the rails." (Tallyheart's, or Riffle's Granny's), "A four is two twos", "Doubling,
  AGAIN.". **Names**: Snip, Snatch, Hail, Good Boy, Drop It (the third dog unnamed). Not used: "Ironsnake".
- **Standing rules, still**: Riffle never juggles under the Old Bridge; Coil never shuts his eyes and is never
  frightening; nobody steps past the last post (the chase went round the near side); nobody on the rails; the
  weasels are funny, never cruel, never toothy; Reynard never sees her.

## 9. Calls made

1. **`foundHail` only; no `ch8Route`.** Reason: the story's call 6 (nothing after the holes reads the route);
   Hail is offered only here, so her found flag is this chapter's found-here flag too (as `foundSleet`).
2. **One new place, `tracks`, holds the bank, the holes, the stash and the tunnel's inside** (cameras `crawl`
   and `fork`). Reason: the brief (one new place; the tunnel's inside a camera of it); the pile's own file stays
   nearly untouched, and the night trail's art is one owner's.
3. **The field at night is `fx: ['night']` with a new `moon` option.** Reason: the brief (the `field` set in
   night light); no earlier frame draws the field at night, so its look can be tuned without touching a shipped
   frame.
4. **The wriggle-in Tap targets the tunnel's mouth (`tap: 'mouth'`), and `poke` is a named anchor.** Reason: a
   child taps the hole to go in; Tallyheart's head and Riffle's both go to the mouth (two uses: a named anchor).
5. **The 4s lesson uses the table-4 picture as drawn since chapter 1.** Reason: it is what the story asks (cats
   side-on, four paws each, `lit: 28` lighting seven cats), and two fingerprints pin it; the doubling is in the
   words.
6. **Hail's riddle draws with a new `kind: 'dogs'`, its `who` on the set.** Reason: the table-4 picture with a
   `who` (dogs and Sprinkle among them) is pinned by `sweep7` and draws a dog with no paw marks and a dragonet as
   a cat; a set's `who` reaches the fillers, so two dogs and three dogs are drawn as dogs.
7. **Tallyheart's paws by pairs: `thing: 'paw'` at per 2, `keep: true`.** Reason: the story's own key, which no
   sweep reaches; "A four is two twos" is the picture.
8. **The twenty-eight's marks two and two (`layout: 'pairs'`); the sand at per 4 two and two.** Reason: the
   lesson's idea in the picture (the story); a new layout keeps chapter 7's twenty-four as it is, and per-4 sand
   is drawn by no shipped frame (its fingerprint entry is retaken on purpose).
9. **8 × 4 is a check; 3 × 4 and 10 × 4 have no right lines.** Reason: the story; chapter 7's 8 × 6; speed is
   noticed in the lesson at last.
10. **The warm-up's `avoid` keeps 4 × 6 out as the hard pick, and as a filler but in one case: a hard 5 × 6 and
    a missed 2 × 6 leave only 6 × 3 free, so four cheeks, the easier of the two avoided pairs, is lent second
    (6 × 6 never).** Reason: the story (it is asked in the 4s lesson minutes later, as "YOUR count"); the pool
    (`fillOrder: 'easiest'` keeps the lender's `E.EASIEST_POOL`, five, easiest facts: 2 × 6, 3 × 6, 4 × 6, 5 × 6
    and 6 × 6; with the set's own pairs and its `avoid` taken out, `fillers()` falls back to an avoided pair in its
    second pass: run, 5×6 2×6✗ F6×3 F4×6 R2×6).
11. **The twenty-eight avoids `[[3, 4], [4, 4]]`; Hail avoids `[[4, 5], [4, 6]]`.** Reason: "An easy one." must be
    easy and never a new fact; the field has four animals.
12. **Snip's share on table 2, in the mud, as two sets by path.** Reason: the story (a table she knows; Riffle's
    voice throughout on the kept path); mud is drawn already.
13. **All four cards under the moss, on every path.** Reason: the proof is kept for the Gathering ("Not a word
    to the Clan yet."), and Hail's is a dragonet's; chapter 7's rule (what is not told to the Clan goes under).
14. **The stash touches `reed-pile`** ("Two piles robbed. One stash."). Reason: the story offers it; it makes
    the case's two robbed piles meet, and every cat holds `reed-pile`.
15. **The brag touches `fox-flew` and `sleet-den`, each with its own line** (section 6's one engine change).
    Reason: the story's two lines, neutral; one line for both would judge the den with FLEW's words.
16. **The nest grows by layers of corners and a third course (past eighteen along the edge with `hidden: true`,
    past twenty-four with it off); `BARK_MAX` 27.** Reason: the brief (decide before any card is added); every
    live file draws as it does, chapter 4's bedtime frames (no `hidden`, 19 to 24 along the edge today)
    included; 28 cards today, room for chapters 9 and 10 either way.
17. **The den's `glass: true`.** Reason: the bedtime caption names it; from now on her proof lies in her nest.
18. **Labels: "A weasel" until the caption names them; "The speckled dragonet" until “I’m Hail!”; the dogs'
    own labels until their names.** Reason: chapter 6's way with Sleet; the caption is where the story tells who
    is who.
19. **The sneeze is two panels.** Reason: `E.captionsRead`'s order (section 7, item 4).
20. **New poses and extras where the story needs a picture**: cats' `run` (the chase), `tailUp` and `tap: 'tail'`
    (the weeds; "Your tail goes straight up."), `holds: 'leaf' | 'glass'` and `tap: 'leaf'` (the proof), Riffle's
    `tap: 'ears' | 'paw'`, the dogs' `lie`, Reynard's `trot`, Snatch's `holds: 'mouse'`. Reason: each is a screen's
    picture or Tap; each is additional, so no earlier drawing changes.
21. **The route choice is written once, on `hole`.** Reason: our cat at the brink shows the mouth's size for the
    small worry's line, and no twin is needed.
22. **Close shots are written once; pictures with the friend in them are twins.** Reason: chapter 6's rule; it
    keeps the frame count well under the brief's 130.
23. **The book and the teaser are proposed here** (the story builder owns them). Reason: each sentence must be
    true on every path, and none may name the route.
24. **The golden of chapters 1 to 7 has an owner and a test file of its own** (`tests/golden-ch07.test.js`).
    Reason: the words owner holds `tests/engine.test.js`; the golden is a large, separate job that must run in
    parallel.

25. **The talk at home cuts between `rear` and `hole`** (the integrator's round, the visual review's finding):
    the close shots of the talk are on `hole`, at the tunnel's mouth behind the back row, Tallyheart across the
    mouth from our cat. Reason: every home panel is behind the pile (section 5), where `low` showed the pile's front
    and lost the guards; nine panels in a row on `rear` would break the chapter's rule of shot variety; and a new
    closer camera on `pile` would change the gallery that pins chapters 1 to 7. In the close shots the front, and
    the guards, are out of sight beyond the rows.
26. **The way past the dogs is told and kept twins** (the integrator's round): the sneak, the fence top and
    hello each drawn twice, Tallyheart or Riffle in the picture, the lines the same, so the friend is beside her
    all the way round the field (brief, call 11). Each reading sees the same number of panels. Hail's scene keeps
    its two-shots of Hail and our cat at the wire (the friend is in its first and last panels): on `fence` the only
    free spot stands between them.
27. **Chapter 8 opens on a title panel** (f001, "Chapter 8: The Night Trail", over her nest before dawn; the
    fidelity review's low). Reason: the start frame must show on both paths (`E.checkStory` refuses a start frame
    with a `when`), and the story opens on a told screen and a kept one. No earlier chapter has one; the panel is
    the builder's, recorded here and in the README.
28. **No mentor looks hurt or crying** (the integrator's round): `laugh` draws squeezed eyes and tear drops, so
    Tallyheart is never drawn in it (her wry “Hmph.” is `proud`, her “FETCH!” `shout`, her hidden smile in the
    weeds `kind`); `tests/story-ch08.test.js` pins it for Tallyheart and Glintstar.

## 10. For the orchestrator

- **Before the build, in this order:**
  1. **The snapshot** is taken (`/Users/aron/potomac-crossing-work/ch08/shipped/`: `app/`, `index.html`,
     `tests/_load.js`; engine 0.7.0; identical to the repo's `app/` when this spec was written). It is the
     `GOLDEN_ROOT` and every fingerprint's source. Do not change it.
  2. **Stub `app/art/sets/tracks.js`**: a set registered with `PC.art.defineSet('tracks', …)` (one camera
     `wide`, **at least one anchor** on it, e.g. `'foot-1': K.anchor(600, 900, 250)`, no options, and a `draw`
     that paints nothing and returns `{ back: '', over: '', front: '' }`), and its script tag in `index.html`
     after `app/art/sets/marsh.js`. Not zero anchors: `tests/scenes.test.js`'s every-set-and-camera test loops
     `for (let pass = 0; pass * info.anchors.length < WHO.length; pass++)`, which never ends for a set with none
     (checked on a stub copy of the tree: it spun at 100% CPU for over 640 s; with one anchor it finished in 96 s).
     Not a `draw` that returns `''`: the markup then holds 'undefined' and four render tests fail.
  3. **Stub `app/story/ch08.js`**: a chapter with one `board: 'STUB.'` frame, `PC.story.ch08` with id `ch08`,
     number 8, title 'The Night Trail', empty `counts` and `cards`, a teaser (`{ title: 'Chapter 9:
     Featherlight', lines: ['Sprinkle has to fly by the full moon.'] }`); its script tag in `index.html` after
     `ch07.js`; both new files in `sw.js`'s `ASSETS` and a `CACHE` past the live value (`potomac-crossing-v15`
     today); `docs/storyboard/ch08.md` generated from the stub (`node tools/storyboard.mjs app/story/ch08.js`).
     `node --test`: only these may fail until their owners land: the storyboard's `--check-words` (the stub set
     has no words; the words owner's); the gallery test (index.html's scripts not yet in `dev/gallery.html`; the
     tracks owner's); `tests/story-ch07.test.js`'s teaser test ('the teaser for chapter 8…': with `ch08` in
     `PC.story`, `E.teaser(ch07)` is `built: true, next: 'ch08'` and `E.progress`'s `soon` is null, since
     `E.chapters` keeps a stub: **the orchestrator updates it with the stub**, to the built teaser and the hub's
     next chapter `ch08`); and `tests/scenes.test.js`'s chapter-7 fingerprint, whose list of new gallery keys
     gains `gallery/tracks/wide` (**the nest owner's**: the list becomes chapter 7's three and a
     `gallery/tracks/<cam>` for every `tracks` camera in the vocabulary, so it passes on the stub and on the
     built set).
- **Owners**: six, disjoint (the build's `owners`). **tracks**: the new set, its test and the gallery page
  (append only: new `SAMPLES.tracks` and new `EXTRA` entries after the last, no other set's `SAMPLES` and no
  existing `EXTRA` entry touched, since the nest owner's chapter-7 fingerprint hashes every old camera's sample
  and the first 93 extras; and, since no other owner holds the page, samples of the field at night, the pile's
  `poke` and `tap: 'mouth'`, and the den's `moon: 8`, `glass` and layered corners).
  **field**: the field and the pile, their tests. **cast**: cats.js, its test and its gallery. **nest**:
  scenes.js and cards.js, their tests. **words**: the engine, the UI, the storyboard tool and its words, the
  storyboards, build.md, their tests. **golden**: the chapters 1 to 7 golden, its maker, fixture and test. No
  owner for `app/story/ch08.js`, `tests/story-ch08.test.js` or `docs/storyboard/ch08.md` as built: the story
  builder's, later, with the tests that count Counts (the Hollow now offers eight; the tree's eight marks);
  chapter 7's teaser test is the orchestrator's, updated with the stub (step 3), and the story builder checks it
  still holds for the built chapter.
- **Engine need** (section 6): decide it under decision 46 and record it. The spec is written with it; the
  fallback is named there.
- **Can't be built literally, built nearly**: "Tallyheart pokes her head in… Her shoulders stick." (she
  crouches at `poke` with her nose at the mouth's right rim, her shoulders plainly wider than it, smiling wryly at
  herself, her head clear of the mouth's tap box: no art puts a head inside a hole); "he drops a fish" (the next
  panel: Riffle with no string, surprised; the fish is not
  drawn); "a wet nose pokes through the hedge" (Riffle at `rear-2`; the caption says it); "Tallyheart flicks a
  pinecone" / "Riffle flicks a pebble" (the flick is over: the friend `pawup` or `point`, the dogs racing off);
  "Her tail curls round you." (a caption: no art draws a tail round another cat, chapter 6's rule); "earth on
  his nose" (the caption only); "head, shoulders, tail: she goes in first" and "she wriggles in" (the next panel
  is inside); "the leaf opens" (the next panel has it open, `holds: 'glass'`); "Snip and Snatch skid… spin round,
  and run all the way back" (one panel: `skid`); "He forgets his name a lot" (the tiny dog barking, `howl`); "the
  shadow lifts" (chapter 7's walk-round: the next picture is the back row in the light).
- **Frames**: about 81 on a told tunnel reading, 88 kept; about 92 told and 98 kept on the field route with
  Hail (the story's 58 to 68 screens, the captions-first splits, the twins, the sneeze, the five-box splits);
  under the brief's 130.
- **README** (end of the spec phase): record section 9's calls under "Claude's calls under decision 46", and
  section 6's engine need as decided. Note, beside decision 21, that "Snatch" has an adult slang sense (Aron's to
  change before ship).
- **`docs/continuity.md`** (ship): section 8; `foundHail` in the flags table; the four cards and their rows;
  Hail's row in the dragonets table (her riddle 4 × 4, her "five", her card); Snip, Snatch, Good Boy and Drop It
  in the cast table, the thieves now named, weasel and glass now said; the 4s row of the Counts table (warm-up
  6 × 8 or her hardest 6s, 2 × 6; the lesson; the pile 3 × 10, the twenty-eight 4 × 7, Snip's 2 × 7, Hail's
  4 × 4); eight marks; the places table's new keeps (`tracks`; the field at night; the pile's `poke` and `tap:
  'mouth'`; the den's `moon: 8`, `glass`, and the nest's growth); who knows what (section 8).
- **`docs/build.md`** gets a short "Chapter 8" section from the words owner.
- **The ship's Safari look** should include: the paws pair (one cat, two pairs), the rim's paws, a lesson
  question with ten cats, the help's two-and-two sand, the twenty-eight with a miss (marks two and two, lit
  night by night), the field at night with the heap, Hail at the log and in the riddle's picture, the tunnel
  (`crawl`, and `tight`), the bank from the weeds with Reynard far above, the stash and its glass, the chase,
  her nest at bedtime (the corners in two layers, the glass), and her Case File after chapter 8 for a Sleet cat
  (the row of four: can't fly, FLEW, the brag, the den).

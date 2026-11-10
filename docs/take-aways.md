# The take-aways kit

*Design v0.4 · 2026-11-09 · decision 57 (Aron, 2026-11-08: the borrow is a step she does, and the marks are hers to
choose): a spread is moves she makes in the column (the lender tapped, its new number typed, the receiver's new number
typed, then the answer), in the marks she chooses on the kit's marks page. Section 1a, new, holds it and supersedes
section 1's `'hers'`, `'show'`, `'tap'` and marks wherever `movesOn` holds (from chapter 13's lesson on, and a store
round once `ones2` is learned). Designed after a critics' round (a teacher, an engineer, a child and a budget: every
high and medium taken) and an editor's; every number run by `~/potomac-crossing-work/regroup/designer/check-v0.4.js`
(the moves of all 498,465 problems, both styles), `~/potomac-crossing-work/regroup/editor/students-v0.4.js` (the
students) and `~/potomac-crossing-work/regroup/editor/time-v0.4.js` (the time, chapters 13 to 20); the design is
`~/potomac-crossing-work/regroup/design.md`, the build `~/potomac-crossing-work/regroup/plan.md`. Chapter 12, and any
state with no `taught`, plays v0.3 as written below. It ships with chapter 13, as v26. Built and reviewed 2026-11-09:
the review's 18 fixes are written in, and section 8 gives the names as built.*

*Design v0.3 · 2026-11-07 · decisions 53 and 54 · v0.2 applied the critics' findings (teaching, engine, screens); v0.3
fixes the twelve problems v0.2's checker found: a help's marks in `'hers'` (one rule, its exception said), the
regrouping word's slots ("break apart" fits every one), a token for every kit word, a cut order that keeps each
chapter's rules, a 400 ms guard after every OK, the echo's room in the stack, `fresh` and `crossed` across a zero,
`extra` never at the ones, the stack over the panel on a phone held sideways, test 17's small sample, `flip`'s tens and
zero forms with `E.takeTwin`'s one signature, and the students' sweep with the blank box asked*

*After the kit's review (2026-11-07), still v0.3, the built engine's fixes are written in: every balloon of a prompt
counted, `extra` only once its spread is taught, `kept` before the written top's flip, a chapter's answers kept from its
twins, a round's older steps those that spread, a set's first two full lines her own problems, the corner's first asks
and time hers, the log's cap 500, and decision 55's word*

*For the engine owner, the art owner, the UI owner and the tools owner, who build it as its own piece before chapter 12,
as the Warrior Counts were built before chapter 10 (`docs/production.md`, section 8). Then book two, a second and smaller
piece, in the same window (section 7). Decision 53 is Aron's: multiplication kept fresh, three-digit subtraction with
regrouping (two-digit regrouping as the warm-up, across a zero by the end), a Spanish-speaking friend, and the
regrouping words easy to change. Decision 54 settles module 2's four open questions. Everything else here is Claude's
call under decision 46 (section 11), each Aron's to reverse; the questions only he can answer are in section 12.*

*The sources: `docs/module-2.md` v0.4 ("Tallyheart, Chispapaw and the Counts", "Her book", "Engine", "Between
chapters") and the maths study, `~/potomac-crossing-work/module-2/maths/maths.md` (its section 4 is this kit), adopted
whole except where section 11 says otherwise. A function named here as reused is used untouched; every new piece, and
every existing function that changes, with the guard that keeps chapters 1 to 11 and the Warrior Counts as they are, is
in section 8. Every number below was checked by a script (`~/potomac-crossing-work/take-aways/designer/check.js` and
`round.js`, output in `check.txt` and `round.txt`; the fonts by `cmap.js` and `adv.js`, in `fonts.txt`; `takes.js` is a
scratch prototype of the arithmetic, not the build). What v0.2 changes or adds (the slips' order, the three students,
chapters 15, 17 and 19, the new templates, the twins without a lucky flip, the rounds, the time) is checked again by
`~/potomac-crossing-work/take-aways/editor/check-v0.2.js`, output in `check-v0.2.txt`; v0.1 is kept beside it. What
v0.3 changes (the help's marks, the word's slots and tokens, the cut order, the option objects, `extra`, `flip`'s
turns, the phone held sideways, the students with the blank asked, and module-2 v0.4's table against this one) is
checked by `~/potomac-crossing-work/take-aways/editor3/check-v0.3.js`, output in `check-v0.3.txt`.*

**In Lissa's terms.** *A take-away is written in a column, the way your class writes it. You fill in the answer one box
at a time, ones first, and tap OK after each. When there aren't enough loose ones, you spread a row into ten loose,
and the little gold numbers show it. If one gets away from you, Tallyheart scratches that column out in the sand, a
square, a line, a dot, the quick way, and then you finish the rest yourself. One that gave you trouble comes back a
little later with new numbers, so you can show you've got it. From chapter 13 you do the spread yourself and write
its new numbers, your way (section 1a).*

## 1. What she sees and does

*Under `movesOn` (decision 57; section 8, `movesOn`), section 1a supersedes what this section says about `'hers'`,
`'show'`, `'tap'` and the marks. The passages it replaces are marked "**v0.3; under `movesOn`, section 1a supersedes
this**" and kept, since chapter 12 and a state with no `taught` still play them.*

**Where take-aways come.** Three places, one page:
- **A chapter's lesson** (from chapter 12), in the Training Hollow scene: a `counts` frame whose set is a take set
  (`op: '-'`, section 3), after a Counts warm-up frame. "Let's count!" opens it, as any Counts frame; a finished one
  offers "Count them again" and Next, as now.
- **A story take-away**: the same frame with a set of one or two problems (175 − 42 at the store's sunset count).
- **Count the store**, the Training Hollow's new button (section 5).

A take-away is never called a Count (module-2, amendment 3): "take-aways", "a trick", "something new".

**The page.** The lesson page's shape, kept: the panel on top (upright) or on the right (sideways), the column and the
keypad on the left (sideways) or under it (upright), the balloons above the keypad. The panel shows the problem's
picture; the question line's place holds the column; the keypad is the lesson's (1 to 9, Delete, 0, OK), so it is where
her fingers know it. No bottom Back on the page (as in every lesson); the bar keeps ‹ and Camp, and the Case File's
button is off, as on a lesson.

```
            ▫     |     ·         the heads: a square, a line, a dot (the quick picture's own marks)
            4     9    13         small, gold: what the spreads left (in 'hers', a lender's once its own digit is in)
            5̸     0̸     3̸         a top digit struck through once it has spread
       −    2     7     8
      ─────────────────────
           [ ]   [ ]   [▣]        her boxes, one per digit of the top; the outlined one is the column she is on
```

The end state of 503 − 278; the rows for the heads and the marks are reserved from the start, so nothing moves.
(v0.3's column. Under `movesOn` every mark is hers, typed as a move before her column's answer, and in `'above'` the
zero's second change, its 9, stands in the heads row's place: section 1a.2.)

- **The column** is lettered in Andika bold (decision 29), the minus sign U+2212 in its own column left of the bottom
  number, the rule under it, her boxes under the rule. Two-digit problems have two columns and two heads.
- **The heads** are the quick picture's three marks, drawn small above the columns: a square over the hundreds, a line
  over the tens, a dot over the ones, each on a small sand-coloured chip (#e8cf98, the lesson panel's colour) in the sand
  art's strokes, so the line and the dot read as pictures and never as a 1 and a full stop (decision 29). No words (they
  would be long, and Spanish later); each column's `aria-label` says "hundreds, squares", "tens, rows" or "ones, loose".
  They tie the column to the store picture and to the sand.
- **The marks.** When a column's top changes, its written digit is struck through (a slash, not a line through: a
  horizontal line would read as a minus) and its value as it now stands is lettered small and gold above it: "4" over
  the 5, "13" over the 3. When it changes again it is relettered, never stacked: a column that lent and then spreads
  itself (811 − 356's tens: 1, then 0, then 10) shows "0", then "10". In `'show'`, `'tap'` and the help, a zero spread
  across is lettered "10" as the square lands and relettered "9" as the row leaves, about 600 ms apart, so the column
  she will copy onto paper shows the zero becoming ten before it gives one away (writing 10 and stopping there is the
  commonest paper slip across a zero); a reload, and `'hers'`, show only the end state. The chain is drawn in the store
  picture and said and drawn in the sand, so the column stays readable on a phone (section 11). The marks of 503 − 278
  are 4, 9 and 13; of 811 − 356, 7, 10 and 11. **v0.3; under `movesOn`, section 1a supersedes this**: she writes every
  mark herself, as a move, in her style, and in `'above'` a column's second change stands in the heads row's place, a
  second marks row, where v0.3 reletters (sections 1a.1 and 1a.2).
- **When the marks come in `'hers'`** (the default, and what she plays most). **v0.3; under `movesOn`, section 1a
  supersedes this**: there she makes every mark as a move before the answer, and a help keeps her marks (sections 1a.1
  and 1a.4). A right digit at a turn that spread strikes every lender and letters the receiving column's value (the 3
  struck, "13" above it; the 5 and the 0 struck, nothing above them yet). A lender's gold value is lettered only when
  that lender's own digit is in: right, or written by the help, whose first line letters it (glowing, for `kept` and
  `zero`). So the decrement, and the chain across a zero, stay hers to do; the picture spreads at once (it is the honest
  store, and counting its nine rows is her own work). In `'show'` and `'tap'`, the scaffold, every mark is lettered as
  the spread lands. **The one exception is a help**, which is the scaffold too: it letters the marks of every spread its
  sand draws, lenders included, as `'show'` does (section 2). A help at 503 − 278's ones letters the 0's "10", then "9",
  and the 5's "4" before her tens: those decrements were worked for her in the sand, so in that problem they are no
  longer hers to do. Nothing is given away by it: a helped problem is never `correct`, and its twin (in any set but a
  `twins: false` one) asks the same decrements with nothing lettered. A help draws only its own turn's spreads, so it
  letters no other lender (503 − 278's tens helped: its turn spreads nothing, and the 4 still waits for her hundreds).

**The store picture** (`PC.art.placeValue`, section 8), in three zones in the column's order, left to right: **squares**
(a hundred: a flat 10 × 10 of tiny prey, drawn small and simple), **rows** (ten: chapter 4's rows of prey, "then a gap
shows in a heartbeat") and **loose** prey (decision 33's soft round shapes). It draws the top number at first. Up to nine
squares; after spreads up to eighteen rows and eighteen loose (a column only spreads when its top is below a bottom
digit, so at most 8 + 10). What is taken goes pale (dashed, like an unlit thing), never eaten on screen. A spread's ten
loose stay together as a ten-frame (two rows of five) beside the old loose until the take, and a square's ten rows as a
block of ten beside the old rows; the old pieces go pale first, then pieces from the ten, the order the help's take
counts in ("Take three: ten left. Five more."), so the picture shows the strategy the sand teaches and thirteen loose
never read as a heap. A number that is not prey (otter-strokes, claws) takes `picture: { kind: 'marks' }`: the same
three zones drawn as the quick picture on sand, never as prey.

**Spreading.** **v0.3; under `movesOn`, section 1a supersedes this**: there the store moves after each of her numbers in
`'hers'` and before each ask in `'tap'` and `'show'`, and the next box opens at once (section 1a.3, "Timing"). A row
slides from the rows zone into the loose zone and opens into ten loose (about 600 ms and 400 ms); a square slides into
the rows zone and opens into ten rows; across a zero, the square first, then the row (about 2 s in all). With Reduce
Motion it redraws at once. The column's marks are lettered as the spread lands (in `'hers'`, as the bullet above says).
The next column is outlined 0.9 s after the last spread lands (with Reduce Motion, after the redraw), plus the echo's
reading time when Chispapaw echoes; a tap draws the spread's end at once and then outlines the next column, and keys are
ignored until it is outlined (`padLockedUntil`, as after "Got it!"), so a digit typed into the animation never lands in
the wrong box. With no spread the next column is outlined at once (after the echo's reading time when she echoes).
Either way keys are also ignored for 400 ms after every OK, the figure the guard after "Got it!" already uses
(`padLockedUntil = now() + 400`), so the second tap of a double tap on OK never reaches the next box: an empty leftmost
box's OK is read as a 0 (below), and on 57 of the module's 63 problems that would be a miss, a help and a twin.

**Typing, digit by digit, right to left.** The outlined box is the column she is on, ones first. She taps a digit: it
shows in the box; another digit replaces it (no Delete hunt); Delete empties the box; OK checks it (dimmed while the box
is empty, except on the leftmost box: below). The keyboard does the same (a digit, Backspace, Enter).

**Ones first, for a hand that types left to right.** For eleven chapters she has typed answers left to right ("56"), so
her first digit of a take-away will often be its leftmost: 3 for 58 − 23 = 35. While she has fewer than five take-aways
logged, and in any set with `teach: 'none'`, her first digit of a problem is handled first: if it is wrong and equals the
answer's leading digit, it is not checked. The box clears, the ones box pulses, and Tallyheart says "Ones first: this
box, on the right." (`E.TAKE_LINES.onesFirst`). At most once a problem; not logged, not a slip, and the column's clock
starts again. A typing habit gets a pointer, not a help, on her first page of something new.

**What happens on each digit:**

| Her digit | What happens |
|---|---|
| right | the box turns green (`.tbox.right`); if the turn needed a spread that was hers to do (`regroup: 'hers'`), the store picture spreads and the marks come as section 1's `'hers'` bullet says (the lenders struck, this column's value lettered; a lender's own value once its own digit is in); the pieces taken in that zone go pale; then the next column is outlined and its line said, 0.9 s after the last spread lands, or at once when nothing spread; keys are ignored for 400 ms after the OK either way (above). A tap moves on at once. **v0.3; under `movesOn`, section 1a supersedes this**: at a turn that needs a spread her moves come first and make the marks, and a right digit typed before them is `ahead`, kept pale (section 1a.1) |
| wrong | the box turns pale yellow (`.tbox.miss`, `var(--caption)`, as a missed lesson slot is); 650 ms later the help takes the panel (section 2); the help ends with the right digit in the box, the marks lettered as the help showed them, and "Got it!", which outlines the next column. Her own digit is logged; nothing yellow is left on the column. Under `movesOn` a slip at a decide, touch, lend or get gets a move-help, and the answer's help keeps her marks (section 1a.4) |
| the last column | the problem is done: the answer row complete, the picture showing what is left, and one line (below) |
| a leading zero | the leftmost box, when the answer has no digit there (382 − 345 = 37; 500 − 467 = 33), is outlined and asked like the others. OK is lit on the leftmost box even while it is empty, on every problem, so a lit OK never tells her the answer is short; an empty OK there is read as a 0, and the 400 ms guard after every OK keeps a double tap on the column before from answering it. A 0, or OK on the empty box, is right: the box fades to an empty dotted box (never a 0) and Tallyheart says "No squares left. We don't write a zero in front." (two digits: "No rows left. We don't write a zero in front."); then the problem is done. Any other digit is a miss with its slip: `kept` for a 1 at 500 − 467 (5 − 4: the square it gave not taken off), the commonest wrong answers there being 135, 125, 188 and 133 for 731 − 696, 503 − 478, 500 − 412 and 500 − 467 |

**Each column's line**, lettered in Tallyheart's balloon and said by Read to me as the column is outlined, in words. The
column is named in the school words, as the maths study's section 1 has it ("the column is said in them"): "Ones first."
"Now the tens." "Now the hundreds." Things in the picture keep the picture words ("Nine rows now.", "Four squares
now."), and chapter 12's and chapter 13's worked examples say `E.TAKE_LINES.schoolWords` once: "A row is a ten. A square
is a hundred." (The kit defines the line but never says it: chapter 12 wires it into `E.takeLine`, its spec's engine
need.) So the game meets her school page (decenas and centenas at school, tens and hundreds at home), which is
where what she learns here carries over.
- **The first column** says its top as written, never what to do: "Ones first. Three take away eight." Seeing that she
  cannot is the lesson.
- **A later column, in `'hers'`**, names the column and its bottom digit, never its top: "Now the tens. Take away
  seven." "Now the hundreds. Take away two." It says this whether the column changed or not, so the line never tells
  her whether a spread happened: the decrement, and the chain across a zero, are hers. A column with no bottom digit:
  "Now the hundreds. Nothing to take." (403 − 57's hundreds: she works out the 3.)
- **A later column, in `'show'` and `'tap'`** (the scaffold), says its top as it stands: "Now the tens. Nine take away
  seven."; after a spread she was shown or tapped, "Thirteen take away eight."; with no bottom digit, "Now the hundreds.
  Nothing to take: four."
- **Full and short.** The full line is said on a set's first two problems of her own (`'hers'` and not a twin, the made
  warm-up among them; a `'show'` and a `'tap'` problem have the full line anyway, so they use up neither place, and
  chapter 13's 85 − 39, her first on her own, hears "Ones first. Five take away nine."), every `'show'` and `'tap'`
  problem, a twin, and the column after a help. Otherwise a column says its name alone ("Now the tens."; the first
  column "Ones first.", or nothing past the prompt's balloon when there is a prompt), so some sixty lesson problems and
  every store round do not open on the same three lines two hundred times.
- **With a prompt**, the first column's line joins the prompt's balloon when both are Tallyheart's, else follows it in
  her own. **With no prompt**, nothing else is lettered: the column already shows 702 − 345, and a balloon reading
  "Seven hundred two take away three hundred forty-five" would repeat it in the hardest words on the page. "{A} take away
  {B}." in words is said only, as the column's own speech item (as `runLesson` says its question line without a balloon:
  `heard.concat([{ text: E.counts.ask(def, q) }])`); a twin's `twinIntro` or the warm-up's `warmIntro` is lettered before
  the column's line.

**The problem's end.** One line, never one a digit, chosen in this order: a twin right in every column gets
`E.TAKE_LINES.again` ("There it is. You remembered how." / "The one like it, and every column was yours."); a store
round's hard-step problem right in every column gets that step's `rememberedStep` ("Across the zero, and no sand
needed!"); else a problem right in every column first time gets the set's `praise` (in turn, blank entries allowed
between lines so not every one gets a word) or the problem's own `right` lines (chapter 12's worked example: "One
square, two rows, three loose left."). `again` and `rememberedStep` are never blank, and a set's `lines` can override
them: module 1's praise is specific, "she remembers what was hard last time" (module-1.md), and these are the places it
matters. A helped one gets "And you finished it. We'll do one like it soon." when its twin is coming, else "And you
finished it." The next problem comes when the line can be read to its end (0.6 s and 0.38 s a word, 1.8 s at the least)
or, Read to me on, has been said and 0.4 s more (at most twice that long); a tap moves on; a problem with its own
`right` lines waits for Next, as a Count's `right` lines do. Then the set's `done` line and Next, or straight on
(`done: ''`), as a Counts frame does.

**When the spread happens** (a problem's `regroup`, the set's default, else `'hers'`):
- `'show'`: **v0.3; under `movesOn`, section 1a supersedes this** (there Tallyheart taps and says each number, and she
  types it). Tallyheart works it before she types that column: "Three take away eight? Only three loose. Not enough."
  "So I spread a row: ten more loose." (the picture spreads, the marks are lettered) "Thirteen take away eight." Then
  the keypad wakes. Each line stays until it can be read (or said), a tap moves on. Across a zero: "Two take away five?
  Not enough loose, and no rows to spread." "So a square first: ten rows." "Now a row: ten more loose." In a column that
  needs nothing, `'show'` is the column's line, as always. The worked example of each new step is `'show'`.
- `'tap'`: **v0.3; under `movesOn`, section 1a supersedes this** (there she taps the lender and types both numbers,
  asked only for a link new to the chapter). "Not enough loose. Spread a row: tap it." The rows zone glows and the
  keypad is dim. The tap target is the glowing zone (generous: the panel's full height in that zone) or the lending
  digit in the column; a tap elsewhere makes the zone glow again and says "The rows: up here." once, so she looks at
  which zone is empty, not at a Continue button. Space spreads too, and a hidden "Spread a row" button does for
  VoiceOver; a digit pressed first wiggles the glowing zone and types nothing. Across a zero: "Not enough loose, and no
  rows. Spread a square: tap it." (the squares zone glows), then "Now tap a row." Then "Thirteen take away eight." The
  first problem or two after a new step are `'tap'`.
- `'hers'`: **v0.3; under `movesOn`, section 1a supersedes this** (there each spread is hers to make, as moves, before the
  answer). Nothing is shown first. A right digit tells the page she spread in her head; the picture catches up then,
  and the marks as section 1's `'hers'` bullet says.

**v0.3; under `movesOn`, section 1a supersedes this** (this paragraph and the next: there she makes seven moves at the ones,
and a 5 typed first is `ahead`, section 1a.1). **503 − 278, `'hers'`, as she plays it** (a set's first problem, so its
lines are full). The store: five squares, three
loose. Said: "Five hundred three take away two hundred seventy-eight." Lettered and said: "Ones first. Three take away
eight." She types 5, OK: green. A square slides into the rows and opens into ten rows, then a row slides into the loose
and opens into a ten-frame beside the three; the 3 is struck with "13" above it, the 5 and the 0 are struck with nothing
above them; the three old loose go pale, then five from the ten. 0.9 s after the last spread lands: "Now the tens. Take
away seven." Nothing says nine: the picture shows nine rows, and the decrement is hers. She types 2, OK: green; "9" is
lettered over the 0; seven rows go pale. "Now the hundreds. Take away two." 2, OK: green; "4" over the 5; two squares go
pale. "Yes!" Two squares, two rows, five loose are left: 225.

Her 5 was right two ways: 13 − 8 and, taken the wrong way round, 8 − 3. When bottom − top is 5 a turn's flip lands on the
right digit: 11.1% of the turns that need a spread, over every three-digit problem, and 11 of the module's 45 spread
problems have such a turn, this one among them. The later columns catch it, because their lines no longer say their
tops: a child who takes the smaller from the bigger types 7 at the tens (0 − 7 read as 7 − 0: `zero`) and 3 at the
hundreds (5 − 2: `kept`); a child who spreads but never takes the one off types 3 at the tens (`zero`) and 3 at the
hundreds (`kept`). Simulated on all 45 spread problems (`check-v0.2.js`): v0.1's lines, which said each later column's
top as it stood ("Now the rows. Nine take away seven."), did the decrement for her, and the first child went green in
every column of 7 of them (503 − 278 and 503 − 478 among them), the second of all 45; with these lines neither goes
green on any. Twins and store problems are never drawn with a flip that lands (section 2).

**Left partway.** The lesson is saved after every column (the slot, `lesson`, as every lesson: section 4), so Camp, ‹ or
a closed page loses nothing: she comes back to the same problem and column, her digits in their boxes and the marks
lettered. A help left open is not shown again; its digit is in. Under `movesOn` the state is saved after every move: she
comes back to the same problem, column and move, her marks so far lettered and the open box empty (section 1a.3, "Back,
Camp, a reload").

## 1a. The spread as moves (decision 57)

*Design v0.4 (2026-11-08, edited 2026-11-09 after the critics: `~/potomac-crossing-work/regroup/design.md`, sections 1
to 4, as written there, its cross-references renumbered to this document's). Decision 57, Aron's words: "Can you let
Lissa decide how she wants to mark the borrow / make it visual? I'm thinking the important part is continuing to give
her the 'mechanics' of grouping and running it like an algorithm so she touches the part she needs to adjust and puts in
the new number as an intermediate step." This section supersedes what section 1 says about `'hers'`, `'show'`, `'tap'`
and the marks wherever `movesOn(st)` holds (section 8, `movesOn`: a state whose `taught` holds a step from `ones2` on);
sections 2 to 9 keep everything it does not name. The pictures are cited by their paths in the work folder; they were
drawn by the offscreen WebKit tool (`dev/webkit/run.mjs`'s `serve` and `runJobs`, under the render lock) from a mock of
the take page's column (`~/potomac-crossing-work/regroup/pictures/src/marks.html` and `render.mjs`).*

**In Lissa's terms.** *When there aren't enough loose, you do the spread yourself, the way you do it on paper: tap the
number next door (it gets crossed out), type its new number, then type the new number for your column. Then you take
away. You choose how your marks look: the new number on top, or a little 1 in front. The first time, Tallyheart taps and
tells you each number and you type it; the next time she tells you where to tap; then it's all yours.*

**What changes, in one paragraph.** In v0.3's `'hers'` (what she plays most) she spread in her head and typed only the
answer digit; the page then struck the digits and lettered the marks for her. In v0.4 the spread is a sequence of
**moves** she makes in the column, ones first, column by column: she decides; if the top is too small she **taps the
lender** (it is struck), **types its new number**, **types the receiving column's new number** in her style, and only
then **types the answer**. Across a zero every link is a move. She picks her style once, on the take page at chapter
13's first spread, and can change it on the Hollow's shelf. A slip is caught at the move where it happens and helped in
one move, so the rest stays hers. Nothing a chapter 12 player sees changes: the moves are on only for a state whose
`taught` holds a step that spreads (section 8, `movesOn`).

### 1a.1 The algorithm as she plays it

#### The moves

`E.takeMoves(plan, style)` lists each column's moves, ones first. A column whose turn needs no spread has one move, its
answer. A column whose turn spreads has three moves a link, then its answer:

| Move | Where | What she does | Right value |
|---|---|---|---|
| **decide** | the column outlined (its answer box ringed) | types a digit (enough) or taps a lender (not enough) | – |
| **touch** | a lender's column (its target: section 1a.1, "What she can tap") | taps it: its digit (or its mark) is struck, a small box opens over it | the plan's lender |
| **lend** | the small box over the lender | types the lender's new number, OK | the lender as it stands − 1 (0 to 9) |
| **get** | the receiving column | `'above'`: types its new number in the box over its struck digit; `'one'`: types the little 1 in the box in front of it; OK | `'above'`: as it stands + 10 (10 to 18, always two digits); `'one'`: 1, or the column's new number (13; 10 at a zero), lettered as the little 1 |
| **answer** | the column's own box | types the digit, OK | the plan's digit |

*Decide* is not a move of its own in the log: it is her first act in a column, a digit or a tap. Run over every problem:
at most 9 moves a problem (three answers and two links); a lend value is 0 to 9; a get is 10 to 18 in `'above'` and 1 in
`'one'`. A chain has a **second decide**: after its first link, before its second touch (section 1a.4's "decide 2").

**One spread, 43 − 16, `'hers'`, `'above'`** (`~/potomac-crossing-work/regroup/pictures/a43-above.png`,
`~/potomac-crossing-work/regroup/pictures/b43-above-get.png`). "Ones first. Three take away six." The ones box is
ringed; the keypad is awake; nothing glows. She taps the 4: it is struck and a small box opens over it, ringed, at once.
She types 3, OK: the box becomes the gold 3, the 3 in the ones is struck and its box opens over it, two digits wide, at
once; beside it, as picture only, a row slides out of the rows and rests unopened in the loose zone (600 ms). She types
1, 3, OK: the gold 13, the ring back on the ones box at once, and the resting row opens into ten loose beside the three
(400 ms). She types 7, OK: green; three old loose and four from the ten go pale. "Now the tens. Take away one." Her own
gold 3 is the top now; she types 2, OK. Done. Inputs: one tap and four numbers with their OKs (10 key taps), against
v0.3's two (4 key taps). Keys are never locked by an animation: a quick child's "3, OK, 1, 3, OK" lands as she typed it
(section 1a.3, "Timing").

**The same in `'one'`** (`~/potomac-crossing-work/regroup/pictures/a43-one.png`,
`~/potomac-crossing-work/regroup/pictures/b43-one-get.png`, `~/potomac-crossing-work/regroup/pictures/b43-one-13.png`):
the same tap and lend; at the get a small box opens **in front of** the 3, raised, as a little 1 sits on paper; she
types 1, OK, and a gold ¹ stands before the 3 (the 3 is not struck). 9 key taps. A child who means thirteen and types 1,
3 is right too: the box holds both digits, fitted in its own size, and OK letters the little 1 alone.

**A column that needs nothing** (97 − 52's ones, 7 − 2): she types 5, OK, as in v0.3. The decision is hers: nothing
tells her this one needs no spread.

**Across one zero, 503 − 278** (`~/potomac-crossing-work/regroup/pictures/a503-above.png`,
`~/potomac-crossing-work/regroup/pictures/a503-one.png`,
`~/potomac-crossing-work/regroup/pictures/b503-above-lend2.png`,
`~/potomac-crossing-work/regroup/pictures/b503-one-lend2.png`). Seven moves at the ones: tap the hundreds (5 struck),
lend 4; get the tens (`'above'`: the 0 struck, 10 over it; `'one'`: a little 1 before the 0); tap the tens again
(`'above'`: the gold 10 struck; `'one'`: the ¹0 struck as one), lend 9; get the ones (13, or a little 1 before the 3);
answer 5. The tens then: "Now the tens. Take away seven." Her gold 9 is the top: 2. The hundreds: her gold 4: 2. In
`'hers'` the store moves after each of her numbers: the square slides out of the squares and rests at the first lend,
opens into ten rows at the first get, a row slides out and rests at the second lend, opens into ten loose at the second
get.

**Across two zeros, 500 − 412**: the same seven moves (tap the 5, lend 4, get the tens 10 or ¹, tap the tens, lend 9,
get the ones 10 or ¹, answer 8); then the tens (9 − 1 = 8, no spread: she types 8) and the blank hundreds (4 − 4: the
kit's "No squares left. We don't write a zero in front.").

**A column that lent and then spreads, 811 − 356** (`leavesZero`, chapter 16): the ones: tap the tens, lend 0, get 11 (or
¹ before the 1), answer 5. The tens: its top is now her gold 0 and 0 < 5, so: tap the hundreds, lend 7, get the tens
(`'above'`: her gold 0 struck and 10 written over it; `'one'`: a little 1 before the gold 0), answer 5. The hundreds: 7 −
3 = 4.

#### What she can tap

**A column is a tap target when a spread out of it has been taught**: the tens (it gives a row) from `ones2` on, the
hundreds (it gives a square) from `tens` on, by the state's `taught` (a lesson's: this chapter's and the earlier ones'
steps; a round's: the steps she has learned), and only a column to the left of the one she is on. So in chapters 13 and
14 only the tens can be tapped, and only at the ones' turn; the hundreds is inert until chapter 15. This is the kit's own
rule ("a line never names a spread she has not met"), moved from the slip to the target: in chapter 13 she cannot spread a
square by accident, and no line has to say why not. With no target (chapter 12; a two-digit problem's tens; any
hundreds turn) the column is decided by typing, as in v0.3.

**Targets are live only at a decide**: the column's first, and a chain's second (before its second touch).
`E.takeTargets(plan, col, moveIdx, taught)` returns `[]` at any other move. Two exceptions, both at once after a move:
- **Undo**: while the lend box is open and empty, a second tap on the lender she has just struck undoes the strike (the
  box closes, the column is back at its decide; counted in `nudges`). On paper she would rub it out before writing.
- **Order**: at the answer move that ends a column's moves, a tap on a column to the left gets one pointer a problem,
  "Take away first, then the next column." (`order`; not counted, no glow), for a child taught to mark every column
  first (section 12, question 4). (A column that needs nothing has no moves: its answer is its decide, where a tap on a
  target is a touch.)
Otherwise a tap at a lend, get or answer move does nothing.

**The target** is the lender's column above the rule, its bottom digit included (a tap anywhere there is a tap on the
lender: its heads chip, its marks, its top and its bottom digit), at its full width plus half of each gap. Where that is
under 44 px wide (the phone held sideways), it is widened to 44 px into the near half of her own column (which is inert
at the decide), and for the leftmost column outwards to the minus sign's margin. A bottom digit in any other column does
nothing.

**The store's zones are targets only while a lender glows**: in `'tap'` (as v0.3's target was, at the panel's full
height), after a pointer that lights the lender (`where`, `gave`, `zeroFirst`), and after `ahead`. In `'hers'` at a
decide the panel is neither a target nor a move-on surface: a tap on it does nothing (`T.touch` is not called and the page
does not advance). The rows zone is the tens, the squares zone the hundreds; the loose zone is never a lender.

**A tap is a tap**: a press that slides more than 10 px, or is held more than 0.5 s (a finger resting while she thinks),
is not one. A tap that hurried a landing, moved a line on or ended a help is used up there; and the column's targets
ignore taps for 400 ms (`TAKE_MS.ok`) after every phase change and after a column is outlined, so a double tap meant as
"go on" never lands as a touch.

**Her own column**: a tap on its top digit makes that digit wiggle once (180 ms), the same at every turn, needed or not,
with no line and no glow (a line, or a glow only when a spread is needed, would answer the decision for her). A tap on a
column already done, or between columns, does nothing.

#### Her answer typed before the moves: `ahead`

At a turn that needs a spread, a digit typed before any move is judged as v0.3 judged it (section 1a.4's decide slips). A
**right** one cannot be told from a flip that lands (bottom − top equal to the digit: 11 module problems have such a
turn, 7 of them on every spread turn, among them chapter 13's 52 − 27, 503 − 278 and 811 − 356), so it is neither green
nor a slip, and it is not taken away from her: her digit **stays in the answer box, pale**, the box loses its ring, the
lender and its zone **glow** as in `'tap'` (the decision is out, so the glow gives nothing away), and Tallyheart says one
of two lines (`ahead`):
- when bottom − top is not the digit (she did the spread in her head): **"Right! Now show me your marks."**
  (`ahead.right`);
- when it is (the flip lands, and "Right!" would praise taking the smaller from the bigger): **"Marks first, then the
  answer."** (`ahead.flip`).
Then she makes the moves (the rest of that column's touches glow as in `'tap'`, with no `askLend`/`askGet`), and after
the last one the answer box is ringed again holding her pale digit: OK takes it, or she types another. So a second
`ahead` cannot happen. A digit typed while the lender glows types nothing: the first says `tap`'s line once ("Not enough
loose. Spread a row: tap it.", its zero form, or across a zero `tapSquare` / `tapRow`), the next makes the touch for her,
saying `askLend` ("One row goes. How many rows now?"), so every digit still moves it on (the kit's "never a wall");
that ask leaves the slot once she has typed the lend. Both are counted in `nudges`. A column picked up with her pale digit
(a reload, ‹, Camp) letters the `ahead` line again in the slot, unsaid (`E.takeAheadLine`, worked out from the plan:
nothing more is saved). A second tap on a struck lender undoes the strike only when she struck it herself, never when a
help or this touch struck it for her. Not a slip, no help, no twin; the entry carries `ahead: [col]`; the problem is not `correct`
(the decision was pointed at) and its end line is chosen as for any problem with no slip (section 1a.4, "Twins and the
log"). Decision 57 keeps the moves; the fade (section 12, item 5) is where in-head answers could one day stand.

#### The three modes

**`'show'`** (the worked example, the first of a new step's three): Tallyheart makes each touch herself, in **her chosen
style**, says each number, and Lissa types it, so her fingers are on every move from the first problem and f036's "I'll
say each step. You type it." is literally what happens. Each touch is drawn as a paw-tap ripple on the lender (Reduce
Motion: a brief glow), then the strike, and the store moves as she is told (as in `'tap'`, below); each line stays until
it can be read (or has been said), the box is ringed, and the keypad is awake. A wrong number here is lettered for her
with no slip and no line (it is the worked example). 43 − 16 in `'above'`:
- "Three take away six? Only three loose. Not enough." (`showOpen`, kept)
- "So I spread a row. Four rows, one goes: three." (`showLend`: the ripple on the 4, the 4 struck, the row slides out;
  the box over the 4 ringed; she types 3)
- "Ten more loose: thirteen. Write it on top." (`showGet.above`; in `'one'`: "Ten more loose: write a little 1 in
  front."; the ten opens; the box ringed; she types 13, or 1)
- "Thirteen take away six." (`colShown`, kept) She types 7.

Across a zero (702 − 345): `zero` ("Two take away five? Not enough loose, and no rows to spread."), `chainLend` ("So a
square first. Seven squares, one goes: six."; she types 6), `chainGet` (`'above'` "Ten rows: ten. Write it on top." /
`'one'` "Ten rows: write a little 1 in front of the zero."; 10 or 1), `chainLend2` ("Now a row. Ten rows, one goes: nine.";
9), `showGet` ("Ten more loose: twelve. Write it on top."; 12 or 1), then "Twelve take away five." Six lines, as before;
four numbers she types.

**`'tap'`** (the guided first problems: each move prompted, the target glowing): the lender's column glows in the
column and its zone glows in the store; the keypad is dim until it is tapped. **The store moves before she is asked**:
the row slides out at the touch, so the rows zone shows three when the lend box opens, and it opens into ten loose when
the get box opens, before she types 13 (or 1). 70 − 34 in `'above'`:
- "Your turn. Ones first. Zero take away four." (prompt joined, kept)
- "No loose. Spread a row: tap it." (`tap`'s new `onesZero` form: chapter 13's item 16 closed) — the 7 and the rows glow.
- She taps: the row slides out; "One row goes. How many rows now?" (`askLend`) — the box over the struck 7; she types 6.
- The ten opens; "No loose, and ten more. How many loose now?" (`askGet.above`, its zero form; `'one'`: "No loose, and ten
  more: write a little 1 in front.") — the box over the struck 0 (or in front of it); she types 10 (or 1).
- "Ten take away four." (`colShown`) — she types 6. "Now the tens. Six take away three." — 3.

**A link she has made on her own keeps the tap prompt and drops its two asks** (section 3's lighter trim with moves, now
the rule): in a `'tap'` problem, `askLend` and `askGet` are said only for a link of a kind no earlier chapter taught (a
row's before chapter 14, a square's in chapter 15, a chain's in chapter 18). Where they are dropped the tap prompt, the
glow, the store moving first and the ringed boxes stay, and she still taps and types both numbers; a slip there gets its
move-help. So chapter 13's 70 − 34, 15's 418 − 162 and 18's 604 − 137 ask every number; 14's 640 − 218, 16's 523 − 247
and 19's 600 − 248 ask none.

A digit before the tap wiggles the glowing zone and types nothing (v0.3); a tap elsewhere says "The rows: the glowing
ones." once (`tapHere`, its words changed: the glow is in the column too now, often left of or under her, so "up here"
pointed wrong; no live chapter says it). Across a zero: `tapSquare` ("Not enough loose, and no rows. Spread a square: tap
it."), `askLend` (squares), `askGet` (rows), `tapRow` ("Now tap a row."), `askLend`, `askGet`, `colShown`.

**`'hers'`**: no prompt, no glow. The column's lines are v0.3's, unchanged: the first column says its top as written
("Ones first. Five take away nine."), a later column its name and bottom digit, never its top ("Now the tens. Take away
three."), full on a set's first two own problems, a twin and after a help, the name alone otherwise. They still never
say whether a spread happened; now her own marks say what each top has become, because she wrote them. **The store
moves after each of her numbers** (the row slides out and rests after her lend's OK, opens after her get's OK), so it
shows what the number she typed meant.

**Twins** keep v0.3's rule: a `'show'` problem's twin is `'tap'`, every other twin `'hers'` (which slips bring one:
section 1a.4). **Count the store** rounds are `'hers'`, with moves, in her style, their targets by the steps she has learned.

### 1a.2 Her two styles

| | `'above'` (the new number on top; v0.3's look, the default) | `'one'` (a little 1 in front) |
|---|---|---|
| the lender | struck, its new number over it (gold) | the same |
| the receiver | struck, its new number over it: types **13** | not struck; a little gold **1** before it: types **1** (or 13: the same mark) |
| across a zero, the zero | struck, 10 over it; then the 10 struck and 9 over that (a second marks row) | ¹0; then the ¹0 struck as one and 9 over it |
| a column that lent, then spreads (811's tens) | its gold 0 struck and 10 over it (a second marks row) | a little 1 before its gold 0 |
| marks rows a column needs (run, every problem) | up to two: 111,375 problems (`both`, `zero`, `zeros`), 25 of the module's | one, always |
| key taps for a spread | 6 (tap; digit, OK; two digits, OK) | 5 |

**The second marks row** (`'above'` only) stands in the **heads row's place**, column by column: when a column is marked
a second time, its head chip gives way to the gold number (`~/potomac-crossing-work/regroup/pictures/a503-above.png`:
square chip, 9, dot chip). The row is there from the start, so nothing moves, and the column is never taller than
v0.3's. The chip's words stay in its `aria-label`. Where the heads row has already gone (the fallback `tnohead`), on a
problem that will mark a column twice, or whose lent hundreds can take an extra touch at the tens, the row is kept as the second marks row (the chips hidden) and the fallback goes
straight to its next step; if 844 × 390 with Aa on cannot hold it (the page review's measure), the second mark is
lettered beside the first, struck small, on that size only.

**The default** is `'above'` until she picks: it is v0.3's look, the kit's tests already pin it, and it is what any page
reached before the pick shows (a `PC.debug` screen, a lesson left on the marks page).

**Where she picks: the marks page.** A page of the kit's own (`E.takeMarksPage`; the UI's `marksPage(host, o)`, one
function, called by `runTakes`' `'marks'` phase and by the Hollow's `{ marks: true }` branch, `renderMarks(opts)`),
shown by the take page **before a problem's prompt when that problem will ask a spread move and her style is not yet
set** (`cat.takes.style` absent): for
every player that is chapter 13's worked example, 43 − 16, before its prompt, so the prompt and "Ones first." stay
joined right before the column. The take page's interact area (where the column and keypad stand) holds two big picture
buttons, each a small column (the kit's `.tcol` markup) of 43 − 16 **done**, its answer 2 7 in plain ink in its boxes
(no ring: nothing there to type), the marks in one style with a soft gold halo on the receiver's mark (the ¹ or the 13),
and a label under it ("A little 1 in front", "The new number on top"). The pictures are sized by font-size, never by a
transform, so the marks' 16 px floor holds and their digits are at least the column's own size on a phone; side by side
where they fit, **stacked on 390 × 844** (`~/potomac-crossing-work/regroup/pictures/choice-phone.png`), and on 844 × 390
the buttons on the left, the balloons over the panel. The panel keeps the store at 43. The keypad is hidden.

**How it runs** (`~/potomac-crossing-work/regroup/pictures/choice.png`, the state once every line is shown). The lines
come one balloon at a time, and as each shows (and is read) its picture lifts and glows: the left picture with
Chispapaw's two balloons, the right with Tallyheart's first, both with her last; Read to me says the lines, then each
label as its button glows. **The buttons go live only once the last line is shown** (its reading time, or said), so a
tap made to move the lines on never picks. A tap on a picture sets `cat.takes.style` and saves; that button stays
pressed (a ring, a check and `aria-pressed`), and the style's answer line is lettered. Through the answer line the other
button stays live: a tap on it switches, saves and says that style's line. The page goes on after the answer line's
reading time, or with a tap on the stack or the panel, never with a tap on a button. The set's `marks` key gives the
lines; with none, the kit's own (Tallyheart: "When you spread a row, how do you write it?" / "Both are right. Tap the
marks you like." / after: "Then that’s how we’ll write it."). Before a pick, once the buttons are live, nothing goes on:
the page waits for her choice. **As built** (the page owner's calls): the answer line takes the question's place, so the
page never holds more than its four balloons (with a fifth the pictures ran under the screen at every landscape iPad
size and on the phone upright), and the stack is held from the start at its tallest (the four lines, or three and the
longer answer line), so the pictures never move as the lines come; on an iPad held sideways too the balloons stand over
the panel (the frame's `tmkpage`: beside the pictures four balloons ran them 60 to 130 px under the screen); the
pictures have no heads row; on the phone held upright the panel is made shorter (never under half, the take page's own
fallback) and the pictures are brought into view once live. Enter or Space on a focused picture picks it (the take
page's keys stand aside for a live `.tpick .tpb`).

**Chapter 13's lines** (the set's `marks`; four balloons, each under the 12-word guard):

| | who | line | words |
|---|---|---|---|
| 1 | Chispapaw | "My little Tall One writes it like THIS." (the `'one'` picture, on the left, glows) | 8 |
| 2 | Chispapaw | "A little 1 in front!" (the same) | 5 |
| 3 | Tallyheart | "Some write the new number on top instead." (the `'above'` picture, on the right, glows) | 8 |
| 4 | Tallyheart | "Both are right. Which marks do YOU like?" (both glow; the buttons go live) | 8 |
| after `'one'` | Chispapaw | "Just like my little Tall One!" | 6 |
| after `'above'` | Tallyheart | "On top it is. That’s how I write it too!" | 10 |

The little 1 is lettered as the digit everywhere she reads it (the labels, the lines, `showGet.one`), and said "one".
"Both are right" tells her neither is a test; "do YOU like" asks her, not her school, which she may not know yet (decision
53: the module teaches it). Chispapaw's little Tall One does her homework in Spanish, so hers is the little 1, the common
mark in Spanish-language classrooms; Tallyheart's is the kit's. We do not know Lissa's class's mark (the kit's open
question 12.2): this page asks the one person who does.

**After that: the shelf.** Once `ones2` is learned (or a style is set), the Hollow's shelf shows a **My marks** button
beside My nest, a normal `.btn` (56 px), labelled "My marks", its icon only her receiver's mark (¹3, or 13 over a struck
3) drawn at 32 px or more, as the column draws it (`#marksBtn`, its icon `takeMarksIcon(style)`, as tall as My nest).
It opens the marks page in the Hollow (`go('hollow', { marks: true })`, `renderMarks(opts)` at the top of
`renderHollow`, beside `{ counts: true }`: no new view), her current style pressed (ring, check, `aria-pressed`), the
kit's lines (Tallyheart's, `E.takeRoundDef()`'s), both buttons live at once; a tap changes it at once, no cost, saved,
and the style's answer line takes the question's place; ‹ goes back to the shelf (`onBack`'s `hollowSub === 'marks'`).
A change reaches the next problem (a lesson waiting in its place included: section 8, v0.4's "State"); a problem under
way keeps its marks.

**The grown-ups corner** names it on one line under the Take-aways table, once `ones2` is learned or a style is set:
"Her marks: a little 1 in front (¹3), her choice. She can change it in the Training Hollow (My marks)." / "Her marks: the
new number on top (13 over a crossed-out 3), her choice. …" / "Her marks: not chosen yet (on top until she does)." Only
Lissa changes it (decision 57: hers to decide).

**The pictures** (each 480 × 340 at the upright iPad's 44 px digits;
`~/potomac-crossing-work/regroup/pictures/sheet.png` is all ten):
- `~/potomac-crossing-work/regroup/pictures/a43-above.png`, `~/potomac-crossing-work/regroup/pictures/a43-one.png`: 43 −
  16 mid-problem, her marks done, the ones box ringed.
- `~/potomac-crossing-work/regroup/pictures/a503-above.png`, `~/potomac-crossing-work/regroup/pictures/a503-one.png`:
  503 − 278 mid-problem, the whole chain marked, the ones box ringed.
- `~/potomac-crossing-work/regroup/pictures/b43-above-get.png`,
  `~/potomac-crossing-work/regroup/pictures/b43-one-get.png`: 43 − 16 at the get move, its box open.
- `~/potomac-crossing-work/regroup/pictures/b43-one-13.png`: `'one'`'s get with 1, 3 typed: the two digits fitted in the
  box's own size, until OK.
- `~/potomac-crossing-work/regroup/pictures/b503-above-lend2.png`,
  `~/potomac-crossing-work/regroup/pictures/b503-one-lend2.png`: 503 − 278 at the zero's lend, its box open.
- `~/potomac-crossing-work/regroup/pictures/b503-decide.png`: 503 − 278 at the decision, the tap targets dashed **for
  the diagram only** (chapter 18 on; never drawn on the page: in `'hers'` nothing glows).
- `~/potomac-crossing-work/regroup/pictures/choice.png`: chapter 13's marks page once its fourth line is shown (four
  balloons, both buttons live, the answers filled, the receivers' marks haloed);
  `~/potomac-crossing-work/regroup/pictures/choice-phone.png`: the same at 390 wide, stacked.

### 1a.3 The page

**What is live, phase by phase** (`runTakes`' phases; v0.3's `'line'`, `'show'`, `'help'`, `'end'` kept). No animation
locks the keypad: the next box opens the moment a move's OK is accepted, and the store's slide or opening plays beside it.

| Phase | Tappable | Glows | Ringed box | Keypad | Read to me |
|---|---|---|---|---|---|
| decide (`'type'`) | the keypad; the targets (section 1a.1) | nothing (`'hers'`); the lender and its zone (`'tap'`, and after `ahead`) | the column's answer box | awake (`'tap'`: dim, a digit wiggles) | the column's line (v0.3) |
| touch accepted | – | the struck lender; its zone (`'tap'`) | the lend box, at once | awake | `'tap'`: `askLend` (unless the link is known); `'show'`: `showLend` |
| lend (`'lend'`) | the keypad; the struck lender (undo, while the box is empty) | the struck lender | the small box over it (one digit) | awake | – |
| lend OK | – | – | the get box, at once (`'hers'`: the row slides out and rests beside it, 600 ms) | awake (OK's 400 ms guard) | `'tap'`: `askGet` (unless known); `'show'`: `showGet` |
| get (`'get'`) | the keypad | – | over the struck receiver (`'above'`, two digits) or in front of it (`'one'`, one or two digits, fitted) | awake | – |
| get OK | – | – | the answer box, or the chain's second decide, at once (`'hers'`: the ten opens beside it, 400 ms) | awake (OK's 400 ms guard) | `'tap'`, `'show'`: `colShown` |
| answer (`'type'`) | the keypad; a column to the left (`order`, once) | – | the column's answer box | awake | nothing (`'tap'`, `'show'`: `colShown`) |
| a move's help | the stack, panel or column (moves on, after its reading time) | the fixed move (gold glow) | – | dim (`.dim`), locked for its reading time | the help's line |
| marks page | the picture buttons, once the last line is shown; after a pick, the stack and panel (go on) | each picture as its line shows | – | hidden | the lines, then the labels |

**The boxes.** The answer boxes are v0.3's. The small box (`.tmini`) is new: cream, a 3 px ink border, radius 6 px, the
gold ring `box-shadow: 0 0 0 3px var(--gold)` while it is the one she types into (`.tmini.on`), `box-sizing:
border-box`, its height equal to the row it lives in (the marks row's `max(.54em, 17px)`, the heads row's `.6em`) and
its digits fitted to that height, about 1.15em wide for one digit and 1.75em for two, so it never spills out of its row
or above the column's top edge towards the stack. It sits in the marks row over a lender or an `'above'` receiver, in
the second marks row (the heads row's place) over a column's second change, or in the top row just before a `'one'`
receiver's digit, raised, and always nearer its own digit than the neighbour's mark. Below 32 px digits the front box
drops the 16 px floor (at 844 × 390 a 16 px box filled the whole gap). An empty box must never read as a 0: at one digit
wide it did in the first picture, so 1.15em is the least. It is only where her digits go: never a tap target. A right
number turns the box green for 250 ms, then it is the gold mark. Delete empties it; in a two-digit box a digit is added
while it holds fewer than two and starts it again when it holds two (no Delete hunt: 1, 4, 1, 3 gives 13). **The `'one'`
front box takes two digits as well**, fitted in its own width
(`~/potomac-crossing-work/regroup/pictures/b43-one-13.png`), so a child who means thirteen types 1, 3 and is right: 1 or
the column's new number (13; 10 at a zero) letters the little ¹; a 3 (the digit as written), or anything else, is the
`get` slip. OK commits a box with one digit too (a lone 3 at an `'above'` get is the "forgot the ten" slip, section
1a.4); OK is dim only on an empty box. The 400 ms guard after an OK ignores **OK only** (its double tap), never a digit:
a digit typed then goes into the box that has just opened.

**Tap targets' size** (section 1a.1's target: a lender's column above the rule, bottom digit included, its full width with
half of each gap; digits by the kit's `clamp()`):

| Size | digits | column wide | target wide × tall | widened (section 1a.1) |
|---|---|---|---|---|
| 1080 × 720 | 33 px | 47 | 51 × 104 | – |
| 1180 × 820 | 35 | 50 | 55 × 110 | – |
| 820 × 1180 | 44 | 62 | 68 × 138 | – |
| 390 × 844 | 29 | 41 | 45 × 91 | – |
| 844 × 390 | 24 | 34 | 37 × 79 (65 without the heads row) | 44 × 79, into the near half of her own column |

**The keypad stays put** (v0.3's rule, kept): the marks row and the heads row are reserved from the start; the small
boxes live in them (or in the top row's cell). Under the column's line there is **one slot**: a move-help, `ahead`,
`where`, `gave`, `zeroFirst`, `nine`, `order` or `tapHere` balloon goes there and replaces the one already there, never
stacks under it. The stack's held height (`takeReserve`) counts, from the column she is on, each `'tap'` prompt it can
say (`askLend`, `askGet`, `tapRow`) and **the longest** line that slot can hold on this problem (its moves decide which
can come), not their sum. **Before the build**, the UI owner measures that reserve at the eight sizes, Aa off and on (a
probe on the v25 page with the longest lines inserted): if the keypad goes under at 1080 × 720, the slot's balloon takes
the place of the column line and of the page's and a twin's introduction instead of standing under them (as built: the
store round's intro and a twin's "One like it." go with the line; a `'tap'` or `'show'` prompt stays). Pinned as v0.3's is: the keypad's box equal at decide, lend, get and
answer, with and without the slot filled (`keypad-moved`, measured on the new screens).

**Focus and keys.** The page keeps keyboard focus on itself; digits, Backspace and Enter work on whichever box is
ringed. For VoiceOver and a keyboard, each tap target is a button in the column (`role="button"`, `tabindex="0"`,
labelled from `E.TAKE_WORDS`: "Spread a row" for the tens, "Spread a square" for the hundreds: v0.3's hidden button's
words), live only at a decide (the first, and a chain's second); Space or Enter on it taps it. The small box is labelled by
its column and its job ("tens, new number: 3"; "ones, the little 1: 1") and becomes `aria-current`.

**Back, Camp, a reload.** No bottom Back (v0.3). The state is saved after every move, not only every column: ‹, Camp or
a closed page come back to the same problem, column and move, the marks done so far lettered and the open box empty (a
number typed and not OK'd is not kept, as an answer is not), and the store drawn at rest: between a lend and its get,
the lender's piece resting unopened in the receiving zone (section 8, v0.4's pieces: `E.takePicture`'s `half`), never a
slide replayed. There is no undo of a move once its number is in (the lend's empty-box undo apart): a slip is helped,
the column goes on.

**Timing.** The next box opens the moment a move's OK is accepted; a lend's slide and a get's opening play beside it as
picture only (Reduce Motion: drawn at rest at once). After the last get the answer box is ringed at once (v0.3: 0.9 s
after the last spread). A tap on the panel or column draws a landing at once only where the panel or column is a move-on
surface (a help, a line, `'show'`), and that tap is used up (section 1a.1). Where a lock stays (a move-help's reading time),
the keypad dims (`pad.classList.add('dim')`, as `'tap'` does), so a locked keypad never looks awake.

**Sizes and Aa.** The column does not grow (the budget of section 6 holds: no new row, the small boxes inside the
reserved rows); Aa grows the balloons, as before. On a phone held sideways the stack stands over the panel (v0.3): the
`'tap'` prompts and the slot's lines are there, the column and keypad on the left. The marks page: section 1a.2.

**Chapter 12's look is untouched**: the new CSS hangs on `.frame[data-mode="take"].tmoves`, a class the page sets only
when `movesOn(st)` (section 8, `movesOn`: from chapter 13's lesson on, and a store round once `ones2` is learned), and
the marks page's picture-button rules hang on `.tpick` as well, the wrapper `marksPage` draws, so the Hollow's shelf
page (whose frame never has `.tmoves`) draws them too.

### 1a.4 The slips and the help at each move

**Caught at the move, helped in one move.** A slip at a decide, touch, lend or get gets a **move-help**: the slip's line
in Tallyheart's balloon (or the set's teacher's), in the one slot under the column's line (section 1a.3), and the move she
missed made for her, glowing (the right lender struck and its box opened, the right number lettered into the box), then
the next move is hers. No sand, no "Got it!": the store stays, the keypad dims and ignores keys until the line can be read
(0.6 s and 0.38 s a word, at least 1.6 s; Read to me on, said and 0.3 s more, at most twice that), a tap moves on at once.
The line stays in the slot until the column ends or another replaces it. A slip at the **answer** keeps v0.3's sand help
(the take to ten in hops, the digit, "Got it!"), called with `shown: true` because her moves made the spread: it starts at
the take, and **every step's marks are her own** (`E.takeHelp` with `opts.style`: her marks as she made them, in her
style, unchanged by the help; the sand alone shows the take), so no help ever shows her a style she did not choose.

| Move | What she did | Slip | Its line (the 43 − 16 or 503 − 278 form) | The help's move |
|---|---|---|---|---|
| decide | typed bottom − top at a spread turn (not the digit) | `flip` (v0.3's line) | "Careful: it's three take away six, the top take away the bottom. Only three loose. Not enough." | taps the lender for her |
| decide | typed 0 at a spread turn | `nospread` (v0.3's) | "Three take away six? Not enough loose. But we can spread a row." | taps the lender |
| decide | typed another wrong digit at a spread turn | `fact` (v0.3's `factSpread`) | "Three take away six: we spread a row, then take six." | taps the lender |
| decide | at a chain's turn, typed bottom − top or 0 | `zero` (v0.3's) | "Three take away eight? Not enough loose, and no rows to spread." + "So a square first." (`chainFirst`) | taps the hundreds |
| decide | at a chain's turn, typed another wrong digit | `fact` | "Two take away five? Not enough loose, and no rows to spread." + "So a square first." (`zero`'s lines, 702 − 345) | taps the hundreds |
| decide | typed the right digit at a spread turn | – (`ahead`, a pointer) | "Right! Now show me your marks." (`ahead.right`), or, when the flip lands, "Marks first, then the answer." (`ahead.flip`) | none: her digit stays pale, the lender glows (section 1a.1) |
| decide | typed a digit while the lender glows after `ahead` | – (counted in `nudges`) | the first: `tap`'s line; the next: the touch made, `askLend` | the second time: the touch |
| touch | tapped a lender when the column needs nothing, and typed its number | `extra`, judged when she commits that lend number, logged with `move: 'touch'` | "Careful: seven take away two? The loose have enough. No row goes." (`extraTouch`); at a ones turn with the hundreds struck (chapter 15 on), "… No square goes." (`extraTouch.onesFar`) | the strike undone; the answer box ringed |
| touch | at a chain, tapped the zero first: the first time in a problem | – (`zeroFirst`, a pointer, in `nudges`) | "That zero has no rows to give. So a square first." (`zeroTouch`) | none: no strike; the hundreds glows, she taps it |
| touch | at a chain, tapped the zero first again in the same problem | `zero` | the same line | the strike made on the hundreds, its box open |
| touch | tapped the hundreds when the tens can give (chapter 15 on) | – (`where`, a pointer, in `nudges`) | "Next door first: the rows." | none: the tens glows, she taps it |
| touch | at a chain's second touch, tapped the hundreds again | – (`gave`, a pointer, in `nudges`) | "The squares gave already. Now the rows." | none: the tens glows |
| decide 2 | at a chain, after the zero got ten, typed the right digit | – (`ahead`, as at the first decide, both forms) | "Right! Now show me your marks." / "Marks first, then the answer." (503 − 278: its flip lands) | none: the tens glows |
| decide 2 | typed bottom − top as it stands, or 0 (stopping at ten: the commonest paper slip across a zero) | `zero` | "Careful. Ten rows now, and still only three loose. Now a row." (`zeroStop`) | taps the tens |
| decide 2 | typed another wrong digit | `fact` (`factSpread`, the top as it stands) | "Two take away five: we spread a row, then take five." (702 − 345) | taps the tens |
| lend | typed the lender as it stood (4 for the 4) | `kept` | "Careful. One row goes to the loose. Three rows now." (`keptMove`) | 3 lettered in the box |
| lend | typed another wrong number | `lend` (new) | "Four rows, and one goes: three rows." (`lendMove`) | 3 lettered |
| lend | at a chain, the zero's ten: typed anything but 9 | `zero` | "Careful. That zero is ten rows now, and one goes: nine rows." (`zeroLend`) | 9 lettered |
| get | at a chain's zero, typed 9 (either style: fifty tens become forty-nine, the hundreds already taken) | – (`nine`, a pointer, in `nudges`) | "Yes, nine soon! First the zero gets ten rows." (`nine`) | the 10 (or the little 1) lettered; the second touch is hers |
| get | `'above'`: typed another wrong number (3, 14 …) | `get` (new) | "Three loose and ten more: thirteen loose." (`getMove`) | 13 lettered |
| get | `'one'`: typed anything but 1 or the column's new number | `get` | "Ten more loose: a little 1 in front. Thirteen loose." (`getMove.one`) | the little 1 lettered |
| answer | as v0.3 (`fact`; at a column that lent, `kept`; at a lent zero, `zero`; `extra` typed in her head at the tens or hundreds) | v0.3's | v0.3's lines; but `kept` at a column that lent **and then got** says `keptGot`: "Careful. One row went to the loose, then ten came: ten rows now." (811 − 356's tens answered 6) | v0.3's sand help, her marks kept |

Every line has its tens form (rows and a square in place of loose and a row) and its zero and none forms ("No loose,
and ten more: ten loose."; "One row, and one goes: none now."), as v0.3's do. Every maths word is a token from
`E.TAKE_WORDS`; the regrouping word only in its base form before its object ("So I spread a row", "Spread a row: tap it.")
or after it ("no rows to spread"), never before a pronoun; never borrow, carry or regroup; never a line that names a
spread she has not met (the tap-target rule makes `extraTouch`'s hundreds form unreachable before chapter 15). `ahead`
and `order` name no maths word, so they need no form.

**Pointers are not slips**: `ahead`, `zeroFirst`, `where`, `gave`, `nine`, the lines and touch after `ahead`, the lend's
undo, `order`, the own-column wiggle and v0.3's ones-first pointer are never logged as slips, never help, never bring a
twin. All but `order`, the wiggle and the ones-first pointer are counted on the entry (`ahead`, `nudges`) and make the
problem not `correct` (something was pointed at), so the corner's "Right first time" stays honest. `where` is a pointer
because borrowing two columns over is not a documented paper bug and a mis-tap between neighbours is likely on a phone;
the zero tapped first is a pointer the first time because many classes teach "go next door; nothing there, so go one
more", and a child doing that taps the zero as she looks (a tap costs less than a pencil mark); a second one is the slip,
the start of the best-documented bug (the zero made 9 and the hundreds left as it was). The moves themselves make that
bug's ending impossible (the hundreds must be tapped and lent), so what the pointer costs is only the corner's catch of
the bug's first step; the nudge still shows it. A 9 at a chain zero's get is right maths once the hundreds is taken, so
it is the kind `nine` pointer, never a `zero` slip that would tell a grown-up she has a bug she doesn't have.

**Twins and the log.** `helped` is a slip at any move; `correct` is no slip and no counted pointer. The twin, the miss
line and `E.hardTakes` go by `helped`; the end line, for a problem with no slip, is chosen through v0.3's order (`again`,
`rememberedStep`, the problem's `right` balloons, the set's `praise`), so 52 − 27 answered 5 first, then right moves,
still gets Glintstar's "Twenty-five for the Clan." A helped problem's twin comes as v0.3 says (two later; `'hers'`, or
`'tap'` for a `'show'` problem; at most twice by lineage) **for every slip but the two new keying ones**: a `lend` or `get`
slip (another wrong number) gets its move-help and is logged, but brings a twin only when the same one comes twice in the
lesson (or the round); `kept`, `extra`, `flip`, `nospread`, `zero` and `fact` keep theirs. A twin costs 25 to 40 s, the
biggest single cost against decision 56, and a typo is not a misconception. Each slip is logged with its move: `{ col,
move: 'touch' | 'decide' | 'lend' | 'get' | 'answer', given, slip }` (`col` the column whose turn it was; `given` what she
typed or tapped: a digit, a number, or the tapped column for a touch).

**The students, run** (`~/potomac-crossing-work/regroup/editor/students-v0.4.txt`; every module problem with a spread,
chapters 13 to 21, each chapter's `taught`, both styles alike):

| Student | Correct on | Helped (twinned) | Its first slip, or what points |
|---|---|---|---|
| takes the smaller from the bigger, never taps (and again after `ahead`) | 0 of 45 | 38 (38) | `flip` at the decide 26, `zero` 12; 12 `ahead`, all in the flip form ("Marks first…"), each followed by `tap`'s line and the touch made (24 nudges) |
| taps the right lender, types it as it stood | 0 of 45 | 45 (45) | `kept` at the lend, 45 |
| taps next door wherever a target is, needed or not | 0 of 33 | 33 (33) | `extra`, 33 |
| at a chain, taps the zero first | 0 of 14 | 0 | 14 `zeroFirst` pointers |
| at a chain, stops at ten (types the ones as they stand, keeps the ten at its lend) | 0 of 14 | 14 (14) | `zero` at the second decide 12; at 503 − 278 and 503 − 478 its flip lands (`ahead`, flip form) and the ten kept at the lend is `zero` there, 2 |
| at a chain, types 9 at the zero's get | 0 of 14 | 0 | 14 `nine` pointers |
| types the receiver's digit as written (3 for 13; 3 in the front box) | 0 of 45 | 45 (0) | `get`, 45: helped, no twin |
| right, but answers each spread column before the moves | 0 of 45 | 0 | 56 `ahead`: 44 "Right! Now show me your marks.", 12 "Marks first, then the answer." |
| right every move | 45 of 45 | 0 | – |

## 2. A miss: the help in the sand

*Under `movesOn` (section 1a.4) a slip at a decide, touch, lend or get gets a move-help in the slot under the column's
line, not the sand. A slip at the answer keeps this section's help, called with `shown: true` (her moves made the
spread), so it starts at the take, and every step's marks are her own, in her style (`E.takeHelp` with `opts.style`): it
letters no mark for her. What this section says about a help lettering the spreads' marks, the lenders' among them, is
v0.3's. The twin comes for every slip but `lend` and `get`, which bring one only the second time in the lesson or round
(section 1a.4, "Twins and the log").*

**Its shape.** The lesson's help, column-sized. The box turns pale yellow; 650 ms later the panel is Tallyheart's sand
with the top number as it stands drawn the quick way (a square for a hundred, a line for a ten, a dot for one), the
column she is on lit. Then steps, each a line in Tallyheart's balloon and a change in the sand: the slip named, any
spread (a line crossed out and ten new dots scratched beside it, two rows of five as the store's ten-frame; a square
crossed out and ten new lines), the take itself in hops (the old marks first, then the new ten's, as the store takes
them; the marks taken crossed and lit, the counter line growing "10 · 5" as the lesson's count does), and the digit,
written into the box. The column's marks are lettered as the sand draws each spread, as `'show'` letters them (the
zero's "10", then "9"): the help is the scaffold. This holds in `'hers'` too, as the exception to its rule (section 1):
every spread the sand draws has its lenders' gold values lettered with it, so a help at a turn that spread leaves the
later columns' marks in, and their decrements, worked in the sand, are not hers in that problem (its twin asks them); a
help draws only its own turn's spreads and letters no other lender. In `'hers'`, a help at a column that lent letters
that column's gold value with its first line (glowing, for `kept` and `zero`). Then "Got it!", at the top of the
keypad's place (as in a sitting), outlines the next column. The first line, which names the slip, stays above the steps
to the end, so a reader of eight can finish it (the Warrior Counts' rule); the stack is three balloons, the slip's line,
the counter in a balloon of its own (as the lesson's help puts it) and the step's line. Each step stays until its line
can be read (0.6 s and 0.38 s a word, 1.6 s at the least) or, Read to me on, has been said and 0.3 s more, at most twice
that long; a step that is only a number (a count back by ones) is 775 ms, the lesson's hop; a tap on the sand moves on
one step, never to the end.

**Naming her slip** (`E.takeSlip(plan, col, given, shown, taught)`, read in this order, with the one exception the
paragraph under the table gives; the first match names it):

| Slip | When | The first line (the 43 − 16, 503 − 278 or 811 − 356 column) | Then |
|---|---|---|---|
| `zero` | at a turn that chains across a zero, she typed bottom − top or 0 (0 at 503 − 278's ones; 3 or 0 at 702 − 345's); at a zero's own turn after it lent, she typed 10 − bottom (3 at 503 − 278's tens: the row it gave not taken off), the bottom itself (7: 0 − 7 read as 7) or 0 | "Three take away eight? Not enough loose, and no rows to spread." / at the tens: "Careful. That zero became ten rows, then gave one away. Nine rows now." | at the ones, the chain, one spread at a time: "So a square first: ten rows." "Now a row: ten more loose."; then the take. At the tens, the take |
| `flip` | her turn needed a spread from a digit that is not 0, and she typed bottom − top (3 for 3 − 6): the smaller from the bigger, the commonest slip; at the ones or the tens (6 for 735 − 391's tens, 3 − 9; 8 for 607 − 283's tens, 0 − 8); at a column that lent and needs its own spread, also bottom − top as written, after `kept` (4 for 811 − 356's tens, 5 − 1; 4 for 432 − 178's tens, 7 − 3): the smaller from the bigger with the one not taken off, never `fact`, so the corner's teen row never files it | "Careful: it's three take away six, the top take away the bottom. Only three loose. Not enough." / at the tens: "Careful: it's three take away nine, the top take away the bottom. Only three rows. Not enough." / a top of 0: "Careful: it's zero take away eight, the top take away the bottom. No rows. Not enough." ("No loose." at the ones: 640 − 218) | "Spread a row: ten more loose." / at the tens: "Spread a square: ten more rows." / a top of 0: "Spread a square: ten rows." ("Spread a row: ten loose."); the take |
| `nospread` | her turn needed a spread from a digit that is not 0, and she typed 0 ("not enough, so none"; 811 − 356's tens, which lent their one row), unless that 0 is `kept` (566 − 168's tens: 6 − 6, the one not taken off) | "Three take away six? Not enough loose. But we can spread a row." / at the tens: "No rows to take five from? But we can spread a square." | the spread; the take |
| `kept` | this column gave a row (or a square) to the right and she used its top as written (3 for 43 − 16's tens, 4 − 1; 3 for 503 − 278's hundreds, 5 − 2; 6 for 811 − 356's tens, 11 − 5; 1 for 500 − 467's blank hundreds, 5 − 4; 0 for 566 − 168's tens, 6 − 6, ahead of `nospread`; 5 for 110 − 61's tens, 11 − 6, where the written top's flip, 6 − 1, is 5 too) | "Careful. One row went to the loose. Three rows now." / hundreds: "Careful. One square became ten rows. Four squares now." (the struck digit and its gold one glow) | any spread the column still needs (811 − 356's tens: "No rows now.", so a square spreads); the take, from the top as it stands |
| `extra` | the tens or the hundreds (never the ones, which has no column on its right to give a row to: 2 at 475 − 132's ones is `fact`), when the column did not lend and needed no spread of its own, and she typed its top − 1 − bottom: a row taken when the loose had enough, the opposite of the flip (3 for 97 − 52's tens in chapter 13, where 9 − 5 = 4; 4 for 879 − 346's hundreds in chapter 15). Only once she has met that column's spread: at the tens once a step that spreads a row is taught (`ones2` on), at the hundreds once one that spreads a square is (`tens` on), by `taught`: in a lesson the steps of its chapter and the earlier ones, in a store round the steps she has learned. Before that the digit is `fact`, so no set or round says "no row went" before chapter 13 or "no square went" before chapter 15 (2 at 58 − 23's tens in chapter 12, 1 at 486 − 253's hundreds in chapter 13, and a store round's twin of 475 − 132 until `tens` is learned). Never a 0 where the bottom is empty or 0 (0 at 175 − 42's hundreds, 1 with nothing to take read as 0, is `fact`, as is 0 for 1 − 0) | "Careful. The loose had enough, so no row went. Seven rows still." / hundreds: "Careful. The rows had enough, so no square went. Four squares still." | the take |
| `fact` | anything else: a fact slipped (8 for 43 − 16's 13 − 6); at a chain's turn, any other digit (4 or 6 for 503 − 278's 13 − 8: she went across the zero and slipped on the teen fact); at a lent zero's turn, any other digit (1 or 8 for 9 − 7) | "Let's scratch it out." / with a spread of her own to make: "Three take away six: we spread a row, then take six." / at a chain's turn: "Across the zero: thirteen loose. Take away eight." (the sand starts with the chain already drawn) / at a lent zero: "Nine take away seven: let's scratch it out." | any spread the column still needs; the take |

A slip is named from what she typed and the plan alone; nothing asks her why. The order is the table's, with one
exception: `zero` first at a chain's turn and at a lent zero's, so a turn across a zero is never `flip` or `nospread`; at
a column that lent and needs its own spread, `flip` (bottom − top as it stands) first, then `kept`, then the written
top's `flip`, then `nospread`, so the one not taken off is `kept` even when it comes to 0, and where `kept` and the
written top's flip meet (bottom − top = 5) `kept` names it; `extra` after `kept`, only at the tens or the hundreds of a
column that did not lend, and only once its spread is taught (the kit's rule: a set's or a round's line never names a
spread she has not met, so no chapter carries an override). A turn with no spread of its own has `fact` (or `extra`
left of the ones), or `kept` or `zero` when its column lent. A turn whose spread she was shown or tapped has it in the
sand already and is never `flip`, `nospread` or a chain's `zero`: its help starts at the take. `extra` is the slip
chapter 17 exists to catch («¿Hay que desagrupar?», in English "Do we need to spread a row?", at the tens "a square?":
section 8's rule for the word); it can show only because a later column's line no longer says its top. Every case above
is in `check-v0.2.js` (33 of them, the designer's fourteen re-read under this order) and is copied into test 5, with
v0.3's four (`check-v0.3.js`: 2 at 475 − 132's ones `fact`; 6 at 735 − 391's tens, 8 at 607 − 283's tens and 8 at
640 − 218's ones `flip`), and the review's four (0 at 566 − 168's tens and 5 at 110 − 61's tens `kept`; 4 at
811 − 356's and 432 − 178's tens `flip`). Test 5 also plays chapters 12 to 15's sets through the runner for `extra`'s
rule, and test 12 every store round's lines for every number of steps learned.

**Every line has its tens form and its zero form.** A line written for the ones says rows and a square in place of
loose and a row when the turn is the tens' (`flip` above; "No rows to take five from? But we can spread a square."; the
`'show'` and `'tap'` lines), and a top of 0 says "No loose." or "No rows." where "Only zero loose" would stand, with "ten
loose" or "ten rows" for "ten more" (640 − 218's ones and 70 − 34's; 607 − 283's tens, a written zero, and 811 − 356's
or 815 − 69's, brought to zero by lending: `check-v0.3.js` lists the module's 17 turns at the tens where `flip` can be
named, 7 of them on a 0, and 4 at the ones on a 0). Test 13 fills every line at every such turn.

**The take**, the same in every help (and in `'show'`): a column whose top is ten or more after a spread is taken to ten,
then the rest: "Thirteen loose. Take away eight." "Take three: ten left." "Five more: five left." (a top of exactly ten:
one hop, "Take eight: two left."). A take of five or less from a top under ten is counted back by ones ("Seven, six,
five."); a take of six or more from a top under ten is one sweep and what is left ("Take seven: two left."). A teen
top's take goes from the old marks first, then from the spread's ten, the order the store's ten-frame shows. Then the
digit: "Five loose." ("One row." "Two squares." A middle zero: "No rows: zero.").

**Three helps, step by step** (each line one step; the counter line in brackets):
- *503 − 278, the ones, she typed 0* (`zero`): "Three take away eight? Not enough loose, and no rows to spread." → "So a
  square first: ten rows." (a square crossed, ten lines; "10" over the 0) → "Now a row: ten more loose." (a line
  crossed, ten dots in two rows of five; the 0's mark relettered "9") → "Thirteen loose. Take away eight." → "Take
  three: ten left." [10] → "Five more: five left." [10 · 5] → "Five loose." (5 in the box; the marks 4, 9, 13 lettered)
  → Got it! Seven steps, about 14 seconds. Had she typed 4 (13 − 8 off by one), the slip is `fact`: the sand opens with
  the chain drawn, "Across the zero: thirteen loose. Take away eight.", then the take; four steps.
- *43 − 16, the ones, she typed 3* (`flip`): "Careful: it's three take away six, the top take away the bottom. Only three
  loose. Not enough." → "Spread a row: ten more loose." → "Thirteen loose. Take away six." → "Take three: ten left." →
  "Three more: seven left." → "Seven loose." → Got it!
- *43 − 16, the tens, she typed 3* (`kept`): "Careful. One row went to the loose. Three rows now." → "Three rows take away
  one row." → "Two." → "Two rows." → Got it!

**Never a wall.** The help writes the column's digit; every column after it is hers. She always finishes the problem
herself, and nothing ever stops a lesson: every digit moves it on.

**The twin.** A problem with any column helped comes back as a **twin**: the same shape (section 3: which turns spread,
where the zeros are in the top, the bottom and the answer, the digits' count, a leading zero or not), new digits
(`E.takeTwin`, seeded by the lesson's `startedAt`, its `pos` and the requeue count), never the same top, never an answer
the lesson has had nor one its chapter has (`E.takeLesson` hands the runner the chapter's answers, its lessons' and its
stories', as `avoid`, so a story problem is asked once, in the story: section 3). It comes `E.REQUEUE_GAP` (two)
problems later, or as late as the lesson allows: next, when it was the last. No fillers are added (section 11: a take-away takes 25 to 40 seconds, so two fillers would add a minute to a
lesson's end; a twin's new digits already mean it never tests the last ten seconds). At most `E.MAX_REQUEUE` (two) a
problem, counted by lineage: a twin carries its original's key (`of: '<a>-<b>'` in the queue, `twin: '<a>-<b>'` on its
log entry), so a twin's twin counts against the first problem and `requeues` is keyed by it; a twin missed brings one
more, and that one's miss line is "And you finished it." A twin is introduced "One like it." (`twinIntro`); it is
`'hers'`, unless the problem it twins was `'show'`, then `'tap'`. A set may say `twins: false` (chapter 21's hearing,
before every Clan, may).

**Never green for the wrong reason.** For a `'hers'` problem, `E.takeTwin`, `E.takeWarm` and `E.takeRoundStart` draw
again when a spread turn's bottom − top equals its digit (the flip landing on the right digit, section 1). The shape
cannot rule it out, so it costs draws: about half a draw a twin on average (2.99 against 2.53 over the module).

A twin of 503 − 278 (seed 7): 405 − 227 = 178. Of 52 − 27: 57 − 28 = 29. Of 811 − 356: 911 − 168 = 743. Of
500 − 412: 700 − 623 = 77. Of 640 − 218: 570 − 134 = 436. Over the module's 63 problems, 1,000 twins each, with that
rule: the same kind and shape every time, no flip landing, 1.2 to 17.8 draws on average (410 − 136's shape the dearest),
186 at worst (of `E.TAKE_TRIES`, 400), never the fallback (the problem itself, asked again: the twin cannot fail).
Shapes with few members have few twins (70 − 34 has 175 different ones in 1,000), never none.

## 3. The problem kinds and their rules

**The plan** (`E.takePlan(a, b)`): the US decomposition, column by column, ones first, as the algorithm goes. At each
column's turn, if its top as it stands is below its bottom digit, it spreads from the next column; if that one is 0, the
one after spreads into it first (a square into ten rows), then it gives a row (so it ends at 9). Each column of the plan:
its top as written, its top at her turn, its bottom (or none), its digit, the spreads at its turn (from, to), whether its
turn chained across a zero, whether it gave to the right, what it ends as (the gold mark), and whether its answer digit
is a leading zero (blank). Checked against a − b for every top from 10 to 999 and every bottom below it with no more
digits: 498,465 problems, no mismatch, no turn with more than two spreads, every top at a turn 0 to 18.

**The kinds** (`E.takeKind(plan)`), by which turns spread:

| Kind | Rule | Example | Of the 498,465 |
|---|---|---|---|
| `none` | no spread | 254 − 131 = 123; 305 − 102 = 203 (a zero that needs nothing) | 164,340 |
| `ones` | spread a ten: only the ones' turn spreads, from a tens digit that is not 0 | 52 − 27 = 25; 640 − 218 = 422 (a top with no loose) | 111,375 |
| `tens` | spread a hundred: only the tens' turn spreads | 735 − 391 = 344 | 111,375 |
| `both` | both turns spread | 432 − 178 = 254; 811 − 356 = 455 (leaves a zero) | 91,125 |
| `zero` | across one zero: the ones' turn chains, the top's ones not 0 | 503 − 278 = 225 | 16,200 |
| `zeros` | across two zeros: the ones' turn chains, the top's ones 0 (a top of x00) | 500 − 412 = 88 | 4,050 |

"Mixed" is not a kind: it is a lesson whose problems are of different kinds. A two-digit top is `none` or `ones`.

**The flags** (`E.takeFlags(plan)`), which the chapters' rules read: `leavesZero` (a column brought to 0 by lending
to its right then needs a spread of its own: 811 − 356, 513 − 248, 710 − 254, 815 − 69, 912 − 468, 410 − 136);
`toZero` (a column brought to 0 by lending, whatever follows: also 512 − 107); `idleZero` (a top zero no spread goes
through: 305 − 102); `noHundreds` (a three-digit top whose answer has no hundreds: 731 − 696 = 35, 382 − 345
= 37, 500 − 412 = 88, 503 − 478 = 25, 497 − 427 = 70); `noLoose` (a top ending in 0: 70 − 34, 640 − 218, every x00).

**How a set is written** (in a chapter's `counts`, beside its Counts sets; `E.countsSet` finds it as any set):

```js
counts: {
  'ch12-warm': { teacher: 'tallyheart', warmHard: { table: 'all', at: [0, 1] },    // the Counts warm-up (section 4)
    facts: [{ a: 6, b: 7, table: 6 }, { a: 8, b: 4, table: 4 }, { a: 3, b: 9, table: 3 }], … },
  'ch12-take': {
    op: '-', teach: 'none', teacher: 'tallyheart', picture: { kind: 'store' },
    facts: [
      { a: 254, b: 131, regroup: 'show', prompt: 'The store holds two hundred fifty-four. The Clan eats one hundred thirty-one.',
        right: ['One square, two rows, three loose left.'] },   // 12 words: the guard's most
      [58, 23], [76, 42], [475, 132], [368, 145]
    ],
    praise: ['Yes!', '', 'That’s it.', '', 'Every column.', ''],
    done: 'Take-aways tell you HOW MANY. Even warriors learn new tricks.'
  },
  'ch12-store': { op: '-', picture: { kind: 'store' }, done: '',
    facts: [{ a: 175, b: 42, prompt: [{ who: 'glintstar', text: '…' }] }] }
}
```

The frame is a plain Counts frame: `counts: { set: 'ch12-take', next: 'f070' }` (the Counts warm-up's frame takes
`intro: false`, section 4).

| Set key (`op: '-'` sets) | What it is |
|---|---|
| `op: '-'` | a take set; required. It has no `table`, never `fillFrom`, `fillOrder`, `warmHard`, `light` or `help` |
| `teach` | the step this set teaches (one of `E.TAKE_STEPS`: `none`, `ones2`, `ones`, `tens`, `both`, `mixed`, `zero`, `zeros`); a finished set with one teaches it (Count the store reads it: section 5). Its new-step problems are checked against it |
| `picture` | `{ kind: 'store' }` (prey: squares, rows, loose; the default) or `{ kind: 'marks' }` (the quick picture on sand); a fact may carry its own |
| `regroup` | the default for its problems: `'hers'` unless it says `'show'` or `'tap'` |
| `warm` | `true`: a two-digit spread is asked first, made for this lesson (below) |
| `twins` | `false`: a helped problem does not come back |
| `teacher`, `praise`, `done` | as a Counts set's; `done: ''` goes straight on. Praise may have blank entries between lines |
| `lines` | any of `E.TAKE_LINES`' keys (section 8), this set's own words in place of the kit's; tokens as there |
| `marks` | (decision 57) the marks page's lines, `{ lines: [balloons], one: [balloons], above: [balloons] }`, each balloon `{ who, text }` of 12 words or fewer, no Spanish: the lines in order, then each style's answer line; with none, the kit's own (section 1a.2). Chapter 13's `ch13-take` has it |

| Fact key | What it is |
|---|---|
| `[a, b]` or `{ a, b }` | the problem: whole numbers, 10 ≤ a ≤ 999, 1 ≤ b < a, b with no more digits than a |
| `regroup` | this problem's `'show'`, `'tap'` or `'hers'` |
| `prompt` | its question, as a Counts fact's (a line, or balloons and captions); each balloon at most 12 words (the first column's line joins the last one when it is Tallyheart's). Without one, nothing is lettered past the column's line, and "{A} take away {B}." is said in words (section 1) |
| `right` | balloons after it is right in every column first time, in place of praise (its picture stays, Next to go on) |
| `picture` | its own `{ kind: 'store' }` or `{ kind: 'marks' }` |

**The guards** (`E.checkTakes(story, stories)`, run by `E.checkStory` and the chapters' story tests), each a rule code
can check:
- **a take fact**: in range as above (whole numbers, no negative answer, no answer of 0, no four-digit top, no leading
  zero in a number, a bottom with no more digits than the top), and an answer at most one digit shorter than its top
  (503 − 498 = 5, with two blank boxes, is refused); `regroup` one of the three; `picture.kind` `'store'` or `'marks'`;
  no `table` (so `E.countSets`, which reads a set's first fact's `table`, never files a take set as a Count); each
  balloon of its prompt at most 12 words (the first column's line joins the last one when it is Tallyheart's), so the
  joined balloon stays at three lines or fewer and no balloon gets more room than the joined one;
- **a take set**: none of the multiplication keys above; `teach`, when present, one of `E.TAKE_STEPS`; `twins` and `warm`
  booleans; `lines` only `E.TAKE_LINES`' keys; `marks`, when present, as the table above says; no Counts set's
  `fillFrom` names it;
- **a set's step**: with `teach` other than `none` or `mixed`, exactly three problems whose `E.takeStepOf` is `teach`,
  every other one an earlier step in `E.TAKE_STEPS`' order, and from chapter 13 at least one of kind `none`;
  `teach: 'none'`, every problem of kind `none`; `teach: 'mixed'`, four kinds or more, one of them `none`, one problem
  with no hundreds left (`noHundreds`) and one that leaves a zero (`leavesZero`); a set with no `teach` (chapter 20's
  lesson, a story's set), every problem's step one that a `teach` set of this chapter or an earlier one teaches;
- **a chapter**: no answer twice, across all its take sets and stories (a story problem that is also a lesson problem is
  asked once, in the story); no `noHundreds` problem before the chapter that teaches `mixed`; the answers a `warm`
  lesson's made warm-up must avoid are the chapter's, and so are a twin's (section 2).

**The twin's shape** (`E.takeShape(plan)`), kept exactly: the digits' count of the top and of the bottom; for each
column, whether its top is 0, whether its bottom is 0 or absent, the spreads at its turn and whether they chain, whether
it was brought to 0 by lending, whether its answer digit is 0, and whether it is blank; and the flags. `E.takeTwin(plan,
seed, avoid, mode)` builds one column by column, ones first: each top digit drawn to the zero pattern; each bottom digit
from the range that makes the turn spread or not as the original's did (a 0 answer digit or a blank: the bottom equals
the top as it stands); the spreads applied as drawn; the whole checked against the shape; a twin whose top is the
original's, or whose answer is the original's or in `avoid`, drawn again, and, for `mode` `'hers'`, one whose flip lands
on a right digit (section 2). At most 400 draws, then the original itself.

**The made warm-up** (`warm: true`, chapters 14, 15, 16, 17 and 20): one two-digit spread (a twin of 43 − 16, the `ones2`
template, `E.takeWarm(seed, avoid)`, its flip never landing), seeded by the lesson's start, `regroup: 'hers'`, introduced
"One to warm up your whiskers." It is decision 53's two-digit warm-up, kept warm; in chapters 18 and 19 the two-step's
take-away is the warm-up (`warm` off), and chapters 12 and 13 have none. It is logged as a first ask (`warm: true` on its
entry, never `twin`), so a helped warm-up makes `ones2` a hard step.

**The ten chapters' steps** (`docs/module-2.md`'s table, the lesson problems three of the new step then two older; story
uses are their own sets; every line checked by `check.js`, the rows v0.2 changed by `check-v0.2.js`, and the table
against module-2 v0.4's, row by row, by `check-v0.3.js`):

| Ch | `teach` | Lesson (`show`, `tap`, then `hers`; older) | Kinds (and flags) | Story | Warm |
|---|---|---|---|---|---|
| 12 | `none`: the column, two digits then three | 254 − 131 worked (`show`, a separate problem, the brief's); 58 − 23, 76 − 42, 475 − 132, 368 − 145 (589 − 267 only if play is fast) | all `none` | 175 − 42 = 133 | – |
| 13 | `ones2`: spread a row, two digits | 43 − 16 (`show`), 70 − 34 (`tap`), 85 − 39; 97 − 52, 486 − 253 | `ones` ×3 (70: `noLoose`); `none` ×2 | 52 − 27 = 25 | – |
| 14 | `ones`: three digits | 352 − 127 (`show`), 640 − 218 (`tap`), 462 − 135; 768 − 315, 586 − 231 | `ones` ×3 (640: `noLoose`); `none` ×2 | 473 − 245 = 228 | yes |
| 15 | `tens`: spread a square | 526 − 254 (`show`), 418 − 162 (`tap`), 607 − 283; 879 − 346, 563 − 128 | `tens` ×3 (607: a written zero spreads a square, 0 − 8 at the tens); `none`, `ones` | 735 − 391 = 344 | yes |
| 16 | `both` | 432 − 178 (`show`), 523 − 247 (`tap`), 645 − 278; 798 − 465, 917 − 653 | `both` ×3; `none`, `tens` | 811 − 356 = 455 (`leavesZero`); 624 − 357 = 267 | yes |
| 17 | `mixed`: do we need to spread? no hundreds left | 764 − 321, 371 − 145, 614 − 253, 731 − 696, 513 − 248, all `hers`, in this order | `none` (it opens on a "no"), `ones`, `tens`, `both` (`noHundreds`, fourth), `both` (`leavesZero`) | 382 − 345 = 37 (`noHundreds`); 6 × 8 = 48, then 48 − 19 = 29 | yes |
| 18 | `zero`: across a zero | 702 − 345 (`show`), 604 − 137 (`tap`), 801 − 263; 305 − 102, 710 − 254 | `zero` ×3; `none` (`idleZero`), `both` (`leavesZero`) | 503 − 278 = 225; 8 × 9 = 72, then 72 − 18 = 54 (the warm-up) | – |
| 19 | `zeros`: two zeros | 400 − 156 (`show`), 600 − 248 (`tap`), 300 − 158; 857 − 431, 815 − 69 | `zeros` ×3; `none`, `both` (`leavesZero`; a two-digit bottom under a three-digit top, its hundreds "Nothing to take" after lending: 7, where `kept` types 8) | 500 − 412 = 88 (`noHundreds`); 7 × 7 = 49, then 88 − 49 = 39 (the warm-up); 300 − 126 = 174 (optional) | – |
| 20 | none new: mixed with zeros, "about" | 503 − 478, 700 − 349, 912 − 468; 410 − 136, 786 − 452, all `hers` | `zero` (`noHundreds`), `zeros`, `both`; `both` (`leavesZero`), `none`; no `teach` (nothing new) | 497 − 427 = 70 (`none`, `noHundreds`); "about": said, or a typed story question whose answer is the whole number 100 (as the hearing's typed questions are), never a take set: estimating is rounding in her head, not the column | yes |
| 21 | the finale | the story's | – | 700 − 463 = 237, 500 − 382 = 118, 500 − 467 = 33 (all `zeros`; the last `noHundreds`) | – |

The scripts assert module-2's rules over this table: each answer as stated; no answer twice in a chapter (the spare 589 −
267 included); the new step's three of its kind (by `E.takeStepOf`), the older two earlier, at least one with no spread;
chapters 17 and 20 of at least four kinds, one with no spread; no `noHundreds` before chapter 17; from chapter 16 a
spread that leaves a zero in the chapter, from chapter 17 in its lesson; no story problem also a lesson problem. All
pass, in `check.js` for v0.1's table and in `check-v0.2.js` and `check-v0.3.js` for this one. Module-2 v0.4's table
matches it; three rows differed from v0.3's: chapter 15's third problem is 607 − 283 = 324 (for 649 − 275), so a written
zero spreads a square before chapter 18 asks both halves of the chain at once (0 − N = N and 0 − N = 0, the two
best-documented subtraction bugs, live there: `tens`, no flags, its flip 8 not the right 2, 324 new in the chapter);
chapter 17's lesson is reordered to open on a problem that needs no spread, the blank hundreds fourth; chapter 19's
second older problem is 815 − 69 = 746 (for 815 − 469), a two-digit bottom under a three-digit top with a spread, still
`both` and `leavesZero`, its flip landing nowhere.

**The time it takes.** A take-away takes 25 to 40 seconds (the study's estimate, to be measured as chapter 12 is played),
a help adds about 10 to 15, a twin 25 to 40. Counted at those figures with what a chapter really holds (three Counts,
the made warm-up take in chapters 14 to 17 and 20, the `'show'` problem's extra lines, five lesson problems, the story's
one or two, and the help and twin to expect), a chapter's maths runs about 4½ to 7 minutes (`check-v0.2.js`: 22 to 35%
of a 20-minute chapter), and a chapter with a Tricky Counts run about a minute more. That is past decision 10's 20%;
decision 56 (Aron, 2026-11-07) sets module 2's share at about a quarter of a chapter as played, never past a third, with a
chapter's Tricky Counts run at five Counts, not eight (chapter 14 also loses its fifth lesson problem). So
the kit fixes the order lessons are cut in play, rather than each chapter's brief deciding it, and no cut breaks the
rules above (`check-v0.3.js` tries every cut):
1. one lesson problem the rules can spare, never one of the new step's three: chapter 13's 486 − 253, 14's 586 − 231,
   15's 563 − 128, 16's 917 − 653 and 20's 912 − 468 (chapter 20 teaches nothing new; 410 − 136 still leaves a zero).
   Chapters 17, 18 and 19 have none to spare: in 17 each problem is one of the four kinds, the blank hundreds or the zero
   left behind, and in 18 and 19 one older problem is the lesson's only one with no spread, the other its only one that
   leaves a zero (v0.2's rule, the second older problem, took 18's 710 − 254 and 19's 815 − 69, and 20's 786 − 452, its
   only problem with no spread);
2. then, in a chapter with a Tricky Counts run (14, 17 and 20), the made warm-up;
3. then the story's optional problem (chapter 19's 300 − 126);
4. then the Counts warm-up's third fact, leaving her two hardest (module-2's "two or three Counts"): chapter 18's only
   cut, and the next for 17 (after its made warm-up) and 19 (after 300 − 126).

Chapter 12's own trim (368 − 145 goes; module-2) is the first rule applied to its set, which has four problems of
`none` and nothing older.

**The time with decision 57's moves** (v0.4: `~/potomac-crossing-work/regroup/design.md`, section 6, run by
`~/potomac-crossing-work/regroup/editor/time-v0.4.js`; output `time-v0.4.txt`, and `time-v0.4-parts.txt` at the parts'
rate, in the same folder). A spread made as moves takes longer than one done in her head; the tables and the trims
below say how much, and the call after them how decision 56's share is read with them.

**Inputs per problem** (run; "moves" = taps, numbers and answers; "keys" = taps on the page):

| Kind | e.g. | v0.3 `'hers'` | v0.4 `'above'` | v0.4 `'one'` |
|---|---|---|---|---|
| none, two digits | 97 − 52 | 2 answers, 4 keys | 2 moves, 4 keys | 2, 4 |
| none, three digits | 486 − 253 | 3, 6 | 3, 6 | 3, 6 |
| a row, two digits (`ones2`) | 43 − 16 | 2, 4 | 5 (1 tap, 2 numbers, 2 answers), 10 | 5, 9 |
| a row or a square, three digits (`ones`, `tens`) | 352 − 127 | 3, 6 | 6, 12 | 6, 11 |
| both, across a zero, across two zeros | 432 − 178, 702 − 345, 400 − 156 | 3, 6 | 9 (2 taps, 4 numbers, 3 answers), 18 | 9, 16 |

**The rates.** The kit's (chapter 14's brief, `check.txt` section 9): a Count 12–15 s, a take-away 25–40 s, the `'show'`
problem's lines 20 s, the `'tap'` problem's 10 s, one take help 10–15 s and its twin 25–40 s; a run's Count help 10–15 s
and its comeback 12–15 s. Added by v0.4, estimates to be replaced by the log's move times after the first lessons:
- a link in `'hers'` **+6 to +9 s** (`'above'`; `'one'` about a second less). The sum of its parts is +3 to +6 (a tap
  about 2 s, a lend 2–3, a get 2–3, less the 2–3 s of the spread in her head that the kit's 25–40 already held); the
  table keeps +6 to +9 **on purpose**, for a first-weeks pace (finding the small box, typing a number that is not an
  answer, a mechanic new to her), so the top errs long. The animation locks the first draft counted in it are gone
  (section 1a.3, "Timing"), and the table does not credit that either. `time-v0.4-parts.txt` gives every figure at +3 to +6.
- a `'tap'` link: its numbers +4 to +6 s, its two asks 5 s (none for a link she has made on her own: section 1a.1);
- a `'show'` link: one more line, 5 s, and her two numbers typed, +5 to +10 s;
- the twin to expect, a spread's (one link in chapters 13 to 15 and 17, two from 16), its links at the `'hers'` rate;
- chapter 13's marks page once, 20 to 30 s (four balloons, the glow, the pick, the answer line), counted as maths in the
  conservative figure and as story by the brief's measure (chapters 12 to 14 counted only the pages she types on);
- the help to expect, 10–15 s, unchanged (a move-help is 4 to 6 s, shorter than the sand's, so this errs long).

**Every chapter, 13 to 20** (`~/potomac-crossing-work/regroup/editor/time-v0.4.txt`; the chapter = the story's own
minutes outside the maths, from each story's *For us* for 13 and 14, 16 minutes for the later ones as theirs, plus the
maths; the share at the low end, the middle and the top, `'above'`; `'one'` about 0.1 minute less):

| ch | v0.3 low / middle / top | v0.4 low / middle / top | v0.4 top after the kit's cuts, in its order | after the trims beyond them (below) | top with a second help and twin and one `ahead`, after the kit's cuts |
|---|---|---|---|---|---|
| 13 | 22.3 / 26.1 / 29.5% | 25.8 / 29.9 / **33.5%** (31.5% by the brief's measure) | 31.6% (486 − 253) | – | 34.9% |
| 14 | 24.9 / 28.5 / 31.8% | 26.7 / 30.6 / **34.0%** | 33.3% (the third Count) | – | 36.4%; with a warm-up miss 35.3% |
| 15 | 23.1 / 27.1 / 30.7% | 26.0 / 30.3 / 34.1% | 31.0% (563 − 128, the third Count) | 28.5% | 34.3% |
| 16 | 25.3 / 29.5 / 33.3% | 30.1 / 34.8 / 38.9% | 36.3% (917 − 653, the third Count) | 31.5% | 39.5% |
| 17 | 27.5 / 32.0 / 36.0% | 31.0 / 35.8 / 40.0% | 37.5% (the made warm-up, the third Count) | 35.4% | 40.5% |
| 18 | 23.1 / 27.1 / 30.7% | 28.4 / 32.8 / 36.8% | 36.1% (the third Count) | 34.0% | 39.3% |
| 19 | 23.1 / 27.1 / 30.7% | 27.8 / 32.3 / 36.3% | 35.7% (the third Count) | 33.5% | 38.9% |
| 20 | 27.5 / 31.8 / 35.6% | 30.9 / 35.5 / 39.6% | 34.6% (912 − 468, the made warm-up, the third Count) | – | 37.9% |

At the parts' rate (+3 to +6 a link) every v0.4 top is 0.4 to 1.3 points lower: chapter 14 32.9% after its cut, 18
35.0%, 19 34.5%, 17 36.2%, 20 33.5% (`time-v0.4-parts.txt`).

**Against decision 56** (about a quarter, never past a third). Decision 57's moves cost about 3 to 4 points of the middle
in chapters 13 to 15 (+3.8, +2.1, +3.2) and about 4 to 6 from chapter 16 on, where most spread problems have two links;
the middles drift from about a quarter to 30% (13 to 15) and 33 to 36% (16 to 20). Chapter by chapter:
- **13** stays inside a third by the brief's measure (31.5% at the top), and at 31.6% counting the marks page as maths
  once the kit's own first cut, 486 − 253, is played; the spec already holds that cut "if play drags", so no new trim.
  With a second help and twin and an `ahead`, 34.9% even after it: decision 56 says chapter 13 "stays as written", so that
  case is Aron's (section 12, question 3).
- **14** is at a third after its one cut (33.3%), 32.9% at the parts' rate. Its spec's item 15 case, a warm-up miss, is
  35.3% after the cut, and nothing is left in the kit's order to cut there (768 − 315 is its only problem with no spread,
  and the rules keep it): only Aron can close it (section 12, question 3).
- **15** is inside after the kit's cuts (31.0%).
- **16** needs two trims beyond the kit's order: its made warm-up (34.2%) and the story's second take-away, 624 − 357
  (31.5%).
- **17 to 20** stay over even after the trims named: 17 at 35.4% (its story's 48 − 19 cut), 18 at 34.0% (72 − 18), 19 at
  33.5% (88 − 49), 20 at 34.6% (nothing left in the kit's order). Chapters 17 and 20 were already past a third in v0.3
  before their cuts. These chapters are not written yet; their briefs measure their own stories (17 and 19 are budgeted at
  22 minutes in module-2, which lowers their shares), and chapter 13's first week of logged move times replaces these
  rates before chapter 15's brief is written.

**Trims**, none of them a rule the chapters' tables carry, never one of the new step's three take-aways:
1. The kit's cut order, unchanged, applied as played (decision 56's own method).
2. Built in: the next box opens at once, and the answer box is ringed at once after the last get (v0.3: 0.9 s after the
   last spread): about 1.6 s a link of locked animation gone, about 18 s a chapter in 18 and 19.
3. Built in: a `'tap'` problem's asks dropped for a link she has made on her own (section 1a.1): about 5 s a link (14's
   640 − 218, 16's 523 − 247, 19's 600 − 248), already in the table.
4. Built in: no twin for a keying slip (`lend`, `get`) unless it repeats (section 1a.4).
5. Beyond the kit's order, for the later chapters' briefs (Aron's: section 12, question 3): 15's and 16's made warm-up;
   the story's second take-away in 16 (624 − 357), 17 (48 − 19), 18 (72 − 18) and 19 (88 − 49).
6. The rates are estimates. The log now times every move (`moves`' ms) and counts slips per judged input (each slip has
   its move), so the first week of chapter 13 gives real figures; chapter 14's budget is measured again from them before
   it ships, and chapters 15 to 20's briefs use them.

**A store round** (five problems, a help and a twin): v0.3 2.7–4.3 minutes; v0.4 3.1–5.0 (rows), 3.3–5.5 (a square),
3.4–5.6 (zeros learned); `'one'` about 0.1 less. Not chapter time.

**The call on decision 56 with moves** (the orchestrator's, 2026-11-09, under decision 46; Aron's question, section 12,
question 3, stands): decision 56's third binds the plain path at the middle-to-slow rates; a reading with a miss and its
help may run a little over (chapter 13 with a second help and twin, 34.9%; chapter 14 with a warm-up miss, 35.3%); the
move times are re-measured from her log after she plays chapter 13, and chapter 14's budget (its spec's item 15) is
measured again from them before it ships.

## 4. The record

**Never in `counts`.** Take-away answers go into their own log, `cat.takes.log`, never `cat.counts`. Everything that reads
`counts` assumes a pair to 10 × 10 whose answer is a × b, so a take there would be filed under a "278s" Count, judged
hard or easy by the multiplication rule, and drawn in the grown-ups' tables. Kept out of: `E.hardFacts` and
`E.warriorHard` (one rule, `hardRule`), `E.firstTry` (a `when`), `E.fillPool`, `E.siblingAsked`, `readFacts` and
`E.readFirst`, `E.factTable`, `E.tableOf`, `E.factTables` (the corner's per-Count tables), `E.hollowStart` (its hard
three), `C.summary` of a Counts lesson, the Warrior Counts' corner ("a slip?" reads `counts` by time) and `E.LOG_CAP`'s
count. Nothing in the kit writes to `counts`; the tests prove each of these reads the same before and after a take
lesson (section 9).

**The log entry**, one per problem, written when its last column is in (so a problem left partway is not an answer yet,
as a typed but un-OK'd Count is not):

`{ set, a, b, answer, given, correct, helped, slips: [{ col, given, slip }], ms, cols: [ms…], at, kind, digits, regroup,
twin?, warm?, worked?, round? }`

`answer` is a − b; `given` her first digit in each column, as she typed them, left to right (a blank column's '0' or '',
OK on the empty box, both right); `correct` true when every column was right first time; `helped` when any was helped;
`ms` her time on the problem, the sum of `cols` (each column's clock starts again once its line has been said, or would
have been read, and never while she is typing); `kind` `E.takeKind`; `digits` the top's; `regroup` as asked; `twin` only
on a requeued twin, its original's key (`'503-278'`); `warm` and `worked` (a `'show'` problem) only when true; `round`
the store round's number on a round's entries. A store round's problems and the made warm-up are first asks: twins of
templates, built fresh, never `twin`.

**The log entry with moves** (v0.3's, plus, **only on a problem with a spread**, so chapter 12's entries are unchanged;
as built, also on one with no spread where she made a move, an `extra` touch, which keeps its `'t'` and `'l'` beside
its slip; `ahead` and `nudges` whenever they happened, and an undo makes a problem with no spread not `correct`):
`style`; `moves: [[col, code, given, ms]]`, always four elements, one a move she made, `col` the column whose turn it
was (as for slips), `code` `'t'` (a touch: `given` the column tapped), `'u'` (an undone touch), `'l'` (a lend: her
number), `'g'` (a get: her number, 13 or 1), `given` `null` when there is none (43 − 16: `[[0, 't', 1, 1800], [0, 'l',
3, 2300], [0, 'g', 13, 2600]]`, about 20 to 40 characters a move); `ahead: [col]` and `nudges: n` when they happened;
each slip's `move`. `given` (her answers, left to right), `cols` (each column's time: the sum of her move times and its
answer's, so animations and a move-help's reading time are left out), `correct`, `helped`, `kind`, `regroup`, `twin`,
`warm`, `worked`, `round` as v0.3. At the cap (500), the moves add about 60k characters a cat: well inside the quota
v0.3 counted (1.4M of 2.62M for four cats at both caps).

**The save with moves.** Still version 2, `E.SAVE_VERSION` unchanged. One new optional field, `cat.takes.style` (`'above'` |
`'one'`), absent until she picks (`E.blankCat` unchanged). `normTakes` keeps it when it is one of the two, else drops it.
**A v25 save** migrates deep-equal (no `style`). **A v25 take state in the slot** passes `okTakeState` (the new keys are
optional; when present: `style` one of two, `move` a whole number within the column's moves, `moveMs` a list, a queue
item's `moveStyle` only `'above'` or `'one'`) and resumes at its column's decide; a v25 `'tap'` state with `tapped` k
resumes with k links done (`move` = 3k); a column a v25 state finished is lettered from the plan, as v0.3 lettered it.

**Her hard steps** (`E.hardTakes(cat)`): the steps (`E.takeStepOf(plan)`: `ones2` for a two-digit spread; `zero` and
`zeros` keep their kind, with or without hundreds left; `mixed` only for a problem with no hundreds left of kind `none`,
`ones`, `tens` or `both`; else its kind) whose most recent first ask (not a twin, not `worked`, not `'tap'`: she was told
to spread) was helped, the most recent first. So a slip across two zeros on 500 − 412 marks `zeros`, not `mixed`, and the
next round asks a zeros twin, not one of 382 − 345. Speed never makes a take-away hard: 25 to 40 seconds is the work,
not a slip. A hard step answered right in every column leaves the list by itself (the last ask decides), as a hard fact
does.

**The warm-up, across both strands.** A chapter's lesson warms up both: a Counts frame of three (her hardest facts) and,
from chapter 14, one made two-digit take. The Counts warm-up reads only `counts` (`E.warriorHard`); the take warm-up is
made (section 3) and never reads `counts`; Count the store reads only `takes`. Neither strand reads the other's log. The
Counts warm-up is the kit's one change to the multiplication side (`E.lessonFacts`, with the guard `warmHard.table === 'all'`):
its `at` may be a list, `[0, 1]`: her hardest fact over the 54 pairs other than 10 × 10 at position 0, her next hardest
at 1 (each marked `hard`, so a right one earns the `remembered` line, and given its anchor Count as `table`,
`E.warriorAnchor`); with one hard fact, position 1 keeps the set's own (write it as one of the 21 pairs of 3, 4, 6, 7, 8
and 9); with none, the set's facts as written; a set fact that is the same pair as a hard pick gives way to the set's
`alt`. A `table` alone does not picture it: a chapter lesson asks every question through `E.questionDef`, which returns
the set itself unless the question has `from`, so 7 × 8 would read "Seven cats. How many tails?" and draw the generic
picture. So `E.questionDef` changes, behind the same guard (section 8): for a set with `warmHard.table === 'all'` and a
question whose numeric `table` differs from the set's, it returns the set with `E.warriorAsk`'s keys (`W_ASK_KEYS`: the
picture, thing and things, unit and units, the help's openings) copied from `E.hollowDef(stories, q.table)`, the set's
own lines kept. 7 × 8 then reads "Seven spiders. How many legs?", is drawn as spiders and helped in the 8s' way; the
set's written facts (`{ a: 6, b: 7, table: 6 }`) are asked the same way. The set carries `ground: 'sand'`, as
`E.warriorDef` does. `runLesson` is untouched. The warm-up's frame takes `counts: { intro: false }` (chapter 5's), so her
hardest, asked first, appears with the engine's own words alone and is timed on itself (no line is said over it, so
`E.readFirst` counts none of the set's facts as read first). Her Warrior Counts misses lead chapter 12, unless the
Hollow has cleared them since.

**A waiting Warrior Counts re-sit.** A sitting again after the pass can be waiting when she does take-aways. A take-away
answer sets it aside exactly as any lesson answer does (`aside: 'practice'`), so the existing warning stays one rule:
`warriorStale` and `lastAnswerAt` read `cat.takes.log`'s `at` beside `counts` (only ever for a cat with `warrior` data;
with no `takes` they read what they read now). The warnings follow: a take lesson begun while such a sitting waits opens
with the waiting line over its first problem (startChapterLesson's `wWait`, passed to the take page as to a lesson); the
Hollow's shelf says it in its greeting's place; a Count the store round picked up says it over its next problem. A digit
typed but its problem unfinished sets nothing aside, as a problem is the answer.

**The log's cap.** `E.TAKE_LOG_CAP` 500 entries, the oldest first out: some 90 store rounds after the module. Four cats at
both caps then come to about 1.4M characters, about half of WebKit's localStorage quota (2.62M characters once a save
holds a curly quote), which Potion Lab shares on ahmadia.github.io. The grown-ups' table then reads only the log, and its
heading says "(her last 500)". What reads it for play (`E.hardTakes`) reads each step's latest ask.

## 5. The Training Hollow: Count the store

**When.** Once she has finished a take set with `teach` (`E.storeOpen`: chapter 12's lesson), so chapters 12 and 13's
lessons have practice at once (decision 10; module-2's call 22). Before that the Hollow is exactly as it is.

**The shelf.** Ten Counts and My nest already fill a 1080 × 720 screen (the polish release's and chapter 10's blocks in
`index.html`), so the Hollow's opening page becomes a shelf once the store is open (module-2's "Between chapters"):
- Tallyheart: "Count the store, or one Count at a time? A full round earns a treasure for your nest." (after a round,
  "Another round? I've got all evening."; while a Warrior Counts sitting waits, its waiting line in this place, as now);
- **Count the store** (big, its icon the quick picture's three marks), **One Count at a time** (big), My nest. Chapter 14
  adds **Tricky Counts** between them; the kit leaves its place.
- **My marks** (decision 57), a normal `.btn` beside My nest once `ones2` is learned or a style is set: it opens the
  marks page in the Hollow (`go('hollow', { marks: true })`; section 1a.2, "After that: the shelf").
- One Count at a time opens the Counts page as it is today, word for word (its greeting, glow line, tricky paws, the ten
  Counts, My nest); its ‹ goes back to the shelf (`onBack`), not to Camp. A module-1 round's "Another round" lands on the
  shelf, as `hollowReward`'s pinned `go('hollow', { from: 'hub', reward: true })` requires (section 8 names the pins).

**A round** (`E.takeRoundStart(cat, stories, now)`): five problems, each a twin of a template (`E.TAKE_TEMPLATES`, from the
chapters' own lessons, with two that only the store asks: 352 − 28 and 403 − 57, a two-digit bottom under a three-digit
top whose hundreds has nothing to take, after lending in 403 − 57's case), seeded by the round's number and its place,
every answer different:
1. an easy one: a twin of a `none` template (58 − 23 or 475 − 132);
2. her hardest step (`E.hardTakes`, among the steps she has learned), else the newest step she has learned;
3. her next hardest, else an older step that spreads (the newest when there is none);
4. the newest step;
5. an older step that spreads (the newest when there is none).

An older step is one learned before the newest, `none` apart: place 1 is the round's easy one, so a round has one
problem with no spread unless `none` is one of her hard steps (with `none` and `ones2` learned and no hard step, a round
is one `none` and four `ones2`).

| Step | Templates (each twin keeps its shape) |
|---|---|
| `none` | 58 − 23, 475 − 132 |
| `ones2` | 43 − 16, 70 − 34 |
| `ones` | 352 − 127, 640 − 218, 352 − 28 (a two-digit bottom: its hundreds "Nothing to take") |
| `tens` | 526 − 254, 607 − 283 (a written zero spreads a square) |
| `both` | 432 − 178, 811 − 356 |
| `mixed` | 382 − 345, 731 − 696 (no hundreds left) |
| `zero` | 702 − 345, 403 − 57 (a two-digit bottom: its hundreds lent, "Nothing to take", 3 where `kept` types 4) |
| `zeros` | 400 − 156, 500 − 412 |

Each template's `E.takeStepOf` is its row (`check-v0.2.js`; once chapters 12 to 21 land, test 12 checks each template
against its step's chapter: a problem of that chapter's lesson, or for the store's own two a step that chapter teaches,
so the table cannot drift from the lessons). Every problem `'hers'` (practice: the help catches what slips), never with
a flip that lands (section 2). Simulated for every number of steps learned, 500 rounds each: five different answers, the
first with no spread, no flip landing, no answer without hundreds before `mixed`, never a fallback. Round 1 once the
zeros are learned, as built (test 12 pins it): 53 − 32, 400 − 317, 517 − 288, 900 − 886, 365 − 184. A round's state
carries the steps she has learned (`taught`), so its tens never say "no row went" before `ones2` is learned nor its
hundreds "no square went" before `tens` (section 2's `extra`): the kit's rule, so no chapter carries an override.

Its set (`E.takeRoundDef`): id `store`, `op: '-'`, Tallyheart, the store picture, the kit's praise, `done` "The whole
store, counted! That deserves a treasure for your nest."; introduced "Five from the store. Ready? Here we go."
Chispapaw joins its opening page and its lines in chapter 12 (her art and Spanish are chapter 12's); the kit draws
Tallyheart and the player, and leaves a cast slot for her. A helped problem's twin comes back within the round, as in a
lesson. A round's entries carry `round: n` and are first asks, so a round right in every column takes a step off her
hard list. A round takes about three to five and a half minutes (with moves; v0.3's two and a half without).

**With moves** (decision 57): rounds keep v0.3's five templates' twins, all `'hers'`, now with moves, in her style
(`style: E.takeStyle(cat)`), `taught` the steps she has learned, so a round's targets follow her (no tens target until
`ones2`). A round is about 3.1 to 5.0 minutes with rows only, 3.3 to 5.5 with a square and 3.4 to 5.6 once the zeros are
learned (its late round holds seven links and a twin of two; `~/potomac-crossing-work/regroup/editor/time-v0.4.txt`), against
v0.3's 2.7 to 4.3, `'one'` about 0.1 less: the Hollow's time is hers (decision 56). Its frost treasures, `rounds` and
`cleanRounds` (a round with no slip; pointers do not break it) as v0.3.

**What a round earns.** A full round earns a frost-time treasure for My nest, from `E.FROST_TREASURES` in turn by the
store's own rounds: a frosted leaf, a snow-white feather, an acorn cap, a smooth river pebble (module-2's four; the
names say what sets them apart from module 1's acorn in its hat and speckled pebble), ids `frost-leaf`, `snow-feather`,
`acorn-cap` and `river-pebble`, tested distinct from every id in `E.TREASURES` and `E.GIFTS`. One Count at a time keeps
module 1's treasures by `hollow.rounds`, untouched, so every module-1 player's next treasure is the one it would have been. No
claw mark and no glow (the tree is full); `takes.rounds` and `takes.cleanRounds` (a round with no help) are counted for
the corner. The reward page is the Hollow's (`hollowReward`'s shape: the tree insert, the treasure, My nest and
"Another round", which goes back to the shelf).

**Picked up.** A round lives in the lesson slot, `{ mode: 'hollow', state }`, its state a take state, and gives way to a
chapter lesson and comes back through `hollowWaiting` as any round does (`E.hollowRound`, `E.holdLesson`, untouched):
the Hollow page picks it up first, at its problem and column, and settles one whose last answer is in.

## 6. Read to me and the lettering

**Numbers are read as numbers.** Every line the kit says is in words, made by `E.numberWords(n)` (0 to 1,000, American:
"five hundred three", "one hundred eighteen", never "and"; it agrees with `E.countWords` to 100): "Five hundred three
take away two hundred seventy-eight." The column's digits are never handed to the voice one by one; the counter line's
numbers ("10 · 5") are said one a hop, as the lesson's count is, a voice reading "13" as "thirteen".

**What is said, and when**, each balloon in its speaker's voice (`speakItems` sets the rate and pitch by `who`: chapter
12's store prompt is Glintstar's), the kit's own lines Tallyheart's. On a problem, in this order: the prompt's balloons;
then the question in words ("Five hundred three take away two hundred seventy-eight."); then the first column's line,
split out of the joined balloon for speech only (the lettering stays joined), so the voice never puts the question after
the column's instruction. Then each later column's line as it is outlined; "No squares left. We don't write a zero in
front."; Chispapaw's echo in her Spanish voice (never on the mini); the problem's end line; each help step's line and
each hop's number; `'show'` and `'tap'` lines. What Read to me's button says is the page's own list (the lesson's
`saying`), pinned by a Node test on `saying` and looked at with `DRY=1 node tools/shots.mjs` on `take:first`, never aloud
on the mini.

**The marks page and the slot** (decision 57). On the marks page (section 1a.2) Read to me says the set's lines in order,
each in its speaker's voice as its balloon shows and its picture glows (chapter 13: Chispapaw's two, then Tallyheart's
two; with no `marks`, the kit's Tallyheart lines), then each label as its button glows, "A little 1 in front", then "The
new number on top" (the little 1 said "one"), and after a pick that style's answer line. On a problem with moves, in
order with the column's lines: `'show'`'s `showLend`, `showGet`, `chainLend`, `chainGet` and `chainLend2`, each as its
box is ringed for her; `'tap'`'s `tap`, `tapSquare` or `tapRow` as the lender glows, and its `askLend` and `askGet` as
each box opens (only for a link new to the chapter: section 1a.1); and the **slot**'s one balloon under the column's line
(a move-help, `ahead`, `where`, `gave`, `zeroFirst`, `nine`, `order` or `tapHere`), said as it lands, in its speaker's
voice (a move-help in Tallyheart's, or the set's teacher's), each replacing the last, a move-help holding the keypad
dimmed until it is said and 0.3 s more (at most twice its reading time: section 1a.4). Both are in the page's `saying`,
pinned in Node and looked at with `DRY=1 node tools/shots.mjs` on `take:marks`, `hollow:marks` and the new spread
screens, never aloud on the mini.

**The page's `plain()`** reads − (U+2212) as `E.TAKE_WORDS`' take away (" take away " in English, read at call time, so
a change in the words table reaches the page's reading too), and × as " times ", as now. No line in chapters 1 to 11 or
the Warrior Counts has a U+2212 (the one in `app/engine.js` is in a comment), so what they say is unchanged; a test
keeps it so.

**The fonts, checked in the font files** (in the work folder, `cmap.js` reads each woff2's cmap and `adv.js` its glyphs;
output in `fonts.txt`): Andika
(`fonts/andika-700.woff2`) maps U+2212 to a glyph with an outline, 1,200 units wide, the width of its × and its =, so the
column's minus lines up with the Counts' signs; no re-subset is needed. All four Comic Neue files (400, 700 and their
italics) map ¡ ¿ á é í ó ú ñ ü and their capitals, « » and U+2212, so chapter 12's Spanish needs no new font. Digits stay
Andika; Spanish is never lettered in Andika.

**Aa and the sizes: a budget, not a ratio.** v0.1 sized the column like the question line, from the column's width.
Measured against the room the shared cache's lesson pages leave the question line (898fa1b5, the latest built: about
66 + 150 px at 1080 × 720 with a median stack, 111 + 87 at 820 × 1180, 62 + 90 at 390 × 844), that did not fit: a
six-row column is about 4d + 33 px for digits d px high, so at 1080 × 720 (d about 48, the column about 227 px)
chapter 12's first column, its 117-character prompt joined, came out about 60 px short with Aa off and 80 or more with
it on; upright the question line's 96 px cap gave 82 px digits and a 365 px column, a third of the store picture; at
844 × 390 the column and the keypad were about 364 px against 342 under the bar. So:
- **The digits** are Andika bold at `font-size: clamp(24px, min(8cqi, 4.6vh), 44px)`: about 33 px at 1080 × 720, 35 at
  1180 × 820, 44 upright, 29 on a phone and 24 at 844 × 390, about the keypad's own 32 px. The gold marks .5em, at
  least 16 px, the heads .35em, her boxes as `.q .slot` at that size.
- **The column's height**, the heads and marks rows in it, stays within about 165 px at 1080 × 720, 195 at 820 × 1180,
  150 at 390 × 844 and 125 at 844 × 390. Bigger text grows the balloons, not the column.
- **The fallbacks**, each a media query on the take page only (`.frame[data-mode="take"]`), not the existing "little
  room" blocks, which are Aa-only apart from the phone held sideways. Sideways (landscape, at least 700 px wide), where
  the panel stands beside the column (index.html's grid, `'col panel'`) and shrinking it frees nothing: first the heads
  row goes (its words stay in the `aria-label`s), then the keys drop to 56 px (the Hollow's 50 to 56 px blocks); never
  the panel. Upright and on the phone: first the heads row, then the panel shorter. On a phone held sideways (landscape,
  at most 500 px tall: index.html's own condition for the lesson's phone block) the stack stands over the panel (the
  stack's budget, below).
- **The lettering.** `.tmark` a 2 px ink shadow (`.q`'s 4 px one muddies 15 to 17 px gold digits); `.tstruck` an ink
  slash 3 px wide, both pinned in index.html's take block. `.tbox.on` a gold ring (`box-shadow: 0 0 0 3px var(--gold)`,
  as `.sw[aria-pressed]`; an ink outline would hardly show on the dusk), `.tbox.right` #c9f2c0 and `.tbox.miss`
  `var(--caption)`, as `.q .slot`.

The numbers are the UI owner's starting point, measured, not guessed, and the gate below holds them.

**The keypad stays put.** She types digit, OK, digit, OK with no pause screen between columns, so a keypad that moved
under her finger would turn an 8 into a 5, or an OK into a 0. Within a problem nothing above the keypad changes height:
the marks row (and the heads row, where it shows) is reserved from the start, so the first spread does not grow the
column; on the first column the page sets the stack's `min-height` to the tallest it will be while she types the
problem: the larger of what the first column holds (the prompt or an introduction, the column's line) and what a later
column will (the tallest later line in its full form, as after a help, all known from the plan, under the echo's room on
a page with an echo: `o.echo` given, chapter 12 on, absent before, which is its no-op). The echo's room is one balloon
of Chispapaw's two lines tall (an echo is one short Spanish line, eight words at most, two lines at the narrowest): from
column 2 the echo stands in the stack above the next column's line, and a first column with no prompt holds one short
balloon, so without the room the stack would grow at column 2 and the keypad move. The page releases it at the problem's
end, a later column's line and its echo top-aligned in it; sideways, the take page's column is top-aligned
(`.frame[data-mode="take"] .col { align-self: start }`), since the lesson's centred column would move the keypad by half
of any change. A help may grow the stack; its "Got it!" and the double-tap guard are the pause, and the next column goes
back to the reserved height. Pinned in `takes-ui.test.js`; the measure compares the keypad's box at column 1 and column
2, once with no echo and once with chapter 12's stub echo (`take:echo`'s, an eight-word Spanish line), which must be
equal each time. On a phone held sideways only the column is above the keypad (below), so it stays put there by
construction, and the stack's `min-height` keeps the picture beside it from changing size.
Under `movesOn` (section 1a.3) the small boxes live in the reserved marks and heads rows, and the stack has **one slot**
under the column's line: `takeReserve` adds, with each `'tap'` prompt it can say, the longest line that slot can hold on
this problem (its moves decide which), not the sum; the keypad's box is equal at decide, lend, get and answer, with and
without the slot filled (`keypad-moved`, on the new screens).

**The stack.** While she types: the problem's prompt (first column only), a twin's or warm-up's introduction, the
column's line, and from chapter 12 Chispapaw's echo balloon after a right column (`o.echo`). During a help: the slip's
line, the counter in a balloon of its own (as the lesson's help puts it), and the step's line, three balloons.

**The stack's budget, and the phone held sideways.** While she types the stack holds two balloons as a rule (the
prompt's or an introduction with the first column's line, which joins a prompt of Tallyheart's; the echo, or its room,
with a later column's line; a story's prompt of more balloons adds them on its first column only), during a help three.
On the other sizes the column's budget above was set to leave them room, and `col-off` checks it. On a phone held
sideways (844 × 390) it cannot: under the 48 px bar and the screen's 12 px top padding there are 330 px, and the
column's 125, the phone block's keypad (four rows of 44 px keys, 6 px apart: 194) and the gap between them take 325,
with no room for one balloon (about 43 px; 50 with Aa on). So there, and only there, the take page sets the stack over
the panel, in the panel's column (`.col` as `display: contents`, the grid's areas `'int stack' 'int panel'`), and the
panel takes the height that is left; the left holds the column and the keypad and nothing else. Computed from
index.html's phone-sideways block and Comic Neue Bold's own advances (`check-v0.3.js`), the right side is 418 px wide:
while she types, a line under the echo's room takes about 116 px (136 with Aa on), leaving the store picture about 208
px tall (188); chapter 12's first column, its prompt joined (three lines; four with Aa on), holds 116 (139) and leaves
it 208 (185); a help's three balloons take about 189 (221), leaving the sand about 135 px (103). The smallest, the sand
with Aa on, is for the page review to look at on this size; if it is too small to read there, the counter's balloon
joins the step's line on this size first (about 55 px back).

**The gate.** The sweep's `--pages` keeps its four sizes (1080 × 720, 1180 × 820, 820 × 1180 and 390 × 844, `SIZES` in
`dev/webkit/run.mjs`; more would change every cache key and double every sweep), with a `takes` job in its screens group
(`PC.debug.takes`). The page review runs the other four once, Aa off and on: `SIZE=1080x700` (and `1024x768`,
`768x1024`, `844x390`) `AA=0,1 node dev/webkit/run.mjs OUT.json takes`. The screens: `take:first` (chapter 12's worked
example, its first column with the prompt joined, past a Warrior Counts waiting line's page of its own, `wWait`: since
chapter 12's review the line is never over the column, where it lay under the bar), `take:q` (a three-digit problem with
marks), `take:show` (a `'show'` step), `take:tap`, `take:echo` (a stub Spanish balloon from `o.echo`), `take:sand` (a
help's last step with "Got it!", three balloons), `take:done`, `hollow:shelf` and `store:q`. None may show `off-screen`,
`off-screen-keypad`, `spill`, `broken-word`, `sideways` or the new `col-off`: `dev/webkit/measure.js` flags only
controls (buttons, inputs, `a.btn`), so a take page that pushed its column or its line under the bar would pass, and it
now also records `m.tcol` (the `.tcol` box), `m.tbox` (`.tbox.on`) and the stack's last `.sb`, and `tools/sweep.mjs`
reports `col-off` when any of them is not wholly between the bar's bottom and the viewport's. On a phone held sideways
(844 × 390) the stack stands over the panel (above), so the column, the outlined box, the keypad and the stack's last
balloon are on the screen together, as `col-off` requires, with no scroll. The v0.4 screens (decision 57) join them:
`take:touch`, `take:lend`, `take:get`, `take:get:one`, `take:chain`, `take:help:move`, `take:ahead`, `take:marks` and
`hollow:marks`, at the eight sizes (`SIZES` and `TAKE_SIZES`), Aa off and on, with `col-off` also failing a `.tmini`
that leaves `.tcol`, meets the stack's last balloon, or stands nearer the neighbour's mark than its own digit, and two
new checks: `hit-small` (a live target's hit box under 44 × 44) and `marks-small` (the marks page's little 1 under 16
px). `--takes --compare` keeps what a chapter-12-only player sees of the kit byte for byte against the live tree:
`TAKE_COMPARED` (`dev/webkit/run.mjs`, as built after the review) is `take:first`, `hollow:shelf` (no My marks),
`store:q` (the gate off) and `PC.debug.spanish`'s eight screens, at `TAKE_SIZES`, Aa off and on (88 rows). As built the
slot's balloon is `.tslot` (measure.js's `tslot`), a live target is the `[role="button"]` element's own box (`ttgt`),
the marks page's little 1 is `tone`; `take:lend` and `take:get` carry `@next` (`TAKE_NEXT`, a map: the ringed
`.tmini.on` typed its right number, and the keypad must not move between them).

**For VoiceOver.** The column is a group labelled with the problem in words; each box is labelled by its column
("ones", "tens", "hundreds", from `E.TAKE_WORDS`) and what is in it, the outlined one `aria-current`; the column's line
is in the stack's live region; the `'tap'` page's hidden "Spread a row" button (its words from `E.TAKE_WORDS` too); the
panel's label says the store in words ("Five squares, three loose"); between a lend and its get the lend's piece rests
unopened and is said apart, never counted as landed ("Six rows, four loose, one row resting"), so the label never gives the
get's number before she types it. Under `movesOn` the column's own targets take the
hidden button's place (`role="button"`, live only at a decide, Space or Enter taps, labelled "Spread a row" or "Spread a
square"), and each small box is labelled by its column and its job ("tens, new number: 3"), `aria-current` while it is
ringed (section 1a.3, "Focus and keys").

## 7. Book two

A second, smaller piece, built after the kit (about 150 engine lines, 250 page and 300 test lines: module-2's estimate
of 60, 160 and 120 left out the `E.checkStory` guards, the badger rows with their crossing and Read to me's order, the
sleepers' pages, the volume filtering and the print CSS), so chapter 12's page has somewhere to land.

- **A `module` key on chapters**: `module: 2` on chapters 12 to 21; absent is 1 (`E.moduleOf(story)`). Nothing else reads
  it: `E.chapters`, `E.upNext`, `E.progress` and the hub go on by `number`.
- **Two volumes in Read my book** (`E.books(cat, stories)`: each module with a finished chapter, its title from its
  first chapter's `book.title`): "{name}paw's First Moon" keeps its title and pages (module 1's chapters read again keep
  {name}paw, as now), and "{name}{ending}'s First Frost-Time" (chapter 12's `book.title`). Read my book opens the volume
  of her latest finished chapter; once there are two, two buttons under the title ("First Moon", "First Frost-Time", the
  open one pressed, each at least 44 px tall for a child's finger) switch them. Each volume is its own book: its
  portrait, its pages, its dragonets or sleepers, its teaser (its latest finished chapter's), and it prints a chapter a
  page. `E.buildFullBook(cat, stories)` builds module 1's volume and returns exactly today's object (no new key) for
  every cat with no module-2 chapter finished (and module 1's volume, key for key, for one with); `E.buildFullBook(cat,
  stories, 2)` builds the second, with its new keys.
- **The store on each chapter page**: a chapter's `book.store` (chapter 12: 133) is drawn small under its recap by the
  kit's place-value picture (one square, three rows, three loose), with "In the store:" in Comic Neue and 133 in Andika,
  as everywhere words and numbers are set; printable.
- **The sleepers' pages**, as the dragonets' (`E.sleepers(cat, stories)`, `E.SLEEPERS` 7): a finished chapter's
  `book.sleeper: { id, name, lines, when, pose? }` (the groundhog is chapter 13's, with `when: { foundGroundhog: true }`)
  is a page with her picture and room for her own drawing ("Draw the groundhog here"); the rest are silhouettes ("Six
  more, still sleeping."). Each sleeper's art comes with its chapter; until then the page's plain shape stands in.
- **The badger page**, "What is a badger LIKE?" (`E.badgerPage(cat, stories)`), from chapter 13: two columns, **They say**
  (each line with an ear, the Case File's mark) and **I saw** (an eye). A chapter's `book.badger` is a list of `{ row,
  say: { text, who } }` and `{ row, saw: { text } }`; a row shows once one of its lines is from a finished chapter; its
  rumours are crossed out once one of its sightings is shown. Rows in the order first seen, one row per answer (module-2's
  table: the three "as big as" rumours share the row "As big as three cats. And grumpy."). Under 520px wide a row's
  sighting goes under its rumours. Read to me says each rumour, "crossed out:" before a crossed one, then the sighting.
- **The keepsake on the last page**: a chapter's `book.keepsake: { id, name, lines }` (chapter 21's stone tooth) closes
  its volume, drawn as a nest treasure is.

| Engine | What it does |
|---|---|
| `E.moduleOf(story)` | its `module`, else 1 |
| `E.books(cat, stories)` | the volumes with a finished chapter: `[{ module, title }]` |
| `E.buildFullBook` (changed) | a third argument, the volume (default: module 1, whose object is today's, key for key); pages, `dragonets` and `teaser` from that volume's chapters only; for volume 2 also `sleepers`, `badger` and `keepsake`, and `store` on a page whose chapter has one |
| `E.sleepers(cat, stories)`, `E.badgerPage(cat, stories)` | as above; null until there is something |
| `E.checkStory` (changed) | guards for the new chapter keys, as every earlier story key has: `module` is 1 or 2; `book.store` a whole number 0 to 999; `book.sleeper` is `{ id, name, lines, when?, pose? }`, its id distinct across the chapters, at most `E.SLEEPERS` of them; each `book.badger` row has a string `row` and exactly one of `say` or `saw`; `book.keepsake` is `{ id, name, lines }`. Chapters 1 to 11 produce no new errors; each guard is tested |

| Page | What it does |
|---|---|
| `renderBook` (changed) | the volume (`opts.vol`; from a chapter's end, that chapter's; else her latest finished chapter's), the two buttons when there are two volumes, the store under a page, the sleepers' pages, the badger page, the keepsake; scrolling to a chapter's page from its end, as now; Read to me as now, plus the new pages |
| `index.html` | CSS for the volume buttons, `.storepic`, the sleepers' pages (the dragonets' classes reused), `.badger` (two columns, rows, the crossed rumour, the ear and eye), print rules (a chapter a page) |

Tests: `tests/book2.test.js` (the engine owner's): every golden end cat's `E.buildFullBook(cat, stories)` deep-equal to
the tree before (no new key); `E.books` lists one volume until a module-2 chapter is finished, then two; on a stub
chapter 12 and 13 the second volume's title, the store at 133, a sleeper found and six silhouettes, the badger rows
filling and crossing as chapters finish, a reread of chapter 1 keeping "{name}paw's First Moon"; each new
`E.checkStory` guard. `tests/book2-ui.test.js` (the UI owner's, who writes `renderBook`'s markup in the same phase): the
page's volume buttons (44 px), the store drawn from the kit's picture with its two fonts, and the print rules, pinned as
text.

## 8. Engine, art and UI pieces

*These tables are v0.3's; under `movesOn` the v0.4 pieces at the section's end (decision 57) change what they name.*

**Engine** (a section "the take-aways kit" after the Warrior Counts'; new unless it says changed):

| Piece | What it does |
|---|---|
| `E.TAKE_KINDS`, `E.TAKE_STEPS`, `E.TAKE_SLIPS` (`zero`, `flip`, `nospread`, `kept`, `extra`, `fact`, in that order), `E.TAKE_REGROUP` ['show', 'tap', 'hers'], `E.TAKE_TEMPLATES`, `E.TAKE_TRIES` 400, `E.TAKE_ROUND` 5, `E.TAKE_LOG_CAP` 500, `E.FROST_TREASURES` (ids `frost-leaf`, `snow-feather`, `acorn-cap`, `river-pebble`) | the names and numbers above |
| `E.TAKE_WORDS` | the kit's maths words in one place, each form listed: the picture words (loose; row, rows, Row; square, squares), the school words for the columns (ones, tens, hundreds), take away (take away, Take away), the regrouping word (spread, Spread: its base form only, below), and Ones first (a phrase of its own, so a language that orders it differently changes it whole). Read lazily, at call time, from `PC.words` when it holds them (chapter 12 brings it, with the Spanish beside), as `warriorStory()` reads `PC.warrior`, with the English as the fallback: `PC.words` does not exist until chapter 12, and a table read once at load would miss a stub loaded after `app/engine.js`. `E.TAKE_LINES`, the heads' and the panel's `aria-label`s, the hidden button, the digit lines and `plain()` all read it, so a class word changes in one line (decision 53) |
| `E.TAKE_LINES` | every line the kit says, with tokens: the numbers' (`{Top}`, `{bottom}`, `{first}`, `{rest}`, `{left}`, `{digit}`, `{A}`, `{B}`, as number words) and the words', one for every form `E.TAKE_WORDS` lists (`{spread}`, `{Spread}`, `{row}`, `{rows}`, `{Row}`, `{loose}`, `{square}`, `{squares}`, `{ones}`, `{tens}`, `{hundreds}`, `{takeAway}`, `{TakeAway}`, `{OnesFirst}`, filled from `E.TAKE_WORDS`: "Ones first. Three take away eight." is `{OnesFirst}. {Top} {takeAway} {bottom}.`, "Take away seven." `{TakeAway} {bottom}.`); no form of a maths word is written into a line literally, and the cat's tokens are left for the page. Its keys: the column lines (`colFirst`, `colHers`, `colShown`, `colName`, `nothingHers`, `nothingShown`), `schoolWords`, `blank`, `onesFirst`, `tap`, `tapSquare`, `tapRow`, `tapHere`, the spread lines, the six slips' first lines, each with its tens and zero forms (section 2), and `fact`'s chain and lent-zero openings, the take's hops, the digit, `twinIntro`, `warmIntro`, `again`, `rememberedStep` (one a step), `miss` and `missLast`, the default praise. A set's `lines` overrides any |
| `E.numberWords(n)` | number words 0 to 1,000 |
| `E.takePlan(a, b)` | the plan (section 3) |
| `E.takeKind(plan)`, `E.takeFlags(plan)`, `E.takeShape(plan)` | section 3 |
| `E.takeStepOf(plan)` | the step a problem belongs to: `ones2` for a two-digit spread; `zero` and `zeros` their kind; `mixed` only for a problem with no hundreds left of kind `none`, `ones`, `tens` or `both`; else its kind (her hard steps, section 4; the guards, section 3; the round's templates, section 5) |
| `E.takeTwin(plan, seed, avoid, mode)` | a twin, or the original after 400 draws; for `mode` `'hers'`, never one whose flip lands on a right digit (section 2) |
| `E.takeWarm(seed, avoid)` | the made two-digit warm-up (`'hers'`, so its flip never lands) |
| `E.takeSlip(plan, col, given, shown, taught)` | section 2's slip, or null for a right digit; a blank column's empty OK is given as 0; `shown` the turn's spreads were shown or tapped; `taught` the steps taught so far (absent: every step), which `extra` needs |
| `E.takeLine(def, plan, col, stage, mode, full)` | the column's line: in `'hers'` the column and its bottom digit, never its top (the first column its top as written); in `'show'` and `'tap'` the top as it stands, or after a shown or tapped spread; `full` false gives the column's name alone (section 1) |
| `E.takeShow(def, plan, col)` | `'show'`'s steps, and `'tap'`'s lines, for a turn that spreads |
| `E.takeHelp(def, plan, col, slip)` | the help: `{ intro, steps: [{ say, sand, n? }], digit, line }`, `sand` as `E.takeSandOpts` takes it |
| `E.takeSandOpts(step)`, `E.takePicture(def, q, stage)` | what `PC.art.sand` (`kind: 'quick'`) and `PC.art.placeValue` take, exactly the option objects pinned below: the number as it stands, crossed and fresh marks, the taken and lit ones, the spread in flight, the glowing zone |
| `E.takeQuestion(def, q)` | what comes before the first column: the prompt's balloons (lettered and said), a twin's `twinIntro` or the warm-up's `warmIntro` (lettered and said), then "{A} take away {B}." in words, said only, its own speech item before the first column's line (section 6's order) |
| `E.takes` (`T`): `T.start(def, opts)`, `T.done(st)`, `T.question(st)`, `T.digit(st, def, digit, ms, now)`, `T.tap(st)`, `T.summary(st)` | the runner. A take state: `{ op: '-', set, mode, queue: [{ a, b, regroup?, prompt?, right?, picture?, of?, warm? }], pos, col, got, first, slips, cols, tapped, requeues, log, lineIdx, missed, onesFirst, startedAt, round?, taught?, avoid? }` (`taught` the steps taught so far: a lesson's, its chapter's and the earlier ones'; a round's, those she has learned; `avoid` the answers no twin may have: a lesson's, its chapter's; `of` a twin's lineage, its original's `'<a>-<b>'`; `requeues` keyed by it; `lineIdx` the praise and miss lines' turn, not to be confused with a set's `lines`; `onesFirst` whether this problem's pointer has been given): `pos` moves only when a problem is done, so `T.done` and `E.counts.done` agree and the slot machinery (`busy`, `E.lessonAt`, `E.holdLesson`, `E.hollowRound`, `E.settleLesson`) works untouched. `T.question` gives the problem, its plan, the column, the line's mode and form, her digits so far and the marks lettered (per column, by the mode: section 1); `T.digit` one column's OK: right or wrong, the ones-first pointer, the slip and the help, the marks, a blank asked, and at a problem's end its log entry, the twin queued (seeded by `startedAt`, `pos` and the requeue count), its line (`again`, `rememberedStep`, praise or `right`, or the miss line); `T.tap` one spread of a `'tap'` turn; `T.summary` has `C.summary`'s keys (`noHelp` and `finished` too, so `when: { lessonClean }` reads a take set) and `op: '-'` |
| `E.takeLesson(cat, story, setId, now, stories)` | a chapter's take lesson: the set's facts (and its made warm-up first) and a fresh take state, with the steps this chapter and the earlier ones teach (`taught`) and the chapter's answers (`avoid`) |
| `E.chapterLesson` (changed) | one branch first: a set with `op: '-'` goes to `E.takeLesson`. Every other set as now |
| `E.recordLesson` (changed) | one branch before the Hollow's (`st.mode === 'hollow'`) and after the Warrior Counts': a state with `op: '-'`: a chapter's under `lessons[set]` (`T.summary`), `lesson` cleared, returned as today; a store round to `E.takeRoundFinish`, returned as `{ mode: 'store', summary, hollow: null, store: { awarded, rounds } }`, so it never reaches `E.hollowFinish` (module 1's treasures and `byTable['1']`) nor `renderHollow`'s pinned `hollowReward`. Its signature stays `(cat, st)` |
| `E.logTake(cat, entry)` | into `cat.takes.log` (created on her first), capped |
| `E.hardTakes(cat)`, `E.takeTable(cat)` | her hard steps (section 4); the corner's table by kind: problems, right first time of her own first asks (not a twin, not `worked`, not `'tap'`: E.hardTakes' rule; the made warm-up and a store round's problems count), helped, typical time (the median of her right `'hers'` answers), her commonest slip; `capped` and `cap` (at `E.TAKE_LOG_CAP` the table is her last 500, and the corner's heading says so); under it a "teen facts missed" row (for example "13 − 8 ×2"), built from each `fact` slip's top at her turn and the column's bottom digit, for grown-ups only: those facts are a grade 2 prerequisite the kit has no other way to show |
| `E.questionDef` (changed) | only for a set with `warmHard.table === 'all'` and a question whose numeric `table` differs from the set's: the set with `W_ASK_KEYS` copied from `E.hollowDef(stories, q.table)` and its own lines kept (section 4). Every other set and question as now, `from` included |
| `E.takeSteps(cat, stories)`, `E.storeOpen(cat, stories)` | the steps her finished `teach` sets taught, in order; whether Count the store shows |
| `E.hollowShelf(cat, stories, opts)` | the shelf's greeting (or the waiting line, from `E.hollowLines`, reused) and its buttons; null while the store is closed; `opts.stories` in place of `stories` (for `PC.debug.takes`) |
| `E.takeRoundDef()`, `E.takeRoundStart(cat, stories, now, opts)`, `E.takeRoundFinish(cat, st)` | section 5 (no flip landing; entries `round: n`, first asks; the older steps those that spread; its state's `taught` the steps learned); the finish once, as `E.hollowFinish`; `opts.stories` as above |
| `E.checkTakes(story, stories)` | section 3's guards, each spelled out there, as a list of errors |
| `E.checkStory` (changed) | adds `E.checkTakes`' errors: none for a chapter with no take set |
| `okLesson`, `E.okLesson` (changed) | only for a state with `op: '-'`: also each queued problem in range, `col` a whole number within its columns, `got`, `first`, `slips` and `cols` lists; anything else dropped like any bad lesson. Every other state as now |
| `normCat` (private, changed), `normTakes` | `takes` her own key only: entries that are objects with a problem in range and a numeric `at`, `kind` recomputed when missing or wrong, the last `E.TAKE_LOG_CAP`; `rounds` and `cleanRounds` whole numbers; anything else dropped, the key absent |
| `warriorStale`, `lastAnswerAt` (private, changed) | also `cat.takes.log`'s `at` (section 4) |
| `E.lessonFacts` (changed) | only when `warmHard.table === 'all'`: section 4 |
| `E.treasure` (changed) | finds `E.FROST_TREASURES` too; every existing id the same |

**The regrouping word in one form.** Decision 53 asks for the regrouping words to be easy to change, and a token is not
enough on its own: "spread" is the same as a base verb, a past tense and a noun, but "trade" would give "One square trade
into rows", "break apart" needs "broke apart", and "regroup" fits none of those slots. So every kit line uses the
regrouping word only in its base form, after an imperative, "can" or "to", or as a present "I" or "we": "Spread a row:
ten more loose." "So I spread a row." "But we can spread a square." "Not enough loose, and no rows to spread." And it
always stands before what it acts on, a row or a square, or after it ("no rows to spread"), never before a pronoun and
never alone: "break apart" is a verb with a particle, and "Tap a row to break apart it." is not English, so the `'tap'`
line is "Spread a row: tap it." With that, every slot takes every word Aron might give it: "Break apart a row: tap it."
"Trade a row: tap it." "Regroup a row: tap it." Past-tense and noun uses are reworded so they need no swap: "One square
became ten rows." "One row went to the loose." "Across the zero: thirteen loose." Chapter lines that use the word keep
the same rule (chapter 17's English for «¿Hay que desagrupar?» is "Do we need to spread a row?", and at the tens "a
square?"). This document's own prose still says "a spread"; the lines never do. `check-v0.3.js` fills every line in this
document that says the word with "trade", "regroup" and "break apart"; test 13 does the same for every kit line and
pins the result.

Unchanged: `E.counts` (`start`, `answer`, `question`, `summary`), `E.helpPlan`, `E.hardFacts`, `E.warriorHard`, `E.countSets`,
`E.learnedCounts`, `E.hollowLines`, `E.hollowStart`, `E.hollowFinish`, `E.settleLesson`, `E.finishCounts`, `E.lessonAt`,
`E.beginLesson`, `E.holdLesson`, `E.hollowRound`, `E.migrate`, `E.blankCat`, `E.TREASURES`, the Warrior Counts' every
other function.

**Art** (`app/art/cats.js`, and one entry in `app/art/scenes.js`):

| Piece | What it does |
|---|---|
| `PC.art.placeValue(o)` | the store picture: squares, rows, loose in three zones; `taken` per zone pale and dashed, the old pieces first, then the fresh; `fresh` a spread's ten, drawn as a block beside the old (a ten-frame of loose, a block of ten rows; nine, one place empty, once a row of it has spread on across a zero); `spread` a row (or a square) in flight, its CSS slide and open (a Reduce Motion page draws its end); `glow` the zone the `'tap'` page asks for; `kind: 'marks'` the quick picture's marks in place of prey; `small` for a book page. Up to 9 squares, 18 rows, 18 loose |
| `PC.art.sand`, `kind: 'quick'` (changed: one branch) | the help's sand: squares, lines, dots for a number as it stands; crossed squares and lines (spent by spreads, old ones first; across a zero the crossed line is one of the square's ten new ones) with their ten new marks beside them (dots in two rows of five); `take` (the column's marks taken, old first, `lit` of them so far); the column on lit; the existing `GROUNDS` (sand, earth). Every other call as now |
| `PC.art.quickMarks(x, y, scale, o)` (cats.js) and `PC.art.kit.quick` (scenes.js, one entry) | the same marks as a group for a set to place: the badger's counts by her holes (module-2, amendment 2: one picture for the help, the lessons and the clue). `art.kit` is an assignment in `app/art/scenes.js` (`art.kit = { … }`), which loads after cats.js, so a `kit.quick` added from cats.js would be overwritten or throw: the art owner adds one entry, `quick`, to that object, delegating to `art.quickMarks`. `scenes.test.js`' fingerprints stay as they are. Snow is chapter 21's `GROUNDS` entry |

**The option objects**, pinned before phase 1 so the art and the engine can be written at once and tested apart (the art
tests draw hand-written options; the cross-check that `E.takeHelp`'s steps, test 17's cases and sample, draw without
throwing, with the right counts, is the UI owner's, in `takes-ui.test.js`, phase 2):

| Object | Keys |
|---|---|
| `placeValue`'s `o` | `{ hundreds, tens, ones, taken: { hundreds, tens, ones }, fresh: { tens, ones }, spread: null \| { from: 'hundreds' \| 'tens', to: 'tens' \| 'ones', stage: 'slide' \| 'open' \| 'end' }, glow: null \| 'hundreds' \| 'tens', kind: 'store' \| 'marks', small: bool }`: counts as they stand; `fresh` how many of a zone's pieces are a spread's ten: 10, or 9 once one of them has spread on across a zero (503 − 278's rows after the chain: 9 rows, all of them fresh), else 0; within its count, so a 9 is drawn as the block of ten with one place empty; `taken` within its count (old pieces first) |
| sand `quick` | `{ kind: 'quick', hundreds, tens, ones, crossed: { squares, lines }, fresh: { lines, dots }, take, lit, col: 0 \| 1 \| 2, ground }`: the number as it stands; `crossed` the marks spent by spreads, the old ones first; `fresh` the ten new marks each spread drew (10 a spread), crossed or not, beside the mark they came from. Across a zero there are no old lines, so the crossed line is one of the square's ten fresh ones: the lines drawn are `tens` + `crossed.lines`, the old among them that less `fresh.lines`, and any crossed line past the old ones is a fresh one (503 − 278 after the chain: 9 + 1 = 10 lines, all fresh, one crossed; it happens only across a zero, `check-v0.3.js` over every problem); `take` how many of column `col`'s marks are being taken, `lit` how many so far (old first) |
| `quickMarks`' `o` | `{ hundreds, tens, ones, ground }` |

`E.takePicture(def, q, stage)` returns a `placeValue` object and `E.takeSandOpts(step)` a sand `quick` one, exactly these
keys.

**UI** (`app/ui.js` and the page; each changed function only for a take set or state, or with the store open):

| Piece | What it does |
|---|---|
| `runTakes(o)` | the take page (sections 1, 2 and 6): the panel's picture, the column, the keypad with one digit a box (OK lit on the leftmost box even when empty), each column's line by mode and form, the marks lettered per column by the mode, the spreads, `'show'` and `'tap'` (the tap target the glowing zone or the lending digit), the ones-first pointer, the help's steps, the twin's and warm-up's introductions, the problem's end, `saying` for Read to me's button in section 6's order; the stack's `min-height` held through a problem, with the echo's room on a page with an echo, and the marks row reserved (the keypad stays put); on a phone held sideways the stack over the panel; the next column outlined 0.9 s after the last spread lands, or at once with no spread (plus the echo's time), a tap drawing the end at once, keys ignored until then and for 400 ms after every OK; after every column `cat.lesson = …` (as `runLesson`'s submit) and at the last answer `E.recordLesson`; the keypad and "Got it!" brought into view after `go()`'s scroll; the double-tap guard after "Got it!" (`padLockedUntil`, as now); `o.echo`, a hook called with each right column (its top, bottom and digit) and each right problem, absent (the no-op) until chapter 12, whose Chispapaw says them in Spanish |
| `startChapterLesson` (changed) | one line: a set with `op: '-'` runs `runTakes` with the same options (`intro`, `waitLine`, `onDone`), the waiting line and the done screen as they are |
| `renderHollow` (changed) | with the store open, the shelf (`E.hollowShelf`) as its opening page; its "One Count at a time" draws today's Counts page; a round in the slot whose state has `op: '-'` is picked up in `runTakes` (the waiting line over it, as a round's), or settled; Count the store starts `E.takeRoundStart` through `E.holdLesson`, as a round does; `opts.stories` in place of the stories (for `PC.debug.takes`). The pins it must keep are named below |
| `storeReward(res)` | the reward page for a store round (the frost treasure; "Another round" to the shelf) |
| `onBack` (changed) | from the Counts page under the shelf, back to the shelf |
| `plain()` (changed) | − as `E.TAKE_WORDS`' take away, read at call time |
| `openGrownups` (changed) | with `takes` data: a "Take-aways" table by kind (`E.takeTable`, its teen-facts row under it, with a note on what its columns count; "(her last 500)" in its heading once the log is at its cap) after the Counts' tables, and "Count the store N (M without help)" on the Training Hollow's line, the module-1 part led by "One Count at a time". Nothing for a cat without it |
| `treasureSvg` (changed) | the four frost treasures' drawings (the UI owner's: the treasures are drawn here, not in the art files); every other id as now |
| `PC.ui.takes` | pure, for Node: the column's view (cells, marks per column by the mode, struck digits, boxes, heads, `aria-label`s), `press(typed, k)` (one digit: a new one replaces it, Delete empties), the steps' and lines' waits, the stack's lines at each stage, the reading order |
| `PC.debug.takes(what)` | for the tools: `first`, `q`, `show`, `tap`, `spread`, `echo`, `sand`, `done`, `shelf`, `store`. The shipped page has no take data (no chapter has a take set, and `tests/fixtures/takes-stub.js` is not served), so it builds its own definitions inline: 503 − 278 `'hers'`, 43 − 16 `'tap'`, 254 − 131 `'show'` with chapter 12's worked prompt, a help at 503 − 278's ones; for the shelf and the store round, an in-memory stories list holding a stub `teach` set, never registered in `PC.story`, passed as `opts.stories` to `renderHollow`, `E.hollowShelf` and `E.takeRoundStart`. Returns true or an error string, as `PC.debug.warrior` does |
| `index.html` | CSS: `.tcol` (a grid: the sign's column and one a digit; rows for the heads, the marks, the top, the bottom, the rule, the boxes; the marks row reserved), `.thead` (the sand chip), `.tmark` (gold, a 2 px ink shadow), `.tstruck` (the ink slash, 3 px), `.tbox` (`.on` a gold ring, `.right` #c9f2c0, `.miss` `var(--caption)`, `.blank` dotted), `.frame[data-mode="take"]` (its panel, "Got it!" at the top of the keypad's place, `.col { align-self: start }` sideways, the digits' `clamp()`, the fallbacks' media queries, and on a phone held sideways the stack over the panel, `.col` as `display: contents` in the areas `'int stack' 'int panel'`: section 6), the shelf's buttons, the store icon |

**The Warrior Counts' pins the UI owner must keep.** `tests/warrior-ui.test.js` pins, as text at their indentation,
`renderHollow`'s `var HW = …;` and `wTrickyDue = false;` and its pick-up lines, `hollowReward`'s
`go('hollow', { from: 'hub', reward: true })`, and `go()`'s view table. So: the shelf is a branch before `var HW`, at the
same indentation; One Count at a time is `go('hollow', { counts: true })` into the unchanged path; the take pick-up and
settle sit before the pinned two lines; no new view name; and a module-1 round's "Another round" lands on the shelf, as
the pinned line requires. Built any other way (a sub-page, a new view), the Warrior Counts' three test files would not
pass untouched.

**Tools.** `tools/storyboard.mjs` writes a take set's lesson in a Counts frame's place ("**Then the take-aways**
`ch12-take` (the store's prey in squares, rows and loose): 254 − 131, worked; 58 − 23, …; a missed one comes back as a
twin."), only for `op: '-'` sets, so every storyboard of chapters 1 to 11 and `warrior.md` regenerates byte for byte.
`tools/shots.mjs` gains `take:first`, `take:q`, `take:show`, `take:tap`, `take:spread`, `take:echo`, `take:sand`,
`take:done`, `hollow:shelf` and `store:q` (each on a test cat, through `PC.debug.takes`). `dev/webkit/run.mjs` gains a
`takes` job (those screens) in its screens group, beside the Warrior Counts'; `dev/webkit/measure.js` records `m.tcol`,
`m.tbox` and the stack's last `.sb`, and `tools/sweep.mjs` reports `col-off` (section 6). `tools/test.mjs` adds
`takes-exhaustive.test.js` to `SLOW`.

**New art:** the place-value picture and the quick marks (above); the four small treasures are the UI owner's, in
`treasureSvg`. No new character, set or camera: the store camera on `bridge` and Chispapaw are chapter 12's.

**The save.** Still version 2, under the same key; `E.SAVE_VERSION` unchanged. **One new optional field on a cat,
`takes: { log, rounds, cleanRounds }`, absent until her first take-away is logged** (`E.blankCat` unchanged, so every
cat who has not met a take-away is stored exactly as today). A take lesson in progress is a lesson in the slot
(`lesson`, a place's `lesson`, `hollowWaiting`) with a take state, checked by `okLesson`; a finished take set's summary
is in `lessons`, as any set's. Book two adds nothing to the save. Decision 57 adds one optional field, `cat.takes.style`
(section 4, "The save with moves").

**Why chapters 1 to 11 and the Warrior Counts play and draw byte for byte, for every live save:**
- No live save has `takes`, and no chapter 1 to 11 has a take set, so every changed function above takes its old path:
  each change is behind `op: '-'`, `takes` data, `warmHard.table === 'all'` (`E.lessonFacts` and `E.questionDef`),
  `E.storeOpen` or a module-2 chapter.
- `E.migrate` returns for every save exactly what it returns today, and `E.blankCat`'s keys do not change.
- The Counts runner (`E.counts`) and `runLesson` are untouched (their source, pinned as text against the v23 tree).
- What the art draws for every existing call is unchanged (`PC.art.sand`'s new branch is `kind: 'quick'` only; `art.kit`
  gains one entry and draws nothing new for any shipped frame).
- **Proved by:** the chapter-7, -8 and -9 goldens passing untouched; `tests/scenes.test.js`' and `tests/cats.test.js`'
  fingerprints of every shipped frame and cast member; every storyboard regenerating byte for byte; the Warrior Counts'
  three test files passing untouched; and the kit's own tests (section 9, test 15): every fixture save migrating
  deep-equal to before, with no `takes` key; for every golden end cat, `cat.counts`, `cat.hollow`, `cat.warrior` and the
  module-1 part of `cat.nest` deep-equal before and after a take lesson and a store round are played on it (one
  assertion that covers every reader of `counts`: `E.firstTry`, `E.fillPool`, `E.siblingAsked`, `E.readFirst`,
  `E.tableOf`, the corner's "a slip?" and the rest); every existing set's start state, `E.questionDef` for each of its
  questions, `E.hardFacts`, `E.warriorHard`, `E.hollowLines`, `E.hollowStart`, `E.buildFullBook` and `E.factTables` the
  same before and after; every existing treasure id the same; no U+2212 in any line of chapters 1 to 11 or
  `PC.warrior`; `E.checkStory` the same for every chapter; and, before the merge, the sweep of the integrated tree
  against the live one (`node tools/sweep.mjs --all --compare <work>/live`): no frame's art differs and no page's boxes
  move, the new screens apart.

**v0.4: the pieces of decision 57** (`~/potomac-crossing-work/regroup/design.md`, section 5; the owners and the exact values,
`~/potomac-crossing-work/regroup/plan.md`).

**The gate, `movesOn`.** `movesOn(st)` is true when `st.taught` is a list holding a step from `ones2` on; an absent
`taught` means the v0.3 path, everywhere. So `T.start` with no `taught` (chapter 12's tests, `take:first`,
`PC.debug.spanish`'s eight screens) plays exactly as v25; chapter 12's lesson (`['none']`) and a chapter-12-only
player's rounds too. `PC.debug.takes`' spread screens pass `taught: E.TAKE_STEPS`, so they show v0.4, and the Safari
ship check's five are re-shot.

**State** (a take state, `T.start`'s, all new keys optional, absent on a v25 state):
- `style`: `'above'` or `'one'`, from `opts.style` (`E.takeLesson` and `E.takeRoundStart` pass `E.takeStyle(cat)`), set
  again by the page after the marks page, and refreshed by the page from the cat when a problem with no `moveStyle`
  begins (so a shelf change reaches a lesson waiting in its place); a problem's marks are drawn in the style it has when
  its first move comes (`moveStyle` on the problem's queue item, so a resumed problem keeps its look).
- `move`: the index of the current column's next move in `E.takeMoves(plan, style)[col]` (0: the decide), saved after
  every move.
- `moveMs`: this problem's moves' times, in order (each move's clock starts when its box opens or its target is live).
- `ahead`, `nudges`: this problem's pointers; `keyed`: the lesson's (or round's) `lend` and `get` slips so far, by name.
- As built (the engine owner's names, `app/engine.js`, "the runner under the kit v0.4's gate"): `moveLog`, this problem's
  moves as the log keeps them (`[col, code, given, ms]`, `code` `'t'` a touch, `'u'` a touch undone, `'l'` a lend's
  number, `'g'` a get's); `seen`, this problem's `zeroFirst`, `order`, the keying slips already counted (`lend`, `get`)
  and `twin` (a keying slip come twice: the problem twins); `keyed` counts a keying slip **once a problem** (two links
  typed the same wrong way in one problem are one habit; "twice in the lesson" is two problems). The column's own, absent
  when unset and cleared as a column ends: `pale` (her `ahead` digit), `lit` (1: a pointer lit the lender, until her
  touch; 2: `ahead` lit the column's touches), `litTyped` (digits typed while lit), `touched` (the column she struck at a
  turn that needs nothing: its lend box open, `extra` judged at its number), `shut` (no target left in the column: an
  `extra` helped, so it cannot loop). `T.start` writes `style` and the move keys only under the gate, so a
  chapter-12-only round's state is v25's exactly (L2). `okTakeState` checks each when present.

**Pieces** (the section "the take-aways kit"; each change only under `movesOn`, for a problem with a spread, or with the
new keys):

| Piece | What it does |
|---|---|
| `movesOn(st)` (new, internal; exported as `E.takeMovesOn`) | the gate (above) |
| `E.TAKE_STYLES` (new) | `['above', 'one']`, her two marks; `E.takeStyle` reads anything else as `'above'` |
| `E.takeMoves(plan, style)` (new) | per column, ones first: `[{ move: 'touch' \| 'lend' \| 'get' \| 'answer', col, link, value?, reads?, before?, to? \| from?, zero?, blank? }]` (section 1a.1): `col` the column the move acts on, `link` its link in the turn (null at the answer), `value` the right number (a lend's new number, a get's in the style: 1 in `'one'`, the answer's digit), `reads` a get's new number as a number (13 in either style), `before` the column as it stood, `zero` a chain zero's touch, lend or get. Not `E.takeSteps`, which stays the steps her sets taught |
| `E.takeTargets(plan, col, moveIdx, taught)` (new) | the columns she can tap now: `[]` unless `moveIdx` is a decide (0, or a chain's second touch, 3) |
| `E.takeMoveMarks(plan, style, col, moveIdx)` (new) | per column: `{ struck, front: null \| 1 \| 'box', frontStruck, m1: null \| { v, struck, front, box }, m2: null \| { v, box } }`, the option object the column draws (pinned before the build, as v0.3 pinned its objects). `E.takeMarks` (v0.3's, `(plan, mode, helped, col, k)`) is kept unchanged for the v0.3 path |
| `E.takeMoveSlip(plan, col, moveIdx, given, style, taught, ctx)` (new) | section 1a.4's table, or `{ pointer: 'ahead' (with `form`) \| 'zeroFirst' \| 'where' \| 'gave' \| 'nine' \| 'order' }`, or null (right); `ctx` carries this problem's earlier pointers (a second zero tap) and whether the column needs nothing (`extra` at the lend); the answer move defers to `E.takeSlip` with `shown: true`, `kept` at a lent-then-got column naming `keptGot` |
| `E.takeMoveHelp(def, plan, col, moveIdx, slip, style, mode)` (new; `mode` as built, `'hers'` by default) | `{ say: [line, line?], fix: { move: 'touch' \| 'lend' \| 'get' \| 'undo', col, value? } \| null, next, marks, stage, picture, glow }`: `fix` the move made for her (`'undo'` an `extra` touch's strike; null for a pointer that only lights the lender), `next` the move she makes next; `slip` a slip's name or `E.takeMoveSlip`'s object (`touched` for `extra`: the hundreds struck at a ones turn says `extraTouch.onesFar`). At the answer, v0.3's sand help (`help`, `E.takeHelp`, her marks kept). A wrong digit at a chain's first decide says `zero`'s line, then `chainFirst` (logged `fact`) |
| `E.takeAheadLine(def, q)` (new, the review's) | the `ahead` line for a question showing her pale digit (`q.pale`), recomputed from the plan (`'flip'` when bottom − top is her digit), for a page picking the column up again (a reload, ‹, Camp): `[line]`, or null; nothing saved for it |
| `E.takeHelp` (changed) | with `opts.style` (a moves problem), every step's `marks` is `E.takeMoveMarks(plan, style, col, lastMove)`, unchanged by the help; without it, v0.3's |
| `E.takeShow(def, plan, col, opts)` (changed) | `'show'`'s moves (`steps: [{ say, idx, move, touch, marks, picture, ask }]`: each number asked, her box ringed; `touch` the column the page calls `T.touch` on for Tallyheart; `ask` `{ col, kind, value, reads? }`) and `'tap'`'s prompts (`taps: [{ say, idx, move, glow, col, marks, picture, ask }]`, `askLend`/`askGet` said only for a link of a kind no earlier chapter taught, by the set's `teach`, else `say` null and the box still ringed), in `opts.style`, with `here` and `line` as v0.3's; `idx` the move each stands at; the picture moved before each ask |
| `E.takePicture(def, q, stage)` (changed) | a new stage key `half`: `{ col, spreads: k, half: true }` is the k-th spread's lender decremented and its piece resting unopened in the receiving zone, drawn by `placeValue` as `spread.stage: 'out'` (static); every v0.3 stage as it was |
| `T.touch(st, def, col, now, ms?)` (new; `ms` as built, the touch's time, else 0) | a tap on a column: `{ ignored: 'off' }` outside the gate (v0.3's column takes no taps); `{ ignored: 'own' }` her own column (the page wiggles it), `'done'`, `'move'`, `'target'`, `'show'`, `'col'`; `{ undone }`, a second tap on the lender **she** struck while its box is empty (the last logged move her own `'t'` of that lender: a strike a help, the second zero tap or the touch made after `ahead` made for her is never undone), back at the decide, a nudge, logged `'u'`; `{ pointer: 'zeroFirst' \| 'where' \| 'gave' \| 'order', line, say }` (the lender lit; `order` once a problem, not counted); `{ slip: 'zero', help }`; `{ accepted, box }`. In `'tap'` a target that is not the glowing lender is v0.3's tap off the zone (`off`, `tapHere` once); in `'show'` the page makes Tallyheart's touch on the step's `touch` (the right lender only, `worked: true`, not logged as hers) |
| `T.tap(st, off, def?, now?)` (changed) | under the gate a thin wrapper: `T.touch` on the glowing column (or, with `off`, v0.3's tap off the zone); null when nothing glows, so a caller's `while (q.tap) T.tap(st)` never spins (`q.tap` counts the touches left only while one is due); off the gate v0.3's exactly |
| `T.digit(st, def, value, ms, now)` (changed) | the ringed box's OK: a move's number (`value` may be `'13'`) or the answer as v0.3; returns the move's result, its picture stage (`half` after a lend, the open after a get, in `'hers'`), the next box, `res.marks` from `E.takeMoveMarks`, and at a problem's end v0.3's entry with `helped` and `correct` as section 1a.4 says (`helped` = a slip; `correct` = no slip, no counted pointer), the twin by section 1a.4's rule, and the end line by `helped`. As built, its pointers by name: `'onesFirst'` (v0.3's ones-first pointer; off the gate still `pointer: true`), `'ahead'` (with `form` and `pale`), `'tapLine'` (the first digit while the lender is lit: `tap`'s line), `'touchMade'` (the next: the touch made for her, `askLend`), `'nine'`; in `'show'` a wrong number is `res.lettered`, no slip; `{ ignored: 'guard' \| 'tap' \| 'show' \| 'digit' \| 'empty' }` (the 400 ms guard after an OK ignores OK only). Every move's result (and `T.touch`'s) also carries `line` and `say` (the help's or pointer's, else the `'tap'`/`'show'` ask or step at the new move), `stage` (`flight: 'open'` where a link has just landed), `picture`, `marks`, `box`, `targets`, `glow` and `moveIdx` |
| `T.question(st)` (changed) | adds `move`, `moves`, `box` (`{ col, kind: 'lend' \| 'get' \| 'answer', row: 1 \| 2 \| 'front' }`), `targets`, `style`, `pale` (her `ahead` digit), `glow`, and the marks from `E.takeMoveMarks` on a moves state |
| `E.takeMarksPage(def, cat)` (new) | `{ lines, options: [{ style: 'one', label }, { style: 'above', label }], after: { one, above }, current }` from the set's `marks` or the kit's lines |
| `E.takeStyle(cat)`, `E.setTakeStyle(cat, style)` (new) | read (default `'above'`) and write `cat.takes.style` (creating `takes` as `E.logTake` does) |
| `E.takeLesson`, `E.takeRoundStart` (changed) | pass `style: E.takeStyle(cat)` to the state |
| `E.TAKE_SLIPS` (changed) | `zero`, `flip`, `nospread`, `kept`, `lend`, `get`, `extra`, `fact` (the two new names in their place in the order) |
| `E.TAKE_LINES` (changed: new keys; every v0.3 value as it was but `tapHere`, which no live chapter says, and `tap` gaining `onesZero` and `tensZero`) | `showLend`, `showGet` (`above`, `one`), `chainLend`, `chainGet` (`above`, `one`), `chainLend2`, `chainFirst`, `askLend`, `askGet` (`above`, `one`), `extraTouch`, `zeroTouch`, `zeroStop`, `zeroLend`, `nine`, `keptMove`, `keptGot`, `lendMove`, `getMove` (`above`, `one`), `ahead` (`right`, `flip`), `where`, `gave`, `order`, `marksAsk`, `marksAfter`, `marksLabel` (`one`, `above`); each with its column, zero and none forms, tokens as v0.3 (`{old}`, `{left}` and `{new}` new number tokens); `tapHere` becomes "The {rows}: the glowing ones." Every value is written out below ("The new lines") |
| `E.checkTakes` (changed) | a set's `marks` key: `{ lines: [balloons], one: [balloons], above: [balloons] }`, each balloon `{ who, text }` of 12 words or fewer, no Spanish; the new `lines` keys accepted |
| `E.takeTable(cat)` (changed) | each row gains `moves` and `movesRight` (her own first asks' moves, right first time: "Marks right"), `ahead` and `aheadFlip` (the `ahead` columns where bottom − top is her digit too: chapter 13's final review); the commonest slip counts the move slips; "Teen facts missed" counts only `fact` slips at the answer move; the typical time is `cols`' sum |
| `normTakes`, `okTakeState` (changed) | `style`, and the state's new keys (above) |

**The new lines** (exact, from the plan's engine brief). `E.TAKE_LINES` gains these keys, tokens as v0.3's: `{old}` the
lender as it stood, `{left}` as it now stands, `{new}` the receiver's new number, all as number words, with capitalised
forms `{Old}`, `{Left}`, `{New}`; a count before `rows` or `squares` agrees, so "One row" and "Four rows". Every v0.3
value is as it is, but `tap` gains two forms and `tapHere` changes (no live chapter says it: chapter 12 has no `'tap'`).

| key | forms and text |
|---|---|
| `tap` (adds) | `onesZero` "No {loose}. {Spread} a {row}: tap it." · `tensZero` "No {rows}. {Spread} a {square}: tap it." |
| `tapHere` (changed) | `tens` "The {rows}: the glowing ones." · `hundreds` "The {squares}: the glowing ones." |
| `showLend` | `ones` "So I {spread} a {row}. {Old} {rows}, one goes: {left}." (old 1: "So I {spread} a {row}. One {row}, one goes: none.") · `tens` the same with {square}/{squares} |
| `showGet.above` | `ones` "Ten more {loose}: {new}. Write it on top." · `onesZero` "Ten {loose}: ten. Write it on top." · `tens` "Ten more {rows}: {new}. Write it on top." · `tensZero` "Ten {rows}: ten. Write it on top." |
| `showGet.one` | `ones` "Ten more {loose}: write a little 1 in front." · `onesZero` "Ten {loose}: write a little 1 in front of the zero." · `tens`/`tensZero` the same with {rows} |
| `chainLend` | "So a {square} first. {Old} {squares}, one goes: {left}." (old 1: "So a {square} first. One {square}, one goes: none.") |
| `chainGet` | `above` "Ten {rows}: ten. Write it on top." · `one` "Ten {rows}: write a little 1 in front of the zero." |
| `chainLend2` | "Now a {row}. Ten {rows}, one goes: nine." |
| `chainFirst` | "So a {square} first." |
| `askLend` | `ones` "One {row} goes. How many {rows} now?" · `tens` "One {square} goes. How many {squares} now?" |
| `askGet.above` | `ones` "{Top} {loose}, and ten more. How many {loose} now?" · `onesZero` "No {loose}, and ten more. How many {loose} now?" · `tens`/`tensZero` the same with {rows} |
| `askGet.one` | `ones` "{Top} {loose}, and ten more: write a little 1 in front." · `onesZero` "No {loose}, and ten more: write a little 1 in front." · `tens`/`tensZero` the same with {rows} |
| `extraTouch` | `ones` "Careful: {top} take away {bottom}? The {loose} have enough. No {row} goes." · `tens` "Careful: {top} take away {bottom}? The {rows} have enough. No {square} goes." · `onesFar` (a ones turn, the hundreds struck; a chapter's own `extraTouch` without it falls back to `ones`) "Careful: {top} take away {bottom}? The {loose} have enough. No {square} goes." |
| `zeroTouch` | "That zero has no {rows} to give. So a {square} first." |
| `zeroStop` | `ones` "Careful. Ten {rows} now, and still only {top} {loose}. Now a {row}." · `onesZero` "Careful. Ten {rows} now, and still no {loose}. Now a {row}." |
| `zeroLend` | "Careful. That zero is ten {rows} now, and one goes: nine {rows}." |
| `nine` | "Yes, nine soon! First the zero gets ten {rows}." |
| `keptMove` | `ones` "Careful. One {row} goes to the {loose}. {Left} {rows} now." (left 0: "… No {rows} now.") · `tens` the same with {square}/{rows}/{squares} |
| `keptGot` | `tens` "Careful. One {row} went to the {loose}, then ten came: ten {rows} now." |
| `lendMove` | `ones` "{Old} {rows}, and one goes: {left} {rows}." (old 1: "One {row}, and one goes: none now.") · `tens` the same with {squares} |
| `getMove.above` | `ones` "{Top} {loose} and ten more: {new} {loose}." · `onesZero` "No {loose}, and ten more: ten {loose}." · `tens`/`tensZero` the same with {rows} |
| `getMove.one` | `ones` "Ten more {loose}: a little 1 in front. {New} {loose}." · `onesZero` "Ten {loose}: a little 1 in front of the zero." · `tens`/`tensZero` the same with {rows} |
| `ahead` | `right` "Right! Now show me your marks." · `flip` "Marks first, then the answer." |
| `where` | "Next door first: the {rows}." |
| `gave` | "The {squares} gave already. Now the {rows}." |
| `order` | "{TakeAway} first, then the next column." (as built: every maths word a token; it reads "Take away first, then the next column.") |
| `marksAsk` | ["When you {spread} a {row}, how do you write it?", "Both are right. Tap the marks you like."] |
| `marksAfter` | "Then that’s how we’ll write it." |
| `marksLabel` | `one` "A little 1 in front" · `above` "The new number on top" |

**The corner's table** counts the moves, and changes nothing until a row has moves: then a column **"Marks right"** ("34 of
36", her own first asks' moves right first time) between "Right first time" and "Helped"; the note under it says what a
mark is; "Answered before her marks: 3. Her digit was right; they are never counted right in “Right first time”,
nor in its typical time." under the table when `ahead` happened (an `ahead` problem is never `correct`, so it is in neither), with "(1 where
the smaller from the bigger gives the same digit)" after the count when bottom − top was her digit too (`E.takeTable`'s
`aheadFlip`: that digit cannot be told from a flip that lands, section 1a.1, so the corner never calls it worked in her
head); the slips' words gain `lend` ("wrong new number for the one that gave"), `get` ("wrong new number for her
column") and `kept` becomes "did not take one off". Then the style line (section 1a.2), once `ones2` is learned or a style
is set. A chapter-12-only player's corner is as it is. (As built after chapter 13's final review, 2026-11-10: the line
was "In her head first: 3", which said nothing of what it left out and credited the flip form, and the two move slips
named a place, "new number for her column".)

**Untouched**: the Counts runner and `runLesson`, the cross-table Counts warm-up (`E.lessonFacts`, `E.questionDef`), the
Warrior Counts, `E.takePlan`, `E.takeKind`, `E.takeFlags`, `E.takeShape`, `E.takeTwin`, `E.takeWarm`, `E.takeStepOf`,
`E.hardTakes` (a helped first ask, as now), `E.takeSteps`, `E.storeOpen`, `E.takeMarks`, the shelf's other buttons, the
echoes (`E.takeEcho`; no column is echoed), book two.

**Art, page and tools with moves**, the names as built (2026-11-09, the owners' notes and the review's round; the notes
are in `~/potomac-crossing-work/regroup/build-art/`, `build-page/`, `build-tools/` and `fixer/`):

| Piece | What it does |
|---|---|
| `PC.art.placeValue(o)` (changed) | `o.spread.stage === 'out'` drawn statically: the k-th spread's lender already decremented and its piece (a row, or a square) resting unopened in the receiving zone's tray, beside the old pieces, in the zone's own drawing, with no animation and no flight (`E.takePicture`'s `half`); as built a plain group `pc-pv-row` or `pc-pv-square` with `pc-pv-out` at the slide's end box (no `<style>`, no `pc-pv-moving`, so Reduce Motion draws the same), the receiving zone's fresh block not drawn, and its `aria-label` adding "a row resting by the loose, not yet opened" (a square by the rows); every other option and stage byte for byte as before (19,065 pictures pinned before the change); `dev/gallery.html`'s take-aways section gains the three `'out'` pictures (a row, a square, a zero's row) |
| `PC.ui.takes` (changed; pure, Node-tested) | `takeView`/`takeHtml` gain the moves view (`takeCellMoves`, `takeCellHtml`, `tMini`, `tMarkHtml`) and emit identical markup for a column with no moves (chapter 12's columns hashed against v25's own `ui.js`); `takeReserve` hands a moves problem to `takeReserveMoves` (with `takePrompts`, a `'tap'` or `'show'` turn's prompts, and `takeSlotLines`, the slot's candidates, each target's `extra` line among them), whose slot stands in place of `tSlotFirst`'s lines (a help takes the place of the column's line, of the page's intro and of a twin's or the warm-up's introduction; a prompt stays); `takePress2` (the two-digit box: a digit added while it holds fewer than two, starting again at two, so 1, 4, 1, 3 gives 13), `takeKey`, `takeTapAct` (a press over 10 px of slide or 0.5 s held is no tap), `takeMarksHtml`, `takeMarksGlow`, `takeMarksFlow` (the marks page's run), `takeStageAt` (the store at a move picked up), `takeStoreLabel` (the resting piece said apart: "Six rows, four loose, one row resting"), `takeCorner(takes, table, secs, steps)` |
| `runTakes` (changed) | under `mv = E.takeMovesOn(st)` the frame takes `.tmoves` and each v0.3 function gets one `if (mv) return …M()` at its top, its own lines kept: `outlineM`, `drawColM`, `slotSay`, `moveStore` (the slide to `'out'` 600 ms, the open 400 ms, picture only), `wakeM`, `showOpenM`/`showTouchM` (Tallyheart's touch through `T.touch`, the paw-tap ripple), `tapM`, `resumeM`, `afterMove`, `moveHelpM` (phase `'mhelp'`: the keypad `.dim` and its keys ignored for the reading time), `flashBox`, `pressM`/`digitM`/`submitM`/`answerM`, `touchCol`, `wigCol`, `offTapM`, `colClickM`/`panelClickM`/`stackClickM`, and the `'marks'` phase, `marksPhase` (when `needMarks()`: a problem's first move asks a spread and `cat.takes.style` is absent). As built: a move's clock (`startClock(items)`, with `clockGen`, bumped only on the moves path) is never reset by the first column's delayed restart, and a `'tap'` problem's touch clock starts after its lines are read; `quietUntil` (400 ms after a phase change, the zone's taps too); `slotAsk` (the ask made for her after `ahead` leaves the slot once she types the lend); a pale `ahead` digit picked up again letters `E.takeAheadLine` in the slot, unsaid; a `'tap'` or `'show'` column picked up at its answer says its line once; a later column brings the keypad back into view (WebKit's scroll anchoring); `bringIn` never scrolls the stack's first balloon under the bar (its 8 px margin goes first); `.tsecond` set as a problem begins, when its own marks need the second row or a lent hundreds can take an `extra` touch at the tens; the slot's balloon `.tslot`; a new problem with no `moveStyle` takes `styleNow()` |
| `marksPage(host, o)` (new) | the marks page (section 1a.2) drawn into `host` (`.tpickwrap`, then `.tpick`, `.tlive` once live; buttons `.tpb` with `data-style`, `aria-pressed`, `aria-disabled` until live), returning `{ glow, live, press, onPick, remove }`; called by `runTakes`' `marksPhase` (the frame `tmkpage`) and by `renderMarks(opts)`; no new view. `PC.debug.takes` writes nothing to the test cat: its pick sets the page's own `o.style` |
| `renderHollow`, the shelf (changed) | `renderMarks(opts)` at its top for `{ marks: true }` (the shelf's `data-mode`, Tallyheart with the kit's lines, both buttons live, `hollowSub = 'marks'`, ‹ back to the shelf in `onBack`, the warrior pins kept); **My marks**, `#marksBtn`, a normal `.btn` beside My nest once `ones2` is learned or a style is set, its icon `takeMarksIcon(style)` (`.tpickicon`, the digit at 32 px; its margins pulled in for `'above'`'s stacked 13 over 3, so the button is as tall as My nest); on a phone held sideways both on one row, 46 px; `openGrownups` passes `E.takeSteps(c, stories())` |
| `takeCorner` (changed) | "Marks right" and "Answered before her marks: N" (with "(M where the smaller from the bigger gives the same digit)" from the row's `aheadFlip`, and that these are not counted in "Right first time" or its typical time: chapter 13's final review) only when a row has moves; the note "Her marks are the new numbers she writes when she spreads: the one that gave, then her column. “Marks right” is how many of them, in her own first tries, were right first time."; the style line once `ones2` is learned or a style is set; the slips' new words (`kept` "did not take one off" only on a row with moves); a chapter-12-only cat's corner byte for byte |
| `PC.debug.takes(what)` (changed) | gains `touch`, `lend`, `get`, `get:one`, `chain`, `help:move`, `ahead`, `marks` and `hollow:marks`, on stub definitions of its own with `taught: E.TAKE_STEPS` (chapter 13's `marks` lines inline, `TAKE_DEBUG_MARKS`, or `PC.story.ch13`'s once present); `q`, `show`, `tap`, `spread`, `echo`, `sand` and `done` pass `taught: E.TAKE_STEPS`, so they show v0.4 (`show`'s steps: 0 the opening line, 1 the square's lend, 2 the zero's ten, 3 the row's lend, 4 the loose, 5 the column's line); `first`, `shelf` and `store` stay as they were (no `taught`) |
| `index.html` | about 90 lines in the take block, on `.frame[data-mode="take"].tmoves`, `.tpick` and `.tpickicon` (and two `.frame[data-mode="shelf"]` rules for the sideways shelf's row): `.tmini` (`.tw2` a get's, `.on` ringed, `.right` the flash), the `'one'` front box `.tfront.tfb` (`.tfit` for two digits), the second marks row `.tmark.tm2` (the chip kept as `.thead.tgone`), struck groups `.tgrp.tstruck` (a ¹0 struck as one, `.tfs`), the targets `.ttarget` (`role="button"`, its column's width plus half of each gap, at least 44 px, `.tfar` for a column not next to hers), `.thalo`, `.tripple`, `.twig`, `ahead`'s pale digit, the slot; on a phone held sideways the second marks row's box takes a 2 px border and .72em digits, so a 9 sits inside its 14 px row; nothing outside those selectors changes |
| `tools/shots.mjs`, `dev/webkit/run.mjs` | `TAKE_TARGETS` and `TAKE_SCREENS` gain `take:touch`, `take:lend`, `take:get`, `take:get:one`, `take:chain`, `take:help:move`, `take:ahead`, `take:marks` and `hollow:marks`; `TAKE_NEXT` (exported) is a map, `take:q` and `take:echo` `'column'` as before, `take:lend` `'lend'` and `take:get` `'get'` (`@next`: `TAKE_MOVE` types the ringed `.tmini.on`'s right number, `TAKE_MOVE_UP` waits for the next box; the keypad must not move between them); `TAKE_COMPARED` (exported): `take:first`, `hollow:shelf`, `store:q` and the eight `es:` screens; a tree that lacks the new targets gets one note job per Aa |
| `dev/webkit/measure.js`, `tools/sweep.mjs` | measure: `tmini` (every shown `.tmini`: its box, `on`, `front`, its own digit and its neighbour's mark), `ttgt` (each `[role="button"]` in the column: its own box as the hit box, and whether it is live), `tslot`, `tpick`, `tone` (the marks page's little 1 and its rendered size) and `hx` (the markup's hash, for the compare); sweep: `col-off` widened, `hit-small` and `marks-small` new (section 6, "The gate"), `keypad-moved` "between one move and the next" on `take:lend`/`take:get`; `--takes --compare DIR` measures the other tree's `TAKE_COMPARED` alone and `compareCaches` gains `takes`; `prune(...keep)` and `ensure`'s `keepAlso`, so a compare never deletes the cache of the tree it compares from |
| `tools/storyboard.mjs` | a take set's `marks` printed as "**Then the marks page**" (its lines and after-lines, the labels) as its own paragraph before the problems' lines, "before N − M's prompt" naming the first problem with a spread; a set with no spread says it never shows; every other chapter and `warrior.md` byte for byte. The take-aways paragraph above it still words v0.3 (the picture spreads, the zone glows) for a set under the gate |

## 9. Tests

*Tests 1 to 17 are v0.3's; those decision 57 changes run both paths, unchanged with no `taught` and with moves
under a `taught` stub, as the paragraph after them says.*

`tests/takes-engine.test.js` (the engine), `tests/takes-exhaustive.test.js` (the engine's exhaustive checks, in
`tools/test.mjs`'s `SLOW` list, so the fast tier stays under its 8 s), `tests/takes-art.test.js` (the pictures),
`tests/takes-ui.test.js` (the page's pure helpers in Node, its wiring pinned as text) and `tests/takes-tools.test.js`
(the storyboard, the shots targets, the measure and the sweep's `col-off`), in the suite, on the real chapters 1 to 11
and a stub chapter 12 and 13 with take sets (and stub take sets for every step, for the Hollow),
`tests/fixtures/takes-stub.js`, until the real ones land. Cases worked out in the work folder (`check.js`,
`check-v0.2.js`) are copied into the tests; no test reads outside the repo.

1. **The plan** (exhaustive). `E.takePlan` against a − b for every top 10 to 999 and every bottom below it with no more
   digits (498,465): the digits, at most two spreads a turn, every top at a turn 0 to 18, the kinds' counts as section
   3's table; the marks of 503 − 278 (4, 9, 13) and of 811 − 356 (7, 10, 11, its tens lettered 0 first).
2. **The kinds and flags** of every problem in section 3's chapters' table, as it says.
3. **The guards.** `E.checkTakes` refuses each bad fact (a negative, 0, a four-digit top, a longer bottom, a decimal, an
   answer two digits short, a `table`, a bad `regroup` or `picture.kind`, a balloon of its prompt over 12 words, the
   last one the page joins among them, captions apart), a bad set key
   (`teach` not a step, `twins` or `warm` not a boolean, an unknown `lines` key), a Counts set lending to a take set, a
   step's set with the wrong count of its step or a later step among the rest, a `mixed` set of three kinds, an answer
   twice in a chapter, `noHundreds` before `mixed`; it passes the stub and, once they land, chapters 12 to 21.
4. **A column at a time.** Through `T.digit`: right digits move a column at a time, ones first; a wrong one names its slip
   and is logged once, the column done with the right digit; the leftmost blank box is asked (0, or OK on the empty box,
   right; a 1 at 500 − 467's hundreds `kept`), and OK is lit on every problem's leftmost box; an OK within 400 ms of the
   last is ignored (a double tap at 475 − 132's tens leaves the hundreds empty and unanswered); `pos` moves only at a
   problem's end; one log entry a problem, in `takes`, never `counts`. In `'hers'`, a later column's line names its
   bottom and never its top, and a lender's gold value waits for its own digit, unless a help drew its spread (503 − 278's
   ones helped: the 9 and the 4 lettered before the tens; its tens helped: the 4 still waits); `again` for a right twin and
   `rememberedStep` for a round's hard step right, never blank; the ones-first pointer (a wrong first digit equal to the
   answer's leading digit, in her first five or a `teach: 'none'` set: not checked, not logged, once a problem). Three
   students on every module problem with a spread, every column asked, the leftmost blank box among them (each types
   there what its rule gives; 0, or nothing, is right): one who takes the smaller from the bigger and one who never takes
   the one off are each green on none (`check-v0.3.js`; v0.1's lines, its blank filled, let them through on 7 and on 45;
   at the blank hundreds of 731 − 696, 500 − 412, 503 − 478 and 500 − 467 both type 1, `kept`), with `kept` at
   43 − 16's tens, `zero` at 503 − 278's tens and `kept` at its hundreds; one who spreads where nothing needed it gets
   `extra` at 475 − 132's tens. The full line on a set's first two `'hers'` problems (chapter 13's 85 − 39 and 97 − 52,
   after its `'show'` and `'tap'` ones), every `'show'` and `'tap'`, a twin and after a help.
5. **Every slip's help** (section 2's cases, by value, in the engine file; the sample in the exhaustive one). For
   every three-digit problem of each kind (a sample of 2,000 a kind, seeded) and every column, every wrong digit 0 to 9:
   a help whose steps end on the right digit, whose spreads are the plan's, whose take hops end at the digit (old marks
   first), whose first line is the slip's; at a chain's turn `zero` only for bottom − top and 0, `fact` with the chain drawn for the
   rest; at a lent zero `zero` only for 10 − bottom, the bottom and 0; `extra` only at the tens or the hundreds, where the
   column did not lend (never the ones: 2 at 475 − 132's ones is `fact`); `flip` at the tens and on a 0 with its own
   words (section 2); the sand's numbers at each step the top as it stands. `extra` only once its spread is taught
   (chapters 12 to 15's sets played through the runner, every three-digit sample under three `taught` lists) and never
   for a 0 where the bottom is empty or 0; at a lent column that needs its own spread, `kept` before the written top's
   `flip` and before `nospread`.
6. **The twin** (the 1,000 seeds in the exhaustive file). For each chapter problem and 1,000 seeds: the same shape and
   kind, a new top, no answer of the lesson's, at most 400 draws, and for `'hers'` no spread turn whose flip lands on its
   digit; forced (`TRIES` 0): the original. Queued `E.REQUEUE_GAP` later or next when last, with `of` its original's key;
   at most twice by lineage (a twin's twin counts against the first problem); its log entry's `twin` that key; seeded by
   `startedAt`, `pos` and the requeue count; `'show'`'s twin `'tap'`; no twin with an answer its chapter has (a hundred
   starts of every stub chapter's sets, each problem's first column missed).
7. **`'show'` and `'tap'`.** `E.takeShow`'s steps across a row, a square and a zero (the zero's mark "10", then "9");
   `T.tap` spreads one at a time, a digit before it types nothing, a tap off the glowing zone says `tapHere` once; the
   column's line after it says the new top.
8. **The record.** Entries as section 4 says (round and warm-up entries first asks, `round: n`); `E.takeStepOf` on
   500 − 412 (`zeros`), 503 − 478 (`zero`), 731 − 696 and 382 − 345 (`mixed`), 43 − 16 (`ones2`); `E.hardTakes` from first
   asks only (not twins, `worked` or `'tap'`), a step leaving once right; `E.takeTable`'s rows (right first time of her
   own first asks, the typical time of her right `'hers'` answers) and its teen-facts row (a written top's flip is not a
   teen fact); the cap at 500, and the table's `capped` at it.
9. **The slots.** Random walks through chapter lessons (take and Counts), Hollow rounds of both, and reloads: nothing
   lost; a take lesson waits in its place and comes back at its frame, problem and column; a store round gives way and
   comes back through `hollowWaiting`; a take state never reaches `E.counts.question`.
10. **The Warrior Counts.** A re-sit waiting after the pass: one take answer in a chapter lesson, and one in a store round,
    set it aside (`'practice'`); a digit typed with its problem unfinished does not; a Hollow visit with no answer does
    not; a take lesson begun opens with the waiting line, and so do the shelf and a store round picked up; a take answer
    stamped ahead of a clock set back still sets it aside, and still lets a new sitting start.
11. **The warm-up across both.** `warmHard: { table: 'all', at: [0, 1] }`: her two hardest at 0 and 1, `hard`, with their
    anchor `table`; one hard fact, then the set's; none, the set as written; a set pair equal to a pick gives way to
    `alt`; a take answer never changes it; for all 54 pairs as a pick, `E.questionDef` gives the anchor's words and
    picture, so the question and the help read in the anchor's way ("Seven spiders. How many legs?" for 7 × 8) and draw
    a picture that is not the fallback, the set's own lines kept; `E.takeWarm` a two-digit `ones` avoiding the chapter's
    answers, its flip never landing.
12. **Count the store.** Closed until a `teach` set is finished, then the shelf; every round five distinct answers, the
    first `none`, hard steps at 2 and 3, the newest at 4, older steps that spread at 3 and 5 (so one `none` unless it is
    hard), section 5's round 1 as built, no line about a step she has not learned, `noHundreds` only after `mixed`, no
    flip landing; the finish once, returned as `mode: 'store'`, a frost treasure in turn by the store's rounds (ids
    distinct from `E.TREASURES` and `E.GIFTS`), `hollow.rounds` and each Count's record untouched; each template's step
    its row, and once chapters 12 to 21 land, each template against its step's chapter (one of its lesson's problems;
    the store's own two, its step).
13. **Number words and the words table.** `E.numberWords` 0 to 1,000 against a hand list of the tricky ones (101, 110,
    118, 503, 999) and equal to `E.countWords` to 100; every kit line filled for each column of each kind, at the ones
    and the tens, on a top of 0 and not, with no `{` left, singular and plural right ("one row", "two rows"), no "Only
    zero"; a token for every form `E.TAKE_WORDS` lists, and no form of one written literally in any `E.TAKE_LINES` value;
    the regrouping word's token never followed by a pronoun ("it", "them") nor left with nothing to act on; with the
    word set to "trade", "regroup" and "break apart", every line that says it changes, no "spread" is left, and the
    filled lines are pinned ("Spread a row: tap it." becomes "Break apart a row: tap it."); `E.TAKE_WORDS` read at call
    time (a `PC.words` stub loaded after the engine is seen).
14. **Migration.** A cat with `takes` goes through the store unchanged, idempotently; junk dropped (not an object: no key;
    bad entries out; `kind` recomputed; a `__proto__` holding `takes` makes none); a lesson whose take state is bad (a bad
    `taught` or `avoid` among them) is dropped from `lesson`, a place and `hollowWaiting`; the cap at 500.
15. **Chapters 1 to 11 and the Warrior Counts unchanged** (section 8's list): `cat.counts`, `cat.hollow`, `cat.warrior`
    and the module-1 part of `cat.nest` deep-equal before and after a take lesson and a store round, for every golden end
    cat; `E.questionDef` unchanged for every existing set and question.
16. **The pictures.** `PC.art.placeValue` for 0 to 999 and every spread stage, with and without `fresh` (10, and 9 after
    a chain), draws within its box with the right number of each piece; `kind: 'quick'` sand for hand-written options
    (every crossed, fresh, take and lit count a help can make, a crossed line among the fresh ones across a zero with
    them); neither throws; the existing `art.sand` calls draw byte for byte; `art.kit.quick`
    and `art.quickMarks` draw the same marks.
17. **The page** (pinned as text, as the Warrior Counts' page is, and in Node through `PC.ui.takes`): one digit a box;
    Delete empties; OK dim on an empty box but the leftmost; the marks lettered per column by the mode; `'tap'` keypad
    dim, the tap target and the hidden button; "Got it!" at the top of the keypad's place; the keypad brought into view;
    the keypad's box the same at column 1 and column 2, with no echo and with a stub echo (the stack's `min-height` with
    the echo's room, the reserved marks row, the column top-aligned sideways); the next column outlined after the last
    spread lands, or at once with no spread, keys ignored until then and for 400 ms after every OK (a second OK at the
    tens never answers an empty hundreds); the reading order (the prompt, the question in words, the column's line);
    `plain()`'s minus from the words table; the shelf's ‹ to the shelf; the media queries, the phone-sideways stack over
    the panel among them, and the take block's CSS (`.tbox` colours, the gold ring, `.tmark`'s shadow, `.tstruck`); every
    `E.takeHelp` step of section 2's 33 cases, and of a small seeded sample (five three-digit problems of each kind, every
    column, every wrong digit: 810 helps), drawn without throwing, with the right counts, so the file stays in the fast
    tier's 8 s (test 5's 2,000 a kind are the engine's, in the exhaustive file, and test 16 draws every count a help can
    make from hand-written options).

**With moves (v0.4, decision 57)** (`~/potomac-crossing-work/regroup/plan.md`, "The proofs"). The v0.3 tests that change
are rewritten so each runs **both** paths, unchanged with no `taught` and with moves under a `taught` stub: takes-engine's
4 (a column at a time, the help's marks, the three students), 6 (lesson twins), 7 (`T.tap` and the `'tap'` lines), 9
(`answerProblem` with touch, lend, get) and 12 (a round played); takes-ui's `E.takeMarks` view pin and the `T.tap`/`tcol`
wiring pins; takes-tools' `TAKE_SCREENS`, pinned anew. `tests/fixtures/takes-stub.js` gains chapter 13's lesson set
(`teach: 'ones2'`, chapter 13's four `marks` lines and two after-lines; 43 − 16 `'show'`, 70 − 34 `'tap'`, 85 − 39,
97 − 52, 486 − 253), a stub chapter 14 set (`teach: 'ones'`; 352 − 127 `'show'`, 640 − 218 `'tap'`, 462 − 135,
768 − 315) and a stub with 503 − 278 and 702 − 345 under a `zero` set and 811 − 356 under `both`, never served;
`tests/fixtures/v1.js`'s take branch makes the moves when `T.question(st).moves` is present (each target `T.touch`, each
box `T.digit` with its right value, then the answer), else exactly as before; `tests/fixtures/takes-v25-entries.json`,
made by `tests/fixtures/make-takes-v25.js`, holds v25's entries, final states and lines for chapter 12's lesson (right,
and with each slip that set can raise), its store set, a chapter-12-only round and `T.start` with no `taught` (43 − 16,
503 − 278, 811 − 356 and 52 − 27, right and with `flip`, `kept` and `zero`, and in `'tap'` mode through `T.tap`),
recorded before any change and never again.

**The proofs of decision 57**, each a test (E the engine's, A the art's, U the page's, T the tools'):
- E1. **The moves come before the answer.** Under a `taught` stub, at 43 − 16's ones in `'hers'`, `T.digit` with 7 before
  any move does not end the column: `ahead` (`right` form), `move` still 0, `pale: 7`, the tens glowing; the column ends
  only after `T.touch(st, def, 1)`, `T.digit('3')`, `T.digit('13')` and OK on 7. In 52 − 27 the same with the `flip`
  form.
- E2. **She touches the part and puts in the new number.** After `T.touch` on the tens, `E.takeMoveMarks` shows the 4
  struck and its box open; after 3, the gold 3; after 13, the 3 struck and 13 over it (`'above'`), or a gold front 1 and
  the 3 unstruck (`'one'`, after 1 or after 13). 503 − 278: the seven moves in order, both styles, the second marks row in
  `'above'`.
- E3. **The moves over every problem** (`takes-exhaustive`): `E.takeMoves` for all 498,465 (lend 0..9, get 10..18 or 1,
  at most nine moves, at most two marks rows in `'above'`, one in `'one'`), as
  `~/potomac-crossing-work/regroup/designer/check-v0.4.js` section 1.
- E4. **The marks are hers to choose.** `E.setTakeStyle(cat, 'one')` writes `cat.takes.style` and no flag; `normTakes`
  keeps it (and drops anything else); `E.takeLesson` and `E.takeRoundStart` pass it; a problem keeps its `moveStyle`
  through a reload; `E.takeMarksPage` gives the set's lines (the stub's chapter 13 four) or the kit's.
- E5. **Every row of section 1a.4's table**, both styles: `E.takeMoveSlip`'s slip or pointer, `E.takeMoveHelp`'s
  lines filled for every column, zero and none form with no `{` left, with the regrouping word set to "trade", "regroup"
  and "break apart".
- E6. **The students** (`~/potomac-crossing-work/regroup/editor/students-v0.4.js` ported through `T.touch`/`T.digit`):
  exactly its table, both styles.
- E7. **A help keeps her marks**: 43 − 16 in `'one'` answered 8: every help step's marks keep the front 1 and the 3
  unstruck; 503 − 278 in `'above'` answered 4: `m1` 10 struck and `m2` 9 throughout.
- E8. **`helped` and `correct`**: 52 − 27 answered 5 first, then right moves: Glintstar's right line, no twin, entry `{
  correct: false, helped: false, ahead: [0] }`; a `lend` slip alone queues no twin, the second in the lesson does; `kept`,
  `extra`, `flip`, `nospread`, `zero`, `fact` each queue one.
- E9. **Targets**: `[]` at lend, get and answer moves; the tens from `ones2`, the hundreds from `tens`; the undo; `order`
  once; `zeroFirst` then `zero`. E9b (the review's): the undo only of a strike she made herself; a strike a decide slip's
  help, the second zero tap's help or the touch made for her after `ahead` made is `{ ignored: 'move' }`, one slip each;
  her own strike, in `'hers'` and through `T.tap` in `'tap'`, still undone.
- E10. **The modes**: `'show'` asks each number (wrong lettered, no slip); `'tap'` asks only a link new to the chapter
  (the stub chapter 13's 70 − 34 asks both; the stub chapter 14's 640 − 218 none); the picture moves before each ask in
  `'tap'`/`'show'` and after each OK in `'hers'`.
- E11. **The log**: `style`, `moves` (four elements each), `ahead`, `nudges` only on a problem with a spread; the save
  stays version 2.
- A1. **The resting stage** (`takes-art`): `'out'` for a row, a square and a zero's row, static.
- U1. **The marks page**: no button live before the last line; a tap picks, saves `cat.takes.style`, presses the button
  (ring, check, `aria-pressed`); a tap on the other during the answer line switches; a button tap never goes on; the
  stack or panel does; Read to me's order (lines, then labels); stacked at 390 × 844; the shelf's My marks opens it.
- U2. **Taps**: a panel click at a `'hers'` decide calls neither `T.touch` nor `advance`; a column tap within 400 ms of a
  phase change is ignored; a press held 0.6 s is not a tap; the lender's bottom digit is the lender; her own column
  wiggles with no line; the hit box at 844 × 390 is at least 44 × 44.
- U3. **Keys**: "3, OK, 1, 3, OK" typed 150 ms apart gives lend 3 and get 13 with no slip; a move-help dims the keypad
  and ignores keys for its reading time.
- U4. **The keypad stays put**: its box equal at decide, lend, get and answer, with and without the slot filled.
- U5. **The `'one'` front box** takes 1 or 13 and letters the little 1 alone.
- T1. **The screens**: the new shots at the eight sizes, Aa off and on, with `col-off`, `hit-small`, `marks-small` and
  `keypad-moved` clean (the page review's run: `node tools/sweep.mjs --takes` and `--pages`).
- **The review's round** (2026-11-09; `~/potomac-crossing-work/regroup/review.json`, 18 findings, each with a test or a
  measure): section 1a.4's table rows for 702 − 345 typed 5 at its first decide (`zero`'s line, then `chainFirst`, logged
  `fact`) and for `extraTouch.onesFar` (three rows); `E.takeAheadLine`'s; in `takes-ui`, `tsecond` for a lent hundreds an
  `extra` touch can reach, `tSlotFirst` in `takeReserveMoves` (a store round's intro and a twin's introduction go with
  the line), `takeStoreLabel`'s resting row and square, and the marks lines' pins; in `takes-tools`, `TAKE_COMPARED` with
  the shelf and a store round; in `render-tools`, `prune` with a list to keep, run on a scratch cache.

**Chapters 1 to 12 as live, unchanged**:
- L1. Untouched and passing: `tests/story-ch12.test.js`, `tests/spanish.test.js`, the chapter-7, -8 and -9 goldens, the
  fingerprints (`scenes.test.js`, `cats.test.js`), the Warrior Counts' three files, `book2.test.js`, `book2-ui.test.js`
  (the integrator's `--full` run).
- L2. `tests/fixtures/takes-v25-entries.json`, recorded in phase 0: every case played on the new engine gives deep-equal
  entries, states and lines (chapter 12's lesson and store, a chapter-12-only round, `T.start` with no `taught`, `'tap'`
  through `T.tap`).
- L3. `E.TAKE_LINES`' v0.3 keys deep-equal to v25's but `tapHere` (pinned by name); `E.TAKE_SLIPS`' v0.3 names keep their
  order.
- L4. Every v25 fixture save migrates deep-equal; a v25 take state of chapter 12's lesson in the slot resumes at its
  problem and column with the same lines; a v25 `'tap'` state with `tapped: 1` resumes at `move` 3.
- L5. `takeHtml` emits identical markup for every column of chapter 12's problems; `.tmoves` is never set on a
  chapter 12 page; a chapter-12-only cat's corner is byte for byte.
- L6. `node tools/sweep.mjs --takes --compare`: `PC.debug.spanish`'s eight screens and `take:first` byte for byte against
  the live tree (v25); as built (the review's R1), the shelf (`hollow:shelf`) and a store round (`store:q`) too:
  `TAKE_COMPARED`, 88 of 88 at `TAKE_SIZES`, Aa off and on.

**In Safari**, for the shipping check (`tools/shots.mjs`, the screen locked, a fresh short session each, silent): `take:q`,
`take:tap`, `take:sand`, `take:done` and `hollow:shelf`, five shots; the rest is checked in Node, by the sweep and by the
page review's four extra sizes (section 6). With moves, `PC.debug.takes`' spread screens pass `taught: E.TAKE_STEPS`,
so the five are re-shot on v0.4 (section 8, `movesOn`).

## 10. The build: owners and order

**On top of main** (v23, chapters 1 to 11), on a branch of its own. Owners and their files are disjoint:
- **Engine**: `app/engine.js` (section 8's engine), `tests/takes-engine.test.js`, `tests/takes-exhaustive.test.js`,
  `tests/fixtures/takes-stub.js`, and `tests/fixtures/v1.js` (a take branch only, so the test player answers take frames;
  the recorded goldens untouched).
- **Art**: `app/art/cats.js` (`placeValue`, `sand`'s `quick`, `quickMarks`), `app/art/scenes.js` (one entry: `quick` in
  `art.kit`), `dev/gallery.html` (a take-aways section), `tests/takes-art.test.js`.
- **UI**: `app/ui.js` (the frost treasures' drawings in `treasureSvg` among it), `index.html`, `tests/takes-ui.test.js`.
- **Tools**: `tools/storyboard.mjs`, `tools/shots.mjs`, `dev/webkit/run.mjs` (the `takes` job), `dev/webkit/measure.js`
  (`m.tcol`, `m.tbox`, the stack's last `.sb`), `tools/sweep.mjs` (`col-off`), `tools/test.mjs` (`SLOW`),
  `tests/takes-tools.test.js`.
- **Integrator**, after the reviews: `sw.js` (`CACHE` past the live value, `tests/fixtures/sw-shipped.json`'s last), `E.VERSION`
  "0.11.1 (the take-aways kit, …)" and its pin in `tests/engine.test.js`, `docs/build.md`'s new section "The take-aways
  kit (v0.2)" (the names as built), the README's calls, `docs/continuity.md`'s "What chapter 12 inherits".

**Its size.** The Warrior Counts were about 570 engine lines (`app/engine.js` l. 3015 to 3586), about 700 page lines and
about 3,300 test lines. This kit adds a second runner, the plan, the slips, the help and the twins, a whole new page, three
art pieces, the shelf, the store, the warm-up and the grown-ups table: two to three times that. The budgets, per owner:
engine about 1,200 to 1,600 lines; UI about 1,000 to 1,400 page lines and about 200 of CSS; art about 400 to 700; tests
3,500 or more, across the owners. Book two: about 150 engine, 250 page and 300 test lines.

**Order.** The core first, then a second pass, each phase its own workflow run (`docs/production.md`: about 25M subagent
tokens fit in a five-hour window, and the core alone is a window's work).
1. **Core: engine and art together.** Engine: the plan, the kinds and flags, the slips, the help, `'show'` and `'tap'`,
   the twins, the runner, the take lesson, the record, the words and lines, the guards, the migration. Art: `placeValue`,
   `sand`'s `quick`, `quickMarks` and its `kit` entry, from section 8's pinned option objects (the art needs nothing else,
   the engine nothing of the art).
2. **Core: UI and tools together**, on top of (1): the take page (`runTakes`, `PC.ui.takes`, the CSS, `plain()`), the
   storyboard, the shots targets and the measure's `col-off`; the cross-check of the help's steps drawn (test 17).
3. **Second pass: the Hollow and the corner**, engine and UI together, on top of (2): the shelf, Count the store and its
   reward, the cross-table warm-up (`E.lessonFacts`, `E.questionDef`), the waiting re-sit's readers, the grown-ups'
   table.
4. **The reviews:** the engine lens (every rule above, in Node), the page lens (Node, `DRY=1`, the five shots, the four
   extra sizes), the sweep's `--pages` with the take screens, and the compare against the live tree.
5. **Integrate and merge.**
6. **Book two**, the same owners in the same files (engine: `E.books` and its kin, `E.checkStory`'s book guards,
   `tests/book2.test.js`; UI: `renderBook`, `tests/book2-ui.test.js`; art: nothing new), on top of the merged kit, so no
   two owners share a file in one phase.

Each piece takes its own `E.VERSION` point and `CACHE` bump; neither is reachable before chapter 12 ships (no take set,
no module-2 chapter), so both deploy dormant and chapter 12 builds on them.

**v0.4 (decision 57)** is built by `~/potomac-crossing-work/regroup/plan.md`, on chapter 13's branch, and ships with
chapter 13 as v26 (call 57; `CACHE` is already v26 from chapter 13's stub): phase 0, the engine records v25's take
entries (`tests/fixtures/takes-v25-entries.json`) before any change; phase 1, the engine (`app/engine.js`'s kit section,
its tests and fixtures), the art (`placeValue`'s resting stage), this document and chapters 13's and 14's texts; phase
2, the page (`app/ui.js`, `index.html`, `tests/takes-ui.test.js`) and the tools; phase 3, the reviews (the engine lens,
the page lens at the eight sizes, Aa off and on, the compare against v25); phase 4, the integrator (`E.VERSION`
0.13.0 with chapter 13, `docs/build.md`, the README, `docs/continuity.md`) and this document's names as built. About
450 to 600 engine lines, 500 to 700 page lines (70 of CSS), 40 art lines and 1,000 to 1,300 test lines. Chapter 13's
`ch13-take` set, with its `marks`, is coded by chapter 13's frames builder after it, from its spec. **As built**
(2026-11-09, local commit `5b974cb` on `e000777`, then the review's round): about 760 engine lines (most of the excess
comments and the lines table), about 830 page lines and 91 of CSS (the marks page's two homes, the slot, and the tap and
key logic made pure for Node), 28 art lines; the review read it in six lenses (the engine, the page, the compare against
v25, a teacher's for Lissa, and the two its critic added: Count the store with the moves on the real page, and the saved
path with a style change mid-lesson), 18 findings, each checked by a skeptic and all taken, with the build checker's two
(the compare's `prune`, and take:echo at 1080 × 700 with Aa on, fixed another way); the suite 48 files, 2,082 tests, all
pass. The README's entry, "The take-aways kit v0.4", has the calls.

## 11. Calls made, with reasons (under decision 46; for the README)

1. **A take set is a Counts set with `op: '-'`**, on an ordinary Counts frame: no new frame kind, so `E.kindOf`, the
   exits, the frame tests and the storyboard's frame walk stand; "Let's count!" and "Count them again" serve.
2. **One kind a set; a two-step is two frames** (a Count's frame, `done: ''`, then the take's): the multiplication runner
   stays untouched, and story numbers are fixed, so 48 is 48 whether 6 × 8 was helped or not.
3. **Their own runner and their own page** (`E.takes`, `runTakes`), not branches in `C.answer` and `runLesson`: the parts
   that keep chapters 1 to 11 byte for byte are left alone, and the take state is shaped so the slot machinery takes it
   as it is.
4. **Their own log, `cat.takes`**: everything that reads `counts` assumes a × b; filtering a dozen readers was the risk.
5. **Column by column, ones first, with OK** (the study's): she catches and is helped in one column, never a wall.
6. **The heads are the quick picture's marks, not words**, on a sand chip so they read as pictures: short, the same in
   Spanish, and one picture from store to sand.
7. **The gold mark shows a column's value as it stands, relettered when it changes, never stacked**; the chain lives in
   the picture and the sand, so the column reads on a phone. In `'show'`, `'tap'` and the help a zero is lettered "10"
   and relettered "9", about 600 ms apart, so the column shows the zero becoming ten (relettering, not stacking). *Under
   `movesOn`, `'above'`'s second change stands in the heads row's place (call 50).*
8. **A slash strikes a digit**, never a line through it, which would read as a minus.
9. **A leading zero is asked, never filled** (v0.1 filled it): the hundreds of 731 − 696, 503 − 478, 500 − 412 and
   500 − 467 all lent, which is where `kept` is likeliest, and "No squares left. We don't write a zero in front." tells
   her why nothing is written. A 0 or OK on the empty box is right, and OK is lit on every problem's leftmost box, so it
   never gives the answer away. v0.3: keys are ignored for 400 ms after every OK (the guard "Got it!" already has), so a
   double tap on OK at the column before never answers that box with a 0; dimming OK again, as v0.1 did, would have
   told her when an answer is short.
10. **One line a problem, not a digit**: per-digit praise would be noise over a 30-second problem; a right twin and a
    round's hard step get their own specific lines (`again`, `rememberedStep`), as module 1's praise remembers what was
    hard.
11. **Six named slips**, the study's four with "none" (a typed 0) apart from the flip, and `extra`, the unneeded spread
    chapter 17 is there to catch (only at the tens or the hundreds: the ones has nothing on its right to give a row to);
    named from her digit alone; each slip's line has its tens and zero forms (v0.3: `flip` is named at the tens too).
    `zero` is named only for the chain's own mistakes (bottom − top or 0 at the chain's turn; 10 − bottom, the bottom or
    0 at the lent zero); a slip on the teen fact after a right chain is `fact`, and its help does not lecture the chain
    she already did. After the review: `extra` only once the column's spread is taught, so no line names a spread she
    has not met, and at a column that lent and needs its own spread `kept` comes before the written top's flip and
    `nospread`, so each of the two classic bugs there gets its own name.
12. **Take to ten for a teen take; by ones for five or less; a sweep otherwise** (the study's, completed).
13. **A twin comes back with no fillers**, as late as the lesson allows: two 30-second fillers would add a minute, and a
    twin's new digits never test the last ten seconds.
14. **The twin keeps the answer's zeros and blanks too**, not only the spreads: 120 is not 123's twin.
15. **`'show'`'s twin is `'tap'`; every other twin is `'hers'`.**
16. **The worked example is the first of the new step's three** (from chapter 13; chapter 12's brief keeps its own), the
    second is `'tap'`: module-2's budget counts five lesson problems, not six.
17. **The made two-digit warm-up**, a twin of 43 − 16 each time: decision 53's warm-up kept warm without a number in the
    story to write, and never the same twice.
18. **No take-away is hard for being slow**; only a helped first ask, and never a `'show'` or `'tap'` one.
19. **The cross-table warm-up opens on her hardest** (module-2's), its frame `intro: false` so it is timed fairly (chapter
    5's precedent), each pick in its anchor Count's picture.
20. **A problem is the answer** for a waiting re-sit: a digit typed and left is not practice yet.
21. **The shelf comes with the kit**, since a store button on the Counts page would push My nest off a 1080 × 720 screen;
    One Count at a time is today's page, word for word, and its ‹ goes back to the shelf.
22. **Count the store's rounds are twins of the chapters' own problems**, by step, so the round can never ask a step the
    chapters have not taught; two templates of its own (352 − 28, 403 − 57) add a two-digit bottom under a three-digit
    top, which the column lines up for her, and "Nothing to take" in a column that lent, where `kept` shows. Its older
    steps are those that spread (after the review), so a round has one easy problem, not three.
23. **Frost-time treasures for store rounds only**, by the store's own count: module 1's treasure order is untouched.
24. **The kit's words in one table, as tokens, the regrouping word in its base form only** (`E.TAKE_WORDS`, read lazily
    from `PC.words`): decision 53's "easy to change" made true, since a word written into fifteen lines, or used as a
    past tense and a noun, is not one line to change. v0.3: every form the table lists has a token (take away, ones and
    Ones first had none), and the regrouping word stands before its object or after it, never before a pronoun or alone, so
    "break apart" fits every slot too; the `'tap'` line is "Spread a row: tap it.", and chapter 17's question "Do we
    need to spread a row?". Keeping the slots to that rule was chosen over dropping "break apart", which is a likely
    class word.
25. **Book two's volumes are switched by two buttons under its title**; Read my book opens the latest.
26. **Both pieces merge dormant** before chapter 12, each with its own version and cache.
27. **In `'hers'`, a later column's line never says its top, and a lender's gold value waits for its own digit**:
    otherwise the page does the decrement and the chain for her, and a child who flips, or never takes the one off,
    goes green on problems she would get wrong on paper (section 1's simulation). `'show'` and `'tap'` keep the full
    lines and marks: they are the scaffold. v0.3: so is a help, the rule's one exception: it letters the marks of the
    spreads its sand draws, lenders included, since it has just worked those decrements for her; the problem is not
    `correct` either way and its twin asks them again with nothing lettered. Withholding them after the sand had shown
    them would have hidden what the help just taught. *Under `movesOn` (decision 57) she makes every mark herself,
    before the answer, and a help keeps her marks: calls 38 and 44.*
28. **The columns are named in school words** (ones, tens, hundreds), the picture in picture words (loose, rows,
    squares), with "A row is a ten. A square is a hundred." in chapters 12 and 13: the study's rule, which v0.1 dropped,
    and the bridge from the game to her school page.
29. **A full column line on a set's first two problems of her own (`'hers'`), every `'show'` and `'tap'`, a twin and
    after a help; the column's name alone otherwise**: about two hundred repeats of the same three openings would bore
    her. After the review a `'show'` or `'tap'` problem uses up neither place, so her first problem on her own after a
    worked example (chapter 13's 85 − 39) hears its full line.
30. **No twin or store problem with a flip that lands on the right digit**, at about half a draw a twin.
31. **A fixed order for cutting a lesson that runs long**, since the real maths time, about 4½ to 7 minutes, is past
    decision 10's 20%. v0.3: a lesson problem only where the chapter's rules can spare one (13's 486 − 253, 14's
    586 − 231, 15's 563 − 128, 16's 917 − 653, 20's 912 − 468; none in 17, 18 or 19), then the made warm-up where there
    is a Tricky Counts run, then the story's optional problem, then the Counts warm-up's third fact; never the new
    step's three. v0.2's "the second older problem first" took the only problem that leaves a zero from chapters 18 and
    19 and the only one with no spread from 20. The third Count is the last cut so chapter 18, which has nothing else,
    has one; module-2 allows two or three.
32. **The column has a size budget and the keypad stays put**: digits by `clamp()`, a height per screen, the marks row
    reserved, the stack held through a problem, fallbacks per layout; measured, with the gate seeing the column
    (`col-off`), not only the controls. v0.3: the stack is held from the first column at the tallest it will be in the
    problem, a later column's line under room for Chispapaw's echo included, since the echo first appears at column 2
    and, over a first column with no prompt, would otherwise move the keypad there.
33. **Ones first is pointed at, not helped**, for her first five take-aways and in a `teach: 'none'` set: eleven
    chapters of typing left to right are a habit, not a slip.
34. **Chapter 15 gets a written zero that spreads a square (607 − 283), chapter 19 a two-digit bottom under a
    three-digit top (815 − 69), chapter 17 opens on a "no", and chapter 20's "about" is never a take set**: each closes
    a gap the chapters' table left (section 3); module-2's table follows (v0.4).
35. **The kit is built core first, the Hollow and the corner as a second pass**, each phase its own workflow run, at two
    to three times the Warrior Counts' size.
36. **On a phone held sideways the stack stands over the panel** (v0.3): at 844 × 390 the column and the keypad leave no
    room for one balloon under them, and smaller keys (below 44 px) or a two-row keypad would cost her finger or the
    place her fingers know. Beside the picture the balloons cost only picture height (about 208 px of picture left while
    she types; about 103 at the tightest, the help's sand with Aa on, which the page review looks at), and the keypad
    has only the column above it. Every other size keeps the lesson's layout.
37. **Test 17 draws a small sample of helps** (v0.3: the 33 cases and five problems of each kind, 810 helps), not test
    5's 2,000 a kind, so `takes-ui.test.js` stays in the fast tier; the numbers of every help are the engine's
    exhaustive test, and every count a help can make is drawn by test 16. Moving the file to `SLOW` would have taken the
    page's other pins out of the agents' everyday run.
38. **The spread is moves in the column: tap the lender, type its number, type the receiver's, then the answer**, the
    lender first (decision 57's order), so the decrement, the commonest thing forgotten, is never left to the end.
39. **Across a zero, every link is its own tap and numbers** (seven moves at the ones), so the zero is seen becoming ten
    and then nine, as on paper; the "fifty tens become forty-nine" shortcut (a 9 at the zero's get) is accepted kindly as
    the `nine` pointer, the 10 lettered, and no third style is built.
40. **The two styles are `'above'` (the default, v0.3's look) and `'one'`**; in `'one'` she types the little 1 she would
    write (or the thirteen she means), and the lender is still struck with its new number over it.
41. **A column is tappable only once a spread out of it is taught, and only at a decide**, so no line ever has to explain a
    spread she has not met, chapter 13 cannot spread a square, and a stray tap mid-column does nothing.
42. **A tap on her own column wiggles its digit, the same at every turn**; a done column or a stray bottom digit does
    nothing: any line there, or any answer that differed by need, would hint at the decision.
43. **The store is a tap target only while a lender glows; in `'hers'` the panel does nothing at a decide**, so a tap meant
    to hurry a line never lands as a spread (taps are used up, 400 ms after a phase change ignored, a held press is no tap).
44. **Slips are caught at the move and helped in one move, without the sand or "Got it!"**; the answer keeps v0.3's sand
    help, starting at the take, with her own marks kept.
45. **A right answer typed before the moves is `ahead`: kept pale, the lender lit, never `correct`**, because it cannot be
    told from a flip that lands; "Right!" only when the flip does not land; no twin; it cannot loop.
46. **The zero tapped first is a pointer the first time and a slip the second; tapping two columns over is a pointer**: many
    classes teach looking next door then one more, and the moves make the bug's ending impossible anyway.
47. **`'show'` has Tallyheart tap and say each number while Lissa types it**, so f036's "I'll say each step. You type it."
    is literal and her fingers make every move from the first problem; `'tap'` prompts every move and asks every number
    of a link new to her; `'hers'` prompts nothing.
48. **The choice is the kit's marks page, not a story frame, before the worked example's prompt**: it is reused by the
    shelf, needs no new frame feature in chapter 13, keeps the prompt joined to its column, and its lines come from the set
    (`marks`). Its buttons go live only after the last line, a pick can be switched through the answer line, and only the
    stack or panel moves on.
49. **Chispapaw shows the little 1 and Tallyheart the number on top, and "Both are right"**: the little 1 is the common
    mark in Spanish classrooms, Chispapaw's Tall One does her homework in Spanish, and the question asks Lissa, not her
    school.
50. **`'above'`'s second mark stands in the heads row's place, column by column**, so the column never grows and the
    keypad never moves; `'one'` never needs it.
51. **The style lives in `cat.takes.style`, changeable on the shelf, named (not changed) in the corner**: decision 57 makes
    it hers.
52. **In `'hers'` the store moves after each of her numbers; in `'tap'` and `'show'` before each ask**: in her own
    problems the picture confirms what her number meant, in the guided ones it shows what to count.
53. **The new look hangs on `.tmoves`, set only under `movesOn`**, so chapter 12 renders byte for byte.
54. **No animation locks the keypad**: the next box opens at once and the store moves beside it; only OK's double tap is
    guarded, so a quick child's keys always land where she meant them.
55. **A keying slip (`lend`, `get`) is helped but brings no twin unless it repeats**: a typo is not a misconception, and a
    twin is the biggest cost against decision 56.
56. **A `'tap'` problem drops its two asks for a link she has made on her own**: the tap prompt, the glow and the boxes stay,
    so decision 57's mechanics stay, and about 5 s a link goes.
57. **Decision 57's kit ships with chapter 13, as v26** (the orchestrator's call on the design's question 1, 2026-11-09):
    her first spread is made the decision-57 way, and the marks page meets her at chapter 13's worked example, with
    Chispapaw's lines; `CACHE` is already v26 from chapter 13's stub, so nobody bumps it. Shipped apart, as v27, the marks
    page would first come at her first spread in a store round or in chapter 14, with the kit's own lines.
58. **Decision 56's third binds the plain path** (the orchestrator's call on section 12's question 3, 2026-11-09): at
    the middle-to-slow rates a chapter as played stays inside a third; a reading with a miss and its help may run a
    little over; the move times are measured again from her log after she plays chapter 13, before chapter 14 ships and
    before chapter 15's brief (the log times every move for it: `moves`' ms). So no chapter is cut for decision 57 now.
59. **Her class's paper habits, the design's defaults until Aron says** (the orchestrator's call on section 12's question
    4): the 3 crossed out when 13 is written over it; the marks made column by column as she reaches each (the `order`
    pointer stays); a zero's 10 becoming 9 one link at a time (a 9 at the zero's get the kind `nine` pointer). Each is a
    one-line change if her class does otherwise.

## 12. For Aron

Each is built as the first answer until he says otherwise; none blocks the build.
1. ~~**Her class's words for regrouping.**~~ Answered by decision 55 (Aron, 2026-11-07): her Spanish word is
   *desagrupar*, said as she says it, «desagrupo» ("breaking it into groups"); the English stays the kit's *spread*
   ("Spread a row: ten more loose."). It first comes at chapter 13's first spread, not chapter 14 as planned (decision
   55's call in the README), and chapter 16 brings *reagrupar* (decision 53). A class word is still one line each: every
   kit line uses the word in its base form, before what it acts on or after it, never before "it", so any word fits
   ("Break apart a row: tap it.").
2. **How does her class mark a spread?** Answered in part by decision 55: the US decomposition method is hers ("me llevo
   una", the Spanish and Latin American way of adding a ten to both numbers, is not), so the help's words and the marks
   stand. Still open, not blocking: does her class mark a spread with 13 above a struck 3 (the kit's way) or with a small
   1 written before the 3, and does it head the columns C D U (centenas, decenas, unidades)? Either answer changes one
   CSS rule and the heads. **Answered by decision 57** for the marks: she chooses, 13 over the struck 3 or a little 1
   in front, on the kit's marks page at chapter 13's worked example, and can change it in the Training Hollow (section
   1a.2); the heads (C D U) stay open, and her class's other paper habits are question 4.
3. **Decision 56 against decision 57's moves.** At the design's deliberately long rates the moves cost about 3 to 4
   points of a chapter's middle in chapters 13 to 15 and about 5 from chapter 16 on (section 3, "The time with decision
   57's moves"). After the kit's own cuts, 13 and 15 are inside a third and 14 is at it (33.3%); 16 is inside with its
   made warm-up and 624 − 357 trimmed; 17 to 20 stay 0.2 to 2 points over even after the trims named. Two cases have no
   cut left: chapter 14 with a warm-up miss (35.3%), and chapter 13 with a second help and twin (34.9% after 486 − 253,
   where 13 "stays as written"). Do you accept these as estimates to be measured from chapter 13's logged move times
   before chapter 15's brief, with section 3's trim 5 as the first cuts the later briefs take, and chapter 14's
   warm-up-miss case as the module's known worst case? Or name cuts now? *Built meanwhile* (the orchestrator's call,
   2026-11-09, under decision 46): decision 56's third binds the plain path at the middle-to-slow rates; a reading with
   a miss and its help may run a little over; the move times are re-measured from her log after she plays chapter 13
   (chapter 14's spec, item 15). Section 3 has the figures.
4. **Her class's paper habits**, each a one-line change in the build: (a) does it strike the 3 when it writes 13 over it
   (this design strikes it in `'above'`, as v0.3 did; one CSS rule)? (b) does it mark every column before subtracting
   ("get ready to subtract", as Eureka Math and its Spanish edition teach; if so the `order` pointer, which today sends her
   back to the column she is on, goes, and the targets stay live at the answer moves)? (c) does it make 50 into 49 in one
   mark (already accepted kindly: the `nine` pointer)?
   *Built meanwhile* (the orchestrator's call): the design's defaults. (a) The 3 is crossed out when 13 is written over
   it; (b) marks go column by column as she reaches each (the `order` pointer stays, and the targets are live only at a
   decide); (c) a zero's 10 becomes 9 one link at a time (a 9 typed at the zero's get is the kind `nine` pointer, the 10
   lettered).
5. **A fade, later** (an option only; decision 57 keeps the moves; `~/potomac-crossing-work/regroup/design.md`, section
   8). Not built, and not offered unless Aron turns it on. After many clean spreads (say twenty problems with every move
   right first time, across at least three days, none in the last five with a slip), Tallyheart could offer once: "You
   know this by heart. Want to spread in your head now?" with **Keep my marks** first and **In my head** second. In her
   head, `'hers'` would accept a right answer typed before the moves as v0.3 did (the marks lettered after it, in her
   style), and the moves would stay open to her at every column (a tap still starts them). Two slips in five problems
   would bring the moves back, with a line. Across a zero would fade last, by its own count. The log already records
   what the offer would read (`moves`, `ahead`, the slips by move); a `takes.fade` field would be its one save change.
   Until then, a right answer in her head is `ahead`: kept, praised when it cannot be a landing flip, and shown.

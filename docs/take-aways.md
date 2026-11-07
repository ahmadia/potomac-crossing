# The take-aways kit

*Design v0.3 · 2026-11-07 · decisions 53 and 54 · v0.2 applied the critics' findings (teaching, engine, screens); v0.3
fixes the twelve problems v0.2's checker found: a help's marks in `'hers'` (one rule, its exception said), the
regrouping word's slots ("break apart" fits every one), a token for every kit word, a cut order that keeps each
chapter's rules, a 400 ms guard after every OK, the echo's room in the stack, `fresh` and `crossed` across a zero,
`extra` never at the ones, the stack over the panel on a phone held sideways, test 17's small sample, `flip`'s tens and
zero forms with `E.takeTwin`'s one signature, and the students' sweep with the blank box asked*

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
little later with new numbers, so you can show you've got it.*

## 1. What she sees and does

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

- **The column** is lettered in Andika bold (decision 29), the minus sign U+2212 in its own column left of the bottom
  number, the rule under it, her boxes under the rule. Two-digit problems have two columns and two heads.
- **The heads** are the quick picture's three marks, drawn small above the columns: a square over the hundreds, a line
  over the tens, a dot over the ones, each on a small sand-coloured chip (#e8cf98, the lesson panel's colour) in the sand
  art's strokes, so the line and the dot read as pictures and never as a 1 and a full stop (decision 29). No words (they
  would be long, and Spanish later); each column's `aria-label` says "hundreds, squares", "tens, rows" or "ones, loose".
  They tie the column to the store picture and to the sand.
- **The marks.** When a column's top changes, its written digit is struck through (a slash, not a line through: a
  horizontal line would read as a minus) and its value as it now stands is lettered small and gold above it: "4" over the
  5, "13" over the 3. When it changes again it is relettered, never stacked: a column that lent and then spreads itself
  (811 − 356's tens: 1, then 0, then 10) shows "0", then "10". In `'show'`, `'tap'` and the help, a zero spread across is
  lettered "10" as the square lands and relettered "9" as the row leaves, about 600 ms apart, so the column she will copy
  onto paper shows the zero becoming ten before it gives one away (writing 10 and stopping there is the commonest paper
  slip across a zero); a reload, and `'hers'`, show only the end state. The chain is drawn in the store picture and
  said and drawn in the sand, so the column stays readable on a phone (section 11). The marks of 503 − 278 are 4, 9 and
  13; of 811 − 356, 7, 10 and 11.
- **When the marks come in `'hers'`** (the default, and what she plays most). A right digit at a turn that spread
  strikes every lender and letters the receiving column's value (the 3 struck, "13" above it; the 5 and the 0 struck,
  nothing above them yet). A lender's gold value is lettered only when that lender's own digit is in: right, or written
  by the help, whose first line letters it (glowing, for `kept` and `zero`). So the decrement, and the chain across a
  zero, stay hers to do; the picture spreads at once (it is the honest store, and counting its nine rows is her own
  work). In `'show'` and `'tap'`, the scaffold, every mark is lettered as the spread lands. **The one exception is a
  help**, which is the scaffold too: it letters the marks of every spread its sand draws, lenders included, as `'show'`
  does (section 2). A help at 503 − 278's ones letters the 0's "10", then "9", and the 5's "4" before her tens: those
  decrements were worked for her in the sand, so in that problem they are no longer hers to do. Nothing is given away by
  it: a helped problem is never `correct`, and its twin (in any set but a `twins: false` one) asks the same decrements
  with nothing lettered. A help draws only its own turn's spreads, so it letters no other lender (503 − 278's tens
  helped: its turn spreads nothing, and the 4 still waits for her hundreds).

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

**Spreading.** A row slides from the rows zone into the loose zone and opens into ten loose (about 600 ms and 400 ms);
a square slides into the rows zone and opens into ten rows; across a zero, the square first, then the row (about 2 s in
all). With Reduce Motion it redraws at once. The column's marks are lettered as the spread lands (in `'hers'`, as the
bullet above says). The next column is outlined 0.9 s after the last spread lands (with Reduce Motion, after the
redraw), plus the echo's reading time when Chispapaw echoes; a tap draws the spread's end at once and then outlines the
next column, and keys are ignored until it is outlined (`padLockedUntil`, as after "Got it!"), so a digit typed into the
animation never lands in the wrong box. With no spread the next column is outlined at once (after the echo's reading
time when she echoes). Either way keys are also ignored for 400 ms after every OK, the figure the guard after "Got it!"
already uses (`padLockedUntil = now() + 400`), so the second tap of a double tap on OK never reaches the next box: an
empty leftmost box's OK is read as a 0 (below), and on 57 of the module's 63 problems that would be a miss, a help and a
twin.

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
| right | the box turns green (`.tbox.right`); if the turn needed a spread that was hers to do (`regroup: 'hers'`), the store picture spreads and the marks come as section 1's `'hers'` bullet says (the lenders struck, this column's value lettered; a lender's own value once its own digit is in); the pieces taken in that zone go pale; then the next column is outlined and its line said, 0.9 s after the last spread lands, or at once when nothing spread; keys are ignored for 400 ms after the OK either way (above). A tap moves on at once |
| wrong | the box turns pale yellow (`.tbox.miss`, `var(--caption)`, as a missed lesson slot is); 650 ms later the help takes the panel (section 2); the help ends with the right digit in the box, the marks lettered as the help showed them, and "Got it!", which outlines the next column. Her own digit is logged; nothing yellow is left on the column |
| the last column | the problem is done: the answer row complete, the picture showing what is left, and one line (below) |
| a leading zero | the leftmost box, when the answer has no digit there (382 − 345 = 37; 500 − 467 = 33), is outlined and asked like the others. OK is lit on the leftmost box even while it is empty, on every problem, so a lit OK never tells her the answer is short; an empty OK there is read as a 0, and the 400 ms guard after every OK keeps a double tap on the column before from answering it. A 0, or OK on the empty box, is right: the box fades to an empty dotted box (never a 0) and Tallyheart says "No squares left. We don't write a zero in front." (two digits: "No rows left. We don't write a zero in front."); then the problem is done. Any other digit is a miss with its slip: `kept` for a 1 at 500 − 467 (5 − 4: the square it gave not taken off), the commonest wrong answers there being 135, 125, 188 and 133 for 731 − 696, 503 − 478, 500 − 412 and 500 − 467 |

**Each column's line**, lettered in Tallyheart's balloon and said by Read to me as the column is outlined, in words. The
column is named in the school words, as the maths study's section 1 has it ("the column is said in them"): "Ones first."
"Now the tens." "Now the hundreds." Things in the picture keep the picture words ("Nine rows now.", "Four squares
now."), and chapter 12's and chapter 13's worked examples say `E.TAKE_LINES.schoolWords` once: "A row is a ten. A square
is a hundred." So the game meets her school page (decenas and centenas at school, tens and hundreds at home), which is
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
- **Full and short.** The full line is said on a set's first two problems, every `'show'` and `'tap'` problem, a twin,
  and the column after a help. Otherwise a column says its name alone ("Now the tens."; the first column "Ones first.",
  or nothing past the prompt's balloon when there is a prompt), so some sixty lesson problems and every store round do
  not open on the same three lines two hundred times.
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
- `'show'`: Tallyheart works it before she types that column: "Three take away eight? Only three loose. Not enough."
  "So I spread a row: ten more loose." (the picture spreads, the marks are lettered) "Thirteen take away eight." Then
  the keypad wakes. Each line stays until it can be read (or said), a tap moves on. Across a zero: "Two take away five?
  Not enough loose, and no rows to spread." "So a square first: ten rows." "Now a row: ten more loose." In a column that
  needs nothing, `'show'` is the column's line, as always. The worked example of each new step is `'show'`.
- `'tap'`: "Not enough loose. Spread a row: tap it." The rows zone glows and the keypad is dim. The tap target is the
  glowing zone (generous: the panel's full height in that zone) or the lending digit in the column; a tap elsewhere
  makes the zone glow again and says "The rows: up here." once, so she looks at which zone is empty, not at a Continue
  button. Space spreads too, and a hidden "Spread a row" button does for VoiceOver; a digit pressed first wiggles the
  glowing zone and types nothing. Across a zero: "Not enough loose, and no rows. Spread a square: tap it." (the squares
  zone glows), then "Now tap a row." Then "Thirteen take away eight." The first problem or two after a new step are
  `'tap'`.
- `'hers'`: nothing is shown first. A right digit tells the page she spread in her head; the picture catches up then,
  and the marks as section 1's `'hers'` bullet says.

**503 − 278, `'hers'`, as she plays it** (a set's first problem, so its lines are full). The store: five squares, three
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
lettered. A help left open is not shown again; its digit is in.

## 2. A miss: the help in the sand

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

**Naming her slip** (`E.takeSlip(plan, col, given)`, read in this order; the first match names it):

| Slip | When | The first line (the 43 − 16, 503 − 278 or 811 − 356 column) | Then |
|---|---|---|---|
| `zero` | at a turn that chains across a zero, she typed bottom − top or 0 (0 at 503 − 278's ones; 3 or 0 at 702 − 345's); at a zero's own turn after it lent, she typed 10 − bottom (3 at 503 − 278's tens: the row it gave not taken off), the bottom itself (7: 0 − 7 read as 7) or 0 | "Three take away eight? Not enough loose, and no rows to spread." / at the tens: "Careful. That zero became ten rows, then gave one away. Nine rows now." | at the ones, the chain, one spread at a time: "So a square first: ten rows." "Now a row: ten more loose."; then the take. At the tens, the take |
| `flip` | her turn needed a spread from a digit that is not 0, and she typed bottom − top (3 for 3 − 6): the smaller from the bigger, the commonest slip; at the ones or the tens (6 for 735 − 391's tens, 3 − 9; 8 for 607 − 283's tens, 0 − 8) | "Careful: it's three take away six, the top take away the bottom. Only three loose. Not enough." / at the tens: "Careful: it's three take away nine, the top take away the bottom. Only three rows. Not enough." / a top of 0: "Careful: it's zero take away eight, the top take away the bottom. No rows. Not enough." ("No loose." at the ones: 640 − 218) | "Spread a row: ten more loose." / at the tens: "Spread a square: ten more rows." / a top of 0: "Spread a square: ten rows." ("Spread a row: ten loose."); the take |
| `nospread` | her turn needed a spread from a digit that is not 0, and she typed 0 ("not enough, so none"; 811 − 356's tens, which lent their one row) | "Three take away six? Not enough loose. But we can spread a row." / at the tens: "No rows to take five from? But we can spread a square." | the spread; the take |
| `kept` | this column gave a row (or a square) to the right and she used its top as written (3 for 43 − 16's tens, 4 − 1; 3 for 503 − 278's hundreds, 5 − 2; 6 for 811 − 356's tens, 11 − 5; 1 for 500 − 467's blank hundreds, 5 − 4) | "Careful. One row went to the loose. Three rows now." / hundreds: "Careful. One square became ten rows. Four squares now." (the struck digit and its gold one glow) | any spread the column still needs (811 − 356's tens: "No rows now.", so a square spreads); the take, from the top as it stands |
| `extra` | the tens or the hundreds (never the ones, which has no column on its right to give a row to: 2 at 475 − 132's ones is `fact`), when the column did not lend and needed no spread of its own, and she typed its top − 1 − bottom: a row taken when the loose had enough, the opposite of the flip (3 for 475 − 132's tens, where 7 − 3 = 4) | "Careful. The loose had enough, so no row went. Seven rows still." / hundreds: "Careful. The rows had enough, so no square went. Four squares still." | the take |
| `fact` | anything else: a fact slipped (8 for 43 − 16's 13 − 6); at a chain's turn, any other digit (4 or 6 for 503 − 278's 13 − 8: she went across the zero and slipped on the teen fact); at a lent zero's turn, any other digit (1 or 8 for 9 − 7) | "Let's scratch it out." / with a spread of her own to make: "Three take away six: we spread a row, then take six." / at a chain's turn: "Across the zero: thirteen loose. Take away eight." (the sand starts with the chain already drawn) / at a lent zero: "Nine take away seven: let's scratch it out." | any spread the column still needs; the take |

A slip is named from what she typed and the plan alone; nothing asks her why. The order is the table's: `zero` first at
a chain's turn and at a lent zero's, so a turn across a zero is never `flip` or `nospread`; `extra` after `kept`, and
only at the tens or the hundreds of a column that did not lend. A turn with no spread of its own has `fact` (or `extra`
left of the ones), or `kept` or `zero` when its column lent. A turn whose spread she was shown or tapped has it in the
sand already and is never `flip`, `nospread` or a chain's `zero`: its help starts at the take. `extra` is the slip
chapter 17 exists to catch («¿Hay que desagrupar?», in English "Do we need to spread a row?", at the tens "a square?":
section 8's rule for the word); it can show only because a later column's line no longer says its top. Every case above
is in `check-v0.2.js` (33 of them, the designer's fourteen re-read under this order) and is copied into test 5, with
v0.3's four (`check-v0.3.js`: 2 at 475 − 132's ones `fact`; 6 at 735 − 391's tens, 8 at 607 − 283's tens and 8 at
640 − 218's ones `flip`).

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
the lesson has had. It comes `E.REQUEUE_GAP` (two) problems later, or as late as the lesson allows: next, when it was the
last. No fillers are added (section 11: a take-away takes 25 to 40 seconds, so two fillers would add a minute to a
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

| Fact key | What it is |
|---|---|
| `[a, b]` or `{ a, b }` | the problem: whole numbers, 10 ≤ a ≤ 999, 1 ≤ b < a, b with no more digits than a |
| `regroup` | this problem's `'show'`, `'tap'` or `'hers'` |
| `prompt` | its question, as a Counts fact's (a line, or balloons and captions); its first balloon at most 12 words. Without one, nothing is lettered past the column's line, and "{A} take away {B}." is said in words (section 1) |
| `right` | balloons after it is right in every column first time, in place of praise (its picture stays, Next to go on) |
| `picture` | its own `{ kind: 'store' }` or `{ kind: 'marks' }` |

**The guards** (`E.checkTakes(story, stories)`, run by `E.checkStory` and the chapters' story tests), each a rule code
can check:
- **a take fact**: in range as above (whole numbers, no negative answer, no answer of 0, no four-digit top, no leading
  zero in a number, a bottom with no more digits than the top), and an answer at most one digit shorter than its top
  (503 − 498 = 5, with two blank boxes, is refused); `regroup` one of the three; `picture.kind` `'store'` or `'marks'`;
  no `table` (so `E.countSets`, which reads a set's first fact's `table`, never files a take set as a Count); its
  prompt's first balloon, the one the first column's line joins, at most 12 words, so the joined balloon stays at three
  lines or fewer;
- **a take set**: none of the multiplication keys above; `teach`, when present, one of `E.TAKE_STEPS`; `twins` and `warm`
  booleans; `lines` only `E.TAKE_LINES`' keys; no Counts set's `fillFrom` names it;
- **a set's step**: with `teach` other than `none` or `mixed`, exactly three problems whose `E.takeStepOf` is `teach`,
  every other one an earlier step in `E.TAKE_STEPS`' order, and from chapter 13 at least one of kind `none`;
  `teach: 'none'`, every problem of kind `none`; `teach: 'mixed'`, four kinds or more, one of them `none`, one problem
  with no hundreds left (`noHundreds`) and one that leaves a zero (`leavesZero`); a set with no `teach` (chapter 20's
  lesson, a story's set), every problem's step one that a `teach` set of this chapter or an earlier one teaches;
- **a chapter**: no answer twice, across all its take sets and stories (a story problem that is also a lesson problem is
  asked once, in the story); no `noHundreds` problem before the chapter that teaches `mixed`; the answers a `warm`
  lesson's made warm-up must avoid are the chapter's.

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
of a 20-minute chapter), and a chapter with a Tricky Counts run about a minute more. That is past decision 10's 20%, so
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

**The log's cap.** `E.TAKE_LOG_CAP` 2,000 entries, the oldest first out. At about 60 take-aways in the module and 5 a store
round, that is some 380 rounds. What reads it for play (`E.hardTakes`) reads each step's latest ask.

## 5. The Training Hollow: Count the store

**When.** Once she has finished a take set with `teach` (`E.storeOpen`: chapter 12's lesson), so chapters 12 and 13's
lessons have practice at once (decision 10; module-2's call 22). Before that the Hollow is exactly as it is.

**The shelf.** Ten Counts and My nest already fill a 1080 × 720 screen (the polish release's and chapter 10's blocks in
`index.html`), so the Hollow's opening page becomes a shelf once the store is open (module-2's "Between chapters"):
- Tallyheart: "Count the store, or one Count at a time? A full round earns a treasure for your nest." (after a round,
  "Another round? I've got all evening."; while a Warrior Counts sitting waits, its waiting line in this place, as now);
- **Count the store** (big, its icon the quick picture's three marks), **One Count at a time** (big), My nest. Chapter 14
  adds **Tricky Counts** between them; the kit leaves its place.
- One Count at a time opens the Counts page as it is today, word for word (its greeting, glow line, tricky paws, the ten
  Counts, My nest); its ‹ goes back to the shelf (`onBack`), not to Camp. A module-1 round's "Another round" lands on the
  shelf, as `hollowReward`'s pinned `go('hollow', { from: 'hub', reward: true })` requires (section 8 names the pins).

**A round** (`E.takeRoundStart(cat, stories, now)`): five problems, each a twin of a template (`E.TAKE_TEMPLATES`, from the
chapters' own lessons, with two that only the store asks: 352 − 28 and 403 − 57, a two-digit bottom under a three-digit
top whose hundreds has nothing to take, after lending in 403 − 57's case), seeded by the round's number and its place,
every answer different:
1. an easy one: a twin of a `none` template (58 − 23 or 475 − 132);
2. her hardest step (`E.hardTakes`, among the steps she has learned), else the newest step she has learned;
3. her next hardest, else one of the older steps;
4. the newest step;
5. one of the older steps.

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
first with no spread, no flip landing, no answer without hundreds before `mixed`, never a fallback. Round 1 once the zeros are learned: 575 − 241, 500 − 289, 80 − 13, 600 − 527, 937 − 768.

Its set (`E.takeRoundDef`): id `store`, `op: '-'`, Tallyheart, the store picture, the kit's praise, `done` "The whole
store, counted! That deserves a treasure for your nest."; introduced "Five from the store. Ready? Here we go."
Chispapaw joins its opening page and its lines in chapter 12 (her art and Spanish are chapter 12's); the kit draws
Tallyheart and the player, and leaves a cast slot for her. A helped problem's twin comes back within the round, as in a
lesson. A round's entries carry `round: n` and are first asks, so a round right in every column takes a step off her
hard list. A round takes about two and a half minutes.

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
  1180 × 820, 44 upright, 29 on a phone and 24 at 844 × 390, about the keypad's own 32 px. The gold marks .5em, the heads
  .35em, her boxes as `.q .slot` at that size.
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
example, its first column with the prompt joined and a Warrior Counts waiting line over it, `wWait`), `take:q` (a
three-digit problem with marks), `take:show` (a `'show'` step), `take:tap`, `take:echo` (a stub Spanish balloon from
`o.echo`), `take:sand` (a help's last step with "Got it!", three balloons), `take:done`, `hollow:shelf` and `store:q`.
None may show `off-screen`, `off-screen-keypad`, `spill`, `broken-word`, `sideways` or the new `col-off`:
`dev/webkit/measure.js` flags only controls (buttons, inputs, `a.btn`), so a take page that pushed its column or its
line under the bar would pass, and it now also records `m.tcol` (the `.tcol` box), `m.tbox` (`.tbox.on`) and the stack's
last `.sb`, and `tools/sweep.mjs` reports `col-off` when any of them is not wholly between the bar's bottom and the
viewport's. On a phone held sideways (844 × 390) the stack stands over the panel (above), so the column, the outlined
box, the keypad and the stack's last balloon are on the screen together, as `col-off` requires, with no scroll.

**For VoiceOver.** The column is a group labelled with the problem in words; each box is labelled by its column
("ones", "tens", "hundreds", from `E.TAKE_WORDS`) and what is in it, the outlined one `aria-current`; the column's line
is in the stack's live region; the `'tap'` page's hidden "Spread a row" button (its words from `E.TAKE_WORDS` too); the
panel's label says the store in words ("Five squares, three loose").

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

**Engine** (a section "the take-aways kit" after the Warrior Counts'; new unless it says changed):

| Piece | What it does |
|---|---|
| `E.TAKE_KINDS`, `E.TAKE_STEPS`, `E.TAKE_SLIPS` (`zero`, `flip`, `nospread`, `kept`, `extra`, `fact`, in that order), `E.TAKE_REGROUP` ['show', 'tap', 'hers'], `E.TAKE_TEMPLATES`, `E.TAKE_TRIES` 400, `E.TAKE_ROUND` 5, `E.TAKE_LOG_CAP` 2000, `E.FROST_TREASURES` (ids `frost-leaf`, `snow-feather`, `acorn-cap`, `river-pebble`) | the names and numbers above |
| `E.TAKE_WORDS` | the kit's maths words in one place, each form listed: the picture words (loose; row, rows, Row; square, squares), the school words for the columns (ones, tens, hundreds), take away (take away, Take away), the regrouping word (spread, Spread: its base form only, below), and Ones first (a phrase of its own, so a language that orders it differently changes it whole). Read lazily, at call time, from `PC.words` when it holds them (chapter 12 brings it, with the Spanish beside), as `warriorStory()` reads `PC.warrior`, with the English as the fallback: `PC.words` does not exist until chapter 12, and a table read once at load would miss a stub loaded after `app/engine.js`. `E.TAKE_LINES`, the heads' and the panel's `aria-label`s, the hidden button, the digit lines and `plain()` all read it, so a class word changes in one line (decision 53) |
| `E.TAKE_LINES` | every line the kit says, with tokens: the numbers' (`{Top}`, `{bottom}`, `{first}`, `{rest}`, `{left}`, `{digit}`, `{A}`, `{B}`, as number words) and the words', one for every form `E.TAKE_WORDS` lists (`{spread}`, `{Spread}`, `{row}`, `{rows}`, `{Row}`, `{loose}`, `{square}`, `{squares}`, `{ones}`, `{tens}`, `{hundreds}`, `{takeAway}`, `{TakeAway}`, `{OnesFirst}`, filled from `E.TAKE_WORDS`: "Ones first. Three take away eight." is `{OnesFirst}. {Top} {takeAway} {bottom}.`, "Take away seven." `{TakeAway} {bottom}.`); no form of a maths word is written into a line literally, and the cat's tokens are left for the page. Its keys: the column lines (`colFirst`, `colHers`, `colShown`, `colName`, `nothingHers`, `nothingShown`), `schoolWords`, `blank`, `onesFirst`, `tap`, `tapSquare`, `tapRow`, `tapHere`, the spread lines, the six slips' first lines, each with its tens and zero forms (section 2), and `fact`'s chain and lent-zero openings, the take's hops, the digit, `twinIntro`, `warmIntro`, `again`, `rememberedStep` (one a step), `miss` and `missLast`, the default praise. A set's `lines` overrides any |
| `E.numberWords(n)` | number words 0 to 1,000 |
| `E.takePlan(a, b)` | the plan (section 3) |
| `E.takeKind(plan)`, `E.takeFlags(plan)`, `E.takeShape(plan)` | section 3 |
| `E.takeStepOf(plan)` | the step a problem belongs to: `ones2` for a two-digit spread; `zero` and `zeros` their kind; `mixed` only for a problem with no hundreds left of kind `none`, `ones`, `tens` or `both`; else its kind (her hard steps, section 4; the guards, section 3; the round's templates, section 5) |
| `E.takeTwin(plan, seed, avoid, mode)` | a twin, or the original after 400 draws; for `mode` `'hers'`, never one whose flip lands on a right digit (section 2) |
| `E.takeWarm(seed, avoid)` | the made two-digit warm-up (`'hers'`, so its flip never lands) |
| `E.takeSlip(plan, col, given)` | section 2's slip, or null for a right digit; a blank column's empty OK is given as 0 |
| `E.takeLine(def, plan, col, stage, mode, full)` | the column's line: in `'hers'` the column and its bottom digit, never its top (the first column its top as written); in `'show'` and `'tap'` the top as it stands, or after a shown or tapped spread; `full` false gives the column's name alone (section 1) |
| `E.takeShow(def, plan, col)` | `'show'`'s steps, and `'tap'`'s lines, for a turn that spreads |
| `E.takeHelp(def, plan, col, slip)` | the help: `{ intro, steps: [{ say, sand, n? }], digit, line }`, `sand` as `E.takeSandOpts` takes it |
| `E.takeSandOpts(step)`, `E.takePicture(def, q, stage)` | what `PC.art.sand` (`kind: 'quick'`) and `PC.art.placeValue` take, exactly the option objects pinned below: the number as it stands, crossed and fresh marks, the taken and lit ones, the spread in flight, the glowing zone |
| `E.takeQuestion(def, q)` | what comes before the first column: the prompt's balloons (lettered and said), a twin's `twinIntro` or the warm-up's `warmIntro` (lettered and said), then "{A} take away {B}." in words, said only, its own speech item before the first column's line (section 6's order) |
| `E.takes` (`T`): `T.start(def, opts)`, `T.done(st)`, `T.question(st)`, `T.digit(st, def, digit, ms, now)`, `T.tap(st)`, `T.summary(st)` | the runner. A take state: `{ op: '-', set, mode, queue: [{ a, b, regroup?, prompt?, right?, picture?, of?, warm? }], pos, col, got, first, slips, cols, tapped, requeues, log, lineIdx, missed, onesFirst, startedAt, round? }` (`of` a twin's lineage, its original's `'<a>-<b>'`; `requeues` keyed by it; `lineIdx` the praise and miss lines' turn, not to be confused with a set's `lines`; `onesFirst` whether this problem's pointer has been given): `pos` moves only when a problem is done, so `T.done` and `E.counts.done` agree and the slot machinery (`busy`, `E.lessonAt`, `E.holdLesson`, `E.hollowRound`, `E.settleLesson`) works untouched. `T.question` gives the problem, its plan, the column, the line's mode and form, her digits so far and the marks lettered (per column, by the mode: section 1); `T.digit` one column's OK: right or wrong, the ones-first pointer, the slip and the help, the marks, a blank asked, and at a problem's end its log entry, the twin queued (seeded by `startedAt`, `pos` and the requeue count), its line (`again`, `rememberedStep`, praise or `right`, or the miss line); `T.tap` one spread of a `'tap'` turn; `T.summary` has `C.summary`'s keys (`noHelp` and `finished` too, so `when: { lessonClean }` reads a take set) and `op: '-'` |
| `E.takeLesson(cat, story, setId, now, stories)` | a chapter's take lesson: the set's facts (and its made warm-up first) and a fresh take state |
| `E.chapterLesson` (changed) | one branch first: a set with `op: '-'` goes to `E.takeLesson`. Every other set as now |
| `E.recordLesson` (changed) | one branch before the Hollow's (`st.mode === 'hollow'`) and after the Warrior Counts': a state with `op: '-'`: a chapter's under `lessons[set]` (`T.summary`), `lesson` cleared, returned as today; a store round to `E.takeRoundFinish`, returned as `{ mode: 'store', summary, hollow: null, store: { awarded, rounds } }`, so it never reaches `E.hollowFinish` (module 1's treasures and `byTable['1']`) nor `renderHollow`'s pinned `hollowReward`. Its signature stays `(cat, st)` |
| `E.logTake(cat, entry)` | into `cat.takes.log` (created on her first), capped |
| `E.hardTakes(cat)`, `E.takeTable(cat)` | her hard steps (section 4); the corner's table by kind: problems, right first time of first asks, helped, typical time, her commonest slip; under it a "teen facts missed" row (for example "13 − 8 ×2"), built from each `fact` slip's top at her turn and the column's bottom digit, for grown-ups only: those facts are a grade 2 prerequisite the kit has no other way to show |
| `E.questionDef` (changed) | only for a set with `warmHard.table === 'all'` and a question whose numeric `table` differs from the set's: the set with `W_ASK_KEYS` copied from `E.hollowDef(stories, q.table)` and its own lines kept (section 4). Every other set and question as now, `from` included |
| `E.takeSteps(cat, stories)`, `E.storeOpen(cat, stories)` | the steps her finished `teach` sets taught, in order; whether Count the store shows |
| `E.hollowShelf(cat, stories, opts)` | the shelf's greeting (or the waiting line, from `E.hollowLines`, reused) and its buttons; null while the store is closed; `opts.stories` in place of `stories` (for `PC.debug.takes`) |
| `E.takeRoundDef()`, `E.takeRoundStart(cat, stories, now, opts)`, `E.takeRoundFinish(cat, st)` | section 5 (no flip landing; entries `round: n`, first asks); the finish once, as `E.hollowFinish`; `opts.stories` as above |
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
| `openGrownups` (changed) | with `takes` data: a "Take-aways" table by kind (`E.takeTable`, its teen-facts row under it) after the Counts' tables, and "Count the store N (M without help)" on the Training Hollow's line. Nothing for a cat without it |
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
cat who has not met a take-away is stored exactly as today). A take lesson in progress is a lesson in the slot (`lesson`,
a place's `lesson`, `hollowWaiting`) with a take state, checked by `okLesson`; a finished take set's summary is in
`lessons`, as any set's. Book two adds nothing to the save.

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

## 9. Tests

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
   answer two digits short, a `table`, a bad `regroup` or `picture.kind`, a first balloon over 12 words), a bad set key
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
   `extra` at 475 − 132's tens.
5. **Every slip's help** (section 2's 33 cases, by value, in the engine file; the sample in the exhaustive one). For
   every three-digit problem of each kind (a sample of 2,000 a kind, seeded) and every column, every wrong digit 0 to 9:
   a help whose steps end on the right digit, whose spreads are the plan's, whose take hops end at the digit (old marks
   first), whose first line is the slip's; at a chain's turn `zero` only for bottom − top and 0, `fact` with the chain drawn for the
   rest; at a lent zero `zero` only for 10 − bottom, the bottom and 0; `extra` only at the tens or the hundreds, where the
   column did not lend (never the ones: 2 at 475 − 132's ones is `fact`); `flip` at the tens and on a 0 with its own
   words (section 2); the sand's numbers at each step the top as it stands.
6. **The twin** (the 1,000 seeds in the exhaustive file). For each chapter problem and 1,000 seeds: the same shape and
   kind, a new top, no answer of the lesson's, at most 400 draws, and for `'hers'` no spread turn whose flip lands on its
   digit; forced (`TRIES` 0): the original. Queued `E.REQUEUE_GAP` later or next when last, with `of` its original's key;
   at most twice by lineage (a twin's twin counts against the first problem); its log entry's `twin` that key; seeded by
   `startedAt`, `pos` and the requeue count; `'show'`'s twin `'tap'`.
7. **`'show'` and `'tap'`.** `E.takeShow`'s steps across a row, a square and a zero (the zero's mark "10", then "9");
   `T.tap` spreads one at a time, a digit before it types nothing, a tap off the glowing zone says `tapHere` once; the
   column's line after it says the new top.
8. **The record.** Entries as section 4 says (round and warm-up entries first asks, `round: n`); `E.takeStepOf` on
   500 − 412 (`zeros`), 503 − 478 (`zero`), 731 − 696 and 382 − 345 (`mixed`), 43 − 16 (`ones2`); `E.hardTakes` from first
   asks only (not twins, `worked` or `'tap'`), a step leaving once right; `E.takeTable`'s rows and its teen-facts row;
   the cap at 2,000.
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
    first `none`, hard steps at 2 and 3, the newest at 4, `noHundreds` only after `mixed`, no flip landing; the finish
    once, returned as `mode: 'store'`, a frost treasure in turn by the store's rounds (ids distinct from `E.TREASURES` and
    `E.GIFTS`), `hollow.rounds` and each Count's record untouched; each template's step its row, and once chapters 12 to
    21 land, each template against its step's chapter (one of its lesson's problems; the store's own two, its step).
13. **Number words and the words table.** `E.numberWords` 0 to 1,000 against a hand list of the tricky ones (101, 110,
    118, 503, 999) and equal to `E.countWords` to 100; every kit line filled for each column of each kind, at the ones
    and the tens, on a top of 0 and not, with no `{` left, singular and plural right ("one row", "two rows"), no "Only
    zero"; a token for every form `E.TAKE_WORDS` lists, and no form of one written literally in any `E.TAKE_LINES` value;
    the regrouping word's token never followed by a pronoun ("it", "them") nor left with nothing to act on; with the
    word set to "trade", "regroup" and "break apart", every line that says it changes, no "spread" is left, and the
    filled lines are pinned ("Spread a row: tap it." becomes "Break apart a row: tap it."); `E.TAKE_WORDS` read at call
    time (a `PC.words` stub loaded after the engine is seen).
14. **Migration.** A cat with `takes` goes through the store unchanged, idempotently; junk dropped (not an object: no key;
    bad entries out; `kind` recomputed; a `__proto__` holding `takes` makes none); a lesson whose take state is bad is
    dropped from `lesson`, a place and `hollowWaiting`.
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

**In Safari**, for the shipping check (`tools/shots.mjs`, the screen locked, a fresh short session each, silent): `take:q`,
`take:tap`, `take:sand`, `take:done` and `hollow:shelf`, five shots; the rest is checked in Node, by the sweep and by the
page review's four extra sizes (section 6).

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
   and relettered "9", about 600 ms apart, so the column shows the zero becoming ten (relettering, not stacking).
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
    she already did.
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
    top, which the column lines up for her, and "Nothing to take" in a column that lent, where `kept` shows.
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
    them would have hidden what the help just taught.
28. **The columns are named in school words** (ones, tens, hundreds), the picture in picture words (loose, rows,
    squares), with "A row is a ten. A square is a hundred." in chapters 12 and 13: the study's rule, which v0.1 dropped,
    and the bridge from the game to her school page.
29. **A full column line on a set's first two problems, every `'show'` and `'tap'`, a twin and after a help; the
    column's name alone otherwise**: about two hundred repeats of the same three openings would bore her.
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

## 12. For Aron

Each is built as the first answer until he says otherwise; none blocks the build.
1. **Her class's words for regrouping.** The kit says *spread* in English ("Spread a row: ten more loose.") and, from
   chapter 14 (*desagrupar*) and chapter 16 (*reagrupar*), the Spanish words (decision 53). If her class says something
   else in either language ("trade", "regroup", "break apart"; *canjear*, *descomponer*, *pedir prestado*), it is one
   line each: every kit line uses the word in its base form, before what it acts on or after it, never before "it", so
   any of these fits ("Break apart a row: tap it.").
2. **Does she ever say "me llevo una" when she subtracts, and how does her class mark a spread?** In Spain and parts of
   Latin America, subtraction adds a ten to both numbers instead of spreading a row; the little marks are written
   differently. The kit is the US method her school's English side most likely uses. If her class does it the other way,
   the help's words and the marks need a note before chapter 13 (chapter 12 has no spread). Also: does her class mark a
   spread with 13 above a struck 3 (the kit's way) or with a small 1 written before the 3, and does it head the columns
   C D U (centenas, decenas, unidades)? Either answer changes one CSS rule and the heads.

# The Warrior Counts

*Design v0.4 · 2026-10-26 · decision 48*

*Aron answered the three open questions on 2026-10-24 (README decision 49): each default stands.*

*v0.3 (2026-10-26) is the build's: what the reviews of the built piece found, fixed and written in here
(section 11). Above all, a sitting again after the pass says her number only on a passing score.*

*v0.4 (2026-10-26) is the second round of those reviews (section 12): a sitting picked up starts its two
hours again, one with no answer yet is not one in progress, the opening's reason is the set-aside's own,
the Hollow keeps a not-yet for Glintstar to say, a sitting again after the pass leaves the Ceremony its
big button, the pauses wait for their reading, and a Hollow round picked up keeps its keypad on screen.*

*At the merge onto chapter 9 (2026-10-31) its review set four details, written in where they belong (README calls 53
to 56): the help's last page keeps the reminder on screen (section 3), a sitting's `at` is never earlier than her latest
answer (section 4), a cat's `warrior` is her own key and a lesson whose state is a sitting's is dropped (section 6), and
the tricky paw sits in its button's padding (section 7). The behaviour is v0.4's otherwise.*

*For the engine owner, the UI owner and the story writer, who build it as its own piece before
chapter 10 (`docs/production.md`, section 8), on top of chapter 9 once chapter 9 lands (section 7,
"Building it"). A function named here as reused is used untouched; every new piece, and every
existing function that changes with the guard that keeps chapters 1 to 9 as they are, is in
section 7. v0.2 takes the engine and child reviews of v0.1 (section 10).*

**In Lissa's terms.** *After chapter 10, whenever you want, you sit where Murmurpaw sat. Glintstar
asks every Count up to ten times ten, and Tallyheart is right beside you with her sand. Get nine in
every ten right, and the Clan gathers for your warrior name. If not this time, practice the tricky
ones in the Training Hollow and try again, as often as you like.*

## 1. Where, when, and the story around it

- **When.** Once chapter 10 is finished (`E.isFinished(cat, PC.warrior.after)`), until she passes;
  never before (decision 34, and the 7s are chapter 10's). After the pass she may sit it again for a
  clean sweep, which changes nothing (section 5, "After the pass").
- **Where she starts it.** From the hub only, on the big button where the next chapter's stands
  (section 7). Not from the Training Hollow, which stays practice with no test in it; the Counts are
  taken at the fountain. Chapter 10's last pages tell her it is hers to take (for example
  Tallyheart: "The Warrior Counts are yours, whenever you're ready. At the fountain, like
  {Murmur}chime."), and its teaser is the Ceremony's ("Pass your Warrior Counts, and the Clan will
  gather for your name."). Once she has passed, the hub and the book say "Your ceremony is coming
  soon." in its place (section 5).
- **Who, and where she sits.** Chapter 3's scene with her in Murmurpaw's place: the camp set,
  Glintstar at `fountain-top`, the player at chapter 3's `FOOT` (`{ x: 760, y: 860 }`). Glintstar
  asks every question. Tallyheart sits right beside her (the sand is drawn when she scratches out a
  miss): she praises, notices, and scratches out a miss. Princess Waffles is heard only at the end.
- **The crowd comes once** (`st.crowd`, set by `E.warriorBegin`). Until she has a finished sitting,
  the whole Clan watches in a ring (`crowd: true`), Murmurchime at the front, as for Murmurpaw. After
  one, a sitting is quiet: Glintstar, Tallyheart and Murmurchime at the fountain, the camp going
  about its day (no crowd), so a later not-yet is said among friends. A pass in a quiet sitting
  brings the whole Clan running (section 5). This is question 3's first answer.
- **The first opening** (`open.first`, four panels, about 70 words), while she has no attempt yet
  (a sitting set aside with no answer is not one, section 4):
  1. "The whole Clan crowds around the fountain. This time, you sit at its foot." (wide, as ch3 `f016`)
  2. "Tallyheart sits down right beside you." Murmurchime grins from the front. (v0.2 said "by a patch
     of smooth sand", which no panel draws before a miss.)
  3. Glintstar, the rule in chapter 3's words, once: "To become a warrior, a cat answers every Count
     up to ten times ten, and gets nine in every ten right."
  4. Tallyheart, quietly: "If one gets away from you, we'll scratch it out together, like always. It
     won't count as right. But it won't stop you, either." Then the first question.
- **Later openings**, one panel. With the crowd (`open.again`, no finished sitting yet): "The Clan
  gathers at the fountain again." Quiet (`open.quiet`): "The camp is quiet. Glintstar waits on the
  fountain, and {Murmur}chime comes to watch." Tallyheart, in both: "Every Count, same as before.
  I'm right here." When the sitting before was set aside (section 4), she first says why, once
  (`aside`): "It's been a while, so we start fresh." (two hours can be the same evening, so never "a
  new day") or "You've been practicing, so we start fresh." The rule is not said again. The reason is
  the new sitting's own (`st.aside`, put there by `E.warriorBegin`), so it is this set-aside's: also when
  the sitting before was opened and left with no answer (dropped, never recorded), and still said when
  that new sitting is picked up before its first answer and plays its opening again. The first
  opening never says one: she had begun nothing.
- **Picked up** (left partway, section 4): `open.resume`, one line the runner shows over her question
  (its `intro`): Tallyheart, "Where were we? Ah, yes." A sitting picked up before its first answer
  plays its own opening again instead, so she never misses the rule.
- **No new names.** "The Warrior Counts" is Aron's phrase and the test's only name; "assessment"
  never reaches the screen (chapter 3's rule).

## 2. The 55 questions and their order

**The pairs.** Every {a, b} with 1 ≤ a ≤ b ≤ 10: ten squares and 45 others (`E.warriorPairs()`),
each asked once a sitting; one that is not a square is shown one way round or the other, 50/50,
afresh every sitting.

**The order** (`E.warriorFacts(cat, stories, now)`, seeded by `E.util.rng` from `now` and the
sitting's number, so the same `now` gives the same order):

1. **10 × 10 is always last**, as Murmurpaw's was: the caption "At last:", Glintstar's "Ten times
   ten.", her "A HUNDRED!" (ch3 `f023`). It is never one of the tricky ones and never carries
   `hard: true`, whatever her history. A warrior answer is timed as asked (its prompt is Glintstar's
   few words, never a long one), so a slow right 10 × 10 is likely, with three digits to type, and
   E.hardFacts' rule would count it: `E.warriorHard` leaves it out and takes the next-hardest pair.
2. **Easy openings.** Question 1 is gentle: a pair with a 1, 2 or 10 whose other number is at most 5
   (fourteen pairs, such as 3 × 1, 2 × 4 and 10 × 3). Questions 2 and 3, and the first after each
   pause (15, 29, 43), are easy: a pair with a 1, 2, 5 or 10 in it, "to wake up your whiskers".
3. **The tricky ones are spread out.** They are her twelve hardest facts before this sitting
   (`E.warriorHard`: E.hardFacts' rule over the 54 pairs other than 10 × 10, so the misses first,
   then the slowest, by each pair's most recent first ask) and the module's last new facts, 7 × 7,
   7 × 8 and 8 × 8: at most fifteen. They go at even spacing over questions 4 to 54, never two in a
   row, never right after a pause. Her own hard ones carry `hard: true`, so a right answer earns the
   runner's `remembered` line ("Last time, 7 × 8 made you stop and think. Not today!", the chapters'
   words with their comma; section 4 has the four).
4. **No table runs.** No two questions in a row share a number (never 3 × 7 then 7 × 9); no number is
   in more than two of any five in a row; never three in a row of the 21 pairs whose numbers are both
   3, 4, 6, 7, 8 or 9.
5. **The fill, and its last resort.** The rest fill in at random. The fill is greedy and starts over,
   on the same random stream, when it is stuck; after 100 starts it drops rule 4's last two clauses
   (the first still holds). After 200 it takes the last resort, which cannot fail: the tricky ones in
   their slots, a gentle pair at 1, easy pairs at 2, 3, 15, 29 and 43, 10 × 10 at 55, and the rest
   shuffled into the slots left, on the same stream. Rules 1 to 3 hold by construction (at most
   twelve of the fourteen gentle pairs can be tricky, so two are always free); rule 4 may not. The
   queue is always 55 distinct pairs.

A scratch prototype of these rules (`~/potomac-crossing-work/warrior-counts/editor/order.js`, from the
designer's) made 14,000 orders for seven kinds of player (no hard facts; four; fifteen; 10 × 10 among
them; all the 7s; all the 10s; twelve easy pairs): all kept every rule, in 3.2 to 4.7 starts on
average and 47 at worst, never relaxed, never the last resort. Forced to the last resort, 500 of 500
gave 55 distinct pairs, 10 × 10 last and a gentle first. One, for hard facts 6 × 7, 4 × 8, 3 × 7 and
6 × 8 (tricky at 6, 16, 20, 28, 35, 44 and 51; `|` is a pause):

```
4×1 10×9 6×5 10×2 9×3 6×7 1×5 3×8 9×9 5×10 6×1 4×7 1×1 10×8 |
2×5 4×8 3×1 7×5 2×2 7×3 10×6 8×1 6×3 10×4 9×2 10×1 9×5 8×6 |
7×2 4×4 6×6 5×5 7×9 1×2 8×7 3×3 8×5 4×3 10×7 9×1 5×3 4×6 |
7×1 8×8 5×4 6×9 2×8 10×3 4×2 8×9 7×7 3×2 4×9 6×2 10×10
```

**What she sees on each question.** The panel is the fountain scene, the same for all 55: Glintstar
on top, her at the foot, Tallyheart beside her, and the Clan around or the camp quiet (section 1).
No counting picture: the Warrior Counts ask what she knows, as Murmurpaw was asked, and a picture to
count would turn 55 questions into a counting test twice as long. Under the panel, Glintstar's
balloon asks it in words, as in chapter 3 ("Seven times eight."); then the question line in Andika
("7 × 8 = ?") and the lesson's keypad (1 to 9, delete, 0, OK; up to three digits). Above the
question line, four paw prints (section 4). No clock, no score, no question number. The bar keeps ‹
and Camp; there is no bottom Back on a question, as in every lesson; the Case File button is off on
the whole warrior screen, as in the Hollow, and stays on the hub.

## 3. A miss

- **The help is the lesson's.** The box turns red; 650 ms later Tallyheart scratches it out in the
  sand step by step (a tap counts along), shows the answer, says her line, and "Got it!" brings the
  next question: the runner's help, with three things only in the sitting. The help's first line (the
  anchor's reminder, below) stays above the count on its last page, so a reader of eight can finish it
  ("Got it!" is the only way on, brought into view on a small screen: on that page the paws step aside and
  "Got it!" sits at the top of the keypad's place, just under the question line, so bringing it in keeps the
  reminder on the screen; the merge's review); with Read to me on, the count starts once that line has been said (or
  at the latest when it would have been), so the first number never cuts it off; and Read to me's
  button on that page, and on 10 × 10's "A HUNDRED!" page, says what is there. It is pictured with the pair's **anchor Count**, the
  one of its two numbers taught first (1, 2, 5, 10, 9, 3, 6, 4, 8, 7): a picture she met in its own
  lesson, a hop she has done longest. 3 × 8 is eight patrols of three; 9 × 7 seven cats' nine lives
  (hop by tens, then tuck); 7 × 8 seven spiders; 4 × 6 four cheeks; 10 × 3 forepaws in pairs. The
  anchor's own openings come with it: the 5s' five-or-zero, the 10s' zero, and the 9s' tens, one
  tuck and "the two numbers make nine" (the sitting starts with `st.shown`, so that last one is on
  from the first question, as in the Hollow).
- **It counts once, and does not come back.** It is logged once (`correct: false, helped: true`).
  In a lesson a miss returns two questions later; here the sand has just shown the answer, so asking
  again two questions on tests the last ten seconds, not the fact, and 55 stays 55. It comes back in
  the Training Hollow and the next sitting (section 5). The runner is not changed for this:
  `E.warriorBegin` sets every queued fact's requeue count to `E.MAX_REQUEUE`, so `E.counts.answer`
  never requeues and says `missLast`.
- **Said kindly, once.** That a miss does not count as right is said once, by Tallyheart, before the
  first question of her first sitting. After a miss she never says "wrong", never counts what is
  left, and never claims she has it now. Her lines take turns, one a miss (`counts.missLast`, four):
  "There. Now you've seen it. On we go." "That's a tricky one. On to the next." "There it is. You're
  doing fine. Keep going." "Now it's in the sand. On we go." A miss on 10 × 10, the last, has its own:
  "There. A hundred. And that's every Count!"
- **The sitting always runs to 55**, even once a pass is out of reach. She does not know it is (there
  is no tally), every answer tells the Hollow something, and stopping her partway would be the wall
  module-1 rules out.

## 4. Pacing one sitting

- **How long.** A lesson of 15 to 20 answers takes 2 to 3 minutes (module-1), about 8 to 9 seconds an
  answer with its line. 55 is about 8 minutes; with the opening, the halfway page and the result,
  about **10 minutes** for a sitting that passes, half a chapter. A struggling one, with 10 to 15
  misses, runs **12 to 15 minutes**: each miss adds 10 to 16 seconds of sand (a 9s miss up to 18 steps
  at 775 ms). Still under a chapter.
- **After a right answer** the box turns green and, mostly, the next question comes (the runner's
  0.8 s with no line). About one in five gets a short word ("Yes." "Quick as a pounce!"): the set's
  `praise` and `fast` lists, with blank entries between their lines. Her hard facts get `remembered`
  (quick) or `rememberedSlow`, four lines each, in turn, with a blank between, so every other hard fact
  she gets right gets a word and none comes back every few questions (a strong player has twelve):
  "Last time, 7 × 8 made you stop and think. Not today!", "{a} × {b}! That one used to be tricky.",
  "No stopping on {a} × {b} this time.", "Quick! {a} × {b} used to take a while."; slow, "{a} × {b}
  again, and you got it. It's getting easier.", "You worked out {a} × {b}. Good.", "{a} × {b} was
  tricky last time. You got it.", "{a} × {b}. It gets easier every time." A line stays until it can be
  read to its end: the runner's 1.3 s (quick) or 1.5 s, or 0.6 s and 0.38 s a word when that is longer
  (4.8 s for the first); with Read to me on, until it can be said (its length and 0.4 s, 2.6 s at the
  least). A tap on the panel moves on. With Read to me on, her clock starts again when the question has
  been said, or at the latest when it would have been, so a voice that never says it has finished never
  counts against her (`E.warriorHard`'s 4 s).
  The sitting has no "after a miss" lines (`fastAfterMiss`): the runner keeps them on for the rest of
  a lesson, and "You didn't even look at the sand that time" could land forty questions after the
  sand.
- **The paws, and no tally.** Four paw prints above the question line, one a quarter (14, 14, 14 and
  13 questions). The one she is on fills a little at every answer, a miss the same as a right one;
  full ones stay full. They show how far, never how well. A running count of right answers would turn
  into a countdown of misses left, and one early miss would weigh on every question after it.
- **The pauses.** After the 14th answer, Tallyheart: "One paw done. Your whiskers are wide awake now."
  After the 42nd: "Three paws done. Just one more paw." (never "one to go": thirteen questions are left).
  Each stays 2.5 s, or 3.5 s when its line is over six words, or as long as it takes to read (0.6 s and
  0.38 s a word) when that is longer (the 14th's nine words: 4.0 s); with Read to me on, until its speech
  ends and half a second more, and at most that long again after that, so a voice that never says it has
  finished, or Read to me switched off partway, never leaves it on screen; switched on during a pause,
  it says the line from its start and waits for it. The panel under a pause is the fountain, after a
  miss's sand too. A sitting picked up right at a pause says "Where were we? Ah, yes." in it, first, and
  not again over the question after it; the pause waits for all of it (fourteen words at the 14th: 5.9
  s). A tap moves on. After the
  28th, **the halfway page**: Murmurchime's tail straight up (the crowd behind her, when there is
  one), Glintstar: "Halfway, {name}paw." Tallyheart: "Big stretch first. Front paws out, tail up.
  Like this." One button, "Keep going". (She may well stretch too. That is the point.) The pauses and
  the halfway page come after an answer and have no Back.
- **The last question** is 10 × 10, under the caption "At last:" and Glintstar's "Ten times ten."
  Right, it ends in her own shout, "A HUNDRED!" (the fact's `right` balloon, the player's), then Next.
  It is never `hard` (section 2), so the runner says her shout, never `remembered` in its place.
- **Left partway.** Camp, the bar's ‹ or a closed page pauses it; Camp and ‹ lead to the hub, the
  sitting kept. Back within two hours of when she was last there (`E.WARRIOR_PAUSE_MS`: from her last
  answer, or from the last time she picked it up, which starts the two hours again, so a sitting picked
  up late in its two hours takes her next answer), "Keep going" picks up at the same question. It is set
  aside as unfinished (never a not-yet, never counted against her) and a new sitting
  starts when two hours pass (`aside: 'late'`), or when she answers any other Counts question first,
  in a Training Hollow round or a chapter read again (`aside: 'practice'`: an answer in `counts` after
  the sitting's `at` whose set is not 'warrior'). A sitting's `at` is never earlier than her latest
  answer (a new one starts at now or at that answer's time, whichever is later, and keeping it never
  moves it back), so with a device clock set back after she played, answers stamped ahead of the clock
  never count as practice "after" a sitting and lock her out; "late" then runs from that time. One sitting means no practice in the middle of it:
  dinner is a pause; tomorrow, or a Hollow round in between, is a second sitting. A sitting set aside
  with no answer in it is dropped, not recorded; until its first answer a sitting is not one in
  progress: the hub offers no "Keep going" for it (its big button, "When you're ready" or "Try again
  whenever you like", picks it up within the two hours and plays its opening again) and the Hollow does
  not say it is waiting. While a sitting with an answer in it is paused, the Hollow says so before
  she picks a Count, in its greeting's place (the tricky greeting's "first?" would pull the other way;
  the paws on the buttons still mark the tricky Counts): "Your Warrior Counts are waiting at the
  fountain. Finish them first, or practice now and start them fresh later." ("Warrior Counts": in the
  Hollow a Count is a times table.) A Hollow round left partway picks up first, as always, and then the
  same line is said over its next question, so no answer there sets the sitting aside unwarned; that
  round's keypad is brought into view after `go()`'s scroll to the top, as a picked-up question's is in
  the sitting (only for a cat with `warrior` data: the Hollow of chapters 1 to 9 is as it was). A
  chapter read again warns the same way (chapter 10's review, README "Chapter 10 as built"): a chapter's
  lesson begun while such a sitting waits ("Count them again", or a first "Let's count!") opens with the
  same line over its first question, the last line before it, so no answer in a chapter sets the
  sitting aside unwarned either. The hub
  reads `E.warriorState` again on a tap and on `visibilitychange`, so it never offers "Keep going" for a
  sitting that has gone stale; so does the sitting's own screen: a question, the halfway page or an
  opening page left open past the two hours goes to the hub when it is seen again or a page is turned,
  and an answer typed there never goes into the stale sitting. The hub's next tap sets it aside.
- **The last answer in, never recorded** (a page closed at just the wrong moment, as
  `E.settleLesson` handles for lessons). `E.warriorBegin`, `E.warriorState` and `normWarrior` settle a
  sitting that is done through `E.warriorFinish`, at any age: one finished attempt, which may pass,
  never set aside.

## 5. The pass, and the not-yet

Every result page has the big Back beside Next (section 7). The lines below that vary are keyed by
`E.warriorResult`'s variant, named in brackets.

**The pass: 50 or more of 55** (`E.WARRIOR_PASS`: nine in every ten of 55 is 49.5, so 50).
1. Glintstar: "{name}paw. Every Count up to ten times ten, and {right} of them right." On 55
   (`clean`): "Every one. Not one missed. Like {Murmur}chime." (the fountain with
   `['morning', 'glow']`, as ch3 `f024`)
2. In a quiet sitting, first the caption "{Murmur}chime yowls, and the whole Clan comes running."
   Then "Every tail in the crowd goes straight up." Glintstar: "Tonight, the Clan gathers again. For
   your warrior name." (the crowd, with `['morning', 'sparkle']` until the raised tails are drawn)
3. Far above, Princess Waffles: "Did {petname} PASS? Somebody TELL me, darlings!"

Then "To your ceremony" (the Ceremony chapter from its first page) and "Camp"; while that chapter is
unbuilt, "Your ceremony is coming soon.", which the hub and the book then say in place of chapter
10's teaser once the result has been seen (a UI choice; `E.teaser` is unchanged), and never once the
Ceremony is built, finished or not. The pass is kept for good (`passedAt`); it finishes no chapter.

**The not-yet: 49 or fewer.**
1. Glintstar: "Not yet, {name}paw. The Counts will wait for you." Then one line by which not-yet it
   is, none of them counting attempts. Her first (`first`, always a sitting with the crowd), the old
   tom, loudly: "Took me THREE tries. Don't tell anyone." (his one capital word, as ever, in a plain
   balloon as his capital-word lines are in chapters 3 to 6: a shout is lettered all in capitals, and
   the word would stand out from nothing; "goes" reads as British). Her second (`second`), {Murmur}chime: "I
   {murmur}ed mine in the den every night, remember? You heard me." From her third (`later`),
   {Murmur}chime: "The Counts aren't going anywhere. And neither am I."
2. Tallyheart, walking her to the Hollow, says a number only when it is good news. With 45 or more
   right, or more than her last finished sitting: "{Right} right today. Fifty is a pass." Then, when
   it is more (`better`): "Last time it was {last}!"; otherwise, on 47 to 49 (`close`): "So close.
   Just {short} more next time." Under 45 and not more (`plain`): no number, only "You worked hard on
   every one."
3. "These were the tricky ones." Up to six of her misses, written out under her balloon in Andika
   ("7 × 8 = 56"), the named Counts' first, and within each a pair with a 1 last (1 × 8 is a slip more
   than a tricky one). Then: "Let's practice the 7s and the 8s in the Training Hollow. I'll ask those
   first. Then try again, whenever you like."

Buttons: "The Training Hollow" (big) and "Camp". With a Hollow round in progress (`E.hollowRound`),
the big one says "Back to the Training Hollow": the round picks up first, as now, and the tricky
greeting and paws wait on the Hollow's opening page after it, its reward's "Another round" included
(`E.hollowLines`' `tricky`, once). Trying again is on the hub, any time.

**After the pass** (question 2's first answer). The hub keeps a quiet button under the Ceremony's,
"The Warrior Counts again", for a clean sweep like Murmurchime's. That sitting runs as any other,
quiet; it never changes `passedAt`, opens nothing and is never a not-yet. Its result is one page
(`afterPass`): on 55, Glintstar "Every one. Not one missed. Like {Murmur}chime."; on 50 to 54, a
passing score and so good news (`afterPass.number`), Glintstar "{Right} right, {name}paw. Your pass is
yours for good."; under 50, no number (decision 49: v0.2 said the number at every score, which broke
it), Glintstar "Your pass is yours for good, {name}paw."; and any misses as chips under Tallyheart's
"These were the tricky ones." ("This was the tricky one." over a single chip). Buttons: "Camp" (big)
and "The Training Hollow".

**The tricky Counts** (`E.warriorResult`): each missed pair counts for both its numbers (a square
once); the one or two tables with the most are named, ties to the one taught later, never the 1s.
The Hollow already asks them first: `E.hardFacts` reads `counts` by pair, so the 7s' round leads with
7 × 8 and 6 × 7 (up to `E.HARD_PER_ROUND`, three, at positions 2 to 4) and the 8s' with 7 × 8. While
she has not passed, once she has seen that not-yet's result, the Hollow greets her "The 7s and the 8s first? I've got the tricky ones ready."
("the tricky one" when one missed pair is left in them) and puts a small paw on those Counts' buttons. Both come from her latest not-yet's misses that are
still in `E.warriorHard`: a Count's paw goes once none of its missed pairs is hard any more, the
greeting names only the Counts still marked, and it goes with the last paw. A right, quick answer
there takes a fact off the hard list, so the next sitting's tricky set is what is still hard.

**The result is seen.** Every finished attempt keeps `seen: false` until the result's last button is
tapped (`E.warriorSeen`). While the latest finished attempt is unseen, the hub's big button reopens
its result pages ("The Warrior Counts" / "Glintstar is waiting"): a page closed between the 55th
answer and the end of the pass still lets her hear Glintstar say it. Until then nothing on the hub, in
the book or in the Training Hollow gives a pass or a not-yet away: no quiet "again", no "Your ceremony
is coming soon.", no Ceremony button, and in the Hollow no tricky greeting and no paws (its plain
greeting; the result's own Hollow button marks it seen before it goes). After the pass, a sitting again
gives nothing away (her pass is known and kept for good): while its result is unseen it waits in the
quiet slot, "The Warrior Counts: Glintstar is waiting", and the Ceremony keeps the big one (its chapter
button, "Keep reading Chapter 11" partway through it, included); the hub and the book still say "Your
ceremony is coming soon." while it is unbuilt.

## 6. The save

Still save version 2, under the same key; `E.VERSION` moves (after chapter 9's, section 7). **One new
optional field on a cat, `warrior`, absent until her first sitting starts.** (`cards` went into
`E.blankCat`; this does not, so every cat that has not sat the Counts is stored exactly as today.)

| Field | Meaning |
|---|---|
| `warrior.sitting` | the sitting in progress, `{ at, state }`: a lesson state with `mode: 'warrior'` (its queue of 55, `pos`, `log`, `requeues` all at `E.MAX_REQUEUE`, `shown: true`, `crowd`, the pauses shown in `beats`, `aside`: why the sitting before it was set aside or dropped, or null) and when it started, its last answer went in, or she last picked it up; or null. It is never left done: the last answer records it (section 7) |
| `warrior.attempts` | every sitting that ended, finished or set aside, oldest first, the last 100: `{ n, at, done, finished, answered, right, passed, missed, ms, seen, aside? }`. `done` is its last answer's `at`; `missed` the pairs as asked (`[[7, 8], [6, 7]]`); `ms` her typical time on a right answer; `passed` is `finished && right >= 50`, set when it is recorded and kept as stored; `seen` whether its result was shown to the end; `aside` ('late' or 'practice') only on one set aside |
| `warrior.passedAt` | when she first passed, or 0; never unset |

Each answer also goes into `counts`, as every lesson's does: `{ set: 'warrior', a, b, answer, correct,
ms, helped, retry: false, at, table }`, `table` its anchor Count (the runner writes it because the
sitting's set has no `table` of its own). That is how the Hollow, a warm-up and the grown-ups corner
see it, by rules that already exist.

**The log's cap.** 55 a sitting is well inside `E.LOG_CAP` (2,000), but sittings add up: about 36
fill it, and then the oldest chapter answers go first, as Hollow rounds already push them out, ten a
round. Accepted: what reads the log for play (`E.hardFacts`, `E.firstTry`, a warm-up's hard pick)
reads each pair's latest ask, which every sitting refreshes for all 55, and a chapter read again whose
fillers come from a set's right answers (`E.fillPool`) falls back on that set's own facts, as for a cat
who never answered them. Tested with 40 sittings (section 8).

**E.migrate.** `normCat` copies only `E.blankCat`'s keys, so it gains one line: a `warrior` that is an
object, and her own key (never one inherited through a hand-edited `__proto__`), goes through `normWarrior`;
anything else is dropped, the key absent. A saved lesson whose state is a sitting's (`mode: 'warrior'`), in
`lesson`, `hollowWaiting` or a place, is dropped like any bad lesson: a sitting is only ever `warrior.sitting`,
so only a hand edit makes one, and `E.recordLesson` would record it as a sitting. `normWarrior` keeps:
- attempts that are objects with a numeric `right` (0 to 55) and a numeric `at`, in the shape above:
  `passed` as stored when it is a boolean, recomputed only when it is missing or is not one (a later
  change to the mark never rewrites history); bad pairs out of `missed`; `seen` a boolean (missing or
  not one: true, so an old result never reopens); `aside` only 'late' or 'practice'; the last 100;
- `sitting` only when `E.okLesson({ state })` passes, its mode is 'warrior', its `at` is a number, its
  queue is 55 distinct pairs in 1 to 10 and `beats` is an array of numbers; a sitting that is done is
  settled into an attempt (section 4);
- `passedAt` when positive, else the first passed attempt's `done`, else 0.

Idempotent: a second pass changes nothing.

**Why chapters 1 to 9 play byte-identically for every live save.**
- No live save has `warrior` (the Counts cannot open before chapter 10 ships), so `E.migrate` returns
  for each exactly what it returns today, and `E.blankCat`'s keys do not change: the "no new field on
  a cat" tests stand as they are.
- `PC.warrior` is not in `PC.story`, so `E.chapters`, `E.progress`, `E.countSets`, `E.learnedCounts`,
  the storyboards and the goldens never see it. The sitting is not a Count: no claw mark, no Hollow
  button, nothing in `lessons`; and it has its own slot, never `lesson`, `places` or `hollowWaiting`.
- The runner is untouched: `E.counts.start` and `E.counts.answer` gain no key. The sitting's no
  requeue, its turning miss lines and its `shown` are set on its own state and its own set.
- Every change to an existing function (section 7's list) applies only with `warrior` data,
  `mode: 'warrior'`, the 'warrior' view or a story with `opensWhen`; the one refactor (E.hardFacts'
  rule shared with E.warriorHard) keeps its output.
- Once she has sat it, her answers are in `counts` as a Hollow round's are, so a chapter read again
  adapts its warm-up to them, as it already does to Hollow rounds: the rule for practice as it stands.

## 7. Engine and UI pieces

**Building it.** On top of chapter 9 once it lands, never beside it: chapter 9 also moves `E.VERSION`
and `sw.js`'s `CACHE`, and edits `index.html`, `engine.js`, `ui.js` and `docs/build.md`. This piece's
`E.VERSION` and `CACHE` come after chapter 9's; it updates the version pin in `tests/engine.test.js`;
it gets its own section in `docs/build.md`. (The branch it was built on, `warrior-counts`, comes from
chapter 8, before chapter 9 has landed, so it adds `app/story/warrior.js` to `sw.js`'s `ASSETS` and
leaves these four to its merge on top of chapter 9: `CACHE` past chapter 9's, `E.VERSION` after
chapter 9's 0.9.0, the pin and the `docs/build.md` section. Not done is not optional. Done at the merge,
2026-10-31: `CACHE` `potomac-crossing-v21`, past chapter 9's v19 and the polish release's v20;
`E.VERSION` 0.9.1; the pin; `docs/build.md`'s "The Warrior Counts".)

**The story file.** `app/story/warrior.js` defines `PC.warrior`, not `PC.story.*`:
- `after: 'ch10'`; `scene`, the question panel (the fountain, drawn with the crowd when `st.crowd`,
  else quiet);
- `open: { first, again, quiet, resume }`: three lists of frames and one line (`resume`, the runner's
  `intro`), and `aside: { late, practice }`, Tallyheart's line before "Every Count, same as before.";
- `halfway`, one frame; `beats: { 14: [lines], 42: [lines] }`, Tallyheart's words at those pauses.
  The positions are `E.WARRIOR_BEATS`' alone (28 is `halfway`); a key not in it is an error;
- `pass`, `notYet` and `afterPass`, the result's frame lists, and the lines that vary keyed by
  `E.warriorResult`'s variant (`pass.clean`, `pass.quiet`; `notYet.first`, `second`, `later`;
  `notYet.better`, `close`, `plain`; `afterPass.clean`, `afterPass.number`, its `else` the page with no
  number), never by `when`: `E.matches` reads flags and looks, not an attempt. The balloon with the
  chips (`chips: true`) may carry `one`, its words over a single chip;
- `counts`, the sitting's lines: `praise`, `fast`, `remembered` and `rememberedSlow` (four each, a blank
  between), `missLast` (four, in turn), and 10 × 10's `prompt` (the caption and Glintstar's balloon),
  `right` and `missLast`. No `fastAfterMiss`. The help openings are each anchor's own.

Frames follow the frame contract (`scene`, `caption`, `say`, `board`), played in order with Next and
the big Back. Result lines take `{right}` and `{Right}`, `{last}` and `{Last}`, and `{short}` (50 less
right), in number words through `E.countWords`, filled by the engine before the cat's own tokens
(`{name}`, `{petname}`, `{Murmur}`); `{Right}` and `{Last}` start a sentence. The not-yet's last page also
takes `{tricky}` and `{Tricky}`, the one or two Counts named ("the 7s and the 8s"), filled by the page. Its script tag goes
after the chapters in `index.html`, its path into `sw.js`'s `ASSETS`, with a `CACHE` bump.

**Engine** (new unless it says changed):

| Piece | What it does |
|---|---|
| `E.WARRIOR_PASS` 50, `E.WARRIOR_BEATS` [14, 28, 42], `E.WARRIOR_PAUSE_MS` 7,200,000, `E.WARRIOR_TRICKY` 12, `E.WARRIOR_NEW` [[7, 7], [7, 8], [8, 8]], `E.WARRIOR_KEEP` 100, `E.WARRIOR_STARTS` [100, 200] | the numbers above |
| `E.warriorPairs()` | the 55, a ≤ b |
| `E.warriorAnchor(a, b, stories)` | of a and b, the one first in `E.countSets` (reused) order; a table with no set yet (the 7s, before chapter 10) comes after every taught one, and of two such the smaller |
| `E.warriorHard(cat, stories)` | E.hardFacts' rule over the 54 pairs other than 10 × 10, through one private helper both share |
| `E.warriorFacts(cat, stories, now, opts)` | the queue: 55 `{ a, b, table, prompt, hard? }` in section 2's order, its last resort included (`opts.giveUp`, for the test, forces it); `table` the anchor, `prompt` Glintstar's balloon (`[{ who: 'glintstar', text: 'Seven times eight.' }]`). 10 × 10 also carries the caption in its `prompt`, its `right` and its `missLast`, and never `hard`. `normFact` already keeps all of these |
| `E.warriorDef(stories)` | the sitting's set: id 'warrior', `teacher: 'tallyheart'`, `ground: 'sand'`, `PC.warrior.counts`' lines; no `table`, so every answer logs its anchor as `table` |
| `E.warriorAsk(def, st, q, stories)` | the set a question is asked as, in place of E.questionDef. From the anchor's `E.hollowDef` (reused) it takes only the picture (`table`, `thing(s)`, `unit(s)`, `picture`) and the help openings (`helpIntro`, `helpIntroFar`, `helpIntroNotFive`, `helpIntroNotTen`, `helpIntroTens`, `helpIntroOneTuck`, `helpIntroNotNine`). Every other key is the sitting's or is deleted, as E.questionDef's borrower path does, so none of the anchor's `remembered`, `fastAfterMiss`, `miss`, `again`, `prompt` or `helpCounter` leaks in. Its `missLast` is one line: the sitting's list in turn, by the misses in `st.log` so far |
| `E.warriorBegin(cat, stories, now)` | the sitting to run. A done one is settled first; one in progress within the pause, with no other Counts answer since its `at`, is picked up; else a stale one becomes an unfinished attempt (`aside`; dropped if it has no answer) and a new one starts: `E.counts.start` (reused) with `mode: 'warrior'`, then `requeues` at `E.MAX_REQUEUE` for every queued fact, `shown: true` and `crowd` (no finished attempt yet), saved as `warrior.sitting` (`warrior` created on her first). A sitting picked up has its `at` moved to now, so the two hours start again; a new one's `at` is now, or her latest answer's time when that is later by less than two hours (a device clock set back a little), and it carries `aside`, why the one before it was set aside or dropped (else null). Returns `{ def, state, opening }` |
| `E.warriorOpen(cat, st)` | the opening: 'resume' for a sitting picked up with an answer in it; else the sitting's own, 'first' (no attempt yet), 'again' (attempts, none finished) or 'quiet'; and, on 'again' and 'quiet', `aside`: the sitting's own `st.aside` (a sitting saved without it: the last attempt's) |
| `E.warriorKeep(cat, st, now)` | after an answer that is not the last: `warrior.sitting = { at: now, state: st }`, never moving the same sitting's `at` back |
| `E.recordLesson` (changed) | one branch first: mode 'warrior' goes to E.warriorFinish, never to `lessons`, never touching `lesson`. Its signature stays `(cat, st)` |
| `E.warriorFinish(cat, st)` | the attempt (from `E.counts.summary`, reused: `firstTry` is her right count), timed by its last log entry's `at` (E.counts.answer stamps each with `now`), so it needs no clock of its own; `passedAt` on a first pass; the sitting cleared. Returns `{ attempt, passed, firstPass, clean }` |
| `E.warriorResult(cat, stories)` | the result of the latest finished attempt, so the hub can draw it again while it is unseen: `{ right, last, missed (six shown: the named Counts' first, a pair with a 1 last in each), tricky, variant }`, `variant` saying `pass`, `clean`, `afterPass`, which not-yet (`first`, `second`, `later`), `better`, `close` or `plain`, and `number` (her number is said: on a not-yet at 45 or more or better; after the pass at 50 to 54, key `afterPass.number`) |
| `E.warriorSeen(cat)` | marks the latest finished attempt `seen` |
| `E.warriorBeat(st)`, `E.warriorPaws(st)` | the pause due before the next question, from `E.WARRIOR_BEATS` (each once a sitting, kept in `st.beats`); the four paws' fill, 0 to 1 |
| `E.warriorState(cat, stories, now)` | for the hub and the corner, a done sitting settled first: `open`, `passed`, a sitting to pick up (one with an answer in it; none once stale) and its paw, an unseen result, the attempts, the last |
| `E.countWords(n)` | number words to 100 ("fifty-two"); `E.numWord` stops at twelve |
| `E.isOpen` (changed) | one rule, only for a story with `opensWhen: 'warrior'` (the Ceremony chapter): open once she has passed, or once finished |
| `E.hollowLines` (changed) | only with `warrior` data: while a sitting with an answer in it is paused, the waiting line (`E.WARRIOR_WAITING`); while she has not passed and her latest finished attempt is a not-yet whose result is seen, the tricky greeting ("tricky one" for one pair left) and `tricky: true` on the Counts whose missed pairs are still hard (the key only when true). After a round (`reward`) the reward line keeps its place unless `opts.tricky` |
| `normCat` (private, changed), `normWarrior` | section 6 (`warrior` her own key only; a lesson whose state is a sitting's dropped) |
| `E.hardFacts` (changed, a refactor) | its rule moves into the helper it shares with E.warriorHard; its output is unchanged |

Unchanged: `E.progress`, `E.status`, `E.teaser`, `E.okLesson`, `E.countSets`, `E.learnedCounts`,
`E.counts` (`start`, `answer`, `question`, `summary`), `E.helpPlan`, `E.hollowDef`, `E.hollowStart`,
`E.settleLesson`. The Ceremony is a chapter like any other (`app/story/ch11.js`, `opensWhen:
'warrior'`): while it is closed `E.upNext` is null and the big button is free.

**UI** (`app/ui.js` and the page; each changed function only on the 'warrior' view or with `warrior`
data):

| Piece | What it does |
|---|---|
| The hub (`renderHub`, changed) | the big button: an unseen result before the pass or of her first pass, "The Warrior Counts" / "Glintstar is waiting" (and then no quiet "again", no "coming soon", no Ceremony button: `hideNext`); open and never sat (or a sitting with no answer yet), "The Warrior Counts" / "When you're ready"; a sitting to pick up, "Keep going" / "The Warrior Counts · third paw"; after a not-yet, "The Warrior Counts" / "Try again whenever you like"; passed, the Ceremony's chapter button as for any chapter, and under it a quiet "The Warrior Counts again", or, while a sitting again's result is unseen, "The Warrior Counts: Glintstar is waiting" there (the Ceremony keeps the big slot). Its Enter key (also once a tap has focused the page) and its Read to me line name whichever holds the big slot. While the Counts are open, no "coming soon" shows; once she has passed and the Ceremony is unbuilt (`ceremonyBuilt`: told from the chapters, not from "no next chapter"), "Your ceremony is coming soon." It reads `E.warriorState` again on a tap and on `visibilitychange` |
| `go('warrior')` (`go`'s map, changed) | a screen like the Hollow's: the opening frames (`drawArt` and `layoutText`, reused), the sitting, the halfway page, the result. The opening's and the result's frames have the big Back beside Next, stepping back within their own list (on a list's first frame it keeps its place, invisible, as `backBottom` does); the question pages, the pauses and the halfway page have none |
| `updateBar` (changed) | Camp shows on 'warrior' (she has finished a chapter); the Case File button stays off there |
| `onBack` (changed) | 'warrior' goes to the hub, the sitting kept (today an unknown view goes to the title) |
| `runLesson`, mode 'warrior' (changed) | the panel draws `PC.warrior.scene`, not a counting picture (the sand on a miss, as now; the fountain under a pause); each question's set from E.warriorAsk; on submit, `E.warriorKeep` when `!res.done`, in place of the `else cat.lesson = …` branch, and on the last answer only `E.recordLesson`, never an answer into a stale sitting; between questions E.warriorBeat and the paws; Read to me says Glintstar's balloon and not the question line again; the timing of section 4 (a pause's end, a long line's wait, the clock) and the help of section 3; the keypad brought into view after `go()`'s scroll; on the help's last page the paws hidden (back with the next question or a pause), "Got it!" at the top of the keypad's place. Every branch is warrior-only: chapters 1 to 9 play as they did |
| The result pages | the variant's frames; the tricky facts as Andika chips under Tallyheart's balloon; the buttons, the last of which calls E.warriorSeen |
| The Hollow (`renderHollow`, changed) | the waiting line while a sitting is paused, in the greeting's place, and over a round picked up (its keypad brought into view after `go()`'s scroll, as in the sitting); the tricky greeting, once the not-yet's result is seen (kept for the page after a round she went back to from a not-yet); a small paw on those Counts' buttons |
| `renderBook` (changed) | once she has passed and the Ceremony is unbuilt, "Your ceremony is coming soon." in place of chapter 10's teaser lines (once Glintstar has said it: not while her first pass's result is unseen; a sitting again's unseen result gives nothing away) |
| Grown-ups corner (`openGrownups`, `chapterProgress`, changed) | a "Warrior Counts" line: not open yet; open, not sat; then each attempt (date, right of 55, passed or not, missed pairs, typical time; set-aside ones marked, and why). A missed answer that is the start of the right one ("2" for 20, "5" for 56) is marked "a slip?", so the play test shows whether the keypad needs a guard (fourteen of the 55 answers end in 0, and 0 sits beside OK); the mark is not changed by it. The Ceremony chapter "opens once the Warrior Counts are passed" (no pronoun: the corner's lines are for a tom too). Warrior answers appear in the per-Count tables under their anchor |
| `index.html` | the script tag; CSS for the paws, the chips (two a row at any text size, a grid; a little smaller with Bigger text), the hub's button, the Hollow's tricky paw (in its button's left padding, absolute, so the name keeps its line; with Bigger text 1em, the padding 1.3em) and, in a sitting only, "Got it!" (and A HUNDRED!'s Next) at the top of the keypad's place |
| `tools/storyboard.mjs` | also writes `docs/storyboard/warrior.md` from `PC.warrior`'s boards |
| `tools/shots.mjs` | a `warrior` target (`warrior:open`, `warrior:q`, `warrior:sand`, `warrior:halfway`, `warrior:pass`, `warrior:notyet`, `warrior:afterpass`) and fixture keys for a test cat with `finished.ch10` and a `warrior` (its recipe: `sittings`, `seen`, `answers`, `stale`, `round`) |

New art: none needed. The camp, the crowd, Glintstar, Murmurchime and the old tom exist; Tallyheart's
place beside `FOOT` is a point; the sand is `PC.art.sand`; the paws are a small page SVG. The raised
tails are a note for later art, as chapter 3's trail of balloons was; until they are drawn, the pass
panels take chapter 3's overlays (`['morning', 'glow']` as `f024`, then `'sparkle'`). `'purr'` stays
the naming's.

## 8. Tests

`tests/warrior-engine.test.js` (the engine), `tests/warrior-story.test.js` (the story file) and
`tests/warrior-ui.test.js` (the page, its browser wiring pinned as text), in the suite (`node --test`),
on a stub chapter 10 with a table-7 set until the real one lands:

1. **The 55.** `E.warriorPairs()`: 55 pairs, each {a, b} once, ten squares.
2. **Every order**, for 1,000 values of `now` and five cats (no history; four hard facts; fifteen; a
   10 × 10 right but slow, at 5 s; a 10 × 10 missed): each pair once; 10 × 10 last, never tricky,
   never `hard`; 1 gentle; 2, 3, 15, 29 and 43 easy; no two in a row share a number; no number in
   three of any five; never three hard-tier in a row; every tricky fact present, never adjacent, never
   at 1 to 3 or after a pause; her hard ones `hard: true`; the same `now`, the same order, another
   `now`, another; each non-square pair shown each way 40% to 60% of the time. **The last resort**,
   forced (`opts.giveUp`): 55 distinct pairs, rules 1 to 3 kept.
3. **The mark.** Sittings driven through `E.counts.answer` and recorded through `E.recordLesson` (the
   UI's path to `E.warriorFinish`): exactly 49 right is not yet, 50 passes, 55 passes clean, and the
   first pass sets `passedAt` > 0; 0 right finishes without a throw; a sitting set aside with 50 or
   more right of fewer than 55 is not passed.
4. **A miss counts once.** The queue stays 55 (no requeue, from `requeues` alone); one log entry,
   `helped: true`; once in `missed`; the miss lines take turns, never one twice in a row; for all 55
   pairs the help plan (`E.helpPlan` with `E.warriorAsk`) is on sand, Tallyheart's, in the anchor's
   style (9 × 7 tucks, 10 × 3 in pairs, 5 × 8 swipes), its count ending on the answer, with no line
   from the anchor's own voice; a 9s answer whose numbers don't make nine gets that opening.
5. **The finale.** For a cat whose last 10 × 10 was right but slow and for one who missed it, a right
   10 × 10 gives `res.balloons` "A HUNDRED!"; a missed one says its own line, never "On we go".
6. **Again.** A second sitting is a new order; the first's misses are tricky and `hard: true`;
   attempts numbered; the crowd only until a finished attempt; the old tom only on the first not-yet,
   and no not-yet line counts attempts.
7. **The result's variants.** At 55 and 54; at 49, 47, 46 and 44, each better and worse than last
   time: `better`, `close` and `plain` as section 5 says, and no number under 45 unless better; after a
   pass, no not-yet, `passedAt` kept, and a sitting after it never moves it.
8. **The pause.** Through the store: within two hours a sitting resumes at the same question, queue
   and paws; after, it is an unfinished attempt (`aside: 'late'`) and a new one starts; one Hollow
   answer in between sets it aside too (`aside: 'practice'`), a Hollow visit with no answer does not;
   a sitting done but never recorded, inside and after the two hours, becomes one finished attempt,
   and passes with 50. A pick-up starts the two hours again (picked up at 1 h 58 min, an answer at
   2 h 1 min goes into the same sitting); a sitting with no answer is none to pick up and the Hollow
   does not say it waits, yet the next tap picks it up; the opening's reason is the set-aside's own
   (late, then one with no answer dropped for practice: "practice"), none after a finished attempt,
   never on the first opening. With her chapter answers stamped after the device's `now` (a clock set
   back), a new sitting still takes her answers and picks up, and a Hollow answer stamped after them
   still sets it aside.
9. **The slots.** Random walks through a chapter lesson, a Hollow round and a sitting, with reloads:
   nothing lost; a sitting never writes `lesson`, `places`, `hollowWaiting` or `lessons`.
10. **The Hollow.** After a not-yet missing 7 × 8 and 6 × 7, the 7s' round asks both at 2 to 4 and the
    greeting names the 7s and the 8s, once the result is seen (unseen, the plain greeting and no
    paws); right and quick there, they leave `E.warriorHard`, and the paws and the greeting go with
    them.
11. **Opening.** Closed before chapter 10 is finished, open after; a stub Ceremony chapter with
    `opensWhen: 'warrior'` closed (`E.upNext` null) until the pass, then next; an unseen result comes
    first on the hub, but after the pass a sitting again's waits in the quiet slot.
12. **Migration.** Every fixture save (`v1-saves.json`, the goldens' end cats) migrates as before,
    with no `warrior` key, idempotently; a cat with one goes through the store unchanged; junk is
    dropped (not an object: no key; a bad sitting, a non-number `at`, a short or repeated queue, bad
    `beats`: null; bad attempts out; a stored `passed` kept; `passedAt` never lost); a `__proto__`
    holding `warrior` makes none, and a lesson whose state is a sitting's is dropped from `lesson`,
    `hollowWaiting` and a place.
13. **Chapters 1 to 9 unchanged.** The chapter-7 and chapter-8 goldens pass untouched with
    `app/story/warrior.js` loaded (chapter 9's, recorded by chapter 10's build, after it); `E.hardFacts` the same for every golden cat; every existing set's
    start state byte-identical. After forty sittings fill the log, every chapter read again still runs
    to its end.
14. **Words.** Every line of `PC.warrior`, every variant, fills for a she-cat and a tom with no `{`
    left; no on-screen line has a bare she, her, he, him or his outside a token; `{Right}` and `{Last}`
    capitalised, `{right}` and `{last}` not; `E.countWords` 0 to 100; nothing from the names checks'
    "not to use" lists.
15. **The art.** Every `PC.warrior` frame and the question scene, with the crowd and quiet, render
    through `PC.art` in the storyboard vocabulary, as `scenes.test.js` does for the chapters
    (`E.checkStory` cannot: these frames have no `next`); `tests/storyboard.test.js` compares
    `docs/storyboard/warrior.md` too. The depth rule: on every scene, for six looks, a cast member
    further back is never drawn over a nearer one's head (each cat's place and size read as drawn).
16. **The page's help end and the Hollow's paw** (pinned as text): on the help's last page the paws
    hidden before "Got it!" is brought in, one scroll, the paws back for the next question and a
    pause, the sitting's "Got it!" at the top of its place; the tricky paw absolute, inside the
    button's left padding.

**In Safari**, for the shipping check: the runner's warrior branches cannot be reached from Node, so
six shots are their check (`tools/shots.mjs`, the screen locked, a fresh short session each): the
first opening, a question, the sand on a miss, the halfway page, a pass and a not-yet
(`warrior:open`, `warrior:q`, `warrior:sand`, `warrior:halfway`, `warrior:pass`, `warrior:notyet`).

## 9. Calls made, and questions for Aron

**Calls made under decision 46**, for the README, each Aron's to reverse: the hub, never the Hollow;
Glintstar asks, Tallyheart helps; plain questions; 10 × 10 last and never tricky, a gentle first,
easy openers, the tricky ones spread, no table runs; a miss does not come back; always 55; four paws,
no tally; the halfway stretch; two hours' pause, and practice in the middle makes it a new sitting;
the tricky Counts first in the Hollow; the result shown until seen; `warrior` absent until used.
v0.3's (2026-10-26): after the pass her number only on a passing score, 50 to 54 (the not-yet's 45 is
"how close to a pass", which a sitting after the pass is not); "It's been a while" for a sitting set
aside late; the waiting line in the Hollow's greeting's place and over a round picked up; four
remembered lines each with a blank between; the American "practice"; "Took me THREE tries."; "Three
paws done. Just one more paw."; nothing on the hub gives a pass away before Glintstar says it; the
sitting's timing waits for its lines (Read to me on or off), in the sitting only, so chapters 1 to 9
play as they did. v0.4's (2026-10-26): a pick-up starts the two hours again (the save's `at` is when she
was last there, not her last answer); a sitting with no answer yet is not one in progress; the opening's
reason is the new sitting's own, never on the first opening; the Hollow's tricky greeting and paws wait
for the not-yet's result to be seen; a sitting again after the pass leaves the Ceremony its big button,
its unseen result in the quiet slot; a pause stays as long as its words take to read, Read to me off;
a Hollow round picked up keeps its keypad on screen, only for a cat with `warrior` data; the old tom's
line in a plain balloon, his capital word kept.

**For Aron** (each is built as the first answer until he says otherwise):
1. **Her number at the end.** She hears it when it is good news: Glintstar on a pass ("fifty-two of
   them right"); Tallyheart on a not-yet only at 45 or more, or when better than last time
   ("Forty-six right today. Fifty is a pass.", "Last time it was forty-one!", "So close. Just two more
   next time."); under 45, no number. Or: no numbers at all, only passed or not yet, and the tricky
   ones. (Module-1 keeps numbers off the Training Tree; this result is the one place she would hear
   one.)
2. **After she passes, may she sit it again**, for a clean sweep like Murmurchime's? As designed, yes:
   a quiet "The Warrior Counts again" under the Ceremony's button, which never changes the pass or
   opens anything (section 5). Or: no, the button goes, and the Hollow is the place to practice.
3. **The Clan at a not-yet.** As designed: the whole Clan for her sittings until one is finished, as
   for Murmurpaw; after that only Glintstar, Tallyheart and Murmurchime at the fountain, so a later
   not-yet is said among friends, and a pass still brings the Clan running. Or: the whole Clan every
   time.

## 10. What v0.2 changed

From the engine and child reviews of v0.1 (2026-10-24): 10 × 10 is never tricky and never `hard`, so
the finale is always her "A HUNDRED!", with its own line on a miss; question 1 is gentle; the order
has a last resort that cannot fail; the crowd comes until her first finished sitting, then the
fountain is quiet; a not-yet says a number only when it is good news, and the old tom's joke only
once; the miss lines take turns and claim no mastery; practice in the middle of a sitting sets it
aside; a done sitting is always settled, timed by its own last answer; the result is redrawn until
seen; the frames have Back beside Next, and Camp and ‹ lead to the hub; the sitting needs no new
runner key (`requeue` dropped for `requeues`); the 9s' third opening is on; Waffles says
`{petname}`, and `{Name}` is `{name}`; every changed function is listed with its guard; the piece is
built on top of chapter 9; and the tests cover the UI's own record path, the art, the storyboard and
six Safari shots.

## 11. What v0.3 changed

From the reviews of the built piece (2026-10-26), each fixed in the engine, the story and the page
together: a sitting again after the pass says her number only at 50 to 54 (`afterPass.number`), else
"Your pass is yours for good, {name}paw."; one chip has its own words; the chips put a 1s pair last;
the Hollow says the waiting line in its greeting's place, names the Warrior Counts, and says it over a
round picked up too; the tricky greeting keeps its place after that round, and says "the tricky one"
for one pair; the hub and the book give no pass away while its result is unseen, and never say "coming
soon" once the Ceremony is built; the sitting's own screen goes to the hub once it is stale, and never
takes an answer into it; a pause shows the fountain, ends with or without its speech, and says "Where
were we?" first when it is picked up; the remembered lines are four each, with their comma; a long line
stays until it is read or said; the help's first line is said before its count and stays above it; the
clock starts at the latest when the question would have been said; the keypad is brought into view on a
picked-up question; a late second tap never turns a page; a paw shows from its first answer; the chips
go two a row at any text size; the caption no longer points at sand that is not drawn; "It's been a
while", "practice", "Took me THREE tries.", "Three paws done. Just one more paw."; and the tests read
the real chapters 9 and 10 once they land, with a storyboard test for `warrior.md`.

## 12. What v0.4 changed

From the second round of reviews of the built piece (2026-10-26), each fixed in the engine, the story
and the page together, each with a test: a sitting picked up starts its two hours again, so one picked
up near the end of them never goes stale while she reads its opening or before her next answer (section
4; a sitting with no answer yet still plays its opening again when the hub's big button picks it up
within its two hours, so she never misses the rule); a sitting opened and left before its first answer
is not one in progress, on the hub or in the Hollow (section 4); the opening's "we start fresh" is the
set-aside's own reason, carried on the new sitting, so it is said on that sitting's opening (again if
that opening plays again before her first answer) and never on the first opening (section 1); the Training Hollow gives a not-yet
away no more than the hub does: its tricky greeting and paws wait until the result is seen (section 5);
a sitting again after the pass no longer hides the Ceremony's button while its result is unseen, which
waits in the quiet slot, and the book keeps its "Your ceremony is coming soon." then too (section 5); a pause stays as long as its words take to read, so "Where were
we? Ah, yes." in front of it is read to the end (section 4); a Training Hollow round picked up under
the waiting line keeps its keypad on screen on a phone and with Bigger text (section 4); the old tom's
"THREE" is lettered in a plain balloon, as in his chapters (section 5); the grown-ups corner and the
storyboard say "practiced"; and section 8 names the three test files.

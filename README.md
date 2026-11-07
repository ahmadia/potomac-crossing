# Potomac Crossing

A story game for Lissa (8) and her friends. Each player is a pillow cat who joins a Clan of wild
cats on a mythic Potomac River, with otters for friends, a scattered clutch of dragonets to find,
a fox to outwit, and a mentor who teaches the times tables along the way.

The medley it grew from: Wings of Fire (dragons), Warriors (the Clan cats and the pretend
play around them), James Ponti (the mystery), otters (Lissa's favorite animal), and Potion Lab
(Aron's times-tables game, which stays a separate game).

**Play:** https://ahmadia.github.io/potomac-crossing/ (on an iPad: Safari, Share, Add to Home Screen)

**Status (2026-11-01):** chapters 1 to 11, the whole of module 1 and its Warrior Ceremony, are built as a static web app (`index.html`, `app/`; the
stack is in [`docs/build.md`](docs/build.md)), storyboarded frame by frame in
[`docs/storyboard/`](docs/storyboard/), and deployed on GitHub Pages from `main`. It is developed
on the Mac mini, in `~/potomac-crossing` (since 2026-10-04). Chapter 6, *The Snake in the Stones*,
shipped 2026-10-18, the first chapter made with `dev/workflows/chapter.js`; chapter 7, *The Counts
Don’t Lie*, 2026-10-20; chapter 8, *The Night Trail*, 2026-10-24; chapter 9, *Featherlight*, 2026-10-26;
chapter 10, *The Gathering*, the finale, 2026-10-31, with the Warrior Counts (decisions 48 and 49),
which open once chapter 10 is finished; chapter 11, *The Warrior Ceremony*, 2026-11-01, which opens once
she passes them and gives her warrior name (decision 52). Module 2 (the badger's track) is next.

## Docs

- [`docs/world.md`](docs/world.md): the world. The Accord, the map, the Clans, the otters,
  the dragons, the bad guys, Clan words, tone, themes, and the Counts.
- [`docs/module-1.md`](docs/module-1.md): the first solo module, *The Dragon Under the
  Bridge*. Ten chapters, the seven dragonets, the case, the paths, Tallyheart's lessons, and
  the real stone at the end.
- [`docs/chapters/01-through-the-glass.md`](docs/chapters/01-through-the-glass.md): chapter 1,
  drafted as the actual game text.
- [`docs/chapters/`](docs/chapters/): every later chapter's game text (02 After the Storm, 03 Under
  the Old Bridge, 04 The Glittering Scale, 05 Riffle's River, 06 The Snake in the Stones, 07 The Counts Don’t
  Lie, 08 The Night Trail, 09 Featherlight, 10 The Gathering, 11 The Warrior Ceremony), chapters 2 to 5 each with its notes, its Case File cards and the questions it raised. From chapter 6 a chapter has three files: its **brief** (the
  steering calls, the budget and the names, written before drafting), its **story** (what she
  reads), and its **spec** (flags, Counts sets, cards, art needs and build notes, written once the
  story is final).
- [`docs/storyboard/`](docs/storyboard/): the verbal storyboard of every frame, for an illustrator
  (generated from `app/story/`).
- [`docs/build.md`](docs/build.md): how it is built, tested and deployed.
- [`docs/warrior-counts.md`](docs/warrior-counts.md): the Warrior Counts (decisions 48 and 49), every
  pair up to 10 × 10 in one sitting, offered on the hub once chapter 10 is finished; built and merged
  onto chapter 9 (2026-10-31), so they ship with chapter 10.
- [`docs/continuity.md`](docs/continuity.md): where the story stands after the last shipped
  chapter (what happened, the flags, the cards, the names), for whoever writes the next one.
- [`docs/production.md`](docs/production.md): how a chapter gets made, what the first five cost,
  and the plan for chapters 6 to 10. The workflow script and its runbook are in
  [`dev/workflows/`](dev/workflows/); the offscreen WebKit tool is [`dev/webkit/`](dev/webkit/), and
  `tools/sweep.mjs` (the shared render cache), `tools/test.mjs` (the test tiers) and `tools/lock.mjs`
  (one heavy renderer at a time) keep a chapter's build from overwhelming the mini (2026-11-02).

## Decisions (Aron, 2026-10-03)

1. The project is called **Potomac Crossing**.
2. Players are Lissa (8) and her friends. First comes a small solo module that each plays
   alone, at their own pace; a harder game played together comes later. Design for one.
3. Our own world, made up by us: no names from the books.
4. Not dark to start.
5. The map is the Potomac.
6. Lissa plays a cat.
7. Animals that talk and are bad guys: badgers, dogs, foxes, weasels, snakes.
8. Module one has ten chapters and one culprit, with paths that let each friend's story go
   a little differently.
9. Potomac Crossing and Potion Lab stay separate games.
10. The math: the 1s, 2s, 5s and 10s, then the 3s and 4s, made as solid as possible through
    lots of exposure; taught by a positive, encouraging mentor cat who reminds her why the times
    tables matter; about 10–20% of play time; earlier lessons can be revisited. (Amended by 36:
    every table to 10 × 10.)
11. Lissa reads it herself.
12. Lissa doesn't vote on the premise or title yet.
13. No warrior name in module one: she ends it as an apprentice. (Amended by 34: a Warrior
    Ceremony chapter after chapter 10, once she passes the final challenge.) Her reward is a stone that
    also exists in real life, something cool that isn't expensive.
14. The mentor is Tallyheart, a she-cat.
15. One Clan for everyone: CrystalClan.
16. Seven dragonets can be found by playing through the story.
17. Each player names their own cat.
18. The real-world stone is labradorite: Drizzle's grey "mist stone," which flashes blue and green.
    (Drizzle is now Sprinkle: 38.)
19. Dragonets a player doesn't find still get home with the clutch.
20. Finding all seven earns a small extra: the eldest Mistscale bows to her.
21. Agreed: the times tables are "the Counts," pictured by things a cat carries; Russet the fox
    is the culprit, with the weasels Snip and Snatch; the clutch's weather names, looks and
    hiding places; she-cat or tom is chosen at the ceremony (as built, she chooses it earlier, at her
    reflection in the window); Training Hollow practice earns nest treasures; finished players
    leave their favorite stones on a cairn at the Crossing.
22. Themes: mystery and adventure; warmth, coziness and comfort; reassurance, bravery,
    friendship and teamwork; humor, funny or unexpected situations, and the occasional zany
    character.
23. The bad-guy kinds are a mix, more likely bad than good; each is judged by what it does.
24. Every player's cat was born a pet and joins the Clan. No family in camp.
25. Any humor is fine, gross-out included.
26. No romance, just friendships.
27. The repo is public, like Potion Lab; Lissa's name and age in the docs are fine to publish
    (2026-10-04).
28. A big labelled Back button beside Next on every frame, so an accidental tap forward is one tap
    to undo, and a choice or a typed name can be changed (2026-10-04).
29. The times-table numbers use an easy-to-read font (Andika), so 1 and 7 never look alike
    (2026-10-04).
30. Chapter 2 is built and shipped without a separate review of its text; Aron reviews it live
    (2026-10-04).
31. In chapter 2, the forbidden look under the Old Bridge finds a glimpse only: drag marks, a
    sniffle, two big eyes that blink and vanish. the dragonet stays chapter 3's reveal; Tallyheart
    catches her coming out, more worried than cross (2026-10-04).
32. Chapter 2's Counts: about 16 answers. Two warm-up questions on the 1s, skip-counting ears with
    a tap per cat, about ten on the 2s in both orders, then the prey pile counted in pairs
    (2026-10-04).
33. The prey pile is simple cartoon prey: soft round shapes with tails, eyes shut, no blood
    (2026-10-04).
34. She stays an apprentice through chapter 10. Passing the final challenge opens a short
    Warrior Ceremony chapter after chapter 10, where she gets her warrior name. Lissa wants to be a
    warrior, so the hints start in chapter 3 (2026-10-06; amends 13).
35. The final challenge, the Warrior Counts: every multiplication pair up to 10 × 10, passed with
    90% right (2026-10-06).
36. Module one teaches every times table up to 10 × 10: the 6s, 7s, 8s and 9s are added
    (2026-10-06; amends 10).
37. Chapter 3's warrior hint: her denmate, the tortoiseshell apprentice, takes her warrior
    assessment, every Count up to ten times ten, while she watches; Tallyheart: "One day, that'll
    be you" (2026-10-06).
38. The dragonet everyone meets is **Sprinkle**, not Drizzle: Warriors has a Drizzle (2026-10-06;
    amends 18 and 21).
39. The tortoiseshell apprentice is Murmurpaw, named Murmurchime when she passes the Warrior
    Counts in chapter 3 (2026-10-06).
40. "Mistscale" stays, on screen from chapter 3 (2026-10-06).
41. Princess Waffles keeps her name (2026-10-06).
42. Every proposal that stood in this README is confirmed as written (2026-10-10). In short:
    - the six further themes in `docs/world.md`; every chapter ends warm, in her nest, with a
      curious hook; Sprinkle practices flying in chapter 9; Princess Waffles is a witness; her Tall
      One lets her go and the door stays open; she has a pet name Waffles never stops using;
      Glintstar gives her one moon, until the Gathering ("a moon" runs to the next full moon); her
      pillow-cat life sets what she's good at, and her Tallwalker know-how helps the case; the
      Clan welcomes a new name by purring it;
    - no fish in the prey pile; Riffle's gift is a wishing stone (dark, with an unbroken white
      band: a second real stone she could hold); the tallest tower has a red light and the littlest
      dragonet's roar ends in a hiccup; Glintstar gives her the morning count (eight gone by chapter
      3, twelve by chapter 4); the dug earth and the tidy stacks are clues in module-1's table; the
      back cover no longer puts the scale and "dragon" on the first morning; the Barking Field dogs
      may be Good Boy and Drop It in chapter 8;
    - the 6s to 9s: chapter 5 the 9s, chapter 7 the 6s, chapter 9 the 8s, chapter 10 the 7s, with
      their pictures (whiskers on one cheek, sunrises in a quarter-moon, a spider's legs, a cat's
      nine lives);
    - clue 4 tells weasel from dragon by the prints' size; Murmurpaw's Warrior Counts is a clean
      sweep; Sprinkle's book page and the kept path's walk as built; a fact read under a long
      prompt only counts as hard when missed.
43. The littlest dragonet, on the tower roof, is **Squall**, not Thunder: Thunder is a Warriors
    character (2026-10-10; amends 21).
44. The fox is **Reynard**, not Russet: both series have a Russet (2026-10-10; amends 21).
45. From chapter 4 she keeps a **Case File** she can open any time: a card for each clue she
    finds, with a little picture and one line. In chapter 10 she answers Reynard by picking cards
    (2026-10-10).
46. **"I'll let you steer"** (Aron, 2026-10-10): from chapter 5 on, Claude decides the open
    questions as they come up, records each choice below with its reason, and keeps building. Aron
    can reverse any of them; a reversed choice gets a new numbered decision.
47. **Chapter 6 may run to 22 minutes** (Aron, 2026-10-18), answering `docs/production.md`'s open
    question (22 minutes, or back to 15–20) for this chapter. It takes it as: the plain path at
    most about 2,000 words (chapter 5's was 1,965, about 22 minutes), and its one optional scene,
    Sleet's, up to about 300 words, with room for a full riddle. The kids are enjoying chapters 3
    to 5, and chapter 6 is built on the current plan.
48. **The Warrior Counts** (Aron, 2026-10-24): every pair up to 10 × 10 once, so 3 × 7 and 7 × 3 are
    one pair (55 questions, each pair shown in a random order), in **one sitting**; she passes with 90%
    (50 of 55 right). A missed question still gets the sand's help but counts against the 90%. If she
    doesn't pass, she can **try again whenever she likes**, and Tallyheart, warm about it, points her
    to the Training Hollow for the tricky ones. Built and tested as its own piece before chapter 10's
    build.
49. **The Warrior Counts' three open questions** (Aron, 2026-10-24; `docs/warrior-counts.md`): she
    hears her number only when it is good news (on a pass, and on a not-yet only at 45 or more right
    or when better than last time); after passing she may quietly sit it again for a clean sweep, which
    never changes her pass; the whole Clan watches her first sitting, and after that only Glintstar,
    Tallyheart and {Murmur}chime, with the Clan running in for a pass.
50. **The finale may run to about 30 minutes** (Aron, 2026-10-24): chapter 10's plain path up to about
    2,700 words, so the case and the goodbyes get room; it stays one chapter (decision 8's ten).
51. **The 7s are a clutch of seven** (Aron, 2026-10-24; amends 42): the seven dragonets of Sprinkle's
    clutch, not "sunrises in a quarter-moon", which echoes the books' "quarter moon".
52. **The warrior name: both** (Aron, 2026-10-31): at the Warrior Ceremony Glintstar offers names drawn
    from her moon, and the player may choose one or name herself. Where it happens is Claude's call, and
    the Ceremony (chapter 11) is built next.
53. **Module 2's maths: multiplication kept fresh, and long subtraction, with some Spanish** (Aron,
    2026-11-07): it reinforces her multiplication and teaches long subtraction, three-digit with
    regrouping (borrowing across a zero; two-digit regrouping as the warm-up). She learns maths in Spanish
    at school, so a Spanish-speaking friend counts and says the facts in Spanish in the story. Her class's
    words for regrouping are not known: use the common US-immersion words (reagrupar, desagrupar) and keep
    them easy to change.
54. **Module 2's four open questions** (Aron, 2026-11-07; `docs/module-2.md`): she gets an apprentice of her own,
    Chispapaw, on her first day as a warrior, and Tallyheart still teaches them both; one badger, Harrumph, keeps the
    Accord for one frost-time (decision 7's bad guys stay wary of badgers as a kind); Reynard is the hidden hand
    behind the rumours, seen only far off; the real reward at the end is a fossil shark tooth.

## Claude's calls under decision 46

Each is Aron's to reverse.

- **Fog is Wisp** (2026-10-10): Warriors has a cat named Fog. Wisp is in neither series and suits
  the pale, silent sister in the reeds. Puddle, Hail and Sleet keep their names (the books have
  only longer names such as Puddleshine and Hailstar, never those exact names). Dew, an exact
  Warriors name, is renamed Mizzle (chapter 9's brief, call 11); she is no longer "the tiniest" (Squall is
  the littlest of the clutch).
- **The thefts go on, four every night** (2026-10-10): chapter 5 opens on the fourth count
  (sixteen gone), chapter 6 sets the guards, and chapter 7's sum is six nights: twenty-four gone
  against the sixty a dragon would eat, worked with the 6s she learns that chapter. The card
  "Four gone every night." holds throughout.
- **Chapter 4's Squall path keeps its length** (about 22 minutes for the players who climb).
- **Chapter 4 is built on its own notes as written** (2026-10-11; `docs/chapters/04-the-glittering-scale.md`,
  "For Aron to confirm"): the Case File is curls of bark from the Training Tree, each marked with
  an eye (what she saw) or an ear (what she was told); the rule of rows of ten comes before the
  third theft and the rows find it; everyone visits Sprinkle and the roof is an optional stop;
  Squall's tower is her old tower, climbed outside or ridden in "the little room that goes DING";
  the fox comes to the far side of the Barking Field and the dogs see him off; she asks a fair
  question in front of the Clan and Glintstar charges no cat by name; Squall's riddle is 7 × 5;
  the "scale" stays where it was found until the Gathering.
- **Chapter 5, *Riffle's River*, the seventeen calls of its text** (2026-10-11;
  `docs/chapters/05-riffles-river.md`, "For Aron: The calls, in short", where each has its reason):
  1. The 9s are tens with one claw tucked in: "hop, then tuck," on yesterday's cats; the two
     numbers of a nines answer make nine, as a check. The nine lives are counted on claws and never
     spent.
  2. She types the morning count (3 × 10) and sees the gap; the old tom slept on guard; Glintstar
     asks Tallyheart for proper guards by tomorrow night; tonight the old tom tries a pinecone.
  3. Tallyheart comes down to the rocks for the Roar: she counts chapter 1's promise herself, calls
     the nine claws, and counts them. The warm line waits for the den.
  4. The Roar comes first, and can't be failed; then both witnesses are always asked, and the
     player chooses the order.
  5. She never sets a paw in the marsh: "Stay on the otters' raft. The marsh mud belongs to
     ReedClan." ReedClan is on screen for the first time, as three cats on a log.
  6. The otters' gossip comes from a duck; their useful news is that the old otter had the dragon
     story from the fox himself, twice, the same way both times, and their useful find is a tuft of
     thin brown fur: not cat, not otter, not fox. Nobody says weasel.
  7. Patience the heron charges by the answer, sees in the dark, and does not guess. She saw two
     small shapes cross her mud when the rain stopped, and they come back every night. Nine answers,
     eighteen fish; Riffle catches twenty. She gives the way to Coil free, and Riffle one good word.
  8. Puddle can be found twice over: by looking under a raft that is still shivering after the
     Roar, or by asking after Riffle's slip on the way home. He saw the pile from the air and never
     landed in camp. He stays under the raft by Mama's rule: stay where you land. If she finds him
     before the reeds, he says hello to Wisp there, as a snout between the logs.
  9. Wisp is found by choosing to keep still three times. She is silent: a claw across her snout,
     a nod, a forepaw, two drawings, and no balloon. Patience says the rest, so the name is Wisp's
     own. What the fox dropped has sunk. Half of every fee is hers: that is why the price is two.
  10. Every player sees Sprinkle at sunset; the forepaws in chapter 3's mud become the quest's
      tally.
  11. The roof is offered again to a cat who has not met Squall, on one screen, after the lesson
      and before the Crossing, with chapter 4's scene unchanged; a cat who says "Not today" twice
      gets one more offer, in chapter 9. A cat who met him in chapter 4 reads nothing at the tower.
  12. Riddles: Puddle's is 4 × 10 (bumps on the raft's four logs), Wisp's is 7 × 1 (herons on one
      leg).
  13. The 1s are typed once by everyone, as 9 × 1, tapped twice (paws aboard, claws in the log),
      and typed again by a cat who waits for Wisp. The twos and the five she types are chapter 3's
      own (7 × 2, 9 × 2, 4 × 5): chapter 6's mix should pick others.
  14. The elders' claw trick is kept out of the lesson and held for the Training Hollow.
  15. The old otter says what the Roar is and calls it the courage test, and she asks what happens
      if she moves; the Roar's refrain counts claws, not whiskers; Riffle's seven questions are
      seven taps; a noticing cat tells Tallyheart about the prints behind the pile the same night;
      a chapter's page in her book says "found" only for a dragonet found in that chapter.
  16. The fox tells the old otter one story, the same way twice (no goose: the case keeps
      module-1's five); Tallyheart hears about the heron's two small shapes the same night; the
      Count's picture is staged on Tallyheart's own paws and "one less than a ten" is said on
      screen; the Roar is explained before Tallyheart names it; Riffle's pole holds the raft while
      he dives; Coil is "that nosy old thing"; Glintstar's guards are for tomorrow night; Puddle is
      never drawn going under; "Your secret is getting bigger."
  17. Wisp is silent, and Patience speaks for her; a climber's sight from the pole is a card and is
      told to Tallyheart; Puddle and Wisp meet when she has found him first; one measure for the
      prints, half the size of hers; Tallyheart asks for "somebody else who was awake when the rain
      stopped"; the loud way out of the first wait has a tell; a found Wisp gets her fish, and two
      are left over on their string; the nines' hop and tuck plays on retries too; no life is
      mentioned on the water, and the raft is never harmed.
- **Chapter 5 keeps its length** (2026-10-11): about 1,965 words and 107 frames without the
  optional scenes (the brief: 1,900, and 80 to 110), about 2,410 and 131 with Puddle and Wisp, and
  about 2,670 and 146 with the roof as well; about 22, 27 and 30 minutes. The next cuts, if it must
  come down, are listed in the text ("The length").
- **Chapter 5 as built: where the pictures and the pages go past the text's notes** (2026-10-12;
  `docs/build.md`, "Chapter 5", "As built, after review"). Each was a review finding; each is small.
  - *The roof by day.* The roof is chapter 4's, frame for frame, but in chapter 5 she climbs it in
    the morning, between the lesson and the Crossing: its panels are in daylight, not chapter 4's
    afternoon gold, so the sky does not turn orange for eleven panels between two blue ones.
  - *The gulp is two frames.* A cat who found Wisp reads "One for Patience. One for Wisp." on a
    panel that has Wisp in it, swallowing; everyone else's panel has nothing in the reeds. (The
    text's Build note had one frame with two captions, and a scene cannot change its cast by a
    flag.)
  - *Wisp is hidden until she is found.* While she is still "a reed" a sheaf of pale plumes stands
    across her and she is thinner still; the knees, then the eyes, are real steps. Her flinch, for a
    cat who yells, has its eyes squeezed shut: the two open gold eyes are the reward for waiting.
  - *Her paw over a print.* "You hold your paw over one. It's half the size of yours." is drawn:
    she crouches at the raft's very edge with one forepaw out over a print half its size. She is
    still on the raft.
  - *The prints stay, and so do the two spare fish.* Nobody wipes the marsh's prints, so they are
    in the mud to the end of the marsh; and the string with the two fish left over rides home on
    the raft's logs, on the river and at the Crossing ("Two to spare" is said, so they are drawn).
  - *One panel is not in the text.* After "Under the raft" on the way home the raft glides on with
    two nostrils and a small "blub…" between its logs: the Build note wants the bubbles on the
    frame after that scene, and the text's next screen there has no raft.
  - *Her book, for a tom.* Two recap sentences name the cat or Puddle where "he" or "him" would
    have meant two different animals ("Puddle saw clever little paws…"; "…and showed {name}paw a
    tuft of thin brown fur."), as chapter 4 did for the fox.
  - *Smaller ones.* The bill's first question does not say the frame's line again (on a phone it
    hid the top row of the nine pairs); a cat who already knows Puddle and picks "Not now. He's
    being a log." does not read "Only blue sky."; the chapter's first two panels have the sleeper
    alone at the left, so the snore is lettered over him; the Roar is lettered in the sky; the
    telling at the den is in the wide view, so each balloon sits over its own speaker; Riffle is in
    every panel that shows his seat on the raft; he asks "What did I miss?" wide-eyed (the laughing
    face has tears, and he looked upset).
  - *Three sounds have words for a child who listens.* Read to me never reads a sound effect, so
    three captions that run on into theirs were heard as unfinished sentences. With Read to me on
    she now hears the sound in words right after each: "From the tallest tower:" "a roar, and a
    tiny hiccup."; "On the rocks, otter tails go" "Slap! Slap! Slap!", before Riffle's shout; and
    "Then, a little later:" "a long, long snore." The page's lettering is unchanged; the words are
    the frame's `sfxRead`.
- **The open river is the Crossing's water: bright blue** (2026-10-12; chapter 5). The open river
  was drawn green-brown, as the text's note asked ("green-brown and sunny, never black"), and on
  the page it read as a lawn or a meadow with a raft sitting on it, not as water. One page earlier
  the same river, at the Crossing, has been bright blue since chapter 2, so the water changed colour
  three times in a reading (pushing off, coming back to the otters, the way home). The note was
  there to keep the river from looking dark and frightening (it is the deep-water worry's river),
  and that is kept and still measured: nothing on it is dark, in any light. So the open river is
  now the same sunny water as the Crossing: the sky's colour toward the far shore, a touch greener
  and deeper near the raft, with the towers' reflections, the ripples and the sun's glints on it.
  The way home keeps its gold evening light: gold on the far water, a soft evening blue under the
  raft. The small pictures on the raft (Puddle's forepaw, the claws in the log, the raft from
  underneath) took the same blue. The Crossing and every panel of chapters 1 to 4 are untouched,
  and the marsh keeps its still green water (it is a marsh, and never shows the river). No line she
  reads changed; the text's notes say "bright blue" where they said "green-brown"
  (`app/art/sets/openriver.js`; `docs/build.md`, "Chapter 5", "As built, after review"). This was
  the final review's one finding left as an open question; it is answered here, not asked.

- **Chapter 6's brief** (2026-10-18; `docs/chapters/06-the-snake-in-the-stones.brief.md`, where
  each call has its reason in full). In short:
  1. The day is her first border patrol, three cats because a patrol is three: the morning count
     (twenty gone in five nights), the 9s warm-up and the 3s, ReedClan met on the patrol, Coil on her
     visit to Sprinkle, Sleet offered at the Barking Field's far corner, guards set at sunset, the
     dream at night.
  2. Coil is funny-creepy and never frightening, carried by two true snake facts: a snake has no
     eyelids (so he never shuts his eyes, Patience's tip), and a snake feels footsteps through the
     ground (so he felt the small diggers under the pile). He never strikes, squeezes or shows a
     fang.
  3. His price is quiet: no juggling under the bridge. He has always known about Sprinkle and told
     nobody, and he never trades with foxes, said plainly, so no child worries that he will give her
     away.
  4. ReedClan blames CrystalClan (an apprentice on their marsh yesterday, looking at their mud),
     then, at her fair question, admits what their pride had hidden: their own pile has been raided
     too, night after night, and left tidy. No number is given for their losses, so nothing touches
     chapter 7's sum.
  5. The ReedClan speaker is **Sloshbank**, a big, stern tom whose belly is always dripping; the
     other two are unnamed. Clear on both wikis, whole name and both halves (2026-10-18): Sloshbank,
     Plashwick, Wadebank, Ploppaw. The drafts called him Bogwade, renamed before the critics: Wings
     of Fire has a "Bog" (the MudWing Chameleon pretends to be). Damplark and Boglark are out too:
     Lark is a character in both series.
  6. The dream gives no Case File card (a dream is not evidence). It points her toward a witness who
     was awake when the rain stopped; the third witness to the moon is chapter 7's.
  7. Sleet is found at the last post of the fox's border, never past it, with Riffle (or Tallyheart,
     on the told path) beside her; on the kept path Tallyheart never sees a dragonet. Sleet is a he,
     so the clutch is four sisters and three brothers (module-1 does not say).
  8. The 3s are taught as "you already know half the threes": 3 × 1, 3 × 2, 5 × 3, 10 × 3 and 3 × 9
     came up in chapters 1 to 5, so at least six of the lesson's ten facts are the new ones (3 × 3,
     3 × 4, 3 × 6, 3 × 7, 3 × 8, either order).
  9. No new engine features, at most four new cards, and one new flag (`foundSleet`) plus at most one
     choice flag a later chapter reads.
  10. Chapters 7 to 10 keep decision 47's budget (about 2,000 words on the plain path, one optional
      scene of about 300) unless Aron says otherwise.
- **Chapter 6 as built** (2026-10-18; the spec's "Calls made",
  `docs/chapters/06-the-snake-in-the-stones.spec.md`, has all of them with their reasons). The ones
  worth knowing:
  - *No new place.* The ReedClan border is the old stone wall's far end, where the reeds begin (a
    second picture of the `title` set), and the dream is a second picture of the Sky River.
  - *ReedClan's cats have marsh coats of their own*, which no player's cat can have, so the first
    ReedClan faces never look like her or her Clan.
  - *The starry cat is a Clan cat drawn in starlight*: unnamed, kind, and nobody she knows.
  - *Coil's card goes under the moss* with Sprinkle's two, on every path.
  - *Coil is drawn larger than the spec first had him* (his head was a speck in the close-ups); still
    smaller than a cat's head, mouth shut, no tongue or fangs.
  - *One small engine change*: a Count now counts as learned when its own lesson is finished, not
    when any Counts on that table are. Chapter 6 asks four patrols of three before the 3s lesson,
    which would have lit a sixth claw mark one screen early. Checked at every point a player can
    stop in chapters 1 to 5: nothing changes for them.
  - *The length:* about 22 minutes on the plain path and 25 with Sleet; 16 typed answers, 17 with
    Sleet; 136 frames, about 100 in a reading and up to 114 with Sleet.

- **Chapter 7's brief** (2026-10-20; `docs/chapters/07-the-counts-dont-lie.brief.md`, each call with
  its reason). In short:
  1. The day: Waffles at dawn, the sixth count (guarded, and robbed anyway: twenty-four in six
     nights), the 3s warm-up and the 6s, the sum with Tallyheart, the bridge, the tunnel at dusk.
  2. The 6s picture keeps decision 42's "whiskers on one cheek" as a close-up: six whiskers in two
     rows of three, "six is two threes". The game's cats are drawn with two whiskers a side, so the
     close-up is where you can count them, and no live drawing changes. The 6s are taught as double
     the 3s, and "you already know most of the sixes" (only 6 × 4, 6 × 6, 6 × 7 and 6 × 8 are new).
  3. The sum is 4 × 6 = 24 against 10 × 6 = 60 (the brief's 6 × 10 turned round, so both read "a
     night's count, for six nights"), typed after the lesson. Only the told path's
     Tallyheart knows Sprinkle eats ten fish a meal, so on the kept path the sixty is worked with
     Riffle; "A warrior who knows her Counts can't be fooled." is Tallyheart's on both.
  4. Waffles is the third witness to the moon (no moon, not a sliver): two witnesses against the fox.
  5. FLEW against can't-fly is linked for everyone (Tallyheart told, Riffle kept), and Sprinkle's big
     prints are set beside the thief's tiny ones. Nobody says weasel.
  6. The tunnel is found at dusk behind the back row; nobody goes in. No optional scene this chapter,
     no new cast, no new place.

- **Chapter 7's spec** (2026-10-20; `docs/chapters/07-the-counts-dont-lie.spec.md`, section 9, has
  all 29 calls (the 29th, integration round 1) with their reasons). The ones worth knowing:
  - *FLEW is linked by a new flag, `ch7Flew`*, not by setting chapter 4's `ch4CaughtFly` for
    everyone: every reread of chapters 4 and 5 reads exactly as before, and "I KNEW it!" stays a
    noticing cat's. One line of shipped code changes (the Case File link also reads `ch7Flew`).
  - *Waffles' card is laid beside the two moon cards* (Patience's and the fox's); no card is
    "answered" yet: judging the case is chapter 10's.
  - *The tunnel card touches Coil's* ("Coil felt them. Now I've seen where."). The four new cards
    are under the moss on every path but Waffles'.
  - *The twenty-four's help hops by fours* (a night at a time), so that one answer is filed under the
    4s until chapter 8 teaches them.
  - *The comparison is drawn to scale*, a short line for 24 and a long one for 60, with the numbers.
  - *The storyboards of chapters 4 to 6 change one phrase* ("two corners showing" under the moss
    was already wrong for chapter 6): words for an illustrator only, nothing in the game.

- **Chapter 7's build review, integration round 1** (2026-10-20; the reviewers' findings in
  `~/potomac-crossing-work/ch07/review.json`). The ones worth knowing:
  - *Sprinkle's print, close up, is drawn as big as the wide shots draw it* (about four-tenths of a cat's
    height, as big as a heron's foot), her paw held over its heel pad and the five toes and claws fanned
    out beyond it, toward us: at the spec's first size, her paw about half its length, the print hid under
    her paw and its claws read as her own. The spec's "her paw about half the print's length" became
    "about a fifth".
  - *The told path's tunnel screen is two panels*: her "So THAT'S why…" first, then Tallyheart's "And I
    SAT here. Right beside it!" with the choice. On one panel her balloon's tail ran through Tallyheart's
    balloon, so the page joined the two whispers as one speaker. One more panel on the told path (81 or 82).
  - *One story line changed*: on the told path under the bridge she says "Four a night, for six nights:
    twenty-four." (it was "Twenty-four gone in six nights."), so Sprinkle's "Only FOUR a night?" answers a
    number she has just heard, as on the kept path.
  - *Her book's FLEW sentence names both claims* ("…so Reynard's story that the dragon FLEW can't be
    true."): its "they" could be read as Sprinkle and Reynard.
  - *The 6s lesson still never notices speed*: every one of its ten facts has a right line of its own, so
    the engine's "Quick as a pounce!" can only play on a filler. Kept, and written down in the spec's known
    issues: dropping 5 × 6's own line ("Thirty! You hopped that one already.") would change the story to
    win one speed line. Chapter 8 should leave a fact or two without its own right line.

- **Chapter 7 as built** (2026-10-20; the spec's sections 5, 7 and 9 have the detail). Where the
  frames went past the spec, each small:
  - *Tallyheart sits across the nook* on every told-path panel under the bridge (at the spec's spot
    she sat on top of our cat), as chapter 6's last fix had her.
  - *Some lines became panels of their own*, so captions come before the balloons they answer and
    no panel holds five boxes: "Sorry, Coil," the old tom's pinecone, the bedtime recap.
  - *The tunnel's two whispers are two panels* (one balloon tail ran through the other balloon).
  - *Sprinkle's print is drawn true to size* (about five of her paws long), her paw over its heel pad
    and its five claws fanning out past it: "Your whole paw fits inside, with room to spare."
  - *One story line changed*: on the told path Tallyheart now says "Four a night, for six nights:
    twenty-four" before Sprinkle's "Only FOUR a night?"
  - *The tunnel is left open* (the roots still lifted; on the told path Tallyheart sits across it),
    for chapter 8 to follow.
  - *The storyboard tool* now says truly how a question with its own words is timed; that corrects
    one line in chapter 5's storyboard (words for an illustrator, nothing in the game).
  - *The length*: about 20 minutes, 15 typed answers, 108 frames, about 81 a reading told and 85
    kept.

- **Chapter 8's brief** (2026-10-20; `docs/chapters/08-the-night-trail.brief.md`, each call with its
  reason). In short:
  1. The seventh night was robbed too (twenty-eight in seven nights, 4 × 7); on the told path
     Tallyheart heard them and let them go, to follow them.
  2. The route is the player's: through the tunnel (a small cat's way: told Tallyheart is too big and
     goes round above ground to meet her; kept Riffle squeezes through) or round the Barking Field
     at night (the dogs, and Hail, optional).
  3. The weasel holes are in the railway embankment, which belongs to no Clan ("The trains own
     it."), so nobody steps past the last post.
  4. Her worry's brave moments: *small* in the tunnel, *shiny* at the stash's heap of glass. *Water*
     moves to chapter 10's Moon Ferry, module-1's raft at night, so the open river stays never dark;
     *talk* stays the Gathering's.
  5. She knows the "scale" is tower glass: she lived behind glass all her life. Reynard's brag (the
     dry den is his once the dragon is chased off) is overheard; he never sees her.
  6. Snip and Snatch keep decision 21's names: "Snip-" is a Warriors name prefix (Snipkit), the same
     kind of echo as Puddle, Sleet and Hail; Swipe is clear on both wikis if you'd rather. "Snatch" also
     has an adult slang sense in English: asked before chapter 8 shipped, Aron kept it (2026-10-24; to a
     child it means "grab"). A rename would touch only chapter 8's files: the story's words, the
     speaker `snatch` in `app/ui.js`, its storyboard and the art's cast id.
  7. On the kept path Tallyheart is waiting when she comes home, more worried than cross, as under
     the bridge in chapter 2; the dragonet stays the player's secret until chapter 9 decides.

- **Chapter 8's spec** (2026-10-21; `docs/chapters/08-the-night-trail.spec.md`, section 9 has every
  call with its reason). One engine change, taken under decision 46: a Case File link may give each
  card it touches its own line (`link.lines`), because the fox's brag touches both FLEW ("He said
  FLEW. Now he calls it a story.") and the dry den ("The same fine, dry den."). It is a data key, not
  a new interaction; no card of chapters 1 to 7 uses it, so every live Case File reads as before.
  The trail's end is one new set, `tracks` (the railway bank, the weasel holes, the stash, and the
  tunnel's inside as two of its cameras); the Barking Field gets a night look.

- **Chapter 8's build, the review's round** (2026-10-21; the spec's section 7, items 14 and 15, and
  section 9, calls 25 and 26). In short:
  1. Chapter 8 opens on a title panel over her sleeping nest ("Chapter 8: The Night Trail"): the
     start frame must show on both paths, and the story opens on a told screen and a kept one.
  2. The tunnel's fork is a small cat's way: the roof low over her ears and two small doorway-shaped
     ways, unequal, so it never looks like a face or a cavern watching her. No mentor's face is drawn
     laughing with tears or hurt (Tallyheart's wry "Hmph." is a smile).
  3. The friend is in the picture all the way round the Barking Field (the way past the dogs is told
     and kept twins); the talk at home stays behind the pile, cutting to a close shot at the tunnel's mouth (`hole`).
  4. Two rare filler slips are kept and pinned by tests, not fixed with an engine change: after three
     misses Hail's riddle can lend its own 4 × 4 as "An easy one! Four dogs." (chapter 9's "Engine
     needs" should take it up; "animals" instead of "dogs" would make the words always true), and after
     two misses the warm-up can lend its own 2 × 6 as "One from yesterday." (true, and easy).

- **Chapter 9's brief** (2026-10-24; `docs/chapters/09-featherlight.brief.md`, each call with its
  reason). In short:
  1. Five days (9 to 13), ending on the eve of the full moon, so chapter 10's Gathering is on the
     full moon (the art's moon is full at about evening 14).
  2. The thefts have stopped: Tallyheart knows the tunnel on both paths now and sits by it; the pile
     stays whole. The tunnel is left open: it is evidence.
  3. The kept path tells Tallyheart about Sprinkle early on: a medicine cat's remedy needs a grown-up.
     From then on both paths know the same things.
  4. Thymeleaf, the medicine cat, is a tom (module-1 does not say). Dew is renamed **Mizzle** (Dew is
     an exact Warriors name; Mizzle is clear on both wikis), so Mizzle is no longer one of Puddle's
     alternatives.
  5. GroveClan's woods are the one new place, reached over the little bridge, not by raft (the otters'
     ferry raft, and Puddle under it, are chapter 10's Moon Ferry). The reed root comes to the
     ReedClan border, the river mint from the Holt by Riffle, and the dew from the tower roof, where a
     cat who never met Squall meets him at last (chapter 4's scene again, as chapter 5 promised).
  6. Sprinkle practises and lifts off for a few wingbeats; whether her wing holds is the Gathering's.
     Glintstar is told everything on the last evening, and says the apprentice will speak.
  7. Words checked by the draft's names check and kept (2026-10-24): *Thymeleaf* (module-1's; the
     whole name is clear on both wikis, its "-leaf" is a Warriors suffix, as Tallyheart's "-heart" is;
     Thyme, Leaf and Grove are humans in Wings of Fire's Dragonslayer, the class of world.md's Reed- and
     Crystal-, so Thymeleaf and GroveClan stand (the brief's "neither half on the Warriors Names page" is
     wrong for "-leaf"); thyme is a Warriors medicine herb); *medicine cat* (the Warriors term for the healer, in world.md
     and module-1 from the start, a shared Clan convention like apprentice and elder); *the Moon Ferry*
     (module-1's; plain words); *sage* (the herb, lower case only; checked, not used); *featherlight* (the title's word,
     never a name).

- **Chapter 9's spec** (2026-10-24; `docs/chapters/09-featherlight.spec.md`, section 9 has all 26
  calls with their reasons). No engine change: the engine's version moves and the save stays version
  2. In short:
  1. Two sticky flags, `foundMizzle` and `ch9Roof`, and no choice flag: chapter 10 reads no choice of
     this chapter. Chapter 4's page reads `ch9Roof`, so a cat who meets Squall here reads on chapter 4's page
     that he is still roaring, and her find on chapter 9's.
  2. The roof is chapter 4's own frames, copied, every hour first light (the story's "here by first
     light"), so the climb is never by day under a dawn sky.
  3. Mizzle's riddle is 6 × 8. The sand at per 8 is four and four ("an eight is two fours"), as
     chapter 8 did for per 4; no shipped frame draws the plain per-8 sand.
  4. Chapter 8's inherited filler slip (Hail's riddle lending its own 4 × 4 after three misses) is
     met by chapter 9's data, not an engine change, which would change chapter 8's live readings.
  5. The case is laid out on a new den camera, `case`, a row lighting at each tap; the cards come
     from the file by picture, so a Sleet cat's den card lies at FLEW's end as in her file.
  6. One new place, GroveClan's woods (`grove`, five cameras); Thymeleaf's den is a camera of the camp.
     The reed root, the dew's puddle and the sunny shallows are options of their sets, off by default.
  7. Squall unmet is a tail tip labelled "A voice", so he stays unmet until he says his name.

- **Chapter 9 as built** (2026-10-25; `app/story/ch09.js`'s header has each call). Where the frames
  went past the spec, each small:
  - *140 frames*, about 95 to 120 a reading (under the brief's 130), 15 to 17 typed answers.
  - *Squall's label is "The little dragon"* until he says his name, as chapter 5 has it.
  - *Thymeleaf sits at a spot of his own under the bridge*, at Sprinkle's chest: at the bridge's
    usual spot he was hidden behind Tallyheart, ears only. Two more spots moved for the same reason
    (the sneaking cat, the little bridge).
  - *The ninth claw mark's close-up is empty*, as in chapters 6 to 8: her mentor's stretch covered it.
  - *A speaker with a second paragraph only some cats read* gets one balloon written twice by
    `when`, so a panel never holds two balloons from one speaker (Riffle's Hail line, Mizzle's nap
    line and her "five", our cat's Mizzle line at the case).
  - *Her book's page is one sentence an entry*, 7 to 10 sentences on every path: the spec's
    proposal ran to 15 with both scenes.
  - *The review's round* (2026-10-26, landed on the depth hotfix): while Sprinkle's wings are open under
    the bridge (f095 to f100, one move) Tallyheart sits by the wall facing in, chapter 7's spot, because
    across the nook she sat in front of the hurt wing the rub Tap glows on; Thymeleaf sits a little nearer
    the front where Sprinkle's peek or her claws came down on his head (f093, f095); Riffle flops on his
    back a little in from the hedge, so his face stays in the panel (f007); her sore wing shows behind the
    good one when both are raised (the far wing had been drawn inside the near one); at the dew our cat
    crouches at the puddle about Squall's size, the panel's co-subject beside him; the montage lists the
    far guard first (f112, Charlie's bug again), and so do the little bridge and the woods' edge (f037,
    f039, f040), with a test on every camera chapter 9 draws; Sprinkle is listed first where the speed
    lines trail her (f114; f106's glide draws its own, and its streaks, which ran behind our cat, are
    gone); the case's ask has two captions, so a tap shows four boxes, never five; Sloshbank's
    almost-smile is `kind`, not a grin; and seven boards now say what the art draws (sitting, not
    standing or a paw up). Chapter 4's page says "still roaring" once for a cat with both roofs (chapter
    5's read again from the middle of chapter 9's copy). The fullest file is 30 cards (a reread cat with
    both specialties' cards), nineteen along the edge in three courses; the docs said 29. After a long
    help the page brings "Got it!" into view if it is below the screen (7 × 8's help with Aa on), as it
    already brings in the keypad; where it fits, nothing moves.
  - *Shipped* (2026-10-26, CACHE v19, on the Aa fix): the case's ask (f118) brings Next into view after
    its sixth pair, and with Aa on its list of pairs asked sits a little closer, so Next is on the screen
    at 1080 x 720. The five small issues the final review left for the next round (Thymeleaf small under
    the bridge, Sprinkle's lift off the sand, the nine-Count Hollow below the screen, and the Aa fix's
    three leftovers) were fixed in the polish release (2026-10-31, CACHE v20; its entry under Claude's
    calls). Still open from that review, all low: Squall's `hidden` tail at the pole (f081, f084: our cat
    turns to it since the polish release v23, but the tail alone still reads as a dropped hook, new art), the
    nearly round moon (f133 on), "It sparkles" (f082, f084; a puddle that sparkles is new art), and
    Thymeleaf unnamed to Sprinkle on the kept path (f094 is told-only). Riffle at the open wing (f099, f100)
    stays open: the polish release v23 tried him out at the right, and the panel's edge cut him.
  - *CACHE knows what is live*: `tests/fixtures/sw-shipped.json` lists every shipped `CACHE` with a
    digest of what it cached (from v16, chapter 8, to v19, chapter 9), and `tests/sw.test.js` fails until
    `CACHE` is past the last; a ship appends its own entry (production.md, step 2). Chapter 9 and the
    hotfix had both bumped to v17, which would have stranded installed iPads on whichever shipped first.

- **The Warrior Counts' design** (2026-10-24; `docs/warrior-counts.md`, its section 9 has every call):
  taken from the hub once chapter 10 is finished, in chapter 3's scene at the fountain; 10 × 10 always
  last, as Murmurpaw's was; no clock, no score on screen, four paw prints filling as she goes; a miss
  gets the sand once and is not asked again; a paused sitting can be picked up within two hours, and
  practising in the Hollow or a chapter lesson in between sets it aside, so she starts fresh.

- **The Warrior Counts as built** (2026-10-26: built on chapter 8's tree in the `warrior-counts` branch
  and reviewed twice; merged onto chapter 9 2026-10-31. `docs/warrior-counts.md` v0.4, sections 9, 11
  and 12, has each with its test; `~/potomac-crossing-work/warrior-counts/build.json` and
  `review-final.json` the findings). They open once chapter 10 is finished, so no player sees them
  before it ships. Each call, with its reason:
  - *The builders, the engine:*
    1. A table with no set yet anchors after every taught one, two such the smaller: a tree without
       chapter 10 still pictures every pair (7 × 9 as the 9s).
    2. A stale sitting is set aside as "practice" when another Counts answer came within its two hours,
       else as "late": the next opening's reason is then the true one.
    3. A set-aside attempt is stored `seen: true`: it has no result page to show.
    4. 45 or 46 right, no better than last time, says her number and nothing after it (the slot's
       `else`): good news, with no "So close" (47 to 49) or "Last time" to add.
    5. `E.hollowLines` takes `opts.now` to tell a stale sitting, and without a clock a sitting with no
       practice since counts as waiting: the page always passes one.
  - *The builders, the story:*
    6. `pass.clean` keeps "Every Count up to ten times ten" before the design's "Every one. Not one
       missed. Like {Murmur}chime.": the first says what she passed, the second how.
    7. A not-yet is three pages (Glintstar's "Not yet" sharing a panel with the old tom's or
       {Murmur}chime's line, Tallyheart's walk, the tricky ones): short, the kind words beside the hard one.
    8. The praise words sit at the fourth of every five places and the quick words at the first: the
       runner keeps a turn for each list, and blanks alone put two words in a row.
    9. 10 × 10's lines are `counts.last` (the design's "finale"): the engine already reads that key.
  - *The builders, the page:*
    10. After the pass, a sitting in progress puts "Keep going: the Warrior Counts" in the quiet slot: it
        is one to pick up, as "Keep going" says before the pass.
    11. The tricky chips go in the column under Tallyheart's balloon, that page's balloons stacked: they
        read as hers, beside her words.
    12. A hub tap that finds the state changed (a sitting gone stale) redraws the hub instead of going
        in: she never walks into a sitting that is no longer there.
    13. During a pause the keypad is hidden and a tap anywhere moves on: there is nothing to answer.
    14. The paws fill from the heel to the toe tips, a sliver from a paw's first answer: how far, never
        how well.
    15. The hub's button is a paw on ember-edged gold: it reads as the test, not a chapter.
    16. The bar says "The Warrior Counts" on all its pages, with Camp and no Case File: she knows where
        she is, and the file is a chapter's.
    17. The grown-ups corner says the Counts are not open until chapter 10 is finished, for every cat in a
        build with them: the design asks for the line, and none of her screens change.
  - *Review round 1:*
    18. After the pass, her number is said only at 50 or more (50 to 54; 55 has the clean sweep's
        words), never from 45: on a not-yet 45 means "close to a pass", which a sitting after the pass is
        not; three of the four reviewers chose 50.
    19. That number is a variant key of its own, `afterPass.number`, the slot's `else` the page with no
        number: it mirrors the not-yet's, and a variant nobody wrote says no number.
    20. `aside.late` is "It’s been a while, so we start fresh.", not "A new day": two hours can still
        be the same evening.
    21. The quiet opening's caption is "…and {Murmur}chime comes to watch." (not "has come"): the
        longer aside put that page at 31 words, over the 30-word cap.
    22. The Hollow's waiting line takes the greeting's place, never both, and says "Warrior Counts": two
        "first"s pulled opposite ways, and in the Hollow a "Count" is a times table.
    23. The remembered lines are four each, in turn, a blank between: a strong player heard one sentence
        about twelve times.
    24. The sitting's lines wait to be read (Read to me off: the longer of 1.3 or 1.5 s and 0.6 s plus
        0.38 s a word; on: the speech and 0.4 s), in the sitting only: she reads to herself, and the
        chapters keep their timing.
    25. Every Read to me and guard fix (the pause's fallback, the help's opener before its count, the
        clock, the button's words, the tap-time guard, Enter on a focused page) is warrior-only: the
        chapters must play as they shipped.
    26. The help's reminder stays above the count on its last page, in the sitting only, and "Got it!" is
        brought into view on a small screen (since chapter 9 every lesson's help does that; the branch's own
        copy of the scroll went at the merge's review, call 53): the phone render showed "Got it!" below
        the edge.
    27. The old tom says "Took me THREE tries.": "goes" reads British, and the capital is his habit.
    28. The 42nd answer's pause says "Three paws done. Just one more paw.": it mirrors "One paw done.",
        and "one to go" could mean one question.
    29. While a result is unseen, the hub hides the Ceremony's button too: it would give the pass away, as
        the quiet button did.
    30. The chips are a two-column grid, .85em with Bigger text (both reviewers' fixes): either alone left
        Back or Camp just below the edge on a phone.
    31. One chip has words of its own (`one` on the chips' balloon), used after the pass only: a not-yet
        always has six misses or more.
    32. The first opening's caption drops the sand ("Tallyheart sits down right beside you."): no new
        art, and the sand comes with a miss.
    33. The tricky greeting after a round picked up from a not-yet is a one-shot flag on the page
        (`wTrickyDue`) and `E.hollowLines`' `opts.tricky`: as the finding proposed; otherwise a round's
        reward line keeps its place.
    34. The Hollow says "the tricky one" when one missed pair is left in the marked Counts: "ones" over
        one pair would not be true.
    35. In the chips a pair with a 1 goes last in its group, and still counts toward its other number's
        Count (as designed): 1 × 8 is more a slip than a tricky one.
    36. The engine tests read the real chapters once they land, the anchor tests chapters 1 to 8 as well:
        "neither taught: the smaller" stops holding once chapter 9 teaches the 8s.
    37. The Safari tool's warrior recipe gains `stale` (the last answer three hours ago) and `round` (a
        Hollow round in progress before the sitting): to picture that round's screens.
    38. The changed screens were checked in WebKit (an offscreen WKWebView, Safari's engine, silent):
        Safari's automation hung at session creation on the mini.
  - *Review round 2:*
    39. The Hollow's keypad re-check runs only for a cat with Counts data, not on every round: it
        overflows only under the waiting line, which only she sees, so the Hollow is otherwise as shipped.
    40. A pause lasts the longer of 2.5 or 3.5 s and its reading time, with Read to me off, and that is
        its cap with it on (round 1 had kept 2.5 and 3.5 s): the cap matters only when a voice never
        reports its end, and a longer one only waits for the words.
    41. A pick-up moves the sitting's `at` to the pick-up time, with no new field: `E.migrate` already
        keeps `{ at, state }`, so the save's shape stays (the corner's "the last at" is her last visit).
    42. A sitting with no answer is still picked up within its two hours by the hub's "When you're
        ready" or "Try again whenever you like", and plays its opening again; the corner lists it in
        progress with 0 answered: true for grown-ups, and she never misses the rule.
    43. The set-aside's reason rides on the new sitting (`st.aside`; the last attempt's for a state saved
        without it), and the first opening never gives one: she had begun nothing.
    44. After the pass, a sitting again's unseen result takes the quiet slot ("The Warrior Counts:
        Glintstar is waiting") and the Ceremony keeps the big one; the hub's and the book's "Your
        ceremony is coming soon." follow one rule, and a state with no `passedAt` counts as a first
        pass: the conservative choice.
    45. The old tom's line is a plain balloon, his one capital word kept: as his capital-word lines in
        chapters 3 to 6.
    46. The design moved to v0.3 and v0.4 with the rounds (its sections 11 and 12), and the code and the
        tests cite v0.4: they carry v0.4's behaviour.
  - *The merge onto chapter 9* (2026-10-31):
    47. `CACHE` is `potomac-crossing-v21`: v20 is the polish release built meanwhile in its own tree,
        and `tests/fixtures/sw-shipped.json` holds every shipped `CACHE` to the files it cached.
    48. `E.VERSION` is `0.9.1 (the Warrior Counts, 2026-10-31)`: a point after chapter 9's 0.9.0, as
        the Counts are no chapter; the save stays version 2 (chapter 10's spec v0.3 had 0.10.0 here and
        0.11.0 for chapter 10; amended in its v0.4, so chapter 10 is 0.10.0).
    49. Decisions 48 to 51 came in from both sides; they are listed once, in number order.
    50. The branch's tests read chapter 9's 8s: the anchors with chapters 1 to 9 (7 × 8 is seven
        spiders), and the Hollow's paws and greeting with nine Counts (the 8s marked; the 7s' paw comes
        with chapter 10's button).
    51. `tools/shots.mjs --page` exits only once the page is written: with the Counts' CSS the page passed
        a pipe's 64 KiB on macOS, and the suite's silence test read it cut off at 65,536 bytes. Its two
        lines are the polish release's (v20) word for word, as v20 makes the same fix, so the two fold with
        no conflict there.
    52. In the Hollow the tricky paw sits in its button's left padding (`position: absolute`; with Bigger
        text a 1em paw and 1.3em of padding, as the polish release's tighter Aa padding needs), so a marked
        Count's name keeps its line: at 1080 x 720, 1180 x 820, 1024 x 768, 820 x 1180, 768 x 1024 and
        390 x 844, Aa off and on, the 8s and My nest stand exactly as in chapter 9's Hollow, the paw inside
        its button and clear of the name, and a glowing Count's sparkle sits beside it, its button as tall
        as without the paw. With the polish release's Hollow rules the same holds but for one case, left
        for chapter 10's round: a Count that both glows and has a paw wraps one line more with Aa on at
        1180 x 820 and 768 x 1024 (the paw's 1.3em of padding against the polish release's .6em). Measured
        in WebKit, 2026-10-31. Inline, a paw on the 8s had wrapped "Spiders’ legs · the 8s" to two lines
        (94px, not 64, at 1080 x 720), and My nest sat 30px further below the screen.
  - *The merge's review* (2026-10-31):
    53. On the help's last page in a sitting the paws step aside and "Got it!" (and A HUNDRED!'s Next)
        sits at the top of the keypad's place, 14px under the question line: centred over the hidden
        keypad, it took the page about 110px further than it needed when brought into view, and the
        anchor's reminder went under the bar on Charlie's 1080 x 720 iPad (9 × 9 and 10 × 10, Aa on and
        off) and at 1180 x 820 with Aa on. Now 98% or more of its balloon is on the screen at every size
        measured (1080 x 720, 1180 x 820, 1024 x 768, 820 x 1180 and 390 x 844, Aa off and on; before, as
        little as none), with "Got it!" on the screen; the paws are back for the next question and a pause.
        The chapters' "Got it!" stays centred.
    54. The pass in a quiet sitting (`pass.quiet`) lists the runner at `crowd-left` first: listed after
        the nearer runner at the entrance, it was drawn over his ear and brow (Charlie's bug); only that
        page's picture changes. `tests/warrior-story.test.js` holds every scene of the Counts to the depth
        rule, reading each cat's place and size as drawn (the Counts' spots have no `h`).
    55. A sitting's `at` is her latest answer's time when that is less than two hours ahead of the clock
        (the merge's check: further ahead, lifting it let practice never set a sitting aside); with a device clock set back after she
        played, her chapter answers came "after" every new sitting, which was then stale as practice
        from its first answer, so she could not take the Counts until the clock caught up. Practice
        stamped after that time still sets a sitting aside, and "late" runs two hours from it.
    56. A cat's `warrior` is read as her own key only, and a saved lesson whose state is a sitting's is
        dropped like any bad lesson: two hand-edited saves (a `__proto__` key, a chapter lesson marked
        `mode: 'warrior'`) made Counts data chapter 9's engine never saw; no page writes either.

- **Chapter 10's brief** (2026-10-24; `docs/chapters/10-the-gathering.brief.md`, each call with its
  reason). In short:
  1. Every one of Reynard's claims can be answered by a card every player holds on every path; nothing
     needs `my-count` or an optional card. A wrong pick gets a gentle nudge and another try.
  2. Water's brave moment is the Moon Ferry at night (moonlit silver-blue, never dark); talk's is her
     answering Reynard out loud. Puddle can be found under the ferry raft, if he wasn't before.
  3. The foxes are chased off by every Clan standing together: no fighting, nobody hurt. The prey
     comes home from the stash.
  4. The Mistscales are huge, gentle and misty, never frightening; Sprinkle flies to her Mama; the
     dragonets she found say goodbye by name, the others are shapes in the mist.
  5. Glintstar honours her; she is still {name}paw; Tallyheart says the name will come when she
     passes the Warrior Counts, which the hub offers from then on.
  6. Leaders and grown Mistscales stay unnamed (labels and "Mama").

- **Chapter 10's story and spec** (2026-10-25 to 31; the story's *For us* and the spec's section 9
  have every call with its reason). The story took four critique rounds (v0.5), the spec two checks
  (v0.4). In short:
  1. **The card pick is chapter 10's one engine need**, built as the spec designs it: a data key one
     chapter reads, like chapter 8's `link.lines`; every hook is a branch only a pick reaches, so
     chapters 1 to 9 play and draw as they did. Nothing new is stored: the card she picks is a flag,
     the wrong picks are the page's, and the save stays version 2. The pick screen is her whole Case
     File, face up; a wrong pick wiggles and gets Tallyheart's whisper; after the third only the right
     cards glow. What answers what is the pick's own data, so no shipped card changes.
  2. Five pick flags and one choice flag (`ch10Best`, for the Ceremony); `ch10Puddle` is sticky, and
     chapter 5's page reads it in both of its Puddle lines.
  3. Two new places, the Moon Ferry (`ferry`) and Gathering Island (`island`); the walk home is the
     riverbank, the tower and the den by moonlight, by option.
  4. The grown Mistscales are one new cast id, a head and neck out of the mist, never a body; the two
     leaders are their Clans' new variants; the crowd wears only anonymous coats.
  5. **Granny is chapter 5's otter variant 3**, labelled for this chapter (variant 2 is chapter 5's
     gossiping "he"): no new drawing.
  6. The 7s are clutches of seven (decision 51), four over three; the sand at per 7 is four and three.
  7. The mist stone is a gift in My nest as well as on her moss; the last panel is the stone close up.
  8. No depth rule: every crowded cast is listed back to front, the leaders' roots behind their Clans.

- **Chapter 10 as built** (2026-10-31; `app/story/ch10.js`'s header has each call). 157 frames, 114 to
  132 a reading (the cap is 170), 21 typed answers (22 with Puddle), five picks. Where the frames went
  past the spec, each after a look:
  - *Sprinkle sits a step back at the case* (a spot of her own, `SIDE`, a dragonet's size): at `beside` she
    covered the fox, the weasels and the ring's front. The fox sits back across the grass with the weasels
    nearer the river edge (the case's `fox`, `weasel-1` and `weasel-2`), so her tail ends short of him and
    both weasels show. The dragonets she found step out a step right of her spot (`STEP`), clear of our
    cat's chest; she lies at `beside` when she curls her tail round our cat, and our cat sits inside the loop,
    in front of her (`LOOP`), as under the bridge in chapter 3.
  - *On the wide clearing* Sprinkle comes out of the reeds a step right of the heap (`OUT`, so her hurt wing
    shows), then sits in the middle a step smaller than our cat's `centre` (`MID`, clear of Glintstar on her
    root) with our cat beside her; GroveClan's leader sits along her root toward the trunk, clear of
    Sloshbank. The leaders take their roots at f040, so the GroveClan elder speaks as herself before.
  - *The weasels' two lines move to the fox camera* (f072, f073): on the wide shot they could not be seen;
    Snatch holds up his mouse at the front (f081).
  - *The small shapes in the mist* wait in the mist band at the left, beside Mama, who stays through the
    shapes' screens (f114 to f120); our cat holds the mist stone sitting up, so it never lands on Riffle's
    stone in the nest.
  - *The review's round* (2026-10-31, `~/potomac-crossing-work/ch10/review.json`, every confirmed finding):
    Glintstar's ruling has a panel of its own (f082) and the three borders the next (f083), so with Aa on at
    1080 x 720 and 1080 x 700 Back and Next stay on the screen (the four balloons stacked beside the crowded
    panel ran them 12 and 18px under); the old tom's ferry cheer is “Eighteen guards. Not ONE of them with a
    pinecone.” (he was never one of chapter 6's guards); the front raft has four logs on every camera, as
    Puddle's riddle counts them; at `lip` our cat leans over the left log's edge, the rest of her under the
    log; Tallyheart trails on the stones at dusk, clear of our cat; Snatch sits up with the mouse in his paws
    for a noticing cat; our cat sits over her leaf and glass, her head clear of Sprinkle's claws; the swim is
    a row going away from the bank; Sprinkle turns to Riffle, across the grass where the fox sat; our cat and
    Tallyheart are nose to nose, both crouched; Riffle and our cat face each other on the way home; a
    shiny-worry cat's stone is a close-up in her paws; the crowd's filling seats are drawn back to front.
    On the page: Granny's “Thirty-six!” has her own face and voice (the lesson runner kept no line's
    variant); each claim's pick screen opens at its top; a wrong pick's taller strip never covers the card
    she tapped, and a right card's pop grows toward the free side; the strip sticks below an installed
    iPad's status bar; with reduced motion the glowing cards brighten for a dimmed card's tap; the grown-ups
    corner says a stale sitting starts fresh next time. The Training Hollow is re-laid for ten Counts (spec
    call 36): held sideways (501 to 860px tall) its column is `minmax(410px, .7fr)`, so the picture is about
    12% narrower (1080 x 720: 603.5px wide, not live's 684), on purpose, so the 7s' name keeps one line. A
    list of nine Counts or fewer gets a 370px column at 1060px wide or less with Aa off, so Tallyheart's
    glowing-marks line, the Counts and My nest stay on the screen as they did live; live's own column at
    1134px wide or more (1180 x 820, 1194 x 834: the picture and its lettering live's, box for box, the final
    review's L0); and upright with Aa the polish release's .6em padding (spec, section 6). The boards say what is drawn (the river never black, Granny a sandy otter, the mint the
    otters', the tail hug under the bridge).
  - *A chapter read again while a Warrior Counts sitting waits* (Claude's call under decision 46, the
    review's): one answer in any of its lessons sets the sitting aside, as practice
    (`docs/warrior-counts.md`, section 4), and the Hollow warns her first; a chapter's counted page did not,
    so she could lose 40 answers without a word. **The lesson warns as the Hollow does**: after "Count them
    again" (or a first "Let’s count!"), the lesson opens with Tallyheart's waiting line over its first
    question, “Your Warrior Counts are waiting at the fountain. Finish them first, or practice now and start
    them fresh later.”, the last line before the question and said with it, once, before any answer (Back
    from there loses nothing), on the Hollow's own condition (a sitting with an answer in it that has not
    gone stale), as a round picked up in the Hollow opens on it. Reason: an eight-year-old should never lose a
    sitting she cannot see coming; recording it as unwarned keeps a trap the Hollow already closed. Not on the
    counted page itself: with Aa on, a balloon over its buttons ran Back and Next 70 to 190px under a 1080 x
    720 screen on every counted page of chapters 1 to 10. Measured in WebKit on 14 counted pages at five sizes:
    the keypad always on the screen, the line too but for ch05 f002 at 1080 x 720 and 1080 x 700 with
    Aa, where the page's own scroll to the keypad leaves its first two lines above the screen. A cat with no
    Counts data, or a stale sitting, counts as she always did.
  - Left, with reasons (the review's lows; Granny in front of the fox on the banishment's wide panels, once left here, was
    fixed in the polish release v23): the phone's pick strip with Aa on the longest claim after
    a nudge (28% of the screen, not about a quarter: the fix is an Aa rule in the pick's block, which the
    spec keeps free of them); a kept Sprinkle thanks Thymeleaf by name (chapter 9's open low above); the eldest's
    bow and Granny's hauling (spec, section 7, items 20 and 21). Mama is not on the eldest's bow (f113: two
    great faces would overlap); Sprinkle stays turned to Tallyheart on f126 as she thanks Thymeleaf (turning her
    right would turn her from Tallyheart, whom she thanks first); at `lip` (f024 to f028) the log's cover stops
    about 30px short of its inner edge, so her flank ends in a hard line on the log's top over a dark scrap of
    shadow (a low the integration check found).
  - *The final review's round* (2026-10-31, `~/potomac-crossing-work/ch10/final.json`): the mist stone flashes
    blue AND green (its band's gradient laid across the stone's face: the green had fallen outside it); the
    glass is shown close up in her paws (f065, as the stone's f122), the old tom's “Glass?” one panel on, before
    “That’s three.”; the sixty no longer says the frame's two balloons again over its question (`intro: false`,
    as chapter 5's bill: with Aa at 1080 x 720 Glintstar's first line went under the top bar) and asks it in
    our cat's words, picked up too; the moonrise and the boarding (f014, f015) are by night, so the river shines
    silver-blue as the caption says; Sprinkle's kept thanks read “Keep counting. ESPECIALLY fish.”; two or more
    found, “Small shapes step out of the mist: the dragonets you found.” (the picture's shapes are never beside
    her). On the page: after the third wrong pick, and on a dimmed tap or a reopening, when no glowing card
    shows her file slides to the first (at once with reduced motion). **Two deliberate changes to chapters 1
    to 9's lessons**: a lesson picked up (drawn as its page opens) brings the keypad back on the screen after
    the page's scroll to the top, as the Warrior Counts do (a resumed lesson at 768 x 1024 had the keypad's last
    row 7px under the screen; nothing moves where the keypad already shows); and Read to me's button, tapped
    on mid-lesson, says the lesson page's own lines and question (it said the frame's old lines, or nothing).
    The Counts' waiting line, read with Read to me off, restarts the first question's clock once it would have
    been read. Left: Granny's wink and her hauling stay in the captions (built nearly, spec section 7, item 21
    and the build notes: no otter face winks); the tenth claw mark stays in the board's inset (a tree panel
    before f152 would renumber the last six frames); every pick still reads her whole file as it opens with
    Read to me (a listening friend needs the cards to pick from; the spec accepts the length).

- **Chapter 11's brief** (2026-10-31; `docs/chapters/11-the-warrior-ceremony.brief.md`, each call with its
  reason; call 4 is decision 52, Aron's). About 12 to 15 minutes, at most 1,300 words plain, no optional scene,
  at most 90 frames, no new cast or place, no lesson and no new Count, one engine need (the warrior name). In short:
  1. The evening of her pass, whenever that is: no day is counted from the Gathering; the moon is up, past full,
     never named by its shape.
  2. CrystalClan's camp by night, the whole Clan in a ring at the fountain, moonlit and silver, never dark.
  3. The ceremony's words are our own: Glintstar names what she did this moon, asks the Clan's promise and hers,
     and gives the name; never StarClan or the books' words; Tallyheart's chapter 1 vouching comes back.
  4. (Decision 52) Glintstar sees three endings in her, from `ch10Best`, from her `specialty` and from this moon;
     she taps one or types her own; never -star, -paw or -kit.
  5. The Clan calls her name; Riffle cheers at the camp's edge, Waffles hears it, the mist stone flashes: Sprinkle's
     hello.
  6. The watch till first light (never "vigil"): calm, safe and short.
  7. Dawn: Tallyheart finds her; she sleeps in a warrior's nest; module 1 is done; the badger only in the teaser.
  8. From then on she is {name}{ending}; chapters 1 to 10, read again, keep {name}paw.
  9. Toms and she-cats read alike; 10. every path has passed; `ch10Best` and `specialty` make the name.

- **Chapter 11's story and spec** (2026-10-31 to 11-01; the story's *For us* and the spec's section 9 have every
  call with its reason). The story took two critique rounds and a verify round (Draft v0.4), the spec one critic
  round (v0.2; v0.3 records the build). In short:
  1. **The warrior name is chapter 11's one engine need**, built as the spec's section 6 designs it, chapter 10's
     precedent (data beside the engine and keys one chapter reads; chapters 1 to 10 play and draw as they did).
     **Only the ending is stored**: `cat.ending`, one optional field, absent until she is named; the save stays
     version 2 (the Warrior Counts' `warrior` precedent). `E.VERSION` 0.11.0.
  2. One token, `{ending}`, `paw` until she has one, so `{name}{ending}` is `{name}paw` for every cat before the
     Ceremony (`warrior.js`'s three re-sit lines use it).
  3. The offers are a choice (f024), her own name an input of kind `'ending'` (f025, the Type screen).
  4. The engine computes the offers (`E.warriorOffers`, `E.WARRIOR_ENDINGS`); the lines vary by two computed `when`
     keys, `offer` and `nameHas`; a word is passed over when her first part has it, when it makes a book cat's whole
     name, or when it makes three of one letter at the join (Mosssplash).
  5. The guard list is the names critic's (every title on either wiki ending in one of the thirty) plus Honeymoon,
     and guards the offers only: a typed canon name is hers (the story overrules the orchestrator's note;
     reversible by one line in `E.checkEnding`).
  6. Fallbacks: no `ch10Best` reads truth, no `specialty` noticing; a row with all three words out offers its third.
  7. A typed ending: letters only, lower case, a leading first part dropped once, at most 12 (26 letters at most in
     all); refused only for her own name or no letter, star, paw, kit (and plurals, kitten, kitty), or a Clan cat's
     whole name, in that order, by a friend in the picture; what she typed is kept.
  8. Her warrior name shows wherever `E.displayName` does, and the hub says "Warrior of CrystalClan"; her book's
     title, her Case File's, chapters 1 to 10 and our cat's default balloon label keep {name}paw.
  9. Once the Ceremony is finished the hub shows the next teaser again and her book stops saying "Your ceremony is
     coming soon." (read from E.progress's `finished`).
  10. The camp by night is the `camp` set with one new option, `moon` (silver; one tower drawn lower while it shows);
      the moon one evening past full is the kit's waning moon (ages 15 to 27; `moon: 15`).
  11. Her new nest is the den's `nest` close-up with a new option, `nextNest`: {Murmur}chime in the next nest.
  12. The ears: chapter 2's picture with eight cats (five Clan coats, never six), Tallyheart counting.
  13. The morning count: one fact, 4 × 10, the pile, help by the picture, no fillers.
  14. The Clan's calls are a Clan cat's balloon labelled "Every cat".
  15. The teaser's title is "A new adventure" (the badger's track).
  16. The book page's seven lines are the spec's.
  17. Two build owners (scenes, engine), no golden owner: chapter 10's frames, the kit's moon and the camp and den
      with the new options off are fingerprinted (`<ch11-fingerprint>`).
  18. The mist stone is always held in camp, never a camp option; the pinecone is drawn when set down and at first
      light.
  19. `ch11Named` (`offer` or `self`) is a new flag, past the brief's "none new": f026's two lines and the book's
      line differ by how she was named, which cannot be computed (a typed ending may equal an offered word).

- **Chapter 11 as built** (2026-11-01; `app/story/ch11.js`'s header has each call, the spec's section 7, items 16 and 17, the
  rest). 58 frames: 57 a reading with an offered name, 58 when she names herself (the cap is 90); one typed answer, three choices,
  CACHE v22. The brief's steering calls are in `docs/chapters/11-the-warrior-ceremony.brief.md`. Where the build went past the spec:
  - *The story builder's five* (`~/potomac-crossing-work/ch11/frames.json`): **the story's last screen is two panels**, f057 (the
    stone close-up) and f058 (the two warriors asleep, “End of Chapter Eleven…”, “THE END.”), no word changed: its four boxes in
    one ran Back and Next 89 to 99px under a 1080 x 720 screen with a 26-letter name (chapter 10's f082 and f083 the precedent).
    **Three cameras outside the spec's list**: f023 on the camp's `reveal`, f031 and f032 on `purr` (the moon whole there), or f016
    to f030 were fifteen panels of one shot. **The spots settled by look** where the spec said “about”: RING_YOU and RING_TALLY (610
    and 380: at 560 and 420 the two overlapped), BY_FOOT 530, THYME (1300, 960, h 180, inside `crowd`'s box), and WALK_YOU,
    WALK_TALLY, PAD and BOW added; FOOT and BESIDE are the Warrior Counts' own. **Our cat first in f029's cast**: the art draws the
    motion lines round the first member. **The engine test's play-through** takes the first option shown where its scripted one is
    hidden (f024's offered names each show only for the cat they belong to); chapters 1 to 10 play as before.
  - *The review's round* (`~/potomac-crossing-work/ch11/review.json`, all sixteen confirmed findings; notes in
    `ch11/integrate-r1/`): **the mist stone never lies under Riffle's stone**: for a cat who put Riffle's under her chin in chapter
    2 (half of them) the stone held at her paws on f006 and f049 was drawn under his. Now the old den draws it on the moss till she
    takes it (f002 to f006, `miststone`; f006's Tap on her paw, sitting by it since the final round), and in her new nest she sits up holding it in both
    forepaws, as on chapter 10's f152 (the spec's `holdAt: 'nose'` touched Riffle's on the nose path). **Glintstar sits on f039**
    (`peer` floated her across the sky: that camera shows no fountain under her). **No sparkle on f032 or f038** (the art scatters
    it round the first cast member: one landed on {Murmur}chime's yowling face, one on the old tom's eye). **Thymeleaf full-sized
    on f032** at the set's `ferns` (at THYME he stood in front at half the size of the cats behind him; the grey tom sits behind
    his shoulder, face clear). **The ring stays for the bounce** (f029: {Murmur}chime, the old tom and the grey tom left for one
    panel and strangers sat in their places). **Tallyheart's “Ha!” after Glintstar's Counts name** on f020 (between them, Glintstar's
    second balloon had a tail of its own across her first's words; the story's order changed to match, no word). **A long name
    breaks at its join** (ui.js `richN`): wherever her first part runs on into her ending, one of her three offered words or a
    shouted word (Thunderwhisker|butterscotch, Thunderwhisker|moon, Thunderwhisker|PINECONE), a line may break there, in captions,
    the endcap, panel and stacked balloons (the Warrior Counts' too), the Tap and skip pages' captions, the choices and her book;
    a 26-letter name ran out of its balloons, past the column and off a phone's screen on the last frame, or broke at any letter.
    `{name}paw` and a word that only starts with her name are untouched, so chapters 1 to 10 letter exactly as before (tested
    line by line; a one-letter first part, A or X, takes no join with a word in capitals); no `overflow-wrap` backstop, so a word that fits is never broken. **The pile's moon is never cut** by the
    panel's top (its limit is its own radius now): f042, and **live, chapter 9's f112**, its moon 8 units lower and whole
    (`tests/golden-ch09.test.js` names the delta: chapter 9 replays exactly as recorded with that moon put back); ages 11 and
    under, chapters 6 to 8, do not move. **Bigger text on a page she taps once keeps “Tap to…” beside Back** on a sideways iPad
    760px tall or less and on a phone (index.html, Aa only, `@media (max-height: 760px), (max-width: 700px)`; the final round
    scoped it): at 1024 x 700 f019 and f034 ran Back 6 and 3px under the screen. **Live, with Aa on**, there, the Tap pages whose
    line wrapped above Back now have it beside Back, 17 to 39px more room and nothing worse (WebKit, 107 Tap pages of chapters 1
    to 11): at 1024 x 700 ch05 f003, f090, f091, ch06 f075, ch07 f062, f082, ch08 f030, f066, f067, f096, f097, f109, f110, f131,
    ch09 f059, ch10 f059, f063, f113, f130, f140, f152; at 1080 x 720 a subset of those; on a phone (390 x 844) ch04 f069, ch05
    f001, f003, f091, ch06 f075, f095, ch07 f015, f062, ch08 f007, f026, f096, f097, f131, ch09 f001, f123, ch10 f039, f045, f057,
    f059, f063, f064, f067, f075, f084, f134, f140, f152 (on ch04 f069 and ch10 f057, f067, f075, Back at the panel's foot, only
    the line's box widens, 1px; the card picks, ch10 f059 and f063, wrap “Pick a card from your Case File.” beside Back). Taller
    sideways iPads (1024 x 768, 1180 x 820, 1194 x 834) and upright iPads unchanged; with Aa off nothing.
  - *The review's lows taken*: the old den's stone on the moss from the first panel (f002 to f005); our cat shouts “TEN!” with
    her mouth open (f051); the old tom and the grey tom purr with the ring (f031); a Clan cat still asleep at her den as Tallyheart
    pads across (f045); a word joiner keeps the old tom's leading “…” with “Just now.” (f048); her book's “Next” once she has passed
    and the Ceremony is built is Glintstar's pass line, “Tonight, the Clan gathers again. For your warrior name.”, not chapter
    10's “Pass your Warrior Counts…”; the Type screen hands back only an ending she typed (`ch11Named: 'self'`), never an offered
    one, even once a reread has changed her offers; an offered name is kept in her choices as `{name}{ending}`, so the grown-ups'
    corner says her name after a chapter-1 rename too (Foxclimb, not Foxleap); the boards say what is drawn (f009, f029); f028's
    “closer” recorded as the crowd shot again (no camera is closer); the spec's frame counts.
  - *Left, with reasons*: f021 stays on `crowd` (its board's beat, our cat sitting up taller, needs her in the picture, and the
    runs are inside the story test's limit); the `glow` on f026 and f028 (the spec's; a moonlit glow is art for later); the
    bar's chapter line cut after a 26-letter name on an upright iPad; the Type screen's button partly under a sideways iPad's
    keyboard as the field is centred (only a real iPad's keyboard settles it, and she can still tap its top or press Done).
    The phone's bar cutting a warrior name and the balloon's tail through the camp's moon on f023, left here, were fixed in
    the polish release v23 (its entry under Claude's calls).
  - *The final review's round* (2026-11-01; `~/potomac-crossing-work/ch11/final-regress/`, `deploy-1/`, `fresh-eyes-r1/`,
    `skeptic-regress/`, `page-after-fixes/`, `wn-check/`, `furs/`, `ship-list/`, `final.json`; the fixes in
    `ch11/integrate-r2/`): **the Tap-line rule is scoped** to a sideways iPad 760px tall or less and a phone (at 1180 x 820
    it re-laid 14 live Tap pages, “Pick a card / from your Case / File.” in three ragged lines beside Back, where the line had
    room above it); **a one-letter first part takes no caps join** (richN, `n.length > 1`: for a cat named A, every capitalised
    word starting with A was boxed as her name on 44 to 55 live frames, and ch05 f006's balloon re-wrapped upright); **the
    endcap with a long warrior name fits a 1024 x 700 column with Aa on** (`html.big .endcap:has(.wn){font-size:1.9em}`:
    “THUNDERWHISKER” alone ran 11px past it; every line breaks where it did, and only chapter 11's endcap has her name in a
    `.wn`); **a re-sit's “A HUNDRED!” keeps its line** after the Ceremony (a warrior name over 12 letters labels her balloon on
    the Warrior Counts' page on a line of its own; it broke “Thunderwhiskerbutterscotch A / HUNDRED!”); **f006 she sits by the
    mist stone** (crouched, her reaching forepaw rested on Riffle's stone, not the one the caption names); **the old tom and
    the grey tom stay in the ring** on f011 and f012 (squeezed in on f009, gone on f012, back on f013); **f041 to f044 the
    sleeper at the right den is a brown tabby**, so Tallyheart is the only ginger cat by night and at first light; **f056 and
    f058 sparkle round the new warrior** (our cat first in the cast; the art scatters it round the first member, and it had
    clustered round {Murmur}chime); **{Murmur}chime lies asleep in the next nest** from “TEN!” to the end, chin on her paws
    (curled, she was a tortie player's twin, eyes shut, face to face); **f053's “he” named**: “By fifty, the grey tom’s
    snoring.” (story and frame; he is not in that panel, and its zzz are {Murmur}chime's). Left: the mist stone held under
    the chin in the ring (f009 to f011) blends into a grey or silver-tabby cat's forepaw (the story
    says she tucks it under her chin; at her paws it would contradict it, and a per-coat hold is new art). Checked and clean:
    chapters 1 to 10 against main (every frame's art in 18 looks but the named f112; 40 seeded readings; 2,442 saved cats;
    lettering of 1,384 frames at four sizes; Read to me on 1,390); chapter 11's pages at 15 sizes, Aa off and on (5,148
    screens: nothing off screen, covered or clipped, said 0); saves, migrate and the service worker (deploy, Safari, 35 jobs).
    A typed ending kept through a chapter-1 rename that made a Clan cat's whole name (Tallyheart), once left here, was fixed in
    the polish release v23 (its entry under Claude's calls).

- **Casts are listed back to front where cats meet** (2026-10-25, the depth hotfix): Charlie found the
  far grey guard drawn over the near black guard's face on chapter 8's f030. The art draws each layer
  of a cast in the order it is listed, never by depth, so twelve live pile frames (ch06 f004, f107,
  f109; ch07 f018, f021, f077, f079 to f082; ch08 f009, f030) now list the cat at `crowd-2` first, and
  nothing else moved. A set fix (`crowd-2` drawn behind) was turned down, because it also rewrites
  shipped frames that were already right (ch02 f026, f031a and f032) and moves a shadow edge in ch08
  f005. A depth sort in the engine was turned down too: some overlaps are meant (ch05 f154, nose to ear), and
  in ch04 f046 and the border-fox close-ups drawing by depth would hide a face. tests/set-pile.test.js
  holds the pile's `wide` camera to it. The small cases elsewhere (ch04 f043; ear tips, a tail and
  shadow edges in ch01, ch04 f028, ch06 f069 and ch07 f067, and the Warrior Counts' walk to the Hollow,
  our cat's tail tip behind Tallyheart's chin) wait for a later batch. Chapter 9 lists its far guard
  first on f112, and the Warrior Counts' pass in a quiet sitting (`pass.quiet`) the runner at
  `crowd-left` (2026-10-31, the merge's review: README call 54).
- **Bigger text fits the screen it is on** (2026-10-26, after Charlie's 10.2-inch iPad): with Aa on and
  the iPad held sideways at 1080 x 720, Back and Next wrapped to two rows on 167 pages, and Back (Next
  too on ch04 f085a, ch05 f031a, ch07 f050, ch08 f049, f087) ran below the screen on 16, and on ch05
  f049 while she counts. The call is CSS alone, and Aa alone. Where the screen has little room (sideways
  1132px wide or less or 800px tall or less; any screen upright) the words beside or under the picture
  are 1.14 times plain, not 1.2 (25px where Aa off is 22), on tighter lines (1.2 under 720px tall) and
  in snugger boxes; upright, options keep Aa's 54px and the balloons under the picture sit closer; on a
  skip-count her "Tap to…" line sits beside Back. Why this one: of the designs measured it alone keeps
  every control on the screen without touching the picture, and nothing changes with Aa off. Measured
  in WebKit over every frame of chapters 1 to 8, every Taps page tapped through, every Counts keypad and
  the other screens, at 13 iPad and phone sizes: with Aa on no button, option or key is below the screen
  as each page opens (the look chooser's swatches, and the hub's, book's, nest's and Case File's lists,
  scroll as before), except three left for a second round, all closed by the polish release (2026-10-31,
  its entry below): ch04 f115 for a noticing cat (two cards under the picture; Back and Next below at
  1080 x 720 and 1133 x 744), a Counts page already counted (Back, Count them again and Next stack, Back
  1 to 5px under a 720 fold), and the Case File's last row with Aa on (and its middle column breaking a
  long name mid-word);
  with Aa off every page is as it was, box for box at every size and pixel for pixel at 1080 x 720 and
  810 x 1080. Turned down: a smaller picture beside long pages (130 lines of layout code, a picture that
  changes size page to page, ch06 f100 still cut) and a pinned button strip (it hides words, and a page
  of choices keeps Back below, chapter 4's reason). Still cut, at sizes outside the 13: upright in Safari
  (810 x 1010) Back on ch01 f014, ch04 f095 and ch06 f100 (f014 and f100 worse with Aa off), and at
  1024 x 700 ch08 f087 by 16px. Upright choice pages want a portrait layout change, Aa off too: Aron's.
- **The polish release** (2026-10-31, CACHE v20): six small fixes for live players, each confirmed by an
  earlier review, each the smallest change that does it. Measured in WebKit (offscreen, silent, Read to me
  off) at 15 iPad and phone sizes against what is live (5f0a30d); every other frame of chapters 1 to 9 draws
  byte for byte as before (1,214 of 1,227, three cats, two looks), and with Aa off every page is box for box
  as it was except the fixes named here.
  1. *ch04 f115 for a noticing cat* (FLEW held beside the new wing card): under the solo picture the two
     cards stay side by side, their lines wrapping inside them. As two rows they ran Back and Next under
     the screen (1080 x 720, Aa on: 736 to 800; with Aa off too, 738 to 802); now 623 to 687 with Aa on and
     624 to 688 off, and on screen at every iPad size. No other page gives two cards, so nothing else moves.
  2. *A Counts page already counted*, Aa on, beside the picture: "Count them again" sits over Next, and
     Back and Next share the bottom row (in page order the three stacked, Next on top, and Back ran 1 to
     5px under a 720 fold on ch05 f002 and ch06 f002). Every counted page now has 21px or more to spare
     on every sideways iPad. Aa alone.
  3. *Her Case File*: no word is broken inside any more. Where a row of three or more cards is linked,
     the middle column is at least 14em wide and its cards' lines sit closer to their edges (with Aa off
     only a file with a single row of three needs it, the one that broke "Sloshb|ank" and "ReedCl|an's";
     no other file moves). With Aa on where the screen has little room, its words are 1.14 times plain on
     closer lines in snugger boxes, as the frame's are: the test cat's last row, 40px under a 1080 x 720
     screen, now has 33px to spare (1133 x 744: 8 under, now 56 to spare; 1180 x 760: 7 under, now 73).
     Checked on 22 files (each chapter's end for three kinds of cat, the 30-card file, a file with no link)
     at all 15 sizes, Aa on and off: no word broken mid-word, and wherever a file fits without Aa it fits
     with it.
  4. *Thymeleaf under the bridge* is a grown cat's size (h 340, his face as big as our cat's; at 290 it was
     0.85 of hers and he read as a kitten), a little to the left so Sprinkle's raised claws stay clear of his
     ears (f089, f090, f092, f094, f096, f098 to f100). Where her peek or her claws come down (the reason for his
     lower spot) he crouches low in front: under her peek on f093 (at 350; a grown cat sitting there met her
     face; f093's board says so), and on f095 under the hurt wing he sniffs, out past her chest (MENDER_WING,
     x 1210, y 975, h 340). Under her chest (x 980, h 350, as first built) his balloon went over her head and its
     tail ran down across her right ear and cheek, grazing her eye, at every iPad size, Aa on and off (live,
     at kitten size, it already crossed the left edge of her face); ui.js tests only a tail's centre line
     against the square inside a face and missed it by a pixel. Now his balloon sits beside him, low (over our
     cat's hindquarters, never a face), its tail short (77 to 156px) and clear of every face's whole circle at
     all 15 sizes, Aa on and off, in WebKit; on a phone held upright it sits above, its tail over her wing, 7px
     clear of her face. Her claws are further from his head than before (32px at 800 wide, from 2). Where our
     cat needs the room beside him he sits a little to the right and nearer the front
     (MENDER_FRONT, x 820, y 945, still h 340), a fix the regression check asked for: on f091, for a cat who
     knows Squall, our cat's raised forepaw, the panel's beat, was behind his tail and side (35% of the paw
     hidden; now none, and her raised claws stay clear of his ears). Its five claws, which the board names,
     were never drawn (the frame passed no `claws: true`, live too); now they are, four over the toes and the
     dewclaw beside them, none hidden in any of 90 looks and 26px or more (at 1600 wide) from him; on f097, for a cat
     who met Mizzle but not Hail, his face took the room over our cat, so its balloon went to the bottom right
     with its tail across his chest (1080 x 700 to 740 with Aa off, most sizes with Aa on, and upright, where
     the live tree already did it); now it sits over or under her at every size, Aa on and off. Checked on
     every bridge frame f089 to f100 and every flag variant: no forepaw or held thing is covered, and no
     balloon's tail enters another face's circle or crosses another cat's body (the only tails over anyone are
     over Sprinkle's body, never her face: Tallyheart's to the heap of her tail on f092, as live, and on f095
     on an upright phone only, Thymeleaf's over her wing). Only these twelve frames change; their balloons
     follow the faces.
  5. *Sprinkle's lift* (f115, the bank's `air`, used by that panel only): her paws 0.65 of her height off the
     sand, not a third, and under her a darker, tighter shadow (opacity 0.5, not 0.34; its half-width 0.22
     of her body's, not 0.28; a crisper edge), so she reads as in the air. Her wing tips cross in front of
     the bridge's deck.
  6. *The Training Hollow with nine Counts*: on an iPad held sideways up to 860px tall its Counts are 56px
     tall and 8px apart (6px under 720px tall), not 64 and 12; with Aa on, upright too, Aa's 54px, 6px
     apart and a little narrower inside, so a long name keeps one line. With nine Counts at 1080 x 720 the
     8s were 22px under the screen and My nest below (Aa off), 173px under with Aa on; now both have room
     (14px off, 40px on), and eight or nine Counts fit at every sideways and upright iPad size, Aa on and
     off (a phone still scrolls the list). This changes the live Hollow on those iPads with Aa off too, on
     purpose. Left: with a claw mark glowing and Aa on, Tallyheart's two balloons do not fit in the
     picture and stand in the column, so the list scrolls (as before, less: three glowing at 1080 x 720 was
     565px under, now 346); and with all nine glowing, Aa off, My nest is 22 to 46px under at 1080 x 700 to 740.
  Also: `node tools/shots.mjs --page` cut the page at 64 KB when it was piped (index.html passed 64 KB with
  these rules, and the silence test read a cut page); it now writes the page whole before it stops. On a
  phone f093's two balloons now stand under the picture (his crouch takes their place in it): upright (390 x
  844) everything is still on the screen; held sideways (844 x 390) with Aa on, Back and Next go below it, as
  they already did on f089, f090, f092, f100 and f115 there.
- **The polish release v23** (2026-11-07, CACHE v23): seven small fixes from the 'Left' lists above and the sweep's summary,
  each the smallest change that does it. Measured with the shared sweep against what is live (6b3410a: `node tools/sweep.mjs
  --all --compare`, every frame's art and every page at 1080 x 720, 1180 x 820, 820 x 1180 and 390 x 844, Aa off and on): the
  sweep's seven problems (six broken words, one control off the screen) are gone and none is new; 7 of 1,466 pictures differ,
  all named below; every page whose boxes moved is named below (the Warrior Counts' sittings, which differ run to run, apart).
  Notes, the before-and-after measures and pictures: `~/potomac-crossing-work/polish-v23/builder/`.
  1. *A dash stays with its word*: ui.js's lettering puts a word joiner between a word and an em dash after it, so a line may
     break after the dash, never before. ch05 f051a's “Ten. Twenty. Thirty. FORTY—” had its dash on a line alone at every
     iPad size, Aa off and on. The six lines with a dash after a word (ch03 f039, f089b, ch04 f031, f038, ch05 f051a, f121)
     carry the joiner; only f051a's lines change; every box is where it was. Read to me keeps the story's words.
  2. *ch06 f100 on a phone*: for a cat who kept the secret, its caption, four balloons stacked under the picture and two
     options ran Back 21px under a 390 x 844 screen as the page opened. A page of choices on an upright phone (520px wide or
     less) whose Back is under the screen as it opens now sits a little snugger (ui.js `snugChoice`, index.html
     `.frame.snug`: Bigger text's upright spacing, the column 10px apart, the stack 8px, the balloons' padding), and Back is
     on the screen with 18px to spare. Back stays under the options, never sticky (chapter 4's rule); a page whose Back is on
     the screen is never marked: in the sweep only f100 at 390 x 844, Aa off, changed.
  3. *A balloon's tail keeps off what the picture is about*: in ui.js `findSpot`, a spot whose tail (the wedge drawBalloon
     draws, to the speaker's face) would cross an art's keep area (the claw marks, the camp's moon, a glint, the hurt wing;
     not a face, and not the 4px of room a box keeps) is ruled out on a first pass, as a box over one always was, and taken
     only when nothing else fits; a face under a tail stays a cost, as before. Spots whose tail missed every keep area are
     exactly as they were, so only these move, each tail now clear of what the picture is about (measured: the area of each
     tail inside the kept areas, before and after, at every size it moved; most tails 5 to 30px longer, some much shorter): ch11
     f023 (the old tom's tail ran through the moon, with Aa on at 1080 x 720 and 820 x 1180; now the moon is whole beside it);
     the claw-marked tree, Tallyheart's tail down its marks: ch02 f021, ch05 f011, ch06 f005, f007, f016, ch07 f023, ch09
     f024, ch10 f004 on a phone, and ch04 f014 (her “Oh! I forgot you were there.” crossed the marks and the grey tom's face
     from the far side; it sits beside her now, its tail 40px, not 222), ch07 f024, f029, ch08 f010, f017, f020, ch09 f026,
     ch10 f008, f011 on the iPads; ch04 f010 (a phone, 6px aside), ch05 f047 (Aa on, upright), ch07 f087 and f090 (their
     tails off the pile's rows, and off a Clan cat's face), ch07 f068 (Riffle's off the hurt wing), ch08 f082 (Hail's: at
     1180 x 820 32px, not 213), ch08 f157 (Aa on, upright: off the marks, and less of it across a Clan cat's face), ch09 f001
     and f012 (the glint's Tap pages: f012's tail 34px, not 97). The ch09 test's counterfactual (Thymeleaf under her chest on f095) now places clear of her face too; its
     check of the old fault takes the wing's keep away.
  4. *A warrior name in the phone's bar*: on a phone (520px wide or less) the bar's title gives a warrior name two lines,
     broken at the join (nameHtml's <wbr>), in the bar's own height, a long half set smaller till it fits (ui.js
     `fitBarName`, again on a turn of the phone and once the fonts are in; index.html `.bar-title.wname`). With the Case File
     and Camp shown the title has 92px at 390 x 844, and one line cut every name over about 10 letters. Measured in WebKit
     on ch11 f020: Moon|bright two lines at 22px, the bar still 56px; Thunderwhisker|butterscotch two lines at 14px. On an
     iPad, and for a cat not yet named, the title is one line as before (the sweep's cat has no warrior name: no page moved).
  5. *A rename never makes a Clan cat's name*: at chapter 1's name, read again, a typed ending whose new first part makes
     Tallyheart, Thymeleaf or {Murmur}chime's whole name (Fern, typed heart, renamed Tally) gives way to the first name
     Glintstar sees in her, her best at the Gathering's row, as offered for the new first part (Tallytrue; Tallymark for a
     cat whose best was the counts), and is an offered one from then on (`ch11Named: 'offer'`, so the Type screen never
     hands it back as typed and a later rename takes it again from its row). The rule the Type screen refuses by, one helper
     now (engine.js `clanCat`). Every other typed ending stays hers, a doubled one too (spec section 7, item 15). For a cat
     named Murmur the tortoiseshell is Mutterchime, so Murmurchime is hers.
  6. *Chapter 9's lows, staging only*: on f081 and f084, for a cat who never met Squall, our cat turns to the voice and the
     tail behind the pole (facing the puddle, her back was to it; the board's “our cat looks at it, amused”); on f086 she
     counts the dew facing the puddle, as before. With Aa on, f081's balloon now sits over the roof right of the pole, its
     tail down to it, where her turned head took its old place. Left: Riffle at the open wing (f099, f100; the spot tried,
     out at the right, cut him at the panel's edge, the check found, so he stays at `back-right`); Squall's tail alone still reads as a dropped hook (something to hide behind,
     or the too-thin-pole gag, is new art), and “It sparkles” over a dew that hardly does (the one staging lever, the
     `sparkle` effect, scatters round the first cast member over the whole roof, for every cat, not only the shiny-loving
     ones the caption speaks to; a puddle that sparkles is the roof's art).
  7. *Granny by the water* (ch10 f082 to f084): at the set's `bank` she stood in front of the fox, only his ears showing,
     while the story says he gets smaller. She stands at the water's edge a step behind him and to his right (GRANNY, x 1545,
     y 690, h 230, listed between Sloshbank and the fox), so he shows whole, and Snip in front of her. Her border (f083)
     is lettered from there: its tail crosses no face (at `bank` it crossed the ReedClan she-cat's at three of the four
     sizes), though it is longer (509px at 1080 x 720, not 407). A spot at the front of the water's edge was tried first: its
     tail ran across the young tom's face.
  Pictures that differ: ch09 f081, f084, f099, f100 and ch10 f082, f083, f084, no other. The storyboards for chapters 9 and
  10 regenerated (their scenes' words only). Tests: each behaviour in the file that owns it (engine: the rename and the
  tail's keep-out; story-ch05: the dash; story-ch06: the snug page; story-ch09 and story-ch10: the staging; story-ch11: the
  bar); the chapter 9 golden and chapter 11's fingerprint of chapter 10 name the staging's deltas, each scene put back as it
  shipped, so anything else that moves still fails. The suite: 39 files, 1,790 tests, all pass.
- **The Warrior Counts' difficulty, after the first real sittings** (2026-11-07, from the grown-ups corner Aron sent;
  the numbers stay off this public repo, in `~/potomac-crossing-work/difficulty/`): a not-yet a few short of the pass,
  then a pass the same day, the shape section 5 of `docs/warrior-counts.md` designs for. No fact was missed in both
  sittings; about half the misses were one group off (a skip-count that lost its place) and a third within two of the
  answer; none was cut short, so the corner's "a slip?" mark never showed. **Kept as it is**: the pass stays 50 of 55 and
  no slip is forgiven, since none of the misses was a keypad slip and forgiving the near ones would have taken the
  not-yet away. Module 2 keeps her missed facts fresh from her own log (the warm-ups' hardest-first order, the Hollow's
  cross-table warm-up), and chapter 13's lullaby is one of them.

## Open questions, waiting on Aron

Nothing here blocks the chapter being built; each chapter's own questions are in its text, under
"For Aron to confirm".

- ~~**The Warrior Counts, for chapter 10**~~: answered by decision 48 (2026-10-24): 55 pairs, one
  sitting, try again anytime. The design is `docs/warrior-counts.md`.
- **Names and words that may still echo the books**: the Training Hollow (ThunderClan's training
  hollow; the Claw Tree Hollow?); chapter 1's Clan-name ideas, which make Warriors apprentice names
  (Hollypaw, Fernpaw, Stormpaw, Minnowpaw, Sedgepaw, Frostpaw) and "Moon" (Wings of Fire's
  Moonwatcher); "Ironsnakes" (Warriors' Thundersnake; Clankers?); "leaf-drop" (Warriors' leaf-fall);
  ~~Dew~~ (renamed Mizzle by chapter 9's brief, call 11, 2026-10-24); Snip, one of the weasels
  (Warriors has a Snipkit; chapter 8 names Snip and Snatch on screen: kept, see chapter 8's brief, call
  6). From chapter 10's story (its *For us*; all kept): Gathering Island's clearing under the great tree
  (Warriors' Great Oak, its leaders in the low branches; ours sit on its three roots, and the tree is never
  named); Tree, Root and Stone (Tree and Root are Warriors cats, Root and Stone Wings of Fire humans:
  lowercase nouns here); "a mist stone" (Mist- and -stone, decision 18); "the truce" (the books' word:
  Glintstar's "Tonight is the truce."); and mist over a Gathering's moon (Warriors' sign of a broken truce:
  here the moon glows through it and Sprinkle names it first, "That's MY mist."). From chapter 11's story and spec
  (its section 7, item 11, and section 10; all kept): warrior endings that are halves on the Warriors wiki's suffix
  lists (mist, sky, bright, eye, sight, leap, splash, ripple, moon, and a typed heart: words, not names, the brief's
  carve-out; whole book names are guarded from the offers, Honeymoon too); "Welcome, warrior" (two words of the books'
  ceremony, Glintstar's "Welcome, warrior. A warrior named by moonlight keeps watch…"); a night's watch after the
  naming (the books' vigil: "the watch" here, never vigil, and she may talk); and the Clan calling the new name (the
  books' shape, our words: "{name}{ending}! {name}{ending}!"). From chapter 5's names check
  (`docs/chapters/05-riffles-river.md`, "New names"): "skymonster," chapter 5's loudest Clan word
  (it follows Warriors' monster and water-monster pattern); "the Needle," world.md's word for the
  white monument, drawn in chapter 5 and still never on screen (Needle is a Wings of Fire dragon);
  "the prey pile," on screen since chapter 1 (the Warriors wiki uses the phrase too, beside the
  books' own coined word); and "growlers," world.md's word for cars, not on screen yet (Growler is a
  Warriors cat): two lines that used it stay cut until you rule on the word.
- **Puddle's name** (chapter 5, "Truly yours, 2"): the bare name is in neither series, but the
  Warriors wiki lists "Puddle" as a name prefix (Puddleshine) and "-puddle" as a suffix (Mudpuddle),
  the same class of echo as Snip. Chapter 5 puts "Puddle" on screen and on a page of her book for
  the first time. If you would rather change it: Slush, Mizzle, Slosh and Shower are clear on both
  wikis (checked 2026-10-11; Slosh would now echo chapter 6's Sloshbank, and Mizzle is chapter 9's dragonet), and Riffle's slip ("Pud— PUDDLES. Raft puddles.") is rewritten around
  the new name. **Sleet** (chapter 6, optional) is the same class: no page on either wiki, but the
  Warriors wiki's Names page lists "Sleet-" as a name prefix, from a post on the official *Warrior
  Cats* Instagram, with no cat in the books behind it (chapter 5's check found it; checked again
  2026-10-18). Sleet stays unless you say otherwise; a new weather name would be
  checked on both wikis before chapter 6 is drafted.
- **"Nine lives"** (chapter 5, "Truly yours, 1"): in Warriors a leader is given nine lives; here
  every cat has them, as the saying goes, counted on claws and never given, lost or spent. If the
  echo still bothers you, the lesson works with the picture said once and the claws carrying the
  rest; it does not work without the tucked claw.
- **A near-miss version of Murmurpaw's test** is written out in chapter 3's notes, if you ever want
  to show what "nine in every ten" allows.

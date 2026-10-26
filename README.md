# Potomac Crossing

A story game for Lissa (8) and her friends. Each player is a pillow cat who joins a Clan of wild
cats on a mythic Potomac River, with otters for friends, a scattered clutch of dragonets to find,
a fox to outwit, and a mentor who teaches the times tables along the way.

The medley it grew from: Wings of Fire (dragons), Warriors (the Clan cats and the pretend
play around them), James Ponti (the mystery), otters (Lissa's favorite animal), and Potion Lab
(Aron's times-tables game, which stays a separate game).

**Play:** https://ahmadia.github.io/potomac-crossing/ (on an iPad: Safari, Share, Add to Home Screen)

**Status (2026-10-26):** chapters 1 to 9 are built as a static web app (`index.html`, `app/`; the
stack is in [`docs/build.md`](docs/build.md)), storyboarded frame by frame in
[`docs/storyboard/`](docs/storyboard/), and deployed on GitHub Pages from `main`. It is developed
on the Mac mini, in `~/potomac-crossing` (since 2026-10-04). Chapter 6, *The Snake in the Stones*,
shipped 2026-10-18, the first chapter made with `dev/workflows/chapter.js`; chapter 7, *The Counts
Don’t Lie*, 2026-10-20; chapter 8, *The Night Trail*, 2026-10-24; chapter 9, *Featherlight*, 2026-10-26.

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
  Lie, 08 The Night Trail, 09 Featherlight), chapters 2 to 5 each with its notes, its Case File cards and the questions it raised. From chapter 6 a chapter has three files: its **brief** (the
  steering calls, the budget and the names, written before drafting), its **story** (what she
  reads), and its **spec** (flags, Counts sets, cards, art needs and build notes, written once the
  story is final).
- [`docs/storyboard/`](docs/storyboard/): the verbal storyboard of every frame, for an illustrator
  (generated from `app/story/`).
- [`docs/build.md`](docs/build.md): how it is built, tested and deployed.
- [`docs/continuity.md`](docs/continuity.md): where the story stands after the last shipped
  chapter (what happened, the flags, the cards, the names), for whoever writes the next one.
- [`docs/production.md`](docs/production.md): how a chapter gets made, what the first five cost,
  and the plan for chapters 6 to 10. The workflow script and its runbook are in
  [`dev/workflows/`](dev/workflows/).

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
    at 1080 x 720. Left for the next round, each confirmed by the final review and small: Thymeleaf reads
    a little small under the bridge (f089 to f100; a spot at h 340 is the proposed fix); Sprinkle's lift
    off the sand (f115) wants her a little higher with a darker shadow; with nine Counts the Training
    Hollow's last button (the 8s) and My nest sit below the screen at 1080 x 720 (the page scrolls); and
    the Aa fix's three leftovers (ch04 f115 for a noticing cat, an already-counted Counts page, the
    Case File's last row), whose second round was stopped half built in ~/potomac-crossing-hotfix.
  - *CACHE knows what is live*: `tests/fixtures/sw-shipped.json` lists every shipped `CACHE` with a
    digest of what it cached (v16, chapter 8; v17, the depth hotfix), and `tests/sw.test.js` fails until
    `CACHE` is past the last; a ship appends its own entry (production.md, step 2). Chapter 9 and the
    hotfix had both bumped to v17, which would have stranded installed iPads on whichever shipped first.

- **The Warrior Counts' design** (2026-10-24; `docs/warrior-counts.md`, its section 9 has every call):
  taken from the hub once chapter 10 is finished, in chapter 3's scene at the fountain; 10 × 10 always
  last, as Murmurpaw's was; no clock, no score on screen, four paw prints filling as she goes; a miss
  gets the sand once and is not asked again; a paused sitting can be picked up within two hours, and
  practising in the Hollow or a chapter lesson in between sets it aside, so she starts fresh.

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

- **Casts are listed back to front where cats meet** (2026-10-25, the depth hotfix): Charlie found the
  far grey guard drawn over the near black guard's face on chapter 8's f030. The art draws each layer
  of a cast in the order it is listed, never by depth, so twelve live pile frames (ch06 f004, f107,
  f109; ch07 f018, f021, f077, f079 to f082; ch08 f009, f030) now list the cat at `crowd-2` first, and
  nothing else moved. A set fix (`crowd-2` drawn behind) was turned down, because it also rewrites
  shipped frames that were already right (ch02 f026, f031a and f032) and moves a shadow edge in ch08
  f005. A depth sort in the engine was turned down too: some overlaps are meant (ch05 f154, nose to ear), and
  in ch04 f046 and the border-fox close-ups drawing by depth would hide a face. tests/set-pile.test.js
  holds the pile's `wide` camera to it. The small cases elsewhere (ch04 f043; ear tips, a tail and
  shadow edges in ch01, ch04 f028, ch06 f069 and ch07 f067) wait for a later batch.
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
  scroll as before), except three left for a second round: ch04 f115 for a noticing cat (two cards
  under the picture; Back and Next below at 1080 x 720 and 1133 x 744), a Counts page already counted
  (Back, Count them again and Next stack, Back 1 to 5px under a 720 fold), and the Case File's last row
  with Aa on (and its middle column breaking a long name mid-word);
  with Aa off every page is as it was, box for box at every size and pixel for pixel at 1080 x 720 and
  810 x 1080. Turned down: a smaller picture beside long pages (130 lines of layout code, a picture that
  changes size page to page, ch06 f100 still cut) and a pinned button strip (it hides words, and a page
  of choices keeps Back below, chapter 4's reason). Still cut, at sizes outside the 13: upright in Safari
  (810 x 1010) Back on ch01 f014, ch04 f095 and ch06 f100 (f014 and f100 worse with Aa off), and at
  1024 x 700 ch08 f087 by 16px. Upright choice pages want a portrait layout change, Aa off too: Aron's.

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
  6). From chapter 5's names check
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

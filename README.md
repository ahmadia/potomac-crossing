# Potomac Crossing

A story game for Lissa (8) and her friends. Each player is a pillow cat who joins a Clan of wild
cats on a mythic Potomac River, with otters for friends, a scattered clutch of dragonets to find,
a fox to outwit, and a mentor who teaches the times tables along the way.

The medley it grew from: Wings of Fire (dragons), Warriors (the Clan cats and the pretend
play around them), James Ponti (the mystery), otters (Lissa's favorite animal), and Potion Lab
(Aron's times-tables game, which stays a separate game).

**Play:** https://ahmadia.github.io/potomac-crossing/ (on an iPad: Safari, Share, Add to Home Screen)

**Status (2026-10-18):** chapters 1 to 6 are built as a static web app (`index.html`, `app/`; the
stack is in [`docs/build.md`](docs/build.md)), storyboarded frame by frame in
[`docs/storyboard/`](docs/storyboard/), and deployed on GitHub Pages from `main`. It is developed
on the Mac mini, in `~/potomac-crossing` (since 2026-10-04). Chapter 6, *The Snake in the Stones*,
shipped 2026-10-18, the first chapter made with `dev/workflows/chapter.js`.

## Docs

- [`docs/world.md`](docs/world.md): the world. The Accord, the map, the Clans, the otters,
  the dragons, the bad guys, Clan words, tone, themes, and the Counts.
- [`docs/module-1.md`](docs/module-1.md): the first solo module, *The Dragon Under the
  Bridge*. Ten chapters, the seven dragonets, the case, the paths, Tallyheart's lessons, and
  the real stone at the end.
- [`docs/chapters/01-through-the-glass.md`](docs/chapters/01-through-the-glass.md): chapter 1,
  drafted as the actual game text.
- [`docs/chapters/`](docs/chapters/): every later chapter's game text (02 After the Storm, 03 Under
  the Old Bridge, 04 The Glittering Scale, 05 Riffle's River, 06 The Snake in the Stones), chapters 2
  to 5 each with its notes, its Case File cards and the questions it raised. From chapter 6 a chapter has three files: its **brief** (the
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

## Claude's calls under decision 46

Each is Aron's to reverse.

- **Fog is Wisp** (2026-10-10): Warriors has a cat named Fog. Wisp is in neither series and suits
  the pale, silent sister in the reeds. Puddle, Hail and Sleet keep their names (the books have
  only longer names such as Puddleshine and Hailstar, never those exact names). Dew, an exact
  Warriors name, is renamed before chapter 9 names her; she is no longer "the tiniest" (Squall is
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

## Open questions, waiting on Aron

Nothing here blocks the chapter being built; each chapter's own questions are in its text, under
"For Aron to confirm".

- **The Warrior Counts, for chapter 10:** whether 3 × 7 and 7 × 3 are one pair or two (55 questions
  or 100); one sitting or a few rounds; a missed question still gets the sand but counts against
  the 90%; and she can try again from the Training Hollow whenever she likes.
- **Names and words that may still echo the books**: the Training Hollow (ThunderClan's training
  hollow; the Claw Tree Hollow?); chapter 1's Clan-name ideas, which make Warriors apprentice names
  (Hollypaw, Fernpaw, Stormpaw, Minnowpaw, Sedgepaw, Frostpaw) and "Moon" (Wings of Fire's
  Moonwatcher); "Ironsnakes" (Warriors' Thundersnake; Clankers?); "leaf-drop" (Warriors' leaf-fall);
  Dew (Warriors pairs Drizzle with Dew; before chapter 9 names her); Snip, one of the weasels
  (Warriors has a Snipkit; before chapter 7 or 8 names them). From chapter 5's names check
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
  wikis (checked 2026-10-11; Slosh would now echo chapter 6's Sloshbank), and Riffle's slip ("Pud— PUDDLES. Raft puddles.") is rewritten around
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

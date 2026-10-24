# Continuity: what a later chapter can rely on

*Through chapter 8 · 2026-10-21 · the orchestrator updates this file at each ship
(`docs/production.md`, shipping checklist)*

This is the digest the writers of chapters 9 and 10 read instead of eight chapters' notes and specs:
what happened, what the game remembers, what is drawn, and what is already promised. Everything here
was checked against `app/story/ch01.js` to `ch08.js` and `app/engine.js`. Where a chapter's notes (or
its spec) and the code differ, the code is followed and the notes' version is in brackets, "(notes
say …)". Names are the ones on screen now; frame ids (`f043`) are in that chapter's story file.

## Where the story stands

- **When.** Bedtime on her eighth evening in the Clan, after her seventh morning count and a night on
  the trail. A chapter is a day. The moon is eight evenings old, "a bright half moon", already high at
  sunset ("Outside, the moon is half full. When it's full, it's the Gathering."); her deadline and the
  dragon's are the same full moon.
- **The thefts.** Four pieces a night, twenty-eight in seven nights, always from the middle of the back
  row, the pile left tidy ("Four gone. Still tidy."). Told: Tallyheart lay by the roots that night with
  her eyes shut, "like a sleepy old cat", heard "Scrape, scrape. Then bump, bump, bump, bump: four
  pieces of prey, going DOWN the hole.", did not pounce ("If we pounce here, we'll never find where our
  prey GOES."), and followed the sound as far as the hedge: "It went on, toward the train tracks."
  Kept: the last guards "saw NOTHING" ({Murmur}chime). Glintstar: "Nobody here is to blame. Seven
  nights now."; the old tom: "Four a night, for SEVEN nights? That's more than I've got WHISKERS." At
  dusk the pile is drawn full again and the first guards are at the front, facing out. Whether the
  eighth night is robbed is chapter 9's (Reynard to the weasels: "Rob later.").
- **The sums.** Six nights: twenty-four, against a dragon's sixty (ch7, her `my-count`; Glintstar heard
  twenty-four and never sixty: "A good count."). Seven nights: twenty-eight (4 × 7), worked in the
  Hollow with Tallyheart on every path. At the holes the weasels' own "Two a night each, through the
  tunnel" made it fourteen for Snip and fourteen for Snatch: "That's OUR twenty-eight!" "The Counts
  don't lie." (her friend's, both paths).
- **The trail.** At dusk she slipped round the back of the pile, behind the guards, to the open tunnel,
  with Tallyheart (told) or Riffle (kept): "Two ways to the tracks." The choice is hers and no flag
  records it. *Through the tunnel*, just wide enough for her: told, Tallyheart's shoulders stick, so
  she goes over, counting her pawsteps above ("Three hundred and twelve pawsteps. And I tiptoed round
  the dogs."); kept, Riffle pours in after her, sticks, and pops through ("Otters are bendy. Mostly.").
  It splits once (worms one way, mice the other) and runs under the Barking Field, where the dogs snore
  and mumble their names, to the foot of a high bank. *Around the Barking Field*, by the near side ("Not
  one paw past the post."), silver in the moonlight: the dogs wake, and she slips past by her specialty,
  or with Hail's help. Both reach the railway bank: two long, shiny lines on top, holes all along its
  face, and "Not fox country. Nobody's land. The trains own it. Not one paw on the rails."
- **The thieves.** From the tall weeds at the bank's foot she and her friend saw two skinny shapes pop
  out of two holes: "Weasels." (Tallyheart's whisper; Riffle mouths "WEASELS."), the first time anybody
  said weasel. "Thin brown fur, like the tuft at the Crossing. Tiny feet, like the prints in the marsh.
  The thieves!" **Snip** (she, the squeaky one) and **Snatch** (he, ALWAYS holding a mouse), sister and
  brother, squabble over who carried more, and cannot count ("That's… LOTS." "That's a HUNDRED.").
- **The brag.** Reynard trotted along the tracks, far above them, and never saw her (the wind blew from
  him to her; her friend's raised tail was pulled down in time): "Good evening, my clever little paws."
  "And such a fine, dry den, waiting just for me." Snip: "Under the Old Bridge! When is it yours?" "At
  the Gathering, the Clans will chase their dragon away. Then the den is MINE." Snatch: "And their pile
  is OURS!" "One shiny bit by their pile. One little story: ‘It FLEW off, by moonlight!’ And the whole
  Clan said DRAGON." "Nobody saw a thing." The dry den, his motive, is under the Old Bridge, where
  Sprinkle is; every cat remembers that he said it at the border (ch4 `f042`), a Sleet cat that Sleet
  heard it too. He trotted off humming ("Nap now, my little sneaks. Rob later. And keep it TIDY."), and
  the weasels went to sleep down a little hole.
- **The stash.** In the biggest hole: mice and voles in tidy rows, some smelling of her camp and some of
  marsh mud ("ReedClan's prey too!"), and beside them a heap of something that glitters: "Smooth. Clear.
  Flat. Just like the 'scale' behind the back row." She lived behind it all her life, her old patio
  door: "It's not a scale. It's GLASS." Tower glass, the fox's "one shiny bit". She took one small piece,
  wrapped in a leaf, for proof, and it lies under the moss of her nest (the den's `glass: true`). The
  stash, the rest of the glass and the prey are still there; the fox's "scale" still lies behind the
  back row.
- **The chase.** Her sneeze ("Weasel smells like very old socks.") woke them: "I smell CAT." She ran
  with the leaf, her friend beside her, down the bank and round the near side of the Barking Field
  (both routes go home that way), the weasels squeaking behind ("We'll… we'll SQUEAK at you!"), until
  the dogs leapt up at the fence ("SQUIRRELS!"; with Hail, "DOGS! SQUIRRELS! THAT way!") and the weasels
  skidded and ran all the way back: "BYE, RUDE SQUIRRELS!" "Nobody's hurt." The weasels know "a CAT"
  saw them at the stash, not which; Reynard saw nothing.
- **Home.** Behind the pile, the guards still at its front. Told: Tallyheart looks at the glass a long
  time: "So THAT'S our dragon's scale." "Weasels. A fox who wants a den. And a heap of glass. This goes
  to the Gathering, with the whole story. Every Clan should hear it." Kept: Riffle waves goodbye at the
  hedge ("Otter's honor. I'll tell NOBODY. Except Sprinkle."), and Tallyheart is waiting ("Twenty-six
  pawsteps from the hedge. And four paws. All there." "I came to say goodnight. Your nest was empty. I'm
  not angry. I was scared."); she tells her "everything: the tunnel, the weasels, the fox, the stash.
  Everything but the dragonets. Not yet.", and shows her the glass ("So THAT'S our dragon's scale. A
  fox's trick." "This goes to the Gathering. Every Clan should hear it."). Both: "A night trail, a fox
  and a stash. You stayed calm, and took one piece, for proof. That's how a warrior thinks."; kept,
  "But next time, you take ME. Not just Riffle."; told, "Tomorrow, Riffle will want to hear EVERY bit."
  The dragonets stay the player's secret on the kept path.
- **The case against the fox.** No moon on the storm night, say two witnesses, Patience (ch5) and
  Waffles (ch7); "The fox says it FLEW. Sprinkle can't fly. They can't both be true." (ch7, every cat);
  her paw fits inside one of Sprinkle's prints, and the thief's were half the size of her paw; and now
  his own words, overheard: FLEW was "One little story", the "scale" his "one shiny bit", the dry den
  what he wants. Nobody has charged him; a talking-worry cat wants to shout "LIAR!" and holds it in
  "For the Gathering."
- **The tunnel.** Under the low bramble roots behind the back row, its mouth about as wide as a small
  cat's shoulders, left open (the roots lifted) on both paths since ch7. It runs under the Barking Field
  to the foot of the railway bank (`tracks`, `tunnel-end`), splitting once on the way; the weasels come
  up it, "Two a night each". A tunnel-route cat has been through it (and kept Riffle with her); a
  field-route cat never has, and nothing tells the two apart. The Clan does not know of it.
- **Glintstar has ruled** (chapter 4): the dragon has until the full moon, when every Clan hears
  Reynard at the Gathering and decides if it must leave the river; until then no cat goes looking
  for it; she will hear anything "truer than a fox's story." She knows of no dragonet, on any path.
  Chapter 6: "ReedClan has been robbed too," and "We don't blame what we haven't seen. We guard."
  Chapter 7: "The dragon's case is for the Gathering. Bring your count. Until then, we guard." Chapter
  8: "Nobody here is to blame. Seven nights now." She knows nothing of the tunnel, the weasels, the brag
  or the glass.
- **Reynard has claimed** (at the border, and twice to the old ferry otter): on the storm night the
  rain stopped, the moon came out, and a dragon flew out of camp with its claws full of mice, down
  under the Old Bridge. Most of the Clan believes him; the old tom: "That dragon is EVERYWHERE." (ch7:
  "Maybe it's a SMALL dragon."). Drawn again in ch8, for the first time since ch4, only up on the
  tracks, and seen by nobody but her and her friend. Sleet (if she found him) has heard
  him in the grass: "Such a fine, dry den."
- **ReedClan has been robbed too** (chapter 6: "Night after night. And leaving our pile TIDY."; "Somebody
  is robbing us both"). Their muddy prey is in the weasels' stash, and Hail saw "MUDDY mice" carried
  under her fence. ReedClan has not been told, and is not on screen in ch7 or ch8.
- **Coil** (chapter 6) told of small diggers under the pile, for some quiet; he has always known about
  Sprinkle and tells nobody ("Nobody asked"). Kept, ch8: he heard Riffle's "A TUNNEL? Under your PILE?"
  from the stones and hushed it ("Quietly."), so on the kept path he knows the tunnel is found; told,
  he does not.
- **Who knows what.**
  - *Sprinkle's secret.* Told path: she, Riffle and Tallyheart, who hid her and promised to tell
    Glintstar everything once the thief was found (ch4: "Then we tell her everything."): the thief is
    found, and when she tells is chapter 9's. Kept path: she and Riffle; Tallyheart half-knows ("For a
    DRAGON."), and has now heard everything else. Coil has always known.
  - *The trail* (the tunnel, the weasels, the brag, the stash, the glass): she and her friend, who was
    there for all of it (told, Tallyheart, over the tunnel or beside her round the field, on watch at
    the stash; kept, Riffle, in the weeds and on watch), and on the kept path Tallyheart too, told at
    home. Told: Riffle, Sprinkle and Coil know none of it, nor that the tunnel was found. Kept: Sprinkle
    and Coil heard of the tunnel by day ("come back and TELL me"), and nothing since.
  - *Hail* (if found): she and her friend (Tallyheart, "Another one!", or Riffle, "ANOTHER dragon!").
  - *The sixty, the prints and FLEW:* she, Riffle and Sprinkle on every path (and Coil); Tallyheart on
    the told path only. *Waffles' witness:* she and Tallyheart, every path.
  - *Glintstar and the Clan:* four a night for seven nights, and nothing more. No Clan has been told:
    "This goes to the Gathering."
- **Where they are.** She is in her nest, her glass under the moss, the grey tom asleep across the den;
  the eighth night's first guards at the front of the pile, facing out, the tunnel open behind the back
  row and the fox's "scale" still on the earth behind it; Tallyheart last with her behind the pile, on
  both paths; Riffle waved off at the hedge (kept), or not seen today (told); Sprinkle under the Old
  Bridge, still unable to fly, and Coil in the gap beside her nook; Snip and Snatch back at their holes
  in the railway bank, the stash in the biggest; Reynard trotting off along the tracks; Hail at her log
  in the Barking Field (met or not), with the three dogs; Squall on the tallest tower's roof; Puddle
  under the ferry raft; Wisp in Patience's reeds; Sleet in the long grass past the last post;
  Sloshbank's patrol in ReedClan's reeds; Waffles on her balcony nineteen floors up; {Murmur}chime,
  Glintstar and the old tom in camp.

## Chapter by chapter

Every chapter ends warm, in her nest, on the optional dream question (README 42).

### 1. Through the Glass (the evening she joins, and the storm night)

- **Plain path.** A pillow cat on the ground floor of the tallest glass tower has watched
  CrystalClan for moons, with Princess Waffles narrating from nineteen floors up. The Tall One opens
  the door and leaves it open a crack, with a dish of water on the step. She sees the thirteenth
  sparrow Tallyheart missed. The Clan doubts her; Tallyheart vouches ("Judge her by what she does,
  not by where she sleeps"); Glintstar gives her one moon ("Until the full moon, and the
  Gathering"); the Clan purrs her new name. The Sky River, her nest, the storm, and a great crash.
- **Choices that set flags.** Her look and she-cat or tom, pet name, `specialty`, `stepOut`,
  `spokeUp`, `joinReason`, Clan name, `worry`.
- **Optional scenes.** None. **Count.** The 1s (tails), and her first claw mark.
- **Hook.** "And what made that enormous splash down by the river?"

### 2. After the Storm (day 2)

- **Plain path.** At her old step Waffles was up all night: "not a sliver of moon." Ears, then the
  pile: the old tom's patrol stacked ten pairs, she counts eight, and she is the first to notice
  that four pieces are gone. The stacks are still tidy ("The wind does not tidy up after itself");
  Glintstar: "We don't blame what we haven't seen." Her first walk: the Old Bridge (no cat goes
  under; a train drowns out why), the Barking Field (three dogs: "BYE, RUDE SQUIRREL!"), the
  Crossing (skymonsters are airplanes; nobody believes her). Riffle gives her his lucky stone.
- **Choices that set flags.** `ch2SaidAloud`; `ch2Path` (bridge: she sneaks under, finds drag marks,
  a sniffle and two eyes that blink, and Tallyheart catches her, "I'm not angry. I was scared";
  river: with Riffle she hears a roar with a hiccup from the tallest tower); `ch2Stone`.
- **Optional scenes.** None. **Count.** The 2s (ears).
- **Hook.** "Something strange is happening on your river": who sniffled, or who roared?

### 3. Under the Old Bridge (day 3)

- **Plain path.** The pile: nine pairs at sunset, seven now, "Eight pieces in two nights." The Clan
  watches Murmurpaw pass her Warrior Counts and become Murmurchime; Tallyheart: "One day, that'll be
  you." Claws. At the bridge Riffle's fifth pebble bounces into the dark and is rolled back; she
  goes in because nobody should be hungry and alone in the dark, Riffle behind her. Sprinkle: a
  Mistscale dragonet as big as a heron, her right wing hurt ("I can't fly"), unfed since the storm.
  Riffle fishes for her. She eats ten fish at a meal; the storm blew her six brothers and sisters
  along the river; the littlest hiccups when he roars. A fifteen-claw promise to look for them.
- **Choices that set flags.** `ch3Told`. Told: Tallyheart meets Sprinkle, drags a branch across the
  back, sends to Riffle's Granny for fish, and keeps it "between us." Kept: she carries her supper
  vole to the bridge, and Tallyheart smells fish on her: "Back before dark."
- **Optional scenes.** None. **Count.** The 5s (claws). **Hook.** Six more dragonets to find.

### 4. The Glittering Scale (day 4)

- **Plain path.** Tallyheart's new rule, rows of ten; both forepaws. A hole of four shows in the
  middle of the back row: "Twelve pieces in three nights." In the gap lies a glittering "scale"; she
  looks through it or into it ("It's like GLASS"); the old tom calls it a DRAGON's. Murmurchime
  brings news of a fox at the border. Reynard tells his story, she asks a fair question, Glintstar
  rules, and three dogs see him off ("BYE, GIANT SQUIRREL!"). In the Hollow she starts her Case File
  on curls of bark. Under the bridge Sprinkle says the scale is not hers; a thirty-claw promise;
  Riffle offers his raft. At sunset forty pieces lie in four rows, and the moon is a thin curl.
- **Flags.** `ch4CaughtFly` (a noticing cat catches FLEW and cannot say so); `foundSquall`.
- **Optional scene.** The roof of her old tower (a climber goes up the outside, anyone else in the
  elevator, "The one that goes DING!"): Squall, his riddle, two skinny shapes, and his "five."
- **Count.** The 10s. **Hook.** Tomorrow, Riffle's raft: who was awake on the storm night?

### 5. Riffle's River (day 5)

- **Plain path.** The old tom slept on guard: "Sixteen pieces in four nights." Nine lives. At the
  Crossing she boards the ferry raft one paw at a time and sits through the Roar, Tallyheart
  watching: "Not one claw! I counted!" Then both witnesses. The ferry otters had a dragon "as big as
  a bridge" from a duck, and the story from the fox himself, twice; in the raft's vine, a tuft of
  thin brown fur. In the marsh (she never leaves the raft; three ReedClan cats watch) Patience sells
  answers at two fish each: no moon that night; two small shapes crossed her mud when the rain
  stopped, and come back every night; tiny prints. Riffle dives for twenty fish. Her free tip: "Ask
  the one who never shuts his eyes." Sprinkle hears the news; Tallyheart: "Two stories. One sky."
- **Flags.** `ch5First`, `foundPuddle`, `foundWisp`, `ch5Roof`.
- **Optional scenes.** The roof again (offered only to a cat who has not met Squall); Puddle (look
  under the raft after the Roar, or ask after Riffle's slip going home); Wisp (keep still, thrice).
- **Count.** The 9s. **Hook.** "Tomorrow: Coil. What does a nosy old snake want for a secret?"

### 6. The Snake in the Stones (day 6)

- **Plain path.** The old tom sleeps on guard, on his pinecone. Four gone again from the middle of
  the back row, still tidy: "Twenty pieces in five nights. Tonight, the pile gets proper guards." "You
  already know half the threes." Her first border patrol, three because a patrol is three
  (Tallyheart, {Murmur}chime, her), walks the old stone wall to its end, where the reeds begin.
  ReedClan steps out in threes: Sloshbank, dripping, blames the CrystalClan apprentice who was on
  their marsh ("That was you"), and at her fair question admits their pile is robbed too, and left
  tidy. Riffle waits at the Barking Field with fish; a silver-white tail flicks in the long grass by
  the last post. Under the Old Bridge a voice says hello from the stones: Coil, who has no eyelids and
  feels footsteps, trades a secret for quiet (no juggling: "Otter's honor"): small diggers come and go
  under the pile every night. At sunset Tallyheart counts out eighteen guards; on the first watch
  nothing happens. In the dream a starry cat says "Count what's missing, little one. Then ask who was
  there to see it," and far below a wind chime rings on a balcony nineteen floors up.
- **Choices that set flags.** None. The marching order, the fair question (asked unfairly first:
  "Ask it fair," and she does), "Would you tell the FOX?" or "ANYBODY?" (one answer), the dream's
  question and the fox trail itself set nothing. `ch3Told` decides who is there: told, Tallyheart goes
  on with her to the field, the post and the bridge (her wink; "Old."; Coil's "the ginger one"; her
  rule, "because of YOU"); kept, she pads off after the border ("back by sunset. Tonight, you guard."),
  the bank is checked for ginger ears, Coil tells her of the rule ("Your ears go hot."), and at sunset
  "You don't tell her what Coil said."
- **Flag.** `foundSleet`.
- **Optional scene.** "The last post" (follow the fox trail): Sleet, his riddle, the fox's "fine, dry
  den", and his "five." She never steps past the post; Riffle is there on every path, Tallyheart on
  the told path only.
- **Count.** The 3s (patrols), and her sixth claw mark. **Hook.** "Tomorrow, your sixth morning
  count. Will anything be missing?"

### 7. The Counts Don’t Lie (day 7)

- **Plain path.** She wakes before the sun with the dream's wind chime in her ears and goes to her old
  step, the dish full. Waffles was up ALL night with her nerves, and the moment the rain stopped she
  looked for the moon: "NO moon. Not a sliver." ("You told me that on my second day."); she sees the
  Tall One fill the dish every morning. At the sixth morning count the three front rows make thirty;
  she walks round, counts the four gaps herself and says it first: "Four gone." Eighteen guards saw
  nothing; Glintstar blames nobody and wants the six nights' count at sunset. The 3s warm-up;
  Tallyheart's six whiskers on one cheek ("Six is two threes."); the rim's five cheeks by sixes; six
  Counts she knows already, at the tree; the 6s. In the sand, four a night for six nights: twenty-four;
  a dragon who eats ten fish a meal would take sixty, two lines drawn to scale. "A warrior who knows
  {their} Counts can't be fooled." Under the Old Bridge Sprinkle hears it ("now the NUMBERS know!"); her
  paw fits inside one of Sprinkle's prints with room to spare; Sprinkle tries to fly, and can't. "The
  fox says it FLEW. Sprinkle can't fly. They can't both be true." Coil: "I could have told you. Nobody
  asked." At sunset Glintstar hears twenty-four, never sixty: "A good count." At dusk, as the first
  guards settle in, she slips round the back and finds, under the bramble roots, the mouth of a tunnel
  going down under the pile, much too small for a dragon. Nobody goes in. In the den she and the grey
  tom count their whiskers: twenty-four between them.
- **Choices that set flags.** None. Is grass soft, the sum's two lines (told or kept), "So Reynard
  LIED!" or "The fox's story isn't TRUE!", and sniff or listen at the tunnel set nothing; reaching the
  FLEW screen sets `ch7Flew` (sticky) on every path. `ch3Told` decides who is there: told, Tallyheart
  does the whole sum ("I know one who eats ten fish a meal." and a wink), takes her straight to the Old
  Bridge, says FLY, and goes round the back with her at dusk ("Let's look."; "And I SAT here."; "Not a
  word to the Clan yet."); kept, Tallyheart frowns at the twenty-four ("For a DRAGON."), says "Back by
  sunset" ("wash first"), the bank is checked for ginger ears, the sixty and FLY are Riffle's, and she
  finds the tunnel alone. A noticing cat finds it by the dug earth (and, with `ch4CaughtFly`, says "I
  KNEW it! I knew it at the border!"), everyone else by Coil's "Under"; a sneaking cat's paws go
  silent; a climber sees the tracks from the bramble arch; each worry has a line at the mouth.
- **Optional scenes.** None. **Count.** The 6s (whiskers on one cheek), and her seventh claw mark.
- **Hook.** "Somewhere, that tunnel comes out. Where?" Tomorrow night, with Tallyheart (told) or
  Riffle (kept). The teaser, "Chapter 8: The Night Trail": "Tomorrow night, a trail in the dark. Where
  does that tunnel come out?"

### 8. The Night Trail (day 8)

- **Plain path.** It opens on a title panel over her sleeping nest (`f001`, the first chapter with one:
  its start frame must show on both paths). Told, Tallyheart wakes her before dawn: the thieves came
  while she lay by the roots, four pieces went DOWN the hole, and she followed the sound to the hedge.
  Kept, the last guards saw NOTHING. At the seventh morning count (three front rows, 3 × 10) she walks
  round and says it: "Four gone. Still tidy." "Seven nights now." In the Hollow: the 6s warm-up; "What
  has every cat got FOUR of?" "PAWS!"; Tallyheart's four paws, two pairs ("A four is two twos." "Exactly.
  Doubling, AGAIN."); the rim cats' paws by fours; seven fours she knows, one from every mark; the 4s;
  the eighth claw mark; in the sand, four a night for seven nights: twenty-eight. Told: "Tonight, we
  follow them all the way." "Just us." Kept: "Back by sunset.", and at the Old Bridge she whispers the
  tunnel to Riffle ("A TUNNEL? Under your PILE?" "Quietly," says Coil), who is COMING. At dusk, under a
  bright half moon, she slips round the back to the open tunnel and chooses: through it, or round the
  Barking Field. The routes meet at the weasel holes in the railway bank: the tall weeds, Snip and
  Snatch ("Weasels."), Snip's share (2 × 7; "That's OUR twenty-eight!"), Reynard's brag up on the tracks
  (the dry den under the Old Bridge, "One little story", "Nobody saw a thing."), the stash (both Clans'
  prey) and its heap of glass: "It's not a scale. It's GLASS." She takes one piece in a leaf, sneezes,
  and is chased home round the field until the dogs turn the weasels back ("BYE, RUDE SQUIRRELS!").
  Behind the pile: told, Tallyheart sees the glass ("This goes to the Gathering, with the whole
  story."); kept, Tallyheart is waiting ("I'm not angry. I was scared.") and hears everything but the
  dragonets. "That's how a warrior thinks." In the den she and the grey tom count their paws: eight
  ("EIGHT? I only ever use four.").
- **Choices that set flags.** None. The route ("Through the tunnel." / "Around the Barking Field.",
  written once on `hole`, `f036`), sniff the left way or the right (the fork, `f045`/`f047`), the hollow
  log's "Not tonight. Keep going.", glare or stick out your tongue at the fox (`f118`/`f120`), and the
  kept "I'm sorry." / "But I found the THIEVES!" (`f152`) set nothing, and nothing after the weasel
  holes reads the route. `ch3Told` decides who is there, and every picture with the friend in it is a
  told/kept twin: told, Tallyheart wakes her, plans the trail, goes over the tunnel or round the field
  with her, keeps watch at the stash and walks her home, and Riffle is never on screen; kept, Tallyheart
  sends her off, Riffle walks the trail, and Tallyheart waits behind the pile. Past the dogs (field
  route, after "Not tonight."): sneaking, flat in the grass; climbing, along the fence top; friends,
  "Hello, dogs!"; noticing or swimming, the friend's fetch (a pinecone, told; a pebble, kept). A
  noticing cat sees tiny prints in the tunnel and round every hole; a sneaking cat's paws go silent at
  the stash. Each worry has a line (the Flags table); a small cat wriggles into the stash ("A tight
  squeeze. In you go!") where every other cat peeks. A dragonet found before has one line where its clue
  comes true: Squall's two shapes (`f100`), Puddle's clever little paws and Sleet's dry den (`f113`),
  Wisp's glittering drop (`f131`).
- **Flag.** `foundHail`.
- **Optional scene.** "The hollow log" (field route only): a white head pops up from the log ("Ooh!
  Visitors!"); "Who's in the log?" (read "Go and see Hail again." by a cat who has found her) meets Hail:
  her riddle (4 × 4), Sprinkle's news, her two skinny shapes (`hail-shapes`), the dogs led round in a
  big, silly circle, and her "five". The friend is there on both paths.
- **Count.** The 4s (paws), and her eighth claw mark.
- **Hook.** "Whatever the Clans decide, Sprinkle needs to FLY again. And her hurt wing still won't lift.
  How do you mend a dragon's wing?" The teaser, "Chapter 9: Featherlight": "Sprinkle has to fly by the
  full moon." / "How do you mend a dragon’s wing?" Chapter 7's teaser is kept on both routes (the field
  route finds the tunnel's far end from outside).

## Flags

All flags sit in one object for every chapter (`cat.flags`; her look, names and dreams beside it). A
`when` reads them, and `false` also matches a flag never set. **Replaced**: set by a choice, so
Back, or picking again on a reread, replaces it everywhere, her book included. **Sticky**: set by
reaching a frame (`sets:` on the frame, or the engine), and never unset.

| Flag | Values | Set where | Reread | Read so far |
|---|---|---|---|---|
| `look` (`sex`, `fur`, `marking`, `eyes`) | `sex`: `she`, `tom` | ch1 `f011`, her reflection in the glass | replaced | the pronoun tokens (`{they}`, `{them}`, `{their}`) in every chapter; the art (her face in the "scale", her paws in the promises; ch7: her paw over Sprinkle's print, her two cheeks in the bedtime count; ch8: her four paws in the bedtime count, `f161`) |
| `petname` | picked or typed, up to 24 characters | ch1 `f012`, Waffles asks | replaced | Glintstar repeats it once, "with tremendous dignity"; Waffles calls her nothing else ("Of course you are, {petname}."; ch7, three times: "{petname}! DARLING!", "Go, {petname}. Count things. Be FABULOUS."); ch8: not read |
| `name` | picked or typed, up to 14 characters; shown as `{name}paw` | ch1 `f052`, Glintstar asks | replaced | everywhere. A cat named Murmur makes the tortoiseshell Mutterpaw and Mutterchime (`{Murmur}`) |
| `specialty` | `noticing`, `sneaking`, `climbing`, `swimming`, `friends` | ch1 `f014`, what she did all day as a pillow cat | replaced | one line each in ch2 and ch3. **noticing**: the dug earth behind the pile (ch2 to ch5), catches FLEW (ch4), cards `dug-earth` and `prints-pile`, tells Tallyheart about the prints, thinks of Waffles as a witness (ch5), Sloshbank's big muddy paws, "Nothing like the tiny prints." (ch6 `f033`, the chapter's one specialty line); ch7: the dug earth "goes in UNDER the roots" (`f083`/`f084`, both paths), "Tallyheart looks at you." and her FLY line (told, `f067`), and with `ch4CaughtFly` "I KNEW it!". **climbing**: climbs the tower's outside (ch4, ch5), runs up Riffle's pole for card `prints-tracks` (ch5), climbs the bramble arch and sees the tracks, a screen of its own (ch7 `f092`). **sneaking**: sock-sneaking (lines only); ch7: "Your paws go silent. Not one guard looks round." at the slip round. Not noticing, ch7: "Tallyheart goes very still." (told) and Coil's "Under" at dusk. **swimming**, **friends**: lines only (a paw in the river; "Hello, Patience."); none in ch6 or ch7. Ch8: **noticing**, "In the soft earth: tiny prints, coming and going." in the tunnel (opening `f040` told, `f042` kept) and "Round every hole: tiny prints. Five little toes, close together." (`f096`/`f097`); **sneaking**, flat in the grass past the dogs (`f064`/`f065`) and "Your paws go silent. Not one weasel stirs." at the stash (`f126`/`f127`); **climbing**, along the fence top (`f066`/`f067`); **friends**, "Hello, dogs!" (`f068`–`f073`); **noticing or swimming** (`specialty: ['noticing', 'swimming']`), the friend's fetch (`f074`–`f079`). The way past the dogs is read only on the field route, after "Not tonight." |
| `stepOut` | `chase`, `slow` | ch1 `f018`, the moth at the open door | replaced | ch1's page of her book only |
| `spokeUp` | `true`, `false` | ch1 `f028`, the thirteenth sparrow | replaced | ch1's page only |
| `joinReason` | `learn`, `count`, `brave` | ch1 `f045`, Glintstar's question | replaced | ch1's page only |
| `worry` | `small`, `water`, `talk`, `shiny` | ch1 `f066`; Tallyheart answers each ("Small cats fit where big cats can't"; "one paw at a time"; "A Clan needs a cat who'll speak up"; "the first to notice when something sparkles that shouldn't") | replaced | **water**: Tallyheart stands between her and the deep water (ch2); her tummy flips at "raft" (ch4); one paw at a time onto the raft, then "Still deep. I looked right at it." (ch5). **shiny**: "Me too" with Sprinkle (ch3, ch4); she sees the glitter first (ch4); the fish flash like silver (ch5). **small**, **talk**: one line at the border (ch4) and one in ch5. ch6: one line each at Sloshbank (`f026`: small, "You stand up tall anyway."; water, "It's only one drip."; talk, "You hold them in. For now."; shiny, "You try not to watch."). ch7: one line each at the tunnel's mouth (`f086`: small, "A small cat could just squeeze in, you think. A small cat like you."; water, "At least it isn't wet."; talk, "You want to tell EVERYBODY. You whisper instead."; shiny, "Nothing shines in there. Only earth, and roots."). Ch8: small, at the mouth ("A small cat could just squeeze in. A small cat like you.", `f036`), in the tunnel ("You fit PERFECTLY. Small cats fit where big cats can't!", `f039`) and at the stash ("A tight squeeze. In you go!" with a wriggle Tap of its own, `f126`; every other worry peeks, `f127`); water, "Neither way is wet. You check twice." (`f036`); talk, "You want to jump up and shout LIAR! You hold it in. For the Gathering." (`f118`/`f120`); shiny, at the heap ("It sparkles. It shines." … "You keep your paw still. You KNOW what it is.", `f129`) and "Not for keeping. For proof." (`f131`). **The brave moments**: small's is the tunnel, and on the field route the stash hole; shiny's is the heap (both ch8); water's is chapter 10's Moon Ferry at night, talk's the Gathering (ch8's brief, call 4) |
| `ch2SaidAloud` | `true`, `false` | ch2 `f030`, says the shortfall out loud or whispers it | replaced | ch2's page only |
| `ch2Path` | `bridge`, `river` | ch2 `f084`, one look under the bridge, or the river with Riffle | replaced | ch3: eleven places (the same sniffle and eyes, "You're the one who said hello"; or "We heard him! On the tallest tower!"; told and bridge, Tallyheart's "AGAIN?"); ch4: one line at the roar; ch5 to ch8: not read. Both paths heard of Coil: "Nosy old thing" from Tallyheart (bridge), "he trades them like pebbles" from Riffle (river) |
| `ch2Stone` | `nose`, `chin` | ch2 `f108`, where Riffle's stone goes in her nest | replaced | the den's art ever since (`stone: 'auto'`) and one bedtime line in ch3 to ch8 (ch7 `f097`, ch8 `f159`) (ch2's notes say this choice sets no flag) |
| `ch3Told` | `true`, `false` | ch3 `f086`, tell Tallyheart or keep the secret | replaced | ch4: seventeen places (a wink, or fishy paws; "Not yet. First we find out who took the prey. Then we tell her everything."; the branch; kept, "If you ever have one for me, I'm right here."); ch5: eight ("Find me something truer than a fox's story. For her."; "Then you whisper the rest." or "Your secret is getting bigger."); ch6: thirty-seven frames in told/kept pairs (most the same words, with Tallyheart in the picture or not) and eight lines: her wink or "back by sunset"; "Old."; "Not one paw past the post," hers or Riffle's; "The eldest… And the bossiest."; the branch, or the bank checked; Coil's "the ginger one" and her rule, or Coil telling it and "Your ears go hot."; "A snake's secret," hers or narration; told, her tail round you at the stones; kept, the hairball at sunset; at the watch, "Always the back. And a snake's secret." or "Why is it always the back?". ch7: frames by path in the Hollow (told `f036`–`f040`, the sum; kept `f041`–`f043` and `f046`/`f047`), every `back` panel under the bridge in told/kept pairs (and the kept sixty, `f053`–`f056`), and the panels at dusk and round the back that hold her spot (`f079`–`f084`, `f087`, `f088`/`f090`, `f093`–`f096`; the `hole` close-ups are shared); four choices only one path sees, each with `else` (the sums', `f039` and `f055`; sniff or listen, `f088` and `f090`); the book's sum and tunnel entries; bedtime, "Tomorrow night, you and Tallyheart (or Riffle) will find out." Ch8: who walks the trail with her. Told, Tallyheart wakes her before dawn with the night's news (`f002`–`f004`), plans the trail ("Just us. Not a word to the Clan yet.", `f023`), waits by the mouth at dusk, sticks at it and goes over, counting pawsteps (`f037`, `f040`, `f041`, `f045`, `f050`), or walks round the field with her ("Then we go together."), whispers "Weasels.", keeps watch at the stash ("Too small for me."), and walks her home (`f147`–`f149`); Riffle is never on screen ("Tomorrow, Riffle will want to hear EVERY bit.", `f158`). Kept, the guards saw nothing (`f005`), "Back by sunset." (`f024`/`f025`), she tells Riffle at the Old Bridge (`f026`–`f029`), Riffle walks the trail (stuck in the tunnel, `f042`–`f044`; "WEASELS," mouthed; "Riffle keeps watch."), waves goodbye at the hedge, and Tallyheart waits behind the pile (`f150`–`f156`; "But next time, you take ME. Not just Riffle."). Every picture with the friend is a told/kept twin (88 of the chapter's 169 frames carry a `ch3Told` `when`: 40 told, 48 kept); two choices come in path pairs, each with `when` and `else` (the fork, `f045`/`f047`; the fox, `f118`/`f120`), and one is the kept path's alone (`f152`, its `else` to the shared `f157`); the book's trail and home lines. Chapter 9: whether the kept path tells Tallyheart about Sprinkle, and when the told path's Tallyheart tells Glintstar |
| `ch4CaughtFly` | `true` | ch4 frame `f043`, a screen only `specialty: noticing` reads | sticky | ch4: its recap line, and her file draws `fox-flew` and `cant-fly` touching; ch5: a thought when the old otter says "flew", and (told) Tallyheart's "One hole in his story for certain. Maybe two."; ch6: not read; ch7: never set (ch4's notes had chapter 7 set it for everyone: ch7 sets `ch7Flew` instead, ch7 spec call 1), and read once, with `specialty: 'noticing'`: "I KNEW it! I knew it at the border!" (`f067` told, `f068` kept); ch8: not read. Chapter 4's `fox-flew` link reads either flag. It still means only a noticing cat's catch at the border |
| `foundSquall` | `true` | the roof scene's last frame: ch4 `f089a`, or ch5 `f035a` | sticky | ch4: his five to Sprinkle, "Raft first", Tallyheart told (told path), bedtime; ch5: the roof is offered only without it, "Just what Squall saw!", the mud tally; ch6: her news to Sleet (`f061a`/`f062a`, one balloon in eight forms by `foundSquall`, `foundPuddle` and `foundWisp`: "Squall's on the tallest tower."); ch7: not read; ch8: "Just what Squall saw from his roof!" (`f100`), and her news to Hail (`f086`/`f087`, "And I've found more of you!", with any one of the four found flags). Gates card `squall-shapes` and his page in her book |
| `ch5Roof` | `true` | ch5 frame `f035a`, with `foundSquall` | sticky | found him in chapter 5: she tells Riffle and carries his five that day; ch5's page says so, and ch4's page then does not |
| `caseFile`, `caseFileOpen` | `true` | the engine: her first card (ch4 `f062`), and the `file` frame where the button appears (ch4 `f069`) | sticky | the Case File button on every frame and in the hub (ch4's notes name only `caseFile`) |
| `ch5First` | `otters`, `heron` | ch5 `f066`, which witness first | replaced | ch5 only: the order of the two scenes, and one line at the second ("The same somebody?"). Both orders give the same cards |
| `foundPuddle` | `true` | the last frame of "Under the raft": ch5 `f065a` (after the Roar) or `f130a` (going home) | sticky | ch5: Riffle's slip comes only without it; Puddle greets Wisp if he was found first; news to Sprinkle; the mud tally; ch6: her news to Sleet ("Puddle's under the otters' raft."); ch7: not read; ch8: "Clever little paws. Just what Puddle saw!" (`f113`), and her news to Hail. Gates card `puddle-paws` and his page |
| `foundWisp` | `true` | ch5 frame `f112a`, the last of "The pale reed" | sticky | ch5: "A reed with knees." or "Frogs."; who eats the fish; news to Sprinkle; the mud tally; ch6: her news to Sleet ("Wisp's in the heron's reeds."); ch7: not read; ch8: "Wisp drew a fox dropping something that glittered. Glass, like THIS!" (`f131`), and her news to Hail. Gates card `wisp-fox` and her page |
| `foundSleet` | `true` | ch6 frame `f068a`, his forepaw Tap, the last of "The last post" | sticky | ch6: the fox trail's two labels (`f048`: "Go and see Sleet again." and "Not today. He's spying."); Sprinkle's screen, his news or the tail she saw (`f072`/`f073`), and "Her eyes shine." (`f074`); ch7: not read; ch8: the brag's caption, "A fine, dry den. He said that at the border, and Sleet heard it too!" (`f113`; without him, "He said that at the border!"), her news to Hail, and in her file `sleet-den` at the end of the brag's row, over a line of its own. Gates card `sleet-den`, his recap line and his page; the Grown-ups corner ("found Sleet at the last post of the Barking Field"). Read from any reading, as `foundPuddle` is at Mama's count: a cat who met him before and says "Not today" still carries his "five" |
| `ch7Flew` | `true` | ch7 frame `f069`, the FLEW screen ("The fox says it FLEW. Sprinkle can't fly." / "They can't both be true."), every path: `sets: { ch7Flew: true }` on the frame, never on an option | sticky | only chapter 4's `fox-flew` link, `{ not: { ch4CaughtFly: false, ch7Flew: false } }`: her file draws `fox-flew` and `cant-fly` touching, "They can't both be true.", for every cat from that screen on; and the Grown-ups corner ("saw Sprinkle try to fly at the Old Bridge: the fox's "flew" can't be true (later chapters remember)"). Rereads of chapters 4 and 5 read exactly as before. Ch8: no `when` reads it; chapter 8's brag (`fox-brag`) joins the row it makes, `cant-fly` — `fox-flew` — `fox-brag` |
| `foundHail` | `true` | ch8 `f091` (told) or `f092` (kept), Hail's last screen ("Tell Sprinkle: five! And tell her I'm the BOUNCIEST!", with the slip-past Tap): `sets: { foundHail: true }` on the frame, never on an option | sticky | ch8: the hollow log's first option, "Who's in the log?", read "Go and see Hail again." with it (one option with `labelWhen`, `f062`; the spec has two options with `when`s); the chase's dogs, a pair by `foundHail` three times (with her, Hail at the wire: `f142`, `f144`, `f146`; without, `f141`, `f143`, `f145`), so from an earlier reading a tunnel-route cat sees her in the chase too; her card `hail-shapes`; her recap line and her page; the Grown-ups corner ("found Hail in the hollow log in the Barking Field (later chapters remember)"). Only chapter 8 offers her, so it is her found-here flag too (as `foundSleet`) |

- Saying no sets nothing ("Not today", looking up at the sky, counting fish out loud): a dragonet is
  found only by reading its scene to its last frame. Not flags: her dreams (`dreams.chNN`); Riffle's
  stone, the one gift in `E.GIFTS` (ch2 `f075`, in her nest for good); and `lessonClean` (a `when`
  key since ch5 that reads her lesson log: that lesson finished with no help; ch6's sixth mark,
  `f014`, ch7's seventh, `f032`, and ch8's eighth, `f020` (`lessonClean: 'ch08-fours'`), have a pair
  of lines each way).
- **No route flag.** Chapter 8 made no `ch8Route` (its spec, call 1): nothing after the weasel holes
  reads which way she went, the way home is round the near side of the Barking Field on both routes,
  and the book never says. A later chapter may not say she went through the tunnel.
- A chapter's page in her book says "found" only for a dragonet found in that chapter: a later
  chapter that offers one again sets its own found-here flag, as `ch5Roof` does (ch5 notes).
  `foundSleet` and `foundHail` are both, since only chapter 6 offers him and only chapter 8 her so far.
  Chapter 7 offers no dragonet and has no dragonet page; chapter 8's is Hail's.

## The Case File

Curls of bark from the leaning tree, kept along her nest's mossy edge: an eye for what she saw
herself, an ear for what she was only told ("Not true yet. Not false yet. A thing to check."). It
opens on any frame since ch4 `f069`; in chapter 10 she answers Reynard by picking cards (README 45).

| id | Mark | Line as lettered | Given | To whom | Answers and links |
|---|---|---|---|---|---|
| `four-a-night` | eye | Four gone every night. | ch4 `f062` | everyone | |
| `tidy` | eye | The thief leaves the pile tidy. | ch4 `f063`, the bark Tap | everyone | touched by `reed-pile` (ch6), whose other end `stash` touches (ch8): `tidy` — `reed-pile` — `stash` |
| `dug-earth` | eye | Freshly dug earth behind the pile. | ch4 `f063` | noticing only | |
| `scale` | eye | The 'scale' is smooth, like glass. | ch4 `f063` | everyone | touched by `glass` (ch8): "It’s not a scale. It’s GLASS." |
| `fox-flew` | ear | The fox says it FLEW. | ch4 `f066` | everyone | `answers: ['cant-fly']`, the only `answers` in the code. Drawn touching `cant-fly` once `ch4CaughtFly` or `ch7Flew` is true (`link.when: { not: { ch4CaughtFly: false, ch7Flew: false } }`, ch7's one edit to ch4): "They can't both be true.", for every cat who has read ch7's FLEW screen; touched at its other end by `fox-brag` (ch8): "He said FLEW. Now he calls it a story." |
| `fox-moon` | ear | The fox says the MOON was out on the storm night. | ch4 `f067` | everyone | no `answers`; touched by `heron-no-moon` (ch5) and, at its other end, `waffles-no-moon` (ch7): the middle of a row of three |
| `squall-shapes` | ear | Squall says two skinny shapes carry something to the tracks. | ch4 `f087a`, or ch5 `f033a` | only with `foundSquall` | |
| `sprinkle-scales` | eye | Sprinkle's scales are grey and bumpy. | ch4 `f098`, under the bridge | everyone | under the moss in her nest |
| `cant-fly` | eye | Sprinkle can't fly. | ch4 `f115`, her nest at night | everyone | under the moss in her nest; what `fox-flew` names |
| `prints-pile` | eye | Tiny prints in the dug earth behind the pile. | ch5 `f005` | noticing only | |
| `puddle-paws` | ear | Puddle says clever little paws picked up mice on the storm night. | ch5 `f064a` or `f129a` | only with `foundPuddle` | |
| `otter-fox` | ear | The old otter says the fox told him the dragon story. | ch5 `f069a` or `f134` | everyone | |
| `fur` | eye | Thin brown fur at the Crossing. Not cat. Not otter. Not fox. | ch5 `f074a` or `f139` | everyone | |
| `heron-no-moon` | ear | Patience says there was NO moon on the storm night. | ch5 `f084` | everyone | touches `fox-moon`: "One of them is wrong." |
| `heron-shapes` | ear | Patience says two small shapes crossed her mud, carrying something. | ch5 `f088` | everyone | touches `squall-shapes`: "Two saw them. The same two shapes?" |
| `prints-marsh` | eye | Tiny prints in the marsh mud. Much smaller than a cat's. | ch5 `f091` or `f092` | everyone | touches `prints-pile`: "The same prints." |
| `prints-tracks` | eye | The tiny prints run toward the train tracks. | ch5 `f093`, from the top of Riffle's pole | climbing only | touches `squall-shapes`: "Both lead toward the tracks." |
| `wisp-fox` | ear | Wisp drew a fox dropping something glittering in the reeds. | ch5 `f111a` | only with `foundWisp` | |
| `reed-pile` | ear | Sloshbank says ReedClan's pile is robbed too, and left tidy. | ch6 `f037`, the admission | everyone | touches `tidy`: "Two piles. Both left tidy." (at once: every cat holds both); touched by `stash` (ch8): "Two piles robbed. One stash." |
| `sleet-den` | ear | Sleet says the fox talks about 'a fine, dry den'. | ch6 `f065a`, at the last post | only with `foundSleet` (shown from the frame that gives it, as `squall-shapes`) | none of its own; touched by `fox-brag` (ch8) over a line of its own, "The same fine, dry den.", at the end of the brag's row |
| `coil-diggers` | ear | Coil says small diggers come and go under our pile. | ch6 `f097`, Coil's secret | everyone | touched by `tunnel` (ch7); under the moss in her nest on every path |
| `waffles-no-moon` | ear | Waffles says there was NO moon on the storm night. | ch7 `f011`, at the tower's foot ("You told me that on my second day…") | everyone | `link: { with: ['fox-moon'] }`: "Two say no moon. Only the fox says moon." Laid at the free end of Patience's row: Waffles, the fox, Patience. No `answers` (ch7 spec, call 2). Along the mossy edge |
| `my-count` | eye | My count: twenty-four gone in six nights. A dragon would take sixty. | ch7, the panel after the sum's choice: told `f040` (the Hollow's sand, "The Counts don't lie."), kept `f056` (under the Old Bridge, Riffle's whisper) | everyone (one id, both paths), but see below | none; under the moss in her nest on every path |
| `prints-sprinkle` | eye | Sprinkle's prints are huge. The thief's are tiny. | ch7 `f064`, Riffle's "Hers are as big as Patience's feet." | everyone | none (it does not touch `prints-marsh`); under the moss in her nest on every path |
| `tunnel` | eye | A tunnel under the back of the pile, too small for a dragon. | ch7 `f086`, at the mouth | everyone | `link: { with: ['coil-diggers'] }`: "Coil felt them. Now I've seen where." (an eye beside an ear); under the moss, so the link shows the Clan nothing |
| `hail-shapes` | ear | Hail says two skinny shapes cross her field every night, toward the tracks. | ch8 `f087`, Hail's "Are you following the skinny ones?…" | only with `foundHail` (`when: { foundHail: true }`: shown from the frame that gives it, as `squall-shapes`) | none (it lies alone: not beside `squall-shapes` or `heron-shapes`); under the moss |
| `fox-brag` | ear | Reynard calls ‘It FLEW off’ his little story. He wants the dry den. | ch8 `f117`, "He laughs, a soft little yip." / "Nobody saw a thing." | everyone | `link: { with: ['fox-flew', 'sleet-den'], line: 'He said FLEW. Now he calls it a story.', lines: { 'sleet-den': 'The same fine, dry den.' } }`: `link.lines` (chapter 8's one engine change) gives a partner its own line. `fox-flew` comes first in `with`, so the brag joins FLEW's row before the den joins the brag (`E.caseFile` never merges two rows). Under the moss |
| `stash` | eye | The weasels have a stash: our prey, and ReedClan’s. | ch8 `f128`, "Mice and voles, in tidy rows…" | everyone | `link: { with: ['reed-pile'], line: 'Two piles robbed. One stash.' }`: the end of the two robbed piles' row; under the moss |
| `glass` | eye | A heap of glass in the weasels’ stash, just like the ‘scale’. | ch8 `f130`, "It's not a scale," you whisper. "It's GLASS." | everyone | `link: { with: ['scale'], line: 'It’s not a scale. It’s GLASS.' }`: a new row of two; under the moss |

She holds 20 to 28 cards (18 to 24 before chapter 8, 17 without `my-count`; three more for everyone,
and a fourth with Hail), in the order she found them (Hail's, then the brag, the stash and the glass).
**Moonlight**: two witnesses against the fox, Patience (ch5) and Waffles (ch7), laid in one row:
Waffles' ear, "Two say no moon. Only the fox says moon.", the fox's ear, "One of them is wrong.",
Patience's ear. The brag says "by moonlight" again, but `fox-brag` touches FLEW and the den, not this
row. **Flew**: `cant-fly` — "They can't both be true." — `fox-flew` — "He said FLEW. Now he calls it a
story." — `fox-brag`, for every cat who read ch7's FLEW screen, and for a Sleet cat — "The same fine,
dry den." — `sleet-den` at its end, a row of four (without `ch7Flew`, only a reread oddity, `fox-flew`
— `fox-brag`). **The scale**: answered in her own words, `scale` — "It’s not a scale. It’s GLASS." —
`glass`; "Tower glass." is said (`f131`); her piece lies under the moss and the fox's "scale" still lies
behind the back row. **Two piles, one stash**: `tidy` — "Two piles. Both left tidy." — `reed-pile` —
"Two piles robbed. One stash." — `stash`. **The count**: `my-count` holds twenty-four and sixty as her
own count; the twenty-eight and the weasels' fourteen and fourteen are said aloud, not cards. **Who
came**: named at last, two weasels, Snip and Snatch; but no card shows the thieves themselves (cards.js
draws paws, prints and shapes), and the old clues (the fur, the tiny prints, the skinny or small shapes,
the clever little paws, the small diggers, the tunnel) are joined to them only in words ("Thin brown
fur, like the tuft at the Crossing. Tiny feet, like the prints in the marsh."), not on her file; the
cards that say weasel are the stash's and the glass's. **The dry den**: the brag says whose it is to be,
and `sleet-den` lies at its end for a Sleet cat; nobody on screen has said the den is Sprinkle's nook
(Snip: "Under the Old Bridge!"). The link lines judge nothing, and nothing is "answered" yet: no card of
chapter 8 has `answers` (chapter 4's `fox-flew` still holds the only one), and judging is the
Gathering's. **Under the moss**: nine on every path once chapter 8 is read (eight without `my-count`),
ten with Hail's card: Sprinkle's two, Coil's, chapter 7's three eyes, and all four of chapter 8's (the
proof is kept for the Gathering, "Not a word to the Clan yet."; Hail's is a dragonet's), with her glass
in its leaf beside them. Along the mossy edge, what lay there after chapter 7 (twelve to eighteen
pieces). Not cards, on purpose: the twenty-eight, the guards' nothing, Tallyheart's bumps in the night,
the tunnel's far end, the dogs, the weasels' squabble and their fourteen, "Nobody's land", the chase;
and from earlier chapters the dream, "They always come in threes", the young tom's "Except at night",
"I feel feet. Not faces.", "Foxes never leave anyone alone", ch7's dish, "always the back", Glintstar's
"A good count", the climber's tracks, the sniff and the listen. Module-1's table has no clue left to
give: chapter 9 lays out her case file for the Gathering, and in chapter 10 she answers Reynard by
picking cards.

## The dragonets

Seven, named for the weather: four sisters (Sprinkle, Wisp, Hail, Dew) and three brothers (Squall,
Puddle, Sleet). Each stays where the storm put it ("Mama says: stay where you land"), greets her with
a riddle that is a Count she knows, and sends Sprinkle "five." Sprinkle keeps the tally in the mud:
chapter 3's six forepaws, drawn again in chapter 5 with her own, one lit for each of the clutch
accounted for (a screen only a cat who found a dragonet in chapter 5 has seen). Chapter 6 carries
Sleet's "five" to her in words, and draws no tally. Chapter 7 reads no found flag: no tally, no
"five". Chapter 8 reads each found flag once, where that dragonet's clue comes true, and for her news to
Hail; Hail's "five" is said to her and her friend, and not yet carried to Sprinkle; no tally.

| Name on screen | Looks and manner | Where | Flag | Riddle | What it saw, and gives |
|---|---|---|---|---|---|
| **Sprinkle** (she) | mist-grey, ridged scales; as big as a heron; shy; burps mist; her right wing droops | under the Old Bridge, at the very back, beside Coil's stone leg | none: everyone, ch3 | none. She counts with her: ten fish a meal (2 × 5), six forepaws in the mud (6 × 5) | cannot fly; "I'm not shiny anywhere", so the scale is not hers; has eaten only Riffle's fish (and one vole, kept path); holds a plain grey pebble, smooth as an egg (module-1: chapter 10's mist stone). Coil watches her sleep ("It's RUDE"); of Sleet, "He ALWAYS says that.", or "My eldest brother LOVES long grass." Ch7: her storm-night prints by the drag marks, big, five long claws, "as big as Patience's feet" (`prints-sprinkle`); she tries to fly and cannot ("Her good wing goes up. Her hurt wing won't." "Oh. Not yet."), which gives `ch7Flew`; four a night would leave her "HUNGRY"; "For once, I'm GLAD I can't fly!" Ch8, kept only, by day: she hears of the tunnel ("Be careful. And come back and TELL me."); told, not on screen. Her hurt wing "still won't lift" (bedtime) |
| **Squall** (he) | slate grey with yellow flecks like sparks; the littlest and the loudest; no bigger than she is; his roar ends in a hiccup | the roof of the tallest tower, hugging the pole of the red light, "GUARDING" against airplanes he takes for giant dragons | `foundSquall` (and `ch5Roof`) | "Seven dragonets hold up one forepaw each. Five claws on every forepaw. How many claws does Mama count?" (7 × 5) | every night two skinny shapes go sneaking along past camp, carrying something to "the long shiny lines": the train tracks |
| **Puddle** (he) | blue-grey, feet much too big; cheerful; says he is a log; sinks, and pops up again | under the otters' ferry raft; the otters feed him ("Logs get LOTS of fish") | `foundPuddle` | "Four logs in this raft. I've bumped my head ten times on every one. How many bumps?" (4 × 10) | the storm rolled him over a garden: in one flash, a heap of mice and "something with clever little paws, picking them up. Very tidy." |
| **Wisp** (she) | so pale you can nearly see the reeds through her; silent; on one leg; believes she is a heron | Patience's reeds, in the marsh; half of every fee Patience takes is hers | `foundWisp` | drawn in the mud: seven herons, each on one leg; how many legs in the water? (7 × 1) | drew a fox with something small and shining falling from its mouth, and a ring of ripples; where it fell is deep green water now |
| **Sleet** (he) | silver-white, a cool blue-grey shade in his ridges, a paler belly, round bold blue eyes under bossy brows, two soft horn nubs, five frost-white claws a forepaw; about Sprinkle's size; the eldest, bold and bossy, "in charge of EVERYBODY"; a tuft of long grass on his head | the long grass of fox country, just past the last post of the Barking Field, flat on his belly, spying on the fox ("The fox has never once seen me. I'm GRASS.") | `foundSleet` | his roll call: "There are seven of us. When Mama calls, every one of us shouts HERE three times. HERE! HERE! HERE!" How many times does Mama hear HERE? (7 × 3) | far out in the grass the fox talks to himself, "'Such a fine, dry den,' he says. Over and over. VERY boring."; nobody answers his roll call now; he won't leave his post; "Tell Sprinkle: five. And that I'm in charge." |
| **Hail** (she) | white with grey speckles all over (round, like hailstones' shadows), pale grey ridges and small folded wings, a creamy belly, two soft horn nubs, big round dark eyes with a big shine, eager brows, a bouncy curl in her tail; about Squall's size (sitting, no taller than she is); bouncy, full of questions ("Do I look like a dog? Why is your tail so SWISHY? Can I touch it?") | the hollow log far inside the Barking Field's fence (drawn there since ch2); the dogs think she is a dog ("So now I'm a DOG.") | `foundHail` | "Three dogs, and me. That's four of us. Four paws each! How many paws go round and round this field?" (4 × 4) | every night two skinny shapes squeeze under her fence, "With MUDDY mice. Off to the long shiny lines!" (`hail-shapes`); she leads the dogs round in a big, silly circle so the cats slip past, and in the chase sends them at the weasels; "Tell Sprinkle: five! And tell her I'm the BOUNCIEST!" |
| Dew (not met; she; renamed before chapter 9 names her) | pearly green; sweet and sleepy | an oak hollow in GroveClan's woods | chapter 9's | to come | knows the moss that helps a dragon's wing (module-1: found gathering the oak moss) |

- **Sleet's labels**: "The long grass" while he is bent grass or a tail (`f051a`, and "HMPH!" after a
  no), "The silver-white dragon" (the chapter's `names`; his riddle and its help too) until "I'm
  Sleet. The eldest. I do the roll call." **Who has met him**: Riffle, on every path that found him;
  Tallyheart too on the told path ("The eldest… And the bossiest."). **What he knows**: Sprinkle is
  safe under the Old Bridge, and where each sibling she has found is (her news, one balloon by her
  flags). His page in her book (pose `puff`): "Silver-white, the eldest, and in charge of EVERYBODY.
  He does the roll call." Not found: she saw his tail, and Sprinkle names nobody.
- **Hail's labels**: "A white head" for her first balloon, from the log (`f062`, "Ooh! Visitors!"), "The
  speckled dragonet" (the chapter's `names`; her riddle and its help too) until "I'm Hail! Mama says
  stay where you land." (`f084`). **Who has met her**: on the field route only, Tallyheart on the told
  path ("Another one!") or Riffle on the kept ("ANOTHER dragon!"). **What she knows**: Sprinkle is safe
  under the Old Bridge; with any found flag, "And I've found more of you!" "MORE? WHO? Tell me
  EVERYTHING!" "You tell her, name by name." (`f086`/`f087`). Her page in her book (pose `bounce`):
  "White with grey speckles, and the bounciest of the clutch." / "{name}paw found her in a hollow log in
  the Barking Field, where the dogs think she is a dog." / "She says five, and that she’s the BOUNCIEST.
  Five more claws, counted." (the spec says one line: "… the bounciest of the clutch. She lives in a
  hollow log in the Barking Field, where the dogs think she is a dog."). Not found: a tunnel-route cat
  only hears the dogs from below; on the field route "Not tonight." leaves a white head that ducks back
  into the log.
- **Still to find, and where.** *Dew*: chapter 9's, gathering the oak moss in GroveClan's woods
  (module-1). *Squall*: the roof, offered once more in chapter 9 (ch5 notes; "dew from the glass towers"
  can take her there). *Wisp*: Patience's reeds in the marsh, chapter 9 (ch5 notes; the reed root from
  ReedClan). *Puddle*: under the ferry raft, if a later chapter takes our cat aboard (the river mint
  from the Holt, or chapter 10's Moon Ferry). *Sleet*: the last post, not offered in chapter 8. *Hail*:
  chapter 8's field route only, on a reread. Any chapter that offers one again sets a found-here flag of
  its own (`chNHail`, `chNSleet`, …), and the earlier chapter's recap line and page then read
  `{ foundHail: true, chNHail: false }`, as chapter 4's did for `ch5Roof`.
- The one not met is as module-1 has her. **Dew is renamed before chapter 9 names her** (an exact
  Warriors name) and is no longer "the tiniest": Squall is the littlest. Puddle's name is an open
  question in the README, and Sleet's waits beside it ("Sleet-" is a prefix on the Warriors wiki's
  Names page, from an Instagram post, with no cat behind it). Module-1's sample riddle for Squall
  ("Five claws on each front foot") was not used. The riddles so far are 7 × 5, 4 × 10, 7 × 1, 7 × 3
  and 4 × 4 (and Sprinkle's 2 × 5, 6 × 5): a new one picks another fact.
- A missed dragonet can be found until the full moon; all seven get home either way, and finding all
  seven earns the eldest Mistscale's bow (README 19, 20).

## The cast and their names

A balloon carries its speaker's label, so a character has a stand-in label until the story names it.

| Who | On screen | Named |
|---|---|---|
| Her | `{name}paw` to the Clan; her pet name to Waffles, always | ch1 |
| Princess Waffles | a fluffy white pillow cat nineteen floors up her old tower, who has never touched grass and never stops talking. In ch7 a witness: up ALL night "with my nerves" (the moon calms them); the little room that goes DING is "TERRIFYING"; "My Tall One says I'm DRAMATIC. I'm not. I'm SENSITIVE."; she sees the Tall One fill the dish every morning | ch1 |
| The Tall One | slippers, pajama legs and a hand; never a face | ch1 |
| Tallyheart | "The ginger cat" until "I'm Tallyheart. I count things." Big ginger tabby, torn left ear (no story given yet) | ch1 `f030` |
| Glintstar | the silver leader on the dry stone fountain | ch1 |
| Riffle | "An otter pup" for one balloon, then "I'm Riffle!" His "Granny" is a title | ch2 |
| Coil | named since ch2 (a reputation: "Nosy old thing", "he trades them like pebbles"), seen in ch6: a northern water snake in a gap low in the Old Bridge's stone leg, beside Sprinkle's nook. Brown with darker cross-bands, a cream belly, a rounded head smaller than a cat's, two round eyes shiny as wet pebbles that never shut (no eyelids), mouth always shut, no tongue or fangs; very polite, very slow; his body runs sideways along the wall's foot, away from the cats. "A voice" while he is a stone (`f074`), "The snake" at first sight (`f076`, the chapter's `names`), Coil from Riffle's "Coil," (`f077`). In ch7 his "Quietly." as a stone (`stone`) is labelled "Coil" (ch7 spec, call 19) | ch2; seen ch6 |
| Murmurpaw, then Murmurchime (`{Murmur}` in the text) | the small tortoiseshell who mutters "Mice…" in her sleep: "A small apprentice" (ch1), "A voice in the dark"; named by the grey tom, then by Glintstar when she passes the Warrior Counts. In ch6 the third cat of her first border patrol ("I'm a WARRIOR!"), and on the first watch | ch3 `f004`, `f024` |
| Sprinkle | "A small voice", "The dragon", "A muffled voice", then "I'm Sprinkle. A Mistscale dragonet."; "The tail" whenever she hides her face under it. Her "Mama" is a title | ch3 `f060` |
| Reynard | "The fox" until Glintstar says "You are at our border, Reynard." Not drawn in ch6 or ch7: only his old smell, Sleet's telling, and his name. Drawn again in ch8 (the caption names him: "Along the tracks trots Reynard"), only ever up on the tracks (`rails`), far above her, never looking her way and never seeing her; trots (`trot`, new), admires and fluffs his tail (`comb`), `flap` for "It FLEW off"; vain, charming, pleased with himself: "Good evening, my clever little paws." "Weasels." (a sigh) "Nap now, my little sneaks. Rob later. And keep it TIDY." | ch4 `f036` |
| Squall | "The little dragon" until "I'm Squall. I'm the littlest. And the LOUDEST." | ch4 `f085a` or ch5 `f031a` |
| Patience | the heron; Riffle names her before her first balloon | ch5 |
| Puddle | "The big-footed dragon" until "I'm Puddle." | ch5 `f062a` or `f127a` |
| Wisp | never has a balloon; Patience says her name for her | ch5 `f106a` |
| Sloshbank | ReedClan's speaker at the border: a big, heavy, stern brown tom, solid brown with darker legs, bigger than Tallyheart, his belly fur clumped wet and always dripping (*Drip.*), big muddy paws; proud ("ReedClan does not LOSE prey"). Tallyheart says his name as they meet | ch6 `f026` |
| Sleet | "The long grass", then "The silver-white dragon", until "I'm Sleet. The eldest." | ch6 `f057a`/`f058a` |
| Good Boy | the shaggy dog (variant 1), "the biggest dog": "I'm GOOD BOY! That's my NAME!" ("That's what their Tall Ones shout at them all day."); "The shaggy dog" until then; a tunnel-route cat hears him only asleep, from below ("Who's a Good Boy? ME."); in the chase his "SQUIRRELS!" (without Hail; with her, it is hers), and "BYE, RUDE SQUIRRELS!" is his balloon labelled "The dogs", on both routes | ch8 `f059` |
| Drop It | the spotty dog (variant 2): "I'm DROP IT!", "I AM Drop It!"; "The spotty dog" until then; from below, "Drop it," … "That's my NAME." | ch8 `f059` |
| Hail | "A white head" (`f062`), "The speckled dragonet" (the chapter's `names`), then "I'm Hail!" | ch8 `f084` |
| Snip | a weasel, she, Snatch's sister: long and thin, short legs, small round ears, a pointed nose, black bead eyes; lighter golden-brown, a white chin and bib, a pale tail tip; a little smaller than Snatch, both "half your size"; the squeaky one. "A weasel" (the chapter's `names`) until the caption tells them apart: "Snip is the squeaky one. Snatch is holding a mouse." (`f102`); Snatch says her name first ("A vole is just a fat mouse, Snip.") | ch8 `f101`, `f102` |
| Snatch | a weasel, he, Snip's brother: darker chestnut, a cream belly, a black tail tip, a round full tummy; ALWAYS holding a mouse, so the slow one in the chase ("NEVER!"); "A weasel" until `f102`; Snip says his name first ("I carried MORE than you, Snatch!"). Both are funny, greedy and quick, never cruel: no teeth or fangs ever drawn, never a snarl | ch8 `f101`, `f102` |

- **Chapter 7 names nobody new**; everyone on screen has spoken before, and it has no `names` map.
  **Chapter 8 names five**: Snip, Snatch and Hail (`names: { snip: 'A weasel', snatch: 'A weasel', hail:
  'The speckled dragonet' }`), Good Boy and Drop It (the page's dog labels by variant until then). On
  screen in ch8 besides: Tallyheart, Glintstar, {Murmur}chime (kept: "Nothing. We saw NOTHING. Not one
  thing."), the old tom, the grey tom ("Where WERE you? …Do the paw thing."; "EIGHT? I only ever use
  four."), and on the kept path Riffle, Sprinkle and Coil (his "Quietly." in `stone`, labelled "Coil").
- **Unnamed on purpose:** the old tom ("A grizzled old tom" in ch1, "the old tom" since; an elder by his
  own word in ch5; asleep on his pinecone in ch6); the skinny grey tom, her one denmate now ("the grey
  tom" in ch7, where they count their whiskers); the black-and-white apprentice ("A cheeky apprentice",
  "An apprentice"); "Somebody", who scoffs at the border; the old ferry otter and two more; the third
  dog, "The tiny dog" (variant 3), who "just barks. He forgets his name a lot."; the duck; the guards
  (Clan cats by coat); Sloshbank's patrol, labelled by coat: "ReedClan she-cat" (sleek, dark grey-brown,
  a pale belly, calm amber eyes; never speaks) and "Young ReedClan tom" (lanky, sandy, big ears, eager:
  "Except at night."; she sits on his tail; he waves), and two more marsh coats in the watchers' picture
  only (smoky grey and fawn, "A ReedClan cat"); the starry cat (a Clan cat drawn in starlight, `starry:
  true`: pale blue-white, a little see-through, small stars inside, a kind face, nobody she knows; "one
  of the cats who came before"; her balloon says "The starry cat", a description that stays one).
  Balloon labels such as "Grizzled old tom" are the page's (`app/ui.js`).
- **ReedClan's coats.** Every ReedClan cat drawn since ch6 has a sleek, wet coat and mud to the
  elbows, in marsh coats no player's cat and no CrystalClan cat can have (`sloshbank`, `reedclan` 1
  to 4). Chapter 5's three on the far log were Clan coats, far off and faceless; Sloshbank's "Three of
  our patrols watched" makes them three of nine (ch6 spec, known issue 11).
- **The thieves** were "two skinny shapes" (Squall; Hail too), "two small shapes" (Patience), "something
  with clever little paws" (Puddle; Reynard calls them "my clever little paws"), "Somebody small", "small
  diggers" (Coil), "somebody SMALL", "somebody with TINY feet", "Whoever dug it" (ch7), "Something
  RUDE" (Riffle's Granny, kept, ch8), until "Weasels." at the holes in ch8: Snip and Snatch, named on
  screen, both kept by decision 21: "Snip-" is a Warriors name prefix (Snipkit; in the README's open
  questions beside Puddle and Sleet), and "Snatch" has an adult slang sense (ch8 spec, known issue 7:
  Aron's to change; the README does not note it yet).
- **Retired, because the books have them:** Drizzle is Sprinkle (README 38), Thunder is Squall (43),
  Russet is Reynard (44), Fog is Wisp (a call under 46), Bogwade is Sloshbank (ch6's brief: Wings of
  Fire has a Bog, the MudWing Chameleon pretends to be). Chapter 2's and 3's notes keep old names.
  Cleared and unused for a new ReedClan cat: Plashwick (first), Wadebank, Ploppaw. "Slosh" is no
  longer free for Puddle (it echoes Sloshbank).
- **Not on screen yet:** Thymeleaf, GroveClan, "the Holt" by that name, Gathering Island, the Moon
  Ferry, the grown Mistscales, Dew.

## The Counts so far

One place in each warm-up is adaptive: it goes to the fact of that table that was hardest for her
last time (`warmHard`). Every lesson mixes both orders (3 × 2, then 2 × 5).

| Ch | Count and picture | Skip-count Taps | Warm-up, then the lesson's facts | Story questions and riddles | Marks |
|---|---|---|---|---|---|
| 1 | the 1s: tails, one per cat | none | 3 × 1, 1 × 5, 6 × 1, 1 × 1, 9 × 1, 1 × 10, 4 × 1, 1 × 7, 8 × 1 | none | 1 |
| 2 | the 2s: ears | five cats on the rim: 2 to 10 | 1 × 4, 7 × 1; then 3 × 2, 2 × 5, 4 × 2, 2 × 1, 5 × 2, 2 × 6, 7 × 2, 2 × 2, 2 × 8, 9 × 2, 2 × 10 | the pile in pairs: 10 × 2, 8 × 2; the warrior's check: 2 × 8 | 2 |
| 3 | the 5s: claws on one forepaw | five forepaws on the rim: 5 to 25; bedtime, her own forepaws: 5 to 20 | 4 × 2, 6 × 2; then 4 × 5, 5 × 2, 1 × 5, 5 × 5, 5 × 6, 5 × 8, 5 × 3, 9 × 5, 7 × 5, 10 × 5 | the pile: 9 × 2, 7 × 2; Sprinkle's dinner: 2 × 5; six forepaws in the mud: 6 × 5 | 3 |
| 4 | the 10s: claws on both forepaws | five cats on the rim: 10 to 50; Squall's forepaw: 5; the promise: 10, 20, 30; bedtime: 10 to 50 | 3 × 5, 5 × 7, 2 × 5; then 4 × 10, 10 × 2, 1 × 10, 5 × 10, 6 × 10, 10 × 8, 10 × 3, 10 × 9, 7 × 10, 10 × 10 | the pile in rows: 3 × 10, 2 × 10; tonight's pile: 4 × 10; Squall: 7 × 5 | 4 |
| 5 | the 9s: a cat's nine lives, counted on her claws, nine out and one tucked in | five cats on the rim, one claw tucked at each tap: 49 down to 45; four paws aboard; nine claws in the log; a forepaw for each dragonet met; the mud tally by fives; bedtime: 9 to 45 | 10 × 7, 5 × 10; then 2 × 9, 9 × 10, 4 × 9, 9 × 1, 9 × 6, 3 × 9, 9 × 8, 5 × 9, 7 × 9, 9 × 9 | the pile: 3 × 10; Riffle's seven answers: 7 × 2; the heron's bill: 9 × 2; the catch: 4 × 5; Puddle: 4 × 10; Wisp: 7 × 1 | 5 |
| 6 | the 3s: patrols, three cats each | five patrols on the path: 3 to 15; at the tree, five taps on Tallyheart, each a Count she names and our cat answers (three tails, six ears, fifteen claws, thirty claws, twenty-seven lives); Sleet's forepaw: 5; bedtime, six guard patrols: 3 to 18 | her hardest 9s fact from ch5 (7 × 9 when none; never 3 × 9, 2 × 9 or 9 × 10), 3 × 9; then 1 × 3, 3 × 2, 3 × 3, 3 × 5, 6 × 3, 7 × 3, 3 × 8, 3 × 4, 3 × 7, 8 × 3 | the pile: 3 × 10; four patrols: 4 × 3; the watchers: 3 × 3; the guards: 3 × 6; Sleet: 7 × 3 | 6 |
| 7 | the 6s: whiskers on one cheek, six in two rows of three, a close-up ("Six is two threes."; the game's cats keep two whiskers a side, and no other panel counts six) | the back row's four gaps: 1 to 4; Tallyheart's cheek, a row a tap: 3, 6; five rim cats' cheeks: 6 to 30; at the tree, six taps on Tallyheart, each a Count she names and our cat answers (six tails, twelve ears, thirty claws, sixty claws, fifty-four lives, eighteen guards); bedtime, the grey tom's face and hers, a cheek a tap: 6 to 24 | her hardest 3s fact from ch6 (7 × 3 when none; never 1 × 3, 3 × 2, 3 × 9, 3 × 10 or 3 × 4), 4 × 3; then 2 × 6, 5 × 6, 6 × 6, 6 × 3, 6 × 4, 6 × 7, 6 × 8, 4 × 6, 7 × 6, 8 × 6 | the pile: 3 × 10; the twenty-four: 4 × 6 (`table: 4` on the fact); the sixty: 10 × 6 (told, Tallyheart's, in the Hollow; kept, Riffle's, under the Old Bridge) | 7 |
| 8 | the 4s: paws, four on every cat, two front and two back ("A four is two twos."); the lesson's picture is the table-4 picture as drawn since ch1 (that many cats side-on, four paws each, five to a row) | Tallyheart's paws, a pair a tap: 2, 4 (one cat close, kept on the next page under a big 4); the rim's five cats padding past, four paws a tap: 4 to 20; at the tree, seven taps on Tallyheart, each a Count she names and our cat answers (four tails, eight ears, twenty claws, forty claws, thirty-six lives, twelve guards, twenty-four whiskers: "That's MY count!"); bedtime, the grey tom's paws and hers: 4, 8 | her hardest 6s fact from ch7 (6 × 8 when none; never 1 × 6, 2 × 6, 3 × 6, 4 × 6, 6 × 9 or 6 × 10), 2 × 6 ("Two cheeks? One whole cat."); then 2 × 4, 4 × 5, 4 × 4, 3 × 4, 4 × 7, 4 × 8, 4 × 6, 7 × 4, 8 × 4, 10 × 4 | the pile: 3 × 10; the twenty-eight: 4 × 7 (seven nights of four marks, two and two, `ch08-gone`); Hail: 4 × 4 (three dogs and her, `ch08-hail`); Snip's share: 2 × 7 (two marks a night in the mud: told `ch08-snip`, Tallyheart's help; kept `ch08-riffle`, Riffle's voice throughout) | 8 |

- **The Warrior Counts**, as Glintstar said it (ch3 `f018`): "To become a warrior, a cat answers
  every Count up to ten times ten, and gets nine in every ten right." Asked aloud that morning:
  7 × 8, 9 × 6, 2 × 9, 6 × 5, 10 × 10. Murmurchime's own is 9 × 9: "eighty-one mice. No! Not mice."
  Chapter 6's warrior moment, with no promise: "A border patrol is a warrior's work. And today,
  you're on one." Chapter 7's, said once on both paths, with no promise: "A warrior who knows {their}
  Counts can't be fooled." Chapter 8's, said once on both paths, with no promise: "A night trail, a fox
  and a stash. You stayed calm, and took one piece, for proof. That's how a warrior thinks."
- **Tallyheart's words.** "Hop" by twos, fives and tens; fives land on "a five or a zero", tens on "a
  zero"; a nine is "one less than a ten": "Hop, then tuck", with "the two numbers in a nines answer make
  nine" as a check. A warm-up is always "to wake up your whiskers." The threes: "A patrol is three
  cats"; "Hop by threes, like you hopped the twos"; "You already know half the threes" (the five she
  knew, one from each Count); "For a new one, start from one you know, and hop" (a step-off: "Two
  patrols made six. Hop three more."); a fact turned round is "the same fact"; help is "Let's hop it
  together." Why the Counts matter, said once: "Eighteen guards. That's what the Counts are for. In the
  morning, your count tells us if it worked." The sixes: "Six is two threes" ("So a six is a three,
  TWICE?" "Exactly."); "You already know most of the sixes. One from every mark on this tree."; "Only
  four are new. For those, start from one you know and hop, or double the threes."; "That's doubling." A
  doubling question opens with every cheek's top row lit and says its way ("Twelve and twelve:
  twenty-four."; "Twenty and twenty make forty. One and one make two. Forty-two."); 6 × 6 steps off
  5 × 6, its five cheeks lit; help scratches six marks for every cheek, three and three, and hops by
  sixes. The fours: "Four a night? That's a job for the fours."; "Four paws on every cat."; "Two front
  paws. Two back paws. A four is two twos." ("Two twos! Like a six is two threes!" "Exactly. Doubling,
  AGAIN."); "Hop by fours."; "You already know most of the fours. One from every mark on this tree.";
  "Seven of them you knew already. Only three are new: the paws of four cats, seven cats and eight cats.
  For those, hop from one you know. Or count the front paws, and double it!" (never "four sevens").
  4 × 4 and 4 × 7 open unlit and say their doubling ("Front paws: fourteen. Back paws: fourteen more.");
  4 × 8 steps off 4 × 7, seven cats lit (`lit: 28`); help scratches four marks for every cat, two and
  two, and hops by fours, then says the fact's way ("Ten and ten make twenty. Four and four make eight.
  Twenty-eight."); "That's the fours."; the eighth mark: "Paws. That's your eighth Count."
- **The tree.** One claw mark per Count ("One day, there'll be ten marks here"), each but the newest
  drawn deeper; eight now (ch8 `f019`, "An eighth claw mark.", *SKRITCH!*), two rows of four, as
  `markSpots` has always laid eight (chapter 7's seven were four and three); nine would be four, four
  and one. A mark glows after three Training Hollow rounds of its Count without help.
- **The Training Hollow** offers each Count she has learned: Tails, Ears, Claws, Both forepaws, Nine
  lives, Patrols ("Patrols · the 3s"; Tallyheart says "A round of threes."), Whiskers ("Whiskers · the
  6s"; "A round of sixes. Ready? Here we go."), Paws ("Paws · the 4s"; "A round of fours. Ready? Here we
  go."). A round is that table's ten facts, both orders mixed, up to three hard ones early; the 6s'
  rounds ask in the lesson's cheeks (one to ten of them) and scratch the sand in two rows of three a
  cheek; the 4s' ask "How many paws?" in one to ten cats and scratch the sand two and two. Each full
  round earns the next of fourteen nest treasures (`E.TREASURES`), round and round. The elders' claw
  trick for the 9s is written in ch5's notes and is not built.
- **A Count is learned when its own set is finished** (`E.learnedCounts`, changed in ch6). Its own
  set is the first chapter's to use its `table`, the one with the most facts there (`E.countSets`):
  `ch06-threes`, not `ch06-four`, whose four patrols come before the lesson and teach nothing;
  `ch07-sixes`, not `ch07-gone` (table 6, one fact: the twenty-four; both sixties are on the 10s); and
  `ch08-fours`, not `ch08-gone` or `ch08-hail` (table 4, one fact each). Snip's share (`ch08-snip`,
  `ch08-riffle`) is on table 2, which stays `ch02-ears`'. Only then does the Hollow offer it and the tree
  get its mark (ch7: the seventh mark and "Whiskers · the 6s" only after the lesson; ch8: the eighth and
  "Paws · the 4s"). No set yet is on table 8 or 7.
- **The twenty-four and the twenty-eight are filed under the 4s.** Each fact carries `table: 4` (so the
  help hops by fours, a night at a time), and the answer is logged with it (`E.tableOf`). Since chapter
  8 the Grown-ups corner heads the table "Paws · the 4s" (`E.countFor(4)` finds `ch08-fours`; it said
  "The 4s" before). A miss of the twenty-eight is a 4s and a 7s hard fact, and of Snip's 2 × 7 a 2s and a
  7s one (run in Node).
- **Story questions borrow** fillers from the lesson, asked in their own voice and picture (`fillFrom`,
  `fillVoice` and `fillPicture: 'borrower'`, the easiest first); a fact asked with `check: true` (the
  pile's 3 × 10, the lessons' 8 × 3, 8 × 6 and 8 × 4) never clears a miss and is never timed for
  `E.hardFacts`. Ch7: the pile and both sixties borrow chapter 4's tens (1 × 10, then 10 × 2, on rows or
  nights of marks); the twenty-four borrows the lesson's easy sixes in its cheeks (2 × 6, then 6 × 3;
  never 6 × 6, `avoid`); the warm-up borrows chapter 6's threes ("One from yesterday."). Ch8: the pile
  borrows chapter 4's tens again; the warm-up borrows chapter 7's sixes in cheeks ("One from
  yesterday.": 6 × 3, then 5 × 6, or 4 × 6 when the hard one was 5 × 6; never 6 × 6); the twenty-eight
  borrows the lesson's easy fours as nights ("An easy one. Two nights.": 2 × 4, then 4 × 5; never 4 × 4,
  nor 3 × 4 first); Hail's riddle borrows them as dogs ("An easy one! Two dogs.", three dogs: 2 × 4 and
  3 × 4); Snip's share borrows chapter 2's twos as nights (2 × 1, then 2 × 2). Known slips, kept and
  pinned by tests (ch8 spec, known issues 13 to 15): after three misses Hail's riddle can lend its own
  4 × 4 back as "An easy one! Four dogs."; after two or three misses the warm-up can lend its own 2 × 6
  as "One from yesterday."; a missed one-night filler of Snip's share opens with "Two, four…".
- **The 6s lesson never notices speed** (ch7 spec, known issue 14): every one of its ten facts has a
  right line of its own, which wins over `fast` and `praise`, so "Quick as a pounce!" plays only on a
  filler and in the Hollow. In chapter 7 speed is noticed once, on the warm-up's first question.
  **The 4s lesson does** (answered in ch8): 3 × 4 and 10 × 4 have no right line of their own, so a quick
  answer there gets "Quick as a pounce!" or "You knew that one before I finished asking." (after a miss,
  "Ha! You didn't even look at the sand that time."), a slow one the praise ("Two twos make a four!",
  "Four more, every time!"); with 4 × 5 they are the only lesson facts timed on themselves.
- **Still to teach**: the 8s (ch9, a spider's legs: double the 4s) and the 7s (ch10, sunrises in a
  quarter-moon), as module-1's Counts table has them. Of the 8s only 7 × 8 and 8 × 8 (either order) are
  new: she knows one from every mark on the tree, exactly eight (8 × 1, 2 × 8, 5 × 8, 10 × 8, 9 × 8,
  3 × 8, 6 × 8, 4 × 8). Once chapter 9 teaches 7 × 8, only 7 × 7 is new of the 7s.

## Places and what is drawn

Eighteen sets: the first nine are in `app/art/scenes.js`, the rest in `app/art/sets/`. Chapter 7
added none: the pile gained two cameras (`rear`, `hole`), the options `tap`, `tunnel` and `tracks` and
the anchor `arch`; the bridge a camera (`print`) and the options `tap` and `compare`; the hollow
`compare`. Chapter 8 added one, `tracks` (`app/art/sets/tracks.js`, the trail's end and the tunnel's
inside); the field its night look, `moon`, `tap: 'path'` and twelve spots; the pile the anchor `poke` and
`tap: 'mouth'`; the den `moon: 8` and `glass`, and room in the nest. Every new option is off by default
and every new spot additional, so chapters 1 to 7 draw as they did (the chapter 7 golden and the sets'
fingerprints).

| Set | In the story | Chapters | A later chapter keeps |
|---|---|---|---|
| `room` | her old home behind the glass patio door, ground floor of the tallest tower | 1 | |
| `tower` | the tower from the ground, and Waffles' balcony | 1 to 5, 7 | the red light on its roof (`light`); the roar from the roof (`roar`); a wind chime on the balcony since ch3 (`chime`), rung in words in ch6's dream and on every ch7 panel; ch7's staging: `up` where both speak (our cat at `foot`, Waffles at `railing`), `balcony` and `balcony-close` for Waffles alone (`puffed: true` for "She fluffs herself up.") |
| `garden` | her old garden: lawn, fence, lamp post, the gap in the hedge, the patio step | 1 to 4, 7 | the dish on the step and the door open a crack (`dish`); ch7: the dish full at morning |
| `camp` | CrystalClan's camp behind the hedge: bramble dens, ferns, the dry stone fountain | 1 to 4 | Glintstar speaks from the fountain top; `crowd` is the whole Clan |
| `hollow` | the Training Hollow: sand under the old leaning tree, five cats on the rim | 1 to 8 | the claw marks (eight now, from ch8's `tree` frame `f019`, two rows of four: `marks: 9` next, as `markSpots` lays nine, four, four and one); in ch8 the rim cats hop down and pad past her (`walk` at `rim-1`…`rim-5`), and the rim is empty after; the glow by `'auto'`; since ch5 the five on the rim sit up (`rim-1`…`rim-5`); `compare: [24, 60]` (ch7's told sum: two lines to scale in the sand between the two cats, on `lesson` and `sand`, the group in `keep` so no balloon covers it) |
| `den` | the apprentices' den under the rosebush; her nest | 1 to 8 | Riffle's stone where she put it (`stone: 'auto'`); her bark along the nest's mossy edge (`bark: 'auto'`), and under the moss every secret card she holds (`hidden: true`): Sprinkle's two, Coil's (ch6), ch7's three eyes (`my-count`, `prints-sprinkle`, `tunnel`) and ch8's four (`stash`, `glass`, `fox-brag`, `hail-shapes`: `BARK_SECRET`), a corner showing for each; **her glass** in its leaf under the moss beside the corners (`glass: true`, the leaf's tip and a glint showing) on every den frame from ch8's bedtime (`f159`) on; **how the nest grows** (ch8, below: corners in layers, a third course, `BARK_MAX` 27); the moon by its age in evenings (ch5's `moon: 5` at dusk; ch8's `moon: 8` at night, in the doorway's patch of sky on `doorway` and `inside`, whose box leaves out `sleeper-1`): the den's `moon` takes only `false`, `true`, `5` or `8`, so a later chapter adds its own number to that list in `scenes.js`; the grey tom at `sleeper-1`; Murmurchime's nest is empty; ch8's told waking puts Tallyheart beside the nest at a raw spot (`{ x: 1250, y: 896, h: 250 }`) |
| `sky` | the Sky River; and (ch6) the dream, a composition of its own | 1, 6 | the dream: `walk` (our cat at `star-1` on a soft path of stars, the starry cat at `star-2`) and `below` (the glass towers far below, the tallest with its red light, one balcony nineteen floors up with a wind chime, nobody on it) |
| `river` | the river in the storm, and the crash under the Old Bridge | 1 | |
| `title` | the old stone wall above the river, where she walks with Tallyheart; and (ch6) its far end, where the stones stop and the reeds begin: the ReedClan border | 2 to 4, 6 | the patrol walks the wall facing right, toward the reeds (`wall-2`, `wall`, `wall-3`, the leader at `wall-3`), and home facing left; at the wall's end (`end`, wide; `meet`, at cat height) CrystalClan stands on the dry ground at `end-1`…`end-3`, facing right, and ReedClan steps out of the reeds at `reed-1`…`reed-3`, facing left; `rustle: true` moves the reeds with nobody seen; nobody stands in mud or water, and the reeds never hide a face that speaks |
| `pile` | the prey pile under the bramble arch; and (ch7) round the back of it, and the tunnel's mouth; (ch8) the night trail's start and end | 2 to 8 | mice and voles only, no fish; rows of ten since ch4; the hole always in the middle of the back row (ch6's and ch7's mornings: places 3 to 6, `gap: [3, 4, 5, 6]`, a dark band in the brambles' shadow, `back: 'shadow'`, until she walks round); dug earth behind it (`dug: 'big'`); **the "scale" on the earth behind the back row** since ch4's sunset (`scale: 'behind'`), left there until the Gathering, a glimmer in `rear` and `hole`, never in or beside the mouth; full again by sunset, forty in four rows; **the moon by its age in evenings** since ch6 (a number, on `wide` and `low`, from "The moon comes out" on: ch7's `moon: 7` and ch8's `moon: 8` at dusk on `wide`; `moon: 9` next); `behind` is the back of the pile seen from the front. Since ch7: **`rear`**, round the back at cat height (no sky, so no `moon`): the low bramble roots over the heap of dug earth, the rows seen from behind, the first guards small at `guard-1`…`guard-3`, side-on, facing out over the camp; our cat at `rear-1`, Tallyheart at `rear-2`, where she sat the first watch; **`tunnel: true`**, the roots lifted and the round dark mouth under them: ch7 leaves it open on both paths, so a later chapter never draws the roots down over it unless the story hides it again; **`hole`**, close on the mouth (the roots always up, the back row's backs along the top edge; our cat at `brink`, the mouth about as wide as her shoulders, never as wide as she is long; nothing drawn in it or at its far end); `tap: 'back'` (on `rows` and `wide`) and `tap: 'roots'` (on `rear`, closed), unpainted Tap targets; **`tracks: true`** on `wide` at dusk or sunset, the train tracks far off past the towers, two thin lines in the last light; **`arch`** on `wide`, on top of the bramble arch (the climber's look). Since ch8: **`rear` and `hole` at night** (moonlit, never black: the trail's start and home); the tunnel still open on both paths (`tunnel: true`); **`poke`** on `rear` (`elev`), at the mouth's right edge, so a cat there facing left has her nose at the rim and her shoulders plainly wider than it (Tallyheart's shoulders stick; Riffle pokes his head in); **`tap: 'mouth'`**, the mouth's box (on `rear` while `tunnel` is true, and on `hole`: the wriggle-in Tap); the home talk cuts between `rear` and `hole`, Tallyheart across the mouth from our cat at a raw spot (`{ x: 1220, y: 958, h: 470 }`), our cat nose to nose with her on `rear` at `{ x: 860, y: 960, h: 380 }` (the spec says about `x: 1000`); Riffle waves goodbye at the hedge, the right edge of `rear` (`{ x: 1430, y: 962 }`) |
| `bridge` | the Old Bridge: the bank, the mouth of the dark, under it, the very back, the paws; and (ch6) Coil's stone leg beside the nook; and (ch7) one of Sprinkle's prints close up | 2 to 8 (ch8: kept only, by day, `back` and `wall`: Riffle in `stand` with `holds: 'string'`, the fish, and `tap: 'ears'`, the whisper Tap) | the drag marks, with **Sprinkle's big five-claw prints beside them** (`prints: true`), mentioned at last in ch7: her paw fits inside one with room to spare; **Tallyheart's branch across the back on the told path** (`branch: true`), on the told path's first panel only (chapters 4, 6 and 7); the forepaws drawn in the mud (`mudPaws: 7`) when the tally is shown (ch5; ch6 and ch7 show none); trains overhead. Since ch6 **every `back` panel has `stones: true`** (the stone leg, Coil's gap low in it) and `prints: true`, and **`wall`**, a close composition of its own, is always that leg: our cat at `back-left`, Riffle at `back-right`, Sprinkle's head at `dragon`, Coil at `gap`, no spot of Tallyheart's; Coil at `gap` whenever he is there (half as big again in `back`, `size: 1.45`, so he is one size in both), never in a pose that closes his eyes. On the told path's `back` panels Tallyheart sits across the nook (`{ x: 1250, y: 900 }`) whenever our cat is at `back-left`, where `near` would put her on top of our cat. On `under`, Riffle at chapter 6's three-shot spot (`{ x: 400, y: 940 }`). Since ch7: **`print`**, close on one big print at cat height (about four-tenths of her sitting height, as big as a heron's foot), our cat at `over`, crouched with `reach: true`, her paw over its heel pad and about a fifth of its length, no spot of Tallyheart's; `tap: 'print'` on `under` (the nearest whole print); **`compare: [24, 60]`** on `under`, the kept sum scratched in the open mud right of `mud`, clear of the prints and every cast box, in `keep`; Sprinkle's tail hug puts our cat in the loop in front of her (`{ x: 750, y: 822 }`, chapter 3's spot) |
| `field` | the Barking Field behind its wire fence, and the border at its far corner, where the long grass begins; (ch6) the fox trail along the fence to the last post; (ch8) the field at night, the near side's path to the tracks, Hail's log, the chase home | 2, 4, 6, 8 | a hollow log far inside the fence (Hail's since ch8; by day never remarked on); **the night** (ch8, `fx: ['night']`, drawn by no earlier chapter): silver in the moonlight, the log turned toward the path so its dark mouth reads; **`moon`** (the evening's age, on `wide`, `dogs` and `fence`, at night or dusk); **`tap: 'path'`**, the way to the tracks ahead on the right (the slip-past Tap); new spots: `heap-1`…`heap-3` (`wide`: the dogs asleep in a heap, `lie` with `asleep: true`), `log` (`wide`, `dogs`: Hail popping up, the log's rim over her lower body), `wire` (`dogs`, `fence`: a dragonet at the wire), `ring-1`…`ring-4` (`wide`: the big, silly circle), `fence-top` (`wide` only: the climber on the top rail), `trail-1`, `trail-2` (the weasels on the path: right of `path-right` on `wide`, along the middle on `dogs`); on every camera the tracks are to the right and home to the left; the dogs: Good Boy (variant 1), Drop It (2), the tiny one (3); the fox is never on the Clan's side of the last post, and ch6 never draws him; **Sleet's spot `grass`** in the three border cameras, in the long grass just past the post (nearer than the fox's spot), the grass over his lower body, never on the Clan's side; a `border-two` panel is two frames by `ch3Told`, so Tallyheart is at the post only on the told path |
| `crossing` | the Crossing: a rocky point, the otters' raft of logs tied with vines, airplanes very low | 2, 5 | the raft rides low; the tuft of thin brown fur was caught in its mooring vine (`tuft`) |
| `riverbank` | the path by the water under the towers, and the look up at the tallest tower | 2 to 4 | the little red light on the tallest tower's roof |
| `roof` | the roof of the tallest tower | 4, 5 | the red light on its pole, a low wall all round, a rain puddle, Squall at his post; airplanes pass well above |
| `openriver` | the open river off the Crossing, the raft close | 5 | bright blue water, never dark (README call of 2026-10-12); the raft is four logs and a long pole, and is never damaged; the white monument far across is drawn and never named |
| `marsh` | ReedClan's marsh: still green water, reeds, a mud flat | 5 | she is on the raft in every picture and no cat stands on the mud; three ReedClan cats on a far log, small, no faces; the tiny prints stay in the mud; nothing is drawn as a shape under water |
| `tracks` | the railway bank by the train tracks (nobody's land: "The trains own it."), its weasel holes, the stash inside the biggest, and the inside of the weasels' tunnel | 8 | always at night (`todFixed`), moonlit and silver, never black; nothing frightening; **nobody of the Clan on the rails or the sleepers** in any camera, and Reynard only ever at `rails`, far above the cats. **`wide`**: the high grassy bank, two rails bright on top, five or six holes along its face (the biggest low on the right, the stash; a little one left of it, the weasels' bed; the tunnel's end at the foot, left: `tunnel-end`, the hole's lip over the back half of whoever is there), faint tiny prints round every hole (always drawn), tall weeds along the foot (`tap: 'weeds'`), `foot-1`, `foot-2`; **`hide`**: at cat height in the tall weeds looking up the bank (`weeds-1`, `weeds-2`: weeds up to the eyes; a `tailUp` tail's tip stands above them), the weasels at `hole-1`, `hole-2`, Reynard at `rails`, never bigger than a cat's head; **`holes`**: close on the bank's face, the little hole (`hole-1`), a second (`hole-2`) and the biggest (`stash-mouth`, `tap: 'stash'`: a little bigger than the pile's tunnel, "A tight squeeze"), `watch` for the friend; **`brag`**: up the bank at Reynard on the rails, the weasels at `slope-1`, `slope-2`, no cat of the Clan; **`stash`**: a low earthen chamber lit from the mouth, mice and voles in tidy rows (about a third muddy: ReedClan's), a heap of tower glass (`tap: 'glass'`), `stash-in`; **`stash-close`**: the glass close, the corner of her face at `near`; **`crawl`**: inside the tunnel at cat height, roots hanging, the roof just clearing her ears at `crawl-1`, faint tiny prints both ways on the floor, `crawl-2` behind (`tight: true`: an earth lip over whoever is there); **`fork`**: the split, two small doorway-shaped ways, unequal, never a face (`fork-1`, `fork-2`, `worm: true`); `moon` by its age. The stash, its glass and its prey are still there after ch8 |

By the art's clock the moon was new on her first night and is full at about fourteen evenings
(`moonT` in `scenes.js`: `0.8 − 0.18 · (age − 4)`, half at about evening 8.4, full at 14). Chapter 7
is the seventh evening (`moon: 7`, the pile at dusk); chapter 8 the eighth (`moon: 8`, a half moon: the
pile at dusk, the field and the bank at night, the den's doorway at bedtime); chapter 9's is the ninth.
At one chapter an evening, chapter 10 would be evening 10, which draws gibbous, not full: chapters 9
and 10 must cover about six evenings between them (ch8 spec, section 8).

**Counts pictures** (`app/art/cats.js`). Chapter 7 added the cheeks (`kind: 'cheeks'` and
`'cheeks-top'`, one to ten cheeks, three whiskers on top and three below; two consecutive `who` entries
with the same cat and `variant` are one face, both cheeks puffed), one cheek (`thing: 'whisker'` at
table 3), the back row's gaps (`thing: 'gap'`), nights of marks (`kind: 'marks'`, per 4 or 10, on sand
or `ground: 'mud'`), and the sand at per 6 (two short rows of three). Chapter 8 used the table-4 picture
for the first time, as drawn since chapter 1 (cats side-on, four paws each, five to a row; `lit: 28`
lights seven cats), with a `who` for the rim's and the bedtime paws, and added one cat's paws by pairs
(`thing: 'paw'` at per 2, a `who` of one: the front pair, then the back), the field's four (`kind:
'dogs'`: the dogs by variant and Hail, four paws each, lit an animal at a time; a `who` longer than the
count draws its first entries), marks two and two (`kind: 'marks'` with `layout: 'pairs'`; without
`layout` marks draw as chapter 7's) and the sand at per 4, two and two.

**The cast drawn since chapter 8** (`app/art/cats.js`): Hail (`hail`: `sit`, `stand`, `bounce`, `run`,
`peek`, `pawup`, `tilt`; sized to our cat, as Squall), Snip and Snatch (`snip`, `snatch`: `stand`, `up`,
`run`, `skid`, `peek`, `point`, `curl`; `holds: 'mouse'`; "half your size"; never a tooth); every cat's
`run` and `tailUp` (`tap: 'tail'`), `holds: 'leaf'` and `holds: 'glass'` (`tap: 'leaf'`); Riffle's `tap:
'ears'`, `tap: 'paw'` and `tailUp` (he has no `run` or `walk`: on the trail and in the chase he goes on
all fours, `scramble`); the dogs' `lie` and `asleep: true`; Reynard's `trot`. No mentor is drawn in
`laugh` (it draws tears): Tallyheart's wry "Hmph." is `proud`.

**The nest grows** (ch8, `scenes.js`'s `denBark`). Along the mossy edge: one course up to nine, two
courses from the tenth (the older half behind, lifted), and past eighteen along the edge with `hidden:
true` (past twenty-four with it off, as chapter 4's bedtime frames `f114`/`f115` have it) three courses
of up to nine, the oldest third highest; `BARK_MAX` is 27, and past it the oldest are left out. Under
the moss: the first six corners as chapter 7 stood them, the seventh to twelfth a second layer behind,
half a gap along and lifted, the thirteenth to eighteenth a third; past eighteen no more corners are
drawn (the file still holds the cards). Every live save draws as before (none held more than six
secrets, eighteen along the edge with the moss, or twenty-four without). A full chapter-8 file is
eighteen along the edge and ten under the moss, so chapters 9 and 10 have room for nine more along the
edge and eight more under it.

## Words of this world

- **Clan words in use on screen.** Pillow cat; Tallwalkers ("Tall Ones, you'd say"); skymonsters;
  the Roar (the courage test, ch5); the prey pile; the Sky River; the Accord ("our promise not to
  hunt each other"); the Gathering; a moon, moons; the Counts, the Warrior Counts; the Training
  Hollow; the apprentices' den; the Old Bridge, the Barking Field, the Crossing; CrystalClan,
  ReedClan (ch5); Mistscale, dragonet; mentor, apprentice, warrior, elder, patrol, border; the cats
  who came before (ch1, ch6); guards (ch5, ch6, ch7). New in ch6: a border patrol ("a warrior's work"),
  the first watch and the second watch, the fox trail, the last post, fox country. The long grass is
  on screen since ch4 `f033` (ch6's spec and story say it is new). New in ch7: the tunnel ("It's the
  mouth of a tunnel."), doubling ("That's doubling."), whiskers and cheeks (the 6s' picture and
  label, "Whiskers · the 6s"); "two witnesses" ("witness" since ch5). New in ch8: **weasel** ("Weasels."
  at the holes, the first time it is said; Reynard's sigh, "Weasels."; the cards `stash` and `glass`);
  **glass** and **tower glass** ("It's not a scale. It's GLASS." "Tower glass."); the stash; the train
  tracks for every cat ("two long, shiny lines"), the rails and the trains ("Nobody's land. The trains
  own it."); a night trail; the tall weeds (at the bank's foot: "the long grass" stays fox country's);
  proof ("Not for keeping. For proof."); a half moon; paws, "a four is two twos", "Paws · the 4s"; FETCH;
  pawsteps, which Tallyheart counts out loud (module-1's habit: a count of steps, not a coined length).
- **Coil's and Sleet's words** (ch6): small diggers, "Snakes feel footsteps", "I have no eyelids";
  the roll call (Mama calls, and every dragonet shouts HERE three times), the eldest. **The dogs'**
  (ch2 to ch8): a cat is a squirrel, "Like a squirrel, but rude." ("BYE, RUDE SQUIRREL!", ch2; "BYE,
  GIANT SQUIRREL!", ch4; "A cat is just a BIG squirrel!" and, to the weasels, "BYE, RUDE SQUIRRELS!",
  ch8); their names are what their Tall Ones shout at them. **Reynard's** (ch8): "my clever little
  paws", "my little sneaks", "a fine, dry den", "One shiny bit", "One little story".
- **Pillow-cat words**, hers and Waffles': the Tall One ("my Tall One"), airplanes, the glowing box,
  the vacuum cleaner, the elevator (to Waffles "the little room", "The one that goes DING!", ch7 "the
  little room that goes DING"), a case file. Her pillow-cat know-how keeps paying: airplanes (ch2),
  glass like the patio door, and the Case File itself (ch4). The Clan still says skymonster;
  Tallyheart has tried "Air… planes."
- **Running lines.** "Sharp eyes." (ch8: "A night trail needs sharp eyes.") "I'm right here." "A thing
  to check." (ch6: "A snake's secret. A thing to check."; ch7: "A snake's secret," Tallyheart's at the
  roots, told) "Skritch." (ch8: *SKRITCH!* at the tree, *skritch, skritch.* in her nest) "Otter's
  honor." (ch6: his promise to Coil; ch8: "I'll tell NOBODY. Except Sprinkle.") "Do the paw thing."
  (ch7: "It's whiskers tonight."; ch8: "Tonight it really IS the paw thing.") "Not one paw past the
  post." (ch8, the field route, both paths) and, new in ch8, "Not one paw on the rails." "Mama says:
  stay where you land." (ch8, Hail: "So now I'm a DOG.") "Tell Sprinkle: five!" "The Counts don't lie."
  (ch7, once a path; ch8, the friend's, at the holes) "I'm not angry. I was scared." (Tallyheart: ch2,
  under the bridge; ch8, kept, behind the pile) "Otters are bendy." The stones and their fixed phrases:
  "Riffle's stone" (her gift, in her nest), "Riffle's juggling pebble" (ch3), Sprinkle's plain grey
  pebble, and (ch6) Riffle's three pebbles, plain, round and brown, which he juggles and then puts down
  for Coil.
- **World.md words not yet on screen:** Ironsnakes (it is "a train"; "the train tracks", for a climber
  in ch7 and every cat in ch8; "the rails", "the trains"), the Underworm, growlers, Hard Rivers,
  thumpers, whizzers, the Needle, the Stone Giant, the season words, the Holt.
- **Avoided because they echo the books,** with what is used: "assessment" (the Warrior Counts);
  "warriors' den" ("She sleeps with the warriors now"); a moon "thin as a whisker" ("as thin as a curl
  of bark"); whisker-lengths (no such measure); "not a whisker" for holding still ("Not one claw");
  "hunting" the dragon ("no cat goes looking for it"). Nine lives are every cat's, counted on claws:
  never given, lost or spent. The starry cat is a description, never a name, and no word is coined for
  the cats who came before or for the dream (their home is the Sky River). For tone: the six are never
  called "lost" (ch3 notes). Chapter 7 says tunnel; chapter 8 says weasel, and what the "scale" is made
  of (glass, said by her). Still never said: Ironsnake, Twoleg, Thunderpath. Chapter 8's title echoes
  Warriors' "The Sun Trail" and is kept (ch8 story, For us). A talking-worry cat's "LIAR!" stays a
  thought. "Whiskers" (a minor Warriors pet cat's name too) is only the 6s' picture word and label,
  never a cat's name. No length measure is coined (no whisker-, claw- or tail-length): sizes go by
  comparison, "as big as Patience's feet", "Half the size of my paw", "much too small for a dragon";
  ch8, "just wide enough for you", "Too small for me", "They're half your size.", "A tight squeeze".

## What chapter 9 inherits

Module-1's chapter 9, *Featherlight*: Sprinkle has to fly by the full moon. Thymeleaf, CrystalClan's
medicine cat (module-1's, never on screen yet), makes a remedy for her wing, and she gathers one
ingredient from each territory: reed root from ReedClan, oak moss from GroveClan, river mint from the
Holt, dew from the glass towers. Then she lays out her case file for the Gathering. Gathering the oak
moss finds Dew, who knows the moss that helps a dragon's wing. Sprinkle practises flying (README 42).
The Count is the 8s (a spider's legs: double the 4s), mixed; the story's use is remedy doses. The budget
is decision 47's (about 2,000 words on the plain path, one optional scene of about 300). The teaser
promises "Sprinkle has to fly by the full moon." and asks "How do you mend a dragon’s wing?", as
chapter 8's bedtime does ("Whatever the Clans decide, Sprinkle needs to FLY again.").

- **The eighth night.** Whether it is robbed is chapter 9's: the first guards were set at dusk, facing
  out; the tunnel lies open under the lifted roots; Reynard told the weasels "Nap now, my little
  sneaks. Rob later."; the weasels know "a CAT" saw their stash, not which, and Reynard saw nothing. A
  theft makes thirty-two in eight nights at her eighth morning count, 4 × 8 (chapter 8's was her
  seventh) (ch8 spec, section 8, says "a ninth morning count"). No cat of the Clan has seen a weasel
  but her and her friend.
- **No route flag.** Chapter 9 may not say she went through the tunnel (a field-route cat never has),
  nor round the field on the way out (a tunnel-route cat went under it, and heard the dogs only
  asleep). Both routes came home round the near side of the Barking Field, so every cat has seen the
  dogs see off the weasels, and has heard Good Boy's name.
- **By path.**
  - *Told:* Tallyheart was there for all of it: she went over the tunnel counting pawsteps, or round
    the field beside her; she whispered "Weasels.", heard the brag, kept watch at the stash, ran home
    with her and has seen the glass ("So THAT'S our dragon's scale."); and Hail, if found. She knows
    Sprinkle, every dragonet the player has found, Coil's secret, Waffles' witness, the sixty and FLEW.
    Her chapter 4 promise ("Then we tell her everything.") falls due now the thief is found: when she
    tells Glintstar, and whether Sprinkle is in it, is chapter 9's; so far "Not a word to the Clan
    yet." and "This goes to the Gathering, with the whole story." Riffle hears tomorrow ("Tomorrow,
    Riffle will want to hear EVERY bit."): today he knows nothing of the tunnel, the trail or Hail, and
    neither do Sprinkle and Coil.
  - *Kept:* Riffle walked the whole trail (through the tunnel with her, if she chose it), heard the brag
    from the weeds, kept watch at the stash, ran home with her, and met Hail if she was found; "Otter's
    honor. I'll tell NOBODY. Except Sprinkle.": he may carry it to Sprinkle, and Hail's "five" with it.
    Sprinkle and Coil heard of the tunnel by day ("A TUNNEL? Under your PILE?" "Quietly."; "come back
    and TELL me"), nothing more. Tallyheart was waiting behind the pile and has heard everything but the
    dragonets: the tunnel, Riffle's part, the weasels, the fox, the stash, and seen the glass ("A fox's
    trick."; "But next time, you take ME. Not just Riffle."). She half-knows the sixty ("For a
    DRAGON."), has heard the fox's brag (FLEW his "little story"), has never seen a dragonet, and does
    not know Sprinkle can't fly or what Coil said. Whether the kept path tells her about Sprinkle, and
    when, is chapter 9's (ch8's brief, call 11: "the dragonet stays the player's secret" in chapter 8).
  - *Every path:* Glintstar, the guards and the Clan know four a night for seven nights, and nothing
    more; Glintstar knows of no dragonet; nobody has charged Reynard, and no Clan has been told ("This
    goes to the Gathering. Every Clan should hear it.", Tallyheart, both paths). ReedClan knows nothing
    of the stash. Hail, if found, knows Sprinkle is safe under the Old Bridge, and which of the others
    the player has found.
  - *Flags:* `foundHail` (sticky) is chapter 8's only flag; `ch7Flew` and `ch4CaughtFly` as before.
- **The case so far** (her file, 20 to 28 cards, eight to ten under the moss). The rows: the moon
  (Waffles — the fox — Patience, nothing "answered"); FLEW (`cant-fly` — `fox-flew` — `fox-brag`, and a
  Sleet cat's `sleet-den` at its end); the two robbed piles and the stash (`tidy` — `reed-pile` —
  `stash`); the "scale" and the glass (`scale` — `glass`); Coil's diggers and the tunnel; and chapter 5's
  pairs (Patience's shapes with Squall's, if found; the marsh prints with the pile's, a noticing cat's;
  the tracks with Squall's shapes, a climber's). `my-count` holds the twenty-four and the sixty and may
  be missing (ch7's known issue 15): nothing may require it, chapter 10's picking included. No card shows
  or names the weasels but the stash's and the glass's, and the old clues are joined to them only in
  words. Her proof is one piece of glass in a leaf under her moss (`glass: true`), not a card. Judging is
  chapter 10's (no `answers`, README 45). Laying out her case file for the Gathering is chapter 9's: the
  first time the cards under the moss would be shown together.
- **Her nest has room.** Up to 27 pieces along the mossy edge (three courses past eighteen with
  `hidden: true`) and eighteen corners under the moss (three layers of six); a full chapter-8 file is
  eighteen along and ten under, leaving nine and eight. A new secret card goes in `BARK_SECRET`
  (`scenes.js`). If laying out the case file lifts the moss, a full 28-card file is one more than
  `BARK_MAX`: the oldest piece is left out of the nest's row (her Case File page still shows it), so
  chapter 9 decides how the laid-out file is drawn. Every den frame from now on carries `glass: true`.
- **Her worry's brave moment.** Small (the tunnel, and the stash hole on the field route) and shiny (the
  heap of glass) were chapter 8's. Water's is chapter 10's Moon Ferry at night (ch8's brief, call 4;
  the open river is bright blue and nothing on it is dark, in any light: README call of 2026-10-12), and
  talk's is her speech at the Gathering ("You hold it in. For the Gathering.").
- **Dragonets.** *Hail*: found or not on chapter 8's field route; her "five" (and "I'm the BOUNCIEST!")
  waits to reach Sprinkle (told, Tallyheart heard it; kept, Riffle's "Except Sprinkle."). *Sprinkle*
  still can't fly ("Her hurt wing still won't lift."), and practises in chapter 9. *Dew* is chapter 9's,
  gathering the oak moss in GroveClan's woods: her found flag, card, riddle and page are to make, and
  she must be renamed first. *Squall*: the roof offered once more for a cat without him (the dew from
  the glass towers can take her up). *Wisp*: Patience's reeds in the marsh (the reed root). *Puddle*:
  under the ferry raft, if she is aboard. *Sleet*: at the last post. A dragonet offered again sets a
  found-here flag of the new chapter's own, and the old chapter's recap line and page then need
  `{ foundX: true, chNX: false }`, as chapter 4's did for `ch5Roof`. The riddles so far are 7 × 5,
  4 × 10, 7 × 1, 7 × 3 and 4 × 4 (and Sprinkle's 2 × 5, 6 × 5): Dew's picks another fact she knows.
- **The Counts.** The 4s are her eighth Count ("Paws · the 4s", eight marks on the tree). Chapter 9
  teaches the 8s (a spider's legs, four on each side: double the 4s). Of the 8s only 7 × 8 and 8 × 8
  (either order) are new: she knows exactly eight, one from every mark on the tree (8 × 1, 2 × 8, 5 × 8,
  10 × 8, 9 × 8, 3 × 8, 6 × 8, 4 × 8), so "You already know most of the eights" and an ask of eight
  pairs at the tree work as chapter 8's did. A chapter-9 set on table 8 with the most facts there
  becomes the 8s' own (`E.countSets`); a set on table 7 would make chapter 9 that Count's lesson, so the
  remedy doses go on table 8 or a table she knows. **The warm-up is the 4s.** `E.hardFacts(cat, 4)`
  finds chapter 8's misses (the lesson's, the twenty-eight's 4 × 7, Hail's 4 × 4), a slow 4 × 5, 3 × 4
  or 10 × 4 (the lesson's facts timed on themselves; 8 × 4 is a check), and older timed answers chapter
  8 did not replace (chapters 1 and 2's 1 × 4 and 2 × 4; Hollow rounds' 4 × 9, 4 × 6, 2 × 4, 1 × 4). A
  warm-up that says "Yesterday" needs `warmHard: { table: 4, at: 0, avoid: [[1, 4], [2, 4], [4, 9], [4,
  6]] }`; the cost is that a chapter-8 miss of 2 × 4 or 4 × 6 is passed over (ch8 spec, section 8, run).
  Its fillers can borrow from `ch08-fours` (`fillOrder: 'easiest'`: 2 × 4, 3 × 4, …), avoiding 4 × 4 as
  "an easy one". A chapter-8 miss of 4 × 8 or 8 × 4 is in `E.hardFacts(cat, 8)` too, and a missed
  twenty-eight or Snip's 2 × 7 in `E.hardFacts(cat, 7)`, for chapter 10 (both checked in Node). Leave
  a fact or two of the 8s lesson without a right line of its own, so speed is noticed. The ninth mark is
  `marks: 9`. **An engine need** for chapter 9's spec (ch8 spec, sections 7 and 8): `fillers()`' last
  pass should never take a one-fact set's own pair, so a riddle never lends its own new fact back as "An
  easy one!"; and a set that lends one-group fillers should give `helpIntroFar` no numbers.
- **Places.** Kept from chapter 8 (the places table): the `tracks` set (the bank, the holes, the stash
  with its glass and prey, the tunnel's inside and its fork; nobody on the rails); the tunnel from the
  pile's back to `tunnel-end`, open; the field by night; the pile's `rear` and `hole` at night, `poke`
  and `tap: 'mouth'`, the "scale" behind the back row; the den's `glass: true` and `hidden: true`; eight
  claw marks. The pile's and the field's `moon` take any number (9 next); the den's list needs its
  number added in `scenes.js`. Chapter 9's places: GroveClan's woods and Dew's oak hollow (no set);
  Thymeleaf's den (no set; the camp's dens are bramble); the Holt (never drawn, never named on screen;
  the otters' Crossing and raft are drawn); ReedClan's marsh (`marsh`: she has only ever been on the
  raft there, and no CrystalClan cat has set a paw on ReedClan's mud); the glass towers (`tower`,
  `roof`, `garden`, `riverbank`: the roof has a rain puddle, and Squall). Four territories against the
  budget's one new place: chapter 9's brief decides which are scenes.
- **The moon.** Eight evenings old, a half moon; full at about evening 14 (`moonT`). At one chapter an
  evening, chapter 10 would be evening 10, drawn gibbous: **chapters 9 and 10 must cover about six
  evenings between them** (chapter 9 spanning days, or chapter 10 opening days later), and the
  Gathering's frames use a moon of about 14 ("When it's full, it's the Gathering.").
- **Names still open.** *Dew* is an exact Warriors name: renamed, the new name checked on both wikis,
  before chapter 9 names her. *Thymeleaf* (module-1's medicine cat; module-1 gives no she or he) is
  never on screen: check it on both wikis before chapter 9 names the cat. *GroveClan* is on screen for
  the first time in chapter 9: check it too. "The Holt" (world.md's) has never been said on screen.
  Snip and Snatch are kept (the cast notes); Puddle and Sleet wait in the README; the third dog stays
  unnamed. Hail keeps her name by a call of 2026-10-10.
- **Open for chapter 9** (not settled by chapter 8): whether the kept path tells Tallyheart about
  Sprinkle; when the told Tallyheart tells Glintstar, and how much; whether the eighth night is robbed;
  Dew's new name and Thymeleaf's check; GroveClan's first appearance (who meets her there, and on whose
  ground); the roof once more for a cat without Squall, and Wisp at the marsh; Hail's "five" carried to
  Sprinkle; where chapter 9's and 10's cards go in the nest, and whether the laid-out case file lifts
  the moss; the six evenings; the one-fact riddle's engine need.
- **Standing rules.** On the water nobody mentions lives, the otters' raft is never damaged, a roar is
  an airplane and nothing else (ch5 notes), and the open river is bright blue, never dark. Riffle
  promised Coil "Otter's honor": he is never in `juggle` under the Old Bridge again (`under`, `back`,
  `wall`), and no frame that names Coil has him hugging his tail in fright. Coil is funny-creepy, never
  frightening: he never strikes, squeezes, rears up or comes toward a cat, and never shuts his eyes or
  shows a tongue or fang. Nobody steps past the last post ("Not one paw past the post."; chapter 8 went
  round the near side, and the railway bank is nobody's land); Sleet is never on the Clan's side of it.
  Nobody of the Clan on the rails ("Not one paw on the rails."). Reynard never sees her, and is drawn
  only on the tracks, never near a cat of the Clan. The weasels are funny, greedy and quick, never
  cruel: no teeth or fangs, never a snarl. No mentor is drawn crying or hurt (`laugh` draws tears). No
  CrystalClan cat has set a paw on ReedClan's mud. Only a tunnel-route cat (and kept Riffle) has been in
  the tunnel. The starry cat stays a description. "Whiskers" stays a picture word. Glintstar's "Bring
  your count" waits for the Gathering. The climber's route "from the bridge beams" (ch3) is unused.

# Chapter 13 brief: The Hunter's Crouch

*v1 · 2026-11-07 · decisions 53 and 54 are Aron's (the maths; her own apprentice, the badger, Reynard, the shark tooth); the rest
are Claude's calls under decision 46*

*The orchestrator's brief for the text workflow, once chapter 12's story (Draft v0.4) and spec (v0.2) are final. Every
drafter, judge, critic and editor reads this. Decision 53 is Aron's (the maths: multiplication kept fresh, long subtraction
with two-digit regrouping as its warm-up, a Spanish-speaking friend); decision 54 makes Chispapaw her own apprentice, so the
chapter's one real choice, `teach`, is a mentor's; the rest are Claude's calls under decision 46, to be recorded in the
README when the chapter is built. Aron can reverse any of them. The numbers are checked in
`~/potomac-crossing-work/ch13/brief/check.py` (`check.txt`), the words in `names-1.txt` and `names-2.txt` beside it.*

## What the chapter is

**The first frost. At first light {name}{ending} walks her first dawn patrol as a warrior, three cats' pawprints in the
white, to the Crossing, where Granny has news: a fresh badger print on GroveClan's side, and the ferry otters have heard it
is as big as a FOX. Back in camp she keeps yesterday's promise and teaches Chispapaw the hunter's crouch: a frosty leaf is
caught, a mouse is not (it heard the bell), and the collar goes in Chispa's nest. Tallyheart teaches them both what to do
when there aren't enough loose ones: spread a row. A courtesy patrol to GroveClan finds a big dig by the old oak (a badger
digging for worms, says the elder, who knew one when she was a kit) and, half under the leaves, one long line and eight
little pokes. At home the old tom tells how a badger once SAT on his whole patrol, her book opens a badger page, and in her
nest she can't stop thinking about those marks. Where has she seen them before?**

Module 2's first ordinary working day: wonder (frost, from this side of the glass), a mentor's pride (her apprentice copies
her, wobbly tail and all, as she once copied Tallyheart), and comedy (a pounce on a leaf, a bell that tells every mouse, the
old tom flattened in his own telling). The badger is a print, a dig, some marks and a rumour: curious, never frightening.

## Before this brief is used

- Drafting can start now. The build waits for chapter 12 to ship (after the take-aways kit and book two) and for
  `docs/continuity.md`'s "What chapter 13 inherits"; until then chapter 12's spec, section 8, is that list.
- **Aron's one fact, needed before the build, not the draft** (module-2's "Not a decision"; the kit's section 12, item 2):
  this is the first chapter with a spread. If Lissa says "me llevo una" when she subtracts, or her class marks a spread with
  a small 1 before the 3 instead of 13 above a struck 3, the help's words and marks need a note before chapter 13 is built.
  The draft says the kit's English ("spread a row"), lettered from the words table, so it does not wait.
- The spec checks first: Chispapaw's `collar: false` (ready since chapter 12's spec, call 18); the badger's marks as the kit's
  quick picture on earth, no new key (module-2's amendment 2; if the kit's sand art can't lie on earth, the grove draws its
  own); the groundhog, the optional scene's one new face.

## Read this, and only this

1. `CLAUDE.md` in the repo, and the README's Decisions 1–54.
2. `docs/module-2.md`: "In short", "Cast", "Naming", "What she can find" (the groundhog and the Rules), "The secret" (to know
   what is true; plant nothing from it beyond chapter 13's entry), "Paths" (`teach`), chapter 13, and "Tallyheart, Chispapaw
   and the Counts" (its chapter 13 row and the Spanish rules). Skim the rest.
3. `docs/continuity.md`: "What chapter 13 inherits" (until it exists, chapter 12's spec, section 8), the standing rules, and
   the cast rows for Granny, the GroveClan elder and apprentice, and the old tom.
4. `docs/take-aways.md`: section 1 (the column and its lines, `'show'` and `'tap'`), section 2 (the help; the slips `flip`,
   `nospread`, `kept` and `extra`), section 3 (chapter 13's row and the cut order).
5. Chapter 12's story for the voice, Chispapaw's above all, and the format: `docs/chapters/12-a-spark-at-the-hedge.md`, the
   story itself (stop at its closing `*For us*` block).

## The budget

- **About 20 to 22 minutes to play, and the minutes bind before the words.** The plain path is about **1,550 words** (1,450
  to 1,650) on one reading, measured as chapter 12 was (`~/potomac-crossing-work/ch12/editor-r3/measure.py`: 123 words a
  minute, 2 s a screen, 3 a Tap, 6 a choice): about 21½ minutes, 20½ to 22½ across the kit's maths, which runs 4½ to 6¾
  here (five Counts, six take-aways with the first spreads, a help and a twin to expect). Decision 47's cap of about 2,000
  words stands, but would play 24 to 26 (`check.txt`, section 7); module-2's row (1,900 words, 20 minutes) predates the
  kit's timing.
- **One optional scene, the groundhog's, at most about 300 words** (about 3 minutes more). Nothing else optional.
- At most **125 frames** in a reading (module-2's row plans 120).
- **New cast: one**, the groundhog. Everyone else is drawn (Granny and the ferry otters are chapter 5's variants; the GroveClan
  elder and apprentice chapter 9's). No Waffles, Thymeleaf or Sloshbank.
- **Cut to fit**, in this order, past 1,650 words: talk at the Crossing (Riffle and Granny in two screens, the otters in one);
  the polite ask's choice (its line stays); the elder's greeting; the old tom's second line; the grey tom at bedtime. Never
  the frost, the crouch and `teach`, the bell, the lesson's story lines, the dig, the marks, the old tom's tale or the hook.
  The maths is cut only in the kit's order, as played (below).
- **New places: none** (her nest, the camp, the Crossing, the Hollow, the pile, GroveClan's woods). Options on sets that
  exist, off by default: frost on the camp's ferns (or words alone if it costs, module-2's fallback); on the grove's `oak`,
  the dig by the roots (earth thrown back, five long scratches in its sides, a smaller doorway beside it, the marks half
  under the leaves).
- **No engine feature** (module-2's engine table: chapter 13 is data only): sets, lines, two lines in the words table, two
  flags, the book's keys. Nothing that needs a column echo, a Spanish prompt or a new kind of frame (call 12).
- **Flags: two new.** `teach` (`'show'`, `'try'` or `'words'`, set by the crouch's Choose, replaced on a re-read as
  `ch10Best` is) and `foundGroundhog` (sticky, on the scene's last screen, as `foundMizzle`). Lines read `specialty` and
  `ch2Stone` at most a line each; `teach` colours Chispa's reply and one bedtime line.
- **About 11 typed answers**, 12 with the groundhog: five Counts (three in the warm-up, 3 × 4 at dawn, 6 × 8 at noon) and six
  take-aways (the worked example, four lesson problems, the pile's). Measured as played: if it drags, the kit's order cuts
  486 − 253, then the warm-up's third Count; never the three spreads or the pile.

## The lesson kit

**Take-aways, step 2: spread a row, two digits** (decision 53's warm-up; the kit's `teach: 'ones2'`), and the Counts kept
fresh: chapter 12's shape in the Training Hollow, Tallyheart teaching warrior and apprentice side by side.
- **The warm-up:** three Counts, her two hardest over all 54 pairs first (the kit's cross-table rule), then one more; the
  set's own three, for a cat with fewer hard facts, **9 × 7, 4 × 6, 8 × 8** (no pair of chapter 12's own, this chapter's
  story Counts or chapter 14's; no answer the chapter has elsewhere). Chispapaw says the first right answer in Spanish, as in
  chapter 12 (`echo: { on: 'first' }`), with nothing after it ("I never knew what they MEANT." is not repeated).
- **The class word:** when Tallyheart says take-aways, Chispa knows them: her little Tall One's homework this frost-time is
  «la resta» (glossed "take-aways" in the same line).
- **Why:** "Yesterday, every column had enough loose." Today one won't. Chispa: *[es]* "¡No alcanza!" (Not enough!), what her
  little Tall One says over it every night; Tallyheart: then a warrior spreads a row, ten more loose. A frame before the
  worked example, never inside a column.
- **The picture:** the store's rows and loose; a spread row opens into ten beside the old loose, a ten-frame (the kit's); in
  the sand, a line crossed out and ten new dots.
- **The column:** **43 − 16 = 27**, worked (`'show'`, she types each digit; the kit's school words, "A row is a ten. A square
  is a hundred.", before its tens line, as chapter 12's build gives `'ones2'`), its prompt "Say the pile holds forty-three,
  and sixteen go to the store." (eleven words; the kit allows twelve), its right line "Two rows, seven loose left."; **70 − 34
  = 36** (`'tap'`: no loose at all, so she taps the row to spread it); **85 − 39 = 46** (Chispa echoes "¡Cuarenta y seis!",
  right or helped, never its twin); then two older, no spread: **97 − 52 = 45**, **486 − 253 = 233**. No line says which
  need a spread ("Do we need to spread?" is chapter 17's); the kit's `extra` slip catches an unneeded one. Three of the new
  step, two older, one with no spread, every answer different (`check.txt`, sections 1 to 3). A twin may land on the pile's 25
  (rare: chapter 12's known issue 15, accepted there).
- **The story's own, at noon at the pile:** Glintstar: six hunters, eight pieces each, **6 × 8 = 48** (a Count), its right
  line adding the dawn patrol's four, fifty-two on the pile (said, never typed); "Twenty-seven go down to the store. How many
  stay for the Clan?" (twelve words, the kit's most), **52 − 27 = 25** (its set `twins: false`, as chapter 12's store);
  Chispapaw whispers "¡Veinticinco!" before the Clan. At its ones the flip lands on the right digit (7 − 2 = 5); the tens
  catch it (a 3 is `kept`), as the kit designs.
- **Kept fresh, at dawn:** three cats' pawprints in the frost, four paws each, **3 × 4 = 12**, Tallyheart's habit ("Let's
  count something."). **Optional:** the groundhog's lullaby, **7 × 8 = 56**, a story Count, its prompt "Seven… times…
  eight…".
- **The store:** twenty-seven go down at noon, the afternoon's hunters carry more, unnumbered (a line at most), and her book
  draws **178** (module-2's bracketed day-2 figure, never said: 133 + 27 + 18). No line says what the store holds. Count the
  store needs nothing new: once this set is finished, its rounds take `ones2` and their help speaks of spreading.
- The words: spread a row, ten more loose, not enough, take-aways, loose, a row, a square, ones first, the school words;
  «la resta». **Never "borrow" or "carry"**, and no "regroup" (*desagrupar* is chapter 14's, *reagrupar* 16's); no spreading
  a square (chapter 15's), no three-digit spread (chapter 14's). A take-away is never called a Count.

## Steering calls (Claude's, under decision 46; call 4's mentor by decision 54)

1. **Day 2, the first frost.** Tallyheart wakes her at first light; a title panel over her nest ("Chapter 13: The Hunter's
   Crouch") so the start frame shows. The ferns are white, and frost, a picture through the glass all her pillow life,
   crunches under her paws: chapter 1's first grass, for frost (one screen). No moon is named or drawn: at bedtime it has not
   risen yet (it rises later each night now), the stars are out, and the den needs no new moon age. GroveClan's woods keep
   the grove's bright afternoon (`todFixed`): the frost there has gone.
2. **The dawn patrol** is Tallyheart, {Murmur}chime and her, a patrol of three (chapter 6's rule); Chispapaw and the grey tom
   are asleep. Their prints in the frost are 3 × 4. They go to the Crossing because Riffle asked ("Come to the Crossing at
   first light!" "First light, then.").
3. **The Crossing.** Riffle is juggling before they arrive (Otter's honor holds only under the Old Bridge). Granny, in her
   chapter 10 manner ("Badger. An old track. From far upriver."): "Badger. A FRESH one.", on GroveClan's side of the little
   channel, the island's print but new, seen from the ferry, so no cat goes to look. The ferry otters: "As big as a FOX, we
   heard!" (the module's first rumour; the otters run the Crossing and hear all the news, world.md). Tallyheart: "A thing to
   check." A swimmer's line here (not chapter 12's "Too cold for a swim"). A roar overhead is only ever an airplane.
4. **The crouch (`teach`).** Chispapaw is waiting: "Is it tomorrow NOW?" (chapter 12's "Tomorrow."). In the frosty ferns by
   camp, **Choose** how she teaches: show her (belly low, tail straight out), let her try first ("You try. I'll watch."), or
   say Tallyheart's words from chapter 1, "The crouch feeds you. The Counts feed your whole Clan." Each gets its own reply
   from Chispa, and chapter 21 pays each ("You showed me. Just like that." / "You let me try. So I tried." / "Feeds the whole
   Clan, right?"), so each must be true as written. Whichever, Chispa's tail sticks straight up, as our cat's did in chapter
   1. She pounces on a frosted leaf (*crunch*: "Got it! …It's a leaf."), then creeps at a mouse; her bell goes *ting*: the
   ferns twitch, a tail tip, gone (the mouse never drawn whole; nobody catches anything: her first catch is chapter 21's).
   She works it out herself, "…Mice have ears.", and leaves the collar in her nest, kept safe (her Tall Ones gave it).
   Tallyheart watches from the side, proud, never `laugh`. No two cats touch.
5. **The lesson** (the lesson kit), late morning in the Hollow: Chispa new to spreading too, never correcting her. Her little
   Tall One's homework is mentioned, never a particular problem from it (chapter 18's homework panel).
6. **Noon at the pile**: 6 × 8, then 52 − 27, then Glintstar sends a courtesy patrol to GroveClan: "Ask about their hole.
   Politely." The patrol is her, Chispapaw and Tallyheart, who knows the elder and lets her do the asking.
7. **GroveClan.** At the bridge's end she passes on Tallyheart's words to Chispa, "We wait here to be asked in. Best manners."
   (chapter 9), and Tallyheart's ear twitches. The elder remembers her as the polite one (chapters 9 and 10), a line at most.
   She asks, politely (a **Choose** of two ways, setting nothing, one funny). At the old oak's roots, a big dig: earth thrown
   back, five long scratches in its sides, no fur, no feathers. The elder, in module-2's words: "Badger. Digging for worms,
   I'd say. When I was a kit, a badger wintered in these woods. Grumpy. Never bothered a cat that didn't bother her." Then
   she goes back to her den ("At my age, frost is for looking at.", or the like) **before the marks are found**: she must
   never see them, since recognising them is the elder's turn in chapter 21.
8. **The marks.** On the way out, half under the leaves beside the dig, scratched in the earth: **one long line and eight
   little pokes**, drawn as the kit's quick picture. Always "a long line" and "little pokes", never a dot, a number or "a
   count"; nobody reads them (chapter 16's "They're a COUNT." is the cat's moment; a child who saw Tallyheart's sand may get
   there first, as module-2 hopes). Chispa whispers "Claw marks?"; she isn't sure. The dig's five scratches are digging claws;
   the line and pokes lie apart, on flat earth.
9. **The groundhog (optional)**, offered to every cat, as Mizzle and Sleet were: a **Choose** at the dig ("Look closer." /
   "Home before sunset."), after her spotting line by `specialty`: noticing, a smaller doorway beside the dig; friends, the
   shy GroveClan apprentice peeks from a fern and points, still silent; climbing, the doorway seen from the oak's low branch
   (never the hollow); sneaking, she creeps close and hears a tiny snore; a swimmer reads the plain line (something snores
   under the leaves). The scene: a round brown shape ("Was THAT the badger?", one panel's red herring) wakes grumbling ("I
   was ASLEEP."), tells its one thing ("Not a badger. GROUNDHOG. Something BIGGER dug past my bedroom. Sniffing. All.
   Night."), yawns into "Seven… times… eight…", which she finishes (56, typed), and is asleep before she tucks the leaves
   back (**Tap**). Its last screen sets `foundGroundhog`. Saying no sets nothing; the plain path loses nothing.
10. **Home at sunset.** The old tom tells the apprentices his tale, "A badger SAT on my whole patrol once! Flat as leaves!",
    for laughs (the grey tom: "Were you scared?" "I was FLAT."); told of the marks: "Claw marks. Mark my words." (the badger
    page's rumour). His tale's truth is chapter 18's; nothing hints at it. Her book opens a page, "What is a badger LIKE?"
    (chapter 10's hook), in a caption at most.
11. **Bedtime.** Her warrior's nest beside {Murmur}chime's, the stars out, the mist stone grey on the moss, Riffle's stone by
    `ch2Stone`. Across camp Chispapaw's collar lies beside her nest: not one *ting*. One line of hers by `teach` (practising
    the crouch the way she was taught). Then the hook: one long line, eight little pokes. Where has she seen that before?
    Never answered. The dream question; it ends warm in her nest.
12. **Spanish, data only.** «la resta» and "¡No alcanza!" are a line each in `PC.words.es`; the echoes are sets' `echo` keys
    (the warm-up's first right answer; 85 − 39) and a frame balloon (the pile's whisper): three of eleven answers. **No Count
    is asked in Spanish** (chapter 12's guard keeps `lang` off a prompt; lifting it is engine work, which the sleepers'
    Spanish asks from chapter 14 on will need) and **no column is echoed** (that needs the kit's `o.echo` hook, and «menos»).
    Chapter 12's rules hold: eight words or fewer, the English on the same screen, Latin American, never in an English voice,
    never aloud on the mini. Chispa is shy of Spanish before others by day (she whispers it at the pile) and says it out
    loud in the Hollow.
13. **Paths.** One optional scene and two flags. At most one line each by `specialty` (call 3 and call 9) and `ch2Stone`
    (bedtime); `teach` colours two of Chispa's lines, never a frame pair. No `ch10Best` or `petname` line. Every warrior
    reads the same chapter.
14. **Her book.** Chapter 13's page in book two, the store drawn at 178 (`book.store`). **The badger page opens** with this
    chapter's rows (module-2's table): *They say* "A badger SAT on my whole patrol!" (the old tom), "As big as a FOX!" (the
    ferry otters), "Those scratches are claw marks." (the old tom); *I saw* "A big dig, turned earth, no fur or feathers: it
    digs for worms." (module-2's "Shallow holes … she digs for worms" for one dig, and "it" until chapter 17 meets her). The
    groundhog's sleeper page (`book.sleeper`, `when: { foundGroundhog: true }`), a silhouette until found. The teaser names
    "Chapter 14: The Night Watch" and says no more than its entry (holes, a watch, no shape). The chapter sets `module: 2`
    and `names: { player: '{name}{ending}' }`.
15. **Toms and she-cats read alike** for our cat; Chispapaw and the elder are she-cats. No two cats touch; nothing in the woods
    is dark; no CrystalClan cat goes into GroveClan's woods unasked.

## Names (before drafting)

- **Checked** (2026-11-07, `names_check.py`, both wikis, whole names and both halves;
  `~/potomac-crossing-work/ch13/brief/names-1.txt`, `names-2.txt`): **nobody new is named.** "The groundhog" is a label (no
  page on either wiki, hits only as the animal, as module-2's check found). **Courtesy patrol**, **«la resta»**, **"¡No
  alcanza!"**, **"Flat as leaves"**: clear. **Dawn patrol**: no page, hits as the ordinary phrase in Warriors chapters: kept,
  a shared convention like chapter 6's border patrol. **The Hunter's Crouch**: on screen since chapter 1; "Crouch" is a
  Warriors Names-page prefix and "Hunter" a Warriors page (the books' pen name): words in a title, never a name, as chapter 8
  kept "The Night Trail".
- **Labels:** "The groundhog"; the GroveClan elder and apprentice (by variant; the apprentice never speaks); Granny (a
  title); the ferry otters by variant. The grey tom stays unnamed (chapter 20's).
- **Words:** the first frost, the dawn patrol, a patrol of three, the hunter's crouch, a courtesy patrol, best manners, a dig,
  scratches, claw marks (a guess), "a long line and little pokes", badger, groundhog; the kit's words above. Spanish only
  from the words table: counting and facts, «la resta», "¡No alcanza!", "¡A contar!" if wanted.
- **Not:** borrow, carry, regroup; a dot, a number or "a count" for the badger's marks; StarClan, Twoleg, kittypet,
  fresh-kill, Thunderpath, vigil, "warriors' den"; no "whisker-length" or "claw-length". No badger on screen, not even a
  shadow.

## Format

Chapter 12's story format exactly: the title "# Chapter 13: The Hunter's Crouch", an italic header with the minutes (plain,
and with the groundhog), "How to read this draft" (only the marks this chapter uses, `teach` and `foundGroundhog` among
them), `##` sections, `---` between screens, **Choose:**, **Tap**, **Counts** (a Count she types), **Take away** (a column
take-away she types, with its problem and what it counts: "**Take away:** 52 − 27, the noon pile less what goes to the
store"), and the lesson as a short block ("**Lesson:** take-aways, step 2") with only its story lines written out. The
groundhog's scene is a section of its own, each screen marked *The optional scene.*, its last setting `foundGroundhog`, as
chapter 9's hollow in the oak. `[if …]` variants (`*[if teach: show]*`), second person present, the tokens, sound effects in
italics. A whole Spanish line is marked *[es]* with its English beside it on the same screen; a Spanish word inside an
English line is in «guillemets». It ends warm in her warrior's nest.

**The story only.** No notes beyond a closing block of at most 40 lines, `*For us*`, with the words and minutes, the Spanish
lines used (with their glosses), the calls made (one line of reason each), and what chapter 14 inherits in a few lines.
Flags, the Counts sets, the words table's lines, the grove's dig, art needs and build notes go in the spec
(`13-the-hunters-crouch.spec.md`).

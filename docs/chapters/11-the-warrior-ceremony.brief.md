# Chapter 11 brief: The Warrior Ceremony

*v1 · 2026-10-31 · the orchestrator's brief for the text workflow. Every drafter, judge, critic and editor
reads this. Decision 52 is Aron's (the name: both); the rest are Claude's calls under decision 46, recorded in
the README. Aron can reverse any of them.*

## What the chapter is

**The evening of the day she passes her Warrior Counts, the whole Clan gathers in camp under the moon, and
Glintstar makes {name}paw a warrior. Glintstar sees three names in her, drawn from her own moon, and she
chooses one, or names herself (decision 52). The Clan calls her new name. Then, as warriors do, she keeps a
quiet watch over the sleeping camp until the first light, and the chapter ends with her warm in a warrior's
nest.**

This is the payoff Lissa has waited ten chapters for. It must feel earned, warm, proud and a little grand,
like a birthday and a graduation at once, and never long: she has just answered 55 questions. It is short:
one evening, one ceremony, one quiet night.

## Read this, and only this

1. `CLAUDE.md` in the repo, and the README's Decisions 1–52 (skim the calls of chapters 6 to 10).
2. `docs/continuity.md` in full, above all "What the Warrior Ceremony inherits" (the state of the story, every
   promise the Ceremony keeps, `ch10Best`).
3. `docs/warrior-counts.md`, sections 1 and 5 (how she gets here: the pass page, Glintstar's "Tonight, the Clan
   gathers again. For your warrior name.") and `app/story/warrior.js`'s pass lines.
4. Chapter 10's story for the voice and the format: `docs/chapters/10-the-gathering.md`, the story itself
   (stop at its closing `*For us*` block).

## The budget

- **About 12 to 15 minutes to play.** The plain path at most about **1,300 words**, one reading.
- **No optional scene.** Every player reads the same ceremony; her name, her answers and her flags change lines.
- At most **90 frames** in a reading.
- **New cast: none.** Everyone is drawn already. **New places: none needed** (see call 2: the camp, by night).
- **One engine need is expected: the warrior name** (decision 52: suggestions, or her own). Chapter 1's name
  input (`kind: 'clanname'`, `E.cleanClanName`, with suggestions) is the model. Where it is stored, how the page
  shows it from then on, and how a tom's lines read, are the spec's.
- **Flags:** none new besides her warrior name. `ch10Best` and `specialty` are read.

## The lesson kit

**No lesson and no new Count.** She arrives having passed every Count up to 10 × 10 in one sitting. At most
**one or two light story questions**, celebratory and impossible to get wrong in spirit (help as always), e.g.
counting something in the ceremony. The drafter may use none. Never a test.

## Steering calls (Claude's, under decision 46, except call 4, which is Aron's)

1. **The evening of her pass, whenever that is.** It may be the day after the Gathering or many days of play
   later, so the chapter never counts the days since the Gathering. The moon is up (not full: it waned since the
   Gathering; say "the moon", not its shape).
2. **Where: CrystalClan's camp, by night, the whole Clan in the clearing** (Aron left it to Claude). Glintstar on
   the camp's high place, the Clan in a ring, Tallyheart beside her apprentice, {Murmur}chime at the front as
   she promised, the old tom and the grey tom in the crowd, Thymeleaf by his den. The camp at night is moonlit and
   silver, never dark.
3. **The words of the ceremony are our own.** Glintstar speaks plainly and warmly: she names what {name}paw did
   this moon ("You noticed what was missing. You fed a friend who was hungry. You found out the truth, and you
   said it, to every Clan."), asks the Clan's promise and hers in a child's words, and gives her the name. **Never
   "StarClan", never the books' ceremony words.** Tallyheart's chapter 1 vouching ("Judge her by what she does,
   not by where she sleeps") comes back.
4. **The name (decision 52, Aron's: both).** Her warrior name is her own first part ({name}) with a new ending,
   as Tallyheart's and {Murmur}chime's are. Glintstar says she sees three endings in her:
   - one from `ch10Best`, what she said she will remember most of this moon (Sprinkle, her friends, finding the
     truth, or the Counts);
   - one from her `specialty` (noticing, sneaking, climbing, swimming, friends);
   - one from "this moon" itself (Tallyheart's promise: "this moon will be in it").
   She **taps one, or types her own ending**. Then Glintstar says the whole name, and the Clan calls it. Endings
   are plain English words a child would be proud of; **never "-star"** (leaders only), "-paw" or "-kit". The
   draft proposes the endings (three per value, so no reading repeats one) and the names check clears them.
5. **The Clan calls her name**, every cat, and the cheer reaches the river: Riffle hears it (he may come up to
   the camp's edge, an otter, cheering loudest), Waffles on her balcony hears it. A sign from Sprinkle: the mist
   stone in her nest, or a puff of mist on the river under the moon, gently, never sad: she is home, and happy.
6. **The vigil.** As new warriors do, she keeps watch over the sleeping camp till the first light, quiet, one or
   two short screens: the camp asleep, the moon, the river, a last thought of her moon. It must be calm and safe,
   never scary, and short.
7. **The end.** Dawn: Tallyheart finds her at the watch, proud; she sleeps in a warrior's nest, for the first
   time. Module 1 is done. The last lines are warm and whole; a light touch of what comes next (the badger's
   track, module 2) at most in the teaser, never a cliffhanger.
8. **From now on she is {Name}{ending}.** Chapters 1 to 10, read again, keep {name}paw (they happened before);
   the hub, her book and the bar use the warrior name once it is given. The spec decides how.
9. **Toms and she-cats** read alike: every line works with "he" and "she".
10. **Paths:** every cat has passed the Warrior Counts; told and kept, every found flag and every worry are
    history now. Read `specialty` and `ch10Best` for the name; at most a line each for anything else.

## Names (before drafting)

- **Name nobody new.** The endings are words, not names; the draft lists them, and its names check runs each
  ending as a suffix against both wikis (the Warriors Names page's suffix list, and whole names with common
  first parts: the check reports which endings are frequent canon suffixes, which is fine, as -heart is).
- **Words:** "warrior", "the ceremony", "a warrior's nest", "the watch". Not "StarClan", "Twoleg", "kittypet",
  "Ironsnake"; no "whisker-length" or "claw-length".

## Format

Chapter 10's story format exactly: the title "# Chapter 11: The Warrior Ceremony", an italic header with the
minutes, "How to read this draft" (only the marks this chapter uses), `##` sections, `---` between screens,
**Choose:**, **Type** (her ending), **Tap**, `[if …]` variants, second person present, the tokens, sound effects in
italics. It ends warm in her warrior's nest.

**The story only.** No notes beyond a closing block of at most 40 lines, `*For us*`, with the words and minutes,
the endings proposed (by value), the calls made (one line of reason each), and what module 2 inherits in a few
lines. Flags, the name's storage, art needs and build notes go in the spec (`11-the-warrior-ceremony.spec.md`).

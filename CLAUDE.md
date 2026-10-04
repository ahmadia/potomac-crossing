# CLAUDE.md

Orientation for Claude Code in this repository.

Potomac Crossing is a story game Aron is designing for Lissa (8) and her friends. Read
`README.md` first (decisions and open proposals), then `docs/world.md` and `docs/module-1.md`.

- **Phase: chapter 1 is built, not yet deployed** (it deploys when `main` is pushed to
  `ahmadia/potomac-crossing`; Aron, 2026-10-03: "do your thing"). The stack and
  file layout are in `docs/build.md`; follow it. Static site, no build step, no dependencies,
  GitHub Pages from `main`. **Bump `CACHE` in `sw.js` whenever a cached file changes**, or
  installed iPads keep the old version.
- Run the tests with `node --test` from the repo root (it finds `tests/*.test.js`; on Node 22+
  `node --test tests/` fails, because a directory argument is read as a file). Regenerate the
  storyboard with `node tools/storyboard.mjs` whenever `app/story/` or the tool changes; never
  hand-edit `docs/storyboard/`.
- Local check: `python3 -m http.server 8790` in the repo root, then `http://localhost:8790/`;
  `dev/gallery.html` shows all the art.
- **Decisions are Aron's.** Add new ones to the README's list with a date. A proposal moves
  to Decisions only when Aron confirms it.
- **Our own world.** Never use names from Wings of Fire or Warriors: tribes, Clans,
  characters, places, or their coined words (Twoleg, kittypet, StarClan, fresh-kill,
  Thunderpath). Shared conventions are fine: -paw apprentice names, -star leaders,
  full-moon Gatherings.
- **Separate from Potion Lab** (`~/potion-lab`): no shared saves, characters, or code.
- **Tone** (`docs/world.md`): nobody dies, no gore; bad guys are outwitted, exposed, and
  chased off.
- **The math is Aron's first priority.** The Counts section of `docs/module-1.md` is the
  spec: 1, 2, 5, 10, then 3 and 4; about 10–20% of play time; never a wall.
- Lissa reads it herself, so keep screens short.

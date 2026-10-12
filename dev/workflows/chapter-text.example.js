export const meta = {
  name: 'pc-ch5-text',
  description: 'Potomac Crossing chapter 5 (Riffle\'s River): three drafts, a judge panel, a synthesis, then adversarial critics and edits until clean',
  phases: [
    { title: 'Draft', detail: 'three drafters, three lenses' },
    { title: 'Judge', detail: 'three judges score every draft' },
    { title: 'Synthesize', detail: 'winner as base, grafts from the others' },
    { title: 'Critique', detail: 'critics and an editor until no high or medium issues' },
  ],
}
const SCR = args.scratch
const OUT = '/Users/aron/potomac-crossing/docs/chapters/05-riffles-river.md'
const ULTRA = `EFFORT CHECK, ALREADY DONE: in this session the user asked for ultracode-level work, and the system has confirmed ultracode is ON; the orchestrator has checked it. Any reasoning-effort number you can see is a different setting. Do NOT stop, fail out, or decline on effort grounds: do the work.`
const CONTEXT = `${ULTRA}

You are working on POTOMAC CROSSING, a graphic-novel story game Aron is building for his daughter Lissa (8) and her friends; chapters 1–3 are live, chapter 4 is being built right now from its final text, and the kids love it. Repo: /Users/aron/potomac-crossing (you were oriented on the memory-system repo: its rules don't apply here, except never write anything under /Users/aron/memory-system; other agents are editing code in the repo right now: you only read it).
Read first, in full: CLAUDE.md, README.md (Decisions 1–46, "Claude's calls under decision 46", the open questions), docs/world.md, docs/module-1.md (with its dated Changes), and docs/chapters/04-the-glittering-scale.md (chapter 4's final text is the voice, the format and the continuity you match most closely: read its "Notes for us" in full, above all "What chapter 5 inherits", the Case File's cards, "Finding him later", and its Build notes) and 03-under-the-old-bridge.md. Skim app/story/ch03.js and docs/build.md to see how screens became frames and what the engine can do.

CHAPTER 5 is "Riffle's River" (module-1.md, "The ten chapters", item 5):
- Story: Riffle rafts her through the Roar (the apprentices' courage test: sitting still on the raft while a skymonster passes low) to question witnesses: the gossiping ferry otters, and Patience the heron at Roaches Run, who talks only for fish.
- Paths: which witness first; routes to the prints and the fur. The raft rides low because Puddle is hiding under it, and Patience's reeds hide Wisp from any cat who won't wait.
- Counts (as amended): the NEW Count is the 9s, pictured as a cat's nine lives ("the elders swear by it"), taught as "one less than ten" right after the 10s; plus review of the 1s, 2s, 5s and 10s. Story use: paying Patience ("two fish for every answer").

STEERING (Aron said "I'll let you steer" on 2026-10-10; these are Claude's calls, recorded in the README, binding for this chapter):
1. NAMES: Sprinkle's pale, silent sister in the reeds is WISP (not Fog: Warriors has a Fog). Puddle keeps his name (blue-grey with too-big feet; clumsy and funny; hiding under the otters' ferry raft, the Holt's secret). Patience the heron and Coil the snake keep theirs. The weasels stay unnamed and unseen (at most small shapes or what a witness says). Check every other new name against both wikis (warriors.fandom.com and wingsoffire.fandom.com have allpages/search APIs you can curl); prefer naming nobody new.
2. THE THEFTS GO ON, four every night: this chapter opens on the fourth morning's count in rows of ten (sixteen gone in four nights, said, never asked as a sum), with something funny about why nobody saw (the old tom sat up by the pile and fell asleep); proper guards are chapter 6's (the 3s). Nobody solves the case here.
3. BOTH DRAGONETS ARE OPTIONAL and sticky (foundPuddle, foundWisp), each one short scene, each greeting her with a riddle that is secretly a Count she knows (not one already used: Sprinkle's 2 × 5 and 6 × 5, Squall's 7 × 5), each with a dragonet page in her book when found, each a witness: Puddle saw "something with clever little paws" by the pile on the storm night; Wisp saw the fox drop something glittering in the reeds. Puddle is found by noticing that the raft rides low, or by Riffle letting it slip; Wisp by waiting with Patience long enough (a patience mechanic: taps? choosing to wait again and again?). A player can find both, one, or neither.
4. SQUALL, FOR CATS WHO MISSED HIM: chapter 4's notes ("Finding him later") give chapter 5 one offer of the roof again for a cat without foundSquall. Include it as chapter 4's notes specify.
5. THE CASE FILE grows: every new card is one clear fact she saw (an eye) or a claim she was told (an ear), as chapter 4 set up: the witnesses' accounts (what the ferry otters gossip, what Patience saw: she sees everything; what each found dragonet saw), the prints and the fur by the routes module-1 gives. List every card in the notes (id, mark, picture, line, where, on which paths). Remember module-1's clue 4 as amended: the prints are TINY (smaller than a cat's), not "five-toed vs three-clawed".
6. THE WARRIOR THREAD: sitting still through the Roar is the apprentices' courage test, a real step toward warrior; one light, warm moment about it, never a promise before the ceremony chapter.
7. THE COUNTS (Aron's first priority): about 16 typed answers: a short adaptive warm-up on the 10s; the 9s introduced with their picture (nine lives) and the "one less than ten" idea in a way an 8-year-old can see and do (e.g. ten claws with one tucked away; the hop-by-tens-and-step-back; choose what is clearest and say why in the notes), a Tap; about 10 on the 9s in both orders; and 2–3 typed story questions paying Patience (two fish for every answer: the 2s, or mixed review of the 1s, 2s, 5s, 10s as module-1's table says). Help after a miss, it comes back two questions later, never a wall. The worry "scared of deep water" gets real weight on the raft (her brave moment proper is later, at night, in chapter 8: here Tallyheart's "one paw at a time" is honoured).
CONSTRAINTS: our own world (no Warriors / Wings of Fire names or coined words); tone (nobody dies, no gore, scary only with a friend near: the Roar is thrilling, loud, and safe, with Riffle beside her; no romance); Lissa reads it herself (short screens, dialogue first, no long runs with nothing to choose, type or tap); second person present; tokens as in chapter 4. Ends warm in her nest with the dream question; the hook to chapter 6 (The Snake in the Stones: Coil, the ReedClan patrol, the 3s and the guard patrols) is curious, never scary. Length about 1,900 words per playthrough without the optional scenes (each optional dragonet scene about 150–200 more), roughly 80–110 frames. Art budget: every place so far (see chapter 4's Art needs for the list, incl. the Crossing with its raft, the riverbank, the roof) plus at most TWO new places (the raft out on the open river under the Roar; Roaches Run's marsh with Patience's reeds); new cast: Patience (a great blue heron: tall, still, dry-witted, sees everything, talks only for fish), Puddle, Wisp (dragonets on Sprinkle's model), and the ferry otters already drawn.
FORMAT: exactly chapter 4's draft format (title "# Chapter 5: Riffle’s River", italic header, "How to read this draft", ## sections, '---' between screens, **Choose:** / **Type** / **Tap**, the lesson with its facts in order, [if …] variants, and the closing italic "Notes for us": flags, the Counts tally, the Case File cards, clues, themes, tone, per-path word counts, art needs, Build notes for everything the engine doesn't do yet, "What chapter 6 inherits", and "For Aron" (now a record of the calls made and anything truly his).`

const DRAFT = { type: 'object', properties: { path: { type: 'string' }, summary: { type: 'string' }, words: { type: 'string' }, names: { type: 'array', items: { type: 'string' } } }, required: ['path', 'summary', 'words', 'names'] }
const LENSES = [
  { key: 'adventure', brief: 'ADVENTURE AND WONDER FIRST: the raft, the wide shining river, the Roar passing overhead as a huge thrilling courage test, the marsh at dawn-quiet with the heron: a river journey a child remembers. The dragonets under the raft and in the reeds are delightful discoveries.' },
  { key: 'detective', brief: 'THE DETECTIVE FIRST: questioning witnesses is the heart: the otters\' gossip (which bits are true?), Patience\'s dry precision, each account a card to check against the others; a sharp child feels the case tightening without it being solved. The 9s and the fish payments are woven into the questioning.' },
  { key: 'reader', brief: 'LISSA READS IT HERSELF, AND THE 9s ARE CLEAR: short clear screens, easy meaningful choices, no long runs without something to do; the 9s taught so an 8-year-old really gets "one less than ten"; funny throughout (Riffle, the otters, Puddle\'s too-big feet, Patience\'s deadpan); every flag combination handled cleanly.' },
]
phase('Draft')
const drafts = (await parallel(LENSES.map(L => () => agent(CONTEXT + `\n\nYOUR LENS: ${L.brief}\n\nWrite a COMPLETE chapter 5 draft (every flag variant, the lesson, both optional dragonet scenes, the Squall offer, the ending, the notes) to ${SCR}/draft-${L.key}.md (create the directory; write nowhere else). Return the summary, per-playthrough words, and every new name you used.`,
  { label: `draft:${L.key}`, phase: 'Draft', schema: DRAFT }).then(r => r ? { ...r, key: L.key } : null)))).filter(Boolean)

const JUDGE = { type: 'object', properties: {
  scores: { type: 'array', items: { type: 'object', properties: { draft: { type: 'string' }, total: { type: 'number' }, strengths: { type: 'array', items: { type: 'string' } }, problems: { type: 'array', items: { type: 'string' } } }, required: ['draft', 'total', 'strengths', 'problems'] } },
  winner: { type: 'string' }, grafts: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, what: { type: 'string' } }, required: ['from', 'what'] } } }, required: ['scores', 'winner', 'grafts'] }
phase('Judge')
const list = drafts.map(d => `- "${d.key}": ${d.path}`).join('\n')
const FOCUS = [
  'as Aron: fidelity to module-1 and the steering calls, the case kept fair and unsolved, the 9s taught well (his first priority), continuity with chapters 1–4, tone',
  'as Lissa (8), a Warriors fan reading alone on an iPad who loves Sprinkle and Riffle and wants to be a warrior: which would she love, laugh at, and remember',
  'as a children\'s mystery editor and comics writer: voice consistent with chapter 4, panel-sized screens, economy, the witnesses as characters, the clue design (each card one clear fact or claim), the jokes',
]
const judgements = (await parallel(FOCUS.map((f, i) => () => agent(CONTEXT + `\n\nYou are JUDGE ${i + 1}, judging ${f}. Read every draft in full:\n${list}\n\nScore each (total out of 70: fidelity, voice, readability, humor, adventure/mystery, Counts, feasibility, 10 each), name the base, and list specific grafts from the others (quote them). List real problems.`,
  { label: `judge:${i + 1}`, phase: 'Judge', schema: JUDGE })))).filter(Boolean)
const tally = {}
judgements.forEach(j => j.scores.forEach(s => { tally[s.draft] = (tally[s.draft] || 0) + s.total }))
log('judge totals ' + JSON.stringify(tally))

phase('Synthesize')
await agent(CONTEXT + `\n\nYou are the SYNTHESIZER. Drafts:\n${list}\nJudges' verdicts:\n${JSON.stringify(judgements, null, 1)}\nTotals: ${JSON.stringify(tally)}\n\nRead all three in full. Build from the strongest base, graft in the best of the others, fix every problem the judges raised, keep one voice (chapter 4's). Write the chapter to ${OUT} as "Draft v0.1 · 2026-10-10". End with the full italic "Notes for us". Return what you took from where.`,
  { label: 'synthesize', phase: 'Synthesize' })

const CRIT = { type: 'object', properties: { issues: { type: 'array', items: { type: 'object', properties: {
  severity: { type: 'string', enum: ['high', 'medium', 'low'] }, where: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'where', 'problem', 'fix'] } } }, required: ['issues'] }
const CRITICS = [
  { key: 'rulings', lens: 'FIDELITY: module-1 chapter 5 beats (as amended); the steering calls 1–7 exactly; continuity with chapters 1–4 on every flag combination (ch3Told, foundSquall, ch4CaughtFly, ch2Path, ch2Stone, specialty, worry) and with chapter 4\'s "What chapter 5 inherits"; module-1 "The case" (sixteen in four nights; the prints tiny; nothing solved; the weasels unseen and unnamed; Reynard\'s claims still only claims); the Case File cards each one clear fact or claim.' },
  { key: 'math', lens: 'THE COUNTS: about 16 typed answers; the adaptive 10s warm-up; the 9s introduced so an 8-year-old can see "one less than ten" (is the method really clear, correct, and doable on screen?), a Tap, about 10 on the 9s in both orders, every 9s fact correct; paying Patience as review; the dragonets\' riddles (facts she knows, none repeated); help after a miss and it returns two questions later, never a wall; Tallyheart warm and specific; the Build notes for the Counts sets complete and consistent with docs/build.md.' },
  { key: 'world', lens: 'NAMES AND TONE: check every name and new word against both series (curl the wikis\' APIs); the Roar thrilling and safe, never frightening; the river never a danger that would scare an 8-year-old (a friend beside her always); Patience dry, never cruel; no gore; nobody dies; the fish paid to the heron handled as lightly as the prey pile.' },
  { key: 'reader', lens: 'READING AND PACE: an 8-year-old reading alone: short screens, words she knows, clear choices, no long runs with nothing to choose, type or tap; voice consistent with chapter 4; format right; per-playthrough length near 1,900 words without the optional scenes (measure every path); the waiting mechanic for Wisp fun, not tedious.' },
]
phase('Critique')
let round = 0, last = []
while (round < 3) {
  round++
  const found = (await parallel(CRITICS.map(c => () => agent(CONTEXT + `\n\nYou are an ADVERSARIAL CRITIC (round ${round}). Lens: ${c.lens}\nRead ${OUT} in full. Report every real problem with severity (high = breaks module-1, a steering call, the math spec, continuity or a constraint; medium = clearly worse for Lissa or off-voice; low = polish), where, and the exact fix. Taste is never high. Do not edit.`,
    { label: `critic:${c.key}:r${round}`, phase: 'Critique', schema: CRIT })))).filter(Boolean)
  if (found.length < CRITICS.length) return { stopped: 'a critic failed (session limit?): resume to rerun it', round }
  const issues = found.flatMap(r => r.issues)
  last = issues
  const serious = issues.filter(i => i.severity !== 'low')
  log(`round ${round}: ${issues.length} issues, ${serious.length} high/medium`)
  if (!serious.length) break
  await agent(CONTEXT + `\n\nYou are the EDITOR (round ${round}). Apply these findings to ${OUT} in place: every high and medium, lows that clearly help; skip a wrong one and say why. Keep the voice and format; bump the draft version; keep "Notes for us" accurate (re-measure per-path words).\n\nFindings:\n${JSON.stringify(issues, null, 1)}\n\nReturn what you changed and skipped.`,
    { label: `editor:r${round}`, phase: 'Critique' })
}
return { tally, drafts: drafts.map(d => ({ key: d.key, words: d.words, names: d.names })), rounds: round, lastRoundSerious: last.filter(i => i.severity !== 'low') }

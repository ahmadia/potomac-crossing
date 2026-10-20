export const meta = {
  name: 'pc-chapter',
  description: 'Potomac Crossing: one phase of a chapter (args.phase: draft, critique, spec, build, frames, review, integrate or final); stops cleanly at a failed agent',
  whenToUse: 'Making chapters 6 to 10, one phase per run; the order and the args are in dev/workflows/README.md',
  phases: [
    { title: 'Draft', detail: 'two drafters; a names check if a draft named anyone new' },
    { title: 'Judge', detail: 'two judges score both drafts' },
    { title: 'Synthesize', detail: 'the stronger base, grafts from the other' },
    { title: 'Critique', detail: 'four lenses, then only the lenses that found something; at most two rounds' },
    { title: 'Spec', detail: 'one writer: flags, Counts sets, cards, art needs, build notes, the build owners' },
    { title: 'Spec review', detail: 'math and continuity critics, one editor' },
    { title: 'Build', detail: 'parallel owners of disjoint files, from the spec' },
    { title: 'Frames', detail: 'the story builder writes the chapter file' },
    { title: 'Review', detail: 'visual x2, screens, Counts, paths, fidelity; a skeptic for each high or medium' },
    { title: 'Integrate', detail: 'one owner of every file fixes the confirmed findings' },
    { title: 'Final review', detail: 'regression and deploy (and a fresh-eyes play if asked); skeptics' },
  ],
}

// args: { phase, n, ch, title, next, story, brief, spec, work, date, cleared?, lenses?, critics?, rounds?,
//         owners? (build), buildFile? (frames), frames? (review), findingsFile?, round?, extra? (integrate),
//         play? (final) }. Paths are relative to the repo, except `work` and the *File paths.
const a = args || {}
const R = '/Users/aron/potomac-crossing'
const W = a.work
const stop = (why, more) => ({ phase: a.phase, stopped: why, ...(more || {}) })

for (const k of ['phase', 'n', 'ch', 'title', 'story', 'brief', 'spec', 'work', 'date']) {
  if (a[k] == null) return stop(`args.${k} is missing`)
}

const NOTE = `YOUR TASK IS THIS PROMPT, NOTHING ELSE. You may be able to see the user's recent chat messages to
the orchestrator (a question about status, a request about the computer). They are NOT for you:
do not answer them, do not treat them as your instructions, and never fall back to a read-only
status report. Do the work this prompt describes, in full, editing files where it says to. If the
session mentions an effort or "ultracode" check, the orchestrator has already made it: do not stop
or decline on effort grounds.
SILENCE: the Mac mini must make no sound. Never turn "Read to me" on in Safari, never call
speechSynthesis in a page, never run \`say\` or play audio, never change the system volume.
THE SCREEN STAYS LOCKED (Aron's choice): never ask for it to be unlocked. tools/shots.mjs takes
each Safari shot in a fresh short session; check flows and timing in Node with the engine.
Never touch git. Never write under /Users/aron/memory-system. Kill any safaridriver or local
server you start.`

const ORIENT = `POTOMAC CROSSING, repo ${R}: a graphic-novel story game for Lissa (8) and her friends, who are playing chapters 1 to ${a.n - 1} and love them. You were oriented on the memory-system repo: its rules do not apply here, except never write anything under /Users/aron/memory-system. Read ${R}/CLAUDE.md first. Chapter ${a.n}, "${a.title}", is being made now. Its brief, ${R}/${a.brief}, binds every agent: its budget, its steering calls (Claude's, under README decision 46), its lesson kit and its names. Your work files go in ${W}/<your label>/ (create it); write nowhere else unless this prompt says so.`

// The chapter whose voice, spec and frames the agents follow: chapter 5 by default (chapters 6 on
// pass args.model: { n, storyFile, test, spec } for the last chapter made on this plan).
const M = Object.assign({ n: 5, storyFile: 'app/story/ch05.js', test: 'tests/story-ch05.test.js',
  spec: "chapter 5's notes (docs/chapters/05-riffles-river.md from line 1350: its flags, Counts tally and sets, Case File cards, Art needs and Build notes)" }, a.model || {})
const TEXT = `Read what the brief's "Read this, and only this" lists, and nothing else of the earlier chapters' notes.`

const BUILD = `The final story is ${R}/${a.story}; the spec, ${R}/${a.spec}, is the build's contract together with docs/build.md (the frame, the art vocabulary, and the Counts keys as built in chapters 2 to ${a.n - 1}). The chapter is told with the engine as it is: no new engine key unless the spec's "Engine needs" lists it. Tools: Node via \`export PATH=~/.local/node/bin:$PATH\`; \`node --test\` from the repo root (the whole suite, about 30 seconds; it was green before this chapter began); \`node tools/frames.mjs ${a.ch} OUTDIR [frames]\` or \`--scene '<json>' OUTDIR NAME\` renders art to PNG through Quick Look; \`node tools/sheet.mjs OUT-%.png a.png b.png …\` makes contact sheets of six (use it; never write your own); \`node tools/shots.mjs OUTDIR ${a.ch}:f010 hub book file …\` takes real Safari screenshots, each target in a fresh short session (one Safari session at a time on this Mac: wait with \`pgrep -x safaridriver\`, never \`pgrep -f\`). Check flows, lines and timing in Node with the engine (\`require('./tests/_load.js').load()\`), not by tapping in Safari; what Read to me would say, through the engine. At most 30 looks at pictures; keep notes in your work dir as you go. Chapters 1 to ${a.n - 1} are live: they must look and play exactly as they do unless a change is deliberate and named.`

const P = (...parts) => [NOTE, ORIENT, ...parts].join('\n\n')
const j = x => JSON.stringify(x, null, 1)

const STR = { type: 'string' }
const STRS = { type: 'array', items: STR }
const ISSUES = { type: 'object', properties: { issues: { type: 'array', items: { type: 'object', properties: {
  severity: { type: 'string', enum: ['high', 'medium', 'low'] }, where: STR, problem: STR, fix: STR },
  required: ['severity', 'where', 'problem', 'fix'] } } }, required: ['issues'] }
const EDIT = { type: 'object', properties: { changed: STRS, skipped: { type: 'array', items: { type: 'object',
  properties: { finding: STR, why: STR }, required: ['finding', 'why'] } }, version: STR }, required: ['changed', 'skipped', 'version'] }
const FIND = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: {
  severity: { type: 'string', enum: ['high', 'medium', 'low'] }, file: STR, where: STR, problem: STR, evidence: STR, fix: STR },
  required: ['severity', 'file', 'where', 'problem', 'evidence', 'fix'] } } }, required: ['findings'] }
const VERDICT = { type: 'object', properties: { confirmed: { type: 'array', items: { type: 'object', properties: {
  index: { type: 'number' }, real: { type: 'boolean' }, reason: STR, severity: { type: 'string', enum: ['high', 'medium', 'low'] } },
  required: ['index', 'real', 'reason', 'severity'] } } }, required: ['confirmed'] }
const OWNERS = { type: 'array', items: { type: 'object', properties: { key: STR, files: STRS, brief: STR }, required: ['key', 'files', 'brief'] } }

const serious = list => list.filter(i => i.severity !== 'low')

// A reviewer's high and medium findings go to its own skeptic; lows pass through unverified.
async function verified(reviewers, phaseName, ctx) {
  const out = await pipeline(reviewers,
    r => agent(P(ctx, r.prompt, 'Report only real problems, with evidence and the exact fix. Severity: high = broken, or against a ruling, the brief, the spec, the contract or the math; medium = clearly worse for Lissa; low = polish. Do not edit repo files.'),
      { label: `${phaseName === 'Review' ? 'review' : 'final'}:${r.key}`, phase: phaseName, schema: FIND }),
    (res, r) => {
      if (!res) return null
      const fs = serious(res.findings || []), lows = (res.findings || []).filter(f => f.severity === 'low')
      if (!fs.length) return { key: r.key, kept: [], lows }
      return agent(P(ctx, `YOU ARE A SKEPTIC. Try to REFUTE each finding from reviewer "${r.key}" by re-checking the evidence yourself. real=true only when you confirm it; adjust the severity.\n\n${j(fs.map((f, i) => ({ index: i, ...f })))}`),
        { label: `verify:${r.key}`, phase: phaseName, schema: VERDICT })
        .then(v => v ? { key: r.key, kept: (v.confirmed || []).filter(c => c.real).map(c => fs[c.index] && { ...fs[c.index], severity: c.severity }).filter(Boolean), lows } : null)
    })
  if (out.some(x => !x)) return null
  return { kept: out.flatMap(x => x.kept), lows: out.flatMap(x => x.lows), byReviewer: out.map(x => ({ key: x.key, kept: x.kept.length, lows: x.lows.length })) }
}

// ------------------------------------------------------------------ draft: two drafts, two judges, a synthesis
if (a.phase === 'draft') {
  const LENSES = a.lenses || [
    { key: 'story', brief: 'THE STORY FIRST: the chapter\'s adventure, mystery and characters as module-1 and the brief have them: the case tightening without being solved, every new character vivid and funny, every scene one a child remembers.' },
    { key: 'reader', brief: 'LISSA READS IT HERSELF, AND THE COUNT IS CLEAR: short clear screens, easy meaningful choices, no long runs without something to choose, type or tap; the new Count taught so an 8-year-old really gets it, exactly as the brief\'s lesson kit says; funny throughout; every flag combination handled cleanly.' },
  ]
  const DRAFT = { type: 'object', properties: { path: STR, summary: STR, words: STR, names: STRS }, required: ['path', 'summary', 'words', 'names'] }
  phase('Draft')
  const drafts = await parallel(LENSES.map(L => () => agent(P(TEXT, `You are a DRAFTER. YOUR LENS: ${L.brief}\n\nWrite a COMPLETE chapter ${a.n} story in the brief's format (every flag variant, the lesson, the optional scene, the ending, the closing *For us* block) to ${W}/text/draft-${L.key}.md (create the directory; write nowhere else). Hold the budget: measure the plain path and the optional scene in words. Return a summary, the words and minutes on every path, and every name you used that is not already in docs/continuity.md.`),
    { label: `draft:${L.key}`, phase: 'Draft', schema: DRAFT }).then(r => r && { ...r, key: L.key })))
  if (drafts.some(d => !d)) return stop('a drafter failed (session limit?): resume to rerun it')

  const cleared = a.cleared || []
  const fresh = [...new Set(drafts.flatMap(d => d.names || []))].filter(x => !cleared.includes(x))
  let names = { names: [] }
  if (fresh.length) {
    names = await agent(P(`NAMES CHECK. Check each of these names, used by a draft of chapter ${a.n}, against both series: ${j(fresh)}. Use the method in the brief's "Names" section: curl https://warriors.fandom.com/api.php and https://wingsoffire.fandom.com/api.php (action=query&titles=NAME&redirects=1; list=allpages&apprefix=NAME; list=search&srsearch="NAME"), and read the Warriors wiki's Names page (action=parse&page=Names&prop=wikitext) for both halves of a compound name. A name is clear only when neither wiki has it as a page and neither half is on the Names page's prefix or suffix lists. Return each name with clear true or false and the evidence.`),
      { label: 'names-check', phase: 'Draft', schema: { type: 'object', properties: { names: { type: 'array', items: { type: 'object', properties: { name: STR, clear: { type: 'boolean' }, evidence: STR }, required: ['name', 'clear', 'evidence'] } } }, required: ['names'] } })
    if (!names) return stop('the names check failed (session limit?): resume to rerun it', { drafts })
  }
  log(`new names: ${fresh.length ? names.names.map(x => `${x.name} ${x.clear ? 'clear' : 'NOT clear'}`).join(', ') : 'none'}`)

  const JUDGE = { type: 'object', properties: {
    scores: { type: 'array', items: { type: 'object', properties: { draft: STR, total: { type: 'number' }, strengths: STRS, problems: STRS }, required: ['draft', 'total', 'strengths', 'problems'] } },
    winner: STR, grafts: { type: 'array', items: { type: 'object', properties: { from: STR, what: STR }, required: ['from', 'what'] } } }, required: ['scores', 'winner', 'grafts'] }
  const list = drafts.map(d => `- "${d.key}": ${d.path} (${d.words})`).join('\n')
  const FOCUS = [
    'as Aron: fidelity to module-1, to the brief and its steering calls; the case kept fair and unsolved; the new Count taught well (his first priority); continuity with docs/continuity.md; tone; the budget held',
    `as Lissa (8), a Warriors fan reading alone on an iPad who loves Sprinkle and Riffle and wants to be a warrior, and as a children's comics editor: which she would love, laugh at and remember; panel-sized screens, economy, the voice of chapter ${M.n}, the jokes`,
  ]
  phase('Judge')
  const judgements = await parallel(FOCUS.map((f, i) => () => agent(P(TEXT, `You are JUDGE ${i + 1}, judging ${f}. Read both drafts in full:\n${list}\n\nScore each out of 70 (fidelity, voice, readability, humor, adventure and mystery, the Counts, the budget: 10 each), name the base, and list specific grafts from the other (quote them). List the real problems in each.`),
    { label: `judge:${i + 1}`, phase: 'Judge', schema: JUDGE })))
  if (judgements.some(x => !x)) return stop('a judge failed (session limit?): resume to rerun it', { drafts })
  const tally = {}
  judgements.forEach(jd => jd.scores.forEach(s => { tally[s.draft] = (tally[s.draft] || 0) + s.total }))
  log('judge totals ' + JSON.stringify(tally))

  phase('Synthesize')
  const synth = await agent(P(TEXT, `You are the SYNTHESIZER. Drafts:\n${list}\nJudges' verdicts:\n${j(judgements)}\nTotals: ${JSON.stringify(tally)}\nNames check of the drafts' new names: ${j(names.names)}\n\nRead both drafts in full. Build from the stronger base, graft in the best of the other, fix every problem the judges raised, keep one voice (chapter ${M.n}'s), and hold the budget (re-measure every path). Use no new name the check did not clear, and no name outside the brief's cleared list unless the check cleared it. Write the chapter to ${R}/${a.story} as "Draft v0.1 · ${a.date}". Return what you took from where, and the words and minutes on every path.`),
    { label: 'synthesize', phase: 'Synthesize', schema: { type: 'object', properties: { took: STR, words: STR }, required: ['took', 'words'] } })
  if (!synth) return stop('the synthesizer failed (session limit?): resume to rerun it', { drafts, tally })
  return { phase: 'draft', drafts: drafts.map(d => ({ key: d.key, path: d.path, words: d.words, names: d.names })), tally, judgements, names: names.names, synth }
}

// ------------------------------------------------------------------ critique: at most two rounds
if (a.phase === 'critique') {
  const CRITICS = a.critics || [
    { key: 'fidelity', lens: 'FIDELITY: module-1\'s chapter beats as amended; the brief\'s steering calls exactly; continuity with docs/continuity.md on every flag combination it names (ch3Told, foundSquall, ch4CaughtFly, ch2Path, ch2Stone, specialty, worry, the dragonets found); the case (nothing solved; the weasels unseen and unnamed; Reynard\'s claims still only claims); each Case File card one clear thing she saw (an eye) or was told (an ear).' },
    { key: 'math', lens: 'THE COUNTS (Aron\'s first priority): the brief\'s lesson kit exactly; the arithmetic and order of every fact; both orders; the new facts the brief names; the warm-up, the Tap, the story questions (none the brief rules out), the riddle; help after a miss and never a wall; about 16 typed answers on the plain path; Tallyheart warm and specific.' },
    { key: 'world', lens: 'NAMES AND TONE: every name and coined word against both series (the brief\'s Names section has the method and the cleared list; curl the wikis for anything else); nobody dies, no gore, scary only with a friend near; the new characters as the brief draws them (funny, never frightening); no romance.' },
    { key: 'reader', lens: `READING AND PACE: an 8-year-old reading alone: short screens, words she knows, clear choices, no long runs without something to choose, type or tap; the voice of chapter ${M.n}; the format; the budget (measure every path: the plain path's words and the optional scene's, the typed answers, the frames the screens imply).` },
  ]
  const ROUNDS = a.rounds || 2
  phase('Critique')
  let lenses = CRITICS, round = 0, lastEdit = null
  const rounds = []
  while (round < ROUNDS && lenses.length) {
    round++
    const found = await parallel(lenses.map(c => () => agent(P(TEXT, `You are an ADVERSARIAL CRITIC (round ${round}). Lens: ${c.lens}\nRead ${R}/${a.story} in full, with the brief. Report every real problem with its severity (high = breaks module-1, a steering call, the lesson kit, continuity, the budget or a standing rule; medium = clearly worse for Lissa, or off-voice; low = polish), where, and the exact fix. Taste is never high. Do not edit.`),
      { label: `critic:${c.key}:r${round}`, phase: 'Critique', schema: ISSUES }).then(r => r && { key: c.key, issues: r.issues || [] })))
    if (found.some(x => !x)) return stop('a critic failed (session limit?): resume to rerun it', { round, rounds })
    const issues = found.flatMap(f => f.issues.map(i => ({ lens: f.key, ...i })))
    const hard = serious(issues)
    rounds.push({ round, issues: issues.length, serious: hard.length, byLens: found.map(f => ({ key: f.key, serious: serious(f.issues).length })) })
    log(`round ${round}: ${issues.length} issues, ${hard.length} high or medium`)
    if (!hard.length) { lastEdit = { lows: issues, skipped: [] }; break }
    const edit = await agent(P(TEXT, `You are the EDITOR (round ${round}). Apply these findings to ${R}/${a.story} in place: every high and medium, and the lows that clearly help; skip a wrong one and say why. Keep the voice and the format; bump the draft version; keep the closing *For us* block true (re-measure every path).\n\nFindings:\n${j(issues)}\n\nReturn what you changed and what you skipped.`),
      { label: `editor:r${round}`, phase: 'Critique', schema: EDIT })
    if (!edit) return stop('the editor failed (session limit?): resume to rerun it', { round, rounds })
    if (!edit.changed.length) return stop('the editor changed nothing: check its report', { round, rounds, edit })
    lastEdit = { lows: issues.filter(i => i.severity === 'low'), skipped: edit.skipped, version: edit.version }
    lenses = CRITICS.filter(c => found.some(f => f.key === c.key && serious(f.issues).length))
  }
  // what is left goes to the spec as "known" (docs/production.md: hard stop at two rounds)
  return { phase: 'critique', rounds, known: lastEdit }
}

// ------------------------------------------------------------------ spec: one writer, two critics, one editor
if (a.phase === 'spec') {
  const SPEC = { type: 'object', properties: { spec: STR, owners: OWNERS, stubs: STRS, engineNeeds: STRS }, required: ['spec', 'owners', 'stubs', 'engineNeeds'] }
  phase('Spec')
  const known = a.known || 'none given'
  const written = await agent(P(`You are the SPEC WRITER, the only agent who writes this chapter's spec. The story ${R}/${a.story} is final: do not change a word of it (if something in it cannot be built, say so in the spec's "For the orchestrator" list). Read the story, the brief, docs/continuity.md, docs/build.md (the contract: the frame, the art vocabulary, Counts and its keys as built in chapters 2 to ${a.n - 1}), app/engine.js where you need to see what a key does, the art vocabulary itself (\`export PATH=~/.local/node/bin:$PATH; node -e "const PC=require('./tests/_load.js').load(); console.log(JSON.stringify(PC.art.vocab))"\`), and, as the model of what a spec holds, ${M.spec}.

Write ${R}/${a.spec}, headed "# Chapter ${a.n} spec: ${a.title}" and "*v0.1 · ${a.date}*", with: (1) Flags: each new flag, its values, where it is set, sticky or replaced, who reads it; (2) Counts sets, using only keys the engine has, every fact in order; (3) the Case File cards (id, mark, line as lettered, where given, to whom, links); (4) Art needs: every set, camera, anchor and option the screens need, marking what is new; the new cast with every pose and mood; Counts art; (5) Build notes, screen by screen where the build needs one; (6) Engine needs: what the engine lacks (expected: none; the brief allows at most one new interaction); (7) Known issues the text critics left: ${typeof known === 'string' ? known : j(known)}; (8) What chapter ${a.n + 1} inherits; (9) Calls made, each with its reason; (10) For the orchestrator.

Then plan the parallel build. Owners each hold a disjoint set of files (a set file under app/art/sets/, app/art/scenes.js, app/art/cats.js, app/art/cards.js, the engine, UI and tools/storyboard.mjs words, and the tests and dev/gallery pages beside them), each with a brief that names exactly what to build from the spec. app/story/${a.ch}.js is the story builder's, later: it has no owner. Fewer owners is better: one for a file nothing new touches is waste. List every new file the orchestrator must stub before the build (a new set file, the story file). Return the spec path, the owners, the stubs and the engine needs.`),
    { label: 'spec-writer', phase: 'Spec', schema: SPEC })
  if (!written) return stop('the spec writer failed (session limit?): resume to rerun it')

  const LENSES = [
    { key: 'math', lens: `THE COUNTS: every Counts set in ${R}/${a.spec} against the story's lesson and questions: each fact's arithmetic and order, both orders, the brief's lesson kit, about 16 typed answers on the plain path, and every key one the engine has and means what the spec says (app/engine.js, docs/build.md).` },
    { key: 'continuity', lens: `CONTINUITY AND FEASIBILITY: ${R}/${a.spec} against the story and docs/continuity.md: flags (names, values, sticky or replaced), cards, cast, places, what the next chapter inherits; every art key either in PC.art.vocab or listed as new; every engine key existing or listed under Engine needs; the owners disjoint and complete (every new thing has exactly one owner, and no file two). The owners: ${j(written.owners)}` },
  ]
  phase('Spec review')
  const found = await parallel(LENSES.map(c => () => agent(P(`You are an ADVERSARIAL CRITIC of the chapter's spec. Lens: ${c.lens}\nReport every real problem with severity (high = the build would be wrong or impossible; medium = clearly worse; low = polish), where, and the exact fix. Do not edit.`),
    { label: `spec-critic:${c.key}`, phase: 'Spec review', schema: ISSUES }).then(r => r && { key: c.key, issues: r.issues || [] })))
  if (found.some(x => !x)) return stop('a spec critic failed (session limit?): resume to rerun it', { written })
  const issues = found.flatMap(f => f.issues.map(i => ({ lens: f.key, ...i })))
  let owners = written.owners, edit = null
  if (serious(issues).length) {
    edit = await agent(P(`You are the SPEC EDITOR. Apply these findings to ${R}/${a.spec} in place (every high and medium, the lows that clearly help; skip a wrong one and say why). Never change the story. Return what you changed and skipped, and the build owners as they now stand (all of them, revised where a finding asked).\n\nOwners:\n${j(owners)}\n\nFindings:\n${j(issues)}`),
      { label: 'spec-editor', phase: 'Spec review', schema: { type: 'object', properties: { ...EDIT.properties, owners: OWNERS }, required: [...EDIT.required, 'owners'] } })
    if (!edit) return stop('the spec editor failed (session limit?): resume to rerun it', { written, issues })
    if (!edit.changed.length) return stop('the spec editor changed nothing: check its report', { written, issues, edit })
    owners = edit.owners
  }
  return { phase: 'spec', spec: written.spec, owners, stubs: written.stubs, engineNeeds: written.engineNeeds, issues: issues.length, serious: serious(issues).length, edit }
}

// ------------------------------------------------------------------ build: parallel owners
if (a.phase === 'build') {
  const owners = a.owners
  if (!Array.isArray(owners) || !owners.length) return stop('args.owners is missing: pass the owners from the spec phase\'s result')
  const REPORT = { type: 'object', properties: { files: STRS, built: STR, vocab: STR, tests: STR, open: STRS }, required: ['files', 'built', 'vocab', 'tests', 'open'] }
  phase('Build')
  const builds = await parallel(owners.map(o => () => agent(P(BUILD, `You are one of ${owners.length} builders working IN PARALLEL in the same checkout. Edit ONLY the files you own: ${o.files.join(', ')}. Code against the spec and docs/build.md for what the others build, and report anything you need from another owner. Look at your art (renders; at most 30 looks; notes in ${W}/build-${o.key}/). Tests for everything new, in your own test files. Render a sample of chapters 1 to ${a.n - 1}'s frames that use your files before and after: byte-identical unless a change is deliberate and named. Return the structured report.\n\nYOUR PART (${o.key}): ${o.brief}`),
    { label: `build:${o.key}`, phase: 'Build', schema: REPORT }).then(r => r && { key: o.key, ...r })))
  if (builds.some(b => !b)) return stop('a builder failed (session limit?): resume to rerun it', { done: builds.filter(Boolean).map(b => b.key) })
  return { phase: 'build', builds }
}

// ------------------------------------------------------------------ frames: the story builder
if (a.phase === 'frames') {
  if (!a.buildFile) return stop('args.buildFile is missing: the saved result of the build phase')
  phase('Frames')
  const built = await agent(P(BUILD, `YOU ARE THE STORY BUILDER. The builders' reports are in ${a.buildFile}. You own app/story/${a.ch}.js (a stub: replace it), a new tests/story-${a.ch}.test.js, docs/storyboard/${a.ch}.md (generated), and the small changes to chapter ${a.n - 1} the spec asks for (its teaser, and its teaser test now that chapter ${a.n} exists). Cut the final story into graphic-novel frames exactly as ${M.storyFile} did chapter ${M.n} (read it in full: header, helpers, ids in reading order with letters for paths, captions then balloons, typographic quotes, a board on every frame, at most 50 words a frame, about 15 to 18 on average). Use only the art vocabulary (the spec and docs/build.md, verified against PC.art.vocab) and the engine keys as implemented (read app/engine.js): every screen, every flag combination, the optional scene, the cards on their frames, the Counts sets exactly as the spec has them, the book's recap (6 to 10 sentences on every path), dream and noDream, the teaser for chapter ${a.n + 1}${a.next ? ` ("${a.next}")` : ''}, and the closing frame in her nest. Tests: tests/story-${a.ch}.test.js modeled on ${M.test} and at least as strict, plus every test the spec's Build notes list. LOOK at every frame (node tools/frames.mjs ${a.ch} ${W}/frames/png, then tools/sheet.mjs; at most 30 looks) and fix composition until each panel reads as its board. Regenerate the storyboards (node tools/storyboard.mjs); run the whole suite (all green when you finish). Return the frame ids in reading order.`),
    { label: 'story-builder', phase: 'Frames', schema: { type: 'object', properties: { frames: STRS, notes: STR, tests: STR }, required: ['frames', 'notes', 'tests'] } })
  if (!built) return stop('the story builder failed (session limit?): resume to rerun it')
  log(`${built.frames.length} frames`)
  return { phase: 'frames', frames: built.frames, notes: built.notes, tests: built.tests }
}

// ------------------------------------------------------------------ review: six reviewers, each finding verified
if (a.phase === 'review') {
  const ids = a.frames
  if (!Array.isArray(ids) || !ids.length) return stop('args.frames is missing: the frame ids from the frames phase\'s result')
  const half = Math.ceil(ids.length / 2)
  const parts = [ids.slice(0, half), ids.slice(half)].filter(p => p.length)
  const REVIEWERS = parts.map((p, i) => ({ key: `visual-${i + 1}`, prompt: `VISUAL REVIEW of frames ${p.join(' ')}: render them (node tools/frames.mjs ${a.ch} ${W}/visual-${i + 1} ${p.join(' ')}), put them on contact sheets with tools/sheet.mjs (at most 30 looks), and compare each picture with its board, its lines and the story: place, light, cast, poses, moods, facing, sizes, faces visible, nothing broken or off-model, continuity with docs/continuity.md's "A later chapter keeps" column, and tone (funny, never frightening).` }))
  REVIEWERS.push(
    { key: 'screens', prompt: `REAL SCREENS in Safari (tools/shots.mjs, locked-screen mode, at most 30 shots; landscape by default, a few at SIZE=820x1180 and SIZE=390x844), with a test cat that has finished chapters 1 to ${a.n - 1} (read tools/shots.mjs for CAT): the lesson (the warm-up, the new Count with its picture, the Tap, the story questions and the riddle with their help), every Tap, frames with cards under the panel and the Case File with the new cards, the choices, the optional scene's offer, the dream and the last frame, then the hub with chapter ${a.n}, the book with the new dragonet page found and not found, the Training Hollow with ${a.n} Counts, the grown-ups corner. Lettering placed well and legible, nothing clipped, buttons right.` },
    { key: 'counts', prompt: `THE COUNTS (Aron's first priority): drive the real engine in Node through every chapter ${a.n} Counts set with scripted answers (right and fast, right and slow, misses at each position, misses on borrowed questions and on the riddle), and check every behaviour the spec's Counts sets and Build notes give, every fact's arithmetic and order, about 16 typed answers on the plain path, the Taps (nothing logged), the Training Hollow offering the new Count with a new claw mark, and that chapters 1 to ${a.n - 1}'s lessons behave exactly as before.` },
    { key: 'paths', prompt: `EVERY PATH: in Node with the real engine, play chapter ${a.n} from cats that finished chapters 1 to ${a.n - 1}, with every combination of the flags the chapter reads (from the spec), she-cat and tom, a player named "Murmur", the optional scene taken, refused and backed out of partway: render every caption, balloon, option and card with \`when\` as the UI does; check that no token is left unfilled, the tom's pronouns, each variant exactly when it should show, the sticky flags (set only at a scene's last frame; never unset), the cards on every path, Back through every path, the end reached, the book reading well on every path, the teaser; and that rereading an earlier chapter midway keeps her chapter ${a.n} place and her cards.` },
    { key: 'fidelity', prompt: `FIDELITY: app/story/${a.ch}.js against the final story, screen by screen and line by line, on every flag combination: every screen and line present, the wording faithful, nothing added that the story does not have (besides boards and agreed frame splits), choices, outcomes and flags, the cards (ids, pictures, lines, marks, where given), the Counts sets as the spec has them, the book true to what happened, the boards consistent with the story and the art, and the brief's steering calls.` },
  )
  phase('Review')
  const v = await verified(REVIEWERS, 'Review', BUILD)
  if (!v) return stop('a reviewer or its skeptic failed (session limit?): resume to rerun it')
  log(`${v.kept.length} confirmed (${v.kept.filter(f => f.severity === 'high').length} high), ${v.lows.length} low`)
  return { phase: 'review', ...v }
}

// ------------------------------------------------------------------ integrate: one owner of every file
if (a.phase === 'integrate') {
  if (!a.findingsFile) return stop('args.findingsFile is missing: the saved result of the review or final phase')
  const round = a.round || 1
  phase('Integrate')
  const done = await agent(P(BUILD, `YOU ARE THE INTEGRATOR and own every file in the repo; nobody else is editing. Read the findings in ${a.findingsFile}: its "kept" list is confirmed, its "lows" are optional.${a.extra ? ` Also, from the orchestrator: ${a.extra}` : ''} Fix every confirmed finding end to end across files (the art, the story, the engine: wire both ends of every fix, so nothing lands on one side only), and the lows where cheap and clearly right. A test for each behaviour change; render and look at every frame you change (at most 30 looks; notes in ${W}/integrate-r${round}/). Do not change how chapters 1 to ${a.n - 1}'s live frames are lettered or drawn unless a finding requires it, and name every live frame that changes. Regenerate the storyboards; keep the whole suite green; make sure CACHE in sw.js is past the live value (git show HEAD:sw.js, read-only) and every script index.html loads is in ASSETS. Return how many confirmed findings you read, what you fixed (by finding), what you did not and why, the files you changed, the live frames that changed, and the suite result.`),
    { label: `integrate:r${round}`, phase: 'Integrate', schema: { type: 'object', properties: {
      findings: { type: 'number' }, fixed: { type: 'array', items: { type: 'object', properties: { finding: STR, what: STR }, required: ['finding', 'what'] } },
      skipped: { type: 'array', items: { type: 'object', properties: { finding: STR, why: STR }, required: ['finding', 'why'] } },
      files: STRS, liveFramesChanged: STRS, suite: STR }, required: ['findings', 'fixed', 'skipped', 'files', 'liveFramesChanged', 'suite'] } })
  if (!done) return stop('the integrator failed (session limit?): resume to rerun it')
  if (done.findings > 0 && !done.files.length) return stop('the integrator changed no files: check its report', { done })
  return { phase: 'integrate', round, ...done }
}

// ------------------------------------------------------------------ final: regression and deploy, verified
if (a.phase === 'final') {
  const LENSES = [
    { key: 'regress', prompt: `REGRESSION against what is live (git HEAD, read-only: git show HEAD:path into ${W}/final-regress/, never a checkout in the repo): render every chapter 1 to ${a.n - 1} frame now and at HEAD and compare (any difference must be a deliberate, named fix); dump the lettering of every chapter 1 to ${a.n - 1} frame in Safari now and at HEAD at 1180x820 and 820x1180 and compare; run chapters 1 to ${a.n - 1}'s whole flows in the engine now and at HEAD on the same inputs; review the engine and UI diff for real bugs (saves and migration from live saves, Back, lessons, the hub, the book, the Hollow, gifts, the Case File, Read to me).` },
    { key: 'deploy', prompt: `DEPLOY: sw.js precaches every file index.html loads, nothing is missing on disk, CACHE is past the live value (git show HEAD:sw.js); the service-worker tests pass; real saves written by HEAD's engine (a cat who finished chapter ${a.n - 1} with and without its optional scenes; one partway through chapter ${a.n - 1}; one mid-lesson) load in the new engine and in Safari (fresh short sessions on a localhost server: the hub offers chapter ${a.n}, the book keeps the earlier chapters with their dreams and dragonet pages, the nest keeps her treasures and Riffle's stone, the Case File keeps her cards) with no console errors; open every screen once in Safari and collect console errors; list every untracked file a commit must include.` },
  ]
  if (a.play) LENSES.push({ key: 'play', prompt: `FRESH-EYES PLAYTEST: play chapter ${a.n} as Lissa would on every path (walk it with the engine in Node, printing the lines in order) and look at every frame (render all; contact sheets with tools/sheet.mjs; at most 30 looks). As a parent and an editor: does each picture show what the words say? Anything confusing, ugly, broken, off-model or scary? A line that reads wrong, a joke that misfires, the new Count clear?` })
  phase('Final review')
  const v = await verified(LENSES, 'Final review', BUILD)
  if (!v) return stop('a final reviewer or its skeptic failed (session limit?): resume to rerun it')
  log(`${v.kept.length} confirmed, ${v.lows.length} low`)
  return { phase: 'final', ...v }
}

return stop(`unknown phase "${a.phase}"`)

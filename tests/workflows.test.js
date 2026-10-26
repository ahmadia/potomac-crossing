/* dev/workflows/chapter.js, run against a stand-in for the Workflow runtime: every phase reaches its
 * end, stops cleanly when an agent fails, and opens every prompt with the standing note. No agent
 * runs and no token is spent: node --test */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SCRIPT = path.join(ROOT, 'dev/workflows/chapter.js');
const NOTE = fs.readFileSync(path.join(ROOT, 'dev/workflows/README.md'), 'utf8').match(/```\n(YOUR TASK IS THIS PROMPT[\s\S]*?)\n```/)[1];

// The smallest value a JSON schema accepts: one item in every array (so loops and pipelines run),
// the first value of an enum ('high' for a severity, so every round finds something).
function fake(s) {
  if (s.enum) return s.enum[0];
  if (s.type === 'object') return Object.fromEntries(Object.entries(s.properties || {}).map(([k, v]) => [k, fake(v)]));
  if (s.type === 'array') return [fake(s.items)];
  if (s.type === 'number') return 0;
  if (s.type === 'boolean') return true;
  return 'x';
}

async function run(args, reply) {
  const src = fs.readFileSync(SCRIPT, 'utf8').replace(/^export const meta = /m, 'const meta = __m.meta = ');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const calls = [], phases = [], m = {};
  const agent = async (prompt, opts = {}) => {
    calls.push({ prompt, opts });
    return reply ? reply(prompt, opts) : (opts.schema ? fake(opts.schema) : 'ok');
  };
  const parallel = thunks => Promise.all(thunks.map(t => t().catch(() => null)));
  const pipeline = (items, ...stages) => Promise.all(items.map(async (item, i) => {
    let v = item;
    for (const s of stages) { try { v = await s(v, item, i); } catch (e) { return null; } }
    return v;
  }));
  // the runtime forbids the clock and randomness (they would break resume)
  const NoDate = function () { throw new Error('Date is not available in a workflow'); };
  NoDate.now = NoDate;
  const NoRandom = Object.assign(Object.create(Math), { random: () => { throw new Error('Math.random is not available in a workflow'); } });
  const fn = new AsyncFunction('args', 'agent', 'parallel', 'pipeline', 'phase', 'log', 'budget', 'Date', 'Math', '__m', src);
  const result = await fn(args, agent, parallel, pipeline, t => phases.push(t), () => {}, { total: null }, NoDate, NoRandom, m);
  return { result, calls, phases, meta: m.meta };
}

const BASE = {
  n: 6, ch: 'ch06', title: 'The Snake in the Stones', next: 'The Counts Don’t Lie',
  story: 'docs/chapters/06-the-snake-in-the-stones.md', brief: 'docs/chapters/06-the-snake-in-the-stones.brief.md',
  spec: 'docs/chapters/06-the-snake-in-the-stones.spec.md', work: '/tmp/pc-work/ch06', date: '2026-10-18',
};
const PHASES = {
  draft: { cleared: ['Coil'] },
  critique: {},
  spec: { known: { lows: [], skipped: [] } },
  build: { owners: [{ key: 'cast', files: ['app/art/cats.js'], brief: 'Coil' }, { key: 'set-field', files: ['app/art/sets/field.js'], brief: 'the long grass' }] },
  frames: { buildFile: '/tmp/pc-work/ch06/build.json' },
  review: { frames: ['f001', 'f002', 'f003'] },
  integrate: { findingsFile: '/tmp/pc-work/ch06/review.json' },
  final: { play: true },
};

for (const [phase, extra] of Object.entries(PHASES)) {
  test(`chapter.js ${phase}: runs to its end, every prompt opens with the standing note, every phase is in meta`, async () => {
    const { result, calls, phases, meta } = await run(Object.assign({ phase }, BASE, extra));
    assert.equal(result.stopped, undefined, JSON.stringify(result));
    assert.equal(result.phase, phase);
    assert.ok(calls.length > 0);
    for (const c of calls) assert.ok(c.prompt.startsWith(NOTE), `${c.opts.label}: the standing note comes first`);
    const titles = meta.phases.map(p => p.title);
    for (const t of phases) assert.ok(titles.includes(t), `phase "${t}" is in meta.phases`);
    for (const c of calls) assert.ok(titles.includes(c.opts.phase), `${c.opts.label} names a phase from meta`);
  });

  test(`chapter.js ${phase}: a failed agent stops the run instead of reading as "no findings"`, async () => {
    const { result } = await run(Object.assign({ phase }, BASE, extra), () => null);
    assert.match(result.stopped, /failed/);
  });
}

test('chapter.js: missing args stop before any agent runs', async () => {
  for (const [args, re] of [
    [Object.assign({}, BASE, { phase: 'draft', n: undefined }), /args\.n is missing/],
    [Object.assign({ phase: 'build' }, BASE), /owners is missing/],
    [Object.assign({ phase: 'frames' }, BASE), /buildFile is missing/],
    [Object.assign({ phase: 'review' }, BASE), /frames is missing/],
    [Object.assign({ phase: 'integrate' }, BASE), /findingsFile is missing/],
    [Object.assign({ phase: 'polish' }, BASE), /unknown phase/],
  ]) {
    const { result, calls } = await run(args);
    assert.match(result.stopped, re);
    assert.equal(calls.length, 0);
  }
});

test('chapter.js critique: at most two rounds, round 2 only for the lenses that found something, and an editor that changes nothing stops it', async () => {
  const { result, calls } = await run(Object.assign({ phase: 'critique' }, BASE));
  assert.equal(result.rounds.length, 2);
  assert.equal(calls.filter(c => /^critic:/.test(c.opts.label)).length, 8);
  const quiet = await run(Object.assign({ phase: 'critique' }, BASE), (p, o) => {
    if (/^critic:(math|world|reader)/.test(o.label)) return { issues: [] };
    return fake(o.schema);
  });
  assert.deepEqual(quiet.calls.filter(c => /:r2$/.test(c.opts.label) && /^critic/.test(c.opts.label)).map(c => c.opts.label), ['critic:fidelity:r2']);
  const idle = await run(Object.assign({ phase: 'critique' }, BASE), (p, o) => o.label.startsWith('editor') ? { changed: [], skipped: [], version: 'v0.2' } : fake(o.schema));
  assert.match(idle.result.stopped, /changed nothing/);
});

test('chapter.js draft: a name outside the cleared list is checked against the wikis before the synthesis', async () => {
  const { calls } = await run(Object.assign({ phase: 'draft' }, BASE, { cleared: ['x'] }));
  assert.equal(calls.filter(c => c.opts.label === 'names-check').length, 0);
  const named = await run(Object.assign({ phase: 'draft' }, BASE, { cleared: [] }));
  const labels = named.calls.map(c => c.opts.label);
  assert.ok(labels.indexOf('names-check') >= 0 && labels.indexOf('names-check') < labels.indexOf('synthesize'));
});

test('chapter.js integrate: an integrator that read findings and changed no files stops the run', async () => {
  const { result } = await run(Object.assign({ phase: 'integrate', findingsFile: '/tmp/x.json' }, BASE),
    () => ({ findings: 3, fixed: [], skipped: [], files: [], liveFramesChanged: [], suite: 'green' }));
  assert.match(result.stopped, /changed no files/);
});

test('chapter.js review and final: only high and medium findings go to a skeptic, and only confirmed ones are kept', async () => {
  const reply = (p, o) => {
    if (o.label.startsWith('verify:')) return { confirmed: [{ index: 0, real: true, reason: 'seen', severity: 'medium' }, { index: 1, real: false, reason: 'not so', severity: 'high' }] };
    return { findings: [
      { severity: 'high', file: 'a', where: 'f1', problem: 'p1', evidence: 'e', fix: 'f' },
      { severity: 'medium', file: 'a', where: 'f2', problem: 'p2', evidence: 'e', fix: 'f' },
      { severity: 'low', file: 'a', where: 'f3', problem: 'p3', evidence: 'e', fix: 'f' },
    ] };
  };
  const gapsNone = (p, o) => /:gaps$/.test(o.label) ? { gaps: [] } : reply(p, o);
  const { result, calls } = await run(Object.assign({ phase: 'review', frames: ['f1', 'f2'] }, BASE), gapsNone);
  assert.equal(calls.filter(c => c.opts.label.startsWith('review:') && c.opts.label !== 'review:gaps').length, 6);
  assert.equal(result.kept.length, 6, 'one confirmed finding per reviewer');
  assert.ok(result.kept.every(f => f.problem === 'p1' && f.severity === 'medium'));
  assert.equal(result.lows.length, 6);
  const fin = await run(Object.assign({ phase: 'final' }, BASE), gapsNone);
  assert.deepEqual(fin.calls.filter(c => /^final:(?!gaps)/.test(c.opts.label)).map(c => c.opts.label), ['final:regress', 'final:deploy', 'final:play'], 'the playtest runs unless play: false');
  const noPlay = await run(Object.assign({ phase: 'final', play: false }, BASE), gapsNone);
  assert.equal(noPlay.calls.filter(c => /^final:(?!gaps)/.test(c.opts.label)).length, 2);
});

test('chapter.js: no prompt carries an unfilled ${…}, and args.model names the chapter the agents follow', async () => {
  const model = { n: 6, storyFile: 'app/story/ch06.js', test: 'tests/story-ch06.test.js', spec: 'chapter 6’s spec' };
  for (const [phase, extra] of Object.entries(PHASES)) {
    const { calls } = await run(Object.assign({ phase, model }, BASE, extra));
    for (const c of calls) assert.ok(!/\$\{/.test(c.prompt), `${c.opts.label}: an unfilled \${…}`);
    if (phase === 'critique') assert.ok(calls.some(c => /the voice of chapter 6/.test(c.prompt)), 'the reader critic hears chapter 6');
    if (phase === 'frames') assert.ok(calls.some(c => /app\/story\/ch06\.js did chapter 6/.test(c.prompt) && /tests\/story-ch06\.test\.js/.test(c.prompt)));
    if (phase === 'spec') assert.ok(calls.some(c => /chapter 6’s spec/.test(c.prompt)));
  }
  const { calls } = await run(Object.assign({ phase: 'draft', model }, BASE, { cleared: ['x'] }));
  assert.ok(calls.some(c => c.opts.label === 'judge:2' && /the voice of chapter 6/.test(c.prompt)), 'the second judge hears chapter 6');
});

test('chapter.js: every agent runs at args.effort, xhigh by default', async () => {
  for (const [phase, extra] of Object.entries(PHASES)) {
    const { calls } = await run(Object.assign({ phase }, BASE, extra));
    for (const c of calls) assert.equal(c.opts.effort, 'xhigh', `${c.opts.label}: xhigh`);
    const high = await run(Object.assign({ phase, effort: 'high' }, BASE, extra));
    for (const c of high.calls) assert.equal(c.opts.effort, 'high', `${c.opts.label}: args.effort`);
  }
});

test('chapter.js review: the completeness critic sees what each reviewer checked, and each gap (at most four) gets a reviewer and a skeptic', async () => {
  const gaps = Array.from({ length: 6 }, (_, i) => ({ key: `g${i}`, prompt: `check gap ${i}` }));
  const { result, calls } = await run(Object.assign({ phase: 'review', frames: ['f1', 'f2'] }, BASE), (p, o) => {
    if (o.label === 'review:gaps') return { gaps };
    if (o.label.startsWith('verify:')) return { confirmed: [{ index: 0, real: true, reason: 'seen', severity: 'high' }] };
    return { findings: [{ severity: 'high', file: 'a', where: o.label, problem: 'p', evidence: 'e', fix: 'f' }], checked: [`what ${o.label} checked`] };
  });
  const critic = calls.find(c => c.opts.label === 'review:gaps');
  assert.ok(/what review:counts checked/.test(critic.prompt) && /what review:visual-1 checked/.test(critic.prompt));
  assert.deepEqual(calls.filter(c => /^review:gap-/.test(c.opts.label)).map(c => c.opts.label), ['review:gap-g0', 'review:gap-g1', 'review:gap-g2', 'review:gap-g3']);
  assert.equal(calls.filter(c => /^verify:gap-/.test(c.opts.label)).length, 4);
  assert.equal(result.kept.length, 6 + 4);
  assert.deepEqual(result.gaps, ['g0', 'g1', 'g2', 'g3']);
  const failed = await run(Object.assign({ phase: 'review', frames: ['f1'] }, BASE), (p, o) => o.label === 'review:gaps' ? null : fake(o.schema));
  assert.match(failed.result.stopped, /completeness critic/);
});

test('chapter.js integrate: an independent checker reads the integrator\'s report, and what did not land is returned', async () => {
  const { result, calls } = await run(Object.assign({ phase: 'integrate', findingsFile: '/tmp/x.json' }, BASE), (p, o) => {
    if (/:check$/.test(o.label)) return { results: [{ finding: 'a', landed: true, evidence: 'e' }, { finding: 'b', landed: false, evidence: 'e' }], broken: [], suite: '10/10' };
    return { findings: 2, fixed: [{ finding: 'a', what: 'fixed it' }], skipped: [], files: ['app/ui.js'], liveFramesChanged: [], suite: 'green' };
  });
  const check = calls.find(c => c.opts.label === 'integrate:r1:check');
  assert.ok(check && /fixed it/.test(check.prompt) && /\/tmp\/x\.json/.test(check.prompt));
  assert.deepEqual(result.unlanded.map(r => r.finding), ['b']);
  const failed = await run(Object.assign({ phase: 'integrate', findingsFile: '/tmp/x.json' }, BASE), (p, o) => /:check$/.test(o.label) ? null : { findings: 1, fixed: [], skipped: [], files: ['a'], liveFramesChanged: [], suite: 'g' });
  assert.match(failed.result.stopped, /checker failed/);
});

test('chapter.js review: args.reviewers adds lenses, each with its own skeptic', async () => {
  const { calls } = await run(Object.assign({ phase: 'review', frames: ['f1'], reviewers: [{ key: 'continuity', prompt: 'CONTINUITY: check it' }] }, BASE), (p, o) => {
    if (o.label === 'review:gaps') return { gaps: [] };
    return fake(o.schema);
  });
  const r = calls.find(c => c.opts.label === 'review:continuity');
  assert.ok(r && /CONTINUITY: check it/.test(r.prompt));
  assert.ok(calls.some(c => c.opts.label === 'verify:continuity'));
});

test('chapter.js spec: args.extra reaches the writer and args.specLenses adds critics', async () => {
  const { calls } = await run(Object.assign({ phase: 'spec', extra: 'CODE AGAINST THE BRANCH', specLenses: [{ key: 'pick', lens: 'THE CARD PICK' }] }, BASE));
  assert.ok(/Also, from the orchestrator: CODE AGAINST THE BRANCH/.test(calls.find(c => c.opts.label === 'spec-writer').prompt));
  assert.deepEqual(calls.filter(c => /^spec-critic:/.test(c.opts.label)).map(c => c.opts.label), ['spec-critic:math', 'spec-critic:continuity', 'spec-critic:pick']);
  assert.ok(!calls.some(c => /about 16 typed answers/.test(c.prompt)));
});

#!/usr/bin/env node
/* Potomac Crossing: the test suite in two tiers, each run at most four files at a time (four agents running the
 * whole suite at once, each file in a process of its own, took the mini to a load of 150 and a suite to 30 minutes).
 *
 *   node tools/test.mjs --fast [FILE…]   every test file but the slow ones (SLOW below), and any FILE named (a slow
 *                                        one you need, say). What agents run while they work.
 *   node tools/test.mjs --full           every test file: once at the end, only where the prompt says so.
 *   node tools/test.mjs --list [--fast]  the files a tier runs (nothing is run)
 *   --verbose                            every test's line as it runs (otherwise: the failures and the totals)
 *   TEST_CONCURRENCY=2                   fewer files at a time (4 at most)
 *
 * `node --test` is unchanged: it still runs everything, as before. The full TAP of the last run of each tier is kept
 * in ~/potomac-crossing-work/tests/last-<tier>.tap. The last line gives the tier's time and its peak memory (every
 * test process together, sampled each second).
 *
 * SLOW: measured on the mini (2026-11-02, one file at a time, nothing else running): tests/scenes.test.js 37 s and
 * 2.5 GB (the byte-for-byte fingerprints of every shipped frame); cats.test.js 8 s and 1.4 GB (every cast member's
 * fingerprints); golden-ch07, -ch08 and -ch09 6 to 9 s each (whole recorded readings); warrior-engine.test.js 9 s
 * (the goldens' cats migrated). Every other file is under 8 s and 520 MB, most under 3 s.
 */
import { spawn, execFileSync } from 'child_process';
import { createWriteStream, mkdirSync, readdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { basename, dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SLOW = ['scenes.test.js', 'cats.test.js', 'golden-ch07.test.js', 'golden-ch08.test.js', 'golden-ch09.test.js', 'warrior-engine.test.js'];
export const MAX_CONCURRENCY = 4;

/* Every test file node --test would run, in its order (tests/*.test.js). */
export function allFiles() { return readdirSync(join(ROOT, 'tests')).filter((f) => f.endsWith('.test.js')).sort().map((f) => 'tests/' + f); }
/* A tier's files: --full is every file; --fast every file but SLOW, plus the named ones. */
export function tierFiles(tier, named = []) {
  const all = allFiles();
  if (tier === 'full') return all;
  const extra = named.map((f) => 'tests/' + basename(f)).filter((f) => all.includes(f));
  return all.filter((f) => !SLOW.includes(basename(f)) || extra.includes(f));
}

/* The resident memory of a process and all its descendants, in KB (ps, every process once). */
function treeRss(pid) {
  let out = '';
  try { out = execFileSync('ps', ['-axo', 'pid=,ppid=,rss='], { encoding: 'utf8' }); } catch { return 0; }
  const kids = new Map(), rss = new Map();
  for (const l of out.trim().split('\n')) { const [p, pp, r] = l.trim().split(/\s+/).map(Number); rss.set(p, r); if (!kids.has(pp)) kids.set(pp, []); kids.get(pp).push(p); }
  let sum = 0;
  const stack = [pid];
  while (stack.length) { const p = stack.pop(); sum += rss.get(p) || 0; for (const k of kids.get(p) || []) stack.push(k); }
  return sum;
}

async function main() {
  const argv = process.argv.slice(2);
  const tier = argv.includes('--full') ? 'full' : argv.includes('--fast') ? 'fast' : null;
  const named = argv.filter((a) => !a.startsWith('--'));
  if (argv.includes('--list')) { for (const f of tierFiles(tier || 'fast', named)) console.log(f); return; }
  if (!tier) { console.error('usage: node tools/test.mjs --fast [FILE…] | --full   (--list, --verbose; see the top of this file)'); process.exit(2); }
  const files = tierFiles(tier, named);
  const conc = Math.max(1, Math.min(MAX_CONCURRENCY, +(process.env.TEST_CONCURRENCY || MAX_CONCURRENCY)));
  const verbose = argv.includes('--verbose');
  const logDir = join(homedir(), 'potomac-crossing-work/tests');
  mkdirSync(logDir, { recursive: true });
  const logFile = join(logDir, 'last-' + tier + '.tap');
  const log = createWriteStream(logFile);
  const t0 = Date.now();
  const child = spawn(process.execPath, ['--test', '--test-concurrency=' + conc, '--test-reporter=tap', ...files], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  let peak = 0;
  const sample = setInterval(() => { peak = Math.max(peak, treeRss(child.pid)); }, 1000);
  const totals = {}, fails = [];
  let buf = '', cur = null;
  const line = (l) => {
    log.write(l + '\n');
    if (verbose) console.log(l);
    const t = l.match(/^# (tests|suites|pass|fail|cancelled|skipped|todo|duration_ms) ([\d.]+)/);
    if (t) totals[t[1]] = +t[2];
    // a failing test at any depth, with its YAML block (the error and where), kept short
    const nk = l.match(/^(\s*)not ok \d+ - (.*)$/);
    if (nk) { cur = { name: nk[2], depth: nk[1].length, lines: [] }; fails.push(cur); return; }
    if (cur && /^\s*(ok|not ok) \d+/.test(l)) cur = null;
    else if (cur && cur.lines.length < 24 && /^\s+\S/.test(l) && !/^(duration_ms|type|location|---|\.\.\.)/.test(l.trim())) cur.lines.push(l.trim());
  };
  child.stdout.on('data', (d) => { buf += d; const parts = buf.split('\n'); buf = parts.pop(); parts.forEach(line); });
  child.stderr.on('data', (d) => { log.write(d); process.stderr.write(d); });
  const code = await new Promise((r) => child.on('close', r));
  if (buf) line(buf);
  clearInterval(sample);
  log.end();
  const secs = Math.round((Date.now() - t0) / 100) / 10;
  // a failing subtest's parent fails too ("subtestsFailed"): show the failures themselves
  const leaves = fails.filter((f) => !f.lines.some((l) => /subtestsFailed/.test(l)));
  if (!verbose) for (const f of leaves.slice(0, 20)) console.log('not ok - ' + f.name + '\n  ' + f.lines.join('\n  '));
  if (leaves.length > 20) console.log('… ' + (leaves.length - 20) + ' more failures in ' + logFile);
  console.log(tier + ': ' + files.length + ' files, ' + (totals.tests ?? '?') + ' tests, ' + (totals.pass ?? '?') + ' pass, ' + (totals.fail ?? '?') + ' fail' +
    (totals.cancelled ? ', ' + totals.cancelled + ' cancelled' : '') + (totals.skipped ? ', ' + totals.skipped + ' skipped' : '') + ', in ' + secs + ' s at ' + conc +
    ' files at a time; peak memory ' + (Math.round(peak / 1048576 * 10) / 10) + ' GB (full TAP: ' + logFile + ')');
  process.exitCode = code == null ? 1 : code;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

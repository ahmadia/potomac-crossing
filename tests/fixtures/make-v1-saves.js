#!/usr/bin/env node
/* Writes tests/fixtures/v1-saves.json: real version-1 saves, made by the version-1 engine
 * (tests/fixtures/engine-v1.js) playing the real chapter 1, the way the shipped game stored them
 * under 'potomac-crossing.v1'. Deterministic (fixed ids and clock), so the file only changes when
 * chapter 1 does. Run: node tests/fixtures/make-v1-saves.js
 *
 * The cats:
 *   finished   chapter 1 done, dream typed, two Hollow rounds (one with a miss): two treasures
 *   partway    on f040, flags and choices so far, a page of history
 *   lesson     mid-lesson on f062: four answers in, 3 × 1 missed and waiting to come back
 *   hollow     chapter 1 done, three clean rounds (the claw mark glows), a fourth round half done
 *   reread     chapter 1 done, dream skipped, reading it again from the start (on f010)
 *   fresh      just added: no chapter yet
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { v1, play, hollowRound, script } = require('./v1.js');

const { E, story } = v1();
function cat(save, id, now) {
  const c = E.addCat(save, { now });
  c.id = id; save.current = id;
  return c;
}
const saves = {};

// save 1: four cats on one device (the device is full)
{
  const save = E.newSave();
  save.settings.readAloud = true;
  const a = cat(save, 'cat-finished', 1000);
  E.startChapter(a, story, 1000);
  const sa = script({ choices: { f014: 0, f018: 0, f028: 0, f045: 2, f066: 1 }, t: 1000 });
  play(E, story, a, sa);
  hollowRound(E, a, story, Object.assign(sa, { miss: ['5x1', '1x5'] }));
  hollowRound(E, a, story, Object.assign(sa, { miss: [] }));

  const b = cat(save, 'cat-partway', 2000000);
  E.startChapter(b, story, 2000000);
  play(E, story, b, script({ choices: { f014: 3, f018: 1, f028: 1 }, t: 2000000 }), 'f040');

  const c = cat(save, 'cat-lesson', 3000000);
  E.startChapter(c, story, 3000000);
  play(E, story, c, script({ choices: { f014: 4, f018: 0, f028: 0, f045: 0 }, t: 3000000, stopIn: { f062: 4 }, miss: ['3x1'] }));

  const d = cat(save, 'cat-hollow', 4000000);
  E.startChapter(d, story, 4000000);
  const sd = script({ look: { sex: 'tom', fur: 'ginger', marking: 'nose-splash', eyes: 'amber' }, petname: 'Sir Pounce-a-lot', clanname: 'storm', choices: { f014: 2, f018: 1, f028: 1, f045: 1, f066: 3 }, miss: [], ms: 1500, t: 4000000 });
  play(E, story, d, sd);
  hollowRound(E, d, story, sd); hollowRound(E, d, story, sd); hollowRound(E, d, story, sd);
  hollowRound(E, d, story, Object.assign(sd, { miss: ['1x8', '8x1'] }), 5);
  save.current = 'cat-lesson';
  saves.device = save;
}

// save 2: one cat re-reading a finished chapter 1 (dream skipped), and a brand-new cat
{
  const save = E.newSave();
  save.settings.bigText = true;
  const e = cat(save, 'cat-reread', 5000000);
  E.startChapter(e, story, 5000000);
  play(E, story, e, script({ dream: '', choices: { f014: 1, f018: 0, f028: 1, f045: 2, f066: 0 }, miss: ['1x10'], t: 5000000 }));
  E.startChapter(e, story, 6000000);
  play(E, story, e, script({ t: 6000000 }), 'f010');
  cat(save, 'cat-fresh', 7000000);
  save.current = 'cat-reread';
  saves.reread = save;
}

const out = path.join(__dirname, 'v1-saves.json');
fs.writeFileSync(out, JSON.stringify(saves, null, 1) + '\n');
console.log('Wrote ' + path.relative(process.cwd(), out) + ': ' + Object.keys(saves).map(k => k + ' (' + saves[k].cats.length + ' cats)').join(', '));

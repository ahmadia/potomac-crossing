// Load the game's scripts into Node exactly as the page does: every app/ script that index.html
// lists, in its order (art, sets, stories, engine; ui.js needs a DOM and is skipped). Returns PC.
// Not a test file itself (node --test only runs *.test.js).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function scripts() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const out = [];
  const re = /<script\s+src="(app\/[^"]+\.js)"/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function load() {
  let PC = null;
  scripts().forEach((src) => {
    if (src === 'app/ui.js') return;
    PC = require(path.join(ROOT, src));
  });
  return PC || globalThis.PC;
}

module.exports = { ROOT, scripts, load };

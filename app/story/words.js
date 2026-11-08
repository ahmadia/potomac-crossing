/* Potomac Crossing · app/story/words.js: PC.words, module 2's one table of words (decision 53). */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.words = {
    // the take-aways kit's English words: E.TAKE_WORDS reads exactly these fourteen keys (it ignores every other one);
    // each is the kit's own default, so nothing the kit says changes; a class word changes here, in one line
    loose: 'loose', row: 'row', rows: 'rows', Row: 'Row', square: 'square', squares: 'squares',
    ones: 'ones', tens: 'tens', hundreds: 'hundreds',
    takeAway: 'take away', TakeAway: 'Take away', spread: 'spread', Spread: 'Spread', OnesFirst: 'Ones first',
    // Spanish: what a {es:key} token letters (es) and its English (en: the gloss, and what Read to me says in its place with
    // no Spanish voice); a name's `say` is said instead (never its gloss). Numbers are the engine's (E.esNumber), not here.
    es: {
      gatos: { es: 'gatos', en: 'cats' },
      por: { es: 'por', en: 'times' },
      aContar: { es: '¡A contar!', en: 'Let’s count!' },
      galleta: { es: 'Galleta', en: 'cookie', say: 'gah-YEH-tah' }
    },
    // English speech only, never lettered: whole words, the longer first
    sayAs: [['Chispapaw', 'Cheespa-paw'], ['Chispa', 'Cheespa']]
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

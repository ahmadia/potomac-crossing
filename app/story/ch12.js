/* Chapter 12: A Spark at the Hedge (stub). */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};
  PC.story.ch12 = {
    id: 'ch12', number: 12, title: 'A Spark at the Hedge', module: 2, start: 'f001',
    names: { player: '{name}{ending}' },
    frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } },
    counts: {}, cards: {},
    teaser: { title: 'Chapter 13: The Hunter’s Crouch', lines: ['Granny has news: a fresh badger track. Who made this one?'] }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

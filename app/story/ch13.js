/* Chapter 13: The Hunter's Crouch (stub). */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};
  PC.story.ch13 = {
    id: 'ch13', number: 13, title: 'The Hunter’s Crouch', module: 2, start: 'f001',
    names: { player: '{name}{ending}' },
    frames: { f001: { board: 'STUB.', next: 'f002' }, f002: { board: 'STUB.', end: true } },
    counts: {}, cards: {},
    teaser: { title: 'Chapter 14: The Night Watch', lines: ['More holes, and a watch to keep. Who will stay awake?'] }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);

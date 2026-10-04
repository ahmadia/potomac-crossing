/* Potomac Crossing: offline cache (scope: this folder).
   Bump CACHE whenever any file below changes, so installed iPads pull the new version. */
var CACHE = 'potomac-crossing-v9';
var ASSETS = [
  './',
  './index.html',
  './app/art/cats.js',
  './app/art/scenes.js',
  './app/art/sets/pile.js',
  './app/art/sets/bridge.js',
  './app/art/sets/field.js',
  './app/art/sets/crossing.js',
  './app/art/sets/riverbank.js',
  './app/story/ch01.js',
  './app/story/ch02.js',
  './app/engine.js',
  './app/ui.js',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/fonts.css',
  './fonts/bangers-latin.woff2',
  './fonts/bangers-latin-ext.woff2',
  './fonts/comicneue-400.woff2',
  './fonts/comicneue-700.woff2',
  './fonts/comicneue-400-italic.woff2',
  './fonts/comicneue-700-italic.woff2',
  './fonts/andika-700.woff2'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    /* cache: 'reload' skips the browser's HTTP cache (GitHub Pages sends max-age=600), so a
       bumped CACHE always installs the files as they are now, not ten-minute-old copies */
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
    })
      .then(function () { return self.skipWaiting(); })
  );
});

/* Only our own old caches go. Other games on this origin (Potion Lab) keep theirs. */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf('potomac-crossing-') === 0 && k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  /* cache-first: instant loads and full offline once installed. A miss is fetched and kept,
     so the cache heals itself if something else on this origin clears it. */
  e.respondWith(
    caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && url.pathname.indexOf('/dev/') === -1) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504 });
      });
    })
  );
});

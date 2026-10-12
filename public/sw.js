// Offline support: network-first for pages, stale-while-revalidate for assets. Bump VERSION to drop old caches.
const VERSION = 'sk-v4';
const cacheable = (res) => res.ok && !/no-store/i.test(res.headers.get('Cache-Control') ?? '');
const PRECACHE = ['/', '/favicon.svg', '/icon-192.png', '/Sabin-Khanal-CV.pdf'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          // Only the home page may be stored under '/', so a 404 can never replace it.
          if (url.pathname === '/' && cacheable(res)) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put('/', copy));
          }
          return res;
        })
        .catch(async () => (await caches.match('/')) ?? Response.error()),
    );
    return;
  }

  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (cacheable(res)) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached ?? Response.error());
      return cached ?? network;
    }),
  );
});

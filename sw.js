const CACHE = 'konfliktsparring-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        '/FDF_KHaandteing/',
        '/FDF_KHaandteing/index.html',
        '/FDF_KHaandteing/manifest.json'
      ])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('podio.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request)
        .then(cached => cached || caches.match('/FDF_KHaandteing/index.html'))
      )
  );
});

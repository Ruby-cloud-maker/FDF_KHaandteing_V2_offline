const CACHE = 'konflikttsparring-v3';
const urlsToCache = [
    '/FDF_KHaandteing_V2_offline/',
    '/FDF_KHaandteing_V2_offline/index.html',
    '/FDF_KHaandteing_V2_offline/manifest.json'
  ];

self.addEventListener('install', e => {
    e.waitUntil(
          caches.open(CACHE).then(cache => {
                  return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
                    .catch(err => console.error('Cache addAll error:', err));
          })
        );
});

self.addEventListener('activate', e => {
    e.waitUntil(
          caches.keys().then(keys => 
                                   Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
                                 ).then(() => self.clients.claim())
        );
});

self.addEventListener('fetch', e => {
    if (e.request.url.includes('podio.com')) return;

                        e.respondWith(
                              caches.match(e.request).then(cached => {
                                      if (cached) return cached;

                                                                 return fetch(e.request).then(response => {
                                                                           if (!response || response.status !== 200) return response;
                                                                           const clone = response.clone();
                                                                           caches.open(CACHE).then(cache => cache.put(e.request, clone));
                                                                           return response;
                                                                 }).catch(() => {
                                                                           return new Response('Offline - opslagsverk ikke tilgængeligt');
                                                                 });
                              })
                            );
});

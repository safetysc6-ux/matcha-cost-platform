self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.open('app-v1').then(async (cache) => (await cache.match(event.request)) || fetch(event.request).then((res) => { cache.put(event.request, res.clone()); return res; })));
});

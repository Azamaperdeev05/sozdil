// The version of the cache.
const CACHE_NAME = 'sozdil-v2';

// On install, cache the app shell and other essential assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Add essential files to the cache. Others will be cached on-the-fly.
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/logo.jpg'
      ]);
    })
  );
});

// On activate, clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// On fetch, use a cache-first strategy.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If response is in cache, return it.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network.
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse.ok || !event.request.url.startsWith('http')) {
          return networkResponse;
        }

        // Clone the response and cache it for future use.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

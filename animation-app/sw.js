/* Baseline service worker for offline-first app-shell caching (Phase 1). */
const CACHE_NAME = 'animation-app-phase1-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles/base.css',
  './styles/layout.css',
  './styles/toolbar.css',
  './styles/stage.css',
  './styles/properties.css',
  './styles/timeline.css',
  './styles/modal.css',
  './styles/responsive.css',
  './src/main.js',
  './src/app.js',
  './src/ui/layout.js',
  './src/ui/toolbar.js',
  './src/ui/properties-panel.js',
  './src/ui/timeline.js',
  './src/ui/notifications.js',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});

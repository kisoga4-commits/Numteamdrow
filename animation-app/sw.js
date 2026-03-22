/* Offline-first service worker for app-shell caching. */
const CACHE_NAME = 'animation-app-phase1-v2';
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
  './src/core/state.js',
  './src/core/actions.js',
  './src/core/autosave.js',
  './src/core/serializer.js',
  './src/animation/playback.js',
  './src/animation/frame-manager.js',
  './src/animation/timeline-architecture.js',
  './src/storage/db.js',
  './src/storage/project-repo.js',
  './src/storage/settings-repo.js',
  './src/import-export/export-json.js',
  './src/import-export/import-json.js',
  './src/offline/offline-status.js',
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

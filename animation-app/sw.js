const CACHE_VERSION = 'v5';
const APP_SHELL_CACHE = `animation-app-shell-${CACHE_VERSION}`;

const APP_SHELL_FILES = [
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
  './src/core/state.js',
  './src/core/history.js',
  './src/core/shortcuts.js',
  './src/core/autosave.js',
  './src/core/actions.js',
  './src/core/serializer.js',
  './src/animation/playback.js',
  './src/animation/frame-manager.js',
  './src/animation/timeline-architecture.js',
  './src/animation/fps-controller.js',
  './src/animation/thumbnail-generator.js',
  './src/canvas/stage.js',
  './src/canvas/renderer.js',
  './src/canvas/onion-skin.js',
  './src/canvas/export-frame.js',
  './src/storage/db.js',
  './src/storage/project-repo.js',
  './src/storage/settings-repo.js',
  './src/import-export/export-json.js',
  './src/import-export/import-json.js',
  './src/tools/tool-manager.js',
  './src/tools/brush-tool.js',
  './src/tools/eraser-tool.js',
  './src/tools/select-tool.js',
  './src/tools/line-tool.js',
  './src/tools/rect-tool.js',
  './src/tools/ellipse-tool.js',
  './src/tools/fill-tool.js',
  './src/tools/text-tool.js',
  './src/tools/hand-tool.js',
  './src/tools/zoom-tool.js',
  './src/tools/tool-placeholder.js',
  './src/offline/offline-status.js',
  './src/offline/install-prompt.js',
  './src/online/cloud-backup.js',
  './src/online/sync.js',
  './src/online/update-checker.js',
  './src/config.js',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg'
];

const APP_SHELL_PATHS = new Set(
  APP_SHELL_FILES.map((path) => {
    const normalizedPath = new URL(path, self.registration.scope).pathname;
    return normalizedPath.endsWith('/') ? `${normalizedPath}index.html` : normalizedPath;
  })
);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) =>
      Promise.all(
        cacheKeys
          .filter((cacheKey) => cacheKey !== APP_SHELL_CACHE)
          .map((cacheKey) => caches.delete(cacheKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        return cache.match('./index.html');
      })
    );
    return;
  }

  const requestPath = new URL(event.request.url).pathname;
  const normalizedPath = requestPath.endsWith('/') ? `${requestPath}index.html` : requestPath;

  if (!APP_SHELL_PATHS.has(normalizedPath)) return;

  event.respondWith(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});

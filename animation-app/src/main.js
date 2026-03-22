// Phase 1 bootstrap: mount shell and register baseline service worker.
import { startApp } from './app.js';

startApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
      console.info('Service worker registered');
    } catch (error) {
      console.error('Service worker registration failed', error);
    }
  });
}

// App bootstrap: starts app and registers service worker.
import './offline/install-prompt.js';
import { startApp } from './app.js';

startApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('SW registration failed', err);
    });
  });
}

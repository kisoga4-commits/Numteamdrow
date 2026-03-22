import { startApp } from './app.js';

startApp().catch((error) => {
  console.error('Failed to start app', error);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      console.info('Service worker registered', registration.scope);
    } catch (error) {
      console.error('Service worker registration failed', error);
    }
  });
}

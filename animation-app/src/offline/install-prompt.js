// Handles PWA install prompt capture for optional install UI later.
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
});

export function getDeferredPrompt() {
  return deferredPrompt;
}

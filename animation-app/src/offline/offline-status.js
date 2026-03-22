// Online/offline status indicator updater.
export function bindOfflineStatus(chip) {
  const update = () => {
    chip.textContent = navigator.onLine ? 'Online (offline-ready)' : 'Offline mode';
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

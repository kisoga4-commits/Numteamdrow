export function bindOfflineStatus(chip) {
  if (!chip) return;

  const update = () => {
    const online = navigator.onLine;
    chip.dataset.state = online ? 'online' : 'offline';
    chip.textContent = online ? 'Status: Online' : 'Status: Offline';
  };

  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

let deferredPrompt = null;

export function bindInstallPrompt(button) {
  if (!button) return;

  const updateButtonState = () => {
    button.hidden = deferredPrompt === null;
    button.disabled = deferredPrompt === null;
  };

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    updateButtonState();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    button.hidden = true;
    button.disabled = true;
    button.textContent = 'Installed';
  });

  button.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    updateButtonState();
  });

  updateButtonState();
}

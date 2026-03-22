// LocalStorage helpers for tiny UI preferences and session settings.
const SETTINGS_KEY = 'animation-app-settings';

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore environments where storage is blocked (private mode, strict policies).
  }
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

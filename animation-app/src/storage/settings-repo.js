// Settings repository using IndexedDB first with localStorage fallback.
import { STORES, requestToPromise, withStore } from './db.js';

const SETTINGS_KEY = 'animation-app-settings';
const SETTINGS_ROW_KEY = 'ui-settings';

function saveSettingsFallback(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore environments where storage is blocked.
  }
}

function loadSettingsFallback() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  saveSettingsFallback(settings);
  return withStore(STORES.settings, 'readwrite', (store) =>
    requestToPromise(store.put({ key: SETTINGS_ROW_KEY, value: settings, updatedAt: Date.now() }))
  ).catch(() => undefined);
}

export async function loadSettings() {
  const fallback = loadSettingsFallback();
  try {
    const row = await withStore(STORES.settings, 'readonly', (store) => requestToPromise(store.get(SETTINGS_ROW_KEY)));
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

// Repository abstraction for reading/writing project snapshots.
import { withStore } from './db.js';

const LAST_PROJECT_ID = 'last-project';
const LOCAL_FALLBACK_KEY = 'animation-app-last-project';

function saveLocalFallback(project) {
  try {
    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(project));
  } catch {
    // Ignore storage failures in restricted browser contexts.
  }
}

function loadLocalFallback() {
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveLatestProject(project) {
  try {
    await withStore('readwrite', (store) => store.put({ id: LAST_PROJECT_ID, payload: project, updatedAt: Date.now() }));
  } catch {
    saveLocalFallback(project);
  }
}

export async function loadLatestProject() {
  try {
    return await withStore('readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(LAST_PROJECT_ID);
        req.onsuccess = () => resolve(req.result?.payload ?? null);
        req.onerror = () => reject(req.error);
      });
    });
  } catch {
    return loadLocalFallback();
  }
}

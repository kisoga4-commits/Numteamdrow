// Repository abstraction for reading/writing project snapshots.
import { withStore } from './db.js';

const LAST_PROJECT_ID = 'last-project';

export async function saveLatestProject(project) {
  await withStore('readwrite', (store) => store.put({ id: LAST_PROJECT_ID, payload: project, updatedAt: Date.now() }));
}

export async function loadLatestProject() {
  return withStore('readonly', (store) => {
    return new Promise((resolve, reject) => {
      const req = store.get(LAST_PROJECT_ID);
      req.onsuccess = () => resolve(req.result?.payload ?? null);
      req.onerror = () => reject(req.error);
    });
  });
}

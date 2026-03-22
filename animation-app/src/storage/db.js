// IndexedDB connection utility for persistent project storage.
const DB_NAME = 'animation-app-db';
const DB_VERSION = 2;

export const STORES = {
  projects: 'projects',
  settings: 'settings'
};

function ensureStore(db, storeName, options) {
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, options);
  }
}

export function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      ensureStore(db, STORES.projects, { keyPath: 'id' });
      ensureStore(db, STORES.settings, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function withStore(storeName, mode, task) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    Promise.resolve(task(store)).then(resolve).catch(reject);
    tx.onerror = () => reject(tx.error);
  });
}

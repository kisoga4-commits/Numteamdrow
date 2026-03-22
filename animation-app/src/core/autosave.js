// Debounced autosave pipeline that persists current project to IndexedDB.
import { APP_CONFIG } from '../config.js';
import { serializeProject } from './serializer.js';
import { saveLatestProject } from '../storage/project-repo.js';

let timer = null;

export function queueAutosave(state) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      await saveLatestProject(serializeProject(state));
      window.dispatchEvent(new CustomEvent('app:notify', { detail: 'Autosaved project' }));
    } catch (error) {
      console.error('Autosave failed', error);
    }
  }, APP_CONFIG.autosaveDelayMs);
}

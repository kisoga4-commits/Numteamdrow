// Debounced autosave pipeline that persists current project to IndexedDB.
import { APP_CONFIG } from '../config.js';
import { serializeProject } from './serializer.js';
import { saveLatestProject } from '../storage/project-repo.js';

let timer = null;
let lastSavedSnapshot = '';

function createSnapshotKey(project) {
  return JSON.stringify({
    color: project.color,
    brushSize: project.brushSize,
    opacity: project.opacity,
    fps: project.fps,
    onionSkin: project.onionSkin,
    frames: project.frames,
    layerSettings: project.layerSettings
  });
}

export function queueAutosave(state, { onSaved, onError } = {}) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const project = serializeProject(state);
    const snapshotKey = createSnapshotKey(project);
    if (snapshotKey === lastSavedSnapshot) return;

    try {
      await saveLatestProject(project);
      lastSavedSnapshot = snapshotKey;
      onSaved?.();
    } catch (error) {
      console.error('Autosave failed', error);
      onError?.(error);
    }
  }, APP_CONFIG.autosaveDelayMs);
}

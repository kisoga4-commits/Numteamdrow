// Exports current project as downloadable JSON file.
import { serializeProject } from '../core/serializer.js';

export function exportProjectJson(state) {
  const blob = new Blob([JSON.stringify(serializeProject(state), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `animation-project-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

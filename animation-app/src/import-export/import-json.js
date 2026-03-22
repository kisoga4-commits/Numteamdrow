// Imports project JSON and normalizes it into app state shape.
import { hydrateProject } from '../core/serializer.js';

export async function importProjectJson(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  return hydrateProject(parsed);
}

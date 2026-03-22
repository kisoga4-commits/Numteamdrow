// Imports project JSON and normalizes it into app state shape.
import { hydrateProject, validateProjectPayload } from '../core/serializer.js';

export class ImportProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ImportProjectError';
  }
}

export async function importProjectJson(file) {
  if (!file) {
    throw new ImportProjectError('No file selected');
  }

  const text = await file.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ImportProjectError('Invalid JSON: file content is not valid JSON text');
  }

  const validation = validateProjectPayload(parsed);
  if (!validation.valid) {
    throw new ImportProjectError(`Invalid project format: ${validation.errors.join('; ')}`);
  }

  return hydrateProject(parsed);
}

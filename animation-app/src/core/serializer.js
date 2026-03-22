// Serialization helpers to convert app state to/from portable JSON shape.

const PROJECT_VERSION = 1;
const DEFAULT_LAYER_SETTINGS = { activeLayer: 0, layerCount: 1 };
const DEFAULT_FRAME = () => ({ id: crypto.randomUUID(), imageDataUrl: null });

function asFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeFrame(frame, index, errors) {
  if (!frame || typeof frame !== 'object' || Array.isArray(frame)) {
    errors.push(`frames[${index}] must be an object`);
    return DEFAULT_FRAME();
  }

  const imageDataUrl = frame.imageDataUrl == null || typeof frame.imageDataUrl === 'string' ? frame.imageDataUrl : null;
  if (frame.imageDataUrl != null && typeof frame.imageDataUrl !== 'string') {
    errors.push(`frames[${index}].imageDataUrl must be a string or null`);
  }

  return {
    id: typeof frame.id === 'string' && frame.id.trim() ? frame.id : crypto.randomUUID(),
    imageDataUrl,
    durationMs: asFiniteNumber(frame.durationMs) ?? undefined
  };
}

export function serializeProject(state) {
  const frames = Array.isArray(state.frames) ? state.frames : [];

  return {
    version: PROJECT_VERSION,
    savedAt: new Date().toISOString(),
    color: typeof state.color === 'string' ? state.color : '#4f46e5',
    brushSize: asFiniteNumber(state.brushSize) ?? 8,
    opacity: asFiniteNumber(state.opacity) ?? 1,
    fps: asFiniteNumber(state.fps) ?? 8,
    onionSkin: Boolean(state.onionSkin),
    frames: frames.map((frame, index) => normalizeFrame(frame, index, [])),
    layerSettings: {
      activeLayer: asFiniteNumber(state.layerSettings?.activeLayer) ?? DEFAULT_LAYER_SETTINGS.activeLayer,
      layerCount: asFiniteNumber(state.layerSettings?.layerCount) ?? DEFAULT_LAYER_SETTINGS.layerCount
    }
  };
}

export function validateProjectPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Project JSON root must be an object'] };
  }

  if (payload.version != null && !Number.isInteger(payload.version)) {
    errors.push('version must be an integer');
  }

  if (typeof payload.color !== 'string') {
    errors.push('color must be a string');
  }

  if (asFiniteNumber(payload.brushSize) == null) {
    errors.push('brushSize must be a number');
  }

  if (asFiniteNumber(payload.opacity) == null) {
    errors.push('opacity must be a number');
  }

  if (asFiniteNumber(payload.fps) == null) {
    errors.push('fps must be a number');
  }

  if (!Array.isArray(payload.frames) || payload.frames.length === 0) {
    errors.push('frames must be a non-empty array');
  } else {
    payload.frames.forEach((frame, index) => {
      normalizeFrame(frame, index, errors);
    });
  }

  if (payload.layerSettings != null) {
    if (typeof payload.layerSettings !== 'object' || Array.isArray(payload.layerSettings)) {
      errors.push('layerSettings must be an object');
    } else {
      if (asFiniteNumber(payload.layerSettings.activeLayer) == null) {
        errors.push('layerSettings.activeLayer must be a number');
      }
      if (asFiniteNumber(payload.layerSettings.layerCount) == null) {
        errors.push('layerSettings.layerCount must be a number');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function hydrateProject(project) {
  const errors = [];
  const normalizedFrames = Array.isArray(project.frames)
    ? project.frames.map((frame, index) => normalizeFrame(frame, index, errors))
    : [];

  return {
    color: project.color ?? '#4f46e5',
    brushSize: asFiniteNumber(project.brushSize) ?? 8,
    opacity: asFiniteNumber(project.opacity) ?? 1,
    fps: asFiniteNumber(project.fps) ?? 8,
    onionSkin: Boolean(project.onionSkin),
    frames: normalizedFrames.length ? normalizedFrames : [DEFAULT_FRAME()],
    layerSettings: {
      activeLayer: asFiniteNumber(project.layerSettings?.activeLayer) ?? DEFAULT_LAYER_SETTINGS.activeLayer,
      layerCount: asFiniteNumber(project.layerSettings?.layerCount) ?? DEFAULT_LAYER_SETTINGS.layerCount
    },
    currentFrameIndex: 0,
    currentTool: 'brush',
    playing: false,
    zoom: 1,
    panX: 0,
    panY: 0,
    selection: { active: false, bounds: null, draft: null }
  };
}

// Serialization helpers to convert app state to/from portable JSON shape.

const PROJECT_VERSION = 1;
const DEFAULT_LAYER_SETTINGS = { activeLayer: 0, layerCount: 1 };
const DEFAULT_STROKE = (tool = 'brush') => ({
  id: crypto.randomUUID(),
  tool,
  color: tool === 'eraser' ? null : '#4f46e5',
  size: 8,
  opacity: 1,
  points: []
});
const DEFAULT_LAYER = () => ({ id: crypto.randomUUID(), strokes: [] });
const DEFAULT_FRAME = () => ({ id: crypto.randomUUID(), imageDataUrl: null, layers: [DEFAULT_LAYER()] });

function asFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizePoint(point) {
  return {
    x: asFiniteNumber(point?.x) ?? 0,
    y: asFiniteNumber(point?.y) ?? 0
  };
}

function normalizeStroke(stroke, frameIndex, layerIndex, strokeIndex, errors) {
  if (!stroke || typeof stroke !== 'object' || Array.isArray(stroke)) {
    errors.push(`frames[${frameIndex}].layers[${layerIndex}].strokes[${strokeIndex}] must be an object`);
    return DEFAULT_STROKE();
  }

  const tool = stroke.tool === 'eraser' ? 'eraser' : 'brush';
  if (stroke.tool != null && stroke.tool !== 'brush' && stroke.tool !== 'eraser') {
    errors.push(`frames[${frameIndex}].layers[${layerIndex}].strokes[${strokeIndex}].tool must be "brush" or "eraser"`);
  }

  const rawPoints = Array.isArray(stroke.points) ? stroke.points : [];
  if (!Array.isArray(stroke.points)) {
    errors.push(`frames[${frameIndex}].layers[${layerIndex}].strokes[${strokeIndex}].points must be an array`);
  }

  return {
    id: typeof stroke.id === 'string' && stroke.id.trim() ? stroke.id : crypto.randomUUID(),
    tool,
    color: tool === 'eraser' ? null : (typeof stroke.color === 'string' ? stroke.color : '#4f46e5'),
    size: asFiniteNumber(stroke.size) ?? 8,
    opacity: asFiniteNumber(stroke.opacity) ?? 1,
    points: rawPoints.map((point) => normalizePoint(point))
  };
}

function normalizeLayer(layer, frameIndex, layerIndex, errors) {
  if (!layer || typeof layer !== 'object' || Array.isArray(layer)) {
    errors.push(`frames[${frameIndex}].layers[${layerIndex}] must be an object`);
    return DEFAULT_LAYER();
  }

  const strokes = Array.isArray(layer.strokes)
    ? layer.strokes.map((stroke, strokeIndex) => normalizeStroke(stroke, frameIndex, layerIndex, strokeIndex, errors))
    : [];

  if (!Array.isArray(layer.strokes)) {
    errors.push(`frames[${frameIndex}].layers[${layerIndex}].strokes must be an array`);
  }

  return {
    id: typeof layer.id === 'string' && layer.id.trim() ? layer.id : crypto.randomUUID(),
    strokes
  };
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
    durationMs: asFiniteNumber(frame.durationMs) ?? undefined,
    layers: Array.isArray(frame.layers)
      ? frame.layers.map((layer, layerIndex) => normalizeLayer(layer, index, layerIndex, errors))
      : [DEFAULT_LAYER()]
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

  if (Array.isArray(payload.frames)) {
    payload.frames.forEach((frame, frameIndex) => {
      if (Array.isArray(frame?.layers)) {
        frame.layers.forEach((layer, layerIndex) => {
          if (Array.isArray(layer?.strokes)) {
            layer.strokes.forEach((stroke, strokeIndex) => {
              normalizeStroke(stroke, frameIndex, layerIndex, strokeIndex, errors);
            });
          }
        });
      }
    });
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
  const layerCount = asFiniteNumber(project.layerSettings?.layerCount) ?? DEFAULT_LAYER_SETTINGS.layerCount;
  const ensuredFrames = (normalizedFrames.length ? normalizedFrames : [DEFAULT_FRAME()]).map((frame) => {
    const layers = Array.isArray(frame.layers) ? [...frame.layers] : [];
    while (layers.length < layerCount) {
      layers.push(DEFAULT_LAYER());
    }
    return {
      ...frame,
      layers: layers.slice(0, layerCount)
    };
  });

  return {
    color: project.color ?? '#4f46e5',
    brushSize: asFiniteNumber(project.brushSize) ?? 8,
    opacity: asFiniteNumber(project.opacity) ?? 1,
    fps: asFiniteNumber(project.fps) ?? 8,
    onionSkin: Boolean(project.onionSkin),
    frames: ensuredFrames,
    layerSettings: {
      activeLayer: asFiniteNumber(project.layerSettings?.activeLayer) ?? DEFAULT_LAYER_SETTINGS.activeLayer,
      layerCount
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

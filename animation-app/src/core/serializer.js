// Serialization helpers to convert app state to/from portable JSON shape.
export function serializeProject(state) {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    color: state.color,
    brushSize: state.brushSize,
    opacity: state.opacity,
    fps: state.fps,
    onionSkin: state.onionSkin,
    frames: state.frames,
    layerSettings: state.layerSettings
  };
}

export function hydrateProject(project) {
  return {
    color: project.color ?? '#4f46e5',
    brushSize: project.brushSize ?? 8,
    opacity: project.opacity ?? 1,
    fps: project.fps ?? 8,
    onionSkin: Boolean(project.onionSkin),
    frames: Array.isArray(project.frames) && project.frames.length ? project.frames : [{ id: crypto.randomUUID(), imageDataUrl: null }],
    layerSettings: project.layerSettings ?? { activeLayer: 0, layerCount: 1 },
    currentFrameIndex: 0,
    currentTool: 'brush',
    playing: false,
    zoom: 1,
    panX: 0,
    panY: 0
  };
}

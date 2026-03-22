// Frame collection mutation helpers.
import { createBlankFrame } from '../core/state.js';

export function addFrame(state) {
  const next = createBlankFrame();
  state.frames.splice(state.currentFrameIndex + 1, 0, next);
  state.currentFrameIndex += 1;
}

export function duplicateFrame(state) {
  const current = state.frames[state.currentFrameIndex] ?? createBlankFrame();
  const duplicated = {
    ...createBlankFrame(),
    imageDataUrl: current.imageDataUrl,
    durationMs: current.durationMs,
    layers: Array.isArray(current.layers)
      ? current.layers.map((layer) => ({
          id: crypto.randomUUID(),
          strokes: Array.isArray(layer.strokes) ? structuredClone(layer.strokes) : []
        }))
      : createBlankFrame().layers
  };

  state.frames.splice(state.currentFrameIndex + 1, 0, duplicated);
  state.currentFrameIndex += 1;
}

export function deleteFrame(state) {
  if (state.frames.length === 1) {
    // Keep at least one frame in timeline, but clear its image content.
    state.frames[0] = { ...createBlankFrame(), id: state.frames[0].id };
    state.currentFrameIndex = 0;
    return;
  }

  state.frames.splice(state.currentFrameIndex, 1);
  state.currentFrameIndex = Math.min(state.currentFrameIndex, state.frames.length - 1);
}

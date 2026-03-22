// Frame collection mutation helpers.
import { createBlankFrame } from '../core/state.js';

export function addFrame(state) {
  state.frames.splice(state.currentFrameIndex + 1, 0, createBlankFrame());
  state.currentFrameIndex += 1;
}

export function duplicateFrame(state) {
  const current = state.frames[state.currentFrameIndex];
  state.frames.splice(state.currentFrameIndex + 1, 0, { ...createBlankFrame(), imageDataUrl: current.imageDataUrl });
  state.currentFrameIndex += 1;
}

export function deleteFrame(state) {
  if (state.frames.length === 1) return;
  state.frames.splice(state.currentFrameIndex, 1);
  state.currentFrameIndex = Math.max(0, state.currentFrameIndex - 1);
}

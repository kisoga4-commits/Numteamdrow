// In-memory global state container for predictable app behavior.
import { APP_CONFIG } from '../config.js';
import { normalizeFps } from '../animation/fps-controller.js';

const blankFrame = () => ({ id: crypto.randomUUID(), imageDataUrl: null, durationMs: 1000 / APP_CONFIG.defaultFps });

export const state = {
  currentTool: 'brush',
  color: '#4f46e5',
  brushSize: 8,
  opacity: 1,
  zoom: 1,
  panX: 0,
  panY: 0,
  onionSkin: false,
  fps: APP_CONFIG.defaultFps,
  currentFrameIndex: 0,
  playing: false,
  frames: [blankFrame()],
  layerSettings: { activeLayer: 0, layerCount: 1 },
  selection: { active: false, bounds: null, draft: null }
};

const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(state));
}

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateState(partial) {
  Object.assign(state, partial);
  emit();
}

export function updateStateWith(producer) {
  producer(state);
  emit();
}

export function replaceState(nextState) {
  Object.assign(state, nextState);

  state.fps = normalizeFps(state.fps);

  if (!Array.isArray(state.frames) || state.frames.length === 0) {
    state.frames = [blankFrame()];
  }

  state.currentFrameIndex = Math.max(0, Math.min(state.currentFrameIndex ?? 0, state.frames.length - 1));

  if (!state.selection) {
    state.selection = { active: false, bounds: null, draft: null };
  }

  emit();
}

export function createBlankFrame() {
  return blankFrame();
}

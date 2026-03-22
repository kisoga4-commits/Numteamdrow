// In-memory global state container for predictable app behavior.
import { APP_CONFIG } from '../config.js';

const blankFrame = () => ({ id: crypto.randomUUID(), imageDataUrl: null });

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
  layerSettings: { activeLayer: 0, layerCount: 1 }
};

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateState(partial) {
  Object.assign(state, partial);
  listeners.forEach((listener) => listener(state));
}

export function replaceState(nextState) {
  Object.assign(state, nextState);
  listeners.forEach((listener) => listener(state));
}

export function createBlankFrame() {
  return blankFrame();
}

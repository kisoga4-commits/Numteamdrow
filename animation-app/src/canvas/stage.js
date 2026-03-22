// Stage controller binds canvas pointer events with selected drawing tool.
import { frameFromCanvas } from './export-frame.js';
import { getTool } from '../tools/tool-manager.js';

export function createStageController({ state, onFrameCommit }) {
  const mainCanvas = document.getElementById('main-canvas');
  const overlayCanvas = document.getElementById('overlay-canvas');
  const ctx = mainCanvas.getContext('2d');
  const overlayCtx = overlayCanvas.getContext('2d');
  let drawing = false;

  const pointFromEvent = (event) => {
    const rect = mainCanvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * mainCanvas.width,
      y: ((event.clientY - rect.top) / rect.height) * mainCanvas.height
    };
  };

  const onDown = (event) => {
    drawing = true;
    const tool = getTool(state.currentTool);
    tool.onPointerDown(ctx, pointFromEvent(event), state, overlayCtx);
  };
  const onMove = (event) => {
    if (!drawing) return;
    const tool = getTool(state.currentTool);
    tool.onPointerMove(ctx, pointFromEvent(event), state, overlayCtx);
  };
  const onUp = () => {
    if (!drawing) return;
    drawing = false;
    const tool = getTool(state.currentTool);
    tool.onPointerUp(ctx, state, overlayCtx);
    onFrameCommit(frameFromCanvas(mainCanvas));
  };

  overlayCanvas.addEventListener('pointerdown', onDown);
  overlayCanvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  return {
    mainCanvas,
    mainCtx: ctx,
    destroy() {
      overlayCanvas.removeEventListener('pointerdown', onDown);
      overlayCanvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
  };
}

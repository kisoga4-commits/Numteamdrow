// Stage controller binds canvas pointer events with selected drawing tool.
import { frameFromCanvas } from './export-frame.js';
import { clearOverlayCanvas } from './renderer.js';
import { getTool } from '../tools/tool-manager.js';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createStageController({ getState, onFrameCommit, onViewportChange }) {
  const stageInner = document.getElementById('stage-inner');
  const canvasWrap = document.getElementById('canvas-wrap');
  const mainCanvas = document.getElementById('main-canvas');
  const overlayCanvas = document.getElementById('overlay-canvas');
  const ctx = mainCanvas.getContext('2d');
  const overlayCtx = overlayCanvas.getContext('2d');

  let drawing = false;
  let panning = false;
  let activePointerId = null;
  let panStart = null;
  let spacePressed = false;

  const pointFromEvent = (event) => {
    const rect = overlayCanvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * overlayCanvas.width,
      y: ((event.clientY - rect.top) / rect.height) * overlayCanvas.height
    };
  };

  const syncTransform = () => {
    const state = getState();
    canvasWrap.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  };

  const isPanModifier = (event) => {
    const state = getState();
    return state.currentTool === 'hand' || event.button === 1 || event.buttons === 4 || event.shiftKey || spacePressed;
  };

  const beginPan = (event) => {
    const state = getState();
    panning = true;
    panStart = {
      x: event.clientX,
      y: event.clientY,
      panX: state.panX,
      panY: state.panY
    };
    overlayCanvas.style.cursor = 'grabbing';
  };

  const onDown = (event) => {
    if (event.button !== 0 && event.button !== 1) return;
    activePointerId = event.pointerId;
    overlayCanvas.setPointerCapture(event.pointerId);

    if (isPanModifier(event)) {
      beginPan(event);
      return;
    }

    drawing = true;
    const state = getState();
    const tool = getTool(state.currentTool);
    tool.onPointerDown?.(ctx, pointFromEvent(event), state, overlayCtx);
  };

  const onMove = (event) => {
    if (activePointerId !== event.pointerId) return;

    if (panning && panStart) {
      const dx = event.clientX - panStart.x;
      const dy = event.clientY - panStart.y;
      onViewportChange({
        panX: panStart.panX + dx,
        panY: panStart.panY + dy
      });
      syncTransform();
      return;
    }

    if (!drawing) return;
    const state = getState();
    const tool = getTool(state.currentTool);
    tool.onPointerMove?.(ctx, pointFromEvent(event), state, overlayCtx);
  };

  const finishPointer = () => {
    const state = getState();

    if (drawing) {
      drawing = false;
      const tool = getTool(state.currentTool);
      tool.onPointerUp?.(ctx, state, overlayCtx);
      onFrameCommit(frameFromCanvas(mainCanvas));
    }

    if (panning) {
      panning = false;
      panStart = null;
      overlayCanvas.style.cursor = 'crosshair';
    }

    activePointerId = null;
  };

  const onUp = (event) => {
    if (activePointerId !== event.pointerId) return;
    finishPointer();
    if (overlayCanvas.hasPointerCapture(event.pointerId)) {
      overlayCanvas.releasePointerCapture(event.pointerId);
    }
  };

  const onCancel = (event) => {
    if (activePointerId !== event.pointerId) return;
    finishPointer();
  };

  const onWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();

    const state = getState();
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    const zoom = clamp(state.zoom * factor, MIN_ZOOM, MAX_ZOOM);
    onViewportChange({ zoom });
    syncTransform();
  };

  const onKeyDown = (event) => {
    if (event.code === 'Space') {
      spacePressed = true;
      overlayCanvas.style.cursor = 'grab';
      stageInner?.classList.add('is-space-pan');
    }
  };

  const onKeyUp = (event) => {
    if (event.code === 'Space') {
      spacePressed = false;
      if (!panning) {
        overlayCanvas.style.cursor = 'crosshair';
      }
      stageInner?.classList.remove('is-space-pan');
    }
  };

  overlayCanvas.style.cursor = 'crosshair';
  overlayCanvas.addEventListener('pointerdown', onDown);
  overlayCanvas.addEventListener('pointermove', onMove);
  overlayCanvas.addEventListener('pointerup', onUp);
  overlayCanvas.addEventListener('pointercancel', onCancel);
  overlayCanvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  syncTransform();
  clearOverlayCanvas(overlayCtx);

  return {
    mainCanvas,
    mainCtx: ctx,
    overlayCanvas,
    overlayCtx,
    syncTransform,
    clearOverlay() {
      clearOverlayCanvas(overlayCtx);
    },
    destroy() {
      overlayCanvas.removeEventListener('pointerdown', onDown);
      overlayCanvas.removeEventListener('pointermove', onMove);
      overlayCanvas.removeEventListener('pointerup', onUp);
      overlayCanvas.removeEventListener('pointercancel', onCancel);
      overlayCanvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  };
}

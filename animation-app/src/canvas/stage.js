// Stage controller binds canvas pointer events with selected drawing tool.
import { frameFromCanvas } from './export-frame.js';
import { clearOverlayCanvas } from './renderer.js';
import { getTool } from '../tools/tool-manager.js';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function snapshotCanvas(canvas) {
  const snapshot = document.createElement('canvas');
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;

  const snapshotCtx = snapshot.getContext('2d');
  if (snapshotCtx) {
    snapshotCtx.drawImage(canvas, 0, 0);
  }

  return snapshot;
}

export function createStageController({ getState, onFrameCommit, onViewportChange }) {
  const stageInner = document.getElementById('stage-inner');
  const canvasWrap = document.getElementById('canvas-wrap');
  const mainCanvas = document.getElementById('main-canvas');
  const onionCanvas = document.getElementById('onion-canvas');
  const overlayCanvas = document.getElementById('overlay-canvas');
  const canvases = [onionCanvas, mainCanvas, overlayCanvas];

  const ctx = mainCanvas.getContext('2d');
  const overlayCtx = overlayCanvas.getContext('2d');

  let drawing = false;
  let panning = false;
  let activePointerId = null;
  let panStart = null;
  let spacePressed = false;

  const pointFromEvent = (event) => {
    const rect = overlayCanvas.getBoundingClientRect();
    const scaleX = overlayCanvas.width / Math.max(rect.width, 1);
    const scaleY = overlayCanvas.height / Math.max(rect.height, 1);

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const syncTransform = () => {
    const state = getState();
    canvasWrap.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  };

  const resizeCanvasesToDisplaySize = () => {
    const rect = canvasWrap.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const nextWidth = Math.max(1, Math.round(cssWidth * dpr));
    const nextHeight = Math.max(1, Math.round(cssHeight * dpr));

    let resized = false;

    canvases.forEach((canvas) => {
      if (!canvas) return;
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;

      const snapshot = snapshotCanvas(canvas);
      canvas.width = nextWidth;
      canvas.height = nextHeight;

      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx && snapshot.width > 0 && snapshot.height > 0) {
        canvasCtx.drawImage(snapshot, 0, 0, nextWidth, nextHeight);
      }

      resized = true;
    });

    if (resized) {
      clearOverlayCanvas(overlayCtx);
    }
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

    event.preventDefault();
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

    event.preventDefault();

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

    event.preventDefault();
    finishPointer();

    if (overlayCanvas.hasPointerCapture(event.pointerId)) {
      overlayCanvas.releasePointerCapture(event.pointerId);
    }
  };

  const onCancel = (event) => {
    if (activePointerId !== event.pointerId) return;

    event.preventDefault();
    finishPointer();

    if (overlayCanvas.hasPointerCapture(event.pointerId)) {
      overlayCanvas.releasePointerCapture(event.pointerId);
    }
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

  const onResize = () => {
    resizeCanvasesToDisplaySize();
  };

  overlayCanvas.style.cursor = 'crosshair';
  resizeCanvasesToDisplaySize();
  overlayCanvas.addEventListener('pointerdown', onDown);
  overlayCanvas.addEventListener('pointermove', onMove);
  overlayCanvas.addEventListener('pointerup', onUp);
  overlayCanvas.addEventListener('pointercancel', onCancel);
  overlayCanvas.addEventListener('lostpointercapture', finishPointer);
  overlayCanvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  window.visualViewport?.addEventListener('resize', onResize);
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
      overlayCanvas.removeEventListener('lostpointercapture', finishPointer);
      overlayCanvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  };
}

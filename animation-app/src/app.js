// Main app composition root connecting state, UI, canvas, storage, and playback.
import { createStageLayout } from './ui/layout.js';
import { renderToolbar } from './ui/toolbar.js';
import { renderProperties } from './ui/properties-panel.js';
import { renderTimeline } from './ui/timeline.js';
import { notify } from './ui/notifications.js';
import { state, subscribe, updateState, replaceState } from './core/state.js';
import { drawFrameToCanvas } from './canvas/renderer.js';
import { renderOnionSkin } from './canvas/onion-skin.js';
import { createStageController } from './canvas/stage.js';
import { addFrame, deleteFrame, duplicateFrame } from './animation/frame-manager.js';
import { createPlayback } from './animation/playback.js';
import { normalizeFps } from './animation/fps-controller.js';
import { queueAutosave } from './core/autosave.js';
import { bindShortcuts } from './core/shortcuts.js';
import { loadLatestProject } from './storage/project-repo.js';
import { loadSettings, saveSettings } from './storage/settings-repo.js';
import { exportProjectJson } from './import-export/export-json.js';
import { importProjectJson } from './import-export/import-json.js';
import { bindOfflineStatus } from './offline/offline-status.js';
import { APP_CONFIG } from './config.js';

export async function startApp() {
  const stageRoot = document.getElementById('stage-area');
  createStageLayout(stageRoot);

  const onionCanvas = document.getElementById('onion-canvas');
  const onionCtx = onionCanvas.getContext('2d');
  const canvasWrap = document.getElementById('canvas-wrap');
  bindOfflineStatus(document.getElementById('status-chip'));

  const savedSettings = loadSettings();
  if (savedSettings.zoom) updateState({ zoom: savedSettings.zoom });

  const latest = await loadLatestProject();
  if (latest) {
    replaceState({ ...state, ...latest, currentTool: 'brush', currentFrameIndex: 0, playing: false, zoom: state.zoom });
    notify('Loaded latest project');
  }

  const stage = createStageController({
    state,
    onFrameCommit: (dataUrl) => {
      state.frames[state.currentFrameIndex].imageDataUrl = dataUrl;
      refresh();
      queueAutosave(state);
    }
  });

  const playback = createPlayback({
    getState: () => state,
    onTick: (nextIndex) => {
      updateState({ currentFrameIndex: nextIndex });
      refreshCanvas();
      refreshTimeline();
    }
  });

  function refreshCanvas() {
    drawFrameToCanvas(stage.mainCtx, state.frames[state.currentFrameIndex], APP_CONFIG.canvasWidth, APP_CONFIG.canvasHeight);
    renderOnionSkin(onionCtx, state.frames[state.currentFrameIndex - 1], APP_CONFIG.canvasWidth, APP_CONFIG.canvasHeight, state.onionSkin);
    canvasWrap.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  }

  function refreshToolbar() {
    renderToolbar(document.getElementById('toolbar'), (tool) => {
      updateState({ currentTool: tool });
      refreshToolbar();
    }, state.currentTool);
  }

  function refreshProperties() {
    renderProperties(document.getElementById('properties-panel'), state, {
      setColor: (color) => { updateState({ color }); queueAutosave(state); },
      setBrushSize: (brushSize) => { updateState({ brushSize }); queueAutosave(state); },
      setOpacity: (opacity) => { updateState({ opacity }); queueAutosave(state); },
      setLayer: (activeLayer) => { updateState({ layerSettings: { ...state.layerSettings, activeLayer } }); queueAutosave(state); },
      exportProject: () => exportProjectJson(state),
      importProject: () => document.getElementById('import-input').click()
    });
  }

  function refreshTimeline() {
    renderTimeline(document.getElementById('timeline'), state, {
      togglePlay: () => {
        if (state.playing) {
          playback.stop();
          updateState({ playing: false });
        } else {
          playback.start();
          updateState({ playing: true });
        }
        refreshTimeline();
      },
      stop: () => {
        playback.stop();
        updateState({ playing: false, currentFrameIndex: 0 });
        refresh();
      },
      addFrame: () => {
        addFrame(state);
        refresh();
        queueAutosave(state);
      },
      duplicateFrame: () => {
        duplicateFrame(state);
        refresh();
        queueAutosave(state);
      },
      deleteFrame: () => {
        deleteFrame(state);
        refresh();
        queueAutosave(state);
      },
      selectFrame: (index) => {
        updateState({ currentFrameIndex: index });
        refresh();
      },
      setFps: (fps) => {
        updateState({ fps: normalizeFps(fps) });
        refreshTimeline();
        queueAutosave(state);
      },
      toggleOnion: (onionSkin) => {
        updateState({ onionSkin });
        refreshCanvas();
        queueAutosave(state);
      }
    });
  }

  function refresh() {
    refreshCanvas();
    refreshToolbar();
    refreshProperties();
    refreshTimeline();
    saveSettings({ zoom: state.zoom });
  }

  document.getElementById('import-input').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imported = await importProjectJson(file);
    replaceState({ ...state, ...imported });
    refresh();
    queueAutosave(state);
    notify('Imported project');
  });

  window.addEventListener('app:notify', (event) => notify(event.detail));

  bindShortcuts({
    setTool: (tool) => {
      updateState({ currentTool: tool });
      refreshToolbar();
    },
    addFrame: () => {
      addFrame(state);
      refresh();
      queueAutosave(state);
    },
    togglePlay: () => {
      document.getElementById('tl-play')?.click();
    }
  });

  subscribe(() => {});
  refresh();
}

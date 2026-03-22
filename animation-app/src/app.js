// App composition for offline-first animation shell with centralized state.
import { createStageLayout } from './ui/layout.js';
import { renderToolbar } from './ui/toolbar.js';
import { renderProperties } from './ui/properties-panel.js';
import { renderTimeline } from './ui/timeline.js';
import { notify } from './ui/notifications.js';
import { bindOfflineStatus } from './offline/offline-status.js';
import { exportProjectJson } from './import-export/export-json.js';
import { importProjectJson } from './import-export/import-json.js';
import { loadLatestProject } from './storage/project-repo.js';
import { loadSettings, saveSettings } from './storage/settings-repo.js';
import { queueAutosave } from './core/autosave.js';
import { createPlayback } from './animation/playback.js';
import { createActions } from './core/actions.js';
import { getState, replaceState, subscribe, updateState } from './core/state.js';

export async function startApp() {
  const appRoot = document.getElementById('app');
  const stageRoot = document.getElementById('stage-area');
  const toolbarRoot = document.getElementById('toolbar');
  const propertiesRoot = document.getElementById('properties-panel');
  const timelineRoot = document.getElementById('timeline');

  if (!appRoot || !stageRoot || !toolbarRoot || !propertiesRoot || !timelineRoot) {
    throw new Error('App root nodes are missing from index.html');
  }

  createStageLayout(stageRoot);

  const settings = await loadSettings();
  document.documentElement.dataset.theme = settings.theme ?? 'dark';

  const restoredProject = await loadLatestProject();
  if (restoredProject) {
    replaceState({ ...restoredProject, playing: false, currentFrameIndex: 0 });
    notify('Recovered project from local storage');
  }

  const playback = createPlayback({
    getState,
    onTick: (nextFrameIndex) => updateState({ currentFrameIndex: nextFrameIndex })
  });

  const actions = createActions({ getState, notify, saveSettings });

  const render = () => {
    const state = getState();

    renderToolbar(toolbarRoot, {
      activeTool: state.currentTool,
      theme: document.documentElement.dataset.theme,
      onSelectTool: actions.selectTool,
      onToggleTheme: () => actions.toggleTheme()
    });

    renderProperties(propertiesRoot, {
      color: state.color,
      brushSize: state.brushSize,
      opacity: state.opacity,
      onColorChange: actions.setColor,
      onBrushSizeChange: actions.setBrushSize,
      onOpacityChange: actions.setOpacity,
      onExport: () => exportProjectJson(state),
      onImport: async (file) => {
        const nextState = await importProjectJson(file);
        actions.importHydratedState(nextState);
      }
    });

    renderTimeline(timelineRoot, {
      frames: state.frames,
      currentFrameIndex: state.currentFrameIndex,
      fps: state.fps,
      onionSkin: state.onionSkin,
      playing: state.playing,
      onPlay: () => {
        actions.setPlaying(true);
        playback.start();
      },
      onStop: () => {
        actions.setPlaying(false);
        playback.stop();
      },
      onAddFrame: actions.timeline.commands.addFrame,
      onDuplicateFrame: actions.timeline.commands.duplicateFrame,
      onDeleteFrame: actions.timeline.commands.deleteFrame,
      onSetFps: actions.timeline.commands.setFps,
      onToggleOnion: actions.timeline.commands.toggleOnionSkin,
      onSelectFrame: actions.timeline.commands.selectFrame
    });

    queueAutosave(state);
  };

  bindOfflineStatus(document.getElementById('status-chip'));
  const unsubscribe = subscribe(render);
  render();

  window.addEventListener('beforeunload', () => {
    unsubscribe();
    playback.stop();
  });
}

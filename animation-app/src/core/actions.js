// Central action creators to keep UI modules decoupled from raw state mutations.
import { replaceState, updateState, updateStateWith } from './state.js';
import { createTimelineController } from '../animation/timeline-architecture.js';

export function createActions({ getState, notify, saveSettings }) {
  const timeline = createTimelineController({ getState, mutateState: updateStateWith });

  return {
    selectTool(tool) {
      updateState({ currentTool: tool });
      notify(`Tool switched: ${tool}`);
    },
    setTheme(theme) {
      document.documentElement.dataset.theme = theme;
      saveSettings({ theme });
    },
    toggleTheme() {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
    },
    setColor(color) {
      updateState({ color });
    },
    setBrushSize(size) {
      updateState({ brushSize: Number(size) });
    },
    setOpacity(opacityPercent) {
      updateState({ opacity: Number(opacityPercent) / 100 });
    },
    setPlaying(playing) {
      updateState({ playing: Boolean(playing) });
    },
    timeline,
    importHydratedState(nextState) {
      replaceState(nextState);
      notify('Project imported');
    }
  };
}

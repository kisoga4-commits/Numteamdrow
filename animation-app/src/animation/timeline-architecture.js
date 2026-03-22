// Timeline architecture facade for editor-ready commands and querying.
import { addFrame, deleteFrame, duplicateFrame } from './frame-manager.js';

function clampFrameIndex(state) {
  state.currentFrameIndex = Math.max(0, Math.min(state.currentFrameIndex, state.frames.length - 1));
}

export function createTimelineController({ getState, mutateState }) {
  const commands = {
    selectFrame(index) {
      mutateState((state) => {
        state.currentFrameIndex = index;
        clampFrameIndex(state);
      });
    },
    addFrame() {
      mutateState((state) => addFrame(state));
    },
    duplicateFrame() {
      mutateState((state) => duplicateFrame(state));
    },
    deleteFrame() {
      mutateState((state) => deleteFrame(state));
    },
    setFps(nextFps) {
      mutateState((state) => {
        state.fps = Math.max(1, Math.min(60, Number(nextFps) || state.fps));
      });
    },
    toggleOnionSkin(enabled) {
      mutateState((state) => {
        state.onionSkin = Boolean(enabled);
      });
    }
  };

  const selectors = {
    frameCount() {
      return getState().frames.length;
    },
    currentFrame() {
      return getState().currentFrameIndex;
    }
  };

  return { commands, selectors };
}

// Playback loop controller for stepping through animation frames.
import { normalizeFps } from './fps-controller.js';

export function createPlayback({ getState, onTick }) {
  let timer = null;
  let running = false;

  const scheduleNext = () => {
    if (!running) return;
    const fps = normalizeFps(getState().fps);
    timer = setTimeout(loop, 1000 / fps);
  };

  const loop = () => {
    if (!running) return;
    const state = getState();
    if (state.frames.length > 1) {
      onTick((state.currentFrameIndex + 1) % state.frames.length);
    }
    scheduleNext();
  };

  return {
    start() {
      if (running) return;
      running = true;
      scheduleNext();
    },
    pause() {
      running = false;
      if (timer) clearTimeout(timer);
      timer = null;
    },
    stop() {
      this.pause();
    },
    isRunning() {
      return running;
    }
  };
}

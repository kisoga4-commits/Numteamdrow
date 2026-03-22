// Playback loop controller for stepping through animation frames.
export function createPlayback({ getState, onTick }) {
  let timer = null;
  return {
    start() {
      this.stop();
      const loop = () => {
        const state = getState();
        onTick((state.currentFrameIndex + 1) % state.frames.length);
        timer = setTimeout(loop, 1000 / state.fps);
      };
      timer = setTimeout(loop, 1000 / getState().fps);
    },
    stop() {
      if (timer) clearTimeout(timer);
      timer = null;
    }
  };
}

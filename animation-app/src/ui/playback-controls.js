// Playback controls markup builder for the timeline header.
export function playbackControlsTemplate(state) {
  return `
    <button id="tl-play">${state.playing ? '⏸ Pause' : '▶ Play'}</button>
    <button id="tl-stop">⏹ Stop</button>
    <button id="tl-add">＋ Frame</button>
    <button id="tl-dup">⧉ Duplicate</button>
    <button id="tl-del">🗑 Delete</button>
    <label class="inline-label">FPS <input id="tl-fps" type="number" min="1" max="60" value="${state.fps}" /></label>
    <label class="inline-label"><input id="tl-onion" type="checkbox" ${state.onionSkin ? 'checked' : ''}/> Onion Skin</label>
    <span class="inline-label">Current: <strong>${state.currentFrameIndex + 1}</strong> / ${state.frames.length}</span>
  `;
}

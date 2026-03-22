// Playback controls markup builder for the timeline header.
export function playbackControlsTemplate(state) {
  return `
    <button id="tl-play">${state.playing ? 'Pause' : 'Play'}</button>
    <button id="tl-stop">Stop</button>
    <button id="tl-add">Add Frame</button>
    <button id="tl-dup">Duplicate</button>
    <button id="tl-del">Delete</button>
    <label>FPS <input id="tl-fps" type="number" min="1" max="60" value="${state.fps}" style="width:66px"></label>
    <label><input id="tl-onion" type="checkbox" ${state.onionSkin ? 'checked' : ''}/> Onion Skin</label>
    <span>Current: ${state.currentFrameIndex + 1}/${state.frames.length}</span>
  `;
}

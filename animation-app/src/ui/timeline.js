// Timeline UI render and events for frame and playback operations.
import { playbackControlsTemplate } from './playback-controls.js';
import { createThumbnail } from '../animation/thumbnail-generator.js';

export function renderTimeline(root, state, actions) {
  root.innerHTML = `<div class="timeline-controls">${playbackControlsTemplate(state)}</div><div class="frames-row" id="frames-row"></div>`;
  root.querySelector('#tl-play').addEventListener('click', actions.togglePlay);
  root.querySelector('#tl-stop').addEventListener('click', actions.stop);
  root.querySelector('#tl-add').addEventListener('click', actions.addFrame);
  root.querySelector('#tl-dup').addEventListener('click', actions.duplicateFrame);
  root.querySelector('#tl-del').addEventListener('click', actions.deleteFrame);
  root.querySelector('#tl-fps').addEventListener('change', (e) => actions.setFps(Number(e.target.value)));
  root.querySelector('#tl-onion').addEventListener('change', (e) => actions.toggleOnion(e.target.checked));

  const row = root.querySelector('#frames-row');
  state.frames.forEach((frame, index) => {
    const thumb = createThumbnail(frame, index, index === state.currentFrameIndex);
    thumb.addEventListener('click', () => actions.selectFrame(index));
    row.appendChild(thumb);
  });
}

// Timeline view that renders from state and dispatches command callbacks.
import { createThumbnail } from '../animation/thumbnail-generator.js';
import { playbackControlsTemplate } from './playback-controls.js';

export function renderTimeline(root, model) {
  const {
    frames,
    currentFrameIndex,
    fps,
    onionSkin,
    playing,
    onPlay,
    onPause,
    onStop,
    onAddFrame,
    onDuplicateFrame,
    onDeleteFrame,
    onSetFps,
    onToggleOnion,
    onSelectFrame
  } = model;

  root.innerHTML = `
    <div class="timeline-controls">
      ${playbackControlsTemplate({ frames, currentFrameIndex, fps, onionSkin, playing })}
    </div>
    <div class="frames-row" id="frames-row" aria-label="timeline frames"></div>
  `;

  root.querySelector('#tl-play')?.addEventListener('click', () => {
    if (playing) {
      onPause();
      return;
    }
    onPlay();
  });

  root.querySelector('#tl-stop')?.addEventListener('click', onStop);
  root.querySelector('#tl-add')?.addEventListener('click', onAddFrame);
  root.querySelector('#tl-dup')?.addEventListener('click', onDuplicateFrame);
  root.querySelector('#tl-del')?.addEventListener('click', onDeleteFrame);
  root.querySelector('#tl-fps')?.addEventListener('change', (event) => onSetFps(event.target.value));
  root.querySelector('#tl-onion')?.addEventListener('change', (event) => onToggleOnion(event.target.checked));

  const row = root.querySelector('#frames-row');
  if (!row) return;

  frames.forEach((frame, index) => {
    const thumb = createThumbnail(frame, index, index === currentFrameIndex);
    thumb.addEventListener('click', () => onSelectFrame(index));
    row.appendChild(thumb);
  });
}

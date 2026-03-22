// Timeline view that renders from state and dispatches command callbacks.
export function renderTimeline(root, model) {
  const {
    frames,
    currentFrameIndex,
    fps,
    onionSkin,
    playing,
    onPlay,
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
      <button id="tl-play">▶ ${playing ? 'Playing' : 'Play'}</button>
      <button id="tl-stop">⏹ Stop</button>
      <button id="tl-add">＋ Frame</button>
      <button id="tl-dup">⧉ Duplicate</button>
      <button id="tl-del">🗑 Delete</button>
      <label class="inline-label">FPS <input id="tl-fps" type="number" min="1" max="60" value="${fps}" /></label>
      <label class="inline-label"><input id="tl-onion" type="checkbox" ${onionSkin ? 'checked' : ''} /> Onion Skin</label>
    </div>
    <div class="frames-row" id="frames-row"></div>
  `;

  root.querySelector('#tl-play')?.addEventListener('click', onPlay);
  root.querySelector('#tl-stop')?.addEventListener('click', onStop);
  root.querySelector('#tl-add')?.addEventListener('click', onAddFrame);
  root.querySelector('#tl-dup')?.addEventListener('click', onDuplicateFrame);
  root.querySelector('#tl-del')?.addEventListener('click', onDeleteFrame);
  root.querySelector('#tl-fps')?.addEventListener('change', (event) => onSetFps(event.target.value));
  root.querySelector('#tl-onion')?.addEventListener('change', (event) => onToggleOnion(event.target.checked));

  const row = root.querySelector('#frames-row');
  if (!row) return;

  frames.forEach((frame, index) => {
    const thumb = document.createElement('button');
    thumb.className = `frame-thumb ${index === currentFrameIndex ? 'active' : ''}`;
    thumb.type = 'button';
    thumb.innerHTML = `
      <span class="frame-preview">Frame ${index + 1}</span>
      <span class="frame-meta">${frame.id.slice(0, 8)}</span>
    `;
    thumb.addEventListener('click', () => onSelectFrame(index));
    row.appendChild(thumb);
  });
}

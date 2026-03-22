// Timeline scaffold for Phase 1.
export function renderTimeline(root, model) {
  const { frameCount, onPlaceholderAction } = model;

  root.innerHTML = `
    <div class="timeline-controls">
      <button id="tl-play">▶ Play</button>
      <button id="tl-stop">⏹ Stop</button>
      <button id="tl-add">＋ Frame</button>
      <label class="inline-label">FPS <input id="tl-fps" type="number" min="1" max="60" value="12" /></label>
      <label class="inline-label"><input id="tl-onion" type="checkbox" /> Onion Skin</label>
    </div>
    <div class="frames-row" id="frames-row"></div>
  `;

  root.querySelector('#tl-play')?.addEventListener('click', () => onPlaceholderAction('play'));
  root.querySelector('#tl-stop')?.addEventListener('click', () => onPlaceholderAction('stop'));
  root.querySelector('#tl-add')?.addEventListener('click', () => onPlaceholderAction('add-frame'));
  root.querySelector('#tl-fps')?.addEventListener('change', () => onPlaceholderAction('set-fps'));
  root.querySelector('#tl-onion')?.addEventListener('change', () => onPlaceholderAction('toggle-onion'));

  const row = root.querySelector('#frames-row');
  if (!row) return;

  for (let i = 0; i < frameCount; i += 1) {
    const thumb = document.createElement('button');
    thumb.className = `frame-thumb ${i === 0 ? 'active' : ''}`;
    thumb.type = 'button';
    thumb.innerHTML = `
      <span class="frame-preview">Frame ${i + 1}</span>
      <span class="frame-meta">00:${String(i).padStart(2, '0')}</span>
    `;
    thumb.addEventListener('click', () => onPlaceholderAction(`select-frame-${i + 1}`));
    row.appendChild(thumb);
  }
}

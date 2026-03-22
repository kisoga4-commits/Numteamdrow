// Generates a tiny canvas thumbnail element for frame previews.
import { drawFrameToCanvas } from '../canvas/renderer.js';

export function createThumbnail(frame, index, active) {
  const button = document.createElement('button');
  button.className = `frame-thumb ${active ? 'active' : ''}`;
  button.type = 'button';

  const indicator = active ? '<span class="frame-current-indicator">● Current</span>' : '';
  button.innerHTML = `
    <canvas width="84" height="50" aria-hidden="true"></canvas>
    <div class="frame-preview-meta">
      <strong>Frame ${index + 1}</strong>
      ${indicator}
    </div>
  `;

  const canvas = button.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  drawFrameToCanvas(ctx, frame, canvas.width, canvas.height);

  return button;
}

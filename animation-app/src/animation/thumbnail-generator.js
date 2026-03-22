// Generates a tiny canvas thumbnail element for frame previews.
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
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (frame.imageDataUrl) {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = frame.imageDataUrl;
  }

  return button;
}

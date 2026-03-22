// Generates a tiny canvas thumbnail element for frame previews.
export function createThumbnail(frame, index, active) {
  const button = document.createElement('button');
  button.className = `frame-thumb ${active ? 'active' : ''}`;
  button.innerHTML = `<canvas width="84" height="50"></canvas><div>Frame ${index + 1}</div>`;
  const canvas = button.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (frame.imageDataUrl) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = frame.imageDataUrl;
  }
  return button;
}

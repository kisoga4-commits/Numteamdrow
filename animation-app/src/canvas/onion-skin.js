// Onion skin renderer for previous frame preview.
import { drawFrameStrokes } from './renderer.js';

export function renderOnionSkin(ctx, prevFrame, width, height, enabled) {
  ctx.clearRect(0, 0, width, height);

  if (!enabled || !prevFrame) return;

  if (Array.isArray(prevFrame.layers)) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    drawFrameStrokes(ctx, prevFrame);
    ctx.restore();
    return;
  }

  if (!prevFrame.imageDataUrl) return;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.globalAlpha = 1;
  };
  img.src = prevFrame.imageDataUrl;
}

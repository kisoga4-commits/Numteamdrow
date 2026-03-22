// Onion skin renderer for previous frame preview.
export function renderOnionSkin(ctx, prevFrame, width, height, enabled) {
  ctx.clearRect(0, 0, width, height);
  if (!enabled || !prevFrame?.imageDataUrl) return;
  const img = new Image();
  img.onload = () => {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.globalAlpha = 1;
  };
  img.src = prevFrame.imageDataUrl;
}

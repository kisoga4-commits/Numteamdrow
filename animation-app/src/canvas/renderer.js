// Canvas renderer that paints current frame and optional onion skin.
export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function drawFrameToCanvas(ctx, frame, width, height) {
  clearCanvas(ctx, width, height);
  if (!frame?.imageDataUrl) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0, width, height);
  img.src = frame.imageDataUrl;
}

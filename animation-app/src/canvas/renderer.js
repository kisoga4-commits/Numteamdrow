// Canvas renderer that paints current frame and optional onion skin.
const drawTokens = new WeakMap();

function nextToken(ctx) {
  const token = (drawTokens.get(ctx) ?? 0) + 1;
  drawTokens.set(ctx, token);
  return token;
}

export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function clearOverlayCanvas(ctx) {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawFrameToCanvas(ctx, frame, width, height) {
  const token = nextToken(ctx);
  clearCanvas(ctx, width, height);

  // White backing so eraser behaves as expected on exported frames.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  if (!frame?.imageDataUrl) return;

  const img = new Image();
  img.onload = () => {
    if (drawTokens.get(ctx) !== token) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  };
  img.src = frame.imageDataUrl;
}

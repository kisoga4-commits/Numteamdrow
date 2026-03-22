// Onion skin renderer for previous frame preview.
const onionTokens = new WeakMap();

function nextToken(ctx) {
  const token = (onionTokens.get(ctx) ?? 0) + 1;
  onionTokens.set(ctx, token);
  return token;
}

export function renderOnionSkin(ctx, prevFrame, width, height, enabled) {
  const token = nextToken(ctx);
  ctx.clearRect(0, 0, width, height);

  if (!enabled || !prevFrame?.imageDataUrl) return;

  const img = new Image();
  img.onload = () => {
    if (onionTokens.get(ctx) !== token) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.globalAlpha = 1;
  };
  img.src = prevFrame.imageDataUrl;
}

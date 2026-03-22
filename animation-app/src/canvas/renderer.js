// Canvas renderer that paints current frame and optional onion skin.

export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function clearOverlayCanvas(ctx) {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawPointDot(ctx, point, radius) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, Math.max(0.5, radius), 0, Math.PI * 2);
  ctx.fill();
}

function applyStrokeStyle(ctx, stroke) {
  ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.globalAlpha = typeof stroke.opacity === 'number' ? stroke.opacity : 1;
  ctx.lineWidth = Math.max(1, Number(stroke.size) || 1);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.tool !== 'eraser') {
    ctx.strokeStyle = stroke.color || '#000000';
    ctx.fillStyle = stroke.color || '#000000';
  }
}

export function replayStroke(ctx, stroke) {
  if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
    return;
  }

  ctx.save();
  applyStrokeStyle(ctx, stroke);

  const [firstPoint, ...restPoints] = stroke.points;
  drawPointDot(ctx, firstPoint, (Number(stroke.size) || 1) / 2);

  if (restPoints.length > 0) {
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    restPoints.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  ctx.restore();
}

export function drawFrameStrokes(ctx, frame) {
  if (!frame) return;
  const layers = Array.isArray(frame.layers) ? frame.layers : [];
  layers.forEach((layer) => {
    const strokes = Array.isArray(layer?.strokes) ? layer.strokes : [];
    strokes.forEach((stroke) => replayStroke(ctx, stroke));
  });
}

function drawFrameImageDataUrl(ctx, frame, width, height) {
  if (!frame?.imageDataUrl) return;
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
  };
  img.src = frame.imageDataUrl;
}

export function drawFrameToCanvas(ctx, frame, width, height) {
  clearCanvas(ctx, width, height);
  if (Array.isArray(frame?.layers)) {
    drawFrameStrokes(ctx, frame);
    return;
  }
  drawFrameImageDataUrl(ctx, frame, width, height);
}

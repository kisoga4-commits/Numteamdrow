// Freehand brush drawing tool implementation.
export const brushTool = {
  drawing: false,
  onPointerDown(ctx, point, state) {
    this.drawing = true;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = state.color;
    ctx.fillStyle = state.color;
    ctx.lineWidth = state.brushSize;
    ctx.globalAlpha = state.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    // Draw a dot for single click input.
    ctx.arc(point.x, point.y, Math.max(0.5, state.brushSize / 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  },
  onPointerMove(ctx, point) {
    if (!this.drawing) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  },
  onPointerUp(ctx) {
    if (!this.drawing) return;
    this.drawing = false;
    ctx.closePath();
    ctx.restore();
  }
};

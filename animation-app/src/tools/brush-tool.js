// Freehand brush drawing tool implementation.
export const brushTool = {
  onPointerDown(ctx, point, state) {
    ctx.strokeStyle = state.color;
    ctx.lineWidth = state.brushSize;
    ctx.globalAlpha = state.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  },
  onPointerMove(ctx, point) {
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  },
  onPointerUp(ctx) {
    ctx.closePath();
    ctx.globalAlpha = 1;
  }
};

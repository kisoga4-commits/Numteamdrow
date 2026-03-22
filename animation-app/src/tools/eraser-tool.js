// Eraser tool using destination-out compositing.
export const eraserTool = {
  onPointerDown(ctx, point, state) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  },
  onPointerMove(ctx, point) {
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  },
  onPointerUp(ctx) {
    ctx.closePath();
    ctx.restore();
  }
};

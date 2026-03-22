// Eraser tool using destination-out compositing.
export const eraserTool = {
  activeStroke: null,
  onPointerDown(ctx, point, state) {
    this.activeStroke = {
      id: crypto.randomUUID(),
      tool: 'eraser',
      color: null,
      size: state.brushSize,
      opacity: state.opacity,
      points: [{ x: point.x, y: point.y }]
    };

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = state.opacity;
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Erase a small dot for click input.
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(0.5, state.brushSize / 2), 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  },
  onPointerMove(ctx, point) {
    if (!this.activeStroke) return;
    this.activeStroke.points.push({ x: point.x, y: point.y });
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  },
  onPointerUp(ctx) {
    if (!this.activeStroke) return null;
    const committedStroke = this.activeStroke;
    this.activeStroke = null;
    ctx.closePath();
    ctx.restore();
    return committedStroke;
  }
};

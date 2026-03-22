// Freehand brush drawing tool implementation.
export const brushTool = {
  activeStroke: null,
  onPointerDown(ctx, point, state) {
    this.activeStroke = {
      id: crypto.randomUUID(),
      tool: 'brush',
      color: state.color,
      size: state.brushSize,
      opacity: state.opacity,
      points: [{ x: point.x, y: point.y }]
    };

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = state.color;
    ctx.fillStyle = state.color;
    ctx.lineWidth = state.brushSize;
    ctx.globalAlpha = state.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw a dot for single click input.
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

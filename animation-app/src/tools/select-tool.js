// Basic select tool scaffold with overlay rendering for future selection workflows.
function drawSelectionRect(overlayCtx, start, end) {
  if (!overlayCtx || !start || !end) return;

  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(start.x - end.x);
  const h = Math.abs(start.y - end.y);

  overlayCtx.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
  overlayCtx.save();
  overlayCtx.setLineDash([8, 6]);
  overlayCtx.lineWidth = 1;
  overlayCtx.strokeStyle = '#38bdf8';
  overlayCtx.strokeRect(x, y, w, h);
  overlayCtx.restore();
}

export const selectTool = {
  selecting: false,
  start: null,
  onPointerDown(_ctx, point, state, overlayCtx) {
    this.selecting = true;
    this.start = point;
    state.selection = {
      ...state.selection,
      active: false,
      draft: { x: point.x, y: point.y, width: 0, height: 0 }
    };
    drawSelectionRect(overlayCtx, this.start, point);
  },
  onPointerMove(_ctx, point, state, overlayCtx) {
    if (!this.selecting || !this.start) return;
    drawSelectionRect(overlayCtx, this.start, point);

    state.selection = {
      ...state.selection,
      active: false,
      draft: {
        x: Math.min(this.start.x, point.x),
        y: Math.min(this.start.y, point.y),
        width: Math.abs(this.start.x - point.x),
        height: Math.abs(this.start.y - point.y)
      }
    };
  },
  onPointerUp(_ctx, state, overlayCtx) {
    if (!this.selecting) return;
    this.selecting = false;

    const box = state.selection?.draft;
    const hasArea = box && box.width > 0 && box.height > 0;

    state.selection = {
      ...state.selection,
      active: Boolean(hasArea),
      bounds: hasArea ? { ...box } : null,
      draft: null
    };

    // Keep overlay clean for future guide layers.
    overlayCtx?.clearRect(0, 0, overlayCtx.canvas.width, overlayCtx.canvas.height);
    this.start = null;
  }
};

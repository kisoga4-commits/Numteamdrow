// Stage shell with canvas placeholders for Phase 1.
export function createStageLayout(root) {
  root.innerHTML = `
    <div class="stage-inner" id="stage-inner">
      <header class="stage-header">
        <h2>Animation Stage</h2>
        <p>Drawing engine ready (Brush / Eraser / Select scaffold)</p>
      </header>

      <div class="canvas-wrap" id="canvas-wrap" aria-label="animation stage">
        <canvas id="onion-canvas" width="960" height="540" aria-hidden="true"></canvas>
        <canvas id="main-canvas" width="960" height="540"></canvas>
        <canvas id="overlay-canvas" width="960" height="540" aria-hidden="true"></canvas>

        <div class="stage-watermark">
          <strong>Phase 2</strong>
          <span>Canvas drawing active • Selection guides ready</span>
        </div>
      </div>

      <div id="status-chip" class="status-chip">Offline-ready shell loaded</div>
    </div>
  `;
}

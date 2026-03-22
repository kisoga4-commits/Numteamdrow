// Creates the canvas stage and static layout scaffolding.
import { APP_CONFIG } from '../config.js';

export function createStageLayout(root) {
  root.innerHTML = `
    <div class="stage-inner" id="stage-inner">
      <div class="canvas-wrap" id="canvas-wrap">
        <canvas id="onion-canvas" width="${APP_CONFIG.canvasWidth}" height="${APP_CONFIG.canvasHeight}"></canvas>
        <canvas id="main-canvas" width="${APP_CONFIG.canvasWidth}" height="${APP_CONFIG.canvasHeight}"></canvas>
        <canvas id="overlay-canvas" width="${APP_CONFIG.canvasWidth}" height="${APP_CONFIG.canvasHeight}"></canvas>
      </div>
      <div id="status-chip" class="status-chip">Offline ready</div>
    </div>
  `;
}

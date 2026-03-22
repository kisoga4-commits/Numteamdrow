// Properties panel for color, brush, opacity, and placeholder layer controls.
export function renderProperties(root, state, actions) {
  root.innerHTML = `
    <div class="prop-group">
      <p class="panel-title">Brush</p>
      <label>Color <input type="color" id="prop-color" value="${state.color}" /></label>
      <label>Size <input type="range" id="prop-size" min="1" max="60" value="${state.brushSize}" /></label>
      <label>Opacity <input type="range" id="prop-opacity" min="0.1" max="1" step="0.05" value="${state.opacity}" /></label>
    </div>
    <div class="prop-group">
      <p class="panel-title">Layer Settings (MVP placeholder)</p>
      <label>Active Layer <input id="prop-layer" type="number" min="0" value="${state.layerSettings.activeLayer}" /></label>
      <small>Prepared for next phase layer manager.</small>
    </div>
    <div class="prop-group">
      <p class="panel-title">Project</p>
      <button id="btn-export">Export JSON</button>
      <button id="btn-import">Import JSON</button>
    </div>
  `;

  root.querySelector('#prop-color').addEventListener('input', (e) => actions.setColor(e.target.value));
  root.querySelector('#prop-size').addEventListener('input', (e) => actions.setBrushSize(Number(e.target.value)));
  root.querySelector('#prop-opacity').addEventListener('input', (e) => actions.setOpacity(Number(e.target.value)));
  root.querySelector('#prop-layer').addEventListener('change', (e) => actions.setLayer(Number(e.target.value)));
  root.querySelector('#btn-export').addEventListener('click', actions.exportProject);
  root.querySelector('#btn-import').addEventListener('click', actions.importProject);
}

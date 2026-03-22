// Properties panel rendering from central state.
export function renderProperties(root, model) {
  const {
    color,
    brushSize,
    opacity,
    onColorChange,
    onBrushSizeChange,
    onOpacityChange,
    onExport,
    onImport
  } = model;

  root.innerHTML = `
    <div class="prop-group">
      <p class="panel-title">Brush</p>
      <label>
        Color
        <input id="prop-color" type="color" value="${color}" />
      </label>
      <label>
        Size: <strong>${brushSize}px</strong>
        <input id="prop-size" type="range" min="1" max="80" value="${brushSize}" />
      </label>
      <label>
        Opacity: <strong>${Math.round(opacity * 100)}%</strong>
        <input id="prop-opacity" type="range" min="0" max="100" value="${Math.round(opacity * 100)}" />
      </label>
    </div>

    <div class="prop-group">
      <p class="panel-title">Layer</p>
      <label>
        Active Layer
        <select disabled>
          <option>Layer 1</option>
        </select>
      </label>
    </div>

    <div class="prop-group">
      <p class="panel-title">Project</p>
      <button id="btn-export">Export JSON</button>
      <label class="file-import-btn">
        Import JSON
        <input id="btn-import" type="file" accept="application/json" />
      </label>
    </div>
  `;

  root.querySelector('#prop-color')?.addEventListener('input', (event) => onColorChange(event.target.value));
  root.querySelector('#prop-size')?.addEventListener('input', (event) => onBrushSizeChange(event.target.value));
  root.querySelector('#prop-opacity')?.addEventListener('input', (event) => onOpacityChange(event.target.value));
  root.querySelector('#btn-export')?.addEventListener('click', onExport);
  root.querySelector('#btn-import')?.addEventListener('change', (event) => {
    const [file] = event.target.files ?? [];
    if (file) onImport(file);
    event.target.value = '';
  });
}

// Properties panel scaffold for Phase 1.
export function renderProperties(root, actions) {
  root.innerHTML = `
    <div class="prop-group">
      <p class="panel-title">Brush</p>
      <label>
        Color
        <input type="color" value="#60a5fa" disabled />
      </label>
      <label>
        Size
        <input type="range" min="1" max="60" value="12" disabled />
      </label>
      <label>
        Opacity
        <input type="range" min="0" max="100" value="100" disabled />
      </label>
      <small>Editable properties will become active in Phase 2.</small>
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
      <button id="btn-import">Import JSON</button>
    </div>
  `;

  root.querySelector('#btn-export')?.addEventListener('click', actions.onExport);
  root.querySelector('#btn-import')?.addEventListener('click', actions.onImport);
}

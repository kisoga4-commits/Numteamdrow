// Toolbar shell for Phase 1.
const TOOLS = ['brush', 'eraser', 'select', 'line', 'rectangle', 'ellipse', 'fill', 'text'];

export function renderToolbar(root, model) {
  const { activeTool, theme, onSelectTool, onToggleTheme } = model;

  root.innerHTML = `
    <div class="toolbar-brand">
      <h1>AnimLab</h1>
      <p>PWA</p>
    </div>

    <div class="toolbar-tools">
      ${TOOLS.map(
        (tool) => `<button class="tool-btn ${tool === activeTool ? 'is-active' : ''}" data-tool="${tool}">${tool}</button>`
      ).join('')}
    </div>

    <div class="toolbar-footer">
      <button id="theme-toggle" class="theme-toggle">${theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</button>
    </div>
  `;

  root.querySelectorAll('[data-tool]').forEach((button) => {
    button.addEventListener('click', () => onSelectTool(button.dataset.tool));
  });

  root.querySelector('#theme-toggle')?.addEventListener('click', onToggleTheme);
}

// Toolbar rendering and active tool button interaction.
const TOOLS = ['brush', 'eraser', 'select', 'line', 'rectangle', 'ellipse', 'fill', 'hand', 'zoom', 'text'];

export function renderToolbar(root, onSelectTool, activeTool) {
  root.innerHTML = TOOLS.map((tool) => `<button class="tool-btn ${tool === activeTool ? 'is-active' : ''}" data-tool="${tool}">${tool}</button>`).join('');
  root.querySelectorAll('[data-tool]').forEach((button) => {
    button.addEventListener('click', () => onSelectTool(button.dataset.tool));
  });
}

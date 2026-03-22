// Keyboard shortcut bindings for core actions.
export function bindShortcuts({ setTool, addFrame, togglePlay }) {
  window.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === 'b') setTool('brush');
    if (event.key === 'e') setTool('eraser');
    if (event.key === ' ') {
      event.preventDefault();
      togglePlay();
    }
    if (event.key === 'n') addFrame();
  });
}

// Small toast-style notification presenter for app events.
let timer = null;

export function notify(message) {
  let node = document.querySelector('.toast');
  if (!node) {
    node = document.createElement('div');
    node.className = 'toast';
    document.body.appendChild(node);
  }
  node.textContent = message;
  clearTimeout(timer);
  timer = setTimeout(() => node.remove(), 1800);
}

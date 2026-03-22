// Lightweight undo/redo stacks prepared for future advanced history support.
export const history = {
  undoStack: [],
  redoStack: []
};

export function pushHistory(snapshot) {
  history.undoStack.push(snapshot);
  history.redoStack.length = 0;
}

export function undo() {
  const item = history.undoStack.pop();
  if (!item) return null;
  history.redoStack.push(item);
  return item;
}

export function redo() {
  return history.redoStack.pop() ?? null;
}

// FPS safety clamps and validation.
export function normalizeFps(value) {
  return Math.min(60, Math.max(1, Number(value) || 8));
}

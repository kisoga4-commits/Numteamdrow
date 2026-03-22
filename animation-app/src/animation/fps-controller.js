// FPS safety clamps and validation.
const MIN_FPS = 1;
const MAX_FPS = 60;
const FALLBACK_FPS = 8;

export function normalizeFps(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return FALLBACK_FPS;
  return Math.min(MAX_FPS, Math.max(MIN_FPS, Math.round(parsed)));
}

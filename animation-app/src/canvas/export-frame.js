// Converts current drawing canvas into frame data URL.
export function frameFromCanvas(canvas) {
  return canvas.toDataURL('image/png');
}

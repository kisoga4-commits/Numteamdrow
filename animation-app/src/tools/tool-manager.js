// Tool router that forwards pointer events to active tool handlers.
import { brushTool } from './brush-tool.js';
import { eraserTool } from './eraser-tool.js';
import { selectTool } from './select-tool.js';
import { placeholderTool } from './tool-placeholder.js';

const map = {
  brush: brushTool,
  eraser: eraserTool,
  select: selectTool,
  line: placeholderTool,
  rectangle: placeholderTool,
  ellipse: placeholderTool,
  fill: placeholderTool,
  hand: placeholderTool,
  zoom: placeholderTool,
  text: placeholderTool
};

export function getTool(name) {
  return map[name] ?? brushTool;
}

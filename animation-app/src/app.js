// Phase 1 app composition: mount shell UI only (no full drawing logic yet).
import { createStageLayout } from './ui/layout.js';
import { renderToolbar } from './ui/toolbar.js';
import { renderProperties } from './ui/properties-panel.js';
import { renderTimeline } from './ui/timeline.js';
import { notify } from './ui/notifications.js';

export function startApp() {
  const appRoot = document.getElementById('app');
  const stageRoot = document.getElementById('stage-area');
  const toolbarRoot = document.getElementById('toolbar');
  const propertiesRoot = document.getElementById('properties-panel');
  const timelineRoot = document.getElementById('timeline');

  if (!appRoot || !stageRoot || !toolbarRoot || !propertiesRoot || !timelineRoot) {
    throw new Error('App root nodes are missing from index.html');
  }

  createStageLayout(stageRoot);

  let activeTool = 'brush';
  let isDarkMode = true;

  const refresh = () => {
    renderToolbar(toolbarRoot, {
      activeTool,
      isDarkMode,
      onSelectTool: (tool) => {
        activeTool = tool;
        refresh();
        notify(`Tool switched: ${tool}`);
      },
      onToggleTheme: () => {
        isDarkMode = !isDarkMode;
        document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
        refresh();
      }
    });

    renderProperties(propertiesRoot, {
      onExport: () => notify('Phase 1: export will be implemented in Phase 2'),
      onImport: () => notify('Phase 1: import will be implemented in Phase 2')
    });

    renderTimeline(timelineRoot, {
      frameCount: 8,
      onPlaceholderAction: (actionName) => notify(`Phase 1 placeholder: ${actionName}`)
    });
  };

  document.documentElement.dataset.theme = 'dark';
  refresh();
}

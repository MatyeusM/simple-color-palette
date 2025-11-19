import './style.css'
import { ColorPicker } from './app/color-picker'
import { Preview } from './app/preview'
import { OutputSpaceSelector } from './app/output-space-selector'
import { Export } from './app/export'
import { initThemeToggle } from './app/theme-toggle'

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  // Initialize color picker
  const colorPicker = new ColorPicker()

  // Initialize preview
  const preview = new Preview('preview')

  // Initialize output space selector
  const outputSpaceSelector = new OutputSpaceSelector('outputSpace')

  // Initialize export
  const exportComponent = new Export('exportFormat', 'exportButton')

  // Initialize theme toggle
  initThemeToggle()

  // Components are stored but used for their side effects (event listeners)
  // Mark as used to satisfy linter
  if (colorPicker && preview && outputSpaceSelector && exportComponent) {
    // All components initialized
  }
})

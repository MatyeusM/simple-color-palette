import { state } from '../state'
import type { ThemePreference } from '../types'

export function initThemeToggle() {
  const container = document.getElementById('themeToggle')
  if (!container) return

  // Create the theme toggle UI
  const render = (currentTheme: ThemePreference) => {
    container.innerHTML = `
      <button
        class="theme-button"
        data-theme="light"
        aria-label="Light mode"
        ${currentTheme === 'light' ? 'data-active="true"' : ''}
      >
        ☀️
      </button>
      <button
        class="theme-button"
        data-theme="dark"
        aria-label="Dark mode"
        ${currentTheme === 'dark' ? 'data-active="true"' : ''}
      >
        🌙
      </button>
      <button
        class="theme-button"
        data-theme="system"
        aria-label="System theme"
        ${currentTheme === 'system' ? 'data-active="true"' : ''}
      >
        💻
      </button>
    `

    // Add click handlers
    const buttons = container.querySelectorAll('.theme-button')
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const theme = (button as HTMLElement).dataset.theme as ThemePreference
        state.setThemePreference(theme)
      })
    })
  }

  // Subscribe to state changes
  state.subscribe((appState) => {
    render(appState.themePreference)
  })
}

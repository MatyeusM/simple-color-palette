import type { PaletteColor } from '../types'
import { state } from '../state'
import { getElement } from '../utils/dom'

export class Preview {
  private container: HTMLElement

  constructor(containerId: string) {
    this.container = getElement(containerId, 'Preview container')
    this.init()
  }

  private init() {
    // Subscribe to state changes and render palette
    state.subscribe(appState => {
      this.render(appState.paletteMap)
    })
  }

  private render(paletteMap: Map<string, PaletteColor[]>) {
    // Clear existing content
    this.container.innerHTML = ''

    let previousPaletteName = ''

    // Render each palette as a horizontal row
    for (const [paletteId, palette] of paletteMap) {
      const paletteName = state.getPaletteGeneratorName(paletteId)

      if (paletteName !== previousPaletteName) {
        const header = document.createElement('h3')
        header.className = 'palette-heading'
        header.textContent = paletteName
        this.container.append(header)

        previousPaletteName = paletteName
      }

      // Create palette row (1 row = 1 palette)
      const row = document.createElement('div')
      row.className = 'palette-row'

      // Create swatches
      for (const paletteColor of palette) {
        const swatch = document.createElement('div')
        swatch.className = 'swatch'
        swatch.style.backgroundColor = paletteColor.hex
        swatch.setAttribute('role', 'button')
        swatch.setAttribute('aria-label', `${paletteColor.label}: ${paletteColor.hex}. Click to copy.`)
        swatch.setAttribute('tabindex', '0')

        // Add click to copy functionality
        const copyToClipboard = () => {
          navigator.clipboard.writeText(paletteColor.hex).then(() => {
            // Visual feedback
            swatch.classList.add('copied')
            setTimeout(() => swatch.classList.remove('copied'), 300)
          }).catch(error => {
            console.error('Failed to copy:', error)
          })
        }

        swatch.addEventListener('click', copyToClipboard)
        swatch.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            copyToClipboard()
          }
        })

        const label = document.createElement('div')
        label.className = 'swatch-label'
        label.textContent = paletteColor.label

        const value = document.createElement('div')
        value.className = 'swatch-value'
        value.textContent = paletteColor.hex

        const info = document.createElement('div')
        info.className = 'swatch-info'
        info.append(label, value)

        swatch.append(info)
        row.append(swatch)
      }

      this.container.append(row)
    }
  }
}

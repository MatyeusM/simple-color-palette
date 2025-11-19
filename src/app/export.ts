import type { ExportFormat } from '../types'
import { state } from '../state'
import { getElement } from '../utils/dom'

export class Export {
  private formatSelect: HTMLSelectElement
  private exportButton: HTMLButtonElement

  constructor(formatSelectId: string, exportButtonId: string) {
    this.formatSelect = getElement<HTMLSelectElement>(formatSelectId, 'Export format select')
    this.exportButton = getElement<HTMLButtonElement>(exportButtonId, 'Export button')
    this.init()
  }

  private init() {
    // Listen to format select changes
    this.formatSelect.addEventListener('change', event => {
      const target = event.target as HTMLSelectElement
      const format = target.value as ExportFormat
      state.setExportFormat(format)
    })

    // Listen to export button clicks
    this.exportButton.addEventListener('click', () => {
      this.exportPalette()
    })

    // Subscribe to state changes to sync format select
    state.subscribe(appState => {
      if (this.formatSelect.value !== appState.exportFormat) {
        this.formatSelect.value = appState.exportFormat
      }
    })
  }

  private exportPalette() {
    const appState = state.getState()
    const { paletteMap, exportFormat, outputSpace } = appState

    let content: string
    let filename: string

    if (exportFormat === 'json') {
      const data: Record<string, unknown> = { outputSpace, palettes: {} }
      const palettes: Record<string, Array<{ label: string; hex: string; rgb: number[] }>> = {}

      for (const [paletteName, palette] of paletteMap) {
        palettes[paletteName] = palette.map(p => ({
          label: p.label,
          hex: p.hex,
          rgb: p.color.coords,
        }))
      }

      data.palettes = palettes
      content = JSON.stringify(data, undefined, 2)
      filename = 'color-palette.json'
    } else {
      // Markdown format
      content = `# Color Palette\n\n`
      content += `**Output Space:** ${outputSpace}\n\n`

      for (const [paletteName, palette] of paletteMap) {
        content += `## ${paletteName}\n\n`
        content += `| Label | Hex | RGB |\n`
        content += `|-------|-----|-----|\n`
        for (const p of palette) {
          const rgb = p.color.coords.map((c: number) => Math.round(c * 255)).join(', ')
          content += `| ${p.label} | ${p.hex} | ${rgb} |\n`
        }
        content += `\n`
      }

      filename = 'color-palette.md'
    }

    // Create download
    this.downloadFile(content, filename)
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }
}

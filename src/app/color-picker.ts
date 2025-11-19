import Color from 'colorjs.io'
import type { ColorMode, ColorModeConfig } from '../types'
import { state } from '../state'
import { getElement } from '../utils/dom'

export class ColorPicker {
  private colorModeRadios: NodeListOf<HTMLInputElement>
  private sliders: [HTMLInputElement, HTMLInputElement, HTMLInputElement]
  private labels: [HTMLElement, HTMLElement, HTMLElement]
  private values: [HTMLElement, HTMLElement, HTMLElement]
  private colorSwatch: HTMLElement
  private colorValue: HTMLElement
  private currentMode: ColorMode = 'oklch'
  private isUpdating = false
  private debounceTimer: number | undefined = undefined

  private modeConfigs: Record<ColorMode, ColorModeConfig> = {
    oklch: {
      channels: [
        { label: 'L', min: 0, max: 1, step: 0.01, formatValue: v => v.toFixed(2) },
        { label: 'C', min: 0, max: 0.4, step: 0.01, formatValue: v => v.toFixed(2) },
        { label: 'H', min: 0, max: 360, step: 1, formatValue: v => v.toFixed(0) },
      ],
      getColor: ([l, c, h]) => new Color('oklch', [l, c, h]),
      getValues: color => {
        const oklch = color.to('oklch')
        return [oklch.l, oklch.c, oklch.h || 0]
      },
    },
    hsl: {
      channels: [
        { label: 'H', min: 0, max: 360, step: 1, formatValue: v => v.toFixed(0) },
        { label: 'S', min: 0, max: 100, step: 1, formatValue: v => v.toFixed(0) },
        { label: 'L', min: 0, max: 100, step: 1, formatValue: v => v.toFixed(0) },
      ],
      getColor: ([h, s, l]) => new Color('hsl', [h, s, l]),
      getValues: color => {
        const hsl = color.to('hsl').toGamut({ method: 'css', deltaEMethod: 'OK' })
        return [hsl.h || 0, hsl.s, hsl.l]
      },
    },
    rgb: {
      channels: [
        { label: 'R', min: 0, max: 255, step: 1, formatValue: v => v.toFixed(0) },
        { label: 'G', min: 0, max: 255, step: 1, formatValue: v => v.toFixed(0) },
        { label: 'B', min: 0, max: 255, step: 1, formatValue: v => v.toFixed(0) },
      ],
      getColor: ([r, g, b]) => new Color('srgb', [r / 255, g / 255, b / 255]),
      getValues: color => {
        const rgb = color.to('srgb').toGamut({ method: 'css', deltaEMethod: 'OK' })
        return [rgb.r * 255, rgb.g * 255, rgb.b * 255]
      },
    },
  }

  constructor() {
    this.colorModeRadios = document.querySelectorAll('input[name="colorMode"]')
    this.sliders = [
      getElement<HTMLInputElement>('channel0', 'Channel slider'),
      getElement<HTMLInputElement>('channel1', 'Channel slider'),
      getElement<HTMLInputElement>('channel2', 'Channel slider'),
    ]
    this.labels = [
      getElement('channel0Label', 'Channel label'),
      getElement('channel1Label', 'Channel label'),
      getElement('channel2Label', 'Channel label'),
    ]
    this.values = [
      getElement('channel0Value', 'Channel value'),
      getElement('channel1Value', 'Channel value'),
      getElement('channel2Value', 'Channel value'),
    ]
    this.colorSwatch = getElement('colorSwatch', 'Color swatch')
    this.colorValue = getElement('colorValue', 'Color value')

    this.init()
  }

  private init() {
    // Listen to color mode changes
    for (const radio of this.colorModeRadios) {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.currentMode = radio.value as ColorMode
          state.setColorMode(this.currentMode)
          this.updateSliderConfiguration()
          this.updateSlidersFromState()
        }
      })
    }

    // Listen to slider changes
    for (const slider of this.sliders) {
      slider.addEventListener('input', () => {
        if (this.isUpdating) return
        this.handleSliderChange()
      })
    }

    // Subscribe to state changes
    state.subscribe(() => {
      if (this.isUpdating) return
      this.updateSlidersFromState()
    })

    // Initialize with current state
    this.currentMode = state.getState().colorMode
    const checkedRadio = [...this.colorModeRadios].find(r => r.value === this.currentMode)
    if (checkedRadio) checkedRadio.checked = true

    this.updateSliderConfiguration()
    this.updateSlidersFromState()

    // Add paste event listener for setting color from clipboard
    this.initPasteListener()
  }

  private initPasteListener() {
    document.addEventListener('paste', event => {
      const pastedText = event.clipboardData?.getData('text')
      if (!pastedText) return

      try {
        // Try to parse the pasted text as a color
        const color = new Color(pastedText.trim())
        const oklchColor = color.to('oklch')

        // If successful, update the base color
        this.isUpdating = true
        state.setBaseColor(oklchColor)
        this.isUpdating = false

        // Show brief visual feedback
        this.colorSwatch.style.outline = '3px solid var(--color-accent-start)'
        setTimeout(() => {
          this.colorSwatch.style.outline = ''
        }, 500)
      } catch {
        // Invalid color, silently ignore
      }
    })
  }

  private updateSliderConfiguration() {
    const config = this.modeConfigs[this.currentMode]

    for (const [index, channelConfig] of config.channels.entries()) {
      const slider = this.sliders[index]
      const label = this.labels[index]

      // Update label
      label.textContent = channelConfig.label

      // Update slider attributes
      slider.min = channelConfig.min.toString()
      slider.max = channelConfig.max.toString()
      slider.step = channelConfig.step.toString()
    }
  }

  private handleSliderChange() {
    const config = this.modeConfigs[this.currentMode]
    const values: [number, number, number] = [
      Number.parseFloat(this.sliders[0].value),
      Number.parseFloat(this.sliders[1].value),
      Number.parseFloat(this.sliders[2].value),
    ]

    // Update value displays immediately
    for (const [index, channelConfig] of config.channels.entries()) {
      this.values[index].textContent = channelConfig.formatValue(values[index])
    }

    // Update gradients immediately
    this.updateGradients(values)

    // Debounce expensive state update
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = globalThis.setTimeout(() => {
      // Convert to color and update state
      try {
        const color = config.getColor(values)
        const oklchColor = color.to('oklch')

        this.isUpdating = true
        state.setBaseColor(oklchColor)
        this.updateColorDisplay(oklchColor)
        this.isUpdating = false
      } catch {
        // Invalid color, ignore
      }
    }, 100) // 100ms debounce
  }

  private updateSlidersFromState() {
    const baseColor = state.getState().baseColor
    const config = this.modeConfigs[this.currentMode]
    const values = config.getValues(baseColor)

    this.isUpdating = true

    // Update slider values and displays
    for (const [index, value] of values.entries()) {
      this.sliders[index].value = value.toString()
      this.values[index].textContent = config.channels[index].formatValue(value)
    }

    // Update gradients
    this.updateGradients(values)

    // Update color display
    this.updateColorDisplay(baseColor)

    this.isUpdating = false
  }

  private updateGradients(currentValues: [number, number, number]) {
    for (const [index, slider] of this.sliders.entries()) {
      const gradient = this.generateGradient(currentValues, index)
      slider.style.setProperty('--slider-gradient', gradient)
    }
  }

  private generateGradient(currentValues: [number, number, number], channelIndex: number): string {
    const config = this.modeConfigs[this.currentMode]
    const channelConfig = config.channels[channelIndex]
    const stops: string[] = []
    const numberOfStops = 10

    for (let index = 0; index <= numberOfStops; index++) {
      const percent = index / numberOfStops
      const value = channelConfig.min + (channelConfig.max - channelConfig.min) * percent

      // Create a copy of current values with this channel varied
      const testValues: [number, number, number] = [...currentValues] as [number, number, number]
      testValues[channelIndex] = value

      try {
        const color = config.getColor(testValues)
        const hex = color.to('srgb').toString({ format: 'hex' })
        stops.push(`${hex} ${percent * 100}%`)
      } catch {
        // Fallback for invalid colors
        stops.push(`#808080 ${percent * 100}%`)
      }
    }

    return `linear-gradient(to right, ${stops.join(', ')})`
  }

  private updateColorDisplay(color: Color) {
    // Update swatch background
    const displayColor = color.toGamut({ method: 'css', deltaEMethod: 'OK' })
    const hex = displayColor.to('srgb').toString({ format: 'hex' })
    this.colorSwatch.style.backgroundColor = hex

    // Update color value text
    const colorString = color.toString({ precision: 3 })
    this.colorValue.textContent = colorString
  }
}

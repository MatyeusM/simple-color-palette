// Type definitions for simple-color-palette
import type Color from 'colorjs.io'

// State types
export type ColorMode = 'rgb' | 'hsl' | 'oklch'
export type OutputSpace = 'srgb' | 'p3' | 'rec2020'
export type ExportFormat = 'json' | 'markdown'

export interface PaletteColor {
  color: Color
  hex: string
  label: string
}

export interface PaletteGenerator {
  id: string
  name: string
  generatePalette: (baseColor: Color, outputSpace: string) => PaletteColor[]
}

export interface AppState {
  baseColor: Color
  colorMode: ColorMode
  outputSpace: OutputSpace
  exportFormat: ExportFormat
  paletteMap: Map<string, PaletteColor[]>
}

export type Subscriber = (state: AppState) => void

// Color Picker types
export interface ChannelConfig {
  label: string
  min: number
  max: number
  step: number
  formatValue: (value: number) => string
}

export interface ColorModeConfig {
  channels: [ChannelConfig, ChannelConfig, ChannelConfig]
  getColor: (values: [number, number, number]) => Color
  getValues: (color: Color) => [number, number, number]
}

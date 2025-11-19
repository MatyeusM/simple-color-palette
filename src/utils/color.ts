import Color from 'colorjs.io'
import type { PaletteColor } from '../types'

/**
 * Convert a color to hex string with gamut mapping for the specified output space
 */
export function colorToHex(color: Color, outputSpace: string): string {
  return color
    .toGamut({ method: 'css', space: outputSpace, deltaEMethod: 'OK' })
    .toString({ format: 'hex' })
}

/**
 * Create a palette color entry with automatic conversion and hex formatting
 */
export function createPaletteColor(color: Color, outputSpace: string, label: string): PaletteColor {
  const outputColor = color.to(outputSpace)

  return { color: outputColor, hex: colorToHex(outputColor, outputSpace), label }
}

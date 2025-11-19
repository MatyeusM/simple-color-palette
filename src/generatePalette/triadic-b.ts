import Color from 'colorjs.io'
import type { PaletteColor } from '../types'
import { lightnessLevels } from '../config'
import { createPaletteColor } from '../utils/color'

export const id = 'triadic-b'
export const name = 'Triadic'

export function generatePalette(baseColor: Color, outputSpace: string): PaletteColor[] {
  const palette: PaletteColor[] = []
  const oklchColor = baseColor.to('oklch')

  // Calculate first triadic hue (+ 240 degrees, wrap around 360)
  const triadicHue = (oklchColor.h + 240) % 360

  for (const lightness of lightnessLevels) {
    const newColor = new Color('oklch', [lightness, oklchColor.c, triadicHue])
    const label = `triadic-b-${(lightness * 1000).toFixed(0)}`
    palette.push(createPaletteColor(newColor, outputSpace, label))
  }

  return palette
}

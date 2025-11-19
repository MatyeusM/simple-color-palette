import Color from 'colorjs.io'
import type { PaletteColor } from '../types'
import { lightnessLevels } from '../config'
import { createPaletteColor } from '../utils/color'

export const id = 'analogous-a'
export const name = 'Analogous'

export function generatePalette(baseColor: Color, outputSpace: string): PaletteColor[] {
  const palette: PaletteColor[] = []
  const oklchColor = baseColor.to('oklch')

  // Calculate first analogous hue (+ 20 degrees, wrap around 360)
  const analogousHue = (oklchColor.h + 20) % 360

  for (const lightness of lightnessLevels) {
    const newColor = new Color('oklch', [lightness, oklchColor.c, analogousHue])
    const label = `analogous-a-${(lightness * 1000).toFixed(0)}`
    palette.push(createPaletteColor(newColor, outputSpace, label))
  }

  return palette
}

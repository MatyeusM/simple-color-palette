import Color from 'colorjs.io'
import type { PaletteColor } from '../types'
import { lightnessLevels } from '../config'
import { createPaletteColor } from '../utils/color'

export const id = 'complementary'
export const name = 'Complementary Color'

export function generatePalette(baseColor: Color, outputSpace: string): PaletteColor[] {
  const palette: PaletteColor[] = []
  const oklchColor = baseColor.to('oklch')

  // Calculate complementary hue (+ 180 degrees, wrap around 360)
  const complementaryHue = (oklchColor.h + 180) % 360

  for (const lightness of lightnessLevels) {
    const newColor = new Color('oklch', [lightness, oklchColor.c, complementaryHue])
    const label = `complementary-${(lightness * 1000).toFixed(0)}`
    palette.push(createPaletteColor(newColor, outputSpace, label))
  }

  return palette
}

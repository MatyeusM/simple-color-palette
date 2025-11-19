import Color from 'colorjs.io'
import type { PaletteColor } from '../types'
import { lightnessLevels } from '../config'
import { createPaletteColor } from '../utils/color'

export const id = 'base'
export const name = 'Base Color'

export function generatePalette(baseColor: Color, outputSpace: string): PaletteColor[] {
  const palette: PaletteColor[] = []
  const oklchColor = baseColor.to('oklch')

  for (const lightness of lightnessLevels) {
    const newColor = new Color('oklch', [lightness, oklchColor.c, oklchColor.h])
    const label = `base-${(lightness * 1000).toFixed(0)}`
    palette.push(createPaletteColor(newColor, outputSpace, label))
  }

  return palette
}

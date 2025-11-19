import type { OutputSpace } from './types'

// Lightness levels for palette generation
export const lightnessLevels = Array.from({ length: 19 }, (_, index) => (index + 1) * 0.05)

// Mapping from OutputSpace to colorjs.io shorthand
export const OUTPUT_SPACE_MAP: Record<OutputSpace, string> = {
  srgb: 'srgb',
  p3: 'p3',
  rec2020: 'rec2020',
}

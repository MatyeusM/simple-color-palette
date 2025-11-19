import Color from 'colorjs.io'
import type {
  ColorMode,
  OutputSpace,
  ExportFormat,
  PaletteColor,
  PaletteGenerator,
  AppState,
  Subscriber,
  ThemePreference,
} from './types'
import { OUTPUT_SPACE_MAP } from './config'

const THEME_STORAGE_KEY = 'colorPaletteThemePreference'

// Dynamically import all palette generators
const generatorModules = import.meta.glob<{
  id: string
  name: string
  generatePalette: (baseColor: Color, outputSpace: string) => PaletteColor[]
}>('./generatePalette/*.ts', { eager: true })

class StateManager {
  private state: AppState
  private subscribers: Set<Subscriber> = new Set()
  private paletteGenerators: PaletteGenerator[] = []
  private paletteGeneratorLookup: Map<string, string> = new Map()

  constructor() {
    // Register palette generators from all modules and build lookup map
    this.paletteGenerators = []
    for (const module of Object.values(generatorModules)) {
      // Type guard: validate module has required properties
      if (
        typeof module === 'object' &&
        module !== null &&
        'id' in module &&
        'name' in module &&
        'generatePalette' in module &&
        typeof module.id === 'string' &&
        typeof module.name === 'string' &&
        typeof module.generatePalette === 'function'
      ) {
        const generator: PaletteGenerator = {
          id: module.id,
          name: module.name,
          generatePalette: module.generatePalette as (
            baseColor: Color,
            outputSpace: string,
          ) => PaletteColor[],
        }
        this.paletteGenerators.push(generator)
        this.paletteGeneratorLookup.set(generator.id, generator.name)
      }
    }

    // Load theme preference from local storage or default to 'system'
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null
    const themePreference: ThemePreference =
      savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
        ? savedTheme
        : 'system'

    this.state = {
      baseColor: new Color('oklch', [0.7, 0.14, 190]),
      colorMode: 'oklch',
      outputSpace: 'srgb',
      exportFormat: 'json',
      paletteMap: new Map(),
      themePreference,
    }
    this.generatePalette()
    this.applyTheme()
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    // Call immediately with current state
    callback(this.state)

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notify() {
    for (const callback of this.subscribers) {
      callback(this.state)
    }
  }

  getState(): AppState {
    return this.state
  }

  setBaseColor(color: Color) {
    this.state.baseColor = color
    this.generatePalette()
    this.notify()
  }

  setColorMode(mode: ColorMode) {
    this.state.colorMode = mode
    this.notify()
  }

  setOutputSpace(space: OutputSpace) {
    this.state.outputSpace = space
    this.generatePalette()
    this.notify()
  }

  setExportFormat(format: ExportFormat) {
    this.state.exportFormat = format
    this.notify()
  }

  setThemePreference(preference: ThemePreference) {
    this.state.themePreference = preference
    localStorage.setItem(THEME_STORAGE_KEY, preference)
    this.applyTheme()
    this.notify()
  }

  getPaletteGeneratorName(id: string): string {
    return this.paletteGeneratorLookup.get(id) || id
  }

  private applyTheme() {
    const { themePreference } = this.state
    document.documentElement.style.colorScheme = themePreference === 'system' ? '' : themePreference
  }

  private generatePalette() {
    const paletteMap = new Map<string, PaletteColor[]>()
    const baseColor = this.state.baseColor
    const outputSpace = OUTPUT_SPACE_MAP[this.state.outputSpace]

    // Generate palettes using all registered generators
    for (const generator of this.paletteGenerators) {
      const palette = generator.generatePalette(baseColor, outputSpace)
      paletteMap.set(generator.id, palette)
    }

    this.state.paletteMap = paletteMap
  }
}

export const state = new StateManager()

import type { OutputSpace } from '../types'
import { state } from '../state'
import { getElement } from '../utils/dom'

export class OutputSpaceSelector {
  private select: HTMLSelectElement

  constructor(selectId: string) {
    this.select = getElement<HTMLSelectElement>(selectId, 'Output space select')
    this.init()
  }

  private init() {
    // Listen to select changes
    this.select.addEventListener('change', event => {
      const target = event.target as HTMLSelectElement
      const outputSpace = target.value as OutputSpace
      state.setOutputSpace(outputSpace)
    })

    // Subscribe to state changes to sync select value
    state.subscribe(appState => {
      if (this.select.value !== appState.outputSpace) {
        this.select.value = appState.outputSpace
      }
    })
  }
}

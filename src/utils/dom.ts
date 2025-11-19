/**
 * Type-safe DOM element retrieval with automatic error handling
 */
export function getElement<T extends HTMLElement>(id: string, elementType: string): T {
  const element = document.querySelector<T>(`#${id}`)

  if (!element) {
    throw new Error(`${elementType} element with id "${id}" not found`)
  }

  return element
}

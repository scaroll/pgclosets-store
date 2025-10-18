/**
 * Advanced Keyboard Navigation System
 * WCAG 2.1 AAA - Full Keyboard Support (2.1.3)
 *
 * Provides roving tabindex, arrow key navigation, and keyboard shortcuts
 */

export interface RovingTabindexOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  loop?: boolean
  homeEndKeys?: boolean
  typeAhead?: boolean
  activateOnFocus?: boolean
}

export interface KeyboardNavigationState {
  currentIndex: number
  focusedElement: HTMLElement | null
}

/**
 * Roving Tabindex Manager
 * Manages focus within a list of items using roving tabindex pattern
 */
export class RovingTabindexManager {
  private items: HTMLElement[] = []
  private currentIndex: number = 0
  private container: HTMLElement
  private options: Required<RovingTabindexOptions>
  private typeAheadString: string = ''
  private typeAheadTimeout: NodeJS.Timeout | null = null
  private cleanupFunctions: (() => void)[] = []

  constructor(
    container: HTMLElement,
    items: HTMLElement[],
    options: RovingTabindexOptions = {}
  ) {
    this.container = container
    this.items = items
    this.options = {
      orientation: options.orientation || 'vertical',
      loop: options.loop !== false,
      homeEndKeys: options.homeEndKeys !== false,
      typeAhead: options.typeAhead !== false,
      activateOnFocus: options.activateOnFocus !== false
    }

    this.initialize()
  }

  private initialize(): void {
    // Set initial tabindex
    this.updateTabindices()

    // Add keyboard event listeners
    const keydownHandler = this.handleKeyDown.bind(this)
    this.container.addEventListener('keydown', keydownHandler)
    this.cleanupFunctions.push(() => {
      this.container.removeEventListener('keydown', keydownHandler)
    })

    // Add focus listeners to each item
    this.items.forEach((item, index) => {
      const focusHandler = () => this.handleFocus(index)
      item.addEventListener('focus', focusHandler)
      this.cleanupFunctions.push(() => {
        item.removeEventListener('focus', focusHandler)
      })

      if (this.options.activateOnFocus) {
        const clickHandler = () => this.activate(index)
        item.addEventListener('click', clickHandler)
        this.cleanupFunctions.push(() => {
          item.removeEventListener('click', clickHandler)
        })
      }
    })
  }

  private updateTabindices(): void {
    this.items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.setAttribute('tabindex', '0')
        item.setAttribute('aria-selected', 'true')
      } else {
        item.setAttribute('tabindex', '-1')
        item.setAttribute('aria-selected', 'false')
      }
    })
  }

  private handleFocus(index: number): void {
    this.currentIndex = index
    this.updateTabindices()
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const { orientation, loop, homeEndKeys, typeAhead } = this.options

    let handled = false
    let newIndex = this.currentIndex

    // Navigation keys
    if (
      (orientation === 'vertical' || orientation === 'both') &&
      (e.key === 'ArrowDown' || e.key === 'Down')
    ) {
      newIndex = this.getNextIndex(1)
      handled = true
    } else if (
      (orientation === 'vertical' || orientation === 'both') &&
      (e.key === 'ArrowUp' || e.key === 'Up')
    ) {
      newIndex = this.getNextIndex(-1)
      handled = true
    } else if (
      (orientation === 'horizontal' || orientation === 'both') &&
      (e.key === 'ArrowRight' || e.key === 'Right')
    ) {
      newIndex = this.getNextIndex(1)
      handled = true
    } else if (
      (orientation === 'horizontal' || orientation === 'both') &&
      (e.key === 'ArrowLeft' || e.key === 'Left')
    ) {
      newIndex = this.getNextIndex(-1)
      handled = true
    }

    // Home/End keys
    if (homeEndKeys) {
      if (e.key === 'Home') {
        newIndex = 0
        handled = true
      } else if (e.key === 'End') {
        newIndex = this.items.length - 1
        handled = true
      }
    }

    // Type-ahead
    if (typeAhead && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.handleTypeAhead(e.key)
      handled = true
    }

    // Enter/Space activation
    if (e.key === 'Enter' || e.key === ' ') {
      this.activate(this.currentIndex)
      handled = true
    }

    if (handled && newIndex !== this.currentIndex) {
      e.preventDefault()
      this.focusItem(newIndex)
    } else if (handled) {
      e.preventDefault()
    }
  }

  private getNextIndex(step: number): number {
    const { loop } = this.options
    let newIndex = this.currentIndex + step

    if (loop) {
      if (newIndex < 0) {
        newIndex = this.items.length - 1
      } else if (newIndex >= this.items.length) {
        newIndex = 0
      }
    } else {
      newIndex = Math.max(0, Math.min(newIndex, this.items.length - 1))
    }

    return newIndex
  }

  private handleTypeAhead(key: string): void {
    // Clear previous timeout
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout)
    }

    // Add to search string
    this.typeAheadString += key.toLowerCase()

    // Find matching item
    const startIndex = this.currentIndex + 1
    const itemsToSearch = [
      ...this.items.slice(startIndex),
      ...this.items.slice(0, startIndex)
    ]

    const matchingItem = itemsToSearch.find((item) => {
      const text = item.textContent?.toLowerCase() || ''
      return text.startsWith(this.typeAheadString)
    })

    if (matchingItem) {
      const index = this.items.indexOf(matchingItem)
      this.focusItem(index)
    }

    // Reset search string after delay
    this.typeAheadTimeout = setTimeout(() => {
      this.typeAheadString = ''
    }, 500)
  }

  private activate(index: number): void {
    const item = this.items[index]
    if (!item) return

    // Trigger click event
    item.click()

    // Dispatch custom activation event
    const event = new CustomEvent('rovingTabindexActivate', {
      detail: { index, item },
      bubbles: true
    })
    this.container.dispatchEvent(event)
  }

  public focusItem(index: number): void {
    const item = this.items[index]
    if (!item) return

    this.currentIndex = index
    this.updateTabindices()
    item.focus()
  }

  public updateItems(items: HTMLElement[]): void {
    // Clean up old listeners
    this.cleanup()

    // Update items
    this.items = items
    this.currentIndex = Math.min(this.currentIndex, items.length - 1)

    // Re-initialize
    this.initialize()
  }

  public getCurrentIndex(): number {
    return this.currentIndex
  }

  public getCurrentItem(): HTMLElement | null {
    return this.items[this.currentIndex] || null
  }

  public cleanup(): void {
    this.cleanupFunctions.forEach((fn) => fn())
    this.cleanupFunctions = []

    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout)
    }
  }
}

/**
 * Grid Navigation Manager
 * Manages keyboard navigation in a 2D grid
 */
export interface GridNavigationOptions {
  columns: number
  loop?: boolean
  homeEndKeys?: boolean
}

export class GridNavigationManager {
  private items: HTMLElement[] = []
  private currentIndex: number = 0
  private container: HTMLElement
  private options: Required<GridNavigationOptions>
  private cleanupFunctions: (() => void)[] = []

  constructor(
    container: HTMLElement,
    items: HTMLElement[],
    options: GridNavigationOptions
  ) {
    this.container = container
    this.items = items
    this.options = {
      columns: options.columns,
      loop: options.loop !== false,
      homeEndKeys: options.homeEndKeys !== false
    }

    this.initialize()
  }

  private initialize(): void {
    this.updateTabindices()

    const keydownHandler = this.handleKeyDown.bind(this)
    this.container.addEventListener('keydown', keydownHandler)
    this.cleanupFunctions.push(() => {
      this.container.removeEventListener('keydown', keydownHandler)
    })
  }

  private updateTabindices(): void {
    this.items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.setAttribute('tabindex', '0')
      } else {
        item.setAttribute('tabindex', '-1')
      }
    })
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const { columns, loop, homeEndKeys } = this.options
    const rows = Math.ceil(this.items.length / columns)
    const currentRow = Math.floor(this.currentIndex / columns)
    const currentCol = this.currentIndex % columns

    let newIndex = this.currentIndex
    let handled = false

    switch (e.key) {
      case 'ArrowRight':
      case 'Right':
        newIndex = this.getNextColumnIndex(1)
        handled = true
        break

      case 'ArrowLeft':
      case 'Left':
        newIndex = this.getNextColumnIndex(-1)
        handled = true
        break

      case 'ArrowDown':
      case 'Down':
        newIndex = this.getNextRowIndex(1)
        handled = true
        break

      case 'ArrowUp':
      case 'Up':
        newIndex = this.getNextRowIndex(-1)
        handled = true
        break

      case 'Home':
        if (homeEndKeys) {
          if (e.ctrlKey) {
            // Go to first item
            newIndex = 0
          } else {
            // Go to first item in row
            newIndex = currentRow * columns
          }
          handled = true
        }
        break

      case 'End':
        if (homeEndKeys) {
          if (e.ctrlKey) {
            // Go to last item
            newIndex = this.items.length - 1
          } else {
            // Go to last item in row
            newIndex = Math.min((currentRow + 1) * columns - 1, this.items.length - 1)
          }
          handled = true
        }
        break

      case 'PageUp':
        newIndex = Math.max(0, this.currentIndex - columns * 5)
        handled = true
        break

      case 'PageDown':
        newIndex = Math.min(this.items.length - 1, this.currentIndex + columns * 5)
        handled = true
        break
    }

    if (handled && newIndex !== this.currentIndex) {
      e.preventDefault()
      this.focusItem(newIndex)
    } else if (handled) {
      e.preventDefault()
    }
  }

  private getNextColumnIndex(step: number): number {
    const { columns, loop } = this.options
    const currentRow = Math.floor(this.currentIndex / columns)
    const currentCol = this.currentIndex % columns
    let newCol = currentCol + step

    if (loop) {
      const rowLength = Math.min(columns, this.items.length - currentRow * columns)
      newCol = ((newCol % rowLength) + rowLength) % rowLength
    } else {
      const maxCol = Math.min(columns - 1, this.items.length - currentRow * columns - 1)
      newCol = Math.max(0, Math.min(newCol, maxCol))
    }

    return currentRow * columns + newCol
  }

  private getNextRowIndex(step: number): number {
    const { columns, loop } = this.options
    const rows = Math.ceil(this.items.length / columns)
    const currentRow = Math.floor(this.currentIndex / columns)
    const currentCol = this.currentIndex % columns
    let newRow = currentRow + step

    if (loop) {
      newRow = ((newRow % rows) + rows) % rows
    } else {
      newRow = Math.max(0, Math.min(newRow, rows - 1))
    }

    // Calculate new index, clamping to valid range
    const newIndex = newRow * columns + currentCol
    return Math.min(newIndex, this.items.length - 1)
  }

  public focusItem(index: number): void {
    const item = this.items[index]
    if (!item) return

    this.currentIndex = index
    this.updateTabindices()
    item.focus()
  }

  public cleanup(): void {
    this.cleanupFunctions.forEach((fn) => fn())
    this.cleanupFunctions = []
  }
}

/**
 * Menu Navigation Manager
 * Manages keyboard navigation for dropdown menus and menu bars
 */
export interface MenuNavigationOptions {
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  typeAhead?: boolean
}

export class MenuNavigationManager {
  private items: HTMLElement[] = []
  private currentIndex: number = -1
  private container: HTMLElement
  private options: Required<MenuNavigationOptions>
  private isOpen: boolean = false
  private cleanupFunctions: (() => void)[] = []

  constructor(
    container: HTMLElement,
    items: HTMLElement[],
    options: MenuNavigationOptions = {}
  ) {
    this.container = container
    this.items = items
    this.options = {
      orientation: options.orientation || 'vertical',
      loop: options.loop !== false,
      typeAhead: options.typeAhead !== false
    }

    this.initialize()
  }

  private initialize(): void {
    const keydownHandler = this.handleKeyDown.bind(this)
    this.container.addEventListener('keydown', keydownHandler)
    this.cleanupFunctions.push(() => {
      this.container.removeEventListener('keydown', keydownHandler)
    })
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isOpen) return

    const { orientation } = this.options
    let handled = false

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'

    if (e.key === nextKey || e.key === 'Down' || e.key === 'Right') {
      this.focusNextItem()
      handled = true
    } else if (e.key === prevKey || e.key === 'Up' || e.key === 'Left') {
      this.focusPreviousItem()
      handled = true
    } else if (e.key === 'Home') {
      this.focusItem(0)
      handled = true
    } else if (e.key === 'End') {
      this.focusItem(this.items.length - 1)
      handled = true
    } else if (e.key === 'Escape') {
      this.close()
      handled = true
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (this.currentIndex >= 0) {
        this.activateItem(this.currentIndex)
      }
      handled = true
    }

    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  private focusNextItem(): void {
    const { loop } = this.options
    let newIndex = this.currentIndex + 1

    if (newIndex >= this.items.length) {
      newIndex = loop ? 0 : this.items.length - 1
    }

    this.focusItem(newIndex)
  }

  private focusPreviousItem(): void {
    const { loop } = this.options
    let newIndex = this.currentIndex - 1

    if (newIndex < 0) {
      newIndex = loop ? this.items.length - 1 : 0
    }

    this.focusItem(newIndex)
  }

  private focusItem(index: number): void {
    const item = this.items[index]
    if (!item) return

    this.currentIndex = index
    item.focus()
  }

  private activateItem(index: number): void {
    const item = this.items[index]
    if (!item) return

    item.click()
    this.close()
  }

  public open(): void {
    this.isOpen = true
    if (this.items.length > 0) {
      this.focusItem(0)
    }
  }

  public close(): void {
    this.isOpen = false
    this.currentIndex = -1
  }

  public cleanup(): void {
    this.cleanupFunctions.forEach((fn) => fn())
    this.cleanupFunctions = []
  }
}

export default {
  RovingTabindexManager,
  GridNavigationManager,
  MenuNavigationManager
}

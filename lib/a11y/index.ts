/**
 * PG Closets Accessibility Utilities Library
 * WCAG 2.1 Level AAA Utilities
 *
 * @module lib/a11y
 * @description Comprehensive accessibility utility functions and classes
 */

// Keyboard Navigation
export {
  RovingTabindexManager,
  GridNavigationManager,
  MenuNavigationManager
} from './keyboard-nav'

export type {
  RovingTabindexOptions,
  KeyboardNavigationState,
  GridNavigationOptions,
  MenuNavigationOptions
} from './keyboard-nav'

// Main Accessibility Utils (re-export from existing file)
export * from '../accessibility/a11y-utils'

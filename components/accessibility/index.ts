/**
 * Accessibility Components Index
 *
 * Comprehensive WCAG 2.1 AAA accessibility components:
 * - AccessibilityProvider: Global accessibility state management
 * - FocusManager: Advanced focus management and trapping
 * - AccessibleButton: WCAG compliant button component
 * - AccessibleForm: Accessible form with validation
 * - AccessibilityTesting: Automated testing tools
 * - AccessibilityControls: User preference controls
 */

export { AccessibilityProvider, useAccessibility, useScreenReaderAnnouncements, useKeyboardNavigation } from './AccessibilityProvider'
export { default as FocusManager, useFocusManagement } from './FocusManager'
export { default as AccessibleButton } from './AccessibleButton'
export { default as AccessibleForm } from './AccessibleForm'
export { default as AccessibilityTesting } from './AccessibilityTesting'
export { default as AccessibilityControls } from './AccessibilityControls'

// Re-export types
export type { AccessibilitySettings, AccessibilityContextType } from './AccessibilityProvider'
export type { FocusManagerProps, FocusTrapOptions } from './FocusManager'
export type { AccessibleButtonProps } from './AccessibleButton'
export type { FormField, AccessibleFormProps } from './AccessibleForm'
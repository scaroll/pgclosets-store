/**
 * Advanced Focus Management Component
 *
 * Provides comprehensive focus management for WCAG 2.1 AAA compliance:
 * - Focus trapping within modals and dropdowns
 * - Focus restoration after modal closure
 * - Skip links functionality
 * - Focus visible indicators
 * - Keyboard navigation enhancement
 */

"use client"

import { useEffect, useRef, useCallback } from 'react'
import { useAccessibility } from './AccessibilityProvider'

interface FocusManagerProps {
  children: React.ReactNode
  trapFocus?: boolean
  restoreFocus?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  finalFocusRef?: React.RefObject<HTMLElement>
}

interface FocusTrapOptions {
  container: HTMLElement
  initialFocus?: HTMLElement
  restoreFocus?: HTMLElement
  onActivate?: () => void
  onDeactivate?: () => void
}

export function FocusManager({
  children,
  trapFocus = false,
  restoreFocus = true,
  initialFocusRef,
  finalFocusRef
}: FocusManagerProps) {
  const { announceToScreenReader } = useAccessibility()
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const focusTrapRef = useRef<{
    activate: () => void
    deactivate: () => void
  } | null>(null)

  // Get all focusable elements within a container
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'summary',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'embed',
      'object',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])',
      '[role="menuitem"]',
      '[role="option"]',
      '[role="tab"]',
      '[role="treeitem"]'
    ].join(', ')

    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[]

    // Filter out elements that are not actually focusable
    return elements.filter(element => {
      // Check if element is visible
      if (!isVisible(element)) return false

      // Check if element is not disabled
      if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
        return false
      }

      // Check if element is not hidden
      if (element.getAttribute('aria-hidden') === 'true') return false

      return true
    })
  }, [])

  // Check if element is visible
  const isVisible = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()

    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      rect.width > 0 &&
      rect.height > 0
    )
  }

  // Create focus trap
  const createFocusTrap = useCallback((options: FocusTrapOptions) => {
    const { container, initialFocus, restoreFocus, onActivate, onDeactivate } = options
    let isActive = false

    const getFirstFocusable = () => {
      const elements = getFocusableElements(container)
      return elements[0] || null
    }

    const getLastFocusable = () => {
      const elements = getFocusableElements(container)
      return elements[elements.length - 1] || null
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || e.key !== 'Tab') return

      const focusableElements = getFocusableElements(container)
      if (focusableElements.length === 0) return

      const firstElement = getFirstFocusable()
      const lastElement = getLastFocusable()

      if (e.shiftKey) {
        // Shift + Tab (going backwards)
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
          announceToScreenReader('Moved to last focusable element')
        }
      } else {
        // Tab (going forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
          announceToScreenReader('Moved to first focusable element')
        }
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (!isActive || e.key !== 'Escape') return

      // Find the closest modal or dialog
      const modal = container.closest('[role="dialog"], [role="menu"], [role="listbox"]')
      if (modal) {
        const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"], [aria-label*="dismiss"]') as HTMLElement
        if (closeButton) {
          closeButton.click()
        }
      }
    }

    return {
      activate: () => {
        if (isActive) return

        isActive = true
        previousActiveElement.current = document.activeElement as HTMLElement

        // Add event listeners
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keydown', handleEscape)

        // Focus initial element
        const elementToFocus = initialFocus || getFirstFocusable()
        if (elementToFocus) {
          setTimeout(() => {
            elementToFocus.focus()
            announceToScreenReader('Focus trapped in modal')
          }, 100)
        }

        onActivate?.()
      },

      deactivate: () => {
        if (!isActive) return

        isActive = false

        // Remove event listeners
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keydown', handleEscape)

        // Restore focus
        if (restoreFocus && previousActiveElement.current) {
          setTimeout(() => {
            previousActiveElement.current?.focus()
            announceToScreenReader('Focus restored to previous element')
          }, 100)
        }

        onDeactivate?.()
      }
    }
  }, [getFocusableElements, announceToScreenReader])

  // Initialize focus trap when component mounts
  useEffect(() => {
    if (!containerRef.current || !trapFocus) return

    const focusTrap = createFocusTrap({
      container: containerRef.current,
      initialFocus: initialFocusRef?.current || undefined,
      restoreFocus: finalFocusRef?.current || previousActiveElement.current || undefined,
      onActivate: () => {
        announceToScreenReader('Modal opened')
      },
      onDeactivate: () => {
        announceToScreenReader('Modal closed')
      }
    })

    focusTrapRef.current = focusTrap
    focusTrap.activate()

    return () => {
      focusTrap.deactivate()
    }
  }, [trapFocus, createFocusTrap, initialFocusRef, finalFocusRef, announceToScreenReader])

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyboardNavigation = (e: KeyboardEvent) => {
      // Alt + S: Skip to main content
      if (e.altKey && e.key === 's') {
        e.preventDefault()
        const mainContent = document.getElementById('main-content') || document.querySelector('main')
        if (mainContent) {
          mainContent.focus()
          mainContent.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Skipped to main content')
        }
      }

      // Alt + N: Skip to navigation
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        const navigation = document.getElementById('navigation') || document.querySelector('nav')
        if (navigation) {
          navigation.focus()
          navigation.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Skipped to navigation')
        }
      }

      // Alt + F: Skip to search
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Skipped to search')
        }
      }

      // Alt + H: Skip to header/top
      if (e.altKey && e.key === 'h') {
        e.preventDefault()
        const header = document.querySelector('header')
        if (header) {
          header.focus()
          header.scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader('Skipped to header')
        }
      }

      // Alt + 1-9: Jump to headings
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const headingLevel = parseInt(e.key)
        const headings = Array.from(document.querySelectorAll(`h${headingLevel}`)) as HTMLElement[]
        const currentFocus = document.activeElement as HTMLElement
        const currentIndex = headings.findIndex(h => h === currentFocus)
        const nextIndex = (currentIndex + 1) % headings.length

        if (headings[nextIndex]) {
          headings[nextIndex].focus()
          headings[nextIndex].scrollIntoView({ behavior: 'smooth' })
          announceToScreenReader(`Heading level ${headingLevel}: ${headings[nextIndex].textContent}`)
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardNavigation)
    return () => document.removeEventListener('keydown', handleKeyboardNavigation)
  }, [announceToScreenReader])

  return (
    <div ref={containerRef} className="focus-manager">
      {children}
    </div>
  )
}

// Hook for managing focus in custom components
export function useFocusManagement() {
  const { announceToScreenReader } = useAccessibility()
  const focusHistoryRef = useRef<HTMLElement[]>([])

  const recordFocus = useCallback((element: HTMLElement) => {
    focusHistoryRef.current.push(element)
    // Keep only last 10 elements
    if (focusHistoryRef.current.length > 10) {
      focusHistoryRef.current.shift()
    }
  }, [])

  const restorePreviousFocus = useCallback(() => {
    if (focusHistoryRef.current.length > 1) {
      focusHistoryRef.current.pop() // Remove current element
      const previousElement = focusHistoryRef.current[focusHistoryRef.current.length - 1]
      if (previousElement) {
        previousElement.focus()
        announceToScreenReader('Focus restored to previous element')
        return true
      }
    }
    return false
  }, [announceToScreenReader])

  const moveToNextFocusable = useCallback((container?: HTMLElement) => {
    const scope = container || document.body
    const focusableElements = Array.from(scope.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[]

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement)
    const nextIndex = (currentIndex + 1) % focusableElements.length

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus()
      announceToScreenReader('Moved to next focusable element')
      return focusableElements[nextIndex]
    }
    return null
  }, [announceToScreenReader])

  const moveToPreviousFocusable = useCallback((container?: HTMLElement) => {
    const scope = container || document.body
    const focusableElements = Array.from(scope.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[]

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement)
    const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1

    if (focusableElements[prevIndex]) {
      focusableElements[prevIndex].focus()
      announceToScreenReader('Moved to previous focusable element')
      return focusableElements[prevIndex]
    }
    return null
  }, [announceToScreenReader])

  return {
    recordFocus,
    restorePreviousFocus,
    moveToNextFocusable,
    moveToPreviousFocusable,
    focusHistory: focusHistoryRef.current
  }
}

export default FocusManager
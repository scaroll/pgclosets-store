'use client'

import { useEffect } from 'react'

/**
 * Enhanced Keyboard Navigation Manager
 * Handles advanced keyboard shortcuts and navigation patterns
 * WCAG 2.1 Level AA Compliant
 */
export function KeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content (Alt + M)
      if (e.altKey && e.key === 'm') {
        e.preventDefault()
        const mainContent = document.getElementById('main-content')
        mainContent?.focus()
      }

      // Skip to navigation (Alt + N)
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        const navigation = document.querySelector('[role="navigation"]') as HTMLElement
        navigation?.focus()
      }

      // Escape key - close modals, dropdowns, etc.
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]')
        const activeDropdown = document.querySelector('[aria-expanded="true"]')

        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="Close"]') as HTMLButtonElement
          closeButton?.click()
        } else if (activeDropdown) {
          ;(activeDropdown as HTMLButtonElement).click()
        }
      }

      // Tab trapping for modals
      if (e.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (modal) {
          trapFocus(modal as HTMLElement, e)
        }
      }

      // Arrow key navigation for menus
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const activeMenu = document.querySelector('[role="menu"]:focus-within')
        if (activeMenu) {
          handleMenuNavigation(activeMenu as HTMLElement, e)
        }
      }
    }

    // Focus trap helper
    const trapFocus = (container: HTMLElement, event: KeyboardEvent) => {
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    // Menu navigation helper
    const handleMenuNavigation = (menu: HTMLElement, event: KeyboardEvent) => {
      const menuItems = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]')
      )

      if (menuItems.length === 0) return

      const currentIndex = menuItems.findIndex((item) => item === document.activeElement)
      let nextIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          nextIndex = (currentIndex + 1) % menuItems.length
          break
        case 'ArrowUp':
          event.preventDefault()
          nextIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1
          break
        case 'Home':
          event.preventDefault()
          nextIndex = 0
          break
        case 'End':
          event.preventDefault()
          nextIndex = menuItems.length - 1
          break
      }

      if (nextIndex !== currentIndex) {
        menuItems[nextIndex]?.focus()
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}

export default KeyboardNavigation

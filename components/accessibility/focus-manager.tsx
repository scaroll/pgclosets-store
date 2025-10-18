"use client"

import { useEffect } from "react"

export function FocusManager() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key handling for modals and dropdowns
      if (e.key === "Escape") {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement?.closest('[role="dialog"]') || activeElement?.closest(".dropdown-menu")) {
          activeElement.blur()
        }
      }

      // Tab trapping for modals
      if (e.key === "Tab") {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.matches("button, a, input, select, textarea, [tabindex]")) {
        target.style.outline = "2px solid #9FC5E8"
        target.style.outlineOffset = "2px"
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      target.style.outline = ""
      target.style.outlineOffset = ""
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("focusout", handleFocusOut)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("focusout", handleFocusOut)
    }
  }, [])

  return null
}

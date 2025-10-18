'use client'

import type { ReactNode} from 'react';
import React, { useEffect, useRef } from 'react'
import { createFocusTrap, getFocusableElements } from '@/lib/accessibility/a11y-utils'

/**
 * Focus Trap Component
 * WCAG 2.1 AAA - Keyboard Focus Management for Modals/Dialogs
 *
 * Traps keyboard focus within a container for modal dialogs and popups
 */

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  initialFocus?: string
  returnFocus?: boolean
  allowEscape?: boolean
  onEscape?: () => void
  className?: string
}

export function FocusTrap({
  children,
  active = true,
  initialFocus,
  returnFocus = true,
  allowEscape = true,
  onEscape,
  className
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!active || !containerRef.current) {
      return
    }

    const container = containerRef.current

    // Get initial focus element if specified
    let initialElement: HTMLElement | undefined
    if (initialFocus) {
      const element = container.querySelector(initialFocus)
      if (element instanceof HTMLElement) {
        initialElement = element
      }
    }

    // Create focus trap with properly typed options
    const options: {
      initialFocus?: HTMLElement
      returnFocus: boolean
      allowEscape: boolean
      onEscape?: () => void
    } = {
      returnFocus,
      allowEscape
    }

    if (initialElement) {
      options.initialFocus = initialElement
    }

    if (onEscape) {
      options.onEscape = onEscape
    }

    cleanupRef.current = createFocusTrap(container, options)

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [active, initialFocus, returnFocus, allowEscape, onEscape])

  return (
    <div
      ref={containerRef}
      className={className}
      data-focus-trap={active ? 'active' : 'inactive'}
    >
      {children}
    </div>
  )
}

/**
 * Focus Guard Component
 * Prevents focus from escaping a container
 */
interface FocusGuardProps {
  children: ReactNode
  className?: string
}

export function FocusGuard({ children, className }: FocusGuardProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleFocusOut = (e: FocusEvent) => {
      const focusableElements = getFocusableElements(container)
      const relatedTarget = e.relatedTarget as HTMLElement

      // If focus is leaving the container and going somewhere outside
      if (
        relatedTarget &&
        !container.contains(relatedTarget) &&
        focusableElements.length > 0
      ) {
        // Return focus to the first focusable element
        e.preventDefault()
        const firstElement = focusableElements[0]
        if (firstElement) {
          firstElement.focus()
        }
      }
    }

    container.addEventListener('focusout', handleFocusOut as EventListener)

    return () => {
      container.removeEventListener('focusout', handleFocusOut as EventListener)
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

/**
 * Auto Focus Component
 * Automatically focuses an element when mounted
 */
interface AutoFocusProps {
  children: ReactNode
  selector?: string
  delay?: number
  preventScroll?: boolean
}

export function AutoFocus({
  children,
  selector,
  delay = 0,
  preventScroll = false
}: AutoFocusProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const focusElement = () => {
      let element: HTMLElement | null = null

      if (selector) {
        element = container.querySelector(selector)
      } else {
        const focusableElements = getFocusableElements(container)
        element = focusableElements[0] || null
      }

      if (element instanceof HTMLElement) {
        element.focus({ preventScroll })
      }
    }

    if (delay > 0) {
      const timeoutId = setTimeout(focusElement, delay)
      return () => clearTimeout(timeoutId)
    } else {
      focusElement()
      return undefined
    }
  }, [selector, delay, preventScroll])

  return <div ref={containerRef}>{children}</div>
}

export default FocusTrap

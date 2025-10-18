'use client'

import React from 'react'

/**
 * Enhanced Skip Navigation Component
 * Provides keyboard users the ability to skip directly to main content
 * WCAG 2.1 Level AA Compliant
 */
export function EnhancedSkipNav() {
  const skipLinks = [
    { id: 'main-content', label: 'Skip to main content', shortcut: 'Alt+M' },
    { id: 'navigation', label: 'Skip to navigation', shortcut: 'Alt+N' },
    { id: 'footer', label: 'Skip to footer', shortcut: 'Alt+F' },
  ]

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.getElementById(targetId)

    if (target) {
      // Set tabindex to make element focusable
      const originalTabIndex = target.getAttribute('tabindex')
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }

      // Focus and scroll into view
      target.focus({ preventScroll: false })
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // Restore original tabindex
      if (originalTabIndex === null) {
        setTimeout(() => {
          target.removeAttribute('tabindex')
        }, 100)
      }

      // Announce to screen readers
      announceToScreenReader(`Navigated to ${targetId.replace('-', ' ')}`)
    }
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return (
    <div className="skip-nav-container">
      {skipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => handleSkip(e, link.id)}
          className="skip-link"
          aria-label={`${link.label} (${link.shortcut})`}
          title={link.shortcut}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default EnhancedSkipNav

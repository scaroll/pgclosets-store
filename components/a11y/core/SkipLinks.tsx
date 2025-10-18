'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skip Links Component
 * WCAG 2.1 AAA - Bypass Blocks (2.4.1)
 *
 * Provides keyboard users with quick navigation to main content areas
 */

interface SkipLink {
  href: string
  label: string
  description?: string
}

interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

const defaultLinks: SkipLink[] = [
  {
    href: '#main',
    label: 'Skip to main content',
    description: 'Jump directly to the main content area'
  },
  {
    href: '#navigation',
    label: 'Skip to navigation',
    description: 'Jump to the main navigation menu'
  },
  {
    href: '#footer',
    label: 'Skip to footer',
    description: 'Jump to the footer section'
  }
]

export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)

    if (target instanceof HTMLElement) {
      // Set tabindex temporarily to make non-focusable elements focusable
      const originalTabIndex = target.getAttribute('tabindex')
      if (!originalTabIndex) {
        target.setAttribute('tabindex', '-1')
      }

      // Focus the target
      target.focus({ preventScroll: false })

      // Scroll into view with smooth behavior
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      // Restore original tabindex after a short delay
      if (!originalTabIndex) {
        setTimeout(() => {
          target.removeAttribute('tabindex')
        }, 100)
      }
    }
  }

  return (
    <nav
      aria-label="Skip navigation links"
      className={cn('skip-links-container', className)}
    >
      <ul className="list-none p-0 m-0">
        {links.map((link, index) => (
          <li key={index} className="inline">
            <a
              href={link.href}
              onClick={(e) => handleSkip(e, link.href)}
              className={cn(
                'skip-link',
                'absolute left-4 top-4',
                'bg-primary text-primary-foreground',
                'px-4 py-3 rounded-md',
                'font-medium text-sm',
                'z-[9999]',
                'transform -translate-y-[200%]',
                'transition-transform duration-200 ease-in-out',
                'focus:translate-y-0',
                'focus:outline-none focus:ring-4 focus:ring-ring',
                'hover:bg-primary/90',
                'shadow-lg'
              )}
              aria-label={link.description || link.label}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .skip-links-container {
          position: relative;
          z-index: 9999;
        }

        .skip-link:not(:focus):not(:active) {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `}</style>
    </nav>
  )
}

export default SkipLinks

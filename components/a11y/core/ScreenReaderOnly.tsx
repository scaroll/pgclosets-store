'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Screen Reader Only Component
 * WCAG 2.1 AAA - Visually hidden but accessible to screen readers
 *
 * Hides content visually while keeping it available to assistive technology
 */

interface ScreenReaderOnlyProps {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
  focusable?: boolean
}

export function ScreenReaderOnly({
  children,
  as: Component = 'span',
  className,
  focusable = false
}: ScreenReaderOnlyProps) {
  return (
    <Component
      className={cn(
        'sr-only',
        {
          'sr-only-focusable': focusable
        },
        className
      )}
    >
      {children}

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .sr-only-focusable:focus,
        .sr-only-focusable:active {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </Component>
  )
}

/**
 * Visually Hidden Heading
 * Provides semantic structure for screen readers without visual heading
 */
interface VisuallyHiddenHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
}

export function VisuallyHiddenHeading({
  level,
  children,
  className
}: VisuallyHiddenHeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <ScreenReaderOnly as={Component} className={className}>
      {children}
    </ScreenReaderOnly>
  )
}

export default ScreenReaderOnly

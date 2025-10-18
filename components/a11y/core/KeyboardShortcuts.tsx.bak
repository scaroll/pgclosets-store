'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider'

/**
 * Keyboard Shortcuts Component
 * WCAG 2.1 AAA - Customizable Keyboard Navigation
 *
 * Provides global keyboard shortcuts and displays help menu
 */

export interface KeyboardShortcut {
  key: string
  modifiers?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
  }
  description: string
  action: () => void
  category?: string
  preventDefault?: boolean
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
  showHelp?: boolean
}

export function KeyboardShortcuts({
  shortcuts,
  enabled = true,
  showHelp = true
}: KeyboardShortcutsProps) {
  const [helpVisible, setHelpVisible] = useState(false)
  const { settings } = useAccessibility()

  const matchesShortcut = useCallback(
    (e: KeyboardEvent, shortcut: KeyboardShortcut) => {
      const keyMatch =
        e.key.toLowerCase() === shortcut.key.toLowerCase() ||
        e.code === shortcut.key

      const modifiersMatch =
        (!shortcut.modifiers?.ctrl || e.ctrlKey) &&
        (!shortcut.modifiers?.shift || e.shiftKey) &&
        (!shortcut.modifiers?.alt || e.altKey) &&
        (!shortcut.modifiers?.meta || e.metaKey) &&
        (shortcut.modifiers?.ctrl !== false || !e.ctrlKey) &&
        (shortcut.modifiers?.shift !== false || !e.shiftKey) &&
        (shortcut.modifiers?.alt !== false || !e.altKey) &&
        (shortcut.modifiers?.meta !== false || !e.metaKey)

      return keyMatch && modifiersMatch
    },
    []
  )

  useEffect(() => {
    if (!enabled || !settings.keyboardNavigation) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help with Ctrl+/ or Cmd+/ or ?
      if (
        ((e.ctrlKey || e.metaKey) && e.key === '/') ||
        (e.shiftKey && e.key === '?')
      ) {
        e.preventDefault()
        setHelpVisible((prev) => !prev)
        return
      }

      // Check for matching shortcuts
      for (const shortcut of shortcuts) {
        if (matchesShortcut(e, shortcut)) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault()
          }
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, shortcuts, matchesShortcut, settings.keyboardNavigation])

  if (!showHelp || !helpVisible) {
    return null
  }

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onClick={() => setHelpVisible(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div
        className="bg-background rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2
            id="keyboard-shortcuts-title"
            className="text-2xl font-bold text-foreground"
          >
            Keyboard Shortcuts
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Press <kbd className="kbd">?</kbd> or{' '}
            <kbd className="kbd">Ctrl+/</kbd> to toggle this help menu
          </p>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {category}
              </h3>
              <dl className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50"
                  >
                    <dt className="text-sm text-foreground">
                      {shortcut.description}
                    </dt>
                    <dd>
                      <ShortcutDisplay shortcut={shortcut} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-muted/30">
          <button
            onClick={() => setHelpVisible(false)}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring"
          >
            Close (ESC)
          </button>
        </div>
      </div>

      <style jsx>{`
        .kbd {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-family: ui-monospace, monospace;
          font-weight: 600;
          line-height: 1;
          color: var(--foreground);
          background-color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 0.25rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  )
}

/**
 * Shortcut Display Component
 * Renders keyboard shortcut combination
 */
function ShortcutDisplay({ shortcut }: { shortcut: KeyboardShortcut }) {
  const keys: string[] = []

  if (shortcut.modifiers?.ctrl) keys.push('Ctrl')
  if (shortcut.modifiers?.shift) keys.push('Shift')
  if (shortcut.modifiers?.alt) keys.push('Alt')
  if (shortcut.modifiers?.meta) keys.push('Cmd')
  keys.push(shortcut.key.toUpperCase())

  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="kbd">{key}</kbd>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

/**
 * Hook for using keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMatch =
        e.key.toLowerCase() === shortcut.key.toLowerCase() ||
        e.code === shortcut.key

      const modifiersMatch =
        (!shortcut.modifiers?.ctrl || e.ctrlKey) &&
        (!shortcut.modifiers?.shift || e.shiftKey) &&
        (!shortcut.modifiers?.alt || e.altKey) &&
        (!shortcut.modifiers?.meta || e.metaKey)

      if (keyMatch && modifiersMatch) {
        if (shortcut.preventDefault !== false) {
          e.preventDefault()
        }
        shortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, shortcut])
}

export default KeyboardShortcuts

/**
 * Accessibility Controls Component
 *
 * Provides user controls for accessibility preferences:
 * - Text size adjustment
 * - High contrast mode toggle
 * - Reduced motion toggle
 * - Focus indicators toggle
 * - Screen reader optimizations
 * - Color blindness filters
 * - Keyboard navigation enhancements
 */

"use client"

import React, { useState } from 'react'
import { Settings, Eye, EyeOff, Monitor, Type, Zap, Contrast, Palette } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'
import { cn } from '@/lib/utils'

export function AccessibilityControls() {
  const { settings, updateSetting, resetSettings } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSetting = (key: keyof typeof settings) => {
    updateSetting(key, !settings[key])
  }

  const increaseFontSize = () => {
    if (settings.fontSize < 24) {
      updateSetting('fontSize', settings.fontSize + 2)
    }
  }

  const decreaseFontSize = () => {
    if (settings.fontSize > 12) {
      updateSetting('fontSize', settings.fontSize - 2)
    }
  }

  const setColorBlindnessMode = (mode: typeof settings.colorBlindnessMode) => {
    updateSetting('colorBlindnessMode', mode)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-20 right-4 z-40 p-3 rounded-full shadow-lg',
          'bg-white text-gray-700 border border-gray-200',
          'hover:bg-gray-50 hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200',
          'min-h-[48px] min-w-[48px]'
        )}
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed top-20 right-4 z-40 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-modal="true"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="accessibility-title" className="text-lg font-semibold text-gray-900">
                Accessibility Options
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close accessibility options"
              >
                <EyeOff className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Text Size */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-5 h-5 text-gray-600" />
                <label className="font-medium text-gray-900">Text Size</label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Decrease text size"
                >
                  A-
                </button>
                <span className="px-3 py-1 text-sm bg-gray-50 rounded min-w-[60px] text-center">
                  {settings.fontSize}px
                </span>
                <button
                  onClick={increaseFontSize}
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="w-5 h-5 text-gray-600" />
                  <label className="font-medium text-gray-900">High Contrast</label>
                </div>
                <button
                  onClick={() => toggleSetting('highContrast')}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  role="switch"
                  aria-checked={settings.highContrast}
                  aria-label="Toggle high contrast mode"
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Reduced Zap */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <label className="font-medium text-gray-900">Reduced Zap</label>
                </div>
                <button
                  onClick={() => toggleSetting('reducedZap')}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    settings.reducedZap ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  role="switch"
                  aria-checked={settings.reducedZap}
                  aria-label="Toggle reduced motion"
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.reducedZap ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Focus Visible */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <label className="font-medium text-gray-900">Focus Indicators</label>
                </div>
                <button
                  onClick={() => toggleSetting('focusVisible')}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    settings.focusVisible ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  role="switch"
                  aria-checked={settings.focusVisible}
                  aria-label="Toggle focus indicators"
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.focusVisible ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Color Blindness Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-5 h-5 text-gray-600" />
                <label className="font-medium text-gray-900">Color Vision</label>
              </div>
              <select
                value={settings.colorBlindnessMode}
                onChange={(e) => setColorBlindnessMode(e.target.value as typeof settings.colorBlindnessMode)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select color vision mode"
              >
                <option value="none">Normal</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              </select>
            </div>

            {/* Large Text */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-600" />
                  <label className="font-medium text-gray-900">Large Text Mode</label>
                </div>
                <button
                  onClick={() => toggleSetting('largeText')}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    settings.largeText ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  role="switch"
                  aria-checked={settings.largeText}
                  aria-label="Toggle large text mode"
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.largeText ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Reset all accessibility settings to default"
              >
                Reset to Default
              </button>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Keyboard Shortcuts</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li><kbd>Alt</kbd> + <kbd>S</kbd> - Skip to main content</li>
                <li><kbd>Alt</kbd> + <kbd>N</kbd> - Skip to navigation</li>
                <li><kbd>Alt</kbd> + <kbd>F</kbd> - Skip to search</li>
                <li><kbd>Tab</kbd> - Navigate through elements</li>
                <li><kbd>Shift</kbd> + <kbd>Tab</kbd> - Navigate backwards</li>
                <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate buttons/links</li>
                <li><kbd>Escape</kbd> - Close modals/menus</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default AccessibilityControls
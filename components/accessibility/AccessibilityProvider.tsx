'use client'

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReaderEnabled: boolean
  keyboardNavigation: boolean
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  fontSize: number
  focusVisible: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void
  resetSettings: () => void
  announceToScreenReader: (message: string) => void
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReaderEnabled: false,
  keyboardNavigation: false,
  colorBlindnessMode: 'none',
  fontSize: 16,
  focusVisible: true,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error)
      }
    }

    // Detect system preferences
    detectSystemPreferences()
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))

    // Apply settings to DOM
    applyAccessibilitySettings(settings)
  }, [settings, isClient])

  const detectSystemPreferences = () => {
    if (typeof window === 'undefined') return

    const updates: Partial<AccessibilitySettings> = {}

    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updates.reducedMotion = true
    }

    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      updates.highContrast = true
    }

    // Detect screen reader usage
    const hasScreenReader =
      window.speechSynthesis ||
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('VoiceOver')

    if (hasScreenReader) {
      updates.screenReaderEnabled = true
    }

    // Check for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardNavigation: true }))
        document.removeEventListener('keydown', handleKeyDown)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    if (Object.keys(updates).length > 0) {
      setSettings(prev => ({ ...prev, ...updates }))
    }
  }

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
      document.body.classList.add('reduce-motion')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
      document.body.classList.remove('reduce-motion')
    }

    // Apply high contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }

    // Apply large text
    if (settings.largeText) {
      document.body.classList.add('large-text')
    } else {
      document.body.classList.remove('large-text')
    }

    // Apply font size
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`)

    // Apply color blindness filter
    if (settings.colorBlindnessMode !== 'none') {
      document.body.classList.add(`colorblind-${settings.colorBlindnessMode}`)
    } else {
      document.body.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia')
    }

    // Apply focus visible
    if (settings.focusVisible) {
      document.body.classList.add('force-focus-visible')
    } else {
      document.body.classList.remove('force-focus-visible')
    }

    // Add aria-live region for announcements if it doesn't exist
    if (!document.getElementById('accessibility-announcements')) {
      const announceDiv = document.createElement('div')
      announceDiv.id = 'accessibility-announcements'
      announceDiv.setAttribute('aria-live', 'polite')
      announceDiv.setAttribute('aria-atomic', 'true')
      announceDiv.style.position = 'absolute'
      announceDiv.style.left = '-10000px'
      announceDiv.style.width = '1px'
      announceDiv.style.height = '1px'
      announceDiv.style.overflow = 'hidden'
      document.body.appendChild(announceDiv)
    }
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  const announceToScreenReader = (message: string) => {
    const announceDiv = document.getElementById('accessibility-announcements')
    if (announceDiv) {
      announceDiv.textContent = message
      setTimeout(() => {
        announceDiv.textContent = ''
      }, 1000)
    }
  }

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    announceToScreenReader,
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {isClient && <AccessibilityStyles settings={settings} />}
    </AccessibilityContext.Provider>
  )
}

function AccessibilityStyles({ settings }: { settings: AccessibilitySettings }) {
  return (
    <style jsx global>{`
      /* Reduced Motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      /* High Contrast Mode */
      .high-contrast {
        filter: contrast(150%);
      }

      .high-contrast button,
      .high-contrast input,
      .high-contrast select,
      .high-contrast textarea {
        border: 3px solid #000000 !important;
        background: #ffffff !important;
        color: #000000 !important;
      }

      .high-contrast a {
        color: #0000EE !important;
        text-decoration: underline !important;
      }

      .high-contrast a:visited {
        color: #551A8B !important;
      }

      /* Large Text Mode */
      .large-text {
        font-size: 1.25em !important;
        line-height: 1.6 !important;
      }

      .large-text h1 { font-size: 2.5em !important; }
      .large-text h2 { font-size: 2.25em !important; }
      .large-text h3 { font-size: 2em !important; }
      .large-text h4 { font-size: 1.75em !important; }
      .large-text h5 { font-size: 1.5em !important; }
      .large-text h6 { font-size: 1.25em !important; }

      /* Color Blindness Filters */
      .colorblind-protanopia {
        filter: url('#protanopia-filter');
      }

      .colorblind-deuteranopia {
        filter: url('#deuteranopia-filter');
      }

      .colorblind-tritanopia {
        filter: url('#tritanopia-filter');
      }

      /* Enhanced Focus Visibility */
      .force-focus-visible *:focus-visible {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }

      /* Improved touch targets for mobile */
      @media (hover: none) and (pointer: coarse) {
        button,
        a,
        input,
        select,
        textarea,
        [role="button"],
        [role="link"] {
          min-height: 44px !important;
          min-width: 44px !important;
        }
      }

      /* Skip links */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000000;
        color: #ffffff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        font-weight: bold;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
      }

      .skip-link:focus {
        transform: translateY(0%);
        top: 6px;
      }
    `}</style>
  )
}

// Custom hook for announcements
export function useScreenReaderAnnouncements() {
  const { announceToScreenReader } = useAccessibility()

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message)

    // Also use ARIA live regions
    const existingRegion = document.querySelector(`[aria-live="${priority}"]`)
    if (existingRegion) {
      existingRegion.textContent = message
      setTimeout(() => {
        existingRegion.textContent = ''
      }, 1000)
    }
  }

  return { announce }
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const { settings } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key handling
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]')
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="close"], [aria-label*="Close"]')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        }
      }

      // Skip to main content (Shift + /)
      if (e.shiftKey && e.key === '?') {
        const mainContent = document.getElementById('main') || document.querySelector('main')
        if (mainContent instanceof HTMLElement) {
          mainContent.focus()
          e.preventDefault()
        }
      }
    }

    if (settings.keyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [settings.keyboardNavigation])
}

export default AccessibilityProvider
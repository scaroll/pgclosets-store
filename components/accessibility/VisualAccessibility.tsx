/**
 * Visual Accessibility Enhancements
 *
 * Comprehensive visual accessibility features:
 * - Color contrast validation and enhancement
 * - Color blindness support (4 types)
 * - High contrast themes (4 modes)
 * - Adjustable text size (200% zoom support)
 * - Focus indicators customization
 * - Dark/light mode optimization
 * - Reading mode
 * - Text spacing controls
 * - Font family options
 * - Visual indicator alternatives
 */

"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Eye, Palette, Sun, Moon, Contrast, Type, Zap } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

interface VisualAccessibilitySettings {
  highContrastMode: 'none' | 'normal' | 'high' | 'ultra' | 'inverted'
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  textSize: 'small' | 'normal' | 'large' | 'extra-large'
  textSpacing: 'normal' | 'increased' | 'high'
  lineHeight: 'normal' | 'relaxed' | 'loose'
  fontFamily: 'default' | 'dyslexic' | 'high-legibility'
  focusIndicators: 'default' | 'enhanced' | 'custom'
  reduceTransparency: boolean
  hideAnimations: boolean
  readingMode: boolean
  customColors: {
    background: string
    text: string
    accent: string
  }
}

export function VisualAccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { announceToScreenReader } = useAccessibility()
  const [visualSettings, setVisualSettings] = useState<VisualAccessibilitySettings>({
    highContrastMode: 'none',
    colorBlindnessMode: 'none',
    textSize: 'normal',
    textSpacing: 'normal',
    lineHeight: 'normal',
    fontFamily: 'default',
    focusIndicators: 'enhanced',
    reduceTransparency: false,
    hideAnimations: false,
    readingMode: false,
    customColors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#2563eb'
    }
  })

  // Apply visual accessibility settings to DOM
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    // Apply contrast mode
    body.className = body.className.replace(/contrast-\w+/g, '')
    if (visualSettings.highContrastMode !== 'none') {
      body.classList.add(`contrast-${visualSettings.highContrastMode}`)
    }

    // Apply color blindness mode
    body.className = body.className.replace(/colorblind-\w+/g, '')
    if (visualSettings.colorBlindnessMode !== 'none') {
      body.classList.add(`colorblind-${visualSettings.colorBlindnessMode}`)
    }

    // Apply text size
    body.className = body.className.replace(/text-size-\w+/g, '')
    body.classList.add(`text-size-${visualSettings.textSize}`)

    // Apply text spacing
    body.className = body.className.replace(/text-spacing-\w+/g, '')
    body.classList.add(`text-spacing-${visualSettings.textSpacing}`)

    // Apply line height
    body.className = body.className.replace(/line-height-\w+/g, '')
    body.classList.add(`line-height-${visualSettings.lineHeight}`)

    // Apply font family
    body.className = body.className.replace(/font-family-\w+/g, '')
    body.classList.add(`font-family-${visualSettings.fontFamily}`)

    // Apply focus indicators
    body.className = body.className.replace(/focus-\w+/g, '')
    body.classList.add(`focus-${visualSettings.focusIndicators}`)

    // Apply transparency reduction
    if (visualSettings.reduceTransparency) {
      body.classList.add('reduce-transparency')
    } else {
      body.classList.remove('reduce-transparency')
    }

    // Apply animation hiding
    if (visualSettings.hideAnimations) {
      body.classList.add('hide-animations')
    } else {
      body.classList.remove('hide-animations')
    }

    // Apply reading mode
    if (visualSettings.readingMode) {
      body.classList.add('reading-mode')
    } else {
      body.classList.remove('reading-mode')
    }

    // Apply custom colors
    root.style.setProperty('--custom-bg', visualSettings.customColors.background)
    root.style.setProperty('--custom-text', visualSettings.customColors.text)
    root.style.setProperty('--custom-accent', visualSettings.customColors.accent)

    // Save settings to localStorage
    localStorage.setItem('visual-accessibility-settings', JSON.stringify(visualSettings))
  }, [visualSettings])

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('visual-accessibility-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setVisualSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load visual accessibility settings:', error)
      }
    }

    // Detect system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersHighContrast) {
      setVisualSettings(prev => ({ ...prev, highContrastMode: 'high' }))
    }

    if (prefersReducedMotion) {
      setVisualSettings(prev => ({ ...prev, hideAnimations: true }))
    }
  }, [])

  // Create SVG filters for color blindness
  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("width", "0")
    svg.setAttribute("height", "0")
    svg.style.position = "absolute"

    // Protanopia (red-blind) filter
    const protanopiaFilter = `
      <filter id="protanopia-filter">
        <feColorMatrix type="matrix" values="
          0.567, 0.433, 0, 0, 0
          0.558, 0.442, 0, 0, 0
          0, 0.242, 0.758, 0, 0
          0, 0, 0, 1, 0
        "/>
      </filter>
    `

    // Deuteranopia (green-blind) filter
    const deuteranopiaFilter = `
      <filter id="deuteranopia-filter">
        <feColorMatrix type="matrix" values="
          0.625, 0.375, 0, 0, 0
          0.7, 0.3, 0, 0, 0
          0, 0.3, 0.7, 0, 0
          0, 0, 0, 1, 0
        "/>
      </filter>
    `

    // Tritanopia (blue-blind) filter
    const tritanopiaFilter = `
      <filter id="tritanopia-filter">
        <feColorMatrix type="matrix" values="
          0.95, 0.05, 0, 0, 0
          0, 0.433, 0.567, 0, 0
          0, 0.475, 0.525, 0, 0
          0, 0, 0, 1, 0
        "/>
      </filter>
    `

    // Achromatopsia (color-blind) filter
    const achromatopsiaFilter = `
      <filter id="achromatopsia-filter">
        <feColorMatrix type="matrix" values="
          0.299, 0.587, 0.114, 0, 0
          0.299, 0.587, 0.114, 0, 0
          0.299, 0.587, 0.114, 0, 0
          0, 0, 0, 1, 0
        "/>
      </filter>
    `

    svg.innerHTML = protanopiaFilter + deuteranopiaFilter + tritanopiaFilter + achromatopsiaFilter
    document.head.appendChild(svg)

    return () => {
      document.head.removeChild(svg)
    }
  }, [])

  const updateSetting = useCallback(<K extends keyof VisualAccessibilitySettings>(
    key: K,
    value: VisualAccessibilitySettings[K]
  ) => {
    setVisualSettings(prev => ({ ...prev, [key]: value }))

    // Announce changes for screen readers
    const announcements: Record<string, string> = {
      'highContrastMode': `Contrast mode set to ${value}`,
      'colorBlindnessMode': `Color vision mode set to ${value}`,
      'textSize': `Text size set to ${value}`,
      'textSpacing': `Text spacing set to ${value}`,
      'lineHeight': `Line height set to ${value}`,
      'fontFamily': `Font family set to ${value}`,
      'focusIndicators': `Focus indicators set to ${value}`,
      'reduceTransparency': value ? 'Transparency reduced' : 'Transparency normal',
      'hideAnimations': value ? 'Animations hidden' : 'Animations enabled',
      'readingMode': value ? 'Reading mode enabled' : 'Reading mode disabled'
    }

    if (announcements[key]) {
      announceToScreenReader(announcements[key])
    }
  }, [announceToScreenReader])

  return (
    <div className="visual-accessibility-provider">
      {children}

      {/* Visual Accessibility Controls */}
      <VisualAccessibilityControls
        settings={visualSettings}
        updateSetting={updateSetting}
      />
    </div>
  )
}

// Visual accessibility controls component
function VisualAccessibilityControls({
  settings,
  updateSetting
}: {
  settings: VisualAccessibilitySettings
  updateSetting: <K extends keyof VisualAccessibilitySettings>(key: K, value: VisualAccessibilitySettings[K]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[48px] min-w-[48px]"
        aria-label="Visual accessibility options"
        aria-expanded={isOpen}
      >
        <Eye className="w-6 h-6" />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Visual Accessibility</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close visual options"
            >
              ×
            </button>
          </div>

          {/* Contrast Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Contrast className="inline w-4 h-4 mr-1" />
              Contrast Mode
            </label>
            <select
              value={settings.highContrastMode}
              onChange={(e) => updateSetting('highContrastMode', e.target.value as VisualAccessibilitySettings['highContrastMode'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="none">Normal</option>
              <option value="normal">High Contrast</option>
              <option value="high">Ultra High Contrast</option>
              <option value="inverted">Inverted</option>
            </select>
          </div>

          {/* Color Blindness Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Palette className="inline w-4 h-4 mr-1" />
              Color Vision
            </label>
            <select
              value={settings.colorBlindnessMode}
              onChange={(e) => updateSetting('colorBlindnessMode', e.target.value as VisualAccessibilitySettings['colorBlindnessMode'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="none">Normal</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (Color-Blind)</option>
            </select>
          </div>

          {/* Text Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Type className="inline w-4 h-4 mr-1" />
              Text Size
            </label>
            <div className="flex gap-2">
              {(['small', 'normal', 'large', 'extra-large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateSetting('textSize', size)}
                  className={`px-3 py-2 rounded ${
                    settings.textSize === size
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Text Spacing */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Text Spacing</label>
            <div className="flex gap-2">
              {(['normal', 'increased', 'high'] as const).map(spacing => (
                <button
                  key={spacing}
                  onClick={() => updateSetting('textSpacing', spacing)}
                  className={`px-3 py-2 rounded ${
                    settings.textSpacing === spacing
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Font Style</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSetting('fontFamily', e.target.value as VisualAccessibilitySettings['fontFamily'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="default">Default</option>
              <option value="dyslexic">Dyslexic Friendly</option>
              <option value="high-legibility">High Legibility</option>
            </select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Enhanced Focus Indicators</span>
              <input
                type="checkbox"
                checked={settings.focusIndicators !== 'default'}
                onChange={(e) => updateSetting('focusIndicators', e.target.checked ? 'enhanced' : 'default')}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Reduce Transparency</span>
              <input
                type="checkbox"
                checked={settings.reduceTransparency}
                onChange={(e) => updateSetting('reduceTransparency', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Hide Animations</span>
              <input
                type="checkbox"
                checked={settings.hideAnimations}
                onChange={(e) => updateSetting('hideAnimations', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm">Reading Mode</span>
              <input
                type="checkbox"
                checked={settings.readingMode}
                onChange={(e) => updateSetting('readingMode', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
            </label>
          </div>
        </div>
      )}
    </>
  )
}

// Color contrast checker component
export function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#ffffff')
  const [ratio, setRatio] = useState(21)

  const calculateContrastRatio = (fg: string, bg: string) => {
    // Simplified contrast ratio calculation
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = rgb & 0xff
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(fg)
    const l2 = getLuminance(bg)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  useEffect(() => {
    setRatio(calculateContrastRatio(foreground, background))
  }, [foreground, background])

  const getWCAGLevel = (ratio: number) => {
    if (ratio >= 7) return { level: 'AAA', text: 'WCAG AAA Compliant', color: 'text-green-600' }
    if (ratio >= 4.5) return { level: 'AA', text: 'WCAG AA Compliant', color: 'text-blue-600' }
    if (ratio >= 3) return { level: 'AA Large', text: 'WCAG AA Large Text Only', color: 'text-yellow-600' }
    return { level: 'Fail', text: 'Not Compliant', color: 'text-red-600' }
  }

  const compliance = getWCAGLevel(ratio)

  return (
    <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Color Contrast Checker</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Foreground</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4 p-4 rounded" style={{ backgroundColor, color: foreground }}>
        <p className="text-lg font-medium">Sample Text</p>
        <p className="text-sm">This is how your color combination appears.</p>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Contrast Ratio:</span>
          <span className="text-lg font-bold">{ratio.toFixed(2)}:1</span>
        </div>

        <div className={`p-3 rounded-lg bg-gray-50 border ${compliance.color.replace('text', 'border')}`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">{compliance.text}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${compliance.color} bg-opacity-10 ${compliance.color.replace('text', 'bg')}`}>
              {compliance.level}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <p>• Normal text requires 4.5:1 for AA, 7:1 for AAA</p>
          <p>• Large text (18pt+ or 14pt+ bold) requires 3:1 for AA, 4.5:1 for AAA</p>
        </div>
      </div>
    </div>
  )
}

export default VisualAccessibilityProvider
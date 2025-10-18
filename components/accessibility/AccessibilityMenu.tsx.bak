'use client'

import React, { useState } from 'react'
import { Button } from '@/ui/button'
import { useAccessibility } from './AccessibilityProvider'

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSetting, resetSettings } = useAccessibility()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Accessibility Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </button>

      {/* Accessibility Menu Panel */}
      {isOpen && (
        <div
          id="accessibility-menu"
          className="fixed inset-0 z-40 overflow-hidden"
          aria-labelledby="accessibility-menu-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2
                    id="accessibility-menu-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Accessibility Settings
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                    aria-label="Close accessibility menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Customize your experience to meet your accessibility needs.
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Visual Preferences */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Visual Preferences
                    </h3>
                    <div className="space-y-4">
                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="high-contrast"
                            className="text-sm font-medium text-gray-900"
                          >
                            High Contrast
                          </label>
                          <p className="text-xs text-gray-600">
                            Increase color contrast for better visibility
                          </p>
                        </div>
                        <button
                          id="high-contrast"
                          onClick={() => updateSetting('highContrast', !settings.highContrast)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={settings.highContrast}
                          aria-labelledby="high-contrast"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Large Text */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="large-text"
                            className="text-sm font-medium text-gray-900"
                          >
                            Large Text
                          </label>
                          <p className="text-xs text-gray-600">
                            Increase text size throughout the site
                          </p>
                        </div>
                        <button
                          id="large-text"
                          onClick={() => updateSetting('largeText', !settings.largeText)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.largeText ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={settings.largeText}
                          aria-labelledby="large-text"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.largeText ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Font Size Slider */}
                      <div>
                        <label
                          htmlFor="font-size"
                          className="text-sm font-medium text-gray-900 block mb-2"
                        >
                          Font Size: {settings.fontSize}px
                        </label>
                        <input
                          id="font-size"
                          type="range"
                          min="12"
                          max="24"
                          step="1"
                          value={settings.fontSize}
                          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          aria-label="Adjust font size"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>12px</span>
                          <span>18px</span>
                          <span>24px</span>
                        </div>
                      </div>

                      {/* Color Blindness Support */}
                      <div>
                        <label
                          htmlFor="colorblind-mode"
                          className="text-sm font-medium text-gray-900 block mb-2"
                        >
                          Color Blindness Support
                        </label>
                        <select
                          id="colorblind-mode"
                          value={settings.colorBlindnessMode}
                          onChange={(e) =>
                            updateSetting('colorBlindnessMode', e.target.value as any)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="protanopia">Protanopia (Red-Green)</option>
                          <option value="deuteranopia">Deuteranopia (Red-Green)</option>
                          <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Motion Preferences */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Motion & Animation
                    </h3>
                    <div className="space-y-4">
                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="reduced-motion"
                            className="text-sm font-medium text-gray-900"
                          >
                            Reduce Motion
                          </label>
                          <p className="text-xs text-gray-600">
                            Minimize animations and transitions
                          </p>
                        </div>
                        <button
                          id="reduced-motion"
                          onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={settings.reducedMotion}
                          aria-labelledby="reduced-motion"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Navigation Preferences */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-4">
                      {/* Enhanced Focus */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="focus-visible"
                            className="text-sm font-medium text-gray-900"
                          >
                            Enhanced Focus Indicators
                          </label>
                          <p className="text-xs text-gray-600">
                            Show clear focus outlines for keyboard navigation
                          </p>
                        </div>
                        <button
                          id="focus-visible"
                          onClick={() => updateSetting('focusVisible', !settings.focusVisible)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.focusVisible ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={settings.focusVisible}
                          aria-labelledby="focus-visible"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.focusVisible ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Quick Actions */}
                  <section>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          updateSetting('highContrast', true)
                          updateSetting('largeText', true)
                          updateSetting('reducedMotion', true)
                          updateSetting('focusVisible', true)
                        }}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Enable All Accessibility Features
                      </Button>

                      <Button
                        onClick={resetSettings}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset to Default Settings
                      </Button>
                    </div>
                  </section>

                  {/* Help Section */}
                  <section className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Need Help?
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>
                        <strong>Keyboard Shortcuts:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Tab: Navigate between elements</li>
                        <li>Enter/Space: Activate buttons and links</li>
                        <li>Escape: Close modals and menus</li>
                        <li>Shift + ?: Skip to main content</li>
                      </ul>
                      <p className="mt-4">
                        For additional support, contact us at{' '}
                        <a
                          href="mailto:accessibility@pgclosets.com"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          accessibility@pgclosets.com
                        </a>
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for range slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  )
}

export default AccessibilityMenu
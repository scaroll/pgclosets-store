/**
 * Cognitive Accessibility Enhancements
 *
 * Comprehensive cognitive accessibility features:
 * - Clear navigation and headings structure
 * - Consistent layout and predictability
 * - Error prevention and clear instructions
 * - Reading level optimization
 * - Help and documentation
 * - Memory aids and reminders
 * - Simplified language options
 * - Progress indicators
 * - Content organization
 * - Decision support
 */

"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Brain, BookOpen, HelpCircle, Map, Clock, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

interface CognitiveAccessibilitySettings {
  simplifiedLanguage: boolean
  readingLevel: 'basic' | 'intermediate' | 'advanced'
  showProgress: boolean
  showInstructions: boolean
  extraHelp: boolean
  consistentLayout: boolean
  reducedChoices: boolean
  memoryAids: boolean
  predictabilityMode: boolean
  decisionSupport: boolean
  contentOrganization: 'simple' | 'detailed' | 'guided'
  autoSave: boolean
  confirmActions: boolean
}

export function CognitiveAccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { announceToScreenReader } = useAccessibility()
  const [cognitiveSettings, setCognitiveSettings] = useState<CognitiveAccessibilitySettings>({
    simplifiedLanguage: false,
    readingLevel: 'intermediate',
    showProgress: true,
    showInstructions: true,
    extraHelp: false,
    consistentLayout: true,
    reducedChoices: false,
    memoryAids: false,
    predictabilityMode: false,
    decisionSupport: false,
    contentOrganization: 'detailed',
    autoSave: true,
    confirmActions: false
  })

  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([])
  const [contextHelp, setContextHelp] = useState<string | null>(null)
  const [activeInstructions, setActiveInstructions] = useState<string[]>([])

  // Apply cognitive accessibility settings
  useEffect(() => {
    const body = document.body

    // Apply cognitive modes
    body.className = body.className.replace(/cognitive-\w+/g, '')

    if (cognitiveSettings.simplifiedLanguage) {
      body.classList.add('cognitive-simplified')
    }

    if (cognitiveSettings.extraHelp) {
      body.classList.add('cognitive-extra-help')
    }

    if (cognitiveSettings.reducedChoices) {
      body.classList.add('cognitive-reduced-choices')
    }

    if (cognitiveSettings.memoryAids) {
      body.classList.add('cognitive-memory-aids')
    }

    if (cognitiveSettings.predictabilityMode) {
      body.classList.add('cognitive-predictable')
    }

    if (cognitiveSettings.decisionSupport) {
      body.classList.add('cognitive-decision-support')
    }

    body.classList.add(`cognitive-organization-${cognitiveSettings.contentOrganization}`)
    body.classList.add(`cognitive-reading-${cognitiveSettings.readingLevel}`)

    // Save settings
    localStorage.setItem('cognitive-accessibility-settings', JSON.stringify(cognitiveSettings))
  }, [cognitiveSettings])

  // Load saved settings
  useEffect(() => {
    const saved = localStorage.getItem('cognitive-accessibility-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCognitiveSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load cognitive accessibility settings:', error)
      }
    }
  }, [])

  // Update breadcrumbs based on current page
  useEffect(() => {
    const updateBreadcrumbs = () => {
      const path = window.location.pathname
      const segments = path.split('/').filter(Boolean)
      const crumbs = [{ label: 'Home', href: '/' }]

      segments.forEach((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
        crumbs.push({ label, href })
      })

      setBreadcrumbs(crumbs)
    }

    updateBreadcrumbs()
    window.addEventListener('popstate', updateBreadcrumbs)
    return () => window.removeEventListener('popstate', updateBreadcrumbs)
  }, [])

  const updateSetting = useCallback(<K extends keyof CognitiveAccessibilitySettings>(
    key: K,
    value: CognitiveAccessibilitySettings[K]
  ) => {
    setCognitiveSettings(prev => ({ ...prev, [key]: value }))

    // Announce changes
    const announcements: Record<string, string> = {
      'simplifiedLanguage': value ? 'Simplified language enabled' : 'Simplified language disabled',
      'readingLevel': `Reading level set to ${value}`,
      'showProgress': value ? 'Progress indicators enabled' : 'Progress indicators hidden',
      'showInstructions': value ? 'Instructions enabled' : 'Instructions hidden',
      'extraHelp': value ? 'Extra help enabled' : 'Extra help disabled',
      'reducedChoices': value ? 'Choice reduction enabled' : 'Choice reduction disabled',
      'memoryAids': value ? 'Memory aids enabled' : 'Memory aids disabled',
      'confirmActions': value ? 'Action confirmation enabled' : 'Action confirmation disabled'
    }

    if (announcements[key]) {
      announceToScreenReader(announcements[key])
    }
  }, [announceToScreenReader])

  const addInstruction = useCallback((instruction: string) => {
    setActiveInstructions(prev => [...prev, instruction])
    announceToScreenReader(`New instruction: ${instruction}`)
  }, [announceToScreenReader])

  const removeInstruction = useCallback((instruction: string) => {
    setActiveInstructions(prev => prev.filter(i => i !== instruction))
  }, [])

  const showContextHelp = useCallback((help: string) => {
    setContextHelp(help)
    announceToScreenReader(`Help: ${help}`)
  }, [announceToScreenReader])

  return (
    <div className="cognitive-accessibility-provider">
      {children}

      {/* Breadcrumb Navigation */}
      {cognitiveSettings.consistentLayout && breadcrumbs.length > 1 && (
        <nav aria-label="Breadcrumb navigation" className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <a
                    href={crumb.href}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {crumb.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Instructions Panel */}
      {cognitiveSettings.showInstructions && activeInstructions.length > 0 && (
        <div className="fixed top-20 left-4 z-40 w-80 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Instructions
          </h3>
          <ul className="space-y-2">
            {activeInstructions.map((instruction, index) => (
              <li key={index} className="flex items-start text-sm text-blue-800">
                <span className="mr-2">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Context Help */}
      {contextHelp && (
        <div className="fixed bottom-4 left-4 z-40 w-80 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 mr-2 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Help</h3>
                <p className="text-sm text-green-800">{contextHelp}</p>
              </div>
            </div>
            <button
              onClick={() => setContextHelp(null)}
              className="ml-4 text-green-600 hover:text-green-800"
              aria-label="Close help"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {cognitiveSettings.showProgress && (
        <ProgressIndicator />
      )}

      {/* Cognitive Controls */}
      <CognitiveAccessibilityControls
        settings={cognitiveSettings}
        updateSetting={updateSetting}
        showContextHelp={showContextHelp}
      />
    </div>
  )
}

// Cognitive accessibility controls component
function CognitiveAccessibilityControls({
  settings,
  updateSetting,
  showContextHelp
}: {
  settings: CognitiveAccessibilitySettings
  updateSetting: <K extends keyof CognitiveAccessibilitySettings>(key: K, value: CognitiveAccessibilitySettings[K]) => void
  showContextHelp: (help: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[48px] min-w-[48px]"
        aria-label="Cognitive accessibility options"
        aria-expanded={isOpen}
      >
        <Brain className="w-6 h-6" />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-40 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Cognitive Support</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Close cognitive options"
          >
            ×
          </button>
        </div>

        {/* Language Simplification */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Simplified Language
            </label>
            <button
              onClick={() => showContextHelp('Simplifies complex words and sentence structures for easier understanding')}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Get help with simplified language"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => updateSetting('simplifiedLanguage', !settings.simplifiedLanguage)}
            className={`w-full px-4 py-2 rounded ${
              settings.simplifiedLanguage
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {settings.simplifiedLanguage ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {/* Reading Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Reading Level</label>
          <select
            value={settings.readingLevel}
            onChange={(e) => updateSetting('readingLevel', e.target.value as CognitiveAccessibilitySettings['readingLevel'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="basic">Basic (Grade 3-6)</option>
            <option value="intermediate">Intermediate (Grade 7-9)</option>
            <option value="advanced">Advanced (Grade 10+)</option>
          </select>
        </div>

        {/* Content Organization */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Content Organization</label>
          <select
            value={settings.contentOrganization}
            onChange={(e) => updateSetting('contentOrganization', e.target.value as CognitiveAccessibilitySettings['contentOrganization'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="simple">Simple (key points only)</option>
            <option value="detailed">Detailed (full information)</option>
            <option value="guided">Guided (step-by-step)</option>
          </select>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Show Progress Indicators</span>
            <input
              type="checkbox"
              checked={settings.showProgress}
              onChange={(e) => updateSetting('showProgress', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Show Instructions</span>
            <input
              type="checkbox"
              checked={settings.showInstructions}
              onChange={(e) => updateSetting('showInstructions', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Extra Help & Hints</span>
            <input
              type="checkbox"
              checked={settings.extraHelp}
              onChange={(e) => updateSetting('extraHelp', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Consistent Layout</span>
            <input
              type="checkbox"
              checked={settings.consistentLayout}
              onChange={(e) => updateSetting('consistentLayout', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Reduce Choices</span>
            <input
              type="checkbox"
              checked={settings.reducedChoices}
              onChange={(e) => updateSetting('reducedChoices', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Memory Aids</span>
            <input
              type="checkbox"
              checked={settings.memoryAids}
              onChange={(e) => updateSetting('memoryAids', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Predictable Layout</span>
            <input
              type="checkbox"
              checked={settings.predictabilityMode}
              onChange={(e) => updateSetting('predictabilityMode', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Decision Support</span>
            <input
              type="checkbox"
              checked={settings.decisionSupport}
              onChange={(e) => updateSetting('decisionSupport', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Auto-Save Progress</span>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => updateSetting('autoSave', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Confirm Important Actions</span>
            <input
              type="checkbox"
              checked={settings.confirmActions}
              onChange={(e) => updateSetting('confirmActions', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
          </label>
        </div>
      </div>
      )}
    </>
  )
}

// Progress indicator component
function ProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div
        className="h-full bg-green-600 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page reading progress"
      />
    </div>
  )
}

// Simplified content wrapper
export function SimplifiedContent({
  originalText,
  simplifiedText,
  showBoth = false
}: {
  originalText: string
  simplifiedText: string
  showBoth?: boolean
}) {
  const [useSimplified, setUseSimplified] = useState(false)

  return (
    <div className="simplified-content">
      {showBoth && (
        <div className="mb-4">
          <button
            onClick={() => setUseSimplified(!useSimplified)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            aria-label={useSimplified ? 'Show original text' : 'Show simplified text'}
          >
            {useSimplified ? 'Show Original' : 'Show Simple'}
          </button>
        </div>
      )}
      <p className={useSimplified ? 'text-lg leading-relaxed' : ''}>
        {useSimplified || !originalText ? simplifiedText : originalText}
      </p>
    </div>
  )
}

// Step-by-step instructions component
export function StepByStepInstructions({
  steps,
  currentStep,
  onStepChange
}: {
  steps: Array<{ title: string; content: string; completed?: boolean }>
  currentStep: number
  onStepChange: (step: number) => void
}) {
  return (
    <div className="step-by-step-instructions bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Step-by-Step Guide</h3>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === currentStep
                ? 'border-blue-500 bg-blue-100'
                : step.completed
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                index === currentStep
                  ? 'bg-blue-500 text-white'
                  : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-700">{step.content}</p>

                {index === currentStep && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CognitiveAccessibilityProvider
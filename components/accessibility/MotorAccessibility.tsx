/**
 * Motor Accessibility Enhancements
 *
 * Features for users with motor impairments:
 * - Touch target size optimization (44px+)
 * - Alternative input methods
 * - Gesture recognition alternatives
 * - Adjustable timing
 * - Error prevention
 * - Multiple interaction methods
 */

"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useAccessibility } from './AccessibilityProvider'

interface MotorAccessibilitySettings {
  largeTouchTargets: boolean
  extendedTimeouts: boolean
  simplifiedInteractions: boolean
  voiceCommands: boolean
  headTracking: boolean
  eyeTracking: boolean
  switchNavigation: boolean
  adaptiveKeyboard: boolean
  gestureAlternatives: boolean
  errorPrevention: boolean
  customTiming: number
}

export function MotorAccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { announceToScreenReader, settings } = useAccessibility()
  const [motorSettings, setMotorSettings] = useState<MotorAccessibilitySettings>({
    largeTouchTargets: false,
    extendedTimeouts: false,
    simplifiedInteractions: false,
    voiceCommands: false,
    headTracking: false,
    eyeTracking: false,
    switchNavigation: false,
    adaptiveKeyboard: false,
    gestureAlternatives: false,
    errorPrevention: true,
    customTiming: 1000
  })

  // Update motor settings based on user preferences
  useEffect(() => {
    const detectMotorNeeds = () => {
      const updates: Partial<MotorAccessibilitySettings> = {}

      // Detect if user might benefit from motor accessibility features
      if (window.matchMedia('(pointer: coarse)').matches) {
        updates.largeTouchTargets = true
        updates.extendedTimeouts = true
      }

      // Check for reduced motion preference
      if (settings.reducedMotion) {
        updates.simplifiedInteractions = true
      }

      // Load saved preferences
      const saved = localStorage.getItem('motor-accessibility-settings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          Object.assign(updates, parsed)
        } catch (error) {
          console.error('Failed to load motor accessibility settings:', error)
        }
      }

      if (Object.keys(updates).length > 0) {
        setMotorSettings(prev => ({ ...prev, ...updates }))
      }
    }

    detectMotorNeeds()
  }, [settings.reducedMotion])

  // Apply motor accessibility enhancements
  useEffect(() => {
    document.body.classList.toggle('motor-large-targets', motorSettings.largeTouchTargets)
    document.body.classList.toggle('motor-extended-timeouts', motorSettings.extendedTimeouts)
    document.body.classList.toggle('motor-simplified', motorSettings.simplifiedInteractions)
    document.body.classList.toggle('motor-error-prevention', motorSettings.errorPrevention)

    // Save settings
    localStorage.setItem('motor-accessibility-settings', JSON.stringify(motorSettings))
  }, [motorSettings])

  // Voice command support
  useEffect(() => {
    if (!motorSettings.voiceCommands) return

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1
        const transcript = event.results[last][0].transcript.toLowerCase()

        // Handle voice commands
        handleVoiceCommand(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        announceToScreenReader('Voice command recognition error')
      }

      recognition.start()

      return () => {
        recognition.stop()
      }
    } else {
      announceToScreenReader('Voice commands not supported in this browser')
    }
  }, [motorSettings.voiceCommands, announceToScreenReader])

  // Handle voice commands
  const handleVoiceCommand = useCallback((command: string) => {
    const commands = {
      'scroll down': () => window.scrollBy({ top: 200, behavior: 'smooth' }),
      'scroll up': () => window.scrollBy({ top: -200, behavior: 'smooth' }),
      'go to top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'click button': () => {
        const focused = document.activeElement as HTMLElement
        if (focused && focused.tagName === 'BUTTON') {
          focused.click()
        }
      },
      'next link': () => {
        const links = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[]
        const current = document.activeElement as HTMLAnchorElement
        const index = links.indexOf(current)
        const next = links[index + 1] || links[0]
        if (next) next.focus()
      },
      'open menu': () => {
        const menu = document.querySelector('[role="menu"], .menu, nav') as HTMLElement
        if (menu) menu.focus()
      }
    }

    for (const [cmd, action] of Object.entries(commands)) {
      if (command.includes(cmd)) {
        action()
        announceToScreenReader(`Executing command: ${cmd}`)
        break
      }
    }
  }, [announceToScreenReader])

  // Head tracking support (simplified implementation)
  useEffect(() => {
    if (!motorSettings.headTracking) return

    const handleHeadTracking = (event: any) => {
      // This would integrate with actual head tracking APIs
      // For now, we'll provide a placeholder for head tracking controls
      if (event.headMovement) {
        // Convert head movement to cursor/mouse movement
        const deltaX = event.headMovement.x
        const deltaY = event.headMovement.y

        // Find element at head position and focus it
        const element = document.elementFromPoint(
          window.innerWidth / 2 + deltaX,
          window.innerHeight / 2 + deltaY
        ) as HTMLElement

        if (element && element.tabIndex >= 0) {
          element.focus()
        }
      }
    }

    // This would connect to actual head tracking hardware/software
    // For demonstration, we'll use mouse movement as a proxy
    const handleMouseMove = (e: MouseEvent) => {
      if (e.shiftKey) { // Hold shift to simulate head tracking
        handleHeadTracking({
          headMovement: {
            x: (e.clientX - window.innerWidth / 2) * 0.1,
            y: (e.clientY - window.innerHeight / 2) * 0.1
          }
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [motorSettings.headTracking])

  // Switch navigation support
  useEffect(() => {
    if (!motorSettings.switchNavigation) return

    let switchIndex = 0
    const focusableElements = Array.from(document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )) as HTMLElement[]

    const handleSwitchInput = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        // Move to next focusable element
        switchIndex = (switchIndex + 1) % focusableElements.length
        const element = focusableElements[switchIndex]
        if (element) {
          element.focus()
          announceToScreenReader(`Focused on ${element.textContent || element.tagName}`)
        }
      }

      if (e.code === 'Enter') {
        e.preventDefault()
        // Activate current element
        const current = document.activeElement as HTMLElement
        if (current) {
          current.click()
          announceToScreenReader('Activated element')
        }
      }
    }

    document.addEventListener('keydown', handleSwitchInput)
    return () => document.removeEventListener('keydown', handleSwitchInput)
  }, [motorSettings.switchNavigation, announceToScreenReader])

  return (
    <div className="motor-accessibility-provider">
      {children}
    </div>
  )
}

// Touch-friendly button with motor accessibility features
export function MotorAccessibleButton({
  children,
  onClick,
  className = '',
  minSize = 48,
  longPressDelay = 1000,
  confirmationRequired = false,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  minSize?: number
  longPressDelay?: number
  confirmationRequired?: boolean
  [key: string]: any
}) {
  const [isPressed, setIsPressed] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const { announceToScreenReader } = useAccessibility()

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPressed(true)

    // Start long press timer
    const timer = setTimeout(() => {
      setShowConfirmation(true)
      announceToScreenReader('Long press detected. Click again to confirm.')
    }, longPressDelay)

    setLongPressTimer(timer)
  }, [longPressDelay, announceToScreenReader])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    setIsPressed(false)

    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    if (!confirmationRequired || showConfirmation) {
      onClick?.()
      announceToScreenReader('Action completed')
      setShowConfirmation(false)
    }
  }, [onClick, confirmationRequired, showConfirmation, longPressTimer, announceToScreenReader])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
    setShowConfirmation(false)
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

  return (
    <button
      {...props}
      className={cn(
        'motor-accessible-button',
        'transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        'active:scale-95',
        isPressed && 'scale-95',
        showConfirmation && 'bg-green-500 text-white',
        className
      )}
      style={{
        minHeight: `${minSize}px`,
        minWidth: `${minSize}px`,
        padding: `${Math.max(12, minSize / 4)}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-describedby={showConfirmation ? 'confirm-press' : undefined}
    >
      {children}
      {showConfirmation && (
        <span id="confirm-press" className="sr-only">
          Confirm action by clicking again
        </span>
      )}
    </button>
  )
}

// Drag and drop with motor accessibility alternatives
export function MotorAccessibleDragDrop({
  items,
  onReorder,
  className = ''
}: {
  items: Array<{ id: string; content: React.ReactNode }>
  onReorder: (oldIndex: number, newIndex: number) => void
  className?: string
}) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [useButtonMode, setUseButtonMode] = useState(false)
  const { announceToScreenReader } = useAccessibility()

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
    announceToScreenReader(`Started dragging item ${index + 1}`)
  }

  const handleDrop = (newIndex: number) => {
    if (draggedItem !== null && draggedItem !== newIndex) {
      onReorder(draggedItem, newIndex)
      announceToScreenReader(`Moved item from position ${draggedItem + 1} to ${newIndex + 1}`)
    }
    setDraggedItem(null)
  }

  const handleButtonMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < items.length) {
      onReorder(index, newIndex)
      announceToScreenReader(`Moved item to position ${newIndex + 1}`)
    }
  }

  return (
    <div className={cn('motor-accessible-drag-drop', className)}>
      <div className="mb-4">
        <button
          onClick={() => setUseButtonMode(!useButtonMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={useButtonMode ? 'Switch to drag and drop mode' : 'Switch to button mode'}
        >
          {useButtonMode ? 'Use Drag & Drop' : 'Use Buttons'}
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg',
              'bg-white hover:bg-gray-50',
              draggedItem === index && 'opacity-50'
            )}
          >
            <div className="flex-1">{item.content}</div>

            {useButtonMode ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleButtonMove(index, 'up')}
                  disabled={index === 0}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Move item ${index + 1} up`}
                >
                  ↑
                </button>
                <button
                  onClick={() => handleButtonMove(index, 'down')}
                  disabled={index === items.length - 1}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Move item ${index + 1} down`}
                >
                  ↓
                </button>
              </div>
            ) : (
              <div
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="cursor-move p-2"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleDragStart(index)
                  }
                }}
                aria-label={`Drag item ${index + 1} to reorder`}
              >
                ⋮⋮
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Error prevention component
export function ErrorPrevention({
  children,
  confirmDestructive = true,
  undoTimeout = 5000,
  className = ''
}: {
  children: React.ReactNode
  confirmDestructive?: boolean
  undoTimeout?: number
  className?: string
}) {
  const [pendingActions, setPendingActions] = useState<Array<{
    id: string
    action: () => void
    undo: () => void
    description: string
  }>>([])

  const executeWithConfirmation = useCallback((
    action: () => void,
    undo: () => void,
    description: string
  ) => {
    if (!confirmDestructive) {
      action()
      return
    }

    const id = Date.now().toString()
    const pendingAction = { id, action, undo, description }

    setPendingActions(prev => [...prev, pendingAction])

    // Auto-execute after timeout if not cancelled
    setTimeout(() => {
      setPendingActions(prev => prev.filter(a => a.id !== id))
      action()
    }, undoTimeout)
  }, [confirmDestructive, undoTimeout])

  const cancelAction = useCallback((id: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== id))
  }, [])

  return (
    <div className={cn('error-prevention', className)}>
      {children}

      {/* Pending actions notification */}
      {pendingActions.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 z-50">
          <h3 className="font-semibold text-yellow-800 mb-2">Pending Actions</h3>
          <div className="space-y-2">
            {pendingActions.map(action => (
              <div key={action.id} className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">{action.description}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      action.action()
                      cancelAction(action.id)
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => cancelAction(action.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper for combining class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default MotorAccessibilityProvider
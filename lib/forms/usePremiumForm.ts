"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm, UseFormProps, UseFormReturn, FieldValues, Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

/**
 * Premium Form Hook
 *
 * Enhanced form state management with:
 * - Auto-save to localStorage with encryption
 * - Form abandonment tracking
 * - Multi-step form progress management
 * - Dirty state detection
 * - Undo/redo functionality
 * - Submit state management
 */

export interface UsePremiumFormOptions<T extends FieldValues> extends UseFormProps<T> {
  /** Unique form ID for localStorage */
  formId?: string
  /** Enable auto-save to localStorage */
  autoSave?: boolean
  /** Auto-save interval in milliseconds (default: 2000ms) */
  autoSaveInterval?: number
  /** Enable form abandonment tracking */
  trackAbandonment?: boolean
  /** Callback when form is abandoned */
  onAbandon?: (data: Partial<T>) => void
  /** Number of steps for multi-step forms */
  steps?: number
  /** Enable undo/redo functionality */
  enableHistory?: boolean
  /** Maximum history size for undo/redo */
  maxHistorySize?: number
  /** Encrypt data in localStorage */
  encryptStorage?: boolean
}

export interface UsePremiumFormReturn<T extends FieldValues> extends UseFormReturn<T> {
  /** Current step in multi-step form (0-indexed) */
  currentStep: number
  /** Go to next step */
  nextStep: () => void
  /** Go to previous step */
  previousStep: () => void
  /** Go to specific step */
  goToStep: (step: number) => void
  /** Check if on first step */
  isFirstStep: boolean
  /** Check if on last step */
  isLastStep: boolean
  /** Progress percentage (0-100) */
  progress: number
  /** Undo last change */
  undo: () => void
  /** Redo last undone change */
  redo: () => void
  /** Check if can undo */
  canUndo: boolean
  /** Check if can redo */
  canRedo: boolean
  /** Clear saved form data */
  clearSavedData: () => void
  /** Check if form is being submitted */
  isSubmitting: boolean
  /** Check if form submission was successful */
  isSubmitSuccessful: boolean
  /** Submit error message */
  submitError: string | null
  /** Enhanced submit handler with error handling */
  handleSubmit: (onValid: (data: T) => Promise<void> | void) => (e?: React.BaseSyntheticEvent) => Promise<void>
}

/**
 * Simple encryption for localStorage (not cryptographically secure, just obfuscation)
 */
const simpleEncrypt = (text: string): string => {
  return btoa(encodeURIComponent(text))
}

const simpleDecrypt = (encrypted: string): string => {
  try {
    return decodeURIComponent(atob(encrypted))
  } catch {
    return ""
  }
}

/**
 * Premium form hook with advanced features
 */
export function usePremiumForm<T extends FieldValues>(
  options: UsePremiumFormOptions<T> = {}
): UsePremiumFormReturn<T> {
  const {
    formId,
    autoSave = false,
    autoSaveInterval = 2000,
    trackAbandonment = false,
    onAbandon,
    steps = 1,
    enableHistory = false,
    maxHistorySize = 10,
    encryptStorage = true,
    ...formOptions
  } = options

  // React Hook Form
  const form = useForm<T>(formOptions)
  const { watch, reset } = form

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(0)

  // History state (for undo/redo)
  const [history, setHistory] = useState<Partial<T>[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout>()
  const formDataRef = useRef<Partial<T>>({})
  const hasInteractedRef = useRef(false)

  const storageKey = formId ? `premium-form-${formId}` : null

  // ============================================================================
  // AUTO-SAVE TO LOCALSTORAGE
  // ============================================================================

  const saveToStorage = useCallback(
    (data: Partial<T>) => {
      if (!storageKey || typeof window === "undefined") return

      try {
        const serialized = JSON.stringify(data)
        const toStore = encryptStorage ? simpleEncrypt(serialized) : serialized
        localStorage.setItem(storageKey, toStore)
        localStorage.setItem(`${storageKey}-timestamp`, Date.now().toString())
      } catch (error) {
        console.error("Failed to save form data:", error)
      }
    },
    [storageKey, encryptStorage]
  )

  const loadFromStorage = useCallback((): Partial<T> | null => {
    if (!storageKey || typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(storageKey)
      if (!stored) return null

      const serialized = encryptStorage ? simpleDecrypt(stored) : stored
      return JSON.parse(serialized)
    } catch (error) {
      console.error("Failed to load form data:", error)
      return null
    }
  }, [storageKey, encryptStorage])

  const clearSavedData = useCallback(() => {
    if (!storageKey || typeof window === "undefined") return

    localStorage.removeItem(storageKey)
    localStorage.removeItem(`${storageKey}-timestamp`)
  }, [storageKey])

  // Load saved data on mount
  useEffect(() => {
    if (!autoSave || !storageKey) return

    const savedData = loadFromStorage()
    if (savedData) {
      reset(savedData as T)
    }
  }, [autoSave, storageKey, loadFromStorage, reset])

  // Auto-save on form changes
  useEffect(() => {
    if (!autoSave || !storageKey) return

    const subscription = watch((data) => {
      formDataRef.current = data

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        saveToStorage(data)
      }, autoSaveInterval)
    })

    return () => {
      subscription.unsubscribe()
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [autoSave, storageKey, watch, saveToStorage, autoSaveInterval])

  // ============================================================================
  // FORM ABANDONMENT TRACKING
  // ============================================================================

  useEffect(() => {
    if (!trackAbandonment) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isDirty = Object.keys(formDataRef.current).length > 0
      const hasUnsavedChanges = hasInteractedRef.current && isDirty && !isSubmitSuccessful

      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""

        // Track abandonment
        if (onAbandon) {
          onAbandon(formDataRef.current)
        }
      }
    }

    const handleInteraction = () => {
      hasInteractedRef.current = true
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("input", handleInteraction)
    window.addEventListener("change", handleInteraction)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("input", handleInteraction)
      window.removeEventListener("change", handleInteraction)
    }
  }, [trackAbandonment, onAbandon, isSubmitSuccessful])

  // ============================================================================
  // MULTI-STEP NAVIGATION
  // ============================================================================

  const nextStep = useCallback(() => {
    if (currentStep < steps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, steps])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps) {
        setCurrentStep(step)
      }
    },
    [steps]
  )

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps - 1
  const progress = steps > 1 ? ((currentStep + 1) / steps) * 100 : 100

  // ============================================================================
  // UNDO/REDO FUNCTIONALITY
  // ============================================================================

  useEffect(() => {
    if (!enableHistory) return

    const subscription = watch((data) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(data)

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift()
        }

        return newHistory
      })
      setHistoryIndex((prev) => Math.min(prev + 1, maxHistorySize - 1))
    })

    return () => subscription.unsubscribe()
  }, [enableHistory, watch, historyIndex, maxHistorySize])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousData = history[historyIndex - 1]
      reset(previousData as T)
      setHistoryIndex((prev) => prev - 1)
    }
  }, [history, historyIndex, reset])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextData = history[historyIndex + 1]
      reset(nextData as T)
      setHistoryIndex((prev) => prev + 1)
    }
  }, [history, historyIndex, reset])

  const canUndo = enableHistory && historyIndex > 0
  const canRedo = enableHistory && historyIndex < history.length - 1

  // ============================================================================
  // ENHANCED SUBMIT HANDLER
  // ============================================================================

  const handleSubmit = useCallback(
    (onValid: (data: T) => Promise<void> | void) => {
      return async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
          await form.handleSubmit(async (data) => {
            try {
              await onValid(data)
              setIsSubmitSuccessful(true)

              // Clear saved data on successful submit
              if (autoSave && storageKey) {
                clearSavedData()
              }
            } catch (error) {
              const message = error instanceof Error ? error.message : "An error occurred"
              setSubmitError(message)
              throw error
            }
          })(e)
        } catch (error) {
          // Error is already handled above
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [form, autoSave, storageKey, clearSavedData]
  )

  return {
    ...form,
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress,
    undo,
    redo,
    canUndo,
    canRedo,
    clearSavedData,
    isSubmitting,
    isSubmitSuccessful,
    submitError,
    handleSubmit,
  }
}

/**
 * Helper hook for multi-step form validation
 */
export function useMultiStepValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  stepFields: Record<number, Path<T>[]>
) {
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = stepFields[step]
      if (!fields || fields.length === 0) return true

      const results = await Promise.all(
        fields.map((field) => form.trigger(field))
      )

      return results.every((isValid) => isValid)
    },
    [form, stepFields]
  )

  return { validateStep }
}

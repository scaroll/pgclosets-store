/**
 * Accessible Form Component
 *
 * WCAG 2.1 AAA compliant form with:
 * - Proper labeling and descriptions
 * - Error validation and announcements
 * - Keyboard navigation
 * - Field grouping with fieldsets
 * - Required field indicators
 * - Help text integration
 * - Form submission feedback
 */

"use client"

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useAccessibility } from './AccessibilityProvider'

interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  helpText?: string
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: string) => string | null
  }
  options?: Array<{ value: string; label: string }>
  defaultValue?: string | boolean
  autoComplete?: string
}

interface AccessibleFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  submitButtonText?: string
  submitButtonVariant?: 'primary' | 'secondary'
  className?: string
  fieldsetLegend?: string
  showProgressIndicator?: boolean
  liveValidation?: boolean
}

interface ValidationErrors {
  [fieldId: string]: string[]
}

export function AccessibleForm({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  submitButtonVariant = 'primary',
  className,
  fieldsetLegend,
  showProgressIndicator = false,
  liveValidation = true
}: AccessibleFormProps) {
  const { announceToScreenReader, settings } = useAccessibility()
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initial[field.id] = field.defaultValue
      }
    })
    return initial
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  // Validate a single field
  const validateField = useCallback((field: FormField, value: any): string[] => {
    const fieldErrors: string[] = []

    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      fieldErrors.push(`${field.label} is required`)
    }

    if (value && typeof value === 'string') {
      if (field.validation?.minLength && value.length < field.validation.minLength) {
        fieldErrors.push(`${field.label} must be at least ${field.validation.minLength} characters long`)
      }

      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        fieldErrors.push(`${field.label} must not exceed ${field.validation.maxLength} characters`)
      }

      if (field.validation?.pattern && !field.validation.pattern.test(value)) {
        fieldErrors.push(`${field.label} format is invalid`)
      }

      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push('Please enter a valid email address')
      }

      if (field.type === 'tel' && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        fieldErrors.push('Please enter a valid phone number')
      }
    }

    if (field.validation?.custom) {
      const customError = field.validation.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    return fieldErrors
  }, [])

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {}
    let hasErrors = false

    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.id])
      if (fieldErrors.length > 0) {
        newErrors[field.id] = fieldErrors
        hasErrors = true
      }
    })

    setErrors(newErrors)

    if (hasErrors) {
      const errorCount = Object.values(newErrors).reduce((sum, fieldErrors) => sum + fieldErrors.length, 0)
      announceToScreenReader(`Form validation failed with ${errorCount} error${errorCount > 1 ? 's' : ''}`)

      // Focus error summary
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus()
        errorSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    return !hasErrors
  }, [fields, formData, validateField, announceToScreenReader])

  // Handle field value change
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))

    // Live validation
    if (liveValidation) {
      const field = fields.find(f => f.id === fieldId)
      if (field) {
        const fieldErrors = validateField(field, value)
        setErrors(prev => ({
          ...prev,
          [fieldId]: fieldErrors
        }))

        // Announce validation result
        if (fieldErrors.length > 0) {
          announceToScreenReader(`${field.label}: ${fieldErrors.join(', ')}`)
        }
      }
    }
  }, [fields, liveValidation, validateField, announceToScreenReader])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    announceToScreenReader('Submitting form, please wait')

    try {
      await onSubmit(formData)
      setSubmitStatus('success')
      announceToScreenReader('Form submitted successfully')

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({})
        setErrors({})
        setSubmitStatus('idle')
        formRef.current?.reset()
      }, 3000)
    } catch (error) {
      setSubmitStatus('error')
      announceToScreenReader('Form submission failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, isSubmitting, validateForm, onSubmit, announceToScreenReader])

  // Generate field ID for accessibility
  const getFieldId = (field: FormField, suffix: string = '') => `${field.id}${suffix ? `-${suffix}` : ''}`

  // Render form field
  const renderField = (field: FormField) => {
    const fieldId = getFieldId(field)
    const labelId = getFieldId(field, 'label')
    const helpId = getFieldId(field, 'help')
    const errorId = getFieldId(field, 'error')
    const hasError = errors[field.id] && errors[field.id].length > 0

    const fieldClasses = cn(
      'w-full px-3 py-2 text-base',
      'border rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px]', // Touch-friendly target
      hasError && 'border-red-500 focus:ring-red-500',
      settings.highContrast && 'border-2 border-black'
    )

    const inputProps = {
      id: fieldId,
      'aria-labelledby': labelId,
      'aria-describedby': cn(
        field.helpText && helpId,
        hasError && errorId
      ) || undefined,
      'aria-invalid': hasError,
      'aria-required': field.required,
      disabled: isSubmitting,
      className: fieldClasses,
      value: formData[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleFieldChange(field.id, e.target.value)
      }
    }

    return (
      <div key={field.id} className="space-y-2">
        {/* Field Label */}
        <div className="flex items-center justify-between">
          <label
            id={labelId}
            htmlFor={fieldId}
            className={cn(
              'text-sm font-medium',
              hasError && 'text-red-600',
              settings.highContrast && 'font-bold'
            )}
          >
            {field.label}
            {field.required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>

          {/* Character count for text inputs */}
          {field.validation?.maxLength && (field.type === 'text' || field.type === 'textarea') && (
            <span className="text-xs text-gray-500" aria-live="polite">
              {(formData[field.id] || '').length} / {field.validation.maxLength}
            </span>
          )}
        </div>

        {/* Field Input */}
        {field.type === 'textarea' && (
          <textarea
            {...inputProps}
            rows={4}
            placeholder={field.placeholder}
            maxLength={field.validation?.maxLength}
          />
        )}

        {field.type === 'select' && (
          <select {...inputProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'checkbox' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={fieldId}
              checked={!!formData[field.id]}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className={cn(
                'w-5 h-5 text-blue-600 border-gray-300 rounded',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.highContrast && 'border-2 border-black'
              )}
              aria-describedby={cn(
                field.helpText && helpId,
                hasError && errorId
              ) || undefined}
              aria-required={field.required}
            />
            <label htmlFor={fieldId} className="text-sm">
              {field.placeholder || field.label}
            </label>
          </div>
        )}

        {field.type !== 'textarea' && field.type !== 'select' && field.type !== 'checkbox' && (
          <input
            type={field.type}
            {...inputProps}
            placeholder={field.placeholder}
            maxLength={field.validation?.maxLength}
            minLength={field.validation?.minLength}
            pattern={field.validation?.pattern?.source}
            autoComplete={field.autoComplete}
          />
        )}

        {/* Help Text */}
        {field.helpText && (
          <div id={helpId} className="text-xs text-gray-600">
            {field.helpText}
          </div>
        )}

        {/* Error Messages */}
        {hasError && (
          <div
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {errors[field.id].map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      {/* Progress Indicator */}
      {showProgressIndicator && (
        <div className="mb-6" role="status" aria-live="polite">
          <div className="text-sm text-gray-600 mb-2">
            Form Progress
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(fields.filter(field => formData[field.id]).length / fields.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          className="bg-red-50 border border-red-200 rounded-md p-4"
          role="alert"
          aria-labelledby="error-summary-title"
          tabIndex={-1}
        >
          <h3 id="error-summary-title" className="text-red-800 font-medium mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([fieldId, fieldErrors]) => {
              const field = fields.find(f => f.id === fieldId)
              return (
                <li key={fieldId} className="text-red-700">
                  <a
                    href={`#${fieldId}`}
                    className="underline hover:no-underline"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(fieldId)?.focus()
                    }}
                  >
                    {field?.label || fieldId}: {fieldErrors.join(', ')}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Form Fields */}
      <fieldset aria-label={fieldsetLegend}>
        {fieldsetLegend && (
          <legend className="text-lg font-medium mb-4">{fieldsetLegend}</legend>
        )}

        <div className="space-y-4">
          {fields.map(renderField)}
        </div>
      </fieldset>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full px-4 py-3 text-base font-medium rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[48px] min-w-[44px]', // Touch-friendly target
            submitButtonVariant === 'primary' && [
              'bg-blue-600 text-white',
              'hover:bg-blue-700',
              'focus:ring-blue-500'
            ],
            submitButtonVariant === 'secondary' && [
              'bg-gray-200 text-gray-900',
              'hover:bg-gray-300',
              'focus:ring-gray-500'
            ],
            settings.highContrast && 'border-2 border-black bg-white text-black hover:bg-gray-100'
          )}
          aria-describedby={submitStatus !== 'idle' ? 'submit-status' : undefined}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            submitButtonText
          )}
        </button>

        {/* Submit Status */}
        {submitStatus !== 'idle' && (
          <div
            id="submit-status"
            className={cn(
              'mt-2 text-sm',
              submitStatus === 'success' && 'text-green-600',
              submitStatus === 'error' && 'text-red-600'
            )}
            role="status"
            aria-live="polite"
          >
            {submitStatus === 'success' && 'Form submitted successfully!'}
            {submitStatus === 'error' && 'Submission failed. Please try again.'}
          </div>
        )}
      </div>
    </form>
  )
}

export default AccessibleForm
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PremiumTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Textarea label text */
  label: string
  /** Error message to display */
  error?: string
  /** Success state indicator */
  isValid?: boolean
  /** Show validation state */
  showValidation?: boolean
  /** Helper text displayed below textarea */
  helperText?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Maximum character count */
  maxLength?: number
  /** Show character counter */
  showCharCount?: boolean
  /** Auto-expand as user types */
  autoExpand?: boolean
  /** Minimum height in rows */
  minRows?: number
  /** Maximum height in rows */
  maxRows?: number
  /** Loading state for async validation */
  isLoading?: boolean
  /** Container className */
  containerClassName?: string
}

/**
 * Premium textarea component with auto-expanding, character counter, and inline validation.
 *
 * Features:
 * - Floating label animation on focus/value
 * - Auto-expanding height based on content
 * - Character counter with visual warning at 90%
 * - Inline validation with success/error states
 * - Loading state for async validation
 * - WCAG 2.1 AAA compliant
 * - Smooth transitions with Framer Motion
 *
 * @example
 * ```tsx
 * <PremiumTextarea
 *   label="Project Description"
 *   placeholder="Tell us about your project..."
 *   maxLength={500}
 *   showCharCount
 *   autoExpand
 *   minRows={4}
 *   maxRows={10}
 *   error={errors.description}
 * />
 * ```
 */
export const PremiumTextarea = React.forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  (
    {
      label,
      error,
      isValid,
      showValidation = true,
      helperText,
      size = "md",
      maxLength,
      showCharCount = false,
      autoExpand = true,
      minRows = 3,
      maxRows = 10,
      isLoading,
      containerClassName,
      className,
      id,
      disabled,
      required,
      value = "",
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value)
    const [currentLength, setCurrentLength] = React.useState(
      typeof value === "string" ? value.length : 0
    )
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const counterId = `${inputId}-counter`

    // Track if textarea has value for floating label
    React.useEffect(() => {
      setHasValue(!!value && String(value).length > 0)
      setCurrentLength(typeof value === "string" ? value.length : 0)
    }, [value])

    // Auto-expand functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoExpand) return

      // Reset height to auto to get correct scrollHeight
      textarea.style.height = "auto"

      // Calculate line height
      const computedStyle = window.getComputedStyle(textarea)
      const lineHeight = parseFloat(computedStyle.lineHeight)

      // Calculate min and max heights
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      // Set new height within constraints
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [autoExpand, minRows, maxRows])

    // Adjust height on value change
    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setHasValue(!!newValue)
      setCurrentLength(newValue.length)
      onChange?.(e)
      adjustHeight()
    }

    const sizeClasses = {
      sm: "text-sm py-2 px-3",
      md: "text-base py-3 px-3",
      lg: "text-lg py-4 px-4"
    }

    const labelSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }

    const hasError = !!error
    const showSuccess = showValidation && isValid && !hasError && !isFocused && hasValue

    // Character count warning (90% of max)
    const isNearLimit = maxLength && currentLength >= maxLength * 0.9
    const isAtLimit = maxLength && currentLength >= maxLength

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {/* Textarea Container */}
        <div className="relative">
          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 top-3 pointer-events-none transition-all duration-200 ease-out z-10",
              "text-stone-600 dark:text-stone-400",
              labelSizeClasses[size],
              isFocused || hasValue
                ? "scale-90 text-copper-600 dark:text-copper-400 -translate-y-6"
                : "",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            animate={{
              y: isFocused || hasValue ? -8 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </motion.label>

          {/* Textarea Field */}
          <textarea
            ref={(node) => {
              textareaRef.current = node
              if (typeof ref === "function") {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
            }}
            id={inputId}
            value={value}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={minRows}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId,
              showCharCount && counterId
            )}
            aria-required={required}
            className={cn(
              // Base styles
              "w-full rounded-lg border bg-white dark:bg-charcoal-800",
              "pt-8 outline-none transition-all duration-200 ease-out resize-none",
              "text-charcoal-900 dark:text-cream-50",
              "placeholder:text-stone-400 dark:placeholder:text-stone-500",
              sizeClasses[size],

              // Border and ring states
              "border-stone-300 dark:border-stone-600",
              !hasError && !isFocused && "hover:border-stone-400 dark:hover:border-stone-500",

              // Focus state
              isFocused && !hasError && [
                "border-copper-500 dark:border-copper-400",
                "ring-4 ring-copper-100 dark:ring-copper-900/30",
                "shadow-sm"
              ],

              // Success state
              showSuccess && [
                "border-success-500 dark:border-success-400",
                "ring-4 ring-success-100 dark:ring-success-900/30"
              ],

              // Error state
              hasError && [
                "border-error-500 dark:border-error-400",
                "ring-4 ring-error-100 dark:ring-error-900/30"
              ],

              // Disabled state
              disabled && "opacity-60 cursor-not-allowed bg-stone-50 dark:bg-charcoal-900",

              // Character limit warning
              isNearLimit && !hasError && "border-warning-500 dark:border-warning-400",

              className
            )}
            style={{
              minHeight: autoExpand ? `${minRows * 1.5}rem` : undefined,
            }}
            {...props}
          />

          {/* Status Icons */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {/* Loading Spinner */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-copper-500"
                >
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Icon */}
            <AnimatePresence>
              {showSuccess && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 text-success-600 dark:text-success-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Icon */}
            <AnimatePresence>
              {hasError && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Character Counter */}
        {showCharCount && maxLength && (
          <motion.div
            id={counterId}
            className={cn(
              "mt-2 text-sm text-right transition-colors duration-200",
              isAtLimit
                ? "text-error-600 dark:text-error-400 font-medium"
                : isNearLimit
                  ? "text-warning-600 dark:text-warning-400"
                  : "text-stone-600 dark:text-stone-400"
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className={cn(isAtLimit && "font-bold")}>
              {currentLength}
            </span>
            <span className="mx-1">/</span>
            <span>{maxLength}</span>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-start gap-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-stone-600 dark:text-stone-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

PremiumTextarea.displayName = "PremiumTextarea"

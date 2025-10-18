"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface FloatingTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  success?: string
  helperText?: string
  maxLength?: number
  autoResize?: boolean
  minRows?: number
  maxRows?: number
}

const FloatingTextArea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingTextAreaProps
>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      maxLength,
      autoResize = true,
      minRows = 3,
      maxRows = 10,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const [charCount, setCharCount] = React.useState(0)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Combine refs
    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement
    )

    const isFloating = isFocused || hasValue

    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // Reset height to auto to get proper scrollHeight
      textarea.style.height = "auto"

      // Calculate line height and heights
      const lineHeight = parseInt(
        window.getComputedStyle(textarea).lineHeight || "24"
      )
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      // Set new height within bounds
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      )
      textarea.style.height = `${newHeight}px`
    }, [autoResize, minRows, maxRows])

    // Adjust height on mount and value change
    React.useEffect(() => {
      adjustHeight()
    }, [props.value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setHasValue(value.length > 0)
      setCharCount(value.length)
      adjustHeight()
      props.onChange?.(e)
    }

    return (
      <div className="relative w-full">
        {/* TextArea Container */}
        <div
          className={cn(
            "relative",
            "bg-white border-b-2 transition-all duration-300",
            error
              ? "border-red-500"
              : success
                ? "border-green-500"
                : isFocused
                  ? "border-slate-900"
                  : "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
        >
          {/* TextArea */}
          <textarea
            ref={textareaRef}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              "w-full bg-transparent px-0 pt-6 pb-2 text-base font-light text-slate-900",
              "outline-none transition-all duration-300 resize-none",
              "placeholder:text-transparent",
              disabled && "cursor-not-allowed",
              className
            )}
            style={{
              minHeight: `${24 * minRows}px`,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />

          {/* Floating Label */}
          <motion.label
            htmlFor={props.id}
            className={cn(
              "absolute left-0 pointer-events-none",
              "text-slate-600 font-light transition-all duration-300 origin-left",
              disabled && "cursor-not-allowed"
            )}
            animate={{
              y: isFloating ? -24 : -12,
              scale: isFloating ? 0.85 : 1,
              color: error
                ? "#ef4444"
                : success
                  ? "#22c55e"
                  : isFocused
                    ? "#0f172a"
                    : "#64748b",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
          </motion.label>

          {/* Status Icons */}
          <div className="absolute right-0 top-6 flex items-center gap-2">
            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}

            {success && !error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Helper Text and Character Count Row */}
        <div className="flex items-center justify-between mt-1.5">
          {/* Helper/Error/Success Text */}
          <AnimatePresence mode="wait">
            {(error || success || helperText) && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-sm font-light",
                  error
                    ? "text-red-500"
                    : success
                      ? "text-green-500"
                      : "text-slate-500"
                )}
              >
                {error || success || helperText}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Character Counter */}
          {maxLength && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 1 : 0.5 }}
              className={cn(
                "text-sm font-light tabular-nums transition-colors",
                charCount > maxLength * 0.9
                  ? "text-amber-500"
                  : charCount === maxLength
                    ? "text-red-500"
                    : "text-slate-400"
              )}
            >
              {charCount}/{maxLength}
            </motion.span>
          )}
        </div>

        {/* Focus Indicator Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-slate-900"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    )
  }
)

FloatingTextArea.displayName = "FloatingTextArea"

export { FloatingTextArea }

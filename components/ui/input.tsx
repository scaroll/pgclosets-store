import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple-grade Input Component
 *
 * Design principles:
 * - 44px minimum height (WCAG touch target)
 * - Clean focus states
 * - Consistent border radius (12px)
 * - Proper placeholder contrast
 */

const inputVariants = cva(
  [
    // Base styles
    "flex w-full min-w-0",
    "rounded-[var(--radius)] border border-input",
    "bg-background px-4 py-3",
    "text-base text-foreground",
    "placeholder:text-muted-foreground",
    // Transitions
    "transition-[border-color,box-shadow] duration-150",
    // Focus
    "outline-none",
    "focus:border-ring focus:ring-[3px] focus:ring-ring/10",
    // Disabled
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    // File inputs
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    // Selection
    "selection:bg-primary/20",
  ],
  {
    variants: {
      variant: {
        default: "",
        // Ghost - minimal borders
        ghost: [
          "border-transparent bg-muted/50",
          "focus:bg-background focus:border-ring",
        ],
        // Underline - material style
        underline: [
          "rounded-none border-0 border-b-2 border-muted",
          "px-0 focus:border-ring focus:ring-0",
        ],
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        default: "h-11",
        lg: "h-[52px] px-5 text-lg",
      },
      state: {
        default: "",
        error: [
          "border-destructive",
          "focus:border-destructive focus:ring-destructive/10",
        ],
        success: [
          "border-success",
          "focus:border-success focus:ring-success/10",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, state, error, ...props }, ref) => {
    // Map error prop to state
    const effectiveState = error ? "error" : state

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ variant, inputSize, state: effectiveState }),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Textarea component
const textareaVariants = cva(
  [
    "flex w-full min-w-0",
    "rounded-[var(--radius)] border border-input",
    "bg-background px-4 py-3",
    "text-base text-foreground",
    "placeholder:text-muted-foreground",
    "transition-[border-color,box-shadow] duration-150",
    "outline-none",
    "focus:border-ring focus:ring-[3px] focus:ring-ring/10",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    "resize-y min-h-[100px]",
  ],
  {
    variants: {
      state: {
        default: "",
        error: [
          "border-destructive",
          "focus:border-destructive focus:ring-destructive/10",
        ],
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, error, ...props }, ref) => {
    const effectiveState = error ? "error" : state

    return (
      <textarea
        data-slot="textarea"
        className={cn(textareaVariants({ state: effectiveState }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// Label component
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean
  }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    data-slot="label"
    className={cn(
      "text-sm font-medium text-foreground leading-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-1">*</span>}
  </label>
))
Label.displayName = "Label"

// Helper text component
const HelperText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    error?: boolean
  }
>(({ className, error, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="helper-text"
    className={cn(
      "text-[0.8125rem] mt-2",
      error ? "text-destructive" : "text-muted-foreground",
      className
    )}
    {...props}
  />
))
HelperText.displayName = "HelperText"

// Form field wrapper
const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="form-field"
    className={cn("space-y-2", className)}
    {...props}
  />
))
FormField.displayName = "FormField"

export { Input, Textarea, Label, HelperText, FormField, inputVariants, textareaVariants }

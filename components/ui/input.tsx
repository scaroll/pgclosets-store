import * as React from "react"
import { cva } from "@/lib/utils"
import { cn } from "@/lib/utils"

/**
 * Valid HTML input types supported by the Input component
 */
export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "file"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-&lsqb;color,box-shadow,border-color&rsqb; outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-&lsqb;3px&rsqb; aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
        brand: "border-primary/30 focus-visible:border-primary focus-visible:ring-primary/20 hover:border-primary/50",
        ghost: "border-transparent bg-muted/30 focus-visible:bg-background focus-visible:border-primary",
        underline:
          "border-0 border-b-2 border-muted-foreground/30 rounded-none focus-visible:border-primary focus-visible:ring-0 px-0",
      },
      size: {
        sm: "h-8 text-sm px-2",
        default: "h-9",
        lg: "h-11 px-4 text-base",
        xl: "h-12 px-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Input type - if invalid type provided, defaults to "text" */
  type?: InputType
  /** Visual variant style */
  variant?: "default" | "brand" | "ghost" | "underline"
  /** Size variant */
  size?: "sm" | "default" | "lg" | "xl"
}

/**
 * Input component with support for variants and sizes.
 * Supports all standard HTML input types and includes custom styling variants.
 * 
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   variant="brand"
 *   size="lg"
 *   placeholder="Enter your name"
 *   aria-label="Name input"
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        data-slot="input"
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input, inputVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple-grade Button Component
 *
 * Design principles:
 * - 44px minimum touch target (WCAG compliant)
 * - Subtle hover lift with shadow
 * - Consistent border radius (12px default)
 * - Premium micro-interactions
 */

const buttonVariants = cva(
  // Base styles - Apple-grade defaults
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium text-[0.9375rem] leading-none",
    "rounded-[var(--radius)] whitespace-nowrap",
    "transition-all duration-200",
    "outline-none select-none cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        // Primary - Deep navy with premium hover
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:-translate-y-px",
          "hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.25)]",
          "active:translate-y-0 active:shadow-sm",
        ],
        // Secondary - Outlined, subtle
        secondary: [
          "bg-secondary text-secondary-foreground",
          "border border-border",
          "hover:bg-muted hover:border-foreground/20",
        ],
        // Accent - Gold, premium feel
        accent: [
          "bg-accent text-accent-foreground",
          "hover:bg-accent/90 hover:-translate-y-px",
          "hover:shadow-[0_4px_14px_0_hsl(var(--accent)/0.35)]",
          "active:translate-y-0",
        ],
        // Destructive - Error/delete actions
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "hover:shadow-[0_4px_14px_0_hsl(var(--destructive)/0.25)]",
        ],
        // Outline - Bordered, transparent bg
        outline: [
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground",
        ],
        // Ghost - Minimal, no border
        ghost: [
          "hover:bg-muted hover:text-foreground",
        ],
        // Link - Text only with underline
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:decoration-2",
          "p-0 h-auto",
        ],
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem] rounded-[var(--radius-sm)]",
        default: "h-11 px-5",
        lg: "h-[52px] px-6 text-base rounded-[var(--radius-lg)]",
        xl: "h-14 px-8 text-lg rounded-[var(--radius-lg)]",
        icon: "h-11 w-11 p-0",
        "icon-sm": "h-9 w-9 p-0",
        "icon-lg": "h-[52px] w-[52px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, loading, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
    )

    const content = (
      <>
        {loading && <LoadingSpinner />}
        {children}
      </>
    )

    // Render as anchor if href provided
    if (href && !isDisabled) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import React from "react"
import { cva, type VariantProps } from "@/lib/utils"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-pg-text-primary placeholder:text-pg-text-muted selection:bg-pg-button-primary selection:text-white border-pg-button-secondary flex w-full min-w-0 rounded-lg border-2 bg-white px-3 py-2 text-base shadow-xs transition-&lsqb;color,box-shadow,border-color&rsqb; outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-pg-button-primary focus-visible:ring-pg-sky focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-pg-status-error/20 aria-invalid:border-pg-status-error min-h-&lsqb;44px&rsqb;",
  {
    variants: {
      variant: {
        default: "",
        brand: "border-pg-button-primary/30 focus-visible:border-pg-button-primary focus-visible:ring-pg-sky hover:border-pg-button-primary/50",
        ghost: "border-transparent bg-slate-100 focus-visible:bg-white focus-visible:border-pg-button-primary",
        underline:
          "border-0 border-b-2 border-pg-text-muted rounded-none focus-visible:border-pg-button-primary focus-visible:ring-0 px-0",
      },
      size: {
        sm: "h-10 text-sm px-2 min-h-&lsqb;44px&rsqb;",
        default: "h-11 min-h-&lsqb;44px&rsqb;",
        lg: "h-12 px-4 text-base min-h-&lsqb;44px&rsqb;",
        xl: "h-14 px-4 text-lg min-h-&lsqb;44px&rsqb;",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & VariantProps<typeof inputVariants>>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input, inputVariants }

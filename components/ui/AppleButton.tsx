"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const appleButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#0071e3] text-white hover:bg-[#0077ed] active:bg-[#006edb]",
        secondary: "border-2 border-[#0071e3] bg-transparent text-[#0071e3] hover:bg-[#0071e3] hover:text-white",
        ghost: "text-[#0071e3] hover:bg-[#0071e3]/10",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface AppleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appleButtonVariants> {
  asChild?: boolean
}

const AppleButton = React.forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(appleButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
AppleButton.displayName = "AppleButton"

export { AppleButton, appleButtonVariants }

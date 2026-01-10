import React from "react"
import Link from "next/link"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-pg-sky focus-visible:ring-offset-2 cursor-pointer select-none min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-pg-text-primary text-white shadow-sm hover:bg-pg-button-primary-hover",
        destructive: "bg-pg-status-error text-white shadow-sm hover:bg-red-700",
        outline: "border-2 border-pg-text-primary bg-white text-pg-text-primary shadow-sm hover:bg-pg-text-primary hover:text-white",
        secondary: "bg-pg-button-secondary text-white shadow-sm hover:bg-pg-button-secondary-hover",
        ghost: "text-pg-text-primary hover:bg-slate-100 hover:text-pg-text-primary",
        link: "text-pg-link underline-offset-4 hover:underline hover:text-pg-link-hover",
        primary:
          "bg-pg-button-primary text-white hover:bg-pg-button-primary-hover hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-lg",
        "brand-primary":
          "bg-pg-button-primary text-white hover:bg-pg-button-primary-hover shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-secondary":
          "bg-pg-button-secondary text-white hover:bg-pg-button-secondary-hover shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-outline":
          "border-2 border-pg-button-primary text-pg-button-primary hover:bg-pg-button-primary hover:text-white bg-transparent shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-ghost":
          "text-pg-button-primary hover:bg-slate-100 hover:text-pg-button-primary transition-all duration-200 hover:scale-105 font-medium",
      },
      size: {
        sm: "h-10 px-3 py-1.5 text-sm min-h-[44px]",
        default: "h-11 px-4 py-2 text-sm min-h-[44px]",
        lg: "h-12 px-6 py-3 text-base min-h-[44px]",
        xl: "h-14 px-8 py-4 text-lg min-h-[44px]",
        icon: "h-11 w-11 p-0 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-11 w-11 p-0 min-h-[44px] min-w-[44px]",
        "icon-lg": "h-12 w-12 p-0 min-h-[44px] min-w-[44px]",
        "icon-xl": "h-14 w-14 p-0 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild = false, href, ...props }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }))

    if (href) {
      // Check if it's an internal link (starts with /) or external link
      const isInternalLink = href.startsWith('/')
      const isAnchorLink = href.startsWith('#')

      if (isInternalLink && !isAnchorLink) {
        return (
          <Link href={href} className={buttonClasses} {...(props as any)}>
            {props.children}
          </Link>
        )
      }

      return (
        <a
          href={href}
          className={buttonClasses}
          {...(!isInternalLink && !isAnchorLink ? { rel: "noopener noreferrer" } : {})}
          {...(props as any)}
        >
          {props.children}
        </a>
      )
    }

    return <button className={buttonClasses} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

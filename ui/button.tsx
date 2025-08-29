import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border border-slate-300 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        primary:
          "bg-pg-navy text-white hover:bg-[#1e3461] hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-lg",
        "brand-primary":
          "bg-navy-900 text-white hover:bg-navy-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-secondary":
          "bg-sky-500 text-white hover:bg-sky-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-outline":
          "border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white bg-transparent shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold",
        "brand-ghost":
          "text-navy-900 hover:bg-navy-100 hover:text-navy-900 transition-all duration-200 hover:scale-105 font-medium",
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-4 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
        "icon-xl": "h-14 w-14 p-0",
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
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }))

    if (href) {
      return (
        <a href={href} className={buttonClasses} {...(props as any)}>
          {props.children}
        </a>
      )
    }

    return <button className={buttonClasses} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

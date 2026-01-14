import React from "react"

// Simplified button component without class-variance-authority dependency
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
  size?: "sm" | "default" | "lg" | "xl" | "icon"
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, href, ...props }, ref) => {
    // Base classes
    let classes =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer select-none"

    // Size classes
    const sizeClasses: Record<string, string> = {
      sm: "h-8 px-3 py-1.5 text-xs",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 py-3 text-base",
      xl: "h-14 px-8 py-4 text-lg",
      icon: "h-10 w-10 p-0",
    }

    // Variant classes
    const variantClasses: Record<string, string> = {
      default: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      outline: "border border-slate-300 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900",
      secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
      primary: "bg-blue-900 text-white hover:bg-blue-800 shadow-sm hover:shadow-lg",
    }

    classes += ` ${sizeClasses[size] || sizeClasses.default}`
    classes += ` ${variantClasses[variant] || variantClasses.default}`
    classes += ` ${className}`

    if (href) {
      return (
        <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {props.children}
        </a>
      )
    }

    return <button className={classes} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }

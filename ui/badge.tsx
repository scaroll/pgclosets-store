import type * as React from "react"

const badgeVariants = {
  variant: {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border-border",
    "brand-primary": "bg-navy-900/10 text-navy-900 border-navy-900/20 hover:bg-navy-900/20",
    "brand-accent": "bg-sky-500/20 text-navy-900 border-sky-500/30 hover:bg-sky-500/30",
    "brand-gradient":
      "bg-gradient-to-r from-navy-900 to-sky-500 text-white border-0 shadow-md hover:scale-105 transform transition-all duration-300",
    success: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
  size: {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  },
}

type BadgeVariant = keyof typeof badgeVariants.variant
type BadgeSize = keyof typeof badgeVariants.size

interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: BadgeVariant
  size?: BadgeSize
}

function getBadgeClasses(variant: BadgeVariant = "default", size: BadgeSize = "default", className?: string): string {
  const baseClasses =
    "inline-flex items-center rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses = badgeVariants.variant[variant]
  const sizeClasses = badgeVariants.size[size]

  const allClasses = [baseClasses, variantClasses, sizeClasses, className].filter(Boolean).join(" ")
  return allClasses
}

function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  const badgeClasses = getBadgeClasses(variant, size, className)
  return <div className={badgeClasses} {...props} />
}

export { Badge, badgeVariants }

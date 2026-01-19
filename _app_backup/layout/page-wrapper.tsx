import type { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  variant?: "default" | "centered" | "full-width"
  className?: string
}

export function PageWrapper({ children, variant = "default", className = "" }: PageWrapperProps) {
  const baseClasses = "min-h-screen bg-background"

  const variantClasses = {
    default: "",
    centered: "flex items-center justify-center",
    "full-width": "w-full",
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>
}

import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

export function PageContainer({ children, size = "xl", className = "" }: PageContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
  }

  return <div className={`${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

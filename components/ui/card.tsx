import React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "premium" | "interactive" | "gradient" | "outline"
  spacing?: "none" | "sm" | "default" | "lg" | "xl"
  href?: string
  onClick?: () => void
  children?: React.ReactNode
}

// Spacing map for Tailwind padding
const spacingMap = {
  none: "p-0",
  sm: "p-2",
  default: "p-4",
  lg: "p-6",
  xl: "p-8"
} as const;

function Card({ className, variant = "default", spacing = "default", href, onClick, children, ...props }: CardProps) {
  // Map variant classes using Tailwind + Apple Design System
  const variantClasses = cn(
    // Base card styles with Apple design system
    "rounded-xl border bg-white transition-all duration-300",
    variant === "default" && "border-gray-200 shadow-sm",
    variant === "elevated" && "border-gray-200 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl",
    variant === "premium" && "border-2 border-blue-600 bg-gradient-to-br from-white to-gray-50 shadow-md",
    variant === "interactive" && "cursor-pointer border-gray-200 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-blue-600 transform-gpu",
    variant === "gradient" && "border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-md",
    variant === "outline" && "border-2 border-gray-300 bg-transparent hover:border-blue-600 hover:shadow-sm",
    spacingMap[spacing]
  );

  const Component = href ? "a" : "div";

  return (
    <Component
      data-slot="card"
      href={href}
      onClick={onClick}
      className={cn(
        "flex flex-col gap-6",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-2xl font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("[&:has(>*:first-child)]:pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }

import React from "react"
import { Card as OnceCard } from "@once-ui-system/core/components"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "premium" | "interactive" | "gradient" | "outline"
  spacing?: "none" | "sm" | "default" | "lg" | "xl"
  href?: string
  onClick?: () => void
  children?: React.ReactNode
}

// Spacing map for Once UI Card
const spacingMap = {
  none: "0",
  sm: "8",
  default: "16",
  lg: "24",
  xl: "32"
} as const;

function Card({ className, variant = "default", spacing = "default", href, onClick, children, ...props }: CardProps) {
  // Map variant classes to Once UI compatible styles
  const variantClasses = cn(
    variant === "elevated" && "hover:transform hover:-translate-y-1 shadow-lg",
    variant === "premium" && "border-2 bg-gradient-to-br from-white to-gray-50",
    variant === "interactive" && "cursor-pointer hover:shadow-md hover:scale-[1.02] transform-gpu",
    variant === "gradient" && "bg-gradient-to-br from-blue-50 to-indigo-50 border-0",
    variant === "outline" && "border-2 border-primary/20 bg-transparent hover:border-primary/40"
  );

  return (
    <OnceCard
      data-slot="card"
      href={href}
      onClick={onClick}
      padding={spacingMap[spacing]}
      radius="l"
      border="neutral-medium"
      fillHeight={false}
      className={cn(
        "flex flex-col gap-6 transition-all duration-300",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </OnceCard>
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
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
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

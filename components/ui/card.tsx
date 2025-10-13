import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "py-6",
        elevated: "card-brand-elevated hover:transform hover:-translate-y-1",
        premium: "card-brand-premium",
        interactive: "hover:shadow-brand-medium cursor-pointer hover:scale-[1.02] transform-gpu",
        gradient: "bg-brand-gradient-card border-0",
        outline: "border-2 border-primary/20 bg-transparent hover:border-primary/40"
      },
      spacing: {
        none: "p-0",
        sm: "p-4",
        default: "py-6",
        lg: "p-8",
        xl: "p-10"
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
    },
  }
)

interface CardProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {}

function Card({ className, variant, spacing, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, spacing }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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
      className={cn("px-6 [&:has(>*:first-child)]:pt-0 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-4 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }

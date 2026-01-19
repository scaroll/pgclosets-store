import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface TypographyProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Display({ children, className, as: Component = "h1" }: TypographyProps) {
  return <Component className={cn("text-display text-foreground", className)}>{children}</Component>
}

export function H1({ children, className, as: Component = "h1" }: TypographyProps) {
  return <Component className={cn("text-h1 text-foreground", className)}>{children}</Component>
}

export function H2({ children, className, as: Component = "h2" }: TypographyProps) {
  return <Component className={cn("text-h2 text-foreground", className)}>{children}</Component>
}

export function H3({ children, className, as: Component = "h3" }: TypographyProps) {
  return <Component className={cn("text-h3 text-foreground", className)}>{children}</Component>
}

export function H4({ children, className, as: Component = "h4" }: TypographyProps) {
  return <Component className={cn("text-h4 text-foreground", className)}>{children}</Component>
}

export function H5({ children, className, as: Component = "h5" }: TypographyProps) {
  return <Component className={cn("text-h5 text-foreground", className)}>{children}</Component>
}

export function H6({ children, className, as: Component = "h6" }: TypographyProps) {
  return <Component className={cn("text-h6 text-foreground", className)}>{children}</Component>
}

export function Lead({ children, className, as: Component = "p" }: TypographyProps) {
  return <Component className={cn("text-lead text-muted-foreground", className)}>{children}</Component>
}

export function BodyLarge({ children, className, as: Component = "p" }: TypographyProps) {
  return <Component className={cn("text-body-lg text-foreground", className)}>{children}</Component>
}

export function Body({ children, className, as: Component = "p" }: TypographyProps) {
  return <Component className={cn("text-body text-foreground", className)}>{children}</Component>
}

export function BodySmall({ children, className, as: Component = "p" }: TypographyProps) {
  return <Component className={cn("text-body-sm text-muted-foreground", className)}>{children}</Component>
}

export function Caption({ children, className, as: Component = "span" }: TypographyProps) {
  return <Component className={cn("text-caption text-muted-foreground", className)}>{children}</Component>
}

export function Overline({ children, className, as: Component = "span" }: TypographyProps) {
  return <Component className={cn("text-overline text-muted-foreground", className)}>{children}</Component>
}

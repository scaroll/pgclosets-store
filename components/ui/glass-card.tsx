import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "minimal" | "glow" | "floating"
  gradient?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", gradient = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glassmorphism styles
          "backdrop-blur-lg bg-white/10 border border-white/20",
          "rounded-lg shadow-2xl transition-all duration-300",
          
          // Variant styles
          variant === "default" && "hover:bg-white/15 hover:border-white/30",
          variant === "minimal" && "bg-white/5 border-white/10 backdrop-blur-sm",
          variant === "glow" && "animate-pulse-glow hover:scale-105",
          variant === "floating" && "animate-float hover:animate-none hover:scale-105",
          
          // Gradient border option
          gradient && "bg-gradient-to-br from-white/20 via-white/10 to-white/5",
          gradient && "border-gradient-to-br from-tech-blue-500/30 via-ai-purple-500/30 to-electric-green-500/30",
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-display font-semibold leading-none tracking-tight",
      "bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm font-body text-white/70 leading-relaxed",
      className
    )}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardFooter, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent 
}
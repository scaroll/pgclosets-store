import type React from "react"

// Brand Logo Variations
export const BrandLogoMark = ({ className = "", size = 40 }: { className?: string; size?: number }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <div className="absolute inset-0 bg-brand-gradient-primary rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">PG</span>
    </div>
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-sky rounded-full opacity-80" />
  </div>
)

// Brand Pattern Backgrounds
export const BrandPatternDots = ({ className = "" }: { className?: string }) => (
  <div className={`bg-brand-pattern-dots opacity-30 ${className}`} />
)

export const BrandPatternGrid = ({ className = "" }: { className?: string }) => (
  <div className={`bg-brand-pattern-grid opacity-20 ${className}`} />
)

// Brand Decorative Elements
export const BrandFloatingElement = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => (
  <div className={`animate-brand-float ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
)

// Brand Gradient Text
export const BrandGradientText = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <span className={`bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
)

// Brand Badge
export const BrandBadge = ({
  children,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode
  variant?: "primary" | "accent" | "premium"
  className?: string
}) => {
  const variants = {
    primary: "bg-brand-gradient-primary text-white",
    accent: "bg-brand-gradient-accent text-brand-navy",
    premium: "card-brand-premium bg-white text-brand-navy",
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// Brand Divider
export const BrandDivider = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-gradient-to-r from-transparent via-border to-transparent ${className}`} />
)

// Brand Section Header
export const BrandSectionHeader = ({
  title,
  subtitle,
  className = "",
}: {
  title: string
  subtitle?: string
  className?: string
}) => (
  <div className={`text-center ${className}`}>
    <h2 className="text-brand-heading text-3xl lg:text-4xl text-foreground mb-4">{title}</h2>
    {subtitle && <p className="text-brand-body text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
  </div>
)

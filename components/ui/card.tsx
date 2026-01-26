import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple-grade Card Component
 *
 * Design principles:
 * - Clean, minimal borders
 * - Subtle shadows for depth
 * - Smooth hover transitions
 * - Consistent 16px border radius
 */

const cardVariants = cva(
  [
    "bg-card text-card-foreground",
    "rounded-[var(--radius-lg)] border border-border",
    "overflow-hidden",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        // Default - subtle border
        default: "",
        // Elevated - shadow instead of border
        elevated: [
          "border-transparent",
          "shadow-md",
          "hover:shadow-xl hover:-translate-y-1",
        ],
        // Interactive - clickable card
        interactive: [
          "cursor-pointer",
          "hover:border-border/50 hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-md",
        ],
        // Ghost - no border, subtle bg on hover
        ghost: [
          "border-transparent bg-transparent",
          "hover:bg-muted",
        ],
        // Outline - pronounced border
        outline: [
          "border-2 border-muted",
          "hover:border-primary/30",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-6 pt-0", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Product Card variant for e-commerce
const ProductCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    href?: string
  }
>(({ className, href, children, ...props }, ref) => {
  const Wrapper = href ? "a" : "div"

  return (
    <Wrapper
      ref={ref as React.Ref<HTMLAnchorElement & HTMLDivElement>}
      href={href}
      className={cn(
        "group bg-card rounded-[var(--radius-lg)] overflow-hidden",
        "border border-transparent",
        "transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        href && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Wrapper>
  )
})
ProductCard.displayName = "ProductCard"

const ProductCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "aspect-[4/3] overflow-hidden bg-muted",
      className
    )}
    {...props}
  >
    <div className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]">
      {children}
    </div>
  </div>
))
ProductCardImage.displayName = "ProductCardImage"

const ProductCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5", className)}
    {...props}
  />
))
ProductCardBody.displayName = "ProductCardBody"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ProductCard,
  ProductCardImage,
  ProductCardBody,
  cardVariants,
}

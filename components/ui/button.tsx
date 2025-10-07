import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)]/90",
        primary: "bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)]/90",
        "brand-primary": "bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)]/90",
        secondary:
          "bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
        "brand-secondary":
          "bg-[var(--color-secondary)] text-[var(--color-primary)] border-2 border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90",
        outline:
          "bg-transparent text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)]",
        "brand-outline":
          "bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
        ghost:
          "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] border-2 border-transparent",
        "brand-ghost":
          "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] border-2 border-transparent",
        link: "bg-transparent text-[var(--color-primary)] underline underline-offset-4 border-none h-auto p-0",
        destructive: "bg-red-600 text-white border-2 border-red-600 hover:bg-red-700",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-sm",
        xl: "h-14 px-10 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? "a" : "button";

    return (
      <Comp
        {...(href && !asChild ? { href } : {})}
        ref={ref as any}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

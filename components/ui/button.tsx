import React from "react";
import { Button as OnceButton } from "@once-ui-system/core/components";
import type { ButtonProps as OnceButtonProps } from "@once-ui-system/core/components/Button";
import { cn } from "@/lib/utils";

// Mapping between PG Closets variants and Once UI variants
const variantMap = {
  default: "primary" as const,
  primary: "primary" as const,
  "brand-primary": "primary" as const,
  secondary: "secondary" as const,
  "brand-secondary": "secondary" as const,
  outline: "secondary" as const,
  "brand-outline": "secondary" as const,
  ghost: "tertiary" as const,
  "brand-ghost": "tertiary" as const,
  link: "tertiary" as const,
  destructive: "danger" as const,
};

// Mapping between size variants
const sizeMap = {
  sm: "s" as const,
  default: "m" as const,
  lg: "l" as const,
  xl: "l" as const,
  icon: "m" as const,
};

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
  href?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = "default",
    size = "default",
    href,
    children,
    disabled,
    loading,
    prefixIcon,
    suffixIcon,
    ...props
  }, ref) => {
    // Map variants to Once UI variants
    const onceVariant = variantMap[variant] || "primary";
    const onceSize = sizeMap[size] || "m";

    // Custom styles for brand variants
    const customStyles = cn(
      // Base styles for consistency with existing design
      "uppercase tracking-wide font-medium",
      // Icon-only button styling
      size === "icon" && "aspect-square p-0 min-w-[2.75rem]",
      className
    );

    return (
      <OnceButton
        ref={ref}
        variant={onceVariant}
        size={onceSize}
        href={href}
        disabled={disabled}
        loading={loading}
        className={customStyles}
        fillWidth={false}
        {...props as any}
      >
        {children}
      </OnceButton>
    );
  }
);

Button.displayName = "Button";

// Legacy export for backward compatibility
export const buttonVariants = undefined;

export { Button };

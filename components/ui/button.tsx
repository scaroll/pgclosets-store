import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-3 cursor-pointer select-none uppercase tracking-wider relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-black text-white border-2 border-black hover:bg-white hover:text-black before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100",
        destructive: "bg-red-600 text-white border-2 border-red-600 hover:bg-white hover:text-red-600",
        outline:
          "border-2 border-black bg-transparent text-black hover:bg-black hover:text-white before:absolute before:inset-0 before:bg-black before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100",
        secondary: "bg-gray-100 text-black border-2 border-gray-100 hover:bg-black hover:text-white hover:border-black",
        ghost: "text-black hover:bg-gray-50 border-2 border-transparent",
        link: "text-black underline-offset-4 hover:underline border-none",
        primary:
          "bg-black text-white border-2 border-black hover:bg-white hover:text-black shadow-sm hover:shadow-lg",
        "brand-primary":
          "bg-black text-white border-2 border-black hover:bg-transparent hover:text-black transition-all duration-300",
        "brand-secondary":
          "bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300",
        "brand-outline":
          "border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-all duration-300",
        "brand-ghost":
          "text-black hover:bg-gray-50 transition-all duration-200 border-2 border-transparent",
      },
      size: {
        sm: "h-9 px-4 py-1.5 text-xs",
        default: "h-11 px-6 py-2 text-sm",
        lg: "h-12 px-8 py-3 text-sm",
        xl: "h-14 px-10 py-4 text-base",
        icon: "h-11 w-11 p-0",
        "icon-sm": "h-9 w-9 p-0",
        "icon-lg": "h-12 w-12 p-0",
        "icon-xl": "h-14 w-14 p-0",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild: _asChild = false, href, ...props },
    ref
  ) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }));

    if (href) {
      return (
        <a href={href} className={buttonClasses} {...(props as any)}>
          {props.children}
        </a>
      );
    }

    return <button className={buttonClasses} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

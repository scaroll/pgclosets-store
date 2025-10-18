import React from "react";

export interface BadgeChipProps {
  children: React.ReactNode;
  variant?: "default" | "bestseller" | "inStock" | "new" | "premium" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BadgeChip = ({
  children,
  variant = "default",
  size = "sm",
  className = ""
}: BadgeChipProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    bestseller: "bg-amber-100 text-amber-800",
    inStock: "bg-green-100 text-green-800",
    new: "bg-blue-100 text-blue-800",
    premium: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border border-amber-200",
    success: "bg-green-50 text-green-700 border border-green-200"
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2"
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        font-medium uppercase tracking-wider
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};

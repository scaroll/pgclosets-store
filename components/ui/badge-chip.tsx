import React from "react";

export interface BadgeChipProps {
  children: React.ReactNode;
  variant?: "default" | "bestseller" | "inStock" | "new";
  className?: string;
}

export const BadgeChip = ({
  children,
  variant = "default",
  className = ""
}: BadgeChipProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    bestseller: "bg-amber-100 text-amber-800",
    inStock: "bg-green-100 text-green-800",
    new: "bg-blue-100 text-blue-800"
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium uppercase tracking-wider
        ${variants[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};

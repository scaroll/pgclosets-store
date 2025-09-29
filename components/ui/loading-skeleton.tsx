import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 rounded-md",
        className
      )}
      role="status"
      aria-label="Loading content"
      {...props}
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-300 border-t-pg-button-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Card skeleton for product cards
const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("card-apple p-6 space-y-4", className)} role="status" aria-label="Loading product">
    <Skeleton className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-10 w-full" />
    <span className="sr-only">Loading product information...</span>
  </div>
);

// Enhanced product card skeleton for products page
const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-lg shadow-md overflow-hidden border border-gray-200", className)} role="status" aria-label="Loading product">
    <Skeleton className="aspect-square w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
    <span className="sr-only">Loading product details...</span>
  </div>
);

// Product grid skeleton
const ProductGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 12,
  className
}) => (
  <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} role="status" aria-label="Loading products">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
    <span className="sr-only">Loading product grid...</span>
  </div>
);

// Button loading state
interface LoadingButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      "btn-primary relative",
      isLoading && "opacity-80 cursor-not-allowed",
      className
    )}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...props}
  >
    {isLoading && (
      <LoadingSpinner
        size="sm"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    )}
    <span className={cn(isLoading && "opacity-0")}>
      {children}
    </span>
  </button>
);

// Page loading component
const PageLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "min-h-screen bg-pg-offwhite flex items-center justify-center",
      className
    )}
    role="status"
    aria-label="Loading page"
  >
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-pg-text-secondary">Loading...</p>
    </div>
  </div>
);

// Table row skeleton
const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({
  columns = 4,
  className
}) => (
  <tr className={className} role="status" aria-label="Loading table row">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-2">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
    <span className="sr-only">Loading table data...</span>
  </tr>
);

// Text skeleton for various text lengths
const TextSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)} role="status" aria-label="Loading text">
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          "h-4",
          index === lines - 1 ? "w-3/4" : "w-full"
        )}
      />
    ))}
    <span className="sr-only">Loading text content...</span>
  </div>
);

export {
  Skeleton,
  LoadingSpinner,
  CardSkeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  LoadingButton,
  PageLoading,
  TableRowSkeleton,
  TextSkeleton
};
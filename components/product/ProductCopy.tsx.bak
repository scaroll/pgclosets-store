/**
 * Product Copy Component System
 * Apple-style product descriptions with large feature callouts
 *
 * Features:
 * - Large feature callouts (32-40px)
 * - Short, punchy sentences
 * - Strategic use of white space
 * - Technical specs in organized tables
 * - Emphasis on benefits over features
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProductHeroProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  className?: string;
}

interface FeatureHighlightProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

interface TechSpecsProps {
  specs: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  className?: string;
}

interface ProductBenefitProps {
  headline: string;
  body: string;
  emphasis?: string;
  className?: string;
}

// ============================================================================
// PRODUCT HERO (Main product introduction)
// ============================================================================

export const ProductHero = React.forwardRef<HTMLDivElement, ProductHeroProps>(
  ({ eyebrow, headline, subheadline, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-center max-w-4xl mx-auto space-y-6', className)}
        {...props}
      >
        {/* Eyebrow text */}
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-charcoal-600">
            {eyebrow}
          </p>
        )}

        {/* Main headline - Large and impactful */}
        <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] font-[300] leading-[1.05] tracking-[-0.04em] text-charcoal-900 text-balance">
          {headline}
        </h1>

        {/* Subheadline - Supporting statement */}
        {subheadline && (
          <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] font-[400] leading-[1.2] tracking-[-0.02em] text-charcoal-700 text-balance">
            {subheadline}
          </h2>
        )}

        {/* Description - Concise body copy */}
        {description && (
          <p className="text-[1.125rem] sm:text-[1.25rem] leading-[1.6] text-charcoal-600 max-w-2xl mx-auto text-pretty">
            {description}
          </p>
        )}
      </div>
    );
  }
);

ProductHero.displayName = 'ProductHero';

// ============================================================================
// FEATURE HIGHLIGHT (Large feature callout)
// ============================================================================

export const FeatureHighlight = React.forwardRef<HTMLDivElement, FeatureHighlightProps>(
  ({ title, description, icon, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4', className)}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-stone-100">
            {icon}
          </div>
        )}

        {/* Feature title - Large and bold */}
        <h3 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-[500] leading-[1.1] tracking-[-0.03em] text-charcoal-900 text-balance">
          {title}
        </h3>

        {/* Feature description - Clear and concise */}
        <p className="text-[1.125rem] leading-[1.6] text-charcoal-700 max-w-2xl text-pretty">
          {description}
        </p>
      </div>
    );
  }
);

FeatureHighlight.displayName = 'FeatureHighlight';

// ============================================================================
// PRODUCT BENEFIT (Short, punchy benefit statement)
// ============================================================================

export const ProductBenefit = React.forwardRef<HTMLDivElement, ProductBenefitProps>(
  ({ headline, body, emphasis, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-3', className)}
        {...props}
      >
        {/* Benefit headline */}
        <h4 className="text-[1.5rem] sm:text-[1.75rem] font-[600] leading-[1.2] tracking-[-0.02em] text-charcoal-900">
          {headline}
        </h4>

        {/* Benefit body */}
        <p className="text-[1.0625rem] leading-[1.6] text-charcoal-700">
          {body}
        </p>

        {/* Optional emphasis text */}
        {emphasis && (
          <p className="text-[0.9375rem] font-[500] text-charcoal-600 italic">
            {emphasis}
          </p>
        )}
      </div>
    );
  }
);

ProductBenefit.displayName = 'ProductBenefit';

// ============================================================================
// TECH SPECS TABLE (Organized technical specifications)
// ============================================================================

export const TechSpecs = React.forwardRef<HTMLDivElement, TechSpecsProps>(
  ({ specs, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('divide-y divide-stone-200', className)}
        {...props}
      >
        {specs.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 first:pt-0 last:pb-0"
          >
            {/* Spec label */}
            <dt className="text-[0.9375rem] font-[600] text-charcoal-900">
              {spec.label}
            </dt>

            {/* Spec value */}
            <dd className="sm:col-span-2 space-y-2">
              <p className="text-[1rem] text-charcoal-800">
                {spec.value}
              </p>

              {/* Optional description */}
              {spec.description && (
                <p className="text-[0.9375rem] text-charcoal-600 leading-[1.5]">
                  {spec.description}
                </p>
              )}
            </dd>
          </div>
        ))}
      </div>
    );
  }
);

TechSpecs.displayName = 'TechSpecs';

// ============================================================================
// FEATURE GRID (Multiple feature callouts in a grid)
// ============================================================================

interface FeatureGridProps {
  features: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ features, columns = 3, className, ...props }, ref) => {
    const gridCols = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-12',
          gridCols[columns],
          className
        )}
        {...props}
      >
        {features.map((feature, index) => (
          <div key={index} className="space-y-4">
            {/* Icon */}
            {feature.icon && (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-stone-100">
                {feature.icon}
              </div>
            )}

            {/* Title */}
            <h3 className="text-[1.25rem] font-[600] leading-[1.2] tracking-[-0.01em] text-charcoal-900">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[1rem] leading-[1.6] text-charcoal-700">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    );
  }
);

FeatureGrid.displayName = 'FeatureGrid';

// ============================================================================
// PRODUCT STATEMENT (Bold, single-line statement)
// ============================================================================

interface ProductStatementProps {
  children: React.ReactNode;
  size?: 'medium' | 'large' | 'xlarge';
  className?: string;
}

export const ProductStatement = React.forwardRef<HTMLParagraphElement, ProductStatementProps>(
  ({ children, size = 'large', className, ...props }, ref) => {
    const sizeClasses = {
      medium: 'text-[1.75rem] sm:text-[2rem] md:text-[2.5rem]',
      large: 'text-[2rem] sm:text-[2.5rem] md:text-[3rem]',
      xlarge: 'text-[2.5rem] sm:text-[3rem] md:text-[4rem]',
    };

    return (
      <p
        ref={ref}
        className={cn(
          sizeClasses[size],
          'font-[500] leading-[1.15] tracking-[-0.03em] text-charcoal-900 text-balance',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ProductStatement.displayName = 'ProductStatement';

// ============================================================================
// COMPARISON TABLE (Side-by-side product comparison)
// ============================================================================

interface ComparisonTableProps {
  products: Array<{
    name: string;
    features: Record<string, boolean | string>;
  }>;
  featureLabels: Record<string, string>;
  className?: string;
}

export const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ products, featureLabels, className, ...props }, ref) => {
    const featureKeys = Object.keys(featureLabels);

    return (
      <div
        ref={ref}
        className={cn('overflow-x-auto', className)}
        {...props}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-charcoal-900">
              <th className="text-left py-4 px-4 text-[0.875rem] font-[600] text-charcoal-900 uppercase tracking-wider">
                Features
              </th>
              {products.map((product, index) => (
                <th
                  key={index}
                  className="text-center py-4 px-4 text-[1rem] font-[600] text-charcoal-900"
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {featureKeys.map((key) => (
              <tr key={key}>
                <td className="py-4 px-4 text-[0.9375rem] text-charcoal-800">
                  {featureLabels[key]}
                </td>
                {products.map((product, index) => {
                  const value = product.features[key];
                  return (
                    <td key={index} className="text-center py-4 px-4">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <span className="text-success-600 text-xl">✓</span>
                        ) : (
                          <span className="text-charcoal-300 text-xl">—</span>
                        )
                      ) : (
                        <span className="text-[0.9375rem] text-charcoal-800">{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ComparisonTable.displayName = 'ComparisonTable';

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  ProductHero,
  FeatureHighlight,
  ProductBenefit,
  TechSpecs,
  FeatureGrid,
  ProductStatement,
  ComparisonTable,
};

/**
 * Price formatting utilities for Canadian pricing (CAD)
 */

/**
 * Format a price in CAD currency
 */
export function formatCADPrice(price: number): string {
  if (isNaN(price) || price < 0) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Generic price formatter (same as CAD for now)
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
  if (isNaN(price) || price < 0) {
    return 'Price on request';
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Calculate HST (13% for Ontario)
 */
export function calculateHST(price: number): number {
  return price * 0.13;
}

/**
 * Calculate price with HST included
 */
export function calculatePriceWithHST(price: number): number {
  return price + calculateHST(price);
}

/**
 * Format price range
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatCADPrice(minPrice);
  }

  return `${formatCADPrice(minPrice)} - ${formatCADPrice(maxPrice)}`;
}

/**
 * Calculate savings between original and sale price
 */
export function calculateSavings(originalPrice: number, salePrice: number): {
  amount: number;
  percentage: number;
  formatted: string;
} {
  const amount = originalPrice - salePrice;
  const percentage = (amount / originalPrice) * 100;

  return {
    amount,
    percentage: Math.round(percentage),
    formatted: formatCADPrice(amount),
  };
}

/**
 * Check if a price is considered "sale" pricing (assumes 10% discount minimum)
 */
export function isSalePrice(originalPrice: number, currentPrice: number): boolean {
  const discountPercentage = ((originalPrice - currentPrice) / originalPrice) * 100;
  return discountPercentage >= 10;
}

/**
 * Format compact price (e.g., $1.2K instead of $1,200)
 */
export function formatCompactPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(1)}K`;
  } else {
    return formatCADPrice(price);
  }
}
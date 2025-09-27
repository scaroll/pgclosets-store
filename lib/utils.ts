// shadcn/ui expects cva for class variance authority
import { cva } from "class-variance-authority"
export { cva };
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price in dollars to a currency string.
 * @param price - The price in dollars.
 * @param currency - The currency code (e.g., 'USD', 'CAD').
 * @returns A formatted currency string.
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
  const priceInDollars = typeof price === 'number' ? price : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(priceInDollars);
}

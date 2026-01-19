import { z } from 'zod';

// Common validation schemas

export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format');

export const postalCodeSchema = z
  .string()
  .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code');

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: postalCodeSchema,
  country: z.string().default('Canada'),
});

export const productIdSchema = z.string().min(1, 'Product ID is required');

export const quantitySchema = z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99');

export const cartItemSchema = z.object({
  productId: productIdSchema,
  variantId: z.string().optional(),
  quantity: quantitySchema,
});

export const cartSchema = z.array(cartItemSchema);

// Add to cart schema
export const addToCartSchema = z.object({
  productId: productIdSchema,
  variantId: z.string().optional(),
  quantity: quantitySchema.default(1),
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  quantity: quantitySchema,
});

export const priceSchema = z.number().min(0, 'Price must be non-negative');

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema.optional(),
});

export const reviewSchema = z.object({
  productId: productIdSchema,
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(2000),
});

// Validate data against a schema
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validate and sanitize user input
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 10000); // Limit length
}

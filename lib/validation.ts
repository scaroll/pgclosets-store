import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().int().positive(), // in cents
  salePrice: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().optional(),
  inventory: z.number().int().nonnegative(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  color: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(99), // 0 to remove
});

// Booking schemas
export const createBookingSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string().datetime(),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number format'),
  location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']),
  address: z.string().optional(),
  projectType: z.string().optional(),
  projectDescription: z.string().max(1000).optional(),
  budget: z.number().int().positive().optional(), // in cents
});

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    variantId: z.string().cuid().optional(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddressId: z.string().cuid().optional(),
  billingAddressId: z.string().cuid().optional(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().min(2).max(100).optional(),
  guestPhone: z.string().optional(),
  customerNotes: z.string().max(500).optional(),
});

// Address schemas
export const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  company: z.string().max(100).optional(),
  address1: z.string().min(1).max(200),
  address2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  province: z.enum(['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU']),
  postalCode: z.string().regex(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, 'Invalid Canadian postal code'),
  country: z.literal('CA'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/).optional(),
  isDefault: z.boolean().optional(),
});

// Review schemas
export const createReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  category: z.string().optional(),
  minPrice: z.number().int().positive().optional(),
  maxPrice: z.number().int().positive().optional(),
  inStock: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'newest', 'rating']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// AI Chat schemas
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().optional(),
});

// Payment schemas
export const createPaymentIntentSchema = z.object({
  amount: z.number().int().positive(), // in cents
  currency: z.literal('cad'),
  metadata: z.record(z.string()).optional(),
});

// Email schemas
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?1?\d{10,14}$/).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

// Helper functions for validation
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.errors);
  }
  return result.data;
}

export class ValidationError extends Error {
  constructor(public errors: z.ZodError['errors']) {
    super('Validation failed');
    this.name = 'ValidationError';
  }

  toResponse() {
    return {
      error: 'Validation failed',
      details: this.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }
}

// Type exports for use in components
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
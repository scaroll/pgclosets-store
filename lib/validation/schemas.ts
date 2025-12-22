import { z } from 'zod';

// Common field schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const postalCodeSchema = z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code');

// Address schema
export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: postalCodeSchema,
  country: z.string().default('Canada'),
  phone: phoneSchema.optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(1).max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Quick quote schema - matches LuxuryQuoteForm submission
export const quickQuoteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  projectType: z.string().optional(),
  roomDimensions: z.string().optional(),
  timeline: z.string().optional(),
  productInterest: z.string().optional(),
  additionalDetails: z.string().max(2000).optional(),
  product: z.object({
    name: z.string(),
    price: z.number().optional(),
  }).optional(),
  selectedOptions: z.record(z.string()).optional(),
});

// Booking schema
export const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
  preferredDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  type: z.enum(['MEASURE', 'CONSULTATION', 'INSTALLATION']),
  notes: z.string().max(1000).optional(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().max(100).optional(),
  source: z.string().optional(),
});

// Product review schema
export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(2000),
  name: z.string().min(1).max(100).optional(),
  email: emailSchema.optional(),
});

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
});

// Cart schema
export const cartSchema = z.object({
  items: z.array(cartItemSchema),
});

// Checkout schema
export const checkoutSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  items: z.array(cartItemSchema),
  notes: z.string().max(1000).optional(),
});

// Lead capture schema
export const leadSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  service: z.string().optional(),
  message: z.string().max(2000).optional(),
  source: z.string().optional(),
});

// Search schema
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['relevance', 'price-asc', 'price-desc', 'rating', 'newest']).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// Instant estimate schema
export const instantEstimateSchema = z.object({
  projectType: z.enum(['barn-door', 'closet-system', 'bifold', 'sliding', 'mirror', 'other']),
  width: z.coerce.number().min(12).max(200),
  height: z.coerce.number().min(24).max(120),
  quantity: z.coerce.number().min(1).max(20).default(1),
  material: z.enum(['standard', 'premium', 'luxury']).default('standard'),
  installation: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

// Quote request schema (alias for quickQuoteSchema)
export const quoteRequestSchema = quickQuoteSchema;

// Type exports
export type Address = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type QuickQuote = z.infer<typeof quickQuoteSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type Newsletter = z.infer<typeof newsletterSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type Checkout = z.infer<typeof checkoutSchema>;
export type Lead = z.infer<typeof leadSchema>;
export type Search = z.infer<typeof searchSchema>;
export type InstantEstimate = z.infer<typeof instantEstimateSchema>;
export type QuoteRequestData = QuickQuote;

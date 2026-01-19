import { z } from 'zod'

// Auth schemas
export const signUpSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().int().positive(), // in cents
  inventory: z.number().int().nonnegative(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().min(1).max(99),
})

// Booking schemas
export const createBookingSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string().datetime(),
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().regex(/^\+?1?\d{10,14}$/),
  location: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']),
  projectDescription: z.string().max(1000).optional(),
})

// Order schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingAddressId: z.string().cuid(),
  billingAddressId: z.string().cuid(),
})

// Quote request schemas
export const quoteRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  roomDimensions: z.string().optional(),
  timeline: z.string().optional(),
  productInterest: z.string().optional(),
  product: z
    .object({
      name: z.string(),
      price: z.number().optional(),
    })
    .optional(),
  selectedOptions: z.record(z.string(), z.any()).optional(),
  additionalDetails: z.string().optional(),
})

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>

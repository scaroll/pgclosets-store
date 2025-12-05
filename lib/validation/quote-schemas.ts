import { z } from 'zod';
import { emailSchema, phoneSchema, postalCodeSchema } from './schemas';

/**
 * Quote Validation Schemas
 *
 * Comprehensive validation schemas for quote requests, responses, and updates
 * following the Renin product quoting system.
 */

// Customer Type Enum
export const customerTypeSchema = z.enum(['residential', 'contractor', 'senior'], {
  errorMap: () => ({ message: 'Customer type must be residential, contractor, or senior' }),
});

// Project Type Enum
export const projectTypeSchema = z.enum(['new-construction', 'renovation', 'replacement'], {
  errorMap: () => ({ message: 'Invalid project type' }),
});

// Timeline Enum
export const timelineSchema = z.enum(['immediate', '1-3months', '3-6months', '6plus-months'], {
  errorMap: () => ({ message: 'Invalid timeline' }),
});

// Contact Method Enum
export const contactMethodSchema = z.enum(['email', 'phone', 'both'], {
  errorMap: () => ({ message: 'Contact method must be email, phone, or both' }),
});

// Quote Status Enum
export const quoteStatusSchema = z.enum([
  'pending',
  'submitted',
  'processing',
  'reviewed',
  'quoted',
  'approved',
  'rejected',
  'expired',
  'cancelled',
], {
  errorMap: () => ({ message: 'Invalid quote status' }),
});

// Door Type Enum
export const doorTypeSchema = z.enum([
  'barn-door',
  'sliding',
  'bifold',
  'pocket',
  'french',
  'standard',
  'closet-system',
  'mirror',
  'other',
], {
  errorMap: () => ({ message: 'Invalid door type' }),
});

// Customer Information Schema
export const quoteCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: emailSchema,
  phone: phoneSchema.optional(),
  postalCode: postalCodeSchema,
  customerType: customerTypeSchema.default('residential'),
  company: z.string().max(100).optional(),
});

// Product Quote Item Schema
export const quoteProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  productCategory: z.string().min(1, 'Product category is required'),
  msrpPrice: z.number().min(0, 'Price must be positive'),
  width: z.number().min(12, 'Width must be at least 12 inches').max(200, 'Width cannot exceed 200 inches'),
  height: z.number().min(24, 'Height must be at least 24 inches').max(120, 'Height cannot exceed 120 inches'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50, 'Quantity cannot exceed 50'),
  includeInstallation: z.boolean().default(false),
  doorType: doorTypeSchema.optional(),
  finish: z.string().optional(),
  hardware: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// Project Details Schema
export const projectDetailsSchema = z.object({
  projectType: projectTypeSchema,
  timeline: timelineSchema,
  roomCount: z.number().int().min(1).max(20).optional(),
  budget: z.string().max(50).optional(),
  additionalNotes: z.string().max(2000).optional(),
});

// Quote Request Form Schema
export const quoteRequestSchema = z.object({
  customer: quoteCustomerSchema,
  products: z.array(quoteProductSchema).min(1, 'At least one product is required').max(20),
  includeFinancing: z.boolean().default(false),
  projectDetails: projectDetailsSchema.optional(),
  preferredContactMethod: contactMethodSchema.default('email'),
  hearAboutUs: z.string().max(200).optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  requestedDeliveryDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  specialRequirements: z.string().max(1000).optional(),
});

// Simplified Quick Quote Schema (for contact forms)
export const quickQuoteRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: emailSchema,
  phone: phoneSchema,
  postalCode: postalCodeSchema.optional(),
  projectType: doorTypeSchema,
  roomCount: z.coerce.number().min(1).max(20).optional(),
  budget: z.enum(['under-500', '500-1000', '1000-2500', '2500-5000', 'over-5000']).optional(),
  timeline: z.enum(['asap', '1-month', '3-months', '6-months', 'no-rush']).optional(),
  message: z.string().max(2000).optional(),
  includeInstallation: z.boolean().default(false),
});

// Price Breakdown Schema
export const priceBreakdownSchema = z.object({
  msrp: z.number().min(0),
  markup: z.number().min(0),
  volumeDiscount: z.number().min(0),
  customerDiscount: z.number().min(0),
  installation: z.number().min(0),
  delivery: z.number().min(0),
  hst: z.number().min(0),
  total: z.number().min(0),
});

// Financing Term Schema
export const financingTermSchema = z.object({
  months: z.number().int().min(1),
  interestRate: z.number().min(0).max(1),
  monthlyPayment: z.number().min(0),
  totalAmount: z.number().min(0),
  description: z.string(),
});

// Financing Options Schema
export const financingOptionsSchema = z.object({
  available: z.boolean(),
  terms: z.array(financingTermSchema),
  minAmount: z.number().min(0),
  qualificationNote: z.string().optional(),
});

// Quote Calculation Result Schema
export const quoteCalculationSchema = z.object({
  basePrice: z.number().min(0),
  markedUpPrice: z.number().min(0),
  volumeDiscount: z.number().min(0),
  customerDiscount: z.number().min(0),
  subtotal: z.number().min(0),
  installationCost: z.number().min(0),
  deliveryFee: z.number().min(0),
  subtotalWithServices: z.number().min(0),
  hst: z.number().min(0),
  total: z.number().min(0),
  savings: z.number().min(0),
  breakdown: priceBreakdownSchema,
  financing: financingOptionsSchema.optional(),
});

// Sales Contact Schema
export const salesContactSchema = z.object({
  name: z.string().min(1),
  email: emailSchema,
  phone: phoneSchema.optional(),
  title: z.string().optional(),
});

// Quote Response Schema
export const quoteResponseSchema = z.object({
  success: z.boolean(),
  quoteId: z.string().min(1),
  quoteNumber: z.string().min(1),
  quote: quoteCalculationSchema.optional(),
  estimatedDelivery: z.string().optional(),
  validUntil: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  salesContact: salesContactSchema.optional(),
  nextSteps: z.array(z.string()).optional(),
  status: quoteStatusSchema.default('pending'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Quote Status Update Schema
export const quoteStatusUpdateSchema = z.object({
  quoteId: z.string().min(1, 'Quote ID is required'),
  status: quoteStatusSchema,
  updatedBy: z.string().optional(),
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().max(2000).optional(),
  notifyCustomer: z.boolean().default(true),
  attachments: z.array(z.string()).optional(),
});

// Quote Update Schema (for modifying quote details)
export const quoteUpdateSchema = z.object({
  quoteId: z.string().min(1, 'Quote ID is required'),
  products: z.array(quoteProductSchema).optional(),
  projectDetails: projectDetailsSchema.optional(),
  includeFinancing: z.boolean().optional(),
  validUntil: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  estimatedDelivery: z.string().optional(),
  salesContact: salesContactSchema.optional(),
  nextSteps: z.array(z.string()).optional(),
  internalNotes: z.string().max(2000).optional(),
});

// Quote Search/Filter Schema
export const quoteFilterSchema = z.object({
  status: quoteStatusSchema.optional(),
  customerEmail: emailSchema.optional(),
  customerType: customerTypeSchema.optional(),
  dateFrom: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  dateTo: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  minTotal: z.number().min(0).optional(),
  maxTotal: z.number().min(0).optional(),
  quoteNumber: z.string().optional(),
  productCategory: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'total', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Quote List Response Schema
export const quoteListResponseSchema = z.object({
  success: z.boolean(),
  quotes: z.array(quoteResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
  error: z.string().optional(),
});

// Quote Email Notification Schema
export const quoteEmailNotificationSchema = z.object({
  quoteId: z.string().min(1),
  recipientEmail: emailSchema,
  recipientName: z.string().optional(),
  type: z.enum(['quote_created', 'quote_updated', 'quote_approved', 'quote_rejected', 'quote_expired', 'quote_reminder']),
  customMessage: z.string().max(1000).optional(),
  includeAttachment: z.boolean().default(true),
  ccEmails: z.array(emailSchema).optional(),
});

// Type Exports
export type CustomerType = z.infer<typeof customerTypeSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
export type ContactMethod = z.infer<typeof contactMethodSchema>;
export type QuoteStatus = z.infer<typeof quoteStatusSchema>;
export type DoorType = z.infer<typeof doorTypeSchema>;
export type QuoteCustomer = z.infer<typeof quoteCustomerSchema>;
export type QuoteProduct = z.infer<typeof quoteProductSchema>;
export type ProjectDetails = z.infer<typeof projectDetailsSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type QuickQuoteRequest = z.infer<typeof quickQuoteRequestSchema>;
export type PriceBreakdown = z.infer<typeof priceBreakdownSchema>;
export type FinancingTerm = z.infer<typeof financingTermSchema>;
export type FinancingOptions = z.infer<typeof financingOptionsSchema>;
export type QuoteCalculation = z.infer<typeof quoteCalculationSchema>;
export type SalesContact = z.infer<typeof salesContactSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
export type QuoteStatusUpdate = z.infer<typeof quoteStatusUpdateSchema>;
export type QuoteUpdate = z.infer<typeof quoteUpdateSchema>;
export type QuoteFilter = z.infer<typeof quoteFilterSchema>;
export type QuoteListResponse = z.infer<typeof quoteListResponseSchema>;
export type QuoteEmailNotification = z.infer<typeof quoteEmailNotificationSchema>;

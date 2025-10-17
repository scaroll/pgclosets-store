import { z } from 'zod';

/**
 * AI SDK 5 Schemas for Structured Outputs
 * Using Zod for runtime validation and type safety
 */

// ============================================================================
// Booking Schemas
// ============================================================================

export const BookingSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']).describe(
    'Type of service the customer wants to book'
  ),
  date: z.string().describe('Preferred date in ISO format (YYYY-MM-DD)'),
  time: z.string().optional().describe('Preferred time in 24h format (HH:MM)'),
  customer: z.object({
    name: z.string().describe('Customer full name'),
    email: z.string().email().describe('Customer email address'),
    phone: z.string().describe('Customer phone number'),
  }),
  projectDetails: z.object({
    type: z.string().optional().describe('Type of closet project (e.g., walk-in, reach-in, pantry)'),
    budget: z.number().optional().describe('Budget in CAD'),
    measurements: z.object({
      width: z.number().optional(),
      height: z.number().optional(),
      depth: z.number().optional(),
    }).optional().describe('Closet dimensions in inches'),
    notes: z.string().optional().describe('Additional notes or requirements'),
  }),
  location: z.object({
    city: z.enum(['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']).optional(),
    address: z.string().optional(),
  }).optional(),
});

export type BookingData = z.infer<typeof BookingSchema>;

// ============================================================================
// Product Query Schemas
// ============================================================================

export const ProductQuerySchema = z.object({
  intent: z.enum(['search', 'compare', 'recommend', 'details']).describe(
    'What the customer wants to do with products'
  ),
  category: z.enum([
    'barn-doors',
    'bifold-doors',
    'bypass-doors',
    'pivot-doors',
    'room-dividers',
    'hardware',
    'closet-systems',
    'mirrors'
  ]).optional().describe('Product category'),
  style: z.string().optional().describe('Style preference (e.g., modern, rustic, traditional)'),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional().describe('Budget range in CAD'),
  features: z.array(z.string()).optional().describe('Desired features (e.g., soft-close, frameless)'),
  color: z.string().optional().describe('Color or finish preference'),
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional().describe('Size requirements in inches'),
});

export type ProductQuery = z.infer<typeof ProductQuerySchema>;

// ============================================================================
// Product Recommendation Schema
// ============================================================================

export const ProductRecommendationSchema = z.object({
  productId: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  matchScore: z.number().min(0).max(1).describe('How well this matches customer needs (0-1)'),
  reasoning: z.string().describe('Why this product is recommended'),
  features: z.array(z.string()),
  imageUrl: z.string().optional(),
});

export type ProductRecommendation = z.infer<typeof ProductRecommendationSchema>;

// ============================================================================
// Customer Intent Schema
// ============================================================================

export const CustomerIntentSchema = z.object({
  primaryIntent: z.enum([
    'browse',
    'purchase',
    'book_appointment',
    'get_quote',
    'ask_question',
    'check_status',
    'get_support'
  ]).describe('Main goal of the customer'),
  confidence: z.number().min(0).max(1).describe('Confidence in intent detection (0-1)'),
  urgency: z.enum(['low', 'medium', 'high']).describe('How urgent the customer need is'),
  entities: z.object({
    products: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    dates: z.array(z.string()).optional(),
    budget: z.number().optional(),
  }).optional().describe('Extracted entities from conversation'),
  nextAction: z.string().describe('Recommended next step for the conversation'),
});

export type CustomerIntent = z.infer<typeof CustomerIntentSchema>;

// ============================================================================
// Pricing Calculation Schema
// ============================================================================

export const PricingRequestSchema = z.object({
  productIds: z.array(z.string()).describe('List of product IDs to price'),
  measurements: z.object({
    width: z.number().describe('Width in inches'),
    height: z.number().describe('Height in inches'),
    depth: z.number().optional().describe('Depth in inches'),
  }),
  installation: z.boolean().default(false).describe('Include installation cost'),
  location: z.string().optional().describe('Installation location for pricing adjustments'),
  customizations: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })).optional().describe('Any custom modifications'),
});

export const PricingResponseSchema = z.object({
  subtotal: z.number(),
  installation: z.number().optional(),
  tax: z.number(),
  total: z.number(),
  breakdown: z.array(z.object({
    item: z.string(),
    quantity: z.number(),
    price: z.number(),
    total: z.number(),
  })),
  estimatedDelivery: z.string().optional(),
  notes: z.string().optional(),
});

export type PricingRequest = z.infer<typeof PricingRequestSchema>;
export type PricingResponse = z.infer<typeof PricingResponseSchema>;

// ============================================================================
// Availability Check Schema
// ============================================================================

export const AvailabilityCheckSchema = z.object({
  service: z.enum(['consultation', 'measurement', 'installation']),
  date: z.string().describe('Date to check in ISO format'),
  timePreference: z.enum(['morning', 'afternoon', 'evening']).optional(),
  location: z.string().optional(),
});

export const AvailabilityResponseSchema = z.object({
  available: z.boolean(),
  slots: z.array(z.object({
    time: z.string(),
    duration: z.number(),
    available: z.boolean(),
  })),
  alternativeDates: z.array(z.string()).optional(),
  message: z.string(),
});

export type AvailabilityCheck = z.infer<typeof AvailabilityCheckSchema>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;

// ============================================================================
// Email/Contact Extraction Schema
// ============================================================================

export const ContactExtractionSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'text']).optional(),
  message: z.string(),
  urgency: z.enum(['low', 'medium', 'high']),
  category: z.enum(['inquiry', 'quote', 'support', 'complaint', 'feedback']),
});

export type ContactExtraction = z.infer<typeof ContactExtractionSchema>;

// ============================================================================
// Search Query Schema
// ============================================================================

export const SearchQuerySchema = z.object({
  query: z.string().describe('Original search query'),
  interpreted: z.object({
    category: z.string().optional(),
    style: z.string().optional(),
    color: z.string().optional(),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }).optional(),
    features: z.array(z.string()).optional(),
  }).describe('AI interpretation of the search query'),
  filters: z.array(z.object({
    field: z.string(),
    value: z.any(),
  })),
  sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'newest']).default('relevance'),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// ============================================================================
// Content Generation Schema
// ============================================================================

export const ContentGenerationSchema = z.object({
  type: z.enum(['product-description', 'blog-post', 'email', 'seo-meta']),
  context: z.object({
    product: z.any().optional(),
    topic: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  tone: z.enum(['professional', 'casual', 'persuasive', 'informative']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

export type ContentGeneration = z.infer<typeof ContentGenerationSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate and parse booking data
 */
export function parseBookingData(data: unknown): BookingData {
  return BookingSchema.parse(data);
}

/**
 * Validate and parse product query
 */
export function parseProductQuery(data: unknown): ProductQuery {
  return ProductQuerySchema.parse(data);
}

/**
 * Safe parse with error handling
 */
export function safeParseBooking(data: unknown): {
  success: boolean;
  data?: BookingData;
  error?: string;
} {
  const result = BookingSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: result.error.issues.map(i => i.message).join(', ')
  };
}

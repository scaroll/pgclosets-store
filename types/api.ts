/**
 * API response and request types
 */

import type { Product, Cart } from './commerce';

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Product API types
export interface ProductListResponse extends ApiResponse<{
  products: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface ProductResponse extends ApiResponse<Product> {}

// Cart API types
export interface CartResponse extends ApiResponse<Cart> {}

export interface AddToCartRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

// Payment types
export interface PaymentSessionData {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  provider: string;
  data: Record<string, unknown>;
}

export interface ShippingInfo {
  id: string;
  name: string;
  amount: number;
  description?: string;
  estimated_delivery?: string;
}

export interface PaymentCallback {
  transactionId: string;
  status: 'success' | 'error';
  data?: Record<string, unknown>;
}

// Quote/Request types
export interface QuoteRequest {
  productId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  projectDetails: {
    description: string;
    timeline?: string;
    budget?: string;
  };
  additionalInfo?: string;
}

export interface QuoteResponse extends ApiResponse<{
  quoteId: string;
  status: 'submitted' | 'processing' | 'completed';
}> {}

// Search types
export interface SearchParams {
  q?: string;
  category?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Measurement Booking types
export interface MeasurementBookingRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  booking: {
    preferredDate: string; // ISO date string
    preferredTime: string; // "09:00", "10:00", etc.
    projectDescription: string;
    interestedProducts: string[]; // Array of product IDs
    urgency: 'low' | 'medium' | 'high';
    rooms: {
      roomType: string;
      dimensions?: string;
      notes?: string;
    }[];
  };
  notes?: string;
}

export interface MeasurementBookingResponse extends ApiResponse<{
  bookingId: string;
  confirmationNumber: string;
  scheduledDateTime: string;
  estimatedDuration: number; // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}> {}

export interface TimeSlot {
  time: string; // "09:00", "10:00", etc.
  available: boolean;
  reason?: string; // If not available
}

export interface AvailabilityResponse extends ApiResponse<{
  date: string;
  slots: TimeSlot[];
}> {}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
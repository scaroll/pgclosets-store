/**
 * Quote System Type Definitions
 * Centralized types for quote requests, responses, and form handling
 */

import type { ApiResponse } from './api';

/**
 * Status enum for tracking quote lifecycle
 */
export enum QuoteStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  REVIEWED = 'reviewed',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

/**
 * Customer information for quote requests
 */
export interface QuoteCustomerInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  province?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  preferredContactMethod?: 'email' | 'phone';
  preferredContactTime?: string;
}

/**
 * Product information for quote requests
 */
export interface QuoteProductInfo {
  productId?: string;
  name: string;
  category: string;
  price?: number;
  selectedOptions?: Record<string, string | number>;
  quantity?: number;
}

/**
 * Project details for quote requests
 */
export interface QuoteProjectDetails {
  doorType?: 'barn-door' | 'bifold' | 'bypass' | 'french' | 'pocket' | 'standard' | 'not-sure';
  projectType?: 'closet' | 'room-divider' | 'bathroom' | 'laundry' | 'pantry' | 'other';
  numberOfDoors?: string;
  timeline?: 'asap' | '1-2-weeks' | '1-month' | '2-3-months' | 'flexible';
  budget?: 'under-1000' | '1000-2500' | '2500-5000' | '5000-10000' | 'over-10000' | 'not-sure';
  description?: string;
  measurements?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: 'inches' | 'feet' | 'cm' | 'm';
  };
}

/**
 * Additional preferences for quote requests
 */
export interface QuotePreferences {
  wantsConsultation?: boolean;
  wantsSamples?: boolean;
  interestedInFinancing?: boolean;
}

/**
 * Complete quote request payload
 */
export interface QuoteRequest {
  // Customer information
  customer: QuoteCustomerInfo;

  // Product information
  product?: QuoteProductInfo;

  // Project details
  project?: QuoteProjectDetails;

  // Preferences
  preferences?: QuotePreferences;

  // Additional information
  notes?: string;
  message?: string;

  // Metadata
  source?: string;
  referrer?: string;
}

/**
 * Quote request with system-generated fields
 */
export interface QuoteRequestData extends QuoteRequest {
  quoteId: string;
  quoteNumber?: string;
  status?: QuoteStatus;
  submittedAt: string;
  ipAddress: string;
  userAgent?: string;
}

/**
 * Quote response from API
 */
export interface QuoteResponse extends ApiResponse<{
  quoteId: string;
  quoteNumber: string;
  status: QuoteStatus;
  receivedAt: string;
  estimatedResponseTime?: string;
  persisted?: boolean;
}> {}

/**
 * Form data structure for quote forms
 * Maps HTML form fields to QuoteRequest structure
 */
export interface QuoteFormData {
  // Personal information fields
  name: string;
  email: string;
  phone?: string;
  company?: string;
  city?: string;
  province?: string;

  // Product fields (optional)
  productId?: string;
  productName?: string;

  // Project details fields
  doorType?: string;
  projectType?: string;
  numberOfDoors?: string;
  timeline?: string;
  budget?: string;
  message?: string;

  // Preferences (checkboxes)
  wantsConsultation?: boolean;
  wantsSamples?: boolean;
  interestedInFinancing?: boolean;

  // Additional notes
  additionalInfo?: string;
}

/**
 * Quote item for building multi-item quotes
 */
export interface QuoteItem {
  id: string;
  productId?: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  options?: Record<string, string | number>;
  notes?: string;
}

/**
 * Multi-item quote request
 */
export interface QuoteCartRequest extends Omit<QuoteRequest, 'product'> {
  items: QuoteItem[];
  totalEstimate?: number;
}

/**
 * Quote calculation for pricing
 */
export interface QuoteCalculation {
  items: QuoteItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  total: number;
  currency: string;
  validUntil?: string;
}

/**
 * Quote summary for display
 */
export interface QuoteSummary {
  quoteId: string;
  quoteNumber: string;
  status: QuoteStatus;
  customer: QuoteCustomerInfo;
  items?: QuoteItem[];
  calculation?: QuoteCalculation;
  submittedAt: string;
  expiresAt?: string;
  notes?: string;
}

/**
 * Helper type for form validation errors
 */
export interface QuoteFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  doorType?: string;
  projectType?: string;
  numberOfDoors?: string;
  timeline?: string;
  general?: string;
}

/**
 * Helper type for form state management
 */
export interface QuoteFormState {
  data: QuoteFormData;
  errors: QuoteFormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError?: string;
}

/**
 * Type guard to check if a quote is expired
 */
export function isQuoteExpired(quote: QuoteSummary): boolean {
  if (!quote.expiresAt) return false;
  return new Date(quote.expiresAt) < new Date();
}

/**
 * Type guard to check if a quote is actionable
 */
export function isQuoteActionable(status: QuoteStatus): boolean {
  return [
    QuoteStatus.SUBMITTED,
    QuoteStatus.PROCESSING,
    QuoteStatus.REVIEWED,
    QuoteStatus.QUOTED,
  ].includes(status);
}

/**
 * Helper to convert form data to quote request
 */
export function formDataToQuoteRequest(formData: QuoteFormData): QuoteRequest {
  return {
    customer: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      province: formData.province,
      address: formData.city ? {
        city: formData.city,
        province: formData.province,
      } : undefined,
    },
    product: formData.productId ? {
      productId: formData.productId,
      name: formData.productName || 'Product',
      category: 'general',
    } : undefined,
    project: {
      doorType: formData.doorType as QuoteProjectDetails['doorType'],
      projectType: formData.projectType as QuoteProjectDetails['projectType'],
      numberOfDoors: formData.numberOfDoors,
      timeline: formData.timeline as QuoteProjectDetails['timeline'],
      budget: formData.budget as QuoteProjectDetails['budget'],
      description: formData.message,
    },
    preferences: {
      wantsConsultation: formData.wantsConsultation,
      wantsSamples: formData.wantsSamples,
      interestedInFinancing: formData.interestedInFinancing,
    },
    notes: formData.additionalInfo,
    message: formData.message,
  };
}

/**
 * Types for React hooks and state management
 */

import { Product, Cart, CartItem } from './commerce';
import { PaymentSessionData, ShippingInfo, PaymentCallback } from './api';

// Cart hook types
export interface UseCartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseCartActions {
  addItem: (product: Product | CartItem, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export type UseCartReturn = UseCartState & UseCartActions;

// Products hook types
export interface UseProductsParams {
  category?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total?: number;
}

export interface UseProductsActions {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
}

export type UseProductsReturn = UseProductsState & UseProductsActions;

// Paddle payment hook types
export interface PaddleConfig {
  vendor: number;
  environment: 'sandbox' | 'production';
}

export interface PaddleCheckoutOptions {
  product: number;
  email?: string;
  country?: string;
  postcode?: string;
  allowQuantity?: boolean;
  quantity?: number;
  passthrough?: string;
  successCallback?: (data: PaymentCallback) => void;
  closeCallback?: () => void;
}

export interface UsePaddleState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UsePaddleActions {
  openCheckout: (options: PaddleCheckoutOptions) => void;
  closeCheckout: () => void;
}

export type UsePaddleReturn = UsePaddleState & UsePaddleActions;

// Medusa hook types
export interface UseMedusaProductsParams {
  limit?: number;
  offset?: number;
  collection_id?: string;
  tags?: string[];
  created_at?: {
    lt?: string;
    gt?: string;
    gte?: string;
    lte?: string;
  };
  updated_at?: {
    lt?: string;
    gt?: string;
    gte?: string;
    lte?: string;
  };
}

export interface UseMedusaCartState {
  cart: Cart | null;
  countryCode: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseMedusaCartActions {
  startCheckout: () => Promise<void>;
  completeCart: () => Promise<void>;
  resetCart: () => Promise<void>;
  updateCart: (updates: Partial<Cart>) => Promise<void>;
}

export type UseMedusaCartReturn = UseMedusaCartState & UseMedusaCartActions;

// Form hook types
export interface FormFieldError {
  message: string;
  type: 'required' | 'invalid' | 'custom';
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, FormFieldError | null>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormActions<T = Record<string, unknown>> {
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: FormFieldError | null) => void;
  clearErrors: () => void;
  reset: () => void;
  submit: () => Promise<void>;
}

export type UseFormReturn<T = Record<string, unknown>> = FormState<T> & FormActions<T>;

// Local storage hook types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

// Async hook types
export interface UseAsyncState<T, E = Error> {
  data: T | null;
  error: E | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseAsyncActions<T, P extends unknown[] = []> {
  execute: (...params: P) => Promise<T>;
  reset: () => void;
}

export type UseAsyncReturn<T, E = Error, P extends unknown[] = []> = UseAsyncState<T, E> & UseAsyncActions<T, P>;
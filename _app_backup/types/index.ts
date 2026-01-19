// Global type definitions for better TypeScript support

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams, SortParams {
  query?: string
  category?: string
  tags?: string[]
}

// Common UI state types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface ErrorState {
  hasError: boolean
  error?: Error | string
}

// Re-export commonly used types
// Note: product.ts has the canonical Product types used by the application
// commerce.ts has legacy/API types - import them explicitly if needed
export * from './product'
export * from './hooks'
export * from './auth'

// Re-export specific commerce types that don't conflict
export type { Address, Order, Cart } from './commerce'
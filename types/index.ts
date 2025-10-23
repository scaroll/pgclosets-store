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
export * from './commerce'
export * from './product'
export * from './hooks'
export * from './auth'
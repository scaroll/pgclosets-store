/**
 * Loading State Management System
 *
 * Comprehensive loading state utilities with:
 * - State machine for loading lifecycle
 * - Minimum/maximum loading time enforcement
 * - Automatic retry with exponential backoff
 * - Request cancellation
 * - TypeScript type safety
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================================
// Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingConfig {
  /**
   * Minimum loading time to prevent flash (ms)
   * @default 400
   */
  minLoadingTime?: number

  /**
   * Maximum loading time before timeout (ms)
   * @default 30000
   */
  maxLoadingTime?: number

  /**
   * Enable automatic retry on failure
   * @default false
   */
  autoRetry?: boolean

  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number

  /**
   * Initial retry delay (ms)
   * @default 1000
   */
  retryDelay?: number

  /**
   * Exponential backoff multiplier
   * @default 2
   */
  backoffMultiplier?: number

  /**
   * Cancel ongoing requests on unmount
   * @default true
   */
  cancelOnUnmount?: boolean
}

export interface LoadingStateResult<T> {
  state: LoadingState
  data: T | null
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  execute: (promise: Promise<T>) => Promise<void>
  reset: () => void
  retry: () => Promise<void>
  cancel: () => void
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * useLoadingState - Advanced loading state management hook
 *
 * Manages loading states with minimum time enforcement, timeouts,
 * retry logic, and cancellation support.
 *
 * @example
 * ```tsx
 * const { state, data, execute, retry } = useLoadingState<Product>({
 *   minLoadingTime: 400,
 *   maxLoadingTime: 10000,
 *   autoRetry: true,
 *   maxRetries: 3
 * })
 *
 * useEffect(() => {
 *   execute(fetchProduct(productId))
 * }, [productId])
 *
 * if (state === 'loading') return <ProductSkeleton />
 * if (state === 'error') return <ErrorState onRetry={retry} />
 * if (state === 'success') return <Product data={data} />
 * ```
 */
export function useLoadingState<T = any>(
  config: LoadingConfig = {}
): LoadingStateResult<T> {
  const {
    minLoadingTime = 400,
    maxLoadingTime = 30000,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    cancelOnUnmount = true
  } = config

  const [state, setState] = useState<LoadingState>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)
  const lastPromiseRef = useRef<Promise<T> | null>(null)

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    cancel()
    setState('idle')
    setData(null)
    setError(null)
    retryCountRef.current = 0
    lastPromiseRef.current = null
  }, [cancel])

  const execute = useCallback(
    async (promise: Promise<T>) => {
      // Cancel any ongoing request
      cancel()

      // Create new abort controller
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // Store promise for retry
      lastPromiseRef.current = promise

      // Set loading state
      setState('loading')
      setError(null)

      const startTime = Date.now()

      try {
        // Race between promise and timeout
        const result = await Promise.race([
          promise,
          new Promise<never>((_, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('Request timeout'))
            }, maxLoadingTime)

            // Clear timeout if request completes
            promise.finally(() => clearTimeout(timeoutId))
          })
        ])

        // Enforce minimum loading time
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve =>
            setTimeout(resolve, minLoadingTime - elapsedTime)
          )
        }

        // Check if request was cancelled
        if (abortController.signal.aborted) {
          return
        }

        setData(result)
        setState('success')
        retryCountRef.current = 0
      } catch (err) {
        // Check if request was cancelled
        if (abortController.signal.aborted) {
          return
        }

        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        setState('error')

        // Auto retry logic
        if (autoRetry && retryCountRef.current < maxRetries) {
          const delay = retryDelay * Math.pow(backoffMultiplier, retryCountRef.current)
          retryCountRef.current++

          setTimeout(() => {
            if (lastPromiseRef.current) {
              execute(lastPromiseRef.current)
            }
          }, delay)
        }
      }
    },
    [minLoadingTime, maxLoadingTime, autoRetry, maxRetries, retryDelay, backoffMultiplier, cancel]
  )

  const retry = useCallback(async () => {
    if (lastPromiseRef.current) {
      retryCountRef.current = 0
      await execute(lastPromiseRef.current)
    }
  }, [execute])

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (cancelOnUnmount) {
        cancel()
      }
    }
  }, [cancel, cancelOnUnmount])

  return {
    state,
    data,
    error,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    execute,
    reset,
    retry,
    cancel
  }
}

/**
 * useMinimumLoadingTime - Ensure minimum loading time to prevent flash
 *
 * @example
 * ```tsx
 * const { isLoading, startLoading, stopLoading } = useMinimumLoadingTime(400)
 *
 * const fetchData = async () => {
 *   startLoading()
 *   const data = await api.fetch()
 *   stopLoading()
 *   return data
 * }
 * ```
 */
export function useMinimumLoadingTime(minTime: number = 400) {
  const [isLoading, setIsLoading] = useState(false)
  const loadingStartTimeRef = useRef<number | null>(null)

  const startLoading = useCallback(() => {
    loadingStartTimeRef.current = Date.now()
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(async () => {
    if (loadingStartTimeRef.current) {
      const elapsedTime = Date.now() - loadingStartTimeRef.current
      if (elapsedTime < minTime) {
        await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime))
      }
    }
    setIsLoading(false)
    loadingStartTimeRef.current = null
  }, [minTime])

  return { isLoading, startLoading, stopLoading }
}

/**
 * useOptimistic - Optimistic UI updates with rollback
 *
 * Provides instant UI updates with automatic rollback on error.
 *
 * @example
 * ```tsx
 * const [items, setOptimisticItems] = useOptimistic(
 *   initialItems,
 *   async (newItem) => {
 *     return await api.addItem(newItem)
 *   }
 * )
 *
 * const addItem = (item) => {
 *   setOptimisticItems(prev => [...prev, item])
 * }
 * ```
 */
export function useOptimistic<T>(
  initialValue: T,
  updateFn: (value: T) => Promise<T>
) {
  const [value, setValue] = useState<T>(initialValue)
  const [isPending, setIsPending] = useState(false)
  const previousValueRef = useRef<T>(initialValue)

  const setOptimisticValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      // Store previous value for rollback
      previousValueRef.current = value

      // Apply optimistic update
      const nextValue = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(value)
        : newValue
      setValue(nextValue)
      setIsPending(true)

      try {
        // Perform actual update
        const result = await updateFn(nextValue)
        setValue(result)
      } catch (error) {
        // Rollback on error
        setValue(previousValueRef.current)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [value, updateFn]
  )

  return [value, setOptimisticValue, isPending] as const
}

/**
 * useDelayedLoading - Show loading indicator only after delay
 *
 * Prevents loading flash for fast operations.
 *
 * @example
 * ```tsx
 * const showLoading = useDelayedLoading(isLoading, 200)
 *
 * if (showLoading) return <Skeleton />
 * ```
 */
export function useDelayedLoading(
  isLoading: boolean,
  delay: number = 200
): boolean {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [isLoading, delay])

  return showLoading
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * withMinimumLoadingTime - Enforce minimum loading time for a promise
 *
 * @example
 * ```tsx
 * const data = await withMinimumLoadingTime(
 *   fetchData(),
 *   400
 * )
 * ```
 */
export async function withMinimumLoadingTime<T>(
  promise: Promise<T>,
  minTime: number = 400
): Promise<T> {
  const startTime = Date.now()
  const result = await promise
  const elapsedTime = Date.now() - startTime

  if (elapsedTime < minTime) {
    await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime))
  }

  return result
}

/**
 * createLoadingStateMachine - Create a loading state machine
 *
 * @example
 * ```tsx
 * const machine = createLoadingStateMachine()
 * machine.start()
 * machine.succeed(data)
 * machine.fail(error)
 * ```
 */
export function createLoadingStateMachine() {
  let state: LoadingState = 'idle'
  const listeners = new Set<(state: LoadingState) => void>()

  return {
    getState: () => state,
    start: () => {
      state = 'loading'
      listeners.forEach(listener => listener(state))
    },
    succeed: () => {
      state = 'success'
      listeners.forEach(listener => listener(state))
    },
    fail: () => {
      state = 'error'
      listeners.forEach(listener => listener(state))
    },
    reset: () => {
      state = 'idle'
      listeners.forEach(listener => listener(state))
    },
    subscribe: (listener: (state: LoadingState) => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

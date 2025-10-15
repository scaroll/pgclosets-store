/**
 * Test Helper Utilities
 * Provides reusable test utilities and custom render functions
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Mock providers wrapper
interface ProvidersProps {
  children: React.ReactNode
}

export function TestProviders({ children }: ProvidersProps) {
  return <>{children}</>
}

// Custom render function with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options })
}

// Wait for async operations
export const wait For = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Create mock router
export const createMockRouter = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  ...overrides,
})

// Create mock Next.js API request
export const createMockRequest = (overrides = {}) => ({
  method: 'GET',
  headers: new Headers(),
  url: 'http://localhost:3000/api/test',
  ...overrides,
})

// Create mock Next.js API response
export const createMockResponse = () => {
  const headers = new Headers()
  return {
    status: 200,
    json: vi.fn(),
    redirect: vi.fn(),
    headers,
    ...headers,
  }
}

// Simulate user interaction delay
export const simulateDelay = (ms: number = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Create mock form event
export const createMockFormEvent = (values = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {
    elements: values,
    reset: vi.fn(),
  },
})

// Create mock file
export const createMockFile = (
  name = 'test.jpg',
  size = 1024,
  type = 'image/jpeg'
) => {
  const file = new File([''], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

// Create mock image
export const createMockImage = (width = 800, height = 600) => ({
  src: '/test-image.jpg',
  alt: 'Test Image',
  width,
  height,
})

// Mock localStorage operations
export const mockLocalStorage = () => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null,
  }
}

// Mock fetch
export const mockFetch = (response: any, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
  })
}

// Assert no console errors
export const assertNoConsoleErrors = () => {
  const originalError = console.error
  const errors: any[] = []

  console.error = (...args: any[]) => {
    errors.push(args)
  }

  return {
    restore: () => {
      console.error = originalError
    },
    getErrors: () => errors,
    assertNone: () => {
      expect(errors).toHaveLength(0)
    },
  }
}

// Create mock intersection observer entry
export const createMockIntersectionObserverEntry = (
  isIntersecting = true
) => ({
  isIntersecting,
  intersectionRatio: isIntersecting ? 1 : 0,
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: null,
  target: document.createElement('div'),
  time: Date.now(),
})

// Wait for element to be removed
export const waitForElementToBeRemoved = async (
  element: HTMLElement,
  options = { timeout: 3000 }
) => {
  const startTime = Date.now()

  while (document.body.contains(element)) {
    if (Date.now() - startTime > options.timeout) {
      throw new Error('Timeout waiting for element to be removed')
    }
    await waitFor(50)
  }
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js environment variables
vi.stubEnv('NODE_ENV', 'test')
vi.stubEnv('JWT_SECRET', 'test-jwt-secret-32-characters-long-for-testing-purposes-only')
vi.stubEnv('CSRF_SECRET', 'test-csrf-secret-16chars')
vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api')

// Mock other common environment variables
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
vi.stubEnv('NEXTAUTH_SECRET', 'test-nextauth-secret-32-characters-long-for-testing')
vi.stubEnv('NEXTAUTH_URL', 'http://localhost:3000')

// Mock browser APIs that aren't available in Node.js test environment
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Define window object if it doesn't exist
if (typeof window === 'undefined') {
  ;(global as any).window = {}
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch API
global.fetch = vi.fn()

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js dynamic imports
vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<any>) => fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
window.HTMLElement.prototype.setPointerCapture = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()

Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
  get() {
    return this.parentNode
  },
})

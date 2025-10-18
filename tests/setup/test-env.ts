/**
 * Test environment setup
 * Provides required environment variables for testing
 */

// Set test environment variables
// Note: NODE_ENV is read-only in some Node.js environments, but we can still attempt to set it
Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true })
process.env.JWT_SECRET = 'test-jwt-secret-32-characters-long-for-testing-purposes-only'
process.env.CSRF_SECRET = 'test-csrf-secret-16chars'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

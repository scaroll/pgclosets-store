'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * Providers Component
 *
 * Client-side provider wrapper for global app state and context.
 * Includes NextAuth SessionProvider for authentication state management.
 * Ready for future additions like:
 * - Theme provider (dark mode)
 * - Analytics context
 * - User preferences
 * - Redux/Zustand stores
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

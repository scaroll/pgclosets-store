'use client'

/**
 * Admin Login Page
 * Simple password-only authentication
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { loginAction } from './actions'
import { useFormState } from 'react-dom'

// ============================================================================
// Client Component
// ============================================================================

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, { error: null })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your admin password to continue
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md bg-white p-6 shadow-sm">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="mt-2"
                placeholder="Enter admin password"
                aria-invalid={state.error ? 'true' : undefined}
                aria-describedby={state.error ? 'error-message' : undefined}
              />
            </div>

            {state.error && (
              <p
                id="error-message"
                className="text-sm text-red-600"
                role="alert"
              >
                {state.error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export default function AdminLoginPage() {
  // Note: Redirect if already authenticated is handled in layout
  return <LoginForm />
}

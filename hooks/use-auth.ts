import { useState, useEffect, useCallback } from "react"

// Types
interface User {
  id: string
  email: string
  role: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  csrfToken: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface SessionResponse {
  authenticated: boolean
  user?: User
  csrfToken?: string
}

interface LoginResponse {
  success: boolean
  user?: User
  csrfToken?: string
  error?: string
}

// Custom hook for authentication
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    csrfToken: null,
  })

  // Check session on mount
  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })

      // Always process the response, even if it's an error
      if (response.ok) {
        const data: SessionResponse = await response.json()
        if (data.authenticated && data.user && data.csrfToken) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            csrfToken: data.csrfToken,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            csrfToken: null,
          })
        }
      } else {
        // Handle error responses gracefully
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          csrfToken: null,
        })
      }
    } catch (error) {
      console.error("Session check failed:", error)
      // Don't throw errors for failed session checks - just mark as unauthenticated
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        csrfToken: null,
      })
    }
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })

      const data: LoginResponse = await response.json()

      if (response.ok && data.success && data.user && data.csrfToken) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          csrfToken: data.csrfToken,
        })
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error" }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "X-CSRF-Token": authState.csrfToken || "",
        },
        credentials: "include",
      })

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        csrfToken: null,
      })

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }, [authState.csrfToken])

  // Refresh CSRF token
  const refreshCSRFToken = useCallback(async () => {
    await checkSession()
  }, [checkSession])

  // Effect to check session on mount
  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return {
    ...authState,
    login,
    logout,
    refreshCSRFToken,
    checkSession,
  }
}

// Hook for making authenticated API requests
export function useAuthenticatedFetch() {
  const { csrfToken, isAuthenticated } = useAuth()

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated")
      }

      const headers: Record<string, string> = {
        ...((options.headers as Record<string, string>) || {}),
      }

      // Add CSRF token for state-changing operations
      if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method || "GET")) {
        if (csrfToken) {
          headers["X-CSRF-Token"] = csrfToken
        }
      }

      // Add Content-Type for JSON requests
      if (options.body && typeof options.body === "string") {
        headers["Content-Type"] = "application/json"
      }

      return fetch(url, {
        ...options,
        credentials: "include",
        headers,
      })
    },
    [csrfToken, isAuthenticated]
  )

  return authenticatedFetch
}

// Hook for admin-only operations
export function useAdminAuth() {
  const auth = useAuth()

  const isAdmin = auth.user?.isAdmin || false

  const requireAdmin = useCallback(() => {
    if (!auth.isAuthenticated || !isAdmin) {
      throw new Error("Admin access required")
    }
  }, [auth.isAuthenticated, isAdmin])

  return {
    ...auth,
    isAdmin,
    requireAdmin,
  }
}
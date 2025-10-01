"use client"

import type { ReactNode } from "react";
import React from "react"
import { useAdminAuth } from "@/hooks/use-auth"

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Component that only renders children if user is authenticated admin
 */
export function AdminGuard({ children, fallback, redirectTo }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Redirect if specified
  if (!isAuthenticated || !isAdmin) {
    if (redirectTo) {
      window.location.href = redirectTo
      return null
    }

    // Show fallback or default unauthorized message
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this area.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Component that only renders children if user is authenticated
 */
export function AuthGuard({ children, fallback, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Redirect if specified
  if (!isAuthenticated) {
    if (redirectTo) {
      window.location.href = redirectTo
      return null
    }

    // Show fallback or default login prompt
    return (
      fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this area.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
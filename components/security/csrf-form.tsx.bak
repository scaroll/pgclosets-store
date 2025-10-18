"use client"

import type { ReactNode } from "react";
import React from "react"
import { useAuth } from "@/hooks/use-auth"

interface CSRFFormProps {
  onSubmit: (formData: FormData, csrfToken: string) => Promise<void> | void
  children: ReactNode
  className?: string
  method?: "POST" | "PUT" | "DELETE" | "PATCH"
}

/**
 * Secure form component that automatically includes CSRF protection
 */
export function CSRFForm({ onSubmit, children, className, method = "POST" }: CSRFFormProps) {
  const { csrfToken, isAuthenticated } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isAuthenticated) {
      console.error("Not authenticated")
      return
    }

    if (!csrfToken) {
      console.error("No CSRF token available")
      return
    }

    const formData = new FormData(e.currentTarget)
    await onSubmit(formData, csrfToken)
  }

  return (
    <form onSubmit={handleSubmit} className={className} method={method}>
      {children}
      {/* Hidden CSRF token field */}
      <input type="hidden" name="csrf_token" value={csrfToken || ""} />
    </form>
  )
}

interface SecureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (csrfToken: string) => Promise<void> | void
  requireAuth?: boolean
  requireAdmin?: boolean
}

/**
 * Secure button component that automatically includes CSRF protection for actions
 */
export function SecureButton({
  onClick,
  requireAuth = false,
  requireAdmin = false,
  children,
  ...props
}: SecureButtonProps) {
  const { csrfToken, isAuthenticated, user } = useAuth()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (requireAuth && !isAuthenticated) {
      console.error("Authentication required")
      return
    }

    if (requireAdmin && !user?.isAdmin) {
      console.error("Admin access required")
      return
    }

    if (onClick && csrfToken) {
      await onClick(csrfToken)
    }
  }

  const isDisabled =
    props.disabled ||
    (requireAuth && !isAuthenticated) ||
    (requireAdmin && !user?.isAdmin) ||
    !csrfToken

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
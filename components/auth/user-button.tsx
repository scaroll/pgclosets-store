"use client"

import { signOut, useSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export function UserButton() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Sign up
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const userInitials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || session.user.email?.[0].toUpperCase() || "U"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          {userInitials}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{session.user.name || "User"}</p>
            <p className="truncate text-sm text-gray-500">{session.user.email}</p>
            {session.user.role && (
              <p className="mt-1 text-xs text-gray-400">
                Role: <span className="capitalize">{session.user.role.toLowerCase()}</span>
              </p>
            )}
          </div>

          <div className="border-t border-gray-100">
            <Link
              href="/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Your Account
            </Link>
            <Link
              href="/account/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/account/bookings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Bookings
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

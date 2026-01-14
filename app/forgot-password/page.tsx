"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 2000)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                <p className="text-gray-600 mt-2">We&apos;ve sent a password reset link to</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p className="font-medium mb-2">Didn&apos;t receive the email?</p>
                <ul className="space-y-1 text-left">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes for delivery</li>
                </ul>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Try Different Email
                </button>
                <Link
                  href="/login"
                  className="block w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-center"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PG Closets</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">
              ← Back to Sign In
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-slate-900 font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-500">
          Having trouble? Contact our{" "}
          <Link href="/contact" className="text-slate-900 hover:underline">
            support team
          </Link>
        </div>
      </div>
    </div>
  )
}

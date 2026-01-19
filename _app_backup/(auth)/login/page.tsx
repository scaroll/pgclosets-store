import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"

export const metadata = {
  title: "Sign In | PG Closets",
  description: "Sign in to your PG Closets account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

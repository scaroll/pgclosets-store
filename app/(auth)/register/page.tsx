import { RegisterForm } from "@/components/auth/register-form"
import { Suspense } from "react"

export const metadata = {
  title: "Create Account | PG Closets",
  description: "Create a new PG Closets account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}

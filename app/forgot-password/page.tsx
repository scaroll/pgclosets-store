"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { PageHeader } from "@/components/layout/page-header"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate email sending process
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 2000)
  }

  if (emailSent) {
    return (
      <PageWrapper>
        <PageHeader variant="minimal" showNavigation={false} showActions={false} />

        <div className="flex-1 bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-brand-medium">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-h2 text-foreground">Check Your Email</h1>
                    <p className="text-body text-muted-foreground mt-2">We've sent a password reset link to</p>
                    <p className="font-medium text-foreground">{email}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Didn't receive the email?</p>
                    <ul className="space-y-1 text-left">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure you entered the correct email</li>
                      <li>• Wait a few minutes for delivery</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full">
                      Try Different Email
                    </Button>
                    <Link href="/login">
                      <Button className="w-full btn-brand-primary">Back to Sign In</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageHeader variant="minimal" showNavigation={false} showActions={false} />

      <div className="flex-1 bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-h2 text-foreground mt-4">Reset Password</h1>
            <p className="text-body text-muted-foreground mt-2">Enter your email to receive a reset link</p>
          </div>

          <Card className="border-0 shadow-brand-medium">
            <CardHeader className="space-y-1">
              <CardTitle className="text-h4 text-center flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">We'll send you a link to reset your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-11 btn-brand-primary" disabled={isLoading}>
                  {isLoading ? "Demo Mode..." : "Demo Mode - Password Reset Disabled"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>

          <div className="text-center mt-6 text-xs text-muted-foreground">
            Having trouble? Contact our{" "}
            <Link href="/contact" className="text-accent hover:text-accent/80 transition-colors">
              support team
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

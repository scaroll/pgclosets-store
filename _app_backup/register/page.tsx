"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { PageHeader } from "@/components/layout/page-header"
import { Eye, EyeOff, Check } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /\d/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate registration process
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <PageWrapper>
      <PageHeader variant="minimal" showNavigation={false} showActions={false} />

      <div className="flex-1 bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-h2 text-foreground mt-4">Create Account</h1>
            <p className="text-body text-muted-foreground mt-2">Join us to transform your home organization</p>
          </div>

          <Card className="border-0 shadow-brand-medium">
            <CardHeader className="space-y-1">
              <CardTitle className="text-h4 text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      className="h-11 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="space-y-1 mt-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3 h-3 ${req.met ? "text-green-600" : "text-muted-foreground"}`} />
                          <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm">
                    <input type="checkbox" required className="rounded border-border mt-0.5" />
                    <span className="text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  <label className="flex items-start space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-border mt-0.5" />
                    <span className="text-muted-foreground">
                      I'd like to receive updates about new products and special offers
                    </span>
                  </label>
                </div>
                <Button type="submit" className="w-full h-11 btn-brand-primary" disabled={isLoading}>
                  {isLoading ? "Demo Mode..." : "Demo Mode - Registration Disabled"}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center text-sm text-muted-foreground">Or sign up with</div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button variant="outline" className="h-11 bg-transparent hover:bg-accent/10 transition-colors">
                    Google
                  </Button>
                  <Button variant="outline" className="h-11 bg-transparent hover:bg-accent/10 transition-colors">
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

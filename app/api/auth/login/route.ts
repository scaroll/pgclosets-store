import { NextRequest, NextResponse } from "next/server"
import { SessionManager, InputValidator, SecurityUtils, DEFAULT_ADMIN, CSRFProtection } from "@/lib/auth"
import { z } from "zod"

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    // Sanitize email
    const sanitizedEmail = InputValidator.sanitizeString(email.toLowerCase())

    // For demo purposes, use default admin credentials
    // In production, this would query your user database
    if (sanitizedEmail === DEFAULT_ADMIN.email && password === "admin123!") {
      // Create session
      const { token, session } = await SessionManager.createSession(DEFAULT_ADMIN)

      // Create response
      const response = NextResponse.json({
        success: true,
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
          isAdmin: session.isAdmin
        }
      })

      // Set secure cookies
      SessionManager.setSessionCookie(response, token)
      const csrfToken = CSRFProtection.setCSRFCookie(response)

      // Log security event
      SecurityUtils.logSecurityEvent("USER_LOGIN", {
        userId: session.userId,
        email: session.email,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent")
      })

      // Return CSRF token in response for client-side use
      return NextResponse.json({
        success: true,
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
          isAdmin: session.isAdmin
        },
        csrfToken
      }, { headers: response.headers })

    } else {
      // Log failed login attempt
      SecurityUtils.logSecurityEvent("LOGIN_FAILED", {
        email: sanitizedEmail,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent")
      })

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
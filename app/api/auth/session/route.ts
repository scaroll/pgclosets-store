import { NextRequest, NextResponse } from "next/server"
import { SessionManager, CSRFProtection } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await SessionManager.getSession(request)

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Create response with session data
    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        isAdmin: session.isAdmin
      }
    })

    // Generate new CSRF token
    const csrfToken = CSRFProtection.setCSRFCookie(response)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        isAdmin: session.isAdmin
      },
      csrfToken
    }, { headers: response.headers })

  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
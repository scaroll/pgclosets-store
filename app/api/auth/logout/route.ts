import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
import { SessionManager, SecurityUtils } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get current session if exists
    const session = await SessionManager.getSession(request)

    // Create response
    const response = NextResponse.json({ success: true })

    // Clear session cookies
    SessionManager.clearSession(response)

    // Log security event
    if (session) {
      SecurityUtils.logSecurityEvent("USER_LOGOUT", {
        userId: session.userId,
        email: session.email,
        ip: request.ip || "unknown",
        userAgent: request.headers.get("user-agent")
      })
    }

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
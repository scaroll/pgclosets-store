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
      const forwardedFor = request.headers.get("x-forwarded-for")
      const realIp = request.headers.get("x-real-ip")
      const ip = (forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "unknown")

      SecurityUtils.logSecurityEvent("USER_LOGOUT", {
        userId: session.userId,
        email: session.email,
        ip,
        userAgent: request.headers.get("user-agent") ?? undefined
      })
    }

    return response
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Logout error:", errorMessage)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
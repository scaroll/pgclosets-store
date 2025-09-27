import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { SessionManager, InputValidator, SecurityUtils, RateLimiter } from "@/lib/auth"
import { z } from "zod"

// Input validation schema
const deleteSchema = z.object({
  url: z.string().url("Invalid URL format").refine(
    (url) => url.includes("blob.vercel-storage.com"),
    "URL must be from Vercel Blob storage"
  )
})

export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication for file deletion
    const session = await SessionManager.requireAdmin(request)

    // Rate limiting for delete operations
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const rateLimit = RateLimiter.check(`delete:${ip}`, 5, 60 * 1000) // 5 deletes per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const result = deleteSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      )
    }

    const { url } = result.data

    // Sanitize URL
    const sanitizedUrl = InputValidator.sanitizeString(url)

    // Additional security check - ensure URL is from allowed domain
    const allowedDomains = ["blob.vercel-storage.com"]
    const urlObj = new URL(sanitizedUrl)

    if (!allowedDomains.includes(urlObj.hostname)) {
      return NextResponse.json(
        { error: "URL domain not allowed" },
        { status: 403 }
      )
    }

    // Log security event before deletion
    SecurityUtils.logSecurityEvent("FILE_DELETE_ATTEMPT", {
      userId: session.userId,
      url: sanitizedUrl,
      ip,
      userAgent: request.headers.get("user-agent")
    })

    // Delete from Vercel Blob
    await del(sanitizedUrl)

    // Log successful deletion
    SecurityUtils.logSecurityEvent("FILE_DELETE_SUCCESS", {
      userId: session.userId,
      url: sanitizedUrl,
      ip,
      userAgent: request.headers.get("user-agent")
    })

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedAt: new Date().toISOString(),
      deletedBy: session.userId,
    })
  } catch (error) {
    console.error("Delete error:", error)

    // Log security event for failed deletions
    SecurityUtils.logSecurityEvent("FILE_DELETE_FAILED", {
      error: error instanceof Error ? error.message : "Unknown error",
      ip: request.ip || "unknown",
      userAgent: request.headers.get("user-agent")
    })

    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 },
    )
  }
}

import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { SessionManager, InputValidator, SecurityUtils, RateLimiter } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await SessionManager.getSession(request)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const rateLimit = RateLimiter.check(`upload:${ip}`, 10, 60 * 1000) // 10 uploads per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Enhanced file validation
    const validation = InputValidator.validateFileUpload(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: "File validation failed", details: validation.errors },
        { status: 400 }
      )
    }

    // Sanitize filename
    const sanitizedOriginalName = InputValidator.sanitizeString(file.name)

    // Generate secure filename
    const timestamp = Date.now()
    const secureId = SecurityUtils.generateSecureId()
    const fileExtension = sanitizedOriginalName.split(".").pop()?.toLowerCase()
    const uniqueFilename = `${timestamp}-${secureId}.${fileExtension}`

    // Upload to Vercel Blob with security settings
    const blob = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: false, // We're generating our own secure suffix
    })

    // Log security event
    SecurityUtils.logSecurityEvent("FILE_UPLOAD", {
      userId: session.userId,
      filename: sanitizedOriginalName,
      uniqueFilename,
      size: file.size,
      type: file.type,
      ip,
      userAgent: request.headers.get("user-agent")
    })

    return NextResponse.json({
      url: blob.url,
      filename: sanitizedOriginalName,
      uniqueFilename: uniqueFilename,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.userId,
    })
  } catch (error) {
    console.error("Upload error:", error)

    // Log security event for failed uploads
    SecurityUtils.logSecurityEvent("FILE_UPLOAD_FAILED", {
      error: error instanceof Error ? error.message : "Unknown error",
      ip: request.ip || "unknown",
      userAgent: request.headers.get("user-agent")
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}

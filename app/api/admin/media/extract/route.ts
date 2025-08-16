import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "URLs array is required" }, { status: 400 })
    }

    const processedMedia = []

    for (const url of urls) {
      try {
        // Extract metadata from URL
        const filename = url.split("/").pop() || "unknown"
        const extension = filename.split(".").pop()?.toLowerCase()

        let mediaType = "other"
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
          mediaType = "image"
        } else if (["mp4", "mov", "avi", "webm"].includes(extension || "")) {
          mediaType = "video"
        } else if (["pdf", "doc", "docx"].includes(extension || "")) {
          mediaType = "document"
        }

        processedMedia.push({
          url,
          filename,
          type: mediaType,
          extension,
          size: null, // Would need to fetch to get actual size
          extracted_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedMedia.length,
      media: processedMedia,
    })
  } catch (error) {
    console.error("Media extraction error:", error)
    return NextResponse.json({ error: "Failed to process media" }, { status: 500 })
  }
}

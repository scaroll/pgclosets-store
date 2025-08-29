import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 },
    )
  }
}

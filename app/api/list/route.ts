import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list()

    const files = blobs.map((blob) => ({
      ...blob,
      filename: blob.pathname.split("/").pop() || "unknown",
      isImage: false, // Remove contentType check as it may not be available
      sizeFormatted: formatFileSize(blob.size),
      uploadedAt: blob.uploadedAt,
    }))

    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({
      files,
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
    })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

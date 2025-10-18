import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ 
        error: "Vercel Blob not configured", 
        files: [], 
        totalFiles: 0, 
        totalSize: 0 
      }, { status: 200 })
    }

    const { blobs } = await list()

    const files = blobs.map((blob) => ({
      ...blob,
      filename: blob.pathname?.split("/").pop() || "unknown",
      isImage: false, // Remove contentType check as it may not be available
      sizeFormatted: formatFileSize(blob.size || 0),
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
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))  } ${  sizes[i]}`
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, File, ImageIcon, Video, FileText } from "lucide-react"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export function BlobStorageViewer() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/list")

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`)
      }

      const data = await response.json()
      setFiles(data.blobs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const getFileIcon = (pathname: string) => {
    const ext = pathname.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return ImageIcon
    if (["mp4", "mov", "avi", "mkv"].includes(ext || "")) return Video
    if (["txt", "md", "json"].includes(ext || "")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blob Storage Contents</CardTitle>
        <Button onClick={fetchFiles} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading files...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchFiles} className="mt-2 bg-transparent" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {files.length} file{files.length !== 1 ? "s" : ""} in storage
            </div>

            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No files uploaded yet. Upload some files to see them here!
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file, index) => {
                  const IconComponent = getFileIcon(file.pathname)
                  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
                    file.pathname.split(".").pop()?.toLowerCase() || "",
                  )

                  return (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        {isImage ? (
                          <img
                            src={file.url || "/placeholder.svg"}
                            alt={file.pathname}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.pathname}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <Button variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")}>
                        View
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

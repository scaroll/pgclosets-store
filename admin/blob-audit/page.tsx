"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ImageIcon, FileText, Download } from "lucide-react"

interface BlobFile {
  url: string
  pathname: string
  filename: string
  size: number
  sizeFormatted: string
  contentType: string
  isImage: boolean
  uploadedAt: string
}

interface BlobAuditData {
  files: BlobFile[]
  totalFiles: number
  totalSize: number
}

export default function BlobAuditPage() {
  const [auditData, setAuditData] = useState<BlobAuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlobData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/list")
      if (!response.ok) throw new Error("Failed to fetch blob data")
      const data = await response.json()
      setAuditData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlobData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchBlobData} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const imageFiles = auditData?.files.filter((f) => f.isImage) || []
  const otherFiles = auditData?.files.filter((f) => !f.isImage) || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blob Storage Audit</h1>
        <Button onClick={fetchBlobData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditData?.totalFiles || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Image Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{imageFiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditData ? Math.round((auditData.totalSize / 1024 / 1024) * 100) / 100 : 0} MB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Images ({imageFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {imageFiles.map((file) => (
              <div key={file.url} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {file.sizeFormatted}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Files */}
      {otherFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Other Files ({otherFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {otherFiles.map((file) => (
                <div key={file.url} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{file.filename}</p>
                    <p className="text-sm text-gray-500">{file.contentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{file.sizeFormatted}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => window.open(file.url, "_blank")}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

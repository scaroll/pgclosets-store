"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800">Error</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchBlobData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blob Storage Audit</h1>
              <p className="text-gray-600 mt-2">Review and manage blob storage files</p>
            </div>
            <button
              onClick={fetchBlobData}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Files</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{auditData?.totalFiles || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Size</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {auditData?.totalSize ? `${(auditData.totalSize / 1024 / 1024).toFixed(2)} MB` : "0 MB"}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500">Images</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {auditData?.files.filter(f => f.isImage).length || 0}
            </p>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Files</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {auditData?.files.map((file, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${file.isImage ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {file.isImage ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.filename}</p>
                    <p className="text-sm text-gray-500">{file.sizeFormatted} • {file.contentType}</p>
                  </div>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  View
                </a>
              </div>
            ))}
            {(!auditData?.files || auditData.files.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No files found in blob storage
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

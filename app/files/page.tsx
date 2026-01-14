"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  filename: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/list")
      const data = await response.json()
      setFiles(data.files || [])
    } catch {
      setMessage("Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setMessage("File uploaded successfully")
        fetchFiles()
      } else {
        throw new Error("Upload failed")
      }
    } catch {
      setMessage("Failed to upload file")
    }
  }

  const handleDelete = async (url: string) => {
    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (response.ok) {
        setMessage("File deleted successfully")
        fetchFiles()
      } else {
        throw new Error("Delete failed")
      }
    } catch {
      setMessage("Failed to delete file")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">
            ← Back to Admin
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">File Management</h1>
          <p className="text-gray-600">Upload and manage your files in Vercel Blob storage</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {message}
            <button onClick={() => setMessage(null)} className="ml-4 text-blue-600 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Choose File to Upload
            </label>
            <p className="text-sm text-gray-500 mt-2">Max file size: 4.5MB</p>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Your Files ({files.length})</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading files...</div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No files uploaded yet. Upload your first file above.
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.url} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {isImage(file.filename) && (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{file.filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(file.url, "_blank")}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-gray-50 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          const a = document.createElement("a")
                          a.href = file.url
                          a.download = file.filename
                          a.click()
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:bg-gray-50 transition"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file.url)}
                        className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

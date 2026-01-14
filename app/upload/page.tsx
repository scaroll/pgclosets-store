"use client"

import { useState } from "react"
import Link from "next/link"

interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage(null)

    const newFiles: UploadedFile[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newFiles.push({
            url: data.url,
            filename: file.name,
            size: file.size,
            type: file.type,
          })
        }
      } catch {
        setMessage(`Failed to upload ${file.name}`)
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setUploading(false)
    if (newFiles.length > 0) {
      setMessage(`Successfully uploaded ${newFiles.length} file(s)`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Product Images</h1>
          <p className="text-gray-600 mt-2">
            Securely upload images to Blob storage for use throughout your store
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <input
              type="file"
              onChange={handleUpload}
              accept="image/*"
              multiple
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <label
              htmlFor="file-upload"
              className={`cursor-pointer inline-flex px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Choose Images to Upload"}
            </label>
            <p className="text-sm text-gray-500 mt-4">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload Session Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <p className="text-xs text-gray-600 truncate" title={file.filename}>
                    {file.filename}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ {uploadedFiles.length} files uploaded successfully and ready to use
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

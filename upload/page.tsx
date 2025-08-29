"use client"

import { SecureImageUploader } from "@/components/SecureImageUploader"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ImageIcon } from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
}

export default function UploadPage() {
  const [allUploadedFiles, setAllUploadedFiles] = useState<UploadedFile[]>([])

  const handleUploadComplete = (newFiles: UploadedFile[]) => {
    setAllUploadedFiles((prev) => [...prev, ...newFiles])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/admin/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Product Images</h1>
          <p className="text-gray-600 mt-2">Securely upload images to Blob storage for use throughout your store</p>
        </div>

        <div className="grid gap-8">
          <SecureImageUploader
            onUploadComplete={handleUploadComplete}
            maxFiles={20}
            maxFileSize={10 * 1024 * 1024} // 10MB
          />

          {allUploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Upload Session Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allUploadedFiles.map((file, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={file.url || "/placeholder.svg"}
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
                    ✅ {allUploadedFiles.length} files uploaded successfully and ready to use in your store
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

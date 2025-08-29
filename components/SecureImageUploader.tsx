"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"

interface UploadedFile {
  url: string
  filename: string
  size: number
  type: string
}

interface SecureImageUploaderProps {
  onUploadComplete?: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxFileSize?: number // in bytes
}

export function SecureImageUploader({
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
}: SecureImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `${file.name}: Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`
      }
      if (file.size > maxFileSize) {
        return `${file.name}: File too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
      }
      return null
    },
    [acceptedTypes, maxFileSize],
  )

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles = Array.from(selectedFiles)
      const validationErrors: string[] = []
      const validFiles: File[] = []

      newFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          validationErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (files.length + validFiles.length > maxFiles) {
        validationErrors.push(`Cannot upload more than ${maxFiles} files`)
        return
      }

      setErrors(validationErrors)
      setFiles((prev) => [...prev, ...validFiles])
    },
    [files.length, maxFiles, validateFile],
  )

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData()
    formData.append("file", file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error("Invalid response format"))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"))
      })

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setErrors([])
    const newUploadedFiles: UploadedFile[] = []
    const uploadErrors: string[] = []

    for (const file of files) {
      try {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
        const uploadedFile = await uploadFile(file)
        newUploadedFiles.push(uploadedFile)
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
      } catch (error) {
        uploadErrors.push(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`)
        setUploadProgress((prev) => ({ ...prev, [file.name]: -1 })) // -1 indicates error
      }
    }

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
    setErrors(uploadErrors)
    setIsUploading(false)

    const successfulFileNames = newUploadedFiles.map((f) => f.filename)
    setFiles((prev) => prev.filter((f) => !successfulFileNames.includes(f.name)))

    if (onUploadComplete && newUploadedFiles.length > 0) {
      onUploadComplete(newUploadedFiles)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getProgressStatus = (filename: string) => {
    const progress = uploadProgress[filename]
    if (progress === undefined) return "pending"
    if (progress === -1) return "error"
    if (progress === 100) return "complete"
    return "uploading"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Secure Image Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFileSelect(e.dataTransfer.files)
          }}
        >
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Drop images here or click to select</p>
          <p className="text-sm text-gray-500">
            Supports: {acceptedTypes.map((type) => type.split("/")[1]).join(", ")} • Max{" "}
            {(maxFileSize / 1024 / 1024).toFixed(1)}MB per file
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Files to Upload ({files.length})</h3>
            {files.map((file, index) => {
              const status = getProgressStatus(file.name)
              const progress = uploadProgress[file.name] || 0

              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      <div className="flex items-center gap-2">
                        {status === "complete" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                        {!isUploading && (
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {status === "uploading" && <Progress value={progress} className="h-2" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {files.length > 0 && (
          <Button onClick={handleUpload} disabled={isUploading} className="w-full" size="lg">
            {isUploading ? "Uploading..." : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
          </Button>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-green-700">Successfully Uploaded ({uploadedFiles.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.filename}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

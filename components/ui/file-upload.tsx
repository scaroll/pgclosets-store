"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileImage, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  accept?: string
  maxSize?: number // in bytes
  onUpload?: (file: File) => Promise<void> // Added onUpload prop for actual file upload
  className?: string
  disabled?: boolean
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // Changed default to bytes (5MB)
  onUpload, // Added onUpload prop
  className,
  disabled = false,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    }

    if (accept === "image/*" && !file.type.startsWith("image/")) {
      return "Please select a valid image file"
    }

    return null
  }

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setFile(selectedFile)
      onUpload?.(selectedFile)

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      }

      if (onUpload) {
        await handleUpload(selectedFile)
      } else {
        // Simulate upload process for demo
        simulateUpload()
      }
    },
    [maxSize, accept, onUpload],
  )

  const handleUpload = async (file: File) => {
    if (!onUpload) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      await onUpload(file)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setIsUploaded(true)
    } catch (error) {
      setError("Upload failed. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setIsUploaded(true)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [disabled, handleFileSelect],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsUploaded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!file ? (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200",
                isDragging ? "bg-primary/20" : "bg-muted",
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8 transition-colors duration-200",
                  isDragging ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                {isDragging ? "Drop your file here" : "Upload a file"}
              </p>
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">
                {accept === "image/*" ? "Images" : "Files"} up to {(maxSize / 1024 / 1024).toFixed(1)}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Preview */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-start space-x-4">
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileImage className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                {/* Success State */}
                {isUploaded && !isUploading && (
                  <div className="flex items-center mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Upload complete</span>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

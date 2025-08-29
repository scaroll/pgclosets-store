"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  filename: string
}

interface MediaGalleryProps {
  selectable?: boolean
  onSelect?: (file: BlobFile) => void
  selectedFiles?: string[]
  maxSelections?: number
  fileTypes?: string[]
}

export function MediaGallery({
  selectable = false,
  onSelect,
  selectedFiles = [],
  maxSelections = 1,
  fileTypes = [],
}: MediaGalleryProps) {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<BlobFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "images" | "documents">("all")
  const { toast } = useToast()

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/list")
      const data = await response.json()
      let fileList = data.files || []

      if (fileTypes.length > 0) {
        fileList = fileList.filter((file: BlobFile) =>
          fileTypes.some((type) => file.filename.toLowerCase().endsWith(type.toLowerCase())),
        )
      }

      setFiles(fileList)
      setFilteredFiles(fileList)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
        toast({
          title: "Success",
          description: "File deleted successfully",
        })
        fetchFiles()
      } else {
        throw new Error("Delete failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const isImage = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)
  const isDocument = (filename: string) => /\.(pdf|doc|docx|txt)$/i.test(filename)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  useEffect(() => {
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter((file) => file.filename.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterType !== "all") {
      filtered = filtered.filter((file) => {
        if (filterType === "images") return isImage(file.filename)
        if (filterType === "documents") return isDocument(file.filename)
        return true
      })
    }

    setFilteredFiles(filtered)
  }, [files, searchTerm, filterType])

  useEffect(() => {
    fetchFiles()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading media...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilterType(filterType === "all" ? "images" : filterType === "images" ? "documents" : "all")
            }
          >
            <FilterIcon />
            {filterType === "all" ? "All" : filterType === "images" ? "Images" : "Documents"}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredFiles.length} files</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <ListIcon /> : <GridIcon />}
          </Button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm || filterType !== "all" ? "No files match your search criteria." : "No files uploaded yet."}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.url}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectable && selectedFiles.includes(file.url) ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => selectable && onSelect?.(file)}
            >
              <CardContent className="p-3">
                <div className="aspect-square mb-2 bg-muted rounded-lg overflow-hidden">
                  {isImage(file.filename) ? (
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="text-2xl mb-1">📄</div>
                        <div className="text-xs">{file.filename.split(".").pop()?.toUpperCase()}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                {!selectable && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, "_blank")
                      }}
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const a = document.createElement("a")
                        a.href = file.url
                        a.download = file.filename
                        a.click()
                      }}
                    >
                      <DownloadIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(file.url)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <Card
              key={file.url}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                selectable && selectedFiles.includes(file.url) ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => selectable && onSelect?.(file)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {isImage(file.filename) && (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.filename}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!selectable && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(file.url, "_blank")
                        }}
                      >
                        <EyeIcon />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const a = document.createElement("a")
                          a.href = file.url
                          a.download = file.filename
                          a.click()
                        }}
                      >
                        <DownloadIcon />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(file.url)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
)

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)

const EyeIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

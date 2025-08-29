"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MediaGallery } from "@/components/MediaGallery"
import { FileUpload } from "@/components/ui/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  filename: string
}

interface MediaSelectorProps {
  onSelect: (files: BlobFile[]) => void
  selectedFiles?: string[]
  maxSelections?: number
  fileTypes?: string[]
  trigger?: React.ReactNode
}

export function MediaSelector({
  onSelect,
  selectedFiles = [],
  maxSelections = 1,
  fileTypes = [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  trigger,
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<BlobFile[]>([])
  const { toast } = useToast()

  const handleSelect = (file: BlobFile) => {
    if (maxSelections === 1) {
      setSelected([file])
    } else {
      const isSelected = selected.some((f) => f.url === file.url)
      if (isSelected) {
        setSelected(selected.filter((f) => f.url !== file.url))
      } else if (selected.length < maxSelections) {
        setSelected([...selected, file])
      } else {
        toast({
          title: "Selection Limit",
          description: `You can only select up to ${maxSelections} files`,
          variant: "destructive",
        })
      }
    }
  }

  const handleConfirm = () => {
    onSelect(selected)
    setOpen(false)
    setSelected([])
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: "File uploaded successfully",
        })
        // Auto-select the uploaded file
        const newFile: BlobFile = {
          url: data.url,
          pathname: data.pathname,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          filename: file.name,
        }
        setSelected([newFile])
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Select Media</Button>}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Media Files</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="browse">Browse Files</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="overflow-y-auto max-h-[60vh]">
            <MediaGallery
              selectable
              onSelect={handleSelect}
              selectedFiles={selected.map((f) => f.url)}
              maxSelections={maxSelections}
              fileTypes={fileTypes}
            />
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload onUpload={handleUpload} accept={fileTypes.join(",")} maxSize={4.5 * 1024 * 1024} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selected.length} of {maxSelections} selected
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={selected.length === 0}>
              Select {selected.length} File{selected.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

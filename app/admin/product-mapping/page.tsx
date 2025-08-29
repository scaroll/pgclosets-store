"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ImageIcon, Plus, X, Save, RefreshCw } from "lucide-react"
import productsData from "@/data/products.json"

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

interface ProductMapping {
  slug: string
  title: string
  type: string
  currentImage: string
  blobImages: string[]
  primaryBlobImage?: string
}

export default function ProductMappingPage() {
  const [blobFiles, setBlobFiles] = useState<BlobFile[]>([])
  const [productMappings, setProductMappings] = useState<ProductMapping[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Initialize product mappings from JSON data
  useEffect(() => {
    const mappings: ProductMapping[] = productsData.items.map((product) => ({
      slug: product.slug,
      title: product.title,
      type: product.type,
      currentImage: product.image,
      blobImages: [],
      primaryBlobImage: undefined,
    }))
    setProductMappings(mappings)
  }, [])

  // Fetch blob files
  const fetchBlobFiles = async () => {
    try {
      const response = await fetch("/api/list")
      if (!response.ok) throw new Error("Failed to fetch blob files")
      const data = await response.json()
      setBlobFiles(data.files.filter((f: BlobFile) => f.isImage))
    } catch (error) {
      console.error("Error fetching blob files:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlobFiles()
  }, [])

  // Filter products
  const filteredProducts = productMappings.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || product.type === selectedType
    return matchesSearch && matchesType
  })

  // Get unique product types
  const productTypes = Array.from(new Set(productsData.items.map((p) => p.type)))

  // Add blob image to product
  const addBlobImage = (productSlug: string, blobUrl: string) => {
    setProductMappings((prev) =>
      prev.map((product) =>
        product.slug === productSlug
          ? {
              ...product,
              blobImages: [...product.blobImages, blobUrl],
              primaryBlobImage: product.primaryBlobImage || blobUrl,
            }
          : product,
      ),
    )
  }

  // Remove blob image from product
  const removeBlobImage = (productSlug: string, blobUrl: string) => {
    setProductMappings((prev) =>
      prev.map((product) =>
        product.slug === productSlug
          ? {
              ...product,
              blobImages: product.blobImages.filter((url) => url !== blobUrl),
              primaryBlobImage: product.primaryBlobImage === blobUrl ? product.blobImages[0] : product.primaryBlobImage,
            }
          : product,
      ),
    )
  }

  // Set primary image
  const setPrimaryImage = (productSlug: string, blobUrl: string) => {
    setProductMappings((prev) =>
      prev.map((product) => (product.slug === productSlug ? { ...product, primaryBlobImage: blobUrl } : product)),
    )
  }

  // Save mappings (this would typically save to a database)
  const saveMappings = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Product mappings saved:", productMappings)
      alert("Product mappings saved successfully!")
    } catch (error) {
      console.error("Error saving mappings:", error)
      alert("Error saving mappings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Image Mapping</h1>
        <Button onClick={saveMappings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Mappings"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productMappings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mapped Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {productMappings.filter((p) => p.blobImages.length > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{blobFiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unmapped Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {productMappings.filter((p) => p.blobImages.length === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="type">Filter by Type</Label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Types</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.slug} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {product.type}
                  </Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Images
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Add Images to {product.title}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh]">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {blobFiles.map((file) => (
                          <div key={file.url} className="space-y-2">
                            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={file.url || "/placeholder.svg"}
                                alt={file.filename}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                                onClick={() => addBlobImage(product.slug, file.url)}
                              />
                            </div>
                            <p className="text-xs text-center truncate" title={file.filename}>
                              {file.filename}
                            </p>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => addBlobImage(product.slug, file.url)}
                              disabled={product.blobImages.includes(file.url)}
                            >
                              {product.blobImages.includes(file.url) ? "Added" : "Add"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Static Image */}
              <div>
                <Label className="text-sm font-medium">Current Static Image</Label>
                <div className="mt-2 aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={product.currentImage || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Blob Images */}
              {product.blobImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">
                    Blob Images ({product.blobImages.length})
                    {product.primaryBlobImage && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Primary Set
                      </Badge>
                    )}
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {product.blobImages.map((imageUrl, index) => (
                      <div key={imageUrl} className="relative group">
                        <div
                          className={`aspect-video bg-gray-100 rounded-md overflow-hidden border-2 ${
                            product.primaryBlobImage === imageUrl ? "border-blue-500" : "border-transparent"
                          }`}
                        >
                          <img
                            src={imageUrl || "/placeholder.svg"}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => setPrimaryImage(product.slug, imageUrl)}
                            title="Set as primary"
                          >
                            <ImageIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeBlobImage(product.slug, imageUrl)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.blobImages.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No blob images assigned</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

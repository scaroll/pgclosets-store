"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Upload, Check } from "lucide-react"
import Image from "next/image"
import productsData from "@/data/products.json"

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

interface Product {
  slug: string
  title: string
  type: string
  priceMin: number
  priceMax?: number
  image: string
  badges?: string[]
}

export default function ClientPage() {
  const [products, setProducts] = useState<Product[]>(productsData.items)
  const [blobFiles, setBlobFiles] = useState<BlobFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlobFiles()
  }, [])

  const fetchBlobFiles = async () => {
    try {
      const response = await fetch("/api/list")
      if (response.ok) {
        const data = await response.json()
        setBlobFiles(data.blobs || [])
      }
    } catch (error) {
      console.error("Failed to fetch blob files:", error)
    } finally {
      setLoading(false)
    }
  }

  const assignImageToProduct = async (productSlug: string, imageUrl: string) => {
    // Update local state
    setProducts((prev) =>
      prev.map((product) => (product.slug === productSlug ? { ...product, image: imageUrl } : product)),
    )

    // Here you would typically save to a database or update the JSON file
    console.log(`Assigned ${imageUrl} to product ${productSlug}`)
    setSelectedProduct(null)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isImageFromBlob = (imageUrl: string) => {
    return imageUrl.includes("blob.vercel-storage.com")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pg-dark mb-2">Product Image Management</h1>
        <p className="text-pg-gray">Assign uploaded images from Blob storage to your products</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pg-gray w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.slug} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              {isImageFromBlob(product.image) && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Blob Image
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{product.title}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{product.type}</Badge>
                <span className="text-sm text-pg-gray">
                  ${product.priceMin}
                  {product.priceMax ? ` - $${product.priceMax}` : ""}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isImageFromBlob(product.image) ? "Change Image" : "Assign Image"}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Image for {product.title}</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {loading ? (
                      <div className="col-span-full text-center py-8">Loading images...</div>
                    ) : blobFiles.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-pg-gray">
                        No images uploaded yet. Upload some images first.
                      </div>
                    ) : (
                      blobFiles.map((file) => (
                        <div
                          key={file.url}
                          className="relative aspect-square cursor-pointer border-2 border-transparent hover:border-pg-navy rounded-lg overflow-hidden"
                          onClick={() => assignImageToProduct(product.slug, file.url)}
                        >
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.pathname}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Button size="sm" className="opacity-0 hover:opacity-100 transition-opacity">
                              Select
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                            {file.pathname.split("/").pop()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-pg-gray">No products found matching your search.</p>
        </div>
      )}
    </div>
  )
}

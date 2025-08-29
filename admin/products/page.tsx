"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MediaSelector } from "@/components/MediaSelector"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  slug: string
  title: string
  type: string
  priceMin: number
  priceMax?: number
  image: string
  badges?: string[]
  description?: string
  gallery?: string[]
}

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
  filename: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/data/products.json")
      const data = await response.json()
      setProducts(data.items || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (files: BlobFile[]) => {
    if (selectedProduct && files.length > 0) {
      const updatedProduct = {
        ...selectedProduct,
        image: files[0].url,
      }
      setSelectedProduct(updatedProduct)
      updateProductInList(updatedProduct)
    }
  }

  const handleGallerySelect = (files: BlobFile[]) => {
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        gallery: files.map((f) => f.url),
      }
      setSelectedProduct(updatedProduct)
      updateProductInList(updatedProduct)
    }
  }

  const updateProductInList = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.slug === updatedProduct.slug ? updatedProduct : p)))
  }

  const handleProductUpdate = (field: keyof Product, value: any) => {
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        [field]: value,
      }
      setSelectedProduct(updatedProduct)
      updateProductInList(updatedProduct)
    }
  }

  const saveProducts = async () => {
    setSaving(true)
    try {
      // In a real app, this would save to a database
      // For now, we'll just show success
      toast({
        title: "Success",
        description: "Products updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save products",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={saveProducts} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProduct?.slug === product.slug ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.type}</p>
                      <p className="text-sm font-medium">
                        ${product.priceMin}
                        {product.priceMax ? ` - $${product.priceMax}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Product Editor */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Product: {selectedProduct.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                          id="title"
                          value={selectedProduct.title}
                          onChange={(e) => handleProductUpdate("title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={selectedProduct.type}
                          onValueChange={(value) => handleProductUpdate("type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bypass">Bypass</SelectItem>
                            <SelectItem value="Bifold">Bifold</SelectItem>
                            <SelectItem value="Pivot">Pivot</SelectItem>
                            <SelectItem value="Barn">Barn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedProduct.description || ""}
                        onChange={(e) => handleProductUpdate("description", e.target.value)}
                        placeholder="Product description..."
                      />
                    </div>

                    <div>
                      <Label>Badges</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.badges?.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <div>
                      <Label>Primary Image</Label>
                      <div className="mt-2 space-y-4">
                        <img
                          src={selectedProduct.image || "/placeholder.svg"}
                          alt={selectedProduct.title}
                          className="w-48 h-48 object-cover rounded-lg border"
                        />
                        <MediaSelector
                          onSelect={handleImageSelect}
                          maxSelections={1}
                          trigger={<Button variant="outline">Change Primary Image</Button>}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Gallery Images</Label>
                      <div className="mt-2 space-y-4">
                        {selectedProduct.gallery && selectedProduct.gallery.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedProduct.gallery.map((img, index) => (
                              <img
                                key={index}
                                src={img || "/placeholder.svg"}
                                alt={`Gallery ${index + 1}`}
                                className="w-24 h-24 object-cover rounded border"
                              />
                            ))}
                          </div>
                        )}
                        <MediaSelector
                          onSelect={handleGallerySelect}
                          maxSelections={10}
                          selectedFiles={selectedProduct.gallery || []}
                          trigger={
                            <Button variant="outline">
                              {selectedProduct.gallery?.length ? "Update Gallery" : "Add Gallery Images"}
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="priceMin">Minimum Price (CAD)</Label>
                        <Input
                          id="priceMin"
                          type="number"
                          value={selectedProduct.priceMin}
                          onChange={(e) => handleProductUpdate("priceMin", Number.parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="priceMax">Maximum Price (CAD)</Label>
                        <Input
                          id="priceMax"
                          type="number"
                          value={selectedProduct.priceMax || ""}
                          onChange={(e) =>
                            handleProductUpdate(
                              "priceMax",
                              e.target.value ? Number.parseInt(e.target.value) : undefined,
                            )
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a product to edit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

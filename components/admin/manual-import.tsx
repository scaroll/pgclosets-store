"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save } from "lucide-react"
import { useState } from "react"

export function ManualImport() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    sku: "",
    category_id: "",
    base_price: "",
    sale_price: "",
    weight: "",
    dimensions: { width: "", height: "", depth: "" },
    materials: "",
    finishes: "",
    features: "",
    stock_quantity: "0",
    is_active: true,
    is_featured: false,
  })

  const [saving, setSaving] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDimensionChange = (dimension: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value,
      },
    }))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          base_price: formData.base_price ? Number.parseFloat(formData.base_price) : null,
          sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price) : null,
          weight: formData.weight ? Number.parseFloat(formData.weight) : null,
          dimensions: {
            width: formData.dimensions.width ? Number.parseFloat(formData.dimensions.width) : null,
            height: formData.dimensions.height ? Number.parseFloat(formData.dimensions.height) : null,
            depth: formData.dimensions.depth ? Number.parseFloat(formData.dimensions.depth) : null,
            unit: "inches",
          },
          materials: formData.materials
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
          finishes: formData.finishes
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
          stock_quantity: Number.parseInt(formData.stock_quantity),
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          short_description: "",
          sku: "",
          category_id: "",
          base_price: "",
          sale_price: "",
          weight: "",
          dimensions: { width: "", height: "", depth: "" },
          materials: "",
          finishes: "",
          features: "",
          stock_quantity: "0",
          is_active: true,
          is_featured: false,
        })
        alert("Product saved successfully!")
      } else {
        alert("Failed to save product")
      }
    } catch (error) {
      alert("Error saving product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Classic Barn Door - Single Panel"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="classic-barn-door-single"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="BD-CLASSIC-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-doors">Single Doors</SelectItem>
                  <SelectItem value="double-doors">Double Doors</SelectItem>
                  <SelectItem value="bypass-doors">Bypass Doors</SelectItem>
                  <SelectItem value="walk-in-closets">Walk-in Closets</SelectItem>
                  <SelectItem value="reach-in-closets">Reach-in Closets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange("base_price", e.target.value)}
                  placeholder="299.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale_price">Sale Price</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => handleInputChange("sale_price", e.target.value)}
                  placeholder="279.99"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="45.5"
              />
            </div>

            <div className="space-y-2">
              <Label>Dimensions (inches)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                />
                <Input
                  placeholder="Height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange("height", e.target.value)}
                />
                <Input
                  placeholder="Depth"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.depth}
                  onChange={(e) => handleDimensionChange("depth", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleInputChange("short_description", e.target.value)}
              placeholder="Solid wood single panel barn door with rustic charm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Premium single panel barn door crafted from solid wood with authentic rustic styling..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="materials">Materials (comma-separated)</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => handleInputChange("materials", e.target.value)}
                placeholder="Solid Wood, Pine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finishes">Finishes (comma-separated)</Label>
              <Input
                id="finishes"
                value={formData.finishes}
                onChange={(e) => handleInputChange("finishes", e.target.value)}
                placeholder="Natural, Stained, Weathered"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                placeholder="Authentic Look, Space Saving"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked as boolean)}
              />
              <Label htmlFor="is_active">Active Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked as boolean)}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving || !formData.name} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Product"}
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Save & Add Another
        </Button>
      </div>
    </div>
  )
}

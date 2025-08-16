import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const supabase = createClient()
    const results = { success: 0, errors: [] as string[] }

    // Get categories for mapping
    const { data: categories } = await supabase.from("categories").select("id, slug")
    const categoryMap = new Map(categories?.map((c) => [c.slug, c.id]) || [])

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const row: Record<string, string> = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Map category slug to ID
        const categoryId = categoryMap.get(row.category_slug)
        if (!categoryId && row.category_slug) {
          results.errors.push(`Row ${i + 1}: Category '${row.category_slug}' not found`)
          continue
        }

        const productData = {
          name: row.name,
          slug: row.slug,
          description: row.description,
          short_description: row.short_description,
          sku: row.sku,
          category_id: categoryId,
          base_price: row.base_price ? Number.parseFloat(row.base_price) : null,
          sale_price: row.sale_price ? Number.parseFloat(row.sale_price) : null,
          weight: row.weight ? Number.parseFloat(row.weight) : null,
          dimensions: {
            width: row.width ? Number.parseFloat(row.width) : null,
            height: row.height ? Number.parseFloat(row.height) : null,
            depth: row.depth ? Number.parseFloat(row.depth) : null,
            unit: "inches",
          },
          materials: row.materials ? row.materials.split(",").map((m) => m.trim()) : [],
          finishes: row.finishes ? row.finishes.split(",").map((f) => f.trim()) : [],
          features: row.features ? row.features.split(",").map((f) => f.trim()) : [],
          stock_quantity: row.stock_quantity ? Number.parseInt(row.stock_quantity) : 0,
          is_active: row.is_active === "true",
          is_featured: row.is_featured === "true",
        }

        const { error } = await supabase.from("products").insert([productData])

        if (error) {
          results.errors.push(`Row ${i + 1}: ${error.message}`)
        } else {
          results.success++
        }
      } catch (error) {
        results.errors.push(`Row ${i + 1}: Invalid data format`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process CSV file" }, { status: 500 })
  }
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  sku: string | null
  base_price: number | null
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  categories?: {
    name: string
  } | null
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  {product.is_featured && (
                    <Badge variant="secondary" className="w-fit mt-1">
                      Featured
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{product.sku || "N/A"}</TableCell>
              <TableCell className="text-gray-600">{product.categories?.name || "Uncategorized"}</TableCell>
              <TableCell className="font-medium">{formatPrice(product.base_price)}</TableCell>
              <TableCell>
                <span className={`${product.stock_quantity <= 5 ? "text-red-600" : "text-gray-900"}`}>
                  {product.stock_quantity}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

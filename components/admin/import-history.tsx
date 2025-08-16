"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, RefreshCw } from "lucide-react"

interface ImportRecord {
  id: string
  type: "csv" | "manual" | "scrape"
  filename?: string
  products_imported: number
  errors: number
  status: "completed" | "failed" | "partial"
  created_at: string
}

export function ImportHistory() {
  // Mock data - in real app, fetch from API
  const imports: ImportRecord[] = [
    {
      id: "1",
      type: "csv",
      filename: "renin-products-batch1.csv",
      products_imported: 25,
      errors: 2,
      status: "partial",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "manual",
      products_imported: 5,
      errors: 0,
      status: "completed",
      created_at: "2024-01-14T15:45:00Z",
    },
    {
      id: "3",
      type: "scrape",
      products_imported: 0,
      errors: 1,
      status: "failed",
      created_at: "2024-01-14T09:15:00Z",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "csv":
        return <FileText className="h-4 w-4" />
      case "manual":
        return <FileText className="h-4 w-4" />
      case "scrape":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Recent import activities and their results</p>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Errors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {imports.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.type)}
                    <span className="capitalize">{record.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{record.filename || "Manual entry"}</div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{record.products_imported}</span>
                </TableCell>
                <TableCell>
                  <span className={record.errors > 0 ? "text-red-600" : "text-gray-600"}>{record.errors}</span>
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{new Date(record.created_at).toLocaleDateString()}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {imports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No import history yet</p>
          <p className="text-sm">Start importing products to see your activity here</p>
        </div>
      )}
    </div>
  )
}

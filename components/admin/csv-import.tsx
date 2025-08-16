"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

export function CsvImport() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/import/csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      setProgress(100)
      setResult(data)
    } catch (error) {
      setResult({ success: 0, errors: ["Import failed. Please try again."] })
    } finally {
      setImporting(false)
      clearInterval(interval)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `name,slug,description,short_description,sku,category_slug,base_price,sale_price,weight,width,height,depth,materials,finishes,features,stock_quantity,is_active,is_featured
"Classic Barn Door - Single Panel","classic-barn-door-single","Premium single panel barn door crafted from solid wood","Solid wood single panel barn door","BD-CLASSIC-001","single-doors",299.99,279.99,45,36,84,1.5,"Solid Wood,Pine","Natural,Stained","Authentic Look,Space Saving",15,true,true
"Modern Flush Barn Door","modern-flush-barn-door","Sleek contemporary flush barn door","Contemporary flush design","BD-MODERN-001","single-doors",349.99,,35,32,80,1.375,"MDF,Composite","Painted,Laminate","Smooth Surface,Modern Design",8,true,false`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "product-import-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload a CSV file with product data to bulk import products. Make sure your CSV follows the required format.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <span className="text-sm text-gray-600">Download the CSV template to see the required format</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>Selected file:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        )}

        {importing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Importing products...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {result && (
          <Alert className={result.errors.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            {result.errors.length > 0 ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription>
              {result.success > 0 && (
                <p className="text-green-700 mb-2">Successfully imported {result.success} products.</p>
              )}
              {result.errors.length > 0 && (
                <div>
                  <p className="text-red-700 mb-2">Errors encountered:</p>
                  <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleImport} disabled={!file || importing} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {importing ? "Importing..." : "Import Products"}
        </Button>
      </div>
    </div>
  )
}

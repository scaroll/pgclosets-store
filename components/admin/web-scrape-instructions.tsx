"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Code, ExternalLink, Globe } from "lucide-react"
import { useState } from "react"

export function WebScrapeInstructions() {
  const [url, setUrl] = useState("")
  const [scraping, setScraping] = useState(false)

  const handleScrape = async () => {
    if (!url) return

    setScraping(true)
    try {
      // This would attempt to scrape the URL
      const response = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      console.log("Scrape result:", data)
    } catch (error) {
      console.error("Scraping failed:", error)
    } finally {
      setScraping(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Many websites (including renin.com) have anti-bot protection. Manual content transfer may be more reliable.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Automated Scraping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scrape-url">Website URL</Label>
              <Input
                id="scrape-url"
                placeholder="https://renin.com/products"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleScrape} disabled={!url || scraping} className="w-full">
              {scraping ? "Scraping..." : "Attempt Scrape"}
            </Button>
            <p className="text-sm text-gray-600">
              This will attempt to extract product information automatically. Success depends on the website's structure
              and anti-bot measures.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Manual Browser Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <strong>Step 1:</strong> Open renin.com in your browser
              </div>
              <div>
                <strong>Step 2:</strong> Navigate to product pages
              </div>
              <div>
                <strong>Step 3:</strong> Copy product details manually
              </div>
              <div>
                <strong>Step 4:</strong> Use the Manual Entry tab to add products
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="https://renin.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Renin.com
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browser Extension Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              For more efficient content transfer, you can use browser extensions or custom scripts:
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Label htmlFor="scrape-script">Custom Scraping Script</Label>
              <Textarea
                id="scrape-script"
                className="mt-2 font-mono text-xs"
                rows={10}
                readOnly
                value={`// Run this in browser console on product pages
function extractProductData() {
  return {
    name: document.querySelector('h1')?.textContent?.trim(),
    description: document.querySelector('.product-description')?.textContent?.trim(),
    price: document.querySelector('.price')?.textContent?.trim(),
    images: Array.from(document.querySelectorAll('img')).map(img => img.src),
    specifications: Array.from(document.querySelectorAll('.spec-item')).map(item => ({
      key: item.querySelector('.spec-key')?.textContent?.trim(),
      value: item.querySelector('.spec-value')?.textContent?.trim()
    }))
  };
}

// Copy result to clipboard
copy(JSON.stringify(extractProductData(), null, 2));`}
              />
            </div>

            <Alert>
              <Code className="h-4 w-4" />
              <AlertDescription>
                Paste this script in your browser's developer console while on a product page to extract data
                automatically.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

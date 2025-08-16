"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Code, ImageIcon, FileText } from "lucide-react"

export default function MediaExtractionPage() {
  const [extractedUrls, setExtractedUrls] = useState<string[]>([])
  const [bulkUrls, setBulkUrls] = useState("")

  const browserScript = `
// Renin Media Extractor Script
// Run this in the browser console on renin.com pages

(function() {
  const mediaUrls = new Set();
  
  // Extract all images
  document.querySelectorAll('img').forEach(img => {
    if (img.src && !img.src.includes('data:')) {
      mediaUrls.add(img.src);
    }
    if (img.srcset) {
      img.srcset.split(',').forEach(src => {
        const url = src.trim().split(' ')[0];
        if (url && !url.includes('data:')) {
          mediaUrls.add(url);
        }
      });
    }
  });
  
  // Extract background images from CSS
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      const matches = bgImage.match(/url\$$["']?([^"')]+)["']?\$$/g);
      if (matches) {
        matches.forEach(match => {
          const url = match.replace(/url\$$["']?([^"')]+)["']?\$$/, '$1');
          if (!url.includes('data:')) {
            mediaUrls.add(url);
          }
        });
      }
    }
  });
  
  // Extract videos
  document.querySelectorAll('video, source').forEach(video => {
    if (video.src) mediaUrls.add(video.src);
  });
  
  // Extract from picture elements
  document.querySelectorAll('picture source').forEach(source => {
    if (source.srcset) {
      source.srcset.split(',').forEach(src => {
        const url = src.trim().split(' ')[0];
        if (url && !url.includes('data:')) {
          mediaUrls.add(url);
        }
      });
    }
  });
  
  const urls = Array.from(mediaUrls).filter(url => 
    url.match(/\\.(jpg|jpeg|png|gif|webp|svg|mp4|mov|avi|pdf)$/i)
  );
  
  console.log('Found', urls.length, 'media files:');
  console.log(urls);
  
  // Copy to clipboard
  navigator.clipboard.writeText(urls.join('\\n')).then(() => {
    console.log('URLs copied to clipboard!');
  });
  
  return urls;
})();
`

  const downloadScript = `
// Bulk Download Script
// Run after extracting URLs to download all media

const urls = [
  // Paste your extracted URLs here
];

async function downloadMedia() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = url.split('/').pop() || \`media_\${i}\`;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      
      console.log(\`Downloaded: \${filename}\`);
      
      // Delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(\`Failed to download \${url}:\`, error);
    }
  }
}

downloadMedia();
`

  const handleBulkImport = () => {
    const urls = bulkUrls.split("\n").filter((url) => url.trim())
    setExtractedUrls((prev) => [...new Set([...prev, ...urls])])
    setBulkUrls("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Extraction Tools</h1>
        <p className="text-muted-foreground">Extract all media assets from Renin's website</p>
      </div>

      <Tabs defaultValue="browser" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browser">Browser Scripts</TabsTrigger>
          <TabsTrigger value="manual">Manual Tools</TabsTrigger>
          <TabsTrigger value="organize">Organize Media</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Browser Console Scripts
              </CardTitle>
              <CardDescription>Run these scripts in your browser console while on Renin's website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Media Extraction Script</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{browserScript}</pre>
                </div>
                <Button onClick={() => navigator.clipboard.writeText(browserScript)} className="mt-2" size="sm">
                  Copy Script
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 2: Bulk Download Script</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{downloadScript}</pre>
                </div>
                <Button onClick={() => navigator.clipboard.writeText(downloadScript)} className="mt-2" size="sm">
                  Copy Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Manual Media Import
              </CardTitle>
              <CardDescription>Import media URLs manually or in bulk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bulk URL Import</label>
                <Textarea
                  placeholder="Paste media URLs here (one per line)..."
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  rows={10}
                />
                <Button onClick={handleBulkImport} className="mt-2">
                  Import URLs
                </Button>
              </div>

              {extractedUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Extracted URLs ({extractedUrls.length})</h3>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {extractedUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-sm flex-1 truncate">{url}</span>
                        <Badge variant="outline">
                          {url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
                            ? "Image"
                            : url.match(/\.(mp4|mov|avi)$/i)
                              ? "Video"
                              : "Other"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Media Organization
              </CardTitle>
              <CardDescription>Organize and categorize extracted media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Main product photos, lifestyle shots</p>
                    <div className="space-y-2">
                      <Input placeholder="Category: Barn Doors" />
                      <Input placeholder="Subcategory: Rustic Style" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Technical Specs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Dimension drawings, installation guides</p>
                    <div className="space-y-2">
                      <Input placeholder="Type: Installation Guide" />
                      <Input placeholder="Product: Closet System" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Marketing Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Banners, logos, promotional content</p>
                    <div className="space-y-2">
                      <Input placeholder="Usage: Homepage Banner" />
                      <Input placeholder="Campaign: Spring 2025" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Step-by-Step Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold">Navigate to Renin.com</h4>
                    <p className="text-sm text-muted-foreground">
                      Visit renin.com and browse to product pages you want to extract media from
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold">Open Browser Console</h4>
                    <p className="text-sm text-muted-foreground">Press F12 or right-click → Inspect → Console tab</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold">Run Extraction Script</h4>
                    <p className="text-sm text-muted-foreground">
                      Copy and paste the media extraction script from the Browser Scripts tab
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <h4 className="font-semibold">Collect URLs</h4>
                    <p className="text-sm text-muted-foreground">
                      The script will copy all media URLs to your clipboard automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">5</Badge>
                  <div>
                    <h4 className="font-semibold">Import to System</h4>
                    <p className="text-sm text-muted-foreground">
                      Paste the URLs into the Manual Tools tab to organize and process them
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">6</Badge>
                  <div>
                    <h4 className="font-semibold">Download Media</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the bulk download script or download individual files as needed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Visit multiple product category pages to get comprehensive coverage</li>
                  <li>• Check both desktop and mobile versions for different image sizes</li>
                  <li>• Look for high-resolution images in product galleries</li>
                  <li>• Save technical specifications and installation guides</li>
                  <li>• Organize by product category for easier management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

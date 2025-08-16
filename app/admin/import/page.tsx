import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CsvImport } from "@/components/admin/csv-import"
import { WebScrapeInstructions } from "@/components/admin/web-scrape-instructions"
import { ManualImport } from "@/components/admin/manual-import"
import { ImportHistory } from "@/components/admin/import-history"
import { Download, FileText, Globe, Plus } from "lucide-react"

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Import Tools</h1>
        <p className="text-gray-600 mt-2">Import products from various sources to build your catalog</p>
      </div>

      <Tabs defaultValue="csv" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            CSV Import
          </TabsTrigger>
          <TabsTrigger value="scrape" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Web Scraping
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Import History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>CSV Bulk Import</CardTitle>
            </CardHeader>
            <CardContent>
              <CsvImport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrape">
          <Card>
            <CardHeader>
              <CardTitle>Web Scraping Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <WebScrapeInstructions />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Product Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <ManualImport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

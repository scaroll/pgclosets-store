"use client"

import React from "react"
import Link from "next/link"
import { Ruler, Info, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface SizeGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productType?: "sliding" | "bifold" | "hinged" | "all"
}

export function SizeGuideModal({
  open,
  onOpenChange,
  productType = "all",
}: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ruler className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Door Size Guide</DialogTitle>
              <DialogDescription className="mt-1">
                Find the perfect fit for your closet opening
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="chart" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Size Chart</TabsTrigger>
            <TabsTrigger value="measure">How to Measure</TabsTrigger>
            <TabsTrigger value="tips">Tips & FAQs</TabsTrigger>
          </TabsList>

          {/* SIZE CHART TAB */}
          <TabsContent value="chart" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <strong>Important:</strong> These are standard sizes. Custom sizes are
                  available for non-standard openings. Measure your opening carefully
                  before ordering.
                </div>
              </div>

              {/* Sliding Doors Section */}
              {(productType === "all" || productType === "sliding") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Sliding Doors</h3>
                    <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Width
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Height
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Door Configuration
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Recommended Size
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">48" - 60"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">48" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">60" - 72"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">60" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">72" - 84"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">72" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">84" - 96"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">96" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50 bg-blue-50">
                          <td className="px-4 py-3">96" - 144"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">
                            3-4 Panel
                            <Badge variant="default" className="ml-2 text-[10px] px-2 py-0.5">
                              Custom
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-medium">Contact for quote</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bifold Doors Section */}
              {(productType === "all" || productType === "bifold") && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Bifold Doors</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Width
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Height
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Door Configuration
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Recommended Size
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">24" - 36"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">30" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">36" - 48"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">2 Panel</td>
                          <td className="px-4 py-3 font-medium">36" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">48" - 72"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">4 Panel</td>
                          <td className="px-4 py-3 font-medium">60" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">72" - 96"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">4-6 Panel</td>
                          <td className="px-4 py-3 font-medium">84" × 80"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hinged Doors Section */}
              {(productType === "all" || productType === "hinged") && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Hinged Doors</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Width
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Opening Height
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Door Configuration
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Recommended Size
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">24" - 32"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">Single Door</td>
                          <td className="px-4 py-3 font-medium">30" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">48" - 60"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">Double Door</td>
                          <td className="px-4 py-3 font-medium">60" × 80"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3">60" - 72"</td>
                          <td className="px-4 py-3">80" - 96"</td>
                          <td className="px-4 py-3">Double Door</td>
                          <td className="px-4 py-3 font-medium">72" × 80"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* HOW TO MEASURE TAB */}
          <TabsContent value="measure" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Visual Diagram */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Measuring Your Opening</h3>
                <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
                  <MeasurementDiagram />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Always measure width and height at multiple points
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step-by-Step Guide</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Measure the Width</h4>
                      <p className="text-sm text-muted-foreground">
                        Measure the width of the opening at the top, middle, and bottom.
                        Use the smallest measurement to ensure proper fit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Measure the Height</h4>
                      <p className="text-sm text-muted-foreground">
                        Measure the height on both the left and right sides. Again, use
                        the smallest measurement for your door size.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Check the Depth</h4>
                      <p className="text-sm text-muted-foreground">
                        Measure the depth of the opening to ensure there's sufficient
                        clearance for the door type you're selecting.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Verify Squareness</h4>
                      <p className="text-sm text-muted-foreground">
                        Measure diagonally from corner to corner. If measurements differ
                        significantly, the opening may need adjustment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Account for Obstructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Check for light switches, outlets, or other obstructions that
                        might interfere with door operation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Needed */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Tools You'll Need</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Tape Measure</span>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Pencil & Paper</span>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Square (Optional)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TIPS & FAQs TAB */}
          <TabsContent value="tips" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Measuring Tips</h3>

              <div className="space-y-3">
                <div className="flex gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-green-900">Always round down:</strong>
                    <span className="text-green-800 ml-1">
                      When choosing a door size, select the next size down from your
                      measurement to ensure proper fit and operation.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-green-900">Measure twice, order once:</strong>
                    <span className="text-green-800 ml-1">
                      Double-check all measurements before placing your order. Custom
                      doors are non-returnable.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-green-900">Consider professional help:</strong>
                    <span className="text-green-800 ml-1">
                      For complex openings or custom installations, we recommend
                      professional measurement and installation.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="text-amber-900">Watch for tolerances:</strong>
                    <span className="text-amber-800 ml-1">
                      Allow for 1/4" to 1/2" clearance on all sides for proper door
                      operation and adjustment.
                    </span>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      What if my opening is not a standard size?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We offer custom sizing for non-standard openings. Contact us with
                      your measurements for a personalized quote and timeline.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      How much clearance do I need for sliding doors?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sliding doors typically require 2-3 inches of clearance above the
                      opening for the track system and at least 3 inches of wall space on
                      one side for door overlap.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      Can I install doors if my opening is out of square?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Minor variations (up to 1/4") can usually be accommodated with shims
                      and adjustments. For larger discrepancies, we recommend framing
                      corrections before installation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      Do you offer professional measurement services?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer complimentary in-home measurement services for projects
                      over $500. Schedule an appointment through our contact page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button asChild variant="default" className="flex-1">
            <Link href="/request-quote">
              <Ruler className="w-4 h-4" />
              Request Professional Measurement
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/installation-guide">
              <ExternalLink className="w-4 h-4" />
              View Full Installation Guide
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-center text-muted-foreground pt-4 border-t">
          Need help? Call us at{" "}
          <Link href="tel:1-800-555-0100" className="text-primary hover:underline">
            1-800-555-0100
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact us online
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Measurement Diagram Component
// ============================================================================
function MeasurementDiagram() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Opening Frame */}
      <rect
        x="50"
        y="30"
        width="300"
        height="240"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
      />

      {/* Door Panel */}
      <rect
        x="70"
        y="50"
        width="130"
        height="200"
        fill="#e0e7ff"
        stroke="#6366f1"
        strokeWidth="2"
        opacity="0.6"
      />
      <rect
        x="200"
        y="50"
        width="130"
        height="200"
        fill="#e0e7ff"
        stroke="#6366f1"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Width Measurement - Top */}
      <g>
        <line
          x1="50"
          y1="15"
          x2="350"
          y2="15"
          stroke="#ef4444"
          strokeWidth="2"
          markerStart="url(#arrowhead-left)"
          markerEnd="url(#arrowhead-right)"
        />
        <text x="200" y="12" textAnchor="middle" fontSize="14" fill="#dc2626" fontWeight="bold">
          WIDTH
        </text>
      </g>

      {/* Height Measurement - Left */}
      <g>
        <line
          x1="35"
          y1="30"
          x2="35"
          y2="270"
          stroke="#ef4444"
          strokeWidth="2"
          markerStart="url(#arrowhead-up)"
          markerEnd="url(#arrowhead-down)"
        />
        <text
          x="25"
          y="155"
          textAnchor="middle"
          fontSize="14"
          fill="#dc2626"
          fontWeight="bold"
          transform="rotate(-90, 25, 155)"
        >
          HEIGHT
        </text>
      </g>

      {/* Diagonal Measurement */}
      <line
        x1="50"
        y1="270"
        x2="350"
        y2="30"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        opacity="0.7"
      />
      <text x="210" y="160" fontSize="12" fill="#059669" fontWeight="600">
        Check Square
      </text>

      {/* Measurement Points */}
      <circle cx="50" cy="30" r="4" fill="#ef4444" />
      <circle cx="350" cy="30" r="4" fill="#ef4444" />
      <circle cx="50" cy="270" r="4" fill="#ef4444" />
      <circle cx="350" cy="270" r="4" fill="#ef4444" />

      {/* Arrow Markers */}
      <defs>
        <marker
          id="arrowhead-right"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-left"
          markerWidth="10"
          markerHeight="10"
          refX="1"
          refY="3"
          orient="auto"
        >
          <polygon points="10 0, 0 3, 10 6" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-down"
          markerWidth="10"
          markerHeight="10"
          refX="3"
          refY="9"
          orient="auto"
        >
          <polygon points="0 0, 3 10, 6 0" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-up"
          markerWidth="10"
          markerHeight="10"
          refX="3"
          refY="1"
          orient="auto"
        >
          <polygon points="0 10, 3 0, 6 10" fill="#ef4444" />
        </marker>
      </defs>

      {/* Labels */}
      <text x="200" y="290" textAnchor="middle" fontSize="12" fill="#64748b" fontStyle="italic">
        Standard Closet Opening
      </text>
    </svg>
  )
}

// ============================================================================
// Size Guide Trigger - Convenience component for triggering the modal
// ============================================================================
interface SizeGuideTriggerProps {
  productType?: "sliding" | "bifold" | "hinged" | "all"
  children?: React.ReactNode
  variant?: "default" | "outline" | "link" | "ghost"
  className?: string
}

export function SizeGuideTrigger({
  productType = "all",
  children,
  variant = "outline",
  className,
}: SizeGuideTriggerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant}
        className={cn(className)}
      >
        {children || (
          <>
            <Ruler className="w-4 h-4" />
            Size Guide
          </>
        )}
      </Button>

      <SizeGuideModal
        open={open}
        onOpenChange={setOpen}
        productType={productType}
      />
    </>
  )
}

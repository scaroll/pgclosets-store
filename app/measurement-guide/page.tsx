import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Measurement Guide - How to Measure for Closet Doors | PG Closets',
  description: 'Learn how to accurately measure your closet opening for barn doors, bifold doors, and bypass doors. Professional tips, video guides, and downloadable PDF measurement sheets.',
  keywords: 'closet door measurements, how to measure barn door, bifold door measurements, bypass door sizing, closet opening measurements, door installation guide Ottawa',
  openGraph: {
    title: 'Closet Door Measurement Guide | PG Closets Ottawa',
    description: 'Step-by-step guide to measuring your closet for perfect door installation. Professional tips and downloadable resources.',
    url: 'https://pgclosets.com/measurement-guide',
    type: 'article',
  },
  alternates: {
    canonical: '/measurement-guide',
  },
}

// Generate JSON-LD structured data for HowTo
function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Measure for Closet Doors",
    "description": "A comprehensive guide to measuring your closet opening for different types of doors including barn doors, bifold doors, and bypass doors.",
    "image": "https://pgclosets.com/measurement-guide-hero.jpg",
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "CAD",
      "value": "0"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Tape measure"
      },
      {
        "@type": "HowToTool",
        "name": "Pencil and paper"
      },
      {
        "@type": "HowToTool",
        "name": "Level (optional)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Measure the width",
        "text": "Measure the width of your closet opening from the inside of the left jamb to the inside of the right jamb at three points: top, middle, and bottom. Record the smallest measurement.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Measure the height",
        "text": "Measure the height from the top of the opening to the floor on both the left and right sides. Record the smallest measurement.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Check for square",
        "text": "Measure diagonally from corner to corner in both directions. The measurements should be equal if the opening is square.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Measure the depth",
        "text": "Measure the depth of the door jamb from front to back. This is important for determining hardware clearance.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "Record measurements",
        "text": "Write down all measurements clearly and double-check your work. When in doubt, measure twice.",
        "position": 5
      }
    ]
  }
}

export default function MeasurementGuidePage() {
  const howToSchema = generateHowToSchema()

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Professional Measurement Guide
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                How to Measure for Closet Doors
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Get accurate measurements for barn doors, bifold doors, and bypass doors. Follow our professional guide for perfect results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" className="text-lg" asChild>
                  <a href="#pdf-download">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF Guide
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg" asChild>
                  <a href="/book-measure">
                    Schedule Free Measurement
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Needed Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Tools You'll Need
                </h2>
                <p className="text-lg text-muted-foreground">
                  Gather these simple tools before you start
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tool 1 */}
                <Card className="apple-transition hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <CardTitle>Tape Measure</CardTitle>
                    <CardDescription className="text-sm">
                      25ft or longer recommended
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tool 2 */}
                <Card className="apple-transition hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <CardTitle>Pencil & Paper</CardTitle>
                    <CardDescription className="text-sm">
                      To record your measurements
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tool 3 */}
                <Card className="apple-transition hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <CardTitle>Level</CardTitle>
                    <CardDescription className="text-sm">
                      Optional but helpful
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tool 4 */}
                <Card className="apple-transition hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <CardTitle>Helper</CardTitle>
                    <CardDescription className="text-sm">
                      Makes measuring easier
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Step-by-Step Instructions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Follow these steps for accurate measurements
                </p>
              </div>

              <div className="space-y-8">
                {/* Step 1 */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          1
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">Measure the Width</h3>
                      </div>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                          Measure the width of your closet opening from the <strong className="text-foreground">inside</strong> of the left jamb to the <strong className="text-foreground">inside</strong> of the right jamb.
                        </p>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Take measurements at three points: <strong className="text-foreground">top, middle, and bottom</strong></li>
                          <li>Record all three measurements</li>
                          <li><strong className="text-foreground">Use the smallest measurement</strong> to account for variations</li>
                        </ul>
                        <div className="bg-primary/10 rounded-lg p-4 mt-6">
                          <p className="text-sm font-semibold text-primary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pro Tip
                          </p>
                          <p className="text-sm mt-2">Openings are rarely perfectly square. Multiple measurements ensure a proper fit.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted flex items-center justify-center p-8">
                      {/* Placeholder SVG Diagram */}
                      <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                        <rect x="50" y="20" width="300" height="260" fill="white" stroke="#0071E3" strokeWidth="3" rx="8"/>
                        <rect x="50" y="20" width="300" height="30" fill="#E5E5E7"/>

                        {/* Top measurement line */}
                        <line x1="60" y1="40" x2="340" y2="40" stroke="#0071E3" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-reverse)"/>
                        <text x="200" y="35" textAnchor="middle" fill="#0071E3" fontSize="14" fontWeight="bold">Width (Top)</text>

                        {/* Middle measurement line */}
                        <line x1="60" y1="150" x2="340" y2="150" stroke="#FF3B30" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" markerStart="url(#arrowhead-reverse-red)"/>
                        <text x="200" y="145" textAnchor="middle" fill="#FF3B30" fontSize="14" fontWeight="bold">Width (Middle)</text>

                        {/* Bottom measurement line */}
                        <line x1="60" y1="260" x2="340" y2="260" stroke="#34C759" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-reverse-green)"/>
                        <text x="200" y="255" textAnchor="middle" fill="#34C759" fontSize="14" fontWeight="bold">Width (Bottom)</text>

                        <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#0071E3" />
                          </marker>
                          <marker id="arrowhead-reverse" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                            <polygon points="10 0, 0 3, 10 6" fill="#0071E3" />
                          </marker>
                          <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#FF3B30" />
                          </marker>
                          <marker id="arrowhead-reverse-red" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                            <polygon points="10 0, 0 3, 10 6" fill="#FF3B30" />
                          </marker>
                          <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#34C759" />
                          </marker>
                          <marker id="arrowhead-reverse-green" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                            <polygon points="10 0, 0 3, 10 6" fill="#34C759" />
                          </marker>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </Card>

                {/* Step 2 */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-muted flex items-center justify-center p-8 order-2 md:order-1">
                      {/* Placeholder SVG Diagram */}
                      <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                        <rect x="100" y="20" width="200" height="260" fill="white" stroke="#0071E3" strokeWidth="3" rx="8"/>

                        {/* Left height measurement */}
                        <line x1="80" y1="30" x2="80" y2="270" stroke="#0071E3" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-reverse)"/>
                        <text x="50" y="150" textAnchor="middle" fill="#0071E3" fontSize="14" fontWeight="bold" transform="rotate(-90 50 150)">Height (Left)</text>

                        {/* Right height measurement */}
                        <line x1="320" y1="30" x2="320" y2="270" stroke="#FF3B30" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-red)" markerStart="url(#arrowhead-reverse-red)"/>
                        <text x="350" y="150" textAnchor="middle" fill="#FF3B30" fontSize="14" fontWeight="bold" transform="rotate(90 350 150)">Height (Right)</text>

                        {/* Floor line */}
                        <line x1="50" y1="280" x2="350" y2="280" stroke="#666" strokeWidth="2"/>
                        <text x="200" y="295" textAnchor="middle" fill="#666" fontSize="12">Floor</text>
                      </svg>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          2
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">Measure the Height</h3>
                      </div>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                          Measure from the top of the opening to the floor on <strong className="text-foreground">both sides</strong> of the opening.
                        </p>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Measure on the <strong className="text-foreground">left side</strong></li>
                          <li>Measure on the <strong className="text-foreground">right side</strong></li>
                          <li>Record both measurements</li>
                          <li><strong className="text-foreground">Use the smallest measurement</strong></li>
                        </ul>
                        <div className="bg-amber-500/10 rounded-lg p-4 mt-6">
                          <p className="text-sm font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Important
                          </p>
                          <p className="text-sm mt-2">Floors are often not level. Measuring both sides prevents installation issues.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Step 3 */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          3
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">Check for Square</h3>
                      </div>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                          Measure diagonally from corner to corner to determine if the opening is square.
                        </p>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Measure from <strong className="text-foreground">top-left to bottom-right</strong></li>
                          <li>Measure from <strong className="text-foreground">top-right to bottom-left</strong></li>
                          <li>If measurements are equal (within 1/4"), the opening is square</li>
                          <li>If not equal, note the difference on your measurement sheet</li>
                        </ul>
                        <div className="bg-primary/10 rounded-lg p-4 mt-6">
                          <p className="text-sm font-semibold text-primary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Why This Matters
                          </p>
                          <p className="text-sm mt-2">Knowing if your opening is out of square helps us make necessary adjustments during installation.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted flex items-center justify-center p-8">
                      {/* Placeholder SVG Diagram */}
                      <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                        <rect x="50" y="20" width="300" height="260" fill="white" stroke="#0071E3" strokeWidth="3" rx="8"/>

                        {/* Diagonal 1 */}
                        <line x1="50" y1="20" x2="350" y2="280" stroke="#0071E3" strokeWidth="2" strokeDasharray="8,4"/>
                        <text x="200" y="130" textAnchor="middle" fill="#0071E3" fontSize="14" fontWeight="bold" transform="rotate(-45 200 150)">Diagonal 1</text>

                        {/* Diagonal 2 */}
                        <line x1="350" y1="20" x2="50" y2="280" stroke="#FF3B30" strokeWidth="2" strokeDasharray="8,4"/>
                        <text x="200" y="170" textAnchor="middle" fill="#FF3B30" fontSize="14" fontWeight="bold" transform="rotate(45 200 150)">Diagonal 2</text>

                        {/* Corner dots */}
                        <circle cx="50" cy="20" r="6" fill="#0071E3"/>
                        <circle cx="350" cy="20" r="6" fill="#FF3B30"/>
                        <circle cx="50" cy="280" r="6" fill="#FF3B30"/>
                        <circle cx="350" cy="280" r="6" fill="#0071E3"/>
                      </svg>
                    </div>
                  </div>
                </Card>

                {/* Step 4 */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-muted flex items-center justify-center p-8 order-2 md:order-1">
                      {/* Placeholder SVG Diagram */}
                      <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                        {/* Side view of door jamb */}
                        <rect x="150" y="50" width="100" height="200" fill="white" stroke="#0071E3" strokeWidth="3"/>
                        <rect x="150" y="50" width="30" height="200" fill="#E5E5E7"/>
                        <rect x="220" y="50" width="30" height="200" fill="#E5E5E7"/>

                        {/* Depth measurement */}
                        <line x1="150" y1="270" x2="250" y2="270" stroke="#0071E3" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-reverse)"/>
                        <text x="200" y="290" textAnchor="middle" fill="#0071E3" fontSize="14" fontWeight="bold">Jamb Depth</text>

                        {/* Labels */}
                        <text x="165" y="40" fill="#666" fontSize="12">Front</text>
                        <text x="215" y="40" fill="#666" fontSize="12">Back</text>
                      </svg>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          4
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">Measure the Depth</h3>
                      </div>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                          Measure the depth of the door jamb from <strong className="text-foreground">front to back</strong>.
                        </p>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>This measurement determines <strong className="text-foreground">hardware clearance</strong></li>
                          <li>Especially important for barn door installations</li>
                          <li>Note if there are any obstructions (trim, molding, etc.)</li>
                        </ul>
                        <div className="bg-primary/10 rounded-lg p-4 mt-6">
                          <p className="text-sm font-semibold text-primary flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            For Barn Doors
                          </p>
                          <p className="text-sm mt-2">The track needs to be mounted far enough from the wall to clear the door jamb and any trim.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Step 5 */}
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          5
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">Record & Verify</h3>
                      </div>
                      <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                          Write down all measurements clearly and <strong className="text-foreground">double-check your work</strong>.
                        </p>
                        <ul className="space-y-2 list-disc list-inside">
                          <li><strong className="text-foreground">Label each measurement</strong> (width-top, width-middle, etc.)</li>
                          <li>Use a measurement worksheet or our PDF guide</li>
                          <li>Take photos of the opening from multiple angles</li>
                          <li>Note any special conditions or obstacles</li>
                        </ul>
                        <div className="bg-green-500/10 rounded-lg p-4 mt-6">
                          <p className="text-sm font-semibold text-green-600 dark:text-green-500 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Best Practice
                          </p>
                          <p className="text-sm mt-2">When in doubt, measure twice! Having accurate measurements from the start saves time and prevents costly mistakes.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted flex items-center justify-center p-8">
                      {/* Placeholder SVG - Measurement Sheet */}
                      <svg viewBox="0 0 400 300" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                        <rect x="50" y="30" width="300" height="240" fill="white" stroke="#0071E3" strokeWidth="2" rx="4"/>
                        <text x="200" y="60" textAnchor="middle" fill="#0071E3" fontSize="18" fontWeight="bold">MEASUREMENT SHEET</text>

                        {/* Form lines */}
                        <line x1="70" y1="90" x2="330" y2="90" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="85" fill="#666" fontSize="12">Width (Top):</text>

                        <line x1="70" y1="120" x2="330" y2="120" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="115" fill="#666" fontSize="12">Width (Middle):</text>

                        <line x1="70" y1="150" x2="330" y2="150" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="145" fill="#666" fontSize="12">Width (Bottom):</text>

                        <line x1="70" y1="180" x2="330" y2="180" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="175" fill="#666" fontSize="12">Height (Left):</text>

                        <line x1="70" y1="210" x2="330" y2="210" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="205" fill="#666" fontSize="12">Height (Right):</text>

                        <line x1="70" y1="240" x2="330" y2="240" stroke="#E5E5E7" strokeWidth="1"/>
                        <text x="70" y="235" fill="#666" fontSize="12">Jamb Depth:</text>

                        {/* Checkmark icon */}
                        <circle cx="320" cy="250" r="12" fill="#34C759"/>
                        <path d="M315 250 L318 253 L325 246" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Video Guide Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Watch Our Video Guide
                </h2>
                <p className="text-lg text-muted-foreground">
                  See the measurement process in action
                </p>
              </div>

              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  {/* Video Placeholder */}
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xl font-semibold mb-2">How to Measure for Closet Doors</p>
                        <p className="text-sm text-muted-foreground">Professional measurement techniques explained</p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        Video Coming Soon
                      </Badge>
                    </div>
                    {/* Optional: Embed real video when available */}
                    {/*
                    <iframe
                      src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                      title="Measurement Guide Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                    */}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Prefer a written guide?{' '}
                  <a href="#pdf-download" className="text-primary hover:underline font-semibold">
                    Download our PDF measurement guide
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Common Mistakes to Avoid
                </h2>
                <p className="text-lg text-muted-foreground">
                  Learn from these frequent measurement errors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mistake 1 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Measuring Only Once</CardTitle>
                        <CardDescription>
                          Taking a single measurement at one point doesn't account for variations in the opening. Always measure at multiple points (top, middle, bottom for width; both sides for height).
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Mistake 2 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Measuring to the Trim</CardTitle>
                        <CardDescription>
                          Measure to the door jamb (the frame), not the decorative trim around it. The trim adds width but isn't part of the actual opening.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Mistake 3 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Rounding Numbers</CardTitle>
                        <CardDescription>
                          Precision matters! Don't round to the nearest inch. Record exact measurements including fractions (e.g., 30 1/4" not 30").
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Mistake 4 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Forgetting the Depth</CardTitle>
                        <CardDescription>
                          Many people forget to measure jamb depth. This is critical for barn doors and certain hardware installations. Always include this measurement.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Mistake 5 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Not Checking for Level</CardTitle>
                        <CardDescription>
                          Assuming floors and ceilings are level can lead to problems. Always measure height on both sides and check diagonal measurements.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Mistake 6 */}
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">Poor Documentation</CardTitle>
                        <CardDescription>
                          Writing measurements on random scraps of paper or not labeling them clearly. Use a proper measurement worksheet and label everything.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Professional Tips
                </h2>
                <p className="text-lg text-muted-foreground">
                  Expert advice for perfect measurements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tip 1 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle>Use Metal Tape</CardTitle>
                    <CardDescription>
                      A metal tape measure is more accurate than cloth or plastic. It won't sag or stretch, giving you precise measurements every time.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tip 2 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <CardTitle>Take Photos</CardTitle>
                    <CardDescription>
                      Photograph the opening from multiple angles, including close-ups of the jamb and any obstructions. This helps our team verify measurements.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tip 3 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <CardTitle>Note Obstacles</CardTitle>
                    <CardDescription>
                      Document any light switches, outlets, vents, or baseboards that might affect installation. Include their location and measurements.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tip 4 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <CardTitle>Get Help</CardTitle>
                    <CardDescription>
                      Having a second person hold the tape measure makes measurements easier and more accurate, especially for large openings.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tip 5 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <CardTitle>Double Check</CardTitle>
                    <CardDescription>
                      Measure twice, cut once! Always verify your measurements before submitting them or ordering doors. A few extra minutes can save costly mistakes.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tip 6 */}
                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle>Best Time</CardTitle>
                    <CardDescription>
                      Measure during daylight hours when you have good lighting. This helps you see the opening clearly and spot any irregularities.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Door Type Specific Tips */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Door Type Specific Measurements
                </h2>
                <p className="text-lg text-muted-foreground">
                  Additional considerations for different door types
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Barn Doors */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    <CardTitle className="text-center text-2xl">Barn Doors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Measure wall space on both sides - you need room for the door to slide open</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Check ceiling height - track mounts above the opening</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Note jamb depth - critical for hardware clearance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Locate studs in the wall where track will mount</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Bifold Doors */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <CardTitle className="text-center text-2xl">Bifold Doors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Measure the rough opening (the framed space)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Check that the opening is perfectly vertical</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Note clearance needed for doors to fold</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Measure floor track location if applicable</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Bypass/Sliding Doors */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <CardTitle className="text-center text-2xl">Bypass Doors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Measure inside the closet frame accurately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Check depth - both doors need to fit in the track</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Verify track mounting surface is solid</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Note any floor irregularities or carpet thickness</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Download Section */}
        <section id="pdf-download" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Download Our Measurement Guide
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Get our comprehensive PDF guide with measurement worksheets, diagrams, and professional tips. Perfect to print and take with you!
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Printable measurement worksheets</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Detailed diagrams for all door types</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Step-by-step instructions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Professional tips and tricks</span>
                      </li>
                    </ul>
                    <Button size="lg" className="text-lg w-full md:w-auto">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF Guide
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Free download • No email required • 2.4 MB PDF
                    </p>
                  </div>
                  <div className="bg-muted flex items-center justify-center p-8">
                    {/* PDF Preview Illustration */}
                    <svg viewBox="0 0 300 400" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
                      {/* Document */}
                      <rect x="30" y="20" width="240" height="360" fill="white" stroke="#0071E3" strokeWidth="3" rx="8"/>

                      {/* Header */}
                      <rect x="30" y="20" width="240" height="60" fill="#0071E3" rx="8"/>
                      <text x="150" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">MEASUREMENT</text>
                      <text x="150" y="70" textAnchor="middle" fill="white" fontSize="16">GUIDE</text>

                      {/* Content lines */}
                      <rect x="50" y="100" width="200" height="8" fill="#E5E5E7" rx="4"/>
                      <rect x="50" y="120" width="180" height="8" fill="#E5E5E7" rx="4"/>
                      <rect x="50" y="140" width="190" height="8" fill="#E5E5E7" rx="4"/>

                      {/* Diagram placeholder */}
                      <rect x="70" y="170" width="160" height="120" fill="#F5F5F7" stroke="#0071E3" strokeWidth="2" rx="4"/>
                      <line x1="90" y1="190" x2="210" y2="190" stroke="#0071E3" strokeWidth="2"/>
                      <line x1="90" y1="230" x2="210" y2="230" stroke="#0071E3" strokeWidth="2"/>
                      <line x1="90" y1="270" x2="210" y2="270" stroke="#0071E3" strokeWidth="2"/>

                      {/* More content */}
                      <rect x="50" y="310" width="200" height="6" fill="#E5E5E7" rx="3"/>
                      <rect x="50" y="325" width="170" height="6" fill="#E5E5E7" rx="3"/>
                      <rect x="50" y="340" width="190" height="6" fill="#E5E5E7" rx="3"/>

                      {/* PDF icon */}
                      <circle cx="240" cy="50" r="20" fill="white" opacity="0.3"/>
                      <text x="240" y="57" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PDF</text>
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Still Need Help CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Still Need Help?
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Let our experts handle the measurements for you. Book a free in-home consultation and we'll take care of everything.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <a href="/book-measure">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Free Measurement
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <a href="tel:+16135551234">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us Now
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-75">
                Professional measurement service available throughout Ottawa and surrounding areas
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

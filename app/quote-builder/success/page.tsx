import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Calendar, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Quote Submitted - PG Closets',
  description: 'Your quote request has been submitted successfully.',
}

interface PageProps {
  searchParams: Promise<{ quoteNumber?: string }>
}

export default async function QuoteSuccessPage({ searchParams }: PageProps) {
  const { quoteNumber } = await searchParams

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Quote Request Submitted!
          </h1>

          {quoteNumber && (
            <p className="text-lg text-muted-foreground mb-2">
              Quote Number: <span className="font-mono font-semibold text-foreground">{quoteNumber}</span>
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            Thank you for your interest in PG Closets. We&apos;ve received your quote request
            and our team will review it shortly.
          </p>

          {/* What Happens Next */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>Here&apos;s what to expect from our process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Review (24 hours)</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your configuration and prepare a detailed assessment
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule Measurement</h3>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll contact you to schedule a free in-home measurement
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Formal Quote</h3>
                    <p className="text-sm text-muted-foreground">
                      After measurement, you&apos;ll receive a detailed quote with exact pricing
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Installation</h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, we&apos;ll schedule professional installation at your convenience
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="text-left mb-8 bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Need to reach us sooner?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="tel:613-701-6393"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">613-701-6393</p>
                  </div>
                </a>

                <a
                  href="mailto:info@pgclosets.ca"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-sm text-muted-foreground">info@pgclosets.ca</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                Return Home
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

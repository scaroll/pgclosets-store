import type { Metadata } from 'next'
import { InstantEstimateCalculator } from './calculator'
import { Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instant Estimate Calculator - PG Closets',
  description: 'Get an instant estimate for your custom closet door project. Choose from barn doors, bifold, bypass, and glass doors with our easy-to-use calculator.',
}

export default function InstantEstimatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 pt-20 pb-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Get Your Instant Estimate
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Configure your perfect closet door in minutes and receive an instant price estimate.
              Our calculator makes it easy to explore options and find the right solution for your space.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Instant pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Free consultation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="container mx-auto px-4 pb-16">
        <InstantEstimateCalculator />
      </section>

      {/* Disclaimer Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/50 border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-lg font-semibold mb-4">Important Information</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
              <p>
                <strong>Estimate Disclaimer:</strong> The prices shown in this calculator are estimates only and are provided for informational purposes.
                Final pricing may vary based on specific project requirements, site conditions, geographic location, and current market conditions.
              </p>
              <p>
                The instant estimate does not constitute a formal quote or binding agreement. A detailed quote will be provided after our team
                reviews your specific requirements and conducts any necessary site measurements.
              </p>
              <p>
                All prices are subject to change without notice. Special promotions, discounts, or bulk order pricing may be available -
                please contact us for details.
              </p>
              <p>
                <strong>Accuracy:</strong> While we strive to provide accurate estimates, actual costs may differ due to factors including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Custom modifications or special requirements</li>
                <li>Site-specific installation challenges</li>
                <li>Material availability and pricing fluctuations</li>
                <li>Additional features or upgrades requested during consultation</li>
                <li>Local building codes and permit requirements</li>
              </ul>
              <p>
                <strong>Next Steps:</strong> After submitting your estimate request, a member of our team will contact you within 24 business hours
                to discuss your project in detail and provide a comprehensive, accurate quote tailored to your specific needs.
              </p>
              <p className="text-xs pt-2 border-t border-border/50 mt-4">
                By using this calculator and submitting your information, you agree to be contacted by PG Closets regarding your project.
                We respect your privacy and will never share your information with third parties. See our Privacy Policy for more details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose PG Closets?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Quality Craftsmanship</h3>
              <p className="text-sm text-muted-foreground">
                Premium materials and expert installation for lasting beauty
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Competitive Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Fair, transparent pricing with no hidden fees
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated team to guide you through every step
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

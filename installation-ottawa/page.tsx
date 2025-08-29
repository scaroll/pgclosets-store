import type { Metadata } from "next"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Professional Installation Ottawa | Renin Door Systems | PG Closets",
  description:
    "Professional installation of Renin door systems across Ottawa. Expert technicians, 2-year warranty, and same-day completion. Serving Ottawa, Kanata, Nepean, Orleans, and surrounding areas.",
  keywords:
    "door installation Ottawa, professional installation, Renin door installation, Ottawa door installers, closet door installation, barn door installation Ottawa",
  openGraph: {
    title: "Professional Installation Ottawa | Renin Door Systems | PG Closets",
    description:
      "Professional installation of Renin door systems across Ottawa. Expert technicians, 2-year warranty, and same-day completion.",
    images: [{ url: "/og-installation.jpg", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/installation-ottawa" },
}

export default function InstallationOttawaPage() {
  const processSteps = [
    {
      step: "1",
      title: "Pre-Installation Inspection",
      description:
        "Our technician arrives and inspects the installation area, confirming measurements and requirements.",
      duration: "15 minutes",
    },
    {
      step: "2",
      title: "Preparation & Setup",
      description: "We protect your floors and furniture, then organize all components and hardware for installation.",
      duration: "30 minutes",
    },
    {
      step: "3",
      title: "Professional Installation",
      description: "Expert installation of your door system with precision mounting and hardware adjustment.",
      duration: "2-4 hours",
    },
    {
      step: "4",
      title: "Testing & Cleanup",
      description: "Complete system testing, final adjustments, and thorough cleanup of the work area.",
      duration: "30 minutes",
    },
  ]

  return (
    <div className="min-h-screen bg-pg-offwhite">
      <PgHeader />

      {/* Hero Section */}
      <section className="section-padding-lg bg-gradient-to-br from-pg-offwhite to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="headline-large text-4xl md:text-6xl text-pg-dark mb-6">Professional Installation in Ottawa</h1>
          <p className="text-xl text-pg-gray mb-8 max-w-3xl mx-auto">
            Expert installation of Renin door systems by certified technicians. Same-day completion with 2-year
            workmanship warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurator">
              <Button className="btn-primary px-8 py-4 text-lg rounded-full">Schedule Installation</Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-secondary px-8 py-4 text-lg rounded-full">Get Quote</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">Our Installation Process</h2>
            <p className="text-lg text-pg-gray max-w-2xl mx-auto">
              Professional, efficient installation that respects your home and schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-pg-border transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-pg-dark mb-3">{step.title}</h3>
                <p className="text-pg-gray mb-4">{step.description}</p>
                <div className="bg-pg-sky/10 rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium text-pg-navy">{step.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="section-padding bg-pg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-pg-border">
            <div className="text-center mb-12">
              <h2 className="headline-large text-3xl md:text-4xl text-pg-dark mb-4">Comprehensive Warranty</h2>
              <p className="text-lg text-pg-gray">
                We stand behind our installation work with industry-leading coverage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold text-pg-dark mb-2">2-Year Workmanship</h3>
                <p className="text-pg-gray">Complete coverage on all installation work and adjustments</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold text-pg-dark mb-2">Hardware Warranty</h3>
                <p className="text-pg-gray">Lifetime warranty on all Renin hardware components</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-pg-dark mb-2">Ongoing Support</h3>
                <p className="text-pg-gray">Free adjustments and maintenance guidance for life</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PgFooter />
    </div>
  )
}

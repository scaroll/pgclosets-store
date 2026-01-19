import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PG Closets Ottawa",
  description: "Terms of service for PG Closets Ottawa. Review our terms and conditions.",
  robots: { index: true, follow: true },
}

export default function TermsOfService() {
  return (
    <main className="section-apple">
      <div className="container-apple max-w-[800px]">
        <h1 className="text-h1 mb-8" style={{ fontSize: "40px" }}>
          Terms of Service
        </h1>

        <div className="space-y-8">
          <p className="text-body-m text-pg-dark mb-6" style={{ opacity: 0.8 }}>
            Last updated: {new Date().toLocaleDateString("en-CA")}
          </p>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Acceptance of Terms
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              By accessing and using PG Closets services, you accept and agree to be bound by the terms and provisions
              of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Services
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              PG Closets provides authentic Renin door systems, custom closet solutions, and professional installation
              services in Ottawa, Kanata, Nepean, Orleans, Barrhaven, Stittsville, Gloucester, and Vanier. All
              installations are performed by licensed and insured technicians.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Pricing and Payment
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              All prices are displayed in Canadian dollars (CAD) and include applicable taxes where specified. Final
              pricing is confirmed after measurement and consultation. Payment terms will be outlined in your service
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Warranty
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              We provide a comprehensive 2-year workmanship warranty on all installations, plus manufacturer warranty on
              Renin products as specified by the manufacturer. Warranty terms and conditions are detailed in your
              service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Limitation of Liability
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              PG Closets' liability is limited to the cost of the products and services provided. We are not liable for
              indirect, incidental, or consequential damages arising from the use of our products or services.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Contact Information
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              For questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:legal@pgclosets.com"
                className="text-pg-navy hover:text-pg-sky transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-pg-sky focus-visible:outline-offset-2"
              >
                legal@pgclosets.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

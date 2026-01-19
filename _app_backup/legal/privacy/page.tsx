import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PG Closets Ottawa",
  description: "Privacy policy for PG Closets Ottawa. Learn how we protect your personal information.",
  robots: { index: true, follow: true },
}

export default function PrivacyPolicy() {
  return (
    <main className="section-apple">
      <div className="container-apple max-w-[800px]">
        <h1 className="text-h1 mb-8" style={{ fontSize: "40px" }}>
          Privacy Policy
        </h1>

        <div className="space-y-8">
          <p className="text-body-m text-pg-dark mb-6" style={{ opacity: 0.8 }}>
            Last updated: {new Date().toLocaleDateString("en-CA")}
          </p>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Information We Collect
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              We collect information you provide directly to us, such as when you request a consultation, use our
              configurator, or contact us for support. This includes your name, email address, phone number, and project
              details to provide accurate quotes and professional service.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              How We Use Your Information
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              schedule installations, and communicate with you about our Renin door products and services. We may also
              use your information to send you updates about your project status and maintenance reminders.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Information Sharing
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy. We may share information with trusted service providers who
              assist us in operating our website and conducting our business, provided they agree to keep this
              information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Data Security
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
              100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-h2 mb-4" style={{ fontSize: "28px" }}>
              Contact Us
            </h2>
            <p className="text-body-m text-pg-dark leading-relaxed" style={{ opacity: 0.75 }}>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:privacy@pgclosets.com"
                className="text-pg-navy hover:text-pg-sky transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-pg-sky focus-visible:outline-offset-2"
              >
                privacy@pgclosets.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface QuoteConfirmationEmailProps {
  customerName: string
  quoteNumber: string
  projectType: string
  openingsCount: number
  estimatedRange?: string
  address?: string
}

export default function QuoteConfirmationEmail({
  customerName = 'Valued Customer',
  quoteNumber = 'QR-123456',
  projectType = 'New Installation',
  openingsCount = 1,
  estimatedRange,
  address,
}: QuoteConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PG Closets Quote Request - Reference #{quoteNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>PG Closets</Heading>
            <Text style={tagline}>Premium Closet Door Solutions</Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h1" style={h1}>
              Thank You for Your Quote Request!
            </Heading>

            <Text style={paragraph}>Hi {customerName},</Text>

            <Text style={paragraph}>
              We&apos;ve received your quote request and our team is already reviewing your project
              details. You can expect to hear from us within 24 hours.
            </Text>

            {/* Quote Details Box */}
            <Section style={detailsBox}>
              <Heading as="h2" style={h2}>
                Request Details
              </Heading>
              <Text style={detailItem}>
                <strong>Reference Number:</strong> {quoteNumber}
              </Text>
              <Text style={detailItem}>
                <strong>Project Type:</strong> {projectType}
              </Text>
              <Text style={detailItem}>
                <strong>Number of Openings:</strong> {openingsCount}
              </Text>
              {estimatedRange && (
                <Text style={detailItem}>
                  <strong>Estimated Range:</strong> {estimatedRange}
                </Text>
              )}
              {address && (
                <Text style={detailItem}>
                  <strong>Service Address:</strong> {address}
                </Text>
              )}
            </Section>

            {/* What's Next Section */}
            <Section style={stepsSection}>
              <Heading as="h2" style={h2}>
                What Happens Next?
              </Heading>

              <Section style={step}>
                <Text style={stepNumber}>1</Text>
                <Section style={stepContent}>
                  <Text style={stepTitle}>Review</Text>
                  <Text style={stepText}>
                    Our team will review your project requirements and prepare options for you.
                  </Text>
                </Section>
              </Section>

              <Section style={step}>
                <Text style={stepNumber}>2</Text>
                <Section style={stepContent}>
                  <Text style={stepTitle}>Contact</Text>
                  <Text style={stepText}>
                    We&apos;ll reach out within 24 hours to discuss your project and schedule a free
                    measurement.
                  </Text>
                </Section>
              </Section>

              <Section style={step}>
                <Text style={stepNumber}>3</Text>
                <Section style={stepContent}>
                  <Text style={stepTitle}>Quote</Text>
                  <Text style={stepText}>
                    After the measurement visit, you&apos;ll receive a detailed, itemized quote with
                    no hidden fees.
                  </Text>
                </Section>
              </Section>
            </Section>

            <Text style={paragraph}>
              Have questions in the meantime? Don&apos;t hesitate to reach out:
            </Text>

            {/* Contact Info */}
            <Section style={contactBox}>
              <Text style={contactItem}>
                <strong>Phone:</strong>{' '}
                <Link href="tel:+16137016393" style={link}>
                  (613) 701-6393
                </Link>
              </Text>
              <Text style={contactItem}>
                <strong>Email:</strong>{' '}
                <Link href="mailto:info@pgclosets.com" style={link}>
                  info@pgclosets.com
                </Link>
              </Text>
              <Text style={contactItem}>
                <strong>Hours:</strong> Mon-Fri 9am-6pm, Sat 10am-4pm
              </Text>
            </Section>

            <Text style={paragraph}>
              Thank you for considering PG Closets for your project. We look forward to helping you
              transform your space!
            </Text>

            <Text style={signature}>
              Warm regards,
              <br />
              The PG Closets Team
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              PG Closets - Ottawa&apos;s Premier Closet Door Specialists
            </Text>
            <Text style={footerText}>
              Serving Ottawa, Kanata, Barrhaven, Orleans, and surrounding areas
            </Text>
            <Text style={footerLinks}>
              <Link href="https://pgclosets.com" style={footerLink}>
                Website
              </Link>
              {' | '}
              <Link href="https://pgclosets.com/products" style={footerLink}>
                Products
              </Link>
              {' | '}
              <Link href="https://pgclosets.com/book-measure" style={footerLink}>
                Book Consultation
              </Link>
            </Text>
            <Text style={footerDisclaimer}>
              This email was sent because you requested a quote from PG Closets. If you didn&apos;t
              make this request, please disregard this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px 0',
  textAlign: 'center' as const,
}

const logo = {
  color: '#1a365d',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
}

const tagline = {
  color: '#718096',
  fontSize: '14px',
  margin: '4px 0 0',
}

const hr = {
  borderColor: '#e8e8e8',
  margin: '24px 48px',
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#1a365d',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 24px',
}

const h2 = {
  color: '#1a365d',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
}

const detailsBox = {
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailItem = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
}

const stepsSection = {
  margin: '32px 0',
}

const step = {
  display: 'flex' as const,
  marginBottom: '16px',
}

const stepNumber = {
  backgroundColor: '#1a365d',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  height: '28px',
  lineHeight: '28px',
  margin: '0 16px 0 0',
  minWidth: '28px',
  textAlign: 'center' as const,
  width: '28px',
}

const stepContent = {
  flex: '1',
}

const stepTitle = {
  color: '#1a365d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const stepText = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const contactBox = {
  backgroundColor: '#edf2f7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const contactItem = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 4px',
}

const link = {
  color: '#1a365d',
  textDecoration: 'underline',
}

const signature = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '32px 0 0',
}

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 0 4px',
}

const footerLinks = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '16px 0 0',
}

const footerLink = {
  color: '#1a365d',
  textDecoration: 'underline',
}

const footerDisclaimer = {
  color: '#a0aec0',
  fontSize: '11px',
  lineHeight: '18px',
  margin: '16px 0 0',
}

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

interface QuoteReadyEmailProps {
  customerName: string
  quoteNumber: string
  totalAmount: number
  depositAmount: number
  validUntil: string
  quoteUrl: string
  pdfUrl?: string
}

export default function QuoteReadyEmail({
  customerName = 'Customer',
  quoteNumber = 'Q-2024-ABC123',
  totalAmount = 2500,
  depositAmount = 1250,
  validUntil = 'January 15, 2025',
  quoteUrl = 'https://pgclosets.ca/account/quotes/123',
  pdfUrl
}: QuoteReadyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your formal quote {quoteNumber} is ready for review</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Quote is Ready!</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            Great news! We&apos;ve completed your formal quote based on our measurement.
            Please review the details below and let us know if you have any questions.
          </Text>

          <Section style={quoteBox}>
            <Text style={quoteLabel}>Quote Number</Text>
            <Text style={quoteValue}>{quoteNumber}</Text>

            <Text style={quoteLabel}>Total Amount</Text>
            <Text style={quoteValueLarge}>${totalAmount.toLocaleString()} CAD</Text>

            <Hr style={hrLight} />

            <Text style={quoteLabel}>Deposit Required (50%)</Text>
            <Text style={quoteValue}>${depositAmount.toLocaleString()} CAD</Text>

            <Text style={quoteLabel}>Valid Until</Text>
            <Text style={quoteValue}>{validUntil}</Text>
          </Section>

          <Text style={text}>
            <strong>Ready to proceed?</strong>
          </Text>

          <Text style={text}>
            Click the button below to review your quote in detail and approve it.
            Once approved, you can pay the deposit to confirm your order.
          </Text>

          <Section style={buttonContainer}>
            <Link href={quoteUrl} style={button}>
              Review & Approve Quote
            </Link>
          </Section>

          {pdfUrl && (
            <Text style={textCenter}>
              <Link href={pdfUrl} style={link}>Download PDF Quote</Link>
            </Text>
          )}

          <Hr style={hr} />

          <Text style={text}>
            <strong>What&apos;s included:</strong>
          </Text>
          <Text style={text}>
            ✓ All materials and hardware<br />
            ✓ Professional installation<br />
            ✓ 5-year warranty on materials<br />
            ✓ 2-year warranty on installation
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Questions about your quote? Reply to this email or call{' '}
            <Link href="tel:613-701-6393" style={link}>613-701-6393</Link>
          </Text>

          <Text style={footer}>
            PG Closets<br />
            Ottawa&apos;s Premier Closet Door Specialists<br />
            <Link href="https://pgclosets.ca" style={link}>pgclosets.ca</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 20px',
}

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const textCenter = {
  ...text,
  textAlign: 'center' as const,
}

const quoteBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #86efac',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const quoteLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
}

const quoteValue = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const quoteValueLarge = {
  color: '#166534',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#16a34a',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 36px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const hrLight = {
  borderColor: '#86efac',
  margin: '16px 0',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

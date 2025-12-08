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

interface QuoteSubmittedEmailProps {
  customerName: string
  quoteNumber: string
  totalAmount: number
  configurationsCount: number
  quoteUrl: string
}

export default function QuoteSubmittedEmail({
  customerName = 'Customer',
  quoteNumber = 'Q-2024-ABC123',
  totalAmount = 2500,
  configurationsCount = 2,
  quoteUrl = 'https://pgclosets.ca/account/quotes/123'
}: QuoteSubmittedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your quote request {quoteNumber} has been received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quote Request Received</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            Thank you for your interest in PG Closets! We&apos;ve received your quote
            request and our team will review it shortly.
          </Text>

          <Section style={quoteBox}>
            <Text style={quoteLabel}>Quote Number</Text>
            <Text style={quoteValue}>{quoteNumber}</Text>

            <Text style={quoteLabel}>Configurations</Text>
            <Text style={quoteValue}>{configurationsCount} door configuration(s)</Text>

            <Text style={quoteLabel}>Estimated Total</Text>
            <Text style={quoteValue}>${totalAmount.toLocaleString()} CAD</Text>
          </Section>

          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>

          <Text style={text}>
            1. Our team will review your configuration within 24 hours<br />
            2. We&apos;ll contact you to schedule a free measurement<br />
            3. After measurement, you&apos;ll receive a formal quote with exact pricing<br />
            4. Once approved, we&apos;ll schedule your installation
          </Text>

          <Section style={buttonContainer}>
            <Link href={quoteUrl} style={button}>
              View Your Quote
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Have questions? Reply to this email or call us at{' '}
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

const quoteBox = {
  backgroundColor: '#f8f9fa',
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 32px',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
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

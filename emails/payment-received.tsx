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

interface PaymentReceivedEmailProps {
  customerName: string
  quoteNumber: string
  paymentType: 'DEPOSIT' | 'FINAL'
  amountPaid: number
  totalAmount: number
  remainingBalance: number
  receiptUrl?: string
  quoteUrl: string
}

export default function PaymentReceivedEmail({
  customerName = 'Customer',
  quoteNumber = 'Q-2024-ABC123',
  paymentType = 'DEPOSIT',
  amountPaid = 1250,
  totalAmount = 2500,
  remainingBalance = 1250,
  receiptUrl,
  quoteUrl = 'https://pgclosets.ca/account/quotes/123'
}: PaymentReceivedEmailProps) {
  const isDeposit = paymentType === 'DEPOSIT'
  const title = isDeposit ? 'Deposit Received - Order Confirmed!' : 'Payment Received - Thank You!'
  const preview = isDeposit
    ? `Your deposit of $${amountPaid.toLocaleString()} has been received`
    : `Your payment of $${amountPaid.toLocaleString()} has been received`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={successBanner}>
            <Text style={checkmark}>✓</Text>
            <Heading style={h1White}>{title}</Heading>
          </Section>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            {isDeposit
              ? "Thank you for your deposit! Your order has been confirmed and added to our production queue."
              : "Thank you for your final payment! Your order is now complete."
            }
          </Text>

          <Section style={paymentBox}>
            <Text style={paymentLabel}>Payment Amount</Text>
            <Text style={paymentValue}>${amountPaid.toLocaleString()} CAD</Text>

            <Hr style={hrLight} />

            <div style={paymentRow}>
              <Text style={paymentRowLabel}>Order Total</Text>
              <Text style={paymentRowValue}>${totalAmount.toLocaleString()}</Text>
            </div>

            <div style={paymentRow}>
              <Text style={paymentRowLabel}>Amount Paid</Text>
              <Text style={paymentRowValue}>${amountPaid.toLocaleString()}</Text>
            </div>

            <div style={paymentRow}>
              <Text style={paymentRowLabel}>
                {remainingBalance > 0 ? 'Remaining Balance' : 'Balance'}
              </Text>
              <Text style={{
                ...paymentRowValue,
                color: remainingBalance > 0 ? '#1a1a1a' : '#16a34a'
              }}>
                ${remainingBalance.toLocaleString()}
                {remainingBalance === 0 && ' - PAID IN FULL'}
              </Text>
            </div>

            <Hr style={hrLight} />

            <Text style={paymentLabel}>Reference Number</Text>
            <Text style={paymentRef}>{quoteNumber}</Text>
          </Section>

          {isDeposit ? (
            <>
              <Text style={text}>
                <strong>What happens next?</strong>
              </Text>
              <Text style={text}>
                1. Your doors enter production (typically 2-3 weeks)<br />
                2. We&apos;ll contact you when ready to schedule installation<br />
                3. Remaining balance of ${remainingBalance.toLocaleString()} due at installation
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                <strong>Your warranty information:</strong>
              </Text>
              <Text style={text}>
                • 5-year warranty on materials<br />
                • 2-year warranty on installation<br />
                • Keep this email for your records
              </Text>

              <Text style={text}>
                We hope you love your new closet doors! If you&apos;re happy with our service,
                we&apos;d appreciate a review on Google.
              </Text>
            </>
          )}

          <Section style={buttonContainer}>
            <Link href={quoteUrl} style={button}>
              View Order Details
            </Link>
          </Section>

          {receiptUrl && (
            <Text style={textCenter}>
              <Link href={receiptUrl} style={link}>Download Receipt</Link>
            </Text>
          )}

          <Hr style={hr} />

          <Text style={text}>
            Questions? Reply to this email or call{' '}
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
  padding: '0 0 40px',
  maxWidth: '560px',
}

const successBanner = {
  backgroundColor: '#16a34a',
  padding: '32px 20px',
  textAlign: 'center' as const,
}

const checkmark = {
  fontSize: '48px',
  margin: '0 0 12px',
}

const h1White = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0',
}

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 20px 16px',
}

const textCenter = {
  ...text,
  textAlign: 'center' as const,
}

const paymentBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 20px',
}

const paymentLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
}

const paymentValue = {
  color: '#16a34a',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const paymentRef = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontFamily: 'monospace',
  fontWeight: '600',
  margin: '0',
}

const paymentRow = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  marginBottom: '8px',
}

const paymentRowLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const paymentRowValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 20px',
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
  margin: '32px 20px',
}

const hrLight = {
  borderColor: '#e5e7eb',
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
  margin: '0 20px',
}

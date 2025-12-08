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

interface AppointmentConfirmationEmailProps {
  customerName: string
  appointmentType: 'MEASUREMENT' | 'INSTALLATION'
  quoteNumber: string
  date: string
  time: string
  address: string
  techName?: string
  notes?: string
  rescheduleUrl: string
}

export default function AppointmentConfirmationEmail({
  customerName = 'Customer',
  appointmentType = 'MEASUREMENT',
  quoteNumber = 'Q-2024-ABC123',
  date = 'Monday, January 15, 2025',
  time = '9:00 AM - 11:00 AM',
  address = '123 Main St, Ottawa, ON K1A 0A1',
  techName = 'John',
  notes,
  rescheduleUrl = 'https://pgclosets.ca/account/appointments'
}: AppointmentConfirmationEmailProps) {
  const isMeasurement = appointmentType === 'MEASUREMENT'
  const title = isMeasurement ? 'Measurement Appointment Confirmed' : 'Installation Appointment Confirmed'
  const preview = isMeasurement
    ? `Your measurement is scheduled for ${date}`
    : `Your installation is scheduled for ${date}`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            {isMeasurement
              ? "Your free measurement appointment has been scheduled. Our specialist will visit your home to take precise measurements and discuss your project."
              : "Your installation appointment has been confirmed. Our professional team will arrive to install your beautiful new closet doors."
            }
          </Text>

          <Section style={appointmentBox}>
            <Text style={appointmentLabel}>Date & Time</Text>
            <Text style={appointmentValue}>{date}</Text>
            <Text style={appointmentTime}>{time}</Text>

            <Text style={appointmentLabel}>Location</Text>
            <Text style={appointmentValue}>{address}</Text>

            {techName && (
              <>
                <Text style={appointmentLabel}>
                  {isMeasurement ? 'Specialist' : 'Installation Team Lead'}
                </Text>
                <Text style={appointmentValue}>{techName}</Text>
              </>
            )}

            <Text style={appointmentLabel}>Reference</Text>
            <Text style={appointmentValue}>{quoteNumber}</Text>
          </Section>

          {isMeasurement ? (
            <>
              <Text style={text}>
                <strong>What to expect:</strong>
              </Text>
              <Text style={text}>
                • The appointment takes approximately 30-45 minutes<br />
                • We&apos;ll measure all openings and discuss options<br />
                • You&apos;ll receive a formal quote within 24-48 hours<br />
                • No payment required at this visit
              </Text>

              <Text style={text}>
                <strong>Please ensure:</strong>
              </Text>
              <Text style={text}>
                • The areas to be measured are accessible<br />
                • Someone 18+ is present during the visit
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                <strong>What to expect:</strong>
              </Text>
              <Text style={text}>
                • Installation typically takes 2-4 hours<br />
                • Our team will protect your floors and clean up<br />
                • We&apos;ll walk you through operation and care<br />
                • Final payment due upon completion
              </Text>

              <Text style={text}>
                <strong>Please ensure:</strong>
              </Text>
              <Text style={text}>
                • The installation areas are clear of items<br />
                • Someone 18+ is present during installation<br />
                • Pets are secured in another area
              </Text>
            </>
          )}

          {notes && (
            <>
              <Hr style={hr} />
              <Text style={text}>
                <strong>Notes:</strong> {notes}
              </Text>
            </>
          )}

          <Section style={buttonContainer}>
            <Link href={rescheduleUrl} style={buttonOutline}>
              Manage Appointment
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Need to reschedule? Please let us know at least 24 hours in advance by
            replying to this email or calling{' '}
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

const appointmentBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #93c5fd',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const appointmentLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '16px 0 4px',
}

const appointmentValue = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
}

const appointmentTime = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '500',
  margin: '4px 0 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const buttonOutline = {
  border: '2px solid #000000',
  borderRadius: '6px',
  color: '#000000',
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

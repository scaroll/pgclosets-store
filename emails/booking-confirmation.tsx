// @ts-nocheck - Email template with dynamic types
import * as React from 'react';
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';
import { BookingEmailData } from '@/lib/email';

export const BookingConfirmationEmail = (props: BookingEmailData) => {
  const {
    bookingId,
    customerName,
    service,
    date,
    time,
    duration,
    location,
    address,
    projectType,
    notes,
  } = props;

  return (
    <Html>
      <Head />
      <Preview>Your booking #{bookingId} is confirmed for {date}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Premium Closet Solutions</Text>
          </Section>

          {/* Booking Confirmation */}
          <Section style={content}>
            <Heading style={h2}>Appointment Confirmed! ✅</Heading>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Your {service} appointment is confirmed! We're looking forward to meeting with you and helping transform your space.
            </Text>

            {/* Booking Number */}
            <Section style={confirmationBox}>
              <Text style={confirmationLabel}>Confirmation Number</Text>
              <Text style={confirmationNumber}>#{bookingId}</Text>
              <Text style={confirmationNote}>Please save this number for your records</Text>
            </Section>

            {/* Appointment Details */}
            <Section style={detailsBox}>
              <Heading style={h3}>Appointment Details</Heading>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Service:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{service}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Date:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{date}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Time:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{time}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Duration:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{duration}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Location:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{location}</Text>
                </Column>
              </Row>

              {address && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Address:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>{address}</Text>
                  </Column>
                </Row>
              )}

              {projectType && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Project:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>{projectType}</Text>
                  </Column>
                </Row>
              )}

              {notes && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Notes:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>{notes}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* What to Expect */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>What to Expect</Heading>
              <Text style={stepText}>✓ We'll send you a reminder 24 hours before your appointment</Text>
              <Text style={stepText}>✓ Our design consultant will arrive at the scheduled time</Text>
              <Text style={stepText}>✓ We'll take measurements and discuss your needs</Text>
              <Text style={stepText}>✓ You'll receive a custom 3D design and quote</Text>
              <Text style={stepText}>✓ No obligation - take your time to review</Text>
            </Section>

            {/* Prepare for Your Visit */}
            <Section style={prepareSection}>
              <Heading style={h3}>How to Prepare</Heading>
              <Text style={prepareText}>• Clear access to the area we'll be measuring</Text>
              <Text style={prepareText}>• Have photos or ideas ready if you'd like to share inspiration</Text>
              <Text style={prepareText}>• Think about your storage needs and preferences</Text>
              <Text style={prepareText}>• Consider your budget range (we have options for every budget)</Text>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/account/bookings/${bookingId}`}
                style={button}
              >
                View Appointment Details
              </Button>
              <Text style={ctaSubtext}>
                Add this appointment to your calendar using the attached .ics file
              </Text>
            </Section>

            {/* Reschedule Info */}
            <Section style={rescheduleSection}>
              <Heading style={h3}>Need to Reschedule?</Heading>
              <Text style={rescheduleText}>
                Life happens! If you need to reschedule or cancel your appointment, please let us know at least 24 hours in advance.
              </Text>
              <Text style={rescheduleText}>
                Call us at{' '}
                <Link href="tel:+16137016393" style={link}>
                  (613) 701-6393
                </Link>{' '}
                or email{' '}
                <Link href="mailto:bookings@pgclosets.com" style={link}>
                  bookings@pgclosets.com
                </Link>
              </Text>
            </Section>

            {/* Contact Info */}
            <Section style={contactSection}>
              <Text style={contactText}>
                Questions? We're here to help!
              </Text>
              <Text style={contactText}>
                Email:{' '}
                <Link href="mailto:info@pgclosets.com" style={link}>
                  info@pgclosets.com
                </Link>{' '}
                | Phone:{' '}
                <Link href="tel:+16137016393" style={link}>
                  (613) 701-6393
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              PG Closets - Ottawa's Premium Closet Solutions
            </Text>
            <Text style={footerText}>
              123 Main Street, Ottawa, ON K1A 0B1
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} PG Closets. All rights reserved.
            </Text>
            <Text style={footerUnsubscribe}>
              You received this email because you booked an appointment with PG Closets.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  backgroundColor: '#2563eb',
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 8px',
};

const headerText = {
  color: '#e0e7ff',
  fontSize: '14px',
  margin: '0',
};

const content = {
  padding: '32px 48px',
};

const h2 = {
  color: '#111827',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '36px',
  margin: '0 0 24px',
};

const h3 = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '24px 0 16px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const confirmationBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #2563eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const confirmationLabel = {
  color: '#1e40af',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const confirmationNumber = {
  color: '#1e40af',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
};

const confirmationNote = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const detailRow = {
  padding: '8px 0',
};

const detailLabelColumn = {
  width: '120px',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const detailValue = {
  color: '#111827',
  fontSize: '14px',
  margin: '0',
};

const nextStepsSection = {
  backgroundColor: '#f0fdf4',
  borderLeft: '4px solid #10b981',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const stepText = {
  color: '#047857',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const prepareSection = {
  backgroundColor: '#fefce8',
  borderLeft: '4px solid #facc15',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const prepareText = {
  color: '#854d0e',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '240px',
  padding: '12px 24px',
  margin: '0 auto',
};

const ctaSubtext = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '12px 0 0',
};

const rescheduleSection = {
  backgroundColor: '#fff5f5',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const rescheduleText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const contactSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const contactText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '32px 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 4px',
};

const footerUnsubscribe = {
  color: '#9ca3af',
  fontSize: '10px',
  lineHeight: '16px',
  margin: '16px 0 0',
};
import * as React from 'react';
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

export interface QuoteRequestEmailData {
  quoteId: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  productCategory?: string;
  roomType: string;
  roomDimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'feet' | 'inches' | 'meters';
  };
  additionalNotes?: string;
  preferredContactMethod?: 'email' | 'phone';
  requestDate: string;
}

export const QuoteRequestEmail = (props: QuoteRequestEmailData) => {
  const {
    quoteId,
    customerName,
    email,
    phone,
    productName,
    productCategory,
    roomType,
    roomDimensions,
    additionalNotes,
    preferredContactMethod,
    requestDate,
  } = props;

  const formatDimensions = () => {
    const { width, height, depth, unit } = roomDimensions;
    const unitLabel = unit === 'feet' ? 'ft' : unit === 'inches' ? 'in' : 'm';
    return `${width} × ${height} × ${depth} ${unitLabel} (W × H × D)`;
  };

  return (
    <Html>
      <Head />
      <Preview>Quote Request #{quoteId} - We'll get back to you within 24 hours!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Premium Closet Solutions</Text>
          </Section>

          {/* Quote Request Confirmation */}
          <Section style={content}>
            <Heading style={h2}>Quote Request Received!</Heading>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Thank you for your interest in our premium closet solutions! We've received your quote request and our team is already reviewing the details.
            </Text>

            {/* Quote Number */}
            <Section style={confirmationBox}>
              <Text style={confirmationLabel}>Quote Request Number</Text>
              <Text style={confirmationNumber}>#{quoteId}</Text>
              <Text style={confirmationNote}>Please save this number for your records</Text>
            </Section>

            {/* Product Details */}
            <Section style={detailsBox}>
              <Heading style={h3}>Product Information</Heading>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Product:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{productName}</Text>
                </Column>
              </Row>

              {productCategory && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Category:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>{productCategory}</Text>
                  </Column>
                </Row>
              )}

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Room Type:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{roomType}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Dimensions:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{formatDimensions()}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Request Date:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{requestDate}</Text>
                </Column>
              </Row>

              {additionalNotes && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Notes:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>{additionalNotes}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Customer Information */}
            <Section style={customerBox}>
              <Heading style={h3}>Your Contact Information</Heading>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Name:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{customerName}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Email:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{email}</Text>
                </Column>
              </Row>

              <Row style={detailRow}>
                <Column style={detailLabelColumn}>
                  <Text style={detailLabel}>Phone:</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{phone}</Text>
                </Column>
              </Row>

              {preferredContactMethod && (
                <Row style={detailRow}>
                  <Column style={detailLabelColumn}>
                    <Text style={detailLabel}>Preferred Contact:</Text>
                  </Column>
                  <Column>
                    <Text style={detailValue}>
                      {preferredContactMethod === 'email' ? 'Email' : 'Phone'}
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* What Happens Next */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>What Happens Next?</Heading>
              <Text style={stepText}>✓ Our design team will review your requirements</Text>
              <Text style={stepText}>✓ We'll prepare a detailed quote with pricing options</Text>
              <Text style={stepText}>✓ You'll receive your custom quote within 24-48 hours</Text>
              <Text style={stepText}>✓ Optional: Schedule a free in-home consultation</Text>
              <Text style={stepText}>✓ We'll work with you to perfect your design</Text>
            </Section>

            {/* Why Choose PG Closets */}
            <Section style={benefitsSection}>
              <Heading style={h3}>Why Choose PG Closets?</Heading>
              <Text style={benefitText}>• Premium quality materials and craftsmanship</Text>
              <Text style={benefitText}>• Custom 3D designs tailored to your space</Text>
              <Text style={benefitText">• Professional installation by experienced team</Text>
              <Text style={benefitText}>• Lifetime warranty on all products</Text>
              <Text style={benefitText}>• Competitive pricing with flexible payment options</Text>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/account/quotes/${quoteId}`}
                style={button}
              >
                View Quote Status
              </Button>
              <Text style={ctaSubtext}>
                Track your quote request and view updates in your account
              </Text>
            </Section>

            {/* Questions Section */}
            <Section style={questionsSection}>
              <Heading style={h3}>Have Questions?</Heading>
              <Text style={questionsText}>
                Our team is here to help! Feel free to reach out if you have any questions about your quote or our products.
              </Text>
              <Text style={questionsText}>
                Email:{' '}
                <Link href="mailto:quotes@pgclosets.com" style={link}>
                  quotes@pgclosets.com
                </Link>{' '}
                | Phone:{' '}
                <Link href="tel:+16137016393" style={link}>
                  (613) 701-6393
                </Link>
              </Text>
            </Section>

            {/* Explore More */}
            <Section style={exploreSection}>
              <Heading style={h3}>While You Wait...</Heading>
              <Text style={exploreText}>
                Explore our gallery of completed projects for inspiration, or browse our product catalog to see what's possible with PG Closets.
              </Text>
              <Row style={exploreLinksRow}>
                <Column style={exploreLinkColumn}>
                  <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/gallery`} style={exploreLink}>
                    View Gallery
                  </Link>
                </Column>
                <Column style={exploreLinkColumn}>
                  <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/products`} style={exploreLink}>
                    Browse Products
                  </Link>
                </Column>
              </Row>
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
              You received this email because you requested a quote from PG Closets.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default QuoteRequestEmail;

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

const customerBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  borderLeft: '4px solid #f59e0b',
};

const detailRow = {
  padding: '8px 0',
};

const detailLabelColumn = {
  width: '140px',
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

const benefitsSection = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #ef4444',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const benefitText = {
  color: '#991b1b',
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

const questionsSection = {
  backgroundColor: '#fef9e7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const questionsText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const exploreSection = {
  backgroundColor: '#f5f3ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const exploreText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
};

const exploreLinksRow = {
  marginTop: '16px',
};

const exploreLinkColumn = {
  textAlign: 'center' as const,
  padding: '0 8px',
};

const exploreLink = {
  color: '#2563eb',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'underline',
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

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
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

export interface QuoteConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerProvince?: string;
  quoteNumber: string;
  receivedAt: string;
  productName?: string;
  productCategory?: string;
  productPrice?: number;
  productOptions?: Record<string, any>;
  notes?: string;
}

export const QuoteConfirmationEmail = (props: QuoteConfirmationEmailData) => {
  const {
    customerName,
    quoteNumber,
    receivedAt,
    productName,
    productCategory,
    productPrice,
    productOptions,
    notes,
  } = props;

  const firstName = customerName?.split(' ')[0] || 'there';
  const formattedDate = new Date(receivedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const formatPrice = (price: number) => `$${price.toFixed(2)} CAD`;

  return (
    <Html>
      <Head />
      <Preview>Your quote request {quoteNumber} has been received - We'll be in touch soon!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Premium Closet Solutions</Text>
          </Section>

          {/* Confirmation Message */}
          <Section style={content}>
            <Heading style={h2}>Quote Request Received!</Heading>
            <Text style={paragraph}>
              Hi {firstName},
            </Text>
            <Text style={paragraph}>
              Thank you for your interest in PG Closets! We've received your quote request and our team is reviewing your requirements.
            </Text>

            {/* Quote Details Box */}
            <Section style={quoteBox}>
              <Text style={boxLabel}>Your Quote Number</Text>
              <Text style={quoteNumber}>{quoteNumber}</Text>
              <Text style={boxSubtext}>
                Received on {formattedDate}
              </Text>
            </Section>

            {/* Product Details */}
            {productName && (
              <>
                <Heading style={h3}>Product Details</Heading>
                <Section style={detailsSection}>
                  <Row style={detailRow}>
                    <Column>
                      <Text style={detailLabel}>Product</Text>
                    </Column>
                    <Column>
                      <Text style={detailValue}>{productName}</Text>
                    </Column>
                  </Row>
                  {productCategory && (
                    <Row style={detailRow}>
                      <Column>
                        <Text style={detailLabel}>Category</Text>
                      </Column>
                      <Column>
                        <Text style={detailValue}>{productCategory}</Text>
                      </Column>
                    </Row>
                  )}
                  {productPrice && productPrice > 0 && (
                    <Row style={detailRow}>
                      <Column>
                        <Text style={detailLabel}>Estimated Price</Text>
                      </Column>
                      <Column>
                        <Text style={detailValue}>{formatPrice(productPrice)}</Text>
                      </Column>
                    </Row>
                  )}
                  {productOptions && Object.keys(productOptions).length > 0 && (
                    <Row style={detailRow}>
                      <Column>
                        <Text style={detailLabel}>Selected Options</Text>
                      </Column>
                      <Column>
                        {Object.entries(productOptions).map(([key, value], index) => (
                          <Text key={index} style={detailValue}>
                            {key}: {String(value)}
                          </Text>
                        ))}
                      </Column>
                    </Row>
                  )}
                </Section>
              </>
            )}

            {/* Additional Notes */}
            {notes && (
              <>
                <Heading style={h3}>Your Message</Heading>
                <Section style={notesSection}>
                  <Text style={notesText}>{notes}</Text>
                </Section>
              </>
            )}

            <Hr style={divider} />

            {/* Next Steps */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>What Happens Next?</Heading>
              <Section style={stepItem}>
                <Text style={stepNumber}>1</Text>
                <Text style={stepText}>
                  <strong>Quote Review</strong> - Our team will review your requirements and prepare a detailed quote
                </Text>
              </Section>
              <Section style={stepItem}>
                <Text style={stepNumber}>2</Text>
                <Text style={stepText}>
                  <strong>Personal Contact</strong> - A member of our sales team will reach out within 24-48 business hours
                </Text>
              </Section>
              <Section style={stepItem}>
                <Text style={stepNumber}>3</Text>
                <Text style={stepText}>
                  <strong>Custom Proposal</strong> - You'll receive a personalized quote with detailed pricing and options
                </Text>
              </Section>
              <Section style={stepItem}>
                <Text style={stepNumber}>4</Text>
                <Text style={stepText}>
                  <strong>Free Consultation</strong> - Schedule a complimentary in-home consultation to finalize your design
                </Text>
              </Section>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Text style={ctaText}>
                In the meantime, explore our product gallery and design inspiration:
              </Text>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/products`}
                style={button}
              >
                Browse Our Products
              </Button>
            </Section>

            {/* Contact Info */}
            <Section style={contactSection}>
              <Heading style={h3}>Need Immediate Assistance?</Heading>
              <Text style={contactText}>
                Our team is here to help answer any questions you may have.
              </Text>
              <Row style={contactRow}>
                <Column style={contactItem}>
                  <Text style={contactLabel}>Phone</Text>
                  <Link href="tel:+16137016393" style={contactLink}>
                    (613) 701-6393
                  </Link>
                </Column>
                <Column style={contactItem}>
                  <Text style={contactLabel}>Email</Text>
                  <Link href="mailto:info@pgclosets.com" style={contactLink}>
                    info@pgclosets.com
                  </Link>
                </Column>
              </Row>
              <Text style={hoursText}>
                Business Hours: Monday - Friday, 9:00 AM - 5:00 PM EST
              </Text>
            </Section>

            {/* Trust Signals */}
            <Section style={trustSection}>
              <Row>
                <Column style={trustItem}>
                  <Text style={trustIcon}>✓</Text>
                  <Text style={trustText}>Free Consultation</Text>
                </Column>
                <Column style={trustItem}>
                  <Text style={trustIcon}>✓</Text>
                  <Text style={trustText}>Custom Designs</Text>
                </Column>
                <Column style={trustItem}>
                  <Text style={trustIcon}>✓</Text>
                  <Text style={trustText}>Professional Installation</Text>
                </Column>
              </Row>
            </Section>

            {/* Closing */}
            <Hr style={divider} />
            <Text style={closing}>
              Thank you for considering PG Closets for your storage solution needs. We're excited to help transform your space!
            </Text>
            <Text style={signature}>
              Best regards,
              <br />
              The PG Closets Sales Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              PG Closets - Ottawa's Premium Closet Solutions
            </Text>
            <Text style={footerText}>
              Ottawa, Ontario
            </Text>
            <Text style={footerText}>
              Phone: (613) 701-6393 | Email: info@pgclosets.com
            </Text>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              © {new Date().getFullYear()} PG Closets. All rights reserved.
            </Text>
            <Text style={footerUnsubscribe}>
              You received this email because you requested a quote at pgclosets.com.
              <br />
              Quote Reference: {quoteNumber}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default QuoteConfirmationEmail;

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
  maxWidth: '600px',
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

const quoteBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #2563eb',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const boxLabel = {
  color: '#1e40af',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
};

const _quoteNumber = {
  color: '#1e3a8a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px',
  fontFamily: 'monospace',
};

const boxSubtext = {
  color: '#3b82f6',
  fontSize: '14px',
  margin: '0',
};

const detailsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
};

const detailRow = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const detailValue = {
  color: '#111827',
  fontSize: '14px',
  margin: '0 0 4px',
};

const notesSection = {
  backgroundColor: '#fefce8',
  borderLeft: '4px solid #eab308',
  borderRadius: '4px',
  padding: '16px 20px',
  margin: '16px 0',
};

const notesText = {
  color: '#854d0e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const nextStepsSection = {
  margin: '24px 0',
};

const stepItem = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
};

const stepNumber = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
  flexShrink: '0',
  textAlign: 'center' as const,
  lineHeight: '28px',
};

const stepText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const ctaText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const contactSection = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const contactText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const contactRow = {
  margin: '16px 0',
};

const contactItem = {
  textAlign: 'center' as const,
  padding: '0 8px',
};

const contactLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
};

const contactLink = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
};

const hoursText = {
  color: '#6b7280',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
};

const trustSection = {
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const trustItem = {
  textAlign: 'center' as const,
  padding: '0 8px',
};

const trustIcon = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 4px',
};

const trustText = {
  color: '#065f46',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
};

const closing = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const signature = {
  color: '#111827',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
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

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const footerUnsubscribe = {
  color: '#9ca3af',
  fontSize: '10px',
  lineHeight: '16px',
  margin: '16px 0 0',
};

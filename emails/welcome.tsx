import * as React from 'react';
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
  Button,
} from '@react-email/components';
import { WelcomeEmailData } from '@/lib/email';

export const WelcomeEmail = (props: WelcomeEmailData) => {
  const { name, email } = props;

  const firstName = name?.split(' ')[0] || 'there';

  return (
    <Html>
      <Head />
      <Preview>Welcome to PG Closets - Let's transform your space together!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Premium Closet Solutions</Text>
          </Section>

          {/* Welcome Message */}
          <Section style={content}>
            <Heading style={h2}>Welcome to PG Closets! 🎉</Heading>
            <Text style={paragraph}>
              Hi {firstName},
            </Text>
            <Text style={paragraph}>
              Welcome to the PG Closets family! We're thrilled to have you join thousands of Ottawa homeowners who've transformed their spaces with our premium closet solutions.
            </Text>

            {/* Benefits Section */}
            <Section style={benefitsSection}>
              <Heading style={h3}>Your Member Benefits</Heading>

              <Section style={benefitItem}>
                <Text style={benefitTitle}>🎯 Personalized Recommendations</Text>
                <Text style={benefitText}>
                  Get custom design suggestions based on your space and style preferences
                </Text>
              </Section>

              <Section style={benefitItem}>
                <Text style={benefitTitle}>💰 Exclusive Offers</Text>
                <Text style={benefitText}>
                  Be the first to know about sales, promotions, and member-only discounts
                </Text>
              </Section>

              <Section style={benefitItem}>
                <Text style={benefitTitle}>📐 Free Design Consultations</Text>
                <Text style={benefitText}>
                  Book a complimentary in-home consultation with our expert designers
                </Text>
              </Section>

              <Section style={benefitItem}>
                <Text style={benefitTitle}>🚀 Priority Service</Text>
                <Text style={benefitText}>
                  Enjoy faster response times and priority booking for installations
                </Text>
              </Section>
            </Section>

            {/* Quick Actions */}
            <Section style={actionsSection}>
              <Heading style={h3}>Get Started</Heading>
              <Text style={paragraph}>
                Ready to transform your space? Here are some quick ways to begin:
              </Text>

              <Section style={actionButtonsContainer}>
                <Button
                  href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/products`}
                  style={primaryButton}
                >
                  Browse Products
                </Button>

                <Button
                  href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/book`}
                  style={secondaryButton}
                >
                  Book Consultation
                </Button>
              </Section>
            </Section>

            {/* Resources */}
            <Section style={resourcesSection}>
              <Heading style={h3}>Helpful Resources</Heading>
              <Text style={resourceItem}>
                📖{' '}
                <Link href="https://pgclosets.com/design-guide" style={link}>
                  Design Inspiration Guide
                </Link>
                {' '}- Get ideas for your perfect closet
              </Text>
              <Text style={resourceItem}>
                🎥{' '}
                <Link href="https://pgclosets.com/how-it-works" style={link}>
                  How It Works
                </Link>
                {' '}- Learn about our process from design to installation
              </Text>
              <Text style={resourceItem}>
                💬{' '}
                <Link href="https://pgclosets.com/faq" style={link}>
                  Frequently Asked Questions
                </Link>
                {' '}- Find answers to common questions
              </Text>
              <Text style={resourceItem}>
                🏆{' '}
                <Link href="https://pgclosets.com/gallery" style={link}>
                  Project Gallery
                </Link>
                {' '}- See our work in Ottawa homes
              </Text>
            </Section>

            {/* Account Info */}
            <Section style={accountSection}>
              <Text style={accountTitle}>Your Account Details</Text>
              <Text style={accountDetail}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={accountDetail}>
                <strong>Member Since:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
              <Text style={accountNote}>
                You can manage your account settings and preferences at any time by visiting your{' '}
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/account`} style={link}>
                  account dashboard
                </Link>.
              </Text>
            </Section>

            {/* Special Offer */}
            <Section style={offerSection}>
              <Text style={offerLabel}>WELCOME GIFT</Text>
              <Heading style={offerTitle}>10% Off Your First Order</Heading>
              <Text style={offerText}>
                As a welcome gift, enjoy 10% off your first custom closet order. This offer is automatically applied to your account.
              </Text>
              <Text style={offerCode}>
                Promo Code: <strong>WELCOME10</strong>
              </Text>
              <Text style={offerExpiry}>
                Valid for 30 days from registration
              </Text>
            </Section>

            {/* Contact Support */}
            <Section style={supportSection}>
              <Text style={supportTitle}>We're Here to Help</Text>
              <Text style={supportText}>
                Our team is ready to assist you with any questions about our products, services, or your account.
              </Text>
              <Text style={supportContact}>
                📧 Email:{' '}
                <Link href="mailto:support@pgclosets.com" style={link}>
                  support@pgclosets.com
                </Link>
              </Text>
              <Text style={supportContact}>
                📞 Phone:{' '}
                <Link href="tel:+16137016393" style={link}>
                  (613) 701-6393
                </Link>
              </Text>
              <Text style={supportContact}>
                💬 Live Chat: Available Mon-Fri, 9am-5pm EST on our website
              </Text>
            </Section>

            {/* Closing */}
            <Hr style={divider} />
            <Text style={closing}>
              Thank you for choosing PG Closets. We look forward to helping you create the perfect storage solution for your home!
            </Text>
            <Text style={signature}>
              Best regards,
              <br />
              The PG Closets Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Follow us for design tips and special offers:
            </Text>
            <Text style={socialLinks}>
              <Link href="https://facebook.com/pgclosets" style={socialLink}>Facebook</Link>
              {' | '}
              <Link href="https://instagram.com/pgclosets" style={socialLink}>Instagram</Link>
              {' | '}
              <Link href="https://pinterest.com/pgclosets" style={socialLink}>Pinterest</Link>
            </Text>
            <Hr style={footerDivider} />
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
              You received this email because you created an account at pgclosets.com.
              <br />
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/account/preferences`} style={unsubscribeLink}>
                Manage email preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const benefitsSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const benefitItem = {
  marginBottom: '20px',
};

const benefitTitle = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const benefitText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const actionsSection = {
  margin: '32px 0',
};

const actionButtonsContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const primaryButton = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px 16px',
};

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #2563eb',
  borderRadius: '6px',
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 22px',
  margin: '0 8px 16px',
};

const resourcesSection = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const resourceItem = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const accountSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const accountTitle = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const accountDetail = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 8px',
};

const accountNote = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '12px 0 0',
};

const offerSection = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
};

const offerLabel = {
  color: '#e0e7ff',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const offerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const offerText = {
  color: '#f3f4f6',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
};

const offerCode = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  padding: '8px 16px',
  display: 'inline-block',
  margin: '0 0 8px',
};

const offerExpiry = {
  color: '#e0e7ff',
  fontSize: '12px',
  margin: '8px 0 0',
};

const supportSection = {
  backgroundColor: '#fefce8',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const supportTitle = {
  color: '#854d0e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const supportText = {
  color: '#854d0e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const supportContact = {
  color: '#854d0e',
  fontSize: '14px',
  margin: '0 0 8px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
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
  margin: '0 0 8px',
};

const socialLinks = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px',
};

const socialLink = {
  color: '#2563eb',
  textDecoration: 'none',
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

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
};
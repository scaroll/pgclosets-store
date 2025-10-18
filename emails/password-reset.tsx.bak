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

interface PasswordResetEmailProps {
  name: string;
  email: string;
  resetUrl: string;
}

export const PasswordResetEmail = (props: PasswordResetEmailProps) => {
  const { name, email, resetUrl } = props;

  const firstName = name?.split(' ')[0] || 'there';

  return (
    <Html>
      <Head />
      <Preview>Reset your PG Closets password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Password Reset Request</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>Reset Your Password</Heading>
            <Text style={paragraph}>
              Hi {firstName},
            </Text>
            <Text style={paragraph}>
              We received a request to reset the password for your PG Closets account associated with {email}.
            </Text>
            <Text style={paragraph}>
              If you made this request, click the button below to create a new password:
            </Text>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Button href={resetUrl} style={button}>
                Reset Password
              </Button>
              <Text style={ctaSubtext}>
                This link will expire in 1 hour for security reasons
              </Text>
            </Section>

            {/* Alternative Link */}
            <Section style={alternativeSection}>
              <Text style={alternativeText}>
                Or copy and paste this link into your browser:
              </Text>
              <Text style={linkText}>
                {resetUrl}
              </Text>
            </Section>

            {/* Security Notice */}
            <Section style={securitySection}>
              <Heading style={h3}>🔒 Security Notice</Heading>
              <Text style={securityText}>
                If you didn't request a password reset, please ignore this email. Your password won't be changed unless you click the link above and create a new one.
              </Text>
              <Text style={securityText}>
                For added security, this password reset link will expire in 1 hour. After that, you'll need to request a new password reset.
              </Text>
            </Section>

            {/* Tips */}
            <Section style={tipsSection}>
              <Heading style={h3}>Password Security Tips</Heading>
              <Text style={tipItem}>
                • Use at least 8 characters with a mix of letters, numbers, and symbols
              </Text>
              <Text style={tipItem}>
                • Avoid using personal information that's easy to guess
              </Text>
              <Text style={tipItem}>
                • Don't reuse passwords from other accounts
              </Text>
              <Text style={tipItem}>
                • Consider using a password manager for extra security
              </Text>
            </Section>

            {/* Support */}
            <Section style={supportSection}>
              <Text style={supportTitle}>Need Help?</Text>
              <Text style={supportText}>
                If you're having trouble resetting your password or didn't request this email, please contact our support team:
              </Text>
              <Text style={supportContact}>
                Email:{' '}
                <Link href="mailto:support@pgclosets.com" style={link}>
                  support@pgclosets.com
                </Link>
              </Text>
              <Text style={supportContact}>
                Phone:{' '}
                <Link href="tel:+16135551234" style={link}>
                  (613) 555-1234
                </Link>
              </Text>
            </Section>

            {/* Additional Info */}
            <Hr style={divider} />
            <Text style={additionalInfo}>
              This password reset was requested from IP address: {'{IP_ADDRESS}'} on{' '}
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })}
            </Text>
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
            <Hr style={footerDivider} />
            <Text style={footerSecurity}>
              This is an automated security email. Please do not reply to this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

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
  backgroundColor: '#dc2626',
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
  color: '#fecaca',
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
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 12px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 24px',
  margin: '0 auto',
};

const ctaSubtext = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '12px 0 0',
};

const alternativeSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const alternativeText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 8px',
};

const linkText = {
  color: '#2563eb',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  margin: '0',
};

const securitySection = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #dc2626',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const securityText = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const tipsSection = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipItem = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
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
  margin: '32px 0 24px',
};

const additionalInfo = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
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

const footerDivider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const footerSecurity = {
  color: '#dc2626',
  fontSize: '11px',
  fontWeight: '600',
  margin: '0',
};
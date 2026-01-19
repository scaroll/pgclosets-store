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
import { OrderEmailData } from '@/lib/email';

export const OrderConfirmationEmail = (props: OrderEmailData) => {
  const {
    orderNumber,
    customerName,
    orderDate,
    items,
    subtotal,
    tax,
    shipping,
    total,
    shippingAddress,
    estimatedDelivery,
    installationDate,
  } = props;

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <Html>
      <Head />
      <Preview>Your order #{orderNumber} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>PG Closets</Heading>
            <Text style={headerText}>Premium Closet Solutions</Text>
          </Section>

          {/* Order Confirmation */}
          <Section style={content}>
            <Heading style={h2}>Order Confirmed! 🎉</Heading>
            <Text style={paragraph}>
              Hi {customerName},
            </Text>
            <Text style={paragraph}>
              Thank you for your order! We're excited to help transform your space with our premium closet solutions.
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Row>
                <Column>
                  <Text style={label}>Order Number</Text>
                  <Text style={value}>#{orderNumber}</Text>
                </Column>
                <Column>
                  <Text style={label}>Order Date</Text>
                  <Text style={value}>{orderDate}</Text>
                </Column>
              </Row>
              {estimatedDelivery && (
                <Row>
                  <Column>
                    <Text style={label}>Estimated Delivery</Text>
                    <Text style={value}>{estimatedDelivery}</Text>
                  </Column>
                </Row>
              )}
              {installationDate && (
                <Row>
                  <Column>
                    <Text style={label}>Installation Date</Text>
                    <Text style={value}>{installationDate}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Order Items */}
            <Heading style={h3}>Order Items</Heading>
            <Section>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemImageColumn}>
                    {item.image && (
                      <Img
                        src={item.image}
                        alt={item.name}
                        width="60"
                        height="60"
                        style={itemImage}
                      />
                    )}
                  </Column>
                  <Column style={itemDetailsColumn}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                  </Column>
                  <Column style={itemPriceColumn}>
                    <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Price Summary */}
            <Section style={summarySection}>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Subtotal</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>{formatPrice(subtotal)}</Text>
                </Column>
              </Row>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Tax</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>{formatPrice(tax)}</Text>
                </Column>
              </Row>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Shipping</Text>
                </Column>
                <Column align="right">
                  <Text style={summaryValue}>{formatPrice(shipping)}</Text>
                </Column>
              </Row>
              <Hr style={divider} />
              <Row style={summaryRow}>
                <Column>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column align="right">
                  <Text style={totalValue}>{formatPrice(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Shipping Address */}
            <Section style={addressSection}>
              <Heading style={h3}>Shipping Address</Heading>
              <Text style={addressText}>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Text>
              <Text style={addressText}>{shippingAddress.addressLine1}</Text>
              {shippingAddress.addressLine2 && (
                <Text style={addressText}>{shippingAddress.addressLine2}</Text>
              )}
              <Text style={addressText}>
                {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
              </Text>
            </Section>

            {/* Call to Action */}
            <Section style={ctaSection}>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://pgclosets.com'}/account/orders/${orderNumber}`}
                style={button}
              >
                View Order Details
              </Button>
            </Section>

            {/* Next Steps */}
            <Section style={nextStepsSection}>
              <Heading style={h3}>What Happens Next?</Heading>
              <Text style={stepText}>✓ We'll prepare your order for shipment</Text>
              <Text style={stepText}>✓ You'll receive tracking information once shipped</Text>
              {installationDate && (
                <Text style={stepText}>✓ Our team will contact you before installation</Text>
              )}
              <Text style={stepText}>✓ Enjoy your new closet solution!</Text>
            </Section>

            {/* Contact Info */}
            <Section style={contactSection}>
              <Text style={contactText}>
                Questions? Contact us at{' '}
                <Link href="mailto:support@pgclosets.com" style={link}>
                  support@pgclosets.com
                </Link>{' '}
                or call{' '}
                <Link href="tel:+16135551234" style={link}>
                  (613) 555-1234
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
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

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

const orderBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '500',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
};

const value = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const itemRow = {
  borderBottom: '1px solid #e5e7eb',
  padding: '16px 0',
};

const itemImageColumn = {
  width: '72px',
  paddingRight: '12px',
};

const itemImage = {
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const itemDetailsColumn = {
  paddingRight: '12px',
};

const itemName = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 4px',
};

const itemQuantity = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const itemPriceColumn = {
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const itemPrice = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const summarySection = {
  margin: '24px 0',
};

const summaryRow = {
  padding: '8px 0',
};

const summaryLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const summaryValue = {
  color: '#111827',
  fontSize: '14px',
  margin: '0',
  textAlign: 'right' as const,
};

const totalLabel = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const totalValue = {
  color: '#2563eb',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const addressSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const addressText = {
  color: '#4b5563',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 4px',
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

const nextStepsSection = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const stepText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const contactSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const contactText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
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
  margin: '0 0 4px',
};
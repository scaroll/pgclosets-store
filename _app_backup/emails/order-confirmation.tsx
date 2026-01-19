import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  total: number // in cents
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export const OrderConfirmationEmail = ({
  customerName = 'Valued Customer',
  orderNumber = 'ORD-12345',
  total = 0,
  items = [],
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your order #{orderNumber} has been confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order Confirmation</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thank you for choosing PG Closets! Your order <strong>#{orderNumber}</strong> has been
          received and is being processed.
        </Text>

        <Section style={orderSection}>
          <Heading as="h2" style={h2}>
            Order Summary
          </Heading>
          <Hr style={hr} />
          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={itemText}>
                  {item.name} x {item.quantity}
                </Text>
              </Column>
              <Column align="right">
                <Text style={itemText}>${((item.price * item.quantity) / 100).toFixed(2)}</Text>
              </Column>
            </Row>
          ))}
          <Hr style={hr} />
          <Row>
            <Column>
              <Text style={totalText}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={totalText}>${(total / 100).toFixed(2)}</Text>
            </Column>
          </Row>
        </Section>

        <Text style={footer}>
          If you have any questions, please reply to this email or contact us at info@pgclosets.com.
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  paddingTop: '32px',
  paddingBottom: '32px',
}

const h2 = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
}

const orderSection = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '5px',
  margin: '20px 0',
}

const itemRow = {
  marginBottom: '10px',
}

const itemText = {
  fontSize: '14px',
  margin: '0',
  color: '#555',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '10px 0',
}

const totalText = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  marginTop: '20px',
}

export default OrderConfirmationEmail

import { OrderConfirmationEmail } from '@/emails/order-confirmation'
import { resend } from './client'

export async function sendOrderConfirmation(order: any) {
  if (!resend) {
    console.log('Mock sending order confirmation email:', order.id)
    return
  }

  const email = order.guestEmail || order.user?.email
  if (!email) return

  const items = order.items.map((item: any) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }))

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <orders@pgclosets.com>',
      to: email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: order.guestName || order.user?.name || 'Customer',
        orderNumber: order.orderNumber,
        total: order.total,
        items,
      }),
    })
    console.log('Email sent:', data)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

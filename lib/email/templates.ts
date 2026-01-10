import { OrderConfirmationEmail } from '@/emails/order-confirmation'
import { resend } from './client'

interface OrderItem {
  product: {
    name: string
    price: number
  }
  quantity: number
}

interface Order {
  guestEmail?: string
  user?: { email?: string; name?: string }
  guestName?: string
  orderNumber: string
  total: number
  items: OrderItem[]
}

export async function sendOrderConfirmation(order: Order) {
  if (!resend) {
    return
  }

  const email = order.guestEmail || order.user?.email
  if (!email) return

  const items = order.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }))

  try {
    await resend.emails.send({
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
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

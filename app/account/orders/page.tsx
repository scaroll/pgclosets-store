import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { OrderHistoryClient } from '../components/OrderHistoryClient'

export const metadata: Metadata = {
  title: 'Order History - Premium Closet Solutions',
  description: 'View your order history, track shipments, and reorder items.',
}

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders')
  }

  return <OrderHistoryClient />
}
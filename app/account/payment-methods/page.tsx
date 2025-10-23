import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PaymentMethodsClient } from '../components/PaymentMethodsClient'

export const metadata: Metadata = {
  title: 'Payment Methods - Premium Closet Solutions',
  description: 'Manage your saved payment methods and billing preferences.',
}

export default async function PaymentMethodsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/payment-methods')
  }

  return <PaymentMethodsClient />
}
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AccountDashboardClient } from './components/AccountDashboardClient'

export const metadata: Metadata = {
  title: 'My Account - Premium Closet Solutions',
  description: 'Manage your orders, addresses, and preferences in your premium account portal.',
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account')
  }

  return <AccountDashboardClient user={session.user} />
}
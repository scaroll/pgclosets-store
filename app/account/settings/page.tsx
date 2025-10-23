import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SettingsClient } from '../components/SettingsClient'

export const metadata: Metadata = {
  title: 'Settings - Premium Closet Solutions',
  description: 'Manage your account settings, preferences, and notifications.',
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/settings')
  }

  return <SettingsClient user={session.user} />
}
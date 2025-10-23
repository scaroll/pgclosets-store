import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProfileManagementClient } from '../components/ProfileManagementClient'

export const metadata: Metadata = {
  title: 'Profile Management - Premium Closet Solutions',
  description: 'Manage your personal information and preferences.',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/profile')
  }

  return <ProfileManagementClient user={session.user} />
}
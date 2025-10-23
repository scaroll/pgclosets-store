import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AddressBookClient } from '../components/AddressBookClient'

export const metadata: Metadata = {
  title: 'Address Book - Premium Closet Solutions',
  description: 'Manage your shipping and billing addresses with interactive maps.',
}

export default async function AddressesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/addresses')
  }

  return <AddressBookClient />
}

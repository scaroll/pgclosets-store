import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings - Premium Closet Solutions',
  description: 'Manage your account settings, preferences, and notifications.',
}

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600">Settings page is currently disabled for maintenance.</p>
    </div>
  )
}
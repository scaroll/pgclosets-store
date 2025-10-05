import { redirect } from 'next/navigation'

// Redirect /dashboard to /account/profile
export default function DashboardPage() {
  redirect('/account/profile')
}

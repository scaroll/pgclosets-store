/**
 * Admin Layout with Simple Password Authentication
 * Protects all /admin routes with cookie-based session
 */

import { isAdminAuthenticated, clearAdminSession } from '@/lib/auth/admin'
import { Button } from '@/components/ui/button'
import { Calendar, LayoutDashboard, LogOut, Package, Settings, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin session using simple password auth
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="border-b p-6">
          <Link href="/" className="text-xl font-bold">
            PG Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavLink href="/admin/products" icon={<Package size={20} />} label="Products" />
          <NavLink href="/admin/orders" icon={<ShoppingCart size={20} />} label="Orders" />
          <NavLink href="/admin/bookings" icon={<Calendar size={20} />} label="Bookings" />
          <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-indigo-600 font-semibold">A</span>
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-medium text-gray-900">Administrator</p>
              <p className="truncate text-xs">Admin access</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

// ============================================================================
// Components
// ============================================================================

function NavLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

async function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await clearAdminSession()
        redirect('/admin/login')
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        className="mt-2 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} className="mr-2" />
        Sign Out
      </Button>
    </form>
  )
}

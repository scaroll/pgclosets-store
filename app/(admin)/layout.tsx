import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Calendar, LayoutDashboard, LogOut, Package, Settings, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              {session.user.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-medium text-gray-900">{session.user.name}</p>
              <p className="truncate text-xs">{session.user.email}</p>
            </div>
          </div>
          <form
            action={async () => {
              'use server'
              // Implementation detail: signOut usually needs client component or server action
              // For now simpler to just link to signout or use form action if available
            }}
          >
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  // Ideally this would be active state aware
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

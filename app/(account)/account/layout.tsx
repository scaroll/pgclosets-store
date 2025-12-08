import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { User, FileText, MapPin, Calendar, Settings } from 'lucide-react'

const accountNav = [
  { href: '/account', label: 'Overview', icon: User },
  { href: '/account/quotes', label: 'My Quotes', icon: FileText },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/appointments', label: 'Appointments', icon: Calendar },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/account')
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">My Account</h1>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>

              <nav className="space-y-1">
                {accountNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

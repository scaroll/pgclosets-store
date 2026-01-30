// Phase 0: Minimal layout - NO auth, NO database-dependent components
import Link from 'next/link'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PG Closets | Premium Custom Storage Solutions',
  description: 'Design and buy custom closets, doors, and hardware online.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Simple Phase 0 Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-sf-display text-xl font-bold tracking-tight">
              PG <span className="text-blue-600">CLOSETS</span>
            </Link>
            <nav className="hidden gap-8 sm:flex">
              <Link
                href="/products"
                className="text-sm font-medium text-foreground/70 hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground/70 hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <Toaster />
        {/* Simple footer */}
        <footer className="mt-24 border-t border-border/40 bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PG Closets. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Serving Ottawa and surrounding areas
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

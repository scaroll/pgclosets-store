import { Header } from '@/components/layout/header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'PG Closets | Premium Custom Storage Solutions',
  description:
    'Design and buy custom closets, doors, and hardware online. Premium quality, delivered to your door.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

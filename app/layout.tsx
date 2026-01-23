import { Header } from '@/components/layout/header'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

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
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { GeistSans as FontHeading } from "geist/font"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"

import "@/styles/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: 'PG Closets - Custom Closet Solutions',
  description: 'Professional closet organization and installation services in Ottawa, Kanata, and Barrhaven',
  keywords: [
    'custom closets',
    'closet organization',
    'Ottawa closets',
    'closet installation',
    'walk-in closets',
    'reach-in closets',
    'closet design',
    'professional organization'
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          PG Closets (Debug)
        </Link>
        <nav className="flex gap-4">
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}

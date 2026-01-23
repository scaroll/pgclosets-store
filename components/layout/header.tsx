'use client'

import Link from 'next/link'
import { QuoteBasketButton } from '@/components/quote/quote-basket-button'
import { FileText } from 'lucide-react'

export function Header() {
  return (
    <header className="support-[backdrop-filter]:bg-white/60 sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl transition-all duration-500 dark:border-white/5 dark:bg-black/70">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
          <span className="font-sf-display text-lg font-semibold tracking-tight text-black dark:text-white">
            PG Closets
          </span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          {['Store', 'Closets', 'Doors', 'Hardware', 'About', 'Contact'].map(item => (
            <Link
              key={item}
              href={item === 'Store' ? '/products' : `/${item.toLowerCase()}`}
              className="text-xs font-medium text-black/80 transition-colors dark:text-white/80 hover:text-black dark:hover:text-white"
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
          >
            <span className="sr-only">Search</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            href="/quote-basket"
            className="relative text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
          >
            <span className="sr-only">Quote Basket</span>
            <FileText className="h-4 w-4" />
          </Link>
          <Link
            href="/cart"
            className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
          >
            <span className="sr-only">Cart</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path d="M2.5 2.5H3.5L4.2 10.5H12.5L13.5 3.5H4.3" stroke="currentColor" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

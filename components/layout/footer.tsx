'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-apple-gray-200 bg-apple-gray-100 px-6 py-20 dark:border-white/10 dark:bg-black">
      <div className="container mx-auto grid max-w-7xl gap-12 md:grid-cols-4 lg:gap-24">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="font-sf-display text-xl font-semibold tracking-tight text-foreground"
          >
            PG Closets
          </Link>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            Elevating Ottawa’s architecture through precision-engineered storage solutions.
          </p>
        </div>

        {/* Navigation Columns */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-semibold text-foreground">Products</h4>
          <nav className="flex flex-col gap-3">
            {['Closets', 'Doors', 'Hardware', 'Accessories'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-semibold text-foreground">Company</h4>
          <nav className="flex flex-col gap-3">
            {['About Us', 'Contact', 'Locations', 'Reviews'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact/Support */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-semibold text-foreground">Contact</h4>
          <p className="text-[13px] font-medium text-muted-foreground">
            Ottawa, ON
            <br />
            (613) 555-0123
            <br />
            info@pgclosets.ca
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-20 max-w-7xl border-t border-apple-gray-200 pt-8 dark:border-white/10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-xs font-medium text-muted-foreground">
            &copy; {currentYear} PG Closets. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

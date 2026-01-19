import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-primary)]/10 bg-white">
      <div className="container-content section-padding">
        <div className="grid gap-16 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-medium text-[var(--color-primary)]">
              {siteConfig.name}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-secondary)]">
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-sm text-[var(--color-secondary)]">
              Since {siteConfig.established}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
              Contact
            </h4>
            <div className="mt-6 space-y-3 text-sm text-[var(--color-secondary)]">
              <p>{siteConfig.address.street}</p>
              <p>
                {siteConfig.address.city}, {siteConfig.address.province}{' '}
                {siteConfig.address.postal}
              </p>
              <p className="pt-2">
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
              Hours
            </h4>
            <div className="mt-6 space-y-3 text-sm text-[var(--color-secondary)]">
              <p>Monday – Friday: {siteConfig.hours.weekday}</p>
              <p>Saturday: {siteConfig.hours.saturday}</p>
              <p>Sunday: {siteConfig.hours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-primary)]/10 pt-8 md:flex-row">
          <p className="text-xs text-[var(--color-secondary)]">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {siteConfig.footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-[var(--color-secondary)] transition-colors hover:text-[var(--color-primary)]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

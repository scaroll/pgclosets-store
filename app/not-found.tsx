import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="container-text text-center">
        <h1 className="text-hero text-[var(--color-primary)]">404</h1>

        <p className="mt-6 text-xl text-[var(--color-secondary)]">
          This page seems to have wandered off.
        </p>

        <div className="mt-12">
          <Link href="/">
            <Button variant="secondary">Return Home</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

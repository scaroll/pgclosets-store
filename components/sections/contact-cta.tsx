'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { fadeInUp, viewportOnce } from '@/lib/animations'
import { Button } from '@/components/ui/button'

export function ContactCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-text text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 className="text-display text-[var(--color-primary)]">
            Begin a conversation
          </h2>

          <p className="mt-6 text-lg text-[var(--color-secondary)]">
            Schedule a private consultation
          </p>

          <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="h-12 rounded-full border border-[var(--color-primary)]/20 bg-transparent px-6 text-[var(--color-primary)] placeholder:text-[var(--color-secondary)] focus:border-[var(--color-accent)] focus:outline-none sm:w-80"
            />
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Begin'}
            </Button>
          </form>

          {status === 'success' && (
            <p className="mt-6 text-[var(--color-accent)]">
              Thank you. We will be in touch soon.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

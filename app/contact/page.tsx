'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config'
import { fadeInUp, viewportOnce } from '@/lib/animations'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('success')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="section-padding bg-white">
        <div className="container-text text-center">
          <h1 className="text-display text-[var(--color-primary)]">
            Begin a conversation
          </h1>
          <p className="mt-6 text-xl text-[var(--color-secondary)]">
            We would be delighted to hear from you
          </p>
        </div>
      </section>

      {/* Form and Contact Info */}
      <section className="section-padding bg-[var(--color-surface)]">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Form */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              {status === 'success' ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-light text-[var(--color-primary)]">
                    Thank you
                  </h2>
                  <p className="mt-4 text-[var(--color-secondary)]">
                    We will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--color-primary)]"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full border-b border-[var(--color-primary)]/20 bg-transparent py-3 text-[var(--color-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--color-primary)]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full border-b border-[var(--color-primary)]/20 bg-transparent py-3 text-[var(--color-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--color-primary)]"
                    >
                      Tell us about your project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="mt-2 w-full resize-none border-b border-[var(--color-primary)]/20 bg-transparent py-3 text-[var(--color-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                    />
                  </div>

                  <Button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="lg:pl-16"
            >
              <div className="space-y-12">
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    Call
                  </h3>
                  <p className="mt-4">
                    <a
                      href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}
                      className="text-lg text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {siteConfig.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    Email
                  </h3>
                  <p className="mt-4">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-lg text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    Visit
                  </h3>
                  <p className="mt-4 text-lg text-[var(--color-secondary)]">
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.city}, {siteConfig.address.province}{' '}
                    {siteConfig.address.postal}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-secondary)]">
                    By appointment only
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
                    Hours
                  </h3>
                  <div className="mt-4 text-lg text-[var(--color-secondary)]">
                    <p>Monday – Friday: {siteConfig.hours.weekday}</p>
                    <p>Saturday: {siteConfig.hours.saturday}</p>
                    <p>Sunday: {siteConfig.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

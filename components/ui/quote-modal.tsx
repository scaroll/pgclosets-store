"use client"

import { useState } from 'react'
import type { Product } from '@/lib/renin-products'
import { Button } from '@/components/ui/button'

interface QuoteModalProps {
  open: boolean
  onClose: () => void
  product: Product
  selectedOptions?: Record<string, string>
}

export function QuoteModal({ open, onClose, product, selectedOptions }: QuoteModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('ontario')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/quotes/quick', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          product: { name: product.name, category: product.category, price: product.price, selectedOptions },
          customer: { name, email, phone, province },
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to submit quote')
      setMessage(`Quote submitted. Reference: ${data.quote?.quoteNumber || 'pending'}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Request a Quote</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <div className="text-sm text-gray-600">{product.name}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Province</label>
              <select value={province} onChange={e=>setProvince(e.target.value)} className="w-full border rounded px-3 py-2">
                {['ontario','quebec','british-columbia','alberta','manitoba','saskatchewan','nova-scotia','new-brunswick','newfoundland','prince-edward-island','northwest-territories','nunavut','yukon'].map(p=> <option key={p} value={p}>{p.replace(/-/g,' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Notes</label>
            <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          {message && <div className="text-green-700 bg-green-50 rounded p-2 text-sm">{message}</div>}
          {error && <div className="text-red-700 bg-red-50 rounded p-2 text-sm">{error}</div>}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Quote'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}


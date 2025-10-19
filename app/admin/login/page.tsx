"use client"
import { useState } from 'react'

export default function AdminLoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const form = new FormData()
      form.set('key', key)
      const next = new URLSearchParams(window.location.search).get('next') || '/admin'
      form.set('next', next)
      const res = await fetch('/admin/login/submit', { method: 'POST', body: form })
      if (res.redirected) {
        window.location.href = res.url
        return
      }
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error || 'Login failed')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '64px auto', padding: 24 }}>
      <h1>Admin Login</h1>
      <p style={{ color: '#666' }}>Enter the admin key to continue.</p>
      <form onSubmit={onSubmit} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        <input
          type="password"
          placeholder="Admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ padding: 8 }}
          autoFocus
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Checking…' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
    </div>
  )
}

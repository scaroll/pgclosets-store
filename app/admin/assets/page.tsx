"use client"
import { useState } from 'react'

export default function AssetsAdminPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch('/api/assets/verify', { cache: 'no-store' })
      const json = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Assets Verifier</h1>
      <p>Scans public/images/products and public/images/services on the server.</p>
      <button onClick={run} disabled={loading} style={{ padding: '8px 12px', marginTop: 8 }}>
        {loading ? 'Verifying…' : 'Verify Now'}
      </button>
      {error && <pre style={{ color: 'crimson', marginTop: 12 }}>{error}</pre>}
      {data && <pre style={{ marginTop: 12, maxHeight: 480, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )}


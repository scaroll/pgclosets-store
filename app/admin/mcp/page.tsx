"use client"
import { useState } from 'react'

export default function MCPAdminPage() {
  const [slug, setSlug] = useState('modern-minimalist-bypass-closet-door')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/tools/get-product-images?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>MCP Tools Tester</h1>
      <p>Uses internal endpoint to mirror MCP get_product_images logic.</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="product slug"
          style={{ padding: 8, minWidth: 280 }}
        />
        <button onClick={runTest} disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Testing…' : 'Run Test'}
        </button>
      </div>
      {error && (
        <pre style={{ color: 'crimson', marginTop: 12 }}>{error}</pre>
      )}
      {result && (
        <pre style={{ marginTop: 12 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
  </div>
)
}

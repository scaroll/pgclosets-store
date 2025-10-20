#!/usr/bin/env node
/*
 Verifies a production deployment by checking key pages and health endpoints.
 Usage: SITE_URL=https://www.pgclosets.com node scripts/ops/verify-deploy.mjs
*/

import fs from 'node:fs'

const base = (process.env.SITE_URL || 'https://www.pgclosets.com').replace(/\/$/, '')
const results = []

async function head(path) {
  const url = /^https?:/.test(path) ? path : base + path
  const r = await fetch(url, { method: 'HEAD' }).catch(() => null)
  return { url, status: r?.status ?? 0 }
}

async function getJson(path) {
  const url = base + path
  const r = await fetch(url, { headers: { 'cache-control': 'no-store' } })
  const status = r.status
  let body = null
  try { body = await r.json() } catch { body = null }
  return { url, status, body }
}

async function main() {
  // Key pages
  const checks = [
    head('/'),
    head('/services/installation'),
    head('/products/barn-doors'),
    head('/store/products/modern-minimalist-bypass-closet-door'),
    head('/images/products/barn-door-main.jpg'),
    head('/images/services/installation-hero.jpg'),
  ]
  const pages = await Promise.all(checks)
  results.push(...pages)

  // APIs
  const apiHealth = await getJson('/api/health')
  const apiSelfCheck = await getJson('/api/self-check')
  const apiAssets = await getJson('/api/assets/verify')
  results.push(apiHealth, apiSelfCheck, apiAssets)

  // Basic assertions
  const badPages = pages.filter(p => p.status < 200 || p.status >= 400)
  const healthOk = apiHealth.status === 200
  const selfOk = apiSelfCheck.status === 200 && apiSelfCheck.body && apiSelfCheck.body.ok !== false
  const assetsOk = apiAssets.status === 200 && apiAssets.body && apiAssets.body.ok === true

  const ok = badPages.length === 0 && healthOk && selfOk && assetsOk

  // Report
  const lines = []
  lines.push(`# Deployment Verification Report`)
  lines.push(`Base: ${base}`)
  lines.push(`Time: ${new Date().toISOString()}`)
  lines.push('')
  for (const r of results) {
    lines.push(`- ${r.url} → ${r.status}${r.body ? `; ok=${r.body.ok}` : ''}`)
  }
  lines.push('')
  lines.push(`Result: ${ok ? 'PASS' : 'FAIL'}`)
  fs.writeFileSync('DEPLOYMENT_SUCCESS_REPORT.md', lines.join('\n'))

  if (!ok) {
    console.error('Verification failed. See DEPLOYMENT_SUCCESS_REPORT.md')
    process.exit(1)
  }
  console.log('Verification passed. See DEPLOYMENT_SUCCESS_REPORT.md')
}

main().catch((e) => { console.error(e); process.exit(1) })


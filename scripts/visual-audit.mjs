// Simple visual/HTML audit for key pages using Node 18+ fetch
// Outputs a markdown report to visual-audit-report.md at repo root

import fs from 'node:fs/promises'

const SITEMAP_URL = 'https://www.pgclosets.com/sitemap.xml'
const MAX_URLS = 50

/**
 * Extract <loc> URLs from a simple sitemap.xml
 */
async function getUrlsFromSitemap(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`)
  const xml = await res.text()
  const locRegex = /<loc>(.*?)<\/loc>/g
  const urls = []
  let m
  while ((m = locRegex.exec(xml)) !== null) {
    urls.push(m[1].trim())
  }
  return urls.slice(0, MAX_URLS)
}

function extract(html, regex) {
  const m = regex.exec(html)
  return m ? m[1].trim() : ''
}

function count(regex, html) {
  return (html.match(regex) || []).length
}

async function auditPage(url) {
  const start = Date.now()
  const res = await fetch(url, { redirect: 'follow' })
  const status = res.status
  const contentType = res.headers.get('content-type') || ''
  const html = contentType.includes('text/html') ? await res.text() : ''
  const timeMs = Date.now() - start

  // Basic checks
  const title = extract(html, /<title>(.*?)<\/title>/i)
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const metaDesc = extract(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html)
  const hasSkip = /Skip to main content/i.test(html)
  const hasHeader = /<header[^>]*role=["']?banner["']?[^>]*>/i.test(html) || /id=["']navigation["']/i.test(html)
  const hasFooter = /<footer[^>]*role=["']?contentinfo["']?[^>]*>/i.test(html) || /id=["']footer["']/i.test(html)

  // Images without alt
  const imgTags = html.match(/<img\b[^>]*>/gi) || []
  let imagesWithoutAlt = 0
  for (const img of imgTags) {
    if (!/\balt=/.test(img)) imagesWithoutAlt++
  }

  // Basic CSS/JS presence (sanity)
  const cssLinks = count(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, html)
  const scripts = count(/<script\b[^>]*>/gi, html)

  const issues = []
  if (status !== 200) issues.push(`Non-200 status: ${status}`)
  if (!title) issues.push('Missing <title>')
  if (!h1) issues.push('Missing <h1>')
  if (!metaDesc) issues.push('Missing meta description')
  if (!hasCanonical) issues.push('Missing rel=canonical')
  if (!hasHeader) issues.push('Missing header/banner landmark')
  if (!hasFooter) issues.push('Missing footer/contentinfo landmark')
  if (!hasSkip) issues.push('Missing skip navigation link')
  if (imagesWithoutAlt > 0) issues.push(`${imagesWithoutAlt} images without alt attribute`)
  if (cssLinks === 0) issues.push('No stylesheet links detected')
  if (scripts === 0) issues.push('No script tags detected')

  return {
    url,
    status,
    timeMs,
    title,
    h1: h1.replace(/<[^>]+>/g, '').slice(0, 120),
    hasCanonical,
    hasSkip,
    hasHeader,
    hasFooter,
    imagesWithoutAlt,
    cssLinks,
    scripts,
    issues,
  }
}

async function main() {
  const urls = await getUrlsFromSitemap(SITEMAP_URL)
  const results = []
  for (const url of urls) {
    try {
      const r = await auditPage(url)
      results.push(r)
    } catch (e) {
      results.push({ url, status: 0, timeMs: 0, title: '', h1: '', issues: [`Fetch error: ${e.message}`] })
    }
  }

  const lines = []
  lines.push('# Visual/HTML Audit Report')
  lines.push('')
  lines.push(`Date: ${new Date().toISOString()}`)
  lines.push(`Target: https://www.pgclosets.com (sampled ${results.length} pages from sitemap)`) 
  lines.push('')
  const totalIssues = results.reduce((a, r) => a + (r.issues?.length || 0), 0)
  lines.push(`Summary: ${results.filter(r => r.status === 200).length}/${results.length} pages returned 200; Total issues flagged: ${totalIssues}.`)
  lines.push('')

  for (const r of results) {
    lines.push(`## ${r.url}`)
    lines.push(`- status: ${r.status} • time: ${r.timeMs}ms`)
    lines.push(`- title: ${r.title || '—'}`)
    lines.push(`- h1: ${r.h1 || '—'}`)
    lines.push(`- canonical: ${r.hasCanonical ? 'yes' : 'no'} • skip-link: ${r.hasSkip ? 'yes' : 'no'} • header: ${r.hasHeader ? 'yes' : 'no'} • footer: ${r.hasFooter ? 'yes' : 'no'}`)
    lines.push(`- assets: css=${r.cssLinks} • scripts=${r.scripts} • img(missing alt)=${r.imagesWithoutAlt}`)
    if (r.issues?.length) {
      lines.push('- issues:')
      for (const i of r.issues) lines.push(`  - ${i}`)
    } else {
      lines.push('- issues: none')
    }
    lines.push('')
  }

  const outPath = new URL('../visual-audit-report.md', import.meta.url)
  await fs.writeFile(outPath, lines.join('\n'), 'utf8')
  console.log(`Wrote report to ${outPath.pathname}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

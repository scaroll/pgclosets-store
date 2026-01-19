#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full)
    else if (/\.(jsx|tsx|js|ts)$/.test(e.name)) checkFile(full)
  }
}

function checkFile(file) {
  let src = fs.readFileSync(file, 'utf8')
  if (!src.includes('</Link>')) return
  const hasRawAnchor = /<a[\s>]/.test(src)
  const hasLinkOpen = /<Link[\s>]/.test(src)
  if (hasRawAnchor && !hasLinkOpen) {
    const fixed = src.replace(/<\/(?:Link)\s*>/g, '</a>')
    if (fixed !== src) {
      fs.writeFileSync(file, fixed, 'utf8')
      console.log('Fixed mismatched closing tags in', file)
    }
  }
}

const root = process.cwd()
console.log('Scanning for mismatched closing tags...')
walk(root)
console.log('Done')

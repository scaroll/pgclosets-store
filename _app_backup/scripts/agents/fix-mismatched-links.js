#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', '..')
const exts = ['.tsx', '.jsx', '.ts']

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'out', 'build'].includes(ent.name)) return
      walk(p, cb)
    } else {
      cb(p)
    }
  })
}

const fixed = []
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')
  // If file contains '</Link>' but does not contain '<Link', and does contain '<a', then it's likely a bad conversion
  if (s.includes('</Link>') && !s.includes('<Link') && s.includes('<a')) {
    const before = s
    s = s.replace(/<\/Link>/g, '</a>')
    if (s !== before) {
      fs.writeFileSync(file, s, 'utf8')
      fixed.push(file)
    }
  }
})

console.log('Fixed mismatched closing tags in', fixed.length, 'files')
fixed.slice(0,50).forEach(f => console.log('  ', f))

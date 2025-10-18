#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', '..')
const exts = ['.tsx', '.jsx', '.ts', '.tsx']

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'out' || ent.name === 'build') return
      walk(p, cb)
    } else {
      cb(p)
    }
  })
}

let changed = 0
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')
  const orig = s
  s = s.replace(/&amp;apos;/g, "&apos;")
  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8')
    changed++
  }
})
console.log('Fixed &amp;apos; in', changed, 'files')

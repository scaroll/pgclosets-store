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
    } else cb(p)
  })
}

let changed = []
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')
  if (!s.includes("import Link from 'next/link'") && !s.includes('import Link from "next/link"')) return
  // If file doesn't have '<Link' usage, remove the import
  if (!s.includes('<Link')) {
    const fixed = s.replace(/import Link from ['\"]next\/link['\"];?\n?/, '')
    if (fixed !== s) {
      fs.writeFileSync(file, fixed, 'utf8')
      changed.push(file)
    }
  }
})

console.log('Removed unused Link imports in', changed.length, 'files')
changed.slice(0,50).forEach(f => console.log(' ', f))

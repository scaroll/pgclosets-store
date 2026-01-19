#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// Walk the repo and replace common unescaped apostrophes inside JSX/TSX files
const root = path.resolve(__dirname, '..', '..')
const exts = ['.tsx', '.jsx']

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

const changes = []
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')
  const orig = s
  // conservative replacements: Don't -> Don&apos;t, We're -> We&apos;re, we'll -> we&apos;ll, it's -> it&apos;s, Ottawa's -> Ottawa&apos;s
  s = s.replace(/\bDon\'t\b/g, "Don&amp;apos;t")
  s = s.replace(/\bDon't\b/g, "Don&amp;apos;t")
  s = s.replace(/\bWe\'re\b/g, "We&amp;apos;re")
  s = s.replace(/\bWe're\b/g, "We&amp;apos;re")
  s = s.replace(/\bwe\'ll\b/g, "we&amp;apos;ll")
  s = s.replace(/\bwe'll\b/g, "we&amp;apos;ll")
  s = s.replace(/\bit\'s\b/g, "it&amp;apos;s")
  s = s.replace(/\bit's\b/g, "it&amp;apos;s")
  s = s.replace(/Ottawa\'s/g, "Ottawa&amp;apos;s")
  s = s.replace(/\bcan\'t\b/g, "can&amp;apos;t")
  s = s.replace(/\bcan't\b/g, "can&amp;apos;t")

  if (s !== orig) {
    changes.push({ file, before: orig, after: s })
    fs.writeFileSync(file, s, 'utf8')
  }
})

console.log(`Scanned and updated ${changes.length} files.`)
if (changes.length) {
  changes.slice(0, 20).forEach(c => console.log(c.file))
}

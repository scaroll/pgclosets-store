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

let changed = []
walk(root, file => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let src = fs.readFileSync(file, 'utf8')
  if (!src.includes('<a') || !src.includes('</Link>')) return

  let s = src
  // conservative pattern: find any <a ...> ... </Link> where the matched region does not contain <Link
  const regex = /<a\b[^>]*>[\s\S]*?<\/Link>/g
  let match
  let replaced = 0
  while ((match = regex.exec(s)) !== null) {
    const chunk = match[0]
    if (!chunk.includes('<Link')) {
      // replace final </Link> in this chunk with </a>
      const fixedChunk = chunk.replace(/<\/Link>$/, '</a>')
      s = s.slice(0, match.index) + fixedChunk + s.slice(match.index + chunk.length)
      replaced++
      // move regex lastIndex forward to avoid infinite loops
      regex.lastIndex = match.index + fixedChunk.length
    }
  }

  if (replaced > 0 && s !== src) {
    fs.writeFileSync(file, s, 'utf8')
    changed.push({ file, replaced })
  }
})

console.log('Fixed mixed mismatched closing tags in', changed.length, 'files')
changed.slice(0,50).forEach(c => console.log(' ', c.file, c.replaced))

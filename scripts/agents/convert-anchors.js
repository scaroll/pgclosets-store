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

let changedFiles = []
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')

  // Only operate on files that have href= and an <a tag
  if (!s.includes('<a') || !s.includes('href=')) return

  const before = s
  let replacements = 0

  // Convert opening tags where href starts with / or ./ or ../ (internal)
  // Pattern: <a ... href="/path" ...>
  s = s.replace(/<a([^>]*?)\s+href\s*=\s*("|')([.]{0,2}\/[\w\-./?=#%&{},:;+@!~*'()\[\]]*)\2([^>]*)>/g, (m, g1, q, p, g4) => {
    replacements++
    return `<Link${g1} href=${q}${p}${q}${g4}>`
  })

  // Convert opening tags where href is a JSX string expression href={'/path'} or href={"/path"}
  s = s.replace(/<a([^>]*?)\s+href\s*=\s*\{\s*("|')([.]{0,2}\/[\w\-./?=#%&{},:;+@!~*'()\[\]]*)\2\s*\}([^>]*)>/g, (m, g1, q, p, g4) => {
    replacements++
    return `<Link${g1} href={${q}${p}${q}}${g4}>`
  })

  // If we made opening replacements, replace closing tags </a> -> </Link>
  if (replacements > 0) {
    // But only replace closing tags that likely belong to anchors we changed.
    // Conservative approach: replace all </a> with </Link> only if file now contains at least one <Link>
    if (s.includes('<Link')) {
      s = s.replace(/<\/a>/g, '</Link>')
    }

    // Ensure `import Link from 'next/link'` exists (avoid duplicates)
    if (!/from\s+["']next\/link["']/.test(s)) {
      // Insert after the last import line if possible
      const importLines = s.match(/^import .*$/gm)
      if (importLines && importLines.length) {
        const lastImport = importLines[importLines.length - 1]
        const idx = s.lastIndexOf(lastImport)
        const insertAt = idx + lastImport.length
        const beforePart = s.slice(0, insertAt)
        const afterPart = s.slice(insertAt)
        s = `${beforePart}\nimport Link from 'next/link'${afterPart}`
      } else {
        s = `import Link from 'next/link'\n` + s
      }
    }
  }

  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8')
    changedFiles.push(file)
  }
})

console.log(`Converted anchors in ${changedFiles.length} files`)
changedFiles.slice(0,50).forEach(f => console.log('  ', f))

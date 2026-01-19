#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', '..')
const exts = ['.tsx', '.jsx', '.ts', '.js']

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(ent => {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'out', 'build'].includes(ent.name)) return
      walk(p, cb)
    } else cb(p)
  })
}

let fixedFiles = []
walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  if (file.includes('node_modules') || file.includes('lib/generated')) return
  let s = fs.readFileSync(file, 'utf8')
  if (!/catch\s*\(\s*(error|err|e)\s*\)/.test(s)) return

  const before = s
  // match catch blocks and check body for references
  s = s.replace(/catch\s*\(\s*(error|err|e)\s*\)\s*\{([\s\S]*?)\}/g, (m, name, body) => {
    const re = new RegExp('\\b' + name + '\\b')
    if (re.test(body)) return m // used inside catch body — skip
    // replace the param name with underscored version, and update body occurrences (should be none)
    const newName = '_' + name
    return `catch (${newName}) {${body}}`
  })

  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8')
    fixedFiles.push(file)
  }
})

console.log('Fixed unused caught errors in', fixedFiles.length, 'files')
fixedFiles.slice(0,50).forEach(f => console.log(' ', f))

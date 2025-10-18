const fs = require('fs')
const path = require('path')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'deploy') continue
      walk(full)
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      fixFile(full)
    }
  }
}

function fixFile(file) {
  let s = fs.readFileSync(file, 'utf8')
  // pattern: catch (_err) { ... _err ... }
  const catchPattern = /catch\s*\(\s*(_[a-zA-Z0-9_$]+)\s*\)\s*\{([\s\S]*?)\}/g
  let changed = false
  s = s.replace(catchPattern, (m, underscored, body) => {
    // find usages of the non-underscored name inside body
    const plain = underscored.replace(/^_/, '')
    if (body.includes(plain)) {
      const fixedBody = body.split(plain).join(underscored)
      changed = true
      return `catch (${underscored}) {${fixedBody}}`
    }
    return m
  })
  if (changed) {
    fs.writeFileSync(file, s, 'utf8')
    console.log('Fixed catch mismatches in', file)
  }
}

walk(process.cwd())

console.log('Done')

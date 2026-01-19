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

const imgs = []
const anchors = []

walk(root, (file) => {
  if (!exts.includes(path.extname(file))) return
  const s = fs.readFileSync(file, 'utf8')
  if (/\<img\b/.test(s)) imgs.push(file)
  // internal anchors with href starting with /
  const anchorRegex = /<a[^>]+href=\"\/(?!http)[^\"]*\"/g
  if (anchorRegex.test(s)) anchors.push(file)
})

console.log('Files containing <img>:', imgs.length)
imgs.slice(0,50).forEach(i=>console.log('  ', i))
console.log('\nFiles containing internal <a href="/...":', anchors.length)
anchors.slice(0,50).forEach(a=>console.log('  ', a))

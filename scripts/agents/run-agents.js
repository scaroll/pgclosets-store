#!/usr/bin/env node
const { spawnSync } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..', '..')
const node = process.execPath

console.log('Running agent: report-assets.js')
spawnSync(node, [path.join(root, 'scripts', 'agents', 'report-assets.js')], { stdio: 'inherit' })

console.log('\nRunning agent: escape-apostrophes.js (dry-run will modify files)')
spawnSync(node, [path.join(root, 'scripts', 'agents', 'escape-apostrophes.js')], { stdio: 'inherit' })

console.log('\nDone.')

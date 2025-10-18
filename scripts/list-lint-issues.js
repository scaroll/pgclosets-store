#!/usr/bin/env node

/**
 * Aggregate Next.js lint output into JSON for easier automation.
 */

const { spawn } = require('child_process')

const lint = spawn('npm', ['run', 'lint', '--', '--no-cache', '--format', 'json'], {
  stdio: ['inherit', 'pipe', 'inherit'],
})

let output = ''

lint.stdout.on('data', (data) => {
  output += data.toString()
})

lint.on('close', (code) => {
  if (!output.trim()) {
    console.log('[]')
    process.exit(code)
  }

  try {
    const parsed = JSON.parse(output)
    console.log(JSON.stringify(parsed, null, 2))
  } catch (error) {
    console.error('Failed to parse lint output:', error.message)
    process.exit(1)
  }

  process.exit(code)
})

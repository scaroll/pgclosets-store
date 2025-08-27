#!/usr/bin/env node
/**
 * PG CLOSETS DEPLOYMENT NODE.JS WRAPPER
 * =====================================
 * Node.js wrapper that executes the main deployment script
 * Provides the same functionality as ./deploy-pgclosets.sh
 * Usage: node deploy.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  const deployScript = path.join(__dirname, 'deploy-pgclosets.sh');
  
  // Check if deployment script exists
  if (!fs.existsSync(deployScript)) {
    log('❌ Deployment script not found: deploy-pgclosets.sh', 'red');
    log('   Please ensure deploy-pgclosets.sh exists in the project root.', 'red');
    process.exit(1);
  }
  
  // Check if script is executable
  try {
    fs.accessSync(deployScript, fs.constants.F_OK | fs.constants.X_OK);
  } catch (error) {
    log('❌ Deployment script is not executable', 'red');
    log('   Run: chmod +x deploy-pgclosets.sh', 'yellow');
    process.exit(1);
  }
  
  log('🚀 Starting PG Closets deployment via Node.js wrapper...', 'blue');
  log('   Executing: ./deploy-pgclosets.sh', 'blue');
  console.log('');
  
  try {
    // Execute the deployment script with real-time output
    execSync('./deploy-pgclosets.sh', {
      stdio: 'inherit',  // Pass through stdin, stdout, stderr
      cwd: __dirname,
      encoding: 'utf8'
    });
    
    console.log('');
    log('✅ Node.js deployment wrapper completed successfully!', 'green');
    
  } catch (error) {
    console.log('');
    log('❌ Deployment failed via Node.js wrapper', 'red');
    log(`   Exit code: ${error.status}`, 'red');
    process.exit(error.status || 1);
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  log('\n❌ Deployment interrupted', 'red');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\n❌ Deployment terminated', 'red');
  process.exit(1);
});

// Execute main function
main();
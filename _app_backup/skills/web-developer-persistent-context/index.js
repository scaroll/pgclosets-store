#!/usr/bin/env node

/**
 * Web Developer Persistent Context System
 * Main entry point for the CLI interface
 */

const { ContextManager } = require('./core/ContextManager.js');
const { ClaudeDesktopIntegration } = require('./cli/ClaudeDesktopIntegration.js');
const { SystemVerification } = require('./utils/VerificationScript.js');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    // Initialize context manager
    const contextManager = new ContextManager();
    const cli = new ClaudeDesktopIntegration(contextManager);
    const verifier = new SystemVerification(contextManager);

    switch (command) {
      case 'start-session':
      case 'init':
        await cli.executeCommand('start-session', commandArgs);
        break;

      case 'end-session':
      case 'stop':
        await cli.executeCommand('end-session', commandArgs);
        break;

      case 'status':
        await cli.executeCommand('status', commandArgs);
        break;

      case 'search':
        await cli.executeCommand('search', commandArgs);
        break;

      case 'export':
        await cli.executeCommand('export', commandArgs);
        break;

      case 'backup':
        await cli.executeCommand('backup', commandArgs);
        break;

      case 'restore':
        await cli.executeCommand('restore', commandArgs);
        break;

      case 'history':
        await cli.executeCommand('history', commandArgs);
        break;

      case 'decisions':
        await cli.executeCommand('decisions', commandArgs);
        break;

      case 'files':
        await cli.executeCommand('files', commandArgs);
        break;

      case 'health':
      case 'health-check':
        await cli.executeCommand('health-check', commandArgs);
        break;

      case 'verify':
      case 'test':
        await verifier.runFullVerification();
        break;

      case 'quick-check':
        await verifier.quickHealthCheck();
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Use "help" to see available commands');
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function showUsage() {
  console.log(`
🎯 Web Developer Persistent Context System

Usage: node index.js <command> [arguments]

Quick Start:
  node index.js start-session "My Project"
  node index.js status
  node index.js end-session

Use "help" to see all available commands
`);
}

function showHelp() {
  const help = {
    commands: {
      'start-session [name]': 'Start a new persistent context session',
      'end-session': 'End the current session and save to history',
      'status': 'Show current session status and statistics',
      'search "query"': 'Search through all recorded context data',
      'export': 'Export all context data to a file',
      'backup [description]': 'Create a manual backup with description',
      'restore <backup-id>': 'Restore context from a specific backup',
      'history': 'Show all historical sessions',
      'decisions [limit]': 'Show recent decisions (default: 10)',
      'files [limit]': 'Show recent file changes (default: 20)',
      'health-check': 'Perform system health check and diagnostics',
      'verify': 'Run comprehensive system verification',
      'quick-check': 'Run quick health check',
      'help': 'Show this help message'
    },
    examples: [
      'node index.js start-session "Product Page Development"',
      'node index.js search "fancy animations"',
      'node index.js decisions 5',
      'node index.js backup "Before refactoring"',
      'node index.js health-check'
    ]
  };

  console.log(`
🎯 Web Developer Persistent Context System - Commands

${Object.entries(help.commands).map(([cmd, desc]) =>
  `  ${cmd.padEnd(35)} ${desc}`
).join('\n')}

Examples:
${help.examples.map(example => `  ${example}`).join('\n')}

📚 Features:
  • ✅ Automatic context persistence (every 30 seconds)
  • ✅ Session management and history
  • ✅ Decision tracking with rationale
  • ✅ File change monitoring
  • ✅ Search through all work history
  • ✅ Backup and recovery systems
  • ✅ Health monitoring and diagnostics
  • ✅ Cross-session continuity

💡 Quick Start:
  1. Start a session: node index.js start-session "My Project"
  2. Work normally - everything is tracked automatically
  3. Check status: node index.js status
  4. End session: node index.js end-session

🔧 Integration:
  This skill integrates with Claude Desktop CLI and provides
  bulletproof context persistence for web development work.

📖 For more information, see SKILL.md in this directory.
`);
}

// Run main function
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
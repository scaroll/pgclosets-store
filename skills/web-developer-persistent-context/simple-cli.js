#!/usr/bin/env node

/**
 * Simple CLI for Persistent Context System
 * Easy to use interface for all context operations
 */

const ContextManager = require('./core/ContextManager.js');
const fs = require('fs');
const path = require('path');

class SimpleCLI {
  constructor() {
    this.contextManager = new ContextManager();
    this.isInitialized = false;
  }

  async init() {
    if (!this.isInitialized) {
      await this.contextManager.initialize();
      this.isInitialized = true;
      console.log('🚀 Persistent Context System Ready!');
    }
  }

  async startSession(name = 'Development Session') {
    await this.init();

    await this.contextManager.recordDecision({
      type: 'session_start',
      title: `Started: ${name}`,
      description: `Initiated development session`,
      rationale: 'User requested to start tracking context',
      tags: ['session', 'start', name.toLowerCase()]
    });

    console.log(`✅ Session started: ${name}`);
    console.log(`🆔 Session ID: ${this.contextManager.currentSession.id}`);
    console.log('📁 Context is now being tracked automatically...');

    return this.contextManager.currentSession.id;
  }

  async endSession() {
    if (!this.isInitialized) {
      console.log('❌ No active session to end');
      return;
    }

    await this.contextManager.recordDecision({
      type: 'session_end',
      title: 'Session Ended',
      description: 'Concluded development session',
      rationale: 'User requested to end session',
      tags: ['session', 'end']
    });

    await this.contextManager.endSession();
    console.log('🏁 Session ended and saved to history');
  }

  async showStatus() {
    if (!this.isInitialized) {
      console.log('❌ No active session. Use "start" to begin.');
      return;
    }

    const summary = this.contextManager.getSessionSummary();
    console.log('📊 Current Session Status:');
    console.log(`   Session ID: ${summary.id}`);
    console.log(`   Duration: ${summary.duration}`);
    console.log(`   Decisions: ${summary.decisionsCount}`);
    console.log(`   File Changes: ${summary.fileChangesCount}`);
    console.log(`   Last Saved: ${summary.lastSaved}`);
  }

  async recordDecision(title, description, rationale) {
    await this.init();

    const decision = await this.contextManager.recordDecision({
      type: 'development',
      title: title,
      description: description,
      rationale: rationale,
      tags: ['development', 'decision']
    });

    console.log(`📝 Decision recorded: ${title}`);
    return decision.id;
  }

  async search(query) {
    await this.init();

    const results = await this.contextManager.search(query);

    console.log(`🔍 Search Results for "${query}":`);
    console.log(`   Decisions: ${results.decisions.length}`);
    console.log(`   File Changes: ${results.fileChanges.length}`);
    console.log(`   Sessions: ${results.sessions.length}`);

    if (results.decisions.length > 0) {
      console.log('\n📝 Recent Decisions:');
      results.decisions.slice(0, 3).forEach(decision => {
        console.log(`   • ${decision.title} (${decision.timestamp})`);
      });
    }

    return results;
  }

  async export() {
    if (!this.isInitialized) {
      console.log('❌ No active session to export');
      return;
    }

    const exportFile = await this.contextManager.exportContext();
    console.log(`📦 Context exported to: ${exportFile}`);
    return exportFile;
  }

  async showHelp() {
    console.log(`
🎯 Persistent Context System - Simple CLI

Commands:
  start [name]     - Start a new session
  end              - End current session
  status           - Show current status
  decision <title> <description> <rationale>
                   - Record a decision
  search <query>   - Search through context
  export           - Export all context data
  help             - Show this help

Examples:
  node simple-cli.js start "Product Page Development"
  node simple-cli.js decision "Added floating animation" "Integrated Float component for product cards" "Enhanced user experience"
  node simple-cli.js search "animation"
  node simple-cli.js export

💡 Your context is automatically saved every 30 seconds!
`);
  }
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  const cli = new SimpleCLI();

  if (args.length === 0) {
    cli.showHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'start':
        await cli.startSession(args[1]);
        break;
      case 'end':
        await cli.endSession();
        break;
      case 'status':
        await cli.showStatus();
        break;
      case 'decision':
        if (args.length < 4) {
          console.log('❌ Usage: decision <title> <description> <rationale>');
          return;
        }
        await cli.recordDecision(args[1], args[2], args.slice(3).join(' '));
        break;
      case 'search':
        if (args.length < 2) {
          console.log('❌ Usage: search <query>');
          return;
        }
        await cli.search(args.slice(1).join(' '));
        break;
      case 'export':
        await cli.export();
        break;
      case 'help':
        cli.showHelp();
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Use "help" to see available commands');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = SimpleCLI;
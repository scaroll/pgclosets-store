#!/usr/bin/env node

/**
 * Setup Script for Persistent Context System
 * One-time setup and configuration
 */

const { ContextManager } = require('./core/ContextManager.js');
const { SystemVerification } = require('./utils/VerificationScript.js');
const fs = require('fs');
const path = require('path');

class SetupManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.contextManager = new ContextManager(this.projectRoot);
    this.verifier = new SystemVerification(this.contextManager);
  }

  async runSetup() {
    console.log('🚀 Setting up Web Developer Persistent Context System...\n');

    const setupSteps = [
      { name: 'Initialize Context System', action: () => this.initializeContext() },
      { name: 'Create Project Configuration', action: () => this.createProjectConfig() },
      { name: 'Set Up File Monitoring', action: () => this.setupFileMonitoring() },
      { name: 'Run System Verification', action: () => this.runVerification() },
      { name: 'Create Quick Start Scripts', action: () => this.createQuickStartScripts() },
      { name: 'Generate Setup Report', action: () => this.generateSetupReport() }
    ];

    let setupSuccess = true;

    for (const { name, action } of setupSteps) {
      try {
        console.log(`⚙️  ${name}...`);
        const result = await action();
        if (result.success) {
          console.log(`✅ ${name}: Complete`);
          if (result.details) console.log(`   ${result.details}`);
        } else {
          console.log(`❌ ${name}: Failed`);
          if (result.error) console.log(`   Error: ${result.error}`);
          setupSuccess = false;
        }
      } catch (error) {
        console.log(`❌ ${name}: Error - ${error.message}`);
        setupSuccess = false;
      }
      console.log('');
    }

    // Show final status
    this.showFinalStatus(setupSuccess);

    return setupSuccess;
  }

  async initializeContext() {
    await this.contextManager.initialize();

    // Record setup decision
    await this.contextManager.recordDecision({
      type: 'system_setup',
      title: 'Persistent Context System Setup',
      description: 'Initial setup of the web developer persistent context system',
      rationale: 'Ensure no context is lost between Claude Desktop sessions',
      tags: ['setup', 'system', 'initialization'],
      impact: 'high'
    });

    return {
      success: true,
      details: 'Context system initialized and first session created'
    };
  }

  async createProjectConfig() {
    const config = {
      project: {
        name: path.basename(this.projectRoot),
        type: 'web-development',
        framework: 'next.js',
        root: this.projectRoot,
        setupDate: new Date().toISOString()
      },
      context: {
        autoBackupInterval: 30000, // 30 seconds
        maxBackups: 50,
        searchIndexing: true,
        fileMonitoring: true
      },
      features: {
        fancyAnimations: true,
        appleDesign: true,
        responsive: true,
        performanceOptimized: true
      },
      custom: {
        projectSpecific: true,
        pgClosetsProject: true
      }
    };

    const configFile = path.join(this.contextManager.contextDir, 'project-config.json');
    await fs.writeFile(configFile, JSON.stringify(config, null, 2));

    return {
      success: true,
      details: `Project configuration created for ${config.project.name}`
    };
  }

  async setupFileMonitoring() {
    const ignoreFile = path.join(this.contextManager.contextDir, '.gitignore');
    const ignoreContent = `
# Ignore temporary files
*.tmp
*.temp

# Ignore sensitive data if any
sensitive/

# Keep structure files
!.gitkeep
!project-config.json
`;

    await fs.writeFile(ignoreFile, ignoreContent.trim());

    return {
      success: true,
      details: 'File monitoring configuration created'
    };
  }

  async runVerification() {
    const results = await this.verifier.runFullVerification();

    return {
      success: results.success,
      details: `Verification completed with ${results.success ? 'SUCCESS' : 'ISSUES'}`
    };
  }

  async createQuickStartScripts() {
    const scripts = {
      'start-session.sh': `#!/bin/bash
# Quick start script
echo "🚀 Starting persistent context session..."
node index.js start-session "Development Session"
echo "✅ Session started! Context is now being tracked."
`,
      'end-session.sh': `#!/bin/bash
# End session script
echo "🏁 Ending persistent context session..."
node index.js end-session
echo "✅ Session ended and saved to history."
`,
      'status.sh': `#!/bin/bash
# Status check script
echo "📊 Checking context status..."
node index.js status
`,
      'quick-backup.sh': `#!/bin/bash
# Quick backup script
echo "💾 Creating manual backup..."
node index.js backup "Manual backup from shell"
echo "✅ Backup completed."
`
    };

    const scriptsDir = path.join(this.contextManager.contextDir, 'scripts');
    await fs.mkdir(scriptsDir, { recursive: true });

    for (const [filename, content] of Object.entries(scripts)) {
      const scriptPath = path.join(scriptsDir, filename);
      await fs.writeFile(scriptPath, content);

      // Make scripts executable (on Unix systems)
      try {
        await fs.chmod(scriptPath, '755');
      } catch (error) {
        // Ignore chmod errors on Windows
      }
    }

    return {
      success: true,
      details: 'Quick start scripts created in .claude-context/scripts/'
    };
  }

  async generateSetupReport() {
    const report = {
      setupDate: new Date().toISOString(),
      projectRoot: this.projectRoot,
      contextDirectory: this.contextManager.contextDir,
      sessionId: this.contextManager.currentSession?.id,
      directories: {
        context: this.contextManager.contextDir,
        sessions: this.contextManager.sessionsDir,
        decisions: this.contextManager.decisionsDir,
        fileChanges: this.contextManager.fileChangesDir,
        backups: this.contextManager.backupsDir,
        scripts: path.join(this.contextManager.contextDir, 'scripts')
      },
      nextSteps: [
        '1. Start a new session: node index.js start-session "Your Project Name"',
        '2. Check status anytime: node index.js status',
        '3. Work normally - everything is tracked automatically',
        '4. End session when done: node index.js end-session',
        '5. Search history: node index.js search "your query"'
      ],
      tips: [
        '• The system auto-saves every 30 seconds',
        '• All decisions and file changes are tracked',
        '• You can search through all previous work',
        '• Context persists across Claude Desktop restarts'
      ]
    };

    const reportFile = path.join(this.contextManager.contextDir, 'setup-report.json');
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));

    return {
      success: true,
      details: 'Setup report generated'
    };
  }

  showFinalStatus(success) {
    if (success) {
      console.log(`╔══════════════════════════════════════════════════════════════╗
║     🎉 SETUP COMPLETED SUCCESSFULLY!                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Your Web Developer Persistent Context System is ready!       ║
║                                                              ║
║  📁 Context Directory: ${this.contextManager.contextDir.padEnd(47)} ║
║  🆔 Session ID: ${this.contextManager.currentSession?.id.padEnd(49)} ║
║                                                              ║
║  Quick Start Commands:                                        ║
║  • Start session: node index.js start-session "Project Name"    ║
║  • Check status:  node index.js status                        ║
║  • Search:       node index.js search "query"                ║
║  • End session:  node index.js end-session                    ║
║                                                              ║
║  ✨ You will NEVER lose context again!                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    } else {
      console.log(`╔══════════════════════════════════════════════════════════════╗
║     ⚠️  SETUP COMPLETED WITH ISSUES                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Some setup steps encountered issues.                        ║
║  Please review the error messages above.                       ║
║                                                              ║
║  You can try running:                                        ║
║  • node index.js verify        (full verification)           ║
║  • node index.js health-check  (health diagnostics)          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    }
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new SetupManager();
  setup.runSetup().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

export default SetupManager;
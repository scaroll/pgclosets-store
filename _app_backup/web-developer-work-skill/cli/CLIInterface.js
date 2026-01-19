#!/usr/bin/env node

/**
 * CLI Interface - Command-line interface for Claude Desktop integration
 * Provides commands for managing work sessions and context persistence
 */

const { Command } = require('commander');
const chalk = require('chalk');
const Table = require('cli-table3');
const path = require('path');
const fs = require('fs').promises;
const StorageEngine = require('../core/StorageEngine');
const ContextManager = require('../core/ContextManager');
const SessionManager = require('../core/SessionManager');

class CLIInterface {
  constructor() {
    this.program = new Command();
    this.storageEngine = null;
    this.contextManager = null;
    this.sessionManager = null;
    this.isInitialized = false;

    this.setupCommands();
  }

  /**
   * Initialize the CLI interface
   */
  async initialize(baseDir = null) {
    try {
      const workDir = baseDir || process.cwd();
      const claudeWorkDir = path.join(workDir, '.claude-work');

      // Check if .claude-work directory exists
      try {
        await fs.access(claudeWorkDir);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(chalk.yellow('No .claude-work directory found. Run --init to set up.'));
          return false;
        }
      }

      // Initialize components
      this.storageEngine = new StorageEngine(claudeWorkDir);
      await this.storageEngine.initialize();

      this.contextManager = new ContextManager(this.storageEngine);
      await this.contextManager.initialize();

      this.sessionManager = new SessionManager(this.storageEngine);
      await this.sessionManager.autoResumeLastSession();

      this.isInitialized = true;

      return true;
    } catch (error) {
      console.error(chalk.red('Failed to initialize CLI interface:'), error.message);
      return false;
    }
  }

  /**
   * Setup command definitions
   */
  setupCommands() {
    this.program
      .name('web-developer-work-skill')
      .description('Persistent context management for web developers')
      .version('1.0.0');

    // Initialize command
    this.program
      .command('init')
      .description('Initialize work skill in current directory')
      .option('-d, --dir <directory>', 'Working directory', process.cwd())
      .option('-n, --name <name>', 'Project name')
      .option('-f, --force', 'Force initialization even if directory exists')
      .action(this.handleInit.bind(this));

    // Start session command
    this.program
      .command('start-session')
      .description('Start a new work session')
      .argument('[name]', 'Session name')
      .option('-d, --description <description>', 'Session description')
      .option('-t, --tags <tags>', 'Comma-separated tags')
      .option('--no-auto-save', 'Disable auto-save')
      .action(this.handleStartSession.bind(this));

    // End session command
    this.program
      .command('end-session')
      .description('End current work session')
      .option('-r, --reason <reason>', 'End reason', 'manual')
      .action(this.handleEndSession.bind(this));

    // Resume session command
    this.program
      .command('resume-session')
      .description('Resume a previous session')
      .argument('[session-id]', 'Session ID to resume')
      .action(this.handleResumeSession.bind(this));

    // Status command
    this.program
      .command('status')
      .description('Show current status')
      .option('-v, --verbose', 'Verbose output')
      .action(this.handleStatus.bind(this));

    // History command
    this.program
      .command('history')
      .description('Show session history')
      .option('-l, --limit <number>', 'Limit number of sessions', '10')
      .option('-s, --status <status>', 'Filter by status')
      .option('-n, --name <name>', 'Filter by name')
      .option('-t, --tags <tags>', 'Filter by tags')
      .action(this.handleHistory.bind(this));

    // Search command
    this.program
      .command('search')
      .description('Search through work history')
      .argument('<query>', 'Search query')
      .option('-l, --limit <number>', 'Limit results', '20')
      .option('--no-contexts', 'Don\'t search contexts')
      .option('--no-commands', 'Don\'t search commands')
      .option('--no-notes', 'Don\'t search notes')
      .action(this.handleSearch.bind(this));

    // Backup command
    this.program
      .command('backup')
      .description('Create a backup')
      .option('-t, --type <type>', 'Backup type (manual/automatic)', 'manual')
      .option('-d, --description <description>', 'Backup description')
      .action(this.handleBackup.bind(this));

    // Restore command
    this.program
      .command('restore')
      .description('Restore from backup')
      .argument('<backup-id>', 'Backup ID to restore')
      .option('-t, --type <type>', 'Backup type', 'manual')
      .action(this.handleRestore.bind(this));

    // Save context command
    this.program
      .command('save-context')
      .description('Manually save current context')
      .option('-t, --trigger <trigger>', 'Save trigger', 'manual')
      .action(this.handleSaveContext.bind(this));

    // Checkpoint command
    this.program
      .command('checkpoint')
      .description('Create a session checkpoint')
      .argument('<type>', 'Checkpoint type')
      .option('-d, --data <data>', 'Checkpoint data (JSON string)')
      .action(this.handleCheckpoint.bind(this));

    // List backups command
    this.program
      .command('list-backups')
      .description('List available backups')
      .option('-t, --type <type>', 'Filter by backup type')
      .action(this.handleListBackups.bind(this));

    // Cleanup command
    this.program
      .command('cleanup')
      .description('Cleanup old data')
      .option('-d, --days <days>', 'Retention days', '30')
      .option('--dry-run', 'Show what would be deleted without actually deleting')
      .action(this.handleCleanup.bind(this));

    // Health check command
    this.program
      .command('health-check')
      .description('Perform system health check')
      .option('--fix', 'Attempt to fix issues automatically')
      .action(this.handleHealthCheck.bind(this));

    // Config command
    this.program
      .command('config')
      .description('Manage configuration')
      .argument('[key]', 'Configuration key')
      .argument('[value]', 'Configuration value')
      .option('--show', 'Show current configuration')
      .option('--reset', 'Reset to defaults')
      .action(this.handleConfig.bind(this));
  }

  /**
   * Command handlers
   */
  async handleInit(options) {
    try {
      const workDir = path.resolve(options.dir);
      const claudeWorkDir = path.join(workDir, '.claude-work');

      console.log(chalk.blue('🚀 Initializing Web Developer Work Skill...'));

      // Check if directory exists
      try {
        await fs.access(claudeWorkDir);
        if (!options.force) {
          console.log(chalk.yellow('⚠️  .claude-work directory already exists. Use --force to reinitialize.'));
          return;
        }
      } catch (error) {
        // Directory doesn't exist, continue
      }

      // Create directory structure
      await fs.mkdir(claudeWorkDir, { recursive: true });

      // Initialize storage
      const storageEngine = new StorageEngine(claudeWorkDir);
      await storageEngine.initialize();

      // Create default configuration
      const defaultConfig = {
        autoSave: {
          enabled: true,
          interval: 30000,
          onFileChange: true,
          onCommand: true
        },
        backup: {
          enabled: true,
          frequency: 'hourly',
          maxBackups: 50,
          compression: true
        },
        session: {
          timeout: 1800000,
          autoResume: true,
          trackActivity: true
        },
        context: {
          maxContextSize: 1000000,
          compressionThreshold: 100000,
          retentionDays: 30
        }
      };

      await fs.writeFile(
        path.join(claudeWorkDir, 'config', 'settings.json'),
        JSON.stringify(defaultConfig, null, 2)
      );

      // Create ignore rules
      const ignoreRules = {
        files: [
          'node_modules/**',
          '.git/**',
          'dist/**',
          'build/**',
          '*.log',
          '.env*'
        ],
        patterns: [
          '*.tmp',
          '*.cache',
          '__pycache__/**'
        ]
      };

      await fs.writeFile(
        path.join(claudeWorkDir, 'config', 'ignore-rules.json'),
        JSON.stringify(ignoreRules, null, 2)
      );

      // Create project info
      const projectName = options.name || path.basename(workDir);
      const projectInfo = {
        name: projectName,
        createdAt: new Date().toISOString(),
        initializedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      await fs.writeFile(
        path.join(claudeWorkDir, 'project-info.json'),
        JSON.stringify(projectInfo, null, 2)
      );

      console.log(chalk.green('✅ Successfully initialized Web Developer Work Skill!'));
      console.log(chalk.gray(`   📁 Working directory: ${workDir}`));
      console.log(chalk.gray(`   📋 Project name: ${projectName}`));
      console.log(chalk.gray('   💡 Run "claude skill web-developer-work-skill status" to check the system.'));

    } catch (error) {
      console.error(chalk.red('❌ Initialization failed:'), error.message);
      process.exit(1);
    }
  }

  async handleStartSession(name, options) {
    await this.ensureInitialized();

    try {
      const tags = options.tags ? options.tags.split(',').map(tag => tag.trim()) : [];
      const sessionName = name || `Session ${new Date().toLocaleString()}`;

      const session = await this.sessionManager.createSession(sessionName, {
        description: options.description,
        tags,
        metadata: {
          startedFromCLI: true
        }
      });

      console.log(chalk.green(`✅ Started session: ${session.name}`));
      console.log(chalk.gray(`   🆔 Session ID: ${session.id}`));
      console.log(chalk.gray(`   ⏰ Started at: ${new Date(session.startTime).toLocaleString()}`));

      if (options.description) {
        console.log(chalk.gray(`   📝 Description: ${options.description}`));
      }

      if (tags.length > 0) {
        console.log(chalk.gray(`   🏷️  Tags: ${tags.join(', ')}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Failed to start session:'), error.message);
      process.exit(1);
    }
  }

  async handleEndSession(options) {
    await this.ensureInitialized();

    try {
      const session = await this.sessionManager.endSession(options.reason);

      if (!session) {
        console.log(chalk.yellow('⚠️  No active session to end.'));
        return;
      }

      const duration = Date.now() - new Date(session.startTime).getTime();
      const durationFormatted = this.formatDuration(duration);

      console.log(chalk.green(`✅ Ended session: ${session.name}`));
      console.log(chalk.gray(`   🆔 Session ID: ${session.id}`));
      console.log(chalk.gray(`   ⏰ Ended at: ${new Date(session.endTime).toLocaleString()}`));
      console.log(chalk.gray(`   ⏱️  Duration: ${durationFormatted}`));
      console.log(chalk.gray(`   📊 Commands executed: ${session.statistics.commandsExecuted}`));
      console.log(chalk.gray(`   📁 File operations: ${session.statistics.fileOperations}`));

    } catch (error) {
      console.error(chalk.red('❌ Failed to end session:'), error.message);
      process.exit(1);
    }
  }

  async handleResumeSession(sessionId) {
    await this.ensureInitialized();

    try {
      let session;

      if (sessionId) {
        session = await this.sessionManager.resumeSession(sessionId);
      } else {
        // Resume last active session
        session = await this.sessionManager.autoResumeLastSession();
        if (!session) {
          console.log(chalk.yellow('⚠️  No session to resume.'));
          return;
        }
      }

      console.log(chalk.green(`✅ Resumed session: ${session.name}`));
      console.log(chalk.gray(`   🆔 Session ID: ${session.id}`));
      console.log(chalk.gray(`   ⏰ Originally started: ${new Date(session.startTime).toLocaleString()}`));

      if (session.lastResumed) {
        console.log(chalk.gray(`   🔄 Last resumed: ${new Date(session.lastResumed).toLocaleString()}`));
        console.log(chalk.gray(`   🔄 Resume count: ${session.resumeCount}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Failed to resume session:'), error.message);
      process.exit(1);
    }
  }

  async handleStatus(options) {
    await this.ensureInitialized();

    try {
      const contextStatus = this.contextManager.getStatus();
      const sessionStatus = this.sessionManager.getStatus();
      const storageStats = await this.storageEngine.getStorageStats();

      console.log(chalk.blue('📊 System Status'));

      // Session status
      if (sessionStatus.hasActiveSession) {
        const session = sessionStatus.activeSession;
        const duration = this.formatDuration(session.duration);
        const idleTime = this.formatDuration(sessionStatus.statistics.idleTime);

        console.log(chalk.green('\n🔄 Active Session:'));
        console.log(`   Name: ${session.name}`);
        console.log(`   ID: ${session.id}`);
        console.log(`   Duration: ${duration}`);
        console.log(`   Idle time: ${idleTime}`);
        console.log(`   Commands: ${sessionStatus.statistics.commandsExecuted}`);
        console.log(`   File operations: ${sessionStatus.statistics.fileOperations}`);

        if (options.verbose) {
          console.log(chalk.blue('\n📈 Detailed Statistics:'));
          console.log(`   Checkpoints: ${sessionStatus.statistics.checkpointCount}`);
          console.log(`   Buffer activities: ${sessionStatus.statistics.bufferActivityCount}`);
          console.log(`   Last activity: ${new Date(session.lastActivity).toLocaleString()}`);
        }
      } else {
        console.log(chalk.yellow('\n⏸️  No active session'));
      }

      // Context status
      if (contextStatus.currentContext) {
        const context = contextStatus.currentContext;
        console.log(chalk.green('\n💾 Current Context:'));
        console.log(`   Session ID: ${context.sessionId}`);
        console.log(`   Files tracked: ${context.fileCount}`);
        console.log(`   Commands: ${context.commandCount}`);
        console.log(`   Notes: ${context.noteCount}`);
        console.log(`   Last updated: ${new Date(context.timestamp).toLocaleString()}`);
      }

      // Storage statistics
      console.log(chalk.blue('\n📦 Storage Statistics:'));
      console.log(`   Sessions: ${storageStats.sessions}`);
      console.log(`   Contexts: ${storageStats.contexts}`);
      console.log(`   Manual backups: ${storageStats.backups.manual}`);
      console.log(`   Auto backups: ${storageStats.backups.automatic}`);
      console.log(`   Recovery points: ${storageStats.backups.recovery}`);

      // Health check
      const health = sessionStatus.health;
      if (health.healthy) {
        console.log(chalk.green('\n✅ System Health: Good'));
      } else {
        console.log(chalk.red('\n⚠️  System Health Issues:'));
        health.warnings.forEach(warning => {
          console.log(`   • ${warning}`);
        });
      }

    } catch (error) {
      console.error(chalk.red('❌ Failed to get status:'), error.message);
      process.exit(1);
    }
  }

  async handleHistory(options) {
    await this.ensureInitialized();

    try {
      const limit = parseInt(options.limit) || 10;
      const filterOptions = {};

      if (options.status) {
        filterOptions.status = options.status;
      }

      if (options.name) {
        filterOptions.name = options.name;
      }

      if (options.tags) {
        filterOptions.tags = options.tags.split(',').map(tag => tag.trim());
      }

      const result = await this.sessionManager.getSessionHistory({
        limit,
        ...filterOptions
      });

      if (result.sessions.length === 0) {
        console.log(chalk.yellow('📝 No sessions found matching the criteria.'));
        return;
      }

      console.log(chalk.blue(`📚 Session History (${result.sessions.length} of ${result.total})`));

      const table = new Table({
        head: ['Name', 'Status', 'Start Time', 'Duration', 'Commands'],
        colWidths: [30, 10, 20, 15, 10]
      });

      result.sessions.forEach(session => {
        const duration = session.endTime ?
          this.formatDuration(Date.now() - new Date(session.startTime).getTime()) :
          this.formatDuration(Date.now() - new Date(session.startTime).getTime());

        const startTime = new Date(session.startTime).toLocaleString();

        table.push([
          session.name.substring(0, 28),
          session.status,
          startTime,
          duration,
          session.statistics.commandsExecuted.toString()
        ]);
      });

      console.log(table.toString());

    } catch (error) {
      console.error(chalk.red('❌ Failed to get history:'), error.message);
      process.exit(1);
    }
  }

  async handleSearch(query, options) {
    await this.ensureInitialized();

    try {
      const searchOptions = {
        limit: parseInt(options.limit) || 20,
        contexts: options.contexts !== false,
        commands: options.commands !== false,
        notes: options.notes !== false
      };

      const results = await this.storageEngine.searchHistory(query, searchOptions);

      if (results.total === 0) {
        console.log(chalk.yellow(`🔍 No results found for "${query}"`));
        return;
      }

      console.log(chalk.blue(`🔍 Search Results for "${query}" (${results.total} found)`));

      if (results.sessions.length > 0) {
        console.log(chalk.green('\n📋 Sessions:'));
        results.sessions.forEach(session => {
          console.log(`   • ${session.name} (${session.id.substring(0, 8)}...)`);
        });
      }

      if (results.commands.length > 0) {
        console.log(chalk.green('\n⚡ Commands:'));
        results.commands.slice(0, 10).forEach(command => {
          console.log(`   • ${command.command || command.type} (${new Date(command.timestamp).toLocaleString()})`);
        });
      }

      if (results.notes.length > 0) {
        console.log(chalk.green('\n📝 Notes:'));
        results.notes.slice(0, 10).forEach(note => {
          const preview = (note.content || note.note || '').substring(0, 50);
          console.log(`   • ${preview}... (${new Date(note.timestamp).toLocaleString()})`);
        });
      }

    } catch (error) {
      console.error(chalk.red('❌ Search failed:'), error.message);
      process.exit(1);
    }
  }

  async handleBackup(options) {
    await this.ensureInitialized();

    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        session: this.sessionManager.activeSession,
        context: this.contextManager.currentContext,
        description: options.description
      };

      const backup = await this.storageEngine.createBackup(backupData, options.type, options.description);

      console.log(chalk.green(`✅ Backup created successfully`));
      console.log(chalk.gray(`   🆔 Backup ID: ${backup.id}`));
      console.log(chalk.gray(`   📦 Type: ${backup.type}`));
      console.log(chalk.gray(`   ⏰ Created: ${new Date(backup.timestamp).toLocaleString()}`));

      if (options.description) {
        console.log(chalk.gray(`   📝 Description: ${options.description}`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Backup failed:'), error.message);
      process.exit(1);
    }
  }

  async handleRestore(backupId, options) {
    await this.ensureInitialized();

    try {
      const backup = await this.storageEngine.restoreBackup(backupId, options.type);

      console.log(chalk.green(`✅ Backup restored successfully`));
      console.log(chalk.gray(`   🆔 Backup ID: ${backup.id}`));
      console.log(chalk.gray(`   📦 Type: ${backup.type}`));
      console.log(chalk.gray(`   ⏰ Created: ${new Date(backup.timestamp).toLocaleString()}`));

      if (backup.description) {
        console.log(chalk.gray(`   📝 Description: ${backup.description}`));
      }

      console.log(chalk.yellow('💡 You may need to restart your session to fully apply the restored data.'));

    } catch (error) {
      console.error(chalk.red('❌ Restore failed:'), error.message);
      process.exit(1);
    }
  }

  async handleSaveContext(options) {
    await this.ensureInitialized();

    try {
      const context = await this.contextManager.saveContext(options.trigger);

      if (!context) {
        console.log(chalk.yellow('⚠️  No active context to save.'));
        return;
      }

      console.log(chalk.green(`✅ Context saved successfully`));
      console.log(chalk.gray(`   🆔 Context ID: ${context.id || context.sessionId}`));
      console.log(chalk.gray(`   ⏰ Saved: ${new Date(context.timestamp).toLocaleString()}`));
      console.log(chalk.gray(`   📏 Size: ${this.formatBytes(context.size)}`));
      console.log(chalk.gray(`   ⚡ Trigger: ${context.trigger}`));

    } catch (error) {
      console.error(chalk.red('❌ Context save failed:'), error.message);
      process.exit(1);
    }
  }

  async handleCheckpoint(type, options) {
    await this.ensureInitialized();

    try {
      let data = {};
      if (options.data) {
        try {
          data = JSON.parse(options.data);
        } catch (error) {
          console.error(chalk.red('❌ Invalid JSON data provided'));
          process.exit(1);
        }
      }

      const checkpoint = await this.sessionManager.createCheckpoint(type, data);

      if (!checkpoint) {
        console.log(chalk.yellow('⚠️  No active session for checkpoint.'));
        return;
      }

      console.log(chalk.green(`✅ Checkpoint created: ${type}`));
      console.log(chalk.gray(`   🆔 ID: ${checkpoint.id}`));
      console.log(chalk.gray(`   ⏰ Created: ${new Date(checkpoint.timestamp).toLocaleString()}`));

    } catch (error) {
      console.error(chalk.red('❌ Checkpoint creation failed:'), error.message);
      process.exit(1);
    }
  }

  async handleListBackups(options) {
    await this.ensureInitialized();

    try {
      const backups = await this.storageEngine.listBackups(options.type);

      if (backups.length === 0) {
        console.log(chalk.yellow('📦 No backups found.'));
        return;
      }

      console.log(chalk.blue(`📦 Available Backups (${backups.length})`));

      const table = new Table({
        head: ['ID', 'Type', 'Created', 'Description'],
        colWidths: [20, 12, 20, 30]
      });

      backups.slice(0, 20).forEach(backup => {
        const created = new Date(backup.timestamp).toLocaleString();
        const description = (backup.description || '').substring(0, 28);

        table.push([
          backup.id.substring(0, 18),
          backup.type,
          created,
          description
        ]);
      });

      console.log(table.toString());

      if (backups.length > 20) {
        console.log(chalk.gray(`\n... and ${backups.length - 20} more backups`));
      }

    } catch (error) {
      console.error(chalk.red('❌ Failed to list backups:'), error.message);
      process.exit(1);
    }
  }

  async handleCleanup(options) {
    await this.ensureInitialized();

    try {
      const retentionDays = parseInt(options.days) || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      if (options.dryRun) {
        console.log(chalk.blue('🔍 Dry run - showing what would be deleted:'));
        // Would implement dry run logic here
        console.log(chalk.gray(`   📅 Cutoff date: ${cutoffDate.toLocaleString()}`));
        console.log(chalk.gray(`   📂 Files older than ${retentionDays} days would be deleted`));
        return;
      }

      const results = await this.storageEngine.cleanupOldData(cutoffDate);

      console.log(chalk.green('✅ Cleanup completed'));
      console.log(chalk.gray(`   📋 Sessions deleted: ${results.sessionsDeleted}`));
      console.log(chalk.gray(`   💾 Contexts deleted: ${results.contextsDeleted}`));
      console.log(chalk.gray(`   📦 Backups deleted: ${results.backupsDeleted}`));

    } catch (error) {
      console.error(chalk.red('❌ Cleanup failed:'), error.message);
      process.exit(1);
    }
  }

  async handleHealthCheck(options) {
    await this.ensureInitialized();

    try {
      console.log(chalk.blue('🏥 Performing health check...'));

      const issues = [];
      const fixes = [];

      // Check storage directories
      const requiredDirs = ['sessions', 'context', 'backups', 'config'];
      for (const dir of requiredDirs) {
        try {
          await fs.access(path.join(this.storageEngine.baseDir, dir));
        } catch (error) {
          issues.push(`Missing directory: ${dir}`);
          if (options.fix) {
            await this.storageEngine.ensureDirectory(dir);
            fixes.push(`Created directory: ${dir}`);
          }
        }
      }

      // Check for active session timeout
      const sessionHealth = this.sessionManager.checkSessionHealth();
      if (!sessionHealth.healthy) {
        issues.push(...sessionHealth.warnings);
      }

      // Check storage integrity
      try {
        const stats = await this.storageEngine.getStorageStats();
        if (stats.sessions === 0 && stats.contexts === 0) {
          issues.push('No data found - system appears empty');
        }
      } catch (error) {
        issues.push(`Storage check failed: ${error.message}`);
      }

      // Report results
      if (issues.length === 0) {
        console.log(chalk.green('✅ System health is good!'));
      } else {
        console.log(chalk.red(`⚠️  Found ${issues.length} issue(s):`));
        issues.forEach(issue => {
          console.log(`   • ${issue}`);
        });

        if (options.fix && fixes.length > 0) {
          console.log(chalk.green(`\n🔧 Applied ${fixes.length} fix(es):`));
          fixes.forEach(fix => {
            console.log(`   ✅ ${fix}`);
          });
        } else if (options.fix) {
          console.log(chalk.yellow('\n💡 Use --fix to attempt automatic repairs'));
        }
      }

    } catch (error) {
      console.error(chalk.red('❌ Health check failed:'), error.message);
      process.exit(1);
    }
  }

  async handleConfig(key, value, options) {
    await this.ensureInitialized();

    try {
      const configPath = path.join(this.storageEngine.baseDir, 'config', 'settings.json');
      const configData = JSON.parse(await fs.readFile(configPath, 'utf8'));

      if (options.show) {
        console.log(chalk.blue('⚙️  Current Configuration:'));
        console.log(JSON.stringify(configData, null, 2));
        return;
      }

      if (options.reset) {
        const defaultConfig = {
          autoSave: { enabled: true, interval: 30000, onFileChange: true, onCommand: true },
          backup: { enabled: true, frequency: 'hourly', maxBackups: 50, compression: true },
          session: { timeout: 1800000, autoResume: true, trackActivity: true },
          context: { maxContextSize: 1000000, compressionThreshold: 100000, retentionDays: 30 }
        };

        await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log(chalk.green('✅ Configuration reset to defaults'));
        return;
      }

      if (!key || !value) {
        console.log(chalk.yellow('⚠️  Please provide both key and value, or use --show to display current config'));
        return;
      }

      // Simple key path resolution (e.g., "autoSave.enabled")
      const keyPath = key.split('.');
      let current = configData;

      for (let i = 0; i < keyPath.length - 1; i++) {
        if (!current[keyPath[i]]) {
          current[keyPath[i]] = {};
        }
        current = current[keyPath[i]];
      }

      // Parse value based on type
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      current[keyPath[keyPath.length - 1]] = parsedValue;

      await fs.writeFile(configPath, JSON.stringify(configData, null, 2));
      console.log(chalk.green(`✅ Configuration updated: ${key} = ${parsedValue}`));

    } catch (error) {
      console.error(chalk.red('❌ Config operation failed:'), error.message);
      process.exit(1);
    }
  }

  /**
   * Utility methods
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error(chalk.red('❌ System not initialized. Run --init first.'));
        process.exit(1);
      }
    }
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Run the CLI program
   */
  async run(argv = process.argv) {
    try {
      await this.program.parseAsync(argv);
    } catch (error) {
      console.error(chalk.red('❌ CLI error:'), error.message);
      process.exit(1);
    }
  }
}

// Export for use as module
module.exports = CLIInterface;

// Run directly if called as script
if (require.main === module) {
  const cli = new CLIInterface();
  cli.run();
}
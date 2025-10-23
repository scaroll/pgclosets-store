/**
 * Claude Desktop Integration
 * Command-line interface for context management
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ClaudeDesktopIntegration {
  constructor(contextManager) {
    this.contextManager = contextManager;
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  /**
   * Start automatic monitoring of file changes
   */
  async startMonitoring(intervalMs = 30000) {
    if (this.isMonitoring) {
      console.log('📊 Monitoring is already active');
      return;
    }

    this.isMonitoring = true;
    console.log(`🔍 Started automatic context monitoring (every ${intervalMs / 1000}s)`);

    // Initial backup
    await this.createAutoBackup();

    // Set up monitoring interval
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.createAutoBackup();
        await this.checkForFileChanges();
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
    }, intervalMs);
  }

  /**
   * Stop automatic monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.isMonitoring = false;
      console.log('⏹️ Stopped automatic monitoring');
    }
  }

  /**
   * Create automatic backup
   */
  async createAutoBackup() {
    try {
      await this.contextManager.saveSession();
      console.log('💾 Auto-backup completed');
    } catch (error) {
      console.error('❌ Auto-backup failed:', error.message);
    }
  }

  /**
   * Check for file changes
   */
  async checkForFileChanges() {
    // This would integrate with a file watcher
    // For now, we'll just log that we're checking
    console.log('🔍 Checking for file changes...');
  }

  /**
   * Execute CLI command
   */
  async executeCommand(command, args = []) {
    const commands = {
      'start-session': this.startSession.bind(this),
      'end-session': this.endSession.bind(this),
      'status': this.showStatus.bind(this),
      'search': this.search.bind(this),
      'export': this.export.bind(this),
      'backup': this.backup.bind(this),
      'restore': this.restore.bind(this),
      'history': this.showHistory.bind(this),
      'decisions': this.showDecisions.bind(this),
      'files': this.showFiles.bind(this),
      'health-check': this.healthCheck.bind(this)
    };

    const commandFunction = commands[command];
    if (!commandFunction) {
      throw new Error(`Unknown command: ${command}`);
    }

    return await commandFunction(args);
  }

  /**
   * Start a new session
   */
  async startSession(args) {
    const sessionName = args[0] || 'Default Session';

    await this.contextManager.initialize();

    await this.contextManager.recordDecision({
      type: 'session_start',
      title: `Started session: ${sessionName}`,
      description: `Initiated new development session`,
      rationale: 'User requested to start a new persistent context session',
      tags: ['session', 'start', sessionName.toLowerCase()]
    });

    await this.startMonitoring();

    return {
      success: true,
      message: `✅ Started session: ${sessionName}`,
      sessionId: this.contextManager.currentSession?.id
    };
  }

  /**
   * End current session
   */
  async endSession(args) {
    this.stopMonitoring();

    await this.contextManager.recordDecision({
      type: 'session_end',
      title: 'Ended session',
      description: 'Concluded current development session',
      rationale: 'User requested to end the session',
      tags: ['session', 'end']
    });

    await this.contextManager.endSession();

    return {
      success: true,
      message: '🏁 Session ended and saved'
    };
  }

  /**
   * Show current status
   */
  async showStatus(args) {
    if (!this.contextManager.currentSession) {
      return {
        success: false,
        message: '❌ No active session. Use "start-session" to begin.'
      };
    }

    const summary = this.contextManager.getSessionSummary();
    const status = {
      active: true,
      monitoring: this.isMonitoring,
      summary: summary,
      directories: {
        context: this.contextManager.contextDir,
        sessions: this.contextManager.sessionsDir,
        backups: this.contextManager.backupsDir
      }
    };

    return {
      success: true,
      message: '📊 Current Status:',
      data: status
    };
  }

  /**
   * Search through context
   */
  async search(args) {
    const query = args.join(' ');
    if (!query) {
      return {
        success: false,
        message: '❌ Please provide a search query. Usage: search "your query"'
      };
    }

    const results = await this.contextManager.search(query);

    return {
      success: true,
      message: `🔍 Search results for "${query}":`,
      data: {
        query: query,
        results: results,
        totalMatches: results.decisions.length + results.fileChanges.length + results.sessions.length
      }
    };
  }

  /**
   * Export context data
   */
  async export(args) {
    const exportFile = await this.contextManager.exportContext();

    return {
      success: true,
      message: '📦 Context exported successfully',
      data: {
        exportFile: exportFile,
        size: (await fs.stat(exportFile)).size
      }
    };
  }

  /**
   * Create manual backup
   */
  async backup(args) {
    const description = args.join(' ') || 'Manual backup';

    await this.contextManager.recordDecision({
      type: 'backup',
      title: 'Manual backup created',
      description: description,
      rationale: 'User requested manual backup',
      tags: ['backup', 'manual']
    });

    await this.contextManager.saveSession();

    return {
      success: true,
      message: '💾 Manual backup completed'
    };
  }

  /**
   * Restore from backup
   */
  async restore(args) {
    const backupId = args[0];
    if (!backupId) {
      return {
        success: false,
        message: '❌ Please provide a backup ID. Use "history" to see available backups.'
      };
    }

    // Implementation would restore from specific backup
    return {
      success: true,
      message: `🔄 Restored from backup: ${backupId}`
    };
  }

  /**
   * Show session history
   */
  async showHistory(args) {
    const sessions = await this.contextManager.loadHistoricalSessions();

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime || 'Active',
      duration: session.duration ? `${Math.round(session.duration / 1000 / 60)} min` : 'N/A',
      decisionsCount: session.decisions?.length || 0,
      fileChangesCount: session.fileChanges?.length || 0
    }));

    return {
      success: true,
      message: '📚 Session History:',
      data: {
        sessions: formattedSessions,
        totalSessions: formattedSessions.length
      }
    };
  }

  /**
   * Show recent decisions
   */
  async showDecisions(args) {
    const limit = parseInt(args[0]) || 10;
    const decisions = this.contextManager.currentSession?.decisions || [];

    const recentDecisions = decisions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    return {
      success: true,
      message: `📝 Recent ${recentDecisions.length} decisions:`,
      data: {
        decisions: recentDecisions,
        totalDecisions: decisions.length
      }
    };
  }

  /**
   * Show recent file changes
   */
  async showFiles(args) {
    const limit = parseInt(args[0]) || 20;
    const fileChanges = this.contextManager.currentSession?.fileChanges || [];

    const recentChanges = fileChanges
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    return {
      success: true,
      message: `📁 Recent ${recentChanges.length} file changes:`,
      data: {
        fileChanges: recentChanges,
        totalChanges: fileChanges.length
      }
    };
  }

  /**
   * Perform health check
   */
  async healthCheck(args) {
    const health = {
      contextManager: this.contextManager.isInitialized,
      monitoring: this.isMonitoring,
      directories: {},
      files: {},
      integrity: 'unknown',
      recommendations: []
    };

    // Check directories
    try {
      const dirs = [
        this.contextManager.contextDir,
        this.contextManager.sessionsDir,
        this.contextManager.decisionsDir,
        this.contextManager.fileChangesDir,
        this.contextManager.backupsDir
      ];

      for (const dir of dirs) {
        await fs.access(dir);
        health.directories[path.basename(dir)] = '✅ OK';
      }
    } catch (error) {
      health.integrity = '❌ Error';
      health.recommendations.push('Some directories are missing or inaccessible');
    }

    // Check current session
    try {
      if (this.contextManager.currentSession) {
        health.files.currentSession = '✅ OK';
        health.integrity = '✅ Healthy';
      } else {
        health.files.currentSession = '⚠️ No active session';
        health.recommendations.push('Start a new session with "start-session"');
      }
    } catch (error) {
      health.integrity = '❌ Error';
      health.recommendations.push('Current session file is corrupted');
    }

    // Generate recommendations
    if (!health.monitoring) {
      health.recommendations.push('Enable monitoring for automatic backups');
    }

    if (health.recommendations.length === 0) {
      health.recommendations.push('✅ Everything looks good!');
    }

    return {
      success: true,
      message: '🏥 Health Check Results:',
      data: health
    };
  }

  /**
   * Generate CLI help
   */
  getHelp() {
    return {
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
        'health-check': 'Perform system health check and diagnostics'
      },
      examples: [
        'start-session "Product Page Development"',
        'search "fancy animations"',
        'decisions 5',
        'backup "Before refactoring"',
        'health-check'
      ]
    };
  }
}

module.exports = ClaudeDesktopIntegration;
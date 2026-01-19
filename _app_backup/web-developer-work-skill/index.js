/**
 * Web Developer Work Skill - Main entry point
 * Persistent context management system for web developers
 */

const StorageEngine = require('./core/StorageEngine');
const ContextManager = require('./core/ContextManager');
const SessionManager = require('./core/SessionManager');
const ErrorRecoverySystem = require('./core/ErrorRecoverySystem');
const ClaudeDesktopIntegration = require('./cli/ClaudeDesktopIntegration');
const CLIInterface = require('./cli/CLIInterface');
const path = require('path');

class WebDeveloperWorkSkill {
  constructor(baseDir = null, config = {}) {
    this.baseDir = baseDir || path.join(process.cwd(), '.claude-work');
    this.config = {
      autoInitialize: true,
      enableErrorRecovery: true,
      enableClaudeIntegration: false,
      ...config
    };

    // Core components
    this.storageEngine = null;
    this.contextManager = null;
    this.sessionManager = null;
    this.errorRecovery = null;
    this.claudeIntegration = null;

    // State
    this.isInitialized = false;
    this.isDestroyed = false;
  }

  /**
   * Initialize the work skill system
   */
  async initialize() {
    if (this.isInitialized) {
      return this.getStatus();
    }

    try {
      console.log('🚀 Initializing Web Developer Work Skill...');

      // Initialize storage engine
      this.storageEngine = new StorageEngine(this.baseDir, this.config.storage);
      await this.storageEngine.initialize();

      // Initialize error recovery first (to catch initialization errors)
      if (this.config.enableErrorRecovery) {
        this.errorRecovery = new ErrorRecoverySystem(this.storageEngine, this.config.errorRecovery);
        // Error recovery sets up its own handlers
      }

      // Initialize context manager
      this.contextManager = new ContextManager(this.storageEngine, this.config.context);
      await this.contextManager.initialize();

      // Initialize session manager
      this.sessionManager = new SessionManager(this.storageEngine, this.config.session);
      await this.sessionManager.autoResumeLastSession();

      // Initialize Claude Desktop integration if enabled
      if (this.config.enableClaudeIntegration) {
        this.claudeIntegration = new ClaudeDesktopIntegration(this);
        await this.claudeIntegration.initialize();
      }

      this.isInitialized = true;

      console.log('✅ Web Developer Work Skill initialized successfully');

      return this.getStatus();

    } catch (error) {
      console.error('❌ Initialization failed:', error.message);

      if (this.errorRecovery) {
        await this.errorRecovery.handleRecoverableError('initialization', error, {
          component: 'WebDeveloperWorkSkill',
          baseDir: this.baseDir
        });
      }

      throw error;
    }
  }

  /**
   * Start a new work session
   */
  async startSession(name, options = {}) {
    await this.ensureInitialized();

    try {
      const session = await this.sessionManager.createSession(name, options);

      // Track session start in error recovery
      if (this.errorRecovery) {
        this.errorRecovery.trackActivity('session_start', { sessionId: session.id });
      }

      return session;
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('sessionStart', error, { name, options });
        if (recovered) {
          return await this.startSession(name, options);
        }
      }
      throw error;
    }
  }

  /**
   * End current session
   */
  async endSession(reason = 'manual') {
    await this.ensureInitialized();

    try {
      const session = await this.sessionManager.endSession(reason);

      if (this.errorRecovery) {
        this.errorRecovery.trackActivity('session_end', { sessionId: session.id, reason });
      }

      return session;
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('sessionEnd', error, { reason });
        if (recovered) {
          return await this.endSession(reason);
        }
      }
      throw error;
    }
  }

  /**
   * Save current context
   */
  async saveContext(trigger = 'manual') {
    await this.ensureInitialized();

    try {
      const context = await this.contextManager.saveContext(trigger);

      if (this.errorRecovery) {
        this.errorRecovery.trackActivity('context_save', { trigger, contextId: context?.id });
      }

      return context;
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('contextSave', error, { trigger });
        if (recovered) {
          return await this.saveContext(trigger);
        }
      }
      throw error;
    }
  }

  /**
   * Update context with new information
   */
  async updateContext(updates) {
    await this.ensureInitialized();

    try {
      const context = await this.contextManager.updateContext(updates);

      if (this.errorRecovery) {
        this.errorRecovery.trackActivity('context_update', { updateTypes: Object.keys(updates) });
      }

      return context;
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('contextUpdate', error, { updates });
        if (recovered) {
          return await this.updateContext(updates);
        }
      }
      throw error;
    }
  }

  /**
   * Search through work history
   */
  async searchHistory(query, options = {}) {
    await this.ensureInitialized();

    try {
      return await this.storageEngine.searchHistory(query, options);
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('searchHistory', error, { query, options });
        if (recovered) {
          return await this.searchHistory(query, options);
        }
      }
      throw error;
    }
  }

  /**
   * Get session history
   */
  async getSessionHistory(options = {}) {
    await this.ensureInitialized();

    try {
      return await this.sessionManager.getSessionHistory(options);
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('sessionHistory', error, { options });
        if (recovered) {
          return await this.getSessionHistory(options);
        }
      }
      throw error;
    }
  }

  /**
   * Create backup
   */
  async createBackup(type = 'manual', description = '') {
    await this.ensureInitialized();

    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        session: this.sessionManager.activeSession,
        context: this.contextManager.currentContext,
        status: this.getStatus()
      };

      return await this.storageEngine.createBackup(backupData, type, description);
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('backup', error, { type, description });
        if (recovered) {
          return await this.createBackup(type, description);
        }
      }
      throw error;
    }
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupId, type = 'manual') {
    await this.ensureInitialized();

    try {
      const backup = await this.storageEngine.restoreBackup(backupId, type);

      if (backup.data.session) {
        await this.sessionManager.createSession(
          backup.data.session.name + ' (restored)',
          {
            ...backup.data.session.metadata,
            restoredFrom: backupId
          }
        );
      }

      if (backup.data.context) {
        await this.contextManager.updateContext(backup.data.context);
      }

      return backup;
    } catch (error) {
      if (this.errorRecovery) {
        const recovered = await this.errorRecovery.handleRecoverableError('restore', error, { backupId, type });
        if (recovered) {
          return await this.restoreBackup(backupId, type);
        }
      }
      throw error;
    }
  }

  /**
   * Get system status
   */
  async getStatus() {
    const status = {
      initialized: this.isInitialized,
      destroyed: this.isDestroyed,
      baseDir: this.baseDir,
      components: {}
    };

    if (this.contextManager) {
      status.components.contextManager = this.contextManager.getStatus();
    }

    if (this.sessionManager) {
      status.components.sessionManager = this.sessionManager.getStatus();
    }

    if (this.claudeIntegration) {
      status.components.claudeIntegration = this.claudeIntegration.getStatus();
    }

    if (this.storageEngine) {
      status.components.storage = await this.storageEngine.getStorageStats();
    }

    if (this.errorRecovery) {
      status.components.errorRecovery = this.errorRecovery.getStatus();
    }

    return status;
  }

  /**
   * Perform health check
   */
  async performHealthCheck() {
    if (this.errorRecovery) {
      return await this.errorRecovery.performHealthCheck();
    }

    return {
      status: 'unknown',
      message: 'Error recovery system not enabled'
    };
  }

  /**
   * Get CLI interface instance
   */
  getCLI() {
    return new CLIInterface();
  }

  /**
   * Ensure system is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      if (this.config.autoInitialize) {
        await this.initialize();
      } else {
        throw new Error('Web Developer Work Skill not initialized. Call initialize() first.');
      }
    }

    if (this.isDestroyed) {
      throw new Error('Web Developer Work Skill has been destroyed.');
    }
  }

  /**
   * Destroy the work skill system
   */
  async destroy() {
    if (this.isDestroyed) {
      return;
    }

    console.log('🛑 Shutting down Web Developer Work Skill...');

    try {
      // End active session
      if (this.sessionManager && this.sessionManager.activeSession) {
        await this.sessionManager.endSession('shutdown');
      }

      // Destroy components in reverse order
      if (this.claudeIntegration) {
        await this.claudeIntegration.destroy();
      }

      if (this.contextManager) {
        await this.contextManager.destroy();
      }

      if (this.sessionManager) {
        await this.sessionManager.destroy();
      }

      if (this.errorRecovery) {
        await this.errorRecovery.destroy();
      }

      this.isDestroyed = true;
      console.log('✅ Web Developer Work Skill shut down successfully');

    } catch (error) {
      console.error('❌ Error during shutdown:', error.message);
    }
  }
}

// Export main class and components
module.exports = WebDeveloperWorkSkill;
module.exports.StorageEngine = StorageEngine;
module.exports.ContextManager = ContextManager;
module.exports.SessionManager = SessionManager;
module.exports.ErrorRecoverySystem = ErrorRecoverySystem;
module.exports.ClaudeDesktopIntegration = ClaudeDesktopIntegration;
module.exports.CLIInterface = CLIInterface;

// Export convenience function for quick setup
module.exports.create = async (baseDir, config) => {
  const skill = new WebDeveloperWorkSkill(baseDir, config);
  await skill.initialize();
  return skill;
};

// If run directly, start CLI interface
if (require.main === module) {
  const cli = new CLIInterface();
  cli.run();
}
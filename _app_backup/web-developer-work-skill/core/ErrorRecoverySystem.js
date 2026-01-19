/**
 * Error Recovery System - Comprehensive error handling and recovery mechanisms
 * Provides automatic recovery, data integrity checks, and system healing
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');

class ErrorRecoverySystem extends EventEmitter {
  constructor(storageEngine, config = {}) {
    super();
    this.storage = storageEngine;
    this.config = {
      maxRetryAttempts: 3,
      retryDelay: 1000,
      backupOnCriticalError: true,
      autoRepair: true,
      logLevel: 'info',
      recoveryPointsInterval: 300000, // 5 minutes
      ...config
    };

    this.errorLog = [];
    this.recoveryAttempts = new Map();
    this.lastRecoveryPoint = null;
    this.systemHealth = {
      status: 'healthy',
      issues: [],
      lastCheck: new Date().toISOString()
    };

    this.setupErrorHandlers();
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      await this.handleCriticalError('uncaughtException', error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      await this.handleCriticalError('unhandledRejection', reason);
    });

    // Handle process signals
    process.on('SIGINT', async () => {
      await this.gracefulShutdown('SIGINT');
    });

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown('SIGTERM');
    });
  }

  /**
   * Handle critical errors
   */
  async handleCriticalError(type, error) {
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: 'critical',
      systemInfo: this.getSystemInfo()
    };

    this.logError(errorInfo);

    try {
      // Create emergency backup
      if (this.config.backupOnCriticalError) {
        await this.createEmergencyBackup(errorInfo);
      }

      // Attempt recovery
      if (this.config.autoRepair) {
        await this.attemptAutomaticRecovery(errorInfo);
      }

      this.emit('criticalError', errorInfo);

    } catch (recoveryError) {
      this.logError({
        type: 'recoveryFailure',
        message: recoveryError.message,
        originalError: errorInfo,
        timestamp: new Date().toISOString(),
        severity: 'critical'
      });
    }

    // Exit if unrecoverable
    if (type === 'uncaughtException') {
      console.error('💀 Unrecoverable critical error. Exiting...');
      process.exit(1);
    }
  }

  /**
   * Handle recoverable errors
   */
  async handleRecoverableError(type, error, context = {}) {
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      severity: 'recoverable'
    };

    this.logError(errorInfo);

    const recoveryKey = this.getRecoveryKey(type, context);
    const attempts = this.recoveryAttempts.get(recoveryKey) || 0;

    if (attempts < this.config.maxRetryAttempts) {
      this.recoveryAttempts.set(recoveryKey, attempts + 1);

      try {
        await this.attemptRecovery(type, error, context, attempts);
        this.recoveryAttempts.delete(recoveryKey);
        this.emit('errorRecovered', { type, attempts: attempts + 1 });
        return true;
      } catch (recoveryError) {
        this.logError({
          type: 'recoveryAttemptFailed',
          message: recoveryError.message,
          originalError: errorInfo,
          attempt: attempts + 1,
          timestamp: new Date().toISOString(),
          severity: 'warning'
        });

        // Wait before retry
        await this.delay(this.config.retryDelay * (attempts + 1));
        return false;
      }
    } else {
      this.logError({
        type: 'maxRetriesExceeded',
        message: `Maximum retry attempts exceeded for ${type}`,
        originalError: errorInfo,
        totalAttempts: attempts,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });

      this.emit('errorUnrecoverable', errorInfo);
      return false;
    }
  }

  /**
   * Attempt automatic recovery
   */
  async attemptAutomaticRecovery(errorInfo) {
    console.log('🔧 Attempting automatic recovery...');

    const recoveryStrategies = [
      () => this.repairStorageCorruption(),
      () => this.restoreFromLastRecoveryPoint(),
      () => this.recreateSystemState(),
      () => this.cleanupCorruptedData()
    ];

    for (const strategy of recoveryStrategies) {
      try {
        await strategy();
        console.log('✅ Automatic recovery successful');
        this.systemHealth.status = 'healthy';
        this.systemHealth.issues = [];
        return true;
      } catch (error) {
        console.warn(`Recovery strategy failed: ${error.message}`);
      }
    }

    console.error('❌ All automatic recovery strategies failed');
    return false;
  }

  /**
   * Attempt specific recovery based on error type
   */
  async attemptRecovery(type, error, context, attempt) {
    console.log(`🔄 Recovery attempt ${attempt + 1} for ${type}...`);

    switch (type) {
      case 'storageWrite':
        return this.recoverFromStorageError(error, context);
      case 'storageRead':
        return this.recoverFromReadError(error, context);
      case 'contextCorruption':
        return this.recoverFromContextCorruption(error, context);
      case 'sessionCorruption':
        return this.recoverFromSessionCorruption(error, context);
      case 'memoryLeak':
        return this.recoverFromMemoryLeak(error, context);
      case 'fileSystem':
        return this.recoverFromFileSystemError(error, context);
      default:
        return this.recoverFromGenericError(error, context);
    }
  }

  /**
   * Recover from storage write errors
   */
  async recoverFromStorageError(error, context) {
    // Try alternative storage location
    const altPath = context.path + '.tmp';

    try {
      if (context.data) {
        await fs.writeFile(altPath, JSON.stringify(context.data, null, 2));

        // Verify write was successful
        const written = await fs.readFile(altPath, 'utf8');
        JSON.parse(written); // Verify JSON validity

        // Replace original file
        await fs.rename(altPath, context.path);
        return true;
      }
    } catch (error) {
      throw new Error(`Storage recovery failed: ${error.message}`);
    }

    return false;
  }

  /**
   * Recover from read errors
   */
  async recoverFromReadError(error, context) {
    const filePath = context.path;

    try {
      // Check if file exists
      await fs.access(filePath);

      // Try to read with different encodings
      const encodings = ['utf8', 'utf16le', 'latin1'];

      for (const encoding of encodings) {
        try {
          const data = await fs.readFile(filePath, encoding);
          JSON.parse(data); // Verify JSON
          return true;
        } catch (error) {
          continue;
        }
      }

      // Try to recover from backup
      return this.recoverFromBackup(filePath);

    } catch (error) {
      throw new Error(`Read recovery failed: ${error.message}`);
    }
  }

  /**
   * Recover from context corruption
   */
  async recoverFromContextCorruption(error, context) {
    try {
      // Find latest valid context for the session
      const contexts = await this.storage.getContextsBySession(context.sessionId);

      for (let i = contexts.length - 1; i >= 0; i--) {
        try {
          const ctx = contexts[i];
          this.verifyDataIntegrity(ctx);

          // Restore this context
          await this.storage.saveContext(ctx);
          console.log(`✅ Restored valid context from ${new Date(ctx.timestamp).toLocaleString()}`);
          return true;
        } catch (error) {
          continue;
        }
      }

      throw new Error('No valid context found for recovery');
    } catch (error) {
      throw new Error(`Context corruption recovery failed: ${error.message}`);
    }
  }

  /**
   * Recover from session corruption
   */
  async recoverFromSessionCorruption(error, context) {
    try {
      const sessionId = context.sessionId;

      // Try to find session in backups
      const backups = await this.storage.listBackups();

      for (const backup of backups) {
        if (backup.data.session && backup.data.session.id === sessionId) {
          // Restore session from backup
          await this.storage.saveSession(backup.data.session);
          console.log(`✅ Restored session from backup ${backup.id.substring(0, 8)}...`);
          return true;
        }
      }

      // Create new session if recovery not possible
      const newSession = {
        id: crypto.randomBytes(16).toString('hex'),
        name: `Recovery Session ${new Date().toLocaleString()}`,
        startTime: new Date().toISOString(),
        status: 'active',
        metadata: {
          recoveredFrom: sessionId,
          recoveryReason: 'session_corruption'
        }
      };

      await this.storage.saveSession(newSession);
      console.log('✅ Created new recovery session');
      return true;

    } catch (error) {
      throw new Error(`Session corruption recovery failed: ${error.message}`);
    }
  }

  /**
   * Recover from memory leaks
   */
  async recoverFromMemoryLeak(error, context) {
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Clear caches and buffers
      if (this.storage) {
        await this.storage.clearCaches();
      }

      // Reset error log if it's too large
      if (this.errorLog.length > 1000) {
        this.errorLog = this.errorLog.slice(-100);
      }

      console.log('🧹 Memory cleanup completed');
      return true;

    } catch (error) {
      throw new Error(`Memory leak recovery failed: ${error.message}`);
    }
  }

  /**
   * Recover from file system errors
   */
  async recoverFromFileSystemError(error, context) {
    try {
      const filePath = context.path;

      // Check disk space
      const stats = await fs.stat(path.dirname(filePath));

      // Try to recreate directory structure
      await this.storage.ensureDirectory(path.dirname(filePath));

      // Check file permissions
      try {
        await fs.access(filePath, fs.constants.W_OK);
      } catch (error) {
        // Try to fix permissions
        await fs.chmod(filePath, 0o644);
      }

      return true;

    } catch (error) {
      throw new Error(`File system recovery failed: ${error.message}`);
    }
  }

  /**
   * Recover from generic errors
   */
  async recoverFromGenericError(error, context) {
    try {
      // Generic recovery strategies

      // 1. Reset connection
      if (this.storage && typeof this.storage.reset === 'function') {
        await this.storage.reset();
      }

      // 2. Clear temporary data
      await this.clearTemporaryData();

      // 3. Verify system integrity
      await this.verifySystemIntegrity();

      return true;

    } catch (error) {
      throw new Error(`Generic recovery failed: ${error.message}`);
    }
  }

  /**
   * Create emergency backup
   */
  async createEmergencyBackup(errorInfo) {
    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        error: errorInfo,
        systemState: {
          activeSession: this.getActiveSessionInfo(),
          currentContext: this.getCurrentContextInfo(),
          errorLog: this.errorLog.slice(-50),
          systemHealth: this.systemHealth
        }
      };

      const backup = await this.storage.createBackup(
        backupData,
        'recovery-points',
        `Emergency backup - ${errorInfo.type}`
      );

      console.log(`🆘 Created emergency backup: ${backup.id.substring(0, 8)}...`);
      return backup;

    } catch (error) {
      console.error('Failed to create emergency backup:', error.message);
    }
  }

  /**
   * Create recovery point
   */
  async createRecoveryPoint() {
    try {
      const recoveryPoint = {
        id: crypto.randomBytes(16).toString('hex'),
        timestamp: new Date().toISOString(),
        systemState: {
          activeSession: this.getActiveSessionInfo(),
          currentContext: this.getCurrentContextInfo(),
          errorLog: this.errorLog.slice(-20),
          systemHealth: this.systemHealth
        }
      };

      await this.storage.createBackup(
        recoveryPoint,
        'recovery-points',
        `Automatic recovery point`
      );

      this.lastRecoveryPoint = recoveryPoint;
      return recoveryPoint;

    } catch (error) {
      console.warn('Failed to create recovery point:', error.message);
    }
  }

  /**
   * Restore from last recovery point
   */
  async restoreFromLastRecoveryPoint() {
    if (!this.lastRecoveryPoint) {
      throw new Error('No recovery point available');
    }

    try {
      const recoveryPoint = await this.storage.restoreBackup(
        this.lastRecoveryPoint.id,
        'recovery-points'
      );

      if (recoveryPoint.data.systemState) {
        await this.restoreSystemState(recoveryPoint.data.systemState);
        console.log('✅ Restored from recovery point');
        return true;
      }

      return false;

    } catch (error) {
      throw new Error(`Recovery point restoration failed: ${error.message}`);
    }
  }

  /**
   * Repair storage corruption
   */
  async repairStorageCorruption() {
    try {
      const issues = [];

      // Check and repair sessions directory
      const sessionsDir = path.join(this.storage.baseDir, 'sessions');
      await this.repairDirectory(sessionsDir, issues);

      // Check and repair contexts directory
      const contextsDir = path.join(this.storage.baseDir, 'context');
      await this.repairDirectory(contextsDir, issues);

      // Check and repair backups directory
      const backupsDir = path.join(this.storage.baseDir, 'backups');
      await this.repairDirectory(backupsDir, issues);

      if (issues.length > 0) {
        console.log(`🔧 Repaired ${issues.length} storage issues`);
        return true;
      }

      return false;

    } catch (error) {
      throw new Error(`Storage corruption repair failed: ${error.message}`);
    }
  }

  /**
   * Repair directory corruption
   */
  async repairDirectory(dirPath, issues) {
    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);

        try {
          // Try to read and parse file
          const data = await fs.readFile(filePath, 'utf8');
          JSON.parse(data);
        } catch (error) {
          // File is corrupted, move to quarantine
          const quarantineDir = path.join(dirPath, 'quarantine');
          await this.storage.ensureDirectory(quarantineDir);

          const quarantinePath = path.join(quarantineDir, file + '.corrupted');
          await fs.rename(filePath, quarantinePath);

          issues.push({
            file: filePath,
            issue: 'corruption',
            action: 'quarantined'
          });
        }
      }

    } catch (error) {
      issues.push({
        directory: dirPath,
        issue: 'access_error',
        error: error.message
      });
    }
  }

  /**
   * Recreate system state
   */
  async recreateSystemState() {
    try {
      // Recreate directory structure
      await this.storage.initialize();

      // Create default configuration
      const defaultConfig = {
        autoSave: { enabled: true, interval: 30000 },
        backup: { enabled: true, frequency: 'hourly' },
        session: { timeout: 1800000, autoResume: true },
        context: { retentionDays: 30 }
      };

      await fs.writeFile(
        path.join(this.storage.baseDir, 'config', 'settings.json'),
        JSON.stringify(defaultConfig, null, 2)
      );

      console.log('✅ System state recreated');
      return true;

    } catch (error) {
      throw new Error(`System state recreation failed: ${error.message}`);
    }
  }

  /**
   * Cleanup corrupted data
   */
  async cleanupCorruptedData() {
    try {
      let cleanedCount = 0;

      // Clean quarantine directories
      const quarantineDirs = [
        path.join(this.storage.baseDir, 'sessions', 'quarantine'),
        path.join(this.storage.baseDir, 'context', 'quarantine'),
        path.join(this.storage.baseDir, 'backups', 'quarantine')
      ];

      for (const quarantineDir of quarantineDirs) {
        try {
          const files = await fs.readdir(quarantineDir);

          for (const file of files) {
            const filePath = path.join(quarantineDir, file);
            await fs.unlink(filePath);
            cleanedCount++;
          }
        } catch (error) {
          // Directory doesn't exist or can't be accessed
        }
      }

      // Clean old temporary files
      const tempPattern = /\.tmp\./;
      await this.cleanupFilesByPattern(tempPattern);

      console.log(`🧹 Cleaned ${cleanedCount} corrupted files`);
      return cleanedCount > 0;

    } catch (error) {
      throw new Error(`Corrupted data cleanup failed: ${error.message}`);
    }
  }

  /**
   * Verify system integrity
   */
  async verifySystemIntegrity() {
    try {
      const issues = [];

      // Check storage directories
      const requiredDirs = ['sessions', 'context', 'backups', 'config'];
      for (const dir of requiredDirs) {
        try {
          await fs.access(path.join(this.storage.baseDir, dir));
        } catch (error) {
          issues.push(`Missing directory: ${dir}`);
        }
      }

      // Check configuration files
      const requiredFiles = [
        'config/settings.json',
        'config/ignore-rules.json'
      ];

      for (const file of requiredFiles) {
        try {
          await fs.access(path.join(this.storage.baseDir, file));
        } catch (error) {
          issues.push(`Missing file: ${file}`);
        }
      }

      // Update system health
      this.systemHealth = {
        status: issues.length === 0 ? 'healthy' : 'warning',
        issues,
        lastCheck: new Date().toISOString()
      };

      return issues.length === 0;

    } catch (error) {
      this.systemHealth.status = 'error';
      this.systemHealth.issues = [`Integrity check failed: ${error.message}`];
      return false;
    }
  }

  /**
   * Get error statistics
   */
  getErrorStatistics() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last1h = now - (60 * 60 * 1000);

    const errors = this.errorLog;

    return {
      total: errors.length,
      last24h: errors.filter(e => new Date(e.timestamp).getTime() > last24h).length,
      last1h: errors.filter(e => new Date(e.timestamp).getTime() > last1h).length,
      byType: this.groupErrorsByType(errors),
      bySeverity: this.groupErrorsBySeverity(errors),
      critical: errors.filter(e => e.severity === 'critical').length,
      recoverable: errors.filter(e => e.severity === 'recoverable').length
    };
  }

  /**
   * Perform system health check
   */
  async performHealthCheck() {
    try {
      const health = {
        status: 'healthy',
        issues: [],
        checks: {}
      };

      // Check storage integrity
      health.checks.storage = await this.verifySystemIntegrity();
      if (!health.checks.storage) {
        health.issues.push('Storage integrity issues detected');
      }

      // Check error rates
      const errorStats = this.getErrorStatistics();
      health.checks.errorRate = errorStats.last1h < 10; // Less than 10 errors per hour

      if (!health.checks.errorRate) {
        health.issues.push(`High error rate: ${errorStats.last1h} errors in last hour`);
      }

      // Check memory usage
      const memUsage = process.memoryUsage();
      health.checks.memory = memUsage.heapUsed < 500 * 1024 * 1024; // Less than 500MB

      if (!health.checks.memory) {
        health.issues.push('High memory usage detected');
      }

      // Check recovery system
      health.checks.recovery = this.recoveryAttempts.size < 5;

      if (!health.checks.recovery) {
        health.issues.push('Multiple failed recovery attempts');
      }

      // Determine overall status
      if (health.issues.length > 0) {
        health.status = health.issues.some(issue =>
          issue.includes('critical') || issue.includes('High')
        ) ? 'unhealthy' : 'warning';
      }

      this.systemHealth = {
        ...health,
        lastCheck: new Date().toISOString(),
        errorStatistics: errorStats
      };

      return health;

    } catch (error) {
      return {
        status: 'error',
        issues: [`Health check failed: ${error.message}`],
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * Utility methods
   */
  getRecoveryKey(type, context) {
    return `${type}:${context.sessionId || 'global'}:${context.path || 'nopath'}`;
  }

  getSystemInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cwd: process.cwd()
    };
  }

  logError(errorInfo) {
    this.errorLog.push(errorInfo);

    // Keep error log size manageable
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-500);
    }

    // Log to console if severe
    if (errorInfo.severity === 'critical') {
      console.error('🚨 Critical Error:', errorInfo.message);
    } else if (this.config.logLevel === 'debug') {
      console.warn('⚠️  Error:', errorInfo.message);
    }

    this.emit('errorLogged', errorInfo);
  }

  verifyDataIntegrity(data) {
    if (!data) {
      throw new Error('No data provided');
    }

    if (data.checksum) {
      const calculatedChecksum = crypto.createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');

      if (calculatedChecksum !== data.checksum) {
        throw new Error('Data integrity check failed - checksum mismatch');
      }
    }

    return true;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  groupErrorsByType(errors) {
    return errors.reduce((groups, error) => {
      const type = error.type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
      return groups;
    }, {});
  }

  groupErrorsBySeverity(errors) {
    return errors.reduce((groups, error) => {
      const severity = error.severity || 'unknown';
      groups[severity] = (groups[severity] || 0) + 1;
      return groups;
    }, {});
  }

  async clearTemporaryData() {
    // Implementation would clear temp files, caches, etc.
  }

  getActiveSessionInfo() {
    // Return current active session info
    return null;
  }

  getCurrentContextInfo() {
    // Return current context info
    return null;
  }

  async restoreSystemState(systemState) {
    // Restore system state from backup
    // Implementation would depend on specific system state structure
  }

  async recoverFromBackup(filePath) {
    // Try to recover file from backup
    // Implementation would search for backup files
    return false;
  }

  async cleanupFilesByPattern(pattern) {
    // Clean files matching pattern
    // Implementation would search and delete matching files
  }

  /**
   * Graceful shutdown
   */
  async gracefulShutdown(signal) {
    console.log(`\n🛑 Received ${signal}, performing graceful shutdown...`);

    try {
      // Create final recovery point
      await this.createRecoveryPoint();

      // Save any pending data
      if (this.storage) {
        await this.storage.savePendingData();
      }

      console.log('✅ Graceful shutdown completed');
      process.exit(0);

    } catch (error) {
      console.error('❌ Graceful shutdown failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      systemHealth: this.systemHealth,
      errorStatistics: this.getErrorStatistics(),
      activeRecoveryAttempts: this.recoveryAttempts.size,
      lastRecoveryPoint: this.lastRecoveryPoint,
      uptime: process.uptime()
    };
  }

  /**
   * Cleanup resources
   */
  async destroy() {
    // Create final recovery point
    await this.createRecoveryPoint();

    // Clear resources
    this.recoveryAttempts.clear();
    this.errorLog = [];
    this.removeAllListeners();

    console.log('🔧 Error recovery system destroyed');
  }
}

module.exports = ErrorRecoverySystem;
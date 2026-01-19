/**
 * Claude Desktop Integration - Seamless integration with Claude Desktop CLI
 * Provides hooks, commands, and context persistence for Claude Desktop
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const EventEmitter = require('events');

class ClaudeDesktopIntegration extends EventEmitter {
  constructor(workSkillInstance) {
    super();
    this.workSkill = workSkillInstance;
    this.claudeConfigPath = null;
    this.hooksConfigured = false;
    this.monitoringProcess = null;
    this.lastCommand = null;
    this.commandHistory = [];
  }

  /**
   * Initialize Claude Desktop integration
   */
  async initialize() {
    try {
      await this.detectClaudeConfig();
      await this.setupHooks();
      await this.configureCLIIntegration();
      this.startMonitoring();

      this.emit('initialized');
      return true;
    } catch (error) {
      this.emit('error', error);
      throw new Error(`Claude Desktop integration failed: ${error.message}`);
    }
  }

  /**
   * Detect Claude Desktop configuration
   */
  async detectClaudeConfig() {
    const possiblePaths = [
      path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'config.json'),
      path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'claude', 'config.json'),
      path.join(process.cwd(), '.claude', 'config.json')
    ];

    for (const configPath of possiblePaths) {
      try {
        await fs.access(configPath);
        this.claudeConfigPath = configPath;

        // Load and validate config
        const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
        this.claudeConfig = config;

        console.log(`✅ Found Claude Desktop config at: ${configPath}`);
        return configPath;
      } catch (error) {
        // Continue to next path
      }
    }

    throw new Error('Claude Desktop configuration not found. Please ensure Claude Desktop CLI is installed and configured.');
  }

  /**
   * Setup integration hooks
   */
  async setupHooks() {
    try {
      if (!this.claudeConfigPath) {
        throw new Error('Claude config path not detected');
      }

      // Create skills directory if it doesn't exist
      const skillsDir = path.join(path.dirname(this.claudeConfigPath), 'skills');
      await fs.mkdir(skillsDir, { recursive: true });

      // Copy skill to Claude skills directory
      const skillSourceDir = path.join(__dirname, '..');
      const skillTargetDir = path.join(skillsDir, 'web-developer-work-skill');

      try {
        await fs.access(skillTargetDir);
        // Skill exists, check if it needs updating
        await this.updateSkillInPlace(skillSourceDir, skillTargetDir);
      } catch (error) {
        // Skill doesn't exist, copy it
        await this.copySkill(skillSourceDir, skillTargetDir);
      }

      // Configure Claude to use the skill
      await this.configureClaudeSkills();

      this.hooksConfigured = true;
      console.log('✅ Claude Desktop hooks configured successfully');

    } catch (error) {
      throw new Error(`Failed to setup hooks: ${error.message}`);
    }
  }

  /**
   * Configure CLI integration
   */
  async configureCLIIntegration() {
    try {
      // Create wrapper scripts for common Claude commands
      const scriptsDir = path.join(__dirname, '..', 'scripts');
      await fs.mkdir(scriptsDir, { recursive: true });

      // Create claude-work wrapper script
      const wrapperScript = this.generateWrapperScript();
      await fs.writeFile(path.join(scriptsDir, 'claude-work'), wrapperScript);
      await fs.chmod(path.join(scriptsDir, 'claude-work'), '755');

      // Create shell completion
      const completionScript = this.generateCompletionScript();
      await fs.writeFile(path.join(scriptsDir, 'completion.sh'), completionScript);

      console.log('✅ CLI integration configured');

    } catch (error) {
      throw new Error(`Failed to configure CLI integration: ${error.message}`);
    }
  }

  /**
   * Start monitoring Claude Desktop activity
   */
  startMonitoring() {
    if (this.monitoringProcess) {
      return;
    }

    // Monitor file changes in working directory
    const chokidar = require('chokidar');

    const watcher = chokidar.watch(process.cwd(), {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.claude-work/**'
      ],
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      await this.handleFileChange(filePath);
    });

    watcher.on('add', async (filePath) => {
      await this.handleFileAdd(filePath);
    });

    // Monitor command execution
    this.setupCommandMonitoring();

    console.log('📡 Started monitoring Claude Desktop activity');
  }

  /**
   * Setup command monitoring
   */
  setupCommandMonitoring() {
    // Override process methods to capture command execution
    const originalSpawn = process.spawn;

    process.spawn = (command, args, options) => {
      this.trackCommand(command, args, options);
      return originalSpawn.call(process, command, args, options);
    };

    // Monitor stdin for Claude commands
    if (process.stdin.isTTY) {
      process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        if (input.startsWith('claude')) {
          this.trackClaudeCommand(input);
        }
      });
    }
  }

  /**
   * Track command execution
   */
  async trackCommand(command, args, options) {
    const commandInfo = {
      command,
      args,
      options,
      timestamp: new Date().toISOString(),
      cwd: process.cwd()
    };

    this.lastCommand = commandInfo;
    this.commandHistory.push(commandInfo);

    // Keep history limited
    if (this.commandHistory.length > 100) {
      this.commandHistory = this.commandHistory.slice(-50);
    }

    // Update work skill context
    if (this.workSkill?.contextManager) {
      await this.workSkill.contextManager.updateContext({
        commands: [commandInfo]
      });
    }

    this.emit('command', commandInfo);
  }

  /**
   * Track Claude-specific commands
   */
  async trackClaudeCommand(commandLine) {
    const parts = commandLine.split(' ');
    const command = parts[1]; // Skip 'claude'
    const args = parts.slice(2);

    const claudeCommand = {
      type: 'claude',
      command,
      args,
      fullCommand: commandLine,
      timestamp: new Date().toISOString()
    };

    // Special handling for different Claude commands
    switch (command) {
      case 'skill':
        await this.handleSkillCommand(args);
        break;
      case 'ask':
        await this.handleAskCommand(args);
        break;
      case 'code':
        await this.handleCodeCommand(args);
        break;
      case 'build':
        await this.handleBuildCommand(args);
        break;
      default:
        await this.handleGenericClaudeCommand(claudeCommand);
    }

    this.emit('claudeCommand', claudeCommand);
  }

  /**
   * Handle file changes
   */
  async handleFileChange(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const fileChange = {
        path: filePath,
        type: 'change',
        timestamp: new Date().toISOString(),
        size: stats.size,
        modified: stats.mtime
      };

      // Update work skill context
      if (this.workSkill?.contextManager) {
        await this.workSkill.contextManager.updateContext({
          files: [fileChange]
        });
      }

      this.emit('fileChange', fileChange);

    } catch (error) {
      console.warn(`Failed to handle file change for ${filePath}:`, error.message);
    }
  }

  /**
   * Handle file additions
   */
  async handleFileAdd(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const fileAdd = {
        path: filePath,
        type: 'add',
        timestamp: new Date().toISOString(),
        size: stats.size,
        created: stats.birthtime
      };

      // Update work skill context
      if (this.workSkill?.contextManager) {
        await this.workSkill.contextManager.updateContext({
          files: [fileAdd]
        });
      }

      this.emit('fileAdd', fileAdd);

    } catch (error) {
      console.warn(`Failed to handle file add for ${filePath}:`, error.message);
    }
  }

  /**
   * Handle skill commands
   */
  async handleSkillCommand(args) {
    const skillName = args[0];
    const skillArgs = args.slice(1);

    if (skillName === 'web-developer-work-skill') {
      // Route to our CLI interface
      const CLIInterface = require('./CLIInterface');
      const cli = new CLIInterface();

      try {
        await cli.initialize();
        await cli.run(['node', 'cli', ...skillArgs]);
      } catch (error) {
        console.error('Skill command failed:', error.message);
      }
    }

    this.emit('skillCommand', { skillName, args: skillArgs });
  }

  /**
   * Handle ask commands
   */
  async handleAskCommand(args) {
    const question = args.join(' ');

    // Add question to context
    if (this.workSkill?.contextManager) {
      await this.workSkill.contextManager.updateContext({
        notes: [{
          type: 'question',
          content: question,
          timestamp: new Date().toISOString()
        }]
      });
    }

    this.emit('askCommand', { question });
  }

  /**
   * Handle code commands
   */
  async handleCodeCommand(args) {
    const codeAction = args[0];
    const codeArgs = args.slice(1);

    // Track code-related activities
    if (this.workSkill?.sessionManager) {
      await this.workSkill.sessionManager.trackActivity('code_command', {
        action: codeAction,
        args: codeArgs
      });
    }

    this.emit('codeCommand', { action: codeAction, args: codeArgs });
  }

  /**
   * Handle build commands
   */
  async handleBuildCommand(args) {
    const buildType = args[0] || 'default';

    // Create checkpoint before build
    if (this.workSkill?.sessionManager) {
      await this.workSkill.sessionManager.createCheckpoint('pre_build', {
        type: buildType,
        args: args
      });
    }

    this.emit('buildCommand', { type: buildType, args });
  }

  /**
   * Handle generic Claude commands
   */
  async handleGenericClaudeCommand(command) {
    // Track generic command activity
    if (this.workSkill?.sessionManager) {
      await this.workSkill.sessionManager.trackActivity('claude_command', command);
    }

    this.emit('genericCommand', command);
  }

  /**
   * Generate wrapper script
   */
  generateWrapperScript() {
    return `#!/bin/bash
# Claude Work Wrapper Script
# Integrates web-developer-work-skill with Claude Desktop

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_SKILL_DIR="$SCRIPT_DIR/.."

# Function to show usage
show_usage() {
    echo "Claude Work - Persistent Context Management"
    echo ""
    echo "Usage: claude-work <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start [name]     Start a new work session"
    echo "  end              End current session"
    echo "  status           Show current status"
    echo "  history          Show session history"
    echo "  search <query>   Search through work history"
    echo "  backup           Create a backup"
    echo "  restore <id>     Restore from backup"
    echo "  init             Initialize in current directory"
    echo ""
    echo "For more help, run: claude-work --help"
}

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed"
    exit 1
fi

# Route commands to the CLI interface
node "$WORK_SKILL_DIR/cli/CLIInterface.js" "$@"
`;
  }

  /**
   * Generate completion script
   */
  generateCompletionScript() {
    return `# Claude Work Completion Script for Bash
# Source this file in your .bashrc or .zshrc

_claude_work_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"

    opts="start end status history search backup restore init help"

    if [[ \${cur} == * ]] ; then
        COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
        return 0
    fi
}

complete -F _claude_work_completion claude-work
`;
  }

  /**
   * Copy skill to Claude skills directory
   */
  async copySkill(sourceDir, targetDir) {
    const { execSync } = require('child_process');

    // Remove existing directory if it exists
    try {
      await fs.rmdir(targetDir, { recursive: true });
    } catch (error) {
      // Directory doesn't exist, continue
    }

    // Copy skill directory
    execSync(`cp -r "${sourceDir}" "${targetDir}"`, { stdio: 'inherit' });

    console.log(`✅ Copied skill to: ${targetDir}`);
  }

  /**
   * Update skill in place
   */
  async updateSkillInPlace(sourceDir, targetDir) {
    // Update critical files only
    const criticalFiles = [
      'SKILL.md',
      'cli/CLIInterface.js',
      'core/ContextManager.js',
      'core/StorageEngine.js',
      'core/SessionManager.js'
    ];

    for (const file of criticalFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      try {
        await fs.copyFile(sourcePath, targetPath);
      } catch (error) {
        console.warn(`Failed to update ${file}:`, error.message);
      }
    }

    console.log('✅ Updated skill in place');
  }

  /**
   * Configure Claude to use the skill
   */
  async configureClaudeSkills() {
    try {
      // Update Claude config to include our skill
      const config = { ...this.claudeConfig };

      if (!config.skills) {
        config.skills = [];
      }

      const skillConfig = {
        name: 'web-developer-work-skill',
        path: path.join(path.dirname(this.claudeConfigPath), 'skills', 'web-developer-work-skill'),
        enabled: true,
        auto_load: true
      };

      // Check if skill is already configured
      const existingIndex = config.skills.findIndex(s => s.name === skillConfig.name);

      if (existingIndex >= 0) {
        config.skills[existingIndex] = skillConfig;
      } else {
        config.skills.push(skillConfig);
      }

      // Write updated config
      await fs.writeFile(this.claudeConfigPath, JSON.stringify(config, null, 2));

      console.log('✅ Configured Claude to use web-developer-work-skill');

    } catch (error) {
      throw new Error(`Failed to configure Claude skills: ${error.message}`);
    }
  }

  /**
   * Get integration status
   */
  getStatus() {
    return {
      hooksConfigured: this.hooksConfigured,
      claudeConfigPath: this.claudeConfigPath,
      monitoringActive: !!this.monitoringProcess,
      lastCommand: this.lastCommand,
      commandHistoryCount: this.commandHistory.length,
      uptime: process.uptime()
    };
  }

  /**
   * Cleanup resources
   */
  async destroy() {
    if (this.monitoringProcess) {
      this.monitoringProcess.kill();
      this.monitoringProcess = null;
    }

    this.removeAllListeners();
    this.lastCommand = null;
    this.commandHistory = [];
  }
}

module.exports = ClaudeDesktopIntegration;
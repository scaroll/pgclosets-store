#!/bin/bash
set -e

echo "🤖 Setting up ChatGPT Codex CLI Integration"
echo "============================================"

# Create directory structure for ChatGPT agents
mkdir -p agents/{chatgpt,codex,orchestrator}
mkdir -p agents/config
mkdir -p agents/templates
mkdir -p agents/logs

# Install required dependencies
echo "📦 Installing dependencies..."
npm install --save-dev openai @types/node dotenv
npm install terminal-chatgpt-cli -g 2>/dev/null || echo "⚠️ Global install may require sudo"

# Create OpenAI configuration
cat > agents/config/openai.json << 'EOF'
{
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 2000,
  "timeout": 30000,
  "retries": 3,
  "codex": {
    "model": "code-davinci-002",
    "temperature": 0.1,
    "max_tokens": 4000
  }
}
EOF

# Create environment template
cat > agents/.env.template << 'EOF'
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_org_id_here

# ChatGPT CLI Configuration
CHATGPT_CLI_API_KEY=your_chatgpt_cli_key_here

# Agent Configuration
AGENT_LOG_LEVEL=info
AGENT_MAX_CONCURRENT=5
AGENT_TIMEOUT=60000
EOF

# Create agent types configuration
cat > agents/config/agent-types.json << 'EOF'
{
  "agents": {
    "database": {
      "name": "Database Agent",
      "description": "Handles database operations and product data management",
      "model": "gpt-4",
      "systemPrompt": "You are a database specialist focused on product data management and database operations.",
      "tools": ["read", "write", "grep", "bash"],
      "maxTokens": 2000
    },
    "frontend": {
      "name": "Frontend Agent", 
      "description": "Manages UI/UX and React component development",
      "model": "gpt-4",
      "systemPrompt": "You are a frontend developer specializing in React, Next.js, and modern UI development.",
      "tools": ["read", "write", "edit", "multiedit"],
      "maxTokens": 3000
    },
    "api": {
      "name": "API Agent",
      "description": "Handles API development and backend integration",
      "model": "gpt-4", 
      "systemPrompt": "You are an API developer focused on backend services and data integration.",
      "tools": ["read", "write", "bash", "grep"],
      "maxTokens": 2500
    },
    "deployment": {
      "name": "Deployment Agent",
      "description": "Manages deployments and infrastructure",
      "model": "gpt-4",
      "systemPrompt": "You are a DevOps specialist handling deployments and infrastructure management.",
      "tools": ["bash", "read", "write"],
      "maxTokens": 2000
    },
    "codex": {
      "name": "Codex Agent",
      "description": "Advanced code generation and analysis using Codex",
      "model": "code-davinci-002",
      "systemPrompt": "You are a code generation specialist using advanced AI to create and analyze code.",
      "tools": ["read", "write", "edit", "bash"],
      "maxTokens": 4000
    }
  }
}
EOF

# Create main agent orchestrator
cat > agents/chatgpt-agent.js << 'EOF'
#!/usr/bin/env node

const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

class ChatGPTAgent {
    constructor() {
        this.config = JSON.parse(fs.readFileSync('./config/openai.json', 'utf8'));
        this.agentTypes = JSON.parse(fs.readFileSync('./config/agent-types.json', 'utf8'));
        
        this.openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG_ID
        }));
        
        this.activeAgents = new Map();
        this.logLevel = process.env.AGENT_LOG_LEVEL || 'info';
    }

    log(level, message, data = null) {
        if (this.shouldLog(level)) {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level,
                message,
                data
            };
            
            console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
            
            // Write to log file
            const logFile = path.join(__dirname, 'logs', `agents-${new Date().toISOString().split('T')[0]}.log`);
            fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        }
    }

    shouldLog(level) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        return levels[level] <= levels[this.logLevel];
    }

    async createAgent(type, task, context = {}) {
        if (!this.agentTypes.agents[type]) {
            throw new Error(`Unknown agent type: ${type}`);
        }

        const agentConfig = this.agentTypes.agents[type];
        const agentId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        this.log('info', `Creating ${agentConfig.name}`, { agentId, task });

        const agent = {
            id: agentId,
            type,
            config: agentConfig,
            task,
            context,
            status: 'created',
            createdAt: new Date().toISOString()
        };

        this.activeAgents.set(agentId, agent);
        return agentId;
    }

    async executeAgent(agentId, prompt) {
        const agent = this.activeAgents.get(agentId);
        if (!agent) {
            throw new Error(`Agent not found: ${agentId}`);
        }

        this.log('info', `Executing agent ${agent.config.name}`, { agentId, prompt: prompt.substring(0, 100) });

        agent.status = 'executing';
        agent.startedAt = new Date().toISOString();

        try {
            const messages = [
                {
                    role: 'system',
                    content: agent.config.systemPrompt + '\n\n' + this.buildContextPrompt(agent.context)
                },
                {
                    role: 'user',
                    content: prompt
                }
            ];

            const response = await this.openai.createChatCompletion({
                model: agent.config.model,
                messages,
                max_tokens: agent.config.maxTokens,
                temperature: this.config.temperature
            });

            const result = response.data.choices[0].message.content;
            
            agent.status = 'completed';
            agent.completedAt = new Date().toISOString();
            agent.result = result;
            agent.usage = response.data.usage;

            this.log('info', `Agent ${agent.config.name} completed`, { 
                agentId, 
                tokens: response.data.usage.total_tokens 
            });

            return result;

        } catch (error) {
            agent.status = 'error';
            agent.error = error.message;
            agent.completedAt = new Date().toISOString();

            this.log('error', `Agent ${agent.config.name} failed`, { agentId, error: error.message });
            throw error;
        }
    }

    buildContextPrompt(context) {
        let prompt = '\nContext Information:\n';
        
        if (context.workingDirectory) {
            prompt += `Working Directory: ${context.workingDirectory}\n`;
        }
        
        if (context.files && context.files.length > 0) {
            prompt += `Relevant Files: ${context.files.join(', ')}\n`;
        }
        
        if (context.database) {
            prompt += `Database: ${context.database}\n`;
        }
        
        if (context.deployment) {
            prompt += `Deployment URL: ${context.deployment}\n`;
        }

        return prompt;
    }

    async executeMultipleAgents(tasks) {
        this.log('info', `Executing ${tasks.length} agents in parallel`);

        const promises = tasks.map(async (task) => {
            const agentId = await this.createAgent(task.type, task.description, task.context);
            return {
                agentId,
                type: task.type,
                result: await this.executeAgent(agentId, task.prompt)
            };
        });

        return Promise.all(promises);
    }

    getAgentStatus(agentId) {
        const agent = this.activeAgents.get(agentId);
        if (!agent) return null;

        return {
            id: agent.id,
            type: agent.type,
            status: agent.status,
            createdAt: agent.createdAt,
            startedAt: agent.startedAt,
            completedAt: agent.completedAt,
            usage: agent.usage
        };
    }

    getAllAgentStatuses() {
        return Array.from(this.activeAgents.values()).map(agent => this.getAgentStatus(agent.id));
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    const agent = new ChatGPTAgent();

    try {
        switch (command) {
            case 'create':
                const type = args[1];
                const task = args[2];
                const agentId = await agent.createAgent(type, task);
                console.log(`Agent created: ${agentId}`);
                break;

            case 'execute':
                const id = args[1];
                const prompt = args.slice(2).join(' ');
                const result = await agent.executeAgent(id, prompt);
                console.log('Result:', result);
                break;

            case 'status':
                const statuses = agent.getAllAgentStatuses();
                console.log('Active Agents:', JSON.stringify(statuses, null, 2));
                break;

            case 'multi':
                // Execute multiple agents for PG Closets debugging
                const pgClosetsTasks = [
                    {
                        type: 'database',
                        description: 'Analyze product database',
                        prompt: 'Check the renin-products-database.json file and verify all 28 products have correct slugs for routing',
                        context: { 
                            workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                            files: ['lib/renin-products-database.json']
                        }
                    },
                    {
                        type: 'frontend',
                        description: 'Debug product routing',
                        prompt: 'Analyze the product page routing in app/store/products/[slug]/page.tsx and ensure generateStaticParams works correctly',
                        context: { 
                            workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                            files: ['app/store/products/[slug]/page.tsx']
                        }
                    },
                    {
                        type: 'deployment',
                        description: 'Check deployment configuration',
                        prompt: 'Verify Vercel deployment configuration and check for any authentication blocking issues',
                        context: { 
                            workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                            deployment: 'https://v0-fork-of-usable-and-appealing-axxk26z5a-peoples-group.vercel.app'
                        }
                    }
                ];

                const results = await agent.executeMultipleAgents(pgClosetsTasks);
                console.log('Multi-Agent Results:', JSON.stringify(results, null, 2));
                break;

            default:
                console.log(`
Usage: node chatgpt-agent.js <command> [args...]

Commands:
  create <type> <task>     Create a new agent
  execute <id> <prompt>    Execute an agent with a prompt
  status                   Show status of all agents
  multi                    Execute multiple PG Closets debugging agents

Agent Types: database, frontend, api, deployment, codex
                `);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = ChatGPTAgent;
EOF

# Create Codex CLI integration
cat > agents/codex-cli.js << 'EOF'
#!/usr/bin/env node

const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

class CodexCLI {
    constructor() {
        this.openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG_ID
        }));
    }

    async generateCode(prompt, language = 'javascript', maxTokens = 2000) {
        const codePrompt = `// Language: ${language}\n// Task: ${prompt}\n\n`;
        
        try {
            const response = await this.openai.createCompletion({
                model: 'code-davinci-002',
                prompt: codePrompt,
                max_tokens: maxTokens,
                temperature: 0.1,
                stop: ['// End of code']
            });

            return response.data.choices[0].text.trim();
        } catch (error) {
            throw new Error(`Codex generation failed: ${error.message}`);
        }
    }

    async analyzeCode(code, question) {
        const prompt = `Analyze this code and answer the question:\n\n${code}\n\nQuestion: ${question}\n\nAnswer:`;
        
        try {
            const response = await this.openai.createCompletion({
                model: 'code-davinci-002',
                prompt,
                max_tokens: 1000,
                temperature: 0.3
            });

            return response.data.choices[0].text.trim();
        } catch (error) {
            throw new Error(`Code analysis failed: ${error.message}`);
        }
    }

    async fixCode(code, issue) {
        const prompt = `Fix this code issue:\n\nCode:\n${code}\n\nIssue: ${issue}\n\nFixed code:`;
        
        try {
            const response = await this.openai.createCompletion({
                model: 'code-davinci-002',
                prompt,
                max_tokens: 2000,
                temperature: 0.2
            });

            return response.data.choices[0].text.trim();
        } catch (error) {
            throw new Error(`Code fix failed: ${error.message}`);
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    const codex = new CodexCLI();

    try {
        switch (command) {
            case 'generate':
                const prompt = args[1];
                const language = args[2] || 'javascript';
                const code = await codex.generateCode(prompt, language);
                console.log('Generated Code:\n', code);
                break;

            case 'analyze':
                const codeFile = args[1];
                const question = args[2];
                const codeContent = fs.readFileSync(codeFile, 'utf8');
                const analysis = await codex.analyzeCode(codeContent, question);
                console.log('Analysis:', analysis);
                break;

            case 'fix':
                const fixFile = args[1];
                const issue = args[2];
                const fixContent = fs.readFileSync(fixFile, 'utf8');
                const fixed = await codex.fixCode(fixContent, issue);
                console.log('Fixed Code:\n', fixed);
                break;

            default:
                console.log(`
Usage: node codex-cli.js <command> [args...]

Commands:
  generate <prompt> [language]    Generate code from prompt
  analyze <file> <question>       Analyze code and answer question
  fix <file> <issue>             Fix code issue

Example:
  node codex-cli.js generate "Create a React component for product display" typescript
  node codex-cli.js analyze ./components/product.tsx "What does this component do?"
  node codex-cli.js fix ./lib/products.ts "Fix TypeScript errors"
                `);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CodexCLI;
EOF

# Create agent orchestrator
cat > agents/orchestrator.js << 'EOF'
#!/usr/bin/env node

const ChatGPTAgent = require('./chatgpt-agent');
const CodexCLI = require('./codex-cli');
const fs = require('fs');
const path = require('path');

class AgentOrchestrator {
    constructor() {
        this.chatgpt = new ChatGPTAgent();
        this.codex = new CodexCLI();
        this.sessions = new Map();
    }

    async createDeploymentDebugSession() {
        const sessionId = `debug-${Date.now()}`;
        
        console.log('🤖 Creating multi-agent debugging session for PG Closets deployment');
        
        const agents = [
            {
                type: 'database',
                description: 'Database and Product Analysis',
                prompt: `Analyze the PG Closets product database and routing:
                
                1. Check /Users/spencercarroll/Downloads/pgclosets-store/lib/renin-products-database.json
                2. Verify all 28 products have correct slug fields
                3. Ensure slugs match the routing pattern in app/store/products/[slug]/page.tsx
                4. Check generateStaticParams function
                5. Identify any routing mismatches
                
                Provide specific fixes needed.`,
                context: {
                    workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                    files: ['lib/renin-products-database.json', 'app/store/products/[slug]/page.tsx']
                }
            },
            {
                type: 'frontend',
                description: 'UI and Authentication Analysis', 
                prompt: `Debug authentication and UI issues:
                
                1. Check for authentication middleware in middleware.ts
                2. Analyze layout.tsx files for auth requirements
                3. Look for Supabase auth configuration
                4. Check why pages return 401 errors
                5. Ensure public routes are accessible
                
                Provide specific auth fixes.`,
                context: {
                    workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                    files: ['middleware.ts', 'app/layout.tsx']
                }
            },
            {
                type: 'api',
                description: 'API and Data Fetching Analysis',
                prompt: `Analyze API endpoints and data fetching:
                
                1. Check product data fetching in components
                2. Verify API routes are working
                3. Test product queries and responses
                4. Check for any blocking API middleware
                5. Ensure product pages can fetch data
                
                Provide API fixes needed.`,
                context: {
                    workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                    deployment: 'https://v0-fork-of-usable-and-appealing-axxk26z5a-peoples-group.vercel.app'
                }
            },
            {
                type: 'deployment',
                description: 'Deployment and Build Analysis',
                prompt: `Analyze deployment and build configuration:
                
                1. Check Vercel configuration in vercel.json
                2. Analyze build output for static generation
                3. Verify all product pages are pre-generated
                4. Check for deployment restrictions or password protection
                5. Ensure proper public access configuration
                
                Provide deployment fixes.`,
                context: {
                    workingDirectory: '/Users/spencercarroll/Downloads/pgclosets-store',
                    deployment: 'https://v0-fork-of-usable-and-appealing-axxk26z5a-peoples-group.vercel.app'
                }
            }
        ];

        try {
            console.log('⚡ Executing agents in parallel...');
            const results = await this.chatgpt.executeMultipleAgents(agents);
            
            const session = {
                id: sessionId,
                timestamp: new Date().toISOString(),
                agents: results,
                summary: this.generateSummary(results)
            };

            this.sessions.set(sessionId, session);
            
            // Save session to file
            const sessionFile = path.join(__dirname, 'logs', `session-${sessionId}.json`);
            fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));

            console.log('\n📊 Multi-Agent Debug Session Complete');
            console.log('=====================================');
            
            results.forEach((result, index) => {
                console.log(`\n🤖 Agent ${index + 1} (${result.type}):`);
                console.log(result.result.substring(0, 500) + '...');
            });

            console.log('\n📝 Summary:', session.summary);
            console.log(`\n💾 Full results saved to: ${sessionFile}`);

            return session;

        } catch (error) {
            console.error('❌ Agent orchestration failed:', error.message);
            throw error;
        }
    }

    generateSummary(results) {
        const issues = [];
        const fixes = [];

        results.forEach(result => {
            if (result.result.toLowerCase().includes('error') || 
                result.result.toLowerCase().includes('issue') ||
                result.result.toLowerCase().includes('problem')) {
                issues.push(`${result.type}: Issues found`);
            }
            
            if (result.result.toLowerCase().includes('fix') ||
                result.result.toLowerCase().includes('solution')) {
                fixes.push(`${result.type}: Fixes available`);
            }
        });

        return {
            totalAgents: results.length,
            issuesFound: issues.length,
            fixesAvailable: fixes.length,
            issues,
            fixes
        };
    }

    async executeCodexAnalysis(file, question) {
        console.log(`🔍 Analyzing ${file} with Codex...`);
        return await this.codex.analyzeCode(fs.readFileSync(file, 'utf8'), question);
    }

    async generateCodeFix(file, issue) {
        console.log(`🛠️ Generating fix for ${file}...`);
        return await this.codex.fixCode(fs.readFileSync(file, 'utf8'), issue);
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    const orchestrator = new AgentOrchestrator();

    try {
        switch (command) {
            case 'debug':
                await orchestrator.createDeploymentDebugSession();
                break;

            case 'analyze':
                const file = args[1];
                const question = args[2];
                const analysis = await orchestrator.executeCodexAnalysis(file, question);
                console.log('Analysis:', analysis);
                break;

            case 'fix':
                const fixFile = args[1];
                const issue = args[2];
                const fix = await orchestrator.generateCodeFix(fixFile, issue);
                console.log('Generated Fix:', fix);
                break;

            default:
                console.log(`
🤖 Agent Orchestrator CLI

Usage: node orchestrator.js <command> [args...]

Commands:
  debug                    Create multi-agent debugging session for PG Closets
  analyze <file> <question> Analyze code with Codex
  fix <file> <issue>       Generate code fix with Codex

Example:
  node orchestrator.js debug
  node orchestrator.js analyze ./lib/products.ts "Why are products not loading?"
  node orchestrator.js fix ./middleware.ts "Remove authentication blocking"
                `);
        }
    } catch (error) {
        console.error('❌ Orchestrator failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = AgentOrchestrator;
EOF

# Make scripts executable
chmod +x agents/chatgpt-agent.js
chmod +x agents/codex-cli.js  
chmod +x agents/orchestrator.js

# Create package.json for agents
cat > agents/package.json << 'EOF'
{
  "name": "pgclosets-chatgpt-agents",
  "version": "1.0.0",
  "description": "ChatGPT and Codex CLI integration for PG Closets debugging",
  "main": "orchestrator.js",
  "scripts": {
    "debug": "node orchestrator.js debug",
    "agent": "node chatgpt-agent.js",
    "codex": "node codex-cli.js",
    "setup": "npm install && cp .env.template .env"
  },
  "dependencies": {
    "openai": "^3.3.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0"
  }
}
EOF

# Create NPM scripts in main package.json
echo "📝 Adding agent scripts to main package.json..."

# Add to main package.json scripts
if ! grep -q "agent-debug" package.json; then
    # Add scripts to package.json
    sed -i '' 's/"setup:directories": "mkdir -p public\/images\/{harvested,optimized}\/{barn-doors,closet-doors,hardware,track-systems,handles,accessories}"/"setup:directories": "mkdir -p public\/images\/{harvested,optimized}\/{barn-doors,closet-doors,hardware,track-systems,handles,accessories}",\
    "agent-debug": "cd agents && npm run debug",\
    "agent-setup": "cd agents && npm run setup",\
    "codex": "cd agents && npm run codex"/' package.json
fi

echo ""
echo "✅ ChatGPT Codex CLI Integration Setup Complete!"
echo "==============================================="
echo ""
echo "📋 Next Steps:"
echo "1. cd agents && cp .env.template .env"
echo "2. Edit agents/.env with your OpenAI API key"
echo "3. npm run agent-setup (install agent dependencies)"
echo "4. npm run agent-debug (run multi-agent debugging)"
echo ""
echo "🤖 Available Commands:"
echo "- npm run agent-debug    : Multi-agent PG Closets debugging"
echo "- npm run codex         : Codex CLI for code generation"
echo "- cd agents && node orchestrator.js debug : Full debugging session"
echo ""
echo "📁 Agent Structure Created:"
echo "- agents/chatgpt-agent.js    : Main ChatGPT agent system"
echo "- agents/codex-cli.js        : Codex code generation CLI"
echo "- agents/orchestrator.js     : Multi-agent orchestration"
echo "- agents/config/             : Agent configurations"
echo "- agents/logs/               : Agent execution logs"
echo ""
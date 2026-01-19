#!/usr/bin/env node

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

class PGClosetsAgentOrchestrator {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.projectPath = process.env.PROJECT_PATH || '/Users/spencercarroll/Downloads/pgclosets-store';
        this.deploymentUrl = process.env.DEPLOYMENT_URL;
        this.activeAgents = new Map();
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        
        if (data) {
            console.log('Data:', JSON.stringify(data, null, 2));
        }
    }

    async createAgent(type, description, prompt, context = {}) {
        const agentId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const systemPrompts = {
            database: `You are a database specialist analyzing the PG Closets product database. Focus on:
                - Product data structure and integrity
                - URL slug generation and routing compatibility
                - Database schema validation
                - Product accessibility verification`,
                
            frontend: `You are a frontend developer specializing in Next.js and React. Focus on:
                - Component analysis and debugging
                - Routing and dynamic page generation
                - Authentication and middleware issues
                - UI/UX functionality`,
                
            deployment: `You are a DevOps specialist handling deployment issues. Focus on:
                - Vercel configuration and deployment settings
                - Build process analysis
                - Public access and authentication settings
                - Production environment troubleshooting`,
                
            api: `You are an API developer focused on data flow and backend integration. Focus on:
                - API endpoint analysis
                - Data fetching and response validation
                - Server-side rendering issues
                - Database connectivity`
        };

        const agent = {
            id: agentId,
            type,
            description,
            prompt,
            context,
            systemPrompt: systemPrompts[type] || systemPrompts.database,
            status: 'created',
            createdAt: new Date().toISOString()
        };

        this.activeAgents.set(agentId, agent);
        this.log('info', `Created ${type} agent: ${description}`, { agentId });
        
        return agentId;
    }

    async executeAgent(agentId) {
        const agent = this.activeAgents.get(agentId);
        if (!agent) {
            throw new Error(`Agent not found: ${agentId}`);
        }

        this.log('info', `Executing ${agent.type} agent`, { agentId: agent.id });
        
        agent.status = 'executing';
        agent.startedAt = new Date().toISOString();

        try {
            const contextInfo = this.buildContextPrompt(agent.context);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: agent.systemPrompt + '\\n\\n' + contextInfo
                    },
                    {
                        role: 'user', 
                        content: agent.prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });

            const result = response.choices[0].message.content;
            
            agent.status = 'completed';
            agent.completedAt = new Date().toISOString();
            agent.result = result;
            agent.usage = response.usage;

            this.log('info', `Agent ${agent.type} completed`, { 
                agentId: agent.id,
                tokens: response.usage.total_tokens 
            });

            return result;

        } catch (error) {
            agent.status = 'error';
            agent.error = error.message;
            agent.completedAt = new Date().toISOString();
            
            this.log('error', `Agent ${agent.type} failed`, { 
                agentId: agent.id, 
                error: error.message 
            });
            throw error;
        }
    }

    buildContextPrompt(context) {
        let prompt = '\\nProject Context:\\n';
        prompt += `Working Directory: ${this.projectPath}\\n`;
        
        if (this.deploymentUrl) {
            prompt += `Current Deployment: ${this.deploymentUrl}\\n`;
        }
        
        if (context.files && context.files.length > 0) {
            prompt += `Relevant Files: ${context.files.join(', ')}\\n`;
        }
        
        if (context.issues) {
            prompt += `Known Issues: ${context.issues.join(', ')}\\n`;
        }

        return prompt;
    }

    async runPGClosetsDebugSession() {
        console.log('🤖 Starting PG Closets Multi-Agent Debug Session');
        console.log('==================================================');
        
        // Define debugging tasks
        const tasks = [
            {
                type: 'database',
                description: 'Product Database Analysis',
                prompt: `Analyze the PG Closets product database and routing setup:
                
                Key tasks:
                1. Check if all 28 products in renin-products-database.json have valid slug fields
                2. Verify slugs match URL routing patterns for /store/products/[slug]
                3. Ensure generateStaticParams includes all products
                4. Identify any products that might be missing or have invalid slugs
                5. Check database structure compatibility with the app
                
                Focus on finding why individual product pages might return 404 errors.`,
                context: {
                    files: ['lib/renin-products-database.json', 'lib/renin-products.ts', 'app/store/products/[slug]/page.tsx'],
                    issues: ['Product pages returning 404', 'Individual product URLs not accessible']
                }
            },
            {
                type: 'frontend',
                description: 'Authentication & Routing Debug',
                prompt: `Debug authentication and frontend routing issues:
                
                Key tasks:
                1. Check for authentication middleware blocking public access
                2. Analyze app/layout.tsx for auth requirements
                3. Look for Supabase or other auth configurations
                4. Verify public routes are properly configured
                5. Check why deployment returns 401 errors
                
                The site should be publicly accessible without authentication.`,
                context: {
                    files: ['middleware.ts', 'app/layout.tsx', 'app/store/layout.tsx'],
                    issues: ['401 authentication errors', 'Public pages blocked by auth']
                }
            },
            {
                type: 'deployment',
                description: 'Vercel Deployment Analysis',
                prompt: `Analyze Vercel deployment configuration:
                
                Key tasks:
                1. Check vercel.json for any access restrictions
                2. Verify build process generates all product pages
                3. Look for password protection or team restrictions
                4. Ensure static generation is working correctly
                5. Check deployment logs for errors
                
                The deployment should be publicly accessible.`,
                context: {
                    files: ['vercel.json', '.vercel/project.json', 'next.config.js'],
                    issues: ['Site returning 401 errors', 'Possible password protection blocking access']
                }
            },
            {
                type: 'api',
                description: 'Data Flow & API Analysis',
                prompt: `Analyze data flow and API functionality:
                
                Key tasks:
                1. Verify product data is properly loaded and accessible
                2. Check API routes and data fetching logic
                3. Test product queries and data retrieval
                4. Ensure database integration is working
                5. Verify no API middleware is blocking requests
                
                Focus on ensuring products can be fetched and displayed.`,
                context: {
                    files: ['lib/renin-products.ts', 'app/store/products/page.tsx'],
                    issues: ['Product data might not be loading', 'API endpoints may be blocked']
                }
            }
        ];

        try {
            // Create all agents
            const agentIds = [];
            for (const task of tasks) {
                const agentId = await this.createAgent(task.type, task.description, task.prompt, task.context);
                agentIds.push(agentId);
            }

            // Execute all agents in parallel
            console.log('⚡ Executing agents in parallel...');
            const results = await Promise.all(
                agentIds.map(agentId => this.executeAgent(agentId))
            );

            // Generate session summary
            const session = {
                timestamp: new Date().toISOString(),
                agents: agentIds.map((agentId, index) => ({
                    id: agentId,
                    type: tasks[index].type,
                    description: tasks[index].description,
                    result: results[index]
                })),
                summary: this.generateSummary(results)
            };

            // Save session to file
            const sessionFile = path.join(__dirname, 'logs', `debug-session-${Date.now()}.json`);
            fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));

            // Display results
            console.log('\\n📊 Debug Session Results');
            console.log('========================');
            
            session.agents.forEach((agent, index) => {
                console.log(`\\n🤖 ${agent.type.toUpperCase()} Agent - ${agent.description}:`);
                console.log('-'.repeat(60));
                console.log(agent.result.substring(0, 800) + (agent.result.length > 800 ? '...' : ''));
            });

            console.log('\\n📝 Session Summary:');
            console.log(JSON.stringify(session.summary, null, 2));
            console.log(`\\n💾 Full results saved to: ${sessionFile}`);

            return session;

        } catch (error) {
            console.error('❌ Debug session failed:', error.message);
            throw error;
        }
    }

    generateSummary(results) {
        const issues = [];
        const solutions = [];
        
        results.forEach((result, index) => {
            const lowerResult = result.toLowerCase();
            
            // Count issues found
            if (lowerResult.includes('error') || lowerResult.includes('issue') || lowerResult.includes('problem')) {
                issues.push(`Agent ${index + 1}: Issues detected`);
            }
            
            // Count solutions provided
            if (lowerResult.includes('fix') || lowerResult.includes('solution') || lowerResult.includes('resolve')) {
                solutions.push(`Agent ${index + 1}: Solutions provided`);
            }
        });

        return {
            totalAgents: results.length,
            issuesFound: issues.length,
            solutionsProvided: solutions.length,
            issues,
            solutions,
            recommendation: issues.length > 0 ? 'Issues detected - review agent outputs for fixes' : 'No critical issues found'
        };
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    const orchestrator = new PGClosetsAgentOrchestrator();

    try {
        switch (command) {
            case 'debug':
                await orchestrator.runPGClosetsDebugSession();
                break;
                
            default:
                console.log(`
🤖 PG Closets Agent Orchestrator

Usage: node orchestrator.js <command>

Commands:
  debug    Run complete multi-agent debugging session for PG Closets

This will analyze:
- Product database and routing
- Authentication and access issues  
- Deployment configuration
- API and data flow

Requires OPENAI_API_KEY in .env file
                `);
        }
    } catch (error) {
        console.error('❌ Orchestrator failed:', error.message);
        process.exit(1);
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
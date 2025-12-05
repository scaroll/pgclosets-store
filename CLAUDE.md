# Claude Code Configuration

## Repository Info
- **Owner:** scaroll
- **Repo:** pgclosets-store
- **Default branch:** main
- **Domain:** https://www.pgclosets.com

## GitHub MCP Server

To push directly to main, use token authentication:

```bash
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/scaroll/pgclosets-store.git
```

### Install GitHub MCP Server
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PERSONAL_ACCESS_TOKEN \
  -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

> **Note:** Store your GitHub Personal Access Token in `~/.env` or a secure secrets manager.
> Token should have `repo` scope for full repository access.

## Git Workflow
- **Main branch:** main
- Push changes directly to main to trigger Vercel deployment
- Token has repo scope for full repository access

### CRITICAL: Session End Checklist
Before ending any Claude Code session, ALWAYS:

1. **Verify all work is merged to main:**
```bash
git log origin/main..HEAD --oneline
```
If there are commits shown, they need to be pushed to main.

2. **Push to main:**
```bash
git checkout main
git push -u origin main
```

3. **Confirm deployment:**
   - Check that the push was successful
   - Vercel will auto-deploy from main

## Vercel API
Token for Vercel API operations:
```bash
export VERCEL_TOKEN=$VERCEL_API_TOKEN
```

### Vercel MCP Server
Install the Vercel MCP server for AI-assisted deployment management:

```bash
claude mcp add vercel -e VERCEL_API_TOKEN=$VERCEL_API_TOKEN \
  -- npx -y @vercel/mcp
```

> **Note:** Store your Vercel API Token in `~/.env` or a secure secrets manager.

### Available Vercel Functions
- `mcp__vercel__list_projects()`
- `mcp__vercel__get_project(project_id)`
- `mcp__vercel__list_deployments(project_id, limit, state)`
- `mcp__vercel__get_deployment(deployment_id)`
- `mcp__vercel__promote_deployment(deployment_id)`
- `mcp__vercel__rollback_deployment(project_id)`
- `mcp__vercel__get_environment_variables(project_id)`
- `mcp__vercel__set_environment_variable(project_id, key, value, target)`
- `mcp__vercel__get_domains(project_id)`
- `mcp__vercel__get_analytics(project_id, from, to)`

## Google Analytics MCP Server

### Installation
```bash
claude mcp add analytics-mcp -e GOOGLE_APPLICATION_CREDENTIALS=/home/user/.config/google-analytics-mcp/oauth-client.json \
  -e GOOGLE_PROJECT_ID=pgclosets-analytics \
  -- /root/.local/bin/analytics-mcp
```

### First-Time Authentication
```bash
gcloud auth application-default login \
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform \
  --client-id-file=/home/user/.config/google-analytics-mcp/oauth-client.json
```

### Available Analytics Functions
- `mcp__analytics-mcp__get_account_summaries()`
- `mcp__analytics-mcp__get_property_details(property_id)`
- `mcp__analytics-mcp__run_report(property_id, metrics, dimensions, date_range)`
- `mcp__analytics-mcp__get_realtime_data(property_id)`

## Deployment
Vercel automatically deploys when changes are pushed to main.

### Domain Configuration
| Domain | Role | Redirect |
|--------|------|----------|
| www.pgclosets.com | Primary | None (serves content) |
| pgclosets.com | Redirect | → www.pgclosets.com (308) |
| pgclosets-store.vercel.app | Fallback | None |

### Environment Variable
```
NEXT_PUBLIC_SITE_URL=https://www.pgclosets.com
```

---

# Standing Orders (ALWAYS Follow)

## Deployment Requirements (MANDATORY)
- **Always Push to Main** - Work deploys ONLY from main
- **Merge feature branches immediately** after completing work
- **Verify deployment** - Check Vercel dashboard after push

## SEO Requirements (Mandatory for All Changes)
- **Metadata Preservation** - Never remove existing page metadata
- **Structured Data (JSON-LD)** - Maintain schema markup on all pages
- **Semantic HTML** - One `<h1>` per page, sequential headings
- **Images** - ALL images must have alt text, use `next/image`
- **Internal Linking** - Use `next/link` for all internal links

## Mobile Responsiveness Requirements
- **Touch Targets** - Minimum 44x44px for all buttons/links
- **Typography** - Minimum 16px base font size
- **Layout** - No horizontal scrolling on mobile
- **Forms** - Input height minimum 48px

## Accessibility Requirements (WCAG 2.1 AA+)
- **Focus States** - ALL interactive elements must have visible focus
- **Touch Targets** - Minimum 44x44px
- **Color Contrast** - Minimum 4.5:1 ratio (target 7:1)
- **Keyboard Navigation** - All elements keyboard accessible
- **Screen Reader Support** - Use semantic HTML and ARIA labels

## Pre-Commit Checklist
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Mobile responsive at 375px width
- [ ] No SEO regressions
- [ ] Accessibility checks pass
- [ ] No console errors

---

# IndexNow Setup (Instant Indexing)

## IndexNow Key
Key: `f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6`

## Files Required
- `/public/f8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6.txt` - Contains your key
- `/lib/indexnow.ts` - IndexNow submission logic
- `/app/api/seo/submit-all/route.ts` - Submission endpoint

## Submit to Search Engines
```bash
curl -X POST "https://www.pgclosets.com/api/seo/submit-all"
```

---

# AI Crawler Configuration

## robots.txt Rules
Allow all major AI crawlers:
- GPTBot, ChatGPT-User (OpenAI)
- ClaudeBot, Claude-Web (Anthropic)
- Google-Extended, Googlebot-GenAI (Google AI)
- PerplexityBot
- Bingbot

## Files Required
- `/public/llms.txt` - LLM context file
- `/public/ai.txt` - AI policy with Allow-Agent directives
- `/app/robots.ts` - Dynamic robots.txt with AI bot rules

---

# Cron Jobs (vercel.json)
```json
{
  "crons": [
    { "path": "/api/cron/index-now", "schedule": "0 * * * *" },
    { "path": "/api/cron/sitemap-regen", "schedule": "0 2 * * *" },
    { "path": "/api/cron/sitemap-ping", "schedule": "0 3 * * 1" },
    { "path": "/api/cron/uptime-check", "schedule": "0 * * * *" },
    { "path": "/api/cron/ssl-monitor", "schedule": "0 */12 * * *" }
  ]
}
```

---

# Quick Reference Commands

## Push to main (with token)
```bash
git remote set-url origin https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/scaroll/pgclosets-store.git
git push -u origin main
```

## Submit to search engines
```bash
curl -X POST "https://www.pgclosets.com/api/seo/submit-all"
```

## Check deployment status
```bash
curl -sI https://www.pgclosets.com | head -5
```

## Run quality checks
```bash
npm run quality
npm run build
```

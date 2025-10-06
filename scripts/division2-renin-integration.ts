#!/usr/bin/env ts-node
/**
 * DIVISION 2: RENIN CATALOG INTEGRATION
 * Execute complete 25-agent scraping system
 *
 * Usage:
 *   ts-node scripts/division2-renin-integration.ts
 *   or
 *   npm run division2:execute
 */

import { Division2Orchestrator } from '../lib/renin-scraper';

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                    DIVISION 2: RENIN INTEGRATION                      ║
║                     25-Agent Scraping System                          ║
╚══════════════════════════════════════════════════════════════════════╝
  `);

  const orchestrator = new Division2Orchestrator({
    baseUrl: 'https://www.renin.com',
    outputDir: './data/renin',
    maxConcurrent: 5,
    rateLimit: 2000, // 2 seconds between requests
    headless: true,
    timeout: 30000,
    retries: 3
  });

  try {
    await orchestrator.execute();

    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                        ✅ MISSION COMPLETE                           ║
║                                                                      ║
║  Division 2: Renin Catalog Integration successfully completed       ║
║  Check ./data/renin/ for output files                               ║
╚══════════════════════════════════════════════════════════════════════╝
    `);

    process.exit(0);

  } catch (error) {
    console.error(`
╔══════════════════════════════════════════════════════════════════════╗
║                        ❌ MISSION FAILED                             ║
╚══════════════════════════════════════════════════════════════════════╝
    `);
    console.error(error);
    process.exit(1);
  }
}

main();

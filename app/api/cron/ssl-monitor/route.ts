import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface SSLCheckResult {
  domain: string;
  valid: boolean;
  expiresAt?: string;
  daysUntilExpiry?: number;
  issuer?: string;
  error?: string;
}

// Runs every 12 hours to monitor SSL certificate status
export async function GET() {
  const domains = ['www.pgclosets.com', 'pgclosets.com'];
  const results: SSLCheckResult[] = [];

  for (const domain of domains) {
    try {
      // Simple check - if we can connect via HTTPS, the cert is valid
      const response = await fetch(`https://${domain}`, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'PGClosets-SSL-Monitor/1.0',
        },
      });

      results.push({
        domain,
        valid: response.ok || response.status < 500,
        // Note: Edge runtime cannot access detailed cert info
        // For full cert monitoring, use a dedicated service
      });
    } catch (error) {
      results.push({
        domain,
        valid: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      });
    }
  }

  const allValid = results.every((r) => r.valid);

  console.log(`[SSL Monitor] Status: ${allValid ? 'ALL VALID' : 'ISSUES DETECTED'}`);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    status: allValid ? 'valid' : 'issues',
    results,
  });
}

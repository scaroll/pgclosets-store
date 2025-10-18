/**
 * Enhanced Health Check API Endpoint
 * Agent #49: Infrastructure Monitoring Specialist
 *
 * Provides comprehensive system health status for monitoring services
 * Compatible with UptimeRobot, Pingdom, Datadog, and similar tools
 */

import { type NextRequest, NextResponse } from "next/server";

// Temporarily disabled edge runtime due to Next.js 15 build issues
// export const runtime = "edge";
export const dynamic = "force-dynamic";

interface HealthCheckResult {
  status: "pass" | "warn" | "fail";
  message?: string;
  responseTime?: number;
  details?: Record<string, any>;
}

interface HealthCheck {
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  version: string;
  environment: string;
  deployment: string;
  region: string;
  checks: {
    application: HealthCheckResult;
    externalAPIs?: HealthCheckResult;
  };
}

/**
 * Check application health
 */
async function checkApplicationHealth(): Promise<HealthCheckResult> {
  const start = Date.now();

  try {
    // Basic application checks - Edge Runtime compatible
    const checks = {
      env: process.env.NODE_ENV || "development",
      deployment: process.env.VERCEL_ENV || "local",
      region: process.env.VERCEL_REGION || "local",
    };

    const responseTime = Date.now() - start;

    return {
      status: "pass",
      message: "Application is healthy",
      responseTime,
      details: {
        environment: checks.env,
        deployment: checks.deployment,
        region: checks.region,
      },
    };
  } catch (error) {
    return {
      status: "fail",
      message:
        error instanceof Error
          ? error.message
          : "Application health check failed",
    };
  }
}

/**
 * Check external API dependencies
 */
async function checkExternalAPIs(): Promise<HealthCheckResult> {
  const start = Date.now();

  try {
    // Check critical external dependencies with timeout
    const checkWithTimeout = async (
      url: string,
      timeout: number = 5000
    ): Promise<boolean> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        clearTimeout(timeoutId);
        return false;
      }
    };

    const checks = await Promise.allSettled([
      // Google Analytics
      checkWithTimeout("https://www.google-analytics.com/analytics.js"),
      // Google Tag Manager
      checkWithTimeout("https://www.googletagmanager.com/gtm.js"),
    ]);

    const passed = checks.filter((check) => {
      if (check.status === "fulfilled" && check.value === true) {
        return true;
      }
      return false;
    }).length;

    const failed = checks.length - passed;
    const responseTime = Date.now() - start;

    if (failed === 0) {
      return {
        status: "pass",
        message: "All external APIs accessible",
        responseTime,
        details: { totalChecks: checks.length, passedChecks: passed },
      };
    } else if (passed > 0) {
      return {
        status: "warn",
        message: "Some external APIs unreachable",
        responseTime,
        details: {
          totalChecks: checks.length,
          passedChecks: passed,
          failedChecks: failed,
        },
      };
    } else {
      return {
        status: "fail",
        message: "All external APIs unreachable",
        responseTime,
        details: { totalChecks: checks.length, failedChecks: failed },
      };
    }
  } catch (error) {
    return {
      status: "fail",
      message:
        error instanceof Error
          ? error.message
          : "External API health check failed",
    };
  }
}

/**
 * GET /api/health
 * Returns comprehensive health check status
 */
export async function GET(_request: NextRequest) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Run all health checks in parallel
    const [applicationHealth, externalAPIsHealth] = await Promise.all([
      checkApplicationHealth(),
      checkExternalAPIs(),
    ]);

    // Determine overall status
    const allChecks = [applicationHealth, externalAPIsHealth];

    let overallStatus: "healthy" | "degraded" | "critical";
    if (allChecks.some((check) => check.status === "fail")) {
      overallStatus = "critical";
    } else if (allChecks.some((check) => check.status === "warn")) {
      overallStatus = "degraded";
    } else {
      overallStatus = "healthy";
    }

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      deployment: process.env.VERCEL_ENV || "local",
      region: process.env.VERCEL_REGION || "local",
      checks: {
        application: applicationHealth,
        externalAPIs: externalAPIsHealth,
      },
    };

    const responseTime = Date.now() - startTime;

    // Return appropriate status code based on health
    const statusCode =
      overallStatus === "healthy"
        ? 200
        : overallStatus === "degraded"
          ? 200
          : 503;

    return NextResponse.json(healthCheck, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Response-Time": `${responseTime}ms`,
        "X-Health-Status": overallStatus,
      },
    });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "critical",
        timestamp,
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        deployment: process.env.VERCEL_ENV || "local",
        region: process.env.VERCEL_REGION || "local",
        error: error instanceof Error ? error.message : "Health check failed",
        checks: {},
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

/**
 * HEAD /api/health
 * Quick health check for monitoring services (minimal overhead)
 */
export async function HEAD(_request: NextRequest) {
  try {
    // Quick application check
    const appHealth = await checkApplicationHealth();

    const statusCode = appHealth.status === "pass" ? 200 : 503;

    return new NextResponse(null, {
      status: statusCode,
      headers: {
        "X-Health-Status": appHealth.status,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        "X-Health-Status": "fail",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }
}

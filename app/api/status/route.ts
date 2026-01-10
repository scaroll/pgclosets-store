// @ts-nocheck
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Changed to Node.js runtime for process APIs and os.loadavg()
export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const supabase = await createClient();

    // Test database connection
    const { data: _dbTest, error: dbError } = await supabase
      .from("products")
      .select("count")
      .limit(1);

    // Service status checks
    const status = {
      timestamp,
      status: "operational",
      services: {
        api: {
          status: "operational",
          responseTime: Date.now(),
        },
        database: {
          status: dbError ? "degraded" : "operational",
          error: dbError?.message || null,
          connection: !dbError,
        },
        environment: {
          node_env: process.env.NODE_ENV,
          vercel_env: process.env.VERCEL_ENV,
          region: process.env.VERCEL_REGION,
          deployment_url: process.env.VERCEL_URL,
        },
        features: {
          paddle_payments: !!process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
          supabase_connection: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          analytics: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        },
      },
      performance: {
        uptime: process.uptime(),
        memory: {
          used:
            Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
            100,
          total:
            Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
            100,
          usage_percent: Math.round(
            (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) *
              100
          ),
        },
        cpu: {
          load_average:
            process.platform !== "win32" ? require("os").loadavg() : [0, 0, 0],
        },
      },
    };

    // Calculate response time
    status.services.api.responseTime =
      Date.now() - status.services.api.responseTime;

    // Determine overall status
    const hasErrors = Object.values(status.services).some(
      (service) =>
        typeof service === "object" &&
        service !== null &&
        "status" in service &&
        (service as any).status !== "operational"
    );

    if (hasErrors) {
      status.status = "degraded";
    }

    return NextResponse.json(status, {
      status: hasErrors ? 503 : 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        services: {
          api: { status: "error" },
          database: { status: "unknown" },
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

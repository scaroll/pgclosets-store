import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
// Disabled route - required modules not available
// import { createClient } from "@/lib/supabase/server"
// import { createProtectedRoute, rateLimitConfigs } from "@/lib/validation/middleware"
// import type { MeasurementBookingData } from "@/lib/validation/schemas"
// import { measurementBookingSchema } from "@/lib/validation/schemas"
// import { sanitizeObject, sanitizationPresets } from "@/lib/validation/sanitization"

// Disabled - helper functions not available

// GET endpoint for checking availability
export function GET(_request: NextRequest) {
  // This route is disabled - measurement booking functionality not available
  return NextResponse.json(
    { error: "Measurement booking route is disabled" },
    { status: 503 }
  )
}

// POST endpoint for creating bookings
export function POST(_request: NextRequest) {
  // This route is disabled - measurement booking functionality not available
  return NextResponse.json(
    { error: "Measurement booking route is disabled" },
    { status: 503 }
  )
}

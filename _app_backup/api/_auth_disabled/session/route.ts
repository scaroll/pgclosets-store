import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
// Disabled route - auth modules not available
// import { SessionManager, CSRFProtection } from "@/lib/auth"

export async function GET(_request: NextRequest) {
  // This route is disabled - session functionality not available
  return NextResponse.json(
    { error: "Session route is disabled" },
    { status: 503 }
  )
}
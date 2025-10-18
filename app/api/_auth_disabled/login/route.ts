import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
// Disabled route - auth modules not available
// import { SessionManager, InputValidator, SecurityUtils, DEFAULT_ADMIN, CSRFProtection } from "@/lib/auth"

export async function POST(_request: NextRequest) {
  // This route is disabled - auth functionality not available
  return NextResponse.json(
    { error: "Authentication route is disabled" },
    { status: 503 }
  )
}
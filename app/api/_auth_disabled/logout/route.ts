import type { NextRequest} from "next/server";
import { NextResponse } from "next/server"
// Disabled route - auth modules not available
// import { SessionManager, SecurityUtils } from "@/lib/auth"

export function POST(_request: NextRequest) {
  // This route is disabled - auth functionality not available
  return NextResponse.json(
    { error: "Authentication route is disabled" },
    { status: 503 }
  )
}
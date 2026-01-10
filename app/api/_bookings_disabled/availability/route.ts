import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
// Disabled route - required modules not available
// import { PrismaClient } from '@prisma/client';
// import { startOfDay, endOfDay, addMinutes } from 'date-fns';
// import { getServiceBySlug } from '@/lib/services';

export function GET(_request: NextRequest) {
  // This route is disabled - booking availability functionality not available
  return NextResponse.json(
    { error: "Booking availability route is disabled" },
    { status: 503 }
  )
}
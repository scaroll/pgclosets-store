import { NextRequest, NextResponse } from 'next/server';

// Emergency deployment - simplified checkout API
export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Checkout service temporarily unavailable - emergency deployment',
      status: 'maintenance',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
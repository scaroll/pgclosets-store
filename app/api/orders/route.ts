import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Emergency deployment - simplified orders API
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Order service temporarily unavailable - emergency deployment',
      status: 'maintenance',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Order service temporarily unavailable - emergency deployment',
      status: 'maintenance',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
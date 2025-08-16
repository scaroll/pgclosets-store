import { NextRequest, NextResponse } from 'next/server'
import { ragService } from '@/lib/ai/rag'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // Rate limiting check (simple implementation)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    console.log(`Chat request from ${ip}: ${message.substring(0, 100)}...`)

    // Generate RAG response
    const ragResponse = await ragService.generateResponse(message, 1000)

    // Format response for chat interface
    const response = {
      message: ragResponse.answer,
      sources: ragResponse.sources,
      recommendations: ragResponse.recommendations,
      confidence: ragResponse.context.metadata.confidenceScore,
      timestamp: new Date().toISOString()
    }

    // Add CORS headers for frontend
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        message: 'Sorry, I encountered an error processing your request. Please try again or contact us directly for assistance.'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
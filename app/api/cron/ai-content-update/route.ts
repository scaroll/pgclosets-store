import { NextRequest, NextResponse } from 'next/server'
import { embeddingService } from '@/lib/ai/embeddings'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🤖 Starting AI content update...')

    // Refresh the embedding service content
    embeddingService.refreshContent()

    // Get updated content stats
    const allContent = embeddingService.getAllContent()
    const productCount = allContent.filter(c => 
      c.metadata.type === 'barn-door' || c.metadata.type === 'hardware'
    ).length
    const knowledgeCount = allContent.filter(c => 
      c.source === 'general-knowledge'
    ).length

    // Revalidate AI-related caches
    revalidateTag('ai-content')
    revalidateTag('embeddings')
    revalidateTag('chat')

    // Test the chat system with a sample query
    const testResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'What barn doors do you recommend?'
      })
    })

    const chatTest = testResponse.ok ? 'passed' : 'failed'

    const timestamp = new Date().toISOString()
    
    console.log('✅ AI content update completed at:', timestamp)
    console.log(`📊 Content stats: ${productCount} products, ${knowledgeCount} knowledge items`)
    console.log(`🧪 Chat system test: ${chatTest}`)

    return NextResponse.json({
      success: true,
      message: 'AI content update completed successfully',
      timestamp,
      stats: {
        totalContent: allContent.length,
        productContent: productCount,
        knowledgeContent: knowledgeCount
      },
      chatSystemTest: chatTest
    })

  } catch (error) {
    console.error('❌ AI content update failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update AI content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also allow POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
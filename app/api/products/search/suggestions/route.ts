import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// AI-powered suggestion generation
function generateAISuggestions(query: string): string[] {
  const suggestions: string[] = []
  const q = query.toLowerCase()

  // Category-based suggestions
  if (q.includes('barn')) {
    suggestions.push('Modern barn doors with soft-close')
    suggestions.push('Rustic barn doors for farmhouse style')
    suggestions.push('Glass panel barn doors')
  }

  if (q.includes('bifold') || q.includes('bi-fold')) {
    suggestions.push('Space-saving bifold closet doors')
    suggestions.push('Louvered bifold doors for ventilation')
    suggestions.push('Mirrored bifold doors')
  }

  if (q.includes('mirror')) {
    suggestions.push('Full-length mirror doors')
    suggestions.push('Mirror bypass closet doors')
    suggestions.push('Framed mirror sliding doors')
  }

  // Style-based suggestions
  if (q.includes('modern')) {
    suggestions.push('Modern glass doors with aluminum frames')
    suggestions.push('Contemporary sliding doors')
    suggestions.push('Minimalist panel doors')
  }

  if (q.includes('rustic') || q.includes('farmhouse')) {
    suggestions.push('Rustic wood barn doors')
    suggestions.push('Farmhouse style sliding doors')
    suggestions.push('Distressed wood doors')
  }

  // Space-based suggestions
  if (q.includes('small') || q.includes('space')) {
    suggestions.push('Space-saving bifold doors')
    suggestions.push('Sliding pocket doors')
    suggestions.push('Compact room dividers')
  }

  if (q.includes('bedroom') || q.includes('closet')) {
    suggestions.push('Bedroom closet sliding doors')
    suggestions.push('Walk-in closet doors')
    suggestions.push('Master bedroom door solutions')
  }

  if (q.includes('bathroom')) {
    suggestions.push('Frosted glass bathroom doors')
    suggestions.push('Moisture-resistant doors')
    suggestions.push('Privacy sliding doors')
  }

  // Material-based suggestions
  if (q.includes('glass')) {
    suggestions.push('Frosted glass doors for privacy')
    suggestions.push('Clear glass panel doors')
    suggestions.push('Tempered safety glass doors')
  }

  if (q.includes('wood')) {
    suggestions.push('Solid wood doors')
    suggestions.push('Wood composite doors')
    suggestions.push('Natural wood finish doors')
  }

  // Feature-based suggestions
  if (q.includes('quiet') || q.includes('soft')) {
    suggestions.push('Soft-close sliding doors')
    suggestions.push('Quiet glide barn doors')
    suggestions.push('Silent operation doors')
  }

  if (q.includes('custom') || q.includes('size')) {
    suggestions.push('Custom size doors available')
    suggestions.push('Made-to-measure sliding doors')
    suggestions.push('Adjustable door systems')
  }

  // Price-based suggestions
  if (q.includes('cheap') || q.includes('budget') || q.includes('affordable')) {
    suggestions.push('Budget-friendly door options')
    suggestions.push('Affordable closet doors under $300')
    suggestions.push('Value sliding door packages')
  }

  if (q.includes('premium') || q.includes('luxury')) {
    suggestions.push('Premium solid wood doors')
    suggestions.push('Luxury glass door systems')
    suggestions.push('High-end designer doors')
  }

  // Color-based suggestions
  if (q.includes('white')) {
    suggestions.push('Classic white panel doors')
    suggestions.push('White shaker style doors')
    suggestions.push('White painted sliding doors')
  }

  if (q.includes('black')) {
    suggestions.push('Black frame glass doors')
    suggestions.push('Matte black barn doors')
    suggestions.push('Black hardware door kits')
  }

  // If no specific matches, provide general suggestions
  if (suggestions.length === 0) {
    suggestions.push(`Best ${query} options available`)
    suggestions.push(`Popular ${query} styles`)
    suggestions.push(`${query} with free installation`)
  }

  // Return unique suggestions (max 5)
  return [...new Set(suggestions)].slice(0, 5)
}

// Get popular searches
function getPopularSearches(): string[] {
  return [
    'Barn doors',
    'Bifold closet doors',
    'Mirror sliding doors',
    'Room dividers',
    'Modern glass doors',
    'White panel doors',
    'Space-saving doors',
    'Custom size doors',
  ]
}

// Get trending searches
function getTrendingSearches(): string[] {
  return [
    'Soft-close barn doors',
    'Frosted glass doors',
    'Industrial style doors',
    'Japanese room dividers',
    'Smart home compatible doors',
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query = '' } = body

    // Generate AI suggestions based on query
    const aiSuggestions = query.length > 2 ? generateAISuggestions(query) : []

    // Get popular and trending searches if no query
    const popularSearches = query.length === 0 ? getPopularSearches() : []
    const trendingSearches = query.length === 0 ? getTrendingSearches() : []

    // Get recent searches from cookies (in production, use proper session management)
    const recentSearches: string[] = []

    return NextResponse.json({
      suggestions: aiSuggestions,
      popular: popularSearches,
      trending: trendingSearches,
      recent: recentSearches,
    })
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json(
      {
        suggestions: [],
        popular: [],
        trending: [],
        recent: [],
      },
      { status: 200 } // Return 200 with empty results instead of error
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''

  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  )
}

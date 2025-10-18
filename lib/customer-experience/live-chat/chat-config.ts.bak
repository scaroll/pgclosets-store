/**
 * AGENT #41: LIVE CHAT & SUPPORT SPECIALIST
 * Advanced Live Chat Configuration
 *
 * Features:
 * - Intercom-style live chat integration
 * - AI chatbot for common questions
 * - Support ticket system
 * - Knowledge base integration
 * - Business hours configuration
 * - Team routing and assignment
 * - Chat analytics and reporting
 * - Mobile chat optimization
 */

export interface BusinessHours {
  monday: { open: string; close: string; enabled: boolean }
  tuesday: { open: string; close: string; enabled: boolean }
  wednesday: { open: string; close: string; enabled: boolean }
  thursday: { open: string; close: string; enabled: boolean }
  friday: { open: string; close: string; enabled: boolean }
  saturday: { open: string; close: string; enabled: boolean }
  sunday: { open: string; close: string; enabled: boolean }
}

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: 'sales' | 'support' | 'design' | 'technical'
  skills: string[]
  availability: 'available' | 'busy' | 'offline'
  responseTime: number // average in minutes
}

export interface ChatbotIntent {
  intent: string
  patterns: string[]
  responses: string[]
  requiresHuman: boolean
  suggestedActions?: Array<{
    label: string
    action: string
    data?: any
  }>
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category: string
  keywords: string[]
  relatedArticles: string[]
  helpfulCount: number
}

export const BUSINESS_HOURS: BusinessHours = {
  monday: { open: '09:00', close: '18:00', enabled: true },
  tuesday: { open: '09:00', close: '18:00', enabled: true },
  wednesday: { open: '09:00', close: '18:00', enabled: true },
  thursday: { open: '09:00', close: '18:00', enabled: true },
  friday: { open: '09:00', close: '18:00', enabled: true },
  saturday: { open: '10:00', close: '16:00', enabled: true },
  sunday: { open: '00:00', close: '00:00', enabled: false }
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'sarah-m',
    name: 'Sarah Morrison',
    role: 'sales',
    skills: ['closet-systems', 'bypass-doors', 'quotes', 'pricing'],
    availability: 'available',
    responseTime: 2
  },
  {
    id: 'michael-c',
    name: 'Michael Chen',
    role: 'design',
    skills: ['custom-design', 'installation', 'measurements', 'consultations'],
    availability: 'available',
    responseTime: 3
  },
  {
    id: 'emma-r',
    name: 'Emma Rodriguez',
    role: 'support',
    skills: ['technical-support', 'warranty', 'returns', 'shipping'],
    availability: 'available',
    responseTime: 5
  },
  {
    id: 'james-t',
    name: 'James Thompson',
    role: 'technical',
    skills: ['installation', 'troubleshooting', 'repairs', 'adjustments'],
    availability: 'busy',
    responseTime: 10
  }
]

export const CHATBOT_INTENTS: ChatbotIntent[] = [
  {
    intent: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    responses: [
      "Hi! 👋 Welcome to PG Closets. I'm here to help with your closet and storage needs. What can I help you with today?",
      "Hello! Thanks for visiting PG Closets. How can I assist you with your project today?",
      "Hey there! 😊 I'm your virtual assistant. What would you like to know about our closet solutions?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Get a Quote', action: 'start_quote' },
      { label: 'Browse Products', action: 'view_products' },
      { label: 'Schedule Consultation', action: 'book_consultation' },
      { label: 'Ask Question', action: 'ask_question' }
    ]
  },
  {
    intent: 'pricing',
    patterns: ['price', 'cost', 'how much', 'pricing', 'rates', 'quote', 'estimate'],
    responses: [
      "Our bypass closet doors start at $299 for standard sizes. Custom sizes and premium designs are also available. Would you like a personalized quote for your specific needs?",
      "Pricing depends on size, style, and features. Standard bypass doors range from $299-$899, while custom walk-in systems start at $2,499. Shall I help you get an exact quote?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Get Custom Quote', action: 'start_quote' },
      { label: 'View Pricing Guide', action: 'open_kb', data: { article: 'pricing-guide' } },
      { label: 'See Product Options', action: 'view_products' }
    ]
  },
  {
    intent: 'installation',
    patterns: ['install', 'installation', 'installer', 'professional install', 'diy'],
    responses: [
      "We offer professional installation throughout Ottawa and surrounding areas. Our experienced installers ensure perfect fit and finish. Installation typically takes 2-4 hours depending on the project size. Would you like to add installation to your quote?",
      "Great question! We provide both DIY options and professional installation. Our installation service includes measurement verification, expert installation, and a 1-year workmanship guarantee. Interested in learning more?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Add Installation', action: 'add_installation' },
      { label: 'Installation FAQ', action: 'open_kb', data: { article: 'installation-faq' } },
      { label: 'Book Consultation', action: 'book_consultation' }
    ]
  },
  {
    intent: 'shipping_delivery',
    patterns: ['shipping', 'delivery', 'ship', 'deliver', 'freight', 'when will i get'],
    responses: [
      "We offer FREE shipping and delivery throughout the Ottawa area! 🚚 Standard delivery takes 2-3 weeks from order confirmation. Rush delivery is available for an additional fee. Where are you located?",
      "Delivery is included at no extra cost for Ottawa and surrounding areas. Orders typically ship within 2-3 weeks. We'll contact you to schedule a convenient delivery time."
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Check Delivery Area', action: 'check_delivery' },
      { label: 'Rush Delivery Info', action: 'open_kb', data: { article: 'rush-delivery' } }
    ]
  },
  {
    intent: 'measurements',
    patterns: ['measure', 'measurement', 'size', 'dimensions', 'how to measure', 'what size'],
    responses: [
      "Accurate measurements are crucial for a perfect fit! We recommend scheduling a FREE online quote where our experts take precise measurements. Alternatively, I can send you our measurement guide. Which would you prefer?",
      "We offer FREE professional measurements as part of our online quote service. This ensures perfect fit and avoids costly mistakes. Would you like to schedule a measurement consultation?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Schedule Measurement', action: 'book_consultation' },
      { label: 'Measurement Guide', action: 'open_kb', data: { article: 'measurement-guide' } },
      { label: 'Get Quote', action: 'start_quote' }
    ]
  },
  {
    intent: 'products',
    patterns: ['products', 'types', 'styles', 'options', 'what do you have', 'show me'],
    responses: [
      "We specialize in premium closet solutions including:\n\n• Bypass Closet Doors\n• Bi-Fold Doors\n• French Doors\n• Walk-In Closet Systems\n• Pantry Organization\n• Custom Hardware\n\nWhat type of solution are you looking for?",
      "Great! We offer a wide range of closet and storage solutions. Our most popular products are bypass doors and custom walk-in systems. Would you like to browse our catalog or get recommendations based on your needs?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Browse Catalog', action: 'view_products' },
      { label: 'Get Recommendations', action: 'product_quiz' },
      { label: 'Popular Products', action: 'view_popular' }
    ]
  },
  {
    intent: 'custom_design',
    patterns: ['custom', 'customize', 'personalized', 'design service', 'design help'],
    responses: [
      "Absolutely! We offer FREE custom design consultations. Our design experts will help you create the perfect solution for your space, style, and budget. Would you like to schedule a consultation?",
      "We love creating custom solutions! 🎨 Our design team can work with you to create something truly unique. We'll provide 3D renderings and help you choose the perfect style, finish, and features."
    ],
    requiresHuman: true,
    suggestedActions: [
      { label: 'Book Design Consultation', action: 'book_consultation', data: { type: 'design' } },
      { label: 'View Custom Examples', action: 'view_gallery' },
      { label: 'Talk to Designer', action: 'connect_human', data: { department: 'design' } }
    ]
  },
  {
    intent: 'warranty',
    patterns: ['warranty', 'guarantee', 'return', 'refund', 'defect', 'broken'],
    responses: [
      "All our products come with a comprehensive warranty:\n\n• Lifetime warranty on hardware\n• 5-year warranty on finishes\n• 1-year installation guarantee\n• 30-day satisfaction guarantee\n\nWould you like more details about our warranty coverage?",
      "We stand behind our products! Our warranty covers manufacturing defects, finish issues, and installation workmanship. Is there a specific concern I can help address?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Warranty Details', action: 'open_kb', data: { article: 'warranty-info' } },
      { label: 'File Claim', action: 'open_ticket', data: { type: 'warranty' } },
      { label: 'Talk to Support', action: 'connect_human', data: { department: 'support' } }
    ]
  },
  {
    intent: 'business_hours',
    patterns: ['hours', 'open', 'closed', 'when are you open', 'business hours', 'schedule'],
    responses: [
      "Our business hours are:\n\n🕐 Mon-Fri: 9am - 6pm\n🕐 Saturday: 10am - 4pm\n🕐 Sunday: Closed\n\nOnline quotes are available 24/7! Would you like to schedule a consultation or browse our products?",
      "We're here to help! Our showroom and phones are open Mon-Fri 9am-6pm and Sat 10am-4pm. You can request quotes online anytime. What can I help you with today?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Schedule Call', action: 'book_consultation' },
      { label: 'Get Quote Now', action: 'start_quote' },
      { label: 'Visit Showroom', action: 'open_kb', data: { article: 'showroom-visit' } }
    ]
  },
  {
    intent: 'complaint',
    patterns: ['complaint', 'unhappy', 'disappointed', 'problem', 'issue', 'not satisfied'],
    responses: [
      "I'm sorry to hear you're experiencing an issue. Your satisfaction is our top priority. Let me connect you with a senior support specialist who can help resolve this right away.",
      "I apologize for any inconvenience. I want to make sure we address your concerns properly. Let me get you in touch with our customer care team immediately."
    ],
    requiresHuman: true,
    suggestedActions: [
      { label: 'Connect to Manager', action: 'connect_human', data: { department: 'support', priority: 'high' } },
      { label: 'File Formal Complaint', action: 'open_ticket', data: { type: 'complaint', priority: 'high' } }
    ]
  },
  {
    intent: 'appointment',
    patterns: ['appointment', 'consultation', 'meeting', 'schedule', 'book', 'visit'],
    responses: [
      "Perfect! I can help you schedule a FREE consultation. We offer:\n\n📞 Phone consultations\n🎥 Virtual consultations\n🏠 online quote\n\nWhich would work best for you?",
      "Great! Let's get you scheduled. Our consultations are completely free and include measurements, design advice, and a detailed quote. When works best for you?"
    ],
    requiresHuman: false,
    suggestedActions: [
      { label: 'Book Now', action: 'book_consultation' },
      { label: 'View Available Times', action: 'check_availability' },
      { label: 'Call Instead', action: 'show_phone' }
    ]
  }
]

export const KNOWLEDGE_BASE: KnowledgeBaseArticle[] = [
  {
    id: 'pricing-guide',
    title: 'Complete Pricing Guide',
    content: `
# PG Closets Pricing Guide

## Bypass Closet Doors
- Standard (60"-72" width): $299 - $499
- Custom sizes: $499 - $899
- Premium designs: $699 - $1,299

## Walk-In Closet Systems
- Basic system (6-8ft): $2,499 - $3,999
- Mid-range system (10-12ft): $4,999 - $7,499
- Luxury system (14ft+): $8,999 - $15,000+

## Installation Services
- Basic door installation: $199 - $399
- Complex installation: $499 - $799
- Full system installation: $999 - $2,499

## Add-Ons
- Premium hardware: $99 - $299
- Soft-close mechanism: $79 per door
- Custom finishes: 15-30% premium
    `,
    category: 'Pricing',
    keywords: ['price', 'cost', 'pricing', 'rates', 'quote'],
    relatedArticles: ['installation-faq', 'product-comparison'],
    helpfulCount: 0
  },
  {
    id: 'installation-faq',
    title: 'Installation FAQ',
    content: `
# Installation Frequently Asked Questions

## Do you offer professional installation?
Yes! We provide professional installation throughout Ottawa and surrounding areas.

## How long does installation take?
- Single bypass door: 2-3 hours
- Multiple doors: 4-6 hours
- Full walk-in system: 6-8 hours (may require 2 days)

## What's included in installation?
- Measurement verification
- Complete installation
- Cleanup and disposal
- Final adjustments
- 1-year workmanship warranty

## Can I install it myself?
Yes! Many of our products are DIY-friendly. We provide detailed instructions and video tutorials.
    `,
    category: 'Installation',
    keywords: ['install', 'installation', 'diy', 'professional'],
    relatedArticles: ['measurement-guide', 'warranty-info'],
    helpfulCount: 0
  },
  {
    id: 'measurement-guide',
    title: 'How to Measure for Closet Doors',
    content: `
# Measurement Guide

## Required Tools
- Measuring tape
- Level
- Pencil and paper

## Bypass Doors
1. Measure the width of the opening at three points (top, middle, bottom)
2. Use the smallest measurement
3. Measure the height from floor to header
4. Note any obstructions or trim

## Walk-In Systems
1. Measure wall length and height
2. Note locations of electrical outlets, switches, and vents
3. Measure door openings and windows
4. Document any angled walls or unusual features

## Pro Tip
Schedule a FREE professional measurement for 100% accuracy!
    `,
    category: 'Guides',
    keywords: ['measure', 'measurement', 'size', 'dimensions'],
    relatedArticles: ['installation-faq', 'product-selection'],
    helpfulCount: 0
  }
]

export function isBusinessHoursOpen(): boolean {
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' }) as keyof BusinessHours
  const hours = BUSINESS_HOURS[day]

  if (!hours.enabled) return false

  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [openHour, openMin] = hours.open.split(':').map(Number)
  const [closeHour, closeMin] = hours.close.split(':').map(Number)
  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin

  return currentTime >= openTime && currentTime < closeTime
}

export function getNextAvailableAgent(skill?: string): TeamMember | null {
  const availableAgents = TEAM_MEMBERS.filter(agent =>
    agent.availability === 'available' &&
    (!skill || agent.skills.includes(skill))
  ).sort((a, b) => a.responseTime - b.responseTime)

  return availableAgents[0] || null
}

export function getBotResponse(userMessage: string): {
  intent: ChatbotIntent | null
  response: string
  actions: ChatbotIntent['suggestedActions']
} {
  const message = userMessage.toLowerCase()

  // Find matching intent
  const matchedIntent = CHATBOT_INTENTS.find(intent =>
    intent.patterns.some(pattern => message.includes(pattern.toLowerCase()))
  )

  if (!matchedIntent) {
    return {
      intent: null,
      response: "I'm not sure I understand. Would you like to speak with one of our specialists? They can help with any questions you have!",
      actions: [
        { label: 'Talk to Specialist', action: 'connect_human' },
        { label: 'Browse Knowledge Base', action: 'open_kb' },
        { label: 'Start Over', action: 'restart' }
      ]
    }
  }

  // Random response from intent
  const response = matchedIntent.responses[
    Math.floor(Math.random() * matchedIntent.responses.length)
  ]

  return {
    intent: matchedIntent,
    response,
    actions: matchedIntent.suggestedActions || []
  }
}

export function searchKnowledgeBase(query: string): KnowledgeBaseArticle[] {
  const searchTerms = query.toLowerCase().split(' ')

  return KNOWLEDGE_BASE.filter(article =>
    searchTerms.some(term =>
      article.title.toLowerCase().includes(term) ||
      article.keywords.some(keyword => keyword.includes(term)) ||
      article.content.toLowerCase().includes(term)
    )
  ).slice(0, 5)
}

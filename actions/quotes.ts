'use server'

import { prisma } from '@/lib/db/client'
import { sendQuoteEmails } from '@/lib/email/send-quote-email'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Zod schemas for validation
export const quoteItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive().default(1),
  price: z.number().int().min(0).optional(),
  category: z.string().optional(),
  options: z.record(z.string().or(z.number())).optional(),
})

export const submitQuoteSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  province: z.string().optional(),
  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
  items: z.array(quoteItemSchema).min(1, 'At least one item is required'),
})

export type QuoteItem = z.infer<typeof quoteItemSchema>
export type SubmitQuoteInput = z.infer<typeof submitQuoteSchema>

export type QuoteActionResult = {
  success: boolean
  quoteId?: string
  quoteNumber?: string
  error?: string
  details?: string[]
}

/**
 * Generate a unique quote number
 */
async function generateQuoteNumber(): Promise<string> {
  const prefix = 'QT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Submit a new quote request
 * Server Action for handling quote submissions
 */
export async function submitQuote(
  data: SubmitQuoteInput
): Promise<QuoteActionResult> {
  try {
    // Validate input
    const validatedData = submitQuoteSchema.safeParse(data)

    if (!validatedData.success) {
      const errors = validatedData.error.errors.map((e) => e.message)
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        details: errors,
      }
    }

    const { customerName, email, phone, province, notes, items } = validatedData.data

    // Get optional user session
    const session = await auth()
    const userId = session?.user?.id

    // Calculate estimated total
    const total = items.reduce((sum, item) => {
      const itemPrice = item.price || 0
      return sum + itemPrice * item.quantity
    }, 0)

    // Generate quote number
    const quoteNumber = await generateQuoteNumber()

    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        userId,
        customerName,
        email,
        phone,
        province,
        items,
        total,
        notes,
        status: 'pending',
      },
    })

    // Send email notifications (non-blocking)
    const emailData = {
      customer: {
        name: customerName,
        email,
        phone,
        province,
      },
      quote: {
        quoteNumber,
        receivedAt: quote.createdAt.toISOString(),
      },
      product: items.length === 1
        ? {
            name: items[0].name,
            category: items[0].category,
            price: items[0].price ? items[0].price / 100 : undefined,
            selectedOptions: items[0].options,
          }
        : undefined,
      notes,
    }

    // Send emails in background, don't wait for success
    sendQuoteEmails(emailData).catch((error) => {
      console.error('[QUOTE] Failed to send email notifications:', error)
    })

    // Revalidate quote page
    revalidatePath('/quote')

    return {
      success: true,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
    }
  } catch (error) {
    console.error('[QUOTE] Error submitting quote:', error)

    // Return user-safe error message
    return {
      success: false,
      error: 'Unable to submit your quote request. Please try again later.',
      details: ['An unexpected error occurred. Our team has been notified.'],
    }
  }
}

/**
 * Get a quote by ID
 * Server Action for retrieving quote details
 */
export async function getQuote(id: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      return {
        success: false,
        error: 'Quote not found',
      }
    }

    // Check authorization - only the quote owner or admin can view
    const session = await auth()
    const isOwner = session?.user?.id === quote.userId || session?.user?.email === quote.email
    const isAdmin = session?.user?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: 'You do not have permission to view this quote',
      }
    }

    return {
      success: true,
      quote,
    }
  } catch (error) {
    console.error('[QUOTE] Error retrieving quote:', error)
    return {
      success: false,
      error: 'Unable to retrieve quote. Please try again later.',
    }
  }
}

/**
 * List quotes for a customer
 * Server Action for retrieving customer quotes
 */
export async function listQuotes(email?: string) {
  try {
    const session = await auth()

    // If no email provided, use session email
    const queryEmail = email || session?.user?.email

    if (!queryEmail) {
      return {
        success: false,
        error: 'Email is required to retrieve quotes',
        quotes: [],
      }
    }

    // Authorization check - users can only see their own quotes
    if (queryEmail !== session?.user?.email && session?.user?.role !== 'admin') {
      return {
        success: false,
        error: 'You do not have permission to view these quotes',
        quotes: [],
      }
    }

    const quotes = await prisma.quote.findMany({
      where: { email: queryEmail },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 quotes
    })

    return {
      success: true,
      quotes,
    }
  } catch (error) {
    console.error('[QUOTE] Error listing quotes:', error)
    return {
      success: false,
      error: 'Unable to retrieve quotes. Please try again later.',
      quotes: [],
    }
  }
}

/**
 * Update quote status (admin only)
 * Server Action for updating quote status
 */
export async function updateQuoteStatus(
  id: string,
  status: 'pending' | 'contacted' | 'quoted' | 'converted' | 'cancelled',
  internalNotes?: string
) {
  try {
    const session = await auth()

    // Only admins can update quote status
    if (session?.user?.role !== 'admin') {
      return {
        success: false,
        error: 'You do not have permission to update quote status',
      }
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status,
        ...(internalNotes && { internalNotes }),
      },
    })

    revalidatePath('/admin/quotes')

    return {
      success: true,
      quote,
    }
  } catch (error) {
    console.error('[QUOTE] Error updating quote status:', error)
    return {
      success: false,
      error: 'Unable to update quote. Please try again later.',
    }
  }
}

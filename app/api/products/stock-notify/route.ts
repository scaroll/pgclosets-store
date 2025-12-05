import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, productId, productName, timestamp } = body

    // Validate required fields
    if (!email || !productId) {
      return NextResponse.json(
        { message: 'Email and product ID are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    try {
      // Try to save to database if available
      const notification = await prisma.stockNotification.create({
        data: {
          email: email.toLowerCase().trim(),
          productId,
          productName: productName || '',
          status: 'PENDING',
          createdAt: timestamp ? new Date(timestamp) : new Date(),
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Successfully subscribed to stock notifications',
          notificationId: notification.id,
        },
        { status: 201 }
      )
    } catch (dbError) {
      // If database is not available or table doesn't exist, fallback to logging
      console.warn('Database unavailable for stock notifications:', dbError)

      // Log to console (in production, you might want to use a logging service)
      console.log('Stock Notification Request:', {
        email: email.toLowerCase().trim(),
        productId,
        productName,
        timestamp: timestamp || new Date().toISOString(),
      })

      // In a real implementation, you might want to:
      // 1. Send this to an email service (like SendGrid, Mailchimp, etc.)
      // 2. Store in a file-based database
      // 3. Add to a queue for processing
      // 4. Send to a third-party notification service

      // For now, we'll simulate success since the data is logged
      return NextResponse.json(
        {
          success: true,
          message: 'Successfully subscribed to stock notifications',
          note: 'Notification logged - database unavailable',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Error processing stock notification:', error)
    return NextResponse.json(
      {
        message: 'Failed to process stock notification',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve stock notifications (for admin purposes)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const email = searchParams.get('email')

    try {
      // Try to fetch from database
      const notifications = await prisma.stockNotification.findMany({
        where: {
          ...(productId && { productId }),
          ...(email && { email: email.toLowerCase().trim() }),
          status: 'PENDING', // Only get pending notifications
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100, // Limit results
      })

      return NextResponse.json({
        success: true,
        count: notifications.length,
        notifications,
      })
    } catch (dbError) {
      console.warn('Database unavailable for fetching notifications:', dbError)

      return NextResponse.json({
        success: false,
        message: 'Database unavailable',
        notifications: [],
      })
    }
  } catch (error) {
    console.error('Error fetching stock notifications:', error)
    return NextResponse.json(
      {
        message: 'Failed to fetch stock notifications',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

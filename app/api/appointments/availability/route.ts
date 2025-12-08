/**
 * Appointment Availability API
 * Get available time slots for scheduling
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM
  slotDuration: 120, // 2 hours per appointment
  bufferTime: 30, // 30 min buffer between appointments
}

// Days of week (0 = Sunday, 6 = Saturday)
const WORKING_DAYS = [1, 2, 3, 4, 5] // Monday to Friday

interface TimeSlot {
  time: string
  available: boolean
  reason?: string
}

function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const dayOfWeek = date.getDay()

  // Check if it's a working day
  if (!WORKING_DAYS.includes(dayOfWeek)) {
    return []
  }

  // Generate slots
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour += 2) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`
    const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`

    slots.push({
      time: `${startTime}-${endTime}`,
      available: true
    })
  }

  return slots
}

/**
 * GET /api/appointments/availability
 * Get available time slots for a date range
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const type = searchParams.get('type') || 'MEASUREMENT'
    const postalCode = searchParams.get('postalCode')

    if (!startDateStr) {
      return NextResponse.json(
        { success: false, error: 'startDate is required' },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateStr)
    const endDate = endDateStr ? new Date(endDateStr) : new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000) // Default 2 weeks

    // Get existing appointments in the date range
    const existingAppointments = await prisma.quoteAppointment.findMany({
      where: {
        scheduledDate: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        },
        type: type as any
      },
      select: {
        scheduledDate: true,
        scheduledTime: true,
        duration: true
      }
    })

    // Build a map of booked slots
    const bookedSlots = new Map<string, Set<string>>()
    existingAppointments.forEach(apt => {
      const dateKey = apt.scheduledDate.toISOString().split('T')[0]
      if (!bookedSlots.has(dateKey)) {
        bookedSlots.set(dateKey, new Set())
      }
      bookedSlots.get(dateKey)!.add(apt.scheduledTime)
    })

    // Generate availability for each day
    const availability: { date: string; slots: TimeSlot[] }[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]
      const baseSlots = generateTimeSlots(currentDate)
      const bookedForDay = bookedSlots.get(dateKey) || new Set()

      // Check if date is in the past
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const isPast = currentDate < today

      const slots = baseSlots.map(slot => {
        if (isPast) {
          return { ...slot, available: false, reason: 'Date has passed' }
        }
        if (bookedForDay.has(slot.time)) {
          return { ...slot, available: false, reason: 'Already booked' }
        }
        return slot
      })

      if (slots.length > 0) {
        availability.push({
          date: dateKey,
          slots
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({
      success: true,
      data: {
        availability,
        businessHours: BUSINESS_HOURS,
        workingDays: WORKING_DAYS
      }
    })

  } catch (error) {
    console.error('[GET /api/appointments/availability] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

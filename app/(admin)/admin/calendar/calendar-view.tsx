'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Appointment {
  id: string
  type: string
  status: string
  scheduledDate: Date
  scheduledTime: string
  quote: {
    quoteNumber: string
    customerName: string
  }
}

interface CalendarViewProps {
  appointments: Appointment[]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    MEASUREMENT: 'bg-purple-500',
    INSTALLATION: 'bg-emerald-500',
    FOLLOW_UP: 'bg-orange-500'
  }
  return colors[type] || 'bg-gray-500'
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDay = firstDayOfMonth.getDay()

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    const date = new Date(year, month, day)
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledDate)
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      )
    })
  }

  // Generate calendar grid
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Check if a day is today
  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {MONTHS[month]} {year}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[100px]" />
            }

            const dayAppointments = getAppointmentsForDay(day)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 border rounded-lg ${
                  isCurrentDay ? 'bg-primary/5 border-primary' : 'bg-muted/30'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-primary' : ''
                }`}>
                  {day}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      className={`text-xs p-1 rounded text-white truncate ${getTypeColor(apt.type)}`}
                      title={`${apt.quote.customerName} - ${apt.scheduledTime}`}
                    >
                      {apt.scheduledTime.split('-')[0]} {apt.quote.customerName.split(' ')[0]}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Legend:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-sm">Measurement</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-sm">Installation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-sm">Follow-up</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

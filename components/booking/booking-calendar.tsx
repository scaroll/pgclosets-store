'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as React from 'react'

export function BookingCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [time, setTime] = React.useState<string | undefined>()

  const handleBook = () => {
    if (!date || !time) return
    alert(`Booking requested for ${date.toDateString()} at ${time}`)
    // In real app: POST to API
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Book Your Consultation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-md border p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            disabled={date => date < new Date() || date.getDay() === 0} // Disable past & Sundays
          />
        </div>

        <Select onValueChange={setTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="09:00">9:00 AM</SelectItem>
            <SelectItem value="10:00">10:00 AM</SelectItem>
            <SelectItem value="11:00">11:00 AM</SelectItem>
            <SelectItem value="13:00">1:00 PM</SelectItem>
            <SelectItem value="14:00">2:00 PM</SelectItem>
            <SelectItem value="15:00">3:00 PM</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleBook} disabled={!date || !time}>
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  )
}

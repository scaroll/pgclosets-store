import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarView } from './calendar-view'

async function getAppointments() {
  // Get appointments for the next 30 days
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30)

  const appointments = await prisma.quoteAppointment.findMany({
    where: {
      scheduledDate: {
        gte: startDate,
        lte: endDate
      },
      status: {
        in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
      }
    },
    orderBy: { scheduledDate: 'asc' },
    include: {
      quote: {
        select: {
          id: true,
          quoteNumber: true,
          customerName: true,
          customerPhone: true,
          propertyAddress: true
        }
      },
      assignedTech: {
        select: { id: true, name: true }
      }
    }
  })

  // Get today's appointments
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.scheduledDate)
    return aptDate >= todayStart && aptDate <= todayEnd
  })

  // Get this week's appointments
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.scheduledDate)
    return aptDate >= todayStart && aptDate <= weekEnd
  })

  return {
    allAppointments: appointments,
    todayAppointments,
    weekAppointments,
    measurementCount: appointments.filter(a => a.type === 'MEASUREMENT').length,
    installationCount: appointments.filter(a => a.type === 'INSTALLATION').length
  }
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    MEASUREMENT: 'bg-purple-100 text-purple-800',
    INSTALLATION: 'bg-emerald-100 text-emerald-800',
    FOLLOW_UP: 'bg-orange-100 text-orange-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export default async function AdminCalendarPage() {
  const data = await getAppointments()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Manage appointments and schedules</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data.todayAppointments.length}</div>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data.weekAppointments.length}</div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data.measurementCount}</div>
            <p className="text-sm text-muted-foreground">Measurements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data.installationCount}</div>
            <p className="text-sm text-muted-foreground">Installations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-CA', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.todayAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No appointments today
              </p>
            ) : (
              <div className="space-y-4">
                {data.todayAppointments.map((apt) => {
                  const address = apt.quote.propertyAddress as any
                  return (
                    <div key={apt.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getTypeColor(apt.type)}>
                          {apt.type}
                        </Badge>
                        <span className="text-sm font-medium">{apt.scheduledTime}</span>
                      </div>
                      <p className="font-medium">{apt.quote.customerName}</p>
                      <p className="text-sm text-muted-foreground">{apt.quote.quoteNumber}</p>
                      {address && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.line1}, {address.city}
                        </p>
                      )}
                      {apt.assignedTech && (
                        <p className="text-sm mt-2">
                          Tech: {apt.assignedTech.name}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {data.allAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No upcoming appointments
              </p>
            ) : (
              <div className="space-y-3">
                {data.allAppointments.slice(0, 10).map((apt) => {
                  const address = apt.quote.propertyAddress as any
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-medium">
                            {new Date(apt.scheduledDate).toLocaleDateString('en-CA', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {apt.scheduledTime.split('-')[0]}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getTypeColor(apt.type)} variant="secondary">
                              {apt.type}
                            </Badge>
                            <Badge className={getStatusColor(apt.status)} variant="secondary">
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="font-medium">{apt.quote.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.quote.quoteNumber}
                            {address && ` • ${address.city}`}
                          </p>
                        </div>
                      </div>
                      {apt.assignedTech && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Assigned to</p>
                          <p className="font-medium">{apt.assignedTech.name}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar View Component */}
      <CalendarView appointments={data.allAppointments} />
    </div>
  )
}

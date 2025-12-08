import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

async function getUserData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      quotes: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          quoteNumber: true,
          status: true,
          total: true,
          createdAt: true
        }
      },
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  })

  // Also get quotes by email if user has any
  const quotesByEmail = await prisma.quote.findMany({
    where: {
      customerEmail: email,
      customerId: null
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      quoteNumber: true,
      status: true,
      total: true,
      createdAt: true
    }
  })

  const allQuotes = [...(user?.quotes || []), ...quotesByEmail]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const upcomingAppointments = await prisma.quoteAppointment.findMany({
    where: {
      quote: {
        OR: [
          { customerId: user?.id },
          { customerEmail: email }
        ]
      },
      scheduledDate: { gte: new Date() },
      status: { in: ['SCHEDULED', 'CONFIRMED'] }
    },
    orderBy: { scheduledDate: 'asc' },
    take: 2,
    include: {
      quote: {
        select: { quoteNumber: true }
      }
    }
  })

  return {
    user,
    quotes: allQuotes,
    upcomingAppointments
  }
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    QUOTED: 'bg-green-100 text-green-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const { user, quotes, upcomingAppointments } = await getUserData(session.user.email)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h2>
        <p className="text-muted-foreground">Here&apos;s an overview of your account</p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/quote-builder">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Start New Quote</h3>
                  <p className="text-sm text-muted-foreground">Configure custom doors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/book-measure">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Book Measurement</h3>
                  <p className="text-sm text-muted-foreground">Schedule a free consultation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Quotes</CardTitle>
              <CardDescription>Your latest quote requests</CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/account/quotes">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quotes yet</p>
              <Button asChild>
                <Link href="/quote-builder">Create Your First Quote</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/account/quotes/${quote.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{quote.quoteNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="font-medium">
                      ${Number(quote.total).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{apt.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {apt.quote.quoteNumber}
                      </span>
                    </div>
                    <p className="font-medium mt-1">
                      {new Date(apt.scheduledDate).toLocaleDateString('en-CA', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{apt.scheduledTime}</p>
                  </div>
                  <Badge>{apt.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

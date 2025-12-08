import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

async function getUserQuotes(email: string, status?: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })

  const where: any = {
    OR: [
      { customerId: user?.id },
      { customerEmail: email }
    ]
  }

  if (status && status !== 'all') {
    if (status === 'active') {
      where.status = {
        in: ['SUBMITTED', 'UNDER_REVIEW', 'MEASUREMENT_SCHEDULED', 'MEASUREMENT_COMPLETED', 'QUOTED', 'REVISION_REQUESTED', 'APPROVED', 'DEPOSIT_PAID', 'IN_PRODUCTION', 'READY_FOR_INSTALL', 'INSTALLATION_SCHEDULED']
      }
    } else if (status === 'completed') {
      where.status = { in: ['INSTALLED', 'COMPLETED'] }
    } else if (status === 'cancelled') {
      where.status = { in: ['CANCELLED', 'EXPIRED'] }
    }
  }

  const quotes = await prisma.quote.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      configurations: true,
      appointments: {
        where: {
          scheduledDate: { gte: new Date() },
          status: { in: ['SCHEDULED', 'CONFIRMED'] }
        },
        orderBy: { scheduledDate: 'asc' },
        take: 1
      }
    }
  })

  return quotes
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    MEASUREMENT_SCHEDULED: 'bg-purple-100 text-purple-800',
    MEASUREMENT_COMPLETED: 'bg-indigo-100 text-indigo-800',
    QUOTED: 'bg-green-100 text-green-800',
    REVISION_REQUESTED: 'bg-orange-100 text-orange-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    DEPOSIT_PAID: 'bg-teal-100 text-teal-800',
    IN_PRODUCTION: 'bg-cyan-100 text-cyan-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    SUBMITTED: 'We\'ve received your quote and will review it shortly',
    UNDER_REVIEW: 'Our team is reviewing your request',
    MEASUREMENT_SCHEDULED: 'A measurement appointment has been scheduled',
    MEASUREMENT_COMPLETED: 'We\'re preparing your formal quote',
    QUOTED: 'Your formal quote is ready for review',
    REVISION_REQUESTED: 'We\'re working on your requested changes',
    APPROVED: 'Quote approved - awaiting deposit',
    DEPOSIT_PAID: 'Order confirmed - in production queue',
    IN_PRODUCTION: 'Your doors are being manufactured',
    READY_FOR_INSTALL: 'Ready for installation scheduling',
    INSTALLATION_SCHEDULED: 'Installation appointment confirmed',
    INSTALLED: 'Installation complete - final payment due',
    COMPLETED: 'Order complete! Thank you for choosing PG Closets',
    CANCELLED: 'This quote has been cancelled',
    EXPIRED: 'This quote has expired'
  }
  return descriptions[status] || ''
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AccountQuotesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const params = await searchParams
  const quotes = await getUserQuotes(session.user.email, params.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Quotes</h2>
          <p className="text-muted-foreground">View and manage your quote requests</p>
        </div>
        <Button asChild>
          <Link href="/quote-builder">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Tabs defaultValue={params.status || 'all'}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/account/quotes">All</Link>
          </TabsTrigger>
          <TabsTrigger value="active" asChild>
            <Link href="/account/quotes?status=active">Active</Link>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <Link href="/account/quotes?status=completed">Completed</Link>
          </TabsTrigger>
          <TabsTrigger value="cancelled" asChild>
            <Link href="/account/quotes?status=cancelled">Cancelled</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quote List */}
      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {params.status
                ? `No ${params.status} quotes found`
                : 'You haven\'t created any quotes yet'}
            </p>
            <Button asChild>
              <Link href="/quote-builder">Create Your First Quote</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Link key={quote.id} href={`/account/quotes/${quote.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-medium">{quote.quoteNumber}</span>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {getStatusDescription(quote.status)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {quote.configurations.length} configuration(s) •
                        Created {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                      {quote.appointments[0] && (
                        <p className="text-sm text-primary mt-2">
                          Next appointment: {new Date(quote.appointments[0].scheduledDate).toLocaleDateString()} at {quote.appointments[0].scheduledTime}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${Number(quote.total).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Estimated total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

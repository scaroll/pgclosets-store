import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Status groups for tabs
const STATUS_GROUPS = {
  all: [],
  new: ['SUBMITTED', 'UNDER_REVIEW'],
  measurement: ['MEASUREMENT_SCHEDULED', 'MEASUREMENT_COMPLETED'],
  quoted: ['QUOTED', 'REVISION_REQUESTED'],
  active: ['APPROVED', 'DEPOSIT_PAID', 'IN_PRODUCTION', 'READY_FOR_INSTALL', 'INSTALLATION_SCHEDULED'],
  completed: ['INSTALLED', 'COMPLETED'],
  cancelled: ['CANCELLED', 'EXPIRED']
}

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}

async function getQuotes(status?: string, search?: string, page: number = 1) {
  const where: any = {}

  if (status && status !== 'all') {
    const statuses = STATUS_GROUPS[status as keyof typeof STATUS_GROUPS]
    if (statuses?.length > 0) {
      where.status = { in: statuses }
    }
  }

  if (search) {
    where.OR = [
      { quoteNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        configurations: true,
        assignedRep: {
          select: { id: true, name: true }
        },
        appointments: {
          where: {
            scheduledDate: { gte: new Date() }
          },
          orderBy: { scheduledDate: 'asc' },
          take: 1
        }
      }
    }),
    prisma.quote.count({ where })
  ])

  // Get counts per status group
  const counts = await Promise.all(
    Object.entries(STATUS_GROUPS).map(async ([key, statuses]) => {
      const count = await prisma.quote.count({
        where: statuses.length > 0 ? { status: { in: statuses } } : {}
      })
      return [key, count]
    })
  )

  return {
    quotes,
    total,
    counts: Object.fromEntries(counts)
  }
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    MEASUREMENT_SCHEDULED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    MEASUREMENT_COMPLETED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    QUOTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    REVISION_REQUESTED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    DEPOSIT_PAID: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    IN_PRODUCTION: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    READY_FOR_INSTALL: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    INSTALLATION_SCHEDULED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    INSTALLED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

export default async function AdminQuotesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { quotes, total, counts } = await getQuotes(
    params.status,
    params.search,
    parseInt(params.page || '1')
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">Manage customer quote requests</p>
        </div>
        <Button asChild>
          <Link href="/admin/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <form>
            <Input
              name="search"
              placeholder="Search quotes..."
              className="pl-10"
              defaultValue={params.search}
            />
          </form>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue={params.status || 'all'}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" asChild>
            <Link href="/admin/quotes">
              All ({counts.all})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="new" asChild>
            <Link href="/admin/quotes?status=new">
              New ({counts.new})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="measurement" asChild>
            <Link href="/admin/quotes?status=measurement">
              Measurement ({counts.measurement})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="quoted" asChild>
            <Link href="/admin/quotes?status=quoted">
              Quoted ({counts.quoted})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="active" asChild>
            <Link href="/admin/quotes?status=active">
              Active ({counts.active})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <Link href="/admin/quotes?status=completed">
              Completed ({counts.completed})
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quote List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {quotes.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No quotes found
              </div>
            ) : (
              quotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/admin/quotes/${quote.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        {quote.quoteNumber}
                      </span>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">{quote.customerName}</span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="text-sm text-muted-foreground">
                        {quote.customerEmail}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {quote.configurations.length} configuration(s)
                      {quote.assignedRep && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Assigned: {quote.assignedRep.name}</span>
                        </>
                      )}
                      {quote.appointments[0] && (
                        <>
                          <span className="mx-2">•</span>
                          <span>
                            Next: {formatDate(quote.appointments[0].scheduledDate)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold">
                      ${Number(quote.total).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(quote.createdAt)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
            <Link
              key={i + 1}
              href={`/admin/quotes?page=${i + 1}${params.status ? `&status=${params.status}` : ''}`}
            >
              <Button
                variant={params.page === String(i + 1) || (!params.page && i === 0) ? 'default' : 'outline'}
                size="sm"
              >
                {i + 1}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

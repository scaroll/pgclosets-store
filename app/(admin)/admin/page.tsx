import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import {
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

async function getStats() {
  const [
    totalQuotes,
    pendingQuotes,
    approvedQuotes,
    completedQuotes,
    upcomingAppointments,
    recentQuotes
  ] = await Promise.all([
    prisma.quote.count(),
    prisma.quote.count({
      where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } }
    }),
    prisma.quote.count({
      where: { status: { in: ['APPROVED', 'DEPOSIT_PAID', 'IN_PRODUCTION'] } }
    }),
    prisma.quote.count({
      where: { status: 'COMPLETED' }
    }),
    prisma.quoteAppointment.count({
      where: {
        scheduledDate: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
      }
    }),
    prisma.quote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true
      }
    })
  ])

  // Calculate total revenue from completed quotes
  const revenueResult = await prisma.quote.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { total: true }
  })

  return {
    totalQuotes,
    pendingQuotes,
    approvedQuotes,
    completedQuotes,
    upcomingAppointments,
    recentQuotes,
    totalRevenue: revenueResult._sum.total?.toNumber() || 0
  }
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend
}: {
  title: string
  value: string | number
  description?: string
  icon: any
  trend?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    MEASUREMENT_SCHEDULED: 'bg-purple-100 text-purple-800',
    MEASUREMENT_COMPLETED: 'bg-indigo-100 text-indigo-800',
    QUOTED: 'bg-green-100 text-green-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    DEPOSIT_PAID: 'bg-teal-100 text-teal-800',
    IN_PRODUCTION: 'bg-cyan-100 text-cyan-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the PG Closets admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Quotes"
          value={stats.totalQuotes}
          icon={FileText}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingQuotes}
          icon={Clock}
          description="Awaiting action"
        />
        <StatCard
          title="Active Orders"
          value={stats.approvedQuotes}
          icon={CheckCircle}
          description="In progress"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="From completed orders"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={Calendar}
          description="Measurements & installations"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedQuotes}
          icon={CheckCircle}
        />
        <Link href="/admin/quotes?status=SUBMITTED">
          <Card className="cursor-pointer hover:border-primary transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Action Required
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pendingQuotes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Quotes need review
              </p>
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
              <CardDescription>Latest quote requests</CardDescription>
            </div>
            <Link
              href="/admin/quotes"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentQuotes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No quotes yet
              </p>
            ) : (
              stats.recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  href={`/admin/quotes/${quote.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{quote.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.quoteNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="font-medium">
                      ${Number(quote.total).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

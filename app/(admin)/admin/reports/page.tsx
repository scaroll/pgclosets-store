import { prisma } from '@/lib/prisma'
import {
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getReportData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  // Current month stats
  const [
    monthQuotes,
    monthRevenue,
    monthConversions,
    lastMonthQuotes,
    lastMonthRevenue,
    yearRevenue,
    totalCustomers,
    avgQuoteValue,
    statusCounts,
    recentCompletions,
    topProducts
  ] = await Promise.all([
    // Quotes this month
    prisma.quote.count({
      where: { createdAt: { gte: startOfMonth } }
    }),

    // Revenue this month (completed orders)
    prisma.quote.aggregate({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startOfMonth }
      },
      _sum: { total: true }
    }),

    // Conversions this month (quotes that became orders)
    prisma.quote.count({
      where: {
        status: { in: ['DEPOSIT_PAID', 'IN_PRODUCTION', 'INSTALLED', 'COMPLETED'] },
        approvedAt: { gte: startOfMonth }
      }
    }),

    // Last month quotes
    prisma.quote.count({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
      }
    }),

    // Last month revenue
    prisma.quote.aggregate({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startOfLastMonth, lte: endOfLastMonth }
      },
      _sum: { total: true }
    }),

    // Year to date revenue
    prisma.quote.aggregate({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startOfYear }
      },
      _sum: { total: true }
    }),

    // Total unique customers
    prisma.quote.groupBy({
      by: ['customerEmail'],
      _count: true
    }),

    // Average quote value
    prisma.quote.aggregate({
      _avg: { total: true }
    }),

    // Status distribution
    prisma.quote.groupBy({
      by: ['status'],
      _count: true
    }),

    // Recent completions
    prisma.quote.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        total: true,
        completedAt: true
      }
    }),

    // Top product series (from configurations)
    prisma.quoteConfig.groupBy({
      by: ['series'],
      _count: true,
      _sum: { lineTotal: true },
      orderBy: { _count: { series: 'desc' } },
      take: 5
    })
  ])

  // Calculate conversion rate
  const totalQuotes = await prisma.quote.count({
    where: { status: { not: 'DRAFT' } }
  })
  const convertedQuotes = await prisma.quote.count({
    where: { status: { in: ['DEPOSIT_PAID', 'IN_PRODUCTION', 'INSTALLED', 'COMPLETED'] } }
  })
  const conversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0

  // Calculate month-over-month changes
  const quoteChange = lastMonthQuotes > 0
    ? ((monthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100
    : 0

  const revenueChange = (lastMonthRevenue._sum.total || 0) > 0
    ? ((Number(monthRevenue._sum.total || 0) - Number(lastMonthRevenue._sum.total || 0)) / Number(lastMonthRevenue._sum.total)) * 100
    : 0

  return {
    monthQuotes,
    monthRevenue: Number(monthRevenue._sum.total || 0),
    monthConversions,
    quoteChange,
    revenueChange,
    yearRevenue: Number(yearRevenue._sum.total || 0),
    totalCustomers: totalCustomers.length,
    avgQuoteValue: Number(avgQuoteValue._avg.total || 0),
    conversionRate,
    statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {} as Record<string, number>),
    recentCompletions,
    topProducts
  }
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  subtitle
}: {
  title: string
  value: string
  change?: number
  icon: any
  subtitle?: string
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
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}% from last month
          </p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    MEASUREMENT_SCHEDULED: 'bg-purple-100 text-purple-800',
    QUOTED: 'bg-green-100 text-green-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    DEPOSIT_PAID: 'bg-teal-100 text-teal-800',
    IN_PRODUCTION: 'bg-cyan-100 text-cyan-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export default async function AdminReportsPage() {
  const data = await getReportData()

  const pipelineStatuses = [
    'SUBMITTED', 'UNDER_REVIEW', 'MEASUREMENT_SCHEDULED', 'MEASUREMENT_COMPLETED',
    'QUOTED', 'APPROVED', 'DEPOSIT_PAID', 'IN_PRODUCTION'
  ]

  const pipelineValue = pipelineStatuses.reduce((sum, status) => {
    return sum + (data.statusCounts[status] || 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Business analytics and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={`$${data.monthRevenue.toLocaleString()}`}
          change={data.revenueChange}
          icon={DollarSign}
        />
        <StatCard
          title="Quotes This Month"
          value={data.monthQuotes.toString()}
          change={data.quoteChange}
          icon={FileText}
        />
        <StatCard
          title="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          subtitle="Quotes to orders"
        />
        <StatCard
          title="Avg Quote Value"
          value={`$${Math.round(data.avgQuoteValue).toLocaleString()}`}
          icon={BarChart3}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Year to Date Revenue"
          value={`$${data.yearRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Customers"
          value={data.totalCustomers.toString()}
          icon={Users}
        />
        <StatCard
          title="Active Pipeline"
          value={pipelineValue.toString()}
          icon={Clock}
          subtitle="Quotes in progress"
        />
        <StatCard
          title="Monthly Conversions"
          value={data.monthConversions.toString()}
          icon={CheckCircle}
          subtitle="Orders confirmed"
        />
      </div>

      {/* Pipeline & Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>Quotes by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.statusCounts)
                .filter(([status]) => !['DRAFT', 'CANCELLED', 'EXPIRED'].includes(status))
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(status)}>
                        {status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${Math.min(100, (count / Math.max(...Object.values(data.statusCounts))) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Product Series</CardTitle>
            <CardDescription>By number of configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.series} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium capitalize">{product.series || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product._count} orders</p>
                    <p className="text-sm text-muted-foreground">
                      ${Number(product._sum.lineTotal || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
          <CardDescription>Recently completed orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentCompletions.map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{quote.customerName}</p>
                  <p className="text-sm text-muted-foreground">{quote.quoteNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${Number(quote.total).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.completedAt && new Date(quote.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {data.recentCompletions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No completed orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QUOTE_STATUS_CONFIG } from '@/types/quote'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getQuote(id: string, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  })

  const quote = await prisma.quote.findFirst({
    where: {
      id,
      OR: [
        { customerId: user?.id },
        { customerEmail: email }
      ]
    },
    include: {
      configurations: true,
      appointments: {
        orderBy: { scheduledDate: 'desc' }
      },
      payments: {
        orderBy: { createdAt: 'desc' }
      },
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true, role: true }
          }
        }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      assignedRep: {
        select: { id: true, name: true, email: true, phone: true }
      }
    }
  })

  return quote
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

export default async function AccountQuoteDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/account/quotes')
  }

  const { id } = await params
  const quote = await getQuote(id, session.user.email)

  if (!quote) {
    notFound()
  }

  const address = quote.propertyAddress as any
  const statusConfig = QUOTE_STATUS_CONFIG[quote.status as keyof typeof QUOTE_STATUS_CONFIG]

  const canApprove = quote.status === 'QUOTED'
  const canPayDeposit = quote.status === 'APPROVED'
  const canPayBalance = quote.status === 'INSTALLED'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/account/quotes"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{quote.quoteNumber}</h1>
              <Badge className={getStatusColor(quote.status)}>
                {quote.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {statusConfig?.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {quote.formalQuotePdf && (
              <Button variant="outline" asChild>
                <a href={quote.formalQuotePdf} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Quote
                </a>
              </Button>
            )}

            {canApprove && (
              <Button asChild>
                <Link href={`/account/quotes/${quote.id}/approve`}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Quote
                </Link>
              </Button>
            )}

            {canPayDeposit && (
              <Button asChild>
                <Link href={`/account/quotes/${quote.id}/pay?type=deposit`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Deposit
                </Link>
              </Button>
            )}

            {canPayBalance && (
              <Button asChild>
                <Link href={`/account/quotes/${quote.id}/pay?type=final`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Balance
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Configuration</CardTitle>
              <CardDescription>
                {quote.configurations.length} door configuration(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.configurations.map((config) => (
                  <div key={config.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{config.roomName}</span>
                        <span className="text-muted-foreground ml-2">
                          ({config.openingType})
                        </span>
                      </div>
                      <span className="font-semibold">
                        ${Number(config.lineTotal).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>{' '}
                        {Number(config.widthInches)}&quot; x {Number(config.heightInches)}&quot;
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>{' '}
                        {config.doorType}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Series:</span>{' '}
                        {config.series}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Finish:</span>{' '}
                        {config.finish}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hardware:</span>{' '}
                        {config.hardware}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qty:</span>{' '}
                        {config.quantity}
                      </div>
                    </div>
                    {(config.softClose || config.mirror) && (
                      <div className="mt-2 flex gap-2">
                        {config.softClose && <Badge variant="secondary">Soft Close</Badge>}
                        {config.mirror && <Badge variant="secondary">Mirror</Badge>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.statusHistory.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {index === 0 ? (
                        <Clock className="h-4 w-4 text-primary" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 pb-4 border-b last:border-0">
                      <Badge className={getStatusColor(log.toStatus)}>
                        {log.toStatus.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(log.createdAt).toLocaleDateString('en-CA', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                      {log.reason && (
                        <p className="text-sm mt-1">{log.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {quote.messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.sender.role === 'ADMIN'
                          ? 'bg-primary/5 ml-0 mr-8'
                          : 'bg-muted ml-8 mr-0'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {msg.sender.role === 'ADMIN' ? 'PG Closets' : 'You'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${Number(quote.subtotal).toLocaleString()}</span>
                </div>
                {Number(quote.installationFee) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Installation</span>
                    <span>${Number(quote.installationFee).toLocaleString()}</span>
                  </div>
                )}
                {Number(quote.travelFee) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Fee</span>
                    <span>${Number(quote.travelFee).toLocaleString()}</span>
                  </div>
                )}
                {Number(quote.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${Number(quote.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>HST ({(Number(quote.taxRate) * 100).toFixed(0)}%)</span>
                  <span>${Number(quote.tax).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${Number(quote.total).toLocaleString()}</span>
                </div>

                {quote.depositAmount && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Deposit ({quote.depositPercent}%)</span>
                      <span>${Number(quote.depositAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Balance Due</span>
                      <span>
                        ${(Number(quote.total) - Number(quote.depositAmount)).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Appointments */}
          {quote.appointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quote.appointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{apt.type}</Badge>
                        <Badge
                          variant={apt.status === 'COMPLETED' ? 'default' : 'secondary'}
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="font-medium">
                        {new Date(apt.scheduledDate).toLocaleDateString('en-CA', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{apt.scheduledTime}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Property */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Address</CardTitle>
            </CardHeader>
            <CardContent>
              {address ? (
                <div className="text-sm">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>{address.city}, {address.province} {address.postalCode}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No address provided</p>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          {quote.assignedRep && (
            <Card>
              <CardHeader>
                <CardTitle>Your Representative</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{quote.assignedRep.name}</p>
                <p className="text-sm text-muted-foreground">{quote.assignedRep.email}</p>
                {quote.assignedRep.phone && (
                  <p className="text-sm text-muted-foreground">{quote.assignedRep.phone}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

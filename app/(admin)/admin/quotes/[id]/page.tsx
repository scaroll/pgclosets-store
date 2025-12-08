import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuoteStatusActions } from './quote-status-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getQuote(id: string) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      configurations: true,
      customer: {
        select: { id: true, name: true, email: true, phone: true }
      },
      assignedRep: {
        select: { id: true, name: true, email: true }
      },
      appointments: {
        orderBy: { scheduledDate: 'desc' },
        include: {
          assignedTech: {
            select: { id: true, name: true }
          }
        }
      },
      payments: {
        orderBy: { createdAt: 'desc' }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true, image: true, role: true }
          }
        }
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true }
          }
        }
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        include: {
          changedBy: {
            select: { id: true, name: true }
          }
        }
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

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date))
}

export default async function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = await params
  const quote = await getQuote(id)

  if (!quote) {
    notFound()
  }

  const address = quote.propertyAddress as any

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/quotes"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quotes
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
            <Badge className={getStatusColor(quote.status)}>
              {quote.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Created {formatDate(quote.createdAt)}
          </p>
        </div>
        <QuoteStatusActions quote={quote} />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Property */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{quote.customerName}</p>
                  <p className="text-sm text-muted-foreground">{quote.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">{quote.customerPhone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                {address ? (
                  <div className="space-y-1 text-sm">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.province} {address.postalCode}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No address provided</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Configurations */}
          <Card>
            <CardHeader>
              <CardTitle>Configurations</CardTitle>
              <CardDescription>
                {quote.configurations.length} door configuration(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.configurations.map((config, index) => (
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>{' '}
                        {Number(config.widthInches)}&quot; x {Number(config.heightInches)}&quot;
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>{' '}
                        {config.doorType}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Finish:</span>{' '}
                        {config.finish}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qty:</span>{' '}
                        {config.quantity}
                      </div>
                    </div>
                    {(config.softClose || config.mirror) && (
                      <div className="mt-2 flex gap-2">
                        {config.softClose && (
                          <Badge variant="secondary">Soft Close</Badge>
                        )}
                        {config.mirror && (
                          <Badge variant="secondary">Mirror</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for History */}
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Status History</TabsTrigger>
              <TabsTrigger value="messages">Messages ({quote.messages.length})</TabsTrigger>
              <TabsTrigger value="notes">Internal Notes ({quote.notes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {quote.statusHistory.map((log, index) => (
                      <div key={log.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(log.toStatus)}>
                              {log.toStatus.replace(/_/g, ' ')}
                            </Badge>
                            {log.fromStatus && (
                              <span className="text-sm text-muted-foreground">
                                from {log.fromStatus.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.changedBy?.name || 'System'} • {formatDate(log.createdAt)}
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
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardContent className="pt-6">
                  {quote.messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {quote.messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{msg.sender.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(msg.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6">
                  {quote.notes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No internal notes
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {quote.notes.map((note) => (
                        <div key={note.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{note.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(note.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </CardTitle>
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
                  <span>Tax ({(Number(quote.taxRate) * 100).toFixed(0)}%)</span>
                  <span>${Number(quote.tax).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${Number(quote.total).toLocaleString()}</span>
                </div>
                {quote.depositAmount && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Deposit ({quote.depositPercent}%)</span>
                    <span>${Number(quote.depositAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments scheduled</p>
              ) : (
                <div className="space-y-3">
                  {quote.appointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{apt.type}</Badge>
                        <Badge
                          variant={apt.status === 'COMPLETED' ? 'default' : 'secondary'}
                        >
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="font-medium">
                          {new Date(apt.scheduledDate).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">{apt.scheduledTime}</p>
                        {apt.assignedTech && (
                          <p className="text-muted-foreground">
                            Tech: {apt.assignedTech.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4">
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments recorded</p>
              ) : (
                <div className="space-y-3">
                  {quote.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{payment.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {payment.paidAt ? formatDate(payment.paidAt) : 'Pending'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${Number(payment.amount).toLocaleString()}
                        </p>
                        <Badge
                          variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {quote.assignedRep ? (
                <div>
                  <p className="font-medium">{quote.assignedRep.name}</p>
                  <p className="text-sm text-muted-foreground">{quote.assignedRep.email}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
              <Button variant="outline" className="w-full mt-4">
                Assign Rep
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

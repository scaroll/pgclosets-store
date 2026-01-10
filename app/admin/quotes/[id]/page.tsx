// @ts-nocheck - Admin quote detail page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Package,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface QuoteDetail {
  id: string;
  quote_number: string;
  source: 'quick' | 'renin';
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  product_name: string;
  product_category: string;
  product_price?: number;
  status: string;
  received_at: string;
  notes?: string;
  metadata?: any;
  customer_data?: any;
  products_data?: any[];
  quote_calculation?: any;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const _router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const id = params.id as string;
  const [source, quoteId] = id.split('-');

  useEffect(() => {
    void fetchQuoteDetail();
  }, [id]);

  const fetchQuoteDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/quotes?source=${source}&search=&status=all`
      );
      const data = await response.json();

      if (data.success) {
        const foundQuote = data.quotes.find(
          (q: QuoteDetail) => q.id === quoteId && q.source === source
        );
        if (foundQuote) {
          setQuote(foundQuote);
          setNewStatus(foundQuote.status || 'pending');
        }
      }
    } catch (error) {
      console.error('Error fetching quote detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!quote) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: quote.id,
          source: quote.source,
          status: newStatus,
          notes: adminNotes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuote({ ...quote, status: newStatus });
        alert('Quote updated successfully!');
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      pending: { variant: 'outline', label: 'Pending' },
      contacted: { variant: 'secondary', label: 'Contacted' },
      converted: { variant: 'default', label: 'Converted' },
      declined: { variant: 'destructive', label: 'Declined' },
    };

    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toFixed(2)} CAD`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quote Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The quote you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/admin/quotes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/quotes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{quote.quote_number}</h1>
                {getStatusBadge(quote.status)}
                <Badge variant="outline" className="capitalize">
                  {quote.source === 'quick' ? 'Quick Quote' : 'Renin Ottawa'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Received on {formatDate(quote.received_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Customer Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Contact details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{quote.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${quote.customer_email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {quote.customer_email}
                    </a>
                  </div>
                </div>

                {quote.customer_phone && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${quote.customer_phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {quote.customer_phone}
                      </a>
                    </div>
                  </div>
                )}

                {quote.source === 'renin' && quote.customer_data?.postalCode && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Postal Code</p>
                      <p className="font-medium">{quote.customer_data.postalCode}</p>
                    </div>
                  </div>
                )}
              </div>

              {quote.source === 'renin' && quote.customer_data && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Customer Type</p>
                  <Badge variant="outline" className="capitalize">
                    {quote.customer_data.customerType}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
              <CardDescription>Update quote status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Input
                  id="admin-notes"
                  placeholder="Add internal notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleUpdateStatus}
                disabled={saving}
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Requested products and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              {quote.source === 'quick' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium">{quote.product_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Category: {quote.product_category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-bold text-lg">
                        {formatPrice(quote.product_price)}
                      </p>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">
                        Customer Notes
                      </p>
                      <p className="text-sm">{quote.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {quote.products_data?.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 border rounded-lg"
                    >
                      <div className="rounded-full bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.productCategory}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Size:</span>{' '}
                            {product.width}" x {product.height}"
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>{' '}
                            {product.quantity}
                          </div>
                          <div>
                            <span className="text-muted-foreground">MSRP:</span>{' '}
                            {formatPrice(product.msrpPrice)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Installation:
                            </span>{' '}
                            {product.includeInstallation ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {quote.quote_calculation && (
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatPrice(quote.quote_calculation.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Installation:</span>
                        <span>
                          {formatPrice(quote.quote_calculation.installationCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span>
                          {formatPrice(quote.quote_calculation.deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">HST:</span>
                        <span>{formatPrice(quote.quote_calculation.hst)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatPrice(quote.quote_calculation.total)}</span>
                      </div>
                      {quote.quote_calculation.savings > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Total Savings:</span>
                          <span>
                            {formatPrice(quote.quote_calculation.savings)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          {quote.metadata && (
            <Card>
              <CardHeader>
                <CardTitle>Request Metadata</CardTitle>
                <CardDescription>Technical information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {quote.metadata.ip && (
                  <div>
                    <span className="text-muted-foreground">IP:</span>{' '}
                    <span className="font-mono">{quote.metadata.ip}</span>
                  </div>
                )}
                {quote.metadata.userAgent && (
                  <div>
                    <span className="text-muted-foreground">User Agent:</span>
                    <p className="font-mono text-xs mt-1 break-all">
                      {quote.metadata.userAgent}
                    </p>
                  </div>
                )}
                {quote.metadata.referer && (
                  <div>
                    <span className="text-muted-foreground">Referrer:</span>
                    <p className="font-mono text-xs mt-1 break-all">
                      {quote.metadata.referer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

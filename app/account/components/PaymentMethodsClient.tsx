'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Edit, Trash2, ArrowLeft, Shield, Check, AlertTriangle, Clock, Zap, Wallet, Smartphone, Building2, CreditCard as CreditCardIcon, ChevronDown, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_account'
  brand?: string
  last4: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName: string
  isDefault: boolean
  isVerified: boolean
  addedAt: string
  billingAddress?: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  metadata?: {
    bin?: string
    funding?: string
    country?: string
    brand?: string
  }
}

interface BillingPreference {
  id: string
  userId: string
  autoPayEnabled: boolean
  paymentMethodId?: string
  spendLimit?: number
  requireConfirmation: boolean
  notifyOnPayment: boolean
  monthlyInvoices: boolean
}

export function PaymentMethodsClient() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [billingPreference, setBillingPreference] = useState<BillingPreference | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('cards')

  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Canada'
    },
    isDefault: false
  })

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'credit_card',
          brand: 'Visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
          cardholderName: 'John Smith',
          isDefault: true,
          isVerified: true,
          addedAt: '2024-01-15',
          billingAddress: {
            street: '123 Elgin Street, Apt 4B',
            city: 'Ottawa',
            province: 'ON',
            postalCode: 'K1A 0B1',
            country: 'Canada'
          },
          metadata: {
            bin: '424242',
            funding: 'credit',
            country: 'CA',
            brand: 'Visa'
          }
        },
        {
          id: '2',
          type: 'credit_card',
          brand: 'Mastercard',
          last4: '8888',
          expiryMonth: 8,
          expiryYear: 2024,
          cardholderName: 'John Smith',
          isDefault: false,
          isVerified: true,
          addedAt: '2024-03-20',
          metadata: {
            bin: '555555',
            funding: 'credit',
            country: 'CA',
            brand: 'Mastercard'
          }
        },
        {
          id: '3',
          type: 'paypal',
          last4: 'john.smith@email.com',
          cardholderName: 'John Smith',
          isDefault: false,
          isVerified: true,
          addedAt: '2024-06-10'
        },
        {
          id: '4',
          type: 'apple_pay',
          last4: 'Apple Pay',
          cardholderName: 'John Smith',
          isDefault: false,
          isVerified: true,
          addedAt: '2024-09-05'
        }
      ]

      const mockBillingPreference: BillingPreference = {
        id: '1',
        userId: 'user123',
        autoPayEnabled: false,
        requireConfirmation: true,
        notifyOnPayment: true,
        monthlyInvoices: true
      }

      setPaymentMethods(mockPaymentMethods)
      setBillingPreference(mockBillingPreference)
    } catch (error) {
      console.error('Error fetching payment data:', error)
      toast({
        title: "Error loading payment methods",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    try {
      // Validate form
      if (!formData.cardNumber || !formData.cardholderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Mock API call
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: formData.type,
        brand: getCardBrand(formData.cardNumber),
        last4: formData.cardNumber.slice(-4),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        cardholderName: formData.cardholderName,
        isDefault: formData.isDefault,
        isVerified: false,
        addedAt: new Date().toISOString().split('T')[0],
        billingAddress: formData.billingAddress
      }

      if (formData.isDefault) {
        setPaymentMethods(prev => prev.map(method => ({ ...method, isDefault: false })))
      }

      setPaymentMethods(prev => [...prev, newMethod])
      setIsAddDialogOpen(false)
      resetForm()

      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully. It may take a moment to appear.",
      })
    } catch (error) {
      toast({
        title: "Error adding payment method",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      type: method.type,
      cardNumber: `****-****-****-${method.last4}`,
      cardholderName: method.cardholderName,
      expiryMonth: method.expiryMonth?.toString() || '',
      expiryYear: method.expiryYear?.toString() || '',
      cvv: '',
      billingAddress: method.billingAddress || {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Canada'
      },
      isDefault: method.isDefault
    })
    setIsEditDialogOpen(true)
  }

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      setIsDeleting(methodId)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
      toast({
        title: "Payment method removed",
        description: "The payment method has been removed from your account.",
      })
    } catch (error) {
      toast({
        title: "Error removing payment method",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSetDefault = async (methodId: string) => {
    try {
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })))

      toast({
        title: "Default payment method updated",
        description: "This payment method is now your default.",
      })
    } catch (error) {
      toast({
        title: "Error updating default",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBillingPreference = async (updates: Partial<BillingPreference>) => {
    try {
      setBillingPreference(prev => prev ? { ...prev, ...updates } : null)
      toast({
        title: "Billing preferences updated",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error updating preferences",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard'
    if (number.startsWith('3')) return 'American Express'
    if (number.startsWith('6')) return 'Discover'
    return 'Unknown'
  }

  const getPaymentIcon = (type: string, brand?: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCardIcon className="h-5 w-5" />
      case 'paypal':
        return <Wallet className="h-5 w-5" />
      case 'apple_pay':
        return <Smartphone className="h-5 w-5" />
      case 'google_pay':
        return <Zap className="h-5 w-5" />
      case 'bank_account':
        return <Building2 className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getCardColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'bg-blue-600'
      case 'mastercard': return 'bg-red-600'
      case 'american express': return 'bg-blue-800'
      case 'discover': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      billingAddress: {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Canada'
      },
      isDefault: false
    })
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ').substr(0, 19)
  }

  const getExpiryYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 0; i < 15; i++) {
      years.push(currentYear + i)
    }
    return years
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
                <p className="text-gray-600">Manage your payment methods and billing preferences</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your payment details. Your information is encrypted and secure.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Your payment information is encrypted and never stored on our servers.
                    </p>
                  </div>

                  <Tabs value="cards" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="cards">Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                      <TabsTrigger value="google">Google Pay</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cards" className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                            maxLength={19}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name *</Label>
                          <Input
                            id="cardholderName"
                            placeholder="John Smith"
                            value={formData.cardholderName}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryMonth">Expiry Month *</Label>
                            <Select value={formData.expiryMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(12)].map((_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                    {String(i + 1).padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiryYear">Expiry Year *</Label>
                            <Select value={formData.expiryYear} onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getExpiryYears().map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Billing Address</Label>
                          <div className="space-y-3">
                            <Input
                              placeholder="Street Address"
                              value={formData.billingAddress.street}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                billingAddress: { ...prev.billingAddress, street: e.target.value }
                              }))}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="City"
                                value={formData.billingAddress.city}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, city: e.target.value }
                                }))}
                              />
                              <Input
                                placeholder="Province"
                                value={formData.billingAddress.province}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, province: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Postal Code"
                                value={formData.billingAddress.postalCode}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, postalCode: e.target.value }
                                }))}
                              />
                              <Select value={formData.billingAddress.country} onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                billingAddress: { ...prev.billingAddress, country: value }
                              }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="United States">United States</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isDefault"
                            checked={formData.isDefault}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                          />
                          <Label htmlFor="isDefault">Set as default payment method</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="paypal" className="space-y-6">
                      <div className="text-center py-8">
                        <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Connect PayPal Account</h3>
                        <p className="text-gray-600 mb-6">You'll be redirected to PayPal to authorize your account.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Connect PayPal
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="apple" className="space-y-6">
                      <div className="text-center py-8">
                        <Smartphone className="h-16 w-16 text-gray-800 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Apple Pay</h3>
                        <p className="text-gray-600 mb-6">Use your saved Apple Pay payment methods for faster checkout.</p>
                        <Button className="bg-black hover:bg-gray-800 text-white">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Set up Apple Pay
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="google" className="space-y-6">
                      <div className="text-center py-8">
                        <Zap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Google Pay</h3>
                        <p className="text-gray-600 mb-6">Use your saved Google Pay payment methods for faster checkout.</p>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          <Zap className="h-4 w-4 mr-2" />
                          Set up Google Pay
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Saved Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage your saved payment methods for faster checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-600 mb-4">Add a payment method to make checkout faster</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={cn(
                              "w-12 h-8 rounded flex items-center justify-center text-white",
                              method.brand ? getCardColor(method.brand) : "bg-gray-600"
                            )}>
                              {getPaymentIcon(method.type, method.brand)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">
                                  {method.brand || method.type.replace('_', ' ').charAt(0).toUpperCase() + method.type.slice(1)}
                                </h4>
                                {method.isDefault && (
                                  <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                                )}
                                {method.isVerified && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {method.type === 'paypal' ? method.last4 : `•••• ${method.last4}`}
                                {method.expiryMonth && method.expiryYear && ` • Expires ${method.expiryMonth}/${method.expiryYear}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                Added on {new Date(method.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPaymentMethod(method)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(method.id)}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                            {paymentMethods.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeletePaymentMethod(method.id)}
                                disabled={isDeleting === method.id}
                                className="text-red-600 hover:text-red-700"
                              >
                                {isDeleting === method.id ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        {method.billingAddress && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Billing: {method.billingAddress.street}, {method.billingAddress.city}, {method.billingAddress.province}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">PCI-DSS Compliant</h4>
                      <p className="text-sm text-gray-600">We meet the highest security standards for payment processing.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Fraud Protection</h4>
                      <p className="text-sm text-gray-600">Advanced fraud detection keeps your account secure.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">3D Secure Authentication</h4>
                      <p className="text-sm text-gray-600">Extra verification step for enhanced security.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Preferences</CardTitle>
                <CardDescription>
                  Manage your billing settings and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {billingPreference && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="autoPay">Auto-Pay</Label>
                        <p className="text-xs text-gray-600">Automatically pay recurring bills</p>
                      </div>
                      <Switch
                        id="autoPay"
                        checked={billingPreference.autoPayEnabled}
                        onCheckedChange={(checked) => handleUpdateBillingPreference({ autoPayEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="confirmPayment">Payment Confirmation</Label>
                        <p className="text-xs text-gray-600">Require confirmation before payment</p>
                      </div>
                      <Switch
                        id="confirmPayment"
                        checked={billingPreference.requireConfirmation}
                        onCheckedChange={(checked) => handleUpdateBillingPreference({ requireConfirmation: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="notifyPayment">Payment Notifications</Label>
                        <p className="text-xs text-gray-600">Get notified when payments are processed</p>
                      </div>
                      <Switch
                        id="notifyPayment"
                        checked={billingPreference.notifyOnPayment}
                        onCheckedChange={(checked) => handleUpdateBillingPreference({ notifyOnPayment: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="monthlyInvoices">Monthly Invoices</Label>
                        <p className="text-xs text-gray-600">Receive monthly billing summaries</p>
                      </div>
                      <Switch
                        id="monthlyInvoices"
                        checked={billingPreference.monthlyInvoices}
                        onCheckedChange={(checked) => handleUpdateBillingPreference({ monthlyInvoices: checked })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Transaction History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Tax Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Request Spending Limit Increase
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your payment methods or billing?
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Suspicious Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Missing icons - add these to your imports
const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
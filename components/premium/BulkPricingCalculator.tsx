"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calculator,
  TrendingDown,
  Package,
  DollarSign,
  Users,
  Truck,
  Clock,
  Award,
  Info,
  CheckCircle,
  ArrowRight,
  Download,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Target,
  BarChart3,
  ShoppingCart,
  Percent
} from 'lucide-react'

interface PricingTier {
  minQuantity: number
  maxQuantity: number
  unitPrice: number
  discount: number
  savings: number
  benefits: string[]
  popular?: boolean
  enterprise?: boolean
}

interface BulkInquiry {
  quantity: number
  product: string
  contactInfo: {
    email: string
    phone: string
    company: string
    name: string
  }
  requirements: string
  timeline: string
  budget: string
}

interface BulkPricingCalculatorProps {
  basePrice: number
  productId: string
  productName: string
  currency?: string
  tiers: PricingTier[]
  enableInquiry?: boolean
  showSavings?: boolean
  enableComparison?: boolean
  onQuoteRequest?: (inquiry: BulkInquiry) => void
  className?: string
}

export const BulkPricingCalculator: React.FC<BulkPricingCalculatorProps> = ({
  basePrice,
  productId,
  productName,
  currency = 'USD',
  tiers,
  enableInquiry = true,
  showSavings = true,
  enableComparison = true,
  onQuoteRequest,
  className
}) => {
  const [quantity, setQuantity] = useState([1])
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [inquiry, setInquiry] = useState<BulkInquiry>({
    quantity: 1,
    product: productName,
    contactInfo: {
      email: '',
      phone: '',
      company: '',
      name: ''
    },
    requirements: '',
    timeline: '',
    budget: ''
  })

  // Calculate pricing based on quantity
  const calculatePricing = useMemo(() => {
    const qty = quantity[0]
    let applicableTier = tiers.find(tier =>
      qty >= tier.minQuantity && qty <= tier.maxQuantity
    ) || {
      minQuantity: 1,
      maxQuantity: 1,
      unitPrice: basePrice,
      discount: 0,
      savings: 0,
      benefits: []
    }

    const totalPrice = qty * applicableTier.unitPrice
    const originalTotal = qty * basePrice
    const totalSavings = originalTotal - totalPrice

    return {
      quantity: qty,
      unitPrice: applicableTier.unitPrice,
      totalPrice,
      originalTotal,
      totalSavings,
      discount: applicableTier.discount,
      tier: applicableTier
    }
  }, [quantity, basePrice, tiers])

  // Find selected tier based on quantity
  useEffect(() => {
    const applicableTier = tiers.find(tier =>
      quantity[0] >= tier.minQuantity && quantity[0] <= tier.maxQuantity
    )
    setSelectedTier(applicableTier || null)
  }, [quantity, tiers])

  // Get next tier for upsell
  const getNextTier = () => {
    const currentIndex = tiers.findIndex(tier =>
      quantity[0] >= tier.minQuantity && quantity[0] <= tier.maxQuantity
    )
    return tiers[currentIndex + 1] || null
  }

  // Calculate potential savings at next tier
  const getNextTierSavings = () => {
    const nextTier = getNextTier()
    if (!nextTier) return null

    const currentTotal = calculatePricing.totalPrice
    const nextTotal = nextTier.minQuantity * nextTier.unitPrice
    return nextTotal - currentTotal
  }

  // Handle quote request
  const handleQuoteRequest = () => {
    onQuoteRequest?.({
      ...inquiry,
      quantity: quantity[0]
    })
    setShowInquiryForm(false)
  }

  // Download quote
  const downloadQuote = () => {
    const quoteData = {
      product: productName,
      quantity: calculatePricing.quantity,
      unitPrice: calculatePricing.unitPrice,
      totalPrice: calculatePricing.totalPrice,
      discount: calculatePricing.discount,
      savings: calculatePricing.totalSavings,
      date: new Date().toISOString(),
      currency
    }

    const dataStr = JSON.stringify(quoteData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `bulk-quote-${productName.toLowerCase().replace(/\s+/g, '-')}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bulk Pricing Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calculator" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="calculator">Calculator</TabsTrigger>
                  <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
                  {enableComparison && (
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="calculator" className="mt-6 space-y-6">
                  {/* Quantity Input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quantity" className="text-sm font-medium">
                        Quantity
                      </Label>
                      <Badge variant="outline" className="text-sm">
                        {calculatePricing.quantity} units
                      </Badge>
                    </div>
                    <Slider
                      id="quantity"
                      value={quantity}
                      onValueChange={setQuantity}
                      max={Math.max(...tiers.map(t => t.maxQuantity), 100)}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>{Math.max(...tiers.map(t => t.maxQuantity), 100)}+</span>
                    </div>
                  </div>

                  {/* Current Pricing Display */}
                  <motion.div
                    key={quantity[0]}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Unit Price</p>
                        <p className="text-2xl font-bold">
                          {currency} {calculatePricing.unitPrice.toFixed(2)}
                        </p>
                        {calculatePricing.discount > 0 && (
                          <Badge variant="secondary" className="mt-2">
                            <Percent className="h-3 w-3 mr-1" />
                            {calculatePricing.discount}% off
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                        <p className="text-3xl font-bold">
                          {currency} {calculatePricing.totalPrice.toFixed(2)}
                        </p>
                        {showSavings && calculatePricing.totalSavings > 0 && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Save {currency} {calculatePricing.totalSavings.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedTier && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {selectedTier.minQuantity}-{selectedTier.maxQuantity} Units Tier Benefits
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedTier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Next Tier Upsell */}
                  {getNextTier() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />
                            Upgrade to {getNextTier()?.minQuantity}+ units
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Save an additional {currency} {Math.abs(getNextTierSavings() || 0).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity([getNextTier()?.minQuantity || quantity[0]])}
                        >
                          Upgrade
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button className="flex-1" size="lg">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    {enableInquiry && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        size="lg"
                        onClick={() => setShowInquiryForm(true)}
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Request Quote
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tiers" className="mt-6">
                  <div className="space-y-4">
                    {tiers.map((tier, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className={`cursor-pointer transition-all ${
                          selectedTier === tier ? 'ring-2 ring-primary' : ''
                        } ${tier.popular ? 'border-primary' : ''} ${tier.enterprise ? 'border-purple-500' : ''}`}
                        onClick={() => setQuantity([tier.minQuantity])}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-medium">
                                  {tier.minQuantity}-{tier.maxQuantity} Units
                                </h3>
                                <p className="text-2xl font-bold mt-1">
                                  {currency} {tier.unitPrice.toFixed(2)} / unit
                                </p>
                              </div>
                              <div className="text-right">
                                {tier.discount > 0 && (
                                  <Badge variant="secondary" className="mb-2">
                                    {tier.discount}% OFF
                                  </Badge>
                                )}
                                {tier.popular && (
                                  <Badge variant="default" className="mb-2">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                                {tier.enterprise && (
                                  <Badge variant="outline" className="mb-2 border-purple-500 text-purple-600">
                                    <Award className="h-3 w-3 mr-1" />
                                    Enterprise
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Starting at</p>
                                <p className="font-medium">
                                  {currency} {(tier.minQuantity * tier.unitPrice).toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">You save</p>
                                <p className="font-medium text-green-600">
                                  {currency} {tier.savings.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {tier.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {enableComparison && (
                  <TabsContent value="comparison" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Compare Pricing Tiers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Tier</th>
                              <th className="text-left p-2">Quantity</th>
                              <th className="text-left p-2">Unit Price</th>
                              <th className="text-left p-2">Discount</th>
                              <th className="text-left p-2">Total Savings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tiers.map((tier, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">
                                  <div>
                                    <span className="font-medium">
                                      {tier.minQuantity}-{tier.maxQuantity}
                                    </span>
                                    {tier.popular && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2">{tier.minQuantity}+</td>
                                <td className="p-2 font-medium">
                                  {currency} {tier.unitPrice.toFixed(2)}
                                </td>
                                <td className="p-2">
                                  <Badge variant="outline">
                                    {tier.discount}%
                                  </Badge>
                                </td>
                                <td className="p-2 text-green-600 font-medium">
                                  {currency} {tier.savings.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bulk Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Volume Discounts</p>
                  <p className="text-xs text-muted-foreground">
                    Up to {Math.max(...tiers.map(t => t.discount))}% off
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    On orders 50+ units
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Dedicated Support</p>
                  <p className="text-xs text-muted-foreground">
                    Priority assistance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Flexible Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled shipments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Sales */}
          {enableInquiry && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our sales team can help you find the best pricing for your needs.
                </p>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    sales@company.com
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    1-800-BULK-ORD
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setShowInquiryForm(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Get Custom Quote
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={downloadQuote}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Quote PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInquiryForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Request Custom Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={inquiry.contactInfo.name}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, name: e.target.value }
                        }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={inquiry.contactInfo.company}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, company: e.target.value }
                        }))}
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inquiry.contactInfo.email}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, email: e.target.value }
                        }))}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={inquiry.contactInfo.phone}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          contactInfo: { ...prev.contactInfo, phone: e.target.value }
                        }))}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={inquiry.quantity}
                      onChange={(e) => setInquiry(prev => ({
                        ...prev,
                        quantity: Number(e.target.value)
                      }))}
                      placeholder="Estimated quantity"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <textarea
                      id="requirements"
                      className="w-full p-2 border rounded-md resize-none"
                      rows={4}
                      value={inquiry.requirements}
                      onChange={(e) => setInquiry(prev => ({
                        ...prev,
                        requirements: e.target.value
                      }))}
                      placeholder="Describe your specific requirements..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        value={inquiry.timeline}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          timeline: e.target.value
                        }))}
                        placeholder="When do you need it?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        value={inquiry.budget}
                        onChange={(e) => setInquiry(prev => ({
                          ...prev,
                          budget: e.target.value
                        }))}
                        placeholder="Your budget range"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowInquiryForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleQuoteRequest}>
                      Submit Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BulkPricingCalculator
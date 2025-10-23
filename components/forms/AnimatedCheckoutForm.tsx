'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  CreditCard,
  Truck,
  Shield,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { shakeAnimation, modalContent, accordionContent } from '@/lib/animations/variants'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid postal code'),
  phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number'),
  paymentMethod: z.enum(['credit', 'debit', 'paypal']),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(3, 'Name on card is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  saveInfo: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
})

type FormData = z.infer<typeof formSchema>

export default function AnimatedCheckoutForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      paymentMethod: 'credit',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      saveInfo: false,
      terms: false,
    },
  })

  const steps = [
    { id: 1, title: 'Contact', icon: '👤' },
    { id: 2, title: 'Shipping', icon: '📦' },
    { id: 3, title: 'Payment', icon: '💳' },
    { id: 4, title: 'Review', icon: '✅' },
  ]

  const handleSubmit = async (data: FormData) => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setCurrentStep(4)
  }

  const nextStep = async () => {
    const fields = ['email', 'firstName', 'lastName']
    if (currentStep === 2) fields.push('address', 'city', 'province', 'postalCode', 'phone')
    if (currentStep === 3) fields.push('paymentMethod', 'cardNumber', 'expiryDate', 'cvv')

    const isValid = await form.trigger(fields as any)
    if (isValid) {
      setCurrentStep(currentStep + 1)
    } else {
      // Shake animation for invalid fields
      setErrors(form.formState.errors as any)
      setTimeout(() => setErrors({}), 500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step.icon}</span>
              )}
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                className={`w-24 h-1 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                }`}
                initial={{ width: 0 }}
                animate={{ width: '96px' }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="contact"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalContent}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">👤</span>
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className={errors.email ? 'animate-pulse' : ''}>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="john@example.com"
                                  className={errors.email ? 'border-red-500' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Doe" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shipping Information */}
              <AnimatePresence mode="wait">
                {currentStep === 2 && (
                  <motion.div
                    key="shipping"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalContent}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="w-6 h-6" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="123 Main St" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ottawa" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ON" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="K1A 0B1" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="6131234567" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Payment Information */}
              <AnimatePresence mode="wait">
                {currentStep === 3 && (
                  <motion.div
                    key="payment"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalContent}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-6 h-6" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-3"
                                >
                                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <RadioGroupItem value="credit" id="credit" />
                                    <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                                      <CreditCard className="w-4 h-4" />
                                      Credit Card
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <RadioGroupItem value="debit" id="debit" />
                                    <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer">
                                      <CreditCard className="w-4 h-4" />
                                      Debit Card
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="1234567890123456"
                                    maxLength={16}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John Doe" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="MM/YY"
                                      maxLength={5}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="123"
                                      maxLength={4}
                                      type="password"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="saveInfo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Save payment information for future purchases
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to the terms and conditions and privacy policy
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Order Confirmation */}
              <AnimatePresence mode="wait">
                {currentStep === 4 && (
                  <motion.div
                    key="confirmation"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalContent}
                  >
                    <Card className="text-center py-12">
                      <CardContent className="space-y-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                        >
                          <Check className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                          <p className="text-muted-foreground">
                            Thank you for your purchase. You will receive a confirmation email shortly.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Order Number: <span className="font-mono font-semibold">#ORD-2024-1234</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estimated Delivery: <span className="font-semibold">3-5 business days</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type={currentStep === 3 ? 'submit' : 'button'}
                      onClick={currentStep < 3 ? nextStep : undefined}
                      disabled={isProcessing}
                      className="min-w-[120px]"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : currentStep === 3 ? (
                        'Complete Order'
                      ) : (
                        'Next'
                      )}
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sample order items */}
                  <div className="space-y-3">
                    {[
                      { name: 'Custom Closet System', price: 2999, quantity: 1 },
                      { name: 'Barn Door Hardware', price: 450, quantity: 2 },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${item.price * item.quantity}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>$3,899.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$506.87</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>$4,405.87</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Secure checkout powered by Stripe
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
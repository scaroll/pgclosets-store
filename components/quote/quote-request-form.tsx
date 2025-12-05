'use client';

/**
 * Quote Request Form Component
 *
 * A comprehensive quote request form with Apple-style design
 * Features:
 * - Customer information collection (name, email, phone)
 * - Product selection from catalog
 * - Room dimensions input
 * - Installation preference selection
 * - Preferred contact method
 * - Additional notes/message
 * - Form validation with react-hook-form and zod
 * - Success/error state handling
 * - Apple-style premium design
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, XCircle, Loader2, Phone, Mail, MessageSquare, Ruler, Package, Wrench } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import productsData from '@/data/products.json';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Zod validation schema
const quoteRequestSchema = z.object({
  // Customer Information
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),

  // Product Selection
  productSlug: z.string()
    .min(1, 'Please select a product'),

  // Room Dimensions
  roomWidth: z.coerce.number()
    .min(1, 'Width must be at least 1 inch')
    .max(500, 'Width seems unrealistic')
    .optional()
    .or(z.literal('')),

  roomHeight: z.coerce.number()
    .min(1, 'Height must be at least 1 inch')
    .max(500, 'Height seems unrealistic')
    .optional()
    .or(z.literal('')),

  // Installation Preference
  installationType: z.enum(['diy', 'professional'], {
    required_error: 'Please select an installation preference',
  }),

  // Contact Preference
  contactMethod: z.enum(['email', 'phone', 'either'], {
    required_error: 'Please select a contact method',
  }),

  // Additional Information
  message: z.string()
    .max(2000, 'Message must not exceed 2000 characters')
    .optional(),
});

type QuoteRequestFormValues = z.infer<typeof quoteRequestSchema>;

export interface QuoteRequestFormProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: (data: QuoteRequestFormValues) => void;

  /**
   * Pre-selected product slug
   */
  defaultProductSlug?: string;
}

/**
 * Quote Request Form Component
 */
export function QuoteRequestForm({
  className,
  onSuccess,
  defaultProductSlug,
}: QuoteRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  // Initialize form with react-hook-form and zod
  const form = useForm<QuoteRequestFormValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      productSlug: defaultProductSlug || '',
      roomWidth: '' as any,
      roomHeight: '' as any,
      installationType: 'professional',
      contactMethod: 'either',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: QuoteRequestFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/quotes/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      const result = await response.json();

      // Success state
      setSubmitStatus('success');

      toast({
        title: 'Quote Request Submitted!',
        description: 'Thank you for your interest. We\'ll contact you shortly with a detailed quote.',
        variant: 'default',
      });

      // Reset form after successful submission
      form.reset();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      // Error state
      setSubmitStatus('error');

      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your quote request. Please try again or contact us directly.',
        variant: 'destructive',
      });

      console.error('Quote request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get products from JSON data
  const products = productsData.items || [];

  return (
    <div className={cn('w-full', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Success/Error Status Display */}
          {submitStatus === 'success' && (
            <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                    Quote Request Submitted Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thank you for your interest. Our team will review your request and contact you within 24-48 hours with a detailed quote.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                    Submission Failed
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    We encountered an error processing your request. Please try again or contact us directly at{' '}
                    <a href="tel:+16135551234" className="font-medium underline">
                      (613) 555-1234
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Information Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                Contact Information
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Let us know how to reach you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        {...field}
                        className="h-11 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email Address *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Phone Number *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                      <Input
                        type="tel"
                        placeholder="(613) 555-1234"
                        {...field}
                        className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    We&apos;ll use this to contact you about your quote
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Product Selection Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                Product Details
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Tell us about your project
              </p>
            </div>

            {/* Product Selection */}
            <FormField
              control={form.control}
              name="productSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Select Product *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                          <SelectValue placeholder="Choose a product..." />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary">
                      {products.map((product) => (
                        <SelectItem
                          key={product.slug}
                          value={product.slug}
                          className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer transition-colors"
                        >
                          <div className="flex flex-col gap-1 py-1">
                            <span className="font-medium">{product.title}</span>
                            <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                              {product.category} - Starting at ${product.priceMin}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Select the product you&apos;re interested in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="roomWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Room Width (inches)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                        <Input
                          type="number"
                          placeholder="84"
                          {...field}
                          className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Room Height (inches)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary rotate-90" />
                        <Input
                          type="number"
                          placeholder="96"
                          {...field}
                          className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary -mt-2">
              Optional: Provide room dimensions for a more accurate quote
            </p>
          </div>

          {/* Installation Preference Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                Preferences
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                How can we best serve you?
              </p>
            </div>

            {/* Installation Type */}
            <FormField
              control={form.control}
              name="installationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Installation Preference *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="diy"
                          id="diy"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="diy"
                          className="flex flex-col items-start justify-between rounded-xl border-2 border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold leading-none">
                              DIY Installation
                            </p>
                            <p className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary">
                              I&apos;ll install it myself
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="professional"
                          id="professional"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="professional"
                          className="flex flex-col items-start justify-between rounded-xl border-2 border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold leading-none">
                              Professional Installation
                            </p>
                            <p className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary">
                              I&apos;d like professional help
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Method Preference */}
            <FormField
              control={form.control}
              name="contactMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Preferred Contact Method *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="email"
                          id="contact-email"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="contact-email"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                        >
                          <Mail className="h-5 w-5 mb-2 text-apple-gray-600 dark:text-apple-dark-text-secondary" />
                          <p className="text-sm font-semibold">Email</p>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="phone"
                          id="contact-phone"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="contact-phone"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                        >
                          <Phone className="h-5 w-5 mb-2 text-apple-gray-600 dark:text-apple-dark-text-secondary" />
                          <p className="text-sm font-semibold">Phone</p>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="either"
                          id="contact-either"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="contact-either"
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary p-4 hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all"
                        >
                          <MessageSquare className="h-5 w-5 mb-2 text-apple-gray-600 dark:text-apple-dark-text-secondary" />
                          <p className="text-sm font-semibold">Either</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                Additional Information
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Anything else we should know?
              </p>
            </div>

            {/* Message/Notes Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Message or Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your project, any special requirements, preferred timeline, or questions you have..."
                      className="min-h-[120px] resize-none rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Optional: Share any additional details about your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-apple-gray-200 dark:border-apple-dark-border">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting Request...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Get Your Free Quote
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-apple-gray-500 dark:text-apple-dark-text-tertiary mt-3">
              By submitting this form, you agree to be contacted about your quote request
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

QuoteRequestForm.displayName = 'QuoteRequestForm';

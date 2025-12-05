'use client';

/**
 * Bulk Order Form Component
 *
 * A comprehensive bulk/commercial order inquiry form for contractors and commercial customers
 * Features:
 * - Company information
 * - Contact details (name, email, phone)
 * - Quantity requirements
 * - Product type selection (multiple products with quantities)
 * - Project timeline
 * - Detailed project description
 * - Form validation with react-hook-form and zod
 * - Success/error state handling
 * - Apple-style premium design
 */

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  Mail,
  Building2,
  Package,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Briefcase,
  User,
  Hash,
} from 'lucide-react';

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
import { Label } from '@/components/ui/label';

// Zod validation schema for bulk orders
const bulkOrderSchema = z.object({
  // Company Information
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must not exceed 200 characters'),

  // Contact Information
  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must not exceed 100 characters'),

  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),

  // Product Requirements
  products: z
    .array(
      z.object({
        productSlug: z.string().min(1, 'Please select a product'),
        quantity: z.coerce
          .number()
          .min(1, 'Quantity must be at least 1')
          .max(10000, 'Please contact us directly for orders over 10,000 units'),
      })
    )
    .min(1, 'Please add at least one product'),

  // Timeline
  timeline: z.enum(['urgent', '1-2-weeks', '1-month', '2-3-months', 'flexible'], {
    required_error: 'Please select a timeline',
  }),

  // Project Details
  projectDescription: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your project')
    .max(5000, 'Project description must not exceed 5000 characters'),

  // Optional Fields
  jobTitle: z.string().max(100, 'Job title must not exceed 100 characters').optional(),

  additionalNotes: z
    .string()
    .max(2000, 'Additional notes must not exceed 2000 characters')
    .optional(),
});

type BulkOrderFormValues = z.infer<typeof bulkOrderSchema>;

export interface BulkOrderFormProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: (data: BulkOrderFormValues) => void;
}

/**
 * Bulk Order Form Component
 */
export function BulkOrderForm({ className, onSuccess }: BulkOrderFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  // Initialize form with react-hook-form and zod
  const form = useForm<BulkOrderFormValues>({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      jobTitle: '',
      products: [{ productSlug: '', quantity: 1 }],
      timeline: 'flexible',
      projectDescription: '',
      additionalNotes: '',
    },
  });

  // Field array for dynamic product entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  // Handle form submission
  const onSubmit = async (data: BulkOrderFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/quotes/bulk-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bulk order request');
      }

      const result = await response.json();

      // Success state
      setSubmitStatus('success');

      toast({
        title: 'Bulk Order Request Submitted!',
        description:
          "Thank you for your interest. Our commercial sales team will contact you within 24 hours to discuss your project and provide a detailed quote.",
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
        description:
          'There was an error submitting your bulk order request. Please try again or contact our commercial sales team directly.',
        variant: 'destructive',
      });

      console.error('Bulk order request error:', error);
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
                    Bulk Order Request Submitted Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thank you for your commercial inquiry. Our dedicated sales team will review
                    your requirements and contact you within 24 hours with a customized quote and
                    volume pricing.
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
                    We encountered an error processing your request. Please try again or contact
                    our commercial sales team directly at{' '}
                    <a href="tel:+16135551234" className="font-medium underline">
                      (613) 555-1234
                    </a>{' '}
                    or{' '}
                    <a href="mailto:commercial@example.com" className="font-medium underline">
                      commercial@example.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Company Information Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Tell us about your organization
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Company Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                        <Input
                          placeholder="Acme Construction Ltd."
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
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Primary point of contact for this order
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Name */}
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Contact Name *</FormLabel>
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

              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Job Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                        <Input
                          placeholder="Project Manager"
                          {...field}
                          className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                      Optional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
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
                          placeholder="john@company.com"
                          {...field}
                          className="h-11 pl-10 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Product Requirements Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Requirements
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                What products and quantities do you need?
              </p>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-apple-gray-200 dark:border-apple-dark-border bg-apple-gray-50 dark:bg-apple-dark-bg-secondary p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Label className="text-sm font-medium">
                      Product {index + 1}
                      {index === 0 && ' *'}
                    </Label>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Selection */}
                    <FormField
                      control={form.control}
                      name={`products.${index}.productSlug`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Product Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                                <SelectValue placeholder="Select product..." />
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
                                      {product.category}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name={`products.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Quantity *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                              <Input
                                type="number"
                                min="1"
                                placeholder="100"
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
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productSlug: '', quantity: 1 })}
                className="w-full h-11 rounded-xl border-2 border-dashed border-apple-gray-300 dark:border-apple-dark-border hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Product
              </Button>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                When do you need this order delivered?
              </p>
            </div>

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Required Timeline *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                        <SelectValue placeholder="Select timeline..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary">
                      <SelectItem
                        value="urgent"
                        className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">Urgent (ASAP)</span>
                          <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                            Less than 1 week
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="1-2-weeks"
                        className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">1-2 Weeks</span>
                          <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                            Standard delivery
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="1-month"
                        className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">1 Month</span>
                          <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                            Standard timeline
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="2-3-months"
                        className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">2-3 Months</span>
                          <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                            Extended planning
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="flexible"
                        className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 py-1">
                          <span className="font-medium">Flexible</span>
                          <span className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                            No specific deadline
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Select the timeframe that works best for your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Project Description Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Details
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Help us understand your project requirements
              </p>
            </div>

            {/* Project Description */}
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Project Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project, including:
- Type of project (residential, commercial, renovation, new build)
- Location and number of units/buildings
- Specific requirements or customizations needed
- Installation schedule or constraints
- Any other relevant details..."
                      className="min-h-[160px] resize-none rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Please provide detailed information to help us prepare an accurate quote
                    (minimum 20 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests, questions, or additional information we should know..."
                      className="min-h-[100px] resize-none rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Optional: Include any other details, special requirements, or questions
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
                  Submit Bulk Order Inquiry
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-apple-gray-500 dark:text-apple-dark-text-tertiary mt-3">
              By submitting this form, you agree to be contacted by our commercial sales team
              regarding your bulk order inquiry. We typically respond within 24 hours.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

BulkOrderForm.displayName = 'BulkOrderForm';

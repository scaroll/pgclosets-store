'use client';

/**
 * Contact Sales Form Component
 *
 * A simple contact form for general sales inquiries
 * Features:
 * - Customer information collection (name, email, phone)
 * - Message/inquiry field
 * - "How did you hear about us" dropdown
 * - Form validation with react-hook-form and zod
 * - Success/error state handling
 * - Apple-style premium design
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, XCircle, Loader2, Phone, Mail, MessageSquare, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

// Zod validation schema
const contactSalesSchema = z.object({
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

  // How did you hear about us
  referralSource: z.string()
    .min(1, 'Please let us know how you heard about us'),

  // Message/Inquiry
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

type ContactSalesFormValues = z.infer<typeof contactSalesSchema>;

export interface ContactSalesFormProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: (data: ContactSalesFormValues) => void;
}

/**
 * Contact Sales Form Component
 */
export function ContactSalesForm({
  className,
  onSuccess,
}: ContactSalesFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  // Initialize form with react-hook-form and zod
  const form = useForm<ContactSalesFormValues>({
    resolver: zodResolver(contactSalesSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      referralSource: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ContactSalesFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact request');
      }

      const result = await response.json();

      // Success state
      setSubmitStatus('success');

      toast({
        title: 'Message Sent Successfully!',
        description: 'Thank you for contacting us. Our sales team will get back to you shortly.',
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
        description: 'There was an error sending your message. Please try again or contact us directly.',
        variant: 'destructive',
      });

      console.error('Contact sales error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Referral source options
  const referralSources = [
    { value: 'google', label: 'Google Search' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'friend', label: 'Friend or Family' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'trade-show', label: 'Trade Show/Event' },
    { value: 'existing-customer', label: 'Existing Customer' },
    { value: 'contractor', label: 'Contractor/Designer' },
    { value: 'other', label: 'Other' },
  ];

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
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thank you for reaching out. Our sales team will review your inquiry and contact you within 24 hours.
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
                    We&apos;ll use this to contact you about your inquiry
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* How Did You Hear About Us Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                About Your Inquiry
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Help us serve you better
              </p>
            </div>

            {/* Referral Source Field */}
            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">How did you hear about us? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-apple-gray-400 dark:text-apple-dark-text-tertiary" />
                          <SelectValue placeholder="Select how you found us..." />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary">
                      {referralSources.map((source) => (
                        <SelectItem
                          key={source.value}
                          value={source.value}
                          className="rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary cursor-pointer transition-colors"
                        >
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    This helps us understand how to reach more customers like you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Message Section */}
          <div className="space-y-6">
            <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-3">
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-dark-text-primary">
                Your Message
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary mt-1">
                Tell us about your needs
              </p>
            </div>

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project, requirements, questions, or how we can help you..."
                      className="min-h-[150px] resize-none rounded-xl border-apple-gray-300 dark:border-apple-dark-border bg-white dark:bg-apple-dark-bg-secondary focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-apple-gray-500 dark:text-apple-dark-text-tertiary">
                    Please provide as much detail as possible to help us assist you better
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
                  Sending Message...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Sales Team
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-apple-gray-500 dark:text-apple-dark-text-tertiary mt-3">
              By submitting this form, you agree to be contacted by our sales team
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

ContactSalesForm.displayName = 'ContactSalesForm';

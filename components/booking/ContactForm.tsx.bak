'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingData } from '@/app/book/page';

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^\d{3}-?\d{3}-?\d{4}$/, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/, 'Please enter a valid postal code'),
  preferredContact: z.enum(['email', 'phone', 'text']),
  hearAboutUs: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContactForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || 'Ottawa',
      postalCode: data.postalCode || '',
      preferredContact: data.preferredContact || 'email',
      hearAboutUs: data.hearAboutUs || '',
    },
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  };

  const onSubmit = (formData: ContactFormData) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              setValue('phone', formatted);
            }}
            placeholder="613-555-1234"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address">Street Address *</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="123 Main Street"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* City and Postal Code */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Select
            defaultValue={watch('city')}
            onValueChange={(value) => setValue('city', value)}
          >
            <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ottawa">Ottawa</SelectItem>
              <SelectItem value="Kanata">Kanata</SelectItem>
              <SelectItem value="Orleans">Orleans</SelectItem>
              <SelectItem value="Barrhaven">Barrhaven</SelectItem>
              <SelectItem value="Nepean">Nepean</SelectItem>
              <SelectItem value="Gloucester">Gloucester</SelectItem>
              <SelectItem value="Gatineau">Gatineau</SelectItem>
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            onChange={(e) => {
              const formatted = formatPostalCode(e.target.value);
              setValue('postalCode', formatted);
            }}
            placeholder="K1A 0B1"
            maxLength={7}
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      {/* Preferred Contact Method */}
      <div>
        <Label>Preferred Contact Method *</Label>
        <RadioGroup
          defaultValue={watch('preferredContact')}
          onValueChange={(value) => setValue('preferredContact', value as any)}
          className="flex gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email-contact" />
            <Label htmlFor="email-contact" className="font-normal cursor-pointer">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone-contact" />
            <Label htmlFor="phone-contact" className="font-normal cursor-pointer">
              Phone Call
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text-contact" />
            <Label htmlFor="text-contact" className="font-normal cursor-pointer">
              Text Message
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* How Did You Hear About Us */}
      <div>
        <Label htmlFor="hearAboutUs">How Did You Hear About Us? (Optional)</Label>
        <Select
          defaultValue={watch('hearAboutUs')}
          onValueChange={(value) => setValue('hearAboutUs', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Please select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">Google Search</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="referral">Friend/Family Referral</SelectItem>
            <SelectItem value="flyer">Flyer/Mail</SelectItem>
            <SelectItem value="trade-show">Trade Show/Event</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p>
          Your information is secure and will only be used to contact you about your appointment.
          We never share your personal information with third parties.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
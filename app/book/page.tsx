'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ServiceSelection from '@/components/booking/ServiceSelection';
import DateTimePicker from '@/components/booking/DateTimePicker';
import ContactForm from '@/components/booking/ContactForm';
import ProjectDetails from '@/components/booking/ProjectDetails';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import AIBookingAssistant from '@/components/booking/AIBookingAssistant';

export interface BookingData {
  service?: string;
  date?: Date;
  timeSlot?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  projectType?: string;
  roomDimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  budget?: string;
  timeline?: string;
  additionalNotes?: string;
  preferredContact?: 'email' | 'phone' | 'text';
  hearAboutUs?: string;
}

const steps = [
  { id: 1, name: 'Service', title: 'Select Your Service' },
  { id: 2, name: 'Schedule', title: 'Pick Date & Time' },
  { id: 3, name: 'Contact', title: 'Your Information' },
  { id: 4, name: 'Details', title: 'Project Details' },
  { id: 5, name: 'Confirm', title: 'Confirmation' },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [showAssistant, setShowAssistant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      // Auto-save to localStorage
      localStorage.setItem('bookingProgress', JSON.stringify({
        step: currentStep + 1,
        data: bookingData
      }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        nextStep();
        localStorage.removeItem('bookingProgress');
      } else {
        throw new Error('Booking submission failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={bookingData.service}
            onSelect={(service) => updateBookingData({ service })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DateTimePicker
            selectedDate={bookingData.date}
            selectedTime={bookingData.timeSlot}
            service={bookingData.service}
            onSelect={(date, timeSlot) => updateBookingData({ date, timeSlot })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ContactForm
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <ProjectDetails
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={handleSubmit}
            onBack={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gold text-slate-900 text-sm font-medium rounded-full mb-4 tracking-wider uppercase">
                Premium Design Services
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Book Your
              <span className="block text-gold">Exclusive Consultation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your space with personalized design guidance from Ottawa's premier closet design experts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="flex items-center justify-center gap-2 text-gold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">4.9/5 Customer Rating</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>45-Minute Consultation</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>No Obligation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badges */}
          <div className="text-center mb-12">
            <div className="inline-flex flex-wrap items-center justify-center gap-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Licensed & Insured</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">15+ Years Experience</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">500+ Happy Clients</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Award-Winning Service</span>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? 'text-slate-900' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.id <= currentStep
                        ? 'border-gold bg-gold text-white shadow-lg scale-110'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block font-medium">{step.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-gold to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {currentStep === 1 && "Choose the service that best matches your needs"}
                {currentStep === 2 && "Select a convenient date and time for your consultation"}
                {currentStep === 3 && "Provide your contact information so we can reach you"}
                {currentStep === 4 && "Tell us about your project to help us prepare"}
                {currentStep === 5 && "Review your appointment details and confirm"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced AI Assistant & Help Section */}
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={() => setShowAssistant(!showAssistant)}
              className="text-slate-700 border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showAssistant ? 'Hide' : 'Need Help?'} AI Assistant
            </Button>

            {/* Additional Help Options */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
              <a href="tel:613-123-4567" className="flex items-center gap-2 text-slate-600 hover:text-gold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (613) 123-4567
              </a>
              <a href="mailto:info@pgclosets.ca" className="flex items-center gap-2 text-slate-600 hover:text-gold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon-Fri 9AM-6PM
              </div>
            </div>
          </div>

          {/* Enhanced AI Assistant */}
          <AnimatePresence>
            {showAssistant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">AI Design Assistant</h3>
                      <p className="text-sm text-gray-600">Get instant help with your booking</p>
                    </div>
                  </div>
                  <AIBookingAssistant
                    bookingData={bookingData}
                    onUpdateBooking={updateBookingData}
                    onNavigate={setCurrentStep}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Testimonial Preview */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700 italic mb-4">
              "The consultation was incredibly helpful. They transformed our messy closet into a beautiful, organized space. Best investment we made!"
            </p>
            <p className="text-sm text-gray-600">- Sarah & Mike, Ottawa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
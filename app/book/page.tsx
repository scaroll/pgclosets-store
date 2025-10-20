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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Appointment
            </h1>
            <p className="text-xl text-gray-600">
              Schedule your free consultation in just a few minutes
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.id <= currentStep
                        ? 'border-blue-600 bg-blue-600 text-white'
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
                      step.id
                    )}
                  </div>
                  <span className="text-xs mt-2 hidden sm:block">{step.name}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {steps[currentStep - 1]?.title}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI Assistant Toggle */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowAssistant(!showAssistant)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              {showAssistant ? 'Hide' : 'Need Help?'} AI Booking Assistant
            </Button>
          </div>

          {/* AI Assistant */}
          <AnimatePresence>
            {showAssistant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6"
              >
                <AIBookingAssistant
                  bookingData={bookingData}
                  onUpdateBooking={updateBookingData}
                  onNavigate={setCurrentStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
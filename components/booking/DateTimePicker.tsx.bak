'use client';

import { useState } from 'react';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  service?: string;
  onSelect: (date: Date, timeSlot: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DateTimePicker({
  selectedDate,
  selectedTime,
  service,
  onSelect,
  onNext,
  onBack,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [time, setTime] = useState<string | undefined>(selectedTime);

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    // Reset time when date changes
    setTime(undefined);
  };

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime);
    if (date) {
      onSelect(date, newTime);
    }
  };

  const handleContinue = () => {
    if (date && time) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Reminder */}
      {service && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            You're booking a <strong>{service}</strong> appointment
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select a Date
          </h3>
          <Calendar
            selectedDate={date}
            onSelectDate={handleDateSelect}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days ahead
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose a Time
          </h3>
          {date ? (
            <TimeSlotPicker
              selectedDate={date}
              selectedTime={time}
              onSelectTime={handleTimeSelect}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-center">
                Please select a date first
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!date || !time}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
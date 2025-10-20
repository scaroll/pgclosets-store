'use client';

import { useState, useMemo } from 'react';
import { Clock, Sunrise, Sun, Sunset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
  preferred?: boolean;
}

interface TimeSlotPickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onSelectTime: (time: string) => void;
  availableSlots?: TimeSlot[];
  timezone?: string;
  bufferMinutes?: number;
  className?: string;
}

const defaultTimeSlots: TimeSlot[] = [
  // Morning slots (9 AM - 12 PM)
  { time: '09:00', available: true, preferred: true },
  { time: '09:30', available: true, preferred: true },
  { time: '10:00', available: true, preferred: true },
  { time: '10:30', available: true, preferred: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },

  // Afternoon slots (12 PM - 5 PM)
  { time: '12:00', available: false }, // Lunch break
  { time: '12:30', available: false }, // Lunch break
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true, preferred: true },
  { time: '14:30', available: true, preferred: true },
  { time: '15:00', available: true, preferred: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },

  // Evening slots (5 PM - 8 PM)
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true, preferred: true },
  { time: '18:30', available: true, preferred: true },
  { time: '19:00', available: true },
  { time: '19:30', available: true },
];

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  availableSlots = defaultTimeSlots,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  bufferMinutes = 30,
  className,
}: TimeSlotPickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const timeSlotsByPeriod = useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    availableSlots.forEach(slot => {
      const hour = parseInt((slot.time || '').split(':')[0]);

      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  }, [availableSlots]);

  const currentPeriodSlots = timeSlotsByPeriod[selectedPeriod];

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = (time || '').split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const availableCount = useMemo(() => {
    return {
      morning: timeSlotsByPeriod.morning.filter(s => s.available).length,
      afternoon: timeSlotsByPeriod.afternoon.filter(s => s.available).length,
      evening: timeSlotsByPeriod.evening.filter(s => s.available).length,
    };
  }, [timeSlotsByPeriod]);

  const handleKeyDown = (e: React.KeyboardEvent, time: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectTime(time);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Selected Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      )}

      {/* Period Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Button
          variant={selectedPeriod === 'morning' ? 'secondary' : 'outline'}
          onClick={() => setSelectedPeriod('morning')}
          className="flex flex-col items-center py-4"
        >
          <Sunrise className="w-5 h-5 mb-2" />
          <span className="text-sm font-medium">Morning</span>
          <Badge variant="secondary" className="mt-1">
            {availableCount.morning} slots
          </Badge>
        </Button>

        <Button
          variant={selectedPeriod === 'afternoon' ? 'secondary' : 'outline'}
          onClick={() => setSelectedPeriod('afternoon')}
          className="flex flex-col items-center py-4"
        >
          <Sun className="w-5 h-5 mb-2" />
          <span className="text-sm font-medium">Afternoon</span>
          <Badge variant="secondary" className="mt-1">
            {availableCount.afternoon} slots
          </Badge>
        </Button>

        <Button
          variant={selectedPeriod === 'evening' ? 'secondary' : 'outline'}
          onClick={() => setSelectedPeriod('evening')}
          className="flex flex-col items-center py-4"
        >
          <Sunset className="w-5 h-5 mb-2" />
          <span className="text-sm font-medium">Evening</span>
          <Badge variant="secondary" className="mt-1">
            {availableCount.evening} slots
          </Badge>
        </Button>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Available Time Slots
          </h3>
          <div className="flex items-center text-xs text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            <span>{timezone}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {currentPeriodSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isAvailable = slot.available;
            const isPreferred = slot.preferred;

            return (
              <button
                key={slot.time}
                onClick={() => isAvailable && onSelectTime(slot.time)}
                onKeyDown={(e) => handleKeyDown(e, slot.time)}
                disabled={!isAvailable}
                className={cn(
                  'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  {
                    // Selected state
                    'bg-blue-600 text-white shadow-md': isSelected && isAvailable,

                    // Available states
                    'bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-400 hover:bg-blue-50':
                      !isSelected && isAvailable && !isPreferred,

                    // Preferred time slots
                    'bg-green-50 border-2 border-green-300 text-green-800 hover:bg-green-100':
                      !isSelected && isAvailable && isPreferred,

                    // Unavailable state
                    'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60': !isAvailable,
                  }
                )}
                aria-label={`Select ${formatTimeDisplay(slot.time)}`}
                aria-selected={isSelected}
                aria-disabled={!isAvailable}
              >
                {formatTimeDisplay(slot.time)}

                {/* Preferred indicator */}
                {isPreferred && isAvailable && !isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded" />
          <span>Preferred</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <span>Unavailable</span>
        </div>
      </div>

      {/* Buffer Time Notice */}
      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Note:</strong> We schedule {bufferMinutes} minutes between appointments
          to ensure quality service. Your appointment may last 60-90 minutes.
        </p>
      </div>

      {/* Accessibility Help Text */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedTime && `Selected time: ${formatTimeDisplay(selectedTime)}`}
      </div>
    </div>
  );
}
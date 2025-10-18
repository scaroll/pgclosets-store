'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  getDay,
  parseISO,
} from 'date-fns';

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  availableDates?: Date[];
  blockedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// Canadian holidays for 2024-2025
const holidays = [
  '2024-12-25', // Christmas
  '2024-12-26', // Boxing Day
  '2025-01-01', // New Year's Day
  '2025-02-17', // Family Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-05-19', // Victoria Day
  '2025-07-01', // Canada Day
  '2025-08-04', // Civic Holiday
  '2025-09-01', // Labour Day
  '2025-10-13', // Thanksgiving
  '2025-11-11', // Remembrance Day
  '2025-12-25', // Christmas
  '2025-12-26', // Boxing Day
];

export default function Calendar({
  selectedDate,
  onSelectDate,
  availableDates,
  blockedDates = [],
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const holidayDates = useMemo(() =>
    holidays.map(h => parseISO(h)),
    []
  );

  const isDateBlocked = (date: Date) => {
    // Check if it's a Sunday
    if (getDay(date) === 0) return true;

    // Check if it's a holiday
    if (holidayDates.some(holiday => isSameDay(holiday, date))) return true;

    // Check if it's in blocked dates
    if (blockedDates.some(blocked => isSameDay(blocked, date))) return true;

    // Check if it's outside min/max range
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return true;

    // If available dates are specified, check if date is not in the list
    if (availableDates && !availableDates.some(available => isSameDay(available, date))) {
      return true;
    }

    return false;
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDateBlocked(date)) {
        onSelectDate(date);
      }
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          disabled={isBefore(startOfMonth(currentMonth), minDate)}
          aria-label="Previous month"
          icon={<ChevronLeft className="w-5 h-5" />}
        />

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          disabled={isAfter(endOfMonth(currentMonth), maxDate)}
          aria-label="Next month"
          icon={<ChevronRight className="w-5 h-5" />}
        />
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isHovered = hoveredDate && isSameDay(day, hoveredDate);
          const isTodayDate = isToday(day);
          const isBlocked = isDateBlocked(day);

          return (
            <button
              key={index}
              onClick={() => !isBlocked && onSelectDate(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              onKeyDown={(e) => handleKeyDown(e, day)}
              disabled={isBlocked}
              className={cn(
                'relative h-10 rounded-lg text-sm transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                {
                  // Current month vs other months
                  'text-gray-900': isCurrentMonth && !isBlocked,
                  'text-gray-400': !isCurrentMonth || isBlocked,

                  // Today
                  'font-semibold': isTodayDate,

                  // Selected state
                  'bg-blue-600 text-white hover:bg-blue-700': isSelected && !isBlocked,

                  // Hover state
                  'bg-gray-100': isHovered && !isSelected && !isBlocked,

                  // Available/Blocked states
                  'hover:bg-gray-100 cursor-pointer': !isBlocked && !isSelected,
                  'cursor-not-allowed opacity-50': isBlocked,
                  'bg-gray-50': isBlocked && isCurrentMonth,
                }
              )}
              aria-label={format(day, 'PPPP')}
              aria-selected={isSelected}
              aria-disabled={isBlocked}
              role="gridcell"
            >
              {format(day, 'd')}

              {/* Today Indicator */}
              {isTodayDate && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}

              {/* Holiday/Sunday Indicator */}
              {(getDay(day) === 0 || holidayDates.some(h => isSameDay(h, day))) &&
                isCurrentMonth && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full" />
          <span>Holiday/Sunday</span>
        </div>
      </div>

      {/* Accessibility Help Text */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedDate && `Selected date: ${format(selectedDate, 'PPPP')}`}
      </div>
    </div>
  );
}
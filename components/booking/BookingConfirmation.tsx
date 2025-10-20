'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '@/app/book/page';
import { getServiceBySlug } from '@/lib/services';
// Import confetti if available (install: npm install canvas-confetti)
// import confetti from 'canvas-confetti';
import Link from 'next/link';

interface BookingConfirmationProps {
  bookingData: BookingData;
}

export default function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const service = bookingData.service ? getServiceBySlug(bookingData.service) : null;

  useEffect(() => {
    // Trigger confetti animation (if canvas-confetti is installed)
    // Uncomment after installing: npm install canvas-confetti
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 }
    // });
  }, []);

  const formatTime = (time: string | undefined) => {
    if (!time) return '';
    const [hours, minutes] = (time || '').split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleShare = () => {
    const text = `My appointment with PG Closets is confirmed for ${
      bookingData.date ? format(bookingData.date, 'EEEE, MMMM d, yyyy') : ''
    } at ${bookingData.timeSlot ? formatTime(bookingData.timeSlot) : ''}`;

    if (navigator.share) {
      navigator.share({
        title: 'PG Closets Appointment',
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCalendar = () => {
    if (!bookingData.date || !bookingData.timeSlot) return;

    const [hours, minutes] = (bookingData.timeSlot || '').split(':');
    const startDate = new Date(bookingData.date || '');
    startDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'));

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2); // 2-hour appointment

    const event = {
      title: `PG Closets - ${service?.name}`,
      start: startDate.toISOString().replace(/-|:|\.\d\d\d/g, ''),
      end: endDate.toISOString().replace(/-|:|\.\d\d\d/g, ''),
      description: `${service?.name} appointment with PG Closets`,
      location: `${bookingData.address}, ${bookingData.city}, ON ${bookingData.postalCode}`,
    };

    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([calendar], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pg-closets-appointment.ics';
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success Message */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-600">
          Your appointment has been successfully scheduled
        </p>
      </div>

      {/* Booking Details Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-xl">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Service */}
          {service && (
            <div className="flex items-start gap-3">
              <service.icon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-600">{service.duration}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">
                  {bookingData.date && format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">
                  {bookingData.timeSlot && formatTime(bookingData.timeSlot)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-900">
                  {bookingData.firstName} {bookingData.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {bookingData.address}, {bookingData.city}, ON {bookingData.postalCode}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <p className="text-gray-900">{bookingData.phone}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <p className="text-gray-900">{bookingData.email}</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          {(bookingData.projectType || bookingData.budget) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Project Information</h3>

                {bookingData.projectType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Type:</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.projectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )}

                {bookingData.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget Range:</span>
                    <span className="font-medium text-gray-900">{bookingData.budget}</span>
                  </div>
                )}

                {bookingData.timeline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.timeline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleDownloadCalendar}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Share Details'}
        </Button>
      </div>

      {/* What's Next */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </div>
            <p className="text-sm text-blue-800">
              You'll receive a confirmation email with all the appointment details within the next few minutes.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </div>
            <p className="text-sm text-blue-800">
              We'll send you a reminder 24 hours before your appointment.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </div>
            <p className="text-sm text-blue-800">
              Our designer will arrive at your home at the scheduled time with samples and design tools.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Need to make changes? Call us at{' '}
          <a href="tel:+16137016393" className="font-semibold text-blue-600 hover:underline">
            (613) 701-6393
          </a>
        </p>

        <Button variant="outline" asChild>
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
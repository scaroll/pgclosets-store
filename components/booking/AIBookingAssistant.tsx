'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse, isValid, addDays } from 'date-fns';
import { BookingData } from '@/app/book/page';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface AIBookingAssistantProps {
  bookingData: BookingData;
  onUpdateBooking: (data: Partial<BookingData>) => void;
  onNavigate: (step: number) => void;
}

// Natural language processing for date/time
const parseNaturalDate = (input: string): Date | null => {
  const lowerInput = input.toLowerCase();
  const today = new Date();

  // Handle relative dates
  if (lowerInput.includes('today')) return today;
  if (lowerInput.includes('tomorrow')) return addDays(today, 1);
  if (lowerInput.includes('day after tomorrow')) return addDays(today, 2);

  // Handle weekday names
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < weekdays.length; i++) {
    if (lowerInput.includes(weekdays[i])) {
      const currentDay = today.getDay();
      let daysToAdd = i - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Next week
      return addDays(today, daysToAdd);
    }
  }

  // Try parsing common date formats
  const formats = ['MM/dd/yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd', 'MMMM d, yyyy'];
  for (const formatStr of formats) {
    const parsed = parse(input, formatStr, new Date());
    if (isValid(parsed)) return parsed;
  }

  return null;
};

// Parse time from natural language
const parseNaturalTime = (input: string): string | null => {
  const lowerInput = input.toLowerCase();

  // Handle morning/afternoon/evening preferences
  if (lowerInput.includes('morning')) return '10:00';
  if (lowerInput.includes('afternoon')) return '14:00';
  if (lowerInput.includes('evening')) return '18:00';

  // Extract time patterns (e.g., "2pm", "2:30 PM", "14:00")
  const timePatterns = [
    /(\d{1,2}):?(\d{0,2})\s*(am|pm)/i,
    /(\d{1,2}):(\d{2})/,
  ];

  for (const pattern of timePatterns) {
    const match = lowerInput.match(pattern);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const period = match[3]?.toLowerCase();

      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  return null;
};

export default function AIBookingAssistant({
  bookingData,
  onUpdateBooking,
  onNavigate,
}: AIBookingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your booking assistant. I can help you schedule your appointment quickly. Just tell me what service you need and when you'd like to come in. For example, "I need a consultation next Tuesday afternoon" or "I want to book a measurement for this weekend."`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const processUserInput = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    // Service detection
    if (lowerMessage.includes('consultation') || lowerMessage.includes('consult')) {
      onUpdateBooking({ service: 'consultation' });
      onNavigate(2);
      return "Great! I've selected a consultation for you. Now let's pick a date and time. When works best for you?";
    }

    if (lowerMessage.includes('measurement') || lowerMessage.includes('measure')) {
      onUpdateBooking({ service: 'measurement' });
      onNavigate(2);
      return "Perfect! I've selected professional measurement. When would you like to schedule this?";
    }

    if (lowerMessage.includes('installation') || lowerMessage.includes('install')) {
      onUpdateBooking({ service: 'installation' });
      onNavigate(2);
      return "Excellent! Let's schedule your installation. What date and time work for you?";
    }

    // Date and time parsing
    const parsedDate = parseNaturalDate(userMessage);
    const parsedTime = parseNaturalTime(userMessage);

    if (parsedDate || parsedTime) {
      const updates: Partial<BookingData> = {};
      let response = '';

      if (parsedDate) {
        updates.date = parsedDate;
        response += `I've set the date to ${format(parsedDate, 'EEEE, MMMM d, yyyy')}. `;
      }

      if (parsedTime) {
        updates.timeSlot = parsedTime;
        const [hours, minutes] = parsedTime.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        response += `The time is set to ${displayHour}:${minutes} ${period}. `;
      }

      onUpdateBooking(updates);

      if (parsedDate && parsedTime && bookingData.service) {
        onNavigate(3);
        response += "Perfect! Now I need your contact information. What's your name and phone number?";
      } else if (!bookingData.service) {
        response += "What service would you like to book?";
      } else if (!parsedDate) {
        response += "What date would work for you?";
      } else if (!parsedTime) {
        response += "What time would you prefer?";
      }

      return response;
    }

    // Contact information extraction
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;

    const emailMatch = userMessage.match(emailPattern);
    const phoneMatch = userMessage.match(phonePattern);

    if (emailMatch || phoneMatch) {
      const updates: Partial<BookingData> = {};
      let response = 'Got it! ';

      if (emailMatch) {
        updates.email = emailMatch[0];
        response += `Email: ${emailMatch[0]}. `;
      }

      if (phoneMatch) {
        updates.phone = phoneMatch[0];
        response += `Phone: ${phoneMatch[0]}. `;
      }

      onUpdateBooking(updates);
      onNavigate(4);
      return response + "Now, can you tell me about your project? What type of closet are you looking to organize?";
    }

    // Budget detection
    if (lowerMessage.includes('budget') || lowerMessage.includes('$')) {
      const budgetMatch = userMessage.match(/\$?(\d+,?\d*)/);
      if (budgetMatch) {
        onUpdateBooking({ budget: `$${budgetMatch[1]}` });
        return `I've noted your budget of $${budgetMatch[1]}. Our designer will work within your budget to create the perfect solution. Anything else you'd like to add?`;
      }
    }

    // Handle confirmation
    if (lowerMessage.includes('confirm') || lowerMessage.includes('book it') || lowerMessage.includes('yes')) {
      if (bookingData.service && bookingData.date && bookingData.timeSlot) {
        onNavigate(5);
        return "Perfect! I'm confirming your appointment now. You'll receive an email confirmation shortly!";
      }
    }

    // Transfer to human
    if (lowerMessage.includes('speak') || lowerMessage.includes('human') || lowerMessage.includes('call')) {
      return "I understand you'd prefer to speak with someone. Please call us at (613) 701-6393, or I can help you complete the booking online. How would you like to proceed?";
    }

    // Default response for unclear input
    return "I'm not quite sure what you mean. Could you tell me: 1) What service you need (consultation, measurement, or installation), 2) Your preferred date and time, or 3) Your contact information?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(async () => {
      const response = await processUserInput(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Booking Assistant</h3>
            <p className="text-xs text-blue-100">Here to help you book quickly</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          asChild
        >
          <a href="tel:+16137016393">
            <Phone className="w-4 h-4 mr-2" />
            Call Instead
          </a>
        </Button>
      </div>

      <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}

                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {format(message.timestamp, 'h:mm a')}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("I need a free consultation")}
            className="text-xs"
          >
            Free Consultation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Next available appointment")}
            className="text-xs"
          >
            Next Available
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("I prefer mornings")}
            className="text-xs"
          >
            Morning Preference
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("This weekend works")}
            className="text-xs"
          >
            Weekend
          </Button>
        </div>
      </div>
    </Card>
  );
}
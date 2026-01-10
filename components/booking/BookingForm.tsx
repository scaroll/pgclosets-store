'use client'

import { Calendar } from '@/components/booking/Calendar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createBookingSchema } from '@/lib/validation/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Ruler, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { cn } from '@/lib/utils'

const SERVICES = [
  { value: 'consultation', label: 'Consultation', duration: '1 hr', icon: CalendarDays, description: "Let's discuss your vision and needs." },
  { value: 'measurement', label: 'Measurement', duration: '1 hr', icon: Ruler, description: "Precision measurements for a perfect fit." },
  { value: 'installation', label: 'Installation', duration: '4 hrs', icon: Wrench, description: "Professional installation of your system." },
]

const LOCATIONS = ['Ottawa', 'Kanata', 'Barrhaven', 'Nepean', 'Orleans']

type BookingFormValues = z.infer<typeof createBookingSchema>

const steps = [
  { id: 1, title: 'Choose Service' },
  { id: 2, title: 'Select Date' },
  { id: 3, title: 'Your Details' },
]

export function BookingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      service: 'consultation',
      location: 'Ottawa',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      projectDescription: '',
    },
  })

  const nextStep = () => {
    if (currentStep === 1 && !form.getValues('service')) {
      toast.error('Please select a service')
      return
    }
    if (currentStep === 2 && !date) {
      toast.error('Please select a date')
      return
    }
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  async function onSubmit(data: BookingFormValues) {
    if (!date) {
      toast.error('Please select a date')
      return
    }

    const bookingDate = new Date(date)
    bookingDate.setHours(9, 0, 0, 0)
    data.date = bookingDate.toISOString()

    setLoading(true)
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json() as { error?: string }

      if (!res.ok) {
        throw new Error(result.error || 'Failed to book')
      }

      toast.success('Booking confirmed! We will contact you shortly.')
      form.reset()
      setCurrentStep(1) // Reset to start
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-10 px-4">
            {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 border-2",
                        currentStep >= step.id ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-400"
                    )}>
                        {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={cn("text-xs font-medium mt-2 absolute -bottom-6 w-32 text-center", currentStep >= step.id ? "text-black" : "text-gray-400")}>{step.title}</span>
                </div>
            ))}
            {/* Thread line */}
            <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gray-100 -z-0" aria-hidden="true">
                 <div 
                    className="h-full bg-black transition-all duration-500 ease-out" 
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
            </div>
        </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 p-8 border border-gray-100 mt-8 min-h-[500px] flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col justify-between flex-grow">
            
            <AnimatePresence mode="wait">
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-center mb-6">What service do you need?</h2>
                        <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem className="grid gap-4">
                                    {SERVICES.map((service) => (
                                        <button
                                            key={service.value}
                                            type="button"
                                            onClick={() => field.onChange(service.value)}
                                            className={cn(
                                                "flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-black/20 text-left",
                                                field.value === service.value ? "border-black bg-black/5" : "border-gray-100 bg-white"
                                            )}
                                        >
                                            <div className={cn("p-3 rounded-full mr-4", field.value === service.value ? "bg-black text-white" : "bg-gray-100 text-gray-600")}>
                                                <service.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{service.label}</h3>
                                                <p className="text-sm text-gray-500">{service.description}</p>
                                            </div>
                                            <div className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                                {service.duration}
                                            </div>
                                        </button>
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                         <h2 className="text-2xl font-bold tracking-tight text-center mb-6">Pick a Date</h2>
                         <div className="border rounded-xl p-4 shadow-sm bg-white">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0,0,0,0))}
                                className="rounded-md"
                            />
                         </div>
                         <p className="text-sm text-gray-500 mt-4 text-center">
                            We usually arrive between 9:00 AM and 10:00 AM.
                         </p>
                    </motion.div>
                )}

                {currentStep === 3 && (
                     <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                     >
                        <h2 className="text-2xl font-bold tracking-tight text-center mb-6">Final Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="guestName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="guestEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="john@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="guestPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl><Input placeholder="(613) 555-0123" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Location</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {LOCATIONS.map(l => (
                                        <SelectItem key={l} value={l}>
                                        {l}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="projectDescription"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Project Notes (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Any specific details we should know?" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between pt-8 border-t mt-8">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1 || loading}
                    className={currentStep === 1 ? 'invisible' : ''}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep} className="bg-black hover:bg-gray-800 text-white rounded-full px-8">
                        Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800 text-white rounded-full px-8">
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

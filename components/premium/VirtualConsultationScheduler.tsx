"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  MessageCircle,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
  Award,
  Zap,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Share as ShareIcon,
  Download,
  Send,
  Paperclip,
  Smile,
  Settings,
  User,
  Mail,
  Phone as PhoneIcon
} from 'lucide-react'

interface TimeSlot {
  id: string
  time: string
  available: boolean
  consultant?: string
  rating?: number
  specialty?: string[]
}

interface Consultant {
  id: string
  name: string
  avatar: string
  specialties: string[]
  rating: number
  reviews: number
  languages: string[]
  experience: string
  price: number
  available: boolean
}

interface ConsultationType {
  id: string
  name: string
  description: string
  duration: number
  price: number
  icon: React.ReactNode
  features: string[]
}

interface VirtualConsultationSchedulerProps {
  consultants: Consultant[]
  consultationTypes: ConsultationType[]
  onBookingComplete?: (booking: any) => void
  enableRecording?: boolean
  enableScreenShare?: boolean
  enableChat?: boolean
  className?: string
}

export const VirtualConsultationScheduler: React.FC<VirtualConsultationSchedulerProps> = ({
  consultants,
  consultationTypes,
  onBookingComplete,
  enableRecording = true,
  enableScreenShare = true,
  enableChat = true,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant>()
  const [selectedType, setSelectedType] = useState<ConsultationType>()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    address: '',
    projectType: '',
    budget: ''
  })
  const [isInSession, setIsInSession] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, time: Date}>>([])
  const [newMessage, setNewMessage] = useState('')

  // Generate time slots for selected date
  const generateTimeSlots = useCallback((): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const available = Math.random() > 0.3 // Simulate availability
        slots.push({
          id: `slot-${hour}-${minute}`,
          time,
          available,
          consultant: available ? consultants[Math.floor(Math.random() * consultants.length)]?.name : undefined,
          rating: available ? 4 + Math.random() : undefined
        })
      }
    }
    return slots
  }, [consultants])

  const timeSlots = generateTimeSlots()

  // Handle booking submission
  const handleBookingSubmit = () => {
    const booking = {
      date: selectedDate,
      time: selectedTime,
      consultant: selectedConsultant,
      type: selectedType,
      details: bookingDetails,
      bookingId: `BK-${Date.now()}`
    }
    onBookingComplete?.(booking)
    setCurrentStep(5)
  }

  // Start consultation session
  const startSession = () => {
    setIsInSession(true)
    setCurrentStep(6)
  }

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        sender: 'You',
        message: newMessage,
        time: new Date()
      }])
      setNewMessage('')
    }
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {!isInSession ? (
        <div className="space-y-6">
          {/* Progress Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Type</span>
                <span>Consultant</span>
                <span>Date</span>
                <span>Details</span>
                <span>Confirm</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Consultation Type */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Consultation Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consultationTypes.map((type) => (
                      <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedType?.id === type.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedType(type)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {type.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{type.name}</h3>
                              <p className="text-sm text-muted-foreground">{type.duration} min</p>
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                              ${type.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {type.description}
                          </p>
                          <div className="space-y-1">
                            {type.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedType}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Select Consultant */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Consultant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consultants.filter(c => c.available).map((consultant) => (
                      <motion.div
                        key={consultant.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedConsultant?.id === consultant.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedConsultant(consultant)}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={consultant.avatar}
                              alt={consultant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{consultant.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{consultant.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{consultant.reviews} reviews</span>
                              </div>
                            </div>
                            <Badge variant="outline">${consultant.price}/hr</Badge>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Specialties</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {consultant.specialties.slice(0, 3).map((specialty, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{consultant.experience} experience</span>
                              <span>{consultant.languages.length} languages</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!selectedConsultant}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Select Date & Time */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTime === slot.time ? 'default' : 'outline'}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className="h-auto py-2 flex flex-col"
                          >
                            <span className="font-medium">{slot.time}</span>
                            {slot.consultant && (
                              <span className="text-xs opacity-70">{slot.consultant}</span>
                            )}
                            {!slot.available && (
                              <span className="text-xs text-red-500">Unavailable</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Booking Details */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={bookingDetails.name}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingDetails.email}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={bookingDetails.phone}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select value={bookingDetails.projectType} onValueChange={(value) => setBookingDetails(prev => ({ ...prev, projectType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                          <SelectItem value="bathroom">Bathroom Renovation</SelectItem>
                          <SelectItem value="closet">Closet Design</SelectItem>
                          <SelectItem value="office">Home Office</SelectItem>
                          <SelectItem value="living">Living Room</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={bookingDetails.budget} onValueChange={(value) => setBookingDetails(prev => ({ ...prev, budget: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k+">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="address">Service Address</Label>
                      <Input
                        id="address"
                        value={bookingDetails.address}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Your service address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={bookingDetails.notes}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Tell us about your project, goals, or any specific requirements..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      Previous
                    </Button>
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your consultation has been scheduled. We'll send a confirmation email with all the details.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                    <h3 className="font-medium mb-3">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consultation:</span>
                        <span>{selectedType?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consultant:</span>
                        <span>{selectedConsultant?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{selectedType?.duration} minutes</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total:</span>
                        <span>${selectedType?.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => window.print()}>
                      Download Confirmation
                    </Button>
                    <Button onClick={startSession}>
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      ) : (
        /* Virtual Session Interface */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen bg-background"
        >
          <div className="h-full flex flex-col">
            {/* Session Header */}
            <div className="bg-card border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-medium">Session Active</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span>{selectedConsultant?.name}</span>
                  <Badge variant="secondary">{selectedType?.name}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  {enableRecording && (
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isRecording ? 'Recording' : 'Record'}
                    </Button>
                  )}
                  {enableScreenShare && (
                    <Button variant="outline" size="sm">
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share Screen
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setIsInSession(false)}>
                    End Session
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Session Area */}
            <div className="flex-1 flex">
              {/* Video Area */}
              <div className="flex-1 relative bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">{selectedConsultant?.name}</p>
                    <p className="text-sm opacity-70">Waiting for consultant to join...</p>
                  </div>
                </div>

                {/* Local Video */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {isVideoOff ? (
                      <VideoOff className="h-8 w-8" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                </div>

                {/* Session Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={isVideoOff ? "destructive" : "secondary"}
                    size="lg"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                  <Button variant="destructive" size="lg" onClick={() => setIsInSession(false)}>
                    <Phone className="h-5 w-5 transform rotate-135" />
                  </Button>
                </div>
              </div>

              {/* Chat Sidebar */}
              {enableChat && (
                <div className="w-80 bg-card border-l flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Chat</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{message.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {message.time.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm bg-muted rounded-lg p-2">{message.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button size="sm" onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VirtualConsultationScheduler
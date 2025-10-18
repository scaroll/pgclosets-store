"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
// import { Select } from "@/components/ui/select"; // Using native select elements instead
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Form data interface
interface FormData {
  // Step 1: Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;

  // Step 2: Project Details
  projectType: string;
  roomTypes: string[];
  doorCount: string;
  currentSituation: string;
  measurements: string;

  // Step 3: Preferences & Timeline
  stylePreference: string;
  budgetRange: string;
  timeline: string;
  installationPreference: string;
  additionalServices: string[];

  // Step 4: Additional Details
  specialRequirements: string;
  hearAboutUs: string;
  marketingConsent: boolean;
}

// Validation errors interface
interface ValidationErrors {
  [key: string]: string;
}

// Step configuration
const STEPS = [
  {
    id: 1,
    title: "Contact Information",
    description: "Let's start with your basic information",
    icon: "👤"
  },
  {
    id: 2,
    title: "Project Details",
    description: "Tell us about your closet project",
    icon: "🏠"
  },
  {
    id: 3,
    title: "Preferences & Timeline",
    description: "Your style preferences and timeline",
    icon: "📅"
  },
  {
    id: 4,
    title: "Review & Submit",
    description: "Review your information and submit",
    icon: "✓"
  }
];

// Initial form data
const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  projectType: "",
  roomTypes: [],
  doorCount: "",
  currentSituation: "",
  measurements: "",
  stylePreference: "",
  budgetRange: "",
  timeline: "",
  installationPreference: "",
  additionalServices: [],
  specialRequirements: "",
  hearAboutUs: "",
  marketingConsent: false
};

export default function QuoteRequestWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("pgClosetsQuoteForm");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Skip auto-save if form hasn't been modified or is already submitted
    if (isSubmitted) return;

    // Skip auto-save on initial load
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    if (!hasChanged) return;

    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      localStorage.setItem("pgClosetsQuoteForm", JSON.stringify(formData));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, isSubmitted]);

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = "Postal code is required";
      } else if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(formData.postalCode)) {
        newErrors.postalCode = "Please enter a valid Canadian postal code";
      }
    }

    if (step === 2) {
      if (!formData.projectType) newErrors.projectType = "Please select a project type";
      if (formData.roomTypes.length === 0) newErrors.roomTypes = "Please select at least one room type";
      if (!formData.doorCount) newErrors.doorCount = "Please specify the number of doors needed";
      if (!formData.currentSituation) newErrors.currentSituation = "Please describe your current situation";
    }

    if (step === 3) {
      if (!formData.stylePreference) newErrors.stylePreference = "Please select a style preference";
      if (!formData.budgetRange) newErrors.budgetRange = "Please select a budget range";
      if (!formData.timeline) newErrors.timeline = "Please select your preferred timeline";
      if (!formData.installationPreference) newErrors.installationPreference = "Please select an installation preference";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | string[] | boolean) => {
    if (field === "phone" && typeof value === "string") {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle checkbox arrays
  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    handleInputChange(field, newArray);
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear saved form data
      localStorage.removeItem("pgClosetsQuoteForm");

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "There was an error submitting your request. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress calculation
  const progress = (currentStep / STEPS.length) * 100;

  // Success page
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Request!
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            We've received your quote request and will get back to you within 24 hours.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">1.</span>
                <span>We'll review your project details and prepare a detailed quote</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">2.</span>
                <span>One of our Ottawa specialists will contact you within 24 hours</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">3.</span>
                <span>We'll schedule a free online quote at your convenience</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">4.</span>
                <span>Professional installation within 2 weeks of approval</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            <p>Check your email for a confirmation with your request details.</p>
            <p>Quote Reference: #QR{Date.now().toString().slice(-6)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Return to Homepage
            </Button>
            <Button variant="default" onClick={() => window.location.href = "/products"}>
              Browse Our Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Get Free Quote</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {saveStatus === "saving" && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>

        <Progress value={progress} className="h-3 mb-4" />

        {/* Step indicators */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={cn(
                "flex flex-col items-center gap-2 text-center transition-all duration-200 min-w-0 flex-1",
                currentStep >= step.id ? "text-black" : "text-gray-400",
                currentStep === step.id && "scale-105"
              )}
              disabled={step.id > currentStep && !validateStep(currentStep)}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 mx-auto",
                currentStep > step.id
                  ? "bg-black text-white"
                  : currentStep === step.id
                  ? "bg-black text-white ring-4 ring-black/10"
                  : "bg-gray-200 text-gray-500"
              )}>
                {currentStep > step.id ? "✓" : step.id}
              </div>
              <div className="hidden sm:block px-1">
                <div className="font-medium text-xs truncate">{step.title}</div>
                <div className="text-xs text-gray-500 truncate">{step.description}</div>
              </div>
              {/* Mobile: show just the title on small screens */}
              <div className="sm:hidden">
                <div className="font-medium text-xs truncate px-1">{step.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-6 sm:p-8">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Optional contact number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">We'll use this to schedule your consultation</p>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your street address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ottawa"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value.toUpperCase())}
                  placeholder="K1A 0A6"
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Project Details</h3>
              <p className="text-gray-600">Tell us about your closet project</p>
            </div>

            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => handleInputChange("projectType", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.projectType ? "border-red-500" : ""
                )}
              >
                <option value="">Select project type</option>
                <option value="new-installation">New Installation</option>
                <option value="replacement">Door Replacement</option>
                <option value="upgrade">Closet Upgrade</option>
                <option value="repair">Repair/Maintenance</option>
              </select>
              {errors.projectType && (
                <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>
              )}
            </div>

            <div>
              <Label>Room Types * (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {[
                  "Master Bedroom",
                  "Guest Bedroom",
                  "Kids Bedroom",
                  "Walk-in Closet",
                  "Reach-in Closet",
                  "Pantry",
                  "Laundry Room",
                  "Other"
                ].map((room) => (
                  <label key={room} className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.roomTypes.includes(room)}
                      onCheckedChange={(checked) => handleCheckboxChange("roomTypes", room, checked as boolean)}
                    />
                    <span className="text-sm">{room}</span>
                  </label>
                ))}
              </div>
              {errors.roomTypes && (
                <p className="text-red-500 text-sm mt-1">{errors.roomTypes}</p>
              )}
            </div>

            <div>
              <Label htmlFor="doorCount">Number of Doors Needed *</Label>
              <select
                id="doorCount"
                value={formData.doorCount}
                onChange={(e) => handleInputChange("doorCount", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.doorCount ? "border-red-500" : ""
                )}
              >
                <option value="">Select number of doors</option>
                <option value="1-2">1-2 doors</option>
                <option value="3-4">3-4 doors</option>
                <option value="5-6">5-6 doors</option>
                <option value="7-8">7-8 doors</option>
                <option value="9+">9+ doors</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.doorCount && (
                <p className="text-red-500 text-sm mt-1">{errors.doorCount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currentSituation">Current Situation *</Label>
              <select
                id="currentSituation"
                value={formData.currentSituation}
                onChange={(e) => handleInputChange("currentSituation", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.currentSituation ? "border-red-500" : ""
                )}
              >
                <option value="">Select current situation</option>
                <option value="no-doors">No doors currently</option>
                <option value="old-doors">Replacing old doors</option>
                <option value="broken-doors">Repairing broken doors</option>
                <option value="new-construction">New construction</option>
                <option value="renovation">Part of renovation</option>
              </select>
              {errors.currentSituation && (
                <p className="text-red-500 text-sm mt-1">{errors.currentSituation}</p>
              )}
            </div>

            <div>
              <Label htmlFor="measurements">Do you have measurements?</Label>
              <Textarea
                id="measurements"
                value={formData.measurements}
                onChange={(e) => handleInputChange("measurements", e.target.value)}
                placeholder="If you have measurements (width x height), please provide them. If not, we'll measure during our free online quote."
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">Don't worry if you don't have measurements - we'll handle this during our consultation</p>
            </div>
          </div>
        )}

        {/* Step 3: Preferences & Timeline */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Preferences & Timeline</h3>
              <p className="text-gray-600">Your style preferences and timeline</p>
            </div>

            <div>
              <Label htmlFor="stylePreference">Style Preference *</Label>
              <select
                id="stylePreference"
                value={formData.stylePreference}
                onChange={(e) => handleInputChange("stylePreference", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.stylePreference ? "border-red-500" : ""
                )}
              >
                <option value="">Select style preference</option>
                <option value="modern">Modern</option>
                <option value="traditional">Traditional</option>
                <option value="contemporary">Contemporary</option>
                <option value="minimalist">Minimalist</option>
                <option value="custom">Custom Design</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.stylePreference && (
                <p className="text-red-500 text-sm mt-1">{errors.stylePreference}</p>
              )}
            </div>

            <div>
              <Label htmlFor="budgetRange">Budget Range *</Label>
              <select
                id="budgetRange"
                value={formData.budgetRange}
                onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.budgetRange ? "border-red-500" : ""
                )}
              >
                <option value="">Select budget range</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="over-10000">Over $10,000</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.budgetRange && (
                <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">This helps us provide the most relevant options</p>
            </div>

            <div>
              <Label htmlFor="timeline">Preferred Timeline *</Label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange("timeline", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.timeline ? "border-red-500" : ""
                )}
              >
                <option value="">Select timeline</option>
                <option value="asap">As soon as possible</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="3-4-weeks">3-4 weeks</option>
                <option value="1-2-months">1-2 months</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.timeline && (
                <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>
              )}
            </div>

            <div>
              <Label htmlFor="installationPreference">Installation Preference *</Label>
              <select
                id="installationPreference"
                value={formData.installationPreference}
                onChange={(e) => handleInputChange("installationPreference", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
                  errors.installationPreference ? "border-red-500" : ""
                )}
              >
                <option value="">Select installation preference</option>
                <option value="professional">Professional installation (recommended)</option>
                <option value="diy">DIY installation</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.installationPreference && (
                <p className="text-red-500 text-sm mt-1">{errors.installationPreference}</p>
              )}
            </div>

            <div>
              <Label>Additional Services (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  "Closet organization consultation",
                  "Custom shelving",
                  "Lighting installation",
                  "Trim and molding",
                  "Paint touch-ups",
                  "Disposal of old doors"
                ].map((service) => (
                  <label key={service} className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.additionalServices.includes(service)}
                      onCheckedChange={(checked) => handleCheckboxChange("additionalServices", service, checked as boolean)}
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                placeholder="Any special requirements, accessibility needs, or additional information..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
              <select
                id="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={(e) => handleInputChange("hearAboutUs", e.target.value)}
                className="w-full h-11 px-3 py-2 text-sm bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select an option</option>
                <option value="google-search">Google search</option>
                <option value="referral">Referral from friend/family</option>
                <option value="social-media">Social media</option>
                <option value="home-show">Home show/expo</option>
                <option value="newspaper">Newspaper/magazine</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-start gap-3">
                <Checkbox
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => handleInputChange("marketingConsent", checked as boolean)}
                />
                <div className="text-sm">
                  <span>I would like to receive updates about new products, special offers, and home improvement tips from PG Closets. </span>
                  <span className="text-gray-500">(Optional - you can unsubscribe at any time)</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
              <p className="text-gray-600">Please review your information before submitting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  <p><span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.postalCode}</p>
                </div>
              </div>

              {/* Project Details Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Project Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Project Type:</span> {formData.projectType}</p>
                  <p><span className="font-medium">Room Types:</span> {formData.roomTypes.join(", ")}</p>
                  <p><span className="font-medium">Door Count:</span> {formData.doorCount}</p>
                  <p><span className="font-medium">Current Situation:</span> {formData.currentSituation}</p>
                </div>
              </div>

              {/* Preferences Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Preferences & Timeline</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Style:</span> {formData.stylePreference}</p>
                  <p><span className="font-medium">Budget:</span> {formData.budgetRange}</p>
                  <p><span className="font-medium">Timeline:</span> {formData.timeline}</p>
                  <p><span className="font-medium">Installation:</span> {formData.installationPreference}</p>
                </div>
              </div>

              {/* Additional Info Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  {formData.additionalServices.length > 0 && (
                    <p><span className="font-medium">Additional Services:</span> {formData.additionalServices.join(", ")}</p>
                  )}
                  {formData.specialRequirements && (
                    <p><span className="font-medium">Special Requirements:</span> {formData.specialRequirements}</p>
                  )}
                  <p><span className="font-medium">Marketing consent:</span> {formData.marketingConsent ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {/* Trust signals before submit */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-center mb-4">Your Information is Secure</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span>Privacy Protected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>24hr Response</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Free Quote</span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <Alert className="border-red-200 bg-red-50">
                <p className="text-red-800">{errors.submit}</p>
              </Alert>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Save and Continue Later */}
        {currentStep < 4 && (
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Don't have time to finish now? Your progress is automatically saved.
              <br />
              You can return to this page later to continue where you left off.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
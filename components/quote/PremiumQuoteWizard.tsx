"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Upload,
  Calendar as CalendarIcon,
  Check,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  X,
  AlertCircle,
  Sparkles
} from "lucide-react";

// Types
interface FormData {
  // Step 1: Product Selection
  productInterest: string[];
  customProduct: string;

  // Step 2: Room Details
  roomWidth: string;
  roomHeight: string;
  roomDepth: string;
  doorCount: string;
  stylePreference: string;
  roomPhotos: File[];

  // Step 3: Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;

  // Step 4: Preferred Contact
  contactMethod: string;
  contactTime: string;
  preferredDate: string;
  urgency: string;

  // Step 5: Additional Details
  specialRequirements: string;
  budget: string;
  hearAboutUs: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// Product options with visual icons
const PRODUCT_OPTIONS = [
  {
    id: "sliding-doors",
    name: "Sliding Closet Doors",
    icon: "🚪",
    description: "Modern space-saving solutions",
    popular: true,
  },
  {
    id: "barn-doors",
    name: "Barn Doors",
    icon: "🏠",
    description: "Rustic elegance",
    popular: true,
  },
  {
    id: "bifold-doors",
    name: "Bifold Doors",
    icon: "📐",
    description: "Classic folding style",
    popular: false,
  },
  {
    id: "french-doors",
    name: "French Doors",
    icon: "🎨",
    description: "Sophisticated glass panels",
    popular: false,
  },
  {
    id: "wardrobe-systems",
    name: "Complete Wardrobe Systems",
    icon: "👔",
    description: "Full storage solutions",
    popular: true,
  },
  {
    id: "custom",
    name: "Custom Solution",
    icon: "✨",
    description: "Tell us what you need",
    popular: false,
  },
];

const STYLE_OPTIONS = [
  { value: "modern", label: "Modern Minimalist", emoji: "⬜" },
  { value: "traditional", label: "Traditional Classic", emoji: "🏛️" },
  { value: "rustic", label: "Rustic Farmhouse", emoji: "🌾" },
  { value: "contemporary", label: "Contemporary Chic", emoji: "✨" },
  { value: "industrial", label: "Industrial Urban", emoji: "🏭" },
  { value: "not-sure", label: "Not Sure Yet", emoji: "🤔" },
];

const CONTACT_TIMES = [
  { value: "morning", label: "Morning (8am-12pm)" },
  { value: "afternoon", label: "Afternoon (12pm-5pm)" },
  { value: "evening", label: "Evening (5pm-8pm)" },
  { value: "anytime", label: "Anytime" },
];

const URGENCY_OPTIONS = [
  { value: "asap", label: "As soon as possible", icon: "🚀" },
  { value: "1-2-weeks", label: "Within 1-2 weeks", icon: "📅" },
  { value: "1-month", label: "Within a month", icon: "🗓️" },
  { value: "flexible", label: "I'm flexible", icon: "⏰" },
];

const initialFormData: FormData = {
  productInterest: [],
  customProduct: "",
  roomWidth: "",
  roomHeight: "",
  roomDepth: "",
  doorCount: "",
  stylePreference: "",
  roomPhotos: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postalCode: "",
  contactMethod: "email",
  contactTime: "anytime",
  preferredDate: "",
  urgency: "",
  specialRequirements: "",
  budget: "",
  hearAboutUs: "",
};

export default function PremiumQuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saving" | "saved" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const totalSteps = 5;

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("pgClosets_premiumQuoteForm_v1");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error("Error loading saved form:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isSubmitted) return;

    const hasData = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    if (!hasData) return;

    setAutoSaveStatus("saving");
    const timer = setTimeout(() => {
      localStorage.setItem("pgClosets_premiumQuoteForm_v1", JSON.stringify(formData));
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus(""), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, isSubmitted]);

  // Phone formatting
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Postal code formatting
  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | string[] | File[]) => {
    let processedValue = value;

    if (field === "phone" && typeof value === "string") {
      processedValue = formatPhoneNumber(value);
    } else if (field === "postalCode" && typeof value === "string") {
      processedValue = formatPostalCode(value);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle multi-select
  const handleProductSelect = (productId: string) => {
    const currentProducts = formData.productInterest;
    const newProducts = currentProducts.includes(productId)
      ? currentProducts.filter((id) => id !== productId)
      : [...currentProducts, productId];
    handleInputChange("productInterest", newProducts);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    const totalFiles = formData.roomPhotos.length + validFiles.length;
    if (totalFiles > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} photos.`);
      return;
    }

    const newFiles = [...formData.roomPhotos, ...validFiles];
    handleInputChange("roomPhotos", newFiles);

    // Create preview URLs
    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    const newFiles = formData.roomPhotos.filter((_, i) => i !== index);
    const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviewUrls[index]);
    handleInputChange("roomPhotos", newFiles);
    setImagePreviewUrls(newUrls);
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (step === 1) {
      if (formData.productInterest.length === 0) {
        newErrors.productInterest = "Please select at least one product option";
      }
      if (formData.productInterest.includes("custom") && !formData.customProduct.trim()) {
        newErrors.customProduct = "Please describe your custom needs";
      }
    }

    if (step === 2) {
      if (!formData.doorCount) {
        newErrors.doorCount = "Please specify how many doors you need";
      }
      if (!formData.stylePreference) {
        newErrors.stylePreference = "Please select a style preference";
      }
    }

    if (step === 3) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = "Postal code is required";
      } else if (!/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(formData.postalCode)) {
        newErrors.postalCode = "Please enter a valid postal code (e.g., K1A 0B1)";
      }
    }

    if (step === 4) {
      if (!formData.urgency) {
        newErrors.urgency = "Please select your timeline";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // Prepare form data
      const submitData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          province: "ON",
        },
        product: {
          name: formData.productInterest.join(", "),
          category: "custom-quote",
          price: 0,
          selectedOptions: {
            doorCount: formData.doorCount,
            style: formData.stylePreference,
            roomDimensions: `${formData.roomWidth}x${formData.roomHeight}x${formData.roomDepth}`,
            urgency: formData.urgency,
            contactMethod: formData.contactMethod,
            contactTime: formData.contactTime,
            preferredDate: formData.preferredDate,
          },
        },
        notes: `Budget: ${formData.budget}\nSpecial Requirements: ${formData.specialRequirements}\nHeard about us: ${formData.hearAboutUs}\nPhotos: ${formData.roomPhotos.length} uploaded`,
      };

      const response = await fetch("/api/quotes/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        localStorage.removeItem("pgClosets_premiumQuoteForm_v1");
        setIsSubmitted(true);
        setCurrentStep(5);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Quote submission error:", error);
      setErrors({ submit: "Failed to submit. Please try again or call us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  // Success screen
  if (isSubmitted && currentStep === 5) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="overflow-hidden border-2 border-green-500">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-12 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Request Received!
            </h2>

            <p className="text-xl text-gray-700 mb-8">
              Thank you for choosing PG Closets. We'll craft your personalized quote right away.
            </p>

            <div className="bg-white rounded-lg p-6 max-w-md mx-auto mb-8 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                What Happens Next
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Quote Preparation</p>
                    <p className="text-sm text-gray-600">Our team reviews your details and prepares pricing</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                    2
                  </div>
                  <div>
                    <p className="font-medium">We'll Contact You</p>
                    <p className="text-sm text-gray-600">Within 24 hours via {formData.contactMethod}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Free Consultation</p>
                    <p className="text-sm text-gray-600">Schedule your online quote appointment</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-600">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Installation</p>
                    <p className="text-sm text-gray-600">Professional install within 2 weeks</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-6">
              <p className="mb-2">Check your email (including spam folder) for confirmation</p>
              <p className="font-mono text-xs bg-gray-100 inline-block px-3 py-1 rounded">
                Ref: #QR{Date.now().toString().slice(-6)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/")}
                className="gap-2"
              >
                Return Home
              </Button>
              <Button
                size="lg"
                onClick={() => (window.location.href = "/products")}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Get Your Free Quote</h1>
            <p className="text-gray-600 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          {autoSaveStatus && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {autoSaveStatus === "saving" && (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span>Saving...</span>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Saved</span>
                </>
              )}
            </div>
          )}
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        {/* Step indicators */}
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={cn(
                "flex flex-col items-center gap-2 flex-1",
                currentStep >= step ? "text-blue-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  currentStep > step
                    ? "bg-blue-600 text-white"
                    : currentStep === step
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              <div className="text-xs font-medium text-center hidden sm:block">
                {step === 1 && "Product"}
                {step === 2 && "Details"}
                {step === 3 && "Contact"}
                {step === 4 && "Preferences"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <Card className="p-6 sm:p-8">
        {/* Step 1: Product Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What are you looking for?</h2>
              <p className="text-gray-600">Select all that interest you</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleProductSelect(option.id)}
                  className={cn(
                    "relative p-6 rounded-lg border-2 transition-all hover:shadow-lg group",
                    formData.productInterest.includes(option.id)
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  )}
                >
                  {option.popular && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold mb-1 text-left">{option.name}</h3>
                  <p className="text-sm text-gray-600 text-left">{option.description}</p>
                  {formData.productInterest.includes(option.id) && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {formData.productInterest.includes("custom") && (
              <div className="mt-4">
                <Label htmlFor="customProduct">Tell us about your custom needs</Label>
                <Textarea
                  id="customProduct"
                  value={formData.customProduct}
                  onChange={(e) => handleInputChange("customProduct", e.target.value)}
                  placeholder="Describe what you're looking for..."
                  rows={3}
                  className={errors.customProduct ? "border-red-500" : ""}
                />
                {errors.customProduct && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.customProduct}
                  </p>
                )}
              </div>
            )}

            {errors.productInterest && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.productInterest}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Room Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Room Details</h2>
              <p className="text-gray-600">Help us understand your space</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Don't worry if you don't have exact measurements.
                We'll measure precisely during your free consultation.
              </p>
            </div>

            <div>
              <Label className="text-lg mb-3 block">Approximate Room Dimensions (Optional)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="roomWidth">Width (ft)</Label>
                  <Input
                    id="roomWidth"
                    type="number"
                    value={formData.roomWidth}
                    onChange={(e) => handleInputChange("roomWidth", e.target.value)}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label htmlFor="roomHeight">Height (ft)</Label>
                  <Input
                    id="roomHeight"
                    type="number"
                    value={formData.roomHeight}
                    onChange={(e) => handleInputChange("roomHeight", e.target.value)}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label htmlFor="roomDepth">Depth (ft)</Label>
                  <Input
                    id="roomDepth"
                    type="number"
                    value={formData.roomDepth}
                    onChange={(e) => handleInputChange("roomDepth", e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="doorCount">How many doors do you need? *</Label>
              <select
                id="doorCount"
                value={formData.doorCount}
                onChange={(e) => handleInputChange("doorCount", e.target.value)}
                className={cn(
                  "w-full h-11 px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors.doorCount ? "border-red-500" : "border-gray-300"
                )}
              >
                <option value="">Select number of doors</option>
                <option value="1">1 door</option>
                <option value="2">2 doors</option>
                <option value="3">3 doors</option>
                <option value="4">4 doors</option>
                <option value="5+">5 or more doors</option>
                <option value="not-sure">Not sure yet</option>
              </select>
              {errors.doorCount && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.doorCount}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-3 block">Style Preference *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleInputChange("stylePreference", style.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                      formData.stylePreference === style.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <div className="text-2xl mb-2">{style.emoji}</div>
                    <div className="font-medium text-sm">{style.label}</div>
                  </button>
                ))}
              </div>
              {errors.stylePreference && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stylePreference}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-3 block flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Room Photos (Optional - up to 5 photos)
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Upload photos of your space to help us provide a more accurate quote
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2"
                disabled={formData.roomPhotos.length >= 5}
              >
                <Upload className="w-4 h-4" />
                Upload Photos ({formData.roomPhotos.length}/5)
              </Button>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Room photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Information</h2>
              <p className="text-gray-600">So we can send your personalized quote</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Smith"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
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
                placeholder="john.smith@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">We'll send your quote here</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(613) 555-0123"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">For scheduling your consultation</p>
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                placeholder="K1A 0B1"
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.postalCode}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-1">To confirm we serve your area</p>
            </div>
          </div>
        )}

        {/* Step 4: Preferred Contact & Timeline */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
              <p className="text-gray-600">When should we contact you?</p>
            </div>

            <div>
              <Label className="mb-3 block">Preferred Contact Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "email", label: "Email", icon: "📧" },
                  { value: "phone", label: "Phone Call", icon: "📞" },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handleInputChange("contactMethod", method.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all hover:shadow-md",
                      formData.contactMethod === method.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <div className="font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="contactTime">Best Time to Reach You</Label>
              <select
                id="contactTime"
                value={formData.contactTime}
                onChange={(e) => handleInputChange("contactTime", e.target.value)}
                className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONTACT_TIMES.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="preferredDate" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Preferred Consultation Date (Optional)
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-1">
                We'll try to accommodate your preferred date
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Project Timeline *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {URGENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("urgency", option.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                      formData.urgency === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    )}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
              {errors.urgency && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.urgency}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="budget">Budget Range (Optional)</Label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Prefer not to say</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-2500">$1,000 - $2,500</option>
                <option value="2500-5000">$2,500 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="over-10000">Over $10,000</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                Helps us provide options that fit your budget
              </p>
            </div>

            <div>
              <Label htmlFor="specialRequirements">Any Special Requirements? (Optional)</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                placeholder="Accessibility needs, specific materials, installation constraints, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="hearAboutUs">How did you hear about us? (Optional)</Label>
              <select
                id="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={(e) => handleInputChange("hearAboutUs", e.target.value)}
                className="w-full h-11 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                <option value="google">Google search</option>
                <option value="social-media">Social media</option>
                <option value="referral">Friend or family referral</option>
                <option value="home-show">Home show or event</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pt-8 border-t mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={nextStep} className="gap-2" size="lg">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 min-w-[160px]"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get My Quote
                  <Check className="w-5 h-5" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Footer reassurance */}
        {currentStep < 4 && (
          <div className="text-center pt-6 border-t border-gray-100 mt-6">
            <p className="text-sm text-gray-600">
              ✓ Your progress is automatically saved
              <br />
              ✓ Free consultation • No obligation • 24hr response
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

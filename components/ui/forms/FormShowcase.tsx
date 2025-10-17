"use client"

import * as React from "react"
import { FloatingInput } from "./FloatingInput"
import { FloatingTextArea } from "./FloatingTextArea"
import { AppleSelect } from "./AppleSelect"
import {
  AppleCheckbox,
  AppleRadioGroup,
  AppleToggle,
} from "./AppleCheckbox"
import { ContactForm, QuoteForm } from "./FormValidation"
import { Mail, User, Lock } from "lucide-react"

export default function FormShowcase() {
  const [demoValues, setDemoValues] = React.useState({
    input: "",
    textarea: "",
    select: "",
    checkbox: false,
    radio: "",
    toggle: false,
  })

  const handleContactSubmit = async (data: any) => {
    console.log("Contact form submitted:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Contact form submitted successfully!")
  }

  const handleQuoteSubmit = async (data: any) => {
    console.log("Quote form submitted:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Quote request submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extralight text-slate-900 tracking-tight">
            Premium Form System
          </h1>
          <p className="text-xl font-light text-slate-600 max-w-2xl mx-auto">
            Apple-inspired form components with floating labels, real-time
            validation, and accessibility built-in
          </p>
        </div>

        {/* Component Showcase */}
        <div className="space-y-24">
          {/* Floating Inputs */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Floating Input
              </h2>
              <p className="text-base font-light text-slate-600">
                Text inputs with animated floating labels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {/* Basic Input */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Basic</p>
                <FloatingInput
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={demoValues.input}
                  onChange={(e) =>
                    setDemoValues({ ...demoValues, input: e.target.value })
                  }
                />
              </div>

              {/* With Icons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">With Icons</p>
                <FloatingInput
                  label="Username"
                  leftIcon={<User className="w-5 h-5" />}
                  placeholder="johndoe"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Password</p>
                <FloatingInput
                  label="Password"
                  type="password"
                  showPasswordToggle
                  leftIcon={<Lock className="w-5 h-5" />}
                />
              </div>

              {/* Error State */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Error State</p>
                <FloatingInput
                  label="Email"
                  type="email"
                  error="Please enter a valid email address"
                  leftIcon={<Mail className="w-5 h-5" />}
                />
              </div>

              {/* Success State */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Success State
                </p>
                <FloatingInput
                  label="Email"
                  type="email"
                  success="Email is available"
                  defaultValue="john@example.com"
                />
              </div>

              {/* Disabled */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Disabled</p>
                <FloatingInput
                  label="Read Only Field"
                  disabled
                  defaultValue="Cannot edit this"
                />
              </div>
            </div>
          </section>

          {/* Floating TextArea */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Floating TextArea
              </h2>
              <p className="text-base font-light text-slate-600">
                Auto-resizing textarea with character counter
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Auto Resize
                </p>
                <FloatingTextArea
                  label="Your Message"
                  maxLength={500}
                  minRows={3}
                  maxRows={6}
                  placeholder="Tell us what you think..."
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  With Error
                </p>
                <FloatingTextArea
                  label="Project Description"
                  error="Description must be at least 20 characters"
                  helperText="Provide detailed information about your project"
                  maxLength={1000}
                />
              </div>
            </div>
          </section>

          {/* Apple Select */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Apple Select
              </h2>
              <p className="text-base font-light text-slate-600">
                Custom select with search and descriptions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Basic Select
                </p>
                <AppleSelect
                  label="Project Type"
                  value={demoValues.select}
                  onChange={(val) =>
                    setDemoValues({ ...demoValues, select: val })
                  }
                  options={[
                    { value: "new", label: "New Installation" },
                    { value: "replacement", label: "Replacement" },
                    { value: "renovation", label: "Full Renovation" },
                    { value: "consultation", label: "Consultation Only" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Searchable with Descriptions
                </p>
                <AppleSelect
                  label="Timeline"
                  searchable
                  options={[
                    {
                      value: "asap",
                      label: "As soon as possible",
                      description: "Start within 1-2 weeks",
                    },
                    {
                      value: "1-month",
                      label: "Within 1 month",
                      description: "Flexible start date",
                    },
                    {
                      value: "2-3-months",
                      label: "2-3 months",
                      description: "Planning phase",
                    },
                    {
                      value: "planning",
                      label: "Just planning",
                      description: "Gathering information",
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Checkboxes and Radio */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Checkbox & Radio
              </h2>
              <p className="text-base font-light text-slate-600">
                Apple-style selection controls
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <p className="text-sm font-medium text-slate-700">Checkboxes</p>
                <AppleCheckbox
                  label="Subscribe to newsletter"
                  description="Get weekly updates about new products"
                  checked={demoValues.checkbox}
                  onCheckedChange={(val) =>
                    setDemoValues({ ...demoValues, checkbox: val })
                  }
                />
                <AppleCheckbox
                  label="I agree to terms and conditions"
                  required
                />
                <AppleCheckbox
                  label="Disabled option"
                  description="This option is not available"
                  disabled
                />
              </div>

              <div className="space-y-6">
                <p className="text-sm font-medium text-slate-700">
                  Radio Group
                </p>
                <AppleRadioGroup
                  label="Preferred Contact Method"
                  value={demoValues.radio}
                  onValueChange={(val) =>
                    setDemoValues({ ...demoValues, radio: val })
                  }
                  options={[
                    {
                      value: "email",
                      label: "Email",
                      description: "We'll respond within 24 hours",
                    },
                    {
                      value: "phone",
                      label: "Phone",
                      description: "Call you back same day",
                    },
                    {
                      value: "either",
                      label: "Either",
                      description: "Whatever is most convenient",
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Toggles */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Toggle Switch
              </h2>
              <p className="text-base font-light text-slate-600">
                iOS-style toggle switches in multiple sizes
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <AppleToggle
                label="Enable notifications"
                description="Receive updates about your projects"
                checked={demoValues.toggle}
                onCheckedChange={(val) =>
                  setDemoValues({ ...demoValues, toggle: val })
                }
                size="sm"
              />
              <AppleToggle
                label="Dark mode"
                description="Use dark theme across the application"
                size="md"
              />
              <AppleToggle
                label="Marketing emails"
                description="Receive promotional content and special offers"
                size="lg"
              />
            </div>
          </section>

          {/* Complete Forms */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extralight text-slate-900">
                Complete Form Examples
              </h2>
              <p className="text-base font-light text-slate-600">
                Full forms with React Hook Form and Zod validation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-slate-900">
                  Contact Form
                </h3>
                <div className="bg-white p-8 shadow-lg border border-slate-200">
                  <ContactForm onSubmit={handleContactSubmit} />
                </div>
              </div>

              {/* Quote Form */}
              <div className="space-y-4">
                <h3 className="text-xl font-light text-slate-900">
                  Quote Request Form
                </h3>
                <div className="bg-white p-8 shadow-lg border border-slate-200">
                  <QuoteForm onSubmit={handleQuoteSubmit} />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-200">
          <p className="text-sm font-light text-slate-500">
            Built with React Hook Form, Zod, Radix UI, and Framer Motion
          </p>
        </div>
      </div>
    </div>
  )
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import type { ContactFormState } from "@/lib/schema";
import { contactFormSchema } from "@/lib/schema";
import { submitContactForm } from "@/lib/actions";
import { useEffect } from "react";

const initialState: ContactFormState = {
  message: "",
};

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: state.fields?.firstName ?? "",
      lastName: state.fields?.lastName ?? "",
      email: state.fields?.email ?? "",
      phone: state.fields?.phone ?? "",
      message: state.fields?.message ?? "",
    },
  });

  useEffect(() => {
    if (state.message.startsWith("Success")) {
      reset();
    }
  }, [state, reset]);

  return (
    <div className="py-8">
      <h2 className="text-h3 text-pg-text-primary mb-6">Contact Form</h2>
      {state.message && (
        <div
          className={`mb-4 p-4 text-sm rounded-lg border-2 ${
            state.message.startsWith("Success")
              ? "bg-green-50 text-green-800 border-pg-status-success"
              : "bg-red-50 text-red-800 border-pg-status-error"
          }`}
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </div>
      )}
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-pg-text-primary mb-2">
              First Name <span className="text-pg-status-error" aria-label="required">*</span>
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              required
              className="w-full px-3 py-2 border-2 border-pg-button-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:border-pg-button-primary text-pg-text-primary min-h-[44px] transition-colors"
              aria-required="true"
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-pg-status-error text-xs mt-1" role="alert" aria-live="assertive">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-pg-text-primary mb-2">
              Last Name <span className="text-pg-status-error" aria-label="required">*</span>
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              required
              className="w-full px-3 py-2 border-2 border-pg-button-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:border-pg-button-primary text-pg-text-primary min-h-[44px] transition-colors"
              aria-required="true"
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-pg-status-error text-xs mt-1" role="alert" aria-live="assertive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pg-text-primary mb-2">
              Email <span className="text-pg-status-error" aria-label="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              required
              inputMode="email"
              className="w-full px-3 py-2 border-2 border-pg-button-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:border-pg-button-primary text-pg-text-primary min-h-[44px] transition-colors"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p id="email-error" className="text-pg-status-error text-xs mt-1" role="alert" aria-live="assertive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-pg-text-primary mb-2">
              Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              inputMode="tel"
              className="w-full px-3 py-2 border-2 border-pg-button-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:border-pg-button-primary text-pg-text-primary min-h-[44px] transition-colors"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              autoComplete="tel"
              placeholder="(613) 555-0123"
            />
            {errors.phone && (
              <p id="phone-error" className="text-pg-status-error text-xs mt-1" role="alert" aria-live="assertive">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-pg-text-primary mb-2">
            Project Details <span className="text-pg-status-error" aria-label="required">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            required
            className="w-full px-3 py-2 border-2 border-pg-button-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 focus:border-pg-button-primary text-pg-text-primary min-h-[100px] transition-colors resize-vertical"
            placeholder="Tell us about your closet door project: room type, dimensions, style preferences, timeline, etc."
            aria-required="true"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-pg-status-error text-xs mt-1" role="alert" aria-live="assertive">
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-pg-button-primary text-white px-8 py-3 font-semibold rounded-lg hover:bg-pg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
            aria-describedby={isSubmitting ? "submit-status" : undefined}
            aria-label="Get your free quote - No obligation"
          >
            {isSubmitting ? "Sending..." : "Get Your FREE Quote"}
            {isSubmitting && <span id="submit-status" className="sr-only">Form is being submitted</span>}
          </button>
          <a
            href="mailto:info@pgclosets.com?subject=Closet Door Project"
            className="border-2 border-pg-button-primary text-pg-button-primary px-8 py-3 font-semibold rounded-lg hover:bg-pg-button-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 transition-all text-center min-h-[44px] flex items-center justify-center"
            aria-label="Send email directly to PG Closets about your project"
          >
            Email Directly
          </a>
        </div>
      </form>
    </div>
  );
}
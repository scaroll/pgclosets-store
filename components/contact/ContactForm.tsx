"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { contactFormSchema, ContactFormState } from "@/lib/schema";
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
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Form</h3>
      {state.message && (
        <div
          className={`mb-4 p-3 text-sm rounded-md ${
            state.message.startsWith("Success")
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
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
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              aria-required="true"
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-red-700 text-xs mt-1" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              aria-required="true"
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-red-700 text-xs mt-1" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="text-red-700 text-xs mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              autoComplete="tel"
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-700 text-xs mt-1" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Project Details *
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Tell us about your closet door project..."
            aria-required="true"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : undefined}
          ></textarea>
          {errors.message && (
            <p id="message-error" className="text-red-700 text-xs mt-1" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-700 text-white px-8 py-3 font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-describedby={isSubmitting ? "submit-status" : undefined}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            {isSubmitting && <span id="submit-status" className="sr-only">Form is being submitted</span>}
          </button>
          <a
            href="mailto:info@pgclosets.com?subject=Closet Door Project"
            className="border-2 border-blue-700 text-blue-700 px-8 py-3 font-semibold rounded-md hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all text-center"
            aria-label="Send email directly to PG Closets about your project"
          >
            Email Directly
          </a>
        </div>
      </form>
    </div>
  );
}
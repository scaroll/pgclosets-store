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

export function FallbackContactForm() {
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
      <h3 className="text-xl font-semibold text-[#1B4A9C] mb-6">Contact Form</h3>
      {state.message && (
        <div
          className={`mb-4 p-3 text-sm ${
            state.message.startsWith("Success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
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
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
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
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
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
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1B4A9C]"
            placeholder="Tell us about your closet door project..."
           />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1B4A9C] text-white px-8 py-3 font-semibold hover:bg-[#153A7E] transition-all disabled:bg-gray-400"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          <a
            href="mailto:info@pgclosets.com?subject=Closet Door Project"
            className="border-2 border-[#1B4A9C] text-[#1B4A9C] px-8 py-3 font-semibold hover:bg-[#1B4A9C] hover:text-white transition-all text-center"
          >
            Email Directly
          </a>
        </div>
      </form>
    </div>
  );
}

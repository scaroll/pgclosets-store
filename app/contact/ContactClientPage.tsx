"use client";

import StandardLayout from "@/components/layout/StandardLayout";
import Card from "@/components/ui/Card-new";
import Heading from "@/components/ui/Heading-new";
import Text from "@/components/ui/Text-new";
import { Button } from '@/components/ui/button';
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
  Users,
  Shield,
  Award,
  ChevronRight,
  Calendar,
  ArrowRight
} from "lucide-react";

// Dynamically import the contact form to reduce initial bundle size
const ContactForm = dynamic(
  () =>
    import("@/components/contact/ContactForm").then((mod) => ({
      default: mod.ContactForm,
    })),
  {
    loading: () => (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function ContactClientPage() {
  const [activeChat, setActiveChat] = useState(false);
  const [contactMethod, setContactMethod] = useState('');

  const contactMethods = [
    {
      id: 'phone',
      title: 'Call Us',
      description: 'Speak directly with our design experts',
      icon: Phone,
      contact: '(613) 123-4567',
      action: 'tel:613-123-4567',
      color: 'bg-blue-500',
      waitTime: 'Immediate'
    },
    {
      id: 'email',
      title: 'Email Us',
      description: 'Send detailed project information',
      icon: Mail,
      contact: 'info@pgclosets.ca',
      action: 'mailto:info@pgclosets.ca',
      color: 'bg-green-500',
      waitTime: '2-4 hours'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Get instant answers from our AI assistant',
      icon: MessageCircle,
      contact: 'Available 24/7',
      action: () => setActiveChat(true),
      color: 'bg-purple-500',
      waitTime: 'Instant'
    },
    {
      id: 'booking',
      title: 'Schedule Call',
      description: 'Book a consultation at your convenience',
      icon: Calendar,
      contact: '45-minute consultation',
      action: '/book',
      color: 'bg-gold',
      waitTime: 'Book now'
    }
  ];

  const serviceAreas = [
    'Ottawa', 'Kanata', 'Nepean', 'Orléans', 'Barrhaven',
    'Gloucester', 'Rockcliffe', 'Manotick', 'Stittsville',
    'Carp', 'Kemptville', 'Arnprior'
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Happy Clients' },
    { icon: Star, value: '4.9/5', label: 'Customer Rating' },
    { icon: Shield, value: '15+', label: 'Years Experience' },
    { icon: Award, value: '100%', label: 'Satisfaction' }
  ];

  return (
    <StandardLayout className="bg-gray-50 font-sans">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gold text-slate-900 text-sm font-medium rounded-full mb-6 tracking-wider uppercase">
              Get in Touch
            </span>
            <Heading level={1} className="text-white mb-6 text-5xl md:text-6xl">
              Let's Transform
              <span className="block text-gold">Your Space</span>
            </Heading>
            <Text size="lg" className="text-gray-300 max-w-2xl mx-auto text-xl">
              Our design experts are ready to help you create the closet of your dreams.
              Multiple ways to connect, immediate responses guaranteed.
            </Text>
          </div>

          {/* Quick Contact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-8 h-8 text-gold" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple Contact Methods */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">
              Choose Your Preferred Contact Method
            </Heading>
            <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
              We're available through multiple channels to ensure you get the help you need, when you need it
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => (
              <div
                key={method.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1 cursor-pointer ${
                  contactMethod === method.id ? 'ring-2 ring-gold' : ''
                }`}
                onClick={() => setContactMethod(method.id)}
              >
                <div className={`${method.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-900">{method.contact}</div>
                  <div className="text-xs text-gray-500">Response: {method.waitTime}</div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof method.action === 'string') {
                      if (method.action.startsWith('tel:') || method.action.startsWith('mailto:')) {
                        window.location.href = method.action;
                      } else {
                        window.location.href = method.action;
                      }
                    } else {
                      method.action();
                    }
                  }}
                >
                  {method.id === 'booking' ? 'Schedule Now' : 'Contact Us'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>

          {/* Main Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Card className="p-8">
                <div className="mb-6">
                  <Heading level={3} className="mb-2">Send Us a Message</Heading>
                  <Text variant="secondary">
                    Fill out the form below and we'll respond within 2-4 hours
                  </Text>
                </div>
                <ContactForm />
              </Card>

              {/* Service Areas */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                <Heading level={4} className="mb-4">Service Areas</Heading>
                <p className="text-gray-600 mb-4">
                  Proudly serving Ottawa and surrounding areas:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-3 h-3 text-gold" />
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Hours & Additional Info */}
            <div className="space-y-6">
              {/* Business Hours Card */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-gold" />
                  <Heading level={4}>Business Hours</Heading>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-gray-600">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">Saturday</span>
                    <span className="text-gray-600">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-600">By Appointment</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gold/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span className="font-medium text-slate-900">Emergency calls available 24/7</span>
                  </div>
                </div>
              </Card>

              {/* Why Choose Us */}
              <Card className="p-6">
                <Heading level={4} className="mb-4">Why Choose PG Closets?</Heading>
                <div className="space-y-4">
                  {[
                    'Licensed and insured professionals',
                    '15+ years of experience in Ottawa',
                    'Free, no-obligation consultations',
                    'Competitive pricing with transparent quotes',
                    'Lifetime warranty on all installations',
                    '500+ satisfied customers'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <Heading level={4} className="mb-4">Quick Links</Heading>
                <div className="space-y-3">
                  <Link href="/book" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium">Book a Consultation</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link href="/services" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium">View Our Services</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link href="/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium">Browse Products</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      {activeChat && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col">
            <div className="bg-gold text-slate-900 p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Chat with AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveChat(false)}
                className="text-slate-900 hover:bg-white/20"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-gray-600 text-sm">
                Hello! I'm here to help you with your closet design questions. Ask me anything about our services, products, or schedule a consultation!
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <Button size="sm" className="bg-gold text-slate-900 hover:bg-gold/90">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <section className="mt-16 bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                    alt="PG Closets Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PG CLOSETS</h3>
                  <p className="text-gold">Premium Solutions</p>
                </div>
              </Link>
              <p className="text-gray-300 mb-6">
                Ottawa&apos;s premier closet door specialists, transforming
                homes with premium solutions since 2008.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                  <span className="text-sm ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            <div>
              <Heading level={4} className="mb-4 text-white">
                Quick Links
              </Heading>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/services"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/book"
                  className="block text-gray-300 hover:text-gold transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>

            <div>
              <Heading level={4} className="mb-4 text-white">
                Contact Info
              </Heading>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold" />
                  <span>info@pgclosets.ca</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>(613) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Ottawa & Surrounding Areas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold" />
                  <span>Licensed & Insured</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms-of-service" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <span>|</span>
              <Link href="/return-policy" className="hover:text-gold transition-colors">
                Return Policy
              </Link>
            </div>
            <p className="mb-2">&copy; 2024 PG Closets. All rights reserved.</p>
            <p className="text-xs">
              Premium closet door solutions for Ottawa homes and businesses.
            </p>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}
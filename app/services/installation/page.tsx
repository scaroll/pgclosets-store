import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'
import {
  Wrench,
  Shield,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Star,
  ArrowRight,
  Calendar,
  Home,
  Zap,
  FileCheck,
  ThumbsUp,
  Truck,
    Gauge,
  Hammer,
  Phone
} from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Professional Closet Installation Services Ottawa | Certified Installers | PG Closets',
  description: 'Expert closet door installation in Ottawa. Certified technicians, lifetime warranty, same-day service available. Professional installation for all Renin closet systems.',
  keywords: 'closet installation Ottawa, professional door installers, certified installation, closet door fitting, Ottawa installation services',
  openGraph: {
    title: 'Professional Closet Installation Services | PG Closets',
    description: 'Certified technicians delivering flawless installation with lifetime warranty',
    images: [
      {
        url: '/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
}

const installationServices = [
  {
    icon: <Hammer className="w-8 h-8" />,
    title: 'Closet Door Installation',
    description: 'Professional installation of all closet door types including bypass, bifold, and sliding doors',
    features: ['Precision fitting', 'Hardware installation', 'Track alignment', 'Finish work'],
    timeline: '2-4 hours'
  },
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Custom Closet Systems',
    description: 'Complete installation of custom closet organizers, shelving, and storage solutions',
    features: ['Wall anchoring', 'Shelving installation', 'Drawer assembly', 'Accessory mounting'],
    timeline: '4-6 hours'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Repair & Adjustment',
    description: 'Expert repair services for existing closet doors, tracks, and hardware',
    features: ['Track repair', 'Hardware replacement', 'Door realignment', 'Performance tuning'],
    timeline: '1-2 hours'
  }
]

const installationProcess = [
  {
    step: '01',
    title: 'Site Preparation',
    description: 'Protect floors and furniture, prepare work area with professional tools and materials',
    duration: '30 minutes',
    icon: <Shield className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Precision Installation',
    description: 'Install tracks, mount doors, and ensure perfect alignment and smooth operation',
    duration: '2-4 hours',
    icon: <Wrench className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Quality Testing',
    description: 'Thorough testing of all mechanisms, adjustments, and performance verification',
    duration: '30 minutes',
    icon: <Gauge className="w-6 h-6" />
  },
  {
    step: '04',
    title: 'Cleanup & Walkthrough',
    description: 'Complete cleanup, final inspection, and operational walkthrough with client',
    duration: '30 minutes',
    icon: <ThumbsUp className="w-6 h-6" />
  }
]

const installationPricing = [
  {
    name: 'Basic Door Installation',
    basePrice: '$249',
    description: 'Standard sliding or bypass closet door installation',
    includes: [
      'Up to 2 doors',
      'Track installation',
      'Basic hardware',
      'Cleanup included'
    ],
    additional: '$75 per additional door',
    timeline: '2-3 hours'
  },
  {
    name: 'Premium Installation Package',
    basePrice: '$449',
    description: 'Complete installation with premium features and enhanced service',
    includes: [
      'Up to 4 doors',
      'Custom track cutting',
      'Premium hardware',
      'Fine-tuning adjustments',
      'Extended warranty'
    ],
    additional: '$100 per additional door',
    timeline: '4-5 hours',
    popular: true
  },
  {
    name: 'Custom System Installation',
    basePrice: '$799',
    description: 'Full custom closet system with doors, organizers, and accessories',
    includes: [
      'Complete closet system',
      'Custom configuration',
      'All accessories',
      'Project management',
      'Priority scheduling'
    ],
    additional: 'Custom quote',
    timeline: '6-8 hours'
  }
]

const testimonials = [
  {
    name: 'Michael Thompson',
    location: 'Kanata, Ottawa',
    rating: 5,
    text: 'The installation team was incredibly professional. They arrived on time, worked efficiently, and the quality of their work exceeded my expectations. Highly recommend!',
    project: 'Bypass Doors Installation'
  },
  {
    name: 'Lisa Chang',
    location: 'Nepean, Ottawa',
    rating: 5,
    text: 'From start to finish, the installation process was seamless. The technicians were knowledgeable, clean, and paid attention to every detail.',
    project: 'Custom Closet System'
  },
  {
    name: 'Robert & Jennifer Miller',
    location: 'Orléans, Ottawa',
    rating: 5,
    text: 'Professional, punctual, and perfectionists! Our new closet doors operate flawlessly. The lifetime warranty gives us complete peace of mind.',
    project: 'Walk-in Closet Installation'
  }
]

const serviceFeatures = [
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Certified Installers',
    description: 'All technicians are fully certified, insured, and continuously trained on the latest installation techniques'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Same-Day Service',
    description: 'Available for most standard installations. Call before noon for same-day installation service'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Lifetime Warranty',
    description: 'Complete warranty coverage on both products and workmanship for your peace of mind'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'On-Time Guarantee',
    description: 'We respect your time. Guaranteed on-time arrival or you receive a $50 discount'
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'Equipment Ready',
    description: 'Our installers arrive with all necessary tools, equipment, and materials for efficient service'
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: 'Final Inspection',
    description: 'Comprehensive quality check and operational walkthrough before we consider the job complete'
  }
]

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40" />
          <Image
            src="/images/arcat/renin_176725_Bypass_Closet_Doors_Georgian_6_Panel_Design.jpg"
            alt="Professional closet installation team at work"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-gold text-slate-900 text-sm font-medium rounded-full mb-6 tracking-wider uppercase">
              Professional Installation
            </span>
            <Heading level={1} className="text-white mb-6 text-5xl md:text-6xl">
              Expert Installation
              <span className="block text-gold">Guaranteed Quality</span>
            </Heading>
            <Text size="lg" className="text-gray-300 mb-8 text-xl max-w-2xl mx-auto">
              Certified technicians delivering flawless installation with precision tools,
              lifetime warranty, and attention to every detail
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Installation
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Call (613) 123-4567
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Certified Installers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Same-Day Service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Insured & Bonded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Services */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Services
          </Text>
          <Heading level={2} className="mb-4">
            Professional Installation Services
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            From simple door replacements to complete custom closet systems, we handle every project with expertise
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {installationServices.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6">
                {service.icon}
              </div>
              <Heading level={3} className="mb-4">{service.title}</Heading>
              <Text variant="secondary" className="mb-6">{service.description}</Text>
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{service.timeline}</span>
                </div>
                <Button variant="outline" size="sm">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Installation Process */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Process
          </Text>
          <Heading level={2} className="mb-4">
            Our Installation Process
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Systematic approach ensuring perfect results every time
          </Text>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {installationProcess.map((step, index) => (
              <div key={index} className="relative">
                {index < installationProcess.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gold/20" />
                )}
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gold text-slate-900 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      {step.icon}
                    </div>
                  </div>
                  <Heading level={4} className="mb-2">{step.title}</Heading>
                  <Text variant="secondary" className="text-sm mb-2">{step.description}</Text>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{step.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Installation Pricing */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Pricing
          </Text>
          <Heading level={2} className="mb-4">
            Transparent Pricing
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Clear, competitive pricing with no hidden fees
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {installationPricing.map((pkg, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 ${
              pkg.popular ? 'border-gold scale-105' : 'border-gray-100'
            }`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <Heading level={3} className="mb-2">{pkg.name}</Heading>
                <div className="text-4xl font-bold text-slate-900 mb-2">{pkg.basePrice}</div>
                <Text variant="secondary">{pkg.description}</Text>
              </div>
              <ul className="space-y-3 mb-6">
                {pkg.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Additional:</span>
                  <span className="font-medium">{pkg.additional}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{pkg.timeline}</span>
                </div>
                <Button className={`w-full ${pkg.popular ? 'bg-gold text-slate-900 hover:bg-gold/90' : ''}`} variant={pkg.popular ? 'primary' : 'outline'}>
                  Book Installation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Features */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Why Choose Us
          </Text>
          <Heading level={2} className="mb-4">
            The PG Closets Difference
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            We go beyond standard installation to deliver exceptional service
          </Text>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {serviceFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-4">
                {feature.icon}
              </div>
              <Heading level={4} className="mb-3">{feature.title}</Heading>
              <Text variant="secondary" className="text-sm">{feature.description}</Text>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Testimonials
          </Text>
          <Heading level={2} className="mb-4">
            What Our Clients Say
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Real feedback from satisfied customers who chose our professional installation services
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <Text className="text-gray-700 mb-6 italic">"{testimonial.text}"</Text>
              <div className="border-t pt-4">
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.location}</div>
                <div className="text-xs text-gold mt-1">{testimonial.project}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="lg" className="bg-slate-900 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <Heading level={2} className="text-white mb-6">
            Ready for Professional Installation?
          </Heading>
          <Text size="lg" className="mb-8 text-gray-300">
            Book your installation today and enjoy professional service, lifetime warranty, and perfect results
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Installation
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Get Free Quote
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Fully Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>500+ Installations</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
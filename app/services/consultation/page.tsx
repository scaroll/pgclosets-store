import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'
import { Calendar, CheckCircle2, MessageCircle, Clock, Users, Home, Ruler, Lightbulb, FileText, Star, ArrowRight, Phone, Mail, MapPin, Award, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Expert Design Consultation Services | PG Closets Ottawa',
  description: 'Professional closet design consultation in Ottawa. Free in-home measurements, 3D renderings, instant quotes. Transform your space with expert guidance.',
  keywords: 'closet design consultation, custom closet design, free consultation, 3D closet design, Ottawa interior design',
  openGraph: {
    title: 'Expert Design Consultation Services | PG Closets',
    description: 'Professional closet design consultation with 3D renderings and free measurements',
    images: [
      {
        url: '/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
}

const consultationServices = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'In-Home Consultation',
    description: 'Our design experts visit your space for precise measurements and personalized design recommendations',
    features: ['Room measurement', 'Style assessment', 'Space planning', 'Budget discussion']
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Virtual Design Session',
    description: 'Remote consultation via video call with digital measurements and design mockups',
    features: ['Video consultation', 'Digital measurements', 'Screen sharing', 'Real-time design']
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Design Proposal',
    description: 'Comprehensive design package with 3D renderings, product specifications, and detailed quotes',
    features: ['3D renderings', 'Product catalog', 'Timeline estimate', 'Pricing breakdown']
  }
]

const consultationProcess = [
  {
    step: '01',
    title: 'Initial Contact',
    description: 'Reach out via phone, email, or our online booking system',
    duration: '5 minutes',
    icon: <Phone className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Schedule Consultation',
    description: 'Book a convenient time for your in-home or virtual consultation',
    duration: '10 minutes',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Design Consultation',
    description: '45-minute session with measurements, design discussion, and recommendations',
    duration: '45 minutes',
    icon: <MessageCircle className="w-6 h-6" />
  },
  {
    step: '04',
    title: 'Receive Proposal',
    description: 'Get your detailed design proposal with 3D renderings within 48 hours',
    duration: '24-48 hours',
    icon: <FileText className="w-6 h-6" />
  }
]

const designPackages = [
  {
    name: 'Basic Consultation',
    price: 'Free',
    description: 'Perfect for getting started with expert advice',
    features: [
      '30-minute consultation',
      'Basic space assessment',
      'Style recommendations',
      'Product suggestions',
      'Email summary'
    ],
    recommended: false,
    cta: 'Book Free Session'
  },
  {
    name: 'Premium Design Package',
    price: '$299',
    description: 'Comprehensive design service with professional deliverables',
    features: [
      '45-minute in-home consultation',
      'Detailed measurements',
      '3D design renderings',
      'Product specifications',
      'Installation quote',
      'Priority scheduling',
      'Revisions included'
    ],
    recommended: true,
    cta: 'Get Premium Design'
  },
  {
    name: 'Complete Design Service',
    price: '$599',
    description: 'Full-service design from concept to completion',
    features: [
      '90-minute comprehensive consultation',
      'Complete room measurements',
      'Multiple 3D design options',
      'Material & finish selection',
      'Project management',
      'Installation coordination',
      'Post-installation review',
      '1-year design guarantee'
    ],
    recommended: false,
    cta: 'Start Full Service'
  }
]

const testimonials = [
  {
    name: 'Sarah & Mike Johnson',
    location: 'Kanata, Ottawa',
    rating: 5,
    text: 'The consultation exceeded our expectations. The designer listened to our needs and created a beautiful, functional closet system that maximized our space.',
    project: 'Master Bedroom Closet'
  },
  {
    name: 'David Chen',
    location: 'Orléans, Ottawa',
    rating: 5,
    text: 'Professional, knowledgeable, and creative. The 3D renderings helped us visualize the final result. The installation was flawless.',
    project: 'Walk-in Closet'
  },
  {
    name: 'Emily Rodriguez',
    location: 'Barrhaven, Ottawa',
    rating: 5,
    text: 'Best investment for our home! The designer understood our style perfectly and created something beyond our dreams.',
    project: 'Custom Reach-in Closet'
  }
]

const faqs = [
  {
    question: 'How long does a consultation take?',
    answer: 'Our standard consultations last 45 minutes for in-home visits and 30 minutes for virtual sessions. Premium packages include extended time for detailed planning.'
  },
  {
    question: 'What should I prepare for the consultation?',
    answer: 'Think about your storage needs, style preferences, and budget. It\'s helpful to have examples of designs you like, but our designers can guide you through the process.'
  },
  {
    question: 'Do you provide 3D renderings?',
    answer: 'Yes! Our Premium and Complete packages include detailed 3D renderings so you can visualize your new closet space before making any decisions.'
  },
  {
    question: 'Is the consultation really free?',
    answer: 'Our basic 30-minute consultation is completely free with no obligation. We believe in providing value upfront to help you make informed decisions.'
  },
  {
    question: 'How soon can I schedule a consultation?',
    answer: 'We typically have availability within 3-5 business days. Priority scheduling is available with our Premium packages.'
  },
  {
    question: 'Do you serve areas outside Ottawa?',
    answer: 'Yes! We serve the entire Ottawa region including Kanata, Nepean, Orléans, Barrhaven, and surrounding areas up to 50km from downtown Ottawa.'
  }
]

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <Image
            src="/images/arcat/renin_155732_Bypass_Closet_Doors_Euro_3_Lite.jpg"
            alt="Professional closet design consultation"
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
              Expert Design Services
            </span>
            <Heading level={1} className="text-white mb-6 text-5xl md:text-6xl">
              Transform Your Space
              <span className="block text-gold">With Expert Design</span>
            </Heading>
            <Text size="lg" className="text-gray-300 mb-8 text-xl max-w-2xl mx-auto">
              Professional closet design consultations with 3D renderings, precise measurements,
              and personalized solutions tailored to your lifestyle
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Book Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Call (613) 123-4567
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Free Measurements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>3D Renderings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Instant Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>No Obligation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Services */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Our Services
          </Text>
          <Heading level={2} className="mb-4">
            Choose Your Consultation Type
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            We offer flexible consultation options to suit your needs and schedule
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {consultationServices.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6">
                {service.icon}
              </div>
              <Heading level={3} className="mb-4">{service.title}</Heading>
              <Text variant="secondary" className="mb-6">{service.description}</Text>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Process Timeline */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Process
          </Text>
          <Heading level={2} className="mb-4">
            Simple 4-Step Process
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            From initial contact to final design, we make the process smooth and transparent
          </Text>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {consultationProcess.map((step, index) => (
              <div key={index} className="relative">
                {index < consultationProcess.length - 1 && (
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

      {/* Design Packages */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Pricing
          </Text>
          <Heading level={2} className="mb-4">
            Design Packages
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Choose the perfect package for your project needs and budget
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {designPackages.map((pkg, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 ${
              pkg.recommended ? 'border-gold scale-105' : 'border-gray-100'
            }`}>
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <Heading level={3} className="mb-2">{pkg.name}</Heading>
                <div className="text-4xl font-bold text-slate-900 mb-2">{pkg.price}</div>
                <Text variant="secondary">{pkg.description}</Text>
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${pkg.recommended ? 'bg-gold text-slate-900 hover:bg-gold/90' : ''}`}
                variant={pkg.recommended ? 'primary' : 'outline'}
              >
                {pkg.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Testimonials
          </Text>
          <Heading level={2} className="mb-4">
            What Our Clients Say
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
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

      {/* FAQ Section */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Questions
          </Text>
          <Heading level={2} className="mb-4">
            Frequently Asked Questions
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Got questions? We've got answers. If you don't see your question here, feel free to contact us.
          </Text>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 cursor-pointer">
                <summary className="font-semibold text-slate-900 flex items-center justify-between">
                  {faq.question}
                </summary>
                <Text variant="secondary" className="mt-4">{faq.answer}</Text>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" spacing="lg" className="bg-slate-900 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <Heading level={2} className="text-white mb-6">
            Ready to Transform Your Space?
          </Heading>
          <Text size="lg" className="mb-8 text-gray-300">
            Book your free consultation today and take the first step toward your dream closet
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with Designer
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>500+ Happy Clients</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
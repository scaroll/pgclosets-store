import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/Heading-new'
import Text from '@/components/ui/Text-new'
import Section from '@/components/ui/Section-new'
import {
  Palette,
  Ruler,
  Lightbulb,
  CheckCircle2,
  Star,
  ArrowRight,
  Calendar,
  Phone,
  Home,
  Eye,
  Layers,
  Award,
  Shield,
  Users,
  Clock,
  Zap,
  Cpu,
  FileText,
  Sparkles,
  Gem
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bespoke Custom Closet Design Ottawa | Luxury Solutions | PG Closets',
  description: 'Premium custom closet design services in Ottawa. Bespoke solutions, 3D renderings, luxury materials. Transform your space with tailor-made designs.',
  keywords: 'custom closet design, bespoke closets, luxury closet systems, custom storage solutions, Ottawa interior design',
  openGraph: {
    title: 'Bespoke Custom Closet Design | PG Closets',
    description: 'Luxury custom closet solutions with personalized design and premium materials',
    images: [
      {
        url: '/images/arcat/renin_176732_hd.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
}

const customServices = [
  {
    icon: <Gem className="w-8 h-8" />,
    title: 'Bespoke Design',
    description: 'Tailor-made closet solutions designed specifically for your space, lifestyle, and aesthetic preferences',
    features: ['Unique layouts', 'Custom dimensions', 'Personalized styling', 'Luxury finishes']
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: 'Material Selection',
    description: 'Access to premium materials including exotic woods, specialty glass, custom hardware, and innovative finishes',
    features: ['Exotic woods', 'Specialty glass', 'Custom hardware', 'Smart storage']
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'Smart Integration',
    description: 'Incorporate modern technology including LED lighting, motorized systems, and smart organization features',
    features: ['LED lighting', 'Motorized doors', 'Smart organization', 'Integrated tech']
  }
]

const designProcess = [
  {
    step: '01',
    title: 'Discovery & Vision',
    description: 'Comprehensive consultation to understand your lifestyle, storage needs, and design aspirations',
    duration: '60 minutes',
    icon: <Eye className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Space Analysis',
    description: 'Detailed measurement and structural analysis to identify opportunities and optimize every inch of space',
    duration: '45 minutes',
    icon: <Ruler className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Concept Development',
    description: 'Multiple design concepts with 3D renderings, material samples, and detailed specifications',
    duration: '1-2 weeks',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    step: '04',
    title: 'Refinement & Finalization',
    description: 'Collaborative refinement to perfect every detail, from finishes to hardware to accessories',
    duration: '3-5 days',
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    step: '05',
    title: 'Implementation',
    description: 'Professional fabrication and installation with project management and quality oversight',
    duration: '2-4 weeks',
    icon: <Award className="w-6 h-6" />
  }
]

const designPackages = [
  {
    name: 'Signature Custom',
    basePrice: '$1,999',
    description: 'Premium custom design with personalized features and luxury materials',
    includes: [
      'In-depth design consultation',
      'Custom 3D renderings',
      'Material specification',
      'Hardware selection',
      'Project management',
      '2 design revisions'
    ],
    popular: true,
    timeline: '3-4 weeks'
  },
  {
    name: 'Elite Bespoke',
    basePrice: '$4,999',
    description: 'Ultimate luxury experience with unlimited customization and premium features',
    includes: [
      'Luxury design consultation',
      'Multiple concept designs',
      'Advanced 3D visualization',
      'Exotic material selection',
      'Smart technology integration',
      'Unlimited revisions',
      'White-glove service'
    ],
    timeline: '4-6 weeks'
  },
  {
    name: 'Architectural Series',
    basePrice: '$9,999+',
    description: 'Comprehensive room transformation with integrated architectural elements',
    includes: [
      'Architectural consultation',
      'Full room integration',
      'Structural modifications',
      'Premium luxury materials',
      'Custom manufacturing',
      'Dedicated project team',
      'Priority scheduling'
    ],
    timeline: '6-8 weeks'
  }
]

const portfolioProjects = [
  {
    title: 'Modern Minimalist Walk-in',
    category: 'Luxury Walk-in',
    description: 'Sleek, handleless design with integrated LED lighting and custom organizational systems',
    image: '/images/arcat/renin_176733_hd.jpg',
    features: ['LED lighting', 'Custom organizers', 'Glass partitions', 'Premium hardware']
  },
  {
    title: 'Classic Traditional Reach-in',
    category: 'Custom Reach-in',
    description: 'Elegant walnut finish with brass hardware and traditional craftsmanship details',
    image: '/images/arcat/renin_176737_hd.jpg',
    features: ['Walnut finish', 'Brass hardware', 'Traditional details', 'Custom shelving']
  },
  {
    title: 'Smart Storage Solution',
    category: 'Innovative Design',
    description: 'High-tech storage with motorized components, smart lighting, and integrated charging stations',
    image: '/images/arcat/renin_192861_hd.jpg',
    features: ['Motorized doors', 'Smart lighting', 'Charging stations', 'Automated organization']
  }
]

const premiumFeatures = [
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Award-Winning Designers',
    description: 'Our design team has won multiple awards for innovative closet design and customer satisfaction'
  },
  {
    icon: <Gem className="w-6 h-6" />,
    title: 'Luxury Materials',
    description: 'Access to exclusive materials including imported woods, specialty glass, and designer hardware collections'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Quick Turnaround',
    description: 'Efficient design process with advanced 3D modeling and rapid prototyping capabilities'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Quality Guarantee',
    description: 'Comprehensive warranty on all custom designs with ongoing support and maintenance services'
  }
]

export default function CustomDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <Image
            src="/images/arcat/renin_176732_hd.jpg"
            alt="Luxury custom closet design showcase"
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
              Bespoke Design Services
            </span>
            <Heading level={1} className="text-white mb-6 text-5xl md:text-6xl">
              Custom Closet
              <span className="block text-gold">Masterpieces</span>
            </Heading>
            <Text size="lg" className="text-gray-300 mb-8 text-xl max-w-2xl mx-auto">
              Where imagination meets craftsmanship. Create truly unique spaces with our bespoke design service,
              featuring luxury materials and unparalleled personalization
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Start Custom Design
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
                <Eye className="mr-2 h-5 w-5" />
                View Portfolio
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>100% Custom</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Luxury Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Smart Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>Expert Craftsmanship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Services */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Custom Services
          </Text>
          <Heading level={2} className="mb-4">
            Beyond Standard Solutions
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Our bespoke design service transforms ordinary spaces into extraordinary experiences
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {customServices.map((service, index) => (
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

      {/* Design Process */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Process
          </Text>
          <Heading level={2} className="mb-4">
            The Design Journey
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            From concept to reality, our meticulous process ensures every detail exceeds your expectations
          </Text>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6">
            {designProcess.map((step, index) => (
              <div key={index} className="relative">
                {index < designProcess.length - 1 && (
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
                  <Heading level={4} className="mb-2 text-sm">{step.title}</Heading>
                  <Text variant="secondary" className="text-xs mb-2">{step.description}</Text>
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

      {/* Portfolio Preview */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Portfolio
          </Text>
          <Heading level={2} className="mb-4">
            Recent Masterpieces
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Explore our latest custom designs and imagine the possibilities for your space
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {portfolioProjects.map((project, index) => (
            <div key={index} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-xs text-gold mb-1">{project.category}</div>
                  <Heading level={4} className="text-white mb-2">{project.title}</Heading>
                  <Text variant="secondary" className="text-gray-200 text-sm">{project.description}</Text>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Project Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View Full Portfolio
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Section>

      {/* Design Packages */}
      <Section spacing="lg">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Investment
          </Text>
          <Heading level={2} className="mb-4">
            Custom Design Packages
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Tailored investment levels to match your vision and requirements
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {designPackages.map((pkg, index) => (
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
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">{pkg.timeline}</span>
                </div>
                <Button className={`w-full ${pkg.popular ? 'bg-gold text-slate-900 hover:bg-gold/90' : ''}`} variant={pkg.popular ? 'default' : 'outline'}>
                  Begin Custom Design
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Premium Features */}
      <Section variant="light" spacing="lg" className="bg-gray-50">
        <div className="text-center mb-16">
          <Text size="xs" variant="muted" className="inline-block uppercase tracking-widest mb-4">
            Premium Experience
          </Text>
          <Heading level={2} className="mb-4">
            The PG Closets Difference
          </Heading>
          <Text size="lg" variant="secondary" className="max-w-2xl mx-auto">
            Why discerning clients choose our bespoke design service
          </Text>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {premiumFeatures.map((feature, index) => (
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

      {/* CTA Section */}
      <Section variant="dark" spacing="lg" className="bg-slate-900 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <Heading level={2} className="text-white mb-6">
            Ready to Create Your Masterpiece?
          </Heading>
          <Text size="lg" className="mb-8 text-gray-300">
            Begin your custom design journey today and transform your space into something extraordinary
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold text-slate-900 hover:bg-gold/90 px-8 py-4 text-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Design Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-semibold">
              <FileText className="mr-2 h-5 w-5" />
              Request Design Portfolio
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              <span>Award-Winning Designers</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-gold" />
              <span>Luxury Materials</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              <span>100% Satisfaction</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
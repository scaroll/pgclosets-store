/**
 * Service Data Structure and Configuration
 * Comprehensive service definitions for PG Closets
 */

import { LucideIcon, Ruler, Home, Wrench, Shield, Settings, FileText } from 'lucide-react';

export interface Step {
  number: number;
  title: string;
  description: string;
  duration?: string;
  icon?: LucideIcon;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  image?: string;
}

export interface BeforeAfter {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  service: string;
  location: string;
}

export interface PricingFactor {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ServicePricing {
  starting: number;
  average: number;
  high?: number;
  currency: string;
  unit?: string; // per linear foot, per door, etc.
  factors: PricingFactor[];
  disclaimer?: string;
}

export interface Service {
  slug: string;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  heroImage: string;
  process: Step[];
  benefits: string[];
  pricing: ServicePricing;
  duration: string;
  availability: string;
  faqs: FAQ[];
  testimonials?: Testimonial[];
  gallery?: BeforeAfter[];
  callToAction: string;
  metaDescription: string;
  keywords: string[];
}

export const services: Service[] = [
  {
    slug: 'consultation',
    name: 'Free Consultation',
    title: 'Expert Design Consultation for Your Dream Closet',
    description: 'Transform your space with a personalized consultation from our design experts.',
    longDescription: 'Our complimentary in-home consultation is the first step to creating your dream closet. Our experienced designers will assess your space, understand your needs, and provide professional recommendations tailored to your lifestyle and budget.',
    icon: FileText,
    heroImage: '/images/services/consultation-hero.jpg',
    process: [
      {
        number: 1,
        title: 'Schedule Your Visit',
        description: 'Book a convenient time for our designer to visit your home. We offer flexible scheduling including evenings and weekends.',
        duration: '5 minutes',
      },
      {
        number: 2,
        title: 'Space Assessment',
        description: 'Our designer will measure your space, evaluate your current storage needs, and discuss your vision for the perfect closet.',
        duration: '30-45 minutes',
      },
      {
        number: 3,
        title: 'Design Presentation',
        description: 'Receive a custom 3D design concept on the spot using our advanced design software, with multiple layout options to choose from.',
        duration: '30 minutes',
      },
      {
        number: 4,
        title: 'Quote & Timeline',
        description: 'Get a detailed quote with transparent pricing and a clear installation timeline. No hidden fees or surprises.',
        duration: '15 minutes',
      },
    ],
    benefits: [
      'Free, no-obligation consultation',
      'Professional space planning and design',
      '3D visualization of your future closet',
      'Personalized storage solutions',
      'Expert advice on materials and finishes',
      'Accurate measurements by professionals',
      'Budget-friendly options presented',
      'Lifetime warranty information',
    ],
    pricing: {
      starting: 0,
      average: 0,
      currency: 'CAD',
      factors: [
        {
          name: 'Consultation',
          description: 'Always free with no obligation',
          impact: 'low',
        },
      ],
      disclaimer: 'Our consultation service is completely free with no obligation to purchase.',
    },
    duration: '60-90 minutes',
    availability: 'Monday-Saturday, 9 AM - 8 PM',
    faqs: [
      {
        question: 'Is the consultation really free?',
        answer: 'Yes! Our in-home consultation is completely free with no obligation to purchase. We believe in earning your business through exceptional service and design.',
        category: 'General',
      },
      {
        question: 'What should I prepare for the consultation?',
        answer: 'Clear the closet area if possible, gather inspiration images, and think about your storage needs. Our designer will handle everything else!',
        category: 'Preparation',
      },
      {
        question: 'Can I get a quote during the consultation?',
        answer: 'Absolutely! Our designers use advanced software to provide accurate quotes on the spot, complete with 3D visualizations.',
        category: 'Pricing',
      },
      {
        question: 'Do you offer virtual consultations?',
        answer: 'Yes, we offer virtual consultations via video call for initial discussions, though we recommend an in-person visit for accurate measurements.',
        category: 'General',
      },
    ],
    callToAction: 'Book Your Free Consultation',
    metaDescription: 'Schedule your free in-home closet design consultation in Ottawa. Expert designers, 3D visualization, and transparent pricing. Book today!',
    keywords: ['closet consultation', 'free design', 'Ottawa closets', 'custom storage', 'home organization'],
  },
  {
    slug: 'measurement',
    name: 'Professional Measurement',
    title: 'Precise Measurements for Perfect Fit Closets',
    description: 'Ensure a flawless installation with our professional measurement service.',
    longDescription: 'Accurate measurements are crucial for a perfect closet installation. Our certified technicians use laser technology and years of experience to capture every detail of your space, ensuring your custom closet fits perfectly.',
    icon: Ruler,
    heroImage: '/images/services/measurement-hero.jpg',
    process: [
      {
        number: 1,
        title: 'Schedule Measurement',
        description: 'Book a measurement appointment at your convenience. Our technicians arrive on time with professional equipment.',
        duration: '5 minutes',
      },
      {
        number: 2,
        title: 'Detailed Measuring',
        description: 'Using laser measurers and traditional tools, we capture exact dimensions, noting electrical outlets, vents, and obstacles.',
        duration: '45 minutes',
      },
      {
        number: 3,
        title: 'Documentation',
        description: 'All measurements are documented digitally and verified for accuracy. Photos are taken for reference during manufacturing.',
        duration: '15 minutes',
      },
      {
        number: 4,
        title: 'Final Verification',
        description: 'Measurements are reviewed with you and our design team performs a final check before manufacturing begins.',
        duration: '10 minutes',
      },
    ],
    benefits: [
      'Laser-accurate measurements',
      'Identification of structural considerations',
      'Documentation of electrical and plumbing',
      'Professional floor plan creation',
      'Eliminates installation surprises',
      'Ensures perfect fit on installation day',
      'Digital measurement backup',
      'Peace of mind guarantee',
    ],
    pricing: {
      starting: 99,
      average: 149,
      high: 199,
      currency: 'CAD',
      factors: [
        {
          name: 'Space Size',
          description: 'Larger spaces require more time',
          impact: 'medium',
        },
        {
          name: 'Complexity',
          description: 'Angled walls and obstacles add time',
          impact: 'high',
        },
        {
          name: 'Number of Closets',
          description: 'Multiple spaces can be bundled',
          impact: 'low',
        },
      ],
      disclaimer: 'Measurement fee is credited towards your purchase when you proceed with installation.',
    },
    duration: '60-90 minutes',
    availability: 'Monday-Friday, 9 AM - 6 PM',
    faqs: [
      {
        question: 'Why do I need professional measurement?',
        answer: 'Professional measurement ensures your custom closet fits perfectly, avoiding costly mistakes and delays. Our technicians identify potential issues before manufacturing.',
        category: 'General',
      },
      {
        question: 'Is the measurement fee refundable?',
        answer: 'The measurement fee is fully credited towards your closet purchase when you proceed with installation.',
        category: 'Pricing',
      },
      {
        question: 'How soon after measurement can installation begin?',
        answer: 'Manufacturing typically begins within 48 hours of measurement approval, with installation scheduled 2-3 weeks later.',
        category: 'Timeline',
      },
    ],
    callToAction: 'Schedule Professional Measurement',
    metaDescription: 'Professional closet measurement service in Ottawa. Laser-accurate measurements ensure perfect fit. Fee credited to purchase. Book today!',
    keywords: ['closet measurement', 'professional measuring', 'laser measurement', 'custom closets Ottawa'],
  },
  {
    slug: 'installation',
    name: 'Expert Installation',
    title: 'Professional Closet Installation by Certified Experts',
    description: 'Seamless, efficient installation by our factory-trained professionals.',
    longDescription: 'Our certified installation team brings your dream closet to life with precision and care. With years of experience and specialized training, we ensure a flawless installation that will last for decades.',
    icon: Wrench,
    heroImage: '/images/services/installation-hero.jpg',
    process: [
      {
        number: 1,
        title: 'Pre-Installation Call',
        description: 'We confirm your appointment and review the installation plan, ensuring everything is ready for a smooth installation.',
        duration: '24 hours before',
      },
      {
        number: 2,
        title: 'Professional Setup',
        description: 'Our team arrives on time, protects your floors and walls, and sets up a clean, organized workspace.',
        duration: '30 minutes',
      },
      {
        number: 3,
        title: 'Expert Installation',
        description: 'Components are installed with precision, ensuring perfect alignment, secure mounting, and flawless operation.',
        duration: '4-8 hours',
      },
      {
        number: 4,
        title: 'Quality Check & Cleanup',
        description: 'We inspect every detail, demonstrate features, and leave your home spotless with your beautiful new closet ready to use.',
        duration: '30 minutes',
      },
    ],
    benefits: [
      'Factory-trained installers',
      'Same-day completion for most projects',
      'Floor and wall protection included',
      'Complete cleanup after installation',
      'Hardware adjustment and alignment',
      'Feature demonstration and tips',
      'Warranty registration completed',
      'Satisfaction guarantee',
    ],
    pricing: {
      starting: 299,
      average: 599,
      high: 1299,
      currency: 'CAD',
      unit: 'per closet',
      factors: [
        {
          name: 'Closet Size',
          description: 'Larger closets require more time',
          impact: 'high',
        },
        {
          name: 'Complexity',
          description: 'Custom features and accessories',
          impact: 'medium',
        },
        {
          name: 'Accessibility',
          description: 'Stairs and tight spaces',
          impact: 'low',
        },
      ],
      disclaimer: 'Installation pricing varies based on project scope. Exact quote provided during consultation.',
    },
    duration: '4-8 hours typically',
    availability: 'Monday-Saturday, 8 AM - 6 PM',
    faqs: [
      {
        question: 'How long does installation take?',
        answer: 'Most reach-in closets are completed in 4-6 hours, while walk-in closets typically take 6-8 hours. We always complete installation in one day.',
        category: 'Timeline',
      },
      {
        question: 'Do I need to prepare the space?',
        answer: 'Simply clear the closet of all items. Our team handles everything else, including protection of floors and walls.',
        category: 'Preparation',
      },
      {
        question: 'Are installers insured and certified?',
        answer: 'Yes, all our installers are fully insured, background-checked, and factory-certified with ongoing training.',
        category: 'Safety',
      },
      {
        question: 'What if something doesn\'t fit?',
        answer: 'Our precision measurement process virtually eliminates fit issues. If adjustments are needed, we handle them on-site at no extra charge.',
        category: 'Quality',
      },
    ],
    callToAction: 'Schedule Installation',
    metaDescription: 'Professional closet installation in Ottawa. Factory-trained experts, same-day completion, lifetime warranty. Book your installation today!',
    keywords: ['closet installation', 'professional installers', 'Ottawa installation', 'custom closet setup'],
  },
  {
    slug: 'warranty',
    name: 'Lifetime Warranty',
    title: 'Comprehensive Lifetime Warranty Protection',
    description: 'Peace of mind with our industry-leading lifetime warranty coverage.',
    longDescription: 'Our lifetime warranty demonstrates our commitment to quality and your satisfaction. We stand behind every component, every installation, and every promise we make to our customers.',
    icon: Shield,
    heroImage: '/images/services/warranty-hero.jpg',
    process: [
      {
        number: 1,
        title: 'Automatic Registration',
        description: 'Your warranty is automatically registered upon installation completion. No paperwork needed.',
        duration: 'Immediate',
      },
      {
        number: 2,
        title: 'Report an Issue',
        description: 'Contact us by phone, email, or through our website. Provide photos if possible for faster resolution.',
        duration: '5 minutes',
      },
      {
        number: 3,
        title: 'Quick Assessment',
        description: 'Our warranty team reviews your claim within 24 hours and schedules a service visit if needed.',
        duration: '24 hours',
      },
      {
        number: 4,
        title: 'Resolution',
        description: 'Repairs or replacements are completed promptly at no charge for all covered items.',
        duration: '3-5 business days',
      },
    ],
    benefits: [
      'Lifetime coverage on all components',
      'No deductibles or hidden fees',
      'Transferable to new homeowners',
      'Coverage for manufacturing defects',
      'Hardware replacement included',
      'Finish and coating protection',
      'Professional repair service',
      'Quick claim resolution',
    ],
    pricing: {
      starting: 0,
      average: 0,
      currency: 'CAD',
      factors: [
        {
          name: 'Warranty Coverage',
          description: 'Included with every purchase',
          impact: 'low',
        },
      ],
      disclaimer: 'Lifetime warranty included at no additional cost with every PG Closets installation.',
    },
    duration: 'Lifetime',
    availability: '24/7 claim submission',
    faqs: [
      {
        question: 'What does the lifetime warranty cover?',
        answer: 'Our warranty covers all manufactured components, hardware, finishes, and installation workmanship for the lifetime of the product.',
        category: 'Coverage',
      },
      {
        question: 'Is the warranty transferable?',
        answer: 'Yes! The warranty transfers to new homeowners, adding value to your property.',
        category: 'Transfer',
      },
      {
        question: 'What\'s not covered?',
        answer: 'Normal wear and tear, misuse, modifications by others, and acts of nature are not covered. Full terms provided at installation.',
        category: 'Exclusions',
      },
      {
        question: 'How quickly are claims resolved?',
        answer: 'Most claims are assessed within 24 hours, with repairs completed within 3-5 business days.',
        category: 'Service',
      },
    ],
    callToAction: 'Learn More About Our Warranty',
    metaDescription: 'Lifetime warranty on custom closets in Ottawa. No deductibles, transferable coverage, quick claim resolution. Peace of mind guaranteed.',
    keywords: ['lifetime warranty', 'closet warranty', 'warranty coverage', 'Ottawa warranty service'],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance & Care',
    title: 'Professional Maintenance to Keep Your Closet Like New',
    description: 'Regular maintenance services to ensure lasting beauty and functionality.',
    longDescription: 'Keep your custom closet looking and functioning like new with our professional maintenance services. Our experts provide cleaning, adjustments, and preventive care to extend the life of your investment.',
    icon: Settings,
    heroImage: '/images/services/maintenance-hero.jpg',
    process: [
      {
        number: 1,
        title: 'Schedule Service',
        description: 'Book your annual or semi-annual maintenance visit at your convenience.',
        duration: '5 minutes',
      },
      {
        number: 2,
        title: 'Comprehensive Inspection',
        description: 'Our technician inspects all components, checking for wear, alignment, and proper operation.',
        duration: '30 minutes',
      },
      {
        number: 3,
        title: 'Professional Service',
        description: 'Cleaning, lubrication, adjustments, and minor repairs are completed to factory specifications.',
        duration: '60-90 minutes',
      },
      {
        number: 4,
        title: 'Care Instructions',
        description: 'Receive personalized care tips and recommendations to maintain your closet between visits.',
        duration: '15 minutes',
      },
    ],
    benefits: [
      'Extends closet lifespan',
      'Maintains warranty validity',
      'Prevents costly repairs',
      'Professional deep cleaning',
      'Hardware adjustments included',
      'Drawer slide maintenance',
      'Touch-up services available',
      'Priority scheduling for members',
    ],
    pricing: {
      starting: 149,
      average: 199,
      high: 299,
      currency: 'CAD',
      unit: 'per visit',
      factors: [
        {
          name: 'Closet Size',
          description: 'Larger systems require more time',
          impact: 'medium',
        },
        {
          name: 'Service Level',
          description: 'Basic to comprehensive packages',
          impact: 'high',
        },
        {
          name: 'Frequency',
          description: 'Annual plans offer savings',
          impact: 'low',
        },
      ],
      disclaimer: 'Annual maintenance plans available with 20% savings. Ask about our VIP membership.',
    },
    duration: '90-120 minutes',
    availability: 'Monday-Friday, 9 AM - 5 PM',
    faqs: [
      {
        question: 'How often should I schedule maintenance?',
        answer: 'We recommend annual maintenance for most closets, or semi-annual for heavily used systems.',
        category: 'Schedule',
      },
      {
        question: 'What\'s included in maintenance service?',
        answer: 'Complete inspection, cleaning, hardware adjustments, drawer slide servicing, and minor repairs are all included.',
        category: 'Service',
      },
      {
        question: 'Do you offer maintenance plans?',
        answer: 'Yes! Our annual plans include scheduled visits with 20% savings plus priority scheduling and additional perks.',
        category: 'Plans',
      },
      {
        question: 'Can I maintain my closet myself?',
        answer: 'We provide care instructions, but professional maintenance ensures warranty compliance and optimal performance.',
        category: 'DIY',
      },
    ],
    callToAction: 'Schedule Maintenance Service',
    metaDescription: 'Professional closet maintenance in Ottawa. Keep your custom closet like new with expert care. Annual plans available. Book service today!',
    keywords: ['closet maintenance', 'closet care', 'professional cleaning', 'Ottawa maintenance service'],
  },
];

// Helper functions
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map(service => service.slug);
}

// Sample testimonials data (can be moved to database later)
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'Kanata',
    rating: 5,
    text: 'The consultation was incredibly thorough and professional. Our designer listened to all our needs and created the perfect solution for our master bedroom closet.',
    service: 'consultation',
    date: '2024-11-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'Orleans',
    rating: 5,
    text: 'Installation was flawless! The team was punctual, professional, and left everything spotless. Our new closet looks amazing!',
    service: 'installation',
    date: '2024-11-10',
  },
  {
    id: '3',
    name: 'Jennifer Brown',
    location: 'Barrhaven',
    rating: 5,
    text: 'The lifetime warranty gave us peace of mind. When we had a minor issue, it was resolved within days at no cost. Excellent service!',
    service: 'warranty',
    date: '2024-10-28',
  },
];

// Sample before/after gallery data
export const galleryItems: BeforeAfter[] = [
  {
    id: '1',
    title: 'Master Bedroom Transformation',
    description: 'From cluttered chaos to organized elegance with custom white melamine system.',
    beforeImage: '/images/gallery/master-before.jpg',
    afterImage: '/images/gallery/master-after.jpg',
    service: 'installation',
    location: 'Kanata',
  },
  {
    id: '2',
    title: 'Walk-in Closet Upgrade',
    description: 'Maximized storage with floor-to-ceiling system featuring LED lighting.',
    beforeImage: '/images/gallery/walkin-before.jpg',
    afterImage: '/images/gallery/walkin-after.jpg',
    service: 'installation',
    location: 'Orleans',
  },
];

export default services;
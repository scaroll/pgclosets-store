/**
 * Homepage Content Library
 * Elegant, professional copy for PG Closets homepage
 */

export const homepageContent = {
  hero: {
    headline: "Elevated Taste Without Pretense",
    subheadline: "Transform your space with premium closet solutions",
    tagline: "Ottawa's trusted partner for sophisticated storage",
    ctaPrimary: "Explore Collections",
    ctaSecondary: "Book Consultation"
  },

  introduction: {
    heading: "Thoughtfully Designed. Expertly Crafted.",
    body: "At PG Closets, we believe exceptional design should be accessible, not exclusive. As Ottawa's official Renin dealer, we bring together superior craftsmanship, timeless aesthetics, and practical functionality to create spaces that simply work better.",
    emphasis: "Your home deserves solutions that are both beautiful and built to last."
  },

  valueProposition: {
    headline: "Why Discerning Homeowners Choose PG Closets",
    sections: [
      {
        title: "Curated Collections",
        description: "Hand-selected products from Renin, Canada's premier door manufacturer. Every option in our collection meets our exacting standards for quality, design, and durability.",
        icon: "✦"
      },
      {
        title: "Expert Guidance",
        description: "Our experienced team helps you navigate choices with clarity and confidence. No pressure, no pretense—just honest advice tailored to your space and style.",
        icon: "◆"
      },
      {
        title: "Professional Installation",
        description: "Precision matters. Our certified installers treat your home with care and complete every project to the highest standards. Your satisfaction is our benchmark.",
        icon: "▲"
      },
      {
        title: "Lifetime Partnership",
        description: "We're here beyond the installation. Comprehensive warranty, ongoing support, and a commitment to your long-term satisfaction. Consider us your trusted resource.",
        icon: "●"
      }
    ]
  },

  featuredProducts: {
    heading: "Explore Our Signature Collections",
    subheading: "From minimalist barn doors to sophisticated closet systems, discover solutions that elevate your everyday.",
    collections: [
      {
        name: "Barn Doors",
        tagline: "Modern elegance on rails",
        description: "Make a statement with our curated selection of barn doors. Sleek hardware, premium materials, and timeless designs that complement any interior aesthetic."
      },
      {
        name: "Closet Systems",
        tagline: "Organization, refined",
        description: "Custom closet solutions that maximize space without sacrificing style. Thoughtful design meets everyday functionality in every configuration."
      },
      {
        name: "Bifold Doors",
        tagline: "Classic versatility",
        description: "Space-saving elegance for bedrooms, laundry rooms, and pantries. Our bifold doors blend seamlessly with your home's architectural language."
      },
      {
        name: "Hardware & Accessories",
        tagline: "The finishing touches",
        description: "Premium hardware that performs as beautifully as it looks. Every detail considered, every component built to endure."
      }
    ]
  },

  processOverview: {
    heading: "A Simple, Transparent Process",
    subheading: "From first consultation to final installation, we make the journey effortless.",
    steps: [
      {
        number: "01",
        title: "Connect",
        description: "Share your vision through a complimentary in-home consultation. We listen, measure, and understand your needs."
      },
      {
        number: "02",
        title: "Design",
        description: "Receive a detailed proposal with transparent pricing. Explore options, review samples, and refine your selection."
      },
      {
        number: "03",
        title: "Create",
        description: "Your custom solution is expertly crafted to precise specifications, ensuring perfect fit and finish."
      },
      {
        number: "04",
        title: "Install",
        description: "Our certified team handles installation with meticulous attention to detail. Your satisfaction is our standard."
      },
      {
        number: "05",
        title: "Enjoy",
        description: "Experience the difference quality makes. Backed by our comprehensive warranty and ongoing support."
      }
    ]
  },

  socialProof: {
    heading: "Trusted by Ottawa Homeowners",
    subheading: "Excellence reflected in every review",
    stats: [
      {
        number: "500+",
        label: "Installations Completed",
        description: "Homes transformed across Ottawa and surrounding communities"
      },
      {
        number: "98%",
        label: "Satisfaction Rate",
        description: "Our clients recommend us to friends and family"
      },
      {
        number: "15+",
        label: "Years of Excellence",
        description: "Family-owned, locally operated, deeply committed"
      },
      {
        number: "2-Year",
        label: "Workmanship Warranty",
        description: "Your investment protected by comprehensive coverage"
      }
    ],
    testimonialHighlight: {
      quote: "The quality exceeded our expectations. Professional from start to finish, and the doors are absolutely stunning.",
      author: "Sarah M.",
      location: "Kanata",
      context: "Custom barn door installation"
    }
  },

  callToAction: {
    primary: {
      heading: "Ready to Transform Your Space?",
      body: "Begin with a complimentary consultation. No obligation, no pressure—just expert guidance and transparent pricing.",
      buttonText: "Schedule Your Consultation",
      secondaryButtonText: "Browse Collections"
    },
    secondary: {
      heading: "Questions? We're Here to Help.",
      body: "Our team is ready to discuss your project, answer questions, and provide the information you need to make confident decisions.",
      phone: "(613) 422-5800",
      email: "info@pgclosets.com",
      hours: "Monday-Friday: 8AM-6PM | Saturday: 9AM-4PM"
    }
  }
} as const

export type HomepageContent = typeof homepageContent

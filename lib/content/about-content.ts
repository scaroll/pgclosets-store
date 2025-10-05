/**
 * About Page Content Library
 * Company story, values, and team information
 */

export const aboutContent = {
  hero: {
    tagline: "Our Story",
    headline: "Family-Owned Excellence Since 2010",
    introduction: "Ottawa-operated and family-owned, PG Closets has been transforming homes across the region with premium Renin door systems and exceptional service for over a decade.",
    ctaPrimary: "Get Free Consultation",
    ctaSecondary: "Browse Collection"
  },

  story: {
    heading: "The PG Closets Journey",
    narrative: [
      "What started as a small family business has grown into Ottawa's most trusted name in premium door systems. As an official Renin dealer, we combine the quality and innovation of Canada's leading door manufacturer with the personal touch and local expertise that only a family business can provide.",

      "Our commitment to excellence has earned us the trust of over 500 Ottawa families, and we're proud to maintain a 98% customer satisfaction rating. Every project, from a simple barn door to a complete closet system, receives the same attention to detail and dedication to quality that has defined our business from day one.",

      "Today, we continue to grow while staying true to our founding principles: transparent pricing, quality products, professional installation, and exceptional customer service. When you choose PG Closets, you're not just getting a door system—you're joining a family of satisfied customers who trust us with their homes."
    ],
    milestones: [
      {
        year: "2010",
        title: "Founded in Ottawa",
        description: "Established as a family-owned business committed to quality and service"
      },
      {
        year: "2012",
        title: "Official Renin Dealer",
        description: "Partnered with Canada's premier door manufacturer"
      },
      {
        year: "2015",
        title: "Expanded Service Area",
        description: "Extended coverage to all Ottawa suburbs and surrounding communities"
      },
      {
        year: "2018",
        title: "500+ Installations",
        description: "Reached milestone of transforming 500 Ottawa homes"
      },
      {
        year: "2020",
        title: "Enhanced Offerings",
        description: "Introduced custom closet systems and expanded product lines"
      },
      {
        year: "2025",
        title: "Continued Excellence",
        description: "Maintaining 98% customer satisfaction with growing team of specialists"
      }
    ]
  },

  values: {
    heading: "What Drives Us",
    subheading: "Our mission is simple: to provide Ottawa homeowners with premium door solutions that enhance both function and beauty in their homes.",

    core: [
      {
        icon: "🏆",
        title: "Quality First",
        description: "We partner exclusively with Renin, Canada's premier door manufacturer, to ensure every product meets the highest standards of excellence and durability.",
        principles: [
          "Rigorous product selection criteria",
          "Premium materials only",
          "Lifetime hardware warranties",
          "Continuous quality monitoring"
        ]
      },
      {
        icon: "🤝",
        title: "Personal Service",
        description: "As a family business, we treat every customer like family, providing personalized attention and care throughout your entire project journey.",
        principles: [
          "Dedicated project consultants",
          "Clear, honest communication",
          "Respect for your home and time",
          "Ongoing relationship focus"
        ]
      },
      {
        icon: "🎯",
        title: "Local Focus",
        description: "We're proud to call Ottawa home and are committed to serving our community with integrity, excellence, and unwavering dedication.",
        principles: [
          "Deep local knowledge",
          "Community investment",
          "Responsive, accessible service",
          "Supporting local suppliers"
        ]
      },
      {
        icon: "💡",
        title: "Continuous Improvement",
        description: "We never stop learning, evolving, and refining our processes to serve you better. Your feedback shapes our future.",
        principles: [
          "Regular team training",
          "Industry best practices",
          "Customer feedback integration",
          "Innovation adoption"
        ]
      }
    ]
  },

  team: {
    heading: "Meet Our Team",
    subheading: "Experienced professionals dedicated to your satisfaction",
    introduction: "Our team brings together decades of combined experience in design, installation, and customer service. Each member is committed to upholding the standards that have made PG Closets Ottawa's trusted choice.",

    departments: [
      {
        name: "Design Consultants",
        description: "Expert guidance in selecting the perfect solutions for your space. Our consultants listen, advise, and design with your vision in mind.",
        expertise: ["Space planning", "Style coordination", "Product selection", "Budget optimization"]
      },
      {
        name: "Installation Specialists",
        description: "Certified professionals who treat your home with care and complete every installation to exacting standards.",
        expertise: ["Precision measurement", "Expert installation", "Quality assurance", "Clean work practices"]
      },
      {
        name: "Customer Care",
        description: "Your dedicated support throughout the process and beyond. We're here to ensure your complete satisfaction.",
        expertise: ["Project coordination", "Scheduling flexibility", "Warranty support", "Ongoing assistance"]
      }
    ]
  },

  differentiators: {
    heading: "The PG Closets Difference",
    subheading: "Why Ottawa homeowners consistently choose us",

    factors: [
      {
        title: "Official Renin Dealer Status",
        description: "Direct partnership with Canada's leading manufacturer ensures authentic products, competitive pricing, and comprehensive support.",
        benefits: [
          "Access to full product line",
          "Manufacturer-backed warranties",
          "Latest innovations first",
          "Factory training and certification"
        ]
      },
      {
        title: "Family-Owned Accountability",
        description: "Our name and reputation are on every project. We don't answer to distant shareholders—we answer to you and our community.",
        benefits: [
          "Personal investment in satisfaction",
          "Direct communication with decision-makers",
          "Long-term relationship focus",
          "Community reputation matters"
        ]
      },
      {
        title: "Comprehensive Expertise",
        description: "From consultation through installation and beyond, our team possesses the knowledge and skill to ensure exceptional results.",
        benefits: [
          "Years of specialized experience",
          "Continuous professional development",
          "Problem-solving capabilities",
          "Attention to detail"
        ]
      },
      {
        title: "Transparent Process",
        description: "No surprises, no hidden fees, no confusing jargon. We explain everything clearly so you make informed decisions with confidence.",
        benefits: [
          "Detailed written estimates",
          "Clear timeline communication",
          "Upfront pricing",
          "Open dialogue throughout"
        ]
      }
    ]
  },

  commitment: {
    heading: "Our Commitment to You",
    promises: [
      {
        title: "Honest Consultation",
        description: "We'll never upsell products you don't need. Our recommendations are based on your actual requirements and budget."
      },
      {
        title: "Quality Materials",
        description: "Every product we install comes from manufacturers we trust, with warranties we stand behind."
      },
      {
        title: "Professional Installation",
        description: "Our certified installers treat your home with respect and complete work to the highest standards."
      },
      {
        title: "Transparent Pricing",
        description: "Detailed estimates with all costs included. What we quote is what you pay."
      },
      {
        title: "Timely Completion",
        description: "We respect your schedule and complete projects within the agreed timeframe."
      },
      {
        title: "Ongoing Support",
        description: "Our relationship doesn't end at installation. We're here for the life of your system."
      }
    ]
  },

  cta: {
    heading: "Ready to Work Together?",
    body: "Experience the PG Closets difference for yourself. Let's create something beautiful and functional for your home.",
    ctaPrimary: "Start Your Project",
    ctaSecondary: "Get In Touch"
  }
} as const

export type AboutContent = typeof aboutContent

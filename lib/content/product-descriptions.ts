/**
 * Product Descriptions Library
 * Compelling, SEO-optimized descriptions for PG Closets products
 */

export const productCategories = {
  barnDoors: {
    categoryName: "Barn Doors",
    tagline: "Where function meets refined aesthetics",
    overview: "Our barn door collection represents the perfect marriage of form and function. Each door is crafted from premium materials and paired with whisper-quiet hardware, creating a statement piece that performs beautifully day after day.",

    benefits: [
      "Space-saving design ideal for tight quarters",
      "Smooth, effortless gliding mechanism",
      "Variety of finishes to complement any décor",
      "Professional installation ensuring perfect alignment",
      "Durable construction built for daily use"
    ],

    idealFor: [
      "Master bedroom closets",
      "Bathroom privacy doors",
      "Home office separators",
      "Laundry room concealment",
      "Pantry and storage areas"
    ],

    styles: {
      modern: {
        name: "Modern Barn Doors",
        description: "Clean lines, minimalist hardware, and contemporary finishes. Our modern barn doors make a sophisticated statement without overwhelming your space.",
        characteristics: ["Sleek profiles", "Matte black or brushed nickel hardware", "Smooth surfaces", "Geometric design elements"]
      },
      rustic: {
        name: "Rustic Barn Doors",
        description: "Warm wood tones and authentic textures bring character and charm. These doors add welcoming ambiance while maintaining refined sophistication.",
        characteristics: ["Natural wood grains", "Traditional plank designs", "Aged hardware finishes", "Authentic craftsmanship details"]
      },
      transitional: {
        name: "Transitional Barn Doors",
        description: "The best of both worlds. Transitional designs blend classic appeal with modern sensibility, creating versatile solutions that feel timeless.",
        characteristics: ["Balanced proportions", "Subtle detailing", "Versatile finishes", "Adaptable to various interiors"]
      }
    }
  },

  closetSystems: {
    categoryName: "Closet Systems",
    tagline: "Intelligent organization, elevated design",
    overview: "Transform chaos into calm with our custom closet systems. Designed around how you actually live, our solutions maximize every inch while maintaining the clean, uncluttered aesthetic you desire.",

    benefits: [
      "Custom configurations tailored to your needs",
      "Premium materials that resist wear and warping",
      "Thoughtful details that enhance daily routines",
      "Expandable systems that grow with you",
      "Professional design ensuring optimal functionality"
    ],

    idealFor: [
      "Master bedroom walk-ins",
      "Reach-in bedroom closets",
      "Entryway organization",
      "Children's closets",
      "Guest room storage"
    ],

    components: {
      shelving: {
        name: "Adjustable Shelving",
        description: "Adaptable storage that evolves with your needs. Our shelving systems feature tool-free adjustment and robust construction that handles substantial weight without sagging.",
        features: ["Multiple depth options", "Durable finishes", "Easy reconfiguration", "Integrated supports"]
      },
      hanging: {
        name: "Hanging Solutions",
        description: "From everyday essentials to special occasion garments, our hanging systems keep clothing wrinkle-free and accessible. Multiple rod heights accommodate various wardrobe types.",
        features: ["Double hanging for maximum capacity", "Premium rod materials", "Specialty hangers available", "Customizable heights"]
      },
      drawers: {
        name: "Drawer Systems",
        description: "Smooth-gliding drawers with soft-close mechanisms provide convenient storage for folded items, accessories, and personal effects. Available in various sizes to suit your inventory.",
        features: ["Soft-close mechanisms", "Full-extension guides", "Durable construction", "Optional divider systems"]
      },
      accessories: {
        name: "Specialty Accessories",
        description: "The details that make daily life easier. From pull-out hampers to integrated jewelry organizers, our accessories add thoughtful functionality exactly where you need it.",
        features: ["Pull-out storage", "Valet rods", "Belt and tie racks", "Shoe organization"]
      }
    }
  },

  bifoldDoors: {
    categoryName: "Bifold Doors",
    tagline: "Classic efficiency, modern refinement",
    overview: "When space is at a premium, bifold doors deliver. Our selection combines space-saving function with clean aesthetics, offering full access to your closet while maintaining a polished appearance.",

    benefits: [
      "Maximum opening in minimal space",
      "Smooth, reliable operation",
      "Contemporary and traditional styles",
      "Multiple size configurations",
      "Low-maintenance durability"
    ],

    idealFor: [
      "Standard bedroom closets",
      "Laundry alcoves",
      "Utility closets",
      "Pantries",
      "Compact storage areas"
    ],

    materials: {
      wood: {
        name: "Solid Wood Bifolds",
        description: "Authentic wood construction brings warmth and natural beauty. Our wood bifold doors feature premium veneers or solid construction, offering lasting quality and timeless appeal.",
        advantages: ["Natural beauty", "Paintable or stainable", "Substantial feel", "Traditional craftsmanship"]
      },
      composite: {
        name: "Composite Bifolds",
        description: "Advanced materials deliver superior performance with minimal maintenance. Composite bifolds resist moisture, warping, and wear while maintaining crisp, clean lines.",
        advantages: ["Moisture resistant", "Consistent finish", "Lightweight operation", "Long-term durability"]
      },
      glass: {
        name: "Glass Panel Bifolds",
        description: "Introduce natural light while maintaining definition. Our glass bifold options range from clear to frosted, adding architectural interest and visual space.",
        advantages: ["Light transmission", "Visual expansion", "Contemporary aesthetic", "Easy maintenance"]
      }
    }
  },

  hardware: {
    categoryName: "Hardware & Accessories",
    tagline: "The details that define excellence",
    overview: "Superior hardware is the foundation of reliable performance. We exclusively specify premium components engineered for smooth operation, lasting durability, and refined appearance.",

    collections: {
      barnDoorHardware: {
        name: "Barn Door Track Systems",
        description: "Heavy-duty track systems engineered for whisper-quiet operation and decades of reliable service. Our hardware collections complement any aesthetic from industrial to traditional.",
        features: [
          "Weight capacities from 200-400 lbs",
          "Soft-close and soft-open options",
          "Floor guides for stability",
          "Multiple finish options",
          "Easy installation design"
        ],
        finishes: ["Matte Black", "Brushed Nickel", "Oil-Rubbed Bronze", "Stainless Steel", "Brass"]
      },
      closetHardware: {
        name: "Closet System Components",
        description: "From heavy-duty hanging rods to sophisticated drawer glides, every component is selected for performance and longevity. Quality hardware means your investment performs beautifully for years.",
        features: [
          "Soft-close drawer guides",
          "Premium wardrobe rods",
          "Adjustable shelf pins",
          "Integrated lighting solutions",
          "Specialty organizational tools"
        ]
      },
      handles: {
        name: "Handles & Pulls",
        description: "The tactile details you interact with daily. Our handle collections offer refined designs that feel as good as they look, available in finishes that coordinate with your hardware selections.",
        styles: ["Modern Minimalist", "Classic Traditional", "Industrial Edge", "Contemporary Sleek", "Vintage Inspired"]
      }
    }
  }
} as const

export const productDescriptionTemplates = {
  short: (productName: string, keyFeature: string) =>
    `${productName}: ${keyFeature}. Premium quality, professional installation, comprehensive warranty.`,

  medium: (productName: string, description: string, benefits: string[]) =>
    `${productName}\n\n${description}\n\nKey Benefits:\n${benefits.map(b => `• ${b}`).join('\n')}`,

  long: (product: {
    name: string
    tagline: string
    description: string
    benefits: string[]
    specifications: string[]
    warranty: string
  }) => `
${product.name}
${product.tagline}

${product.description}

What Sets This Product Apart:
${product.benefits.map(b => `• ${b}`).join('\n')}

Specifications:
${product.specifications.map(s => `• ${s}`).join('\n')}

Coverage: ${product.warranty}

Every product backed by PG Closets' commitment to quality, professional installation, and ongoing support.
  `.trim()
}

export const seoDescriptions = {
  barnDoors: "Premium barn doors for Ottawa homes. Modern, rustic, and transitional styles. Professional installation, lifetime hardware warranty. Official Renin dealer.",
  closetSystems: "Custom closet systems designed for Ottawa homeowners. Maximize space, enhance organization. Free online quote, expert installation, 2-year warranty.",
  bifoldDoors: "Quality bifold closet doors in wood, composite, and glass. Space-saving solutions for bedrooms, laundries, pantries. Professional installation available.",
  hardware: "Premium barn door hardware and closet accessories. Heavy-duty track systems, soft-close mechanisms, multiple finishes. Built to last."
} as const

export type ProductCategories = typeof productCategories
export type ProductDescriptionTemplates = typeof productDescriptionTemplates
export type SEODescriptions = typeof seoDescriptions

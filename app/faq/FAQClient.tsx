"use client"

import StandardLayout from "@/components/layout/StandardLayout"
import Link from "next/link"
import { useState } from "react"
import { FAQSchema } from "@/components/seo/FAQSchema"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQClient() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const faqItems: FAQItem[] = [
    // Quote Process Category
    {
      id: "free-quote",
      category: "quote-process",
      question: "How do I get a free quote from PG Closets?",
      answer: "Getting your free quote is simple! Use our online contact form to describe your project, or call us directly at (613) 422-5800. We'll schedule a complimentary in-home consultation where we measure your space, discuss your needs, and provide a detailed written estimate—all at no cost to you."
    },
    {
      id: "quote-timeline",
      category: "quote-process",
      question: "How quickly will I receive my quote?",
      answer: "We typically provide quotes within 24-48 hours of your consultation. For urgent projects, same-day quotes may be available. We believe in quick turnaround times so you can make informed decisions about your closet project without delay."
    },
    {
      id: "quote-includes",
      category: "quote-process",
      question: "What's included in my free quote?",
      answer: "Your comprehensive quote includes detailed measurements, itemized pricing for materials and labor, installation timeline, product specifications, and a breakdown of all costs including HST. We also provide product catalogs and samples so you can visualize your finished project."
    },
    {
      id: "quote-validity",
      category: "quote-process",
      question: "How long is my quote valid?",
      answer: "All quotes are valid for 30 days from the date of issue. This gives you time to make your decision while protecting you from price fluctuations. If you need more time, just let us know—we're happy to extend or update your quote as needed."
    },
    {
      id: "multiple-quotes",
      category: "quote-process",
      question: "Can I get quotes for different options?",
      answer: "Absolutely! We encourage exploring different solutions to find what works best for your space and budget. We can provide multiple quote options with different door styles, finishes, and configurations so you can compare and choose the perfect solution."
    },

    // Consultation Process Category
    {
      id: "consultation-process",
      category: "consultation",
      question: "What happens during the in-home consultation?",
      answer: "During your consultation, our expert will assess your space, take precise measurements, discuss your style preferences and functional needs, show you product samples, and answer all your questions. The visit typically takes 45-60 minutes and results in a detailed project proposal."
    },
    {
      id: "consultation-preparation",
      category: "consultation",
      question: "How should I prepare for my consultation?",
      answer: "Clear access to your closet areas and have any inspiration photos or specific requirements ready to discuss. Think about your storage needs, preferred styles, and budget range. We'll handle everything else, including bringing samples and measuring tools."
    },
    {
      id: "consultation-cost",
      category: "consultation",
      question: "Is there any cost for the consultation?",
      answer: "No, our in-home consultations are completely free with no obligation. We believe in earning your business through quality service and competitive pricing, not pressure tactics. Even if you don't proceed, the consultation and quote cost you nothing."
    },

    // Timeline & Installation Category
    {
      id: "project-timeline",
      category: "timeline",
      question: "What's the typical timeline from quote to installation?",
      answer: "Once you approve your quote, most projects are completed within 2-3 weeks. This includes ordering materials, scheduling installation, and completing the work. Rush orders may be accommodated based on availability and project complexity."
    },
    {
      id: "installation-duration",
      category: "timeline",
      question: "How long does installation take?",
      answer: "Most installations are completed in 4-8 hours, depending on project size and complexity. Simple door replacements may take less time, while comprehensive closet systems can take a full day. We'll provide a specific timeframe with your quote."
    },
    {
      id: "installation-scheduling",
      category: "timeline",
      question: "Can installations be scheduled for evenings or weekends?",
      answer: "Yes! We offer flexible scheduling including evenings and weekends to accommodate your busy schedule. Weekend appointments are popular, so we recommend booking early to secure your preferred time slot."
    },

    // Payment & Pricing Category
    {
      id: "payment-terms",
      category: "payment",
      question: "What are your payment terms?",
      answer: "We require a 50% deposit upon project approval to begin ordering materials, with the balance due upon completion. We accept cash, check, and all major credit cards. Payment plans may be available for larger projects—just ask!"
    },
    {
      id: "pricing-transparency",
      category: "payment",
      question: "Are there any hidden fees in your pricing?",
      answer: "Never. Our quotes include all costs: materials, labor, installation, cleanup, and HST. The price we quote is the price you pay. If any changes are needed during the project, we'll discuss and approve them with you first."
    },
    {
      id: "price-matching",
      category: "payment",
      question: "Do you offer price matching?",
      answer: "We're confident in our competitive pricing, but we're happy to discuss pricing concerns. Bring us a comparable quote and we'll review it. Remember to compare not just price, but quality, service, warranty, and reputation when making your decision."
    },

    // Warranty & Service Category
    {
      id: "warranty-coverage",
      category: "warranty",
      question: "What warranty do you provide?",
      answer: "We provide a comprehensive 2-year workmanship warranty on all installations, plus manufacturer warranties on products (typically 1-5 years depending on the item). This covers defects in installation and manufacturing, giving you complete peace of mind."
    },
    {
      id: "warranty-service",
      category: "warranty",
      question: "How do I get warranty service?",
      answer: "Simply call us at (613) 422-5800 or email info@pgclosets.com. We'll schedule a service visit to assess and resolve any warranty issues promptly. Most warranty calls are resolved within a few days of your initial contact."
    },
    {
      id: "post-installation-support",
      category: "warranty",
      question: "Do you provide support after installation?",
      answer: "Absolutely! We're here for the life of your closet system. Whether you need adjustment, maintenance tips, or additional storage solutions, we're just a phone call away. Building long-term relationships with our clients is important to us."
    },

    // Service Areas Category
    {
      id: "service-areas",
      category: "service-areas",
      question: "Which areas do you serve?",
      answer: "We proudly serve Ottawa and all surrounding communities including Kanata, Nepean, Orleans, Barrhaven, Stittsville, Gloucester, Vanier, Rockland, Manotick, and rural areas within reasonable distance. Contact us to confirm service availability in your specific location."
    },
    {
      id: "travel-fees",
      category: "service-areas",
      question: "Do you charge travel fees for consultations or installations?",
      answer: "No travel fees within our standard service area, which covers Ottawa and immediate surrounding communities. For locations beyond our standard area, a modest travel fee may apply—we'll discuss this upfront when scheduling your consultation."
    },

    // Why Choose PG Closets Category
    {
      id: "why-choose",
      category: "why-choose",
      question: "Why should I choose PG Closets over other companies?",
      answer: "We combine professional expertise, quality products, competitive pricing, and exceptional customer service. As licensed and insured specialists, we focus exclusively on closet solutions, ensuring deep expertise. Our 2-year warranty and ongoing support demonstrate our commitment to your satisfaction."
    },
    {
      id: "experience-credentials",
      category: "why-choose",
      question: "What are your credentials and experience?",
      answer: "We're fully licensed and insured professionals with years of experience in custom closet design and installation. Our team includes certified installers who understand both the technical and aesthetic aspects of creating beautiful, functional storage solutions."
    },
    {
      id: "customer-satisfaction",
      category: "why-choose",
      question: "How do you ensure customer satisfaction?",
      answer: "Customer satisfaction is our top priority. We achieve this through clear communication, quality workmanship, competitive pricing, comprehensive warranties, and ongoing support. We're not satisfied unless you're thrilled with your new closet system."
    }
  ]

  const categories = [
    { id: "all", name: "All Questions", count: faqItems.length },
    { id: "quote-process", name: "Quote Process", count: faqItems.filter(item => item.category === "quote-process").length },
    { id: "consultation", name: "Consultation", count: faqItems.filter(item => item.category === "consultation").length },
    { id: "timeline", name: "Timeline & Installation", count: faqItems.filter(item => item.category === "timeline").length },
    { id: "payment", name: "Payment & Pricing", count: faqItems.filter(item => item.category === "payment").length },
    { id: "warranty", name: "Warranty & Service", count: faqItems.filter(item => item.category === "warranty").length },
    { id: "service-areas", name: "Service Areas", count: faqItems.filter(item => item.category === "service-areas").length },
    { id: "why-choose", name: "Why Choose PG Closets", count: faqItems.filter(item => item.category === "why-choose").length }
  ]

  const filteredItems = activeCategory === "all"
    ? faqItems
    : faqItems.filter(item => item.category === activeCategory)

  return (
    <>
      <FAQSchema faqs={faqItems.map(item => ({ question: item.question, answer: item.answer }))} />
      <StandardLayout>
      {/* Breadcrumb Navigation */}
      <div className="pt-20 pb-4 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>{" "}
            / <span className="text-slate-900 font-medium">FAQ</span>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about our free quote process, professional installation,
            warranty coverage, and service areas throughout Ottawa.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Get Your Free Quote
            </Link>
            <a
              href="tel:6134225800"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Call (613) 422-5800
            </a>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-inset"
                aria-expanded={openItems.has(item.id)}
                aria-controls={`answer-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-900 pr-4">
                    {item.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                      openItems.has(item.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openItems.has(item.id) && (
                <div
                  id={`answer-${item.id}`}
                  className="px-6 pb-4 border-t border-gray-100"
                >
                  <p className="text-slate-600 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-light text-slate-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our friendly team is here to help! Contact us for personalized answers about your closet project,
            schedule your free consultation, or get your custom quote today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <a
              href="mailto:info@pgclosets.com"
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white transition-colors"
            >
              Email Your Questions
            </a>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            <p>Licensed & Insured • Serving Ottawa & Surrounding Areas</p>
            <p>2-Year Workmanship Warranty • Free Quotes & Consultations</p>
          </div>
        </div>
      </main>
    </StandardLayout>
    </>
  )
}
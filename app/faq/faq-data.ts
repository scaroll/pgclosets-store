export interface FAQ {
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  label: string
  faqs: FAQ[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: "products",
    label: "Products",
    faqs: [
      {
        question: "What types of closet doors do you offer?",
        answer:
          "We offer a comprehensive range of closet door solutions including bypass doors, bifold doors, pivot doors, and premium barn doors. All our doors are from Renin, a trusted brand known for quality and durability. We also provide custom closet systems that can be tailored to your specific needs and style preferences.",
      },
      {
        question: "What materials are available?",
        answer:
          "Our closet doors are available in a variety of high-quality materials including solid wood, engineered wood, mirror, glass (frosted and clear), and composite materials. Each material option offers unique benefits in terms of aesthetics, durability, and maintenance. We can help you choose the best material based on your budget, style preferences, and functional requirements.",
      },
      {
        question: "Can I customize dimensions?",
        answer:
          "Absolutely! We specialize in custom-sized closet doors to fit your exact opening dimensions. Our team will visit your location for a complimentary measure service to ensure precise measurements. We can accommodate non-standard sizes and unique architectural features to provide a perfect fit for your space.",
      },
    ],
  },
  {
    id: "installation",
    label: "Installation",
    faqs: [
      {
        question: "Do you offer installation services?",
        answer:
          "Yes, we provide professional installation services throughout Ottawa and surrounding areas. Our installers are licensed, insured, and highly experienced in closet door installation. Installation includes complete floor protection, clean worksite maintenance, and disposal of your old doors. We ensure a seamless, hassle-free experience from start to finish.",
      },
      {
        question: "How long does installation take?",
        answer:
          "Most closet door installations are completed within 2-4 hours, depending on the complexity and number of doors being installed. For larger projects or custom configurations, installation may take up to a full day. We'll provide you with a detailed timeline during your consultation and work efficiently to minimize disruption to your daily routine.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "We proudly serve Ottawa and all surrounding areas including Kanata, Nepean, Orleans, Barrhaven, Stittsville, Gloucester, Vanier, and other communities within the Ottawa region. If you're unsure whether we service your area, please contact us and we'll be happy to confirm coverage and schedule your consultation.",
      },
    ],
  },
  {
    id: "warranty",
    label: "Warranty",
    faqs: [
      {
        question: "What warranty do you offer?",
        answer:
          "We offer a comprehensive 2-year workmanship warranty on all our installations, ensuring that the installation work meets the highest quality standards. Additionally, all Renin products come with manufacturer warranties that vary by product line. We stand behind our work and the products we install, giving you peace of mind with your investment.",
      },
      {
        question: "What does the warranty cover?",
        answer:
          "Our workmanship warranty covers installation-related issues including alignment problems, hardware failures due to improper installation, and any defects in our installation work. The manufacturer warranty covers product defects, material failures, and manufacturing issues. Normal wear and tear, damage from misuse, or modifications made after installation are not covered. We'll provide you with detailed warranty documentation upon completion of your installation.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    faqs: [
      {
        question: "Do you offer free shipping?",
        answer:
          "Delivery is included in our installation service packages for customers within the Ottawa region. For delivery-only orders without installation, delivery fees may apply based on your location and order size. We'll provide you with a complete quote including any delivery charges before you commit to your order.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Most orders are delivered and installed within 2 weeks after order confirmation. Custom orders or specialty products may require 3-4 weeks depending on manufacturing lead times. We'll provide you with an accurate timeline when you place your order and keep you informed throughout the process. Rush service may be available for urgent projects - please inquire about expedited options.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We want you to be completely satisfied with your purchase. For standard, uninstalled products, returns are accepted within 30 days of delivery in original, unopened packaging. Custom-sized or special-order items are not eligible for return unless defective. Installed products may be eligible for replacement under warranty if there are defects or issues. Return shipping costs are the responsibility of the customer unless the product is defective or we made an error in your order.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To initiate a return, please contact our customer service team at (613) XXX-XXXX or email us at support@pgclosets.com with your order number and reason for return. We'll provide you with a return authorization number and detailed instructions. Products must be returned in original packaging with all hardware and components included. Once we receive and inspect the returned items, we'll process your refund within 5-7 business days.",
      },
    ],
  },
]

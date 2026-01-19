
// Static content for Location and Legal pages

export type StaticPage = {
  slug: string
  title: string
  content: string
  type: 'location' | 'legal' | 'general'
}

export const staticPages: StaticPage[] = [
  // Locations
  {
    slug: 'ottawa',
    title: 'Custom Closets in Ottawa',
    type: 'location',
    content: `
      <h2>Premier Custom Closet Solutions in Ottawa</h2>
      <p>PG Closets is your trusted partner for custom closet design and installation in Ottawa. We serve the entire Ottawa region with professional, personalized service.</p>
      <p>Visit our showroom or book a free consultation to start your journey to a more organized home.</p>
    `
  },
  {
    slug: 'kanata',
    title: 'Custom Closets in Kanata',
    type: 'location',
    content: `
      <h2>Serving Kanata with Excellence</h2>
      <p>Residents of Kanata trust PG Closets for high-quality closet doors and organization systems. We bring our showroom to you with in-home consultations.</p>
    `
  },
  {
    slug: 'barrhaven',
    title: 'Custom Closets in Barrhaven',
    type: 'location',
    content: `
      <h2>Barrhaven's Choice for Custom Closets</h2>
      <p>Transform your space with PG Closets. We offer a wide range of Renin doors and custom storage solutions tailored to Barrhaven homes.</p>
    `
  },
  {
    slug: 'orleans',
    title: 'Custom Closets in Orleans',
    type: 'location',
    content: `
      <h2>Orleans Closet Design Experts</h2>
      <p>From walk-ins to reach-ins, we help Orleans homeowners maximize their storage with style and functionality.</p>
    `
  },
  {
    slug: 'nepean',
    title: 'Custom Closets in Nepean',
    type: 'location',
    content: `
      <h2>Nepean's Leading Closet Provider</h2>
      <p>Discover the difference with PG Closets in Nepean. Expert design, quality materials, and professional installation.</p>
    `
  },


  // Renin Locations
  {
    slug: 'renin/ottawa',
    title: 'Renin Doors in Ottawa',
    type: 'location',
    content: `<h2>Renin Door Specialist in Ottawa</h2><p>Official dealer of Renin closet doors, barn doors, and room dividers in Ottawa.</p>`
  },
  {
    slug: 'renin/kanata',
    title: 'Renin Doors in Kanata',
    type: 'location',
    content: `<h2>Renin Door Specialist in Kanata</h2><p>Find the perfect Renin doors for your Kanata home at PG Closets.</p>`
  },
  {
    slug: 'renin/barrhaven',
    title: 'Renin Doors in Barrhaven',
    type: 'location',
    content: `<h2>Renin Door Specialist in Barrhaven</h2><p>Upgrade your space with Renin sliding doors in Barrhaven.</p>`
  },
  {
    slug: 'renin/orleans',
    title: 'Renin Doors in Orleans',
    type: 'location',
    content: `<h2>Renin Door Specialist in Orleans</h2><p>Quality Renin installation services in Orleans.</p>`
  },
  {
    slug: 'renin/nepean',
    title: 'Renin Doors in Nepean',
    type: 'location',
    content: `<h2>Renin Door Specialist in Nepean</h2><p>Nepean's top choice for Renin closet solutions.</p>`
  },
  {
    slug: 'renin',
    title: 'Renin Closet Doors',
    type: 'general',
    content: `<h2>Official Renin Dealer</h2><p>Explore our wide selection of Renin closet doors.</p>`
  },
  {
    slug: 'installation-ottawa',
    title: 'Closet Installation Services Ottawa',
    type: 'location',
    content: `<h2>Professional Installation in Ottawa</h2><p>Our expert team provides seamless closet door installation across Ottawa.</p>`
  },
  {
    slug: 'renin-quotes',
    title: 'Get a Quote for Renin Doors',
    type: 'general',
    content: `<h2>Request a Quote</h2><p>Contact us today for pricing on Renin doors and installation.</p>`
  },

  // Legal
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    type: 'legal',
    content: `
      <p>At PG Closets, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
      <h3>Information Collection</h3>
      <p>We collect information you provide directly to us, such as when you request a quote, book a consultation, or contact us.</p>
      <h3>Use of Information</h3>
      <p>We use your information to provide our services, communicate with you, and improve our offerings.</p>
      <h3>Contact Us</h3>
      <p>If you have questions about our privacy practices, please contact us at info@pgclosets.com.</p>
    `
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    type: 'legal',
    content: `
      <p>Welcome to PG Closets. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>
      <h3>Use of Site</h3>
      <p>You may use our site for lawful purposes only. Unauthorized use of this site may give rise to a claim for damages.</p>
      <h3>Product Information</h3>
      <p>We strive to ensure accurate product descriptions and pricing, but errors may occur. We reserve the right to correct any errors.</p>
    `
  },
  {
    slug: 'return-policy',
    title: 'Return Policy',
    type: 'legal',
    content: `
      <p>We stand behind the quality of our products. Please review our return policy carefully.</p>
      <h3>Custom Orders</h3>
      <p>Custom-designed closets and doors are made to order and are generally non-refundable unless there is a manufacturing defect.</p>
      <h3>Standard Items</h3>
      <p>Standard hardware and accessories may be returned within 30 days of purchase in their original packaging.</p>
    `
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    type: 'legal',
    content: `
      <p>We offer delivery and installation services across the Ottawa region.</p>
      <h3>Delivery Area</h3>
      <p>We deliver to Ottawa, Kanata, Barrhaven, Orleans, Nepean, and surrounding areas.</p>
      <h3>Timelines</h3>
      <p>Standard delivery times vary by product. Custom orders typically take 2-4 weeks.</p>
    `
  },

  // General
  {
    slug: 'store',
    title: 'Our Store',
    type: 'general',
    content: `
      <h2>Visit Our Showroom</h2>
      <p>Experience the quality of our products firsthand. Our showroom features displays of our latest closet designs and door styles.</p>
    `
  },
  {
    slug: 'services',
    title: 'Our Services',
    type: 'general',
    content: `
      <h2>Comprehensive Closet Services</h2>
      <ul>
        <li>Custom Design Consultations</li>
        <li>Professional Installation</li>
        <li>Renin Door Sales</li>
        <li>Storage Optimization</li>
      </ul>
    `
  }
]

export function getStaticPage(slug: string): StaticPage | undefined {
  return staticPages.find(page => page.slug === slug)
}

export function getAllStaticSlugs(): string[] {
  return staticPages.map(page => page.slug)
}

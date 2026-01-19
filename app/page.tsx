import {
  Hero,
  Philosophy,
  ProductReveal,
  Process,
  Testimonial,
  ContactCTA,
} from '@/components/sections'
import { products } from '@/lib/products'

export default function HomePage() {
  const featuredProduct = products[2] // Gatsby - the premium option

  return (
    <>
      {/* Hero - Full viewport, single message */}
      <Hero
        title="Crafted to Close"
        subtitle="Custom closet doors handcrafted in Ottawa since 2009"
      />

      {/* Philosophy - Breathing room, centered text */}
      <Philosophy text="We don't make closet doors. We make the moment before you dress." />

      {/* Product Reveal - Scroll-triggered animation */}
      <ProductReveal product={featuredProduct} />

      {/* Process - Horizontal scroll section */}
      <Process />

      {/* Testimonial - Single quote, large */}
      <Testimonial
        quote="They understood exactly what we wanted before we could articulate it."
        author="Sarah & Michael Chen"
        location="Rockcliffe Park"
      />

      {/* Contact CTA - Email input only */}
      <ContactCTA />
    </>
  )
}

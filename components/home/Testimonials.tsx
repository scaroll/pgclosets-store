"use client";

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { colors, typography } from '@/lib/design-tokens';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Kanata',
    rating: 5,
    text: 'Absolutely thrilled with our new barn doors! The installation team was professional, and the quality is outstanding. Worth every penny.',
    image: '/images/testimonials/sarah.jpg',
  },
  {
    name: 'Michael Chen',
    location: 'Ottawa',
    rating: 5,
    text: 'From consultation to installation, everything was seamless. The team helped us design the perfect closet solution for our master bedroom.',
    image: '/images/testimonials/michael.jpg',
  },
  {
    name: 'Emily Rodriguez',
    location: 'Barrhaven',
    rating: 5,
    text: 'The craftsmanship is exceptional! Our pivot doors are a stunning focal point. Highly recommend PG Closets to anyone looking for quality.',
    image: '/images/testimonials/emily.jpg',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="mb-4"
            style={{
              fontSize: typography.sizes['4xl'][0],
              fontFamily: typography.fonts.display,
              fontWeight: typography.weights.bold,
              color: colors.gray[900],
            }}
          >
            What Our Clients Say
          </h2>
          <p style={{ fontSize: typography.sizes.lg[0], color: colors.gray[600] }}>
            Real experiences from real homeowners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-gray-50 rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-200" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p
                className="mb-6"
                style={{
                  fontSize: typography.sizes.base[0],
                  lineHeight: typography.lineHeights.relaxed,
                  color: colors.gray[700],
                }}
              >
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <div
                    style={{
                      fontSize: typography.sizes.sm[0],
                      fontWeight: typography.weights.semibold,
                      color: colors.gray[900],
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontSize: typography.sizes.xs[0],
                      color: colors.gray[500],
                    }}
                  >
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

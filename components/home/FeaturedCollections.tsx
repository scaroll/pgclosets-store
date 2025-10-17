"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { colors, typography, spacing, radius, shadows } from '@/lib/design-tokens';

const collections = [
  {
    id: 'barn-doors',
    title: 'Barn Doors',
    description: 'Rustic elegance meets modern design',
    image: '/images/collections/barn-doors.jpg',
    href: '/collections/renin-barn-doors',
  },
  {
    id: 'bifold-doors',
    title: 'Bifold Doors',
    description: 'Space-saving sophistication',
    image: '/images/collections/bifold-doors.jpg',
    href: '/collections/renin-bifold-doors',
  },
  {
    id: 'bypass-doors',
    title: 'Bypass Doors',
    description: 'Sleek sliding solutions',
    image: '/images/collections/bypass-doors.jpg',
    href: '/collections/renin-bypass-doors',
  },
  {
    id: 'pivot-doors',
    title: 'Pivot Doors',
    description: 'Contemporary architectural statements',
    image: '/images/collections/pivot-doors.jpg',
    href: '/collections/renin-pivot-doors',
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            Featured Collections
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: typography.sizes.lg[0],
              lineHeight: typography.lineHeights.relaxed,
              color: colors.gray[600],
            }}
          >
            Explore our curated selection of premium Renin closet door systems
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={collection.href}
                className="group block relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                style={{
                  borderRadius: radius.xl,
                  boxShadow: shadows.md,
                }}
              >
                {/* Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-900/40 group-hover:from-gray-900/70 group-hover:to-gray-900/30 transition-all duration-300">
                  {/* Placeholder for actual product image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3
                    className="mb-2 text-white"
                    style={{
                      fontSize: typography.sizes['2xl'][0],
                      fontFamily: typography.fonts.display,
                      fontWeight: typography.weights.semibold,
                    }}
                  >
                    {collection.title}
                  </h3>
                  <p
                    className="mb-4 text-gray-200"
                    style={{
                      fontSize: typography.sizes.sm[0],
                      lineHeight: typography.lineHeights.relaxed,
                    }}
                  >
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-900 border-2 border-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

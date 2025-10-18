"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Ruler, Hammer, Shield, Calendar } from 'lucide-react';
import { colors, typography, spacing } from '@/lib/design-tokens';

const services = [
  {
    icon: Calendar,
    title: 'Free Consultation',
    description: 'Expert design advice tailored to your space and style preferences',
    href: '/services/consultation',
  },
  {
    icon: Ruler,
    title: 'Professional Measurement',
    description: 'Precise measurements ensuring perfect fit and function',
    href: '/services/measurement',
  },
  {
    icon: Hammer,
    title: 'Expert Installation',
    description: 'Certified installers with years of experience and attention to detail',
    href: '/services/installation',
  },
  {
    icon: Shield,
    title: 'Lifetime Warranty',
    description: 'Comprehensive coverage on all products and installation',
    href: '/services/warranty',
  },
];

export function ServicesHighlight() {
  return (
    <section className="py-24 bg-gray-50">
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
            White-Glove Service
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: typography.sizes.lg[0],
              color: colors.gray[600],
            }}
          >
            From initial consultation to final installation, we're with you every step
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className="group block p-6 bg-white rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="mb-2"
                  style={{
                    fontSize: typography.sizes.xl[0],
                    fontWeight: typography.weights.semibold,
                    color: colors.gray[900],
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: typography.sizes.sm[0],
                    color: colors.gray[600],
                    lineHeight: typography.lineHeights.relaxed,
                  }}
                >
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

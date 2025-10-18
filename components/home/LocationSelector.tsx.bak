"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { colors, typography } from '@/lib/design-tokens';

const locations = [
  { name: 'Ottawa', href: '/ottawa', population: '1M+' },
  { name: 'Kanata', href: '/kanata', population: '90K+' },
  { name: 'Barrhaven', href: '/barrhaven', population: '80K+' },
  { name: 'Nepean', href: '/nepean', population: '180K+' },
  { name: 'Orleans', href: '/orleans', population: '110K+' },
];

export function LocationSelector() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
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
            Serving Ottawa & Surrounding Areas
          </h2>
          <p style={{ fontSize: typography.sizes.lg[0], color: colors.gray[600] }}>
            Select your neighborhood for localized service
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={location.href}
                className="group block p-6 bg-gray-50 rounded-2xl hover:bg-gray-900 hover:shadow-xl transition-all duration-300 text-center"
              >
                <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-700 group-hover:text-white transition-colors" />
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-white transition-colors mb-1">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                  {location.population} residents
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

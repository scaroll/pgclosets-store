"use client";

import { motion } from 'framer-motion';
import { Award, Users, Clock, Star } from 'lucide-react';
import { colors, typography } from '@/lib/design-tokens';

const indicators = [
  { icon: Award, value: 'Official Renin Dealer', label: 'Authorized & Certified' },
  { icon: Users, value: '1,000+', label: 'Happy Homeowners' },
  { icon: Clock, value: '25+ Years', label: 'Industry Experience' },
  { icon: Star, value: '5.0 Rating', label: 'Google Reviews' },
];

export function TrustIndicators() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <indicator.icon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <div className="text-2xl font-bold mb-1">{indicator.value}</div>
              <div className="text-sm text-gray-400">{indicator.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

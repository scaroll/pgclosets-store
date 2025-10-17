"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { colors, typography, spacing } from '@/lib/design-tokens';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-900/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-gray-800/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 backdrop-blur-sm rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4" style={{ color: colors.brand.navy }} />
          <span className="text-sm font-medium" style={{ color: colors.gray[700] }}>
            Official Renin Dealer • Lifetime Warranty
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-6"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontFamily: typography.fonts.display,
            fontWeight: typography.weights.bold,
            lineHeight: typography.lineHeights.tight,
            color: colors.gray[900],
          }}
        >
          Elevated Taste
          <br />
          <span style={{ color: colors.brand.navy }}>Without Pretense</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
          style={{
            fontSize: typography.sizes.xl[0],
            lineHeight: typography.lineHeights.relaxed,
            color: colors.gray[600],
          }}
        >
          Transform your Ottawa home with sophisticated closet door solutions.
          Curated collections, professional installation, and lifetime support.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:scale-105"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/book-measure"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:scale-105"
          >
            <span>Book Free Consultation</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "1000+", label: "Homes Transformed" },
            { value: "25+", label: "Years Experience" },
            { value: "100%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="mb-2"
                style={{
                  fontSize: typography.sizes['4xl'][0],
                  fontFamily: typography.fonts.display,
                  fontWeight: typography.weights.bold,
                  color: colors.gray[900],
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: typography.sizes.sm[0],
                  color: colors.gray[600],
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-gray-600 rounded-full"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

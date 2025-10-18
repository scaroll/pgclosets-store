"use client";

import { Shield, Award, Star, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Trust Bar Component - Above the Fold Trust Elements
 * Displays key trust signals immediately after hero section
 */
export function TrustBar() {
  const trustElements = [
    {
      icon: Star,
      label: "4.9/5 Rating",
      sublabel: "500+ Reviews",
      color: "text-yellow-500"
    },
    {
      icon: Shield,
      label: "Lifetime Warranty",
      sublabel: "On All Products",
      color: "text-blue-600"
    },
    {
      icon: Award,
      label: "Official Renin Dealer",
      sublabel: "Authorized & Certified",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      label: "8+ Years",
      sublabel: "Serving Ottawa",
      color: "text-green-600"
    },
    {
      icon: CheckCircle,
      label: "1,700+ Homes",
      sublabel: "Successfully Installed",
      color: "text-indigo-600"
    }
  ];

  return (
    <section className="bg-white border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {trustElements.map((element, index) => {
            const IconComponent = element.icon;
            return (
              <motion.div
                key={element.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <div className={`${element.color} flex-shrink-0`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                    {element.label}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {element.sublabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

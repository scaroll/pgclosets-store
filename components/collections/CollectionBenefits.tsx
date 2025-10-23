"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Wrench, Award, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

interface CollectionBenefitsProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function CollectionBenefits({
  benefits,
  title = "Why Choose This Collection?",
  subtitle = "Premium features designed for your modern lifestyle",
  className
}: CollectionBenefitsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const iconMap = {
    'check': <CheckCircle className="w-6 h-6" />,
    'shield': <Shield className="w-6 h-6" />,
    'wrench': <Wrench className="w-6 h-6" />,
    'award': <Award className="w-6 h-6" />,
    'clock': <Clock className="w-6 h-6" />,
    'sparkles': <Sparkles className="w-6 h-6" />,
  };

  return (
    <section className={cn("py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={cn(
                "relative p-8 transition-all duration-300 cursor-pointer group",
                "hover:shadow-2xl hover:-translate-y-2",
                benefit.highlighted
                  ? "border-teal-500 bg-gradient-to-br from-teal-50 to-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-teal-300"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
                benefit.highlighted
                  ? "bg-teal-600 text-white scale-110"
                  : "bg-gray-100 text-gray-700 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110"
              )}>
                {benefit.icon}
              </div>

              {/* Badge for highlighted */}
              {benefit.highlighted && (
                <Badge className="absolute top-4 right-4 bg-teal-600 text-white">
                  Most Popular
                </Badge>
              )}

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {benefit.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {benefit.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2">
                {benefit.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle className={cn(
                      "w-5 h-5 mt-0.5 flex-shrink-0 transition-colors",
                      benefit.highlighted || hoveredIndex === index
                        ? "text-teal-600"
                        : "text-gray-400"
                    )} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Hover effect overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-teal-600/5 to-transparent rounded-lg transition-opacity duration-300",
                hoveredIndex === index ? "opacity-100" : "opacity-0"
              )} />
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>All products come with our lifetime warranty and satisfaction guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
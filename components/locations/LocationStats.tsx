'use client';

import { useEffect, useRef, useState } from 'react';
import { colors, spacing, typography } from '@/lib/design-tokens';

interface LocationStatsProps {
  homesServed: number;
  yearsServing: number;
  rating: number;
  responseTime: string;
}

export function LocationStats({
  homesServed,
  yearsServing,
  rating,
  responseTime
}: LocationStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    homes: 0,
    years: 0,
    rating: 0
  });
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counter
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        homes: Math.floor(homesServed * progress),
        years: Math.floor(yearsServing * progress),
        rating: parseFloat((rating * progress).toFixed(1))
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts({ homes: homesServed, years: yearsServing, rating });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible, homesServed, yearsServing, rating]);

  return (
    <div
      ref={ref}
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-light tracking-tight mb-4"
            style={{
              fontFamily: typography.fonts.display,
              color: colors.brand.charcoal
            }}
          >
            Trusted by Your Neighbors
          </h2>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: typography.fonts.body }}
          >
            Building lasting relationships in the community
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Homes Served */}
          <div
            className="text-center transform transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div
              className="text-5xl md:text-6xl font-light mb-2"
              style={{
                fontFamily: typography.fonts.display,
                color: colors.brand.navy
              }}
            >
              {counts.homes.toLocaleString()}
              <span className="text-4xl">+</span>
            </div>
            <div
              className="text-sm md:text-base uppercase tracking-widest text-gray-500"
              style={{
                fontFamily: typography.fonts.body,
                letterSpacing: '0.1em'
              }}
            >
              Homes Served
            </div>
          </div>

          {/* Years Serving */}
          <div
            className="text-center transform transition-all duration-500 delay-100"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div
              className="text-5xl md:text-6xl font-light mb-2"
              style={{
                fontFamily: typography.fonts.display,
                color: colors.brand.navy
              }}
            >
              {counts.years}
              <span className="text-4xl">+</span>
            </div>
            <div
              className="text-sm md:text-base uppercase tracking-widest text-gray-500"
              style={{
                fontFamily: typography.fonts.body,
                letterSpacing: '0.1em'
              }}
            >
              Years Local
            </div>
          </div>

          {/* Rating */}
          <div
            className="text-center transform transition-all duration-500 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div
              className="text-5xl md:text-6xl font-light mb-2"
              style={{
                fontFamily: typography.fonts.display,
                color: colors.brand.navy
              }}
            >
              {counts.rating.toFixed(1)}
              <span className="text-3xl text-yellow-500 ml-1">★</span>
            </div>
            <div
              className="text-sm md:text-base uppercase tracking-widest text-gray-500"
              style={{
                fontFamily: typography.fonts.body,
                letterSpacing: '0.1em'
              }}
            >
              Average Rating
            </div>
          </div>

          {/* Response Time */}
          <div
            className="text-center transform transition-all duration-500 delay-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div
              className="text-3xl md:text-4xl font-light mb-2"
              style={{
                fontFamily: typography.fonts.display,
                color: colors.brand.navy
              }}
            >
              {responseTime}
            </div>
            <div
              className="text-sm md:text-base uppercase tracking-widest text-gray-500"
              style={{
                fontFamily: typography.fonts.body,
                letterSpacing: '0.1em'
              }}
            >
              Response Time
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div
          className="mt-12 flex flex-wrap justify-center gap-6 items-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms 400ms'
          }}
        >
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Official Renin Dealer</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Lifetime Warranty</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            <span className="text-sm font-medium">Licensed & Insured</span>
          </div>
        </div>
      </div>
    </div>
  );
}

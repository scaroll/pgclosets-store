'use client';

import { useState } from 'react';
import { colors, typography, radius, shadows } from '@/lib/design-tokens';

interface ServiceMapProps {
  currentLocation: string;
  serviceAreas: string[];
  coordinates: { lat: number; lng: number };
}

export function ServiceMap({
  currentLocation,
  serviceAreas,
  coordinates
}: ServiceMapProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-light tracking-tight mb-4"
            style={{
              fontFamily: typography.fonts.display,
              color: colors.brand.charcoal
            }}
          >
            We Serve Your Area
          </h2>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: typography.fonts.body }}
          >
            Professional closet door installation throughout {currentLocation} and surrounding neighborhoods
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Visualization */}
          <div
            className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden"
            style={{
              borderRadius: radius['2xl'],
              boxShadow: shadows.lg
            }}
          >
            {/* Placeholder for actual map - can integrate Google Maps API later */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: colors.brand.navy + '20',
                    border: `3px solid ${colors.brand.navy}`
                  }}
                >
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke={colors.brand.navy}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div
                  className="text-2xl font-light mb-2"
                  style={{
                    fontFamily: typography.fonts.display,
                    color: colors.brand.navy
                  }}
                >
                  {currentLocation}
                </div>
                <div className="text-gray-600 text-sm">
                  {coordinates.lat.toFixed(4)}°N, {Math.abs(coordinates.lng).toFixed(4)}°W
                </div>

                {/* Service radius indicator */}
                <div
                  className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: colors.brand.navy + '10',
                    color: colors.brand.navy
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">25km service radius</span>
                </div>
              </div>
            </div>

            {/* Animated pulse effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-48 h-48 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: colors.brand.navy }}
              />
            </div>
          </div>

          {/* Service Areas List */}
          <div>
            <h3
              className="text-xl font-medium mb-6"
              style={{
                fontFamily: typography.fonts.body,
                color: colors.brand.charcoal
              }}
            >
              Neighborhoods We Serve
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area === selectedArea ? null : area)}
                  className="group text-left px-4 py-3 rounded-lg border transition-all duration-200"
                  style={{
                    borderRadius: radius.lg,
                    borderColor: selectedArea === area ? colors.brand.navy : colors.gray[300],
                    backgroundColor: selectedArea === area ? colors.brand.navy + '10' : 'white',
                    boxShadow: selectedArea === area ? shadows.sm : 'none'
                  }}
                  onMouseEnter={() => setSelectedArea(area)}
                  onMouseLeave={() => setSelectedArea(null)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium transition-colors"
                      style={{
                        color: selectedArea === area ? colors.brand.navy : colors.gray[700],
                        fontFamily: typography.fonts.body
                      }}
                    >
                      {area}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        color: selectedArea === area ? colors.brand.navy : colors.gray[400],
                        transform: selectedArea === area ? 'translateX(4px)' : 'translateX(0)'
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Call to action */}
            <div
              className="mt-8 p-6 rounded-xl"
              style={{
                backgroundColor: colors.gray[50],
                borderRadius: radius.xl
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.brand.navy + '20' }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={colors.brand.navy}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4
                    className="text-base font-semibold mb-2"
                    style={{
                      color: colors.brand.charcoal,
                      fontFamily: typography.fonts.body
                    }}
                  >
                    Don't see your neighborhood?
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    We serve the entire Ottawa region. Contact us to confirm service availability in your area.
                  </p>
                  <a
                    href="/request-work"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: colors.brand.navy }}
                  >
                    Get a free quote
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

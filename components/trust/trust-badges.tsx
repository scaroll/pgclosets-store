'use client';

import { Shield, Truck, Star, Home, Award, Clock, CheckCircle } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="trust-badges grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
      <div className="badge flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-sky-500 transition-colors">
        <Shield className="w-8 h-8 text-sky-500 flex-shrink-0" />
        <div>
          <span className="text-xs text-gray-500 block">Protected by</span>
          <span className="text-sm font-semibold text-navy-600">Lifetime Warranty</span>
        </div>
      </div>
      
      <div className="badge flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-sky-500 transition-colors">
        <Truck className="w-8 h-8 text-sky-500 flex-shrink-0" />
        <div>
          <span className="text-xs text-gray-500 block">Quick</span>
          <span className="text-sm font-semibold text-navy-600">2-Week Delivery</span>
        </div>
      </div>
      
      <div className="badge flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-sky-500 transition-colors">
        <Star className="w-8 h-8 text-sky-500 flex-shrink-0" />
        <div>
          <span className="text-xs text-gray-500 block">Rated</span>
          <span className="text-sm font-semibold text-navy-600">4.8/5 Stars</span>
        </div>
      </div>
      
      <div className="badge flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-sky-500 transition-colors">
        <Home className="w-8 h-8 text-sky-500 flex-shrink-0" />
        <div>
          <span className="text-xs text-gray-500 block">Trusted by</span>
          <span className="text-sm font-semibold text-navy-600">500+ Homes</span>
        </div>
      </div>
    </div>
  );
}

export function HeroTrustSignals() {
  return (
    <div className="hero-trust-signals flex flex-wrap gap-8 mt-8 pt-6 border-t border-sky-200/30">
      <div className="trust-item flex items-center gap-3">
        <Shield className="w-6 h-6 text-sky-300" />
        <span className="text-sky-100 text-sm font-medium">Lifetime Warranty</span>
      </div>
      <div className="trust-item flex items-center gap-3">
        <Truck className="w-6 h-6 text-sky-300" />
        <span className="text-sky-100 text-sm font-medium">Free Installation</span>
      </div>
      <div className="trust-item flex items-center gap-3">
        <Star className="w-6 h-6 text-sky-300" />
        <span className="text-sky-100 text-sm font-medium">4.8/5 Rating</span>
      </div>
      <div className="trust-item flex items-center gap-3">
        <Home className="w-6 h-6 text-sky-300" />
        <span className="text-sky-100 text-sm font-medium">500+ Customers</span>
      </div>
    </div>
  );
}

export function ProductTrustIndicators({ productId }: { productId: string }) {
  return (
    <div className="product-trust-indicators space-y-4 p-6 bg-sky-50 rounded-lg border border-sky-100">
      <h3 className="text-lg font-medium text-navy-700 mb-4">Why Choose This Product?</h3>
      
      <div className="trust-list space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-navy-600 block">Premium Materials</span>
            <span className="text-xs text-gray-600">Certified sustainable wood with lifetime warranty</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-navy-600 block">Expert Installation</span>
            <span className="text-xs text-gray-600">Licensed contractors with 10+ years experience</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-navy-600 block">Perfect Fit Guarantee</span>
            <span className="text-xs text-gray-600">Free remeasurement if doors don't fit perfectly</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-navy-600 block">Same-Day Response</span>
            <span className="text-xs text-gray-600">Quote requests answered within 4 hours</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-sky-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average rating:</span>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-navy-600 font-medium">4.8/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
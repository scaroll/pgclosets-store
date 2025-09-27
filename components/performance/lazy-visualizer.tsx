"use client";

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { useLazyLoading } from '@/hooks/use-lazy-loading';

// Lazy load the visualizer component
const ReninDoorVisualizer = dynamic(
  () => import('@/components/visualizer/renin-door-visualizer'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }
);

interface LazyVisualizerProps {
  initialConfig?: any;
  onConfigChange?: (config: any) => void;
  onSave?: (design: any) => void;
  className?: string;
}

const LazyVisualizer = memo(function LazyVisualizer({
  initialConfig,
  onConfigChange,
  onSave,
  className
}: LazyVisualizerProps) {
  const { ref, shouldLoad } = useLazyLoading({
    threshold: 0.1,
    rootMargin: '300px'
  });

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <ReninDoorVisualizer
          initialConfig={initialConfig}
          onConfigChange={onConfigChange}
          onSave={onSave}
          className="shadow-2xl"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default LazyVisualizer;
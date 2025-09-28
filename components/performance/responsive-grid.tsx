'use client'

"use client";

import React, { useMemo } from 'react';
import { useViewport } from '@/hooks/use-viewport';
import { performanceHelpers } from '@/lib/performance-config';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  itemCount: number;
  className?: string;
  minItemWidth?: number;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: string;
}

export default function ResponsiveGrid({
  children,
  itemCount,
  className,
  minItemWidth = 200,
  gap = 'md',
  aspectRatio
}: ResponsiveGridProps) {
  const viewport = useViewport();

  const gridConfig = useMemo(() => {
    const optimalCols = performanceHelpers.getOptimalGridColumns(itemCount);
    const isLowEnd = performanceHelpers.isLowEndDevice();

    // Adjust for low-end devices
    if (isLowEnd) {
      optimalCols.mobile = Math.min(optimalCols.mobile, 2);
      optimalCols.tablet = Math.min(optimalCols.tablet, 3);
      optimalCols.desktop = Math.min(optimalCols.desktop, 4);
    }

    return optimalCols;
  }, [itemCount]);

  const gapClasses = {
    sm: 'gap-2 md:gap-3',
    md: 'gap-3 md:gap-4',
    lg: 'gap-4 md:gap-6'
  };

  const gridClasses = cn(
    'grid w-full',
    `grid-cols-${gridConfig.mobile}`,
    `md:grid-cols-${gridConfig.tablet}`,
    `lg:grid-cols-${gridConfig.desktop}`,
    gapClasses[gap],
    aspectRatio && `[&>*]:aspect-[${aspectRatio}]`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}
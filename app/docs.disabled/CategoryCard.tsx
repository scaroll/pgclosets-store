'use client';

import Link from 'next/link';
import { colors, typography, spacing, radius, shadows } from '@/lib/design-tokens';
import { FileText, Palette, Wrench, Code } from 'lucide-react';

const iconMap = {
  FileText,
  Palette,
  Wrench,
  Code,
};

interface CategoryCardProps {
  category: {
    icon: keyof typeof iconMap;
    title: string;
    description: string;
    slug: string;
    color: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon];

  return (
    <Link
      href={`/docs/${category.slug}`}
      style={{
        display: 'block',
        padding: spacing['6'],
        backgroundColor: colors.gray[50],
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: radius.xl,
        textDecoration: 'none',
        transition: 'all 150ms ease',
        boxShadow: shadows.sm,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.gray[100];
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.gray[50];
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: spacing['3'],
          backgroundColor: `${category.color}15`,
          borderRadius: radius.lg,
          marginBottom: spacing['4'],
        }}
      >
        <Icon size={24} color={category.color} />
      </div>
      <h3
        style={{
          fontSize: typography.sizes.xl[0],
          fontWeight: typography.weights.semibold,
          color: colors.gray[900],
          marginBottom: spacing['2'],
        }}
      >
        {category.title}
      </h3>
      <p
        style={{
          fontSize: typography.sizes.sm[0],
          color: colors.gray[600],
          lineHeight: typography.lineHeights.relaxed,
        }}
      >
        {category.description}
      </p>
    </Link>
  );
}

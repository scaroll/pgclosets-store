'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '../utils/getNavigation';
import { colors, typography, spacing, radius } from '@/lib/design-tokens';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  navigation: NavigationItem[];
}

function NavItem({ item, depth = 0 }: { item: NavigationItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === `/docs/${item.slug}`;

  // Category item (has children)
  if (hasChildren) {
    return (
      <div style={{ marginBottom: spacing['1'] }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: `${spacing['2']} ${spacing['3']}`,
            paddingLeft: `calc(${spacing['3']} + ${depth * 12}px)`,
            fontSize: typography.sizes.sm[0],
            fontWeight: typography.weights.semibold,
            color: colors.gray[900],
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: radius.md,
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isOpen ? (
            <ChevronDown size={16} style={{ marginRight: spacing['2'], flexShrink: 0 }} />
          ) : (
            <ChevronRight size={16} style={{ marginRight: spacing['2'], flexShrink: 0 }} />
          )}
          {item.title}
        </button>
        {isOpen && (
          <div style={{ marginTop: spacing['1'] }}>
            {item.children?.map((child) => (
              <NavItem key={child.slug} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Page item (link)
  return (
    <Link
      href={`/docs/${item.slug}`}
      style={{
        display: 'block',
        padding: `${spacing['2']} ${spacing['3']}`,
        paddingLeft: `calc(${spacing['3']} + ${depth * 12}px)`,
        fontSize: typography.sizes.sm[0],
        fontWeight: isActive ? typography.weights.medium : typography.weights.regular,
        color: isActive ? colors.brand.navy : colors.gray[700],
        backgroundColor: isActive ? colors.gray[50] : 'transparent',
        borderRadius: radius.md,
        textDecoration: 'none',
        transition: 'all 150ms ease',
        marginBottom: spacing['0.5'],
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = colors.gray[50];
          e.currentTarget.style.color = colors.gray[900];
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = colors.gray[700];
        }
      }}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar({ navigation }: SidebarProps) {
  return (
    <aside
      style={{
        width: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: spacing['6'],
        borderRight: `1px solid ${colors.gray[200]}`,
        overflowY: 'auto',
        backgroundColor: colors.gray[50],
      }}
    >
      <Link
        href="/docs"
        style={{
          display: 'block',
          fontSize: typography.sizes.xl[0],
          fontWeight: typography.weights.bold,
          fontFamily: typography.fonts.display,
          color: colors.gray[900],
          marginBottom: spacing['8'],
          textDecoration: 'none',
        }}
      >
        PG Closets Docs
      </Link>
      <nav>
        {navigation.map((item) => (
          <NavItem key={item.slug} item={item} />
        ))}
      </nav>
    </aside>
  );
}

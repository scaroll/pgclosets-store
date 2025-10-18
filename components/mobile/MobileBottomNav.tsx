'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  ariaLabel: string;
}

interface MobileBottomNavProps {
  cartItemCount?: number;
  className?: string;
}

/**
 * Mobile Bottom Navigation
 * Sticky bottom navigation for key mobile actions
 * - Optimized touch targets (56x56px)
 * - Active state indicators
 * - Safe area inset support
 * - Accessible labels
 */
export function MobileBottomNav({ cartItemCount = 0, className }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: <Home className="w-6 h-6" />,
      label: 'Home',
      ariaLabel: 'Go to home page'
    },
    {
      href: '/products',
      icon: <Search className="w-6 h-6" />,
      label: 'Browse',
      ariaLabel: 'Browse products'
    },
    {
      href: '/cart',
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Cart',
      badge: cartItemCount,
      ariaLabel: cartItemCount > 0
        ? `Shopping cart with ${cartItemCount} items`
        : 'Shopping cart'
    },
    {
      href: '/contact',
      icon: <Phone className="w-6 h-6" />,
      label: 'Contact',
      ariaLabel: 'Contact us'
    },
    {
      href: '/account',
      icon: <User className="w-6 h-6" />,
      label: 'Account',
      ariaLabel: 'Your account'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        // Base styles
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white border-t border-gray-200 shadow-lg",
        // Hide on desktop
        "lg:hidden",
        // Safe area insets for iPhone notch/home indicator
        "pb-[env(safe-area-inset-bottom)]",
        className
      )}
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // Base styles
                "relative flex flex-col items-center justify-center",
                "transition-all duration-200",
                "touch-manipulation select-none",
                // Touch target optimization
                "min-h-[56px] min-w-[56px]",
                // Focus states
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-pg-sky focus-visible:ring-inset",
                // Active state
                active
                  ? "text-pg-navy bg-pg-sky/10"
                  : "text-gray-600 hover:text-pg-navy hover:bg-gray-50",
                // Active indicator animation
                "active:scale-95 active:bg-gray-100"
              )}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              {/* Icon container with badge support */}
              <div className="relative">
                {item.icon}

                {/* Badge for cart count */}
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium mt-1 transition-colors",
                  active ? "text-pg-navy" : "text-gray-600"
                )}
              >
                {item.label}
              </span>

              {/* Active indicator bar */}
              {active && (
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-pg-navy rounded-b-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;

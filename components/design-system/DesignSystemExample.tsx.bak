'use client';

import { useDesignSystem, useResponsive, useAnimation } from '@/lib/design-system-provider';
import { ds } from '@/lib/design-utils';
import { designTokens } from '@/lib/design-tokens';

/**
 * Example component showing design system best practices
 * This is a production-ready product card component
 */
export function ProductCard({
  title,
  description,
  price,
  image,
  badge,
  onQuickView,
  onAddToCart,
}: {
  title: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  onQuickView?: () => void;
  onAddToCart?: () => void;
}) {
  const { theme } = useDesignSystem();
  const { isMobile } = useResponsive();
  const fadeIn = useAnimation('normal');

  return (
    <article
      className={ds.cn(
        'card-interactive group relative overflow-hidden',
        fadeIn.className
      )}
      style={{
        animationDelay: '100ms',
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: ds.color.accent(),
            color: ds.color.text('inverse'),
          }}
        >
          {badge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={onQuickView}
              className="btn-secondary bg-white/90 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              style={{
                minHeight: isMobile ? '44px' : '48px',
              }}
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="p-6"
        style={{
          padding: isMobile ? ds.spacing.md() : ds.spacing.lg(),
        }}
      >
        {/* Title */}
        <h3
          className="heading-4 mb-2"
          style={{
            color: ds.color.text('primary'),
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="body-small mb-4"
          style={{
            color: ds.color.text('secondary'),
            lineHeight: ds.typography.lineHeight('relaxed'),
          }}
        >
          {description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-semibold"
            style={{
              color: ds.color.primary(),
              fontWeight: ds.typography.weight('semibold'),
            }}
          >
            {price}
          </span>

          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="btn-primary"
              style={{
                paddingLeft: isMobile ? ds.spacing.md() : ds.spacing.lg(),
                paddingRight: isMobile ? ds.spacing.md() : ds.spacing.lg(),
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Hero Section using design system
 */
export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  onCTAClick,
}: {
  title: string;
  subtitle: string;
  backgroundImage: string;
  onCTAClick: () => void;
}) {
  const { theme } = useDesignSystem();
  const { isMobile, isDesktop } = useResponsive();

  return (
    <section
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center text-white"
        style={{
          padding: `${ds.spacing['2xl']()} ${ds.spacing.lg()}`,
          maxWidth: isDesktop ? '800px' : '100%',
        }}
      >
        <h1
          className="heading-1 mb-6 animate-fade-in-up"
          style={{
            fontSize: isMobile
              ? designTokens.typography.fontSize['4xl']
              : designTokens.typography.fontSize['6xl'],
            lineHeight: designTokens.typography.lineHeight.tight,
            color: ds.color.text('inverse'),
          }}
        >
          {title}
        </h1>

        <p
          className="body-large mb-8 animate-fade-in-up animation-delay-100"
          style={{
            fontSize: isMobile
              ? designTokens.typography.fontSize.base
              : designTokens.typography.fontSize.lg,
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: ds.spacing.xl(),
          }}
        >
          {subtitle}
        </p>

        <button
          onClick={onCTAClick}
          className="btn-primary bg-white text-black hover:bg-gray-100 animate-fade-in-up animation-delay-200"
          style={{
            padding: `${ds.spacing.md()} ${ds.spacing.xl()}`,
            fontSize: designTokens.typography.fontSize.base,
            fontWeight: designTokens.typography.fontWeight.semibold,
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}

/**
 * Feature Grid using design system grid utilities
 */
export function FeatureGrid({
  features,
}: {
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}) {
  const { isMobile, isTablet } = useResponsive();

  const gridCols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: ds.spacing.lg(),
      }}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="card p-6 text-center animate-fade-in-up"
          style={{
            animationDelay: `${index * 100}ms`,
            padding: ds.spacing.lg(),
          }}
        >
          {/* Icon */}
          <div
            className="mb-4 flex justify-center"
            style={{
              fontSize: '3rem',
              color: ds.color.accent(),
            }}
          >
            {feature.icon}
          </div>

          {/* Title */}
          <h3
            className="heading-4 mb-2"
            style={{
              marginBottom: ds.spacing.sm(),
            }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p
            className="body-regular"
            style={{
              color: ds.color.text('secondary'),
            }}
          >
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Form Component using design system
 */
export function ContactForm() {
  const { theme } = useDesignSystem();
  const { isMobile } = useResponsive();

  return (
    <form
      className="space-y-4"
      style={{
        gap: ds.spacing.md(),
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="body-small font-medium block mb-2"
            style={{
              marginBottom: ds.spacing.sm(),
              color: ds.color.text('primary'),
            }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Your name"
            style={{
              minHeight: isMobile ? '44px' : '48px',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="body-small font-medium block mb-2"
            style={{
              marginBottom: ds.spacing.sm(),
              color: ds.color.text('primary'),
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="your@email.com"
            style={{
              minHeight: isMobile ? '44px' : '48px',
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="body-small font-medium block mb-2"
          style={{
            marginBottom: ds.spacing.sm(),
            color: ds.color.text('primary'),
          }}
        >
          Message
        </label>
        <textarea
          id="message"
          className="textarea"
          rows={5}
          placeholder="How can we help?"
          style={{
            minHeight: '120px',
          }}
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        style={{
          marginTop: ds.spacing.lg(),
        }}
      >
        Send Message
      </button>
    </form>
  );
}
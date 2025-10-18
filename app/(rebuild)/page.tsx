import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { ServicesHighlight } from '@/components/home/ServicesHighlight';
import { LocationSelector } from '@/components/home/LocationSelector';
import { TrustIndicators } from '@/components/home/TrustIndicators';
import { Testimonials } from '@/components/home/Testimonials';
import { ChatAssistant } from '@/components/ai/ChatAssistant';

export const metadata: Metadata = {
  title: 'PG Closets | Elevated Taste Without Pretense | Ottawa\'s Premium Closet Doors',
  description: 'Transform your Ottawa home with sophisticated closet door solutions. Official Renin dealer offering curated collections, professional installation, and lifetime warranty. Elevated taste without pretense.',
  keywords: 'luxury closet doors Ottawa, Renin dealer, premium storage solutions, elevated home design, sophisticated interiors, Ottawa home renovation',
  openGraph: {
    title: 'PG Closets | Elevated Taste Without Pretense',
    description: 'Transform your Ottawa home with sophisticated closet door solutions. Official Renin dealer offering curated collections and professional installation.',
    url: 'https://www.pgclosets.com',
    siteName: 'PG Closets',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Elevated Taste Without Pretense'
      }
    ],
    locale: 'en_CA',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/'
  },
  twitter: {
    title: 'PG Closets | Elevated Taste Without Pretense',
    card: 'summary_large_image',
    description: 'Transform your Ottawa home with sophisticated closet door solutions.',
    images: ['/og-image.jpg'],
  }
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Services Highlight */}
      <ServicesHighlight />

      {/* Location Selector */}
      <LocationSelector />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Testimonials */}
      <Testimonials />

      {/* AI Chat Assistant */}
      <ChatAssistant />
    </>
  );
}

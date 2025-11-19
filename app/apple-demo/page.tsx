'use client'

import {
  AppleHero,
  AppleProductCard,
  AppleProductGrid,
  AppleScrollCarousel,
  AppleNavbar,
  AppleFooter
} from '@/components/apple'

export default function AppleDemoPage() {
  // Product showcase data
  const featuredProducts = [
    {
      title: 'Custom Closets',
      subtitle: 'PRO',
      description: 'Transform your space',
      imageMobile: '/images/closet-mobile.jpg',
      imageDesktop: '/images/closet-desktop.jpg',
      background: '#000000',
      textColor: 'light' as const,
      links: [
        { text: 'Learn more', href: '/products/closets' },
        { text: 'Shop', href: '/store' }
      ]
    },
    {
      title: 'Sliding Doors',
      description: 'Elegance meets function',
      imageMobile: '/images/doors-mobile.jpg',
      imageDesktop: '/images/doors-desktop.jpg',
      background: '#FBFBFD',
      textColor: 'dark' as const,
      links: [
        { text: 'Explore', href: '/products/doors' },
        { text: 'Buy', href: '/store/doors' }
      ]
    },
    {
      title: 'Pantry Systems',
      description: 'Organized living',
      imageMobile: '/images/pantry-mobile.jpg',
      imageDesktop: '/images/pantry-desktop.jpg',
      background: '#FBFBFD',
      textColor: 'dark' as const,
      links: [
        { text: 'Discover', href: '/products/pantry' },
        { text: 'Shop', href: '/store/pantry' }
      ]
    },
    {
      title: 'Hardware Collection',
      subtitle: 'PREMIUM',
      description: 'The finishing touch',
      imageMobile: '/images/hardware-mobile.jpg',
      imageDesktop: '/images/hardware-desktop.jpg',
      background: '#000000',
      textColor: 'light' as const,
      links: [
        { text: 'View collection', href: '/products/hardware' }
      ]
    },
    {
      title: 'Design Services',
      description: 'Expert consultation',
      imageMobile: '/images/design-mobile.jpg',
      imageDesktop: '/images/design-desktop.jpg',
      background: '#FBFBFD',
      textColor: 'dark' as const,
      links: [
        { text: 'Book now', href: '/services/design' },
        { text: 'Learn more', href: '/services' }
      ]
    },
    {
      title: 'Installation',
      description: 'Professional service',
      imageMobile: '/images/install-mobile.jpg',
      imageDesktop: '/images/install-desktop.jpg',
      background: '#FBFBFD',
      textColor: 'dark' as const,
      links: [
        { text: 'Get quote', href: '/services/installation' }
      ]
    }
  ]

  // Carousel data for customer projects
  const projectCarousel = [
    {
      id: '1',
      thumbnail: '/images/project-1.jpg',
      genre: 'WALK-IN CLOSET',
      description: 'Luxury master bedroom transformation',
      buttonText: 'View project',
      buttonLink: '/gallery/project-1'
    },
    {
      id: '2',
      thumbnail: '/images/project-2.jpg',
      genre: 'KITCHEN PANTRY',
      description: 'Modern organized kitchen',
      buttonText: 'View project',
      buttonLink: '/gallery/project-2'
    },
    {
      id: '3',
      thumbnail: '/images/project-3.jpg',
      genre: 'GARAGE STORAGE',
      description: 'Complete garage makeover',
      buttonText: 'View project',
      buttonLink: '/gallery/project-3'
    },
    {
      id: '4',
      thumbnail: '/images/project-4.jpg',
      genre: 'HOME OFFICE',
      description: 'Custom built-in solutions',
      buttonText: 'View project',
      buttonLink: '/gallery/project-4'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Apple-style Navigation */}
      <AppleNavbar
        logo={<span className="text-2xl">🏡</span>}
        items={[
          { label: 'Store', href: '/store' },
          { label: 'Closets', href: '/products/closets' },
          { label: 'Doors', href: '/products/doors' },
          { label: 'Pantry', href: '/products/pantry' },
          { label: 'Hardware', href: '/products/hardware' },
          { label: 'Gallery', href: '/gallery' },
          { label: 'Services', href: '/services' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' }
        ]}
      />

      {/* Add spacing for fixed navbar */}
      <div className="h-[44px] md:h-[44px]" />

      {/* Hero Section */}
      <AppleHero
        title="Custom Closets Reimagined"
        subtitle="Elevate your space. Organize your life."
        background="#FBFBFD"
        textColor="dark"
        imageMobile="/images/hero-mobile.jpg"
        imageDesktop="/images/hero-desktop.jpg"
        links={[
          { text: 'Explore collection', href: '/products' },
          { text: 'Book consultation', href: '/book' }
        ]}
      />

      {/* Secondary Hero - Dark Background */}
      <AppleHero
        title="Premium Hardware"
        subtitle="Every detail matters"
        background="#000000"
        textColor="light"
        imageMobile="/images/hardware-hero-mobile.jpg"
        imageDesktop="/images/hardware-hero-desktop.jpg"
        links={[
          { text: 'Shop hardware', href: '/products/hardware' }
        ]}
      />

      {/* Product Grid */}
      <AppleProductGrid
        products={featuredProducts}
        columns={2}
      />

      {/* Project Carousel */}
      <AppleScrollCarousel
        title="Featured Projects"
        items={projectCarousel}
      />

      {/* Another Hero Section */}
      <AppleHero
        title="Expert Installation"
        subtitle="Professional service, guaranteed results"
        background="#F5F5F7"
        textColor="dark"
        links={[
          { text: 'Learn more', href: '/services/installation' },
          { text: 'Get a quote', href: '/quote' }
        ]}
      />

      {/* Apple Footer */}
      <AppleFooter
        companyName="PG Closets"
        location="Ottawa, Canada"
      />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  title: string
  product_type: string
  price: number
  images: string[]
  tags: string[]
  variants: Array<{
    id: string
    title: string
    price: number
    available: boolean
  }>
}

interface FeaturedProductsResponse {
  success: boolean
  data: Product[]
  pagination?: {
    total: number
    limit: number
  }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products?featured=true&limit=6')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: FeaturedProductsResponse = await response.json()
        if (data.success && data.data) {
          setFeaturedProducts(data.data)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setError('Failed to load featured products')
        // Set fallback products for better UX
        setFeaturedProducts([
          {
            id: '1',
            title: 'Gatsby Chevron Barn Door',
            product_type: 'Barn Door',
            price: 849,
            images: ['/images/doors/barn/gatsby-chevron.jpg'],
            tags: ['modern', 'premium'],
            variants: [{ id: '1', title: 'Standard', price: 849, available: true }]
          },
          {
            id: '2',
            title: 'Euro 1-Lite Bifold Door',
            product_type: 'Bifold Door',
            price: 459,
            images: ['/images/doors/bifold/euro-1-lite.jpg'],
            tags: ['classic', 'affordable'],
            variants: [{ id: '2', title: 'Standard', price: 459, available: true }]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="section-apple bg-gradient-to-br from-pg-offwhite to-white">
        <div className="container-apple">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-micro text-pg-sky">PREMIUM CUSTOM CLOSET DOORS</span>
                <h1 className="text-h1">
                  Transform Your Home with
                  <span className="gradient-text"> Beautiful Closet Doors</span>
                </h1>
                <p className="text-body-l text-pg-gray">
                  Expert installation, premium quality, and stunning designs that enhance your space.
                  Trusted by Ottawa homeowners for over 10 years.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote" className="btn-primary text-center">
                  Get Free Quote
                </Link>
                <Link href="/gallery" className="btn-secondary text-center">
                  View Gallery
                </Link>
              </div>
              <div className="flex items-center space-x-8 text-body-s text-pg-gray">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Expert Installation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>5-Year Warranty</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="card-apple p-0 overflow-hidden">
                <Image
                  src="/images/hero-closet-doors.jpg"
                  alt="Beautiful custom closet doors installation"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-dense bg-white">
        <div className="container-apple">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-h2 text-pg-navy">500+</div>
              <div className="text-body-m text-pg-gray">Happy Homes</div>
            </div>
            <div className="text-center">
              <div className="text-h2 text-pg-navy">10+</div>
              <div className="text-body-m text-pg-gray">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-h2 text-pg-navy">98%</div>
              <div className="text-body-m text-pg-gray">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-h2 text-pg-navy">5★</div>
              <div className="text-body-m text-pg-gray">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-apple bg-pg-offwhite">
        <div className="container-apple">
          <div className="text-center mb-12">
            <span className="text-micro text-pg-sky">POPULAR CHOICES</span>
            <h2 className="text-h2 mt-4 mb-6">Featured Products</h2>
            <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
              Discover our most popular closet door designs, crafted with premium materials and expert attention to detail.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cards gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-apple p-6">
                  <div className="animate-shimmer h-48 rounded-lg mb-4"></div>
                  <div className="animate-shimmer h-4 rounded mb-2"></div>
                  <div className="animate-shimmer h-3 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-body-l text-pg-gray mb-4">{error}</p>
              <Link href="/products" className="btn-primary">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cards gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-apple bg-white">
        <div className="container-apple">
          <div className="text-center mb-12">
            <span className="text-micro text-pg-sky">WHY CHOOSE PG CLOSETS</span>
            <h2 className="text-h2 mt-4 mb-6">Excellence in Every Detail</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-apple p-8 text-center">
              <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pg-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-h3 mb-4">Premium Quality</h3>
              <p className="text-body-m text-pg-gray">
                We use only the finest materials and work with trusted manufacturers to ensure lasting beauty and durability.
              </p>
            </div>
            <div className="card-apple p-8 text-center">
              <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pg-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-h3 mb-4">Expert Installation</h3>
              <p className="text-body-m text-pg-gray">
                Our certified installers ensure perfect fit and finish, with attention to every detail for flawless results.
              </p>
            </div>
            <div className="card-apple p-8 text-center">
              <div className="w-16 h-16 bg-pg-sky/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pg-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-h3 mb-4">Local Service</h3>
              <p className="text-body-m text-pg-gray">
                Proudly serving Ottawa and surrounding areas with personalized service and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-apple bg-pg-offwhite">
        <div className="container-apple">
          <div className="text-center mb-12">
            <span className="text-micro text-pg-sky">CUSTOMER TESTIMONIALS</span>
            <h2 className="text-h2 mt-4 mb-6">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-apple p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-m text-pg-gray mb-4">
                "Absolutely thrilled with our new closet doors! The quality is exceptional and the installation was flawless. Highly recommend PG Closets."
              </p>
              <div>
                <div className="text-body-m font-semibold text-pg-navy">Sarah Mitchell</div>
                <div className="text-body-s text-pg-gray">Kanata</div>
              </div>
            </div>
            <div className="card-apple p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-m text-pg-gray mb-4">
                "Professional service from start to finish. The team was punctual, clean, and the doors look amazing. Worth every penny!"
              </p>
              <div>
                <div className="text-body-m font-semibold text-pg-navy">David Chen</div>
                <div className="text-body-s text-pg-gray">Orleans</div>
              </div>
            </div>
            <div className="card-apple p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-m text-pg-gray mb-4">
                "The consultation was so helpful and the final result exceeded our expectations. Our home looks completely transformed!"
              </p>
              <div>
                <div className="text-body-m font-semibold text-pg-navy">Jennifer Adams</div>
                <div className="text-body-s text-pg-gray">Barrhaven</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-apple bg-gradient-overlay text-white">
        <div className="container-apple text-center">
          <h2 className="text-h2 text-white mb-6">Ready to Transform Your Home?</h2>
          <p className="text-body-l text-gray-200 mb-8 max-w-2xl mx-auto">
            Get started with a free consultation and discover how beautiful custom closet doors can enhance your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="btn-primary bg-white text-pg-navy hover:bg-gray-100">
              Get Free Quote
            </Link>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-pg-navy">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="card-apple group overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={product.images[0] || '/images/placeholder-door.jpg'}
          alt={product.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-body-l font-semibold text-pg-navy group-hover:text-pg-sky transition-colors">
            {product.title}
          </h3>
          <span className="text-body-m font-bold text-pg-navy">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-body-s text-pg-gray mb-4">{product.product_type}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-pg-sky/10 text-pg-navy text-micro rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/products/${product.id}`}
          className="btn-primary w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
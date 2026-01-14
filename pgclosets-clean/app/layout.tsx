import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pgclosets.com'),
  title: 'PG Closets - Premium Custom Closet Doors | Ottawa',
  description: 'Transform your home with premium custom closet doors in Ottawa. Expert installation, quality craftsmanship, and beautiful designs that enhance your space.',
  keywords: 'closet doors, custom closets, Ottawa, premium doors, interior doors, barn doors, bifold doors',
  openGraph: {
    title: 'PG Closets - Premium Custom Closet Doors | Ottawa',
    description: 'Transform your home with premium custom closet doors in Ottawa. Expert installation, quality craftsmanship, and beautiful designs.',
    url: 'https://pgclosets.com',
    siteName: 'PG Closets',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Closets - Premium Custom Closet Doors | Ottawa',
    description: 'Transform your home with premium custom closet doors in Ottawa.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      nocache: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#243c74" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-pg-offwhite">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <PerformanceMonitor />
      </body>
    </html>
  )
}

function Navigation() {
  return (
    <nav className="nav-apple sticky top-0 z-50">
      <div className="container-apple h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-h3 text-pg-navy font-bold">
              PG Closets
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/products" className="text-body-m text-pg-dark hover:text-pg-navy transition-colors">
                Products
              </a>
              <a href="/gallery" className="text-body-m text-pg-dark hover:text-pg-navy transition-colors">
                Gallery
              </a>
              <a href="/about" className="text-body-m text-pg-dark hover:text-pg-navy transition-colors">
                About
              </a>
              <a href="/contact" className="text-body-m text-pg-dark hover:text-pg-navy transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/quote" className="btn-primary">
              Get Quote
            </a>
            <button className="md:hidden p-2 text-pg-dark">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-pg-navy text-white">
      <div className="container-apple section-dense">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-h3 text-white mb-4">PG Closets</h3>
            <p className="text-body-m text-gray-300 mb-4">
              Transform your home with premium custom closet doors. Expert installation and quality craftsmanship in Ottawa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-body-l font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-body-m text-gray-300">
              <li><a href="/products/barn-doors" className="hover:text-white transition-colors">Barn Doors</a></li>
              <li><a href="/products/bifold-doors" className="hover:text-white transition-colors">Bifold Doors</a></li>
              <li><a href="/products/bypass-doors" className="hover:text-white transition-colors">Bypass Doors</a></li>
              <li><a href="/products/pivot-doors" className="hover:text-white transition-colors">Pivot Doors</a></li>
              <li><a href="/products/hardware" className="hover:text-white transition-colors">Hardware</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-l font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-body-m text-gray-300">
              <li><a href="/services/consultation" className="hover:text-white transition-colors">Consultation</a></li>
              <li><a href="/services/installation" className="hover:text-white transition-colors">Installation</a></li>
              <li><a href="/services/custom-design" className="hover:text-white transition-colors">Custom Design</a></li>
              <li><a href="/services/measurement" className="hover:text-white transition-colors">Measurement</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-body-l font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-body-m text-gray-300">
              <li>Ottawa, ON</li>
              <li>info@pgclosets.com</li>
              <li>(613) 555-0123</li>
              <li>Mon-Fri: 8am-6pm</li>
              <li>Sat: 9am-4pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-body-s text-gray-400">
          <p>&copy; 2024 PG Closets. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

function PerformanceMonitor() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
      Performance: Monitoring Core Web Vitals
    </div>
  )
}
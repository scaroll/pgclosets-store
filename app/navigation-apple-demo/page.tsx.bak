/**
 * Apple Navigation Demo Page
 *
 * Showcases the premium Apple-style navigation with:
 * - Glass morphism effects
 * - Smooth scroll behavior
 * - Mega menu
 * - Mobile drawer
 * - Search integration
 */

import { AppleNavigation } from "@/components/navigation/AppleNavigation"

export const metadata = {
  title: "Apple Navigation Demo | PG Closets",
  description: "Premium Apple-style navigation system with glass morphism and smooth interactions",
}

export default function AppleNavigationDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AppleNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 font-cormorant">
            Apple-Style Navigation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Premium navigation component with glass morphism, smooth scroll effects,
            mega menu, mobile drawer, and search integration. Built with Framer Motion
            and Tailwind CSS.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            title="Glass Morphism"
            description="Beautiful backdrop blur effect that appears on scroll, creating depth and visual hierarchy"
            icon="✨"
          />
          <FeatureCard
            title="Scroll Behavior"
            description="Intelligent header that hides when scrolling down and shows when scrolling up"
            icon="📜"
          />
          <FeatureCard
            title="Mega Menu"
            description="Organized dropdown menu for products and services with smooth animations"
            icon="📋"
          />
          <FeatureCard
            title="Mobile Drawer"
            description="Slide-out navigation optimized for thumb reach and mobile interactions"
            icon="📱"
          />
          <FeatureCard
            title="Search Integration"
            description="Full-screen search overlay with keyboard shortcuts (⌘K)"
            icon="🔍"
          />
          <FeatureCard
            title="Accessibility"
            description="WCAG AA compliant with keyboard navigation and screen reader support"
            icon="♿"
          />
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cormorant">
            Technical Implementation
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Key Technologies
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Framer Motion for smooth animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Apple Design System glass classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>React hooks for state management</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Scroll direction detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Progress indicator on scroll</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Keyboard shortcuts (⌘K for search, Esc to close)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">→</span>
                  <span>Body scroll prevention when overlays open</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="space-y-8 mb-12">
          <DemoSection title="Glass Morphism Effect">
            <p className="text-gray-700 leading-relaxed mb-4">
              The navigation header uses Apple's glass morphism design system. When you scroll
              down the page, the header transforms with a beautiful backdrop blur effect,
              creating depth and visual hierarchy. The glass effect includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Backdrop blur filter for frosted glass appearance</li>
              <li>Subtle saturation adjustment for color enhancement</li>
              <li>Semi-transparent background with carefully tuned opacity</li>
              <li>Border styles that complement the glass effect</li>
            </ul>
          </DemoSection>

          <DemoSection title="Scroll Behavior">
            <p className="text-gray-700 leading-relaxed mb-4">
              The navigation implements intelligent scroll behavior:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Header hides when scrolling down past 100px for maximum content visibility</li>
              <li>Header shows immediately when scrolling up, allowing quick access to navigation</li>
              <li>Smooth animations powered by Framer Motion</li>
              <li>Progress indicator shows reading progress at the bottom of the header</li>
              <li>Utility bar collapses on scroll to save vertical space</li>
            </ul>
          </DemoSection>

          <DemoSection title="Mega Menu">
            <p className="text-gray-700 leading-relaxed mb-4">
              The mega menu provides organized navigation for complex product catalogs:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Hover to reveal - desktop users can access menus by hovering</li>
              <li>Click to toggle - mobile and accessibility support</li>
              <li>Organized in categories for easy scanning</li>
              <li>Glass card styling with elevation shadows</li>
              <li>Smooth entrance and exit animations</li>
              <li>Intelligent timeout to prevent accidental closes</li>
            </ul>
          </DemoSection>

          <DemoSection title="Mobile Experience">
            <p className="text-gray-700 leading-relaxed mb-4">
              The mobile drawer is optimized for touch interactions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Slides in from the right side for easy thumb access</li>
              <li>Full-height drawer with smooth spring animations</li>
              <li>Expandable sections for products and services</li>
              <li>Backdrop overlay to focus attention on the menu</li>
              <li>Touch-friendly targets (44x44px minimum)</li>
              <li>Body scroll prevention while drawer is open</li>
            </ul>
          </DemoSection>

          <DemoSection title="Search Overlay">
            <p className="text-gray-700 leading-relaxed mb-4">
              Full-screen search experience with keyboard shortcuts:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>⌘K (Mac) or Ctrl+K (Windows) to open search</li>
              <li>Escape key to close</li>
              <li>Full-screen overlay with backdrop blur</li>
              <li>Popular searches for quick access</li>
              <li>Auto-focus on search input for immediate typing</li>
            </ul>
          </DemoSection>
        </div>

        {/* Long Content for Scroll Testing */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 font-cormorant">
            Scroll to Test Navigation Behavior
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Scroll down this page to see the navigation header behavior. Notice how the
            header hides when scrolling down and shows when scrolling up. The glass
            morphism effect becomes more pronounced as you scroll.
          </p>

          {Array.from({ length: 15 }).map((_, i) => (
            <ContentBlock key={i} index={i + 1} />
          ))}
        </div>
      </main>
    </div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// Demo Section Component
interface DemoSectionProps {
  title: string
  children: React.ReactNode
}

function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 font-cormorant">
        {title}
      </h2>
      {children}
    </div>
  )
}

// Content Block for Scroll Testing
interface ContentBlockProps {
  index: number
}

function ContentBlock({ index }: ContentBlockProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-cormorant">
        Section {index}
      </h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  )
}

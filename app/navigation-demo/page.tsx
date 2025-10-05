import { Header } from "@/components/navigation"

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Navigation System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Minimal, elegant navigation inspired by Kit and Ace with sticky header,
            mega menu, mobile drawer, and search overlay.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            title="Sticky Header"
            description="Smooth scroll effect with backdrop blur and shadow on scroll"
          />
          <FeatureCard
            title="Mega Menu"
            description="Desktop mega menu with organized product categories and quick links"
          />
          <FeatureCard
            title="Mobile Drawer"
            description="Slide-out navigation drawer optimized for thumb navigation"
          />
          <FeatureCard
            title="Search Overlay"
            description="Full-screen search with popular searches and quick links"
          />
          <FeatureCard
            title="Accessibility"
            description="WCAG AA compliant with keyboard navigation and screen reader support"
          />
          <FeatureCard
            title="Performance"
            description="Optimized animations and lazy loading for smooth experience"
          />
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          <DemoSection title="Header Features">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Announcement bar with phone number</li>
              <li>Logo with wordmark</li>
              <li>Desktop navigation with hover effects</li>
              <li>Search icon with overlay toggle</li>
              <li>Shopping cart with badge</li>
              <li>Mobile menu toggle</li>
              <li>CTA button</li>
            </ul>
          </DemoSection>

          <DemoSection title="Mega Menu">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Hover to reveal product categories</li>
              <li>Organized in clean grid layout</li>
              <li>Smooth transitions and animations</li>
              <li>Intelligent timeout for closing</li>
            </ul>
          </DemoSection>

          <DemoSection title="Mobile Experience">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Slide-out drawer from left</li>
              <li>Backdrop overlay</li>
              <li>Organized navigation sections</li>
              <li>CTA button and contact info</li>
            </ul>
          </DemoSection>

          <DemoSection title="Search Overlay">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Full-screen search experience</li>
              <li>Popular searches suggestions</li>
              <li>Quick links to key pages</li>
              <li>Keyboard shortcuts (Escape to close)</li>
            </ul>
          </DemoSection>
        </div>

        {/* Long content to demonstrate sticky behavior */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Scroll to Test Sticky Header</h2>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Section {i + 1}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function DemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}

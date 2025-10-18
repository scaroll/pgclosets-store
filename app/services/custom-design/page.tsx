import type { Metadata } from "next";
import Image from "next/image";
import StandardLayout from "@/components/layout/StandardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ruler, Palette, Lightbulb, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Design Services | PG Closets Ottawa",
  description: "Work with our design experts to create a custom closet door solution tailored to your space and style. Professional 3D renderings and personalized recommendations.",
};

export default function CustomDesignPage() {
  return (
    <StandardLayout>
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 mb-12">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/custom-closet-design-process.png"
            alt="Custom closet design process"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-800/90" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Custom Design Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Transform your vision into reality with personalized design consultation
            and professional 3D renderings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border rounded-lg p-6">
            <Ruler className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Measure & Assess</h3>
            <p className="text-muted-foreground">
              We visit your space to take precise measurements and understand your
              functional requirements and aesthetic preferences.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <Lightbulb className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">2. Design Concepts</h3>
            <p className="text-muted-foreground">
              Our designers create multiple concepts showcasing different door styles,
              finishes, and configurations tailored to your space.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <Palette className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Refinement</h3>
            <p className="text-muted-foreground">
              We refine your chosen design with detailed material selections, hardware
              options, and 3D renderings for visualization.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <CheckCircle className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">4. Final Approval</h3>
            <p className="text-muted-foreground">
              Review detailed specifications, pricing, and timeline. Once approved,
              we handle fabrication and professional installation.
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Design Service Includes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>In-home consultation and measurement</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Professional 3D renderings</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Multiple design concepts</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Material and finish samples</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Detailed specifications and pricing</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Hardware and accessory recommendations</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Installation timeline planning</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Post-installation support</span>
            </div>
          </div>
        </div>

        {/* Design Process Visuals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">See the Transformation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/before-after-walk-in-renovation.png"
                alt="Before and after walk-in closet renovation"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/custom-closet-lighting-system.png"
                alt="Custom closet lighting design"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-l-4 border-teal-700 bg-teal-50 p-6 mb-12">
          <h3 className="text-xl font-bold mb-2">Design Service Fee</h3>
          <p className="text-muted-foreground mb-4">
            Our custom design service is <strong>complimentary</strong> when you proceed
            with installation. For design-only consultations, a $150 fee applies (fully
            credited if you install within 90 days).
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Design Your Dream Closet?</h2>
          <p className="text-muted-foreground mb-6">
            Book a free consultation and see your space transformed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-measure">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Book Design Consultation
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline">
                View Our Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

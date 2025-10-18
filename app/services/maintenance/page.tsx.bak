import type { Metadata } from "next";
import StandardLayout from "@/components/layout/StandardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrench, Sparkles, Shield, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Maintenance Tips & Care Guide | PG Closets Ottawa",
  description: "Learn how to care for your Renin closet doors and sliding door systems. Professional maintenance tips to keep your doors looking new for years.",
};

export default function MaintenancePage() {
  return (
    <StandardLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Maintenance & Care Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Keep your closet doors looking beautiful and functioning smoothly
            with our professional maintenance tips
          </p>
        </div>

        {/* Quick Tips */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border rounded-lg p-6">
            <Sparkles className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Regular Cleaning</h3>
            <p className="text-muted-foreground mb-4">
              Clean your doors monthly with a soft microfiber cloth and warm water.
              For stubborn marks, use a mild soap solution.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Avoid abrasive cleaners or scouring pads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Wipe in the direction of the grain (wood finishes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Dry immediately to prevent water spots</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <Wrench className="h-12 w-12 text-teal-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Maintenance</h3>
            <p className="text-muted-foreground mb-4">
              Keep tracks clean and well-lubricated for smooth operation.
              Inspect quarterly for optimal performance.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Vacuum tracks monthly to remove dust and debris</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Apply silicone-based lubricant every 6 months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Check roller alignment and tighten screws as needed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Care by Material */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Care by Material Type</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-teal-700 bg-gray-50 p-6">
              <h3 className="text-xl font-bold mb-3">Wood & Wood-Grain Finishes</h3>
              <p className="text-muted-foreground mb-3">
                Our wood and wood-grain doors are finished with durable protective coatings
                but still benefit from gentle care.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use wood-safe cleaners only; test in inconspicuous area first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Avoid prolonged exposure to direct sunlight to prevent fading</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Maintain 40-60% humidity to prevent warping or cracking</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-teal-700 bg-gray-50 p-6">
              <h3 className="text-xl font-bold mb-3">Glass & Mirror Panels</h3>
              <p className="text-muted-foreground mb-3">
                Glass and mirror doors add light and space but require specific cleaning
                techniques to maintain clarity.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use streak-free glass cleaner or vinegar-water solution (1:1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Clean with microfiber cloth in circular motions, then buff dry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Avoid ammonia-based cleaners on mirrors with decorative backing</span>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-teal-700 bg-gray-50 p-6">
              <h3 className="text-xl font-bold mb-3">Painted & Metal Finishes</h3>
              <p className="text-muted-foreground mb-3">
                Painted and metal-finish doors are highly durable but can show fingerprints
                and smudges more readily.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Wipe down weekly with damp microfiber cloth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use mild dish soap for grease or sticky residue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Touch up minor chips with manufacturer-matched paint pens (available upon request)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-teal-700" />
            Common Issues & Solutions
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2">Door is Sticking or Hard to Slide</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Solution:</strong> Clean track thoroughly, check for debris in rollers,
                apply silicone lubricant. If issue persists, roller adjustment may be needed.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Door Has Come Off Track</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Solution:</strong> Lift door gently at angle, align rollers with track,
                and slide back into place. Adjust top guide if needed. Contact us if door
                repeatedly derails.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Squeaking or Grinding Noise</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Solution:</strong> Clean tracks completely, inspect rollers for damage,
                apply fresh lubricant. Persistent noise may indicate worn rollers (covered
                under warranty).
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Gap Between Door and Frame</h4>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Solution:</strong> Minor gaps are normal. Larger gaps may require
                adjusting roller height or checking for settlement in door frame. Schedule
                30-day fit check for professional adjustment.
              </p>
            </div>
          </div>
        </div>

        {/* Warranty Reminder */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <Shield className="h-12 w-12 text-teal-700 shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Your Lifetime Warranty</h3>
              <p className="text-muted-foreground mb-4">
                All PG Closets installations include a lifetime warranty on materials and
                5 years on installation workmanship. This covers:
              </p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Manufacturing defects in door panels and hardware</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Roller and track mechanical failures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Installation adjustments and realignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Finish defects (peeling, chipping beyond normal wear)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Professional Service?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help with adjustments, repairs, or maintenance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Contact Support
              </Button>
            </Link>
            <Link href="/services/warranty">
              <Button size="lg" variant="outline">
                View Warranty Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

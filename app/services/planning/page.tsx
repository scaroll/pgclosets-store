import type { Metadata } from "next";
import StandardLayout from "@/components/layout/StandardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ClipboardList, Users, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Project Planning Services | PG Closets Ottawa",
  description: "Expert project planning to ensure your closet renovation runs smoothly from concept to completion. Timeline coordination, budgeting, and installation scheduling.",
};

export default function PlanningPage() {
  return (
    <StandardLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Project Planning Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial consultation to final installation, we handle every detail
            so your project stays on track and on budget
          </p>
        </div>

        {/* Planning Process */}
        <div className="grid gap-8 mb-12">
          <div className="flex gap-6 items-start">
            <div className="bg-teal-100 rounded-full p-4 shrink-0">
              <ClipboardList className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Initial Assessment</h3>
              <p className="text-muted-foreground">
                We start with a comprehensive assessment of your space, needs, and budget.
                This includes understanding any structural considerations, existing closet
                systems, and your timeline expectations.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-teal-100 rounded-full p-4 shrink-0">
              <Calendar className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Timeline Development</h3>
              <p className="text-muted-foreground">
                We create a detailed project timeline covering design, fabrication, and
                installation phases. Typical projects are completed within 2-3 weeks from
                measurement to installation.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-teal-100 rounded-full p-4 shrink-0">
              <Users className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Team Coordination</h3>
              <p className="text-muted-foreground">
                Our project managers coordinate between our design team, fabrication
                partners (Renin), and installation crew to ensure seamless execution
                at every stage.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-teal-100 rounded-full p-4 shrink-0">
              <Clock className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Installation Scheduling</h3>
              <p className="text-muted-foreground">
                We work around your schedule to minimize disruption. Most installations
                are completed in 4-6 hours with minimal mess and comprehensive cleanup.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white border rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Typical Project Timeline</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">Week 1: Consultation & Measurement</p>
                <p className="text-sm text-muted-foreground">In-home visit, design selection, pricing approval</p>
              </div>
              <span className="text-teal-700 font-bold">Days 1-3</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">Week 2: Fabrication</p>
                <p className="text-sm text-muted-foreground">Custom manufacturing at Renin facilities</p>
              </div>
              <span className="text-teal-700 font-bold">Days 4-14</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">Week 3: Installation</p>
                <p className="text-sm text-muted-foreground">Professional installation and final adjustments</p>
              </div>
              <span className="text-teal-700 font-bold">Day 15-21</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Week 4: Follow-Up</p>
                <p className="text-sm text-muted-foreground">30-day fit check and warranty registration</p>
              </div>
              <span className="text-teal-700 font-bold">Day 30</span>
            </div>
          </div>
        </div>

        {/* Budget Planning */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Budget Transparency</h2>
          <p className="text-muted-foreground mb-4">
            We provide detailed, itemized quotes so you know exactly where your investment
            goes. Our pricing includes:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Premium Renin door panels and hardware</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Professional installation labor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>All mounting hardware and tracks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Post-installation cleanup</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Lifetime warranty on materials</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Start Planning Your Project</h2>
          <p className="text-muted-foreground mb-6">
            Get a free consultation and detailed project timeline
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-measure">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Schedule Consultation
              </Button>
            </Link>
            <Link href="/instant-estimate">
              <Button size="lg" variant="outline">
                Get Instant Estimate
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

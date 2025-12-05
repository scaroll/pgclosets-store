import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SectionHeader } from '@/components/shared/section-header'
import { FeatureCard } from '@/components/shared/feature-card'
import { CTASection } from '@/components/shared/cta-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Wrench,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HardHat,
  Ruler,
  Hammer,
  Drill,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Award,
  ThumbsUp,
  Phone,
  Calendar
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Installation Guide - Professional Closet Door Installation | PG Closets',
  description: 'Comprehensive installation guide for closet doors. Learn about DIY vs professional installation, required tools, safety tips, and expert installation services in Ottawa.',
  keywords: 'closet door installation, barn door installation guide, DIY closet doors, professional installation Ottawa, installation tools, safety precautions',
  openGraph: {
    title: 'Installation Guide - PG Closets Ottawa',
    description: 'Expert installation guide for closet doors. Professional installation services available throughout Ottawa.',
    type: 'website',
  },
}

export default function InstallationGuidePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/optimized-images/custom-closet-design-process.webp"
          alt="Professional Closet Door Installation"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
          <p className="text-apple-13 font-semibold uppercase tracking-wider mb-4 text-white/90">
            Installation Guide
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            Installation Guide
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
            Everything you need to know about closet door installation
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-muted/30 border-b sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <a href="#overview" className="px-4 py-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground apple-transition font-medium">
              Overview
            </a>
            <a href="#tools" className="px-4 py-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground apple-transition font-medium">
              Tools Required
            </a>
            <a href="#safety" className="px-4 py-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground apple-transition font-medium">
              Safety Tips
            </a>
            <a href="#diy-vs-pro" className="px-4 py-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground apple-transition font-medium">
              DIY vs Professional
            </a>
            <a href="#book" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 apple-transition font-medium">
              Book Installation
            </a>
          </div>
        </div>
      </section>

      {/* Installation Overview */}
      <section id="overview" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Installation Overview"
            title="Understanding Closet Door Installation"
            description="A comprehensive guide to the installation process"
          />

          <div className="mt-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                  Installing closet doors requires precision, the right tools, and attention to detail. Whether you're considering a DIY approach or professional installation, understanding the process will help you make the best decision for your project.
                </p>
                <p className="text-lg text-muted-foreground dark:text-apple-dark-text-secondary">
                  The installation process varies depending on the door type—barn doors, bifold doors, sliding doors, and French doors each have unique requirements. Proper installation ensures smooth operation, longevity, and safety.
                </p>
                <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Typical Installation Timeline
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Single Barn Door:</strong> 3-5 hours (DIY) / 1-2 hours (Professional)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Bifold Doors:</strong> 2-4 hours (DIY) / 1-2 hours (Professional)
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Sliding Doors:</strong> 4-6 hours (DIY) / 2-3 hours (Professional)
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/optimized-images/elegant-barn-door-closet.webp"
                  alt="Professional Door Installation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Installation Steps Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    1
                  </div>
                  <CardTitle className="text-xl">Measure & Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Precise measurements and preparation are critical for success
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    2
                  </div>
                  <CardTitle className="text-xl">Prepare Surface</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensure walls are sturdy and ready to support the door system
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    3
                  </div>
                  <CardTitle className="text-xl">Install Hardware</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mount tracks, brackets, and mechanisms with precision
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    4
                  </div>
                  <CardTitle className="text-xl">Hang & Adjust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mount the door and fine-tune for perfect operation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Required Section */}
      <section id="tools" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Equipment"
            title="Tools Required"
            description="Essential tools for a successful installation"
          />

          <div className="mt-12 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Tools */}
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Basic Tools</CardTitle>
                  <CardDescription>Required for most installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Hammer className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Tape Measure</strong>
                        <p className="text-sm text-muted-foreground">25-foot minimum for accurate measurements</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Ruler className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Level</strong>
                        <p className="text-sm text-muted-foreground">4-foot level recommended for proper alignment</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Drill className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Power Drill</strong>
                        <p className="text-sm text-muted-foreground">Cordless drill with driver bits and drill bits</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Screwdrivers</strong>
                        <p className="text-sm text-muted-foreground">Phillips and flathead, various sizes</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Pencil</strong>
                        <p className="text-sm text-muted-foreground">For marking holes and measurements</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Specialized Tools */}
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                    <HardHat className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Specialized Tools</CardTitle>
                  <CardDescription>May be needed for certain installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Stud Finder</strong>
                        <p className="text-sm text-muted-foreground">Essential for locating wall studs</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Circular Saw or Miter Saw</strong>
                        <p className="text-sm text-muted-foreground">For cutting tracks or doors to size</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Socket Wrench Set</strong>
                        <p className="text-sm text-muted-foreground">For tightening hardware bolts</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Clamps</strong>
                        <p className="text-sm text-muted-foreground">To hold components in place during installation</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Safety Glasses & Gloves</strong>
                        <p className="text-sm text-muted-foreground">Personal protective equipment</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Additional Materials */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  Additional Materials You May Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Fasteners</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Wood screws (various sizes)</li>
                      <li>• Wall anchors</li>
                      <li>• Lag bolts (for heavy doors)</li>
                      <li>• Mounting brackets</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Surface Preparation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Wood shims</li>
                      <li>• Sandpaper</li>
                      <li>• Wood filler</li>
                      <li>• Touch-up paint</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Safety & Cleanup</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Drop cloths</li>
                      <li>• Vacuum cleaner</li>
                      <li>• Ladder or step stool</li>
                      <li>• First aid kit</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Precautions Section */}
      <section id="safety" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Stay Safe"
            title="Safety Precautions"
            description="Important safety guidelines for closet door installation"
          />

          <div className="mt-12 max-w-5xl mx-auto">
            {/* Warning Banner */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 rounded-2xl p-6 md:p-8 mb-12">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-12 h-12 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3">Important Safety Notice</h3>
                  <p className="text-lg text-muted-foreground">
                    Closet door installation involves heavy materials, power tools, and working at height. Always prioritize safety and consider professional installation if you're unsure about any aspect of the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-2xl">Before You Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Wear safety glasses</strong> at all times when drilling or cutting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Use work gloves</strong> when handling heavy doors and hardware</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Check for utilities</strong> (electrical wiring, plumbing) before drilling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Clear the work area</strong> of tripping hazards and obstacles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Read all instructions</strong> thoroughly before beginning</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-2xl">During Installation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Get help with heavy doors</strong> - never attempt to lift alone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Use a sturdy ladder</strong> on level ground for overhead work</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Unplug power tools</strong> when changing bits or blades</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Keep children and pets away</strong> from the work area</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Take breaks</strong> to avoid fatigue-related mistakes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Critical Safety Points */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Weight Hazards
                </h4>
                <p className="text-sm text-muted-foreground">
                  Barn doors can weigh 50-100+ lbs. Always use proper lifting techniques and have a helper available. Back injuries are the most common DIY installation injury.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Structural Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Improper mounting can lead to door falls. Always secure hardware to wall studs or use appropriate wall anchors rated for the door weight.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Hidden Utilities
                </h4>
                <p className="text-sm text-muted-foreground">
                  Drilling into electrical wiring or plumbing can cause serious damage or injury. Use a stud finder with utility detection or hire a professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIY vs Professional Comparison Section */}
      <section id="diy-vs-pro" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Make the Right Choice"
            title="DIY vs Professional Installation"
            description="Compare your options to make the best decision"
          />

          <div className="mt-12 max-w-6xl mx-auto">
            {/* Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* DIY Installation */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-base px-4 py-1">
                      DIY Installation
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl">Do It Yourself</CardTitle>
                  <CardDescription className="text-base">
                    For experienced DIYers with the right tools and skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Pros */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <ThumbsUp className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Lower upfront cost (no labor fees)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Work on your own schedule</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Satisfaction of completing the project yourself</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Learn new skills for future projects</span>
                        </li>
                      </ul>
                    </div>

                    <Separator />

                    {/* Cons */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Requires significant time investment (3-6 hours)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Need to purchase or rent specialized tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Risk of costly mistakes or damage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">No warranty on installation workmanship</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Physical demands (heavy lifting, overhead work)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">May void product warranty if installed incorrectly</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-semibold mb-2">Best For:</p>
                        <p className="text-sm text-muted-foreground">
                          Experienced DIYers with proper tools, comfortable with power tools, and willing to invest 4-6 hours on a weekend
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Installation */}
              <Card className="border-2 border-primary bg-primary/5 dark:bg-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="text-base px-4 py-1">
                      Recommended
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl">Professional Installation</CardTitle>
                  <CardDescription className="text-base">
                    Expert installation with warranty and peace of mind
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Pros */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <ThumbsUp className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Expert installation in 1-3 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm"><strong>2-year installation warranty</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Perfect alignment and smooth operation guaranteed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">No tool purchase necessary</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Protects product warranty coverage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Liability insurance protects your home</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Free adjustments and fine-tuning</span>
                        </li>
                      </ul>
                    </div>

                    <Separator />

                    {/* Cons */}
                    <div>
                      <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Additional cost for labor (typically $200-$500)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Schedule around installer availability</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 border border-primary/30">
                        <p className="text-sm font-semibold mb-2">Best For:</p>
                        <p className="text-sm text-muted-foreground">
                          Most homeowners who want guaranteed results, warranty protection, and peace of mind without the time investment and physical demands
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Quick Comparison</CardTitle>
                <CardDescription>At a glance comparison of key factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Factor</th>
                        <th className="text-center py-3 px-4 font-semibold">DIY</th>
                        <th className="text-center py-3 px-4 font-semibold bg-primary/5 dark:bg-primary/10">Professional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Time Required</span>
                        </td>
                        <td className="py-3 px-4 text-center">3-6 hours</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10 font-semibold">1-3 hours</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>Installation Cost</span>
                        </td>
                        <td className="py-3 px-4 text-center">$0 + tools</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10">$200-$500</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span>Warranty</span>
                        </td>
                        <td className="py-3 px-4 text-center">None</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10 font-semibold">2 Years</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span>Quality Guarantee</span>
                        </td>
                        <td className="py-3 px-4 text-center">No</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10 font-semibold">Yes</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>Skill Level Required</span>
                        </td>
                        <td className="py-3 px-4 text-center">Intermediate-Advanced</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10 font-semibold">None</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Help Needed</span>
                        </td>
                        <td className="py-3 px-4 text-center">Yes (1-2 people)</td>
                        <td className="py-3 px-4 text-center bg-primary/5 dark:bg-primary/10 font-semibold">No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Decision Helper */}
            <div className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Should You Hire a Professional?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-600 dark:text-green-400">Choose Professional If:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>You want warranty protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>You lack experience with heavy installations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>You don't own the necessary tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>You value your time and convenience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>You want guaranteed perfect results</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Consider DIY If:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>You have experience with similar projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>You own all necessary tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>You have 4-6 hours available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>You have a helper available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>You're comfortable with potential challenges</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Professional Installation Section */}
      <section id="book" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready for Professional Installation?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Let our expert installers handle everything. Backed by a 2-year installation warranty and our commitment to excellence.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <FeatureCard
                icon={<Award className="w-full h-full" />}
                title="Expert Installation"
                description="Certified professionals with years of experience ensuring perfect results every time"
              />
              <FeatureCard
                icon={<Shield className="w-full h-full" />}
                title="2-Year Warranty"
                description="Comprehensive coverage on all installation workmanship for complete peace of mind"
              />
              <FeatureCard
                icon={<Clock className="w-full h-full" />}
                title="Fast & Convenient"
                description="Most installations completed in 1-3 hours at a time that works for you"
              />
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl">Book Free Consultation</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Schedule your free in-home measurement and get a detailed quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="/book-measure"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary-foreground text-primary rounded-full font-semibold hover:opacity-90 apple-transition text-lg"
                  >
                    Schedule Consultation
                    <Calendar className="w-5 h-5" />
                  </Link>
                  <p className="text-sm text-primary-foreground/70 mt-4 text-center">
                    No obligation • Free measurement • Instant quote
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Call for Immediate Help</CardTitle>
                  <CardDescription>
                    Speak with our installation experts right now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+16135551234"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 apple-transition text-lg"
                  >
                    <Phone className="w-5 h-5" />
                    (613) 555-1234
                  </a>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Mon-Fri: 9AM-6PM • Sat: 10AM-4PM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-12 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Installations Completed</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">2 Year</div>
                  <div className="text-sm text-muted-foreground">Installation Warranty</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection
        title="Have Questions About Installation?"
        description="Our team is here to help you make the best decision for your project"
        ctaText="Book Free Consultation"
        ctaHref="/book-measure"
        secondaryCtaText="View FAQ"
        secondaryCtaHref="/faq"
        backgroundImage="/optimized-images/luxury-walk-in-closet.webp"
      />
    </main>
  )
}

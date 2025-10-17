"use client"

import { AppleCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/AppleCard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import StandardLayout from "@/components/layout/StandardLayout"
import { Award, Users, Shield, Clock, Target, Heart, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

// Company milestones timeline data
const TIMELINE_DATA = [
  {
    year: "2010",
    title: "The Beginning",
    description: "PG Closets founded as a family business with a vision to transform Ottawa homes.",
    icon: "🚀"
  },
  {
    year: "2012",
    title: "Renin Partnership",
    description: "Became official Renin dealer, bringing premium quality doors to Ottawa.",
    icon: "🤝"
  },
  {
    year: "2015",
    title: "100th Installation",
    description: "Celebrated our 100th successful installation and expanded our team.",
    icon: "🎉"
  },
  {
    year: "2018",
    title: "Service Excellence Award",
    description: "Recognized for outstanding customer service in home improvement sector.",
    icon: "🏆"
  },
  {
    year: "2020",
    title: "Digital Innovation",
    description: "Launched online consultation and virtual design services during pandemic.",
    icon: "💻"
  },
  {
    year: "2023",
    title: "500+ Installations",
    description: "Reached milestone of 500+ satisfied customers across Ottawa region.",
    icon: "⭐"
  },
  {
    year: "2025",
    title: "Continued Growth",
    description: "Expanding services and maintaining 98% customer satisfaction rating.",
    icon: "📈"
  }
]

// Team members data
const TEAM_MEMBERS = [
  {
    name: "Peter Graham",
    role: "Founder & CEO",
    image: "/images/team/peter.jpg",
    bio: "With over 15 years in home improvement, Peter founded PG Closets with a vision for quality and service."
  },
  {
    name: "Sarah Mitchell",
    role: "Design Consultant",
    image: "/images/team/sarah.jpg",
    bio: "Sarah brings creative solutions to every project, ensuring perfect fit and style for each client."
  },
  {
    name: "Mike Chen",
    role: "Installation Manager",
    image: "/images/team/mike.jpg",
    bio: "Mike leads our installation team with precision and attention to detail on every project."
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Success",
    image: "/images/team/emily.jpg",
    bio: "Emily ensures every customer has an exceptional experience from consultation to completion."
  }
]

// Values data
const COMPANY_VALUES = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Quality First",
    description: "We partner exclusively with Renin to ensure every product meets the highest standards.",
    color: "blue"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Customer Focus",
    description: "Your satisfaction is our priority. We treat every project with personal attention.",
    color: "green"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Integrity",
    description: "Transparent pricing, honest advice, and standing behind our work with warranty.",
    color: "purple"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Reliability",
    description: "On-time delivery, professional installation, and consistent quality you can trust.",
    color: "orange"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Excellence",
    description: "We strive for perfection in every detail, from consultation to final installation.",
    color: "red"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Community",
    description: "Proud to serve Ottawa families and contribute to our local community.",
    color: "pink"
  }
]

// Stats data
const COMPANY_STATS = [
  { value: "500+", label: "Installations Completed", icon: "🏠" },
  { value: "98%", label: "Customer Satisfaction", icon: "⭐" },
  { value: "15+", label: "Years Experience", icon: "📅" },
  { value: "10yr", label: "Product Warranty", icon: "🛡️" },
]

export default function EnhancedAboutPage() {
  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span>Est. 2010</span>
                <span className="w-1 h-1 bg-blue-400 rounded-full" />
                <span>Family Owned</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ottawa&apos;s Trusted
                <span className="text-blue-600"> Closet Door</span> Specialists
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                For over a decade, PG Closets has been transforming Ottawa homes with premium Renin door systems,
                combining quality craftsmanship with exceptional service that families trust.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {COMPANY_STATS.slice(0, 2).map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Your Project
                </Button>
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <AppleCard variant="elevated" className="p-0 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/about/team-hero.jpg"
                    alt="PG Closets team at work"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </AppleCard>

              {/* Floating stats card */}
              <AppleCard
                variant="glass"
                className="absolute -bottom-6 -left-6 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">A+ Rating</div>
                    <div className="text-sm text-gray-600">Better Business Bureau</div>
                  </div>
                </div>
              </AppleCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to Ottawa&apos;s most trusted closet door specialist
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-600 to-indigo-600" />

            {/* Timeline items */}
            <div className="space-y-12">
              {TIMELINE_DATA.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                >
                  <div className="flex-1">
                    <AppleCard variant={idx % 2 === 0 ? "default" : "glass"} hover className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <div className="text-sm text-blue-600 font-medium mb-1">{item.year}</div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </AppleCard>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
                  </div>

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide every decision and interaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY_VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <AppleCard variant="default" hover className="h-full">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-${value.color}-100 flex items-center justify-center mb-4`}>
                      <div className={`text-${value.color}-600`}>
                        {value.icon}
                      </div>
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </AppleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to transforming your space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <AppleCard variant="glass" hover className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      👤
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </AppleCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Why Ottawa Families Choose PG Closets
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                We combine premium products, expert installation, and personal service to deliver
                exceptional results that transform your home.
              </p>

              <div className="space-y-4">
                {[
                  "Official Renin dealer with access to full product line",
                  "Professional installation by certified experts",
                  "Free in-home consultation and measurement",
                  "Transparent pricing with no hidden fees",
                  "10-year manufacturer warranty on all products",
                  "98% customer satisfaction rating",
                  "Local family business you can trust",
                  "Custom solutions for any space or budget"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Testimonial Card */}
              <AppleCard variant="featured" className="p-8">
                <div className="flex items-start gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-4">
                  &quot;PG Closets transformed our entire home with beautiful barn doors and closet systems.
                  Their attention to detail and customer service is unmatched. Highly recommend!&quot;
                </blockquote>
                <cite className="text-sm text-gray-600 not-italic">
                  — Jennifer M., Kanata
                </cite>
              </AppleCard>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {COMPANY_STATS.slice(2).map((stat, idx) => (
                  <AppleCard key={idx} variant="glass" className="p-6 text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </AppleCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of satisfied Ottawa families who trust PG Closets with their homes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View Our Projects
            </Button>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}
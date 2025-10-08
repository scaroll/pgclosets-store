"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, ChevronRight } from "lucide-react"

const projects = [
  {
    title: "Modern Kanata Master Bedroom",
    location: "Kanata, ON",
    date: "January 2025",
    image: "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    doorType: "Barn Doors",
    neighborhood: "Kanata"
  },
  {
    title: "Barrhaven Condo Walk-In",
    location: "Barrhaven, ON",
    date: "December 2024",
    image: "https://www.renin.com/wp-content/uploads/2019/10/HS215-Bordeaux-Bright-White-Beauty-Room-Image.jpg",
    doorType: "Bypass Doors",
    neighborhood: "Barrhaven"
  },
  {
    title: "Downtown Ottawa Loft",
    location: "Ottawa, ON",
    date: "November 2024",
    image: "https://www.renin.com/wp-content/uploads/2019/10/BF209-Chateau-Bright-White-Beauty-Room-Image.jpg",
    doorType: "Bifold Doors",
    neighborhood: "Ottawa"
  }
]

export function FeaturedProjects() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recent Ottawa Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we've transformed homes across the National Capital Region with professional closet door installations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {project.doorType}
                </div>
                <h3 className="text-lg font-semibold mb-3">{project.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Completed {project.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/gallery">
            <Button size="lg" variant="outline" className="gap-2">
              View Full Project Gallery
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Serving <Link href="/areas/ottawa" className="underline hover:text-foreground">Ottawa</Link>,{" "}
            <Link href="/areas/kanata" className="underline hover:text-foreground">Kanata</Link>,{" "}
            <Link href="/areas/barrhaven" className="underline hover:text-foreground">Barrhaven</Link>,{" "}
            <Link href="/areas/orleans" className="underline hover:text-foreground">Orleans</Link>,{" "}
            <Link href="/areas/nepean" className="underline hover:text-foreground">Nepean</Link>, and surrounding areas
          </p>
        </div>
      </div>
    </section>
  )
}

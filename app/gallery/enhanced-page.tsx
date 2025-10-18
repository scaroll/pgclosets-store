"use client"

import { useState } from "react"
import { AppleCard, CardContent } from "@/components/ui/AppleCard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import StandardLayout from "@/components/layout/StandardLayout"
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download,
  Grid3X3, List, Search, Heart, Share2,
  Star, MapPin, Calendar, Eye, Camera
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Gallery categories
const GALLERY_CATEGORIES = [
  { id: "all", name: "All Projects", count: 48 },
  { id: "bifold", name: "Bifold Doors", count: 12 },
  { id: "bypass", name: "Bypass Doors", count: 10 },
  { id: "barn", name: "Barn Doors", count: 8 },
  { id: "french", name: "French Doors", count: 6 },
  { id: "custom", name: "Custom Solutions", count: 7 },
  { id: "closet-systems", name: "Closet Systems", count: 5 }
]

// Gallery items data
const GALLERY_ITEMS = [
  {
    id: 1,
    category: "bifold",
    title: "Modern Bifold Closet Transformation",
    location: "Kanata",
    date: "January 2024",
    description: "Complete bedroom closet renovation with white panel bifold doors",
    image: "/images/gallery/bifold-1.jpg",
    thumbnail: "/images/gallery/bifold-1-thumb.jpg",
    likes: 234,
    views: 1250,
    products: ["Renin 6-Panel Bifold"],
    roomType: "Master Bedroom",
    style: "Modern",
    featured: true
  },
  {
    id: 2,
    category: "barn",
    title: "Rustic Barn Door Installation",
    location: "Orleans",
    date: "February 2024",
    description: "Beautiful rustic barn door adding character to home office",
    image: "/images/gallery/barn-1.jpg",
    thumbnail: "/images/gallery/barn-1-thumb.jpg",
    likes: 189,
    views: 980,
    products: ["Renin Barn Door System"],
    roomType: "Home Office",
    style: "Rustic",
    featured: true
  },
  {
    id: 3,
    category: "bypass",
    title: "Sleek Bypass Doors",
    location: "Nepean",
    date: "March 2024",
    description: "Modern bypass doors maximizing space in condo bedroom",
    image: "/images/gallery/bypass-1.jpg",
    thumbnail: "/images/gallery/bypass-1-thumb.jpg",
    likes: 156,
    views: 820,
    products: ["Renin Mirror Bypass"],
    roomType: "Bedroom",
    style: "Contemporary",
    featured: false
  },
  // Add more items as needed...
]

// Lightbox Component
function Lightbox({
  item,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: {
  item: any
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}) {
  const [isZoomed, setIsZoomed] = useState(false)

  if (!isOpen || !item) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Content */}
        <div
          className="max-w-7xl w-full mx-auto px-4 flex flex-col lg:flex-row gap-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex-1 relative"
          >
            <div className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
              <Image
                src={item.image}
                alt={item.title}
                width={1200}
                height={800}
                className={`w-full h-auto rounded-lg ${isZoomed ? 'scale-150' : ''} transition-transform duration-300`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>

            {/* Image Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur rounded-full px-4 py-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
              <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Details Panel */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-96 bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {item.date}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{item.description}</p>

            {/* Project Details */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium text-gray-900">{item.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span className="font-medium text-gray-900">{item.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products Used:</span>
                    <span className="font-medium text-gray-900">{item.products.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  {item.likes}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  {item.views}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  4.9
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Similar Look
                </Button>
                <Button variant="outline" className="w-full">
                  Request Consultation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Gallery Grid Component
function GalleryGrid({
  items,
  onItemClick
}: {
  items: any[]
  onItemClick: (item: any) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
        >
          <AppleCard
            variant="link"
            hover
            className="cursor-pointer overflow-hidden group"
            onClick={() => onItemClick(item)}
          >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <Image
                src={item.thumbnail || item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.location}</p>
                </div>
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                  Featured
                </span>
              )}

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors">
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            <CardContent className="pt-4">
              <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{item.roomType}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.likes}
                  </span>
                </div>
              </div>
            </CardContent>
          </AppleCard>
        </motion.div>
      ))}
    </div>
  )
}

export default function EnhancedGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [lightboxItem, setLightboxItem] = useState<any>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Filter items based on category and search
  const filteredItems = GALLERY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Lightbox navigation
  const handleLightboxOpen = (item: any) => {
    const index = filteredItems.findIndex(i => i.id === item.id)
    setLightboxIndex(index)
    setLightboxItem(item)
  }

  const handleLightboxNext = () => {
    const nextIndex = (lightboxIndex + 1) % filteredItems.length
    setLightboxIndex(nextIndex)
    setLightboxItem(filteredItems[nextIndex])
  }

  const handleLightboxPrev = () => {
    const prevIndex = lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1
    setLightboxIndex(prevIndex)
    setLightboxItem(filteredItems[prevIndex])
  }

  return (
    <StandardLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              <span>500+ Completed Projects</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our Work
              <span className="text-blue-600"> Gallery</span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Browse through our portfolio of stunning closet door installations
              and transformations across Ottawa homes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Your Project
              </Button>
              <Button size="lg" variant="outline">
                Download Lookbook
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
              {GALLERY_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                  <span className="ml-1 text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {filteredItems.length > 0 ? (
            <>
              <div className="mb-6 text-gray-600">
                Showing {filteredItems.length} projects
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "all" && ` in ${GALLERY_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
              </div>

              <GalleryGrid
                items={filteredItems}
                onItemClick={handleLightboxOpen}
              />

              {/* Load More */}
              {filteredItems.length >= 8 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Projects
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        item={lightboxItem}
        isOpen={!!lightboxItem}
        onClose={() => setLightboxItem(null)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
        hasNext={lightboxIndex < filteredItems.length - 1}
        hasPrev={lightboxIndex > 0}
      />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your Dream Space?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let us transform your home with premium closet doors and expert installation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              View More Projects
            </Button>
          </div>
        </div>
      </section>
    </StandardLayout>
  )
}
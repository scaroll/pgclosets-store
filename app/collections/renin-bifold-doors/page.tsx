import type { Metadata } from 'next';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";
import CollectionHeroBanner from "@/components/collections/CollectionHeroBanner";
import CollectionBenefits from "@/components/collections/CollectionBenefits";
import ShopByStyle from "@/components/collections/ShopByStyle";
import RoomInspirationGallery from "@/components/collections/RoomInspirationGallery";
import DesignTipsTrends from "@/components/collections/DesignTipsTrends";
import CustomerShowcase from "@/components/collections/CustomerShowcase";
import StyleQuiz from "@/components/collections/StyleQuiz";
import { Badge } from "@/components/ui/badge";
import { Shield, Wrench, Award, Clock, Sparkles } from "lucide-react";
import BifoldProductsClient from "./BifoldProductsClient";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Renin Bifold Doors Collection | PG Closets Ottawa',
  description: 'Premium space-saving Renin bifold closet doors with modern glass designs. Easy-Roll hardware, steel frames, and contemporary styling for Ottawa homes.',
  openGraph: {
    title: 'Renin Bifold Doors Collection | PG Closets Ottawa',
    description: 'Premium space-saving Renin bifold closet doors with modern glass designs. Easy-Roll hardware, steel frames, and contemporary styling for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2020/11/EU3110_Euro-1-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninBifoldDoorsPage() {
  const bifoldDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Bifold Doors'
  );

  // Sample data for the enhanced components
  const benefits = [
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Easy-Roll Hardware System",
      description: "Smooth, quiet operation with premium ball-bearing rollers that glide effortlessly along the track.",
      features: [
        "Premium ball-bearing rollers",
        "Smooth and quiet operation",
        "Low-profile bottom track",
        "Easy installation"
      ],
      highlighted: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Space-Saving Design",
      description: "Enjoy up to 4 inches of additional closet access compared to traditional swing doors.",
      features: [
        "4 inches more access space",
        "Perfect for tight spaces",
        "Folds compactly when open",
        "Ideal for bedrooms and closets"
      ]
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Steel Construction",
      description: "Durable steel frames with high-quality finishes ensure long-lasting performance.",
      features: [
        "Heavy-duty steel frames",
        "Scratch-resistant finishes",
        "Commercial-grade durability",
        "Multiple finish options"
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Installation",
      description: "Designed for hassle-free installation with comprehensive instructions and all hardware included.",
      features: [
        "Pre-drilled mounting holes",
        "All hardware included",
        "Step-by-step instructions",
        "Professional results in hours"
      ]
    }
  ];

  const styles = [
    {
      id: "modern-minimalist",
      name: "Modern Minimalist",
      description: "Clean lines and simple designs for contemporary spaces",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
      productCount: 12,
      trending: true,
      colors: ["#FFFFFF", "#000000", "#808080"],
      features: ["Clean Lines", "Simple Design", "Contemporary"]
    },
    {
      id: "industrial-chic",
      name: "Industrial Chic",
      description: "Bold frames with glass panels for urban loft aesthetics",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      productCount: 8,
      colors: ["#2C3E50", "#95A5A6", "#34495E"],
      features: ["Metal Frames", "Glass Panels", "Urban Style"]
    },
    {
      id: "scandinavian",
      name: "Scandinavian",
      description: "Light and airy designs with natural wood elements",
      image: "https://images.unsplash.com/photo-1618221195710-dd64141fac7a?w=400&h=500&fit=crop",
      productCount: 15,
      trending: true,
      colors: ["#F5F5DC", "#D2B48C", "#8B7355"],
      features: ["Natural Wood", "Light Colors", "Cozy Feel"]
    },
    {
      id: "luxury-glam",
      name: "Luxury Glam",
      description: "Elegant designs with premium materials and sophisticated finishes",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      productCount: 6,
      colors: ["#FFD700", "#C0C0C0", "#4B0082"],
      features: ["Premium Materials", "Elegant Design", "Luxury Finish"]
    }
  ];

  const roomImages = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1554997158-73e748935878?w=600&h=800&fit=crop",
      title: "Master Bedroom Transformation",
      room: "Bedroom",
      style: "Modern",
      products: ["Euro 1-Lite Bifold", "Easy-Roll Hardware"],
      description: "This stunning master bedroom features our Euro 1-Lite bifold doors with iron age finish, creating a perfect blend of functionality and style."
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&h=800&fit=crop",
      title: "Walk-in Closet Makeover",
      room: "Closet",
      style: "Luxury",
      products: ["Mirrored Bifold", "Matte Black Hardware"],
      description: "Elegant mirrored bifold doors make this walk-in closet feel spacious and luxurious."
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop",
      title: "Laundry Room Upgrade",
      room: "Laundry",
      style: "Contemporary",
      products: ["White Bifold", "Chrome Hardware"],
      description: "Clean white bifold doors brighten up this functional laundry space."
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=800&fit=crop",
      title: "Home Office Solution",
      room: "Office",
      style: "Modern",
      products: ["Frosted Glass Bifold", "Brushed Nickel Hardware"],
      description: "Frosted glass provides privacy while allowing natural light to flow through this home office."
    }
  ];

  const trends = [
    {
      id: "1",
      title: "The Rise of Multi-Panel Designs",
      description: "Multi-panel bifold doors are becoming increasingly popular in modern homes, offering versatility and visual interest.",
      image: "https://images.unsplash.com/photo-1554997158-73e748935878?w=600&h=400&fit=crop",
      category: "Design Trends",
      publishedAt: "Oct 2024",
      readTime: "5 min read",
      featured: true
    },
    {
      id: "2",
      title: "Smart Hardware Integration",
      description: "New smart hardware options allow for remote operation and integration with home automation systems.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      category: "Technology",
      publishedAt: "Oct 2024",
      readTime: "3 min read"
    }
  ];

  const tips = [
    {
      id: "1",
      title: "Measuring for Perfect Fit",
      description: "Learn the essential steps for accurate measurements when ordering bifold doors.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      difficulty: "Beginner",
      time: "10 minutes",
      tools: ["Tape Measure", "Level", "Pencil"],
      rating: 4.8
    },
    {
      id: "2",
      title: "Installation Best Practices",
      description: "Professional tips for installing bifold doors like a pro.",
      image: "https://images.unsplash.com/photo-1554997158-73e748935878?w=400&h=300&fit=crop",
      difficulty: "Intermediate",
      time: "2 hours",
      tools: ["Drill", "Screwdriver", "Level"],
      rating: 4.9
    }
  ];

  const projects = [
    {
      id: "1",
      customerName: "Sarah Johnson",
      location: "Ottawa, ON",
      roomType: "Master Bedroom",
      projectDate: "October 2024",
      beforeImage: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1554997158-73e748935878?w=800&h=600&fit=crop",
      testimonial: "The transformation of our master bedroom is incredible! The bifold doors not only look amazing but provide so much more space. The installation was straightforward and the quality exceeded our expectations.",
      rating: 5,
      products: ["Euro 1-Lite Bifold", "Easy-Roll Hardware"],
      tags: ["Modern", "Bedroom", "Makeover"],
      featured: true
    }
  ];

  const quizQuestions = [
    {
      id: "q1",
      question: "What's your primary design style preference?",
      description: "Choose the style that best describes your home aesthetic.",
      options: [
        {
          id: "modern",
          label: "Modern & Minimalist",
          points: { "modern": 10, "minimalist": 8, "contemporary": 6 }
        },
        {
          id: "traditional",
          label: "Traditional & Classic",
          points: { "traditional": 10, "classic": 8, "elegant": 6 }
        },
        {
          id: "industrial",
          label: "Industrial & Urban",
          points: { "industrial": 10, "urban": 8, "contemporary": 6 }
        },
        {
          id: "scandinavian",
          label: "Scandinavian & Natural",
          points: { "scandinavian": 10, "natural": 8, "minimalist": 6 }
        }
      ]
    },
    {
      id: "q2",
      question: "Which material finish appeals to you most?",
      options: [
        {
          id: "wood",
          label: "Natural Wood",
          points: { "scandinavian": 8, "traditional": 6, "natural": 10 }
        },
        {
          id: "metal",
          label: "Metal Frames",
          points: { "industrial": 10, "modern": 8, "urban": 6 }
        },
        {
          id: "glass",
          label: "Glass Panels",
          points: { "modern": 8, "contemporary": 10, "minimalist": 6 }
        },
        {
          id: "mirrored",
          label: "Mirrored Surfaces",
          points: { "luxury": 10, "modern": 8, "glam": 6 }
        }
      ]
    }
  ];

  const quizResults = [
    {
      style: "modern",
      title: "Modern Minimalist",
      description: "Clean lines, simple designs, and a focus on functionality. Perfect for contemporary spaces.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop",
      products: ["Euro 1-Lite Bifold", "Frameless Glass", "Matte Black Hardware"],
      tips: [
        "Keep hardware minimal and sleek",
        "Choose neutral color palettes",
        "Embrace negative space",
        "Focus on clean, straight lines"
      ]
    }
  ];

  return (
    <StandardLayout>
      {/* Hero Banner */}
      <CollectionHeroBanner
        title="Renin Bifold Doors"
        subtitle="Premium Collection"
        description="Maximize your space with elegantly designed bifold doors that combine functionality with modern aesthetics. Featuring innovative Easy-Roll hardware and premium materials."
        backgroundImage="https://www.renin.com/wp-content/uploads/2020/11/EU3110_Euro-1-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg"
        stats={[
          { label: "Products Available", value: `${bifoldDoors.length}+` },
          { label: "Space Saved", value: "4 inches" },
          { label: "Finish Options", value: "6+" }
        ]}
        cta={{
          text: "Explore Collection",
          href: "#products"
        }}
      />

      {/* Benefits Section */}
      <CollectionBenefits benefits={benefits} />

      {/* Shop by Style */}
      <ShopByStyle styles={styles} />

      {/* Room Inspiration Gallery */}
      <RoomInspirationGallery images={roomImages} />

      {/* Products Grid */}
      <section id="products" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Our Bifold Door Collection
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our premium selection of Renin bifold doors, designed to transform any space
            </p>
          </div>

          <BifoldProductsClient
            bifoldDoors={bifoldDoors}
            filters={[
              {
                id: "style",
                label: "Style",
                options: [
                  { id: "modern", label: "Modern", count: 8 },
                  { id: "traditional", label: "Traditional", count: 6 },
                  { id: "contemporary", label: "Contemporary", count: 10 }
                ],
                type: "checkbox"
              },
              {
                id: "finish",
                label: "Finish",
                options: [
                  { id: "matte-white", label: "Matte White", count: 7 },
                  { id: "matte-black", label: "Matte Black", count: 8 },
                  { id: "brushed-nickel", label: "Brushed Nickel", count: 5 }
                ],
                type: "checkbox"
              }
            ]}
          />
        </div>
      </section>

      {/* Design Tips & Trends */}
      <DesignTipsTrends trends={trends} tips={tips} />

      {/* Customer Showcase */}
      <CustomerShowcase projects={projects} />

      {/* Style Quiz */}
      <StyleQuiz questions={quizQuestions} results={quizResults} />
    </StandardLayout>
  );
}

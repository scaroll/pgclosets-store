import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import enhancedProducts from "@/data/enhanced-products.json";
import StandardLayout from "@/components/layout/StandardLayout";
import CollectionHeroBanner from "@/components/collections/CollectionHeroBanner";
import CollectionBenefits from "@/components/collections/CollectionBenefits";
import ShopByStyle from "@/components/collections/ShopByStyle";
import RoomPlanner from "@/components/collections/RoomPlanner";
import MaterialComparison from "@/components/collections/MaterialComparison";
import { Zap, Eye, Shield, Award } from "lucide-react";

// Dynamically import QuickConfigureCard
const QuickConfigureCard = dynamic(
  () => import("@/components/products/QuickConfigureCard").then(mod => ({ default: mod.QuickConfigureCard })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-t-lg mb-4" />
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: 'Renin Bypass Doors Collection | PG Closets Ottawa',
  description: 'Premium Renin bypass closet doors with mirror and glass options. Smooth gliding systems with soft-close technology for Ottawa homes.',
  openGraph: {
    title: 'Renin Bypass Doors Collection | PG Closets Ottawa',
    description: 'Premium Renin bypass closet doors with mirror and glass options. Smooth gliding systems with soft-close technology for Ottawa homes.',
    images: [{
      url: 'https://www.renin.com/wp-content/uploads/2020/11/EU2450_Euro-1-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg',
      width: 1200,
      height: 630,
    }],
  },
};

export default function ReninBypassDoorsPage() {
  const bypassDoors = enhancedProducts.filter(p =>
    p.category === 'Renin Bypass Doors'
  );

  const benefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smooth Gliding System",
      description: "Advanced precision track system ensures effortless operation with soft-close technology for silent closing.",
      features: [
        "Soft-close dampers",
        "Precision aluminum tracks",
        "Anti-jump rollers",
        "Whisper-quiet operation"
      ],
      highlighted: true
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Mirror & Glass Options",
      description: "Choose from mirrored panels for functionality or elegant glass designs for modern aesthetics.",
      features: [
        "Full-length mirrors",
        "Frosted glass options",
        "Custom panel configurations",
        "Safety backing on mirrors"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Space-Efficient Design",
      description: "Perfect for tight spaces where traditional doors won't work. Slides parallel to wall for maximum space utilization.",
      features: [
        "Zero floor clearance",
        "Ideal for closets",
        "Perfect for wardrobes",
        "Space-saving design"
      ]
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Construction",
      description: "Commercial-grade materials ensure durability and long-lasting performance in any setting.",
      features: [
        "Heavy-duty aluminum frames",
        "Scratch-resistant finishes",
        "Commercial warranty",
        "Easy maintenance"
      ]
    }
  ];

  const styles = [
    {
      id: "contemporary",
      name: "Contemporary",
      description: "Sleek designs with clean lines for modern interiors",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=500&fit=crop",
      productCount: 10,
      trending: true,
      colors: ["#FFFFFF", "#000000", "#C0C0C0"],
      features: ["Clean Lines", "Minimalist", "Modern"]
    },
    {
      id: "luxury",
      name: "Luxury",
      description: "Elegant mirrored doors with premium finishes",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
      productCount: 8,
      colors: ["#FFD700", "#C0C0C0", "#4B0082"],
      features: ["Mirrored", "Premium", "Elegant"]
    },
    {
      id: "functional",
      name: "Functional",
      description: "Practical designs focused on space optimization",
      image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&h=500&fit=crop",
      productCount: 12,
      trending: true,
      colors: ["#FFFFFF", "#808080", "#F5F5DC"],
      features: ["Space-Saving", "Practical", "Efficient"]
    }
  ];

  const materials = [
    {
      id: "aluminum",
      name: "Aluminum Frame",
      description: "Lightweight yet durable aluminum frames with premium finishes",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      price: "$450-$800",
      durability: 5,
      maintenance: 5,
      installation: 4,
      pros: ["Lightweight", "Corrosion resistant", "Modern look", "Low maintenance"],
      cons: ["Can dent", "Higher cost"],
      bestFor: ["Modern homes", "Coastal areas", "Contemporary design"],
      features: {
        waterResistant: true,
        soundproof: false,
        ecoFriendly: true,
        paintable: true
      }
    },
    {
      id: "steel",
      name: "Steel Frame",
      description: "Heavy-duty steel frames for maximum durability and security",
      image: "https://images.unsplash.com/photo-1554997158-73e748935878?w=400&h=300&fit=crop",
      price: "$350-$600",
      durability: 5,
      maintenance: 4,
      installation: 3,
      pros: ["Very durable", "Secure", "Affordable", "Long-lasting"],
      cons: ["Heavy", "Can rust if scratched", "Limited styles"],
      bestFor: ["High-traffic areas", "Security needs", "Commercial spaces"],
      features: {
        waterResistant: false,
        soundproof: true,
        ecoFriendly: false,
        paintable: true
      }
    }
  ];

  return (
    <StandardLayout>
      {/* Hero Banner */}
      <CollectionHeroBanner
        title="Renin Bypass Doors"
        subtitle="Space-Efficient Solutions"
        description="Experience the perfect blend of functionality and style with our premium bypass doors. Featuring smooth gliding systems and elegant mirror options for modern living spaces."
        backgroundImage="https://www.renin.com/wp-content/uploads/2020/11/EU2450_Euro-1-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg"
        stats={[
          { label: "Products Available", value: `${bypassDoors.length}+` },
          { label: "Track Systems", value: "3 Types" },
          { label: "Mirror Options", value: "5+" }
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

      {/* Products Grid */}
      <section id="products" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Our Bypass Door Collection
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Premium bypass doors designed for maximum space efficiency and style
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bypassDoors.map((product) => (
              <QuickConfigureCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Room Planner */}
      <RoomPlanner />

      {/* Material Comparison */}
      <MaterialComparison materials={materials} />
    </StandardLayout>
  );
}

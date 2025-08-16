import { HeroWithForm } from "@/components/sections/HeroWithForm"
import { FeaturedProducts } from "@/components/store/featured-products"
import { CategoryShowcase } from "@/components/store/category-showcase"
import { TrustSignals } from "@/components/store/trust-signals"
import { ExitIntentPopup } from "@/components/popups/ExitIntentPopup"
import { reninProducts } from "@/lib/renin-products"

export default function StorePage() {
  // Get featured products from Renin database
  const featuredProducts = reninProducts.getFeaturedProducts()
  
  // If no featured products, show all barn doors
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : reninProducts.getBarnDoors().slice(0, 6)

  // Create mock categories for showcase
  const categories = [
    {
      id: "barn-doors",
      name: "Barn Doors",
      slug: "barn-doors",
      description: "Complete barn door kits with track and hardware",
      image_url: "/renin_images/barn_doors/herringbone-chevron-main.jpg"
    },
    {
      id: "hardware",
      name: "Hardware",
      slug: "hardware", 
      description: "Professional-grade tracks, handles, and accessories",
      image_url: "/renin_images/hardware/standard-track-6ft-main.jpg"
    },
    {
      id: "installation",
      name: "Installation",
      slug: "installation",
      description: "Professional installation services",
      image_url: "/modern-walk-in-closet-barn-doors.png"
    }
  ]

  return (
    <>
      <div className="space-y-16">
        <HeroWithForm />
        <FeaturedProducts products={productsToShow} />
        <CategoryShowcase categories={categories} />
        <TrustSignals />
      </div>
      <ExitIntentPopup 
        enabled={true}
        delay={10000} // Show after 10 seconds on page
        showOnce={true}
      />
    </>
  )
}

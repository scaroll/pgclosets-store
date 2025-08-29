import { Button } from "../ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-pg-navy to-pg-sky text-white py-24">
      <div className="absolute inset-0 bg-black/20" />

      <div className="container-apple relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Premium Closet Doors
            <span className="block text-pg-sky/90">Made in Canada</span>
          </h1>

          <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
            Shop our complete collection of Renin closet doors with professional installation and lifetime warranty
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              href="/store/products"
              className="bg-white text-pg-navy hover:bg-gray-100"
            >
              Shop All Products
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/contact"
              className="border-white text-white hover:bg-white hover:text-pg-navy"
            >
              Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

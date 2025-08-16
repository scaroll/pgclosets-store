import Link from "next/link"

export function StoreFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PG</span>
              </div>
              <span className="font-bold text-xl text-foreground">PG Closets</span>
            </div>
            <p className="text-muted-foreground">
              Premium closet systems and barn doors crafted with exceptional quality for discerning homeowners.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Products</h3>
            <div className="space-y-2">
              <Link
                href="/store/products?category=barn-doors"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Barn Doors
              </Link>
              <Link
                href="/store/products?category=closet-systems"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Closet Systems
              </Link>
              <Link
                href="/store/products?category=hardware"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Hardware
              </Link>
              <Link
                href="/store/products?category=accessories"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Accessories
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <div className="space-y-2">
              <Link href="/store/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link
                href="/store/inspiration"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Inspiration
              </Link>
              <Link href="/store/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/store/warranty" className="block text-muted-foreground hover:text-primary transition-colors">
                Warranty
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="space-y-2">
              <Link href="/store/shipping" className="block text-muted-foreground hover:text-primary transition-colors">
                Shipping Info
              </Link>
              <Link href="/store/returns" className="block text-muted-foreground hover:text-primary transition-colors">
                Returns
              </Link>
              <Link
                href="/store/installation"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Installation
              </Link>
              <Link href="/store/faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 PG Closets. All rights reserved. Crafted with care in Ottawa, Ontario.</p>
        </div>
      </div>
    </footer>
  )
}

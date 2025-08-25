import { TrustBadges, ProductTrustIndicators } from '@/components/trust/trust-badges';
import { ProductReviews } from '@/components/reviews/product-reviews';
import { EnhancedHeroWithTrust } from '@/components/sections/enhanced-hero-with-trust';
import DoorConfigurator from '@/components/configurator/door-configurator';

export default function DemoTrustSignalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section with Trust Signals */}
      <EnhancedHeroWithTrust />
      
      {/* Trust Badges Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-navy-700 mb-4">
              Why Ottawa Trusts <strong className="text-sky-600">PG Closets</strong>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Over 500 satisfied customers across Ottawa and surrounding areas trust us 
              with their closet transformations.
            </p>
          </div>
          
          <TrustBadges />
        </div>
      </section>
      
      {/* Door Configurator Section */}
      <section className="py-16 bg-cream">
        <DoorConfigurator />
      </section>
      
      {/* Product Trust Indicators Demo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-light text-navy-700 mb-8">
                Premium <strong className="text-sky-600">Barn Door Collection</strong>
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    name: 'Gatsby Chevron Barn Door',
                    price: 849,
                    salePrice: 679,
                    image: '/images/doors/barn/gatsby-chevron.jpg'
                  },
                  {
                    name: 'Heritage Herringbone Door',
                    price: 749,
                    image: '/images/doors/barn/heritage-herringbone.jpg'
                  }
                ].map((product, index) => (
                  <div key={index} className="product-card bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="product-card__image w-full h-full object-cover"
                      />
                    </div>
                    <div className="product-card__content p-6">
                      <h3 className="product-card__title text-xl font-medium text-navy-700 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        {product.salePrice && (
                          <span className="text-2xl font-light text-red-600">${product.salePrice}</span>
                        )}
                        <span className={`text-lg ${product.salePrice ? 'line-through text-gray-400' : 'text-2xl font-light text-navy-600'}`}>
                          ${product.price}
                        </span>
                      </div>
                      <button className="btn btn-primary w-full bg-navy hover:bg-navy-dark text-white">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Trust Indicators */}
            <div className="lg:col-span-1">
              <ProductTrustIndicators productId="gatsby-chevron" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ProductReviews productId="gatsby-chevron" />
        </div>
      </section>
      
      {/* Final CTA with Trust */}
      <section className="py-16 bg-gradient-to-r from-navy-600 to-navy-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">
            Ready to Transform Your <strong className="text-sky-300">Closets</strong>?
          </h2>
          <p className="text-sky-100 text-xl mb-8 max-w-2xl mx-auto">
            Join 500+ satisfied customers with our lifetime warranty and professional installation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 text-lg">
              Get Free Quote Today
            </button>
            <button className="btn btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 px-8 py-4 text-lg">
              Call (613) 262-2604
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
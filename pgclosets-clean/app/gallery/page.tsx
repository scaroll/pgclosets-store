import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: "Modern Barn Door Installation",
    description: "Heritage Collection barn door installation in contemporary Ottawa home",
    location: "Kanata, ON",
    image: "https://cdn.renin.com/gallery/heritage-barn-door-installed.jpg",
    category: "Barn Doors"
  },
  {
    id: 2,
    title: "Continental Glass Doors",
    description: "Sleek 5-lite glass door installation for modern office space",
    location: "Downtown Ottawa, ON",
    image: "https://cdn.renin.com/gallery/continental-glass-installed.jpg",
    category: "Glass Doors"
  },
  {
    id: 3,
    title: "Bypass Closet System",
    description: "Complete bypass door system for master bedroom walk-in closet",
    location: "Orleans, ON",
    image: "https://cdn.renin.com/gallery/bypass-system-installed.jpg",
    category: "Bypass Doors"
  },
  {
    id: 4,
    title: "Bifold Door Renovation",
    description: "Euro-style bifold doors transforming small space efficiency",
    location: "Centretown, ON",
    image: "https://cdn.renin.com/gallery/bifold-renovation.jpg",
    category: "Bifold Doors"
  }
]

const categories = ["All", "Barn Doors", "Glass Doors", "Bypass Doors", "Bifold Doors"]

export default function GalleryPage() {
  return (
    <div className="container-apple section-apple">
      <div className="text-center mb-16">
        <h1 className="text-h1 mb-6">Project Gallery</h1>
        <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
          Explore our recent installations across Ottawa. From modern barn doors to elegant glass systems,
          see how we transform spaces with quality craftsmanship.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            className="filter-button filter-button--active"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="product-grid">
        {projects.map((project) => (
          <div key={project.id} className="card-apple">
            <div className="product-image-container aspect-square mb-4">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="product-image-overlay">
                <div className="product-image-overlay-content">
                  View Details
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="product-badge product-badge--category">
                  {project.category}
                </span>
                <span className="text-micro text-pg-gray">
                  {project.location}
                </span>
              </div>
              <h3 className="text-h3 mb-2 product-title">
                {project.title}
              </h3>
              <p className="text-body-m product-description">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="card-apple p-8 max-w-2xl mx-auto">
          <h2 className="text-h2 mb-4">Ready to Transform Your Space?</h2>
          <p className="text-body-m text-pg-gray mb-6">
            Let's discuss your project and create a custom solution that fits your style and space perfectly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote" className="btn-primary">
              Get Free Quote
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Gallery - PG Closets Custom Door Installations | Ottawa',
  description: 'View our gallery of custom closet door installations across Ottawa. Barn doors, glass doors, bypass and bifold systems with professional craftsmanship.',
}
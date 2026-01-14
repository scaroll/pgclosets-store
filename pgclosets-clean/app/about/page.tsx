import Image from 'next/image'

const teamMembers = [
  {
    name: "Paul Gardner",
    role: "Founder & Lead Designer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "With over 15 years in custom millwork, Paul founded PG Closets to bring premium door solutions to Ottawa homeowners."
  },
  {
    name: "Sarah Martinez",
    role: "Installation Manager",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400&h=400&fit=crop&crop=face",
    bio: "Sarah ensures every installation meets our exacting standards with precision and attention to detail."
  },
  {
    name: "Mike Thompson",
    role: "Senior Craftsman",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    bio: "Mike brings decades of woodworking expertise to every custom project and complex installation."
  }
]

export default function AboutPage() {
  return (
    <div className="container-apple">
      {/* Hero Section */}
      <section className="section-apple text-center">
        <h1 className="text-h1 mb-6">About PG Closets</h1>
        <p className="text-body-l text-pg-gray max-w-3xl mx-auto mb-8">
          Since 2010, we've been Ottawa's trusted partner for premium custom closet doors.
          From our family workshop to your home, we bring craftsmanship, quality, and personalized service
          to every project.
        </p>
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop"
            alt="PG Closets workshop"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="section-dense">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-h2 mb-6">Our Story</h2>
            <div className="space-y-4 text-body-m text-pg-dark">
              <p>
                What started as a small family business has grown into Ottawa's most trusted name
                in premium door systems. Paul Gardner, our founder, began PG Closets with a simple
                mission: to provide homeowners with beautiful, functional closet doors that enhance
                both form and function.
              </p>
              <p>
                Today, we're proud to be the official Renin dealer for the Ottawa region, offering
                the finest selection of barn doors, bypass systems, bifold doors, and custom hardware.
                Every project receives our personal attention, from initial consultation through final
                installation.
              </p>
              <p>
                We believe that great doors are more than just functional—they're design elements
                that can transform your space and enhance your daily life. That's why we work closely
                with each client to understand their style, space, and specific needs.
              </p>
            </div>
          </div>
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
              alt="Craftsman working on door"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-dense bg-pg-offwhite rounded-lg p-8">
        <h2 className="text-h2 text-center mb-12">What Drives Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-h3 mb-3">Quality First</h3>
            <p className="text-body-m text-pg-gray">
              We partner exclusively with Renin, Canada's premier door manufacturer, to ensure
              every product meets the highest standards of excellence and durability.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-h3 mb-3">Personal Service</h3>
            <p className="text-body-m text-pg-gray">
              As a family business, we treat every customer like family, providing personalized
              attention and care throughout your entire project journey.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pg-navy rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-h3 mb-3">Local Focus</h3>
            <p className="text-body-m text-pg-gray">
              We're proud to call Ottawa home and are committed to serving our community with
              integrity, excellence, and lasting relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-apple">
        <h2 className="text-h2 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-h3 mb-1">{member.name}</h3>
              <p className="text-body-s text-pg-sky mb-3 font-semibold">{member.role}</p>
              <p className="text-body-m text-pg-gray">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dense">
        <div className="card-apple p-8 text-center">
          <h2 className="text-h2 mb-4">Ready to Work Together?</h2>
          <p className="text-body-l text-pg-gray mb-6 max-w-2xl mx-auto">
            Experience the PG Closets difference for yourself. Let's create something beautiful
            and functional for your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote" className="btn-primary">
              Get Free Quote
            </a>
            <a href="/contact" className="btn-secondary">
              Schedule Visit
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: 'About Us - PG Closets Custom Door Specialists | Ottawa',
  description: 'Learn about PG Closets, Ottawa\'s trusted custom closet door specialists since 2010. Family-owned business providing quality craftsmanship and personalized service.',
}
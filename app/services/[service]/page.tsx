import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getServiceBySlug,
  getServiceSlugs,
  testimonials as allTestimonials
  // galleryItems as allGalleryItems
} from '@/lib/services';
import {
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Star,
  Phone,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Temporarily disabled - export async function generateStaticParams() {
//   const slugs = getServiceSlugs();
//   return slugs.map((slug) => ({
//     service: slug,
//   }));
// }

export async function generateMetadata({
  params
}: {
  params: { service: string }
}): Promise<Metadata> {
  const service = getServiceBySlug(params.service);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: `${service.name} | PG Closets Ottawa`,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      images: [service.heroImage],
    },
  };
}

export default function ServicePage({
  params
}: {
  params: { service: string }
}) {
  const service = getServiceBySlug(params.service);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const serviceTestimonials = allTestimonials.filter(t => t.service === service.slug);
  // const serviceGallery = allGalleryItems.filter(g => g.service === service.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Service Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {service.title}
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {service.longDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link href="/book">
                      {service.callToAction}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                  >
                    <Link href="tel:+16137016393">
                      <Phone className="mr-2 w-5 h-5" />
                      Call (613) 701-6393
                    </Link>
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="mt-8 flex flex-wrap gap-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{service.availability}</span>
                  </div>
                  {service.pricing.starting > 0 && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span>From ${service.pricing.starting}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Our simple, transparent process ensures a smooth experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connection Line */}
                  {index < service.process.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300 z-0" />
                  )}

                  <Card className="relative z-10 h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                        {step.number}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      {step.duration && (
                        <Badge variant="secondary" className="mt-2">
                          {step.duration}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our {service.name}
              </h2>
              <p className="text-xl text-gray-600">
                Experience the PG Closets difference
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/book">
                  Book Your {service.name} Today
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                No hidden fees, no surprises
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Starting From</p>
                    <p className="text-4xl font-bold text-gray-900">
                      ${service.pricing.starting}
                    </p>
                    {service.pricing.unit && (
                      <p className="text-sm text-gray-600 mt-1">
                        {service.pricing.unit}
                      </p>
                    )}
                  </div>

                  {service.pricing.average > 0 && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">Average Cost</p>
                      <p className="text-4xl font-bold text-blue-600">
                        ${service.pricing.average}
                      </p>
                      {service.pricing.unit && (
                        <p className="text-sm text-gray-600 mt-1">
                          {service.pricing.unit}
                        </p>
                      )}
                    </div>
                  )}

                  {service.pricing.high && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">Premium Options</p>
                      <p className="text-4xl font-bold text-gray-900">
                        ${service.pricing.high}
                      </p>
                      {service.pricing.unit && (
                        <p className="text-sm text-gray-600 mt-1">
                          {service.pricing.unit}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {service.pricing.factors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Pricing Factors
                    </h3>
                    <div className="space-y-3">
                      {service.pricing.factors.map((factor, index) => (
                        <div key={index} className="flex items-start">
                          <Badge
                            variant={
                              factor.impact === 'high' ? 'destructive' :
                              factor.impact === 'medium' ? 'secondary' :
                              'outline'
                            }
                            className="mr-3 mt-0.5"
                          >
                            {factor.impact}
                          </Badge>
                          <div>
                            <p className="font-medium text-gray-900">
                              {factor.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {factor.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {service.pricing.disclaimer && (
                  <p className="text-sm text-gray-600 mt-6 p-4 bg-gray-50 rounded-lg">
                    {service.pricing.disclaimer}
                  </p>
                )}

                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link href="/quote">
                      Get Your Free Quote
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {serviceTestimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-xl text-gray-600">
                  Real experiences from real customers
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceTestimonials.slice(0, 3).map((testimonial) => (
                  <Card key={testimonial.id} className="h-full">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {testimonial.location}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 italic">
                        "{testimonial.text}"
                      </p>
                      <p className="text-sm text-gray-500 mt-4">
                        {new Date(testimonial.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our {service.name.toLowerCase()}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Take the first step towards your dream closet today
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/book">
                  {service.callToAction}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/quote">
                  Get Instant Quote
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-blue-100">
              Or call us directly at{' '}
              <a href="tel:+16137016393" className="font-semibold text-white underline">
                (613) 701-6393
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}